
/* ============================================================
   MANA MOVEMENT TRAINING
   GENERATED PROGRAM / COACH HUB BRIDGE
   BUILD 104750

   COMPLETE NEW FILE:
   mana_generated_coach_bridge_104750.js

   CLIENT:
   - Sync newly generated Mana Strength workouts
   - Allow older saved plans to be shared manually
   - Include training goals, schedule and Fuel targets

   COACH:
   - View the client's generated training plan
   - See all workout days, exercises, sets and reps
   - Review previously shared program versions
   - Open the existing client-linked Program Builder

   PRESERVES:
   - Original client workouts and completed sessions
   - Existing program assignment functionality
   - Client and coach navigation
   - Login and account permissions
   - All three Mana Movement pathways

   No automatic changes to client training plans.
   ============================================================ */

(() => {
  "use strict";

  if (window.MANA_GENERATED_COACH_BRIDGE_104750) {
    return;
  }

  window.MANA_GENERATED_COACH_BRIDGE_104750 = true;

  const VERSION = "104750";

  const TABLE = "mana_generated_program_snapshots";

  const PROGRAM_KEY = "mana-strength-v62-program";
  const PROFILE_KEY = "mana-profile-v67";
  const FUEL_KEY = "mana-fuel-v58-targets";

  const PANEL = "manaCoachGenerated104750";
  const SHARE = "manaClientShareGenerated104750";
  const STYLE = "manaGeneratedBridgeStyle104750";

  const $ = id => document.getElementById(id);

  const esc = value =>
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

  const json = key => {
    try {
      return JSON.parse(
        localStorage.getItem(key) || "null"
      );
    } catch (_) {
      return null;
    }
  };

  const detailVisible = () =>
    !!$("coachClientDetailView") &&
    !$("coachClientDetailView")
      .classList.contains("hide");

  let chosen = null;
  let snapshots = [];
  let activeSnapshot = 0;
  let loadToken = 0;
  let busy = false;
  let scheduled = false;

  /* =====================================
     SUPABASE SESSION
     ===================================== */

  async function session() {
    if (
      typeof window.supabaseClient !== "function"
    ) {
      throw Error(
        "Mana cloud connection is unavailable."
      );
    }

    const db = await window.supabaseClient();

    const { data, error } =
      await db.auth.getUser();

    if (error) throw error;

    if (!data?.user) {
      throw Error("Please sign in first.");
    }

    return {
      db,
      user: data.user
    };
  }

  /* =====================================
     READ GENERATED CLIENT PROGRAM
     ===================================== */

  function currentProgram() {
    const program = json(PROGRAM_KEY);

    if (
      !program ||
      !Array.isArray(program.sessions) ||
      !program.sessions.length ||
      !program.createdAt
    ) {
      return null;
    }

    if (
      !Number.isFinite(
        Date.parse(program.createdAt)
      )
    ) {
      return null;
    }

    return {
      goal: String(program.goal || ""),

      days:
        Number(program.days) ||
        program.sessions.length,

      experience:
        String(program.experience || ""),

      equipment:
        String(program.equipment || ""),

      createdAt: program.createdAt,

      sessions: program.sessions.map(day =>
        Array.isArray(day)
          ? [
              String(day[0] || "Workout"),

              Array.isArray(day[1])
                ? day[1].map(exercise =>
                    Array.isArray(exercise)
                      ? [
                          String(exercise[0] || ""),
                          String(exercise[1] || "")
                        ]
                      : [String(exercise), ""]
                  )
                : []
            ]
          : [
              String(day?.title || "Workout"),
              []
            ]
      )
    };
  }

  /* =====================================
     CLIENT SYNC STATUS
     ===================================== */

  function setShareStatus(
    message,
    error = false
  ) {
    const element = $(
      "manaClientShareStatus104750"
    );

    if (!element) return;

    element.textContent = message;

    element.style.color =
      error ? "#FF9A88" : "#C1C6CE";
  }

  /* =====================================
     SAVE GENERATED PROGRAM TO CLOUD

     New programs sync after generation.
     Older plans require explicit sharing
     when account ownership is unknown.
     ===================================== */

  async function syncGenerated(
    explicit = false
  ) {
    if (busy) return;

    const program = currentProgram();

    if (!program) {
      if (explicit) {
        setShareStatus(
          "Generate your Mana Strength program first.",
          true
        );
      }

      return;
    }

    busy = true;

    try {
      const { db, user } = await session();

      if (
        user.app_metadata?.role === "coach"
      ) {
        throw Error(
          "Sign in with a client account to share a client program."
        );
      }

      const bindingKey =
        "mana:generated-owner:" +
        program.createdAt;

      const owner =
        localStorage.getItem(bindingKey);

      if (
        owner &&
        owner !== user.id
      ) {
        throw Error(
          "This saved plan belongs to a different account on this device."
        );
      }

      // Never silently upload an older
      // program with unknown ownership.

      if (
        !explicit &&
        !owner
      ) {
        return;
      }

      if (
        explicit &&
        !owner &&
        !window.confirm(
          "Share this saved Mana Strength plan and its Fuel targets with your authorised coach?\n\nOnly continue if this is your own plan on this device."
        )
      ) {
        return;
      }

      const {
        data: existing,
        error: readError
      } = await db
        .from(TABLE)
        .select("id")
        .eq("client_id", user.id)
        .eq(
          "source_kind",
          "mana_strength_v62"
        )
        .eq(
          "source_created_at",
          program.createdAt
        )
        .limit(1);

      if (readError) {
        throw readError;
      }

      if (existing?.length) {
        setShareStatus(
          "This program is already available in Coach Hub."
        );

        return;
      }

      const profileData =
        json(PROFILE_KEY) || {};

      const fuelData =
        json(FUEL_KEY) || {};

      const profile = {
        goal: program.goal,
        days: program.days,
        experience: program.experience,
        equipment: program.equipment,
        fuelGoal: String(
          profileData.fuelGoal || ""
        )
      };

      const fuel = {};

      for (
        const key of [
          "calories",
          "protein",
          "water",
          "carbs",
          "fat"
        ]
      ) {
        const value =
          Number(fuelData[key]);

        if (
          Number.isFinite(value) &&
          value > 0
        ) {
          fuel[key] = value;
        }
      }

      const { error } = await db
        .from(TABLE)
        .insert({
          client_id: user.id,

          source_kind:
            "mana_strength_v62",

          source_created_at:
            program.createdAt,

          program,
          profile,

          fuel_targets: fuel
        });

      if (
        error &&
        error.code !== "23505"
      ) {
        throw error;
      }

      localStorage.setItem(
        bindingKey,
        user.id
      );

      setShareStatus(
        "Saved to Coach Hub ✓"
      );

      window.dispatchEvent(
        new CustomEvent(
          "mana:generated-program-cloud-synced"
        )
      );

    } catch (error) {
      console.warn(
        "[Mana] Generated program sync:",
        error
      );

      setShareStatus(
        "Could not share program: " +
        (error.message || error),
        true
      );

    } finally {
      busy = false;
    }
  }

  /* =====================================
     EXISTING CLIENT PROGRAM SHARE BUTTON

     Helps existing clients transfer plans
     created before cloud sync existed.
     ===================================== */

  function showShareButton() {
    const target =
      $("manaStrengthProgram");

    if (
      !target ||
      !currentProgram() ||
      $(SHARE)
    ) {
      return;
    }

    const container =
      document.createElement("div");

    container.id = SHARE;

    container.innerHTML = `
      <button
        type="button"
        id="manaShareGeneratedButton104750"
      >
        SHARE THIS PROGRAM WITH COACH HUB
      </button>

      <p id="manaClientShareStatus104750">
        For an older, locally saved program,
        share it once so your coach can
        view its workouts.
      </p>
    `;

    target.appendChild(container);

    container
      .querySelector("button")
      .addEventListener(
        "click",
        () => syncGenerated(true)
      );
  }

  /* =====================================
     PREMIUM VISUAL STYLES
     ===================================== */

  function css() {
    if ($(STYLE)) return;

    const style =
      document.createElement("style");

    style.id = STYLE;

    style.textContent = `

      #${SHARE} {
        margin: 14px 0;
        padding: 14px;

        background: #15171A;

        border: 1px solid #515961;
        border-radius: 14px;
      }

      #${SHARE} button {
        background: #FF7927 !important;
        color: #070809 !important;

        border: 0 !important;
        border-radius: 10px !important;

        padding: 12px 16px !important;
        font-weight: 850 !important;

        cursor: pointer;
      }

      #${SHARE} p {
        font-size: 12px !important;
        color: #C1C6CE !important;
        line-height: 1.5;
      }

      #${PANEL} {
        background: #15171A !important;

        border: 1px solid #626973 !important;
        border-radius: 19px !important;

        padding: 18px !important;
        margin: 15px 0 !important;

        color: #FFFFFF !important;
        box-sizing: border-box;
      }

      #${PANEL} * {
        box-sizing: border-box;
      }

      #${PANEL} h3 {
        margin: 4px 0 8px;

        color: #FFFFFF !important;
        font-size: 21px !important;
      }

      #${PANEL} .mg-kicker {
        font-size: 10px;
        font-weight: 900;

        color: #FF7927 !important;
        letter-spacing: .1em;
      }

      #${PANEL} .mg-desc {
        color: #C1C6CE !important;

        font-size: 12px;
        line-height: 1.55;

        margin: 8px 0 13px;
      }

      #${PANEL} .mg-grid {
        display: grid;

        grid-template-columns:
          repeat(2,minmax(0,1fr));

        gap: 9px;
      }

      #${PANEL} .mg-stat {
        border: 1px solid #535B65;
        background: #0C0E11;

        border-radius: 12px;
        padding: 12px;
      }

      #${PANEL} .mg-stat small {
        display: block;

        color: #AEB6C0;
        font-size: 10px;

        margin-bottom: 5px;
      }

      #${PANEL} .mg-stat strong {
        color: #FFFFFF;
        font-size: 14px;
      }

      #${PANEL} .mg-day {
        border: 1px solid #59616C;
        border-radius: 13px;

        margin: 9px 0;
        background: #101216;

        overflow: hidden;
      }

      #${PANEL} .mg-day summary {
        cursor: pointer;

        padding: 13px;

        color: #FFFFFF;
        font-weight: 850;

        list-style-position: inside;
      }

      #${PANEL} .mg-day[open] {
        border-color: #FF7927;
      }

      #${PANEL} .mg-ex {
        display: flex;
        justify-content: space-between;

        gap: 9px;
        padding: 9px 13px;

        border-top: 1px solid #3B424B;

        color: #C1C6CE;
        font-size: 12px;
      }

      #${PANEL} .mg-ex strong {
        color: #FFFFFF;
        font-size: 12px;
      }

      #${PANEL} select {
        width: 100%;
        padding: 12px;

        background: #090B0D;
        color: #FFFFFF;

        border: 1px solid #616B76;
        border-radius: 10px;

        margin-bottom: 10px;
      }

      #${PANEL} button {
        cursor: pointer;

        border: 1px solid #FF7927;
        border-radius: 11px;

        background: #FF7927;
        color: #08090B;

        font-weight: 900;
        padding: 12px 15px;

        margin-top: 8px;
      }

      #${PANEL} button:focus-visible,
      #${PANEL} select:focus-visible {
        outline: 2px solid #FF7927;
        outline-offset: 2px;
      }

      @media(max-width:600px) {
        #${PANEL} {
          padding: 13px !important;
        }

        #${PANEL} .mg-grid {
          gap: 6px;
        }
      }

    `;

    document.head.appendChild(style);
  }

  /* =====================================
     IDENTIFY SELECTED COACH CLIENT
     ===================================== */

  function captureClient(event) {
    const button = event.target.closest(
      '[data-client],' +
      '[data-coach-client-id],' +
      '.client-open[data-client-id]'
    );

    if (!button) return;

    const id =
      button.dataset.client ||
      button.dataset.coachClientId ||
      button.dataset.clientId;

    if (!id) return;

    const name = String(
      button.dataset.clientName ||
      button.querySelector("strong")
        ?.textContent ||
      "Client"
    ).trim();

    chosen = {
      id: String(id),
      name
    };

    loadToken++;

    $(PANEL)?.remove();

    setTimeout(mountCoach, 180);
    setTimeout(mountCoach, 600);
  }

  /* =====================================
     INSERT VIEWER INTO CLIENT PROFILE
     ===================================== */

  function mountCoach() {
    if (
      !chosen ||
      !detailVisible()
    ) {
      return;
    }

    const view =
      $("coachClientDetailView");

    if (!$(PANEL)) {
      const panel =
        document.createElement("section");

      panel.id = PANEL;

      panel.setAttribute(
        "aria-label",
        "Generated Mana Strength training program"
      );

      const assigned =
        $("manaCoachAssignments104720");

      const summary =
        $("manaV998ClientSummary");

      const anchor =
        assigned && view.contains(assigned)
          ? assigned
          : summary && view.contains(summary)
            ? summary
            : null;

      if (anchor) {
        anchor.insertAdjacentElement(
          "afterend",
          panel
        );
      } else {
        view.appendChild(panel);
      }

      panel.addEventListener(
        "change",
        event => {
          if (
            event.target.id ===
            "manaGeneratedVersion104750"
          ) {
            activeSnapshot =
              Number(event.target.value) || 0;

            renderCoach();
          }
        }
      );

      panel.addEventListener(
        "click",
        event => {
          if (
            !event.target.closest(
              "#manaGeneratedOpenBuilder104750"
            )
          ) {
            return;
          }

          if (
            typeof window.openManaProgramBuilder ===
            "function"
          ) {
            window.openManaProgramBuilder({
              ...chosen
            });
          } else {
            window.alert(
              "The Program Builder is not available."
            );
          }
        }
      );

      loadCoach();
    }
  }

  /* =====================================
     READ CLIENT'S SHARED PROGRAM
     ===================================== */

  async function loadCoach() {
    if (
      !chosen ||
      !detailVisible()
    ) {
      return;
    }

    const ticket = ++loadToken;
    const clientId = chosen.id;

    const panel = $(PANEL);

    if (panel) {
      panel.innerHTML = `
        <div class="mg-kicker">
          MANA STRENGTH · GENERATED PROGRAM
        </div>

        <p class="mg-desc">
          Loading the client's saved workout plan…
        </p>
      `;
    }

    try {
      const { db, user } =
        await session();

      if (
        user.app_metadata?.role !== "coach"
      ) {
        throw Error(
          "Coach permission is required."
        );
      }

      const { data, error } =
        await db
          .from(TABLE)
          .select(
            "id,source_created_at,saved_at,program,profile,fuel_targets"
          )
          .eq("client_id", clientId)
          .order("saved_at", {
            ascending: false
          })
          .limit(20);

      if (error) throw error;

      if (
        ticket !== loadToken ||
        !chosen ||
        chosen.id !== clientId ||
        !detailVisible()
      ) {
        return;
      }

      snapshots = data || [];
      activeSnapshot = 0;

      renderCoach();

    } catch (error) {
      if (ticket !== loadToken) {
        return;
      }

      if ($(PANEL)) {
        $(PANEL).innerHTML = `
          <div class="mg-kicker">
            GENERATED TRAINING
          </div>

          <h3>Could not load plan</h3>

          <p class="mg-desc">
            ${esc(error.message || error)}
          </p>
        `;
      }
    }
  }

  function stat(label, value) {
    return `
      <div class="mg-stat">
        <small>${esc(label)}</small>
        <strong>
          ${esc(value || "Not synced")}
        </strong>
      </div>
    `;
  }

  /* =====================================
     RENDER TRAINING PROFILE,
     FUEL GOALS AND EVERY WORKOUT
     ===================================== */

  function renderCoach() {
    const root = $(PANEL);

    if (!root || !chosen) {
      return;
    }

    const snapshot =
      snapshots[activeSnapshot];

    if (!snapshot) {
      root.innerHTML = `
        <div class="mg-kicker">
          MANA STRENGTH · GENERATED PROGRAM
        </div>

        <h3>
          Automatically Generated Workouts
        </h3>

        <p class="mg-desc">
          No generated Mana Strength plan
          has been shared by
          ${esc(chosen.name)} yet.

          New programs sync automatically
          when generated while logged in.

          Older saved plans can be shared
          from the client's program screen.
        </p>
      `;

      return;
    }

    const program =
      snapshot.program || {};

    const fuel =
      snapshot.fuel_targets || {};

    const days =
      Array.isArray(program.sessions)
        ? program.sessions
        : [];

    const created =
      new Date(
        snapshot.source_created_at
      ).toLocaleDateString("en-AU");

    const history =
      snapshots.length > 1
        ? `
          <label
            class="mg-desc"
            for="manaGeneratedVersion104750"
          >
            Training plan version
          </label>

          <select id="manaGeneratedVersion104750">
            ${snapshots.map((item, index) => `
              <option
                value="${index}"
                ${index === activeSnapshot
                  ? "selected"
                  : ""}
              >
                ${esc(
                  new Date(
                    item.source_created_at
                  ).toLocaleDateString("en-AU")
                )}
                ·
                ${esc(
                  item.program?.goal ||
                  "Mana Strength"
                )}
              </option>
            `).join("")}
          </select>
        `
        : "";

    root.innerHTML = `
      <div class="mg-kicker">
        MANA STRENGTH · CLIENT TRAINING
      </div>

      <h3>Generated Workout Plan</h3>

      <p class="mg-desc">
        Saved plan for ${esc(chosen.name)}
        · Generated ${esc(created)}
        · Read-only snapshot
      </p>

      ${history}

      <div class="mg-grid">
        ${stat(
          "TRAINING GOAL",
          program.goal
        )}

        ${stat(
          "DAYS PER WEEK",
          program.days
            ? program.days + " days"
            : ""
        )}

        ${stat(
          "EXPERIENCE",
          program.experience
        )}

        ${stat(
          "EQUIPMENT",
          program.equipment
        )}
      </div>

      <div
        class="mg-kicker"
        style="margin-top:17px"
      >
        FUEL TARGETS AT TIME OF SYNC
      </div>

      <div
        class="mg-grid"
        style="margin-top:9px"
      >
        ${stat(
          "CALORIES",
          fuel.calories
            ? fuel.calories + " kcal"
            : ""
        )}

        ${stat(
          "PROTEIN",
          fuel.protein
            ? fuel.protein + " g"
            : ""
        )}

        ${stat(
          "WATER",
          fuel.water
            ? (
                fuel.water >= 100
                  ? fuel.water / 1000 + " L"
                  : fuel.water + " L"
              )
            : ""
        )}

        ${stat(
          "TRAINING DAYS",
          program.days
            ? String(program.days)
            : ""
        )}
      </div>

      <div
        class="mg-kicker"
        style="margin-top:19px"
      >
        ALL WORKOUT DAYS (${days.length})
      </div>

      ${days.map((day, index) => `
        <details class="mg-day">
          <summary>
            Day ${index + 1}
            ·
            ${esc(
              Array.isArray(day)
                ? day[0]
                : "Workout"
            )}
          </summary>

          ${(
            Array.isArray(day?.[1])
              ? day[1]
              : []
          ).map(exercise => `
            <div class="mg-ex">
              <strong>
                ${esc(exercise?.[0])}
              </strong>

              <span>
                ${esc(exercise?.[1])}
              </span>
            </div>
          `).join("")}
        </details>
      `).join("")}

      <button
        type="button"
        id="manaGeneratedOpenBuilder104750"
      >
        CREATE AN UPDATED PROGRAM
      </button>

      <p class="mg-desc">
        Opens the existing client-linked
        Program Builder as a new draft.

        It does not automatically import
        or overwrite these generated workouts.

        The client's completed training history
        remains unchanged.
      </p>
    `;
  }

  /* =====================================
     INITIALISE
     ===================================== */

  function init() {
    css();

    document.addEventListener(
      "click",
      captureClient,
      true
    );

    /* Auto-sync newly generated programs
       for authenticated client accounts. */

    window.addEventListener(
      "mana:strength-program-built",
      async event => {
        const program = event.detail;

        if (!program?.createdAt) {
          return;
        }

        try {
          const { user } =
            await session();

          if (
            user.app_metadata?.role ===
            "coach"
          ) {
            return;
          }

          if (
            currentProgram()?.createdAt !==
            program.createdAt
          ) {
            return;
          }

          localStorage.setItem(
            "mana:generated-owner:" +
            program.createdAt,
            user.id
          );

          syncGenerated(false);

        } catch (error) {
          console.warn(
            "[Mana] Client generated-program sign-in:",
            error.message || error
          );
        }
      }
    );

    const detail =
      $("coachClientDetailView");

    if (detail) {
      new MutationObserver(() => {
        if (!detailVisible()) {
          loadToken++;
          return;
        }

        scheduleMount();

      }).observe(detail, {
        attributes: true,
        attributeFilter: ["class"],
        childList: true,
        subtree: true
      });
    }

    new MutationObserver(
      scheduleShare
    ).observe(
      document.body,
      {
        childList: true,
        subtree: true
      }
    );

    scheduleShare();

    console.log(
      "[Mana Movement] Generated program bridge " +
      VERSION
    );
  }

  function scheduleMount() {
    if (scheduled) return;

    scheduled = true;

    requestAnimationFrame(() => {
      scheduled = false;
      mountCoach();
    });
  }

  let shareScheduled = false;

  function scheduleShare() {
    if (shareScheduled) return;

    shareScheduled = true;

    requestAnimationFrame(() => {
      shareScheduled = false;
      showShareButton();
    });
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }

})();
