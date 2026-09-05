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
})();
