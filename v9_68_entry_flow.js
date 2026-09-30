/* =========================================
   MANA MOVEMENT TRAINING v9.68.0
   GUIDED ENTRY FLOW

   LOGIN
     ↓
   INTRO
     ↓
   STEP 1 — COMPLETE PROFILE
     ↓
   STEP 2 — CHOOSE YOUR PATH
     ↓
   STEP 3 — CHOOSE PLAN / ENTRY LEVEL

   - USES EXISTING MASTER PROFILE
   - DOES NOT REBUILD PROFILE LOGIC
   - CLEANER HOME
   - MANA LYFE LABEL
   ========================================= */

(() => {
  "use strict";

  const BUILD = "96800";

  const SCREEN_ID =
    "manaV968Onboarding";

  const STYLE_ID =
    "mana-v968-entry-style";

  const PROFILE_KEY =
    "mana-profile-v67";

  const COMPLETE_KEY =
    "mana-onboarding-profile-complete-v968";


  function safeJson(raw, fallback) {
    try {
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }


  function profile() {
    return safeJson(
      localStorage.getItem(
        PROFILE_KEY
      ) || "{}",
      {}
    );
  }


  function profileComplete() {

    const p =
      profile();


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


  function markComplete() {

    localStorage.setItem(
      COMPLETE_KEY,
      "1"
    );
  }


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
         STEP 1 SCREEN
         ===================================== */

      #${SCREEN_ID}{
        position:fixed;
        inset:0;
        z-index:49500;

        display:none;

        overflow:auto;

        padding:
          calc(env(safe-area-inset-top) + 24px)
          18px
          calc(env(safe-area-inset-bottom) + 40px);

        background:
          radial-gradient(
            circle at top right,
            rgba(243,216,117,.07),
            transparent 30%
          ),
          #050505;

        color:#fff;
      }

      #${SCREEN_ID}.open{
        display:block;
      }

      .mana-v968-wrap{
        width:min(620px,100%);
        margin:auto;
      }

      .mana-v968-brand{
        display:flex;
        align-items:center;
        gap:14px;
        margin-bottom:34px;
      }

      .mana-v968-mark{
        width:56px;
        height:56px;

        display:grid;
        place-items:center;

        flex:0 0 56px;

        border:2px solid #d4af37;

        color:#f3d875;

        font:
          700
          36px
          Georgia,
          serif;
      }

      .mana-v968-brand-copy strong{
        display:block;

        font-size:16px;
        letter-spacing:.18em;
      }

      .mana-v968-brand-copy span{
        display:block;

        margin-top:5px;

        color:#c9ad50;

        font-size:10px;
        font-weight:900;
        letter-spacing:.18em;
      }

      .mana-v968-step{
        color:#f3d875;

        font-size:12px;
        font-weight:950;
        letter-spacing:.17em;
      }

      .mana-v968-title{
        margin:11px 0 12px;

        font-size:
          clamp(
            38px,
            8vw,
            58px
          );

        line-height:.96;
      }

      .mana-v968-lead{
        max-width:540px;

        margin:0 0 28px;

        color:#aaa;

        font-size:16px;
        line-height:1.6;
      }

      /* BIG PROFILE TAB */

      .mana-v968-profile-card{
        position:relative;

        width:100%;

        overflow:hidden;

        padding:28px;

        border:1px solid #756326;
        border-radius:28px;

        background:
          linear-gradient(
            145deg,
            #201c0e,
            #11100b 50%,
            #090909
          );

        box-shadow:
          0 18px 50px rgba(0,0,0,.3);
      }

      .mana-v968-profile-card::before{
        content:"";

        position:absolute;

        top:0;
        left:26px;
        right:26px;

        height:3px;

        background:
          linear-gradient(
            90deg,
            transparent,
            #f3d875,
            transparent
          );
      }

      .mana-v968-profile-label{
        color:#f3d875;

        font-size:11px;
        font-weight:950;
        letter-spacing:.15em;
      }

      .mana-v968-profile-card h2{
        margin:10px 0 10px;

        font-size:30px;
        line-height:1.05;
      }

      .mana-v968-profile-card p{
        margin:0;

        color:#b5b5b5;

        font-size:15px;
        line-height:1.55;
      }

      .mana-v968-profile-btn{
        width:100%;

        min-height:62px;

        margin-top:24px;

        border:0;
        border-radius:17px;

        background:
          linear-gradient(
            135deg,
            #f3d875,
            #bd902b
          );

        color:#0b0b0b;

        font-size:15px;
        font-weight:950;

        cursor:pointer;
      }

      /* PROFILE SUMMARY BEHIND CARD */

      .mana-v968-summary{
        margin-top:17px;

        display:grid;

        grid-template-columns:
          repeat(
            2,
            minmax(0,1fr)
          );

        gap:10px;
      }

      .mana-v968-summary-item{
        padding:14px;

        border:1px solid #2c2a21;
        border-radius:16px;

        background:#0c0c0b;
      }

      .mana-v968-summary-item span{
        display:block;

        color:#777;

        font-size:10px;
        font-weight:900;
        letter-spacing:.1em;
        text-transform:uppercase;
      }

      .mana-v968-summary-item strong{
        display:block;

        margin-top:6px;

        color:#eee;

        font-size:14px;
      }

      .mana-v968-complete{
        display:none;

        margin-top:18px;
        padding:17px;

        border:1px solid #60531f;
        border-radius:18px;

        background:#15130b;

        color:#d9c26d;

        font-size:14px;
        line-height:1.5;
      }

      .mana-v968-complete.show{
        display:block;
      }

      .mana-v968-continue{
        display:none;

        width:100%;

        min-height:60px;

        margin-top:18px;

        border:1px solid #665724;
        border-radius:18px;

        background:#11100c;

        color:#f3d875;

        font-size:14px;
        font-weight:950;

        cursor:pointer;
      }

      .mana-v968-continue.show{
        display:block;
      }


      /* =====================================
         HOME — STEP 2
         ===================================== */

      #manaV80Home
      #manaV80ProfileSetup,

      #manaV80Home
      .mana-v8013-select{
        display:none !important;
      }

      .mana-v968-step2{
        margin:
          26px
          0
          18px;

        padding:
          20px
          21px;

        border:
          1px solid
          #55481d;

        border-radius:
          22px;

        background:
          linear-gradient(
            145deg,
            #18150c,
            #0a0a09
          );
      }

      .mana-v968-step2-kicker{
        color:#f3d875;

        font-size:11px;
        font-weight:950;
        letter-spacing:.15em;
      }

      .mana-v968-step2 h2{
        margin:
          7px
          0
          7px;

        color:#fff;

        font-size:26px;
      }

      .mana-v968-step2 p{
        margin:0;

        color:#999;

        font-size:14px;
        line-height:1.5;
      }


      /* =====================================
         STEP 3 — STRENGTH PLAN
         ===================================== */

      #manaV98Membership
      .mana-v981-kicker{
        font-size:11px !important;
        letter-spacing:.15em !important;
      }


      @media(max-width:600px){

        .mana-v968-profile-card{
          padding:23px 20px;
        }

        .mana-v968-summary{
          grid-template-columns:1fr;
        }

        .mana-v968-title{
          font-size:40px;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  function ensureScreen() {

    if (
      document.getElementById(
        SCREEN_ID
      )
    ) {
      return;
    }


    const screen =
      document.createElement(
        "div"
      );


    screen.id =
      SCREEN_ID;


    screen.innerHTML = `

      <div
        class="mana-v968-wrap"
      >

        <div
          class="mana-v968-brand"
        >

          <div
            class="mana-v968-mark"
          >
            M
          </div>

          <div
            class="mana-v968-brand-copy"
          >
            <strong>
              MANA MOVEMENT
            </strong>

            <span>
              MOVE WITH PURPOSE
            </span>
          </div>

        </div>


        <div
          class="mana-v968-step"
        >
          STEP 1 • PROFILE & GOALS
        </div>


        <h1
          class="mana-v968-title"
        >
          Tell Mana
          about you.
        </h1>


        <p
          class="mana-v968-lead"
        >
          Your goals, experience and training
          setup shape the experience that comes
          next.
        </p>


        <div
          class="mana-v968-profile-card"
        >

          <div
            class="mana-v968-profile-label"
          >
            YOUR FOUNDATION
          </div>


          <h2>
            Complete your profile
          </h2>


          <p>
            Set your training goal, experience,
            equipment, weekly schedule and Fuel
            information.
          </p>


          <button
            type="button"
            class="mana-v968-profile-btn"
            id="manaV968Profile"
          >
            COMPLETE PROFILE →
          </button>


          <div
            class="mana-v968-summary"
            id="manaV968Summary"
          ></div>

        </div>


        <div
          class="mana-v968-complete"
          id="manaV968Complete"
        >
          Profile complete ✓
          <br>
          Mana now has the information it needs
          to personalise your experience.
        </div>


        <button
          type="button"
          class="mana-v968-continue"
          id="manaV968Continue"
        >
          CONTINUE TO STEP 2 →
        </button>

      </div>

    `;


    document.body
      .appendChild(
        screen
      );


    document
      .getElementById(
        "manaV968Profile"
      )
      .onclick =
        () => {

          if (
            typeof
              window
                .openManaProfile ===
            "function"
          ) {

            window
              .openManaProfile();

          }

        };


    document
      .getElementById(
        "manaV968Continue"
      )
      .onclick =
        () => {

          markComplete();

          closeOnboarding();

          decorateHome();

        };
  }


  function updateScreen() {

    ensureScreen();


    const p =
      profile();


    const ready =
      profileComplete();


    const summary =
      document.getElementById(
        "manaV968Summary"
      );


    if (summary) {

      summary.innerHTML = `

        <div
          class="mana-v968-summary-item"
        >
          <span>GOAL</span>
          <strong>
            ${p.goal || "Not set"}
          </strong>
        </div>


        <div
          class="mana-v968-summary-item"
        >
          <span>EXPERIENCE</span>
          <strong>
            ${p.experience || "Not set"}
          </strong>
        </div>


        <div
          class="mana-v968-summary-item"
        >
          <span>TRAINING</span>
          <strong>
            ${
              p.days
                ? `${p.days} days / week`
                : "Not set"
            }
          </strong>
        </div>


        <div
          class="mana-v968-summary-item"
        >
          <span>SETUP</span>
          <strong>
            ${p.equipment || "Not set"}
          </strong>
        </div>

      `;

    }


    const profileBtn =
      document.getElementById(
        "manaV968Profile"
      );


    if (profileBtn) {

      profileBtn.textContent =
        ready
          ? "REVIEW PROFILE →"
          : "COMPLETE PROFILE →";

    }


    document
      .getElementById(
        "manaV968Complete"
      )
      ?.classList
      .toggle(
        "show",
        ready
      );


    document
      .getElementById(
        "manaV968Continue"
      )
      ?.classList
      .toggle(
        "show",
        ready
      );
  }


  function openOnboarding() {

    if (
      onboardingComplete()
    ) {

      decorateHome();

      return;
    }


    ensureScreen();

    updateScreen();


    document
      .getElementById(
        SCREEN_ID
      )
      ?.classList
      .add(
        "open"
      );


    document.body.style.overflow =
      "hidden";
  }


  function closeOnboarding() {

    document
      .getElementById(
        SCREEN_ID
      )
      ?.classList
      .remove(
        "open"
      );


    document.body.style.overflow =
      "";
  }


  function decorateHome() {

    const home =
      document.getElementById(
        "manaV80Home"
      );


    const firstProgram =
      document.getElementById(
        "manaV80Mana28"
      );


    if (
      !home ||
      !firstProgram
    ) {
      return;
    }


    let header =
      document.getElementById(
        "manaV968Step2"
      );


    if (!header) {

      header =
        document.createElement(
          "div"
        );


      header.id =
        "manaV968Step2";


      header.className =
        "mana-v968-step2";


      header.innerHTML = `

        <div
          class="mana-v968-step2-kicker"
        >
          STEP 2 • CHOOSE YOUR PATH
        </div>

        <h2>
          What do you want to work on?
        </h2>

        <p>
          Choose the Mana experience that
          matches where you are right now.
        </p>

      `;


      firstProgram
        .insertAdjacentElement(
          "beforebegin",
          header
        );
    }


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


    decorateStep3();
  }


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
        "STEP 3 • MANA STRENGTH";

    }


    if (title) {

      title.textContent =
        "Choose your plan";

    }


    if (text) {

      text.textContent =
        "Choose the level of structure, coaching and support that fits you.";

    }
  }


  function handleProfileSaved() {

    const onboarding =
      document.getElementById(
        SCREEN_ID
      );


    if (
      !onboarding
        ?.classList
        .contains(
          "open"
        )
    ) {

      decorateHome();

      return;
    }


    if (
      profileComplete()
    ) {

      /*
        Close the underlying Profile screen
        and return to Step 1 confirmation.
      */

      document
        .getElementById(
          "manaProfileScreen"
        )
        ?.classList
        .remove(
          "open"
        );


      updateScreen();

    }

  }


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


    setTimeout(
      openOnboarding,
      80
    );
  }


  function maybeShowExistingSession() {

    if (
      onboardingComplete()
    ) {

      decorateHome();

      return;
    }


    const auth =
      document.getElementById(
        "authView"
      );


    const client =
      document.getElementById(
        "clientView"
      );


    const loggedIn =
      Boolean(
        client &&
        !client.classList.contains(
          "hide"
        ) &&
        (
          !auth ||
          auth.classList.contains(
            "hide"
          )
        )
      );


    const introOpen =
      document
        .getElementById(
          "manaV81Intro"
        )
        ?.classList
        .contains(
          "open"
        );


    if (
      loggedIn &&
      !introOpen
    ) {

      openOnboarding();

    }

  }


  function init() {

    installStyles();

    ensureScreen();


    document.addEventListener(
      "click",
      handleIntroEnter,
      true
    );


    window.addEventListener(
      "mana:profile-synced",
      handleProfileSaved
    );


    [
      500,
      1200,
      2200
    ].forEach(
      delay => {

        setTimeout(
          () => {

            decorateHome();

            decorateStep3();

          },
          delay
        );

      }
    );


    setTimeout(
      maybeShowExistingSession,
      1800
    );


    window
      .MANA_ENTRY_FLOW_BUILD =
      BUILD;


    window
      .openManaProfileOnboarding =
      openOnboarding;


    window
      .refreshManaEntryFlow =
      () => {

        updateScreen();

        decorateHome();

        decorateStep3();

      };
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
