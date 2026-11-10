/* ============================================================
   MANA MOVEMENT TRAINING
   MANA LYFE — FINISH / TIDY
   BUILD 104590

   COMPLETE JAVASCRIPT FILE

   FIXES
   ------------------------------------------------------------
   - Remove Profile button from top right
   - Change Lyfe overview card borders away from gold
   - Keep white icon frames
   - Make Support Chat box match Mana Strength styling
   - Bottom tabs all white
   - Reset tab stays green
   - Preserve all Lyfe functionality

   LOAD AFTER BUILD 104580
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104590";
  const STYLE_ID = "manaLyfeFinish104590Style";
  const ACTIVE_CLASS = "mana-lyfe-finish-104590";

  const ORANGE = "#FF7927";
  const WHITE = "#FFFFFF";
  const SILVER = "#C1C6CE";
  const BORDER = "#59626C";

  const RESET_GREEN = "#36D483";
  const RESET_GREEN_DARK = "#163224";

  const CHAT_CYAN = "#25D5E4";
  const CHAT_CYAN_DARK = "#0C2227";
  const CHAT_CYAN_MID = "#102B31";

  function $(id) {
    return document.getElementById(id);
  }

  function shell() {
    return $("manaV83ProgramShell");
  }

  function titleEl() {
    return $("manaV83Title");
  }

  function tabsEl() {
    return $("manaV83Tabs");
  }

  function contentEl() {
    return $("manaV83Content");
  }

  function isLyfeOpen() {
    const root = shell();
    const title = String(
      titleEl()?.textContent || ""
    )
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();

    return Boolean(
      root?.classList.contains("open") &&
      (
        title === "MANA LYFE" ||
        title === "MANA LIFE" ||
        title === "MANALYFE"
      )
    );
  }

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      /* ======================================
         ONLY WHEN MANA LYFE IS OPEN
         ====================================== */

      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v978-launch,
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v978-grid
      .mana-v978-launch {
        border: 1px solid ${BORDER} !important;
        border-color: ${BORDER} !important;
        background: #15181C !important;
        background-image: none !important;
        box-shadow: none !important;
      }

      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v978-launch::before,
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v978-grid
      .mana-v978-launch::before {
        background: ${ORANGE} !important;
        background-image: none !important;
      }

      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v978-icon {
        border: 1px solid ${WHITE} !important;
        background: #0D0F12 !important;
      }

      /* ======================================
         INTRO / DIVIDER
         ====================================== */

      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v978-intro {
        border-bottom: 1px solid ${BORDER} !important;
      }

      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v978-intro::after {
        background: ${ORANGE} !important;
      }

      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v978-chip,
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v978-pill {
        border-color: ${BORDER} !important;
        color: ${ORANGE} !important;
      }

      /* ======================================
         SUPPORT CHAT BOX
         Match Mana Strength chat colour feel
         ====================================== */

      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v978-launchpad > div:last-child,
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v978-launchpad > section:last-child,
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v978-launchpad > article:last-child {
        background:
          linear-gradient(
            145deg,
            ${CHAT_CYAN_DARK},
            ${CHAT_CYAN_MID}
          ) !important;

        border: 1px solid ${CHAT_CYAN} !important;
        border-radius: 22px !important;
        box-shadow: none !important;
      }

      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v978-launchpad > div:last-child h2,
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v978-launchpad > section:last-child h2,
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v978-launchpad > article:last-child h2 {
        color: ${WHITE} !important;
      }

      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v978-launchpad > div:last-child p,
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v978-launchpad > section:last-child p,
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v978-launchpad > article:last-child p {
        color: ${SILVER} !important;
      }

      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v978-launchpad > div:last-child .mana-v978-label,
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v978-launchpad > section:last-child .mana-v978-label,
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v978-launchpad > article:last-child .mana-v978-label {
        color: ${CHAT_CYAN} !important;
        -webkit-text-fill-color: ${CHAT_CYAN} !important;
      }

      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v978-launchpad > div:last-child button,
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v978-launchpad > div:last-child .mana-v83-primary,
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v978-launchpad > section:last-child button,
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v978-launchpad > section:last-child .mana-v83-primary,
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v978-launchpad > article:last-child button,
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v978-launchpad > article:last-child .mana-v83-primary {
        background: ${CHAT_CYAN} !important;
        color: #071014 !important;
        -webkit-text-fill-color: #071014 !important;
        border: 1px solid ${CHAT_CYAN} !important;
        box-shadow: none !important;
      }

      /* ======================================
         REMOVE GOLD LEFTOVERS IN OTHER LYFE BOXES
         ====================================== */

      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v83-card,
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v984-panel,
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v984-accordion,
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Content
      .mana-v984-progress-card {
        border-color: ${BORDER} !important;
      }

      /* ======================================
         BOTTOM TABS
         White for all tabs
         Reset stays green
         ====================================== */

      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Tabs {
        border-top: 1px solid #49515A !important;
        background: #08090B !important;
      }

      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Tabs .mana-v83-tab {
        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
        border: 1px solid transparent !important;
        background: transparent !important;
      }

      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Tabs .mana-v83-tab * {
        color: ${WHITE} !important;
        -webkit-text-fill-color: ${WHITE} !important;
      }

      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Tabs .mana-v83-tab::before {
        background: #7D8793 !important;
      }

      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Tabs .mana-v83-tab img {
        filter: brightness(0) invert(1) grayscale(1) !important;
        opacity: 1 !important;
      }

      /* Active non-reset tabs */
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Tabs .mana-v83-tab.active {
        background: #20160F !important;
        border: 1px solid ${ORANGE} !important;
        box-shadow: none !important;
      }

      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Tabs .mana-v83-tab.active::before {
        background: ${ORANGE} !important;
      }

      /* Reset tab — keep green */
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Tabs [data-v83-tab="reclaim"],
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Tabs [data-v83-tab="reset"],
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Tabs .mana-lyfe-reset-tab {
        color: ${RESET_GREEN} !important;
        -webkit-text-fill-color: ${RESET_GREEN} !important;
      }

      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Tabs [data-v83-tab="reclaim"] *,
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Tabs [data-v83-tab="reset"] *,
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Tabs .mana-lyfe-reset-tab * {
        color: ${RESET_GREEN} !important;
        -webkit-text-fill-color: ${RESET_GREEN} !important;
      }

      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Tabs [data-v83-tab="reclaim"]::before,
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Tabs [data-v83-tab="reset"]::before,
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Tabs .mana-lyfe-reset-tab::before {
        background: ${RESET_GREEN} !important;
      }

      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Tabs [data-v83-tab="reclaim"] img,
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Tabs [data-v83-tab="reset"] img,
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Tabs .mana-lyfe-reset-tab img {
        filter:
          brightness(0)
          saturate(100%)
          invert(72%)
          sepia(48%)
          saturate(666%)
          hue-rotate(93deg)
          brightness(96%)
          contrast(89%) !important;
      }

      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Tabs [data-v83-tab="reclaim"].active,
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Tabs [data-v83-tab="reset"].active,
      #manaV83ProgramShell.${ACTIVE_CLASS}
      #manaV83Tabs .mana-lyfe-reset-tab.active {
        background: ${RESET_GREEN_DARK} !important;
        border: 1px solid ${RESET_GREEN} !important;
      }

    `;

    document.head.appendChild(style);
  }

  function hideProfileButton() {
    const head = shell()?.querySelector(".mana-v83-head");
    if (!head) return;

    head.querySelectorAll("button").forEach(button => {
      const label = String(button.textContent || "")
        .replace(/\s+/g, " ")
        .trim()
        .toUpperCase();

      if (label.includes("PROFILE")) {
        button.style.display = "none";
      }
    });
  }

  function tagResetTab() {
    const tabs = tabsEl();
    if (!tabs) return;

    tabs.querySelectorAll(".mana-v83-tab").forEach((tab, index) => {
      const label = String(tab.textContent || "")
        .replace(/\s+/g, " ")
        .trim()
        .toUpperCase();

      if (
        label.includes("RESET") ||
        tab.dataset.v83Tab === "reclaim" ||
        tab.dataset.v83Tab === "reset" ||
        index === 3
      ) {
        tab.classList.add("mana-lyfe-reset-tab");
      }
    });
  }

  function apply() {
    const root = shell();
    if (!root) return;

    const active = isLyfeOpen();

    root.classList.toggle(ACTIVE_CLASS, active);

    if (!active) return;

    hideProfileButton();
    tagResetTab();
  }

  let ticking = false;

  function schedule() {
    if (ticking) return;

    ticking = true;

    requestAnimationFrame(() => {
      ticking = false;
      apply();
    });
  }

  function init() {
    installStyles();
    apply();

    const root = shell();

    if (root && window.MutationObserver) {
      const observer = new MutationObserver(schedule);

      observer.observe(root, {
        childList: true,
        subtree: true
      });
    }

    document.addEventListener("click", schedule, true);
    window.addEventListener("mana:program-tab-change", schedule);
    window.addEventListener("pageshow", schedule);

    console.log(
      "[Mana Lyfe] Finish tidy loaded — " + BUILD
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

})();
