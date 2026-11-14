
/* ====================================================
   MANA MOVEMENT — CIRCUITS AUDIO
   BUILD 104892 — IPHONE AUDIO RECOVERY

   Complete replacement:
   mana_strength_circuit_audio_104888.js

   Preserves original workout timer and navigation.
   iPhone: one spoken start countdown from user tap.
   Desktop: individual spoken countdown numbers.
   Transition cues: Web Audio with speech fallback.
   ==================================================== */

(() => {
  "use strict";

  const BUILD = "104892";
  if (window.MANA_CIRCUIT_AUDIO_104892) return;
  window.MANA_CIRCUIT_AUDIO_104892 = true;

  const TOGGLE = "manaCircuitAudioToggle104888";
  const PREF = "mana:circuits:sound";
  const $ = s => document.querySelector(s);

  const iphone =
    /iPhone|iPad|iPod/i.test(navigator.userAgent);

  let sound = true;
  try {
    sound = localStorage.getItem(PREF) !== "off";
  } catch (_) {}

  let ctx = null;
  let audioReady = false;
  let countdown = null;
  let watcher = null;
  let watchRoot = null;
  let priorElapsed = null;
  let priorCue = "";
  let nativeClick = false;
  let setupQueued = false;
  let voiceToken = 0;

  const activeOscillators = new Set();

  function root() {
    const shell = $("#manaV83ProgramShell");
    if (!shell?.classList.contains("open")) return null;

    if (!/strength/i.test(
      $("#manaV83Title")?.textContent || ""
    )) return null;

    if (!$("#manaV83Tabs " +
      '[data-v83-tab="learn"].active'
    )) return null;

    return $("#manaV83Content .msc-root");
  }

  function config(el) {
    const type = el.dataset.type || "emom";

    const selected = Number(
      el.querySelector(
        '.msc-setting[aria-pressed="true"]'
      )?.dataset.mscDuration
    );

    const duration =
      selected > 0 ? selected :
      type === "tabata" ? 1 :
      type === "strength" ? 45 : 15;

    return {
      type,
      duration,
      total: type === "tabata"
        ? duration * 240 : duration * 60
    };
  }

  function remaining(el) {
    const value = (
      el.querySelector(".msc-clock")
        ?.textContent || ""
    ).trim();

    const match = /^(\d+):(\d{2})$/.exec(value);

    return match
      ? Number(match[1]) * 60 + Number(match[2])
      : null;
  }

  /* ====================================
     AUDIO CONTEXT

     Unlike previous builds, don't treat
     a suspended context as ready.
     ==================================== */

  function unlock() {
    if (!sound) return Promise.resolve(false);

    const Engine =
      window.AudioContext ||
      window.webkitAudioContext;

    if (!Engine) {
      audioReady = false;
      return Promise.resolve(false);
    }

    try {
      if (!ctx) ctx = new Engine();

      if (ctx.state === "running") {
        audioReady = true;
        return Promise.resolve(true);
      }

      return ctx.resume()
        .then(() => {
          audioReady = ctx.state === "running";
          return audioReady;
        })
        .catch(() => {
          audioReady = false;
          return false;
        });

    } catch (_) {
      audioReady = false;
      return Promise.resolve(false);
    }
  }

  function tone(hz = 850, ms = 160, delay = 0) {
    if (!sound || !ctx ||
        ctx.state !== "running") return false;

    try {
      const at = ctx.currentTime + delay;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.value = hz;

      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(
        0.23, at + 0.015
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001, at + ms / 1000
      );

      osc.connect(gain);
      gain.connect(ctx.destination);

      activeOscillators.add(osc);
      osc.onended = () => {
        activeOscillators.delete(osc);
        try {
          osc.disconnect();
          gain.disconnect();
        } catch (_) {}
      };

      osc.start(at);
      osc.stop(at + ms / 1000 + 0.02);
      return true;

    } catch (_) {
      return false;
    }
  }

  function stopTones() {
    for (const osc of activeOscillators) {
      try { osc.stop(); } catch (_) {}
    }
    activeOscillators.clear();
  }

  function stopVoice() {
    voiceToken++;
    try {
      window.speechSynthesis?.cancel();
    } catch (_) {}
  }

  function speak(text, rate = 1.25) {
    if (!sound) return false;

    if (!window.speechSynthesis ||
        !window.SpeechSynthesisUtterance) {
      return false;
    }

    try {
      const speech =
        new SpeechSynthesisUtterance(text);

      speech.lang = "en-AU";
      speech.rate = rate;
      speech.pitch = 1;
      speech.volume = 1;

      window.speechSynthesis.speak(speech);
      return true;

    } catch (_) {
      return false;
    }
  }

  function signal() {
    if (!sound) return;

    if (ctx?.state === "running") {
      tone(950, 150);
      tone(1250, 210, 0.17);
    } else {
      speak("Go", 1.4);
    }
  }

  function marks(cfg) {
    const result = [];

    if (cfg.type === "emom") {
      for (let t = 60; t <= cfg.total; t += 60) {
        result.push(t);
      }

    } else if (cfg.type === "tabata") {
      for (let t = 0; t < cfg.total; t += 30) {
        result.push(t + 20, t + 30);
      }

    } else {
      const stages = {
        15: [3, 4, 4, 2, 2],
        30: [5, 9, 9, 4, 3],
        45: [5, 15, 15, 5, 5]
      }[cfg.duration] || [5, 15, 15, 5, 5];

      let t = 0;
      for (const minutes of stages) {
        t += minutes * 60;
        result.push(t);
      }
    }

    return result;
  }

  function stopWatch() {
    if (watcher !== null) clearInterval(watcher);
    watcher = null;
    watchRoot = null;
    priorElapsed = null;
    priorCue = "";
  }

  function check() {
    const el = root();

    if (!el || el !== watchRoot) {
      stopWatch();
      return;
    }

    const button = el.querySelector(
      '[data-msc-action="start"]'
    );

    if (!/pause timer/i.test(
      button?.textContent || ""
    )) {
      stopWatch();
      return;
    }

    const seconds = remaining(el);
    if (seconds === null) return;

    const cfg = config(el);
    const elapsed = cfg.total - seconds;
    const points = marks(cfg);

    if (priorElapsed !== null &&
        elapsed - priorElapsed > 2) {
      priorElapsed = elapsed;
      priorCue = "";
      return;
    }

    if (priorElapsed !== null) {
      const transition = points.find(
        t => t > priorElapsed && t <= elapsed
      );

      if (transition !== undefined) {
        if (!iphone) stopVoice();
        signal();
        priorCue = "";
      }
    }

    const next = points.find(t => t > elapsed);

    if (next !== undefined) {
      const left = next - elapsed;

      if (left >= 1 && left <= 5) {
        const key = next + ":" + left;

        if (key !== priorCue) {
          priorCue = key;

          if (iphone) {
            /* One announcement per transition,
               not five queued utterances. */
            if (left === 5) {
              if (!speak(
                "Five, four, three, two, one",
                1.4
              )) {
                tone(750, 120);
              }
            }
          } else {
            speak(String(left), 1.55);
          }
        }

      } else {
        priorCue = "";
      }
    }

    priorElapsed = elapsed;
  }

  function startWatch() {
    stopWatch();

    const el = root();
    if (!el) return;

    watchRoot = el;

    const shown = remaining(el);
    if (shown !== null) {
      priorElapsed = config(el).total - shown;
    }

    watcher = setInterval(check, 100);
    check();
  }

  function cancelStart(restore = true) {
    if (!countdown) return;

    const state = countdown;
    countdown = null;

    clearInterval(state.interval);
    stopVoice();

    if (restore && state.button.isConnected) {
      state.button.textContent = "Start timer";
    }
  }

  function stopAll() {
    cancelStart();
    stopWatch();
    stopVoice();
    stopTones();
  }

  /* ====================================
     START COUNTDOWN

     iPhone requests speech immediately
     within the actual user click.
     ==================================== */

  function prepare(button) {
    stopAll();

    const el = root();
    if (!el) return;

    const end = performance.now() + 5000;

    /* Both are requested directly in
       the Start button's user gesture. */

    unlock();

    if (iphone && sound) {
      speak(
        "Starting in five, four, three, two, one",
        1.35
      );
    }

    const state = {
      el,
      button,
      end,
      last: 0,
      interval: null
    };

    countdown = state;

    function update() {
      if (countdown !== state) return;

      if (root() !== el || !el.contains(button)) {
        cancelStart();
        return;
      }

      const left = Math.max(
        0,
        Math.ceil(
          (end - performance.now()) / 1000
        )
      );

      if (left === 0) {
        /* Don't cancel the completed iPhone
           utterance during the transition. */
        clearInterval(state.interval);
        countdown = null;

        if (!iphone) stopVoice();
        signal();

        nativeClick = true;

        try {
          button.click();
        } finally {
          nativeClick = false;
        }

        startWatch();
        return;
      }

      button.textContent =
        `Starting in ${left} · Cancel`;

      if (state.last !== left) {
        state.last = left;

        if (!iphone) {
          speak(
            left === 5
              ? "Starting in five"
              : String(left),
            1.55
          );
        }
      }
    }

    state.interval = setInterval(update, 75);
    update();
  }

  function toggle() {
    const el = root();
    const actions = el?.querySelector(".msc-actions");
    if (!actions) return;

    let button = actions.querySelector("#" + TOGGLE);

    if (!button) {
      button = document.createElement("button");
      button.id = TOGGLE;
      button.type = "button";
      button.className = "msc-btn alt";
      actions.appendChild(button);
    }

    button.textContent = sound
      ? "Sound On" : "Sound Off";

    button.setAttribute(
      "aria-pressed", String(sound)
    );
  }

  function refresh() {
    if (setupQueued) return;
    setupQueued = true;

    requestAnimationFrame(() => {
      setupQueued = false;
      toggle();

      if (!root()) stopAll();
    });
  }

  function init() {
    const style = document.createElement("style");

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

    const holder = $("#manaV83Content");
    if (holder) {
      new MutationObserver(refresh).observe(holder, {
        childList: true
      });
    }

    document.addEventListener("click", event => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const button = target.closest("button");
      if (!button) return;

      if (button.id === TOGGLE && root()) {
        sound = !sound;

        try {
          localStorage.setItem(
            PREF, sound ? "on" : "off"
          );
        } catch (_) {}

        if (sound) {
          unlock();
        } else {
          stopVoice();
          stopTones();
        }

        toggle();
        return;
      }

      if (button.matches(
        '[data-msc-action="start"]'
      ) && root()) {
        if (nativeClick) return;

        const label = (
          button.textContent || ""
        ).trim();

        if (countdown &&
            countdown.button === button) {
          event.preventDefault();
          event.stopImmediatePropagation();
          cancelStart();
          return;
        }

        if (/^(start timer|start again)$/i.test(
          label
        )) {
          event.preventDefault();
          event.stopImmediatePropagation();
          prepare(button);
          return;
        }

        if (/pause timer/i.test(label)) {
          stopWatch();
          stopVoice();
          stopTones();

        } else if (/resume timer/i.test(label)) {
          unlock();
          setTimeout(startWatch, 0);
        }

        return;
      }

      if (button.matches(
        '[data-msc-action="reset"],' +
        '[data-msc-type],' +
        '[data-msc-duration]'
      )) {
        stopAll();
        setTimeout(refresh, 0);
        return;
      }

      if (button.closest("#manaV83Tabs") ||
          button.matches(
            '[data-msc-action="learning"]'
          )) {
        stopAll();
        setTimeout(refresh, 0);
      }
    }, true);

    window.addEventListener(
      "mana:program-tab-change", refresh
    );

    window.addEventListener("pageshow", refresh);

    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.hidden) {
          if (countdown) cancelStart();
          stopVoice();
        }
      }
    );

    refresh();

    console.log(
      "[Mana Strength] Circuit audio " + BUILD
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded", init, { once: true }
    );
  } else {
    init();
  }
})();
