/* =========================================
   MANA MOVEMENT TRAINING v7.2.1
   CLOUD STRENGTH SYNC + SAFE HISTORY RESET

   FIX:
   - Reset Training History now clears local logs
   - Deletes the user's cloud strength_workouts
   - Prevents an in-flight cloud sync from restoring
     deleted history during the reset
   - Keeps Fuel, nutrition, program and timing data
     untouched
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "7210";

  const LOCAL_KEY =
    "mana-strength-v64-logs";

  const TABLE =
    "strength_workouts";

  let syncing =
    false;

  let resetting =
    false;

  let syncGeneration =
    0;

  function safeJson(
    raw,
    fallback
  ) {
    try {
      return JSON.parse(
        raw
      );
    } catch (_) {
      return fallback;
    }
  }

  function loadLocal() {
    const logs =
      safeJson(
        localStorage.getItem(
          LOCAL_KEY
        ) || "[]",
        []
      );

    return Array.isArray(
      logs
    )
      ? logs
      : [];
  }

  function saveLocal(
    logs
  ) {
    localStorage.setItem(
      LOCAL_KEY,
      JSON.stringify(
        Array.isArray(
          logs
        )
          ? logs
          : []
      )
    );
  }

  async function getClient() {
    if (
      typeof window.supabaseClient ===
        "function"
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
          persistSession:true,
          autoRefreshToken:true,
          detectSessionInUrl:true
        }
      }
    );
  }

  async function getUser(
    client
  ) {
    if (!client) {
      return null;
    }

    const {
      data,
      error
    } =
      await client.auth.getUser();

    if (error) {
      return null;
    }

    return (
      data?.user ||
      null
    );
  }

  function localToCloud(
    log,
    userId
  ) {
    return {
      id:
        String(
          log.id
        ),

      user_id:
        userId,

      workout_date:
        log.date ||
        new Date()
          .toISOString(),

      day_index:
        Number(
          log.dayIndex ??
          0
        ),

      session_name:
        log.sessionName ||
        null,

      goal:
        log.goal ||
        null,

      equipment:
        log.equipment ||
        null,

      completed_sets:
        Number(
          log.completedSets ||
          0
        ),

      total_volume:
        Number(
          log.totalVolume ||
          0
        ),

      exercises:
        Array.isArray(
          log.exercises
        )
          ? log.exercises
          : []
    };
  }

  function cloudToLocal(
    row
  ) {
    return {
      id:
        String(
          row.id
        ),

      date:
        row.workout_date,

      dayIndex:
        Number(
          row.day_index ||
          0
        ),

      sessionName:
        row.session_name ||
        "",

      goal:
        row.goal ||
        "",

      equipment:
        row.equipment ||
        "",

      completedSets:
        Number(
          row.completed_sets ||
          0
        ),

      totalVolume:
        Number(
          row.total_volume ||
          0
        ),

      exercises:
        Array.isArray(
          row.exercises
        )
          ? row.exercises
          : []
    };
  }

  function mergeLogs(
    local,
    cloud
  ) {
    const map =
      new Map();

    [
      ...local,
      ...cloud
    ].forEach(
      log => {

        if (
          !log?.id
        ) {
          return;
        }

        map.set(
          String(
            log.id
          ),
          log
        );

      }
    );

    return [
      ...map.values()
    ].sort(
      (
        a,
        b
      ) =>
        new Date(
          a.date ||
          0
        ) -
        new Date(
          b.date ||
          0
        )
    );
  }

  async function uploadMissing(
    client,
    user,
    localLogs,
    cloudLogs
  ) {
    if (
      resetting
    ) {
      return;
    }

    const cloudIds =
      new Set(
        cloudLogs.map(
          log =>
            String(
              log.id
            )
        )
      );

    const missing =
      localLogs.filter(
        log =>
          log?.id &&
          !cloudIds.has(
            String(
              log.id
            )
          )
      );

    if (
      !missing.length
    ) {
      return;
    }

    const rows =
      missing.map(
        log =>
          localToCloud(
            log,
            user.id
          )
      );

    const {
      error
    } =
      await client
        .from(
          TABLE
        )
        .upsert(
          rows,
          {
            onConflict:"id"
          }
        );

    if (
      error
    ) {
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
        .from(
          TABLE
        )
        .select(
          "*"
        )
        .eq(
          "user_id",
          user.id
        )
        .order(
          "workout_date",
          {
            ascending:true
          }
        );

    if (
      error
    ) {
      throw error;
    }

    return (
      data ||
      []
    ).map(
      cloudToLocal
    );
  }

  async function deleteCloudHistory(
    client,
    user
  ) {
    const {
      error
    } =
      await client
        .from(
          TABLE
        )
        .delete()
        .eq(
          "user_id",
          user.id
        );

    if (
      error
    ) {
      throw error;
    }
  }

  async function resetStrengthHistory() {
    /*
      Invalidate any sync already in progress.

      Even if an older sync finishes after this
      reset starts, it will not be allowed to
      write the old cloud workouts back locally.
    */

    resetting =
      true;

    syncGeneration +=
      1;

    /*
      Keep the local reset immediate so the
      Progress screen clears straight away.
    */

    saveLocal(
      []
    );

    try {
      const client =
        await getClient();

      const user =
        await getUser(
          client
        );

      if (
        client &&
        user
      ) {
        await deleteCloudHistory(
          client,
          user
        );
      }

      /*
        Re-assert the local empty state after
        the cloud delete completes.
      */

      saveLocal(
        []
      );

      window.dispatchEvent(
        new CustomEvent(
          "mana:strength-cloud-reset-complete"
        )
      );

    } catch (
      error
    ) {
      /*
        Do not restore old local history if the
        cloud delete fails.

        Keep the local reset intact and report
        the cloud problem in the console.
      */

      saveLocal(
        []
      );

      console.warn(
        "Mana strength cloud reset:",
        error
      );

      window.dispatchEvent(
        new CustomEvent(
          "mana:strength-cloud-reset-error",
          {
            detail:{
              message:
                error?.message ||
                String(
                  error
                )
            }
          }
        )
      );

    } finally {
      resetting =
        false;
    }
  }

  async function syncStrengthLogs() {
    if (
      syncing ||
      resetting
    ) {
      return;
    }

    const myGeneration =
      syncGeneration;

    syncing =
      true;

    try {
      const client =
        await getClient();

      const user =
        await getUser(
          client
        );

      if (
        !client ||
        !user ||
        resetting ||
        myGeneration !==
          syncGeneration
      ) {
        return;
      }

      const localLogs =
        loadLocal();

      const cloudLogs =
        await loadCloud(
          client,
          user
        );

      if (
        resetting ||
        myGeneration !==
          syncGeneration
      ) {
        return;
      }

      await uploadMissing(
        client,
        user,
        localLogs,
        cloudLogs
      );

      if (
        resetting ||
        myGeneration !==
          syncGeneration
      ) {
        return;
      }

      const latestCloud =
        await loadCloud(
          client,
          user
        );

      if (
        resetting ||
        myGeneration !==
          syncGeneration
      ) {
        return;
      }

      const merged =
        mergeLogs(
          localLogs,
          latestCloud
        );

      /*
        Final guard immediately before writing.

        This is what stops an older async sync
        from bringing workouts back after Reset.
      */

      if (
        resetting ||
        myGeneration !==
          syncGeneration
      ) {
        return;
      }

      saveLocal(
        merged
      );

      window.dispatchEvent(
        new CustomEvent(
          "mana:strength-synced"
        )
      );

    } catch (
      error
    ) {
      console.warn(
        "Mana strength cloud sync:",
        error
      );
    } finally {
      syncing =
        false;
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
        ) {
          return;
        }

        /*
          Existing logger saves locally first,
          then this uploads the finished workout.
        */

        setTimeout(
          syncStrengthLogs,
          1200
        );

      }
    );
  }

  function watchHistoryReset() {
    window.addEventListener(
      "mana:strength-progress-reset",
      () => {

        /*
          v9.11 fires this event after the user
          confirms Reset Training History.

          The Progress file clears local history.
          This file now clears the matching cloud
          history as well.
        */

        resetStrengthHistory();

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

    watchHistoryReset();

    window.addEventListener(
      "focus",
      () => {

        if (
          !resetting
        ) {
          syncStrengthLogs();
        }

      }
    );

    const client =
      await getClient();

    if (
      client
    ) {
      client.auth
        .onAuthStateChange(
          () => {

            setTimeout(
              () => {

                if (
                  !resetting
                ) {
                  syncStrengthLogs();
                }

              },
              300
            );

          }
        );
    }
  }

  window.MANA_STRENGTH_CLOUD_BUILD =
    BUILD;

  window.manaSyncStrength =
    syncStrengthLogs;

  window.manaResetStrengthCloudHistory =
    resetStrengthHistory;

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
