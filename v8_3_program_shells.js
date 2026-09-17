/* =========================================
   MANA MOVEMENT TRAINING v8.3
   PROGRAM SHELLS
   ========================================= */

(() => {
  "use strict";

  const SHELL_ID =
    "manaV83ProgramShell";

  const STYLE_ID =
    "mana-v83-program-shell-style";

  let activeProgram =
    null;

  let activeTab =
    "overview";

  const PROGRAMS = {
    mana28: {
      title: "MANA 28",
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
      title: "MANA STRENGTH",
      subtitle:
        "Personalised strength training",
      tabs: [
        ["overview", "Overview"],
        ["program", "Program"],
        ["fuel", "Fuel"],
        ["progress", "Progress"],
        ["learn", "Learn"]
      ]
    },

    life: {
      title: "MANA LIFE",
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
        color:white;
        padding:
          calc(env(safe-area-inset-top) + 16px)
          18px
          calc(105px + env(safe-area-inset-bottom));
      }

      #${SHELL_ID}.open{
        display:block;
      }

      .mana-v83-shell{
        width:min(560px,100%);
        margin:auto;
      }

      .mana-v83-head{
        display:flex;
        justify-content:space-between;
        gap:16px;
        align-items:flex-start;
        margin-bottom:18px;
      }

      .mana-v83-kicker{
        color:#f3d875;
        font-size:11px;
        font-weight:900;
        letter-spacing:.15em;
        margin-bottom:7px;
      }

      .mana-v83-head h1{
        margin:0;
        font-size:30px;
      }

      .mana-v83-sub{
        margin-top:7px;
        color:#999;
        font-size:13px;
      }

      .mana-v83-back{
        flex:0 0 auto;
        min-height:42px;
        padding:0 14px;
        border-radius:14px;
        border:1px solid #333;
        background:#111;
        color:#f3d875;
        font-weight:900;
      }

      .mana-v83-tabs{
        display:flex;
        gap:8px;
        overflow-x:auto;
        padding:4px 0 12px;
        margin-bottom:10px;
        scrollbar-width:none;
      }

      .mana-v83-tabs::-webkit-scrollbar{
        display:none;
      }

      .mana-v83-tab{
        flex:0 0 auto;
        min-height:42px;
        padding:0 15px;
        border-radius:999px;
        border:1px solid #333;
        background:#101010;
        color:#999;
        font-size:12px;
        font-weight:900;
      }

      .mana-v83-tab.active{
        background:#f3d875;
        color:#111;
        border-color:#f3d875;
      }

      .mana-v83-card{
        border:1px solid #292929;
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

      .mana-v83-secondary{
        width:100%;
        min-height:48px;
        border-radius:15px;
        border:1px solid #333;
        background:#111;
        color:#f3d875;
        font-weight:900;
        margin-top:10px;
      }

      .mana-v83-grid{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:10px;
      }

      .mana-v83-stat{
        border:1px solid #292929;
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

      @media(max-width:390px){
        .mana-v83-grid{
          grid-template-columns:1fr;
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
      <div class="mana-v83-shell">

        <div class="mana-v83-head">
          <div>
            <div
              class="mana-v83-kicker"
              id="manaV83Kicker"
            >
              MANA MOVEMENT
            </div>

            <h1 id="manaV83Title">
              Program
            </h1>

            <div
              class="mana-v83-sub"
              id="manaV83Sub"
            ></div>
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
          class="mana-v83-tabs"
          id="manaV83Tabs"
        ></div>

        <div
          id="manaV83Content"
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
        closeProgram;
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
        .map(([key, label]) => `
          <button
            type="button"
            class="mana-v83-tab ${
              key === activeTab
                ? "active"
                : ""
            }"
            data-v83-tab="${key}"
          >
            ${label}
          </button>
        `)
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
            };
        }
      );
  }

  function mana28Overview() {
    return `
      <div class="mana-v83-card">
        <h2>28 Days to Move With Purpose</h2>

        <p>
          A structured 28-day journey
          combining training, habits,
          nutrition and daily action.
        </p>

        <button
          type="button"
          class="mana-v83-primary"
          id="manaV83Open28"
        >
          Open today’s program
        </button>
      </div>

      <div class="mana-v83-grid">
        <div class="mana-v83-stat">
          <span>Program length</span>
          <strong>28 days</strong>
        </div>

        <div class="mana-v83-stat">
          <span>Focus</span>
          <strong>Consistency</strong>
        </div>
      </div>
    `;
  }

  function strengthOverview() {
    return `
      <div class="mana-v83-card">
        <h2>Your Strength Program</h2>

        <p>
          Personalised training based
          on your profile, goals,
          experience and available
          equipment.
        </p>

        <button
          type="button"
          class="mana-v83-primary"
          id="manaV83OpenStrength"
        >
          Open strength dashboard
        </button>
      </div>

      <div class="mana-v83-grid">
        <div class="mana-v83-stat">
          <span>Training</span>
          <strong>Personalised</strong>
        </div>

        <div class="mana-v83-stat">
          <span>Tracking</span>
          <strong>Sets + Load</strong>
        </div>
      </div>
    `;
  }

  function lifeOverview() {
    return `
      <div class="mana-v83-card">
        <h2>Reclaim your momentum</h2>

        <p>
          Mana Life brings together
          routine, reflection, mindset
          and practical daily action.
        </p>
      </div>

      <div class="mana-v83-grid">
        <div class="mana-v83-stat">
          <span>Focus</span>
          <strong>Mindset</strong>
        </div>

        <div class="mana-v83-stat">
          <span>Approach</span>
          <strong>Daily action</strong>
        </div>
      </div>
    `;
  }

  function genericCard(
    title,
    text
  ) {
    return `
      <div class="mana-v83-card">
        <h2>${title}</h2>
        <p>${text}</p>
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
          mana28Overview();

        document
          .getElementById(
            "manaV83Open28"
          )
          ?.addEventListener(
            "click",
            openOldMana28
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
            "Your existing 28-day day-by-day program lives here."
          ) +
          `
          <button
            type="button"
            class="mana-v83-primary"
            id="manaV83Open28Program"
          >
            View 28-day program
          </button>
        `;

        document
          .getElementById(
            "manaV83Open28Program"
          )
          ?.addEventListener(
            "click",
            openOldMana28
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
            "Simple nutrition guidance, meal structure and consistency tools for MANA 28."
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
            "Program completion, habits, check-ins and results will live here."
          );

        return;
      }

      holder.innerHTML =
        genericCard(
          "Learn",
          "Understand the principles behind MANA 28, training, recovery, habits and nutrition."
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
          strengthOverview();

        document
          .getElementById(
            "manaV83OpenStrength"
          )
          ?.addEventListener(
            "click",
            openOldStrength
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
            "Your personalised strength sessions and current workout plan."
          ) +
          `
          <button
            type="button"
            class="mana-v83-primary"
            id="manaV83StrengthProgram"
          >
            View strength program
          </button>
        `;

        document
          .getElementById(
            "manaV83StrengthProgram"
          )
          ?.addEventListener(
            "click",
            openOldStrength
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
            "Protein, calories, recovery and simple nutrition guidance supporting strength and muscle."
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
            "Completed workouts, volume, previous loads and performance trends."
          );

        return;
      }

      holder.innerHTML =
        genericCard(
          "Learn",
          "Training principles, progression, recovery, technique and building strength safely."
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
          lifeOverview();

        return;
      }

      if (
        activeTab ===
        "routine"
      ) {
        holder.innerHTML =
          genericCard(
            "Daily Routine",
            "Build structure around sleep, movement, training, food, reflection and daily priorities."
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
            "Mindset tools, affirmations, reflection and practical steps for rebuilding momentum."
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
            "Track routines, consistency, reflections and personal wins over time."
          );

        return;
      }

      holder.innerHTML =
        genericCard(
          "Learn",
          "Mindset, resilience, identity, purpose and building a stronger daily life."
        );
    }
  }

  function openProgram(
    program
  ) {
    const config =
      PROGRAMS[program];

    if (!config) return;

    ensureShell();

    activeProgram =
      program;

    activeTab =
      "overview";

    document
      .getElementById(
        "manaV83Title"
      ).textContent =
        config.title;

    document
      .getElementById(
        "manaV83Sub"
      ).textContent =
        config.subtitle;

    renderTabs();
    renderContent();

    document
      .getElementById(
        SHELL_ID
      )
      .classList.add(
        "open"
      );

    document.body.style.overflow =
      "hidden";
  }

  function closeProgram() {
    document
      .getElementById(
        SHELL_ID
      )
      ?.classList.remove(
        "open"
      );

    document.body.style.overflow =
      "";
  }

  function openOldMana28() {
    closeProgram();

    if (
      typeof
      window.showClientProgramsView ===
      "function"
    ) {
      window.showClientProgramsView();
      return;
    }

    const old =
      document.querySelector(
        "#clientProgramsView"
      );

    if (old) {
      old.classList.remove(
        "hide"
      );
    }
  }

  function openOldStrength() {
    closeProgram();

    const target =
      [
        ...document.querySelectorAll(
          "button, .day, .card"
        )
      ].find(el =>
        (el.textContent || "")
          .toUpperCase()
          .includes(
            "MANA STRENGTH"
          )
      );

    if (target) {
      target.click();
    }
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
      900
    );

    setTimeout(
      wireHomeButtons,
      1800
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
