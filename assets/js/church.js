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
  const hidePopupToday = document.querySelector('[data-ch-popup-hide-today]');
  const todayKey = new Date().toISOString().slice(0, 10);
  if (popup && window.localStorage.getItem('bitsaem-popup-hidden') === todayKey) popup.hidden = true;
  closePopup?.addEventListener('click', () => {
    if (hidePopupToday?.checked) window.localStorage.setItem('bitsaem-popup-hidden', todayKey);
    if (popup) popup.hidden = true;
  });

  const boardTabs = [...document.querySelectorAll('[data-ch-board-filter]')];
  const boardRows = [...document.querySelectorAll('[data-ch-board-row]')];
  const boardPages = [...document.querySelectorAll('[data-ch-page]')];
  const boardNextPage = document.querySelector('[data-ch-page-next]');
  const boardEmpty = document.querySelector('[data-ch-board-empty]');
  let activeBoardFilter = '전체';
  let activeBoardPage = 1;
  const getVisiblePages = () => {
    const pages = boardRows
      .filter((row) => activeBoardFilter === '전체' || row.dataset.chBoardCategory === activeBoardFilter)
      .map((row) => Number(row.dataset.chBoardPage || 1));
    return [...new Set(pages)].sort((a, b) => a - b);
  };
  const updateBoard = () => {
    const visiblePages = getVisiblePages();
    if (!visiblePages.includes(activeBoardPage)) activeBoardPage = visiblePages[0] || 1;
    let visibleCount = 0;
    boardTabs.forEach((tab) => {
      const isActive = tab.dataset.chBoardFilter === activeBoardFilter;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });
    boardPages.forEach((pageLink) => {
      const page = Number(pageLink.dataset.chPage || 1);
      const isAvailable = visiblePages.includes(page);
      const isActive = page === activeBoardPage;
      pageLink.hidden = !isAvailable;
      pageLink.classList.toggle('is-active', isActive);
      pageLink.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
    if (boardNextPage) boardNextPage.hidden = visiblePages.length <= 1;
    boardRows.forEach((row) => {
      const matchesFilter = activeBoardFilter === '전체' || row.dataset.chBoardCategory === activeBoardFilter;
      const matchesPage = Number(row.dataset.chBoardPage || 1) === activeBoardPage;
      const isVisible = matchesFilter && matchesPage;
      row.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });
    if (boardEmpty) boardEmpty.hidden = visibleCount > 0;
  };
  boardTabs.forEach((tab) => {
    tab.setAttribute('role', 'tab');
    tab.addEventListener('click', (event) => {
      event.preventDefault();
      activeBoardFilter = tab.dataset.chBoardFilter || '전체';
      activeBoardPage = 1;
      updateBoard();
    });
  });
  boardPages.forEach((pageLink) => {
    pageLink.addEventListener('click', (event) => {
      event.preventDefault();
      activeBoardPage = Number(pageLink.dataset.chPage || 1);
      updateBoard();
    });
  });
  boardNextPage?.addEventListener('click', (event) => {
    event.preventDefault();
    const visiblePages = getVisiblePages();
    const currentIndex = visiblePages.indexOf(activeBoardPage);
    activeBoardPage = visiblePages[(currentIndex + 1) % visiblePages.length] || 1;
    updateBoard();
  });
  if (boardTabs.length && boardRows.length) updateBoard();

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
