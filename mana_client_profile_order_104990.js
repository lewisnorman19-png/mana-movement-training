
/* ==========================================================
   MANA MOVEMENT TRAINING
   CLIENT PROFILE — STABLE PERSONAL DETAILS
   BUILD 105022

   COMPLETE REPLACEMENT:
   mana_client_profile_order_104990.js

   FIXES:
   - Correct photo-card lookup that blocked build 105021
   - One Personal Details card
   - Photo at top
   - First Name / Last Name
   - Gender
   - DOB / Age
   - Height / Weight
   - Email / Contact Number
   - Other contact information
   - Training Goals
   - Nutrition Goals
   - Progression Photos
   - Phone and laptop use same field order
   - No movement while a field is being edited

   PRESERVES:
   - Original client profile input IDs
   - Cloud and local profile saving
   - Weight/Strength Progress synchronisation
   - Fuel and recovery calculations
   - Camera and progress photographs
   - Coach Hub and Chat

   NO DATABASE WRITES OR DELETIONS.
   ========================================================== */

(() => {
  "use strict";

  const BUILD = "105022";
  const FLAG = "MANA_PROFILE_LAYOUT_105022";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const SCREEN = "manaProfileScreen";
  const ROOT = "manaExtendedClient104901";
  const STYLE = "manaProfileLayoutStyle105022";

  const $ = id => document.getElementById(id);

  let complete = false;
  let jobs = [];
  let observer = null;
  let observedScreen = null;
  let wasOpen = false;

  /* =====================================================
     STYLES
     ===================================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      #${SCREEN},
      #${SCREEN} *,
      #${SCREEN} *::before,
      #${SCREEN} *::after {
        box-sizing: border-box !important;
      }

      #${SCREEN} .mana-profile-shell {
        width: min(680px,100%) !important;
        max-width: 100% !important;
        margin: 0 auto !important;
      }

      #${SCREEN} .mana-profile-card,
      #${SCREEN} #${ROOT} > .me-card {
        background: #15171B !important;
        border: 1px solid #4B535E !important;
        border-left: 3px solid #FF7927 !important;
        border-radius: 16px !important;
        margin: 12px 0 !important;
        padding: 15px !important;
        box-shadow: none !important;
      }

      #${SCREEN} .mana-profile-card > h3 {
        color: #FFFFFF !important;
        font-size: 19px !important;
        font-weight: 900 !important;
        margin: 0 0 15px !important;
        padding-bottom: 12px !important;
        border-bottom: 2px solid #FF7927 !important;
      }

      /* Merge contact section into Personal Details */

      #${SCREEN} .mana-personal-merged
      > .me-card {
        width: 100% !important;
        min-width: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        border: none !important;
        background: transparent !important;
        box-shadow: none !important;
      }

      #${SCREEN} .mana-personal-merged
      > .me-card > h3,
      #${SCREEN} .mana-personal-merged
      > .me-card > .me-kicker {
        display: none !important;
      }

      /* Photo at top */

      #${SCREEN} .mana-personal-merged
      > .me-avatar-row {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
        width: 100% !important;
        min-width: 0 !important;
        margin: 0 0 15px !important;
        padding: 0 0 15px !important;
        border-bottom: 1px solid #39414B !important;
      }

      /* Personal Details field grid */

      #${SCREEN} .mana-personal-merged
      .me-grid {
        display: grid !important;
        grid-template-columns:
          repeat(2,minmax(0,1fr)) !important;
        width: 100% !important;
        min-width: 0 !important;
        gap: 10px !important;
        align-items: start !important;
      }

      #${SCREEN} .mana-personal-merged
      .me-grid > .mana-paired-fields,
      #${SCREEN} .mana-personal-merged
      .me-grid > .mana-section-subheading {
        grid-column: 1 / -1 !important;
      }

      #${SCREEN} .mana-paired-fields {
        display: grid !important;
        grid-template-columns:
          repeat(2,minmax(0,1fr)) !important;
        width: 100% !important;
        min-width: 0 !important;
        gap: 10px !important;
        align-items: start !important;
        margin: 2px 0 10px !important;
      }

      #${SCREEN} .mana-paired-fields > * {
        min-width: 0 !important;
        width: 100% !important;
        margin: 0 !important;
      }

      #${SCREEN} #manaGenderRow105022 {
        grid-template-columns:
          minmax(0,1fr) !important;
      }

      #${SCREEN} #manaDobAgeRow104992 {
        grid-template-columns:
          minmax(0,1fr) minmax(88px,.4fr) !important;
      }

      #${SCREEN} #manaHeightWeightRow105022,
      #${SCREEN} #manaEmailPhoneRow105022 {
        grid-template-columns:
          repeat(2,minmax(0,1fr)) !important;
      }

      /* Standard field styling */

      #${SCREEN} .mana-profile-field,
      #${SCREEN} .me-field {
        width: 100% !important;
        min-width: 0 !important;
      }

      #${SCREEN} .mana-profile-field label,
      #${SCREEN} .me-field label {
        display: block !important;
        margin: 0 0 7px !important;
        min-height: 18px !important;
        color: #C4CAD2 !important;
        font-size: 12px !important;
        font-weight: 750 !important;
        line-height: 1.4 !important;
      }

      #${SCREEN} .mana-profile-field input,
      #${SCREEN} .mana-profile-field select,
      #${SCREEN} .me-field input:not([type=file]),
      #${SCREEN} .me-field select,
      #${SCREEN} .me-field textarea {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        min-height: 46px !important;
        margin: 0 !important;
        padding: 10px 11px !important;
        background: #101215 !important;
        color: #FFFFFF !important;
        border: 1px solid #4B535D !important;
        border-radius: 10px !important;
        font-size: 16px !important;
        line-height: 1.4 !important;
      }

      #${SCREEN} #manaProfileAge {
        color: #FF7927 !important;
        opacity: 1 !important;
      }

      /* Verified account email */

      #${SCREEN} #me-account-email {
        color: #D1D5DB !important;
        -webkit-text-fill-color: #D1D5DB !important;
        background: #171A1F !important;
        opacity: 1 !important;
      }

      /* Mobile-friendly DOB */

      #${SCREEN} #me-dob {
        height: 46px !important;
        min-height: 46px !important;
        padding: 8px !important;
        appearance: auto !important;
        -webkit-appearance: auto !important;
      }

      /* Current weight is now a normal paired field.
         v9.94 continues to use the same weight input. */

      #${SCREEN}
      #manaHeightWeightRow105022
      .mana-v994-weight-field {
        grid-column: auto !important;
        width: 100% !important;
        min-width: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        background: transparent !important;
        border-radius: 0 !important;
      }

      #${SCREEN}
      #manaHeightWeightRow105022
      .mana-v994-weight-field label {
        color: #C4CAD2 !important;
        font-size: 12px !important;
        font-weight: 750 !important;
        letter-spacing: normal !important;
        text-transform: none !important;
      }

      #${SCREEN}
      #manaHeightWeightRow105022
      .mana-v994-weight-note,
      #${SCREEN}
      #manaHeightWeightRow105022
      .mana-v994-weight-saved {
        display: none !important;
      }

      #${SCREEN} .mana-section-subheading {
        grid-column: 1 / -1 !important;
        color: #FF7927 !important;
        font-size: 11px !important;
        font-weight: 900 !important;
        letter-spacing: .08em !important;
        text-transform: uppercase !important;
        margin: 10px 0 4px !important;
        padding-top: 13px !important;
        border-top: 1px solid #39414B !important;
      }

      #${SCREEN} .mana-extra-field-group {
        display: grid !important;
        grid-template-columns:
          minmax(0,1fr) !important;
        gap: 11px !important;
        min-width: 0 !important;
        width: 100% !important;
        margin-top: 12px !important;
      }

      #${SCREEN} input:focus-visible,
      #${SCREEN} select:focus-visible,
      #${SCREEN} textarea:focus-visible {
        outline: 2px solid #FF7927 !important;
        outline-offset: 1px !important;
      }

      #${SCREEN} #manaProfileSave {
        min-height: 55px !important;
        background: #FF7927 !important;
        color: #101215 !important;
        border: none !important;
        border-radius: 12px !important;
        font-weight: 900 !important;
      }

      @media(max-width:600px) {
        #${SCREEN} {
          padding-left: 9px !important;
          padding-right: 9px !important;
        }

        #${SCREEN} .mana-profile-shell {
          width: 100% !important;
        }

        #${SCREEN} .mana-profile-card,
        #${SCREEN} #${ROOT} > .me-card {
          padding: 12px !important;
        }

        #${SCREEN} .mana-paired-fields,
        #${SCREEN} .mana-personal-merged
        .me-grid {
          gap: 8px !important;
        }

        #${SCREEN} #manaDobAgeRow104992 {
          grid-template-columns:
            minmax(0,1fr) 88px !important;
        }

        #${SCREEN}
        #manaHeightWeightRow105022,
        #${SCREEN}
        #manaEmailPhoneRow105022 {
          grid-template-columns:
            repeat(2,minmax(0,1fr)) !important;
        }

        #${SCREEN}
        #manaEmailPhoneRow105022
        #me-account-email {
          font-size: 12px !important;
          padding: 9px 6px !important;
        }

        #${SCREEN} #me-dob {
          padding: 8px 5px !important;
        }

        #${SCREEN} .mana-profile-field input,
        #${SCREEN} .mana-profile-field select,
        #${SCREEN} .me-field input:not([type=file]),
        #${SCREEN} .me-field select {
          font-size: 16px;
          padding: 10px 8px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =====================================================
     ELEMENT HELPERS
     ===================================================== */

  function field(id) {
    return $(id)?.closest(
      ".me-field, .mana-profile-field"
    ) || null;
  }

  function move(node, parent) {
    if (
      node &&
      parent &&
      node.parentElement !== parent
    ) {
      parent.appendChild(node);
    }
  }

  function placeAfter(node, anchor) {
    if (
      node &&
      anchor &&
      node.previousElementSibling !== anchor
    ) {
      anchor.insertAdjacentElement(
        "afterend",
        node
      );
    }
  }

  function group(id,parent) {
    let node = $(id);

    if (!node) {
      node = document.createElement("div");
      node.id = id;
      node.className = "mana-paired-fields";
    }

    move(node,parent);
    return node;
  }

  function profileOpen() {
    return !!$(SCREEN)?.classList.contains("open");
  }

  function editing() {
    const screen = $(SCREEN);
    const active = document.activeElement;

    return Boolean(
      screen &&
      active &&
      screen.contains(active) &&
      active.matches(
        "input:not([type=hidden]),select,textarea"
      )
    );
  }

  /* =====================================================
     NAME SAVE COMPATIBILITY
     ===================================================== */

  function connectNames() {
    const first = $("me-first_name");
    const last = $("me-last_name");
    const full = $("manaProfileName");

    if (!first || !last || !full) return;

    if (first.dataset.manaNames105022) return;
    first.dataset.manaNames105022 = "1";

    const sync = () => {
      const name = [
        first.value.trim(),
        last.value.trim()
      ].filter(Boolean).join(" ");

      if (full.value !== name) {
        full.value = name;
      }
    };

    first.addEventListener("input",sync);
    last.addEventListener("input",sync);
    first.addEventListener("change",sync);
    last.addEventListener("change",sync);
  }

  /* =====================================================
     AGE FROM DATE OF BIRTH
     ===================================================== */

  function updateAge() {
    const dob = $("me-dob");
    const age = $("manaProfileAge");

    if (!dob || !age) return;

    age.readOnly = true;

    const match = dob.value.match(
      /^(\d{4})-(\d{2})-(\d{2})$/
    );

    if (!match) return;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    const birth = new Date(
      year,
      month - 1,
      day
    );

    const today = new Date();

    if (
      birth.getFullYear() !== year ||
      birth.getMonth() !== month - 1 ||
      birth.getDate() !== day ||
      birth > today
    ) return;

    let years = today.getFullYear() - year;

    const birthdayPassed =
      today.getMonth() + 1 > month ||
      (
        today.getMonth() + 1 === month &&
        today.getDate() >= day
      );

    if (!birthdayPassed) years--;

    if (
      years >= 0 &&
      years <= 120 &&
      age.value !== String(years)
    ) {
      age.value = String(years);

      age.dispatchEvent(
        new Event("change",{
          bubbles:true
        })
      );
    }
  }

  function connectAge() {
    const dob = $("me-dob");
    if (!dob || dob.dataset.manaAge105022) return;

    dob.dataset.manaAge105022 = "1";

    dob.addEventListener("input",updateAge);
    dob.addEventListener("change",updateAge);

    updateAge();
  }

  /* =====================================================
     DAILY ACTIVITY COMPATIBILITY
     ===================================================== */

  function normaliseActivity(text) {
    text = String(text || "").toLowerCase();

    if (/very.active|extremely/.test(text))
      return "very_active";

    if (/sedentary|sitting/.test(text))
      return "sedentary";

    if (/moderate/.test(text))
      return "moderate";

    if (/light/.test(text))
      return "light";

    if (/active/.test(text))
      return "active";

    return "";
  }

  function connectActivity() {
    const screen = $(SCREEN);
    const custom = $("manaPremiumActivity104981");

    if (!screen || !custom) return;

    const existing = Array.from(
      screen.querySelectorAll(
        ".mana-profile-field,.me-field"
      )
    ).find(wrapper =>
      wrapper.querySelector("label")
        ?.textContent.trim()
        .toLowerCase() === "daily activity" &&
      wrapper.querySelector("select") !== custom
    )?.querySelector("select");

    if (!existing) return;

    const customWrapper = custom.closest(
      ".mana-premium-activity"
    );

    if (customWrapper) {
      customWrapper.style.display = "none";
    }

    if (existing.dataset.manaActivity105022) return;

    existing.dataset.manaActivity105022 = "1";

    const sync = () => {
      const value = normaliseActivity(
        existing.value + " " +
        (existing.selectedOptions?.[0]
          ?.textContent || "")
      );

      if (value && value !== custom.value) {
        custom.value = value;

        custom.dispatchEvent(
          new Event("change",{
            bubbles:true
          })
        );
      }
    };

    existing.addEventListener("change",sync);
    sync();
  }

  /* =====================================================
     ONE PERMANENT ARRANGEMENT
     ===================================================== */

  function arrange() {
    if (complete || !profileOpen() || editing()) {
      return false;
    }

    const screen = $(SCREEN);

    const shell = screen?.querySelector(
      ".mana-profile-shell"
    );

    const extended = $(ROOT);

    const personal = field(
      "manaProfileName"
    )?.closest(".mana-profile-card");

    const contact = field(
      "me-first_name"
    )?.closest(".me-card");

    const grid = contact?.querySelector(
      ".me-grid"
    );

    const training =
      shell?.querySelector(".mana-profile-training");

    const nutrition =
      shell?.querySelector(".mana-profile-fuel");

    /*
       IMPORTANT 105022 FIX:
       Photo inputs are inside .me-photo-card,
       not .me-field. Use the input itself
       to locate its parent .me-card.
    */

    const photos = $("me-file-baseline-front")
      ?.closest(".me-card");

    const originalGrid =
      $("manaProfileGender")
        ?.closest(".mana-profile-grid");

    const required = [
      "me-first_name",
      "me-last_name",
      "manaProfileGender",
      "me-dob",
      "manaProfileAge",
      "manaProfileHeight",
      "manaProfileWeight",
      "me-account-email",
      "me-phone"
    ];

    if (
      !shell ||
      !extended ||
      !personal ||
      !contact ||
      !grid ||
      !training ||
      !nutrition ||
      !photos ||
      !originalGrid ||
      !required.every(id => field(id))
    ) {
      return false;
    }

    /* Personal Details */

    const title = personal.querySelector("h3");

    if (title) {
      title.textContent = "Personal Details";
    }

    const oldName = field("manaProfileName");

    if (oldName) {
      oldName.style.display = "none";
    }

    personal.classList.add(
      "mana-personal-merged"
    );

    move(contact,personal);

    /* Profile Photo */

    const avatar = $("me-preview-avatar")
      ?.closest(".me-avatar-row");

    if (avatar && title) {
      move(avatar,personal);
      placeAfter(avatar,title);
      placeAfter(contact,avatar);
    }

    /* First Name / Last Name */

    const names = group(
      "manaNameRow104992",
      grid
    );

    move(field("me-first_name"),names);
    move(field("me-last_name"),names);

    if (grid.firstElementChild !== names) {
      grid.insertBefore(names,grid.firstChild);
    }

    /* Gender */

    const genderRow = group(
      "manaGenderRow105022",
      grid
    );

    move(
      field("manaProfileGender"),
      genderRow
    );

    placeAfter(genderRow,names);

    /* DOB / Age */

    const dobAge = group(
      "manaDobAgeRow104992",
      grid
    );

    move(field("me-dob"),dobAge);
    move(field("manaProfileAge"),dobAge);

    placeAfter(dobAge,genderRow);

    /* Height / Weight */

    const measurements = group(
      "manaHeightWeightRow105022",
      grid
    );

    move(
      field("manaProfileHeight"),
      measurements
    );

    move(
      field("manaProfileWeight"),
      measurements
    );

    placeAfter(measurements,dobAge);

    const weightLabel = field(
      "manaProfileWeight"
    )?.querySelector("label");

    if (weightLabel) {
      weightLabel.textContent = "Weight (kg)";
    }

    const heightLabel = field(
      "manaProfileHeight"
    )?.querySelector("label");

    if (heightLabel) {
      heightLabel.textContent = "Height (cm)";
    }

    /* Contact Details heading */

    let contactHeading = $(
      "manaContactHeading104992"
    );

    if (!contactHeading) {
      contactHeading = document.createElement("div");
      contactHeading.id = "manaContactHeading104992";
      contactHeading.className =
        "mana-section-subheading";
    }

    contactHeading.textContent = "Contact Details";

    move(contactHeading,grid);
    placeAfter(contactHeading,measurements);

    /* Email / Contact Number */

    const emailField = field("me-account-email");
    const phoneField = field("me-phone");

    const emailLabel = emailField
      ?.querySelector("label");

    const phoneLabel = phoneField
      ?.querySelector("label");

    if (emailLabel) {
      emailLabel.textContent = "Email Address";
    }

    if (phoneLabel) {
      phoneLabel.textContent = "Contact Number";
    }

    const emailPhone = group(
      "manaEmailPhoneRow105022",
      grid
    );

    move(emailField,emailPhone);
    move(phoneField,emailPhone);

    placeAfter(emailPhone,contactHeading);

    const emailInput = $("me-account-email");

    if (emailInput) {
      emailInput.readOnly = true;
    }

    /* Remove the empty old field grid */

    if (
      originalGrid &&
      !originalGrid.querySelector(
        ".mana-profile-field"
      )
    ) {
      originalGrid.style.display = "none";
    }

    /* Training Goals */

    const trainingTitle =
      training.querySelector("h3");

    if (trainingTitle) {
      trainingTitle.textContent = "Training Goals";
    }

    let trainingExtra =
      $("manaExtraTraining104991");

    if (!trainingExtra) {
      trainingExtra = document.createElement("div");
      trainingExtra.id = "manaExtraTraining104991";
    }

    trainingExtra.className =
      "mana-extra-field-group";

    move(trainingExtra,training);

    [
      "me-target_weight",
      "me-injuries",
      "me-training_preferences"
    ].forEach(id => {
      move(field(id),trainingExtra);
    });

    /* Nutrition Goals */

    const nutritionTitle =
      nutrition.querySelector("h3");

    if (nutritionTitle) {
      nutritionTitle.textContent =
        "Nutrition Goals";
    }

    let nutritionExtra =
      $("manaExtraNutrition104991");

    if (!nutritionExtra) {
      nutritionExtra = document.createElement("div");
      nutritionExtra.id =
        "manaExtraNutrition104991";
    }

    nutritionExtra.className =
      "mana-extra-field-group";

    move(nutritionExtra,nutrition);

    move(
      field("me-dietary_preferences"),
      nutritionExtra
    );

    /* Progression Photos */

    const photoTitle = photos.querySelector("h3");

    if (photoTitle) {
      photoTitle.textContent =
        "Progression Photos";
    }

    move(photos,extended);

    /* Order the four main sections */

    if (
      personal.parentElement === shell &&
      training.parentElement === shell &&
      nutrition.parentElement === shell &&
      extended.parentElement === shell
    ) {
      placeAfter(training,personal);
      placeAfter(nutrition,training);
      placeAfter(extended,nutrition);
    }

    const saveButton = $("manaProfileSave");

    if (
      saveButton &&
      saveButton.parentElement === shell
    ) {
      placeAfter(saveButton,extended);
    }

    /* Existing form functionality */

    connectNames();
    connectAge();
    connectActivity();

    screen.dataset.manaProfileOrder = BUILD;

    complete = true;
    stopJobs();

    console.log(
      "[Mana Profile] Layout applied " + BUILD
    );

    return true;
  }

  /* =====================================================
     CONTROLLED INITIALISATION
     ===================================================== */

  function stopJobs() {
    jobs.forEach(clearTimeout);
    jobs = [];
  }

  function schedule() {
    if (complete) return;

    stopJobs();

    [
      0,
      120,
      350,
      700,
      1200,
      2000,
      3200
    ].forEach(delay => {
      jobs.push(
        setTimeout(arrange,delay)
      );
    });
  }

  function checkOpen() {
    const open = profileOpen();

    if (open && !wasOpen) {
      wasOpen = true;
      schedule();
    } else if (!open && wasOpen) {
      wasOpen = false;
      stopJobs();
    }
  }

  function watch() {
    const screen = $(SCREEN);

    if (
      !screen ||
      observedScreen === screen
    ) {
      return;
    }

    observer?.disconnect();

    observedScreen = screen;
    wasOpen = profileOpen();

    observer = new MutationObserver(checkOpen);

    observer.observe(screen,{
      attributes:true,
      attributeFilter:["class"]
    });

    if (wasOpen && !complete) {
      schedule();
    }
  }

  function init() {
    installStyles();
    watch();

    if (profileOpen()) {
      schedule();
    }

    $(SCREEN)?.addEventListener(
      "focusout",
      () => {
        if (!complete) {
          setTimeout(arrange,0);
        }
      },
      true
    );

    window.addEventListener(
      "pageshow",
      () => {
        watch();

        if (profileOpen() && !complete) {
          schedule();
        }
      }
    );

    window.MANA_PROFILE_ORDER_BUILD =
      BUILD;

    console.log(
      "[Mana Movement] Profile 105022 loaded"
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {once:true}
    );
  } else {
    init();
  }

})();
