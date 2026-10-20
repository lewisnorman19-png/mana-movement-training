/* =========================================
   MANA MOVEMENT TRAINING v10.11.6
   UNIVERSAL EXERCISE VISUAL + FORM GUIDE

   BUILD: 101160

   PURPOSE
   -----------------------------------------
   - One muscle illustration system
   - One universal Form Guide
   - Premium START / FINISH exercise demos
   - Automatic demo filenames
   - FORM GUIDE opens the premium demo
   - Key cues + avoid guidance remain
   - Coach + client share same exercise system
   - No individual JS file per exercise

   DEMO FILE NAMING
   -----------------------------------------
   Biceps Curl
   -> assets/exercises/biceps-curl-demo.png

   Triceps Pressdown
   -> assets/exercises/triceps-pressdown-demo.png

   Romanian Deadlift
   -> assets/exercises/romanian-deadlift-demo.png

   Demo PNG format:
   LEFT  = START
   RIGHT = FINISH
   ========================================= */

(() => {
  "use strict";


  /* =========================================
     BUILD
     ========================================= */

  const BUILD =
    "101160";


  const STYLE_ID =
    "mana-v10116-universal-exercise-style";


  const ROOT =
    "assets/exercises/";


  const GUIDE_ID =
    "manaV970FormGuide";


  let refreshTimer =
    null;


  let refreshing =
    false;


  let observer =
    null;


  let activePlayer =
    null;


  /* =========================================
     MASTER MUSCLE ASSETS
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
     EXERCISE TARGET DATABASE
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

      chest:"CHEST",

      back:"BACK",

      shoulders:"SHOULDERS",

      biceps:"BICEPS",

      triceps:"TRICEPS",

      core:"CORE",

      quads:"QUADS",

      posterior:"GLUTES",

      calves:"CALVES",

      fullbody:"FULL BODY"

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
     FORM GUIDE INFORMATION
     ========================================= */

  function guideInfo(
    rawName,
    exercise
  ) {

    const name =
      normalise(
        rawName
      )
      .toLowerCase();


    if (
      name.includes(
        "squat"
      ) ||
      name.includes(
        "leg press"
      )
    ) {

      return {

        cues:[
          "Brace your core before each rep.",
          "Keep the knees tracking over the toes.",
          "Stay controlled into the bottom position.",
          "Drive through the whole foot."
        ],

        avoid:
          "Avoid allowing the knees to collapse inward."

      };

    }


    if (
      name.includes(
        "lunge"
      ) ||
      name.includes(
        "split squat"
      ) ||
      name.includes(
        "step up"
      )
    ) {

      return {

        cues:[
          "Keep the working foot firmly planted.",
          "Stay tall through the torso.",
          "Lower under control.",
          "Drive strongly through the working leg."
        ],

        avoid:
          "Avoid rushing the movement or losing balance."

      };

    }


    if (
      name.includes(
        "deadlift"
      ) ||
      name.includes(
        "rdl"
      ) ||
      name.includes(
        "romanian"
      )
    ) {

      return {

        cues:[
          "Brace before you move.",
          "Push the hips back.",
          "Keep the weight close to the body.",
          "Finish tall with the glutes."
        ],

        avoid:
          "Avoid rounding through the lower back."

      };

    }


    if (
      name.includes(
        "bench"
      ) ||
      name.includes(
        "chest press"
      )
    ) {

      return {

        cues:[
          "Set the shoulder blades before pressing.",
          "Keep the feet planted.",
          "Lower the weight under control.",
          "Press smoothly through the chest."
        ],

        avoid:
          "Avoid letting the shoulders roll forward."

      };

    }


    if (
      name.includes(
        "shoulder press"
      ) ||
      name.includes(
        "overhead press"
      )
    ) {

      return {

        cues:[
          "Brace the core.",
          "Keep the ribs controlled.",
          "Press directly overhead.",
          "Lower smoothly to the starting position."
        ],

        avoid:
          "Avoid excessive arching through the lower back."

      };

    }


    if (
      name.includes(
        "lateral raise"
      )
    ) {

      return {

        cues:[
          "Keep a slight bend in the elbows.",
          "Raise the arms under control.",
          "Stop around shoulder height.",
          "Control the lowering phase."
        ],

        avoid:
          "Avoid swinging the body to lift the weight."

      };

    }


    if (
      name.includes(
        "pulldown"
      ) ||
      name.includes(
        "pull up"
      ) ||
      name.includes(
        "pull-up"
      )
    ) {

      return {

        cues:[
          "Keep the chest lifted.",
          "Set the shoulders before pulling.",
          "Drive the elbows down.",
          "Control the return."
        ],

        avoid:
          "Avoid pulling behind the neck or using excessive momentum."

      };

    }


    if (
      name.includes(
        "row"
      )
    ) {

      return {

        cues:[
          "Brace the torso.",
          "Keep the shoulders down.",
          "Drive the elbows behind you.",
          "Control the return."
        ],

        avoid:
          "Avoid shrugging or swinging through the torso."

      };

    }


    if (
      name.includes(
        "bicep"
      ) ||
      name.includes(
        "curl"
      )
    ) {

      return {

        cues:[
          "Keep the elbows close to the body.",
          "Keep the upper arms still.",
          "Curl through a comfortable full range.",
          "Lower the weight under control."
        ],

        avoid:
          "Avoid swinging the body or driving the elbows forward."

      };

    }


    if (
      name.includes(
        "tricep"
      ) ||
      name.includes(
        "pressdown"
      ) ||
      name.includes(
        "pushdown"
      )
    ) {

      return {

        cues:[
          "Keep the elbows close to the body.",
          "Keep the shoulders relaxed.",
          "Extend fully through the elbow.",
          "Control the return."
        ],

        avoid:
          "Avoid using the shoulders or torso to move the weight."

      };

    }


    if (
      name.includes(
        "hip thrust"
      ) ||
      name.includes(
        "glute bridge"
      )
    ) {

      return {

        cues:[
          "Keep the ribs controlled.",
          "Drive through the heels.",
          "Lift using the glutes.",
          "Pause briefly at the top."
        ],

        avoid:
          "Avoid overextending through the lower back."

      };

    }


    if (
      name.includes(
        "calf"
      )
    ) {

      return {

        cues:[
          "Use a full comfortable range.",
          "Drive through the ball of the foot.",
          "Pause at the top.",
          "Lower slowly."
        ],

        avoid:
          "Avoid bouncing through the bottom of the movement."

      };

    }


    if (
      exercise.muscle ===
      "core"
    ) {

      return {

        cues:[
          "Brace the trunk.",
          "Keep your breathing controlled.",
          "Maintain a strong neutral position.",
          "Move slowly and deliberately."
        ],

        avoid:
          "Avoid losing trunk position as fatigue builds."

      };

    }


    return {

      cues:[
        exercise.cue,
        "Move through a comfortable range.",
        "Keep the movement controlled.",
        "Maintain strong technique throughout."
      ],

      avoid:
        "Avoid using momentum or sacrificing technique."

    };

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

      /* =====================================
         MUSCLE TARGET CARD
         ===================================== */

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
        background:#050505;
        box-shadow:
          0 8px 24px
          rgba(0,0,0,.28);
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
        border:1px solid #896e27;
        border-radius:50%;
        background:
          radial-gradient(
            circle,
            rgba(228,185,54,.18),
            transparent 70%
          );
        color:#e6c75e;
        font-size:9px;
        font-weight:950;
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


      /* =====================================
         UNIVERSAL GUIDE
         ===================================== */

      .m10116-guide{
        width:
          min(
            760px,
            calc(100vw - 28px)
          );

        max-height:
          calc(100vh - 40px);

        overflow-y:auto;

        border:
          1px solid
          #3a3424;

        border-radius:
          22px;

        background:
          #080808;

        box-shadow:
          0 28px 80px
          rgba(0,0,0,.65);

        padding:
          22px;
      }


      .m10116-head{
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:18px;
        margin-bottom:18px;
      }


      .m10116-kicker{
        color:#d5b03a;
        font-size:10px;
        font-weight:950;
        letter-spacing:.12em;
      }


      .m10116-title{
        margin-top:6px;
        color:#fff;
        font-size:28px;
        font-weight:950;
        line-height:1.05;
      }


      .m10116-subtitle{
        margin-top:7px;
        color:#8d8d8d;
        font-size:11px;
      }


      .m10116-close{
        flex:0 0 auto;
        display:grid;
        place-items:center;
        width:44px;
        height:44px;
        border:1px solid #383838;
        border-radius:50%;
        background:#101010;
        color:#fff;
        font-size:22px;
        cursor:pointer;
      }


      /* =====================================
         PLAYER
         ===================================== */

      .m10111-player{
        overflow:hidden;
        border:1px solid #5e4c1d;
        border-radius:18px;
        background:#050505;
      }


      .m10111-stage{
        position:relative;
        height:420px;
        overflow:hidden;
        background:
          radial-gradient(
            circle at 50% 45%,
            rgba(217,178,58,.09),
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


      .m10111-badge{
        position:absolute;
        z-index:5;
        top:14px;
        left:14px;
        padding:8px 13px;
        border:1px solid #756024;
        border-radius:999px;
        background:rgba(18,16,7,.95);
        color:#efcc5f;
        font-size:10px;
        font-weight:950;
        letter-spacing:.07em;
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
        font-size:44px;
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
        grid-column:1/-1;
        padding:5px 8px;
        color:#bdbdbd;
        font-size:11px;
        line-height:1.5;
        text-align:center;
      }


      /* =====================================
         COACHING SECTION
         ===================================== */

      .m10116-coaching{
        margin-top:14px;
        padding:18px;
        border:1px solid #302a1b;
        border-radius:16px;
        background:#0c0b08;
      }


      .m10116-coaching h3{
        margin:0 0 12px;
        color:#fff;
        font-size:16px;
        font-weight:950;
      }


      .m10116-coaching ul{
        margin:0;
        padding-left:20px;
      }


      .m10116-coaching li{
        margin:7px 0;
        color:#d1d1d1;
        font-size:12px;
        line-height:1.45;
      }


      .m10116-avoid{
        margin-top:16px;
        padding-top:14px;
        border-top:1px solid #29261e;
        color:#bcbcbc;
        font-size:12px;
        line-height:1.5;
      }


      .m10116-avoid strong{
        color:#e7c655;
      }


      .m10116-loading{
        display:grid;
        place-items:center;
        min-height:360px;
        color:#8b793d;
        font-size:11px;
        font-weight:900;
        letter-spacing:.1em;
      }


      /* =====================================
         RESPONSIVE MUSCLE CARD
         ===================================== */

      @media(max-width:760px){

        .m10111-target{
          grid-template-columns:
            136px
            minmax(0,1fr);
        }

        .m10111-image{
          width:136px;
          height:136px;
        }

      }


      @media(max-width:600px){

        .m10111-target{
          grid-template-columns:
            125px
            minmax(0,1fr);
          gap:12px;
          padding:10px;
        }

        .m10111-image{
          width:125px;
          height:125px;
        }

        .m10111-target-name{
          font-size:15px;
        }


        .m10116-guide{
          width:
            calc(100vw - 16px);

          max-height:
            calc(100vh - 16px);

          border-radius:18px;

          padding:15px;
        }


        .m10116-title{
          font-size:24px;
        }


        .m10111-stage{
          height:360px;
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
        }


        .m10116-guide{
          padding:13px;
        }


        .m10111-stage{
          height:330px;
        }


        .m10111-controls{
          grid-template-columns:1fr;
        }


        .m10111-cue{
          grid-column:1;
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

  function cardName(
    card
  ) {

    if (!card) {

      return "";

    }


    return normalise(

      card.dataset
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
     MUSCLE VISUAL
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

          retryCount += 1;


          setTimeout(
            () => {

              img.src =
                versionedAsset(
                  asset,
                  retryCount
                );

            },
            800
          );


          return;

        }


        img.style.display =
          "none";


        fallback.style.display =
          "grid";

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


    copy.innerHTML = `

      <span
        class="m10111-kicker"
      >
        PRIMARY TARGET
      </span>

      <strong
        class="m10111-target-name"
      >
        ${exercise.target}
      </strong>

      <span
        class="m10111-note"
      >
        Mana Movement muscle focus
      </span>

    `;


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
     UPGRADE WORKOUT CARD
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


    card.dataset.manaV10116 =
      "1";

  }


  /* =========================================
     REFRESH CARDS
     ========================================= */

  function refreshCards() {

    if (
      refreshing
    ) {

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
     SPLIT START / FINISH PNG
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

      side === "start"
        ? 0
        : width - half,

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


        let retry =
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
              retry <
              1
            ) {

              retry +=
                1;


              setTimeout(
                () => {

                  source.src =
                    versionedAsset(
                      exercise.demo,
                      retry
                    );

                },
                650
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
     PREMIUM PLAYER
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
        " start position";


      const finish =
        new Image();


      finish.className =
        "m10111-frame finish";


      finish.src =
        frames.finish;


      finish.alt =
        exercise.name +
        " finish position";


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

          <div
            class="m10111-demo-circle"
          >
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
     GUIDE MODAL
     ========================================= */

  function ensureGuideModal() {

    let modal =
      $(
        GUIDE_ID
      );


    if (modal) {

      return modal;

    }


    modal =
      document.createElement(
        "div"
      );


    modal.id =
      GUIDE_ID;


    document.body.appendChild(
      modal
    );


    modal.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          modal
        ) {

          closeUniversalGuide();

        }

      }
    );


    return modal;

  }


  function closeUniversalGuide() {

    activePlayer
      ?.pauseDemo
      ?.();


    activePlayer =
      null;


    $(
      GUIDE_ID
    )
      ?.classList
      .remove(
        "open"
      );


    document.body.style.overflow =
      "";

  }


  async function openUniversalGuide(
    name
  ) {

    const modal =
      ensureGuideModal();


    const exercise =
      resolveExercise(
        name
      );


    const info =
      guideInfo(
        name,
        exercise
      );


    modal.innerHTML = `

      <div
        class="m10116-guide"
      >

        <div
          class="m10116-head"
        >

          <div>

            <div
              class="m10116-kicker"
            >
              FORM GUIDE
            </div>

            <div
              class="m10116-title"
            >
              ${exercise.name}
            </div>

            <div
              class="m10116-subtitle"
            >
              ${exercise.target}
            </div>

          </div>


          <button
            type="button"
            class="m10116-close"
            id="manaV10116GuideClose"
            aria-label="Close form guide"
          >
            ×
          </button>

        </div>


        <div
          id="manaV10116Player"
          class="m10116-loading"
        >
          LOADING DEMO...
        </div>


        <div
          class="m10116-coaching"
        >

          <h3>
            Key cues
          </h3>


          <ul>

            ${info.cues
              .map(
                cue => `
                  <li>
                    ${cue}
                  </li>
                `
              )
              .join("")}

          </ul>


          <div
            class="m10116-avoid"
          >

            <strong>
              Avoid:
            </strong>

            ${info.avoid}

          </div>

        </div>

      </div>

    `;


    modal.classList.add(
      "open"
    );


    document.body.style.overflow =
      "hidden";


    $(
      "manaV10116GuideClose"
    )
      .onclick =
        closeUniversalGuide;


    const player =
      await createPlayer(
        exercise
      );


    if (
      !modal.classList.contains(
        "open"
      )
    ) {

      return;

    }


    const mount =
      $(
        "manaV10116Player"
      );


    if (!mount) {

      return;

    }


    mount.replaceWith(
      player
    );


    activePlayer =
      player;

  }


  /* =========================================
     INTERCEPT OLD FORM GUIDE BUTTON
     ========================================= */

  function bindUniversalGuide() {

    document.addEventListener(

      "click",

      event => {

        const button =
          event
            .target
            .closest(
              "[data-v970-guide]"
            );


        if (!button) {

          return;

        }


        /*
          Stop old v9.70 stick-figure
          Form Guide from opening.
        */

        event.preventDefault();

        event.stopPropagation();

        event.stopImmediatePropagation();


        const card =
          button.closest(
            ".mana-v64-card"
          );


        const name =
          cardName(
            card
          );


        if (!name) {

          return;

        }


        openUniversalGuide(
          name
        );

      },

      true

    );

  }


  /* =========================================
     OBSERVER
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

                node.matches
                  ?.(
                    ".mana-v64-card"
                  ) ||

                node.querySelector
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
        childList:true,
        subtree:true
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

    window.MANA_EXERCISE_VISUALS = {

      build:
        BUILD,

      resolve:
        resolveExercise,

      refresh:
        scheduleRefresh,

      openDemo:
        openUniversalGuide,

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
      .openManaExerciseGuide =
      openUniversalGuide;


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


    bindUniversalGuide();


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
      "Mana Universal Form Guide",
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
        once:true
      }

    );

  } else {

    init();

  }

})();
