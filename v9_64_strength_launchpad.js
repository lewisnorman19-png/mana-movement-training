/* =========================================
   MANA MOVEMENT TRAINING v9.64.0
   STRENGTH LAUNCHPAD CLEANUP

   OVERVIEW
   - SIMPLE LAUNCHING PAGE
   - PROFILE + GOALS
   - PROGRAM
   - FUEL
   - PROGRESS
   - REMOVES "START NEXT WORKOUT" FLOW

   PROGRAM
   - WORKOUTS NUMBERED 1, 2, 3...
   - COLLAPSED BY DEFAULT
   - TAP WORKOUT TO OPEN DETAILS
   - START BUTTON LIVES INSIDE WORKOUT
   - TIMER ONLY STARTS AFTER START WORKOUT

   COMPLETION
   - RETURNS TO PROGRAM TAB
   - NOT OVERVIEW

   HOME
   - PROFILE NAV BUTTON SOLID YELLOW
   ========================================= */

(() => {
  "use strict";

  const BUILD = "96400";
  const STYLE_ID = "mana-v964-strength-launchpad-style";

  const PROFILE_KEY = "mana-profile-v67";
  const PROGRAM_KEY = "mana-strength-v62-program";

  let observer = null;
  let queued = false;

  /* =========================================
     HELPERS
     ========================================= */

  function safeJson(raw, fallback) {
    try {
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }

  function loadProfile() {
    return safeJson(
      localStorage.getItem(PROFILE_KEY) || "{}",
      {}
    );
  }

  function loadProgram() {
    return safeJson(
      localStorage.getItem(PROGRAM_KEY) || "null",
      null
    );
  }

  function activeStrengthTab() {
    const shell =
      document.getElementById("manaV83ProgramShell");

    const title =
      document.getElementById("manaV83Title");

    const tab =
      document.querySelector(
        "#manaV83Tabs .mana-v83-tab.active"
      );

    if (
      !shell?.classList.contains("open") ||
      title?.textContent?.trim() !== "MANA STRENGTH"
    ) {
      return null;
    }

    return tab?.dataset?.v83Tab || null;
  }

  function openStrengthTab(tabName) {
    const button =
      document.querySelector(
        `#manaV83Tabs [data-v83-tab="${tabName}"]`
      );

    button?.click();
  }

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  /* =========================================
     STYLES
     ========================================= */

  function installStyles() {
    document
      .getElementById(STYLE_ID)
      ?.remove();

    const style =
      document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `

      /* =====================================
         HOME PROFILE BUTTON
         ===================================== */

      #manaV80Home
      #manaV80ProfileBtn {
        background:#f3d875 !important;
        border-color:#f3d875 !important;
        color:#111 !important;
        font-weight:900 !important;
        box-shadow:
          0 7px 22px
          rgba(243,216,117,.18) !important;
      }


      #manaV80Home
      #manaV80ProfileBtn:active {
        transform:scale(.97);
      }


      /* =====================================
         OVERVIEW LAUNCHPAD
         ===================================== */

      .mana-v964-launchpad {
        width:100%;
        max-width:760px;
        margin:0 auto;
        padding:
          2px
          0
          28px;
      }


      .mana-v964-intro {
        margin-bottom:18px;
      }


      .mana-v964-kicker {
        color:#f3d875;
        font-size:11px;
        font-weight:900;
        letter-spacing:.13em;
        text-transform:uppercase;
      }


      .mana-v964-intro h2 {
        margin:
          7px
          0
          7px;
        color:#fff;
        font-size:29px;
        line-height:1.08;
      }


      .mana-v964-intro p {
        margin:0;
        color:#888;
        font-size:13px;
        line-height:1.5;
      }


      .mana-v964-grid {
        display:grid;
        grid-template-columns:
          repeat(2,minmax(0,1fr));
        gap:12px;
      }


      .mana-v964-launch {
        width:100%;
        min-height:160px;
        display:flex;
        align-items:flex-start;
        gap:15px;
        padding:18px;
        text-align:left;

        border:
          1px solid
          #303030;

        border-radius:20px;

        background:
          linear-gradient(
            145deg,
            #111,
            #090909
          );

        color:#fff;
        cursor:pointer;
      }


      .mana-v964-launch:active {
        transform:scale(.99);
      }


      .mana-v964-icon {
        flex:
          0
          0
          52px;

        width:52px;
        height:52px;

        display:grid;
        place-items:center;

        border-radius:15px;

        background:#f3d875;
        color:#111;

        font-size:20px;
        font-weight:950;

        box-shadow:
          0 8px 24px
          rgba(243,216,117,.15);
      }


      .mana-v964-copy {
        min-width:0;
        flex:1;
      }


      .mana-v964-label {
        color:#f3d875;
        font-size:10px;
        font-weight:900;
        letter-spacing:.1em;
        text-transform:uppercase;
      }


      .mana-v964-title {
        margin-top:5px;
        color:#fff;
        font-size:20px;
        font-weight:900;
        line-height:1.1;
      }


      .mana-v964-text {
        margin-top:8px;
        color:#8e8e8e;
        font-size:12px;
        line-height:1.45;
      }


      .mana-v964-arrow {
        margin-top:12px;
        color:#f3d875;
        font-size:12px;
        font-weight:900;
      }


      /* =====================================
         PROGRAM — COLLAPSED WORKOUT CARDS
         ===================================== */

      #manaV83Content
      .mana-v85-day {
        cursor:pointer;
        transition:
          border-color .18s ease,
          background .18s ease;
      }


      #manaV83Content
      .mana-v85-day:not(.mana-v964-expanded)
      .mana-v85-exercises,

      #manaV83Content
      .mana-v85-day:not(.mana-v964-expanded)
      .mana-v85-start {
        display:none !important;
      }


      #manaV83Content
      .mana-v85-day.mana-v964-expanded {
        border-color:#69591e !important;

        background:
          linear-gradient(
            145deg,
            #15130b,
            #090909
          ) !important;
      }


      #manaV83Content
      .mana-v85-day-label {
        color:#f3d875 !important;
        font-size:12px !important;
        font-weight:950 !important;
        letter-spacing:.11em !important;
      }


      #manaV83Content
      .mana-v85-title {
        margin-top:6px;
      }


      .mana-v964-open-label {
        margin-top:13px;
        padding-top:12px;

        border-top:
          1px solid
          #292929;

        color:#f3d875;
        font-size:11px;
        font-weight:900;
        letter-spacing:.06em;
        text-transform:uppercase;
      }


      .mana-v964-expanded
      .mana-v964-open-label {
        margin-bottom:12px;
      }


      #manaV83Content
      .mana-v85-start {
        min-height:55px !important;
        margin-top:15px !important;

        border:0 !important;
        border-radius:15px !important;

        background:#f3d875 !important;
        color:#111 !important;

        font-size:13px !important;
        font-weight:950 !important;
        letter-spacing:.05em !important;
      }


      #manaV83Content
      .mana-v85-start.resume {
        background:#f3d875 !important;
        color:#111 !important;
      }


      /* =====================================
         COMPLETE SCREEN
         ===================================== */

      #manaV915Back {
        background:#f3d875 !important;
        color:#111 !important;
      }


      /* =====================================
         MOBILE
         ===================================== */

      @media(max-width:600px) {

        .mana-v964-grid {
          grid-template-columns:1fr;
        }


        .mana-v964-launch {
          min-height:132px;
          padding:16px;
        }


        .mana-v964-icon {
          width:48px;
          height:48px;
          flex-basis:48px;
        }


        .mana-v964-title {
          font-size:19px;
        }


        .mana-v964-intro h2 {
          font-size:26px;
        }

      }

    `;

    document.head.appendChild(style);
  }

  /* =========================================
     OVERVIEW
     ========================================= */

  function renderLaunchpad() {
    if (
      activeStrengthTab() !== "overview"
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
        program?.sessions?.length ||
        0
      );

    const workoutCopy =
      days > 0
        ? `${days} personalised workout${
            days === 1 ? "" : "s"
          } ready`
        : "Your personalised training plan";

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
            Choose where you want to go.
            Everything else lives inside
            its own section.
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
                ${esc(workoutCopy)}.
                Choose a workout,
                review it, then start.
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
                Track food, protein,
                calories, hydration
                and your daily targets.
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
                Review completed
                sessions, strength
                progress and body weight.
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
      activeStrengthTab() !== "program"
    ) {
      return;
    }

    const cards =
      document.querySelectorAll(
        "#manaV83Content .mana-v85-day"
      );

    cards.forEach(
      (card, index) => {

        if (
          card.dataset.v964Ready ===
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
            start.classList.contains(
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

          head.appendChild(label);
        }
      }
    );
  }

  function toggleWorkoutCard(card) {
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
     COMPLETE → PROGRAM
     ========================================= */

  function updateCompleteButton() {
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
    document
      .getElementById(
        "manaV915Complete"
      )
      ?.classList
      .remove("open");

    document.body.style.overflow =
      "";

    if (
      typeof
        window.openManaProgram ===
      "function"
    ) {
      window.openManaProgram(
        "strength"
      );
    }

    [
      120,
      300,
      600
    ].forEach(
      delay => {
        setTimeout(
          () => {
            openStrengthTab(
              "program"
            );
          },
          delay
        );
      }
    );
  }

  /* =========================================
     PROFILE BUTTON
     ========================================= */

  function enforceProfileButton() {
    const button =
      document.getElementById(
        "manaV80ProfileBtn"
      );

    if (!button) {
      return;
    }

    button.classList.add(
      "mana-v964-profile-highlight"
    );
  }

  /* =========================================
     APPLY
     ========================================= */

  function applyAll() {
    queued = false;

    enforceProfileButton();

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

    updateCompleteButton();
  }

  function queueApply() {
    if (queued) {
      return;
    }

    queued = true;

    setTimeout(
      applyAll,
      40
    );
  }

  /* =========================================
     EVENTS
     ========================================= */

  function handleClick(event) {

    /* Launchpad */

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
          .remove("open");

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

      return;
    }


    /* Workout card expansion */

    const workoutCard =
      event.target.closest(
        "#manaV83Content .mana-v85-day"
      );

    if (workoutCard) {

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
        workoutCard
      );

      return;
    }


    /* Complete screen */

    if (
      event.target.closest(
        "#manaV915Back"
      )
    ) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      returnToProgram();

      return;
    }


    /* Strength tabs */

    if (
      event.target.closest(
        "#manaV83Tabs .mana-v83-tab"
      )
    ) {
      setTimeout(
        queueApply,
        80
      );

      setTimeout(
        queueApply,
        250
      );
    }
  }

  /* =========================================
     OBSERVER
     ========================================= */

  function startObserver() {
    if (observer) {
      observer.disconnect();
    }

    observer =
      new MutationObserver(
        queueApply
      );

    observer.observe(
      document.body,
      {
        childList:true,
        subtree:true,
        attributes:true,
        attributeFilter:[
          "class"
        ]
      }
    );
  }

  /* =========================================
     INIT
     ========================================= */

  function init() {
    installStyles();

    document.addEventListener(
      "click",
      handleClick,
      true
    );

    startObserver();

    [
      200,
      600,
      1200
    ].forEach(
      delay => {
        setTimeout(
          applyAll,
          delay
        );
      }
    );

    window.MANA_STRENGTH_LAUNCHPAD_BUILD =
      BUILD;

    window.refreshManaStrengthLaunchpad =
      applyAll;

    console.log(
      "[Mana v9.64.0] Strength launchpad ready"
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
