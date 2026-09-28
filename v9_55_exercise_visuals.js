/* =========================================
   MANA MOVEMENT TRAINING v9.55.0
   EXERCISE VISUALS

   - Small muscle target diagram
   - Cartoon START → FINISH demo
   - Exercise-specific movement categories
   - Enlarged visual demo modal
   - Works with current v6.4 workout cards
   - No workout logging changes
   - No auth / Fuel changes
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "95500";


  const STYLE_ID =
    "mana-v955-exercise-visuals-style";


  const MODAL_ID =
    "manaV955DemoModal";


  /* =========================================
     CLASSIFY EXERCISE
     ========================================= */

  function exerciseInfo(
    rawName
  ) {

    const name =
      String(
        rawName || ""
      ).toLowerCase();


    /*
      SQUAT / QUADS / GLUTES
    */

    if (
      name.includes("squat") ||
      name.includes("leg press") ||
      name.includes("hack squat")
    ) {

      return {
        type:"squat",
        label:"Quads + Glutes",
        view:"front",
        muscles:[
          "quads",
          "glutes"
        ]
      };
    }


    /*
      LUNGE / SPLIT SQUAT / STEP UP
    */

    if (
      name.includes("lunge") ||
      name.includes("split squat") ||
      name.includes("step up") ||
      name.includes("step-up")
    ) {

      return {
        type:"lunge",
        label:"Quads + Glutes",
        view:"front",
        muscles:[
          "quads",
          "glutes"
        ]
      };
    }


    /*
      DEADLIFT / RDL / HIP HINGE
    */

    if (
      name.includes("deadlift") ||
      name.includes("rdl") ||
      name.includes("romanian") ||
      name.includes("good morning")
    ) {

      return {
        type:"hinge",
        label:"Hamstrings + Glutes",
        view:"back",
        muscles:[
          "hamstrings",
          "glutes"
        ]
      };
    }


    /*
      HIP THRUST / GLUTE BRIDGE
    */

    if (
      name.includes("hip thrust") ||
      name.includes("glute bridge")
    ) {

      return {
        type:"bridge",
        label:"Glutes",
        view:"back",
        muscles:[
          "glutes"
        ]
      };
    }


    /*
      BENCH / CHEST PRESS / PUSH UP
    */

    if (
      name.includes("bench") ||
      name.includes("chest press") ||
      name.includes("push up") ||
      name.includes("push-up") ||
      name.includes("pec")
    ) {

      return {
        type:"press",
        label:"Chest + Triceps",
        view:"front",
        muscles:[
          "chest",
          "triceps"
        ]
      };
    }


    /*
      SHOULDER PRESS / OVERHEAD PRESS
    */

    if (
      name.includes("shoulder press") ||
      name.includes("overhead press") ||
      name.includes("military press")
    ) {

      return {
        type:"overhead",
        label:"Shoulders + Triceps",
        view:"front",
        muscles:[
          "shoulders",
          "triceps"
        ]
      };
    }


    /*
      LATERAL / FRONT RAISE
    */

    if (
      name.includes("lateral raise") ||
      name.includes("front raise")
    ) {

      return {
        type:"raise",
        label:"Shoulders",
        view:"front",
        muscles:[
          "shoulders"
        ]
      };
    }


    /*
      ROW
    */

    if (
      name.includes("row")
    ) {

      return {
        type:"row",
        label:"Upper Back + Lats",
        view:"back",
        muscles:[
          "back",
          "lats"
        ]
      };
    }


    /*
      PULLDOWN / PULL UP
    */

    if (
      name.includes("pulldown") ||
      name.includes("pull down") ||
      name.includes("pull-up") ||
      name.includes("pull up") ||
      name.includes("chin up") ||
      name.includes("chin-up")
    ) {

      return {
        type:"pull",
        label:"Lats + Upper Back",
        view:"back",
        muscles:[
          "lats",
          "back"
        ]
      };
    }


    /*
      BICEPS
    */

    if (
      name.includes("curl") &&
      !name.includes("leg")
    ) {

      return {
        type:"curl",
        label:"Biceps",
        view:"front",
        muscles:[
          "biceps"
        ]
      };
    }


    /*
      TRICEPS
    */

    if (
      name.includes("tricep") ||
      name.includes("pushdown") ||
      name.includes("push down")
    ) {

      return {
        type:"triceps",
        label:"Triceps",
        view:"back",
        muscles:[
          "triceps"
        ]
      };
    }


    /*
      LEG CURL
    */

    if (
      name.includes("leg curl") ||
      name.includes("hamstring curl")
    ) {

      return {
        type:"legcurl",
        label:"Hamstrings",
        view:"back",
        muscles:[
          "hamstrings"
        ]
      };
    }


    /*
      LEG EXTENSION
    */

    if (
      name.includes("leg extension")
    ) {

      return {
        type:"legextension",
        label:"Quads",
        view:"front",
        muscles:[
          "quads"
        ]
      };
    }


    /*
      CALVES
    */

    if (
      name.includes("calf") ||
      name.includes("calves")
    ) {

      return {
        type:"calf",
        label:"Calves",
        view:"back",
        muscles:[
          "calves"
        ]
      };
    }


    /*
      CORE
    */

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
        label:"Core",
        view:"front",
        muscles:[
          "core"
        ]
      };
    }


    /*
      GENERIC
    */

    return {
      type:"generic",
      label:"Full Body",
      view:"front",
      muscles:[
        "full"
      ]
    };
  }


  /* =========================================
     MUSCLE DIAGRAM
     ========================================= */

  function muscleSvg(
    info
  ) {

    const has =
      muscle =>
        info.muscles.includes(
          muscle
        ) ||
        info.muscles.includes(
          "full"
        );


    const back =
      info.view ===
      "back";


    return `

      <svg
        class="mana-v955-muscle-svg"
        viewBox="0 0 90 150"
        aria-label="${info.label}"
      >

        <!-- HEAD -->
        <circle
          cx="45"
          cy="15"
          r="9"
          class="mana-v955-body"
        ></circle>


        <!-- TORSO -->
        <path
          d="
            M34 29
            Q45 24 56 29
            L60 70
            Q54 79 45 80
            Q36 79 30 70
            Z
          "
          class="mana-v955-body"
        ></path>


        <!-- ARMS -->
        <path
          d="M32 34 L17 64 L13 91"
          class="mana-v955-limb"
        ></path>

        <path
          d="M58 34 L73 64 L77 91"
          class="mana-v955-limb"
        ></path>


        <!-- LEGS -->
        <path
          d="M38 77 L32 110 L28 143"
          class="mana-v955-limb"
        ></path>

        <path
          d="M52 77 L58 110 L62 143"
          class="mana-v955-limb"
        ></path>


        ${
          !back &&
          has(
            "chest"
          )
            ? `
              <ellipse
                cx="39"
                cy="44"
                rx="8"
                ry="7"
                class="mana-v955-muscle"
              ></ellipse>

              <ellipse
                cx="51"
                cy="44"
                rx="8"
                ry="7"
                class="mana-v955-muscle"
              ></ellipse>
            `
            : ""
        }


        ${
          has(
            "shoulders"
          )
            ? `
              <circle
                cx="31"
                cy="36"
                r="6"
                class="mana-v955-muscle"
              ></circle>

              <circle
                cx="59"
                cy="36"
                r="6"
                class="mana-v955-muscle"
              ></circle>
            `
            : ""
        }


        ${
          !back &&
          has(
            "biceps"
          )
            ? `
              <ellipse
                cx="23"
                cy="58"
                rx="4"
                ry="9"
                class="mana-v955-muscle"
              ></ellipse>

              <ellipse
                cx="67"
                cy="58"
                rx="4"
                ry="9"
                class="mana-v955-muscle"
              ></ellipse>
            `
            : ""
        }


        ${
          has(
            "triceps"
          )
            ? `
              <ellipse
                cx="19"
                cy="61"
                rx="4"
                ry="9"
                class="mana-v955-muscle"
              ></ellipse>

              <ellipse
                cx="71"
                cy="61"
                rx="4"
                ry="9"
                class="mana-v955-muscle"
              ></ellipse>
            `
            : ""
        }


        ${
          !back &&
          has(
            "core"
          )
            ? `
              <rect
                x="38"
                y="51"
                width="14"
                height="25"
                rx="6"
                class="mana-v955-muscle"
              ></rect>
            `
            : ""
        }


        ${
          back &&
          (
            has(
              "back"
            ) ||
            has(
              "lats"
            )
          )
            ? `
              <path
                d="
                  M33 38
                  Q45 31 57 38
                  L56 64
                  Q45 72 34 64
                  Z
                "
                class="mana-v955-muscle"
              ></path>
            `
            : ""
        }


        ${
          has(
            "glutes"
          )
            ? `
              <ellipse
                cx="39"
                cy="79"
                rx="7"
                ry="7"
                class="mana-v955-muscle"
              ></ellipse>

              <ellipse
                cx="51"
                cy="79"
                rx="7"
                ry="7"
                class="mana-v955-muscle"
              ></ellipse>
            `
            : ""
        }


        ${
          !back &&
          has(
            "quads"
          )
            ? `
              <ellipse
                cx="35"
                cy="101"
                rx="5"
                ry="18"
                class="mana-v955-muscle"
              ></ellipse>

              <ellipse
                cx="55"
                cy="101"
                rx="5"
                ry="18"
                class="mana-v955-muscle"
              ></ellipse>
            `
            : ""
        }


        ${
          back &&
          has(
            "hamstrings"
          )
            ? `
              <ellipse
                cx="35"
                cy="101"
                rx="5"
                ry="18"
                class="mana-v955-muscle"
              ></ellipse>

              <ellipse
                cx="55"
                cy="101"
                rx="5"
                ry="18"
                class="mana-v955-muscle"
              ></ellipse>
            `
            : ""
        }


        ${
          has(
            "calves"
          )
            ? `
              <ellipse
                cx="30"
                cy="128"
                rx="4"
                ry="12"
                class="mana-v955-muscle"
              ></ellipse>

              <ellipse
                cx="60"
                cy="128"
                rx="4"
                ry="12"
                class="mana-v955-muscle"
              ></ellipse>
            `
            : ""
        }

      </svg>

    `;
  }


  /* =========================================
     CARTOON DEMO
     ========================================= */

  function poseSvg(
    type,
    finish
  ) {

    let torso =
      "M50 38 L50 82";

    let leftArm =
      "M50 48 L31 67";

    let rightArm =
      "M50 48 L69 67";

    let leftLeg =
      "M50 82 L36 120";

    let rightLeg =
      "M50 82 L64 120";


    if (
      type ===
      "squat"
    ) {

      torso =
        finish
          ? "M50 38 L50 76"
          : "M50 38 L50 82";

      leftLeg =
        finish
          ? "M50 76 L33 94 L24 118"
          : "M50 82 L37 120";

      rightLeg =
        finish
          ? "M50 76 L67 94 L76 118"
          : "M50 82 L63 120";

    }


    if (
      type ===
      "hinge"
    ) {

      torso =
        finish
          ? "M50 38 L72 72"
          : "M50 38 L50 82";

      leftArm =
        finish
          ? "M63 57 L78 88"
          : "M50 48 L37 72";

      rightArm =
        finish
          ? "M66 55 L82 85"
          : "M50 48 L63 72";

    }


    if (
      type ===
      "press"
    ) {

      leftArm =
        finish
          ? "M50 48 L25 48"
          : "M50 48 L34 64";

      rightArm =
        finish
          ? "M50 48 L75 48"
          : "M50 48 L66 64";

    }


    if (
      type ===
      "overhead"
    ) {

      leftArm =
        finish
          ? "M50 48 L39 20"
          : "M50 48 L35 56";

      rightArm =
        finish
          ? "M50 48 L61 20"
          : "M50 48 L65 56";

    }


    if (
      type ===
      "raise"
    ) {

      leftArm =
        finish
          ? "M50 48 L20 48"
          : "M50 48 L34 72";

      rightArm =
        finish
          ? "M50 48 L80 48"
          : "M50 48 L66 72";

    }


    if (
      type ===
      "row"
    ) {

      torso =
        "M50 38 L69 74";

      leftArm =
        finish
          ? "M60 57 L43 58"
          : "M60 57 L82 82";

      rightArm =
        finish
          ? "M62 55 L48 51"
          : "M62 55 L86 74";

    }


    if (
      type ===
      "pull"
    ) {

      leftArm =
        finish
          ? "M50 48 L34 37 L27 55"
          : "M50 48 L36 17";

      rightArm =
        finish
          ? "M50 48 L66 37 L73 55"
          : "M50 48 L64 17";

    }


    if (
      type ===
      "curl"
    ) {

      leftArm =
        finish
          ? "M50 48 L35 63 L39 45"
          : "M50 48 L35 75";

      rightArm =
        finish
          ? "M50 48 L65 63 L61 45"
          : "M50 48 L65 75";

    }


    if (
      type ===
      "lunge"
    ) {

      leftLeg =
        finish
          ? "M50 82 L30 96 L23 120"
          : "M50 82 L38 120";

      rightLeg =
        finish
          ? "M50 82 L68 102 L78 116"
          : "M50 82 L62 120";

    }


    if (
      type ===
      "core"
    ) {

      torso =
        finish
          ? "M40 66 L66 79"
          : "M28 82 L69 82";

      leftLeg =
        "M66 79 L82 98";

      rightLeg =
        "M66 79 L79 112";

    }


    return `

      <svg
        viewBox="0 0 100 135"
        class="mana-v955-pose"
      >

        <circle
          cx="50"
          cy="27"
          r="9"
          class="mana-v955-figure"
        ></circle>

        <path
          d="${torso}"
          class="mana-v955-stick"
        ></path>

        <path
          d="${leftArm}"
          class="mana-v955-stick"
        ></path>

        <path
          d="${rightArm}"
          class="mana-v955-stick"
        ></path>

        <path
          d="${leftLeg}"
          class="mana-v955-stick"
        ></path>

        <path
          d="${rightLeg}"
          class="mana-v955-stick"
        ></path>

      </svg>

    `;
  }


  function demoHtml(
    info
  ) {

    return `

      <div
        class="mana-v955-demo-stage"
      >

        <div
          class="mana-v955-pose-box"
        >

          <span>
            START
          </span>

          ${poseSvg(
            info.type,
            false
          )}

        </div>


        <div
          class="mana-v955-arrow"
        >
          →
        </div>


        <div
          class="mana-v955-pose-box"
        >

          <span>
            FINISH
          </span>

          ${poseSvg(
            info.type,
            true
          )}

        </div>

      </div>

    `;
  }


  /* =========================================
     MODAL
     ========================================= */

  function ensureModal() {

    if (
      document.getElementById(
        MODAL_ID
      )
    ) {
      return;
    }


    const modal =
      document.createElement(
        "div"
      );


    modal.id =
      MODAL_ID;


    modal.innerHTML = `

      <div
        class="mana-v955-modal-sheet"
      >

        <div
          class="mana-v955-modal-head"
        >

          <div>

            <div
              class="mana-v955-modal-kicker"
            >
              MANA STRENGTH
            </div>

            <h2
              id="manaV955Title"
            >
              Exercise Demo
            </h2>

          </div>


          <button
            type="button"
            id="manaV955Close"
            class="mana-v955-close"
          >
            ×
          </button>

        </div>


        <div
          id="manaV955Demo"
        ></div>


        <div
          class="mana-v955-modal-muscle"
        >

          <div
            id="manaV955Muscle"
          ></div>

          <div>

            <span>
              PRIMARY TARGET
            </span>

            <strong
              id="manaV955MuscleLabel"
            >
              Muscle group
            </strong>

          </div>

        </div>


        <div
          class="mana-v955-note"
        >
          Visual movement guide only.
          Use your Exercise Coach cues for
          setup, control and technique.
        </div>

      </div>

    `;


    document.body.appendChild(
      modal
    );


    document
      .getElementById(
        "manaV955Close"
      )
      ?.addEventListener(
        "click",
        closeModal
      );


    modal.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          modal
        ) {

          closeModal();

        }

      }
    );
  }


  function openModal(
    name
  ) {

    ensureModal();


    const info =
      exerciseInfo(
        name
      );


    const title =
      document.getElementById(
        "manaV955Title"
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
      title
    ) {
      title.textContent =
        name;
    }


    if (
      demo
    ) {
      demo.innerHTML =
        demoHtml(
          info
        );
    }


    if (
      muscle
    ) {
      muscle.innerHTML =
        muscleSvg(
          info
        );
    }


    if (
      label
    ) {
      label.textContent =
        info.label;
    }


    document
      .getElementById(
        MODAL_ID
      )
      ?.classList
      .add(
        "open"
      );
  }


  function closeModal() {

    document
      .getElementById(
        MODAL_ID
      )
      ?.classList
      .remove(
        "open"
      );
  }


  /* =========================================
     ENHANCE WORKOUT CARDS
     ========================================= */

  function enhanceCards() {

    const holder =
      document.getElementById(
        "manaV64Exercises"
      );


    if (
      !holder
    ) {
      return;
    }


    holder
      .querySelectorAll(
        ".mana-v64-card"
      )
      .forEach(
        card => {

          if (
            card.dataset
              .manaV955 ===
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


          const info =
            exerciseInfo(
              name
            );


          const exerciseName =
            card.querySelector(
              ".mana-v64-name"
            );


          if (
            exerciseName
          ) {

            const header =
              document.createElement(
                "div"
              );


            header.className =
              "mana-v955-exercise-head";


            header.innerHTML = `

              <div
                class="mana-v955-muscle-mini"
                title="${info.label}"
              >

                ${muscleSvg(
                  info
                )}

                <span>
                  ${info.label}
                </span>

              </div>

            `;


            exerciseName
              .insertAdjacentElement(
                "afterend",
                header
              );
          }


          const suggestion =
            card.querySelector(
              ".mana-v64-suggestion"
            );


          const button =
            document.createElement(
              "button"
            );


          button.type =
            "button";


          button.className =
            "mana-v955-demo-button";


          button.innerHTML = `

            <span
              class="mana-v955-demo-icon"
            >
              ▶
            </span>

            VISUAL DEMO

          `;


          button.addEventListener(
            "click",
            event => {

              event.preventDefault();

              event.stopPropagation();

              openModal(
                name
              );

            }
          );


          if (
            suggestion
          ) {

            suggestion
              .insertAdjacentElement(
                "afterend",
                button
              );

          } else {

            card.prepend(
              button
            );
          }


          card.dataset
            .manaV955 =
            "1";

        }
      );
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
         MINI MUSCLE DIAGRAM
         ===================================== */

      .mana-v955-exercise-head{
        display:flex;

        justify-content:flex-end;

        margin:
          -30px
          0
          8px;

        pointer-events:none;
      }


      .mana-v955-muscle-mini{
        width:76px;

        display:flex;

        flex-direction:column;

        align-items:center;

        gap:2px;
      }


      .mana-v955-muscle-mini
      .mana-v955-muscle-svg{
        width:42px;

        height:66px;
      }


      .mana-v955-muscle-mini span{
        color:#8e8e8e;

        font-size:7px;

        font-weight:800;

        text-align:center;

        line-height:1.2;

        text-transform:uppercase;
      }


      .mana-v955-body{
        fill:#202020;

        stroke:#555;

        stroke-width:1.4;
      }


      .mana-v955-limb{
        fill:none;

        stroke:#555;

        stroke-width:6;

        stroke-linecap:round;
      }


      .mana-v955-muscle{
        fill:#f3d875;

        opacity:.95;
      }


      /* =====================================
         DEMO BUTTON
         ===================================== */

      .mana-v955-demo-button{
        min-height:38px;

        margin:
          10px
          0
          12px;

        padding:
          0
          13px;

        display:inline-flex;

        align-items:center;

        gap:7px;

        border:
          1px solid
          #5b4d1d;

        border-radius:11px;

        background:#151208;

        color:#f3d875;

        font-size:9px;

        font-weight:900;

        letter-spacing:.06em;

        cursor:pointer;
      }


      .mana-v955-demo-icon{
        width:20px;

        height:20px;

        display:grid;

        place-items:center;

        border-radius:50%;

        background:#f3d875;

        color:#111;

        font-size:8px;
      }


      /* =====================================
         MODAL
         ===================================== */

      #${MODAL_ID}{
        position:fixed;

        inset:0;

        z-index:99999;

        display:none;

        align-items:flex-end;

        justify-content:center;

        padding:
          24px
          16px
          calc(
            24px +
            env(
              safe-area-inset-bottom
            )
          );

        background:
          rgba(
            0,
            0,
            0,
            .82
          );

        backdrop-filter:
          blur(8px);
      }


      #${MODAL_ID}.open{
        display:flex;
      }


      .mana-v955-modal-sheet{
        width:min(
          520px,
          100%
        );

        max-height:90dvh;

        overflow:auto;

        padding:20px;

        border:
          1px solid
          #51451d;

        border-radius:24px;

        background:
          linear-gradient(
            145deg,
            #15130c,
            #080808
          );

        box-shadow:
          0
          24px
          80px
          rgba(
            0,
            0,
            0,
            .75
          );
      }


      .mana-v955-modal-head{
        display:flex;

        justify-content:
          space-between;

        align-items:flex-start;

        gap:16px;
      }


      .mana-v955-modal-kicker{
        color:#f3d875;

        font-size:9px;

        font-weight:900;

        letter-spacing:.12em;
      }


      .mana-v955-modal-head h2{
        margin:
          5px
          0
          0;

        color:#fff;

        font-size:22px;
      }


      .mana-v955-close{
        width:40px;

        height:40px;

        border:
          1px solid
          #3b3b3b;

        border-radius:50%;

        background:#111;

        color:#fff;

        font-size:23px;
      }


      /* =====================================
         START / FINISH DEMO
         ===================================== */

      .mana-v955-demo-stage{
        display:grid;

        grid-template-columns:
          1fr
          auto
          1fr;

        align-items:center;

        gap:8px;

        margin-top:20px;
      }


      .mana-v955-pose-box{
        min-height:180px;

        display:flex;

        flex-direction:column;

        align-items:center;

        justify-content:center;

        padding:10px;

        border:
          1px solid
          #2e2e2e;

        border-radius:16px;

        background:#090909;
      }


      .mana-v955-pose-box span{
        margin-bottom:3px;

        color:#777;

        font-size:8px;

        font-weight:900;

        letter-spacing:.08em;
      }


      .mana-v955-pose{
        width:100%;

        max-width:105px;

        height:135px;
      }


      .mana-v955-figure{
        fill:#f3d875;
      }


      .mana-v955-stick{
        fill:none;

        stroke:#f3d875;

        stroke-width:7;

        stroke-linecap:round;

        stroke-linejoin:round;
      }


      .mana-v955-arrow{
        color:#f3d875;

        font-size:24px;

        font-weight:900;
      }


      /* =====================================
         MODAL MUSCLE BLOCK
         ===================================== */

      .mana-v955-modal-muscle{
        display:grid;

        grid-template-columns:
          70px
          1fr;

        align-items:center;

        gap:14px;

        margin-top:14px;

        padding:12px;

        border:
          1px solid
          #373019;

        border-radius:15px;

        background:#11100b;
      }


      .mana-v955-modal-muscle
      .mana-v955-muscle-svg{
        width:54px;

        height:88px;
      }


      .mana-v955-modal-muscle span{
        display:block;

        color:#777;

        font-size:8px;

        font-weight:900;

        letter-spacing:.08em;
      }


      .mana-v955-modal-muscle strong{
        display:block;

        margin-top:4px;

        color:#f3d875;

        font-size:16px;
      }


      .mana-v955-note{
        margin-top:12px;

        color:#777;

        font-size:10px;

        line-height:1.5;
      }


      /* =====================================
         PHONE
         ===================================== */

      @media(
        max-width:600px
      ){

        .mana-v955-exercise-head{
          margin-top:-27px;
        }


        .mana-v955-muscle-mini{
          width:65px;
        }


        .mana-v955-muscle-mini
        .mana-v955-muscle-svg{
          width:38px;

          height:59px;
        }


        .mana-v955-modal-sheet{
          padding:17px;
        }


        .mana-v955-pose-box{
          min-height:165px;
        }

      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* =========================================
     SAFE RETRIES
     ========================================= */

  function scheduleEnhance() {

    [
      100,
      300,
      650
    ].forEach(
      delay => {

        setTimeout(
          enhanceCards,
          delay
        );

      }
    );
  }


  function wireEvents() {

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            '#manaV83Tabs [data-v83-tab="program"]'
          )
        ) {

          scheduleEnhance();

        }

      }
    );


    window.addEventListener(
      "mana:program-tab-change",
      scheduleEnhance
    );


    window.addEventListener(
      "mana:strength-synced",
      scheduleEnhance
    );


    window.addEventListener(
      "mana:workout-progress-change",
      scheduleEnhance
    );
  }


  function init() {

    injectStyles();

    ensureModal();

    wireEvents();


    setTimeout(
      scheduleEnhance,
      1000
    );
  }


  window.MANA_EXERCISE_VISUALS_BUILD =
    BUILD;


  window.refreshManaExerciseVisuals =
    enhanceCards;


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
