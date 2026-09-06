/* ============================================================
   STACKLY — dashboard.js (user + seller dashboards)
   Auth guard, sidebar, canvas chart, interactive tables
   ============================================================ */
(function () {
  'use strict';

  var SESSION_KEY = 'stackly_session';
  var session = null;
  try { session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch (e) {}

  var needRole = document.body.getAttribute('data-role'); /* "user" | "admin" */
  if (!session || !session.email) {
    window.location.replace('login.html');
    return;
  }
  if (needRole && session.role !== needRole) {
    /* logged in with the other role -> send to their dashboard */
    window.location.replace(session.role === 'admin' ? 'seller-dashboard.html' : 'dashboard.html');
    return;
  }

  /* ---------- Fill identity ---------- */
  document.querySelectorAll('[data-user-name]').forEach(function (el) { el.textContent = session.name; });
  document.querySelectorAll('[data-user-first]').forEach(function (el) { el.textContent = session.name.split(' ')[0]; });
  document.querySelectorAll('[data-user-role]').forEach(function (el) { el.textContent = session.role === 'admin' ? 'Seller / Admin' : 'Traveller'; });
  document.querySelectorAll('[data-user-initials]').forEach(function (el) {
    el.textContent = session.name.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
  });

  /* ---------- Logout ---------- */
  document.querySelectorAll('[data-logout]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      localStorage.removeItem(SESSION_KEY);
      window.location.href = 'login.html';
    });
  });

  /* ---------- Sidebar toggle (mobile) ---------- */
  var side = document.querySelector('.dash-side');
  var mtoggle = document.querySelector('.dash-mtoggle');
  if (mtoggle && side) {
    mtoggle.addEventListener('click', function () { side.classList.toggle('open'); });
    document.addEventListener('click', function (e) {
      if (window.innerWidth > 860) return;
      if (!side.contains(e.target) && !mtoggle.contains(e.target)) side.classList.remove('open');
    });
  }

  /* ---------- Animated counters ---------- */
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var pre = el.getAttribute('data-prefix') || '';
    var suf = el.getAttribute('data-suffix') || '';
    var dur = 1500, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + Math.round(target * eased).toLocaleString() + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });

  /* ---------- Goal bars ---------- */
  document.querySelectorAll('.goal .bar i').forEach(function (bar) {
    setTimeout(function () { bar.style.width = bar.getAttribute('data-w') + '%'; }, 400);
  });

  /* ---------- Canvas line chart ---------- */
  var canvas = document.getElementById('dashChart');
  if (canvas) {
    var labels = (canvas.getAttribute('data-labels') || 'Jan,Feb,Mar,Apr,May,Jun').split(',');
    var seriesA = (canvas.getAttribute('data-a') || '12,19,15,25,22,30').split(',').map(Number);
    var seriesB = (canvas.getAttribute('data-b') || '8,12,10,16,15,20').split(',').map(Number);
    var ctx = canvas.getContext('2d');
    var progress = 0;

    function draw(p) {
      var dpr = window.devicePixelRatio || 1;
      var w = canvas.clientWidth, h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      var padL = 34, padB = 28, padT = 12, padR = 10;
      var cw = w - padL - padR, ch = h - padT - padB;
      var max = Math.max.apply(null, seriesA.concat(seriesB)) * 1.15;

      /* grid */
      ctx.strokeStyle = 'rgba(12,59,57,.08)';
      ctx.fillStyle = 'rgba(12,59,57,.45)';
      ctx.font = '11px DM Sans, sans-serif';
      ctx.lineWidth = 1;
      for (var g = 0; g <= 4; g++) {
        var gy = padT + ch - (ch * g / 4);
        ctx.beginPath(); ctx.moveTo(padL, gy); ctx.lineTo(w - padR, gy); ctx.stroke();
        ctx.textAlign = 'right';
        ctx.fillText(Math.round(max * g / 4), padL - 8, gy + 4);
      }
      /* labels */
      ctx.textAlign = 'center';
      labels.forEach(function (lb, i) {
        var x = padL + (cw * i / (labels.length - 1));
        ctx.fillText(lb, x, h - 8);
      });

      function plot(data, color, fill) {
        ctx.beginPath();
        var pts = data.map(function (v, i) {
          return [padL + (cw * i / (data.length - 1)), padT + ch - (ch * v / max) * p];
        });
        pts.forEach(function (pt, i) {
          if (i === 0) ctx.moveTo(pt[0], pt[1]);
          else {
            var prev = pts[i - 1];
            var cx = (prev[0] + pt[0]) / 2;
            ctx.bezierCurveTo(cx, prev[1], cx, pt[1], pt[0], pt[1]);
          }
        });
        if (fill) {
          var last = pts[pts.length - 1], first = pts[0];
          var grad = ctx.createLinearGradient(0, padT, 0, padT + ch);
          grad.addColorStop(0, fill);
          grad.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.save();
          ctx.lineTo(last[0], padT + ch); ctx.lineTo(first[0], padT + ch); ctx.closePath();
          ctx.fillStyle = grad; ctx.fill(); ctx.restore();
          /* re-stroke the line */
          ctx.beginPath();
          pts.forEach(function (pt, i) {
            if (i === 0) ctx.moveTo(pt[0], pt[1]);
            else {
              var prev = pts[i - 1]; var cx2 = (prev[0] + pt[0]) / 2;
              ctx.bezierCurveTo(cx2, prev[1], cx2, pt[1], pt[0], pt[1]);
            }
          });
        }
        ctx.strokeStyle = color; ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.stroke();
        /* dots */
        pts.forEach(function (pt) {
          ctx.beginPath(); ctx.arc(pt[0], pt[1], 3.4, 0, Math.PI * 2);
          ctx.fillStyle = '#fff'; ctx.fill();
          ctx.strokeStyle = color; ctx.lineWidth = 2.4; ctx.stroke();
        });
      }
      plot(seriesB, '#F4B942', null);
      plot(seriesA, '#F5662E', 'rgba(245,102,46,.16)');
    }

    function animate() {
      progress += 0.03;
      draw(Math.min(progress, 1));
      if (progress < 1) requestAnimationFrame(animate);
    }
    animate();
    var rT;
    window.addEventListener('resize', function () {
      clearTimeout(rT); rT = setTimeout(function () { draw(1); }, 150);
    });
  }

  /* ---------- Table row actions (demo) ---------- */
  document.querySelectorAll('[data-row-del]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tr = btn.closest('tr');
      tr.style.transition = 'opacity .35s, transform .35s';
      tr.style.opacity = '0';
      tr.style.transform = 'translateX(24px)';
      setTimeout(function () { tr.remove(); }, 360);
      if (window.stacklyToast) window.stacklyToast('Entry removed.');
    });
  });
  document.querySelectorAll('[data-row-view]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (window.stacklyToast) window.stacklyToast('Opening booking details…');
    });
  });

  /* ---------- Add listing modal (seller) ---------- */
  var modal = document.getElementById('addModal');
  document.querySelectorAll('[data-open-modal]').forEach(function (b) {
    b.addEventListener('click', function () { if (modal) modal.classList.add('open'); });
  });
  if (modal) {
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.classList.remove('open'); });
    modal.querySelectorAll('.m-close').forEach(function (b) {
      b.addEventListener('click', function () { modal.classList.remove('open'); });
    });
    var mf = modal.querySelector('form');
    if (mf) mf.addEventListener('submit', function (e) {
      e.preventDefault();
      modal.classList.remove('open');
      if (window.stacklyToast) window.stacklyToast('New listing published successfully.');
      mf.reset();
    });
  }
})();
