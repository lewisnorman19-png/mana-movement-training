
/* ================================================
   MANA MOVEMENT TRAINING
   PREMIUM REFINEMENT
   BUILD 103030

   HOME
   - Fine gold borders
   - Larger program headings
   - Selected program tick

   MEMBERSHIP
   - Fine gold borders
   - Keep text colours

   STRENGTH
   - Fine gold workout borders
   - Preserve exercise illustrations

   FUEL
   - Clearer target labels and values
   - Green calorie and protein progress
   - Water displayed in litres
   - Water buttons remain in millilitres

   PROGRESS
   - Add linked daily water metric
   - Rename REST to RECOVERY
   - Green progress bars
   - Gold outlines

   PRESERVE
   - All existing Overview layouts
   - Desktop Strength fix
   - Bottom tab layout
   - Existing icons
   - Coach Hub
   - Logging and navigation
   ================================================ */

(() => {
  "use strict";

  const BUILD = "103030";
  const STYLE_ID = "mana-premium-103030";

  if (window.MANA_PREMIUM_BUILD === BUILD) return;

  const CSS = `

    :root {
      --mp-gold: rgba(212,175,55,.64);
      --mp-green: #45c783;
      --mp-white: #f5f5f5;
    }

    /* =========================================
       HOME PROGRAM CARDS
       ========================================= */

    #manaV80Home .mana-v8013-program,
    #manaV80Home [data-program] {
      border-color: var(--mp-gold) !important;
      border-width: 1px !important;
    }

    /* Retain original coloured text */

    #manaV80Home .mana-v8013-program h2 {
      font-size: clamp(23px, 5vw, 30px) !important;
      line-height: 1.14 !important;
      letter-spacing: -.025em;
    }

    #manaV80Home .mana-v8013-program-label {
      font-size: 12px !important;
      line-height: 1.35 !important;
    }

    /* Selected-program tick */

    #manaV80Home [data-program] {
      position: relative;
    }

    #manaV80Home [data-program].current::after {
      content: "✓";
      position: absolute;
      top: 11px;
      right: 12px;
      z-index: 8;
      display: grid;
      place-items: center;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      border: 1px solid var(--mp-gold);
      background: #173d28;
      color: #fff;
      font-size: 16px;
      font-weight: 900;
      pointer-events: none;
    }

    /* Remove old coloured selection glows */

    #manaV80Home [data-program].current {
      border: 1px solid var(--mp-gold) !important;
      box-shadow:
        0 0 0 1px rgba(212,175,55,.08),
        0 10px 25px rgba(0,0,0,.2) !important;
    }

    /* =========================================
       SELECT YOUR PLAN
       ========================================= */

    #manaV98Membership .mana-v981-plan,
    #manaV98Membership .mana-v981-button {
      border-color: var(--mp-gold) !important;
      border-width: 1px !important;
    }

    #manaV98Membership .mana-v981-plan {
      box-shadow: none !important;
    }

    /* No plan text colour overrides */

    /* =========================================
       STRENGTH WORKOUT CARDS
       ========================================= */

    #manaV83Content .mana-v85-day,
    #manaV83Content .mana-v85-exercise,
    #manaV83Content .mana-v980-day,
    #manaV83Content .mana-v980-exercise,
    #manaV83Content .mana-v980-workout,
    #manaV83Content .mana-v980-exercises,
    #manaV64Exercises .mana-v64-card,
    #manaV64Exercises .mana-v970-action,
    #manaV64Exercises .mana-v970-disclosure {
      border-color: var(--mp-gold) !important;
      border-width: 1px !important;
    }

    /* Existing exercise illustrations stay visible */

    #manaV83Content .mana-v85-exercise img,
    #manaV83Content .mana-v980-exercise img,
    #manaV64Exercises .mana-v64-card img {
      object-fit: contain;
      max-width: 100%;
    }

    /* =========================================
       FUEL TARGET READABILITY
       ========================================= */

    #manaV1015Fuel .m1022-target,
    #manaV980SharedFuel .m1022-target,
    .m1022-target {
      border: 1px solid var(--mp-gold) !important;
      min-width: 0;
    }

    .m1022-target-label {
      font-size: 11px !important;
      letter-spacing: .055em !important;
      color: #d8d8d8 !important;
    }

    .m1022-target-value {
      font-size: clamp(17px, 4.5vw, 23px) !important;
      font-weight: 900 !important;
      line-height: 1.25 !important;
      white-space: normal !important;
      overflow-wrap: normal;
      font-variant-numeric: tabular-nums;
    }

    .m1022-target-value span {
      font-size: 12px !important;
      color: #a9a9a9 !important;
      font-weight: 700 !important;
    }

    .m1022-target-top {
      align-items: center;
    }

    /* GREEN CALORIE / PROTEIN BARS */

    .m1022-target.calories .m1022-bar span,
    .m1022-target.protein .m1022-bar span {
      background: linear-gradient(
        90deg,
        #278b57,
        #45c783
      ) !important;
    }

    /* Keep mL logging controls intact */

    .m1022-control-row button {
      border-color: var(--mp-gold) !important;
    }

    /* =========================================
       PROGRESS BORDER CONSISTENCY
       ========================================= */

    #manaV83Content .mana-v993-periods,
    #manaV83Content .mana-v993-period,
    #manaV83Content .mana-v993-metric,
    #manaV83Content .mana-v993-detail-btn,
    #manaV83Content .mana-v993-panel,
    #manaV83Content .mana-v993-summary,
    #manaV83Content .mana-v993-row,
    #manaV83Content .mana-v981-periods,
    #manaV83Content .mana-v981-overall,
    #manaV83Content .mana-v981-card,
    #manaV83Content .mana-v939-card {
      border-color: var(--mp-gold) !important;
      border-width: 1px !important;
    }

    /* GREEN PROGRESS BAR FILLS */

    #manaV83Content .mana-v993-fill,
    #manaV83Content .mana-v981-bar span,
    #manaV83Content .mana-v939-fill,
    #manaV83Content .mana-v939-mood-bar span {
      background: linear-gradient(
        90deg,
        #278b57,
        #45c783
      ) !important;
    }

    /* Linked water metric */

    .mp-water-metric {
      border: 1px solid var(--mp-gold);
      border-radius: 15px;
      background: #0b0b0b;
      padding: 12px;
      min-width: 0;
      color: #f5f5f5;
      text-align: center;
    }

    .mp-water-label {
      color: #b6b6b6;
      font-size: 11px;
      font-weight: 850;
      letter-spacing: .07em;
      text-transform: uppercase;
    }

    .mp-water-value {
      display: block;
      margin: 7px 0 4px;
      font-size: 22px;
      line-height: 1.2;
      font-weight: 900;
      color: #f3d875;
      font-variant-numeric: tabular-nums;
    }

    .mp-water-detail {
      color: #999;
      font-size: 11px;
    }

    .mp-water-track {
      height: 6px;
      margin-top: 12px;
      background: #292929;
      overflow: hidden;
      border-radius: 20px;
    }

    .mp-water-fill {
      height: 100%;
      width: 0;
      background: linear-gradient(
        90deg,
        #278b57,
        #45c783
      );
      border-radius: inherit;
    }

    /* =========================================
       RECOVERY LABEL
       ========================================= */

    .mp-recovery-heading {
      color: inherit;
    }

    /* =========================================
       KEEP BOTTOM NAV UNCHANGED
       ========================================= */

    /* No bottom navigation selectors here. */

    /* =========================================
       PHONE READABILITY
       ========================================= */

    @media (max-width: 600px) {

      .m1022-target {
        padding: 11px !important;
      }

      .m1022-target-label {
        font-size: 10px !important;
      }

      .m1022-target-value {
        font-size: 18px !important;
      }

      .m1022-target-value span {
        font-size: 11px !important;
      }

      .mp-water-value {
        font-size: 20px;
      }
    }
  `;

  /* ==========================================
     INSTALL CSS ONCE
     ========================================== */

  function installStyles() {
    let style = document.getElementById(STYLE_ID);

    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = CSS;
      document.head.appendChild(style);
    }
  }

  /* ==========================================
     FORMAT WATER AS LITRES
     DISPLAY ONLY

     Stored data remains in millilitres.
     ========================================== */

  function litres(ml) {
    return (Math.max(0, Number(ml) || 0) / 1000)
      .toFixed(2)
      .replace(/0+$/, "")
      .replace(/\.$/, "");
  }

  function updateFuelWater() {
    document.querySelectorAll(
      ".m1022-target.water .m1022-target-value"
    ).forEach(node => {
      const text = node.textContent || "";

      const match = text.match(
        /([\d,.]+)\s*ml\s*\/\s*([\d,.]+)\s*ml/i
      );

      if (!match) return;

      const current =
        Number(match[1].replace(/,/g, ""));

      const target =
        Number(match[2].replace(/,/g, ""));

      if (!Number.isFinite(current) ||
          !Number.isFinite(target)) return;

      /* Replace only the displayed value.
         Buttons continue adding 250/500 mL. */

      node.textContent = "";

      const main = document.createTextNode(
        litres(current) + " L "
      );

      const remaining = document.createElement("span");

      remaining.textContent =
        "/ " + litres(target) + " L";

      node.append(main, remaining);
    });
  }

  /* ==========================================
     READ TODAY'S FUEL WATER

     Uses the existing Mana storage keys.
     ========================================== */

  function readWater() {
    try {
      const store = JSON.parse(
        localStorage.getItem("mana-fuel-v571") || "{}"
      );

      const targetData = JSON.parse(
        localStorage.getItem(
          "mana-fuel-v58-targets"
        ) || "{}"
      );

      const now = new Date();

      const key =
        now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(now.getDate()).padStart(2, "0");

      return {
        current: Math.max(
          0, Number(store[key]?.water) || 0
        ),
        target: Math.max(
          1, Number(targetData.water) || 2300
        )
      };
    } catch (_) {
      return {
        current: 0,
        target: 2300
      };
    }
  }

  /* ==========================================
     ADD WATER TO PROGRESS

     Does not modify saved progress data.
     ========================================== */

  function updateProgressWater() {
    const root = document.getElementById(
      "manaV993StrengthProgress"
    );

    if (!root || !root.isConnected) return;

    const { current, target } = readWater();

    let tile = root.querySelector(
      "#mana103030Water"
    );

    if (!tile) {
      tile = document.createElement("div");

      tile.id = "mana103030Water";
      tile.className = "mp-water-metric";

      tile.innerHTML = `
        <div class="mp-water-label">WATER</div>
        <strong class="mp-water-value"></strong>
        <div class="mp-water-detail"></div>
        <div class="mp-water-track">
          <div class="mp-water-fill"></div>
        </div>
      `;

      const grid = root.querySelector(
        ".mana-v993-metrics"
      ) || root.querySelector(
        ".mana-v993-summary"
      );

      if (grid) {
        grid.appendChild(tile);
      } else {
        return;
      }
    }

    tile.querySelector(
      ".mp-water-value"
    ).textContent =
      litres(current) + " L";

    tile.querySelector(
      ".mp-water-detail"
    ).textContent =
      "Target " + litres(target) + " L";

    tile.querySelector(
      ".mp-water-fill"
    ).style.width =
      Math.min(100, current / target * 100) + "%";
  }

  /* ==========================================
     REST -> RECOVERY
     PROGRESS SECTION ONLY
     ========================================== */

  function renameRest() {
    const root = document.getElementById(
      "manaV993StrengthProgress"
    );

    if (!root) return;

    root.querySelectorAll(
      ".mana-v993-metric"
    ).forEach(card => {
      const nodes = card.querySelectorAll(
        "span,small,strong,div"
      );

      nodes.forEach(node => {
        if (
          node.children.length === 0 &&
          node.textContent.trim().toUpperCase() === "REST"
        ) {
          node.textContent = "RECOVERY";
          node.classList.add("mp-recovery-heading");
        }
      });
    });
  }

  /* ==========================================
     COORDINATED REFRESH

     No stylesheet reinsertion.
     No continuous repaint timers.
     ========================================== */

  let scheduled = false;

  function refresh() {
    updateFuelWater();
    updateProgressWater();
    renameRest();
  }

  function scheduleRefresh() {
    if (scheduled) return;

    scheduled = true;

    requestAnimationFrame(() => {
      scheduled = false;
      refresh();
    });
  }

  /* ==========================================
     INITIALISE
     ========================================== */

  function init() {
    installStyles();
    refresh();

    [
      "mana:fuel-updated",
      "mana:program-tab-change",
      "mana:program-change",
      "mana:workout-progress-change"
    ].forEach(name => {
      document.addEventListener(
        name, scheduleRefresh
      );
      window.addEventListener(
        name, scheduleRefresh
      );
    });

    document.addEventListener("click", event => {
      if (!(event.target instanceof Element)) return;

      if (event.target.closest(
        [
          "[data-program]",
          "[data-v83-tab]",
          "[data-m1022-water]",
          "[data-v993-period]",
          "[data-v993-detail]"
        ].join(",")
      )) {
        scheduleRefresh();
      }
    });

    window.addEventListener(
      "pageshow", scheduleRefresh
    );

    /* Read newly rendered Fuel and Progress
       elements without watching style changes. */

    const content = document.getElementById(
      "manaV83Content"
    );

    if (content) {
      const observer = new MutationObserver(() => {
        scheduleRefresh();
      });

      observer.observe(content, {
        childList: true,
        subtree: true
      });
    }

    window.MANA_PREMIUM_BUILD = BUILD;

    console.log(
      "MANA PREMIUM REFINEMENT", BUILD
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }
})();
