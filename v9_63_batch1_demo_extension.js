/* =========================================
   MANA MOVEMENT TRAINING v9.63.1
   BATCH 1 PREMIUM EXERCISE DEMOS

   FIX:
   - Detects demo button BEFORE v9.55
     stops click propagation
   - Adds MutationObserver backup
   - Back Squat supported immediately
   - Other Batch 1 exercises activate
     automatically as artwork is added
   - Existing Bench / Shoulder / Lateral
     Raise systems remain untouched
   ========================================= */

(() => {
  "use strict";

  const BUILD = "96310";
  const ROOT = "assets/exercises/";
  const STYLE_ID = "mana-v963-style";

  /* =========================================
     BATCH 1 EXERCISES
     ========================================= */

  const SETTINGS = [

    {
      name: "Back Squat",
      match: /^back squat$/i,
      slug: "back-squat",
      target: "Quadriceps + Glutes",
      cue:
        "Brace your core, keep your chest up and drive through your feet."
    },

    {
      name: "Front Squat",
      match: /^front squat$/i,
      slug: "front-squat",
      target: "Quadriceps + Glutes",
      cue:
        "Keep your elbows high and torso upright throughout the movement."
    },

    {
      name: "Romanian Deadlift",
      match: /^romanian deadlift$/i,
      slug: "romanian-deadlift",
      target: "Hamstrings + Glutes",
      cue:
        "Push your hips back while maintaining a strong neutral spine."
    },

    {
      name: "Deadlift",
      match: /^deadlift$/i,
      slug: "deadlift",
      target: "Glutes + Hamstrings + Back",
      cue:
        "Brace hard, keep the weight close and push the floor away."
    },

    {
      name: "Seated Cable Row",
      match: /^seated cable row$/i,
      slug: "seated-cable-row",
      target: "Back + Lats",
      cue:
        "Stay tall and pull your elbows back without swinging."
    },

    {
      name: "Chest Supported Row",
      match: /^chest supported row$/i,
      slug: "chest-supported-row",
      target: "Upper Back + Lats",
      cue:
        "Keep your chest supported and drive your elbows behind you."
    },

    {
      name: "Lat Pulldown",
      match: /^lat pulldown$/i,
      slug: "lat-pulldown",
      target: "Lats + Upper Back",
      cue:
        "Keep your chest lifted and pull your elbows toward your sides."
    },

    {
      name: "Leg Press",
      match: /^leg press$/i,
      slug: "leg-press",
      target: "Quadriceps + Glutes",
      cue:
        "Control the descent and drive through your whole foot."
    },

    {
      name: "Hip Thrust",
      match: /^hip thrust$/i,
      slug: "hip-thrust",
      target: "Glutes",
      cue:
        "Drive through your heels and finish with your glutes fully contracted."
    },

    {
      name: "Walking Lunge",
      match: /^walking lunge$/i,
      slug: "walking-lunge",
      target: "Quadriceps + Glutes",
      cue:
        "Take controlled steps and keep your knee tracking over your foot."
    }

  ].map(exercise => ({
    ...exercise,

    demo:
      ROOT +
      exercise.slug +
      "-demo.png?v=" +
      BUILD,

    muscle:
      ROOT +
      exercise.slug +
      "-muscles.png?v=" +
      BUILD
  }));


  /* =========================================
     STATE
     ========================================= */

  const imageCache =
    new Map();

  let currentPlayer =
    null;

  let requestToken =
    0;

  let modalObserver =
    null;


  /* =========================================
     LOOKUP
     ========================================= */

  function lookup(rawName) {

    const name =
      String(rawName || "")
        .trim();

    return (
      SETTINGS.find(
        exercise =>
          exercise.match.test(name)
      ) ||
      null
    );
  }


  /* =========================================
     IMAGE LOADING
     ========================================= */

  function preload(url) {

    if (
      imageCache.has(url)
    ) {
      return imageCache.get(url);
    }

    const promise =
      new Promise(
        (resolve, reject) => {

          const img =
            new Image();

          img.onload =
            () => resolve(img);

          img.onerror =
            () =>
              reject(
                new Error(
                  "Artwork not found: " +
                  url
                )
              );

          img.src =
            url;
        }
      )
      .catch(error => {

        imageCache.delete(url);

        throw error;
      });

    imageCache.set(
      url,
      promise
    );

    return promise;
  }


  /* =========================================
     SPLIT START / FINISH IMAGE
     ========================================= */

  function splitDemo(
    source,
    side
  ) {

    const sourceWidth =
      source.naturalWidth;

    const sourceHeight =
      source.naturalHeight;

    const halfWidth =
      Math.floor(
        sourceWidth / 2
      );

    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.width =
      halfWidth;

    canvas.height =
      sourceHeight;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) {
      throw new Error(
        "Canvas unavailable"
      );
    }

    const sx =
      side === 0
        ? 0
        : sourceWidth -
          halfWidth;

    ctx.drawImage(

      source,

      sx,
      0,
      halfWidth,
      sourceHeight,

      0,
      0,
      halfWidth,
      sourceHeight

    );

    return canvas.toDataURL(
      "image/png"
    );
  }


  /* =========================================
     STYLES
     ========================================= */

  function installStyles() {

    document
      .getElementById(
        STYLE_ID
      )
      ?.remove();


    const style =
      document.createElement(
        "style"
      );

    style.id =
      STYLE_ID;

    style.textContent = `

      .mana-v963-muscle-card {

        display:grid;

        grid-template-columns:
          minmax(95px,35%)
          1fr;

        align-items:center;

        gap:12px;

        margin:
          12px
          0;

        padding:10px;

        background:#0b0a08;

        border:
          1px solid
          #66531c;

        border-radius:
          14px;

      }


      .mana-v963-muscle-card img {

        display:block;

        width:100%;

        height:145px;

        object-fit:contain;

        background:#050505;

        border-radius:10px;

      }


      .mana-v963-target-small {

        color:#999;

        font-size:10px;

        font-weight:900;

        letter-spacing:.1em;

      }


      .mana-v963-target-name {

        color:#f5cf57;

        font-size:16px;

        font-weight:900;

        line-height:1.25;

        margin-top:6px;

      }


      .mana-v963-player {

        margin-top:12px;

        overflow:hidden;

        background:#080808;

        border:
          1px solid
          #806723;

        border-radius:16px;

      }


      .mana-v963-stage {

        position:relative;

        height:
          min(
            78vw,
            480px
          );

        min-height:320px;

        overflow:hidden;

        background:#060606;

      }


      .mana-v963-stage img {

        position:absolute;

        inset:0;

        display:block;

        width:100%;

        height:100%;

        object-fit:contain;

        object-position:center;

        opacity:0;

        transition:
          opacity
          .45s ease;

      }


      .mana-v963-player[data-pose="start"]
      .mana-v963-start {

        opacity:1;

      }


      .mana-v963-player[data-pose="finish"]
      .mana-v963-finish {

        opacity:1;

      }


      .mana-v963-badge {

        position:absolute;

        z-index:5;

        top:12px;

        left:12px;

        padding:
          9px
          15px;

        background:#181408;

        color:#f6ce54;

        border:
          1px solid
          #806723;

        border-radius:24px;

        font-size:12px;

        font-weight:900;

      }


      .mana-v963-progress {

        position:absolute;

        z-index:5;

        left:15px;

        right:15px;

        bottom:10px;

        height:4px;

        overflow:hidden;

        background:#292317;

        border-radius:20px;

      }


      .mana-v963-progress span {

        display:block;

        width:0%;

        height:100%;

        background:#e4b934;

      }


      .mana-v963-player.playing
      .mana-v963-progress span {

        animation:
          mana963Progress
          3.4s
          linear
          infinite;

      }


      @keyframes mana963Progress {

        from {
          width:0%;
        }

        to {
          width:100%;
        }

      }


      .mana-v963-controls {

        display:grid;

        grid-template-columns:
          1fr
          1fr;

        gap:10px;

        padding:12px;

        background:#0d0b07;

      }


      .mana-v963-controls button {

        min-height:48px;

        background:#1b170b;

        color:#f6ce54;

        border:
          1px solid
          #806723;

        border-radius:12px;

        font-size:12px;

        font-weight:900;

        cursor:pointer;

      }


      .mana-v963-cue {

        grid-column:
          1 / -1;

        padding:
          4px
          8px
          5px;

        text-align:center;

        color:#c7c7c7;

        font-size:12px;

        line-height:1.5;

      }


      @media (
        max-width:600px
      ) {

        .mana-v963-stage {

          height:390px;

          min-height:300px;

        }

      }


      @media (
        prefers-reduced-motion:
        reduce
      ) {

        .mana-v963-stage img {

          transition:none;

        }

      }

    `;

    document.head
      .appendChild(style);
  }


  /* =========================================
     DEMO PLAYER
     ========================================= */

  function createPlayer(
    name,
    exercise,
    source
  ) {

    const player =
      document.createElement(
        "div"
      );

    player.className =
      "mana-v963-player";

    player.dataset.exercise =
      name;

    player.dataset.pose =
      "start";


    const stage =
      document.createElement(
        "div"
      );

    stage.className =
      "mana-v963-stage";


    const start =
      new Image();

    start.className =
      "mana-v963-start";

    start.src =
      splitDemo(
        source,
        0
      );

    start.alt =
      name +
      " starting position";


    const finish =
      new Image();

    finish.className =
      "mana-v963-finish";

    finish.src =
      splitDemo(
        source,
        1
      );

    finish.alt =
      name +
      " finishing position";


    const badge =
      document.createElement(
        "div"
      );

    badge.className =
      "mana-v963-badge";

    badge.textContent =
      "START";


    const progress =
      document.createElement(
        "div"
      );

    progress.className =
      "mana-v963-progress";


    const progressFill =
      document.createElement(
        "span"
      );

    progress.appendChild(
      progressFill
    );


    stage.append(
      start,
      finish,
      badge,
      progress
    );


    const controls =
      document.createElement(
        "div"
      );

    controls.className =
      "mana-v963-controls";


    const playButton =
      document.createElement(
        "button"
      );

    playButton.type =
      "button";

    playButton.textContent =
      "▶ PLAY DEMO";


    const replayButton =
      document.createElement(
        "button"
      );

    replayButton.type =
      "button";

    replayButton.textContent =
      "↻ REPLAY";


    const cue =
      document.createElement(
        "div"
      );

    cue.className =
      "mana-v963-cue";

    cue.textContent =
      exercise.cue;


    controls.append(
      playButton,
      replayButton,
      cue
    );


    player.append(
      stage,
      controls
    );


    let playing =
      false;

    let loopTimer =
      null;

    let flipTimer =
      null;


    function clearTimers() {

      clearInterval(
        loopTimer
      );

      clearTimeout(
        flipTimer
      );

      loopTimer =
        null;

      flipTimer =
        null;
    }


    function setPose(pose) {

      player.dataset.pose =
        pose;

      badge.textContent =
        pose.toUpperCase();
    }


    function pause() {

      playing =
        false;

      clearTimers();

      player.classList
        .remove(
          "playing"
        );

      playButton.textContent =
        "▶ PLAY DEMO";
    }


    function cycle() {

      setPose(
        "start"
      );

      flipTimer =
        setTimeout(
          () => {

            if (
              playing
            ) {

              setPose(
                "finish"
              );

            }

          },
          1550
        );
    }


    function play() {

      if (
        playing
      ) {

        pause();

        return;
      }

      playing =
        true;

      player.classList
        .add(
          "playing"
        );

      playButton.textContent =
        "❚❚ PAUSE";

      cycle();

      loopTimer =
        setInterval(
          cycle,
          3400
        );
    }


    function replay() {

      pause();

      setPose(
        "start"
      );

      setTimeout(
        play,
        70
      );
    }


    playButton
      .addEventListener(
        "click",
        play
      );


    replayButton
      .addEventListener(
        "click",
        replay
      );


    player.pauseDemo =
      pause;


    return player;
  }


  /* =========================================
     MODAL UPGRADE
     ========================================= */

  async function upgradeModal() {

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
      !modal.classList
        .contains(
          "open"
        )
    ) {
      return;
    }


    const name =
      title.textContent
        .trim();


    const exercise =
      lookup(name);


    if (
      !exercise
    ) {
      return;
    }


    const existing =
      demo.querySelector(
        ".mana-v963-player"
      );


    if (
      existing &&
      existing.dataset
        .exercise === name
    ) {
      return;
    }


    const token =
      ++requestToken;


    try {

      const [
        demoImage,
        muscleImage
      ] =
        await Promise.all([

          preload(
            exercise.demo
          ),

          preload(
            exercise.muscle
          )

        ]);


      if (
        token !==
        requestToken
      ) {
        return;
      }


      if (
        !modal.classList
          .contains(
            "open"
          )
      ) {
        return;
      }


      if (
        title.textContent
          .trim() !== name
      ) {
        return;
      }


      currentPlayer
        ?.pauseDemo?.();


      currentPlayer =
        createPlayer(
          name,
          exercise,
          demoImage
        );


      demo.replaceChildren(
        currentPlayer
      );


      const muscleTarget =
        document.getElementById(
          "manaV955Muscle"
        );


      const muscleLabel =
        document.getElementById(
          "manaV955MuscleLabel"
        );


      if (
        muscleTarget
      ) {

        const art =
          new Image();

        art.src =
          muscleImage.src;

        art.alt =
          exercise.target +
          " muscle illustration";

        art.className =
          "mana-v957-modal-muscle-image";

        muscleTarget
          .replaceChildren(
            art
          );
      }


      if (
        muscleLabel
      ) {

        muscleLabel
          .textContent =
          exercise.target;

      }


      console.log(
        "[Mana v9.63.1]",
        name,
        "premium demo loaded"
      );

    } catch(error) {

      console.warn(
        "[Mana v9.63.1]",
        error
      );

    }
  }


  /* =========================================
     WORKOUT CARD MUSCLE ART
     ========================================= */

  async function enhanceCard(
    card
  ) {

    const name =
      card.dataset
        .exerciseName ||
      card.querySelector(
        ".mana-v64-name"
      )
      ?.textContent
      ?.trim();


    const exercise =
      lookup(name);


    if (
      !exercise
    ) {
      return;
    }


    if (
      card.querySelector(
        ".mana-v963-muscle-card"
      )
    ) {
      return;
    }


    try {

      const muscleImage =
        await preload(
          exercise.muscle
        );


      if (
        !card.isConnected
      ) {
        return;
      }


      if (
        card.querySelector(
          ".mana-v963-muscle-card"
        )
      ) {
        return;
      }


      const exerciseName =
        card.querySelector(
          ".mana-v64-name"
        );


      if (
        !exerciseName
      ) {
        return;
      }


      const block =
        document.createElement(
          "div"
        );

      block.className =
        "mana-v963-muscle-card";


      const picture =
        new Image();

      picture.src =
        muscleImage.src;

      picture.alt =
        exercise.target;


      const copy =
        document.createElement(
          "div"
        );


      const small =
        document.createElement(
          "div"
        );

      small.className =
        "mana-v963-target-small";

      small.textContent =
        "PRIMARY TARGET";


      const value =
        document.createElement(
          "div"
        );

      value.className =
        "mana-v963-target-name";

      value.textContent =
        exercise.target;


      copy.append(
        small,
        value
      );


      block.append(
        picture,
        copy
      );


      exerciseName
        .insertAdjacentElement(
          "afterend",
          block
        );


      const oldMini =
        card.querySelector(
          ".mana-v955-exercise-head"
        );


      if (
        oldMini
      ) {

        oldMini.style.display =
          "none";

      }

    } catch(error) {

      /*
        Missing image:
        leave existing Mana guide alone.
      */

    }
  }


  function refreshCards() {

    document
      .querySelectorAll(
        "#manaV64Exercises .mana-v64-card"
      )
      .forEach(
        enhanceCard
      );
  }


  /* =========================================
     MODAL OBSERVER
     ========================================= */

  function observeModal() {

    if (
      modalObserver
    ) {

      modalObserver
        .disconnect();

    }


    modalObserver =
      new MutationObserver(
        () => {

          setTimeout(
            upgradeModal,
            80
          );

        }
      );


    modalObserver.observe(
      document.body,
      {
        subtree:true,
        childList:true,
        attributes:true,
        attributeFilter:[
          "class"
        ]
      }
    );
  }


  /* =========================================
     CLICK HANDLER

     IMPORTANT:
     Capture phase = TRUE.

     v9.55 calls stopPropagation(),
     so normal document click listeners
     never receive the Visual Demo click.
     ========================================= */

  function clickHandler(
    event
  ) {

    const demoButton =
      event.target.closest(
        ".mana-v955-demo-button, .mana-v957-demo-button"
      );


    if (
      demoButton
    ) {

      /*
        Run AFTER v9.55 has opened
        and populated its modal.
      */

      setTimeout(
        upgradeModal,
        100
      );

      setTimeout(
        upgradeModal,
        300
      );

      setTimeout(
        upgradeModal,
        650
      );

    }


    if (
      event.target.closest(
        "#manaV955Close"
      ) ||
      event.target.id ===
        "manaV955DemoModal"
    ) {

      requestToken++;

      currentPlayer
        ?.pauseDemo?.();

    }


    if (
      event.target.closest(
        '[data-v83-tab="program"]'
      )
    ) {

      setTimeout(
        refreshCards,
        200
      );

      setTimeout(
        refreshCards,
        600
      );

    }
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    refreshCards();

    observeModal();


    /*
      TRUE = capture phase.

      This is the critical v9.63.1 fix.
    */

    document.addEventListener(
      "click",
      clickHandler,
      true
    );


    [
      "mana:program-tab-change",
      "mana:strength-synced",
      "mana:workout-progress-change"
    ]
    .forEach(
      eventName => {

        window.addEventListener(
          eventName,
          () => {

            setTimeout(
              refreshCards,
              100
            );

          }
        );

      }
    );


    window
      .MANA_BATCH1_BUILD =
      BUILD;


    window
      .refreshManaBatch1 =
      () => {

        refreshCards();

        upgradeModal();

      };


    console.log(
      "[Mana v9.63.1] ready"
    );
  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once:true
      }
    );

  } else {

    init();

  }

})();
