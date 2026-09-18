/* =========================================
   MANA MOVEMENT TRAINING v9.2
   PROFILE + FUEL SETUP

   TRAINING DAYS → TRAINING SETUP
   ADD WEIGHT LOSS GOAL
   BUILD TARGETS → PROFILE
   ========================================= */

(() => {
  "use strict";


  const PROFILE_KEY =
    "mana-profile-v67";

  const TARGET_KEY =
    "mana-fuel-v58-targets";


  /* =========================================
     HELPERS
     ========================================= */

  function safeJson(
    raw,
    fallback
  ) {
    try {
      return JSON.parse(raw);
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


  /* =========================================
     MOVE TRAINING DAYS
     ========================================= */

  function moveTrainingDays() {
    const days =
      document.getElementById(
        "manaProfileDays"
      );


    const goal =
      document.getElementById(
        "manaProfileGoal"
      );


    if (
      !days ||
      !goal
    ) {
      return;
    }


    const daysField =
      days.closest(
        ".mana-profile-field"
      );


    const trainingCard =
      goal.closest(
        ".mana-profile-card"
      );


    if (
      !daysField ||
      !trainingCard
    ) {
      return;
    }


    /*
      Already moved.
    */

    if (
      daysField.dataset
        .manaMoved ===
      "1"
    ) {
      return;
    }


    /*
      Put Training Days directly
      underneath Goal.
    */

    const goalField =
      goal.closest(
        ".mana-profile-field"
      );


    goalField
      ?.insertAdjacentElement(
        "afterend",
        daysField
      );


    daysField.dataset
      .manaMoved =
        "1";
  }


  /* =========================================
     WEIGHT LOSS GOAL
     ========================================= */

  function addWeightLossGoal() {
    const goal =
      document.getElementById(
        "manaProfileGoal"
      );


    if (!goal) return;


    if (
      [
        ...goal.options
      ].some(
        option =>
          option.value ===
          "Weight loss"
      )
    ) {
      return;
    }


    const option =
      document.createElement(
        "option"
      );


    option.value =
      "Weight loss";


    option.textContent =
      "Weight loss";


    /*
      Put Weight Loss after
      Build Muscle.
    */

    const buildMuscle =
      [
        ...goal.options
      ].find(
        item =>
          item.value ===
          "Build muscle"
      );


    if (
      buildMuscle
        ?.nextSibling
    ) {

      goal.insertBefore(
        option,
        buildMuscle.nextSibling
      );

    } else {

      goal.appendChild(
        option
      );

    }
  }


  /* =========================================
     ADD WEIGHT LOSS TO OLD STRENGTH BUILDER
     ========================================= */

  function addWeightLossStrengthOption() {
    const group =
      document.querySelector(
        '[data-strength-group="goal"]'
      );


    if (!group) return;


    if (
      group.querySelector(
        '[data-value="Weight loss"]'
      )
    ) {
      return;
    }


    const button =
      document.createElement(
        "button"
      );


    button.type =
      "button";


    button.className =
      "mana-strength-option";


    button.dataset.value =
      "Weight loss";


    button.textContent =
      "Weight loss";


    const muscle =
      group.querySelector(
        '[data-value="Build muscle"]'
      );


    muscle
      ?.insertAdjacentElement(
        "afterend",
        button
      );


    /*
      Match the existing builder
      option behaviour.
    */

    button.onclick =
      () => {

        group
          .querySelectorAll(
            ".mana-strength-option"
          )
          .forEach(
            item =>
              item.classList
                .remove(
                  "active"
                )
          );


        button.classList.add(
          "active"
        );
      };
  }


  /* =========================================
     BUILD FUEL TARGETS
     ========================================= */

  function calculateFuelTargets() {
    const profile =
      loadProfile();


    const weight =
      Number(
        profile.weight ||
        0
      );


    if (!weight) {
      return null;
    }


    let caloriesPerKg =
      30;


    let proteinPerKg =
      1.6;


    switch (
      profile.goal
    ) {

      case "Build muscle":

        caloriesPerKg =
          33;

        proteinPerKg =
          1.8;

        break;


      case "Weight loss":

        /*
          Practical starting estimate.
          Client can still edit targets.
        */

        caloriesPerKg =
          27;

        proteinPerKg =
          1.8;

        break;


      case "Get stronger":

        caloriesPerKg =
          31;

        proteinPerKg =
          1.8;

        break;


      case "General fitness":

        caloriesPerKg =
          30;

        proteinPerKg =
          1.6;

        break;


      case "Return to training":

        caloriesPerKg =
          30;

        proteinPerKg =
          1.6;

        break;
    }


    return {

      calories:
        Math.round(
          weight *
          caloriesPerKg /
          50
        ) * 50,

      protein:
        Math.round(
          weight *
          proteinPerKg
        ),

      water:
        Math.round(
          weight *
          35 /
          100
        ) * 100,

      carbs:0,

      fat:0
    };
  }


  function saveFuelTargets() {
    const targets =
      calculateFuelTargets();


    if (!targets) {
      return;
    }


    localStorage.setItem(
      TARGET_KEY,
      JSON.stringify(
        targets
      )
    );


    if (
      typeof
        window
          .renderManaStrengthFuel ===
      "function"
    ) {

      window
        .renderManaStrengthFuel();

    }
  }


  /* =========================================
     BUILD TARGETS BUTTON
     ========================================= */

  function wireBuildTargetsButton() {
    const button =
      document.getElementById(
        "manaV89BuildTargets"
      );


    if (!button) return;


    if (
      button.dataset
        .manaProfileLink ===
      "1"
    ) {
      return;
    }


    button.dataset
      .manaProfileLink =
        "1";


    /*
      Replace the existing Fuel
      calculation click behaviour.
    */

    button.addEventListener(
      "click",
      event => {

        event.preventDefault();

        event.stopPropagation();

        event.stopImmediatePropagation();


        if (
          typeof
            window
              .openManaProfile ===
          "function"
        ) {

          window
            .openManaProfile();

        }

      },
      true
    );
  }


  /* =========================================
     PROFILE SAVE
     ========================================= */

  function wireProfileSave() {
    const save =
      document.getElementById(
        "manaProfileSave"
      );


    if (!save) return;


    if (
      save.dataset
        .manaFuelWired ===
      "1"
    ) {
      return;
    }


    save.dataset
      .manaFuelWired =
        "1";


    save.addEventListener(
      "click",
      () => {

        /*
          v6.7 saves first.
          Build Fuel targets just after.
        */

        setTimeout(
          () => {

            saveFuelTargets();

          },
          80
        );

      }
    );
  }


  /* =========================================
     APPLY PROFILE CHANGES
     ========================================= */

  function updateProfile() {
    moveTrainingDays();

    addWeightLossGoal();

    addWeightLossStrengthOption();

    wireProfileSave();

    wireBuildTargetsButton();
  }


  /* =========================================
     OBSERVE DYNAMIC SCREENS
     ========================================= */

  function startObserver() {
    let timer = null;


    const observer =
      new MutationObserver(
        () => {

          clearTimeout(
            timer
          );


          timer =
            setTimeout(
              updateProfile,
              80
            );

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


  /* =========================================
     INIT
     ========================================= */

  function init() {

    [
      200,
      700,
      1400,
      2400
    ].forEach(
      delay => {

        setTimeout(
          updateProfile,
          delay
        );

      }
    );


    startObserver();
  }


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
