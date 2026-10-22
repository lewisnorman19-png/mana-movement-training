/* =========================================
   MANA MOVEMENT TRAINING v10.28
   FINAL COLOUR + INTERACTION POLISH

   BUILD: 102800

   UPGRADES
   -----------------------------------------
   1. "Ready for your next block?"
      becomes Coach Chat green.

   2. Mana Lyfe Support Chat
      becomes the same premium green.

   3. Fuel manual Water / Recovery
      updates in place.
      NO full-screen re-render / flicker.

   4. Progress
      purple outline system everywhere.

   5. Learning
      orange outline system everywhere.

   6. Progress + Learning
      receive matching lightweight icons.

   DOES NOT
   -----------------------------------------
   - change phone layouts
   - change workout logic
   - change saved data format
   - use MutationObserver
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "102800";


  const STYLE_ID =
    "mana-v1028-final-polish";


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
         READY FOR YOUR NEXT BLOCK
         COACH CHAT GREEN
         ===================================== */

      #manaV1017ClientBlock
      .m1017-request{

        border:
          1px solid
          rgba(
            85,
            217,
            139,
            .68
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

        box-shadow:
          0
          12px
          28px
          rgba(
            0,
            0,
            0,
            .22
          ) !important;

      }


      #manaV1017ClientBlock
      .m1017-request-title{

        color:
          #ffffff !important;

      }


      #manaV1017ClientBlock
      .m1017-request-text{

        color:
          #aaa !important;

      }


      #manaV1017ClientBlock
      .m1017-request-btn{

        border:
          1px solid
          ${GREEN} !important;

        background:
          rgba(
            85,
            217,
            139,
            .055
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
            .06
          ) !important;

      }


      #manaV1017ClientBlock
      .m1017-request-btn:not(:disabled):active{

        transform:
          scale(.99) !important;

      }


      #manaV1017ClientBlock
      .m1017-status{

        border-color:
          rgba(
            85,
            217,
            139,
            .40
          ) !important;

        background:
          rgba(
            85,
            217,
            139,
            .035
          ) !important;

        color:
          #a9dcbc !important;

      }


      #manaV1017ClientBlock
      .m1017-ready{

        border-color:
          ${GREEN} !important;

        color:
          ${GREEN} !important;

      }


      /* =====================================
         MANA LYFE SUPPORT CHAT CARD
         GREEN
         ===================================== */

      #manaV933Life
      .mana-v933-support{

        border:
          1px solid
          rgba(
            85,
            217,
            139,
            .68
          ) !important;

        background:

          radial-gradient(
            circle at top right,
            rgba(
              85,
              217,
              139,
              .09
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
          28px
          rgba(
            0,
            0,
            0,
            .22
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

        border-color:
          ${GREEN} !important;

        background:
          rgba(
            85,
            217,
            139,
            .055
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
            .055
          ) !important;

        color:
          #dff9e8 !important;

      }


      /* =====================================
         MANA LYFE CHAT MODAL
         GREEN
         ===================================== */

      #manaV95ChatModal.mana-v935-life-mode
      .mana-v950-shell{

        border-color:
          rgba(
            85,
            217,
            139,
            .48
          ) !important;

      }


      #manaV95ChatModal.mana-v935-life-mode
      .mana-v950-head{

        border-bottom-color:
          rgba(
            85,
            217,
            139,
            .20
          ) !important;

      }


      #manaV95ChatModal.mana-v935-life-mode
      .mana-v950-kicker{

        color:
          ${GREEN} !important;

      }


      #manaV95ChatModal.mana-v935-life-mode
      .mana-v935-intro-inner{

        border-color:
          rgba(
            85,
            217,
            139,
            .40
          ) !important;

        background:
          rgba(
            85,
            217,
            139,
            .035
          ) !important;

      }


      #manaV95ChatModal.mana-v935-life-mode
      .mana-v935-quick-btn{

        border-color:
          rgba(
            85,
            217,
            139,
            .48
          ) !important;

        background:
          rgba(
            85,
            217,
            139,
            .035
          ) !important;

        color:
          #bdeace !important;

      }


      #manaV95ChatModal.mana-v935-life-mode
      .mana-v950-input{

        border-color:
          rgba(
            85,
            217,
            139,
            .42
          ) !important;

      }


      #manaV95ChatModal.mana-v935-life-mode
      .mana-v950-send{

        border-color:
          ${GREEN} !important;

        background:
          rgba(
            85,
            217,
            139,
            .08
          ) !important;

        color:
          #dff9e8 !important;

      }


      /* =====================================
         PROGRESS
         PURPLE EVERYWHERE
         ===================================== */

      /* Strength */

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
      .mana-v993-row{

        border-color:
          rgba(
            166,
            129,
            220,
            .52
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
            .075
          ) !important;

        color:
          ${PURPLE} !important;

        box-shadow:
          0
          0
          15px
          rgba(
            166,
            129,
            220,
            .08
          ) !important;

      }


      #manaV993StrengthProgress
      .mana-v993-fill{

        background:
          ${PURPLE} !important;

      }


      #manaV993StrengthProgress
      .mana-v993-panel-kicker{

        color:
          ${PURPLE} !important;

      }


      /* Mana 28 */

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
            .52
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

        border-color:
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


      /* Mana Lyfe */

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
            .52
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
            .075
          ) !important;

        color:
          ${PURPLE} !important;

      }


      #manaV939Progress2
      .mana-v939-kicker{

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
         ORANGE EVERYWHERE
         ===================================== */

      /* Shared Mana28 Learn */

      #manaV83Content
      .mana-v985-head{

        border-bottom-color:
          rgba(
            233,
            138,
            84,
            .38
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

        border-color:
          rgba(
            233,
            138,
            84,
            .58
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


      /* Mana Lyfe Learn */

      #manaV933Life
      .mana-v933-learn-item,

      #manaV933Life
      .mana-v933-card
      .mana-v933-learn-item{

        border-color:
          rgba(
            233,
            138,
            84,
            .58
          ) !important;

      }


      #manaV933Life
      .mana-v933-learn-button{

        background:
          rgba(
            233,
            138,
            84,
            .02
          ) !important;

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
          #0a0a0a !important;

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

        box-shadow:
          0
          0
          14px
          rgba(
            166,
            129,
            220,
            .08
          ) !important;

      }


      .m1028-learning-icon{

        color:
          ${ORANGE} !important;

        box-shadow:
          0
          0
          14px
          rgba(
            233,
            138,
            84,
            .08
          ) !important;

      }


      /* Mini card icons */

      .m1028-mini-icon{

        flex:
          0 0
          30px !important;

        width:
          30px !important;

        height:
          30px !important;

        display:
          grid !important;

        place-items:
          center !important;

        border:
          1px solid
          currentColor !important;

        border-radius:
          9px !important;

        background:
          #090909 !important;

      }


      .m1028-mini-icon svg{

        width:
          18px !important;

        height:
          18px !important;

      }


      .m1028-progress-mini{

        color:
          ${PURPLE} !important;

      }


      .m1028-learning-mini{

        color:
          ${ORANGE} !important;

      }


      /* =====================================
         FUEL MANUAL CONTROL FEEDBACK
         NO PAGE FLASH
         ===================================== */

      #manaV1015Fuel
      .m1022-target.water,

      #manaV1015Fuel
      .m1022-target.recovery{

        transition:
          border-color .15s ease,
          box-shadow .15s ease !important;

      }


      #manaV1015Fuel
      .m1022-target.m1028-updated{

        box-shadow:
          0
          0
          0
          1px
          rgba(
            255,
            255,
            255,
            .025
          ) inset !important;

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     SAFE JSON
     ========================================= */

  function safeJson(
    value,
    fallback = {}
  ) {

    try {

      const parsed =
        JSON.parse(
          value || ""
        );


      return (
        parsed &&
        typeof parsed ===
          "object"
      )
        ? parsed
        : fallback;

    } catch {

      return fallback;

    }

  }


  /* =========================================
     TODAY KEY
     ========================================= */

  function todayKey() {

    const d =
      new Date();


    return [

      d.getFullYear(),

      String(
        d.getMonth() + 1
      )
        .padStart(
          2,
          "0"
        ),

      String(
        d.getDate()
      )
        .padStart(
          2,
          "0"
        )

    ].join(
      "-"
    );

  }


  /* =========================================
     CLAMP
     ========================================= */

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
     UPDATE FUEL TILE ONLY
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

          ? Math.max(
              0,
              Math.min(
                100,
                (
                  Number(value) /
                  Number(target)
                ) * 100
              )
            )

          : 0;


      bar.style.width =
        `${percentage}%`;

    }


    tile.classList.add(
      "m1028-updated"
    );


    setTimeout(
      () => {

        tile.classList.remove(
          "m1028-updated"
        );

      },
      160
    );

  }


  /* =========================================
     WATER — IN PLACE
     ========================================= */

  function changeWaterWithoutRender(
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

      store[key] &&
      typeof store[key] ===
        "object"

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


    const targetWater =
      Math.max(
        0,
        Number(
          targets.water
        ) || 2300
      );


    updateFuelTile(

      "water",

      day.water,

      targetWater,

      "ml"

    );


    window.dispatchEvent(

      new CustomEvent(
        "mana:fuel-updated"
      )

    );

  }


  /* =========================================
     CURRENT RECOVERY SCORE
     ========================================= */

  function currentRecovery() {

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
      )
        .toLowerCase();


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


  /* =========================================
     RECOVERY — IN PLACE
     ========================================= */

  function changeRecoveryWithoutRender(
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

      store[key] &&
      typeof store[key] ===
        "object"

        ? store[key]

        : {};


    const score =
      clamp(
        currentRecovery()
        +
        Number(
          delta || 0
        ),
        0,
        10
      );


    day.recoveryScore =
      score;


    if (
      score >= 7
    ) {

      day.recoveryLevel =
        "good";

      day.recovery =
        true;

    } else if (
      score >= 4
    ) {

      day.recoveryLevel =
        "moderate";

      day.recovery =
        false;

    } else if (
      score > 0
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

      score,

      10,

      ""

    );


    window.dispatchEvent(

      new CustomEvent(
        "mana:recovery-updated"
      )

    );

  }


  /* =========================================
     STOP FUEL FULL RENDER

     Capture runs before v10.22's
     document bubble handler.
     ========================================= */

  function interceptFuelControls(
    event
  ) {

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


    /*
      Only intercept the current Fuel UI.
    */

    if (
      !event.target.closest(
        "#manaV1015Fuel"
      )
    ) {

      return;

    }


    event.preventDefault();

    event.stopImmediatePropagation();


    if (water) {

      changeWaterWithoutRender(

        Number(
          water.dataset
            .m1022Water
        ) || 0

      );


      return;

    }


    changeRecoveryWithoutRender(

      Number(
        recovery.dataset
          .m1022Recovery
      ) || 0

    );

  }


  /* =========================================
     ADD SECTION ICON
     ========================================= */

  function sectionIcon(
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
     MINI ICON
     ========================================= */

  function prependMiniIcon(
    target,
    type
  ) {

    if (
      !target ||
      !ICONS[type]
    ) {

      return;

    }


    if (
      target.querySelector(
        `.m1028-${type}-mini`
      )
    ) {

      return;

    }


    const icon =
      document.createElement(
        "span"
      );


    icon.className =
      `m1028-mini-icon m1028-${type}-mini`;


    icon.innerHTML =
      ICONS[type];


    target.prepend(
      icon
    );

  }


  /* =========================================
     DECORATE PROGRESS
     ========================================= */

  function decorateProgress() {

    sectionIcon(

      document.querySelector(
        "#manaV993StrengthProgress .mana-v993-head"
      ),

      "progress"

    );


    sectionIcon(

      document.querySelector(
        "#manaV83Content .mana-v981-root .mana-v981-head"
      ),

      "progress"

    );


    /*
      Strength metric cards
    */

    document
      .querySelectorAll(
        "#manaV993StrengthProgress .mana-v993-metric"
      )
      .forEach(
        card => {

          prependMiniIcon(
            card,
            "progress"
          );

        }
      );


    /*
      Mana 28 progress cards already have
      their own icon box. Keep those and
      recolour them purple via CSS.
    */


    /*
      Mana Lyfe cards
    */

    document
      .querySelectorAll(
        "#manaV939Progress2 .mana-v939-card"
      )
      .forEach(
        card => {

          const kicker =
            card.querySelector(
              ".mana-v939-kicker"
            );


          if (kicker) {

            prependMiniIcon(
              kicker,
              "progress"
            );

          }

        }
      );

  }


  /* =========================================
     DECORATE LEARNING
     ========================================= */

  function decorateLearning() {

    sectionIcon(

      document.querySelector(
        "#manaV83Content .mana-v985-head"
      ),

      "learning"

    );


    document
      .querySelectorAll(
        "#manaV83Content .mana-v985-learn-button"
      )
      .forEach(
        button => {

          const strong =
            button.querySelector(
              "strong"
            );


          if (strong) {

            prependMiniIcon(
              strong,
              "learning"
            );

          }

        }
      );


    document
      .querySelectorAll(
        "#manaV933Life .mana-v933-learn-button"
      )
      .forEach(
        button => {

          const strong =
            button.querySelector(
              "strong"
            );


          if (strong) {

            prependMiniIcon(
              strong,
              "learning"
            );

          }

        }
      );

  }


  /* =========================================
     REFRESH
     ========================================= */

  function refresh() {

    decorateProgress();

    decorateLearning();

  }


  function settle() {

    refresh();


    [
      60,
      180,
      420,
      850
    ]
      .forEach(
        delay => {

          setTimeout(
            refresh,
            delay
          );

        }
      );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();


    /*
      IMPORTANT:
      capture=true prevents v10.22 from
      doing its full Fuel render for these
      two manual controls.
    */

    document.addEventListener(

      "click",

      interceptFuelControls,

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

          window.addEventListener(
            eventName,
            settle
          );


          document.addEventListener(
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
              [data-v933-learn-open]
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
      "Mana Final Colour + Interaction Polish",
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
