/* =========================================
   MANA MOVEMENT TRAINING v9.51.0
   FUEL PROTEIN + LIVE PREVIEW

   PROTEIN TARGETS
   - Maintenance: 1.8 g/kg
   - Build muscle: 2.0 g/kg
   - Weight loss: 2.2 g/kg

   ALSO
   - Live Profile calorie/protein preview
   - Uses latest body-weight check-in
   - Keeps v9.50 activity calculation
   - Saves corrected targets after Profile save
   - Shows goal mismatch note
   - No auth/startup changes
   - No MutationObserver
   - No polling
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "95100";


  const PROFILE_KEY =
    "mana-profile-v67";


  const TARGET_KEY =
    "mana-fuel-v58-targets";


  const WEIGHT_KEY =
    "mana-strength-v947-body-weight";


  const ACTIVITY_ID =
    "manaV950DailyActivity";


  const NOTE_ID =
    "manaV951GoalNote";


  const STYLE_ID =
    "mana-v951-fuel-preview-style";


  /* =========================================
     HELPERS
     ========================================= */

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


  function loadProfile() {

    return safeJson(
      localStorage.getItem(
        PROFILE_KEY
      ) || "{}",
      {}
    );
  }


  function loadTargets() {

    return safeJson(
      localStorage.getItem(
        TARGET_KEY
      ) || "{}",
      {}
    );
  }


  function saveTargets(
    targets
  ) {

    localStorage.setItem(
      TARGET_KEY,
      JSON.stringify(
        targets
      )
    );
  }


  function loadWeights() {

    const entries =
      safeJson(
        localStorage.getItem(
          WEIGHT_KEY
        ) || "[]",
        []
      );


    if (
      !Array.isArray(
        entries
      )
    ) {
      return [];
    }


    return entries
      .filter(
        item =>
          item &&
          Number(
            item.weight
          ) > 0
      )
      .sort(
        (
          a,
          b
        ) =>
          new Date(
            a.date
          ) -
          new Date(
            b.date
          )
      );
  }


  function latestWeight(
    profile
  ) {

    const entries =
      loadWeights();


    if (
      entries.length
    ) {

      return Number(
        entries[
          entries.length - 1
        ].weight
      );
    }


    return Number(
      profile.weight || 0
    );
  }


  function roundTo50(
    value
  ) {

    return (
      Math.round(
        Number(value || 0) /
        50
      ) * 50
    );
  }


  function roundTo5(
    value
  ) {

    return (
      Math.round(
        Number(value || 0) /
        5
      ) * 5
    );
  }


  /* =========================================
     ACTIVITY
     ========================================= */

  function dailyActivityBase(
    value
  ) {

    const map = {

      mostlySeated:
        1.20,

      lightlyActive:
        1.30,

      active:
        1.40,

      veryActive:
        1.50,

      physicalJob:
        1.60

    };


    return (
      map[value] ||
      1.30
    );
  }


  function activityMultiplier(
    profile
  ) {

    const base =
      dailyActivityBase(
        profile.dailyActivity
      );


    const days =
      Math.max(
        0,
        Math.min(
          7,
          Number(
            profile.days || 0
          )
        )
      );


    return Math.min(
      1.90,
      base +
      (
        days *
        0.05
      )
    );
  }


  /* =========================================
     TARGET ENGINE
     ========================================= */

  function calculateTargets(
    profile
  ) {

    const age =
      Number(
        profile.age || 0
      );


    const height =
      Number(
        profile.height || 0
      );


    const weight =
      latestWeight(
        profile
      );


    const gender =
      profile.gender || "";


    const fuelGoal =
      profile.fuelGoal ||
      "Maintenance";


    if (
      !age ||
      !height ||
      !weight
    ) {

      return null;
    }


    const base =
      (
        10 *
        weight
      ) +
      (
        6.25 *
        height
      ) -
      (
        5 *
        age
      );


    let bmr;


    if (
      gender ===
      "Male"
    ) {

      bmr =
        base + 5;

    } else if (
      gender ===
      "Female"
    ) {

      bmr =
        base - 161;

    } else {

      bmr =
        base - 78;
    }


    const activity =
      activityMultiplier(
        profile
      );


    const maintenance =
      bmr *
      activity;


    let calories =
      maintenance;


    let proteinPerKg =
      1.8;


    if (
      fuelGoal ===
      "Weight loss"
    ) {

      calories =
        maintenance *
        0.85;


      proteinPerKg =
        2.2;
    }


    if (
      fuelGoal ===
      "Build muscle"
    ) {

      calories =
        maintenance *
        1.08;


      proteinPerKg =
        2.0;
    }


    if (
      fuelGoal ===
      "Maintenance"
    ) {

      calories =
        maintenance;


      proteinPerKg =
        1.8;
    }


    const protein =
      roundTo5(
        weight *
        proteinPerKg
      );


    const water =
      Math.round(
        weight *
        35 /
        100
      ) * 100;


    return {

      calories:
        roundTo50(
          calories
        ),

      protein,

      water,

      carbs:0,

      fat:0,

      calculationVersion:
        BUILD,

      calculationSource:
        "profile",

      calculationWeight:
        Number(
          weight.toFixed(
            1
          )
        ),

      calculationActivity:
        profile.dailyActivity ||
        "lightlyActive",

      calculationTrainingDays:
        Number(
          profile.days || 0
        ),

      calculationGoal:
        fuelGoal,

      proteinPerKg,

      calculatedAt:
        new Date()
          .toISOString()

    };
  }


  /* =========================================
     READ LIVE PROFILE
     ========================================= */

  function fieldValue(
    id
  ) {

    return document
      .getElementById(
        id
      )
      ?.value;
  }


  function liveProfile() {

    const saved =
      loadProfile();


    return {

      ...saved,

      age:
        Number(
          fieldValue(
            "manaProfileAge"
          ) ||
          saved.age ||
          0
        ),

      height:
        Number(
          fieldValue(
            "manaProfileHeight"
          ) ||
          saved.height ||
          0
        ),

      weight:
        Number(
          fieldValue(
            "manaProfileWeight"
          ) ||
          saved.weight ||
          0
        ),

      gender:
        fieldValue(
          "manaProfileGender"
        ) ||
        saved.gender ||
        "",

      goal:
        fieldValue(
          "manaProfileGoal"
        ) ||
        saved.goal ||
        "",

      days:
        fieldValue(
          "manaProfileDays"
        ) ||
        saved.days ||
        "",

      fuelGoal:
        fieldValue(
          "manaProfileFuelGoal"
        ) ||
        saved.fuelGoal ||
        "Maintenance",

      dailyActivity:
        fieldValue(
          ACTIVITY_ID
        ) ||
        saved.dailyActivity ||
        "lightlyActive"

    };
  }


  /* =========================================
     LIVE PREVIEW
     ========================================= */

  function updatePreview() {

    const profile =
      liveProfile();


    const targets =
      calculateTargets(
        profile
      );


    if (
      !targets
    ) {
      return;
    }


    const calories =
      document.getElementById(
        "manaProfileFuelCalories"
      );


    const protein =
      document.getElementById(
        "manaProfileFuelProtein"
      );


    if (
      calories
    ) {

      calories.textContent =
        `${targets.calories.toLocaleString()} cal`;
    }


    if (
      protein
    ) {

      protein.textContent =
        `${targets.protein}g`;
    }


    updateGoalNote(
      profile
    );
  }


  /* =========================================
     GOAL NOTE
     ========================================= */

  function updateGoalNote(
    profile
  ) {

    const fuelCard =
      document.querySelector(
        "#manaProfileScreen .mana-profile-fuel"
      );


    if (
      !fuelCard
    ) {
      return;
    }


    let note =
      document.getElementById(
        NOTE_ID
      );


    if (
      !note
    ) {

      note =
        document.createElement(
          "div"
        );


      note.id =
        NOTE_ID;


      note.className =
        "mana-v951-goal-note";


      const existing =
        fuelCard.querySelector(
          ".mana-profile-fuel-note"
        );


      if (
        existing
      ) {

        existing
          .insertAdjacentElement(
            "beforebegin",
            note
          );

      } else {

        fuelCard.appendChild(
          note
        );
      }
    }


    const trainingGoal =
      profile.goal || "";


    const fuelGoal =
      profile.fuelGoal ||
      "Maintenance";


    if (
      trainingGoal ===
        "Build muscle" &&
      fuelGoal !==
        "Build muscle"
    ) {

      note.classList
        .add(
          "show"
        );


      note.innerHTML = `

        <strong>
          Training goal:
          Build muscle
        </strong>

        <span>
          Your Fuel goal is currently
          ${fuelGoal}.
          This is okay if intentional,
          but choose Build muscle if
          the aim is to support muscle gain.
        </span>

      `;

      return;
    }


    note.classList
      .remove(
        "show"
      );


    note.innerHTML =
      "";
  }


  /* =========================================
     SAVE CORRECTED TARGETS
     ========================================= */

  function saveCorrectedTargets() {

    const profile =
      loadProfile();


    const targets =
      calculateTargets(
        profile
      );


    if (
      !targets
    ) {
      return;
    }


    const existing =
      loadTargets();


    saveTargets({

      ...existing,

      ...targets

    });


    updatePreview();


    if (
      typeof
        window
          .renderManaStrengthFuel ===
      "function"
    ) {

      setTimeout(
        () => {

          window
            .renderManaStrengthFuel();

        },
        80
      );
    }


    if (
      typeof
        window
          .renderManaProgramSummary ===
      "function"
    ) {

      setTimeout(
        () => {

          window
            .renderManaProgramSummary();

        },
        100
      );
    }
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

      .mana-v951-goal-note{
        display:none;

        margin:
          12px
          0;

        padding:
          12px
          13px;

        border:
          1px solid
          #51461f;

        border-radius:
          13px;

        background:
          #151207;

        line-height:
          1.45;
      }


      .mana-v951-goal-note.show{
        display:block;
      }


      .mana-v951-goal-note strong{
        display:block;

        margin-bottom:5px;

        color:#f3d875;

        font-size:11px;
      }


      .mana-v951-goal-note span{
        display:block;

        color:#aaa;

        font-size:10px;
      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     FIELD EVENTS
     ========================================= */

  function wireProfileFields() {

    const ids = [

      "manaProfileAge",

      "manaProfileGender",

      "manaProfileHeight",

      "manaProfileWeight",

      "manaProfileGoal",

      "manaProfileDays",

      "manaProfileFuelGoal",

      ACTIVITY_ID

    ];


    ids.forEach(
      id => {

        const field =
          document.getElementById(
            id
          );


        if (
          !field ||
          field.dataset
            .manaV951 ===
            "1"
        ) {
          return;
        }


        field.dataset
          .manaV951 =
          "1";


        field.addEventListener(
          "change",
          updatePreview
        );


        field.addEventListener(
          "input",
          updatePreview
        );

      }
    );


    updatePreview();
  }


  /* =========================================
     EVENTS
     ========================================= */

  function wireEvents() {

    /*
      Opening Profile.
    */

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "#manaV80ProfileBtn, #manaV80ProfileSetup"
          )
        ) {

          setTimeout(
            wireProfileFields,
            140
          );


          setTimeout(
            wireProfileFields,
            350
          );
        }

      }
    );


    /*
      After v9.50 adds Daily Activity,
      wire our live preview.
    */

    window.addEventListener(
      "mana:profile-synced",
      () => {

        setTimeout(
          wireProfileFields,
          100
        );


        /*
          v9.50 saves first.
          v9.51 then overwrites with
          corrected protein targets.
        */

        setTimeout(
          saveCorrectedTargets,
          140
        );

      }
    );


    /*
      Direct Save safeguard.
    */

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "#manaProfileSave"
          )
        ) {

          setTimeout(
            saveCorrectedTargets,
            180
          );

        }

      }
    );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    injectStyles();

    wireEvents();


    /*
      Safe one-time check only.
    */

    setTimeout(
      wireProfileFields,
      1000
    );
  }


  window.MANA_FUEL_PROTEIN_BUILD =
    BUILD;


  window.calculateManaFuelTargetsV951 =
    calculateTargets;


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
