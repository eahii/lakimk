// Navbar scroll state
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => {
    if (window.scrollY > 80) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// Mobile menu
(function () {
  const btn = document.getElementById('navMenuBtn');
  const menu = document.getElementById('navMobile');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => menu.classList.toggle('is-open'));
  document.querySelectorAll('[data-closemob]').forEach(a =>
    a.addEventListener('click', () => menu.classList.remove('is-open'))
  );
})();

// FAQ accordion
(function () {
  const list = document.getElementById('faqList');
  if (!list) return;
  list.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      list.querySelectorAll('.faq-item').forEach(i => i.classList.remove('is-open'));
      if (!isOpen) item.classList.add('is-open');
    });
  });
})();

// Contact form
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const thanks = document.getElementById('formThanks');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (thanks) thanks.style.display = 'block';
    form.querySelectorAll('input[type=text], input[type=email], input[type=tel], textarea')
        .forEach(el => el.value = '');
  });
})();

// Reveal on scroll
(function () {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-revealed'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('is-revealed');
        io.unobserve(en.target);
      }
    });
  }, { rootMargin: '-40px' });
  els.forEach(el => io.observe(el));
})();
