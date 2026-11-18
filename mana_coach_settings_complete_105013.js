
/* ============================================================
   MANA MOVEMENT — COMPLETE COACH SETTINGS
   BUILD 105013

   New add-on to mana_coach_settings_105010.js

   Adds:
   - Notifications & Activity
   - Account & Security
   - App Preferences

   Keeps:
   - Coach Profile and Take Photo
   - Training Preferences
   - Clients, Chat, Payments
   - Original navigation and logout
   - Original Supabase auth

   No schema changes, no payment overrides.
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "105013";
  const FLAG = "MANA_SETTINGS_COMPLETE_105013";
  if (window[FLAG]) return;
  window[FLAG] = true;

  const ROOT = "manaCoachSettings105010";
  const EXTRA = "manaCoachSettingsExtra105013";
  const STYLE = "manaSettingsExtraStyle105013";
  const SETTINGS_VIEW =
    '#manaCoachSuite104707 [data-mcn-view="settings"]';

  const $ = id => document.getElementById(id);

  let coachId = "";
  let accountEmail = "";
  let preferences = {
    reduceMotion: false,
    compactSettings: false
  };
  let mounting = false;
  let observer = null;
  let observedView = null;

  function storeKey() {
    return "mana-coach-app-preferences:" + coachId;
  }

  function savePreferences() {
    try {
      localStorage.setItem(
        storeKey(),
        JSON.stringify(preferences)
      );
      return true;
    } catch (_) {
      return false;
    }
  }

  function loadPreferences() {
    try {
      return {
        reduceMotion: false,
        compactSettings: false,
        ...JSON.parse(
          localStorage.getItem(storeKey()) || "{}"
        )
      };
    } catch (_) {
      return {
        reduceMotion: false,
        compactSettings: false
      };
    }
  }

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      #${EXTRA} {
        display: block;
        width: 100%;
        margin-top: 12px;
      }

      #${EXTRA} * {
        box-sizing: border-box;
      }

      #${EXTRA} .mse-card {
        margin: 0 0 13px;
        overflow: hidden;
        background: #15171B;
        border: 1px solid #505862;
        border-radius: 17px;
      }

      #${EXTRA} .mse-card > summary {
        display: flex;
        align-items: center;
        gap: 13px;
        list-style: none;
        padding: 17px;
        cursor: pointer;
        color: #FFFFFF;
      }

      #${EXTRA} .mse-card > summary::-webkit-details-marker {
        display: none;
      }

      #${EXTRA} .mse-icon {
        flex: 0 0 42px;
        width: 42px;
        height: 42px;
        display: grid;
        place-items: center;
        background: #24180F;
        border: 1px solid #FF7927;
        border-radius: 12px;
        color: #FF7927;
        font-size: 19px;
      }

      #${EXTRA} .mse-heading {
        flex: 1;
        min-width: 0;
      }

      #${EXTRA} .mse-heading strong {
        display: block;
        color: #FFFFFF;
        font-size: 16px;
        font-weight: 900;
      }

      #${EXTRA} .mse-heading small {
        display: block;
        margin-top: 4px;
        color: #B7C0CB;
        font-size: 11px;
        line-height: 1.5;
      }

      #${EXTRA} .mse-chevron {
        color: #FF7927;
        font-size: 19px;
      }

      #${EXTRA} details[open] > summary
      .mse-chevron {
        transform: rotate(90deg);
      }

      #${EXTRA} .mse-content {
        padding: 17px;
        border-top: 1px solid #363E48;
      }

      #${EXTRA} .mse-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 12px 0;
        border-bottom: 1px solid #313943;
      }

      #${EXTRA} .mse-row:last-child {
        border-bottom: none;
      }

      #${EXTRA} .mse-copy {
        flex: 1;
        min-width: 0;
      }

      #${EXTRA} .mse-copy strong {
        display: block;
        color: #FFFFFF;
        font-size: 13px;
      }

      #${EXTRA} .mse-copy small {
        display: block;
        margin-top: 4px;
        color: #B7C0CB;
        font-size: 11px;
        line-height: 1.5;
        overflow-wrap: anywhere;
      }

      #${EXTRA} .mse-button {
        min-height: 42px;
        padding: 10px 13px;
        flex-shrink: 0;
        background: #24180F;
        border: 1px solid #FF7927;
        border-radius: 11px;
        color: #FF7927;
        font-size: 12px;
        font-weight: 850;
        cursor: pointer;
      }

      #${EXTRA} .mse-button:hover {
        background: #352114;
      }

      #${EXTRA} .mse-toggle {
        flex: 0 0 auto;
        width: 22px;
        height: 22px;
        accent-color: #FF7927;
        cursor: pointer;
      }

      #${EXTRA} .mse-note {
        padding: 12px;
        margin: 12px 0 0;
        background: #101215;
        border: 1px solid #414954;
        border-radius: 11px;
        color: #B7C0CB;
        font-size: 11px;
        line-height: 1.55;
      }

      #${EXTRA} .mse-status {
        margin-top: 11px;
        min-height: 16px;
        color: #FF7927;
        font-size: 12px;
      }

      /* Actual compact Settings layout */

      #${ROOT}.mse-compact .mcs-card > summary,
      #${ROOT}.mse-compact
      #${EXTRA} .mse-card > summary {
        padding: 12px !important;
      }

      #${ROOT}.mse-compact .mcs-content,
      #${ROOT}.mse-compact
      #${EXTRA} .mse-content {
        padding: 12px !important;
      }

      #${ROOT}.mse-compact .mcs-fields {
        gap: 8px !important;
        padding-top: 10px !important;
      }

      /* Reduced motion inside Coach Hub */

      body.mana-coach-reduced-motion
      #coachView *,
      body.mana-coach-reduced-motion
      #coachClientDetailView *,
      body.mana-coach-reduced-motion
      #manaV1008ProgramBuilder * {
        animation-duration: .01ms !important;
        transition-duration: .01ms !important;
        scroll-behavior: auto !important;
      }

      #${EXTRA} button:focus-visible,
      #${EXTRA} input:focus-visible,
      #${EXTRA} summary:focus-visible {
        outline: 2px solid #FF7927;
        outline-offset: 2px;
      }

      @media (max-width:600px) {
        #${EXTRA} .mse-card > summary {
          padding: 13px;
        }

        #${EXTRA} .mse-content {
          padding: 12px;
        }

        #${EXTRA} .mse-row {
          align-items: flex-start;
          flex-wrap: wrap;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function applyPreferences() {
    $(ROOT)?.classList.toggle(
      "mse-compact",
      !!preferences.compactSettings
    );

    document.body.classList.toggle(
      "mana-coach-reduced-motion",
      !!preferences.reduceMotion
    );
  }

  async function identifyCoach() {
    if (
      typeof window.supabaseClient !== "function"
    ) {
      return;
    }

    try {
      const db = await window.supabaseClient();
      const result = await db.auth.getUser();
      const user = result.data?.user;

      if (result.error || !user?.id) return;

      const role = await db
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (
        role.error ||
        role.data?.role !== "coach"
      ) return;

      if (coachId !== user.id) {
        coachId = user.id;
        preferences = loadPreferences();
      }

      accountEmail = user.email || "";

      applyPreferences();
      updateAccount();

    } catch (error) {
      console.warn(
        "[Mana Coach Settings] Account lookup:",
        error
      );
    }
  }

  function updateAccount() {
    const element = $("mseAccountEmail105013");

    if (element) {
      element.textContent =
        accountEmail ||
        "Signed in to Mana Movement";
    }
  }

  function openChat() {
    const button = document.querySelector(
      '#manaV97CoachNav [data-coach-page="progress"]'
    );

    if (button) {
      button.click();
    }
  }

  function signOut() {
    if (!window.confirm(
      "Sign out of your Mana Movement coach account?"
    )) return;

    const button =
      $("manaV97CoachLogout") ||
      $("coachLogoutButton");

    if (button) {
      button.click();
    } else {
      const status = $("mseAccountStatus105013");

      if (status) {
        status.textContent =
          "Sign out using the Log out button " +
          "at the top of Coach Hub.";
      }
    }
  }

  function mount() {
    const root = $(ROOT);

    if (
      !root ||
      !root.querySelector(".mcs-card") ||
      $(EXTRA)
    ) return;

    const extra = document.createElement("div");
    extra.id = EXTRA;

    extra.innerHTML = `
      <details class="mse-card">
        <summary>
          <span class="mse-icon">☏</span>
          <span class="mse-heading">
            <strong>Notifications &amp; Activity</strong>
            <small>
              Client messages, check-ins and requests
            </small>
          </span>
          <span class="mse-chevron">›</span>
        </summary>

        <div class="mse-content">
          <div class="mse-row">
            <div class="mse-copy">
              <strong>Coaching Inbox</strong>
              <small>
                View real client messages and unread
                indicators in your existing Chat tab.
              </small>
            </div>

            <button
              type="button"
              class="mse-button"
              id="mseOpenChat105013"
            >
              OPEN CHAT
            </button>
          </div>

          <div class="mse-row">
            <div class="mse-copy">
              <strong>Client Check-ins</strong>
              <small>
                Review check-in history inside
                each client's coaching profile.
              </small>
            </div>
          </div>

          <div class="mse-row">
            <div class="mse-copy">
              <strong>Program Upgrade Requests</strong>
              <small>
                Manage upgrade requests through
                the existing Coach Hub client tools.
              </small>
            </div>
          </div>

          <p class="mse-note">
            Push notifications and email alerts
            are not enabled here yet.
            This section links to existing
            working activity features.
          </p>
        </div>
      </details>

      <details class="mse-card">
        <summary>
          <span class="mse-icon">♙</span>
          <span class="mse-heading">
            <strong>Account &amp; Security</strong>
            <small>
              Your current coach account and access
            </small>
          </span>
          <span class="mse-chevron">›</span>
        </summary>

        <div class="mse-content">
          <div class="mse-row">
            <div class="mse-copy">
              <strong>Signed-in account</strong>
              <small
                id="mseAccountEmail105013"
              >
                Checking account…
              </small>
            </div>
          </div>

          <div class="mse-row">
            <div class="mse-copy">
              <strong>Sign out</strong>
              <small>
                Use the existing secure
                Mana Movement logout function.
              </small>
            </div>

            <button
              type="button"
              class="mse-button"
              id="mseSignOut105013"
            >
              SIGN OUT
            </button>
          </div>

          <p class="mse-note">
            Password recovery remains part
            of the existing Mana login flow.
            This screen does not display
            or store your password.
          </p>

          <div
            class="mse-status"
            id="mseAccountStatus105013"
            role="status"
          ></div>
        </div>
      </details>

      <details class="mse-card">
        <summary>
          <span class="mse-icon">⚙</span>
          <span class="mse-heading">
            <strong>App Preferences</strong>
            <small>
              Display and accessibility preferences
            </small>
          </span>
          <span class="mse-chevron">›</span>
        </summary>

        <div class="mse-content">

          <label class="mse-row">
            <span class="mse-copy">
              <strong>Reduce animation</strong>
              <small>
                Minimise movement and transitions
                in the Coach Hub.
              </small>
            </span>

            <input
              type="checkbox"
              class="mse-toggle"
              id="mseReduceMotion105013"
            >
          </label>

          <label class="mse-row">
            <span class="mse-copy">
              <strong>Compact Settings layout</strong>
              <small>
                Reduce spacing in Settings
                to show more on screen.
              </small>
            </span>

            <input
              type="checkbox"
              class="mse-toggle"
              id="mseCompact105013"
            >
          </label>

          <p class="mse-note">
            Changes are saved for this
            coach account on this device.
            They don't affect client accounts.
          </p>

          <div
            class="mse-status"
            id="msePreferencesStatus105013"
            role="status"
          ></div>
        </div>
      </details>
    `;

    const lastNote = Array.from(
      root.children
    ).find(child =>
      child.classList?.contains("mcs-note")
    );

    if (lastNote) {
      root.insertBefore(extra, lastNote);
    } else {
      root.appendChild(extra);
    }

    $("mseOpenChat105013")
      ?.addEventListener("click", openChat);

    $("mseSignOut105013")
      ?.addEventListener("click", signOut);

    const motion = $("mseReduceMotion105013");
    const compact = $("mseCompact105013");

    motion.checked = !!preferences.reduceMotion;
    compact.checked = !!preferences.compactSettings;

    motion.addEventListener("change", () => {
      preferences.reduceMotion = motion.checked;
      applyPreferences();

      $("msePreferencesStatus105013").textContent =
        savePreferences()
          ? "Display preference saved ✓"
          : "Could not save browser preference.";
    });

    compact.addEventListener("change", () => {
      preferences.compactSettings = compact.checked;
      applyPreferences();

      $("msePreferencesStatus105013").textContent =
        savePreferences()
          ? "Layout preference saved ✓"
          : "Could not save browser preference.";
    });

    applyPreferences();
    updateAccount();
  }

  function queueMount() {
    if (mounting) return;
    mounting = true;

    requestAnimationFrame(() => {
      mounting = false;
      mount();
    });
  }

  function watch() {
    const view = document.querySelector(SETTINGS_VIEW);

    if (!view || observedView === view) return;

    observer?.disconnect();
    observedView = view;

    observer = new MutationObserver(queueMount);

    observer.observe(view, {
      childList: true,
      subtree: true
    });

    queueMount();
  }

  function init() {
    installStyles();

    [0, 250, 750, 1500].forEach(delay => {
      setTimeout(watch, delay);
    });

    void identifyCoach();

    window.addEventListener("pageshow", () => {
      watch();
      void identifyCoach();
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
      { once: true }
    );
  } else {
    init();
  }
})();
