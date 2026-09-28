
/* MANA MOVEMENT — Shoulder Illustration v9.58
   Uses the existing Bench Press premium layout.
   No changes to workout logging, timers or Fuel.
*/
(() => {
  "use strict";

  const ASSET = {
    muscle: "assets/exercises/shoulder-press-muscles.png",
    demo: "assets/exercises/shoulder-press-demo.png",
    target: "Shoulders + Triceps"
  };

  function isShoulderPress(name) {
    return /shoulder\s*press|overhead\s*press|military\s*press|dumbbell\s*press|arnold\s*press/i.test(name || "");
  }

  function exerciseName(card) {
    return card.dataset.exerciseName ||
      card.querySelector(".mana-v64-name")?.textContent?.trim() ||
      "";
  }

  function upgradeCard(card) {
    const name = exerciseName(card);
    if (!isShoulderPress(name)) return;

    const title = card.querySelector(".mana-v64-name");
    if (!title) return;

    if (!card.querySelector(".mana-v958-target")) {
      const block = document.createElement("div");
      block.className = "mana-v957-target mana-v958-target";

      const image = document.createElement("img");
      image.src = ASSET.muscle;
      image.alt = "Shoulder muscle illustration";
      image.loading = "lazy";

      const copy = document.createElement("div");
      copy.className = "mana-v957-target-copy";
      copy.innerHTML =
        "<span>PRIMARY TARGET</span><strong>Shoulders + Triceps</strong>";

      block.append(image, copy);

      const old = card.querySelector(".mana-v955-exercise-head");
      if (old) old.style.display = "none";

      image.addEventListener("error", () => {
        block.remove();
        if (old) old.style.display = "";
      }, { once: true });

      title.insertAdjacentElement("afterend", block);
    }

    const button = card.querySelector(".mana-v955-demo-button");

    if (button && button.dataset.manaV958Bound !== "1") {
      button.dataset.manaV958Bound = "1";
      button.classList.add("mana-v957-demo-button");
      button.textContent = "▶ VIEW EXERCISE DEMO";

      button.addEventListener("click", () => {
        setTimeout(() => showShoulderDemo(name), 0);
      });
    }
  }

  function showShoulderDemo(name) {
    const modal = document.getElementById("manaV955DemoModal");
    if (!modal?.classList.contains("open")) return;

    const title = document.getElementById("manaV955Title");
    const demo = document.getElementById("manaV955Demo");
    const muscle = document.getElementById("manaV955Muscle");
    const target = document.getElementById("manaV955MuscleLabel");

    if (!demo) return;

    const image = new Image();
    image.src = ASSET.demo;
    image.alt = name + " demonstration";
    image.className = "mana-v957-demo-image";

    image.onload = () => {
      if (!modal.classList.contains("open")) return;
      if (title && title.textContent.trim() !== name) return;

      const wrap = document.createElement("div");
      wrap.className = "mana-v957-demo-wrap";
      wrap.appendChild(image);
      demo.replaceChildren(wrap);

      if (muscle) {
        const muscleImage = document.createElement("img");
        muscleImage.src = ASSET.muscle;
        muscleImage.alt = "Shoulder muscle target";
        muscleImage.className = "mana-v957-modal-muscle-image";
        muscle.replaceChildren(muscleImage);
      }

      if (target) target.textContent = ASSET.target;
    };
  }

  function refresh() {
    document.querySelectorAll(
      "#manaV64Exercises .mana-v64-card"
    ).forEach(upgradeCard);
  }

  function scheduleRefresh() {
    [100, 350, 750].forEach(delay =>
      setTimeout(refresh, delay)
    );
  }

  function init() {
    scheduleRefresh();

    document.addEventListener("click", event => {
      if (event.target.closest('[data-v83-tab="program"]')) {
        scheduleRefresh();
      }
    });

    [
      "mana:program-tab-change",
      "mana:strength-synced",
      "mana:workout-progress-change"
    ].forEach(event => {
      window.addEventListener(event, scheduleRefresh);
    });

    window.refreshManaShoulderAssets = refresh;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {
      once: true
    });
  } else {
    init();
  }
})();
