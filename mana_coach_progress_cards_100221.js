
/* MANA MOVEMENT — COACH PROGRESS SEVEN-CARD ALIGNMENT
   Complete standalone Build 100221.
   Reads completed coach finishers; never changes workout records. */
(() => {
  "use strict";
  const BUILD = "100221";
  const ROOT = "manaV993StrengthProgress";
  const COACH = "m1002CoachProgress";
  const ID = "manaCoachProgressCards100221";
  const $ = id => document.getElementById(id);
  const num = value => Number.isFinite(Number(value)) ? Number(value) : 0;
  let records = [];
  let loadedAt = 0;
  let loading = false;
  let activeUser = "";
  let queued = false;
  let request = 0;
  let error = "";

  function open() {
    return $("manaV83ProgramShell")?.classList.contains("open") &&
      $("manaV83Title")?.textContent?.trim().toUpperCase() === "MANA STRENGTH" &&
      !!document.querySelector('#manaV83Tabs [data-v83-tab="progress"].active');
  }
  function coachVisible() {
    return open() && $(ROOT)?.classList.contains("m1002-show-coach");
  }
  function key(card) {
    const label = card.querySelector(".mana-v993-metric-label");
    const text = (label?.textContent || "").replace(/[^a-z]/gi, "").toUpperCase();
    if (text.includes("WORKOUT")) return "workouts";
    if (text.includes("CARDIO")) return "cardio";
    if (text.includes("CORE")) return "core";
    if (text.includes("PROTEIN")) return "protein";
    if (text.includes("CALOR")) return "calories";
    if (text.includes("RECOVER") || text.includes("REST")) return "recovery";
    if (text.includes("WATER")) return "water";
    return "";
  }
  const order = ["workouts", "cardio", "core", "protein", "calories", "recovery", "water"];

  function range() {
    const selected = $(COACH)?.querySelector('[data-m100216-period].active')
      ?.dataset.m100216Period || "daily";
    const today = new Date();
    if (selected === "all") return { selected, start: null };
    const start = new Date(today);
    start.setHours(0, 0, 0, 0);
    if (selected === "weekly") start.setDate(start.getDate() - (start.getDay() + 6) % 7);
    if (selected === "monthly") start.setDate(1);
    return { selected, start };
  }

  function coachTotals() {
    const { selected, start } = range();
    const filtered = records.filter(record => {
      if (!start) return true;
      const d = new Date(record.completed_at || record.updated_at || "");
      return Number.isFinite(d.getTime()) && d >= start;
    });
    const cardioMinutes = filtered.reduce((total, record) => {
      const cardio = record.finishers?.cardio;
      return total + (cardio?.completed
        ? num(cardio.actualMinutes ?? cardio.durationMinutes ?? 0) : 0);
    }, 0);
    const coreCount = filtered.filter(r => r.finishers?.core?.completed).length;
    const cardioTarget = selected === "daily" ? 15 : selected === "monthly" ? 180 : 45;
    const coreTarget = selected === "daily" ? 1 : selected === "monthly" ? 12 : 3;
    return { selected, cardioMinutes, coreCount, cardioTarget, coreTarget };
  }

  function writeMetric(card, value, target, unit, label) {
    const valueNode = card.querySelector(".mana-v993-metric-value");
    const subNode = card.querySelector(".mana-v993-metric-sub");
    const bar = card.querySelector(".mana-v993-fill");
    const percentage = Math.min(100, Math.round(100 * value / (target || 1)));
    const percentText = `${percentage}%`;
    const subText = `${Number.isInteger(value) ? value : value.toFixed(1)} / ${target} ${unit}`;
    if (valueNode && valueNode.textContent.trim() !== percentText) valueNode.textContent = percentText;
    if (subNode && subNode.textContent.trim() !== subText) subNode.textContent = subText;
    if (bar && bar.style.width !== `${percentage}%`) bar.style.width = `${percentage}%`;
    card.dataset.mana221 = label;
  }

  function reconcile() {
    if (!coachVisible()) return;
    const root = $(ROOT);
    const coach = $(COACH);
    const generatedGrid = [...root.children].find(el => el.classList.contains("mana-v993-metrics"));
    const coachGrid = coach?.querySelector('[data-m100216-root] > .mana-v993-metrics');
    if (!generatedGrid || !coachGrid) return;

    const original = new Map();
    generatedGrid.querySelectorAll(":scope > .mana-v993-metric").forEach(card => {
      const name = key(card);
      if (name && !original.has(name)) original.set(name, card);
    });
    const existing = new Map();
    coachGrid.querySelectorAll(":scope > .mana-v993-metric").forEach(card => {
      const name = key(card);
      if (name && !existing.has(name)) existing.set(name, card);
    });
    // Keep Coach Workouts' own WORKOUTS total; share the other original
    // metric layouts, including its icons and existing Fuel data.
    const missing = order.filter(name => !existing.has(name) && original.has(name));
    for (const name of missing) {
      const source = original.get(name);
      const clone = source.cloneNode(true);
      clone.removeAttribute("id");
      clone.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));
      coachGrid.appendChild(clone);
      existing.set(name, clone);
    }
    // Preserve Coach's own card values if present; use the automated
    // cards to supply only missing template cards.
    order.forEach(name => {
      const card = existing.get(name);
      if (card && card.parentElement === coachGrid) coachGrid.appendChild(card);
    });
    const total = coachTotals();
    if (!loading && error === "") {
      const cardio = existing.get("cardio");
      const core = existing.get("core");
      if (cardio) writeMetric(cardio, total.cardioMinutes, total.cardioTarget, "min", "cardio");
      if (core) writeMetric(core, total.coreCount, total.coreTarget, "sessions", "core");
    } else if (error) {
      ["cardio", "core"].forEach(name => {
        const card = existing.get(name);
        if (card) {
          const value = card.querySelector(".mana-v993-metric-value");
          const sub = card.querySelector(".mana-v993-metric-sub");
          if (value) value.textContent = "—";
          if (sub) sub.textContent = "Coach results unavailable";
        }
      });
    }
  }

  async function fetchCoach(force = false) {
    if (!coachVisible() || loading || (!force && Date.now() - loadedAt < 20000)) return;
    if (typeof window.supabaseClient !== "function") {
      error = "Cloud connection unavailable";
      schedule();
      return;
    }
    loading = true;
    error = "";
    const token = ++request;
    try {
      const db = await window.supabaseClient();
      const auth = await db.auth.getUser();
      if (auth.error) throw auth.error;
      const id = auth.data?.user?.id;
      if (!id) throw Error("Sign in required");
      if (activeUser && activeUser !== id) records = [];
      const response = await db.from("coach_workout_logs")
        .select("completed_at,updated_at,finishers,status")
        .eq("user_id", id).eq("status", "completed")
        .order("completed_at", { ascending: false }).limit(500);
      if (response.error) throw response.error;
      if (token !== request) return;
      activeUser = id;
      records = response.data || [];
      loadedAt = Date.now();
    } catch (e) {
      error = String(e.message || e);
    } finally {
      loading = false;
      schedule();
    }
  }

  function schedule() {
    if (queued) return;
    queued = true;
    setTimeout(() => {
      queued = false;
      if (!coachVisible()) return;
      reconcile();
      void fetchCoach();
    }, 100);
  }
  function install() {
    if (!$(ID)) {
      const style = document.createElement("style");
      style.id = ID;
      style.textContent = `
        /* Coach-only: remove legacy yellow history typography. */
        #${COACH} .mana-v993-summary strong,
        #${COACH} .mana-v993-row-value,
        #${COACH} .m100216-history summary b,
        #${COACH} .m100216-history summary b span,
        #${COACH} .m100216-finisher {
          color:#ff8126!important;
          -webkit-text-fill-color:#ff8126!important;
        }
        #${COACH} .mana-v993-metric-label,
        #${COACH} .m100216-history summary,
        #${COACH} .mana-v993-panel h3 {
          color:#ffffff!important;
          -webkit-text-fill-color:#ffffff!important;
        }
        #${COACH} .mana-v993-metrics {
          grid-template-columns:repeat(4,minmax(0,1fr));
        }
        @media(max-width:600px){
          #${COACH} .mana-v993-metrics {
            grid-template-columns:repeat(2,minmax(0,1fr));
          }
        }
      `;
      document.head.appendChild(style);
    }
    const holder = $("manaV83Content");
    if (holder) {
      const watcher = new MutationObserver(mutations => {
        if (!coachVisible()) return;
        // Only react when the bridge replaces a whole Progress grid/root.
        if (mutations.some(m => [...m.addedNodes].some(node =>
          node.nodeType === 1 &&
          (node.matches?.(".mana-v993-metrics,[data-m100216-root]") ||
            node.querySelector?.(".mana-v993-metrics,[data-m100216-root]"))
        ))) schedule();
      });
      watcher.observe(holder, { childList:true, subtree:true });
    }
    document.addEventListener("click", event => {
      if (event.target?.closest?.('[data-m100216-view], [data-m100216-period], #manaV83Tabs [data-v83-tab="progress"]')) schedule();
    });
    ["mana:program-tab-change", "mana:coach-workout-saved", "pageshow"].forEach(name =>
      window.addEventListener(name, () => {
        if (name === "mana:coach-workout-saved") loadedAt = 0;
        schedule();
      })
    );
    window.addEventListener("mana:logout", () => {
      ++request;
      records = [];
      activeUser = "";
      loadedAt = 0;
      error = "";
    });
    window.MANA_COACH_PROGRESS_CARDS_BUILD = BUILD;
    schedule();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install, { once:true });
  } else install();
})();
