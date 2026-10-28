<script>
  let identifier = $state('');
  let password = $state('');
  let message = $state('');
  let loading = $state(false);
  let success = $state(false);

  // Ganti '/logo.png' sesuai nama file gambar logo yang kamu simpan di folder web/public/
  let logoUrl = '/logo.png';
  let logoError = $state(false);

  async function handleLogin(event) {
    event.preventDefault();
    if (loading) return;

    message = '';
    success = false;
    loading = true;

    try {
      const value = identifier.trim();
      const body = value.includes('@')
        ? { email: value, password }
        : { name: value, password };

      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        message = result.message || 'Login gagal. Periksa Nama/Email dan Password.';
        return;
      }

      if (!result.data?.token || !result.data?.user) {
        message = 'Respons login dari server tidak lengkap.';
        return;
      }

      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));

      success = true;
      message = 'Login berhasil! Mengalihkan...';

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      message = 'Tidak bisa menghubungi server. Periksa apakah backend berjalan.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Login TOEFL</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="page">
  <div class="login-card">
    <!-- Bagian Icon / Logo di Atas -->
    <div class="logo-wrapper">
      {#if !logoError}
        <img
          src={logoUrl}
          alt="Logo TOEFL"
          class="logo-img"
          onerror={() => (logoError = true)}
        />
      {:else}
        <!-- Fallback SVG otomatis jika file /logo.png belum dimasukkan -->
        <svg class="logo-fallback" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#00c6ff" />
              <stop offset="100%" stop-color="#0052d4" />
            </linearGradient>
          </defs>
          <path d="M22 28L78 16L73 33L56 37L56 85L39 90L39 41L20 45L22 28Z" fill="url(#blueGrad)" />
          <ellipse cx="50" cy="52" rx="38" ry="12" transform="rotate(-22 50 52)" stroke="url(#blueGrad)" stroke-width="5" fill="none" />
          <path d="M82 14L85 21L92 24L85 27L82 34L79 27L72 24L79 21L82 14Z" fill="#0088ff" />
        </svg>
      {/if}
    </div>

    <h1>SELAMAT DATANG</h1>
    <p class="subtitle">Masuk ke akun kamu untuk melanjutkan.</p>

    <form onsubmit={handleLogin}>
      <div class="field">
        <label for="identifier">Nama atau Email</label>
        <div class="input-pill">
          <span class="icon" aria-hidden="true">
            <!-- Icon User Outline -->
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="#8c8c8c" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </span>
          <input
            id="identifier"
            name="identifier"
            type="text"
            placeholder="Masukkan Nama/Email"
            bind:value={identifier}
            autocomplete="username"
            required
          />
        </div>
      </div>

      <div class="field">
        <label for="password">Password</label>
        <div class="input-pill">
          <span class="icon" aria-hidden="true">
            <!-- Icon Gembok Solid -->
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#8c8c8c">
              <path d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zm-5 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm2.1-7H9.9V7a2.1 2.1 0 0 1 4.2 0v2z" />
            </svg>
          </span>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Masukkan Password"
            bind:value={password}
            autocomplete="current-password"
            required
          />
        </div>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Memproses...' : 'Login'}
      </button>
    </form>

    {#if message}
      <p class="message" class:success role="status">
        {message}
      </p>
    {/if}

    <p class="footer-text">
      Belum punya akun? <a href="/register">Daftar</a>
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

  .login-card {
    width: 100%;
    max-width: 500px;
    padding: 44px 56px 40px;
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
    margin-bottom: 18px;
  }

  .logo-img {
    height: 86px;
    width: auto;
    object-fit: contain;
  }

  .logo-fallback {
    width: 86px;
    height: 86px;
  }

  h1 {
    margin: 0 0 6px;
    font-size: 27px;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: #000000;
  }

  .subtitle {
    color: #8c8c8c;
    font-size: 13.5px;
    font-weight: 400;
    margin: 0 0 32px;
  }

  form {
    width: 100%;
    max-width: 340px;
    margin: 0 auto;
    text-align: left;
  }

  .field {
    margin-bottom: 22px;
  }

  label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #2b2b2b;
    margin-bottom: 10px;
    padding-left: 4px;
  }

  .input-pill {
    display: flex;
    align-items: center;
    background: #ffffff;
    border: 1px solid #f0f0f0;
    border-radius: 999px;
    padding: 11px 18px;
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
    font-size: 13px;
    color: #222222;
  }

  input::placeholder {
    color: #9e9e9e;
    font-weight: 400;
  }

  button {
    width: 100%;
    margin-top: 14px;
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

  button:hover:not(:disabled) {
    background-color: #0f8ad9;
  }

  button:active:not(:disabled) {
    transform: translateY(1px);
  }

  button:disabled {
    opacity: 0.65;
    cursor: wait;
  }

  .message {
    max-width: 340px;
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
    font-size: 13px;
    color: #8c8c8c;
  }

  .footer-text a {
    color: #111111;
    font-weight: 700;
    text-decoration: none;
  }

  .footer-text a:hover {
    text-decoration: underline;
  }

  @media (max-width: 480px) {
    .login-card {
      padding: 32px 24px;
    }
  }
</style>