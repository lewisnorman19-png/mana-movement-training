/* =========================================
   MANA MOVEMENT TRAINING v5.8
   Fuel nutrition targets
   ========================================= */

(() => {
  "use strict";

  const TARGET_KEY = "mana-fuel-v58-targets";
  const FUEL_STORE_KEY = "mana-fuel-v571";
  const STYLE_ID = "mana-v58-target-style";
  const PANEL_ID = "fuelV58Targets";
  const MODAL_ID = "fuelV58TargetsModal";

  const defaults = {
    calories: 2200,
    protein: 150,
    carbs: 220,
    fat: 70,
    water: 2500
  };

  function todayKey() {
    const d = new Date();
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0")
    ].join("-");
  }

  function safeJson(raw, fallback) {
    try { return JSON.parse(raw); } catch (_) { return fallback; }
  }

  function loadTargets() {
    const saved = safeJson(localStorage.getItem(TARGET_KEY) || "{}", {});
    return {
      calories: Math.max(0, Number(saved.calories) || defaults.calories),
      protein: Math.max(0, Number(saved.protein) || defaults.protein),
      carbs: Math.max(0, Number(saved.carbs) || defaults.carbs),
      fat: Math.max(0, Number(saved.fat) || defaults.fat),
      water: Math.max(0, Number(saved.water) || defaults.water)
    };
  }

  function saveTargets(targets) {
    localStorage.setItem(TARGET_KEY, JSON.stringify(targets));
  }

  function loadTodayFuel() {
    const all = safeJson(localStorage.getItem(FUEL_STORE_KEY) || "{}", {});
    return all[todayKey()] || {
      meals: { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] },
      water: 0
    };
  }

  function totals() {
    const data = loadTodayFuel();
    const result = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      water: Number(data.water) || 0
    };

    Object.values(data.meals || {}).forEach(items => {
      (items || []).forEach(item => {
        result.calories += Number(item.calories) || 0;
        result.protein += Number(item.protein) || 0;
        result.carbs += Number(item.carbs) || 0;
        result.fat += Number(item.fat) || 0;
      });
    });

    return result;
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      #${PANEL_ID}{
        margin:16px 0;
        background:#101010;
        border:1px solid #2b2b2b;
        border-radius:22px;
        padding:18px;
      }

      .fuel-v58-head{
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:12px;
        margin-bottom:14px;
      }

      .fuel-v58-head h3{
        margin:0;
        font-size:22px;
      }

      .fuel-v58-edit{
        border:1px solid #5d5124;
        background:#15130b;
        color:#f5d86e;
        border-radius:999px;
        padding:10px 14px;
        font-weight:800;
        font-size:14px;
      }

      .fuel-v58-grid{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:10px;
      }

      .fuel-v58-card{
        background:#0b0b0b;
        border:1px solid #292929;
        border-radius:16px;
        padding:14px;
      }

      .fuel-v58-label{
        color:#aaa;
        font-size:12px;
        margin-bottom:6px;
      }

      .fuel-v58-value{
        font-size:20px;
        font-weight:800;
        color:#f5d86e;
      }

      .fuel-v58-track{
        height:7px;
        background:#262626;
        border-radius:999px;
        overflow:hidden;
        margin-top:9px;
      }

      .fuel-v58-track span{
        display:block;
        height:100%;
        background:#f5d86e;
        width:0%;
      }

      #${MODAL_ID}{
        position:fixed;
        inset:0;
        z-index:100000;
        background:rgba(0,0,0,.80);
        display:none;
        align-items:flex-end;
      }

      #${MODAL_ID}.open{
        display:flex;
      }

      .fuel-v58-sheet{
        width:100%;
        max-height:92dvh;
        overflow:auto;
        background:#111;
        border:1px solid #333;
        border-radius:28px 28px 0 0;
        padding:24px 22px calc(28px + env(safe-area-inset-bottom));
      }

      .fuel-v58-sheet h2{
        margin:0 0 18px;
        font-size:28px;
      }

      .fuel-v58-field label{
        display:block;
        margin-bottom:4px;
        color:#bbb;
        font-size:13px;
      }

      .fuel-v58-field input{
        width:100%;
        box-sizing:border-box;
        margin:0 0 12px;
        padding:15px;
        border-radius:15px;
        border:1px solid #393939;
        background:#090909;
        color:#fff;
        font-size:17px;
      }

      .fuel-v58-save{
        width:100%;
        margin-top:6px;
        padding:17px;
        border:0;
        border-radius:18px;
        background:#f5d86e;
        color:#111;
        font-weight:800;
        font-size:18px;
      }

      .fuel-v58-cancel{
        width:100%;
        margin-top:8px;
        padding:14px;
        border:0;
        background:transparent;
        color:#aaa;
        font-size:16px;
      }
    `;

    document.head.appendChild(style);
  }

  function pct(value, target) {
    if (!target) return 0;
    return Math.max(0, Math.min(100, (value / target) * 100));
  }

  function card(key, label, unit) {
    return `
      <div class="fuel-v58-card" data-target-card="${key}">
        <div class="fuel-v58-label">${label}</div>
        <div class="fuel-v58-value" data-target-value="${key}">0 / 0${unit}</div>
        <div class="fuel-v58-track">
          <span data-target-bar="${key}"></span>
        </div>
      </div>
    `;
  }

  function buildPanel() {
    const fuelView = document.getElementById("clientFuelView");

    if (!fuelView || document.getElementById(PANEL_ID)) return;

    const panel = document.createElement("div");
    panel.id = PANEL_ID;

    panel.innerHTML = `
      <div class="fuel-v58-head">
        <h3>Daily targets</h3>
        <button type="button" class="fuel-v58-edit" id="fuelV58EditTargets">
          Set targets
        </button>
      </div>

      <div class="fuel-v58-grid">
        ${card("calories", "Calories", "")}
        ${card("protein", "Protein", "g")}
        ${card("carbs", "Carbs", "g")}
        ${card("fat", "Fat", "g")}
        ${card("water", "Water", "ml")}
      </div>
    `;

    const dashboard = document.getElementById("fuelV57Dashboard");

    if (dashboard) {
      dashboard.after(panel);
    } else {
      fuelView.prepend(panel);
    }

    document
      .getElementById("fuelV58EditTargets")
      ?.addEventListener("click", openModal);

    render();
  }

  function ensureModal() {
    if (document.getElementById(MODAL_ID)) return;

    const modal = document.createElement("div");
    modal.id = MODAL_ID;

    modal.innerHTML = `
      <div class="fuel-v58-sheet">
        <h2>Set daily targets</h2>

        <div class="fuel-v58-field">
          <label>Calories</label>
          <input id="fuelV58Calories" type="number" inputmode="numeric" min="0">
        </div>

        <div class="fuel-v58-field">
          <label>Protein (g)</label>
          <input id="fuelV58Protein" type="number" inputmode="numeric" min="0">
        </div>

        <div class="fuel-v58-field">
          <label>Carbs (g)</label>
          <input id="fuelV58Carbs" type="number" inputmode="numeric" min="0">
        </div>

        <div class="fuel-v58-field">
          <label>Fat (g)</label>
          <input id="fuelV58Fat" type="number" inputmode="numeric" min="0">
        </div>

        <div class="fuel-v58-field">
          <label>Water (ml)</label>
          <input id="fuelV58Water" type="number" inputmode="numeric" min="0" step="50">
        </div>

        <button type="button" class="fuel-v58-save" id="fuelV58SaveTargets">
          Save targets
        </button>

        <button type="button" class="fuel-v58-cancel" id="fuelV58CancelTargets">
          Cancel
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    document
      .getElementById("fuelV58SaveTargets")
      ?.addEventListener("click", () => {

        const next = {
          calories: Math.max(
            0,
            Number(document.getElementById("fuelV58Calories")?.value) || 0
          ),
          protein: Math.max(
            0,
            Number(document.getElementById("fuelV58Protein")?.value) || 0
          ),
          carbs: Math.max(
            0,
            Number(document.getElementById("fuelV58Carbs")?.value) || 0
          ),
          fat: Math.max(
            0,
            Number(document.getElementById("fuelV58Fat")?.value) || 0
          ),
          water: Math.max(
            0,
            Number(document.getElementById("fuelV58Water")?.value) || 0
          )
        };

        saveTargets(next);
        modal.classList.remove("open");
        render();
      });

    document
      .getElementById("fuelV58CancelTargets")
      ?.addEventListener("click", () => {
        modal.classList.remove("open");
      });

    modal.addEventListener("click", event => {
      if (event.target === modal) {
        modal.classList.remove("open");
      }
    });
  }

  function openModal() {
    ensureModal();

    const t = loadTargets();

    document.getElementById("fuelV58Calories").value = t.calories;
    document.getElementById("fuelV58Protein").value = t.protein;
    document.getElementById("fuelV58Carbs").value = t.carbs;
    document.getElementById("fuelV58Fat").value = t.fat;
    document.getElementById("fuelV58Water").value = t.water;

    document.getElementById(MODAL_ID).classList.add("open");
  }

  function render() {
    const panel = document.getElementById(PANEL_ID);

    if (!panel) return;

    const t = loadTargets();
    const x = totals();

    const units = {
      calories: "",
      protein: "g",
      carbs: "g",
      fat: "g",
      water: "ml"
    };

    ["calories", "protein", "carbs", "fat", "water"].forEach(key => {
      const value = panel.querySelector(`[data-target-value="${key}"]`);
      const bar = panel.querySelector(`[data-target-bar="${key}"]`);

      if (value) {
        value.textContent =
          `${Math.round(x[key])} / ${Math.round(t[key])}${units[key]}`;
      }

      if (bar) {
        bar.style.width = `${pct(x[key], t[key])}%`;
      }
    });

    const oldDashboard = document.getElementById("fuelV57Dashboard");

    if (oldDashboard) {
      const values = oldDashboard.querySelectorAll(".fuel-v57-value");
      const subs = oldDashboard.querySelectorAll(".fuel-v57-sub");

      if (values[0]) {
        values[0].textContent = Math.round(x.calories);
      }

      if (values[1]) {
        values[1].textContent = `${Math.round(x.protein)}g`;
      }

      if (subs[0]) {
        subs[0].textContent =
          `of ${Math.round(t.calories)} daily target`;
      }

      if (subs[1]) {
        subs[1].textContent =
          `of ${Math.round(t.protein)}g daily target`;
      }
    }
  }

  function init() {
    injectStyles();
    buildPanel();
    ensureModal();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  new MutationObserver(() => {
    buildPanel();
    render();
  }).observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  window.addEventListener("storage", render);

  setInterval(render, 1200);
})();
