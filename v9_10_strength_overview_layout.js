/* =========================================
   MANA MOVEMENT TRAINING v9.10.0
   MANA STRENGTH — OVERVIEW CLEANUP

   - TODAY'S WORKOUT NEAR TOP
   - START WORKOUT BUTTON
   - TODAY'S FOCUS BELOW WORKOUT
   - COACH SUPPORT MOVED TO BOTTOM
   - ONE SIMPLE COACH CHAT OPTION
   - REMOVES DUPLICATE COACH ACTIVITY
   - REMOVES DUPLICATE CHECK-IN CARD
   ========================================= */

(() => {
  "use strict";


  const STYLE_ID =
    "mana-v9100-overview-layout-style";


  let applying =
    false;


  /* =========================================
     HELPERS
     ========================================= */

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
         TODAY'S WORKOUT
         ========================== */

      .mana-v9100-workout{
        margin:
          14px
          0;

        padding:
          21px;

        border:
          2px solid
          #6e5c20;

        border-radius:
          22px;

        background:
          linear-gradient(
            145deg,
            #211b08,
            #0b0b0b 68%
          );

        box-shadow:
          0
          12px
          32px
          rgba(
            212,
            175,
            55,
            .08
          );
      }


      .mana-v9100-workout-label{
        color:#f3d875;

        font-size:10px;

        font-weight:900;

        letter-spacing:.13em;

        text-transform:uppercase;
      }


      .mana-v9100-workout h3{
        margin:
          7px
          0
          6px;

        color:#fff;

        font-size:25px;

        line-height:1.08;
      }


      .mana-v9100-workout p{
        margin:0;

        color:#999;

        font-size:12px;

        line-height:1.5;
      }


      .mana-v9100-start{
        width:100%;

        min-height:55px;

        margin-top:17px;

        border:0;

        border-radius:16px;

        background:#f3d875;

        color:#111;

        font-size:14px;

        font-weight:900;

        cursor:pointer;
      }


      .mana-v9100-start:active{
        transform:
          scale(.99);
      }


      /* ==========================
         COACH SUPPORT
         ========================== */

      .mana-v9100-coach{
        margin-top:18px !important;

        border:
          1px solid
          #40371a !important;

        background:
          linear-gradient(
            145deg,
            #121008,
            #090909
          ) !important;
      }


      .mana-v9100-coach
      .mana-v866-section-head{
        margin-bottom:
          0 !important;
      }


      .mana-v9100-coach
      .mana-v866-section-head h3{
        font-size:20px;
      }


      .mana-v9100-coach
      .mana-v866-section-head span{
        color:#f3d875;
      }


      /*
        Hide the old Coach Activity feed.

        Chat remains as the single
        coach support option.
      */

      .mana-v9100-coach
      > div:not(.mana-v866-section-head):not(#manaV95ClientChatCard){
        display:none !important;
      }


      /*
        Hide separate weekly check-in card.
        We are simplifying Coach Support
        to one clear action.
      */

      #manaV94CheckinCard{
        display:none !important;
      }


      /*
        Simplify Coach Chat appearance.
      */

      #manaV95ClientChatCard{
        margin-top:
          14px !important;

        padding:
          15px !important;

        border:
          1px solid
          #40371a !important;

        border-radius:
          16px !important;

        background:
          #0a0a0a !important;
      }


      #manaV95ClientChatCard
      .mana-v950-card-kicker{
        display:none !important;
      }


      #manaV95ClientChatCard
      .mana-v950-card-title{
        font-size:
          16px !important;

        margin-top:
          0 !important;
      }


      #manaV95ClientChatCard
      .mana-v950-card-preview{
        margin-top:
          5px !important;

        color:#888 !important;

        font-size:
          10px !important;

        line-height:
          1.45 !important;
      }


      #manaV95ClientChatCard
      .mana-v950-live{
        display:none !important;
      }


      #manaV95ClientChatCard
      .mana-v950-open{
        min-height:
          47px !important;

        margin-top:
          11px !important;

        border:0 !important;

        border-radius:
          14px !important;

        background:
          #f3d875 !important;

        color:#111 !important;

        font-size:
          12px !important;

        font-weight:
          900 !important;
      }


      @media(
        max-width:390px
      ){

        .mana-v9100-workout{
          padding:18px;
        }


        .mana-v9100-workout h3{
          font-size:22px;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     START WORKOUT
     ========================================= */

  function startWorkout() {
    const programTab =
      document.querySelector(
        '#manaV83Tabs [data-v83-tab="program"]'
      );


    if (programTab) {

      programTab.click();

    }
  }


  /* =========================================
     WORKOUT CARD
     ========================================= */

  function upgradeWorkoutCard() {
    const holder =
      document.getElementById(
        "manaV83Content"
      );


    if (!holder) {
      return;
    }


    /*
      v8.6 currently creates the
      "NEXT UP" card.

      Rather than duplicate it,
      we turn that card into the
      Today's Workout card.
    */

    const next =
      holder.querySelector(
        ".mana-v866-next"
      );


    if (!next) {
      return;
    }


    next.classList.add(
      "mana-v9100-workout"
    );


    const label =
      next.querySelector(
        ".mana-v866-next-label"
      );


    if (label) {

      label.textContent =
        "TODAY'S WORKOUT";

    }


    /*
      Remove old "Open Program tab..."
      wording.
    */

    next
      .querySelector(
        ".mana-v866-program-note"
      )
      ?.remove();


    let button =
      next.querySelector(
        ".mana-v9100-start"
      );


    if (!button) {

      button =
        document.createElement(
          "button"
        );


      button.type =
        "button";

      button.className =
        "mana-v9100-start";

      button.textContent =
        "START WORKOUT →";


      button.onclick =
        startWorkout;


      next.appendChild(
        button
      );

    }


    /*
      Put workout immediately after
      the welcome card.

      Membership bar remains above
      everything if v9.8 inserts it.
    */

    const welcome =
      holder.querySelector(
        ".mana-v866-welcome"
      );


    if (welcome) {

      welcome.insertAdjacentElement(
        "afterend",
        next
      );

    }
  }


  /* =========================================
     TODAY'S FOCUS ORDER
     ========================================= */

  function moveFocusBelowWorkout() {
    const holder =
      document.getElementById(
        "manaV83Content"
      );


    if (!holder) {
      return;
    }


    const workout =
      holder.querySelector(
        ".mana-v9100-workout"
      );


    if (!workout) {
      return;
    }


    const sections =
      Array.from(
        holder.querySelectorAll(
          ".mana-v866-section"
        )
      );


    const focus =
      sections.find(
        section => {

          return (
            section
              .querySelector(
                ".mana-v866-section-head h3"
              )
              ?.textContent
              ?.trim() ===
            "Today's Focus"
          );

        }
      );


    if (focus) {

      workout.insertAdjacentElement(
        "afterend",
        focus
      );

    }
  }


  /* =========================================
     COACH SUPPORT
     ========================================= */

  function simplifyCoachSupport() {
    const holder =
      document.getElementById(
        "manaV83Content"
      );


    const coach =
      holder
        ?.querySelector(
          ".mana-v866-coach"
        );


    if (
      !holder ||
      !coach
    ) {
      return;
    }


    coach.classList.add(
      "mana-v9100-coach"
    );


    const heading =
      coach.querySelector(
        ".mana-v866-section-head h3"
      );


    if (heading) {

      heading.textContent =
        "Coach Support";

    }


    const badge =
      coach.querySelector(
        ".mana-v866-section-head span"
      );


    if (badge) {

      badge.textContent =
        "MESSAGE";

    }


    /*
      Coach Support belongs at the
      very bottom of Overview.
    */

    holder.appendChild(
      coach
    );


    /*
      Make the chat CTA simpler.
    */

    const chatButton =
      document.getElementById(
        "manaV95ClientOpen"
      );


    if (chatButton) {

      chatButton.textContent =
        "MESSAGE YOUR COACH →";

    }


    const chatTitle =
      document
        .getElementById(
          "manaV95ClientChatCard"
        )
        ?.querySelector(
          ".mana-v950-card-title"
        );


    if (chatTitle) {

      chatTitle.textContent =
        "Coach Chat";

    }
  }


  /* =========================================
     APPLY
     ========================================= */

  function applyLayout() {
    if (
      applying ||
      !strengthOverviewOpen()
    ) {
      return;
    }


    applying =
      true;


    try {

      upgradeWorkoutCard();

      moveFocusBelowWorkout();

      simplifyCoachSupport();

    } finally {

      applying =
        false;

    }
  }


  /* =========================================
     WATCH
     ========================================= */

  function watch() {

    window.addEventListener(
      "mana:program-tab-change",
      () => {

        setTimeout(
          applyLayout,
          120
        );


        setTimeout(
          applyLayout,
          350
        );

      }
    );


    window.addEventListener(
      "mana:strength-synced",
      () => {

        setTimeout(
          applyLayout,
          120
        );

      }
    );


    window.addEventListener(
      "mana:profile-synced",
      () => {

        setTimeout(
          applyLayout,
          120
        );

      }
    );


    window.addEventListener(
      "mana:strength-membership-change",
      () => {

        setTimeout(
          applyLayout,
          150
        );

      }
    );


    window.addEventListener(
      "focus",
      () => {

        setTimeout(
          applyLayout,
          120
        );

      }
    );


    let timer =
      null;


    const observer =
      new MutationObserver(
        () => {

          if (
            applying
          ) {
            return;
          }


          clearTimeout(
            timer
          );


          timer =
            setTimeout(
              applyLayout,
              100
            );

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

    watch();


    [
      700,
      1200,
      1800,
      2600
    ].forEach(
      delay => {

        setTimeout(
          applyLayout,
          delay
        );

      }
    );
  }


  window.refreshManaStrengthOverviewLayout =
    applyLayout;


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
