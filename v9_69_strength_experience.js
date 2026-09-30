/* =========================================
   MANA MOVEMENT TRAINING v9.69.1
   STRENGTH EXPERIENCE

   COACH CHAT
   - OVERVIEW
   - PROGRAM
   - FUEL
   - SAME EXISTING CHAT THREAD

   PROGRAM
   - PREMIUM VISUAL POLISH
   - NO WORKOUT NAVIGATION CHANGES
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "96910";

  const STYLE_ID =
    "mana-v969-strength-style";

  const CHAT_ID =
    "manaV969CoachChat";


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
        ) &&

      title
        ?.textContent
        ?.trim()
        ?.toUpperCase() ===
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
          "#manaV83Tabs " +
          ".mana-v83-tab.active"
        )
        ?.dataset
        ?.v83Tab ||
      null
    );
  }


  /* =========================================
     STYLE
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

      /* PROGRAM SUMMARY */

      #manaV83Content
      .mana-v85-summary{

        margin:
          5px
          0
          20px !important;

        padding:
          15px
          17px !important;

        border:
          1px solid
          #454025 !important;

        border-radius:
          17px !important;

        background:
          linear-gradient(
            145deg,
            #17150d,
            #0b0b09
          ) !important;

        color:
          #d0b65c !important;

        font-size:
          12px !important;

        font-weight:
          950 !important;

        letter-spacing:
          .08em !important;

        text-transform:
          uppercase !important;
      }


      /* WORKOUT CARDS */

      #manaV83Content
      .mana-v85-day{

        position:
          relative !important;

        overflow:
          hidden !important;

        margin-bottom:
          15px !important;

        padding:
          22px !important;

        border:
          1px solid
          #373328 !important;

        border-radius:
          23px !important;

        background:
          linear-gradient(
            145deg,
            #15140f,
            #0a0a09
          ) !important;

        box-shadow:
          0
          12px
          30px
          rgba(0,0,0,.2) !important;
      }


      #manaV83Content
      .mana-v85-day::before{

        content:"";

        position:absolute;

        top:0;
        left:22px;
        right:22px;

        height:2px;

        background:
          linear-gradient(
            90deg,
            transparent,
            #b99a3e,
            transparent
          );
      }


      #manaV83Content
      .mana-v85-day.mana-v964-expanded{

        border-color:
          #786524 !important;

        background:
          linear-gradient(
            145deg,
            #1b180d,
            #0c0c0a
          ) !important;
      }


      #manaV83Content
      .mana-v85-day-label{

        color:
          #d5b85c !important;

        font-size:
          11px !important;

        font-weight:
          950 !important;

        letter-spacing:
          .14em !important;
      }


      #manaV83Content
      .mana-v85-title{

        margin-top:
          7px !important;

        color:#fff !important;

        font-size:
          25px !important;

        line-height:
          1.07 !important;

        font-weight:
          950 !important;
      }


      .mana-v969-workout-meta{

        margin-top:
          9px;

        color:#888;

        font-size:
          12px;

        line-height:
          1.45;
      }


      #manaV83Content
      .mana-v85-count{

        color:#999 !important;

        font-size:
          10px !important;

        font-weight:
          900 !important;
      }


      #manaV83Content
      .mana-v85-exercises{

        margin-top:
          18px !important;

        padding-top:
          7px !important;

        border-top:
          1px solid
          #29271f !important;
      }


      #manaV83Content
      .mana-v85-exercise{

        min-height:
          48px !important;

        padding:
          10px
          2px !important;

        border-bottom:
          1px solid
          #24231e !important;

        color:
          #ddd !important;
      }


      #manaV83Content
      .mana-v85-num{

        display:
          inline-grid !important;

        place-items:
          center !important;

        width:
          28px !important;

        height:
          28px !important;

        margin-right:
          9px !important;

        border:
          1px solid
          #53461d !important;

        border-radius:
          9px !important;

        background:
          #121009 !important;

        color:
          #e1c15b !important;

        font-size:
          11px !important;

        font-weight:
          950 !important;
      }


      #manaV83Content
      .mana-v85-start{

        width:
          100% !important;

        min-height:
          56px !important;

        margin-top:
          18px !important;

        border:0 !important;

        border-radius:
          16px !important;

        background:
          linear-gradient(
            135deg,
            #f3d875,
            #bc8f29
          ) !important;

        color:#090909 !important;

        font-size:
          13px !important;

        font-weight:
          950 !important;
      }


      /* =====================================
         SHARED COACH CHAT CARD
         ===================================== */

      #${CHAT_ID}{

        margin:
          22px
          0
          10px;

        padding:
          21px;

        border:
          1px solid
          #665522;

        border-radius:
          22px;

        background:
          linear-gradient(
            145deg,
            #19160c,
            #0b0b09
          );

        box-shadow:
          0
          12px
          28px
          rgba(0,0,0,.18);
      }


      .mana-v969-chat-head{

        display:flex;

        align-items:
          flex-start;

        justify-content:
          space-between;

        gap:
          14px;
      }


      .mana-v969-chat-kicker{

        color:
          #d2b55a;

        font-size:
          10px;

        font-weight:
          950;

        letter-spacing:
          .14em;

        text-transform:
          uppercase;
      }


      .mana-v969-chat-title{

        margin-top:
          6px;

        color:#fff;

        font-size:
          22px;

        font-weight:
          950;
      }


      .mana-v969-chat-text{

        max-width:
          560px;

        margin-top:
          8px;

        color:#aaa;

        font-size:
          14px;

        line-height:
          1.5;
      }


      .mana-v969-chat-live{

        padding:
          6px
          9px;

        border:
          1px solid
          #6a5922;

        border-radius:
          999px;

        color:
          #f3d875;

        font-size:
          9px;

        font-weight:
          950;

        letter-spacing:
          .09em;
      }


      .mana-v969-chat-button{

        width:
          100%;

        min-height:
          53px;

        margin-top:
          17px;

        border:
          1px solid
          #786522;

        border-radius:
          15px;

        background:
          #15130b;

        color:
          #f3d875;

        font-size:
          12px;

        font-weight:
          950;
      }


      @media(max-width:700px){

        #manaV83Content
        .mana-v85-day{

          padding:
            19px
            17px !important;
        }


        #manaV83Content
        .mana-v85-title{

          font-size:
            22px !important;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     COACH CHAT
     ========================================= */

  function chatCopy(tab) {

    if (
      tab ===
      "program"
    ) {

      return (
        "Ask about a workout, exercise, substitution, technique or progression."
      );

    }


    if (
      tab ===
      "fuel"
    ) {

      return (
        "Ask about calories, protein, meals, water or your daily Fuel targets."
      );

    }


    return (
      "Message your coach about your training, Fuel, progress or anything you need help with."
    );
  }


  function renderChatSurface() {

    if (
      !strengthOpen()
    ) {
      return;
    }


    const tab =
      activeTab();


    if (
      ![
        "overview",
        "program",
        "fuel"
      ].includes(
        tab
      )
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


    document
      .getElementById(
        CHAT_ID
      )
      ?.remove();


    const chat =
      document.createElement(
        "div"
      );


    chat.id =
      CHAT_ID;


    chat.innerHTML = `

      <div
        class="mana-v969-chat-head"
      >

        <div>

          <div
            class="mana-v969-chat-kicker"
          >
            COACH SUPPORT
          </div>


          <div
            class="mana-v969-chat-title"
          >
            Coach Chat
          </div>


          <div
            class="mana-v969-chat-text"
          >
            ${chatCopy(tab)}
          </div>

        </div>


        <div
          class="mana-v969-chat-live"
        >
          LIVE
        </div>

      </div>


      <button
        type="button"
        class="mana-v969-chat-button"
        id="manaV969ChatOpen"
      >
        MESSAGE YOUR COACH →
      </button>

    `;


    holder.appendChild(
      chat
    );


    document
      .getElementById(
        "manaV969ChatOpen"
      )
      .onclick =
        () => {

          if (
            typeof
              window
                .openManaStrengthClientChat ===
            "function"
          ) {

            window
              .openManaStrengthClientChat();

          }

        };
  }


  /* =========================================
     PROGRAM POLISH
     ========================================= */

  function decorateProgramCards() {

    if (
      activeTab() !==
      "program"
    ) {
      return;
    }


    document
      .querySelectorAll(
        "#manaV83Content " +
        ".mana-v85-day"
      )
      .forEach(
        card => {

          const title =
            card.querySelector(
              ".mana-v85-title"
            );


          const count =
            card.querySelector(
              ".mana-v85-count"
            );


          if (
            title &&
            !card.querySelector(
              ".mana-v969-workout-meta"
            )
          ) {

            const meta =
              document.createElement(
                "div"
              );


            meta.className =
              "mana-v969-workout-meta";


            meta.textContent =
              `${
                count
                  ?.textContent
                  ?.trim() ||
                "Workout"
              } • Tap to view session`;


            title
              .insertAdjacentElement(
                "afterend",
                meta
              );

          }

        }
      );
  }


  function refresh() {

    if (
      !strengthOpen()
    ) {
      return;
    }


    if (
      activeTab() ===
      "program"
    ) {

      decorateProgramCards();

    }


    renderChatSurface();
  }


  function scheduleRefresh() {

    [
      40,
      120,
      280
    ].forEach(
      delay => {

        setTimeout(
          refresh,
          delay
        );

      }
    );
  }


  function init() {

    installStyles();


    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "#manaV83Tabs .mana-v83-tab"
          ) ||
          event.target.closest(
            "#manaV80Strength"
          )
        ) {

          scheduleRefresh();

        }

      },
      true
    );


    [
      "mana:program-tab-change",
      "mana:workout-progress-change",
      "mana:strength-synced"
    ].forEach(
      eventName => {

        window.addEventListener(
          eventName,
          scheduleRefresh
        );

      }
    );


    [
      500,
      1200,
      2000
    ].forEach(
      delay => {

        setTimeout(
          refresh,
          delay
        );

      }
    );


    window
      .MANA_STRENGTH_EXPERIENCE_BUILD =
      BUILD;


    window
      .refreshManaStrengthExperience =
      scheduleRefresh;
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
