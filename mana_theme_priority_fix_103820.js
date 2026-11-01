
/* ============================================================
   MANA MOVEMENT — THEME PRIORITY REPAIR
   BUILD 103820 — COMPLETE JAVASCRIPT FILE

   Keeps the existing 103810 orange/black/white/silver style
   after older app modules dynamically insert their CSS.

   No navigation handlers, program data, authentication,
   saved progress, or workout functions are changed.
   ============================================================ */
(() => {
  "use strict";

  if (window.MANA_THEME_PRIORITY_REPAIR_103820) return;
  window.MANA_THEME_PRIORITY_REPAIR_103820 = true;

  const THEME_ID = "manaOrangeSilverTheme103810";
  const REPAIR_ID = "manaThemePriorityStyle103820";

  function installRepairStyle() {
    let style = document.getElementById(REPAIR_ID);

    if (style) return style;

    style = document.createElement("style");
    style.id = REPAIR_ID;
    style.textContent = `
      :root {
        --bg:#08090b !important;
        --card:#14161a !important;
        --line:#464b52 !important;
        --gold:#ec661a !important;
        --gold2:#ff822c !important;
        --text:#ffffff !important;
        --muted:#c1c6ce !important;
        --mana-orange:#ff7927 !important;
        --mana-silver:#c1c6ce !important;
      }

      body .gold,
      body .brand small,
      body .mark,
      body .pill,
      body .metric strong,
      body .linkbtn {
        color:#ff7927 !important;
      }

      body .mark,
      body .pill {
        border-color:#ff7927 !important;
      }

      body #bottomNav button.active {
        color:#ff7927 !important;
        border-color:rgba(255,121,39,.6) !important;
      }

      body .tabs button.active,
      body .check.done {
        background:#ff7927 !important;
        border-color:#ff7927 !important;
        color:#08090b !important;
      }

      body .primary,
      body .btn.primary {
        background:linear-gradient(135deg,#ff9547,#ee6319) !important;
        color:#08090b !important;
      }

      body .progress span {
        background:linear-gradient(90deg,#df570d,#ff9042) !important;
      }

      body #manaCoachHubClean103760 .hub-card {
        --accent:#ff7927 !important;
        border-color:#ff7927 !important;
      }

      body #manaCoachHubClean103760 .hub-hero {
        border-color:#ff7927 !important;
      }

      body #manaPremiumLoginTitle103780 span {
        color:#ff7927 !important;
      }

      body #authView .tabs button.active,
      body #authView #manaPremiumLoginRoles103780
        button[aria-pressed="true"] {
        background:#392318 !important;
        color:white !important;
        border-color:#ff7927 !important;
      }
    `;

    document.head.appendChild(style);
    return style;
  }

  function keepThemeLast() {
    const head = document.head;
    if (!head) return;

    const theme = document.getElementById(THEME_ID);
    const repair = installRepairStyle();

    // Move existing styles to the end only if needed.
    // We never regenerate the theme or modify app elements.
    if (theme && theme.parentNode === head &&
        theme.nextElementSibling !== repair) {
      head.appendChild(theme);
    }

    if (repair.parentNode !== head ||
        head.lastElementChild !== repair) {
      head.appendChild(repair);
    }
  }

  let pending = false;

  function schedule() {
    if (pending) return;
    pending = true;

    requestAnimationFrame(() => {
      pending = false;
      keepThemeLast();
    });
  }

  function init() {
    keepThemeLast();

    // Observe stylesheet additions, not the app's workout UI.
    // No polling timers or changes to client/coach screens.
    const observer = new MutationObserver(records => {
      const stylesAdded = records.some(record =>
        [...record.addedNodes].some(node =>
          node.nodeType === 1 &&
          (node.matches?.("style,link[rel='stylesheet']") ||
           node.querySelector?.("style,link[rel='stylesheet']"))
        )
      );

      if (stylesAdded) schedule();
    });

    observer.observe(document.head, {
      childList:true
    });

    window.MANA_THEME_PRIORITY_BUILD = "103820";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded",init,{once:true});
  } else {
    init();
  }
})();
