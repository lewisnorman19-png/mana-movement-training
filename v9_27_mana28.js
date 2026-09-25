/* =========================================
   MANA MOVEMENT TRAINING v9.27.1
   MANA 28 — FAMILIAR STRENGTH-STYLE LAYOUT

   PURPOSE:
   - Makes MANA 28 Overview feel familiar to MANA Strength
   - Makes Program use the same card-based visual language
   - Preserves existing MANA 28 state and progress
   - Preserves compatibility with v9.28 workout upgrade
   - Preserves compatibility with v9.29 workout coach
   - No MutationObserver
   - No repeated render loop
   ========================================= */

(() => {
  "use strict";

  const BUILD = "92710";
  const STATE_KEY = "mana28-v927-state";
  const FUEL_KEY = "mana-fuel-v571";
  const TARGET_KEY = "mana-fuel-v58-targets";
  const STYLE_ID = "mana-v927-mana28-style";
  const ROOT_ID = "manaV927Mana28";
  const TOTAL_DAYS = 28;

  let renderTimer = null;

  /* =========================================
     28-DAY CONTENT
     ========================================= */

  const DAYS = [
    {
      title: "Start With Purpose",
      focus: "Set the standard",
      whakatauki: "He aha te mea nui o te ao? He tangata, he tangata, he tangata.",
      meaning: "People are at the heart of what matters. Start with the person you are becoming.",
      workout: "Foundation Full Body",
      actions: ["20 min purposeful movement", "Hit your protein target", "2 L+ water", "Write one reason you are doing MANA 28"]
    },
    {
      title: "Show Up",
      focus: "Consistency before intensity",
      whakatauki: "Whaia te iti kahurangi.",
      meaning: "Pursue what is precious. Small deliberate actions build something bigger.",
      workout: "Upper Body + Core",
      actions: ["Complete today’s session", "10 min walk after a meal", "Prepare tomorrow’s first meal", "No skipped check-in"]
    },
    {
      title: "Build Momentum",
      focus: "Keep moving",
      whakatauki: "Kia kaha, kia māia, kia manawanui.",
      meaning: "Be strong, be brave, be steadfast.",
      workout: "Lower Body + Conditioning",
      actions: ["Train with control", "Protein with each main meal", "8,000+ steps", "5 min mobility"]
    },
    {
      title: "Own Your Morning",
      focus: "Win the first hour",
      whakatauki: "Mā te wā ka mōhio.",
      meaning: "Through time comes understanding. Good routines become clearer through repetition.",
      workout: "Recovery + Mobility",
      actions: ["Start the day without scrolling", "10 min mobility", "Hydrate early", "Plan your training time"]
    },
    {
      title: "Strength Is Built",
      focus: "Progress with intent",
      whakatauki: "Ehara taku toa i te toa takitahi.",
      meaning: "Success is not achieved alone. Use your support, structure and environment.",
      workout: "Full Body Strength",
      actions: ["Train hard but controlled", "Log your workout", "Hit water target", "Early night"]
    },
    {
      title: "Fuel The Work",
      focus: "Eat for the goal",
      whakatauki: "Ka pū te ruha, ka hao te rangatahi.",
      meaning: "Growth comes through renewal. Replace habits that no longer serve you.",
      workout: "Walk + Core",
      actions: ["Log your meals", "Prioritise whole foods", "30 min walk", "Review your week"]
    },
    {
      title: "Week One Complete",
      focus: "Reflect and reset",
      whakatauki: "Titiro whakamuri, kōkiri whakamua.",
      meaning: "Look back and reflect so you can move forward with purpose.",
      workout: "Recovery Day",
      actions: ["Review wins", "Identify one obstacle", "Plan next week", "Do something that restores you"]
    },
    {
      title: "Raise The Standard",
      focus: "Week two begins",
      whakatauki: "Kia ū ki te pai.",
      meaning: "Commit to what is good and stay with it.",
      workout: "Full Body Strength",
      actions: ["Complete the full session", "Protein target", "8,000+ steps", "Plan tomorrow before bed"]
    },
    {
      title: "Control The Controllables",
      focus: "Direct your energy",
      whakatauki: "He waka eke noa.",
      meaning: "We are all in this together. Progress comes from staying aboard the journey.",
      workout: "Upper Body Strength",
      actions: ["Train with intent", "No mindless snacking", "2 L+ water", "10 min outside"]
    },
    {
      title: "Do The Work",
      focus: "Action over mood",
      whakatauki: "Kaua e mate wheke, mate ururoa.",
      meaning: "Do not give up like the octopus; fight on like the hammerhead shark.",
      workout: "Lower Body Strength",
      actions: ["Complete your workout", "Hit steps", "Eat a quality dinner", "Write one thing you handled well"]
    },
    {
      title: "Recover To Grow",
      focus: "Recovery is training",
      whakatauki: "He rā ki tua.",
      meaning: "There is another day ahead. Recovery helps you return stronger.",
      workout: "Mobility + Easy Cardio",
      actions: ["20–30 min easy movement", "Mobility", "Hydrate", "Prioritise sleep"]
    },
    {
      title: "Stay Accountable",
      focus: "Keep the promises you make",
      whakatauki: "Ko te pae tawhiti whāia kia tata.",
      meaning: "Pursue distant horizons until they become close.",
      workout: "Full Body Strength",
      actions: ["Log every working set", "Protein target", "No skipped meals", "Check your weekly progress"]
    },
    {
      title: "Move With Purpose",
      focus: "Quality over noise",
      whakatauki: "Nāu te rourou, nāku te rourou.",
      meaning: "With your contribution and mine, progress becomes possible.",
      workout: "Conditioning + Core",
      actions: ["30 min purposeful movement", "Fuel around training", "Stretch", "Do one task you have been avoiding"]
    },
    {
      title: "Two Weeks Stronger",
      focus: "Recognise progress",
      whakatauki: "Kia whakatōmuri te haere whakamua.",
      meaning: "Move forward while keeping sight of what you have learned.",
      workout: "Recovery Day",
      actions: ["Review two weeks", "Take progress photo if wanted", "Plan week three", "Rest without guilt"]
    },
    {
      title: "Begin Again",
      focus: "Fresh week, same purpose",
      whakatauki: "Ka mua, ka muri.",
      meaning: "We walk backward into the future with our eyes on the past.",
      workout: "Full Body Strength",
      actions: ["Train", "Protein target", "8,000+ steps", "Set one goal for this week"]
    },
    {
      title: "Build Capacity",
      focus: "A little more",
      whakatauki: "Mā pango, mā whero, ka oti te mahi.",
      meaning: "Through combined effort, the work gets done.",
      workout: "Upper Body Strength",
      actions: ["Add quality, not chaos", "Log Fuel", "Hydrate", "10 min recovery work"]
    },
    {
      title: "Stay In The Fight",
      focus: "Discipline on ordinary days",
      whakatauki: "Kia kaha rā.",
      meaning: "Stay strong. Ordinary days are where consistency is built.",
      workout: "Lower Body Strength",
      actions: ["Complete the session", "Hit steps", "Protein target", "No negative self-talk"]
    },
    {
      title: "Reset The System",
      focus: "Reduce stress",
      whakatauki: "He mauri tō te tangata.",
      meaning: "Every person carries life force. Protect your energy and restore it.",
      workout: "Recovery + Mobility",
      actions: ["Walk outside", "Mobility", "Eat simply", "30 min screen-free before sleep"]
    },
    {
      title: "Progress Not Perfection",
      focus: "Keep stacking",
      whakatauki: "Iti noa ana, he pito mata.",
      meaning: "Small beginnings can contain great potential.",
      workout: "Full Body Strength",
      actions: ["Train", "Log your session", "Fuel well", "Name one improvement since Day 1"]
    },
    {
      title: "Earn Your Confidence",
      focus: "Confidence follows action",
      whakatauki: "Kia ū, kia mau.",
      meaning: "Stay committed and hold fast.",
      workout: "Conditioning + Core",
      actions: ["Move for 30 min", "Hydrate", "Prepare tomorrow’s meals", "Do one hard thing first"]
    },
    {
      title: "Three Weeks In",
      focus: "You are building evidence",
      whakatauki: "Mauri mahi, mauri ora.",
      meaning: "Through purposeful work comes wellbeing.",
      workout: "Recovery Day",
      actions: ["Review week", "Stretch", "Plan final seven days", "Write three wins"]
    },
    {
      title: "Finish Strong",
      focus: "Final week",
      whakatauki: "Kia kaha te tū.",
      meaning: "Stand strong in who you are becoming.",
      workout: "Full Body Strength",
      actions: ["Complete the workout", "Protein target", "Steps", "Set your final-week standard"]
    },
    {
      title: "No Coasting",
      focus: "Stay deliberate",
      whakatauki: "Waiho i te toipoto, kaua i te toiroa.",
      meaning: "Stay connected and close to the work rather than drifting away.",
      workout: "Upper Body Strength",
      actions: ["Train with intent", "Log meals", "Hydrate", "Prepare tomorrow"]
    },
    {
      title: "Prove It To Yourself",
      focus: "Keep your word",
      whakatauki: "Kia manawanui.",
      meaning: "Be patient and steadfast.",
      workout: "Lower Body Strength",
      actions: ["Complete training", "Hit steps", "Quality evening meal", "Reflect on your discipline"]
    },
    {
      title: "Recover With Purpose",
      focus: "Restore",
      whakatauki: "Hoki ki ngā maunga kia purea koe e ngā hau.",
      meaning: "Return to the places that restore you and let the winds refresh you.",
      workout: "Mobility + Easy Cardio",
      actions: ["Easy movement", "Mobility", "Hydrate", "Prioritise sleep"]
    },
    {
      title: "Your New Baseline",
      focus: "This is who you are now",
      whakatauki: "Ko au ko koe, ko koe ko au.",
      meaning: "Identity is strengthened through connection, action and reflection.",
      workout: "Full Body Strength",
      actions: ["Train", "Log everything", "Protein target", "Write what has changed"]
    },
    {
      title: "Prepare For What’s Next",
      focus: "Beyond Day 28",
      whakatauki: "Kāore te kūmara e kōrero mō tōna ake reka.",
      meaning: "Let your actions speak. You do not need to announce your progress.",
      workout: "Conditioning + Core",
      actions: ["Move", "Fuel well", "Review goals", "Choose what continues after Day 28"]
    },
    {
      title: "One Day To Go",
      focus: "Finish what you started",
      whakatauki: "Kia kaha, kia māia.",
      meaning: "Be strong and courageous.",
      workout: "Recovery + Walk",
      actions: ["Walk", "Mobility", "Hydrate", "Prepare for final day"]
    },
    {
      title: "Move With Purpose",
      focus: "Day 28",
      whakatauki: "Ka pū te ruha, ka hao te rangatahi.",
      meaning: "Renewal creates the space for the next version of you.",
      workout: "Final Full Body Session",
      actions: ["Complete the final session", "Final check-in", "Review your 28 days", "Choose your next Mana program"]
    }
  ];

  const LEARN = [
    {
      title: "Consistency Wins",
      body: "MANA 28 is not built around perfect days. It is built around returning to the plan. Missing one action is not failure; abandoning the process is what stops momentum. Your job is to keep coming back."
    },
    {
      title: "Train With Purpose",
      body: "The goal is not to destroy yourself in every workout. Use controlled reps, good technique and enough effort to create progress while still being able to recover."
    },
    {
      title: "Fuel Simply",
      body: "Base most meals around a quality protein source, vegetables or fruit, useful carbohydrates and enough fluids. Consistency with simple food choices beats chasing a perfect diet."
    },
    {
      title: "Recovery Counts",
      body: "Sleep, hydration, mobility and easier days are part of the program. Recovery is where the work you do in training has a chance to become adaptation."
    },
    {
      title: "Measure What Matters",
      body: "Look for trends: more completed days, better training consistency, stronger lifts, improved energy, better routines and better food choices. One number never tells the whole story."
    }
  ];

  /* =========================================
     HELPERS
     ========================================= */

  function safeJson(raw, fallback) {
    try {
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function todayKey() {
    const d = new Date();

    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0")
    ].join("-");
  }

  function loadState() {
    const raw =
      safeJson(
        localStorage.getItem(STATE_KEY) || "{}",
        {}
      );

    return {
      ...raw,

      startedAt:
        raw.startedAt || null,

      currentDay:
        clamp(
          Number(raw.currentDay || 1),
          1,
          TOTAL_DAYS
        ),

      completedDays:
        Array.isArray(raw.completedDays)
          ? raw.completedDays
              .map(Number)
              .filter(day => day >= 1 && day <= TOTAL_DAYS)
          : [],

      actions:
        raw.actions &&
        typeof raw.actions === "object"
          ? raw.actions
          : {},

      reflections:
        raw.reflections &&
        typeof raw.reflections === "object"
          ? raw.reflections
          : {},

      workouts:
        raw.workouts &&
        typeof raw.workouts === "object"
          ? raw.workouts
          : {},

      selectedDay:
        clamp(
          Number(
            raw.selectedDay ||
            raw.currentDay ||
            1
          ),
          1,
          TOTAL_DAYS
        )
    };
  }

  function saveState(state) {
    localStorage.setItem(
      STATE_KEY,
      JSON.stringify(state)
    );

    window.dispatchEvent(
      new CustomEvent(
        "mana28:updated"
      )
    );
  }

  function ensureStarted(state) {
    if (!state.startedAt) {
      state.startedAt =
        new Date().toISOString();

      localStorage.setItem(
        STATE_KEY,
        JSON.stringify(state)
      );
    }

    return state;
  }

  function activeTab() {
    return (
      document
        .querySelector(
          "#manaV83Tabs .mana-v83-tab.active"
        )
        ?.dataset
        ?.v83Tab ||
      "overview"
    );
  }

  function mana28Open() {
    const shell =
      document.getElementById(
        "manaV83ProgramShell"
      );

    const title =
      document.getElementById(
        "manaV83Title"
      );

    return Boolean(
      shell
        ?.classList
        .contains("open") &&
      title
        ?.textContent
        ?.trim()
        ?.toUpperCase() ===
        "MANA 28"
    );
  }

  function loadFuel() {
    const data =
      safeJson(
        localStorage.getItem(FUEL_KEY) || "{}",
        {}
      );

    return (
      data &&
      typeof data === "object"
        ? data
        : {}
    );
  }

  function loadTargets() {
    const data =
      safeJson(
        localStorage.getItem(TARGET_KEY) || "{}",
        {}
      );

    return {
      calories:
        Number(data.calories || 0),

      protein:
        Number(data.protein || 0),

      water:
        Number(data.water || 0)
    };
  }

  function fuelTotalsForToday() {
    const day =
      loadFuel()[todayKey()] || {};

    const totals = {
      calories:0,
      protein:0,
      water:
        Number(day.water || 0)
    };

    Object
      .values(day.meals || {})
      .forEach(items => {
        (items || [])
          .forEach(item => {
            totals.calories +=
              Number(item?.calories || 0);

            totals.protein +=
              Number(item?.protein || 0);
          });
      });

    return totals;
  }

  function completedCount(state) {
    return new Set(
      state.completedDays
    ).size;
  }

  function completionPercent(state) {
    return Math.round(
      completedCount(state) /
      TOTAL_DAYS *
      100
    );
  }

  function currentDayData(state) {
    const day =
      clamp(
        Number(
          state.selectedDay ||
          state.currentDay ||
          1
        ),
        1,
        TOTAL_DAYS
      );

    return {
      day,
      data:
        DAYS[day - 1]
    };
  }

  function dayUnlocked(state, day) {
    if (day === 1) {
      return true;
    }

    return (
      day <= state.currentDay ||
      state.completedDays.includes(day)
    );
  }

  function dayComplete(state, day) {
    return state.completedDays.includes(day);
  }

  function actionsForDay(state, day) {
    const stored =
      state.actions[
        String(day)
      ];

    return Array.isArray(stored)
      ? stored
      : [];
  }

  function reflectionForDay(state, day) {
    return String(
      state.reflections[
        String(day)
      ] || ""
    );
  }

  function actionCompletion(state, day) {
    const done =
      actionsForDay(state, day)
        .filter(Boolean)
        .length;

    const total =
      DAYS[day - 1]
        ?.actions
        ?.length || 0;

    return {
      done,
      total,
      percent:
        total
          ? Math.round(
              done /
              total *
              100
            )
          : 0
    };
  }

  function weekRange(week) {
    const start =
      (week - 1) * 7 + 1;

    const end =
      Math.min(
        TOTAL_DAYS,
        start + 6
      );

    return {
      start,
      end
    };
  }

  function workoutPrescription(day) {
    const type =
      DAYS[
        day - 1
      ]
        .workout
        .toLowerCase();

    if (
      type.includes(
        "recovery"
      )
    ) {
      return (
        "20–30 min easy walk or bike • " +
        "8–10 min mobility • keep effort comfortable."
      );
    }

    if (
      type.includes(
        "upper"
      )
    ) {
      return (
        "Push • Pull • Shoulders • Arms • Core. " +
        "Controlled technique and quality reps."
      );
    }

    if (
      type.includes(
        "lower"
      )
    ) {
      return (
        "Squat or leg press • Hinge • " +
        "Single-leg work • Hamstrings • Calves • Core."
      );
    }

    if (
      type.includes(
        "conditioning"
      )
    ) {
      return (
        "20–30 min conditioning at a sustainable effort " +
        "plus core work."
      );
    }

    if (
      type.includes(
        "walk"
      )
    ) {
      return (
        "Purposeful walk plus a short core circuit " +
        "and mobility."
      );
    }

    return (
      "Full body: lower-body push • upper push • " +
      "upper pull • hinge • accessory • core."
    );
  }

  /* =========================================
     STYLES
     ========================================= */

  function injectStyles() {
    document
      .getElementById(
        STYLE_ID
      )
      ?.remove();

    const style =
      document.createElement(
        "style"
      );

    style.id =
      STYLE_ID;

    style.textContent = `
      #${ROOT_ID}{
        width:100%;
        padding-bottom:30px;
      }

      .mana-v927-hero{
        margin-bottom:14px;
        padding:26px 21px;
        border:1px solid #5a4a18;
        border-radius:24px;
        background:
          radial-gradient(
            circle at 85% 10%,
            rgba(243,216,117,.12),
            transparent 34%
          ),
          linear-gradient(145deg,#1c1708,#090909);
      }

      .mana-v927-kicker{
        color:#f3d875;
        font-size:10px;
        font-weight:900;
        letter-spacing:.14em;
        text-transform:uppercase;
      }

      .mana-v927-hero h2{
        margin:7px 0 8px;
        color:#fff;
        font-size:clamp(30px,8vw,40px);
        line-height:1.05;
      }

      .mana-v927-hero p{
        margin:0;
        color:#aaa;
        font-size:13px;
        line-height:1.6;
      }

      .mana-v927-progress-line{
        display:flex;
        justify-content:space-between;
        gap:12px;
        margin-top:17px;
        color:#9c8a4b;
        font-size:10px;
        font-weight:900;
        letter-spacing:.04em;
      }

      .mana-v927-track{
        width:100%;
        height:7px;
        margin-top:8px;
        overflow:hidden;
        border-radius:999px;
        background:#242424;
      }

      .mana-v927-fill{
        height:100%;
        border-radius:999px;
        background:#f3d875;
      }

      .mana-v927-grid{
        display:grid;
        grid-template-columns:repeat(2,1fr);
        gap:10px;
        margin:14px 0;
      }

      .mana-v927-stat,
      .mana-v927-card,
      .mana-v927-program-card{
        border:1px solid #292929;
        background:#0d0d0d;
      }

      .mana-v927-stat{
        padding:15px;
        border-radius:18px;
      }

      .mana-v927-stat span{
        display:block;
        color:#888;
        font-size:10px;
        font-weight:900;
        text-transform:uppercase;
        letter-spacing:.05em;
      }

      .mana-v927-stat strong{
        display:block;
        margin-top:6px;
        color:#f3d875;
        font-size:22px;
      }

      .mana-v927-card{
        margin:14px 0;
        padding:18px;
        border-radius:21px;
      }

      .mana-v927-today{
        border-color:#5b4d1f;
        background:linear-gradient(145deg,#191609,#0a0a0a);
      }

      .mana-v927-card-head{
        display:flex;
        justify-content:space-between;
        gap:12px;
        align-items:flex-start;
      }

      .mana-v927-card h3{
        margin:0;
        color:#fff;
        font-size:20px;
      }

      .mana-v927-card p{
        color:#aaa;
        font-size:12px;
        line-height:1.55;
      }

      .mana-v927-pill{
        flex:0 0 auto;
        display:inline-flex;
        align-items:center;
        min-height:28px;
        padding:0 9px;
        border:1px solid #4f431b;
        border-radius:999px;
        background:#151207;
        color:#f3d875;
        font-size:9px;
        font-weight:900;
      }

      .mana-v927-day-title{
        margin-top:6px;
        color:#fff;
        font-size:24px;
        font-weight:900;
        line-height:1.12;
      }

      .mana-v927-focus{
        margin-top:5px;
        color:#aaa;
        font-size:12px;
        font-weight:700;
      }

      .mana-v927-quote{
        margin-top:14px;
        padding:14px;
        border-left:3px solid #f3d875;
        border-radius:0 12px 12px 0;
        background:#100f09;
      }

      .mana-v927-quote strong{
        display:block;
        color:#f3d875;
        font-size:12px;
        line-height:1.45;
      }

      .mana-v927-quote span{
        display:block;
        margin-top:6px;
        color:#aaa;
        font-size:11px;
        line-height:1.55;
      }

      .mana-v927-workout{
        margin-top:14px;
        padding:17px;
        border:1px solid #5b4d1f;
        border-radius:18px;
        background:linear-gradient(145deg,#181507,#0a0a0a);
      }

      .mana-v927-workout-label{
        color:#f3d875;
        font-size:9px;
        font-weight:900;
        letter-spacing:.1em;
      }

      .mana-v927-workout-name{
        margin-top:5px;
        color:#fff;
        font-size:20px;
        font-weight:900;
      }

      .mana-v927-workout-copy{
        margin-top:6px;
        color:#999;
        font-size:11px;
        line-height:1.5;
      }

      .mana-v927-view-program{
        width:100%;
        min-height:52px;
        margin-top:14px;
        border:0;
        border-radius:15px;
        background:#f3d875;
        color:#111;
        font-size:12px;
        font-weight:900;
        cursor:pointer;
      }

      .mana-v927-action{
        width:100%;
        min-height:64px;
        display:grid;
        grid-template-columns:36px minmax(0,1fr);
        gap:11px;
        align-items:center;
        margin-top:9px;
        padding:12px;
        border:1px solid #292929;
        border-radius:16px;
        background:#090909;
        color:#eee;
        text-align:left;
        cursor:pointer;
      }

      .mana-v927-check{
        width:32px;
        height:32px;
        display:grid;
        place-items:center;
        border:2px solid #464646;
        border-radius:10px;
        color:#111;
        font-weight:1000;
      }

      .mana-v927-action.done{
        border-color:#57491c;
        background:linear-gradient(145deg,#171407,#090909);
      }

      .mana-v927-action.done .mana-v927-check{
        border-color:#f3d875;
        background:#f3d875;
        color:#111;
      }

      .mana-v927-action-copy{
        font-size:12px;
        font-weight:800;
        line-height:1.4;
      }

      .mana-v927-focus-progress{
        margin:14px 0 4px;
      }

      .mana-v927-focus-progress-row{
        display:flex;
        justify-content:space-between;
        gap:12px;
        margin-bottom:7px;
      }

      .mana-v927-focus-progress-row strong{
        color:#f3d875;
        font-size:12px;
      }

      .mana-v927-focus-progress-row span{
        color:#777;
        font-size:10px;
      }

      .mana-v927-primary,
      .mana-v927-secondary{
        width:100%;
        min-height:52px;
        margin-top:12px;
        border-radius:15px;
        font-size:12px;
        font-weight:900;
        cursor:pointer;
      }

      .mana-v927-primary{
        border:0;
        background:#f3d875;
        color:#111;
      }

      .mana-v927-primary:disabled{
        opacity:.45;
        cursor:not-allowed;
      }

      .mana-v927-secondary{
        border:1px solid #4f431b;
        background:#111006;
        color:#f3d875;
      }

      .mana-v927-reflection{
        width:100%;
        min-height:90px;
        margin-top:10px;
        padding:12px;
        resize:vertical;
        border:1px solid #333;
        border-radius:12px;
        background:#080808;
        color:#fff;
        font:inherit;
        line-height:1.5;
      }

      .mana-v927-snapshot{
        margin:14px 0;
        padding:18px;
        border:1px solid #292929;
        border-radius:21px;
        background:#0d0d0d;
      }

      .mana-v927-snapshot-row{
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:14px;
      }

      .mana-v927-snapshot-copy span{
        display:block;
        color:#888;
        font-size:10px;
        text-transform:uppercase;
      }

      .mana-v927-snapshot-copy strong{
        display:block;
        margin-top:4px;
        color:#f3d875;
        font-size:18px;
      }

      .mana-v927-snapshot-percent{
        color:#f3d875;
        font-size:22px;
        font-weight:900;
      }

      .mana-v927-week{
        margin:18px 0 8px;
      }

      .mana-v927-week:first-child{
        margin-top:0;
      }

      .mana-v927-week-title{
        display:flex;
        justify-content:space-between;
        gap:12px;
        margin-bottom:9px;
        color:#f3d875;
        font-size:11px;
        font-weight:900;
        letter-spacing:.1em;
      }

      .mana-v927-week-title span:last-child{
        color:#777;
        font-size:9px;
      }

      .mana-v927-program-card{
        margin:9px 0;
        padding:17px;
        border-radius:19px;
        background:linear-gradient(145deg,#111,#090909);
      }

      .mana-v927-program-card.current{
        border-color:#6b591e;
        background:linear-gradient(145deg,#191608,#090909);
      }

      .mana-v927-program-card.done{
        border-color:#50441d;
      }

      .mana-v927-program-card.locked{
        opacity:.48;
      }

      .mana-v927-program-top{
        display:flex;
        justify-content:space-between;
        gap:12px;
        align-items:flex-start;
      }

      .mana-v927-program-day{
        color:#f3d875;
        font-size:10px;
        font-weight:900;
        letter-spacing:.1em;
      }

      .mana-v927-program-title{
        margin-top:5px;
        color:#fff;
        font-size:20px;
        font-weight:900;
        line-height:1.2;
      }

      .mana-v927-program-session{
        margin-top:8px;
        color:#d0bd70;
        font-size:12px;
        font-weight:800;
      }

      .mana-v927-program-focus{
        margin-top:5px;
        color:#888;
        font-size:11px;
      }

      .mana-v927-program-status{
        flex:0 0 auto;
        padding:6px 9px;
        border:1px solid #333;
        border-radius:999px;
        color:#888;
        font-size:9px;
        font-weight:900;
      }

      .mana-v927-program-card.current
      .mana-v927-program-status,
      .mana-v927-program-card.done
      .mana-v927-program-status{
        border-color:#66561f;
        color:#f3d875;
      }

      .mana-v927-program-copy{
        margin-top:12px;
        padding-top:12px;
        border-top:1px solid #252525;
        color:#999;
        font-size:11px;
        line-height:1.5;
      }

      .mana-v927-program-open{
        width:100%;
        min-height:50px;
        margin-top:13px;
        border:0;
        border-radius:14px;
        background:#f3d875;
        color:#111;
        font-size:12px;
        font-weight:900;
        cursor:pointer;
      }

      .mana-v927-program-open:disabled{
        border:1px solid #333;
        background:#111;
        color:#666;
        cursor:not-allowed;
      }

      .mana-v927-fuel-grid{
        display:grid;
        grid-template-columns:repeat(3,1fr);
        gap:8px;
        margin-top:12px;
      }

      .mana-v927-fuel-box{
        padding:12px;
        border:1px solid #292929;
        border-radius:14px;
        background:#0b0b0b;
      }

      .mana-v927-fuel-box span{
        display:block;
        color:#888;
        font-size:9px;
        font-weight:900;
      }

      .mana-v927-fuel-box strong{
        display:block;
        margin-top:5px;
        color:#f3d875;
        font-size:17px;
      }

      .mana-v927-day-grid{
        display:grid;
        grid-template-columns:repeat(7,1fr);
        gap:7px;
        margin-top:12px;
      }

      .mana-v927-day-btn{
        aspect-ratio:1;
        border:1px solid #323232;
        border-radius:11px;
        background:#0b0b0b;
        color:#888;
        font-size:11px;
        font-weight:900;
        cursor:pointer;
      }

      .mana-v927-day-btn.current{
        border-color:#f3d875;
        color:#f3d875;
      }

      .mana-v927-day-btn.done{
        border-color:#5c4c18;
        background:#191505;
        color:#f3d875;
      }

      .mana-v927-day-btn.locked{
        opacity:.3;
        cursor:not-allowed;
      }

      .mana-v927-learn-item{
        margin-top:9px;
        border:1px solid #2c2c2c;
        border-radius:14px;
        overflow:hidden;
        background:#0b0b0b;
      }

      .mana-v927-learn-open{
        width:100%;
        display:flex;
        justify-content:space-between;
        gap:12px;
        align-items:center;
        padding:14px;
        border:0;
        background:transparent;
        color:#fff;
        text-align:left;
        cursor:pointer;
      }

      .mana-v927-arrow{
        color:#f3d875;
        font-size:20px;
        transition:transform .2s ease;
      }

      .mana-v927-learn-item.open
      .mana-v927-arrow{
        transform:rotate(180deg);
      }

      .mana-v927-learn-body{
        display:none;
        padding:0 14px 15px;
        color:#aaa;
        font-size:12px;
        line-height:1.65;
      }

      .mana-v927-learn-item.open
      .mana-v927-learn-body{
        display:block;
      }

      .mana-v927-complete{
        text-align:center;
        padding:24px 16px;
      }

      .mana-v927-complete-mark{
        width:68px;
        height:68px;
        margin:0 auto 12px;
        display:grid;
        place-items:center;
        border:2px solid #f3d875;
        border-radius:50%;
        color:#f3d875;
        font-size:28px;
        font-weight:1000;
      }

      @media(max-width:420px){
        .mana-v927-grid{
          grid-template-columns:1fr 1fr;
        }

        .mana-v927-fuel-grid{
          grid-template-columns:1fr;
        }

        .mana-v927-program-title{
          font-size:18px;
        }
      }
    `;

    document.head
      .appendChild(style);
  }

  /* =========================================
     OVERVIEW
     ========================================= */

  function overviewHtml(state) {
    const {day, data} =
      currentDayData(state);

    const actions =
      actionCompletion(
        state,
        day
      );

    const complete =
      dayComplete(
        state,
        day
      );

    const percent =
      completionPercent(
        state
      );

    return `
      <div id="${ROOT_ID}">

        <div class="mana-v927-hero">
          <div class="mana-v927-kicker">
            MANA 28 • MOVE WITH PURPOSE
          </div>

          <h2>
            Day ${day} of 28
          </h2>

          <p>
            One day at a time — train, Fuel,
            take the daily actions and keep moving forward.
          </p>

          <div class="mana-v927-progress-line">
            <span>
              ${completedCount(state)} days complete
            </span>
            <span>
              ${percent}%
            </span>
          </div>

          <div class="mana-v927-track">
            <div
              class="mana-v927-fill"
              style="width:${percent}%"
            ></div>
          </div>
        </div>

        <div class="mana-v927-card mana-v927-today">
          <div class="mana-v927-card-head">
            <div>
              <div class="mana-v927-kicker">
                TODAY
              </div>

              <div class="mana-v927-day-title">
                ${esc(data.title)}
              </div>

              <div class="mana-v927-focus">
                ${esc(data.focus)}
              </div>
            </div>

            <span class="mana-v927-pill">
              ${complete ? "COMPLETE" : `DAY ${day}`}
            </span>
          </div>

          <div class="mana-v927-quote">
            <strong>
              ${esc(data.whakatauki)}
            </strong>

            <span>
              ${esc(data.meaning)}
            </span>
          </div>

          <div class="mana-v927-workout">
            <div class="mana-v927-workout-label">
              TODAY'S TRAINING
            </div>

            <div class="mana-v927-workout-name">
              ${esc(data.workout)}
            </div>

            <div class="mana-v927-workout-copy">
              Open Program to see the session and
              choose today's training.
            </div>

            <button
              type="button"
              class="mana-v927-view-program"
              id="manaV927ViewProgram"
            >
              VIEW PROGRAM →
            </button>
          </div>
        </div>

        ${actionsHtml(
          state,
          day
        )}

        <div class="mana-v927-snapshot">
          <div class="mana-v927-card-head">
            <h3>
              28-Day Snapshot
            </h3>

            <span class="mana-v927-kicker">
              PROGRESS
            </span>
          </div>

          <div class="mana-v927-snapshot-row">
            <div class="mana-v927-snapshot-copy">
              <span>
                Days completed
              </span>

              <strong>
                ${completedCount(state)} / 28
              </strong>
            </div>

            <div class="mana-v927-snapshot-percent">
              ${percent}%
            </div>
          </div>

          <div class="mana-v927-track">
            <div
              class="mana-v927-fill"
              style="width:${percent}%"
            ></div>
          </div>
        </div>

        <div class="mana-v927-card">
          <div class="mana-v927-kicker">
            REFLECT
          </div>

          <h3 style="margin-top:5px;">
            One thought from today
          </h3>

          <textarea
            class="mana-v927-reflection"
            id="manaV927Reflection"
            placeholder="What went well? What do you want to carry into tomorrow?"
          >${esc(reflectionForDay(state, day))}</textarea>

          <button
            type="button"
            class="mana-v927-secondary"
            id="manaV927SaveReflection"
          >
            SAVE REFLECTION
          </button>
        </div>

        <button
          type="button"
          class="mana-v927-primary"
          id="manaV927CompleteDay"
          ${complete ? "disabled" : ""}
        >
          ${complete ? "DAY COMPLETE ✓" : "COMPLETE DAY"}
        </button>

        ${
          complete &&
          day < TOTAL_DAYS
            ? `
              <button
                type="button"
                class="mana-v927-secondary"
                id="manaV927NextDay"
              >
                GO TO DAY ${day + 1} →
              </button>
            `
            : ""
        }

        ${
          completedCount(state) === TOTAL_DAYS
            ? completionHtml()
            : ""
        }

      </div>
    `;
  }

  function actionsHtml(
    state,
    day
  ) {
    const list =
      DAYS[
        day - 1
      ].actions;

    const stored =
      actionsForDay(
        state,
        day
      );

    const progress =
      actionCompletion(
        state,
        day
      );

    return `
      <div class="mana-v927-card">

        <div class="mana-v927-card-head">
          <div>
            <div class="mana-v927-kicker">
              DAILY ACTIONS
            </div>

            <h3 style="margin-top:5px;">
              Today's Focus
            </h3>
          </div>

          <span class="mana-v927-pill">
            ${progress.done}/${list.length}
          </span>
        </div>

        <div class="mana-v927-focus-progress">
          <div class="mana-v927-focus-progress-row">
            <strong>
              ${progress.done} of ${list.length} complete
            </strong>

            <span>
              ${progress.percent}%
            </span>
          </div>

          <div class="mana-v927-track">
            <div
              class="mana-v927-fill"
              style="width:${progress.percent}%"
            ></div>
          </div>
        </div>

        ${
          list
            .map(
              (item, index) => `
                <button
                  type="button"
                  class="
                    mana-v927-action
                    ${stored[index] ? "done" : ""}
                  "
                  data-v927-action="${index}"
                >
                  <span class="mana-v927-check">
                    ${stored[index] ? "✓" : ""}
                  </span>

                  <span class="mana-v927-action-copy">
                    ${esc(item)}
                  </span>
                </button>
              `
            )
            .join("")
        }

      </div>
    `;
  }

  function completionHtml() {
    return `
      <div class="mana-v927-card mana-v927-complete">
        <div class="mana-v927-complete-mark">
          ✓
        </div>

        <div class="mana-v927-kicker">
          MANA 28 COMPLETE
        </div>

        <h3 style="margin:7px 0 5px;font-size:24px;">
          28 Days. Done.
        </h3>

        <p>
          You built evidence that you can show up,
          move with purpose and follow through.
        </p>
      </div>
    `;
  }

  /* =========================================
     PROGRAM
     ========================================= */

  function programCardHtml(
    state,
    day
  ) {
    const data =
      DAYS[
        day - 1
      ];

    const unlocked =
      dayUnlocked(
        state,
        day
      );

    const done =
      dayComplete(
        state,
        day
      );

    const current =
      day ===
      state.currentDay;

    const status =
      done
        ? "COMPLETE"
        : current
          ? "CURRENT"
          : unlocked
            ? "AVAILABLE"
            : "LOCKED";

    return `
      <div
        class="
          mana-v927-program-card
          ${current ? "current" : ""}
          ${done ? "done" : ""}
          ${!unlocked ? "locked" : ""}
        "
      >
        <div class="mana-v927-program-top">
          <div>
            <div class="mana-v927-program-day">
              DAY ${day}
            </div>

            <div class="mana-v927-program-title">
              ${esc(data.title)}
            </div>

            <div class="mana-v927-program-session">
              ${esc(data.workout)}
            </div>

            <div class="mana-v927-program-focus">
              ${esc(data.focus)}
            </div>
          </div>

          <div class="mana-v927-program-status">
            ${status}
          </div>
        </div>

        <div class="mana-v927-program-copy">
          ${esc(
            workoutPrescription(
              day
            )
          )}
        </div>

        <button
          type="button"
          class="mana-v927-program-open"
          data-v927-open-day="${day}"
          ${!unlocked ? "disabled" : ""}
        >
          ${
            done
              ? "VIEW DAY →"
              : current
                ? "OPEN TODAY →"
                : unlocked
                  ? "OPEN DAY →"
                  : "LOCKED"
          }
        </button>
      </div>
    `;
  }

  function programHtml(state) {
    const percent =
      completionPercent(
        state
      );

    const weeks =
      [1,2,3,4]
        .map(week => {
          const range =
            weekRange(
              week
            );

          const cards =
            [];

          for (
            let day =
              range.start;
            day <=
              range.end;
            day += 1
          ) {
            cards.push(
              programCardHtml(
                state,
                day
              )
            );
          }

          return `
            <div class="mana-v927-week">
              <div class="mana-v927-week-title">
                <span>
                  WEEK ${week}
                </span>

                <span>
                  DAYS ${range.start}–${range.end}
                </span>
              </div>

              ${cards.join("")}
            </div>
          `;
        })
        .join("");

    return `
      <div id="${ROOT_ID}">

        <div class="mana-v927-hero">
          <div class="mana-v927-kicker">
            YOUR MANA 28 PROGRAM
          </div>

          <h2>
            28 days. One clear path.
          </h2>

          <p>
            Just like Mana Strength, choose the day,
            open it and follow the session.
            Future days unlock as you progress.
          </p>

          <div class="mana-v927-progress-line">
            <span>
              Day ${state.currentDay} of 28
            </span>

            <span>
              ${percent}%
            </span>
          </div>

          <div class="mana-v927-track">
            <div
              class="mana-v927-fill"
              style="width:${percent}%"
            ></div>
          </div>
        </div>

        ${weeks}

      </div>
    `;
  }

  /* =========================================
     FUEL
     ========================================= */

  function fuelHtml() {
    const fuel =
      fuelTotalsForToday();

    const targets =
      loadTargets();

    const proteinPct =
      targets.protein
        ? Math.min(
            100,
            Math.round(
              fuel.protein /
              targets.protein *
              100
            )
          )
        : 0;

    const waterPct =
      targets.water
        ? Math.min(
            100,
            Math.round(
              fuel.water /
              targets.water *
              100
            )
          )
        : 0;

    return `
      <div id="${ROOT_ID}">
        <div class="mana-v927-hero">
          <div class="mana-v927-kicker">
            MANA 28 FUEL
          </div>

          <h2>
            Fuel the work
          </h2>

          <p>
            Keep nutrition simple: protein, quality food,
            useful carbohydrates and enough fluid.
          </p>
        </div>

        <div class="mana-v927-card">
          <div class="mana-v927-card-head">
            <h3>
              Today
            </h3>

            <span class="mana-v927-pill">
              LIVE FUEL DATA
            </span>
          </div>

          <div class="mana-v927-fuel-grid">
            <div class="mana-v927-fuel-box">
              <span>
                CALORIES
              </span>

              <strong>
                ${Math.round(
                  fuel.calories
                ).toLocaleString()}
              </strong>
            </div>

            <div class="mana-v927-fuel-box">
              <span>
                PROTEIN
              </span>

              <strong>
                ${Math.round(
                  fuel.protein
                )} g
              </strong>
            </div>

            <div class="mana-v927-fuel-box">
              <span>
                WATER
              </span>

              <strong>
                ${Math.round(
                  fuel.water
                )} ml
              </strong>
            </div>
          </div>
        </div>

        <div class="mana-v927-card">
          <div class="mana-v927-kicker">
            DAILY TARGETS
          </div>

          <p>
            Protein:
            <strong style="color:#f3d875;">
              ${
                targets.protein
                  ? `${Math.round(targets.protein)} g`
                  : "Set in Fuel"
              }
            </strong>
          </p>

          <div class="mana-v927-track">
            <div
              class="mana-v927-fill"
              style="width:${proteinPct}%"
            ></div>
          </div>

          <p>
            Water:
            <strong style="color:#f3d875;">
              ${
                targets.water
                  ? `${Math.round(targets.water)} ml`
                  : "Set in Fuel"
              }
            </strong>
          </p>

          <div class="mana-v927-track">
            <div
              class="mana-v927-fill"
              style="width:${waterPct}%"
            ></div>
          </div>
        </div>

        <div class="mana-v927-card">
          <div class="mana-v927-kicker">
            MANA 28 FUEL RULES
          </div>

          <h3 style="margin-top:5px;">
            Keep it simple
          </h3>

          <p>1. Build meals around protein.</p>
          <p>2. Eat fruit or vegetables every day.</p>
          <p>3. Use carbohydrates to support training and activity.</p>
          <p>4. Hydrate throughout the day.</p>
          <p>5. Aim for consistency, not perfection.</p>
        </div>
      </div>
    `;
  }

  /* =========================================
     PROGRESS
     ========================================= */

  function progressHtml(state) {
    const complete =
      completedCount(
        state
      );

    const percent =
      completionPercent(
        state
      );

    const actionDays =
      Object
        .entries(
          state.actions
        )
        .filter(
          ([_, values]) =>
            Array.isArray(values) &&
            values.some(Boolean)
        )
        .length;

    const reflectionDays =
      Object
        .values(
          state.reflections
        )
        .filter(
          value =>
            String(
              value || ""
            ).trim()
        )
        .length;

    return `
      <div id="${ROOT_ID}">
        <div class="mana-v927-hero">
          <div class="mana-v927-kicker">
            MANA 28 PROGRESS
          </div>

          <h2>
            ${percent}% complete
          </h2>

          <p>
            Progress comes from days completed,
            actions taken and lessons carried forward.
          </p>

          <div class="mana-v927-track">
            <div
              class="mana-v927-fill"
              style="width:${percent}%"
            ></div>
          </div>
        </div>

        <div class="mana-v927-grid">
          <div class="mana-v927-stat">
            <span>
              Days complete
            </span>

            <strong>
              ${complete}/28
            </strong>
          </div>

          <div class="mana-v927-stat">
            <span>
              Current day
            </span>

            <strong>
              ${state.currentDay}
            </strong>
          </div>

          <div class="mana-v927-stat">
            <span>
              Action days
            </span>

            <strong>
              ${actionDays}
            </strong>
          </div>

          <div class="mana-v927-stat">
            <span>
              Reflections
            </span>

            <strong>
              ${reflectionDays}
            </strong>
          </div>
        </div>

        <div class="mana-v927-card">
          <div class="mana-v927-kicker">
            28-DAY MAP
          </div>

          <div class="mana-v927-day-grid">
            ${
              DAYS
                .map((_, index) => {
                  const day =
                    index + 1;

                  const done =
                    dayComplete(
                      state,
                      day
                    );

                  const unlocked =
                    dayUnlocked(
                      state,
                      day
                    );

                  return `
                    <button
                      type="button"
                      class="
                        mana-v927-day-btn
                        ${done ? "done" : ""}
                        ${day === state.currentDay ? "current" : ""}
                        ${!unlocked ? "locked" : ""}
                      "
                      data-v927-progress-day="${day}"
                      ${!unlocked ? "disabled" : ""}
                    >
                      ${done ? "✓" : day}
                    </button>
                  `;
                })
                .join("")
            }
          </div>
        </div>

        ${
          complete === TOTAL_DAYS
            ? completionHtml()
            : ""
        }
      </div>
    `;
  }

  /* =========================================
     LEARN
     ========================================= */

  function learnHtml() {
    return `
      <div id="${ROOT_ID}">
        <div class="mana-v927-hero">
          <div class="mana-v927-kicker">
            LEARN
          </div>

          <h2>
            The principles behind MANA 28
          </h2>

          <p>
            Understand the thinking behind the program
            so the habits can continue after Day 28.
          </p>
        </div>

        <div class="mana-v927-card">
          ${
            LEARN
              .map(
                (item, index) => `
                  <div
                    class="mana-v927-learn-item"
                    data-v927-learn="${index}"
                  >
                    <button
                      type="button"
                      class="mana-v927-learn-open"
                      data-v927-learn-open="${index}"
                    >
                      <strong>
                        ${esc(item.title)}
                      </strong>

                      <span class="mana-v927-arrow">
                        ⌄
                      </span>
                    </button>

                    <div class="mana-v927-learn-body">
                      ${esc(item.body)}
                    </div>
                  </div>
                `
              )
              .join("")
          }
        </div>
      </div>
    `;
  }

  /* =========================================
     EVENTS
     ========================================= */

  function goToTab(
    tabName
  ) {
    document
      .querySelector(
        `#manaV83Tabs [data-v83-tab="${tabName}"]`
      )
      ?.click();
  }

  function wireOverview(state) {
    const {day} =
      currentDayData(
        state
      );

    document
      .querySelectorAll(
        "[data-v927-action]"
      )
      .forEach(button => {
        button.addEventListener(
          "click",
          () => {
            const index =
              Number(
                button.dataset
                  .v927Action
              );

            const next =
              loadState();

            const list =
              actionsForDay(
                next,
                day
              ).slice();

            while (
              list.length <
              DAYS[day - 1]
                .actions
                .length
            ) {
              list.push(false);
            }

            list[index] =
              !list[index];

            next.actions[
              String(day)
            ] =
              list;

            saveState(
              next
            );

            render();
          }
        );
      });

    document
      .getElementById(
        "manaV927ViewProgram"
      )
      ?.addEventListener(
        "click",
        () => {
          goToTab(
            "program"
          );
        }
      );

    document
      .getElementById(
        "manaV927SaveReflection"
      )
      ?.addEventListener(
        "click",
        () => {
          const next =
            loadState();

          next.reflections[
            String(day)
          ] =
            document
              .getElementById(
                "manaV927Reflection"
              )
              ?.value
              ?.trim() ||
            "";

          saveState(
            next
          );

          alert(
            "Reflection saved."
          );
        }
      );

    document
      .getElementById(
        "manaV927CompleteDay"
      )
      ?.addEventListener(
        "click",
        () => {
          const next =
            loadState();

          if (
            !next.completedDays
              .includes(day)
          ) {
            next.completedDays
              .push(day);
          }

          next.completedDays =
            [
              ...new Set(
                next.completedDays
              )
            ]
              .sort(
                (a,b) =>
                  a - b
              );

          if (
            day ===
              next.currentDay &&
            day <
              TOTAL_DAYS
          ) {
            next.currentDay =
              day + 1;
          }

          saveState(
            next
          );

          render();
        }
      );

    document
      .getElementById(
        "manaV927NextDay"
      )
      ?.addEventListener(
        "click",
        () => {
          const next =
            loadState();

          next.selectedDay =
            clamp(
              day + 1,
              1,
              TOTAL_DAYS
            );

          saveState(
            next
          );

          render();
        }
      );
  }

  function wireProgram() {
    document
      .querySelectorAll(
        "[data-v927-open-day]"
      )
      .forEach(button => {
        button.addEventListener(
          "click",
          () => {
            const day =
              Number(
                button.dataset
                  .v927OpenDay
              );

            const next =
              loadState();

            if (
              !dayUnlocked(
                next,
                day
              )
            ) {
              return;
            }

            next.selectedDay =
              day;

            saveState(
              next
            );

            goToTab(
              "overview"
            );
          }
        );
      });
  }

  function wireProgress() {
    document
      .querySelectorAll(
        "[data-v927-progress-day]"
      )
      .forEach(button => {
        button.addEventListener(
          "click",
          () => {
            const day =
              Number(
                button.dataset
                  .v927ProgressDay
              );

            const next =
              loadState();

            if (
              !dayUnlocked(
                next,
                day
              )
            ) {
              return;
            }

            next.selectedDay =
              day;

            saveState(
              next
            );

            goToTab(
              "program"
            );
          }
        );
      });
  }

  function wireLearn() {
    document
      .querySelectorAll(
        "[data-v927-learn-open]"
      )
      .forEach(button => {
        button.addEventListener(
          "click",
          () => {
            button
              .closest(
                ".mana-v927-learn-item"
              )
              ?.classList
              .toggle(
                "open"
              );
          }
        );
      });
  }

  /* =========================================
     RENDER
     ========================================= */

  function render() {
    if (
      !mana28Open()
    ) {
      return;
    }

    const holder =
      document.getElementById(
        "manaV83Content"
      );

    if (!holder) {
      return;
    }

    const state =
      ensureStarted(
        loadState()
      );

    const tab =
      activeTab();

    if (
      tab ===
      "program"
    ) {
      holder.innerHTML =
        programHtml(
          state
        );

      wireProgram();
      return;
    }

    if (
      tab ===
      "fuel"
    ) {
      holder.innerHTML =
        fuelHtml();

      return;
    }

    if (
      tab ===
      "progress"
    ) {
      holder.innerHTML =
        progressHtml(
          state
        );

      wireProgress();
      return;
    }

    if (
      tab ===
      "learn"
    ) {
      holder.innerHTML =
        learnHtml();

      wireLearn();
      return;
    }

    holder.innerHTML =
      overviewHtml(
        state
      );

    wireOverview(
      state
    );
  }

  function scheduleRender(
    delay = 50
  ) {
    clearTimeout(
      renderTimer
    );

    renderTimer =
      setTimeout(
        render,
        delay
      );
  }

  function watch() {
    window.addEventListener(
      "mana:program-tab-change",
      () => {
        scheduleRender(
          20
        );
      }
    );

    window.addEventListener(
      "mana28:updated",
      () => {
        scheduleRender(
          30
        );
      }
    );

    window.addEventListener(
      "mana:fuel-updated",
      () => {
        if (
          mana28Open() &&
          activeTab() ===
            "fuel"
        ) {
          scheduleRender(
            40
          );
        }
      }
    );
  }

  function init() {
    injectStyles();
    watch();

    if (
      mana28Open()
    ) {
      render();
    }
  }

  window.renderMana28 =
    render;

  window.resetMana28 =
    () => {
      if (
        !confirm(
          "Reset all MANA 28 progress and start again from Day 1?"
        )
      ) {
        return;
      }

      localStorage.removeItem(
        STATE_KEY
      );

      render();
    };

  window.MANA28_BUILD =
    BUILD;

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
