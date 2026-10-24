
/* ======================================================
   MANA MOVEMENT TRAINING
   STRENGTH CARDIO + CORE FINISHERS
   BUILD 103370

   Optional finishers after Workout Complete.

   CARDIO: Electric blue #368FD4
   CORE: Premium gold #D6A437

   No global rendering changes.
   No Fuel, Learning or Mana Lyfe changes.
   No background timers while idle.
   ====================================================== */

(() => {
  "use strict";

  const BUILD = "103370";
  const SCREEN = "manaV915Complete";
  const CONTENT = "manaV915Content";
  const STYLE = "mana-finishers-style-103370";
  const STORE = "mana-strength-finishers-103370";

  if (window.MANA_FINISHERS_BUILD === BUILD) return;
  window.MANA_FINISHERS_BUILD = BUILD;

  const PLANS = {
    cardio: {
      title: "Cardio Finisher",
      colour: "#368FD4",
      duration: "12 minutes",
      intro: "Three rounds. Work steadily, control your breathing and maintain good technique.",
      exercises: [
        ["Brisk walk or march", "2 minutes"],
        ["Low-impact step-ups", "1 minute"],
        ["Fast controlled marching", "1 minute"]
      ]
    },

    core: {
      title: "Core Finisher",
      colour: "#D6A437",
      duration: "3 rounds",
      intro: "Move with control. Brace gently and stop if an exercise causes pain.",
      exercises: [
        ["Dead bug", "8 reps per side"],
        ["Bird dog", "8 reps per side"],
        ["Side plank", "20 seconds per side"]
      ]
    }
  };

  let current = null;
  let currentRound = 1;
  let completed = new Set();
  let attachedScreen = null;
  let contentObserver = null;
  let screenObserver = null;

  function $(id) {
    return document.getElementById(id);
  }

  function installStyle() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `
      #${SCREEN} .mf370-section {
        margin: 24px 0;
        padding: 18px;
        background: #111820;
        border: 1px solid #303b47;
        border-radius: 16px;
      }

      #${SCREEN} .mf370-heading {
        margin: 0 0 6px;
        color: #fff;
        font-size: 17px;
        font-weight: 800;
      }

      #${SCREEN} .mf370-sub {
        margin: 0 0 17px;
        color: #aeb9c5;
        font-size: 13px;
        line-height: 1.5;
      }

      #${SCREEN} .mf370-buttons {
        display: grid;
        grid-template-columns: repeat(2,minmax(0,1fr));
        gap: 12px;
      }

      #${SCREEN} .mf370-button {
        width: 100%;
        min-width: 0;
        min-height: 102px;
        padding: 16px 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border-radius: 12px;
        cursor: pointer;
        font-weight: 900;
        letter-spacing: 1px;
        transition: transform 140ms ease;
      }

      #${SCREEN} .mf370-button:active {
        transform: scale(.97);
      }

      #${SCREEN} .mf370-cardio {
        border: 1.5px solid #368FD4;
        background: rgba(54,143,212,.10);
        color: #368FD4;
      }

      #${SCREEN} .mf370-core {
        border: 1.5px solid #D6A437;
        background: rgba(214,164,55,.10);
        color: #D6A437;
      }

      #${SCREEN} .mf370-symbol {
        font-size: 27px;
        line-height: 1;
      }

      #${SCREEN} .mf370-duration {
        color: #cbd5df;
        font-size: 11px;
        letter-spacing: 0;
        font-weight: 500;
      }

      #${SCREEN} .mf370-panel {
        margin-top: 18px;
        padding: 18px;
        border: 1.5px solid var(--mf-colour);
        border-radius: 14px;
        background: #0e151d;
        color: #fff;
      }

      #${SCREEN} .mf370-panel h3 {
        color: var(--mf-colour);
        margin: 0 0 8px;
      }

      #${SCREEN} .mf370-panel p {
        color: #c5cdd6;
        line-height: 1.5;
        font-size: 13px;
      }

      #${SCREEN} .mf370-round {
        color: var(--mf-colour);
        font-size: 13px;
        font-weight: 800;
        margin: 15px 0;
      }

      #${SCREEN} .mf370-exercise {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 10px;
        margin-bottom: 8px;
        border: 1px solid #35404c;
        border-radius: 10px;
        cursor: pointer;
      }

      #${SCREEN} .mf370-exercise input {
        width: 19px;
        height: 19px;
        accent-color: var(--mf-colour);
        flex-shrink: 0;
      }

      #${SCREEN} .mf370-exercise strong {
        display: block;
        font-size: 14px;
      }

      #${SCREEN} .mf370-exercise small {
        display: block;
        margin-top: 3px;
        color: #a8b4c0;
      }

      #${SCREEN} .mf370-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-top: 18px;
      }

      #${SCREEN} .mf370-action {
        min-height: 44px;
        padding: 10px;
        border-radius: 9px;
        border: 1px solid #56616b;
        background: #19232c;
        color: #fff;
        font-weight: 800;
        cursor: pointer;
      }

      #${SCREEN} .mf370-primary {
        background: var(--mf-colour);
        color: #091017;
        border-color: var(--mf-colour);
      }

      #${SCREEN} .mf370-primary:disabled {
        opacity: .35;
        cursor: not-allowed;
      }

      #${SCREEN} .mf370-done {
        color: #69e5a0;
        text-align: center;
        font-weight: 800;
        padding: 16px 0;
      }

      @media (prefers-reduced-motion: reduce) {
        #${SCREEN} .mf370-button {
          transition: none;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function installButtons() {
    const screen = $(SCREEN);
    const content = $(CONTENT);

    if (!screen || !content) return;
    if (!screen.classList.contains("open")) return;
    if (content.querySelector(".mf370-section")) return;

    const back = content.querySelector("#manaV915Back");
    if (!back) return;

    const section = document.createElement("section");
    section.className = "mf370-section";

    section.innerHTML = `
      <h3 class="mf370-heading">Optional Finishers</h3>
      <p class="mf370-sub">
        Your Strength workout is complete.
        Choose an optional finisher, or return to Overview.
      </p>

      <div class="mf370-buttons">
        <button type="button"
          class="mf370-button mf370-cardio"
          data-mf370-open="cardio">
          <span class="mf370-symbol" aria-hidden="true">♥</span>
          <span>CARDIO</span>
          <span class="mf370-duration">12 minutes</span>
        </button>

        <button type="button"
          class="mf370-button mf370-core"
          data-mf370-open="core">
          <span class="mf370-symbol" aria-hidden="true">◎</span>
          <span>CORE</span>
          <span class="mf370-duration">3 rounds</span>
        </button>
      </div>

      <div id="mf370Panel" aria-live="polite"></div>
    `;

    back.before(section);
  }

  function sessionKey() {
    const name = $(CONTENT)
      ?.querySelector(".mana-v9150-session")
      ?.textContent?.trim() || "Strength Session";

    return new Date().toLocaleDateString("en-CA") +
      ":" + name;
  }

  function recordCompletion(type) {
    try {
      const data = JSON.parse(
        localStorage.getItem(STORE) || "{}"
      );

      const key = sessionKey();

      if (!data[key]) data[key] = {};

      data[key][type] = {
        completedAt: new Date().toISOString(),
        rounds: 3
      };

      localStorage.setItem(
        STORE,
        JSON.stringify(data)
      );

      window.dispatchEvent(new CustomEvent(
        "mana:finisher-completed",
        {detail:{type,session:key}}
      ));
    } catch (error) {
      console.warn("Finisher save failed",error);
    }
  }

  function openFinisher(type) {
    if (!PLANS[type]) return;

    current = type;
    currentRound = 1;
    completed.clear();

    renderPanel();
  }

  function renderPanel() {
    const target = $("mf370Panel");
    if (!target || !current) return;

    const plan = PLANS[current];

    const exerciseHtml = plan.exercises.map(
      ([name,reps],index) => `
        <label class="mf370-exercise">
          <input type="checkbox"
            data-mf370-check="${index}"
            ${completed.has(index) ? "checked" : ""}>
          <span>
            <strong>${name}</strong>
            <small>${reps}</small>
          </span>
        </label>
      `
    ).join("");

    const allDone =
      completed.size === plan.exercises.length;

    target.innerHTML = `
      <div class="mf370-panel"
        style="--mf-colour:${plan.colour}">
        <h3>${plan.title}</h3>
        <p>${plan.intro}</p>
        <div class="mf370-round">
          Round ${currentRound} of 3
        </div>

        ${exerciseHtml}

        <div class="mf370-actions">
          <button type="button"
            class="mf370-action"
            data-mf370-close>
            CLOSE
          </button>

          <button type="button"
            class="mf370-action mf370-primary"
            data-mf370-next
            ${allDone ? "" : "disabled"}>
            ${currentRound === 3
              ? "FINISH"
              : "NEXT ROUND"}
          </button>
        </div>
      </div>
    `;
  }

  function nextRound() {
    if (!current) return;

    if (completed.size !==
        PLANS[current].exercises.length) {
      return;
    }

    if (currentRound < 3) {
      currentRound++;
      completed.clear();
      renderPanel();
      return;
    }

    const type = current;
    recordCompletion(type);

    const target = $("mf370Panel");

    if (target) {
      target.innerHTML = `
        <div class="mf370-done">
          ✓ ${PLANS[type].title} Completed
        </div>
      `;
    }

    current = null;
    completed.clear();
  }

  function handleClick(event) {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const open = target.closest(
      "[data-mf370-open]"
    );

    if (open) {
      openFinisher(open.dataset.mf370Open);
      return;
    }

    if (target.closest("[data-mf370-close]")) {
      current = null;
      completed.clear();
      const panel = $("mf370Panel");
      if (panel) panel.innerHTML = "";
      return;
    }

    if (target.closest("[data-mf370-next]")) {
      nextRound();
    }
  }

  function handleChange(event) {
    const input = event.target;

    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    if (!input.matches("[data-mf370-check]")) {
      return;
    }

    const index = Number(input.dataset.mf370Check);

    if (input.checked) completed.add(index);
    else completed.delete(index);

    const button = document.querySelector(
      "#mf370Panel [data-mf370-next]"
    );

    if (button && current) {
      button.disabled = completed.size !==
        PLANS[current].exercises.length;
    }
  }

  function attachScreen() {
    const screen = $(SCREEN);

    if (!screen || attachedScreen === screen) {
      return;
    }

    if (contentObserver) contentObserver.disconnect();
    if (screenObserver) screenObserver.disconnect();

    attachedScreen = screen;

    const content = $(CONTENT);

    if (content) {
      contentObserver = new MutationObserver(() => {
        if (
          screen.classList.contains("open") &&
          !content.querySelector(".mf370-section")
        ) {
          installButtons();
        }
      });

      contentObserver.observe(content, {
        childList: true
      });
    }

    screenObserver = new MutationObserver(() => {
      if (screen.classList.contains("open")) {
        installButtons();
      } else {
        current = null;
        completed.clear();
      }
    });

    screenObserver.observe(screen, {
      attributes: true,
      attributeFilter: ["class"]
    });

    installButtons();
  }

  function init() {
    installStyle();

    document.addEventListener(
      "click",
      handleClick
    );

    document.addEventListener(
      "change",
      handleChange
    );

    // The completion screen is created lazily.
    // Stop watching the body once it exists.
    if ($(SCREEN)) {
      attachScreen();
    } else {
      const observer = new MutationObserver(() => {
        if ($(SCREEN)) {
          observer.disconnect();
          attachScreen();
        }
      });

      observer.observe(document.body, {
        childList: true
      });
    }

    console.log(
      "Mana Strength Finishers",
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
