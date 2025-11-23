(() => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  document.body.classList.remove('no-js');

  const mqlReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Header / Nav interactions
  const navToggle = $('#navToggle');
  const siteNav = $('#siteNav');
  const overlay = $('#overlay');

  const openNav = () => {
    document.body.classList.add('nav-open');
    overlay.hidden = false;
    navToggle.setAttribute('aria-expanded', 'true');
    // scroll lock
    document.documentElement.style.overflow = 'hidden';
  };
  const closeNav = () => {
    document.body.classList.remove('nav-open');
    overlay.hidden = true;
    navToggle.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
  };

  navToggle?.addEventListener('click', () => {
    if (document.body.classList.contains('nav-open')) closeNav(); else openNav();
  });
  overlay?.addEventListener('click', () => {
    closeNav();
    closeAllDropdowns();
  });

  // Dropdowns: hover on desktop, click on mobile
  const rootMenus = $$('.has-dropdown');
  const isMobile = () => window.matchMedia('(max-width: 720px)').matches;

  function openDropdown(li) {
    li.classList.add('open');
    const btn = $('.dropdown-toggle', li);
    btn?.setAttribute('aria-expanded', 'true');
  }
  function closeDropdown(li) {
    li.classList.remove('open');
    const btn = $('.dropdown-toggle', li);
    btn?.setAttribute('aria-expanded', 'false');
  }
  function closeAllDropdowns() { rootMenus.forEach(closeDropdown); }

  rootMenus.forEach(li => {
    const btn = $('.dropdown-toggle', li);
    // Hover for desktop
    li.addEventListener('mouseenter', () => { if (!isMobile()) openDropdown(li); });
    li.addEventListener('mouseleave', () => { if (!isMobile()) closeDropdown(li); });
    // Click to toggle on all devices (desktop + mobile)
    btn?.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = li.classList.contains('open');
      closeAllDropdowns();
      if (!isOpen) openDropdown(li); else closeDropdown(li);
    });
  });

  // ESC closes nav and dropdowns
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeNav();
      closeAllDropdowns();
    }
  });

  // Click outside closes dropdowns on desktop
  document.addEventListener('click', (e) => {
    if (isMobile()) return; // mobile handled by overlay/nav
    const isInside = e.target.closest('.has-dropdown');
    if (!isInside) closeAllDropdowns();
  });

  // Company Profile section: reveal only when clicked
  const companyProfileSection = document.getElementById('company-profile');
  function showCompanyProfile() {
    if (!companyProfileSection) return;
    companyProfileSection.hidden = false;
    companyProfileSection.setAttribute('aria-hidden', 'false');
    // 滚动到公司简介部分
    companyProfileSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', '#company-profile');
  }
  function hideCompanyProfile() {
    if (!companyProfileSection) return;
    companyProfileSection.hidden = true;
    companyProfileSection.setAttribute('aria-hidden', 'true');
  }
  // Intercept clicks to #company-profile from any menu item
  $$("a[href='#company-profile']").forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault();
    showCompanyProfile();
    closeNav();
    closeAllDropdowns();
  }));

  // Hide company profile when navigating to other anchors
  $$(".site-nav a[href^='#']").forEach(a => {
    const href = a.getAttribute('href');
    if (href !== '#company-profile') {
      a.addEventListener('click', () => hideCompanyProfile());
    }
  });

  // About section: reveal only when clicked
  const aboutSection = document.getElementById('about');
  function showAbout() {
    if (!aboutSection) return;
    aboutSection.hidden = false;
    aboutSection.setAttribute('aria-hidden', 'false');
    // 不自动滚动，直接显示在hero下面
  }
  function hideAbout() {
    if (!aboutSection) return;
    aboutSection.hidden = true;
    aboutSection.setAttribute('aria-hidden', 'true');
  }
  // Intercept clicks to #about from any menu item
  $$("a[href='#about']").forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault();
    showAbout();
    closeNav();
    closeAllDropdowns();
  }));
  // Hide about when clicking other nav anchors
  $$(".site-nav a[href^='#']").forEach(a => {
    if (a.getAttribute('href') !== '#about') {
      a.addEventListener('click', () => hideAbout());
    }
  });
  // If URL already has #about, reveal on load
  if (location.hash === '#about') {
    showAbout();
  }

  // Instant jump for FBA Air (no smooth scroll)
  const airSec = document.getElementById('fba-air');
  function forceLoadLazy(section) {
    if (!section) return;
    $$("img[loading='lazy']", section).forEach(img => {
      try { img.loading = 'eager'; } catch {}
      img.src = img.src;
    });
  }
  function showAir() {
    if (!airSec) return;
    airSec.hidden = false;
    airSec.setAttribute('aria-hidden', 'false');
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    airSec.scrollIntoView({ behavior: 'auto', block: 'start' });
    history.replaceState(null, '', '#fba-air');
    setTimeout(() => { document.documentElement.style.scrollBehavior = prev; }, 50);
    forceLoadLazy(airSec);
  }
  function hideAir() {
    if (!airSec) return;
    airSec.hidden = true;
    airSec.setAttribute('aria-hidden', 'true');
  }
  $$("a[href='#fba-air']").forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    closeNav();
    closeAllDropdowns();
    hideSea(); hideRailway(); hideWare(); hideValue(); hideOverseas();
    showAir();
  }));

  // 声明所有服务部分的元素变量 - 必须在使用前声明
  const seaSec = document.getElementById('fba-sea');
  const railwaySec = document.getElementById('fba-railway');
  const wareSec = document.getElementById('warehousing');
  const valueSec = document.getElementById('value-added');
  const overseasSec = document.getElementById('overseas');

  console.log('=== Service section variables declared ===');
  console.log('seaSec:', !!seaSec);
  console.log('railwaySec:', !!railwaySec);
  console.log('wareSec:', !!wareSec);
  console.log('valueSec:', !!valueSec);
  console.log('overseasSec:', !!overseasSec);

  // FBA Sea: only show on click, no smooth scroll
  function showSea() {
    if (!seaSec) return;
    seaSec.hidden = false;
    seaSec.setAttribute('aria-hidden', 'false');
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    seaSec.scrollIntoView({ behavior: 'auto', block: 'start' });
    history.replaceState(null, '', '#fba-sea');
    setTimeout(() => { document.documentElement.style.scrollBehavior = prev; }, 50);
    forceLoadLazy(seaSec);
  }
  function hideSea() {
    if (!seaSec) return;
    seaSec.hidden = true;
    seaSec.setAttribute('aria-hidden', 'true');
  }
  $$("a[href='#fba-sea']").forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    hideAir(); hideRailway(); hideWare(); hideValue(); hideOverseas();
    showSea();
    closeNav();
    closeAllDropdowns();
  }));

  // FBA Railway: only show on click, no smooth scroll
  function showRailway() {
    if (!railwaySec) return;
    railwaySec.hidden = false;
    railwaySec.setAttribute('aria-hidden', 'false');
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    railwaySec.scrollIntoView({ behavior: 'auto', block: 'start' });
    history.replaceState(null, '', '#fba-railway');
    setTimeout(() => { document.documentElement.style.scrollBehavior = prev; }, 50);
    forceLoadLazy(railwaySec);
  }
  function hideRailway() {
    if (!railwaySec) return;
    railwaySec.hidden = true;
    railwaySec.setAttribute('aria-hidden', 'true');
  }
  $$("a[href='#fba-railway']").forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    hideAir(); hideSea(); hideRailway(); hideWare(); hideValue(); hideOverseas();
    showRailway();
    closeNav();
    closeAllDropdowns();
  }));

  // Hide About/Sea when navigating to other anchors
  $$(".site-nav a[href^='#']").forEach(a => {
    const href = a.getAttribute('href');
    if (href !== '#about') {
      a.addEventListener('click', () => hideAbout());
    }
    if (href !== '#fba-sea') {
      a.addEventListener('click', () => hideSea());
    }
    if (href !== '#fba-air') {
      a.addEventListener('click', () => hideAir());
    }
    if (href !== '#fba-railway') {
      a.addEventListener('click', () => hideRailway());
    }
    if (href !== '#warehousing') {
      a.addEventListener('click', () => hideWare());
    }
    if (href !== '#value-added') {
      a.addEventListener('click', () => hideValue());
    }
    if (href !== '#overseas') {
      a.addEventListener('click', () => hideOverseas());
    }
    if (href !== '#news') {
      a.addEventListener('click', () => hideNews());
    }
  });

  // hash routing
  if (location.hash === '#fba-sea') showSea();
  if (location.hash === '#fba-air') showAir();
  if (location.hash === '#fba-railway') showRailway();
  if (location.hash === '#warehousing') showWare();
  if (location.hash === '#value-added') showValue();
  if (location.hash === '#overseas') showOverseas();
  window.addEventListener('hashchange', () => {
    if (location.hash === '#about') showAbout(); else hideAbout();
    if (location.hash === '#fba-sea') showSea(); else hideSea();
    if (location.hash === '#fba-air') showAir(); else hideAir();
    if (location.hash === '#fba-railway') showRailway(); else hideRailway();
    if (location.hash === '#warehousing') showWare(); else hideWare();
    if (location.hash === '#value-added') showValue(); else hideValue();
    if (location.hash === '#overseas') showOverseas(); else hideOverseas();
    if (!handleNewsHash(true)) hideNews();
  });

  // Warehousing & Customs: show on click, instant jump, hide others
  function showWare() {
    if (!wareSec) return;
    wareSec.hidden = false;
    wareSec.setAttribute('aria-hidden', 'false');
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    wareSec.scrollIntoView({ behavior: 'auto', block: 'start' });
    history.replaceState(null, '', '#warehousing');
    setTimeout(() => { document.documentElement.style.scrollBehavior = prev; }, 50);
    forceLoadLazy(wareSec);
  }
  function hideWare() {
    if (!wareSec) return;
    wareSec.hidden = true;
    wareSec.setAttribute('aria-hidden', 'true');
  }
  $$("a[href='#warehousing']").forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    hideAir(); hideSea(); hideRailway(); hideValue(); hideOverseas();
    showWare();
    closeNav();
    closeAllDropdowns();
  }));

  // Value-added: show on click, instant jump, hide others
  function showValue() {
    if (!valueSec) return;
    valueSec.hidden = false;
    valueSec.setAttribute('aria-hidden', 'false');
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    valueSec.scrollIntoView({ behavior: 'auto', block: 'start' });
    history.replaceState(null, '', '#value-added');
    setTimeout(() => { document.documentElement.style.scrollBehavior = prev; }, 50);
    forceLoadLazy(valueSec);
  }
  function hideValue() {
    if (!valueSec) return;
    valueSec.hidden = true;
    valueSec.setAttribute('aria-hidden', 'true');
  }
  $$("a[href='#value-added']").forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    hideAir(); hideSea(); hideRailway(); hideWare(); hideOverseas();
    showValue();
    closeNav();
    closeAllDropdowns();
  }));

  // Overseas warehouse section
  function showOverseas() {
    if (!overseasSec) return;
    overseasSec.hidden = false;
    overseasSec.setAttribute('aria-hidden', 'false');
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    overseasSec.scrollIntoView({ behavior: 'auto', block: 'start' });
    history.replaceState(null, '', '#overseas');
    setTimeout(() => { document.documentElement.style.scrollBehavior = prev; }, 50);
    forceLoadLazy(overseasSec);
  }
  function hideOverseas() {
    if (!overseasSec) return;
    overseasSec.hidden = true;
    overseasSec.setAttribute('aria-hidden', 'true');
  }
  $$("a[href='#overseas']").forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    hideAir(); hideSea(); hideRailway(); hideWare(); hideValue();
    showOverseas();
    closeNav();
    closeAllDropdowns();
  }));

  // News section toggle via navigation
  $$("a[href='#news']").forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    showNews({ expand: false, targetId: newsOrder[0], scroll: true, updateHash: true });
    closeNav();
    closeAllDropdowns();
  }));

  // News interactions
  const newsSection = document.getElementById('news');
  const newsCards = newsSection ? $$('.news-card', newsSection) : [];
  const newsEntries = newsSection ? $$('.news-entry', newsSection) : [];
  const newsNavBtns = newsSection ? $$('.news-nav-btn', newsSection) : [];
  const newsCloseBtn = newsSection ? $('.news-close', newsSection) : null;
  const newsOrder = newsEntries.map(entry => entry.id);
  let currentNewsIndex = newsEntries.findIndex(entry => entry.classList.contains('is-active'));
  if (currentNewsIndex < 0) currentNewsIndex = 0;

  function enterNewsDetail() {
    if (!newsSection) return;
    newsSection.classList.add('is-expanded');
    newsCloseBtn?.removeAttribute('hidden');
  }
  function exitNewsDetail({ focusList = false, updateHash = true } = {}) {
    if (!newsSection) return;
    newsSection.classList.remove('is-expanded');
    newsCloseBtn?.setAttribute('hidden', '');
    if (updateHash) history.replaceState(null, '', '#news');
    if (focusList && newsCards.length) {
      const card = newsCards[currentNewsIndex] || newsCards[0];
      card?.focus();
    }
  }

  function showNews({ expand = false, targetId, scroll = true, updateHash = true } = {}) {
    if (!newsSection) return;
    newsSection.hidden = false;
    newsSection.setAttribute('aria-hidden', 'false');
    if (!expand) {
      exitNewsDetail({ focusList: false, updateHash: false });
    }
    const target = typeof targetId === 'string' ? targetId : (newsOrder[currentNewsIndex] || newsOrder[0]);
    const shouldUpdateHash = expand ? updateHash : false;
    activateNews(target, { scroll: false, updateHash: shouldUpdateHash, expand });
    if (!expand && updateHash) {
      history.replaceState(null, '', '#news');
    }
    if (scroll) {
      const prev = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      newsSection.scrollIntoView({ behavior: 'auto', block: 'start' });
      document.documentElement.style.scrollBehavior = prev;
    }
  }

  function hideNews() {
    if (!newsSection) return;
    exitNewsDetail({ focusList: false, updateHash: false });
    newsSection.hidden = true;
    newsSection.setAttribute('aria-hidden', 'true');
  }

  function updateNewsNavButtons() {
    if (!newsNavBtns.length) return;
    const prevBtn = newsNavBtns.find(btn => btn.dataset.nav === 'prev');
    const nextBtn = newsNavBtns.find(btn => btn.dataset.nav === 'next');
    if (prevBtn) {
      const disabled = currentNewsIndex <= 0;
      prevBtn.disabled = disabled;
      prevBtn.setAttribute('aria-disabled', String(disabled));
    }
    if (nextBtn) {
      const disabled = currentNewsIndex >= newsOrder.length - 1;
      nextBtn.disabled = disabled;
      nextBtn.setAttribute('aria-disabled', String(disabled));
    }
  }

  function activateNews(id, { scroll = false, updateHash = true, expand = false } = {}) {
    if (!newsSection) return;
    const target = newsEntries.find(entry => entry.id === id);
    if (!target) return;
    if (expand) enterNewsDetail();
    newsEntries.forEach(entry => {
      const isActive = entry === target;
      entry.hidden = !isActive;
      entry.classList.toggle('is-active', isActive);
    });
    newsCards.forEach(card => {
      const isActive = card.dataset.target === id;
      card.classList.toggle('is-active', isActive);
      card.setAttribute('aria-selected', String(isActive));
      card.setAttribute('tabindex', isActive ? '0' : '-1');
    });
    currentNewsIndex = Math.max(newsOrder.indexOf(id), 0);
    updateNewsNavButtons();
    forceLoadLazy(newsSection);
    if (updateHash) {
      history.replaceState(null, '', `#news-${currentNewsIndex + 1}`);
    }
    if (scroll) {
      newsSection.scrollIntoView({ behavior: mqlReduce.matches ? 'auto' : 'smooth', block: 'start' });
    }
  }

  function handleNewsHash(scroll = false) {
    if (!newsSection || !newsOrder.length) return false;
    const hash = location.hash;
    if (hash === '#news') {
      showNews({ expand: false, scroll, updateHash: false });
      return true;
    }
    const match = hash.match(/^#news-(\d+)/);
    if (match) {
      const idx = Math.min(Math.max(parseInt(match[1], 10) - 1, 0), newsOrder.length - 1);
      showNews({ expand: true, targetId: newsOrder[idx], scroll, updateHash: false });
      return true;
    }
    return false;
  }

  newsCards.forEach(card => {
    card.addEventListener('click', () => {
      activateNews(card.dataset.target, { scroll: false, expand: true });
    });
  });
  newsNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const direction = btn.dataset.nav === 'next' ? 1 : -1;
      const nextIndex = currentNewsIndex + direction;
      if (nextIndex < 0 || nextIndex >= newsOrder.length) return;
      const targetId = newsOrder[nextIndex];
      activateNews(targetId, { scroll: false, expand: true });
      const focusCard = newsCards.find(card => card.dataset.target === targetId);
      focusCard?.focus();
    });
  });

  if (newsSection && newsOrder.length) {
    if (!handleNewsHash(false)) {
      activateNews(newsOrder[currentNewsIndex] || newsOrder[0], { scroll: false, updateHash: false, expand: false });
    }
    updateNewsNavButtons();
  }

  newsCloseBtn?.addEventListener('click', () => {
    exitNewsDetail({ focusList: true, updateHash: true });
  });

  // Carousel
  const carousel = $('.carousel');
  if (carousel) {
    const slidesWrap = $('.slides', carousel);
    const slides = $$('.slide', slidesWrap);
    const prevBtn = $('.carousel-btn.prev', carousel);
    const nextBtn = $('.carousel-btn.next', carousel);
    const indicators = $('.indicators', carousel);
    let index = slides.findIndex(s => s.classList.contains('is-active'));
    let timer = null;
    const DURATION = 5000;

    // create indicators
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `切换到第 ${i+1} 张`);
      dot.addEventListener('click', () => goTo(i));
      indicators.appendChild(dot);
    });

    function updateUI() {
      slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
      $$('.indicators button', carousel).forEach((b, i) => b.setAttribute('aria-selected', String(i === index)));
      // translate grid container
      slidesWrap.style.transform = `translateX(-${index * 100}%)`;
      if (!mqlReduce.matches) slidesWrap.style.transition = 'transform .5s ease';
      else slidesWrap.style.transition = 'none';
    }
    function goTo(i) { index = (i + slides.length) % slides.length; updateUI(); }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function start() {
      if (mqlReduce.matches) return;
      stop();
      timer = setInterval(next, DURATION);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    nextBtn?.addEventListener('click', () => { next(); start(); });
    prevBtn?.addEventListener('click', () => { prev(); start(); });
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    document.addEventListener('visibilitychange', () => { document.hidden ? stop() : start(); });
    mqlReduce.addEventListener?.('change', () => { mqlReduce.matches ? stop() : start(); });

    updateUI();
    start();
  }

  // Lazy-load fallback for browsers without native lazy support
  (function lazyFallback(){
    const testImg = new Image();
    if ('loading' in testImg) return; // native supported
    const lazyImgs = $$('img[loading="lazy"]');
    if (!('IntersectionObserver' in window)) {
      lazyImgs.forEach(img => img.src = img.dataset.src || img.src);
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          io.unobserve(img);
        }
      });
    });
    lazyImgs.forEach(img => io.observe(img));
  })();

  // Back to top
  const backToTop = $('#backToTop');
  const toggleBackTop = () => {
    if (window.scrollY > 300) backToTop.classList.add('show'); else backToTop.classList.remove('show');
  };
  window.addEventListener('scroll', toggleBackTop, { passive: true });
  backToTop.addEventListener('click', () => {
    if (!mqlReduce.matches) window.scrollTo({ top: 0, behavior: 'smooth' });
    else window.scrollTo(0, 0);
  });

  // Set year
  const y = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(y);

  // 调试：检查所有服务部分是否存在
  console.log('=== Service sections check ===');
  console.log('airSec:', !!airSec, airSec ? airSec.id : 'null');
  console.log('seaSec:', !!seaSec, seaSec ? seaSec.id : 'null');
  console.log('railwaySec:', !!railwaySec, railwaySec ? railwaySec.id : 'null');
  console.log('wareSec:', !!wareSec, wareSec ? wareSec.id : 'null');
  console.log('valueSec:', !!valueSec, valueSec ? valueSec.id : 'null');
  console.log('overseasSec:', !!overseasSec, overseasSec ? overseasSec.id : 'null');
  console.log('companyProfileSection:', !!companyProfileSection, companyProfileSection ? companyProfileSection.id : 'null');
})();
