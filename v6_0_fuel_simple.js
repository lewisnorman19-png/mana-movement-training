/* =========================================
   MANA MOVEMENT TRAINING v6.0
   Simplified Fuel
   ========================================= */

(() => {
  "use strict";

  const STYLE_ID = "mana-v60-fuel-simple-style";
  const FUEL_STORE_KEY = "mana-fuel-v571";
  const TARGET_KEY = "mana-fuel-v58-targets";
  const SUMMARY_ID = "fuelV60Summary";
function hideRedundantFuelSummary() {
  const fuelView =
    document.getElementById("clientFuelView");

  if (!fuelView) return;

  const candidates =
    fuelView.querySelectorAll(
      ".card, section"
    );

  candidates.forEach(el => {
    const text =
      (el.textContent || "").trim();

    if (
      text.includes("Calories remaining") &&
      text.includes("Protein remaining") &&
      !text.includes("Today's meals")
    ) {
      el.style.display = "none";
    }
  });
}
      text.includes("Calories remaining") &&
      text.includes("Protein remaining") &&
      text.includes("Breakfast") &&
      text.includes("Lunch") &&
      text.includes("Dinner") &&
      text.includes("Snacks")
    ) {
      el.style.display = "none";
    }
  });
}
  function safeJson(raw, fallback) {
    try {
      return JSON.parse(raw);
    } catch (_) {
     
  }

  function loadFuelStore() {
    return safeJson(
      localStorage.getItem(FUEL_STORE_KEY) || "{}",
      {}
    );
  }

  function loadTargets() {
    const saved = safeJson(
      localStorage.getItem(TARGET_KEY) || "{}",
      {}
    );

    return {
      calories: Number(saved.calories) || 2200,
      protein: Number(saved.protein) || 150,
      water: Number(saved.water) || 2500
    };
  }

  function dayTotals(day) {
    const totals = {
      calories: 0,
      protein: 0,
      water: Number(day?.water) || 0
    };

    Object.values(day?.meals || {}).forEach(items => {
      (items || []).forEach(item => {
        totals.calories += Number(item.calories) || 0;
        totals.protein += Number(item.protein) || 0;
      });
    });

    return totals;
  }

  function sevenDaySummary() {
    const store = loadFuelStore();
    const targets = loadTargets();

    let calorieTotal = 0;
    let proteinTotal = 0;
    let loggedDays = 0;
    let waterTargetDays = 0;

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const day = store[dateKey(date)];

      if (!day) continue;

      const totals = dayTotals(day);

      const hasFood =
        totals.calories > 0 ||
        totals.protein > 0;

      const hasWater =
        totals.water > 0;

      if (hasFood || hasWater) {
        loggedDays++;
        calorieTotal += totals.calories;
        proteinTotal += totals.protein;
      }

      if (
        targets.water > 0 &&
        totals.water >= targets.water
      ) {
        waterTargetDays++;
      }
    }

    return {
      loggedDays,
      avgCalories:
        loggedDays > 0
          ? Math.round(calorieTotal / loggedDays)
          : 0,
      avgProtein:
        loggedDays > 0
          ? Math.round(proteinTotal / loggedDays)
          : 0,
      waterTargetDays
    };
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      /* Hide unnecessary macro cards */
      #fuelV58Targets [data-target-card="carbs"],
      #fuelV58Targets [data-target-card="fat"]{
        display:none !important;
      }

      /* Three essentials only */
      #fuelV58Targets .fuel-v58-grid{
        grid-template-columns:1fr 1fr !important;
      }

      #fuelV58Targets [data-target-card="water"]{
        grid-column:1 / -1 !important;
      }

      /* Keep target editor simple */
      #fuelV58TargetsModal
      #fuelV58Carbs,
      #fuelV58TargetsModal
      #fuelV58Fat{
        display:none !important;
      }

      #fuelV58TargetsModal
      .fuel-v58-field:has(#fuelV58Carbs),
      #fuelV58TargetsModal
      .fuel-v58-field:has(#fuelV58Fat){
        display:none !important;
      }

      /* 7 day summary */
      #${SUMMARY_ID}{
        margin-top:12px;
        padding:18px;
        border:1px solid #2b2b2b;
        border-radius:22px;
        background:#101010;
      }

      #${SUMMARY_ID} h3{
        margin:0 0 4px;
        font-size:21px;
      }

      .fuel-v60-sub{
        color:#929292;
        font-size:13px;
        margin-bottom:14px;
      }

      .fuel-v60-grid{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:10px;
      }

      .fuel-v60-stat{
        min-height:92px;
        padding:14px;
        background:#0b0b0b;
        border:1px solid #292929;
        border-radius:16px;
        display:flex;
        flex-direction:column;
        justify-content:center;
      }

      .fuel-v60-label{
        color:#999;
        font-size:12px;
        margin-bottom:6px;
      }

      .fuel-v60-value{
        color:#f5d86e;
        font-size:21px;
        font-weight:800;
        line-height:1.1;
      }

      .fuel-v60-wide{
        grid-column:1 / -1;
      }

      @media(max-width:360px){
        #fuelV58Targets .fuel-v58-grid,
        .fuel-v60-grid{
          grid-template-columns:1fr !important;
        }

        #fuelV58Targets [data-target-card="water"],
        .fuel-v60-wide{
          grid-column:auto !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function hideCarbFatFieldsFallback() {
    const carbs =
      document.getElementById("fuelV58Carbs");

    const fat =
      document.getElementById("fuelV58Fat");

    [carbs, fat].forEach(input => {
      const field =
        input?.closest(".fuel-v58-field");

      if (field) {
        field.style.display = "none";
      }
    });
  }

  function buildSummary() {
    const dashboard =
      document.getElementById("fuelV57Dashboard");

    if (
      !dashboard ||
      document.getElementById(SUMMARY_ID)
    ) {
      return;
    }

    const summary =
      document.createElement("div");

    summary.id = SUMMARY_ID;

    summary.innerHTML = `
      <h3>Last 7 days</h3>

      <div class="fuel-v60-sub">
        Simple weekly consistency check.
      </div>

      <div class="fuel-v60-grid">

        <div class="fuel-v60-stat">
          <div class="fuel-v60-label">
            Avg calories
          </div>
          <div
            class="fuel-v60-value"
            data-v60="calories"
          >
            0
          </div>
        </div>

        <div class="fuel-v60-stat">
          <div class="fuel-v60-label">
            Avg protein
          </div>
          <div
            class="fuel-v60-value"
            data-v60="protein"
          >
            0g
          </div>
        </div>

        <div class="fuel-v60-stat fuel-v60-wide">
          <div class="fuel-v60-label">
            Hydration target reached
          </div>
          <div
            class="fuel-v60-value"
            data-v60="water"
          >
            0 / 7 days
          </div>
        </div>

      </div>
    `;

    dashboard.after(summary);

    renderSummary();
  }

  function renderSummary() {
    const panel =
      document.getElementById(SUMMARY_ID);

    if (!panel) return;

    const summary =
      sevenDaySummary();

    const calories =
      panel.querySelector(
        '[data-v60="calories"]'
      );

    const protein =
      panel.querySelector(
        '[data-v60="protein"]'
      );

    const water =
      panel.querySelector(
        '[data-v60="water"]'
      );

    if (calories) {
      calories.textContent =
        summary.loggedDays
          ? `${summary.avgCalories}`
          : "—";
    }

    if (protein) {
      protein.textContent =
        summary.loggedDays
          ? `${summary.avgProtein}g`
          : "—";
    }

    if (water) {
      water.textContent =
        `${summary.waterTargetDays} / 7 days`;
    }
  }

  function simplifyTargetLabels() {
    const heading =
      document.querySelector(
        "#fuelV58Targets .fuel-v58-head h3"
      );

    if (heading) {
      heading.textContent =
        "Daily essentials";
    }

    const editButton =
      document.getElementById(
        "fuelV58EditTargets"
      );

    if (editButton) {
      editButton.textContent =
        "Edit targets";
    }
  }
function hideNutritionPromo() {
  const fuelView =
    document.getElementById("clientFuelView");

  if (!fuelView) return;

  const candidates =
    fuelView.querySelectorAll(
      ".card, section, div"
    );

  candidates.forEach(el => {
    const text =
      (el.textContent || "").trim();

    if (
      text.includes("Nutrition") &&
      text.includes("Simple foundations for better consistency")
    ) {
      el.style.display = "none";
    }
  });
}
  function initFuelV60() {
    injectStyles();

    setTimeout(() => {
      hideCarbFatFieldsFallback();
      simplifyTargetLabels();
       hideRedundantFuelSummary();
       hideNutritionPromo();
      buildSummary();
      renderSummary();
    }, 300);

    setTimeout(() => {
      hideCarbFatFieldsFallback();
      simplifyTargetLabels();
       hideRedundantFuelSummary();
       hideNutritionPromo();
      buildSummary();
      renderSummary();
    }, 1000);
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initFuelV60
    );
  } else {
    initFuelV60();
  }

  window.addEventListener(
    "storage",
    renderSummary
  );
})();
