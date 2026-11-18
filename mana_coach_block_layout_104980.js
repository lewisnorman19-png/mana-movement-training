
/* ============================================================
   MANA MOVEMENT TRAINING
   COACH HUB + FUEL PROFILE FINISH
   BUILD 104981

   COMPLETE REPLACEMENT FOR:
   mana_coach_block_layout_104980.js

   - Premium compact Fuel layout
   - Automatic calorie and protein targets
   - Daily activity selection
   - Recommended water from body weight
   - Recommended recovery target: 8/10
   - Actual recovery score shown separately
   - Client-to-coach secure Fuel sync
   - Block Request positioned below programs

   PRESERVES:
   View Client, Program Builder, Chat,
   client information, photographs, workouts,
   navigation and existing Supabase policies.
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104981";
  const FLAG = "MANA_PREMIUM_104981";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const $ = id => document.getElementById(id);

  const VIEW = "coachClientDetailView";
  const PROFILE = "manaCoachProfile104950";
  const BLOCK = "manaV1017CoachRequest";
  const ASSIGN = "manaCoachAssignments104720";

  const PROFILE_KEY = "mana-profile-v67";
  const TARGET_KEY = "mana-fuel-v58-targets";
  const DAILY_KEY = "mana-strength-v866-daily";
  const FUEL_KEY = "mana-fuel-v571";

  const STYLE_ID = "manaPremiumStyle104981";
  const FUEL_ID = "manaPremiumFuel104981";
  const ACTIVITY_ID = "manaPremiumActivity104981";

  const RECOVERY_TARGET = 8;

  let coachClientId = "";
  let coachData = null;
  let coachTicket = 0;
  let syncing = false;
  let syncTimer = null;
  let blockObserver = null;
  let profileObserver = null;
  let observedProfile = null;
  let movingBlock = false;

  const activityFactors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  const escapeHTML = value =>
    String(value ?? "").replace(
      /[&<>"']/g,
      c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[c]
    );

  function read(key) {
    try {
      const data = JSON.parse(
        localStorage.getItem(key) || "{}"
      );

      return data &&
        typeof data === "object"
          ? data
          : {};
    } catch (_) {
      return {};
    }
  }

  function write(key, value) {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  }

  function numeric(value) {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) return null;

    const n = Number(value);

    return Number.isFinite(n)
      ? n
      : null;
  }

  function available(value) {
    return (
      value !== null &&
      value !== undefined &&
      String(value).trim() !== ""
    );
  }

  function detailOpen() {
    const view = $(VIEW);

    return Boolean(
      view &&
      !view.hidden &&
      !view.classList.contains("hide")
    );
  }

  function selectedClient() {
    try {
      if (
        typeof selectedCoachClient !== "undefined" &&
        selectedCoachClient?.userId
      ) {
        return {
          id: String(selectedCoachClient.userId),
          name:
            selectedCoachClient.clientName || "Client"
        };
      }
    } catch (_) {}

    return null;
  }

  async function db() {
    if (
      typeof window.supabaseClient !== "function"
    ) {
      throw Error("Mana cloud unavailable");
    }

    return await window.supabaseClient();
  }

  /* ============================================================
     CALCULATION — USE EXISTING PROFILE VALUES

     If daily activity is selected, it becomes
     the activity multiplier.

     Otherwise retain the original training-day
     multiplier used by Mana Movement.
     ============================================================ */

  function calculate(profile) {
    const age = numeric(profile.age);
    const height = numeric(profile.height);
    const weight = numeric(profile.weight);
    const days = numeric(profile.days) || 0;

    if (
      age === null ||
      height === null ||
      weight === null ||
      age <= 0 ||
      height <= 0 ||
      weight <= 0
    ) return null;

    const gender = String(
      profile.gender || ""
    ).toLowerCase();

    const goal = String(
      profile.fuelGoal || "Maintenance"
    ).toLowerCase();

    const base =
      10 * weight +
      6.25 * height -
      5 * age;

    const bmr =
      gender === "male"
        ? base + 5
        : gender === "female"
          ? base - 161
          : base - 78;

    let factor =
      days >= 5 ? 1.7 :
      days === 4 ? 1.6 :
      days === 3 ? 1.5 : 1.4;

    const selectedFactor =
      activityFactors[profile.dailyActivity];

    if (selectedFactor) {
      factor = selectedFactor;
    }

    let calories = bmr * factor;
    let proteinFactor = 1.6;

    if (
      goal === "weight loss" ||
      goal === "lose weight"
    ) {
      calories *= 0.85;
      proteinFactor = 2.0;
    }

    if (
      goal === "build muscle" ||
      goal === "muscle gain"
    ) {
      calories *= 1.08;
      proteinFactor = 1.8;
    }

    return {
      calories:
        Math.round(calories / 50) * 50,

      protein:
        Math.round(weight * proteinFactor),

      water:
        Math.round(weight * 35 / 100) * 100,

      recoveryTarget: RECOVERY_TARGET
    };
  }

  /* ============================================================
     CLIENT PROFILE — DAILY ACTIVITY INPUT
     ============================================================ */

  function installActivitySelector() {
    const screen = $("manaProfileScreen");

    if (!screen || $(ACTIVITY_ID)) return;

    const fuelGoal = $("manaProfileFuelGoal");

    if (!fuelGoal) return;

    const wrapper = document.createElement("div");

    wrapper.className = "mana-premium-activity";

    wrapper.innerHTML = `
      <label for="${ACTIVITY_ID}">
        Daily activity outside workouts
      </label>

      <select id="${ACTIVITY_ID}">
        <option value="">
          Use current training-day estimate
        </option>
        <option value="sedentary">
          Mostly sitting
        </option>
        <option value="light">
          Light movement
        </option>
        <option value="moderate">
          Moderately active
        </option>
        <option value="active">
          Very active
        </option>
        <option value="very_active">
          Extremely active
        </option>
      </select>

      <p>
        This adjusts your calorie estimate
        without changing your training goal.
      </p>
    `;

    const anchor =
      fuelGoal.closest(
        ".mana-profile-field, .mana-profile-row"
      ) || fuelGoal.parentElement;

    if (anchor) {
      anchor.insertAdjacentElement(
        "afterend",
        wrapper
      );
    }

    const select = $(ACTIVITY_ID);

    if (!select) return;

    select.value =
      read(PROFILE_KEY).dailyActivity || "";

    select.addEventListener("change", () => {
      const profile = read(PROFILE_KEY);

      profile.dailyActivity = select.value;
      profile.updatedAt = new Date().toISOString();

      write(PROFILE_KEY, profile);

      calculateAndSave();

      queueSync(450);
    });
  }

  function calculateAndSave() {
    const profile = read(PROFILE_KEY);

    const selector = $(ACTIVITY_ID);

    if (
      selector &&
      selector.value !==
        (profile.dailyActivity || "")
    ) {
      profile.dailyActivity = selector.value;
      write(PROFILE_KEY, profile);
    }

    const result = calculate(profile);

    if (!result) return null;

    /*
     Preserve unrelated Fuel fields such as
     carbohydrates and fat.
    */

    const saved = read(TARGET_KEY);

    write(TARGET_KEY, {
      ...saved,
      calories: result.calories,
      protein: result.protein,
      water: result.water
    });

    const calories = $("manaProfileFuelCalories");
    const protein = $("manaProfileFuelProtein");

    if (calories) {
      calories.textContent =
        result.calories.toLocaleString() + " cal";
    }

    if (protein) {
      protein.textContent =
        result.protein + "g";
    }

    return result;
  }

  /* ============================================================
     RECOVERY — ACTUAL LATEST SAVED SCORE
     ============================================================ */

  function scoreFrom(record) {
    if (!record) return null;

    const score = numeric(record.recoveryScore);

    if (score !== null) {
      return Math.min(10, Math.max(0, score));
    }

    const level = String(
      record.recoveryLevel || ""
    ).toLowerCase();

    if (level === "good") return 8;
    if (level === "moderate") return 5;

    if (
      level === "low" ||
      level === "needs-attention"
    ) return 3;

    if (record.recovery === true) return 8;

    return null;
  }

  function latestRecovery() {
    const daily = read(DAILY_KEY);
    const fuel = read(FUEL_KEY);

    const dates = [
      ...new Set([
        ...Object.keys(daily),
        ...Object.keys(fuel)
      ])
    ]
      .filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d))
      .sort()
      .reverse();

    for (const date of dates) {
      const score =
        scoreFrom(daily[date]) ??
        scoreFrom(fuel[date]);

      if (score !== null) {
        return { score, date };
      }
    }

    return null;
  }

  /* ============================================================
     CLOUD SYNC — CLIENT'S OWN DATA ONLY
     ============================================================ */

  async function syncClient() {
    if (syncing) return;

    syncing = true;

    try {
      const client = await db();

      const { data: auth, error: authError } =
        await client.auth.getUser();

      if (authError || !auth?.user) return;

      const userId = auth.user.id;

      const { data: role, error: roleError } =
        await client.from("profiles")
          .select("role")
          .eq("id", userId)
          .maybeSingle();

      if (
        roleError ||
        role?.role !== "client"
      ) return;

      const { data: existing, error } =
        await client
          .from("client_extended_profiles")
          .select("details,share_with_coach")
          .eq("user_id", userId)
          .maybeSingle();

      if (
        error ||
        !existing ||
        !existing.share_with_coach
      ) return;

      const result = calculateAndSave();

      if (!result) return;

      const profile = read(PROFILE_KEY);
      const recovery = latestRecovery();

      const details = {
        ...(existing.details || {})
      };

      details.fuel_goal =
        profile.fuelGoal || "";

      details.daily_activity =
        profile.dailyActivity || "";

      details.calorie_target = result.calories;
      details.protein_target = result.protein;

      details.fuel_water_target_ml =
        result.water;

      details.recovery_target =
        result.recoveryTarget;

      if (recovery) {
        details.recovery_score =
          recovery.score;

        details.recovery_date =
          recovery.date;
      }

      if (
        JSON.stringify(details) ===
        JSON.stringify(existing.details || {})
      ) return;

      const update = await client
        .from("client_extended_profiles")
        .update({ details })
        .eq("user_id", userId);

      if (update.error) {
        console.warn(
          "[Mana Fuel Sync]",
          update.error.message
        );
      }

    } catch (error) {
      console.warn(
        "[Mana Fuel Sync]",
        error
      );
    } finally {
      syncing = false;
    }
  }

  function queueSync(delay = 700) {
    clearTimeout(syncTimer);

    syncTimer = setTimeout(
      () => void syncClient(),
      delay
    );
  }

  /* ============================================================
     PREMIUM FUEL CARDS
     SAME TWO-COLUMN WIDTH AS TRAINING
     ============================================================ */

  function metric(label, value, description) {
    return `
      <div class="mana-premium-fuel-item">
        <small>${escapeHTML(label)}</small>
        <strong>${escapeHTML(value)}</strong>
        <span>${escapeHTML(description)}</span>
      </div>
    `;
  }

  function renderFuel() {
    const panel = $(PROFILE);
    const person = selectedClient();

    if (
      !detailOpen() ||
      !panel ||
      !person ||
      person.id !== coachClientId ||
      !coachData
    ) return;

    const section = Array.from(
      panel.querySelectorAll(
        ".mana-profile-group"
      )
    ).find(node =>
      /fuel\s*&\s*nutrition/i.test(
        node.querySelector("h3")
          ?.textContent || ""
      )
    );

    if (!section) return;

    const grid = section.querySelector(
      ".mana-profile-grid"
    );

    if (!grid) return;

    const d = coachData;

    const calories =
      numeric(d.calorie_target);

    const protein =
      numeric(d.protein_target);

    const waterML =
      numeric(d.fuel_water_target_ml);

    const recorded =
      numeric(d.recovery_score);

    const recoveryTarget =
      numeric(d.recovery_target) ??
      RECOVERY_TARGET;

    const water =
      waterML !== null
        ? (waterML / 1000)
            .toFixed(2)
            .replace(/0+$/, "")
            .replace(/\.$/, "") + " L"
        : available(d.water_target)
          ? d.water_target + " L"
          : "—";

    const html = `
      ${metric(
        "Daily Calories",
        calories !== null
          ? calories.toLocaleString() + " kcal"
          : "—",
        "Calculated from client profile"
      )}

      ${metric(
        "Daily Protein",
        protein !== null
          ? protein + " g"
          : "—",
        "Calculated from body weight and goal"
      )}

      ${metric(
        "Daily Water",
        water,
        "Recommended from body weight"
      )}

      ${metric(
        "Recovery Target",
        recoveryTarget + " / 10",
        "Recommended daily target"
      )}

      ${metric(
        "Last Recovery Score",
        recorded !== null
          ? recorded + " / 10"
          : "Not recorded",
        d.recovery_date ||
        "Awaiting client check-in"
      )}

      ${metric(
        "Nutrition Goal",
        d.fuel_goal || "Not shared",
        "Client's selected goal"
      )}
    `;

    if (grid.dataset.premiumHTML === html) {
      return;
    }

    grid.classList.add(
      "mana-premium-fuel-grid"
    );

    grid.innerHTML = html;
    grid.dataset.premiumHTML = html;
  }

  async function loadCoachFuel() {
    if (!detailOpen()) return;

    const person = selectedClient();

    if (!person?.id) return;

    const ticket = ++coachTicket;

    try {
      const client = await db();

      const { data, error } =
        await client
          .from("client_extended_profiles")
          .select("details,share_with_coach")
          .eq("user_id", person.id)
          .maybeSingle();

      if (ticket !== coachTicket) return;

      if (
        !detailOpen() ||
        selectedClient()?.id !== person.id
      ) return;

      if (error) throw error;

      coachClientId = person.id;

      coachData =
        data?.share_with_coach
          ? data.details || {}
          : {};

      renderFuel();

    } catch (error) {
      console.warn(
        "[Mana Coach Fuel]",
        error
      );
    }
  }

  /* ============================================================
     BLOCK REQUEST — KEEP BELOW ASSIGNED PROGRAMS
     ============================================================ */

  function moveBlock() {
    if (!detailOpen() || movingBlock) return;

    const view = $(VIEW);
    const block = $(BLOCK);
    const assign = $(ASSIGN);

    if (
      !view ||
      !block ||
      !assign ||
      !view.contains(assign)
    ) return;

    if (
      block.previousElementSibling === assign &&
      block.parentElement === assign.parentElement
    ) return;

    movingBlock = true;

    try {
      assign.insertAdjacentElement(
        "afterend",
        block
      );
    } finally {
      movingBlock = false;
    }
  }

  /* ============================================================
     OBSERVE ONLY KNOWN DYNAMIC CONTAINERS
     ============================================================ */

  function attachObservers() {
    const view = $(VIEW);

    if (view && !blockObserver) {
      blockObserver = new MutationObserver(() => {
        if (detailOpen()) {
          moveBlock();
          attachObservers();
        }
      });

      blockObserver.observe(view, {
        childList: true,
        subtree: false
      });
    }

    const panel = $(PROFILE);

    if (
      panel &&
      observedProfile !== panel
    ) {
      profileObserver?.disconnect();
      observedProfile = panel;

      profileObserver = new MutationObserver(() => {
        if (!detailOpen()) return;

        const person = selectedClient();

        if (
          person?.id === coachClientId &&
          coachData
        ) {
          renderFuel();
        }
      });

      profileObserver.observe(panel, {
        childList: true,
        subtree: false
      });
    }
  }

  /* ============================================================
     COACH HUB PREMIUM STYLES
     ============================================================ */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      #${VIEW} #${PROFILE},
      #${VIEW} #${ASSIGN} {
        background: #15171B !important;
        border: 1px solid #4E5660 !important;
        border-radius: 16px !important;
        padding: 15px !important;
        margin: 12px 0 !important;
        box-shadow: none !important;
      }

      #${PROFILE} .mana-profile-grid {
        display: grid !important;
        grid-template-columns:
          repeat(2,minmax(0,1fr)) !important;
        gap: 7px !important;
      }

      #${PROFILE} .mana-profile-cell {
        padding: 9px 11px !important;
        min-height: 0 !important;
        height: auto !important;
        border-radius: 10px !important;
      }

      #${PROFILE} .mana-premium-fuel-grid {
        width: 100% !important;
        display: grid !important;
        grid-template-columns:
          repeat(2,minmax(0,1fr)) !important;
        gap: 7px !important;
      }

      #${PROFILE} .mana-premium-fuel-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 4px;

        width: 100%;
        min-width: 0;
        min-height: 0;
        height: auto;

        background: #101215;
        border: 1px solid #424A55;
        border-radius: 10px;
        padding: 9px 11px;
        box-sizing: border-box;
      }

      #${PROFILE} .mana-premium-fuel-item small {
        display: block;
        width: 100%;
        color: #ADB6C1;
        font-size: 10px;
        line-height: 1.3;
        text-align: left;
      }

      #${PROFILE} .mana-premium-fuel-item strong {
        display: block;
        width: 100%;
        color: #FF7927;
        font-size: 16px;
        font-weight: 850;
        line-height: 1.3;
        text-align: left;
        overflow-wrap: anywhere;
      }

      #${PROFILE} .mana-premium-fuel-item span {
        display: block;
        color: #AEB7C2;
        font-size: 10px;
        line-height: 1.3;
        text-align: left;
      }

      #${VIEW} #${BLOCK} {
        background: #15171B !important;
        border: 1px solid #8A6425 !important;
        border-radius: 16px !important;
        padding: 15px !important;
        margin: 12px 0 !important;
        box-shadow: none !important;
      }

      #${VIEW} #${BLOCK} button {
        border-radius: 10px !important;
      }

      #${VIEW} #manaV1010ClientActions,
      #${VIEW} #manaV998ClientSummary {
        margin: 12px 0 !important;
      }

      #manaProfileScreen .mana-premium-activity {
        margin: 12px 0;
      }

      #manaProfileScreen .mana-premium-activity label {
        display: block;
        color: #C1C6CE;
        font-size: 13px;
        font-weight: 700;
        margin-bottom: 7px;
      }

      #manaProfileScreen .mana-premium-activity select {
        display: block;
        width: 100%;
        background: #101215;
        color: #FFFFFF;
        border: 1px solid #555D66;
        border-radius: 10px;
        padding: 12px;
        font-size: 14px;
      }

      #manaProfileScreen .mana-premium-activity p {
        color: #AEB7C2;
        font-size: 11px;
        line-height: 1.5;
        margin: 7px 0;
      }

      @media(max-width:600px) {
        #${VIEW} #${PROFILE},
        #${VIEW} #${ASSIGN},
        #${VIEW} #${BLOCK} {
          padding: 12px !important;
        }

        #${PROFILE} .mana-profile-grid,
        #${PROFILE} .mana-premium-fuel-grid {
          grid-template-columns: 1fr !important;
          gap: 6px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     STARTUP AND EVENTS
     ============================================================ */

  function clientOpened() {
    coachClientId = "";
    coachData = null;
    ++coachTicket;

    [250, 650, 1200].forEach(delay => {
      setTimeout(() => {
        if (!detailOpen()) return;

        attachObservers();
        moveBlock();

        void loadCoachFuel();
      }, delay);
    });
  }

  function init() {
    installStyles();
    attachObservers();

    document.addEventListener(
      "click",
      event => {
        if (
          event.target.closest?.(
            ".client-open[data-client-id]"
          )
        ) {
          clientOpened();
        }

        if (
          event.target.closest?.(
            "#manaProfileSave"
          )
        ) {
          setTimeout(() => {
            calculateAndSave();
            queueSync(550);
          }, 180);
        }
      },
      true
    );

    document.addEventListener(
      "change",
      event => {
        if (
          event.target?.closest?.(
            "#manaProfileScreen"
          )
        ) {
          queueSync(1100);
        }
      }
    );

    window.addEventListener(
      "mana:profile-synced",
      () => {
        queueSync(700);
      }
    );

    window.addEventListener(
      "focus",
      () => {
        if (detailOpen()) {
          moveBlock();
          attachObservers();
          void loadCoachFuel();
        } else {
          installActivitySelector();
        }
      }
    );

    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.hidden) return;

        if (detailOpen()) {
          moveBlock();
          attachObservers();
          void loadCoachFuel();
        } else {
          installActivitySelector();
        }
      }
    );

    document.addEventListener(
      "click",
      event => {
        if (
          event.target.closest?.(
            "#manaProfileScreen"
          )
        ) {
          installActivitySelector();
        }
      }
    );

    installActivitySelector();

    if (detailOpen()) {
      clientOpened();
    }

    /*
     Profile screen may be created lazily
     after the user opens it.
    */

    document.addEventListener(
      "click",
      event => {
        if (
          event.target.closest?.(
            "[data-open-profile], #manaProfileButton"
          )
        ) {
          setTimeout(
            installActivitySelector,
            100
          );
        }
      }
    );

    console.log(
      "[Mana Movement] Coach Premium " +
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
