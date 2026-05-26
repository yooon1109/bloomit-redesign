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

  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();
  setupReveal();
  setupInquiry();
})();
