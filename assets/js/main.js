(() => {
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".nav-links a[href^='#']")];

  const setActiveLink = () => {
    if (!sections.length || !navLinks.length) return;
    const y = window.scrollY + 130;
    let current = sections[0].id;

    for (const section of sections) {
      if (section.offsetTop <= y) current = section.id;
    }

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${current}`);
    });
  };

  const setupReveal = () => {
    const targets = [
      ".section-head",
      ".service-card",
      ".case-card",
      ".process-list li",
      ".guide-grid",
      ".faq-list details",
      ".cta-panel",
      "fieldset",
      ".summary-panel",
      ".template-card",
      ".included-list div",
      ".template-process li",
      ".price-card",
      ".store-section-head",
    ]
      .map((selector) => [...document.querySelectorAll(selector)])
      .flat();

    targets.forEach((target, index) => {
      target.classList.add("reveal");
      target.style.setProperty("--delay", `${Math.min(index % 4, 3) * 28}ms`);
    });

    if (!("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px 8% 0px" },
    );

    targets.forEach((target) => observer.observe(target));
  };

  const setupInquiry = () => {
    const form = document.querySelector("[data-inquiry-form]");
    if (!form) return;

    const purposeContainer = document.querySelector("[data-purpose-options]");
    const summary = document.querySelector("[data-summary]");
    const mailto = document.querySelector("[data-mailto]");
    const copyButton = document.querySelector("[data-copy-summary]");

    const purposes = {
      "홈페이지/랜딩 페이지": [
        "회사 소개",
        "서비스 소개",
        "문의/신청 전환",
        "검색 노출",
      ],
      "모바일 앱/웹앱": [
        "신규 앱 출시",
        "기존 서비스 앱 전환",
        "커뮤니티/콘텐츠",
        "거래/예약",
      ],
      "플랫폼/마켓플레이스": [
        "판매자-구매자 매칭",
        "예약/주문",
        "커뮤니티 운영",
        "정산/승인 관리",
      ],
      "관리자/업무 프로그램": [
        "엑셀 업무 자동화",
        "고객/회원 관리",
        "상품/콘텐츠 관리",
        "내부 승인/조회",
      ],
    };

    const checkedValues = (name) =>
      [...form.querySelectorAll(`[name='${name}']:checked`)].map((input) => input.value);

    const fieldValue = (name) => form.elements[name]?.value || "";

    const renderPurposes = () => {
      const type = fieldValue("type") || "홈페이지/랜딩 페이지";
      purposeContainer.innerHTML = (purposes[type] || [])
        .map(
          (purpose, index) => `
            <label>
              <input type="checkbox" name="purpose" value="${purpose}" ${index === 0 ? "checked" : ""} />
              ${purpose}
            </label>
          `,
        )
        .join("");
    };

    const buildSummary = () =>
      [
        "[Bloomit 프로젝트 문의]",
        "",
        `제작 형태: ${fieldValue("type") || "미정"}`,
        `목적: ${checkedValues("purpose").join(", ") || "상담 후 결정"}`,
        `필요 기능: ${checkedValues("feature").join(", ") || "상담 후 결정"}`,
        `예상 일정: ${fieldValue("timeline")}`,
        `예상 예산: ${fieldValue("budget")}`,
        "",
        "[간단한 설명]",
        fieldValue("message") || "아직 작성 전",
      ].join("\n");

    const updateSummary = () => {
      const text = buildSummary();
      summary.textContent = text;
      const subject = encodeURIComponent(`[Bloomit 문의] ${fieldValue("type") || "프로젝트"} 상담 요청`);
      const body = encodeURIComponent(text);
      mailto.href = `mailto:hello@bloomit.co.kr?subject=${subject}&body=${body}`;
    };

    form.addEventListener("change", (event) => {
      if (event.target.name === "type") renderPurposes();
      updateSummary();
    });

    form.addEventListener("input", updateSummary);

    copyButton?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(buildSummary());
        copyButton.textContent = "복사 완료";
        setTimeout(() => {
          copyButton.textContent = "요약 복사";
        }, 1300);
      } catch {
        summary.focus();
      }
    });

    renderPurposes();
    updateSummary();
  };

  const setupLegalTemplate = () => {
    const page = document.querySelector('.legal-template-page');
    if (!page) return;

    const modal = document.querySelector('[data-legal-modal]');
    const modalTitle = modal?.querySelector('#modal-title');
    const modalBody = modal?.querySelector('[data-modal-body]');
    const openModal = (title, body) => {
      if (!modal || !modalTitle || !modalBody) return;
      modalTitle.textContent = title;
      modalBody.textContent = body;
      modal.hidden = false;
      modal.querySelector('[data-modal-close]')?.focus();
    };
    const closeModal = () => {
      if (modal) modal.hidden = true;
    };

    document.querySelectorAll('[data-case-filter]').forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.caseFilter;
        document.querySelectorAll('[data-case-filter]').forEach((item) => item.classList.toggle('is-active', item === button));
        document.querySelectorAll('[data-case]').forEach((card) => {
          card.hidden = filter !== 'all' && card.dataset.case !== filter;
        });
      });
    });

    document.querySelectorAll('[data-case-open]').forEach((button) => {
      button.addEventListener('click', () => {
        const card = button.closest('[data-case]');
        openModal(card?.dataset.title || '사건 상세', card?.dataset.detail || '상세 내용을 준비 중입니다.');
      });
    });

    const roadmap = document.querySelector('[data-roadmap]');
    const roadmaps = {
      defense: [
        ['초기 상담', '사건 발생 경위, 연락 기록, 증거 위치를 먼저 정리합니다.'],
        ['조사 준비', '예상 질문과 진술 범위를 검토하고 제출 자료를 선별합니다.'],
        ['수사 대응', '조사 동석, 의견서, 추가 자료 제출 일정을 관리합니다.'],
        ['공판 대응', '쟁점별 주장과 양형자료를 구조화해 재판 단계에 대비합니다.'],
        ['종결 관리', '결과 통지 이후 필요한 후속 조치와 재발 방지 계획을 안내합니다.'],
      ],
      claim: [
        ['사실관계 정리', '피해 내용과 손해 범위를 문서·메시지·거래내역으로 구분합니다.'],
        ['증거 수집', '상대방 주장에 대비해 객관 자료와 진술 자료를 확보합니다.'],
        ['청구 전략', '고소, 내용증명, 소장 등 절차별 장단점을 비교합니다.'],
        ['협상·소송', '합의 가능성과 법적 절차를 병행해 회복 가능성을 높입니다.'],
        ['집행·마무리', '판결·조정 이후 이행 확인과 추가 조치를 관리합니다.'],
      ],
    };
    const renderRoadmap = (type = 'defense') => {
      if (!roadmap) return;
      roadmap.innerHTML = roadmaps[type].map(([title, body]) => `
        <article><div><h3>${title}</h3><p>${body}</p></div></article>
      `).join('');
    };
    document.querySelectorAll('[data-strategy-tab]').forEach((button) => {
      button.addEventListener('click', () => {
        document.querySelectorAll('[data-strategy-tab]').forEach((item) => item.classList.toggle('is-active', item === button));
        renderRoadmap(button.dataset.strategyTab);
      });
    });
    renderRoadmap();

    const legalForm = document.querySelector('[data-legal-form]');
    const formStatus = document.querySelector('[data-form-status]');
    legalForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(legalForm);
      const name = `${data.get('name') || ''}`.trim();
      const phone = `${data.get('phone') || ''}`.replace(/[^0-9]/g, '');
      const consent = data.get('consent');
      if (!name || phone.length < 8) {
        formStatus.textContent = '이름과 연락처를 확인해주세요.';
        return;
      }
      if (!consent) {
        formStatus.textContent = '개인정보 수집 및 이용 동의가 필요합니다.';
        return;
      }
      formStatus.textContent = `${name}님, ${data.get('category')} 상담 신청 데모가 접수되었습니다.`;
    });

    document.querySelector('[data-quick-form]')?.addEventListener('submit', (event) => {
      event.preventDefault();
      openModal('빠른 상담 신청 데모', '실제 운영 시 이 입력값은 이메일, 알림톡, CRM 또는 관리자 페이지로 연결할 수 있습니다.');
    });
    document.querySelector('[data-privacy-open]')?.addEventListener('click', () => {
      openModal('개인정보 수집 및 이용 안내', '상담 접수를 위해 이름, 연락처, 상담 내용을 수집하는 예시 문구입니다. 실제 운영 시 보유 기간, 수탁사, 파기 절차를 사업자 정책에 맞게 교체해야 합니다.');
    });
    modal?.querySelector('[data-modal-close]')?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (event) => {
      if (event.target === modal) closeModal();
    });
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeModal();
    });
  };


  const setupBaekhwaTemplateInteractions = () => {
    const page = document.querySelector('.baekhwa-reference-template');
    if (!page) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updateScrolled = () => {
      page.classList.toggle('bh-scrolled', window.scrollY > 12);
      const hero = document.querySelector('.bh-visual');
      if (!hero || reduceMotion) return;
      const rect = hero.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, hero.offsetHeight * 0.72)));
      page.style.setProperty('--bh-parallax', progress.toFixed(3));
    };
    window.addEventListener('scroll', updateScrolled, { passive: true });
    updateScrolled();

    const revealTargets = [
      '.bh-title', '.bh-career-panel', '.bh-lawyer-card', '.bh-filter', '.bh-case-rail article',
      '.bh-phone', '.bh-comm-card', '.bh-strategy-copy h2', '.bh-tabs', '.bh-roadmap article',
      '.bh-writing-title', '.bh-compare article', '.bh-consult-photo', '.bh-consult-form-wrap'
    ].join(',');
    const targets = [...document.querySelectorAll(revealTargets)];
    targets.forEach((el, index) => {
      el.classList.add('bh-reveal');
      el.style.setProperty('--bh-delay', `${Math.min(index % 5, 4) * 45}ms`);
    });
    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
      targets.forEach((el) => io.observe(el));
    }

    const lawyerCards = [...document.querySelectorAll('.bh-lawyer-card')];
    lawyerCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        lawyerCards.forEach((item) => item.classList.toggle('is-focused', item === card));
      });
      card.addEventListener('mouseleave', () => lawyerCards.forEach((item) => item.classList.remove('is-focused')));
      card.addEventListener('click', () => {
        lawyerCards.forEach((item) => item.classList.toggle('is-main', item === card));
      });
    });

    const makeDragScroll = (el) => {
      if (!el) return;
      let down = false;
      let startX = 0;
      let startLeft = 0;
      el.addEventListener('pointerdown', (event) => {
        down = true;
        startX = event.clientX;
        startLeft = el.scrollLeft;
        el.classList.add('is-dragging');
        el.setPointerCapture?.(event.pointerId);
      });
      el.addEventListener('pointermove', (event) => {
        if (!down) return;
        el.scrollLeft = startLeft - (event.clientX - startX);
      });
      const end = () => {
        down = false;
        el.classList.remove('is-dragging');
      };
      el.addEventListener('pointerup', end);
      el.addEventListener('pointercancel', end);
      el.addEventListener('mouseleave', end);
    };
    makeDragScroll(document.querySelector('.bh-lawyer-track'));
    makeDragScroll(document.querySelector('.bh-case-rail'));
  };


  const setupTechTemplate = () => {
    const page = document.querySelector('.tech-template-page');
    if (!page) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const update = () => {
      page.classList.toggle('tx-scrolled', window.scrollY > 20);
      const hero = document.querySelector('[data-tech-hero]');
      if (!hero || reduceMotion) return;
      const progress = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / Math.max(1, hero.offsetHeight)));
      page.style.setProperty('--tx-scroll', progress.toFixed(3));
    };
    window.addEventListener('scroll', update, { passive: true });
    update();

    const targets = [...document.querySelectorAll('.tx-section-head, .tx-solution-grid article, .tx-use-head, .tx-card-rail article, .tx-customers h2, .tx-logo-marquee, .tx-media h2, .tx-main-news, .tx-news-list article, .tx-contact-banner')];
    targets.forEach((el, i) => {
      el.classList.add('tx-reveal');
      el.style.setProperty('--tx-delay', `${Math.min(i % 4, 3) * 55}ms`);
    });
    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
      targets.forEach((el) => io.observe(el));
    }

    const rail = document.querySelector('[data-tech-rail]');
    if (rail) {
      let down = false;
      let startX = 0;
      let startLeft = 0;
      rail.addEventListener('pointerdown', (event) => {
        down = true;
        startX = event.clientX;
        startLeft = rail.scrollLeft;
        rail.classList.add('is-dragging');
        rail.setPointerCapture?.(event.pointerId);
      });
      rail.addEventListener('pointermove', (event) => {
        if (!down) return;
        rail.scrollLeft = startLeft - (event.clientX - startX);
      });
      const end = () => { down = false; rail.classList.remove('is-dragging'); };
      rail.addEventListener('pointerup', end);
      rail.addEventListener('pointercancel', end);
      rail.addEventListener('mouseleave', end);
    }
  };


  const setupPlasticTemplate = () => {
    const page = document.querySelector('.ps-template-page');
    if (!page) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hero = document.querySelector('[data-ps-hero]');
    const updateHero = () => {
      page.classList.toggle('ps-scrolled', window.scrollY > 20);
      if (!hero || reduceMotion) return;
      const progress = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / Math.max(1, hero.offsetHeight)));
      page.style.setProperty('--ps-hero-progress', progress.toFixed(3));
    };
    window.addEventListener('scroll', updateHero, { passive: true });
    updateHero();

    const heroSlides = hero ? [...hero.querySelectorAll('.ps-hero-slide')] : [];
    const heroCurrent = hero?.querySelector('[data-ps-hero-current]');
    const heroPager = hero?.querySelector('.ps-hero-pager');
    let heroIndex = Math.max(0, heroSlides.findIndex((slide) => slide.classList.contains('is-active')));
    const syncHeroSlide = (nextIndex) => {
      if (!heroSlides.length) return;
      heroIndex = (nextIndex + heroSlides.length) % heroSlides.length;
      heroSlides.forEach((slide, index) => slide.classList.toggle('is-active', index === heroIndex));
      if (heroCurrent) heroCurrent.textContent = String(heroIndex + 1).padStart(2, '0');
      if (heroPager && !reduceMotion) {
        heroPager.classList.add('is-reset');
        void heroPager.offsetWidth;
        heroPager.classList.remove('is-reset');
      }
    };
    syncHeroSlide(heroIndex);
    if (heroSlides.length > 1 && !reduceMotion) {
      window.setInterval(() => syncHeroSlide(heroIndex + 1), 5000);
    }

    const notice = document.querySelector('[data-ps-notice]');
    const noticeCards = notice ? [...notice.querySelectorAll('article')] : [];
    let noticeIndex = 0;
    const syncNotice = () => {
      if (!noticeCards.length) return;
      notice.style.setProperty('--ps-notice-shift', String(noticeIndex));
      noticeCards.forEach((card, index) => {
        const offset = (index - noticeIndex + noticeCards.length) % noticeCards.length;
        card.style.order = String(offset);
        card.style.opacity = offset > 2 ? '0' : '1';
      });
    };
    const moveNotice = (delta) => {
      if (!noticeCards.length) return;
      noticeIndex = (noticeIndex + delta + noticeCards.length) % noticeCards.length;
      syncNotice();
    };
    document.querySelector('[data-ps-notice-prev]')?.addEventListener('click', () => moveNotice(-1));
    document.querySelector('[data-ps-notice-next]')?.addEventListener('click', () => moveNotice(1));
    syncNotice();
    if (noticeCards.length > 1 && !reduceMotion) window.setInterval(() => moveNotice(1), 3800);

    const panelWrap = document.querySelector('[data-ps-panels]');
    const panels = panelWrap ? [...panelWrap.querySelectorAll('[data-panel]')] : [];
    document.querySelectorAll('[data-ps-tab]').forEach((tab) => {
      tab.addEventListener('click', () => {
        const key = tab.dataset.psTab;
        document.querySelectorAll('[data-ps-tab]').forEach((item) => item.classList.toggle('is-active', item === tab));
        panels.forEach((panel) => panel.classList.toggle('is-active', panel.dataset.panel === key));
      });
    });

    const revealSelectors = [
      '.ps-reveal-seed', '.ps-notice-track article', '.ps-special-grid article', '.ps-value-grid article',
      '.ps-doctor-list article', '.ps-tabs', '.ps-clinic-panels', '.ps-program-grid article',
      '.ps-tour-gallery img', '.ps-guide-card'
    ].join(',');
    const targets = [...document.querySelectorAll(revealSelectors)];
    targets.forEach((el, index) => {
      el.classList.add('ps-reveal');
      el.style.setProperty('--ps-delay', `${Math.min(index % 5, 4) * 55}ms`);
    });
    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
      targets.forEach((el) => io.observe(el));
    }

    const navLinks = [...document.querySelectorAll('.ps-nav a[href^="#"]')];
    const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
    const syncNav = () => {
      const y = window.scrollY + 120;
      let current = sections[0]?.id;
      sections.forEach((section) => {
        if (section.offsetTop <= y) current = section.id;
      });
      navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${current}`));
    };
    window.addEventListener('scroll', syncNav, { passive: true });
    syncNav();
  };

  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();
  setupReveal();
  setupInquiry();
  setupLegalTemplate();
  setupBaekhwaTemplateInteractions();
  setupTechTemplate();
  setupPlasticTemplate();
})();
