
/* =====================================================
   MANA MOVEMENT TRAINING
   CIRCUITS AUDIO — STABLE COUNTDOWN
   BUILD 104891

   COMPLETE REPLACEMENT:
   mana_strength_circuit_audio_104888.js

   DESKTOP:
   - Spoken 5 / 4 / 3 / 2 / 1
   - No cancelling individual numbers

   MOBILE:
   - Pre-scheduled Web Audio countdown tones
   - Separate GO signal
   - No speech queue or catch-up

   ALL DEVICES:
   - EMOM / Tabata / Strength transition cues
   - Sound On / Off
   - Pause / Reset cancellation
   - Existing workout timers unchanged
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104891";
  const FLAG = "MANA_CIRCUIT_AUDIO_104891";
  const TOGGLE = "manaCircuitAudioToggle104888";
  const STYLE = "manaCircuitAudioStyle104891";
  const PREF = "mana:circuits:sound";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const $ = selector =>
    document.querySelector(selector);

  const mobile =
    /Android|iPhone|iPad|iPod/i.test(
      navigator.userAgent || ""
    );

  let enabled = true;

  try {
    enabled = localStorage.getItem(PREF) !== "off";
  } catch (_) {}

  let audio = null;
  let countdown = null;
  let watcher = null;
  let watchedRoot = null;
  let previousElapsed = null;
  let previousCue = "";

  let allowingNativeStart = false;
  let refreshQueued = false;

  const scheduledTones = new Set();

  /* =====================================
     CIRCUIT DETECTION
     ===================================== */

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

  function remainingSeconds(root) {
    const value = (
      root?.querySelector(".msc-clock")
        ?.textContent || ""
    ).trim();

    const match = /^(\d+):(\d{2})$/.exec(
      value
    );

    if (!match) return null;

    return Number(match[1]) * 60 +
      Number(match[2]);
  }

  function settings(root) {
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

  /* =====================================
     AUDIO ENGINE
     ===================================== */

  function unlockAudio() {
    if (!enabled) return null;

    try {
      const Engine =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!Engine) return null;

      if (!audio) {
        audio = new Engine();
      }

      if (audio.state === "suspended") {
        audio.resume().catch(() => {});
      }

      return audio;
    } catch (_) {
      return null;
    }
  }

  function tone(
    frequency = 750,
    duration = 130,
    delay = 0,
    track = false
  ) {
    if (!enabled) return false;

    const context = unlockAudio();
    if (!context) return false;

    try {
      const at =
        context.currentTime +
        Math.max(0, delay);

      const oscillator =
        context.createOscillator();

      const gain = context.createGain();

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
      gain.connect(context.destination);

      if (track) {
        scheduledTones.add({
          oscillator,
          gain
        });
      }

      oscillator.onended = () => {
        try {
          oscillator.disconnect();
          gain.disconnect();
        } catch (_) {}

        for (const item of scheduledTones) {
          if (item.oscillator === oscillator) {
            scheduledTones.delete(item);
            break;
          }
        }
      };

      oscillator.start(at);
      oscillator.stop(
        at + duration / 1000 + 0.02
      );

      return true;

    } catch (_) {
      return false;
    }
  }

  function cancelScheduledTones() {
    for (const item of scheduledTones) {
      try {
        item.oscillator.stop();
      } catch (_) {}

      try {
        item.gain.gain.setValueAtTime(
          0.0001,
          audio.currentTime
        );
      } catch (_) {}
    }

    scheduledTones.clear();
  }

  function stopSpeech() {
    try {
      window.speechSynthesis?.cancel();
    } catch (_) {}
  }

  /* =====================================
     DESKTOP VOICE

     Never cancel speech between
     individual countdown numbers.

     This prevents losing "3" when
     another number is requested.
     ===================================== */

  function speak(words) {
    if (!enabled) return;

    if (
      !window.speechSynthesis ||
      !window.SpeechSynthesisUtterance
    ) {
      tone(750, 130);
      return;
    }

    try {
      const voice =
        new SpeechSynthesisUtterance(
          String(words)
        );

      voice.lang = "en-AU";
      voice.rate = 1.55;
      voice.pitch = 1;
      voice.volume = 1;

      window.speechSynthesis.speak(voice);

    } catch (_) {
      tone(750, 130);
    }
  }

  function goSignal() {
    if (!enabled) return;

    tone(940, 145);
    tone(1250, 220, 0.17);
  }

  /* =====================================
     MOBILE FIVE-SECOND START CUES

     Pre-scheduling inside the Start
     button interaction avoids speech
     delays and timer callback drift.
     ===================================== */

  function scheduleMobileStart() {
    if (!enabled) return;

    const context = unlockAudio();

    if (!context) {
      /* Audio unavailable: try voice
         during the visual countdown. */
      return false;
    }

    const frequencies = [
      650,
      700,
      750,
      800,
      850
    ];

    frequencies.forEach((hz, index) => {
      tone(hz, 140, index, true);
    });

    /* Start signal at exactly 5 seconds. */

    tone(940, 150, 5, true);
    tone(1250, 220, 5.17, true);

    return true;
  }

  /* =====================================
     INTERVAL BOUNDARIES
     ===================================== */

  function transitionPoints(config) {
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
      const minutes = {
        15: [3, 4, 4, 2, 2],
        30: [5, 9, 9, 4, 3],
        45: [5, 15, 15, 5, 5]
      }[config.duration] ||
        [5, 15, 15, 5, 5];

      let position = 0;

      minutes.forEach(value => {
        position += value * 60;
        result.push(position);
      });
    }

    return result;
  }

  /* =====================================
     WORKOUT TRANSITION AUDIO
     ===================================== */

  function stopWatcher() {
    if (watcher !== null) {
      clearInterval(watcher);
    }

    watcher = null;
    watchedRoot = null;
    previousElapsed = null;
    previousCue = "";
  }

  function watchTick() {
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

    const seconds = remainingSeconds(root);

    if (seconds === null) return;

    const config = settings(root);
    const elapsed = Math.max(
      0,
      config.total - seconds
    );

    const points = transitionPoints(config);

    /* Don't play cues that were missed
       while a phone was suspended. */

    if (
      previousElapsed !== null &&
      elapsed - previousElapsed > 2
    ) {
      previousElapsed = elapsed;
      previousCue = "";
      return;
    }

    if (previousElapsed !== null) {
      const crossed = points.find(
        point =>
          point > previousElapsed &&
          point <= elapsed
      );

      if (crossed !== undefined) {
        if (!mobile) stopSpeech();

        goSignal();
        previousCue = "";
      }
    }

    const next = points.find(
      point => point > elapsed
    );

    if (next !== undefined) {
      const left = next - elapsed;

      if (left >= 1 && left <= 5) {
        const key = next + ":" + left;

        if (previousCue !== key) {
          previousCue = key;

          if (mobile) {
            tone(720, 120);
          } else {
            speak(String(left));
          }
        }
      } else {
        previousCue = "";
      }
    }

    previousElapsed = elapsed;
  }

  function startWatcher() {
    stopWatcher();

    const root = circuitRoot();
    if (!root) return;

    watchedRoot = root;

    const seconds = remainingSeconds(root);

    previousElapsed = seconds === null
      ? null
      : Math.max(
          0,
          settings(root).total - seconds
        );

    watcher = setInterval(
      watchTick,
      100
    );

    watchTick();
  }

  /* =====================================
     START COUNTDOWN
     ===================================== */

  function cancelCountdown(
    restore = true,
    cancelTones = true
  ) {
    if (!countdown) return;

    const state = countdown;
    countdown = null;

    clearInterval(state.interval);

    if (cancelTones) {
      cancelScheduledTones();
    }

    stopSpeech();

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
    cancelScheduledTones();
    stopWatcher();
    stopSpeech();
  }

  function prepareStart(button) {
    stopAll();

    unlockAudio();

    const root = circuitRoot();
    if (!root) return;

    /* Start from the user click,
       not from the first timer callback. */

    const endsAt =
      performance.now() + 5000;

    const mobileScheduled =
      mobile && scheduleMobileStart();

    const state = {
      button,
      root,
      endsAt,
      lastNumber: null,
      mobileScheduled,
      interval: null
    };

    countdown = state;

    if (!mobile) {
      stopSpeech();
    }

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
          (endsAt - performance.now()) /
          1000
        )
      );

      if (left === 0) {
        /* Keep the already scheduled
           mobile GO sound playing. */

        cancelCountdown(
          false,
          !state.mobileScheduled
        );

        if (!mobile || !state.mobileScheduled) {
          goSignal();
        }

        allowingNativeStart = true;

        try {
          button.click();
        } finally {
          allowingNativeStart = false;
        }

        startWatcher();
        return;
      }

      button.textContent =
        "Starting in " +
        left +
        " · Cancel";

      if (state.lastNumber !== left) {
        state.lastNumber = left;

        if (!mobile) {
          speak(
            left === 5
              ? "Starting in five"
              : String(left)
          );
        } else if (!state.mobileScheduled) {
          speak(
            left === 5
              ? "Starting in five"
              : String(left)
          );
        }
      }
    }

    state.interval = setInterval(
      update,
      50
    );

    update();
  }

  /* =====================================
     SOUND TOGGLE
     ===================================== */

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
      button =
        document.createElement("button");

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

  /* =====================================
     ORIGINAL TIMER INTEGRATION
     ===================================== */

  document.addEventListener(
    "click",
    event => {
      const target = event.target;

      if (!(target instanceof Element)) return;

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
          stopSpeech();
          cancelScheduledTones();
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
        if (allowingNativeStart) return;

        const label =
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

  function init() {
    installStyles();

    const content =
      $("#manaV83Content");

    if (content) {
      new MutationObserver(
        refresh
      ).observe(content, {
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

          stopSpeech();
        }
      }
    );

    refresh();

    console.log(
      "[Mana Strength] Circuit Audio " +
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
