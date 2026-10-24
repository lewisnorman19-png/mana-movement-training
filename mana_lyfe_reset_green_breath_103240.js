
/* =============================================
   MANA MOVEMENT TRAINING
   MANA LYFE — RESET STABILITY FIX
   BUILD 103260

   REPLACES:
   mana_lyfe_reset_green_breath_103240.js

   FIXES
   - Automatically bypass unwanted Step 1
   - Open directly on breathing screen
   - Preserve original 60-second timer
   - One visible green breathing circle
   - Display countdown inside green circle
   - Display inhale / hold / exhale
   - Preserve Continue button
   - No full-modal MutationObserver
   - No repeating refresh timers
   - No changes to Reset storage

   IMPORTANT
   Replaces, not adds to, previous
   103240 / 103250 breathing patches.
   ============================================= */

(() => {
  "use strict";

  const BUILD = "103260";
  const STYLE_ID = "mana-reset-stable-103260";

  if (window.MANA_RESET_STABLE_BUILD === BUILD) {
    return;
  }

  const CSS = `

    /* Original yellow circle hidden */

    #manaV936ResetModal
    .mana-v936-breathe {
      display: none !important;
    }

    /* Green countdown circle */

    #manaV936ResetModal
    #manaV936BreathStart {
      width: 190px !important;
      height: 190px !important;
      min-width: 190px !important;
      min-height: 190px !important;
      max-width: 190px !important;
      max-height: 190px !important;
      aspect-ratio: 1 / 1 !important;

      margin: 22px auto !important;
      padding: 18px !important;

      border: 2px solid #55d98b !important;
      border-radius: 50% !important;

      background: #164b30 !important;
      color: #fff !important;

      display: flex !important;
      flex-direction: column !important;
      justify-content: center !important;
      align-items: center !important;

      gap: 5px !important;

      font-weight: 900 !important;
      font-size: 15px !important;
      text-align: center !important;
      line-height: 1.3 !important;

      box-shadow:
        0 0 0 8px rgba(85,217,139,.07)
        !important;

      opacity: 1 !important;
      transition: none !important;
      animation: none !important;
    }

    #manaV936ResetModal
    #manaV936BreathStart:disabled {
      opacity: 1 !important;
      background: #164b30 !important;
      color: #fff !important;
    }

    #manaV936ResetModal
    .mrs-seconds {
      font-size: 48px;
      font-weight: 950;
      line-height: 1;
      color: #fff;
    }

    #manaV936ResetModal
    .mrs-phase {
      color: #fff;
      font-size: 15px;
      font-weight: 900;
      letter-spacing: .09em;
    }

    #manaV936ResetModal
    .mrs-instruction {
      color: #e2f6e9;
      font-size: 11px;
      font-weight: 500;
      line-height: 1.4;
    }

    #manaV936ResetModal
    .mrs-complete {
      color: #55d98b;
      font-size: 15px;
      font-weight: 900;
    }

  `;

  function installStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS;

    document.head.appendChild(style);
  }

  function modalOpen() {
    return Boolean(
      document.getElementById(
        "manaV936ResetModal"
      )?.classList.contains("open")
    );
  }

  function readyButton() {
    const body = document.getElementById(
      "manaV936Body"
    );

    if (!body) return null;

    return Array.from(
      body.querySelectorAll("button")
    ).find(button =>
      /READY TO RESET/i.test(
        button.textContent
      )
    ) || null;
  }

  /* =====================================
     SKIP UNWANTED INTRODUCTORY PAGE

     Original Reset module handles
     navigation from Step 1 to Step 2.
     ===================================== */

  function skipIntro() {
    if (!modalOpen()) return;

    const ready = readyButton();

    if (ready) {
      ready.click();
    }
  }

  /* =====================================
     GREEN CIRCLE DISPLAY

     Original timer remains authoritative.
     We read its existing countdown.
     ===================================== */

  function getTimer() {
    return document.getElementById(
      "manaV936BreathTime"
    );
  }

  function getButton() {
    return document.getElementById(
      "manaV936BreathStart"
    );
  }

  let currentTimer = null;
  let timerObserver = null;

  function updateCircle() {
    if (!modalOpen()) return;

    const button = getButton();
    const timer = getTimer();

    if (!button || !timer) return;

    const remaining = Math.max(
      0,
      Number(timer.textContent) || 0
    );

    const running = button.disabled;
    const complete = remaining === 0;

    let markup = "";

    if (complete) {
      markup = `
        <span class="mrs-seconds">✓</span>
        <span class="mrs-complete">
          RESET COMPLETE
        </span>
      `;
    } else if (running) {
      const elapsed = 60 - remaining;
      const cycle = elapsed % 12;

      let phase = "INHALE";
      let instruction = "Breathe in gently";

      if (cycle >= 4 && cycle < 6) {
        phase = "HOLD";
        instruction = "Pause comfortably";
      } else if (cycle >= 6) {
        phase = "EXHALE";
        instruction = "Breathe out slowly";
      }

      markup = `
        <span class="mrs-seconds">
          ${remaining}
        </span>
        <span class="mrs-phase">
          ${phase}
        </span>
        <span class="mrs-instruction">
          ${instruction}
        </span>
      `;
    } else {
      markup = `
        <span class="mrs-phase">
          START RESET
        </span>
        <span class="mrs-instruction">
          60 seconds of guided breathing
        </span>
      `;
    }

    if (button.innerHTML.trim() !== markup.trim()) {
      button.innerHTML = markup;
    }
  }

  /* =====================================
     OBSERVE ONLY ORIGINAL TIMER TEXT
     ===================================== */

  function watchTimer() {
    const timer = getTimer();

    if (!timer) {
      timerObserver?.disconnect();
      timerObserver = null;
      currentTimer = null;
      return;
    }

    if (currentTimer === timer) return;

    timerObserver?.disconnect();

    currentTimer = timer;

    timerObserver = new MutationObserver(
      updateCircle
    );

    timerObserver.observe(timer,{
      childList:true,
      characterData:true,
      subtree:true
    });

    updateCircle();
  }

  /* =====================================
     LIGHTWEIGHT NAVIGATION SYNC
     ===================================== */

  let pending = false;

  function sync() {
    if (!modalOpen()) {
      watchTimer();
      return;
    }

    skipIntro();
    watchTimer();
    updateCircle();
  }

  function scheduleSync() {
    if (pending) return;

    pending = true;

    requestAnimationFrame(() => {
      pending = false;
      sync();
    });
  }

  function afterResetAction() {
    scheduleSync();

    /* One fallback for older delayed
       Reset rendering. */

    setTimeout(scheduleSync,100);
  }

  function init() {
    installStyles();

    /* Wrap public Reset entry point so
       every new reset skips the intro. */

    const originalOpen =
      window.openManaLifeReset;

    if (typeof originalOpen === "function") {
      window.openManaLifeReset = function(...args) {
        const result = originalOpen.apply(
          this,args
        );

        afterResetAction();
        return result;
      };
    }

    document.addEventListener(
      "click",
      event => {
        if (!(event.target instanceof Element)) {
          return;
        }

        const target = event.target.closest(
          [
            "#ml140OpenReset",
            "#manaV936Open",
            "#manaV936BreathStart",
            "#manaV936Next"
          ].join(",")
        );

        if (target) {
          afterResetAction();
        }
      }
    );

    window.addEventListener(
      "pageshow",scheduleSync
    );

    scheduleSync();

    window.MANA_RESET_STABLE_BUILD = BUILD;

    console.log(
      "MANA RESET STABILITY",
      BUILD
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {once:true}
    );
  } else {
    init();
  }

})();
