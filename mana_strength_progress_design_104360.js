/* MANA MOVEMENT — PROGRESS STABILITY 104360
   Full replacement for 104350.
   Keeps Progress page locked to Mana orange / silver / white styling.
   Fixes:
   - Water card staying stable
   - Detail buttons staying styled
   - Weight graph staying styled
   - By Exercise / Personal Bests / other progress charts recolouring after redraw
   - Old yellow/gold/green chart colours being forced back to orange/silver
*/
(() => {
  "use strict";
  if (window.MANA_PROGRESS_104360) return;
  window.MANA_PROGRESS_104360 = true;

  const SHELL_ID = "manaV83ProgramShell";
  const CONTENT_ID = "manaV83Content";
  const ROOT_ID = "manaV993StrengthProgress";
  const HEADER_ID = "manaProgressHeader104360";
  const BACK_ID = "manaProgressBack104360";
  const WATER_ID = "manaProgressWater104360";
  const FALLBACK_GRAPH_ID = "manaProgressGraph104360";
  const CSS_ID = "manaProgressCSS104360";

  const FUEL_KEY = "mana-fuel-v571";
  const TARGET_KEY = "mana-fuel-v58-targets";
  const WEIGHT_KEY = "mana-strength-v947-body-weight";

  let rafQueued = false;

  function isProgressOpen() {
    const shell = document.getElementById(SHELL_ID);
    return !!(
      shell &&
      shell.classList.contains("open") &&
      shell.querySelector('#manaV83Tabs [data-v83-tab="progress"].active') &&
      shell.querySelector("#" + CONTENT_ID + " #" + ROOT_ID)
    );
  }

  function setImportant(el, prop, value) {
    if (!el) return;
    if (
      el.style.getPropertyValue(prop) !== value ||
      el.style.getPropertyPriority(prop) !== "important"
    ) {
      el.style.setProperty(prop, value, "important");
    }
  }

  function injectCSS() {
    if (document.getElementById(CSS_ID)) return;

    const style = document.createElement("style");
    style.id = CSS_ID;
    style.textContent = `
      html body #${SHELL_ID}:has(#${ROOT_ID}) .mana-v83-head{display:none!important}
      html body #${SHELL_ID}:has(#${ROOT_ID}) .mana-v83-shell{max-width:960px!important;width:min(960px,100%)!important}
      html body #${SHELL_ID}:has(#${ROOT_ID}) #${CONTENT_ID}{display:flex!important;flex-direction:column!important;align-items:stretch!important}
      html body #${SHELL_ID}:has(#${ROOT_ID}) #${CONTENT_ID}>*{min-width:0;order:0}
      html body #${SHELL_ID}:has(#${ROOT_ID}) #${CONTENT_ID}>#${HEADER_ID}{order:-10!important}

      html body #${SHELL_ID} #${HEADER_ID}{margin:0 0 14px;width:100%}
      html body #${SHELL_ID} #${HEADER_ID} .mp-brand{display:flex;align-items:center;gap:12px}
      html body #${SHELL_ID} #${HEADER_ID} .mp-runner{flex:0 0 76px;width:76px;height:56px;background:url("ui/mana-runner-logo.png") center/contain no-repeat}
      html body #${SHELL_ID} #${HEADER_ID} .mp-name{font:900 clamp(32px,5vw,53px)/1.05 system-ui,sans-serif;color:#fff!important;white-space:nowrap}
      html body #${SHELL_ID} #${HEADER_ID} .mp-name span{color:#FF7927!important;-webkit-text-fill-color:#FF7927!important}
      html body #${SHELL_ID} #${HEADER_ID} .mp-tag{margin-top:4px;color:#C1C6CE;font:750 10px system-ui,sans-serif;letter-spacing:.12em}
      html body #${SHELL_ID} #${HEADER_ID} .mp-back-row{display:flex;justify-content:flex-end;margin:5px 0 10px}
      html body #${SHELL_ID} #${BACK_ID}{padding:8px 14px;background:#15171B;border:1px solid #697686;border-radius:11px;color:#fff;font-weight:800;cursor:pointer}

      html body #${SHELL_ID} #${ROOT_ID}{width:100%!important;max-width:100%!important;color:#fff!important}

      html body #${SHELL_ID} #${ROOT_ID} .mana-v993-kicker,
      html body #${SHELL_ID} #${ROOT_ID} .mana-v993-panel-kicker{color:#FF7927!important;-webkit-text-fill-color:#FF7927!important}
      html body #${SHELL_ID} #${ROOT_ID} .mana-v993-head h2,
      html body #${SHELL_ID} #${ROOT_ID} .mana-v993-panel h3{color:#fff!important;-webkit-text-fill-color:#fff!important}

      html body #${SHELL_ID} #${ROOT_ID} .mana-v993-periods{background:#101216!important;border:1px solid #697686!important}
      html body #${SHELL_ID} #${ROOT_ID} .mana-v993-period,
      html body #${SHELL_ID} #${ROOT_ID} .mana-v993-detail-nav .mana-v993-detail-btn{
        background:#15171B!important;
        border:1px solid #697686!important;
        border-radius:12px!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        box-shadow:none!important
      }
      html body #${SHELL_ID} #${ROOT_ID} .mana-v993-period.active,
      html body #${SHELL_ID} #${ROOT_ID} .mana-v993-detail-nav .mana-v993-detail-btn.active{
        background:#20160F!important;
        border:1px solid #FF7927!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important
      }

      html body #${SHELL_ID} #${ROOT_ID} .mana-v993-metrics>.mana-v993-metric,
      html body #${SHELL_ID} #${ROOT_ID} .mana-v993-metrics>[class*="water"]{
        background:#15171B!important;
        background-image:none!important;
        border:1px solid #A5ADB7!important;
        border-radius:16px!important;
        box-shadow:none!important
      }
      html body #${SHELL_ID} #${ROOT_ID} .mana-v993-metrics .mana-v993-metric-label{
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important
      }
      html body #${SHELL_ID} #${ROOT_ID} .mana-v993-metrics .mana-v993-metric-value,
      html body #${SHELL_ID} #${ROOT_ID} .mana-v993-metrics .mana-v993-metric-value *{
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        text-shadow:none!important
      }
      html body #${SHELL_ID} #${ROOT_ID} .mana-v993-metrics .mana-v993-track{
        background:#252B31!important
      }
      html body #${SHELL_ID} #${ROOT_ID} .mana-v993-metrics .mana-v993-fill,
      html body #${SHELL_ID} #${ROOT_ID} .mana-v993-metrics .mp-water-fill{
        background:#FF7927!important;
        background-image:none!important;
        box-shadow:none!important
      }

      html body #${SHELL_ID} #${ROOT_ID} .mana-v993-panel{
        background:#15171B!important;
        background-image:none!important;
        border:1px solid #A5ADB7!important;
        box-shadow:none!important;
        border-radius:19px!important
      }

      html body #${SHELL_ID} #${ROOT_ID} .mana-v993-summary{
        background:#0D0F13!important;
        border:1px solid #697686!important
      }
      html body #${SHELL_ID} #${ROOT_ID} .mana-v993-summary strong,
      html body #${SHELL_ID} #${ROOT_ID} .mana-v993-row-value{
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important
      }
      html body #${SHELL_ID} #${ROOT_ID} .mana-v993-row,
      html body #${SHELL_ID} #${ROOT_ID} .mana-v953-history-row{
        border-color:#697686!important
      }

      html body #${SHELL_ID} #${ROOT_ID} #manaV993Detail .mana-v993-row,
      html body #${SHELL_ID} #${ROOT_ID} #manaV993Detail .mana-v993-summary,
      html body #${SHELL_ID} #${ROOT_ID} #manaV993Detail [class*="history-row"],
      html body #${SHELL_ID} #${ROOT_ID} #manaV993Detail [class*="history-item"],
      html body #${SHELL_ID} #${ROOT_ID} #manaV993Detail [class*="list-row"]{
        border-color:#697686!important
      }

      html body #${SHELL_ID} #${ROOT_ID} .mana-v993-exercise-select{
        background:#0D0F13!important;
        border:1px solid #697686!important;
        color:#fff!important
      }

      html body #${SHELL_ID}.open:has(#${ROOT_ID}) #manaV83Tabs{
        background:rgba(8,9,11,.97)!important;
        border-top:1px solid #464D55!important;
        box-shadow:none!important
      }
      html body #${SHELL_ID}.open:has(#${ROOT_ID}) #manaV83Tabs .mana-v83-tab{
        background:transparent!important;
        border:1px solid transparent!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        box-shadow:none!important;
        text-shadow:none!important
      }
      html body #${SHELL_ID}.open:has(#${ROOT_ID}) #manaV83Tabs .mana-v83-tab.active{
        background:#20160F!important;
        border:1px solid #FF7927!important;
        border-radius:12px!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important
      }
      html body #${SHELL_ID}.open:has(#${ROOT_ID}) #manaV83Tabs .mana-v83-tab::before{
        background:#A5ADB7!important;
        box-shadow:none!important
      }
      html body #${SHELL_ID}.open:has(#${ROOT_ID}) #manaV83Tabs .mana-v83-tab.active::before{
        background:#FF7927!important
      }
      html body #${SHELL_ID}.open:has(#${ROOT_ID}) #manaV83Tabs .mana-v83-tab img{
        filter:grayscale(1) brightness(1.65)!important;
        box-shadow:none!important
      }
      html body #${SHELL_ID}.open:has(#${ROOT_ID}) #manaV83Tabs [data-v83-tab="overview"]:not(.active),
      html body #${SHELL_ID}.open:has(#${ROOT_ID}) #manaV83Tabs [data-v83-tab="overview"]:not(.active) svg,
      html body #${SHELL_ID}.open:has(#${ROOT_ID}) #manaV83Tabs [data-v83-tab="overview"]:not(.active) svg *{
        color:#C1C6CE!important;
        stroke:#C1C6CE!important;
        fill:currentColor!important;
        filter:none!important
      }

      @media(max-width:650px){
        html body #${SHELL_ID} #${HEADER_ID} .mp-runner{flex-basis:48px;width:48px;height:40px}
        html body #${SHELL_ID} #${HEADER_ID} .mp-name{font-size:clamp(23px,7vw,35px)}
        html body #${SHELL_ID} #${HEADER_ID} .mp-brand{gap:7px}
      }
    `;
    document.head.appendChild(style);
  }

  function ensureHeader() {
    const holder = document.getElementById(CONTENT_ID);
    if (!holder || holder.querySelector("#" + HEADER_ID)) return;

    const node = document.createElement("div");
    node.id = HEADER_ID;
    node.innerHTML = `
      <div class="mp-brand">
        <div class="mp-runner" aria-hidden="true"></div>
        <div>
          <div class="mp-name">MANA <span>MOVEMENT</span></div>
          <div class="mp-tag">TRAINING · MOVE WITH PURPOSE</div>
        </div>
      </div>
      <div class="mp-back-row">
        <button id="${BACK_ID}" type="button">⌂ Overview</button>
      </div>
    `;
    holder.prepend(node);
  }

  function getFuelWaterData() {
    const now = new Date();
    const dateKey = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0")
    ].join("-");

    let value = 0;
    let target = 2300;

    try {
      value = Math.max(0, Number(JSON.parse(localStorage.getItem(FUEL_KEY) || "{}")?.[dateKey]?.water) || 0);
    } catch (_) {}

    try {
      target = Math.max(1, Number(JSON.parse(localStorage.getItem(TARGET_KEY) || "{}")?.water) || 2300);
    } catch (_) {}

    return { value, target };
  }

  function getWaterCards(grid) {
    return [...grid.children].filter(card => {
      const label = card.querySelector(".mana-v993-metric-label,[class*='label']");
      const text = (label?.textContent || card.textContent || "").trim().toUpperCase();
      return text.startsWith("WATER");
    });
  }

  function ensureSingleWaterCard() {
    const grid = document.querySelector("#" + ROOT_ID + " .mana-v993-metrics");
    if (!grid) return;

    const cards = getWaterCards(grid);
    let card = cards.find(el => el.id === WATER_ID) || cards[0];

    if (!card) {
      card = document.createElement("div");
      card.id = WATER_ID;
      card.className = "mana-v993-metric mp-water-metric";
      card.innerHTML = `
        <div class="mana-v993-metric-label">WATER</div>
        <div class="mana-v993-metric-value"></div>
        <div class="mana-v993-metric-sub"></div>
        <div class="mana-v993-track"><div class="mana-v993-fill mp-water-fill"></div></div>
      `;
      grid.appendChild(card);
    }

    cards.forEach(el => {
      if (el !== card) el.remove();
    });

    if (card.id !== WATER_ID) card.id = WATER_ID;

    let label = card.querySelector(".mana-v993-metric-label");
    let value = card.querySelector(".mana-v993-metric-value");
    let sub = card.querySelector(".mana-v993-metric-sub");
    let track = card.querySelector(".mana-v993-track");
    let fill = card.querySelector(".mana-v993-fill,.mp-water-fill");

    if (!label) {
      label = document.createElement("div");
      label.className = "mana-v993-metric-label";
      label.textContent = "WATER";
      card.appendChild(label);
    } else {
      label.textContent = "WATER";
    }

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

    if (!track) {
      track = document.createElement("div");
      track.className = "mana-v993-track";
      card.appendChild(track);
    }

    if (!fill) {
      fill = document.createElement("div");
      fill.className = "mana-v993-fill mp-water-fill";
      track.appendChild(fill);
    }

    const { value: ml, target } = getFuelWaterData();
    value.textContent = (ml / 1000).toFixed(1) + " L";
    sub.textContent = "Target " + (target / 1000).toFixed(1) + " L";
    setImportant(fill, "width", Math.min(100, Math.round((ml / target) * 100)) + "%");

    setImportant(card, "background", "#15171B");
    setImportant(card, "border", "1px solid #A5ADB7");
    setImportant(label, "color", "#C1C6CE");
    setImportant(value, "color", "#FF7927");
    setImportant(sub, "color", "#FFFFFF");
    setImportant(fill, "background", "#FF7927");
  }

  function getWeightData() {
    try {
      const items = JSON.parse(localStorage.getItem(WEIGHT_KEY) || "[]");
      if (!Array.isArray(items)) return [];
      return items
        .filter(x => x && x.date && Number(x.weight) > 0)
        .map(x => ({ date: String(x.date), weight: Number(x.weight) }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-30);
    } catch (_) {
      return [];
    }
  }

  function buildFallbackWeightSVG(data) {
    if (!data.length) {
      return '<p style="color:#C1C6CE">No body-weight check-ins yet.</p>';
    }

    const w = 620, h = 190, l = 45, r = 15, t = 19, b = 30;
    const vals = data.map(x => x.weight);
    const low = Math.min(...vals);
    const high = Math.max(...vals);
    const pad = Math.max(1, (high - low) * 0.2);
    const minY = low - pad;
    const maxY = high + pad;

    const getX = i => data.length === 1 ? (l + w - r) / 2 : l + i * (w - l - r) / (data.length - 1);
    const getY = n => t + (maxY - n) * (h - t - b) / (maxY - minY);

    const points = data.map((d, i) => `${getX(i).toFixed(1)},${getY(d.weight).toFixed(1)}`).join(" ");
    const dots = data.map((d, i) => `<circle cx="${getX(i)}" cy="${getY(d.weight)}" r="3.5" fill="#FF7927"/>`).join("");

    return `
      <svg role="img" aria-label="Body-weight history" viewBox="0 0 ${w} ${h}">
        <line x1="${l}" x2="${w - r}" y1="${h - b}" y2="${h - b}" stroke="#697686"/>
        <polyline points="${points}" fill="none" stroke="#FF7927" stroke-width="3"/>
        ${dots}
        <g fill="#C1C6CE" font-size="11" font-family="system-ui">
          <text x="4" y="${t + 5}">${maxY.toFixed(1)}</text>
          <text x="4" y="${h - b + 5}">${minY.toFixed(1)}</text>
          <text x="${l}" y="${h - 6}">${data[0].date.slice(5)}</text>
          <text x="${w - r}" y="${h - 6}" text-anchor="end">${data[data.length - 1].date.slice(5)}</text>
        </g>
      </svg>
    `;
  }

  function isGreyStroke(stroke) {
    if (!stroke || stroke === "none") return false;
    return /rgb\(\s*(9[0-9]|1[0-7][0-9]|18[0-9])\s*,\s*(9[0-9]|1[0-7][0-9]|18[0-9])\s*,\s*(9[0-9]|1[0-7][0-9]|18[0-9])\s*\)/i.test(stroke)
      || /#697686|#A5ADB7|#252B31|#464D55/i.test(stroke);
  }

  function isGreenish(stroke) {
    if (!stroke) return false;
    return /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/i.test(stroke) &&
      (function () {
        const m = stroke.match(/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/i);
        if (!m) return false;
        const r = Number(m[1]), g = Number(m[2]), b = Number(m[3]);
        return g > r + 20 && g > b + 20;
      })();
  }

  function isGoldish(color) {
    if (!color) return false;
    const m = color.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
    if (!m) return /#d4af37|#e0b84a|#f0c75e|gold|yellow/i.test(color);
    const r = Number(m[1]);
    const g = Number(m[2]);
    const b = Number(m[3]);
    return r > 150 && g > 100 && g < r && b < 150;
  }

  function recolourOneSVG(svg) {
    if (!svg) return;

    svg.querySelectorAll("text").forEach(t => {
      setImportant(t, "fill", "#C1C6CE");
      setImportant(t, "color", "#C1C6CE");
      setImportant(t, "stroke", "none");
    });

    svg.querySelectorAll("line").forEach(el => {
      setImportant(el, "stroke", "#464D55");
    });

    svg.querySelectorAll("polyline,path").forEach(el => {
      const stroke = el.getAttribute("stroke") || getComputedStyle(el).stroke;
      const fill = el.getAttribute("fill") || getComputedStyle(el).fill;
      const width = parseFloat(el.getAttribute("stroke-width") || getComputedStyle(el).strokeWidth || "1");

      if (fill === "none" || width >= 2 || isGreenish(stroke) || isGoldish(stroke)) {
        if (!isGreyStroke(stroke)) {
          setImportant(el, "stroke", "#FF7927");
        }
      }
    });

    svg.querySelectorAll("circle").forEach(el => {
      setImportant(el, "fill", "#FF7927");
      setImportant(el, "stroke", "#FF7927");
    });
  }

  function recolourDetailPanels() {
    const detailRoot = document.querySelector("#" + ROOT_ID + " #manaV993Detail");
    if (!detailRoot) return;

    detailRoot.querySelectorAll(".mana-v993-panel").forEach(panel => {
      setImportant(panel, "background", "#15171B");
      setImportant(panel, "border", "1px solid #A5ADB7");

      panel.querySelectorAll("h2,h3,h4").forEach(el => {
        setImportant(el, "color", "#FFFFFF");
        setImportant(el, "-webkit-text-fill-color", "#FFFFFF");
      });

      panel.querySelectorAll(".mana-v993-kicker,.mana-v993-panel-kicker").forEach(el => {
        setImportant(el, "color", "#FF7927");
        setImportant(el, "-webkit-text-fill-color", "#FF7927");
      });

      panel.querySelectorAll("strong").forEach(el => {
        if (isGoldish(getComputedStyle(el).color)) {
          setImportant(el, "color", "#FF7927");
          setImportant(el, "-webkit-text-fill-color", "#FF7927");
        }
      });

      panel.querySelectorAll("small,span,div,p,label").forEach(el => {
        const txt = (el.textContent || "").trim();
        if (!txt) return;

        const color = getComputedStyle(el).color;
        if (isGoldish(color)) {
          if (/recorded history|trend line|gold data points/i.test(txt)) {
            setImportant(el, "color", "#C1C6CE");
            setImportant(el, "-webkit-text-fill-color", "#C1C6CE");
          } else {
            setImportant(el, "color", "#FF7927");
            setImportant(el, "-webkit-text-fill-color", "#FF7927");
          }
        }
      });

      panel.querySelectorAll("svg").forEach(svg => {
        recolourOneSVG(svg);
      });
    });
  }

  function ensureWeightFallbackIfNeeded() {
    const root = document.getElementById(ROOT_ID);
    if (!root) return;

    const activeWeightBtn = root.querySelector('.mana-v993-detail-btn.active[data-v993-detail="weight"]');
    if (!activeWeightBtn) return;

    const detailPanel = root.querySelector("#manaV993Detail .mana-v993-panel");
    if (!detailPanel) return;

    const anySVG = detailPanel.querySelector("svg");
    if (anySVG) {
      const fallback = detailPanel.querySelector("#" + FALLBACK_GRAPH_ID);
      if (fallback) fallback.remove();
      return;
    }

    let graph = detailPanel.querySelector("#" + FALLBACK_GRAPH_ID);
    if (!graph) {
      graph = document.createElement("section");
      graph.id = FALLBACK_GRAPH_ID;
      graph.style.marginTop = "15px";
      graph.style.padding = "14px";
      graph.style.background = "#101216";
      graph.style.border = "1px solid #A5ADB7";
      graph.style.borderRadius = "16px";
      detailPanel.appendChild(graph);
    }

    const data = getWeightData();
    const snapshot = data.map(x => x.date + ":" + x.weight).join("|");
    if (graph.dataset.snapshot !== snapshot) {
      graph.dataset.snapshot = snapshot;
      graph.innerHTML = "<h4 style='color:#fff;margin:0 0 8px'>Body Weight Trend</h4>" + buildFallbackWeightSVG(data);
    }
  }

  function tidyProgressText() {
    const root = document.getElementById(ROOT_ID);
    if (!root) return;

    root.querySelectorAll(".mana-v993-detail-nav .mana-v993-detail-btn").forEach(btn => {
      if (btn.classList.contains("active")) {
        setImportant(btn, "background", "#20160F");
        setImportant(btn, "border", "1px solid #FF7927");
        setImportant(btn, "color", "#FF7927");
        setImportant(btn, "-webkit-text-fill-color", "#FF7927");
      } else {
        setImportant(btn, "background", "#15171B");
        setImportant(btn, "border", "1px solid #697686");
        setImportant(btn, "color", "#C1C6CE");
        setImportant(btn, "-webkit-text-fill-color", "#C1C6CE");
      }
    });

    const overviewTab = document.querySelector('#manaV83Tabs [data-v83-tab="overview"]');
    if (overviewTab && !overviewTab.classList.contains("active")) {
      setImportant(overviewTab, "color", "#C1C6CE");
      setImportant(overviewTab, "-webkit-text-fill-color", "#C1C6CE");
      setImportant(overviewTab, "background", "transparent");
      setImportant(overviewTab, "border", "1px solid transparent");
    }

    root.querySelectorAll(".mana-v993-row-value").forEach(el => {
      setImportant(el, "color", "#FF7927");
      setImportant(el, "-webkit-text-fill-color", "#FF7927");
    });
  }

  function maintainProgress() {
    if (!isProgressOpen()) return;
    ensureHeader();
    ensureSingleWaterCard();
    ensureWeightFallbackIfNeeded();
    recolourDetailPanels();
    tidyProgressText();
  }

  function scheduleMaintain() {
    if (rafQueued) return;
    rafQueued = true;
    requestAnimationFrame(() => {
      rafQueued = false;
      maintainProgress();
    });
  }

  function init() {
    injectCSS();

    const content = document.getElementById(CONTENT_ID);
    if (content) {
      new MutationObserver(scheduleMaintain).observe(content, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: false
      });
    }

    document.addEventListener("click", event => {
      if (!(event.target instanceof Element)) return;

      if (event.target.closest("#" + BACK_ID)) {
        document.querySelector('#manaV83Tabs [data-v83-tab="overview"]')?.click();
        return;
      }

      if (
        event.target.closest(
          '#manaV83Tabs .mana-v83-tab,' +
          '[data-v993-period],' +
          '[data-v993-detail],' +
          '.mana-v993-detail-btn,' +
          '.mana-v993-period'
        )
      ) {
        requestAnimationFrame(scheduleMaintain);
        setTimeout(scheduleMaintain, 50);
        setTimeout(scheduleMaintain, 150);
        setTimeout(scheduleMaintain, 350);
      }
    });

    [
      "mana:program-tab-change",
      "mana:fuel-updated",
      "mana:recovery-updated",
      "mana:body-weight-updated"
    ].forEach(name => {
      window.addEventListener(name, scheduleMaintain);
    });

    window.addEventListener("storage", e => {
      if ([FUEL_KEY, TARGET_KEY, WEIGHT_KEY].includes(e.key)) {
        scheduleMaintain();
      }
    });

    scheduleMaintain();

    window.MANA_STRENGTH_PROGRESS_DESIGN_BUILD = "104360";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
