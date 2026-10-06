/* =========================================
   MANA MOVEMENT TRAINING v9.95.0
   STRENGTH FUEL — POST MEAL RESTORE

   FIX
   - Meal add/change/remove rebuilds Fuel
   - Recovery now restores immediately
   - Coach Chat now restores immediately
   - Water polish re-applies immediately

   NO:
   - Fuel data reset
   - Profile changes
   - Workout changes
   - Timers
   - MutationObserver
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "99500";


  const STYLE_ID =
    "mana-v995-strength-fuel-restore-style";


  const CHAT_ID =
    "manaV995FuelChat";


  let restoreTimer =
    null;


  /* =========================================
     STATE
     ========================================= */

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
          "#manaV83Tabs .mana-v83-tab.active"
        )
        ?.dataset
        ?.v83Tab
      ||
      ""
    );

  }


  function strengthFuelOpen() {

    return Boolean(

      document
        .getElementById(
          "manaV83ProgramShell"
        )
        ?.classList
        .contains(
          "open"
        )

      &&

      programTitle() ===
        "MANA STRENGTH"

      &&

      activeTab() ===
        "fuel"

    );

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

      #${CHAT_ID}{

        margin-top:
          10px;

        padding:
          16px;

        border:
          1px solid
          #4f431c;

        border-radius:
          17px;

        background:
          linear-gradient(
            145deg,
            #15130b,
            #090909
          );

      }


      .mana-v995-chat-head{

        display:
          flex;

        align-items:
          flex-start;

        justify-content:
          space-between;

        gap:
          12px;

      }


      .mana-v995-chat-kicker{

        color:
          #f3d875;

        font-size:
          10px;

        font-weight:
          950;

        letter-spacing:
          .10em;

      }


      .mana-v995-chat-title{

        margin-top:
          4px;

        color:
          #fff;

        font-size:
          17px;

        font-weight:
          950;

      }


      .mana-v995-chat-live{

        padding:
          5px 8px;

        border:
          1px solid
          #4d421c;

        border-radius:
          999px;

        color:
          #f3d875;

        font-size:
          8px;

        font-weight:
          950;

        letter-spacing:
          .07em;

      }


      .mana-v995-chat-copy{

        margin-top:
          8px;

        color:
          #858585;

        font-size:
          11px;

        line-height:
          1.5;

      }


      .mana-v995-chat-btn{

        width:
          100%;

        min-height:
          45px;

        margin-top:
          12px;

        border:
          0;

        border-radius:
          12px;

        background:
          #f3d875;

        color:
          #111;

        font-size:
          11px;

        font-weight:
          950;

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     RECOVERY
     ========================================= */

  function restoreRecovery() {

    if (
      !strengthFuelOpen()
    ) {

      return;

    }


    /*
      v9.89 already owns the Recovery card,
      its buttons and stored data.

      Ask it to rebuild only if Fuel's
      renderer has removed the card.
    */

    if (
      !document.getElementById(
        "manaV989Recovery"
      )
    ) {

      if (
        typeof
          window
            .ManaProfileRecovery
            ?.refresh ===
        "function"
      ) {

        window
          .ManaProfileRecovery
          .refresh();

      }

    }

  }


  /* =========================================
     COACH CHAT
     ========================================= */

  function ensureFuelChat() {

    if (
      !strengthFuelOpen()
    ) {

      return;

    }


    if (
      document.getElementById(
        CHAT_ID
      )
    ) {

      return;

    }


    const root =
      document.querySelector(
        "#manaV83Content .mana-v897-root"
      );


    if (!root) {

      return;

    }


    const card =
      document.createElement(
        "div"
      );


    card.id =
      CHAT_ID;


    card.innerHTML = `

      <div
        class="mana-v995-chat-head"
      >

        <div>

          <div
            class="mana-v995-chat-kicker"
          >
            COACH SUPPORT
          </div>

          <div
            class="mana-v995-chat-title"
          >
            Coach Chat
          </div>

        </div>


        <div
          class="mana-v995-chat-live"
        >
          LIVE
        </div>

      </div>


      <div
        class="mana-v995-chat-copy"
      >
        Questions about meals, calories,
        protein or your training plan?
        Message your coach directly.
      </div>


      <button
        type="button"
        class="mana-v995-chat-btn"
        id="manaV995FuelChatOpen"
      >
        OPEN COACH CHAT →
      </button>

    `;


    /*
      Put Chat after Recovery when possible.

      If Recovery has not been rebuilt yet,
      append it cleanly to the Fuel root.
    */

    const recovery =
      document.getElementById(
        "manaV989Recovery"
      );


    if (recovery) {

      recovery
        .insertAdjacentElement(
          "afterend",
          card
        );

    } else {

      root.appendChild(
        card
      );

    }


    card
      .querySelector(
        "#manaV995FuelChatOpen"
      )
      ?.addEventListener(
        "click",
        event => {

          event.preventDefault();

          event.stopPropagation();


          if (
            typeof
              window
                .openManaStrengthClientChat ===
            "function"
          ) {

            window
              .openManaStrengthClientChat();

          }

        }
      );

  }


  /* =========================================
     WATER / EXISTING FUEL POLISH
     ========================================= */

  function restoreFuelPolish() {

    if (
      !strengthFuelOpen()
    ) {

      return;

    }


    if (
      typeof
        window
          .refreshManaStrengthFuelPolish ===
      "function"
    ) {

      window
        .refreshManaStrengthFuelPolish(
          20
        );

    }

  }


  /* =========================================
     COMPLETE RESTORE
     ========================================= */

  function restoreFuelExtras() {

    if (
      !strengthFuelOpen()
    ) {

      return;

    }


    restoreRecovery();


    /*
      Recovery creates synchronously once
      v9.89 refresh runs.
    */

    setTimeout(
      () => {

        restoreFuelPolish();

        ensureFuelChat();

      },
      35
    );


    /*
      One final bounded pass catches the
      shared Fuel renderer finishing after
      a meal action.

      This is NOT polling.
    */

    setTimeout(
      () => {

        restoreRecovery();

        restoreFuelPolish();

        ensureFuelChat();

      },
      140
    );

  }


  function scheduleRestore(
    delay = 40
  ) {

    clearTimeout(
      restoreTimer
    );


    restoreTimer =
      setTimeout(
        restoreFuelExtras,
        delay
      );

  }


  /* =========================================
     FUEL UPDATED EVENT
     ========================================= */

  function announceFuelUpdated() {

    window.dispatchEvent(
      new CustomEvent(
        "mana:fuel-updated",
        {
          detail:{
            source:
              "meal-change"
          }
        }
      )
    );

  }


  /* =========================================
     EVENTS
     ========================================= */

  function wireEvents() {

    /*
      Meal modal lives outside
      #manaV83ProgramShell, which is why
      v9.89's old click repair does not
      see meal selections.

      Capture those interactions globally.
    */

    document.addEventListener(
      "click",
      event => {

        const mealSelected =
          event.target.closest(
            "[data-v932-meal]"
          );


        const mealRemoved =
          event.target.closest(
            "[data-mana-remove-meal]"
          );


        const customMeal =
          event.target.closest(
            "#manaV941CustomSave"
          );


        if (
          mealSelected ||
          mealRemoved ||
          customMeal
        ) {

          /*
            Let the existing Fuel code save
            and redraw first.
          */

          setTimeout(
            () => {

              announceFuelUpdated();

              restoreFuelExtras();

            },
            35
          );


          return;

        }


        /*
          Entering Fuel.
        */

        if (
          event.target.closest(
            '#manaV83Tabs [data-v83-tab="fuel"]'
          )
        ) {

          scheduleRestore(
            100
          );

        }

      },
      true
    );


    window.addEventListener(
      "mana:program-tab-change",
      () => {

        if (
          strengthFuelOpen()
        ) {

          scheduleRestore(
            90
          );

        }

      }
    );


    window.addEventListener(
      "mana:fuel-updated",
      () => {

        if (
          strengthFuelOpen()
        ) {

          scheduleRestore(
            60
          );

        }

      }
    );


    window.addEventListener(
      "mana:recovery-updated",
      () => {

        if (
          strengthFuelOpen()
        ) {

          scheduleRestore(
            50
          );

        }

      }
    );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    wireEvents();


    if (
      strengthFuelOpen()
    ) {

      scheduleRestore(
        180
      );

    }


    window.MANA_STRENGTH_FUEL_RESTORE_BUILD =
      BUILD;


    window.refreshManaStrengthFuelExtras =
      scheduleRestore;


    console.log(
      "[Mana v9.95.0] " +
      "Strength Fuel extras restore ready"
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
