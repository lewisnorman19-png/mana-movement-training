
/* =====================================================
   MANA MOVEMENT TRAINING
   MANA LYFE — SMOOTH SCREEN POLISH
   BUILD 103670

   COMPLETE NEW FILE:
   mana_lyfe_smooth_103670.js

   - Preload Overview icon artwork
   - Avoid repeated image loading
   - Stabilise Overview card presentation
   - Improve Learning and Workout scrolling
   - Leave exercise interactions untouched
   - No polling or global MutationObservers
   - No changes to Strength or chat
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "103670";
  const STYLE_ID = "mana-lyfe-smooth-103670";

  if (window.MANA_LYFE_SMOOTH_103670) return;
  window.MANA_LYFE_SMOOTH_103670 = true;

  const $ = id => document.getElementById(id);

  const ICONS = [
    "tab-workout.png",
    "tab-fuel.png",
    "tab-progress.png",
    "tab-learning.png"
  ];

  const images = new Map();

  function isLyfe() {
    const title = (
      $("manaV83Title")?.textContent || ""
    ).trim().toUpperCase();

    return (
      $("manaV83ProgramShell")
        ?.classList.contains("open") &&
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
     PRELOAD ICON ARTWORK
     ========================================= */

  function preloadIcons() {
    ICONS.forEach(filename => {
      const src = "ui/" + filename + "?v=101900";

      if (images.has(src)) return;

      const img = new Image();
      img.decoding = "async";

      images.set(src,img);

      img.src = src;
    });
  }

  /* =========================================
     MOBILE PRESENTATION
     ========================================= */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      @media(max-width:767px) {

        /*
         OVERVIEW ICONS

         Fixed image frame prevents
         layout shifting during loading.
        */

        body.mana-lyfe-smooth
        .mana-v978-icon {
          flex-shrink:0 !important;
          overflow:hidden !important;
        }

        body.mana-lyfe-smooth
        .mana-v978-icon img {
          display:block !important;

          max-width:100% !important;
          max-height:100% !important;

          object-fit:contain !important;

          transform:translateZ(0);
          backface-visibility:hidden;
        }

        /*
         OVERVIEW CARDS

         Prevent decorative transitions
         from replaying after refresh.
        */

        body.mana-lyfe-smooth
        .mana-v978-launch {
          box-sizing:border-box !important;

          transition:
            border-color .12s ease,
            background-color .12s ease !important;
        }

        /*
         WORKOUT + LEARNING

         Keep scrolling smooth without
         changing card dimensions or
         suppressing render functions.
        */

        body.mana-lyfe-smooth
        #manaV83Content {
          -webkit-overflow-scrolling:touch;
        }

        body.mana-lyfe-smooth
        #manaV83Content img {
          max-width:100%;
        }

        /*
         Avoid horizontal overflow from
         long Learning content.
        */

        body.mana-lyfe-smooth
        #manaV83Content p {
          overflow-wrap:break-word;
        }
      }

      @media(prefers-reduced-motion:reduce) {
        body.mana-lyfe-smooth
        .mana-v978-launch {
          transition:none !important;
        }
      }

    `;

    document.head.appendChild(style);
  }

  /* =========================================
     UPDATE PROGRAM STATE
     ========================================= */

  let queued = false;

  function update() {
    if (queued) return;

    queued = true;

    requestAnimationFrame(() => {
      queued = false;

      document.body.classList.toggle(
        "mana-lyfe-smooth",
        Boolean(isLyfe())
      );
    });
  }

  /* =========================================
     PRELOAD WHEN PROGRAM OPENS
     ========================================= */

  function onNavigation() {
    if (isLyfe()) {
      preloadIcons();
    }

    update();
  }

  function init() {
    installStyles();

    // Warm the browser image cache early.
    preloadIcons();

    window.addEventListener(
      "mana:program-tab-change",
      onNavigation
    );

    window.addEventListener(
      "mana:program-change",
      onNavigation
    );

    document.addEventListener(
      "click",
      event => {
        if (!(event.target instanceof Element)) {
          return;
        }

        if (event.target.closest(
          "#manaV83Tabs, " +
          "#manaV80ManaLyfe, " +
          "#manaV80ManaLife, " +
          ".mana-v978-launch"
        )) {
          update();
        }
      }
    );

    window.addEventListener(
      "pageshow",
      onNavigation
    );

    onNavigation();

    window.MANA_LYFE_SMOOTH_BUILD = BUILD;

    console.log(
      "Mana Lyfe Smooth Screens",
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
