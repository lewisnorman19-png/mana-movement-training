
/*
 MANA MOVEMENT — SHARED EXERCISE LIBRARY INTEGRATION
 COMPLETE BUILD 100223

 REQUIRES (already installed):
   mana_exercise_master_registry_100222.js
   v10_11_universal_exercise_visuals_101100.js

 Phase 2 — backward-compatible integration:
 - Coach Builder already reads the canonical exercise_library table.
 - Automated program names resolve to the same canonical registry IDs.
 - Original program names, saved programs and workout logs stay unchanged.
 - Shared visual lookup resolves known aliases to existing muscle mappings.
 - Shared demo entry points use the canonical name when a demo image exists.
 - Missing exercises are reported, never silently invented or substituted.
 - Does not touch Progress, workout inputs, set completion or Supabase rows.
*/
(() => {
  "use strict";

  const BUILD = "100223";
  const API_KEY = "MANA_EXERCISE_INTEGRATION";
  if (window[API_KEY]?.build === BUILD) return;

  const PROGRAM_KEY = "mana-strength-v62-program";
  let originalResolve = null;
  let originalOpenDemo = null;
  let attachedVisuals = null;
  let ready = false;
  let latest = null;
  let lastError = "";

  const registry = () => window.MANA_EXERCISE_REGISTRY || null;
  const clean = value => String(value ?? "").replace(/\s+/g, " ").trim();

  function resolve(nameOrId) {
    try {
      return registry()?.resolve?.(nameOrId) || null;
    } catch (_) {
      return null;
    }
  }

  function equivalentName(value) {
    const record = resolve(value);
    return record?.name || clean(value);
  }

  function visualFor(name) {
    const record = resolve(name);
    const original = typeof originalResolve === "function"
      ? originalResolve(name)
      : {};
    if (!record) return original || {};

    // The original system knows the target-muscle illustrations.
    // Use its canonical result for aliases, but preserve correct original rules.
    const canonical = typeof originalResolve === "function"
      ? originalResolve(record.name)
      : {};
    const isAlias = clean(name).toLowerCase() !== record.name.toLowerCase();
    const base = isAlias && canonical ? canonical : original;
    return {
      ...(base || {}),
      name: clean(name) || record.name,
      canonicalName: record.name,
      exerciseId: record.id,
      demo: record.demoImage || base?.demo || null,
      // Preserve existing muscle focus where defined; otherwise use DB metadata.
      target: base?.target && base.target !== "Full Body"
        ? base.target
        : (record.muscleLabel || record.primaryMuscle || base?.target || "Full Body"),
      cue: record.coachingCue || base?.cue || ""
    };
  }

  function demoFor(name, ...rest) {
    const record = resolve(name);
    // The existing player creates the Start/Finish frames from the PNG asset.
    // Only redirect known aliases when a matching canonical demo is linked.
    const chosen = record?.demoImage ? record.name : name;
    if (typeof originalOpenDemo === "function") {
      return originalOpenDemo(chosen, ...rest);
    }
    return undefined;
  }

  function attachVisuals() {
    const api = window.MANA_EXERCISE_VISUALS;
    if (!api || typeof api.resolve !== "function" ||
        typeof api.openDemo !== "function") return false;
    if (attachedVisuals === api && api.resolve === visualFor) return true;

    // Guard against wrapping our own function twice during app re-renders.
    if (api.resolve === visualFor && api.openDemo === demoFor) {
      attachedVisuals = api;
      return true;
    }

    originalResolve = api.resolve;
    originalOpenDemo = api.openDemo;
    api.resolve = visualFor;
    api.openDemo = demoFor;
    window.openManaExerciseGuide = demoFor;
    attachedVisuals = api;
    return true;
  }

  function automatedProgram() {
    try {
      const raw = window.localStorage.getItem(PROGRAM_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return Array.isArray(data?.sessions) ? data : null;
    } catch (_) {
      return null;
    }
  }

  function programLinks(program = automatedProgram()) {
    if (!program?.sessions || !Array.isArray(program.sessions)) {
      return { total: 0, matched: [], missing: [], sessions: [] };
    }

    const matched = [];
    const missing = [];
    const sessions = [];

    for (let dayIndex = 0; dayIndex < program.sessions.length; dayIndex++) {
      const day = program.sessions[dayIndex];
      const title = clean(day?.[0] || `Day ${dayIndex + 1}`);
      const exercises = Array.isArray(day?.[1]) ? day[1] : [];
      const mapped = [];

      for (let i = 0; i < exercises.length; i++) {
        const entry = exercises[i];
        const name = clean(Array.isArray(entry) ? entry[0] : entry?.name);
        if (!name) continue;
        const record = resolve(name);
        const link = {
          day: dayIndex + 1,
          position: i + 1,
          workout: title,
          originalName: name,
          canonicalName: record?.name || null,
          exerciseId: record?.id ?? null,
          demoImage: record?.demoImage || null,
          prescription: Array.isArray(entry) ? entry[1] : null
        };
        mapped.push(link);
        (record ? matched : missing).push(link);
      }
      sessions.push({ day: dayIndex + 1, name: title, exercises: mapped });
    }
    return {
      total: matched.length + missing.length,
      matched,
      missing,
      sessions
    };
  }

  function refresh() {
    latest = programLinks();
    window.dispatchEvent(new CustomEvent("mana:exercise-integration-updated", {
      detail: {
        build: BUILD,
        total: latest.total,
        matched: latest.matched.length,
        missing: latest.missing.length
      }
    }));
    return latest;
  }

  function stats() {
    const link = latest || programLinks();
    const r = registry();
    return {
      build: BUILD,
      registryReady: ready,
      registryCount: r?.stats?.().count || 0,
      coachBuilderSource: "exercise_library (Supabase)",
      visualAdapter: !!(attachedVisuals &&
        attachedVisuals.resolve === visualFor),
      autoProgramExercises: link.total,
      autoProgramMatched: link.matched.length,
      autoProgramUnmatched: link.missing.length,
      error: lastError
    };
  }

  async function initialize() {
    const r = registry();
    if (!r?.load || !r?.resolve) {
      lastError = "Master registry 100222 is missing";
      return;
    }
    attachVisuals();
    try {
      await r.load();
      ready = true;
      lastError = "";
      refresh();
    } catch (err) {
      ready = false;
      lastError = String(err?.message || err);
      console.warn("[Mana Exercise Integration] Registry load:", lastError);
    }
  }

  window[API_KEY] = Object.freeze({
    build: BUILD,
    resolve,
    canonicalName: equivalentName,
    visualFor,
    openDemo: demoFor,
    automatedProgram,
    programLinks,
    refresh,
    stats
  });

  window.addEventListener("mana:strength-program-built", refresh);
  window.addEventListener("mana:strength-synced", refresh);
  window.addEventListener("mana:exercise-registry-ready", () => {
    ready = true;
    attachVisuals();
    refresh();
  });
  window.addEventListener("mana:logout", () => {
    ready = false;
    latest = null;
  });

  // The visual API initializes on DOMContentLoaded. Retry once after page setup.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    void initialize();
  }
  window.setTimeout(() => {
    attachVisuals();
    if (!ready) void initialize();
  }, 900);
})();
