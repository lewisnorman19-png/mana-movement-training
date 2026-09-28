
/* =========================================
   MANA MOVEMENT TRAINING v9.60
   ANIMATED EXERCISE DEMO PLAYER

   - DB Lateral Raise
   - Play / Pause / Replay
   - START to FINISH demonstration
   - Automatic looping
   - Premium black and gold design
   - Uses existing exercise artwork
   - No workout logging changes
   - No Fuel changes
   - No Supabase changes
   ========================================= */

(() => {
  "use strict";

  const BUILD = "96000";

  const STYLE_ID =
    "mana-v960-demo-player-style";

  const DEMOS = [
    {
      match:
        /lateral\s*raise|side\s*raise|side\s*lateral/i,

      image:
        "assets/exercises/lateral-raise-demo.png",

      target:
        "Shoulders (Lateral Deltoids)",

      startLabel:
        "START",

      finishLabel:
        "FINISH",

      cue:
        "Raise under control to shoulder height, then lower slowly."
    }
  ];

  /* =========================================
     EXERCISE LOOKUP
     ========================================= */

  function getConfig(name) {
    const text =
      String(name || "").trim();

    return (
      DEMOS.find(item =>
        item.match.test(text)
      ) || null
    );
  }

  /* =========================================
     PLAYER STYLING
     ========================================= */

  function injectStyles() {
    if (
      document.getElementById(STYLE_ID)
    ) {
      return;
    }

    const style =
      document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `

      .mana-v960-player {
        margin-top: 16px;
        border: 1px solid #6f5b20;
        border-radius: 18px;
        overflow: hidden;
        background: #080808;
      }

      .mana-v960-stage {
        position: relative;
        width: 100%;
        height: min(58vw, 430px);
        min-height: 300px;
        background: #070707;
        overflow: hidden;
      }

      .mana-v960-frame {
        position: absolute;
        inset: 0;
        background-repeat: no-repeat;
        background-size: 200% 100%;
        opacity: 0;
        transform: scale(1.015);

        transition:
          opacity .38s ease,
          transform .7s ease;
      }

      .mana-v960-frame.start {
        background-position:
          left center;

        opacity: 1;
      }

      .mana-v960-frame.finish {
        background-position:
          right center;
      }

      .mana-v960-player[data-pose="finish"]
      .mana-v960-frame.start {
        opacity: 0;
        transform: scale(1);
      }

      .mana-v960-player[data-pose="finish"]
      .mana-v960-frame.finish {
        opacity: 1;
        transform: scale(1.025);
      }

      .mana-v960-player[data-pose="start"]
      .mana-v960-frame.start {
        opacity: 1;
      }

      .mana-v960-player[data-pose="start"]
      .mana-v960-frame.finish {
        opacity: 0;
      }

      .mana-v960-pose-badge {
        position: absolute;
        left: 14px;
        top: 14px;
        z-index: 3;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(5,5,5,.88);
        border: 1px solid #8c7228;
        color: #f5d66e;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: .08em;
      }

      .mana-v960-progress {
        position: absolute;
        left: 16px;
        right: 16px;
        bottom: 14px;
        height: 5px;
        z-index: 3;
        overflow: hidden;
        border-radius: 999px;
        background: rgba(255,255,255,.12);
      }

      .mana-v960-progress > span {
        display: block;
        height: 100%;
        width: 0%;
        border-radius: inherit;
        background: #e6b936;
      }

      .mana-v960-player.playing
      .mana-v960-progress > span {
        animation:
          manaV960Progress
          3.2s linear infinite;
      }

      @keyframes manaV960Progress {
        0% {
          width: 0%;
        }

        50% {
          width: 50%;
        }

        100% {
          width: 100%;
        }
      }

      .mana-v960-controls {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        padding: 12px;
        border-top: 1px solid #312810;
        background: #0d0b07;
      }

      .mana-v960-btn {
        min-height: 48px;
        border-radius: 13px;
        border: 1px solid #7f6724;
        background: #1c1608;
        color: #f4d367;
        font-size: 12px;
        font-weight: 900;
        letter-spacing: .04em;
        cursor: pointer;
      }

      .mana-v960-btn:active {
        transform: translateY(1px);
      }

      .mana-v960-cue {
        grid-column: 1 / -1;
        padding: 2px 4px 3px;
        color: #bbb;
        font-size: 12px;
        line-height: 1.45;
        text-align: center;
      }

      @media (max-width: 600px) {

        .mana-v960-stage {
          height: 390px;
          min-height: 340px;
        }

        .mana-v960-controls {
          gap: 8px;
          padding: 10px;
        }

        .mana-v960-btn {
          min-height: 46px;
          font-size: 11px;
        }

      }

    `;

    document.head.appendChild(style);
  }

  /* =========================================
     BUILD EXERCISE PLAYER
     ========================================= */

  function buildPlayer(name, config) {

    const player =
      document.createElement("div");

    player.className =
      "mana-v960-player";

    player.dataset.pose =
      "start";

    player.dataset.exercise =
      name;

    const stage =
      document.createElement("div");

    stage.className =
      "mana-v960-stage";

    /* START POSITION */

    const startFrame =
      document.createElement("div");

    startFrame.className =
      "mana-v960-frame start";

    startFrame.style.backgroundImage =
      `url("${config.image}")`;

    /* FINISH POSITION */

    const finishFrame =
      document.createElement("div");

    finishFrame.className =
      "mana-v960-frame finish";

    finishFrame.style.backgroundImage =
      `url("${config.image}")`;

    /* POSITION LABEL */

    const badge =
      document.createElement("div");

    badge.className =
      "mana-v960-pose-badge";

    badge.textContent =
      config.startLabel;

    /* PROGRESS BAR */

    const progress =
      document.createElement("div");

    progress.className =
      "mana-v960-progress";

    const progressFill =
      document.createElement("span");

    progress.appendChild(
      progressFill
    );

    stage.append(
      startFrame,
      finishFrame,
      badge,
      progress
    );

    /* =========================================
       PLAYER CONTROLS
       ========================================= */

    const controls =
      document.createElement("div");

    controls.className =
      "mana-v960-controls";

    /* PLAY / PAUSE */

    const playBtn =
      document.createElement("button");

    playBtn.type =
      "button";

    playBtn.className =
      "mana-v960-btn";

    playBtn.textContent =
      "▶ PLAY DEMO";

    /* REPLAY */

    const replayBtn =
      document.createElement("button");

    replayBtn.type =
      "button";

    replayBtn.className =
      "mana-v960-btn";

    replayBtn.textContent =
      "↻ REPLAY";

    /* COACHING CUE */

    const cue =
      document.createElement("div");

    cue.className =
      "mana-v960-cue";

    cue.textContent =
      config.cue;

    controls.append(
      playBtn,
      replayBtn,
      cue
    );

    player.append(
      stage,
      controls
    );

    /* =========================================
       PLAYBACK ENGINE
       ========================================= */

    let timer = null;
    let phaseTimer = null;
    let playing = false;

    function renderPose(nextPose) {
      player.dataset.pose =
        nextPose;

      badge.textContent =
        nextPose === "start"
          ? config.startLabel
          : config.finishLabel;
    }

    function clearTimers() {
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
      }

      if (phaseTimer !== null) {
        clearTimeout(phaseTimer);
        phaseTimer = null;
      }
    }

    /* PAUSE */

    function pause() {
      playing = false;

      clearTimers();

      player.classList.remove(
        "playing"
      );

      playBtn.textContent =
        "▶ PLAY DEMO";
    }

    /* PLAY */

    function play() {

      if (playing) {
        pause();
        return;
      }

      clearTimers();

      playing = true;

      player.classList.add(
        "playing"
      );

      playBtn.textContent =
        "❚❚ PAUSE";

      function runCycle() {
        renderPose("start");

        phaseTimer = setTimeout(() => {
          if (playing) {
            renderPose("finish");
          }
        }, 1450);
      }

      runCycle();

      timer = setInterval(
        runCycle,
        3200
      );
    }

    /* REPLAY */

    function replay() {
      pause();

      renderPose("start");

      play();
    }

    playBtn.addEventListener(
      "click",
      play
    );

    replayBtn.addEventListener(
      "click",
      replay
    );

    player._manaV960Pause =
      pause;

    return player;
  }

  /* =========================================
     UPGRADE EXISTING DEMO MODAL
     ========================================= */

  function upgradeOpenDemo() {

    const modal =
      document.getElementById(
        "manaV955DemoModal"
      );

    const demo =
      document.getElementById(
        "manaV955Demo"
      );

    const title =
      document.getElementById(
        "manaV955Title"
      );

    if (
      !modal ||
      !demo ||
      !title
    ) {
      return;
    }

    if (
      !modal.classList.contains("open")
    ) {
      return;
    }

    const name =
      title.textContent.trim();

    const config =
      getConfig(name);

    if (!config) {
      return;
    }

    const existingPlayer =
      demo.querySelector(
        ".mana-v960-player"
      );

    if (
      existingPlayer &&
      existingPlayer.dataset.exercise === name
    ) {
      return;
    }

    const existingImage =
      demo.querySelector("img");

    if (!existingImage) {
      return;
    }

    if (existingPlayer) {
      existingPlayer._manaV960Pause?.();
    }

    const player =
      buildPlayer(
        name,
        config
      );

    demo.replaceChildren(
      player
    );
  }

  /* =========================================
     DETECT DEMO CHANGES
     ========================================= */

  function observeDemo() {

    const demo =
      document.getElementById(
        "manaV955Demo"
      );

    if (!demo) {
      return;
    }

    if (
      demo.dataset.manaV960Observed === "1"
    ) {
      return;
    }

    demo.dataset.manaV960Observed =
      "1";

    const observer =
      new MutationObserver(() => {

        const player =
          demo.querySelector(
            ".mana-v960-player"
          );

        if (player) {
          return;
        }

        setTimeout(
          upgradeOpenDemo,
          50
        );

      });

    observer.observe(
      demo,
      {
        childList: true,
        subtree: false
      }
    );
  }

  /* =========================================
     CONNECT DEMO BUTTONS
     ========================================= */

  function bindOpenButtons() {

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            ".mana-v955-demo-button"
          ) ||
          event.target.closest(
            ".mana-v957-demo-button"
          )
        ) {

          setTimeout(() => {
            observeDemo();
            upgradeOpenDemo();
          }, 120);

          setTimeout(
            upgradeOpenDemo,
            350
          );

        }
      }
    );

    /* STOP ON CLOSE */

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "#manaV955Close"
          ) ||
          event.target.id ===
            "manaV955DemoModal"
        ) {

          document.querySelector(
            ".mana-v960-player"
          )?._manaV960Pause?.();

        }

      }
    );

  }

  /* =========================================
     INITIALISATION
     ========================================= */

  function init() {

    injectStyles();

    observeDemo();

    bindOpenButtons();

    window.MANA_ANIMATED_DEMO_PLAYER_BUILD =
      BUILD;

    window.refreshManaAnimatedDemoPlayer =
      upgradeOpenDemo;

  }

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once: true
      }
    );

  } else {

    init();

  }

})();
