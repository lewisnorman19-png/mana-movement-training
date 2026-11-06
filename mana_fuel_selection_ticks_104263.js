
/* MANA MOVEMENT — FUEL SELECTION TICKS 104263
   Complete standalone file. Use with Fuel Design 104262.
   Show orange ticks only for categories containing logged meals.
   No meal data writes, no calculation or image changes.
*/
(() => {
  'use strict';

  if (window.MANA_FUEL_SELECTION_TICKS_104263) return;
  window.MANA_FUEL_SELECTION_TICKS_104263 = true;

  const ROOT = 'manaV1015Fuel';
  const STYLE = 'mana-fuel-selected-ticks-style-104263';
  const STORAGE = 'mana-fuel-v571';

  let queued = false;

  function installStyle() {
    if (document.getElementById(STYLE)) return;

    const sheet = document.createElement('style');
    sheet.id = STYLE;

    sheet.textContent = `
      /* Override the unconditional tick from Fuel Design 104262. */

      html body #${ROOT}
        .m1022-category-grid .m1022-category::after {
        content:""!important;
        border:1px solid #697686!important;
        background:#0D0F13!important;
        color:transparent!important;
        -webkit-text-fill-color:transparent!important;
        box-shadow:0 0 0 5px #0D0F13!important;
      }

      html body #${ROOT}
        .m1022-category-grid
        .m1022-category[data-mana-meal-logged="yes"]::after {
        content:"✓"!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        border-color:#FF7927!important;
        background:#0D0F13!important;
      }

      @media(max-width:600px) {
        html body #${ROOT}
          .m1022-category-grid .m1022-category::after {
          box-shadow:0 0 0 3px #0D0F13!important;
        }
      }
    `;

    document.head.appendChild(sheet);
  }

  function localDateKey() {
    const d = new Date();

    return `${d.getFullYear()}-${
      String(d.getMonth()+1).padStart(2,'0')
    }-${
      String(d.getDate()).padStart(2,'0')
    }`;
  }

  function loggedCategories() {
    try {
      const state = JSON.parse(
        localStorage.getItem(STORAGE) || '{}'
      );

      const meals = state?.[localDateKey()]?.meals || {};

      return new Set(
        ['Breakfast','Lunch','Dinner','Snacks'].filter(
          category =>
            Array.isArray(meals[category]) &&
            meals[category].length > 0
        )
      );
    } catch (_) {
      return new Set();
    }
  }

  function update() {
    const root = document.getElementById(ROOT);
    if (!root) return;

    const logged = loggedCategories();

    root.querySelectorAll(
      '.m1022-category[data-m1022-open]'
    ).forEach(card => {

      const category = card.getAttribute(
        'data-m1022-open'
      );

      const state = logged.has(category)
        ? 'yes'
        : 'no';

      if (
        card.getAttribute('data-mana-meal-logged') !== state
      ) {
        card.setAttribute(
          'data-mana-meal-logged',
          state
        );
      }
    });
  }

  function schedule() {
    if (queued) return;

    queued = true;

    requestAnimationFrame(() => {
      queued = false;
      update();
    });
  }

  function init() {
    installStyle();

    const holder = document.getElementById(
      'manaV83Content'
    );

    if (holder) {
      new MutationObserver(schedule).observe(holder, {
        childList:true,
        subtree:true
      });
    }

    document.addEventListener('click', event => {
      if (
        event.target instanceof Element &&
        event.target.closest(
          '.m1022-category,' +
          '.m1022-add,' +
          '.m1022-remove,' +
          '[data-m1022-open]'
        )
      ) {
        requestAnimationFrame(schedule);
      }
    });

    window.addEventListener(
      'mana:fuel-updated',
      schedule
    );

    window.addEventListener('storage', event => {
      if (event.key === STORAGE) {
        schedule();
      }
    });

    schedule();
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      init,
      {once:true}
    );
  } else {
    init();
  }
})();
