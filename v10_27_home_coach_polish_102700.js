/* =========================================
   MANA MOVEMENT TRAINING v10.27
   HOME + COACH EXPERIENCE POLISH

   BUILD: 102700

   PURPOSE
   -----------------------------------------
   HOME
   - Premium Home presentation
   - Restore text every time Home returns
   - Stronger program messaging
   - Preserve green / blue / yellow system
   - Strength → Lyfe → Mana 28 order
   - No missing text after navigation

   COACH CHAT
   - MANA STRENGTH OVERVIEW ONLY
   - Remove from Workout / Fuel / Progress /
     Learning tabs
   - Stronger premium coaching presentation
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "102700";


  const STYLE_ID =
    "mana-v1027-home-coach-polish";


  const CHAT_ID =
    "manaV969CoachChat";


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
         HOME FOUNDATION
         ===================================== */

      #manaV80Home{

        max-width:
          980px !important;

      }


      #manaV80Home
      .mana-v8013-brand{

        margin-bottom:
          28px !important;

      }


      #manaV80Home
      .mana-v8013-brand h1{

        margin-bottom:
          7px !important;

      }


      /* =====================================
         HOME PROGRAM CARDS
         ===================================== */

      #manaV80Home
      .mana-v8013-program{

        min-height:
          220px !important;

        padding:
          28px
          30px !important;

        border-radius:
          26px !important;

        transition:
          transform .18s ease,
          border-color .18s ease,
          box-shadow .18s ease !important;

      }


      #manaV80Home
      .mana-v8013-program:hover{

        transform:
          translateY(-2px) !important;

      }


      #manaV80Home
      .mana-v8013-program-label{

        font-size:
          13px !important;

        letter-spacing:
          .14em !important;

      }


      #manaV80Home
      .mana-v8013-program h2{

        max-width:
          68% !important;

        margin-top:
          7px !important;

        font-size:
          31px !important;

        line-height:
          1.05 !important;

      }


      #manaV80Home
      .mana-v8013-program p{

        max-width:
          68% !important;

        margin-top:
          12px !important;

        color:
          #b1b1b1 !important;

        font-size:
          15px !important;

        line-height:
          1.55 !important;

      }


      /* =====================================
         NEW PROGRAM SUPPORT LINE
         ===================================== */

      #manaV80Home
      .m1027-home-support{

        position:
          relative !important;

        z-index:
          3 !important;

        max-width:
          68% !important;

        margin-top:
          12px !important;

        padding-top:
          11px !important;

        border-top:
          1px solid
          rgba(
            255,
            255,
            255,
            .08
          ) !important;

        color:
          #858585 !important;

        font-size:
          11px !important;

        font-weight:
          850 !important;

        letter-spacing:
          .08em !important;

        line-height:
          1.45 !important;

        text-transform:
          uppercase !important;

      }


      #manaV80Home
      [data-program="strength"]
      .m1027-home-support{

        color:
          rgba(
            85,
            217,
            139,
            .82
          ) !important;

      }


      #manaV80Home
      [data-program="life"]
      .m1027-home-support{

        color:
          rgba(
            85,
            168,
            222,
            .84
          ) !important;

      }


      #manaV80Home
      [data-program="mana28"]
      .m1027-home-support{

        color:
          rgba(
            224,
            187,
            81,
            .88
          ) !important;

      }


      /* =====================================
         HOME CARD BADGES
         ===================================== */

      #manaV80Home
      .mana-v8013-badge{

        top:
          18px !important;

        right:
          18px !important;

        background:
          rgba(
            9,
            9,
            9,
            .85
          ) !important;

        font-size:
          9px !important;

        letter-spacing:
          .10em !important;

      }


      #manaV80Home
      [data-program="strength"]
      .mana-v8013-badge{

        border-color:
          rgba(
            85,
            217,
            139,
            .58
          ) !important;

      }


      #manaV80Home
      [data-program="life"]
      .mana-v8013-badge{

        border-color:
          rgba(
            85,
            168,
            222,
            .58
          ) !important;

      }


      #manaV80Home
      [data-program="mana28"]
      .mana-v8013-badge{

        border-color:
          rgba(
            224,
            187,
            81,
            .62
          ) !important;

      }


      /* =====================================
         HOME OPEN LINK
         ===================================== */

      #manaV80Home
      .mana-v8013-open{

        margin-top:
          15px !important;

        font-size:
          13px !important;

        letter-spacing:
          .025em !important;

      }


      /* =====================================
         HOME NAV POLISH
         ===================================== */

      #manaV80Home
      .mana-v8013-bottom{

        background:
          rgba(
            5,
            5,
            5,
            .96
          ) !important;

        border-top:
          1px solid
          #292929 !important;

        backdrop-filter:
          blur(16px) !important;

      }


      #manaV80Home
      .mana-v8013-nav{

        border:
          1px solid
          #292929 !important;

        border-radius:
          15px !important;

        background:
          #0b0b0b !important;

        color:
          #888 !important;

      }


      #manaV80Home
      .mana-v8013-nav.active{

        border-color:
          rgba(
            224,
            187,
            81,
            .75
          ) !important;

        background:
          rgba(
            224,
            187,
            81,
            .045
          ) !important;

        color:
          #f3d875 !important;

        box-shadow:
          0
          0
          16px
          rgba(
            224,
            187,
            81,
            .08
          ) !important;

      }


      /* =====================================
         COACH CHAT
         OVERVIEW ONLY
         ===================================== */

      #manaV969CoachChat{

        position:
          relative !important;

        overflow:
          hidden !important;

        margin:
          26px
          0
          14px !important;

        padding:
          24px !important;

        border:
          1px solid
          rgba(
            85,
            217,
            139,
            .68
          ) !important;

        border-radius:
          24px !important;

        background:

          radial-gradient(
            circle at top right,
            rgba(
              85,
              217,
              139,
              .11
            ),
            transparent
            42%
          ),

          linear-gradient(
            145deg,
            #101713,
            #090909
          ) !important;

        box-shadow:
          0
          16px
          38px
          rgba(
            0,
            0,
            0,
            .26
          ),
          0
          0
          0
          1px
          rgba(
            85,
            217,
            139,
            .035
          )
          inset !important;

      }


      #manaV969CoachChat::before{

        content:
          "" !important;

        position:
          absolute !important;

        top:
          0 !important;

        left:
          24px !important;

        right:
          24px !important;

        height:
          2px !important;

        background:
          linear-gradient(
            90deg,
            transparent,
            var(
              --m25-green,
              #55d98b
            ),
            transparent
          ) !important;

      }


      #manaV969CoachChat
      .mana-v969-chat-kicker{

        color:
          var(
            --m25-green,
            #55d98b
          ) !important;

        font-size:
          10px !important;

        letter-spacing:
          .16em !important;

      }


      #manaV969CoachChat
      .mana-v969-chat-title{

        margin-top:
          7px !important;

        color:
          #fff !important;

        font-size:
          25px !important;

        line-height:
          1.08 !important;

      }


      #manaV969CoachChat
      .mana-v969-chat-text{

        max-width:
          650px !important;

        margin-top:
          9px !important;

        color:
          #b7b7b7 !important;

        font-size:
          14px !important;

        line-height:
          1.55 !important;

      }


      #manaV969CoachChat
      .mana-v969-chat-live{

        border:
          1px solid
          rgba(
            85,
            217,
            139,
            .65
          ) !important;

        background:
          rgba(
            85,
            217,
            139,
            .06
          ) !important;

        color:
          var(
            --m25-green,
            #55d98b
          ) !important;

        box-shadow:
          0
          0
          12px
          rgba(
            85,
            217,
            139,
            .10
          ) !important;

      }


      #manaV969CoachChat
      .mana-v969-chat-button{

        min-height:
          56px !important;

        margin-top:
          19px !important;

        border:
          1px solid
          var(
            --m25-green,
            #55d98b
          ) !important;

        border-radius:
          16px !important;

        background:
          rgba(
            85,
            217,
            139,
            .055
          ) !important;

        color:
          #dff9e8 !important;

        font-size:
          12px !important;

        letter-spacing:
          .06em !important;

        transition:
          background .18s ease,
          transform .18s ease,
          box-shadow .18s ease !important;

      }


      #manaV969CoachChat
      .mana-v969-chat-button:hover{

        background:
          rgba(
            85,
            217,
            139,
            .10
          ) !important;

        box-shadow:
          0
          0
          20px
          rgba(
            85,
            217,
            139,
            .09
          ) !important;

      }


      #manaV969CoachChat
      .mana-v969-chat-button:active{

        transform:
          scale(.995) !important;

      }


      /* =====================================
         PHONE
         ===================================== */

      @media(max-width:600px){


        #manaV80Home
        .mana-v8013-program{

          min-height:
            205px !important;

          padding:
            23px
            20px !important;

        }


        #manaV80Home
        .mana-v8013-program h2{

          max-width:
            70% !important;

          font-size:
            26px !important;

        }


        #manaV80Home
        .mana-v8013-program p{

          max-width:
            70% !important;

          font-size:
            14px !important;

          line-height:
            1.5 !important;

        }


        #manaV80Home
        .m1027-home-support{

          max-width:
            70% !important;

          font-size:
            10px !important;

        }


        #manaV969CoachChat{

          padding:
            20px
            18px !important;

        }


        #manaV969CoachChat
        .mana-v969-chat-title{

          font-size:
            23px !important;

        }

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     HELPERS
     ========================================= */

  function strengthOpen() {

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
        )

      &&

      title
        ?.textContent
        ?.trim()
        ?.toUpperCase()
        ?.startsWith(
          "MANA STRENGTH"
        )

    );

  }


  function activeProgramTab() {

    return (
      document
        .querySelector(
          "#manaV83Tabs .mana-v83-tab.active"
        )
        ?.dataset
        ?.v83Tab
      || ""
    );

  }


  /* =========================================
     HOME COPY
     ========================================= */

  function supportLine(
    card,
    text
  ) {

    if (!card) {
      return;
    }


    let line =
      card.querySelector(
        ".m1027-home-support"
      );


    if (!line) {

      line =
        document.createElement(
          "div"
        );


      line.className =
        "m1027-home-support";


      const open =
        card.querySelector(
          ".mana-v8013-open"
        );


      if (open) {

        open.insertAdjacentElement(
          "beforebegin",
          line
        );

      } else {

        card.appendChild(
          line
        );

      }

    }


    line.textContent =
      text;

  }


  function restoreHomeCopy() {

    const home =
      document.getElementById(
        "manaV80Home"
      );


    if (!home) {
      return;
    }


    const strength =
      home.querySelector(
        '[data-program="strength"]'
      );


    const lyfe =
      home.querySelector(
        '[data-program="life"]'
      );


    const mana28 =
      home.querySelector(
        '[data-program="mana28"]'
      );


    /* =====================================
       ORDER
       ===================================== */

    if (
      strength &&
      lyfe &&
      mana28
    ) {

      const parent =
        strength.parentElement;


      if (parent) {

        parent.insertBefore(
          strength,
          lyfe
        );


        parent.insertBefore(
          lyfe,
          mana28
        );

      }

    }


    /* =====================================
       MANA STRENGTH
       ===================================== */

    if (strength) {

      const label =
        strength.querySelector(
          ".mana-v8013-program-label"
        );


      const title =
        strength.querySelector(
          "h2"
        );


      const copy =
        strength.querySelector(
          "p"
        );


      const badge =
        strength.querySelector(
          ".mana-v8013-badge"
        );


      const open =
        strength.querySelector(
          ".mana-v8013-open"
        );


      if (label) {

        label.textContent =
          "MANA STRENGTH";

      }


      if (title) {

        title.textContent =
          "Your Personalised Training";

      }


      if (copy) {

        copy.textContent =
          "Personalised training programs built around your goals, experience, equipment and weekly schedule.";

      }


      if (badge) {

        badge.textContent =
          "MEMBERSHIP";

      }


      if (open) {

        open.textContent =
          "Open MANA STRENGTH →";

      }


      supportLine(
        strength,
        "TRAIN • FUEL • TRACK • PROGRESS"
      );

    }


    /* =====================================
       MANA LYFE
       ===================================== */

    if (lyfe) {

      const label =
        lyfe.querySelector(
          ".mana-v8013-program-label"
        );


      const title =
        lyfe.querySelector(
          "h2"
        );


      const copy =
        lyfe.querySelector(
          "p"
        );


      const badge =
        lyfe.querySelector(
          ".mana-v8013-badge"
        );


      const open =
        lyfe.querySelector(
          ".mana-v8013-open"
        );


      if (label) {

        label.textContent =
          "MANA LYFE";

      }


      if (title) {

        title.textContent =
          "Reset. Rebuild. Move Forward.";

      }


      if (copy) {

        copy.textContent =
          "Movement, mindset, reflection and practical daily tools designed to help you rebuild routine, confidence and momentum.";

      }


      if (badge) {

        badge.textContent =
          "LIFESTYLE";

      }


      if (open) {

        open.textContent =
          "Open MANA LYFE →";

      }


      supportLine(
        lyfe,
        "MOVE • RESET • RECLAIM • REBUILD"
      );

    }


    /* =====================================
       MANA 28
       ===================================== */

    if (mana28) {

      const label =
        mana28.querySelector(
          ".mana-v8013-program-label"
        );


      const title =
        mana28.querySelector(
          "h2"
        );


      const copy =
        mana28.querySelector(
          "p"
        );


      const badge =
        mana28.querySelector(
          ".mana-v8013-badge"
        );


      const open =
        mana28.querySelector(
          ".mana-v8013-open"
        );


      if (label) {

        label.textContent =
          "MANA 28";

      }


      if (title) {

        title.textContent =
          "28-Day Kickstart";

      }


      if (copy) {

        copy.textContent =
          "Kickstart your health and fitness journey with a 28-day training, nutrition and habit program designed to build consistency and momentum.";

      }


      if (badge) {

        badge.textContent =
          "FREE";

      }


      if (open) {

        open.textContent =
          "Open MANA 28 →";

      }


      supportLine(
        mana28,
        "28 DAYS • TRAIN • FUEL • BUILD MOMENTUM"
      );

    }

  }


  /* =========================================
     COACH CHAT
     ========================================= */

  function enforceCoachChat() {

    if (
      !strengthOpen()
    ) {

      document
        .getElementById(
          CHAT_ID
        )
        ?.remove();


      return;

    }


    const tab =
      activeProgramTab();


    /*
      Coach Chat lives ONLY on Overview.
    */

    if (
      tab !==
      "overview"
    ) {

      document
        .getElementById(
          CHAT_ID
        )
        ?.remove();


      return;

    }


    const chat =
      document.getElementById(
        CHAT_ID
      );


    if (!chat) {

      return;

    }


    const kicker =
      chat.querySelector(
        ".mana-v969-chat-kicker"
      );


    const title =
      chat.querySelector(
        ".mana-v969-chat-title"
      );


    const text =
      chat.querySelector(
        ".mana-v969-chat-text"
      );


    const live =
      chat.querySelector(
        ".mana-v969-chat-live"
      );


    const button =
      chat.querySelector(
        ".mana-v969-chat-button"
      );


    if (kicker) {

      kicker.textContent =
        "YOUR COACH • DIRECT SUPPORT";

    }


    if (title) {

      title.textContent =
        "Coach Chat";

    }


    if (text) {

      text.textContent =
        "Questions about your training, Fuel, progress or program? Message your coach directly from your Mana Strength hub.";

    }


    if (live) {

      live.textContent =
        "COACH SUPPORT";

    }


    if (button) {

      button.textContent =
        "MESSAGE YOUR COACH →";

    }

  }


  /* =========================================
     REFRESH
     ========================================= */

  function refresh() {

    restoreHomeCopy();

    enforceCoachChat();

  }


  function settle() {

    refresh();


    [
      60,
      180,
      420,
      850
    ]
      .forEach(
        delay => {

          setTimeout(
            refresh,
            delay
          );

        }
      );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    settle();


    [
      "mana:program-tab-change",
      "mana:program-change",
      "mana:profile-synced",
      "mana:strength-membership-change",
      "mana:strength-synced"
    ]
      .forEach(
        eventName => {

          document.addEventListener(
            eventName,
            settle
          );


          window.addEventListener(
            eventName,
            settle
          );

        }
      );


    document.addEventListener(
      "click",
      event => {

        const relevant =
          event.target.closest(
            `
              #manaV80HomeBtn,
              [data-program],
              #manaV83Tabs .mana-v83-tab,
              #manaV83Back,
              .mana-v83-back,
              #manaV80Strength
            `
          );


        if (!relevant) {
          return;
        }


        requestAnimationFrame(
          settle
        );

      },
      true
    );


    window.addEventListener(
      "pageshow",
      settle
    );


    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.visibilityState ===
          "visible"
        ) {

          settle();

        }

      }
    );


    window
      .refreshManaHomeCoachPolish =
        settle;


    window
      .MANA_HOME_COACH_POLISH_BUILD =
        BUILD;


    console.log(
      "Mana Home + Coach Polish",
      BUILD
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
