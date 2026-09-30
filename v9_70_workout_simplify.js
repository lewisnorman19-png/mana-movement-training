/* =========================================
   MANA MOVEMENT TRAINING v9.70.0
   SIMPLIFIED WORKOUT EXPERIENCE

   CLIENT-FIRST UX

   MAIN WORKOUT
   - EXERCISE
   - TARGET
   - SET / WEIGHT / REPS / DONE
   - TIME
   - SETS COMPLETE

   HIDDEN UNTIL REQUESTED
   - PREVIOUS WORKOUT
   - SUGGESTED PROGRESSION
   - FORM GUIDE
   - ADD / REMOVE SETS

   FORM GUIDE
   - STATIC START
   - STATIC FINISH
   - KEY CUES
   - NO ANIMATION
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "97000";

  const STYLE_ID =
    "mana-v970-workout-style";

  const GUIDE_ID =
    "manaV970FormGuide";


  /* =========================================
     EXERCISE CLASSIFICATION
     ========================================= */

  function exerciseInfo(
    rawName
  ) {

    const name =
      String(
        rawName || ""
      ).toLowerCase();


    if (
      name.includes("squat") ||
      name.includes("leg press") ||
      name.includes("hack squat")
    ) {

      return {
        type:"squat",
        cues:[
          "Brace before each rep.",
          "Keep knees tracking over the toes.",
          "Stay controlled into the bottom position.",
          "Drive through the whole foot."
        ],
        avoid:
          "Avoid collapsing the knees inward."
      };
    }


    if (
      name.includes("lunge") ||
      name.includes("split squat") ||
      name.includes("step up") ||
      name.includes("step-up")
    ) {

      return {
        type:"lunge",
        cues:[
          "Keep the front foot planted.",
          "Stay tall through the torso.",
          "Lower under control.",
          "Drive through the front leg."
        ],
        avoid:
          "Avoid rushing or losing balance."
      };
    }


    if (
      name.includes("deadlift") ||
      name.includes("rdl") ||
      name.includes("romanian") ||
      name.includes("good morning")
    ) {

      return {
        type:"hinge",
        cues:[
          "Brace before moving.",
          "Push the hips back.",
          "Keep the load close to the body.",
          "Finish tall without leaning back."
        ],
        avoid:
          "Avoid rounding through the lower back."
      };
    }


    if (
      name.includes("hip thrust") ||
      name.includes("glute bridge")
    ) {

      return {
        type:"bridge",
        cues:[
          "Keep ribs down.",
          "Drive through the heels.",
          "Squeeze the glutes at the top.",
          "Finish with hips fully extended."
        ],
        avoid:
          "Avoid overextending the lower back."
      };
    }


    if (
      name.includes("bench") ||
      name.includes("chest press") ||
      name.includes("push up") ||
      name.includes("push-up") ||
      name.includes("pec")
    ) {

      return {
        type:"press",
        cues:[
          "Keep feet planted.",
          "Set the shoulder blades back.",
          "Lower under control.",
          "Press evenly through both arms."
        ],
        avoid:
          "Avoid letting the shoulders roll forward."
      };
    }


    if (
      name.includes("shoulder press") ||
      name.includes("overhead press") ||
      name.includes("military press")
    ) {

      return {
        type:"overhead",
        cues:[
          "Brace the trunk.",
          "Start with wrists stacked.",
          "Press upward smoothly.",
          "Finish with the arms overhead."
        ],
        avoid:
          "Avoid excessive lower-back arch."
      };
    }


    if (
      name.includes("lateral raise") ||
      name.includes("front raise")
    ) {

      return {
        type:"raise",
        cues:[
          "Keep the torso still.",
          "Use a soft bend at the elbow.",
          "Raise under control.",
          "Lower slowly."
        ],
        avoid:
          "Avoid swinging the weight."
      };
    }


    if (
      name.includes("row")
    ) {

      return {
        type:"row",
        cues:[
          "Set the shoulders before pulling.",
          "Drive the elbows back.",
          "Keep the torso controlled.",
          "Squeeze the upper back."
        ],
        avoid:
          "Avoid shrugging the shoulders."
      };
    }


    if (
      name.includes("pulldown") ||
      name.includes("pull down") ||
      name.includes("pull-up") ||
      name.includes("pull up") ||
      name.includes("chin-up") ||
      name.includes("chin up")
    ) {

      return {
        type:"pull",
        cues:[
          "Set the shoulders down.",
          "Drive the elbows toward the ribs.",
          "Keep the chest lifted.",
          "Control the return."
        ],
        avoid:
          "Avoid pulling behind the neck."
      };
    }


    if (
      name.includes("curl") &&
      !name.includes("leg")
    ) {

      return {
        type:"curl",
        cues:[
          "Keep elbows close to the body.",
          "Curl without swinging.",
          "Squeeze at the top.",
          "Lower under control."
        ],
        avoid:
          "Avoid using momentum."
      };
    }


    if (
      name.includes("tricep") ||
      name.includes("pushdown") ||
      name.includes("push down")
    ) {

      return {
        type:"triceps",
        cues:[
          "Keep elbows fixed.",
          "Extend fully.",
          "Keep shoulders relaxed.",
          "Control the return."
        ],
        avoid:
          "Avoid letting the elbows drift."
      };
    }


    if (
      name.includes("leg curl") ||
      name.includes("hamstring curl")
    ) {

      return {
        type:"legcurl",
        cues:[
          "Keep the hips stable.",
          "Curl smoothly.",
          "Squeeze the hamstrings.",
          "Control the lowering phase."
        ],
        avoid:
          "Avoid lifting the hips."
      };
    }


    if (
      name.includes("leg extension")
    ) {

      return {
        type:"legextension",
        cues:[
          "Keep the hips against the pad.",
          "Extend smoothly.",
          "Squeeze the quads.",
          "Lower under control."
        ],
        avoid:
          "Avoid kicking the weight."
      };
    }


    if (
      name.includes("calf")
    ) {

      return {
        type:"calf",
        cues:[
          "Use a full range of motion.",
          "Pause at the top.",
          "Lower the heel slowly.",
          "Keep the ankle controlled."
        ],
        avoid:
          "Avoid bouncing through the reps."
      };
    }


    return {
      type:"generic",
      cues:[
        "Set your position before starting.",
        "Move through a comfortable range.",
        "Keep the movement controlled.",
        "Maintain good posture throughout."
      ],
      avoid:
        "Avoid rushing the movement."
    };
  }


  /* =========================================
     STATIC START / FINISH FIGURE
     ========================================= */

  function figure(
    type,
    finish
  ) {

    let torsoRotate =
      0;

    let torsoX =
      90;

    let torsoY =
      75;

    let leftArm =
      "M69 82 Q49 98 42 121";

    let rightArm =
      "M111 82 Q131 98 138 121";

    let leftLeg =
      "M78 136 Q67 165 64 211";

    let rightLeg =
      "M102 136 Q113 165 116 211";


    if (
      type === "squat" &&
      finish
    ) {

      leftLeg =
        "M78 136 Q56 153 46 187";

      rightLeg =
        "M102 136 Q124 153 134 187";
    }


    if (
      type === "lunge" &&
      finish
    ) {

      leftLeg =
        "M78 136 Q51 158 41 203";

      rightLeg =
        "M102 136 Q123 170 151 192";
    }


    if (
      type === "hinge" &&
      finish
    ) {

      torsoRotate =
        30;

      torsoX =
        100;

      torsoY =
        83;

      leftArm =
        "M85 91 Q95 121 101 149";

      rightArm =
        "M112 88 Q121 118 127 146";
    }


    if (
      type === "press"
    ) {

      if (finish) {

        leftArm =
          "M69 82 Q43 74 17 75";

        rightArm =
          "M111 82 Q137 74 163 75";

      } else {

        leftArm =
          "M69 82 Q51 94 43 111";

        rightArm =
          "M111 82 Q129 94 137 111";
      }
    }


    if (
      type === "overhead"
    ) {

      if (finish) {

        leftArm =
          "M69 82 Q60 51 62 20";

        rightArm =
          "M111 82 Q120 51 118 20";

      } else {

        leftArm =
          "M69 82 Q52 81 43 94";

        rightArm =
          "M111 82 Q128 81 137 94";
      }
    }


    if (
      type === "raise"
    ) {

      if (finish) {

        leftArm =
          "M69 82 Q39 75 10 80";

        rightArm =
          "M111 82 Q141 75 170 80";
      }
    }


    if (
      type === "row"
    ) {

      torsoRotate =
        24;


      if (finish) {

        leftArm =
          "M77 88 Q60 91 47 82";

        rightArm =
          "M111 86 Q96 92 82 83";

      } else {

        leftArm =
          "M77 88 Q50 112 40 137";

        rightArm =
          "M111 86 Q139 108 150 132";
      }
    }


    if (
      type === "pull"
    ) {

      if (finish) {

        leftArm =
          "M69 82 Q50 65 42 90";

        rightArm =
          "M111 82 Q130 65 138 90";

      } else {

        leftArm =
          "M69 82 Q58 47 56 15";

        rightArm =
          "M111 82 Q122 47 124 15";
      }
    }


    if (
      type === "curl"
    ) {

      if (finish) {

        leftArm =
          "M69 82 Q51 91 55 66";

        rightArm =
          "M111 82 Q129 91 125 66";
      }
    }


    if (
      type === "triceps"
    ) {

      if (finish) {

        leftArm =
          "M69 82 Q57 100 56 128";

        rightArm =
          "M111 82 Q123 100 124 128";
      }
    }


    return `

      <svg
        class="mana-v970-figure"
        viewBox="0 0 180 225"
        aria-hidden="true"
      >

        <ellipse
          cx="90"
          cy="215"
          rx="50"
          ry="6"
          class="mana-v970-shadow"
        />


        <ellipse
          cx="${torsoX}"
          cy="${torsoY - 47}"
          rx="16"
          ry="19"
          class="mana-v970-body"
        />


        <path
          d="
            M${torsoX - 9} ${torsoY - 31}
            L${torsoX - 8} ${torsoY - 22}
            L${torsoX + 8} ${torsoY - 22}
            L${torsoX + 9} ${torsoY - 31}
            Z
          "
          class="mana-v970-body"
        />


        <g
          transform="
            rotate(
              ${torsoRotate}
              ${torsoX}
              ${torsoY}
            )
          "
        >

          <path
            d="
              M${torsoX - 27} ${torsoY - 19}
              Q${torsoX} ${torsoY - 32}
              ${torsoX + 27} ${torsoY - 19}
              L${torsoX + 21} ${torsoY + 50}
              Q${torsoX} ${torsoY + 62}
              ${torsoX - 21} ${torsoY + 50}
              Z
            "
            class="mana-v970-body"
          />

        </g>


        <path
          d="${leftArm}"
          class="mana-v970-limb"
        />


        <path
          d="${rightArm}"
          class="mana-v970-limb"
        />


        <path
          d="${leftLeg}"
          class="
            mana-v970-limb
            leg
          "
        />


        <path
          d="${rightLeg}"
          class="
            mana-v970-limb
            leg
          "
        />

      </svg>

    `;
  }


  /* =========================================
     STYLE
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

      /* =====================================
         WORKOUT SCREEN
         ===================================== */

      #manaStrengthV64Workout
      .mana-v64-shell{

        max-width:
          720px !important;
      }


      #manaStrengthV64Workout
      .mana-v64-head{

        margin-bottom:
          13px !important;
      }


      #manaStrengthV64Workout
      #manaV64Title{

        margin-top:
          6px !important;

        font-size:
          30px !important;
      }


      /*
        TOP SUMMARY:
        TIME + SETS ONLY
      */

      #manaStrengthV64Workout
      .mana-v64-summary{

        grid-template-columns:
          repeat(
            2,
            minmax(0,1fr)
          ) !important;

        gap:
          9px !important;

        margin:
          12px
          0
          10px !important;
      }


      #manaStrengthV64Workout
      .mana-v64-stat{

        padding:
          12px
          14px !important;

        border-radius:
          14px !important;

        background:
          #0c0c0c !important;
      }


      #manaStrengthV64Workout
      .mana-v64-stat:nth-child(3),

      #manaStrengthV64Workout
      .mana-v64-stat:nth-child(4){

        display:
          none !important;
      }


      #manaStrengthV64Workout
      .mana-v64-stat strong{

        font-size:
          20px !important;
      }


      #manaStrengthV64Workout
      .mana-v64-progress{

        height:
          5px !important;

        margin-bottom:
          17px !important;
      }


      /* =====================================
         EXERCISE CARD
         ===================================== */

      #manaV64Exercises
      .mana-v64-card{

        padding:
          18px !important;

        margin:
          12px
          0 !important;

        border:
          1px solid
          #302f29 !important;

        border-radius:
          20px !important;

        background:
          #0c0c0b !important;

        box-shadow:
          none !important;
      }


      #manaV64Exercises
      .mana-v64-name{

        color:#fff !important;

        font-size:
          21px !important;

        font-weight:
          950 !important;
      }


      #manaV64Exercises
      .mana-v64-target{

        margin-top:
          5px !important;

        color:
          #a8a8a8 !important;

        font-size:
          13px !important;
      }


      /*
        OLD VISUAL CLUTTER OFF
      */

      #manaV64Exercises
      .mana-v955-exercise-head,

      #manaV64Exercises
      .mana-v955-demo-button{

        display:
          none !important;
      }


      /* =====================================
         PREVIOUS / PROGRESSION
         ===================================== */

      #manaV64Exercises
      .mana-v64-previous,

      #manaV64Exercises
      .mana-v64-suggestion{

        display:
          none !important;
      }


      .mana-v970-disclosure{

        margin-top:
          13px;

        display:
          grid;

        grid-template-columns:
          1fr
          1fr;

        gap:
          8px;
      }


      .mana-v970-action{

        min-height:
          44px;

        padding:
          9px
          10px;

        border:
          1px solid
          #39372d;

        border-radius:
          12px;

        background:
          #11110f;

        color:
          #ccc;

        font-size:
          11px;

        font-weight:
          900;

        letter-spacing:
          .02em;

        touch-action:
          manipulation;
      }


      .mana-v970-action.open{

        border-color:
          #756322;

        color:
          #f3d875;
      }


      .mana-v970-history{

        display:none;

        margin-top:
          9px;

        padding:
          13px
          14px;

        border:
          1px solid
          #3e3822;

        border-radius:
          13px;

        background:
          #12100a;
      }


      .mana-v970-history.open{

        display:block;
      }


      .mana-v970-history-label{

        color:
          #777;

        font-size:
          9px;

        font-weight:
          950;

        letter-spacing:
          .12em;

        text-transform:
          uppercase;
      }


      .mana-v970-history-copy{

        margin-top:
          6px;

        color:
          #bbb;

        font-size:
          13px;

        line-height:
          1.45;
      }


      .mana-v970-history-copy
      strong{

        color:
          #f3d875;

        font-weight:
          900;
      }


      /* =====================================
         SET LOGGING
         ===================================== */

      #manaV64Exercises
      .mana-v64-table-head{

        margin-top:
          17px !important;

        color:
          #777 !important;
      }


      #manaV64Exercises
      .mana-v64-set{

        margin-top:
          8px !important;
      }


      #manaV64Exercises
      .mana-v64-set input{

        padding:
          11px
          8px !important;

        background:
          #111 !important;

        border-color:
          #313131 !important;
      }


      #manaV64Exercises
      .mana-v64-check{

        background:
          #101010 !important;
      }


      #manaV64Exercises
      .mana-v64-check.done{

        background:
          #f3d875 !important;
      }


      /* =====================================
         ADJUST SETS
         ===================================== */

      #manaV64Exercises
      .mana-v64-controls{

        display:
          none !important;
      }


      .mana-v970-adjust{

        margin-top:
          10px;

        border:0;

        background:
          transparent;

        color:
          #777;

        font-size:
          11px;

        font-weight:
          800;
      }


      .mana-v970-controls-open
      .mana-v64-controls{

        display:
          flex !important;
      }


      /* =====================================
         FORM GUIDE MODAL
         ===================================== */

      #${GUIDE_ID}{

        position:
          fixed;

        inset:0;

        z-index:
          99000;

        display:none;

        overflow:auto;

        padding:
          calc(
            env(safe-area-inset-top)
            +
            18px
          )
          16px
          calc(
            env(safe-area-inset-bottom)
            +
            28px
          );

        background:
          rgba(
            0,
            0,
            0,
            .94
          );
      }


      #${GUIDE_ID}.open{

        display:block;
      }


      .mana-v970-guide{

        width:
          min(
            620px,
            100%
          );

        margin:auto;

        padding:
          22px;

        border:
          1px solid
          #302f2a;

        border-radius:
          24px;

        background:
          #0a0a09;
      }


      .mana-v970-guide-head{

        display:flex;

        justify-content:
          space-between;

        align-items:
          flex-start;

        gap:
          15px;
      }


      .mana-v970-guide-kicker{

        color:
          #d1b458;

        font-size:
          10px;

        font-weight:
          950;

        letter-spacing:
          .13em;
      }


      .mana-v970-guide-title{

        margin-top:
          5px;

        color:#fff;

        font-size:
          27px;

        font-weight:
          950;

        line-height:
          1.05;
      }


      .mana-v970-guide-close{

        width:
          42px;

        height:
          42px;

        flex:
          0
          0
          42px;

        border:
          1px solid
          #333;

        border-radius:
          50%;

        background:
          #111;

        color:#fff;

        font-size:
          21px;
      }


      .mana-v970-poses{

        display:
          grid;

        grid-template-columns:
          1fr
          1fr;

        gap:
          10px;

        margin-top:
          20px;
      }


      .mana-v970-pose{

        min-height:
          230px;

        display:flex;

        flex-direction:
          column;

        align-items:
          center;

        justify-content:
          center;

        padding:
          12px;

        border:
          1px solid
          #292929;

        border-radius:
          18px;

        background:
          #0e0e0e;
      }


      .mana-v970-pose-label{

        margin-bottom:
          4px;

        color:
          #f3d875;

        font-size:
          10px;

        font-weight:
          950;

        letter-spacing:
          .13em;
      }


      .mana-v970-figure{

        width:
          100%;

        max-width:
          170px;

        height:
          195px;
      }


      .mana-v970-body{

        fill:
          #888;

        stroke:
          #aaa;

        stroke-width:
          1.2;
      }


      .mana-v970-limb{

        fill:none;

        stroke:
          #929292;

        stroke-width:
          16;

        stroke-linecap:
          round;

        stroke-linejoin:
          round;
      }


      .mana-v970-limb.leg{

        stroke-width:
          19;
      }


      .mana-v970-shadow{

        fill:
          rgba(
            0,
            0,
            0,
            .45
          );
      }


      .mana-v970-cues{

        margin-top:
          18px;

        padding:
          17px;

        border:
          1px solid
          #353127;

        border-radius:
          17px;

        background:
          #11100c;
      }


      .mana-v970-cues h3{

        margin:
          0
          0
          11px;

        color:#fff;

        font-size:
          17px;
      }


      .mana-v970-cues ul{

        margin:
          0;

        padding-left:
          19px;

        color:
          #c1c1c1;

        font-size:
          14px;

        line-height:
          1.6;
      }


      .mana-v970-avoid{

        margin-top:
          13px;

        padding-top:
          12px;

        border-top:
          1px solid
          #29271f;

        color:
          #999;

        font-size:
          13px;

        line-height:
          1.5;
      }


      .mana-v970-avoid strong{

        color:
          #d5b95e;
      }


      @media(max-width:500px){

        .mana-v970-disclosure{

          grid-template-columns:
            1fr;
        }


        .mana-v970-guide{

          padding:
            18px
            15px;
        }


        .mana-v970-guide-title{

          font-size:
            23px;
        }


        .mana-v970-pose{

          min-height:
            190px;
        }


        .mana-v970-figure{

          height:
            165px;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     GUIDE MODAL
     ========================================= */

  function ensureGuide() {

    if (
      document.getElementById(
        GUIDE_ID
      )
    ) {

      return;
    }


    const modal =
      document.createElement(
        "div"
      );


    modal.id =
      GUIDE_ID;


    document.body
      .appendChild(
        modal
      );


    modal.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          modal
        ) {

          closeGuide();

        }

      }
    );
  }


  function openGuide(
    name
  ) {

    ensureGuide();


    const info =
      exerciseInfo(
        name
      );


    const modal =
      document.getElementById(
        GUIDE_ID
      );


    modal.innerHTML = `

      <div
        class="mana-v970-guide"
      >

        <div
          class="mana-v970-guide-head"
        >

          <div>

            <div
              class="mana-v970-guide-kicker"
            >
              FORM GUIDE
            </div>


            <div
              class="mana-v970-guide-title"
            >
              ${name}
            </div>

          </div>


          <button
            type="button"
            class="mana-v970-guide-close"
            id="manaV970GuideClose"
          >
            ×
          </button>

        </div>


        <div
          class="mana-v970-poses"
        >

          <div
            class="mana-v970-pose"
          >

            <div
              class="mana-v970-pose-label"
            >
              START
            </div>

            ${figure(
              info.type,
              false
            )}

          </div>


          <div
            class="mana-v970-pose"
          >

            <div
              class="mana-v970-pose-label"
            >
              FINISH
            </div>

            ${figure(
              info.type,
              true
            )}

          </div>

        </div>


        <div
          class="mana-v970-cues"
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
            class="mana-v970-avoid"
          >
            <strong>
              Avoid:
            </strong>

            ${info.avoid}
          </div>

        </div>

      </div>

    `;


    document
      .getElementById(
        "manaV970GuideClose"
      )
      .onclick =
        closeGuide;


    modal.classList.add(
      "open"
    );


    document.body.style.overflow =
      "hidden";
  }


  function closeGuide() {

    document
      .getElementById(
        GUIDE_ID
      )
      ?.classList
      .remove(
        "open"
      );


    document.body.style.overflow =
      "";
  }


  /* =========================================
     SIMPLIFY EXERCISE CARD
     ========================================= */

  function enhanceCard(
    card
  ) {

    if (
      card.dataset
        .v970Ready ===
      "1"
    ) {

      return;
    }


    const name =
      card.dataset
        .exerciseName ||
      card
        .querySelector(
          ".mana-v64-name"
        )
        ?.textContent
        ?.trim() ||
      "Exercise";


    const previous =
      card.querySelector(
        ".mana-v64-previous"
      );


    const suggestion =
      card.querySelector(
        ".mana-v64-suggestion"
      );


    const target =
      card.querySelector(
        ".mana-v64-target"
      );


    /*
      CREATE TWO SIMPLE ACTIONS
    */

    const disclosure =
      document.createElement(
        "div"
      );


    disclosure.className =
      "mana-v970-disclosure";


    disclosure.innerHTML = `

      <button
        type="button"
        class="mana-v970-action"
        data-v970-history
      >
        PREVIOUS & PROGRESSION
      </button>


      <button
        type="button"
        class="mana-v970-action"
        data-v970-guide
      >
        FORM GUIDE
      </button>

    `;


    target
      ?.insertAdjacentElement(
        "afterend",
        disclosure
      );


    /*
      HISTORY PANEL
    */

    const history =
      document.createElement(
        "div"
      );


    history.className =
      "mana-v970-history";


    history.innerHTML = `

      <div
        class="mana-v970-history-label"
      >
        PREVIOUS WORKOUT
      </div>


      <div
        class="mana-v970-history-copy"
      >
        ${
          previous
            ?.textContent
            ?.trim() ||
          "No previous workout recorded."
        }
      </div>


      <div
        class="mana-v970-history-label"
        style="margin-top:12px"
      >
        SUGGESTED PROGRESSION
      </div>


      <div
        class="mana-v970-history-copy"
      >
        <strong>
          ${
            suggestion
              ?.textContent
              ?.trim() ||
            "Build quality reps with good form."
          }
        </strong>
      </div>

    `;


    disclosure
      .insertAdjacentElement(
        "afterend",
        history
      );


    disclosure
      .querySelector(
        "[data-v970-history]"
      )
      .onclick =
        event => {

          const button =
            event.currentTarget;


          const opening =
            !history.classList
              .contains(
                "open"
              );


          history.classList
            .toggle(
              "open",
              opening
            );


          button.classList
            .toggle(
              "open",
              opening
            );

        };


    disclosure
      .querySelector(
        "[data-v970-guide]"
      )
      .onclick =
        () => {

          openGuide(
            name
          );

        };


    /*
      COLLAPSE SET ADJUSTMENT
    */

    const controls =
      card.querySelector(
        ".mana-v64-controls"
      );


    if (controls) {

      const adjust =
        document.createElement(
          "button"
        );


      adjust.type =
        "button";


      adjust.className =
        "mana-v970-adjust";


      adjust.textContent =
        "Adjust number of sets";


      controls
        .insertAdjacentElement(
          "beforebegin",
          adjust
        );


      adjust.onclick =
        () => {

          const open =
            !card.classList
              .contains(
                "mana-v970-controls-open"
              );


          card.classList
            .toggle(
              "mana-v970-controls-open",
              open
            );


          adjust.textContent =
            open
              ? "Hide set controls"
              : "Adjust number of sets";

        };

    }


    card.dataset.v970Ready =
      "1";
  }


  function enhanceCards() {

    document
      .querySelectorAll(
        "#manaV64Exercises " +
        ".mana-v64-card"
      )
      .forEach(
        enhanceCard
      );
  }


  /* =========================================
     REFRESH
     ========================================= */

  function scheduleRefresh() {

    [
      80,
      220,
      500,
      900
    ].forEach(
      delay => {

        setTimeout(
          enhanceCards,
          delay
        );

      }
    );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    ensureGuide();


    /*
      Workout is created dynamically.
      Catch entry into a workout and then
      simplify once the existing logger
      and visual scripts have finished.
    */

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            ".mana-v85-start"
          ) ||
          event.target.closest(
            "[data-v85-day]"
          )
        ) {

          scheduleRefresh();

        }

      },
      true
    );


    window.addEventListener(
      "mana:workout-progress-change",
      scheduleRefresh
    );


    /*
      Safety for manually opened/resumed
      workouts.
    */

    [
      600,
      1400
    ].forEach(
      delay => {

        setTimeout(
          enhanceCards,
          delay
        );

      }
    );


    window
      .MANA_SIMPLE_WORKOUT_BUILD =
      BUILD;


    window
      .refreshManaSimpleWorkout =
      scheduleRefresh;


    console.log(
      "[Mana v9.70.0] simplified workout ready"
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
