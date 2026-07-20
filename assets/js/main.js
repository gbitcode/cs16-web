/* ============================================================
   cs16 landing — interactions (jQuery)
   ============================================================ */
(function ($) {
  'use strict';

  /* -- Remember the language the visitor is currently on, so the
        root redirect (/) can send them straight back next time. -- */
  var lang = document.documentElement.lang;
  if (lang) {
    try { localStorage.setItem('cs16_lang', lang); } catch (e) {}
  }
  // Clicking a language link also stores the choice immediately.
  $('[data-set-lang]').on('click', function () {
    try { localStorage.setItem('cs16_lang', $(this).data('set-lang')); } catch (e) {}
  });

  /* -- Accordion: one open at a time (first is open by default). -- */
  $('.acc-head').on('click', function () {
    var $item = $(this).closest('.acc-item');
    var isOpen = $item.hasClass('open');
    $('.acc-item').removeClass('open').find('.acc-head').attr('aria-expanded', 'false');
    if (!isOpen) {
      $item.addClass('open');
      $(this).attr('aria-expanded', 'true');
    }
  });

  /* -- Download tracking -> Google Analytics event. -----------------
        Fires for real links and for the "coming soon" placeholder,
        so you can see demand before the files are even uploaded. -- */
  $('[data-download]').on('click', function (e) {
    var $btn = $(this);
    var platform = $btn.data('download');
    var soon = $btn.hasClass('is-soon');

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'download', {
        platform: platform,           // "windows" | "macos"
        state: soon ? 'coming_soon' : 'available',
        lang: document.documentElement.lang
      });
    }

    // Placeholder buttons must not jump the page to "#".
    if (soon) { e.preventDefault(); }
  });

  /* -- Screenshots: click to enlarge in a lightbox. ------------------ */
  var $lb = $('#lightbox');
  if ($lb.length) {
    var $lbImg = $lb.find('img');
    $('.shots').on('click', 'img', function () {
      $lbImg.attr('src', this.currentSrc || this.src).attr('alt', this.alt || '');
      $lb.addClass('open').attr('aria-hidden', 'false');
    });
    function closeLightbox() {
      $lb.removeClass('open').attr('aria-hidden', 'true');
      $lbImg.attr('src', '');
    }
    // Close on backdrop, on the image itself, or on the ✕ button.
    $lb.on('click', function (e) {
      if (e.target === this || $(e.target).is('img, .lightbox-close')) closeLightbox();
    });
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape' && $lb.hasClass('open')) closeLightbox();
    });
  }

})(jQuery);
