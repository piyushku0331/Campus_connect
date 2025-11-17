// Small, efficient parallax enhancer
// - Applies small translate transforms to children with `data-depth` inside `.parallax-group` elements
// - Respects prefers-reduced-motion and small screens
export default function initParallax() {
  if (typeof window === 'undefined') return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 768) return; // avoid on small screens

  const groups = Array.from(document.querySelectorAll('.parallax-group'));
  if (!groups.length) return;

  let raf = null;

  const onPointerMove = (e) => {
    groups.forEach(group => {
      const rect = group.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const relX = (e.clientX - cx) / rect.width;
      const relY = (e.clientY - cy) / rect.height;

      group.querySelectorAll('[data-depth]').forEach(el => {
        const depth = parseFloat(el.getAttribute('data-depth')) || 0;
        const tx = relX * depth * 20; // tuned small values
        const ty = relY * depth * 12;
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        el.style.willChange = 'transform';
      });
    });
  };

  const handler = (e) => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => onPointerMove(e));
  };

  window.addEventListener('pointermove', handler, { passive: true });

  // Clean up in HMR environments
  if (import.meta && import.meta.hot) {
    import.meta.hot.dispose(() => {
      window.removeEventListener('pointermove', handler);
    });
  }
}
