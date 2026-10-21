/* =========================================
   MANA MOVEMENT TRAINING v10.18.0
   PREMIUM CLIENT EXPERIENCE

   BUILD: 101800

   PURPOSE
   -----------------------------------------
   1. Move Program Upgrade panel BELOW workouts
      and ABOVE Coach Chat

   2. Premium Next Block Ready experience
      GOLD    = request available
      AMBER   = coach working
      EMERALD = next block ready

   3. Match Overview icons to bottom-tab assets

   4. Add subtle premium colour to workout cards

   5. Preserve:
      - v10.17 request logic
      - Week 1–4 selector
      - existing workout logger
      - exercise illustrations
      - mobile Previous / Next
      - Fuel layout
   ========================================= */

(() => {
  "use strict";


  /* =========================================
     BUILD
     ========================================= */

  const BUILD =
    "101800";


  const STYLE_ID =
    "mana-v1018-premium-client-style";


  const UPGRADE_ID =
    "manaV1018UpgradeExperience";


  const BLOCK_ID =
    "manaV1017ProgramBlock";


  const CHAT_ID =
    "manaV969CoachChat";


  const ASSET_ROOT =
    "ui/";


  let refreshTimer =
    null;


  let observer =
    null;


  /* =========================================
     HELPERS
     ========================================= */

  const $ =
    id =>
      document.getElementById(
        id
      );


  function asset(
    filename
  ) {

    return (
      ASSET_ROOT +
      filename +
      "?v=" +
      BUILD
    );

  }


  function strengthOpen() {

    const shell =
      $(
        "manaV83ProgramShell"
      );


    const title =
      String(
        $(
          "manaV83Title"
        )
          ?.textContent ||
        ""
      )
        .trim()
        .toUpperCase();


    return Boolean(

      shell
        ?.classList
        .contains(
          "open"
        )

      &&

      title ===
        "MANA STRENGTH"

    );

  }


  function activeTab() {

    if (
      !strengthOpen()
    ) {

      return null;

    }


    return (
      document
        .querySelector(
          "#manaV83Tabs .mana-v83-tab.active"
        )
        ?.dataset
        ?.v83Tab ||
      null
    );

  }


  /* =========================================
     STYLES
     ========================================= */

  function installStyles() {

    $(
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
         OVERVIEW ICON SYSTEM
         ===================================== */

      #manaV964Launchpad
      .mana-v964-icon{

        overflow:
          hidden !important;

        display:
          grid !important;

        place-items:
          center !important;

        padding:
          0 !important;

        border:
          1px solid
          rgba(
            243,
            216,
            117,
            .42
          ) !important;

        background:

          radial-gradient(
            circle at center,
            rgba(
              243,
              216,
              117,
              .12
            ),
            transparent 68%
          ),

          #080808 !important;

        box-shadow:

          inset
          0
          0
          18px
          rgba(
            243,
            216,
            117,
            .06
          ),

          0
          8px
          22px
          rgba(
            0,
            0,
            0,
            .28
          ) !important;

      }


      #manaV964Launchpad
      .mana-v964-icon
      img{

        display:
          block;

        width:
          100%;

        height:
          100%;

        object-fit:
          cover;

      }


      #manaV964Launchpad
      .mana-v964-icon
      .m1018-profile-symbol{

        color:
          #f3d875;

        font-size:
          26px;

        font-weight:
          950;

        line-height:
          1;

      }


      /* =====================================
         OVERVIEW COLOUR POLISH
         ===================================== */

      #manaV964Launchpad
      [data-v964-launch="program"]{

        border-color:
          rgba(
            210,
            177,
            70,
            .52
          ) !important;

      }


      #manaV964Launchpad
      [data-v964-launch="fuel"]{

        border-color:
          rgba(
            226,
            168,
            65,
            .52
          ) !important;

        background:

          radial-gradient(
            circle at top left,
            rgba(
              226,
              168,
              65,
              .08
            ),
            transparent 45%
          ),

          linear-gradient(
            145deg,
            #15130c,
            #090909
          ) !important;

      }


      #manaV964Launchpad
      [data-v964-launch="progress"]{

        border-color:
          rgba(
            78,
            161,
            205,
            .45
          ) !important;

        background:

          radial-gradient(
            circle at top left,
            rgba(
              71,
              160,
              205,
              .07
            ),
            transparent 45%
          ),

          linear-gradient(
            145deg,
            #111416,
            #090909
          ) !important;

      }


      /* =====================================
         WORKOUT SCREEN POLISH
         ===================================== */

      #manaV83Content
      .mana-v85-day{

        transition:

          border-color
          .18s ease,

          transform
          .18s ease,

          box-shadow
          .18s ease !important;

      }


      #manaV83Content
      .mana-v85-day::after{

        content:"";

        position:
          absolute;

        top:
          0;

        left:
          0;

        width:
          4px;

        height:
          100%;

        opacity:
          .70;

        pointer-events:
          none;

      }


      /* GOLD */

      #manaV83Content
      .mana-v85-day[
        data-m1018-tone="gold"
      ]{

        border-color:
          #4f4526 !important;

      }


      #manaV83Content
      .mana-v85-day[
        data-m1018-tone="gold"
      ]::after{

        background:
          linear-gradient(
            180deg,
            #f3d875,
            transparent
          );

      }


      #manaV83Content
      .mana-v85-day[
        data-m1018-tone="gold"
      ]
      .mana-v85-num{

        border-color:
          #6a5720 !important;

        color:
          #f3d875 !important;

      }


      /* TEAL */

      #manaV83Content
      .mana-v85-day[
        data-m1018-tone="teal"
      ]{

        border-color:
          rgba(
            52,
            147,
            135,
            .42
          ) !important;

      }


      #manaV83Content
      .mana-v85-day[
        data-m1018-tone="teal"
      ]::after{

        background:
          linear-gradient(
            180deg,
            #46c4b2,
            transparent
          );

      }


      #manaV83Content
      .mana-v85-day[
        data-m1018-tone="teal"
      ]
      .mana-v85-num{

        border-color:
          rgba(
            70,
            196,
            178,
            .45
          ) !important;

        color:
          #70d7c8 !important;

      }


      /* BLUE */

      #manaV83Content
      .mana-v85-day[
        data-m1018-tone="blue"
      ]{

        border-color:
          rgba(
            66,
            133,
            190,
            .42
          ) !important;

      }


      #manaV83Content
      .mana-v85-day[
        data-m1018-tone="blue"
      ]::after{

        background:
          linear-gradient(
            180deg,
            #56a8e5,
            transparent
          );

      }


      #manaV83Content
      .mana-v85-day[
        data-m1018-tone="blue"
      ]
      .mana-v85-num{

        border-color:
          rgba(
            86,
            168,
            229,
            .42
          ) !important;

        color:
          #77bdf0 !important;

      }


      /* PURPLE */

      #manaV83Content
      .mana-v85-day[
        data-m1018-tone="purple"
      ]{

        border-color:
          rgba(
            132,
            99,
            186,
            .40
          ) !important;

      }


      #manaV83Content
      .mana-v85-day[
        data-m1018-tone="purple"
      ]::after{

        background:
          linear-gradient(
            180deg,
            #a784dc,
            transparent
          );

      }


      #manaV83Content
      .mana-v85-day[
        data-m1018-tone="purple"
      ]
      .mana-v85-num{

        border-color:
          rgba(
            167,
            132,
            220,
            .42
          ) !important;

        color:
          #bda0eb !important;

      }


      /* =====================================
         EXPANDED WORKOUT
         ===================================== */

      #manaV83Content
      .mana-v85-day.mana-v964-expanded{

        box-shadow:

          0
          16px
          38px
          rgba(
            0,
            0,
            0,
            .34
          ),

          inset
          0
          0
          30px
          rgba(
            243,
            216,
            117,
            .025
          ) !important;

      }


      #manaV83Content
      .mana-v85-count{

        padding:
          5px
          8px !important;

        border:
          1px solid
          #343027 !important;

        border-radius:
          999px !important;

        background:
          #0c0c0a !important;

      }


      /* =====================================
         WEEK SELECTOR POLISH
         ===================================== */

      #manaV1017ProgramBlock
      .m1017-week{

        position:
          relative;

        overflow:
          hidden;

      }


      #manaV1017ProgramBlock
      .m1017-week.active{

        box-shadow:

          0
          8px
          20px
          rgba(
            196,
            153,
            42,
            .12
          ),

          inset
          0
          0
          16px
          rgba(
            243,
            216,
            117,
            .05
          ) !important;

      }


      #manaV1017ProgramBlock
      .m1017-week.active::after{

        content:"";

        position:
          absolute;

        left:
          10px;

        right:
          10px;

        bottom:
          0;

        height:
          2px;

        background:
          linear-gradient(
            90deg,
            transparent,
            #f3d875,
            transparent
          );

      }


      /* =====================================
         HIDE OLD TOP REQUEST PANEL

         v10.18 recreates it below workouts.
         ===================================== */

      #manaV1017ProgramBlock
      > .m1017-request{

        display:
          none !important;

      }


      /* =====================================
         BOTTOM PROGRAM UPGRADE EXPERIENCE
         ===================================== */

      #${UPGRADE_ID}{

        position:
          relative;

        overflow:
          hidden;

        margin:
          22px
          0
          8px;

        padding:
          20px;

        border-radius:
          22px;

        box-shadow:
          0
          14px
          34px
          rgba(
            0,
            0,
            0,
            .24
          );

      }


      #${UPGRADE_ID}::before{

        content:"";

        position:
          absolute;

        top:
          0;

        left:
          20px;

        right:
          20px;

        height:
          2px;

      }


      /* AVAILABLE */

      #${UPGRADE_ID}.available{

        border:
          1px solid
          #655426;

        background:

          radial-gradient(
            circle at top right,
            rgba(
              243,
              216,
              117,
              .10
            ),
            transparent 42%
          ),

          linear-gradient(
            145deg,
            #17140c,
            #090909
          );

      }


      #${UPGRADE_ID}.available::before{

        background:
          linear-gradient(
            90deg,
            transparent,
            #f3d875,
            transparent
          );

      }


      /* PENDING */

      #${UPGRADE_ID}.pending{

        border:
          1px solid
          #75571f;

        background:

          radial-gradient(
            circle at top right,
            rgba(
              222,
              154,
              40,
              .11
            ),
            transparent 44%
          ),

          linear-gradient(
            145deg,
            #1b1409,
            #090909
          );

      }


      #${UPGRADE_ID}.pending::before{

        background:
          linear-gradient(
            90deg,
            transparent,
            #e3a83b,
            transparent
          );

      }


      /* READY */

      #${UPGRADE_ID}.ready{

        border:
          1px solid
          rgba(
            49,
            183,
            153,
            .62
          );

        background:

          radial-gradient(
            circle at top right,
            rgba(
              50,
              197,
              165,
              .14
            ),
            transparent 44%
          ),

          linear-gradient(
            145deg,
            #0d1c18,
            #070b0a
          );

        box-shadow:

          0
          14px
          34px
          rgba(
            0,
            0,
            0,
            .28
          ),

          0
          0
          28px
          rgba(
            49,
            183,
            153,
            .06
          );

      }


      #${UPGRADE_ID}.ready::before{

        background:
          linear-gradient(
            90deg,
            transparent,
            #42d1b0,
            transparent
          );

      }


      .m1018-upgrade-kicker{

        font-size:
          9px;

        font-weight:
          950;

        letter-spacing:
          .15em;

        text-transform:
          uppercase;

      }


      .available
      .m1018-upgrade-kicker{

        color:
          #d9bb5b;

      }


      .pending
      .m1018-upgrade-kicker{

        color:
          #dfa742;

      }


      .ready
      .m1018-upgrade-kicker{

        color:
          #54d2b5;

      }


      .m1018-upgrade-title{

        margin-top:
          6px;

        color:
          #fff;

        font-size:
          23px;

        font-weight:
          950;

        line-height:
          1.1;

      }


      .ready
      .m1018-upgrade-title{

        color:
          #d9fff6;

      }


      .m1018-upgrade-text{

        max-width:
          620px;

        margin-top:
          8px;

        color:
          #a2a2a2;

        font-size:
          13px;

        line-height:
          1.5;

      }


      .ready
      .m1018-upgrade-text{

        color:
          #a8cfc5;

      }


      .m1018-upgrade-action{

        width:
          100%;

        min-height:
          54px;

        margin-top:
          16px;

        border-radius:
          15px;

        font-size:
          12px;

        font-weight:
          950;

        cursor:
          pointer;

      }


      .available
      .m1018-upgrade-action{

        border:
          1px solid
          #987d28;

        background:

          linear-gradient(
            135deg,
            #f3d875,
            #bd9029
          );

        color:
          #111;

      }


      .pending
      .m1018-upgrade-action{

        border:
          1px solid
          #71551e;

        background:
          #1b1408;

        color:
          #d6a745;

        cursor:
          default;

      }


      .ready
      .m1018-upgrade-action{

        border:
          1px solid
          #47bea4;

        background:

          linear-gradient(
            135deg,
            #64ddbf,
            #2ca88d
          );

        color:
          #06110e;

        box-shadow:
          0
          10px
          24px
          rgba(
            49,
            183,
            153,
            .13
          );

      }


      .m1018-ready-badge{

        display:
          inline-flex;

        align-items:
          center;

        gap:
          6px;

        margin-top:
          12px;

        padding:
          6px
          9px;

        border:
          1px solid
          rgba(
            70,
            196,
            168,
            .40
          );

        border-radius:
          999px;

        background:
          rgba(
            42,
            138,
            117,
            .10
          );

        color:
          #64d7bd;

        font-size:
          9px;

        font-weight:
          950;

        letter-spacing:
          .05em;

      }


      /* =====================================
         COACH CHAT SPACING
         ===================================== */

      #${UPGRADE_ID}
      + #${CHAT_ID}{

        margin-top:
          12px;

      }


      /* =====================================
         PHONE
         ===================================== */

      @media(max-width:600px){

        #manaV964Launchpad
        .mana-v964-icon{

          width:
            56px !important;

          height:
            56px !important;

          flex-basis:
            56px !important;

          border-radius:
            16px !important;

        }


        #${UPGRADE_ID}{

          padding:
            17px;

          border-radius:
            19px;

        }


        .m1018-upgrade-title{

          font-size:
            21px;

        }


        .m1018-upgrade-text{

          font-size:
            12px;

        }


        .m1018-upgrade-action{

          min-height:
            52px;

          font-size:
            11px;

        }

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     OVERVIEW ICONS
     ========================================= */

  function decorateOverviewIcons() {

    if (
      activeTab() !==
      "overview"
    ) {

      return;

    }


    const map = {

      program:
        "tab-workout.png",

      fuel:
        "tab-fuel.png",

      progress:
        "tab-progress.png"

    };


    Object
      .entries(
        map
      )
      .forEach(
        (
          [
            destination,
            filename
          ]
        ) => {

          const card =
            document.querySelector(
              `#manaV964Launchpad [data-v964-launch="${destination}"]`
            );


          const icon =
            card
              ?.querySelector(
                ".mana-v964-icon"
              );


          if (
            !icon
          ) {

            return;

          }


          if (
            icon.dataset
              .m1018Icon ===
            BUILD
          ) {

            return;

          }


          icon.dataset
            .m1018Icon =
            BUILD;


          icon.innerHTML = `

            <img
              src="${asset(
                filename
              )}"
              alt=""
              aria-hidden="true"
            >

          `;

        }
      );


    /*
      Profile is not a bottom-tab destination,
      so keep a clean profile symbol rather
      than incorrectly using another tab icon.
    */

    const profile =
      document
        .querySelector(
          '#manaV964Launchpad [data-v964-launch="profile"] .mana-v964-icon'
        );


    if (
      profile &&
      profile.dataset
        .m1018Profile !==
        BUILD
    ) {

      profile.dataset
        .m1018Profile =
        BUILD;


      profile.innerHTML = `

        <span
          class="m1018-profile-symbol"
        >
          ◎
        </span>

      `;

    }

  }


  /* =========================================
     WORKOUT CARD COLOUR
     ========================================= */

  function decorateWorkoutCards() {

    if (
      activeTab() !==
      "program"
    ) {

      return;

    }


    const tones =
      [
        "gold",
        "teal",
        "blue",
        "purple"
      ];


    document
      .querySelectorAll(
        "#manaV83Content .mana-v85-day"
      )
      .forEach(
        (
          card,
          index
        ) => {

          card.dataset
            .m1018Tone =
            tones[
              index %
              tones.length
            ];

        }
      );

  }


  /* =========================================
     DETERMINE REQUEST STATE
     ========================================= */

  function requestState() {

    const oldRequest =
      $(
        BLOCK_ID
      )
        ?.querySelector(
          ".m1017-request"
        );


    if (
      !oldRequest
    ) {

      return {
        state:
          "available",

        title:
          "Ready for your next block?",

        text:
          "Request a program upgrade anytime. Your coach will review your current training block and recent workout history.",

        action:
          "REQUEST PROGRAM UPGRADE"
      };

    }


    if (
      oldRequest.querySelector(
        ".m1017-ready"
      )
    ) {

      return {
        state:
          "ready",

        title:
          "Your next block is ready",

        text:
          "Your coach has prepared your next 4-week training block. Open it when you're ready to begin the next stage.",

        action:
          "VIEW NEXT BLOCK →"
      };

    }


    const text =
      String(
        oldRequest.textContent ||
        ""
      )
        .toLowerCase();


    if (
      text.includes(
        "working on your next"
      )
    ) {

      return {
        state:
          "pending",

        title:
          "Your coach is building your next block",

        text:
          "Your request has been received. Your coach is reviewing your progress and preparing the next 4-week phase.",

        action:
          "COACH WORKING ON IT"
      };

    }


    if (
      text.includes(
        "program upgrade requested"
      )
      ||
      text.includes(
        "request sent"
      )
    ) {

      return {
        state:
          "pending",

        title:
          "Program upgrade requested",

        text:
          "Your request has been sent to your coach with your current week, block and recent training history.",

        action:
          "REQUEST SENT ✓"
      };

    }


    return {
      state:
        "available",

      title:
        "Ready for your next block?",

      text:
        "Request a program upgrade anytime. Your coach will review your current training block and recent workout history.",

      action:
        "REQUEST PROGRAM UPGRADE"
    };

  }


  /* =========================================
     NEXT BLOCK NAVIGATION
     ========================================= */

  function openNextBlock() {

    /*
      Coach-assigned programs already live in
      the app's Programs view through v10.02.

      Navigate there, refresh assignments,
      then open the first/latest assigned card
      when available.
    */

    const nav =
      document.querySelector(
        '#bottomNav [data-page="programs"], [data-page="programs"]'
      );


    if (
      nav
    ) {

      nav.click();

    }


    setTimeout(
      () => {

        if (
          typeof
            window
              .refreshManaAssignedPrograms ===
          "function"
        ) {

          window
            .refreshManaAssignedPrograms();

        }

      },
      180
    );


    setTimeout(
      () => {

        const latest =
          document.querySelector(
            "#manaV1002AssignedPrograms .m1002-program"
          );


        if (
          latest
        ) {

          latest.click();

        }

      },
      700
    );

  }


  /* =========================================
     UPGRADE ACTION
     ========================================= */

  function handleUpgradeAction(
    state
  ) {

    if (
      state ===
      "available"
    ) {

      if (
        typeof
          window
            .requestManaProgramUpgrade ===
        "function"
      ) {

        window
          .requestManaProgramUpgrade();

      }


      setTimeout(
        scheduleRefresh,
        180
      );


      setTimeout(
        scheduleRefresh,
        700
      );


      return;

    }


    if (
      state ===
      "ready"
    ) {

      openNextBlock();

    }

  }


  /* =========================================
     BUILD BOTTOM UPGRADE CARD
     ========================================= */

  function upgradeHtml(
    config
  ) {

    const ready =
      config.state ===
      "ready";


    return `

      <section
        id="${UPGRADE_ID}"
        class="${config.state}"
      >

        <div
          class="m1018-upgrade-kicker"
        >

          ${
            ready
              ? "MANA • NEXT PHASE"
              : "MANA • PROGRAM UPGRADE"
          }

        </div>


        <div
          class="m1018-upgrade-title"
        >
          ${config.title}
        </div>


        <div
          class="m1018-upgrade-text"
        >
          ${config.text}
        </div>


        ${
          ready

            ? `

              <div
                class="m1018-ready-badge"
              >
                ✓ COACH APPROVED
              </div>

            `

            : ""
        }


        <button
          type="button"
          class="m1018-upgrade-action"
          id="manaV1018UpgradeAction"
          ${
            config.state ===
              "pending"

              ? "disabled"

              : ""
          }
        >

          ${config.action}

        </button>

      </section>

    `;

  }


  /* =========================================
     PLACE BELOW WORKOUTS / ABOVE CHAT
     ========================================= */

  function placeUpgradeExperience() {

    if (
      activeTab() !==
      "program"
    ) {

      $(
        UPGRADE_ID
      )
        ?.remove();


      return;

    }


    const holder =
      $(
        "manaV83Content"
      );


    if (
      !holder
    ) {

      return;

    }


    const block =
      $(
        BLOCK_ID
      );


    if (
      !block
    ) {

      return;

    }


    const config =
      requestState();


    $(
      UPGRADE_ID
    )
      ?.remove();


    const shell =
      document.createElement(
        "div"
      );


    shell.innerHTML =
      upgradeHtml(
        config
      );


    const upgrade =
      shell.firstElementChild;


    const chat =
      $(
        CHAT_ID
      );


    /*
      Exact placement requested:
      AFTER all workouts,
      BEFORE Coach Chat.
    */

    if (
      chat &&
      chat.parentElement ===
        holder
    ) {

      holder.insertBefore(
        upgrade,
        chat
      );

    } else {

      holder.appendChild(
        upgrade
      );

    }


    const action =
      $(
        "manaV1018UpgradeAction"
      );


    if (
      action &&
      !action.disabled
    ) {

      action.onclick =
        () => {

          handleUpgradeAction(
            config.state
          );

        };

    }

  }


  /* =========================================
     ENSURE CHAT ORDER
     ========================================= */

  function ensureUpgradeBeforeChat() {

    const upgrade =
      $(
        UPGRADE_ID
      );


    const chat =
      $(
        CHAT_ID
      );


    const holder =
      $(
        "manaV83Content"
      );


    if (
      !upgrade ||
      !chat ||
      !holder
    ) {

      return;

    }


    if (
      upgrade.nextElementSibling !==
      chat
    ) {

      holder.insertBefore(
        upgrade,
        chat
      );

    }

  }


  /* =========================================
     REFRESH
     ========================================= */

  function refresh() {

    if (
      !strengthOpen()
    ) {

      return;

    }


    installStyles();


    if (
      activeTab() ===
      "overview"
    ) {

      decorateOverviewIcons();

    }


    if (
      activeTab() ===
      "program"
    ) {

      decorateWorkoutCards();

      placeUpgradeExperience();

      ensureUpgradeBeforeChat();

    }

  }


  function scheduleRefresh(
    delay = 50
  ) {

    clearTimeout(
      refreshTimer
    );


    refreshTimer =
      setTimeout(
        refresh,
        delay
      );


    [
      140,
      320,
      700
    ]
      .forEach(
        wait => {

          setTimeout(
            refresh,
            wait
          );

        }
      );

  }


  /* =========================================
     CONTENT OBSERVER
     ========================================= */

  function attachObserver() {

    observer
      ?.disconnect();


    const holder =
      $(
        "manaV83Content"
      );


    if (
      !holder
    ) {

      return;

    }


    observer =
      new MutationObserver(
        () => {

          if (
            !strengthOpen()
          ) {

            return;

          }


          if (
            activeTab() ===
              "overview"
          ) {

            if (
              document
                .querySelector(
                  "#manaV964Launchpad"
                )
            ) {

              scheduleRefresh(
                30
              );

            }

          }


          if (
            activeTab() ===
              "program"
          ) {

            if (
              document
                .querySelector(
                  "#manaV83Content .mana-v85-day"
                )
            ) {

              /*
                Avoid recursive refresh from
                our own upgrade card.
              */

              if (
                !$(
                  UPGRADE_ID
                )
              ) {

                scheduleRefresh(
                  30
                );

              }

            }

          }

        }
      );


    observer.observe(
      holder,
      {
        childList:
          true,

        subtree:
          false
      }
    );

  }


  /* =========================================
     EVENTS
     ========================================= */

  function bindEvents() {

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "#manaV83Tabs .mana-v83-tab"
          )
        ) {

          scheduleRefresh(
            120
          );

        }


        if (
          event.target.closest(
            "[data-v964-launch]"
          )
        ) {

          scheduleRefresh(
            140
          );

        }


        if (
          event.target.closest(
            "[data-m1017-week]"
          )
        ) {

          scheduleRefresh(
            80
          );

        }

      },
      true
    );


    [
      "mana:program-tab-change",
      "mana:workout-progress-change",
      "mana:program-upgrade-requested",
      "mana:strength-synced"
    ]
      .forEach(
        eventName => {

          window.addEventListener(
            eventName,
            () => {

              scheduleRefresh(
                100
              );

            }
          );

        }
      );


    window.addEventListener(
      "focus",
      () => {

        scheduleRefresh(
          120
        );

      }
    );

  }


  /* =========================================
     PUBLIC API
     ========================================= */

  function expose() {

    window
      .refreshManaPremiumClientExperience =
      scheduleRefresh;


    window
      .MANA_PREMIUM_CLIENT_BUILD =
      BUILD;

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    expose();

    bindEvents();

    attachObserver();


    [
      400,
      900,
      1600
    ]
      .forEach(
        delay => {

          setTimeout(
            refresh,
            delay
          );

        }
      );


    console.log(
      "Mana Premium Client Experience",
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
