
/* =================================================
   MANA MOVEMENT TRAINING
   MANA LYFE — ROUTINE + RECLAIM
   BUILD 103140

   REPLACES:
   v9_39_mana_life_progress_2.js

   ROUTINE:
   - Moves to former Reclaim tab position
   - Daily checklist only
   - Preserves previously saved checkboxes
   - No notes or support buttons

   RECLAIM:
   - Moves next to Learning
   - Prominent green Reset Now
   - Existing guided Reset questions
   - Prominent green Support Chat
   - No journal or mood scoring

   CHAT:
   - More Support contact details

   BOTH:
   - Whakatauki at the bottom

   PRESERVES:
   - Mana Strength and Mana 28
   - Existing Mana Lyfe workouts
   - Fuel and Progress
   - Existing Reset Now modal
   - Existing coaching chat
   - Premium gold design
   ================================================= */

(() => {
  "use strict";

  const BUILD = "103140";

  if (window.MANA_LYFE_ROUTINE_BUILD === BUILD) {
    return;
  }

  const STYLE_ID = "mana-lyfe-routine-103140";
  const ROUTINE_ID = "manaLyfeDailyRoutine103130";
  const RECLAIM_ID = "manaLyfeReclaim103140";

  /* Keep existing stored routine data. */

  const STORAGE_KEY =
    "mana-lyfe-daily-routine-103130";

  const HABITS = [
    ["bed", "Make your bed",
     "Start your day with one completed action."],

    ["water", "Drink your water",
     "Stay hydrated throughout the day."],

    ["food", "Eat well",
     "Nourish your body with regular meals."],

    ["walk", "Go for a walk",
     "Fresh air, daylight and movement."],

    ["workout", "Workout or move",
     "Train, stretch or move with purpose."],

    ["sleep", "Prioritise sleep",
     "Make time for quality recovery."],

    ["journal", "Journal or reflect",
     "Take a moment to organise your thoughts."],

    ["connection", "Friends and family",
     "Connect with someone important to you."],

    ["support", "Reach out for support",
     "Connect when you need it. Optional."]
  ];

  const WHAKATAUKI = `
    <div class="ml140-whakatauki">
      <span>WHAKATAUKĪ</span>
      <strong>
        Ehara taku toa i te toa takitahi,
        engari he toa takitini.
      </strong>
      <p>
        My strength is not mine alone,
        but the strength of many.
      </p>
    </div>
  `;

  /* ==========================================
     VISUAL DESIGN
     ========================================== */

  const CSS = `

    #${ROUTINE_ID},
    #${RECLAIM_ID} {
      width: 100%;
      max-width: 780px;
      margin: 0 auto 35px;
      color: #f5f5f5;
    }

    #${ROUTINE_ID} *,
    #${RECLAIM_ID} * {
      box-sizing: border-box;
    }

    .ml140-kicker {
      color: #f3d875;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: .13em;
    }

    .ml140-heading {
      color: #fff;
      font-size: clamp(27px,6vw,35px);
      line-height: 1.12;
      font-weight: 950;
      margin: 9px 0;
    }

    .ml140-intro {
      color: #aaa;
      font-size: 14px;
      line-height: 1.6;
      margin: 0 0 20px;
    }

    /* =====================================
       DAILY ROUTINE
       ===================================== */

    .ml140-summary {
      border: 1px solid rgba(230,189,72,.68);
      border-radius: 18px;
      padding: 18px;
      background: #11100c;
      margin-bottom: 15px;
    }

    .ml140-summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      margin-bottom: 13px;
    }

    .ml140-count {
      color: #f3d875;
      font-size: 17px;
      font-weight: 900;
    }

    .ml140-percent {
      color: #fff;
      font-size: 17px;
      font-weight: 900;
    }

    .ml140-track {
      width: 100%;
      height: 8px;
      background: #292929;
      border-radius: 99px;
      overflow: hidden;
    }

    .ml140-fill {
      width: 0%;
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(
        90deg,#278b57,#45c783
      );
    }

    .ml140-date {
      margin-top: 11px;
      color: #999;
      font-size: 11px;
    }

    .ml140-list {
      display: grid;
      gap: 9px;
    }

    .ml140-habit {
      display: flex;
      align-items: center;
      gap: 13px;
      padding: 14px;
      background: #0c0c0b;
      border: 1px solid rgba(230,189,72,.55);
      border-radius: 15px;
      cursor: pointer;
    }

    .ml140-habit.done {
      background: #101910;
    }

    .ml140-checkbox {
      width: 23px;
      height: 23px;
      flex: 0 0 23px;
      accent-color: #45c783;
      cursor: pointer;
    }

    .ml140-copy {
      flex: 1;
      min-width: 0;
    }

    .ml140-name {
      display: block;
      color: #fff;
      font-size: 16px;
      font-weight: 850;
      line-height: 1.35;
    }

    .ml140-habit.done .ml140-name {
      color: #f3d875;
    }

    .ml140-detail {
      display: block;
      color: #999;
      font-size: 12px;
      line-height: 1.45;
      margin-top: 4px;
    }

    /* =====================================
       RECLAIM
       ===================================== */

    .ml140-reclaim-card {
      border: 1px solid rgba(230,189,72,.68);
      border-radius: 20px;
      padding: 22px 18px;
      background: linear-gradient(
        145deg,#14140f,#090909
      );
      margin-top: 17px;
    }

    .ml140-card-title {
      color: #f3d875;
      font-size: 13px;
      font-weight: 900;
      letter-spacing: .07em;
      margin: 0 0 10px;
    }

    .ml140-card-text {
      color: #bbb;
      font-size: 14px;
      line-height: 1.65;
      margin: 0 0 17px;
    }

    .ml140-action {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: 60px;
      padding: 14px 20px;
      border-radius: 999px;
      border: 1px solid #55d98b;
      background: #164b30;
      color: #fff;
      font-size: 15px;
      font-weight: 900;
      letter-spacing: .045em;
      cursor: pointer;
      text-align: center;
    }

    .ml140-action:active {
      background: #237147;
    }

    .ml140-help {
      margin-top: 23px;
    }

    /* =====================================
       WHAKATAUKI
       ===================================== */

    .ml140-whakatauki {
      margin-top: 24px;
      padding: 20px 16px;
      border: 1px solid rgba(230,189,72,.52);
      border-radius: 17px;
      background: #0b0b0a;
      text-align: center;
    }

    .ml140-whakatauki span {
      display: block;
      color: #d7b24a;
      font-size: 10px;
      letter-spacing: .16em;
      font-weight: 900;
      margin-bottom: 12px;
    }

    .ml140-whakatauki strong {
      display: block;
      color: #f3d875;
      font-size: 16px;
      font-weight: 850;
      line-height: 1.55;
    }

    .ml140-whakatauki p {
      color: #aaa;
      font-size: 13px;
      margin: 9px 0 0;
      line-height: 1.55;
    }

    /* =====================================
       SUPPORT CHAT — MORE SUPPORT
       ===================================== */

    #manaLyfeMoreSupport103140 {
      border-top: 1px solid rgba(230,189,72,.48);
      margin-top: 18px;
      padding: 15px 5px 3px;
      color: #eee;
    }

    #manaLyfeMoreSupport103140 h3 {
      color: #f3d875;
      font-size: 16px;
      margin: 0 0 7px;
    }

    #manaLyfeMoreSupport103140 p {
      color: #aaa;
      font-size: 12px;
      line-height: 1.5;
      margin: 0 0 12px;
    }

    #manaLyfeMoreSupport103140 .ml140-link {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      padding: 11px;
      margin-bottom: 7px;
      border: 1px solid rgba(230,189,72,.45);
      border-radius: 11px;
      background: #111;
      color: #fff;
      text-decoration: none;
      font-size: 13px;
    }

    #manaLyfeMoreSupport103140 .ml140-link strong {
      color: #f3d875;
      white-space: nowrap;
    }

    @media(max-width:420px) {
      .ml140-habit {
        padding: 12px;
      }

      .ml140-name {
        font-size: 15px;
      }

      .ml140-action {
        min-height: 56px;
        font-size: 14px;
      }
    }
  `;

  /* ==========================================
     HELPERS
     ========================================== */

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
    const d = new Date();

    return [
      d.getFullYear(),
      String(d.getMonth()+1).padStart(2,"0"),
      String(d.getDate()).padStart(2,"0")
    ].join("-");
  }

  function loadToday() {
    return readJSON(STORAGE_KEY)[todayKey()] || {};
  }

  function saveToday(checks) {
    const store = readJSON(STORAGE_KEY);
    const old = store[todayKey()] || {};

    store[todayKey()] = {
      ...old,
      checks
    };

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(store)
      );
      return true;
    } catch (_) {
      return false;
    }
  }

  function isLyfe() {
    const title = String(
      document.getElementById("manaV83Title")
        ?.textContent || ""
    ).trim().toUpperCase();

    const shell = document.getElementById(
      "manaV83ProgramShell"
    );

    return Boolean(
      shell?.classList.contains("open") &&
      (
        title.includes("MANA LYFE") ||
        title.includes("MANA LIFE")
      )
    );
  }

  function activeTab() {
    return document.querySelector(
      "#manaV83Tabs .mana-v83-tab.active"
    )?.dataset.v83Tab || "";
  }

  /* ==========================================
     NAVIGATION SWAP

     Keep original data-v83-tab values.
     This preserves existing navigation.
     Move their physical positions only.
     ========================================== */

  function arrangeTabs() {
    const nav = document.getElementById(
      "manaV83Tabs"
    );

    if (!nav) return;

    const routine = nav.querySelector(
      '[data-v83-tab="progress"]'
    );

    const reclaim = nav.querySelector(
      '[data-v83-tab="reclaim"]'
    );

    if (!routine || !reclaim) return;

    if (isLyfe()) {
      if (!routine.dataset.ml140Original) {
        routine.dataset.ml140Original =
          routine.innerHTML;
      }

      if (!reclaim.dataset.ml140Original) {
        reclaim.dataset.ml140Original =
          reclaim.innerHTML;
      }

      const labels = routine.querySelectorAll(
        "span,small,strong"
      );

      let changed = false;

      labels.forEach(el => {
        if (
          !el.children.length &&
          /^(progress|routine)$/i.test(
            el.textContent.trim()
          )
        ) {
          el.textContent = "Routine";
          changed = true;
        }
      });

      if (!changed) {
        const txt = Array.from(
          routine.childNodes
        ).find(node =>
          node.nodeType === 3 &&
          /progress/i.test(node.textContent)
        );

        if (txt) {
          txt.textContent =
            txt.textContent.replace(
              /progress/i,"Routine"
            );
        }
      }

      /* Routine goes where Reclaim was;
         Reclaim goes where Progress was. */

      if (routine.nextElementSibling !== reclaim) {
        const marker = document.createComment(
          "Mana Lyfe tab position"
        );

        reclaim.parentNode.insertBefore(
          marker,reclaim
        );

        routine.parentNode.insertBefore(
          reclaim,routine
        );

        marker.parentNode.replaceChild(
          routine,marker
        );
      }
    } else {
      [routine,reclaim].forEach(tab => {
        if (tab.dataset.ml140Original) {
          tab.innerHTML = tab.dataset.ml140Original;
          delete tab.dataset.ml140Original;
        }
      });
    }
  }

  /* ==========================================
     ROUTINE CHECKLIST
     ========================================== */

  function updateSummary(root) {
    const checks = loadToday().checks || {};

    const done = HABITS.filter(
      h => Boolean(checks[h[0]])
    ).length;

    const percent = Math.round(
      done / HABITS.length * 100
    );

    root.querySelector(
      ".ml140-count"
    ).textContent =
      done + " of " + HABITS.length + " completed";

    root.querySelector(
      ".ml140-percent"
    ).textContent = percent + "%";

    root.querySelector(
      ".ml140-fill"
    ).style.width = percent + "%";

    root.querySelector(
      ".ml140-date"
    ).textContent =
      new Date().toLocaleDateString(
        "en-AU",{
          weekday:"long",
          day:"numeric",
          month:"long"
        }
      );
  }

  function renderRoutine(holder) {
    if (holder.querySelector("#"+ROUTINE_ID)) {
      updateSummary(holder);
      return;
    }

    const root = document.createElement("section");
    root.id = ROUTINE_ID;

    root.innerHTML = `
      <div class="ml140-kicker">
        MANA LYFE • DAILY ROUTINE
      </div>
      <h2 class="ml140-heading">
        Build the day first.
      </h2>
      <p class="ml140-intro">
        Your daily non-negotiables.
        Simple actions that build
        consistency and momentum.
      </p>
      <div class="ml140-summary">
        <div class="ml140-summary-row">
          <strong class="ml140-count"></strong>
          <span class="ml140-percent"></span>
        </div>
        <div class="ml140-track">
          <div class="ml140-fill"></div>
        </div>
        <div class="ml140-date"></div>
      </div>
      <div class="ml140-list"></div>
      ${WHAKATAUKI}
    `;

    holder.replaceChildren(root);

    const checks = loadToday().checks || {};
    const list = root.querySelector(".ml140-list");

    HABITS.forEach(([key,name,detail]) => {
      const row = document.createElement("label");
      row.className = "ml140-habit";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "ml140-checkbox";
      checkbox.checked = Boolean(checks[key]);

      row.classList.toggle(
        "done",checkbox.checked
      );

      const copy = document.createElement("span");
      copy.className = "ml140-copy";

      const heading = document.createElement("strong");
      heading.className = "ml140-name";
      heading.textContent = name;

      const secondary = document.createElement("small");
      secondary.className = "ml140-detail";
      secondary.textContent = detail;

      copy.append(heading,secondary);
      row.append(checkbox,copy);
      list.appendChild(row);

      checkbox.addEventListener("change", () => {
        const fresh = {
          ...(loadToday().checks || {})
        };

        fresh[key] = checkbox.checked;

        if (!saveToday(fresh)) {
          checkbox.checked = !checkbox.checked;
          return;
        }

        row.classList.toggle(
          "done",checkbox.checked
        );

        updateSummary(root);
      });
    });

    updateSummary(root);
  }

  /* ==========================================
     RECLAIM — RESET + SUPPORT ONLY
     ========================================== */

  function renderReclaim(holder) {
    if (holder.querySelector("#"+RECLAIM_ID)) {
      return;
    }

    const root = document.createElement("section");
    root.id = RECLAIM_ID;

    root.innerHTML = `
      <div class="ml140-kicker">
        MANA LYFE • RECLAIM
      </div>

      <h2 class="ml140-heading">
        Reset. Rebuild. Move Forward.
      </h2>

      <p class="ml140-intro">
        When you need to reset, start here.
        A few simple steps can help
        you choose what comes next.
      </p>

      <div class="ml140-reclaim-card">
        <h3 class="ml140-card-title">
          RESET NOW
        </h3>

        <p class="ml140-card-text">
          Follow a short guided reset
          with breathing, simple questions
          and practical next steps.
        </p>

        <button
          type="button"
          class="ml140-action"
          id="ml140OpenReset">
          ↻ RESET NOW
        </button>
      </div>

      <div class="ml140-reclaim-card ml140-help">
        <h3 class="ml140-card-title">
          SUPPORT & CONNECTION
        </h3>

        <p class="ml140-card-text">
          You don't have to work
          everything out on your own.
          Reach out when you need guidance.
        </p>

        <button
          type="button"
          class="ml140-action"
          id="ml140OpenChat">
          ♡ SUPPORT CHAT
        </button>
      </div>

      ${WHAKATAUKI}
    `;

    holder.replaceChildren(root);

    root.querySelector(
      "#ml140OpenReset"
    ).addEventListener("click", () => {
      if (
        typeof window.openManaLifeReset ===
        "function"
      ) {
        window.openManaLifeReset();
      }
    });

    root.querySelector(
      "#ml140OpenChat"
    ).addEventListener("click", () => {
      if (
        typeof window.openManaLifeSupport ===
        "function"
      ) {
        window.openManaLifeSupport();
        scheduleSupport();
      }
    });
  }

  /* ==========================================
     MORE SUPPORT INSIDE CHAT
     ========================================== */

  function addMoreSupport() {
    if (!isLyfe()) return;

    const chat = document.getElementById(
      "manaV95ChatModal"
    );

    if (!chat) return;

    if (
      chat.querySelector(
        "#manaLyfeMoreSupport103140"
      )
    ) return;

    const panel = document.createElement("section");
    panel.id = "manaLyfeMoreSupport103140";

    panel.innerHTML = `
      <h3>More Support</h3>

      <p>
        Your coach can offer guidance,
        but is not an emergency or
        crisis support service.
        If you need additional support,
        these Australian services can help.
      </p>

      <a class="ml140-link"
         href="tel:131114">
        <span>Lifeline</span>
        <strong>13 11 14</strong>
      </a>

      <a class="ml140-link"
         href="tel:1300224636">
        <span>Beyond Blue</span>
        <strong>1300 22 4636</strong>
      </a>

      <a class="ml140-link"
         href="tel:139276">
        <span>13YARN</span>
        <strong>13 92 76</strong>
      </a>

      <a class="ml140-link"
         href="tel:000">
        <span>Emergency assistance</span>
        <strong>000</strong>
      </a>

      <p>
        If you or someone else is in
        immediate danger, call 000.
      </p>
    `;

    const target =
      chat.querySelector(".mana-v950-body") ||
      chat.querySelector(".mana-v950-content") ||
      chat;

    target.appendChild(panel);
  }

  let supportQueued = false;

  function scheduleSupport() {
    if (supportQueued) return;

    supportQueued = true;

    requestAnimationFrame(() => {
      supportQueued = false;
      addMoreSupport();
    });
  }

  /* ==========================================
     PAGE SYNC

     The older Mana Lyfe scripts still own
     navigation. Only replace content while
     the matching tab is active.

     Do not observe styles or Fuel.
     ========================================== */

  let queued = false;

  function sync() {
    if (!isLyfe()) {
      return;
    }

    arrangeTabs();

    const holder = document.getElementById(
      "manaV83Content"
    );

    if (!holder) return;

    const tab = activeTab();

    if (tab === "progress") {
      renderRoutine(holder);
    }

    if (tab === "reclaim") {
      renderReclaim(holder);
    }
  }

  function scheduleSync() {
    if (queued) return;

    queued = true;

    requestAnimationFrame(() => {
      queued = false;
      sync();
    });
  }

  function afterNavigation() {
    scheduleSync();

    /* Legacy Mana Lyfe renderers run after
       tab changes. Perform a settling check. */

    setTimeout(scheduleSync,180);
    setTimeout(scheduleSync,380);
  }

  /* ==========================================
     INITIALISE
     ========================================== */

  function init() {
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = CSS;
      document.head.appendChild(style);
    }

    const holder = document.getElementById(
      "manaV83Content"
    );

    if (holder) {
      const observer = new MutationObserver(() => {
        if (!isLyfe()) return;

        const tab = activeTab();

        if (
          tab === "progress" &&
          !holder.querySelector("#"+ROUTINE_ID)
        ) {
          scheduleSync();
        }

        if (
          tab === "reclaim" &&
          !holder.querySelector("#"+RECLAIM_ID)
        ) {
          scheduleSync();
        }
      });

      observer.observe(holder,{
        childList:true
      });
    }

    [
      "mana:program-tab-change",
      "mana:program-change"
    ].forEach(eventName => {
      window.addEventListener(
        eventName,afterNavigation
      );

      document.addEventListener(
        eventName,afterNavigation
      );
    });

    document.addEventListener("click",event => {
      if (!(event.target instanceof Element)) return;

      if (event.target.closest(
        "#manaV83Tabs .mana-v83-tab"
      )) {
        afterNavigation();
      }

      if (event.target.closest(
        "[data-v933-support-chat], " +
        "#manaV936Support"
      )) {
        scheduleSupport();
        setTimeout(scheduleSupport,200);
      }
    });

    window.addEventListener(
      "pageshow",afterNavigation
    );

    afterNavigation();

    window.MANA_LYFE_ROUTINE_BUILD = BUILD;

    console.log(
      "MANA LYFE ROUTINE + RECLAIM",
      BUILD
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
