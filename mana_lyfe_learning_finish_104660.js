
/* =====================================================
   MANA MOVEMENT TRAINING
   MANA LYFE — LEARNING FINAL COLOUR TIDY
   BUILD 104661

   COMPLETE FILE REPLACEMENT:
   mana_lyfe_learning_finish_104660.js

   FIXES:
   - Everyday Māori phrases orange
   - More Te Reo words and sentences orange
   - English translations silver
   - Learning arrows orange
   - Charcoal backgrounds
   - White/silver card borders

   PRESERVES:
   - All Learning content and translations
   - Existing accordion functionality
   - Original typography and spacing
   - Mobile layout
   - All other Mana Movement screens

   No data or navigation changes.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104661";
  const STYLE_ID = "manaLyfeLearningFinish104661";
  const MORE_REO_CLASS = "mana-lyfe-more-reo-104661";

  if (document.getElementById(STYLE_ID)) return;

  const SHELL =
    "#manaV83ProgramShell.mana-lyfe-premium-104580";

  const CONTENT = "#manaV83Content";

  const ORANGE = "#FF7927";
  const WHITE = "#FFFFFF";
  const SILVER = "#C1C6CE";

  const style = document.createElement("style");
  style.id = STYLE_ID;

  style.textContent = `

    /* =====================================
       LEARNING PANELS
       ===================================== */

    ${SHELL} ${CONTENT}
    .mana-v984-panel {
      background: #15171A !important;
      background-image: none !important;
      border: 1px solid #626973 !important;
      box-shadow: none !important;
    }

    ${SHELL} ${CONTENT}
    .mana-v984-small-label {
      color: ${ORANGE} !important;
      -webkit-text-fill-color: ${ORANGE} !important;
    }

    /* =====================================
       TE REO MĀORI — EVERYDAY
       ===================================== */

    ${SHELL} ${CONTENT}
    .mana-v984-phrase {
      background: #090B0D !important;
      background-image: none !important;
      border: 1px solid #454B53 !important;
      box-shadow: none !important;
    }

    ${SHELL} ${CONTENT}
    .mana-v984-phrase strong {
      color: ${ORANGE} !important;
      -webkit-text-fill-color: ${ORANGE} !important;
    }

    ${SHELL} ${CONTENT}
    .mana-v984-phrase span {
      color: ${SILVER} !important;
      -webkit-text-fill-color: ${SILVER} !important;
    }

    /* =====================================
       LEARNING ACCORDIONS
       ===================================== */

    ${SHELL} ${CONTENT}
    .mana-v984-accordion {
      background: #15171A !important;
      background-image: none !important;
      border: 1px solid #626973 !important;
      box-shadow: none !important;
    }

    ${SHELL} ${CONTENT}
    .mana-v984-accordion > button strong {
      color: ${WHITE} !important;
      -webkit-text-fill-color: ${WHITE} !important;
    }

    ${SHELL} ${CONTENT}
    .mana-v984-accordion > button span {
      color: ${ORANGE} !important;
      -webkit-text-fill-color: ${ORANGE} !important;
    }

    ${SHELL} ${CONTENT}
    .mana-v984-accordion-body {
      color: ${SILVER} !important;
      -webkit-text-fill-color: ${SILVER} !important;
    }

    /* =====================================
       MORE TE REO — WORDS + SENTENCES

       Scope these rules to the specific
       More Te Reo panel, identified below.
       ===================================== */

    ${SHELL} ${CONTENT}
    .${MORE_REO_CLASS} {
      background: #15171A !important;
      border-color: #626973 !important;
    }

    ${SHELL} ${CONTENT}
    .${MORE_REO_CLASS}
    :is(
      strong,
      b,
      td:first-child,
      th:first-child,
      [class*="word"],
      [class*="maori"]
    ) {
      color: ${ORANGE} !important;
      -webkit-text-fill-color: ${ORANGE} !important;
    }

    ${SHELL} ${CONTENT}
    .${MORE_REO_CLASS}
    :is(
      td:nth-child(2),
      [class*="translation"],
      [class*="english"]
    ) {
      color: ${SILVER} !important;
      -webkit-text-fill-color: ${SILVER} !important;
    }

    /* Keep the section heading orange */

    ${SHELL} ${CONTENT}
    .${MORE_REO_CLASS}
    .mana-v984-small-label {
      color: ${ORANGE} !important;
      -webkit-text-fill-color: ${ORANGE} !important;
    }

    /* =====================================
       ACCESSIBILITY
       ===================================== */

    ${SHELL} ${CONTENT}
    .mana-v984-accordion > button:focus-visible {
      outline: 2px solid ${ORANGE} !important;
      outline-offset: 3px !important;
    }

  `;

  document.head.appendChild(style);

  /* =========================================
     IDENTIFY THE MORE TE REO SECTION

     Older Learning content may use a
     different panel class. Rather than
     changing every Learning card, identify
     this panel by its existing heading.

     No content is replaced or rewritten.
     ========================================= */

  function markMoreTeReo() {
    const shell = document.querySelector(SHELL);
    const content = document.querySelector(CONTENT);

    if (!shell || !content) return;

    const elements = content.querySelectorAll(
      "div, span, h2, h3, h4, p, strong"
    );

    for (const element of elements) {
      if (element.children.length > 0) continue;

      const heading = (element.textContent || "")
        .replace(/\s+/g, " ")
        .trim()
        .toUpperCase();

      if (
        !heading.includes("MORE TE REO") ||
        !heading.includes("WORDS")
      ) {
        continue;
      }

      const panel = element.closest(
        ".mana-v984-panel, " +
        "section, article, " +
        "[class*='panel'], " +
        "[class*='card']"
      ) || element.parentElement?.parentElement;

      if (
        !panel ||
        panel === content ||
        panel === shell ||
        !content.contains(panel)
      ) {
        continue;
      }

      panel.classList.add(MORE_REO_CLASS);
      break;
    }
  }

  /* =========================================
     INITIALISE AFTER CONTENT RENDERS
     ========================================= */

  let queued = false;

  function scheduleUpdate() {
    if (queued) return;

    queued = true;

    requestAnimationFrame(() => {
      queued = false;
      markMoreTeReo();
    });
  }

  function init() {
    markMoreTeReo();

    const content =
      document.getElementById("manaV83Content");

    if (content) {
      const observer = new MutationObserver(
        scheduleUpdate
      );

      observer.observe(content, {
        childList: true,
        subtree: true
      });
    }

    console.log(
      "[ManaLyfe] Learning colours " + BUILD
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }

})();
