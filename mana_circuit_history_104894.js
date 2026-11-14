
/* MANA MOVEMENT — CIRCUIT COMPLETION HISTORY 104894
   NEW COMPLETE FILE. Load AFTER Circuits audio.
   Records genuine timer completions in Supabase and displays
   sessions in Mana Strength Progress and Coach Hub.
   Does not modify existing workouts, timers, or navigation.
*/
(() => {
  "use strict";
  if (window.MANA_CIRCUIT_HISTORY_104894) return;
  window.MANA_CIRCUIT_HISTORY_104894 = true;

  const TABLE = "mana_circuit_sessions";
  const STYLE = "manaCircuitHistoryStyle104894";
  const PROGRESS = "manaCircuitClientHistory104894";
  const COACH = "manaCircuitCoachHistory104894";
  const $ = id => document.getElementById(id);

  let observedRoot = null;
  let session = null;
  let saving = false;
  let selectedCoachId = "";
  let clientRequest = 0;
  let coachRequest = 0;

  const escape = x => String(x ?? "").replace(
    /[&<>"']/g,
    c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c])
  );

  function strengthOpen() {
    return Boolean(
      $("manaV83ProgramShell")?.classList.contains("open") &&
      /strength/i.test(
        $("manaV83Title")?.textContent || ""
      )
    );
  }

  function currentTab(name) {
    return strengthOpen() && Boolean(
      $("manaV83Tabs")?.querySelector(
        `[data-v83-tab="${name}"].active`
      )
    );
  }

  function circuitRoot() {
    return currentTab("learn")
      ? $("manaV83Content")?.querySelector(".msc-root")
      : null;
  }

  function details(root) {
    if (!root) return null;

    const type = root.dataset.type;
    const value = Number(
      root.querySelector(
        '.msc-setting[aria-pressed="true"]'
      )?.dataset.mscDuration
    );

    if (
      !Number.isFinite(value) ||
      value <= 0 ||
      !["emom", "tabata", "strength"].includes(type)
    ) return null;

    const minutes = type === "tabata" ? value * 4 : value;

    const accepted = {
      emom: [10, 15, 20],
      tabata: [4, 8, 12],
      strength: [15, 30, 45]
    };

    if (!accepted[type].includes(minutes)) return null;

    const shown = (
      root.querySelector(".msc-clock")?.textContent || ""
    ).trim();

    const match = /^(\d+):(\d{2})$/.exec(shown);
    if (!match) return null;

    return {
      type,
      minutes,
      seconds: Number(match[1]) * 60 + Number(match[2])
    };
  }

  function formatType(type) {
    return ({
      emom: "EMOM",
      tabata: "Tabata",
      strength: "Strength Circuit"
    })[type] || "Circuit";
  }

  function formatDate(value) {
    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? ""
      : date.toLocaleString("en-AU", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit"
        });
  }

  function status(root, message, error = false) {
    const timer = root?.querySelector(".msc-timer");
    if (!timer) return;

    let line = timer.querySelector(".mch-status");

    if (!line) {
      line = document.createElement("p");
      line.className = "mch-status";
      line.setAttribute("role", "status");
      timer.appendChild(line);
    }

    line.textContent = message;
    line.style.color = error ? "#FFB4A8" : "#FF7927";
  }

  async function dbAndUser() {
    if (typeof window.supabaseClient !== "function") {
      throw Error("Sign in to save circuit history.");
    }

    const db = await window.supabaseClient();
    const { data, error } = await db.auth.getUser();

    if (error || !data?.user) {
      throw Error("Please sign in to save circuit history.");
    }

    return { db, user: data.user };
  }

  /* ========================================
     RECORD A COMPLETED CIRCUIT
     ======================================== */

  async function recordCompleted(root, snapshot) {
    if (
      saving ||
      snapshot.saved ||
      snapshot.failed
    ) return;

    saving = true;
    snapshot.saved = true;

    status(root, "Saving completed circuit…");

    try {
      const { db, user } = await dbAndUser();

      const { error } = await db.from(TABLE).insert({
        user_id: user.id,
        circuit_type: snapshot.type,
        duration_minutes: snapshot.minutes,
        started_at: new Date(snapshot.startedAt).toISOString(),
        completed_at: new Date().toISOString()
      });

      if (error) throw error;

      status(root, "Circuit complete · Saved to Progress ✓");
      setTimeout(mountClient, 150);

    } catch (err) {
      snapshot.saved = false;
      snapshot.failed = true;

      status(
        root,
        `Not saved: ${err?.message || String(err)}. Tap Retry save.`,
        true
      );

      const line = root.querySelector(".mch-status");

      if (line && !line.querySelector("button")) {
        const retry = document.createElement("button");

        retry.type = "button";
        retry.className = "mch-retry";
        retry.textContent = "Retry save";

        retry.onclick = () => {
          retry.remove();
          snapshot.failed = false;
          recordCompleted(root, snapshot);
        };

        line.appendChild(retry);
      }
    } finally {
      saving = false;
    }
  }

  /* ========================================
     WATCH EXISTING TIMER

     A completion is only saved after
     the original timer reaches 00:00.
     ======================================== */

  function monitor() {
    const root = circuitRoot();

    if (!root) {
      observedRoot = null;
      session = null;
      return;
    }

    const d = details(root);
    if (!d) return;

    const key = `${d.type}:${d.minutes}`;

    if (
      observedRoot !== root ||
      session?.key !== key
    ) {
      observedRoot = root;
      session = null;
    }

    const button = root.querySelector(
      '[data-msc-action="start"]'
    );

    const label = button?.textContent?.trim() || "";
    const isRunning = /^Pause timer$/i.test(label);

    if (isRunning && d.seconds > 0) {
      if (!session || session.saved) {
        session = {
          key,
          type: d.type,
          minutes: d.minutes,
          startedAt:
            Date.now() -
            (d.minutes * 60 - d.seconds) * 1000,
          saved: false,
          failed: false
        };
      }
      return;
    }

    if (
      session &&
      !session.saved &&
      !session.failed &&
      !saving &&
      d.seconds === 0 &&
      /Session complete/i.test(
        root.querySelector(".msc-step")?.textContent || ""
      )
    ) {
      recordCompleted(root, session);
    }
  }

  /* ========================================
     HISTORY COMPONENTS
     ======================================== */

  function panel(id, title, parent) {
    if (!parent) return null;

    let node = $(id);

    if (node && node.parentElement !== parent) {
      node.remove();
    }

    node = $(id);

    if (!node) {
      node = document.createElement("section");
      node.id = id;
      node.className = "mch-panel";

      node.innerHTML = `
        <h3>${title}</h3>
        <p class="mch-muted">
          Loading completed circuits…
        </p>
      `;

      parent.appendChild(node);
    }

    return node;
  }

  function rows(items) {
    if (!items.length) {
      return `
        <p class="mch-muted">
          No completed circuits recorded yet.
        </p>
      `;
    }

    const total = items.reduce(
      (n, s) => n + Number(s.duration_minutes || 0),
      0
    );

    return `
      <div class="mch-summary">
        <strong>${items.length}</strong>
        completed circuits
        <span>· ${total} minutes</span>
      </div>
    ` + items.map(s => `
      <div class="mch-row">
        <div>
          <strong>
            ${escape(formatType(s.circuit_type))}
          </strong>
          <small>
            ${escape(formatDate(s.completed_at))}
          </small>
        </div>
        <b>${Number(s.duration_minutes)} min</b>
      </div>
    `).join("");
  }

  /* ========================================
     CLIENT — MANA STRENGTH PROGRESS
     ======================================== */

  async function mountClient() {
    if (!currentTab("progress")) return;

    const holder = $("manaV83Content");
    if (!holder) return;

    const host = panel(
      PROGRESS,
      "Completed Circuits",
      holder
    );

    if (!host) return;

    const token = ++clientRequest;

    try {
      const { db, user } = await dbAndUser();

      const { data, error } = await db
        .from(TABLE)
        .select(
          "circuit_type,duration_minutes,completed_at"
        )
        .eq("user_id", user.id)
        .order("completed_at", {
          ascending: false
        })
        .limit(30);

      if (error) throw error;

      if (
        token !== clientRequest ||
        !currentTab("progress") ||
        !host.isConnected
      ) return;

      host.innerHTML = `
        <h3>Completed Circuits</h3>
        ${rows(data || [])}
      `;

    } catch (err) {
      if (token === clientRequest && host.isConnected) {
        host.innerHTML = `
          <h3>Completed Circuits</h3>
          <p class="mch-muted">
            ${escape(err?.message || "History unavailable")}
          </p>
        `;
      }
    }
  }

  /* ========================================
     COACH HUB — CLIENT PROFILE
     ======================================== */

  function coachVisible() {
    return Boolean(
      $("coachClientDetailView") &&
      !$("coachClientDetailView").classList.contains("hide")
    );
  }

  async function mountCoach() {
    if (!coachVisible() || !selectedCoachId) return;

    const anchor = $("detailWorkoutHistory");
    if (!anchor?.parentElement) return;

    const host = panel(
      COACH,
      "Circuit Session History",
      anchor.parentElement
    );

    if (!host) return;

    const token = ++coachRequest;

    try {
      const { db } = await dbAndUser();

      const { data, error } = await db
        .from(TABLE)
        .select(
          "circuit_type,duration_minutes,completed_at"
        )
        .eq("user_id", selectedCoachId)
        .order("completed_at", {
          ascending: false
        })
        .limit(30);

      if (error) throw error;

      if (
        token !== coachRequest ||
        !coachVisible() ||
        !host.isConnected
      ) return;

      host.innerHTML = `
        <h3>Circuit Session History</h3>
        ${rows(data || [])}
      `;

    } catch (err) {
      if (token === coachRequest && host.isConnected) {
        host.innerHTML = `
          <h3>Circuit Session History</h3>
          <p class="mch-muted">
            ${escape(err?.message || "History unavailable")}
          </p>
        `;
      }
    }
  }

  /* ========================================
     PREMIUM MANA STYLING
     ======================================== */

  function styles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `
      #${PROGRESS},
      #${COACH} {
        background: #15171A !important;
        color: #FFFFFF !important;
        border: 1px solid #FF7927 !important;
        border-radius: 17px !important;
        padding: 17px !important;
        margin: 18px 0 !important;
        box-sizing: border-box !important;
      }

      #${PROGRESS} h3,
      #${COACH} h3 {
        color: #FFFFFF !important;
        margin: 0 0 12px !important;
        font-size: 18px !important;
      }

      .mch-summary {
        color: #C1C6CE;
        font-size: 13px;
        padding-bottom: 12px;
        border-bottom: 1px solid #363D46;
      }

      .mch-summary strong {
        color: #FF7927;
        font-size: 21px;
      }

      .mch-summary span {
        color: #C1C6CE;
      }

      .mch-row {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: center;
        border-bottom: 1px solid #363D46;
        padding: 12px 0;
        color: #FFFFFF;
      }

      .mch-row:last-child {
        border-bottom: 0;
      }

      .mch-row strong {
        display: block;
        font-size: 13px;
        color: #FFFFFF;
      }

      .mch-row small {
        display: block;
        color: #C1C6CE;
        font-size: 11px;
        margin-top: 4px;
      }

      .mch-row b {
        color: #FF7927;
        white-space: nowrap;
        font-size: 13px;
      }

      .mch-muted {
        color: #C1C6CE;
        font-size: 12px;
        line-height: 1.5;
      }

      .mch-status {
        font-size: 12px;
        font-weight: 700;
        line-height: 1.5;
      }

      .mch-retry {
        display: block;
        margin: 8px auto 0;
        padding: 8px 14px;
        border-radius: 10px;
        border: 1px solid #FF7927;
        background: #15171A;
        color: #FFFFFF;
        font-weight: 800;
      }
    `;

    document.head.appendChild(style);
  }

  /* ========================================
     NAVIGATION INTEGRATION
     ======================================== */

  function scheduleViews() {
    [80, 280, 620].forEach(t => {
      setTimeout(() => {
        mountClient();

        if (coachVisible()) {
          mountCoach();
        }
      }, t);
    });
  }

  function init() {
    styles();

    /* Follow the existing clock only.
       No competing timer is created. */
    setInterval(monitor, 350);

    window.addEventListener(
      "mana:program-tab-change",
      scheduleViews
    );

    window.addEventListener(
      "pageshow",
      scheduleViews
    );

    document.addEventListener(
      "click",
      event => {
        const target = event.target;

        if (!(target instanceof Element)) return;

        if (target.closest(
          '[data-msc-action="reset"],' +
          '[data-msc-type],' +
          '[data-msc-duration]'
        )) {
          session = null;
        }

        const coachButton = target.closest(
          ".client-open[data-client-id]," +
          "[data-coach-client-id]," +
          "[data-client]"
        );

        if (coachButton) {
          const next =
            coachButton.dataset.clientId ||
            coachButton.dataset.coachClientId ||
            coachButton.dataset.client;

          if (
            next &&
            /^[0-9a-f-]{36}$/i.test(next)
          ) {
            selectedCoachId = next;
            ++coachRequest;

            $(COACH)?.remove();

            [250, 650, 1200].forEach(t => {
              setTimeout(mountCoach, t);
            });
          }
        }

        if (target.closest(
          '#manaV83Tabs [data-v83-tab="progress"]'
        )) {
          scheduleViews();
        }
      },
      true
    );

    const content = $("manaV83Content");

    if (content) {
      let queued = false;

      new MutationObserver(() => {
        if (!currentTab("progress") || queued) return;
        if ($(PROGRESS)) return;

        queued = true;

        requestAnimationFrame(() => {
          queued = false;
          mountClient();
        });
      }).observe(content, {
        childList: true
      });
    }

    scheduleViews();

    console.log(
      "[Mana Strength] Circuit history 104894"
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }
})();
