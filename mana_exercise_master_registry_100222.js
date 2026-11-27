
/*
 MANA MOVEMENT — MASTER EXERCISE REGISTRY
 COMPLETE BUILD 100222

 Phase 1 (safe/read-only): one canonical lookup for both workout systems.
 - Reads active exercise_library records from the existing Supabase client
 - Resolves explicitly approved historical/automated name aliases
 - Uses existing image_url references, without inventing demo assets
 - Exposes consistent canonical IDs, names, groups, equipment and demo paths
 - Does NOT modify programs, workouts, database, or existing visual functions
*/
(() => {
  "use strict";
  if (window.MANA_EXERCISE_REGISTRY?.build === "100222") return;

  const BUILD = "100222";
  const normalize = value => String(value || "")
    .toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim()
    .replace(/\s+/g, " ");
  const slug = value => normalize(value).replace(/ /g, "-");

  // Historical generator names that have an established database equivalent.
  // Do not map other names by guessing: unresolved names must remain visible.
  const ALIASES = Object.freeze({
    "deadlift": "Conventional Deadlift",
    "incline db press": "Incline Dumbbell Press",
    "shoulder press": "Dumbbell Shoulder Press",
    "leg curl": "Lying Hamstring Curl",
    "calf raise": "Standing Calf Raise",
    "db lateral raise": "Lateral Raise",
    "biceps curl": "Dumbbell Curl",
    "triceps pressdown": "Cable Triceps Pressdown",
    "db romanian deadlift": "Dumbbell Romanian Deadlift",
    "db shoulder press": "Dumbbell Shoulder Press",
    "one arm db row": "One Arm Dumbbell Row",
    "chest supported db row": "Chest Supported Row",
    "db reverse lunge": "Reverse Lunge",
    "db rear delt fly": "Rear Delt Fly",
    "db biceps curl": "Dumbbell Curl",
    "db dead bug": "Dead Bug",
    "incline push up": "Incline Push Up",
    "push up": "Push Up",
    "step up": "Step Up",
    "seated leg curl": "Seated Hamstring Curl",
    "lying leg curl": "Lying Hamstring Curl",
    "cable row": "Cable Row",
    "dumbbell bench press": "Dumbbell Bench Press"
  });

  let byName = new Map();
  let byId = new Map();
  let list = [];
  let pending = null;
  let updatedAt = 0;
  let lastError = "";

  function canonicalKey(name) {
    const source = normalize(name);
    return normalize(ALIASES[source] || source);
  }

  function recordView(row) {
    const name = String(row.name || "").trim();
    const image = typeof row.image_url === "string"
      ? row.image_url.trim() : "";
    const video = typeof row.video_url === "string"
      ? row.video_url.trim() : "";

    // Existing .png files are image-backed demos, not video URLs.
    const defaultVisual =
      window.MANA_EXERCISE_VISUALS?.resolve?.(name) || {};

    return Object.freeze({
      id: row.id,
      name,
      category: row.category || "",
      primaryMuscle: row.primary_muscle || "",
      equipment: row.equipment || "",
      difficulty: row.difficulty || "",
      demoImage: image || null,
      videoUrl: video || null,
      muscleAsset:
        window.MANA_EXERCISE_VISUALS?.muscleAssets?.[
          defaultVisual.muscle || "fullbody"
        ] || null,
      muscleLabel:
        defaultVisual.target || row.primary_muscle || "Full Body",
      coachingCue:
        row.coaching_cue || defaultVisual.cue || "",
      defaultSets: row.default_sets,
      defaultReps: row.default_reps,
      defaultRestSeconds: row.default_rest_seconds
    });
  }

  async function load(options = {}) {
    const force = !!options.force;
    if (pending) return pending;

    if (
      !force &&
      list.length &&
      Date.now() - updatedAt < 60000
    ) {
      return list.slice();
    }

    pending = (async () => {
      try {
        if (typeof window.supabaseClient !== "function") {
          throw new Error("Supabase client isn't available");
        }

        const db = await window.supabaseClient();

        // No writes: the coach builder already reads this same table.
        const response = await db
          .from("exercise_library")
          .select(
            "id,name,category,primary_muscle,equipment," +
            "difficulty,image_url,video_url,coaching_cue," +
            "default_sets,default_reps,default_rest_seconds"
          )
          .eq("is_active", true)
          .order("name");

        if (response.error) throw response.error;

        const nextByName = new Map();
        const nextById = new Map();
        const next = [];

        for (const row of response.data || []) {
          if (!row?.name) continue;

          const key = normalize(row.name);
          if (nextByName.has(key)) continue;

          const record = recordView(row);
          nextByName.set(key, record);
          nextById.set(String(record.id), record);
          next.push(record);
        }

        byName = nextByName;
        byId = nextById;
        list = next;
        updatedAt = Date.now();
        lastError = "";

        window.dispatchEvent(
          new CustomEvent("mana:exercise-registry-ready", {
            detail: {
              build: BUILD,
              count: list.length
            }
          })
        );

        return list.slice();
      } catch (error) {
        lastError = String(error?.message || error);

        window.dispatchEvent(
          new CustomEvent("mana:exercise-registry-error", {
            detail: { message: lastError }
          })
        );

        throw error;
      } finally {
        pending = null;
      }
    })();

    return pending;
  }

  function resolve(nameOrId) {
    if (nameOrId === null || nameOrId === undefined) {
      return null;
    }

    const key = String(nameOrId);

    return (
      byId.get(key) ||
      byName.get(canonicalKey(key)) ||
      null
    );
  }

  function audit(names = []) {
    const matched = [];
    const unmatched = [];

    for (const name of names) {
      const result = resolve(name);

      if (result) {
        matched.push({
          original: name,
          canonical: result.name,
          id: result.id
        });
      } else {
        unmatched.push(String(name));
      }
    }

    return {
      total: names.length,
      matched,
      unmatched
    };
  }

  function stats() {
    return {
      build: BUILD,
      count: list.length,
      withDemoImage:
        list.filter(x => x.demoImage).length,
      withoutDemoImage:
        list.filter(x => !x.demoImage).length,
      aliases: Object.keys(ALIASES).length,
      loadedAt:
        updatedAt
          ? new Date(updatedAt).toISOString()
          : null,
      error: lastError
    };
  }

  window.MANA_EXERCISE_REGISTRY = Object.freeze({
    build: BUILD,
    load,
    all: () => list.slice(),
    resolve,
    audit,
    stats,
    normalize,
    aliases: ALIASES
  });

  window.addEventListener("mana:logout", () => {
    byName = new Map();
    byId = new Map();
    list = [];
    updatedAt = 0;
    lastError = "";
  });

  // Load once so the lookup is ready for both workflows.
  const begin = () => load().catch(err =>
    console.warn(
      "[Mana Registry] Couldn't load library:",
      err.message
    )
  );

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      begin,
      { once: true }
    );
  } else {
    begin();
  }
})();
