<script>
  import { onMount } from 'svelte';
  let sidebarLogoUrl = '/logo-sidebar.png'; // Logo 1: Di atas Sidebar kiri
  let bannerLogoUrl = '/logo-banner.png';   // Logo 2: Di kanan Banner Selamat Datang
  let cardLogoUrl = '/logo-card.png';       // Logo 3: Logo T silver/ungu di Ujian Terdekat
  let resultLogoUrl = '/logo-result.png';   // Logo 4: Ilustrasi TOEFL di Hasil Ujian Akhir (Kanan Bawah)

  let sidebarLogoError = $state(false);
  let bannerLogoError = $state(false);
  let cardLogoError = $state(false);
  let resultLogoError = $state(false);

  // Nama default, otomatis berubah mengikuti user yang login di localStorage
  let userName = $state('Anonymous');
  let activeMenu = $state('dashboard');

  const nearestExam = {
    title: 'TOEFL-Sesi 1',
    date: '12 Mei 2026',
    time: '12.00 - 13.00 WIB',
    status: 'Terdaftar'
  };

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

      <!-- 2. TIGA KARTU MENU CEPAT (HORIZONTAL) -->
      <section class="summary-cards">
        <!-- Kartu 1: Ujian Terdaftar -->
        <div class="info-card">
          <div class="circle-badge badge-blue">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#111" stroke-width="2">
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
          <h3>Ujian Terdaftar</h3>
        </div>

        <!-- Kartu 2: Ujian Selesai -->
        <div class="info-card">
          <div class="circle-badge badge-green">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#111" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="9" y1="14" x2="15" y2="14" />
            </svg>
          </div>
          <h3>Ujian Selesai</h3>
        </div>

        <!-- Kartu 3: Hasil Ujian -->
        <div class="info-card">
          <div class="circle-badge badge-purple">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#111" stroke-width="2.6" stroke-linecap="round">
              <line x1="7" y1="18" x2="7" y2="12" />
              <line x1="12" y1="18" x2="12" y2="6" />
              <line x1="17" y1="18" x2="17" y2="13" />
            </svg>
          </div>
          <h3>Hasil Ujian</h3>
        </div>
      </section>

      <!-- 3. GRID BAWAH: UJIAN TERDEKAT (KIRI) & HASIL UJIAN AKHIR (KANAN) -->
      <section class="bottom-grid">
        <!-- KIRI: Ujian Terdekat -->
        <div class="nearest-exam-card">
          <div class="card-header">
            <div class="header-left">
              <div class="circle-badge-sm badge-soft-blue">
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
              <h2>Ujian Terdekat</h2>
            </div>

            <a href="/sessions" class="detail-link">
              Lihat Detail <span>&rsaquo;</span>
            </a>
          </div>

          <!-- Kotak Dalam Abu-abu Muda -->
          <div class="inner-session-box">
            <div class="session-content">
              <!-- TEMPAT LOGO 3: Logo Silver / Ungu di Kiri Dalam Kartu -->
              <div class="session-logo-wrap">
                {#if !cardLogoError}
                  <img
                    src={cardLogoUrl}
                    alt="Logo Sesi TOEFL"
                    class="session-logo-img"
                    onerror={() => (cardLogoError = true)}
                  />
                {:else}
                  <svg class="session-logo-fallback" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#c3cfe2" />
                        <stop offset="50%" stop-color="#a1b0cb" />
                        <stop offset="100%" stop-color="#868f96" />
                      </linearGradient>
                      <linearGradient id="ringSoftGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#b8c6db" />
                        <stop offset="100%" stop-color="#d9c2ff" />
                      </linearGradient>
                    </defs>
                    <path d="M22 28L78 16L73 33L56 37L56 85L39 90L39 41L20 45L22 28Z" fill="url(#silverGrad)" />
                    <ellipse cx="50" cy="52" rx="38" ry="12" transform="rotate(-22 50 52)" stroke="url(#ringSoftGrad)" stroke-width="5" fill="none" />
                    <path d="M82 14L85 21L92 24L85 27L82 34L79 27L72 24L79 21L82 14Z" fill="#b8c6db" />
                  </svg>
                {/if}
              </div>

              <!-- Info Sesi & Badge Status -->
              <div class="session-info">
                <div class="session-top-row">
                  <h4>{nearestExam.title}</h4>
                  <span class="status-pill registered">{nearestExam.status}</span>
                </div>

                <div class="session-meta">
                  <div class="meta-item">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#4b5563" stroke-width="1.8">
                      <rect x="3" y="4" width="18" height="17" rx="2" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                    </svg>
                    <span>{nearestExam.date}</span>
                  </div>
                  <div class="meta-item">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#111827" stroke-width="2">
                      <circle cx="12" cy="12" r="9" />
                      <polyline points="12 7 12 12 15 14" />
                    </svg>
                    <span class="meta-time">{nearestExam.time}</span>
                  </div>
                </div>
              </div>
            </div>

            <button type="button" class="full-detail-btn">
              Lihat Detail <span class="arrow">&rsaquo;</span>
            </button>
          </div>
        </div>

        <!-- KANAN: Hasil Ujian Akhir -->
        <div class="final-result-card">
          <h3>Hasil Ujian Akhir</h3>

          <!-- TEMPAT LOGO 4: Ilustrasi Clipboard TOEFL (Kanan Bawah) -->
          <div class="illustration-box">
            {#if !resultLogoError}
              <img
                src={resultLogoUrl}
                alt="Ilustrasi Hasil Ujian TOEFL"
                class="result-logo-img"
                onerror={() => (resultLogoError = true)}
              />
            {:else}
              <svg viewBox="0 0 180 120" width="150" height="105" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M35 95C20 95 10 83 12 68C14 55 26 47 38 49C45 33 64 24 83 28C99 18 122 22 132 38C148 36 164 47 166 63C168 80 155 95 138 95H35Z"
                  fill="#dce8fc"
                />
                <rect x="58" y="20" width="64" height="84" rx="7" fill="#8bb4f8" stroke="#6ea0f2" stroke-width="2" />
                <rect x="65" y="29" width="50" height="68" rx="4" fill="#ffffff" />
                <rect x="76" y="14" width="28" height="11" rx="3.5" fill="#5e7ce2" />
                <circle cx="90" cy="14" r="3.5" fill="#dce8fc" />
                <text x="90" y="52" text-anchor="middle" fill="#0b2e59" font-family="Poppins, sans-serif" font-weight="800" font-size="12">TOEFL</text>
                <rect x="73" y="59" width="34" height="3.5" rx="1.75" fill="#d0e0ff" />
                <rect x="77" y="65" width="26" height="3.5" rx="1.75" fill="#d0e0ff" />
                <circle cx="90" cy="82" r="9.5" fill="#9ec5fe" />
                <text x="90" y="86.5" text-anchor="middle" fill="#ffffff" font-family="Poppins, sans-serif" font-weight="700" font-size="13">?</text>
              </svg>
            {/if}
          </div>

          <h4>Belum Tersedia</h4>
          <p class="result-desc">
            Hasil ujian akan ditampilkan<br />
            setelah kamu menyelesaikan<br />
            sesi tes.
          </p>

          <a href="/results" class="result-pill-btn">
            Lihat Hasil Ujian <span>&rsaquo;</span>
          </a>
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

  /* ==================== SIDEBAR ==================== */
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

  /* ==================== MAIN CONTENT KANAN ==================== */
  .main-area {
    padding: 30px 38px 36px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    background: #ffffff;
  }

  /* 1. Banner Selamat Datang */
  .welcome-banner {
    background: linear-gradient(180deg, #dcf0ff 0%, #cbe6ff 100%);
    border: 1.5px solid #c2dfff;
    border-radius: 16px;
    padding: 22px 36px;
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

  .banner-logo-img {
    width: 76px;
    height: 76px;
    object-fit: contain;
  }

  .banner-logo-fallback {
    width: 74px;
    height: 74px;
  }

  /* 2. Tiga Kartu Ringkasan (Horizontal) */
  .summary-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 22px;
  }

  .info-card {
    background: #ffffff;
    border: 1.5px solid #e4e7ec;
    border-radius: 16px;
    padding: 20px 22px;
    box-shadow: 4px 5px 0 #d5d9e0, 0 6px 14px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
  }

  .circle-badge {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .badge-blue {
    background-color: #a9c7ff;
  }

  .badge-green {
    background-color: #b4f77e;
  }

  .badge-purple {
    background-color: #e39ff6;
  }

  .info-card h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #0b2e59;
  }

  /* 3. Grid Bawah (2 Kolom: Ujian Terdekat & Hasil Ujian Akhir) */
  .bottom-grid {
    display: grid;
    grid-template-columns: 1.95fr 1fr;
    gap: 22px;
    align-items: stretch;
  }

  /* Panel Kiri: Ujian Terdekat */
  .nearest-exam-card {
    background: #ffffff;
    border: 1.5px solid #e4e7ec;
    border-radius: 16px;
    padding: 20px 24px 24px;
    box-shadow: 4px 5px 0 #d5d9e0, 0 8px 18px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .circle-badge-sm {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .badge-soft-blue {
    background-color: #cbdcf7;
  }

  .card-header h2 {
    margin: 0;
    font-size: 17px;
    font-weight: 700;
    color: #0b2e59;
  }

  .detail-link {
    text-decoration: none;
    font-size: 12px;
    font-weight: 600;
    color: #2b4c7e;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .detail-link:hover {
    text-decoration: underline;
  }

  /* Kotak Abu-abu di Dalam Ujian Terdekat */
  .inner-session-box {
    background: #f5f6f8;
    border: 1.5px solid #e2e5ec;
    border-radius: 14px;
    padding: 22px 26px 20px;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .session-content {
    display: flex;
    align-items: center;
    gap: 26px;
  }

  .session-logo-wrap {
    width: 96px;
    height: 96px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .session-logo-img {
    width: 90px;
    height: 90px;
    object-fit: contain;
  }

  .session-logo-fallback {
    width: 88px;
    height: 88px;
  }

  .session-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .session-top-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .session-top-row h4 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #0b2e59;
  }

  .status-pill {
    display: inline-block;
    padding: 4px 20px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 600;
  }

  .status-pill.registered {
    background-color: #c4f9a2;
    color: #1f2937;
  }

  .session-meta {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13.5px;
    color: #374151;
  }

  .meta-time {
    font-weight: 500;
    color: #111827;
  }

  .full-detail-btn {
    width: 100%;
    padding: 10px 18px;
    border: none;
    border-radius: 999px;
    background: linear-gradient(90deg, #4b94f7 0%, #3b82f6 100%);
    color: #ffffff;
    font-family: inherit;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 3px 8px rgba(59, 130, 246, 0.3);
    transition: background 0.15s ease, transform 0.1s ease;
  }

  .full-detail-btn:hover {
    background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  }

  .full-detail-btn .arrow {
    font-size: 16px;
    line-height: 1;
  }

  /* Panel Kanan: Hasil Ujian Akhir */
  .final-result-card {
    background: #ffffff;
    border: 1.5px solid #e4e7ec;
    border-radius: 16px;
    padding: 20px 20px 22px;
    box-shadow: 4px 5px 0 #d5d9e0, 0 8px 18px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    justify-content: space-between;
  }

  .final-result-card h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #0b2e59;
  }

  .illustration-box {
    margin: 4px 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .result-logo-img {
    width: 145px;
    height: 105px;
    object-fit: contain;
  }

  .final-result-card h4 {
    margin: 0;
    font-size: 15.5px;
    font-weight: 700;
    color: #0b2e59;
  }

  .result-desc {
    margin: 4px 0 12px;
    font-size: 11px;
    line-height: 1.45;
    color: #6b7280;
  }

  .result-pill-btn {
    width: 100%;
    box-sizing: border-box;
    padding: 9px 14px;
    border-radius: 999px;
    background-color: #dce8fc;
    color: #0b2e59;
    text-decoration: none;
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: background-color 0.15s ease;
  }

  .result-pill-btn:hover {
    background-color: #c9dcfa;
  }

  @media (max-width: 960px) {
    .dashboard-shell {
      grid-template-columns: 1fr;
    }
    .summary-cards {
      grid-template-columns: 1fr;
    }
    .bottom-grid {
      grid-template-columns: 1fr;
    }
    .session-content {
      flex-direction: column;
      text-align: center;
    }
    .session-top-row {
      flex-direction: column;
    }
  }
</style>