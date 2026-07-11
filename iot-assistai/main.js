/* =========================================
   IoT AssistAI – Main JavaScript
   ========================================= */

// ── Theme toggle ──────────────────────────────
const THEME_KEY = 'iot-theme';

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeIcon(theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const btn = document.querySelector('.theme-btn');
  if (btn) btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
}

// ── Mobile nav ─────────────────────────────────
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', links.classList.contains('open'));
  });
  // close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
  // close on outside click
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
    }
  });
}

// ── Mark active nav link ───────────────────────
function initActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// ── Tabs ───────────────────────────────────────
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    const buttons = tabGroup.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const container = tabGroup.closest('.tabs-container') || document;
        container.querySelectorAll('.tab-panel').forEach(p => {
          p.classList.toggle('active', p.dataset.panel === target);
        });
      });
    });
  });
}

// ── Fade-in on scroll ──────────────────────────
function initScrollReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '0';
        e.target.style.transform = 'translateY(20px)';
        e.target.style.transition = 'opacity .5s ease, transform .5s ease';
        requestAnimationFrame(() => {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        });
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

// ── Animated counters ──────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1400;
  const step = duration / target;
  let current = 0;
  const timer = setInterval(() => {
    current += Math.ceil(target / 60);
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = current.toLocaleString() + (el.dataset.suffix || '');
  }, step);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCounter(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
}

// ── Toast notification ─────────────────────────
function showToast(msg, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:.5rem;';
    document.body.appendChild(container);
  }
  const colors = { info: '#0f62fe', success: '#24a148', warning: '#f1c21b', danger: '#da1e28' };
  const toast = document.createElement('div');
  toast.style.cssText = `background:var(--bg-card);border:1px solid ${colors[type]};border-left:4px solid ${colors[type]};border-radius:4px;padding:.875rem 1.25rem;box-shadow:var(--shadow-lg);font-size:.9rem;color:var(--text);max-width:340px;animation:fadeInUp .3s ease;`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .3s'; setTimeout(() => toast.remove(), 300); }, duration);
}
window.showToast = showToast;

// ── Smooth number format ───────────────────────
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

// ── Init all ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initActiveNav();
  initTabs();
  initScrollReveal();
  initCounters();

  // Theme button
  const themeBtn = document.querySelector('.theme-btn');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
});
