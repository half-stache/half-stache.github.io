// Entrance motion for the home page, kept deliberately small.
// Hero lines rise in with CSS keyframes once the html element carries the `js` class.
// Sections reveal when they enter the viewport; this script only adds a class.
// The head script in Base.astro removes `js` if this never runs, so content is never stuck hidden.
export function initMotion() {
  const root = document.documentElement;
  if (!root.classList.contains('js')) return;
  root.classList.add('motion-ready');

  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (!('IntersectionObserver' in window)) {
    for (const el of targets) el.classList.add('is-in');
    return;
  }
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
}
