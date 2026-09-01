(() => {
  const key = 'exam-bridge:route-focus';
  const normalize = (pathname) => pathname.replace(/\/+$/, '') || '/';

  const focusHeading = () => {
    const heading = document.querySelector('h1');
    if (!heading) return false;
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    const announcer = document.querySelector('#route-announcer');
    const routeName = normalize(location.pathname) === '/demo' ? 'Demo' : normalize(location.pathname) === '/' ? 'Planner' : 'Page';
    if (announcer) announcer.textContent = `${routeName} loaded: ${heading.textContent.trim()}`;
    return true;
  };

  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const destination = new URL(link.href, location.href);
    if (destination.origin === location.origin && destination.pathname === location.pathname && destination.hash === '#main') {
      event.preventDefault();
      const main = document.querySelector('#main');
      main?.scrollIntoView();
      main?.focus();
      return;
    }
    if (destination.origin === location.origin && destination.pathname !== location.pathname) sessionStorage.setItem(key, normalize(destination.pathname));
  });

  const focusPending = () => {
    if (sessionStorage.getItem(key) === normalize(location.pathname) && focusHeading()) sessionStorage.removeItem(key);
  };

  document.addEventListener('DOMContentLoaded', focusPending);
  window.addEventListener('pageshow', event => {
    if (event.persisted || performance.getEntriesByType('navigation')[0]?.type === 'back_forward') focusHeading();
  });
  window.addEventListener('popstate', focusHeading);
})();
