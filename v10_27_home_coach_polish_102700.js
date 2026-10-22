/* =========================================
   MANA MOVEMENT TRAINING v10.27.2
   HOME + COACH EXPERIENCE POLISH

   BUILD: 102720

   HOME
   -----------------------------------------
   - Equal dimensions for all 3 program cards
   - Match premium Choose Your Plan proportions
   - Bigger headings
   - Restore Home copy reliably
   - Prevent disappearing / dark text
   - Strength = green
   - Lyfe = blue
   - Mana 28 = yellow

   COACH CHAT
   -----------------------------------------
   - Strength Overview ONLY
   - Removed from all other tabs
   - Stronger premium presentation
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "102720";


  const STYLE_ID =
    "mana-v10272-home-coach-polish";


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

        display:
          block !important;

        visibility:
          visible !important;

        opacity:
          1 !important;

        margin-bottom:
          28px !important;

      }


      /* =====================================
         HOME PROGRAM CARDS
         SAME DIMENSIONS ACROSS ALL 3
         ===================================== */

      #manaV80Home
      .mana-v8013-program{

        position:
          relative !important;

        width:
          100% !important;

        min-height:
          300px !important;

        height:
          300px !important;

        padding:
          30px
          32px !important;

        border-radius:
          24px !important;

        display:
          flex !important;

        flex-direction:
          column !important;

        justify-content:
          flex-start !important;

        overflow:
          hidden !important;

        opacity:
          1 !important;

        visibility:
          visible !important;

        color:
          #fff !important;

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


      /* =====================================
         PROGRAM LABELS
         ===================================== */

      #manaV80Home
      .mana-v8013-program
      .mana-v8013-program-label,

      #manaV80Home
      .mana-v8013-program.current
      .mana-v8013-program-label{

        display:
          block !important;

        visibility:
          visible !important;

        opacity:
          1 !important;

        color:
          #f3d875 !important;

        -webkit-text-fill-color:
          #f3d875 !important;

        font-size:
          15px !important;

        font-weight:
          950 !important;

        letter-spacing:
          .15em !important;

        line-height:
          1.2 !important;

      }


      /* =====================================
         BIGGER PROGRAM HEADINGS
         ===================================== */

      #manaV80Home
      .mana-v8013-program h2,

      #manaV80Home
      .mana-v8013-program.current h2{

        display:
          block !important;

        visibility:
          visible !important;

        opacity:
          1 !important;

        max-width:
          72% !important;

        margin:
          9px
          0
          0 !important;

        color:
          #fff !important;

        -webkit-text-fill-color:
          #fff !important;

        font-size:
          40px !important;

        font-weight:
          950 !important;

        line-height:
          1.02 !important;

        word-break:
          normal !important;

        white-space:
          normal !important;

      }


      /* =====================================
         HOME BODY COPY
         ===================================== */

      #manaV80Home
      .mana-v8013-program p,

      #manaV80Home
      .mana-v8013-program.current p{

        display:
          block !important;

        visibility:
          visible !important;

        opacity:
          1 !important;

        max-width:
          70% !important;

        margin:
          14px
          0
          0 !important;

        color:
          #b1b1b1 !important;

        -webkit-text-fill-color:
          #b1b1b1 !important;

        font-size:
          15px !important;

        line-height:
          1.55 !important;

      }


      /* =====================================
         PRICE
         ===================================== */

      #manaV80Home
      .mana-v8013-price{

        display:
          block !important;

        visibility:
          visible !important;

        opacity:
          1 !important;

        margin-top:
          14px !important;

      }


      #manaV80Home
      .mana-v8013-price strong{

        color:
          #f3d875 !important;

        -webkit-text-fill-color:
          #f3d875 !important;

      }


      #manaV80Home
      .mana-v8013-price span{

        color:
          #888 !important;

        -webkit-text-fill-color:
          #888 !important;

      }


      /* =====================================
         FREE NOTE
         ===================================== */

      #manaV80Home
      .mana-v8013-free-note{

        display:
          block !important;

        visibility:
          visible !important;

        opacity:
          1 !important;

        color:
          #d9c36d !important;

        -webkit-text-fill-color:
          #d9c36d !important;

      }


      /* =====================================
         SUPPORT LINE
         ===================================== */

      #manaV80Home
      .m1027-home-support{

        position:
          relative !important;

        z-index:
          4 !important;

        display:
          block !important;

        visibility:
          visible !important;

        opacity:
          1 !important;

        max-width:
          70% !important;

        margin-top:
          auto !important;

        padding-top:
          12px !important;

        border-top:
          1px solid
          rgba(
            255,
            255,
            255,
            .09
          ) !important;

        font-size:
          11px !important;

        font-weight:
          950 !important;

        letter-spacing:
          .09em !important;

        line-height:
          1.4 !important;

        text-transform:
          uppercase !important;

      }


      #manaV80Home
      [data-program="strength"]
      .m1027-home-support{

        color:
          #55d98b !important;

        -webkit-text-fill-color:
          #55d98b !important;

      }


      #manaV80Home
      [data-program="life"]
      .m1027-home-support{

        color:
          #55a8de !important;

        -webkit-text-fill-color:
          #55a8de !important;

      }


      #manaV80Home
      [data-program="mana28"]
      .m1027-home-support{

        color:
          #e0bb51 !important;

        -webkit-text-fill-color:
          #e0bb51 !important;

      }


      /* =====================================
         OPEN LINK
         ===================================== */

      #manaV80Home
      .mana-v8013-open,

      #manaV80Home
      .mana-v8013-program.current
      .mana-v8013-open{

        display:
          block !important;

        visibility:
          visible !important;

        opacity:
          1 !important;

        margin-top:
          13px !important;

        color:
          #f3d875 !important;

        -webkit-text-fill-color:
          #f3d875 !important;

        font-size:
          13px !important;

        font-weight:
          950 !important;

      }


      /* =====================================
         TOP BADGES
         ===================================== */

      #manaV80Home
      .mana-v8013-badge{

        visibility:
          visible !important;

        opacity:
          1 !important;

        top:
          18px !important;

        right:
          18px !important;

        background:
          #090909 !important;

        color:
          #f3d875 !important;

        -webkit-text-fill-color:
          #f3d875 !important;

      }


      /* =====================================
         ACTIVE PROGRAM BADGE
         ===================================== */

      #manaV80Home
      .mana-v8013-current-badge{

        visibility:
          visible !important;

        opacity:
          1 !important;

        color:
          #f3d875 !important;

        -webkit-text-fill-color:
          #f3d875 !important;

      }


      /* =====================================
         HOME ICON
         ===================================== */

      #manaV80Home
      .m1025-home-icon{

        z-index:
          2 !important;

        right:
          28px !important;

        top:
          50% !important;

        width:
          88px !important;

        height:
          88px !important;

        border-radius:
          24px !important;

      }


      #manaV80Home
      .m1025-home-icon svg{

        width:
          61px !important;

        height:
          61px !important;

      }


      #manaV80Home
      .mana-v8013-program
      > *:not(.m1025-home-icon){

        position:
          relative !important;

        z-index:
          4 !important;

      }


      /* =====================================
         COACH CHAT
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
            .72
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
              .12
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
          ) !important;

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
            #55d98b,
            transparent
          ) !important;

      }


      #manaV969CoachChat
      .mana-v969-chat-kicker{

        color:
          #55d98b !important;

      }


      #manaV969CoachChat
      .mana-v969-chat-title{

        color:
          #fff !important;

        font-size:
          25px !important;

      }


      #manaV969CoachChat
      .mana-v969-chat-text{

        max-width:
          650px !important;

        color:
          #b7b7b7 !important;

      }


      #manaV969CoachChat
      .mana-v969-chat-live{

        border-color:
          #55d98b !important;

        background:
          rgba(
            85,
            217,
            139,
            .06
          ) !important;

        color:
          #55d98b !important;

      }


      #manaV969CoachChat
      .mana-v969-chat-button{

        min-height:
          56px !important;

        border:
          1px solid
          #55d98b !important;

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

      }


      /* =====================================
         PHONE
         ===================================== */

      @media(max-width:600px){


        #manaV80Home
        .mana-v8013-program{

          min-height:
            225px !important;

          height:
            auto !important;

          padding:
            23px
            20px !important;

        }


        #manaV80Home
        .mana-v8013-program-label{

          font-size:
            12px !important;

        }


        #manaV80Home
        .mana-v8013-program h2,

        #manaV80Home
        .mana-v8013-program.current h2{

          max-width:
            72% !important;

          font-size:
            28px !important;

        }


        #manaV80Home
        .mana-v8013-program p{

          max-width:
            70% !important;

          font-size:
            14px !important;

        }


        #manaV80Home
        .m1027-home-support{

          max-width:
            70% !important;

          margin-top:
            14px !important;

          font-size:
            10px !important;

        }


        #manaV80Home
        .m1025-home-icon{

          right:
            10px !important;

          width:
            66px !important;

          height:
            66px !important;

        }


        #manaV80Home
        .m1025-home-icon svg{

          width:
            46px !important;

          height:
            46px !important;

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


  function activeTab() {

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
     SUPPORT LINE
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


  /* =========================================
     HOME RESTORE
     ========================================= */

  function restoreHome() {

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

    const chat =
      document.getElementById(
        CHAT_ID
      );


    if (
      !strengthOpen()
    ) {

      chat
        ?.remove();


      return;

    }


    /*
      OVERVIEW ONLY
    */

    if (
      activeTab() !==
      "overview"
    ) {

      chat
        ?.remove();


      return;

    }


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


    const copy =
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


    if (copy) {

      copy.textContent =
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

    restoreHome();

    enforceCoachChat();

  }


  function settle() {

    refresh();


    [
      40,
      100,
      220,
      450,
      850,
      1400
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
      "mana:strength-synced",
      "mana:workout-progress-change"
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

        if (
          event.target.closest(
            `
              #manaV80HomeBtn,
              [data-program],
              #manaV83Tabs .mana-v83-tab,
              .mana-v83-back,
              #manaV80Strength
            `
          )
        ) {

          requestAnimationFrame(
            settle
          );

        }

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
