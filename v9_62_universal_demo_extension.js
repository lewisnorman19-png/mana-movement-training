/* =========================================
   MANA MOVEMENT TRAINING v9.62.1
   UNIVERSAL DEMO PLAYER — VISUAL POLISH

   - Bench Press visual crop fixed
   - Shoulder Press visual crop fixed
   - Removes unwanted anatomy panel
   - Keeps Lateral Raise v9.60 untouched
   - Play / Pause / Replay
   - No new images required
   - No workout / Fuel / Supabase changes
   ========================================= */

(() => {
  "use strict";

  const BUILD = "96210";
  const STYLE_ID = "mana-v962-styles";

  const EXERCISES = [

    {
      match:
        /bench\s*press/i,

      image:
        "assets/exercises/bench-press-demo.png",

      cue:
        "Lower under control to the chest, then press upward.",

      crop: {
        start: {
          x: 0,
          y: 0.10,
          w: 0.50,
          h: 0.82
        },

        finish: {
          x: 0.50,
          y: 0.10,
          w: 0.50,
          h: 0.82
        }
      }
    },

    {
      match:
        /shoulder\s*press|overhead\s*press|military\s*press|arnold\s*press/i,

      image:
        "assets/exercises/shoulder-press-demo.png",

      cue:
        "Press overhead under control. Keep the ribs down and avoid leaning back.",

      /*
        Shoulder image contains:

        ANATOMY | START | FINISH

        So we use the middle third and
        right third only.
      */

      crop: {

        start: {
          x: 0.3333,
          y: 0,
          w: 0.3334,
          h: 1
        },

        finish: {
          x: 0.6667,
          y: 0,
          w: 0.3333,
          h: 1
        }

      }
    }

  ];

  /* =========================================
     STYLES
     ========================================= */

  const CSS = `

    .mana-v962-player {

      margin-top: 12px;

      border:
        1px solid #806723;

      border-radius:
        16px;

      overflow:
        hidden;

      background:
        #080808;

    }


    .mana-v962-stage {

      position:
        relative;

      height:
        470px;

      overflow:
        hidden;

      background:
        radial-gradient(
          circle at 50% 45%,
          #16130d 0%,
          #090909 60%,
          #050505 100%
        );

    }


    .mana-v962-stage img {

      position:
        absolute;

      inset:
        0;

      width:
        100%;

      height:
        100%;

      object-fit:
        contain;

      object-position:
        center;

      opacity:
        0;

      transition:
        opacity .42s ease;

    }


    .mana-v962-player[data-pose="start"]
    .mana-v962-start {

      opacity:
        1;

    }


    .mana-v962-player[data-pose="finish"]
    .mana-v962-finish {

      opacity:
        1;

    }


    .mana-v962-badge {

      position:
        absolute;

      z-index:
        3;

      top:
        12px;

      left:
        12px;

      padding:
        8px 13px;

      border-radius:
        22px;

      background:
        rgba(19,17,9,.94);

      color:
        #f6ce54;

      border:
        1px solid #806723;

      font-size:
        12px;

      font-weight:
        900;

      letter-spacing:
        .05em;

    }


    .mana-v962-progress {

      position:
        absolute;

      z-index:
        3;

      left:
        16px;

      right:
        16px;

      bottom:
        12px;

      height:
        4px;

      border-radius:
        999px;

      overflow:
        hidden;

      background:
        rgba(255,255,255,.12);

    }


    .mana-v962-progress span {

      display:
        block;

      height:
        100%;

      width:
        0%;

      background:
        #e5ba39;

      border-radius:
        inherit;

    }


    .mana-v962-player.playing
    .mana-v962-progress span {

      animation:
        manaV962Progress
        3.4s linear infinite;

    }


    @keyframes manaV962Progress {

      from {
        width: 0%;
      }

      to {
        width: 100%;
      }

    }


    .mana-v962-controls {

      display:
        grid;

      grid-template-columns:
        1fr 1fr;

      gap:
        10px;

      padding:
        12px;

      border-top:
        1px solid #332a10;

      background:
        #0d0b07;

    }


    .mana-v962-controls button {

      min-height:
        48px;

      border-radius:
        12px;

      border:
        1px solid #806723;

      background:
        #1d180b;

      color:
        #f6ce54;

      font-size:
        12px;

      font-weight:
        900;

      cursor:
        pointer;

    }


    .mana-v962-controls button:active {

      transform:
        translateY(1px);

    }


    .mana-v962-cue {

      grid-column:
        1 / -1;

      text-align:
        center;

      color:
        #c7c7c7;

      font-size:
        12px;

      line-height:
        1.5;

      padding:
        1px 6px 2px;

    }


    @media (max-width:600px) {

      .mana-v962-stage {

        height:
          390px;

      }


      .mana-v962-controls {

        gap:
          8px;

        padding:
          10px;

      }


      .mana-v962-controls button {

        min-height:
          46px;

        font-size:
          11px;

      }

    }

  `;


  /* =========================================
     STATE
     ========================================= */

  const cache =
    new Map();

  let currentPlayer =
    null;

  let generation =
    0;

  let observer =
    null;

  let observedDemo =
    null;


  /* =========================================
     FIND EXERCISE
     ========================================= */

  function findExercise(name) {

    const text =
      String(
        name || ""
      ).trim();

    return (
      EXERCISES.find(
        exercise =>
          exercise.match.test(text)
      ) || null
    );

  }


  /* =========================================
     CROP IMAGE
     ========================================= */

  function cropFrame(
    source,
    region
  ) {

    const width =
      source.naturalWidth;

    const height =
      source.naturalHeight;


    const sx =
      Math.round(
        width * region.x
      );


    const sy =
      Math.round(
        height * region.y
      );


    const cropWidth =
      Math.round(
        width * region.w
      );


    const cropHeight =
      Math.round(
        height * region.h
      );


    const canvas =
      document.createElement(
        "canvas"
      );


    canvas.width =
      cropWidth;


    canvas.height =
      cropHeight;


    const ctx =
      canvas.getContext(
        "2d"
      );


    if (!ctx) {

      throw new Error(
        "Canvas unavailable"
      );

    }


    ctx.drawImage(

      source,

      sx,
      sy,

      cropWidth,
      cropHeight,

      0,
      0,

      cropWidth,
      cropHeight

    );


    return canvas.toDataURL(
      "image/png"
    );

  }


  /* =========================================
     LOAD START + FINISH
     ========================================= */

  function loadFrames(
    exercise
  ) {

    if (
      cache.has(
        exercise.image
      )
    ) {

      return cache.get(
        exercise.image
      );

    }


    const promise =
      new Promise(
        (resolve, reject) => {

          const source =
            new Image();


          source.onload =
            () => {

              try {

                resolve({

                  start:
                    cropFrame(
                      source,
                      exercise.crop.start
                    ),

                  finish:
                    cropFrame(
                      source,
                      exercise.crop.finish
                    )

                });

              } catch (error) {

                reject(
                  error
                );

              }

            };


          source.onerror =
            () => {

              reject(
                new Error(
                  "Exercise image could not load"
                )
              );

            };


          source.src =
            exercise.image +
            "?manaDemo=" +
            BUILD;

        }
      );


    cache.set(
      exercise.image,
      promise
    );


    return promise;

  }


  /* =========================================
     BUILD PLAYER
     ========================================= */

  function buildPlayer(
    name,
    exercise,
    frames
  ) {

    const player =
      document.createElement(
        "div"
      );


    player.className =
      "mana-v962-player";


    player.dataset.exercise =
      name;


    player.dataset.pose =
      "start";


    /* STAGE */

    const stage =
      document.createElement(
        "div"
      );


    stage.className =
      "mana-v962-stage";


    /* START */

    const start =
      new Image();


    start.src =
      frames.start;


    start.alt =
      name +
      " starting position";


    start.className =
      "mana-v962-start";


    /* FINISH */

    const finish =
      new Image();


    finish.src =
      frames.finish;


    finish.alt =
      name +
      " finishing position";


    finish.className =
      "mana-v962-finish";


    /* BADGE */

    const badge =
      document.createElement(
        "div"
      );


    badge.className =
      "mana-v962-badge";


    badge.textContent =
      "START";


    /* PROGRESS */

    const progress =
      document.createElement(
        "div"
      );


    progress.className =
      "mana-v962-progress";


    progress.innerHTML =
      "<span></span>";


    stage.append(

      start,
      finish,
      badge,
      progress

    );


    /* =========================================
       CONTROLS
       ========================================= */

    const controls =
      document.createElement(
        "div"
      );


    controls.className =
      "mana-v962-controls";


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
      "mana-v962-cue";


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


    /* =========================================
       PLAYBACK
       ========================================= */

    let interval =
      null;


    let timeout =
      null;


    let playing =
      false;


    function setPose(
      value
    ) {

      player.dataset.pose =
        value;


      badge.textContent =
        value.toUpperCase();

    }


    function clearTimers() {

      if (
        interval !== null
      ) {

        clearInterval(
          interval
        );

      }


      if (
        timeout !== null
      ) {

        clearTimeout(
          timeout
        );

      }


      interval =
        null;


      timeout =
        null;

    }


    function pause() {

      playing =
        false;


      clearTimers();


      player.classList.remove(
        "playing"
      );


      playButton.textContent =
        "▶ PLAY DEMO";

    }


    function cycle() {

      setPose(
        "start"
      );


      timeout =
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
          1500
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


      player.classList.add(
        "playing"
      );


      playButton.textContent =
        "❚❚ PAUSE";


      cycle();


      interval =
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
        60
      );

    }


    playButton.addEventListener(
      "click",
      play
    );


    replayButton.addEventListener(
      "click",
      replay
    );


    player.pauseDemo =
      pause;


    return player;

  }


  /* =========================================
     UPGRADE OPEN DEMO
     ========================================= */

  async function upgrade() {

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
      !modal.classList.contains(
        "open"
      )
    ) {

      return;

    }


    const name =
      title.textContent.trim();


    const exercise =
      findExercise(
        name
      );


    if (
      !exercise
    ) {

      return;

    }


    const existing =
      demo.querySelector(
        ".mana-v962-player"
      );


    if (
      existing &&
      existing.dataset.exercise ===
        name
    ) {

      return;

    }


    const token =
      ++generation;


    try {

      const frames =
        await loadFrames(
          exercise
        );


      if (
        token !== generation
      ) {

        return;

      }


      if (
        !modal.classList.contains(
          "open"
        )
      ) {

        return;

      }


      if (
        title.textContent.trim() !==
        name
      ) {

        return;

      }


      currentPlayer
        ?.pauseDemo?.();


      currentPlayer =
        buildPlayer(
          name,
          exercise,
          frames
        );


      demo.replaceChildren(
        currentPlayer
      );


    } catch (error) {

      console.warn(
        "Mana Demo Player:",
        error
      );

    }

  }


  /* =========================================
     WATCH MODAL
     ========================================= */

  function observeDemo() {

    const demo =
      document.getElementById(
        "manaV955Demo"
      );


    if (
      !demo ||
      demo ===
        observedDemo
    ) {

      return;

    }


    observedDemo =
      demo;


    if (
      observer
    ) {

      observer.disconnect();

    }


    observer =
      new MutationObserver(
        () => {

          if (
            !demo.querySelector(
              ".mana-v962-player"
            )
          ) {

            setTimeout(
              upgrade,
              100
            );

          }

        }
      );


    observer.observe(
      demo,
      {
        childList:
          true
      }
    );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    const previousStyle =
      document.getElementById(
        STYLE_ID
      );


    if (
      previousStyle
    ) {

      previousStyle.remove();

    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      STYLE_ID;


    style.textContent =
      CSS;


    document.head.appendChild(
      style
    );


    observeDemo();


    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            ".mana-v955-demo-button,.mana-v957-demo-button"
          )
        ) {

          observeDemo();


          setTimeout(
            upgrade,
            150
          );


          setTimeout(
            upgrade,
            500
          );

        }


        if (
          event.target.closest(
            "#manaV955Close"
          ) ||
          event.target.id ===
            "manaV955DemoModal"
        ) {

          generation++;


          currentPlayer
            ?.pauseDemo?.();

        }

      }
    );


    window.MANA_DEMO_EXTENSION_BUILD =
      BUILD;


    window.refreshManaUniversalDemo =
      upgrade;

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once:
          true
      }
    );

  } else {

    init();

  }

})();
