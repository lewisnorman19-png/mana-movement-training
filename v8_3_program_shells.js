
/*
 MANA MOVEMENT TRAINING
 PROGRAM SHELLS — BUILD 8307

 COMPLETE REPLACEMENT:
 v8_3_program_shells.js

 - Preserves Strength, Mana28 and ManaLyfe
 - Keeps five original navigation buttons
 - Repairs missing Learn button
 - Never reopens Overview to repair navigation
 - Preserves specialised content renderers
 - Preserves Home and Back navigation
*/

(() => {
  "use strict";

  const SHELL_ID = "manaV83ProgramShell";
  const STYLE_ID = "mana-v83-program-shell-style";
  const PROFILE_KEY = "mana-profile-v67";

  let activeProgram = null;
  let activeTab = "overview";
  let tabObserver = null;
  let tabCheckQueued = false;

  const $ = id => document.getElementById(id);

  const PROGRAMS = {
    mana28: {
      title: "MANA 28",
      subtitle: "28 Days to Move With Purpose",
      tabs: [
        ["overview", "Overview"],
        ["program", "Workouts"],
        ["fuel", "Fuel"],
        ["progress", "Progress"],
        ["learn", "Learn"]
      ]
    },
    strength: {
      title: "MANA STRENGTH",
      subtitle: "Personalised Strength Program",
      tabs: [
        ["overview", "Overview"],
        ["program", "Workouts"],
        ["fuel", "Fuel"],
        ["progress", "Progress"],
        ["learn", "Learn"]
      ]
    },
    life: {
      title: "MANA LIFE",
      subtitle: "Mindset • Routine • Reclaim",
      tabs: [
        ["overview", "Overview"],
        ["routine", "Workouts"],
        ["reclaim", "Reclaim"],
        ["progress", "Progress"],
        ["learn", "Learn"]
      ]
    }
  };

  function safeJson(value, fallback) {
    try {
      return JSON.parse(value);
    } catch (_) {
      return fallback;
    }
  }

  function loadProfile() {
    return safeJson(
      localStorage.getItem(PROFILE_KEY) || "{}",
      {}
    );
  }

  function strengthSubtitle() {
    const goal = loadProfile().goal || "";

    if (goal === "Build muscle") {
      return "Muscle Building Program";
    }

    if (goal === "Get stronger") {
      return "Strength Program";
    }

    if (goal === "Return to training") {
      return "Return to Training Program";
    }

    return "Personalised Strength Program";
  }

  function injectStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      #${SHELL_ID} {
        position: fixed;
        inset: 0;
        z-index: 24000;
        display: none;
        overflow: auto;
        background: #050505;
        color: #fff;
        padding:
          calc(env(safe-area-inset-top) + 16px)
          18px
          calc(105px + env(safe-area-inset-bottom));
      }

      #${SHELL_ID}.open {
        display: block;
      }

      .mana-v83-shell {
        width: min(560px,100%);
        margin: auto;
      }

      .mana-v83-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
        margin-bottom: 20px;
      }

      .mana-v83-brand-wrap {
        display: flex;
        align-items: center;
        gap: 13px;
      }

      .mana-v83-mark {
        width: 54px;
        height: 54px;
        flex: 0 0 54px;
        display: grid;
        place-items: center;
        border: 2px solid #d4af37;
        color: #f3d875;
        background: #070707;
        font: 700 36px Georgia,serif;
      }

      .mana-v83-kicker {
        color: #f3d875;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: .16em;
        margin-bottom: 5px;
      }

      .mana-v83-head h1 {
        margin: 0;
        font-size: 30px;
        line-height: 1.05;
      }

      .mana-v83-sub {
        margin-top: 6px;
        color: #aaa;
        font-size: 13px;
        font-weight: 700;
      }

      .mana-v83-back {
        flex: 0 0 auto;
        min-height: 42px;
        padding: 0 14px;
        border-radius: 14px;
        border: 1px solid #333;
        background: #111;
        color: #f3d875;
        font-weight: 900;
      }

      .mana-v83-card {
        border: 1px solid #292929;
        background:
          linear-gradient(145deg,#111,#090909);
        border-radius: 22px;
        padding: 18px;
        margin: 12px 0;
      }

      .mana-v83-card h2,
      .mana-v83-card h3 {
        margin-top: 0;
      }

      .mana-v83-card p {
        color: #aaa;
        line-height: 1.55;
      }

      .mana-v83-primary {
        width: 100%;
        min-height: 54px;
        border: 0;
        border-radius: 16px;
        background: #f3d875;
        color: #111;
        font-weight: 900;
        font-size: 15px;
        margin-top: 12px;
      }

      .mana-v83-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .mana-v83-stat {
        border: 1px solid #292929;
        border-radius: 18px;
        padding: 14px;
        background: #0d0d0d;
      }

      .mana-v83-stat span {
        display: block;
        color: #888;
        font-size: 11px;
      }

      .mana-v83-stat strong {
        display: block;
        margin-top: 5px;
        color: #f3d875;
        font-size: 22px;
      }

      .mana-v83-tabs {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 24500;
        display: none;
        grid-template-columns:
          repeat(5,minmax(0,1fr));
        min-height: 74px;
        padding:
          7px 6px
          calc(7px + env(safe-area-inset-bottom));
        background: rgba(5,5,5,.97);
        border-top: 1px solid #272727;
        backdrop-filter: blur(14px);
      }

      #${SHELL_ID}.open .mana-v83-tabs {
        display: grid;
      }

      .mana-v83-tab {
        min-width: 0;
        min-height: 56px;
        padding: 4px 2px;
        border: 0;
        border-radius: 12px;
        background: transparent;
        color: #888;
        font-size: 11px;
        font-weight: 800;
      }

      .mana-v83-tab::before {
        content: "";
        display: block;
        width: 6px;
        height: 6px;
        margin: 0 auto 6px;
        border-radius: 50%;
        background: #555;
      }

      .mana-v83-tab.active {
        color: #f3d875;
      }

      .mana-v83-tab.active::before {
        background: #f3d875;
      }

      @media(max-width:390px) {
        .mana-v83-grid {
          grid-template-columns: 1fr;
        }

        .mana-v83-head h1 {
          font-size: 26px;
        }

        .mana-v83-mark {
          width: 48px;
          height: 48px;
          flex-basis: 48px;
          font-size: 32px;
        }

        .mana-v83-tab {
          font-size: 10px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function ensureShell() {
    if ($(SHELL_ID)) return;

    const shell = document.createElement("div");
    shell.id = SHELL_ID;

    shell.innerHTML = `
      <div class="mana-v83-shell">
        <div class="mana-v83-head">
          <div class="mana-v83-brand-wrap">
            <div class="mana-v83-mark">M</div>
            <div>
              <div class="mana-v83-kicker">
                MANA MOVEMENT
              </div>
              <h1 id="manaV83Title">Program</h1>
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

        <div id="manaV83Content"></div>

        <div
          class="mana-v83-tabs"
          id="manaV83Tabs"
        ></div>
      </div>
    `;

    document.body.appendChild(shell);

    $("manaV83Back").onclick = handleBack;
  }

  function updateBackButton() {
    const button = $("manaV83Back");
    if (!button) return;

    button.textContent =
      activeProgram === "strength" &&
      activeTab !== "overview"
        ? "← Overview"
        : "← Home";
  }

  function notifyTabChange() {
    window.dispatchEvent(
      new CustomEvent("mana:program-tab-change")
    );
  }

  function openTab(tab) {
    const config = PROGRAMS[activeProgram];
    if (!config) return;

    if (!config.tabs.some(([key]) => key === tab)) {
      return;
    }

    activeTab = tab;

    renderTabs();
    renderContent();
    updateBackButton();
    notifyTabChange();
  }

  function goToOverview() {
    openTab("overview");
  }

  function handleBack() {
    if (
      activeProgram === "strength" &&
      activeTab !== "overview"
    ) {
      goToOverview();
      return;
    }

    closeProgram();
  }

  /*
   The tab buttons use one delegated handler.
   Other scripts can replace an individual
   button without destroying navigation.
  */

  function handleTabClick(event) {
    const holder = $("manaV83Tabs");
    const button = event.target.closest?.(
      "button[data-v83-tab]"
    );

    if (!holder || !button ||
        !holder.contains(button)) return;

    openTab(button.dataset.v83Tab);
  }

  function makeTab(key,label) {
    const button = document.createElement("button");

    button.type = "button";
    button.className =
      "mana-v83-tab" +
      (key === activeTab ? " active" : "");

    button.dataset.v83Tab = key;
    button.textContent = label;

    return button;
  }

  function renderTabs() {
    const config = PROGRAMS[activeProgram];
    const holder = $("manaV83Tabs");

    if (!config || !holder) return;

    const buttons = config.tabs.map(
      ([key,label]) => makeTab(key,label)
    );

    if (tabObserver) tabObserver.disconnect();

    holder.replaceChildren(...buttons);

    if (tabObserver) {
      tabObserver.observe(holder,{
        childList:true
      });
    }
  }

  /*
   Repair only missing navigation buttons.

   Never call renderContent, openProgram,
   click Overview, or reset the active tab.
  */

  function repairMissingTabs() {
    const shell = $(SHELL_ID);
    const holder = $("manaV83Tabs");
    const config = PROGRAMS[activeProgram];

    if (
      !shell?.classList.contains("open") ||
      !holder ||
      !config
    ) return;

    const actual = new Set(
      Array.from(
        holder.querySelectorAll(
          "button[data-v83-tab]"
        )
      ).map(button => button.dataset.v83Tab)
    );

    const missing = config.tabs.filter(
      ([key]) => !actual.has(key)
    );

    if (!missing.length) return;

    if (tabObserver) tabObserver.disconnect();

    for (const [key,label] of missing) {
      const button = makeTab(key,label);

      const expectedIndex = config.tabs.findIndex(
        entry => entry[0] === key
      );

      const following = config.tabs
        .slice(expectedIndex + 1)
        .map(entry => entry[0])
        .map(next =>
          holder.querySelector(
            `[data-v83-tab="${next}"]`
          )
        )
        .find(Boolean);

      holder.insertBefore(button,following || null);
    }

    if (tabObserver) {
      tabObserver.observe(holder,{
        childList:true
      });
    }
  }

  function queueTabCheck() {
    if (tabCheckQueued) return;

    tabCheckQueued = true;

    queueMicrotask(() => {
      tabCheckQueued = false;
      repairMissingTabs();
    });
  }

  function watchTabs() {
    const holder = $("manaV83Tabs");
    if (!holder) return;

    holder.addEventListener("click",handleTabClick);

    tabObserver = new MutationObserver(
      queueTabCheck
    );

    tabObserver.observe(holder,{
      childList:true
    });
  }

  function genericCard(title,text) {
    return `
      <div class="mana-v83-card">
        <h2>${title}</h2>
        <p>${text}</p>
      </div>
    `;
  }

  function renderContent() {
    const holder = $("manaV83Content");
    if (!holder) return;

    if (activeProgram === "mana28") {
      const cards = {
        overview: [
          "28 Days to Move With Purpose",
          "Training, habits, nutrition and daily action."
        ],
        program: [
          "Your MANA 28 Workouts",
          "Your complete 4-week training plan."
        ],
        fuel: [
          "Fuel",
          "Nutrition guidance for MANA 28."
        ],
        progress: [
          "Progress",
          "Your MANA 28 progress."
        ],
        learn: [
          "Learn",
          "Understand the principles behind MANA 28."
        ]
      };

      const card = cards[activeTab] || cards.overview;
      holder.innerHTML = genericCard(...card);
      return;
    }

    if (activeProgram === "strength") {
      if (activeTab === "overview") {
        if (
          typeof window.renderManaStrengthOverview ===
          "function"
        ) {
          window.renderManaStrengthOverview();
          return;
        }

        holder.innerHTML = genericCard(
          "Your Strength Program",
          "Personalised training built from your Profile."
        );
        return;
      }

      if (activeTab === "fuel") {
        if (
          typeof window.renderManaStrengthFuel ===
          "function"
        ) {
          window.renderManaStrengthFuel();
          return;
        }

        holder.innerHTML = genericCard(
          "Fuel for Strength",
          "Nutrition supporting your training and recovery."
        );
        return;
      }

      const cards = {
        program: [
          "Your Workouts",
          "Your personalised strength sessions."
        ],
        progress: [
          "Strength Progress",
          "Your training history and performance."
        ],
        learn: [
          "Learn",
          "Strength training principles and progression."
        ]
      };

      const card = cards[activeTab];

      if (card) {
        holder.innerHTML = genericCard(...card);
      }
      return;
    }

    if (activeProgram === "life") {
      const cards = {
        overview: [
          "Reclaim your momentum",
          "Mindset, movement, routine and daily action."
        ],
        routine: [
          "Your Lyfe Workouts",
          "Movement, strength, cardio and recovery."
        ],
        reclaim: [
          "Reclaim",
          "Mindset and reflection tools."
        ],
        progress: [
          "Lyfe Progress",
          "Track your consistency and momentum."
        ],
        learn: [
          "Learn",
          "Mindset, resilience and purpose."
        ]
      };

      const card = cards[activeTab] || cards.overview;
      holder.innerHTML = genericCard(...card);
    }
  }

  function updateHeader() {
    const config = PROGRAMS[activeProgram];
    if (!config) return;

    const title = $("manaV83Title");
    const subtitle = $("manaV83Sub");

    if (title) title.textContent = config.title;

    if (subtitle) {
      subtitle.textContent =
        activeProgram === "strength"
          ? strengthSubtitle()
          : config.subtitle || "";
    }

    updateBackButton();
  }

  function openProgram(program) {
    if (!PROGRAMS[program]) return;

    ensureShell();

    activeProgram = program;
    activeTab = "overview";

    updateHeader();

    $(SHELL_ID).classList.add("open");
    document.body.style.overflow = "hidden";

    renderTabs();
    renderContent();
    updateBackButton();
    notifyTabChange();
  }

  function closeProgram() {
    $(SHELL_ID)?.classList.remove("open");
    document.body.style.overflow = "";
  }

  function wireHomeButtons() {
    const buttons = {
      manaV80Mana28: "mana28",
      manaV80Strength: "strength",
      manaV80Life: "life"
    };

    for (const [id,program] of Object.entries(buttons)) {
      const button = $(id);

      if (button) {
        button.onclick = () => openProgram(program);
      }
    }
  }

  function init() {
    injectStyles();
    ensureShell();
    watchTabs();

    [500,1200,2200].forEach(delay => {
      setTimeout(wireHomeButtons,delay);
    });

    window.addEventListener(
      "mana:profile-synced",
      () => {
        if (activeProgram === "strength") {
          updateHeader();
        }
      }
    );

    /*
     Single navigation-only recovery check.
     No content rebuilding or polling.
    */

    window.addEventListener(
      "pageshow",
      queueTabCheck
    );

    window.MANA_PROGRAM_SHELL_BUILD = "8307";

    console.log(
      "[Mana Movement] Program shells 8307 ready"
    );
  }

  window.openManaProgram = openProgram;

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {once:true}
    );
  } else {
    init();
  }
})();
