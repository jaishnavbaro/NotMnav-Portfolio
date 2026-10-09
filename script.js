/**
 * ============================================================================
 * JAISHNAV M BARO (NOTNAV) — PORTFOLIO JAVASCRIPT
 * Subtle Web Audio FX, Dynamic Progress Bars, & Built-in Arcade Suite
 * ============================================================================
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
   * 1. AUDIO SYNTHESIZER (WEB AUDIO API)
   * Subtle, clean UI sound effects
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

    playJump() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(650, this.ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
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
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(783.99, now + 0.07); // G5

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

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
      } catch (e) {}
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

        // Connect nearby particles
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
   * 5. PLAYABLE ARCADE SUITE (HTML5 CANVAS)
   * -------------------------------------------------------------------------- */
  const canvas = document.getElementById('game-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');

    const tabFlappy = document.getElementById('tab-flappy');
    const tabRunner = document.getElementById('tab-runner');
    const currentScoreEl = document.getElementById('current-score-text');
    const highScoreEl = document.getElementById('high-score-text');
    const instructionsEl = document.getElementById('game-instructions-text');
    const gameModalOverlay = document.getElementById('game-modal-overlay');
    const modalTag = document.getElementById('modal-tag');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalScoreSummary = document.getElementById('modal-score-summary');
    const summaryFinalScore = document.getElementById('summary-final-score');
    const summaryBestScore = document.getElementById('summary-best-score');
    const startGameBtn = document.getElementById('start-game-btn');
    const resetHighscoresBtn = document.getElementById('reset-highscores-btn');

    const V_WIDTH = 800;
    const V_HEIGHT = 420;

    let activeGame = 'flappy';
    let isPlaying = false;
    let animationFrameId = null;

    let highScores = {
      flappy: parseInt(localStorage.getItem('jaishnav_hs_flappy') || '0', 10),
      runner: parseInt(localStorage.getItem('jaishnav_hs_runner') || '0', 10)
    };

    function updateScoreUI(current, high) {
      if (currentScoreEl) currentScoreEl.textContent = current;
      if (highScoreEl) highScoreEl.textContent = high;
    }

    /* --- GAME 1: CYBER DRONE (FLAPPY CLONE) --- */
    const flappyGame = {
      drone: { x: 140, y: 200, width: 34, height: 22, vy: 0, gravity: 0.36, jump: -7.2, tilt: 0 },
      pipes: [],
      particles: [],
      frameCounter: 0,
      score: 0,
      speed: 2.8,

      init() {
        this.drone.y = 190;
        this.drone.vy = 0;
        this.drone.tilt = 0;
        this.pipes = [];
        this.particles = [];
        this.frameCounter = 0;
        this.score = 0;
        this.speed = 2.8;
      },

      flap() {
        this.drone.vy = this.drone.jump;
        sfx.playJump();
        for (let i = 0; i < 5; i++) {
          this.particles.push({
            x: this.drone.x - 10,
            y: this.drone.y + (Math.random() - 0.5) * 6,
            vx: -Math.random() * 3 - 1.5,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 2.5 + 1.5,
            color: '#38bdf8',
            life: 18
          });
        }
      },

      update() {
        this.drone.vy += this.drone.gravity;
        this.drone.y += this.drone.vy;
        this.drone.tilt = Math.min(Math.max(this.drone.vy * 3, -25), 45);

        if (this.drone.y < 0) {
          this.drone.y = 0;
          this.drone.vy = 0;
        }
        if (this.drone.y + this.drone.height / 2 >= V_HEIGHT - 20) {
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
            width: 46,
            top: topH,
            bottom: topH + gap,
            passed: false
          });
        }

        for (let i = this.pipes.length - 1; i >= 0; i--) {
          const p = this.pipes[i];
          p.x -= this.speed;

          const dx = this.drone.x - this.drone.width / 2 + 4;
          const dy = this.drone.y - this.drone.height / 2 + 4;
          const dw = this.drone.width - 8;
          const dh = this.drone.height - 8;

          if (dx + dw > p.x && dx < p.x + p.width && dy < p.top) return true;
          if (dx + dw > p.x && dx < p.x + p.width && dy + dh > p.bottom) return true;

          if (!p.passed && p.x + p.width < this.drone.x) {
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

        // Subtle background grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        for (let x = 0; x < V_WIDTH; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, V_HEIGHT);
          ctx.stroke();
        }

        // Ground
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, V_HEIGHT - 20, V_WIDTH, 20);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, V_HEIGHT - 20);
        ctx.lineTo(V_WIDTH, V_HEIGHT - 20);
        ctx.stroke();

        // Obstacles (Clean pillars)
        for (const p of this.pipes) {
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(p.x, 0, p.width, p.top);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(p.x, 0, p.width, p.top);

          const botH = V_HEIGHT - 20 - p.bottom;
          ctx.fillRect(p.x, p.bottom, p.width, botH);
          ctx.strokeRect(p.x, p.bottom, p.width, botH);

          // Subtle glowing accent
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

        // Drone
        ctx.save();
        ctx.translate(this.drone.x, this.drone.y);
        ctx.rotate((this.drone.tilt * Math.PI) / 180);

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(16, 0);
        ctx.lineTo(-12, -10);
        ctx.lineTo(-6, 0);
        ctx.lineTo(-12, 10);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(2, 0, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    };

    /* --- GAME 2: CYBER RUNNER (T-REX CLONE) --- */
    const runnerGame = {
      player: {
        x: 100,
        y: 0,
        baseY: V_HEIGHT - 28 - 44,
        width: 30,
        height: 44,
        vy: 0,
        gravity: 0.6,
        jump: -12.2,
        isJumping: false,
        legCycle: 0
      },
      obstacles: [],
      particles: [],
      groundOffset: 0,
      score: 0,
      speed: 5.4,
      spawnTimer: 0,
      nextSpawnIn: 85,

      init() {
        this.player.y = this.player.baseY;
        this.player.vy = 0;
        this.player.isJumping = false;
        this.player.legCycle = 0;
        this.obstacles = [];
        this.particles = [];
        this.groundOffset = 0;
        this.score = 0;
        this.speed = 5.4;
        this.spawnTimer = 0;
        this.nextSpawnIn = 80;
      },

      jump() {
        if (!this.player.isJumping) {
          this.player.vy = this.player.jump;
          this.player.isJumping = true;
          sfx.playJump();

          for (let i = 0; i < 4; i++) {
            this.particles.push({
              x: this.player.x + 8,
              y: this.player.baseY + this.player.height,
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
        this.player.vy += this.player.gravity;
        this.player.y += this.player.vy;

        if (this.player.y >= this.player.baseY) {
          this.player.y = this.player.baseY;
          this.player.vy = 0;
          this.player.isJumping = false;
        }

        if (!this.player.isJumping) {
          this.player.legCycle += 0.25;
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
          const obsH = isTall ? 42 : 28;

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

          const px = this.player.x + 4;
          const py = this.player.y + 4;
          const pw = this.player.width - 8;
          const ph = this.player.height - 8;

          if (
            px < obs.x + obs.width &&
            px + pw > obs.x &&
            py < obs.y + obs.height &&
            py + ph > obs.y
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

        // Obstacles
        for (const obs of this.obstacles) {
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

          ctx.strokeStyle = obs.isTall ? '#f43f5e' : '#f59e0b';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
        }

        // Particles
        for (const pt of this.particles) {
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = pt.life / 14;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Player
        const p = this.player;
        ctx.save();
        ctx.translate(p.x, p.y);

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(5, 10, 18, 20);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(5, 10, 18, 20);

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(7, 0, 14, 10);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(13, 3, 7, 3);

        const legSwing = Math.sin(p.legCycle) * 8;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        ctx.moveTo(9, 30);
        ctx.lineTo(9 - legSwing, 44);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(19, 30);
        ctx.lineTo(19 + legSwing, 44);
        ctx.stroke();

        ctx.restore();
      }
    };

    /* --- GAME COORDINATION --- */
    function switchGame(type) {
      activeGame = type;
      isPlaying = false;
      cancelAnimationFrame(animationFrameId);

      if (type === 'flappy') {
        tabFlappy.classList.add('active');
        tabRunner.classList.remove('active');
        if (instructionsEl) instructionsEl.textContent = 'Press Spacebar or Click/Tap canvas to keep drone airborne. Avoid laser gates!';
        modalTag.textContent = 'Ready to Play';
        modalTitle.textContent = 'Cyber Drone';
        modalDesc.textContent = 'Navigate through electric laser gates. Tap or press Space to keep flying!';
        updateScoreUI(0, highScores.flappy);
        flappyGame.init();
        flappyGame.draw();
      } else {
        tabRunner.classList.add('active');
        tabFlappy.classList.remove('active');
        if (instructionsEl) instructionsEl.textContent = 'Press Spacebar, Up Arrow, or Click/Tap canvas to jump over obstacles!';
        modalTag.textContent = 'Ready to Play';
        modalTitle.textContent = 'Cyber Runner';
        modalDesc.textContent = 'Run across the cyber grid and leap over hazardous obstacles.';
        updateScoreUI(0, highScores.runner);
        runnerGame.init();
        runnerGame.draw();
      }

      modalScoreSummary.style.display = 'none';
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
      } else {
        runnerGame.init();
        updateScoreUI(0, highScores.runner);
      }

      gameLoop();
    }

    function handleGameOver(finalScore) {
      isPlaying = false;
      cancelAnimationFrame(animationFrameId);
      sfx.playCrash();

      const key = activeGame === 'flappy' ? 'flappy' : 'runner';
      const storageKey = activeGame === 'flappy' ? 'jaishnav_hs_flappy' : 'jaishnav_hs_runner';

      if (finalScore > highScores[key]) {
        highScores[key] = finalScore;
        localStorage.setItem(storageKey, finalScore.toString());
      }

      updateScoreUI(finalScore, highScores[key]);

      modalTag.textContent = 'Game Over';
      modalTitle.textContent = 'Nice Try!';
      modalDesc.textContent = 'You collided with an obstacle. Ready for another run?';
      summaryFinalScore.textContent = finalScore;
      summaryBestScore.textContent = highScores[key];
      modalScoreSummary.style.display = 'flex';
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
      } else {
        crashed = runnerGame.update();
        runnerGame.draw();
        if (crashed) {
          handleGameOver(Math.floor(runnerGame.score));
          return;
        }
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    }

    function triggerAction() {
      if (!isPlaying) return;
      if (activeGame === 'flappy') flappyGame.flap();
      else runnerGame.jump();
    }

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (isPlaying) {
          e.preventDefault();
          triggerAction();
        }
      }
    });

    canvas.addEventListener('mousedown', (e) => {
      e.preventDefault();
      triggerAction();
    });

    canvas.addEventListener('touchstart', (e) => {
      if (isPlaying) {
        e.preventDefault();
        triggerAction();
      }
    }, { passive: false });

    tabFlappy.addEventListener('click', () => switchGame('flappy'));
    tabRunner.addEventListener('click', () => switchGame('runner'));
    startGameBtn.addEventListener('click', startGame);

    if (resetHighscoresBtn) {
      resetHighscoresBtn.addEventListener('click', () => {
        highScores.flappy = 0;
        highScores.runner = 0;
        localStorage.removeItem('jaishnav_hs_flappy');
        localStorage.removeItem('jaishnav_hs_runner');
        updateScoreUI(0, 0);
      });
    }

    switchGame('flappy');
  }

  // Current year in footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();
