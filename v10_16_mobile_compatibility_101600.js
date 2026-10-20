/* =========================================
   MANA MOVEMENT TRAINING v10.16.2
   PROFILE ACTIVITY + DESKTOP FUEL FIT
   + MOBILE WORKOUT COMPATIBILITY

   BUILD: 101620

   PURPOSE
   -----------------------------------------
   1. Restore Daily Activity to Profile
   2. Recalculate Fuel targets on Profile save
   3. Fix desktop Fuel illustration fit
   4. Leave phone Fuel completely untouched
   5. Keep compact mobile workout arrows

   IMPORTANT
   -----------------------------------------
   - Does NOT load old Fuel UI
   - Does NOT rebuild Fuel
   - Does NOT alter phone Fuel cards
   ========================================= */

(() => {
  "use strict";


  /* =========================================
     BUILD
     ========================================= */

  const BUILD =
    "101620";


  const STYLE_ID =
    "mana-v10162-compatibility-style";


  const PROFILE_KEY =
    "mana-profile-v67";


  const TARGET_KEY =
    "mana-fuel-v58-targets";


  const WEIGHT_KEY =
    "mana-strength-v947-body-weight";


  const ACTIVITY_WRAP_ID =
    "manaV10162ActivityWrap";


  const ACTIVITY_ID =
    "manaV10162DailyActivity";


  let refreshTimer =
    null;


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
     DAILY ACTIVITY ENGINE
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


    const trainingDays =
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
      Planned training adds a small
      allowance above normal daily activity.
    */

    const trainingAddition =
      trainingDays * 0.05;


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
      latestWeight(
        profile
      );


    const gender =
      profile.gender || "";


    const goal =
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
      Mifflin-St Jeor
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


    if (
      goal ===
      "Weight loss"
    ) {

      calories =
        maintenance *
        0.85;


      proteinPerKg =
        2.0;

    }


    if (
      goal ===
      "Build muscle"
    ) {

      calories =
        maintenance *
        1.08;


      proteinPerKg =
        1.8;

    }


    if (
      goal ===
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

      carbs:
        0,

      fat:
        0,

      calculationVersion:
        BUILD,

      calculationSource:
        "profile",

      calculationWeight:
        Number(
          weight.toFixed(1)
        ),

      calculationActivity:
        profile.dailyActivity ||
        "lightlyActive",

      calculationTrainingDays:
        Number(
          profile.days || 0
        ),

      calculationGoal:
        goal,

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
          activity.toFixed(2)
        ),

      calculatedAt:
        new Date()
          .toISOString()

    };

  }


  /* =========================================
     STYLES
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
         DESKTOP FUEL ONLY

         Phone Fuel remains completely
         untouched.
         ===================================== */

      @media(min-width:601px){

        #manaV1015Fuel
        .m1015-category{

          min-height:
            176px !important;

        }


        #manaV1015Fuel
        .m1015-category img{

          display:
            block !important;

          width:
            100% !important;

          height:
            118px !important;

          object-fit:
            contain !important;

          object-position:
            center center !important;

          background:
            #050505 !important;

          transform:
            none !important;

        }


        #manaV1015Fuel
        .m1015-category-copy{

          min-height:
            56px !important;

          padding:
            8px
            38px
            8px
            11px !important;

        }


        #manaV1015Fuel
        .m1015-category-arrow{

          right:
            11px !important;

          bottom:
            18px !important;

        }

      }


      /* =====================================
         PROFILE — DAILY ACTIVITY
         ===================================== */

      #${ACTIVITY_WRAP_ID}{

        margin-top:
          14px;

      }


      #${ACTIVITY_WRAP_ID}
      label{

        display:
          block;

        margin-bottom:
          7px;

      }


      #${ACTIVITY_WRAP_ID}
      select{

        width:
          100%;

      }


      #${ACTIVITY_WRAP_ID}
      .m10162-activity-help{

        margin-top:
          7px;

        color:
          #777;

        font-size:
          10px;

        line-height:
          1.45;

      }


      /* =====================================
         MOBILE WORKOUT ARROWS
         ===================================== */

      @media(max-width:700px){

        #manaV971BottomNav
        .mana-v971-nav-btn{

          position:
            relative !important;

          display:
            grid !important;

          place-items:
            center !important;

          min-height:
            62px !important;

          height:
            62px !important;

          padding:
            0 !important;

          margin:
            0 !important;

          overflow:
            hidden !important;

          font-size:
            0 !important;

          line-height:
            1 !important;

          text-indent:
            0 !important;

          color:
            transparent !important;

        }


        #manaV971Previous::before{

          content:
            "←";

          color:
            #f3d875;

          font-size:
            37px;

          font-weight:
            800;

          line-height:
            1;

        }


        #manaV971Next::before{

          content:
            "→";

          color:
            #f3d875;

          font-size:
            37px;

          font-weight:
            800;

          line-height:
            1;

        }


        #manaV971BottomNav
        .mana-v971-nav-btn:disabled::before{

          color:
            #555;

        }

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


    const existing =
      document.getElementById(
        ACTIVITY_WRAP_ID
      );


    if (
      existing
    ) {

      populateActivity();

      return;

    }


    const fuelCard =
      profileScreen.querySelector(
        ".mana-profile-fuel"
      );


    const targetGrid =
      fuelCard
        ?.querySelector(
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
        class="m10162-activity-help"
      >
        Think about work, walking and
        normal movement outside your
        planned workouts.
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
     SAVE DAILY ACTIVITY
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
     UPDATE PROFILE TARGET PREVIEW
     ========================================= */

  function updateProfilePreview(
    targets
  ) {

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

  }


  /* =========================================
     RECALCULATE TARGETS
     ========================================= */

  function recalculateTargets() {

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


    updateProfilePreview(
      targets
    );


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

  }


  /* =========================================
     LIVE ACTIVITY PREVIEW
     ========================================= */

  function previewActivity() {

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


    const targets =
      calculateTargets(
        profile
      );


    updateProfilePreview(
      targets
    );

  }


  /* =========================================
     WORKOUT ARROWS
     ========================================= */

  function restoreWorkoutArrows() {

    document
      .getElementById(
        "manaV971Previous"
      )
      ?.setAttribute(
        "aria-label",
        "Previous exercise"
      );


    document
      .getElementById(
        "manaV971Next"
      )
      ?.setAttribute(
        "aria-label",
        "Next exercise"
      );

  }


  /* =========================================
     REFRESH
     ========================================= */

  function refresh() {

    installStyles();

    addActivityField();

    restoreWorkoutArrows();

  }


  function scheduleRefresh() {

    clearTimeout(
      refreshTimer
    );


    refreshTimer =
      setTimeout(
        refresh,
        20
      );


    [
      100,
      250,
      500,
      900
    ]
      .forEach(
        delay => {

          setTimeout(
            refresh,
            delay
          );

        }
      );

  }


  /* =========================================
     CLICK EVENTS
     ========================================= */

  function bindClicks() {

    /*
      PROFILE OPENING

      Any Profile button can trigger this.
    */

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            [
              "#manaV989ProfileButton",
              "#manaV80ProfileBtn",
              "#manaV80ProfileSetup",
              "[data-page='profile']"
            ].join(",")
          )
        ) {

          [
            40,
            120,
            300
          ]
            .forEach(
              delay => {

                setTimeout(
                  addActivityField,
                  delay
                );

              }
            );

        }

      },
      true
    );


    /*
      PROFILE SAVE

      Save Daily Activity BEFORE the
      master profile save runs.
    */

    document.addEventListener(
      "click",
      event => {

        if (
          !event.target.closest(
            "#manaProfileSave"
          )
        ) {

          return;

        }


        saveActivityIntoProfile();


        setTimeout(
          recalculateTargets,
          80
        );

      },
      true
    );


    /*
      WORKOUT / PROGRAM REBUILDS
    */

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            [
              "#manaV83Tabs .mana-v83-tab",
              ".mana-v85-start",
              "[data-v85-day]",
              "#manaV971Previous",
              "#manaV971Next",
              "[data-v971-index]",
              ".mana-v970-action"
            ].join(",")
          )
        ) {

          scheduleRefresh();

        }

      },
      true
    );

  }


  /* =========================================
     CHANGE EVENTS
     ========================================= */

  function bindChanges() {

    document.addEventListener(
      "change",
      event => {

        if (
          event.target.id ===
          ACTIVITY_ID
        ) {

          previewActivity();

        }

      }
    );

  }


  /* =========================================
     APP EVENTS
     ========================================= */

  function bindEvents() {

    window.addEventListener(
      "mana:profile-synced",
      () => {

        setTimeout(
          addActivityField,
          80
        );

      }
    );


    [
      "mana:program-tab-change",
      "mana:workout-progress-change",
      "mana:workout-feedback-saved"
    ]
      .forEach(
        eventName => {

          window.addEventListener(
            eventName,
            scheduleRefresh
          );

        }
      );


    window.addEventListener(
      "pageshow",
      scheduleRefresh
    );


    window.addEventListener(
      "focus",
      scheduleRefresh
    );

  }


  /* =========================================
     PUBLIC API
     ========================================= */

  function expose() {

    window
      .refreshManaCompatibility =
      scheduleRefresh;


    window
      .refreshManaProfileActivity =
      addActivityField;


    window
      .MANA_COMPATIBILITY_BUILD =
      BUILD;

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    expose();

    bindClicks();

    bindChanges();

    bindEvents();

    scheduleRefresh();


    console.log(
      "Mana compatibility",
      BUILD
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
