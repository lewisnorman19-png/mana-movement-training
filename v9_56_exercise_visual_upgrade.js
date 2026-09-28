/* =========================================
   MANA MOVEMENT TRAINING v9.56.0
   EXERCISE VISUAL UPGRADE

   - Bigger clearer muscle diagrams
   - Upper body only when upper body targeted
   - Lower body only when lower body targeted
   - Better anatomical proportions
   - Higher quality illustrated movement demo
   - Works on top of v9.55
   - No workout logic changes
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "95600";


  const STYLE_ID =
    "mana-v956-exercise-visual-style";


  /* =========================================
     CLASSIFY
     ========================================= */

  function exerciseInfo(
    rawName
  ) {

    const name =
      String(
        rawName || ""
      ).toLowerCase();


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


    if (
      name.includes("plank") ||
      name.includes("crunch") ||
      name.includes("sit up") ||
      name.includes("sit-up") ||
      name.includes("core")
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
     ANATOMICAL MUSCLE FIGURE
     ========================================= */

  function anatomySvg(
    info
  ) {

    const back =
      info.view ===
      "back";


    let viewBox =
      "0 0 160 220";


    if (
      info.region ===
      "upper"
    ) {

      viewBox =
        "0 0 160 145";
    }


    if (
      info.region ===
      "lower"
    ) {

      viewBox =
        "0 80 160 140";
    }


    return `

      <svg
        class="mana-v956-anatomy"
        viewBox="${viewBox}"
        aria-label="${info.label}"
      >

        <defs>

          <linearGradient
            id="manaV956Body"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0%"
              stop-color="#4b4b4b"
            />

            <stop
              offset="100%"
              stop-color="#202020"
            />

          </linearGradient>


          <linearGradient
            id="manaV956Gold"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0%"
              stop-color="#fff0a0"
            />

            <stop
              offset="100%"
              stop-color="#d4af37"
            />

          </linearGradient>

        </defs>


        <!-- HEAD -->

        <ellipse
          cx="80"
          cy="22"
          rx="17"
          ry="19"
          class="mana-v956-body"
        />


        <!-- NECK -->

        <path
          d="
            M69 38
            L68 52
            Q80 59 92 52
            L91 38
          "
          class="mana-v956-body"
        />


        <!-- TORSO -->

        <path
          d="
            M55 52
            Q80 43 105 52
            Q116 60 120 83
            L111 118
            Q101 130 80 132
            Q59 130 49 118
            L40 83
            Q44 60 55 52
            Z
          "
          class="mana-v956-body"
        />


        <!-- LEFT ARM -->

        <path
          d="
            M48 60
            Q32 65 26 82
            L15 118
            Q14 127 22 130
            Q30 132 34 123
            L46 91
            Q51 75 58 65
            Z
          "
          class="mana-v956-body"
        />


        <!-- RIGHT ARM -->

        <path
          d="
            M112 60
            Q128 65 134 82
            L145 118
            Q146 127 138 130
            Q130 132 126 123
            L114 91
            Q109 75 102 65
            Z
          "
          class="mana-v956-body"
        />


        <!-- PELVIS -->

        <path
          d="
            M57 121
            Q80 133 103 121
            L108 144
            Q96 153 80 153
            Q64 153 52 144
            Z
          "
          class="mana-v956-body"
        />


        <!-- LEFT THIGH -->

        <path
          d="
            M57 143
            Q47 162 50 186
            L57 211
            Q66 216 72 209
            L76 177
            L74 151
            Z
          "
          class="mana-v956-body"
        />


        <!-- RIGHT THIGH -->

        <path
          d="
            M103 143
            Q113 162 110 186
            L103 211
            Q94 216 88 209
            L84 177
            L86 151
            Z
          "
          class="mana-v956-body"
        />


        ${
          !back &&
          has(
            info,
            "chest"
          )
            ? `
              <path
                d="
                  M57 63
                  Q68 54 78 61
                  L77 87
                  Q64 89 54 81
                  Z
                "
                class="mana-v956-highlight"
              />

              <path
                d="
                  M103 63
                  Q92 54 82 61
                  L83 87
                  Q96 89 106 81
                  Z
                "
                class="mana-v956-highlight"
              />
            `
            : ""
        }


        ${
          has(
            info,
            "shoulders"
          )
            ? `
              <ellipse
                cx="49"
                cy="64"
                rx="13"
                ry="12"
                class="mana-v956-highlight"
              />

              <ellipse
                cx="111"
                cy="64"
                rx="13"
                ry="12"
                class="mana-v956-highlight"
              />
            `
            : ""
        }


        ${
          !back &&
          has(
            info,
            "biceps"
          )
            ? `
              <ellipse
                cx="35"
                cy="88"
                rx="9"
                ry="17"
                class="mana-v956-highlight"
              />

              <ellipse
                cx="125"
                cy="88"
                rx="9"
                ry="17"
                class="mana-v956-highlight"
              />
            `
            : ""
        }


        ${
          has(
            info,
            "triceps"
          )
            ? `
              <ellipse
                cx="28"
                cy="91"
                rx="8"
                ry="18"
                class="mana-v956-highlight"
              />

              <ellipse
                cx="132"
                cy="91"
                rx="8"
                ry="18"
                class="mana-v956-highlight"
              />
            `
            : ""
        }


        ${
          !back &&
          has(
            info,
            "core"
          )
            ? `
              <path
                d="
                  M67 86
                  L93 86
                  L97 122
                  Q80 130 63 122
                  Z
                "
                class="mana-v956-highlight"
              />
            `
            : ""
        }


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
                  M55 59
                  Q80 48 105 59
                  L110 96
                  Q99 119 80 124
                  Q61 119 50 96
                  Z
                "
                class="mana-v956-highlight"
              />
            `
            : ""
        }


        ${
          has(
            info,
            "glutes"
          )
            ? `
              <ellipse
                cx="67"
                cy="141"
                rx="15"
                ry="13"
                class="mana-v956-highlight"
              />

              <ellipse
                cx="93"
                cy="141"
                rx="15"
                ry="13"
                class="mana-v956-highlight"
              />
            `
            : ""
        }


        ${
          !back &&
          has(
            info,
            "quads"
          )
            ? `
              <path
                d="
                  M57 154
                  Q50 175 57 203
                  Q66 210 72 201
                  L74 164
                  Z
                "
                class="mana-v956-highlight"
              />

              <path
                d="
                  M103 154
                  Q110 175 103 203
                  Q94 210 88 201
                  L86 164
                  Z
                "
                class="mana-v956-highlight"
              />
            `
            : ""
        }


        ${
          back &&
          has(
            info,
            "hamstrings"
          )
            ? `
              <path
                d="
                  M57 155
                  L74 154
                  L72 203
                  Q64 211 57 203
                  Z
                "
                class="mana-v956-highlight"
              />

              <path
                d="
                  M103 155
                  L86 154
                  L88 203
                  Q96 211 103 203
                  Z
                "
                class="mana-v956-highlight"
              />
            `
            : ""
        }


        ${
          has(
            info,
            "calves"
          )
            ? `
              <ellipse
                cx="59"
                cy="208"
                rx="8"
                ry="14"
                class="mana-v956-highlight"
              />

              <ellipse
                cx="101"
                cy="208"
                rx="8"
                ry="14"
                class="mana-v956-highlight"
              />
            `
            : ""
        }

      </svg>

    `;
  }


  /* =========================================
     HIGHER QUALITY DEMO FIGURE
     ========================================= */

  function demoFigure(
    type,
    finish
  ) {

    let torsoX =
      80;

    let torsoY =
      72;

    let rotate =
      0;

    let leftArm =
      "M61 79 Q44 93 37 112";

    let rightArm =
      "M99 79 Q116 93 123 112";

    let leftLeg =
      "M69 127 Q61 153 58 187";

    let rightLeg =
      "M91 127 Q99 153 102 187";


    if (
      type ===
      "squat"
    ) {

      leftLeg =
        finish
          ? "M69 127 Q49 143 42 173"
          : leftLeg;

      rightLeg =
        finish
          ? "M91 127 Q111 143 118 173"
          : rightLeg;
    }


    if (
      type ===
      "hinge"
    ) {

      rotate =
        finish
          ? 28
          : 0;

      torsoX =
        finish
          ? 92
          : 80;

      torsoY =
        finish
          ? 78
          : 72;
    }


    if (
      type ===
      "press"
    ) {

      leftArm =
        finish
          ? "M61 79 Q38 72 18 72"
          : "M61 79 Q46 91 38 104";

      rightArm =
        finish
          ? "M99 79 Q122 72 142 72"
          : "M99 79 Q114 91 122 104";
    }


    if (
      type ===
      "overhead"
    ) {

      leftArm =
        finish
          ? "M61 79 Q53 51 55 22"
          : "M61 79 Q47 78 39 91";

      rightArm =
        finish
          ? "M99 79 Q107 51 105 22"
          : "M99 79 Q113 78 121 91";
    }


    if (
      type ===
      "raise"
    ) {

      leftArm =
        finish
          ? "M61 79 Q35 72 12 76"
          : "M61 79 Q46 100 41 118";

      rightArm =
        finish
          ? "M99 79 Q125 72 148 76"
          : "M99 79 Q114 100 119 118";
    }


    if (
      type ===
      "curl"
    ) {

      leftArm =
        finish
          ? "M61 79 Q46 88 49 67"
          : "M61 79 Q45 101 40 119";

      rightArm =
        finish
          ? "M99 79 Q114 88 111 67"
          : "M99 79 Q115 101 120 119";
    }


    if (
      type ===
      "pull"
    ) {

      leftArm =
        finish
          ? "M61 79 Q46 66 39 86"
          : "M61 79 Q53 46 50 20";

      rightArm =
        finish
          ? "M99 79 Q114 66 121 86"
          : "M99 79 Q107 46 110 20";
    }


    if (
      type ===
      "row"
    ) {

      rotate =
        24;

      torsoX =
        90;

      leftArm =
        finish
          ? "M72 82 Q54 86 44 80"
          : "M72 82 Q48 104 39 124";

      rightArm =
        finish
          ? "M108 82 Q90 86 80 80"
          : "M108 82 Q132 104 141 124";
    }


    if (
      type ===
      "lunge"
    ) {

      leftLeg =
        finish
          ? "M69 127 Q45 147 37 181"
          : leftLeg;

      rightLeg =
        finish
          ? "M91 127 Q111 156 135 174"
          : rightLeg;
    }


    return `

      <svg
        viewBox="0 0 160 205"
        class="mana-v956-demo-figure"
      >

        <defs>

          <linearGradient
            id="manaV956Figure"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0%"
              stop-color="#dedede"
            />

            <stop
              offset="45%"
              stop-color="#939393"
            />

            <stop
              offset="100%"
              stop-color="#414141"
            />

          </linearGradient>

        </defs>


        <g
          transform="
            rotate(
              ${rotate}
              ${torsoX}
              ${torsoY}
            )
          "
        >

          <ellipse
            cx="${torsoX}"
            cy="${torsoY - 45}"
            rx="15"
            ry="17"
            class="mana-v956-demo-body"
          />


          <path
            d="
              M${torsoX - 22} ${torsoY - 19}
              Q${torsoX} ${torsoY - 30}
              ${torsoX + 22} ${torsoY - 19}
              L${torsoX + 18} ${torsoY + 48}
              Q${torsoX} ${torsoY + 61}
              ${torsoX - 18} ${torsoY + 48}
              Z
            "
            class="mana-v956-demo-body"
          />

        </g>


        <path
          d="${leftArm}"
          class="mana-v956-demo-limb"
        />

        <path
          d="${rightArm}"
          class="mana-v956-demo-limb"
        />

        <path
          d="${leftLeg}"
          class="mana-v956-demo-leg"
        />

        <path
          d="${rightLeg}"
          class="mana-v956-demo-leg"
        />


        <circle
          cx="80"
          cy="126"
          r="9"
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
            START POSITION
          </div>

          ${demoFigure(
            info.type,
            false
          )}

        </div>


        <div
          class="mana-v956-motion"
        >

          <span>
            →
          </span>

          <small>
            MOVE
          </small>

        </div>


        <div
          class="mana-v956-demo-panel"
        >

          <div
            class="mana-v956-demo-label"
          >
            FINISH POSITION
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
     CARD UPGRADE
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
            card.querySelector(
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
            mini
          ) {

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

        }
      );
  }


  /* =========================================
     MODAL UPGRADE
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
         CARD MUSCLE VISUAL
         ===================================== */

      .mana-v955-exercise-head{
        margin-top:-36px !important;

        margin-bottom:5px !important;
      }


      .mana-v955-muscle-mini{
        width:112px !important;
      }


      .mana-v956-mini-graphic{
        width:92px;

        height:105px;

        display:flex;

        align-items:center;

        justify-content:center;
      }


      .mana-v956-anatomy{
        width:100%;

        height:100%;

        overflow:visible;
      }


      .mana-v956-body{
        fill:
          url(
            #manaV956Body
          );

        stroke:#5a5a5a;

        stroke-width:1;
      }


      .mana-v956-highlight{
        fill:
          url(
            #manaV956Gold
          );

        filter:
          drop-shadow(
            0
            0
            4px
            rgba(
              243,
              216,
              117,
              .35
            )
          );
      }


      .mana-v955-muscle-mini span{
        width:100%;

        margin-top:1px;

        color:#b1b1b1 !important;

        font-size:8px !important;

        font-weight:900 !important;

        line-height:1.25 !important;
      }


      /* =====================================
         MODAL DEMO
         ===================================== */

      .mana-v956-demo-stage{
        display:grid;

        grid-template-columns:
          minmax(
            0,
            1fr
          )
          36px
          minmax(
            0,
            1fr
          );

        align-items:center;

        gap:10px;

        margin-top:20px;
      }


      .mana-v956-demo-panel{
        min-height:235px;

        padding:
          14px
          10px;

        display:flex;

        flex-direction:column;

        align-items:center;

        justify-content:center;

        border:
          1px solid
          #383838;

        border-radius:18px;

        background:
          radial-gradient(
            circle at 50% 20%,
            #242424,
            #090909 65%
          );

        box-shadow:
          inset
          0
          0
          0
          1px
          rgba(
            255,
            255,
            255,
            .02
          );
      }


      .mana-v956-demo-label{
        margin-bottom:4px;

        color:#888;

        font-size:8px;

        font-weight:900;

        letter-spacing:.07em;
      }


      .mana-v956-demo-figure{
        width:100%;

        max-width:150px;

        height:200px;

        overflow:visible;
      }


      .mana-v956-demo-body{
        fill:
          url(
            #manaV956Figure
          );

        stroke:#6b6b6b;

        stroke-width:1.2;
      }


      .mana-v956-demo-limb{
        fill:none;

        stroke:#9d9d9d;

        stroke-width:14;

        stroke-linecap:round;

        stroke-linejoin:round;

        filter:
          drop-shadow(
            0
            4px
            4px
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

        stroke:#808080;

        stroke-width:17;

        stroke-linecap:round;

        stroke-linejoin:round;

        filter:
          drop-shadow(
            0
            4px
            4px
            rgba(
              0,
              0,
              0,
              .45
            )
          );
      }


      .mana-v956-joint{
        fill:#777;

        opacity:.65;
      }


      .mana-v956-motion{
        display:flex;

        flex-direction:column;

        align-items:center;

        justify-content:center;

        gap:4px;

        color:#f3d875;
      }


      .mana-v956-motion span{
        font-size:29px;

        font-weight:900;
      }


      .mana-v956-motion small{
        font-size:7px;

        font-weight:900;

        letter-spacing:.08em;
      }


      /* =====================================
         MODAL MUSCLE IMAGE BIGGER
         ===================================== */

      .mana-v955-modal-muscle{
        grid-template-columns:
          115px
          1fr !important;

        padding:14px !important;
      }


      .mana-v955-modal-muscle
      #manaV955Muscle{
        width:105px;

        min-height:120px;

        display:flex;

        align-items:center;

        justify-content:center;
      }


      .mana-v955-modal-muscle
      .mana-v956-anatomy{
        width:100px;

        height:125px;
      }


      /* =====================================
         PHONE
         ===================================== */

      @media(
        max-width:600px
      ){

        .mana-v955-exercise-head{
          margin-top:-31px !important;
        }


        .mana-v955-muscle-mini{
          width:96px !important;
        }


        .mana-v956-mini-graphic{
          width:80px;

          height:94px;
        }


        .mana-v956-demo-stage{
          grid-template-columns:
            1fr
            25px
            1fr;

          gap:5px;
        }


        .mana-v956-demo-panel{
          min-height:210px;

          padding:
            10px
            5px;
        }


        .mana-v956-demo-figure{
          height:175px;
        }


        .mana-v956-motion span{
          font-size:23px;
        }


        .mana-v955-modal-muscle{
          grid-template-columns:
            95px
            1fr !important;
        }


        .mana-v955-modal-muscle
        #manaV955Muscle{
          width:88px;
        }

      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* =========================================
     EVENTS
     ========================================= */

  function refresh() {

    [
      80,
      220,
      500
    ].forEach(
      delay => {

        setTimeout(
          upgradeCards,
          delay
        );

      }
    );
  }


  function wire() {

    document.addEventListener(
      "click",
      event => {

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
            "Exercise";


          /*
            v9.55 opens its modal first.
            Then v9.56 upgrades the graphics.
          */

          setTimeout(
            () =>
              upgradeModal(
                name
              ),
            20
          );

        }


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


  function init() {

    injectStyles();

    wire();


    setTimeout(
      refresh,
      900
    );
  }


  window.MANA_EXERCISE_VISUAL_UPGRADE_BUILD =
    BUILD;


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
