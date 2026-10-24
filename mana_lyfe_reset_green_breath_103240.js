
/* ================================================
   MANA MOVEMENT TRAINING
   MANA LYFE — ANIMATED GREEN BREATHING CIRCLE

   BUILD 103270

   REPLACES:
   mana_lyfe_reset_green_breath_103240.js

   FEATURES
   - Skip original unwanted introduction
   - Start directly on breathing step
   - One green breathing circle
   - Original 60-second countdown
   - Inhale: expand over 4 seconds
   - Hold: maintain size for 2 seconds
   - Exhale: contract over 6 seconds
   - Countdown and breathing instructions
   - Preserve original Continue button
   - No duplicate timer
   - No full-modal observer
   - No continuous page refresh

   Existing app data remains unchanged.
   ================================================ */

(() => {
  "use strict";

  const BUILD = "103270";

  const STYLE_ID =
    "mana-reset-breathing-animation-103270";

  if (
    window.MANA_RESET_STABLE_BUILD === BUILD
  ) {
    return;
  }

  /* ========================================
     VISUAL DESIGN
     ======================================== */

  const CSS = `

    /* -------------------------------------
       Hide duplicate yellow timer circle
       ------------------------------------- */

    #manaV936ResetModal
    .mana-v936-breathe {

      display: none !important;

    }

    /* -------------------------------------
       Main green breathing circle
       ------------------------------------- */

    #manaV936ResetModal
    #manaV936BreathStart {

      width: 190px !important;
      height: 190px !important;

      min-width: 190px !important;
      min-height: 190px !important;

      max-width: 190px !important;
      max-height: 190px !important;

      aspect-ratio: 1 / 1 !important;

      margin: 30px auto !important;

      padding: 22px !important;

      border: 2px solid #55d98b !important;

      border-radius: 50% !important;

      background: #164b30 !important;

      color: #ffffff !important;

      display: flex !important;

      flex-direction: column !important;

      align-items: center !important;

      justify-content: center !important;

      gap: 6px !important;

      font-size: 15px !important;

      font-weight: 900 !important;

      line-height: 1.2 !important;

      text-align: center !important;

      box-shadow:
        0 0 0 8px rgba(85,217,139,.07)
        !important;

      transform: scale(1);

      transform-origin: center center;

      transition-property: transform !important;

      transition-duration: 0s;

      transition-timing-function: linear;

      animation: none !important;

      will-change: auto;

      cursor: pointer;

    }

    /* -------------------------------------
       Disabled during active timer
       ------------------------------------- */

    #manaV936ResetModal
    #manaV936BreathStart:disabled {

      opacity: 1 !important;

      color: #ffffff !important;

      background: #164b30 !important;

      cursor: default;

    }

    /* =====================================
       BREATHING PHASE ANIMATION
       ===================================== */

    /* INHALE: grow slowly over 4 seconds */

    #manaV936ResetModal
    #manaV936BreathStart.mrs-inhale {

      transform: scale(1.12) !important;

      transition-duration: 4s !important;

      transition-timing-function:
        ease-in-out !important;

    }

    /* HOLD: stay expanded */

    #manaV936ResetModal
    #manaV936BreathStart.mrs-hold {

      transform: scale(1.12) !important;

      transition-duration: 0s !important;

    }

    /* EXHALE: shrink over 6 seconds */

    #manaV936ResetModal
    #manaV936BreathStart.mrs-exhale {

      transform: scale(1) !important;

      transition-duration: 6s !important;

      transition-timing-function:
        ease-in-out !important;

    }

    /* READY AND COMPLETE */

    #manaV936ResetModal
    #manaV936BreathStart.mrs-ready,

    #manaV936ResetModal
    #manaV936BreathStart.mrs-finished {

      transform: scale(1) !important;

      transition-duration: .4s !important;

    }

    /* -------------------------------------
       Seconds
       ------------------------------------- */

    #manaV936ResetModal
    .mrs-seconds {

      display: block;

      color: #ffffff !important;

      font-size: 49px !important;

      font-weight: 950 !important;

      line-height: 1 !important;

      letter-spacing: -.025em;

    }

    /* -------------------------------------
       Phase label
       ------------------------------------- */

    #manaV936ResetModal
    .mrs-phase {

      display: block;

      color: #ffffff !important;

      font-size: 16px !important;

      font-weight: 900 !important;

      letter-spacing: .1em;

    }

    /* -------------------------------------
       Breathing instruction
       ------------------------------------- */

    #manaV936ResetModal
    .mrs-instruction {

      display: block;

      color: #e0f5e8 !important;

      font-size: 11px !important;

      font-weight: 600 !important;

      line-height: 1.45 !important;

      max-width: 140px;

    }

    /* -------------------------------------
       Completed state
       ------------------------------------- */

    #manaV936ResetModal
    .mrs-complete {

      color: #ffffff !important;

      font-size: 14px !important;

      font-weight: 900 !important;

    }

    /* =====================================
       REDUCED MOTION ACCESSIBILITY
       ===================================== */

    @media (prefers-reduced-motion: reduce) {

      #manaV936ResetModal
      #manaV936BreathStart {

        transition: none !important;

        transform: scale(1) !important;

      }

    }

    /* =====================================
       MOBILE PRESENTATION
       ===================================== */

    @media (max-width: 700px) {

      #manaV936ResetModal
      #manaV936BreathStart {

        margin: 26px auto !important;

      }

    }

  `;

  /* ========================================
     STYLE INSTALLATION
     ======================================== */

  function installStyles() {

    if (
      document.getElementById(STYLE_ID)
    ) {
      return;
    }

    const style =
      document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = CSS;

    document.head.appendChild(style);

  }

  /* ========================================
     ELEMENT HELPERS
     ======================================== */

  function modal() {

    return document.getElementById(
      "manaV936ResetModal"
    );

  }

  function modalOpen() {

    return Boolean(
      modal()?.classList.contains("open")
    );

  }

  function timerElement() {

    return document.getElementById(
      "manaV936BreathTime"
    );

  }

  function greenButton() {

    return document.getElementById(
      "manaV936BreathStart"
    );

  }

  /* ========================================
     SKIP ORIGINAL INTRODUCTION

     Use the original Reset module's
     existing step navigation.

     Don't replace its event listeners.
     ======================================== */

  function skipIntro() {

    if (!modalOpen()) return;

    const body = document.getElementById(
      "manaV936Body"
    );

    if (!body) return;

    const ready = Array.from(
      body.querySelectorAll("button")
    ).find(button =>
      /READY TO RESET/i.test(
        button.textContent
      )
    );

    if (ready) {

      ready.click();

    }

  }

  /* ========================================
     BUILD DISPLAY ELEMENTS ONCE

     Avoid replacing the button's
     innerHTML every second.
     ======================================== */

  function ensureDisplay(button) {

    if (!button) return null;

    let seconds = button.querySelector(
      ".mrs-seconds"
    );

    let phase = button.querySelector(
      ".mrs-phase"
    );

    let instruction = button.querySelector(
      ".mrs-instruction"
    );

    if (
      seconds &&
      phase &&
      instruction
    ) {

      return {
        seconds,
        phase,
        instruction
      };

    }

    button.replaceChildren();

    seconds = document.createElement("span");
    seconds.className = "mrs-seconds";

    phase = document.createElement("span");
    phase.className = "mrs-phase";

    instruction = document.createElement("span");
    instruction.className = "mrs-instruction";

    button.append(
      seconds,
      phase,
      instruction
    );

    return {
      seconds,
      phase,
      instruction
    };

  }

  /* ========================================
     TEXT UPDATE HELPER
     ======================================== */

  function setText(element,value) {

    if (
      element &&
      element.textContent !== value
    ) {

      element.textContent = value;

    }

  }

  /* ========================================
     BREATHING PHASE

     One 12-second cycle:

     0–4   INHALE
     4–6   HOLD
     6–12  EXHALE

     Uses the original timer's number.
     ======================================== */

  function phaseFromRemaining(remaining) {

    const elapsed = Math.max(
      0,
      60 - remaining
    );

    const point = elapsed % 12;

    if (point < 4) {

      return {
        name: "INHALE",
        instruction: "Breathe in slowly",
        className: "mrs-inhale"
      };

    }

    if (point < 6) {

      return {
        name: "HOLD",
        instruction: "Pause gently",
        className: "mrs-hold"
      };

    }

    return {
      name: "EXHALE",
      instruction: "Breathe out slowly",
      className: "mrs-exhale"
    };

  }

  /* ========================================
     REFRESH GREEN CIRCLE

     Original 60-second Reset timer
     stays in control.

     Only update text and phase classes.
     ======================================== */

  function updateCircle() {

    if (!modalOpen()) return;

    const button = greenButton();

    const timer = timerElement();

    if (!button || !timer) return;

    const display = ensureDisplay(button);

    if (!display) return;

    const raw = Number(
      timer.textContent
    );

    const remaining =
      Number.isFinite(raw)
        ? Math.max(0,raw)
        : 60;

    const running = button.disabled;

    const completed =
      remaining <= 0;

    let phase;

    if (completed) {

      phase = {
        name: "COMPLETE",
        instruction: "Reset finished",
        className: "mrs-finished"
      };

    } else if (!running) {

      phase = {
        name: "START RESET",
        instruction: "60 seconds of guided breathing",
        className: "mrs-ready"
      };

    } else {

      phase = phaseFromRemaining(
        remaining
      );

    }

    /* Avoid rebuilding the button */

    setText(
      display.seconds,
      completed
        ? "✓"
        : running
          ? String(remaining)
          : ""
    );

    setText(
      display.phase,
      phase.name
    );

    setText(
      display.instruction,
      phase.instruction
    );

    /* Change animation class only when
       the breathing phase changes. */

    if (
      !button.classList.contains(
        phase.className
      )
    ) {

      button.classList.remove(
        "mrs-inhale",
        "mrs-hold",
        "mrs-exhale",
        "mrs-ready",
        "mrs-finished"
      );

      button.classList.add(
        phase.className
      );

    }

  }

  /* ========================================
     OBSERVE ORIGINAL COUNTDOWN ONLY

     No additional interval.

     No global MutationObserver.

     Each timer change updates the
     text and breathing animation.
     ======================================== */

  let observedTimer = null;

  let timerObserver = null;

  function watchTimer() {

    const timer = timerElement();

    if (!timer) {

      timerObserver?.disconnect();

      timerObserver = null;

      observedTimer = null;

      return;

    }

    if (
      observedTimer === timer
    ) {
      return;
    }

    timerObserver?.disconnect();

    observedTimer = timer;

    timerObserver = new MutationObserver(
      updateCircle
    );

    timerObserver.observe(
      timer,
      {
        childList: true,
        characterData: true,
        subtree: true
      }
    );

    updateCircle();

  }

  /* ========================================
     SCHEDULE A SINGLE REFRESH
     ======================================== */

  let scheduled = false;

  function sync() {

    if (!modalOpen()) {

      timerObserver?.disconnect();

      timerObserver = null;

      observedTimer = null;

      return;

    }

    skipIntro();

    watchTimer();

    updateCircle();

  }

  function scheduleSync() {

    if (scheduled) return;

    scheduled = true;

    requestAnimationFrame(() => {

      scheduled = false;

      sync();

    });

  }

  /* ========================================
     RESET NAVIGATION
     ======================================== */

  function afterResetAction() {

    scheduleSync();

    /* Short compatibility check for
       the existing reset module. */

    setTimeout(
      scheduleSync,
      100
    );

  }

  /* ========================================
     INITIALISATION
     ======================================== */

  function init() {

    installStyles();

    /* Preserve original Reset entry point.
       Just synchronise after opening. */

    const openReset =
      window.openManaLifeReset;

    if (
      typeof openReset === "function"
    ) {

      window.openManaLifeReset = function(...args) {

        const result = openReset.apply(
          this,
          args
        );

        afterResetAction();

        return result;

      };

    }

    document.addEventListener(
      "click",
      event => {

        if (
          !(event.target instanceof Element)
        ) return;

        const relevant =
          event.target.closest(
            [
              "#ml140OpenReset",
              "#manaV936Open",
              "#manaV936BreathStart",
              "#manaV936Next"
            ].join(",")
          );

        if (relevant) {

          afterResetAction();

        }

      }
    );

    window.addEventListener(
      "pageshow",
      scheduleSync
    );

    scheduleSync();

    window.MANA_RESET_STABLE_BUILD =
      BUILD;

    console.log(
      "MANA GREEN BREATH ANIMATION",
      BUILD
    );

  }

  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      {once:true}
    );

  } else {

    init();

  }

})();
