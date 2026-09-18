/* =========================================
   MANA MOVEMENT TRAINING v8.3
   PROGRAM SHELLS
   BOTTOM NAV + SMART BACK BUTTON
   ========================================= */

(() => {
  "use strict";

  const SHELL_ID =
    "manaV83ProgramShell";

  const STYLE_ID =
    "mana-v83-program-shell-style";

  const PROFILE_KEY =
    "mana-profile-v67";

  let activeProgram =
    null;

  let activeTab =
    "overview";


  const PROGRAMS = {

    mana28: {
      title:
        "MANA 28",

      subtitle:
        "28 Days to Move With Purpose",

      tabs: [
        ["overview", "Overview"],
        ["program", "Program"],
        ["fuel", "Fuel"],
        ["progress", "Progress"],
        ["learn", "Learn"]
      ]
    },


    strength: {
      title:
        "MANA STRENGTH",

      tabs: [
        ["overview", "Overview"],
        ["program", "Program"],
        ["fuel", "Fuel"],
        ["progress", "Progress"],
        ["learn", "Learn"]
      ]
    },


    life: {
      title:
        "MANA LIFE",

      subtitle:
        "Mindset • Routine • Reclaim",

      tabs: [
        ["overview", "Overview"],
        ["routine", "Routine"],
        ["reclaim", "Reclaim"],
        ["progress", "Progress"],
        ["learn", "Learn"]
      ]
    }

  };


  function safeJson(
    raw,
    fallback
  ) {
    try {
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }


  function loadProfile() {
    return safeJson(
      localStorage.getItem(
        PROFILE_KEY
      ) || "{}",
      {}
    );
  }


  function strengthSubtitle() {
    const profile =
      loadProfile();

    const goal =
      profile.goal || "";


    if (
      goal ===
      "Build muscle"
    ) {
      return (
        "Muscle Building Program"
      );
    }


    if (
      goal ===
      "Get stronger"
    ) {
      return (
        "Strength Program"
      );
    }


    if (
      goal ===
      "Return to training"
    ) {
      return (
        "Return to Training Program"
      );
    }


    if (
      goal ===
      "General fitness"
    ) {
      return (
        "Personalised Strength Program"
      );
    }


    return (
      "Personalised Strength Program"
    );
  }


  function injectStyles() {
    if (
      document.getElementById(
        STYLE_ID
      )
    ) return;


    const style =
      document.createElement(
        "style"
      );

    style.id =
      STYLE_ID;


    style.textContent = `

      #${SHELL_ID}{
        position:fixed;
        inset:0;

        z-index:24000;

        display:none;

        overflow:auto;

        background:#050505;

        color:#fff;

        padding:
          calc(
            env(
              safe-area-inset-top
            ) + 16px
          )
          18px
          calc(
            105px +
            env(
              safe-area-inset-bottom
            )
          );
      }


      #${SHELL_ID}.open{
        display:block;
      }


      .mana-v83-shell{
        width:min(
          560px,
          100%
        );

        margin:auto;
      }


      .mana-v83-head{
        display:flex;

        justify-content:
          space-between;

        align-items:
          flex-start;

        gap:16px;

        margin-bottom:20px;
      }


      .mana-v83-brand-wrap{
        display:flex;

        align-items:center;

        gap:13px;
      }


      .mana-v83-mark{
        width:54px;
        height:54px;

        flex:
          0
          0
          54px;

        display:grid;

        place-items:center;

        border:
          2px solid
          #d4af37;

        color:#f3d875;

        background:#070707;

        font:
          700
          36px
          Georgia,
          serif;
      }


      .mana-v83-kicker{
        color:#f3d875;

        font-size:10px;

        font-weight:900;

        letter-spacing:.16em;

        margin-bottom:5px;
      }


      .mana-v83-head h1{
        margin:0;

        font-size:30px;

        line-height:1.05;
      }


      .mana-v83-sub{
        margin-top:6px;

        color:#aaa;

        font-size:13px;

        font-weight:700;
      }


      .mana-v83-back{
        flex:0 0 auto;

        min-height:42px;

        padding:
          0
          14px;

        border-radius:14px;

        border:
          1px solid
          #333;

        background:#111;

        color:#f3d875;

        font-weight:900;
      }


      .mana-v83-card{
        border:
          1px solid
          #292929;

        background:
          linear-gradient(
            145deg,
            #111,
            #090909
          );

        border-radius:22px;

        padding:18px;

        margin:12px 0;
      }


      .mana-v83-card h2,
      .mana-v83-card h3{
        margin-top:0;
      }


      .mana-v83-card p{
        color:#aaa;

        line-height:1.55;
      }


      .mana-v83-primary{
        width:100%;

        min-height:54px;

        border:0;

        border-radius:16px;

        background:#f3d875;

        color:#111;

        font-weight:900;

        font-size:15px;

        margin-top:12px;
      }


      .mana-v83-grid{
        display:grid;

        grid-template-columns:
          1fr 1fr;

        gap:10px;
      }


      .mana-v83-stat{
        border:
          1px solid
          #292929;

        border-radius:18px;

        padding:14px;

        background:#0d0d0d;
      }


      .mana-v83-stat span{
        display:block;

        color:#888;

        font-size:11px;
      }


      .mana-v83-stat strong{
        display:block;

        margin-top:5px;

        color:#f3d875;

        font-size:22px;
      }


      /* ==========================
         BOTTOM NAV
         ========================== */

      .mana-v83-tabs{
        position:fixed;

        left:0;
        right:0;
        bottom:0;

        z-index:24500;

        display:none;

        grid-template-columns:
          repeat(
            5,
            1fr
          );

        min-height:74px;

        padding:
          7px
          6px
          calc(
            7px +
            env(
              safe-area-inset-bottom
            )
          );

        background:
          rgba(
            5,
            5,
            5,
            .97
          );

        border-top:
          1px solid
          #272727;

        backdrop-filter:
          blur(14px);
      }


      #${SHELL_ID}.open
      .mana-v83-tabs{
        display:grid;
      }


      .mana-v83-tab{
        min-width:0;

        min-height:56px;

        padding:
          4px
          2px;

        border:0;

        border-radius:12px;

        background:transparent;

        color:#888;

        font-size:11px;

        font-weight:800;
      }


      .mana-v83-tab::before{
        content:"";

        display:block;

        width:6px;
        height:6px;

        margin:
          0
          auto
          6px;

        border-radius:50%;

        background:#555;
      }


      .mana-v83-tab.active{
        color:#f3d875;
      }


      .mana-v83-tab.active::before{
        background:#f3d875;
      }


      @media(max-width:390px){

        .mana-v83-grid{
          grid-template-columns:
            1fr;
        }


        .mana-v83-head h1{
          font-size:26px;
        }


        .mana-v83-mark{
          width:48px;
          height:48px;

          flex-basis:48px;

          font-size:32px;
        }


        .mana-v83-tab{
          font-size:10px;
        }
      }

    `;


    document.head.appendChild(
      style
    );
  }


  function ensureShell() {
    if (
      document.getElementById(
        SHELL_ID
      )
    ) return;


    const shell =
      document.createElement(
        "div"
      );

    shell.id =
      SHELL_ID;


    shell.innerHTML = `

      <div
        class="mana-v83-shell"
      >

        <div
          class="mana-v83-head"
        >

          <div
            class="mana-v83-brand-wrap"
          >

            <div
              class="mana-v83-mark"
            >
              M
            </div>


            <div>

              <div
                class="mana-v83-kicker"
              >
                MANA MOVEMENT
              </div>


              <h1
                id="manaV83Title"
              >
                Program
              </h1>


              <div
                class="mana-v83-sub"
                id="manaV83Sub"
              ></div>

            </div>

          </div>


          <button
            type="button"
            class="mana-v83-back"
            id="manaV83Back"
          >
            ← Home
          </button>

        </div>


        <div
          id="manaV83Content"
        ></div>


        <div
          class="mana-v83-tabs"
          id="manaV83Tabs"
        ></div>

      </div>

    `;


    document.body.appendChild(
      shell
    );


    document
      .getElementById(
        "manaV83Back"
      )
      .onclick =
        handleBack;
  }


  function updateBackButton() {
    const button =
      document.getElementById(
        "manaV83Back"
      );

    if (!button) return;


    if (
      activeProgram ===
        "strength" &&
      activeTab !==
        "overview"
    ) {
      button.textContent =
        "← Overview";

      return;
    }


    button.textContent =
      "← Home";
  }


  function goToOverview() {
    activeTab =
      "overview";


    renderTabs();

    renderContent();

    updateBackButton();


    window.dispatchEvent(
      new CustomEvent(
        "mana:program-tab-change"
      )
    );
  }


  function handleBack() {
    if (
      activeProgram ===
        "strength" &&
      activeTab !==
        "overview"
    ) {
      goToOverview();

      return;
    }


    closeProgram();
  }


  function renderTabs() {
    const config =
      PROGRAMS[
        activeProgram
      ];

    const holder =
      document.getElementById(
        "manaV83Tabs"
      );


    if (
      !config ||
      !holder
    ) return;


    holder.innerHTML =
      config.tabs
        .map(
          ([key, label]) => `

            <button
              type="button"

              class="
                mana-v83-tab
                ${
                  key === activeTab
                    ? "active"
                    : ""
                }
              "

              data-v83-tab="${key}"
            >
              ${label}
            </button>

          `
        )
        .join("");


    holder
      .querySelectorAll(
        "[data-v83-tab]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              activeTab =
                button.dataset
                  .v83Tab;


              renderTabs();

              renderContent();

              updateBackButton();


              window.dispatchEvent(
                new CustomEvent(
                  "mana:program-tab-change"
                )
              );
            };
        }
      );
  }


  function genericCard(
    title,
    text
  ) {
    return `

      <div
        class="mana-v83-card"
      >

        <h2>
          ${title}
        </h2>

        <p>
          ${text}
        </p>

      </div>

    `;
  }


  function renderContent() {
    const holder =
      document.getElementById(
        "manaV83Content"
      );

    if (!holder) return;


    if (
      activeProgram ===
      "mana28"
    ) {

      if (
        activeTab ===
        "overview"
      ) {
        holder.innerHTML =
          genericCard(
            "28 Days to Move With Purpose",
            "Training, habits, nutrition and daily action."
          );

        return;
      }


      if (
        activeTab ===
        "program"
      ) {
        holder.innerHTML =
          genericCard(
            "Your MANA 28 Program",
            "Your 28-day program."
          );

        return;
      }


      if (
        activeTab ===
        "fuel"
      ) {
        holder.innerHTML =
          genericCard(
            "Fuel",
            "Nutrition guidance for MANA 28."
          );

        return;
      }


      if (
        activeTab ===
        "progress"
      ) {
        holder.innerHTML =
          genericCard(
            "Progress",
            "Your MANA 28 progress."
          );

        return;
      }


      holder.innerHTML =
        genericCard(
          "Learn",
          "Understand the principles behind MANA 28."
        );

      return;
    }


    if (
      activeProgram ===
      "strength"
    ) {

      if (
        activeTab ===
        "overview"
      ) {
        holder.innerHTML =
          genericCard(
            "Your Strength Program",
            "Personalised training built from your Profile."
          );

        return;
      }


      if (
        activeTab ===
        "program"
      ) {
        holder.innerHTML =
          genericCard(
            "Your Program",
            "Your personalised strength sessions."
          );

        return;
      }


      if (
        activeTab ===
        "fuel"
      ) {
        holder.innerHTML =
          genericCard(
            "Fuel for Strength",
            "Nutrition supporting your training and recovery."
          );

        return;
      }


      if (
        activeTab ===
        "progress"
      ) {
        holder.innerHTML =
          genericCard(
            "Strength Progress",
            "Your training history and performance."
          );

        return;
      }


      holder.innerHTML =
        genericCard(
          "Learn",
          "Strength training principles and progression."
        );

      return;
    }


    if (
      activeProgram ===
      "life"
    ) {

      if (
        activeTab ===
        "overview"
      ) {
        holder.innerHTML =
          genericCard(
            "Reclaim your momentum",
            "Mindset, routine and daily action."
          );

        return;
      }


      if (
        activeTab ===
        "routine"
      ) {
        holder.innerHTML =
          genericCard(
            "Daily Routine",
            "Build structure into your day."
          );

        return;
      }


      if (
        activeTab ===
        "reclaim"
      ) {
        holder.innerHTML =
          genericCard(
            "Reclaim",
            "Mindset and reflection tools."
          );

        return;
      }


      if (
        activeTab ===
        "progress"
      ) {
        holder.innerHTML =
          genericCard(
            "Life Progress",
            "Track your consistency."
          );

        return;
      }


      holder.innerHTML =
        genericCard(
          "Learn",
          "Mindset, resilience and purpose."
        );
    }
  }


  function updateHeader() {
    const config =
      PROGRAMS[
        activeProgram
      ];

    if (!config) return;


    document
      .getElementById(
        "manaV83Title"
      )
      .textContent =
        config.title;


    const subtitle =
      activeProgram ===
      "strength"
        ? strengthSubtitle()
        : config.subtitle;


    document
      .getElementById(
        "manaV83Sub"
      )
      .textContent =
        subtitle || "";


    updateBackButton();
  }


  function openProgram(
    program
  ) {
    const config =
      PROGRAMS[
        program
      ];

    if (!config) return;


    ensureShell();


    activeProgram =
      program;

    activeTab =
      "overview";


    updateHeader();

    renderTabs();

    renderContent();

    updateBackButton();


    document
      .getElementById(
        SHELL_ID
      )
      .classList
      .add(
        "open"
      );


    document.body.style.overflow =
      "hidden";


    window.dispatchEvent(
      new CustomEvent(
        "mana:program-tab-change"
      )
    );
  }


  function closeProgram() {
    document
      .getElementById(
        SHELL_ID
      )
      ?.classList
      .remove(
        "open"
      );


    document.body.style.overflow =
      "";
  }


  function wireHomeButtons() {
    const mana28 =
      document.getElementById(
        "manaV80Mana28"
      );

    const strength =
      document.getElementById(
        "manaV80Strength"
      );

    const life =
      document.getElementById(
        "manaV80Life"
      );


    if (mana28) {
      mana28.onclick =
        () =>
          openProgram(
            "mana28"
          );
    }


    if (strength) {
      strength.onclick =
        () =>
          openProgram(
            "strength"
          );
    }


    if (life) {
      life.onclick =
        () =>
          openProgram(
            "life"
          );
    }
  }


  function init() {
    injectStyles();

    ensureShell();


    setTimeout(
      wireHomeButtons,
      500
    );


    setTimeout(
      wireHomeButtons,
      1200
    );


    setTimeout(
      wireHomeButtons,
      2200
    );


    window.addEventListener(
      "mana:profile-synced",
      () => {

        if (
          activeProgram ===
          "strength"
        ) {
          updateHeader();
        }
      }
    );
  }


  window.openManaProgram =
    openProgram;


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
