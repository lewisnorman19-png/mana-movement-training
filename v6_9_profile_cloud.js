/* =========================================
   MANA MOVEMENT TRAINING v6.9
   CLOUD PROFILE SYNC
   ========================================= */

(() => {
  "use strict";

  const LOCAL_KEY = "mana-profile-v67";
  const TABLE = "profile_settings";

  let syncing = false;

  function safeJson(raw, fallback) {
    try {
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }

  function localProfile() {
    return safeJson(
      localStorage.getItem(LOCAL_KEY) || "{}",
      {}
    );
  }

  function saveLocal(profile) {
    localStorage.setItem(
      LOCAL_KEY,
      JSON.stringify(profile)
    );
  }

  function hasProfile(profile) {
    if (!profile) return false;

    return Boolean(
      profile.name ||
      profile.age ||
      profile.height ||
      profile.weight ||
      profile.days ||
      profile.goal ||
      profile.experience ||
      profile.equipment
    );
  }

  async function getClient() {
    if (
      typeof window.supabaseClient === "function"
    ) {
      return await window.supabaseClient();
    }

    if (
      !window.supabase ||
      !window.MANA_CONFIG
    ) {
      return null;
    }

    return window.supabase.createClient(
      window.MANA_CONFIG.supabaseUrl,
      window.MANA_CONFIG.supabaseAnonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    );
  }

  async function getUser(client) {
    if (!client) return null;

    const {
      data,
      error
    } = await client.auth.getUser();

    if (error) return null;

    return data?.user || null;
  }

  function cloudToLocal(row) {
    return {
      name: row.name || "",
      age: Number(row.age) || 0,
      height: Number(row.height_cm) || 0,
      weight: Number(row.weight_kg) || 0,

      days:
        row.training_days
          ? String(row.training_days)
          : "",

      goal: row.goal || "",
      experience: row.experience || "",
      equipment: row.equipment || "",

      updatedAt:
        row.updated_at ||
        new Date().toISOString()
    };
  }

  function localToCloud(profile, userId) {
    return {
      user_id: userId,

      name:
        profile.name || null,

      age:
        Number(profile.age) || null,

      height_cm:
        Number(profile.height) || null,

      weight_kg:
        Number(profile.weight) || null,

      training_days:
        Number(profile.days) || null,

      goal:
        profile.goal || null,

      experience:
        profile.experience || null,

      equipment:
        profile.equipment || null,

      updated_at:
        profile.updatedAt ||
        new Date().toISOString()
    };
  }

  function timeValue(value) {
    const time =
      new Date(value || 0).getTime();

    return Number.isFinite(time)
      ? time
      : 0;
  }

  function refreshOpenProfile() {
    const screen =
      document.getElementById(
        "manaProfileScreen"
      );

    if (
      screen?.classList.contains("open") &&
      typeof window.openManaProfile ===
        "function"
    ) {
      window.openManaProfile();
    }
  }

  function announceSync() {
    window.dispatchEvent(
      new CustomEvent(
        "mana:profile-synced"
      )
    );
  }

  async function uploadProfile(
    client,
    user,
    profile
  ) {
    const row =
      localToCloud(
        profile,
        user.id
      );

    const {
      error
    } =
      await client
        .from(TABLE)
        .upsert(
          row,
          {
            onConflict:
              "user_id"
          }
        );

    if (error) {
      throw error;
    }

    return row;
  }

  async function loadCloudRow(
    client,
    user
  ) {
    const {
      data,
      error
    } =
      await client
        .from(TABLE)
        .select("*")
        .eq(
          "user_id",
          user.id
        )
        .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  async function reconcileProfile() {
    if (syncing) return;

    syncing = true;

    try {
      const client =
        await getClient();

      const user =
        await getUser(client);

      if (!client || !user) {
        return;
      }

      const local =
        localProfile();

      const cloud =
        await loadCloudRow(
          client,
          user
        );

      /*
        First device:
        cloud empty -> upload local
      */
      if (!cloud) {
        if (
          hasProfile(local)
        ) {
          if (
            !local.updatedAt
          ) {
            local.updatedAt =
              new Date().toISOString();

            saveLocal(local);
          }

          await uploadProfile(
            client,
            user,
            local
          );
        }

        return;
      }

      const cloudProfile =
        cloudToLocal(cloud);

      /*
        Newest copy wins.
      */

      const localTime =
        timeValue(
          local.updatedAt
        );

      const cloudTime =
        timeValue(
          cloudProfile.updatedAt
        );

      if (
        !hasProfile(local) ||
        cloudTime > localTime
      ) {
        saveLocal(
          cloudProfile
        );

        refreshOpenProfile();
        announceSync();

        return;
      }

      if (
        localTime > cloudTime
      ) {
        await uploadProfile(
          client,
          user,
          local
        );
      }

    } catch (error) {
      console.warn(
        "Mana profile cloud sync:",
        error
      );
    } finally {
      syncing = false;
    }
  }

  async function saveCurrentProfileCloud() {
    try {
      const client =
        await getClient();

      const user =
        await getUser(client);

      if (!client || !user) {
        return;
      }

      const profile =
        localProfile();

      if (
        !hasProfile(profile)
      ) {
        return;
      }

      if (
        !profile.updatedAt
      ) {
        profile.updatedAt =
          new Date().toISOString();

        saveLocal(profile);
      }

      await uploadProfile(
        client,
        user,
        profile
      );

      const status =
        document.getElementById(
          "manaProfileStatus"
        );

      if (status) {
        status.textContent =
          "Profile saved to cloud ✓";
      }

      announceSync();

    } catch (error) {
      console.warn(
        "Could not save cloud profile:",
        error
      );

      const status =
        document.getElementById(
          "manaProfileStatus"
        );

      if (status) {
        status.textContent =
          "Saved on device — cloud sync pending";
      }
    }
  }

  function wireSaveButton() {
    const button =
      document.getElementById(
        "manaProfileSave"
      );

    if (!button) return;

    if (
      button.dataset
        .manaCloudWired === "1"
    ) {
      return;
    }

    button.dataset
      .manaCloudWired = "1";

    button.addEventListener(
      "click",
      () => {
        /*
          v6.7 saves local first.
          Then v6.9 uploads it.
        */
        setTimeout(() => {
          saveCurrentProfileCloud();
        }, 50);
      }
    );
  }

  async function init() {
    setTimeout(
      reconcileProfile,
      400
    );

    setTimeout(
      reconcileProfile,
      1400
    );

    setInterval(() => {
      wireSaveButton();
    }, 500);

    const client =
      await getClient();

    if (client) {
      client.auth
        .onAuthStateChange(
          () => {
            setTimeout(
              reconcileProfile,
              250
            );
          }
        );
    }

    window.addEventListener(
      "focus",
      () => {
        reconcileProfile();
      }
    );
  }

  window.manaSyncProfile =
    reconcileProfile;

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }

})();
