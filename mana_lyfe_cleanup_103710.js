
/* =====================================================
   MANA MOVEMENT TRAINING
   MANA LYFE — FINAL CONTENT CLEANUP
   BUILD 103710

   COMPLETE JAVASCRIPT FILE

   1. Remove Support Chat introduction box:
      SUPPORT / CONNECTION / PERSPECTIVE

   2. Remove upper whakatauki in Routine

   3. Remove upper whakatauki in Reset

   4. Preserve the bottom whakatauki
      and its existing layout

   PRESERVES:
   - Working Coach and Support Chat
   - Message sending
   - Mobile keyboard corrections
   - Mana Strength and Mana 28
   - Mana Lyfe workouts
   - Routine checklist
   - Reset breathing feature
   - All existing progress data
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "103710";
  const STYLE_ID = "mana-lyfe-cleanup-103710";

  if (window.MANA_LYFE_CLEANUP_103710) {
    return;
  }

  window.MANA_LYFE_CLEANUP_103710 = true;

  const $ = id =>
    document.getElementById(id);

  /* =========================================
     MANA LYFE DETECTION
     ========================================= */

  function isLyfe() {
    const shell = $("manaV83ProgramShell");

    const title = String(
      $("manaV83Title")?.textContent || ""
    ).trim().toUpperCase();

    return Boolean(
      shell?.classList.contains("open") &&
      (
        title === "MANA LYFE" ||
        title === "MANA LIFE"
      )
    );
  }

  function activeTab() {
    return document.querySelector(
      "#manaV83Tabs .mana-v83-tab.active"
    )?.dataset.v83Tab || "";
  }

  /* =========================================
     HIDE THE CHAT INTRODUCTION

     The existing Lyfe chat renderer may
     recreate this box after opening.
     CSS prevents any visible flash.
     ========================================= */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `

      #manaV95ChatModal.mana-v935-life-mode
      #manaV935LifeChatIntro {
        display: none !important;
      }

    `;

    document.head.appendChild(style);
  }

  function cleanSupportChat() {
    const modal = $("manaV95ChatModal");

    if (!modal) return;

    if (
      !modal.classList.contains(
        "mana-v935-life-mode"
      )
    ) {
      return;
    }

    const intro = $("manaV935LifeChatIntro");

    if (intro) {
      intro.remove();
    }
  }

  /* =========================================
     ROUTINE + RESET WHAKATAUKI

     Keep the last whakatauki exactly
     where it currently appears.

     Remove only the earlier duplicates.
     ========================================= */

  function cleanWhakatauki() {
    if (!isLyfe()) return;

    const tab = activeTab();

    const eligibleTabs = [
      "routine",
      "progress",
      "reclaim",
      "reset"
    ];

    if (!eligibleTabs.includes(tab)) {
      return;
    }

    const content = $("manaV83Content");

    if (!content) return;

    const quotes = Array.from(
      content.querySelectorAll(
        ".mana-v933-whakatauki, " +
        ".mana-v984-whakatauki"
      )
    );

    if (quotes.length <= 1) {
      return;
    }

    /*
     Keep only the final whakatauki.

     No styling, text, padding, or
     surrounding layout is modified.
    */

    quotes.slice(0, -1).forEach(
      quote => quote.remove()
    );
  }

  /* =========================================
     LIGHTWEIGHT REFRESH
     ========================================= */

  let queued = false;

  function clean() {
    cleanSupportChat();
  }

  function scheduleClean() {
    if (queued) return;

    queued = true;

    requestAnimationFrame(() => {
      queued = false;
      clean();
    });
  }

  /* =========================================
     OBSERVE ONLY RELEVANT CONTAINERS
     ========================================= */

  function attachObservers() {
    const content = $("manaV83Content");

    if (content) {
      const contentObserver =
        new MutationObserver(scheduleClean);

      contentObserver.observe(content, {
        childList: true,
        subtree: true
      });
    }

    const modal = $("manaV95ChatModal");

    if (modal) {
      const chatObserver =
        new MutationObserver(scheduleClean);

      chatObserver.observe(modal, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class"]
      });
    }
  }

  /* =========================================
     INIT
     ========================================= */

  function init() {
    installStyles();
    attachObservers();

    window.addEventListener(
      "mana:program-tab-change",
      scheduleClean
    );

    window.addEventListener(
      "mana:life-updated",
      scheduleClean
    );

    document.addEventListener(
      "click",
      event => {
        if (!(event.target instanceof Element)) {
          return;
        }

        if (event.target.closest(
          "#manaV83Tabs, " +
          "[data-v933-support-chat], " +
          ".mana-v978-launch"
        )) {
          scheduleClean();
        }
      }
    );

    window.addEventListener(
      "pageshow",
      scheduleClean
    );

    scheduleClean();

    window.MANA_LYFE_CLEANUP_BUILD = BUILD;

    console.log(
      "Mana Lyfe Cleanup",
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
