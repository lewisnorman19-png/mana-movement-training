/* =========================================
   MANA MOVEMENT TRAINING v9.14.0
   STRENGTH UI POLISH

   FIXES:
   - LOCK COACH CHAT DESIGN
   - KEEP YELLOW CHAT BUTTON
   - STOP CHAT CARD VISUAL CHANGES
   - KEEP COACH CHAT AT BOTTOM
   - LARGER LEARN DROP-DOWN TEXT
   ========================================= */

(() => {
  "use strict";


  const STYLE_ID =
    "mana-v9140-strength-ui-style";


  let fixing =
    false;

  let timer =
    null;


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


    const tab =
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

      tab
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

      /* =====================================
         COACH SUPPORT SECTION
         ===================================== */

      .mana-v866-coach{
        margin-top:
          18px !important;

        border:
          1px solid
          #40371a !important;

        border-radius:
          20px !important;

        background:
          linear-gradient(
            145deg,
            #121008,
            #080808
          ) !important;
      }


      .mana-v866-coach
      .mana-v866-section-head{
        margin-bottom:
          0 !important;
      }


      .mana-v866-coach
      .mana-v866-section-head h3{
        color:#fff !important;

        font-size:
          20px !important;

        font-weight:
          900 !important;
      }


      .mana-v866-coach
      .mana-v866-section-head span{
        color:#f3d875 !important;

        font-size:
          9px !important;

        font-weight:
          900 !important;
      }


      /* =====================================
         HIDE OLD DUPLICATE COACH CONTENT
         ===================================== */

      .mana-v866-coach
      > div:not(
        .mana-v866-section-head
      ):not(
        #manaV95ClientChatCard
      ){
        display:none !important;
      }


      #manaV94CheckinCard{
        display:none !important;
      }


      /* =====================================
         LOCK COACH CHAT CARD
         ===================================== */

      #manaV95ClientChatCard{
        display:block !important;

        width:100% !important;

        margin:
          14px
          0
          0 !important;

        padding:
          16px !important;

        box-sizing:
          border-box !important;

        border:
          1px solid
          #5a4b1c !important;

        border-radius:
          18px !important;

        background:
          linear-gradient(
            145deg,
            #191608,
            #090909
          ) !important;
      }


      #manaV95ClientChatCard
      .mana-v950-card-row{
        display:flex !important;

        justify-content:
          space-between !important;

        align-items:
          flex-start !important;

        gap:
          12px !important;
      }


      #manaV95ClientChatCard
      .mana-v950-card-kicker{
        display:none !important;
      }


      #manaV95ClientChatCard
      .mana-v950-card-title{
        display:block !important;

        margin:
          0 !important;

        color:
          #fff !important;

        font-size:
          18px !important;

        font-weight:
          900 !important;
      }


      #manaV95ClientChatCard
      .mana-v950-card-preview{
        display:block !important;

        margin-top:
          6px !important;

        color:
          #929292 !important;

        font-size:
          11px !important;

        line-height:
          1.5 !important;
      }


      #manaV95ClientChatCard
      .mana-v950-live{
        display:none !important;
      }


      /* THE YELLOW BUTTON */

      #manaV95ClientOpen{
        display:block !important;

        width:100% !important;

        min-height:
          50px !important;

        margin-top:
          13px !important;

        padding:
          0
          14px !important;

        border:
          0 !important;

        border-radius:
          14px !important;

        background:
          #f3d875 !important;

        color:
          #111 !important;

        font-size:
          13px !important;

        font-weight:
          900 !important;

        letter-spacing:
          .01em !important;

        cursor:pointer !important;
      }


      #manaV95ClientOpen:active{
        transform:
          scale(.99);
      }


      /* =====================================
         LEARN TAB — LARGER READING TEXT
         ===================================== */

      .mana-v9120-body{
        font-size:
          14px !important;

        line-height:
          1.75 !important;

        color:
          #c1c1c1 !important;
      }


      .mana-v9120-intro{
        font-size:
          11px !important;

        line-height:
          1.5 !important;
      }


      .mana-v9120-title{
        font-size:
          16px !important;
      }


      @media(
        max-width:390px
      ){

        .mana-v9120-body{
          font-size:
            14px !important;

          line-height:
            1.7 !important;
        }


        #manaV95ClientChatCard{
          padding:
            15px !important;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     NORMALISE CHAT CONTENT
     ========================================= */

  function fixCoachChat() {

    if (
      fixing ||
      !strengthOverviewOpen()
    ) {
      return;
    }


    fixing =
      true;


    try {

      const holder =
        document.getElementById(
          "manaV83Content"
        );


      const coach =
        holder
          ?.querySelector(
            ".mana-v866-coach"
          );


      const card =
        document.getElementById(
          "manaV95ClientChatCard"
        );


      if (
        !holder ||
        !coach
      ) {
        return;
      }


      /*
        Coach section always stays
        at the bottom of Overview.
      */

      if (
        holder.lastElementChild !==
        coach
      ) {

        holder.appendChild(
          coach
        );

      }


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
        v9.5 sometimes recreates the
        chat card.

        Make sure it always belongs
        inside Coach Support.
      */

      if (
        card &&
        card.parentElement !==
          coach
      ) {

        coach.appendChild(
          card
        );

      }


      const title =
        card
          ?.querySelector(
            ".mana-v950-card-title"
          );


      if (title) {

        title.textContent =
          "Coach Chat";

      }


      const button =
        document.getElementById(
          "manaV95ClientOpen"
        );


      if (button) {

        button.textContent =
          "MESSAGE YOUR COACH →";

      }

    } finally {

      fixing =
        false;

    }
  }


  /* =========================================
     QUEUE
     ========================================= */

  function queueFix(
    delay = 60
  ) {

    clearTimeout(
      timer
    );


    timer =
      setTimeout(
        fixCoachChat,
        delay
      );
  }


  /* =========================================
     EVENTS
     ========================================= */

  function watchEvents() {

    [
      "mana:program-tab-change",
      "mana:strength-synced",
      "mana:strength-membership-change",
      "mana:profile-synced"
    ].forEach(
      eventName => {

        window.addEventListener(
          eventName,
          () => {

            queueFix(
              50
            );


            setTimeout(
              fixCoachChat,
              220
            );


            setTimeout(
              fixCoachChat,
              600
            );

          }
        );

      }
    );


    window.addEventListener(
      "focus",
      () => {

        queueFix();

      }
    );
  }


  /* =========================================
     DOM WATCHER
     ========================================= */

  function watchDOM() {

    const observer =
      new MutationObserver(
        () => {

          if (
            strengthOverviewOpen()
          ) {

            queueFix(
              40
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

    watchEvents();

    watchDOM();


    [
      300,
      700,
      1200,
      2000,
      3000
    ].forEach(
      delay => {

        setTimeout(
          fixCoachChat,
          delay
        );

      }
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
