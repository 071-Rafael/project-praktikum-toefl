<script>
  import { onMount } from 'svelte';
  import { getUserStorageKey } from '../../lib/data/examQuestions.js';

  let sidebarLogoUrl = '/logo-sidebar.png';
  let bannerLogoUrl = '/logo-banner.png';
  let trophyLogoUrl = '/logo-trophy.png';

  let sidebarLogoError = $state(false);
  let bannerLogoError = $state(false);
  let trophyLogoError = $state(false);

  let activeMenu = $state('hasil');

  // 'list' (Riwayat Ujian) | 'detail' (Skor & QR Sertifikat)
  let viewMode = $state('list');

  // Murni diambil dari sesi yang sudah diselesaikan oleh akun ini
  let historyList = $state([]);
  let selectedResult = $state(null);

  onMount(() => {
    loadUserCompletedResults();
  });

  function loadUserCompletedResults() {
    const savedHistoryRaw = localStorage.getItem(
      getUserStorageKey('toefl_exam_results_history')
    );

    let parsedHistory = [];
    if (savedHistoryRaw) {
      try {
        const parsed = JSON.parse(savedHistoryRaw);
        if (Array.isArray(parsed)) {
          parsedHistory = parsed;
        }
      } catch (e) {
        parsedHistory = [];
      }
    }

    historyList = parsedHistory;

    const directMode = localStorage.getItem(getUserStorageKey('toefl_results_view_mode'));
    const directSessionRaw = localStorage.getItem(getUserStorageKey('toefl_selected_result_item'));

    if (directMode === 'detail') {
      if (directSessionRaw) {
        try {
          selectedResult = JSON.parse(directSessionRaw);
        } catch (e) {
          selectedResult = historyList[0] || null;
        }
      } else {
        selectedResult = historyList[0] || null;
      }

      if (selectedResult) {
        viewMode = 'detail';
      } else {
        viewMode = 'list';
      }
      localStorage.removeItem(getUserStorageKey('toefl_results_view_mode'));
    } else {
      viewMode = 'list';
    }
  }

  function openResultDetail(item) {
    selectedResult = item;
    viewMode = 'detail';
  }

  function backToHistoryList() {
    localStorage.removeItem(getUserStorageKey('toefl_results_view_mode'));
    viewMode = 'list';
  }

  function handlePrintCertificate() {
    window.print();
  }
</script>

<svelte:head>
  <title>Hasil Ujian - TOUFELING</title>
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
                <linearGradient id="sideGradRes" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#00c6ff" />
                  <stop offset="100%" stop-color="#0052d4" />
                </linearGradient>
              </defs>
              <path d="M22 28L78 16L73 33L56 37L56 85L39 90L39 41L20 45L22 28Z" fill="url(#sideGradRes)" />
              <ellipse cx="50" cy="52" rx="38" ry="12" transform="rotate(-22 50 52)" stroke="url(#sideGradRes)" stroke-width="5" fill="none" />
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

        <a
          href="/results"
          class="nav-item"
          class:active={activeMenu === 'hasil'}
          onclick={backToHistoryList}
        >
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0b2e59" stroke-width="2.2" stroke-linecap="round">
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
      <!-- 1. BANNER ATAS HASIL UJIAN (Dengan Kotak Ikon Grafik Sesuai Desain) -->
      <section class="welcome-banner">
        <div class="banner-left-group">
          <div class="banner-chart-box">
            <svg viewBox="0 0 28 28" width="32" height="32" fill="none">
              <path d="M3 3v22h22" stroke="#0b2e59" stroke-width="2.6" stroke-linecap="round" />
              <rect x="7" y="13" width="3.5" height="9" rx="1" fill="#0b2e59" />
              <rect x="13" y="7" width="3.5" height="15" rx="1" fill="#2563eb" />
              <rect x="19" y="16" width="3.5" height="6" rx="1" fill="#0b2e59" />
            </svg>
          </div>
          <div class="welcome-text">
            <h1>Hasil Ujian</h1>
            <p>Berikut adalah hasil ujian TOEFL kamu.</p>
          </div>
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
                <linearGradient id="banGradRes" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#00c6ff" />
                  <stop offset="100%" stop-color="#0052d4" />
                </linearGradient>
              </defs>
              <path d="M22 28L78 16L73 33L56 37L56 85L39 90L39 41L20 45L22 28Z" fill="url(#banGradRes)" />
              <ellipse cx="50" cy="52" rx="38" ry="12" transform="rotate(-22 50 52)" stroke="url(#banGradRes)" stroke-width="5" fill="none" />
              <path d="M82 14L85 21L92 24L85 27L82 34L79 27L72 24L79 21L82 14Z" fill="#0088ff" />
            </svg>
          {/if}
        </div>
      </section>

      {#if viewMode === 'list' || !selectedResult}
        <!-- ==================== TAMPILAN RIWAYAT UJIAN (SESUAI GAMBAR) ==================== -->
        <section class="history-card-container">
          <!-- Header Biru Muda Membulat -->
          <div class="history-top-bar">
            <div class="history-title-left">
              <svg viewBox="0 0 28 28" width="30" height="30" fill="none">
                <path d="M3 3v22h22" stroke="#0b2e59" stroke-width="2.6" stroke-linecap="round" />
                <rect x="7" y="13" width="3.5" height="9" rx="1" fill="#0b2e59" />
                <rect x="13" y="7" width="3.5" height="15" rx="1" fill="#2563eb" />
                <rect x="19" y="16" width="3.5" height="6" rx="1" fill="#0b2e59" />
              </svg>
              <h2>Riwayat Ujian</h2>
            </div>

            <button type="button" class="lihat-sebelumnya-pill">
              Lihat Sebelumnya
            </button>
          </div>

          <!-- Daftar Baris Berbingkai Halus + Area Kosong Bawah -->
          <div class="history-rows-wrapper">
            {#if historyList.length === 0}
              <div class="empty-history-box">
                <p>Belum ada sesi ujian yang diselesaikan.</p>
                <span>Silakan daftar dan selesaikan sesi ujian terlebih dahulu untuk melihat riwayat nilai.</span>
              </div>
            {:else}
              {#each historyList as item (item.id)}
                <div class="history-item-row">
                  <div class="h-col-date">
                    <span class="session-name-label">{item.title}</span>
                    <span class="session-date-label">{item.date}</span>
                  </div>
                  <div class="h-col-score">{item.totalScore}</div>
                  <div class="h-col-status">
                    <span
                      class="lulus-pill"
                      class:failed={item.status !== 'Lulus'}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div class="h-col-action">
                    <button
                      type="button"
                      class="lihat-detail-pill-btn"
                      onclick={() => openResultDetail(item)}
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
              {/each}
            {/if}
          </div>
        </section>
      {:else}
        <!-- ==================== TAMPILAN DETAIL SKOR & QR SERTIFIKAT ==================== -->
        <section class="result-detail-grid">
          <div class="score-left-card">
            <div class="congrats-header">
              <div class="trophy-circle-wrap">
                {#if !trophyLogoError}
                  <img
                    src={trophyLogoUrl}
                    alt="Trophy"
                    class="trophy-img"
                    onerror={() => (trophyLogoError = true)}
                  />
                {:else}
                  <div class="trophy-svg-fallback">
                    <svg viewBox="0 0 64 64" width="54" height="54" fill="none">
                      <path d="M18 14h28v14c0 8.5-6.2 15-14 15s-14-6.5-14-15V14z" fill="#6384b8" />
                      <path d="M18 18H10v6c0 5 3.5 9 8 9" stroke="#6384b8" stroke-width="4" stroke-linecap="round" />
                      <path d="M46 18h8v6c0 5-3.5 9-8 9" stroke="#6384b8" stroke-width="4" stroke-linecap="round" />
                      <rect x="28" y="42" width="8" height="8" fill="#6384b8" />
                      <rect x="21" y="50" width="22" height="5" rx="2.5" fill="#6384b8" />
                      <polygon points="32 20 34.2 24.5 39 25.2 35.5 28.6 36.3 33.4 32 31.1 27.7 33.4 28.5 28.6 25 25.2 29.8 24.5" fill="#ffffff" />
                    </svg>
                  </div>
                {/if}
              </div>

              <div class="congrats-text">
                <h2>Selamat!</h2>
                <p>Kamu telah menyelesaikan {selectedResult.title} dengan hasil berikut.</p>
              </div>
            </div>

            <div class="total-score-banner">
              <svg class="wreath-svg left" viewBox="0 0 60 120" fill="none">
                <path d="M45 105 C20 85, 18 35, 42 15" stroke="#a8c7ea" stroke-width="2.5" fill="none" />
                <ellipse cx="28" cy="28" rx="9" ry="5" transform="rotate(-35 28 28)" stroke="#a8c7ea" stroke-width="2" />
                <ellipse cx="22" cy="48" rx="9" ry="5" transform="rotate(-15 22 48)" stroke="#a8c7ea" stroke-width="2" />
                <ellipse cx="23" cy="68" rx="9" ry="5" transform="rotate(10 23 68)" stroke="#a8c7ea" stroke-width="2" />
                <ellipse cx="30" cy="88" rx="9" ry="5" transform="rotate(30 30 88)" stroke="#a8c7ea" stroke-width="2" />
              </svg>

              <div class="score-center-content">
                <h3>Skor Total TOEFL</h3>
                <div class="big-score-num">{selectedResult.totalScore}</div>
                <span class="status-lulus-pill">Status : {selectedResult.status}</span>
              </div>

              <svg class="wreath-svg right" viewBox="0 0 60 120" fill="none">
                <path d="M15 105 C40 85, 42 35, 18 15" stroke="#a8c7ea" stroke-width="2.5" fill="none" />
                <ellipse cx="32" cy="28" rx="9" ry="5" transform="rotate(35 32 28)" stroke="#a8c7ea" stroke-width="2" />
                <ellipse cx="38" cy="48" rx="9" ry="5" transform="rotate(15 38 48)" stroke="#a8c7ea" stroke-width="2" />
                <ellipse cx="37" cy="68" rx="9" ry="5" transform="rotate(-10 37 68)" stroke="#a8c7ea" stroke-width="2" />
                <ellipse cx="30" cy="88" rx="9" ry="5" transform="rotate(-30 30 88)" stroke="#a8c7ea" stroke-width="2" />
              </svg>
            </div>

            <div class="rincian-section">
              <div class="rincian-header">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                  <path d="M3 3v18h18" stroke="#0b2e59" stroke-width="2.4" stroke-linecap="round" />
                  <rect x="6" y="11" width="3" height="7" fill="#0b2e59" />
                  <rect x="11" y="6" width="3" height="12" fill="#3b82f6" />
                  <rect x="16" y="13" width="3" height="5" fill="#0b2e59" />
                </svg>
                <h4>Rincian Nilai</h4>
              </div>

              <div class="rincian-cards-grid">
                <div class="subscore-box">
                  <div class="subscore-top">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#0b2e59" stroke-width="2">
                      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                    </svg>
                    <span>Listening</span>
                  </div>
                  <strong>{selectedResult.listeningScore}</strong>
                </div>

                <div class="subscore-box">
                  <div class="subscore-top">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#0b2e59" stroke-width="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="8" y1="13" x2="16" y2="13" />
                      <line x1="8" y1="17" x2="13" y2="17" />
                    </svg>
                    <span>Structure & Written<br />Expression</span>
                  </div>
                  <strong>{selectedResult.structureScore}</strong>
                </div>

                <div class="subscore-box">
                  <div class="subscore-top">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#0b2e59" stroke-width="2">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                    <span>Reading</span>
                  </div>
                  <strong>{selectedResult.readingScore}</strong>
                </div>
              </div>
            </div>

            <div class="exam-meta-footer">
              <div class="meta-col">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#111" stroke-width="1.8">
                  <rect x="3" y="4" width="18" height="17" rx="2" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <circle cx="8" cy="13" r="1" fill="#111" />
                  <circle cx="12" cy="13" r="1" fill="#111" />
                  <circle cx="16" cy="13" r="1" fill="#111" />
                </svg>
                <div class="meta-txt">
                  <span>Tanggal Ujian</span>
                  <strong>{selectedResult.date}</strong>
                </div>
              </div>

              <div class="meta-divider"></div>

              <div class="meta-col">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#111" stroke-width="2">
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="12 7 12 12 15 14" />
                </svg>
                <div class="meta-txt">
                  <span>Waktu Ujian</span>
                  <strong>{selectedResult.time}</strong>
                </div>
              </div>
            </div>
          </div>

          <div class="qr-right-card">
            <div class="qr-top-banner">
              <div class="qr-mini-icon">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#0b2e59" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 19h2v2h-2z" fill="#0b2e59" stroke="none" />
                </svg>
              </div>
              <div class="qr-banner-text">
                <h3>Scan QR Sertifikat</h3>
                <p>Untuk melihat detail sertifikat.</p>
              </div>
            </div>

            <div class="qr-code-box">
              <svg viewBox="0 0 120 120" width="145" height="145" fill="#000000">
                <path d="M8 8h28v6H14v22H8V8z" />
                <rect x="18" y="18" width="22" height="22" fill="none" stroke="#000" stroke-width="6" />
                <rect x="25" y="25" width="8" height="8" />
                <path d="M84 8h28v28h-6V14H84V8z" />
                <rect x="78" y="18" width="22" height="22" fill="none" stroke="#000" stroke-width="6" />
                <rect x="85" y="25" width="8" height="8" />
                <path d="M8 84h6v22h22v6H8V84z" />
                <rect x="18" y="72" width="22" height="22" fill="none" stroke="#000" stroke-width="6" />
                <rect x="25" y="79" width="8" height="8" />
                <path d="M106 84h6v28H84v-6h22V84z" />
                <rect x="54" y="54" width="10" height="10" />
                <rect x="68" y="54" width="8" height="16" />
                <rect x="54" y="68" width="18" height="8" />
                <rect x="78" y="64" width="14" height="8" />
                <rect x="64" y="80" width="10" height="16" />
                <rect x="80" y="76" width="16" height="8" />
                <rect x="86" y="88" width="12" height="8" />
              </svg>
            </div>

            <p class="qr-expire-text">
              Kode berlaku selama 30 hari<br />
              <strong>(hingga {selectedResult.validUntil || '11 Juni 2026'})</strong>
            </p>

            <span class="atau-badge">Atau</span>

            <div class="qr-action-buttons">
              <button type="button" class="btn-download-pdf" onclick={handlePrintCertificate}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#ffffff" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Unduh Hasil Sertifikat(PDF)</span>
              </button>

              <button type="button" class="btn-print-cert" onclick={handlePrintCertificate}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="#0b2e59">
                  <path d="M6 9V2h12v7H6zm11-5H7v3h10V4zM4 11h16a2 2 0 0 1 2 2v5h-4v4H6v-4H2v-5a2 2 0 0 1 2-2zm12 9v-4H8v4h8z" />
                </svg>
                <span>Cetak Hasil Sertifikat</span>
              </button>
            </div>
          </div>
        </section>
      {/if}
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
    padding: 26px 34px 30px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    background: #ffffff;
  }
  .welcome-banner {
    background: linear-gradient(180deg, #dcf0ff 0%, #cbe6ff 100%);
    border: 1.5px solid #c2dfff;
    border-radius: 16px;
    padding: 16px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 5px 0 #b8cde3;
  }
  .banner-left-group {
    display: flex;
    align-items: center;
    gap: 18px;
  }
  .banner-chart-box {
    width: 52px;
    height: 52px;
    border-radius: 12px;
    background: rgba(184, 218, 255, 0.45);
    border: 1.2px solid #b5d5f8;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .welcome-text h1 {
    margin: 0 0 2px;
    font-size: 24px;
    font-weight: 800;
    color: #0b2e59;
  }
  .welcome-text p {
    margin: 0;
    font-size: 11px;
    color: #7d93a8;
    font-weight: 500;
  }
  .banner-logo-img,
  .banner-logo-fallback {
    width: 68px;
    height: 68px;
    object-fit: contain;
  }

  /* ==================== STYLE RIWAYAT UJIAN (SESUAI GAMBAR) ==================== */
  .history-card-container {
    background: #ffffff;
    border: 1.4px solid #c9d5e6;
    border-radius: 16px;
    overflow: hidden;
    flex: 1;
    min-height: 460px;
    display: flex;
    flex-direction: column;
  }

  .history-top-bar {
    background: linear-gradient(180deg, #dcf0ff 0%, #d2e9ff 100%);
    border: 1.2px solid #b8d4f2;
    border-radius: 14px;
    padding: 18px 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .history-title-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .history-title-left h2 {
    margin: 0;
    font-size: 22px;
    font-weight: 800;
    color: #0b2e59;
  }

  .lihat-sebelumnya-pill {
    padding: 7px 32px;
    border-radius: 999px;
    border: none;
    background: #b5dcff;
    color: #0b2e59;
    font-family: inherit;
    font-size: 12.5px;
    font-weight: 700;
    cursor: pointer;
  }

  .history-rows-wrapper {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .empty-history-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    text-align: center;
    color: #4b5563;
  }

  .empty-history-box p {
    margin: 0 0 6px;
    font-size: 16px;
    font-weight: 700;
    color: #0b2e59;
  }

  .empty-history-box span {
    font-size: 12.5px;
    color: #6b7280;
  }

  .history-item-row {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1.3fr;
    align-items: center;
    padding: 18px 46px;
    border-bottom: 1.2px solid #cfd8e6;
    border-radius: 12px;
    background: #ffffff;
  }

  .h-col-date {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .session-name-label {
    font-size: 11.5px;
    font-weight: 700;
    color: #0b2e59;
  }

  .session-date-label {
    font-size: 15px;
    font-weight: 500;
    color: #111827;
  }

  .h-col-score {
    font-size: 21px;
    font-weight: 800;
    color: #0b2e59;
    text-align: center;
  }

  .h-col-status {
    display: flex;
    justify-content: center;
  }

  .lulus-pill {
    display: inline-block;
    min-width: 78px;
    text-align: center;
    padding: 4px 18px;
    border-radius: 999px;
    background: #b6f592;
    color: #1f2937;
    font-size: 13px;
    font-weight: 700;
  }

  .lulus-pill.failed {
    background: #fca5a5;
    color: #7f1d1d;
  }

  .h-col-action {
    display: flex;
    justify-content: center;
  }

  .lihat-detail-pill-btn {
    padding: 6px 28px;
    border-radius: 999px;
    border: none;
    background: #cce4ff;
    color: #0b2e59;
    font-family: inherit;
    font-size: 12.5px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .lihat-detail-pill-btn:hover {
    background: #b5d6fb;
  }

  /* ==================== STYLE DETAIL SKOR & QR ==================== */
  .result-detail-grid {
    display: grid;
    grid-template-columns: 1.65fr 1fr;
    gap: 18px;
    flex: 1;
    align-items: stretch;
  }
  .score-left-card {
    background: #ffffff;
    border: 1.5px solid #e1e6ef;
    border-radius: 16px;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 14px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
  }
  .congrats-header {
    display: flex;
    align-items: center;
    gap: 18px;
  }
  .trophy-circle-wrap {
    width: 82px;
    height: 82px;
    border-radius: 50%;
    background: #d8edff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .trophy-img {
    width: 58px;
    height: 58px;
    object-fit: contain;
  }
  .congrats-text h2 {
    margin: 0 0 4px;
    font-size: 27px;
    font-weight: 800;
    color: #0b2e59;
  }
  .congrats-text p {
    margin: 0;
    font-size: 11.5px;
    color: #4b5563;
    font-weight: 500;
  }
  .total-score-banner {
    background: linear-gradient(180deg, #dcf0ff 0%, #f0f8ff 100%);
    border: 1.5px solid #9ec5ea;
    border-radius: 12px;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 4px 8px rgba(158, 197, 234, 0.25);
  }
  .wreath-svg {
    width: 54px;
    height: 105px;
    flex-shrink: 0;
  }
  .score-center-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .score-center-content h3 {
    margin: 0;
    font-size: 19px;
    font-weight: 800;
    color: #0b2e59;
  }
  .big-score-num {
    font-size: 54px;
    font-weight: 800;
    color: #0b2e59;
    line-height: 1.05;
    margin: 4px 0 8px;
  }
  .status-lulus-pill {
    background: #bfe0ff;
    color: #0b2e59;
    padding: 4px 22px;
    border-radius: 999px;
    font-size: 11.5px;
    font-weight: 700;
  }
  .rincian-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .rincian-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .rincian-header h4 {
    margin: 0;
    font-size: 13px;
    font-weight: 800;
    color: #0b2e59;
  }
  .rincian-cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  .subscore-box {
    background: #d8edff;
    border: 1.2px solid #b5d6fb;
    border-radius: 10px;
    padding: 10px 14px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 6px;
    box-shadow: 0 3px 0 #c5d9ed;
  }
  .subscore-top {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    font-size: 10.5px;
    font-weight: 500;
    color: #1f2937;
    line-height: 1.25;
  }
  .subscore-box strong {
    font-size: 17px;
    font-weight: 700;
    color: #0b2e59;
    text-align: center;
  }
  .exam-meta-footer {
    border: 1.2px solid #d5dce6;
    border-radius: 10px;
    padding: 10px 18px;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
  }
  .meta-col {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  .meta-txt {
    display: flex;
    flex-direction: column;
    font-size: 11px;
    color: #374151;
  }
  .meta-txt strong {
    font-size: 11.5px;
    color: #111827;
  }
  .meta-divider {
    width: 1.2px;
    height: 32px;
    background: #9ca3af;
  }
  .qr-right-card {
    background: #f7fbff;
    border: 1.5px solid #d8e6f7;
    border-radius: 16px;
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    text-align: center;
  }
  .qr-top-banner {
    width: 100%;
    background: #cbe6ff;
    border: 1.2px solid #9ec5ea;
    border-radius: 10px;
    padding: 12px 14px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 10px;
    text-align: left;
  }
  .qr-banner-text h3 {
    margin: 0;
    font-size: 14.5px;
    font-weight: 800;
    color: #0b2e59;
  }
  .qr-banner-text p {
    margin: 2px 0 0;
    font-size: 9.5px;
    color: #4b6a88;
  }
  .qr-code-box {
    background: #ffffff;
    padding: 12px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 6px 0;
  }
  .qr-expire-text {
    margin: 0;
    font-size: 10px;
    line-height: 1.4;
    color: #1f2937;
  }
  .atau-badge {
    background: #d8edff;
    color: #0b2e59;
    padding: 3px 16px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 700;
  }
  .qr-action-buttons {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .btn-download-pdf {
    width: 100%;
    padding: 9px 14px;
    border: none;
    border-radius: 8px;
    background: linear-gradient(90deg, #5294f7 0%, #3b82f6 100%);
    color: #ffffff;
    font-family: inherit;
    font-size: 10.5px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .btn-print-cert {
    width: 100%;
    padding: 9px 14px;
    border: 1.2px solid #cbd5e1;
    border-radius: 8px;
    background: #ffffff;
    color: #0b2e59;
    font-family: inherit;
    font-size: 10.5px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
</style>