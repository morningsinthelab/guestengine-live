/* ============================================
   SHARED HEADER JS — Guest Engine
   Scroll behavior + mobile menu toggle
   ============================================ */
(function () {
  var header = document.getElementById('geHeader');
  var hamburger = document.getElementById('geHamburger');
  var mobileMenu = document.getElementById('geMobileMenu');

  if (!header) return;

  // Scroll: add .scrolled class when past 40px
  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('.ge-header a[href^="#"], .ge-header__mobile-overlay a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        var offset = 80;
        var pos = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }
    });
  });
})();
