(() => {
  const menuButton = document.querySelector('[data-ch-menu-button]');
  const menu = document.querySelector('[data-ch-menu]');
  menuButton?.addEventListener('click', () => menu?.classList.toggle('is-open'));


  const sitemap = document.querySelector('[data-ch-sitemap]');
  const openSitemap = document.querySelector('[data-ch-sitemap-open]');
  const closeSitemap = document.querySelector('[data-ch-sitemap-close]');
  const hideSitemap = () => { if (sitemap) sitemap.hidden = true; };
  openSitemap?.addEventListener('click', () => { if (sitemap) sitemap.hidden = false; });
  closeSitemap?.addEventListener('click', hideSitemap);
  sitemap?.addEventListener('click', (event) => { if (event.target === sitemap) hideSitemap(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') hideSitemap(); });

  const popup = document.querySelector('[data-ch-popup]');
  const closePopup = document.querySelector('[data-ch-popup-close]');
  closePopup?.addEventListener('click', () => { if (popup) popup.hidden = true; });

  const slides = [...document.querySelectorAll('[data-ch-slide]')];
  let index = 0;
  const setSlide = (next) => {
    if (!slides.length) return;
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
  };
  document.querySelector('[data-ch-next]')?.addEventListener('click', () => setSlide(index + 1));
  document.querySelector('[data-ch-prev]')?.addEventListener('click', () => setSlide(index - 1));
  if (slides.length) window.setInterval(() => setSlide(index + 1), 5200);

  const reveals = [...document.querySelectorAll('[data-reveal]')];
  if (!('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
  reveals.forEach((el) => observer.observe(el));
})();
