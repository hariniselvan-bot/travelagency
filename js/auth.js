/* ============================================================
   STACKLY — auth.js (login + register, role based)
   Roles: "user" -> dashboard.html | "admin" -> seller-dashboard.html
   ============================================================ */
(function () {
  'use strict';

  var USERS_KEY = 'stackly_users';
  var SESSION_KEY = 'stackly_session';

  /* Seed demo accounts on first run */
  function seed() {
    var users = [];
    try { users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch (e) {}
    if (!users.length) {
      users = [
        { name: 'Demo Traveller', email: 'user@stackly.com', password: 'user123', role: 'user' },
        { name: 'Stackly Admin', email: 'admin@stackly.com', password: 'admin123', role: 'admin' }
      ];
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  }
  seed();

  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch (e) { return []; }
  }
  function saveUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }
  function setSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      name: user.name, email: user.email, role: user.role, at: Date.now()
    }));
  }
  function route(role) {
    window.location.href = role === 'admin' ? 'seller-dashboard.html' : 'dashboard.html';
  }
  function toast(msg, isError) {
    if (window.stacklyToast) window.stacklyToast(msg, isError);
  }

  /* ---------- Password peek ---------- */
  document.querySelectorAll('.peek').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = btn.parentElement.querySelector('input');
      input.type = input.type === 'password' ? 'text' : 'password';
    });
  });

  /* ---------- Role switch (login page) ---------- */
  var role = 'user';
  var roleBtns = document.querySelectorAll('.role-switch button');
  var roleHint = document.querySelector('.role-hint');
  roleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      roleBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      role = btn.getAttribute('data-role');
      if (roleHint) {
        roleHint.classList.add('show');
        roleHint.querySelector('.hint-email').textContent = role === 'admin' ? 'admin@stackly.com' : 'user@stackly.com';
        roleHint.querySelector('.hint-pass').textContent = role === 'admin' ? 'admin123' : 'user123';
      }
    });
  });

  /* ---------- Login ---------- */
  var loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = loginForm.email.value.trim().toLowerCase();
      var pass = loginForm.password.value;
      var errBox = document.getElementById('loginError');
      var user = getUsers().find(function (u) {
        return u.email.toLowerCase() === email && u.password === pass && u.role === role;
      });
      if (!user) {
        if (errBox) {
          errBox.textContent = 'Invalid credentials for the "' + (role === 'admin' ? 'Admin / Seller' : 'User') +
            '" role. Try the demo account shown above.';
          errBox.classList.add('show');
        }
        toast('Login failed — check email, password and role.', true);
        return;
      }
      if (errBox) errBox.classList.remove('show');
      setSession(user);
      toast('Welcome back, ' + user.name.split(' ')[0] + '! Redirecting…');
      setTimeout(function () { route(user.role); }, 900);
    });
  }

  /* ---------- Register ---------- */
  var regForm = document.getElementById('registerForm');
  if (regForm) {
    regForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = regForm.fullname.value.trim();
      var email = regForm.email.value.trim().toLowerCase();
      var pass = regForm.password.value;
      var pass2 = regForm.confirm.value;
      var roleInput = regForm.querySelector('input[name="role"]:checked');
      var r = roleInput ? roleInput.value : 'user';
      var errBox = document.getElementById('regError');

      function fail(msg) {
        if (errBox) { errBox.textContent = msg; errBox.classList.add('show'); }
        toast(msg, true);
      }
      if (name.length < 2) return fail('Please enter your full name.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Please enter a valid email address.');
      if (pass.length < 6) return fail('Password must be at least 6 characters.');
      if (pass !== pass2) return fail('Passwords do not match.');
      if (!regForm.terms.checked) return fail('Please accept the Terms & Privacy Policy.');

      var users = getUsers();
      if (users.some(function (u) { return u.email.toLowerCase() === email; })) {
        return fail('An account with this email already exists.');
      }
      var user = { name: name, email: email, password: pass, role: r };
      users.push(user);
      saveUsers(users);
      setSession(user);
      if (errBox) errBox.classList.remove('show');
      toast('Account created! Setting up your dashboard…');
      setTimeout(function () { route(r); }, 900);
    });
  }
})();
