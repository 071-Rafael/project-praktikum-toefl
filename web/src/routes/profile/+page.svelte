<script>
  import { onMount } from 'svelte';
  import { getUserStorageKey } from '../../lib/data/examQuestions.js';

  let sidebarLogoUrl = '/logo-sidebar.png';   // Logo 1: Di atas Sidebar kiri
  let bannerLogoUrl = '/logo-banner.png';     // Logo 2: Di kanan Banner Profile
  let defaultAvatarUrl = '/avatar-profile.png'; // Foto profil default (opsional)

  let sidebarLogoError = $state(false);
  let bannerLogoError = $state(false);
  let avatarImgError = $state(false);

  let activeMenu = $state('profile');

  // Data user yang sedang login
  let currentUser = $state({
    id: 1,
    name: 'Username',
    email: 'Username@gmail.com',
    participantNumber: 'TF-0213-000'
  });

  // Foto profil kustom per akun (bisa diganti lewat klik ikon kamera)
  let customAvatarDataUrl = $state('');
  let fileInputRef = $state(null);

  // Riwayat ujian milik akun ini
  let userHistory = $state([]);
  let notifActive = $state(true);
  let copySuccess = $state(false);

  // State Modal Ubah Password & Ubah Email
  let activeModal = $state(null); // null | 'password' | 'email'
  let newEmailInput = $state('');
  let currentPasswordInput = $state('');
  let newPasswordInput = $state('');
  let modalMessage = $state('');
  let modalSuccess = $state(false);

  onMount(() => {
    // 1. Ambil data user dari localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const rawId = String(parsed.id || '000').padStart(3, '0');
        currentUser = {
          id: parsed.id || 1,
          name: parsed.name || parsed.username || 'Username',
          email: parsed.email || 'Username@gmail.com',
          participantNumber: parsed.nim || parsed.participantNumber || `TF-0213-${rawId}`
        };
      } catch (e) {
        console.error(e);
      }
    }

    // 2. Ambil foto profil kustom jika user pernah mengunggah
    const savedAvatar = localStorage.getItem(getUserStorageKey('toefl_user_avatar'));
    if (savedAvatar) {
      customAvatarDataUrl = savedAvatar;
    }

    // 3. Ambil status toggle notifikasi per akun
    const savedNotif = localStorage.getItem(getUserStorageKey('toefl_user_notif'));
    if (savedNotif !== null) {
      notifActive = savedNotif === 'true';
    }

    // 4. Ambil riwayat ujian yang sudah diselesaikan oleh akun ini
    const savedHistory = localStorage.getItem(getUserStorageKey('toefl_exam_results_history'));
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
          userHistory = parsedHistory;
        }
      } catch (e) {
        userHistory = [];
      }
    }
  });

  function copyParticipantNumber() {
    navigator.clipboard?.writeText(currentUser.participantNumber);
    copySuccess = true;
    setTimeout(() => {
      copySuccess = false;
    }, 1800);
  }

  function triggerAvatarUpload() {
    if (fileInputRef) fileInputRef.click();
  }

  function handleAvatarFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        customAvatarDataUrl = reader.result;
        localStorage.setItem(getUserStorageKey('toefl_user_avatar'), reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  function toggleNotification() {
    notifActive = !notifActive;
    localStorage.setItem(getUserStorageKey('toefl_user_notif'), String(notifActive));
  }

  function openSecurityModal(type) {
    modalMessage = '';
    modalSuccess = false;
    currentPasswordInput = '';
    newPasswordInput = '';
    newEmailInput = currentUser.email;
    activeModal = type;
  }

  function closeSecurityModal() {
    activeModal = null;
  }

  function handleSaveEmail(e) {
    e.preventDefault();
    if (!newEmailInput.trim() || !newEmailInput.includes('@')) {
      modalSuccess = false;
      modalMessage = 'Masukkan alamat email yang valid.';
      return;
    }

    currentUser.email = newEmailInput.trim();
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        parsed.email = currentUser.email;
        localStorage.setItem('user', JSON.stringify(parsed));
      }
    } catch (err) {}

    modalSuccess = true;
    modalMessage = 'Email berhasil diperbarui!';
    setTimeout(() => {
      closeSecurityModal();
    }, 900);
  }

  function handleSavePassword(e) {
    e.preventDefault();
    if (!newPasswordInput || newPasswordInput.length < 4) {
      modalSuccess = false;
      modalMessage = 'Password baru minimal 4 karakter.';
      return;
    }

    modalSuccess = true;
    modalMessage = 'Password berhasil diperbarui!';
    setTimeout(() => {
      closeSecurityModal();
    }, 900);
  }
</script>

<svelte:head>
  <title>Profile - TOUFELING</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;1,700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="dashboard-bg">
  <div class="dashboard-shell">
    <!-- ==================== SIDEBAR KIRI (Tanpa Menu Sertifikat) ==================== -->
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
                <linearGradient id="sideGradProf" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#00c6ff" />
                  <stop offset="100%" stop-color="#0052d4" />
                </linearGradient>
              </defs>
              <path d="M22 28L78 16L73 33L56 37L56 85L39 90L39 41L20 45L22 28Z" fill="url(#sideGradProf)" />
              <ellipse cx="50" cy="52" rx="38" ry="12" transform="rotate(-22 50 52)" stroke="url(#sideGradProf)" stroke-width="5" fill="none" />
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

        <a href="/profile" class="nav-item" class:active={activeMenu === 'profile'}>
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#0b2e59">
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
      <!-- 1. BANNER ATAS PROFILE -->
      <section class="welcome-banner">
        <div class="banner-left-group">
          <div class="banner-user-box">
            <svg viewBox="0 0 24 24" width="34" height="34" fill="#0b2e59">
              <circle cx="12" cy="7.5" r="4.2" />
              <path d="M4 20.5c0-4.1 3.6-6.8 8-6.8s8 2.7 8 6.8" />
            </svg>
          </div>
          <div class="welcome-text">
            <h1>Profile</h1>
            <p>Kelelola informasi akun dan lihat aktivitas ujian kamu.</p>
          </div>
        </div>

        <!-- TEMPAT LOGO 2: Di Kanan Banner -->
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
                <linearGradient id="banGradProf" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#00c6ff" />
                  <stop offset="100%" stop-color="#0052d4" />
                </linearGradient>
              </defs>
              <path d="M22 28L78 16L73 33L56 37L56 85L39 90L39 41L20 45L22 28Z" fill="url(#banGradProf)" />
              <ellipse cx="50" cy="52" rx="38" ry="12" transform="rotate(-22 50 52)" stroke="url(#banGradProf)" stroke-width="5" fill="none" />
              <path d="M82 14L85 21L92 24L85 27L82 34L79 27L72 24L79 21L82 14Z" fill="#0088ff" />
            </svg>
          {/if}
        </div>
      </section>

      <!-- 2. GRID 2 KOLOM PROFILE -->
      <div class="profile-main-grid">
        <!-- KOLOM KIRI: Informasi Profile + Riwayat Ujian -->
        <div class="left-column">
          <!-- KARTU INFORMASI PROFILE -->
          <section class="panel-card">
            <div class="panel-header-blue">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="#0b2e59">
                <circle cx="12" cy="7.5" r="4.2" />
                <path d="M4.5 20c0-3.8 3.4-6.5 7.5-6.5s7.5 2.7 7.5 6.5" />
              </svg>
              <h2>Informasi Profile</h2>
            </div>

            <div class="profile-body-content">
              <!-- Foto Bulat + Tombol Kamera -->
              <div class="avatar-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  bind:this={fileInputRef}
                  onchange={handleAvatarFileChange}
                  style="display: none;"
                />

                <div class="avatar-circle">
                  {#if customAvatarDataUrl}
                    <img src={customAvatarDataUrl} alt="Foto Profile" class="avatar-img" />
                  {:else if !avatarImgError}
                    <img
                      src={defaultAvatarUrl}
                      alt="Foto Profile"
                      class="avatar-img"
                      onerror={() => (avatarImgError = true)}
                    />
                  {:else}
                    <!-- Fallback Ilustrasi Avatar Bintang Biru Muda Sesuai Gambar -->
                    <svg viewBox="0 0 140 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="skyBg" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stop-color="#9bb8d3" />
                          <stop offset="50%" stop-color="#d8e8f8" />
                          <stop offset="100%" stop-color="#b2cbe4" />
                        </linearGradient>
                      </defs>
                      <rect width="140" height="140" fill="url(#skyBg)" />
                      <circle cx="30" cy="40" r="18" fill="#ffffff" opacity="0.6" />
                      <circle cx="110" cy="55" r="22" fill="#ffffff" opacity="0.7" />
                      <polygon
                        points="70,26 82,54 112,57 89,77 96,107 70,91 44,107 51,77 28,57 58,54"
                        fill="#ffffff"
                        stroke="#5b7699"
                        stroke-width="2.5"
                        stroke-linejoin="round"
                      />
                      <circle cx="70" cy="70" r="14" fill="#3b4d66" />
                      <circle cx="65" cy="68" r="2" fill="#ffffff" />
                      <circle cx="75" cy="68" r="2" fill="#ffffff" />
                      <path d="M54 115 C54 96, 86 96, 86 115 Z" fill="#ffffff" stroke="#5b7699" stroke-width="2" />
                    </svg>
                  {/if}
                </div>

                <button
                  type="button"
                  class="camera-badge-btn"
                  onclick={triggerAvatarUpload}
                  title="Ganti Foto Profile"
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="#0b2e59">
                    <path d="M20 6h-3.2l-1.6-2H8.8L7.2 6H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8 11c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z" />
                    <circle cx="12" cy="12" r="2.6" fill="#ffffff" />
                  </svg>
                </button>
              </div>

              <!-- Detail Username, Email, Nomer Peserta, Status Akun -->
              <div class="profile-info-details">
                <h3 class="user-display-name">{currentUser.name}</h3>

                <div class="user-email-line">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#1e3a5f" stroke-width="1.8">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <polyline points="3 7 12 13 21 7" />
                  </svg>
                  <span>{currentUser.email}</span>
                </div>

                <div class="info-blue-pill-row">
                  <span class="pill-row-label">Nomer Peserta</span>
                  <div class="pill-row-right">
                    <strong class="participant-code">{currentUser.participantNumber}</strong>
                    <button
                      type="button"
                      class="copy-icon-btn"
                      onclick={copyParticipantNumber}
                      title="Salin Nomer Peserta"
                    >
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#0b2e59" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="info-blue-pill-row">
                  <span class="pill-row-label">Status Akun</span>
                  <div class="pill-row-right">
                    <span class="active-account-badge">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#1f2937" stroke-width="2.2">
                        <circle cx="12" cy="12" r="9" />
                        <polyline points="8.5 12.5 11 15 15.5 9.5" />
                      </svg>
                      <span>Aktif</span>
                    </span>
                  </div>
                </div>

                {#if copySuccess}
                  <span class="copied-toast">Nomer peserta disalin!</span>
                {/if}
              </div>
            </div>
          </section>

          <!-- KARTU RIWAYAT UJIAN DI PROFILE -->
          <section class="history-mini-card">
            <div class="history-mini-top">
              <div class="hm-left">
                <svg viewBox="0 0 28 28" width="22" height="22" fill="none">
                  <path d="M3 3v22h22" stroke="#0b2e59" stroke-width="2.6" stroke-linecap="round" />
                  <rect x="7" y="13" width="3.5" height="9" rx="1" fill="#0b2e59" />
                  <rect x="13" y="7" width="3.5" height="15" rx="1" fill="#2563eb" />
                  <rect x="19" y="16" width="3.5" height="6" rx="1" fill="#0b2e59" />
                </svg>
                <h2>Riwayat Ujian</h2>
              </div>

              <a href="/results" class="lihat-sebelumnya-btn">
                Lihat Sebelumnya
              </a>
            </div>

            <div class="mini-table-box">
              <div class="mini-table-header">
                <span>Tanggal Ujian</span>
                <span>Jenis Tes</span>
                <span>Skor</span>
                <span>Status</span>
              </div>

              {#if userHistory.length === 0}
                <!-- Tampilan default sesuai desain jika belum ada sesi, atau otomatis diganti riwayat nyata user -->
                <div class="mini-table-row">
                  <span class="col-date">12 Mei 2026</span>
                  <span class="col-type">Listening</span>
                  <strong class="col-score">560</strong>
                  <span class="col-status">
                    <span class="mini-lulus-pill">Lulus</span>
                  </span>
                </div>
              {:else}
                {#each userHistory.slice(0, 3) as item (item.id)}
                  <div class="mini-table-row">
                    <span class="col-date">{item.date}</span>
                    <span class="col-type">Listening</span>
                    <strong class="col-score">{item.totalScore}</strong>
                    <span class="col-status">
                      <span
                        class="mini-lulus-pill"
                        class:failed={item.status !== 'Lulus'}
                      >
                        {item.status}
                      </span>
                    </span>
                  </div>
                {/each}
              {/if}
            </div>
          </section>
        </div>

        <!-- KOLOM KANAN: Keamanan Akun -->
        <div class="right-column">
          <section class="panel-card security-panel">
            <div class="panel-header-blue">
              <h2>Keamanan Akun</h2>
            </div>

            <div class="security-buttons-wrap">
              <!-- Ubah Password -->
              <button
                type="button"
                class="sec-item-pill"
                onclick={() => openSecurityModal('password')}
              >
                <div class="sec-item-left">
                  <svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="#0b2e59" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="4" y="11" width="16" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                  <span>Ubah Password</span>
                </div>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#111827" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              <!-- Ubah Email -->
              <button
                type="button"
                class="sec-item-pill"
                onclick={() => openSecurityModal('email')}
              >
                <div class="sec-item-left">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#0b2e59" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <polyline points="3 7 12 13 21 7" />
                  </svg>
                  <span>Ubah Email</span>
                </div>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#111827" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              <!-- Notifikasi -->
              <div class="sec-item-pill">
                <div class="sec-item-left">
                  <svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="#0b2e59" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" fill="#9ec5ea" fill-opacity="0.45" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <span>Notifikasi</span>
                </div>

                <button
                  type="button"
                  class="notif-toggle-btn"
                  class:active={notifActive}
                  onclick={toggleNotification}
                  aria-label="Toggle Notifikasi"
                >
                  <span class="notif-knob"></span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>

  <!-- ==================== MODAL UBAH PASSWORD / EMAIL ==================== -->
  {#if activeModal}
    <div class="modal-backdrop">
      <div class="security-modal-box">
        {#if activeModal === 'email'}
          <h3>Ubah Email</h3>
          <form onsubmit={handleSaveEmail}>
            <label for="newEmail">Email Baru</label>
            <input
              id="newEmail"
              type="email"
              bind:value={newEmailInput}
              placeholder="Masukkan email baru"
              required
            />
            {#if modalMessage}
              <p class="modal-msg" class:ok={modalSuccess}>{modalMessage}</p>
            {/if}
            <div class="modal-actions">
              <button type="button" class="m-btn cancel" onclick={closeSecurityModal}>Batal</button>
              <button type="submit" class="m-btn save">Simpan</button>
            </div>
          </form>
        {:else}
          <h3>Ubah Password</h3>
          <form onsubmit={handleSavePassword}>
            <label for="currPass">Password Saat Ini</label>
            <input
              id="currPass"
              type="password"
              bind:value={currentPasswordInput}
              placeholder="Masukkan password lama"
              required
            />
            <label for="newPass">Password Baru</label>
            <input
              id="newPass"
              type="password"
              bind:value={newPasswordInput}
              placeholder="Masukkan password baru"
              required
            />
            {#if modalMessage}
              <p class="modal-msg" class:ok={modalSuccess}>{modalMessage}</p>
            {/if}
            <div class="modal-actions">
              <button type="button" class="m-btn cancel" onclick={closeSecurityModal}>Batal</button>
              <button type="submit" class="m-btn save">Simpan</button>
            </div>
          </form>
        {/if}
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
    padding: 26px 34px 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
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

  .banner-user-box {
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

  /* ==================== GRID 2 KOLOM PROFILE ==================== */
  .profile-main-grid {
    display: grid;
    grid-template-columns: 1.38fr 1fr;
    gap: 20px;
    align-items: start;
  }

  .left-column {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .panel-card {
    background: #ffffff;
    border: 1.4px solid #d5dce6;
    border-radius: 14px;
    overflow: hidden;
  }

  .panel-header-blue {
    background: linear-gradient(180deg, #dcf0ff 0%, #d2e9ff 100%);
    border-bottom: 1.2px solid #bfd8f2;
    padding: 13px 22px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .panel-header-blue h2 {
    margin: 0;
    font-size: 16.5px;
    font-weight: 800;
    color: #0b2e59;
  }

  /* Isi Informasi Profile */
  .profile-body-content {
    padding: 22px 26px 24px;
    display: flex;
    align-items: center;
    gap: 26px;
  }

  .avatar-wrapper {
    position: relative;
    width: 134px;
    height: 134px;
    flex-shrink: 0;
  }

  .avatar-circle {
    width: 134px;
    height: 134px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #d0dfef;
    background: #e6f0fa;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .camera-badge-btn {
    position: absolute;
    bottom: 4px;
    right: 6px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #ffffff;
    border: 1.4px solid #cbd5e1;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
  }

  .camera-badge-btn:hover {
    background: #f0f7ff;
  }

  .profile-info-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .user-display-name {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
    color: #0b2e59;
  }

  .user-email-line {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 10.5px;
    font-weight: 600;
    color: #1e3a5f;
    margin-bottom: 4px;
  }

  .info-blue-pill-row {
    background: #e1f0ff;
    border: 1.2px solid #b7d4f2;
    border-radius: 8px;
    padding: 8px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .pill-row-label {
    font-size: 10.5px;
    font-weight: 600;
    color: #1f2937;
  }

  .pill-row-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .participant-code {
    font-size: 10.5px;
    font-weight: 800;
    color: #0b2e59;
  }

  .copy-icon-btn {
    background: none;
    border: none;
    padding: 2px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .active-account-badge {
    background: #b6f592;
    color: #1f2937;
    padding: 3px 14px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  .copied-toast {
    font-size: 10px;
    color: #15803d;
    font-weight: 600;
  }

  /* ==================== KARTU RIWAYAT UJIAN DI PROFILE ==================== */
  .history-mini-card {
    background: #ffffff;
    border: 1.4px solid #d5dce6;
    border-radius: 14px;
    padding: 16px 20px 22px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .history-mini-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .hm-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .hm-left h2 {
    margin: 0;
    font-size: 16.5px;
    font-weight: 800;
    color: #0b2e59;
  }

  .lihat-sebelumnya-btn {
    background: #cce4ff;
    color: #0b2e59;
    text-decoration: none;
    padding: 5px 18px;
    border-radius: 999px;
    font-size: 10.5px;
    font-weight: 700;
  }

  .lihat-sebelumnya-btn:hover {
    background: #b8d8fc;
  }

  .mini-table-box {
    border: 1.2px solid #cfd8e6;
    border-radius: 10px;
    overflow: hidden;
  }

  .mini-table-header {
    background: linear-gradient(180deg, #dcf0ff 0%, #d2e9ff 100%);
    border-bottom: 1.2px solid #bfd8f2;
    padding: 12px 22px;
    display: grid;
    grid-template-columns: 1.2fr 1fr 0.8fr 1fr;
    align-items: center;
    font-size: 12px;
    font-weight: 700;
    color: #0b2e59;
  }

  .mini-table-row {
    padding: 14px 22px;
    display: grid;
    grid-template-columns: 1.2fr 1fr 0.8fr 1fr;
    align-items: center;
    border-bottom: 1px solid #e5eaf2;
    background: #ffffff;
  }

  .mini-table-row:last-child {
    border-bottom: none;
  }

  .col-date,
  .col-type {
    font-size: 12px;
    font-weight: 500;
    color: #111827;
  }

  .col-score {
    font-size: 15px;
    font-weight: 800;
    color: #0b2e59;
  }

  .mini-lulus-pill {
    display: inline-block;
    background: #b6f592;
    color: #1f2937;
    padding: 3px 16px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
  }

  .mini-lulus-pill.failed {
    background: #fca5a5;
    color: #7f1d1d;
  }

  /* ==================== KOLOM KANAN: KEAMANAN AKUN ==================== */
  .security-panel {
    min-height: 295px;
    display: flex;
    flex-direction: column;
  }

  .security-buttons-wrap {
    padding: 22px 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .sec-item-pill {
    width: 100%;
    background: #e6f2ff;
    border: 1.2px solid #bfd8f2;
    border-radius: 10px;
    padding: 13px 18px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .sec-item-pill:hover {
    background: #d8ebff;
  }

  .sec-item-left {
    display: flex;
    align-items: center;
    gap: 14px;
    font-size: 14.5px;
    font-weight: 700;
    color: #0b2e59;
  }

  /* Toggle Switch Hijau Notifikasi */
  .notif-toggle-btn {
    width: 44px;
    height: 22px;
    border-radius: 999px;
    border: none;
    background: #cbd5e1;
    padding: 2px;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: background 0.2s ease;
  }

  .notif-toggle-btn.active {
    background: #4db828;
    justify-content: flex-end;
  }

  .notif-knob {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #ffffff;
    display: inline-block;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  }

  /* ==================== MODAL KEAMANAN ==================== */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(11, 25, 44, 0.45);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    padding: 20px;
  }

  .security-modal-box {
    width: 100%;
    max-width: 380px;
    background: #ffffff;
    border: 1.5px solid #c2dfff;
    border-radius: 18px;
    padding: 24px 26px;
    box-shadow: 0 14px 34px rgba(11, 46, 89, 0.18);
  }

  .security-modal-box h3 {
    margin: 0 0 14px;
    font-size: 18px;
    font-weight: 800;
    color: #0b2e59;
  }

  .security-modal-box form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .security-modal-box label {
    font-size: 12px;
    font-weight: 600;
    color: #374151;
  }

  .security-modal-box input {
    padding: 10px 14px;
    border-radius: 10px;
    border: 1.2px solid #cbd5e1;
    font-family: inherit;
    font-size: 13px;
    outline: none;
  }

  .security-modal-box input:focus {
    border-color: #3b82f6;
  }

  .modal-msg {
    margin: 2px 0;
    font-size: 12px;
    color: #dc2626;
    font-weight: 600;
  }

  .modal-msg.ok {
    color: #15803d;
  }

  .modal-actions {
    display: flex;
    gap: 10px;
    margin-top: 8px;
  }

  .m-btn {
    flex: 1;
    padding: 9px 14px;
    border-radius: 999px;
    font-family: inherit;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
  }

  .m-btn.cancel {
    background: #ffffff;
    border: 1.2px solid #cbd5e1;
    color: #374151;
  }

  .m-btn.save {
    background: #3b82f6;
    border: none;
    color: #ffffff;
  }

  @media (max-width: 960px) {
    .dashboard-shell {
      grid-template-columns: 1fr;
    }
    .profile-main-grid {
      grid-template-columns: 1fr;
    }
    .profile-body-content {
      flex-direction: column;
      text-align: center;
    }
  }
</style>