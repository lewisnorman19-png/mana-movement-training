/* =========================================
   MANA MOVEMENT TRAINING v9.64.2
   STRENGTH LAUNCHPAD POLISH

   HOME
   - STEP 1 PROFILE IS SUBTLE GOLD
   - NOT SOLID YELLOW
   - STEP 2 PROGRAM SELECTION

   MEMBERSHIP
   - STEP 3 CHOOSE PLAN

   OVERVIEW
   - CLEAN PREMIUM LAUNCHPAD
   - LARGER / CLEARER TEXT

   PROGRAM
   - NUMBERED WORKOUTS
   - OPEN BEFORE START
   - START BUTTON INSIDE WORKOUT

   POST WORKOUT
   - PROGRAM RETURN
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "96420";

  const STYLE_ID =
    "mana-v964-strength-launchpad-style";

  const PROFILE_KEY =
    "mana-profile-v67";

  const PROGRAM_KEY =
    "mana-strength-v62-program";


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


  function loadProfile() {

    return safeJson(
      localStorage.getItem(
        PROFILE_KEY
      ) || "{}",
      {}
    );
  }


  function loadProgram() {

    return safeJson(
      localStorage.getItem(
        PROGRAM_KEY
      ) || "null",
      null
    );
  }


  function esc(
    value
  ) {

    return String(
      value ?? ""
    )
      .replaceAll(
        "&",
        "&amp;"
      )
      .replaceAll(
        "<",
        "&lt;"
      )
      .replaceAll(
        ">",
        "&gt;"
      )
      .replaceAll(
        '"',
        "&quot;"
      );
  }


  function strengthShellOpen() {

    const shell =
      document.getElementById(
        "manaV83ProgramShell"
      );

    const title =
      document.getElementById(
        "manaV83Title"
      );


    return Boolean(

      shell
        ?.classList
        .contains(
          "open"
        ) &&

      title
        ?.textContent
        ?.trim()
        ?.toUpperCase() ===
        "MANA STRENGTH"

    );
  }


  function activeStrengthTab() {

    if (
      !strengthShellOpen()
    ) {

      return null;
    }


    return (
      document.querySelector(
        "#manaV83Tabs " +
        ".mana-v83-tab.active"
      )
      ?.dataset
      ?.v83Tab ||
      null
    );
  }


  function openStrengthTab(
    tabName
  ) {

    document
      .querySelector(
        '#manaV83Tabs ' +
        `[data-v83-tab="${tabName}"]`
      )
      ?.click();
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
         BOTTOM PROFILE NAV
         NORMAL / DARK
         ===================================== */

      #manaV80Home
      #manaV80ProfileBtn{

        background:
          #0d0d0d !important;

        border-color:
          transparent !important;

        color:
          #888 !important;

        box-shadow:
          none !important;
      }


      /* =====================================
         STEP 1 — SUBTLE PROFILE CARD
         ===================================== */

      #manaV80Home
      #manaV80ProfileSetup{

        position:relative;

        overflow:hidden;

        border:
          1px solid
          #786421 !important;

        background:
          linear-gradient(
            145deg,
            #211d10,
            #10100c 58%,
            #090909
          ) !important;

        color:
          #fff !important;

        box-shadow:
          0
          10px
          28px
          rgba(
            0,
            0,
            0,
            .22
          ) !important;
      }


      #manaV80Home
      #manaV80ProfileSetup::before{

        content:"";

        position:absolute;

        top:0;
        left:22px;
        right:22px;

        height:3px;

        background:
          linear-gradient(
            90deg,
            transparent,
            #f3d875,
            transparent
          );
      }


      #manaV80Home
      #manaV80ProfileSetup::after{

        content:"01";

        position:absolute;

        right:18px;
        bottom:-12px;

        color:
          rgba(
            243,
            216,
            117,
            .055
          );

        font-size:92px;

        font-weight:950;

        line-height:1;
      }


      #manaV80Home
      #manaV80ProfileSetup
      .mana-v8013-profile-label{

        color:
          #f3d875 !important;
      }


      #manaV80Home
      #manaV80ProfileSetup h2{

        position:relative;

        z-index:2;

        color:
          #fff !important;
      }


      #manaV80Home
      #manaV80ProfileSetup p{

        position:relative;

        z-index:2;

        max-width:82%;

        color:
          #aaa !important;
      }


      #manaV80Home
      #manaV80ProfileSetup
      .mana-v8013-profile-open{

        position:relative;

        z-index:2;

        color:
          #f3d875 !important;
      }


      /* =====================================
         STEP 2
         ===================================== */

      #manaV80Home
      .mana-v8013-select{

        border:
          1px solid
          #50451f !important;

        background:
          linear-gradient(
            145deg,
            #15130c,
            #090909
          ) !important;
      }


      #manaV80Home
      .mana-v8013-select strong{

        color:
          #f3d875 !important;

        font-size:
          18px !important;
      }


      #manaV80Home
      .mana-v8013-select span{

        color:
          #aaa !important;

        font-size:
          14px !important;
      }


      /* =====================================
         STRENGTH OVERVIEW
         ===================================== */

      .mana-v964-launchpad{

        width:100%;

        max-width:
          800px;

        margin:
          0 auto;

        padding:
          5px
          0
          34px;
      }


      .mana-v964-intro{

        margin-bottom:
          22px;
      }


      .mana-v964-kicker{

        color:
          #f3d875;

        font-size:
          12px;

        font-weight:
          950;

        letter-spacing:
          .14em;

        text-transform:
          uppercase;
      }


      .mana-v964-intro h2{

        margin:
          8px
          0
          9px;

        color:#fff;

        font-size:
          34px;

        line-height:
          1.05;
      }


      .mana-v964-intro p{

        max-width:
          620px;

        margin:0;

        color:
          #aaa;

        font-size:
          16px;

        line-height:
          1.55;
      }


      .mana-v964-grid{

        display:grid;

        grid-template-columns:
          repeat(
            2,
            minmax(
              0,
              1fr
            )
          );

        gap:
          15px;
      }


      .mana-v964-launch{

        position:relative;

        width:100%;

        min-height:
          188px;

        overflow:hidden;

        display:flex;

        align-items:
          flex-start;

        gap:
          17px;

        padding:
          22px;

        text-align:left;

        border:
          1px solid
          #383426;

        border-radius:
          22px;

        background:
          linear-gradient(
            145deg,
            #161510,
            #090909
          );

        color:#fff;

        cursor:pointer;
      }


      .mana-v964-launch::before{

        content:"";

        position:absolute;

        top:0;
        left:20px;
        right:20px;

        height:2px;

        background:
          linear-gradient(
            90deg,
            transparent,
            #d9ba55,
            transparent
          );

        opacity:.8;
      }


      .mana-v964-icon{

        flex:
          0 0
          60px;

        width:
          60px;

        height:
          60px;

        display:grid;

        place-items:center;

        border-radius:
          17px;

        background:
          linear-gradient(
            145deg,
            #f5dc80,
            #cda331
          );

        color:#111;

        font-size:
          20px;

        font-weight:
          950;
      }


      .mana-v964-copy{

        min-width:0;

        flex:1;
      }


      .mana-v964-label{

        color:
          #c2a84e;

        font-size:
          11px;

        font-weight:
          950;

        letter-spacing:
          .12em;

        text-transform:
          uppercase;
      }


      .mana-v964-title{

        margin-top:
          7px;

        color:#fff;

        font-size:
          24px;

        font-weight:
          950;

        line-height:
          1.12;
      }


      .mana-v964-text{

        margin-top:
          10px;

        color:
          #b2b2b2;

        font-size:
          15px;

        line-height:
          1.5;
      }


      .mana-v964-arrow{

        margin-top:
          15px;

        color:
          #f3d875;

        font-size:
          13px;

        font-weight:
          950;

        letter-spacing:
          .03em;
      }


      /* =====================================
         PROGRAM CARDS
         ===================================== */

      #manaV83Content
      .mana-v85-day{

        cursor:pointer;
      }


      #manaV83Content
      .mana-v85-day:not(
        .mana-v964-expanded
      )
      .mana-v85-exercises,

      #manaV83Content
      .mana-v85-day:not(
        .mana-v964-expanded
      )
      .mana-v85-start{

        display:none !important;
      }


      #manaV83Content
      .mana-v85-day.mana-v964-expanded{

        border-color:
          #716020 !important;

        background:
          linear-gradient(
            145deg,
            #17150c,
            #090909
          ) !important;
      }


      #manaV83Content
      .mana-v85-day-label{

        color:
          #f3d875 !important;

        font-size:
          12px !important;

        font-weight:
          950 !important;

        letter-spacing:
          .12em !important;
      }


      .mana-v964-open-label{

        margin-top:
          13px;

        padding-top:
          11px;

        border-top:
          1px solid
          #292929;

        color:
          #aa9349;

        font-size:
          11px;

        font-weight:
          950;

        letter-spacing:
          .07em;

        text-transform:
          uppercase;
      }


      .mana-v964-expanded
      .mana-v964-open-label{

        color:
          #f3d875;
      }


      #manaV83Content
      .mana-v85-start{

        min-height:
          56px !important;

        margin-top:
          16px !important;

        border:
          0 !important;

        border-radius:
          15px !important;

        background:
          #f3d875 !important;

        color:
          #111 !important;

        font-size:
          14px !important;

        font-weight:
          950 !important;
      }


      #manaV915Back{

        background:
          #f3d875 !important;

        color:
          #111 !important;
      }


      /* =====================================
         MOBILE
         ===================================== */

      @media(
        max-width:600px
      ){

        .mana-v964-grid{

          grid-template-columns:
            1fr;
        }


        .mana-v964-intro h2{

          font-size:
            30px;
        }


        .mana-v964-intro p{

          font-size:
            15px;
        }


        .mana-v964-launch{

          min-height:
            150px;

          padding:
            19px;
        }


        .mana-v964-icon{

          width:
            54px;

          height:
            54px;

          flex-basis:
            54px;
        }


        .mana-v964-title{

          font-size:
            22px;
        }


        .mana-v964-text{

          font-size:
            14px;
        }


        .mana-v964-arrow{

          font-size:
            12px;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     HOME STEPS
     ========================================= */

  function decorateHome() {

    const profile =
      document.getElementById(
        "manaV80ProfileSetup"
      );


    if (profile) {

      const label =
        profile.querySelector(
          ".mana-v8013-profile-label"
        );

      const title =
        profile.querySelector(
          "h2"
        );

      const text =
        profile.querySelector(
          "p"
        );


      if (label) {

        label.textContent =
          "STEP 1 • PROFILE & GOALS";

      }


      if (title) {

        title.textContent =
          "Set up your profile";

      }


      if (text) {

        text.textContent =
          "Tell Mana your goals, experience and training setup so your program can be personalised.";

      }

    }


    const selector =
      document.querySelector(
        "#manaV80Home " +
        ".mana-v8013-select"
      );


    if (selector) {

      const strong =
        selector.querySelector(
          "strong"
        );

      const span =
        selector.querySelector(
          "span"
        );


      if (strong) {

        strong.textContent =
          "STEP 2 • SELECT YOUR PROGRAM";

      }


      if (span) {

        span.textContent =
          "Choose the Mana program that matches what you want to work on.";

      }

    }

  }


  /* =========================================
     MEMBERSHIP
     ========================================= */

  function decorateMembership() {

    const screen =
      document.getElementById(
        "manaV98Membership"
      );


    if (!screen) {

      return;
    }


    const kicker =
      screen.querySelector(
        ".mana-v981-kicker"
      );

    const title =
      screen.querySelector(
        ".mana-v981-header h1"
      );


    if (kicker) {

      kicker.textContent =
        "STEP 3 • MANA STRENGTH";

    }


    if (title) {

      title.textContent =
        "Choose your plan";

    }

  }


  /* =========================================
     OVERVIEW
     ========================================= */

  function renderLaunchpad() {

    if (
      activeStrengthTab() !==
      "overview"
    ) {

      return;
    }


    const holder =
      document.getElementById(
        "manaV83Content"
      );


    if (
      !holder ||
      holder.querySelector(
        "#manaV964Launchpad"
      )
    ) {

      return;
    }


    const profile =
      loadProfile();


    const program =
      loadProgram();


    const goal =
      profile?.goal ||
      "Set your training goal";


    const days =
      Number(
        program?.days ||
        program
          ?.sessions
          ?.length ||
        0
      );


    const workoutText =
      days > 0

        ? `${days} personalised workout${
            days === 1
              ? ""
              : "s"
          } ready.`

        : "Your personalised workouts live here.";


    holder.innerHTML = `

      <div
        class="mana-v964-launchpad"
        id="manaV964Launchpad"
      >

        <div
          class="mana-v964-intro"
        >

          <div
            class="mana-v964-kicker"
          >
            MANA STRENGTH
          </div>

          <h2>
            Your Strength Hub
          </h2>

          <p>
            Your training tools in one place.
            Choose where you want to go next.
          </p>

        </div>


        <div
          class="mana-v964-grid"
        >

          <button
            type="button"
            class="mana-v964-launch"
            data-v964-launch="profile"
          >

            <div
              class="mana-v964-icon"
            >
              ◎
            </div>

            <div
              class="mana-v964-copy"
            >

              <div
                class="mana-v964-label"
              >
                PROFILE & GOALS
              </div>

              <div
                class="mana-v964-title"
              >
                ${esc(goal)}
              </div>

              <div
                class="mana-v964-text"
              >
                Update your training goal,
                experience, equipment
                and setup.
              </div>

              <div
                class="mana-v964-arrow"
              >
                OPEN PROFILE →
              </div>

            </div>

          </button>


          <button
            type="button"
            class="mana-v964-launch"
            data-v964-launch="program"
          >

            <div
              class="mana-v964-icon"
            >
              01
            </div>

            <div
              class="mana-v964-copy"
            >

              <div
                class="mana-v964-label"
              >
                PROGRAM
              </div>

              <div
                class="mana-v964-title"
              >
                Your Workouts
              </div>

              <div
                class="mana-v964-text"
              >
                ${esc(workoutText)}
                Open a workout, review
                it and start when ready.
              </div>

              <div
                class="mana-v964-arrow"
              >
                VIEW PROGRAM →
              </div>

            </div>

          </button>


          <button
            type="button"
            class="mana-v964-launch"
            data-v964-launch="fuel"
          >

            <div
              class="mana-v964-icon"
            >
              F
            </div>

            <div
              class="mana-v964-copy"
            >

              <div
                class="mana-v964-label"
              >
                FUEL
              </div>

              <div
                class="mana-v964-title"
              >
                Nutrition
              </div>

              <div
                class="mana-v964-text"
              >
                Manage your calories,
                protein, meals, water
                and daily targets.
              </div>

              <div
                class="mana-v964-arrow"
              >
                OPEN FUEL →
              </div>

            </div>

          </button>


          <button
            type="button"
            class="mana-v964-launch"
            data-v964-launch="progress"
          >

            <div
              class="mana-v964-icon"
            >
              ↗
            </div>

            <div
              class="mana-v964-copy"
            >

              <div
                class="mana-v964-label"
              >
                PROGRESS
              </div>

              <div
                class="mana-v964-title"
              >
                Your Results
              </div>

              <div
                class="mana-v964-text"
              >
                See completed sessions,
                strength progress and
                body-weight trends.
              </div>

              <div
                class="mana-v964-arrow"
              >
                VIEW PROGRESS →
              </div>

            </div>

          </button>

        </div>

      </div>

    `;
  }


  /* =========================================
     PROGRAM CARDS
     ========================================= */

  function decorateProgramCards() {

    if (
      activeStrengthTab() !==
      "program"
    ) {

      return;
    }


    document
      .querySelectorAll(
        "#manaV83Content " +
        ".mana-v85-day"
      )
      .forEach(
        (
          card,
          index
        ) => {


          if (
            card.dataset
              .v964Ready ===
            "1"
          ) {

            return;
          }


          card.dataset.v964Ready =
            "1";


          const label =
            card.querySelector(
              ".mana-v85-day-label"
            );


          if (label) {

            label.textContent =
              `WORKOUT ${index + 1}`;

          }


          const start =
            card.querySelector(
              ".mana-v85-start"
            );


          if (start) {

            start.textContent =
              start.classList
                .contains(
                  "resume"
                )
                ? "RESUME WORKOUT"
                : "START WORKOUT";

          }


          const head =
            card.querySelector(
              ".mana-v85-head"
            );


          if (
            head &&
            !card.querySelector(
              ".mana-v964-open-label"
            )
          ) {

            const open =
              document.createElement(
                "div"
              );


            open.className =
              "mana-v964-open-label";


            open.textContent =
              "VIEW WORKOUT +";


            head.appendChild(
              open
            );

          }

        }
      );
  }


  function toggleWorkoutCard(
    card
  ) {

    const expanded =
      card.classList.toggle(
        "mana-v964-expanded"
      );


    const open =
      card.querySelector(
        ".mana-v964-open-label"
      );


    if (open) {

      open.textContent =
        expanded
          ? "HIDE WORKOUT −"
          : "VIEW WORKOUT +";

    }

  }


  /* =========================================
     COMPLETE BUTTON
     ========================================= */

  function decorateComplete() {

    const button =
      document.getElementById(
        "manaV915Back"
      );


    if (button) {

      button.textContent =
        "BACK TO PROGRAM →";

    }
  }


  /* =========================================
     REFRESH
     ========================================= */

  function refresh() {

    decorateHome();

    decorateMembership();

    decorateComplete();


    const tab =
      activeStrengthTab();


    if (
      tab === "overview"
    ) {

      renderLaunchpad();

    }


    if (
      tab === "program"
    ) {

      decorateProgramCards();

    }
  }


  function scheduleRefresh() {

    [
      60,
      180
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
     CLICK HANDLER
     ========================================= */

  function handleClick(
    event
  ) {

    const launcher =
      event.target.closest(
        "[data-v964-launch]"
      );


    if (launcher) {

      const destination =
        launcher.dataset
          .v964Launch;


      if (
        destination ===
        "profile"
      ) {

        document
          .getElementById(
            "manaV83ProgramShell"
          )
          ?.classList
          .remove(
            "open"
          );


        document.body.style.overflow =
          "";


        if (
          typeof
            window.openManaProfile ===
          "function"
        ) {

          window.openManaProfile();

        }


        return;
      }


      openStrengthTab(
        destination
      );


      scheduleRefresh();


      return;
    }


    const card =
      event.target.closest(
        "#manaV83Content " +
        ".mana-v85-day"
      );


    if (card) {

      if (
        event.target.closest(
          ".mana-v85-start"
        ) ||
        event.target.closest(
          ".mana-v85-exercises"
        )
      ) {

        return;
      }


      toggleWorkoutCard(
        card
      );


      return;
    }


    if (
      event.target.closest(
        "#manaV83Tabs " +
        ".mana-v83-tab"
      )
    ) {

      scheduleRefresh();

    }


    if (
      event.target.closest(
        "#manaV80Strength"
      )
    ) {

      setTimeout(
        decorateMembership,
        80
      );

    }

  }


  function init() {

    installStyles();


    document.addEventListener(
      "click",
      handleClick,
      true
    );


    [
      "mana:program-tab-change",
      "mana:strength-synced",
      "mana:workout-progress-change",
      "mana:strength-membership-change"
    ]
      .forEach(
        name => {

          window.addEventListener(
            name,
            scheduleRefresh
          );

        }
      );


    [
      200,
      700
    ]
      .forEach(
        delay => {

          setTimeout(
            refresh,
            delay
          );

        }
      );


    window
      .MANA_STRENGTH_LAUNCHPAD_BUILD =
      BUILD;


    window
      .refreshManaStrengthLaunchpad =
      refresh;
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
