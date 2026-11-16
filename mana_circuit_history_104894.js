
/* ====================================================
   MANA MOVEMENT — CIRCUIT COMPLETION HISTORY
   BUILD 104895 — PREMIUM COLOUR FINISH

   COMPLETE REPLACEMENT:
   mana_circuit_history_104894.js

   Preserves:
   - Supabase completed-circuit recording
   - Client Progress history
   - Coach Hub circuit history
   - EMOM / Tabata / Strength circuit support
   - Retry save on error

   Corrects:
   - Gold borders to Mana orange
   - Gold headings to white
   - Orange completion totals
   - Silver secondary text
   - Strength Progress weight action colour
   ==================================================== */

(() => {
  "use strict";

  const BUILD = "104895";
  const FLAG = "MANA_CIRCUIT_HISTORY_104895";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const TABLE = "mana_circuit_sessions";

  const STYLE = "manaCircuitHistoryStyle104895";
  const PROGRESS = "manaCircuitClientHistory104894";
  const COACH = "manaCircuitCoachHistory104894";

  const $ = id => document.getElementById(id);

  let observedRoot = null;
  let session = null;
  let saving = false;

  let selectedCoachId = "";
  let clientRequest = 0;
  let coachRequest = 0;

  const escape = value =>
    String(value ?? "").replace(
      /[&<>"']/g,
      character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[character]
    );

  /* ====================================
     PROGRAM DETECTION
     ==================================== */

  function strengthOpen() {
    return Boolean(
      $("manaV83ProgramShell")
        ?.classList.contains("open") &&
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
      ? $("manaV83Content")?.querySelector(
          ".msc-root"
        )
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
    ) {
      return null;
    }

    const minutes =
      type === "tabata" ? value * 4 : value;

    const accepted = {
      emom: [10, 15, 20],
      tabata: [4, 8, 12],
      strength: [15, 30, 45]
    };

    if (!accepted[type].includes(minutes)) {
      return null;
    }

    const shown = (
      root.querySelector(".msc-clock")
        ?.textContent || ""
    ).trim();

    const match = /^(\d+):(\d{2})$/.exec(
      shown
    );

    if (!match) return null;

    return {
      type,
      minutes,
      seconds:
        Number(match[1]) * 60 +
        Number(match[2])
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

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  }

  /* ====================================
     STATUS MESSAGE
     ==================================== */

  function status(root, message, error = false) {
    const timer = root?.querySelector(
      ".msc-timer"
    );

    if (!timer) return;

    let line = timer.querySelector(
      ".mch-status"
    );

    if (!line) {
      line = document.createElement("p");
      line.className = "mch-status";

      line.setAttribute("role", "status");
      timer.appendChild(line);
    }

    line.textContent = message;

    line.style.color = error
      ? "#FFB4A8"
      : "#FF7927";
  }

  /* ====================================
     AUTHENTICATED CLOUD ACCESS
     ==================================== */

  async function dbAndUser() {
    if (
      typeof window.supabaseClient !== "function"
    ) {
      throw Error(
        "Sign in to save circuit history."
      );
    }

    const db = await window.supabaseClient();

    const { data, error } =
      await db.auth.getUser();

    if (error || !data?.user) {
      throw Error(
        "Please sign in to save circuit history."
      );
    }

    return {
      db,
      user: data.user
    };
  }

  /* ====================================
     SAVE COMPLETED CIRCUITS
     ==================================== */

  async function recordCompleted(root, snapshot) {
    if (
      saving ||
      snapshot.saved ||
      snapshot.failed
    ) {
      return;
    }

    saving = true;
    snapshot.saved = true;

    status(
      root,
      "Saving completed circuit…"
    );

    try {
      const { db, user } =
        await dbAndUser();

      const { error } = await db
        .from(TABLE)
        .insert({
          user_id: user.id,
          circuit_type: snapshot.type,
          duration_minutes: snapshot.minutes,
          started_at: new Date(
            snapshot.startedAt
          ).toISOString(),
          completed_at:
            new Date().toISOString()
        });

      if (error) throw error;

      status(
        root,
        "Circuit complete · Saved to Progress ✓"
      );

      setTimeout(mountClient, 150);

    } catch (error) {
      snapshot.saved = false;
      snapshot.failed = true;

      status(
        root,
        "Not saved: " +
        (error?.message || String(error)) +
        ". Tap Retry save.",
        true
      );

      const line = root.querySelector(
        ".mch-status"
      );

      if (
        line &&
        !line.querySelector("button")
      ) {
        const retry =
          document.createElement("button");

        retry.type = "button";
        retry.className = "mch-retry";
        retry.textContent = "Retry save";

        retry.onclick = () => {
          retry.remove();
          snapshot.failed = false;

          recordCompleted(
            root,
            snapshot
          );
        };

        line.appendChild(retry);
      }

    } finally {
      saving = false;
    }
  }

  /* ====================================
     MONITOR EXISTING CIRCUIT TIMER

     Never mark an incomplete circuit
     as a finished session.
     ==================================== */

  function monitor() {
    const root = circuitRoot();

    if (!root) {
      observedRoot = null;
      session = null;
      return;
    }

    const detail = details(root);

    if (!detail) return;

    const key =
      `${detail.type}:${detail.minutes}`;

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

    const label =
      button?.textContent?.trim() || "";

    const running =
      /^Pause timer$/i.test(label);

    if (
      running &&
      detail.seconds > 0
    ) {
      if (!session || session.saved) {
        session = {
          key,
          type: detail.type,
          minutes: detail.minutes,
          startedAt:
            Date.now() -
            (
              detail.minutes * 60 -
              detail.seconds
            ) * 1000,
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
      detail.seconds === 0 &&
      /Session complete/i.test(
        root.querySelector(".msc-step")
          ?.textContent || ""
      )
    ) {
      recordCompleted(
        root,
        session
      );
    }
  }

  /* ====================================
     HISTORY PANELS
     ==================================== */

  function panel(id, title, parent) {
    if (!parent) return null;

    let node = $(id);

    if (
      node &&
      node.parentElement !== parent
    ) {
      node.remove();
      node = null;
    }

    if (!node) {
      node = document.createElement(
        "section"
      );

      node.id = id;
      node.className =
        "mch-panel";

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
      (sum, item) =>
        sum +
        Number(item.duration_minutes || 0),
      0
    );

    return `
      <div class="mch-summary">
        <strong>${items.length}</strong>
        completed circuits
        <span>
          · ${total} minutes
        </span>
      </div>

      ${items.map(item => `
        <div class="mch-row">

          <div class="mch-row-info">
            <strong>
              ${escape(formatType(
                item.circuit_type
              ))}
            </strong>

            <small>
              ${escape(formatDate(
                item.completed_at
              ))}
            </small>
          </div>

          <b>
            ${Number(
              item.duration_minutes
            )} min
          </b>

        </div>
      `).join("")}
    `;
  }

  /* ====================================
     CLIENT — MANA STRENGTH PROGRESS
     ==================================== */

  async function mountClient() {
    if (!currentTab("progress")) {
      return;
    }

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
      const { db, user } =
        await dbAndUser();

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
      ) {
        return;
      }

      host.innerHTML = `
        <h3>Completed Circuits</h3>
        ${rows(data || [])}
      `;

    } catch (error) {
      if (
        token === clientRequest &&
        host.isConnected
      ) {
        host.innerHTML = `
          <h3>Completed Circuits</h3>
          <p class="mch-muted">
            ${escape(
              error?.message ||
              "History unavailable"
            )}
          </p>
        `;
      }
    }
  }

  /* ====================================
     COACH HUB — CIRCUIT HISTORY
     ==================================== */

  function coachVisible() {
    return Boolean(
      $("coachClientDetailView") &&
      !$("coachClientDetailView")
        .classList.contains("hide")
    );
  }

  async function mountCoach() {
    if (
      !coachVisible() ||
      !selectedCoachId
    ) {
      return;
    }

    const anchor = $(
      "detailWorkoutHistory"
    );

    if (!anchor?.parentElement) {
      return;
    }

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
        .eq(
          "user_id",
          selectedCoachId
        )
        .order("completed_at", {
          ascending: false
        })
        .limit(30);

      if (error) throw error;

      if (
        token !== coachRequest ||
        !coachVisible() ||
        !host.isConnected
      ) {
        return;
      }

      host.innerHTML = `
        <h3>Circuit Session History</h3>
        ${rows(data || [])}
      `;

    } catch (error) {
      if (
        token === coachRequest &&
        host.isConnected
      ) {
        host.innerHTML = `
          <h3>Circuit Session History</h3>
          <p class="mch-muted">
            ${escape(
              error?.message ||
              "History unavailable"
            )}
          </p>
        `;
      }
    }
  }

  /* ====================================
     PREMIUM BLACK / ORANGE / WHITE / SILVER

     More specific selectors override
     older gold Strength Progress styles.
     ==================================== */

  function styles() {
    if ($(STYLE)) return;

    const style = document.createElement(
      "style"
    );

    style.id = STYLE;

    style.textContent = `

      /* Main client and coach cards */

      #manaV83ProgramShell
      #manaV83Content
      #${PROGRESS},

      #coachClientDetailView
      #${COACH} {
        display: block !important;

        width: 100% !important;

        background: #15171A !important;
        background-image: none !important;

        border: 1px solid #FF7927 !important;
        border-color: #FF7927 !important;

        border-radius: 17px !important;

        color: #FFFFFF !important;
        -webkit-text-fill-color:
          #FFFFFF !important;

        padding: 17px !important;
        margin: 18px 0 !important;

        outline: 0 !important;
        box-shadow: none !important;

        box-sizing: border-box !important;
      }

      /* Headings must be WHITE,
         not inherited gold. */

      #manaV83ProgramShell
      #manaV83Content
      #${PROGRESS} h3,

      #coachClientDetailView
      #${COACH} h3 {
        color: #FFFFFF !important;

        -webkit-text-fill-color:
          #FFFFFF !important;

        font-size: 18px !important;
        font-weight: 900 !important;

        margin: 0 0 12px !important;

        text-shadow: none !important;
      }

      /* Total recorded circuits */

      #${PROGRESS} .mch-summary,
      #${COACH} .mch-summary {
        color: #C1C6CE !important;

        -webkit-text-fill-color:
          #C1C6CE !important;

        font-size: 13px !important;

        padding-bottom: 12px !important;

        border-bottom:
          1px solid #363D46 !important;
      }

      #${PROGRESS} .mch-summary strong,
      #${COACH} .mch-summary strong {
        color: #FF7927 !important;

        -webkit-text-fill-color:
          #FF7927 !important;

        font-size: 21px !important;
        font-weight: 900 !important;

        text-shadow: none !important;
      }

      #${PROGRESS} .mch-summary span,
      #${COACH} .mch-summary span {
        color: #C1C6CE !important;

        -webkit-text-fill-color:
          #C1C6CE !important;
      }

      /* Individual session rows */

      #${PROGRESS} .mch-row,
      #${COACH} .mch-row {
        display: flex !important;

        justify-content:
          space-between !important;

        align-items: center !important;
        gap: 12px !important;

        padding: 12px 0 !important;

        border-bottom:
          1px solid #363D46 !important;

        color: #FFFFFF !important;

        background: transparent !important;
      }

      #${PROGRESS} .mch-row:last-child,
      #${COACH} .mch-row:last-child {
        border-bottom: 0 !important;
      }

      #${PROGRESS} .mch-row strong,
      #${COACH} .mch-row strong {
        display: block !important;

        color: #FFFFFF !important;

        -webkit-text-fill-color:
          #FFFFFF !important;

        font-size: 13px !important;
        font-weight: 800 !important;
      }

      #${PROGRESS} .mch-row small,
      #${COACH} .mch-row small {
        display: block !important;

        color: #C1C6CE !important;

        -webkit-text-fill-color:
          #C1C6CE !important;

        font-size: 11px !important;
        margin-top: 4px !important;
      }

      #${PROGRESS} .mch-row b,
      #${COACH} .mch-row b {
        color: #FF7927 !important;

        -webkit-text-fill-color:
          #FF7927 !important;

        font-size: 13px !important;
        font-weight: 900 !important;

        white-space: nowrap !important;
      }

      #${PROGRESS} .mch-muted,
      #${COACH} .mch-muted {
        color: #C1C6CE !important;

        -webkit-text-fill-color:
          #C1C6CE !important;

        font-size: 12px !important;
        line-height: 1.5 !important;
      }

      /* Save confirmation and retry */

      .mch-status {
        color: #FF7927 !important;
        font-size: 12px !important;
        font-weight: 800 !important;
      }

      .mch-retry {
        display: block !important;

        margin: 8px auto 0 !important;
        padding: 9px 15px !important;

        background: #15171A !important;

        border: 1px solid #FF7927 !important;
        border-radius: 10px !important;

        color: #FFFFFF !important;

        -webkit-text-fill-color:
          #FFFFFF !important;

        font-weight: 800 !important;
      }

      /* Progress screen accent cleanup:
         remove inherited gold/yellow
         from the weight update action. */

      #manaV83ProgramShell
      #manaV83Content
      a[href],
      #manaV83ProgramShell
      #manaV83Content
      button {
        accent-color: #FF7927;
      }

      /* Scope the old gold text to Mana
         Strength Progress only. */

      #manaV83ProgramShell.mana-strength-nav-104886
      #manaV83Content .gold {
        color: #FF7927 !important;

        -webkit-text-fill-color:
          #FF7927 !important;
      }

      /* Never recolour the existing
         bottom navigation or coach switch. */

    `;

    document.head.appendChild(style);
  }

  /* ====================================
     NAVIGATION AND VIEW REFRESH
     ==================================== */

  function scheduleViews() {
    [80, 280, 620].forEach(delay => {
      setTimeout(() => {
        mountClient();

        if (coachVisible()) {
          mountCoach();
        }
      }, delay);
    });
  }

  function init() {
    styles();

    /* Read the existing timer.
       Do not create a competing clock. */

    setInterval(
      monitor,
      350
    );

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

        if (!(target instanceof Element)) {
          return;
        }

        if (target.closest(
          '[data-msc-action="reset"],' +
          '[data-msc-type],' +
          '[data-msc-duration]'
        )) {
          session = null;
        }

        const coachButton =
          target.closest(
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

            [250, 650, 1200].forEach(
              delay => {
                setTimeout(
                  mountCoach,
                  delay
                );
              }
            );
          }
        }

        if (target.closest(
          '#manaV83Tabs ' +
          '[data-v83-tab="progress"]'
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
        if (
          !currentTab("progress") ||
          queued ||
          $(PROGRESS)
        ) {
          return;
        }

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
      "[Mana Strength] Circuit history " +
      BUILD
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
