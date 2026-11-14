
/* MANA MOVEMENT — CIRCUITS AUDIO 104888
   NEW complete file. Load after both Circuits scripts.
   Does not modify the underlying circuit timer or workouts.
*/
(() => {
  "use strict";
  if (window.MANA_CIRCUIT_AUDIO_104888) return;
  window.MANA_CIRCUIT_AUDIO_104888 = true;

  const ID = "manaCircuitAudioToggle104888";
  const CSS_ID = "manaCircuitAudioStyle104888";
  const PREF = "mana:circuits:sound";
  const $ = s => document.querySelector(s);

  let enabled = true;
  try {
    enabled = localStorage.getItem(PREF) !== "off";
  } catch (_) {}

  let audio = null;
  let polling = null;
  let countdown = null;
  let lastCount = null;
  let lastElapsed = null;
  let activeRoot = null;
  let allowNativeClick = false;
  let setupScheduled = false;

  /* Identify the active Strength circuit. */

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

    if (!$("#manaV83Tabs [data-v83-tab='learn'].active")) {
      return null;
    }

    return $("#manaV83Content .msc-root");
  }

  function getSettings(root) {
    const type = root?.dataset.type || "emom";

    const value = Number(
      root?.querySelector(
        ".msc-setting[aria-pressed='true']"
      )?.dataset.mscDuration
    );

    const n =
      Number.isFinite(value) && value > 0
        ? value
        : type === "tabata"
          ? 1
          : type === "strength"
            ? 45
            : 15;

    return {
      type,
      duration: n,
      total: type === "tabata" ? n * 240 : n * 60
    };
  }

  function secondsShown(root) {
    const match = /^\s*(\d+):(\d{2})\s*$/.exec(
      root?.querySelector(".msc-clock")?.textContent || ""
    );

    return match
      ? Number(match[1]) * 60 + Number(match[2])
      : null;
  }

  /* Web Audio produces the interval beeps.
     Audio is unlocked by the user's click. */

  function context() {
    if (!enabled) return null;

    try {
      const Audio =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!Audio) return null;

      if (!audio) audio = new Audio();

      if (audio.state === "suspended") {
        audio.resume().catch(() => {});
      }

      return audio;
    } catch (_) {
      return null;
    }
  }

  function tone(hz = 740, ms = 125, delay = 0) {
    const ctx = context();
    if (!ctx) return;

    try {
      const start =
        ctx.currentTime + Math.max(0, delay);

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = hz;

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(
        0.19,
        start + 0.015
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        start + ms / 1000
      );

      oscillator.connect(gain).connect(
        ctx.destination
      );

      oscillator.start(start);
      oscillator.stop(
        start + ms / 1000 + 0.02
      );
    } catch (_) {}
  }

  function signal() {
    if (!enabled) return;

    tone(920, 150);
    tone(1200, 220, 0.17);
  }

  /* Spoken countdown uses the browser's
     available speech synthesis voice. */

  function say(words) {
    if (!enabled ||
        !("speechSynthesis" in window)) {
      return;
    }

    try {
      const speech = new SpeechSynthesisUtterance(
        String(words)
      );

      speech.lang = "en-AU";
      speech.rate = 1.2;
      speech.pitch = 1;
      speech.volume = 0.9;

      window.speechSynthesis.speak(speech);
    } catch (_) {}
  }

  function silenceVoice() {
    try {
      window.speechSynthesis?.cancel();
    } catch (_) {}
  }

  /* Build the transition points
     for the selected session. */

  function borders(cfg) {
    const end = cfg.total;
    const arr = [];

    if (cfg.type === "emom") {
      for (let s = 60; s <= end; s += 60) {
        arr.push(s);
      }

    } else if (cfg.type === "tabata") {
      for (let s = 0; s < end; s += 30) {
        arr.push(s + 20, s + 30);
      }

    } else {
      const blocks = {
        15: [3, 4, 4, 2, 2],
        30: [5, 9, 9, 4, 3],
        45: [5, 15, 15, 5, 5]
      }[cfg.duration] || [5, 15, 15, 5, 5];

      let s = 0;

      for (const length of blocks) {
        s += length * 60;
        arr.push(s);
      }
    }

    return arr;
  }

  function stopPolling() {
    if (polling !== null) {
      clearInterval(polling);
    }

    polling = null;
    lastElapsed = null;
    lastCount = null;
    activeRoot = null;
  }

  /* Follow the REAL circuit timer display.
     Avoid creating a second independent
     workout countdown. */

  function checkTransitions() {
    const root = circuitRoot();

    if (!root || root !== activeRoot) {
      stopPolling();
      return;
    }

    const button = root.querySelector(
      '[data-msc-action="start"]'
    );

    const seconds = secondsShown(root);
    const cfg = getSettings(root);

    if (seconds == null || !button) {
      stopPolling();
      return;
    }

    const elapsed = Math.max(
      0,
      cfg.total - seconds
    );

    const running = /pause timer/i.test(
      button.textContent || ""
    );

    if (!running) {
      stopPolling();
      return;
    }

    const boundaries = borders(cfg);

    /* Beep when an interval ends. */

    if (
      lastElapsed !== null &&
      elapsed > lastElapsed
    ) {
      const crossed = boundaries.filter(
        b => b <= elapsed && b > lastElapsed
      );

      if (
        crossed.length &&
        elapsed - crossed[crossed.length - 1] <= 1
      ) {
        signal();
      }
    }

    /* Spoken countdown for next change. */

    const next = boundaries.find(
      b => b > elapsed
    );

    const left =
      next == null ? null : next - elapsed;

    if (
      left !== null &&
      left >= 1 &&
      left <= 5
    ) {
      const key = `${next}:${left}`;

      if (lastCount !== key) {
        lastCount = key;
        say(String(left));

        if (!("speechSynthesis" in window)) {
          tone(700, 100);
        }
      }
    } else {
      lastCount = null;
    }

    lastElapsed = elapsed;
  }

  function startPolling() {
    stopPolling();

    const root = circuitRoot();
    if (!root) return;

    activeRoot = root;

    const cfg = getSettings(root);
    const shown = secondsShown(root);

    lastElapsed = shown === null
      ? null
      : Math.max(0, cfg.total - shown);

    polling = setInterval(
      checkTransitions,
      160
    );

    checkTransitions();
  }

  /* Five-second countdown BEFORE starting
     the actual workout timer. */

  function stopCountdown(restore = true) {
    if (!countdown) return;

    clearInterval(countdown.interval);

    const button = countdown.button;
    countdown = null;

    silenceVoice();

    if (restore && button?.isConnected) {
      button.textContent = "Start timer";
    }
  }

  function startCountdown(button) {
    stopCountdown();
    stopPolling();

    context();
    silenceVoice();

    const root = circuitRoot();
    if (!root) return;

    const ends = performance.now() + 5000;

    const state = {
      button,
      root,
      ends,
      shown: 0,
      interval: null
    };

    countdown = state;

    function step() {
      if (countdown !== state) return;

      if (
        circuitRoot() !== root ||
        !root.contains(button)
      ) {
        stopCountdown();
        return;
      }

      const left = Math.max(
        0,
        Math.ceil(
          (ends - performance.now()) / 1000
        )
      );

      if (left === 0) {
        stopCountdown(false);
        signal();

        /* Let the original timer's
           existing Start handler run. */

        allowNativeClick = true;

        try {
          button.click();
        } finally {
          allowNativeClick = false;
        }

        setTimeout(startPolling, 0);
        return;
      }

      button.textContent =
        `Starting in ${left} · Cancel`;

      if (state.shown !== left) {
        state.shown = left;

        say(
          left === 5
            ? "Starting in five"
            : String(left)
        );

        if (!("speechSynthesis" in window)) {
          tone(680, 105);
        }
      }
    }

    state.interval = setInterval(step, 90);
    step();
  }

  /* Sound toggle inside the existing
     timer action row. */

  function ensureToggle() {
    const root = circuitRoot();
    if (!root) return;

    const actions = root.querySelector(
      ".msc-actions"
    );

    if (!actions || actions.querySelector(
      "#" + ID
    )) {
      return;
    }

    const button = document.createElement(
      "button"
    );

    button.type = "button";
    button.id = ID;
    button.className = "msc-btn alt";

    button.setAttribute(
      "aria-pressed",
      String(enabled)
    );

    button.textContent =
      enabled ? "Sound On" : "Sound Off";

    actions.appendChild(button);
  }

  function scheduleSetup() {
    if (setupScheduled) return;

    setupScheduled = true;

    requestAnimationFrame(() => {
      setupScheduled = false;
      ensureToggle();

      if (!circuitRoot()) {
        stopPolling();
        stopCountdown();
      }
    });
  }

  function installStyle() {
    if (document.getElementById(CSS_ID)) {
      return;
    }

    const style = document.createElement(
      "style"
    );

    style.id = CSS_ID;

    style.textContent = `
      #manaV83Content #${ID} {
        border: 1px solid #FF7927 !important;
        background: #121417 !important;
        color: #FFFFFF !important;
        min-width: 96px;
      }

      #manaV83Content
      #${ID}[aria-pressed="true"] {
        color: #FF7927 !important;
      }
    `;

    document.head.appendChild(style);
  }

  /* Handle sound controls before the
     original delegated timer handler. */

  document.addEventListener(
    "click",
    event => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const button = target.closest("button");
      if (!button) return;

      if (button.id === ID && circuitRoot()) {
        enabled = !enabled;

        button.setAttribute(
          "aria-pressed",
          String(enabled)
        );

        button.textContent =
          enabled ? "Sound On" : "Sound Off";

        try {
          localStorage.setItem(
            PREF,
            enabled ? "on" : "off"
          );
        } catch (_) {}

        if (enabled) {
          context();
        } else {
          silenceVoice();
        }

        return;
      }

      if (
        button.matches(
          '[data-msc-action="start"]'
        ) &&
        circuitRoot()
      ) {
        if (allowNativeClick) return;

        const text = (
          button.textContent || ""
        ).trim();

        if (
          countdown &&
          button === countdown.button
        ) {
          event.preventDefault();
          event.stopImmediatePropagation();
          stopCountdown();
          return;
        }

        if (
          /^start timer$|^start again$/i.test(
            text
          )
        ) {
          event.preventDefault();
          event.stopImmediatePropagation();

          startCountdown(button);
          return;
        }

        if (/pause timer/i.test(text)) {
          stopPolling();
          silenceVoice();

        } else if (/resume timer/i.test(text)) {
          context();

          setTimeout(
            startPolling,
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
        stopCountdown();
        stopPolling();

        setTimeout(
          scheduleSetup,
          0
        );
        return;
      }

      if (
        button.closest("#manaV83Tabs") ||
        button.matches(
          '[data-msc-action="learning"]'
        )
      ) {
        stopCountdown();
        stopPolling();

        setTimeout(
          scheduleSetup,
          0
        );
      }
    },
    true
  );

  function init() {
    installStyle();

    const holder = $("#manaV83Content");

    if (holder) {
      new MutationObserver(
        scheduleSetup
      ).observe(holder, {
        childList: true
      });
    }

    window.addEventListener(
      "mana:program-tab-change",
      scheduleSetup
    );

    window.addEventListener(
      "pageshow",
      scheduleSetup
    );

    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.hidden) {
          if (countdown) stopCountdown();
          silenceVoice();
        }
      }
    );

    scheduleSetup();

    console.log(
      "[Mana Strength] Circuit audio 104888"
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
