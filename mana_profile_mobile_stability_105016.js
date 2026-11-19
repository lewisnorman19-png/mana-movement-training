
/* ==========================================================
   MANA MOVEMENT — PROFILE INPUT & MOBILE COACH WIDTH
   BUILD 105016 — COMPLETE ADD-ON FILE

   - Prevents late extended-profile loads from replacing
     first/last name or DOB while they are being edited
   - Keeps height/weight inputs stable during editing
   - Mobile date input alignment
   - Expands mobile Coach Hub content width
   - Does not touch messages, routes, payments or database
   ========================================================== */
(() => {
  'use strict';
  if (window.MANA_PROFILE_MOBILE_105016) return;
  window.MANA_PROFILE_MOBILE_105016 = true;

  const STYLE = 'manaProfileMobileStyle105016';
  const SCREEN = 'manaProfileScreen';
  const FIELDS = new Set([
    'me-first_name','me-last_name','me-dob',
    'manaProfileName','manaProfileHeight',
    'manaProfileWeight','manaProfileAge',
    'me-phone','me-country','me-state','me-city'
  ]);

  let active = null;
  let lastValue = '';
  let editingAt = 0;
  let guardTimer = null;
  let root = null;

  function css() {
    if (document.getElementById(STYLE)) return;
    const node = document.createElement('style');
    node.id = STYLE;
    node.textContent = `
      /* Profile — actual editable fields */
      #${SCREEN} .mana-profile-field,
      #${SCREEN} .me-field,
      #${SCREEN} .mana-paired-fields,
      #${SCREEN} .mana-paired-fields > * {
        min-width:0!important;
        box-sizing:border-box!important;
      }
      #${SCREEN} input[type="text"],
      #${SCREEN} input[type="number"],
      #${SCREEN} input[type="tel"],
      #${SCREEN} input[type="date"],
      #${SCREEN} select {
        min-width:0!important;
        max-width:100%!important;
        box-sizing:border-box!important;
        font-size:16px!important;
        line-height:1.35!important;
        touch-action:manipulation;
      }
      #${SCREEN} #me-dob {
        display:block!important;
        width:100%!important;
        min-width:0!important;
        height:46px!important;
        min-height:46px!important;
        padding:9px 7px!important;
        background:#101215!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        border:1px solid #505862!important;
        border-radius:10px!important;
        text-align:left!important;
        appearance:auto;
        -webkit-appearance:auto;
      }
      #${SCREEN} #manaDobAgeRow104992 > *,
      #${SCREEN} #manaNameRow104992 > * {
        min-width:0!important;
        align-self:stretch!important;
      }
      #${SCREEN} #manaDobAgeRow104992 label,
      #${SCREEN} #manaNameRow104992 label {
        display:block!important;
        min-height:17px!important;
        margin-bottom:7px!important;
        line-height:1.35!important;
      }
      #${SCREEN} input:focus-visible {
        outline:2px solid #FF7927!important;
        outline-offset:1px!important;
      }
      @media(max-width:600px) {
        #${SCREEN} {
          padding-left:10px!important;
          padding-right:10px!important;
        }
        #${SCREEN} .mana-profile-shell {
          width:100%!important;
          max-width:100%!important;
        }
        #${SCREEN} .mana-paired-fields {
          display:grid!important;
          grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;
          column-gap:8px!important;
          align-items:start!important;
        }
        #${SCREEN} #manaDobAgeRow104992 {
          grid-template-columns:minmax(0,1fr) 90px!important;
        }
        #${SCREEN} #me-dob {font-size:16px!important;}
        /* Coach Hub — use phone width, not narrow centred cards */
        #coachView:not(.hide),
        #coachClientDetailView:not(.hide) {
          width:calc(100vw - 12px)!important;
          max-width:calc(100vw - 12px)!important;
          margin-left:calc(50% - 50vw + 6px)!important;
          margin-right:0!important;
          padding-left:3px!important;
          padding-right:3px!important;
          box-sizing:border-box!important;
        }
        #coachHomePage,
        #manaCoachSuite104707,
        #manaCoachSuite104707 [data-mcn-view],
        #manaCoachSettings105010,
        #manaCoachSettingsExtra105013,
        #coachClientDetailView > .card,
        #coachClientDetailView #manaCoachProfile104950 {
          width:100%!important;
          max-width:100%!important;
          min-width:0!important;
          box-sizing:border-box!important;
        }
        #manaCoachSuite104707 .mcn-panel {
          padding:12px!important;
        }
        #coachView .mcn-stats,
        #coachView .mcn-pay-grid {
          min-width:0!important;
        }
      }
    `;
    document.head.appendChild(node);
  }

  // The extended-profile cloud read can resolve after a user
  // has started entering details. Restore ONLY the focused
  // unsaved field; never overwrite other fields or save data.
  function startGuard(input) {
    if (!input || !FIELDS.has(input.id)) return;
    endGuard();
    active = input;
    lastValue = input.value;
    editingAt = Date.now();
    const preserve = () => {
      if (!active || !active.isConnected) {endGuard();return;}
      if (document.activeElement !== active) return;
      if (active.value !== lastValue) {
        active.value = lastValue;
        // This is a display-only restore: no synthetic input
        // event, which could trigger an unexpected rerender.
      }
    };
    guardTimer = setInterval(preserve, 130);
  }
  function endGuard() {
    if (guardTimer) clearInterval(guardTimer);
    guardTimer = null;
    active = null;
  }
  function connect() {
    const screen = document.getElementById(SCREEN);
    if (!screen || root === screen) return;
    root = screen;
    screen.addEventListener('focusin', event => {
      const target = event.target;
      if (target instanceof HTMLInputElement && FIELDS.has(target.id))
        startGuard(target);
    }, true);
    screen.addEventListener('input', event => {
      if (event.target === active) {
        lastValue = active.value;
        editingAt = Date.now();
      }
    }, true);
    screen.addEventListener('change', event => {
      if (event.target === active) lastValue = active.value;
    }, true);
    screen.addEventListener('focusout', event => {
      if (event.target === active) {
        // Keep the last value through a possible late re-layout.
        const old = active;
        const value = lastValue;
        setTimeout(() => {
          if (old.isConnected && old.value !== value &&
              Date.now()-editingAt < 2500) old.value = value;
          if (active === old) endGuard();
        }, 250);
      }
    }, true);
    screen.addEventListener('click', event => {
      if (event.target.closest?.('#manaProfileSave')) endGuard();
    }, true);
  }
  function init() {
    css();
    connect();
    document.addEventListener('click', event => {
      if (event.target.closest?.('[data-open-profile],#manaProfileButton'))
        setTimeout(connect, 0);
    });
    window.addEventListener('pageshow', connect);
    window.MANA_PROFILE_MOBILE_BUILD = '105016';
    console.log('[Mana Movement] Profile mobile 105016 ready');
  }
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
