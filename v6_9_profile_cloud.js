
/* ==========================================================
   MANA MOVEMENT TRAINING
   ACCOUNT-SAFE PROFILE CLOUD SYNC
   BUILD 105024

   COMPLETE REPLACEMENT:
   v6_9_profile_cloud.js

   - Separates local profiles by authenticated user ID
   - Keeps previous browser data as backups
   - Loads only the signed-in user's cloud profile
   - Never uploads legacy cached data automatically
   - Cloud writes only after explicit Save Profile
   - Prevents cloud refresh during form editing
   - Retains existing profile_settings database
   - Retains window.manaSyncProfile API

   Does not delete cloud data.
   ========================================================== */

(() => {
  "use strict";

  const FLAG = "MANA_PROFILE_CLOUD_105024";
  if (window[FLAG]) return;
  window[FLAG] = true;

  const LEGACY = "mana-profile-v67";
  const OWNER = "mana-profile-v67-owner-105015";
  const PREFIX = "mana-profile-account-105024:";
  const TABLE = "profile_settings";

  const $ = id => document.getElementById(id);

  let currentUser = "";
  let client = null;
  let syncing = false;
  let saving = false;
  let dirty = false;
  let generation = 0;
  let saveButton = null;

  function read(key) {
    try {
      const value = JSON.parse(
        localStorage.getItem(key) || "{}"
      );

      return value && typeof value === "object"
        ? value
        : {};
    } catch (_) {
      return {};
    }
  }

  function write(key, data) {
    localStorage.setItem(
      key,
      JSON.stringify(data)
    );
  }

  function accountKey(id) {
    return PREFIX + id;
  }

  function hasProfile(p) {
    return Boolean(
      p?.name ||
      p?.age ||
      p?.height ||
      p?.weight ||
      p?.goal ||
      p?.days ||
      p?.experience ||
      p?.equipment
    );
  }

  function screenOpen() {
    return Boolean(
      $("manaProfileScreen")
        ?.classList.contains("open")
    );
  }

  function editing() {
    const screen = $("manaProfileScreen");
    const element = document.activeElement;

    return Boolean(
      dirty ||
      (
        screenOpen() &&
        screen?.contains(element) &&
        element?.matches(
          "input,select,textarea"
        )
      )
    );
  }

  function status(message) {
    const element = $("manaProfileStatus");

    if (element) {
      element.textContent = message;
    }
  }

  function announce() {
    window.dispatchEvent(
      new CustomEvent("mana:profile-synced")
    );
  }

  function backup(key, contents) {
    if (!contents) return;

    try {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, contents);
      }
    } catch (error) {
      console.warn(
        "[Mana] Profile backup unavailable",
        error
      );
    }
  }

  function cloudToProfile(row) {
    return {
      name: row.name || "",
      age: Number(row.age) || 0,
      gender: "",
      height: Number(row.height_cm) || 0,
      weight: Number(row.weight_kg) || 0,
      days: row.training_days
        ? String(row.training_days)
        : "",
      goal: row.goal || "",
      experience: row.experience || "",
      equipment: row.equipment || "",
      updatedAt: row.updated_at || ""
    };
  }

  function profileToCloud(profile, id) {
    return {
      user_id: id,
      name: profile.name || null,
      age: Number(profile.age) || null,
      height_cm:
        Number(profile.height) || null,
      weight_kg:
        Number(profile.weight) || null,
      training_days:
        Number(profile.days) || null,
      goal: profile.goal || null,
      experience:
        profile.experience || null,
      equipment:
        profile.equipment || null,
      updated_at: new Date().toISOString()
    };
  }

  /* =====================================================
     AUTHENTICATED SESSION
     ===================================================== */

  async function getSession() {
    if (
      typeof window.supabaseClient !== "function"
    ) return null;

    const db = await window.supabaseClient();

    const {data, error} =
      await db.auth.getUser();

    if (
      error ||
      !data?.user?.id
    ) return null;

    client = db;

    return {
      db,
      user: data.user
    };
  }

  /* =====================================================
     ISOLATE BROWSER DATA

     The old browser key is retained because
     other Mana scripts still use it.

     Every account switch loads that account's
     own scoped copy into the legacy key.
     Unclaimed data is backed up, not imported.
     ===================================================== */

  function switchAccount(id) {
    const previousOwner =
      localStorage.getItem(OWNER) || "";

    if (
      currentUser === id &&
      previousOwner === id
    ) return false;

    const oldRaw =
      localStorage.getItem(LEGACY);

    if (oldRaw) {
      if (previousOwner) {
        backup(
          accountKey(previousOwner),
          oldRaw
        );
      } else {
        backup(
          "mana-profile-unclaimed-backup-105024",
          oldRaw
        );
      }
    }

    const scoped =
      read(accountKey(id));

    write(
      LEGACY,
      hasProfile(scoped) ? scoped : {}
    );

    localStorage.setItem(
      OWNER,
      id
    );

    currentUser = id;
    dirty = false;

    return true;
  }

  /* =====================================================
     REFRESH ONLY WHEN FORM IS IDLE
     ===================================================== */

  function refreshIdle() {
    if (!screenOpen() || editing()) return;

    if (
      typeof window.openManaProfile ===
      "function"
    ) {
      window.openManaProfile();
    }
  }

  /* =====================================================
     CLOUD RECONCILIATION

     Never uploads a local profile during
     login or account switching.
     ===================================================== */

  async function reconcileProfile() {
    if (syncing) return;

    syncing = true;

    const ticket = ++generation;

    try {
      const session = await getSession();

      if (!session) {
        currentUser = "";
        return;
      }

      const id = session.user.id;
      const changed = switchAccount(id);

      const result = await session.db
        .from(TABLE)
        .select("*")
        .eq("user_id", id)
        .maybeSingle();

      if (result.error) {
        throw result.error;
      }

      if (
        ticket !== generation ||
        currentUser !== id
      ) return;

      const local =
        read(accountKey(id));

      const cloud = result.data;

      if (cloud) {
        const remote =
          cloudToProfile(cloud);

        /*
         Gender and other local-only fields
         are preserved from this account's
         scoped profile, never another user.
        */

        const remoteTime = Date.parse(
          remote.updatedAt || ""
        ) || 0;

        const localTime = Date.parse(
          local.updatedAt || ""
        ) || 0;

        const next =
          hasProfile(local) &&
          localTime > remoteTime
            ? local
            : {
                ...local,
                ...remote,
                gender: local.gender || "",
                fuelGoal:
                  local.fuelGoal || "Maintenance",
                dailyActivity:
                  local.dailyActivity || ""
              };

        write(accountKey(id), next);

        if (!editing()) {
          write(LEGACY, next);
          refreshIdle();
          announce();
        }

      } else if (changed) {
        if (!editing()) {
          write(
            LEGACY,
            hasProfile(local) ? local : {}
          );

          refreshIdle();
        }
      }

    } catch (error) {
      console.warn(
        "[Mana Profile 105024] Sync:",
        error
      );
    } finally {
      syncing = false;
    }
  }

  /* =====================================================
     EXPLICIT SAVE ONLY
     ===================================================== */

  async function saveProfileCloud() {
    if (saving) return;
    saving = true;

    try {
      const session = await getSession();

      if (!session) {
        status(
          "Sign in before saving your profile."
        );
        return;
      }

      const id = session.user.id;

      if (
        !currentUser ||
        currentUser !== id ||
        localStorage.getItem(OWNER) !== id
      ) {
        status(
          "Account changed. Reopen your profile before saving."
        );
        return;
      }

      const profile = read(LEGACY);

      if (!hasProfile(profile)) {
        status("Complete your profile first.");
        return;
      }

      const updated = {
        ...profile,
        updatedAt:
          new Date().toISOString()
      };

      write(accountKey(id), updated);
      write(LEGACY, updated);

      const result = await session.db
        .from(TABLE)
        .upsert(
          profileToCloud(updated, id),
          {onConflict:"user_id"}
        );

      if (result.error) {
        throw result.error;
      }

      dirty = false;

      status("Profile saved to cloud ✓");
      announce();

    } catch (error) {
      console.warn(
        "[Mana Profile 105024] Save:",
        error
      );

      status(
        "Saved on device — cloud sync pending."
      );

    } finally {
      saving = false;
    }
  }

  /* =====================================================
     SAVE BUTTON — PRESERVE ORIGINAL HANDLER
     ===================================================== */

  function wireSave() {
    const button = $("manaProfileSave");

    if (!button || button === saveButton) {
      return;
    }

    saveButton = button;

    button.addEventListener(
      "click",
      () => {
        /*
         Original v6.7 handler saves to
         the existing browser key first.
        */

        setTimeout(() => {
          void saveProfileCloud();
        }, 150);
      }
    );
  }

  /* =====================================================
     INIT
     ===================================================== */

  async function init() {
    const screen = $("manaProfileScreen");

    screen?.addEventListener(
      "input",
      event => {
        if (
          event.target?.matches(
            "input,select,textarea"
          )
        ) {
          dirty = true;
        }
      },
      true
    );

    screen?.addEventListener(
      "change",
      event => {
        if (
          event.target?.matches(
            "input,select,textarea"
          )
        ) {
          dirty = true;
        }
      },
      true
    );

    [0,250,700].forEach(delay => {
      setTimeout(wireSave,delay);
    });

    await reconcileProfile();

    try {
      const session = await getSession();

      session?.db.auth.onAuthStateChange(
        () => {
          /*
           Defer work outside the auth
           callback to avoid deadlocks.
          */

          setTimeout(() => {
            void reconcileProfile();
          },100);
        }
      );

    } catch (_) {}

    window.addEventListener(
      "focus",
      () => {
        if (!editing()) {
          void reconcileProfile();
        }
      }
    );

    window.addEventListener(
      "pageshow",
      () => {
        wireSave();
        void reconcileProfile();
      }
    );

    console.log(
      "[Mana Movement] Account Profile " +
      "105024 active"
    );
  }

  window.manaSyncProfile = reconcileProfile;
  window.MANA_PROFILE_CLOUD_BUILD = "105024";

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => {void init();},
      {once:true}
    );
  } else {
    void init();
  }

})();
