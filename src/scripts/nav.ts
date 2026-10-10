// Navigation on every page: the header compacts once the page scrolls, the primary nav marks the
// section in view on the home page, and the back-to-top control appears after the first screen.
export function initNav() {
  const header = document.querySelector<HTMLElement>('.site-head');
  const sentinel = document.querySelector<HTMLElement>('[data-head-sentinel]');
  const hasIO = 'IntersectionObserver' in window;

  if (header && sentinel && hasIO) {
    new IntersectionObserver(([entry]) => header.classList.toggle('is-stuck', !entry.isIntersecting), { threshold: 0 }).observe(sentinel);
  }

  // Scroll spy: the current section is the last one, in page order, whose top has passed the header.
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.site-nav a[href^="#"]'));
  const sections = links
    .map((a) => ({ a, el: document.querySelector<HTMLElement>(a.getAttribute('href') || '') }))
    .filter((s): s is { a: HTMLAnchorElement; el: HTMLElement } => Boolean(s.el));
  if (sections.length && hasIO) {
    const offset = () => (header ? header.offsetHeight : 0) + 8;
    const update = () => {
      const y = offset();
      let current: HTMLElement | null = null;
      for (const s of sections) {
        if (s.el.getBoundingClientRect().top <= y) current = s.el;
      }
      // Past the last section's end (the footer), keep the last section marked.
      for (const s of sections) {
        if (s.el === current) s.a.setAttribute('aria-current', 'true');
        else s.a.removeAttribute('aria-current');
      }
    };
    const io = new IntersectionObserver(update, { rootMargin: '-10% 0px -50% 0px', threshold: [0, 0.1, 0.5, 1] });
    for (const s of sections) io.observe(s.el);
    let ticking = false;
    addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { update(); ticking = false; });
    }, { passive: true });
    update();
  }

  // Back to top: visible after the first screen, scrolls home, and hands focus to the brand link.
  const toTop = document.querySelector<HTMLAnchorElement>('[data-to-top]');
  if (toTop) {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    let ticking = false;
    const show = () => toTop.classList.toggle('is-visible', scrollY > innerHeight * 0.8);
    addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { show(); ticking = false; });
    }, { passive: true });
    show();
    toTop.addEventListener('click', (e) => {
      e.preventDefault();
      scrollTo({ top: 0, behavior: reduce.matches ? 'auto' : 'smooth' });
      const brand = document.querySelector<HTMLElement>('.brand');
      brand?.focus({ preventScroll: true });
    });
  }
}
