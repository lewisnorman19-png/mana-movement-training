
/* =========================================
   MANA MOVEMENT TRAINING
   v9.62.2 — PREMIUM DEMO PLAYER FIX

   - Bench Press
   - Shoulder Press
   - Correct START and FINISH cropping
   - Full athlete centred
   - Play / Pause / Replay
   - Works on laptop and mobile
   - Lateral Raise remains on v9.60
   - No changes to workout logging
   - No changes to Fuel or Supabase
   ========================================= */

(() => {
  "use strict";

  const BUILD = "96220";
  const STYLE_ID = "mana-v962-styles";

  const EXERCISES = [
    {
      match: /bench\s*press/i,
      image: "assets/exercises/bench-press-demo.png",
      cue: "Lower the bar under control, then press upward.",
      start: {
        x: 0,
        y: 0,
        w: 0.5,
        h: 1
      },
      finish: {
        x: 0.5,
        y: 0,
        w: 0.5,
        h: 1
      }
    },
    {
      match:
        /shoulder\s*press|overhead\s*press|military\s*press|arnold\s*press/i,
      image: "assets/exercises/shoulder-press-demo.png",
      cue: "Press overhead with control. Keep your core engaged.",
      start: {
        x: 0,
        y: 0,
        w: 0.5,
        h: 1
      },
      finish: {
        x: 0.5,
        y: 0,
        w: 0.5,
        h: 1
      }
    }
  ];

  /* =========================================
     DESIGN
     ========================================= */

  const CSS = `

    .mana-v962-player {
      margin: 12px 0 0;
      background: #080808;
      border: 1px solid #806723;
      border-radius: 16px;
      overflow: hidden;
    }

    .mana-v962-stage {
      height: 490px;
      position: relative;
      background: #080808;
      overflow: hidden;
    }

    .mana-v962-stage img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
      opacity: 0;
      transition: opacity .45s ease;
    }

    .mana-v962-player[data-pose="start"]
    .mana-v962-start {
      opacity: 1;
    }

    .mana-v962-player[data-pose="finish"]
    .mana-v962-finish {
      opacity: 1;
    }

    .mana-v962-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      z-index: 3;
      padding: 9px 15px;
      background: #181408;
      color: #f6ce54;
      border: 1px solid #806723;
      border-radius: 25px;
      font-size: 12px;
      font-weight: 900;
    }

    .mana-v962-progress {
      position: absolute;
      bottom: 10px;
      left: 15px;
      right: 15px;
      height: 4px;
      z-index: 3;
      background: #28231a;
      border-radius: 10px;
      overflow: hidden;
    }

    .mana-v962-progress span {
      display: block;
      width: 0%;
      height: 100%;
      background: #e5ba39;
    }

    .mana-v962-player.playing
    .mana-v962-progress span {
      animation: mana962Progress 3.4s linear infinite;
    }

    @keyframes mana962Progress {
      from { width: 0%; }
      to { width: 100%; }
    }

    .mana-v962-controls {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      padding: 12px;
      background: #0d0b07;
    }

    .mana-v962-controls button {
      min-height: 48px;
      background: #1d180b;
      color: #f6ce54;
      border: 1px solid #806723;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 900;
      cursor: pointer;
    }

    .mana-v962-cue {
      grid-column: 1 / -1;
      text-align: center;
      color: #ccc;
      font-size: 12px;
      line-height: 1.5;
      padding: 4px;
    }

    @media (max-width: 600px) {
      .mana-v962-stage {
        height: 390px;
      }

      .mana-v962-controls {
        gap: 8px;
        padding: 10px;
      }

      .mana-v962-controls button {
        min-height: 46px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .mana-v962-stage img {
        transition: none;
      }
    }

  `;

  /* =========================================
     STATE
     ========================================= */

  const cache = new Map();

  let currentPlayer = null;
  let generation = 0;
  let observedDemo = null;
  let observer = null;

  /* =========================================
     EXERCISE LOOKUP
     ========================================= */

  function findExercise(name) {
    return EXERCISES.find(exercise =>
      exercise.match.test(name || "")
    ) || null;
  }

  /* =========================================
     CROP THE EXISTING ARTWORK
     ========================================= */

  function cropImage(image, region) {
    const width = image.naturalWidth;
    const height = image.naturalHeight;

    const sx = Math.round(width * region.x);
    const sy = Math.round(height * region.y);

    const sw = Math.round(width * region.w);
    const sh = Math.round(height * region.h);

    const canvas = document.createElement("canvas");

    canvas.width = sw;
    canvas.height = sh;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Canvas unavailable");
    }

    ctx.drawImage(
      image,
      sx,
      sy,
      sw,
      sh,
      0,
      0,
      sw,
      sh
    );

    return canvas.toDataURL("image/png");
  }

  /* =========================================
     LOAD START AND FINISH
     ========================================= */

  function loadFrames(exercise) {
    if (cache.has(exercise.image)) {
      return cache.get(exercise.image);
    }

    const promise = new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        try {
          resolve({
            start: cropImage(image, exercise.start),
            finish: cropImage(image, exercise.finish)
          });
        } catch (error) {
          reject(error);
        }
      };

      image.onerror = () => {
        reject(new Error("Exercise image unavailable"));
      };

      image.src =
        exercise.image + "?v=" + BUILD;
    }).catch(error => {
      cache.delete(exercise.image);
      throw error;
    });

    cache.set(exercise.image, promise);

    return promise;
  }

  /* =========================================
     BUILD PLAYER
     ========================================= */

  function buildPlayer(name, exercise, frames) {
    const player = document.createElement("div");

    player.className = "mana-v962-player";
    player.dataset.exercise = name;
    player.dataset.pose = "start";

    const stage = document.createElement("div");
    stage.className = "mana-v962-stage";

    const start = new Image();
    start.className = "mana-v962-start";
    start.src = frames.start;
    start.alt = name + " starting position";

    const finish = new Image();
    finish.className = "mana-v962-finish";
    finish.src = frames.finish;
    finish.alt = name + " finishing position";

    const badge = document.createElement("div");
    badge.className = "mana-v962-badge";
    badge.textContent = "START";

    const progress = document.createElement("div");
    progress.className = "mana-v962-progress";

    const progressFill = document.createElement("span");
    progress.appendChild(progressFill);

    stage.append(start, finish, badge, progress);

    /* PLAYER BUTTONS */

    const controls = document.createElement("div");
    controls.className = "mana-v962-controls";

    const playBtn = document.createElement("button");
    playBtn.type = "button";
    playBtn.textContent = "▶ PLAY DEMO";

    const replayBtn = document.createElement("button");
    replayBtn.type = "button";
    replayBtn.textContent = "↻ REPLAY";

    const cue = document.createElement("div");
    cue.className = "mana-v962-cue";
    cue.textContent = exercise.cue;

    controls.append(playBtn, replayBtn, cue);
    player.append(stage, controls);

    /* =========================================
       PLAYBACK
       ========================================= */

    let interval = null;
    let timeout = null;
    let replayTimeout = null;
    let playing = false;

    function setPose(value) {
      player.dataset.pose = value;
      badge.textContent = value.toUpperCase();
    }

    function clearTimers() {
      clearInterval(interval);
      clearTimeout(timeout);
      clearTimeout(replayTimeout);

      interval = null;
      timeout = null;
      replayTimeout = null;
    }

    function pause() {
      playing = false;

      clearTimers();

      player.classList.remove("playing");
      playBtn.textContent = "▶ PLAY DEMO";
    }

    function cycle() {
      setPose("start");

      timeout = setTimeout(() => {
        if (playing) {
          setPose("finish");
        }
      }, 1500);
    }

    function play() {
      if (playing) {
        pause();
        return;
      }

      playing = true;

      player.classList.add("playing");
      playBtn.textContent = "❚❚ PAUSE";

      cycle();

      interval = setInterval(cycle, 3400);
    }

    function replay() {
      pause();
      setPose("start");

      replayTimeout = setTimeout(play, 60);
    }

    playBtn.addEventListener("click", play);
    replayBtn.addEventListener("click", replay);

    player.pauseDemo = pause;

    return player;
  }

  /* =========================================
     CONNECT TO EXERCISE POPUP
     ========================================= */

  async function upgrade() {
    const modal = document.getElementById(
      "manaV955DemoModal"
    );

    const demo = document.getElementById(
      "manaV955Demo"
    );

    const title = document.getElementById(
      "manaV955Title"
    );

    if (!modal || !demo || !title) return;
    if (!modal.classList.contains("open")) return;

    const name = title.textContent.trim();
    const exercise = findExercise(name);

    if (!exercise) return;

    const existing = demo.querySelector(
      ".mana-v962-player"
    );

    if (existing?.dataset.exercise === name) {
      return;
    }

    const token = ++generation;

    try {
      const frames = await loadFrames(exercise);

      if (token !== generation) return;
      if (!modal.classList.contains("open")) return;
      if (title.textContent.trim() !== name) return;

      currentPlayer?.pauseDemo?.();

      currentPlayer = buildPlayer(
        name,
        exercise,
        frames
      );

      demo.replaceChildren(currentPlayer);

    } catch (error) {
      console.warn("Mana Demo:", error);
    }
  }

  /* =========================================
     WATCH FOR DEMO OPENING
     ========================================= */

  function observeDemo() {
    const demo = document.getElementById(
      "manaV955Demo"
    );

    if (!demo || demo === observedDemo) return;

    observedDemo = demo;

    observer?.disconnect();

    observer = new MutationObserver(() => {
      if (!demo.querySelector(".mana-v962-player")) {
        setTimeout(upgrade, 100);
      }
    });

    observer.observe(demo, {
      childList: true
    });
  }

  /* =========================================
     INITIALISE
     ========================================= */

  function init() {
    document.getElementById(STYLE_ID)?.remove();

    const style = document.createElement("style");

    style.id = STYLE_ID;
    style.textContent = CSS;

    document.head.appendChild(style);

    observeDemo();

    document.addEventListener("click", event => {
      if (
        event.target.closest(
          ".mana-v955-demo-button,.mana-v957-demo-button"
        )
      ) {
        observeDemo();

        setTimeout(upgrade, 150);
        setTimeout(upgrade, 500);
      }

      if (
        event.target.closest("#manaV955Close") ||
        event.target.id === "manaV955DemoModal"
      ) {
        generation++;
        currentPlayer?.pauseDemo?.();
      }
    });

    window.MANA_DEMO_EXTENSION_BUILD = BUILD;
    window.refreshManaUniversalDemo = upgrade;
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
