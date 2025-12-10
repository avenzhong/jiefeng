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

  // Company Profile section: show in company-profile-mode
  const companyProfileSection = document.getElementById('company-profile');

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
    showProductService(airSec, '#fba-air');
  }
  function hideAir() {
    if (!airSec) return;
    airSec.hidden = true;
    airSec.setAttribute('aria-hidden', 'true');
  }

  // 声明所有服务部分的元素变量 - 必须在使用前声明
  const seaSec = document.getElementById('fba-sea');
  const railwaySec = document.getElementById('fba-railway');
  const wareSec = document.getElementById('warehousing');
  const valueSec = document.getElementById('value-added');
  const overseasSec = document.getElementById('overseas');

  // 通用函数：显示产品服务（只显示轮播图、指定产品服务和底部）
  function showProductService(targetSec, hash) {
    if (!targetSec) return;
    // 获取所有section元素
    const heroSec = document.getElementById('hero');
    const companyProfileSec = document.getElementById('company-profile');
    const coreBusinessSec = document.getElementById('core-business');
    const advantagesSec = document.getElementById('advantages');
    const partnersSec = document.querySelector('.partners-section');
    const contactSec = document.getElementById('contact');
    const reasonsSec = document.getElementById('reasons');
    const aboutSec = document.getElementById('about');
    const newsSec = document.getElementById('news');
    const fbaAddressSec = document.getElementById('fba-address');
    const contactInfoSec = document.getElementById('contact-info');
    
    // 所有需要隐藏的区块（包括所有产品服务）
    const allSections = [
      companyProfileSec, coreBusinessSec, advantagesSec, partnersSec,
      reasonsSec, aboutSec, newsSec, fbaAddressSec, contactInfoSec,
      seaSec, airSec, railwaySec, wareSec, valueSec, overseasSec
    ];
    
    // 先隐藏所有区块
    allSections.forEach(sec => {
      if (sec) {
        sec.hidden = true;
        sec.setAttribute('aria-hidden', 'true');
        sec.style.display = 'none';
      }
    });
    
    // 确保轮播图始终显示
    if (heroSec) {
      heroSec.hidden = false;
      heroSec.setAttribute('aria-hidden', 'false');
      heroSec.style.display = '';
    }
    
    // 显示底部联系区块
    if (contactSec) {
      contactSec.hidden = false;
      contactSec.setAttribute('aria-hidden', 'false');
      contactSec.style.display = '';
    }
    
    // 移除body上的特殊模式类
    document.body.classList.remove('reasons-mode');
    document.body.classList.remove('company-profile-mode');
    
    // 显示目标产品服务
    targetSec.hidden = false;
    targetSec.setAttribute('aria-hidden', 'false');
    targetSec.style.display = '';
    
    // 滚动到顶部，然后滚动到产品服务内容
    window.scrollTo(0, 0);
    setTimeout(() => {
      const prev = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      targetSec.scrollIntoView({ behavior: 'auto', block: 'start' });
      if (hash) {
        history.replaceState(null, '', hash);
      }
      setTimeout(() => { document.documentElement.style.scrollBehavior = prev; }, 50);
      forceLoadLazy(targetSec);
    }, 100);
  }

  console.log('=== Service section variables declared ===');
  console.log('seaSec:', !!seaSec);
  console.log('railwaySec:', !!railwaySec);
  console.log('wareSec:', !!wareSec);
  console.log('valueSec:', !!valueSec);
  console.log('overseasSec:', !!overseasSec);

  // FBA Sea: only show on click, no smooth scroll
  function showSea() {
    showProductService(seaSec, '#fba-sea');
  }
  function hideSea() {
    if (!seaSec) return;
    seaSec.hidden = true;
    seaSec.setAttribute('aria-hidden', 'true');
  }

  // FBA Railway: only show on click, no smooth scroll
  function showRailway() {
    showProductService(railwaySec, '#fba-railway');
  }
  function hideRailway() {
    if (!railwaySec) return;
    railwaySec.hidden = true;
    railwaySec.setAttribute('aria-hidden', 'true');
  }

  // Hide About/Sea when navigating to other anchors (排除产品服务链接，它们有自己的处理)
  $$(".site-nav a[href^='#']").forEach(a => {
    const href = a.getAttribute('href');
    // 跳过产品服务链接，它们已经有专门的事件处理
    if (href === '#fba-sea' || href === '#fba-air' || href === '#fba-railway' || 
        href === '#warehousing' || href === '#value-added' || href === '#overseas') {
      return;
    }
    if (href !== '#about') {
      a.addEventListener('click', () => hideAbout());
    }
    if (href !== '#news') {
      a.addEventListener('click', () => hideNews());
    }
  });

  // 为service-card添加点击事件处理
  $$('.service-card[data-service]').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const service = card.getAttribute('data-service');
      closeNav();
      closeAllDropdowns();
      
      switch(service) {
        case 'fba-sea':
          showSea();
          break;
        case 'fba-air':
          showAir();
          break;
        case 'fba-railway':
          showRailway();
          break;
        case 'warehousing':
          showWare();
          break;
        case 'value-added':
          showValue();
          break;
        case 'overseas':
          showOverseas();
          break;
      }
    });
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
    showProductService(wareSec, '#warehousing');
  }
  function hideWare() {
    if (!wareSec) return;
    wareSec.hidden = true;
    wareSec.setAttribute('aria-hidden', 'true');
  }

  // Value-added: show on click, instant jump, hide others
  function showValue() {
    showProductService(valueSec, '#value-added');
  }
  function hideValue() {
    if (!valueSec) return;
    valueSec.hidden = true;
    valueSec.setAttribute('aria-hidden', 'true');
  }

  // Overseas warehouse section
  function showOverseas() {
    showProductService(overseasSec, '#overseas');
  }
  function hideOverseas() {
    if (!overseasSec) return;
    overseasSec.hidden = true;
    overseasSec.setAttribute('aria-hidden', 'true');
  }

  // 使用事件委托统一处理所有产品服务链接的点击（包括导航菜单和卡片）
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href) return;
    
    // 跳过首页链接，由专门的事件监听器处理
    if (href === '#hero') {
      return;
    }
    
    // 处理产品服务链接
    if (href === '#fba-sea') {
      e.preventDefault();
      e.stopPropagation();
      if (typeof showSea === 'function') {
        showSea();
      }
      if (typeof closeNav === 'function') {
        closeNav();
      }
      if (typeof closeAllDropdowns === 'function') {
        closeAllDropdowns();
      }
    } else if (href === '#fba-air') {
      e.preventDefault();
      e.stopPropagation();
      if (typeof showAir === 'function') {
        showAir();
      }
      if (typeof closeNav === 'function') {
        closeNav();
      }
      if (typeof closeAllDropdowns === 'function') {
        closeAllDropdowns();
      }
    } else if (href === '#fba-railway') {
      e.preventDefault();
      e.stopPropagation();
      if (typeof showRailway === 'function') {
        showRailway();
      }
      if (typeof closeNav === 'function') {
        closeNav();
      }
      if (typeof closeAllDropdowns === 'function') {
        closeAllDropdowns();
      }
    } else if (href === '#warehousing') {
      e.preventDefault();
      e.stopPropagation();
      if (typeof showWare === 'function') {
        showWare();
      }
      if (typeof closeNav === 'function') {
        closeNav();
      }
      if (typeof closeAllDropdowns === 'function') {
        closeAllDropdowns();
      }
    } else if (href === '#value-added') {
      e.preventDefault();
      e.stopPropagation();
      if (typeof showValue === 'function') {
        showValue();
      }
      if (typeof closeNav === 'function') {
        closeNav();
      }
      if (typeof closeAllDropdowns === 'function') {
        closeAllDropdowns();
      }
    } else if (href === '#overseas') {
      e.preventDefault();
      e.stopPropagation();
      if (typeof showOverseas === 'function') {
        showOverseas();
      }
      if (typeof closeNav === 'function') {
        closeNav();
      }
      if (typeof closeAllDropdowns === 'function') {
        closeAllDropdowns();
      }
    }
  }, true); // 使用捕获阶段确保优先处理

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
    // 直接获取所有需要隐藏的section元素
    const heroSec = document.getElementById('hero');
    const companyProfileSec = document.getElementById('company-profile');
    const coreBusinessSec = document.getElementById('core-business');
    const advantagesSec = document.getElementById('advantages');
    const partnersSec = document.querySelector('.partners-section');
    const contactSec = document.getElementById('contact');
    const reasonsSec = document.getElementById('reasons');
    const aboutSec = document.getElementById('about');
    const seaSec = document.getElementById('fba-sea');
    const airSec = document.getElementById('fba-air');
    const railwaySec = document.getElementById('fba-railway');
    const wareSec = document.getElementById('warehousing');
    const valueSec = document.getElementById('value-added');
    const overseasSec = document.getElementById('overseas');
    
    const fbaAddressSec = document.getElementById('fba-address');
    const contactInfoSec = document.getElementById('contact-info');
    
    // 隐藏所有其他区块，但保留轮播图、新闻和底部联系信息
    const allSections = [companyProfileSec, coreBusinessSec, advantagesSec, partnersSec, 
                         reasonsSec, aboutSec, fbaAddressSec, contactInfoSec, seaSec, airSec, railwaySec, wareSec, valueSec, overseasSec];
    allSections.forEach(sec => {
      if (sec && sec !== heroSec && sec !== contactSec) {
        sec.hidden = true;
        sec.setAttribute('aria-hidden', 'true');
        sec.style.display = 'none'; // 强制隐藏，确保CSS规则不会覆盖
      }
    });
    // 特别确保选择理由部分被隐藏
    if (reasonsSec) {
      reasonsSec.hidden = true;
      reasonsSec.setAttribute('aria-hidden', 'true');
      reasonsSec.style.display = 'none';
    }
    // 确保轮播图始终显示
    if (heroSec) {
      heroSec.hidden = false;
      heroSec.setAttribute('aria-hidden', 'false');
      heroSec.style.display = '';
    }
    // 显示底部联系区块
    if (contactSec) {
      contactSec.hidden = false;
      contactSec.setAttribute('aria-hidden', 'false');
      contactSec.style.display = '';
    }
    // 移除body上的特殊模式类
    document.body.classList.remove('reasons-mode');
    document.body.classList.remove('company-profile-mode');
    // 显示新闻部分
    newsSection.hidden = false;
    newsSection.setAttribute('aria-hidden', 'false');
    newsSection.style.display = ''; // 重置display样式，确保显示
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

  // Single Page Application Mode - Home vs Reasons
  const heroSec = document.getElementById('hero');
  const companyProfileSec = document.getElementById('company-profile');
  const coreBusinessSec = document.getElementById('core-business');
  const aboutSec = document.getElementById('about');
  const advantagesSec = document.getElementById('advantages');
  const partnersSec = document.querySelector('.partners-section');
  const contactSec = document.getElementById('contact');
  const reasonsSec = document.getElementById('reasons');
  const newsSec = document.getElementById('news');

  // 默认首页区块
  const homeSections = [heroSec, companyProfileSec, coreBusinessSec, advantagesSec, partnersSec, contactSec];
  // 需要按需显示的区块
  const dynamicSections = [aboutSec, newsSec, seaSec, airSec, railwaySec, wareSec, valueSec, overseasSec];

  function showHome() {
    const fbaAddressSec = document.getElementById('fba-address');
    const contactInfoSec = document.getElementById('contact-info');
    
    // 显示所有首页区块（包括轮播图、公司简介、核心业务、企业优势、合作伙伴、底部）
    homeSections.forEach(sec => {
      if (sec) {
        sec.hidden = false;
        sec.setAttribute('aria-hidden', 'false');
        sec.style.display = '';
      }
    });
    // 隐藏选择理由（首页不显示）
    if (reasonsSec) {
      reasonsSec.hidden = true;
      reasonsSec.setAttribute('aria-hidden', 'true');
      reasonsSec.style.display = 'none';
    }
    // 隐藏亚马逊仓库地址（首页不显示）
    if (fbaAddressSec) {
      fbaAddressSec.hidden = true;
      fbaAddressSec.setAttribute('aria-hidden', 'true');
      fbaAddressSec.style.display = 'none';
    }
    // 隐藏联系我们区块（首页不显示）
    if (contactInfoSec) {
      contactInfoSec.hidden = true;
      contactInfoSec.setAttribute('aria-hidden', 'true');
      contactInfoSec.style.display = 'none';
    }
    // 隐藏所有动态区块（产品服务详情、新闻等）
    dynamicSections.forEach(sec => {
      if (sec) {
        sec.hidden = true;
        sec.setAttribute('aria-hidden', 'true');
        sec.style.display = 'none';
      }
    });
    // 移除body上的特殊模式类
    document.body.classList.remove('reasons-mode');
    document.body.classList.remove('company-profile-mode');
    history.replaceState(null, '', '#');
    
    // 滚动到顶部
    window.scrollTo(0, 0);
  }

  function showReasons() {
    if (!reasonsSec) return;
    // 直接获取所有需要隐藏的section元素
    const heroSec = document.getElementById('hero');
    const companyProfileSec = document.getElementById('company-profile');
    const coreBusinessSec = document.getElementById('core-business');
    const advantagesSec = document.getElementById('advantages');
    const partnersSec = document.querySelector('.partners-section');
    const contactSec = document.getElementById('contact');
    const aboutSec = document.getElementById('about');
    const newsSec = document.getElementById('news');
    const fbaAddressSec = document.getElementById('fba-address');
    const contactInfoSec = document.getElementById('contact-info');
    
    // 所有需要隐藏的区块（包括所有产品服务）
    const allSections = [
      companyProfileSec, coreBusinessSec, advantagesSec, partnersSec,
      aboutSec, newsSec, fbaAddressSec, contactInfoSec,
      seaSec, airSec, railwaySec, wareSec, valueSec, overseasSec
    ];
    
    // 先隐藏所有区块
    allSections.forEach(sec => {
      if (sec) {
        sec.hidden = true;
        sec.setAttribute('aria-hidden', 'true');
        sec.style.display = 'none';
      }
    });
    
    // 确保轮播图始终显示
    if (heroSec) {
      heroSec.hidden = false;
      heroSec.setAttribute('aria-hidden', 'false');
      heroSec.style.display = '';
    }
    
    // 显示底部联系区块
    if (contactSec) {
      contactSec.hidden = false;
      contactSec.setAttribute('aria-hidden', 'false');
      contactSec.style.display = '';
    }
    
    // 移除body上的特殊模式类
    document.body.classList.remove('reasons-mode');
    document.body.classList.remove('company-profile-mode');
    
    // 显示选择理由区块
    reasonsSec.hidden = false;
    reasonsSec.setAttribute('aria-hidden', 'false');
    reasonsSec.style.display = '';
    
    // 滚动到顶部，然后滚动到选择理由内容
    window.scrollTo(0, 0);
    setTimeout(() => {
      const prev = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      reasonsSec.scrollIntoView({ behavior: 'auto', block: 'start' });
      history.replaceState(null, '', '#reasons');
      setTimeout(() => { document.documentElement.style.scrollBehavior = prev; }, 50);
    }, 100);
  }

  function showFbaAddress() {
    const fbaAddressSec = document.getElementById('fba-address');
    if (!fbaAddressSec) return;
    
    // 直接获取所有需要隐藏的section元素
    const heroSec = document.getElementById('hero');
    const companyProfileSec = document.getElementById('company-profile');
    const coreBusinessSec = document.getElementById('core-business');
    const advantagesSec = document.getElementById('advantages');
    const partnersSec = document.querySelector('.partners-section');
    const contactSec = document.getElementById('contact');
    const aboutSec = document.getElementById('about');
    const newsSec = document.getElementById('news');
    const reasonsSec = document.getElementById('reasons');
    const contactInfoSec = document.getElementById('contact-info');
    
    // 所有需要隐藏的区块（包括所有产品服务）
    const allSections = [
      companyProfileSec, coreBusinessSec, advantagesSec, partnersSec,
      aboutSec, newsSec, reasonsSec, contactInfoSec,
      seaSec, airSec, railwaySec, wareSec, valueSec, overseasSec
    ];
    
    // 先隐藏所有区块
    allSections.forEach(sec => {
      if (sec) {
        sec.hidden = true;
        sec.setAttribute('aria-hidden', 'true');
        sec.style.display = 'none';
      }
    });
    
    // 确保轮播图始终显示
    if (heroSec) {
      heroSec.hidden = false;
      heroSec.setAttribute('aria-hidden', 'false');
      heroSec.style.display = '';
    }
    
    // 显示底部联系区块
    if (contactSec) {
      contactSec.hidden = false;
      contactSec.setAttribute('aria-hidden', 'false');
      contactSec.style.display = '';
    }
    
    // 移除body上的特殊模式类
    document.body.classList.remove('reasons-mode');
    document.body.classList.remove('company-profile-mode');
    
    // 显示亚马逊仓库地址区块
    fbaAddressSec.hidden = false;
    fbaAddressSec.setAttribute('aria-hidden', 'false');
    fbaAddressSec.style.display = '';
    
    // 滚动到顶部，然后滚动到亚马逊仓库地址内容
    window.scrollTo(0, 0);
    setTimeout(() => {
      const prev = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      fbaAddressSec.scrollIntoView({ behavior: 'auto', block: 'start' });
      history.replaceState(null, '', '#fba-address');
      setTimeout(() => { document.documentElement.style.scrollBehavior = prev; }, 50);
    }, 100);
  }

  function showContactInfo() {
    const contactInfoSec = document.getElementById('contact-info');
    if (!contactInfoSec) return;
    
    // 直接获取所有需要隐藏的section元素
    const heroSec = document.getElementById('hero');
    const companyProfileSec = document.getElementById('company-profile');
    const coreBusinessSec = document.getElementById('core-business');
    const advantagesSec = document.getElementById('advantages');
    const partnersSec = document.querySelector('.partners-section');
    const contactSec = document.getElementById('contact');
    const aboutSec = document.getElementById('about');
    const newsSec = document.getElementById('news');
    const reasonsSec = document.getElementById('reasons');
    const fbaAddressSec = document.getElementById('fba-address');
    
    // 所有需要隐藏的区块（包括所有产品服务）
    const allSections = [
      companyProfileSec, coreBusinessSec, advantagesSec, partnersSec,
      aboutSec, newsSec, reasonsSec, fbaAddressSec,
      seaSec, airSec, railwaySec, wareSec, valueSec, overseasSec
    ];
    
    // 先隐藏所有区块
    allSections.forEach(sec => {
      if (sec) {
        sec.hidden = true;
        sec.setAttribute('aria-hidden', 'true');
        sec.style.display = 'none';
      }
    });
    
    // 确保轮播图始终显示
    if (heroSec) {
      heroSec.hidden = false;
      heroSec.setAttribute('aria-hidden', 'false');
      heroSec.style.display = '';
    }
    
    // 显示底部联系区块
    if (contactSec) {
      contactSec.hidden = false;
      contactSec.setAttribute('aria-hidden', 'false');
      contactSec.style.display = '';
    }
    
    // 移除body上的特殊模式类
    document.body.classList.remove('reasons-mode');
    document.body.classList.remove('company-profile-mode');
    
    // 显示联系我们区块
    contactInfoSec.hidden = false;
    contactInfoSec.setAttribute('aria-hidden', 'false');
    contactInfoSec.style.display = '';
    
    // 滚动到顶部，然后滚动到联系我们内容
    window.scrollTo(0, 0);
    setTimeout(() => {
      const prev = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      contactInfoSec.scrollIntoView({ behavior: 'auto', block: 'start' });
      history.replaceState(null, '', '#contact-info');
      setTimeout(() => { document.documentElement.style.scrollBehavior = prev; }, 50);
    }, 100);
  }

  function hideContactInfo() {
    const contactInfoSec = document.getElementById('contact-info');
    if (!contactInfoSec) return;
    contactInfoSec.hidden = true;
    contactInfoSec.setAttribute('aria-hidden', 'true');
  }

  function showCompanyProfileMode() {
    const fbaAddressSec = document.getElementById('fba-address');
    const contactInfoSec = document.getElementById('contact-info');
    
    // 隐藏所有其他区块，但保留轮播图、公司简介和底部
    [...homeSections, ...dynamicSections].forEach(sec => {
      if (sec && sec !== heroSec && sec !== companyProfileSec && sec !== contactSec) {
        sec.hidden = true;
        sec.setAttribute('aria-hidden', 'true');
        sec.style.display = 'none';
      }
    });
    
    // 隐藏fba-address section、reasons section和contact-info section
    if (fbaAddressSec) {
      fbaAddressSec.hidden = true;
      fbaAddressSec.setAttribute('aria-hidden', 'true');
      fbaAddressSec.style.display = 'none';
    }
    if (reasonsSec) {
      reasonsSec.hidden = true;
      reasonsSec.setAttribute('aria-hidden', 'true');
      reasonsSec.style.display = 'none';
    }
    if (contactInfoSec) {
      contactInfoSec.hidden = true;
      contactInfoSec.setAttribute('aria-hidden', 'true');
      contactInfoSec.style.display = 'none';
    }
    
    // 显示轮播图区块
    if (heroSec) {
      heroSec.hidden = false;
      heroSec.setAttribute('aria-hidden', 'false');
      heroSec.style.display = '';
    }
    // 显示公司简介区块
    if (companyProfileSec) {
      companyProfileSec.hidden = false;
      companyProfileSec.setAttribute('aria-hidden', 'false');
      companyProfileSec.style.display = '';
    }
    // 显示底部联系区块
    if (contactSec) {
      contactSec.hidden = false;
      contactSec.setAttribute('aria-hidden', 'false');
      contactSec.style.display = '';
    }
    // 使用replaceState避免滚动问题
    history.replaceState(null, '', '#company-profile');
    // 添加特殊模式类用于样式控制
    document.body.classList.add('company-profile-mode');
    document.body.classList.remove('reasons-mode');
    // 滚动到公司简介内容
    setTimeout(() => {
      if (companyProfileSec) {
        const prev = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = 'smooth';
        companyProfileSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          document.documentElement.style.scrollBehavior = prev;
        }, 100);
      }
    }, 50);
  }

  // 首页点击处理
  $$("a[href='#hero']").forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showHome();
      closeNav();
      closeAllDropdowns();
    }, false); // 使用冒泡阶段，在事件委托之后执行
  });

  // 选择理由点击处理
  $$("a[href='#reasons']").forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault();
    showReasons();
    closeNav();
    closeAllDropdowns();
  }));

  // 亚马逊仓库地址点击处理
  $$("a[href='#fba-address']").forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault();
    showFbaAddress();
    closeNav();
    closeAllDropdowns();
  }));

  // 联系我们点击处理
  $$("a[href='#contact-info']").forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault();
    showContactInfo();
    closeNav();
    closeAllDropdowns();
  }));

  // 公司简介点击处理
  $$("a[href='#company-profile']").forEach(a => a.addEventListener('click', (e) => {
    e.preventDefault();
    showCompanyProfileMode();
    closeNav();
    closeAllDropdowns();
  }));

  // 其他导航链接处理（确保切换到首页模式）
  $$(".site-nav a[href^='#']").forEach(a => {
    const href = a.getAttribute('href');
    if (href !== '#hero' && href !== '#reasons' && href !== '#company-profile' && href !== '#news' && href !== '#fba-address' && href !== '#contact-info') {
      a.addEventListener('click', () => {
        showHome(); // 切换到首页模式，显示所有内容
      });
    }
  });

  // 初始化页面状态
  function initializePageState() {
    if (location.hash === '#reasons') {
      showReasons();
    } else if (location.hash === '#company-profile') {
      showCompanyProfileMode();
    } else if (location.hash === '#fba-address') {
      showFbaAddress();
    } else if (location.hash === '#contact-info') {
      showContactInfo();
    } else {
      showHome();
    }
  }

  // 页面加载时初始化状态
  initializePageState();
  
  // 监听hash变化
  window.addEventListener('hashchange', () => {
    if (location.hash === '#company-profile') {
      showCompanyProfileMode();
    } else if (location.hash === '#reasons') {
      showReasons();
    } else if (location.hash === '#fba-address') {
      showFbaAddress();
    } else if (location.hash === '#contact-info') {
      showContactInfo();
    } else if (location.hash === '#news' || location.hash.match(/^#news-/)) {
      if (!handleNewsHash(true)) {
        showNews({ expand: false, scroll: true, updateHash: false });
      }
    } else if (location.hash === '#fba-sea') {
      showSea();
    } else if (location.hash === '#fba-air') {
      showAir();
    } else if (location.hash === '#fba-railway') {
      showRailway();
    } else if (location.hash === '#warehousing') {
      showWare();
    } else if (location.hash === '#value-added') {
      showValue();
    } else if (location.hash === '#overseas') {
      showOverseas();
    } else if (location.hash === '#hero' || location.hash === '' || !location.hash) {
      showHome();
    }
  });
})();

// 折叠/展开国家区块函数
function toggleCountry(header) {
  const country = header.closest('.fba-country');
  const content = country.querySelector('.fba-country-content');
  const toggle = header.querySelector('.fba-country-toggle');
  
  if (country.classList.contains('expanded')) {
    // 折叠
    content.style.display = 'none';
    country.classList.remove('expanded');
    toggle.textContent = '▼';
  } else {
    // 展开
    content.style.display = 'block';
    country.classList.add('expanded');
    toggle.textContent = '▲';
  }
}
