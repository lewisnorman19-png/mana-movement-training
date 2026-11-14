
/* ==========================================================
   MANA MOVEMENT — CIRCUIT AUDIO
   BUILD 104890

   COMPLETE REPLACEMENT:
   mana_strength_circuit_audio_104888.js

   RESTORES:
   - Spoken "Starting in five, four, three, two, one"
   - Voice countdown on laptop AND phone
   - Start and transition beeps
   - EMOM / Tabata / Strength transitions
   - Sound On / Off

   IMPROVES:
   - Shorter spoken numbers
   - Reduced speech backlog
   - Mobile audio unlocking
   - No accumulated timer drift
   - Pause / Reset cancellation

   Does not modify the workout timer or database.
   ========================================================== */

(() => {
  "use strict";

  const FLAG = "MANA_CIRCUIT_AUDIO_104890";
  if (window[FLAG]) return;
  window[FLAG] = true;

  const TOGGLE = "manaCircuitAudioToggle104888";
  const STYLE = "manaCircuitAudioStyle104890";
  const PREF = "mana:circuits:sound";

  const $ = selector =>
    document.querySelector(selector);

  let enabled = true;

  try {
    enabled = localStorage.getItem(PREF) !== "off";
  } catch (_) {}

  let audioContext = null;
  let countdown = null;
  let watcher = null;
  let watchedRoot = null;

  let lastElapsed = null;
  let lastCue = "";
  let nativeStart = false;
  let refreshQueued = false;

  const mobile =
    /Android|iPhone|iPad|iPod/i.test(
      navigator.userAgent || ""
    );

  /* ============================================
     ACTIVE CIRCUIT
     ============================================ */

  function circuitRoot() {
    const shell = $("#manaV83ProgramShell");

    if (!shell?.classList.contains("open")) {
      return null;
    }

    if (!/strength/i.test(
      $("#manaV83Title")?.textContent || ""
    )) {
      return null;
    }

    if (!$("#manaV83Tabs " +
      '[data-v83-tab="learn"].active')) {
      return null;
    }

    return $("#manaV83Content .msc-root");
  }

  function clockSeconds(root) {
    const text = root?.querySelector(
      ".msc-clock"
    )?.textContent?.trim() || "";

    const match = /^(\d+):(\d{2})$/.exec(text);

    if (!match) return null;

    return Number(match[1]) * 60 +
      Number(match[2]);
  }

  function configuration(root) {
    const type = root.dataset.type || "emom";

    const selected = Number(
      root.querySelector(
        '.msc-setting[aria-pressed="true"]'
      )?.dataset.mscDuration
    );

    const duration =
      Number.isFinite(selected) && selected > 0
        ? selected
        : type === "tabata" ? 1
        : type === "strength" ? 45
        : 15;

    return {
      type,
      duration,
      total: type === "tabata"
        ? duration * 240
        : duration * 60
    };
  }

  /* ============================================
     SOUND ENGINE
     ============================================ */

  function unlockAudio() {
    if (!enabled) return null;

    try {
      const Engine =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!Engine) return null;

      if (!audioContext) {
        audioContext = new Engine();
      }

      if (audioContext.state === "suspended") {
        audioContext.resume().catch(() => {});
      }

      return audioContext;
    } catch (_) {
      return null;
    }
  }

  function beep(
    frequency = 780,
    duration = 130,
    delay = 0
  ) {
    if (!enabled) return;

    const context = unlockAudio();
    if (!context) return;

    try {
      const start = context.currentTime + delay;

      const oscillator =
        context.createOscillator();

      const gain = context.createGain();

      oscillator.type = "sine";

      oscillator.frequency.setValueAtTime(
        frequency,
        start
      );

      gain.gain.setValueAtTime(
        0.0001,
        start
      );

      gain.gain.exponentialRampToValueAtTime(
        0.17,
        start + 0.015
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        start + duration / 1000
      );

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start(start);
      oscillator.stop(
        start + duration / 1000 + 0.02
      );
    } catch (_) {}
  }

  function silence() {
    try {
      window.speechSynthesis?.cancel();
    } catch (_) {}
  }

  /* Speech remains available on BOTH
     phones and laptops.

     Mobile uses a quicker voice rate.
     Clear stale speech so numbers cannot
     keep playing after a transition. */

  function speak(words) {
    if (!enabled) return;

    if (
      !window.speechSynthesis ||
      !window.SpeechSynthesisUtterance
    ) {
      beep(740, 110);
      return;
    }

    try {
      const engine = window.speechSynthesis;

      /* Clear an old queued phrase.
         Never let several numbers build
         up behind the visible timer. */

      if (engine.pending) {
        engine.cancel();
      }

      const utterance =
        new SpeechSynthesisUtterance(
          String(words)
        );

      utterance.lang = "en-AU";
      utterance.rate = mobile ? 1.35 : 1.2;
      utterance.pitch = 1;
      utterance.volume = 1;

      engine.speak(utterance);

    } catch (_) {
      beep(740, 110);
    }
  }

  function transitionBeep() {
    if (!enabled) return;

    silence();

    beep(920, 145);
    beep(1200, 215, 0.17);
  }

  /* ============================================
     WORKOUT TRANSITION TIMES
     ============================================ */

  function transitions(cfg) {
    const result = [];

    if (cfg.type === "emom") {
      for (
        let t = 60;
        t <= cfg.total;
        t += 60
      ) {
        result.push(t);
      }

    } else if (cfg.type === "tabata") {
      for (
        let t = 0;
        t < cfg.total;
        t += 30
      ) {
        result.push(t + 20, t + 30);
      }

    } else {
      const stages = {
        15: [3, 4, 4, 2, 2],
        30: [5, 9, 9, 4, 3],
        45: [5, 15, 15, 5, 5]
      }[cfg.duration] ||
        [5, 15, 15, 5, 5];

      let elapsed = 0;

      for (const minutes of stages) {
        elapsed += minutes * 60;
        result.push(elapsed);
      }
    }

    return result;
  }

  /* ============================================
     TRACK THE EXISTING CIRCUIT CLOCK
     ============================================ */

  function stopWatcher() {
    if (watcher !== null) {
      clearInterval(watcher);
    }

    watcher = null;
    watchedRoot = null;
    lastElapsed = null;
    lastCue = "";
  }

  function checkTransitions() {
    const root = circuitRoot();

    if (!root || root !== watchedRoot) {
      stopWatcher();
      return;
    }

    const button = root.querySelector(
      '[data-msc-action="start"]'
    );

    if (
      !button ||
      !/pause timer/i.test(
        button.textContent || ""
      )
    ) {
      stopWatcher();
      return;
    }

    const remaining = clockSeconds(root);
    if (remaining === null) return;

    const cfg = configuration(root);

    const elapsed = Math.max(
      0,
      cfg.total - remaining
    );

    const marks = transitions(cfg);

    /* Large jumps can occur after a
       browser tab has been suspended.
       Do not play missed cues. */

    if (
      lastElapsed !== null &&
      elapsed - lastElapsed > 2
    ) {
      lastElapsed = elapsed;
      lastCue = "";
      return;
    }

    if (lastElapsed !== null) {
      const crossed = marks.find(
        mark =>
          mark > lastElapsed &&
          mark <= elapsed
      );

      if (crossed !== undefined) {
        transitionBeep();
        lastCue = "";
      }
    }

    const next = marks.find(
      mark => mark > elapsed
    );

    if (next !== undefined) {
      const left = next - elapsed;

      if (left >= 1 && left <= 5) {
        const key = `${next}:${left}`;

        if (lastCue !== key) {
          lastCue = key;
          speak(String(left));
        }
      } else {
        lastCue = "";
      }
    }

    lastElapsed = elapsed;
  }

  function startWatcher() {
    stopWatcher();

    const root = circuitRoot();
    if (!root) return;

    watchedRoot = root;

    const shown = clockSeconds(root);

    if (shown !== null) {
      lastElapsed = Math.max(
        0,
        configuration(root).total - shown
      );
    }

    watcher = setInterval(
      checkTransitions,
      100
    );

    checkTransitions();
  }

  /* ============================================
     FIVE-SECOND SESSION START
     ============================================ */

  function cancelCountdown(restore = true) {
    if (!countdown) return;

    const state = countdown;
    countdown = null;

    clearInterval(state.interval);
    silence();

    if (
      restore &&
      state.button?.isConnected
    ) {
      state.button.textContent =
        "Start timer";
    }
  }

  function stopAll() {
    cancelCountdown();
    stopWatcher();
    silence();
  }

  function prepareStart(button) {
    stopAll();

    /* User interaction unlocks mobile
       audio and the speech synthesiser. */

    unlockAudio();

    const root = circuitRoot();
    if (!root) return;

    const end =
      performance.now() + 5000;

    const state = {
      root,
      button,
      end,
      last: null,
      interval: null
    };

    countdown = state;

    function update() {
      if (countdown !== state) return;

      if (
        circuitRoot() !== root ||
        !root.contains(button)
      ) {
        cancelCountdown();
        return;
      }

      const left = Math.max(
        0,
        Math.ceil(
          (end - performance.now()) / 1000
        )
      );

      if (left === 0) {
        cancelCountdown(false);
        transitionBeep();

        nativeStart = true;

        try {
          button.click();
        } finally {
          nativeStart = false;
        }

        startWatcher();
        return;
      }

      button.textContent =
        `Starting in ${left} · Cancel`;

      if (state.last !== left) {
        state.last = left;

        /* Restore spoken introduction
           on both laptop and phone. */

        speak(
          left === 5
            ? "Starting in five"
            : String(left)
        );
      }
    }

    state.interval = setInterval(
      update,
      80
    );

    update();
  }

  /* ============================================
     SOUND TOGGLE
     ============================================ */

  function ensureToggle() {
    const root = circuitRoot();
    if (!root) return;

    const actions =
      root.querySelector(".msc-actions");

    if (!actions) return;

    let button = actions.querySelector(
      "#" + TOGGLE
    );

    if (!button) {
      button = document.createElement("button");
      button.id = TOGGLE;
      button.type = "button";
      button.className = "msc-btn alt";

      actions.appendChild(button);
    }

    button.textContent =
      enabled ? "Sound On" : "Sound Off";

    button.setAttribute(
      "aria-pressed",
      String(enabled)
    );
  }

  function refresh() {
    if (refreshQueued) return;
    refreshQueued = true;

    requestAnimationFrame(() => {
      refreshQueued = false;
      ensureToggle();

      if (!circuitRoot()) {
        stopAll();
      }
    });
  }

  function installStyles() {
    if (document.getElementById(STYLE)) {
      return;
    }

    const style =
      document.createElement("style");

    style.id = STYLE;

    style.textContent = `
      #manaV83Content #${TOGGLE} {
        min-width: 96px;
        background: #121417 !important;
        border: 1px solid #FF7927 !important;
        color: #FFFFFF !important;
      }

      #manaV83Content
      #${TOGGLE}[aria-pressed="true"] {
        color: #FF7927 !important;
      }
    `;

    document.head.appendChild(style);
  }

  /* ============================================
     HANDLE TIMER BUTTONS

     Capture before the existing circuit
     renderer starts its own timer.
     ============================================ */

  document.addEventListener(
    "click",
    event => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const button = target.closest("button");
      if (!button) return;

      if (
        button.id === TOGGLE &&
        circuitRoot()
      ) {
        enabled = !enabled;

        try {
          localStorage.setItem(
            PREF,
            enabled ? "on" : "off"
          );
        } catch (_) {}

        if (enabled) {
          unlockAudio();
        } else {
          silence();
        }

        ensureToggle();
        return;
      }

      if (
        button.matches(
          '[data-msc-action="start"]'
        ) &&
        circuitRoot()
      ) {
        if (nativeStart) return;

        const text =
          (button.textContent || "").trim();

        if (
          countdown &&
          countdown.button === button
        ) {
          event.preventDefault();
          event.stopImmediatePropagation();

          cancelCountdown();
          return;
        }

        if (
          /^(start timer|start again)$/i.test(
            text
          )
        ) {
          event.preventDefault();
          event.stopImmediatePropagation();

          prepareStart(button);
          return;
        }

        if (/pause timer/i.test(text)) {
          stopWatcher();
          silence();

        } else if (/resume timer/i.test(text)) {
          unlockAudio();

          setTimeout(
            startWatcher,
            0
          );
        }

        return;
      }

      if (
        button.matches(
          '[data-msc-action="reset"],' +
          '[data-msc-type],' +
          '[data-msc-duration]'
        )
      ) {
        stopAll();
        setTimeout(refresh, 0);
        return;
      }

      if (
        button.closest("#manaV83Tabs") ||
        button.matches(
          '[data-msc-action="learning"]'
        )
      ) {
        stopAll();
        setTimeout(refresh, 0);
      }
    },
    true
  );

  /* ============================================
     INITIALISE
     ============================================ */

  function init() {
    installStyles();

    const holder =
      $("#manaV83Content");

    if (holder) {
      new MutationObserver(
        refresh
      ).observe(holder, {
        childList: true
      });
    }

    window.addEventListener(
      "mana:program-tab-change",
      refresh
    );

    window.addEventListener(
      "pageshow",
      refresh
    );

    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.hidden) {
          if (countdown) {
            cancelCountdown();
          }

          silence();
        }
      }
    );

    refresh();

    console.log(
      "[Mana Strength] Circuit audio 104890"
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }

})();
