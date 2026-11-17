
/* ============================================================
   MANA MOVEMENT TRAINING
   COMPLETE COACH PROFILE REPAIR
   BUILD 104970

   FIXES
   - Missing training and goal information
   - Missing available nutrition information
   - Oversized client detail boxes
   - Profile reverting to older presentation
   - Compact and consistent client sections
   - Retains starting and progress photos
   - Keeps original Coach Hub navigation

   DATABASE
   READ ONLY:
   - client_extended_profiles
   - profile_settings

   NO DATABASE WRITES
   NO AUTHENTICATION CHANGES
   NO VIEW CLIENT FUNCTION REPLACEMENT
   NO PROGRAM BUILDER CHANGES
   NO CHAT CHANGES
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104970";

  if (window.MANA_PROFILE_COMPLETE_104970) return;

  window.MANA_PROFILE_COMPLETE_104970 = true;

  const $ = id => document.getElementById(id);

  const VIEW = "coachClientDetailView";
  const PROFILE = "manaCoachProfile104950";
  const STYLE = "manaProfileCompleteStyle104970";

  let activeId = "";
  let generation = 0;
  let pending = [];
  let lastData = null;
  let lastClientId = "";

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

  function isOpen() {
    const view = $(VIEW);

    return !!(
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

    if (activeId) {
      return {
        id: activeId,
        name:
          $("detailClientName")?.textContent?.trim() ||
          "Client"
      };
    }

    return null;
  }

  /* ============================================================
     PREMIUM COMPACT STYLING
     ============================================================ */

  function installStyle() {
    if ($(STYLE)) return;

    const style = document.createElement("style");

    style.id = STYLE;

    style.textContent = `

      #${VIEW} #${PROFILE} {
        background: #15171B !important;
        border: 1px solid #4B535E !important;
        border-radius: 18px !important;
        padding: 16px !important;
        margin: 12px 0 !important;
        color: #FFFFFF !important;
        box-sizing: border-box !important;
      }

      #${PROFILE} *,
      #${PROFILE} *::before,
      #${PROFILE} *::after {
        box-sizing: border-box !important;
      }

      #${PROFILE} .mcp-kicker,
      #${PROFILE} .mpc-kicker {
        font-size: 10px !important;
        color: #FF7927 !important;
        letter-spacing: .12em !important;
        font-weight: 900 !important;
        text-transform: uppercase !important;
      }

      #${PROFILE} h3 {
        font-size: 17px !important;
        line-height: 1.25 !important;
        margin: 5px 0 10px !important;
        color: white !important;
      }

      #${PROFILE} .mpc-section {
        margin: 13px 0 0 !important;
      }

      #${PROFILE} .mpc-grid {
        display: grid !important;
        grid-template-columns:
          repeat(2, minmax(0,1fr)) !important;
        grid-auto-rows: auto !important;
        gap: 8px !important;
        align-items: stretch !important;
      }

      #${PROFILE} .mpc-item,
      #${PROFILE} .mcp-detail {
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        justify-content: center !important;

        width: auto !important;
        height: auto !important;
        min-height: 0 !important;
        max-height: none !important;

        padding: 10px 12px !important;
        margin: 0 !important;
        gap: 3px !important;

        background: #101215 !important;
        border: 1px solid #444C57 !important;
        border-radius: 10px !important;

        text-align: left !important;
        overflow-wrap: anywhere !important;
      }

      #${PROFILE} .mpc-item small,
      #${PROFILE} .mcp-detail small {
        display: block !important;
        width: 100% !important;

        margin: 0 !important;
        padding: 0 !important;

        color: #ADB6C1 !important;
        font-size: 10px !important;
        font-weight: 500 !important;
        line-height: 1.3 !important;
        text-align: left !important;
      }

      #${PROFILE} .mpc-item strong,
      #${PROFILE} .mcp-detail strong {
        display: block !important;
        width: 100% !important;

        margin: 0 !important;
        padding: 0 !important;

        color: #FFFFFF !important;
        font-size: 13px !important;
        font-weight: 750 !important;
        line-height: 1.4 !important;
        text-align: left !important;
        white-space: pre-wrap !important;
        overflow-wrap: anywhere !important;
      }

      #${PROFILE} .mpc-line {
        height: 1px;
        background: #343C46;
        margin: 13px 0;
      }

      #${PROFILE} .mpc-note {
        color: #B6BEC8;
        font-size: 11px;
        line-height: 1.5;
        margin: 8px 0;
      }

      /* PHOTOS */

      #${PROFILE} .mpc-photo-fold {
        background: #111317 !important;
        border: 1px solid #454D57 !important;
        border-radius: 12px !important;
        margin-top: 14px !important;
        overflow: hidden !important;
      }

      #${PROFILE} .mpc-photo-fold > summary {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        list-style: none;
        padding: 13px;
        font-size: 14px;
        font-weight: 800;
      }

      #${PROFILE} .mpc-photo-fold
      > summary::-webkit-details-marker {
        display: none;
      }

      #${PROFILE} .mpc-photo-fold
      > summary::after {
        content: "⌄";
        color: #FF7927;
        font-size: 22px;
      }

      #${PROFILE} .mpc-photo-fold[open]
      > summary::after {
        transform: rotate(180deg);
      }

      #${PROFILE} .mpc-photo-content {
        padding: 0 12px 13px;
      }

      #${PROFILE} .mcp-photos {
        display: grid !important;
        grid-template-columns:
          repeat(3,minmax(0,1fr)) !important;
        gap: 8px !important;
      }

      #${PROFILE} .mcp-photo {
        padding: 7px !important;
        border-radius: 9px !important;
        background: #0E1013 !important;
        min-width: 0 !important;
      }

      #${PROFILE} .mcp-photo img,
      #${PROFILE} .mcp-empty-photo {
        width: 100% !important;
        max-width: 150px !important;
        height: auto !important;
        max-height: 180px !important;
        aspect-ratio: 3/4 !important;
        object-fit: cover !important;
        margin: 0 auto 6px !important;
      }

      #${PROFILE} .mcp-empty-photo {
        display: flex !important;
        align-items: center;
        justify-content: center;
        color: #AAB3BF !important;
        border: 1px dashed #59616C !important;
        border-radius: 8px !important;
      }

      /* OTHER COACH SECTIONS */

      #${VIEW} #manaCoachAssignments104720,
      #${VIEW} #manaV998ClientSummary {
        padding: 14px !important;
        margin: 11px 0 !important;
        border-radius: 15px !important;
      }

      #${VIEW} .mct-chat-card {
        padding: 14px !important;
        border-radius: 14px !important;
      }

      @media (max-width:600px) {
        #${VIEW} #${PROFILE} {
          padding: 12px !important;
        }

        #${PROFILE} .mpc-grid {
          grid-template-columns: 1fr !important;
          gap: 6px !important;
        }

        #${PROFILE} .mpc-item {
          padding: 9px 11px !important;
        }

        #${PROFILE} .mcp-photos {
          gap: 5px !important;
        }

        #${PROFILE} .mcp-photo {
          padding: 4px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     DATE FORMATTING
     ============================================================ */

  function dateText(value) {
    const raw = String(value || "");

    if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      return raw;
    }

    const [year, month, day] =
      raw.split("-").map(Number);

    const date = new Date(
      Date.UTC(year, month - 1, day)
    );

    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      return raw;
    }

    return new Intl.DateTimeFormat(
      "en-AU",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC"
      }
    ).format(date);
  }

  /* ============================================================
     DATA DISPLAY HELPERS
     ============================================================ */

  function valuePresent(value) {
    return (
      value !== null &&
      value !== undefined &&
      String(value).trim() !== ""
    );
  }

  function item(label, value) {
    if (!valuePresent(value)) return "";

    return `
      <div class="mpc-item">
        <small>${escapeHTML(label)}</small>
        <strong>${escapeHTML(value)}</strong>
      </div>
    `;
  }

  function section(title, contents) {
    if (!contents.trim()) return "";

    return `
      <section class="mpc-section">
        <div class="mpc-kicker">
          ${escapeHTML(title)}
        </div>

        <div class="mpc-grid">
          ${contents}
        </div>
      </section>
    `;
  }

  function numberText(value, unit = "") {
    if (!valuePresent(value)) return "";

    const n = Number(value);

    return Number.isFinite(n)
      ? `${n}${unit}`
      : String(value);
  }

  /* ============================================================
     LOAD BOTH PROFILE SOURCES

     Existing contact information:
       client_extended_profiles

     Original training information:
       profile_settings

     Missing or permission-restricted data
     is never guessed.
     ============================================================ */

  async function fetchProfile(id) {
    if (
      typeof window.supabaseClient !== "function"
    ) {
      throw Error("Cloud connection unavailable");
    }

    const db = await window.supabaseClient();

    const { data: auth, error: authError } =
      await db.auth.getUser();

    if (authError || !auth?.user) {
      throw Error("Please sign in");
    }

    const [extended, training] =
      await Promise.all([
        db.from("client_extended_profiles")
          .select("details,share_with_coach")
          .eq("user_id", id)
          .maybeSingle(),

        db.from("profile_settings")
          .select(
            "name,age,height_cm,weight_kg," +
            "training_days,goal,experience,equipment"
          )
          .eq("user_id", id)
          .maybeSingle()
      ]);

    return {
      extended: extended.error
        ? null
        : extended.data,

      training: training.error
        ? null
        : training.data,

      extendedError: extended.error,
      trainingError: training.error
    };
  }

  /* ============================================================
     PHOTO PRESERVATION

     These photo grids are created by 104950.
     We move the existing nodes, preserving
     signed URLs and loaded photographs.
     ============================================================ */

  function retainPhotoElements(panel) {
    const oldFold = $("manaCoachPhotoFold104960");

    const baseline = $("mcpBaseline104950");
    const progress = $("mcpHistory104950");

    return {
      baseline,
      progress,
      wasOpen: !!oldFold?.open,
      valid:
        !!baseline &&
        !!progress &&
        panel.contains(baseline) &&
        panel.contains(progress)
    };
  }

  function insertPhotoSection(panel, photos) {
    if (!photos.valid) return;

    const fold = document.createElement("details");

    fold.className = "mpc-photo-fold";
    fold.id = "manaCompletePhotoFold104970";

    fold.open = photos.wasOpen;

    fold.innerHTML = `
      <summary>
        Starting &amp; Progress Photos
      </summary>

      <div class="mpc-photo-content">
        <h3>Starting Photos</h3>

        <div id="mpcStartingSlot104970"></div>

        <div class="mpc-line"></div>

        <h3>Progress Check-ins</h3>

        <div id="mpcProgressSlot104970"></div>
      </div>
    `;

    panel.appendChild(fold);

    $("mpcStartingSlot104970")
      .appendChild(photos.baseline);

    $("mpcProgressSlot104970")
      .appendChild(photos.progress);
  }

  /* ============================================================
     RENDER COMPACT CLIENT PROFILE
     ============================================================ */

  function render(person, data) {
    if (!isOpen()) return;

    const panel = $(PROFILE);

    if (!panel) return;

    const live = currentClient();

    if (!live || live.id !== person.id) return;

    const details =
      data.extended?.share_with_coach
        ? data.extended.details || {}
        : {};

    const training = data.training || {};

    const personal = [
      item(
        "Full name",
        [
          details.first_name,
          details.last_name
        ].filter(Boolean).join(" ") ||
        training.name ||
        person.name
      ),

      item("Email", details.contact_email),

      item(
        "Date of birth",
        dateText(details.dob)
      ),

      item("Age", training.age),

      item("Mobile phone", details.phone),

      item("Country", details.country),

      item("State / Province", details.state),

      item("City / Suburb", details.city),

      item("Postcode", details.postcode)
    ].join("");

    const goals = [
      item("Training goal", training.goal),

      item(
        "Training days",
        valuePresent(training.training_days)
          ? numberText(training.training_days, " days")
          : ""
      ),

      item(
        "Experience",
        training.experience
      ),

      item(
        "Equipment",
        training.equipment
      ),

      item(
        "Current weight",
        numberText(training.weight_kg, " kg")
      ),

      item(
        "Height",
        numberText(training.height_cm, " cm")
      ),

      item(
        "Target weight",
        numberText(details.target_weight, " kg")
      ),

      item(
        "Training preferences",
        details.training_preferences
      ),

      item(
        "Injuries / limitations",
        details.injuries
      )
    ].join("");

    const nutrition = [
      item(
        "Dietary preferences",
        details.dietary_preferences
      ),

      item(
        "Water target",
        numberText(details.water_target, " L")
      ),

      item(
        "Food goal",
        details.fuelGoal || details.food_goal
      ),

      item(
        "Daily calories",
        details.calorie_target ||
        details.daily_calories
      ),

      item(
        "Daily protein",
        details.protein_target ||
        details.daily_protein
      )
    ].join("");

    const emergency = [
      item(
        "Emergency contact",
        details.emergency_name
      ),

      item(
        "Emergency phone",
        details.emergency_phone
      )
    ].join("");

    const photoElements =
      retainPhotoElements(panel);

    /*
     Old HTML is replaced only after both
     cloud queries have settled.

     Never open or close client screens here.
    */

    panel.innerHTML = `
      <div class="mpc-kicker">
        MANA MOVEMENT · CLIENT PROFILE
      </div>

      <h3>${escapeHTML(person.name)}</h3>

      ${section("Personal & Contact", personal)}

      <div class="mpc-line"></div>

      ${section("Training & Goals", goals)}

      <div class="mpc-line"></div>

      ${section("Fuel & Nutrition", nutrition)}

      ${
        !nutrition.trim()
          ? `
            <p class="mpc-note">
              Nutrition targets have not been
              shared with Coach Hub yet.
            </p>
          `
          : `
            <p class="mpc-note">
              Daily Fuel targets are displayed
              when saved to the shared profile.
            </p>
          `
      }

      ${
        emergency.trim()
          ? `
            <div class="mpc-line"></div>
            ${section("Emergency Details", emergency)}
          `
          : ""
      }

      ${
        data.trainingError
          ? `
            <p class="mpc-note">
              Training settings could not be loaded
              for this account.
            </p>
          `
          : ""
      }

      ${
        data.extendedError
          ? `
            <p class="mpc-note">
              Extended contact details are
              unavailable for this account.
            </p>
          `
          : ""
      }
    `;

    insertPhotoSection(panel, photoElements);

    panel.dataset.mpcClientId = person.id;
    panel.dataset.mpcBuild = BUILD;
  }

  /* ============================================================
     APPLY SELECTED CLIENT INFORMATION
     ============================================================ */

  async function refresh(force = false) {
    if (!isOpen()) return;

    const person = currentClient();

    if (!person?.id) return;

    const ticket = ++generation;

    installStyle();

    const panel = $(PROFILE);

    if (!panel) return;

    if (
      !force &&
      lastClientId === person.id &&
      lastData &&
      panel.dataset.mpcBuild !== BUILD
    ) {
      render(person, lastData);
      return;
    }

    if (
      !force &&
      lastClientId === person.id &&
      panel.dataset.mpcBuild === BUILD
    ) {
      return;
    }

    const data = await fetchProfile(person.id);

    if (ticket !== generation) return;

    if (!isOpen()) return;

    const latest = currentClient();

    if (!latest || latest.id !== person.id) return;

    lastClientId = person.id;
    lastData = data;

    render(person, data);
  }

  /* ============================================================
     BOUNDED UPDATES

     104950 can finish loading after the
     original client screen opens.

     These limited checks reapply the
     finished presentation without
     repeatedly rebuilding the whole app.
     ============================================================ */

  function cancelPending() {
    pending.forEach(clearTimeout);
    pending = [];
  }

  function scheduleRefresh() {
    cancelPending();

    [250, 850, 1700, 2800].forEach(delay => {
      pending.push(
        setTimeout(() => {
          if (isOpen()) {
            void refresh().catch(error => {
              console.warn(
                "[Mana Profile 104970]",
                error
              );
            });
          }
        }, delay)
      );
    });
  }

  /* ============================================================
     CLIENT SELECTION

     We only read the client ID.

     Do not interfere with the existing
     View Client click handler.
     ============================================================ */

  function clientClicked(event) {
    const button = event.target.closest?.(
      ".client-open[data-client-id]"
    );

    if (!button) return;

    activeId = String(button.dataset.clientId);

    lastClientId = "";
    lastData = null;

    generation++;

    scheduleRefresh();
  }

  /* ============================================================
     SCREEN RESTORATION

     When Edge becomes visible again,
     restore only the presentation.

     Never navigate to Summary.
     Never restart Coach Hub.
     ============================================================ */

  function restoreView() {
    if (!isOpen()) return;

    const panel = $(PROFILE);

    if (
      panel &&
      panel.dataset.mpcBuild === BUILD
    ) {
      return;
    }

    if (lastData && lastClientId) {
      const person = currentClient();

      if (person?.id === lastClientId) {
        render(person, lastData);
        return;
      }
    }

    scheduleRefresh();
  }

  function init() {
    installStyle();

    document.addEventListener(
      "click",
      clientClicked,
      true
    );

    document.addEventListener(
      "visibilitychange",
      () => {
        if (!document.hidden) {
          restoreView();
        }
      }
    );

    window.addEventListener(
      "pageshow",
      restoreView
    );

    if (isOpen()) {
      scheduleRefresh();
    }

    window.MANA_PROFILE_COMPLETE_BUILD = BUILD;

    console.log(
      "[Mana Movement] Complete Coach Profile " +
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
