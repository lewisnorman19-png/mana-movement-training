
/* ============================================
   MANA MOVEMENT TRAINING
   MANA 28 — FUEL RECOVERY LINK
   BUILD 103210

   PURPOSE
   - Read the same Recovery score as Fuel
   - Score is 0–10
   - Display percentage on Mana 28 Progress
   - Support Daily, Weekly, Monthly, To Date
   - Preserve all existing progress colours
   - Preserve workouts, nutrition and history

   STORED RECOVERY SOURCE:
   mana-strength-v866-daily

   Previous Mana 28 Progress used
   recoveryHours. This links the display
   to the current Fuel Recovery score.
   ============================================ */

(() => {
  "use strict";

  const BUILD = "103210";

  const DAILY_KEY =
    "mana-strength-v866-daily";

  const PROGRAM_KEY =
    "mana-v973-mana28-state";

  const ROOT_SELECTOR =
    "#manaV83Content .mana-v981-root";

  if (
    window.MANA28_RECOVERY_LINK === BUILD
  ) {
    return;
  }

  /* =====================================
     HELPERS
     ===================================== */

  function readJSON(key) {
    try {
      return JSON.parse(
        localStorage.getItem(key) || "{}"
      ) || {};
    } catch (_) {
      return {};
    }
  }

  function clamp(value,min,max) {
    return Math.max(
      min,
      Math.min(max,Number(value) || 0)
    );
  }

  function startOfDay(value) {
    const date = new Date(value);
    date.setHours(0,0,0,0);
    return date;
  }

  function addDays(value,days) {
    const date = startOfDay(value);
    date.setDate(date.getDate() + days);
    return date;
  }

  function dateKey(date) {
    return [
      date.getFullYear(),
      String(date.getMonth()+1).padStart(2,"0"),
      String(date.getDate()).padStart(2,"0")
    ].join("-");
  }

  function validDate(value) {
    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? null
      : startOfDay(date);
  }

  /* =====================================
     MATCH FUEL RECOVERY LOGIC
     ===================================== */

  function recoveryScore(day) {
    if (
      !day ||
      typeof day !== "object"
    ) {
      return 0;
    }

    const score = day.recoveryScore;

    if (
      score !== null &&
      score !== undefined &&
      score !== "" &&
      Number.isFinite(Number(score))
    ) {
      return clamp(score,0,10);
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

    if (
      level === "moderate"
    ) return 5;

    if (
      level === "needs-attention" ||
      level === "low"
    ) return 3;

    return 0;
  }

  /* =====================================
     PROGRAM START

     Honour the same startedAt field
     as the original Mana 28 module.
     ===================================== */

  function programStart() {
    const state = readJSON(PROGRAM_KEY);

    const explicit = state.startedAt
      ? validDate(state.startedAt)
      : null;

    if (explicit) {
      return explicit;
    }

    const inferred = [];

    if (Array.isArray(state.completed)) {
      state.completed.forEach(dayNumber => {
        const number = Number(dayNumber);

        if (
          !Number.isInteger(number) ||
          number < 1 ||
          number > 28
        ) return;

        const record =
          state["day"+number] || {};

        const date = validDate(
          record.completedAt ||
          record.date ||
          ""
        );

        if (date) {
          inferred.push(
            addDays(date,-(number-1))
          );
        }
      });
    }

    if (inferred.length) {
      inferred.sort((a,b) => a-b);
      return inferred[0];
    }

    return startOfDay(new Date());
  }

  /* =====================================
     DETECT CURRENT PROGRESS PERIOD
     ===================================== */

  function selectedPeriod(root) {
    return root.querySelector(
      ".mana-v981-period.active"
    )?.dataset.v981Period || "daily";
  }

  function periodDates(period) {
    const today = startOfDay(new Date());
    const programStartDate = programStart();
    const programEnd = addDays(
      programStartDate,27
    );

    let first = today;
    let last = today;

    if (period === "weekly") {
      const dayNumber = Math.floor(
        (today-programStartDate)/86400000
      ) + 1;

      const safeDay = clamp(
        dayNumber,1,28
      );

      const weekIndex = Math.floor(
        (safeDay-1)/7
      );

      first = addDays(
        programStartDate,
        weekIndex*7
      );

      last = addDays(first,6);
    }

    if (period === "monthly") {
      first = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

      last = new Date(
        today.getFullYear(),
        today.getMonth()+1,
        0
      );
    }

    if (
      period === "todate" ||
      period === "to-date" ||
      period === "total"
    ) {
      first = programStartDate;
      last = programEnd;
    }

    if (first < programStartDate) {
      first = programStartDate;
    }

    if (last > programEnd) {
      last = programEnd;
    }

    if (last > today) {
      last = today;
    }

    const dates = [];

    for (
      let day = new Date(first);
      day <= last;
      day = addDays(day,1)
    ) {
      dates.push(dateKey(day));
    }

    return dates;
  }

  /* =====================================
     CALCULATE RECOVERY

     7/10 = 70%

     Periods use the average of each
     elapsed program day's Recovery score.
     ===================================== */

  function calculate(period) {
    const daily = readJSON(DAILY_KEY);
    const dates = periodDates(period);

    if (!dates.length) {
      return {
        percentage:0,
        score:0,
        days:0
      };
    }

    let total = 0;

    dates.forEach(key => {
      total += recoveryScore(
        daily[key] || {}
      );
    });

    const average = total / dates.length;

    return {
      percentage:Math.round(
        average*10
      ),
      score:Math.round(
        average*10
      )/10,
      days:dates.length
    };
  }

  /* =====================================
     UPDATE ONLY RECOVERY CARD

     Mana 28 actual card order:
     1 Workouts
     2 Water
     3 Recovery
     4 Calories
     5 Protein
     ===================================== */

  function refresh() {
    const root = document.querySelector(
      ROOT_SELECTOR
    );

    if (!root) return;

    const card = root.querySelector(
      ".mana-v981-grid > " +
      ".mana-v981-card:nth-child(3)"
    );

    if (!card) return;

    const period = selectedPeriod(root);
    const result = calculate(period);

    const percentage = card.querySelector(
      ".mana-v981-value"
    );

    const detail = card.querySelector(
      ".mana-v981-sub"
    );

    const track = card.querySelector(
      ".mana-v981-bar"
    );

    const fill = track?.querySelector("span");

    const percentText =
      result.percentage + "%";

    if (
      percentage &&
      percentage.textContent.trim() !== percentText
    ) {
      percentage.textContent = percentText;
    }

    const detailText =
      period === "daily"
        ? result.score + " / 10 recovery"
        : result.score +
          " / 10 average recovery across " +
          result.days + " days";

    if (
      detail &&
      detail.textContent.trim() !== detailText
    ) {
      detail.textContent = detailText;
    }

    if (track) {
      track.style.setProperty(
        "background",
        "rgba(167,123,255,.22)",
        "important"
      );
    }

    if (fill) {
      fill.style.setProperty(
        "width",
        result.percentage + "%",
        "important"
      );

      fill.style.setProperty(
        "background",
        "linear-gradient(90deg,#6f49bb,#a77bff)",
        "important"
      );
    }
  }

  /* =====================================
     REFRESH SAFELY

     Progress is redrawn by the original
     Mana 28 module when period changes.

     Observe only the Progress content,
     not the whole application.
     ===================================== */

  let pending = false;

  function scheduleRefresh() {
    if (pending) return;

    pending = true;

    requestAnimationFrame(() => {
      pending = false;
      refresh();
    });
  }

  function init() {
    const holder = document.getElementById(
      "manaV83Content"
    );

    if (holder) {
      const observer = new MutationObserver(
        records => {
          const changed = records.some(record =>
            Array.from(record.addedNodes).some(node =>
              node.nodeType === 1 &&
              (
                node.matches?.(".mana-v981-root") ||
                node.querySelector?.(".mana-v981-root")
              )
            )
          );

          if (changed) {
            scheduleRefresh();
          }
        }
      );

      observer.observe(holder,{
        childList:true,
        subtree:true
      });
    }

    [
      "mana:recovery-updated",
      "mana:fuel-updated",
      "mana:program-tab-change",
      "mana:program-change"
    ].forEach(name => {
      window.addEventListener(
        name,scheduleRefresh
      );

      document.addEventListener(
        name,scheduleRefresh
      );
    });

    document.addEventListener(
      "click",
      event => {
        if (!(event.target instanceof Element)) {
          return;
        }

        if (event.target.closest(
          "[data-v981-period], " +
          "#manaV83Tabs .mana-v83-tab"
        )) {
          scheduleRefresh();
          setTimeout(scheduleRefresh,180);
        }
      }
    );

    window.addEventListener(
      "pageshow",scheduleRefresh
    );

    scheduleRefresh();

    window.MANA28_RECOVERY_LINK = BUILD;

    console.log(
      "MANA 28 RECOVERY LINK",
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
