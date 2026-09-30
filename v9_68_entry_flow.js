/* =========================================
   MANA MOVEMENT TRAINING v9.68.1
   GUIDED ENTRY FLOW

   LOGIN
      ↓
   INTRO
      ↓
   STEP 1 — COMPLETE PROFILE
      ↓
   STEP 2 — CHOOSE PROGRAM
      ↓
   STEP 3 — CHOOSE COACHING LEVEL

   Uses the existing Profile,
   Home program cards and
   Strength membership screen.
   ========================================= */

(() => {
  "use strict";

  const BUILD = "96810";

  const STYLE_ID =
    "mana-v968-entry-style";

  const PROFILE_KEY =
    "mana-profile-v67";

  const COMPLETE_KEY =
    "mana-onboarding-complete-v968";

  const ACTIVE_KEY =
    "mana-onboarding-active-v968";


  function safeJson(raw, fallback) {
    try {
      return JSON.parse(raw);
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


  function profileComplete() {

    const p =
      loadProfile();


    return Boolean(
      p.name &&
      p.age &&
      p.gender &&
      p.height &&
      p.weight &&
      p.goal &&
      p.days &&
      p.experience &&
      p.equipment &&
      p.fuelGoal
    );
  }


  function onboardingComplete() {

    return (
      localStorage.getItem(
        COMPLETE_KEY
      ) === "1"
    );
  }


  function onboardingActive() {

    return (
      localStorage.getItem(
        ACTIVE_KEY
      ) === "1"
    );
  }


  function startOnboarding() {

    localStorage.setItem(
      ACTIVE_KEY,
      "1"
    );
  }


  function finishOnboarding() {

    localStorage.setItem(
      COMPLETE_KEY,
      "1"
    );

    localStorage.removeItem(
      ACTIVE_KEY
    );

    document.body.classList.remove(
      "mana-v968-step2-mode"
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
         STEP 1 — ACTUAL PROFILE SCREEN
         ===================================== */

      #manaProfileScreen.mana-v968-step1
      .mana-profile-shell{
        max-width:720px !important;
      }


      #manaProfileScreen.mana-v968-step1
      .mana-profile-head{
        display:none !important;
      }


      #manaProfileScreen.mana-v968-step1
      #manaProfileClose{
        display:none !important;
      }


      .mana-v968-step1-hero{

        position:relative;

        overflow:hidden;

        margin:
          2px
          0
          22px;

        padding:
          28px
          26px;

        border:
          1px solid
          #7c6826;

        border-radius:
          28px;

        background:
          linear-gradient(
            145deg,
            #251f0d,
            #14120a 52%,
            #090909
          );

        box-shadow:
          0
          18px
          45px
          rgba(0,0,0,.25);
      }


      .mana-v968-step1-hero::before{

        content:"";

        position:absolute;

        top:0;
        left:25px;
        right:25px;

        height:3px;

        background:
          linear-gradient(
            90deg,
            transparent,
            #f3d875,
            transparent
          );
      }


      .mana-v968-step-number{

        color:
          #f3d875;

        font-size:
          12px;

        font-weight:
          950;

        letter-spacing:
          .16em;

        text-transform:
          uppercase;
      }


      .mana-v968-step1-hero h1{

        margin:
          10px
          0
          10px;

        color:#fff;

        font-size:
          clamp(
            34px,
            7vw,
            50px
          );

        line-height:
          .98;
      }


      .mana-v968-step1-hero p{

        max-width:
          580px;

        margin:0;

        color:#aaa;

        font-size:
          15px;

        line-height:
          1.6;
      }


      .mana-v968-profile-anchor{

        width:
          100%;

        min-height:
          60px;

        margin-top:
          22px;

        border:0;

        border-radius:
          17px;

        background:
          linear-gradient(
            135deg,
            #f3d875,
            #bc8e29
          );

        color:#090909;

        font-size:
          15px;

        font-weight:
          950;

        letter-spacing:
          .03em;
      }


      #manaProfileScreen.mana-v968-step1
      .mana-profile-card{

        border-color:
          #363328 !important;

        background:
          linear-gradient(
            145deg,
            #14130f,
            #0a0a09
          ) !important;
      }


      #manaProfileScreen.mana-v968-step1
      #manaProfileSave{

        min-height:
          62px !important;

        border-radius:
          17px !important;

        background:
          linear-gradient(
            135deg,
            #f3d875,
            #bc8e29
          ) !important;

        color:#090909 !important;

        font-weight:
          950 !important;
      }


      /* =====================================
         STEP 2 — CLEAN PROGRAM SELECTION
         ===================================== */

      body.mana-v968-step2-mode
      #manaV80Home
      .mana-v8013-brand,

      body.mana-v968-step2-mode
      #manaV80Home
      #manaV80ProfileSetup,

      body.mana-v968-step2-mode
      #manaV80Home
      .mana-v8013-select,

      body.mana-v968-step2-mode
      #manaV80Home
      .mana-v8013-bottom{

        display:none !important;
      }


      .mana-v968-step2-head{

        margin:
          12px
          0
          25px;

        padding:
          26px
          24px;

        border:
          1px solid
          #665522;

        border-radius:
          26px;

        background:
          linear-gradient(
            145deg,
            #1c180c,
            #0b0b09
          );
      }


      .mana-v968-step2-head
      .mana-v968-step-number{

        margin-bottom:
          9px;
      }


      .mana-v968-step2-head h1{

        margin:
          0
          0
          9px;

        color:#fff;

        font-size:
          36px;

        line-height:
          1;
      }


      .mana-v968-step2-head p{

        margin:0;

        color:#999;

        font-size:
          15px;

        line-height:
          1.55;
      }


      body.mana-v968-step2-mode
      #manaV80Home
      .mana-v8013-program{

        margin:
          15px
          0 !important;
      }


      /* =====================================
         STEP 3 — STRENGTH COACHING LEVEL
         ===================================== */

      #manaV98Membership
      .mana-v981-kicker{

        color:
          #f3d875 !important;

        font-size:
          11px !important;

        letter-spacing:
          .15em !important;
      }


      @media(max-width:600px){

        .mana-v968-step1-hero{
          padding:
            23px
            20px;
        }


        .mana-v968-step2-head{
          padding:
            22px
            19px;
        }


        .mana-v968-step2-head h1{
          font-size:
            31px;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     STEP 1
     ========================================= */

  function decorateProfileStep() {

    const screen =
      document.getElementById(
        "manaProfileScreen"
      );


    const shell =
      screen?.querySelector(
        ".mana-profile-shell"
      );


    if (
      !screen ||
      !shell
    ) {
      return;
    }


    screen.classList.add(
      "mana-v968-step1"
    );


    let hero =
      document.getElementById(
        "manaV968Step1Hero"
      );


    if (!hero) {

      hero =
        document.createElement(
          "div"
        );


      hero.id =
        "manaV968Step1Hero";


      hero.className =
        "mana-v968-step1-hero";


      hero.innerHTML = `

        <div
          class="mana-v968-step-number"
        >
          STEP 1 • PROFILE & GOALS
        </div>


        <h1>
          Complete your profile
        </h1>


        <p>
          Tell Mana about your goals,
          training experience, weekly setup
          and Fuel needs. This information
          shapes what comes next.
        </p>


        <button
          type="button"
          class="mana-v968-profile-anchor"
          id="manaV968ProfileAnchor"
        >
          STEP 1 • COMPLETE PROFILE
        </button>

      `;


      shell.prepend(
        hero
      );


      document
        .getElementById(
          "manaV968ProfileAnchor"
        )
        .onclick =
          () => {

            screen
              .querySelector(
                ".mana-profile-card"
              )
              ?.scrollIntoView({
                behavior:"smooth",
                block:"start"
              });

          };
    }


    const save =
      document.getElementById(
        "manaProfileSave"
      );


    if (save) {

      save.textContent =
        "SAVE PROFILE & CONTINUE →";

    }

  }


  function openStep1() {

    startOnboarding();


    if (
      typeof
        window
          .openManaProfile ===
      "function"
    ) {

      window
        .openManaProfile();

    }


    [
      20,
      100,
      250
    ].forEach(
      delay => {

        setTimeout(
          decorateProfileStep,
          delay
        );

      }
    );
  }


  /* =========================================
     STEP 2
     ========================================= */

  function decorateStep2() {

    const home =
      document.getElementById(
        "manaV80Home"
      );


    const first =
      document.getElementById(
        "manaV80Mana28"
      );


    if (
      !home ||
      !first
    ) {
      return;
    }


    document.body.classList.add(
      "mana-v968-step2-mode"
    );


    let header =
      document.getElementById(
        "manaV968Step2Head"
      );


    if (!header) {

      header =
        document.createElement(
          "div"
        );


      header.id =
        "manaV968Step2Head";


      header.className =
        "mana-v968-step2-head";


      header.innerHTML = `

        <div
          class="mana-v968-step-number"
        >
          STEP 2 • PROGRAM SELECTION
        </div>


        <h1>
          Choose your path
        </h1>


        <p>
          Pick the Mana program that matches
          what you want to work on right now.
        </p>

      `;


      first
        .insertAdjacentElement(
          "beforebegin",
          header
        );
    }


    const life =
      document.getElementById(
        "manaV80Life"
      );


    if (life) {

      const label =
        life.querySelector(
          ".mana-v8013-program-label"
        );


      const open =
        life.querySelector(
          ".mana-v8013-open"
        );


      if (label) {

        label.textContent =
          "MANA LYFE";

      }


      if (open) {

        open.textContent =
          "Open MANA LYFE →";

      }

    }

  }


  function showStep2() {

    document
      .getElementById(
        "manaProfileScreen"
      )
      ?.classList
      .remove(
        "open"
      );


    document.body.style.overflow =
      "";


    decorateStep2();
  }


  /* =========================================
     STEP 3
     ========================================= */

  function decorateStep3() {

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
        "STEP 3 • COACHING LEVEL";

    }


    if (title) {

      title.textContent =
        "Choose your Mana Strength plan";

    }


    if (text) {

      text.textContent =
        "Choose how much structure, coaching and support you want.";

    }

  }


  /* =========================================
     EVENTS
     ========================================= */

  function handleIntroEnter(event) {

    if (
      !event.target.closest(
        "#manaV81Enter"
      )
    ) {
      return;
    }


    if (
      onboardingComplete()
    ) {
      return;
    }


    setTimeout(
      openStep1,
      120
    );
  }


  function handleProfileSaved() {

    if (
      !onboardingActive()
    ) {
      return;
    }


    if (
      !profileComplete()
    ) {
      return;
    }


    setTimeout(
      showStep2,
      180
    );
  }


  function handleProgramChoice(event) {

    if (
      !onboardingActive()
    ) {
      return;
    }


    if (
      event.target.closest(
        "#manaV80Mana28"
      ) ||
      event.target.closest(
        "#manaV80Life"
      )
    ) {

      finishOnboarding();

      return;
    }


    if (
      event.target.closest(
        "#manaV80Strength"
      )
    ) {

      setTimeout(
        decorateStep3,
        80
      );


      setTimeout(
        decorateStep3,
        250
      );

    }

  }


  function handleStrengthPlan() {

    if (
      onboardingActive()
    ) {

      finishOnboarding();

    }

  }


  function resumeUnfinishedOnboarding() {

    if (
      onboardingComplete()
    ) {
      return;
    }


    if (
      !onboardingActive()
    ) {
      return;
    }


    if (
      profileComplete()
    ) {

      decorateStep2();

    } else {

      openStep1();

    }

  }


  function init() {

    installStyles();


    document.addEventListener(
      "click",
      handleIntroEnter,
      true
    );


    document.addEventListener(
      "click",
      handleProgramChoice,
      true
    );


    window.addEventListener(
      "mana:profile-synced",
      handleProfileSaved
    );


    window.addEventListener(
      "mana:strength-membership-change",
      handleStrengthPlan
    );


    [
      600,
      1300,
      2200
    ].forEach(
      delay => {

        setTimeout(
          () => {

            if (
              onboardingActive() &&
              profileComplete()
            ) {

              decorateStep2();

            }

            decorateStep3();

          },
          delay
        );

      }
    );


    setTimeout(
      resumeUnfinishedOnboarding,
      1800
    );


    window
      .MANA_ENTRY_FLOW_BUILD =
      BUILD;


    window
      .openManaOnboardingStep1 =
      openStep1;


    window
      .openManaOnboardingStep2 =
      showStep2;
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
