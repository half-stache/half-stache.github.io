// Motion and small interactions for the home page, kept deliberately small.
// Reveals: elements marked data-reveal get `is-in` when they enter the viewport.
// The Spotify player loads only on request.
export function initMotion() {
  const root = document.documentElement;

  if (root.classList.contains('js')) {
    root.classList.add('motion-ready');
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0 },
      );
      for (const el of targets) io.observe(el);
    } else {
      for (const el of targets) el.classList.add('is-in');
    }
  }

  for (const btn of document.querySelectorAll<HTMLButtonElement>('[data-load-embed]')) {
    btn.addEventListener('click', () => {
      const host = btn.closest<HTMLElement>('[data-embed]');
      if (!host) return;
      const iframe = document.createElement('iframe');
      iframe.src = host.dataset.embed || '';
      iframe.title = 'Spotify player';
      iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
      iframe.loading = 'lazy';
      host.replaceChildren(iframe);
    });
  }
}
