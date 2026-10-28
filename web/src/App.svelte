<script>
  import LoginPage from './routes/login/+page.svelte';
  import RegisterPage from './routes/register/+page.svelte';

  let currentPath = $state(window.location.pathname);

  
  function handleNavigation(event) {
    const anchor = event.target.closest('a');
    if (anchor && anchor.href && anchor.origin === window.location.origin) {
      event.preventDefault();
      const targetPath = anchor.pathname;
      window.history.pushState({}, '', targetPath);
      currentPath = targetPath;
    }
  }

  $effect(() => {
    const onPopState = () => {
      currentPath = window.location.pathname;
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<main onclick={handleNavigation}>
  {#if currentPath === '/register'}
    <RegisterPage />
  {:else}
    <LoginPage />
  {/if}
</main>