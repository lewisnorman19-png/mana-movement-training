
/* =========================================
   MANA MOVEMENT TRAINING v9.57.1
   PREMIUM EXERCISE ASSETS

   - Premium Bench Press muscle diagram
   - Premium Bench Press demo illustration
   - Fixes demo click handler
   - Original diagrams remain as fallback
   - No workout logging or timer changes
   - No auth or Fuel changes
   ========================================= */

(() => {
  "use strict";

  const BUILD = "95710";

  const STYLE_ID =
    "mana-v957-premium-assets-style";

  const ASSETS = {
    "bench press": {
      demo:
        "assets/exercises/bench-press-demo.png",
      muscle:
        "assets/exercises/bench-press-muscles.png",
      target:
        "Chest + Triceps"
    }
  };

  /* =========================================
     EXERCISE LOOKUP
     ========================================= */

  function getAsset(name) {
    const key = String(name || "")
      .toLowerCase()
      .trim();

    if (key.includes("bench press")) {
      return ASSETS["bench press"];
    }

    return null;
  }

  function getName(card) {
    return (
      card?.dataset?.exerciseName ||
      card?.querySelector(".mana-v64-name")
        ?.textContent?.trim() ||
      ""
    );
  }

  /* =========================================
     CSS
     ========================================= */

  function injectStyles() {
    let style = document.getElementById(
      STYLE_ID
    );

    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    style.textContent = `

      /* WORKOUT CARD */

      .mana-v957-target {
        display: grid;
        grid-template-columns:
          160px minmax(0, 1fr);
        align-items: center;
        gap: 14px;
        padding: 12px;
        margin: 12px 0 15px;
        background: #110f0a;
        border: 1px solid #57471d;
        border-radius: 16px;
      }

      .mana-v957-target img {
        display: block;
        width: 160px;
        height: 135px;
        object-fit: cover;
        object-position: 25% center;
        border-radius: 12px;
        background: #050505;
      }

      .mana-v957-target-copy span {
        display: block;
        color: #aaa;
        font-size: 9px;
        font-weight: 800;
        letter-spacing: .08em;
      }

      .mana-v957-target-copy strong {
        display: block;
        margin-top: 6px;
        color: #f3d875;
        font-size: 17px;
        line-height: 1.25;
      }

      /* DEMO BUTTON */

      .mana-v957-demo-button {
        background: #1b1609 !important;
        color: #f3d875 !important;
        border:
          1px solid #796528 !important;
        min-height: 44px !important;
        padding:
          10px 15px !important;
        border-radius: 12px !important;
        font-size: 11px !important;
        font-weight: 900 !important;
      }

      /* DEMO IMAGE */

      .mana-v957-demo-wrap {
        margin-top: 16px;
        border: 1px solid #57471d;
        background: #080808;
        border-radius: 16px;
        overflow: hidden;
      }

      .mana-v957-demo-image {
        display: block;
        width: 100%;
        height: auto;
      }

      /* MODAL SIZE */

      #manaV955DemoModal
      .mana-v955-modal-sheet {
        width:
          min(800px, 96vw) !important;
      }

      /* MUSCLE IMAGE IN MODAL */

      #manaV955DemoModal
      .mana-v955-modal-muscle {
        display: grid;
        grid-template-columns:
          190px minmax(0, 1fr)
          !important;
        gap: 18px !important;
        align-items: center;
      }

      #manaV955DemoModal
      .mana-v955-modal-muscle
      #manaV955Muscle {
        width: 190px !important;
        height: 150px !important;
        overflow: hidden;
        border-radius: 12px;
        background: #050505;
      }

      .mana-v957-modal-muscle-image {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: 25% center;
      }

      /* PHONE */

      @media (max-width: 600px) {

        .mana-v957-target {
          grid-template-columns:
            115px minmax(0, 1fr);
          gap: 10px;
          padding: 10px;
        }

        .mana-v957-target img {
          width: 115px;
          height: 110px;
        }

        .mana-v957-target-copy strong {
          font-size: 14px;
        }

        #manaV955DemoModal
        .mana-v955-modal-sheet {
          width: 100% !important;
        }

        #manaV955DemoModal
        .mana-v955-modal-muscle {
          grid-template-columns:
            120px minmax(0, 1fr)
            !important;
          gap: 12px !important;
        }

        #manaV955DemoModal
        .mana-v955-modal-muscle
        #manaV955Muscle {
          width: 120px !important;
          height: 105px !important;
        }
      }
    `;
  }

  /* =========================================
     PREMIUM WORKOUT CARD
     ========================================= */

  function installCardImage(card, asset) {
    if (
      card.querySelector(
        ".mana-v957-target"
      )
    ) {
      return;
    }

    const title = card.querySelector(
      ".mana-v64-name"
    );

    if (!title) {
      return;
    }

    const block = document.createElement(
      "div"
    );

    block.className =
      "mana-v957-target";

    const image = document.createElement(
      "img"
    );

    image.src = asset.muscle;
    image.alt =
      asset.target + " muscle illustration";
    image.loading = "lazy";

    const copy = document.createElement(
      "div"
    );

    copy.className =
      "mana-v957-target-copy";

    const label = document.createElement(
      "span"
    );

    label.textContent =
      "PRIMARY TARGET";

    const value = document.createElement(
      "strong"
    );

    value.textContent =
      asset.target;

    copy.append(
      label,
      value
    );

    block.append(
      image,
      copy
    );

    const oldDiagram = card.querySelector(
      ".mana-v955-exercise-head"
    );

    if (oldDiagram) {
      oldDiagram.style.display = "none";
    }

    image.addEventListener(
      "error",
      () => {
        block.remove();

        if (oldDiagram) {
          oldDiagram.style.display = "";
        }
      },
      {
        once: true
      }
    );

    title.insertAdjacentElement(
      "afterend",
      block
    );
  }

  /* =========================================
     PREMIUM DEMO MODAL
     ========================================= */

  function showPremiumDemo(name, asset) {
    const modal = document.getElementById(
      "manaV955DemoModal"
    );

    if (
      !modal ||
      !modal.classList.contains("open")
    ) {
      return;
    }

    const demo = document.getElementById(
      "manaV955Demo"
    );

    const muscle = document.getElementById(
      "manaV955Muscle"
    );

    const target = document.getElementById(
      "manaV955MuscleLabel"
    );

    if (!demo) {
      return;
    }

    /*
      Load premium artwork first.
      Only replace the existing diagram
      once the image has loaded.
    */

    const demoImage = new Image();

    demoImage.alt =
      name + " exercise demonstration";

    demoImage.className =
      "mana-v957-demo-image";

    demoImage.onload = () => {
      if (
        !modal.classList.contains("open")
      ) {
        return;
      }

      const wrap = document.createElement(
        "div"
      );

      wrap.className =
        "mana-v957-demo-wrap";

      wrap.appendChild(
        demoImage
      );

      demo.replaceChildren(
        wrap
      );

      if (muscle) {
        const muscleImage =
          document.createElement("img");

        muscleImage.className =
          "mana-v957-modal-muscle-image";

        muscleImage.src =
          asset.muscle;

        muscleImage.alt =
          asset.target + " muscle target";

        muscle.replaceChildren(
          muscleImage
        );
      }

      if (target) {
        target.textContent =
          asset.target;
      }
    };

    demoImage.onerror = () => {
      console.warn(
        "Mana premium demo image could not load:",
        asset.demo
      );
    };

    demoImage.src =
      asset.demo;
  }

  /* =========================================
     ENHANCE EXISTING EXERCISE CARD
     ========================================= */

  function enhanceCard(card) {
    const name = getName(card);

    const asset = getAsset(name);

    if (!asset) {
      return;
    }

    installCardImage(
      card,
      asset
    );

    const button = card.querySelector(
      ".mana-v955-demo-button"
    );

    if (
      !button ||
      button.dataset.manaV957Bound === "1"
    ) {
      return;
    }

    button.dataset.manaV957Bound =
      "1";

    button.classList.add(
      "mana-v957-demo-button"
    );

    button.textContent =
      "▶ VIEW EXERCISE DEMO";

    /*
      FIX:
      v9.55 stops event propagation.

      Listen on the demo button itself,
      rather than on the document.
    */

    button.addEventListener(
      "click",
      () => {
        setTimeout(
          () => {
            showPremiumDemo(
              name,
              asset
            );
          },
          0
        );
      }
    );
  }

  function enhanceCards() {
    document.querySelectorAll(
      "#manaV64Exercises .mana-v64-card"
    ).forEach(
      enhanceCard
    );
  }

  /* =========================================
     REFRESH
     ========================================= */

  function scheduleRefresh() {
    [
      100,
      350,
      750
    ].forEach(
      delay => {
        setTimeout(
          enhanceCards,
          delay
        );
      }
    );
  }

  /* =========================================
     INIT
     ========================================= */

  function init() {
    injectStyles();

    scheduleRefresh();

    document.addEventListener(
      "click",
      event => {
        if (
          event.target.closest(
            '[data-v83-tab="program"]'
          )
        ) {
          scheduleRefresh();
        }
      }
    );

    window.addEventListener(
      "mana:program-tab-change",
      scheduleRefresh
    );

    window.addEventListener(
      "mana:strength-synced",
      scheduleRefresh
    );

    window.addEventListener(
      "mana:workout-progress-change",
      scheduleRefresh
    );

    window.refreshManaPremiumExerciseAssets =
      enhanceCards;

    window.MANA_PREMIUM_EXERCISE_ASSETS_BUILD =
      BUILD;
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once: true
      }
    );
  } else {
    init();
  }
})();
