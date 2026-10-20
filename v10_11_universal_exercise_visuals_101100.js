/* =========================================
   MANA MOVEMENT TRAINING v10.11.5
   UNIVERSAL EXERCISE VISUAL + DEMO SYSTEM

   BUILD: 101150

   PURPOSE
   -----------------------------------------
   - One premium muscle illustration system
   - One universal exercise demo player
   - Automatic demo filenames from exercise names
   - Same system for coach + client
   - No separate demo JS files per exercise
   - Fresh asset versioning
   - Retry newly deployed assets once
   - Clean fallback if demo image does not exist

   DEMO FILE FORMAT
   -----------------------------------------
   Exercise:
   Biceps Curl

   Automatically looks for:
   assets/exercises/biceps-curl-demo.png

   Exercise:
   Romanian Deadlift

   Automatically looks for:
   assets/exercises/romanian-deadlift-demo.png

   Each demo PNG should contain:
   START pose on LEFT
   FINISH pose on RIGHT
   ========================================= */

(() => {
  "use strict";


  /* =========================================
     BUILD
     ========================================= */

  const BUILD =
    "101150";


  const STYLE_ID =
    "mana-v10115-universal-exercise-style";


  const ROOT =
    "assets/exercises/";


  let refreshTimer =
    null;


  let refreshing =
    false;


  let observer =
    null;


  let activePlayer =
    null;


  /* =========================================
     MASTER MUSCLE IMAGES
     ========================================= */

  const MUSCLE_ASSETS = {

    chest:
      ROOT +
      "muscle-chest.png",

    back:
      ROOT +
      "muscle-back.png",

    shoulders:
      ROOT +
      "muscle-shoulders.png",

    biceps:
      ROOT +
      "muscle-biceps.png",

    triceps:
      ROOT +
      "muscle-triceps.png",

    core:
      ROOT +
      "muscle-core.png",

    quads:
      ROOT +
      "muscle-quads.png",

    posterior:
      ROOT +
      "muscle-glutes-hamstrings.png",

    calves:
      ROOT +
      "muscle-calves.png",

    fullbody:
      ROOT +
      "muscle-full-body.png"

  };


  /* =========================================
     EXERCISE DATABASE

     Only target muscle + cue live here now.

     Demo file is generated automatically.
     ========================================= */

  const EXERCISES = [

    /* CHEST */

    {
      match:/^bench press$/i,
      muscle:"chest",
      target:"Chest + Triceps",
      cue:
        "Set your shoulders, lower under control and press strongly through the chest."
    },

    {
      match:/incline.*press/i,
      muscle:"chest",
      target:"Upper Chest + Triceps",
      cue:
        "Keep your shoulders set and press smoothly through the upper chest."
    },

    {
      match:/chest press/i,
      muscle:"chest",
      target:"Chest + Triceps",
      cue:
        "Keep your chest lifted and press through a controlled range."
    },

    {
      match:/push[\s-]?up/i,
      muscle:"chest",
      target:"Chest + Triceps + Core",
      cue:
        "Keep your body strong and lower the chest under control."
    },

    {
      match:/fly|pec deck/i,
      muscle:"chest",
      target:"Chest",
      cue:
        "Keep a soft elbow and bring the arms together using the chest."
    },


    /* BACK */

    {
      match:/lat pulldown/i,
      muscle:"back",
      target:"Lats + Upper Back",
      cue:
        "Keep your chest lifted and drive your elbows toward your sides."
    },

    {
      match:/seated.*row/i,
      muscle:"back",
      target:"Mid Back + Lats",
      cue:
        "Stay tall and pull your elbows behind you without swinging."
    },

    {
      match:/chest supported.*row/i,
      muscle:"back",
      target:"Upper Back + Lats",
      cue:
        "Keep the chest supported and drive the elbows behind you."
    },

    {
      match:/dumbbell.*row|single.*arm.*row|one.*arm.*row/i,
      muscle:"back",
      target:"Lats + Mid Back",
      cue:
        "Keep the torso stable and drive the elbow back toward the hip."
    },

    {
      match:/barbell.*row|bent.*row/i,
      muscle:"back",
      target:"Back + Lats",
      cue:
        "Brace your trunk and pull toward the lower ribs."
    },

    {
      match:/pull[\s-]?up|chin[\s-]?up/i,
      muscle:"back",
      target:"Lats + Upper Back + Arms",
      cue:
        "Start from a strong shoulder position and pull the chest upward."
    },


    /* SHOULDERS */

    {
      match:/shoulder press|overhead press|military press|arnold press/i,
      muscle:"shoulders",
      target:"Shoulders + Triceps",
      cue:
        "Brace your core and press overhead with control."
    },

    {
      match:/lateral raise|side raise|side lateral/i,
      muscle:"shoulders",
      target:"Shoulders — Lateral Deltoids",
      cue:
        "Lift under control to shoulder height and avoid swinging."
    },

    {
      match:/front raise/i,
      muscle:"shoulders",
      target:"Front Deltoids",
      cue:
        "Lift smoothly without momentum and lower under control."
    },

    {
      match:/rear delt|reverse fly|face pull/i,
      muscle:"shoulders",
      target:"Rear Delts + Upper Back",
      cue:
        "Keep the shoulders controlled and move through the rear delts."
    },


    /* BICEPS */

    {
      match:/bicep|biceps|curl/i,
      muscle:"biceps",
      target:"Biceps",
      cue:
        "Keep the upper arm stable and curl without swinging."
    },


    /* TRICEPS */

    {
      match:/tricep|triceps|pushdown|pressdown|skull crusher/i,
      muscle:"triceps",
      target:"Triceps",
      cue:
        "Keep the upper arm controlled and extend fully through the elbow."
    },


    /* QUADS */

    {
      match:/^back squat$/i,
      muscle:"quads",
      target:"Quadriceps + Glutes",
      cue:
        "Brace your core, keep your chest strong and drive through your feet."
    },

    {
      match:/front squat/i,
      muscle:"quads",
      target:"Quadriceps + Glutes",
      cue:
        "Keep your elbows high and torso upright."
    },

    {
      match:/goblet squat/i,
      muscle:"quads",
      target:"Quadriceps + Glutes",
      cue:
        "Keep the weight close and sit between the hips."
    },

    {
      match:/leg press/i,
      muscle:"quads",
      target:"Quadriceps + Glutes",
      cue:
        "Control the descent and drive through the whole foot."
    },

    {
      match:/leg extension/i,
      muscle:"quads",
      target:"Quadriceps",
      cue:
        "Extend smoothly and squeeze the quadriceps at the top."
    },

    {
      match:/split squat|bulgarian|lunge|step[\s-]?up/i,
      muscle:"quads",
      target:"Quadriceps + Glutes",
      cue:
        "Stay controlled and keep the knee tracking over the foot."
    },


    /* GLUTES + HAMSTRINGS */

    {
      match:/romanian deadlift|rdl/i,
      muscle:"posterior",
      target:"Hamstrings + Glutes",
      cue:
        "Push the hips back while maintaining a strong neutral spine."
    },

    {
      match:/^deadlift$/i,
      muscle:"posterior",
      target:"Glutes + Hamstrings + Back",
      cue:
        "Brace strongly, keep the weight close and push the floor away."
    },

    {
      match:/hip thrust/i,
      muscle:"posterior",
      target:"Glutes",
      cue:
        "Drive through the heels and finish with a strong glute contraction."
    },

    {
      match:/glute bridge/i,
      muscle:"posterior",
      target:"Glutes",
      cue:
        "Drive the hips upward using the glutes."
    },

    {
      match:/hamstring curl|leg curl/i,
      muscle:"posterior",
      target:"Hamstrings",
      cue:
        "Curl under control and squeeze the hamstrings."
    },


    /* CALVES */

    {
      match:/calf raise|calves|calf/i,
      muscle:"calves",
      target:"Calves",
      cue:
        "Use a full controlled range and pause briefly at the top."
    },


    /* CORE */

    {
      match:/plank/i,
      muscle:"core",
      target:"Core",
      cue:
        "Brace the trunk and keep the hips level."
    },

    {
      match:/dead bug/i,
      muscle:"core",
      target:"Core",
      cue:
        "Keep the lower back controlled while moving opposite arm and leg."
    },

    {
      match:/bird dog/i,
      muscle:"core",
      target:"Core + Stability",
      cue:
        "Keep the hips square and reach long through opposite arm and leg."
    },

    {
      match:/crunch|sit[\s-]?up/i,
      muscle:"core",
      target:"Abdominals",
      cue:
        "Move through the abdominals rather than pulling through the neck."
    },

    {
      match:/russian twist|pallof/i,
      muscle:"core",
      target:"Core + Obliques",
      cue:
        "Keep the trunk controlled through the movement."
    },


    /* FULL BODY */

    {
      match:/burpee|farmer.*carry|farmer.*walk|sled|thruster|clean|snatch/i,
      muscle:"fullbody",
      target:"Full Body",
      cue:
        "Move with control and maintain strong technique."
    }

  ];


  /* =========================================
     DEFAULT
     ========================================= */

  const DEFAULT_EXERCISE = {

    muscle:
      "fullbody",

    target:
      "Full Body",

    cue:
      "Move with control and maintain strong technique."

  };


  /* =========================================
     HELPERS
     ========================================= */

  function $(id) {

    return document.getElementById(
      id
    );

  }


  function normalise(value) {

    return String(
      value ||
      ""
    )
      .replace(
        /\s+/g,
        " "
      )
      .trim();

  }


  function slugify(value) {

    return normalise(
      value
    )
      .toLowerCase()
      .replace(
        /&/g,
        "and"
      )
      .replace(
        /[^a-z0-9]+/g,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        ""
      );

  }


  function demoAssetFromName(
    name
  ) {

    const slug =
      slugify(
        name
      );


    if (!slug) {

      return null;

    }


    return (
      ROOT +
      slug +
      "-demo.png"
    );

  }


  function resolveExercise(
    name
  ) {

    const clean =
      normalise(
        name
      );


    const match =
      EXERCISES.find(
        item =>
          item.match.test(
            clean
          )
      );


    const exercise = {

      ...DEFAULT_EXERCISE,

      ...(match || {}),

      name:
        clean ||
        "Exercise"

    };


    exercise.demo =
      demoAssetFromName(
        exercise.name
      );


    return exercise;

  }


  function muscleAsset(
    exercise
  ) {

    return (
      MUSCLE_ASSETS[
        exercise.muscle
      ] ||
      MUSCLE_ASSETS.fullbody
    );

  }


  function muscleLabel(
    exercise
  ) {

    const labels = {

      chest:
        "CHEST",

      back:
        "BACK",

      shoulders:
        "SHOULDERS",

      biceps:
        "BICEPS",

      triceps:
        "TRICEPS",

      core:
        "CORE",

      quads:
        "QUADS",

      posterior:
        "GLUTES",

      calves:
        "CALVES",

      fullbody:
        "FULL BODY"

    };


    return (
      labels[
        exercise.muscle
      ] ||
      "FULL BODY"
    );

  }


  function versionedAsset(
    path,
    retry = 0
  ) {

    return (
      path +
      "?v=" +
      BUILD +
      "&asset=" +
      retry
    );

  }


  /* =========================================
     STYLES
     ========================================= */

  function installStyles() {

    $(
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

      .m10111-target{
        display:grid;
        grid-template-columns:150px minmax(0,1fr);
        gap:16px;
        align-items:center;
        margin:12px 0 16px;
        padding:12px;
        border:1px solid #51431c;
        border-radius:18px;
        background:
          linear-gradient(
            145deg,
            #100e08,
            #070707
          );
        overflow:hidden;
      }


      .m10111-image{
        position:relative;
        display:grid;
        place-items:center;
        width:150px;
        height:150px;
        overflow:hidden;
        border:1px solid #3b3015;
        border-radius:16px;
        background:
          radial-gradient(
            circle,
            rgba(220,179,59,.18),
            transparent 58%
          ),
          #050505;
        box-shadow:
          0 8px 24px rgba(0,0,0,.28);
      }


      .m10111-image img{
        display:block;
        width:100%;
        height:100%;
        object-fit:cover;
        object-position:center;
        border-radius:15px;
      }


      .m10111-fallback{
        display:none;
        place-items:center;
        width:100%;
        height:100%;
      }


      .m10111-ring{
        display:grid;
        place-items:center;
        width:82px;
        height:82px;
        padding:7px;
        border:1px solid #896e27;
        border-radius:50%;
        background:
          radial-gradient(
            circle,
            rgba(228,185,54,.18),
            transparent 70%
          );
        color:#e6c75e;
        text-align:center;
        font-size:9px;
        line-height:1.15;
        font-weight:950;
        letter-spacing:.04em;
      }


      .m10111-copy{
        min-width:0;
        padding-right:8px;
      }


      .m10111-kicker{
        color:#9a8238;
        font-size:9px;
        font-weight:950;
        letter-spacing:.15em;
        text-transform:uppercase;
      }


      .m10111-target-name{
        display:block;
        margin-top:7px;
        color:#f0cf62;
        font-size:18px;
        line-height:1.2;
        font-weight:950;
      }


      .m10111-note{
        display:block;
        margin-top:7px;
        color:#777;
        font-size:10px;
        line-height:1.4;
      }


      .m10111-demo-button{
        border-color:#6b5720 !important;
        background:#151107 !important;
        color:#f0cf62 !important;
        font-weight:950 !important;
      }


      .m10111-player{
        overflow:hidden;
        margin-top:8px;
        border:1px solid #62501e;
        border-radius:19px;
        background:#070707;
      }


      .m10111-stage{
        position:relative;
        height:430px;
        overflow:hidden;
        background:
          radial-gradient(
            circle,
            rgba(217,178,58,.10),
            transparent 55%
          ),
          #050505;
      }


      .m10111-frame{
        position:absolute;
        inset:0;
        width:100%;
        height:100%;
        object-fit:contain;
        opacity:0;
        transition:opacity .4s ease;
      }


      .m10111-player[data-pose="start"]
      .m10111-frame.start{
        opacity:1;
      }


      .m10111-player[data-pose="finish"]
      .m10111-frame.finish{
        opacity:1;
      }


      .m10111-demo-empty{
        position:absolute;
        inset:0;
        display:grid;
        place-items:center;
        padding:25px;
        text-align:center;
      }


      .m10111-demo-circle{
        display:grid;
        place-items:center;
        width:150px;
        height:150px;
        margin:0 auto 18px;
        border:1px solid #725d21;
        border-radius:50%;
        background:
          radial-gradient(
            circle,
            rgba(229,188,61,.20),
            transparent 70%
          );
        color:#e3c259;
        font-size:45px;
        transition:transform .5s ease;
      }


      .m10111-player[data-pose="finish"]
      .m10111-demo-circle{
        transform:
          translateY(-12px)
          scale(1.05);
      }


      .m10111-demo-empty strong{
        display:block;
        color:#f0cf62;
        font-size:14px;
      }


      .m10111-demo-empty span{
        display:block;
        margin-top:8px;
        color:#777;
        font-size:11px;
        line-height:1.5;
      }


      .m10111-badge{
        position:absolute;
        z-index:5;
        top:14px;
        left:14px;
        padding:8px 13px;
        border:1px solid #756024;
        border-radius:999px;
        background:#121007;
        color:#efcc5f;
        font-size:10px;
        font-weight:950;
      }


      .m10111-controls{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:9px;
        padding:12px;
        border-top:1px solid #221e14;
        background:#0b0a07;
      }


      .m10111-control{
        min-height:46px;
        border:1px solid #66531f;
        border-radius:12px;
        background:#171307;
        color:#f0cf62;
        font-size:11px;
        font-weight:950;
        cursor:pointer;
      }


      .m10111-cue{
        grid-column:1 / -1;
        padding:5px 8px;
        color:#bdbdbd;
        font-size:11px;
        line-height:1.5;
        text-align:center;
      }


      @media(max-width:760px){

        .m10111-target{
          grid-template-columns:
            136px
            minmax(0,1fr);
          gap:14px;
          padding:11px;
        }

        .m10111-image{
          width:136px;
          height:136px;
        }

        .m10111-target-name{
          font-size:16px;
        }

      }


      @media(max-width:600px){

        .m10111-target{
          grid-template-columns:
            125px
            minmax(0,1fr);
          gap:12px;
          padding:10px;
          border-radius:16px;
        }

        .m10111-image{
          width:125px;
          height:125px;
          border-radius:14px;
        }

        .m10111-image img{
          border-radius:13px;
        }

        .m10111-kicker{
          font-size:8px;
          letter-spacing:.12em;
        }

        .m10111-target-name{
          font-size:15px;
        }

        .m10111-note{
          font-size:9px;
          line-height:1.35;
        }

        .m10111-stage{
          height:370px;
        }

      }


      @media(max-width:420px){

        .m10111-target{
          grid-template-columns:
            112px
            minmax(0,1fr);
          gap:10px;
          padding:9px;
        }

        .m10111-image{
          width:112px;
          height:112px;
          border-radius:13px;
        }

        .m10111-image img{
          border-radius:12px;
        }

        .m10111-kicker{
          font-size:7px;
          letter-spacing:.10em;
        }

        .m10111-target-name{
          font-size:14px;
        }

        .m10111-note{
          font-size:8px;
        }

      }


      @media(max-width:360px){

        .m10111-target{
          grid-template-columns:
            104px
            minmax(0,1fr);
          gap:9px;
          padding:8px;
        }

        .m10111-image{
          width:104px;
          height:104px;
        }

        .m10111-target-name{
          font-size:13px;
        }

      }

    `;


    document.head.appendChild(
      style
    );

  }


  /* =========================================
     CARD NAME
     ========================================= */

  function cardName(card) {

    if (!card) {

      return "";

    }


    return normalise(

      card
        .dataset
        .exerciseName ||

      card
        .querySelector(
          ".mana-v64-name"
        )
        ?.textContent ||

      card
        .querySelector(
          "h3"
        )
        ?.textContent ||

      ""

    );

  }


  /* =========================================
     CREATE TARGET VISUAL
     ========================================= */

  function createTarget(
    exercise
  ) {

    const block =
      document.createElement(
        "div"
      );


    block.className =
      "m10111-target";


    block.dataset.manaExercise =
      exercise.name;


    const imageWrap =
      document.createElement(
        "div"
      );


    imageWrap.className =
      "m10111-image";


    const img =
      new Image();


    img.loading =
      "lazy";


    img.alt =
      exercise.target;


    const asset =
      muscleAsset(
        exercise
      );


    let retryCount =
      0;


    const fallback =
      document.createElement(
        "div"
      );


    fallback.className =
      "m10111-fallback";


    const ring =
      document.createElement(
        "div"
      );


    ring.className =
      "m10111-ring";


    ring.textContent =
      muscleLabel(
        exercise
      );


    fallback.appendChild(
      ring
    );


    function showFallback() {

      img.style.display =
        "none";


      fallback.style.display =
        "grid";

    }


    img.onload =
      () => {

        img.style.display =
          "block";


        fallback.style.display =
          "none";

      };


    img.onerror =
      () => {

        if (
          retryCount <
          1
        ) {

          retryCount +=
            1;


          setTimeout(
            () => {

              img.src =
                versionedAsset(
                  asset,
                  retryCount
                );

            },
            1000
          );


          return;

        }


        showFallback();

      };


    img.src =
      versionedAsset(
        asset,
        0
      );


    imageWrap.append(
      img,
      fallback
    );


    const copy =
      document.createElement(
        "div"
      );


    copy.className =
      "m10111-copy";


    const kicker =
      document.createElement(
        "span"
      );


    kicker.className =
      "m10111-kicker";


    kicker.textContent =
      "PRIMARY TARGET";


    const target =
      document.createElement(
        "strong"
      );


    target.className =
      "m10111-target-name";


    target.textContent =
      exercise.target;


    const note =
      document.createElement(
        "span"
      );


    note.className =
      "m10111-note";


    note.textContent =
      "Mana Movement muscle focus";


    copy.append(
      kicker,
      target,
      note
    );


    block.append(
      imageWrap,
      copy
    );


    return block;

  }


  /* =========================================
     REMOVE LEGACY VISUALS
     ========================================= */

  function removeLegacyVisuals(
    card
  ) {

    card
      .querySelectorAll(
        [
          ".mana-v957-target",
          ".mana-v958-target",
          ".mana-v959-target",
          ".mana-v963-muscle-card"
        ].join(",")
      )
      .forEach(
        node =>
          node.remove()
      );


    const oldHead =
      card.querySelector(
        ".mana-v955-exercise-head"
      );


    if (oldHead) {

      oldHead.style.display =
        "none";

    }

  }


  /* =========================================
     UPGRADE ONE CARD
     ========================================= */

  function upgradeCard(
    card
  ) {

    const name =
      cardName(
        card
      );


    if (!name) {

      return;

    }


    const exercise =
      resolveExercise(
        name
      );


    removeLegacyVisuals(
      card
    );


    const existing =
      card.querySelector(
        ".m10111-target"
      );


    if (
      existing &&
      existing.dataset.manaExercise ===
        exercise.name
    ) {

      return;

    }


    existing?.remove();


    const title =
      card.querySelector(
        ".mana-v64-name"
      ) ||

      card.querySelector(
        "h3"
      );


    if (!title) {

      return;

    }


    title.insertAdjacentElement(

      "afterend",

      createTarget(
        exercise
      )

    );


    const button =
      card.querySelector(
        ".mana-v955-demo-button,.mana-v957-demo-button"
      );


    if (button) {

      button.classList.add(
        "m10111-demo-button"
      );


      button.textContent =
        "▶ VIEW EXERCISE DEMO";


      button.dataset.manaExercise =
        exercise.name;

    }


    card.dataset.manaV10111 =
      "1";

  }


  /* =========================================
     CARD REFRESH
     ========================================= */

  function refreshCards() {

    if (refreshing) {

      return;

    }


    refreshing =
      true;


    try {

      document
        .querySelectorAll(
          "#manaV64Exercises .mana-v64-card"
        )
        .forEach(
          upgradeCard
        );

    } finally {

      refreshing =
        false;

    }

  }


  function scheduleRefresh(
    delay = 80
  ) {

    clearTimeout(
      refreshTimer
    );


    refreshTimer =
      setTimeout(
        refreshCards,
        delay
      );

  }


  /* =========================================
     SPLIT DEMO IMAGE

     Demo file:
     LEFT  = START
     RIGHT = FINISH
     ========================================= */

  function splitImage(
    image,
    side
  ) {

    const width =
      image.naturalWidth;


    const height =
      image.naturalHeight;


    const half =
      Math.floor(
        width / 2
      );


    const canvas =
      document.createElement(
        "canvas"
      );


    canvas.width =
      half;


    canvas.height =
      height;


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

      image,

      side ===
      "start"
        ? 0
        : width -
          half,

      0,

      half,

      height,

      0,

      0,

      half,

      height

    );


    return canvas.toDataURL(
      "image/png"
    );

  }


  /* =========================================
     LOAD DEMO

     Automatic filename lookup.
     ========================================= */

  function loadDemo(
    exercise
  ) {

    return new Promise(
      resolve => {

        if (
          !exercise.demo
        ) {

          resolve(
            null
          );

          return;

        }


        const source =
          new Image();


        let retryCount =
          0;


        source.onload =
          () => {

            try {

              resolve({

                start:
                  splitImage(
                    source,
                    "start"
                  ),

                finish:
                  splitImage(
                    source,
                    "finish"
                  )

              });

            } catch (_) {

              resolve(
                null
              );

            }

          };


        source.onerror =
          () => {

            if (
              retryCount <
              1
            ) {

              retryCount +=
                1;


              setTimeout(
                () => {

                  source.src =
                    versionedAsset(
                      exercise.demo,
                      retryCount
                    );

                },
                700
              );


              return;

            }


            resolve(
              null
            );

          };


        source.src =
          versionedAsset(
            exercise.demo,
            0
          );

      }
    );

  }


  /* =========================================
     DEMO PLAYER
     ========================================= */

  async function createPlayer(
    exercise
  ) {

    const frames =
      await loadDemo(
        exercise
      );


    const player =
      document.createElement(
        "div"
      );


    player.className =
      "m10111-player";


    player.dataset.pose =
      "start";


    player.dataset.exercise =
      exercise.name;


    const stage =
      document.createElement(
        "div"
      );


    stage.className =
      "m10111-stage";


    if (frames) {

      const start =
        new Image();


      start.className =
        "m10111-frame start";


      start.src =
        frames.start;


      start.alt =
        exercise.name +
        " starting position";


      const finish =
        new Image();


      finish.className =
        "m10111-frame finish";


      finish.src =
        frames.finish;


      finish.alt =
        exercise.name +
        " finishing position";


      stage.append(
        start,
        finish
      );

    } else {

      const empty =
        document.createElement(
          "div"
        );


      empty.className =
        "m10111-demo-empty";


      empty.innerHTML = `

        <div>

          <div class="m10111-demo-circle">
            ↕
          </div>

          <strong>
            DEMO COMING SOON
          </strong>

          <span>
            ${exercise.cue}
          </span>

        </div>

      `;


      stage.appendChild(
        empty
      );

    }


    const badge =
      document.createElement(
        "div"
      );


    badge.className =
      "m10111-badge";


    badge.textContent =
      "START";


    stage.appendChild(
      badge
    );


    const controls =
      document.createElement(
        "div"
      );


    controls.className =
      "m10111-controls";


    const play =
      document.createElement(
        "button"
      );


    play.type =
      "button";


    play.className =
      "m10111-control";


    play.textContent =
      "▶ PLAY DEMO";


    const replay =
      document.createElement(
        "button"
      );


    replay.type =
      "button";


    replay.className =
      "m10111-control";


    replay.textContent =
      "↻ REPLAY";


    const cue =
      document.createElement(
        "div"
      );


    cue.className =
      "m10111-cue";


    cue.textContent =
      exercise.cue;


    controls.append(
      play,
      replay,
      cue
    );


    player.append(
      stage,
      controls
    );


    let playing =
      false;


    let loop =
      null;


    let flip =
      null;


    function clearTimers() {

      clearInterval(
        loop
      );


      clearTimeout(
        flip
      );


      loop =
        null;


      flip =
        null;

    }


    function setPose(
      pose
    ) {

      player.dataset.pose =
        pose;


      badge.textContent =
        pose.toUpperCase();

    }


    function pause() {

      playing =
        false;


      clearTimers();


      play.textContent =
        "▶ PLAY DEMO";

    }


    function cycle() {

      setPose(
        "start"
      );


      flip =
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


    function begin() {

      if (
        playing
      ) {

        pause();

        return;

      }


      playing =
        true;


      play.textContent =
        "❚❚ PAUSE";


      cycle();


      loop =
        setInterval(
          cycle,
          3400
        );

    }


    play.onclick =
      begin;


    replay.onclick =
      () => {

        pause();


        setPose(
          "start"
        );


        setTimeout(
          begin,
          70
        );

      };


    player.pauseDemo =
      pause;


    return player;

  }


  /* =========================================
     UPDATE DEMO MODAL
     ========================================= */

  async function updateDemoModal(
    name
  ) {

    const modal =
      $(
        "manaV955DemoModal"
      );


    const demo =
      $(
        "manaV955Demo"
      );


    if (
      !modal ||
      !demo
    ) {

      return;

    }


    const exercise =
      resolveExercise(
        name
      );


    const title =
      $(
        "manaV955Title"
      );


    if (title) {

      title.textContent =
        exercise.name;

    }


    const label =
      $(
        "manaV955MuscleLabel"
      );


    if (label) {

      label.textContent =
        exercise.target;

    }


    activePlayer
      ?.pauseDemo
      ?.();


    const player =
      await createPlayer(
        exercise
      );


    if (
      !modal
        .classList
        .contains(
          "open"
        )
    ) {

      return;

    }


    demo.replaceChildren(
      player
    );


    activePlayer =
      player;

  }


  /* =========================================
     DEMO CLICKS
     ========================================= */

  function bindClicks() {

    document.addEventListener(

      "click",

      event => {

        const button =
          event
            .target
            .closest(
              ".mana-v955-demo-button,.mana-v957-demo-button,.m10111-demo-button"
            );


        if (button) {

          const card =
            button
              .closest(
                ".mana-v64-card"
              );


          const name =
            cardName(
              card
            );


          if (name) {

            setTimeout(
              () =>
                updateDemoModal(
                  name
                ),
              120
            );


            setTimeout(
              () =>
                updateDemoModal(
                  name
                ),
              350
            );

          }

        }


        if (
          event
            .target
            .closest(
              '[data-v83-tab="program"]'
            )
        ) {

          scheduleRefresh(
            180
          );

        }

      }

    );

  }


  /* =========================================
     STABLE OBSERVER
     ========================================= */

  function startObserver() {

    observer
      ?.disconnect();


    observer =
      new MutationObserver(
        mutations => {

          if (
            refreshing
          ) {

            return;

          }


          let relevant =
            false;


          for (
            const mutation
            of mutations
          ) {

            for (
              const node
              of mutation.addedNodes
            ) {

              if (
                node.nodeType !==
                1
              ) {

                continue;

              }


              if (
                node
                  .classList
                  ?.contains(
                    "m10111-target"
                  )
              ) {

                continue;

              }


              if (

                node
                  .matches
                  ?.(
                    ".mana-v64-card"
                  ) ||

                node
                  .querySelector
                  ?.(
                    ".mana-v64-card"
                  )

              ) {

                relevant =
                  true;


                break;

              }

            }


            if (
              relevant
            ) {

              break;

            }

          }


          if (
            relevant
          ) {

            scheduleRefresh(
              120
            );

          }

        }
      );


    observer.observe(
      document.body,
      {
        childList:
          true,

        subtree:
          true
      }
    );

  }


  /* =========================================
     MANA EVENTS
     ========================================= */

  function bindManaEvents() {

    [
      "mana:program-tab-change",
      "mana:strength-synced",
      "mana:workout-progress-change"
    ]
      .forEach(
        eventName => {

          window.addEventListener(

            eventName,

            () =>
              scheduleRefresh(
                120
              )

          );

        }
      );

  }


  /* =========================================
     PUBLIC API
     ========================================= */

  function exposeAPI() {

    window
      .MANA_EXERCISE_VISUALS = {

        build:
          BUILD,

        resolve:
          resolveExercise,

        refresh:
          scheduleRefresh,

        openDemo:
          updateDemoModal,

        muscleAssets:
          MUSCLE_ASSETS,

        exercises:
          EXERCISES,

        demoAssetFromName:
          demoAssetFromName,

        slugify:
          slugify

      };


    window
      .refreshManaExerciseVisuals =
      scheduleRefresh;


    window
      .MANA_UNIVERSAL_EXERCISE_VISUAL_BUILD =
      BUILD;

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();


    exposeAPI();


    bindClicks();


    bindManaEvents();


    refreshCards();


    startObserver();


    setTimeout(
      refreshCards,
      350
    );


    setTimeout(
      refreshCards,
      900
    );


    setTimeout(
      refreshCards,
      2200
    );


    console.log(
      "Mana Universal Exercise Visual + Demo System",
      BUILD
    );

  }


  /* =========================================
     BOOT
     ========================================= */

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
