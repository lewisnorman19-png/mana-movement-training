
/* ============================================================
   MANA MOVEMENT TRAINING
   COACH HUB — PREMIUM FINISH
   BUILD 104980

   COMPLETE NEW JAVASCRIPT FILE

   FIXES
   - Program Upgrade Request jumping to the top
   - Premium Coach Hub card consistency
   - Missing calories and protein
   - Missing current recovery score
   - Fuel and Recovery coach visibility

   CLIENT SYNC
   - Reads existing saved Profile values
   - Reads existing saved Fuel targets
   - Reads existing Recovery records
   - Respects existing profile sharing consent
   - Preserves unrelated extended profile data

   COACH HUB
   - Reads only authorised cloud information
   - Displays actual values or unavailable status
   - Never reads the coach's own Fuel as client data

   PRESERVES
   - View Client
   - Program Builder
   - Request action buttons
   - Coach Chat
   - Photos
   - Existing navigation

   No new database tables.
   No database policy changes.
   No continuous page-wide observer.
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104980";

  if (window.MANA_PREMIUM_104980) return;
  window.MANA_PREMIUM_104980 = true;

  const $ = id => document.getElementById(id);

  const VIEW = "coachClientDetailView";
  const PROFILE = "manaCoachProfile104950";
  const BLOCK = "manaV1017CoachRequest";
  const ASSIGN = "manaCoachAssignments104720";

  const STYLE = "manaPremium104980Style";

  const PROFILE_KEY = "mana-profile-v67";
  const TARGET_KEY = "mana-fuel-v58-targets";
  const DAILY_KEY = "mana-strength-v866-daily";
  const FUEL_KEY = "mana-fuel-v571";

  let lastClientId = "";
  let coachData = null;
  let coachRequest = 0;

  let detailObserver = null;
  let profileObserver = null;
  let observedProfile = null;
  let arranging = false;

  let syncTimer = null;
  let syncBusy = false;

  const safe = value =>
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

  function readLocal(key) {
    try {
      const value = JSON.parse(
        localStorage.getItem(key) || "{}"
      );

      return value &&
        typeof value === "object"
          ? value
          : {};
    } catch (_) {
      return {};
    }
  }

  function hasValue(value) {
    return (
      value !== null &&
      value !== undefined &&
      String(value).trim() !== ""
    );
  }

  function number(value) {
    if (!hasValue(value)) return null;

    const n = Number(value);

    return Number.isFinite(n) && n >= 0
      ? n
      : null;
  }

  function coachOpen() {
    const view = $(VIEW);

    return Boolean(
      view &&
      !view.hidden &&
      !view.classList.contains("hide")
    );
  }

  function currentClient() {
    try {
      if (
        typeof selectedCoachClient !== "undefined" &&
        selectedCoachClient?.userId
      ) {
        return {
          id: String(selectedCoachClient.userId),
          name: String(
            selectedCoachClient.clientName || "Client"
          )
        };
      }
    } catch (_) {}

    return null;
  }

  async function dbConnection() {
    if (
      typeof window.supabaseClient !== "function"
    ) {
      throw new Error("Cloud unavailable");
    }

    return await window.supabaseClient();
  }

  /* ============================================================
     PREMIUM DESIGN
     ============================================================ */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      /* COACH PROFILE */

      #${VIEW} #${PROFILE} {
        background: #15171B !important;
        border: 1px solid #4D5660 !important;
        border-radius: 17px !important;
        padding: 15px !important;
        margin: 12px 0 !important;
        box-shadow: none !important;
      }

      #${VIEW} #${PROFILE} * {
        box-sizing: border-box;
      }

      #${PROFILE} .mana-profile-group {
        margin-top: 13px !important;
        padding-top: 12px !important;
      }

      #${PROFILE} .mana-profile-group h3 {
        color: #FF7927 !important;
        font-size: 11px !important;
        font-weight: 900 !important;
        letter-spacing: .08em !important;
        margin: 0 0 9px !important;
      }

      #${PROFILE} .mana-profile-grid {
        gap: 7px !important;
      }

      #${PROFILE} .mana-profile-cell {
        padding: 9px 11px !important;
        min-height: 0 !important;
        height: auto !important;
        background: #101215 !important;
        border: 1px solid #444C56 !important;
        border-radius: 10px !important;
      }

      #${PROFILE} .mana-profile-cell small {
        color: #ABB5C0 !important;
        font-size: 10px !important;
        text-align: left !important;
      }

      #${PROFILE} .mana-profile-cell strong {
        color: #FFFFFF !important;
        font-size: 13px !important;
        font-weight: 750 !important;
        line-height: 1.4 !important;
        text-align: left !important;
      }

      /* FUEL AND RECOVERY */

      #${PROFILE} .mana-premium-fuel-grid {
        display: grid;
        grid-template-columns:
          repeat(2,minmax(0,1fr));
        gap: 8px;
      }

      #${PROFILE} .mana-premium-metric {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 6px;
        background: #101215;
        border: 1px solid #444C56;
        border-radius: 11px;
        padding: 12px;
        min-width: 0;
      }

      #${PROFILE} .mana-premium-metric small {
        color: #B0B9C4;
        font-size: 11px;
        font-weight: 600;
      }

      #${PROFILE} .mana-premium-metric strong {
        color: #FF7927;
        font-size: 22px;
        font-weight: 900;
        line-height: 1.2;
        overflow-wrap: anywhere;
      }

      #${PROFILE} .mana-premium-metric span {
        color: #AAB3BD;
        font-size: 10px;
        line-height: 1.4;
      }

      #${PROFILE} .mana-premium-fuel-note {
        color: #AEB7C1;
        font-size: 11px;
        line-height: 1.5;
        margin: 10px 0 0;
      }

      /* BLOCK REQUEST */

      #${VIEW} #${BLOCK} {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        margin: 13px 0 !important;
        padding: 15px !important;
        background: #15171B !important;
        border: 1px solid #8A6425 !important;
        border-radius: 17px !important;
        box-shadow: none !important;
      }

      #${BLOCK} .m1017-coach-head {
        gap: 12px !important;
      }

      #${BLOCK} button {
        border-radius: 10px !important;
      }

      /* ASSIGNED PROGRAMS */

      #${VIEW} #${ASSIGN} {
        background: #15171B !important;
        border: 1px solid #505862 !important;
        border-radius: 17px !important;
        padding: 15px !important;
        margin: 12px 0 !important;
        box-shadow: none !important;
      }

      #${VIEW} #${ASSIGN} .mca-row {
        background: #101215 !important;
        border-radius: 10px !important;
        padding: 11px !important;
      }

      /* COACHING ACTIONS */

      #${VIEW} #manaV1010ClientActions {
        margin: 12px 0 !important;
      }

      #${VIEW} #manaV1010ClientActions
      .m1010-action {
        background: #1A1D22 !important;
        border: 1px solid #4F5863 !important;
        border-radius: 12px !important;
        box-shadow: none !important;
      }

      /* SUMMARY */

      #${VIEW} #manaV998ClientSummary {
        background: #15171B !important;
        border-radius: 16px !important;
        padding: 14px !important;
        margin: 12px 0 !important;
      }

      /* CHAT */

      #${VIEW} .mana-premium-chat {
        background: #15171B !important;
        border: 1px solid #505862 !important;
        border-radius: 15px !important;
        padding: 15px !important;
      }

      #${VIEW} .mana-premium-chat button {
        background: #15171B !important;
        color: #FF7927 !important;
        border: 1px solid #FF7927 !important;
        border-radius: 10px !important;
        padding: 10px 14px !important;
        font: 800 12px system-ui !important;
        cursor: pointer !important;
      }

      /* PHOTO ACCORDION */

      #${PROFILE} .mana-photo-fold {
        border-radius: 12px !important;
        margin-top: 13px !important;
      }

      #${PROFILE} .mana-photo-card img,
      #${PROFILE} .mana-photo-empty {
        max-height: 165px !important;
      }

      /* MOBILE */

      @media(max-width:600px) {
        #${VIEW} #${PROFILE},
        #${VIEW} #${ASSIGN},
        #${VIEW} #${BLOCK} {
          padding: 12px !important;
        }

        #${PROFILE} .mana-premium-fuel-grid {
          gap: 6px;
        }

        #${PROFILE} .mana-premium-metric {
          padding: 10px;
        }

        #${PROFILE} .mana-premium-metric strong {
          font-size: 18px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     BLOCK REQUEST — PERMANENT POSITION FIX

     The legacy 101700 module recreates the
     request after focus and client changes.

     Observe only the Coach Detail's direct
     children, not the entire document.
     ============================================================ */

  function positionBlock() {
    if (!coachOpen() || arranging) return;

    const view = $(VIEW);
    const block = $(BLOCK);
    const assign = $(ASSIGN);

    if (
      !view ||
      !block ||
      !assign ||
      !view.contains(assign)
    ) {
      return;
    }

    if (
      block.parentElement === view &&
      block.previousElementSibling === assign
    ) {
      return;
    }

    arranging = true;

    try {
      assign.insertAdjacentElement(
        "afterend",
        block
      );
    } finally {
      arranging = false;
    }
  }

  function installBlockObserver() {
    const view = $(VIEW);

    if (!view || detailObserver) return;

    detailObserver = new MutationObserver(() => {
      if (coachOpen()) {
        positionBlock();
        tidyChat();
        attachProfileObserver();
      }
    });

    detailObserver.observe(view, {
      childList: true,
      subtree: false
    });
  }

  /* ============================================================
     CHAT PRESENTATION
     ============================================================ */

  function tidyChat() {
    if (!coachOpen()) return;

    const view = $(VIEW);
    if (!view) return;

    const button = Array.from(
      view.querySelectorAll("button")
    ).find(el =>
      /open client chat/i.test(
        el.textContent || ""
      )
    );

    if (!button) return;

    const card = button.closest(
      ".card, section, article"
    );

    if (
      card &&
      card !== view &&
      !card.contains($(PROFILE))
    ) {
      card.classList.add(
        "mana-premium-chat"
      );
    }
  }

  /* ============================================================
     EXISTING RECOVERY VALUES

     Same source fields used by Mana28.

     Never use a default score when the
     client has no actual recovery record.
     ============================================================ */

  function recoveryScore(record) {
    if (!record || typeof record !== "object") {
      return null;
    }

    const n = number(record.recoveryScore);

    if (n !== null) {
      return Math.min(10, n);
    }

    const level = String(
      record.recoveryLevel || ""
    ).toLowerCase();

    if (level === "good") return 8;
    if (level === "moderate") return 5;

    if (
      level === "low" ||
      level === "needs-attention"
    ) {
      return 3;
    }

    if (record.recovery === true) return 8;

    return null;
  }

  function latestRecovery() {
    const daily = readLocal(DAILY_KEY);
    const fuel = readLocal(FUEL_KEY);

    const dates = Array.from(
      new Set([
        ...Object.keys(daily),
        ...Object.keys(fuel)
      ])
    )
      .filter(key =>
        /^\d{4}-\d{2}-\d{2}$/.test(key)
      )
      .sort()
      .reverse();

    for (const date of dates) {
      const score =
        recoveryScore(daily[date]) ??
        recoveryScore(fuel[date]);

      if (score !== null) {
        return {
          score,
          date
        };
      }
    }

    return null;
  }

  /* ============================================================
     CLIENT-SIDE SYNC

     Uses the client's own authenticated account.

     Existing share_with_coach consent must
     already be true.

     Only updates approved existing profile
     details. It does not create consent.
     ============================================================ */

  async function syncClientFuel() {
    if (syncBusy) return;

    syncBusy = true;

    try {
      const db = await dbConnection();

      const { data: auth, error: authError } =
        await db.auth.getUser();

      if (authError || !auth?.user) return;

      const user = auth.user;

      const { data: role, error: roleError } =
        await db.from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

      if (roleError || role?.role !== "client") {
        return;
      }

      const { data: existing, error } =
        await db.from("client_extended_profiles")
          .select("details,share_with_coach")
          .eq("user_id", user.id)
          .maybeSingle();

      if (
        error ||
        !existing ||
        !existing.share_with_coach
      ) {
        return;
      }

      const profile = readLocal(PROFILE_KEY);
      const targets = readLocal(TARGET_KEY);
      const recovery = latestRecovery();

      const next = {
        ...(existing.details || {})
      };

      let changed = false;

      function update(key, value) {
        if (!hasValue(value)) return;

        if (
          JSON.stringify(next[key]) !==
          JSON.stringify(value)
        ) {
          next[key] = value;
          changed = true;
        }
      }

      if (hasValue(profile.fuelGoal)) {
        update(
          "fuel_goal",
          String(profile.fuelGoal)
        );
      }

      const calories = number(targets.calories);
      const protein = number(targets.protein);
      const water = number(targets.water);

      if (calories !== null && calories > 0) {
        update("calorie_target", calories);
      }

      if (protein !== null && protein > 0) {
        update("protein_target", protein);
      }

      if (water !== null && water > 0) {
        update("fuel_water_target_ml", water);
      }

      if (recovery) {
        update("recovery_score", recovery.score);
        update("recovery_date", recovery.date);
      }

      if (!changed) return;

      const result = await db
        .from("client_extended_profiles")
        .update({
          details: next
        })
        .eq("user_id", user.id);

      if (result.error) {
        console.warn(
          "[Mana Fuel Sync]",
          result.error.message
        );
      }

    } catch (error) {
      console.warn(
        "[Mana Fuel Sync]",
        error
      );
    } finally {
      syncBusy = false;
    }
  }

  function scheduleClientSync(delay = 650) {
    clearTimeout(syncTimer);

    syncTimer = setTimeout(() => {
      void syncClientFuel();
    }, delay);
  }

  /* ============================================================
     COACH — LOAD AUTHORISED FUEL DATA
     ============================================================ */

  async function loadCoachFuel(force = false) {
    if (!coachOpen()) return;

    const person = currentClient();

    if (!person?.id) return;

    if (
      !force &&
      lastClientId === person.id &&
      coachData
    ) {
      renderFuel(person);
      return;
    }

    const ticket = ++coachRequest;

    try {
      const db = await dbConnection();

      const { data, error } =
        await db.from("client_extended_profiles")
          .select("details,share_with_coach")
          .eq("user_id", person.id)
          .maybeSingle();

      if (ticket !== coachRequest) return;

      if (
        !coachOpen() ||
        currentClient()?.id !== person.id
      ) {
        return;
      }

      if (error) {
        throw error;
      }

      lastClientId = person.id;

      coachData = data?.share_with_coach
        ? data.details || {}
        : {};

      renderFuel(person);

    } catch (error) {
      console.warn(
        "[Mana Coach Fuel]",
        error
      );
    }
  }

  /* ============================================================
     FUEL DISPLAY
     ============================================================ */

  function metric(label, value, note) {
    return `
      <div class="mana-premium-metric">
        <small>${safe(label)}</small>
        <strong>${safe(value)}</strong>
        <span>${safe(note)}</span>
      </div>
    `;
  }

  function renderFuel(person) {
    const panel = $(PROFILE);

    if (
      !coachOpen() ||
      !panel ||
      !person ||
      currentClient()?.id !== person.id ||
      !coachData
    ) {
      return;
    }

    const d = coachData;

    const calories =
      number(d.calorie_target) ??
      number(d.daily_calories);

    const protein =
      number(d.protein_target) ??
      number(d.daily_protein);

    const waterML =
      number(d.fuel_water_target_ml);

    const recovery =
      number(d.recovery_score);

    const waterText =
      waterML !== null
        ? (waterML / 1000).toFixed(2).replace(/0+$/, "").replace(/\.$/, "") + " L"
        : hasValue(d.water_target)
          ? String(d.water_target) + " L"
          : "—";

    const score =
      recovery === null
        ? "—"
        : Math.min(10, recovery) + " / 10";

    const goal =
      d.fuel_goal ||
      d.fuelGoal ||
      d.food_goal ||
      "";

    const fuelGroup = Array.from(
      panel.querySelectorAll(
        ".mana-profile-group"
      )
    ).find(group =>
      /fuel\s*&\s*nutrition/i.test(
        group.querySelector("h3")
          ?.textContent || ""
      )
    );

    if (!fuelGroup) return;

    const grid = fuelGroup.querySelector(
      ".mana-profile-grid"
    );

    if (!grid) return;

    const html = `
      <div class="mana-premium-fuel-grid">
        ${metric(
          "Daily Calories",
          calories === null
            ? "—"
            : calories.toLocaleString() + " kcal",
          "Saved client target"
        )}

        ${metric(
          "Daily Protein",
          protein === null
            ? "—"
            : protein + " g",
          "Saved client target"
        )}

        ${metric(
          "Daily Water",
          waterText,
          "Saved client target"
        )}

        ${metric(
          "Recovery",
          score,
          d.recovery_date
            ? "Recorded " + d.recovery_date
            : "Latest recorded score"
        )}
      </div>

      ${
        goal
          ? `<p class="mana-premium-fuel-note">
               Food goal: ${safe(goal)}
             </p>`
          : ""
      }
    `;

    const signature =
      JSON.stringify({
        person: person.id,
        calories,
        protein,
        waterText,
        recovery,
        goal,
        date: d.recovery_date
      });

    if (
      grid.dataset.manaPremiumSignature ===
      signature
    ) {
      return;
    }

    grid.innerHTML = html;
    grid.dataset.manaPremiumSignature = signature;
  }

  /* ============================================================
     PROFILE REDRAW

     The existing profile renderer may
     replace the Fuel section after its
     cloud response. Watch only the
     profile panel for that redraw.
     ============================================================ */

  function attachProfileObserver() {
    const panel = $(PROFILE);

    if (!panel || panel === observedProfile) return;

    if (profileObserver) {
      profileObserver.disconnect();
    }

    observedProfile = panel;

    profileObserver = new MutationObserver(() => {
      if (!coachOpen()) return;

      const person = currentClient();

      if (
        person?.id === lastClientId &&
        coachData
      ) {
        renderFuel(person);
      }
    });

    profileObserver.observe(panel, {
      childList: true,
      subtree: false
    });
  }

  /* ============================================================
     CLIENT SWITCH
     ============================================================ */

  function onClientOpen() {
    lastClientId = "";
    coachData = null;

    ++coachRequest;

    [250, 650, 1300].forEach(delay => {
      setTimeout(() => {
        if (!coachOpen()) return;

        positionBlock();
        tidyChat();
        attachProfileObserver();

        void loadCoachFuel();
      }, delay);
    });
  }

  /* ============================================================
     INITIALISE
     ============================================================ */

  function init() {
    installStyles();

    installBlockObserver();
    attachProfileObserver();

    document.addEventListener(
      "click",
      event => {
        if (
          event.target.closest?.(
            ".client-open[data-client-id]"
          )
        ) {
          onClientOpen();
        }

        if (
          event.target.closest?.(
            "#manaProfileSave"
          )
        ) {
          scheduleClientSync(900);
        }
      },
      true
    );

    window.addEventListener(
      "mana:profile-synced",
      () => {
        scheduleClientSync(1100);
      }
    );

    document.addEventListener(
      "change",
      event => {
        const element = event.target;

        if (
          element?.closest?.(
            "#fuelV58TargetsModal"
          ) ||
          element?.closest?.(
            "#manaProfileScreen"
          )
        ) {
          scheduleClientSync(900);
        }
      }
    );

    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.hidden) return;

        positionBlock();

        if (coachOpen()) {
          attachProfileObserver();
          void loadCoachFuel(true);
        } else {
          scheduleClientSync(1100);
        }
      }
    );

    window.addEventListener(
      "focus",
      () => {
        if (coachOpen()) {
          positionBlock();
          attachProfileObserver();
        } else {
          scheduleClientSync(1100);
        }
      }
    );

    /* Initial client sync after sign-in
       has had an opportunity to restore
       the saved profile. */

    setTimeout(() => {
      scheduleClientSync(200);
    }, 1800);

    if (coachOpen()) {
      positionBlock();
      tidyChat();
      void loadCoachFuel();
    }

    window.MANA_PREMIUM_BUILD = BUILD;

    console.log(
      "[Mana Movement] Premium Coach Hub " +
      BUILD +
      " active"
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
