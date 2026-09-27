/* =========================================
   MANA MOVEMENT TRAINING v9.46.0
   FUEL TARGET ACCURACY UPGRADE

   - Adds daily activity to Mana Profile
   - Uses Mifflin-St Jeor as calorie starting point
   - Combines daily activity + training frequency
   - Applies goal-specific calorie adjustment
   - Applies goal-specific protein target
   - Updates Fuel targets after Profile save
   - Keeps targets as practical starting estimates
   - No database changes
   ========================================= */

(() => {
  "use strict";

  const BUILD = "94600";

  const PROFILE_KEY =
    "mana-profile-v67";

  const TARGET_KEY =
    "mana-fuel-v58-targets";

  const STYLE_ID =
    "mana-v946-fuel-target-style";

  const FIELD_ID =
    "manaProfileDailyActivity";

  const WRAP_ID =
    "manaProfileDailyActivityWrap";


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


  function activityBase(
    activity
  ) {
    const map = {
      mostlySeated:1.20,
      lightActive:1.30,
      active:1.40,
      veryActive:1.50,
      physicalJob:1.60
    };

    return (
      map[activity] ||
      null
    );
  }


  function legacyActivity(
    days
  ) {
    const value =
      Number(days || 0);

    if (
      value >= 5
    ) {
      return 1.70;
    }

    if (
      value === 4
    ) {
      return 1.60;
    }

    if (
      value === 3
    ) {
      return 1.50;
    }

    return 1.40;
  }


  function totalActivityMultiplier(
    profile
  ) {
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

    const base =
      activityBase(
        profile.dailyActivity
      );


    /*
      Daily activity reflects normal life
      outside structured training.

      Training frequency adds a conservative
      allowance on top.

      Older profiles without daily activity
      keep their old training-day estimate
      until updated.
    */

    if (
      base === null
    ) {
      return legacyActivity(
        days
      );
    }


    const trainingAddition =
      days * 0.06;


    return Math.min(
      1.90,
      base +
      trainingAddition
    );
  }


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
      Number(
        profile.weight || 0
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
      Mifflin-St Jeor starting estimate.
    */

    const base =
      10 * weight +
      6.25 * height -
      5 * age;


    let bmr;


    if (
      gender === "Male"
    ) {

      bmr =
        base + 5;

    } else if (
      gender === "Female"
    ) {

      bmr =
        base - 161;

    } else {

      /*
        Neutral midpoint when a
        sex-specific equation is not selected.
      */

      bmr =
        base - 78;
    }


    const activity =
      totalActivityMultiplier(
        profile
      );


    let calories =
      bmr * activity;


    let proteinPerKg =
      1.6;


    if (
      fuelGoal ===
      "Weight loss"
    ) {

      calories *=
        0.85;

      proteinPerKg =
        2.0;
    }


    if (
      fuelGoal ===
      "Build muscle"
    ) {

      calories *=
        1.08;

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

      calculation:{
        version:BUILD,

        bmr:
          Math.round(bmr),

        activityMultiplier:
          Number(
            activity.toFixed(2)
          ),

        fuelGoal,

        dailyActivity:
          profile.dailyActivity ||
          "legacy",

        trainingDays:
          Number(
            profile.days || 0
          )
      }
    };
  }


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

      #${WRAP_ID}{
        margin-top:14px;
      }


      #${WRAP_ID}
      .mana-v946-activity-help{
        margin-top:-6px;

        color:#777;

        font-size:10px;

        line-height:1.45;
      }


      .mana-v946-target-note{
        margin-top:10px;

        padding:10px 12px;

        border:
          1px solid
          #3c351b;

        border-radius:12px;

        background:#11100b;

        color:#a6a6a6;

        font-size:10px;

        line-height:1.5;
      }


      .mana-v946-target-note strong{
        color:#f3d875;
      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  function ensureActivityField() {
    const screen =
      document.getElementById(
        "manaProfileScreen"
      );


    if (
      !screen
    ) {
      return false;
    }


    if (
      document.getElementById(
        WRAP_ID
      )
    ) {
      return true;
    }


    const fuelCard =
      screen.querySelector(
        ".mana-profile-fuel"
      );


    const targets =
      fuelCard?.querySelector(
        ".mana-profile-fuel-targets"
      );


    if (
      !fuelCard ||
      !targets
    ) {
      return false;
    }


    const wrap =
      document.createElement(
        "div"
      );


    wrap.id =
      WRAP_ID;


    wrap.className =
      "mana-profile-field";


    wrap.innerHTML = `

      <label>
        Daily activity
      </label>

      <select
        id="${FIELD_ID}"
      >

        <option value="">
          Select daily activity
        </option>

        <option value="mostlySeated">
          Mostly seated
        </option>

        <option value="lightActive">
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
        class="mana-v946-activity-help"
      >
        Think about work, walking and normal
        movement outside your planned workouts.
      </div>

    `;


    targets.insertAdjacentElement(
      "beforebegin",
      wrap
    );


    const profile =
      loadProfile();


    const field =
      document.getElementById(
        FIELD_ID
      );


    if (
      field
    ) {

      field.value =
        profile.dailyActivity ||
        "";


      field.addEventListener(
        "change",
        () => {

          persistActivitySelection();

          setTimeout(
            updatePreview,
            0
          );

        }
      );
    }


    ensureEstimateNote();


    return true;
  }


  function ensureEstimateNote() {
    const fuelCard =
      document.querySelector(
        "#manaProfileScreen .mana-profile-fuel"
      );


    if (
      !fuelCard ||
      fuelCard.querySelector(
        ".mana-v946-target-note"
      )
    ) {
      return;
    }


    const existing =
      fuelCard.querySelector(
        ".mana-profile-fuel-note"
      );


    if (
      !existing
    ) {
      return;
    }


    existing.textContent =
      "Starting targets based on your body details, daily activity, training frequency and Fuel goal. Review progress and adjust when needed.";


    const note =
      document.createElement(
        "div"
      );


    note.className =
      "mana-v946-target-note";


    note.innerHTML =
      "<strong>Best accuracy:</strong> keep your body weight, daily activity and training days up to date.";


    existing.insertAdjacentElement(
      "afterend",
      note
    );
  }


  function persistActivitySelection() {
    const field =
      document.getElementById(
        FIELD_ID
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


  function liveProfile() {
    const saved =
      loadProfile();


    const value =
      id =>
        document
          .getElementById(id)
          ?.value;


    return {
      ...saved,

      age:
        Number(
          value(
            "manaProfileAge"
          ) ||
          saved.age ||
          0
        ),

      gender:
        value(
          "manaProfileGender"
        ) ||
        saved.gender ||
        "",

      height:
        Number(
          value(
            "manaProfileHeight"
          ) ||
          saved.height ||
          0
        ),

      weight:
        Number(
          value(
            "manaProfileWeight"
          ) ||
          saved.weight ||
          0
        ),

      days:
        value(
          "manaProfileDays"
        ) ||
        saved.days ||
        "",

      fuelGoal:
        value(
          "manaProfileFuelGoal"
        ) ||
        saved.fuelGoal ||
        "Maintenance",

      dailyActivity:
        value(
          FIELD_ID
        ) ||
        saved.dailyActivity ||
        ""
    };
  }


  function updatePreview() {
    const targets =
      calculateTargets(
        liveProfile()
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
  }


  function saveAccurateTargets() {
    persistActivitySelection();


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
        () =>
          window
            .renderManaStrengthFuel(),
        90
      );

    }
  }


  function wireProfile() {
    if (
      !ensureActivityField()
    ) {
      return;
    }


    const save =
      document.getElementById(
        "manaProfileSave"
      );


    if (
      save &&
      save.dataset
        .v946Ready !==
        "1"
    ) {

      save.dataset
        .v946Ready =
        "1";


      /*
        Save daily activity before
        the original Profile handler runs.
      */

      save.addEventListener(
        "click",
        persistActivitySelection,
        true
      );


      /*
        Original Profile save runs first.
        Then replace Fuel targets with
        the upgraded calculation.
      */

      save.addEventListener(
        "click",
        () => {

          setTimeout(
            saveAccurateTargets,
            25
          );

        }
      );
    }


    [
      "manaProfileAge",
      "manaProfileGender",
      "manaProfileHeight",
      "manaProfileWeight",
      "manaProfileDays",
      "manaProfileFuelGoal",
      FIELD_ID
    ].forEach(
      id => {

        const field =
          document.getElementById(
            id
          );


        if (
          !field ||
          field.dataset
            .v946Preview ===
            "1"
        ) {
          return;
        }


        field.dataset
          .v946Preview =
          "1";


        field.addEventListener(
          "change",
          () => {

            setTimeout(
              updatePreview,
              0
            );

          }
        );

      }
    );


    updatePreview();
  }


  function watchProfile() {
    const observer =
      new MutationObserver(
        () => {

          if (
            document.getElementById(
              "manaProfileScreen"
            )
          ) {

            wireProfile();

          }

        }
      );


    observer.observe(
      document.body,
      {
        childList:true,
        subtree:true
      }
    );
  }


  function init() {
    injectStyles();

    wireProfile();

    watchProfile();


    window.addEventListener(
      "mana:profile-synced",
      () => {

        setTimeout(
          () => {

            wireProfile();

            updatePreview();

          },
          40
        );

      }
    );


    window.addEventListener(
      "focus",
      () => {

        setTimeout(
          wireProfile,
          80
        );

      }
    );
  }


  window.MANA_FUEL_TARGET_BUILD =
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
