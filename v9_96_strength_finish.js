/* =========================================
   MANA MOVEMENT TRAINING v9.96.0
   STRENGTH FINAL CONSISTENCY

   FUEL
   - ONE CANONICAL COACH CHAT CARD
   - RESTORES CHAT AFTER MEAL REDRAW
   - RESTORES RECOVERY AFTER MEAL REDRAW
   - REMOVES DUPLICATE FUEL CHAT CARDS

   PROFILE / FUEL TARGETS
   - SAVED FUEL TARGET STORE IS
     THE DISPLAY SOURCE OF TRUTH
   - HEADER PROFILE AND MAIN PROFILE
     SHOW THE SAME CALORIES + PROTEIN
   - LIVE EDITING CAN STILL PREVIEW
   - SAVE STILL RECALCULATES NORMALLY

   NO:
   - workout changes
   - timer changes
   - data resets
   - MutationObserver
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "99600";


  const TARGET_KEY =
    "mana-fuel-v58-targets";


  const CHAT_ID =
    "manaV996FuelChat";


  const STYLE_ID =
    "mana-v996-strength-finish-style";


  let restoreTimer =
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


  function loadTargets() {

    return safeJson(
      localStorage.getItem(
        TARGET_KEY
      ) || "{}",
      {}
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

        margin:
          10px 0 0;

        padding:
          16px;

        border:
          1px solid
          #55481c;

        border-radius:
          17px;

        background:
          linear-gradient(
            145deg,
            #15130b,
            #090909
          );

      }


      .mana-v996-chat-top{

        display:
          flex;

        justify-content:
          space-between;

        align-items:
          flex-start;

        gap:
          12px;

      }


      .mana-v996-chat-kicker{

        color:
          #f3d875;

        font-size:
          9px;

        font-weight:
          950;

        letter-spacing:
          .11em;

      }


      .mana-v996-chat-title{

        margin-top:
          5px;

        color:
          #fff;

        font-size:
          18px;

        font-weight:
          950;

      }


      .mana-v996-chat-live{

        padding:
          5px
          8px;

        border:
          1px solid
          #56491c;

        border-radius:
          999px;

        color:
          #f3d875;

        font-size:
          8px;

        font-weight:
          950;

      }


      .mana-v996-chat-copy{

        margin-top:
          8px;

        color:
          #8c8c8c;

        font-size:
          11px;

        line-height:
          1.5;

      }


      .mana-v996-chat-btn{

        width:
          100%;

        min-height:
          46px;

        margin-top:
          12px;

        border:
          1px solid
          #61521d;

        border-radius:
          13px;

        background:
          #121008;

        color:
          #f3d875;

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
     REMOVE ALL OLD FUEL CHAT CARDS

     This is scoped ONLY to Strength Fuel.
     ========================================= */

  function removeOldFuelChats() {

    const root =
      document.querySelector(
        "#manaV83Content .mana-v897-root"
      );


    if (!root) {

      return;

    }


    /*
      Known old temporary card.
    */

    document
      .getElementById(
        "manaV995FuelChat"
      )
      ?.remove();


    /*
      Remove any old Fuel-specific
      Coach Chat presentation.

      Do NOT touch the real modal itself.
    */

    [
      ...root.children
    ]
      .forEach(
        child => {

          if (
            child.id ===
            CHAT_ID
          ) {

            return;

          }


          const text =
            (
              child.textContent ||
              ""
            )
              .replace(
                /\s+/g,
                " "
              )
              .trim()
              .toUpperCase();


          const looksLikeFuelChat =
            text.includes(
              "COACH CHAT"
            )
            &&
            (
              text.includes(
                "CALORIES"
              )
              ||
              text.includes(
                "PROTEIN"
              )
              ||
              text.includes(
                "FUEL"
              )
              ||
              text.includes(
                "MESSAGE YOUR COACH"
              )
            );


          if (
            looksLikeFuelChat
          ) {

            child.remove();

          }

        }
      );

  }


  /* =========================================
     CANONICAL FUEL CHAT
     ========================================= */

  function ensureFuelChat() {

    if (
      !strengthFuelOpen()
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


    removeOldFuelChats();


    if (
      document.getElementById(
        CHAT_ID
      )
    ) {

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
        class="mana-v996-chat-top"
      >

        <div>

          <div
            class="mana-v996-chat-kicker"
          >
            COACH SUPPORT
          </div>

          <div
            class="mana-v996-chat-title"
          >
            Coach Chat
          </div>

        </div>


        <div
          class="mana-v996-chat-live"
        >
          LIVE
        </div>

      </div>


      <div
        class="mana-v996-chat-copy"
      >
        Ask about calories, protein,
        meals, water or your daily
        Fuel targets.
      </div>


      <button
        type="button"
        class="mana-v996-chat-btn"
        id="manaV996ChatOpen"
      >
        MESSAGE YOUR COACH →
      </button>

    `;


    /*
      Place underneath Recovery.
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

      const water =
        document.getElementById(
          "manaV991WaterCard"
        );


      if (water) {

        water
          .insertAdjacentElement(
            "afterend",
            card
          );

      } else {

        root.appendChild(
          card
        );

      }

    }


    card
      .querySelector(
        "#manaV996ChatOpen"
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
     RECOVERY
     ========================================= */

  function ensureRecovery() {

    if (
      !strengthFuelOpen()
    ) {

      return;

    }


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
     FUEL POLISH
     ========================================= */

  function ensureFuelPolish() {

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
     RESTORE ENTIRE FUEL SCREEN
     ========================================= */

  function restoreFuelScreen() {

    if (
      !strengthFuelOpen()
    ) {

      return;

    }


    ensureRecovery();


    setTimeout(
      () => {

        ensureFuelPolish();

        ensureRecovery();

        ensureFuelChat();

      },
      35
    );


    setTimeout(
      () => {

        ensureFuelPolish();

        ensureRecovery();

        ensureFuelChat();

      },
      150
    );

  }


  function scheduleRestore(
    delay = 50
  ) {

    clearTimeout(
      restoreTimer
    );


    restoreTimer =
      setTimeout(
        restoreFuelScreen,
        delay
      );

  }


  /* =========================================
     PROFILE TARGET CONSISTENCY

     The persisted target store is the
     saved source of truth.

     This stops the old v6.7 calculation
     flashing different numbers when the
     Profile is first opened.
     ========================================= */

  function syncProfileTargetDisplay() {

    const targets =
      loadTargets();


    const calories =
      Number(
        targets.calories || 0
      );


    const protein =
      Number(
        targets.protein || 0
      );


    if (
      !calories &&
      !protein
    ) {

      return;

    }


    const calorieEl =
      document.getElementById(
        "manaProfileFuelCalories"
      );


    const proteinEl =
      document.getElementById(
        "manaProfileFuelProtein"
      );


    if (
      calorieEl &&
      calories
    ) {

      calorieEl.textContent =
        `${calories.toLocaleString()} cal`;

    }


    if (
      proteinEl &&
      protein
    ) {

      proteinEl.textContent =
        `${protein}g`;

    }

  }


  function profileIsOpen() {

    return Boolean(
      document
        .getElementById(
          "manaProfileScreen"
        )
        ?.classList
        .contains(
          "open"
        )
    );

  }


  function syncProfileAfterOpen() {

    /*
      v6.7 populates the Profile and runs
      its older preview calculation.

      Re-apply the real saved targets after
      that initial population has finished.
    */

    setTimeout(
      syncProfileTargetDisplay,
      20
    );


    setTimeout(
      syncProfileTargetDisplay,
      90
    );

  }


  /* =========================================
     EVENTS
     ========================================= */

  function wireEvents() {

    document.addEventListener(
      "click",
      event => {

        /*
          MEAL ADD / CHANGE
        */

        const mealChoice =
          event.target.closest(
            "[data-v932-meal]"
          );


        const customMeal =
          event.target.closest(
            "#manaV941CustomSave"
          );


        const removeMeal =
          event.target.closest(
            "[data-mana-remove-meal]"
          );


        if (
          mealChoice ||
          customMeal ||
          removeMeal
        ) {

          setTimeout(
            restoreFuelScreen,
            45
          );


          setTimeout(
            restoreFuelScreen,
            180
          );


          return;

        }


        /*
          FUEL TAB
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


        /*
          ANY PROFILE OPEN BUTTON.

          Includes header Profile and
          existing Home/Profile buttons.
        */

        if (
          event.target.closest(
            "#manaV989ProfileButton, " +
            "#manaV80ProfileBtn, " +
            "#manaV80ProfileSetup"
          )
        ) {

          syncProfileAfterOpen();

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


    window.addEventListener(
      "mana:profile-synced",
      () => {

        syncProfileTargetDisplay();


        if (
          strengthFuelOpen()
        ) {

          scheduleRestore(
            80
          );

        }

      }
    );


    /*
      If something else opens Profile
      programmatically, a Profile sync
      still happens after opening.
    */

    window.addEventListener(
      "focus",
      () => {

        if (
          profileIsOpen()
        ) {

          syncProfileTargetDisplay();

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


    /*
      Remove any old duplicate chat that
      survived the previous app session.
    */

    removeOldFuelChats();


    if (
      strengthFuelOpen()
    ) {

      scheduleRestore(
        180
      );

    }


    if (
      profileIsOpen()
    ) {

      syncProfileTargetDisplay();

    }


    window.MANA_STRENGTH_FINISH_BUILD =
      BUILD;


    window.refreshManaStrengthFinish =
      scheduleRestore;


    console.log(
      "[Mana v9.96.0] " +
      "Strength Fuel + Profile consistency ready"
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
