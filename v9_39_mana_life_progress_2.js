
/* ============================================
   MANA MOVEMENT TRAINING
   MANA LYFE — DAILY ROUTINE
   BUILD 103130

   REPLACES:
   v9_39_mana_life_progress_2.js

   - Progress becomes Daily Routine
   - 9 practical daily habits
   - Daily checkbox tracking
   - Optional daily note
   - Saved separately by calendar date
   - Reset Now and Support Chat access
   - No mental health scoring
   - Existing Reclaim remains available

   MANA 28:
   - Water progress blue
   - Recovery progress purple
   - Other progress green
   - Premium gold outlines

   No changes to Mana Strength or workouts.
   ============================================ */

(() => {
  "use strict";

  const BUILD = "103130";
  const STYLE_ID = "mana-lyfe-routine-103130";
  const ROOT_ID = "manaLyfeDailyRoutine103130";
  const STORAGE_KEY = "mana-lyfe-daily-routine-103130";

  if (window.MANA_LYFE_ROUTINE_BUILD === BUILD) return;

  const HABITS = [
    {
      key: "bed",
      name: "Make your bed",
      detail: "Start your day with one completed action.",
      icon: "✓"
    },
    {
      key: "water",
      name: "Drink your water",
      detail: "Stay hydrated throughout the day.",
      icon: "◉"
    },
    {
      key: "food",
      name: "Eat well",
      detail: "Nourish your body with regular meals.",
      icon: "✓"
    },
    {
      key: "walk",
      name: "Go for a walk",
      detail: "Fresh air, daylight and movement.",
      icon: "→"
    },
    {
      key: "workout",
      name: "Workout or move",
      detail: "Train, stretch or move with purpose.",
      icon: "✓"
    },
    {
      key: "sleep",
      name: "Prioritise sleep",
      detail: "Make time for quality rest and recovery.",
      icon: "☾"
    },
    {
      key: "journal",
      name: "Journal or reflect",
      detail: "Take a moment to organise your thoughts.",
      icon: "✎"
    },
    {
      key: "connection",
      name: "Friends and family",
      detail: "Connect with someone important to you.",
      icon: "♡"
    },
    {
      key: "support",
      name: "Reach out for support",
      detail: "Connect when you need it. Optional.",
      icon: "♡"
    }
  ];

  const CSS = `
    /* =====================================
       MANA LYFE DAILY ROUTINE
       ===================================== */

    #${ROOT_ID} {
      max-width: 780px;
      margin: 0 auto 36px;
      color: #f5f5f5;
    }

    #${ROOT_ID} * {
      box-sizing: border-box;
    }

    #${ROOT_ID} .mlr-header {
      margin-bottom: 20px;
    }

    #${ROOT_ID} .mlr-kicker {
      color: #f3d875;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: .13em;
    }

    #${ROOT_ID} h2 {
      color: #fff;
      font-size: clamp(27px,6vw,35px);
      font-weight: 950;
      line-height: 1.1;
      margin: 8px 0;
    }

    #${ROOT_ID} .mlr-intro {
      color: #aaa;
      font-size: 14px;
      line-height: 1.6;
      margin: 0;
    }

    #${ROOT_ID} .mlr-summary {
      padding: 19px;
      border: 1px solid rgba(230,189,72,.68);
      border-radius: 19px;
      background: linear-gradient(
        145deg,#15140f,#090909
      );
      margin-bottom: 14px;
    }

    #${ROOT_ID} .mlr-summary-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    #${ROOT_ID} .mlr-summary-head strong {
      color: #f3d875;
      font-size: 18px;
      font-weight: 900;
    }

    #${ROOT_ID} .mlr-summary-head span {
      color: #fff;
      font-size: 16px;
      font-weight: 900;
    }

    #${ROOT_ID} .mlr-track {
      height: 9px;
      border-radius: 99px;
      background: #292929;
      overflow: hidden;
    }

    #${ROOT_ID} .mlr-fill {
      height: 100%;
      width: 0%;
      border-radius: inherit;
      background: linear-gradient(
        90deg,#278b57,#45c783
      );
      transition: width .2s ease;
    }

    #${ROOT_ID} .mlr-date {
      margin-top: 12px;
      color: #999;
      font-size: 11px;
    }

    #${ROOT_ID} .mlr-items {
      display: grid;
      gap: 9px;
    }

    #${ROOT_ID} .mlr-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 15px;
      background: #0c0c0b;
      border: 1px solid rgba(230,189,72,.55);
      border-radius: 15px;
      cursor: pointer;
    }

    #${ROOT_ID} .mlr-item.done {
      background: #101910;
    }

    #${ROOT_ID} .mlr-checkbox {
      width: 23px;
      height: 23px;
      flex: 0 0 23px;
      accent-color: #45c783;
      cursor: pointer;
    }

    #${ROOT_ID} .mlr-item-copy {
      flex: 1;
      min-width: 0;
    }

    #${ROOT_ID} .mlr-item-name {
      display: block;
      color: #fff;
      font-size: 16px;
      font-weight: 850;
      line-height: 1.35;
    }

    #${ROOT_ID} .mlr-item-detail {
      display: block;
      color: #999;
      font-size: 12px;
      line-height: 1.45;
      margin-top: 4px;
    }

    #${ROOT_ID} .mlr-item.done
    .mlr-item-name {
      color: #f3d875;
    }

    #${ROOT_ID} .mlr-note-card {
      margin-top: 18px;
      border: 1px solid rgba(230,189,72,.68);
      border-radius: 17px;
      padding: 16px;
      background: #0c0c0b;
    }

    #${ROOT_ID} .mlr-note-title {
      display: block;
      color: #f3d875;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: .06em;
      margin-bottom: 9px;
    }

    #${ROOT_ID} .mlr-note {
      width: 100%;
      min-height: 88px;
      background: #111;
      border: 1px solid rgba(230,189,72,.45);
      border-radius: 11px;
      padding: 12px;
      color: #fff;
      font: inherit;
      font-size: 14px;
      line-height: 1.5;
      resize: vertical;
    }

    #${ROOT_ID} .mlr-note::placeholder {
      color: #777;
    }

    #${ROOT_ID} .mlr-note-status {
      color: #aaa;
      font-size: 11px;
      margin-top: 8px;
      min-height: 16px;
    }

    #${ROOT_ID} .mlr-actions {
      display: grid;
      grid-template-columns: repeat(2,minmax(0,1fr));
      gap: 10px;
      margin-top: 18px;
    }

    #${ROOT_ID} .mlr-action {
      min-height: 55px;
      border-radius: 999px;
      border: 1px solid #55d98b;
      background: #164b30;
      color: #fff;
      font-weight: 900;
      font-size: 12px;
      cursor: pointer;
      padding: 12px;
    }

    #${ROOT_ID} .mlr-action:active {
      background: #216f47;
    }

    #${ROOT_ID} .mlr-footer {
      color: #999;
      text-align: center;
      font-size: 12px;
      margin-top: 18px;
      line-height: 1.6;
    }

    /* MANA LYFE GREEN SUPPORT ACTIONS */

    #manaV936Reset,
    #manaV936Support,
    #manaV933OpenReset,
    #manaV933OpenSupport,
    [data-v933-support-chat],
    #manaV936Modal .mana-v936-primary {
      border: 1px solid #55d98b !important;
      border-radius: 999px !important;
      background: #164b30 !important;
      color: #fff !important;
    }

    /* MANA 28 PROGRESS */

    #manaV83Content
    .mana-v981-root
    .mana-v981-card,
    #manaV83Content
    .mana-v981-root
    .mana-v981-overall,
    #manaV83Content
    .mana-v981-root
    .mana-v981-periods {
      border-color: rgba(230,189,72,.68) !important;
    }

    #manaV83Content
    .mana-v981-root
    .mana-v981-overall-bar span,
    #manaV83Content
    .mana-v981-root
    .mana-v981-bar span {
      background: linear-gradient(
        90deg,#278b57,#45c783
      ) !important;
    }

    #manaV83Content
    .mana-v981-root
    .mana-v981-card.water
    .mana-v981-bar span {
      background: linear-gradient(
        90deg,#1677bb,#42b8ff
      ) !important;
    }

    #manaV83Content
    .mana-v981-root
    .mana-v981-card.recovery
    .mana-v981-bar span {
      background: linear-gradient(
        90deg,#6f49bb,#a77bff
      ) !important;
    }

    @media(max-width:420px) {
      #${ROOT_ID} .mlr-item {
        padding: 13px 12px;
        gap: 11px;
      }

      #${ROOT_ID} .mlr-item-name {
        font-size: 15px;
      }

      #${ROOT_ID} .mlr-actions {
        gap: 8px;
      }
    }
  `;

  /* =====================================
     DATE AND STORAGE
     ===================================== */

  function todayKey() {
    const now = new Date();

    return [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2,"0"),
      String(now.getDate()).padStart(2,"0")
    ].join("-");
  }

  function loadStore() {
    try {
      const data = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "{}"
      );
      return data && typeof data === "object"
        ? data : {};
    } catch (_) {
      return {};
    }
  }

  function saveStore(store) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(store)
      );
      return true;
    } catch (error) {
      console.warn(
        "Mana Lyfe routine save unavailable",
        error
      );
      return false;
    }
  }

  function dayData() {
    const store = loadStore();
    const day = store[todayKey()] || {};

    return {
      checks: day.checks || {},
      note: String(day.note || "")
    };
  }

  function updateDay(updater) {
    const store = loadStore();
    const key = todayKey();

    const current = {
      checks: {...(store[key]?.checks || {})},
      note: String(store[key]?.note || "")
    };

    updater(current);
    store[key] = current;

    return saveStore(store);
  }

  /* =====================================
     PROGRAM NAVIGATION
     ===================================== */

  function isLyfe() {
    const shell = document.getElementById(
      "manaV83ProgramShell"
    );

    const title = String(
      document.getElementById("manaV83Title")
        ?.textContent || ""
    ).trim().toUpperCase();

    return Boolean(
      shell?.classList.contains("open") &&
      (title.includes("MANA LYFE") ||
       title.includes("MANA LIFE"))
    );
  }

  function onRoutineTab() {
    return isLyfe() && Boolean(
      document.querySelector(
        '#manaV83Tabs .mana-v83-tab.active' +
        '[data-v83-tab="progress"]'
      )
    );
  }

  function updateTabLabel() {
    const tab = document.querySelector(
      '#manaV83Tabs [data-v83-tab="progress"]'
    );

    if (!tab) return;

    if (isLyfe()) {
      if (tab.dataset.mlrOriginalHtml === undefined) {
        tab.dataset.mlrOriginalHtml = tab.innerHTML;
      }

      /* Retain existing icon artwork. */
      const textNodes = Array.from(
        tab.querySelectorAll("span,small,strong")
      ).filter(node =>
        node.children.length === 0 &&
        /^progress$/i.test(node.textContent.trim())
      );

      if (textNodes.length) {
        textNodes[textNodes.length - 1].textContent =
          "Routine";
      } else if (
        /^progress$/i.test(tab.textContent.trim())
      ) {
        tab.textContent = "Routine";
      }
    } else if (
      tab.dataset.mlrOriginalHtml !== undefined
    ) {
      tab.innerHTML = tab.dataset.mlrOriginalHtml;
      delete tab.dataset.mlrOriginalHtml;
    }
  }

  /* =====================================
     RENDER ROUTINE
     ===================================== */

  function renderRoutine() {
    if (!onRoutineTab()) return;

    const holder = document.getElementById(
      "manaV83Content"
    );

    if (!holder) return;

    const existing = document.getElementById(
      ROOT_ID
    );

    if (existing && existing.parentElement === holder) {
      updateSummary(existing);
      return;
    }

    holder.replaceChildren();

    const root = document.createElement("section");
    root.id = ROOT_ID;

    root.innerHTML = `
      <header class="mlr-header">
        <div class="mlr-kicker">
          MANA LYFE • DAILY ROUTINE
        </div>
        <h2>Build the day first.</h2>
        <p class="mlr-intro">
          Your daily non-negotiables.
          Simple actions that build consistency,
          confidence and momentum.
        </p>
      </header>

      <div class="mlr-summary">
        <div class="mlr-summary-head">
          <strong class="mlr-count"></strong>
          <span class="mlr-percent"></span>
        </div>
        <div class="mlr-track">
          <div class="mlr-fill"></div>
        </div>
        <div class="mlr-date"></div>
      </div>

      <div class="mlr-items"></div>

      <div class="mlr-note-card">
        <label class="mlr-note-title"
               for="mlrDailyNote">
          DAILY NOTES • OPTIONAL
        </label>
        <textarea
          id="mlrDailyNote"
          class="mlr-note"
          maxlength="1000"
          placeholder="Anything you want to remember, plan or celebrate today."
        ></textarea>
        <div class="mlr-note-status">
          Private note saved on this device.
        </div>
      </div>

      <div class="mlr-actions">
        <button type="button"
                class="mlr-action"
                id="mlrResetNow">
          ↻ RESET NOW
        </button>
        <button type="button"
                class="mlr-action"
                id="mlrSupportChat">
          ♡ SUPPORT CHAT
        </button>
      </div>

      <p class="mlr-footer">
        You don't need a perfect day.
        Just keep moving with purpose.
      </p>
    `;

    holder.appendChild(root);

    const items = root.querySelector(".mlr-items");
    const state = dayData();

    HABITS.forEach(habit => {
      const label = document.createElement("label");

      label.className = "mlr-item";
      label.dataset.habit = habit.key;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "mlr-checkbox";
      checkbox.checked = Boolean(
        state.checks[habit.key]
      );

      const copy = document.createElement("span");
      copy.className = "mlr-item-copy";

      const name = document.createElement("strong");
      name.className = "mlr-item-name";
      name.textContent = habit.name;

      const detail = document.createElement("small");
      detail.className = "mlr-item-detail";
      detail.textContent = habit.detail;

      copy.append(name,detail);
      label.append(checkbox,copy);

      if (checkbox.checked) {
        label.classList.add("done");
      }

      checkbox.addEventListener("change", () => {
        const saved = updateDay(day => {
          day.checks[habit.key] = checkbox.checked;
        });

        label.classList.toggle(
          "done",checkbox.checked
        );

        updateSummary(root);

        if (!saved) {
          const status = root.querySelector(
            ".mlr-note-status"
          );
          status.textContent =
            "Unable to save on this device.";
        }
      });

      items.appendChild(label);
    });

    const note = root.querySelector(".mlr-note");
    note.value = state.note;

    note.addEventListener("change", () => {
      const saved = updateDay(day => {
        day.note = note.value;
      });

      root.querySelector(
        ".mlr-note-status"
      ).textContent = saved
        ? "Daily note saved on this device."
        : "Unable to save on this device.";
    });

    root.querySelector(
      "#mlrResetNow"
    ).addEventListener("click", () => {
      if (typeof window.openManaLifeReset === "function") {
        window.openManaLifeReset();
      } else {
        alert("Reset Now is unavailable.");
      }
    });

    root.querySelector(
      "#mlrSupportChat"
    ).addEventListener("click", () => {
      if (typeof window.openManaLifeSupport === "function") {
        window.openManaLifeSupport();
      } else {
        alert("Support Chat is unavailable.");
      }
    });

    updateSummary(root);
  }

  function updateSummary(root) {
    const state = dayData();

    const completed = HABITS.filter(
      habit => Boolean(state.checks[habit.key])
    ).length;

    const percent = Math.round(
      completed / HABITS.length * 100
    );

    const count = root.querySelector(".mlr-count");
    const percentage = root.querySelector(
      ".mlr-percent"
    );
    const fill = root.querySelector(".mlr-fill");
    const date = root.querySelector(".mlr-date");

    if (count) {
      count.textContent =
        completed + " of " + HABITS.length +
        " completed";
    }

    if (percentage) {
      percentage.textContent = percent + "%";
    }

    if (fill) {
      fill.style.width = percent + "%";
    }

    if (date) {
      date.textContent =
        new Date().toLocaleDateString(
          "en-AU",{
            weekday:"long",
            day:"numeric",
            month:"long"
          }
        );
    }
  }

  /* =====================================
     STABLE PAGE HANDLING
     ===================================== */

  let pending = false;

  function refresh() {
    updateTabLabel();

    if (onRoutineTab()) {
      renderRoutine();
    }
  }

  function scheduleRefresh() {
    if (pending) return;

    pending = true;

    requestAnimationFrame(() => {
      pending = false;
      refresh();
    });
  }

  function init() {
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = CSS;
      document.head.appendChild(style);
    }

    /* Watch only client content and navigation.
       Avoid monitoring Fuel or style changes. */

    const holder = document.getElementById(
      "manaV83Content"
    );

    if (holder) {
      const observer = new MutationObserver(() => {
        if (onRoutineTab() &&
            !holder.querySelector("#" + ROOT_ID)) {
          scheduleRefresh();
        }
      });

      observer.observe(holder,{
        childList:true
      });
    }

    [
      "mana:program-tab-change",
      "mana:program-change"
    ].forEach(name => {
      window.addEventListener(name,scheduleRefresh);
      document.addEventListener(name,scheduleRefresh);
    });

    document.addEventListener("click",event => {
      if (!(event.target instanceof Element)) return;

      if (event.target.closest(
        "#manaV83Tabs .mana-v83-tab"
      )) {
        setTimeout(scheduleRefresh,160);
      }
    });

    window.addEventListener("pageshow",scheduleRefresh);

    refresh();

    window.MANA_LYFE_ROUTINE_BUILD = BUILD;

    console.log(
      "MANA LYFE DAILY ROUTINE",
      BUILD
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",init,{once:true}
    );
  } else {
    init();
  }

})();
