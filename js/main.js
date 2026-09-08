/* ============================================================
   STACKLY — main.js (shared across all marketing pages)
   Vanilla JS + GSAP + AOS + Lenis + Splitting
   ============================================================ */
(function () {
  'use strict';

  var iconUses = Array.prototype.slice.call(document.querySelectorAll('svg use[href*="sprite.svg#"]'));
  if (iconUses.length) {
    var iconFrame = document.createElement('iframe');
    iconFrame.setAttribute('aria-hidden', 'true');
    iconFrame.title = '';
    iconFrame.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;border:0';
    iconFrame.onload = function () {
      var sourceSymbols = iconFrame.contentDocument.querySelectorAll('symbol');
      var defsSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      defsSvg.classList.add('svg-defs');
      defsSvg.setAttribute('aria-hidden', 'true');
      Array.prototype.forEach.call(sourceSymbols, function (symbol) {
        defs.appendChild(document.importNode(symbol, true));
      });
      defsSvg.appendChild(defs);
      document.body.prepend(defsSvg);
      iconUses.forEach(function (use) {
        var symbolId = use.getAttribute('href').split('#')[1];
        var localHref = '#' + symbolId;
        use.setAttribute('href', localHref);
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', localHref);
      });
      iconFrame.remove();
    };
    iconFrame.src = 'svg/sprite.svg';
    document.body.appendChild(iconFrame);
  }

  /* ---------------- Preloader ---------------- */
  var preloader = document.getElementById('preloader');
  if (preloader) {
    var bar = preloader.querySelector('.preloader-bar i');
    var progress = 0;
    var tick = setInterval(function () {
      progress = Math.min(progress + Math.random() * 22, 92);
      if (bar) bar.style.width = progress + '%';
    }, 220);
    window.addEventListener('load', function () {
      setTimeout(function () {
        clearInterval(tick);
        if (bar) bar.style.width = '100%';
        setTimeout(function () {
          preloader.classList.add('done');
          document.body.classList.add('loaded');
          heroIntro();
        }, 350);
      }, 500);
    });
    /* Safety: never trap the user */
    setTimeout(function () {
      preloader.classList.add('done');
      document.body.classList.add('loaded');
    }, 4500);
  } else {
    document.body.classList.add('loaded');
  }

  /* ---------------- Native smooth scroll ----------------
     Native scrolling is reliable for mouse, touch, keyboard and screen readers.
     The previous Lenis integration could retain a stopped scroll state after an
     overlay interaction, leaving pages unable to scroll. */
  var lenis = null;

  /* ---------------- AOS ---------------- */
  if (window.AOS) {
    AOS.init({ duration: 900, easing: 'ease-out-cubic', once: true, offset: 90 });
  }

  /* ---------------- GSAP setup ---------------- */
  var hasGsap = window.gsap && window.ScrollTrigger;
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ---------------- Split text reveal ---------------- */
  if (window.Splitting) Splitting();

  /* If GSAP failed to load, never leave split text hidden */
  if (!hasGsap) {
    document.querySelectorAll('.splitting .char').forEach(function (c) {
      c.style.transform = 'none';
    });
  }

  function heroIntro() {
    if (!hasGsap) return;
    var chars = document.querySelectorAll('.hero [data-splitting] .char');
    if (chars.length) {
      gsap.set(chars, { y: '110%' });
      gsap.to(chars, { y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.028, delay: 0.15 });
    }
    var fadeEls = document.querySelectorAll('.hero [data-hero-fade]');
    if (fadeEls.length) {
      gsap.fromTo(fadeEls,
        { y: 34, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.55 });
    }
    var frame = document.querySelector('.hero-media .frame img');
    if (frame) {
      gsap.fromTo(frame, { scale: 1.28 }, { scale: 1.12, duration: 2.2, ease: 'power2.out' });
      gsap.fromTo('.hero-media .frame', { clipPath: 'inset(12% 12% 12% 12% round 200px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 200px)', duration: 1.6, ease: 'power3.out', delay: 0.25 });
    }
    var floats = document.querySelectorAll('.float-card');
    if (floats.length) {
      gsap.fromTo(floats, { scale: 0.6, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.8, ease: 'back.out(1.8)', stagger: 0.18, delay: 1 });
    }
  }

  /* Page-hero split reveal on inner pages */
  if (hasGsap && !document.querySelector('.hero')) {
    var pchars = document.querySelectorAll('.page-hero [data-splitting] .char');
    if (pchars.length) {
      gsap.set(pchars, { y: '110%' });
      gsap.to(pchars, { y: 0, duration: 0.85, ease: 'power3.out', stagger: 0.024, delay: 0.35 });
    }
  }

  /* Generic split reveals on scroll */
  if (hasGsap) {
    document.querySelectorAll('[data-splitting]:not(.hero [data-splitting]):not(.page-hero [data-splitting])').forEach(function (el) {
      var chars = el.querySelectorAll('.char');
      if (!chars.length) return;
      gsap.set(chars, { y: '110%' });
      ScrollTrigger.create({
        trigger: el, start: 'top 86%', once: true,
        onEnter: function () {
          gsap.to(chars, { y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.02 });
        }
      });
    });

    /* Parallax images */
    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-parallax')) || 0.12;
      gsap.to(el, {
        yPercent: speed * 100, ease: 'none',
        scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
    });

    /* Hero image slow ken-burns on scroll away */
    var heroImg = document.querySelector('.hero-media .frame img');
    if (heroImg) {
      gsap.to(heroImg, {
        yPercent: 10, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
      });
    }

    /* CTA background drift */
    var ctaBg = document.querySelector('.cta .cta-bg');
    if (ctaBg) {
      gsap.fromTo(ctaBg, { yPercent: -8 }, {
        yPercent: 8, ease: 'none',
        scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
    }

    /* Plane path drawing */
    document.querySelectorAll('.draw-path').forEach(function (path) {
      var len = path.getTotalLength ? path.getTotalLength() : 0;
      if (!len) return;
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      ScrollTrigger.create({
        trigger: path, start: 'top 85%', once: true,
        onEnter: function () {
          gsap.to(path, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' });
        }
      });
    });
  }

  /* ---------------- Header ---------------- */
  var header = document.querySelector('.site-header');
  var toTop = document.getElementById('toTop');
  var lastY = 0;
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 30);
    if (toTop) toTop.classList.toggle('show', y > 600);
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', function () {
    if (lenis) lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------- Mobile menu ---------------- */
  var navToggle = document.querySelector('.nav-toggle');
  var mobileMenu = document.querySelector('.mobile-menu');
  var mobileClose = document.querySelector('.mobile-close');
  function setMenuIcon(isOpen) {
    if (!navToggle) return;
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    var menuIcon = navToggle.querySelector('use');
    if (menuIcon) {
      var iconHref = 'svg/sprite.svg#i-' + (isOpen ? 'close' : 'menu');
      menuIcon.setAttribute('href', iconHref);
      menuIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', iconHref);
    }
  }
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      setMenuIcon(isOpen);
      mobileMenu.querySelectorAll('a.mnav').forEach(function (a, i) {
        a.style.transitionDelay = (0.15 + i * 0.07) + 's';
      });
      if (lenis) lenis.stop();
    });
  }
  function closeMobile() {
    if (mobileMenu) mobileMenu.classList.remove('open');
    setMenuIcon(false);
    if (lenis) lenis.start();
  }
  if (mobileClose) mobileClose.addEventListener('click', closeMobile);
  if (mobileMenu) mobileMenu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMobile);
  });

  /* ---------------- Counters ---------------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);
        var target = parseFloat(el.getAttribute('data-count'));
        var dur = 1800, start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString();
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { io.observe(c); });
  }

  /* ---------------- Booking widget ---------------- */
  var bookingTabs = document.querySelectorAll('.booking-tab');
  bookingTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      bookingTabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      var label = document.getElementById('bookingSubmitLabel');
      if (label) label.textContent = 'Search ' + tab.textContent.trim();
    });
  });
  var swapBtn = document.querySelector('.bswap');
  if (swapBtn) {
    swapBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var from = document.getElementById('bfFrom');
      var to = document.getElementById('bfTo');
      if (from && to) {
        var v = from.value; from.value = to.value; to.value = v;
        swapBtn.style.transform = 'rotate(180deg)';
        setTimeout(function () { swapBtn.style.transform = ''; }, 500);
      }
    });
  }
  var bookingForm = document.querySelector('.booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var active = document.querySelector('.booking-tab.active');
      var what = active ? active.textContent.trim().toLowerCase() : 'flights';
      toast('Searching the best ' + what + ' deals for you…');
    });
  }

  /* ---------------- Testimonials slider ---------------- */
  var track = document.querySelector('.testi-track');
  if (track) {
    var slides = track.children.length;
    var dotsWrap = document.querySelector('.testi-dots');
    var idx = 0, timer;
    for (var i = 0; i < slides; i++) {
      var d = document.createElement('button');
      d.className = 'testi-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      (function (n) { d.addEventListener('click', function () { go(n); restart(); }); })(i);
      if (dotsWrap) dotsWrap.appendChild(d);
    }
    function go(n) {
      idx = (n + slides) % slides;
      track.style.transform = 'translateX(-' + idx * 100 + '%)';
      if (dotsWrap) Array.prototype.forEach.call(dotsWrap.children, function (dd, k) {
        dd.classList.toggle('active', k === idx);
      });
    }
    function restart() { clearInterval(timer); timer = setInterval(function () { go(idx + 1); }, 6000); }
    var prev = document.querySelector('.testi-btn.prev');
    var next = document.querySelector('.testi-btn.next');
    if (prev) prev.addEventListener('click', function () { go(idx - 1); restart(); });
    if (next) next.addEventListener('click', function () { go(idx + 1); restart(); });
    restart();
  }

  /* ---------------- FAQ accordion ---------------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!open) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------------- Toast ---------------- */
  var toastEl;
  function toast(msg, isError) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.innerHTML = '<svg><use href="svg/sprite.svg#i-check"/></svg><span></span>';
      document.body.appendChild(toastEl);
    }
    toastEl.classList.toggle('error', !!isError);
    toastEl.querySelector('span').textContent = msg;
    requestAnimationFrame(function () { toastEl.classList.add('show'); });
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove('show'); }, 3200);
  }
  window.stacklyToast = toast;

  /* ---------------- Header auth state ---------------- */
  try {
    var session = JSON.parse(localStorage.getItem('stackly_session') || 'null');
    if (session && session.email) {
      document.querySelectorAll('[data-auth="user"]').forEach(function (el) {
        el.style.display = '';
        var dash = el.querySelector('a[data-dash-link]');
        if (dash) dash.setAttribute('href', session.role === 'admin' ? 'seller-dashboard.html' : 'dashboard.html');
      });
    }
  } catch (err) { /* ignore */ }

  /* ---------------- Footer year ---------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();