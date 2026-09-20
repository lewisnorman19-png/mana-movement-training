/* =========================================
   MANA MOVEMENT TRAINING v9.13.0
   STABILITY + LOGIN BUG FIXES

   FIXES:
   - MOBILE LOGIN AUTOFILL SUPPORT
   - REMEMBER EMAIL
   - PASSWORD MANAGER INTEGRATION
   - OLD PRICING NEVER RETURNS
   - MEMBERSHIP BAR NEVER DISAPPEARS
   - CHANGE MEMBERSHIP ALWAYS AVAILABLE
   ========================================= */

(() => {
  "use strict";


  const STYLE_ID =
    "mana-v9130-bugfix-style";

  const PLAN_KEY =
    "mana-strength-membership";

  const PLAN_BAR_ID =
    "manaV98PlanBar";


  const PLANS = {

    self:{
      title:"Self-Guided",
      price:"$39.99"
    },

    support:{
      title:"Coach Support",
      price:"$79.99"
    },

    coaching:{
      title:"Personal Coaching",
      price:"$149.99"
    }

  };


  let pendingEmail =
    "";

  let pendingPassword =
    "";

  let fixingOverview =
    false;

  let observerTimer =
    null;


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

      const plan =
        localStorage.getItem(
          PLAN_KEY
        );


      return PLANS[plan]
        ? plan
        : "";

    } catch (_) {

      return "";
    }
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
        .contains(
          "open"
        ) &&

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
     LOGIN / PASSWORD MANAGER
     ========================================= */

  function configureLogin() {

    const form =
      document.getElementById(
        "loginForm"
      );


    const email =
      document.getElementById(
        "loginEmail"
      );


    const password =
      document.getElementById(
        "loginPassword"
      );


    if (form) {

      form.setAttribute(
        "autocomplete",
        "on"
      );

    }


    if (email) {

      email.setAttribute(
        "name",
        "username"
      );

      email.setAttribute(
        "type",
        "email"
      );

      email.setAttribute(
        "autocomplete",
        "username"
      );

      email.setAttribute(
        "inputmode",
        "email"
      );

      email.setAttribute(
        "autocapitalize",
        "none"
      );

      email.setAttribute(
        "autocorrect",
        "off"
      );

      email.setAttribute(
        "spellcheck",
        "false"
      );

      email.setAttribute(
        "enterkeyhint",
        "next"
      );


      try {

        const saved =
          localStorage.getItem(
            "mana:lastEmail"
          );


        if (
          saved &&
          !email.value
        ) {

          email.value =
            saved;

        }

      } catch (_) {}

    }


    if (password) {

      password.setAttribute(
        "name",
        "password"
      );

      password.setAttribute(
        "type",
        "password"
      );

      password.setAttribute(
        "autocomplete",
        "current-password"
      );

      password.setAttribute(
        "enterkeyhint",
        "go"
      );

    }
  }


  function wireLoginCapture() {

    const form =
      document.getElementById(
        "loginForm"
      );


    if (
      !form ||
      form.dataset
        .manaV913Wired ===
        "1"
    ) {
      return;
    }


    form.dataset
      .manaV913Wired =
        "1";


    form.addEventListener(
      "submit",
      () => {

        const email =
          document
            .getElementById(
              "loginEmail"
            )
            ?.value
            ?.trim() ||
          "";


        const password =
          document
            .getElementById(
              "loginPassword"
            )
            ?.value ||
          "";


        pendingEmail =
          email;

        pendingPassword =
          password;


        if (email) {

          try {

            localStorage.setItem(
              "mana:lastEmail",
              email
            );

          } catch (_) {}

        }

      },
      true
    );
  }


  async function offerCredentialSave() {

    if (
      !pendingEmail ||
      !pendingPassword
    ) {
      return;
    }


    /*
      Browser Credential Management API.

      Supported browsers can hand this
      to the operating-system password
      manager rather than Mana storing
      the password itself.
    */

    try {

      if (
        "credentials" in navigator &&
        typeof window.PasswordCredential ===
          "function"
      ) {

        const credential =
          new PasswordCredential({

            id:
              pendingEmail,

            name:
              pendingEmail,

            password:
              pendingPassword

          });


        await navigator
          .credentials
          .store(
            credential
          );

      }

    } catch (_) {}


    /*
      Do not retain password in memory
      after the login has completed.
    */

    pendingPassword =
      "";
  }


  async function watchSuccessfulLogin() {

    try {

      if (
        typeof
          window.supabaseClient !==
        "function"
      ) {
        return;
      }


      const client =
        await window
          .supabaseClient();


      client.auth
        .onAuthStateChange(
          event => {

            if (
              event ===
              "SIGNED_IN"
            ) {

              setTimeout(
                offerCredentialSave,
                250
              );

            }


            if (
              event ===
              "SIGNED_OUT"
            ) {

              pendingPassword =
                "";

            }

          }
        );

    } catch (_) {}
  }


  /* =========================================
     REMOVE OLD MEMBERSHIP PRICING
     ========================================= */

  function removeOldPricing() {

    if (
      !strengthOverviewOpen()
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


    /*
      Remove by exact old heading.
    */

    holder
      .querySelectorAll(
        ".mana-v866-section"
      )
      .forEach(
        section => {

          const heading =
            section
              .querySelector(
                ".mana-v866-section-head h3"
              )
              ?.textContent
              ?.trim()
              ?.toLowerCase() ||
            "";


          if (
            heading ===
            "mana strength membership"
          ) {

            section.remove();

          }

        }
      );


    /*
      Second safety check:
      if old pricing cards exist,
      remove their containing section.
    */

    holder
      .querySelectorAll(
        ".mana-v866-plans"
      )
      .forEach(
        plans => {

          plans
            .closest(
              ".mana-v866-section"
            )
            ?.remove();

        }
      );
  }


  /* =========================================
     MEMBERSHIP BAR
     ========================================= */

  function ensureMembershipBar() {

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


    if (
      !bar ||
      !holder.contains(
        bar
      )
    ) {

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


    const signature =
      `${planId}-${plan.price}`;


    if (
      bar.dataset
        .manaV913Signature !==
      signature
    ) {

      bar.dataset
        .manaV913Signature =
          signature;


      bar.innerHTML = `

        <div
          class="mana-v913-plan-copy"
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
          class="mana-v913-change"
          id="manaV98ChangePlan"
        >
          CHANGE
        </button>

      `;

    }


    /*
      Keep membership at very top
      even if another renderer moved it.
    */

    if (
      holder.firstElementChild !==
      bar
    ) {

      holder.prepend(
        bar
      );

    }


    const change =
      document.getElementById(
        "manaV98ChangePlan"
      );


    if (
      change &&
      change.dataset
        .manaV913Wired !==
        "1"
    ) {

      change.dataset
        .manaV913Wired =
          "1";


      change.onclick =
        () => {

          if (
            typeof
              window
                .openManaStrengthMembership ===
            "function"
          ) {

            window
              .openManaStrengthMembership();

          }

        };

    }
  }


  /* =========================================
     COACH VISIBILITY
     ========================================= */

  function enforceCoachPlan() {

    if (
      !strengthOverviewOpen()
    ) {
      return;
    }


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
      plan ===
      "self"
        ? "none"
        : "";
  }


  /* =========================================
     OVERVIEW STABILISER
     ========================================= */

  function stabiliseOverview() {

    if (
      fixingOverview ||
      !strengthOverviewOpen()
    ) {
      return;
    }


    fixingOverview =
      true;


    try {

      removeOldPricing();

      ensureMembershipBar();

      enforceCoachPlan();

    } finally {

      fixingOverview =
        false;

    }
  }


  function queueOverviewFix(
    delay = 40
  ) {

    clearTimeout(
      observerTimer
    );


    observerTimer =
      setTimeout(
        stabiliseOverview,
        delay
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

      /*
        Absolute final safety:
        old pricing cards stay hidden
        even before JS removes them.
      */

      .mana-v866-plans{
        display:none !important;
      }


      #${PLAN_BAR_ID}{
        display:flex !important;

        justify-content:
          space-between;

        align-items:center;

        gap:12px;

        width:100%;

        margin:
          0
          0
          14px;

        padding:
          12px
          14px;

        border:
          1px solid
          #463c1b;

        border-radius:
          15px;

        background:
          #0d0c08;

        box-sizing:
          border-box;
      }


      .mana-v913-plan-copy{
        min-width:0;
      }


      .mana-v913-plan-copy small{
        display:block;

        color:#777;

        font-size:8px;

        font-weight:900;

        letter-spacing:.08em;
      }


      .mana-v913-plan-copy strong{
        display:block;

        margin-top:4px;

        color:#f3d875;

        font-size:12px;

        line-height:1.3;
      }


      .mana-v913-change{
        flex:
          0
          0
          auto;

        min-height:36px;

        padding:
          0
          12px;

        border:
          1px solid
          #4d421d;

        border-radius:
          999px;

        background:#111;

        color:#f3d875;

        font-size:9px;

        font-weight:900;

        cursor:pointer;
      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     EVENTS
     ========================================= */

  function watchEvents() {

    [
      "mana:program-tab-change",
      "mana:strength-membership-change",
      "mana:strength-synced",
      "mana:profile-synced"
    ].forEach(
      eventName => {

        window.addEventListener(
          eventName,
          () => {

            queueOverviewFix(
              40
            );


            setTimeout(
              stabiliseOverview,
              180
            );


            setTimeout(
              stabiliseOverview,
              500
            );

          }
        );

      }
    );


    window.addEventListener(
      "focus",
      () => {

        configureLogin();

        queueOverviewFix();

      }
    );


    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.visibilityState ===
          "visible"
        ) {

          configureLogin();

          queueOverviewFix();

        }

      }
    );
  }


  /* =========================================
     DOM WATCH
     ========================================= */

  function watchDOM() {

    const observer =
      new MutationObserver(
        () => {

          configureLogin();

          wireLoginCapture();


          if (
            strengthOverviewOpen()
          ) {

            queueOverviewFix(
              30
            );

          }

        }
      );


    observer.observe(
      document.body,
      {
        childList:true,
        subtree:true
      }
    );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    injectStyles();

    configureLogin();

    wireLoginCapture();

    watchSuccessfulLogin();

    watchEvents();

    watchDOM();


    /*
      Extra stability during initial
      application rendering.
    */

    [
      100,
      300,
      700,
      1200,
      2000,
      3200
    ].forEach(
      delay => {

        setTimeout(
          () => {

            configureLogin();

            wireLoginCapture();

            stabiliseOverview();

          },
          delay
        );

      }
    );


    /*
      Lightweight final guard.

      Only does work when the Strength
      Overview is actually open.
    */

    setInterval(
      () => {

        if (
          strengthOverviewOpen()
        ) {

          stabiliseOverview();

        }

      },
      1200
    );
  }


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
