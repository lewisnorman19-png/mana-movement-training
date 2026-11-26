
/*
 MANA MOVEMENT
 CARDIO / CORE PROGRESS SYNC
 BUILD 100220

 - Separate automated and coach workout totals
 - This-week Cardio/Core summaries
 - Coach Progress opens on Daily
 - No changes to workout records or save logic
*/

(() => {
  "use strict";

  const BUILD = "100220";
  const STYLE = "mana-progress-100220-style";
  const ROOT = "manaV993StrengthProgress";
  const COACH = "m1002CoachProgress";
  const AUTOMATED = "manaProgress220Automated";
  const ASSIGNED = "manaProgress220Coach";

  const $ = id => document.getElementById(id);

  let coachLogs = [];
  let coachUser = "";
  let coachLoadedAt = 0;
  let coachLoading = false;
  let coachError = "";
  let scheduled = false;
  let request = 0;

  function progressOpen() {
    return !!(
      $("manaV83ProgramShell")?.classList.contains("open") &&
      $("manaV83Title")?.textContent
        ?.trim().toUpperCase() === "MANA STRENGTH" &&
      document.querySelector(
        '#manaV83Tabs [data-v83-tab="progress"].active'
      ) &&
      $(ROOT)
    );
  }

  function isCoach() {
    return progressOpen() &&
      $(ROOT)?.classList.contains("m1002-show-coach");
  }

  function thisWeek(dateValue) {
    const value = new Date(dateValue);

    if (Number.isNaN(value.getTime())) return false;

    const now = new Date();
    const start = new Date(now);

    start.setDate(
      now.getDate() - (now.getDay() + 6) % 7
    );

    start.setHours(0, 0, 0, 0);

    return value >= start && value <= now;
  }

  function totals(records, dateField) {
    const result = {
      cardio: 0,
      core: 0,
      sessions: 0
    };

    records.forEach(record => {
      if (!thisWeek(
        record[dateField] ||
        record.completed_at ||
        record.date
      )) return;

      result.sessions++;

      const finishers = record.finishers || {};

      if (finishers.cardio?.completed) {
        result.cardio += Number(
          finishers.cardio.actualMinutes ??
          finishers.cardio.durationMinutes ??
          0
        ) || 0;
      }

      if (finishers.core?.completed) {
        result.core++;
      }
    });

    return result;
  }

  function automatedLogs() {
    try {
      const records = JSON.parse(
        localStorage.getItem(
          "mana-strength-v64-logs"
        ) || "[]"
      );

      return Array.isArray(records) ? records : [];
    } catch (_) {
      return [];
    }
  }

  function installStyle() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `
      .mana-progress220 {
        margin:13px 0 17px;
        padding:15px;
        background:#101113;
        border:1px solid #34383e;
        border-radius:16px;
        color:#fff;
      }

      .mana-progress220-title {
        color:#fff;
        font-size:13px;
        font-weight:900;
        margin-bottom:12px;
      }

      .mana-progress220-grid {
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:9px;
      }

      .mana-progress220-card {
        padding:12px;
        background:#17191c;
        border:1px solid #393e45;
        border-radius:12px;
      }

      .mana-progress220-label {
        color:#fff;
        font-size:11px;
        font-weight:900;
      }

      .mana-progress220-value {
        display:block;
        margin:8px 0;
        color:#fff;
        font-size:22px;
        font-weight:900;
      }

      .mana-progress220-sub {
        color:#aab1ba;
        font-size:10px;
      }

      .mana-progress220-track {
        height:5px;
        margin-top:12px;
        background:#303238;
        border-radius:999px;
        overflow:hidden;
      }

      .mana-progress220-fill {
        height:100%;
        background:#ff8126;
        border-radius:999px;
      }

      .mana-progress220-status {
        margin-top:9px;
        color:#aab1ba;
        font-size:10px;
        line-height:1.5;
      }

      /*
       Hide the previous automated finisher
       tracker only while the new one is mounted.
      */
      #${ROOT}:has(> #${AUTOMATED})
      > #mf430Progress {
        display:none!important;
      }
    `;

    document.head.appendChild(style);
  }

  function trackerHTML(data, source) {
    const cardioPercent = Math.min(
      100,
      Math.round(data.cardio / 45 * 100)
    );

    const corePercent = Math.min(
      100,
      Math.round(data.core / 3 * 100)
    );

    return `
      <div class="mana-progress220-title">
        Cardio & Core — This Week
      </div>

      <div class="mana-progress220-grid">
        <div class="mana-progress220-card">
          <div class="mana-progress220-label">
            ♥ CARDIO
          </div>

          <strong class="mana-progress220-value">
            ${data.cardio} min
          </strong>

          <div class="mana-progress220-sub">
            Weekly target: 45 min
          </div>

          <div class="mana-progress220-track">
            <div class="mana-progress220-fill"
              style="width:${cardioPercent}%">
            </div>
          </div>
        </div>

        <div class="mana-progress220-card">
          <div class="mana-progress220-label">
            ◎ CORE
          </div>

          <strong class="mana-progress220-value">
            ${data.core}
          </strong>

          <div class="mana-progress220-sub">
            Weekly target: 3 sessions
          </div>

          <div class="mana-progress220-track">
            <div class="mana-progress220-fill"
              style="width:${corePercent}%">
            </div>
          </div>
        </div>
      </div>

      <div class="mana-progress220-status">
        ${source}
        • ${data.sessions} workout
        ${data.sessions === 1 ? "record" : "records"}
        this week
      </div>
    `;
  }

  function updateAutomated() {
    const root = $(ROOT);
    if (!root || !progressOpen()) return;

    let element = $(AUTOMATED);

    if (!element) {
      element = document.createElement("section");
      element.id = AUTOMATED;
      element.className = "mana-progress220";
    }

    if (element.parentElement !== root) {
      const head = root.querySelector(
        ":scope > .mana-v993-head"
      );

      if (head) head.after(element);
      else root.prepend(element);
    }

    const data = totals(automatedLogs(), "date");

    const html = trackerHTML(
      data,
      "My Workouts"
    );

    if (element.innerHTML !== html) {
      element.innerHTML = html;
    }
  }

  function updateCoach() {
    const panel = $(COACH);
    if (!panel || !isCoach()) return;

    const content = panel.querySelector(
      '[data-m100216-root="true"]'
    );

    if (!content) return;

    let element = $(ASSIGNED);

    if (!element) {
      element = document.createElement("section");
      element.id = ASSIGNED;
      element.className = "mana-progress220";
    }

    if (element.parentElement !== content) {
      const periods = content.querySelector(
        ".mana-v993-periods"
      );

      if (periods) periods.after(element);
      else content.prepend(element);
    }

    if (coachLoading && !coachLoadedAt) {
      element.innerHTML =
        '<div class="mana-progress220-status">' +
        'Loading saved coach finishers…</div>';
      return;
    }

    if (coachError) {
      element.innerHTML =
        '<div class="mana-progress220-status">' +
        'Could not refresh Coach Programs: ' +
        coachError.replace(/[<>&]/g, "") +
        '</div>';
      return;
    }

    const data = totals(coachLogs, "completed_at");

    const html = trackerHTML(
      data,
      "Coach Programs"
    );

    if (element.innerHTML !== html) {
      element.innerHTML = html;
    }
  }

  async function fetchCoach(force = false) {
    if (coachLoading || !progressOpen()) return;

    if (
      !force &&
      coachLoadedAt &&
      Date.now() - coachLoadedAt < 15000
    ) return;

    if (
      typeof window.supabaseClient !== "function"
    ) {
      coachError = "Cloud connection unavailable";
      updateCoach();
      return;
    }

    coachLoading = true;
    coachError = "";

    const token = ++request;

    try {
      const client = await window.supabaseClient();
      const auth = await client.auth.getUser();
      const id = auth.data?.user?.id;

      if (!id) throw Error("Please sign in");

      const response = await client
        .from("coach_workout_logs")
        .select("completed_at,finishers,status")
        .eq("user_id", id)
        .eq("status", "completed")
        .order("completed_at", {
          ascending:false
        })
        .limit(500);

      if (response.error) throw response.error;
      if (token !== request) return;

      coachUser = id;
      coachLogs = response.data || [];
      coachLoadedAt = Date.now();

    } catch (error) {
      coachError = error.message || String(error);
    } finally {
      coachLoading = false;
      schedule();
    }
  }

  function selectCoachDaily() {
    if (!isCoach()) return;

    const button = $(COACH)?.querySelector(
      '[data-m100216-period="daily"]'
    );

    if (
      button &&
      !button.classList.contains("active")
    ) {
      button.click();
    }
  }

  function refresh() {
    if (!progressOpen()) return;

    updateAutomated();

    if (isCoach()) {
      updateCoach();
      void fetchCoach();
    }
  }

  function schedule() {
    if (scheduled) return;

    scheduled = true;

    setTimeout(() => {
      scheduled = false;
      refresh();
    }, 180);
  }

  function enterCoach() {
    setTimeout(() => {
      selectCoachDaily();
      void fetchCoach(true);
      schedule();
    }, 320);
  }

  function init() {
    installStyle();

    const holder = $("manaV83Content");

    if (holder) {
      new MutationObserver(mutations => {
        if (!progressOpen()) return;

        const replaced = mutations.some(m =>
          [...m.addedNodes].some(node =>
            node.nodeType === 1 &&
            (
              node.id === ROOT ||
              node.id === COACH ||
              node.querySelector?.(
                `#${COACH},[data-m100216-root]`
              )
            )
          )
        );

        if (replaced) schedule();
      }).observe(holder, {
        childList:true,
        subtree:true
      });
    }

    document.addEventListener(
      "click",
      event => {
        const target = event.target;

        if (!(target instanceof Element)) return;

        if (target.closest(
          '[data-m100216-view="coach"]'
        )) {
          enterCoach();
          return;
        }

        if (target.closest(
          '#manaV83Tabs [data-v83-tab="progress"]'
        )) {
          setTimeout(() => {
            selectCoachDaily();
            schedule();
          }, 350);
          return;
        }

        if (target.closest(
          "[data-m1002-progress-go]"
        )) {
          enterCoach();
        }
      },
      false
    );

    [
      "mana:program-tab-change",
      "mana:strength-synced",
      "mana:finishers-saved",
      "mana:finisher-completed",
      "mana:coach-workout-saved",
      "mana:workout-progress-change"
    ].forEach(name => {
      window.addEventListener(name, () => {
        if (name === "mana:coach-workout-saved") {
          coachLoadedAt = 0;
        }

        schedule();
      });
    });

    window.addEventListener("pageshow", schedule);

    window.addEventListener("mana:logout", () => {
      request++;
      coachLogs = [];
      coachUser = "";
      coachLoadedAt = 0;
      coachError = "";
      schedule();
    });

    window.MANA_PROGRESS_CARDIO_CORE_BUILD = BUILD;
    window.refreshManaFinisherProgress = () => {
      coachLoadedAt = 0;
      void fetchCoach(true);
      schedule();
    };

    schedule();

    console.log(
      "[Mana Movement] Progress Cardio/Core " +
      BUILD
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once:true }
    );
  } else {
    init();
  }
})();
