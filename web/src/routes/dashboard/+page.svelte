<script>
  import { onMount } from 'svelte';

  // =========================================================================
  // TEMPAT MEMASANG 2 LOGO KAMU (Simpan gambarnya di folder web/public/)
  // =========================================================================
  let sidebarLogoUrl = '/logo-sidebar.png'; // Logo 1: Di atas Sidebar kiri
  let bannerLogoUrl = '/logo-banner.png';   // Logo 2: Di kanan Banner Selamat Datang

  let sidebarLogoError = $state(false);
  let bannerLogoError = $state(false);

  // Nama default ("Abel"), otomatis berubah mengikuti user yang login di localStorage
  let userName = $state('Abel');
  let activeMenu = $state('dashboard');

  const upcomingSessions = [
    {
      id: 1,
      title: 'TOEFL-Sesi 1',
      institution: 'Universitas Madura (UNIRA)',
      date: '12 Mei 2026',
      time: '12.00 - 13.00 WIB',
      status: 'Terdaftar',
      actionText: 'Lihat Detail',
      isRegistered: true
    },
    {
      id: 2,
      title: 'TOEFL-Sesi 2',
      institution: 'Universitas Madura (UNIRA)',
      date: '21 Mei 2026',
      time: '13.00 - 15.00 WIB',
      status: 'Tersedia',
      actionText: 'Daftar Tes',
      isRegistered: false
    },
    {
      id: 3,
      title: 'TOEFL-Sesi 3',
      institution: 'Universitas Madura (UNIRA)',
      date: '13 Juni 2026',
      time: '08.00 - 10.00 WIB',
      status: 'Tersedia',
      actionText: 'Daftar Tes',
      isRegistered: false
    }
  ];

  onMount(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.name) {
          userName = parsed.name.split(' ')[0];
        }
      }
    } catch (err) {
      console.error('Gagal membaca data user:', err);
    }
  });
</script>

<svelte:head>
  <title>Dashboard - TOUFELING</title>
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
      <!-- TEMPAT LOGO 1: Di Atas Sidebar -->
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

      <!-- Menu Navigasi Sidebar -->
      <nav class="nav-list">
        <a
          href="/dashboard"
          class="nav-item"
          class:active={activeMenu === 'dashboard'}
          onclick={() => (activeMenu = 'dashboard')}
        >
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1b3a6b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 10.5L12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5v-9z" fill="#7eb6ff" fill-opacity="0.35" />
              <path d="M9 21V13h6v8" />
            </svg>
          </span>
          <span class="nav-label">Dashboard</span>
        </a>

        <a
          href="/sessions"
          class="nav-item"
          class:active={activeMenu === 'jadwal'}
          onclick={() => (activeMenu = 'jadwal')}
        >
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

        <a
          href="/exam"
          class="nav-item"
          class:active={activeMenu === 'ujian'}
          onclick={() => (activeMenu = 'ujian')}
        >
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#4a3b5c" stroke-width="2" stroke-linejoin="round">
              <polygon points="6 4 20 12 6 20 6 4" fill="#d9c2ff" fill-opacity="0.4" />
            </svg>
          </span>
          <span class="nav-label">Mulai Ujian</span>
        </a>

        <a
          href="/results"
          class="nav-item"
          class:active={activeMenu === 'hasil'}
          onclick={() => (activeMenu = 'hasil')}
        >
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

        <a
          href="/dashboard"
          class="nav-item"
          class:active={activeMenu === 'sertifikat'}
          onclick={() => (activeMenu = 'sertifikat')}
        >
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#111">
              <rect x="4" y="2" width="16" height="20" rx="2.5" />
              <circle cx="12" cy="10" r="2.3" fill="#fff" />
              <path d="M10.5 13.5L9.5 18l2.5-1.5L14.5 18l-1-4.5" fill="#fff" />
            </svg>
          </span>
          <span class="nav-label">Sertifikat</span>
        </a>

        <a
          href="/dashboard"
          class="nav-item"
          class:active={activeMenu === 'profile'}
          onclick={() => (activeMenu = 'profile')}
        >
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
      <!-- 1. BANNER SELAMAT DATANG + TEMPAT LOGO 2 -->
      <section class="welcome-banner">
        <div class="welcome-text">
          <h1>Selamat Datang, {userName}!</h1>
          <p>
            Siap mengikuti ujian TOEFL dan raih<br />
            masa depan yang lebih baik!
          </p>
        </div>

        <!-- TEMPAT LOGO 2: Di Sebelah Kanan Banner -->
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

      <!-- 2. TIGA KARTU MENU CEPAT -->
      <section class="summary-cards">
        <!-- Kartu 1: Jadwal Tes -->
        <div class="info-card">
          <div class="circle-badge badge-blue">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#111" stroke-width="2">
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
          </div>
          <h3>Jadwal Tes</h3>
          <p>Lihat jadwal sesi tes yang tersedia untuk kamu</p>
        </div>

        <!-- Kartu 2: Status Pendaftaran -->
        <div class="info-card">
          <div class="circle-badge badge-green">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#111" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="8" y1="13" x2="16" y2="13" />
              <line x1="8" y1="17" x2="13" y2="17" />
            </svg>
          </div>
          <h3>Status Pendaftaran</h3>
          <p>Cek status pendaftaran kamu di sesi tes yang dipilih</p>
        </div>

        <!-- Kartu 3: Hasil Ujian -->
        <div class="info-card">
          <div class="circle-badge badge-purple">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#111" stroke-width="2.4" stroke-linecap="round">
              <line x1="7" y1="18" x2="7" y2="12" />
              <line x1="12" y1="18" x2="12" y2="6" />
              <line x1="17" y1="18" x2="17" y2="14" />
            </svg>
          </div>
          <h3>Hasil Ujian</h3>
          <p>Lihat hasil ujian dan perkembangan skor kamu</p>
        </div>
      </section>

      <!-- 3. PANEL JADWAL TES MENDATANG -->
      <section class="upcoming-container">
        <h2>Jadwal Tes Mendatang</h2>

        <div class="session-list">
          {#each upcomingSessions as item (item.id)}
            <div class="session-row">
              <!-- Kiri: Icon Kalender Biru + Nama Sesi & Kampus -->
              <div class="session-left">
                <div class="circle-badge badge-blue">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#111" stroke-width="2">
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
                </div>
                <div class="session-title-group">
                  <h4>{item.title}</h4>
                  <p>{item.institution}</p>
                </div>
              </div>

              <!-- Tengah: Tanggal & Jam -->
              <div class="session-datetime">
                <div class="dt-row">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#555" stroke-width="1.8">
                    <rect x="3" y="4" width="18" height="17" rx="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                  </svg>
                  <span>{item.date}</span>
                </div>
                <div class="dt-row">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#222" stroke-width="2">
                    <circle cx="12" cy="12" r="9" />
                    <polyline points="12 7 12 12 15 14" />
                  </svg>
                  <span class="dt-time">{item.time}</span>
                </div>
              </div>

              <!-- Status Pill: Terdaftar / Tersedia -->
              <div class="session-status">
                <span class="status-pill" class:registered={item.isRegistered}>
                  {item.status}
                </span>
              </div>

              <!-- Kanan: Tombol Lihat Detail / Daftar Tes -->
              <div class="session-action">
                <button
                  type="button"
                  class="action-btn"
                  class:outline={item.isRegistered}
                  class:primary={!item.isRegistered}
                >
                  {item.actionText}
                </button>
              </div>
            </div>
          {/each}
        </div>
      </section>
    </main>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Poppins', Arial, Helvetica, sans-serif;
    background-color: #dbeeff;
    color: #172033;
  }

  .dashboard-bg {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 28px 36px;
    box-sizing: border-box;
    background: linear-gradient(135deg, #d7edff 0%, #eaf6ff 55%, #f5faff 100%);
  }

  .dashboard-shell {
    width: 100%;
    max-width: 1180px;
    min-height: 760px;
    background: #ffffff;
    border-radius: 26px;
    box-shadow: 0 14px 36px rgba(18, 42, 76, 0.14);
    display: grid;
    grid-template-columns: 245px 1fr;
    overflow: hidden;
    position: relative;
  }

  /* ==================== SIDEBAR ==================== */
  .sidebar {
    position: relative;
    border-right: 1.5px solid #e4e9f2;
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
    margin-bottom: 26px;
    min-height: 105px;
  }

  .sidebar-logo-img {
    max-width: 165px;
    max-height: 105px;
    object-fit: contain;
  }

  .brand-fallback {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .logo-t-svg {
    width: 68px;
    height: 68px;
  }

  .brand-title {
    font-size: 19px;
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
    gap: 12px;
    position: relative;
    z-index: 2;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 11px 16px;
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
    box-shadow: 0 4px 10px rgba(86, 158, 255, 0.35);
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
    width: 260px;
    height: 170px;
    background: radial-gradient(circle at 30% 70%, #bfe8ff 0%, #d4f0ff 65%, transparent 72%);
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
    background: #d9f2ff;
    border-radius: 50%;
  }

  /* ==================== MAIN CONTENT KANAN ==================== */
  .main-area {
    padding: 30px 38px 36px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    background: #ffffff;
  }

  .welcome-banner {
    background: linear-gradient(180deg, #dcf0ff 0%, #cbe6ff 100%);
    border: 1.5px solid #c2dfff;
    border-radius: 16px;
    padding: 24px 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 5px 0 #b8cde3, 0 8px 16px rgba(0, 0, 0, 0.06);
  }

  .welcome-text h1 {
    margin: 0 0 8px;
    font-size: 27px;
    font-weight: 700;
    color: #0f2537;
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
    padding-right: 12px;
  }

  .banner-logo-img {
    width: 78px;
    height: 78px;
    object-fit: contain;
  }

  .banner-logo-fallback {
    width: 76px;
    height: 76px;
  }

  .summary-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 22px;
    max-width: 820px;
  }

  .info-card {
    background: #ffffff;
    border: 1.5px solid #e4e7ec;
    border-radius: 15px;
    padding: 18px 20px 20px;
    box-shadow: 4px 5px 0 #d5d9e0, 0 6px 14px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .circle-badge {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-bottom: 12px;
  }

  .badge-blue {
    background-color: #79a6f6;
  }

  .badge-green {
    background-color: #9be564;
  }

  .badge-purple {
    background-color: #d580ff;
  }

  .info-card h3 {
    margin: 0 0 6px;
    font-size: 14px;
    font-weight: 700;
    color: #111827;
  }

  .info-card p {
    margin: 0;
    font-size: 11.5px;
    line-height: 1.45;
    color: #374151;
  }

  .upcoming-container {
    background: #ffffff;
    border: 1.5px solid #e4e7ec;
    border-radius: 16px;
    padding: 22px 26px 26px;
    max-width: 800px;
    box-shadow: 5px 6px 0 #d5d9e0, 0 8px 18px rgba(0, 0, 0, 0.04);
  }

  .upcoming-container h2 {
    margin: 0 0 18px;
    font-size: 16.5px;
    font-weight: 700;
    color: #0b2e59;
  }

  .session-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .session-row {
    display: grid;
    grid-template-columns: 1.6fr 1.1fr 0.8fr auto;
    align-items: center;
    gap: 14px;
    padding: 13px 18px;
    border: 1.2px solid #e5e7eb;
    border-radius: 12px;
    background: #ffffff;
  }

  .session-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .session-left .circle-badge {
    margin-bottom: 0;
  }

  .session-title-group h4 {
    margin: 0 0 3px;
    font-size: 13.5px;
    font-weight: 700;
    color: #0b2e59;
  }

  .session-title-group p {
    margin: 0;
    font-size: 11px;
    color: #374151;
  }

  .session-datetime {
    display: flex;
    flex-direction: column;
    gap: 5px;
    font-size: 11px;
    color: #374151;
  }

  .dt-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .dt-time {
    font-weight: 500;
    color: #111827;
  }

  .session-status {
    display: flex;
    justify-content: center;
  }

  .status-pill {
    display: inline-block;
    padding: 4px 18px;
    border-radius: 999px;
    font-size: 10.5px;
    font-weight: 600;
    background-color: #a4cafe;
    color: #1e3a8a;
  }

  .status-pill.registered {
    background-color: #b9fbc0;
    color: #166534;
  }

  .action-btn {
    min-width: 96px;
    padding: 9px 16px;
    border-radius: 8px;
    font-family: inherit;
    font-size: 11.5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .action-btn.outline {
    background: #ffffff;
    border: 1.2px solid #d1d5db;
    color: #1f2937;
  }

  .action-btn.outline:hover {
    background: #f9fafb;
  }

  .action-btn.primary {
    background: #5aa9fa;
    border: 1.2px solid #5aa9fa;
    color: #0f172a;
  }

  .action-btn.primary:hover {
    background: #3b95f5;
  }

  @media (max-width: 960px) {
    .dashboard-shell {
      grid-template-columns: 1fr;
    }
    .summary-cards {
      grid-template-columns: 1fr;
    }
    .session-row {
      grid-template-columns: 1fr;
      text-align: left;
    }
    .session-status {
      justify-content: flex-start;
    }
  }
</style>