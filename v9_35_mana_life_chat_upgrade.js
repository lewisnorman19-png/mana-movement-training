/* =========================================
   MANA MOVEMENT TRAINING v9.35.0
   MANA LIFE — SUPPORT CHAT UPGRADE

   PURPOSE:
   - Upgrade Mana Life Support Chat only
   - Reuse existing Supabase coach conversation
   - Add quick-start prompts
   - Improve readability and spacing
   - Auto-grow message box
   - Keep Mana Strength chat unchanged
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "93500";

  const STYLE_ID =
    "mana-v935-life-chat-style";

  const MODAL_ID =
    "manaV95ChatModal";

  const INTRO_ID =
    "manaV935LifeChatIntro";

  const QUICK_ID =
    "manaV935LifeChatQuick";

  let lifeChatPending =
    false;

  let wrappedGlobal =
    false;


  const QUICK_PROMPTS = [
    "I'm having a rough day and need to talk.",
    "I need help getting back on track.",
    "Can you help me think this through?",
    "I need some accountability today.",
    "I just need to get this out of my head."
  ];


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


  /* =========================================
     STYLES
     ========================================= */

  function injectStyles() {
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

      #${MODAL_ID}.mana-v935-life-mode{
        background:#050505;
      }


      #${MODAL_ID}.mana-v935-life-mode
      .mana-v950-header{
        padding:
          calc(
            env(
              safe-area-inset-top
            ) + 15px
          )
          16px
          14px;

        border-bottom:
          1px solid
          #2b2717;

        background:
          linear-gradient(
            180deg,
            #111006,
            #090909
          );
      }


      #${MODAL_ID}.mana-v935-life-mode
      .mana-v950-header-kicker{
        font-size:11px;
        color:#f3d875;
      }


      #${MODAL_ID}.mana-v935-life-mode
      .mana-v950-header-title{
        font-size:22px;
        line-height:1.2;
      }


      #${MODAL_ID}.mana-v935-life-mode
      .mana-v950-header-sub{
        margin-top:5px;

        color:#aaa;

        font-size:12px;

        line-height:1.45;
      }


      #${INTRO_ID}{
        flex:
          0
          0
          auto;

        padding:
          12px
          16px;

        border-bottom:
          1px solid
          #242424;

        background:#0b0b0b;
      }


      #${INTRO_ID}
      .mana-v935-intro-inner{
        width:
          min(
            620px,
            100%
          );

        margin:auto;

        padding:
          13px
          14px;

        border:
          1px solid
          #4f431b;

        border-radius:15px;

        background:
          linear-gradient(
            145deg,
            #171407,
            #0c0c0c
          );
      }


      #${INTRO_ID}
      .mana-v935-intro-kicker{
        color:#f3d875;

        font-size:10px;
        font-weight:900;

        letter-spacing:.11em;
      }


      #${INTRO_ID}
      .mana-v935-intro-copy{
        margin-top:5px;

        color:#c2c2c2;

        font-size:13px;

        line-height:1.55;
      }


      #${MODAL_ID}.mana-v935-life-mode
      .mana-v950-messages{
        padding-top:16px;
      }


      #${MODAL_ID}.mana-v935-life-mode
      .mana-v950-empty{
        margin:
          28px
          auto;

        color:#aaa;

        font-size:14px;

        line-height:1.6;
      }


      #${MODAL_ID}.mana-v935-life-mode
      .mana-v950-message{
        width:
          min(
            82%,
            440px
          );

        padding:
          12px
          14px;

        margin:
          9px
          0;
      }


      #${MODAL_ID}.mana-v935-life-mode
      .mana-v950-message-name{
        font-size:10px;
      }


      #${MODAL_ID}.mana-v935-life-mode
      .mana-v950-message-body{
        font-size:14px;
        line-height:1.6;
      }


      #${MODAL_ID}.mana-v935-life-mode
      .mana-v950-message-time{
        margin-top:7px;
        font-size:9px;
      }


      #${MODAL_ID}.mana-v935-life-mode
      .mana-v950-compose{
        padding-top:10px;

        border-top:
          1px solid
          #2a2616;

        background:#090909;
      }


      #${QUICK_ID}{
        width:
          min(
            640px,
            100%
          );

        margin:
          0
          auto
          10px;
      }


      #${QUICK_ID}
      .mana-v935-quick-label{
        margin-bottom:7px;

        color:#999;

        font-size:10px;
        font-weight:900;

        letter-spacing:.08em;

        text-transform:
          uppercase;
      }


      #${QUICK_ID}
      .mana-v935-quick-list{
        display:flex;

        gap:7px;

        overflow-x:auto;

        padding-bottom:3px;

        scrollbar-width:none;
      }


      #${QUICK_ID}
      .mana-v935-quick-list::-webkit-scrollbar{
        display:none;
      }


      .mana-v935-quick-btn{
        flex:
          0
          0
          auto;

        min-height:38px;

        padding:
          0
          12px;

        border:
          1px solid
          #3a3420;

        border-radius:999px;

        background:#111006;

        color:#e4d27d;

        font-size:11px;
        font-weight:800;

        white-space:nowrap;

        cursor:pointer;

        touch-action:
          manipulation;
      }


      .mana-v935-quick-btn:active{
        transform:
          scale(
            .98
          );
      }


      #${MODAL_ID}.mana-v935-life-mode
      .mana-v950-input{
        min-height:52px;
        max-height:150px;

        padding:
          13px
          14px;

        border-color:#3a3a3a;

        font-size:14px;

        line-height:1.5;
      }


      #${MODAL_ID}.mana-v935-life-mode
      .mana-v950-send{
        height:52px;
        min-width:82px;

        font-size:13px;
      }


      #${MODAL_ID}.mana-v935-life-mode
      .mana-v950-status{
        font-size:10px;
      }


      @media(
        max-width:560px
      ){

        #${INTRO_ID}{
          padding:
            9px
            12px;
        }


        #${INTRO_ID}
        .mana-v935-intro-inner{
          padding:12px;
        }


        #${MODAL_ID}.mana-v935-life-mode
        .mana-v950-message{
          width:
            min(
              88%,
              430px
            );
        }


        #${QUICK_ID}
        .mana-v935-quick-label{
          font-size:9px;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     INTRO PANEL
     ========================================= */

  function ensureIntro() {
    let intro =
      document.getElementById(
        INTRO_ID
      );


    if (!intro) {
      intro =
        document.createElement(
          "div"
        );


      intro.id =
        INTRO_ID;


      intro.innerHTML = `

        <div
          class="mana-v935-intro-inner"
        >

          <div
            class="mana-v935-intro-kicker"
          >
            SUPPORT • CONNECTION • PERSPECTIVE
          </div>


          <div
            class="mana-v935-intro-copy"
          >
            Use this space to check in,
            ask for perspective or get some
            accountability. Your message
            goes directly into your existing
            Mana coaching conversation
            with Lewis.
          </div>

        </div>

      `;


      const messages =
        document.getElementById(
          "manaV95Messages"
        );


      messages
        ?.insertAdjacentElement(
          "beforebegin",
          intro
        );
    }


    intro.hidden =
      false;
  }


  /* =========================================
     QUICK PROMPTS
     ========================================= */

  function ensureQuickPrompts() {
    const compose =
      document.querySelector(
        `#${MODAL_ID} .mana-v950-compose`
      );


    if (!compose) {
      return;
    }


    let quick =
      document.getElementById(
        QUICK_ID
      );


    if (!quick) {
      quick =
        document.createElement(
          "div"
        );


      quick.id =
        QUICK_ID;


      quick.innerHTML = `

        <div
          class="mana-v935-quick-label"
        >
          Need a starting point?
        </div>


        <div
          class="mana-v935-quick-list"
        >

          ${QUICK_PROMPTS
            .map(
              (
                prompt,
                index
              ) => `

                <button
                  type="button"
                  class="mana-v935-quick-btn"
                  data-v935-prompt="${index}"
                >
                  ${esc(
                    prompt
                  )}
                </button>

              `
            )
            .join("")}

        </div>

      `;


      compose.insertBefore(
        quick,
        compose.firstChild
      );


      quick
        .querySelectorAll(
          "[data-v935-prompt]"
        )
        .forEach(
          button => {

            button.addEventListener(
              "click",
              () => {

                const index =
                  Number(
                    button.dataset
                      .v935Prompt
                  );


                const input =
                  document.getElementById(
                    "manaV95Input"
                  );


                if (
                  !input ||
                  !QUICK_PROMPTS[
                    index
                  ]
                ) {
                  return;
                }


                input.value =
                  QUICK_PROMPTS[
                    index
                  ];


                autoGrowInput();


                input.focus();


                input.setSelectionRange(
                  input.value.length,
                  input.value.length
                );

              }
            );

          }
        );
    }


    quick.hidden =
      false;
  }


  /* =========================================
     AUTO GROW
     ========================================= */

  function autoGrowInput() {
    const input =
      document.getElementById(
        "manaV95Input"
      );


    if (!input) {
      return;
    }


    input.style.height =
      "auto";


    input.style.height =
      `${
        Math.min(
          input.scrollHeight,
          150
        )
      }px`;
  }


  function wireInputGrow() {
    const input =
      document.getElementById(
        "manaV95Input"
      );


    if (
      !input ||
      input.dataset
        .v935Grow ===
        "1"
    ) {
      return;
    }


    input.dataset.v935Grow =
      "1";


    input.addEventListener(
      "input",
      autoGrowInput
    );
  }


  /* =========================================
     LIFE CHAT MODE
     ========================================= */

  function decorateLifeChat() {
    const modal =
      document.getElementById(
        MODAL_ID
      );


    if (
      !modal
        ?.classList
        .contains(
          "open"
        )
    ) {
      return;
    }


    modal.classList.add(
      "mana-v935-life-mode"
    );


    const kicker =
      document.getElementById(
        "manaV95ChatKicker"
      );

    const title =
      document.getElementById(
        "manaV95ChatTitle"
      );

    const sub =
      document.getElementById(
        "manaV95ChatSub"
      );

    const input =
      document.getElementById(
        "manaV95Input"
      );


    if (kicker) {
      kicker.textContent =
        "MANA LIFE • RECLAIM";
    }


    if (title) {
      title.textContent =
        "Support Chat";
    }


    if (sub) {
      sub.textContent =
        "Private support inside Mana.";
    }


    if (input) {
      input.placeholder =
        "What’s on your mind?";
    }


    ensureIntro();

    ensureQuickPrompts();

    wireInputGrow();

    autoGrowInput();
  }


  function clearLifeMode() {
    const modal =
      document.getElementById(
        MODAL_ID
      );


    modal
      ?.classList
      .remove(
        "mana-v935-life-mode"
      );


    const intro =
      document.getElementById(
        INTRO_ID
      );


    const quick =
      document.getElementById(
        QUICK_ID
      );


    if (intro) {
      intro.hidden =
        true;
    }


    if (quick) {
      quick.hidden =
        true;
    }
  }


  function scheduleDecorate(
    delay = 80
  ) {
    setTimeout(
      () => {

        if (
          lifeChatPending
        ) {

          decorateLifeChat();

          lifeChatPending =
            false;
        }

      },
      delay
    );
  }


  /* =========================================
     GLOBAL OPEN WRAPPER
     ========================================= */

  function wrapGlobalOpen() {
    if (
      wrappedGlobal ||
      typeof
        window
          .openManaLifeSupport !==
        "function"
    ) {
      return;
    }


    const original =
      window
        .openManaLifeSupport;


    window.openManaLifeSupport =
      (...args) => {

        lifeChatPending =
          true;


        const result =
          original(
            ...args
          );


        scheduleDecorate(
          90
        );


        return result;
      };


    wrappedGlobal =
      true;
  }


  /* =========================================
     CLICK WATCH
     ========================================= */

  function watchClicks() {
    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "[data-v933-support-chat]"
          )
        ) {

          lifeChatPending =
            true;


          scheduleDecorate(
            90
          );


          return;
        }


        if (
          event.target.closest(
            "#manaV95ChatClose"
          )
        ) {

          clearLifeMode();
        }

      },
      true
    );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {
    injectStyles();

    watchClicks();

    wrapGlobalOpen();


    setTimeout(
      wrapGlobalOpen,
      500
    );


    setTimeout(
      wrapGlobalOpen,
      1500
    );
  }


  window.MANA_LIFE_CHAT_BUILD =
    BUILD;


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
