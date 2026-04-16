// ============================================
// GUEST ENGINE — guestengine.live
// ============================================

// --- Scroll reveal ---
(function() {
  const revealTargets = [
    '.section__eyebrow',
    '.section__title',
    '.section__sub',
    '.card--compare',
    '.feature-card',
    '.host-card',
    '.step',
    '.network-card',
    '.proof-item'
  ];

  // Add reveal class to all targets
  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('reveal');
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger children
        const parent = entry.target.parentElement;
        const siblings = parent ? Array.from(parent.querySelectorAll('.reveal')) : [];
        const siblingIndex = siblings.indexOf(entry.target);
        const delay = siblingIndex >= 0 ? siblingIndex * 80 : 0;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });
})();

// --- Smooth scroll offset for fixed header ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});
