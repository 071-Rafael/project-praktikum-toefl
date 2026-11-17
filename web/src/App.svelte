<script>
  import LoginPage from './routes/login/+page.svelte';
  import RegisterPage from './routes/register/+page.svelte';
  import DashboardPage from './routes/dashboard/+page.svelte';
  import SessionsPage from './routes/sessions/+page.svelte';
  import ExamPage from './routes/exam/+page.svelte';
  import ExamPlayPage from './routes/exam/play/+page.svelte';
  import ResultsPage from './routes/results/+page.svelte';
  import ProfilePage from './routes/profile/+page.svelte';

  let currentPath = $state(window.location.pathname);

  function handleWindowClick(event) {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const anchor = target.closest('a');
    if (anchor && anchor.href && anchor.origin === window.location.origin) {
      event.preventDefault();
      let targetPath = anchor.pathname;
      const linkText = anchor.textContent?.trim().toLowerCase();
      if (linkText === 'profile') {
        targetPath = '/profile';
      }

      window.history.pushState({}, '', targetPath);
      currentPath = targetPath;
    }
  }

  function handlePopState() {
    currentPath = window.location.pathname;
  }
</script>

<svelte:window onclick={handleWindowClick} onpopstate={handlePopState} />
<svelte:head>
  <style>
    .nav-list a.nav-item:nth-child(5):has(+ a.nav-item) {
      display: none !important;
    }
  </style>
</svelte:head>

{#if currentPath === '/register'}
  <RegisterPage />
{:else if currentPath === '/dashboard'}
  <DashboardPage />
{:else if currentPath === '/sessions'}
  <SessionsPage />
{:else if currentPath === '/exam'}
  <ExamPage />
{:else if currentPath === '/exam/play'}
  <ExamPlayPage />
{:else if currentPath === '/results'}
  <ResultsPage />
{:else if currentPath === '/profile'}
  <ProfilePage />
{:else}
  <LoginPage />
{/if}