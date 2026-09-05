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

})();
