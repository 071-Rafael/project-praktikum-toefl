<script>
  import { onMount, onDestroy } from 'svelte';
  import {
    examSessionInfo,
    examQuestions,
    getActiveSessionData,
    getQuestionsBySession,
    getUserStorageKey
  } from '../../../lib/data/examQuestions.js';

  let sidebarLogoUrl = '/logo-sidebar.png';
  let listeningBoxLogoUrl = '/logo-listening.png';

  let sidebarLogoError = $state(false);
  let listeningBoxLogoError = $state(false);

  let activeSession = $state({ ...examSessionInfo });
  let questionList = $state([...examQuestions]);

  let currentQuestionIndex = $state(0);
  let selectedAnswers = $state({});
  let remainingSeconds = $state(3569);
  let timerInterval = null;

  let showFinishConfirmModal = $state(false);

  let audioElement = $state(null);
  let isPlayingAudio = $state(false);
  let audioProgress = $state(0);
  let audioTimeText = $state('00:00 / 1:50');

  let currentQuestion = $derived(questionList[currentQuestionIndex] || null);

  let formattedTimer = $derived.by(() => {
    const hrs = String(Math.floor(remainingSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((remainingSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(remainingSeconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  });

  let progressPercent = $derived.by(() => {
    const total = activeSession.totalQuestions || questionList.length || 1;
    if (currentQuestionIndex === 0) return 5;
    return Math.min(100, Math.round(((currentQuestionIndex + 1) / total) * 100));
  });

  onMount(() => {
    const sessionData = getActiveSessionData();
    activeSession = sessionData;

    const loadedQuestions = getQuestionsBySession(sessionData.id);
    questionList = loadedQuestions;

    if (sessionData.durationMinutes && sessionData.durationMinutes !== 60) {
      remainingSeconds = sessionData.durationMinutes * 60;
    }

    const savedAnswers = localStorage.getItem(
      getUserStorageKey(`toefl_exam_answers_${sessionData.id}`)
    );
    if (savedAnswers) {
      try {
        selectedAnswers = JSON.parse(savedAnswers);
      } catch (e) {
        selectedAnswers = {};
      }
    }

    timerInterval = setInterval(() => {
      if (remainingSeconds > 0) {
        remainingSeconds -= 1;
      } else {
        confirmAndSubmitExam();
      }
    }, 1000);
  });

  onDestroy(() => {
    if (timerInterval) clearInterval(timerInterval);
  });

  function formatTime(sec) {
    if (!sec || isNaN(sec)) return '00:00';
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(Math.floor(sec % 60)).padStart(2, '0');
    return `${m}:${s}`;
  }

  function toggleAudio() {
    if (!audioElement) return;
    if (isPlayingAudio) {
      audioElement.pause();
      isPlayingAudio = false;
    } else {
      audioElement
        .play()
        .then(() => {
          isPlayingAudio = true;
        })
        .catch(() => {
          isPlayingAudio = !isPlayingAudio;
          audioProgress = isPlayingAudio ? 40 : 18;
        });
    }
  }

  function handleTimeUpdate() {
    if (!audioElement || !audioElement.duration) return;
    audioProgress = (audioElement.currentTime / audioElement.duration) * 100;
    audioTimeText = `${formatTime(audioElement.currentTime)} / ${formatTime(audioElement.duration)}`;
  }

  function resetAudioState() {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    isPlayingAudio = false;
    audioProgress = 0;
    audioTimeText = currentQuestion?.audioDuration || '00:00 / 1:50';
  }

  function selectOption(optionLabel) {
    if (!currentQuestion) return;
    selectedAnswers = {
      ...selectedAnswers,
      [currentQuestion.id]: optionLabel
    };
    localStorage.setItem(
      getUserStorageKey(`toefl_exam_answers_${activeSession.id}`),
      JSON.stringify(selectedAnswers)
    );
  }

  function prevQuestion() {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex -= 1;
      resetAudioState();
    }
  }

  function nextQuestion() {
    if (currentQuestionIndex < questionList.length - 1) {
      currentQuestionIndex += 1;
      resetAudioState();
    } else {
      showFinishConfirmModal = true;
    }
  }

  function goToQuestion(idx) {
    currentQuestionIndex = idx;
    resetAudioState();
  }

  function exitExamRoom() {
    localStorage.setItem(getUserStorageKey(`toefl_exam_status_${activeSession.id}`), 'ongoing');
    window.history.pushState({}, '', '/exam');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  function confirmAndSubmitExam() {
    showFinishConfirmModal = false;
    if (timerInterval) clearInterval(timerInterval);
    resetAudioState();

    localStorage.setItem(getUserStorageKey(`toefl_exam_status_${activeSession.id}`), 'finished');

    try {
      const userListKey = getUserStorageKey('toefl_sessions_list');
      const savedSessions = localStorage.getItem(userListKey);
      if (savedSessions) {
        const parsedList = JSON.parse(savedSessions);
        const updatedList = parsedList.map((s) =>
          s.id === activeSession.id ? { ...s, status: 'Selesai', category: 'Selesai' } : s
        );
        localStorage.setItem(userListKey, JSON.stringify(updatedList));
      }
    } catch (e) {}

    const newResultItem = {
      id: activeSession.id,
      title: activeSession.title,
      date: activeSession.date,
      time: activeSession.time,
      totalScore: 560,
      status: 'Lulus',
      listeningScore: '60/68',
      structureScore: '58/68',
      readingScore: '60/68',
      validUntil: '11 Juni 2026'
    };

    localStorage.setItem(getUserStorageKey('toefl_results_view_mode'), 'detail');
    localStorage.setItem(
      getUserStorageKey('toefl_selected_result_item'),
      JSON.stringify(newResultItem)
    );
    
    window.history.pushState({}, '', '/results');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
</script>

<svelte:head>
  <title>Mengerjakan {activeSession.title} - TOUFELING</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;1,700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="dashboard-bg">
  <div class="dashboard-shell">
    <!-- ==================== SIDEBAR KIRI ==================== -->
    <aside class="sidebar">
      <div class="brand-box">
        {#if !sidebarLogoError}
          <img
            src={sidebarLogoUrl}
            alt="Logo TOUFELING"
            class="sidebar-logo-img"
            onerror={() => (sidebarLogoError = true)}
          />
        {:else}
          <div class="brand-fallback">
            <svg class="logo-t-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="sideGradPlay" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#00c6ff" />
                  <stop offset="100%" stop-color="#0052d4" />
                </linearGradient>
              </defs>
              <path d="M22 28L78 16L73 33L56 37L56 85L39 90L39 41L20 45L22 28Z" fill="url(#sideGradPlay)" />
              <ellipse cx="50" cy="52" rx="38" ry="12" transform="rotate(-22 50 52)" stroke="url(#sideGradPlay)" stroke-width="5" fill="none" />
              <path d="M82 14L85 21L92 24L85 27L82 34L79 27L72 24L79 21L82 14Z" fill="#0088ff" />
            </svg>
            <div class="brand-title">TOUFELING</div>
            <div class="brand-sub"><span></span>TOEFL<span></span></div>
          </div>
        {/if}
      </div>

      <nav class="nav-list">
        <a href="/dashboard" class="nav-item">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1b3a6b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 10.5L12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5v-9z" fill="#7eb6ff" fill-opacity="0.35" />
              <path d="M9 21V13h6v8" />
            </svg>
          </span>
          <span class="nav-label">Dashboard</span>
        </a>

        <a href="/sessions" class="nav-item">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="17" rx="2" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <circle cx="8" cy="13" r="1" fill="#111" />
              <circle cx="12" cy="13" r="1" fill="#111" />
              <circle cx="16" cy="13" r="1" fill="#111" />
              <circle cx="8" cy="17" r="1" fill="#111" />
              <circle cx="12" cy="17" r="1" fill="#111" />
              <circle cx="16" cy="17" r="1" fill="#111" />
            </svg>
          </span>
          <span class="nav-label">Jadwal Tes</span>
        </a>

        <a href="/exam" class="nav-item active">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1b3a6b" stroke-width="2" stroke-linejoin="round">
              <polygon points="6 4 20 12 6 20 6 4" fill="#d9c2ff" fill-opacity="0.5" />
            </svg>
          </span>
          <span class="nav-label">Mulai Ujian</span>
        </a>

        <a href="/results" class="nav-item">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#111" stroke-width="2.2" stroke-linecap="round">
              <line x1="4" y1="20" x2="20" y2="20" />
              <line x1="7" y1="20" x2="7" y2="12" />
              <line x1="12" y1="20" x2="12" y2="6" />
              <line x1="17" y1="20" x2="17" y2="15" />
            </svg>
          </span>
          <span class="nav-label">Hasil Ujian</span>
        </a>

        <a href="/dashboard" class="nav-item">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#111">
              <rect x="4" y="2" width="16" height="20" rx="2.5" />
              <circle cx="12" cy="10" r="2.3" fill="#fff" />
              <path d="M10.5 13.5L9.5 18l2.5-1.5L14.5 18l-1-4.5" fill="#fff" />
            </svg>
          </span>
          <span class="nav-label">Sertifikat</span>
        </a>

        <a href="/dashboard" class="nav-item">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#111">
              <circle cx="12" cy="7.5" r="4" />
              <path d="M4.5 20c0-3.8 3.4-6.5 7.5-6.5s7.5 2.7 7.5 6.5" />
            </svg>
          </span>
          <span class="nav-label">Profile</span>
        </a>
      </nav>

      <div class="sidebar-wave-decor" aria-hidden="true"></div>
    </aside>

    <!-- ==================== KONTEN PENGERJAAN SOAL ==================== -->
    <main class="main-area">
      {#if !currentQuestion}
        <section class="empty-session-box">
          <h2>Soal Belum Tersedia</h2>
          <p>Admin belum menambahkan daftar soal pada sesi <strong>{activeSession.title}</strong>.</p>
          <button type="button" class="nav-pill-btn next" onclick={exitExamRoom}>
            Kembali ke Informasi Sesi
          </button>
        </section>
      {:else}
        <!-- 1. Top Banner Ujian Aktif -->
        <section class="active-exam-header">
          <div class="exam-header-left">
            <div class="section-icon-box">
              {#if currentQuestion.type === 'listening'}
                <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="#0b2e59" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                </svg>
              {:else}
                <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#0b2e59" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="8" y1="13" x2="16" y2="13" />
                  <line x1="8" y1="17" x2="13" y2="17" />
                </svg>
              {/if}
            </div>

            <div class="exam-header-titles">
              <h1>{activeSession.title}</h1>
              <p>{currentQuestion.sectionTitle}</p>
            </div>
          </div>

          <div class="exam-header-right">
            <div class="timer-pill-box">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#111827" stroke-width="2">
                <circle cx="12" cy="12" r="9" />
                <polyline points="12 7 12 12 15 14" />
              </svg>
              <div class="timer-text-col">
                <strong>{formattedTimer}</strong>
                <span>Sisa waktu</span>
              </div>
            </div>

            <div class="header-vert-line"></div>

            <button type="button" class="exit-exam-btn" onclick={exitExamRoom}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#d9383a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Keluar</span>
            </button>
          </div>
        </section>

        <!-- 2. Progress Bar -->
        <section class="progress-section">
          <span class="progress-label">Soal {currentQuestion.number} dari {activeSession.totalQuestions}</span>
          <div class="progress-track">
            <div class="progress-fill" style="width: {progressPercent}%"></div>
          </div>
          <span class="progress-pct">{progressPercent}%</span>
        </section>

        <!-- 3. Kartu Konten Soal (2 Kolom) -->
        <section class="question-workspace-card">
          <div class="question-split-grid">
            <!-- KOLOM KIRI -->
            <div class="left-stimulus-pane">
              {#if currentQuestion.type === 'listening'}
                <audio
                  bind:this={audioElement}
                  src={currentQuestion.audioUrl}
                  ontimeupdate={handleTimeUpdate}
                  onended={() => (isPlayingAudio = false)}
                ></audio>

                <div class="audio-player-pill">
                  <button type="button" class="play-circle-btn" onclick={toggleAudio} aria-label="Play Audio">
                    {#if isPlayingAudio}
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="#ffffff">
                        <rect x="6" y="5" width="4" height="14" rx="1" />
                        <rect x="14" y="5" width="4" height="14" rx="1" />
                      </svg>
                    {:else}
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="#ffffff">
                        <polygon points="7 4 20 12 7 20 7 4" />
                      </svg>
                    {/if}
                  </button>

                  <span class="audio-time">{audioTimeText}</span>

                  <div class="audio-wave-track">
                    <div class="audio-wave-progress" style="width: {audioProgress || 18}%"></div>
                  </div>

                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                </div>

                <div class="listening-visual-card">
                  {#if !listeningBoxLogoError}
                    <img
                      src={listeningBoxLogoUrl}
                      alt="Listening Headset"
                      class="listening-custom-img"
                      onerror={() => (listeningBoxLogoError = true)}
                    />
                  {:else}
                    <svg class="listening-fallback-svg" viewBox="0 0 360 210" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="360" height="210" rx="8" fill="#cce7ff" />
                      <path d="M0 130 Q45 95 90 120 T180 115 T270 125 T360 110 L360 210 L0 210 Z" fill="#89a7e0" opacity="0.7" />
                      <path d="M0 155 Q60 125 120 150 T240 140 T360 155 L360 210 L0 210 Z" fill="#7c98d6" opacity="0.85" />
                      <path d="M126 118 A54 54 0 0 1 234 118" stroke="#1e3a8a" stroke-width="10" stroke-linecap="round" fill="none" />
                      <rect x="116" y="110" width="28" height="54" rx="14" transform="rotate(-15 130 137)" fill="#2b4c9b" stroke="#1e3a8a" stroke-width="3" />
                      <rect x="216" y="110" width="28" height="54" rx="14" transform="rotate(15 230 137)" fill="#2b4c9b" stroke="#1e3a8a" stroke-width="3" />
                    </svg>
                  {/if}
                </div>
              {:else}
                <div class="structure-prompt-card">
                  {#each currentQuestion.promptLines || [] as line}
                    <p>{line}</p>
                  {/each}
                </div>
              {/if}
            </div>

            <!-- KOLOM KANAN -->
            <div class="right-options-pane">
              {#if currentQuestion.questionText}
                <h3 class="question-heading">{currentQuestion.questionText}</h3>
              {/if}

              <div class="options-list">
                {#each currentQuestion.options || [] as opt}
                  {@const isSelected = selectedAnswers[currentQuestion.id] === opt.label}
                  <button
                    type="button"
                    class="option-row-btn"
                    class:selected={isSelected}
                    onclick={() => selectOption(opt.label)}
                  >
                    <span class="radio-circle" class:checked={isSelected}></span>
                    <span class="option-text">{opt.label}. {opt.text}</span>
                  </button>
                {/each}
              </div>
            </div>
          </div>

          <!-- 4. Navigasi Bawah Soal -->
          <div class="exam-bottom-nav">
            <button
              type="button"
              class="nav-pill-btn prev"
              disabled={currentQuestionIndex === 0}
              onclick={prevQuestion}
            >
              Sebelumnya
            </button>

            <div class="question-quick-numbers">
              {#each questionList as q, idx}
                <button
                  type="button"
                  class="q-num-btn"
                  class:active={currentQuestionIndex === idx}
                  onclick={() => goToQuestion(idx)}
                >
                  {q.number || idx + 1}
                </button>
              {/each}
              <span class="q-num-dots">...</span>
            </div>

            <button type="button" class="nav-pill-btn next" onclick={nextQuestion}>
              {currentQuestionIndex === questionList.length - 1 ? 'Selesai' : 'Selanjutnya'}
            </button>
          </div>
        </section>
      {/if}
    </main>
  </div>

  <!-- ==================== POP-UP KONFIRMASI SELESAI UJIAN ==================== -->
  {#if showFinishConfirmModal}
    <div class="modal-backdrop">
      <div class="confirm-modal-box">
        <div class="modal-warn-icon">!</div>
        <h3>Konfirmasi Selesai Ujian</h3>
        <p>
          Apakah kamu yakin ingin menyelesaikan ujian sekarang dan tidak ingin mengecek jawaban kembali?
          <br />
          <strong>Perhatian:</strong> Setelah ujian diselesaikan, tidak ada pengulangan untuk sesi ini.
        </p>

        <div class="modal-action-row">
          <button
            type="button"
            class="modal-btn cancel"
            onclick={() => (showFinishConfirmModal = false)}
          >
            Cek Jawaban Lagi
          </button>
          <button
            type="button"
            class="modal-btn confirm"
            onclick={confirmAndSubmitExam}
          >
            Ya, Selesai & Lihat Nilai
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Poppins', Arial, Helvetica, sans-serif;
    background-color: #f3f7fc;
    color: #172033;
  }

  .dashboard-bg {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 32px;
    box-sizing: border-box;
    background: linear-gradient(135deg, #e6f2ff 0%, #f3f8ff 100%);
  }

  .dashboard-shell {
    width: 100%;
    max-width: 1180px;
    min-height: 730px;
    background: #ffffff;
    border-radius: 26px;
    box-shadow: 0 12px 34px rgba(18, 42, 76, 0.1);
    display: grid;
    grid-template-columns: 240px 1fr;
    overflow: hidden;
    position: relative;
  }

  .sidebar {
    position: relative;
    border-right: 1.5px solid #e5e9f2;
    padding: 28px 18px 36px;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    z-index: 1;
    overflow: hidden;
  }

  .brand-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    min-height: 100px;
  }

  .sidebar-logo-img {
    max-width: 160px;
    max-height: 100px;
    object-fit: contain;
  }

  .brand-fallback {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .logo-t-svg {
    width: 66px;
    height: 66px;
  }

  .brand-title {
    font-size: 18.5px;
    font-weight: 800;
    font-style: italic;
    letter-spacing: 0.6px;
    color: #0969da;
    margin-top: 2px;
    line-height: 1.1;
  }

  .brand-sub {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 8.5px;
    font-weight: 700;
    letter-spacing: 2.5px;
    color: #2f80ed;
    margin-top: 2px;
  }

  .brand-sub span {
    width: 16px;
    height: 1.5px;
    background: #56ccf2;
    display: inline-block;
  }

  .nav-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
    z-index: 2;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 10px 16px;
    border-radius: 12px;
    text-decoration: none;
    color: #8c8c8c;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .nav-item:hover {
    background: #f2f8ff;
    color: #172033;
  }

  .nav-item.active {
    background: linear-gradient(90deg, #b8dcff 0%, #a3d2ff 100%);
    color: #0b192c;
    font-weight: 700;
    box-shadow: 0 3px 6px rgba(86, 158, 255, 0.35);
  }

  .nav-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .sidebar-wave-decor {
    position: absolute;
    bottom: -55px;
    left: -45px;
    width: 250px;
    height: 170px;
    background: radial-gradient(circle at 30% 70%, #bce6ff 0%, #d4f0ff 65%, transparent 72%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }

  .sidebar-wave-decor::after {
    content: '';
    position: absolute;
    bottom: 10px;
    right: -55px;
    width: 150px;
    height: 120px;
    background: #d8f1ff;
    border-radius: 50%;
  }

  .main-area {
    padding: 28px 36px 32px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    background: #ffffff;
  }

  .empty-session-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    text-align: center;
    background: #f8fbff;
    border: 1.5px dashed #bdd7fb;
    border-radius: 16px;
    padding: 40px;
  }

  .active-exam-header {
    background: linear-gradient(180deg, #dcf0ff 0%, #cbe6ff 100%);
    border: 1.5px solid #b8d8f8;
    border-radius: 16px;
    padding: 16px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 5px 0 #b8cde3;
  }

  .exam-header-left {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .section-icon-box {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .exam-header-titles h1 {
    margin: 0 0 2px;
    font-size: 23px;
    font-weight: 800;
    color: #0b2e59;
  }

  .exam-header-titles p {
    margin: 0;
    font-size: 11px;
    color: #7d93a8;
    font-weight: 500;
  }

  .exam-header-right {
    display: flex;
    align-items: center;
    gap: 22px;
  }

  .timer-pill-box {
    background: #f5f9ff;
    border: 1.2px solid #c2d9f5;
    border-radius: 12px;
    padding: 7px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 3px 0 #b8cde3;
  }

  .timer-text-col {
    display: flex;
    flex-direction: column;
    line-height: 1.15;
  }

  .timer-text-col strong {
    font-size: 13.5px;
    font-weight: 800;
    color: #0b2e59;
  }

  .timer-text-col span {
    font-size: 9.5px;
    color: #6b7280;
  }

  .header-vert-line {
    width: 1.2px;
    height: 46px;
    background-color: #93b4d8;
  }

  .exit-exam-btn {
    background: #ffe4e8;
    border: 1.2px solid #fbcfe8;
    border-radius: 10px;
    padding: 9px 18px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #d9383a;
    font-family: inherit;
    font-size: 13.5px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 3px 0 #e5b8c0;
    transition: transform 0.1s ease;
  }

  .exit-exam-btn:hover {
    background: #fecdd3;
  }

  .progress-section {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 0 4px;
  }

  .progress-label,
  .progress-pct {
    font-size: 11px;
    font-weight: 700;
    color: #374151;
    white-space: nowrap;
  }

  .progress-track {
    flex: 1;
    height: 9px;
    background: #edf1f7;
    border-radius: 999px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4b94f7 0%, #3b82f6 100%);
    border-radius: 999px;
    transition: width 0.25s ease;
  }

  .question-workspace-card {
    background: #fbfcfe;
    border: 1.5px solid #e4e8f0;
    border-radius: 16px;
    padding: 20px 24px 18px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    flex: 1;
    justify-content: space-between;
  }

  .question-split-grid {
    background: #ffffff;
    border: 1.2px solid #e1e5ee;
    border-radius: 12px;
    display: grid;
    grid-template-columns: 1fr 1.05fr;
    min-height: 360px;
    overflow: hidden;
  }

  .left-stimulus-pane {
    border-right: 1.2px solid #e1e5ee;
    padding: 26px 28px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
  }

  .audio-player-pill {
    width: 100%;
    max-width: 340px;
    background: #ededf0;
    border-radius: 999px;
    padding: 7px 16px 7px 8px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-sizing: border-box;
  }

  .play-circle-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: #8da2db;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
  }

  .audio-time {
    font-size: 10px;
    font-weight: 700;
    color: #1f2937;
    white-space: nowrap;
  }

  .audio-wave-track {
    flex: 1;
    height: 4px;
    background: #ffffff;
    border-radius: 999px;
    overflow: hidden;
  }

  .audio-wave-progress {
    height: 100%;
    background: #6688d9;
    border-radius: 999px;
  }

  .listening-visual-card {
    width: 100%;
    max-width: 340px;
    height: 200px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    background: #cce7ff;
  }

  .listening-custom-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .listening-fallback-svg {
    width: 100%;
    height: 100%;
    display: block;
  }

  .structure-prompt-card {
    width: 100%;
    max-width: 360px;
    min-height: 210px;
    background: #cce7ff;
    border: 1.2px solid #9ec5ea;
    border-radius: 8px;
    padding: 28px 26px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
  }

  .structure-prompt-card p {
    margin: 0;
    font-size: 19px;
    font-weight: 700;
    color: #1f2937;
    line-height: 1.45;
  }

  .right-options-pane {
    padding: 28px 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 18px;
  }

  .question-heading {
    margin: 0 0 4px;
    font-size: 15.5px;
    font-weight: 600;
    color: #1f2937;
  }

  .options-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .option-row-btn {
    width: 100%;
    background: #ffffff;
    border: 1.2px solid #8fa3bf;
    border-radius: 8px;
    padding: 11px 16px;
    display: flex;
    align-items: center;
    gap: 14px;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    transition: all 0.15s ease;
    box-sizing: border-box;
  }

  .option-row-btn:hover {
    background: #f3f8ff;
    border-color: #4b94f7;
  }

  .option-row-btn.selected {
    background: #e8f2ff;
    border-color: #2563eb;
    box-shadow: 0 0 0 1px #2563eb;
  }

  .radio-circle {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid #5a769a;
    display: inline-block;
    flex-shrink: 0;
    box-sizing: border-box;
  }

  .radio-circle.checked {
    border-color: #2563eb;
    background: radial-gradient(circle, #2563eb 45%, transparent 50%);
  }

  .option-text {
    font-size: 13px;
    font-weight: 500;
    color: #1f2937;
  }

  .exam-bottom-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding-top: 2px;
  }

  .nav-pill-btn {
    min-width: 165px;
    padding: 9px 24px;
    border-radius: 999px;
    font-family: inherit;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .nav-pill-btn.prev {
    background: #ffffff;
    border: 1.2px solid #7589a6;
    color: #1f2937;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  }

  .nav-pill-btn.prev:disabled {
    opacity: 0.45;
    cursor: default;
  }

  .nav-pill-btn.next {
    background: linear-gradient(90deg, #5294f7 0%, #4687f2 100%);
    border: none;
    color: #0b2545;
    font-weight: 700;
    box-shadow: 0 3px 8px rgba(70, 135, 242, 0.35);
  }

  .question-quick-numbers {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .q-num-btn {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    border: 1px solid #c5cedb;
    background: #ffffff;
    color: #1f2937;
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .q-num-btn.active {
    background: #4da1ff;
    border-color: #3b82f6;
    color: #0b2545;
    font-weight: 700;
  }

  .q-num-dots {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    border: 1px solid #c5cedb;
    background: #ffffff;
    color: #1f2937;
    font-size: 13px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ==================== STYLE MODAL KONFIRMASI SELESAI ==================== */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(11, 25, 44, 0.45);
    backdrop-filter: blur(3px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    padding: 20px;
  }

  .confirm-modal-box {
    width: 100%;
    max-width: 430px;
    background: #ffffff;
    border: 1.5px solid #c2dfff;
    border-radius: 20px;
    padding: 28px 26px 24px;
    box-shadow: 0 16px 38px rgba(11, 46, 89, 0.18);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .modal-warn-icon {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: #dcf0ff;
    border: 2px solid #5294f7;
    color: #0b2e59;
    font-size: 26px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .confirm-modal-box h3 {
    margin: 2px 0 0;
    font-size: 19px;
    font-weight: 700;
    color: #0b2e59;
  }

  .confirm-modal-box p {
    margin: 0;
    font-size: 13px;
    line-height: 1.55;
    color: #4b5563;
  }

  .confirm-modal-box p strong {
    color: #dc2626;
  }

  .modal-action-row {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    margin-top: 10px;
  }

  .modal-btn {
    flex: 1;
    padding: 10px 14px;
    border-radius: 999px;
    font-family: inherit;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .modal-btn.cancel {
    background: #ffffff;
    border: 1.5px solid #cbd5e1;
    color: #334155;
  }

  .modal-btn.cancel:hover {
    background: #f1f5f9;
  }

  .modal-btn.confirm {
    background: linear-gradient(90deg, #5294f7 0%, #3b82f6 100%);
    border: none;
    color: #ffffff;
    box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
  }

  .modal-btn.confirm:hover {
    background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  }

  @media (max-width: 960px) {
    .dashboard-shell {
      grid-template-columns: 1fr;
    }
    .question-split-grid {
      grid-template-columns: 1fr;
    }
    .left-stimulus-pane {
      border-right: none;
      border-bottom: 1.2px solid #e1e5ee;
    }
    .active-exam-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 14px;
    }
    .exam-bottom-nav {
      flex-direction: column;
    }
    .modal-action-row {
      flex-direction: column;
    }
  }
</style>