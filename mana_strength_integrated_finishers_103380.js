
/* =====================================================
   MANA MOVEMENT TRAINING
   INTEGRATED STRENGTH FINISHERS
   BUILD 103380

   Cardio: #368FD4
   Core:   #D6A437

   - Buttons inside active Strength workout
   - Optional Cardio, Core, both or neither
   - Three rounds per finisher
   - Record results with Strength history
   - Back to Workouts label
   - No changes to Fuel, Learning or Mana Lyfe
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "103380";
  const STYLE_ID = "mana-finishers-103380-style";
  const WORKOUT_ID = "manaV64Screen";
  const LOG_KEY = "mana-strength-v64-logs";

  if (window.MANA_INTEGRATED_FINISHERS === BUILD) {
    return;
  }

  window.MANA_INTEGRATED_FINISHERS = BUILD;

  const PLANS = {
    cardio: {
      label: "CARDIO",
      color: "#368FD4",
      subtitle: "12-minute conditioning",
      movements: [
        ["Brisk march or walk", "2 minutes"],
        ["Low-impact step-ups", "1 minute"],
        ["Fast controlled march", "1 minute"]
      ]
    },
    core: {
      label: "CORE",
      color: "#D6A437",
      subtitle: "Control and stability",
      movements: [
        ["Dead bug", "8 each side"],
        ["Bird dog", "8 each side"],
        ["Side plank", "20 seconds each side"]
      ]
    }
  };

  let results = {};
  let activeType = null;
  let round = 1;
  let checked = new Set();
  let workoutInstance = null;
  let screenObserver = null;

  const $ = id => document.getElementById(id);

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      #manaV64Complete ~ .mf380-section,
      .mf380-section {
        margin: 22px 0;
        padding: 17px;
        border: 1px solid #35353a;
        border-radius: 15px;
        background: #101113;
        color: #fff;
      }

      .mf380-title {
        font-size: 15px;
        font-weight: 900;
        letter-spacing: .5px;
        margin-bottom: 5px;
      }

      .mf380-description {
        font-size: 12px;
        color: #afb4bc;
        margin: 0 0 15px;
        line-height: 1.5;
      }

      .mf380-buttons {
        display: grid;
        grid-template-columns: repeat(2, minmax(0,1fr));
        gap: 11px;
      }

      .mf380-select {
        width: 100%;
        min-width: 0;
        min-height: 92px;
        padding: 13px 8px;
        border-radius: 11px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        background: color-mix(
          in srgb,
          var(--mf-color) 10%,
          #0a1015
        );
        border: 1.5px solid var(--mf-color);
        color: var(--mf-color);
        cursor: pointer;
        font-weight: 900;
        letter-spacing: .8px;
      }

      .mf380-select .mf380-icon {
        font-size: 25px;
        line-height: 1;
      }

      .mf380-select small {
        color: #c0c8d0;
        font-size: 10px;
        letter-spacing: 0;
        font-weight: 500;
        text-align: center;
      }

      .mf380-select.complete {
        box-shadow: inset 0 0 0 1px #70dea0;
      }

      .mf380-panel {
        margin-top: 16px;
        border: 1px solid var(--mf-color);
        border-radius: 12px;
        padding: 15px;
        background: #0c1219;
      }

      .mf380-panel h3 {
        color: var(--mf-color);
        margin: 0 0 7px;
        font-size: 16px;
      }

      .mf380-round {
        font-size: 12px;
        font-weight: 800;
        color: var(--mf-color);
        margin-bottom: 12px;
      }

      .mf380-exercise {
        display: flex;
        align-items: center;
        gap: 11px;
        border: 1px solid #333e48;
        border-radius: 9px;
        padding: 12px;
        margin: 7px 0;
        cursor: pointer;
      }

      .mf380-exercise input {
        width: 19px;
        height: 19px;
        flex-shrink: 0;
        accent-color: var(--mf-color);
      }

      .mf380-exercise strong {
        display: block;
        font-size: 13px;
      }

      .mf380-exercise small {
        display: block;
        font-size: 11px;
        color: #aeb8c5;
        margin-top: 3px;
      }

      .mf380-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 9px;
        margin-top: 15px;
      }

      .mf380-action {
        padding: 12px 8px;
        border: 1px solid #4c5663;
        border-radius: 9px;
        background: #1a222a;
        color: white;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
      }

      .mf380-primary {
        background: var(--mf-color);
        color: #071118;
        border-color: var(--mf-color);
      }

      .mf380-primary:disabled {
        opacity: .35;
        cursor: not-allowed;
      }

      .mf380-saved {
        margin-top: 12px;
        color: #73dfa3;
        font-weight: 700;
        font-size: 12px;
      }

      .mf380-skip {
        margin: 13px 0 0;
        text-align: center;
        font-size: 11px;
        color: #929ba6;
      }
    `;

    document.head.appendChild(style);
  }

  function resetSession() {
    results = {};
    activeType = null;
    round = 1;
    checked.clear();
  }

  function currentScreen() {
    return $("manaV64Complete")?.closest(
      "div[id]"
    );
  }

  function installFinishers() {
    const complete = $("manaV64Complete");
    if (!complete) return;
    if ($("mf380Section")) return;

    const section = document.createElement("section");
    section.id = "mf380Section";
    section.className = "mf380-section";

    section.innerHTML = `
      <div class="mf380-title">
        OPTIONAL FINISHERS
      </div>

      <p class="mf380-description">
        Add Cardio, Core or both before
        completing your Strength workout.
      </p>

      <div class="mf380-buttons">
        <button type="button"
          class="mf380-select"
          style="--mf-color:#368FD4"
          data-mf380-open="cardio">
          <span class="mf380-icon" aria-hidden="true">♥</span>
          CARDIO
          <small>12-minute conditioning</small>
        </button>

        <button type="button"
          class="mf380-select"
          style="--mf-color:#D6A437"
          data-mf380-open="core">
          <span class="mf380-icon" aria-hidden="true">◎</span>
          CORE
          <small>3 rounds</small>
        </button>
      </div>

      <div id="mf380Panel"></div>
      <div id="mf380Saved" class="mf380-saved"></div>

      <p class="mf380-skip">
        Optional — you can finish Strength
        without adding either finisher.
      </p>
    `;

    complete.before(section);
  }

  function renderPanel() {
    const holder = $("mf380Panel");
    if (!holder) return;

    if (!activeType) {
      holder.replaceChildren();
      return;
    }

    const plan = PLANS[activeType];
    const ready = checked.size ===
      plan.movements.length;

    holder.innerHTML = `
      <div class="mf380-panel"
        style="--mf-color:${plan.color}">
        <h3>${plan.label} FINISHER</h3>

        <div class="mf380-round">
          Round ${round} of 3
        </div>

        ${plan.movements.map(
          ([name,amount],i) => `
            <label class="mf380-exercise">
              <input type="checkbox"
                data-mf380-check="${i}"
                ${checked.has(i) ? "checked" : ""}>
              <span>
                <strong>${name}</strong>
                <small>${amount}</small>
              </span>
            </label>
          `
        ).join("")}

        <div class="mf380-actions">
          <button type="button"
            class="mf380-action"
            data-mf380-cancel>
            CLOSE
          </button>

          <button type="button"
            class="mf380-action mf380-primary"
            data-mf380-next
            ${ready ? "" : "disabled"}>
            ${round === 3
              ? "FINISH"
              : "NEXT ROUND"}
          </button>
        </div>
      </div>
    `;
  }

  function updateSaved() {
    const holder = $("mf380Saved");
    if (!holder) return;

    const names = Object.keys(results)
      .filter(key => results[key]?.completed)
      .map(key => PLANS[key].label);

    holder.textContent = names.length
      ? "✓ Added to workout: " + names.join(" + ")
      : "";

    document.querySelectorAll(
      "[data-mf380-open]"
    ).forEach(button => {
      const type = button.dataset.mf380Open;
      button.classList.toggle(
        "complete",
        Boolean(results[type]?.completed)
      );
    });
  }

  function openFinisher(type) {
    if (!PLANS[type]) return;

    activeType = type;
    round = 1;
    checked.clear();
    renderPanel();
  }

  function finishRound() {
    if (!activeType) return;

    const plan = PLANS[activeType];

    if (checked.size !== plan.movements.length) {
      return;
    }

    if (round < 3) {
      round++;
      checked.clear();
      renderPanel();
      return;
    }

    results[activeType] = {
      completed: true,
      rounds: 3,
      completedAt: new Date().toISOString(),
      exercises: plan.movements.map(
        ([name,target]) => ({
          name,
          target,
          roundsCompleted: 3
        })
      )
    };

    activeType = null;
    checked.clear();
    renderPanel();
    updateSaved();
  }

  function handleClick(event) {
    if (!(event.target instanceof Element)) return;

    const open = event.target.closest(
      "[data-mf380-open]"
    );

    if (open) {
      openFinisher(open.dataset.mf380Open);
      return;
    }

    if (event.target.closest(
      "[data-mf380-cancel]"
    )) {
      activeType = null;
      checked.clear();
      renderPanel();
      return;
    }

    if (event.target.closest(
      "[data-mf380-next]"
    )) {
      finishRound();
    }
  }

  function handleChange(event) {
    const input = event.target;

    if (!(input instanceof HTMLInputElement)) return;
    if (!input.matches("[data-mf380-check]")) return;

    const index = Number(input.dataset.mf380Check);

    if (input.checked) checked.add(index);
    else checked.delete(index);

    const next = document.querySelector(
      "[data-mf380-next]"
    );

    if (next && activeType) {
      next.disabled =
        checked.size !==
        PLANS[activeType].movements.length;
    }
  }

  /* =========================================
     ATTACH TO SAME WORKOUT HISTORY RECORD
     ========================================= */

  function saveWithWorkout() {
    const selected = structuredClone(results);

    if (!Object.keys(selected).length) return;

    try {
      const logs = JSON.parse(
        localStorage.getItem(LOG_KEY) || "[]"
      );

      if (!Array.isArray(logs) || !logs.length) {
        return;
      }

      const latest = logs[logs.length - 1];

      if (!latest?.date || !latest?.id) return;

      const age = Date.now() -
        new Date(latest.date).getTime();

      if (age < 0 || age > 15000) return;

      latest.finishers = selected;

      localStorage.setItem(
        LOG_KEY,
        JSON.stringify(logs)
      );

      window.dispatchEvent(
        new CustomEvent(
          "mana:finishers-saved",
          {
            detail: {
              workoutId: latest.id,
              finishers: selected
            }
          }
        )
      );

    } catch (error) {
      console.warn(
        "Mana finishers history save failed",
        error
      );
    }
  }

  /* =========================================
     COMPLETION SUMMARY
     ========================================= */

  function showSummary() {
    const content = $("manaV915Content");
    if (!content) return;
    if ($("mf380History")) return;

    let logs;

    try {
      logs = JSON.parse(
        localStorage.getItem(LOG_KEY) || "[]"
      );
    } catch (_) {
      return;
    }

    const latest = Array.isArray(logs)
      ? logs[logs.length - 1]
      : null;

    const saved = latest?.finishers || {};
    const types = Object.keys(saved)
      .filter(type => saved[type]?.completed);

    if (!types.length) return;

    const section = document.createElement("div");
    section.id = "mf380History";
    section.className = "mf380-section";

    section.innerHTML = `
      <div class="mf380-title">
        FINISHERS COMPLETED
      </div>

      ${types.map(type => `
        <div style="
          margin-top:10px;
          padding:12px;
          border:1px solid ${PLANS[type].color};
          border-radius:10px;
          color:${PLANS[type].color};
          font-weight:800">
          ✓ ${PLANS[type].label} —
          ${saved[type].rounds} rounds
        </div>
      `).join("")}
    `;

    const back = $("manaV915Back");

    if (back && content.contains(back)) {
      back.before(section);
    } else {
      content.appendChild(section);
    }
  }

  function updateBackLabels() {
    document.querySelectorAll(
      "button, a"
    ).forEach(element => {
      if (element.closest(
        "#mf380Section, #mf380Panel"
      )) return;

      const label = (
        element.textContent || ""
      ).trim();

      if (/^back to program\s*[→➜]?\s*$/i.test(label) ||
          /^back to overview\s*[→➜]?\s*$/i.test(label) &&
          element.id === "manaV915Back") {
        element.textContent = "BACK TO WORKOUTS →";
      }
    });
  }

  function init() {
    installStyles();
    installFinishers();
    updateBackLabels();

    document.addEventListener(
      "click",
      handleClick
    );

    document.addEventListener(
      "change",
      handleChange
    );

    // Capture completed finishers with the
    // existing Strength workout save event.
    window.addEventListener(
      "mana:strength-synced",
      () => {
        saveWithWorkout();

        // The original completion summary
        // is rendered asynchronously.
        setTimeout(showSummary, 280);
      }
    );

    const activeWorkout = $("manaV64Complete")
      ?.closest(".mana-v64-screen");

    if (activeWorkout) {
      screenObserver = new MutationObserver(
        () => {
          if (activeWorkout.classList.contains("open")) {
            resetSession();
            updateSaved();
          }
          updateBackLabels();
        }
      );

      screenObserver.observe(activeWorkout, {
        attributes: true,
        attributeFilter: ["class"]
      });
    }

    window.addEventListener(
      "mana:program-tab-change",
      updateBackLabels
    );

    console.log(
      "Mana Integrated Finishers",
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
