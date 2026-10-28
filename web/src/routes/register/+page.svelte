<script>
  let name = $state('');
  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');

  let showPassword = $state(false);
  let showConfirmPassword = $state(false);

  let message = $state('');
  let loading = $state(false);
  let success = $state(false);

  let logoUrl = '/logo.png';
  let logoError = $state(false);

  const allowedEmailDomains = [
    'gmail.com',
    'googlemail.com',
    'yahoo.com',
    'yahoo.co.id',
    'ymail.com',
    'outlook.com',
    'hotmail.com',
    'live.com',
    'msn.com',
    'icloud.com',
    'me.com',
    'proton.me',
    'protonmail.com',
    'zoho.com'
  ];

  function isOfficialEmail(emailStr) {
    const parts = emailStr.split('@');
    if (parts.length !== 2 || !parts[0] || !parts[1]) return false;
    const domain = parts[1].toLowerCase();

    return (
      allowedEmailDomains.includes(domain) ||
      domain.endsWith('.ac.id') ||
      domain.endsWith('.sch.id') ||
      domain.endsWith('.edu')
    );
  }

  async function handleRegister(event) {
    event.preventDefault();
    if (loading) return;

    message = '';
    success = false;

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!isOfficialEmail(cleanEmail)) {
      message = 'Gunakan email resmi untuk mendaftar.';
      return;
    }

    if (password.length < 8) {
      message = 'Password minimal 8 karakter.';
      return;
    }

    if (password !== confirmPassword) {
      message = 'Password dan konfirmasi password tidak sama.';
      return;
    }

    loading = true;

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          password,
          confirmPassword
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        message = result.message || 'Pendaftaran gagal. Silakan periksa kembali data kamu.';
        return;
      }

      success = true;
      message = result.message || 'Pendaftaran akun berhasil! Mengalihkan ke halaman login...';

      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } catch (error) {
      console.error('Register error:', error);
      message = 'Tidak bisa menghubungi server. Periksa apakah backend berjalan.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Daftar Akun TOEFL</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="page">
  <div class="register-card">
    <div class="logo-wrapper">
      {#if !logoError}
        <img
          src={logoUrl}
          alt="Logo TOEFL"
          class="logo-img"
          onerror={() => (logoError = true)}
        />
      {:else}
        <svg class="logo-fallback" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="blueGradReg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#00c6ff" />
              <stop offset="100%" stop-color="#0052d4" />
            </linearGradient>
          </defs>
          <path d="M22 28L78 16L73 33L56 37L56 85L39 90L39 41L20 45L22 28Z" fill="url(#blueGradReg)" />
          <ellipse cx="50" cy="52" rx="38" ry="12" transform="rotate(-22 50 52)" stroke="url(#blueGradReg)" stroke-width="5" fill="none" />
          <path d="M82 14L85 21L92 24L85 27L82 34L79 27L72 24L79 21L82 14Z" fill="#0088ff" />
        </svg>
      {/if}
    </div>

    <h1>SELAMAT DATANG</h1>
    <p class="subtitle">Lengkapi data diri kamu untuk memulai.</p>

    <form onsubmit={handleRegister}>
      <!-- Nama Lengkap -->
      <div class="field">
        <label for="name">Nama Lengkap</label>
        <div class="input-pill">
          <span class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="#8c8c8c" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </span>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Masukkan Nama Lengkap kamu"
            bind:value={name}
            autocomplete="name"
            required
          />
        </div>
      </div>

      <!-- Email -->
      <div class="field">
        <label for="email">Email</label>
        <div class="input-pill">
          <span class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="#8c8c8c" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
          </span>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Masukkan email aktif kamu"
            bind:value={email}
            autocomplete="email"
            required
          />
        </div>
      </div>

      <!-- Password -->
      <div class="field">
        <label for="password">Password</label>
        <div class="input-pill">
          <span class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#8c8c8c">
              <path d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zm-5 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm2.1-7H9.9V7a2.1 2.1 0 0 1 4.2 0v2z" />
            </svg>
          </span>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Buat password (min. 8 karakter)"
            bind:value={password}
            autocomplete="new-password"
            required
          />
          <button
            type="button"
            class="toggle-eye"
            onclick={() => (showPassword = !showPassword)}
            aria-label="Tampilkan atau sembunyikan password"
          >
            {#if showPassword}
              <svg viewBox="0 0 24 24" width="19" height="19" fill="#8c8c8c">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            {:else}
              <svg viewBox="0 0 24 24" width="19" height="19" fill="#8c8c8c">
                <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
              </svg>
            {/if}
          </button>
        </div>
      </div>

      <!-- Konfirmasi Password -->
      <div class="field">
        <label for="confirmPassword">Konfirmasi Password</label>
        <div class="input-pill">
          <span class="icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#8c8c8c">
              <path d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zm-5 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm2.1-7H9.9V7a2.1 2.1 0 0 1 4.2 0v2z" />
            </svg>
          </span>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Masukkan kembali password"
            bind:value={confirmPassword}
            autocomplete="new-password"
            required
          />
          <button
            type="button"
            class="toggle-eye"
            onclick={() => (showConfirmPassword = !showConfirmPassword)}
            aria-label="Tampilkan atau sembunyikan konfirmasi password"
          >
            {#if showConfirmPassword}
              <svg viewBox="0 0 24 24" width="19" height="19" fill="#8c8c8c">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            {:else}
              <svg viewBox="0 0 24 24" width="19" height="19" fill="#8c8c8c">
                <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
              </svg>
            {/if}
          </button>
        </div>
      </div>

      <button type="submit" class="submit-btn" disabled={loading}>
        {loading ? 'Memproses...' : 'Daftar'}
      </button>
    </form>

    {#if message}
      <p class="message" class:success role="status">
        {message}
      </p>
    {/if}

    <p class="footer-text">
      Sudah punya akun? <a href="/login">Login</a>
    </p>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Poppins', Arial, Helvetica, sans-serif;
    background-color: #ebf7ff;
    color: #111111;
  }

  .page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    box-sizing: border-box;
    background-color: #ebf7ff;
  }

  .register-card {
    width: 100%;
    max-width: 520px;
    padding: 40px 56px 36px;
    background: #ffffff;
    border-radius: 26px;
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    text-align: center;
  }

  .logo-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 14px;
  }

  .logo-img {
    height: 82px;
    width: auto;
    object-fit: contain;
  }

  .logo-fallback {
    width: 82px;
    height: 82px;
  }

  h1 {
    margin: 0 0 6px;
    font-size: 26px;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: #000000;
  }

  .subtitle {
    color: #8c8c8c;
    font-size: 13px;
    font-weight: 400;
    margin: 0 0 28px;
  }

  form {
    width: 100%;
    max-width: 350px;
    margin: 0 auto;
    text-align: left;
  }

  .field {
    margin-bottom: 18px;
  }

  label {
    display: block;
    font-size: 12.5px;
    font-weight: 600;
    color: #2b2b2b;
    margin-bottom: 8px;
    padding-left: 4px;
  }

  .input-pill {
    display: flex;
    align-items: center;
    background: #ffffff;
    border: 1px solid #f0f0f0;
    border-radius: 999px;
    padding: 10px 16px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .input-pill:focus-within {
    border-color: #1ca3ec;
    box-shadow: 0 4px 12px rgba(28, 163, 236, 0.25);
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    flex-shrink: 0;
  }

  input {
    border: none;
    outline: none;
    background: transparent;
    width: 100%;
    font-family: inherit;
    font-size: 12.5px;
    color: #222222;
  }

  input::placeholder {
    color: #9e9e9e;
    font-weight: 400;
  }

  .toggle-eye {
    background: none;
    border: none;
    padding: 2px;
    margin-left: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .toggle-eye:hover svg {
    fill: #555555;
  }

  .submit-btn {
    width: 100%;
    margin-top: 12px;
    padding: 12px;
    border: none;
    border-radius: 12px;
    background-color: #199ef3;
    color: #ffffff;
    font-family: inherit;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(25, 158, 243, 0.3);
    transition: background-color 0.2s ease, transform 0.1s ease;
  }

  .submit-btn:hover:not(:disabled) {
    background-color: #0f8ad9;
  }

  .submit-btn:active:not(:disabled) {
    transform: translateY(1px);
  }

  .submit-btn:disabled {
    opacity: 0.65;
    cursor: wait;
  }

  .message {
    max-width: 350px;
    margin: 16px auto 0;
    padding: 10px 14px;
    border-radius: 10px;
    background: #fff0f0;
    color: #b42318;
    font-size: 13px;
    text-align: center;
  }

  .message.success {
    background: #eaf8ef;
    color: #187443;
  }

  .footer-text {
    margin: 18px 0 0;
    font-size: 12.5px;
    color: #8c8c8c;
  }

  .footer-text a {
    color: #111111;
    font-weight: 700;
    text-decoration: none;
    margin-left: 4px;
  }

  .footer-text a:hover {
    text-decoration: underline;
  }

  @media (max-width: 480px) {
    .register-card {
      padding: 32px 24px;
    }
  }
</style>