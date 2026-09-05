/* =========================================
   MANA MOVEMENT TRAINING v5.7
   Fuel tracker upgrade
   ========================================= */

(() => {
  "use strict";

  const STYLE_ID = "mana-v57-fuel-style";

  function injectFuelStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      .fuel-v57{
        margin-top:18px;
      }

      .fuel-v57-grid{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:14px;
        margin-bottom:16px;
      }

      .fuel-v57-card{
        background:#101010;
        border:1px solid #2b2b2b;
        border-radius:20px;
        padding:20px;
      }

      .fuel-v57-label{
        font-size:14px;
        color:#a8a8a8;
        margin-bottom:8px;
      }

      .fuel-v57-value{
        font-size:34px;
        line-height:1;
        font-weight:800;
        color:#f5d86e;
      }

      .fuel-v57-sub{
        margin-top:8px;
        font-size:14px;
        color:#c7c7c7;
      }

      .fuel-v57-section{
        margin-top:16px;
        background:#101010;
        border:1px solid #2b2b2b;
        border-radius:22px;
        padding:20px;
      }

      .fuel-v57-title{
        font-size:24px;
        font-weight:800;
        margin-bottom:14px;
      }

      .fuel-v57-meal{
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:12px;
        padding:14px 0;
        border-top:1px solid #292929;
      }

      .fuel-v57-meal:first-of-type{
        border-top:0;
      }

      .fuel-v57-meal-name{
        font-size:18px;
        font-weight:700;
      }

      .fuel-v57-meal-meta{
        font-size:13px;
        color:#aaa;
        margin-top:4px;
      }

      .fuel-v57-btn{
        border:1px solid #5d5124;
        background:#15130b;
        color:#f5d86e;
        border-radius:999px;
        padding:10px 14px;
        font-size:14px;
        font-weight:700;
      }

      .fuel-v57-primary{
        width:100%;
        margin-top:16px;
        border:0;
        border-radius:18px;
        padding:16px 18px;
        background:#f5d86e;
        color:#111;
        font-size:18px;
        font-weight:800;
      }

      .fuel-v57-water-row{
        display:flex;
        gap:10px;
        flex-wrap:wrap;
        margin-top:12px;
      }

      .fuel-v57-water{
        flex:1 1 80px;
        min-height:52px;
        border-radius:16px;
        border:1px solid #343434;
        background:#121212;
        color:#f3f3f3;
        font-size:16px;
        font-weight:700;
      }

      @media(max-width:390px){
        .fuel-v57-grid{
          grid-template-columns:1fr 1fr;
          gap:10px;
        }

        .fuel-v57-card{
          padding:16px;
        }

        .fuel-v57-value{
          font-size:30px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function buildFuelDashboard() {
    const fuelView = document.getElementById("clientFuelView");
    if (!fuelView) return;

    if (document.getElementById("fuelV57Dashboard")) return;

    const panel = document.createElement("div");
    panel.id = "fuelV57Dashboard";
    panel.className = "fuel-v57";

    panel.innerHTML = `
      <div class="fuel-v57-grid">

        <div class="fuel-v57-card">
          <div class="fuel-v57-label">Calories</div>
          <div class="fuel-v57-value">0</div>
          <div class="fuel-v57-sub">of daily target</div>
        </div>

        <div class="fuel-v57-card">
          <div class="fuel-v57-label">Protein</div>
          <div class="fuel-v57-value">0g</div>
          <div class="fuel-v57-sub">logged today</div>
        </div>

      </div>

      <div class="fuel-v57-section">
        <div class="fuel-v57-title">Today's meals</div>

        <div class="fuel-v57-meal">
          <div>
            <div class="fuel-v57-meal-name">Breakfast</div>
            <div class="fuel-v57-meal-meta">Nothing logged yet</div>
          </div>
          <button class="fuel-v57-btn" type="button">Add</button>
        </div>

        <div class="fuel-v57-meal">
          <div>
            <div class="fuel-v57-meal-name">Lunch</div>
            <div class="fuel-v57-meal-meta">Nothing logged yet</div>
          </div>
          <button class="fuel-v57-btn" type="button">Add</button>
        </div>

        <div class="fuel-v57-meal">
          <div>
            <div class="fuel-v57-meal-name">Dinner</div>
            <div class="fuel-v57-meal-meta">Nothing logged yet</div>
          </div>
          <button class="fuel-v57-btn" type="button">Add</button>
        </div>

        <div class="fuel-v57-meal">
          <div>
            <div class="fuel-v57-meal-name">Snacks</div>
            <div class="fuel-v57-meal-meta">Nothing logged yet</div>
          </div>
          <button class="fuel-v57-btn" type="button">Add</button>
        </div>

        <button class="fuel-v57-primary" type="button">
          + Quick add meal
        </button>
      </div>

      <div class="fuel-v57-section">
        <div class="fuel-v57-title">Water</div>
        <div class="fuel-v57-sub">
          Build toward your daily hydration target.
        </div>

        <div class="fuel-v57-water-row">
          <button class="fuel-v57-water" type="button">+250ml</button>
          <button class="fuel-v57-water" type="button">+500ml</button>
          <button class="fuel-v57-water" type="button">+750ml</button>
        </div>
      </div>
    `;

    fuelView.prepend(panel);
  }

  function initFuelV57() {
    injectFuelStyles();
    buildFuelDashboard();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFuelV57);
  } else {
    initFuelV57();
  }

  new MutationObserver(() => {
    buildFuelDashboard();
  }).observe(document.body, {
    childList: true,
    subtree: true
  });
     /* =========================================
     FUEL v5.7.1 — FUNCTIONAL TRACKING
     ========================================= */

  const FUEL_STORE_KEY = "mana-fuel-v571";

  function fuelTodayKey() {
    const d = new Date();
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0")
    ].join("-");
  }

  function fuelLoad() {
    try {
      const all = JSON.parse(
        localStorage.getItem(FUEL_STORE_KEY) || "{}"
      );

      const key = fuelTodayKey();

      return all[key] || {
        meals: {
          Breakfast: [],
          Lunch: [],
          Dinner: [],
          Snacks: []
        },
        water: 0
      };
    } catch (err) {
      return {
        meals: {
          Breakfast: [],
          Lunch: [],
          Dinner: [],
          Snacks: []
        },
        water: 0
      };
    }
  }

  function fuelSave(data) {
    const all = JSON.parse(
      localStorage.getItem(FUEL_STORE_KEY) || "{}"
    );

    all[fuelTodayKey()] = data;

    localStorage.setItem(
      FUEL_STORE_KEY,
      JSON.stringify(all)
    );
  }

  function fuelEscape(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function fuelTotals(data) {
    let calories = 0;
    let protein = 0;

    Object.values(data.meals).forEach(items => {
      items.forEach(item => {
        calories += Number(item.calories) || 0;
        protein += Number(item.protein) || 0;
      });
    });

    return { calories, protein };
  }

  function fuelRender() {
    const panel =
      document.getElementById("fuelV57Dashboard");

    if (!panel) return;

    const data = fuelLoad();
    const totals = fuelTotals(data);

    const valueEls =
      panel.querySelectorAll(".fuel-v57-value");

    if (valueEls[0]) {
      valueEls[0].textContent = totals.calories;
    }

    if (valueEls[1]) {
      valueEls[1].textContent =
        `${totals.protein}g`;
    }

    const mealRows =
      panel.querySelectorAll(".fuel-v57-meal");

    mealRows.forEach(row => {
      const nameEl =
        row.querySelector(".fuel-v57-meal-name");

      const metaEl =
        row.querySelector(".fuel-v57-meal-meta");

      if (!nameEl || !metaEl) return;

      const mealName =
        nameEl.textContent.trim();

      const items =
        data.meals[mealName] || [];

      if (!items.length) {
        metaEl.textContent =
          "Nothing logged yet";
        return;
      }

      const mealCalories =
        items.reduce(
          (sum, item) =>
            sum + (Number(item.calories) || 0),
          0
        );

      const mealProtein =
        items.reduce(
          (sum, item) =>
            sum + (Number(item.protein) || 0),
          0
        );

      metaEl.innerHTML =
        `${items.length} item${items.length === 1 ? "" : "s"}`
        + ` • ${mealCalories} cal`
        + ` • ${mealProtein}g protein`;
    });

    let waterDisplay =
      panel.querySelector("#fuelV57WaterTotal");

    if (!waterDisplay) {
      const waterSection =
        panel.querySelector(
          ".fuel-v57-water-row"
        );

      if (waterSection) {
        waterDisplay =
          document.createElement("div");

        waterDisplay.id =
          "fuelV57WaterTotal";

        waterDisplay.className =
          "fuel-v57-value";

        waterDisplay.style.fontSize =
          "28px";

        waterDisplay.style.marginBottom =
          "14px";

        waterSection.before(waterDisplay);
      }
    }

    if (waterDisplay) {
      waterDisplay.textContent =
        `${data.water} ml`;
    }
  }

  function fuelCreateModal() {
    if (
      document.getElementById(
        "fuelV571Modal"
      )
    ) return;

    const style =
      document.createElement("style");

    style.textContent = `
      #fuelV571Modal{
        position:fixed;
        inset:0;
        z-index:99999;
        background:rgba(0,0,0,.78);
        display:none;
        align-items:flex-end;
      }

      #fuelV571Modal.open{
        display:flex;
      }

      .fuel-v571-sheet{
        width:100%;
        background:#111;
        border:1px solid #333;
        border-radius:28px 28px 0 0;
        padding:24px 22px
          calc(28px + env(safe-area-inset-bottom));
      }

      .fuel-v571-sheet h2{
        margin:0 0 20px;
        font-size:28px;
      }

      .fuel-v571-field{
        width:100%;
        box-sizing:border-box;
        margin-bottom:12px;
        padding:16px;
        border-radius:16px;
        border:1px solid #393939;
        background:#090909;
        color:#fff;
        font-size:17px;
      }

      .fuel-v571-save{
        width:100%;
        padding:17px;
        border:0;
        border-radius:18px;
        background:#f5d86e;
        color:#111;
        font-weight:800;
        font-size:18px;
      }

      .fuel-v571-cancel{
        width:100%;
        margin-top:10px;
        padding:14px;
        border:0;
        background:transparent;
        color:#aaa;
        font-size:16px;
      }
    `;

    document.head.appendChild(style);

    const modal =
      document.createElement("div");

    modal.id = "fuelV571Modal";

    modal.innerHTML = `
      <div class="fuel-v571-sheet">
        <h2>Add meal</h2>

        <select
          id="fuelV571Meal"
          class="fuel-v571-field"
        >
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snacks</option>
        </select>

        <input
          id="fuelV571Food"
          class="fuel-v571-field"
          placeholder="Food name"
        >

        <input
          id="fuelV571Calories"
          class="fuel-v571-field"
          type="number"
          inputmode="numeric"
          placeholder="Calories"
        >

        <input
          id="fuelV571Protein"
          class="fuel-v571-field"
          type="number"
          inputmode="decimal"
          placeholder="Protein (g)"
        >

        <button
          id="fuelV571Save"
          class="fuel-v571-save"
          type="button"
        >
          Save meal
        </button>

        <button
          id="fuelV571Cancel"
          class="fuel-v571-cancel"
          type="button"
        >
          Cancel
        </button>
      </div>
    `;

    document.body.appendChild(modal);
  }

  function fuelOpenModal(meal) {
    fuelCreateModal();

    const modal =
      document.getElementById(
        "fuelV571Modal"
      );

    const select =
      document.getElementById(
        "fuelV571Meal"
      );

    if (meal && select) {
      select.value = meal;
    }

    modal.classList.add("open");

    setTimeout(() => {
      document
        .getElementById("fuelV571Food")
        ?.focus();
    }, 100);
  }

  document.addEventListener(
    "click",
    event => {

      const addButton =
        event.target.closest(
          ".fuel-v57-meal .fuel-v57-btn"
        );

      if (addButton) {
        const row =
          addButton.closest(
            ".fuel-v57-meal"
          );

        const meal =
          row
            ?.querySelector(
              ".fuel-v57-meal-name"
            )
            ?.textContent
            ?.trim();

        fuelOpenModal(meal);
        return;
      }

      if (
        event.target.closest(
          ".fuel-v57-primary"
        )
      ) {
        fuelOpenModal("Breakfast");
        return;
      }

      const water =
        event.target.closest(
          ".fuel-v57-water"
        );

      if (water) {
        const amount =
          Number(
            water.textContent
              .replace(/\D/g, "")
          ) || 0;

        const data = fuelLoad();
        data.water += amount;

        fuelSave(data);
        fuelRender();
        return;
      }

      if (
        event.target.id ===
        "fuelV571Cancel"
      ) {
        document
          .getElementById(
            "fuelV571Modal"
          )
          ?.classList.remove("open");
      }

      if (
        event.target.id ===
        "fuelV571Save"
      ) {
        const meal =
          document.getElementById(
            "fuelV571Meal"
          ).value;

        const food =
          document.getElementById(
            "fuelV571Food"
          ).value.trim();

        const calories =
          Number(
            document.getElementById(
              "fuelV571Calories"
            ).value
          ) || 0;

        const protein =
          Number(
            document.getElementById(
              "fuelV571Protein"
            ).value
          ) || 0;

        if (!food) return;

        const data = fuelLoad();

        data.meals[meal].push({
          food,
          calories,
          protein,
          created_at:
            new Date().toISOString()
        });

        fuelSave(data);

        document.getElementById(
          "fuelV571Food"
        ).value = "";

        document.getElementById(
          "fuelV571Calories"
        ).value = "";

        document.getElementById(
          "fuelV571Protein"
        ).value = "";

        document
          .getElementById(
            "fuelV571Modal"
          )
          .classList.remove("open");

        fuelRender();
      }
    }
  );

  

  fuelCreateModal();
  fuelRender();
/* =========================================
   FUEL v5.7.2 — ITEM LIST + DELETE
   ========================================= */

function fuelRenderItems() {
  const panel = document.getElementById("fuelV57Dashboard");
  if (!panel) return;

  const data = fuelLoad();

  const mealRows = panel.querySelectorAll(".fuel-v57-meal");

  mealRows.forEach(row => {
    const nameEl = row.querySelector(".fuel-v57-meal-name");
    if (!nameEl) return;

    const mealName = nameEl.textContent.trim();
    const items = data.meals[mealName] || [];

    let list = row.parentElement.querySelector(
      `[data-fuel-list="${mealName}"]`
    );

    if (!list) {
      list = document.createElement("div");
      list.setAttribute("data-fuel-list", mealName);
      list.style.padding = "0 0 8px 0";

      row.insertAdjacentElement("afterend", list);
    }

    if (!items.length) {
      list.innerHTML = "";
      return;
    }

    list.innerHTML = items
      .map((item, index) => `
        <div style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:12px;
          padding:10px 0;
          border-top:1px solid #242424;
        ">
          <div>
            <div style="
              font-size:16px;
              font-weight:700;
              color:#f2f2f2;
            ">
              ${fuelEscape(item.food)}
            </div>

            <div class="tiny muted" style="margin-top:3px;">
              ${Number(item.calories) || 0} cal
              • ${Number(item.protein) || 0}g protein
            </div>
          </div>

          <button
            type="button"
            class="fuel-v572-delete"
            data-meal="${mealName}"
            data-index="${index}"
            style="
              border:1px solid #4a2a2a;
              background:#170d0d;
              color:#e9a7a7;
              border-radius:999px;
              padding:8px 12px;
              font-size:13px;
              font-weight:700;
            "
          >
            Delete
          </button>
        </div>
      `)
      .join("");
  });
}

document.addEventListener("click", event => {
  const btn = event.target.closest(".fuel-v572-delete");
  if (!btn) return;

  const meal = btn.dataset.meal;
  const index = Number(btn.dataset.index);

  const data = fuelLoad();

  if (
    !data.meals[meal] ||
    !Number.isInteger(index) ||
    !data.meals[meal][index]
  ) return;

  data.meals[meal].splice(index, 1);

  fuelSave(data);
  fuelRender();
  fuelRenderItems();
});

const originalFuelRender = fuelRender;

fuelRender = function() {
  originalFuelRender();
  fuelRenderItems();
};

fuelRenderItems();
/* =========================================
   FUEL v5.7.3 — DAILY TARGETS
   ========================================= */

const FUEL_TARGET_KEY = "mana-fuel-targets-v573";

function fuelLoadTargets() {
  try {
    return JSON.parse(
      localStorage.getItem(FUEL_TARGET_KEY)
    ) || {
      calories: 2200,
      protein: 150
    };
  } catch (err) {
    return {
      calories: 2200,
      protein: 150
    };
  }
}

function fuelEnsureTargetStyles() {
  if (
    document.getElementById(
      "mana-fuel-v573-target-style"
    )
  ) return;

  const style = document.createElement("style");

  style.id = "mana-fuel-v573-target-style";

  style.textContent = `
    .fuel-v573-target{
      margin-top:10px;
      font-size:14px;
      color:#b5b5b5;
    }

    .fuel-v573-bar{
      width:100%;
      height:8px;
      background:#262626;
      border-radius:999px;
      overflow:hidden;
      margin-top:12px;
    }

    .fuel-v573-fill{
      height:100%;
      width:0%;
      background:#f5d86e;
      border-radius:999px;
      transition:width .25s ease;
    }

    .fuel-v573-percent{
      margin-top:7px;
      font-size:12px;
      color:#8e8e8e;
    }
  `;

  document.head.appendChild(style);
}

function fuelRenderTargets() {
  fuelEnsureTargetStyles();

  const panel =
    document.getElementById(
      "fuelV57Dashboard"
    );

  if (!panel) return;

  const data = fuelLoad();
  const totals = fuelTotals(data);
  const targets = fuelLoadTargets();

  const cards =
    panel.querySelectorAll(
      ".fuel-v57-card"
    );

  if (cards.length < 2) return;

  const caloriePct =
    targets.calories > 0
      ? Math.min(
          100,
          Math.round(
            (totals.calories /
              targets.calories) *
              100
          )
        )
      : 0;

  const proteinPct =
    targets.protein > 0
      ? Math.min(
          100,
          Math.round(
            (totals.protein /
              targets.protein) *
              100
          )
        )
      : 0;

  cards[0]
    .querySelector(
      ".fuel-v57-sub"
    )
    .textContent =
      `of ${targets.calories.toLocaleString()} cal target`;

  cards[1]
    .querySelector(
      ".fuel-v57-sub"
    )
    .textContent =
      `of ${targets.protein}g target`;

  let calTarget =
    cards[0].querySelector(
      ".fuel-v573-target"
    );

  if (!calTarget) {
    calTarget =
      document.createElement("div");

    calTarget.className =
      "fuel-v573-target";

    calTarget.innerHTML = `
      <div class="fuel-v573-bar">
        <div
          class="fuel-v573-fill"
          data-fuel-target-fill="calories"
        ></div>
      </div>

      <div
        class="fuel-v573-percent"
        data-fuel-target-percent="calories"
      ></div>
    `;

    cards[0].appendChild(calTarget);
  }

  let proteinTarget =
    cards[1].querySelector(
      ".fuel-v573-target"
    );

  if (!proteinTarget) {
    proteinTarget =
      document.createElement("div");

    proteinTarget.className =
      "fuel-v573-target";

    proteinTarget.innerHTML = `
      <div class="fuel-v573-bar">
        <div
          class="fuel-v573-fill"
          data-fuel-target-fill="protein"
        ></div>
      </div>

      <div
        class="fuel-v573-percent"
        data-fuel-target-percent="protein"
      ></div>
    `;

    cards[1].appendChild(proteinTarget);
  }

  const calorieFill =
    panel.querySelector(
      '[data-fuel-target-fill="calories"]'
    );

  const proteinFill =
    panel.querySelector(
      '[data-fuel-target-fill="protein"]'
    );

  const caloriePercent =
    panel.querySelector(
      '[data-fuel-target-percent="calories"]'
    );

  const proteinPercent =
    panel.querySelector(
      '[data-fuel-target-percent="protein"]'
    );

  if (calorieFill) {
    calorieFill.style.width =
      `${caloriePct}%`;
  }

  if (proteinFill) {
    proteinFill.style.width =
      `${proteinPct}%`;
  }

  if (caloriePercent) {
    caloriePercent.textContent =
      `${totals.calories.toLocaleString()} / ${targets.calories.toLocaleString()} cal • ${caloriePct}%`;
  }

  if (proteinPercent) {
    proteinPercent.textContent =
      `${totals.protein} / ${targets.protein}g • ${proteinPct}%`;
  }
}

const fuelRenderV572 = fuelRender;

fuelRender = function() {
  fuelRenderV572();
  fuelRenderTargets();
};

fuelRenderTargets();   
/* =========================================
   FUEL v5.7.4 — PERSONAL NUTRITION ENGINE
   ========================================= */

const FUEL_PROFILE_KEY = "mana-fuel-profile-v574";

function fuelLoadNutritionProfile() {
  try {
    return JSON.parse(
      localStorage.getItem(FUEL_PROFILE_KEY) || "null"
    );
  } catch (err) {
    return null;
  }
}

function fuelSaveNutritionProfile(profile) {
  localStorage.setItem(
    FUEL_PROFILE_KEY,
    JSON.stringify(profile)
  );
}

/* Mifflin-St Jeor starting estimate */
function fuelCalculatePersonalTargets(profile) {
  const weight = Number(profile.weight);
  const height = Number(profile.height);
  const age = Number(profile.age);

  if (
    !weight ||
    !height ||
    !age ||
    !profile.sex ||
    !profile.activity ||
    !profile.goal
  ) {
    return {
      calories: 2200,
      protein: 150
    };
  }

  let bmr;

  if (profile.sex === "male") {
    bmr =
      (10 * weight) +
      (6.25 * height) -
      (5 * age) +
      5;
  } else {
    bmr =
      (10 * weight) +
      (6.25 * height) -
      (5 * age) -
      161;
  }

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    high: 1.725,
    veryHigh: 1.9
  };

  const activity =
    activityMultipliers[profile.activity] || 1.55;

  let calories = bmr * activity;

  if (profile.goal === "fatLoss") {
    calories *= 0.85;
  }

  if (profile.goal === "muscleGain") {
    calories *= 1.10;
  }

  calories =
    Math.round(calories / 50) * 50;

  let proteinMultiplier = 1.6;

  if (profile.goal === "fatLoss") {
    proteinMultiplier = 2.0;
  }

  if (profile.goal === "muscleGain") {
    proteinMultiplier = 1.8;
  }

  let protein =
    weight * proteinMultiplier;

  protein =
    Math.round(protein / 5) * 5;

  return {
    calories,
    protein
  };
}

/* Replace the old fixed target loader */
fuelLoadTargets = function() {
  const profile =
    fuelLoadNutritionProfile();

  if (!profile) {
    return {
      calories: 2200,
      protein: 150
    };
  }

  return fuelCalculatePersonalTargets(profile);
};

function fuelCreateProfileModal() {
  if (
    document.getElementById(
      "fuelV574ProfileModal"
    )
  ) return;

  const style =
    document.createElement("style");

  style.id = "fuel-v574-profile-style";

  style.textContent = `
    #fuelV574ProfileModal{
      position:fixed;
      inset:0;
      z-index:100000;
      background:rgba(0,0,0,.82);
      display:none;
      align-items:flex-end;
    }

    #fuelV574ProfileModal.open{
      display:flex;
    }

    .fuel-v574-sheet{
      width:100%;
      max-height:90vh;
      overflow:auto;
      box-sizing:border-box;
      background:#111;
      border:1px solid #333;
      border-radius:28px 28px 0 0;
      padding:24px 22px
        calc(28px + env(safe-area-inset-bottom));
    }

    .fuel-v574-sheet h2{
      margin:0 0 6px;
      font-size:28px;
    }

    .fuel-v574-intro{
      color:#aaa;
      font-size:14px;
      margin-bottom:20px;
      line-height:1.5;
    }

    .fuel-v574-label{
      display:block;
      color:#f5d86e;
      font-size:13px;
      font-weight:700;
      margin:13px 0 7px;
    }

    .fuel-v574-field{
      width:100%;
      box-sizing:border-box;
      padding:15px;
      border-radius:15px;
      border:1px solid #393939;
      background:#090909;
      color:#fff;
      font-size:17px;
    }

    .fuel-v574-save{
      width:100%;
      margin-top:22px;
      padding:17px;
      border:0;
      border-radius:18px;
      background:#f5d86e;
      color:#111;
      font-size:18px;
      font-weight:800;
    }

    .fuel-v574-cancel{
      width:100%;
      padding:14px;
      border:0;
      background:transparent;
      color:#aaa;
      font-size:16px;
    }

    .fuel-v574-profile-card{
      margin-top:16px;
      padding:18px;
      background:#101010;
      border:1px solid #2b2b2b;
      border-radius:20px;
    }

    .fuel-v574-profile-btn{
      width:100%;
      border:1px solid #5d5124;
      background:#15130b;
      color:#f5d86e;
      padding:14px;
      border-radius:16px;
      font-size:16px;
      font-weight:700;
    }

    .fuel-v574-summary{
      margin-top:12px;
      color:#aaa;
      font-size:13px;
      line-height:1.5;
    }
  `;

  document.head.appendChild(style);

  const modal =
    document.createElement("div");

  modal.id = "fuelV574ProfileModal";

  modal.innerHTML = `
    <div class="fuel-v574-sheet">

      <h2>Nutrition profile</h2>

      <div class="fuel-v574-intro">
        Mana uses these details to calculate
        a personalised daily starting target.
      </div>

      <label class="fuel-v574-label">
        Age
      </label>

      <input
        id="fuelV574Age"
        class="fuel-v574-field"
        type="number"
        inputmode="numeric"
        placeholder="Age"
      >

      <label class="fuel-v574-label">
        Height
      </label>

      <input
        id="fuelV574Height"
        class="fuel-v574-field"
        type="number"
        inputmode="decimal"
        placeholder="Height in cm"
      >

      <label class="fuel-v574-label">
        Weight
      </label>

      <input
        id="fuelV574Weight"
        class="fuel-v574-field"
        type="number"
        inputmode="decimal"
        placeholder="Weight in kg"
      >

      <label class="fuel-v574-label">
        Sex used for calorie calculation
      </label>

      <select
        id="fuelV574Sex"
        class="fuel-v574-field"
      >
        <option value="">Select</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <label class="fuel-v574-label">
        Activity level
      </label>

      <select
        id="fuelV574Activity"
        class="fuel-v574-field"
      >
        <option value="">
          Select activity
        </option>

        <option value="sedentary">
          Low activity
        </option>

        <option value="light">
          Light — 1–3 sessions/week
        </option>

        <option value="moderate">
          Moderate — 3–5 sessions/week
        </option>

        <option value="high">
          High — 6–7 sessions/week
        </option>

        <option value="veryHigh">
          Very high / physical job
        </option>
      </select>

      <label class="fuel-v574-label">
        Goal
      </label>

      <select
        id="fuelV574Goal"
        class="fuel-v574-field"
      >
        <option value="">
          Select goal
        </option>

        <option value="fatLoss">
          Fat loss
        </option>

        <option value="maintain">
          Maintain
        </option>

        <option value="muscleGain">
          Build muscle
        </option>
      </select>

      <button
        id="fuelV574Save"
        class="fuel-v574-save"
        type="button"
      >
        Calculate my targets
      </button>

      <button
        id="fuelV574Cancel"
        class="fuel-v574-cancel"
        type="button"
      >
        Cancel
      </button>

    </div>
  `;

  document.body.appendChild(modal);
}

function fuelEnsureProfileCard() {
  const panel =
    document.getElementById(
      "fuelV57Dashboard"
    );

  if (!panel) return;

  let card =
    document.getElementById(
      "fuelV574ProfileCard"
    );

  if (!card) {
    card = document.createElement("div");

    card.id = "fuelV574ProfileCard";
    card.className =
      "fuel-v574-profile-card";

    const grid =
      panel.querySelector(
        ".fuel-v57-grid"
      );

    if (grid) {
      grid.insertAdjacentElement(
        "afterend",
        card
      );
    }
  }

  const profile =
    fuelLoadNutritionProfile();

  const targets =
    fuelLoadTargets();

  if (!profile) {
    card.innerHTML = `
      <button
        class="fuel-v574-profile-btn"
        id="fuelV574Open"
        type="button"
      >
        Set personalised nutrition target
      </button>

      <div class="fuel-v574-summary">
        Add your body details, activity and
        goal to personalise calories and protein.
      </div>
    `;

    return;
  }

  const goalNames = {
    fatLoss: "Fat loss",
    maintain: "Maintain",
    muscleGain: "Build muscle"
  };

  card.innerHTML = `
    <button
      class="fuel-v574-profile-btn"
      id="fuelV574Open"
      type="button"
    >
      Update nutrition profile
    </button>

    <div class="fuel-v574-summary">
      ${profile.age} yrs
      • ${profile.height} cm
      • ${profile.weight} kg
      • ${goalNames[profile.goal] || profile.goal}
      <br>
      Mana target:
      ${targets.calories.toLocaleString()} cal
      • ${targets.protein}g protein
    </div>
  `;
}

function fuelOpenProfileModal() {
  fuelCreateProfileModal();

  const profile =
    fuelLoadNutritionProfile();

  if (profile) {
    document.getElementById(
      "fuelV574Age"
    ).value = profile.age || "";

    document.getElementById(
      "fuelV574Height"
    ).value = profile.height || "";

    document.getElementById(
      "fuelV574Weight"
    ).value = profile.weight || "";

    document.getElementById(
      "fuelV574Sex"
    ).value = profile.sex || "";

    document.getElementById(
      "fuelV574Activity"
    ).value = profile.activity || "";

    document.getElementById(
      "fuelV574Goal"
    ).value = profile.goal || "";
  }

  document
    .getElementById(
      "fuelV574ProfileModal"
    )
    .classList.add("open");
}

document.addEventListener(
  "click",
  event => {

    if (
      event.target.closest(
        "#fuelV574Open"
      )
    ) {
      fuelOpenProfileModal();
      return;
    }

    if (
      event.target.id ===
      "fuelV574Cancel"
    ) {
      document
        .getElementById(
          "fuelV574ProfileModal"
        )
        ?.classList.remove("open");

      return;
    }

    if (
      event.target.id ===
      "fuelV574Save"
    ) {
      const profile = {
        age:
          Number(
            document.getElementById(
              "fuelV574Age"
            ).value
          ),

        height:
          Number(
            document.getElementById(
              "fuelV574Height"
            ).value
          ),

        weight:
          Number(
            document.getElementById(
              "fuelV574Weight"
            ).value
          ),

        sex:
          document.getElementById(
            "fuelV574Sex"
          ).value,

        activity:
          document.getElementById(
            "fuelV574Activity"
          ).value,

        goal:
          document.getElementById(
            "fuelV574Goal"
          ).value
      };

      if (
        !profile.age ||
        !profile.height ||
        !profile.weight ||
        !profile.sex ||
        !profile.activity ||
        !profile.goal
      ) {
        alert(
          "Please complete all profile fields."
        );

        return;
      }

      fuelSaveNutritionProfile(profile);

      document
        .getElementById(
          "fuelV574ProfileModal"
        )
        .classList.remove("open");

      fuelRender();
      fuelRenderTargets();
      fuelEnsureProfileCard();
    }
  }
);

const fuelRenderV573 = fuelRender;

fuelRender = function() {
  fuelRenderV573();
  fuelEnsureProfileCard();
};

fuelCreateProfileModal();
fuelEnsureProfileCard();
fuelRenderTargets();  
 /* =========================================
   FUEL v5.7.5 — COACH OVERRIDE
   ========================================= */

const FUEL_COACH_OVERRIDE_KEY =
  "mana-fuel-coach-override-v575";

/* Keep the automatic v5.7.4 calculation */
const fuelLoadTargetsV574 = fuelLoadTargets;

function fuelLoadCoachOverride() {
  try {
    return JSON.parse(
      localStorage.getItem(
        FUEL_COACH_OVERRIDE_KEY
      ) || "null"
    );
  } catch (err) {
    return null;
  }
}

function fuelSaveCoachOverride(override) {
  localStorage.setItem(
    FUEL_COACH_OVERRIDE_KEY,
    JSON.stringify(override)
  );
}

function fuelClearCoachOverride() {
  localStorage.removeItem(
    FUEL_COACH_OVERRIDE_KEY
  );
}

/* Override the target loader */
fuelLoadTargets = function() {
  const override =
    fuelLoadCoachOverride();

  if (
    override &&
    Number(override.calories) > 0 &&
    Number(override.protein) > 0
  ) {
    return {
      calories: Number(override.calories),
      protein: Number(override.protein)
    };
  }

  return fuelLoadTargetsV574();
};

function fuelCreateCoachOverrideModal() {
  if (
    document.getElementById(
      "fuelV575CoachModal"
    )
  ) return;

  const style =
    document.createElement("style");

  style.id =
    "fuel-v575-coach-style";

  style.textContent = `
    #fuelV575CoachModal{
      position:fixed;
      inset:0;
      z-index:100001;
      background:rgba(0,0,0,.82);
      display:none;
      align-items:flex-end;
    }

    #fuelV575CoachModal.open{
      display:flex;
    }

    .fuel-v575-sheet{
      width:100%;
      box-sizing:border-box;
      background:#111;
      border:1px solid #333;
      border-radius:28px 28px 0 0;
      padding:24px 22px
        calc(28px + env(safe-area-inset-bottom));
    }

    .fuel-v575-sheet h2{
      margin:0 0 6px;
      font-size:28px;
    }

    .fuel-v575-intro{
      color:#aaa;
      font-size:14px;
      line-height:1.5;
      margin-bottom:20px;
    }

    .fuel-v575-label{
      display:block;
      color:#f5d86e;
      font-size:13px;
      font-weight:700;
      margin:14px 0 7px;
    }

    .fuel-v575-field{
      width:100%;
      box-sizing:border-box;
      padding:16px;
      border-radius:15px;
      border:1px solid #393939;
      background:#090909;
      color:#fff;
      font-size:17px;
    }

    .fuel-v575-save{
      width:100%;
      margin-top:22px;
      padding:17px;
      border:0;
      border-radius:18px;
      background:#f5d86e;
      color:#111;
      font-weight:800;
      font-size:18px;
    }

    .fuel-v575-auto{
      width:100%;
      margin-top:10px;
      padding:15px;
      border:1px solid #5d5124;
      border-radius:16px;
      background:#15130b;
      color:#f5d86e;
      font-size:16px;
      font-weight:700;
    }

    .fuel-v575-cancel{
      width:100%;
      padding:14px;
      border:0;
      background:transparent;
      color:#aaa;
      font-size:16px;
    }

    .fuel-v575-card{
      margin-top:14px;
      padding:18px;
      border:1px solid #2b2b2b;
      border-radius:20px;
      background:#101010;
    }

    .fuel-v575-btn{
      width:100%;
      padding:14px;
      border:1px solid #5d5124;
      border-radius:16px;
      background:#15130b;
      color:#f5d86e;
      font-size:16px;
      font-weight:700;
    }

    .fuel-v575-summary{
      margin-top:11px;
      color:#aaa;
      font-size:13px;
      line-height:1.5;
    }

    .fuel-v575-badge{
      color:#f5d86e;
      font-weight:700;
    }
  `;

  document.head.appendChild(style);

  const modal =
    document.createElement("div");

  modal.id =
    "fuelV575CoachModal";

  modal.innerHTML = `
    <div class="fuel-v575-sheet">

      <h2>Coach override</h2>

      <div class="fuel-v575-intro">
        Fine-tune the client's nutrition target
        without changing their profile.
      </div>

      <label class="fuel-v575-label">
        Daily calories
      </label>

      <input
        id="fuelV575Calories"
        class="fuel-v575-field"
        type="number"
        inputmode="numeric"
        placeholder="e.g. 2500"
      >

      <label class="fuel-v575-label">
        Daily protein
      </label>

      <input
        id="fuelV575Protein"
        class="fuel-v575-field"
        type="number"
        inputmode="numeric"
        placeholder="e.g. 140"
      >

      <button
        id="fuelV575Save"
        class="fuel-v575-save"
        type="button"
      >
        Save coach target
      </button>

      <button
        id="fuelV575Auto"
        class="fuel-v575-auto"
        type="button"
      >
        Use Mana calculation
      </button>

      <button
        id="fuelV575Cancel"
        class="fuel-v575-cancel"
        type="button"
      >
        Cancel
      </button>

    </div>
  `;

  document.body.appendChild(modal);
}

function fuelEnsureCoachOverrideCard() {
  const profileCard =
    document.getElementById(
      "fuelV574ProfileCard"
    );

  if (!profileCard) return;

  let card =
    document.getElementById(
      "fuelV575CoachCard"
    );

  if (!card) {
    card = document.createElement("div");

    card.id =
      "fuelV575CoachCard";

    card.className =
      "fuel-v575-card";

    profileCard.insertAdjacentElement(
      "afterend",
      card
    );
  }

  const override =
    fuelLoadCoachOverride();

  const autoTargets =
    fuelLoadTargetsV574();

  const currentTargets =
    fuelLoadTargets();

  if (override) {
    card.innerHTML = `
      <button
        id="fuelV575Open"
        class="fuel-v575-btn"
        type="button"
      >
        Edit coach override
      </button>

      <div class="fuel-v575-summary">
        <span class="fuel-v575-badge">
          COACH TARGET ACTIVE
        </span>
        <br>
        ${currentTargets.calories.toLocaleString()} cal
        • ${currentTargets.protein}g protein
        <br>
        Mana calculation:
        ${autoTargets.calories.toLocaleString()} cal
        • ${autoTargets.protein}g protein
      </div>
    `;
  } else {
    card.innerHTML = `
      <button
        id="fuelV575Open"
        class="fuel-v575-btn"
        type="button"
      >
        Coach override
      </button>

      <div class="fuel-v575-summary">
        Using Mana's personalised calculation:
        ${autoTargets.calories.toLocaleString()} cal
        • ${autoTargets.protein}g protein
      </div>
    `;
  }
}

function fuelOpenCoachOverrideModal() {
  fuelCreateCoachOverrideModal();

  const targets =
    fuelLoadTargets();

  document.getElementById(
    "fuelV575Calories"
  ).value =
    targets.calories || "";

  document.getElementById(
    "fuelV575Protein"
  ).value =
    targets.protein || "";

  document
    .getElementById(
      "fuelV575CoachModal"
    )
    .classList.add("open");
}

document.addEventListener(
  "click",
  event => {

    if (
      event.target.closest(
        "#fuelV575Open"
      )
    ) {
      fuelOpenCoachOverrideModal();
      return;
    }

    if (
      event.target.id ===
      "fuelV575Cancel"
    ) {
      document
        .getElementById(
          "fuelV575CoachModal"
        )
        ?.classList.remove("open");

      return;
    }

    if (
      event.target.id ===
      "fuelV575Save"
    ) {
      const calories =
        Number(
          document.getElementById(
            "fuelV575Calories"
          ).value
        );

      const protein =
        Number(
          document.getElementById(
            "fuelV575Protein"
          ).value
        );

      if (
        calories <= 0 ||
        protein <= 0
      ) {
        alert(
          "Please enter valid calorie and protein targets."
        );

        return;
      }

      fuelSaveCoachOverride({
        calories,
        protein
      });

      document
        .getElementById(
          "fuelV575CoachModal"
        )
        .classList.remove("open");

      fuelRenderTargets();
      fuelEnsureProfileCard();
      fuelEnsureCoachOverrideCard();

      return;
    }

    if (
      event.target.id ===
      "fuelV575Auto"
    ) {
      fuelClearCoachOverride();

      document
        .getElementById(
          "fuelV575CoachModal"
        )
        .classList.remove("open");

      fuelRenderTargets();
      fuelEnsureProfileCard();
      fuelEnsureCoachOverrideCard();
    }
  }
);

const fuelRenderV574 = fuelRender;

fuelRender = function() {
  fuelRenderV574();
  fuelEnsureCoachOverrideCard();
};

fuelCreateCoachOverrideModal();
fuelEnsureCoachOverrideCard();
fuelRenderTargets();
   /* =========================================
   FUEL v5.7.6 — SMART MEAL PRESETS
   ========================================= */

const FUEL_MEAL_PRESETS = {
  Breakfast: [
    {
      food: "Oats, Greek yoghurt & banana",
      calories: 520,
      protein: 28
    },
    {
      food: "Eggs, toast & fruit",
      calories: 460,
      protein: 30
    },
    {
      food: "Protein smoothie",
      calories: 430,
      protein: 35
    }
  ],

  Lunch: [
    {
      food: "Chicken, rice & vegetables",
      calories: 620,
      protein: 45
    },
    {
      food: "Beef mince, rice & vegetables",
      calories: 680,
      protein: 42
    },
    {
      food: "Chicken salad wrap",
      calories: 510,
      protein: 38
    }
  ],

  Dinner: [
    {
      food: "Chicken, sweet potato & vegetables",
      calories: 650,
      protein: 48
    },
    {
      food: "Lean beef, potato & greens",
      calories: 700,
      protein: 45
    },
    {
      food: "Salmon, rice & vegetables",
      calories: 720,
      protein: 42
    }
  ],

  Snacks: [
    {
      food: "Greek yoghurt & fruit",
      calories: 220,
      protein: 18
    },
    {
      food: "Protein shake & banana",
      calories: 280,
      protein: 28
    },
    {
      food: "Tuna on toast",
      calories: 320,
      protein: 30
    }
  ]
};

function fuelPresetEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function fuelEnsurePresetStyles() {
  if (
    document.getElementById(
      "fuel-v576-preset-style"
    )
  ) return;

  const style =
    document.createElement("style");

  style.id =
    "fuel-v576-preset-style";

  style.textContent = `
    .fuel-v576-presets{
      margin:12px 0 18px;
      display:grid;
      gap:10px;
    }

    .fuel-v576-preset{
      width:100%;
      box-sizing:border-box;
      text-align:left;
      background:#0d0d0d;
      border:1px solid #303030;
      border-radius:16px;
      padding:14px 15px;
      color:#fff;
      cursor:pointer;
    }

    .fuel-v576-preset-name{
      font-size:15px;
      font-weight:700;
      line-height:1.35;
    }

    .fuel-v576-preset-macros{
      margin-top:5px;
      color:#a9a9a9;
      font-size:13px;
    }

    .fuel-v576-preset:hover,
    .fuel-v576-preset:active{
      border-color:#6d5c21;
      background:#15130b;
    }

    .fuel-v576-label{
      margin-top:12px;
      color:#f5d86e;
      font-size:12px;
      font-weight:800;
      letter-spacing:.08em;
      text-transform:uppercase;
    }
  `;

  document.head.appendChild(style);
}

function fuelRenderPresets() {
  fuelEnsurePresetStyles();

  const panel =
    document.getElementById(
      "fuelV57Dashboard"
    );

  if (!panel) return;

  const mealRows =
    panel.querySelectorAll(
      ".fuel-v57-meal"
    );

  mealRows.forEach(row => {
    const nameEl =
      row.querySelector(
        ".fuel-v57-meal-name"
      );

    if (!nameEl) return;

    const mealName =
      nameEl.textContent.trim();

    const presets =
      FUEL_MEAL_PRESETS[mealName];

    if (!presets) return;

    const existing =
      row.parentElement.querySelector(
        `[data-fuel-preset-group="${mealName}"]`
      );

    if (existing) return;

    const wrap =
      document.createElement("div");

    wrap.className =
      "fuel-v576-presets";

    wrap.setAttribute(
      "data-fuel-preset-group",
      mealName
    );

    wrap.innerHTML = `
      <div class="fuel-v576-label">
        Quick choices
      </div>

      ${presets.map((item, index) => `
        <button
          type="button"
          class="fuel-v576-preset"
          data-meal="${fuelPresetEscape(mealName)}"
          data-index="${index}"
        >
          <div class="fuel-v576-preset-name">
            ${fuelPresetEscape(item.food)}
          </div>

          <div class="fuel-v576-preset-macros">
            ${item.calories} cal
            • ${item.protein}g protein
          </div>
        </button>
      `).join("")}
    `;

    row.insertAdjacentElement(
      "afterend",
      wrap
    );
  });
}

document.addEventListener(
  "click",
  event => {
    const btn =
      event.target.closest(
        ".fuel-v576-preset"
      );

    if (!btn) return;

    const meal =
      btn.dataset.meal;

    const index =
      Number(btn.dataset.index);

    const preset =
      FUEL_MEAL_PRESETS[meal]?.[index];

    if (!preset) return;

    const data =
      fuelLoad();

    if (!data.meals[meal]) {
      data.meals[meal] = [];
    }

    data.meals[meal].push({
      food: preset.food,
      calories: preset.calories,
      protein: preset.protein
    });

    fuelSave(data);

    fuelRender();
    fuelRenderItems();
    fuelRenderTargets();
    fuelRenderPresets();
  }
);

const fuelRenderV575 = fuelRender;

fuelRender = function() {
  fuelRenderV575();
  fuelRenderPresets();
};

fuelRenderPresets();
})();
