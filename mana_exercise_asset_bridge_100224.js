
/*
 MANA MOVEMENT — GITHUB EXERCISE ASSET BRIDGE
 COMPLETE BUILD 100229

 FULL REPLACEMENT:
 mana_exercise_asset_bridge_100224.js

 Adds eight verified band exercise demo PNGs:
 - Band Row
 - Band Pulldown
 - Band Shoulder Press
 - Band Biceps Curl
 - Band Triceps Pressdown
 - Band Lateral Raise
 - Band Pull Apart
 - Band Romanian Deadlift

 Preserves all existing exercise demos,
 muscle illustrations, automated/coach workouts,
 sets, reps, saved programs and Progress.
*/
(() => {
  "use strict";

  const BUILD = "100229";

  if (window.MANA_EXERCISE_ASSETS?.build === BUILD) {
    return;
  }

  const ROOT = "assets/exercises/";

  const DEMOS = new Set(`ab-wheel-rollout
arnold-press
assisted-pull-up
back-squat
band-biceps-curl
band-chest-press
band-lateral-raise
band-pull-apart
band-pulldown
band-romanian-deadlift
band-row
band-shoulder-press
band-triceps-pressdown
barbell-row
bench-press
biceps-curl
bird-dog
box-squat
bulgarian-split-squat
cable-chest-fly
cable-crunch
cable-hip-abduction
cable-kickback
cable-lateral-raise
cable-overhead-extension
cable-row
calf-raise
chest-supported-dumbbell-row
chest-supported-row
chin-up
close-grip-bench-press
db-lateral-raise
dead-bug
deadlift
decline-db-press
dip
double-kettlebell-front-squat
double-kettlebell-shoulder-press
dumbbell-bench-press
dumbbell-lunge
ez-bar-curl
face-pull
front-raise
front-squat
glute-bridge
glute-ham-raise
goblet-squat
good-morning
hack-squat
hammer-curl
hanging-leg-raise
hip-abduction
hip-adduction
hip-thrust
incline-db-press
incline-dumbbell-press
kettlebell-bent-over-row
kettlebell-deadlift
kettlebell-farmer-carry
kettlebell-floor-press
kettlebell-front-rack-carry
kettlebell-glute-bridge
kettlebell-goblet-squat
kettlebell-halo
kettlebell-hammer-curl
kettlebell-high-pull
kettlebell-overhead-triceps-extension
kettlebell-pullover
kettlebell-reverse-lunge
kettlebell-romanian-deadlift
kettlebell-split-squat
kettlebell-standing-calf-raise
kettlebell-suitcase-carry
kettlebell-sumo-deadlift
kettlebell-swing
landmine-press
lat-pulldown
lateral-raise
leg-curl
leg-extension
leg-press
lying-leg-curl
machine-chest-press
machine-shoulder-press
neutral-grip-lat-pulldown
one-arm-dumbbell-row
overhead-triceps-extension
pec-deck
plank
preacher-curl
pull-up
push-up
rear-delt-fly
rear-foot-elevated-split-squat
reverse-fly
reverse-lunge
romanian-deadlift
russian-twist
seated-cable-row
seated-calf-raise
seated-leg-curl
shoulder-press
side-plank
single-arm-kettlebell-floor-press
single-arm-kettlebell-press
single-arm-kettlebell-row
single-leg-rdl
skull-crusher
smith-machine-squat
standing-calf-raise
step-up
sumo-deadlift
t-bar-row
triceps-pressdown
upright-row
walking-lunge
wide-grip-seated-row`.trim().split(/\s+/));

  const MUSCLE_FILES = Object.freeze({
    chest: "muscle-chest.png",
    back: "muscle-back.png",
    shoulders: "muscle-shoulders.png",
    triceps: "muscle-triceps.png",
    quads: "muscle-quads.png",
    posterior: "muscle-glutes-hamstrings.png",
    calves: "muscle-calves.png",
    fullbody: "muscle-full body.png"
  });

  const DEMO_ALIASES = Object.freeze({
    "conventional-deadlift": "deadlift",
    "cable-triceps-pressdown": "triceps-pressdown",
    "lying-hamstring-curl": "lying-leg-curl",
    "seated-hamstring-curl": "seated-leg-curl",
    "dumbbell-lateral-raise": "db-lateral-raise",
    "incline-dumbbell-bench-press": "incline-dumbbell-press"
  });

  const clean = value =>
    String(value ?? "")
      .replace(/\s+/g, " ")
      .trim();

  const slug = value =>
    clean(value)
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const reg = () =>
    window.MANA_EXERCISE_REGISTRY;

  const visuals = () =>
    window.MANA_EXERCISE_VISUALS;

  const hasDemo = value =>
    DEMOS.has(value);

  const pathForSlug = value =>
    hasDemo(value)
      ? ROOT + value + "-demo.png"
      : null;

  function lookup(value) {
    const record =
      reg()?.resolve?.(value) || null;

    const candidates = [
      slug(value),
      record ? slug(record.name) : ""
    ];

    for (const base of candidates) {
      if (!base) continue;

      const name = hasDemo(base)
        ? base
        : DEMO_ALIASES[base];

      if (name && hasDemo(name)) {
        return {
          requested: clean(value),
          id: record?.id ?? null,
          canonicalName:
            record?.name || clean(value),
          slug: name,
          path: pathForSlug(name),
          exact: name === base,
          muscleImage:
            record?.muscleAsset || null,
          target:
            record?.muscleLabel ||
            record?.primaryMuscle ||
            "Full Body"
        };
      }
    }

    return {
      requested: clean(value),
      id: record?.id ?? null,
      canonicalName:
        record?.name || clean(value),
      slug: null,
      path: null,
      exact: false,
      muscleImage:
        record?.muscleAsset || null,
      target:
        record?.muscleLabel ||
        record?.primaryMuscle ||
        "Full Body"
    };
  }

  function inventory() {
    const all =
      reg()?.all?.() || [];

    const matched = [];
    const missing = [];

    for (const record of all) {
      const result = lookup(record.name);

      if (result.path) {
        matched.push(result);
      } else {
        missing.push(result);
      }
    }

    const used = new Set(
      matched.map(x => x.slug)
    );

    return {
      records: all.length,
      linked: matched.length,
      missing,
      matched,
      availableDemos: DEMOS.size,
      unclaimedDemoSlugs:
        [...DEMOS].filter(
          x => !used.has(x)
        ),
      muscleFiles: {
        ...MUSCLE_FILES
      }
    };
  }

  let delegatedOpen = null;
  let attachedAPI = null;

  function openDemo(name, ...args) {
    const info = lookup(name);

    const chosen = info.path
      ? info.slug.replace(/-/g, " ")
      : name;

    if (
      typeof delegatedOpen === "function"
    ) {
      return delegatedOpen(
        chosen,
        ...args
      );
    }

    return undefined;
  }

  function attach() {
    const api = visuals();

    if (
      !api ||
      typeof api.openDemo !== "function"
    ) {
      return false;
    }

    if (
      api.muscleAssets?.fullbody ===
      ROOT + "muscle-full-body.png"
    ) {
      api.muscleAssets.fullbody =
        ROOT + MUSCLE_FILES.fullbody;
    }

    if (api.openDemo === openDemo) {
      return true;
    }

    delegatedOpen = api.openDemo;
    attachedAPI = api;

    api.openDemo = openDemo;

    window.openManaExerciseGuide =
      openDemo;

    return true;
  }

  function stats() {
    const inv = inventory();

    return {
      build: BUILD,
      registryCount: inv.records,
      demoFiles: DEMOS.size,
      matchedToFiles: inv.linked,
      missingFileMatches:
        inv.missing.length,
      demoAdapter: !!(
        attachedAPI &&
        attachedAPI.openDemo === openDemo
      ),
      missingMuscleIllustrations: [
        "muscle-biceps.png",
        "muscle-core.png"
      ],
      unmatchedNames:
        inv.missing.map(
          x => x.canonicalName
        )
    };
  }

  window.MANA_EXERCISE_ASSETS =
    Object.freeze({
      build: BUILD,
      lookup,
      inventory,
      stats,
      openDemo,
      attach,
      demoSlugs: () => [...DEMOS],
      muscleFiles: MUSCLE_FILES
    });

  const start = () => {
    attach();

    if (
      reg()?.all?.()?.length
    ) {
      console.info(
        "[Mana Assets]",
        BUILD,
        stats()
      );
    }
  };

  window.addEventListener(
    "mana:exercise-registry-ready",
    start
  );

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      start,
      { once: true }
    );
  } else {
    start();
  }

  window.setTimeout(
    attach,
    1000
  );
})();
