
/*
 MANA MOVEMENT — EXERCISE CONSOLIDATION AUDIT
 COMPLETE BUILD 100225

 Requires 100222, 100223, 100224 (in that order).
 Reads the existing master registry and verified GitHub asset index.
 Preserves all workouts, save data, logging, visuals and demo playback.
 An opt-in on-screen audit reports name and demo gaps, with no console needed.
 Does not replace a demo with an unverified or different-equipment movement.
*/
(() => {
  "use strict";
  const BUILD = "100225";
  if (window.MANA_EXERCISE_CONSOLIDATION?.build === BUILD) return;

  // Exact source names from the four automated equipment libraries in v6.2.
  const AUTOMATED = Object.freeze({
    "Full gym": ["Back Squat","Front Squat","Romanian Deadlift","Deadlift","Bench Press","Incline DB Press","Seated Cable Row","Chest Supported Row","Shoulder Press","Lat Pulldown","Leg Press","Hip Thrust","Walking Lunge","Leg Curl","Calf Raise","DB Lateral Raise","Rear Delt Fly","Biceps Curl","Triceps Pressdown","Cable Crunch","Plank"],
    "Dumbbells": ["Goblet Squat","DB Front Squat","DB Romanian Deadlift","DB Deadlift","DB Floor Press","Incline DB Press","One Arm DB Row","Chest Supported DB Row","DB Shoulder Press","DB Pullover","DB Split Squat","DB Hip Thrust","DB Reverse Lunge","DB Calf Raise","DB Lateral Raise","DB Rear Delt Fly","DB Biceps Curl","DB Overhead Triceps Extension","DB Dead Bug","Plank"],
    "Home basics": ["Band Goblet Squat","Tempo Squat","Band Romanian Deadlift","Band Good Morning","Push-Up","Band Chest Press","Band Row","Single Arm Band Row","Band Shoulder Press","Band Pulldown","Step-Up","Glute Bridge","Reverse Lunge","Sliding Leg Curl","Standing Calf Raise","Band Lateral Raise","Band Pull Apart","Band Biceps Curl","Band Triceps Pressdown","Dead Bug","Plank"],
    "Bodyweight": ["Bodyweight Squat","Tempo Squat","Single Leg Hip Hinge","Hip Hinge","Push-Up","Incline Push-Up","Prone Row","Reverse Snow Angel","Pike Push-Up","Prone Lat Pull","Split Squat","Glute Bridge","Reverse Lunge","Hamstring Walkout","Single Leg Calf Raise","Wall Lateral Press","Self Resisted Curl","Close Grip Push-Up","Dead Bug","Plank"]
  });

  // Verified name equivalences only; no substitutions between equipment types.
  const ALIASES = Object.freeze({
    "deadlift": "Conventional Deadlift",
    "incline db press": "Incline Dumbbell Press",
    "leg curl": "Lying Hamstring Curl",
    "calf raise": "Standing Calf Raise",
    "db romanian deadlift": "Dumbbell Romanian Deadlift",
    "db shoulder press": "Dumbbell Shoulder Press",
    "one arm db row": "One Arm Dumbbell Row",
    "chest supported db row": "Chest Supported Row",
    "db reverse lunge": "Reverse Lunge",
    "db rear delt fly": "Rear Delt Fly",
    "db biceps curl": "Dumbbell Curl",
    "db dead bug": "Dead Bug",
    "biceps curl": "Dumbbell Curl",
    "triceps pressdown": "Cable Triceps Pressdown"
  });

  const norm = v => String(v ?? "").trim().toLowerCase()
    .replace(/&/g,"and").replace(/[^a-z0-9]+/g," ")
    .replace(/\s+/g," ").trim();
  const reg = () => window.MANA_EXERCISE_REGISTRY;
  const assets = () => window.MANA_EXERCISE_ASSETS;
  const allNames = () => [...new Set(Object.values(AUTOMATED).flat())];
  const safe = value => String(value ?? "").replace(/[&<>"']/g,
    c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[c]);

  function resolve(name) {
    const source = String(name ?? "").trim();
    const direct = reg()?.resolve?.(source);
    if (direct) return direct;
    const alias = ALIASES[norm(source)];
    return alias ? reg()?.resolve?.(alias) || null : null;
  }

  function audit() {
    const records = reg()?.all?.() || [];
    const index = assets()?.inventory?.() || {};
    const names = allNames();
    const automated = names.map(name => {
      const record = resolve(name);
      const demo = assets()?.lookup?.(record?.name || name);
      return {
        original: name,
        canonical: record?.name || null,
        id: record?.id ?? null,
        demo: demo?.path || null,
        status: record ? "matched" : "missing"
      };
    });
    const notInMaster = automated.filter(x => !x.id);
    const withoutDemo = records.filter(record =>
      !assets()?.lookup?.(record.name)?.path
    ).map(record => record.name);
    const unclaimed = index.unclaimedDemoSlugs || [];
    return {
      build: BUILD,
      masterCount: records.length,
      automatedNameCount: names.length,
      automatedMatched: automated.length - notInMaster.length,
      automatedUnmatched: notInMaster,
      demoFileCount: index.availableDemos || 0,
      masterDemoMatched: records.length - withoutDemo.length,
      masterWithoutDemo: withoutDemo,
      unclaimedDemos: unclaimed,
      automated,
      allMatched: notInMaster.length === 0 && withoutDemo.length === 0
    };
  }

  const PANEL_ID = "manaExerciseConsolidation100225";
  function close() {
    document.getElementById(PANEL_ID)?.remove();
  }
  function show() {
    close();
    const data = audit();
    const panel = document.createElement("div");
    panel.id = PANEL_ID;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Exercise consolidation report");
    panel.style.cssText = "position:fixed;inset:0;z-index:2147483000;background:rgba(0,0,0,.89);display:flex;align-items:center;justify-content:center;padding:15px;box-sizing:border-box";
    const missing = (title, items) => `<section style="margin-top:18px"><strong style="color:#ff8126">${safe(title)} (${items.length})</strong><div style="color:#ddd;font-size:13px;line-height:1.7;margin-top:7px">${items.length ? items.map(x => `<span style="display:inline-block;background:#202126;border:1px solid #444;border-radius:7px;padding:3px 8px;margin:3px">${safe(x)}</span>`).join("") : "None"}</div></section>`;
    panel.innerHTML = `<div style="width:min(850px,100%);max-height:90vh;overflow:auto;box-sizing:border-box;background:#141518;color:white;border:1px solid #666;border-radius:16px;padding:20px;font-family:Arial,sans-serif">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:15px"><div><small style="color:#ff8126;font-weight:900">MANA MOVEMENT • BUILD ${BUILD}</small><h2 style="margin:7px 0">Master Exercise Audit</h2></div><button data-close style="border:1px solid #ff8126;border-radius:9px;color:white;background:#211810;padding:11px 17px;cursor:pointer;font-weight:bold">CLOSE ×</button></div>
      <p style="color:#bbb;font-size:13px">Read-only report. Your workouts, completed sessions, saved programs and Progress are unchanged.</p>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:15px">${[["Master exercises",data.masterCount],["Automated names",data.automatedNameCount],["Automated names matched",data.automatedMatched],["Master demos matched",data.masterDemoMatched],["GitHub demo files",data.demoFileCount],["Unmatched automated names",data.automatedUnmatched.length]].map(([label,n])=>`<div style="border:1px solid #49515c;border-radius:10px;padding:12px"><small style="color:#aaa">${label}</small><div style="font-size:26px;font-weight:bold;color:#ff8126">${n}</div></div>`).join("")}</div>
      ${missing("Automated names not in master library",data.automatedUnmatched.map(x=>x.original))}
      ${missing("Master exercises without an existing matching demo",data.masterWithoutDemo)}
      ${missing("Existing demo files not yet linked to master",data.unclaimedDemos.map(x=>x+"-demo.png"))}
      <p style="font-size:12px;color:#aaa;margin-top:20px">Name matching does not guarantee illustration quality. Check Start and Finish frames in the live client.</p></div>`;
    panel.addEventListener("click", e => {
      if (e.target === panel || e.target.closest("[data-close]")) close();
    });
    document.body.appendChild(panel);
    return data;
  }

  window.MANA_EXERCISE_CONSOLIDATION = Object.freeze({
    build: BUILD,
    audit,
    show,
    close,
    resolve,
    automatedNames: allNames,
    automatedLibraries: AUTOMATED
  });
  console.info("[Mana Exercise Consolidation]", BUILD, "ready");
})();
