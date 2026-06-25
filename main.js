// ── CARROSSEL ──────────────────────────────────────────────
const carousels = {};

function initCarousel(id) {
  const track    = document.getElementById('track-' + id);
  const slides   = track.querySelectorAll('.carousel-slide');
  const dotsWrap = document.getElementById('dots-' + id);
  const total    = slides.length;

  // quantos visíveis depende da largura
  function visibleCount() {
    if (window.innerWidth < 600) return 1;
    if (window.innerWidth < 900) return 2;
    return 3;
  }

  let current = 0;
  let timer   = null;

  // criar dots
  dotsWrap.innerHTML = '';
  const dots = [];
  for (let i = 0; i < total; i++) {
    const d = document.createElement('button');
    d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Slide ' + (i + 1));
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
    dots.push(d);
  }

  function goTo(index) {
    const vis  = visibleCount();
    const max  = total - vis;
    current    = Math.max(0, Math.min(index, max));
    const slideW = track.querySelector('.carousel-slide').offsetWidth;
    const gap    = 24; // 1.5rem em px
    track.style.transform = `translateX(-${current * (slideW + gap)}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1 >= total - visibleCount() + 1 ? 0 : current + 1); }
  function prev() { goTo(current - 1 < 0 ? total - visibleCount() : current - 1); }

  // autoplay
  function startAuto() { timer = setInterval(next, 3000); }
  function stopAuto()  { clearInterval(timer); }

  // pausar ao hover
  const wrap = document.getElementById('carousel-' + id);
  wrap.addEventListener('mouseenter', stopAuto);
  wrap.addEventListener('mouseleave', startAuto);

  // swipe touch
  let touchX = 0;
  wrap.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  wrap.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
  });

  // recalcular no resize
  window.addEventListener('resize', () => goTo(current));

  carousels[id] = { next, prev, goTo };
  startAuto();
}

function moveCarousel(id, dir) {
  if (!carousels[id]) return;
  dir === 1 ? carousels[id].next() : carousels[id].prev();
}

// ── LIGHTBOX ───────────────────────────────────────────────
function openLB(src) {
  document.getElementById('lb-img').src = src;
  document.getElementById('lb').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLB() {
  document.getElementById('lb').classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('lb').addEventListener('click', function(e) { if (e.target === this) closeLB(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });

// clique nas polaroids do carrossel abre lightbox
document.querySelectorAll('.polaroid-c').forEach(p => {
  p.addEventListener('click', () => openLB(p.querySelector('img').src));
});

// fotos da equipe
document.querySelectorAll('.member-photo').forEach(p => {
  p.style.cursor = 'pointer';
  p.addEventListener('click', () => openLB(p.querySelector('img').src));
});

// ── INIT ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCarousel('sk8er');
  initCarousel('fallen');
});
