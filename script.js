/**
 * ============================================================================
 * JAISHNAV M BARO (NOTNAV) — PORTFOLIO JAVASCRIPT
 * Subtle Web Audio FX, Dynamic Progress Bars, Arcade Suite & Global Leaderboard
 * ============================================================================
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
   * 1. AUDIO SYNTHESIZER (WEB AUDIO API)
   * High-quality procedural game & UI audio
   * -------------------------------------------------------------------------- */
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.initFromStorage();
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    initFromStorage() {
      const saved = localStorage.getItem('jaishnav_sfx_enabled');
      if (saved !== null) {
        this.enabled = saved === 'true';
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem('jaishnav_sfx_enabled', this.enabled);
      return this.enabled;
    }

    playTone(freq, type = 'sine', duration = 0.08, startVol = 0.08, endVol = 0.001) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(startVol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(endVol, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {}
    }

    playHover() {
      this.playTone(600, 'sine', 0.03, 0.02);
    }

    playClick() {
      this.playTone(480, 'sine', 0.05, 0.05);
    }

    playBirdFlap() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(820, this.ctx.currentTime + 0.09);

        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.09);
      } catch (e) {}
    }

    playDinoJump() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(680, this.ctx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
      } catch (e) {}
    }

    playEatApple() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.06); // A5

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(now + 0.16);
      } catch (e) {}
    }

    playScore() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(783.99, now + 0.07);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(now + 0.18);
      } catch (e) {}
    }

    playCrash() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.22);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.22);
      } catch (e) {}
    }

    playFanfare() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const startTime = this.ctx.currentTime + idx * 0.08;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0.14, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.25);
        });
      } catch (e) {}
    }

    playWarning() {
      this.playTone(200, 'square', 0.15, 0.12);
    }
  }

  const sfx = new SoundEngine();

  // Subtle audio interaction on buttons & links
  document.querySelectorAll('a, button, .skill-card, .game-card, .spec-card').forEach((el) => {
    el.addEventListener('mouseenter', () => sfx.playHover());
    el.addEventListener('click', () => sfx.playClick());
  });

  // SFX Toggle Header Button
  const sfxToggleBtn = document.getElementById('sfx-toggle');
  const sfxIcon = document.getElementById('sfx-icon');

  function updateSfxIcon() {
    if (!sfxToggleBtn || !sfxIcon) return;
    sfxIcon.className = sfx.enabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
  }
  updateSfxIcon();

  if (sfxToggleBtn) {
    sfxToggleBtn.addEventListener('click', () => {
      sfx.toggle();
      updateSfxIcon();
    });
  }

  /* --------------------------------------------------------------------------
   * 2. AMBIENT BACKGROUND PARTICLES CANVAS
   * -------------------------------------------------------------------------- */
  const ambientCanvas = document.getElementById('ambient-canvas');
  if (ambientCanvas) {
    const ctx = ambientCanvas.getContext('2d');
    let width = (ambientCanvas.width = window.innerWidth);
    let height = (ambientCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = ambientCanvas.width = window.innerWidth;
      height = ambientCanvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(width > 768 ? 32 : 14, 40);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.25 + 0.05
      });
    }

    function renderAmbient() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = '#38bdf8';
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.strokeStyle = '#38bdf8';
            ctx.globalAlpha = (1 - dist / 100) * 0.05;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(renderAmbient);
    }
    renderAmbient();
  }

  /* --------------------------------------------------------------------------
   * 3. NAVIGATION & SCROLLSPY
   * -------------------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('mobile-open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    });

    navMenu.querySelectorAll('.nav-item').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }

  // Active section spy
  const sections = document.querySelectorAll('.content-section');
  const navItems = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 160;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  /* --------------------------------------------------------------------------
   * 3.5 DYNAMIC TYPEWRITER ANIMATION (ABOUT ME HERO)
   * -------------------------------------------------------------------------- */
  function initTypewriter() {
    const el = document.getElementById('hero-typewriter-text');
    if (!el) return;

    const phrases = [
      'Developer',
      'Gamer',
      'GFX Artist',
      'Admin @ VajraClouds',
      'NotNav'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let speed = 90;

    function tick() {
      const current = phrases[phraseIndex];

      if (isDeleting) {
        el.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        speed = 45;
      } else {
        el.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        speed = 90;
      }

      if (!isDeleting && charIndex === current.length) {
        isDeleting = true;
        speed = 1800; // Pause when word is fully typed
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 400; // Pause before typing next word
      }

      setTimeout(tick, speed);
    }

    tick();
  }
  initTypewriter();

  /* --------------------------------------------------------------------------
   * 4. ROADMAP PROGRESS COUNTER ANIMATION
   * -------------------------------------------------------------------------- */
  const pythonBar = document.getElementById('python-bar');
  const aimlBar = document.getElementById('aiml-bar');
  const discordBar = document.getElementById('discord-bar');

  const pythonCounter = document.getElementById('python-counter');
  const aimlCounter = document.getElementById('aiml-counter');
  const discordCounter = document.getElementById('discord-counter');
  const reanimateBtn = document.getElementById('reanimate-progress-btn');

  function animateCounter(el, target, duration = 1000) {
    if (!el) return;
    const startTime = performance.now();
    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * ease);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  function triggerProgressAnimations() {
    if (pythonBar) pythonBar.style.width = '0%';
    if (aimlBar) aimlBar.style.width = '0%';
    if (discordBar) discordBar.style.width = '0%';

    if (pythonCounter) pythonCounter.textContent = '0';
    if (aimlCounter) aimlCounter.textContent = '0';
    if (discordCounter) discordCounter.textContent = '0';

    setTimeout(() => {
      if (pythonBar) pythonBar.style.width = '25%';
      if (pythonCounter) animateCounter(pythonCounter, 25, 800);

      if (aimlBar) aimlBar.style.width = '0%';
      if (aimlCounter) animateCounter(aimlCounter, 0, 400);

      if (discordBar) discordBar.style.width = '50%';
      if (discordCounter) animateCounter(discordCounter, 50, 1000);
      sfx.playScore();
    }, 250);
  }

  if (reanimateBtn) {
    reanimateBtn.addEventListener('click', triggerProgressAnimations);
  }

  /* --------------------------------------------------------------------------
   * 5. PROFANITY MODERATION FILTER & GMAIL AUTH
   * Ensures respectful, clean community gamer tags on the Leaderboard
   * -------------------------------------------------------------------------- */
  const PROFANITY_LIST = [
    'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'dick', 'pussy', 'bastard',
    'slut', 'whore', 'nigger', 'nigga', 'faggot', 'retard', 'cock', 'penis',
    'vagina', 'chutiya', 'madarchod', 'bhenchod', 'gandu', 'bhosdike', 'harami',
    'randi', 'saala', 'kamina', 'lund', 'tatti', 'suar', 'mc', 'bc'
  ];

  function containsProfanity(text) {
    if (!text) return false;
    // Normalize leetspeak substitutions: @ -> a, $ -> s, 0 -> o, 1/! -> i, 3 -> e, 5 -> s
    let clean = text.toLowerCase()
      .replace(/@/g, 'a')
      .replace(/\$/g, 's')
      .replace(/0/g, 'o')
      .replace(/[1!|]/g, 'i')
      .replace(/3/g, 'e')
      .replace(/5/g, 's')
      .replace(/[^a-z0-9]/g, '');

    for (const badWord of PROFANITY_LIST) {
      if (clean.includes(badWord)) {
        return true;
      }
    }
    return false;
  }

  // Strict Real Gmail Validation
  function isValidRealGmail(email) {
    if (!email || typeof email !== 'string') return false;
    const clean = email.toLowerCase().trim();
    const gmailRegex = /^[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9.]{4,28}[a-zA-Z0-9]@gmail\.com$/;
    if (!gmailRegex.test(clean)) return false;
    const username = clean.replace('@gmail.com', '');
    const knownFakes = ['test', 'admin', 'fake', 'asdf', '123456', 'example', 'user', 'abc', 'player', 'demo', 'xyz'];
    if (knownFakes.includes(username)) return false;
    return true;
  }

  // SHA-256 password hasher using standard Web Crypto API
  async function hashPassword(str) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(str);
      const hashBuf = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuf));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      // Fallback simple hash for older environments
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
      }
      return 'fb_' + Math.abs(hash).toString(16);
    }
  }

  // Local Accounts Database (persists accounts across offline / local preview)
  function getLocalUsers() {
    try {
      return JSON.parse(localStorage.getItem('jaishnav_users_v3') || '{}');
    } catch (e) {
      return {};
    }
  }

  function saveLocalUser(email, name, passHash) {
    const users = getLocalUsers();
    users[email.toLowerCase().trim()] = {
      email: email.toLowerCase().trim(),
      name: name.trim(),
      passwordHash: passHash,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('jaishnav_users_v3', JSON.stringify(users));
  }

  // Auth State Management
  const authState = {
    user: null,

    init() {
      const saved = localStorage.getItem('jaishnav_auth_user');
      if (saved) {
        try {
          this.user = JSON.parse(saved);
        } catch (e) {
          this.user = null;
        }
      }
      this.updateUI();
    },

    signIn(email, displayName) {
      this.user = {
        email: email.trim().toLowerCase(),
        displayName: displayName.trim(),
        verified: true,
        joinedAt: new Date().toLocaleDateString()
      };
      localStorage.setItem('jaishnav_auth_user', JSON.stringify(this.user));
      this.updateUI();
      sfx.playFanfare();
    },

    signOut() {
      this.user = null;
      localStorage.removeItem('jaishnav_auth_user');
      this.updateUI();
    },

    updateUI() {
      const container = document.getElementById('auth-status-container');
      const openBtn = document.getElementById('open-auth-btn');

      if (!container) return;

      if (this.user) {
        container.innerHTML = `
          <div class="user-signed-in-pill">
            <span class="status-dot"></span>
            <span class="user-name-tag">${this.user.displayName}</span>
            <span class="user-email-tag hide-mobile">(${this.user.email})</span>
            <span class="verified-gmail-badge"><i class="fa-solid fa-circle-check"></i> Verified</span>
          </div>
        `;
        if (openBtn) {
          openBtn.className = 'btn btn-sm btn-ghost';
          openBtn.innerHTML = '<i class="fa-solid fa-arrow-right-from-bracket"></i> Sign Out';
          openBtn.onclick = () => {
            this.signOut();
          };
        }
      } else {
        container.innerHTML = `
          <span class="guest-indicator"><i class="fa-regular fa-user"></i> Playing as <strong>Guest</strong></span>
          <span class="ribbon-hint hide-mobile">&bull; Sign in with your Gmail and Password to record your rank!</span>
        `;
        if (openBtn) {
          openBtn.className = 'btn btn-sm btn-google-auth';
          openBtn.innerHTML = `
            <svg class="google-svg-icon" viewBox="0 0 24 24" width="16" height="16">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Log In / Sign Up</span>
          `;
          openBtn.onclick = () => openAuthModal('login');
        }
      }
    }
  };

  // Auth Modal Elements & Tab Switching
  const authModal = document.getElementById('auth-modal');
  const authModalCloseBtn = document.getElementById('auth-modal-close-btn');
  const authTabBtnLogin = document.getElementById('auth-tab-btn-login');
  const authTabBtnRegister = document.getElementById('auth-tab-btn-register');
  const authLoginForm = document.getElementById('auth-login-form');
  const authRegisterForm = document.getElementById('auth-register-form');
  const switchToRegister = document.getElementById('switch-to-register');
  const switchToLogin = document.getElementById('switch-to-login');

  const authModWarning = document.getElementById('auth-mod-warning');
  const authModWarningText = document.getElementById('auth-mod-warning-text');
  const authSuccessBox = document.getElementById('auth-success-box');
  const authSuccessText = document.getElementById('auth-success-text');

  function showAuthTab(mode) {
    if (authModWarning) authModWarning.style.display = 'none';
    if (authSuccessBox) authSuccessBox.style.display = 'none';

    if (mode === 'register') {
      if (authTabBtnRegister) authTabBtnRegister.classList.add('active');
      if (authTabBtnLogin) authTabBtnLogin.classList.remove('active');
      if (authRegisterForm) authRegisterForm.style.display = 'flex';
      if (authLoginForm) authLoginForm.style.display = 'none';
      const emailInput = document.getElementById('auth-register-email');
      if (emailInput) emailInput.focus();
    } else {
      if (authTabBtnLogin) authTabBtnLogin.classList.add('active');
      if (authTabBtnRegister) authTabBtnRegister.classList.remove('active');
      if (authLoginForm) authLoginForm.style.display = 'flex';
      if (authRegisterForm) authRegisterForm.style.display = 'none';
      const emailInput = document.getElementById('auth-login-email');
      if (emailInput) emailInput.focus();
    }
  }

  function openAuthModal(defaultTab = 'login') {
    if (!authModal) return;
    authModal.style.display = 'flex';
    authModal.setAttribute('aria-hidden', 'false');
    showAuthTab(defaultTab);
  }

  function closeAuthModal() {
    if (!authModal) return;
    authModal.style.display = 'none';
    authModal.setAttribute('aria-hidden', 'true');
  }

  if (authTabBtnLogin) authTabBtnLogin.addEventListener('click', () => showAuthTab('login'));
  if (authTabBtnRegister) authTabBtnRegister.addEventListener('click', () => showAuthTab('register'));
  if (switchToRegister) switchToRegister.addEventListener('click', () => showAuthTab('register'));
  if (switchToLogin) switchToLogin.addEventListener('click', () => showAuthTab('login'));

  if (authModalCloseBtn) authModalCloseBtn.addEventListener('click', closeAuthModal);
  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) closeAuthModal();
    });
  }

  // 1. Handle LOG IN Submission
  if (authLoginForm) {
    authLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = (document.getElementById('auth-login-email').value || '').trim();
      const pass = (document.getElementById('auth-login-pass').value || '');

      if (!isValidRealGmail(email)) {
        authModWarning.style.display = 'flex';
        authModWarningText.textContent = 'Please enter a valid, real @gmail.com address (6-30 characters).';
        sfx.playWarning();
        return;
      }

      if (!pass || pass.length < 6) {
        authModWarning.style.display = 'flex';
        authModWarningText.textContent = 'Password must be at least 6 characters.';
        sfx.playWarning();
        return;
      }

      const passHash = await hashPassword(pass);
      const submitBtn = document.getElementById('btn-submit-login');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';
      }

      try {
        // Attempt cloud login
        const res = await fetch(CLOUD_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'login',
            email: email,
            passwordHash: passHash
          })
        });

        const resData = await res.json();

        if (res.ok && resData.success && resData.user) {
          saveLocalUser(resData.user.email, resData.user.displayName, passHash);
          authModWarning.style.display = 'none';
          if (authSuccessBox) {
            authSuccessBox.style.display = 'flex';
            authSuccessText.textContent = `Welcome back, ${resData.user.displayName}! Successfully logged in.`;
          }
          authState.signIn(resData.user.email, resData.user.displayName);
          leaderboardSystem.recordUserScore();
          setTimeout(() => {
            closeAuthModal();
            const tabLb = document.getElementById('tab-leaderboard');
            if (tabLb) tabLb.click();
          }, 600);
        } else {
          // Check local users DB as fallback
          const localUsers = getLocalUsers();
          const cleanEmail = email.toLowerCase().trim();
          const localUser = localUsers[cleanEmail];

          if (localUser && localUser.passwordHash === passHash) {
            authModWarning.style.display = 'none';
            if (authSuccessBox) {
              authSuccessBox.style.display = 'flex';
              authSuccessText.textContent = `Welcome back, ${localUser.name}! Successfully logged in.`;
            }
            authState.signIn(localUser.email, localUser.name);
            leaderboardSystem.recordUserScore();
            setTimeout(() => {
              closeAuthModal();
              const tabLb = document.getElementById('tab-leaderboard');
              if (tabLb) tabLb.click();
            }, 600);
          } else {
            authModWarning.style.display = 'flex';
            authModWarningText.textContent = resData.error || 'Incorrect password or account not found. Try creating an account.';
            sfx.playWarning();
          }
        }
      } catch (err) {
        // Network fallback to local DB
        const localUsers = getLocalUsers();
        const cleanEmail = email.toLowerCase().trim();
        const localUser = localUsers[cleanEmail];
        if (localUser && localUser.passwordHash === passHash) {
          authState.signIn(localUser.email, localUser.name);
          closeAuthModal();
        } else {
          authModWarning.style.display = 'flex';
          authModWarningText.textContent = 'Unable to log in. Please check your password or network connection.';
          sfx.playWarning();
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-arrow-right-to-bracket"></i> Log In to Leaderboard';
        }
      }
    });
  }

  // 2. Handle CREATE ACCOUNT Submission
  if (authRegisterForm) {
    authRegisterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = (document.getElementById('auth-register-email').value || '').trim();
      const name = (document.getElementById('auth-register-name').value || '').trim();
      const pass = (document.getElementById('auth-register-pass').value || '');
      const confirmPass = (document.getElementById('auth-register-confirm').value || '');

      if (!isValidRealGmail(email)) {
        authModWarning.style.display = 'flex';
        authModWarningText.textContent = 'Please enter a genuine, registered @gmail.com address (6-30 characters).';
        sfx.playWarning();
        return;
      }

      if (name.length < 3 || name.length > 16) {
        authModWarning.style.display = 'flex';
        authModWarningText.textContent = 'Gamer tag must be between 3 and 16 characters.';
        sfx.playWarning();
        return;
      }

      if (containsProfanity(name)) {
        authModWarning.style.display = 'flex';
        authModWarningText.textContent = '⚠️ Inappropriate or abusive language detected. Please choose a clean, friendly gamer tag.';
        sfx.playWarning();
        return;
      }

      if (pass.length < 6) {
        authModWarning.style.display = 'flex';
        authModWarningText.textContent = 'Password must be at least 6 characters long.';
        sfx.playWarning();
        return;
      }

      if (pass !== confirmPass) {
        authModWarning.style.display = 'flex';
        authModWarningText.textContent = 'Passwords do not match. Please re-enter your password.';
        sfx.playWarning();
        return;
      }

      const passHash = await hashPassword(pass);
      const submitBtn = document.getElementById('btn-submit-register');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...';
      }

      try {
        const res = await fetch(CLOUD_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'register',
            email: email,
            name: name,
            passwordHash: passHash
          })
        });

        const resData = await res.json();

        if (res.ok && resData.success && resData.user) {
          saveLocalUser(resData.user.email, resData.user.displayName, passHash);
          authModWarning.style.display = 'none';
          if (authSuccessBox) {
            authSuccessBox.style.display = 'flex';
            authSuccessText.textContent = `Account created successfully! Welcome, ${resData.user.displayName}!`;
          }
          authState.signIn(resData.user.email, resData.user.displayName);
          leaderboardSystem.recordUserScore();
          setTimeout(() => {
            closeAuthModal();
            const tabLb = document.getElementById('tab-leaderboard');
            if (tabLb) tabLb.click();
          }, 600);
        } else {
          authModWarning.style.display = 'flex';
          authModWarningText.textContent = resData.error || 'Failed to create account. This Gmail may already be registered.';
          sfx.playWarning();
        }
      } catch (err) {
        // Fallback local registration
        saveLocalUser(email, name, passHash);
        authState.signIn(email, name);
        closeAuthModal();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Create Account &amp; Join Leaderboard';
        }
      }
    });
  }

  /* --------------------------------------------------------------------------
   * 6. GLOBAL LEADERBOARD ENGINE (FRESH 100% NEW DATABASE)
   * -------------------------------------------------------------------------- */
  const DEFAULT_LEADERBOARD = {
    flappy: [],
    runner: [],
    snake: []
  };

  const CLOUD_API_URL = '/.netlify/functions/leaderboard';

  const leaderboardSystem = {
    data: null,
    activeLbGame: 'flappy',

    init() {
      const saved = localStorage.getItem('jaishnav_leaderboard_data');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const hasDummy = (parsed.flappy || []).some(p => p.name === 'VajraAce' || p.name === 'ShadowStrike') ||
                           (parsed.runner || []).some(p => p.name === 'CyberRex');
          if (hasDummy) {
            this.data = JSON.parse(JSON.stringify(DEFAULT_LEADERBOARD));
            this.save();
          } else {
            this.data = parsed;
          }
        } catch (e) {
          this.data = JSON.parse(JSON.stringify(DEFAULT_LEADERBOARD));
        }
      } else {
        this.data = JSON.parse(JSON.stringify(DEFAULT_LEADERBOARD));
      }
      this.render();
      this.fetchCloudScores();
    },

    save() {
      localStorage.setItem('jaishnav_leaderboard_data', JSON.stringify(this.data));
    },

    async fetchCloudScores() {
      try {
        const res = await fetch(CLOUD_API_URL + '?t=' + Date.now());
        if (res.ok) {
          const cloudData = await res.json();
          if (cloudData && (cloudData.flappy || cloudData.runner || cloudData.snake)) {
            this.data = cloudData;
            this.save();
            this.render();
          }
        }
      } catch (e) {}
    },

    submitScore(gameKey, score) {
      if (!authState.user || score <= 0) return { rank: 0, newBest: false };

      const list = this.data[gameKey] || [];
      const userRawEmail = authState.user.email.toLowerCase().trim();
      const userMasked = userRawEmail.replace(/(.{2,3})(.*)(@gmail\.com)/, '$1***$3');

      // Check if user already exists
      const existingIdx = list.findIndex(p => {
        const pEmail = (p.rawEmail || p.email || '').toLowerCase().trim();
        return pEmail === userRawEmail || pEmail === userMasked || p.name.toLowerCase() === authState.user.displayName.toLowerCase();
      });

      let isNewBest = false;
      if (existingIdx !== -1) {
        list[existingIdx].name = authState.user.displayName;
        list[existingIdx].rawEmail = userRawEmail;
        list[existingIdx].email = userMasked;
        if (score > list[existingIdx].score) {
          list[existingIdx].score = score;
          isNewBest = true;
        }
      } else {
        list.push({
          name: authState.user.displayName,
          rawEmail: userRawEmail,
          email: userMasked,
          score: score
        });
        isNewBest = true;
      }

      // Sort descending
      list.sort((a, b) => b.score - a.score);

      // Re-assign ranks
      list.forEach((item, idx) => {
        item.rank = idx + 1;
      });

      // Keep up to 50 players (prevents losing verified player records)
      this.data[gameKey] = list.slice(0, 50);
      this.save();
      this.render();

      const myRank = list.findIndex(p => {
        const pEmail = (p.rawEmail || p.email || '').toLowerCase().trim();
        return pEmail === userRawEmail || p.name.toLowerCase() === authState.user.displayName.toLowerCase();
      }) + 1;

      // Sync with cloud database so mobile and laptop see each other!
      fetch(CLOUD_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: gameKey,
          name: authState.user.displayName,
          email: authState.user.email,
          score: score
        })
      }).then(res => res.json()).then(resJson => {
        if (resJson && resJson.data) {
          this.data = resJson.data;
          this.save();
          this.render();
        }
      }).catch(() => {});

      return { rank: myRank > 0 ? myRank : 1, newBest: isNewBest };
    },

    recordUserScore() {
      const birdHs = parseInt(localStorage.getItem('jaishnav_hs_flappy') || '0', 10);
      const dinoHs = parseInt(localStorage.getItem('jaishnav_hs_runner') || '0', 10);
      const snakeHs = parseInt(localStorage.getItem('jaishnav_hs_snake') || '0', 10);

      if (birdHs > 0) this.submitScore('flappy', birdHs);
      if (dinoHs > 0) this.submitScore('runner', dinoHs);
      if (snakeHs > 0) this.submitScore('snake', snakeHs);
    },

    render() {
      const tbody = document.getElementById('leaderboard-tbody');
      if (!tbody) return;

      const list = this.data[this.activeLbGame] || [];
      tbody.innerHTML = '';

      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="empty-table-state"><i class="fa-solid fa-trophy-star"></i><br>Leaderboard is brand new! Be the first player to set a verified high score!</td></tr>`;
        return;
      }

      const userRawEmail = authState.user ? authState.user.email.toLowerCase().trim() : '';
      const userDisplayName = authState.user ? authState.user.displayName.toLowerCase().trim() : '';

      list.forEach((item) => {
        const tr = document.createElement('tr');

        let rankClass = 'rank-other';
        let crown = '';
        if (item.rank === 1) { rankClass = 'rank-1'; crown = '<i class="fa-solid fa-crown text-amber"></i> '; }
        else if (item.rank === 2) { rankClass = 'rank-2'; crown = '<i class="fa-solid fa-medal text-slate"></i> '; }
        else if (item.rank === 3) { rankClass = 'rank-3'; crown = '<i class="fa-solid fa-award text-amber"></i> '; }

        const initial = item.name.charAt(0).toUpperCase();

        const isMe = authState.user && (
          (item.rawEmail && item.rawEmail.toLowerCase() === userRawEmail) ||
          (item.email && item.email.toLowerCase().startsWith(userRawEmail.slice(0, 3))) ||
          item.name.toLowerCase() === userDisplayName
        );

        if (isMe) {
          tr.classList.add('my-rank-row');
        }

        const youBadge = isMe ? '<span class="you-badge">YOU</span>' : '';

        tr.innerHTML = `
          <td><span class="rank-badge ${rankClass}">${crown}${item.rank}</span></td>
          <td>
            <div class="player-name-cell">
              <span class="player-avatar-circle">${initial}</span>
              <div class="player-name-meta">
                <span class="player-name-text">${item.name} ${youBadge}</span>
                <span class="player-sub-email show-mobile"><i class="fa-solid fa-circle-check text-emerald"></i> ${item.email}</span>
              </div>
            </div>
          </td>
          <td class="td-verified hide-mobile"><span class="verified-gmail-badge"><i class="fa-solid fa-circle-check"></i> ${item.email}</span></td>
          <td><span class="table-score-val">${item.score}</span></td>
        `;
        tbody.appendChild(tr);
      });
    }
  };

  // Leaderboard filter buttons
  document.querySelectorAll('.lb-filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lb-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      leaderboardSystem.activeLbGame = btn.dataset.lb;
      leaderboardSystem.render();
      sfx.playClick();
    });
  });

  const viewLbShortcut = document.getElementById('view-leaderboard-shortcut-btn');
  if (viewLbShortcut) {
    viewLbShortcut.addEventListener('click', () => {
      const tabLb = document.getElementById('tab-leaderboard');
      if (tabLb) tabLb.click();
    });
  }

  const modalSigninPromptBtn = document.getElementById('modal-signin-prompt-btn');
  if (modalSigninPromptBtn) {
    modalSigninPromptBtn.addEventListener('click', () => {
      openAuthModal();
    });
  }

  const viewMyRankBtn = document.getElementById('modal-view-my-rank-btn');
  if (viewMyRankBtn) {
    viewMyRankBtn.addEventListener('click', () => {
      const modalOverlay = document.getElementById('game-modal-overlay');
      if (modalOverlay) modalOverlay.classList.add('hidden');
      const tabLb = document.getElementById('tab-leaderboard');
      if (tabLb) tabLb.click();
    });
  }

  // Cross-tab storage synchronization
  window.addEventListener('storage', (e) => {
    if (e.key === 'jaishnav_leaderboard_data') {
      leaderboardSystem.init();
    } else if (e.key === 'jaishnav_auth_user') {
      authState.init();
      leaderboardSystem.render();
    }
  });

  /* --------------------------------------------------------------------------
   * 7. PLAYABLE ARCADE SUITE (HTML5 CANVAS)
   * Game 1: Nav Cyber Bird
   * Game 2: Nav Cyber Dino (Authentic Cyber T-Rex)
   * Game 3: Nav Snake (Apple Eating Game)
   * -------------------------------------------------------------------------- */
  const canvas = document.getElementById('game-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');

    const tabFlappy = document.getElementById('tab-flappy');
    const tabRunner = document.getElementById('tab-runner');
    const tabSnake = document.getElementById('tab-snake');
    const tabLeaderboard = document.getElementById('tab-leaderboard');

    const canvasContainer = document.getElementById('canvas-container');
    const leaderboardView = document.getElementById('leaderboard-view');
    const arcadeScoreBar = document.getElementById('arcade-score-bar');
    const snakeTouchControls = document.getElementById('snake-touch-controls');

    const currentScoreEl = document.getElementById('current-score-text');
    const highScoreEl = document.getElementById('high-score-text');
    const helpTextEl = document.getElementById('arcade-help-text');
    const instructionsEl = document.getElementById('game-instructions-text');

    const gameModalOverlay = document.getElementById('game-modal-overlay');
    const modalTag = document.getElementById('modal-tag');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalScoreSummary = document.getElementById('modal-score-summary');
    const modalLeaderboardCta = document.getElementById('modal-leaderboard-cta');
    const summaryFinalScore = document.getElementById('summary-final-score');
    const summaryBestScore = document.getElementById('summary-best-score');
    const startGameBtn = document.getElementById('start-game-btn');
    const resetHighscoresBtn = document.getElementById('reset-highscores-btn');

    const V_WIDTH = 800;
    const V_HEIGHT = 420;

    let activeGame = 'flappy'; // 'flappy' | 'runner' | 'snake' | 'leaderboard'
    let isPlaying = false;
    let animationFrameId = null;

    let highScores = {
      flappy: parseInt(localStorage.getItem('jaishnav_hs_flappy') || '0', 10),
      runner: parseInt(localStorage.getItem('jaishnav_hs_runner') || '0', 10),
      snake: parseInt(localStorage.getItem('jaishnav_hs_snake') || '0', 10)
    };

    function updateScoreUI(current, high) {
      if (currentScoreEl) currentScoreEl.textContent = current;
      if (highScoreEl) highScoreEl.textContent = high;
    }

    /* ========================================================================
     * GAME 1: NAV CYBER BIRD
     * ======================================================================== */
    const flappyGame = {
      bird: {
        x: 140,
        y: 200,
        radius: 16,
        vy: 0,
        gravity: 0.36,
        jump: -7.2,
        tilt: 0,
        wingPhase: 0
      },
      pipes: [],
      particles: [],
      frameCounter: 0,
      score: 0,
      speed: 2.8,

      init() {
        this.bird.y = 190;
        this.bird.vy = 0;
        this.bird.tilt = 0;
        this.bird.wingPhase = 0;
        this.pipes = [];
        this.particles = [];
        this.frameCounter = 0;
        this.score = 0;
        this.speed = 2.8;
      },

      flap() {
        this.bird.vy = this.bird.jump;
        this.bird.wingPhase = 1;
        sfx.playBirdFlap();

        // Feather / thrust sparks
        for (let i = 0; i < 5; i++) {
          this.particles.push({
            x: this.bird.x - 12,
            y: this.bird.y + (Math.random() - 0.5) * 8,
            vx: -Math.random() * 3 - 1.5,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 2.5 + 1.5,
            color: '#38bdf8',
            life: 18
          });
        }
      },

      update() {
        this.bird.vy += this.bird.gravity;
        this.bird.y += this.bird.vy;
        this.bird.tilt = Math.min(Math.max(this.bird.vy * 3, -25), 45);
        this.bird.wingPhase += 0.2;

        if (this.bird.y < 16) {
          this.bird.y = 16;
          this.bird.vy = 0;
        }
        if (this.bird.y >= V_HEIGHT - 36) {
          return true; // Crash
        }

        this.frameCounter++;
        if (this.frameCounter % 120 === 0) {
          const gap = 130;
          const minH = 40;
          const maxH = V_HEIGHT - 60 - gap - minH;
          const topH = Math.floor(Math.random() * maxH) + minH;
          this.pipes.push({
            x: V_WIDTH,
            width: 48,
            top: topH,
            bottom: topH + gap,
            passed: false
          });
        }

        for (let i = this.pipes.length - 1; i >= 0; i--) {
          const p = this.pipes[i];
          p.x -= this.speed;

          // Bird circle collision against top & bottom pipes
          const bx = this.bird.x;
          const by = this.bird.y;
          const r = this.bird.radius - 2;

          // Top pipe collision
          if (bx + r > p.x && bx - r < p.x + p.width && by - r < p.top) {
            return true;
          }
          // Bottom pipe collision
          if (bx + r > p.x && bx - r < p.x + p.width && by + r > p.bottom) {
            return true;
          }

          if (!p.passed && p.x + p.width < this.bird.x) {
            p.passed = true;
            this.score++;
            sfx.playScore();
            updateScoreUI(this.score, Math.max(this.score, highScores.flappy));
          }

          if (p.x + p.width < 0) {
            this.pipes.splice(i, 1);
          }
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
          const pt = this.particles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life--;
          if (pt.life <= 0) this.particles.splice(i, 1);
        }

        return false;
      },

      draw() {
        ctx.fillStyle = '#070b14';
        ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

        // Faint skyline grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        for (let x = 0; x < V_WIDTH; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, V_HEIGHT);
          ctx.stroke();
        }

        // Ground platform
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, V_HEIGHT - 20, V_WIDTH, 20);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, V_HEIGHT - 20);
        ctx.lineTo(V_WIDTH, V_HEIGHT - 20);
        ctx.stroke();

        // Laser Pillars
        for (const p of this.pipes) {
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(p.x, 0, p.width, p.top);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(p.x, 0, p.width, p.top);

          const botH = V_HEIGHT - 20 - p.bottom;
          ctx.fillRect(p.x, p.bottom, p.width, botH);
          ctx.strokeRect(p.x, p.bottom, p.width, botH);

          ctx.fillStyle = '#0284c7';
          ctx.fillRect(p.x - 2, p.top - 8, p.width + 4, 8);
          ctx.fillRect(p.x - 2, p.bottom, p.width + 4, 8);
        }

        // Particles
        for (const pt of this.particles) {
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = pt.life / 18;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Draw Cute Cyber Bird
        const b = this.bird;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate((b.tilt * Math.PI) / 180);

        // Bird Oval Body
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.ellipse(0, 0, 16, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Belly
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.ellipse(-2, 3, 10, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Wing (Flapping)
        const wingY = Math.sin(b.wingPhase) * 6;
        ctx.fillStyle = '#0369a1';
        ctx.beginPath();
        ctx.ellipse(-4, wingY, 8, 5, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Eye & Glow
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(7, -4, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(8, -4, 2, 0, Math.PI * 2);
        ctx.fill();

        // Beak
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(14, -2);
        ctx.lineTo(21, 0);
        ctx.lineTo(14, 3);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }
    };

    /* ========================================================================
     * GAME 2: NAV CYBER DINO (AUTHENTIC CYBER T-REX)
     * ======================================================================== */
    const runnerGame = {
      dino: {
        x: 90,
        y: 0,
        baseY: V_HEIGHT - 28 - 48,
        width: 44,
        height: 48,
        vy: 0,
        gravity: 0.62,
        jump: -12.4,
        isJumping: false,
        stepCycle: 0
      },
      obstacles: [],
      particles: [],
      groundOffset: 0,
      score: 0,
      speed: 5.5,
      spawnTimer: 0,
      nextSpawnIn: 85,

      init() {
        this.dino.y = this.dino.baseY;
        this.dino.vy = 0;
        this.dino.isJumping = false;
        this.dino.stepCycle = 0;
        this.obstacles = [];
        this.particles = [];
        this.groundOffset = 0;
        this.score = 0;
        this.speed = 5.5;
        this.spawnTimer = 0;
        this.nextSpawnIn = 80;
      },

      jump() {
        if (!this.dino.isJumping) {
          this.dino.vy = this.dino.jump;
          this.dino.isJumping = true;
          sfx.playDinoJump();

          for (let i = 0; i < 4; i++) {
            this.particles.push({
              x: this.dino.x + 12,
              y: this.dino.baseY + this.dino.height,
              vx: -Math.random() * 2 - 1,
              vy: -Math.random() * 2,
              size: Math.random() * 2.5 + 1.5,
              color: '#10b981',
              life: 14
            });
          }
        }
      },

      update() {
        this.dino.vy += this.dino.gravity;
        this.dino.y += this.dino.vy;

        if (this.dino.y >= this.dino.baseY) {
          this.dino.y = this.dino.baseY;
          this.dino.vy = 0;
          this.dino.isJumping = false;
        }

        if (!this.dino.isJumping) {
          this.dino.stepCycle += 0.28;
        }

        this.score += 0.15;
        const currentScoreFloor = Math.floor(this.score);
        updateScoreUI(currentScoreFloor, Math.max(currentScoreFloor, highScores.runner));

        this.speed += 0.0006;
        this.groundOffset = (this.groundOffset + this.speed) % 40;

        this.spawnTimer++;
        if (this.spawnTimer >= this.nextSpawnIn) {
          this.spawnTimer = 0;
          this.nextSpawnIn = Math.floor(Math.random() * 60) + 70;

          const isTall = Math.random() > 0.6;
          const obsW = isTall ? 22 : 30;
          const obsH = isTall ? 44 : 28;

          this.obstacles.push({
            x: V_WIDTH,
            y: V_HEIGHT - 28 - obsH,
            width: obsW,
            height: obsH,
            isTall
          });
        }

        for (let i = this.obstacles.length - 1; i >= 0; i--) {
          const obs = this.obstacles[i];
          obs.x -= this.speed;

          // Dinosaur hitbox
          const dx = this.dino.x + 8;
          const dy = this.dino.y + 4;
          const dw = this.dino.width - 14;
          const dh = this.dino.height - 6;

          if (
            dx < obs.x + obs.width &&
            dx + dw > obs.x &&
            dy < obs.y + obs.height &&
            dy + dh > obs.y
          ) {
            return true;
          }

          if (obs.x + obs.width < 0) {
            this.obstacles.splice(i, 1);
          }
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
          const pt = this.particles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life--;
          if (pt.life <= 0) this.particles.splice(i, 1);
        }

        return false;
      },

      draw() {
        ctx.fillStyle = '#070b14';
        ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

        const groundY = V_HEIGHT - 28;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, groundY, V_WIDTH, 28);

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.lineTo(V_WIDTH, groundY);
        ctx.stroke();

        // Ground hashes
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
        for (let x = -this.groundOffset; x < V_WIDTH; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, groundY + 2);
          ctx.lineTo(x + 15, groundY + 12);
          ctx.stroke();
        }

        // Obstacles (Cyber Cacti)
        for (const obs of this.obstacles) {
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

          ctx.strokeStyle = obs.isTall ? '#f43f5e' : '#f59e0b';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
        }

        // Dust particles
        for (const pt of this.particles) {
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = pt.life / 14;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // DRAW AUTHENTIC CYBER DINOSAUR (T-REX)
        const d = this.dino;
        ctx.save();
        ctx.translate(d.x, d.y);

        ctx.fillStyle = '#065f46';
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;

        // Dino Body & Torso
        ctx.beginPath();
        ctx.moveTo(6, 26);
        ctx.lineTo(0, 32); // tail point
        ctx.lineTo(8, 32);
        ctx.lineTo(12, 38);
        ctx.lineTo(26, 38);
        ctx.lineTo(28, 22);
        ctx.lineTo(20, 16);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Dino Head / Snout
        ctx.beginPath();
        ctx.rect(18, 4, 20, 14); // head box
        ctx.fill();
        ctx.stroke();

        // Eye
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(24, 7, 3, 3);

        // Mouth / Tooth gap
        ctx.fillStyle = '#070b14';
        ctx.fillRect(32, 13, 6, 2);

        // Cute T-Rex Arms
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(27, 26);
        ctx.lineTo(33, 26);
        ctx.lineTo(33, 29);
        ctx.stroke();

        // Legs (Running Animation Cycle)
        const footStep = Math.sin(d.stepCycle);
        if (d.isJumping) {
          // Tucked legs when jumping
          ctx.beginPath();
          ctx.moveTo(16, 38);
          ctx.lineTo(13, 44);
          ctx.moveTo(22, 38);
          ctx.lineTo(25, 44);
          ctx.stroke();
        } else {
          // Left Leg
          ctx.beginPath();
          ctx.moveTo(16, 38);
          ctx.lineTo(16 - footStep * 6, 48);
          ctx.stroke();

          // Right Leg
          ctx.beginPath();
          ctx.moveTo(22, 38);
          ctx.lineTo(22 + footStep * 6, 48);
          ctx.stroke();
        }

        ctx.restore();
      }
    };

    /* ========================================================================
     * GAME 3: NAV SNAKE GAME (APPLE EATING ADVENTURE)
     * ======================================================================== */
    const snakeGame = {
      gridSize: 20,
      cols: 40,
      rows: 21,
      snake: [],
      dir: { x: 1, y: 0 },
      nextDir: { x: 1, y: 0 },
      apple: { x: 15, y: 10 },
      particles: [],
      score: 0,
      speedTicks: 7, // updates every 7 frames (~8.5 fps)
      tickCount: 0,

      init() {
        this.cols = Math.floor(V_WIDTH / this.gridSize);
        this.rows = Math.floor(V_HEIGHT / this.gridSize);
        this.snake = [
          { x: 10, y: 10 },
          { x: 9, y: 10 },
          { x: 8, y: 10 }
        ];
        this.dir = { x: 1, y: 0 };
        this.nextDir = { x: 1, y: 0 };
        this.score = 0;
        this.tickCount = 0;
        this.speedTicks = 7;
        this.particles = [];
        this.spawnApple();
      },

      spawnApple() {
        let valid = false;
        while (!valid) {
          const rx = Math.floor(Math.random() * (this.cols - 2)) + 1;
          const ry = Math.floor(Math.random() * (this.rows - 2)) + 1;
          const collision = this.snake.some(segment => segment.x === rx && segment.y === ry);
          if (!collision) {
            this.apple = { x: rx, y: ry };
            valid = true;
          }
        }
      },

      setDirection(dx, dy) {
        // Prevent 180-degree self-turn
        if (dx !== -this.dir.x && dy !== -this.dir.y) {
          this.nextDir = { x: dx, y: dy };
        }
      },

      update() {
        // Update apple particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
          const pt = this.particles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life--;
          if (pt.life <= 0) this.particles.splice(i, 1);
        }

        this.tickCount++;
        if (this.tickCount < this.speedTicks) return false;
        this.tickCount = 0;

        this.dir = this.nextDir;
        const head = { x: this.snake[0].x + this.dir.x, y: this.snake[0].y + this.dir.y };

        // Wall collisions
        if (head.x < 0 || head.x >= this.cols || head.y < 0 || head.y >= this.rows) {
          return true; // Crash
        }

        // Self collisions
        for (let i = 0; i < this.snake.length; i++) {
          if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
            return true;
          }
        }

        this.snake.unshift(head);

        // Apple Eaten
        if (head.x === this.apple.x && head.y === this.apple.y) {
          this.score += 10;
          sfx.playEatApple();
          updateScoreUI(this.score, Math.max(this.score, highScores.snake));

          // Burst particles
          const px = head.x * this.gridSize + this.gridSize / 2;
          const py = head.y * this.gridSize + this.gridSize / 2;
          for (let p = 0; p < 8; p++) {
            this.particles.push({
              x: px,
              y: py,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4,
              size: Math.random() * 3 + 2,
              color: '#ef4444',
              life: 18
            });
          }

          // Accelerate slightly
          if (this.score % 50 === 0 && this.speedTicks > 4) {
            this.speedTicks--;
          }

          this.spawnApple();
        } else {
          this.snake.pop();
        }

        return false;
      },

      draw() {
        ctx.fillStyle = '#060a12';
        ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

        // Subtle grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= V_WIDTH; x += this.gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, V_HEIGHT);
          ctx.stroke();
        }
        for (let y = 0; y <= V_HEIGHT; y += this.gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(V_WIDTH, y);
          ctx.stroke();
        }

        // Particles
        for (const pt of this.particles) {
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = pt.life / 18;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Draw Apple
        const ax = this.apple.x * this.gridSize + this.gridSize / 2;
        const ay = this.apple.y * this.gridSize + this.gridSize / 2;

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(ax, ay, this.gridSize / 2 - 2, 0, Math.PI * 2);
        ctx.fill();

        // Apple Leaf
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(ax + 2, ay - 6, 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw Snake
        for (let i = 0; i < this.snake.length; i++) {
          const seg = this.snake[i];
          const sx = seg.x * this.gridSize;
          const sy = seg.y * this.gridSize;

          if (i === 0) {
            // Head
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.roundRect(sx + 1, sy + 1, this.gridSize - 2, this.gridSize - 2, 6);
            ctx.fill();

            // Eyes
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(sx + 6, sy + 6, 2, 0, Math.PI * 2);
            ctx.arc(sx + 14, sy + 6, 2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Body segments
            ctx.fillStyle = i % 2 === 0 ? '#0284c7' : '#0369a1';
            ctx.beginPath();
            ctx.roundRect(sx + 2, sy + 2, this.gridSize - 4, this.gridSize - 4, 4);
            ctx.fill();
          }
        }
      }
    };

    /* ========================================================================
     * ARCADE STATE & GAME LOOP COORDINATION
     * ======================================================================== */
    function switchGame(type) {
      activeGame = type;
      isPlaying = false;
      cancelAnimationFrame(animationFrameId);

      // Handle Leaderboard Tab vs Game Canvas
      if (type === 'leaderboard') {
        tabLeaderboard.classList.add('active');
        tabFlappy.classList.remove('active');
        tabRunner.classList.remove('active');
        tabSnake.classList.remove('active');

        canvasContainer.style.display = 'none';
        arcadeScoreBar.style.display = 'none';
        leaderboardView.style.display = 'block';
        snakeTouchControls.style.display = 'none';
        leaderboardSystem.render();
        leaderboardSystem.fetchCloudScores();
        return;
      }

      // Show Game Canvas
      canvasContainer.style.display = 'flex';
      arcadeScoreBar.style.display = 'flex';
      leaderboardView.style.display = 'none';

      // Update Tabs
      tabLeaderboard.classList.remove('active');
      tabFlappy.classList.toggle('active', type === 'flappy');
      tabRunner.classList.toggle('active', type === 'runner');
      tabSnake.classList.toggle('active', type === 'snake');

      // Mobile Touch D-Pad for Snake
      snakeTouchControls.style.display = type === 'snake' ? 'flex' : 'none';

      if (type === 'flappy') {
        instructionsEl.textContent = 'Press Spacebar, Up Arrow, or Click/Tap canvas to keep bird airborne. Avoid laser gates!';
        helpTextEl.innerHTML = 'Press <kbd>Space</kbd>, <kbd>&uarr;</kbd> or <strong>Click / Tap</strong> to Fly';
        modalTag.textContent = 'Ready to Play';
        modalTitle.textContent = 'Nav Cyber Bird';
        modalDesc.textContent = 'Guide your cyber bird safely through high-voltage laser gates. Tap or press Space to keep flying!';
        updateScoreUI(0, highScores.flappy);
        flappyGame.init();
        flappyGame.draw();
      } else if (type === 'runner') {
        instructionsEl.textContent = 'Press Spacebar, Up Arrow, or Click/Tap canvas to jump over obstacles!';
        helpTextEl.innerHTML = 'Press <kbd>Space</kbd>, <kbd>&uarr;</kbd> or <strong>Click / Tap</strong> to Jump';
        modalTag.textContent = 'Ready to Play';
        modalTitle.textContent = 'Nav Cyber Dino';
        modalDesc.textContent = 'Sprint across the cyber grid as an adorable cyber T-Rex dinosaur and leap over hazard barriers!';
        updateScoreUI(0, highScores.runner);
        runnerGame.init();
        runnerGame.draw();
      } else if (type === 'snake') {
        instructionsEl.textContent = 'Use Arrow Keys, WASD, or on-screen D-Pad to steer the snake. Eat apples to grow!';
        helpTextEl.innerHTML = 'Steer with <kbd>&larr;</kbd><kbd>&uarr;</kbd><kbd>&rarr;</kbd><kbd>&darr;</kbd> or <strong>WASD</strong>';
        modalTag.textContent = 'Ready to Play';
        modalTitle.textContent = 'Nav Snake Game';
        modalDesc.textContent = 'Slither around the arena, eat glowing apples, and grow your cyber snake without hitting the walls!';
        updateScoreUI(0, highScores.snake);
        snakeGame.init();
        snakeGame.draw();
      }

      modalScoreSummary.style.display = 'none';
      modalLeaderboardCta.style.display = 'none';
      gameModalOverlay.classList.remove('hidden');
    }

    function startGame() {
      isPlaying = true;
      gameModalOverlay.classList.add('hidden');
      sfx.playClick();

      if (activeGame === 'flappy') {
        flappyGame.init();
        flappyGame.flap();
        updateScoreUI(0, highScores.flappy);
      } else if (activeGame === 'runner') {
        runnerGame.init();
        updateScoreUI(0, highScores.runner);
      } else if (activeGame === 'snake') {
        snakeGame.init();
        updateScoreUI(0, highScores.snake);
      }

      gameLoop();
    }

    function handleGameOver(finalScore) {
      isPlaying = false;
      cancelAnimationFrame(animationFrameId);
      sfx.playCrash();

      const key = activeGame;
      const storageKey = `jaishnav_hs_${key}`;

      if (finalScore > highScores[key]) {
        highScores[key] = finalScore;
        localStorage.setItem(storageKey, finalScore.toString());
      }

      updateScoreUI(finalScore, highScores[key]);

      const modalLbConfirmed = document.getElementById('modal-lb-confirmed');
      const modalLbRankText = document.getElementById('modal-lb-rank-text');

      // If user is signed in, automatically record to Leaderboard!
      if (authState.user && finalScore > 0) {
        const result = leaderboardSystem.submitScore(key, finalScore);
        if (modalLbConfirmed && modalLbRankText) {
          modalLbConfirmed.style.display = 'flex';
          modalLbRankText.textContent = `Saved to Leaderboard! Rank #${result.rank}`;
        }
        if (modalLeaderboardCta) modalLeaderboardCta.style.display = 'none';
        if (result.newBest) {
          sfx.playFanfare();
        }
      } else if (!authState.user) {
        if (modalLbConfirmed) modalLbConfirmed.style.display = 'none';
        if (modalLeaderboardCta) modalLeaderboardCta.style.display = 'flex';
      } else {
        if (modalLbConfirmed) modalLbConfirmed.style.display = 'none';
        if (modalLeaderboardCta) modalLeaderboardCta.style.display = 'none';
      }

      startGameBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Play Again';
      gameModalOverlay.classList.remove('hidden');
    }

    function gameLoop() {
      if (!isPlaying) return;

      let crashed = false;
      if (activeGame === 'flappy') {
        crashed = flappyGame.update();
        flappyGame.draw();
        if (crashed) {
          handleGameOver(flappyGame.score);
          return;
        }
      } else if (activeGame === 'runner') {
        crashed = runnerGame.update();
        runnerGame.draw();
        if (crashed) {
          handleGameOver(Math.floor(runnerGame.score));
          return;
        }
      } else if (activeGame === 'snake') {
        crashed = snakeGame.update();
        snakeGame.draw();
        if (crashed) {
          handleGameOver(snakeGame.score);
          return;
        }
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    }

    function triggerAction() {
      if (!isPlaying) return;
      if (activeGame === 'flappy') flappyGame.flap();
      else if (activeGame === 'runner') runnerGame.jump();
    }

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      // Space or Up for Bird & Dino
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (isPlaying && (activeGame === 'flappy' || activeGame === 'runner')) {
          e.preventDefault();
          triggerAction();
        }
      }

      // Snake steering controls
      if (isPlaying && activeGame === 'snake') {
        if (e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
          e.preventDefault();
          snakeGame.setDirection(0, -1);
        } else if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          e.preventDefault();
          snakeGame.setDirection(0, 1);
        } else if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          snakeGame.setDirection(-1, 0);
        } else if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          snakeGame.setDirection(1, 0);
        }
      }
    });

    // Mouse / Touch for Bird & Dino
    canvas.addEventListener('mousedown', (e) => {
      e.preventDefault();
      if (activeGame === 'flappy' || activeGame === 'runner') triggerAction();
    });

    canvas.addEventListener('touchstart', (e) => {
      if (isPlaying && (activeGame === 'flappy' || activeGame === 'runner')) {
        e.preventDefault();
        triggerAction();
      }
    }, { passive: false });

    // Touch D-Pad for Snake
    document.querySelectorAll('.dpad-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const dir = btn.dataset.dir;
        if (dir === 'up') snakeGame.setDirection(0, -1);
        else if (dir === 'down') snakeGame.setDirection(0, 1);
        else if (dir === 'left') snakeGame.setDirection(-1, 0);
        else if (dir === 'right') snakeGame.setDirection(1, 0);
        sfx.playClick();
      });
    });

    // Tab Listeners
    tabFlappy.addEventListener('click', () => switchGame('flappy'));
    tabRunner.addEventListener('click', () => switchGame('runner'));
    tabSnake.addEventListener('click', () => switchGame('snake'));
    tabLeaderboard.addEventListener('click', () => switchGame('leaderboard'));
    startGameBtn.addEventListener('click', startGame);

    if (resetHighscoresBtn) {
      resetHighscoresBtn.addEventListener('click', () => {
        highScores.flappy = 0;
        highScores.runner = 0;
        highScores.snake = 0;
        localStorage.removeItem('jaishnav_hs_flappy');
        localStorage.removeItem('jaishnav_hs_runner');
        localStorage.removeItem('jaishnav_hs_snake');
        updateScoreUI(0, 0);
      });
    }

    // Initialize Auth & Leaderboard
    authState.init();
    leaderboardSystem.init();

    // Start with Nav Cyber Bird
    switchGame('flappy');
  }

  /* --------------------------------------------------------------------------
   * 8. SMOOTH SCROLL REVEAL / POP-UP ANIMATIONS (INTERSECTION OBSERVER)
   * -------------------------------------------------------------------------- */
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;

    const revealSelectors = [
      '.section-header',
      '.hero-text-col',
      '.hero-card-col',
      '.detail-badge',
      '.skills-grid .skill-card',
      '.games-grid .game-card',
      '.roadmap-card',
      '.hardware-grid .spec-card',
      '.project-featured-card',
      '.coming-soon-card',
      '.teasers-grid .teaser-card',
      '.arcade-card'
    ];

    const elementsToReveal = document.querySelectorAll(revealSelectors.join(', '));

    const gridContainers = document.querySelectorAll('.skills-grid, .games-grid, .hardware-grid, .teasers-grid, .detail-badges-row');
    gridContainers.forEach((grid) => {
      Array.from(grid.children).forEach((child, index) => {
        child.style.transitionDelay = `${(index % 4) * 0.12}s`;
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');

            if (entry.target.classList.contains('roadmap-card')) {
              triggerProgressAnimations();
            }

            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
      }
    );

    elementsToReveal.forEach((el) => {
      el.classList.add('scroll-reveal');
      observer.observe(el);
    });
  }

  initScrollReveal();

  // Current year in footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();
