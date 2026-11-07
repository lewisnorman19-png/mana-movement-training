
/* MANA MOVEMENT — TWO COLOUR TIDY-UPS 104400
   Complete standalone file. Load AFTER Learning Design 104390.
   1. Session Feedback "Tick All Sets": Mana orange, not yellow.
   2. Learning inactive Overview navigation icon: white, not green.
   No changes to stored data, click handlers, workout logic or layout.
*/
(() => {
  'use strict';
  if (window.MANA_STRENGTH_FINAL_TIDY_104400) return;
  window.MANA_STRENGTH_FINAL_TIDY_104400 = true;

  const SHELL = 'manaV83ProgramShell';
  const CONTENT = 'manaV83Content';
  const STYLE = 'manaStrengthFinalTidyCSS104400';
  let pending = false;

  function installCSS() {
    if (document.getElementById(STYLE)) return;
    const style = document.createElement('style');
    style.id = STYLE;
    style.textContent = `
      /* Workout — the exercise-level Tick All Sets button. */
      html body #manaV64Workout .mana-v920-tick-all,
      html body #manaV922Feedback button.mana-tidy-tick-104400,
      html body #manaV64Workout button.mana-tidy-tick-104400 {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        border:1px solid #FF7927!important;
        border-color:#FF7927!important;
        background:#20160F!important;
        background-image:none!important;
        box-shadow:none!important;
        text-shadow:none!important;
      }
      html body #manaV922Feedback button.mana-tidy-tick-104400 svg,
      html body #manaV64Workout button.mana-tidy-tick-104400 svg {
        color:#FF7927!important;
        stroke:#FF7927!important;
      }
      html body #manaV922Feedback button.mana-tidy-tick-104400:focus-visible,
      html body #manaV64Workout button.mana-tidy-tick-104400:focus-visible {
        outline:2px solid #FF7927!important;
        outline-offset:2px;
      }

      /* Learning — the INACTIVE bottom Overview tab only. */
      html body #${SHELL}.open:has(.mana-v9120-root)
      #manaV83Tabs [data-v83-tab='overview']:not(.active) {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        filter:none!important;
      }
      html body #${SHELL}.open:has(.mana-v9120-root)
      #manaV83Tabs [data-v83-tab='overview']:not(.active) img {
        filter:grayscale(1) brightness(0) invert(1)!important;
        opacity:1!important;
      }
      html body #${SHELL}.open:has(.mana-v9120-root)
      #manaV83Tabs [data-v83-tab='overview']:not(.active) svg,
      html body #${SHELL}.open:has(.mana-v9120-root)
      #manaV83Tabs [data-v83-tab='overview']:not(.active) svg * {
        color:#FFFFFF!important;
        stroke:#FFFFFF!important;
        filter:none!important;
      }
    `;
    document.head.appendChild(style);
  }

  function keepTickOrange() {
    const workout = document.getElementById('manaV64Workout');
    if (!workout) return;
    /* Only the button with this exact text inside the feedback area. */
    const feedback = document.getElementById('manaV922Feedback');
    const scopes = feedback ? [feedback] : [workout];
    for (const scope of scopes) {
      scope.querySelectorAll('button').forEach(button => {
        if (!/^\s*✓?\s*TICK ALL SETS\s*$/i.test(button.textContent || '')) return;
        button.classList.add('mana-tidy-tick-104400');
      });
    }
  }

  function keepOverviewWhite() {
    const shell = document.getElementById(SHELL);
    if (!shell?.classList.contains('open')) return;
    if (!shell.querySelector('#manaV83Tabs [data-v83-tab="learn"].active')) return;
    if (!document.querySelector('#' + CONTENT + ' .mana-v9120-root')) return;
    const tab = shell.querySelector('#manaV83Tabs [data-v83-tab="overview"]:not(.active)');
    if (!tab) return;
    /* SVGs sometimes contain inline gold/green fills from previous themes. */
    tab.querySelectorAll('svg [fill],svg [stroke]').forEach(el => {
      const attr = el.getAttribute('fill');
      if (attr && attr !== 'none') el.style.setProperty('fill', '#FFFFFF', 'important');
      if (el.hasAttribute('stroke')) el.style.setProperty('stroke', '#FFFFFF', 'important');
    });
  }

  function maintain() {
    keepTickOrange();
    keepOverviewWhite();
  }
  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      maintain();
    });
  }
  function init() {
    installCSS();
    const shell = document.getElementById(SHELL);
    const workout = document.getElementById('manaV64Workout');
    if (shell) new MutationObserver(schedule).observe(shell, {childList:true,subtree:true});
    if (workout && !shell?.contains(workout)) {
      new MutationObserver(schedule).observe(workout, {childList:true,subtree:true});
    }
    document.addEventListener('click', event => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest('#manaV83Tabs,[class*="tick-all"],#manaV922Feedback')) schedule();
    });
    schedule();
    window.MANA_STRENGTH_FINAL_TIDY_BUILD = '104400';
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, {once:true});
  } else init();
})();
