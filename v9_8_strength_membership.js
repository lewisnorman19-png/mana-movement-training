/* =========================================
   MANA MOVEMENT TRAINING v9.8.1
   MANA STRENGTH — MEMBERSHIP GATE

   HOME
     ↓
   MANA STRENGTH
     ↓
   CHOOSE MEMBERSHIP
     ↓
   STRENGTH APP

   ========================================= */

(() => {
  "use strict";


  const SCREEN_ID =
    "manaV98Membership";

  const STYLE_ID =
    "mana-v981-membership-style";

  const PLAN_KEY =
    "mana-strength-membership";

  const CURRENT_PROGRAM_KEY =
    "mana-current-program";

  const PLAN_BAR_ID =
    "manaV98PlanBar";


  const PLANS = {

    self:{
      id:"self",
      title:"Self-Guided",
      price:"$39.99",
      description:
        "Train with structure, track your workouts and manage your own progress.",

      features:[
        "Personalised strength program",
        "Workout logging",
        "Progress tracking",
        "Personalised Fuel targets",
        "Mana meal selections"
      ],

      button:
        "CHOOSE SELF-GUIDED →"
    },


    support:{
      id:"support",
      title:"Coach Support",
      price:"$79.99",
      description:
        "Your personalised program with regular coach support inside Mana.",

      features:[
        "Everything in Self-Guided",
        "Coach chat",
        "Weekly coach check-in",
        "Coach feedback",
        "Monthly program review",
        "Program adjustments"
      ],

      button:
        "CHOOSE COACH SUPPORT →",

      featured:true
    },


    coaching:{
      id:"coaching",
      title:"Personal Coaching",
      price:"$149.99",
      description:
        "Higher-touch coaching, accountability and personalised support.",

      features:[
        "Everything in Coach Support",
        "Fortnightly video check-in",
        "Weekly coaching support",
        "Personal coach feedback",
        "Priority program adjustments"
      ],

      button:
        "CHOOSE PERSONAL COACHING →"
    }

  };


  /* =========================================
     HELPERS
     ========================================= */

  function esc(value) {
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


  function getPlan() {
    try {

      const value =
        localStorage.getItem(
          PLAN_KEY
        );


      return (
        PLANS[value]
          ? value
          : ""
      );

    } catch (_) {

      return "";
    }
  }


  function savePlan(
    plan
  ) {
    try {

      localStorage.setItem(
        PLAN_KEY,
        plan
      );


      localStorage.setItem(
        CURRENT_PROGRAM_KEY,
        "strength"
      );

    } catch (_) {}


    window.dispatchEvent(
      new CustomEvent(
        "mana:strength-membership-change",
        {
          detail:{
            plan
          }
        }
      )
    );
  }


  function strengthOverviewOpen() {
    const shell =
      document.getElementById(
        "manaV83ProgramShell"
      );


    const title =
      document.getElementById(
        "manaV83Title"
      );


    const active =
      document.querySelector(
        "#manaV83Tabs .mana-v83-tab.active"
      );


    return Boolean(

      shell
        ?.classList
        .contains("open") &&

      title
        ?.textContent
        .trim()
        .toUpperCase() ===
        "MANA STRENGTH" &&

      active
        ?.dataset
        ?.v83Tab ===
        "overview"

    );
  }


  /* =========================================
     STYLES
     ========================================= */

  function injectStyles() {
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

      #${SCREEN_ID}{
        position:fixed;
        inset:0;
        z-index:60000;

        display:none;

        overflow:auto;

        padding:
          calc(
            env(
              safe-area-inset-top
            ) + 20px
          )
          14px
          calc(
            env(
              safe-area-inset-bottom
            ) + 30px
          );

        background:
          radial-gradient(
            circle at top,
            #211b08 0%,
            #090909 38%,
            #050505 75%
          );

        color:#fff;
      }


      #${SCREEN_ID}.open{
        display:block;
      }


      .mana-v981-wrap{
        width:min(
          1000px,
          100%
        );

        margin:auto;
      }


      .mana-v981-header{
        display:flex;
        align-items:flex-start;
        gap:14px;

        margin-bottom:28px;
      }


      .mana-v981-mark{
        width:58px;
        height:58px;

        flex:
          0
          0
          58px;

        display:grid;
        place-items:center;

        border:
          2px solid
          #d4af37;

        color:#f3d875;

        font:
          700
          38px
          Georgia,
          serif;
      }


      .mana-v981-header-copy{
        flex:1;
      }


      .mana-v981-kicker{
        color:#f3d875;

        font-size:10px;
        font-weight:900;

        letter-spacing:.14em;
      }


      .mana-v981-header h1{
        margin:
          6px
          0
          9px;

        font-size:
          clamp(
            34px,
            7vw,
            52px
          );

        line-height:1;
      }


      .mana-v981-header p{
        margin:0;

        max-width:620px;

        color:#aaa;

        font-size:14px;

        line-height:1.55;
      }


      .mana-v981-close{
        width:44px;
        height:44px;

        flex:
          0
          0
          44px;

        border:
          1px solid
          #333;

        border-radius:50%;

        background:#111;

        color:#fff;

        font-size:22px;
      }


      /* PLANS */

      .mana-v981-plans{
        display:grid;

        grid-template-columns:
          repeat(
            3,
            minmax(
              0,
              1fr
            )
          );

        gap:16px;
      }


      .mana-v981-plan{
        position:relative;

        display:flex;
        flex-direction:column;

        min-height:500px;

        padding:24px;

        border:
          1px solid
          #323232;

        border-radius:24px;

        background:
          linear-gradient(
            145deg,
            #121212,
            #080808
          );
      }


      .mana-v981-plan.featured{
        border:
          2px solid
          #d4af37;

        background:
          linear-gradient(
            145deg,
            #221c08,
            #090909 55%
          );
      }


      .mana-v981-popular{
        position:absolute;

        top:14px;
        right:14px;

        padding:
          6px
          9px;

        border-radius:999px;

        background:#f3d875;

        color:#111;

        font-size:8px;
        font-weight:900;
      }


      .mana-v981-plan-label{
        color:#f3d875;

        font-size:10px;
        font-weight:900;

        letter-spacing:.1em;
      }


      .mana-v981-plan h2{
        margin:
          7px
          0
          0;

        font-size:28px;
      }


      .mana-v981-price{
        margin-top:15px;
      }


      .mana-v981-price strong{
        color:#f3d875;

        font-size:34px;
      }


      .mana-v981-price span{
        margin-left:5px;

        color:#777;

        font-size:11px;
      }


      .mana-v981-description{
        margin-top:12px;

        min-height:62px;

        color:#999;

        font-size:12px;

        line-height:1.5;
      }


      .mana-v981-features{
        display:grid;
        gap:10px;

        margin:
          18px
          0
          24px;
      }


      .mana-v981-feature{
        display:grid;

        grid-template-columns:
          18px
          minmax(
            0,
            1fr
          );

        gap:7px;

        color:#bbb;

        font-size:11px;

        line-height:1.4;
      }


      .mana-v981-feature-check{
        color:#f3d875;

        font-weight:900;
      }


      .mana-v981-button{
        width:100%;
        min-height:52px;

        margin-top:auto;

        border:
          1px solid
          #66551e;

        border-radius:15px;

        background:#161309;

        color:#f3d875;

        font-size:11px;
        font-weight:900;
      }


      .mana-v981-plan.featured
      .mana-v981-button{
        border:0;

        background:#f3d875;

        color:#111;
      }


      .mana-v981-current{
        margin-top:9px;

        text-align:center;

        color:#8fd39c;

        font-size:9px;

        font-weight:900;
      }


      .mana-v981-note{
        max-width:650px;

        margin:
          24px
          auto
          0;

        text-align:center;

        color:#666;

        font-size:10px;

        line-height:1.5;
      }


      /* OVERVIEW PLAN BAR */

      #${PLAN_BAR_ID}{
        margin-bottom:14px;

        padding:
          12px
          14px;

        display:flex;

        justify-content:
          space-between;

        align-items:center;

        gap:12px;

        border:
          1px solid
          #463c1b;

        border-radius:15px;

        background:#0d0c08;
      }


      .mana-v981-planbar small{
        display:block;

        color:#777;

        font-size:8px;
        font-weight:900;

        letter-spacing:.08em;
      }


      .mana-v981-planbar strong{
        display:block;

        margin-top:4px;

        color:#f3d875;

        font-size:12px;
      }


      .mana-v981-change{
        min-height:34px;

        padding:
          0
          11px;

        border:
          1px solid
          #4d421d;

        border-radius:999px;

        background:#111;

        color:#f3d875;

        font-size:9px;
        font-weight:900;
      }


      @media(
        max-width:760px
      ){

        .mana-v981-plans{
          grid-template-columns:
            1fr;
        }


        .mana-v981-plan{
          min-height:0;
        }


        .mana-v981-description{
          min-height:0;
        }

      }


      @media(
        max-width:430px
      ){

        #${SCREEN_ID}{
          padding-left:9px;
          padding-right:9px;
        }


        .mana-v981-header{
          gap:10px;
        }


        .mana-v981-mark{
          width:48px;
          height:48px;

          flex-basis:48px;

          font-size:30px;
        }


        .mana-v981-header h1{
          font-size:31px;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     PLAN HTML
     ========================================= */

  function planHTML(
    plan
  ) {
    const current =
      getPlan() ===
      plan.id;


    return `

      <div
        class="
          mana-v981-plan
          ${
            plan.featured
              ? "featured"
              : ""
          }
        "
      >

        ${
          plan.featured
            ? `
              <div
                class="mana-v981-popular"
              >
                MOST POPULAR
              </div>
            `
            : ""
        }


        <div
          class="mana-v981-plan-label"
        >
          MANA STRENGTH
        </div>


        <h2>
          ${esc(
            plan.title
          )}
        </h2>


        <div
          class="mana-v981-price"
        >

          <strong>
            ${esc(
              plan.price
            )}
          </strong>

          <span>
            AUD / month
          </span>

        </div>


        <div
          class="mana-v981-description"
        >
          ${esc(
            plan.description
          )}
        </div>


        <div
          class="mana-v981-features"
        >

          ${plan.features
            .map(
              feature => `

                <div
                  class="mana-v981-feature"
                >

                  <span
                    class="mana-v981-feature-check"
                  >
                    ✓
                  </span>

                  <span>
                    ${esc(
                      feature
                    )}
                  </span>

                </div>

              `
            )
            .join("")}

        </div>


        <button
          type="button"
          class="mana-v981-button"
          data-plan="${esc(
            plan.id
          )}"
        >
          ${
            current
              ? "CONTINUE WITH THIS PLAN →"
              : esc(
                  plan.button
                )
          }
        </button>


        ${
          current
            ? `
              <div
                class="mana-v981-current"
              >
                ✓ CURRENT MEMBERSHIP
              </div>
            `
            : ""
        }

      </div>

    `;
  }


  /* =========================================
     SCREEN
     ========================================= */

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
        class="mana-v981-wrap"
      >

        <div
          class="mana-v981-header"
        >

          <div
            class="mana-v981-mark"
          >
            M
          </div>


          <div
            class="mana-v981-header-copy"
          >

            <div
              class="mana-v981-kicker"
            >
              MANA STRENGTH
            </div>


            <h1>
              Choose your level
            </h1>


            <p>
              Choose how much coaching
              and support you want with
              your Mana Strength program.
            </p>

          </div>


          <button
            type="button"
            class="mana-v981-close"
            id="manaV98Close"
          >
            ×
          </button>

        </div>


        <div
          class="mana-v981-plans"
          id="manaV98Plans"
        ></div>


        <div
          class="mana-v981-note"
        >
          Payment processing will be
          connected before memberships
          are made available publicly.
        </div>

      </div>

    `;


    document.body
      .appendChild(
        screen
      );


    document
      .getElementById(
        "manaV98Close"
      )
      .onclick =
        closeMembership;


    renderPlans();
  }


  function renderPlans() {
    const holder =
      document.getElementById(
        "manaV98Plans"
      );


    if (!holder) {
      return;
    }


    holder.innerHTML =
      Object
        .values(
          PLANS
        )
        .map(
          planHTML
        )
        .join("");


    holder
      .querySelectorAll(
        "[data-plan]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              choosePlan(
                button.dataset.plan
              );

            };

        }
      );
  }


  function openMembership() {
    ensureScreen();

    renderPlans();


    document
      .getElementById(
        SCREEN_ID
      )
      .classList
      .add(
        "open"
      );


    document.body.style.overflow =
      "hidden";


    window.scrollTo({
      top:0,
      behavior:"instant"
    });
  }


  function closeMembership() {
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


  /* =========================================
     OPEN STRENGTH
     ========================================= */

  function openStrength() {
    closeMembership();


    try {

      localStorage.setItem(
        CURRENT_PROGRAM_KEY,
        "strength"
      );

    } catch (_) {}


    if (
      typeof
        window
          .openManaProgram ===
      "function"
    ) {

      window
        .openManaProgram(
          "strength"
        );

    }


    setTimeout(
      applyOverview,
      120
    );


    setTimeout(
      applyOverview,
      450
    );
  }


  function choosePlan(
    plan
  ) {
    if (
      !PLANS[plan]
    ) {
      return;
    }


    savePlan(
      plan
    );


    openStrength();
  }


  /* =========================================
     HARD INTERCEPT
     ========================================= */

  function installStrengthIntercept() {

    document.addEventListener(
      "click",
      event => {

        const card =
          event.target
            ?.closest(
              "#manaV80Strength"
            );


        if (!card) {
          return;
        }


        /*
          Stop Home's original onclick
          BEFORE it gets a chance to run.
        */

        event.preventDefault();

        event.stopPropagation();

        event.stopImmediatePropagation();


        openMembership();

      },
      true
    );
  }


  /* =========================================
     OVERVIEW
     ========================================= */

  function hideOldMembershipSection() {
    document
      .querySelectorAll(
        ".mana-v866-section"
      )
      .forEach(
        section => {

          const title =
            section
              .querySelector(
                ".mana-v866-section-head h3"
              )
              ?.textContent
              ?.trim();


          if (
            title ===
            "Mana Strength Membership"
          ) {

            section.style.display =
              "none";

          }

        }
      );
  }


  function applyCoachVisibility() {
    const plan =
      getPlan();


    const coach =
      document.querySelector(
        ".mana-v866-coach"
      );


    if (!coach) {
      return;
    }


    coach.style.display =
      plan === "self"
        ? "none"
        : "";
  }


  function insertPlanBar() {
    if (
      !strengthOverviewOpen()
    ) {
      return;
    }


    const planId =
      getPlan();


    const plan =
      PLANS[planId];


    if (!plan) {
      return;
    }


    const holder =
      document.getElementById(
        "manaV83Content"
      );


    if (!holder) {
      return;
    }


    let bar =
      document.getElementById(
        PLAN_BAR_ID
      );


    if (!bar) {

      bar =
        document.createElement(
          "div"
        );


      bar.id =
        PLAN_BAR_ID;


      holder.prepend(
        bar
      );

    }


    bar.innerHTML = `

      <div
        class="mana-v981-planbar"
      >

        <small>
          YOUR MEMBERSHIP
        </small>

        <strong>
          ${esc(
            plan.title
          )}
          •
          ${esc(
            plan.price
          )}
          / month
        </strong>

      </div>


      <button
        type="button"
        class="mana-v981-change"
        id="manaV98ChangePlan"
      >
        CHANGE
      </button>

    `;


    document
      .getElementById(
        "manaV98ChangePlan"
      )
      .onclick =
        openMembership;
  }


  function applyOverview() {
    if (
      !strengthOverviewOpen()
    ) {
      return;
    }


    hideOldMembershipSection();

    applyCoachVisibility();

    insertPlanBar();
  }


  /* =========================================
     WATCH
     ========================================= */

  function watch() {
    window.addEventListener(
      "mana:program-tab-change",
      () => {

        setTimeout(
          applyOverview,
          100
        );

      }
    );


    window.addEventListener(
      "mana:strength-membership-change",
      () => {

        setTimeout(
          applyOverview,
          100
        );

      }
    );


    window.addEventListener(
      "focus",
      () => {

        setTimeout(
          applyOverview,
          100
        );

      }
    );


    let timer =
      null;


    const observer =
      new MutationObserver(
        () => {

          clearTimeout(
            timer
          );


          timer =
            setTimeout(
              applyOverview,
              100
            );

        }
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
    injectStyles();

    ensureScreen();

    installStrengthIntercept();

    watch();


    [
      500,
      1000,
      1800
    ].forEach(
      delay => {

        setTimeout(
          applyOverview,
          delay
        );

      }
    );
  }


  /* =========================================
     PUBLIC
     ========================================= */

  window.openManaStrengthMembership =
    openMembership;


  window.getManaStrengthMembership =
    getPlan;


  if (
    document.readyState ===
      "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {

    init();
  }

})();
