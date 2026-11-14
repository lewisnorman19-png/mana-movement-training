
/* ======================================================
   MANA MOVEMENT — CIRCUIT AUDIO
   BUILD 104889 — MOBILE SYNC FIX

   COMPLETE REPLACEMENT:
   mana_strength_circuit_audio_104888.js

   - Desktop: spoken countdown with queue clearing
   - Mobile: precise countdown tones
   - Start countdown: 5, 4, 3, 2, 1, GO
   - EMOM: minute transition cues
   - Tabata: work/rest transition cues
   - Strength: block transition cues
   - Sound On / Off
   - Pause and Reset cancel pending audio
   - Follows existing circuit timer
   - No database or workout changes
   ====================================================== */

(() => {
  "use strict";

  const BUILD = "104889";
  const FLAG = "MANA_CIRCUIT_AUDIO_104889";
  const TOGGLE = "manaCircuitAudioToggle104888";
  const STYLE = "manaCircuitAudioStyle104889";
  const PREF = "mana:circuits:sound";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const $ = selector =>
    document.querySelector(selector);

  const isMobile =
    /Android|iPhone|iPad|iPod/i.test(
      navigator.userAgent || ""
    );

  let enabled = true;

  try {
    enabled = localStorage.getItem(PREF) !== "off";
  } catch (_) {}

  let audioContext = null;

  let preparation = null;
  let watcher = null;
  let watchedRoot = null;

  let lastElapsed = null;
  let lastCue = "";
  let allowingNativeStart = false;
  let setupQueued = false;

  /* =====================================
     CURRENT CIRCUIT
     ===================================== */

  function root() {
    const shell = $("#manaV83ProgramShell");

    if (!shell?.classList.contains("open")) {
      return null;
    }

    if (
      !/strength/i.test(
        $("#manaV83Title")?.textContent || ""
      )
    ) {
      return null;
    }

    if (
      !$("#manaV83Tabs " +
        '[data-v83-tab="learn"].active')
    ) {
      return null;
    }

    return $("#manaV83Content .msc-root");
  }

  function startButton(element) {
    return element?.querySelector(
      '[data-msc-action="start"]'
    );
  }

  function shownSeconds(element) {
    const value =
      element?.querySelector(".msc-clock")
        ?.textContent || "";

    const match = /^(\d+):(\d{2})$/.exec(
      value.trim()
    );

    if (!match) return null;

    return (
      Number(match[1]) * 60 +
      Number(match[2])
    );
  }

  function settings(element) {
    const type =
      element?.dataset.type || "emom";

    const value = Number(
      element?.querySelector(
        '.msc-setting[aria-pressed="true"]'
      )?.dataset.mscDuration
    );

    const duration =
      Number.isFinite(value) && value > 0
        ? value
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

  /* =====================================
     AUDIO ENGINE

     Mobile tones use Web Audio rather
     than queued text-to-speech.

     The audio context is unlocked by
     pressing the workout Start button.
     ===================================== */

  function getAudio() {
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

  function tone(
    frequency = 760,
    duration = 110,
    delay = 0
  ) {
    const audio = getAudio();
    if (!audio) return;

    try {
      const at =
        audio.currentTime + delay;

      const oscillator =
        audio.createOscillator();

      const gain = audio.createGain();

      oscillator.type = "sine";

      oscillator.frequency.setValueAtTime(
        frequency,
        at
      );

      gain.gain.setValueAtTime(
        0.0001,
        at
      );

      gain.gain.exponentialRampToValueAtTime(
        0.20,
        at + 0.012
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        at + duration / 1000
      );

      oscillator.connect(gain);
      gain.connect(audio.destination);

      oscillator.start(at);
      oscillator.stop(
        at + duration / 1000 + 0.02
      );
    } catch (_) {}
  }

  function stopSpeech() {
    try {
      window.speechSynthesis?.cancel();
    } catch (_) {}
  }

  function speak(number) {
    if (!enabled) return;

    /* Mobile speech startup is often
       delayed. Use accurate tones. */

    if (isMobile) {
      tone(740, 110);
      return;
    }

    if (
      !("speechSynthesis" in window) ||
      !("SpeechSynthesisUtterance" in window)
    ) {
      tone(740, 110);
      return;
    }

    try {
      /* Never queue numbers behind
         previously spoken numbers. */

      stopSpeech();

      const voice =
        new SpeechSynthesisUtterance(
          String(number)
        );

      voice.lang = "en-AU";
      voice.rate = 1.45;
      voice.pitch = 1;
      voice.volume = 0.95;

      window.speechSynthesis.speak(voice);
    } catch (_) {
      tone(740, 110);
    }
  }

  function changeSignal() {
    if (!enabled) return;

    stopSpeech();

    tone(920, 140);
    tone(1250, 200, 0.16);
  }

  /* =====================================
     TRANSITION BOUNDARIES
     ===================================== */

  function boundaries(config) {
    const result = [];

    if (config.type === "emom") {
      for (
        let t = 60;
        t <= config.total;
        t += 60
      ) {
        result.push(t);
      }

    } else if (config.type === "tabata") {
      for (
        let t = 0;
        t < config.total;
        t += 30
      ) {
        result.push(t + 20, t + 30);
      }

    } else {
      const stages = {
        15: [3, 4, 4, 2, 2],
        30: [5, 9, 9, 4, 3],
        45: [5, 15, 15, 5, 5]
      }[config.duration] ||
        [5, 15, 15, 5, 5];

      let position = 0;

      for (const minutes of stages) {
        position += minutes * 60;
        result.push(position);
      }
    }

    return result;
  }

  /* =====================================
     STOP SOUND TRACKING
     ===================================== */

  function stopWatcher() {
    if (watcher !== null) {
      clearInterval(watcher);
    }

    watcher = null;
    watchedRoot = null;
    lastElapsed = null;
    lastCue = "";
  }

  function cancelPreparation(restore = true) {
    if (!preparation) return;

    const current = preparation;

    clearInterval(current.interval);
    preparation = null;

    stopSpeech();

    if (
      restore &&
      current.button?.isConnected
    ) {
      current.button.textContent =
        "Start timer";
    }
  }

  function stopEverything() {
    cancelPreparation();
    stopWatcher();
    stopSpeech();
  }

  /* =====================================
     REAL-TIME INTERVAL AUDIO

     Read the SAME displayed clock
     used by the circuit workout.

     Never queue missed countdowns.
     ===================================== */

  function check() {
    const element = root();

    if (
      !element ||
      element !== watchedRoot
    ) {
      stopWatcher();
      return;
    }

    const button = startButton(element);

    if (
      !button ||
      !/pause timer/i.test(
        button.textContent || ""
      )
    ) {
      stopWatcher();
      return;
    }

    const shown = shownSeconds(element);
    if (shown === null) return;

    const config = settings(element);

    const elapsed = Math.max(
      0,
      config.total - shown
    );

    const marks = boundaries(config);

    /* Ignore large jumps caused by
       backgrounded or suspended tabs. */

    if (
      lastElapsed !== null &&
      elapsed - lastElapsed > 2
    ) {
      lastElapsed = elapsed;
      lastCue = "";
      return;
    }

    /* Signal a crossed transition. */

    if (lastElapsed !== null) {
      const crossed = marks.find(
        mark =>
          mark > lastElapsed &&
          mark <= elapsed
      );

      if (crossed !== undefined) {
        changeSignal();
        lastCue = "";
      }
    }

    /* Announce the final five seconds
       until the next transition. */

    const next = marks.find(
      mark => mark > elapsed
    );

    if (next !== undefined) {
      const secondsLeft =
        next - elapsed;

      if (
        secondsLeft >= 1 &&
        secondsLeft <= 5
      ) {
        const key =
          next + ":" + secondsLeft;

        if (key !== lastCue) {
          lastCue = key;
          speak(secondsLeft);
        }
      } else {
        lastCue = "";
      }
    }

    lastElapsed = elapsed;
  }

  function watch() {
    stopWatcher();

    const element = root();
    if (!element) return;

    watchedRoot = element;

    const config = settings(element);
    const shown = shownSeconds(element);

    if (shown !== null) {
      lastElapsed = Math.max(
        0,
        config.total - shown
      );
    }

    watcher = setInterval(check, 90);
    check();
  }

  /* =====================================
     FIVE-SECOND START COUNTDOWN

     Use performance.now() rather than
     counting interval callbacks.

     This avoids accumulated timing drift.
     ===================================== */

  function prepareStart(button) {
    stopEverything();
    getAudio();

    const element = root();
    if (!element) return;

    const endsAt =
      performance.now() + 5000;

    const state = {
      element,
      button,
      endsAt,
      lastNumber: null,
      interval: null
    };

    preparation = state;

    function update() {
      if (preparation !== state) return;

      if (
        root() !== element ||
        !element.contains(button)
      ) {
        cancelPreparation();
        return;
      }

      const left = Math.max(
        0,
        Math.ceil(
          (endsAt - performance.now()) /
          1000
        )
      );

      if (left === 0) {
        cancelPreparation(false);

        changeSignal();

        /* Activate the EXISTING
           workout timer unchanged. */

        allowingNativeStart = true;

        try {
          button.click();
        } finally {
          allowingNativeStart = false;
        }

        watch();
        return;
      }

      button.textContent =
        "Starting in " +
        left +
        " · Cancel";

      if (state.lastNumber !== left) {
        state.lastNumber = left;
        speak(left);
      }
    }

    state.interval = setInterval(
      update,
      50
    );

    update();
  }

  /* =====================================
     SOUND CONTROL
     ===================================== */

  function ensureToggle() {
    const element = root();
    if (!element) return;

    const actions =
      element.querySelector(
        ".msc-actions"
      );

    if (!actions) return;

    let button =
      actions.querySelector(
        "#" + TOGGLE
      );

    if (!button) {
      button = document.createElement(
        "button"
      );

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
    if (setupQueued) return;

    setupQueued = true;

    requestAnimationFrame(() => {
      setupQueued = false;

      ensureToggle();

      if (!root()) {
        stopEverything();
      }
    });
  }

  function installStyle() {
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

  /* =====================================
     BUTTON INTERCEPTION

     Capture clicks before the original
     timer's delegated handler.

     Resume is immediate; only a fresh
     session gets the five-second start.
     ===================================== */

  document.addEventListener(
    "click",
    event => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const button =
        target.closest("button");

      if (!button) return;

      if (
        button.id === TOGGLE &&
        root()
      ) {
        enabled = !enabled;

        try {
          localStorage.setItem(
            PREF,
            enabled ? "on" : "off"
          );
        } catch (_) {}

        if (enabled) {
          getAudio();
        } else {
          stopSpeech();
        }

        ensureToggle();
        return;
      }

      if (
        button.matches(
          '[data-msc-action="start"]'
        ) &&
        root()
      ) {
        if (allowingNativeStart) return;

        const label =
          (button.textContent || "").trim();

        if (
          preparation &&
          preparation.button === button
        ) {
          event.preventDefault();
          event.stopImmediatePropagation();

          cancelPreparation();
          return;
        }

        if (
          /^(start timer|start again)$/i.test(
            label
          )
        ) {
          event.preventDefault();
          event.stopImmediatePropagation();

          prepareStart(button);
          return;
        }

        if (/pause timer/i.test(label)) {
          stopWatcher();
          stopSpeech();

        } else if (
          /resume timer/i.test(label)
        ) {
          getAudio();

          setTimeout(watch, 0);
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
        stopEverything();

        setTimeout(refresh, 0);
        return;
      }

      if (
        button.closest("#manaV83Tabs") ||
        button.matches(
          '[data-msc-action="learning"]'
        )
      ) {
        stopEverything();
        setTimeout(refresh, 0);
      }
    },
    true
  );

  /* =====================================
     INITIALISE
     ===================================== */

  function init() {
    installStyle();

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
          if (preparation) {
            cancelPreparation();
          }

          /* A background browser may
             suspend audio. Don't queue
             old spoken numbers. */

          stopSpeech();
        }
      }
    );

    refresh();

    console.log(
      "[Mana Strength] Circuit audio " +
      BUILD
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
