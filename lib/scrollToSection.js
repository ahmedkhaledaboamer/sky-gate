/**
 * Smooth-scrolls to the element with the given id. After a client-side route
 * change the target section may not be mounted yet, so keep retrying on each
 * animation frame for a short while.
 */
export function scrollToSection(id, { timeout = 2000 } = {}) {
  const start = performance.now();
  const attempt = () => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (performance.now() - start < timeout) {
      requestAnimationFrame(attempt);
    }
  };
  attempt();
}
