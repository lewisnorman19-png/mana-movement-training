
/* MANA Movement v9.62
   Bench Press + Shoulder Press Demo Extension

   Uses existing premium exercise images.
   Leaves working Lateral Raise player untouched.
   No Fuel, logging or Supabase changes.
*/

(() => {
  "use strict";

  const BUILD = "96200";
  const STYLE_ID = "mana-v962-styles";

  const EXERCISES = [
    {
      match: /bench\s*press/i,
      image: "assets/exercises/bench-press-demo.png",
      cue: "Lower the weight under control, then press upward."
    },
    {
      match:
        /shoulder\s*press|overhead\s*press|military\s*press|arnold\s*press/i,
      image: "assets/exercises/shoulder-press-demo.png",
      cue: "Press overhead under control without leaning backward."
    }
  ];

  const CSS = `
    .mana-v962-player {
      margin-top: 12px;
      border: 1px solid #806723;
      border-radius: 16px;
      overflow: hidden;
      background: #090909;
    }

    .mana-v962-stage {
      height: 420px;
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
      opacity: 0;
      transition: opacity .45s ease;
    }

    .mana-v962-player[data-pose="start"]
    .mana-v962-start,
    .mana-v962-player[data-pose="finish"]
    .mana-v962-finish {
      opacity: 1;
    }

    .mana-v962-badge {
      position: absolute;
      z-index: 2;
      top: 12px;
      left: 12px;
      padding: 8px 13px;
      border-radius: 22px;
      background: #181408;
      color: #f6ce54;
      border: 1px solid #806723;
      font-size: 12px;
      font-weight: 900;
    }

    .mana-v962-controls {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      padding: 12px;
    }

    .mana-v962-controls button {
      min-height: 48px;
      border-radius: 12px;
      border: 1px solid #806723;
      background: #1d180b;
      color: #f6ce54;
      font-weight: 900;
      cursor: pointer;
    }

    .mana-v962-cue {
      grid-column: 1 / -1;
      text-align: center;
      color: #bbb;
      font-size: 12px;
      line-height: 1.5;
    }

    @media (max-width:600px) {
      .mana-v962-stage {
        height: 350px;
      }

      .mana-v962-controls {
        gap: 8px;
        padding: 10px;
      }
    }

    @media (prefers-reduced-motion:reduce) {
      .mana-v962-stage img {
        transition: none;
      }
    }
  `;

  const cache = new Map();
  let currentPlayer = null;
  let generation = 0;

  function findExercise(name) {
    return EXERCISES.find(
      exercise => exercise.match.test(name || "")
    );
  }

  /* Split existing START / FINISH artwork */

  function loadFrames(exercise) {
    if (cache.has(exercise.image)) {
      return cache.get(exercise.image);
    }

    const promise = new Promise((resolve, reject) => {
      const source = new Image();

      source.onload = () => {
        try {
          const width = source.naturalWidth;
          const height = source.naturalHeight;

          const landscape = width >= height;

          const frames = [0, 1].map(index => {
            const canvas =
              document.createElement("canvas");

            const cropWidth =
              landscape ? width / 2 : width;

            const cropHeight =
              landscape ? height : height / 2;

            canvas.width = Math.round(cropWidth);
            canvas.height = Math.round(cropHeight);

            const ctx = canvas.getContext("2d");

            if (!ctx) {
              throw new Error("Canvas unavailable");
            }

            ctx.drawImage(
              source,
              landscape ? cropWidth * index : 0,
              landscape ? 0 : cropHeight * index,
              cropWidth,
              cropHeight,
              0,
              0,
              canvas.width,
              canvas.height
            );

            return canvas.toDataURL("image/png");
          });

          resolve(frames);
        } catch (error) {
          reject(error);
        }
      };

      source.onerror = () => {
        reject(new Error("Exercise image unavailable"));
      };

      source.src = exercise.image;
    }).catch(error => {
      cache.delete(exercise.image);
      throw error;
    });

    cache.set(exercise.image, promise);
    return promise;
  }

  /* Build player using existing artwork */

  function buildPlayer(name, exercise, frames) {
    const player = document.createElement("div");
    player.className = "mana-v962-player";
    player.dataset.exercise = name;
    player.dataset.pose = "start";

    const stage = document.createElement("div");
    stage.className = "mana-v962-stage";

    const start = new Image();
    start.src = frames[0];
    start.alt = "Exercise starting position";
    start.className = "mana-v962-start";

    const finish = new Image();
    finish.src = frames[1];
    finish.alt = "Exercise finishing position";
    finish.className = "mana-v962-finish";

    const badge = document.createElement("div");
    badge.className = "mana-v962-badge";
    badge.textContent = "START";

    stage.append(start, finish, badge);

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

    let interval = null;
    let timeout = null;
    let playing = false;

    function setPose(value) {
      player.dataset.pose = value;
      badge.textContent = value.toUpperCase();
    }

    function pause() {
      playing = false;

      clearInterval(interval);
      clearTimeout(timeout);

      interval = null;
      timeout = null;

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
      playBtn.textContent = "❚❚ PAUSE";

      cycle();
      interval = setInterval(cycle, 3400);
    }

    playBtn.addEventListener("click", play);

    replayBtn.addEventListener("click", () => {
      pause();
      play();
    });

    player.pauseDemo = pause;
    return player;
  }

  /* Connect to existing exercise popup */

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

    if (!modal?.classList.contains("open")) return;
    if (!demo || !title) return;

    const name = title.textContent.trim();
    const exercise = findExercise(name);

    if (!exercise) return;

    const installed = demo.querySelector(
      ".mana-v962-player"
    );

    if (installed?.dataset.exercise === name) return;

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
      console.warn("Mana Demo Player:", error);
    }
  }

  /* Initialise */

  function init() {
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = CSS;
      document.head.append(style);
    }

    const demo = document.getElementById(
      "manaV955Demo"
    );

    if (demo) {
      const observer = new MutationObserver(() => {
        if (!demo.querySelector(".mana-v962-player")) {
          setTimeout(upgrade, 90);
        }
      });

      observer.observe(demo, { childList: true });
    }

    document.addEventListener("click", event => {
      if (
        event.target.closest(
          ".mana-v955-demo-button,.mana-v957-demo-button"
        )
      ) {
        setTimeout(upgrade, 150);
        setTimeout(upgrade, 550);
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
