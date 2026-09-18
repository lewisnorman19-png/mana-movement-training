/* =========================================
   MANA MOVEMENT TRAINING v6.8
   MASTER PROFILE → STRENGTH SYNC
   ========================================= */

(() => {
  "use strict";

  const PROFILE_KEY =
    "mana-profile-v67";

  const PROGRAM_KEY =
    "mana-strength-v62-program";

  let lastProfileSignature =
    "";


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


  function profileReady(
    profile
  ) {
    return Boolean(
      profile?.goal &&
      profile?.days &&
      profile?.experience &&
      profile?.equipment
    );
  }


  function profileSignature(
    profile
  ) {
    return [
      profile.goal || "",
      profile.days || "",
      profile.experience || "",
      profile.equipment || ""
    ].join("|");
  }


  /* =========================================
     SYNC OLD BUILDER CONTROLS
     ========================================= */

  function selectStrengthOption(
    group,
    value
  ) {
    if (!value) return;


    const holder =
      document.querySelector(
        `[data-strength-group="${group}"]`
      );


    if (!holder) return;


    const buttons =
      holder.querySelectorAll(
        ".mana-strength-option"
      );


    buttons.forEach(
      button => {

        const match =
          String(
            button.dataset.value
          ) ===
          String(
            value
          );


        button.classList.toggle(
          "active",
          match
        );

      }
    );
  }


  function syncStrengthOptions() {
    const profile =
      loadProfile();


    selectStrengthOption(
      "goal",
      profile.goal
    );


    selectStrengthOption(
      "days",
      profile.days
    );


    selectStrengthOption(
      "experience",
      profile.experience
    );


    selectStrengthOption(
      "equipment",
      profile.equipment
    );
  }


  /* =========================================
     REBUILD STRENGTH PROGRAM
     ========================================= */

  function rebuildStrengthProgram(
    force = false
  ) {
    const profile =
      loadProfile();


    if (
      !profileReady(
        profile
      )
    ) {
      return;
    }


    const signature =
      profileSignature(
        profile
      );


    if (
      !force &&
      signature ===
        lastProfileSignature
    ) {
      return;
    }


    syncStrengthOptions();


    const buildButton =
      document.getElementById(
        "manaStrengthBuild"
      );


    if (!buildButton) {
      return;
    }


    /*
      v6.2 already owns the actual
      program generator.

      By selecting the Profile values
      first and then triggering its
      Build button, Profile remains
      the single source of truth.
    */

    buildButton.click();


    lastProfileSignature =
      signature;


    /*
      Tell the new Mana Strength
      screens to refresh immediately.
    */

    setTimeout(
      () => {

        window.dispatchEvent(
          new CustomEvent(
            "mana:strength-synced"
          )
        );


        if (
          typeof
            window
              .renderManaStrengthShell ===
          "function"
        ) {
          window
            .renderManaStrengthShell();
        }

      },
      50
    );
  }


  /* =========================================
     PROFILE CHANGES
     ========================================= */

  function handleProfileChange() {
    const profile =
      loadProfile();


    syncStrengthOptions();


    if (
      profileReady(
        profile
      )
    ) {
      rebuildStrengthProgram();
    }
  }


  function watchLocalProfile() {
    const profile =
      loadProfile();


    const signature =
      profileSignature(
        profile
      );


    if (
      signature ===
      lastProfileSignature
    ) {
      return;
    }


    handleProfileChange();
  }


  /* =========================================
     PROFILE SAVE BUTTON
     ========================================= */

  function wireProfileSave() {
    const button =
      document.getElementById(
        "manaProfileSave"
      );


    if (!button) return;


    if (
      button.dataset
        .manaStrengthMaster ===
      "1"
    ) {
      return;
    }


    button.dataset
      .manaStrengthMaster =
        "1";


    button.addEventListener(
      "click",
      () => {

        /*
          v6.7 saves Profile first.
          Give it a moment, then
          rebuild Strength from it.
        */

        setTimeout(
          () => {
            rebuildStrengthProgram(
              true
            );
          },
          80
        );

      }
    );
  }


  /* =========================================
     FUEL PROFILE BUTTON
     ========================================= */

  function wireFuelProfileButton() {
    const button =
      document.getElementById(
        "fuelV58UpdateProfile"
      );


    if (!button) return;


    if (
      button.dataset
        .manaMasterProfile ===
      "1"
    ) {
      return;
    }


    button.dataset
      .manaMasterProfile =
        "1";


    button.textContent =
      "Update profile";


    button.onclick =
      event => {

        event.preventDefault();

        event.stopPropagation();


        if (
          typeof
            window
              .openManaProfile ===
          "function"
        ) {
          window
            .openManaProfile();
        }

      };
  }


  /* =========================================
     CLOUD PROFILE SYNC
     ========================================= */

  function watchCloudProfile() {
    window.addEventListener(
      "mana:profile-synced",
      () => {

        /*
          If Tamara changes Profile on
          another device, cloud Profile
          sync lands locally first.

          Rebuild the Strength program
          from the new Profile values.
        */

        setTimeout(
          () => {
            syncStrengthOptions();

            rebuildStrengthProgram(
              true
            );
          },
          100
        );

      }
    );
  }


  /* =========================================
     INITIALISE
     ========================================= */

  function initialiseFromProfile() {
    const profile =
      loadProfile();


    syncStrengthOptions();


    if (
      profileReady(
        profile
      )
    ) {
      rebuildStrengthProgram(
        true
      );
    }
  }


  function init() {

    setTimeout(
      initialiseFromProfile,
      350
    );


    setTimeout(
      initialiseFromProfile,
      1200
    );


    wireProfileSave();

    wireFuelProfileButton();

    watchCloudProfile();


    setInterval(
      () => {

        wireProfileSave();

        wireFuelProfileButton();

        watchLocalProfile();

      },
      700
    );
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
