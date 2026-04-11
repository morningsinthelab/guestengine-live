/**
 * MITL Character Hero Rotation System
 * Randomly selects a hero image from a pool on each page load.
 * Each persona page has 4+ character-based hero variants stored in /assets/heroes/
 * 
 * Naming convention: {persona}-hero-{variant}.jpg
 * Example: authors-hero-a.jpg, authors-hero-b.jpg, authors-hero-c.jpg, authors-hero-d.jpg
 */

(function() {
  'use strict';

  // Hero variant registry — maps page slug to available hero images
  const HERO_VARIANTS = {
    'authors':              ['a', 'b', 'c', 'd'],
    'coaches':              ['a', 'b', 'c', 'd'],
    'founders':             ['a', 'b', 'c', 'd'],
    'realestate':           ['a', 'b', 'c', 'd'],
    'podcasters':           ['a', 'b', 'c', 'd'],
    'consultants':          ['a', 'b', 'c', 'd'],
    'therapists':           ['a', 'b', 'c', 'd'],
    'financial-advisors':   ['a', 'b', 'c', 'd'],
    'attorneys':            ['a', 'b', 'c', 'd'],
    'health-wellness':      ['a', 'b', 'c', 'd'],
    'nonprofit-leaders':    ['a', 'b', 'c', 'd'],
    'corporate-executives': ['a', 'b', 'c', 'd']
  };

  // Detect which persona page we're on from the URL path
  function getPersonaSlug() {
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    return HERO_VARIANTS[path] ? path : null;
  }

  // Pick a random variant, avoiding the last-shown one (stored in sessionStorage)
  function pickVariant(slug, variants) {
    const storageKey = 'hero_last_' + slug;
    const lastShown = sessionStorage.getItem(storageKey);
    
    // Filter out the last-shown variant if we have more than 1
    let pool = variants;
    if (lastShown && variants.length > 1) {
      pool = variants.filter(v => v !== lastShown);
    }
    
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    sessionStorage.setItem(storageKey, chosen);
    return chosen;
  }

  // Apply the hero image
  function setHeroImage(slug, variant) {
    const heroBg = document.querySelector('.hero__bg');
    if (!heroBg) return;

    const imageUrl = '/assets/heroes/' + slug + '-hero-' + variant + '.jpg';
    
    // Preload the image before applying to avoid flash
    const img = new Image();
    img.onload = function() {
      heroBg.style.backgroundImage = 'url("' + imageUrl + '")';
      heroBg.style.backgroundSize = 'cover';
      heroBg.style.backgroundPosition = 'center top';
      heroBg.classList.add('hero__bg--loaded');
    };
    img.onerror = function() {
      // Fallback: keep whatever's already there, or use the default
      console.warn('[Hero Rotation] Failed to load: ' + imageUrl);
    };
    img.src = imageUrl;
  }

  // Remove any existing video hero elements (for podcasters/consultants that had video)
  function removeVideoHero() {
    const video = document.querySelector('.hero__video');
    if (video) video.remove();
    const placeholder = document.querySelector('.hero__placeholder');
    if (placeholder) placeholder.remove();
  }

  // Init
  function init() {
    const slug = getPersonaSlug();
    if (!slug) return;

    const variants = HERO_VARIANTS[slug];
    if (!variants || variants.length === 0) return;

    const chosen = pickVariant(slug, variants);
    
    removeVideoHero();
    setHeroImage(slug, chosen);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
