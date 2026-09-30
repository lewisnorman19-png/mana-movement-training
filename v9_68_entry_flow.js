/* =========================================
   MANA MOVEMENT TRAINING v9.68.3
   CLEAN GUIDED ENTRY FLOW

   FIRST SETUP
   LOGIN
      ↓
   INTRO
      ↓
   STEP 1 — PROFILE & GOALS
      ↓
   STEP 2 — HOME / PROGRAM SELECTION
      ↓
   STEP 3 — STRENGTH COACHING LEVEL

   NORMAL APP
   HOME
   - MANA MOVEMENT HEADER
   - MANA 28
   - MANA STRENGTH
   - MANA LYFE
   - BOTTOM NAV

   PROFILE
   - OWN SCREEN VIA BOTTOM NAV

   NO PROFILE CARD ON HOME
   NO STEP 2 BANNER ON HOME
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "96830";

  const STYLE_ID =
    "mana-v968-entry-style";

  const PROFILE_KEY =
    "mana-profile-v67";

  /*
    New key for the cleaned onboarding flow.
  */

  const COMPLETE_KEY =
    "mana-onboarding-complete-v9683";

  const ACTIVE_KEY =
    "mana-onboarding-active-v9683";


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


  function profileScreen() {

    return document
      .getElementById(
        "manaProfileScreen"
      );
  }


  function clientIsLoggedIn() {

    const auth =
      document.getElementById(
        "authView"
      );


    const client =
      document.getElementById(
        "clientView"
      );


    if (!client) {

      return false;

    }


    return Boolean(

      (
        !auth ||
        auth.classList
          .contains(
            "hide"
          )
      ) &&

      !client.classList
        .contains(
          "hide"
        )

    );
  }


  function introOpen() {

    return Boolean(
      document
        .getElementById(
          "manaV81Intro"
        )
        ?.classList
        .contains(
          "open"
        )
    );
  }


  /* =========================================
     REQUIRED PROFILE FIELDS
     ========================================= */

  const REQUIRED_FIELDS = [

    {
      id:
        "manaProfileName",

      label:
        "Name"
    },

    {
      id:
        "manaProfileAge",

      label:
        "Age"
    },

    {
      id:
        "manaProfileGender",

      label:
        "Gender"
    },

    {
      id:
        "manaProfileHeight",

      label:
        "Height"
    },

    {
      id:
        "manaProfileWeight",

      label:
        "Weight"
    },

    {
      id:
        "manaProfileGoal",

      label:
        "Training goal"
    },

    {
      id:
        "manaProfileDays",

      label:
        "Training days"
    },

    {
      id:
        "manaProfileExperience",

      label:
        "Experience"
    },

    {
      id:
        "manaProfileEquipment",

      label:
        "Equipment"
    },

    {
      id:
        "manaProfileFuelGoal",

      label:
        "Fuel goal"
    }

  ];


  function missingFields() {

    return REQUIRED_FIELDS
      .filter(
        field => {

          const input =
            document
              .getElementById(
                field.id
              );


          if (!input) {

            return true;

          }


          return (
            String(
              input.value || ""
            )
              .trim() === ""
          );

        }
      );
  }


  function savedProfileComplete() {

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
         HOME IS NOW ALWAYS CLEAN
         ===================================== */

      #manaV80Home
      #manaV80ProfileSetup,

      #manaV80Home
      .mana-v8013-select,

      #manaV968Step2Head{

        display:
          none !important;
      }


      /*
        Override old v9.64 / v9.65
        Home onboarding decorations.

        The elements remain in the DOM
        for compatibility but are never
        shown on Home.
      */

      #manaV80Home
      #manaV80ProfileSetup{

        visibility:
          hidden !important;

        height:
          0 !important;

        min-height:
          0 !important;

        margin:
          0 !important;

        padding:
          0 !important;

        border:
          0 !important;

        overflow:
          hidden !important;
      }


      #manaV80Home
      .mana-v8013-select{

        visibility:
          hidden !important;

        height:
          0 !important;

        min-height:
          0 !important;

        margin:
          0 !important;

        padding:
          0 !important;

        border:
          0 !important;

        overflow:
          hidden !important;
      }


      /*
        Keep the real Mana Movement
        header visible at all times.
      */

      #manaV80Home
      .mana-v8013-brand{

        display:
          block !important;
      }


      /*
        Home program cards move directly
        under the brand.
      */

      #manaV80Home
      #manaV80Mana28{

        margin-top:
          8px !important;
      }


      /* =====================================
         STEP 1 — PROFILE ONBOARDING
         ===================================== */

      #manaProfileScreen.mana-v968-step1
      .mana-profile-shell{

        max-width:
          720px !important;
      }


      #manaProfileScreen.mana-v968-step1
      .mana-profile-head{

        display:
          none !important;
      }


      #manaProfileScreen.mana-v968-step1
      #manaProfileClose{

        display:
          none !important;
      }


      .mana-v968-step1-hero{

        position:
          relative;

        overflow:
          hidden;

        margin:
          0
          0
          22px;

        padding:
          26px;

        border:
          1px solid
          #766223;

        border-radius:
          27px;

        background:
          linear-gradient(
            145deg,
            #211c0d,
            #121009 52%,
            #080808
          );

        box-shadow:
          0
          18px
          42px
          rgba(
            0,
            0,
            0,
            .24
          );
      }


      .mana-v968-step1-hero::before{

        content:"";

        position:
          absolute;

        top:0;
        left:24px;
        right:24px;

        height:
          3px;

        background:
          linear-gradient(
            90deg,
            transparent,
            #f3d875,
            transparent
          );
      }


      .mana-v968-brand-row{

        display:
          flex;

        align-items:
          center;

        gap:
          14px;

        margin-bottom:
          24px;
      }


      .mana-v968-mark{

        width:
          54px;

        height:
          54px;

        flex:
          0
          0
          54px;

        display:
          grid;

        place-items:
          center;

        border:
          2px solid
          #d4af37;

        background:
          #080808;

        color:
          #f3d875;

        font:
          700
          35px
          Georgia,
          serif;
      }


      .mana-v968-brand-title{

        color:#fff;

        font-size:
          17px;

        font-weight:
          950;

        letter-spacing:
          .15em;
      }


      .mana-v968-brand-kicker{

        margin-top:
          5px;

        color:
          #d4b85b;

        font-size:
          10px;

        font-weight:
          950;

        letter-spacing:
          .15em;
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
            35px,
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

        color:
          #aaa;

        font-size:
          15px;

        line-height:
          1.6;
      }


      #manaProfileScreen.mana-v968-step1
      .mana-profile-card{

        border-color:
          #353229 !important;

        background:
          linear-gradient(
            145deg,
            #14130f,
            #090909
          ) !important;
      }


      #manaProfileScreen.mana-v968-step1
      #manaProfileSave{

        width:
          100% !important;

        min-height:
          62px !important;

        margin-top:
          20px !important;

        border:
          0 !important;

        border-radius:
          17px !important;

        background:
          linear-gradient(
            135deg,
            #f3d875,
            #bc8d28
          ) !important;

        color:
          #090909 !important;

        font-size:
          14px !important;

        font-weight:
          950 !important;

        letter-spacing:
          .03em !important;
      }


      /* =====================================
         MISSING PROFILE FIELDS
         ===================================== */

      #manaProfileScreen
      .mana-profile-field.mana-v968-missing
      input,

      #manaProfileScreen
      .mana-profile-field.mana-v968-missing
      select{

        border-color:
          #d9b646 !important;

        box-shadow:
          0
          0
          0
          2px
          rgba(
            243,
            216,
            117,
            .10
          ) !important;
      }


      .mana-v968-validation{

        display:none;

        margin:
          18px
          0
          4px;

        padding:
          15px
          17px;

        border:
          1px solid
          #826c25;

        border-radius:
          15px;

        background:
          #181409;

        color:
          #ecd678;

        font-size:
          13px;

        font-weight:
          800;

        line-height:
          1.5;
      }


      .mana-v968-validation.show{

        display:
          block;
      }


      /* =====================================
         NORMAL PROFILE
         ===================================== */

      #manaProfileScreen:not(.mana-v968-step1)
      .mana-profile-head{

        display:
          flex !important;
      }


      #manaProfileScreen:not(.mana-v968-step1)
      #manaProfileClose{

        display:
          block !important;
      }


      /* =====================================
         STEP 3
         ===================================== */

      #manaV98Membership
      .mana-v981-kicker{

        color:
          #f3d875 !important;

        font-size:
          11px !important;

        font-weight:
          950 !important;

        letter-spacing:
          .15em !important;
      }


      @media(
        max-width:600px
      ){

        .mana-v968-step1-hero{

          padding:
            22px
            19px;
        }


        .mana-v968-step1-hero h1{

          font-size:
            37px;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     REMOVE OLD HOME STEP CONTENT
     ========================================= */

  function cleanHome() {

    document
      .getElementById(
        "manaV968Step2Head"
      )
      ?.remove();


    const profile =
      document.getElementById(
        "manaV80ProfileSetup"
      );


    if (profile) {

      profile.style
        .setProperty(
          "display",
          "none",
          "important"
        );

    }


    const selector =
      document.querySelector(
        "#manaV80Home " +
        ".mana-v8013-select"
      );


    if (selector) {

      selector.style
        .setProperty(
          "display",
          "none",
          "important"
        );

    }


    const brand =
      document.querySelector(
        "#manaV80Home " +
        ".mana-v8013-brand"
      );


    if (brand) {

      brand.style
        .setProperty(
          "display",
          "block",
          "important"
        );

    }


    /*
      Rename LIFE → LYFE.
    */

    const lyfe =
      document.getElementById(
        "manaV80Life"
      );


    if (lyfe) {

      const label =
        lyfe.querySelector(
          ".mana-v8013-program-label"
        );


      const open =
        lyfe.querySelector(
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


  /* =========================================
     NORMAL PROFILE
     ========================================= */

  function restoreNormalProfile() {

    const screen =
      profileScreen();


    screen
      ?.classList
      .remove(
        "mana-v968-step1"
      );


    document
      .getElementById(
        "manaV968Step1Hero"
      )
      ?.remove();


    document
      .getElementById(
        "manaV968Validation"
      )
      ?.remove();


    document
      .querySelectorAll(
        ".mana-profile-field." +
        "mana-v968-missing"
      )
      .forEach(
        field => {

          field.classList
            .remove(
              "mana-v968-missing"
            );

        }
      );


    const save =
      document.getElementById(
        "manaProfileSave"
      );


    if (save) {

      save.textContent =
        "SAVE PROFILE";

    }
  }


  /* =========================================
     STEP 1
     ========================================= */

  function decorateStep1() {

    const screen =
      profileScreen();


    const shell =
      screen
        ?.querySelector(
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
          class="mana-v968-brand-row"
        >

          <div
            class="mana-v968-mark"
          >
            M
          </div>


          <div>

            <div
              class="mana-v968-brand-title"
            >
              MANA MOVEMENT
            </div>


            <div
              class="mana-v968-brand-kicker"
            >
              TRAINING • MOVE WITH PURPOSE
            </div>

          </div>

        </div>


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
          experience, training setup and
          Fuel needs. This information
          shapes your experience inside Mana.
        </p>

      `;


      shell.prepend(
        hero
      );
    }


    let validation =
      document.getElementById(
        "manaV968Validation"
      );


    if (!validation) {

      validation =
        document.createElement(
          "div"
        );


      validation.id =
        "manaV968Validation";


      validation.className =
        "mana-v968-validation";


      document
        .getElementById(
          "manaProfileSave"
        )
        ?.insertAdjacentElement(
          "beforebegin",
          validation
        );
    }


    const save =
      document.getElementById(
        "manaProfileSave"
      );


    if (save) {

      save.textContent =
        "SAVE PROFILE & CONTINUE →";

    }


    screen.scrollTop =
      0;
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
      240
    ].forEach(
      delay => {

        setTimeout(
          decorateStep1,
          delay
        );

      }
    );
  }


  /* =========================================
     VALIDATION
     ========================================= */

  function clearValidation() {

    document
      .querySelectorAll(
        ".mana-profile-field." +
        "mana-v968-missing"
      )
      .forEach(
        field => {

          field.classList
            .remove(
              "mana-v968-missing"
            );

        }
      );


    document
      .getElementById(
        "manaV968Validation"
      )
      ?.classList
      .remove(
        "show"
      );
  }


  function showMissing(
    missing
  ) {

    clearValidation();


    missing
      .forEach(
        item => {

          document
            .getElementById(
              item.id
            )
            ?.closest(
              ".mana-profile-field"
            )
            ?.classList
            .add(
              "mana-v968-missing"
            );

        }
      );


    const box =
      document.getElementById(
        "manaV968Validation"
      );


    if (box) {

      box.textContent =
        "Please complete: " +
        missing
          .map(
            item =>
              item.label
          )
          .join(", ") +
        ".";


      box.classList.add(
        "show"
      );

    }


    const first =
      document.getElementById(
        missing[0]?.id
      );


    if (first) {

      first.scrollIntoView({
        behavior:
          "smooth",

        block:
          "center"
      });


      setTimeout(
        () => {

          first.focus();

        },
        400
      );
    }
  }


  function interceptStep1Save(
    event
  ) {

    if (
      !event.target.closest(
        "#manaProfileSave"
      ) ||
      !onboardingActive() ||
      !profileScreen()
        ?.classList
        .contains(
          "mana-v968-step1"
        )
    ) {

      return;

    }


    const missing =
      missingFields();


    if (
      !missing.length
    ) {

      clearValidation();

      return;

    }


    event.preventDefault();

    event.stopPropagation();

    event.stopImmediatePropagation();


    showMissing(
      missing
    );
  }


  /* =========================================
     STEP 2 — CLEAN HOME
     ========================================= */

  function showStep2() {

    profileScreen()
      ?.classList
      .remove(
        "open"
      );


    document.body.style.overflow =
      "";


    cleanHome();


    window.scrollTo({
      top:0,
      behavior:"instant"
    });
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
        "Choose how much coaching, structure and support you want.";

    }
  }


  /* =========================================
     FINISH SETUP
     ========================================= */

  function finishOnboarding() {

    localStorage.setItem(
      COMPLETE_KEY,
      "1"
    );


    localStorage.removeItem(
      ACTIVE_KEY
    );


    restoreNormalProfile();

    cleanHome();
  }


  /* =========================================
     PROFILE BOTTOM TAB
     ========================================= */

  function handleProfileNav(
    event
  ) {

    if (
      !event.target.closest(
        "#manaV80ProfileBtn"
      )
    ) {

      return;

    }


    /*
      During first setup, Profile means
      go back to Step 1.

      After onboarding, the existing
      Profile handler remains normal.
    */

    if (
      onboardingActive()
    ) {

      setTimeout(
        decorateStep1,
        20
      );


      setTimeout(
        decorateStep1,
        120
      );

    } else {

      setTimeout(
        restoreNormalProfile,
        20
      );

    }
  }


  /* =========================================
     INTRO
     ========================================= */

  function handleIntroEnter(
    event
  ) {

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
      100
    );
  }


  /* =========================================
     PROFILE SAVED
     ========================================= */

  function handleProfileSaved() {

    if (
      !onboardingActive()
    ) {

      return;

    }


    if (
      !savedProfileComplete()
    ) {

      return;

    }


    setTimeout(
      showStep2,
      140
    );
  }


  /* =========================================
     PROGRAM SELECTION
     ========================================= */

  function handleProgramChoice(
    event
  ) {

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

    }

    /*
      Mana Strength continues to v9.8
      Step 3 automatically.
    */
  }


  function handleMembershipChoice() {

    if (
      onboardingActive()
    ) {

      finishOnboarding();

    }
  }


  /* =========================================
     STARTUP / PHONE RECOVERY
     ========================================= */

  function startup() {

    cleanHome();

    decorateStep3();


    if (
      onboardingComplete()
    ) {

      restoreNormalProfile();

      return;

    }


    if (
      !clientIsLoggedIn()
    ) {

      return;

    }


    if (
      introOpen()
    ) {

      return;

    }


    /*
      New user/device:
      show Step 1 first.

      Even if old profile data exists,
      this version of the onboarding
      should be seen once.
    */

    if (
      !onboardingActive()
    ) {

      openStep1();

      return;

    }


    if (
      savedProfileComplete()
    ) {

      showStep2();

    } else {

      openStep1();

    }
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    cleanHome();


    document.addEventListener(
      "click",
      interceptStep1Save,
      true
    );


    document.addEventListener(
      "click",
      handleIntroEnter,
      true
    );


    document.addEventListener(
      "click",
      handleProfileNav,
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
      handleMembershipChoice
    );


    [
      350,
      800,
      1500
    ].forEach(
      delay => {

        setTimeout(
          () => {

            cleanHome();

            decorateStep3();

          },
          delay
        );

      }
    );


    setTimeout(
      startup,
      1900
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


    console.log(
      "[Mana v9.68.3] clean entry flow ready"
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
