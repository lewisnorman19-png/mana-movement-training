/* =========================================
   MANA MOVEMENT TRAINING v10.28.1
   COLOUR + INTERACTION POLISH

   BUILD: 102810

   SEMANTIC COLOURS
   -----------------------------------------
   COACH / SUPPORT / UPGRADE = GREEN
   PROGRESS                  = PURPLE
   LEARNING                  = ORANGE

   ALSO
   -----------------------------------------
   - Fuel manual controls update in place
   - No Fuel flicker
   - Progress icons
   - Learning icons
   - No MutationObserver
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "102810";


  const STYLE_ID =
    "mana-v10281-final-polish";


  const GREEN =
    "#55d98b";


  const PURPLE =
    "#a681dc";


  const ORANGE =
    "#e98a54";


  const FUEL_KEY =
    "mana-fuel-v571";


  const TARGET_KEY =
    "mana-fuel-v58-targets";


  const DAILY_KEY =
    "mana-strength-v866-daily";


  /* =========================================
     ICONS
     ========================================= */

  const ICONS = {


    progress:`

      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
      >

        <path
          d="
            M12 50
            H52
          "
          fill="none"
          stroke="currentColor"
          stroke-width="4"
          stroke-linecap="round"
        />

        <path
          d="
            M16 44
            L27 33
            L36 38
            L50 19
          "
          fill="none"
          stroke="currentColor"
          stroke-width="5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <path
          d="
            M41 19
            H50
            V28
          "
          fill="none"
          stroke="currentColor"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

      </svg>

    `,


    learning:`

      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
      >

        <path
          d="
            M32 15
            C25 9 17 9 10 13
            V47
            C17 43 25 44 32 50
          "
          fill="none"
          stroke="currentColor"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <path
          d="
            M32 15
            C39 9 47 9 54 13
            V47
            C47 43 39 44 32 50
          "
          fill="none"
          stroke="currentColor"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <path
          d="
            M32 15
            V50
          "
          fill="none"
          stroke="currentColor"
          stroke-width="4"
          stroke-linecap="round"
        />

      </svg>

    `

  };


  /* =========================================
     CSS
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
         READY FOR YOUR NEXT BLOCK
         GREEN
         ===================================== */

      #manaV1017ProgramBlock
      .m1017-request{

        border:
          1px solid
          rgba(
            85,
            217,
            139,
            .72
          ) !important;

        background:

          radial-gradient(
            circle at top right,
            rgba(
              85,
              217,
              139,
              .11
            ),
            transparent
            46%
          ),

          linear-gradient(
            145deg,
            #101713,
            #090909
          ) !important;

        box-shadow:
          0
          12px
          30px
          rgba(
            0,
            0,
            0,
            .23
          ) !important;

      }


      #manaV1017ProgramBlock
      .m1017-request-title{

        color:
          #fff !important;

      }


      #manaV1017ProgramBlock
      .m1017-request-text{

        color:
          #aaa !important;

      }


      #manaV1017ProgramBlock
      .m1017-request-btn{

        border:
          1px solid
          ${GREEN} !important;

        background:
          rgba(
            85,
            217,
            139,
            .06
          ) !important;

        color:
          #dff9e8 !important;

        box-shadow:
          0
          0
          16px
          rgba(
            85,
            217,
            139,
            .08
          ) !important;

      }


      #manaV1017ProgramBlock
      .m1017-status{

        border-color:
          rgba(
            85,
            217,
            139,
            .46
          ) !important;

        background:
          rgba(
            85,
            217,
            139,
            .04
          ) !important;

        color:
          #b6e5c7 !important;

      }


      #manaV1017ProgramBlock
      .m1017-ready{

        border-color:
          ${GREEN} !important;

        color:
          ${GREEN} !important;

      }


      /* =====================================
         MANA LYFE SUPPORT CARD
         GREEN
         ===================================== */

      #manaV933Life
      .mana-v933-card.mana-v933-support{

        border:
          1px solid
          rgba(
            85,
            217,
            139,
            .72
          ) !important;

        background:

          radial-gradient(
            circle at top right,
            rgba(
              85,
              217,
              139,
              .10
            ),
            transparent
            45%
          ),

          linear-gradient(
            145deg,
            #101713,
            #090909
          ) !important;

      }


      #manaV933Life
      .mana-v933-support
      .mana-v933-kicker{

        color:
          ${GREEN} !important;

      }


      #manaV933Life
      .mana-v933-support
      .mana-v933-pill{

        border:
          1px solid
          ${GREEN} !important;

        background:
          rgba(
            85,
            217,
            139,
            .06
          ) !important;

        color:
          ${GREEN} !important;

      }


      #manaV933Life
      .mana-v933-support
      .mana-v933-primary{

        border:
          1px solid
          ${GREEN} !important;

        background:
          rgba(
            85,
            217,
            139,
            .06
          ) !important;

        color:
          #dff9e8 !important;

      }


      /* =====================================
         MANA LYFE CHAT MODAL
         GREEN
         ===================================== */

      #manaV95ChatModal.mana-v935-life-mode
      .mana-v950-header{

        border-bottom:
          1px solid
          rgba(
            85,
            217,
            139,
            .30
          ) !important;

        background:
          linear-gradient(
            180deg,
            #101713,
            #090909
          ) !important;

      }


      #manaV95ChatModal.mana-v935-life-mode
      .mana-v950-header-kicker{

        color:
          ${GREEN} !important;

      }


      #manaV935LifeChatIntro
      .mana-v935-intro-inner{

        border:
          1px solid
          rgba(
            85,
            217,
            139,
            .56
          ) !important;

        background:
          linear-gradient(
            145deg,
            #101713,
            #090909
          ) !important;

      }


      #manaV935LifeChatIntro
      .mana-v935-intro-kicker{

        color:
          ${GREEN} !important;

      }


      #manaV935LifeChatQuick
      .mana-v935-quick-btn{

        border:
          1px solid
          rgba(
            85,
            217,
            139,
            .50
          ) !important;

        background:
          rgba(
            85,
            217,
            139,
            .04
          ) !important;

        color:
          #c8eed6 !important;

      }


      #manaV95ChatModal.mana-v935-life-mode
      .mana-v950-input{

        border-color:
          rgba(
            85,
            217,
            139,
            .50
          ) !important;

      }


      #manaV95ChatModal.mana-v935-life-mode
      .mana-v950-send{

        border:
          1px solid
          ${GREEN} !important;

        background:
          rgba(
            85,
            217,
            139,
            .08
          ) !important;

        color:
          #e1f8e9 !important;

      }


      /* =====================================
         STRENGTH PROGRESS
         PURPLE
         ===================================== */

      #manaV993StrengthProgress
      .mana-v993-periods,

      #manaV993StrengthProgress
      .mana-v993-metric,

      #manaV993StrengthProgress
      .mana-v993-detail-btn,

      #manaV993StrengthProgress
      .mana-v993-panel,

      #manaV993StrengthProgress
      .mana-v993-summary,

      #manaV993StrengthProgress
      .mana-v993-exercise-select{

        border-color:
          rgba(
            166,
            129,
            220,
            .68
          ) !important;

      }


      #manaV993StrengthProgress
      .mana-v993-row{

        border-top-color:
          rgba(
            166,
            129,
            220,
            .30
          ) !important;

      }


      #manaV993StrengthProgress
      .mana-v993-period.active,

      #manaV993StrengthProgress
      .mana-v993-detail-btn.active{

        border:
          1px solid
          ${PURPLE} !important;

        background:
          rgba(
            166,
            129,
            220,
            .08
          ) !important;

        color:
          ${PURPLE} !important;

        box-shadow:
          0
          0
          16px
          rgba(
            166,
            129,
            220,
            .10
          ) !important;

      }


      #manaV993StrengthProgress
      .mana-v993-fill{

        background:
          ${PURPLE} !important;

      }


      #manaV993StrengthProgress
      .mana-v993-kicker,

      #manaV993StrengthProgress
      .mana-v993-panel-kicker{

        color:
          ${PURPLE} !important;

      }


      /* =====================================
         MANA 28 PROGRESS
         PURPLE
         ===================================== */

      #manaV83Content
      .mana-v981-root
      .mana-v981-periods,

      #manaV83Content
      .mana-v981-root
      .mana-v981-overall,

      #manaV83Content
      .mana-v981-root
      .mana-v981-card,

      #manaV83Content
      .mana-v981-root
      .mana-v981-message{

        border-color:
          rgba(
            166,
            129,
            220,
            .68
          ) !important;

      }


      #manaV83Content
      .mana-v981-root
      .mana-v981-period.active{

        background:
          rgba(
            166,
            129,
            220,
            .10
          ) !important;

        color:
          ${PURPLE} !important;

        box-shadow:
          inset
          0
          0
          0
          1px
          ${PURPLE} !important;

      }


      #manaV83Content
      .mana-v981-root
      .mana-v981-icon{

        border:
          1px solid
          ${PURPLE} !important;

        background:
          rgba(
            166,
            129,
            220,
            .06
          ) !important;

        color:
          ${PURPLE} !important;

      }


      #manaV83Content
      .mana-v981-root
      .mana-v981-kicker,

      #manaV83Content
      .mana-v981-root
      .mana-v981-overall-label{

        color:
          ${PURPLE} !important;

      }


      #manaV83Content
      .mana-v981-root
      .mana-v981-overall::before,

      #manaV83Content
      .mana-v981-root
      .mana-v981-message::before{

        background:
          ${PURPLE} !important;

      }


      #manaV83Content
      .mana-v981-root
      .mana-v981-overall-bar span,

      #manaV83Content
      .mana-v981-root
      .mana-v981-bar span{

        background:
          ${PURPLE} !important;

      }


      /* =====================================
         MANA LYFE PROGRESS
         PURPLE
         ===================================== */

      #manaV939Progress2
      .mana-v939-range button,

      #manaV939Progress2
      .mana-v939-card,

      #manaV939Progress2
      .mana-v939-stat,

      #manaV939Progress2
      .mana-v939-insight,

      #manaV939Progress2
      .mana-v939-recent-row{

        border-color:
          rgba(
            166,
            129,
            220,
            .68
          ) !important;

      }


      #manaV939Progress2
      .mana-v939-range button.active{

        border-color:
          ${PURPLE} !important;

        background:
          rgba(
            166,
            129,
            220,
            .08
          ) !important;

        color:
          ${PURPLE} !important;

      }


      #manaV939Progress2
      .mana-v939-kicker,

      #manaV939Progress2
      .mana-v939-stat strong,

      #manaV939Progress2
      .mana-v939-recent-row strong{

        color:
          ${PURPLE} !important;

      }


      #manaV939Progress2
      .mana-v939-fill,

      #manaV939Progress2
      .mana-v939-mood-bar{

        background:
          ${PURPLE} !important;

      }


      /* =====================================
         LEARNING
         ORANGE
         ===================================== */

      #manaV83Content
      .mana-v985-head{

        border-bottom-color:
          rgba(
            233,
            138,
            84,
            .45
          ) !important;

      }


      #manaV83Content
      .mana-v985-head::after{

        background:
          linear-gradient(
            90deg,
            ${ORANGE},
            transparent
          ) !important;

      }


      #manaV83Content
      .mana-v985-kicker{

        color:
          ${ORANGE} !important;

      }


      #manaV83Content
      .mana-v985-learn-card{

        border:
          1px solid
          rgba(
            233,
            138,
            84,
            .68
          ) !important;

        background:
          linear-gradient(
            145deg,
            #17110e,
            #090909
          ) !important;

      }


      #manaV83Content
      .mana-v985-learn-button
      > span:last-child{

        color:
          ${ORANGE} !important;

      }


      /* =====================================
         MANA LYFE LEARNING
         ORANGE
         ===================================== */

      #manaV933Life
      .mana-v933-learn-item{

        border:
          1px solid
          rgba(
            233,
            138,
            84,
            .68
          ) !important;

        background:
          #0c0908 !important;

      }


      #manaV933Life
      .mana-v933-learn-button
      > span:last-child{

        color:
          ${ORANGE} !important;

      }


      /* =====================================
         SECTION ICONS
         ===================================== */

      .m1028-section-title{

        display:
          flex !important;

        align-items:
          center !important;

        gap:
          12px !important;

      }


      .m1028-section-icon{

        flex:
          0 0
          42px !important;

        width:
          42px !important;

        height:
          42px !important;

        display:
          grid !important;

        place-items:
          center !important;

        border:
          1px solid
          currentColor !important;

        border-radius:
          13px !important;

        background:
          #090909 !important;

      }


      .m1028-section-icon svg{

        width:
          27px !important;

        height:
          27px !important;

      }


      .m1028-progress-icon{

        color:
          ${PURPLE} !important;

      }


      .m1028-learning-icon{

        color:
          ${ORANGE} !important;

      }


      /* =====================================
         FUEL
         IN-PLACE MANUAL UPDATE
         ===================================== */

      #manaV1015Fuel
      .m1022-target.water,

      #manaV1015Fuel
      .m1022-target.recovery{

        transition:
          border-color .15s ease,
          box-shadow .15s ease !important;

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     JSON
     ========================================= */

  function safeJson(
    raw,
    fallback = {}
  ) {

    try {

      const value =
        JSON.parse(
          raw || ""
        );


      return (
        value &&
        typeof value ===
          "object"
      )
        ? value
        : fallback;

    } catch {

      return fallback;

    }

  }


  /* =========================================
     DATE KEY
     ========================================= */

  function todayKey() {

    const d =
      new Date();


    return [

      d.getFullYear(),

      String(
        d.getMonth() + 1
      ).padStart(
        2,
        "0"
      ),

      String(
        d.getDate()
      ).padStart(
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
        Number(value) || 0
      )
    );

  }


  /* =========================================
     FUEL TILE UPDATE
     ========================================= */

  function updateFuelTile(
    type,
    value,
    target,
    suffix = ""
  ) {

    const tile =
      document.querySelector(
        `#manaV1015Fuel .m1022-target.${type}`
      );


    if (!tile) {
      return;
    }


    const valueEl =
      tile.querySelector(
        ".m1022-target-value"
      );


    if (valueEl) {

      valueEl.innerHTML = `

        ${value}
        ${suffix}

        <span>
          / ${target}
          ${suffix}
        </span>

      `;

    }


    const bar =
      tile.querySelector(
        ".m1022-bar span"
      );


    if (bar) {

      const percentage =
        target > 0
          ? clamp(
              (
                Number(value) /
                Number(target)
              ) * 100,
              0,
              100
            )
          : 0;


      bar.style.width =
        `${percentage}%`;

    }

  }


  /* =========================================
     WATER
     ========================================= */

  function changeWater(
    delta
  ) {

    const store =
      safeJson(

        localStorage.getItem(
          FUEL_KEY
        ),

        {}

      );


    const key =
      todayKey();


    const day =
      (
        store[key] &&
        typeof store[key] ===
          "object"
      )

        ? store[key]

        : {
            meals:{},
            water:0
          };


    day.water =
      Math.max(
        0,
        (
          Number(
            day.water
          ) || 0
        )
        +
        Number(
          delta || 0
        )
      );


    store[key] =
      day;


    localStorage.setItem(

      FUEL_KEY,

      JSON.stringify(
        store
      )

    );


    const targets =
      safeJson(

        localStorage.getItem(
          TARGET_KEY
        ),

        {}

      );


    const waterTarget =
      Math.max(
        0,
        Number(
          targets.water
        ) || 2300
      );


    updateFuelTile(

      "water",

      day.water,

      waterTarget,

      "ml"

    );


    window.dispatchEvent(

      new CustomEvent(
        "mana:fuel-updated"
      )

    );

  }


  /* =========================================
     RECOVERY
     ========================================= */

  function recoveryScore() {

    const store =
      safeJson(

        localStorage.getItem(
          DAILY_KEY
        ),

        {}

      );


    const day =
      store[
        todayKey()
      ] || {};


    if (
      Number.isFinite(
        Number(
          day.recoveryScore
        )
      )
    ) {

      return clamp(
        day.recoveryScore,
        0,
        10
      );

    }


    const raw =
      String(

        day.recoveryLevel ||
        day.recovery ||
        ""

      ).toLowerCase();


    if (
      raw === "good" ||
      raw === "true"
    ) {

      return 8;

    }


    if (
      raw === "moderate"
    ) {

      return 5;

    }


    if (
      raw === "needs-attention" ||
      raw === "low"
    ) {

      return 3;

    }


    return 0;

  }


  function changeRecovery(
    delta
  ) {

    const store =
      safeJson(

        localStorage.getItem(
          DAILY_KEY
        ),

        {}

      );


    const key =
      todayKey();


    const day =
      (
        store[key] &&
        typeof store[key] ===
          "object"
      )
        ? store[key]
        : {};


    const value =
      clamp(

        recoveryScore()
        +
        Number(
          delta || 0
        ),

        0,

        10

      );


    day.recoveryScore =
      value;


    if (
      value >= 7
    ) {

      day.recoveryLevel =
        "good";

      day.recovery =
        true;

    } else if (
      value >= 4
    ) {

      day.recoveryLevel =
        "moderate";

      day.recovery =
        false;

    } else if (
      value > 0
    ) {

      day.recoveryLevel =
        "needs-attention";

      day.recovery =
        false;

    } else {

      day.recoveryLevel =
        "";

      day.recovery =
        false;

    }


    store[key] =
      day;


    localStorage.setItem(

      DAILY_KEY,

      JSON.stringify(
        store
      )

    );


    updateFuelTile(

      "recovery",

      value,

      10

    );


    window.dispatchEvent(

      new CustomEvent(
        "mana:recovery-updated"
      )

    );

  }


  /* =========================================
     FUEL CLICK INTERCEPT
     ========================================= */

  function interceptFuel(
    event
  ) {

    if (
      !event.target.closest(
        "#manaV1015Fuel"
      )
    ) {

      return;

    }


    const water =
      event.target.closest(
        "[data-m1022-water]"
      );


    const recovery =
      event.target.closest(
        "[data-m1022-recovery]"
      );


    if (
      !water &&
      !recovery
    ) {

      return;

    }


    event.preventDefault();

    event.stopImmediatePropagation();


    if (water) {

      changeWater(

        Number(
          water.dataset
            .m1022Water
        ) || 0

      );


      return;

    }


    changeRecovery(

      Number(
        recovery.dataset
          .m1022Recovery
      ) || 0

    );

  }


  /* =========================================
     SECTION ICON
     ========================================= */

  function addSectionIcon(
    parent,
    type
  ) {

    if (
      !parent ||
      !ICONS[type]
    ) {

      return;

    }


    if (
      parent.querySelector(
        `.m1028-${type}-icon`
      )
    ) {

      return;

    }


    const title =
      parent.querySelector(
        "h2"
      );


    if (!title) {
      return;
    }


    const row =
      document.createElement(
        "div"
      );


    row.className =
      "m1028-section-title";


    const icon =
      document.createElement(
        "span"
      );


    icon.className =
      `m1028-section-icon m1028-${type}-icon`;


    icon.innerHTML =
      ICONS[type];


    title.parentNode
      .insertBefore(
        row,
        title
      );


    row.appendChild(
      icon
    );


    row.appendChild(
      title
    );

  }


  /* =========================================
     DECORATE
     ========================================= */

  function decorate() {

    addSectionIcon(

      document.querySelector(
        "#manaV993StrengthProgress .mana-v993-head"
      ),

      "progress"

    );


    addSectionIcon(

      document.querySelector(
        "#manaV83Content .mana-v981-root .mana-v981-head"
      ),

      "progress"

    );


    addSectionIcon(

      document.querySelector(
        "#manaV83Content .mana-v985-head"
      ),

      "learning"

    );

  }


  /* =========================================
     SETTLE
     ========================================= */

  function settle() {

    /*
      Reinstalling pushes this stylesheet
      to the end of <head>, so older screen
      CSS cannot take priority afterwards.
    */

    installStyles();

    decorate();


    [
      80,
      220,
      500
    ]
      .forEach(
        delay => {

          setTimeout(
            () => {

              installStyles();

              decorate();

            },
            delay
          );

        }
      );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    document.addEventListener(

      "click",

      interceptFuel,

      true

    );


    settle();


    [
      "mana:program-tab-change",
      "mana:program-change",
      "mana:workout-progress-change",
      "mana:recovery-updated"
    ]
      .forEach(
        eventName => {

          document.addEventListener(
            eventName,
            settle
          );


          window.addEventListener(
            eventName,
            settle
          );

        }
      );


    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            `
              #manaV83Tabs .mana-v83-tab,
              [data-v993-period],
              [data-v993-detail],
              [data-v981-period],
              [data-v939-range],
              [data-v985-learn],
              [data-v933-learn-open],
              [data-v933-support-chat],
              #manaV1017Request
            `
          )
        ) {

          requestAnimationFrame(
            settle
          );

        }

      }
    );


    window.addEventListener(
      "pageshow",
      settle
    );


    window
      .refreshManaFinalPolish =
        settle;


    window
      .MANA_FINAL_POLISH_BUILD =
        BUILD;


    console.log(
      "Mana Final Polish",
      BUILD
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
