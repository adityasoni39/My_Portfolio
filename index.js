/* =============================================
   ADITYA SONI PORTFOLIO — JAVASCRIPT
   Premium Enhanced Edition
   ============================================= */

import { createClient } from 'https://esm.sh/@insforge/sdk@latest';

const insforge = createClient({
  baseUrl: 'https://r4s69m7b.ap-southeast.insforge.app',
  anonKey: 'anon_e477484020cb5f6036d7fa05715227a98204ee6b293d38ad446f77bf4dde73a2'
});

/* Respect user motion preferences globally */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- Wait for DOM to load ---- */
document.addEventListener('DOMContentLoaded', async () => {
  initCustomCursor();
  initNavbar();
  initHamburger();
  initScrollProgress();
  initThemeToggle();
  initParticles();       // canvas particles (not a GSAP animation)
  initTypingEffect();    // hero typing effect
  initSkillBars();       // fills progress bar widths via IntersectionObserver
  initActiveNavLink();   // active pill indicator
  initBackToTop();       // back to top button visibility

  /* NOTE: Hero entrance, scroll reveal, count-up, timeline animation,
     and magnetic buttons are all handled by animations.js (GSAP) */

  // Check auth and update nav link (kept for safety)
  const authNavLink = document.getElementById('authNavLink');
  if (authNavLink) {
    const { data: { user } } = await insforge.auth.getCurrentUser();
    if (user) {
      authNavLink.textContent = 'Dashboard';
      authNavLink.href = 'dashboard.html';
    }
  }
});


/* =============================================
   1. CUSTOM CURSOR — ENHANCED MAGNETIC
   ============================================= */
function initCustomCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;
  if (prefersReducedMotion) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  // Smooth RAF-based follower
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Expand cursor on hover
  const interactives = document.querySelectorAll('a, button, input, textarea, .project-card, .stat-card, .tech-icon-card, .detail-item, .timeline-card, .filter-btn');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
      follower.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
      follower.classList.remove('cursor-hover');
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; follower.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; follower.style.opacity = '0.6'; });
}


/* =============================================
   2. NAVBAR — SCROLL EFFECT
   ============================================= */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}


/* =============================================
   3. HAMBURGER MENU (MOBILE)
   ============================================= */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (!hamburger || !navLinks) return;

  // Toggle menu open/close
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });
}


/* =============================================
   4. TYPING EFFECT — ENHANCED
   ============================================= */
function initTypingEffect() {
  const greetEl = document.getElementById('typedGreeting');
  const roleEl  = document.getElementById('typedRole');
  const descEl  = document.getElementById('heroDesc');
  if (!greetEl || !roleEl) return;

  const greeting = "Hi, I'm Aditya";
  const roles = [
    'B.Tech CSE (AI & ML) Student',
    'Developer',
    'AI Enthusiast',
    'Software Developer',
    'Tech Explorer'
  ];
  const description = "A Computer Science student specializing in AI & ML, passionate about programming, web development, artificial intelligence, and building practical technology.";

  // Inject a real caret span (not CSS ::after)
  function setCaret(el, show) {
    let caret = el.parentElement?.querySelector('.type-caret');
    if (!caret) {
      caret = document.createElement('span');
      caret.className = 'type-caret';
      caret.textContent = '|';
      el.insertAdjacentElement('afterend', caret);
    }
    caret.style.display = show ? 'inline' : 'none';
  }

  // Phase 1: Type the greeting
  function typeGreeting(cb) {
    let i = 0;
    setCaret(greetEl, true);
    function tick() {
      const idx = greeting.indexOf('Aditya');
      if (i > idx) {
        greetEl.innerHTML =
          greeting.slice(0, idx) +
          '<span class="highlight">' + greeting.slice(idx, idx + 6) + '</span>' +
          greeting.slice(idx + 6, i);
      } else {
        greetEl.textContent = greeting.slice(0, i);
      }
      i++;
      if (i <= greeting.length) {
        setTimeout(tick, prefersReducedMotion ? 0 : 65);
      } else {
        setTimeout(cb, prefersReducedMotion ? 0 : 300);
      }
    }
    setTimeout(tick, prefersReducedMotion ? 0 : 450);
  }

  // Phase 2: Cycle roles
  function startRoles() {
    setCaret(greetEl, false);
    setCaret(roleEl, true);
    let roleIndex = 0, charIndex = 0, isDeleting = false;

    function typeRole() {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        roleEl.textContent = currentRole.slice(0, charIndex - 1);
        roleEl.classList.remove('role-shimmer-active');
        charIndex--;
      } else {
        roleEl.textContent = currentRole.slice(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? 45 : 85;

      if (!isDeleting && charIndex === currentRole.length) {
        // Apply shimmer when fully typed
        roleEl.classList.add('role-shimmer-active');
        speed = 1800;
        isDeleting = true;
        if (roleIndex === 0 && descEl) {
          setTimeout(() => typeDesc(), 600);
        }
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 300;
      }

      setTimeout(typeRole, prefersReducedMotion ? 0 : speed);
    }
    setTimeout(typeRole, 200);
  }

  // Phase 3: Type description once
  function typeDesc() {
    if (!descEl) return;
    let i = 0;
    function tick() {
      descEl.textContent = description.slice(0, i);
      i++;
      if (i <= description.length) {
        setTimeout(tick, prefersReducedMotion ? 0 : 24);
      }
    }
    tick();
  }

  // ── Kick off sequence ────────────────────────────────────
  typeGreeting(startRoles);
}


/* =============================================
   5. CONTACT FORM SUBMIT HANDLER
   ============================================= */
window.handleFormSubmit = async function() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name) { alert('Please enter your name.'); return; }
  if (!email || !validateEmail(email)) { alert('Please enter a valid email address.'); return; }
  if (!message) { alert('Please enter a message.'); return; }

  const sendBtn = document.getElementById('sendBtn');
  sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
  sendBtn.disabled = true;

  try {
    let aiResponse = null;

    // Call InsForge Edge Function
    try {
      const response = await fetch('https://n9cxde66.function2.insforge.app/handle-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      if (response.ok) {
        const data = await response.json();
        aiResponse = data.ai_response;
      }
    } catch (fnErr) {
      console.warn('Edge Function fallback:', fnErr);
    }

    // Direct Database Backup if edge function was unavailable
    if (!aiResponse) {
      try {
        const { error: dbErr } = await insforge
          .database
          .from('messages')
          .insert([{ name, email, message }]);
        if (dbErr) console.error('Database insert fallback error:', dbErr);
      } catch (e) {
        console.error('Direct database insert exception:', e);
      }
    }

    // Display success feedback
    document.getElementById('contactForm').style.display = 'none';
    const formSuccess = document.getElementById('formSuccess');

    const successH3 = formSuccess.querySelector('h3');
    const successP  = formSuccess.querySelector('p');
    if (successH3) successH3.innerText = 'Message Sent Successfully!';
    if (successP)  successP.innerText  = aiResponse || "Thank you for reaching out! Aditya will get back to you shortly.";

    formSuccess.style.display = 'block';

  } catch (err) {
    console.error(err);
    alert('Sorry, there was an error sending your message. Please check your network and try again.');
    sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    sendBtn.disabled = false;
  }
};

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


/* =============================================
   6. SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  });
});


/* =============================================
   7. SCROLL PROGRESS BAR
   ============================================= */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}


/* =============================================
   8. DARK / LIGHT THEME TOGGLE
   ============================================= */
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  const html = document.documentElement;
  if (!btn) return;

  // Load saved theme or system preference
  const saved = localStorage.getItem('as-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefersDark ? 'dark' : 'light');
  setTheme(initial, false);

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark', true);
  });

  function setTheme(theme, animate) {
    if (animate && !prefersReducedMotion) {
      html.classList.add('theme-transitioning');
      setTimeout(() => html.classList.remove('theme-transitioning'), 600);
    }
    html.setAttribute('data-theme', theme);
    localStorage.setItem('as-theme', theme);
  }
}


/* =============================================
   9. PARTICLE CANVAS
   ============================================= */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas || prefersReducedMotion) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  const COUNT = 45;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function mkParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.45 + 0.1,
      color: Math.random() > 0.5 ? '215,25,32' : '179,13,22'
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(215,25,32,${0.07 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  particles = Array.from({ length: COUNT }, mkParticle);
  draw();
}


/* =============================================
   10. SKILL BARS — ENHANCED WITH COUNTER
   ============================================= */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-bar-fill');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const fill = entry.target;
      const target = parseInt(fill.getAttribute('data-width'), 10);

      requestAnimationFrame(() => { fill.style.width = target + '%'; });

      // Count-up percentage label
      const pctEl = fill.closest('.skill-bar-item')?.querySelector('.skill-percent');
      if (pctEl) {
        countUp(0, target, 1200, v => { pctEl.textContent = v + '%'; });
      }
      observer.unobserve(fill);
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => { fill.style.width = '0'; observer.observe(fill); });
}


/* =============================================
   11. COUNT-UP ANIMATION
   ============================================= */
function countUp(from, to, duration, cb) {
  if (prefersReducedMotion) { cb(to); return; }
  const start = performance.now();
  function frame(now) {
    const p = Math.min((now - start) / duration, 1);
    cb(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}


/* =============================================
   12. ACTIVE NAV LINK ON SCROLL
   ============================================= */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) {
        active.classList.add('active');
        // Slide the active pill indicator
        const pill = document.querySelector('.nav-active-pill');
        if (pill) {
          const rect = active.getBoundingClientRect();
          const parentRect = active.closest('.nav-links')?.getBoundingClientRect();
          if (parentRect) {
            pill.style.left = (rect.left - parentRect.left) + 'px';
            pill.style.width = rect.width + 'px';
          }
        }
      }
    });
  }, { threshold: 0.35, rootMargin: '-60px 0px -60px 0px' });

  sections.forEach(s => observer.observe(s));

  // Create pill element
  const navLinksList = document.querySelector('.nav-links');
  if (navLinksList) {
    const pill = document.createElement('div');
    pill.className = 'nav-active-pill';
    navLinksList.appendChild(pill);
  }
}


/* =============================================
   13. BACK TO TOP BUTTON
   ============================================= */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}
