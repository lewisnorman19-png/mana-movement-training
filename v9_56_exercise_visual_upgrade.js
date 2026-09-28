/* =========================================
   MANA MOVEMENT TRAINING v9.56.0
   EXERCISE VISUAL UPGRADE

   - Bigger, clearer muscle diagrams
   - Upper body only for upper-body exercises
   - Lower body only for lower-body exercises
   - Full body for compound movements
   - More anatomical illustration style
   - Better START → FINISH exercise graphics
   - Works on top of v9.55
   - No workout logging changes
   - No auth / Fuel changes
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "95600";


  const STYLE_ID =
    "mana-v956-exercise-visual-style";


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


    /* CHEST */

    if (
      name.includes("bench") ||
      name.includes("chest press") ||
      name.includes("push up") ||
      name.includes("push-up") ||
      name.includes("pec")
    ) {

      return {
        type:"press",
        region:"upper",
        view:"front",
        label:"Chest + Triceps",
        muscles:[
          "chest",
          "triceps"
        ]
      };
    }


    /* SHOULDERS */

    if (
      name.includes("shoulder press") ||
      name.includes("overhead press") ||
      name.includes("military press")
    ) {

      return {
        type:"overhead",
        region:"upper",
        view:"front",
        label:"Shoulders + Triceps",
        muscles:[
          "shoulders",
          "triceps"
        ]
      };
    }


    if (
      name.includes("lateral raise") ||
      name.includes("front raise")
    ) {

      return {
        type:"raise",
        region:"upper",
        view:"front",
        label:"Shoulders",
        muscles:[
          "shoulders"
        ]
      };
    }


    /* BACK */

    if (
      name.includes("row")
    ) {

      return {
        type:"row",
        region:"upper",
        view:"back",
        label:"Upper Back + Lats",
        muscles:[
          "back",
          "lats"
        ]
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
        region:"upper",
        view:"back",
        label:"Lats + Upper Back",
        muscles:[
          "lats",
          "back"
        ]
      };
    }


    /* ARMS */

    if (
      name.includes("curl") &&
      !name.includes("leg")
    ) {

      return {
        type:"curl",
        region:"upper",
        view:"front",
        label:"Biceps",
        muscles:[
          "biceps"
        ]
      };
    }


    if (
      name.includes("tricep") ||
      name.includes("pushdown") ||
      name.includes("push down")
    ) {

      return {
        type:"triceps",
        region:"upper",
        view:"back",
        label:"Triceps",
        muscles:[
          "triceps"
        ]
      };
    }


    /* QUADS / GLUTES */

    if (
      name.includes("squat") ||
      name.includes("leg press") ||
      name.includes("hack squat")
    ) {

      return {
        type:"squat",
        region:"lower",
        view:"front",
        label:"Quads + Glutes",
        muscles:[
          "quads",
          "glutes"
        ]
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
        region:"lower",
        view:"front",
        label:"Quads + Glutes",
        muscles:[
          "quads",
          "glutes"
        ]
      };
    }


    /* POSTERIOR CHAIN */

    if (
      name.includes("deadlift") ||
      name.includes("rdl") ||
      name.includes("romanian") ||
      name.includes("good morning")
    ) {

      return {
        type:"hinge",
        region:"full",
        view:"back",
        label:"Hamstrings + Glutes",
        muscles:[
          "hamstrings",
          "glutes"
        ]
      };
    }


    if (
      name.includes("hip thrust") ||
      name.includes("glute bridge")
    ) {

      return {
        type:"bridge",
        region:"lower",
        view:"back",
        label:"Glutes",
        muscles:[
          "glutes"
        ]
      };
    }


    if (
      name.includes("leg curl") ||
      name.includes("hamstring curl")
    ) {

      return {
        type:"legcurl",
        region:"lower",
        view:"back",
        label:"Hamstrings",
        muscles:[
          "hamstrings"
        ]
      };
    }


    if (
      name.includes("leg extension")
    ) {

      return {
        type:"legextension",
        region:"lower",
        view:"front",
        label:"Quads",
        muscles:[
          "quads"
        ]
      };
    }


    if (
      name.includes("calf") ||
      name.includes("calves")
    ) {

      return {
        type:"calf",
        region:"lower",
        view:"back",
        label:"Calves",
        muscles:[
          "calves"
        ]
      };
    }


    /* CORE */

    if (
      name.includes("plank") ||
      name.includes("crunch") ||
      name.includes("sit up") ||
      name.includes("sit-up") ||
      name.includes("core") ||
      name.includes("ab ")
    ) {

      return {
        type:"core",
        region:"upper",
        view:"front",
        label:"Core",
        muscles:[
          "core"
        ]
      };
    }


    /* GENERIC */

    return {
      type:"generic",
      region:"full",
      view:"front",
      label:"Primary Muscles",
      muscles:[]
    };
  }


  function has(
    info,
    muscle
  ) {

    return info
      .muscles
      .includes(
        muscle
      );
  }


  /* =========================================
     ANATOMICAL BODY GRAPHIC
     ========================================= */

  function anatomySvg(
    info
  ) {

    const back =
      info.view ===
      "back";


    let viewBox =
      "0 0 180 250";


    if (
      info.region ===
      "upper"
    ) {

      viewBox =
        "0 0 180 155";
    }


    if (
      info.region ===
      "lower"
    ) {

      viewBox =
        "0 95 180 155";
    }


    return `

      <svg
        class="mana-v956-anatomy"
        viewBox="${viewBox}"
        role="img"
        aria-label="${info.label}"
      >

        <!-- HEAD -->

        <ellipse
          cx="90"
          cy="24"
          rx="18"
          ry="21"
          class="mana-v956-body"
        />


        <!-- NECK -->

        <path
          d="
            M78 41
            L77 55
            Q90 62 103 55
            L102 41
            Z
          "
          class="mana-v956-body"
        />


        <!-- TORSO -->

        <path
          d="
            M61 55
            Q90 44 119 55
            Q130 67 133 92
            L122 127
            Q109 140 90 141
            Q71 140 58 127
            L47 92
            Q50 67 61 55
            Z
          "
          class="mana-v956-body"
        />


        <!-- LEFT ARM -->

        <path
          d="
            M58 64
            Q40 69 34 87
            L20 126
            Q18 136 27 140
            Q36 142 40 132
            L53 98
            Q58 81 66 70
            Z
          "
          class="mana-v956-body"
        />


        <!-- RIGHT ARM -->

        <path
          d="
            M122 64
            Q140 69 146 87
            L160 126
            Q162 136 153 140
            Q144 142 140 132
            L127 98
            Q122 81 114 70
            Z
          "
          class="mana-v956-body"
        />


        <!-- PELVIS -->

        <path
          d="
            M65 130
            Q90 142 115 130
            L119 158
            Q106 168 90 169
            Q74 168 61 158
            Z
          "
          class="mana-v956-body"
        />


        <!-- LEFT LEG -->

        <path
          d="
            M65 155
            Q55 177 57 204
            L63 240
            Q73 247 80 238
            L84 199
            L82 165
            Z
          "
          class="mana-v956-body"
        />


        <!-- RIGHT LEG -->

        <path
          d="
            M115 155
            Q125 177 123 204
            L117 240
            Q107 247 100 238
            L96 199
            L98 165
            Z
          "
          class="mana-v956-body"
        />


        <!-- CHEST -->

        ${
          !back &&
          has(
            info,
            "chest"
          )
            ? `

              <path
                d="
                  M64 68
                  Q77 58 87 65
                  L86 94
                  Q72 96 61 86
                  Z
                "
                class="mana-v956-highlight"
              />

              <path
                d="
                  M116 68
                  Q103 58 93 65
                  L94 94
                  Q108 96 119 86
                  Z
                "
                class="mana-v956-highlight"
              />

            `
            : ""
        }


        <!-- SHOULDERS -->

        ${
          has(
            info,
            "shoulders"
          )
            ? `

              <ellipse
                cx="57"
                cy="68"
                rx="14"
                ry="13"
                class="mana-v956-highlight"
              />

              <ellipse
                cx="123"
                cy="68"
                rx="14"
                ry="13"
                class="mana-v956-highlight"
              />

            `
            : ""
        }


        <!-- BICEPS -->

        ${
          !back &&
          has(
            info,
            "biceps"
          )
            ? `

              <ellipse
                cx="42"
                cy="94"
                rx="9"
                ry="18"
                class="mana-v956-highlight"
              />

              <ellipse
                cx="138"
                cy="94"
                rx="9"
                ry="18"
                class="mana-v956-highlight"
              />

            `
            : ""
        }


        <!-- TRICEPS -->

        ${
          has(
            info,
            "triceps"
          )
            ? `

              <ellipse
                cx="35"
                cy="98"
                rx="8"
                ry="19"
                class="mana-v956-highlight"
              />

              <ellipse
                cx="145"
                cy="98"
                rx="8"
                ry="19"
                class="mana-v956-highlight"
              />

            `
            : ""
        }


        <!-- CORE -->

        ${
          !back &&
          has(
            info,
            "core"
          )
            ? `

              <path
                d="
                  M75 95
                  L105 95
                  L108 130
                  Q90 139 72 130
                  Z
                "
                class="mana-v956-highlight"
              />

            `
            : ""
        }


        <!-- BACK / LATS -->

        ${
          back &&
          (
            has(
              info,
              "back"
            ) ||
            has(
              info,
              "lats"
            )
          )
            ? `

              <path
                d="
                  M63 65
                  Q90 51 117 65
                  L122 101
                  Q108 128 90 134
                  Q72 128 58 101
                  Z
                "
                class="mana-v956-highlight"
              />

            `
            : ""
        }


        <!-- GLUTES -->

        ${
          has(
            info,
            "glutes"
          )
            ? `

              <ellipse
                cx="75"
                cy="157"
                rx="17"
                ry="15"
                class="mana-v956-highlight"
              />

              <ellipse
                cx="105"
                cy="157"
                rx="17"
                ry="15"
                class="mana-v956-highlight"
              />

            `
            : ""
        }


        <!-- QUADS -->

        ${
          !back &&
          has(
            info,
            "quads"
          )
            ? `

              <path
                d="
                  M65 171
                  Q58 195 64 228
                  Q74 238 81 227
                  L83 181
                  Z
                "
                class="mana-v956-highlight"
              />

              <path
                d="
                  M115 171
                  Q122 195 116 228
                  Q106 238 99 227
                  L97 181
                  Z
                "
                class="mana-v956-highlight"
              />

            `
            : ""
        }


        <!-- HAMSTRINGS -->

        ${
          back &&
          has(
            info,
            "hamstrings"
          )
            ? `

              <path
                d="
                  M65 171
                  L82 169
                  L80 228
                  Q72 238 64 228
                  Z
                "
                class="mana-v956-highlight"
              />

              <path
                d="
                  M115 171
                  L98 169
                  L100 228
                  Q108 238 116 228
                  Z
                "
                class="mana-v956-highlight"
              />

            `
            : ""
        }


        <!-- CALVES -->

        ${
          has(
            info,
            "calves"
          )
            ? `

              <ellipse
                cx="66"
                cy="225"
                rx="9"
                ry="15"
                class="mana-v956-highlight"
              />

              <ellipse
                cx="114"
                cy="225"
                rx="9"
                ry="15"
                class="mana-v956-highlight"
              />

            `
            : ""
        }

      </svg>

    `;
  }


  /* =========================================
     SEMI-REALISTIC EXERCISE FIGURE
     ========================================= */

  function demoFigure(
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


    /* SQUAT */

    if (
      type ===
      "squat"
    ) {

      if (
        finish
      ) {

        leftLeg =
          "M78 136 Q56 153 46 187";

        rightLeg =
          "M102 136 Q124 153 134 187";
      }
    }


    /* LUNGE */

    if (
      type ===
      "lunge"
    ) {

      if (
        finish
      ) {

        leftLeg =
          "M78 136 Q51 158 41 203";

        rightLeg =
          "M102 136 Q123 170 151 192";
      }
    }


    /* HINGE */

    if (
      type ===
      "hinge"
    ) {

      if (
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
    }


    /* BENCH / CHEST PRESS */

    if (
      type ===
      "press"
    ) {

      if (
        finish
      ) {

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


    /* OVERHEAD PRESS */

    if (
      type ===
      "overhead"
    ) {

      if (
        finish
      ) {

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


    /* LATERAL RAISE */

    if (
      type ===
      "raise"
    ) {

      if (
        finish
      ) {

        leftArm =
          "M69 82 Q39 75 10 80";

        rightArm =
          "M111 82 Q141 75 170 80";

      } else {

        leftArm =
          "M69 82 Q51 104 46 126";

        rightArm =
          "M111 82 Q129 104 134 126";
      }
    }


    /* ROW */

    if (
      type ===
      "row"
    ) {

      torsoRotate =
        24;


      if (
        finish
      ) {

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


    /* PULLDOWN */

    if (
      type ===
      "pull"
    ) {

      if (
        finish
      ) {

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


    /* CURL */

    if (
      type ===
      "curl"
    ) {

      if (
        finish
      ) {

        leftArm =
          "M69 82 Q51 91 55 66";

        rightArm =
          "M111 82 Q129 91 125 66";

      } else {

        leftArm =
          "M69 82 Q51 105 46 127";

        rightArm =
          "M111 82 Q129 105 134 127";
      }
    }


    /* TRICEPS */

    if (
      type ===
      "triceps"
    ) {

      if (
        finish
      ) {

        leftArm =
          "M69 82 Q57 100 56 128";

        rightArm =
          "M111 82 Q123 100 124 128";

      } else {

        leftArm =
          "M69 82 Q54 92 49 107";

        rightArm =
          "M111 82 Q126 92 131 107";
      }
    }


    return `

      <svg
        class="mana-v956-demo-figure"
        viewBox="0 0 180 225"
        role="img"
      >

        <!-- SOFT SHADOW -->

        <ellipse
          cx="90"
          cy="215"
          rx="51"
          ry="7"
          class="mana-v956-shadow"
        />


        <!-- HEAD -->

        <ellipse
          cx="${torsoX}"
          cy="${torsoY - 47}"
          rx="16"
          ry="19"
          class="mana-v956-demo-body"
        />


        <!-- NECK -->

        <path
          d="
            M${torsoX - 9} ${torsoY - 31}
            L${torsoX - 8} ${torsoY - 22}
            L${torsoX + 8} ${torsoY - 22}
            L${torsoX + 9} ${torsoY - 31}
            Z
          "
          class="mana-v956-demo-body"
        />


        <!-- TORSO -->

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
            class="mana-v956-demo-body"
          />


          <!-- CHEST / TORSO DETAIL -->

          <path
            d="
              M${torsoX - 16} ${torsoY - 8}
              Q${torsoX} ${torsoY - 15}
              ${torsoX + 16} ${torsoY - 8}
            "
            class="mana-v956-detail"
          />

        </g>


        <!-- ARMS -->

        <path
          d="${leftArm}"
          class="mana-v956-demo-arm"
        />

        <path
          d="${rightArm}"
          class="mana-v956-demo-arm"
        />


        <!-- LEGS -->

        <path
          d="${leftLeg}"
          class="mana-v956-demo-leg"
        />

        <path
          d="${rightLeg}"
          class="mana-v956-demo-leg"
        />


        <!-- SHOULDER JOINT DETAIL -->

        <circle
          cx="69"
          cy="82"
          r="7"
          class="mana-v956-joint"
        />

        <circle
          cx="111"
          cy="82"
          r="7"
          class="mana-v956-joint"
        />

      </svg>

    `;
  }


  function betterDemo(
    info
  ) {

    return `

      <div
        class="mana-v956-demo-stage"
      >

        <div
          class="mana-v956-demo-panel"
        >

          <div
            class="mana-v956-demo-label"
          >
            START
          </div>

          ${demoFigure(
            info.type,
            false
          )}

        </div>


        <div
          class="mana-v956-motion"
        >

          <div>
            →
          </div>

          <span>
            MOVE
          </span>

        </div>


        <div
          class="mana-v956-demo-panel"
        >

          <div
            class="mana-v956-demo-label"
          >
            FINISH
          </div>

          ${demoFigure(
            info.type,
            true
          )}

        </div>

      </div>

    `;
  }


  /* =========================================
     UPGRADE EXERCISE CARDS
     ========================================= */

  function upgradeCards() {

    document
      .querySelectorAll(
        "#manaV64Exercises .mana-v64-card"
      )
      .forEach(
        card => {

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


          const info =
            exerciseInfo(
              name
            );


          const mini =
            card.querySelector(
              ".mana-v955-muscle-mini"
            );


          if (
            !mini
          ) {
            return;
          }


          mini.innerHTML = `

            <div
              class="mana-v956-mini-graphic"
            >

              ${anatomySvg(
                info
              )}

            </div>

            <span>
              ${info.label}
            </span>

          `;

        }
      );
  }


  /* =========================================
     UPGRADE DEMO MODAL
     ========================================= */

  function upgradeModal(
    name
  ) {

    const info =
      exerciseInfo(
        name
      );


    const demo =
      document.getElementById(
        "manaV955Demo"
      );


    const muscle =
      document.getElementById(
        "manaV955Muscle"
      );


    const label =
      document.getElementById(
        "manaV955MuscleLabel"
      );


    if (
      demo
    ) {

      demo.innerHTML =
        betterDemo(
          info
        );
    }


    if (
      muscle
    ) {

      muscle.innerHTML =
        anatomySvg(
          info
        );
    }


    if (
      label
    ) {

      label.textContent =
        info.label;
    }
  }


  /* =========================================
     STYLES
     ========================================= */

  function injectStyles() {

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
         MUSCLE IMAGE ON EXERCISE CARD
         ===================================== */

      .mana-v955-exercise-head{
        margin-top:
          -39px !important;

        margin-bottom:
          6px !important;

        min-height:
          112px;
      }


      .mana-v955-muscle-mini{
        width:
          128px !important;

        min-height:
          108px;

        display:flex !important;

        flex-direction:column;

        justify-content:center;

        align-items:center;
      }


      .mana-v956-mini-graphic{
        width:104px;

        height:108px;

        display:flex;

        justify-content:center;

        align-items:center;
      }


      .mana-v956-anatomy{
        display:block;

        width:100%;

        height:100%;

        overflow:visible;
      }


      .mana-v956-body{
        fill:#353535;

        stroke:#686868;

        stroke-width:1.2;
      }


      .mana-v956-highlight{
        fill:#f3d875;

        stroke:#fff0a3;

        stroke-width:.7;

        filter:
          drop-shadow(
            0
            0
            5px
            rgba(
              243,
              216,
              117,
              .48
            )
          );
      }


      .mana-v955-muscle-mini span{
        width:100%;

        margin-top:3px;

        color:#c2c2c2 !important;

        font-size:8px !important;

        font-weight:900 !important;

        letter-spacing:.04em;

        line-height:1.25 !important;

        text-align:center;
      }


      /* =====================================
         DEMO MODAL
         ===================================== */

      .mana-v956-demo-stage{
        display:grid;

        grid-template-columns:
          minmax(
            0,
            1fr
          )
          42px
          minmax(
            0,
            1fr
          );

        gap:10px;

        align-items:center;

        margin-top:20px;
      }


      .mana-v956-demo-panel{
        min-height:265px;

        padding:
          14px
          8px;

        display:flex;

        flex-direction:column;

        align-items:center;

        justify-content:center;

        border:
          1px solid
          #3d3d3d;

        border-radius:20px;

        background:
          radial-gradient(
            circle at 50% 22%,
            #282828,
            #111 48%,
            #080808 80%
          );

        box-shadow:
          inset
          0
          0
          40px
          rgba(
            255,
            255,
            255,
            .025
          ),
          0
          12px
          30px
          rgba(
            0,
            0,
            0,
            .35
          );
      }


      .mana-v956-demo-label{
        margin-bottom:2px;

        color:#f3d875;

        font-size:9px;

        font-weight:900;

        letter-spacing:.11em;
      }


      .mana-v956-demo-figure{
        display:block;

        width:100%;

        max-width:175px;

        height:215px;

        overflow:visible;
      }


      .mana-v956-demo-body{
        fill:#9a9a9a;

        stroke:#c1c1c1;

        stroke-width:1.3;

        filter:
          drop-shadow(
            0
            6px
            7px
            rgba(
              0,
              0,
              0,
              .45
            )
          );
      }


      .mana-v956-demo-arm{
        fill:none;

        stroke:#9a9a9a;

        stroke-width:16;

        stroke-linecap:round;

        stroke-linejoin:round;

        filter:
          drop-shadow(
            0
            5px
            5px
            rgba(
              0,
              0,
              0,
              .45
            )
          );
      }


      .mana-v956-demo-leg{
        fill:none;

        stroke:#888;

        stroke-width:20;

        stroke-linecap:round;

        stroke-linejoin:round;

        filter:
          drop-shadow(
            0
            6px
            6px
            rgba(
              0,
              0,
              0,
              .45
            )
          );
      }


      .mana-v956-joint{
        fill:#adadad;

        opacity:.9;
      }


      .mana-v956-detail{
        fill:none;

        stroke:#c4c4c4;

        stroke-width:1.3;

        opacity:.55;
      }


      .mana-v956-shadow{
        fill:
          rgba(
            0,
            0,
            0,
            .55
          );
      }


      .mana-v956-motion{
        display:flex;

        flex-direction:column;

        justify-content:center;

        align-items:center;

        gap:4px;

        color:#f3d875;
      }


      .mana-v956-motion div{
        font-size:30px;

        font-weight:900;

        line-height:1;
      }


      .mana-v956-motion span{
        color:#8d8d8d;

        font-size:7px;

        font-weight:900;

        letter-spacing:.08em;
      }


      /* =====================================
         BIG TARGET MUSCLE CARD IN MODAL
         ===================================== */

      .mana-v955-modal-muscle{
        grid-template-columns:
          135px
          1fr !important;

        gap:18px !important;

        padding:16px !important;

        margin-top:16px !important;
      }


      .mana-v955-modal-muscle
      #manaV955Muscle{
        width:125px;

        height:145px;

        display:flex;

        align-items:center;

        justify-content:center;
      }


      .mana-v955-modal-muscle
      .mana-v956-anatomy{
        width:120px;

        height:140px;
      }


      .mana-v955-modal-muscle
      strong{
        font-size:
          18px !important;
      }


      /* =====================================
         PHONE
         ===================================== */

      @media(
        max-width:600px
      ){

        .mana-v955-exercise-head{
          margin-top:
            -33px !important;

          min-height:
            103px;
        }


        .mana-v955-muscle-mini{
          width:
            110px !important;
        }


        .mana-v956-mini-graphic{
          width:90px;

          height:98px;
        }


        .mana-v956-demo-stage{
          grid-template-columns:
            minmax(
              0,
              1fr
            )
            28px
            minmax(
              0,
              1fr
            );

          gap:5px;
        }


        .mana-v956-demo-panel{
          min-height:230px;

          padding:
            10px
            4px;
        }


        .mana-v956-demo-figure{
          height:190px;
        }


        .mana-v956-motion div{
          font-size:23px;
        }


        .mana-v955-modal-muscle{
          grid-template-columns:
            105px
            1fr !important;

          gap:12px !important;
        }


        .mana-v955-modal-muscle
        #manaV955Muscle{
          width:98px;

          height:125px;
        }


        .mana-v955-modal-muscle
        .mana-v956-anatomy{
          width:95px;

          height:120px;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     REFRESH WORKOUT VISUALS
     ========================================= */

  function refresh() {

    [
      80,
      220,
      500,
      850
    ].forEach(
      delay => {

        setTimeout(
          upgradeCards,
          delay
        );

      }
    );
  }


  /* =========================================
     EVENTS
     ========================================= */

  function wireEvents() {

    document.addEventListener(
      "click",
      event => {

        /*
          DEMO BUTTON

          v9.55 opens the existing modal.
          v9.56 replaces the old graphics
          immediately afterwards.
        */

        const demoButton =
          event.target.closest(
            ".mana-v955-demo-button"
          );


        if (
          demoButton
        ) {

          const card =
            demoButton.closest(
              ".mana-v64-card"
            );


          const name =
            card?.dataset
              ?.exerciseName ||
            card
              ?.querySelector(
                ".mana-v64-name"
              )
              ?.textContent
              ?.trim() ||
            "Exercise";


          setTimeout(
            () => {

              upgradeModal(
                name
              );

            },
            30
          );
        }


        /*
          PROGRAM TAB
        */

        if (
          event.target.closest(
            '#manaV83Tabs [data-v83-tab="program"]'
          )
        ) {

          refresh();
        }

      }
    );


    window.addEventListener(
      "mana:program-tab-change",
      refresh
    );


    window.addEventListener(
      "mana:strength-synced",
      refresh
    );


    window.addEventListener(
      "mana:workout-progress-change",
      refresh
    );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    injectStyles();

    wireEvents();


    setTimeout(
      refresh,
      900
    );
  }


  window.MANA_EXERCISE_VISUAL_UPGRADE_BUILD =
    BUILD;


  window.refreshManaExerciseVisualUpgrade =
    refresh;


  if (
    document.readyState ===
      "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {

    init();
  }

})();
