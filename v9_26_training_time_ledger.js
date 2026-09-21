/* =========================================
   MANA MOVEMENT TRAINING v9.26.0
   TRAINING TIME LEDGER

   PURPOSE
   - RECORDS WORKOUT TIME IN ITS OWN LEDGER
   - DOES NOT DEPEND ON THE WORKOUT LOG SAVE ORDER
   - READS THE EXISTING v9.20 TIMER STATE
   - CAPTURES TIME WHEN COMPLETE WORKOUT IS PRESSED
   - UPDATES PROGRESS:
       TRAINING TIME
       AVG SESSION
   - SUPPORTS:
       DAILY
       WEEKLY
       MONTHLY
       TO DATE
   - DOES NOT TOUCH:
       PBs
       VOLUME
       FUEL
       LEARN
       WORKOUT PROGRAMMING
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "92600";

  const STATE_KEY =
    "mana-strength-v920-in-progress";

  const LEDGER_KEY =
    "mana-strength-v926-time-ledger";

  const PENDING_KEY =
    "mana-strength-v926-pending-entry";

  let refreshTimer =
    null;

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

  function loadState() {
    return safeJson(
      localStorage.getItem(
        STATE_KEY
      ) || "null",
      null
    );
  }

  function loadLedger() {
    const ledger =
      safeJson(
        localStorage.getItem(
          LEDGER_KEY
        ) || "[]",
        []
      );

    return Array.isArray(
      ledger
    )
      ? ledger
      : [];
  }

  function saveLedger(
    ledger
  ) {
    try {
      localStorage.setItem(
        LEDGER_KEY,
        JSON.stringify(
          Array.isArray(
            ledger
          )
            ? ledger
            : []
        )
      );
    } catch (_) {}
  }

  function loadPending() {
    return safeJson(
      localStorage.getItem(
        PENDING_KEY
      ) || "null",
      null
    );
  }

  function savePending(
    entry
  ) {
    try {
      if (entry) {
        localStorage.setItem(
          PENDING_KEY,
          JSON.stringify(
            entry
          )
        );
      } else {
        localStorage.removeItem(
          PENDING_KEY
        );
      }
    } catch (_) {}
  }

  function startOfDay(
    d = new Date()
  ) {
    return new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate()
    );
  }

  function startOfWeek(
    d = new Date()
  ) {
    const x =
      startOfDay(
        d
      );

    x.setDate(
      x.getDate() -
      (
        (
          x.getDay() +
          6
        ) %
        7
      )
    );

    return x;
  }

  function startOfMonth(
    d = new Date()
  ) {
    return new Date(
      d.getFullYear(),
      d.getMonth(),
      1
    );
  }

  function addDays(
    d,
    n
  ) {
    const x =
      new Date(
        d
      );

    x.setDate(
      x.getDate() +
      n
    );

    return x;
  }

  function addMonths(
    d,
    n
  ) {
    return new Date(
      d.getFullYear(),
      d.getMonth() +
      n,
      1
    );
  }

  function elapsedMs(
    state
  ) {
    if (!state) {
      return 0;
    }

    let elapsed =
      Number(
        state.elapsedMs ||
        0
      );

    if (
      state.running &&
      state.segmentStartedAt
    ) {
      elapsed +=
        Math.max(
          0,
          Date.now() -
          Number(
            state.segmentStartedAt
          )
        );
    }

    return elapsed;
  }

  function formatDuration(
    seconds
  ) {
    const total =
      Math.max(
        0,
        Math.round(
          Number(
            seconds ||
            0
          )
        )
      );

    if (!total) {
      return "Not tracked";
    }

    const minutes =
      Math.floor(
        total /
        60
      );

    const remaining =
      total %
      60;

    if (
      minutes >=
      60
    ) {
      const hours =
        Math.floor(
          minutes /
          60
        );

      const mins =
        minutes %
        60;

      return mins
        ? `${hours}h ${mins}m`
        : `${hours}h`;
    }

    if (
      minutes >
      0
    ) {
      return `${minutes}m ${remaining}s`;
    }

    return `${remaining}s`;
  }

  function makeEntry() {
    const state =
      loadState();

    if (!state) {
      return null;
    }

    const now =
      Date.now();

    const durationSeconds =
      Math.max(
        1,
        Math.round(
          elapsedMs(
            state
          ) /
          1000
        )
      );

    const startedAt =
      state.startedAtISO ||
      new Date(
        Number(
          state.startedAt ||
          now
        )
      ).toISOString();

    const finishedAt =
      new Date(
        now
      ).toISOString();

    return {
      id:
        [
          "mana-time",
          Number(
            state.dayIndex ??
            -1
          ),
          now
        ].join("-"),

      dayIndex:
        Number(
          state.dayIndex ??
          -1
        ),

      startedAt,

      finishedAt,

      date:
        finishedAt,

      durationSeconds,

      recordedAt:
        now
    };
  }

  function commitEntry(
    entry
  ) {
    if (
      !entry ||
      !Number(
        entry.durationSeconds
      )
    ) {
      return false;
    }

    const ledger =
      loadLedger();

    const duplicate =
      ledger.some(
        item =>
          item?.id ===
          entry.id
      );

    if (
      duplicate
    ) {
      return true;
    }

    ledger.push(
      entry
    );

    const trimmed =
      ledger
        .slice(
          -2000
        );

    saveLedger(
      trimmed
    );

    window.dispatchEvent(
      new CustomEvent(
        "mana:training-time-updated",
        {
          detail: {
            durationSeconds:
              entry.durationSeconds,

            dayIndex:
              entry.dayIndex,

            date:
              entry.date
          }
        }
      )
    );

    return true;
  }

  function captureCompletion() {
    document.addEventListener(
      "click",
      event => {

        if (
          !event.target.closest(
            "#manaV64Complete"
          )
        ) {
          return;
        }

        const entry =
          makeEntry();

        if (!entry) {
          return;
        }

        savePending(
          entry
        );

        commitEntry(
          entry
        );

        savePending(
          null
        );

        scheduleRefresh(
          60
        );

        scheduleRefresh(
          400
        );

        scheduleRefresh(
          1200
        );

      },
      true
    );
  }

  function recoverPending() {
    const pending =
      loadPending();

    if (!pending) {
      return;
    }

    commitEntry(
      pending
    );

    savePending(
      null
    );
  }

  function activeRange() {
    const active =
      document.querySelector(
        "[data-v9170-range].active, [data-v9181-range].active"
      );

    return (
      active?.dataset
        ?.v9170Range ||
      active?.dataset
        ?.v9181Range ||
      "weekly"
    );
  }

  function rangeWindow() {
    const now =
      new Date();

    const range =
      activeRange();

    if (
      range ===
      "daily"
    ) {
      const start =
        startOfDay(
          now
        );

      return {
        start,

        end:
          addDays(
            start,
            1
          )
      };
    }

    if (
      range ===
      "monthly"
    ) {
      const start =
        startOfMonth(
          now
        );

      return {
        start,

        end:
          addMonths(
            start,
            1
          )
      };
    }

    if (
      range ===
      "all"
    ) {
      return {
        start:
          new Date(
            0
          ),

        end:
          addDays(
            startOfDay(
              now
            ),
            1
          )
      };
    }

    const start =
      startOfWeek(
        now
      );

    return {
      start,

      end:
        addDays(
          start,
          7
        )
    };
  }

  function entriesInRange() {
    const {
      start,
      end
    } =
      rangeWindow();

    return loadLedger()
      .filter(
        entry => {

          const d =
            new Date(
              entry?.date ||
              entry?.finishedAt ||
              0
            );

          return (
            !Number.isNaN(
              d.getTime()
            ) &&
            d >=
            start &&
            d <
            end
          );

        }
      );
  }

  function timingStats() {
    const entries =
      entriesInRange();

    const total =
      entries.reduce(
        (
          sum,
          entry
        ) =>
          sum +
          Math.max(
            0,
            Number(
              entry?.durationSeconds ||
              0
            )
          ),
        0
      );

    return {
      entries,

      total,

      average:
        entries.length
          ? total /
            entries.length
          : 0
    };
  }

  function findStatCard(
    labelText
  ) {
    const cards =
      [
        ...document.querySelectorAll(
          ".mana-v9170-stat, .mana-v9181-stat"
        )
      ];

    return cards.find(
      card => {

        const label =
          card.querySelector(
            ".mana-v9170-stat-label, .mana-v9181-stat-label"
          );

        return (
          label
            ?.textContent
            ?.trim()
            ?.toLowerCase() ===
          labelText
            .toLowerCase()
        );

      }
    ) || null;
  }

  function updateCard(
    label,
    value,
    sub
  ) {
    const card =
      findStatCard(
        label
      );

    if (!card) {
      return;
    }

    const valueEl =
      card.querySelector(
        ".mana-v9170-stat-value, .mana-v9181-stat-value"
      );

    const subEl =
      card.querySelector(
        ".mana-v9170-stat-sub, .mana-v9181-stat-sub"
      );

    if (
      valueEl
    ) {
      valueEl.textContent =
        value;
    }

    if (
      subEl
    ) {
      subEl.textContent =
        sub;
    }
  }

  function progressOpen() {
    const shell =
      document.getElementById(
        "manaV83ProgramShell"
      );

    const tab =
      document.querySelector(
        "#manaV83Tabs .mana-v83-tab.active"
      );

    return Boolean(
      shell?.classList
        .contains(
          "open"
        ) &&
      tab?.dataset
        ?.v83Tab ===
        "progress"
    );
  }

  function updateProgressCards() {
    if (
      !progressOpen()
    ) {
      return;
    }

    const stats =
      timingStats();

    if (
      !stats.entries.length
    ) {
      return;
    }

    updateCard(
      "Training time",
      formatDuration(
        stats.total
      ),
      `${stats.entries.length} timed workout${
        stats.entries.length ===
        1
          ? ""
          : "s"
      }`
    );

    updateCard(
      "Avg session",
      formatDuration(
        stats.average
      ),
      "Average timed session"
    );
  }

  function scheduleRefresh(
    delay = 100
  ) {
    clearTimeout(
      refreshTimer
    );

    refreshTimer =
      setTimeout(
        updateProgressCards,
        delay
      );
  }

  function watchProgress() {
    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "[data-v9170-range], [data-v9181-range]"
          )
        ) {
          setTimeout(
            updateProgressCards,
            80
          );

          setTimeout(
            updateProgressCards,
            250
          );
        }

        if (
          event.target.closest(
            '#manaV83Tabs [data-v83-tab="progress"]'
          )
        ) {
          setTimeout(
            updateProgressCards,
            180
          );

          setTimeout(
            updateProgressCards,
            450
          );
        }

      },
      true
    );

    window.addEventListener(
      "mana:program-tab-change",
      () => {

        setTimeout(
          updateProgressCards,
          180
        );

      }
    );

    window.addEventListener(
      "mana:training-time-updated",
      () => {

        setTimeout(
          updateProgressCards,
          80
        );

      }
    );

    window.addEventListener(
      "focus",
      () => {

        setTimeout(
          updateProgressCards,
          120
        );

      }
    );

    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.visibilityState ===
          "visible"
        ) {
          setTimeout(
            updateProgressCards,
            150
          );
        }

      }
    );

    const observer =
      new MutationObserver(
        () => {

          if (
            progressOpen()
          ) {
            scheduleRefresh(
              100
            );
          }

        }
      );

    observer.observe(
      document.body,
      {
        childList:
          true,

        subtree:
          true
      }
    );
  }

  function init() {
    recoverPending();

    captureCompletion();

    watchProgress();

    [
      400,
      900,
      1600,
      2600
    ].forEach(
      delay => {

        setTimeout(
          updateProgressCards,
          delay
        );

      }
    );
  }

  window.MANA_TRAINING_TIME_LEDGER_BUILD =
    BUILD;

  window.getManaTrainingTimeLedger =
    loadLedger;

  window.refreshManaTrainingTime =
    updateProgressCards;

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
