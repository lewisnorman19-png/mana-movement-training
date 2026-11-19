
/* ============================================================
   MANA MOVEMENT TRAINING
   PERMANENT CLIENT PROFILE LAYOUT
   BUILD 105021

   COMPLETE REPLACEMENT:
   mana_client_profile_order_104990.js

   PERSONAL DETAILS:
   - Profile photograph
   - First Name / Last Name
   - Gender
   - Date of Birth / Age
   - Height / Weight
   - Email Address / Contact Number
   - Remaining contact details

   FOLLOWED BY:
   - Training Goals
   - Nutrition Goals
   - Progression Photos

   SAFETY:
   - Existing input IDs unchanged
   - Existing save handlers retained
   - Verified email remains read-only
   - No database writes
   - No automatic data deletion
   - No rearrangement while typing
   - No click-triggered rearrangement
   - Existing coach features unaffected
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "105021";
  const FLAG = "MANA_PROFILE_ORDER_105021";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const SCREEN = "manaProfileScreen";
  const ROOT = "manaExtendedClient104901";
  const STYLE = "manaProfileOrderStyle105021";

  const $ = id => document.getElementById(id);

  let completed = false;
  let scheduled = [];
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
      #${SCREEN} * {
        box-sizing: border-box;
      }

      #${SCREEN} .mana-profile-shell {
        width: min(680px,100%) !important;
        max-width: 100% !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }

      #${SCREEN} .mana-profile-card {
        background: #15171B !important;
        border: 1px solid #4B535E !important;
        border-left: 3px solid #FF7927 !important;
        border-radius: 16px !important;
        padding: 15px !important;
        margin: 12px 0 !important;
      }

      #${SCREEN} .mana-profile-card > h3 {
        color: #FFFFFF !important;
        font-size: 19px !important;
        font-weight: 900 !important;
        margin: 0 0 15px !important;
        padding-bottom: 12px !important;
        border-bottom: 2px solid #FF7927 !important;
      }

      /* Embedded contact card */

      #${SCREEN} .mana-personal-merged
      > .me-card {
        width: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
        border: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
      }

      #${SCREEN} .mana-personal-merged
      > .me-card > h3,
      #${SCREEN} .mana-personal-merged
      > .me-card > .me-kicker {
        display: none !important;
      }

      #${SCREEN} .mana-personal-merged
      .me-grid {
        display: grid !important;
        grid-template-columns:
          repeat(2,minmax(0,1fr)) !important;
        gap: 10px !important;
        width: 100% !important;
        min-width: 0 !important;
      }

      /* Full-width groups */

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
        align-items: start !important;
        width: 100% !important;
        min-width: 0 !important;
        gap: 10px !important;
        margin: 4px 0 10px !important;
      }

      #${SCREEN} .mana-paired-fields > * {
        min-width: 0 !important;
        width: 100% !important;
        margin: 0 !important;
      }

      /* Gender remains full width */

      #${SCREEN} #manaGenderRow105021 {
        grid-template-columns:
          minmax(0,1fr) !important;
      }

      /* DOB and age */

      #${SCREEN} #manaDobAgeRow104992 {
        grid-template-columns:
          minmax(0,1fr) minmax(90px,.45fr) !important;
      }

      /* Height / weight together */

      #${SCREEN} #manaHeightWeightRow105021 {
        grid-template-columns:
          repeat(2,minmax(0,1fr)) !important;
      }

      /* Email / phone together */

      #${SCREEN} #manaEmailPhoneRow105021 {
        grid-template-columns:
          repeat(2,minmax(0,1fr)) !important;
      }

      /* Inputs */

      #${SCREEN} .mana-profile-field,
      #${SCREEN} .me-field {
        min-width: 0 !important;
      }

      #${SCREEN} .mana-profile-field label,
      #${SCREEN} .me-field label {
        display: block !important;
        min-height: 18px !important;
        margin: 0 0 7px !important;
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

      #${SCREEN} #me-account-email[readonly] {
        background: #171A1F !important;
        color: #D1D5DB !important;
        opacity: 1 !important;
        -webkit-text-fill-color: #D1D5DB !important;
      }

      #${SCREEN} #me-dob {
        min-height: 46px !important;
        height: 46px !important;
        padding: 8px !important;
        -webkit-appearance: auto !important;
        appearance: auto !important;
      }

      #${SCREEN} input:focus-visible,
      #${SCREEN} select:focus-visible,
      #${SCREEN} textarea:focus-visible {
        outline: 2px solid #FF7927 !important;
        outline-offset: 1px !important;
      }

      /* Photo */

      #${SCREEN} .mana-personal-merged
      > .me-avatar-row {
        display: flex !important;
        align-items: center !important;
        gap: 13px !important;
        width: 100% !important;
        padding-bottom: 14px !important;
        margin-bottom: 15px !important;
        border-bottom: 1px solid #39414B !important;
      }

      /* Contact heading */

      #${SCREEN} .mana-section-subheading {
        color: #FF7927 !important;
        font-size: 11px !important;
        font-weight: 900 !important;
        letter-spacing: .08em !important;
        text-transform: uppercase !important;
        padding-top: 13px !important;
        margin: 9px 0 4px !important;
        border-top: 1px solid #39414B !important;
      }

      /* Training and nutrition additions */

      #${SCREEN} .mana-extra-field-group {
        display: grid !important;
        grid-template-columns:
          minmax(0,1fr) !important;
        gap: 11px !important;
        width: 100% !important;
        min-width: 0 !important;
        margin-top: 13px !important;
      }

      /* Photo grid remains three across */

      #${SCREEN} #${ROOT} .me-photo-grid {
        display: grid !important;
        grid-template-columns:
          repeat(3,minmax(0,1fr)) !important;
        gap: 8px !important;
      }

      #${SCREEN} #${ROOT} .me-photo-card {
        min-width: 0 !important;
      }

      /* Save */

      #${SCREEN} #manaProfileSave {
        min-height: 55px !important;
        background: #FF7927 !important;
        color: #101215 !important;
        border: none !important;
        border-radius: 12px !important;
        font-weight: 900 !important;
      }

      /* Mobile */

      @media(max-width:600px) {

        #${SCREEN} {
          padding-left: 9px !important;
          padding-right: 9px !important;
        }

        #${SCREEN} .mana-profile-shell {
          width: 100% !important;
          max-width: 100% !important;
        }

        #${SCREEN} .mana-profile-card {
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

        #${SCREEN} #manaHeightWeightRow105021,
        #${SCREEN} #manaEmailPhoneRow105021 {
          grid-template-columns:
            repeat(2,minmax(0,1fr)) !important;
        }

        #${SCREEN} .mana-profile-field input,
        #${SCREEN} .mana-profile-field select,
        #${SCREEN} .me-field input:not([type=file]),
        #${SCREEN} .me-field select {
          font-size: 16px !important;
          padding: 10px 8px !important;
        }

        #${SCREEN} #me-dob {
          padding: 8px 5px !important;
        }

        #${SCREEN} #manaEmailPhoneRow105021
        #me-account-email {
          font-size: 12px !important;
          padding: 9px 6px !important;
        }

        #${SCREEN} #${ROOT}
        .me-photo-grid {
          gap: 5px !important;
        }

        #${SCREEN} #${ROOT}
        .me-photo-card {
          padding: 5px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =====================================================
     FIELD UTILITIES
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

  function after(node, anchor) {
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

  function group(id, parent) {
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
    return !!$(SCREEN)?.classList.contains(
      "open"
    );
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
     NAME SYNCHRONISATION

     Preserve the original hidden Name
     field used by the v6.7 Save handler.
     ===================================================== */

  function connectNames() {
    const first = $("me-first_name");
    const last = $("me-last_name");
    const original = $("manaProfileName");

    if (!first || !last || !original) return;

    if (first.dataset.manaNames105021) {
      return;
    }

    first.dataset.manaNames105021 = "1";

    const sync = () => {
      const name = [
        first.value.trim(),
        last.value.trim()
      ].filter(Boolean).join(" ");

      if (original.value !== name) {
        original.value = name;
      }
    };

    first.addEventListener("input",sync);
    last.addEventListener("input",sync);

    first.addEventListener("change",sync);
    last.addEventListener("change",sync);

    /*
     Do not generate a name from an
     unrelated or unverified cache.
    */
  }

  /* =====================================================
     DATE OF BIRTH / AGE
     ===================================================== */

  function calculateAge() {
    const dob = $("me-dob");
    const ageInput = $("manaProfileAge");

    if (!dob || !ageInput) return;

    ageInput.readOnly = true;

    const match = String(dob.value).match(
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

    let age = today.getFullYear() - year;

    const passed =
      today.getMonth() + 1 > month ||
      (
        today.getMonth() + 1 === month &&
        today.getDate() >= day
      );

    if (!passed) age--;

    if (
      age >= 0 &&
      age <= 120 &&
      ageInput.value !== String(age)
    ) {
      ageInput.value = String(age);

      ageInput.dispatchEvent(
        new Event("change",{
          bubbles:true
        })
      );
    }
  }

  /* =====================================================
     EXISTING DAILY ACTIVITY
     ===================================================== */

  function connectActivity() {
    const screen = $(SCREEN);
    const custom = $(
      "manaPremiumActivity104981"
    );

    if (!screen || !custom) return;

    const existing = Array.from(
      screen.querySelectorAll(
        ".mana-profile-field,.me-field"
      )
    ).find(node => {
      const label = node.querySelector("label");

      return (
        label?.textContent.trim()
          .toLowerCase() === "daily activity" &&
        node.querySelector("select") !== custom
      );
    })?.querySelector("select");

    if (!existing) return;

    const customWrapper = custom.closest(
      ".mana-premium-activity"
    );

    if (customWrapper) {
      customWrapper.style.display = "none";
    }

    if (existing.dataset.manaActivity105021) {
      return;
    }

    existing.dataset.manaActivity105021 = "1";

    const normalise = text => {
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
    };

    const sync = () => {
      const value = normalise(
        existing.value + " " +
        (
          existing.selectedOptions?.[0]
            ?.textContent || ""
        )
      );

      if (value && custom.value !== value) {
        custom.value = value;

        custom.dispatchEvent(
          new Event("change",{
            bubbles:true
          })
        );
      }
    };

    existing.addEventListener(
      "change",
      sync
    );

    sync();
  }

  /* =====================================================
     ONE-TIME LAYOUT
     ===================================================== */

  function arrange() {
    if (completed || !profileOpen() || editing()) {
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
      shell?.querySelector(
        ".mana-profile-training"
      );

    const nutrition =
      shell?.querySelector(
        ".mana-profile-fuel"
      );

    const photos = field(
      "me-file-baseline-front"
    )?.closest(".me-card");

    const originalGrid = $(
      "manaProfileGender"
    )?.closest(".mana-profile-grid");

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
    ) return false;

    /* Personal Details */

    personal.classList.add(
      "mana-personal-merged"
    );

    const title = personal.querySelector("h3");

    if (title) {
      title.textContent = "Personal Details";
    }

    const oldName = field("manaProfileName");

    if (oldName) {
      oldName.style.display = "none";
    }

    move(contact,personal);

    const avatar =
      $("me-preview-avatar")?.closest(
        ".me-avatar-row"
      );

    if (avatar && title) {
      move(avatar,personal);
      after(avatar,title);
      after(contact,avatar);
    }

    /* First and Last Name */

    const names = group(
      "manaNameRow104992",
      grid
    );

    move(field("me-first_name"),names);
    move(field("me-last_name"),names);

    if (grid.firstElementChild !== names) {
      grid.insertBefore(
        names,
        grid.firstChild
      );
    }

    /* Gender */

    const gender = group(
      "manaGenderRow105021",
      grid
    );

    move(field("manaProfileGender"),gender);

    after(gender,names);

    /* Date of Birth and Age */

    const dobAge = group(
      "manaDobAgeRow104992",
      grid
    );

    move(field("me-dob"),dobAge);
    move(field("manaProfileAge"),dobAge);

    after(dobAge,gender);

    /* Height and Weight */

    const measurements = group(
      "manaHeightWeightRow105021",
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

    after(measurements,dobAge);

    /* Contact heading */

    let contactHeading = $(
      "manaContactHeading104992"
    );

    if (!contactHeading) {
      contactHeading =
        document.createElement("div");

      contactHeading.id =
        "manaContactHeading104992";

      contactHeading.className =
        "mana-section-subheading";
    }

    contactHeading.textContent =
      "Contact Details";

    move(contactHeading,grid);

    after(contactHeading,measurements);

    /* Email and Contact Number */

    const email = field(
      "me-account-email"
    );

    const phone = field("me-phone");

    const emailLabel =
      email?.querySelector("label");

    const phoneLabel =
      phone?.querySelector("label");

    if (emailLabel) {
      emailLabel.textContent =
        "Email Address";
    }

    if (phoneLabel) {
      phoneLabel.textContent =
        "Contact Number";
    }

    const emailPhone = group(
      "manaEmailPhoneRow105021",
      grid
    );

    move(email,emailPhone);
    move(phone,emailPhone);

    after(emailPhone,contactHeading);

    /*
     The email is populated by the
     existing authenticated profile
     loader. It remains read-only.
    */

    const emailInput = $(
      "me-account-email"
    );

    if (emailInput) {
      emailInput.readOnly = true;
    }

    /* Hide the empty original grid */

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
      trainingTitle.textContent =
        "Training Goals";
    }

    let trainingExtra = $(
      "manaExtraTraining104991"
    );

    if (!trainingExtra) {
      trainingExtra =
        document.createElement("div");

      trainingExtra.id =
        "manaExtraTraining104991";
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

    let nutritionExtra = $(
      "manaExtraNutrition104991"
    );

    if (!nutritionExtra) {
      nutritionExtra =
        document.createElement("div");

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

    /* Permanent section order */

    if (
      personal.parentElement === shell &&
      training.parentElement === shell &&
      nutrition.parentElement === shell &&
      extended.parentElement === shell
    ) {
      after(training,personal);
      after(nutrition,training);
      after(extended,nutrition);
    }

    const save = $("manaProfileSave");

    if (
      save &&
      save.parentElement === shell
    ) {
      after(save,extended);
    }

    /* Existing functionality */

    connectNames();

    const dob = $("me-dob");

    if (
      dob &&
      !dob.dataset.manaAge105021
    ) {
      dob.dataset.manaAge105021 = "1";

      dob.addEventListener(
        "input",
        calculateAge
      );

      dob.addEventListener(
        "change",
        calculateAge
      );
    }

    calculateAge();
    connectActivity();

    screen.dataset.manaProfileOrder =
      BUILD;

    completed = true;
    stopRetries();

    return true;
  }

  /* =====================================================
     CONTROLLED SETUP
     ===================================================== */

  function stopRetries() {
    scheduled.forEach(clearTimeout);
    scheduled = [];
  }

  function schedule() {
    if (completed) return;

    stopRetries();

    [
      0,
      100,
      250,
      500,
      850,
      1400,
      2200
    ].forEach(delay => {
      scheduled.push(
        setTimeout(arrange,delay)
      );
    });
  }

  function checkOpen() {
    const open = profileOpen();

    if (open && !wasOpen) {
      wasOpen = true;

      if (!completed) {
        schedule();
      }

      const screen = $(SCREEN);

      if (screen) {
        screen.scrollTop = 0;
      }
    }

    if (!open && wasOpen) {
      wasOpen = false;
      stopRetries();
    }
  }

  function watch() {
    const screen = $(SCREEN);

    if (
      !screen ||
      observedScreen === screen
    ) return;

    observer?.disconnect();

    observedScreen = screen;
    wasOpen = profileOpen();

    observer = new MutationObserver(
      checkOpen
    );

    observer.observe(screen,{
      attributes:true,
      attributeFilter:["class"]
    });

    if (wasOpen && !completed) {
      schedule();
    }
  }

  function init() {
    installStyles();

    watch();

    if (profileOpen()) {
      schedule();
    }

    const screen = $(SCREEN);

    screen?.addEventListener(
      "focusout",
      () => {
        if (!completed) {
          setTimeout(arrange,0);
        }
      },
      true
    );

    window.addEventListener(
      "pageshow",
      () => {
        watch();

        if (
          profileOpen() &&
          !completed
        ) {
          schedule();
        }
      }
    );

    window.MANA_PROFILE_ORDER_BUILD =
      BUILD;

    console.log(
      "[Mana Movement] Fixed Profile " +
      BUILD + " ready"
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
