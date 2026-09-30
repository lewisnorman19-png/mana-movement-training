/* =========================================
   MANA MOVEMENT TRAINING v9.64.1
   STRENGTH LAUNCHPAD + HOME STEPS

   HOME
   - PROFILE BOTTOM TAB RETURNS TO DARK
   - STEP 1 = PROFILE & GOALS
   - STEP 2 = SELECT PROGRAM

   MANA STRENGTH MEMBERSHIP
   - STEP 3 = CHOOSE PLAN

   STRENGTH OVERVIEW
   - CLEANER PREMIUM LAUNCH CARDS
   - PROFILE
   - PROGRAM
   - FUEL
   - PROGRESS

   PROGRAM
   - NUMBERED WORKOUTS
   - COLLAPSED UNTIL SELECTED
   - START BUTTON INSIDE WORKOUT

   COMPLETION
   - STABLE RETURN TO PROGRAM
   - REMOVES DOM OBSERVER FLICKER
   ========================================= */

(() => {
  "use strict";

  const BUILD = "96410";

  const STYLE_ID =
    "mana-v964-strength-launchpad-style";

  const PROFILE_KEY =
    "mana-profile-v67";

  const PROGRAM_KEY =
    "mana-strength-v62-program";

  let returnInProgress = false;


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
         HOME — BOTTOM PROFILE TAB
         NO LONGER HIGHLIGHTED
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


      #manaV80Home
      #manaV80ProfileBtn:active{

        background:
          #171717 !important;

        color:
          #f3d875 !important;
      }


      /* =====================================
         HOME — STEP 1
         PROFILE / GOALS HERO
         ===================================== */

      #manaV80Home
      #manaV80ProfileSetup{

        position:relative;

        overflow:hidden;

        border:
          0 !important;

        background:
          linear-gradient(
            135deg,
            #f7df83,
            #d9ae35
          ) !important;

        color:
          #111 !important;

        box-shadow:
          0
          14px
          36px
          rgba(
            212,
            175,
            55,
            .22
          ) !important;
      }


      #manaV80Home
      #manaV80ProfileSetup::after{

        content:"1";

        position:absolute;

        right:18px;
        bottom:-18px;

        color:
          rgba(
            17,
            17,
            17,
            .09
          );

        font-size:108px;

        font-weight:950;

        line-height:1;
      }


      #manaV80Home
      #manaV80ProfileSetup
      .mana-v8013-profile-label{

        color:
          #111 !important;

        opacity:.72;
      }


      #manaV80Home
      #manaV80ProfileSetup h2{

        position:relative;

        z-index:2;

        color:
          #111 !important;
      }


      #manaV80Home
      #manaV80ProfileSetup p{

        position:relative;

        z-index:2;

        max-width:80%;

        color:
          #2d291c !important;
      }


      #manaV80Home
      #manaV80ProfileSetup
      .mana-v8013-profile-open{

        position:relative;

        z-index:2;

        color:
          #111 !important;
      }


      /* =====================================
         HOME — STEP 2
         ===================================== */

      #manaV80Home
      .mana-v8013-select{

        position:relative;

        border:
          1px solid
          #6e5a1c !important;

        background:
          linear-gradient(
            145deg,
            #201a08,
            #0b0b0b
          ) !important;

        box-shadow:
          inset
          0
          0
          0
          1px
          rgba(
            243,
            216,
            117,
            .04
          );
      }


      #manaV80Home
      .mana-v8013-select strong{

        color:
          #f3d875 !important;
      }


      #manaV80Home
      .mana-v8013-select span{

        color:
          #9d9d9d !important;
      }


      /* =====================================
         STEP 3 — MEMBERSHIP
         ===================================== */

      #manaV98Membership
      .mana-v981-kicker{

        color:
          #f3d875 !important;

        letter-spacing:
          .13em !important;
      }


      #manaV98Membership
      .mana-v981-header{

        border-bottom:
          1px solid
          #342d18;

        padding-bottom:
          22px;
      }


      /* =====================================
         STRENGTH OVERVIEW
         ===================================== */

      .mana-v964-launchpad{

        width:100%;

        max-width:
          780px;

        margin:
          0 auto;

        padding:
          4px
          0
          30px;
      }


      .mana-v964-intro{

        margin-bottom:
          20px;
      }


      .mana-v964-kicker{

        color:#f3d875;

        font-size:10px;

        font-weight:950;

        letter-spacing:.15em;

        text-transform:uppercase;
      }


      .mana-v964-intro h2{

        margin:
          7px
          0
          7px;

        color:#fff;

        font-size:30px;

        line-height:1.05;
      }


      .mana-v964-intro p{

        max-width:560px;

        margin:0;

        color:#838383;

        font-size:13px;

        line-height:1.55;
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

        gap:14px;
      }


      .mana-v964-launch{

        position:relative;

        width:100%;

        min-height:176px;

        overflow:hidden;

        display:flex;

        align-items:
          flex-start;

        gap:15px;

        padding:
          20px;

        text-align:left;

        border:
          1px solid
          #343020;

        border-radius:
          22px;

        background:
          linear-gradient(
            145deg,
            #15140f,
            #090909
          );

        color:#fff;

        cursor:pointer;

        transition:
          transform
          .12s ease,
          border-color
          .18s ease,
          box-shadow
          .18s ease;
      }


      .mana-v964-launch::before{

        content:"";

        position:absolute;

        top:0;
        left:18px;
        right:18px;

        height:2px;

        background:
          linear-gradient(
            90deg,
            transparent,
            #f3d875,
            transparent
          );

        opacity:.75;
      }


      .mana-v964-launch:hover{

        border-color:
          #76601e;

        box-shadow:
          0
          13px
          35px
          rgba(
            0,
            0,
            0,
            .28
          );
      }


      .mana-v964-launch:active{

        transform:
          scale(.985);
      }


      .mana-v964-icon{

        flex:
          0 0
          56px;

        width:56px;
        height:56px;

        display:grid;

        place-items:center;

        border-radius:
          17px;

        background:
          linear-gradient(
            145deg,
            #f8e08a,
            #d9ae35
          );

        color:#111;

        font-size:19px;

        font-weight:950;

        box-shadow:
          0
          9px
          25px
          rgba(
            243,
            216,
            117,
            .12
          );
      }


      .mana-v964-copy{

        min-width:0;

        flex:1;
      }


      .mana-v964-label{

        color:#a88e3a;

        font-size:9px;

        font-weight:950;

        letter-spacing:.13em;

        text-transform:uppercase;
      }


      .mana-v964-title{

        margin-top:6px;

        color:#fff;

        font-size:21px;

        font-weight:950;

        line-height:1.08;
      }


      .mana-v964-text{

        margin-top:8px;

        color:#8b8b8b;

        font-size:12px;

        line-height:1.48;
      }


      .mana-v964-arrow{

        margin-top:14px;

        color:#f3d875;

        font-size:11px;

        font-weight:950;

        letter-spacing:.04em;
      }


      /* =====================================
         PROGRAM
         ===================================== */

      #manaV83Content
      .mana-v85-day{

        cursor:pointer;

        transition:
          border-color
          .15s ease,
          background
          .15s ease;
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

        font-weight:
          950 !important;

        letter-spacing:
          .12em !important;
      }


      .mana-v964-open-label{

        margin-top:13px;

        padding-top:11px;

        border-top:
          1px solid
          #292929;

        color:#a88e3a;

        font-size:10px;

        font-weight:950;

        letter-spacing:.07em;

        text-transform:uppercase;
      }


      .mana-v964-expanded
      .mana-v964-open-label{

        color:#f3d875;
      }


      #manaV83Content
      .mana-v85-start{

        min-height:
          55px !important;

        margin-top:
          15px !important;

        border:
          0 !important;

        border-radius:
          15px !important;

        background:
          #f3d875 !important;

        color:
          #111 !important;

        font-size:
          13px !important;

        font-weight:
          950 !important;
      }


      /* =====================================
         RETURN TRANSITION
         ===================================== */

      #manaV83ProgramShell
      .mana-v83-content-returning{

        opacity:0 !important;
      }


      #manaV83Content{

        transition:
          opacity
          .12s ease;
      }


      /* =====================================
         COMPLETE BUTTON
         ===================================== */

      #manaV915Back{

        background:
          #f3d875 !important;

        color:
          #111 !important;
      }


      /* =====================================
         PHONE
         ===================================== */

      @media(
        max-width:600px
      ){

        #manaV80Home
        #manaV80ProfileSetup p{

          max-width:90%;
        }


        .mana-v964-grid{

          grid-template-columns:
            1fr;
        }


        .mana-v964-launch{

          min-height:
            138px;

          padding:
            17px;
        }


        .mana-v964-icon{

          width:50px;

          height:50px;

          flex-basis:50px;
        }


        .mana-v964-title{

          font-size:19px;
        }


        .mana-v964-intro h2{

          font-size:27px;
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

      const open =
        profile.querySelector(
          ".mana-v8013-profile-open"
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
          "Tell Mana your goals, training experience and setup so your experience can be personalised.";

      }


      if (open) {

        open.textContent =
          "OPEN PROFILE →";

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
     MEMBERSHIP — STEP 3
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

    const text =
      screen.querySelector(
        ".mana-v981-header p"
      );


    if (kicker) {

      kicker.textContent =
        "STEP 3 • MANA STRENGTH";

    }


    if (title) {

      title.textContent =
        "Choose your plan";

    }


    if (text) {

      text.textContent =
        "Choose the level of coaching and support you want with your Mana Strength program.";

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


    if (!holder) {

      return;
    }


    if (
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
            Everything has its place.
            Choose where you want to go
            and keep the overview simple.
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
                Update your goal,
                experience, equipment
                and training setup.
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
                Open one when you're
                ready to train.
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
                Calories, protein,
                meals, water and
                personalised targets.
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
                Review training history,
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


          card.setAttribute(
            "aria-expanded",
            "false"
          );


          const dayLabel =
            card.querySelector(
              ".mana-v85-day-label"
            );


          if (dayLabel) {

            dayLabel.textContent =
              `WORKOUT ${index + 1}`;

          }


          const start =
            card.querySelector(
              ".mana-v85-start"
            );


          if (start) {

            start.textContent =
              start
                .classList
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

            const label =
              document.createElement(
                "div"
              );


            label.className =
              "mana-v964-open-label";


            label.textContent =
              "VIEW WORKOUT +";


            head.appendChild(
              label
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


    card.setAttribute(
      "aria-expanded",
      expanded
        ? "true"
        : "false"
    );


    const label =
      card.querySelector(
        ".mana-v964-open-label"
      );


    if (label) {

      label.textContent =
        expanded
          ? "HIDE WORKOUT −"
          : "VIEW WORKOUT +";

    }

  }


  /* =========================================
     COMPLETE SCREEN
     ========================================= */

  function decorateCompleteScreen() {

    const button =
      document.getElementById(
        "manaV915Back"
      );


    if (button) {

      button.textContent =
        "BACK TO PROGRAM →";

    }
  }


  function returnToProgram() {

    if (
      returnInProgress
    ) {

      return;
    }


    returnInProgress =
      true;


    document
      .getElementById(
        "manaV915Complete"
      )
      ?.classList
      .remove(
        "open"
      );


    document.body.style.overflow =
      "";


    const holder =
      document.getElementById(
        "manaV83Content"
      );


    if (holder) {

      holder.classList.add(
        "mana-v83-content-returning"
      );

    }


    if (
      typeof
        window.openManaProgram ===
      "function"
    ) {

      window.openManaProgram(
        "strength"
      );

    }


    setTimeout(
      () => {

        openStrengthTab(
          "program"
        );

      },
      70
    );


    setTimeout(
      () => {

        if (
          typeof
            window
              .refreshManaStrengthProgramCards ===
          "function"
        ) {

          window
            .refreshManaStrengthProgramCards();

        }

      },
      170
    );


    setTimeout(
      () => {

        decorateProgramCards();


        document
          .getElementById(
            "manaV83Content"
          )
          ?.classList
          .remove(
            "mana-v83-content-returning"
          );


        returnInProgress =
          false;

      },
      320
    );
  }


  /* =========================================
     SCHEDULED REFRESH
     NO CONTINUOUS OBSERVER
     ========================================= */

  function refreshCurrentScreen() {

    decorateHome();

    decorateMembership();

    decorateCompleteScreen();


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
      40,
      140,
      320
    ]
      .forEach(
        delay => {

          setTimeout(
            refreshCurrentScreen,
            delay
          );

        }
      );
  }


  /* =========================================
     CLICKS
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
            window
              .openManaProfile ===
          "function"
        ) {

          window
            .openManaProfile();

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
        )
      ) {

        return;
      }


      if (
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
        "#manaV915Back"
      )
    ) {

      event.preventDefault();

      event.stopPropagation();

      event
        .stopImmediatePropagation();


      returnToProgram();


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

      /*
        v9.8 opens the membership
        screen in capture phase.

        We only decorate it afterwards.
      */

      setTimeout(
        decorateMembership,
        60
      );

      setTimeout(
        decorateMembership,
        180
      );

    }

  }


  /* =========================================
     EVENTS
     ========================================= */

  function installEvents() {

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
        eventName => {

          window.addEventListener(
            eventName,
            scheduleRefresh
          );

        }
      );


    window.addEventListener(
      "focus",
      () => {

        setTimeout(
          refreshCurrentScreen,
          100
        );

      }
    );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    installEvents();


    [
      150,
      500,
      1100
    ]
      .forEach(
        delay => {

          setTimeout(
            refreshCurrentScreen,
            delay
          );

        }
      );


    window
      .MANA_STRENGTH_LAUNCHPAD_BUILD =
      BUILD;


    window
      .refreshManaStrengthLaunchpad =
      refreshCurrentScreen;


    console.log(
      "[Mana v9.64.1] " +
      "Strength launchpad ready"
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
