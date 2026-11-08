<script>
  import { onMount } from 'svelte';
  import { examSessionInfo } from '../../lib/data/examQuestions.js';

  let sidebarLogoUrl = '/logo-sidebar.png';
  let bannerLogoUrl = '/logo-banner.png';
  let cardLogoUrl = '/logo-card.png';

  let sidebarLogoError = $state(false);
  let bannerLogoError = $state(false);
  let cardLogoError = $state(false);

  let activeMenu = $state('ujian');

  let currentSession = $state({
    id: examSessionInfo.id,
    title: examSessionInfo.title,
    subtitle: examSessionInfo.subtitle,
    registrationStatus: examSessionInfo.registrationStatus,
    date: examSessionInfo.date,
    time: examSessionInfo.time,
    durationText: examSessionInfo.durationText,
    totalQuestions: examSessionInfo.totalQuestions
  });

  // 'not_started' (Biru) | 'ongoing' (Hijau) | 'finished' (Merah)
  let examState = $state('not_started');

  onMount(() => {
    const savedActive = localStorage.getItem('toefl_active_session');
    if (savedActive) {
      try {
        const parsed = JSON.parse(savedActive);
        currentSession = {
          ...currentSession,
          id: parsed.id || 1,
          title: parsed.title ? parsed.title.replace('-', ' - ') : currentSession.title,
          date: parsed.date || currentSession.date,
          time: parsed.time || currentSession.time,
          registrationStatus: parsed.status || 'Terdaftar'
        };
      } catch (e) {
        console.error(e);
      }
    }

    const statusBySession = localStorage.getItem(`toefl_exam_status_${currentSession.id}`);
    if (statusBySession === 'ongoing' || statusBySession === 'finished' || statusBySession === 'not_started') {
      examState = statusBySession;
    } else {
      examState = 'not_started';
    }
  });

  function goToExamPlay() {
    localStorage.setItem(`toefl_exam_status_${currentSession.id}`, 'ongoing');
    localStorage.setItem('toefl_exam_status', 'ongoing');
    window.history.pushState({}, '', '/exam/play');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  function goToExamResults() {
    window.history.pushState({}, '', '/results');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
</script>

<svelte:head>
  <title>Mulai Ujian TOEFL - TOUFELING</title>
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
                <linearGradient id="sideGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#00c6ff" />
                  <stop offset="100%" stop-color="#0052d4" />
                </linearGradient>
              </defs>
              <path d="M22 28L78 16L73 33L56 37L56 85L39 90L39 41L20 45L22 28Z" fill="url(#sideGrad)" />
              <ellipse cx="50" cy="52" rx="38" ry="12" transform="rotate(-22 50 52)" stroke="url(#sideGrad)" stroke-width="5" fill="none" />
              <path d="M82 14L85 21L92 24L85 27L82 34L79 27L72 24L79 21L82 14Z" fill="#0088ff" />
            </svg>
            <div class="brand-title">TOUFELING</div>
            <div class="brand-sub"><span></span>TOEFL<span></span></div>
          </div>
        {/if}
      </div>

      <nav class="nav-list">
        <a href="/dashboard" class="nav-item" class:active={activeMenu === 'dashboard'}>
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1b3a6b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 10.5L12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5v-9z" fill="#7eb6ff" fill-opacity="0.35" />
              <path d="M9 21V13h6v8" />
            </svg>
          </span>
          <span class="nav-label">Dashboard</span>
        </a>

        <a href="/sessions" class="nav-item" class:active={activeMenu === 'jadwal'}>
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

        <a href="/exam" class="nav-item" class:active={activeMenu === 'ujian'}>
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1b3a6b" stroke-width="2" stroke-linejoin="round">
              <polygon points="6 4 20 12 6 20 6 4" fill="#d9c2ff" fill-opacity="0.5" />
            </svg>
          </span>
          <span class="nav-label">Mulai Ujian</span>
        </a>

        <a href="/results" class="nav-item" class:active={activeMenu === 'hasil'}>
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

    <!-- ==================== KONTEN UTAMA KANAN ==================== -->
    <main class="main-area">
      <section class="welcome-banner">
        <div class="welcome-text">
          <h1>Mulai Ujian TOEFL</h1>
          <p>
            Pastikan kamu sudah siap dan memahami<br />
            informasi ujian sebelum memulai.
          </p>
        </div>

        <div class="banner-logo-box">
          {#if !bannerLogoError}
            <img
              src={bannerLogoUrl}
              alt="Icon TOUFELING"
              class="banner-logo-img"
              onerror={() => (bannerLogoError = true)}
            />
          {:else}
            <svg class="banner-logo-fallback" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="banGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#00c6ff" />
                  <stop offset="100%" stop-color="#0052d4" />
                </linearGradient>
              </defs>
              <path d="M22 28L78 16L73 33L56 37L56 85L39 90L39 41L20 45L22 28Z" fill="url(#banGrad)" />
              <ellipse cx="50" cy="52" rx="38" ry="12" transform="rotate(-22 50 52)" stroke="url(#banGrad)" stroke-width="5" fill="none" />
              <path d="M82 14L85 21L92 24L85 27L82 34L79 27L72 24L79 21L82 14Z" fill="#0088ff" />
            </svg>
          {/if}
        </div>
      </section>

      <section class="exam-main-card">
        <div class="exam-top-section">
          <div class="exam-top-left">
            <div class="exam-logo-wrap">
              {#if !cardLogoError}
                <img
                  src={cardLogoUrl}
                  alt="Logo Sesi TOEFL"
                  class="exam-logo-img"
                  onerror={() => (cardLogoError = true)}
                />
              {:else}
                <svg class="exam-logo-fallback" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="silverGradExam" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#c3cfe2" />
                      <stop offset="50%" stop-color="#a1b0cb" />
                      <stop offset="100%" stop-color="#868f96" />
                    </linearGradient>
                    <linearGradient id="ringSoftGradExam" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#b8c6db" />
                      <stop offset="100%" stop-color="#d9c2ff" />
                    </linearGradient>
                  </defs>
                  <path d="M22 28L78 16L73 33L56 37L56 85L39 90L39 41L20 45L22 28Z" fill="url(#silverGradExam)" />
                  <ellipse cx="50" cy="52" rx="38" ry="12" transform="rotate(-22 50 52)" stroke="url(#ringSoftGradExam)" stroke-width="5" fill="none" />
                  <path d="M82 14L85 21L92 24L85 27L82 34L79 27L72 24L79 21L82 14Z" fill="#b8c6db" />
                </svg>
              {/if}
            </div>

            <div class="exam-title-group">
              <h2>{currentSession.title}</h2>
              <p>{currentSession.subtitle}</p>
            </div>
          </div>

          <span class="registered-pill">{currentSession.registrationStatus}</span>
        </div>

        <hr class="section-divider" />

        <div class="datetime-row">
          <div class="dt-col">
            <div class="dt-icon">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#0b2e59" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <circle cx="8" cy="13" r="1" fill="#0b2e59" />
                <circle cx="12" cy="13" r="1" fill="#0b2e59" />
                <circle cx="16" cy="13" r="1" fill="#0b2e59" />
                <circle cx="8" cy="17" r="1" fill="#0b2e59" />
                <circle cx="12" cy="17" r="1" fill="#0b2e59" />
                <circle cx="16" cy="17" r="1" fill="#0b2e59" />
              </svg>
            </div>
            <div class="dt-text">
              <span class="dt-label">Tanggal Ujian</span>
              <strong class="dt-value">{currentSession.date}</strong>
            </div>
          </div>

          <div class="vertical-divider"></div>

          <div class="dt-col">
            <div class="dt-icon">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#0b2e59" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="9" />
                <polyline points="12 7 12 12 15 14" />
              </svg>
            </div>
            <div class="dt-text">
              <span class="dt-label">Waktu</span>
              <strong class="dt-value">{currentSession.time}</strong>
            </div>
          </div>
        </div>

        <div class="stats-boxes">
          <div class="stat-blue-box">
            <div class="stat-inline">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#0b2e59">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
              </svg>
              <div class="stat-text-block">
                <span class="stat-title">Durasi</span>
                <strong class="stat-val">{currentSession.durationText}</strong>
              </div>
            </div>
          </div>

          <div class="stat-blue-box status-box">
            <div class="status-header">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1f2937" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 21V4" />
                <path d="M4 4h12l-2.5 4L16 12H4" />
              </svg>
              <span class="stat-title">Status</span>
            </div>

            <span
              class="exam-status-pill"
              class:not-started={examState === 'not_started'}
              class:ongoing={examState === 'ongoing'}
              class:finished={examState === 'finished'}
            >
              {#if examState === 'not_started'}
                Belum Dimulai
              {:else if examState === 'ongoing'}
                Sedang Dimulai
              {:else}
                Sudah Selesai
              {/if}
            </span>
          </div>

          <div class="stat-blue-box">
            <div class="stat-inline">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#0b2e59" stroke-width="2.2" stroke-linecap="round">
                <circle cx="5" cy="7" r="1.3" fill="#0b2e59" />
                <circle cx="5" cy="12" r="1.3" fill="#0b2e59" />
                <circle cx="5" cy="17" r="1.3" fill="#0b2e59" />
                <line x1="9" y1="7" x2="19" y2="7" />
                <line x1="9" y1="12" x2="19" y2="12" />
                <line x1="9" y1="17" x2="19" y2="17" />
              </svg>
              <div class="stat-text-block">
                <span class="stat-title">Jumlah Soal</span>
                <strong class="stat-val">{currentSession.totalQuestions} Soal</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="exam-footer-area">
          <div class="info-label-row">
            <span class="info-icon">!</span>
            <span>Informasi Ujian</span>
          </div>

          {#if examState !== 'finished'}
            <button type="button" class="start-exam-btn" onclick={goToExamPlay}>
              {examState === 'ongoing' ? 'Lanjutkan Ujian' : 'Mulai Ujian'} <span class="arrow">&rarr;</span>
            </button>
          {:else}
            <button type="button" class="start-exam-btn" onclick={goToExamResults}>
              Lihat Hasil Nilai <span class="arrow">&rarr;</span>
            </button>
          {/if}
        </div>
      </section>
    </main>
  </div>
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
    padding: 30px 38px 36px;
    display: flex;
    flex-direction: column;
    gap: 28px;
    background: #ffffff;
  }
  .welcome-banner {
    background: linear-gradient(180deg, #dcf0ff 0%, #cbe6ff 100%);
    border: 1.5px solid #c2dfff;
    border-radius: 16px;
    padding: 20px 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 5px 0 #b8cde3, 0 8px 16px rgba(0, 0, 0, 0.05);
  }
  .welcome-text h1 {
    margin: 0 0 6px;
    font-size: 26px;
    font-weight: 700;
    color: #0b2e59;
  }
  .welcome-text p {
    margin: 0;
    font-size: 12.5px;
    line-height: 1.5;
    color: #7d93a8;
    font-weight: 500;
  }
  .banner-logo-box {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 8px;
  }
  .banner-logo-img,
  .banner-logo-fallback {
    width: 74px;
    height: 74px;
    object-fit: contain;
  }
  .exam-main-card {
    background: #ffffff;
    border: 1.5px solid #e1e5ec;
    border-radius: 16px;
    padding: 28px 42px 30px;
    box-shadow: 4px 6px 0 #d5d9e0, 0 10px 24px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    gap: 22px;
  }
  .exam-top-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }
  .exam-top-left {
    display: flex;
    align-items: center;
    gap: 32px;
  }
  .exam-logo-wrap {
    width: 98px;
    height: 98px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .exam-logo-img,
  .exam-logo-fallback {
    width: 92px;
    height: 92px;
    object-fit: contain;
  }
  .exam-title-group h2 {
    margin: 0 0 6px;
    font-size: 26px;
    font-weight: 700;
    color: #0b2e59;
  }
  .exam-title-group p {
    margin: 0;
    font-size: 13px;
    color: #4b5563;
  }
  .registered-pill {
    display: inline-block;
    padding: 6px 32px;
    border-radius: 999px;
    background-color: #c4f9a2;
    color: #1f2937;
    font-size: 15px;
    font-weight: 600;
  }
  .section-divider {
    border: none;
    border-top: 1.2px solid #9ca3af;
    margin: 0;
  }
  .datetime-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    padding: 4px 16px;
  }
  .dt-col {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
  }
  .dt-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .dt-label {
    font-size: 12.5px;
    color: #374151;
  }
  .dt-value {
    font-size: 12.5px;
    color: #111827;
    font-weight: 700;
  }
  .vertical-divider {
    width: 1.2px;
    height: 68px;
    background-color: #6b7280;
  }
  .stats-boxes {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 26px;
    padding: 4px 18px;
  }
  .stat-blue-box {
    background: #d8edff;
    border: 1.2px solid #9ec5ea;
    border-radius: 12px;
    padding: 20px 18px;
    box-shadow: 0 3px 0 #b8cde3;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 74px;
    box-sizing: border-box;
  }
  .stat-inline {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .stat-text-block {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .stat-title {
    font-size: 12.5px;
    color: #1f2937;
    font-weight: 500;
  }
  .stat-val {
    font-size: 12.5px;
    color: #0b2e59;
    font-weight: 700;
  }
  .status-box {
    flex-direction: column;
    gap: 8px;
  }
  .status-header {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .exam-status-pill {
    display: inline-block;
    padding: 4px 16px;
    border-radius: 999px;
    font-size: 11.5px;
    font-weight: 700;
    transition: all 0.2s ease;
  }
  .exam-status-pill.not-started {
    background-color: #b5d6fb;
    color: #0b2e59;
  }
  .exam-status-pill.ongoing {
    background-color: #a3f576;
    color: #14532d;
  }
  .exam-status-pill.finished {
    background-color: #fca5a5;
    color: #7f1d1d;
  }
  .exam-footer-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-top: 4px;
  }
  .info-label-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    font-weight: 700;
    color: #0b2e59;
  }
  .info-icon {
    width: 19px;
    height: 19px;
    border-radius: 50%;
    background-color: #0b3c78;
    color: #ffffff;
    font-size: 12px;
    font-weight: 800;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .start-exam-btn {
    width: 100%;
    max-width: 265px;
    padding: 11px 24px;
    border: none;
    border-radius: 999px;
    background: linear-gradient(90deg, #5294f7 0%, #4687f2 100%);
    color: #ffffff;
    font-family: inherit;
    font-size: 14.5px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-shadow: 0 4px 10px rgba(70, 135, 242, 0.35);
    transition: all 0.2s ease;
  }
  .start-exam-btn:hover {
    background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
    transform: translateY(-1px);
  }
  @media (max-width: 960px) {
    .dashboard-shell {
      grid-template-columns: 1fr;
    }
    .exam-top-section {
      flex-direction: column;
      align-items: flex-start;
    }
    .datetime-row {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    .vertical-divider {
      display: none;
    }
    .stats-boxes {
      grid-template-columns: 1fr;
    }
  }
</style>