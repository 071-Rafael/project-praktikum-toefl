<script>
  let identifier = $state('');
  let password = $state('');
  let message = $state('');
  let loading = $state(false);
  let success = $state(false);

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        message = result.message || 'Login gagal. Periksa nama/email dan password.';
        return;
      }

      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));

      success = true;
      message = 'Login berhasil! Mengalihkan ke dashboard...';

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      message = 'Tidak bisa menghubungi server. Pastikan backend berjalan di port 3000.';
    } finally {
      loading = false;
    }
  }
</script>

<div class="page">
  <div class="login-card">
    <div class="logo">TOEFL APP</div>
    <h1>Selamat Datang</h1>
    <p class="subtitle">Masuk ke akun kamu untuk melanjutkan.</p>

    <form onsubmit={handleLogin}>
      <div class="field">
        <label for="identifier">Nama atau Email</label>
        <input
          id="identifier"
          type="text"
          placeholder="Masukkan nama atau email"
          bind:value={identifier}
          required
        />
      </div>

      <div class="field">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Masukkan password"
          bind:value={password}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Memproses...' : 'Login'}
      </button>
    </form>

    {#if message}
      <p class="message" class:success>{message}</p>
    {/if}
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: Arial, sans-serif;
    background: #f3f6fb;
    color: #172033;
  }
  .page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
  .login-card {
    width: 100%;
    max-width: 400px;
    padding: 36px;
    background: white;
    border-radius: 18px;
    box-shadow: 0 12px 40px rgba(30, 50, 90, 0.08);
  }
  .logo {
    color: #3157d5;
    font-weight: 800;
    font-size: 22px;
    margin-bottom: 28px;
  }
  h1 { margin: 0 0 10px; font-size: 28px; }
  .subtitle { color: #697386; margin: 0 0 28px; }
  .field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
  label { font-size: 14px; font-weight: 600; }
  input { padding: 13px 14px; border: 1px solid #d9dfeb; border-radius: 9px; outline: none; width: 100%; box-sizing: border-box; }
  input:focus { border-color: #3157d5; box-shadow: 0 0 0 3px rgba(49, 87, 213, 0.12); }
  button { width: 100%; padding: 14px; border: none; border-radius: 9px; background: #3157d5; color: white; font-weight: 700; cursor: pointer; }
  button:hover:not(:disabled) { background: #2445b5; }
  button:disabled { opacity: 0.65; cursor: wait; }
  .message { margin: 18px 0 0; padding: 12px; border-radius: 8px; background: #fff0f0; color: #b42318; font-size: 14px; }
  .message.success { background: #eaf8ef; color: #187443; }
</style>