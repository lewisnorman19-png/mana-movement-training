
/* MANA MOVEMENT TRAINING — v9.63.0
   Batch 1 premium exercise demo handler.
   Works alongside v9.60 and v9.62.
   Leaves existing guides untouched if artwork is missing.
*/
(() => {
  "use strict";

  const BUILD = "96300";
  const ROOT = "assets/exercises/";

  const SETTINGS = [
    ["Back Squat", /^back squat$/i, "back-squat", "Quadriceps + Glutes", "Brace your trunk. Sit between your hips and stand tall."],
    ["Front Squat", /^front squat$/i, "front-squat", "Quadriceps + Glutes", "Keep elbows up, torso upright and knees tracking over toes."],
    ["Romanian Deadlift", /^romanian deadlift$/i, "romanian-deadlift", "Hamstrings + Glutes", "Hinge at your hips with a neutral back; stand tall."],
    ["Deadlift", /^deadlift$/i, "deadlift", "Glutes + Hamstrings + Back", "Brace first. Keep the load close and push the floor away."],
    ["Seated Cable Row", /^seated cable row$/i, "seated-cable-row", "Back + Lats", "Stay tall and draw your elbows back without swinging."],
    ["Chest Supported Row", /^chest supported row$/i, "chest-supported-row", "Upper Back + Lats", "Keep your chest against the pad; pull elbows toward your sides."],
    ["Lat Pulldown", /^lat pulldown$/i, "lat-pulldown", "Latissimus Dorsi + Upper Back", "Pull elbows down while keeping your chest lifted."],
    ["Leg Press", /^leg press$/i, "leg-press", "Quadriceps + Glutes", "Keep your hips on the pad and avoid locking your knees."],
    ["Hip Thrust", /^hip thrust$/i, "hip-thrust", "Glutes", "Drive through your feet and finish with your ribs down."],
    ["Walking Lunge", /^walking lunge$/i, "walking-lunge", "Quadriceps + Glutes", "Take controlled steps and keep your front knee aligned."]
  ];

  const entries = SETTINGS.map(([name, match, slug, target, cue]) => ({
    name, match, slug, target, cue,
    muscle: ROOT + slug + "-muscles.png",
    demo: ROOT + slug + "-demo.png"
  }));

  const imageCache = new Map();
  let current = null;
  let requestId = 0;

  function lookup(name) {
    return entries.find(
      e => e.match.test(String(name || "").trim())
    ) || null;
  }

  function preload(url) {
    if (imageCache.has(url)) return imageCache.get(url);

    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Missing artwork: " + url));
      img.src = url;
    }).catch(err => {
      imageCache.delete(url);
      throw err;
    });

    imageCache.set(url, promise);
    return promise;
  }

  function splitDemo(source, side) {
    const w = source.naturalWidth;
    const h = source.naturalHeight;

    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(w / 2);
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");

    ctx.drawImage(
      source,
      side * canvas.width, 0,
      canvas.width, h,
      0, 0,
      canvas.width, h
    );

    return canvas.toDataURL("image/png");
  }

  function installStyle() {
    if (document.getElementById("mana-v963-style")) return;

    const style = document.createElement("style");
    style.id = "mana-v963-style";

    style.textContent = `
      .mana-v963-muscle {
        display: grid;
        grid-template-columns: minmax(95px, 35%) 1fr;
        gap: 12px;
        align-items: center;
        background: #110f0a;
        border: 1px solid #57471d;
        border-radius: 14px;
        padding: 10px;
        margin: 12px 0;
      }

      .mana-v963-muscle img {
        display: block;
        width: 100%;
        height: 130px;
        object-fit: contain;
        background: #090909;
        border-radius: 10px;
      }

      .mana-v963-muscle span {
        display: block;
        font-size: 10px;
        letter-spacing: .08em;
        color: #aaa;
        font-weight: 800;
      }

      .mana-v963-muscle strong {
        display: block;
        color: #f3d875;
        font-size: 16px;
        margin-top: 6px;
      }

      .mana-v963-player {
        border: 1px solid #806723;
        border-radius: 16px;
        overflow: hidden;
        background: #090909;
        margin-top: 12px;
      }

      .mana-v963-stage {
        height: min(80vw, 460px);
        min-height: 300px;
        position: relative;
        background: #080808;
      }

      .mana-v963-stage img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        opacity: 0;
        transition: opacity .4s ease;
      }

      .mana-v963-player[data-pose="start"] .mana-v963-start,
      .mana-v963-player[data-pose="finish"] .mana-v963-finish {
        opacity: 1;
      }

      .mana-v963-badge {
        position: absolute;
        left: 12px;
        top: 12px;
        color: #f6ce54;
        background: #181408;
        border: 1px solid #806723;
        border-radius: 30px;
        padding: 8px 13px;
        font-weight: 900;
        font-size: 12px;
      }

      .mana-v963-controls {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        padding: 12px;
      }

      .mana-v963-controls button {
        min-height: 48px;
        color: #f6ce54;
        background: #1d180b;
        border: 1px solid #806723;
        border-radius: 12px;
        font-weight: 900;
        cursor: pointer;
      }

      .mana-v963-cue {
        grid-column: 1 / -1;
        color: #bbb;
        text-align: center;
        font-size: 12px;
        line-height: 1.5;
      }

      @media (prefers-reduced-motion: reduce) {
        .mana-v963-stage img {
          transition: none;
        }
      }
    `;

    document.head.append(style);
  }

  function makePlayer(name, entry, source) {
    const player = document.createElement("div");
    player.className = "mana-v963-player";
    player.dataset.exercise = name;
    player.dataset.pose = "start";

    const stage = document.createElement("div");
    stage.className = "mana-v963-stage";

    const start = new Image();
    start.src = splitDemo(source, 0);
    start.alt = name + " start";
    start.className = "mana-v963-start";

    const finish = new Image();
    finish.src = splitDemo(source, 1);
    finish.alt = name + " finish";
    finish.className = "mana-v963-finish";

    const badge = document.createElement("div");
    badge.className = "mana-v963-badge";
    badge.textContent = "START";

    stage.append(start, finish, badge);

    const controls = document.createElement("div");
    controls.className = "mana-v963-controls";

    const play = document.createElement("button");
    play.type = "button";
    play.textContent = "▶ PLAY DEMO";

    const replay = document.createElement("button");
    replay.type = "button";
    replay.textContent = "↻ REPLAY";

    const cue = document.createElement("div");
    cue.className = "mana-v963-cue";
    cue.textContent = entry.cue;

    controls.append(play, replay, cue);
    player.append(stage, controls);

    let loop = null;
    let flip = null;
    let running = false;

    function pose(value) {
      player.dataset.pose = value;
      badge.textContent = value.toUpperCase();
    }

    function pause() {
      running = false;
      clearInterval(loop);
      clearTimeout(flip);
      loop = flip = null;
      play.textContent = "▶ PLAY DEMO";
    }

    function cycle() {
      pose("start");

      flip = setTimeout(() => {
        if (running) pose("finish");
      }, 1550);
    }

    function toggle() {
      if (running) return pause();

      running = true;
      play.textContent = "❚❚ PAUSE";

      cycle();
      loop = setInterval(cycle, 3400);
    }

    play.addEventListener("click", toggle);

    replay.addEventListener("click", () => {
      pause();
      pose("start");
      toggle();
    });

    player.pauseDemo = pause;
    return player;
  }

  async function enhanceCard(card) {
    const name =
      card.dataset.exerciseName ||
      card.querySelector(".mana-v64-name")?.textContent?.trim();

    const entry = lookup(name);

    if (!entry || card.querySelector(".mana-v963-muscle")) {
      return;
    }

    try {
      const [muscle] = await Promise.all([
        preload(entry.muscle),
        preload(entry.demo)
      ]);

      if (!card.isConnected ||
          card.querySelector(".mana-v963-muscle")) {
        return;
      }

      const title = card.querySelector(".mana-v64-name");
      if (!title) return;

      const block = document.createElement("div");
      block.className = "mana-v963-muscle";

      const picture = new Image();
      picture.src = muscle.src;
      picture.alt = entry.target + " muscle illustration";

      const copy = document.createElement("div");

      const label = document.createElement("span");
      label.textContent = "PRIMARY TARGET";

      const value = document.createElement("strong");
      value.textContent = entry.target;

      copy.append(label, value);
      block.append(picture, copy);

      title.insertAdjacentElement("afterend", block);

      const old = card.querySelector(".mana-v955-exercise-head");
      if (old) old.style.display = "none";

    } catch (_) {
      // Keep the original guide if assets are missing.
    }
  }

  async function upgradeModal() {
    const modal = document.getElementById(
      "manaV955DemoModal"
    );

    const target = document.getElementById(
      "manaV955Demo"
    );

    const heading = document.getElementById(
      "manaV955Title"
    );

    if (!modal?.classList.contains("open") ||
        !target || !heading) {
      return;
    }

    const name = heading.textContent.trim();
    const entry = lookup(name);

    if (!entry ||
        target.querySelector(".mana-v963-player")
          ?.dataset.exercise === name) {
      return;
    }

    const token = ++requestId;

    try {
      const image = await preload(entry.demo);

      if (token !== requestId ||
          !modal.classList.contains("open") ||
          heading.textContent.trim() !== name) {
        return;
      }

      current?.pauseDemo?.();

      current = makePlayer(name, entry, image);
      target.replaceChildren(current);

      const muscle = document.getElementById(
        "manaV955Muscle"
      );

      const label = document.getElementById(
        "manaV955MuscleLabel"
      );

      if (muscle) {
        const art = new Image();
        art.src = entry.muscle;
        art.alt = entry.target;
        art.className = "mana-v957-modal-muscle-image";

        art.onerror = () => {
          if (art.isConnected) art.remove();
        };

        muscle.replaceChildren(art);
      }

      if (label) label.textContent = entry.target;

    } catch (_) {
      // Keep the existing popup if artwork is missing.
    }
  }

  function refresh() {
    document.querySelectorAll(
      "#manaV64Exercises .mana-v64-card"
    ).forEach(enhanceCard);
  }

  function init() {
    installStyle();
    refresh();

    document.addEventListener("click", event => {
      if (event.target.closest(
        ".mana-v955-demo-button,.mana-v957-demo-button"
      )) {
        setTimeout(upgradeModal, 170);
        setTimeout(upgradeModal, 550);
      }

      if (event.target.closest("#manaV955Close") ||
          event.target.id === "manaV955DemoModal") {
        requestId++;
        current?.pauseDemo?.();
      }

      if (event.target.closest(
        '[data-v83-tab="program"]'
      )) {
        setTimeout(refresh, 200);
      }
    });

    [
      "mana:program-tab-change",
      "mana:strength-synced",
      "mana:workout-progress-change"
    ].forEach(eventName => {
      window.addEventListener(eventName, refresh);
    });

    window.MANA_BATCH1_BUILD = BUILD;
    window.refreshManaBatch1 = refresh;
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
