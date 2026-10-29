<script>
  import LoginPage from './routes/login/+page.svelte';
  import RegisterPage from './routes/register/+page.svelte';
  import DashboardPage from './routes/dashboard/+page.svelte';

  let currentPath = $state(window.location.pathname);

  function handleWindowClick(event) {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const anchor = target.closest('a');
    if (anchor && anchor.href && anchor.origin === window.location.origin) {
      event.preventDefault();
      const targetPath = anchor.pathname;
      window.history.pushState({}, '', targetPath);
      currentPath = targetPath;
    }
  }

  function handlePopState() {
    currentPath = window.location.pathname;
  }
</script>

<svelte:window onclick={handleWindowClick} onpopstate={handlePopState} />

{#if currentPath === '/register'}
  <RegisterPage />
{:else if currentPath === '/dashboard'}
  <DashboardPage />
{:else}
  <LoginPage />
{/if}