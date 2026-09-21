/* =========================================
   MANA MOVEMENT TRAINING v9.26.1
   INDEPENDENT TRAINING TIME LEDGER

   WHOLE FILE REPLACEMENT FOR:
   v9_26_training_time_ledger.js

   PURPOSE
   - RUNS ITS OWN WORKOUT TIMER STATE
   - DOES NOT RELY ON v9.20 STATE BEING PRESENT AT COMPLETE
   - STARTS / RESUMES WHEN A STRENGTH WORKOUT OPENS
   - PAUSES WHEN THE WORKOUT IS PAUSED OR CLOSED
   - SAVES TIME IMMEDIATELY WHEN COMPLETE WORKOUT IS PRESSED
   - USES THE VISIBLE WORKOUT TIMER AS A BACKUP
   - UPDATES PROGRESS:
       TRAINING TIME
       AVG SESSION
   - SUPPORTS:
       DAILY
       WEEKLY
       MONTHLY
       TO DATE
   - DOES NOT CHANGE:
       WORKOUT LOGS
       PBs
       VOLUME
       FUEL
       LEARN
       PROGRAMMING
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "92610";

  const SESSION_KEY =
    "mana-strength-v926-session";

  const LEDGER_KEY =
    "mana-strength-v926-time-ledger";

  const PENDING_KEY =
    "mana-strength-v926-pending-entry";

  const WORKOUT_SHELL_ID =
    "manaStrengthV64Workout";

  const COMPLETE_ID =
    "manaV64Complete";

  const CLOSE_ID =
    "manaV64Close";

  const PAUSE_ID =
    "manaV920Pause";

  let refreshTimer =
    null;

  let wrapTimer =
    null;

  let observerTimer =
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

  function nowMs() {
    return Date.now();
  }

  function loadSession() {
    return safeJson(
      localStorage.getItem(
        SESSION_KEY
      ) || "null",
      null
    );
  }

  function saveSession(
    session
  ) {
    try {
      if (session) {
        localStorage.setItem(
          SESSION_KEY,
          JSON.stringify(
            session
          )
        );
      } else {
        localStorage.removeItem(
          SESSION_KEY
        );
      }
    } catch (_) {}
  }

  function clearSession() {
    saveSession(
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

  function workoutOpen() {
    return Boolean(
      document
        .getElementById(
          WORKOUT_SHELL_ID
        )
        ?.classList
        .contains(
          "open"
        )
    );
  }

  function sessionElapsedMs(
    session = loadSession()
  ) {
    if (!session) {
      return 0;
    }

    let elapsed =
      Number(
        session.elapsedMs ||
        0
      );

    if (
      session.running &&
      session.segmentStartedAt
    ) {
      elapsed +=
        Math.max(
          0,
          nowMs() -
          Number(
            session.segmentStartedAt
          )
        );
    }

    return Math.max(
      0,
      elapsed
    );
  }

  function createSession(
    dayIndex = null
  ) {
    const now =
      nowMs();

    return {
      dayIndex:
        Number.isFinite(
          Number(
            dayIndex
          )
        )
          ? Number(
              dayIndex
            )
          : null,

      startedAt:
        now,

      startedAtISO:
        new Date(
          now
        ).toISOString(),

      elapsedMs:
        0,

      running:
        true,

      segmentStartedAt:
        now,

      updatedAt:
        now
    };
  }

  function startOrResumeSession(
    dayIndex = null
  ) {
    const existing =
      loadSession();

    if (!existing) {
      saveSession(
        createSession(
          dayIndex
        )
      );

      return;
    }

    const incomingIndex =
      Number.isFinite(
        Number(
          dayIndex
        )
      )
        ? Number(
            dayIndex
          )
        : null;

    const existingIndex =
      Number.isFinite(
        Number(
          existing.dayIndex
        )
      )
        ? Number(
            existing.dayIndex
          )
        : null;

    if (
      incomingIndex !==
        null &&
      existingIndex !==
        null &&
      incomingIndex !==
        existingIndex
    ) {
      saveSession(
        createSession(
          incomingIndex
        )
      );

      return;
    }

    if (
      !existing.running
    ) {
      existing.running =
        true;

      existing.segmentStartedAt =
        nowMs();

      existing.updatedAt =
        nowMs();

      if (
        existing.dayIndex ===
          null &&
        incomingIndex !==
          null
      ) {
        existing.dayIndex =
          incomingIndex;
      }

      saveSession(
        existing
      );
    }
  }

  function pauseSession() {
    const session =
      loadSession();

    if (!session) {
      return;
    }

    session.elapsedMs =
      sessionElapsedMs(
        session
      );

    session.running =
      false;

    session.segmentStartedAt =
      null;

    session.updatedAt =
      nowMs();

    saveSession(
      session
    );
  }

  function visibleTimerSeconds() {
    const timer =
      document.getElementById(
        "manaV920Timer"
      ) ||
      document.getElementById(
        "manaV64Timer"
      ) ||
      document.getElementById(
        "manaV64NativeTimer"
      );

    const text =
      String(
        timer?.textContent ||
        ""
      ).trim();

    if (!text) {
      return 0;
    }

    const parts =
      text
        .split(":")
        .map(
          value =>
            Number(
              value
            )
        );

    if (
      parts.some(
        value =>
          !Number.isFinite(
            value
          )
      )
    ) {
      return 0;
    }

    if (
      parts.length ===
      2
    ) {
      return Math.max(
        0,
        parts[0] *
        60 +
        parts[1]
      );
    }

    if (
      parts.length ===
      3
    ) {
      return Math.max(
        0,
        parts[0] *
        3600 +
        parts[1] *
        60 +
        parts[2]
      );
    }

    return 0;
  }

  function durationAtCompletion(
    session
  ) {
    const independent =
      Math.max(
        0,
        Math.round(
          sessionElapsedMs(
            session
          ) /
          1000
        )
      );

    const visible =
      visibleTimerSeconds();

    return Math.max(
      1,
      independent,
      visible
    );
  }

  function makeLedgerEntry() {
    const session =
      loadSession();

    const now =
      nowMs();

    const visibleSeconds =
      visibleTimerSeconds();

    if (
      !session &&
      visibleSeconds <=
      0
    ) {
      return null;
    }

    const durationSeconds =
      session
        ? durationAtCompletion(
            session
          )
        : Math.max(
            1,
            visibleSeconds
          );

    const startedAtISO =
      session?.startedAtISO ||
      new Date(
        now -
        durationSeconds *
        1000
      ).toISOString();

    const finishedAtISO =
      new Date(
        now
      ).toISOString();

    return {
      id:
        [
          "mana-time",
          now,
          Math.round(
            durationSeconds
          )
        ].join("-"),

      dayIndex:
        Number.isFinite(
          Number(
            session?.dayIndex
          )
        )
          ? Number(
              session.dayIndex
            )
          : null,

      startedAt:
        startedAtISO,

      finishedAt:
        finishedAtISO,

      date:
        finishedAtISO,

      durationSeconds:
        Math.max(
          1,
          Math.round(
            durationSeconds
          )
        ),

      recordedAt:
        now,

      source:
        "mana-v92610-independent"
    };
  }

  function isDuplicateEntry(
    ledger,
    entry
  ) {
    if (
      ledger.some(
        item =>
          item?.id ===
          entry.id
      )
    ) {
      return true;
    }

    return ledger.some(
      item => {

        const a =
          Number(
            item?.recordedAt ||
            0
          );

        const b =
          Number(
            entry?.recordedAt ||
            0
          );

        const closeInTime =
          Math.abs(
            a -
            b
          ) <=
          15000;

        const similarDuration =
          Math.abs(
            Number(
              item?.durationSeconds ||
              0
            ) -
            Number(
              entry?.durationSeconds ||
              0
            )
          ) <=
          3;

        return (
          closeInTime &&
          similarDuration
        );

      }
    );
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

    if (
      isDuplicateEntry(
        ledger,
        entry
      )
    ) {
      return true;
    }

    ledger.push(
      entry
    );

    const trimmed =
      ledger.slice(
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

  function finishWorkoutTiming() {
    const entry =
      makeLedgerEntry();

    if (!entry) {
      return false;
    }

    savePending(
      entry
    );

    const saved =
      commitEntry(
        entry
      );

    if (
      saved
    ) {
      savePending(
        null
      );

      clearSession();

      scheduleRefresh(
        40
      );

      setTimeout(
        updateProgressCards,
        180
      );

      setTimeout(
        updateProgressCards,
        600
      );
    }

    return saved;
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

  function wrapWorkoutOpen() {
    const current =
      window
        .openManaStrengthWorkout;

    if (
      typeof current !==
      "function"
    ) {
      return;
    }

    if (
      current
        .__manaV926TimingWrapped
    ) {
      return;
    }

    const wrapped =
      function(
        dayIndex
      ) {
        startOrResumeSession(
          dayIndex
        );

        const result =
          current.apply(
            this,
            arguments
          );

        setTimeout(
          () => {

            if (
              workoutOpen()
            ) {
              startOrResumeSession(
                dayIndex
              );
            }

          },
          120
        );

        return result;
      };

    wrapped
      .__manaV926TimingWrapped =
        true;

    window
      .openManaStrengthWorkout =
        wrapped;
  }

  function watchWorkoutClicks() {
    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            `#${COMPLETE_ID}`
          )
        ) {
          finishWorkoutTiming();

          return;
        }

        if (
          event.target.closest(
            `#${PAUSE_ID}`
          )
        ) {
          pauseSession();

          return;
        }

        if (
          event.target.closest(
            `#${CLOSE_ID}`
          )
        ) {
          pauseSession();
        }

      },
      true
    );
  }

  function monitorWorkoutShell() {
    const observer =
      new MutationObserver(
        () => {

          clearTimeout(
            observerTimer
          );

          observerTimer =
            setTimeout(
              () => {

                wrapWorkoutOpen();

                if (
                  workoutOpen()
                ) {
                  startOrResumeSession(
                    null
                  );
                }

              },
              60
            );

        }
      );

    observer.observe(
      document.body,
      {
        childList:
          true,

        subtree:
          true,

        attributes:
          true,

        attributeFilter:
          [
            "class"
          ]
      }
    );
  }

  function keepOpenWrapperAlive() {
    clearInterval(
      wrapTimer
    );

    wrapWorkoutOpen();

    wrapTimer =
      setInterval(
        wrapWorkoutOpen,
        1200
      );
  }

  function activeRange() {
    const active =
      document.querySelector(
        "[data-v9170-range].active, " +
        "[data-v9181-range].active"
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
      return remaining
        ? `${minutes}m ${remaining}s`
        : `${minutes} min`;
    }

    return `${remaining}s`;
  }

  function findStatCard(
    labelText
  ) {
    const cards =
      [
        ...document.querySelectorAll(
          ".mana-v9170-stat, " +
          ".mana-v9181-stat"
        )
      ];

    return cards.find(
      card => {

        const label =
          card.querySelector(
            ".mana-v9170-stat-label, " +
            ".mana-v9181-stat-label"
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
        ".mana-v9170-stat-value, " +
        ".mana-v9181-stat-value"
      );

    const subEl =
      card.querySelector(
        ".mana-v9170-stat-sub, " +
        ".mana-v9181-stat-sub"
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
            "[data-v9170-range], " +
            "[data-v9181-range]"
          )
        ) {
          setTimeout(
            updateProgressCards,
            80
          );

          setTimeout(
            updateProgressCards,
            280
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
            500
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
          60
        );

        setTimeout(
          updateProgressCards,
          300
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

    wrapWorkoutOpen();

    keepOpenWrapperAlive();

    watchWorkoutClicks();

    monitorWorkoutShell();

    watchProgress();

    if (
      workoutOpen()
    ) {
      startOrResumeSession(
        null
      );
    }

    [
      300,
      700,
      1200,
      2200
    ].forEach(
      delay => {

        setTimeout(
          () => {

            wrapWorkoutOpen();

            if (
              workoutOpen()
            ) {
              startOrResumeSession(
                null
              );
            }

            updateProgressCards();

          },
          delay
        );

      }
    );
  }

  window.MANA_TRAINING_TIME_LEDGER_BUILD =
    BUILD;

  window.getManaTrainingTimeLedger =
    loadLedger;

  window.getManaIndependentWorkoutTimer =
    loadSession;

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
