/* =========================================
   MANA MOVEMENT TRAINING v10.16.3
   PROFILE ACTIVITY + DESKTOP FUEL FIT
   + PREMIUM MOBILE WORKOUT SCALE

   BUILD: 101630

   PURPOSE
   -----------------------------------------
   1. Keep Daily Activity in Profile
   2. Recalculate Fuel targets on Profile save
   3. Slightly enlarge desktop Fuel artwork
   4. Leave phone Fuel completely untouched
   5. Make phone exercise illustration larger
   6. Make Previous / Next compact + centred

   IMPORTANT
   -----------------------------------------
   - Does NOT load old Fuel UI
   - Does NOT rebuild Fuel
   - Does NOT alter phone Fuel cards
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "101630";


  const STYLE_ID =
    "mana-v10163-compatibility-style";


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

         Phone Fuel remains untouched.
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
            scale(1.13) !important;

          transform-origin:
            center center !important;

        }


        #manaV1015Fuel
        .m1015-category-copy{

          position:
            relative !important;

          z-index:
            2 !important;

          min-height:
            56px !important;

          padding:
            8px
            38px
            8px
            11px !important;

          background:
            #080808 !important;

        }


        #manaV1015Fuel
        .m1015-category-arrow{

          z-index:
            3 !important;

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
         PHONE — LARGER EXERCISE VISUAL

         v10.12 previously:
         165px / 150px / 135px

         v10.16.3:
         180px / 170px / 150px
         ===================================== */

      @media(max-width:600px){

        #manaV64Exercises
        .m10111-target{

          grid-template-columns:
            180px
            minmax(0,1fr)
            !important;

          gap:
            9px
            !important;

          padding:
            8px
            !important;

          margin:
            8px
            0
            10px
            !important;

          align-items:
            center
            !important;

        }


        #manaV64Exercises
        .m10111-image{

          width:
            180px
            !important;

          height:
            180px
            !important;

          min-width:
            180px
            !important;

          min-height:
            180px
            !important;

          border-radius:
            17px
            !important;

        }


        #manaV64Exercises
        .m10111-image img{

          width:
            100%
            !important;

          height:
            100%
            !important;

          object-fit:
            cover
            !important;

          border-radius:
            16px
            !important;

        }


        #manaV64Exercises
        .m10111-copy{

          min-width:
            0
            !important;

          padding-right:
            0
            !important;

        }


        #manaV64Exercises
        .m10111-target-name{

          font-size:
            14px
            !important;

          line-height:
            1.12
            !important;

        }


        #manaV64Exercises
        .m10111-kicker{

          font-size:
            7px
            !important;

        }


        #manaV64Exercises
        .m10111-note{

          font-size:
            8px
            !important;

          line-height:
            1.25
            !important;

        }

      }


      @media(max-width:420px){

        #manaV64Exercises
        .m10111-target{

          grid-template-columns:
            170px
            minmax(0,1fr)
            !important;

          gap:
            8px
            !important;

          padding:
            7px
            !important;

        }


        #manaV64Exercises
        .m10111-image{

          width:
            170px
            !important;

          height:
            170px
            !important;

          min-width:
            170px
            !important;

          min-height:
            170px
            !important;

        }

      }


      @media(max-width:360px){

        #manaV64Exercises
        .m10111-target{

          grid-template-columns:
            150px
            minmax(0,1fr)
            !important;

          gap:
            7px
            !important;

        }


        #manaV64Exercises
        .m10111-image{

          width:
            150px
            !important;

          height:
            150px
            !important;

          min-width:
            150px
            !important;

          min-height:
            150px
            !important;

        }

      }


      /* =====================================
         COMPACT CENTRED WORKOUT NAVIGATION
         ===================================== */

      @media(max-width:700px){

        #manaV971BottomNav{

          display:
            grid !important;

          grid-template-columns:
            46px
            46px !important;

          justify-content:
            center !important;

          align-items:
            center !important;

          gap:
            14px !important;

          width:
            max-content !important;

          max-width:
            100% !important;

          margin:
            6px
            auto
            2px !important;

        }


        #manaV971BottomNav
        .mana-v971-nav-btn{

          position:
            relative !important;

          display:
            grid !important;

          place-items:
            center !important;

          width:
            46px !important;

          min-width:
            46px !important;

          max-width:
            46px !important;

          min-height:
            44px !important;

          height:
            44px !important;

          padding:
            0 !important;

          margin:
            0 !important;

          border-radius:
            12px !important;

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

          display:
            block;

          color:
            #f3d875;

          font-size:
            27px;

          font-weight:
            800;

          line-height:
            1;

        }


        #manaV971Next::before{

          content:
            "→";

          display:
            block;

          color:
            #f3d875;

          font-size:
            27px;

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
