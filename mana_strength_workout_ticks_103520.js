
/* =====================================================
   MANA MOVEMENT TRAINING
   PREMIUM STRENGTH WORKOUT CARDS
   BUILD 103520

   - Premium yellow borders on every workout card
   - Remove coloured border accents
   - Large yellow completed tick, top right
   - "WORKOUT COMPLETE THIS WEEK" below tick
   - Remove original small completion badge
   - No illustrations or external images
   - Preserve workout controls and history
   - No polling or repeated rendering timers
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "103520";
  const STYLE_ID = "mana-strength-ticks-103520";

  if (window.MANA_STRENGTH_TICKS_103520) return;
  window.MANA_STRENGTH_TICKS_103520 = true;

  const GOLD = "#F3D875";
  const CARD = ".mana-v85-day";
  const $ = id => document.getElementById(id);

  function strengthOpen() {
    const title = (
      $("manaV83Title")?.textContent || ""
    ).trim().toUpperCase();

    return (
      title === "MANA STRENGTH" &&
      $("manaV83ProgramShell")
        ?.classList.contains("open")
    );
  }

  function workoutTabOpen() {
    const active = document.querySelector(
      "#manaV83Tabs .mana-v83-tab.active"
    );

    return active?.dataset.v83Tab === "program";
  }

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      /* =====================================
         UNIFORM PREMIUM YELLOW OUTLINES
         ===================================== */

      #manaV83Content
      ${CARD} {
        position: relative !important;
        border: 1.5px solid ${GOLD} !important;
        border-color: ${GOLD} !important;
        border-left-color: ${GOLD} !important;
        border-right-color: ${GOLD} !important;
        border-top-color: ${GOLD} !important;
        border-bottom-color: ${GOLD} !important;
        border-radius: 20px !important;
        box-shadow: none !important;
        outline: none !important;
        background:
          linear-gradient(
            145deg,
            #15130d,
            #090909
          ) !important;
        box-sizing: border-box !important;
      }

      /* Remove decorative colour accents. */

      #manaV83Content
      ${CARD}::before,
      #manaV83Content
      ${CARD}::after {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
      }

      #manaV83Content
      ${CARD}.in-progress,
      #manaV83Content
      ${CARD}.mana-v964-expanded {
        border-color: ${GOLD} !important;
        box-shadow: none !important;
      }

      /* =====================================
         NEW COMPLETION MARK
         ===================================== */

      #manaV83Content
      .mf520-complete {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 112px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 7px;
        text-align: center;
        pointer-events: none;
        z-index: 2;
      }

      #manaV83Content
      .mf520-tick {
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${GOLD};
      }

      #manaV83Content
      .mf520-tick svg {
        width: 34px;
        height: 34px;
        fill: none;
        stroke: currentColor;
        stroke-width: 2.1;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      #manaV83Content
      .mf520-complete-label {
        color: ${GOLD};
        font-size: 10px;
        font-weight: 900;
        line-height: 1.35;
        letter-spacing: .45px;
      }

      /* Space for the new tick.
         Original card height remains flexible. */

      #manaV83Content
      ${CARD}.mf520-done
      .mana-v85-top {
        padding-right: 115px;
        box-sizing: border-box;
      }

      #manaV83Content
      ${CARD}.mf520-done
      .mana-v85-count {
        display: none !important;
      }

      /* Hide only the older completion badge
         identified by the JavaScript below. */

      #manaV83Content
      .mf520-original-complete {
        display: none !important;
      }

      @media(max-width:480px) {

        #manaV83Content
        .mf520-complete {
          top: 13px;
          right: 12px;
          width: 89px;
          gap: 5px;
        }

        #manaV83Content
        .mf520-tick,
        #manaV83Content
        .mf520-tick svg {
          width: 30px;
          height: 30px;
        }

        #manaV83Content
        .mf520-complete-label {
          font-size: 9px;
          line-height: 1.3;
          letter-spacing: .2px;
        }

        #manaV83Content
        ${CARD}.mf520-done
        .mana-v85-top {
          padding-right: 92px;
        }
      }

    `;

    document.head.appendChild(style);
  }

  /* =========================================
     RECOGNISE EXISTING WEEKLY COMPLETION
     ========================================= */

  function findOldCompletionBadge(card) {
    const candidates = card.querySelectorAll(
      "span, small, strong, div"
    );

    for (const node of candidates) {
      if (node.classList.contains(
        "mf520-complete"
      )) continue;

      const text = (
        node.textContent || ""
      ).replace(/\s+/g, " ").trim();

      if (!/^(?:✓|✔|☑)?\s*COMPLETED THIS WEEK$/i
        .test(text)) {
        continue;
      }

      // Avoid hiding a parent container with
      // other workout information inside.
      const nestedText = [
        ...node.children
      ].some(child =>
        (child.textContent || "")
          .trim().length > 0
      );

      if (nestedText) continue;

      return node;
    }

    return null;
  }

  function makeCompletionMark() {
    const wrapper = document.createElement(
      "div"
    );

    wrapper.className = "mf520-complete";
    wrapper.setAttribute(
      "role",
      "img"
    );

    wrapper.setAttribute(
      "aria-label",
      "Workout complete this week"
    );

    wrapper.innerHTML = `
      <span class="mf520-tick">
        <svg viewBox="0 0 36 36"
          aria-hidden="true">
          <circle cx="18" cy="18" r="15"/>
          <path d="M10.5 18.5l5 5L25.5 13"/>
        </svg>
      </span>

      <span class="mf520-complete-label">
        WORKOUT COMPLETE<br>
        THIS WEEK
      </span>
    `;

    return wrapper;
  }

  function decorateCard(card) {
    if (!(card instanceof HTMLElement)) {
      return;
    }

    const original = findOldCompletionBadge(card);

    if (original) {
      original.classList.add(
        "mf520-original-complete"
      );
    }

    // Read the app's own weekly completion
    // status instead of guessing from
    // historic workouts or dates.

    const completed = Boolean(
      original ||
      card.querySelector(
        ".mf520-original-complete"
      )
    );

    let mark = card.querySelector(
      ".mf520-complete"
    );

    if (completed) {
      card.classList.add("mf520-done");

      if (!mark) {
        mark = makeCompletionMark();
        card.appendChild(mark);
      }
    } else {
      card.classList.remove("mf520-done");
      mark?.remove();
    }
  }

  function decorateCards() {
    if (!strengthOpen() || !workoutTabOpen()) {
      return;
    }

    document.querySelectorAll(
      "#manaV83Content " + CARD
    ).forEach(decorateCard);
  }

  /* =========================================
     UPDATE AFTER EXISTING RENDER
     ========================================= */

  let queued = false;

  function refresh() {
    if (queued) return;
    queued = true;

    requestAnimationFrame(() => {
      queued = false;
      decorateCards();
    });
  }

  function init() {
    installStyles();

    const content = $("manaV83Content");

    if (content) {
      new MutationObserver(refresh).observe(
        content,
        {
          childList: true
        }
      );
    }

    document.addEventListener(
      "click",
      event => {
        if (!(event.target instanceof Element)) {
          return;
        }

        if (event.target.closest(
          "#manaV83Tabs, " +
          ".mana-v85-day, " +
          "[data-v993-period]"
        )) {
          refresh();
        }
      }
    );

    window.addEventListener(
      "mana:strength-synced",
      refresh
    );

    window.addEventListener(
      "mana:program-tab-change",
      refresh
    );

    window.addEventListener(
      "pageshow",
      refresh
    );

    refresh();

    console.log(
      "Mana Strength Premium Workout Cards",
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
