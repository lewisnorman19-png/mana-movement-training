/* =========================================
   MANA MOVEMENT TRAINING v9.10.7
   STRENGTH OVERVIEW — SIMPLE / STABLE

   OVERVIEW:
   - SIMPLE TODAY'S TRAINING CARD
   - VIEW PROGRAM BUTTON
   - TODAY'S FOCUS
   - WEEKLY SNAPSHOT
   - COACH SUPPORT / MEMBERSHIP

   STABILITY:
   - WORKS ON LAPTOP + PHONE
   - NO EXERCISE TABLE ON OVERVIEW
   - NO DIRECT WORKOUT LAUNCH FROM OVERVIEW
   - NO MUTATION OBSERVER
   - NO CONTINUOUS LOOP
   - BOUNDED SELF-CHECKS ONLY
   - DOES NOT TOUCH DOM IF LAYOUT IS ALREADY CORRECT
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "91007";

  const PROGRAM_KEY =
    "mana-strength-v62-program";

  const LOG_KEY =
    "mana-strength-v64-logs";

  const STYLE_ID =
    "mana-v9107-overview-style";

  const WEEKLY_ID =
    "manaV9107Weekly";

  const PROGRAM_BUTTON_ID =
    "manaV9107Program";

  let applying =
    false;

  let queueTimer =
    null;

  let repairGeneration =
    0;

  function safeJson(
    raw,
    fallback
  ) {
    try {
      return JSON.parse(
        raw
      );
    } catch (_) {
      return fallback;
    }
  }

  function loadProgram() {
    return safeJson(
      localStorage.getItem(
        PROGRAM_KEY
      ) || "null",
      null
    );
  }

  function loadLogs() {
    const logs =
      safeJson(
        localStorage.getItem(
          LOG_KEY
        ) || "[]",
        []
      );

    return Array.isArray(
      logs
    )
      ? logs
      : [];
  }

  function strengthOverviewOpen() {
    const shell =
      document.getElementById(
        "manaV83ProgramShell"
      );

    const title =
      document.getElementById(
        "manaV83Title"
      );

    const tab =
      document.querySelector(
        "#manaV83Tabs .mana-v83-tab.active"
      );

    return Boolean(
      shell
        ?.classList
        .contains(
          "open"
        ) &&

      title
        ?.textContent
        ?.trim()
        ?.toUpperCase() ===
        "MANA STRENGTH" &&

      tab
        ?.dataset
        ?.v83Tab ===
        "overview"
    );
  }

  function dateFromLog(
    log
  ) {
    const raw =
      log?.date ||
      log?.created_at ||
      log?.completedAt ||
      log?.completed_at;

    if (!raw) {
      return null;
    }

    const date =
      new Date(
        raw
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return null;
    }

    return date;
  }

  function startOfWeek() {
    const now =
      new Date();

    const date =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

    const weekday =
      date.getDay();

    const offset =
      weekday === 0
        ? 6
        : weekday - 1;

    date.setDate(
      date.getDate() -
      offset
    );

    date.setHours(
      0,
      0,
      0,
      0
    );

    return date;
  }

  function weeklyWorkoutTotals() {
    const program =
      loadProgram();

    const target =
      Math.max(
        1,
        Number(
          program?.days ||
          0
        ) ||
        Number(
          program?.sessions?.length ||
          0
        ) ||
        1
      );

    const weekStart =
      startOfWeek();

    const current =
      loadLogs()
        .filter(
          log => {

            const date =
              dateFromLog(
                log
              );

            return Boolean(
              date &&
              date >= weekStart
            );

          }
        )
        .length;

    return {
      current,
      target
    };
  }

  function percent(
    current,
    target
  ) {
    if (!target) {
      return 0;
    }

    return Math.max(
      0,
      Math.min(
        100,
        Math.round(
          Number(
            current || 0
          ) /
          Number(
            target || 1
          ) *
          100
        )
      )
    );
  }

  function injectStyles() {
    if (
      document.getElementById(
        STYLE_ID
      )
    ) {
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      STYLE_ID;

    style.textContent = `

      .mana-v9107-training{
        margin:14px 0;
        padding:22px 19px;
        border:1px solid #5b4d1f;
        border-radius:22px;
        background:
          linear-gradient(
            145deg,
            #191609,
            #0a0a0a
          );
      }

      .mana-v9107-training-label{
        color:#f3d875;
        font-size:10px;
        font-weight:900;
        letter-spacing:.13em;
      }

      .mana-v9107-training h3{
        margin:8px 0 7px;
        color:#fff;
        font-size:24px;
        line-height:1.15;
      }

      .mana-v9107-copy{
        margin:0;
        color:#aaa;
        font-size:12px;
        line-height:1.55;
      }

      .mana-v9107-program-btn{
        width:100%;
        min-height:54px;
        margin-top:17px;
        border:0;
        border-radius:15px;
        background:#f3d875;
        color:#111;
        font-size:13px;
        font-weight:900;
        letter-spacing:.03em;
      }

      .mana-v9107-program-btn:active{
        transform:scale(.99);
      }

      .mana-v9107-week{
        margin:14px 0;
        padding:18px;
        border:1px solid #292929;
        border-radius:21px;
        background:#0d0d0d;
      }

      .mana-v9107-week-head{
        display:flex;
        align-items:flex-end;
        justify-content:space-between;
        gap:10px;
        margin-bottom:14px;
      }

      .mana-v9107-week-head h3{
        margin:0;
        color:#fff;
        font-size:20px;
      }

      .mana-v9107-week-head span{
        color:#777;
        font-size:10px;
        letter-spacing:.08em;
      }

      .mana-v9107-week-row{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:14px;
        padding:12px 0 10px;
      }

      .mana-v9107-week-copy span{
        display:block;
        color:#888;
        font-size:10px;
      }

      .mana-v9107-week-copy strong{
        display:block;
        margin-top:3px;
        color:#f3d875;
        font-size:17px;
      }

      .mana-v9107-week-percent{
        color:#f3d875;
        font-size:22px;
        font-weight:900;
      }

      .mana-v9107-track{
        width:100%;
        height:7px;
        overflow:hidden;
        border-radius:999px;
        background:#242424;
      }

      .mana-v9107-fill{
        height:100%;
        border-radius:999px;
        background:#f3d875;
      }

      @media(max-width:390px){

        .mana-v9107-training{
          padding:19px 16px;
        }

        .mana-v9107-training h3{
          font-size:22px;
        }

      }

    `;

    document.head
      .appendChild(
        style
      );
  }

  function openProgramTab() {
    document
      .querySelector(
        '#manaV83Tabs [data-v83-tab="program"]'
      )
      ?.click();
  }

  function trainingCardCorrect() {
    const holder =
      document.getElementById(
        "manaV83Content"
      );

    if (!holder) {
      return false;
    }

    const card =
      holder.querySelector(
        ".mana-v9107-training"
      );

    const button =
      holder.querySelector(
        `#${PROGRAM_BUTTON_ID}`
      );

    const oldExerciseTable =
      holder.querySelector(
        ".mana-v9103-exercises"
      );

    const oldStartButton =
      holder.querySelector(
        "#manaV9103Start"
      );

    return Boolean(
      card &&
      button &&
      !oldExerciseTable &&
      !oldStartButton
    );
  }

  function buildTrainingCard() {
    const holder =
      document.getElementById(
        "manaV83Content"
      );

    if (!holder) {
      return;
    }

    if (
      trainingCardCorrect()
    ) {
      return;
    }

    const card =
      holder.querySelector(
        ".mana-v866-next"
      ) ||
      holder.querySelector(
        ".mana-v9103-workout"
      ) ||
      holder.querySelector(
        ".mana-v9107-training"
      );

    if (!card) {
      return;
    }

    card.className =
      "mana-v9107-training";

    card.innerHTML = `

      <div
        class="mana-v9107-training-label"
      >
        TODAY'S TRAINING
      </div>

      <h3>
        Ready to train?
      </h3>

      <p
        class="mana-v9107-copy"
      >
        Open your personalised program
        and choose the workout you want
        to complete today.
      </p>

      <button
        type="button"
        class="mana-v9107-program-btn"
        id="${PROGRAM_BUTTON_ID}"
      >
        VIEW PROGRAM →
      </button>

    `;

    document
      .getElementById(
        PROGRAM_BUTTON_ID
      )
      ?.addEventListener(
        "click",
        openProgramTab
      );

    const welcome =
      holder.querySelector(
        ".mana-v866-welcome"
      );

    if (
      welcome &&
      welcome.nextElementSibling !==
        card
    ) {
      welcome
        .insertAdjacentElement(
          "afterend",
          card
        );
    }
  }

  function moveDailyFocus() {
    const holder =
      document.getElementById(
        "manaV83Content"
      );

    const training =
      holder
        ?.querySelector(
          ".mana-v9107-training"
        );

    if (
      !holder ||
      !training
    ) {
      return;
    }

    const focus =
      Array
        .from(
          holder.querySelectorAll(
            ".mana-v866-section"
          )
        )
        .find(
          section =>
            section
              .querySelector(
                ".mana-v866-section-head h3"
              )
              ?.textContent
              ?.trim() ===
              "Today's Focus"
        );

    if (
      focus &&
      training.nextElementSibling !==
        focus
    ) {
      training
        .insertAdjacentElement(
          "afterend",
          focus
        );
    }
  }

  function buildWeeklySnapshot() {
    const holder =
      document.getElementById(
        "manaV83Content"
      );

    if (!holder) {
      return;
    }

    const focus =
      Array
        .from(
          holder.querySelectorAll(
            ".mana-v866-section"
          )
        )
        .find(
          section =>
            section
              .querySelector(
                ".mana-v866-section-head h3"
              )
              ?.textContent
              ?.trim() ===
              "Today's Focus"
        );

    if (!focus) {
      return;
    }

    const totals =
      weeklyWorkoutTotals();

    const progress =
      percent(
        totals.current,
        totals.target
      );

    let card =
      document.getElementById(
        WEEKLY_ID
      );

    if (!card) {
      card =
        document.createElement(
          "div"
        );

      card.id =
        WEEKLY_ID;

      card.className =
        "mana-v9107-week";
    }

    const expected =
      `${totals.current}/${totals.target}/${progress}`;

    if (
      card.dataset
        .manaSummary !==
      expected
    ) {
      card.dataset
        .manaSummary =
          expected;

      card.innerHTML = `

        <div
          class="mana-v9107-week-head"
        >
          <h3>
            Weekly Snapshot
          </h3>

          <span>
            TRAINING
          </span>
        </div>

        <div
          class="mana-v9107-week-row"
        >

          <div
            class="mana-v9107-week-copy"
          >
            <span>
              Workouts completed
            </span>

            <strong>
              ${totals.current}
              /
              ${totals.target}
            </strong>
          </div>

          <div
            class="mana-v9107-week-percent"
          >
            ${progress}%
          </div>

        </div>

        <div
          class="mana-v9107-track"
        >
          <div
            class="mana-v9107-fill"
            style="
              width:${progress}%;
            "
          ></div>
        </div>

      `;
    }

    if (
      focus.nextElementSibling !==
        card
    ) {
      focus
        .insertAdjacentElement(
          "afterend",
          card
        );
    }
  }

  function applyLayout() {
    if (
      applying ||
      !strengthOverviewOpen()
    ) {
      return;
    }

    applying =
      true;

    try {

      buildTrainingCard();

      moveDailyFocus();

      buildWeeklySnapshot();

    } finally {

      applying =
        false;

    }
  }

  function queueLayout(
    delay = 60
  ) {
    clearTimeout(
      queueTimer
    );

    queueTimer =
      setTimeout(
        applyLayout,
        delay
      );
  }

  function scheduleBoundedRepair() {
    const generation =
      ++repairGeneration;

    [
      0,
      100,
      260,
      600
    ].forEach(
      delay => {

        setTimeout(
          () => {

            if (
              generation !==
              repairGeneration
            ) {
              return;
            }

            if (
              !strengthOverviewOpen()
            ) {
              return;
            }

            if (
              trainingCardCorrect()
            ) {
              return;
            }

            applyLayout();

          },
          delay
        );

      }
    );
  }

  function watch() {
    [
      "mana:program-tab-change",
      "mana:strength-synced",
      "mana:profile-synced",
      "mana:strength-membership-change",
      "mana:workout-progress-change",
      "mana:workout-feedback-saved"
    ].forEach(
      eventName => {

        window.addEventListener(
          eventName,
          scheduleBoundedRepair
        );

      }
    );

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            '#manaV83Tabs [data-v83-tab="overview"]'
          ) ||
          event.target.closest(
            "#manaV83Back"
          ) ||
          event.target.closest(
            "#manaV80Strength"
          )
        ) {
          scheduleBoundedRepair();
        }

      },
      true
    );

    window.addEventListener(
      "pageshow",
      scheduleBoundedRepair
    );

    window.addEventListener(
      "focus",
      scheduleBoundedRepair
    );

    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.visibilityState ===
          "visible"
        ) {
          scheduleBoundedRepair();
        }

      }
    );

    window.addEventListener(
      "storage",
      event => {

        if (
          [
            PROGRAM_KEY,
            LOG_KEY
          ].includes(
            event.key
          )
        ) {
          scheduleBoundedRepair();
        }

      }
    );
  }

  function init() {
    injectStyles();

    watch();

    setTimeout(
      scheduleBoundedRepair,
      260
    );
  }

  window.MANA_STRENGTH_OVERVIEW_LAYOUT_BUILD =
    BUILD;

  window.refreshManaStrengthOverviewLayout =
    applyLayout;

  window.repairManaSimpleStrengthOverview =
    scheduleBoundedRepair;

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {

    init();

  }

})();
