
/* =====================================================
   MANA MOVEMENT TRAINING
   NEW CLIENT WELCOME + PROGRAM PATHWAYS
   BUILD 104670

   COMPLETE FILE:
   mana_client_welcome_pathways_104670.js

   ADDS:
   - Start Here: 10-step navigation guide
   - Who Is This For? for all three programs
   - Continue using existing program buttons

   PRESERVES:
   - Signup and email verification
   - Existing program access/navigation
   - Workouts, Fuel, Routine and Reset
   - Progress, client data and subscriptions
   - Coach Hub
   - Phone and desktop layouts

   No database writes or email sending.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104670";
  const STYLE_ID = "manaWelcomePathways104670";
  const MODAL_ID = "manaWelcomeModal104670";
  const GUIDE_ID = "manaWelcomeGuide104670";

  if (window.MANA_WELCOME_104670) return;
  window.MANA_WELCOME_104670 = true;

  const PROGRAMS = {
    manaV80Strength: {
      name: "MANA STRENGTH",
      headline: "Build Strength. Train With Purpose.",
      intro:
        "Personalised training for people ready to build strength, improve performance and make measurable progress.",
      points: [
        "You want a personalised strength program.",
        "You enjoy structured gym training.",
        "You want to build muscle and improve fitness.",
        "You want clear goals and measurable progress.",
        "You value guidance, consistency and accountability.",
        "You want to improve your training technique.",
        "You want to understand nutrition and recovery.",
        "You are ready to commit to long-term improvement."
      ],
      closing:
        "Your training. Your progress. Your purpose."
    },

    manaV80Mana28: {
      name: "MANA28",
      headline: "28 Days. One Stronger You.",
      intro:
        "A structured four-week pathway to help you get moving, develop consistency and build better habits.",
      points: [
        "You want a clear starting point.",
        "You are returning to exercise after time away.",
        "You want structure without complicated planning.",
        "You want to improve general fitness and strength.",
        "You want to develop better daily habits.",
        "You want guidance with food, movement and recovery.",
        "You enjoy following a simple daily plan.",
        "You are ready to commit to 28 days of progress."
      ],
      closing:
        "Start where you are. Build from there."
    },

    manaV80Life: {
      name: "MANA LYFE",
      headline: "Reset. Rebuild. Move Forward.",
      intro:
        "A supportive pathway combining movement, routine and wellbeing to help you regain direction and momentum.",
      points: [
        "Life feels overwhelming at the moment.",
        "You are dealing with stress or uncertainty.",
        "You are navigating a relationship breakup.",
        "Financial hardship has affected your wellbeing.",
        "You are rebuilding confidence or self-belief.",
        "You feel disconnected from your usual routine.",
        "You want to reconnect with movement and healthy habits.",
        "You need a reset and a positive way forward."
      ],
      closing:
        "You don't need to have everything figured out to begin.",
      note:
        "ManaLyfe provides wellbeing tools and general support. It is not a replacement for professional mental health or financial advice."
    }
  };

  const STEPS = [
    [
      "Set up your profile",
      "Check your personal details and complete the information needed for your chosen pathway."
    ],
    [
      "Choose your program",
      "Explore Mana Strength, Mana28 and ManaLyfe. Select the pathway that best fits your goals."
    ],
    [
      "Start at Overview",
      "Your program Overview is your home base. It shows the main areas of your pathway."
    ],
    [
      "Open Workouts",
      "Find your training sessions and follow the instructions for each workout."
    ],
    [
      "Complete your sessions",
      "Open a workout, follow the exercises and mark the session complete when finished."
    ],
    [
      "Explore Fuel",
      "Where included in your program, review nutrition guidance, meals, hydration and recovery."
    ],
    [
      "Track your Progress",
      "Use your program's progress features to see completed workouts and build consistency."
    ],
    [
      "Use your wellbeing tools",
      "In ManaLyfe, explore Daily Routine, guided Reset, support and practical daily actions."
    ],
    [
      "Keep learning",
      "Visit Learning for training principles, wellbeing guidance and Te Reo Māori content."
    ],
    [
      "Stay connected",
      "Use Support Chat or available coaching features when you need guidance. Keep showing up, one step at a time."
    ]
  ];

  let modal = null;
  let lastFocus = null;
  let pendingCard = null;
  let bypassCard = null;

  const escapeHTML = value =>
    String(value).replace(/[&<>"']/g, ch => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[ch]);

  function installStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      /* ===================================
         START HERE BUTTON
         =================================== */

      #${GUIDE_ID} {
        display: block;
        width: 100%;
        max-width: 760px;
        min-height: 48px;
        margin: 9px auto 17px;
        padding: 12px 17px;

        background: #15171A;
        border: 1px solid #FF7927;
        border-radius: 14px;

        color: #FFFFFF;
        font-size: 13px;
        font-weight: 850;
        text-align: center;
        cursor: pointer;
      }

      /* ===================================
         INTRODUCTION MODAL
         =================================== */

      #${MODAL_ID} {
        position: fixed;
        inset: 0;
        z-index: 999999;

        display: flex;
        align-items: center;
        justify-content: center;

        padding: 18px;
        background: rgba(0,0,0,.88);
        box-sizing: border-box;
      }

      #${MODAL_ID}[hidden] {
        display: none !important;
      }

      #${MODAL_ID} * {
        box-sizing: border-box;
      }

      #${MODAL_ID} .mana-welcome-panel {
        width: min(590px,100%);
        max-height: min(90vh,850px);

        display: flex;
        flex-direction: column;

        background: #0B0D10;
        border: 1px solid #646C75;
        border-radius: 22px;

        color: #FFFFFF;
        overflow: hidden;
      }

      #${MODAL_ID} .mana-welcome-header {
        padding: 19px 20px 15px;
        border-bottom: 1px solid #454B53;
      }

      #${MODAL_ID} .mana-welcome-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 15px;
      }

      #${MODAL_ID} .mana-welcome-kicker {
        color: #FF7927;
        font-size: 10px;
        font-weight: 950;
        letter-spacing: .13em;
      }

      #${MODAL_ID} .mana-welcome-title {
        margin: 7px 0;
        font-size: clamp(23px,5vw,31px);
        font-weight: 950;
        line-height: 1.14;
      }

      #${MODAL_ID} .mana-welcome-intro {
        margin: 8px 0 0;
        color: #C1C6CE;
        font-size: 13px;
        line-height: 1.55;
      }

      #${MODAL_ID} .mana-welcome-close {
        width: 38px;
        height: 38px;
        flex: 0 0 38px;

        background: #15171A;
        color: #FFFFFF;
        border: 1px solid #626973;
        border-radius: 11px;

        font-size: 20px;
        cursor: pointer;
      }

      #${MODAL_ID} .mana-welcome-body {
        flex: 1 1 auto;
        overflow-y: auto;
        padding: 15px 20px;
        overscroll-behavior: contain;
      }

      #${MODAL_ID} .mana-welcome-item {
        display: flex;
        gap: 12px;
        align-items: flex-start;

        margin-bottom: 9px;
        padding: 12px;

        background: #15171A;
        border: 1px solid #4D555E;
        border-radius: 13px;
      }

      #${MODAL_ID} .mana-welcome-number {
        display: grid;
        place-items: center;
        width: 27px;
        height: 27px;
        flex: 0 0 27px;

        border: 1px solid #FF7927;
        border-radius: 8px;

        color: #FF7927;
        font-size: 12px;
        font-weight: 900;
      }

      #${MODAL_ID} .mana-welcome-item strong {
        display: block;
        color: #FFFFFF;
        font-size: 14px;
        line-height: 1.35;
      }

      #${MODAL_ID} .mana-welcome-item p {
        margin: 5px 0 0;
        color: #C1C6CE;
        font-size: 12px;
        line-height: 1.5;
      }

      #${MODAL_ID} .mana-welcome-note {
        margin-top: 14px;
        padding: 12px;

        border-left: 3px solid #FF7927;
        border-radius: 0 11px 11px 0;
        background: #15171A;

        color: #C1C6CE;
        font-size: 12px;
        line-height: 1.55;
      }

      #${MODAL_ID} .mana-welcome-actions {
        display: flex;
        gap: 10px;

        padding: 14px 20px;
        border-top: 1px solid #454B53;
        background: #0B0D10;
      }

      #${MODAL_ID} .mana-welcome-button {
        min-height: 47px;
        flex: 1;
        padding: 11px;

        border: 1px solid #626973;
        border-radius: 12px;

        background: #15171A;
        color: #FFFFFF;

        font-size: 12px;
        font-weight: 900;
        cursor: pointer;
      }

      #${MODAL_ID} .mana-welcome-primary {
        background: #FF7927;
        border-color: #FF7927;
        color: #090A0C;
      }

      #${MODAL_ID} button:focus-visible,
      #${GUIDE_ID}:focus-visible {
        outline: 2px solid #FF7927;
        outline-offset: 3px;
      }

      @media(max-width:600px) {
        #${MODAL_ID} {
          padding: 8px;
        }

        #${MODAL_ID} .mana-welcome-panel {
          max-height: 94dvh;
          border-radius: 17px;
        }

        #${MODAL_ID} .mana-welcome-header {
          padding: 15px;
        }

        #${MODAL_ID} .mana-welcome-body {
          padding: 13px 15px;
        }

        #${MODAL_ID} .mana-welcome-actions {
          padding: 12px 15px;
        }
      }

    `;

    document.head.appendChild(style);
  }

  function ensureModal() {
    if (modal?.isConnected) return modal;

    modal = document.createElement("div");
    modal.id = MODAL_ID;
    modal.hidden = true;
    modal.setAttribute("role", "presentation");

    document.body.appendChild(modal);

    return modal;
  }

  function closeModal() {
    if (!modal) return;

    modal.hidden = true;
    modal.innerHTML = "";
    modal.removeAttribute("aria-modal");

    pendingCard = null;

    if (lastFocus?.isConnected) {
      lastFocus.focus({preventScroll:true});
    }
  }

  function showModal(header, body, actions) {
    ensureModal();

    lastFocus = document.activeElement;

    modal.innerHTML = `
      <section
        class="mana-welcome-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="manaWelcomeTitle104670"
      >
        <div class="mana-welcome-header">
          <div class="mana-welcome-top">
            <div>
              <div class="mana-welcome-kicker">
                ${escapeHTML(header.kicker)}
              </div>

              <h2
                class="mana-welcome-title"
                id="manaWelcomeTitle104670"
              >
                ${escapeHTML(header.title)}
              </h2>
            </div>

            <button
              type="button"
              class="mana-welcome-close"
              data-mana-welcome-close
              aria-label="Close introduction"
            >
              ×
            </button>
          </div>

          <p class="mana-welcome-intro">
            ${escapeHTML(header.intro)}
          </p>
        </div>

        <div class="mana-welcome-body">
          ${body}
        </div>

        <div class="mana-welcome-actions">
          <button
            type="button"
            class="mana-welcome-button"
            data-mana-welcome-close
          >
            ${actions.cancel}
          </button>

          <button
            type="button"
            class="mana-welcome-button mana-welcome-primary"
            data-mana-welcome-continue
          >
            ${actions.confirm}
          </button>
        </div>
      </section>
    `;

    modal.hidden = false;

    modal.querySelector(
      ".mana-welcome-close"
    )?.focus();
  }

  function renderPoints(points) {
    return points.map((point, index) => `
      <div class="mana-welcome-item">
        <span class="mana-welcome-number">
          ${index + 1}
        </span>

        <div>
          <strong>${escapeHTML(point)}</strong>
        </div>
      </div>
    `).join("");
  }

  function showPathway(card) {
    const program = PROGRAMS[card.id];
    if (!program) return;

    pendingCard = card;

    const body = `
      ${renderPoints(program.points)}

      <div class="mana-welcome-note">
        <strong>${escapeHTML(program.closing)}</strong>
        ${program.note
          ? `<p>${escapeHTML(program.note)}</p>`
          : ""}
      </div>
    `;

    showModal({
      kicker: program.name + " · WHO IS THIS FOR?",
      title: program.headline,
      intro: program.intro
    }, body, {
      cancel: "BACK",
      confirm: "CONTINUE TO PROGRAM"
    });
  }

  function showGuide() {
    pendingCard = null;

    const body = STEPS.map((step, index) => `
      <div class="mana-welcome-item">
        <span class="mana-welcome-number">
          ${index + 1}
        </span>

        <div>
          <strong>${escapeHTML(step[0])}</strong>
          <p>${escapeHTML(step[1])}</p>
        </div>
      </div>
    `).join("");

    showModal({
      kicker: "MANA MOVEMENT · START HERE",
      title: "Your First 10 Steps",
      intro:
        "A simple guide to finding your way around Mana Movement. Your program may have different tabs and features."
    }, body, {
      cancel: "CLOSE",
      confirm: "EXPLORE PROGRAMS"
    });
  }

  function ensureGuideButton() {
    const home =
      document.getElementById("manaV80Home");

    if (!home) return;

    const card =
      home.querySelector("#manaV80Mana28");

    if (!card) return;

    if (document.getElementById(GUIDE_ID)) {
      return;
    }

    const button = document.createElement("button");
    button.id = GUIDE_ID;
    button.type = "button";
    button.textContent =
      "START HERE · YOUR FIRST 10 STEPS";

    const parent = card.parentElement;

    if (!parent) return;

    parent.insertBefore(button,card);
  }

  /* =====================================
     EXISTING PROGRAM NAVIGATION
     ===================================== */

  function continueToProgram() {
    const card = pendingCard;

    closeModal();

    if (!card?.isConnected) return;

    /* One-time bypass lets the original
       program navigation handle this click. */

    bypassCard = card;

    try {
      card.click();
    } finally {
      bypassCard = null;
    }
  }

  function onClickCapture(event) {
    if (!(event.target instanceof Element)) {
      return;
    }

    const guide = event.target.closest(
      "#" + GUIDE_ID
    );

    if (guide) {
      event.preventDefault();
      event.stopImmediatePropagation();
      showGuide();
      return;
    }

    if (
      event.target.closest(
        "[data-mana-welcome-close]"
      )
    ) {
      event.preventDefault();
      closeModal();
      return;
    }

    if (
      event.target.closest(
        "[data-mana-welcome-continue]"
      )
    ) {
      event.preventDefault();

      if (pendingCard) {
        continueToProgram();
      } else {
        closeModal();
      }

      return;
    }

    const card = event.target.closest(
      "#manaV80Strength," +
      "#manaV80Mana28," +
      "#manaV80Life"
    );

    if (!card) return;

    if (card === bypassCard) return;

    const home =
      document.getElementById("manaV80Home");

    if (!home?.contains(card)) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    showPathway(card);
  }

  function init() {
    installStyles();
    ensureModal();
    ensureGuideButton();

    document.addEventListener(
      "click",
      onClickCapture,
      true
    );

    document.addEventListener(
      "keydown",
      event => {
        if (!modal || modal.hidden) return;

        if (event.key === "Escape") {
          closeModal();
        }

        if (event.key === "Tab") {
          const controls = Array.from(
            modal.querySelectorAll(
              'button:not([disabled])'
            )
          );

          if (!controls.length) return;

          const first = controls[0];
          const last = controls[controls.length - 1];

          if (
            event.shiftKey &&
            document.activeElement === first
          ) {
            event.preventDefault();
            last.focus();
          } else if (
            !event.shiftKey &&
            document.activeElement === last
          ) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    );

    /* Watch for Home being rendered,
       without rewriting existing cards. */

    let queued = false;

    const observer = new MutationObserver(() => {
      if (queued) return;

      queued = true;

      requestAnimationFrame(() => {
        queued = false;
        ensureGuideButton();
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    console.log(
      "[Mana Movement] Welcome and pathways " +
      BUILD
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {once:true}
    );
  } else {
    init();
  }

})();
