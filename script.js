tailwind.config = {
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0A0F1E', 800: '#0D1426', 700: '#111B33', 600: '#162040', 500: '#1E2A4A' },
        cyan: { DEFAULT: '#00E5FF', 400: '#33ECFF', 300: '#66F0FF' },
        slate: { DEFAULT: '#8892A4', 400: '#A0ACBC', 300: '#B8C2D0' },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    }
  }
}

let booted = false;

function boot() {
  if (booted) return;
  booted = true;

  const splash = document.getElementById('loader-splash');
  const skeleton = document.getElementById('skeleton-screen');
  const main = document.getElementById('main-content');

  if (splash) splash.classList.add('hidden');
  if (skeleton) skeleton.style.display = 'none';
  if (main) main.style.opacity = '1';
  document.body.classList.remove('loading');

  initAll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

// Fallback: never stay stuck if external assets block the page
setTimeout(boot, 3000);

function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 55; i++) {
    particles.push({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.5 + 0.1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,229,255,${p.a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

function initTypewriter() {
  const phrases = [
    'Frontend Developer',
    'Flutter & Dart Developer',
    'Laravel Back-End Developer',
    'React & Angular Developer',
    'UI/UX Enthusiast',
    'Always Learning 📚',
  ];
  let pi = 0, ci = 0, deleting = false;
  const el = document.getElementById('typewriter');
  if (!el) return;

  function type() {
    const word = phrases[pi];
    if (!deleting) {
      el.textContent = word.slice(0, ci + 1);
      ci++;
      if (ci === word.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      el.textContent = word.slice(0, ci - 1);
      ci--;
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(type, deleting ? 50 : 80);
  }
  setTimeout(type, 600);
}

function initNavbar() {
  const navbar = document.getElementById('navbar');
  const btn    = document.getElementById('menu-btn');
  const menu   = document.getElementById('mobile-menu');
  let menuOpen = false;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  btn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    menu.style.maxHeight = menuOpen ? '400px' : '0';
    menu.style.opacity   = menuOpen ? '1'    : '0';
    btn.innerHTML = menuOpen
      ? '<i class="fa-solid fa-xmark text-xl" style="color:#8892A4"></i>'
      : '<i class="fa-solid fa-bars text-xl" style="color:#8892A4"></i>';
  });

  window.closeMenu = function() {
    menuOpen = false;
    menu.style.maxHeight = '0';
    menu.style.opacity   = '0';
    btn.innerHTML = '<i class="fa-solid fa-bars text-xl" style="color:#8892A4"></i>';
  };
}

function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const total = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    bar.style.width = (window.scrollY / total * 100) + '%';
  }, { passive: true });
}

function initScrollAnimations() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in, .fade-left, .fade-right').forEach(el => obs.observe(el));

  const staggerObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.stagger-child');
        items.forEach((item, i) => {
          setTimeout(() => item.classList.add('visible'), i * 70);
        });
        staggerObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('#skills-container, .grid').forEach(el => staggerObs.observe(el));
}

function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    links.forEach(l => {
      const active = l.getAttribute('href') === '#' + current;
      l.classList.toggle('active', active);
    });
  }, { passive: true });
}

function initCountUp() {
  const nums = document.querySelectorAll('.stat-number');
  const obs  = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = +e.target.dataset.target;
        let current  = 0;
        const step   = target / 30;
        const timer  = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          e.target.textContent = Math.floor(current) + '+';
        }, 40);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  nums.forEach(n => obs.observe(n));
}

function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-bar');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const level = entry.target.dataset.level;
        entry.target.style.width = level + '%';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  skillBars.forEach(bar => obs.observe(bar));
}

const EMAILJS_PUBLIC_KEY  = 'B2afaPCHJ9Tz8zUpr';
const EMAILJS_SERVICE_ID  = 'service_4min7ud';
const EMAILJS_TEMPLATE_ID = 'template_y6cgr49';

function initEmailJS() {
  if (typeof emailjs !== 'undefined') emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

let toastTimer;
function showToast(msg, type) {
  const t = document.getElementById('toast');
  const icon = type === 'success'
    ? '<i class="fa-solid fa-circle-check"></i>'
    : '<i class="fa-solid fa-circle-exclamation"></i>';
  t.innerHTML = icon + msg;
  t.className = 'show ' + type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.className = ''; }, 4500);
}

window.sendEmail = function() {
  console.log('sendEmail called');
  
  if (typeof emailjs === 'undefined') {
    console.error('EmailJS not loaded');
    showToast('Email service not loaded. Please refresh.', 'error');
    return;
  }

  const name    = document.getElementById('cf-name').value.trim();
  const email   = document.getElementById('cf-email').value.trim();
  const subject = document.getElementById('cf-subject').value.trim();
  const message = document.getElementById('cf-message').value.trim();
  const btn     = document.getElementById('cf-btn');

  console.log('Form data:', { name, email, subject, message });

  if (!name || !email || !subject || !message) {
    showToast('Please fill in all fields.', 'error'); return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Please enter a valid email address.', 'error'); return;
  }

  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

  const templateParams = {
    from_name: name,
    from_email: email,
    subject: subject,
    message: message
  };

  console.log('Sending with params:', templateParams);
  console.log('Service ID:', EMAILJS_SERVICE_ID);
  console.log('Template ID:', EMAILJS_TEMPLATE_ID);

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
  .then(function(response) {
    console.log('SUCCESS!', response.status, response.text);
    showToast("Message sent! I'll reply soon. ✨", 'success');
    ['cf-name','cf-email','cf-subject','cf-message'].forEach(id => document.getElementById(id).value = '');
  })
  .catch(function(error) {
    console.error('FAILED...', error);
    showToast('Something went wrong. Please try again.', 'error');
  })
  .finally(() => {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
  });
};

function initAll() {
  initParticles();
  initTypewriter();
  initNavbar();
  initScrollProgress();
  initScrollAnimations();
  initActiveNav();
  initCountUp();
  initSkillBars();
  initEmailJS();
}
