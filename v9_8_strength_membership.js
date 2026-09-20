/* =========================================
   MANA MOVEMENT TRAINING v9.8.0
   MANA STRENGTH — MEMBERSHIP GATE

   FIRST ENTRY:
   HOME → MEMBERSHIP → STRENGTH

   RETURNING MEMBER:
   HOME → STRENGTH

   ALSO:
   - SAVES SELECTED PLAN
   - HIDES OLD OVERVIEW PRICING
   - PLAN-SPECIFIC COACH FEATURES
   - CHANGE PLAN FROM OVERVIEW
   ========================================= */

(() => {
  "use strict";


  const SCREEN_ID =
    "manaV98Membership";

  const STYLE_ID =
    "mana-v980-membership-style";

  const PLAN_KEY =
    "mana-strength-membership";

  const CURRENT_PROGRAM_KEY =
    "mana-current-program";

  const PLAN_BAR_ID =
    "manaV98PlanBar";


  const PLANS = {

    self:{
      id:"self",

      kicker:
        "MANA STRENGTH",

      title:
        "Self-Guided",

      price:
        "$39.99",

      subtitle:
        "AUD / month",

      description:
        "Everything you need to train with structure and track your progress.",

      features:[
        "Personalised strength program",
        "Workout logging and progression",
        "Progress tracking",
        "Personalised Fuel targets",
        "Mana meal selections"
      ],

      button:
        "CHOOSE SELF-GUIDED →"
    },


    support:{
      id:"support",

      kicker:
        "MANA STRENGTH SUPPORT",

      title:
        "Coach Support",

      price:
        "$79.99",

      subtitle:
        "AUD / month",

      description:
        "Your personalised training plus regular access to your coach.",

      features:[
        "Everything in Self-Guided",
        "Coach chat inside Mana",
        "Weekly coach check-in",
        "Coach feedback",
        "Monthly program review",
        "Program adjustments when needed"
      ],

      button:
        "CHOOSE COACH SUPPORT →",

      featured:true
    },


    coaching:{
      id:"coaching",

      kicker:
        "MANA STRENGTH COACHING",

      title:
        "Personal Coaching",

      price:
        "$149.99",

      subtitle:
        "AUD / month",

      description:
        "Higher-touch coaching, accountability and personalised support.",

      features:[
        "Everything in Coach Support",
        "Fortnightly video check-in",
        "Weekly coach support",
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


  function getPlan() {
    try {

      const saved =
        localStorage.getItem(
          PLAN_KEY
        );


      return (
        PLANS[saved]
          ? saved
          : ""
      );

    } catch (_) {

      return "";
    }
  }


  function savePlan(
    plan
  ) {
    if (
      !PLANS[plan]
    ) {
      return;
    }


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

      /* ==========================
         MEMBERSHIP SCREEN
         ========================== */

      #${SCREEN_ID}{
        position:fixed;

        inset:0;

        z-index:36000;

        display:none;

        overflow:auto;

        background:
          radial-gradient(
            circle at top,
            #1b1708 0,
            #080808 38%,
            #050505 72%
          );

        color:#fff;

        padding:
          calc(
            env(
              safe-area-inset-top
            ) + 18px
          )
          16px
          calc(
            env(
              safe-area-inset-bottom
            ) + 30px
          );
      }


      #${SCREEN_ID}.open{
        display:block;
      }


      .mana-v980-wrap{
        width:min(
          960px,
          100%
        );

        margin:auto;
      }


      .mana-v980-top{
        display:flex;

        justify-content:
          space-between;

        align-items:flex-start;

        gap:18px;

        margin-bottom:28px;
      }


      .mana-v980-mark{
        width:58px;
        height:58px;

        display:grid;

        place-items:center;

        flex:
          0
          0
          58px;

        border:
          2px solid
          #d4af37;

        color:#f3d875;

        font:
          700
          37px
          Georgia,
          serif;
      }


      .mana-v980-heading{
        flex:1;

        min-width:0;
      }


      .mana-v980-kicker{
        color:#f3d875;

        font-size:10px;

        font-weight:900;

        letter-spacing:.14em;

        text-transform:uppercase;
      }


      .mana-v980-heading h1{
        margin:
          7px
          0
          9px;

        font-size:
          clamp(
            34px,
            7vw,
            54px
          );

        line-height:1;
      }


      .mana-v980-heading p{
        max-width:650px;

        margin:0;

        color:#aaa;

        font-size:14px;

        line-height:1.55;
      }


      .mana-v980-close{
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

        font-size:23px;

        cursor:pointer;
      }


      /* ==========================
         PLAN GRID
         ========================== */

      .mana-v980-plans{
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


      .mana-v980-plan{
        position:relative;

        display:flex;

        flex-direction:column;

        min-height:510px;

        padding:23px;

        border:
          1px solid
          #333;

        border-radius:24px;

        background:
          linear-gradient(
            145deg,
            #121212,
            #090909
          );
      }


      .mana-v980-plan.featured{
        border:
          2px solid
          #d4af37;

        background:
          linear-gradient(
            145deg,
            #211b08,
            #0a0a0a 55%
          );

        box-shadow:
          0
          15px
          45px
          rgba(
            212,
            175,
            55,
            .16
          );
      }


      .mana-v980-popular{
        position:absolute;

        top:16px;
        right:16px;

        padding:
          6px
          9px;

        border-radius:999px;

        background:#f3d875;

        color:#111;

        font-size:8px;

        font-weight:900;

        letter-spacing:.06em;
      }


      .mana-v980-plan-kicker{
        color:#f3d875;

        font-size:10px;

        font-weight:900;

        letter-spacing:.09em;
      }


      .mana-v980-plan h2{
        margin:
          8px
          0
          0;

        font-size:28px;

        line-height:1.08;
      }


      .mana-v980-price{
        margin-top:16px;
      }


      .mana-v980-price strong{
        color:#f3d875;

        font-size:34px;
      }


      .mana-v980-price span{
        margin-left:5px;

        color:#777;

        font-size:11px;
      }


      .mana-v980-description{
        min-height:64px;

        margin-top:12px;

        color:#999;

        font-size:12px;

        line-height:1.5;
      }


      .mana-v980-features{
        display:grid;

        gap:10px;

        margin:
          18px
          0
          22px;
      }


      .mana-v980-feature{
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


      .mana-v980-check{
        color:#f3d875;

        font-weight:900;
      }


      .mana-v980-select{
        width:100%;

        min-height:52px;

        margin-top:auto;

        border:
          1px solid
          #6c591f;

        border-radius:15px;

        background:#171409;

        color:#f3d875;

        font-size:12px;

        font-weight:900;

        cursor:pointer;
      }


      .mana-v980-plan.featured
      .mana-v980-select{
        border:0;

        background:#f3d875;

        color:#111;
      }


      .mana-v980-current{
        margin-top:9px;

        color:#8fd39c;

        text-align:center;

        font-size:9px;

        font-weight:900;

        letter-spacing:.05em;
      }


      .mana-v980-note{
        margin:
          22px
          auto
          0;

        max-width:650px;

        color:#666;

        text-align:center;

        font-size:10px;

        line-height:1.5;
      }


      /* ==========================
         OVERVIEW PLAN BAR
         ========================== */

      #${PLAN_BAR_ID}{
        margin:
          0
          0
          14px;

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
          #3a3219;

        border-radius:15px;

        background:#0d0c08;
      }


      .mana-v980-planbar-copy{
        min-width:0;
      }


      .mana-v980-planbar-copy small{
        display:block;

        color:#777;

        font-size:8px;

        font-weight:900;

        letter-spacing:.08em;

        text-transform:uppercase;
      }


      .mana-v980-planbar-copy strong{
        display:block;

        margin-top:3px;

        color:#f3d875;

        font-size:12px;
      }


      .mana-v980-change{
        flex:
          0
          0
          auto;

        min-height:34px;

        padding:
          0
          11px;

        border:
          1px solid
          #4e421d;

        border-radius:999px;

        background:#111;

        color:#d8c36c;

        font-size:9px;

        font-weight:900;

        cursor:pointer;
      }


      @media(
        max-width:760px
      ){

        .mana-v980-plans{
          grid-template-columns:
            1fr;
        }


        .mana-v980-plan{
          min-height:0;
        }


        .mana-v980-description{
          min-height:0;
        }

      }


      @media(
        max-width:450px
      ){

        #${SCREEN_ID}{
          padding-left:10px;
          padding-right:10px;
        }


        .mana-v980-top{
          gap:11px;
        }


        .mana-v980-mark{
          width:48px;
          height:48px;

          flex-basis:48px;

          font-size:31px;
        }


        .mana-v980-heading h1{
          font-size:32px;
        }


        .mana-v980-plan{
          padding:20px;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     MEMBERSHIP HTML
     ========================================= */

  function featureHTML(
    feature
  ) {
    return `

      <div
        class="mana-v980-feature"
      >

        <span
          class="mana-v980-check"
        >
          ✓
        </span>

        <span>
          ${esc(
            feature
          )}
        </span>

      </div>

    `;
  }


  function planHTML(
    plan
  ) {
    const selected =
      getPlan() ===
      plan.id;


    return `

      <div
        class="
          mana-v980-plan
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
                class="mana-v980-popular"
              >
                MOST POPULAR
              </div>
            `
            : ""
        }


        <div
          class="mana-v980-plan-kicker"
        >
          ${esc(
            plan.kicker
          )}
        </div>


        <h2>
          ${esc(
            plan.title
          )}
        </h2>


        <div
          class="mana-v980-price"
        >

          <strong>
            ${esc(
              plan.price
            )}
          </strong>

          <span>
            ${esc(
              plan.subtitle
            )}
          </span>

        </div>


        <div
          class="mana-v980-description"
        >
          ${esc(
            plan.description
          )}
        </div>


        <div
          class="mana-v980-features"
        >

          ${plan.features
            .map(
              featureHTML
            )
            .join("")}

        </div>


        <button
          type="button"
          class="mana-v980-select"
          data-mana-plan="${esc(
            plan.id
          )}"
        >
          ${
            selected
              ? "CURRENT PLAN"
              : esc(
                  plan.button
                )
          }
        </button>


        ${
          selected
            ? `
              <div
                class="mana-v980-current"
              >
                ✓ YOUR CURRENT MEMBERSHIP
              </div>
            `
            : ""
        }

      </div>

    `;
  }


  /* =========================================
     BUILD SCREEN
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
        class="mana-v980-wrap"
      >

        <div
          class="mana-v980-top"
        >

          <div
            class="mana-v980-mark"
          >
            M
          </div>


          <div
            class="mana-v980-heading"
          >

            <div
              class="mana-v980-kicker"
            >
              MANA STRENGTH
            </div>


            <h1>
              Choose your level
            </h1>


            <p>
              Start with the level of
              coaching and support that
              suits you. You can change
              your membership later.
            </p>

          </div>


          <button
            type="button"
            class="mana-v980-close"
            id="manaV98Close"
          >
            ×
          </button>

        </div>


        <div
          class="mana-v980-plans"
          id="manaV98Plans"
        ></div>


        <div
          class="mana-v980-note"
        >
          Membership selection is currently
          used to personalise your Mana
          Strength experience. Payment access
          will be connected before paid
          memberships go live.
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
        "[data-mana-plan]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              choosePlan(
                button.dataset
                  .manaPlan
              );

            };

        }
      );
  }


  /* =========================================
     OPEN / CLOSE MEMBERSHIP
     ========================================= */

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
      applyMembershipToOverview,
      140
    );


    setTimeout(
      applyMembershipToOverview,
      500
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


    renderPlans();


    setTimeout(
      openStrength,
      120
    );
  }


  /* =========================================
     HOME ROUTING
     ========================================= */

  function handleStrengthEntry(
    event
  ) {
    if (event) {

      event.preventDefault();

      event.stopPropagation();

    }


    const plan =
      getPlan();


    if (plan) {

      openStrength();

    } else {

      openMembership();

    }
  }


  function wireStrengthCard() {
    const card =
      document.getElementById(
        "manaV80Strength"
      );


    if (!card) {
      return false;
    }


    if (
      card.dataset
        .membershipGate ===
      "ready"
    ) {
      return true;
    }


    /*
      Replace Home's original
      openProgram("strength") handler.
    */

    card.onclick =
      handleStrengthEntry;


    card.dataset
      .membershipGate =
        "ready";


    return true;
  }


  /* =========================================
     OVERVIEW MEMBERSHIP
     ========================================= */

  function hideOldPricing() {
    const sections =
      Array.from(
        document.querySelectorAll(
          ".mana-v866-section"
        )
      );


    sections.forEach(
      section => {

        const heading =
          section.querySelector(
            ".mana-v866-section-head h3"
          );


        if (
          heading
            ?.textContent
            ?.trim() ===
          "Mana Strength Membership"
        ) {

          section.style.display =
            "none";

        }

      }
    );
  }


  function applyCoachAccess() {
    const plan =
      getPlan();


    const coachSection =
      document.querySelector(
        ".mana-v866-coach"
      );


    if (!coachSection) {
      return;
    }


    /*
      Self-Guided:
      no coach chat/check-in area.

      Support / Coaching:
      coach features stay visible.
    */

    coachSection.style.display =
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
        class="mana-v980-planbar-copy"
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
        class="mana-v980-change"
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


  function applyMembershipToOverview() {
    if (
      !strengthOverviewOpen()
    ) {
      return;
    }


    hideOldPricing();

    applyCoachAccess();

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
          applyMembershipToOverview,
          100
        );

      }
    );


    window.addEventListener(
      "mana:strength-membership-change",
      () => {

        setTimeout(
          applyMembershipToOverview,
          100
        );

      }
    );


    window.addEventListener(
      "focus",
      () => {

        wireStrengthCard();


        setTimeout(
          applyMembershipToOverview,
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
              () => {

                wireStrengthCard();


                if (
                  strengthOverviewOpen()
                ) {

                  applyMembershipToOverview();

                }

              },
              90
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

    watch();


    [
      300,
      700,
      1300,
      2200
    ].forEach(
      delay => {

        setTimeout(
          () => {

            wireStrengthCard();

            applyMembershipToOverview();

          },
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


  window.resetManaStrengthMembership =
    () => {

      try {

        localStorage.removeItem(
          PLAN_KEY
        );

      } catch (_) {}


      openMembership();

    };


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
