/* =========================================
   MANA MOVEMENT TRAINING v9.78.4
   MANA 28 + MANA LYFE OVERVIEWS

   IMPORTANT STABILITY CHANGE

   v9.78 NOW OWNS:
   - MANA 28 OVERVIEW
   - MANA LYFE OVERVIEW
   - OVERVIEW CARD NAVIGATION
   - BACK BUTTON TEXT

   v9.78 NO LONGER OWNS:
   - MANA 28 WORKOUTS
   - MANA LYFE WORKOUTS
   - DAY CAROUSELS
   - PROGRAM SCROLLING

   v9.80 OWNS ALL WORKOUT SCREENS.

   THIS REMOVES THE DUPLICATE
   LYFE RENDER LOOP ON MOBILE.
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "97840";


  const STYLE_ID =
    "mana-v978-style";


  const M28_KEY =
    "mana-v973-mana28-state";


  const LYFE_KEY =
    "mana-v973-lyfe-state";


  let renderQueued =
    false;


  /* =========================================
     HELPERS
     ========================================= */

  function safeJson(
    raw,
    fallback
  ) {

    try {

      return JSON.parse(
        raw
      );

    } catch (_) {

      return fallback;

    }

  }


  function loadState(
    key
  ) {

    const state =
      safeJson(
        localStorage.getItem(
          key
        ) || "{}",
        {}
      );


    if (
      !Array.isArray(
        state.completed
      )
    ) {

      state.completed =
        [];

    }


    return state;

  }


  function shell() {

    return document
      .getElementById(
        "manaV83ProgramShell"
      );

  }


  function holder() {

    return document
      .getElementById(
        "manaV83Content"
      );

  }


  function titleEl() {

    return document
      .getElementById(
        "manaV83Title"
      );

  }


  function activeTab() {

    return (
      document
        .querySelector(
          "#manaV83Tabs .mana-v83-tab.active"
        )
        ?.dataset
        ?.v83Tab
      || ""
    );

  }


  function programKind() {

    const title =
      (
        titleEl()
          ?.textContent || ""
      )
        .trim()
        .toUpperCase();


    if (
      title.startsWith(
        "MANA 28"
      )
    ) {

      return "mana28";

    }


    if (
      title.startsWith(
        "MANA LIFE"
      )
      ||
      title.startsWith(
        "MANA LYFE"
      )
    ) {

      return "lyfe";

    }


    return "";

  }


  function stateKey(
    kind
  ) {

    return (
      kind === "mana28"
        ? M28_KEY
        : LYFE_KEY
    );

  }


  function openTab(
    name
  ) {

    document
      .querySelector(
        "#manaV83Tabs " +
        `[data-v83-tab="${name}"]`
      )
      ?.click();

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

      .mana-v978-launchpad{

        width:100%;

        max-width:860px;

        margin:
          0 auto;

        padding:
          8px 0 34px;

      }


      .mana-v978-intro{

        position:relative;

        margin-bottom:
          24px;

        padding-bottom:
          17px;

        border-bottom:
          1px solid #29251b;

      }


      .mana-v978-intro::after{

        content:"";

        position:absolute;

        left:0;

        bottom:-1px;

        width:86px;

        height:2px;

        background:
          linear-gradient(
            90deg,
            #f2d875,
            transparent
          );

      }


      .mana-v978-kicker{

        color:#d9bb58;

        font-size:11px;

        font-weight:950;

        letter-spacing:.17em;

        text-transform:uppercase;

      }


      .mana-v978-intro h2{

        margin:
          8px 0 9px;

        color:#fff;

        font-size:35px;

        font-weight:950;

        line-height:1.03;

      }


      .mana-v978-intro p{

        max-width:650px;

        margin:0;

        color:#999;

        font-size:14px;

        line-height:1.55;

      }


      .mana-v978-grid{

        display:grid;

        grid-template-columns:
          repeat(
            2,
            minmax(0,1fr)
          );

        gap:14px;

      }


      .mana-v978-launch{

        position:relative;

        width:100%;

        min-height:185px;

        overflow:hidden;

        display:flex;

        align-items:flex-start;

        gap:17px;

        padding:22px;

        text-align:left;

        border:
          1px solid #36311f;

        border-radius:22px;

        background:
          linear-gradient(
            145deg,
            #161510,
            #090909
          );

        color:#fff;

        cursor:pointer;

        touch-action:manipulation;

      }


      .mana-v978-launch::before{

        content:"";

        position:absolute;

        top:0;

        left:22px;

        right:22px;

        height:2px;

        background:
          linear-gradient(
            90deg,
            transparent,
            #d7b94f,
            transparent
          );

      }


      .mana-v978-launch:active{

        transform:
          scale(.995);

      }


      .mana-v978-icon{

        width:58px;

        height:58px;

        flex:
          0 0 58px;

        display:grid;

        place-items:center;

        border-radius:17px;

        border:
          1px solid #665720;

        background:
          linear-gradient(
            145deg,
            #f3d875,
            #c79d2c
          );

        color:#111;

        font-size:17px;

        font-weight:950;

      }


      .mana-v978-copy{

        min-width:0;

        flex:1;

      }


      .mana-v978-label{

        color:#caae50;

        font-size:10px;

        font-weight:950;

        letter-spacing:.14em;

      }


      .mana-v978-title{

        margin-top:7px;

        color:#fff;

        font-size:24px;

        font-weight:950;

        line-height:1.08;

      }


      .mana-v978-text{

        margin-top:10px;

        color:#999;

        font-size:13px;

        line-height:1.5;

      }


      .mana-v978-arrow{

        margin-top:14px;

        color:#f2d875;

        font-size:11px;

        font-weight:950;

      }


      @media(
        max-width:700px
      ){

        .mana-v978-launchpad{

          padding-top:2px;

        }


        .mana-v978-intro{

          margin-bottom:16px;

        }


        .mana-v978-intro h2{

          font-size:29px;

        }


        .mana-v978-grid{

          grid-template-columns:
            1fr;

          gap:10px;

        }


        .mana-v978-launch{

          min-height:150px;

          padding:18px;

          gap:14px;

          border-radius:19px;

        }


        .mana-v978-icon{

          width:52px;

          height:52px;

          flex-basis:52px;

          font-size:15px;

        }


        .mana-v978-title{

          font-size:21px;

        }


        .mana-v978-text{

          font-size:12px;

        }

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     CARD
     ========================================= */

  function card(
    tab,
    icon,
    label,
    title,
    text,
    arrow
  ) {

    return `

      <button
        type="button"

        class="mana-v978-launch"

        data-v978-tab="${tab}"
      >

        <div
          class="mana-v978-icon"
        >
          ${icon}
        </div>


        <div
          class="mana-v978-copy"
        >

          <div
            class="mana-v978-label"
          >
            ${label}
          </div>


          <div
            class="mana-v978-title"
          >
            ${title}
          </div>


          <div
            class="mana-v978-text"
          >
            ${text}
          </div>


          <div
            class="mana-v978-arrow"
          >
            ${arrow}
          </div>

        </div>

      </button>

    `;

  }


  /* =========================================
     OVERVIEW
     ========================================= */

  function renderOverview(
    kind
  ) {

    const content =
      holder();


    if (!content) {

      return;

    }


    /*
      v9.80 owns workout sizing.
      Ensure old v9.78 workout mode
      is never left on the shell.
    */

    shell()
      ?.classList
      .remove(
        "mana-v978-program"
      );


    const lyfe =
      kind ===
      "lyfe";


    if (
      lyfe &&
      titleEl()
    ) {

      titleEl()
        .textContent =
        "MANA LYFE";

    }


    const state =
      loadState(
        stateKey(
          kind
        )
      );


    const completed =
      state.completed.length;


    content.innerHTML = `

      <div
        class="mana-v978-launchpad"
      >

        <div
          class="mana-v978-intro"
        >

          <div
            class="mana-v978-kicker"
          >
            ${
              lyfe
                ? "MANA LYFE"
                : "MANA 28"
            }
          </div>


          <h2>
            ${
              lyfe
                ? "Reset. Rebuild. Move Forward."
                : "Your Mana 28 Hub"
            }
          </h2>


          <p>
            ${
              lyfe

                ? "Movement, mindset, recovery and daily action designed to help you rebuild momentum."

                : "Everything important in one place. Choose where you want to go next."
            }
          </p>

        </div>


        <div
          class="mana-v978-grid"
        >

          ${
            lyfe

              ? card(
                  "routine",
                  "LY",
                  "LYFE SESSIONS",
                  "Move • Reset • Rebuild",
                  "Strength, movement, cardio and recovery across your four-week Lyfe path.",
                  "VIEW SESSIONS →"
                )

              : card(
                  "program",
                  "28",
                  "WORKOUTS",
                  "Your 4-Week Plan",
                  "Strength, cardio, mobility and recovery across your complete Mana 28 program.",
                  "VIEW WORKOUTS →"
                )
          }


          ${
            lyfe

              ? card(
                  "reclaim",
                  "✦",
                  "RECLAIM",
                  "Mindset & Reflection",
                  "Journal, reflect and use practical tools to reset your thinking and regain direction.",
                  "OPEN RECLAIM →"
                )

              : card(
                  "fuel",
                  "F",
                  "FUEL",
                  "Nutrition",
                  "Calories, protein, water, meals and your daily Fuel targets.",
                  "OPEN FUEL →"
                )
          }


          ${card(
            "progress",
            "↗",
            "PROGRESS",

            lyfe
              ? "Your Momentum"
              : "Your Results",

            lyfe
              ? `${completed} sessions complete. Track consistency as your Lyfe journey develops.`
              : `${completed} of 28 program days complete. Track training, Fuel and recovery.`,

            "VIEW PROGRESS →"
          )}


          ${card(
            "learn",
            "i",
            "LEARN",

            lyfe
              ? "Tools for Lyfe"
              : "Build Better Habits",

            lyfe
              ? "Mindset, resilience, routine, recovery and useful everyday principles."
              : "Training, recovery and lifestyle principles behind Mana 28.",

            "LEARN MORE →"
          )}

        </div>

      </div>

    `;


    content
      .querySelectorAll(
        "[data-v978-tab]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              openTab(
                button.dataset
                  .v978Tab
              );

            };

        }
      );


    updateBack(
      kind
    );

  }


  /* =========================================
     BACK BUTTON
     ========================================= */

  function updateBack(
    kind
  ) {

    const button =
      document.getElementById(
        "manaV83Back"
      );


    if (
      !button ||
      !kind
    ) {

      return;

    }


    button.textContent =
      activeTab() ===
      "overview"

        ? "← Home"

        : "← Overview";

  }


  function installBackRepair() {

    document.addEventListener(
      "click",
      event => {

        const button =
          event.target.closest(
            "#manaV83Back"
          );


        if (!button) {

          return;

        }


        const kind =
          programKind();


        if (!kind) {

          return;

        }


        /*
          On any non-overview screen,
          return to Overview.

          On Overview the original shell
          handler is allowed to go Home.
        */

        if (
          activeTab() ===
          "overview"
        ) {

          return;

        }


        event.preventDefault();

        event.stopImmediatePropagation();


        openTab(
          "overview"
        );

      },
      true
    );

  }


  /* =========================================
     RENDER

     IMPORTANT:
     v9.78 ONLY RENDERS OVERVIEW NOW.
     ========================================= */

  function render() {

    renderQueued =
      false;


    const kind =
      programKind();


    if (!kind) {

      return;

    }


    if (
      activeTab() !==
      "overview"
    ) {

      /*
        DO NOT RENDER WORKOUTS HERE.
        v9.80 owns those screens.
      */

      shell()
        ?.classList
        .remove(
          "mana-v978-program"
        );


      updateBack(
        kind
      );


      return;

    }


    renderOverview(
      kind
    );

  }


  /* =========================================
     SINGLE RENDER QUEUE

     NO 0 / 35 / 110 TRIPLE RETRIES.
     ========================================= */

  function scheduleRender() {

    if (
      renderQueued
    ) {

      return;

    }


    renderQueued =
      true;


    queueMicrotask(
      render
    );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    installBackRepair();

    scheduleRender();


    window.addEventListener(
      "mana:program-tab-change",
      scheduleRender
    );


    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "#manaV80Mana28," +
            "#manaV80Life"
          )
        ) {

          scheduleRender();

        }

      },
      true
    );


    window.MANA_28_LYFE_BUILD =
      BUILD;


    console.log(
      "[Mana v9.78.4] overview-only stable build ready"
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
