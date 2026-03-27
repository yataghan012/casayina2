/* ─── CURSOR ─── */
const cDot = document.getElementById('cDot');
const cRing = document.getElementById('cRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cDot.style.left = mx + 'px';
  cDot.style.top  = my + 'px';
});

(function animCursor() {
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  cRing.style.left = rx + 'px';
  cRing.style.top  = ry + 'px';
  requestAnimationFrame(animCursor);
})();

document.querySelectorAll('a,button,.sp-card,.sf-card,.gp-card,.rv-card').forEach(el => {
  el.addEventListener('mouseenter', () => cRing.classList.add('hover'));
  el.addEventListener('mouseleave', () => cRing.classList.remove('hover'));
});

/* ─── LOADER ─── */
const ldrWord = document.getElementById('ldrWord');
'Casa Yina'.split('').forEach((ch, i) => {
  const span = document.createElement('span');
  span.textContent = ch === ' ' ? '\u00A0' : ch;
  span.style.setProperty('--i', i);
  ldrWord.appendChild(span);
});

window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('gone');
  }, 1500);
});

/* ─── NAV ─── */
const navEl = document.getElementById('nav');
window.addEventListener('scroll', () => {
  navEl.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

const ham = document.getElementById('navHam');
const mobNav = document.getElementById('mob-nav');
ham.addEventListener('click', () => {
  const open = ham.classList.toggle('open');
  mobNav.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
document.querySelectorAll('.mob-link').forEach(l => {
  l.addEventListener('click', () => {
    ham.classList.remove('open');
    mobNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─── PAGE ROUTER ─── */
let currentPage = 'home';
const curtainCols = document.querySelectorAll('.curtain-col');

function navigate(page, instant = false) {
  if (page === currentPage) return;

  // Close mobile nav
  ham.classList.remove('open');
  mobNav.classList.remove('open');
  document.body.style.overflow = '';

  if (instant) {
    _showPage(page);
    return;
  }

  // Curtain in
  curtainCols.forEach(c => {
    c.classList.remove('out');
    c.style.removeProperty('transform');
    void c.offsetWidth;
    c.classList.add('in');
  });

  setTimeout(() => {
    _showPage(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
    // Curtain out
    curtainCols.forEach(c => {
      c.classList.remove('in');
      void c.offsetWidth;
      c.classList.add('out');
    });
    setTimeout(() => curtainCols.forEach(c => c.classList.remove('out')), 800);
  }, 650);
}

function _showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) { target.classList.add('active'); }
  currentPage = page;

  // Update nav links
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });

  // Trigger reveals
  setTimeout(() => triggerReveals(), 80);
}

// Nav link clicks
document.querySelectorAll('.nav-link[data-page]').forEach(l => {
  l.addEventListener('click', () => navigate(l.dataset.page));
});

/* ─── SCROLL REVEAL ─── */
function triggerReveals() {
  const activePage = document.getElementById('page-' + currentPage);
  if (!activePage) return;
  const els = activePage.querySelectorAll('[data-reveal]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ─── HERO RIPPLE INTERACTION ─── */
const heroRipple = document.getElementById('heroRipple');
if (heroRipple) {
  heroRipple.parentElement.addEventListener('click', e => {
    const rect = heroRipple.getBoundingClientRect();
    const circle = document.createElement('div');
    circle.className = 'ripple-circle';
    circle.style.cssText = `
      left: ${e.clientX - rect.left}px;
      top: ${e.clientY - rect.top}px;
      width: 60px; height: 60px;
      margin-left: -30px; margin-top: -30px;
    `;
    heroRipple.appendChild(circle);
    setTimeout(() => circle.remove(), 1000);
  });

  // Add floating leaf particles
  function spawnLeaf() {
    const leaf = document.createElement('div');
    const size = 8 + Math.random() * 14;
    const left = Math.random() * 100;
    const dur = 6 + Math.random() * 8;
    const rot = Math.random() * 360;
    const rotEnd = rot + (Math.random() - 0.5) * 180;

    leaf.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size * 1.5}px;
      background: radial-gradient(ellipse at 30% 30%, rgba(122,158,110,.55), rgba(58,92,53,.3));
      border-radius: 50% 0 50% 0;
      left: ${left}%;
      top: -5%;
      opacity: 0;
      pointer-events: none;
      z-index: 2;
      animation: leafDrop ${dur}s ${Math.random() * 3}s linear forwards;
      transform: rotate(${rot}deg);
    `;
    heroRipple.appendChild(leaf);

    const keyframes = `
      @keyframes leafDrop {
        0% { opacity: 0; transform: translate(0, 0) rotate(${rot}deg); }
        10% { opacity: .7; }
        90% { opacity: .4; }
        100% { opacity: 0; transform: translate(${(Math.random()-.5)*120}px, 110vh) rotate(${rotEnd}deg); }
      }
    `;
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);

    setTimeout(() => { leaf.remove(); style.remove(); }, (dur + 3) * 1000);
  }

  setInterval(spawnLeaf, 1400);
  for (let i = 0; i < 5; i++) setTimeout(spawnLeaf, i * 600);
}

/* ─── BOOKING FORM ─── */
const bookForm = document.getElementById('bookForm');
if (bookForm) {
  const dateInput = document.getElementById('bookDate');
  if (dateInput) {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    dateInput.min = t.toISOString().split('T')[0];
  }

  bookForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = bookForm.querySelector('.fsubmit');
    btn.textContent = '✓ Enviando...';
    btn.disabled = true;

    const fd = new FormData(bookForm);
    const nombre = fd.get('nombre') || '';
    const plan = fd.get('plan') || '';
    const fecha = fd.get('fecha') || '';
    const horario = fd.get('horario') || '';
    const personas = fd.get('personas') || '1';
    const contacto = fd.get('contacto') || '';
    const notas = fd.get('notas') || '';

    const msg = encodeURIComponent(
      `¡Hola! Quiero reservar en Casa Yina 🌿\n\n` +
      `👤 Nombre: ${nombre}\n` +
      `✨ Plan: ${plan}\n` +
      `📅 Fecha: ${fecha}\n` +
      `🕐 Horario: ${horario}\n` +
      `👥 Personas: ${personas}\n` +
      `📱 Contacto: ${contacto}\n` +
      (notas ? `💬 Notas: ${notas}` : '')
    );

    setTimeout(() => {
      bookForm.style.display = 'none';
      document.getElementById('bookSuccess').classList.add('show');
      setTimeout(() => window.open(`https://wa.me/+54XXXXXXXXXX?text=${msg}`, '_blank'), 600);
    }, 900);
  });
}

/* ─── PARALLAX HERO ─── */
window.addEventListener('scroll', () => {
  if (currentPage !== 'home') return;
  const scene = document.querySelector('.hero-scene');
  if (scene) scene.style.transform = `translateY(${window.pageYOffset * .28}px)`;
  
  // Banner parallax
  const banner = document.getElementById('parallaxBanner');
  if (banner) {
    const rect = banner.parentElement.getBoundingClientRect();
    const offset = (rect.top + rect.height/2 - window.innerHeight/2) * 0.18;
    banner.style.transform = `translateY(${offset}px)`;
  }
}, { passive: true });

/* ─── INIT ─── */
_showPage('home');
