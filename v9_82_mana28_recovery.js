/* =========================================
   MANA MOVEMENT TRAINING v9.82.0

   MANA 28 RECOVERY + LYFE IDENTITY

   - MANA LYFE OVERVIEW CARD RENAMED
   - MANA 28 FUEL ONLY
   - DAILY RECOVERY TRACKING
   - 8 HOUR DAILY TARGET
   - QUICK ADD +2 / +4 / +8 HOURS
   - SAVES INTO SHARED FUEL DAILY STORE
   - AUTOMATICALLY AVAILABLE TO PROGRESS
   - DOES NOT ALTER MANA STRENGTH FUEL
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "98200";

  const FUEL_KEY =
    "mana-fuel-v571";

  const STYLE_ID =
    "mana-v982-recovery-style";

  const RECOVERY_TARGET =
    8;

  let timer =
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
     FUEL STORE
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


  function loadToday() {

    const store =
      loadStore();


    return (
      store[
        todayKey()
      ] || {
        meals:{
          Breakfast:[],
          Lunch:[],
          Dinner:[],
          Snacks:[]
        },
        water:0,
        recoveryHours:0
      }
    );

  }


  function recoveryToday() {

    return Number(
      loadToday()
        .recoveryHours || 0
    );

  }


  function addRecovery(
    hours
  ) {

    const store =
      loadStore();


    const key =
      todayKey();


    const day =
      store[key] || {
        meals:{
          Breakfast:[],
          Lunch:[],
          Dinner:[],
          Snacks:[]
        },
        water:0
      };


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


    store[key] =
      day;


    saveStore(
      store
    );


    enhanceFuel();

  }


  function resetRecovery() {

    const store =
      loadStore();


    const key =
      todayKey();


    const day =
      store[key];


    if (!day) {

      return;

    }


    day.recoveryHours =
      0;


    store[key] =
      day;


    saveStore(
      store
    );


    enhanceFuel();

  }


  /* =========================================
     STYLES
     ========================================= */

  function installStyles() {

    if (
      document.getElementById(
        STYLE_ID
      )
    ) {

      return;

    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      STYLE_ID;


    style.textContent = `

      /* =====================================
         MANA 28 RECOVERY METRIC
         ===================================== */

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

        background:#f3d875;

      }


      /* =====================================
         WATER + RECOVERY QUICK ADD
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

      }


      .mana-v982-quick-title{

        margin-bottom:8px;

        color:#aaa;

        font-size:12px;

        font-weight:850;

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

        padding:0 5px;

        border:
          1px solid #343434;

        border-radius:12px;

        background:#111;

        color:#f3d875;

        font-size:11px;

        font-weight:950;

        cursor:pointer;

      }


      .mana-v982-reset{

        width:100%;

        min-height:34px;

        margin-top:6px;

        border:
          1px solid #2b2b2b;

        border-radius:10px;

        background:#0b0b0b;

        color:#777;

        font-size:9px;

        font-weight:850;

      }


      @media(max-width:470px){

        .mana-v982-quick-wrap{

          grid-template-columns:
            1fr;

          gap:14px;

        }

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     LYFE OVERVIEW NAME
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


    const cards =
      root.querySelectorAll(
        ".mana-v978-launch"
      );


    cards.forEach(
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


        const titleEl =
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


        if (titleEl) {

          titleEl.textContent =
            "Move • Reset • Rebuild";

        }


        if (text) {

          text.textContent =
            "Strength, movement, cardio, recovery and mindset sessions built to help you regain momentum.";

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
     MANA 28 FUEL ENHANCEMENT
     ========================================= */

  function enhanceFuel() {

    if (
      !mana28FuelOpen()
    ) {

      return;

    }


    const root =
      holder();


    if (!root) {

      return;

    }


    const progressCard =
      root.querySelector(
        ".mana-v897-progress"
      );


    const grid =
      progressCard
        ?.querySelector(
          ".mana-v897-grid"
        );


    if (
      !progressCard ||
      !grid
    ) {

      return;

    }


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


    /*
      Existing Fuel renders Water as a
      wide card. For Mana 28 we make
      Water and Recovery equal cards.
    */

    const water =
      [...grid.children]
        .find(
          child =>
            child
              .querySelector(
                ".mana-v897-label"
              )
              ?.textContent
              ?.trim()
              ?.toLowerCase() ===
            "water"
        );


    if (water) {

      water.classList
        .remove(
          "wide"
        );

    }


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


    /*
      Replace the original single Water
      quick-add section with paired
      Water + Recovery quick actions.
    */

    const oldWater =
      progressCard.querySelector(
        ".mana-v897-water"
      );


    if (!oldWater) {

      return;

    }


    let quickWrap =
      progressCard.querySelector(
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


      oldWater.replaceWith(
        quickWrap
      );

    }


    quickWrap.innerHTML = `

      <div
        class="mana-v982-quick"
      >

        <div
          class="mana-v982-quick-title"
        >
          Quick add water
        </div>


        <div
          class="mana-v982-buttons"
        >

          <button
            type="button"
            class="mana-v982-btn"
            data-v982-water="250"
          >
            +250ml
          </button>


          <button
            type="button"
            class="mana-v982-btn"
            data-v982-water="500"
          >
            +500ml
          </button>


          <button
            type="button"
            class="mana-v982-btn"
            data-v982-water="750"
          >
            +750ml
          </button>

        </div>

      </div>


      <div
        class="mana-v982-quick"
      >

        <div
          class="mana-v982-quick-title"
        >
          Quick add recovery
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


    quickWrap
      .querySelectorAll(
        "[data-v982-water]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              const amount =
                Number(
                  button.dataset
                    .v982Water
                );


              /*
                Trigger the existing shared
                Fuel Water button so the
                original save / render logic
                remains in control.
              */

              const hiddenButton =
                document.createElement(
                  "button"
                );


              hiddenButton.style.display =
                "none";


              hiddenButton.dataset
                .manaWater =
                String(
                  amount
                );


              root.appendChild(
                hiddenButton
              );


              const day =
                loadToday();


              day.water =
                Number(
                  day.water || 0
                )
                +
                amount;


              const store =
                loadStore();


              store[
                todayKey()
              ] =
                day;


              saveStore(
                store
              );


              hiddenButton.remove();


              /*
                Shared Fuel needs to redraw
                its normal calorie/protein/
                water screen.
              */

              window.dispatchEvent(
                new CustomEvent(
                  "mana:profile-synced"
                )
              );


              schedule(
                100
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


    document
      .getElementById(
        "manaV982ResetRecovery"
      )
      ?.addEventListener(
        "click",
        resetRecovery
      );

  }


  /* =========================================
     SCHEDULING
     ========================================= */

  function run() {

    renameLyfeOverview();

    enhanceFuel();

  }


  function schedule(
    delay = 120
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


    schedule(
      100
    );


    window.addEventListener(

      "mana:program-tab-change",

      () => {

        schedule(
          140
        );


        setTimeout(
          run,
          300
        );

      }

    );


    window.addEventListener(

      "mana:profile-synced",

      () => {

        schedule(
          160
        );

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
            180
          );

        }

      },

      true

    );


    window.MANA28_RECOVERY_BUILD =
      BUILD;


    console.log(
      "[Mana v9.82.0] recovery + Lyfe identity ready"
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
