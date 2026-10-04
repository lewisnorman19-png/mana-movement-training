/* =========================================
   MANA MOVEMENT TRAINING v9.82.2

   MANA 28 RECOVERY + LYFE IDENTITY

   - STABLE / NO REPEATED FUEL REPAINTS
   - WATER + RECOVERY DIRECT DOM UPDATE
   - RECOVERY SAVED TO DAILY FUEL STORE
   - RECOVERY EVENT SENT TO PROGRESS
   - 8 HOUR DAILY RECOVERY TARGET
   - +2 / +4 / +8 HOUR QUICK ADD
   - MANA LYFE OVERVIEW NAME
   - STRENGTH FUEL UNTOUCHED
   ========================================= */

(() => {
  "use strict";

  const BUILD = "98220";

  const FUEL_KEY =
    "mana-fuel-v571";

  const TARGET_KEY =
    "mana-fuel-v58-targets";

  const STYLE_ID =
    "mana-v982-recovery-style";

  const RECOVERY_TARGET =
    8;

  let observer =
    null;

  let enhancing =
    false;


  /* =========================================
     HELPERS
     ========================================= */

  function safeJson(raw,fallback) {

    try {
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }

  }


  function clamp(value,min,max) {

    return Math.max(
      min,
      Math.min(
        max,
        value
      )
    );

  }


  function todayKey() {

    const d =
      new Date();

    return [
      d.getFullYear(),
      String(
        d.getMonth() + 1
      ).padStart(2,"0"),
      String(
        d.getDate()
      ).padStart(2,"0")
    ].join("-");

  }


  function holder() {

    return document.getElementById(
      "manaV83Content"
    );

  }


  function shell() {

    return document.getElementById(
      "manaV83ProgramShell"
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
        ?.toUpperCase()
      || ""
    );

  }


  function activeTab() {

    return (
      document.querySelector(
        "#manaV83Tabs .mana-v83-tab.active"
      )
      ?.dataset
      ?.v83Tab
      || ""
    );

  }


  function mana28FuelOpen() {

    return Boolean(

      shell()
        ?.classList
        .contains("open")

      &&

      title() ===
        "MANA 28"

      &&

      activeTab() ===
        "fuel"

    );

  }


  function lyfeOverviewOpen() {

    return Boolean(

      shell()
        ?.classList
        .contains("open")

      &&

      (
        title() === "MANA LYFE"
        ||
        title() === "MANA LIFE"
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


  function saveStore(store) {

    localStorage.setItem(
      FUEL_KEY,
      JSON.stringify(store)
    );

  }


  function loadTargets() {

    return safeJson(
      localStorage.getItem(
        TARGET_KEY
      ) || "{}",
      {}
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
      store[todayKey()]
      ||
      blankDay()
    );

  }


  function saveToday(day) {

    const store =
      loadStore();

    store[todayKey()] =
      day;

    saveStore(store);

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

      .mana-v897-grid
      .mana-v982-water-card{
        grid-column:auto !important;
      }


      .mana-v982-recovery-card{
        padding:14px;
        border:1px solid #292929;
        border-radius:16px;
        background:#090909;
      }


      .mana-v982-label{
        margin-bottom:6px;
        color:#999;
        font-size:11px;
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
            #c69d2d,
            #f3d875
          );
      }


      .mana-v982-quick-wrap{
        display:grid;
        grid-template-columns:
          repeat(
            2,
            minmax(0,1fr)
          );
        gap:10px;
        margin-top:14px;
        padding-top:14px;
        border-top:1px solid #292929;
      }


      .mana-v982-quick{
        min-width:0;
        padding:11px;
        border:1px solid #272727;
        border-radius:15px;
        background:#0a0a0a;
      }


      .mana-v982-quick-title{
        margin-bottom:9px;
        color:#aaa;
        font-size:10px;
        font-weight:950;
        letter-spacing:.05em;
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
        min-width:0;
        min-height:44px;
        padding:0 3px;
        border:1px solid #40371b;
        border-radius:11px;
        background:
          linear-gradient(
            145deg,
            #17150d,
            #101010
          );
        color:#f3d875;
        font-size:10px;
        font-weight:950;
        cursor:pointer;
        touch-action:manipulation;
      }


      .mana-v982-btn:active{
        transform:scale(.98);
      }


      .mana-v982-reset{
        width:100%;
        min-height:31px;
        margin-top:7px;
        border:1px solid #292929;
        border-radius:9px;
        background:#090909;
        color:#747474;
        font-size:8px;
        font-weight:900;
      }


      @media(max-width:470px){

        .mana-v982-quick-wrap{
          grid-template-columns:1fr;
          gap:9px;
        }

      }

    `;


    document.head
      .appendChild(style);

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


    root
      ?.querySelectorAll(
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
     WATER CARD
     ========================================= */

  function findWaterCard(grid) {

    return (
      [...grid.children]
        .find(
          card =>

            card
              .querySelector(
                ".mana-v897-label"
              )
              ?.textContent
              ?.trim()
              ?.toLowerCase()
            ===
            "water"

        )
      ||
      null
    );

  }


  function updateWaterCard() {

    if (
      !mana28FuelOpen()
    ) {
      return;
    }


    const grid =
      holder()
        ?.querySelector(
          ".mana-v897-grid"
        );


    if (!grid) {
      return;
    }


    const card =
      findWaterCard(grid);


    if (!card) {
      return;
    }


    const day =
      loadToday();


    const targets =
      loadTargets();


    const water =
      Number(
        day.water || 0
      );


    const target =
      Number(
        targets.water || 0
      );


    const percentage =
      target > 0

        ? clamp(
            Math.round(
              water /
              target *
              100
            ),
            0,
            100
          )

        : 0;


    const value =
      card.querySelector(
        ".mana-v897-value"
      );


    const fill =
      card.querySelector(
        ".mana-v897-fill"
      );


    if (value) {

      value.textContent =
        target > 0
          ? `${Math.round(water)} / ${target}ml`
          : `${Math.round(water)}ml`;

    }


    if (fill) {

      fill.style.width =
        `${percentage}%`;

    }

  }


  /* =========================================
     RECOVERY CARD
     ========================================= */

  function updateRecoveryCard() {

    const card =
      document.getElementById(
        "manaV982Recovery"
      );


    if (!card) {
      return;
    }


    const hours =
      Number(
        loadToday()
          .recoveryHours || 0
      );


    const percentage =
      clamp(
        Math.round(
          hours /
          RECOVERY_TARGET *
          100
        ),
        0,
        100
      );


    const value =
      card.querySelector(
        ".mana-v982-value"
      );


    const fill =
      card.querySelector(
        ".mana-v982-fill"
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


  /* =========================================
     ADD WATER
     ========================================= */

  function addWater(amount) {

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


    saveToday(day);


    updateWaterCard();


    window.dispatchEvent(
      new CustomEvent(
        "mana:fuel-updated"
      )
    );

  }


  /* =========================================
     ADD RECOVERY
     ========================================= */

  function addRecovery(hours) {

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


    saveToday(day);


    updateRecoveryCard();


    window.dispatchEvent(
      new CustomEvent(
        "mana:recovery-updated"
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


    saveToday(day);


    updateRecoveryCard();


    window.dispatchEvent(
      new CustomEvent(
        "mana:recovery-updated"
      )
    );


    window.dispatchEvent(
      new CustomEvent(
        "mana:fuel-updated"
      )
    );

  }


  /* =========================================
     ENHANCE FUEL
     ========================================= */

  function enhanceFuel() {

    if (
      enhancing ||
      !mana28FuelOpen()
    ) {
      return;
    }


    const root =
      holder();


    const card =
      root
        ?.querySelector(
          ".mana-v897-progress"
        );


    const grid =
      card
        ?.querySelector(
          ".mana-v897-grid"
        );


    if (
      !root ||
      !card ||
      !grid
    ) {
      return;
    }


    if (
      card.dataset
        .v982Enhanced ===
        BUILD
      &&
      document.getElementById(
        "manaV982Recovery"
      )
      &&
      document.getElementById(
        "manaV982QuickWrap"
      )
    ) {

      return;

    }


    enhancing =
      true;


    try {

      const waterCard =
        findWaterCard(grid);


      if (waterCard) {

        waterCard
          .classList
          .remove(
            "wide"
          );


        waterCard
          .classList
          .add(
            "mana-v982-water-card"
          );

      }


      let recovery =
        document.getElementById(
          "manaV982Recovery"
        );


      if (!recovery) {

        recovery =
          document.createElement(
            "div"
          );


        recovery.id =
          "manaV982Recovery";


        recovery.className =
          "mana-v982-recovery-card";


        recovery.innerHTML = `

          <div
            class="mana-v982-label"
          >
            Recovery
          </div>


          <div
            class="mana-v982-value"
          >
            0 / 8 hrs
          </div>


          <div
            class="mana-v982-track"
          >

            <div
              class="mana-v982-fill"
            ></div>

          </div>

        `;


        grid.appendChild(
          recovery
        );

      }


      const oldQuick =
        card.querySelector(
          ".mana-v897-water"
        );


      let quick =
        document.getElementById(
          "manaV982QuickWrap"
        );


      if (!quick) {

        quick =
          document.createElement(
            "div"
          );


        quick.id =
          "manaV982QuickWrap";


        quick.className =
          "mana-v982-quick-wrap";


        quick.innerHTML = `

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
              id="manaV982Reset"
              class="mana-v982-reset"
            >
              RESET TODAY'S RECOVERY
            </button>

          </div>

        `;


        if (oldQuick) {

          oldQuick.replaceWith(
            quick
          );

        } else {

          card.appendChild(
            quick
          );

        }

      }


      quick
        .querySelectorAll(
          "[data-v982-water]"
        )
        .forEach(
          button => {

            button.onclick =
              () => {

                addWater(
                  Number(
                    button.dataset
                      .v982Water
                  )
                );

              };

          }
        );


      quick
        .querySelectorAll(
          "[data-v982-recovery]"
        )
        .forEach(
          button => {

            button.onclick =
              () => {

                addRecovery(
                  Number(
                    button.dataset
                      .v982Recovery
                  )
                );

              };

          }
        );


      document
        .getElementById(
          "manaV982Reset"
        )
        ?.addEventListener(
          "click",
          resetRecovery
        );


      card.dataset
        .v982Enhanced =
        BUILD;


      updateWaterCard();

      updateRecoveryCard();

    }

    finally {

      enhancing =
        false;

    }

  }


  /* =========================================
     OBSERVER
     ========================================= */

  function installObserver() {

    const root =
      holder();


    if (!root) {

      requestAnimationFrame(
        installObserver
      );

      return;

    }


    observer
      ?.disconnect();


    observer =
      new MutationObserver(
        () => {

          if (
            enhancing
          ) {
            return;
          }


          if (
            mana28FuelOpen()
          ) {

            enhanceFuel();

          }


          if (
            lyfeOverviewOpen()
          ) {

            renameLyfeOverview();

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
     EVENTS
     ========================================= */

  function run() {

    renameLyfeOverview();

    enhanceFuel();

  }


  function init() {

    installStyles();

    installObserver();


    queueMicrotask(
      run
    );


    window.addEventListener(
      "mana:program-tab-change",
      () => {

        queueMicrotask(
          run
        );

      }
    );


    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "#manaV83Tabs," +
            "#manaV80Mana28," +
            "#manaV80Life"
          )
        ) {

          queueMicrotask(
            run
          );

        }

      },
      true
    );


    window.MANA28_RECOVERY_BUILD =
      BUILD;


    console.log(
      "[Mana v9.82.2] stable recovery ready"
    );

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      {once:true}
    );

  } else {

    init();

  }

})();
