<script>
  import { onMount } from 'svelte';
  import { getUserStorageKey } from '../../lib/data/examQuestions.js';

  let sidebarLogoUrl = '/logo-sidebar.png';
  let bannerLogoUrl = '/logo-banner.png';
  let sidebarLogoError = $state(false);
  let bannerLogoError = $state(false);
  let activeMenu = $state('jadwal');
  let searchQuery = $state('');
  let selectedFilter = $state('Semua');
  let currentPage = $state(1);

  // Daftar sesi awal untuk setiap akun baru
  const defaultSessions = [
    {
      id: 1,
      title: 'TOEFL-Sesi 1',
      date: '12 Mei 2026',
      time: '12.00 - 13.00 WIB',
      location: 'Online / Ruang Utama',
      status: 'Tersedia',
      category: 'Tersedia'
    },
    {
      id: 2,
      title: 'TOEFL-Sesi 2',
      date: '21 Mei 2026',
      time: '13.00 - 15.00 WIB',
      location: 'Lab Bahasa 1',
      status: 'Tersedia',
      category: 'Tersedia'
    },
    {
      id: 3,
      title: 'TOEFL-Sesi 3',
      date: '13 Juni 2026',
      time: '08.00 - 10.00 WIB',
      location: 'Lab Bahasa 2',
      status: 'Tersedia',
      category: 'Tersedia'
    },
    {
      id: 4,
      title: 'TOEFL-Sesi 4',
      date: '20 Juni 2026',
      time: '09.00 - 11.00 WIB',
      location: 'Lab Bahasa 1',
      status: 'Tersedia',
      category: 'Tersedia'
    },
    {
      id: 5,
      title: 'TOEFL-Sesi 5',
      date: '27 Juni 2026',
      time: '13.00 - 15.00 WIB',
      location: 'Online Zoom',
      status: 'Tersedia',
      category: 'Tersedia'
    },
    {
      id: 6,
      title: 'TOEFL-Sesi 6',
      date: '04 Juli 2026',
      time: '08.00 - 10.00 WIB',
      location: 'Aula Kampus',
      status: 'Selesai',
      category: 'Selesai'
    },
    {
      id: 7,
      title: 'TOEFL-Sesi 7',
      date: '11 Juli 2026',
      time: '10.00 - 12.00 WIB',
      location: 'Lab Bahasa 2',
      status: 'Selesai',
      category: 'Selesai'
    },
    {
      id: 8,
      title: 'TOEFL-Sesi 8',
      date: '18 Juli 2026',
      time: '13.00 - 15.00 WIB',
      location: 'Lab Bahasa 1',
      status: 'Tersedia',
      category: 'Tersedia'
    }
  ];

  let sessions = $state([...defaultSessions]);

  onMount(() => {
    // Membaca daftar sesi khusus milik akun yang sedang login
    const userSessionsKey = getUserStorageKey('toefl_sessions_list');
    const savedSessions = localStorage.getItem(userSessionsKey);
    if (savedSessions) {
      try {
        sessions = JSON.parse(savedSessions);
      } catch (e) {
        sessions = [...defaultSessions];
      }
    } else {
      sessions = [...defaultSessions];
    }
  });

  const itemsPerPage = 3;

  let filteredSessions = $derived(
    sessions.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.date.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;
      if (selectedFilter === 'Semua') return true;
      if (selectedFilter === 'Tersedia') {
        return item.status === 'Tersedia' || item.status === 'Terdaftar';
      }
      if (selectedFilter === 'Selesai') {
        return item.status === 'Selesai';
      }
      return true;
    })
  );

  let totalPages = $derived(Math.max(1, Math.ceil(filteredSessions.length / itemsPerPage)));

  let paginatedSessions = $derived(
    filteredSessions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  );

  function setFilter(filterName) {
    selectedFilter = filterName;
    currentPage = 1;
  }

  function handleRegisterSession(sessionId) {
    sessions = sessions.map((s) =>
      s.id === sessionId ? { ...s, status: 'Terdaftar' } : s
    );
    // Simpan ke localStorage spesifik untuk akun yang sedang login
    localStorage.setItem(getUserStorageKey('toefl_sessions_list'), JSON.stringify(sessions));
    localStorage.setItem(getUserStorageKey(`toefl_exam_status_${sessionId}`), 'not_started');

    const registeredItem = sessions.find((s) => s.id === sessionId);
    if (registeredItem) {
      localStorage.setItem(
        getUserStorageKey('toefl_active_session'),
        JSON.stringify(registeredItem)
      );
    }
  }

  function handleViewDetail(sessionItem) {
    localStorage.setItem(
      getUserStorageKey('toefl_active_session'),
      JSON.stringify(sessionItem)
    );
    window.history.pushState({}, '', '/exam');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
</script>

<svelte:head>
  <title>Jadwal Tes - TOUFELING</title>
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
      <!-- 1. BANNER JADWAL TES + LOGO KANAN -->
      <section class="welcome-banner">
        <div class="welcome-text">
          <h1>Jadwal Tes</h1>
          <p>
            Siap mengikuti ujian TOEFL dan raih<br />
            masa depan yang lebih baik!
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

      <!-- 2. BAR PENCARIAN & TOMBOL FILTER -->
      <section class="filter-bar">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="20" y1="20" x2="16.2" y2="16.2" />
          </svg>
          <input
            type="text"
            placeholder="Cari nama sesi atau lokasi..."
            bind:value={searchQuery}
            oninput={() => (currentPage = 1)}
          />
        </div>
        <div class="filter-pills">
          <button
            type="button"
            class="pill-btn"
            class:active={selectedFilter === 'Semua'}
            onclick={() => setFilter('Semua')}
          >
            Semua
          </button>
          <button
            type="button"
            class="pill-btn"
            class:active={selectedFilter === 'Tersedia'}
            onclick={() => setFilter('Tersedia')}
          >
            Tersedia
          </button>
          <button
            type="button"
            class="pill-btn"
            class:active={selectedFilter === 'Selesai'}
            onclick={() => setFilter('Selesai')}
          >
            Selesai
          </button>
        </div>
      </section>

      <!-- 3. PANEL DAFTAR JADWAL TES MENDATANG -->
      <section class="schedule-outer-card">
        <div class="schedule-inner-panel">
          <h2>Jadwal Tes Mendatang</h2>
          <div class="session-list">
            {#if paginatedSessions.length === 0}
              <div class="empty-state">Tidak ada sesi tes yang sesuai dengan pencarian.</div>
            {:else}
              {#each paginatedSessions as item (item.id)}
                <div class="session-row-card">
                  <!-- Kolom Kiri: Ikon Kalender + Nama Sesi -->
                  <div class="col-title">
                    <div class="cal-circle">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#111" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
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
                    <h3>{item.title}</h3>
                  </div>

                  <!-- Kolom Tengah: Tanggal & Waktu -->
                  <div class="col-datetime">
                    <div class="dt-item">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#555" stroke-width="1.8">
                        <rect x="3" y="4" width="18" height="17" rx="2" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="3" y1="9" x2="21" y2="9" />
                      </svg>
                      <span>{item.date}</span>
                    </div>
                    <div class="dt-item">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#111" stroke-width="2">
                        <circle cx="12" cy="12" r="9" />
                        <polyline points="12 7 12 12 15 14" />
                      </svg>
                      <span>{item.time}</span>
                    </div>
                  </div>

                  <!-- Kolom Status Badge -->
                  <div class="col-status">
                    <span
                      class="badge-status"
                      class:registered={item.status === 'Terdaftar'}
                      class:available={item.status === 'Tersedia'}
                      class:done={item.status === 'Selesai'}
                    >
                      {item.status}
                    </span>
                  </div>

                  <!-- Kolom Kanan: Tombol Aksi -->
                  <div class="col-action">
                    {#if item.status === 'Terdaftar'}
                      <button
                        type="button"
                        class="action-btn outline"
                        onclick={() => handleViewDetail(item)}
                      >
                        Lihat Detail
                      </button>
                    {:else if item.status === 'Tersedia'}
                      <button
                        type="button"
                        class="action-btn primary"
                        onclick={() => handleRegisterSession(item.id)}
                      >
                        Daftar Tes
                      </button>
                    {:else}
                      <button type="button" class="action-btn outline" disabled>
                        Selesai
                      </button>
                    {/if}
                  </div>
                </div>
              {/each}
            {/if}
          </div>

          <!-- Footer Tabel & Pagination -->
          <div class="schedule-footer">
            <div class="showing-text">
              {#if filteredSessions.length > 0}
                Menampilkan {(currentPage - 1) * itemsPerPage + 1}-{Math.min(
                  currentPage * itemsPerPage,
                  filteredSessions.length
                )} dari {filteredSessions.length} sesi
              {:else}
                Menampilkan 0 sesi
              {/if}
            </div>
            <div class="pagination">
              <button
                type="button"
                class="page-btn"
                disabled={currentPage === 1}
                onclick={() => (currentPage = Math.max(1, currentPage - 1))}
              >
                &lsaquo;
              </button>
              {#each Array.from({ length: totalPages }, (_, i) => i + 1) as pageNum}
                <button
                  type="button"
                  class="page-btn"
                  class:active={currentPage === pageNum}
                  onclick={() => (currentPage = pageNum)}
                >
                  {pageNum}
                </button>
              {/each}
              <button
                type="button"
                class="page-btn"
                disabled={currentPage === totalPages}
                onclick={() => (currentPage = Math.min(totalPages, currentPage + 1))}
              >
                &rsaquo;
              </button>
            </div>
          </div>
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
    gap: 20px;
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
  .banner-logo-img {
    width: 76px;
    height: 76px;
    object-fit: contain;
  }
  .banner-logo-fallback {
    width: 74px;
    height: 74px;
  }
  .filter-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-top: 2px;
  }
  .search-box {
    flex: 1;
    max-width: 470px;
    display: flex;
    align-items: center;
    gap: 12px;
    background: #ffffff;
    border: 1.5px solid #e1e5eb;
    border-radius: 999px;
    padding: 10px 20px;
    box-shadow: 0 3px 0 #d5d9e0, 0 4px 10px rgba(0, 0, 0, 0.03);
  }
  .search-icon {
    flex-shrink: 0;
  }
  .search-box input {
    border: none;
    outline: none;
    width: 100%;
    font-family: inherit;
    font-size: 12.5px;
    color: #1f2937;
    background: transparent;
  }
  .search-box input::placeholder {
    color: #b6beca;
  }
  .filter-pills {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .pill-btn {
    min-width: 104px;
    padding: 9px 22px;
    border-radius: 999px;
    border: 1.5px solid #e1e5eb;
    background: #ffffff;
    color: #1f2937;
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 3px 0 #d5d9e0;
    transition: all 0.15s ease;
  }
  .pill-btn:hover {
    background: #f3f7fc;
  }
  .pill-btn.active {
    background: #5b7bb2;
    border-color: #5b7bb2;
    color: #ffffff;
    box-shadow: 0 3px 0 #466291;
  }
  .schedule-outer-card {
    background: #ffffff;
    border: 1.5px solid #e2e6ee;
    border-radius: 16px;
    padding: 16px;
    box-shadow: 4px 6px 0 #d5d9e0, 0 8px 20px rgba(0, 0, 0, 0.04);
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .schedule-inner-panel {
    background: #fbfbfc;
    border: 1px solid #eceff5;
    border-radius: 12px;
    padding: 20px 24px 18px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .schedule-inner-panel h2 {
    margin: 0 0 16px;
    font-size: 16.5px;
    font-weight: 700;
    color: #0b2e59;
  }
  .session-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .empty-state {
    text-align: center;
    padding: 36px 16px;
    color: #7d93a8;
    font-size: 13.5px;
  }
  .session-row-card {
    background: #ffffff;
    border: 1.2px solid #dcdfe6;
    border-radius: 10px;
    padding: 14px 26px;
    display: grid;
    grid-template-columns: 1.3fr 1.2fr 0.9fr auto;
    align-items: center;
    gap: 16px;
  }
  .col-title {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .cal-circle {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: #b4cef8;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .col-title h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: #0b2e59;
  }
  .col-datetime {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .dt-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11.5px;
    font-weight: 500;
    color: #2c3545;
  }
  .col-status {
    display: flex;
    justify-content: center;
  }
  .badge-status {
    display: inline-block;
    min-width: 82px;
    text-align: center;
    padding: 4px 16px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
  }
  .badge-status.registered {
    background-color: #c4f9a2;
    color: #1f2937;
  }
  .badge-status.available {
    background-color: #bdd7fb;
    color: #1e3a6d;
  }
  .badge-status.done {
    background-color: #e5e7eb;
    color: #4b5563;
  }
  .col-action {
    display: flex;
    justify-content: flex-end;
  }
  .action-btn {
    min-width: 108px;
    padding: 8px 18px;
    border-radius: 6px;
    font-family: inherit;
    font-size: 11.5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .action-btn.outline {
    background: #ffffff;
    border: 1.2px solid #cfd5e0;
    color: #1f2937;
  }
  .action-btn.outline:hover:not(:disabled) {
    background: #f3f6fb;
  }
  .action-btn.primary {
    background: #66a3ff;
    border: 1.2px solid #5897f5;
    color: #0b2545;
  }
  .action-btn.primary:hover {
    background: #4f93fa;
  }
  .schedule-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    padding-top: 4px;
  }
  .showing-text {
    font-size: 11.5px;
    color: #374151;
    font-weight: 500;
  }
  .pagination {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .page-btn {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    border: 1px solid #d1d5db;
    background: #ffffff;
    color: #374151;
    font-family: inherit;
    font-size: 11px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
  }
  .page-btn.active {
    background: #66a3ff;
    border-color: #5897f5;
    color: #ffffff;
  }
  .page-btn:disabled {
    opacity: 0.45;
    cursor: default;
  }
  @media (max-width: 960px) {
    .dashboard-shell {
      grid-template-columns: 1fr;
    }
    .filter-bar {
      flex-direction: column;
      align-items: stretch;
    }
    .search-box {
      max-width: 100%;
    }
    .session-row-card {
      grid-template-columns: 1fr;
      text-align: left;
    }
    .col-status,
    .col-action {
      justify-content: flex-start;
    }
  }
</style>