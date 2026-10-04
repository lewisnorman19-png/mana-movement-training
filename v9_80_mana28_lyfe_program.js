/* =========================================
   MANA MOVEMENT TRAINING v9.80.2
   PREMIUM 4-WEEK PROGRAM EXPERIENCE

   MANA 28 + MANA LYFE

   WEEKLY FLOW
   1 STRENGTH
   2 STRENGTH
   3 CARDIO
   4 MOBILITY
   5 STRENGTH
   6 STRENGTH
   7 REST

   - DIFFERENT WORKOUTS EACH WEEK
   - 4-WEEK PROGRESSION
   - PREMIUM WEEK TABS
   - PREMIUM DAY CARDS
   - PHONE-FIRST WORKOUT DETAIL
   - WARM-UP
   - BOLD EXERCISE NAME
   - SETS / REPS BELOW
   - ESTIMATED TIME
   - FINISHER / NOTES
   - YELLOW MARK COMPLETE BAR
   - COMPLETE RETURNS TO WEEK
   ========================================= */

(() => {
  "use strict";

  const BUILD = "98020";

  const STYLE_ID =
    "mana-v980-program-style";

  const M28_KEY =
    "mana-v973-mana28-state";

  const LYFE_KEY =
    "mana-v973-lyfe-state";


  const uiState = {

    mana28: {
      week: 1,
      day: null
    },

    lyfe: {
      week: 1,
      day: null
    }

  };


  /* =========================================
     MANA 28
     4-WEEK PROGRAM
     ========================================= */

  const MANA28_PROGRAM = [

    /* =====================================
       WEEK 1 — FOUNDATION
       ===================================== */

    {
      category:"Strength",
      title:"Full Body Strength A",
      minutes:"35–45",
      focus:"Foundation",
      tasks:[
        ["Goblet squat","3 sets × 10 reps"],
        ["Push-up or chest press","3 sets × 8–12 reps"],
        ["Dumbbell row","3 sets × 10 each side"],
        ["Romanian deadlift","3 sets × 10 reps"],
        ["Plank","3 × 30–45 sec"]
      ]
    },

    {
      category:"Strength",
      title:"Upper Body Strength",
      minutes:"35–45",
      focus:"Foundation",
      tasks:[
        ["Chest press","3 sets × 10 reps"],
        ["Seated row","3 sets × 10 reps"],
        ["Shoulder press","3 sets × 10 reps"],
        ["Lat pulldown","3 sets × 10–12 reps"],
        ["Dead bug","3 × 10 each side"]
      ]
    },

    {
      category:"Cardio",
      title:"Treadmill Conditioning",
      minutes:"30–40",
      focus:"Build the engine",
      tasks:[
        ["Easy walk","5 minutes"],
        ["Moderate pace","20 minutes"],
        ["Faster interval","60 sec"],
        ["Easy recovery","60 sec"],
        ["Repeat","5 rounds"],
        ["Cool-down","5 minutes"]
      ]
    },

    {
      category:"Mobility",
      title:"Mobility + Core Reset",
      minutes:"25–30",
      focus:"Move better",
      tasks:[
        ["Hip mobility","2 × 45 sec each side"],
        ["Thoracic rotations","2 × 8 each side"],
        ["Bird dog","3 × 8 each side"],
        ["Side plank","3 × 20–30 sec each side"],
        ["Easy walk","10 minutes"]
      ]
    },

    {
      category:"Strength",
      title:"Lower Body Strength",
      minutes:"35–45",
      focus:"Foundation",
      tasks:[
        ["Squat pattern","4 sets × 8 reps"],
        ["Romanian deadlift","3 sets × 10 reps"],
        ["Step-up","3 sets × 8 each side"],
        ["Calf raise","3 sets × 15 reps"],
        ["Dead bug","3 × 10 each side"]
      ]
    },

    {
      category:"Strength",
      title:"Full Body Strength B",
      minutes:"35–45",
      focus:"Foundation",
      tasks:[
        ["Leg press or squat","3 sets × 10 reps"],
        ["Incline press","3 sets × 10 reps"],
        ["Cable or dumbbell row","3 sets × 10 reps"],
        ["Hip thrust","3 sets × 12 reps"],
        ["Farmer carry","3 × 30 sec"]
      ]
    },

    {
      category:"Rest",
      title:"Recovery Reset",
      minutes:"20–30",
      focus:"Recover",
      tasks:[
        ["Easy walk","15–20 minutes"],
        ["Mobility","5–10 minutes"],
        ["Hydration","Hit your water target"],
        ["Reset","Prepare for Week 2"]
      ]
    },


    /* =====================================
       WEEK 2 — BUILD
       ===================================== */

    {
      category:"Strength",
      title:"Full Body Strength C",
      minutes:"40–45",
      focus:"Build",
      tasks:[
        ["Front-loaded squat","4 sets × 8 reps"],
        ["Dumbbell bench press","4 sets × 8–10 reps"],
        ["Single-arm row","3 sets × 10 each side"],
        ["Romanian deadlift","3 sets × 8 reps"],
        ["Plank shoulder tap","3 × 16 total"]
      ]
    },

    {
      category:"Strength",
      title:"Upper Body Push + Pull",
      minutes:"40–45",
      focus:"Build",
      tasks:[
        ["Incline dumbbell press","4 sets × 8–10 reps"],
        ["Lat pulldown","4 sets × 10 reps"],
        ["Seated shoulder press","3 sets × 8–10 reps"],
        ["Cable row","3 sets × 10–12 reps"],
        ["Biceps curl","3 sets × 12 reps"],
        ["Triceps pushdown","3 sets × 12 reps"]
      ]
    },

    {
      category:"Cardio",
      title:"Bike Intervals",
      minutes:"30–35",
      focus:"Build capacity",
      tasks:[
        ["Easy bike","5 minutes"],
        ["Hard effort","30 sec"],
        ["Easy recovery","60 sec"],
        ["Repeat","8 rounds"],
        ["Steady finish","5 minutes"],
        ["Cool-down","3 minutes"]
      ]
    },

    {
      category:"Mobility",
      title:"Mobility Flow + Core",
      minutes:"25–30",
      focus:"Restore",
      tasks:[
        ["World's greatest stretch","2 × 5 each side"],
        ["Hip flexor stretch","2 × 45 sec each"],
        ["Thoracic rotations","2 × 10 each"],
        ["Bird dog","3 × 10 each side"],
        ["Dead bug","3 × 10 each side"],
        ["Breathing reset","3 minutes"]
      ]
    },

    {
      category:"Strength",
      title:"Lower Body Build",
      minutes:"40–45",
      focus:"Build",
      tasks:[
        ["Leg press","4 sets × 10 reps"],
        ["Romanian deadlift","4 sets × 8 reps"],
        ["Reverse lunge","3 sets × 8 each side"],
        ["Hip thrust","3 sets × 12 reps"],
        ["Calf raise","4 sets × 12–15 reps"]
      ]
    },

    {
      category:"Strength",
      title:"Full Body Power",
      minutes:"40–45",
      focus:"Build",
      tasks:[
        ["Goblet squat","4 sets × 8 reps"],
        ["Chest press","4 sets × 8 reps"],
        ["Seated row","4 sets × 8 reps"],
        ["Kettlebell deadlift","3 sets × 10 reps"],
        ["Farmer carry","4 × 30 sec"]
      ]
    },

    {
      category:"Rest",
      title:"Week 2 Recovery",
      minutes:"20–30",
      focus:"Recover",
      tasks:[
        ["Easy walk","20 minutes"],
        ["Gentle stretch","8 minutes"],
        ["Hydration","Hit your target"],
        ["Sleep","Prioritise recovery"],
        ["Review","Notice what improved"]
      ]
    },


    /* =====================================
       WEEK 3 — PROGRESS
       ===================================== */

    {
      category:"Strength",
      title:"Full Body Strength D",
      minutes:"40–50",
      focus:"Progress",
      tasks:[
        ["Goblet or front squat","4 sets × 8 reps"],
        ["Dumbbell bench press","4 sets × 8 reps"],
        ["Chest-supported row","4 sets × 8–10 reps"],
        ["Romanian deadlift","4 sets × 8 reps"],
        ["Weighted carry","4 × 40 sec"]
      ]
    },

    {
      category:"Strength",
      title:"Upper Body Volume",
      minutes:"40–50",
      focus:"Progress",
      tasks:[
        ["Incline press","4 sets × 10 reps"],
        ["Lat pulldown","4 sets × 10 reps"],
        ["Shoulder press","3 sets × 10 reps"],
        ["Cable row","3 sets × 12 reps"],
        ["Lateral raise","3 sets × 12–15 reps"],
        ["Arms superset","3 rounds"]
      ]
    },

    {
      category:"Cardio",
      title:"Rower Conditioning",
      minutes:"30–40",
      focus:"Engine",
      tasks:[
        ["Easy row","5 minutes"],
        ["Strong effort","45 sec"],
        ["Easy recovery","75 sec"],
        ["Repeat","8 rounds"],
        ["Steady row","5 minutes"],
        ["Cool-down","3 minutes"]
      ]
    },

    {
      category:"Mobility",
      title:"Movement Quality",
      minutes:"25–35",
      focus:"Restore",
      tasks:[
        ["Ankle mobility","2 × 10 each"],
        ["Hip rotation","2 × 8 each"],
        ["Thoracic rotation","2 × 10 each"],
        ["Glute bridge","3 × 12 reps"],
        ["Side plank","3 × 30 sec each"],
        ["Easy walk","10 minutes"]
      ]
    },

    {
      category:"Strength",
      title:"Lower Body Progress",
      minutes:"40–50",
      focus:"Progress",
      tasks:[
        ["Squat or leg press","4 sets × 8 reps"],
        ["Romanian deadlift","4 sets × 8 reps"],
        ["Walking lunge","3 sets × 10 each"],
        ["Hip thrust","4 sets × 10 reps"],
        ["Calf raise","4 sets × 15 reps"]
      ]
    },

    {
      category:"Strength",
      title:"Full Body Strength E",
      minutes:"40–50",
      focus:"Progress",
      tasks:[
        ["Split squat","3 sets × 8 each side"],
        ["Flat dumbbell press","4 sets × 8–10 reps"],
        ["Single-arm cable row","4 sets × 10 each"],
        ["Kettlebell deadlift","4 sets × 8 reps"],
        ["Pallof press","3 × 10 each side"]
      ]
    },

    {
      category:"Rest",
      title:"Week 3 Recovery",
      minutes:"20–30",
      focus:"Recover",
      tasks:[
        ["Easy walk","20 minutes"],
        ["Mobility","10 minutes"],
        ["Hydration","Hit your target"],
        ["Sleep","Aim for quality recovery"],
        ["Reflect","Three wins from Week 3"]
      ]
    },


    /* =====================================
       WEEK 4 — FINISH STRONG
       ===================================== */

    {
      category:"Strength",
      title:"Full Body Strength F",
      minutes:"40–50",
      focus:"Finish strong",
      tasks:[
        ["Squat pattern","4 sets × 6–8 reps"],
        ["Chest press","4 sets × 6–8 reps"],
        ["Seated row","4 sets × 8 reps"],
        ["Romanian deadlift","4 sets × 8 reps"],
        ["Farmer carry","4 × 45 sec"]
      ]
    },

    {
      category:"Strength",
      title:"Upper Body Finish",
      minutes:"40–50",
      focus:"Finish strong",
      tasks:[
        ["Incline press","4 sets × 8 reps"],
        ["Lat pulldown","4 sets × 8 reps"],
        ["Shoulder press","4 sets × 8 reps"],
        ["Cable row","4 sets × 10 reps"],
        ["Lateral raise","3 sets × 15 reps"],
        ["Arms finisher","2–3 rounds"]
      ]
    },

    {
      category:"Cardio",
      title:"Mixed Cardio Challenge",
      minutes:"35–40",
      focus:"Finish strong",
      tasks:[
        ["Warm-up","5 minutes"],
        ["Treadmill","8 minutes"],
        ["Bike","8 minutes"],
        ["Rower","8 minutes"],
        ["Moderate finish","5 minutes"],
        ["Cool-down","5 minutes"]
      ]
    },

    {
      category:"Mobility",
      title:"Full Body Mobility Reset",
      minutes:"25–35",
      focus:"Restore",
      tasks:[
        ["Hip mobility","3 minutes"],
        ["Thoracic mobility","3 minutes"],
        ["Hamstring mobility","3 minutes"],
        ["Shoulder mobility","3 minutes"],
        ["Core control","3 rounds"],
        ["Easy walk","10 minutes"]
      ]
    },

    {
      category:"Strength",
      title:"Lower Body Finish",
      minutes:"40–50",
      focus:"Finish strong",
      tasks:[
        ["Leg press or squat","4 sets × 8 reps"],
        ["Romanian deadlift","4 sets × 8 reps"],
        ["Step-up","3 sets × 10 each side"],
        ["Hip thrust","4 sets × 10 reps"],
        ["Calf raise","4 sets × 15 reps"]
      ]
    },

    {
      category:"Strength",
      title:"Final Full Body Session",
      minutes:"40–50",
      focus:"Finish strong",
      tasks:[
        ["Goblet squat","3 sets × 10 reps"],
        ["Dumbbell press","3 sets × 10 reps"],
        ["Dumbbell row","3 sets × 10 reps"],
        ["Romanian deadlift","3 sets × 10 reps"],
        ["Shoulder press","3 sets × 10 reps"],
        ["Carry","3 × 45 sec"]
      ]
    },

    {
      category:"Rest",
      title:"Day 28 — Reset & Review",
      minutes:"20–30",
      focus:"Complete",
      tasks:[
        ["Easy walk","20 minutes"],
        ["Mobility","5–10 minutes"],
        ["Hydration","Hit your target"],
        ["Reflect","Review your 28 days"],
        ["Next step","Choose what continues"]
      ]
    }

  ];


  /* =========================================
     MANA LYFE
     SAME STRUCTURE — DIFFERENT PURPOSE
     ========================================= */

  const LYFE_PROGRAM = [

    /* WEEK 1 */

    {
      category:"Strength",
      title:"Reset Strength",
      minutes:"30–40",
      focus:"Reset",
      tasks:[
        ["Bodyweight squat","3 × 12"],
        ["Push-up or wall push-up","3 × 10"],
        ["Row","3 × 12"],
        ["Hip hinge","3 × 12"],
        ["Plank","3 × 30 sec"]
      ]
    },

    {
      category:"Strength",
      title:"Build Your Base",
      minutes:"30–40",
      focus:"Reset",
      tasks:[
        ["Reverse lunge","3 × 8 each"],
        ["Chest press","3 × 10"],
        ["Row","3 × 10"],
        ["Glute bridge","3 × 12"],
        ["Dead bug","3 × 10 each"]
      ]
    },

    {
      category:"Cardio",
      title:"Clear Your Head",
      minutes:"30–35",
      focus:"Reset",
      tasks:[
        ["Easy walk","5 minutes"],
        ["Purposeful cardio","20 minutes"],
        ["Faster effort","5 × 60 sec"],
        ["Cool-down","5 minutes"]
      ]
    },

    {
      category:"Mobility",
      title:"Slow Down & Reset",
      minutes:"20–30",
      focus:"Reset",
      tasks:[
        ["Mobility flow","10 minutes"],
        ["Easy walk","10 minutes"],
        ["Breathing","5 minutes"],
        ["Reflection","What do I need to release?"]
      ]
    },

    {
      category:"Strength",
      title:"Move With Intent",
      minutes:"30–40",
      focus:"Reset",
      tasks:[
        ["Goblet squat","3 × 10"],
        ["Incline push-up","3 × 10"],
        ["Single-arm row","3 × 10 each"],
        ["Romanian deadlift","3 × 10"],
        ["Carry","3 × 30 sec"]
      ]
    },

    {
      category:"Strength",
      title:"Confidence Session",
      minutes:"30–40",
      focus:"Reset",
      tasks:[
        ["Step-up","3 × 8 each"],
        ["Shoulder press","3 × 10"],
        ["Lat pulldown","3 × 10"],
        ["Hip thrust","3 × 12"],
        ["Plank","3 × 30 sec"]
      ]
    },

    {
      category:"Rest",
      title:"Weekly Reset",
      minutes:"20–30",
      focus:"Reset",
      tasks:[
        ["Easy walk","15 minutes"],
        ["Mobility","5 minutes"],
        ["Breathing","3 minutes"],
        ["Reflection","What went well this week?"]
      ]
    },


    /* WEEK 2 */

    {
      category:"Strength",
      title:"Rebuild Strength",
      minutes:"35–40",
      focus:"Rebuild",
      tasks:[
        ["Goblet squat","4 × 10"],
        ["Chest press","3 × 10"],
        ["Seated row","3 × 10"],
        ["Romanian deadlift","3 × 10"],
        ["Plank shoulder tap","3 × 16"]
      ]
    },

    {
      category:"Strength",
      title:"Upper Body Rebuild",
      minutes:"35–40",
      focus:"Rebuild",
      tasks:[
        ["Incline press","3 × 10"],
        ["Lat pulldown","3 × 10"],
        ["Shoulder press","3 × 10"],
        ["Cable row","3 × 12"],
        ["Carry","3 × 40 sec"]
      ]
    },

    {
      category:"Cardio",
      title:"Energy Builder",
      minutes:"30–40",
      focus:"Rebuild",
      tasks:[
        ["Warm-up","5 minutes"],
        ["Bike or rower","20 minutes"],
        ["Intervals","6 × 30 sec"],
        ["Cool-down","5 minutes"]
      ]
    },

    {
      category:"Mobility",
      title:"Release Tension",
      minutes:"25–30",
      focus:"Rebuild",
      tasks:[
        ["Hip mobility","5 minutes"],
        ["Thoracic mobility","5 minutes"],
        ["Breathing reset","5 minutes"],
        ["Easy walk","10 minutes"],
        ["Reflection","What can I control today?"]
      ]
    },

    {
      category:"Strength",
      title:"Lower Body Rebuild",
      minutes:"35–45",
      focus:"Rebuild",
      tasks:[
        ["Leg press","4 × 10"],
        ["Romanian deadlift","3 × 10"],
        ["Reverse lunge","3 × 8 each"],
        ["Hip thrust","3 × 12"],
        ["Calf raise","3 × 15"]
      ]
    },

    {
      category:"Strength",
      title:"Full Body Build",
      minutes:"35–45",
      focus:"Rebuild",
      tasks:[
        ["Squat","3 × 10"],
        ["Push-up or press","3 × 10"],
        ["Row","3 × 10"],
        ["Hip hinge","3 × 10"],
        ["Carry","4 × 30 sec"]
      ]
    },

    {
      category:"Rest",
      title:"Rebuild Reset",
      minutes:"20–30",
      focus:"Rebuild",
      tasks:[
        ["Easy movement","20 minutes"],
        ["Mobility","5 minutes"],
        ["Breathing","3 minutes"],
        ["Reflection","What am I rebuilding?"]
      ]
    },


    /* WEEK 3 */

    {
      category:"Strength",
      title:"Grow Stronger",
      minutes:"35–45",
      focus:"Grow",
      tasks:[
        ["Squat","4 × 8"],
        ["Chest press","4 × 8–10"],
        ["Row","4 × 10"],
        ["Romanian deadlift","4 × 8"],
        ["Plank","3 × 45 sec"]
      ]
    },

    {
      category:"Strength",
      title:"Upper Body Confidence",
      minutes:"35–45",
      focus:"Grow",
      tasks:[
        ["Incline press","4 × 10"],
        ["Lat pulldown","4 × 10"],
        ["Shoulder press","3 × 10"],
        ["Cable row","3 × 12"],
        ["Arms","3 rounds"]
      ]
    },

    {
      category:"Cardio",
      title:"Move Forward",
      minutes:"30–40",
      focus:"Grow",
      tasks:[
        ["Warm-up","5 minutes"],
        ["Moderate cardio","20 minutes"],
        ["Strong effort","8 × 30 sec"],
        ["Cool-down","5 minutes"]
      ]
    },

    {
      category:"Mobility",
      title:"Restore & Breathe",
      minutes:"25–30",
      focus:"Grow",
      tasks:[
        ["Mobility flow","12 minutes"],
        ["Core control","3 rounds"],
        ["Easy walk","10 minutes"],
        ["Breathing","3 minutes"],
        ["Reflection","What am I doing better now?"]
      ]
    },

    {
      category:"Strength",
      title:"Lower Body Confidence",
      minutes:"35–45",
      focus:"Grow",
      tasks:[
        ["Leg press","4 × 8–10"],
        ["Romanian deadlift","4 × 8"],
        ["Walking lunge","3 × 10 each"],
        ["Hip thrust","4 × 10"],
        ["Calf raise","4 × 15"]
      ]
    },

    {
      category:"Strength",
      title:"Full Body Progress",
      minutes:"35–45",
      focus:"Grow",
      tasks:[
        ["Goblet squat","4 × 8"],
        ["Dumbbell press","4 × 8"],
        ["Single-arm row","4 × 10 each"],
        ["Deadlift pattern","3 × 10"],
        ["Carry","4 × 40 sec"]
      ]
    },

    {
      category:"Rest",
      title:"Growth Reset",
      minutes:"20–30",
      focus:"Grow",
      tasks:[
        ["Easy walk","20 minutes"],
        ["Mobility","8 minutes"],
        ["Breathing","3 minutes"],
        ["Reflection","What evidence of progress do I have?"]
      ]
    },


    /* WEEK 4 */

    {
      category:"Strength",
      title:"Move Forward Strength",
      minutes:"40–45",
      focus:"Move Forward",
      tasks:[
        ["Squat","4 × 8"],
        ["Chest press","4 × 8"],
        ["Row","4 × 8"],
        ["Romanian deadlift","4 × 8"],
        ["Carry","4 × 45 sec"]
      ]
    },

    {
      category:"Strength",
      title:"Stand Strong",
      minutes:"40–45",
      focus:"Move Forward",
      tasks:[
        ["Incline press","4 × 8"],
        ["Lat pulldown","4 × 8"],
        ["Shoulder press","4 × 8"],
        ["Cable row","4 × 10"],
        ["Core","3 rounds"]
      ]
    },

    {
      category:"Cardio",
      title:"Purpose Cardio",
      minutes:"35–40",
      focus:"Move Forward",
      tasks:[
        ["Warm-up","5 minutes"],
        ["Treadmill / bike / rower","25 minutes"],
        ["Strong finish","5 minutes"],
        ["Cool-down","5 minutes"]
      ]
    },

    {
      category:"Mobility",
      title:"Reset The System",
      minutes:"25–30",
      focus:"Move Forward",
      tasks:[
        ["Full body mobility","15 minutes"],
        ["Easy walk","10 minutes"],
        ["Breathing","5 minutes"],
        ["Reflection","What am I taking forward?"]
      ]
    },

    {
      category:"Strength",
      title:"Lower Body Finish",
      minutes:"40–45",
      focus:"Move Forward",
      tasks:[
        ["Squat or leg press","4 × 8"],
        ["Romanian deadlift","4 × 8"],
        ["Step-up","3 × 10 each"],
        ["Hip thrust","4 × 10"],
        ["Calf raise","4 × 15"]
      ]
    },

    {
      category:"Strength",
      title:"Final Strength Session",
      minutes:"40–45",
      focus:"Move Forward",
      tasks:[
        ["Goblet squat","3 × 10"],
        ["Dumbbell press","3 × 10"],
        ["Dumbbell row","3 × 10"],
        ["Romanian deadlift","3 × 10"],
        ["Shoulder press","3 × 10"],
        ["Carry","3 × 45 sec"]
      ]
    },

    {
      category:"Rest",
      title:"Day 28 — Move Forward",
      minutes:"20–30",
      focus:"Complete",
      tasks:[
        ["Easy walk","20 minutes"],
        ["Mobility","5–10 minutes"],
        ["Breathing","3 minutes"],
        ["Reflection","What changed over these 28 days?"],
        ["Next step","Choose what you carry forward"]
      ]
    }

  ];


  /* =========================================
     HELPERS
     ========================================= */

  function safeJson(raw,fallback) {

    try {
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }


  function esc(value) {

    return String(value ?? "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;");
  }


  function shell() {

    return document.getElementById(
      "manaV83ProgramShell"
    );
  }


  function holder() {

    return document.getElementById(
      "manaV83Content"
    );
  }


  function titleEl() {

    return document.getElementById(
      "manaV83Title"
    );
  }


  function activeTab() {

    return (
      document.querySelector(
        "#manaV83Tabs .mana-v83-tab.active"
      )
      ?.dataset
      ?.v83Tab || ""
    );
  }


  function programKind() {

    const title =
      (
        titleEl()?.textContent || ""
      )
      .trim()
      .toUpperCase();


    if (
      title.startsWith("MANA 28")
    ) {
      return "mana28";
    }


    if (
      title.startsWith("MANA LIFE") ||
      title.startsWith("MANA LYFE")
    ) {
      return "lyfe";
    }


    return "";
  }


  function isProgramTab(kind) {

    const tab =
      activeTab();


    if (
      kind === "mana28"
    ) {
      return tab === "program";
    }


    if (
      kind === "lyfe"
    ) {
      return tab === "routine";
    }


    return false;
  }


  function stateKey(kind) {

    return (
      kind === "mana28"
        ? M28_KEY
        : LYFE_KEY
    );
  }


  function loadState(kind) {

    const state =
      safeJson(
        localStorage.getItem(
          stateKey(kind)
        ) || "{}",
        {}
      );


    if (
      !Array.isArray(
        state.completed
      )
    ) {
      state.completed = [];
    }


    return state;
  }


  function saveState(
    kind,
    state
  ) {

    localStorage.setItem(
      stateKey(kind),
      JSON.stringify(state)
    );
  }


  function openOverview() {

    document.querySelector(
      '#manaV83Tabs [data-v83-tab="overview"]'
    )
    ?.click();
  }


  function getDay(
    kind,
    day
  ) {

    const index =
      day - 1;


    return (
      kind === "mana28"
        ? MANA28_PROGRAM[index]
        : LYFE_PROGRAM[index]
    );
  }


  /* =========================================
     WARM-UP
     ========================================= */

  function warmupText(data) {

    const category =
      String(
        data.category || ""
      )
      .toLowerCase();


    if (
      category === "strength"
    ) {

      return (
        "Start with 5–7 minutes of easy movement. " +
        "Then complete one light preparation set of the first exercise before beginning your working sets."
      );
    }


    if (
      category === "cardio"
    ) {

      return (
        "Begin easy for 5 minutes. Gradually increase your pace until your breathing and body temperature are ready for the main work."
      );
    }


    if (
      category === "mobility"
    ) {

      return (
        "Start with 2–3 minutes of easy walking and relaxed breathing. Move slowly through the first few mobility drills."
      );
    }


    return (
      "Keep today easy. Start with a relaxed walk and allow the body to recover."
    );
  }


  /* =========================================
     FINISHER
     ========================================= */

  function finisherText(
    kind,
    data
  ) {

    const category =
      String(
        data.category || ""
      )
      .toLowerCase();


    if (
      category === "strength"
    ) {

      return (
        "Keep every rep controlled. Rest around 60–90 seconds between working sets. " +
        "If technique starts to break down, stop the set. Finish with 3–5 minutes of easy movement."
      );
    }


    if (
      category === "cardio"
    ) {

      return (
        "Finish with 3–5 minutes at an easy pace and allow your breathing to settle before stopping."
      );
    }


    if (
      category === "mobility"
    ) {

      return (
        "Move slowly and never force range. Finish with relaxed breathing and notice how your body feels compared with the start."
      );
    }


    if (
      kind === "lyfe"
    ) {

      return (
        "Recovery is part of the program. Keep the day easy and take a moment to reflect on your energy, mindset and progress."
      );
    }


    return (
      "Recovery is training too. Hydrate, move lightly and prepare yourself for the next week."
    );
  }


  /* =========================================
     PREMIUM STYLE
     ========================================= */

  function installStyles() {

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

      /* =====================================
         ROOT
         ===================================== */

      .mana-v980-root{

        width:100%;

        max-width:780px;

        margin:0 auto 38px;
      }


      .mana-v980-intro{

        position:relative;

        margin-bottom:20px;

        padding-bottom:17px;

        border-bottom:
          1px solid #26231b;
      }


      .mana-v980-intro::after{

        content:"";

        position:absolute;

        left:0;

        bottom:-1px;

        width:86px;

        height:2px;

        background:
          linear-gradient(
            90deg,
            #f1d674,
            transparent
          );
      }


      .mana-v980-kicker{

        color:#dbbd56;

        font-size:11px;

        font-weight:950;

        letter-spacing:.17em;

        text-transform:uppercase;
      }


      .mana-v980-intro h2{

        margin:7px 0 7px;

        color:#fff;

        font-size:32px;

        font-weight:950;

        line-height:1.02;
      }


      .mana-v980-intro p{

        max-width:600px;

        margin:0;

        color:#9f9f9f;

        font-size:14px;

        line-height:1.5;
      }


      /* =====================================
         WEEK TABS
         ===================================== */

      .mana-v980-weeks{

        display:grid;

        grid-template-columns:
          repeat(4,minmax(0,1fr));

        gap:8px;

        padding:5px;

        margin-bottom:18px;

        border:
          1px solid #252525;

        border-radius:17px;

        background:#080808;
      }


      .mana-v980-week{

        min-height:48px;

        border:0;

        border-radius:13px;

        background:transparent;

        color:#777;

        font-size:11px;

        font-weight:950;

        letter-spacing:.04em;

        cursor:pointer;

        transition:
          transform .15s ease,
          background .15s ease;
      }


      .mana-v980-week:active{

        transform:scale(.98);
      }


      .mana-v980-week.active{

        background:
          linear-gradient(
            145deg,
            #f5dc7b,
            #c99f2f
          );

        color:#111;

        box-shadow:
          0 8px 24px rgba(212,175,55,.12);
      }


      /* =====================================
         WEEK HEADING
         ===================================== */

      .mana-v980-week-head{

        display:flex;

        justify-content:space-between;

        align-items:center;

        gap:12px;

        margin:
          0 2px 10px;
      }


      .mana-v980-week-title{

        color:#fff;

        font-size:21px;

        font-weight:950;
      }


      .mana-v980-week-progress{

        padding:
          6px 9px;

        border:
          1px solid #3a321b;

        border-radius:999px;

        background:#11100c;

        color:#d6b752;

        font-size:10px;

        font-weight:950;
      }


      /* =====================================
         DAY LIST
         ===================================== */

      .mana-v980-list{

        display:grid;

        gap:10px;
      }


      .mana-v980-day{

        position:relative;

        width:100%;

        min-height:86px;

        display:grid;

        grid-template-columns:
          56px
          minmax(0,1fr)
          24px;

        align-items:center;

        gap:15px;

        overflow:hidden;

        padding:
          13px 15px;

        text-align:left;

        border:
          1px solid #292820;

        border-radius:19px;

        background:
          linear-gradient(
            145deg,
            #15140f,
            #090909
          );

        color:#fff;

        cursor:pointer;

        box-shadow:
          0 8px 28px rgba(0,0,0,.16);
      }


      .mana-v980-day::before{

        content:"";

        position:absolute;

        left:0;

        top:18px;

        bottom:18px;

        width:2px;

        background:
          linear-gradient(
            180deg,
            transparent,
            #d1ad39,
            transparent
          );

        opacity:.65;
      }


      .mana-v980-day:active{

        transform:scale(.994);
      }


      .mana-v980-number{

        width:56px;

        height:56px;

        display:grid;

        place-items:center;

        border-radius:17px;

        border:
          1px solid #50451f;

        background:
          linear-gradient(
            145deg,
            #18150c,
            #0e0d09
          );

        color:#f2d875;

        font-size:22px;

        font-weight:950;
      }


      .mana-v980-day.done
      .mana-v980-number{

        border-color:#d4b241;

        background:
          linear-gradient(
            145deg,
            #f2d875,
            #c89f2f
          );

        color:#111;
      }


      .mana-v980-copy{

        min-width:0;
      }


      .mana-v980-category{

        color:#c6a948;

        font-size:9px;

        font-weight:950;

        letter-spacing:.15em;

        text-transform:uppercase;
      }


      .mana-v980-title{

        margin-top:5px;

        color:#fff;

        font-size:18px;

        font-weight:950;

        line-height:1.1;
      }


      .mana-v980-time{

        margin-top:5px;

        color:#898989;

        font-size:10px;

        font-weight:800;
      }


      .mana-v980-arrow{

        color:#d8ba57;

        font-size:22px;

        font-weight:950;

        text-align:center;
      }


      /* =====================================
         WORKOUT DETAIL
         ===================================== */

      .mana-v980-session{

        width:100%;

        max-width:690px;

        margin:0 auto 38px;
      }


      .mana-v980-session-top{

        display:flex;

        justify-content:space-between;

        align-items:center;

        gap:12px;

        margin-bottom:18px;
      }


      .mana-v980-back-week{

        min-height:40px;

        padding:
          0 13px;

        border:
          1px solid #333;

        border-radius:12px;

        background:#0d0d0d;

        color:#f2d875;

        font-size:11px;

        font-weight:950;
      }


      .mana-v980-day-label{

        color:#897a49;

        font-size:10px;

        font-weight:950;

        letter-spacing:.11em;
      }


      .mana-v980-workout-head{

        padding-bottom:17px;

        border-bottom:
          1px solid #26231b;
      }


      .mana-v980-workout-category{

        color:#d1b252;

        font-size:10px;

        font-weight:950;

        letter-spacing:.16em;

        text-transform:uppercase;
      }


      .mana-v980-workout-title{

        margin:
          7px 0 6px;

        color:#fff;

        font-size:34px;

        font-weight:950;

        line-height:1.02;
      }


      .mana-v980-focus{

        margin-top:4px;

        color:#999;

        font-size:12px;

        font-weight:700;
      }


      .mana-v980-duration{

        display:inline-flex;

        align-items:center;

        min-height:30px;

        margin-top:9px;

        padding:
          0 11px;

        border:
          1px solid #4d421f;

        border-radius:999px;

        background:#14120a;

        color:#f3d875;

        font-size:10px;

        font-weight:950;

        letter-spacing:.04em;
      }


      /* =====================================
         NOTES
         ===================================== */

      .mana-v980-note{

        position:relative;

        margin-top:17px;

        overflow:hidden;

        padding:
          14px 15px 14px 17px;

        border:
          1px solid #2d291c;

        border-radius:15px;

        background:
          linear-gradient(
            145deg,
            #14130e,
            #0d0d0b
          );
      }


      .mana-v980-note::before{

        content:"";

        position:absolute;

        top:0;

        left:0;

        bottom:0;

        width:3px;

        background:#d2af3c;
      }


      .mana-v980-note-title{

        margin-bottom:7px;

        color:#efd16c;

        font-size:9px;

        font-weight:950;

        letter-spacing:.16em;

        text-transform:uppercase;
      }


      .mana-v980-note-text{

        color:#bdbdbd;

        font-size:13px;

        line-height:1.5;
      }


      /* =====================================
         EXERCISES
         ===================================== */

      .mana-v980-exercises{

        margin-top:14px;

        border-top:
          1px solid #242424;
      }


      .mana-v980-exercise{

        position:relative;

        padding:
          15px 3px;

        border-bottom:
          1px solid #242424;
      }


      .mana-v980-exercise-name{

        display:block;

        padding-right:12px;

        color:#fff;

        font-size:17px;

        font-weight:950;

        line-height:1.2;
      }


      .mana-v980-exercise-detail{

        display:block;

        margin-top:5px;

        color:#b6b6b6;

        font-size:14px;

        font-weight:550;

        line-height:1.3;
      }


      /* =====================================
         COMPLETE
         ===================================== */

      .mana-v980-complete{

        width:100%;

        min-height:58px;

        margin-top:16px;

        border:0;

        border-radius:16px;

        background:
          linear-gradient(
            135deg,
            #f5dc7a,
            #c69a28
          );

        color:#111;

        font-size:13px;

        font-weight:950;

        letter-spacing:.08em;

        cursor:pointer;

        box-shadow:
          0 10px 30px
          rgba(212,175,55,.14);
      }


      .mana-v980-complete:active{

        transform:scale(.995);
      }


      /* =====================================
         PHONE PREMIUM
         ===================================== */

      @media(max-width:700px){

        .mana-v980-root{

          margin-bottom:24px;
        }


        .mana-v980-intro{

          margin-bottom:15px;

          padding-bottom:14px;
        }


        .mana-v980-intro h2{

          font-size:27px;
        }


        .mana-v980-weeks{

          gap:4px;

          padding:4px;

          margin-bottom:14px;

          border-radius:14px;
        }


        .mana-v980-week{

          min-height:42px;

          padding:0 2px;

          border-radius:10px;

          font-size:9px;
        }


        .mana-v980-week-head{

          margin-bottom:8px;
        }


        .mana-v980-week-title{

          font-size:18px;
        }


        .mana-v980-day{

          min-height:78px;

          grid-template-columns:
            49px
            minmax(0,1fr)
            18px;

          gap:11px;

          padding:
            10px 11px;

          border-radius:16px;
        }


        .mana-v980-day::before{

          top:15px;

          bottom:15px;
        }


        .mana-v980-number{

          width:49px;

          height:49px;

          border-radius:14px;

          font-size:20px;
        }


        .mana-v980-title{

          font-size:16px;
        }


        .mana-v980-time{

          font-size:9px;
        }


        .mana-v980-arrow{

          font-size:18px;
        }


        .mana-v980-session{

          margin-bottom:24px;
        }


        .mana-v980-session-top{

          margin-bottom:14px;
        }


        .mana-v980-workout-head{

          padding-bottom:14px;
        }


        .mana-v980-workout-title{

          margin:
            6px 0 5px;

          font-size:28px;
        }


        .mana-v980-focus{

          font-size:11px;
        }


        .mana-v980-duration{

          min-height:28px;

          margin-top:8px;

          font-size:9px;
        }


        .mana-v980-note{

          margin-top:14px;

          padding:
            12px 12px 12px 15px;

          border-radius:13px;
        }


        .mana-v980-note-text{

          font-size:13px;

          line-height:1.45;
        }


        .mana-v980-exercise{

          padding:
            13px 2px;
        }


        .mana-v980-exercise-name{

          font-size:17px;
        }


        .mana-v980-exercise-detail{

          margin-top:4px;

          color:#b8b8b8;

          font-size:14px;
        }


        .mana-v980-complete{

          min-height:55px;

          margin-top:14px;

          border-radius:14px;

          font-size:12px;
        }

      }

    `;


    document.head
      .appendChild(style);
  }


  /* =========================================
     WEEK SCREEN
     ========================================= */

  function renderWeek(kind) {

    const content =
      holder();


    if (!content) {
      return;
    }


    shell()
      ?.classList
      .remove(
        "mana-v978-program"
      );


    if (
      kind === "lyfe" &&
      titleEl()
    ) {

      titleEl().textContent =
        "MANA LYFE";
    }


    const ui =
      uiState[kind];


    ui.day =
      null;


    const week =
      ui.week;


    const startDay =
      (
        week - 1
      ) * 7 + 1;


    const endDay =
      startDay + 6;


    const state =
      loadState(kind);


    const completedThisWeek =
      state.completed
        .filter(
          day =>
            day >= startDay &&
            day <= endDay
        )
        .length;


    const rows = [];


    for (
      let day = startDay;
      day <= endDay;
      day += 1
    ) {

      const data =
        getDay(
          kind,
          day
        );


      const done =
        state.completed
          .includes(day);


      const visibleNumber =
        day -
        startDay +
        1;


      rows.push(`

        <button
          type="button"

          class="
            mana-v980-day
            ${done ? "done" : ""}
          "

          data-v980-day="${day}"
        >

          <div
            class="mana-v980-number"
          >
            ${
              done
                ? "✓"
                : visibleNumber
            }
          </div>


          <div
            class="mana-v980-copy"
          >

            <div
              class="mana-v980-category"
            >
              ${esc(
                data.category
              )}
            </div>


            <div
              class="mana-v980-title"
            >
              ${esc(
                data.title
              )}
            </div>


            <div
              class="mana-v980-time"
            >
              DAY ${day}
              • ${esc(
                data.minutes
              )} MIN
            </div>

          </div>


          <div
            class="mana-v980-arrow"
          >
            ›
          </div>

        </button>

      `);

    }


    content.innerHTML = `

      <div
        class="mana-v980-root"
      >

        <div
          class="mana-v980-intro"
        >

          <div
            class="mana-v980-kicker"
          >
            ${
              kind === "mana28"
                ? "MANA 28"
                : "MANA LYFE"
            }
            • 28 DAY PROGRAM
          </div>


          <h2>
            Your 4-Week Plan
          </h2>


          <p>
            Each week follows the same rhythm
            with new workouts and progressive
            training.
          </p>

        </div>


        <div
          class="mana-v980-weeks"
        >

          ${
            [1,2,3,4]
              .map(
                number => `

                  <button
                    type="button"

                    class="
                      mana-v980-week
                      ${
                        number === week
                          ? "active"
                          : ""
                      }
                    "

                    data-v980-week="${number}"
                  >
                    WEEK ${number}
                  </button>

                `
              )
              .join("")
          }

        </div>


        <div
          class="mana-v980-week-head"
        >

          <div
            class="mana-v980-week-title"
          >
            Week ${week}
          </div>


          <div
            class="mana-v980-week-progress"
          >
            ${completedThisWeek} / 7 COMPLETE
          </div>

        </div>


        <div
          class="mana-v980-list"
        >
          ${rows.join("")}
        </div>

      </div>

    `;


    content
      .querySelectorAll(
        "[data-v980-week]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              ui.week =
                Number(
                  button.dataset
                    .v980Week
                );


              renderWeek(kind);

            }
          );

        }
      );


    content
      .querySelectorAll(
        "[data-v980-day]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              const day =
                Number(
                  button.dataset
                    .v980Day
                );


              ui.day =
                day;


              renderSession(
                kind,
                day
              );

            }
          );

        }
      );


    updateBackButton(kind);
  }


  /* =========================================
     WORKOUT DETAIL
     ========================================= */

  function renderSession(
    kind,
    day
  ) {

    const content =
      holder();


    if (!content) {
      return;
    }


    const data =
      getDay(
        kind,
        day
      );


    const week =
      Math.floor(
        (day - 1) / 7
      ) + 1;


    uiState[kind].week =
      week;


    uiState[kind].day =
      day;


    const exercises =
      data.tasks
        .map(
          task => `

            <div
              class="mana-v980-exercise"
            >

              <strong
                class="mana-v980-exercise-name"
              >
                ${esc(
                  task[0]
                )}
              </strong>


              <span
                class="mana-v980-exercise-detail"
              >
                ${esc(
                  task[1]
                )}
              </span>

            </div>

          `
        )
        .join("");


    content.innerHTML = `

      <div
        class="mana-v980-session"
      >

        <div
          class="mana-v980-session-top"
        >

          <button
            type="button"

            class="mana-v980-back-week"

            id="manaV980BackWeek"
          >
            ← WEEK ${week}
          </button>


          <div
            class="mana-v980-day-label"
          >
            DAY ${day} OF 28
          </div>

        </div>


        <div
          class="mana-v980-workout-head"
        >

          <div
            class="mana-v980-workout-category"
          >
            ${esc(
              data.category
            )}
          </div>


          <h2
            class="mana-v980-workout-title"
          >
            ${esc(
              data.title
            )}
          </h2>


          <div
            class="mana-v980-focus"
          >
            ${
              data.focus
                ? `Focus • ${esc(data.focus)}`
                : ""
            }
          </div>


          <div
            class="mana-v980-duration"
          >
            APPROX.
            ${esc(
              data.minutes
            )}
            MINUTES
          </div>

        </div>


        <div
          class="mana-v980-note"
        >

          <div
            class="mana-v980-note-title"
          >
            WARM-UP
          </div>


          <div
            class="mana-v980-note-text"
          >
            ${esc(
              warmupText(data)
            )}
          </div>

        </div>


        <div
          class="mana-v980-exercises"
        >
          ${exercises}
        </div>


        <div
          class="mana-v980-note"
        >

          <div
            class="mana-v980-note-title"
          >
            FINISHER / NOTES
          </div>


          <div
            class="mana-v980-note-text"
          >
            ${esc(
              finisherText(
                kind,
                data
              )
            )}
          </div>

        </div>


        <button
          type="button"

          id="manaV980Complete"

          class="mana-v980-complete"
        >
          MARK COMPLETE
        </button>

      </div>

    `;


    document
      .getElementById(
        "manaV980BackWeek"
      )
      ?.addEventListener(
        "click",
        () => {

          renderWeek(kind);

        }
      );


    document
      .getElementById(
        "manaV980Complete"
      )
      ?.addEventListener(
        "click",
        () => {

          completeDay(
            kind,
            day
          );

        }
      );


    updateBackButton(kind);


    const parentShell =
      shell();


    if (parentShell) {

      parentShell.scrollTop =
        0;
    }
  }


  /* =========================================
     COMPLETE
     ========================================= */

  function completeDay(
    kind,
    day
  ) {

    const state =
      loadState(kind);


    if (
      !state.completed
        .includes(day)
    ) {

      state.completed
        .push(day);


      state.completed
        .sort(
          (a,b) =>
            a - b
        );
    }


    state[
      `day${day}`
    ] = {

      ...(
        state[
          `day${day}`
        ] || {}
      ),

      completedAt:
        new Date()
          .toISOString()

    };


    saveState(
      kind,
      state
    );


    uiState[kind].day =
      null;


    renderWeek(kind);


    const parentShell =
      shell();


    if (parentShell) {

      parentShell.scrollTop =
        0;
    }
  }


  /* =========================================
     BACK
     ========================================= */

  function updateBackButton(kind) {

    const button =
      document.getElementById(
        "manaV83Back"
      );


    if (!button) {
      return;
    }


    if (
      uiState[kind]?.day
    ) {

      button.textContent =
        `← Week ${
          uiState[kind].week
        }`;

    } else {

      button.textContent =
        "← Overview";
    }
  }


  function installBackHandler() {

    document.addEventListener(
      "click",
      event => {

        const button =
          event.target.closest(
            "#manaV83Back"
          );


        if (!button) {
          return;
        }


        const kind =
          programKind();


        if (
          !kind ||
          !isProgramTab(kind)
        ) {
          return;
        }


        event.preventDefault();

        event.stopImmediatePropagation();


        if (
          uiState[kind].day
        ) {

          uiState[kind].day =
            null;


          renderWeek(kind);

          return;
        }


        openOverview();

      },
      true
    );
  }


  /* =========================================
     RENDER
     ========================================= */

  function renderProgram() {

    const kind =
      programKind();


    if (
      !kind ||
      !isProgramTab(kind)
    ) {
      return;
    }


    if (
      kind === "lyfe" &&
      titleEl()
    ) {

      titleEl().textContent =
        "MANA LYFE";
    }


    if (
      uiState[kind].day
    ) {

      renderSession(
        kind,
        uiState[kind].day
      );

    } else {

      renderWeek(kind);
    }
  }


  function scheduleRender() {

    [
      140,
      220,
      360
    ]
      .forEach(
        delay => {

          setTimeout(
            renderProgram,
            delay
          );

        }
      );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    installBackHandler();

    scheduleRender();


    window.addEventListener(
      "mana:program-tab-change",
      scheduleRender
    );


    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "#manaV80Mana28," +
            "#manaV80Life," +
            "#manaV83Tabs"
          )
        ) {

          scheduleRender();
        }

      },
      true
    );


    window.MANA_WEEK_PROGRAM_BUILD =
      BUILD;


    console.log(
      "[Mana v9.80.2] premium 4-week programs ready"
    );
  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once:true
      }
    );

  } else {

    init();

  }

})();
