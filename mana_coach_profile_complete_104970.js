
/* ============================================================
   MANA MOVEMENT TRAINING
   COACH PROFILE STABILITY & TRAINING DATA
   BUILD 104971

   COMPLETE REPLACEMENT:
   mana_coach_profile_complete_104970.js

   FIXES
   - Training details missing from Coach Hub
   - Old profile returning after redraw
   - Oversized personal information cards
   - Inconsistent client profile layout
   - Display of available shared Fuel information

   PRESERVES
   - Working View Client navigation
   - Original client contact information
   - Starting and progress photographs
   - Coaching actions and chat
   - Saved programs and Program Builder
   - Supabase security and permissions

   READ-ONLY CLOUD QUERIES
   NO DATABASE WRITES
   NO AUTHENTICATION REPLACEMENT
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104971";

  if (window.MANA_PROFILE_COMPLETE_104971) return;
  window.MANA_PROFILE_COMPLETE_104971 = true;

  const $ = id => document.getElementById(id);

  const VIEW = "coachClientDetailView";
  const PROFILE = "manaCoachProfile104950";
  const TRAINING = "manaTrainingDetails104971";
  const STYLE = "manaProfileStyle104971";

  let selectedId = "";
  let selectedName = "";
  let requestNumber = 0;
  let loadedId = "";
  let cachedProfile = null;
  let observedPanel = null;
  let panelObserver = null;

  const escapeHtml = value =>
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

  function hasValue(value) {
    return (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    );
  }

  function isOpen() {
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

    if (!selectedId) return null;

    return {
      id: selectedId,
      name: selectedName || "Client"
    };
  }

  /* ============================================================
     PREMIUM COMPACT STYLING
     ============================================================ */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");

    style.id = STYLE;

    style.textContent = `
      #${VIEW} #${PROFILE} {
        padding: 15px !important;
        margin: 11px 0 !important;
        border-radius: 16px !important;
        background: #15171B !important;
        border: 1px solid #4B535E !important;
      }

      #${PROFILE} .mcp-grid {
        display: grid !important;
        grid-template-columns:
          repeat(2, minmax(0, 1fr)) !important;
        gap: 7px !important;
        align-items: stretch !important;
      }

      #${PROFILE} .mcp-detail {
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        justify-content: center !important;

        min-height: 0 !important;
        height: auto !important;
        max-height: none !important;

        width: 100% !important;
        padding: 8px 11px !important;
        margin: 0 !important;
        gap: 3px !important;

        background: #101215 !important;
        border: 1px solid #424A55 !important;
        border-radius: 10px !important;
        text-align: left !important;
      }

      #${PROFILE} .mcp-detail small {
        color: #ADB6C1 !important;
        display: block !important;
        width: 100% !important;
        font-size: 10px !important;
        line-height: 1.3 !important;
        margin: 0 !important;
        padding: 0 !important;
        text-align: left !important;
      }

      #${PROFILE} .mcp-detail strong {
        color: #FFFFFF !important;
        display: block !important;
        width: 100% !important;
        font-size: 13px !important;
        font-weight: 750 !important;
        line-height: 1.4 !important;
        margin: 0 !important;
        padding: 0 !important;
        text-align: left !important;
        white-space: pre-wrap !important;
        overflow-wrap: anywhere !important;
      }

      #${PROFILE} #${TRAINING} {
        margin-top: 14px !important;
        padding-top: 12px !important;
        border-top: 1px solid #383F49 !important;
      }

      #${TRAINING} .mpt-title {
        color: #FF7927 !important;
        font-size: 11px !important;
        font-weight: 900 !important;
        letter-spacing: .11em !important;
        margin: 0 0 9px !important;
      }

      #${TRAINING} .mpt-grid {
        display: grid !important;
        grid-template-columns:
          repeat(2, minmax(0, 1fr)) !important;
        gap: 7px !important;
      }

      #${TRAINING} .mpt-item {
        background: #101215 !important;
        border: 1px solid #424A55 !important;
        border-radius: 10px !important;
        padding: 9px 11px !important;
        min-height: 0 !important;
        height: auto !important;
      }

      #${TRAINING} .mpt-item small {
        color: #ADB6C1 !important;
        display: block !important;
        font-size: 10px !important;
        margin-bottom: 4px !important;
      }

      #${TRAINING} .mpt-item strong {
        color: white !important;
        display: block !important;
        font-size: 13px !important;
        font-weight: 750 !important;
        overflow-wrap: anywhere !important;
      }

      #${TRAINING} .mpt-note {
        color: #ABB4C0 !important;
        font-size: 11px !important;
        line-height: 1.5 !important;
        margin: 8px 0 0 !important;
      }

      #${PROFILE} .mcp-photo img,
      #${PROFILE} .mcp-empty-photo {
        max-height: 175px !important;
        object-fit: cover !important;
      }

      @media(max-width:600px) {
        #${VIEW} #${PROFILE} {
          padding: 12px !important;
        }

        #${PROFILE} .mcp-grid,
        #${TRAINING} .mpt-grid {
          grid-template-columns: 1fr !important;
          gap: 6px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     DISPLAY HELPERS
     ============================================================ */

  function item(label, value) {
    if (!hasValue(value)) return "";

    return `
      <div class="mpt-item">
        <small>${escapeHtml(label)}</small>
        <strong>${escapeHtml(value)}</strong>
      </div>
    `;
  }

  function section(title, content) {
    if (!content.trim()) return "";

    return `
      <section>
        <div class="mpt-title">
          ${escapeHtml(title)}
        </div>

        <div class="mpt-grid">
          ${content}
        </div>
      </section>
    `;
  }

  function numberWithUnit(value, unit) {
    if (!hasValue(value)) return "";

    const number = Number(value);

    return Number.isFinite(number)
      ? `${number} ${unit}`
      : String(value);
  }

  /* ============================================================
     READ ORIGINAL CLIENT TRAINING PROFILE
     ============================================================ */

  async function fetchTraining(clientId) {
    if (
      typeof window.supabaseClient !== "function"
    ) {
      throw Error("Mana cloud is unavailable");
    }

    const db = await window.supabaseClient();

    const results = await Promise.all([
      db.from("profile_settings")
        .select(
          "name,age,height_cm,weight_kg," +
          "training_days,goal,experience,equipment"
        )
        .eq("user_id", clientId)
        .maybeSingle(),

      db.from("client_extended_profiles")
        .select("details,share_with_coach")
        .eq("user_id", clientId)
        .maybeSingle()
    ]);

    return {
      training: results[0].data || null,
      trainingError: results[0].error || null,
      extended: results[1].data || null,
      extendedError: results[1].error || null
    };
  }

  /* ============================================================
     BUILD TRAINING AND NUTRITION PRESENTATION
     ============================================================ */

  function buildMarkup(data) {
    const training = data.training || {};

    const details =
      data.extended?.share_with_coach
        ? data.extended.details || {}
        : {};

    const trainingItems = [
      item("Training goal", training.goal),

      item(
        "Training days",
        numberWithUnit(
          training.training_days,
          "days"
        )
      ),

      item("Experience", training.experience),

      item("Equipment", training.equipment),

      item(
        "Current weight",
        numberWithUnit(training.weight_kg, "kg")
      ),

      item(
        "Height",
        numberWithUnit(training.height_cm, "cm")
      ),

      item("Age", training.age),

      item(
        "Target weight",
        numberWithUnit(
          details.target_weight,
          "kg"
        )
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

    const fuelItems = [
      item(
        "Food goal",
        details.fuelGoal ||
        details.food_goal
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
      ),

      item(
        "Dietary preferences",
        details.dietary_preferences
      ),

      item(
        "Water target",
        numberWithUnit(
          details.water_target,
          "L"
        )
      )
    ].join("");

    return `
      ${section("TRAINING & GOALS", trainingItems)}

      ${
        data.trainingError
          ? `
            <p class="mpt-note">
              Training settings could not be
              retrieved for this client.
            </p>
          `
          : ""
      }

      <div style="
        height:1px;
        background:#383F49;
        margin:14px 0;
      "></div>

      ${section("FUEL & NUTRITION", fuelItems)}

      ${
        !fuelItems.trim()
          ? `
            <p class="mpt-note">
              Fuel settings have not yet been
              synchronised to the coach-readable
              cloud profile.
            </p>
          `
          : ""
      }
    `;
  }

  /* ============================================================
     APPLY CONTENT WITHOUT REBUILDING PROFILE
     ============================================================ */

  function applyProfile() {
    if (!isOpen()) return;

    const panel = $(PROFILE);
    const person = currentClient();

    if (!panel || !person?.id) return;

    if (
      !cachedProfile ||
      loadedId !== person.id
    ) {
      return;
    }

    let target = $(TRAINING);

    if (!target) {
      target = document.createElement("section");
      target.id = TRAINING;
    }

    /*
     Retain the existing photo and contact nodes.
     Insert Training before the photo section.
    */

    const photo =
      $("manaCoachPhotoFold104960") ||
      $("manaCompletePhotoFold104970") ||
      $("mcpBaseline104950");

    if (photo && panel.contains(photo)) {
      if (target.nextElementSibling !== photo) {
        photo.insertAdjacentElement(
          "beforebegin",
          target
        );
      }
    } else if (!panel.contains(target)) {
      panel.appendChild(target);
    }

    const signature =
      loadedId + "|" + JSON.stringify(cachedProfile);

    if (
      target.dataset.signature !== signature ||
      !target.hasChildNodes()
    ) {
      target.innerHTML = buildMarkup(cachedProfile);
      target.dataset.signature = signature;
    }

    panel.dataset.mptClientId = person.id;
  }

  /* ============================================================
     WATCH ONLY THE PROFILE PANEL

     104950 may redraw the panel after an
     asynchronous cloud response.

     We observe only its immediate children.
     When it removes our section, restore it.

     Our own insertion causes one callback,
     but does not trigger another insertion
     when the section already exists.
     ============================================================ */

  function observePanel() {
    const panel = $(PROFILE);

    if (!panel) return;

    if (observedPanel === panel) return;

    if (panelObserver) {
      panelObserver.disconnect();
    }

    observedPanel = panel;

    panelObserver = new MutationObserver(() => {
      if (!isOpen()) return;

      if (
        loadedId &&
        currentClient()?.id === loadedId &&
        !$(TRAINING)
      ) {
        applyProfile();
      }
    });

    panelObserver.observe(panel, {
      childList: true
    });
  }

  /* ============================================================
     LOAD SELECTED CLIENT ONCE

     No repeated Supabase fetches every
     time the page becomes visible.
     ============================================================ */

  async function loadClient() {
    if (!isOpen()) return;

    const person = currentClient();

    if (!person?.id) return;

    const ticket = ++requestNumber;

    try {
      const data = await fetchTraining(person.id);

      if (ticket !== requestNumber) return;
      if (!isOpen()) return;

      if (
        currentClient()?.id !== person.id
      ) {
        return;
      }

      loadedId = person.id;
      cachedProfile = data;

      observePanel();
      applyProfile();

    } catch (error) {
      console.warn(
        "[Mana Profile Training]",
        error
      );
    }
  }

  /* ============================================================
     SELECT CLIENT

     Never intercept original navigation.
     ============================================================ */

  function onClick(event) {
    const button = event.target.closest?.(
      ".client-open[data-client-id]"
    );

    if (!button) return;

    selectedId = String(button.dataset.clientId);
    selectedName = String(
      button.dataset.clientName || "Client"
    );

    loadedId = "";
    cachedProfile = null;
    requestNumber++;

    if (panelObserver) {
      panelObserver.disconnect();
      panelObserver = null;
      observedPanel = null;
    }

    /*
     Original View Client code runs normally.
     Wait until its screen has opened.
    */

    setTimeout(() => {
      if (isOpen()) {
        observePanel();
        void loadClient();
      }
    }, 350);
  }

  /* ============================================================
     RESTORE PRESENTATION WITHOUT NAVIGATING
     ============================================================ */

  function restore() {
    if (!isOpen()) return;

    observePanel();

    if (
      loadedId &&
      currentClient()?.id === loadedId
    ) {
      applyProfile();
      return;
    }

    void loadClient();
  }

  function init() {
    installStyles();

    document.addEventListener(
      "click",
      onClick,
      true
    );

    document.addEventListener(
      "visibilitychange",
      () => {
        if (!document.hidden) restore();
      }
    );

    window.addEventListener(
      "pageshow",
      restore
    );

    if (isOpen()) {
      setTimeout(restore, 350);
    }

    console.log(
      "[Mana Movement] Coach Profile " +
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
