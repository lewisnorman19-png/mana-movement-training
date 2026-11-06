
/* =====================================================
   MANA MOVEMENT — STRENGTH PROGRESS 104380
   FULL STANDALONE JAVASCRIPT FILE

   REPLACES 104370.

   Retains the working:
   - Progress calculations
   - Water card
   - Body-weight graph
   - Exercise history
   - Personal Bests
   - Period and detail tab handlers

   Corrects:
   - Remaining yellow labels
   - Old chart legend text
   - Recovery values from Fuel
   - Legacy Water card visibility
   - Old yellow heading icon

   No writes to localStorage or training records.
   ===================================================== */
(() => {
  "use strict";

  if (window.MANA_PROGRESS_104380) return;
  window.MANA_PROGRESS_104380 = true;

  const SHELL = "manaV83ProgramShell";
  const CONTENT = "manaV83Content";
  const ROOT = "manaV993StrengthProgress";
  const HEADER = "manaProgressHeader104380";
  const BACK = "manaProgressBack104380";
  const WATER = "manaWaterPrimary104380";
  const STYLE = "manaProgressStyle104380";

  const FUEL_KEY = "mana-fuel-v571";
  const TARGET_KEY = "mana-fuel-v58-targets";
  const DAILY_KEY = "mana-strength-v866-daily";

  let queued = false;

  function active() {
    const shell = document.getElementById(SHELL);

    return Boolean(
      shell?.classList.contains("open") &&
      shell.querySelector(
        '#manaV83Tabs [data-v83-tab="progress"].active'
      ) &&
      shell.querySelector("#" + CONTENT + " #" + ROOT)
    );
  }

  function setImportant(el, property, value) {
    if (!el) return;

    if (
      el.style.getPropertyValue(property) !== value ||
      el.style.getPropertyPriority(property) !== "important"
    ) {
      el.style.setProperty(
        property,
        value,
        "important"
      );
    }
  }

  function installStyles() {
    if (document.getElementById(STYLE)) return;

    const el = document.createElement("style");
    el.id = STYLE;

    el.textContent = `
      html body #${SHELL}:has(#${ROOT}) .mana-v83-head {
        display:none!important;
      }

      html body #${SHELL}:has(#${ROOT}) .mana-v83-shell {
        width:min(960px,100%)!important;
        max-width:960px!important;
      }

      html body #${SHELL}:has(#${ROOT}) #${CONTENT} {
        display:flex!important;
        flex-direction:column!important;
        align-items:stretch!important;
      }

      html body #${SHELL}:has(#${ROOT}) #${CONTENT}>* {
        order:0;
        min-width:0;
      }

      html body #${SHELL}:has(#${ROOT})
        #${CONTENT}>#${HEADER} {
        order:-10!important;
      }

      /* HEADER */

      html body #${SHELL} #${HEADER} {
        margin:0 0 14px;
        width:100%;
      }

      html body #${SHELL} #${HEADER} .mp-brand {
        display:flex;
        align-items:center;
        gap:12px;
      }

      html body #${SHELL} #${HEADER} .mp-runner {
        width:76px;
        height:56px;
        flex:0 0 76px;
        background:url("ui/mana-runner-logo.png")
          center/contain no-repeat;
      }

      html body #${SHELL} #${HEADER} .mp-name {
        color:#FFFFFF!important;
        font:900 clamp(32px,5vw,53px)/1.05
          system-ui,sans-serif;
        white-space:nowrap;
      }

      html body #${SHELL} #${HEADER} .mp-name span {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      html body #${SHELL} #${HEADER} .mp-tag {
        margin-top:4px;
        color:#C1C6CE;
        font:750 10px system-ui,sans-serif;
        letter-spacing:.12em;
      }

      html body #${SHELL} #${HEADER} .mp-back-row {
        display:flex;
        justify-content:flex-end;
        margin:5px 0 10px;
      }

      html body #${SHELL} #${BACK} {
        min-height:34px;
        padding:7px 14px;
        border:1px solid #697686;
        border-radius:11px;
        background:#15171B;
        color:#FFFFFF;
        font-weight:850;
        cursor:pointer;
      }

      /* REMOVE OLD YELLOW PROGRESS ICON */

      html body #${SHELL} #${ROOT}
        .mana-v993-head img,
      html body #${SHELL} #${ROOT}
        .mana-v993-head svg,
      html body #${SHELL} #${ROOT}
        .mana-v993-head [class*="icon"],
      html body #${SHELL} #${ROOT}
        .mana-v993-head [class*="Icon"] {
        display:none!important;
        visibility:hidden!important;
      }

      /* GENERAL TYPOGRAPHY */

      html body #${SHELL} #${ROOT} {
        width:100%!important;
        max-width:100%!important;
        color:#FFFFFF!important;
      }

      html body #${SHELL} #${ROOT}
        .mana-v993-kicker,
      html body #${SHELL} #${ROOT}
        .mana-v993-panel-kicker {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      html body #${SHELL} #${ROOT}
        .mana-v993-head h2,
      html body #${SHELL} #${ROOT}
        .mana-v993-panel h3 {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }

      html body #${SHELL} #${ROOT}
        .mana-v993-head p,
      html body #${SHELL} #${ROOT}
        .mana-v993-metric-sub,
      html body #${SHELL} #${ROOT}
        .mana-v993-row-sub {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }

      html body #${SHELL} #${ROOT}
        .mana-v993-row-title {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        text-shadow:none!important;
      }

      html body #${SHELL} #${ROOT}
        .mana-v993-row-value {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      /* PERIOD SELECTION */

      html body #${SHELL} #${ROOT}
        .mana-v993-periods {
        padding:5px!important;
        background:#101216!important;
        border:1px solid #697686!important;
        border-radius:14px!important;
      }

      html body #${SHELL} #${ROOT}
        .mana-v993-period,
      html body #${SHELL} #${ROOT}
        .mana-v993-detail-btn {
        background:#15171B!important;
        border:1px solid #697686!important;
        border-radius:12px!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        box-shadow:none!important;
      }

      html body #${SHELL} #${ROOT}
        .mana-v993-period.active,
      html body #${SHELL} #${ROOT}
        .mana-v993-detail-btn.active {
        background:#20160F!important;
        border:1px solid #FF7927!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      /* ALL SEVEN METRIC CARDS */

      html body #${SHELL} #${ROOT}
        .mana-v993-metrics>.mana-v993-metric {
        background:#15171B!important;
        background-image:none!important;
        border:1px solid #A5ADB7!important;
        border-radius:16px!important;
        box-shadow:none!important;
      }

      html body #${SHELL} #${ROOT}
        .mana-v993-metrics .mana-v993-metric-label {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }

      html body #${SHELL} #${ROOT}
        .mana-v993-metrics .mana-v993-metric-value,
      html body #${SHELL} #${ROOT}
        .mana-v993-metrics .mana-v993-metric-value * {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        text-shadow:none!important;
      }

      html body #${SHELL} #${ROOT}
        .mana-v993-metrics .mana-v993-track {
        background:#252B31!important;
      }

      html body #${SHELL} #${ROOT}
        .mana-v993-metrics .mana-v993-fill,
      html body #${SHELL} #${ROOT}
        .mana-v993-metrics .mp-water-fill {
        background:#FF7927!important;
        background-image:none!important;
        box-shadow:none!important;
      }

      /* LEGACY WATER CARD GUARD */

      html body #${SHELL} #${ROOT}
        .mana-v993-metrics>
        .mp-water-metric:not(.mana-water-primary-104380),
      html body #${SHELL} #${ROOT}
        .mana-v993-metrics>
        [class*="water"]:not(.mana-water-primary-104380) {
        display:none!important;
        visibility:hidden!important;
      }

      html body #${SHELL} #${ROOT}
        .mana-v993-metrics>
        .mana-water-primary-104380 {
        display:block!important;
        visibility:visible!important;
        background:#15171B!important;
        border:1px solid #A5ADB7!important;
      }

      /* PROGRESS DETAIL PANELS */

      html body #${SHELL} #${ROOT}
        .mana-v993-panel {
        background:#15171B!important;
        border:1px solid #A5ADB7!important;
        border-radius:19px!important;
        box-shadow:none!important;
      }

      html body #${SHELL} #${ROOT}
        .mana-v993-summary {
        background:#0D0F13!important;
        border:1px solid #697686!important;
      }

      html body #${SHELL} #${ROOT}
        .mana-v993-summary span {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }

      html body #${SHELL} #${ROOT}
        .mana-v993-summary strong {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      html body #${SHELL} #${ROOT}
        .mana-v993-row,
      html body #${SHELL} #${ROOT}
        [class*="history-row"] {
        border-color:#697686!important;
      }

      html body #${SHELL} #${ROOT}
        .mana-v993-exercise-select {
        background:#0D0F13!important;
        border:1px solid #697686!important;
        color:#FFFFFF!important;
      }

      /* WEIGHT AND EXERCISE CHARTS */

      html body #${SHELL} #${ROOT}
        .mana-chart-shell-104380 {
        background:#101216!important;
        border:1px solid #A5ADB7!important;
        border-radius:16px!important;
        box-shadow:none!important;
      }

      html body #${SHELL} #${ROOT}
        .mana-chart-title-104380 {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }

      html body #${SHELL} #${ROOT}
        .mana-chart-shell-104380 svg polyline,
      html body #${SHELL} #${ROOT}
        .mana-chart-shell-104380 svg path.mana-trend-104380 {
        stroke:#FF7927!important;
      }

      html body #${SHELL} #${ROOT}
        .mana-chart-shell-104380 svg circle {
        fill:#FF7927!important;
        stroke:#FF7927!important;
      }

      /* BOTTOM NAVIGATION */

      html body #${SHELL}.open:has(#${ROOT})
        #manaV83Tabs {
        background:rgba(8,9,11,.97)!important;
        border-top:1px solid #464D55!important;
        box-shadow:none!important;
      }

      html body #${SHELL}.open:has(#${ROOT})
        #manaV83Tabs .mana-v83-tab {
        background:transparent!important;
        border:1px solid transparent!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        box-shadow:none!important;
        text-shadow:none!important;
      }

      html body #${SHELL}.open:has(#${ROOT})
        #manaV83Tabs .mana-v83-tab.active {
        background:#20160F!important;
        border:1px solid #FF7927!important;
        border-radius:12px!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      html body #${SHELL}.open:has(#${ROOT})
        #manaV83Tabs .mana-v83-tab::before {
        background:#A5ADB7!important;
        box-shadow:none!important;
      }

      html body #${SHELL}.open:has(#${ROOT})
        #manaV83Tabs .mana-v83-tab.active::before {
        background:#FF7927!important;
      }

      html body #${SHELL}.open:has(#${ROOT})
        #manaV83Tabs .mana-v83-tab img {
        filter:grayscale(1) brightness(1.7)!important;
        box-shadow:none!important;
      }

      html body #${SHELL}.open:has(#${ROOT})
        #manaV83Tabs
        [data-v83-tab="overview"]:not(.active),
      html body #${SHELL}.open:has(#${ROOT})
        #manaV83Tabs
        [data-v83-tab="overview"]:not(.active) svg,
      html body #${SHELL}.open:has(#${ROOT})
        #manaV83Tabs
        [data-v83-tab="overview"]:not(.active) svg * {
        color:#C1C6CE!important;
        stroke:#C1C6CE!important;
        filter:none!important;
      }

      @media(max-width:650px) {
        html body #${SHELL} #${HEADER} .mp-runner {
          width:48px;
          height:40px;
          flex-basis:48px;
        }

        html body #${SHELL} #${HEADER} .mp-name {
          font-size:clamp(23px,7vw,35px)!important;
        }

        html body #${SHELL} #${HEADER} .mp-brand {
          gap:7px;
        }
      }
    `;

    document.head.appendChild(el);
  }

  function ensureHeader() {
    const holder = document.getElementById(CONTENT);

    if (!holder || holder.querySelector("#" + HEADER)) {
      return;
    }

    const node = document.createElement("div");
    node.id = HEADER;

    node.innerHTML = `
      <div class="mp-brand">
        <div class="mp-runner" aria-hidden="true"></div>
        <div>
          <div class="mp-name">
            MANA <span>MOVEMENT</span>
          </div>
          <div class="mp-tag">
            TRAINING · MOVE WITH PURPOSE
          </div>
        </div>
      </div>

      <div class="mp-back-row">
        <button id="${BACK}" type="button">
          ⌂ Overview
        </button>
      </div>
    `;

    holder.prepend(node);
  }

  function dateKey(date) {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-");
  }

  function waterData() {
    const today = dateKey(new Date());

    let amount = 0;
    let target = 2300;

    try {
      const fuel = JSON.parse(
        localStorage.getItem(FUEL_KEY) || "{}"
      );

      amount = Math.max(
        0,
        Number(fuel?.[today]?.water) || 0
      );
    } catch (_) {}

    try {
      const saved = JSON.parse(
        localStorage.getItem(TARGET_KEY) || "{}"
      );

      target = Math.max(
        1,
        Number(saved?.water) || 2300
      );
    } catch (_) {}

    return {amount,target};
  }

  function waterCards(grid) {
    return [...grid.children].filter(card => {
      const label = card.querySelector(
        ".mana-v993-metric-label,[class*='label']"
      );

      const text = (
        label?.textContent || card.textContent || ""
      ).trim().toUpperCase();

      return text.startsWith("WATER");
    });
  }

  function ensureWater() {
    const grid = document.querySelector(
      "#" + ROOT + " .mana-v993-metrics"
    );

    if (!grid) return;

    const found = waterCards(grid);

    let card = found.find(el => el.id === WATER) ||
      found[0];

    if (!card) {
      card = document.createElement("div");
      card.id = WATER;
      card.className = "mana-v993-metric mp-water-metric";

      card.innerHTML = `
        <div class="mana-v993-metric-label">WATER</div>
        <div class="mana-v993-metric-value"></div>
        <div class="mana-v993-metric-sub"></div>
        <div class="mana-v993-track">
          <div class="mana-v993-fill mp-water-fill"></div>
        </div>
      `;

      grid.appendChild(card);
    }

    found.forEach(el => {
      if (el !== card) el.remove();
    });

    card.id = WATER;

    card.classList.add(
      "mana-v993-metric",
      "mp-water-metric",
      "mana-water-primary-104380"
    );

    let value = card.querySelector(
      ".mana-v993-metric-value"
    );

    let sub = card.querySelector(
      ".mana-v993-metric-sub"
    );

    let fill = card.querySelector(
      ".mana-v993-fill,.mp-water-fill"
    );

    if (!value) {
      value = document.createElement("div");
      value.className = "mana-v993-metric-value";
      card.appendChild(value);
    }

    if (!sub) {
      sub = document.createElement("div");
      sub.className = "mana-v993-metric-sub";
      card.appendChild(sub);
    }

    if (!fill) {
      let track = card.querySelector(
        ".mana-v993-track"
      );

      if (!track) {
        track = document.createElement("div");
        track.className = "mana-v993-track";
        card.appendChild(track);
      }

      fill = document.createElement("div");
      fill.className = "mana-v993-fill mp-water-fill";
      track.appendChild(fill);
    }

    const {amount,target} = waterData();

    const display = (amount/1000).toFixed(1) + " L";
    const goal = "Target " +
      (target/1000).toFixed(1) + " L";

    const width = Math.min(
      100,
      Math.round(amount/target*100)
    ) + "%";

    if (value.textContent !== display) {
      value.textContent = display;
    }

    if (sub.textContent !== goal) {
      sub.textContent = goal;
    }

    if (fill.style.width !== width) {
      fill.style.width = width;
    }

    setImportant(card,"background","#15171B");
    setImportant(card,"border","1px solid #A5ADB7");
    setImportant(value,"color","#FF7927");
    setImportant(fill,"background","#FF7927");
  }

  /* RECOVERY — READ EXACTLY THE SAME DAILY STORE AS FUEL */

  function recoveryScore(day) {
    if (!day || typeof day !== "object") return null;

    const raw = day.recoveryScore;

    if (
      raw !== null &&
      raw !== undefined &&
      raw !== "" &&
      Number.isFinite(Number(raw))
    ) {
      return Math.max(
        0,
        Math.min(10,Number(raw))
      );
    }

    const level = String(
      day.recoveryLevel || day.recovery || ""
    ).toLowerCase();

    if (level === "good" || level === "true") return 8;
    if (level === "moderate") return 5;

    if (
      level === "needs-attention" ||
      level === "low"
    ) {
      return 3;
    }

    return null;
  }

  function selectedPeriod(root) {
    return root.querySelector(
      ".mana-v993-period.active"
    )?.dataset.v993Period || "daily";
  }

  function recoveryDays(period) {
    const today = new Date();
    today.setHours(0,0,0,0);

    const start = new Date(today);

    if (period === "weekly") {
      start.setDate(
        today.getDate() - (today.getDay()+6)%7
      );
    }

    if (period === "monthly") {
      start.setDate(1);
    }

    const days = [];

    for (
      const d = new Date(start);
      d <= today;
      d.setDate(d.getDate()+1)
    ) {
      days.push(dateKey(d));
    }

    return days;
  }

  function recoveryData(period) {
    let daily = {};

    try {
      daily = JSON.parse(
        localStorage.getItem(DAILY_KEY) || "{}"
      );
    } catch (_) {}

    const scores = recoveryDays(period)
      .map(key => recoveryScore(daily?.[key]))
      .filter(score => score !== null);

    if (!scores.length) return null;

    const total = scores.reduce(
      (sum,score) => sum+score,0
    );

    return {
      score:total/scores.length,
      count:scores.length
    };
  }

  function updateRecovery() {
    const root = document.getElementById(ROOT);
    const grid = root?.querySelector(
      ".mana-v993-metrics"
    );

    if (!grid) return;

    const card = [...grid.children].find(node => {
      const label = node.querySelector(
        ".mana-v993-metric-label"
      );

      return /^(REST|RECOVERY)$/i.test(
        label?.textContent?.trim() || ""
      );
    });

    if (!card) return;

    card.classList.add("mp-recovery-card");

    const label = card.querySelector(
      ".mana-v993-metric-label"
    );

    const value = card.querySelector(
      ".mana-v993-metric-value"
    );

    const sub = card.querySelector(
      ".mana-v993-metric-sub"
    );

    const fill = card.querySelector(
      ".mana-v993-fill"
    );

    const period = selectedPeriod(root);
    const result = recoveryData(period);

    const percentage = result
      ? Math.round(result.score*10)
      : 0;

    const display = result
      ? percentage + "%"
      : "—";

    const description = result
      ? result.score.toFixed(1) +
        "/10 from Fuel" +
        (period === "daily"
          ? ""
          : " • " + result.count + " days")
      : "Log recovery in Fuel";

    if (label && label.textContent !== "RECOVERY") {
      label.textContent = "RECOVERY";
    }

    if (value && value.textContent !== display) {
      value.textContent = display;
    }

    if (sub && sub.textContent !== description) {
      sub.textContent = description;
    }

    if (fill) {
      const width = percentage + "%";

      if (fill.style.width !== width) {
        fill.style.width = width;
      }
    }

    setImportant(card,"border","1px solid #A5ADB7");
    setImportant(card,"background","#15171B");
    setImportant(value,"color","#FF7927");
    setImportant(fill,"background","#FF7927");
  }

  /* KEEP EXISTING GRAPH. CHANGE ONLY PRESENTATION. */

  function correctCharts() {
    const root = document.getElementById(ROOT);
    const detail = root?.querySelector(
      "#manaV993Detail"
    );

    if (!detail) return;

    detail.querySelectorAll("svg").forEach(svg => {
      const candidates = [
        ...detail.querySelectorAll(
          "h2,h3,h4,strong"
        )
      ];

      const heading = candidates.find(el =>
        /body weight trend|best load/i.test(
          el.textContent || ""
        )
      );

      if (!heading) return;

      const panel = svg.closest(
        ".mana-v993-panel"
      );

      if (!panel || !panel.contains(heading)) return;

      let container = heading.parentElement;

      while (
        container &&
        container !== panel &&
        !container.contains(svg)
      ) {
        container = container.parentElement;
      }

      if (
        container &&
        container !== panel
      ) {
        container.classList.add(
          "mana-chart-shell-104380"
        );
      }

      heading.classList.add(
        "mana-chart-title-104380"
      );

      setImportant(heading,"color","#FFFFFF");

      svg.querySelectorAll(
        "polyline,path[fill='none']"
      ).forEach(line => {
        setImportant(line,"stroke","#FF7927");
      });

      svg.querySelectorAll("circle").forEach(dot => {
        setImportant(dot,"fill","#FF7927");
        setImportant(dot,"stroke","#FF7927");
      });
    });
  }

  function correctDetailText() {
    const detail = document.querySelector(
      "#" + ROOT + " #manaV993Detail"
    );

    if (!detail) return;

    detail.querySelectorAll(
      ".mana-v993-row-title"
    ).forEach(el => {
      setImportant(el,"color","#FFFFFF");
      setImportant(
        el,"-webkit-text-fill-color","#FFFFFF"
      );
    });

    detail.querySelectorAll(
      ".mana-v993-row-value," +
      ".mana-v993-summary strong"
    ).forEach(el => {
      setImportant(el,"color","#FF7927");
      setImportant(
        el,"-webkit-text-fill-color","#FF7927"
      );
    });

    /* Update the old chart legend without changing graph data. */

    detail.querySelectorAll(
      "small,p,span,div"
    ).forEach(el => {
      if (el.children.length) return;

      const original = el.textContent || "";

      if (
        !/green trend line|gold data points/i.test(
          original
        )
      ) {
        return;
      }

      const updated = original
        .replace(
          /green trend line/gi,
          "orange trend line"
        )
        .replace(
          /gold data points/gi,
          "orange data points"
        );

      if (updated !== original) {
        el.textContent = updated;
      }
    });
  }

  function maintain() {
    if (!active()) return;

    ensureHeader();
    ensureWater();
    updateRecovery();
    correctCharts();
    correctDetailText();
  }

  function schedule() {
    if (queued) return;

    queued = true;

    requestAnimationFrame(() => {
      queued = false;
      maintain();
    });
  }

  function init() {
    installStyles();

    const content = document.getElementById(
      CONTENT
    );

    if (content) {
      new MutationObserver(schedule).observe(
        content,{
          childList:true,
          subtree:true
        }
      );
    }

    document.addEventListener("click", event => {
      if (!(event.target instanceof Element)) return;

      if (event.target.closest("#" + BACK)) {
        document.querySelector(
          '#manaV83Tabs [data-v83-tab="overview"]'
        )?.click();

        return;
      }

      if (
        event.target.closest(
          '#manaV83Tabs .mana-v83-tab,' +
          '[data-v993-period],' +
          '[data-v993-detail],' +
          '.mana-v993-period,' +
          '.mana-v993-detail-btn'
        )
      ) {
        requestAnimationFrame(schedule);
      }
    });

    [
      "mana:program-tab-change",
      "mana:fuel-updated",
      "mana:recovery-updated",
      "mana:body-weight-updated"
    ].forEach(name => {
      window.addEventListener(name,schedule);
    });

    window.addEventListener("storage", event => {
      if (
        [
          FUEL_KEY,
          TARGET_KEY,
          DAILY_KEY
        ].includes(event.key)
      ) {
        schedule();
      }
    });

    schedule();

    window.MANA_STRENGTH_PROGRESS_DESIGN_BUILD =
      "104380";
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
