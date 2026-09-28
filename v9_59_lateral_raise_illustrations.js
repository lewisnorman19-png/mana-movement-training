
/* =========================================
   MANA MOVEMENT TRAINING v9.59
   PREMIUM LATERAL RAISE ILLUSTRATIONS

   - Premium lateral raise muscle image
   - Premium START / FINISH demonstration
   - Same presentation as Bench Press
   - Same presentation as Shoulder Press
   - Works with existing workout cards
   - No workout logging changes
   - No Fuel or authentication changes
   ========================================= */

(() => {
  "use strict";

  const BUILD = "95900";

  const ASSET = {
    muscle:
      "assets/exercises/lateral-raise-muscles.png",

    demo:
      "assets/exercises/lateral-raise-demo.png",

    target:
      "Shoulders (Lateral Deltoids)"
  };

  /* =========================================
     EXERCISE IDENTIFICATION
     ========================================= */

  function isLateralRaise(name) {
    const text = String(name || "")
      .toLowerCase()
      .trim();

    return (
      text.includes("lateral raise") ||
      text.includes("lateral raises") ||
      text.includes("side raise") ||
      text.includes("side raises") ||
      text.includes("side lateral")
    );
  }

  function exerciseName(card) {
    return (
      card.dataset.exerciseName ||
      card.querySelector(".mana-v64-name")
        ?.textContent?.trim() ||
      ""
    );
  }

  /* =========================================
     PREMIUM MUSCLE ILLUSTRATION
     ========================================= */

  function installMuscleImage(card) {
    if (
      card.querySelector(".mana-v959-target")
    ) {
      return;
    }

    const title = card.querySelector(
      ".mana-v64-name"
    );

    if (!title) return;

    const block = document.createElement(
      "div"
    );

    block.className =
      "mana-v957-target mana-v959-target";

    const image = document.createElement(
      "img"
    );

    image.src = ASSET.muscle;

    image.alt =
      "Lateral deltoid muscle illustration";

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
      ASSET.target;

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
      { once: true }
    );

    title.insertAdjacentElement(
      "afterend",
      block
    );
  }

  /* =========================================
     PREMIUM EXERCISE DEMONSTRATION
     ========================================= */

  function showLateralRaiseDemo(name) {
    const modal = document.getElementById(
      "manaV955DemoModal"
    );

    if (
      !modal ||
      !modal.classList.contains("open")
    ) {
      return;
    }

    const title = document.getElementById(
      "manaV955Title"
    );

    const demo = document.getElementById(
      "manaV955Demo"
    );

    const muscle = document.getElementById(
      "manaV955Muscle"
    );

    const target = document.getElementById(
      "manaV955MuscleLabel"
    );

    if (!demo) return;

    const image = new Image();

    image.alt =
      name + " exercise demonstration";

    image.className =
      "mana-v957-demo-image";

    image.onload = () => {
      if (
        !modal.classList.contains("open")
      ) {
        return;
      }

      if (
        title &&
        title.textContent.trim() !== name
      ) {
        return;
      }

      const wrap = document.createElement(
        "div"
      );

      wrap.className =
        "mana-v957-demo-wrap";

      wrap.appendChild(image);

      demo.replaceChildren(wrap);

      /* MUSCLE IMAGE */

      if (muscle) {
        const muscleImage =
          document.createElement("img");

        muscleImage.className =
          "mana-v957-modal-muscle-image";

        muscleImage.alt =
          "Lateral raise muscle target";

        muscleImage.src =
          ASSET.muscle;

        muscle.replaceChildren(
          muscleImage
        );
      }

      /* TARGET LABEL */

      if (target) {
        target.textContent =
          ASSET.target;
      }
    };

    image.onerror = () => {
      console.warn(
        "Mana lateral raise demo image could not load:",
        ASSET.demo
      );
    };

    image.src = ASSET.demo;
  }

  /* =========================================
     UPGRADE EXERCISE CARD
     ========================================= */

  function upgradeCard(card) {
    const name = exerciseName(card);

    if (!isLateralRaise(name)) {
      return;
    }

    installMuscleImage(card);

    const button = card.querySelector(
      ".mana-v955-demo-button"
    );

    if (
      !button ||
      button.dataset.manaV959Bound === "1"
    ) {
      return;
    }

    button.dataset.manaV959Bound = "1";

    button.classList.add(
      "mana-v957-demo-button"
    );

    button.textContent =
      "▶ VIEW EXERCISE DEMO";

    button.addEventListener(
      "click",
      () => {
        setTimeout(() => {
          showLateralRaiseDemo(name);
        }, 0);
      }
    );
  }

  /* =========================================
     REFRESH EXERCISE CARDS
     ========================================= */

  function refresh() {
    document.querySelectorAll(
      "#manaV64Exercises .mana-v64-card"
    ).forEach(upgradeCard);
  }

  function scheduleRefresh() {
    [
      100,
      350,
      750
    ].forEach(delay => {
      setTimeout(
        refresh,
        delay
      );
    });
  }

  /* =========================================
     INITIALISATION
     ========================================= */

  function init() {
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

    window.refreshManaLateralRaiseAssets =
      refresh;

    window.MANA_LATERAL_RAISE_BUILD =
      BUILD;
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }

})();
