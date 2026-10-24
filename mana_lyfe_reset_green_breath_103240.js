/* =========================================================
   MANA MOVEMENT TRAINING
   MANA LYFE RESET — GREEN BREATH BUTTON
   BUILD 103240

   PURPOSE
   - Remove the visible yellow timer circle
   - Keep the green reset circle
   - Show countdown + breathing logic inside the green circle
   - Keep existing reset flow and countdown engine
   - No rebuild of the original reset module

   RESULT
   - One clean green circle only
   - Breathing state and countdown shown inside it
   ========================================================= */

(() => {
  "use strict";

  const BUILD = "103240";
  const STYLE_ID = "mana-lyfe-reset-green-breath-103240";

  if (window.MANA_LYFE_RESET_GREEN_BREATH === BUILD) return;

  const CSS = `
    /* -------------------------------------------------
       Green breathing button styling
       ------------------------------------------------- */
    #manaV936ResetModal #manaV936BreathStart {
      width: 188px !important;
      height: 188px !important;
      min-width: 188px !important;
      min-height: 188px !important;
      max-width: 188px !important;
      max-height: 188px !important;
      aspect-ratio: 1 / 1 !important;
      border-radius: 50% !important;
      margin: 20px auto 0 !important;
      padding: 18px !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: center !important;
      align-items: center !important;
      gap: 6px !important;
      text-align: center !important;
      border: 2px solid #55d98b !important;
      background: #185e39 !important;
      color: #ffffff !important;
      box-shadow:
        0 0 0 8px rgba(85,217,139,.07),
        0 10px 26px rgba(0,0,0,.28) !important;
      font-weight: 800 !important;
      line-height: 1.15 !important;
      transition: none !important;
      animation: none !important;
    }

    #manaV936ResetModal #manaV936BreathStart:hover {
      background: #1d6e43 !important;
    }

    #manaV936ResetModal #manaV936BreathStart:active {
      transform: none !important;
      background: #1f7747 !important;
    }

    #manaV936ResetModal #manaV936BreathStart.mlrb-active {
      background: #185e39 !important;
    }

    #manaV936ResetModal #manaV936BreathStart .mlrb-seconds {
      font-size: 42px !important;
      font-weight: 900 !important;
      line-height: 1 !important;
      letter-spacing: -.02em !important;
      color: #ffffff !important;
    }

    #manaV936ResetModal #manaV936BreathStart .mlrb-phase {
      font-size: 14px !important;
      font-weight: 900 !important;
      letter-spacing: .08em !important;
      text-transform: uppercase !important;
      color: #ffffff !important;
    }

    #manaV936ResetModal #manaV936BreathStart .mlrb-instruction {
      font-size: 11px !important;
      line-height: 1.35 !important;
      color: rgba(255,255,255,.92) !important;
      max-width: 130px !important;
    }

    #manaV936ResetModal #manaV936BreathStart .mlrb-start {
      font-size: 15px !important;
      font-weight: 900 !important;
      line-height: 1.25 !important;
      color: #ffffff !important;
      max-width: 135px !important;
    }

    /* -------------------------------------------------
       Hidden original yellow countdown UI
       We hide only the duplicated visual + text.
       Progress bar and modal structure remain.
       ------------------------------------------------- */
    #manaV936ResetModal .mlrb-hide {
      display: none !important;
    }
  `;

  function installStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function modalOpen() {
    const modal = document.getElementById("manaV936ResetModal");
    return !!(modal && modal.classList.contains("open"));
  }

  function getModal() {
    return document.getElementById("manaV936ResetModal");
  }

  function getGreenButton() {
    return document.getElementById("manaV936BreathStart");
  }

  function cleanText(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }

  function findByText(root, pattern) {
    if (!root) return null;
    const all = root.querySelectorAll("div,span,p,h1,h2,h3,h4,h5,h6,strong,small,button");
    for (const el of all) {
      const txt = cleanText(el.textContent);
      if (pattern.test(txt)) return el;
    }
    return null;
  }

  function findCountdownSecondsNode(modal) {
    if (!modal) return null;

    const all = modal.querySelectorAll("*");
    for (const el of all) {
      const txt = cleanText(el.textContent);
      if (/^\d{1,3}$/.test(txt)) {
        const next = cleanText(el.parentElement?.textContent || "");
        if (/seconds/i.test(next) || /ready|inhale|hold|exhale/i.test(next)) {
          return el;
        }
      }
    }

    return findByText(modal, /^\d{1,3}$/);
  }

  function findPhaseNode(modal) {
    return findByText(modal, /^(ready|inhale|hold|exhale|complete)$/i);
  }

  function findInstructionNode(modal) {
    const nodes = modal?.querySelectorAll("div,p,small,span") || [];
    for (const el of nodes) {
      const txt = cleanText(el.textContent);
      if (
        /inhale for/i.test(txt) ||
        /hold for/i.test(txt) ||
        /exhale for/i.test(txt) ||
        /breathe/i.test(txt)
      ) {
        return el;
      }
    }
    return null;
  }

  function hideOriginalYellowUI() {
    const modal = getModal();
    const button = getGreenButton();
    if (!modal || !button) return;

    const secondsNode = findCountdownSecondsNode(modal);
    const phaseNode = findPhaseNode(modal);
    const instructionNode = findInstructionNode(modal);

    const hideNode = (node) => {
      if (!node) return;
      let target = node;

      for (let i = 0; i < 3; i += 1) {
        if (!target.parentElement) break;
        const siblingHasButton = Array.from(target.parentElement.querySelectorAll("button"))
          .some(btn => btn.id === "manaV936BreathStart");
        if (siblingHasButton) break;
        target = target.parentElement;
      }

      target.classList.add("mlrb-hide");
    };

    hideNode(secondsNode);
    hideNode(phaseNode);
    hideNode(instructionNode);
  }

  function renderStartState(button) {
    if (!button) return;
    button.classList.remove("mlrb-active");
    button.innerHTML = `
      <div class="mlrb-start">START 60-SECOND RESET</div>
    `;
  }

  function renderActiveState(button, seconds, phase, instruction) {
    if (!button) return;
    button.classList.add("mlrb-active");
    button.innerHTML = `
      <div class="mlrb-seconds">${seconds}</div>
      <div class="mlrb-phase">${phase}</div>
      <div class="mlrb-instruction">${instruction}</div>
    `;
  }

  function deriveState() {
    const modal = getModal();
    if (!modal) return null;

    const secondsNode = findCountdownSecondsNode(modal);
    const phaseNode = findPhaseNode(modal);
    const instructionNode = findInstructionNode(modal);

    const secondsText = cleanText(secondsNode?.textContent || "");
    const phaseText = cleanText(phaseNode?.textContent || "");
    const instructionText = cleanText(instructionNode?.textContent || "");

    const seconds = /^\d+$/.test(secondsText) ? secondsText : "";
    const phase = phaseText || "READY";
    const instruction =
      instructionText ||
      "Inhale for 4 • hold for 2 • exhale for 6";

    return {
      seconds,
      phase,
      instruction
    };
  }

  function syncGreenButton() {
    const modal = getModal();
    const button = getGreenButton();

    if (!modal || !button || !modalOpen()) return;

    hideOriginalYellowUI();

    const state = deriveState();

    if (!state) {
      renderStartState(button);
      return;
    }

    const isRunning =
      state.seconds &&
      state.phase &&
      !/^start/i.test(cleanText(button.textContent || ""));

    if (!state.seconds || /^ready$/i.test(state.phase)) {
      renderStartState(button);
      return;
    }

    renderActiveState(
      button,
      state.seconds,
      state.phase.toUpperCase(),
      state.instruction
    );
  }

  function refreshSoon() {
    requestAnimationFrame(() => {
      syncGreenButton();
      setTimeout(syncGreenButton, 80);
      setTimeout(syncGreenButton, 180);
    });
  }

  function bind() {
    document.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;

      if (
        event.target.closest("#ml140OpenReset") ||
        event.target.closest("#manaV936Open") ||
        event.target.closest("#manaV936BreathStart")
      ) {
        refreshSoon();
        setTimeout(syncGreenButton, 350);
        setTimeout(syncGreenButton, 900);
      }
    }, true);

    const modal = getModal();
    if (!modal) return;

    const observer = new MutationObserver(() => {
      if (!modalOpen()) return;
      syncGreenButton();
    });

    observer.observe(modal, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true
    });

    window.addEventListener("pageshow", refreshSoon);
  }

  function init() {
    installStyles();
    bind();
    refreshSoon();
    window.MANA_LYFE_RESET_GREEN_BREATH = BUILD;
    console.log("Mana Lyfe Reset Green Breath", BUILD);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
