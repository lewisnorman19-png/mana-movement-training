/* =========================================
   MANA MOVEMENT TRAINING v10.11.0
   UNIVERSAL EXERCISE VISUAL SYSTEM

   PURPOSE
   -----------------------------------------
   ONE simple system for:
   - Exercise muscle illustrations
   - Exercise target labels
   - Exercise demo player
   - Coaching cues
   - Coach + client consistency
   - Future exercise library expansion

   IMPORTANT
   -----------------------------------------
   We are moving AWAY from:
   - one JS file per exercise
   - one muscle image per exercise
   - different demo layouts
   - duplicated coach/client exercise logic

   NEW SYSTEM
   -----------------------------------------
   Exercises share MASTER muscle illustrations:

   Chest
   Back
   Shoulders
   Biceps
   Triceps
   Core
   Quads
   Glutes / Hamstrings
   Calves
   Full Body

   Every exercise also uses the SAME
   premium demo-player layout.

   BUILD:
   101100
   ========================================= */

(() => {

  "use strict";


  /* =========================================
     BUILD
     ========================================= */

  const BUILD =
    "101100";


  const STYLE_ID =
    "mana-v1011-universal-exercise-visuals-style";


  const ROOT =
    "assets/exercises/";


  /* =========================================
     MASTER MUSCLE ILLUSTRATIONS

     THESE ARE THE ONLY MAIN MUSCLE IMAGES
     WE NEED TO CREATE.

     If an image does not exist yet,
     Mana automatically shows a premium
     fallback visual instead.
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
     EXERCISE LIBRARY

     THIS IS NOW OUR CENTRAL VISUAL DATABASE.

     To add a new exercise later,
     we add ONE entry here.

     We do NOT build another JS file.
     ========================================= */

  const EXERCISES = [

    /* =======================================
       CHEST
       ======================================= */

    {
      match:
        /^bench press$/i,

      muscle:
        "chest",

      target:
        "Chest + Triceps",

      cue:
        "Set your shoulders, lower under control and press strongly through the chest.",

      demo:
        ROOT +
        "bench-press-demo.png"
    },


    {
      match:
        /incline.*press/i,

      muscle:
        "chest",

      target:
        "Upper Chest + Triceps",

      cue:
        "Keep your shoulder blades set and press smoothly without losing position."
    },


    {
      match:
        /chest press/i,

      muscle:
        "chest",

      target:
        "Chest + Triceps",

      cue:
        "Keep the chest lifted and press through a controlled range."
    },


    {
      match:
        /push[\s-]?up/i,

      muscle:
        "chest",

      target:
        "Chest + Triceps + Core",

      cue:
        "Keep your body in one strong line and lower the chest under control."
    },


    {
      match:
        /pec.*fly|chest.*fly|dumbbell.*fly/i,

      muscle:
        "chest",

      target:
        "Chest",

      cue:
        "Maintain a soft elbow and bring the arms together using the chest."
    },


    /* =======================================
       BACK
       ======================================= */

    {
      match:
        /lat pulldown/i,

      muscle:
        "back",

      target:
        "Lats + Upper Back",

      cue:
        "Keep your chest lifted and drive your elbows toward your sides."
    },


    {
      match:
        /seated.*row/i,

      muscle:
        "back",

      target:
        "Mid Back + Lats",

      cue:
        "Stay tall and pull the elbows behind you without swinging."
    },


    {
      match:
        /chest supported.*row/i,

      muscle:
        "back",

      target:
        "Upper Back + Lats",

      cue:
        "Keep the chest supported and pull through the elbows."
    },


    {
      match:
        /single.*arm.*row|one.*arm.*row|dumbbell.*row/i,

      muscle:
        "back",

      target:
        "Lats + Mid Back",

      cue:
        "Keep the torso stable and drive your elbow back toward your hip."
    },


    {
      match:
        /barbell.*row|bent.*row/i,

      muscle:
        "back",

      target:
        "Back + Lats",

      cue:
        "Brace your trunk and pull the bar toward the lower ribs."
    },


    {
      match:
        /pull[\s-]?up|chin[\s-]?up/i,

      muscle:
        "back",

      target:
        "Lats + Upper Back + Arms",

      cue:
        "Start from a strong shoulder position and pull your chest upward."
    },


    /* =======================================
       SHOULDERS
       ======================================= */

    {
      match:
        /shoulder press|overhead press|military press|arnold press/i,

      muscle:
        "shoulders",

      target:
        "Shoulders + Triceps",

      cue:
        "Brace the core and press overhead without overextending the lower back.",

      demo:
        ROOT +
        "shoulder-press-demo.png"
    },


    {
      match:
        /lateral raise|side raise|side lateral/i,

      muscle:
        "shoulders",

      target:
        "Shoulders — Lateral Deltoids",

      cue:
        "Lift under control to approximately shoulder height and avoid swinging.",

      demo:
        ROOT +
        "lateral-raise-demo.png"
    },


    {
      match:
        /front raise/i,

      muscle:
        "shoulders",

      target:
        "Front Deltoids",

      cue:
        "Lift smoothly without using momentum and control the lowering phase."
    },


    {
      match:
        /rear delt|reverse fly|reverse pec/i,

      muscle:
        "shoulders",

      target:
        "Rear Deltoids + Upper Back",

      cue:
        "Keep the shoulders down and move through the rear delts."
    },


    {
      match:
        /face pull/i,

      muscle:
        "shoulders",

      target:
        "Rear Delts + Upper Back",

      cue:
        "Pull toward the face while keeping the shoulders controlled."
    },


    /* =======================================
       BICEPS
       ======================================= */

    {
      match:
        /bicep|biceps|curl/i,

      muscle:
        "biceps",

      target:
        "Biceps",

      cue:
        "Keep the upper arm stable and curl without swinging the body."
    },


    /* =======================================
       TRICEPS
       ======================================= */

    {
      match:
        /tricep|triceps|pushdown|skull crusher/i,

      muscle:
        "triceps",

      target:
        "Triceps",

      cue:
        "Keep the upper arm controlled and fully extend through the elbow."
    },


    /* =======================================
       QUADS
       ======================================= */

    {
      match:
        /^back squat$/i,

      muscle:
        "quads",

      target:
        "Quadriceps + Glutes",

      cue:
        "Brace your core, keep your chest strong and drive through your whole foot.",

      demo:
        ROOT +
        "back-squat-demo.png"
    },


    {
      match:
        /front squat/i,

      muscle:
        "quads",

      target:
        "Quadriceps + Glutes",

      cue:
        "Keep the elbows high, torso upright and drive through the feet."
    },


    {
      match:
        /goblet squat/i,

      muscle:
        "quads",

      target:
        "Quadriceps + Glutes",

      cue:
        "Keep the weight close to your chest and sit between the hips."
    },


    {
      match:
        /leg press/i,

      muscle:
        "quads",

      target:
        "Quadriceps + Glutes",

      cue:
        "Control the lowering phase and drive through the whole foot."
    },


    {
      match:
        /leg extension/i,

      muscle:
        "quads",

      target:
        "Quadriceps",

      cue:
        "Extend smoothly and squeeze the quadriceps at the top."
    },


    {
      match:
        /split squat|bulgarian/i,

      muscle:
        "quads",

      target:
        "Quadriceps + Glutes",

      cue:
        "Stay controlled and keep the front knee tracking with the foot."
    },


    {
      match:
        /step[\s-]?up/i,

      muscle:
        "quads",

      target:
        "Quadriceps + Glutes",

      cue:
        "Drive through the working leg rather than pushing from the trailing foot."
    },


    {
      match:
        /walking lunge|reverse lunge|forward lunge|lunge/i,

      muscle:
        "quads",

      target:
        "Quadriceps + Glutes",

      cue:
        "Move with control and keep the knee tracking over the foot."
    },


    /* =======================================
       GLUTES + HAMSTRINGS
       ======================================= */

    {
      match:
        /romanian deadlift|rdl/i,

      muscle:
        "posterior",

      target:
        "Hamstrings + Glutes",

      cue:
        "Push the hips back while maintaining a strong neutral spine."
    },


    {
      match:
        /^deadlift$/i,

      muscle:
        "posterior",

      target:
        "Glutes + Hamstrings + Back",

      cue:
        "Brace strongly, keep the weight close and push the floor away."
    },


    {
      match:
        /hip thrust/i,

      muscle:
        "posterior",

      target:
        "Glutes",

      cue:
        "Drive through the heels and finish with a strong glute contraction."
    },


    {
      match:
        /glute bridge/i,

      muscle:
        "posterior",

      target:
        "Glutes",

      cue:
        "Drive the hips upward through the glutes without overextending the back."
    },


    {
      match:
        /hamstring curl|leg curl/i,

      muscle:
        "posterior",

      target:
        "Hamstrings",

      cue:
        "Curl under control and squeeze the hamstrings through the movement."
    },


    /* =======================================
       CALVES
       ======================================= */

    {
      match:
        /calf raise|calves/i,

      muscle:
        "calves",

      target:
        "Calves",

      cue:
        "Use a full controlled range and pause briefly at the top."
    },


    /* =======================================
       CORE
       ======================================= */

    {
      match:
        /plank/i,

      muscle:
        "core",

      target:
        "Core",

      cue:
        "Brace the trunk, keep the hips level and maintain a strong neutral position."
    },


    {
      match:
        /dead bug/i,

      muscle:
        "core",

      target:
        "Core",

      cue:
        "Keep the lower back controlled while moving the opposite arm and leg."
    },


    {
      match:
        /bird dog/i,

      muscle:
        "core",

      target:
        "Core + Stability",

      cue:
        "Keep the hips square and reach long through the opposite arm and leg."
    },


    {
      match:
        /crunch|sit[\s-]?up/i,

      muscle:
        "core",

      target:
        "Abdominals",

      cue:
        "Move through the abdominals rather than pulling through the neck."
    },


    {
      match:
        /russian twist/i,

      muscle:
        "core",

      target:
        "Core + Obliques",

      cue:
        "Rotate through the trunk while keeping the torso controlled."
    },


    {
      match:
        /pallof/i,

      muscle:
        "core",

      target:
        "Core + Anti-Rotation",

      cue:
        "Resist rotation and maintain a strong centered trunk position."
    },


    /* =======================================
       FULL BODY / CONDITIONING
       ======================================= */

    {
      match:
        /burpee/i,

      muscle:
        "fullbody",

      target:
        "Full Body",

      cue:
        "Move smoothly through each position and maintain control as fatigue builds."
    },


    {
      match:
        /farmer.*carry|farmer.*walk|loaded carry/i,

      muscle:
        "fullbody",

      target:
        "Full Body + Grip",

      cue:
        "Stand tall, brace the core and walk with controlled steps."
    },


    {
      match:
        /sled/i,

      muscle:
        "fullbody",

      target:
        "Full Body + Legs",

      cue:
        "Maintain a strong body angle and drive forcefully through the floor."
    }

  ];


  /* =========================================
     DEFAULT FALLBACK EXERCISE
     ========================================= */

  const DEFAULT_EXERCISE = {

    muscle:
      "fullbody",

    target:
      "Full Body",

    cue:
      "Move with control, maintain good technique and work through a comfortable range.",

    demo:
      null

  };


  /* =========================================
     HELPERS
     ========================================= */

  function $(id) {

    return document.getElementById(
      id
    );

  }


  function normalise(
    value
  ) {

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
          item
            .match
            .test(
              clean
            )
      );


    return {

      name:
        clean ||
        "Exercise",

      ...DEFAULT_EXERCISE,

      ...(match || {})

    };

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


  /* =========================================
     INSTALL STYLES
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

      /* =====================================
         EXERCISE TARGET CARD
         ===================================== */

      .m1011-target{

        display:grid;

        grid-template-columns:
          110px
          minmax(
            0,
            1fr
          );

        gap:
          14px;

        align-items:
          center;

        margin:
          12px
          0
          14px;

        padding:
          11px;

        border:
          1px solid
          #51431c;

        border-radius:
          17px;

        background:
          linear-gradient(
            145deg,
            #100e08,
            #080808
          );

        overflow:
          hidden;

      }


      .m1011-target-image{

        position:
          relative;

        display:
          grid;

        place-items:
          center;

        width:
          110px;

        height:
          120px;

        overflow:
          hidden;

        border:
          1px solid
          #302815;

        border-radius:
          14px;

        background:
          radial-gradient(
            circle
            at
            50%
            38%,
            rgba(
              220,
              179,
              59,
              .18
            ),
            transparent
            48%
          ),
          #050505;

      }


      .m1011-target-image img{

        display:
          block;

        width:
          100%;

        height:
          100%;

        object-fit:
          contain;

      }


      .m1011-fallback{

        display:
          grid;

        place-items:
          center;

        width:
          100%;

        height:
          100%;

        padding:
          8px;

        text-align:
          center;

      }


      .m1011-fallback-ring{

        display:
          grid;

        place-items:
          center;

        width:
          72px;

        height:
          72px;

        border:
          1px solid
          #8c7027;

        border-radius:
          50%;

        color:
          #e6c75e;

        font-size:
          11px;

        font-weight:
          950;

        letter-spacing:
          .05em;

        text-transform:
          uppercase;

        background:
          radial-gradient(
            circle,
            rgba(
              228,
              185,
              54,
              .18
            ),
            rgba(
              228,
              185,
              54,
              .02
            )
          );

      }


      .m1011-target-copy{

        min-width:
          0;

      }


      .m1011-kicker{

        color:
          #8d7938;

        font-size:
          9px;

        font-weight:
          950;

        letter-spacing:
          .14em;

        text-transform:
          uppercase;

      }


      .m1011-target-name{

        display:
          block;

        margin-top:
          6px;

        color:
          #f0cf62;

        font-size:
          17px;

        font-weight:
          950;

        line-height:
          1.2;

      }


      .m1011-target-note{

        display:
          block;

        margin-top:
          6px;

        color:
          #777;

        font-size:
          10px;

        line-height:
          1.45;

      }


      /* =====================================
         DEMO BUTTON
         ===================================== */

      .m1011-demo-button{

        border-color:
          #6b5720
          !important;

        background:
          linear-gradient(
            145deg,
            #181307,
            #0b0a07
          )
          !important;

        color:
          #f0cf62
          !important;

        font-weight:
          950
          !important;

      }


      /* =====================================
         DEMO PLAYER
         ===================================== */

      .m1011-player{

        overflow:
          hidden;

        margin-top:
          8px;

        border:
          1px solid
          #62501e;

        border-radius:
          19px;

        background:
          #070707;

      }


      .m1011-stage{

        position:
          relative;

        height:
          430px;

        overflow:
          hidden;

        background:
          radial-gradient(
            circle
            at
            50%
            45%,
            rgba(
              217,
              178,
              58,
              .10
            ),
            transparent
            52%
          ),
          #050505;

      }


      .m1011-stage-frame{

        position:
          absolute;

        inset:
          0;

        display:
          block;

        width:
          100%;

        height:
          100%;

        object-fit:
          contain;

        opacity:
          0;

        transition:
          opacity
          .42s
          ease;

      }


      .m1011-player[data-pose="start"]
      .m1011-stage-frame.start{

        opacity:
          1;

      }


      .m1011-player[data-pose="finish"]
      .m1011-stage-frame.finish{

        opacity:
          1;

      }


      .m1011-demo-fallback{

        position:
          absolute;

        inset:
          0;

        display:
          grid;

        place-items:
          center;

        padding:
          30px;

        text-align:
          center;

      }


      .m1011-demo-fallback-inner{

        width:
          min(
            260px,
            80%
          );

      }


      .m1011-demo-symbol{

        position:
          relative;

        display:
          grid;

        place-items:
          center;

        width:
          145px;

        height:
          145px;

        margin:
          0
          auto
          18px;

        border:
          1px solid
          #735d21;

        border-radius:
          50%;

        background:
          radial-gradient(
            circle,
            rgba(
              229,
              188,
              61,
              .20
            ),
            rgba(
              229,
              188,
              61,
              .02
            )
          );

        color:
          #e3c259;

        font-size:
          48px;

        transition:
          transform
          .6s
          ease;

      }


      .m1011-player[data-pose="finish"]
      .m1011-demo-symbol{

        transform:
          translateY(
            -14px
          )
          scale(
            1.05
          );

      }


      .m1011-demo-fallback-title{

        color:
          #f0cf62;

        font-size:
          14px;

        font-weight:
          950;

      }


      .m1011-demo-fallback-copy{

        margin-top:
          7px;

        color:
          #777;

        font-size:
          11px;

        line-height:
          1.45;

      }


      /* =====================================
         DEMO BADGE
         ===================================== */

      .m1011-badge{

        position:
          absolute;

        z-index:
          6;

        top:
          14px;

        left:
          14px;

        padding:
          8px
          13px;

        border:
          1px solid
          #756024;

        border-radius:
          999px;

        background:
          rgba(
            18,
            15,
            7,
            .94
          );

        color:
          #efcc5f;

        font-size:
          10px;

        font-weight:
          950;

        letter-spacing:
          .07em;

      }


      /* =====================================
         DEMO PROGRESS
         ===================================== */

      .m1011-progress{

        position:
          absolute;

        z-index:
          6;

        left:
          16px;

        right:
          16px;

        bottom:
          12px;

        height:
          4px;

        overflow:
          hidden;

        border-radius:
          999px;

        background:
          #292318;

      }


      .m1011-progress span{

        display:
          block;

        width:
          0;

        height:
          100%;

        border-radius:
          inherit;

        background:
          #d9b33c;

      }


      .m1011-player.playing
      .m1011-progress span{

        animation:
          mana1011Progress
          3.4s
          linear
          infinite;

      }


      @keyframes
      mana1011Progress{

        from{
          width:
            0;
        }

        to{
          width:
            100%;
        }

      }


      /* =====================================
         CONTROLS
         ===================================== */

      .m1011-controls{

        display:
          grid;

        grid-template-columns:
          1fr
          1fr;

        gap:
          9px;

        padding:
          12px;

        border-top:
          1px solid
          #221e14;

        background:
          #0b0a07;

      }


      .m1011-control{

        min-height:
          46px;

        border:
          1px solid
          #66531f;

        border-radius:
          12px;

        background:
          #171307;

        color:
          #f0cf62;

        font-size:
          11px;

        font-weight:
          950;

        cursor:
          pointer;

      }


      .m1011-cue{

        grid-column:
          1
          /
          -1;

        padding:
          6px
          8px
          5px;

        color:
          #bdbdbd;

        font-size:
          11px;

        line-height:
          1.5;

        text-align:
          center;

      }


      /* =====================================
         MODAL MUSCLE CARD
         ===================================== */

      .m1011-modal-muscle{

        display:
          grid;

        grid-template-columns:
          100px
          minmax(
            0,
            1fr
          );

        gap:
          12px;

        align-items:
          center;

        width:
          100%;

      }


      .m1011-modal-muscle
      .m1011-target-image{

        width:
          100px;

        height:
          110px;

      }


      /* =====================================
         MOBILE
         ===================================== */

      @media(
        max-width:
        600px
      ){

        .m1011-target{

          grid-template-columns:
            88px
            minmax(
              0,
              1fr
            );

          gap:
            10px;

          padding:
            9px;

        }


        .m1011-target-image{

          width:
            88px;

          height:
            102px;

        }


        .m1011-target-name{

          font-size:
            15px;

        }


        .m1011-stage{

          height:
            370px;

        }


        .m1011-controls{

          gap:
            7px;

          padding:
            9px;

        }

      }


      @media(
        prefers-reduced-motion:
        reduce
      ){

        .m1011-stage-frame,
        .m1011-demo-symbol{

          transition:
            none;

        }

      }

    `;


    document
      .head
      .appendChild(
        style
      );

  }


  /* =========================================
     EXERCISE NAME FROM CARD
     ========================================= */

  function cardExerciseName(
    card
  ) {

    if (!card) {

      return "";

    }


    return normalise(

      card
        .dataset
        ?.exerciseName ||

      card
        .querySelector(
          ".mana-v64-name"
        )
        ?.textContent ||

      card
        .querySelector(
          "[data-exercise-name]"
        )
        ?.dataset
        ?.exerciseName ||

      card
        .querySelector(
          "h3"
        )
        ?.textContent ||

      card
        .querySelector(
          "strong"
        )
        ?.textContent ||

      ""

    );

  }


  /* =========================================
     MASTER MUSCLE VISUAL
     ========================================= */

  function buildMuscleVisual(
    exercise,
    compact = false
  ) {

    const outer =
      document.createElement(
        "div"
      );


    outer.className =
      compact
        ? "m1011-modal-muscle"
        : "m1011-target";


    const visual =
      document.createElement(
        "div"
      );


    visual.className =
      "m1011-target-image";


    const image =
      new Image();


    image.alt =
      exercise.target +
      " muscle target";


    image.loading =
      "lazy";


    image.src =
      muscleAsset(
        exercise
      ) +
      "?v=" +
      BUILD;


    const fallback =
      document.createElement(
        "div"
      );


    fallback.className =
      "m1011-fallback";


    fallback.style.display =
      "none";


    const ring =
      document.createElement(
        "div"
      );


    ring.className =
      "m1011-fallback-ring";


    ring.textContent =
      exercise.muscle ===
      "posterior"
        ? "GLUTES"
        : exercise
            .muscle
            .replace(
              "fullbody",
              "FULL BODY"
            );


    fallback.appendChild(
      ring
    );


    image.addEventListener(
      "error",

      () => {

        image.style.display =
          "none";

        fallback.style.display =
          "grid";

      },

      {
        once:
          true
      }
    );


    visual.append(
      image,
      fallback
    );


    const copy =
      document.createElement(
        "div"
      );


    copy.className =
      "m1011-target-copy";


    const kicker =
      document.createElement(
        "span"
      );


    kicker.className =
      "m1011-kicker";


    kicker.textContent =
      "PRIMARY TARGET";


    const target =
      document.createElement(
        "strong"
      );


    target.className =
      "m1011-target-name";


    target.textContent =
      exercise.target;


    const note =
      document.createElement(
        "span"
      );


    note.className =
      "m1011-target-note";


    note.textContent =
      "Premium muscle focus";


    copy.append(
      kicker,
      target,
      note
    );


    outer.append(
      visual,
      copy
    );


    return outer;

  }


  /* =========================================
     REMOVE OLD ILLUSTRATIONS

     This prevents the old exercise-specific
     files creating duplicate artwork.
     ========================================= */

  function cleanOldCardVisuals(
    card
  ) {

    card
      .querySelectorAll(
        [
          ".mana-v957-target",
          ".mana-v958-target",
          ".mana-v959-target",
          ".mana-v963-muscle-card",
          ".m1011-target"
        ]
          .join(
            ","
          )
      )
      .forEach(
        node =>
          node.remove()
      );


    const oldHead =
      card
        .querySelector(
          ".mana-v955-exercise-head"
        );


    if (oldHead) {

      oldHead.style.display =
        "none";

    }

  }


  /* =========================================
     UPGRADE EXERCISE CARD
     ========================================= */

  function upgradeCard(
    card
  ) {

    if (!card) {

      return;

    }


    const name =
      cardExerciseName(
        card
      );


    if (!name) {

      return;

    }


    const exercise =
      resolveExercise(
        name
      );


    cleanOldCardVisuals(
      card
    );


    const title =
      card.querySelector(
        ".mana-v64-name"
      ) ||

      card.querySelector(
        "h3"
      ) ||

      card.querySelector(
        "strong"
      );


    if (!title) {

      return;

    }


    const visual =
      buildMuscleVisual(
        exercise
      );


    title
      .insertAdjacentElement(
        "afterend",
        visual
      );


    card.dataset.manaV1011 =
      "1";


    card.dataset.manaExerciseName =
      name;


    /* DEMO BUTTON */

    const demoButton =
      card.querySelector(
        [
          ".mana-v955-demo-button",
          ".mana-v957-demo-button",
          "[data-demo]",
          "[data-exercise-demo]"
        ]
          .join(
            ","
          )
      );


    if (demoButton) {

      demoButton
        .classList
        .add(
          "m1011-demo-button"
        );


      demoButton.textContent =
        "▶ VIEW EXERCISE DEMO";


      demoButton.dataset.manaV1011Exercise =
        name;

    }

  }


  /* =========================================
     FIND EXERCISE CARDS
     ========================================= */

  function exerciseCards() {

    const selectors = [

      "#manaV64Exercises .mana-v64-card",

      ".mana-v64-card",

      "[data-exercise-name]",

      ".exercise-card"

    ];


    const set =
      new Set();


    selectors
      .forEach(
        selector => {

          document
            .querySelectorAll(
              selector
            )
            .forEach(
              node =>
                set.add(
                  node
                )
            );

        }
      );


    return [
      ...set
    ];

  }


  /* =========================================
     REFRESH CARDS
     ========================================= */

  function refreshCards() {

    exerciseCards()
      .forEach(
        upgradeCard
      );


    window
      .MANA_UNIVERSAL_EXERCISE_VISUAL_BUILD =
      BUILD;

  }


  function scheduleRefresh() {

    [
      50,
      180,
      400,
      800,
      1400
    ]
      .forEach(
        delay => {

          setTimeout(
            refreshCards,
            delay
          );

        }
      );

  }


  /* =========================================
     SPLIT EXISTING START / FINISH DEMO

     Existing demo PNGs are side-by-side.
     This automatically turns them into
     START and FINISH frames.
     ========================================= */

  function splitDemoImage(
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


    const sx =
      side ===
      "start"
        ? 0
        : width -
          half;


    ctx.drawImage(

      image,

      sx,
      0,

      half,
      height,

      0,
      0,

      half,
      height

    );


    return canvas
      .toDataURL(
        "image/png"
      );

  }


  /* =========================================
     LOAD DEMO
     ========================================= */

  function loadDemoFrames(
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


        source.onload =
          () => {

            try {

              resolve({

                start:
                  splitDemoImage(
                    source,
                    "start"
                  ),

                finish:
                  splitDemoImage(
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

            resolve(
              null
            );

          };


        source.src =
          exercise.demo +
          "?v=" +
          BUILD;

      }
    );

  }


  /* =========================================
     DEMO FALLBACK

     Until each exercise demo is produced,
     the exact same premium player still
     appears.

     This means no broken demo screens.
     ========================================= */

  function buildDemoFallback(
    exercise
  ) {

    const fallback =
      document.createElement(
        "div"
      );


    fallback.className =
      "m1011-demo-fallback";


    const inner =
      document.createElement(
        "div"
      );


    inner.className =
      "m1011-demo-fallback-inner";


    const symbol =
      document.createElement(
        "div"
      );


    symbol.className =
      "m1011-demo-symbol";


    symbol.textContent =
      "↕";


    const title =
      document.createElement(
        "div"
      );


    title.className =
      "m1011-demo-fallback-title";


    title.textContent =
      "CONTROLLED MOVEMENT";


    const copy =
      document.createElement(
        "div"
      );


    copy.className =
      "m1011-demo-fallback-copy";


    copy.textContent =
      exercise.cue;


    inner.append(
      symbol,
      title,
      copy
    );


    fallback.appendChild(
      inner
    );


    return fallback;

  }


  /* =========================================
     UNIVERSAL DEMO PLAYER
     ========================================= */

  async function buildDemoPlayer(
    name,
    exercise
  ) {

    const frames =
      await loadDemoFrames(
        exercise
      );


    const player =
      document.createElement(
        "div"
      );


    player.className =
      "m1011-player";


    player.dataset.exercise =
      name;


    player.dataset.pose =
      "start";


    const stage =
      document.createElement(
        "div"
      );


    stage.className =
      "m1011-stage";


    if (frames) {

      const start =
        new Image();


      start.className =
        "m1011-stage-frame start";


      start.src =
        frames.start;


      start.alt =
        name +
        " starting position";


      const finish =
        new Image();


      finish.className =
        "m1011-stage-frame finish";


      finish.src =
        frames.finish;


      finish.alt =
        name +
        " finishing position";


      stage.append(
        start,
        finish
      );

    } else {

      stage.appendChild(
        buildDemoFallback(
          exercise
        )
      );

    }


    const badge =
      document.createElement(
        "div"
      );


    badge.className =
      "m1011-badge";


    badge.textContent =
      "START";


    const progress =
      document.createElement(
        "div"
      );


    progress.className =
      "m1011-progress";


    const progressFill =
      document.createElement(
        "span"
      );


    progress.appendChild(
      progressFill
    );


    stage.append(
      badge,
      progress
    );


    /* CONTROLS */

    const controls =
      document.createElement(
        "div"
      );


    controls.className =
      "m1011-controls";


    const play =
      document.createElement(
        "button"
      );


    play.type =
      "button";


    play.className =
      "m1011-control";


    play.textContent =
      "▶ PLAY DEMO";


    const replay =
      document.createElement(
        "button"
      );


    replay.type =
      "button";


    replay.className =
      "m1011-control";


    replay.textContent =
      "↻ REPLAY";


    const cue =
      document.createElement(
        "div"
      );


    cue.className =
      "m1011-cue";


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


    let cycleInterval =
      null;


    let flipTimeout =
      null;


    function clearTimers() {

      clearInterval(
        cycleInterval
      );


      clearTimeout(
        flipTimeout
      );


      cycleInterval =
        null;


      flipTimeout =
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


      player
        .classList
        .remove(
          "playing"
        );


      play.textContent =
        "▶ PLAY DEMO";

    }


    function cycle() {

      setPose(
        "start"
      );


      flipTimeout =
        setTimeout(
          () => {

            if (playing) {

              setPose(
                "finish"
              );

            }

          },

          1550
        );

    }


    function startPlaying() {

      if (playing) {

        pause();

        return;

      }


      playing =
        true;


      player
        .classList
        .add(
          "playing"
        );


      play.textContent =
        "❚❚ PAUSE";


      cycle();


      cycleInterval =
        setInterval(
          cycle,
          3400
        );

    }


    function replayDemo() {

      pause();


      setPose(
        "start"
      );


      setTimeout(
        startPlaying,
        80
      );

    }


    play.addEventListener(
      "click",
      startPlaying
    );


    replay.addEventListener(
      "click",
      replayDemo
    );


    player.pauseDemo =
      pause;


    return player;

  }


  /* =========================================
     UPDATE EXISTING DEMO MODAL
     ========================================= */

  async function renderDemoModal(
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
        name;

    }


    const targetLabel =
      $(
        "manaV955MuscleLabel"
      );


    if (targetLabel) {

      targetLabel.textContent =
        exercise.target;

    }


    const muscle =
      $(
        "manaV955Muscle"
      );


    if (muscle) {

      muscle.replaceChildren(

        buildMuscleVisual(
          exercise,
          true
        )

      );

    }


    const player =
      await buildDemoPlayer(
        name,
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

  }


  /* =========================================
     DETECT EXERCISE FROM CLICK
     ========================================= */

  function exerciseFromDemoButton(
    button
  ) {

    return normalise(

      button
        ?.dataset
        ?.manaV1011Exercise ||

      button
        ?.closest(
          ".mana-v64-card"
        )
        ?.dataset
        ?.manaExerciseName ||

      cardExerciseName(
        button
          ?.closest(
            ".mana-v64-card"
          )
      ) ||

      ""

    );

  }


  /* =========================================
     DEMO CLICK INTERCEPT

     Old code may still open the existing
     modal first.

     We then immediately replace its content
     with the universal player.
     ========================================= */

  function bindDemoClicks() {

    document.addEventListener(

      "click",

      event => {

        const button =
          event
            .target
            .closest(
              [
                ".mana-v955-demo-button",
                ".mana-v957-demo-button",
                ".m1011-demo-button",
                "[data-exercise-demo]"
              ]
                .join(
                  ","
                )
            );


        if (!button) {

          return;

        }


        const name =
          exerciseFromDemoButton(
            button
          );


        if (!name) {

          return;

        }


        /*
          Allow the existing modal-opening
          code to run first.
        */

        setTimeout(
          () =>
            renderDemoModal(
              name
            ),
          80
        );


        setTimeout(
          () =>
            renderDemoModal(
              name
            ),
          240
        );

      },

      true

    );

  }


  /* =========================================
     WATCH DYNAMIC WORKOUT CARDS
     ========================================= */

  function observeCards() {

    let timer =
      null;


    const observer =
      new MutationObserver(
        () => {

          clearTimeout(
            timer
          );


          timer =
            setTimeout(
              refreshCards,
              100
            );

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
     EXISTING MANA EVENTS
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
            scheduleRefresh
          );

        }
      );


    document.addEventListener(

      "click",

      event => {

        if (

          event
            .target
            .closest(
              '[data-v83-tab="program"]'
            )

        ) {

          scheduleRefresh();

        }

      }

    );

  }


  /* =========================================
     PUBLIC API

     Program Builder / Client side can use
     exactly the same resolver.
     ========================================= */

  function exposeAPI() {

    window
      .MANA_EXERCISE_VISUALS = {

        build:
          BUILD,

        exercises:
          EXERCISES,

        muscleAssets:
          MUSCLE_ASSETS,

        resolve:
          resolveExercise,

        refresh:
          scheduleRefresh,

        openDemo:
          renderDemoModal

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

    bindDemoClicks();

    bindManaEvents();

    observeCards();

    scheduleRefresh();


    console.log(

      "Mana Movement Universal Exercise Visuals",

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
