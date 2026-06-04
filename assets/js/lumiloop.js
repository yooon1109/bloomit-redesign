(() => {
  const header = document.querySelector('[data-lumo-header]');
  const sections = [...document.querySelectorAll('.lumo-section[id]')];
  const side = document.querySelector('.lumo-side');
  const sideLinks = [...document.querySelectorAll('.lumo-side a')];
  const revealTargets = [...document.querySelectorAll('[data-reveal]')];
  const line = document.querySelector('.lumo-line');
  const darkPanel = document.querySelector('.lumo-panel-block');

  const setHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 24);
  };

  const setActiveSection = () => {
    if (!sections.length) return;
    const probe = window.scrollY + window.innerHeight * 0.45;
    let current = sections[0];
    sections.forEach((section) => {
      if (section.offsetTop <= probe) current = section;
    });
    sideLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${current.id}`);
    });
    const onDarkPanel = darkPanel
      ? (() => {
          const rect = darkPanel.getBoundingClientRect();
          const probe = window.innerHeight * 0.5;
          return rect.top <= probe && rect.bottom >= probe;
        })()
      : false;
    side?.classList.toggle('is-light', current.id === 'download' || onDarkPanel);
  };

  const setupReveal = () => {
    revealTargets.forEach((target, index) => target.style.setProperty('--delay', `${Math.min(index % 3, 2) * 70}ms`));
    if (!('IntersectionObserver' in window)) {
      revealTargets.forEach((target) => target.classList.add('is-visible'));
      line?.classList.add('is-visible');
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealTargets.forEach((target) => observer.observe(target));
    if (line) observer.observe(line);
  };

  const setupHeroSlider = () => {
    const hero = document.querySelector('.lumo-hero');
    const copy = document.querySelector('.lumo-hero-copy');
    const eyebrow = copy?.querySelector('.lumo-eyebrow');
    const title = copy?.querySelector('h1');
    const lead = copy?.querySelector('.lumo-lead');
    const pagerItems = [...document.querySelectorAll('.lumo-hero-pager span')];
    if (!hero || !copy || !eyebrow || !title || !lead || pagerItems.length < 2) return;

    const slides = [
      {
        eyebrow: 'AI Rhythm Care App',
        title: '하루의 리듬을<br />설계하는 루틴 앱',
        lead: '루미루프는 일정, 컨디션, 집중 패턴을 읽어 오늘 해야 할 일을 가장 편안한 순서로 정리해주는 가상의 AI 루틴 코치입니다.',
      },
      {
        eyebrow: 'Adaptive Routine Flow',
        title: '흐트러진 계획도<br />다시 이어지는 흐름',
        lead: '예상보다 늦어진 일정과 갑작스러운 휴식을 반영해, 남은 하루의 실행 순서를 부담 없이 다시 배열합니다.',
      },
      {
        eyebrow: 'Calm Focus Intelligence',
        title: '집중과 휴식을<br />부드럽게 연결하는 AI',
        lead: '반복되는 집중 시간과 회복 패턴을 학습해 알림 강도, 작업 단위, 회고 타이밍을 조용하게 조정합니다.',
      },
    ];

    let index = 0;
    let timer;
    const render = (nextIndex) => {
      index = (nextIndex + slides.length) % slides.length;
      copy.classList.add('is-switching');
      window.setTimeout(() => {
        const slide = slides[index];
        eyebrow.textContent = slide.eyebrow;
        title.innerHTML = slide.title;
        lead.textContent = slide.lead;
        hero.dataset.slide = String(index + 1);
        pagerItems.forEach((item, itemIndex) => {
          item.classList.toggle('is-active', itemIndex === index);
        });
        copy.classList.remove('is-switching');
      }, 220);
    };
    const restart = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => render(index + 1), 5200);
    };

    pagerItems.forEach((item, itemIndex) => {
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.addEventListener('click', () => { render(itemIndex); restart(); });
      item.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        render(itemIndex);
        restart();
      });
    });
    hero.dataset.slide = '1';
    restart();
  };

  setupHeroSlider();
  setHeader();
  setActiveSection();
  setupReveal();
  window.addEventListener('scroll', () => {
    setHeader();
    setActiveSection();
  }, { passive: true });
})();
