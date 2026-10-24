
/* ============================================
   MANA MOVEMENT TRAINING
   MANA 28 WORKOUT PROGRESS LINK
   BUILD 103220

   FIX
   Progress now reads the real date a
   workout was completed, rather than
   only its scheduled program date.

   Daily:    Completed today
   Weekly:   Completed in selected week
   Monthly:  Completed in selected month
   To Date:  All completed program sessions

   PRESERVES
   - Mana 28 workout records
   - Existing workout completion controls
   - Fuel Recovery connection
   - Water blue
   - Recovery purple
   - Other progress bars
   - All other programs
   ============================================ */

(() => {
  "use strict";

  const BUILD = "103220";

  const PROGRAM_KEY =
    "mana-v973-mana28-state";

  const ROOT =
    "#manaV83Content .mana-v981-root";

  if (window.MANA28_WORKOUT_PROGRESS_LINK === BUILD) {
    return;
  }

  /* =====================================
     STORAGE
     ===================================== */

  function readState() {
    try {
      const state = JSON.parse(
        localStorage.getItem(PROGRAM_KEY) || "{}"
      );

      return state &&
        typeof state === "object"
        ? state
        : {};
    } catch (_) {
      return {};
    }
  }

  /* =====================================
     DATE HELPERS
     ===================================== */

  function startOfDay(value) {
    const date = new Date(value);
    date.setHours(0,0,0,0);
    return date;
  }

  function endOfDay(value) {
    const date = new Date(value);
    date.setHours(23,59,59,999);
    return date;
  }

  function addDays(value,days) {
    const date = startOfDay(value);
    date.setDate(date.getDate()+days);
    return date;
  }

  function validDate(value) {
    if (!value) return null;

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? null
      : date;
  }

  function clamp(value,min,max) {
    return Math.max(
      min,
      Math.min(max,Number(value) || 0)
    );
  }

  /* =====================================
     ACTUAL COMPLETION RECORDS

     Uses the same saved data as the
     existing Mana 28 workout module.
     ===================================== */

  function completionRecords(state) {
    const completed = Array.isArray(
      state.completed
    ) ? state.completed : [];

    const seen = new Set();

    return completed
      .map(value => {
        const day = Number(value);

        if (
          !Number.isInteger(day) ||
          day < 1 ||
          day > 28 ||
          seen.has(day)
        ) {
          return null;
        }

        seen.add(day);

        const record =
          state["day"+day] || {};

        const completedAt = validDate(
          record.completedAt ||
          record.date
        );

        return {
          day,
          completedAt
        };
      })
      .filter(Boolean);
  }

  /* =====================================
     PROGRAM START

     Preserve the existing startedAt date
     whenever it is available.
     ===================================== */

  function programStart(state,records) {
    const explicit = validDate(
      state.startedAt
    );

    if (explicit) {
      return startOfDay(explicit);
    }

    const inferred = records
      .filter(record => record.completedAt)
      .map(record =>
        addDays(
          record.completedAt,
          -(record.day-1)
        )
      )
      .sort((a,b) => a-b);

    return inferred[0] ||
      startOfDay(new Date());
  }

  /* =====================================
     SELECTED PROGRESS PERIOD
     ===================================== */

  function selectedPeriod(root) {
    return root.querySelector(
      ".mana-v981-period.active"
    )?.dataset.v981Period || "daily";
  }

  function getRange(period,start) {
    const today = startOfDay(new Date());

    let first = today;
    let last = today;
    let target = 1;

    if (period === "weekly") {
      const programDay = Math.floor(
        (today-start)/86400000
      ) + 1;

      const weekIndex = Math.floor(
        (clamp(programDay,1,28)-1)/7
      );

      first = addDays(start,weekIndex*7);
      last = addDays(first,6);
      target = 7;
    }

    if (period === "monthly") {
      const monthStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

      const monthEnd = new Date(
        today.getFullYear(),
        today.getMonth()+1,
        0
      );

      first = monthStart < start
        ? start
        : monthStart;

      const finish = addDays(start,27);

      last = monthEnd > finish
        ? finish
        : monthEnd;

      target = Math.max(
        0,
        Math.round(
          (last-first)/86400000
        )+1
      );
    }

    if (
      period === "todate" ||
      period === "to-date" ||
      period === "total"
    ) {
      first = start;
      last = addDays(start,27);
      target = 28;
    }

    return {
      first:startOfDay(first),
      last:endOfDay(last),
      target
    };
  }

  /* =====================================
     CALCULATE WORKOUT COMPLETION

     Calendar time for Daily/Weekly/Monthly.
     All saved completed sessions for
     To Date.
     ===================================== */

  function calculate(period) {
    const state = readState();
    const records = completionRecords(state);
    const start = programStart(state,records);

    const range = getRange(period,start);

    const isTotal = [
      "todate",
      "to-date",
      "total"
    ].includes(period);

    const count = isTotal
      ? records.length
      : records.filter(record =>
          record.completedAt &&
          record.completedAt >= range.first &&
          record.completedAt <= range.last
        ).length;

    const target = range.target;

    const percent = target > 0
      ? clamp(
          Math.round(count/target*100),
          0,
          100
        )
      : 0;

    return {
      count,
      target,
      percent
    };
  }

  /* =====================================
     UPDATE WORKOUTS CARD ONLY

     Workouts is the first Progress metric.
     No Fuel or Recovery elements touched.
     ===================================== */

  function refresh() {
    const root = document.querySelector(ROOT);

    if (!root) return;

    const card = root.querySelector(
      ".mana-v981-grid > " +
      ".mana-v981-card:first-child"
    );

    if (!card) return;

    const period = selectedPeriod(root);
    const result = calculate(period);

    const value = card.querySelector(
      ".mana-v981-value"
    );

    const detail = card.querySelector(
      ".mana-v981-sub"
    );

    const track = card.querySelector(
      ".mana-v981-bar"
    );

    const fill = track?.querySelector("span");

    const percentageText =
      result.percent+"%";

    if (
      value &&
      value.textContent.trim() !== percentageText
    ) {
      value.textContent = percentageText;
    }

    const detailText =
      result.count+
      " of "+
      result.target+
      " program workouts completed";

    if (
      detail &&
      detail.textContent.trim() !== detailText
    ) {
      detail.textContent = detailText;
    }

    if (track) {
      track.style.setProperty(
        "background",
        "rgba(69,199,131,.22)",
        "important"
      );
    }

    if (fill) {
      fill.style.setProperty(
        "width",
        result.percent+"%",
        "important"
      );

      fill.style.setProperty(
        "background",
        "linear-gradient(90deg,#278b57,#45c783)",
        "important"
      );
    }
  }

  /* =====================================
     SAFE REFRESH

     Respond to the original Progress
     renderer and completion events.

     Do not rebuild the page.
     ===================================== */

  let queued = false;

  function scheduleRefresh() {
    if (queued) return;

    queued = true;

    requestAnimationFrame(() => {
      queued = false;
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
          const progressRebuilt = records.some(
            record =>
              Array.from(record.addedNodes)
                .some(node =>
                  node.nodeType === 1 &&
                  (
                    node.matches?.(".mana-v981-root") ||
                    node.querySelector?.(
                      ".mana-v981-root"
                    )
                  )
                )
          );

          if (progressRebuilt) {
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
      "mana:workout-progress-change",
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

          setTimeout(
            scheduleRefresh,
            180
          );
        }
      }
    );

    window.addEventListener(
      "pageshow",
      scheduleRefresh
    );

    scheduleRefresh();

    window.MANA28_WORKOUT_PROGRESS_LINK =
      BUILD;

    console.log(
      "Mana 28 Workout Progress",
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
