
/* ==========================================
   MANA MOVEMENT TRAINING
   VISUAL + FUEL STABILITY
   VERSION 10.28.2
   BUILD 103100

   REPLACES:
   v10_28_final_colour_interaction_polish_102800.js

   PURPOSE:
   - Stop repeated stylesheet removal
   - Stop unnecessary Fuel value rewrites
   - Preserve water logging
   - Preserve recovery logging
   - Preserve Progress and Learning icons
   - Preserve green coaching actions
   - Let newer premium colour scripts
     control the finished visual design

   IMPORTANT:
   - No repeating timers
   - No MutationObserver
   - No page rebuild
   - No changes to stored data structure
   ========================================== */

(() => {
  "use strict";

  const BUILD = "103100";

  const STYLE_ID =
    "mana-v10281-final-polish";

  if (
    window.MANA_FINAL_POLISH_BUILD === BUILD
  ) return;

  const GREEN = "#55d98b";
  const GOLD = "#f3d875";

  const FUEL_KEY = "mana-fuel-v571";
  const TARGET_KEY = "mana-fuel-v58-targets";
  const DAILY_KEY = "mana-strength-v866-daily";

  /* ========================================
     ICONS
     ======================================== */

  const ICONS = {
    progress: `
      <svg viewBox="0 0 64 64"
           aria-hidden="true">
        <path d="M12 50 H52"
              fill="none"
              stroke="currentColor"
              stroke-width="4"
              stroke-linecap="round"/>
        <path d="M16 44 L27 33 L36 38 L50 19"
              fill="none"
              stroke="currentColor"
              stroke-width="5"
              stroke-linecap="round"
              stroke-linejoin="round"/>
        <path d="M41 19 H50 V28"
              fill="none"
              stroke="currentColor"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"/>
      </svg>
    `,
    learning: `
      <svg viewBox="0 0 64 64"
           aria-hidden="true">
        <path d="M32 15 C25 9 17 9 10 13
                 V47 C17 43 25 44 32 50"
              fill="none"
              stroke="currentColor"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"/>
        <path d="M32 15 C39 9 47 9 54 13
                 V47 C47 43 39 44 32 50"
              fill="none"
              stroke="currentColor"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"/>
        <path d="M32 15 V50"
              fill="none"
              stroke="currentColor"
              stroke-width="4"
              stroke-linecap="round"/>
      </svg>
    `
  };

  /* ========================================
     STYLES - INSTALL ONCE
     ======================================== */

  const CSS = `
    .m1028-section-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .m1028-section-icon {
      flex: 0 0 42px;
      width: 42px;
      height: 42px;
      display: grid;
      place-items: center;
      background: #090909;
      border: 1px solid
        rgba(230,189,72,.65);
      border-radius: 13px;
    }

    .m1028-section-icon svg {
      width: 27px;
      height: 27px;
    }

    .m1028-progress-icon {
      color: ${GOLD};
    }

    .m1028-learning-icon {
      color: ${GOLD};
    }

    /* COACH AND UPGRADE ACTIONS */

    #manaV1017ProgramBlock .m1017-request {
      border-color: rgba(85,217,139,.65);
      background: linear-gradient(
        145deg,#101713,#090909
      );
    }

    #manaV1017ProgramBlock .m1017-request-btn {
      border: 1px solid ${GREEN};
      background: #164b30;
      color: #fff;
    }

    #manaV1017ProgramBlock .m1017-request-btn:hover {
      background: #207046;
    }

    #manaV933Life .mana-v933-support {
      border-color: rgba(85,217,139,.65);
    }

    #manaV933Life .mana-v933-support
    .mana-v933-kicker {
      color: ${GREEN};
    }

    #manaV95ChatModal.mana-v935-life-mode
    .mana-v950-header {
      border-bottom-color:
        rgba(85,217,139,.3);
    }

    #manaV95ChatModal.mana-v935-life-mode
    .mana-v950-header-kicker {
      color: ${GREEN};
    }

    /* STABLE FUEL TARGET DISPLAY */

    #manaV1015Fuel .m1022-target,
    #manaV1015Fuel .m1022-target-value,
    #manaV1015Fuel .m1022-bar,
    #manaV1015Fuel .m1022-bar span {
      animation: none !important;
      transition: none !important;
    }

    /* Keep the established colours */

    #manaV1015Fuel
    .m1022-target.calories .m1022-bar span,
    #manaV1015Fuel
    .m1022-target.protein .m1022-bar span {
      background: linear-gradient(
        90deg,#278b57,#45c783
      ) !important;
    }

    #manaV1015Fuel
    .m1022-target.water .m1022-bar span {
      background: linear-gradient(
        90deg,#1677bb,#42b8ff
      ) !important;
    }

    #manaV1015Fuel
    .m1022-target.recovery .m1022-bar span {
      background: linear-gradient(
        90deg,#6f49bb,#a77bff
      ) !important;
    }
  `;

  function installStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  /* ========================================
     STORAGE HELPERS
     ======================================== */

  function readJSON(key) {
    try {
      return JSON.parse(
        localStorage.getItem(key) || "{}"
      ) || {};
    } catch (_) {
      return {};
    }
  }

  function todayKey() {
    const date = new Date();

    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2,"0"),
      String(date.getDate()).padStart(2,"0")
    ].join("-");
  }

  function clamp(number,min,max) {
    return Math.max(
      min,
      Math.min(max,Number(number) || 0)
    );
  }

  function formatLitres(ml) {
    return (Number(ml) / 1000)
      .toFixed(2)
      .replace(/0+$/,"")
      .replace(/\.$/,"");
  }

  /* ========================================
     UPDATE ONLY CHANGED TARGET VALUES
     ======================================== */

  function updateFuelTile(
    type,
    value,
    target
  ) {
    const tile = document.querySelector(
      `#manaV1015Fuel .m1022-target.${type}`
    );

    if (!tile) return;

    const valueEl = tile.querySelector(
      ".m1022-target-value"
    );

    let mainValue = String(value);
    let mainTarget = String(target);
    let suffix = "";

    if (type === "water") {
      mainValue = formatLitres(value);
      mainTarget = formatLitres(target);
      suffix = " L";
    }

    if (type === "protein") suffix = " g";

    const signature = [
      mainValue,mainTarget,suffix
    ].join("|");

    if (
      valueEl &&
      valueEl.dataset.manaStableValue !== signature
    ) {
      const targetSpan =
        document.createElement("span");

      targetSpan.textContent =
        "/ " + mainTarget + suffix;

      valueEl.replaceChildren(
        document.createTextNode(
          mainValue + suffix + " "
        ),
        targetSpan
      );

      valueEl.dataset.manaStableValue =
        signature;
    }

    const bar = tile.querySelector(
      ".m1022-bar span"
    );

    if (bar) {
      const percentage = target > 0
        ? clamp(value / target * 100,0,100)
        : 0;

      const width = percentage + "%";

      if (bar.style.width !== width) {
        bar.style.width = width;
      }
    }
  }

  /* ========================================
     WATER LOGGING
     ======================================== */

  function changeWater(delta) {
    const store = readJSON(FUEL_KEY);
    const key = todayKey();

    const day = (
      store[key] &&
      typeof store[key] === "object"
    ) ? store[key] : {
      meals:{},
      water:0
    };

    day.water = Math.max(
      0,
      (Number(day.water) || 0) +
      Number(delta || 0)
    );

    store[key] = day;

    localStorage.setItem(
      FUEL_KEY,JSON.stringify(store)
    );

    const targets = readJSON(TARGET_KEY);
    const waterTarget =
      Math.max(1,Number(targets.water) || 2300);

    updateFuelTile(
      "water",day.water,waterTarget
    );

    window.dispatchEvent(
      new CustomEvent("mana:fuel-updated")
    );
  }

  /* ========================================
     RECOVERY LOGGING
     ======================================== */

  function recoveryScore(day) {
    if (
      day.recoveryScore !== null &&
      day.recoveryScore !== undefined &&
      day.recoveryScore !== "" &&
      Number.isFinite(Number(day.recoveryScore))
    ) {
      return clamp(day.recoveryScore,0,10);
    }

    const level = String(
      day.recoveryLevel ||
      day.recovery ||
      ""
    ).toLowerCase();

    if (
      level === "good" ||
      level === "true"
    ) return 8;

    if (level === "moderate") return 5;

    if (
      level === "needs-attention" ||
      level === "low"
    ) return 3;

    return 0;
  }

  function changeRecovery(delta) {
    const store = readJSON(DAILY_KEY);
    const key = todayKey();

    const day = (
      store[key] &&
      typeof store[key] === "object"
    ) ? store[key] : {};

    const value = clamp(
      recoveryScore(day) + Number(delta || 0),
      0,10
    );

    day.recoveryScore = value;

    if (value >= 7) {
      day.recoveryLevel = "good";
      day.recovery = true;
    } else if (value >= 4) {
      day.recoveryLevel = "moderate";
      day.recovery = false;
    } else if (value > 0) {
      day.recoveryLevel = "needs-attention";
      day.recovery = false;
    } else {
      day.recoveryLevel = "";
      day.recovery = false;
    }

    store[key] = day;

    localStorage.setItem(
      DAILY_KEY,JSON.stringify(store)
    );

    updateFuelTile("recovery",value,10);

    window.dispatchEvent(
      new CustomEvent("mana:recovery-updated")
    );
  }

  /* ========================================
     FUEL CONTROL INTERCEPT

     Preserve existing button behaviour.
     Handle only one action per click.
     ======================================== */

  function interceptFuel(event) {
    if (!(event.target instanceof Element)) {
      return;
    }

    if (!event.target.closest(
      "#manaV1015Fuel"
    )) return;

    const water = event.target.closest(
      "[data-m1022-water]"
    );

    const recovery = event.target.closest(
      "[data-m1022-recovery]"
    );

    if (!water && !recovery) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    if (water) {
      changeWater(
        Number(water.dataset.m1022Water) || 0
      );
    } else {
      changeRecovery(
        Number(recovery.dataset.m1022Recovery) || 0
      );
    }
  }

  /* ========================================
     SECTION ICONS
     ======================================== */

  function addSectionIcon(parent,type) {
    if (!parent || !ICONS[type]) return;

    if (parent.querySelector(
      `.m1028-${type}-icon`
    )) return;

    const title = parent.querySelector("h2");

    if (!title) return;

    const row = document.createElement("div");
    row.className = "m1028-section-title";

    const icon = document.createElement("span");
    icon.className =
      `m1028-section-icon m1028-${type}-icon`;

    icon.innerHTML = ICONS[type];

    title.parentNode.insertBefore(
      row,title
    );

    row.append(icon,title);
  }

  function decorate() {
    addSectionIcon(
      document.querySelector(
        "#manaV993StrengthProgress .mana-v993-head"
      ),
      "progress"
    );

    addSectionIcon(
      document.querySelector(
        "#manaV83Content .mana-v981-root .mana-v981-head"
      ),
      "progress"
    );

    addSectionIcon(
      document.querySelector(
        "#manaV83Content .mana-v985-head"
      ),
      "learning"
    );
  }

  /* ========================================
     STABLE REFRESH

     No stylesheet reinstalls.
     No repeated delayed refresh sequence.
     ======================================== */

  let pending = false;

  function refresh() {
    if (pending) return;

    pending = true;

    requestAnimationFrame(() => {
      pending = false;
      decorate();
    });
  }

  /* ========================================
     INITIALISE
     ======================================== */

  function init() {
    installStyles();

    document.addEventListener(
      "click",interceptFuel,true
    );

    document.addEventListener(
      "click",event => {
        if (!(event.target instanceof Element)) {
          return;
        }

        if (event.target.closest(
          [
            "#manaV83Tabs .mana-v83-tab",
            "[data-v993-period]",
            "[data-v993-detail]",
            "[data-v981-period]",
            "[data-v985-learn]"
          ].join(",")
        )) {
          requestAnimationFrame(refresh);
        }
      }
    );

    [
      "mana:program-tab-change",
      "mana:program-change",
      "mana:workout-progress-change"
    ].forEach(name => {
      document.addEventListener(name,refresh);
      window.addEventListener(name,refresh);
    });

    window.addEventListener(
      "pageshow",refresh
    );

    refresh();

    window.refreshManaFinalPolish = refresh;
    window.MANA_FINAL_POLISH_BUILD = BUILD;

    console.log(
      "MANA FUEL STABILITY FIX",BUILD
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
