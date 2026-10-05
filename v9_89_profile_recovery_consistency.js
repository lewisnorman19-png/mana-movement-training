/* =========================================
   MANA MOVEMENT TRAINING v9.89.0
   PROFILE + RECOVERY CONSISTENCY

   PROFILE
   - ONE MASTER PROFILE ACROSS:
       MANA 28
       MANA STRENGTH
       MANA LYFE
   - SAME PROFILE BUTTON IN EACH PROGRAM
   - FUEL PROFILE BUTTON USES SAME MASTER PROFILE

   FUEL
   - REST / RECOVERY RESTORED
   - AVAILABLE IN:
       MANA 28
       MANA STRENGTH
   - 8 HOUR DAILY TARGET
   - +2 / +4 / +8 HOUR QUICK ADD
   - RESET TODAY
   - USES EXISTING DAILY FUEL STORAGE

   IMPORTANT
   - NO WORKOUT CHANGES
   - NO TIMER CHANGES
   - NO SET LOGGING CHANGES
   - NO STARTUP OBSERVER
   - NO DATA RESET
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "98900";


  const STYLE_ID =
    "mana-v989-profile-recovery-style";


  const PROFILE_KEY =
    "mana-profile-v67";


  const FUEL_KEY =
    "mana-fuel-v571";


  const RECOVERY_TARGET =
    8;


  let refreshTimer =
    null;


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


  function todayKey() {

    const date =
      new Date();


    return [

      date.getFullYear(),

      String(
        date.getMonth() + 1
      )
        .padStart(
          2,
          "0"
        ),

      String(
        date.getDate()
      )
        .padStart(
          2,
          "0"
        )

    ].join(
      "-"
    );

  }


  function clamp(
    value,
    min,
    max
  ) {

    return Math.max(
      min,
      Math.min(
        max,
        value
      )
    );

  }


  function loadProfile() {

    return safeJson(

      localStorage.getItem(
        PROFILE_KEY
      ) || "{}",

      {}

    );

  }


  function loadFuelStore() {

    return safeJson(

      localStorage.getItem(
        FUEL_KEY
      ) || "{}",

      {}

    );

  }


  function saveFuelStore(
    store
  ) {

    localStorage.setItem(

      FUEL_KEY,

      JSON.stringify(
        store
      )

    );

  }


  function blankDay() {

    return {

      meals: {

        Breakfast: [],
        Lunch: [],
        Dinner: [],
        Snacks: []

      },

      water: 0,

      recoveryHours: 0

    };

  }


  function loadToday() {

    const store =
      loadFuelStore();


    const day =
      store[
        todayKey()
      ];


    if (
      !day ||
      typeof day !==
        "object"
    ) {

      return blankDay();

    }


    if (
      !day.meals
    ) {

      day.meals = {

        Breakfast: [],
        Lunch: [],
        Dinner: [],
        Snacks: []

      };

    }


    if (
      typeof day.water !==
        "number"
    ) {

      day.water =
        Number(
          day.water || 0
        );

    }


    if (
      typeof day.recoveryHours !==
        "number"
    ) {

      day.recoveryHours =
        Number(
          day.recoveryHours || 0
        );

    }


    return day;

  }


  function saveToday(
    day
  ) {

    const store =
      loadFuelStore();


    store[
      todayKey()
    ] =
      day;


    saveFuelStore(
      store
    );

  }


  /* =========================================
     PROGRAM STATE
     ========================================= */

  function programShell() {

    return document
      .getElementById(
        "manaV83ProgramShell"
      );

  }


  function programTitle() {

    return (
      document
        .getElementById(
          "manaV83Title"
        )
        ?.textContent
        ?.trim()
        ?.toUpperCase()
      ||
      ""
    );

  }


  function activeTab() {

    return (
      document
        .querySelector(
          "#manaV83Tabs " +
          ".mana-v83-tab.active"
        )
        ?.dataset
        ?.v83Tab
      ||
      ""
    );

  }


  function programOpen() {

    return Boolean(

      programShell()
        ?.classList
        .contains(
          "open"
        )

    );

  }


  function supportedProfileProgram() {

    const title =
      programTitle();


    return (

      title ===
        "MANA 28"

      ||

      title ===
        "MANA STRENGTH"

      ||

      title ===
        "MANA LIFE"

      ||

      title ===
        "MANA LYFE"

    );

  }


  function sharedFuelOpen() {

    if (
      !programOpen()
    ) {

      return false;

    }


    const title =
      programTitle();


    const supported =
      (

        title ===
          "MANA 28"

        ||

        title ===
          "MANA STRENGTH"

      );


    return Boolean(

      supported

      &&

      activeTab() ===
        "fuel"

    );

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

      /* =====================================
         PROGRAM HEADER PROFILE BUTTON
         ===================================== */

      .mana-v989-profile-btn{

        flex:
          0 0 auto;

        min-height:
          42px;

        padding:
          0 13px;

        border:
          1px solid
          #4b411e;

        border-radius:
          14px;

        background:
          linear-gradient(
            145deg,
            #17140b,
            #0c0c0c
          );

        color:
          #f3d875;

        font-size:
          11px;

        font-weight:
          950;

        letter-spacing:
          .05em;

        cursor:
          pointer;

        touch-action:
          manipulation;

      }


      .mana-v989-profile-btn:active{

        transform:
          scale(
            .98
          );

      }


      /* =====================================
         HEADER ACTIONS
         ===================================== */

      .mana-v989-head-actions{

        display:
          flex;

        align-items:
          center;

        gap:
          8px;

        flex:
          0 0 auto;

      }


      /* =====================================
         FUEL PROFILE BUTTON
         ===================================== */

      #manaV83Content
      #manaV89BuildTargets{

        min-height:
          50px;

        border-color:
          #5d5124;

        background:
          linear-gradient(
            145deg,
            #17150d,
            #0d0d0d
          );

        color:
          #f3d875;

      }


      /* =====================================
         REST / RECOVERY
         ===================================== */

      #manaV83Content
      .mana-v989-recovery{

        margin-top:
          14px;

        padding:
          16px;

        border:
          1px solid
          #38311c;

        border-radius:
          17px;

        background:
          linear-gradient(
            145deg,
            #15130c,
            #090909
          );

      }


      .mana-v989-recovery-head{

        display:
          flex;

        justify-content:
          space-between;

        align-items:
          flex-start;

        gap:
          12px;

      }


      .mana-v989-recovery-label{

        color:
          #f3d875;

        font-size:
          10px;

        font-weight:
          950;

        letter-spacing:
          .10em;

        text-transform:
          uppercase;

      }


      .mana-v989-recovery-title{

        margin-top:
          4px;

        color:
          #fff;

        font-size:
          17px;

        font-weight:
          950;

      }


      .mana-v989-recovery-value{

        flex:
          0 0 auto;

        color:
          #f3d875;

        font-size:
          17px;

        font-weight:
          950;

        white-space:
          nowrap;

      }


      .mana-v989-recovery-track{

        height:
          7px;

        margin-top:
          13px;

        overflow:
          hidden;

        border-radius:
          999px;

        background:
          #242424;

      }


      .mana-v989-recovery-fill{

        width:
          0%;

        height:
          100%;

        border-radius:
          999px;

        background:
          linear-gradient(
            90deg,
            #b58c25,
            #f3d875
          );

        transition:
          width
          .18s
          ease;

      }


      .mana-v989-recovery-sub{

        margin-top:
          9px;

        color:
          #808080;

        font-size:
          10px;

        line-height:
          1.45;

      }


      /* =====================================
         RECOVERY QUICK ADD
         ===================================== */

      .mana-v989-recovery-actions{

        display:
          grid;

        grid-template-columns:
          repeat(
            3,
            minmax(
              0,
              1fr
            )
          );

        gap:
          8px;

        margin-top:
          14px;

      }


      .mana-v989-recovery-btn{

        min-width:
          0;

        min-height:
          44px;

        padding:
          0 5px;

        border:
          1px solid
          #40371b;

        border-radius:
          12px;

        background:
          #0d0d0d;

        color:
          #f3d875;

        font-size:
          11px;

        font-weight:
          950;

        cursor:
          pointer;

        touch-action:
          manipulation;

      }


      .mana-v989-recovery-btn:active{

        transform:
          scale(
            .98
          );

      }


      .mana-v989-recovery-reset{

        width:
          100%;

        min-height:
          34px;

        margin-top:
          8px;

        border:
          1px solid
          #292929;

        border-radius:
          10px;

        background:
          #090909;

        color:
          #777;

        font-size:
          9px;

        font-weight:
          900;

        letter-spacing:
          .03em;

      }


      /* =====================================
         PROFILE SOURCE NOTE
         ===================================== */

      .mana-v989-profile-note{

        margin:
          0 0 12px;

        padding:
          11px 13px;

        border:
          1px solid
          #292929;

        border-radius:
          13px;

        background:
          #0b0b0b;

        color:
          #888;

        font-size:
          10px;

        line-height:
          1.45;

      }


      .mana-v989-profile-note
      strong{

        color:
          #d9bd61;

      }


      /* =====================================
         PHONE
         ===================================== */

      @media(
        max-width:430px
      ){

        .mana-v83-head{

          gap:
            10px;

        }


        .mana-v989-head-actions{

          flex-direction:
            column;

          gap:
            6px;

        }


        .mana-v989-profile-btn,
        .mana-v83-back{

          min-height:
            38px
            !important;

          min-width:
            76px;

          padding:
            0 9px
            !important;

          font-size:
            10px
            !important;

        }


        .mana-v989-recovery{

          padding:
            14px;

        }


        .mana-v989-recovery-title{

          font-size:
            16px;

        }


        .mana-v989-recovery-value{

          font-size:
            15px;

        }

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     MASTER PROFILE
     ========================================= */

  function openMasterProfile() {

    if (
      typeof
        window
          .openManaProfile ===
      "function"
    ) {

      window
        .openManaProfile();

    }

  }


  function ensureProgramProfileButton() {

    if (
      !programOpen() ||
      !supportedProfileProgram()
    ) {

      return;

    }


    const head =
      document.querySelector(
        "#manaV83ProgramShell " +
        ".mana-v83-head"
      );


    const back =
      document.getElementById(
        "manaV83Back"
      );


    if (
      !head ||
      !back
    ) {

      return;

    }


    let actions =
      head.querySelector(
        ".mana-v989-head-actions"
      );


    if (!actions) {

      actions =
        document.createElement(
          "div"
        );


      actions.className =
        "mana-v989-head-actions";


      back
        .insertAdjacentElement(
          "beforebegin",
          actions
        );


      actions.appendChild(
        back
      );

    }


    let button =
      document.getElementById(
        "manaV989ProfileButton"
      );


    if (!button) {

      button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.id =
        "manaV989ProfileButton";


      button.className =
        "mana-v989-profile-btn";


      button.textContent =
        "PROFILE";


      button.addEventListener(
        "click",
        event => {

          event.preventDefault();

          event.stopPropagation();

          openMasterProfile();

        }
      );


      actions.insertBefore(
        button,
        back
      );

    }

  }


  /* =========================================
     PROFILE CONSISTENCY IN FUEL
     ========================================= */

  function polishFuelProfileButton() {

    const button =
      document.getElementById(
        "manaV89BuildTargets"
      );


    if (!button) {

      return;

    }


    button.textContent =
      "PROFILE & FUEL SETTINGS";


    button.setAttribute(
      "aria-label",
      "Open your master Mana profile and fuel settings"
    );

  }


  function ensureProfileNote() {

    if (
      !sharedFuelOpen()
    ) {

      return;

    }


    const root =
      document.querySelector(
        "#manaV83Content " +
        ".mana-v897-root"
      );


    if (!root) {

      return;

    }


    if (
      document.getElementById(
        "manaV989ProfileNote"
      )
    ) {

      return;

    }


    const note =
      document.createElement(
        "div"
      );


    note.id =
      "manaV989ProfileNote";


    note.className =
      "mana-v989-profile-note";


    note.innerHTML = `

      <strong>
        One Mana Profile.
      </strong>

      Your personal details,
      training setup and Fuel goals
      are shared across your programs.

    `;


    const build =
      document.getElementById(
        "manaV89BuildTargets"
      );


    build
      ?.insertAdjacentElement(
        "afterend",
        note
      );

  }


  /* =========================================
     RECOVERY
     ========================================= */

  function recoveryHours() {

    return Number(
      loadToday()
        .recoveryHours || 0
    );

  }


  function updateRecoveryUI() {

    const panel =
      document.getElementById(
        "manaV989Recovery"
      );


    if (!panel) {

      return;

    }


    const hours =
      recoveryHours();


    const percentage =
      clamp(

        Math.round(
          (
            hours /
            RECOVERY_TARGET
          )
          *
          100
        ),

        0,

        100

      );


    const value =
      panel.querySelector(
        ".mana-v989-recovery-value"
      );


    const fill =
      panel.querySelector(
        ".mana-v989-recovery-fill"
      );


    if (value) {

      value.textContent =
        `${hours} / ${RECOVERY_TARGET} hrs`;

    }


    if (fill) {

      fill.style.width =
        `${percentage}%`;

    }

  }


  function addRecovery(
    amount
  ) {

    const day =
      loadToday();


    day.recoveryHours =
      Math.max(

        0,

        Number(
          day.recoveryHours || 0
        )
        +
        Number(
          amount || 0
        )

      );


    saveToday(
      day
    );


    updateRecoveryUI();


    window.dispatchEvent(
      new CustomEvent(
        "mana:recovery-updated",
        {
          detail: {
            recoveryHours:
              day.recoveryHours
          }
        }
      )
    );


    window.dispatchEvent(
      new CustomEvent(
        "mana:fuel-updated"
      )
    );

  }


  function resetRecovery() {

    const day =
      loadToday();


    day.recoveryHours =
      0;


    saveToday(
      day
    );


    updateRecoveryUI();


    window.dispatchEvent(
      new CustomEvent(
        "mana:recovery-updated",
        {
          detail: {
            recoveryHours: 0
          }
        }
      )
    );


    window.dispatchEvent(
      new CustomEvent(
        "mana:fuel-updated"
      )
    );

  }


  function ensureRecoveryPanel() {

    if (
      !sharedFuelOpen()
    ) {

      return;

    }


    const progress =
      document.querySelector(
        "#manaV83Content " +
        ".mana-v897-progress"
      );


    if (!progress) {

      return;

    }


    let panel =
      document.getElementById(
        "manaV989Recovery"
      );


    if (!panel) {

      panel =
        document.createElement(
          "div"
        );


      panel.id =
        "manaV989Recovery";


      panel.className =
        "mana-v989-recovery";


      panel.innerHTML = `

        <div
          class="mana-v989-recovery-head"
        >

          <div>

            <div
              class="mana-v989-recovery-label"
            >
              REST / RECOVERY
            </div>

            <div
              class="mana-v989-recovery-title"
            >
              Daily Recovery
            </div>

          </div>


          <div
            class="mana-v989-recovery-value"
          >
            0 / 8 hrs
          </div>

        </div>


        <div
          class="mana-v989-recovery-track"
        >

          <div
            class="mana-v989-recovery-fill"
          ></div>

        </div>


        <div
          class="mana-v989-recovery-sub"
        >
          Track your sleep and dedicated
          recovery time against an
          8-hour daily target.
        </div>


        <div
          class="mana-v989-recovery-actions"
        >

          <button
            type="button"
            class="mana-v989-recovery-btn"
            data-v989-recovery="2"
          >
            +2 HRS
          </button>


          <button
            type="button"
            class="mana-v989-recovery-btn"
            data-v989-recovery="4"
          >
            +4 HRS
          </button>


          <button
            type="button"
            class="mana-v989-recovery-btn"
            data-v989-recovery="8"
          >
            +8 HRS
          </button>

        </div>


        <button
          type="button"
          id="manaV989RecoveryReset"
          class="mana-v989-recovery-reset"
        >
          RESET TODAY'S RECOVERY
        </button>

      `;


      const oldWater =
        progress.querySelector(
          ".mana-v897-water"
        );


      if (oldWater) {

        oldWater
          .insertAdjacentElement(
            "beforebegin",
            panel
          );

      } else {

        progress
          .appendChild(
            panel
          );

      }


      panel
        .querySelectorAll(
          "[data-v989-recovery]"
        )
        .forEach(
          button => {

            button
              .addEventListener(
                "click",
                event => {

                  event.preventDefault();

                  event.stopPropagation();


                  addRecovery(

                    Number(
                      button
                        .dataset
                        .v989Recovery
                    )

                  );

                }
              );

          }
        );


      panel
        .querySelector(
          "#manaV989RecoveryReset"
        )
        ?.addEventListener(
          "click",
          event => {

            event.preventDefault();

            event.stopPropagation();

            resetRecovery();

          }
        );

    }


    updateRecoveryUI();

  }


  /* =========================================
     MASTER REFRESH
     ========================================= */

  function refresh() {

    ensureProgramProfileButton();


    if (
      sharedFuelOpen()
    ) {

      polishFuelProfileButton();

      ensureProfileNote();

      ensureRecoveryPanel();

    }

  }


  function scheduleRefresh(
    delay = 60
  ) {

    clearTimeout(
      refreshTimer
    );


    refreshTimer =
      setTimeout(
        refresh,
        delay
      );

  }


  function stagedRefresh() {

    scheduleRefresh(
      40
    );


    setTimeout(
      refresh,
      140
    );


    setTimeout(
      refresh,
      320
    );

  }


  /* =========================================
     EVENTS
     ========================================= */

  function wireEvents() {

    window.addEventListener(
      "mana:program-tab-change",
      stagedRefresh
    );


    window.addEventListener(
      "mana:profile-synced",
      stagedRefresh
    );


    window.addEventListener(
      "mana:fuel-updated",
      () => {

        setTimeout(
          refresh,
          60
        );

      }
    );


    window.addEventListener(
      "focus",
      () => {

        if (
          programOpen()
        ) {

          stagedRefresh();

        }

      }
    );


    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.visibilityState ===
            "visible"
          &&
          programOpen()
        ) {

          stagedRefresh();

        }

      }
    );


    /*
      Shared Fuel rebuilds its HTML after
      many Fuel actions.

      Rather than watching the whole DOM,
      simply refresh after actual user
      interactions inside Fuel.
    */

    document.addEventListener(
      "click",
      event => {

        const shell =
          event.target.closest(
            "#manaV83ProgramShell"
          );


        if (!shell) {

          return;

        }


        /*
          Program navigation / tabs.
        */

        if (
          event.target.closest(
            "#manaV83Tabs," +
            "#manaV80Mana28," +
            "#manaV80Strength," +
            "#manaV80Life," +
            ".mana-v83-tab"
          )
        ) {

          stagedRefresh();

          return;

        }


        /*
          Any interaction while Fuel is
          open may cause the shared Fuel
          renderer to rebuild its content.
        */

        if (
          sharedFuelOpen()
        ) {

          setTimeout(
            refresh,
            80
          );


          setTimeout(
            refresh,
            240
          );

        }

      },
      true
    );

  }


  /* =========================================
     PROFILE STATUS HELPER
     ========================================= */

  function profileSummary() {

    const profile =
      loadProfile();


    const parts =
      [];


    if (
      profile.goal
    ) {

      parts.push(
        profile.goal
      );

    }


    if (
      profile.days
    ) {

      parts.push(
        `${profile.days} days/week`
      );

    }


    if (
      profile.experience
    ) {

      parts.push(
        profile.experience
      );

    }


    return (
      parts.join(
        " • "
      )
      ||
      "Profile not completed"
    );

  }


  /* =========================================
     PUBLIC HELPERS
     ========================================= */

  window.ManaProfileRecovery =
    {

      openProfile:
        openMasterProfile,

      refresh,

      profileSummary,

      recoveryHours

    };


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    wireEvents();


    stagedRefresh();


    window.MANA_PROFILE_RECOVERY_BUILD =
      BUILD;


    console.log(
      "[Mana v9.89.0] " +
      "master profile + shared recovery ready"
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
