/* =========================================
   MANA MOVEMENT TRAINING v9.82.1

   MANA 28 RECOVERY + LYFE IDENTITY

   FIX:
   - SHARED FUEL CAN RENDER FIRST
   - THIS FILE THEN OWNS THE MANA 28
     DAILY PROGRESS ENHANCEMENT
   - WATCHES FOR SHARED FUEL REPAINTS
   - RE-APPLIES RECOVERY WITHOUT FLICKER
   - DOES NOT CHANGE MANA STRENGTH FUEL

   FEATURES:
   - LYFE OVERVIEW CARD RENAMED
   - MANA 28 RECOVERY BESIDE WATER
   - +2 HRS / +4 HRS / +8 HRS
   - 8 HOUR DAILY TARGET
   - RECOVERY SAVED IN DAILY FUEL DATA
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "98210";

  const FUEL_KEY =
    "mana-fuel-v571";

  const STYLE_ID =
    "mana-v982-recovery-style";

  const RECOVERY_TARGET =
    8;

  let timer =
    null;

  let observer =
    null;

  let enhancing =
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

    ].join("-");

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


  function title() {

    return (
      document
        .getElementById(
          "manaV83Title"
        )
        ?.textContent
        ?.trim()
        ?.toUpperCase() ||
      ""
    );

  }


  function activeTab() {

    return (
      document
        .querySelector(
          "#manaV83Tabs .mana-v83-tab.active"
        )
        ?.dataset
        ?.v83Tab ||
      ""
    );

  }


  function mana28FuelOpen() {

    return Boolean(

      shell()
        ?.classList
        .contains(
          "open"
        )

      &&

      title() ===
        "MANA 28"

      &&

      activeTab() ===
        "fuel"

    );

  }


  function lyfeOverviewOpen() {

    const currentTitle =
      title();


    return Boolean(

      shell()
        ?.classList
        .contains(
          "open"
        )

      &&

      (
        currentTitle ===
          "MANA LIFE"

        ||

        currentTitle ===
          "MANA LYFE"
      )

      &&

      activeTab() ===
        "overview"

    );

  }


  /* =========================================
     STORE
     ========================================= */

  function loadStore() {

    return safeJson(

      localStorage.getItem(
        FUEL_KEY
      ) || "{}",

      {}

    );

  }


  function saveStore(
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

      meals:{

        Breakfast:[],

        Lunch:[],

        Dinner:[],

        Snacks:[]

      },

      water:0,

      recoveryHours:0

    };

  }


  function loadToday() {

    const store =
      loadStore();


    return (

      store[
        todayKey()
      ]

      ||

      blankDay()

    );

  }


  function saveToday(
    day
  ) {

    const store =
      loadStore();


    store[
      todayKey()
    ] =
      day;


    saveStore(
      store
    );

  }


  /* =========================================
     RECOVERY
     ========================================= */

  function recoveryToday() {

    return Number(
      loadToday()
        .recoveryHours || 0
    );

  }


  function addRecovery(
    hours
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
          hours || 0
        )

      );


    saveToday(
      day
    );


    enhanceFuel(
      true
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


    enhanceFuel(
      true
    );

  }


  /* =========================================
     WATER
     ========================================= */

  function addWater(
    amount
  ) {

    const day =
      loadToday();


    day.water =
      Math.max(

        0,

        Number(
          day.water || 0
        )

        +

        Number(
          amount || 0
        )

      );


    saveToday(
      day
    );


    /*
      Ask the existing shared Fuel renderer
      to update its normal water totals.

      Our MutationObserver will immediately
      restore Recovery after that repaint.
    */

    window.dispatchEvent(

      new CustomEvent(
        "mana:profile-synced"
      )

    );


    schedule(
      30
    );


    setTimeout(
      () => enhanceFuel(true),
      100
    );


    setTimeout(
      () => enhanceFuel(true),
      240
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
         WATER / RECOVERY CARDS
         ===================================== */

      .mana-v897-grid
      .mana-v897-stat.mana-v982-water{

        grid-column:auto !important;

      }


      .mana-v982-recovery-stat{

        padding:14px;

        border:
          1px solid #292929;

        border-radius:16px;

        background:#090909;

      }


      .mana-v982-label{

        color:#999;

        font-size:11px;

        margin-bottom:6px;

      }


      .mana-v982-value{

        color:#f3d875;

        font-size:20px;

        font-weight:900;

      }


      .mana-v982-track{

        height:6px;

        margin-top:10px;

        overflow:hidden;

        border-radius:999px;

        background:#242424;

      }


      .mana-v982-fill{

        height:100%;

        border-radius:999px;

        background:
          linear-gradient(
            90deg,
            #c79e2d,
            #f3d875
          );

      }


      /* =====================================
         QUICK ADD
         ===================================== */

      .mana-v982-quick-wrap{

        display:grid;

        grid-template-columns:
          1fr 1fr;

        gap:10px;

        margin-top:14px;

        padding-top:14px;

        border-top:
          1px solid #292929;

      }


      .mana-v982-quick{

        min-width:0;

        padding:12px;

        border:
          1px solid #272727;

        border-radius:15px;

        background:#0a0a0a;

      }


      .mana-v982-quick-title{

        margin-bottom:9px;

        color:#aaa;

        font-size:11px;

        font-weight:900;

        letter-spacing:.03em;

      }


      .mana-v982-buttons{

        display:grid;

        grid-template-columns:
          repeat(
            3,
            minmax(0,1fr)
          );

        gap:6px;

      }


      .mana-v982-btn{

        min-height:44px;

        min-width:0;

        padding:
          0 4px;

        border:
          1px solid #40371b;

        border-radius:11px;

        background:
          linear-gradient(
            145deg,
            #16140d,
            #101010
          );

        color:#f3d875;

        font-size:10px;

        font-weight:950;

        cursor:pointer;

        touch-action:manipulation;

      }


      .mana-v982-btn:active{

        transform:
          scale(.98);

      }


      .mana-v982-reset{

        width:100%;

        min-height:33px;

        margin-top:7px;

        border:
          1px solid #282828;

        border-radius:9px;

        background:#090909;

        color:#727272;

        font-size:8px;

        font-weight:900;

        letter-spacing:.04em;

      }


      @media(max-width:470px){

        .mana-v982-quick-wrap{

          grid-template-columns:
            1fr;

          gap:9px;

        }


        .mana-v982-quick{

          padding:11px;

        }

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     LYFE OVERVIEW
     ========================================= */

  function renameLyfeOverview() {

    if (
      !lyfeOverviewOpen()
    ) {

      return;

    }


    const root =
      holder();


    if (!root) {

      return;

    }


    root
      .querySelectorAll(
        ".mana-v978-launch"
      )
      .forEach(
        card => {

          if (
            card.dataset
              .v978Tab !==
            "routine"
          ) {

            return;

          }


          const label =
            card.querySelector(
              ".mana-v978-label"
            );


          const heading =
            card.querySelector(
              ".mana-v978-title"
            );


          const text =
            card.querySelector(
              ".mana-v978-text"
            );


          const arrow =
            card.querySelector(
              ".mana-v978-arrow"
            );


          const icon =
            card.querySelector(
              ".mana-v978-icon"
            );


          if (label) {

            label.textContent =
              "LYFE SESSIONS";

          }


          if (heading) {

            heading.textContent =
              "Move • Reset • Rebuild";

          }


          if (text) {

            text.textContent =
              "Strength, movement, cardio, recovery and mindset sessions designed to rebuild momentum.";

          }


          if (arrow) {

            arrow.textContent =
              "VIEW SESSIONS →";

          }


          if (icon) {

            icon.textContent =
              "LY";

          }

        }
      );

  }


  /* =========================================
     FIND WATER CARD
     ========================================= */

  function findWaterCard(
    grid
  ) {

    return (
      [...grid.children]
        .find(
          child => {

            return (
              child
                .querySelector(
                  ".mana-v897-label"
                )
                ?.textContent
                ?.trim()
                ?.toLowerCase()
              ===
              "water"
            );

          }
        )
      ||
      null
    );

  }


  /* =========================================
     ENHANCE MANA 28 FUEL
     ========================================= */

  function enhanceFuel(
    force = false
  ) {

    if (
      enhancing ||
      !mana28FuelOpen()
    ) {

      return;

    }


    const root =
      holder();


    const progressCard =
      root
        ?.querySelector(
          ".mana-v897-progress"
        );


    const grid =
      progressCard
        ?.querySelector(
          ".mana-v897-grid"
        );


    if (
      !root ||
      !progressCard ||
      !grid
    ) {

      return;

    }


    if (
      !force &&

      progressCard
        .dataset
        .v982Enhanced ===
        BUILD &&

      grid.querySelector(
        "#manaV982RecoveryStat"
      ) &&

      progressCard.querySelector(
        "#manaV982QuickWrap"
      )
    ) {

      return;

    }


    enhancing =
      true;


    try {

      const recovery =
        recoveryToday();


      const recoveryPct =
        clamp(

          Math.round(

            recovery /
            RECOVERY_TARGET *
            100

          ),

          0,

          100

        );


      /* =====================================
         WATER CARD
         ===================================== */

      const waterCard =
        findWaterCard(
          grid
        );


      if (
        waterCard
      ) {

        waterCard
          .classList
          .remove(
            "wide"
          );


        waterCard
          .classList
          .add(
            "mana-v982-water"
          );

      }


      /* =====================================
         RECOVERY CARD
         ===================================== */

      let recoveryCard =
        grid.querySelector(
          "#manaV982RecoveryStat"
        );


      if (
        !recoveryCard
      ) {

        recoveryCard =
          document.createElement(
            "div"
          );


        recoveryCard.id =
          "manaV982RecoveryStat";


        recoveryCard.className =
          "mana-v982-recovery-stat";


        grid.appendChild(
          recoveryCard
        );

      }


      recoveryCard.innerHTML = `

        <div
          class="mana-v982-label"
        >
          Recovery
        </div>


        <div
          class="mana-v982-value"
        >
          ${recovery}
          /
          ${RECOVERY_TARGET} hrs
        </div>


        <div
          class="mana-v982-track"
        >

          <div
            class="mana-v982-fill"

            style="
              width:${recoveryPct}%
            "
          ></div>

        </div>

      `;


      /* =====================================
         QUICK ADD
         ===================================== */

      const originalWaterQuick =
        progressCard
          .querySelector(
            ".mana-v897-water"
          );


      let quickWrap =
        progressCard
          .querySelector(
            "#manaV982QuickWrap"
          );


      if (
        !quickWrap
      ) {

        quickWrap =
          document.createElement(
            "div"
          );


        quickWrap.id =
          "manaV982QuickWrap";


        quickWrap.className =
          "mana-v982-quick-wrap";


        if (
          originalWaterQuick
        ) {

          originalWaterQuick
            .replaceWith(
              quickWrap
            );

        } else {

          progressCard
            .appendChild(
              quickWrap
            );

        }

      }


      quickWrap.innerHTML = `

        <div
          class="mana-v982-quick"
        >

          <div
            class="mana-v982-quick-title"
          >
            QUICK ADD WATER
          </div>


          <div
            class="mana-v982-buttons"
          >

            <button
              type="button"

              class="mana-v982-btn"

              data-v982-water="250"
            >
              +250ML
            </button>


            <button
              type="button"

              class="mana-v982-btn"

              data-v982-water="500"
            >
              +500ML
            </button>


            <button
              type="button"

              class="mana-v982-btn"

              data-v982-water="750"
            >
              +750ML
            </button>

          </div>

        </div>


        <div
          class="mana-v982-quick"
        >

          <div
            class="mana-v982-quick-title"
          >
            QUICK ADD RECOVERY
          </div>


          <div
            class="mana-v982-buttons"
          >

            <button
              type="button"

              class="mana-v982-btn"

              data-v982-recovery="2"
            >
              +2 HRS
            </button>


            <button
              type="button"

              class="mana-v982-btn"

              data-v982-recovery="4"
            >
              +4 HRS
            </button>


            <button
              type="button"

              class="mana-v982-btn"

              data-v982-recovery="8"
            >
              +8 HRS
            </button>

          </div>


          <button
            type="button"

            class="mana-v982-reset"

            id="manaV982ResetRecovery"
          >
            RESET TODAY'S RECOVERY
          </button>

        </div>

      `;


      /* =====================================
         BUTTONS
         ===================================== */

      quickWrap
        .querySelectorAll(
          "[data-v982-water]"
        )
        .forEach(
          button => {

            button.addEventListener(
              "click",
              () => {

                addWater(

                  Number(
                    button.dataset
                      .v982Water
                  )

                );

              }
            );

          }
        );


      quickWrap
        .querySelectorAll(
          "[data-v982-recovery]"
        )
        .forEach(
          button => {

            button.addEventListener(
              "click",
              () => {

                addRecovery(

                  Number(
                    button.dataset
                      .v982Recovery
                  )

                );

              }
            );

          }
        );


      quickWrap
        .querySelector(
          "#manaV982ResetRecovery"
        )
        ?.addEventListener(
          "click",
          resetRecovery
        );


      progressCard
        .dataset
        .v982Enhanced =
        BUILD;

    }

    finally {

      enhancing =
        false;

    }

  }


  /* =========================================
     MUTATION WATCHER

     THIS IS THE IMPORTANT FIX.

     IF SHARED FUEL REPAINTS THE SCREEN,
     WE RE-ENHANCE THE NEW CARD.
     ========================================= */

  function installObserver() {

    const root =
      holder();


    if (!root) {

      setTimeout(
        installObserver,
        250
      );

      return;

    }


    if (
      observer
    ) {

      observer.disconnect();

    }


    observer =
      new MutationObserver(
        mutations => {

          if (
            enhancing ||
            !mana28FuelOpen()
          ) {

            return;

          }


          const progressCard =
            root.querySelector(
              ".mana-v897-progress"
            );


          if (
            !progressCard
          ) {

            return;

          }


          const enhanced =
            progressCard
              .dataset
              .v982Enhanced ===
            BUILD;


          const recoveryExists =
            Boolean(

              progressCard
                .querySelector(
                  "#manaV982RecoveryStat"
                )

            );


          const quickExists =
            Boolean(

              progressCard
                .querySelector(
                  "#manaV982QuickWrap"
                )

            );


          if (
            !enhanced ||
            !recoveryExists ||
            !quickExists
          ) {

            schedule(
              10
            );

          }

        }
      );


    observer.observe(
      root,
      {

        childList:true,

        subtree:true

      }
    );

  }


  /* =========================================
     RUN
     ========================================= */

  function run() {

    renameLyfeOverview();


    if (
      mana28FuelOpen()
    ) {

      enhanceFuel();

    }

  }


  function schedule(
    delay = 60
  ) {

    clearTimeout(
      timer
    );


    timer =
      setTimeout(
        run,
        delay
      );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();


    installObserver();


    schedule(
      50
    );


    window.addEventListener(

      "mana:program-tab-change",

      () => {

        schedule(
          20
        );


        setTimeout(
          run,
          90
        );


        setTimeout(
          run,
          220
        );


        setTimeout(
          run,
          500
        );

      }

    );


    window.addEventListener(

      "mana:profile-synced",

      () => {

        schedule(
          30
        );


        setTimeout(
          run,
          180
        );

      }

    );


    window.addEventListener(

      "focus",

      () => {

        schedule(
          50
        );

      }

    );


    document.addEventListener(

      "visibilitychange",

      () => {

        if (
          document.visibilityState ===
          "visible"
        ) {

          schedule(
            40
          );

        }

      }

    );


    document.addEventListener(

      "click",

      event => {

        if (
          event.target.closest(
            "#manaV80Mana28," +
            "#manaV80Life," +
            "#manaV83Tabs"
          )
        ) {

          schedule(
            30
          );


          setTimeout(
            run,
            150
          );

        }

      },

      true

    );


    window.MANA28_RECOVERY_BUILD =
      BUILD;


    console.log(
      "[Mana v9.82.1] stable recovery owner ready"
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
