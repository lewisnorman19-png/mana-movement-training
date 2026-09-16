/* =========================================
   MANA MOVEMENT TRAINING v7.2
   CLOUD STRENGTH SYNC
   ========================================= */

(() => {
  "use strict";

  const LOCAL_KEY =
    "mana-strength-v64-logs";

  const TABLE =
    "strength_workouts";

  let syncing = false;

  function safeJson(raw, fallback) {
    try {
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }

  function loadLocal() {
    return safeJson(
      localStorage.getItem(LOCAL_KEY) || "[]",
      []
    );
  }

  function saveLocal(logs) {
    localStorage.setItem(
      LOCAL_KEY,
      JSON.stringify(logs)
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

  function localToCloud(log, userId) {
    return {
      id: String(log.id),
      user_id: userId,
      workout_date:
        log.date ||
        new Date().toISOString(),

      day_index:
        Number(log.dayIndex ?? 0),

      session_name:
        log.sessionName || null,

      goal:
        log.goal || null,

      equipment:
        log.equipment || null,

      completed_sets:
        Number(
          log.completedSets || 0
        ),

      total_volume:
        Number(
          log.totalVolume || 0
        ),

      exercises:
        Array.isArray(log.exercises)
          ? log.exercises
          : []
    };
  }

  function cloudToLocal(row) {
    return {
      id:
        String(row.id),

      date:
        row.workout_date,

      dayIndex:
        Number(
          row.day_index || 0
        ),

      sessionName:
        row.session_name || "",

      goal:
        row.goal || "",

      equipment:
        row.equipment || "",

      completedSets:
        Number(
          row.completed_sets || 0
        ),

      totalVolume:
        Number(
          row.total_volume || 0
        ),

      exercises:
        Array.isArray(row.exercises)
          ? row.exercises
          : []
    };
  }

  function mergeLogs(local, cloud) {
    const map = new Map();

    [...local, ...cloud]
      .forEach(log => {
        if (!log?.id) return;

        map.set(
          String(log.id),
          log
        );
      });

    return [
      ...map.values()
    ].sort(
      (a, b) =>
        new Date(a.date || 0) -
        new Date(b.date || 0)
    );
  }

  async function uploadMissing(
    client,
    user,
    localLogs,
    cloudLogs
  ) {
    const cloudIds =
      new Set(
        cloudLogs.map(
          log => String(log.id)
        )
      );

    const missing =
      localLogs.filter(
        log =>
          log?.id &&
          !cloudIds.has(
            String(log.id)
          )
      );

    if (!missing.length) return;

    const rows =
      missing.map(log =>
        localToCloud(
          log,
          user.id
        )
      );

    const {
      error
    } =
      await client
        .from(TABLE)
        .upsert(
          rows,
          {
            onConflict: "id"
          }
        );

    if (error) {
      throw error;
    }
  }

  async function loadCloud(
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
        .order(
          "workout_date",
          {
            ascending: true
          }
        );

    if (error) {
      throw error;
    }

    return (
      data || []
    ).map(
      cloudToLocal
    );
  }

  async function syncStrengthLogs() {
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

      const localLogs =
        loadLocal();

      const cloudLogs =
        await loadCloud(
          client,
          user
        );

      await uploadMissing(
        client,
        user,
        localLogs,
        cloudLogs
      );

      const latestCloud =
        await loadCloud(
          client,
          user
        );

      const merged =
        mergeLogs(
          localLogs,
          latestCloud
        );

      saveLocal(merged);

      window.dispatchEvent(
        new CustomEvent(
          "mana:strength-synced"
        )
      );

    } catch (error) {
      console.warn(
        "Mana strength cloud sync:",
        error
      );
    } finally {
      syncing = false;
    }
  }

  function watchWorkoutComplete() {
    document.addEventListener(
      "click",
      event => {
        if (
          !event.target.closest(
            "#manaV64Complete"
          )
        ) return;

        /*
          Existing logger saves locally
          first, then we sync it.
        */
        setTimeout(
          syncStrengthLogs,
          1200
        );
      }
    );
  }

  async function init() {
    setTimeout(
      syncStrengthLogs,
      700
    );

    setTimeout(
      syncStrengthLogs,
      1800
    );

    watchWorkoutComplete();

    window.addEventListener(
      "focus",
      syncStrengthLogs
    );

    const client =
      await getClient();

    if (client) {
      client.auth
        .onAuthStateChange(
          () => {
            setTimeout(
              syncStrengthLogs,
              300
            );
          }
        );
    }
  }

  window.manaSyncStrength =
    syncStrengthLogs;

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }

})();
