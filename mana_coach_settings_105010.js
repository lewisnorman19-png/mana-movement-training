
/* ============================================================
   MANA MOVEMENT TRAINING
   COACH HUB — SETTINGS
   BUILD 105010

   COMPLETE JAVASCRIPT FILE

   FEATURES
   - Coach Profile
   - Coach profile photograph
   - Coaching bio
   - Qualifications and contact details
   - Training preferences
   - Preferred session duration
   - Program length, sets, reps, rest
   - Preferred coaching notes
   - Local account-scoped saving
   - Premium responsive design

   PRESERVES
   - Summary
   - Clients
   - Live Chat
   - Payments
   - Program Builder
   - Client profiles and photographs
   - Existing assignments

   NO DATABASE SCHEMA CHANGES
   NO NAVIGATION OVERRIDES
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "105010";
  const FLAG = "MANA_COACH_SETTINGS_105010";
  const STYLE = "manaCoachSettingsStyle105010";
  const ROOT = "manaCoachSettings105010";
  const SUITE = "manaCoachSuite104707";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const $ = id => document.getElementById(id);

  const DEFAULTS = {
    name: "",
    photo: "",
    title: "Fitness & Strength Coach",
    bio: "",
    qualifications: "",
    email: "",
    phone: "",
    duration: "50",
    weeks: "4",
    sets: "3",
    reps: "8-12",
    rest: "75",
    notes: ""
  };

  let coachId = "";
  let saved = {...DEFAULTS};
  let editing = null;
  let generation = 0;

  const safe = value =>
    String(value ?? "").replace(
      /[&<>"']/g,
      char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&quot;"
      })[char]
    );

  function settingsSection() {
    return document.querySelector(
      "#" + SUITE +
      ' [data-mcn-view="settings"]'
    );
  }

  function storageKey() {
    return (
      "mana-coach-settings-105010:" +
      coachId
    );
  }

  function loadLocal() {
    try {
      const value = JSON.parse(
        localStorage.getItem(
          storageKey()
        ) || "{}"
      );

      return {
        ...DEFAULTS,
        ...value
      };

    } catch (_) {
      return {...DEFAULTS};
    }
  }

  function saveLocal(value) {
    localStorage.setItem(
      storageKey(),
      JSON.stringify(value)
    );
  }

  /* =====================================================
     STYLES
     ===================================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const sheet = document.createElement("style");
    sheet.id = STYLE;

    sheet.textContent = `

      #${ROOT} {
        width: 100%;
        max-width: 900px;
        margin: 0 auto 110px;
        padding: 8px 0 20px;
        color: #FFFFFF;
        box-sizing: border-box;
      }

      #${ROOT} * {
        box-sizing: border-box;
      }

      #${ROOT} .mcs-kicker {
        color: #FF7927;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: .13em;
      }

      #${ROOT} .mcs-heading {
        margin: 6px 0;
        color: #FFFFFF;
        font-size: clamp(25px,4vw,32px);
        font-weight: 900;
      }

      #${ROOT} .mcs-subtitle {
        margin: 0 0 20px;
        color: #B7C0CB;
        font-size: 12px;
        line-height: 1.6;
      }

      #${ROOT} .mcs-card {
        width: 100%;
        margin: 0 0 13px;
        padding: 0;
        overflow: hidden;

        background: #15171B;
        border: 1px solid #505862;
        border-radius: 17px;
      }

      #${ROOT} .mcs-card > summary {
        display: flex;
        align-items: center;
        gap: 13px;
        list-style: none;
        cursor: pointer;

        padding: 17px;
        color: #FFFFFF;
      }

      #${ROOT} .mcs-card > summary::-webkit-details-marker {
        display: none;
      }

      #${ROOT} .mcs-icon {
        display: grid;
        place-items: center;
        flex: 0 0 42px;

        width: 42px;
        height: 42px;

        background: #24180F;
        border: 1px solid #FF7927;
        border-radius: 12px;

        color: #FF7927;
        font-size: 21px;
      }

      #${ROOT} .mcs-summary-copy {
        flex: 1;
        min-width: 0;
      }

      #${ROOT} .mcs-summary-copy strong {
        display: block;
        color: #FFFFFF;
        font-size: 16px;
        font-weight: 900;
      }

      #${ROOT} .mcs-summary-copy small {
        display: block;
        margin-top: 4px;
        color: #B7C0CB;
        font-size: 11px;
        line-height: 1.45;
      }

      #${ROOT} .mcs-chevron {
        color: #FF7927;
        font-size: 19px;
      }

      #${ROOT} .mcs-card[open]
      .mcs-chevron {
        transform: rotate(90deg);
      }

      #${ROOT} .mcs-content {
        padding: 0 18px 20px;
        border-top: 1px solid #363E48;
      }

      #${ROOT} .mcs-fields {
        display: grid;
        grid-template-columns:
          repeat(2,minmax(0,1fr));
        gap: 12px;
        padding-top: 17px;
      }

      #${ROOT} .mcs-field {
        min-width: 0;
      }

      #${ROOT} .mcs-field.wide {
        grid-column: 1 / -1;
      }

      #${ROOT} .mcs-field label {
        display: block;
        margin: 0 0 7px;

        color: #B7C0CB;
        font-size: 11px;
        font-weight: 850;
      }

      #${ROOT} input,
      #${ROOT} select,
      #${ROOT} textarea {
        display: block;
        width: 100%;
        min-width: 0;
        min-height: 44px;

        padding: 12px;

        background: #101215;
        border: 1px solid #505862;
        border-radius: 10px;

        color: #FFFFFF;
        font: 13px/1.5 system-ui,sans-serif;
      }

      #${ROOT} textarea {
        min-height: 95px;
        resize: vertical;
      }

      #${ROOT} input:focus-visible,
      #${ROOT} textarea:focus-visible,
      #${ROOT} select:focus-visible,
      #${ROOT} button:focus-visible,
      #${ROOT} summary:focus-visible {
        outline: 2px solid #FF7927;
        outline-offset: 2px;
      }

      #${ROOT} .mcs-photo-row {
        display: flex;
        align-items: center;
        gap: 15px;
        padding-top: 17px;
      }

      #${ROOT} .mcs-avatar {
        display: grid;
        place-items: center;

        position: relative;
        overflow: hidden;

        flex: 0 0 80px;
        width: 80px;
        height: 80px;

        background: #101215;
        border: 2px solid #FF7927;
        border-radius: 17px;

        color: #FF7927;
        font-size: 21px;
        font-weight: 900;
      }

      #${ROOT} .mcs-avatar img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      #${ROOT} .mcs-photo-actions {
        flex: 1;
        min-width: 0;
      }

      #${ROOT} .mcs-help {
        display: block;
        margin-top: 7px;
        color: #AAB4C0;
        font-size: 11px;
        line-height: 1.5;
      }

      #${ROOT} .mcs-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 17px;
      }

      #${ROOT} .mcs-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;

        min-height: 44px;
        padding: 11px 18px;

        background: #24180F;
        border: 1px solid #FF7927;
        border-radius: 11px;

        color: #FF7927;
        font-size: 12px;
        font-weight: 900;
        cursor: pointer;
      }

      #${ROOT} .mcs-button.primary {
        background: #FF7927;
        color: #111316;
      }

      #${ROOT} .mcs-status {
        min-height: 18px;
        margin-top: 10px;
        color: #FF7927;
        font-size: 12px;
        line-height: 1.5;
      }

      #${ROOT} .mcs-note {
        margin: 14px 0 0;
        padding: 12px;

        background: #101215;
        border: 1px solid #414954;
        border-radius: 11px;

        color: #B7C0CB;
        font-size: 11px;
        line-height: 1.55;
      }

      @media (max-width:600px) {

        #${ROOT} {
          padding-left: 5px;
          padding-right: 5px;
        }

        #${ROOT} .mcs-card > summary {
          padding: 13px;
        }

        #${ROOT} .mcs-content {
          padding: 0 13px 17px;
        }

        #${ROOT} .mcs-fields {
          grid-template-columns: 1fr;
          gap: 11px;
        }

        #${ROOT} .mcs-field.wide {
          grid-column: auto;
        }

        #${ROOT} .mcs-avatar {
          flex-basis: 65px;
          width: 65px;
          height: 65px;
        }
      }
    `;

    document.head.appendChild(sheet);
  }

  /* =====================================================
     PROFILE PHOTO

     Compress before storing locally.
     No upload to the client photo bucket.
     ===================================================== */

  async function resizePhoto(file) {
    if (
      !file ||
      !file.type.startsWith("image/")
    ) {
      throw Error(
        "Choose an image file."
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      throw Error(
        "Image must be smaller than 10 MB."
      );
    }

    const image = new Image();
    const url = URL.createObjectURL(file);

    try {
      await new Promise((resolve,reject) => {
        image.onload = resolve;
        image.onerror = () =>
          reject(Error("Could not read photo."));
        image.src = url;
      });

      const canvas =
        document.createElement("canvas");

      canvas.width = 256;
      canvas.height = 256;

      const context =
        canvas.getContext("2d");

      if (!context) {
        throw Error("Photo processing unavailable.");
      }

      const size = Math.min(
        image.naturalWidth,
        image.naturalHeight
      );

      context.drawImage(
        image,
        (image.naturalWidth - size) / 2,
        (image.naturalHeight - size) / 2,
        size,
        size,
        0,
        0,
        256,
        256
      );

      return canvas.toDataURL(
        "image/jpeg",
        0.72
      );

    } finally {
      URL.revokeObjectURL(url);
    }
  }

  /* =====================================================
     COACH ACCOUNT ID

     Settings are stored per signed-in
     coach, never under a shared key.
     ===================================================== */

  async function getCoach() {
    if (
      typeof window.supabaseClient !==
      "function"
    ) {
      throw Error(
        "Mana login connection unavailable."
      );
    }

    const db = await window.supabaseClient();

    const result = await db.auth.getUser();

    if (
      result.error ||
      !result.data?.user?.id
    ) {
      throw Error(
        "Sign in to your coach account first."
      );
    }

    const id = result.data.user.id;

    const role = await db
      .from("profiles")
      .select("role,full_name")
      .eq("id", id)
      .maybeSingle();

    if (
      role.error ||
      role.data?.role !== "coach"
    ) {
      throw Error(
        "Coach account access is required."
      );
    }

    return {
      id,
      name: role.data.full_name || ""
    };
  }

  /* =====================================================
     RENDER
     ===================================================== */

  function render() {
    const root = $(ROOT);

    if (!root || !coachId) return;

    editing = {...saved};

    const val = key => safe(
      editing[key] || ""
    );

    root.innerHTML = `
      <div class="mcs-kicker">
        MANA MOVEMENT · COACH HUB
      </div>

      <h2 class="mcs-heading">
        Settings
      </h2>

      <p class="mcs-subtitle">
        Your coaching identity and
        preferred way of building programs.
      </p>

      <details class="mcs-card" open>
        <summary>
          <span class="mcs-icon">◉</span>
          <span class="mcs-summary-copy">
            <strong>Coach Profile</strong>
            <small>
              Personal details, photo,
              qualifications and coaching bio
            </small>
          </span>
          <span class="mcs-chevron">›</span>
        </summary>

        <div class="mcs-content">

          <div class="mcs-photo-row">
            <div
              class="mcs-avatar"
              id="mcsAvatar105010"
            ></div>

            <div class="mcs-photo-actions">
              <button
                type="button"
                class="mcs-button"
                id="mcsChoosePhoto105010"
              >
                Choose Profile Photo
              </button>

              <input
                type="file"
                id="mcsPhotoInput105010"
                accept="image/*"
                hidden
              >

              <span class="mcs-help">
                A small square photo works best.
                Stored on this device.
              </span>
            </div>
          </div>

          <div class="mcs-fields">

            <div class="mcs-field">
              <label for="mcsName">
                Coach name
              </label>
              <input
                id="mcsName"
                maxlength="100"
                value="${val("name")}"
              >
            </div>

            <div class="mcs-field">
              <label for="mcsTitle">
                Coaching title
              </label>
              <input
                id="mcsTitle"
                maxlength="100"
                value="${val("title")}"
              >
            </div>

            <div class="mcs-field">
              <label for="mcsEmail">
                Contact email
              </label>
              <input
                id="mcsEmail"
                type="email"
                maxlength="150"
                value="${val("email")}"
              >
            </div>

            <div class="mcs-field">
              <label for="mcsPhone">
                Contact phone
              </label>
              <input
                id="mcsPhone"
                maxlength="50"
                value="${val("phone")}"
              >
            </div>

            <div class="mcs-field wide">
              <label for="mcsQualifications">
                Qualifications
              </label>
              <textarea
                id="mcsQualifications"
                maxlength="1200"
                placeholder="Fitness qualifications, coaching credentials and specialties"
              >${val("qualifications")}</textarea>
            </div>

            <div class="mcs-field wide">
              <label for="mcsBio">
                Coaching bio
              </label>
              <textarea
                id="mcsBio"
                maxlength="1600"
                placeholder="Describe your coaching philosophy and approach"
              >${val("bio")}</textarea>
            </div>

          </div>

          <div class="mcs-actions">
            <button
              type="button"
              class="mcs-button primary"
              id="mcsSaveProfile"
            >
              SAVE COACH PROFILE
            </button>
          </div>

          <div
            class="mcs-status"
            id="mcsProfileStatus"
            role="status"
          ></div>
        </div>
      </details>

      <details class="mcs-card">
        <summary>
          <span class="mcs-icon">◆</span>
          <span class="mcs-summary-copy">
            <strong>Training Preferences</strong>
            <small>
              Your preferred starting values
              when programming workouts
            </small>
          </span>
          <span class="mcs-chevron">›</span>
        </summary>

        <div class="mcs-content">
          <div class="mcs-fields">

            <div class="mcs-field">
              <label for="mcsDuration">
                Preferred session duration
              </label>
              <select id="mcsDuration">
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="50">50 minutes</option>
                <option value="60">60 minutes</option>
                <option value="75">75 minutes</option>
              </select>
            </div>

            <div class="mcs-field">
              <label for="mcsWeeks">
                Preferred program length
              </label>
              <select id="mcsWeeks">
                <option value="4">4 weeks</option>
                <option value="6">6 weeks</option>
                <option value="8">8 weeks</option>
                <option value="12">12 weeks</option>
              </select>
            </div>

            <div class="mcs-field">
              <label for="mcsSets">
                Default working sets
              </label>
              <select id="mcsSets">
                <option value="2">2 sets</option>
                <option value="3">3 sets</option>
                <option value="4">4 sets</option>
                <option value="5">5 sets</option>
              </select>
            </div>

            <div class="mcs-field">
              <label for="mcsReps">
                Preferred rep range
              </label>
              <select id="mcsReps">
                <option value="5-8">5–8 reps</option>
                <option value="6-10">6–10 reps</option>
                <option value="8-12">8–12 reps</option>
                <option value="10-15">10–15 reps</option>
                <option value="12-20">12–20 reps</option>
              </select>
            </div>

            <div class="mcs-field">
              <label for="mcsRest">
                Preferred rest period
              </label>
              <select id="mcsRest">
                <option value="45">45 seconds</option>
                <option value="60">60 seconds</option>
                <option value="75">75 seconds</option>
                <option value="90">90 seconds</option>
                <option value="120">120 seconds</option>
              </select>
            </div>

            <div class="mcs-field wide">
              <label for="mcsNotes">
                Default coaching notes
              </label>
              <textarea
                id="mcsNotes"
                maxlength="1200"
                placeholder="For example: Prioritise technique, controlled tempo and progressive overload."
              >${val("notes")}</textarea>
            </div>
          </div>

          <p class="mcs-note">
            These are saved coaching preferences.
            Existing Quick Start presets and
            client programs will not be
            automatically changed.
          </p>

          <div class="mcs-actions">
            <button
              type="button"
              class="mcs-button primary"
              id="mcsSavePreferences"
            >
              SAVE TRAINING PREFERENCES
            </button>

            <button
              type="button"
              class="mcs-button"
              id="mcsResetPreferences"
            >
              RESET DEFAULTS
            </button>
          </div>

          <div
            class="mcs-status"
            id="mcsPreferencesStatus"
            role="status"
          ></div>
        </div>
      </details>

      <div class="mcs-note">
        Settings are stored locally in this
        browser for your signed-in coach account.
        Payments and subscriptions remain under
        the separate Payments tab.
      </div>
    `;

    for (const key of [
      "duration",
      "weeks",
      "sets",
      "reps",
      "rest"
    ]) {
      const node = $("mcs" +
        key[0].toUpperCase() +
        key.slice(1)
      );

      if (node) {
        node.value = editing[key];
      }
    }

    updateAvatar();
    bindEvents();
  }

  function updateAvatar() {
    const node = $("mcsAvatar105010");
    if (!node) return;

    node.replaceChildren();

    if (editing?.photo) {
      const image =
        document.createElement("img");

      image.src = editing.photo;
      image.alt = "Coach profile photo";
      node.appendChild(image);
      return;
    }

    const initials = String(
      editing?.name || "Coach"
    ).trim().split(/\s+/)
      .slice(0,2)
      .map(word => word[0] || "")
      .join("")
      .toUpperCase();

    node.textContent = initials || "C";
  }

  /* =====================================================
     SAVE HANDLERS
     ===================================================== */

  function readField(id) {
    return String(
      $(id)?.value || ""
    ).trim();
  }

  function saveProfile() {
    const updated = {
      ...saved,
      name: readField("mcsName"),
      title: readField("mcsTitle"),
      email: readField("mcsEmail"),
      phone: readField("mcsPhone"),
      qualifications:
        readField("mcsQualifications"),
      bio: readField("mcsBio"),
      photo: editing.photo || ""
    };

    const email = $("mcsEmail");

    if (
      updated.email &&
      !email.checkValidity()
    ) {
      $("mcsProfileStatus").textContent =
        "Enter a valid contact email.";
      return;
    }

    try {
      saveLocal(updated);
      saved = updated;
      editing = {...updated};

      updateAvatar();

      $("mcsProfileStatus").textContent =
        "Coach Profile saved on this device ✓";

    } catch (_) {
      $("mcsProfileStatus").textContent =
        "Unable to save. Check browser storage.";
    }
  }

  function savePreferences() {
    const updated = {
      ...saved,
      duration: readField("mcsDuration"),
      weeks: readField("mcsWeeks"),
      sets: readField("mcsSets"),
      reps: readField("mcsReps"),
      rest: readField("mcsRest"),
      notes: readField("mcsNotes")
    };

    try {
      saveLocal(updated);
      saved = updated;

      window.manaCoachTrainingPreferences = {
        duration: Number(updated.duration),
        weeks: Number(updated.weeks),
        sets: Number(updated.sets),
        reps: updated.reps,
        rest: Number(updated.rest),
        notes: updated.notes
      };

      $("mcsPreferencesStatus").textContent =
        "Training Preferences saved ✓";

    } catch (_) {
      $("mcsPreferencesStatus").textContent =
        "Unable to save. Check browser storage.";
    }
  }

  function resetPreferences() {
    if (!window.confirm(
      "Reset training preferences " +
      "to Mana defaults?"
    )) return;

    try {
      saved = {
        ...saved,
        duration: DEFAULTS.duration,
        weeks: DEFAULTS.weeks,
        sets: DEFAULTS.sets,
        reps: DEFAULTS.reps,
        rest: DEFAULTS.rest,
        notes: DEFAULTS.notes
      };

      saveLocal(saved);
      render();

      $("mcsPreferencesStatus").textContent =
        "Default preferences restored ✓";

      window.manaCoachTrainingPreferences = {
        duration: 50,
        weeks: 4,
        sets: 3,
        reps: "8-12",
        rest: 75,
        notes: ""
      };

    } catch (_) {
      $("mcsPreferencesStatus").textContent =
        "Unable to reset preferences.";
    }
  }

  function bindEvents() {
    $("mcsSaveProfile")
      ?.addEventListener(
        "click",
        saveProfile
      );

    $("mcsSavePreferences")
      ?.addEventListener(
        "click",
        savePreferences
      );

    $("mcsResetPreferences")
      ?.addEventListener(
        "click",
        resetPreferences
      );

    $("mcsChoosePhoto105010")
      ?.addEventListener(
        "click",
        () => {
          $("mcsPhotoInput105010")?.click();
        }
      );

    $("mcsPhotoInput105010")
      ?.addEventListener(
        "change",
        async event => {
          const file =
            event.target.files?.[0];

          if (!file) return;

          const status =
            $("mcsProfileStatus");

          try {
            const photo =
              await resizePhoto(file);

            if (!editing) return;

            editing.photo = photo;

            updateAvatar();

            status.textContent =
              "Photo ready. Save Coach Profile " +
              "to keep this change.";

          } catch (error) {
            status.textContent =
              error.message || "Photo failed.";
          }
        }
      );
  }

  /* =====================================================
     ACCOUNT LOAD AND MOUNT
     ===================================================== */

  async function mount() {
    const section = settingsSection();
    if (!section) return;

    if ($(ROOT)) return;

    const token = ++generation;

    const root =
      document.createElement("div");

    root.id = ROOT;
    root.textContent =
      "Loading Coach Settings…";

    section.replaceChildren(root);

    try {
      const coach = await getCoach();

      if (
        token !== generation ||
        !root.isConnected
      ) return;

      coachId = coach.id;
      saved = loadLocal();

      if (!saved.name) {
        saved.name = coach.name;
      }

      window.manaCoachTrainingPreferences = {
        duration: Number(saved.duration),
        weeks: Number(saved.weeks),
        sets: Number(saved.sets),
        reps: saved.reps,
        rest: Number(saved.rest),
        notes: saved.notes
      };

      render();

    } catch (error) {
      root.textContent =
        error.message ||
        "Coach Settings unavailable.";
    }
  }

  function init() {
    installStyles();

    /*
     The main Coach Hub creates this
     settings section before this file
     normally runs.

     Bounded retries handle slower
     initial page mounting.
    */

    [0,250,750,1500].forEach(delay => {
      setTimeout(() => {
        void mount();
      }, delay);
    });

    console.log(
      "[Mana Movement] Coach Settings " +
      BUILD + " active"
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {once:true}
    );
  } else {
    init();
  }

})();
