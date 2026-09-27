/* =========================================
   MANA MOVEMENT TRAINING v9.50.0
   FUEL TARGET ENGINE 2.0

   - Adds Daily Activity to Profile
   - Uses latest Body Weight check-in when available
   - Uses Mifflin-St Jeor starting estimate
   - Combines daily activity + training frequency
   - Goal-specific calorie adjustment
   - Goal-specific protein target
   - Recalculates ONLY when Profile is saved
   - Manual Fuel target edits remain possible
   - Adds "starting target" note in Fuel

   IMPORTANT
   - No MutationObserver
   - No polling
   - No auth changes
   - No startup/session changes
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "95000";


  const PROFILE_KEY =
    "mana-profile-v67";


  const TARGET_KEY =
    "mana-fuel-v58-targets";


  const WEIGHT_KEY =
    "mana-strength-v947-body-weight";


  const STYLE_ID =
    "mana-v950-fuel-engine-style";


  const ACTIVITY_WRAP_ID =
    "manaV950ActivityWrap";


  const ACTIVITY_ID =
    "manaV950DailyActivity";


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


  function saveProfile(
    profile
  ) {

    localStorage.setItem(
      PROFILE_KEY,
      JSON.stringify(
        profile
      )
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


  function latestBodyWeight(
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
     ACTIVITY ENGINE
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


    /*
      Structured training adds a
      conservative activity allowance.

      Example:
      Mostly seated + 3 workouts
      = 1.20 + 0.15
      = 1.35
    */

    const trainingAddition =
      days * 0.05;


    return Math.min(
      1.90,
      base +
      trainingAddition
    );
  }


  /* =========================================
     TARGET CALCULATION
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
      latestBodyWeight(
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


    /*
      Mifflin-St Jeor equation
    */

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

      /*
        Neutral midpoint if no
        sex-specific equation selected.
      */

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
      1.6;


    /*
      WEIGHT LOSS

      15% starting deficit.
      Higher protein supports
      muscle retention.
    */

    if (
      fuelGoal ===
      "Weight loss"
    ) {

      calories =
        maintenance *
        0.85;


      proteinPerKg =
        2.0;
    }


    /*
      BUILD MUSCLE

      Small controlled surplus.
    */

    if (
      fuelGoal ===
      "Build muscle"
    ) {

      calories =
        maintenance *
        1.08;


      proteinPerKg =
        1.8;
    }


    /*
      MAINTENANCE

      No calorie adjustment.
    */

    if (
      fuelGoal ===
      "Maintenance"
    ) {

      calories =
        maintenance;


      proteinPerKg =
        1.6;
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

      calculationBmr:
        Math.round(
          bmr
        ),

      calculationMaintenance:
        roundTo50(
          maintenance
        ),

      calculationActivityMultiplier:
        Number(
          activity.toFixed(
            2
          )
        ),

      calculatedAt:
        new Date()
          .toISOString()

    };
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

      #${ACTIVITY_WRAP_ID}{
        margin-top:14px;
      }


      #${ACTIVITY_WRAP_ID}
      .mana-v950-help{
        margin-top:-6px;

        color:#777;

        font-size:10px;

        line-height:1.45;
      }


      .mana-v950-fuel-note{
        margin:
          10px
          0
          0;

        padding:
          11px
          13px;

        border:
          1px solid
          #40381b;

        border-radius:
          13px;

        background:
          #11100b;

        color:
          #999;

        font-size:
          10px;

        line-height:
          1.5;
      }


      .mana-v950-fuel-note strong{
        color:#f3d875;
      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     PROFILE DAILY ACTIVITY FIELD
     ========================================= */

  function addActivityField() {

    const profileScreen =
      document.getElementById(
        "manaProfileScreen"
      );


    if (
      !profileScreen
    ) {
      return;
    }


    if (
      document.getElementById(
        ACTIVITY_WRAP_ID
      )
    ) {

      populateActivity();

      return;
    }


    const fuelCard =
      profileScreen.querySelector(
        ".mana-profile-fuel"
      );


    const targetGrid =
      fuelCard?.querySelector(
        ".mana-profile-fuel-targets"
      );


    if (
      !fuelCard ||
      !targetGrid
    ) {
      return;
    }


    const wrapper =
      document.createElement(
        "div"
      );


    wrapper.id =
      ACTIVITY_WRAP_ID;


    wrapper.className =
      "mana-profile-field";


    wrapper.innerHTML = `

      <label>
        Daily activity
      </label>

      <select
        id="${ACTIVITY_ID}"
      >

        <option value="">
          Select daily activity
        </option>

        <option value="mostlySeated">
          Mostly seated
        </option>

        <option value="lightlyActive">
          Lightly active
        </option>

        <option value="active">
          Active day-to-day
        </option>

        <option value="veryActive">
          Very active
        </option>

        <option value="physicalJob">
          Physical job / highly active
        </option>

      </select>

      <div
        class="mana-v950-help"
      >
        Think about work, walking and normal
        movement outside your planned workouts.
      </div>

    `;


    targetGrid
      .insertAdjacentElement(
        "beforebegin",
        wrapper
      );


    populateActivity();
  }


  function populateActivity() {

    const field =
      document.getElementById(
        ACTIVITY_ID
      );


    if (
      !field
    ) {
      return;
    }


    const profile =
      loadProfile();


    field.value =
      profile.dailyActivity ||
      "";
  }


  /* =========================================
     SAVE PROFILE ACTIVITY
     ========================================= */

  function saveActivityIntoProfile() {

    const field =
      document.getElementById(
        ACTIVITY_ID
      );


    if (
      !field
    ) {
      return;
    }


    const profile =
      loadProfile();


    profile.dailyActivity =
      field.value ||
      "";


    saveProfile(
      profile
    );
  }


  /* =========================================
     RECALCULATE AFTER PROFILE SAVE
     ========================================= */

  function recalculateAfterProfileSave() {

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


    /*
      Update profile preview.
    */

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


    /*
      Refresh Fuel only if available.
    */

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


    /*
      Refresh Overview program summary.
    */

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
     FUEL NOTE
     ========================================= */

  function addFuelNote() {

    const root =
      document.querySelector(
        "#manaV83Content .mana-v897-root"
      );


    if (
      !root
    ) {
      return;
    }


    if (
      root.querySelector(
        ".mana-v950-fuel-note"
      )
    ) {
      return;
    }


    const progress =
      root.querySelector(
        ".mana-v897-progress"
      );


    if (
      !progress
    ) {
      return;
    }


    const targets =
      loadTargets();


    const note =
      document.createElement(
        "div"
      );


    note.className =
      "mana-v950-fuel-note";


    note.innerHTML = `

      <strong>
        Starting target
      </strong>

      — use this as your daily guide.
      Review body-weight trend, training,
      recovery and hunger over time and
      adjust when needed.

      ${
        targets.calculationWeight
          ? `<br><br>
             Calculated from
             ${Number(
               targets.calculationWeight
             ).toFixed(1)} kg body weight.`
          : ""
      }

    `;


    progress
      .insertAdjacentElement(
        "afterend",
        note
      );
  }


  /* =========================================
     EVENTS
     ========================================= */

  function wireEvents() {

    /*
      When Profile is opened,
      add the activity selector.
    */

    document.addEventListener(
      "click",
      event => {

        const profileTrigger =
          event.target.closest(
            "#manaV80ProfileBtn, #manaV80ProfileSetup"
          );


        if (
          profileTrigger
        ) {

          setTimeout(
            addActivityField,
            100
          );


          setTimeout(
            addActivityField,
            300
          );

        }

      }
    );


    /*
      Profile SAVE.

      Capture phase saves daily activity
      before the original profile save
      handler reads the existing profile.

      Then we wait briefly and replace
      Fuel targets with v9.50 calculation.
    */

    document.addEventListener(
      "click",
      event => {

        const saveButton =
          event.target.closest(
            "#manaProfileSave"
          );


        if (
          !saveButton
        ) {
          return;
        }


        saveActivityIntoProfile();


        setTimeout(
          recalculateAfterProfileSave,
          60
        );

      },
      true
    );


    /*
      Fuel tab view.
    */

    document.addEventListener(
      "click",
      event => {

        const fuelTab =
          event.target.closest(
            '#manaV83Tabs [data-v83-tab="fuel"]'
          );


        if (
          fuelTab
        ) {

          setTimeout(
            addFuelNote,
            150
          );


          setTimeout(
            addFuelNote,
            350
          );

        }

      }
    );


    window.addEventListener(
      "mana:program-tab-change",
      () => {

        setTimeout(
          addFuelNote,
          140
        );

      }
    );


    /*
      Existing Profile save event.
    */

    window.addEventListener(
      "mana:profile-synced",
      () => {

        setTimeout(
          addActivityField,
          80
        );

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
      One safe delayed Profile check.
      No permanent loop.
    */

    setTimeout(
      addActivityField,
      800
    );


    /*
      One safe delayed Fuel note check.
    */

    setTimeout(
      addFuelNote,
      1000
    );
  }


  window.MANA_FUEL_TARGET_ENGINE_BUILD =
    BUILD;


  window.calculateManaFuelTargets =
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
