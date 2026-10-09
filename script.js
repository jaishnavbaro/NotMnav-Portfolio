/**
 * ============================================================================
 * NOTNAV PORTFOLIO // CORE SCRIPT
 * High-Tech Gaming UI, Web Audio Synthesizer, & Built-in Arcade Suite
 * ============================================================================
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
   * 1. AUDIO SYNTHESIZER (WEB AUDIO API)
   * Client-side sound engine - zero external audio dependencies
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
      const saved = localStorage.getItem('notnav_sfx_enabled');
      if (saved !== null) {
        this.enabled = saved === 'true';
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem('notnav_sfx_enabled', this.enabled);
      return this.enabled;
    }

    playTone(freq, type = 'sine', duration = 0.08, startVol = 0.15, endVol = 0.001) {
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
      } catch (e) {
        // Audio error handling
      }
    }

    playHover() {
      this.playTone(880, 'sine', 0.04, 0.05);
    }

    playClick() {
      this.playTone(520, 'square', 0.06, 0.08);
    }

    playJump() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(700, this.ctx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
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
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.08); // A5

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(now + 0.22);
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
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.25);

        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
      } catch (e) {}
    }
  }

  const sfx = new SoundEngine();

  /* --------------------------------------------------------------------------
   * 2. CUSTOM CURSOR & HOVER SFX
   * -------------------------------------------------------------------------- */
  const customCursor = document.getElementById('custom-cursor');

  if (customCursor) {
    window.addEventListener('mousemove', (e) => {
      customCursor.style.left = `${e.clientX}px`;
      customCursor.style.top = `${e.clientY}px`;
    });

    const interactiveSelectors = 'a, button, input, .skill-card, .game-card, .tree-node, .arcade-tab-btn';
    document.querySelectorAll(interactiveSelectors).forEach((el) => {
      el.addEventListener('mouseenter', () => {
        customCursor.classList.add('active');
        sfx.playHover();
      });
      el.addEventListener('mouseleave', () => {
        customCursor.classList.remove('active');
      });
      el.addEventListener('click', () => {
        sfx.playClick();
      });
    });
  }

  /* --------------------------------------------------------------------------
   * 3. AMBIENT BACKGROUND PARTICLES CANVAS
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
    const count = Math.min(width > 768 ? 40 : 18, 50);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.1,
        color: Math.random() > 0.5 ? '#00f0ff' : '#00ff9d'
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

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 110) {
            ctx.strokeStyle = '#00f0ff';
            ctx.globalAlpha = (1 - dist / 110) * 0.08;
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
   * 4. HUD TELEMETRY, FPS COUNTER & NAVIGATION
   * -------------------------------------------------------------------------- */
  const fpsCounter = document.getElementById('hud-fps-counter');
  let frameCount = 0;
  let lastFpsTime = performance.now();

  function updateFps(now) {
    frameCount++;
    if (now - lastFpsTime >= 1000) {
      if (fpsCounter) {
        fpsCounter.textContent = Math.round((frameCount * 1000) / (now - lastFpsTime));
      }
      frameCount = 0;
      lastFpsTime = now;
    }
    requestAnimationFrame(updateFps);
  }
  requestAnimationFrame(updateFps);

  // SFX Header Toggle Button
  const sfxToggleBtn = document.getElementById('sfx-toggle');
  const sfxIcon = document.getElementById('sfx-icon');

  function updateSfxButtonUI() {
    if (!sfxToggleBtn || !sfxIcon) return;
    if (sfx.enabled) {
      sfxIcon.className = 'fa-solid fa-volume-high';
      sfxToggleBtn.style.borderColor = 'rgba(0, 240, 255, 0.4)';
    } else {
      sfxIcon.className = 'fa-solid fa-volume-xmark';
      sfxToggleBtn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    }
  }
  updateSfxButtonUI();

  if (sfxToggleBtn) {
    sfxToggleBtn.addEventListener('click', () => {
      const isEnabled = sfx.toggle();
      updateSfxButtonUI();
      showToast(
        isEnabled ? 'AUDIO TRANSMISSION ON' : 'AUDIO TRANSMISSION OFF',
        isEnabled ? 'Synthesized sound effects enabled.' : 'Sound effects muted.'
      );
    });
  }

  // Mobile Navigation Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const hudNav = document.getElementById('hud-nav');

  if (mobileMenuBtn && hudNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = hudNav.classList.toggle('mobile-open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    });

    // Close on nav link click
    hudNav.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        hudNav.classList.remove('mobile-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }

  // Active Section ScrollSpy
  const sections = document.querySelectorAll('.hud-section');
  const navLinks = document.querySelectorAll('.nav-link');

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

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  /* --------------------------------------------------------------------------
   * 5. LEARNING PROGRESS SECTION (ANIMATED GAME LOADING SCREEN)
   * -------------------------------------------------------------------------- */
  const pythonBar = document.getElementById('python-bar');
  const aimlBar = document.getElementById('aiml-bar');
  const discordBar = document.getElementById('discord-bar');

  const pythonCounter = document.getElementById('python-counter');
  const aimlCounter = document.getElementById('aiml-counter');
  const discordCounter = document.getElementById('discord-counter');

  const simulateStreamBtn = document.getElementById('simulate-stream-btn');
  const tipText = document.getElementById('loading-tip-text');
  const consoleStream = document.getElementById('loading-console-stream');

  const tipsArray = [
    '"Class 9 is the prime launchpad. Master the fundamentals of syntax before optimizing performance."',
    '"Tactical gaming develops spatial awareness; coding transforms logic into reality."',
    '"Never commit secret Discord Bot tokens to public repositories. Always use environment variables."',
    '"CSS Grid and Flexbox are like team compositions in Call of Duty—strategic placement wins the battle."',
    '"Python data structures form the backbone of modern machine learning pipelines."'
  ];

  function animateCounter(element, targetVal, duration = 1200) {
    if (!element) return;
    const startVal = 0;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startVal + (targetVal - startVal) * ease);
      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = targetVal;
      }
    }
    requestAnimationFrame(step);
  }

  function runLoadingSimulation() {
    // Reset widths
    if (pythonBar) pythonBar.style.width = '0%';
    if (aimlBar) aimlBar.style.width = '0%';
    if (discordBar) discordBar.style.width = '0%';

    if (pythonCounter) pythonCounter.textContent = '0';
    if (aimlCounter) aimlCounter.textContent = '0';
    if (discordCounter) discordCounter.textContent = '0';

    // Pick random tip
    if (tipText) {
      const randomTip = tipsArray[Math.floor(Math.random() * tipsArray.length)];
      tipText.textContent = randomTip;
    }

    if (consoleStream) {
      consoleStream.innerHTML = `
        <p class="log-line text-neon-cyan">> Handshaking system compiler with Assam, IN cluster...</p>
        <p class="log-line">> Allocating 16 GB DDR4 buffers on Ryzen 5 7530U...</p>
      `;
    }

    setTimeout(() => {
      if (pythonBar) pythonBar.style.width = '25%';
      if (pythonCounter) animateCounter(pythonCounter, 25, 900);

      if (aimlBar) aimlBar.style.width = '0%';
      if (aimlCounter) animateCounter(aimlCounter, 0, 400);

      if (discordBar) discordBar.style.width = '50%';
      if (discordCounter) animateCounter(discordCounter, 50, 1100);

      if (consoleStream) {
        consoleStream.innerHTML += `
          <p class="log-line text-neon-green">> Python module loaded to 25% (Core Loops & Logic OK)</p>
          <p class="log-line text-neon-yellow">> AI/ML neural weights initialized in queue (0%)</p>
          <p class="log-line text-neon-green">> Discord Bot Gateway synced to 50% (Slash Commands active)</p>
          <p class="log-line">> Status: Upgrade tree steady and compiling.</p>
        `;
      }
      sfx.playScore();
    }, 400);
  }

  if (simulateStreamBtn) {
    simulateStreamBtn.addEventListener('click', () => {
      runLoadingSimulation();
      showToast('RE-SYNC INITIATED', 'Compiling learning progress data stream.');
    });
  }

  /* --------------------------------------------------------------------------
   * 6. SIMULATED LIVE HARDWARE TELEMETRY METERS
   * -------------------------------------------------------------------------- */
  const gaugeCpu = document.getElementById('gauge-cpu');
  const gaugeRam = document.getElementById('gauge-ram');
  const gaugeTemp = document.getElementById('gauge-temp');

  function fluctuateGauges() {
    if (gaugeCpu) {
      const cpu = Math.floor(14 + Math.random() * 12);
      gaugeCpu.textContent = `${cpu}%`;
    }
    if (gaugeRam) {
      const ram = (5.8 + Math.random() * 0.9).toFixed(1);
      gaugeRam.textContent = `${ram} / 16 GB`;
    }
    if (gaugeTemp) {
      const temp = Math.floor(44 + Math.random() * 4);
      gaugeTemp.innerHTML = `${temp}&deg;C`;
    }
  }
  setInterval(fluctuateGauges, 3000);

  /* --------------------------------------------------------------------------
   * 7. PROJECT NOTIFICATION MODAL / TOAST
   * -------------------------------------------------------------------------- */
  const notifyProjectBtn = document.getElementById('notify-project-btn');
  const hudToast = document.getElementById('hud-toast');
  const toastTitle = document.getElementById('toast-title');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer = null;

  function showToast(title, msg) {
    if (!hudToast) return;
    if (toastTitle) toastTitle.textContent = title;
    if (toastMessage) toastMessage.textContent = msg;

    hudToast.classList.add('active');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      hudToast.classList.remove('active');
    }, 3800);
  }

  if (notifyProjectBtn) {
    notifyProjectBtn.addEventListener('click', () => {
      sfx.playClick();
      showToast(
        'BRIEFING REQUESTED',
        'Direct email draft queued for notmnav@gmail.com!'
      );
      setTimeout(() => {
        window.location.href = 'mailto:notmnav@gmail.com?subject=Project%20Inquiry%20from%20Portfolio';
      }, 1200);
    });
  }

  /* --------------------------------------------------------------------------
   * 8. PLAYABLE ARCADE HUB (HTML5 CANVAS MINI-GAMES)
   * Built-in Games:
   * Game 1: Cyber Drone (Flappy Bird Clone)
   * Game 2: Cyber Runner (Offline T-Rex Runner Clone)
   * -------------------------------------------------------------------------- */
  const canvas = document.getElementById('game-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');

    // UI Elements
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
    const fullscreenGameBtn = document.getElementById('fullscreen-game-btn');
    const touchJumpOverlay = document.getElementById('touch-jump-overlay');

    // Canvas internal fixed logical resolution
    const V_WIDTH = 800;
    const V_HEIGHT = 420;

    let activeGame = 'flappy'; // 'flappy' | 'runner'
    let isPlaying = false;
    let animationFrameId = null;

    // High scores
    let highScores = {
      flappy: parseInt(localStorage.getItem('notnav_hs_flappy') || '0', 10),
      runner: parseInt(localStorage.getItem('notnav_hs_runner') || '0', 10)
    };

    function updateScoreUI(current, high) {
      if (currentScoreEl) currentScoreEl.textContent = current;
      if (highScoreEl) highScoreEl.textContent = high;
    }

    /* ------------------------------------------------------------------------
     * GAME 1 ENGINE: CYBER DRONE (FLAPPY BIRD CLONE)
     * ------------------------------------------------------------------------ */
    const flappyGame = {
      drone: {
        x: 140,
        y: 200,
        width: 38,
        height: 24,
        vy: 0,
        gravity: 0.38,
        jump: -7.5,
        tilt: 0
      },
      pipes: [],
      particles: [],
      pipeInterval: 120,
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
        // Thruster sparks
        for (let i = 0; i < 6; i++) {
          this.particles.push({
            x: this.drone.x - 12,
            y: this.drone.y + (Math.random() - 0.5) * 8,
            vx: -Math.random() * 3 - 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 2,
            color: '#00f0ff',
            life: 20
          });
        }
      },

      update() {
        this.drone.vy += this.drone.gravity;
        this.drone.y += this.drone.vy;
        this.drone.tilt = Math.min(Math.max(this.drone.vy * 3, -25), 50);

        // Ceiling and floor boundaries
        if (this.drone.y < 0) {
          this.drone.y = 0;
          this.drone.vy = 0;
        }
        if (this.drone.y + this.drone.height / 2 >= V_HEIGHT - 20) {
          return true; // Crash
        }

        // Spawn Laser Pillars
        this.frameCounter++;
        if (this.frameCounter % this.pipeInterval === 0) {
          const gap = 125;
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

        // Move Pipes & Check Collisions
        for (let i = this.pipes.length - 1; i >= 0; i--) {
          const p = this.pipes[i];
          p.x -= this.speed;

          // Drone collision box
          const dx = this.drone.x - this.drone.width / 2 + 4;
          const dy = this.drone.y - this.drone.height / 2 + 4;
          const dw = this.drone.width - 8;
          const dh = this.drone.height - 8;

          // Check top pillar collision
          if (dx + dw > p.x && dx < p.x + p.width && dy < p.top) {
            return true;
          }
          // Check bottom pillar collision
          if (dx + dw > p.x && dx < p.x + p.width && dy + dh > p.bottom) {
            return true;
          }

          // Pass pipe score
          if (!p.passed && p.x + p.width < this.drone.x) {
            p.passed = true;
            this.score++;
            sfx.playScore();
            updateScoreUI(this.score, Math.max(this.score, highScores.flappy));
          }

          // Remove off-screen pipes
          if (p.x + p.width < 0) {
            this.pipes.splice(i, 1);
          }
        }

        // Update thruster particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
          const pt = this.particles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life--;
          if (pt.life <= 0) {
            this.particles.splice(i, 1);
          }
        }

        return false;
      },

      draw() {
        // Clear background
        ctx.fillStyle = '#060a12';
        ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

        // Futuristic Grid lines in background
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let x = 0; x < V_WIDTH; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, V_HEIGHT);
          ctx.stroke();
        }

        // Draw Ground Line
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, V_HEIGHT - 20, V_WIDTH, 20);
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, V_HEIGHT - 20);
        ctx.lineTo(V_WIDTH, V_HEIGHT - 20);
        ctx.stroke();

        // Draw Laser Pillars
        for (const p of this.pipes) {
          // Top Pillar
          ctx.fillStyle = '#0d1829';
          ctx.fillRect(p.x, 0, p.width, p.top);
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 2;
          ctx.strokeRect(p.x, 0, p.width, p.top);

          // Top Laser Emitter Cap
          ctx.fillStyle = '#00ff9d';
          ctx.fillRect(p.x - 3, p.top - 10, p.width + 6, 10);
          ctx.shadowColor = '#00ff9d';
          ctx.shadowBlur = 10;
          ctx.strokeRect(p.x - 3, p.top - 10, p.width + 6, 10);
          ctx.shadowBlur = 0;

          // Bottom Pillar
          const botH = V_HEIGHT - 20 - p.bottom;
          ctx.fillStyle = '#0d1829';
          ctx.fillRect(p.x, p.bottom, p.width, botH);
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 2;
          ctx.strokeRect(p.x, p.bottom, p.width, botH);

          // Bottom Laser Emitter Cap
          ctx.fillStyle = '#00ff9d';
          ctx.fillRect(p.x - 3, p.bottom, p.width + 6, 10);
          ctx.shadowColor = '#00ff9d';
          ctx.shadowBlur = 10;
          ctx.strokeRect(p.x - 3, p.bottom, p.width + 6, 10);
          ctx.shadowBlur = 0;

          // Electric Laser Beam between emitters (Visual flair)
          ctx.strokeStyle = 'rgba(0, 255, 157, 0.25)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(p.x + p.width / 2, p.top);
          ctx.lineTo(p.x + p.width / 2, p.bottom);
          ctx.stroke();
        }

        // Draw Thruster Particles
        for (const pt of this.particles) {
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = pt.life / 20;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Draw Drone Player
        ctx.save();
        ctx.translate(this.drone.x, this.drone.y);
        ctx.rotate((this.drone.tilt * Math.PI) / 180);

        // Drone Body (Sci-Fi Jet / Stealth Drone)
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(18, 0);
        ctx.lineTo(-14, -12);
        ctx.lineTo(-8, 0);
        ctx.lineTo(-14, 12);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 12;
        ctx.stroke();

        // Cockpit / Eye Light
        ctx.fillStyle = '#00ff9d';
        ctx.beginPath();
        ctx.arc(2, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        ctx.shadowBlur = 0;
      }
    };

    /* ------------------------------------------------------------------------
     * GAME 2 ENGINE: CYBER RUNNER (OFFLINE T-REX CLONE)
     * ------------------------------------------------------------------------ */
    const runnerGame = {
      player: {
        x: 100,
        y: 0,
        baseY: V_HEIGHT - 32 - 46,
        width: 32,
        height: 46,
        vy: 0,
        gravity: 0.62,
        jump: -12.5,
        isJumping: false,
        legCycle: 0
      },
      obstacles: [],
      particles: [],
      groundOffset: 0,
      score: 0,
      speed: 5.5,
      spawnTimer: 0,
      nextSpawnIn: 90,

      init() {
        this.player.y = this.player.baseY;
        this.player.vy = 0;
        this.player.isJumping = false;
        this.player.legCycle = 0;
        this.obstacles = [];
        this.particles = [];
        this.groundOffset = 0;
        this.score = 0;
        this.speed = 5.5;
        this.spawnTimer = 0;
        this.nextSpawnIn = 80;
      },

      jump() {
        if (!this.player.isJumping) {
          this.player.vy = this.player.jump;
          this.player.isJumping = true;
          sfx.playJump();

          // Jump trail particles
          for (let i = 0; i < 5; i++) {
            this.particles.push({
              x: this.player.x + 10,
              y: this.player.baseY + this.player.height,
              vx: -Math.random() * 2 - 1,
              vy: -Math.random() * 2,
              size: Math.random() * 3 + 2,
              color: '#00ff9d',
              life: 15
            });
          }
        }
      },

      update() {
        // Player Physics
        this.player.vy += this.player.gravity;
        this.player.y += this.player.vy;

        if (this.player.y >= this.player.baseY) {
          this.player.y = this.player.baseY;
          this.player.vy = 0;
          this.player.isJumping = false;
        }

        // Leg Cycle Animation
        if (!this.player.isJumping) {
          this.player.legCycle += 0.25;
        }

        // Distance Score
        this.score += 0.15;
        const currentScoreFloor = Math.floor(this.score);
        updateScoreUI(currentScoreFloor, Math.max(currentScoreFloor, highScores.runner));

        // Progressive speed acceleration
        this.speed += 0.0007;

        // Ground parallax
        this.groundOffset = (this.groundOffset + this.speed) % 40;

        // Obstacle Spawner (Cyber Barricade or Drone Barrier)
        this.spawnTimer++;
        if (this.spawnTimer >= this.nextSpawnIn) {
          this.spawnTimer = 0;
          this.nextSpawnIn = Math.floor(Math.random() * 60) + 70;

          const isTall = Math.random() > 0.6;
          const obsW = isTall ? 24 : 32;
          const obsH = isTall ? 45 : 30;

          this.obstacles.push({
            x: V_WIDTH,
            y: V_HEIGHT - 32 - obsH,
            width: obsW,
            height: obsH,
            isTall
          });
        }

        // Update Obstacles & Collision Check
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
          const obs = this.obstacles[i];
          obs.x -= this.speed;

          // Bounding Box Collision
          const px = this.player.x + 6;
          const py = this.player.y + 4;
          const pw = this.player.width - 12;
          const ph = this.player.height - 8;

          if (
            px < obs.x + obs.width &&
            px + pw > obs.x &&
            py < obs.y + obs.height &&
            py + ph > obs.y
          ) {
            return true; // Crash
          }

          // Cleanup off-screen
          if (obs.x + obs.width < 0) {
            this.obstacles.splice(i, 1);
          }
        }

        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
          const pt = this.particles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life--;
          if (pt.life <= 0) {
            this.particles.splice(i, 1);
          }
        }

        return false;
      },

      draw() {
        ctx.fillStyle = '#070b14';
        ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

        // Cyber Skyline / distant grid
        ctx.strokeStyle = 'rgba(0, 255, 157, 0.04)';
        for (let y = 50; y < V_HEIGHT - 32; y += 35) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(V_WIDTH, y);
          ctx.stroke();
        }

        // Ground Platform
        const groundY = V_HEIGHT - 32;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, groundY, V_WIDTH, 32);

        // Ground Neon Rail
        ctx.strokeStyle = '#00ff9d';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00ff9d';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.lineTo(V_WIDTH, groundY);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Ground Hash Marks (Scrolling effect)
        ctx.strokeStyle = 'rgba(0, 255, 157, 0.3)';
        ctx.lineWidth = 1;
        for (let x = -this.groundOffset; x < V_WIDTH; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, groundY + 2);
          ctx.lineTo(x + 15, groundY + 12);
          ctx.stroke();
        }

        // Draw Obstacles (Cyber Spikes & Neon pylons)
        for (const obs of this.obstacles) {
          ctx.fillStyle = '#1e1b4b';
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

          ctx.strokeStyle = obs.isTall ? '#ff3366' : '#ffb703';
          ctx.lineWidth = 2;
          ctx.shadowColor = obs.isTall ? '#ff3366' : '#ffb703';
          ctx.shadowBlur = 10;
          ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);

          // Diagonal Hazard stripes inside obstacle
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(obs.x + 4, obs.y + obs.height - 4);
          ctx.lineTo(obs.x + obs.width - 4, obs.y + 4);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // Draw Particles
        for (const pt of this.particles) {
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = pt.life / 15;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Draw Player (Cyber Runner Robot)
        const p = this.player;
        ctx.save();
        ctx.translate(p.x, p.y);

        // Runner Torso
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(6, 12, 18, 20);
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(6, 12, 18, 20);

        // Runner Cyber Visor Head
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(8, 0, 14, 12);
        ctx.fillStyle = '#00ff9d';
        ctx.fillRect(14, 3, 8, 4);

        // Legs Animation
        const legSwing = Math.sin(p.legCycle) * 10;
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 3;

        // Leg 1
        ctx.beginPath();
        ctx.moveTo(10, 32);
        ctx.lineTo(10 - legSwing, 46);
        ctx.stroke();

        // Leg 2
        ctx.beginPath();
        ctx.moveTo(20, 32);
        ctx.lineTo(20 + legSwing, 46);
        ctx.stroke();

        ctx.restore();
      }
    };

    /* ------------------------------------------------------------------------
     * ARCADE STATE COORDINATOR
     * ------------------------------------------------------------------------ */
    function switchGame(gameType) {
      activeGame = gameType;
      isPlaying = false;
      cancelAnimationFrame(animationFrameId);

      // Tab styling
      if (gameType === 'flappy') {
        tabFlappy.classList.add('active-tab');
        tabRunner.classList.remove('active-tab');
        if (instructionsEl) {
          instructionsEl.textContent = 'Press Spacebar, Up Arrow, or Click/Tap canvas to keep the drone airborne. Don\'t hit laser gates!';
        }
        modalTag.textContent = 'MISSION BRIEFING';
        modalTitle.textContent = 'CYBER DRONE';
        modalDesc.textContent = 'Pilot your cyber drone through high-voltage laser gates. Avoid colliding with walls and electrical barriers!';
        updateScoreUI(0, highScores.flappy);
        flappyGame.init();
        flappyGame.draw();
      } else {
        tabRunner.classList.add('active-tab');
        tabFlappy.classList.remove('active-tab');
        if (instructionsEl) {
          instructionsEl.textContent = 'Press Spacebar, Up Arrow, or Click/Tap canvas to jump over obstacles and laser barricades!';
        }
        modalTag.textContent = 'MISSION BRIEFING';
        modalTitle.textContent = 'CYBER RUNNER';
        modalDesc.textContent = 'Sprint across the cyber grid as a high-speed runner bot. Jump over spikes and hazardous barriers!';
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

      lastLoopTime = performance.now();
      gameLoop();
    }

    function handleGameOver(finalScore) {
      isPlaying = false;
      cancelAnimationFrame(animationFrameId);
      sfx.playCrash();

      const key = activeGame === 'flappy' ? 'flappy' : 'runner';
      const storageKey = activeGame === 'flappy' ? 'notnav_hs_flappy' : 'notnav_hs_runner';

      if (finalScore > highScores[key]) {
        highScores[key] = finalScore;
        localStorage.setItem(storageKey, finalScore.toString());
        showToast('NEW HIGH RECORD SET!', `Score: ${finalScore} achieved in ${activeGame.toUpperCase()}`);
      }

      updateScoreUI(finalScore, highScores[key]);

      modalTag.textContent = 'MISSION TERMINATED';
      modalTitle.textContent = 'GAME OVER';
      modalDesc.textContent = 'Critical collision detected. System diagnostics rebooted.';
      summaryFinalScore.textContent = finalScore;
      summaryBestScore.textContent = highScores[key];
      modalScoreSummary.style.display = 'flex';
      startGameBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> RETRY MISSION';

      gameModalOverlay.classList.remove('hidden');
    }

    let lastLoopTime = 0;
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

    // Input Handlers
    function triggerGameAction() {
      if (!isPlaying) return;
      if (activeGame === 'flappy') {
        flappyGame.flap();
      } else {
        runnerGame.jump();
      }
    }

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        // Prevent default spacebar page scrolling if canvas area is focused or active
        if (document.activeElement === canvas || isPlaying) {
          e.preventDefault();
        }
        if (isPlaying) {
          triggerGameAction();
        }
      }
    });

    canvas.addEventListener('mousedown', (e) => {
      e.preventDefault();
      triggerGameAction();
    });

    if (touchJumpOverlay) {
      touchJumpOverlay.addEventListener('touchstart', (e) => {
        e.preventDefault();
        triggerGameAction();
      });
    }

    canvas.addEventListener('touchstart', (e) => {
      if (isPlaying) {
        e.preventDefault();
        triggerGameAction();
      }
    }, { passive: false });

    // Buttons & Tabs
    tabFlappy.addEventListener('click', () => switchGame('flappy'));
    tabRunner.addEventListener('click', () => switchGame('runner'));
    startGameBtn.addEventListener('click', startGame);

    if (resetHighscoresBtn) {
      resetHighscoresBtn.addEventListener('click', () => {
        highScores.flappy = 0;
        highScores.runner = 0;
        localStorage.removeItem('notnav_hs_flappy');
        localStorage.removeItem('notnav_hs_runner');
        updateScoreUI(0, 0);
        showToast('RECORDS RESET', 'Arcade high scores cleared to 0.');
      });
    }

    if (fullscreenGameBtn) {
      fullscreenGameBtn.addEventListener('click', () => {
        const viewport = document.getElementById('canvas-container');
        if (viewport) {
          if (!document.fullscreenElement) {
            viewport.requestFullscreen().catch(() => {});
          } else {
            document.exitFullscreen().catch(() => {});
          }
        }
      });
    }

    // Initial game screen render
    switchGame('flappy');
  }

  /* --------------------------------------------------------------------------
   * 9. SYSTEM CLI MODAL (EASTER EGG TERMINAL)
   * -------------------------------------------------------------------------- */
  const terminalToggle = document.getElementById('terminal-toggle');
  const cliModal = document.getElementById('cli-modal');
  const cliCloseBtn = document.getElementById('cli-close-btn');
  const cliForm = document.getElementById('cli-form');
  const cliInput = document.getElementById('cli-input');
  const cliOutput = document.getElementById('cli-output');

  function openCLI() {
    if (!cliModal) return;
    cliModal.classList.add('open');
    cliModal.setAttribute('aria-hidden', 'false');
    if (cliInput) cliInput.focus();
    sfx.playClick();
  }

  function closeCLI() {
    if (!cliModal) return;
    cliModal.classList.remove('open');
    cliModal.setAttribute('aria-hidden', 'true');
    sfx.playClick();
  }

  if (terminalToggle) terminalToggle.addEventListener('click', openCLI);
  if (cliCloseBtn) cliCloseBtn.addEventListener('click', closeCLI);

  window.addEventListener('keydown', (e) => {
    if (e.key === '`' || e.key === '~') {
      e.preventDefault();
      if (cliModal && cliModal.classList.contains('open')) {
        closeCLI();
      } else {
        openCLI();
      }
    } else if (e.key === 'Escape' && cliModal && cliModal.classList.contains('open')) {
      closeCLI();
    }
  });

  if (cliForm && cliInput && cliOutput) {
    cliForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = cliInput.value.trim();
      if (!val) return;

      // Echo command
      const echoLine = document.createElement('p');
      echoLine.className = 'cli-line';
      echoLine.innerHTML = `<span class="text-neon-green">notnav@cyber-hud:~$</span> ${val}`;
      cliOutput.appendChild(echoLine);
      cliInput.value = '';

      // Command processing
      const responseLine = document.createElement('div');
      responseLine.className = 'cli-line';
      const cmd = val.toLowerCase();

      switch (cmd) {
        case 'help':
          responseLine.innerHTML = `
            <p>> Available commands:</p>
            <p>  <span class="cmd-highlight">whoami</span>   - Operator identity & bio</p>
            <p>  <span class="cmd-highlight">skills</span>   - List active combat arsenal</p>
            <p>  <span class="cmd-highlight">games</span>    - Show conquered video game titles</p>
            <p>  <span class="cmd-highlight">specs</span>    - Display hardware setup</p>
            <p>  <span class="cmd-highlight">arcade</span>   - Scroll directly to playable mini-games</p>
            <p>  <span class="cmd-highlight">sfx</span>      - Toggle audio synthesizer FX</p>
            <p>  <span class="cmd-highlight">clear</span>    - Clear terminal logs</p>
            <p>  <span class="cmd-highlight">contact</span>  - Comms transmission channels</p>
          `;
          break;
        case 'whoami':
          responseLine.innerHTML = `
            <p class="text-neon-cyan">> OPERATOR: NotNav</p>
            <p>> EDUCATION: Class 9 Student</p>
            <p>> SECTOR: Assam, India</p>
            <p>> SPECIALIZATION: Web Development, Gaming, and GFX Artistry.</p>
          `;
          break;
        case 'skills':
          responseLine.innerHTML = `
            <p class="text-neon-green">> ARSENAL LOADED:</p>
            <p>  - HTML (Semantic structure & Canvas API)</p>
            <p>  - CSS (Dark Cyber HUD, Responsive Grids & Animations)</p>
            <p>  - Java (Object-Oriented Programming & Computational Logic)</p>
            <p>  - GFX Artist (Thumbnails, Banners, Digital Vector Assets)</p>
          `;
          break;
        case 'games':
          responseLine.innerHTML = `
            <p class="text-neon-purple">> 100% COMPLETED CAMPAIGNS:</p>
            <p>  - Call of Duty: Modern Warfare (2019)</p>
            <p>  - Call of Duty: Modern Warfare II (2022)</p>
            <p>  - Call of Duty: Modern Warfare III (2023)</p>
            <p>  - Hogwarts Legacy (Action RPG Main Story)</p>
          `;
          break;
        case 'specs':
          responseLine.innerHTML = `
            <p class="text-neon-cyan">> BATTLE RIG LOADOUT:</p>
            <p>  - Laptop: Lenovo</p>
            <p>  - CPU: AMD Ryzen 5 7530U (6C / 12T)</p>
            <p>  - Memory: 16 GB DDR4 Dual-Channel</p>
            <p>  - GPU: AMD Radeon™ Graphics</p>
            <p>  - Platform: Xbox Console</p>
          `;
          break;
        case 'arcade':
          closeCLI();
          window.location.hash = '#arcade';
          break;
        case 'sfx':
          const newState = sfx.toggle();
          updateSfxButtonUI();
          responseLine.innerHTML = `<p>> SFX Synthesizer state set to: <strong class="text-neon-green">${newState ? 'ENABLED' : 'MUTED'}</strong></p>`;
          break;
        case 'contact':
          responseLine.innerHTML = `
            <p>> Direct Comms: <a href="mailto:notmnav@gmail.com" class="text-neon-cyan">notmnav@gmail.com</a></p>
          `;
          break;
        case 'clear':
          cliOutput.innerHTML = '';
          return;
        default:
          responseLine.innerHTML = `<p class="text-neon-red">> Unknown command: "${val}". Type <span class="cmd-highlight">'help'</span> for instructions.</p>`;
          break;
      }

      cliOutput.appendChild(responseLine);
      cliOutput.scrollTop = cliOutput.scrollHeight;
      sfx.playScore();
    });
  }

  // Update Year in Footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();
