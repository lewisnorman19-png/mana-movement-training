
/* ============================================================
   MANA MOVEMENT TRAINING
   CLIENT PROFILE — PREMIUM FIELD FINISH
   BUILD 104992

   COMPLETE REPLACEMENT:
   mana_client_profile_order_104990.js

   FIXES
   - First name + Last name side by side
   - Removes duplicate visible Name field
   - Date of birth + calculated age side by side
   - Current weight + target weight side by side
   - One visible Daily Activity selector
   - Preserves existing Fuel calculations
   - Keeps four premium profile sections
   - Preserves contact and photo upload fields

   NO DATABASE CHANGES
   NO NEW PROFILE RECORDS
   NO COACH HUB FUNCTION REPLACEMENTS
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104992";
  const FLAG = "MANA_PROFILE_ORDER_104992";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const $ = id => document.getElementById(id);

  const SCREEN = "manaProfileScreen";
  const ROOT = "manaExtendedClient104901";
  const STYLE = "manaProfileOrderStyle104992";

  let timers = [];

  /* ============================================================
     STYLING
     ============================================================ */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      #${SCREEN} {
        --mana-orange: #FF7927;
        --mana-dark: #15171B;
        --mana-border: #4B535E;
      }

      #${SCREEN} .mana-profile-card,
      #${SCREEN} #${ROOT} > .me-card {
        background: var(--mana-dark) !important;
        border: 1px solid var(--mana-border) !important;
        border-left: 3px solid var(--mana-orange) !important;
        border-radius: 15px !important;
        padding: 15px !important;
        margin: 12px 0 !important;
        box-shadow: none !important;
      }

      #${SCREEN} .mana-profile-card > h3,
      #${SCREEN} #${ROOT} > .me-card > h3 {
        color: #FFFFFF !important;
        font-size: 19px !important;
        font-weight: 850 !important;
        margin: 0 0 15px !important;
        padding-bottom: 12px !important;
        border-bottom: 2px solid var(--mana-orange) !important;
      }

      /* MERGED PERSONAL CARD */

      #${SCREEN} .mana-personal-merged
      .me-card {
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
        border-radius: 0 !important;
        box-shadow: none !important;
      }

      #${SCREEN} .mana-personal-merged
      .me-card > .me-kicker,
      #${SCREEN} .mana-personal-merged
      .me-card > h3 {
        display: none !important;
      }

      #${SCREEN} .mana-personal-merged
      .me-avatar-row {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        gap: 13px !important;
        margin: 0 0 15px !important;
        padding: 0 0 14px !important;
        border-bottom: 1px solid #3A424C !important;
      }

      /* PAIRED FIELDS */

      #${SCREEN} .mana-paired-fields {
        display: grid !important;
        grid-template-columns:
          repeat(2,minmax(0,1fr)) !important;
        gap: 10px !important;
        width: 100% !important;
        margin: 10px 0 !important;
        align-items: start !important;
      }

      #${SCREEN} .mana-paired-fields
      > .me-field,
      #${SCREEN} .mana-paired-fields
      > .mana-profile-field {
        min-width: 0 !important;
        width: 100% !important;
        margin: 0 !important;
      }

      #${SCREEN} .mana-paired-fields input {
        width: 100% !important;
        min-width: 0 !important;
      }

      #${SCREEN} .mana-profile-field input,
      #${SCREEN} .me-field input,
      #${SCREEN} .me-field select,
      #${SCREEN} .me-field textarea {
        background: #101215 !important;
        color: white !important;
        border: 1px solid #4B535D !important;
        border-radius: 10px !important;
      }

      #${SCREEN} .mana-profile-field input:focus,
      #${SCREEN} .me-field input:focus,
      #${SCREEN} .me-field select:focus {
        border-color: #FF7927 !important;
        outline-color: #FF7927 !important;
      }

      #${SCREEN} #manaProfileAge[readonly] {
        color: #FF7927 !important;
        font-weight: 850 !important;
        opacity: 1 !important;
      }

      #${SCREEN} .mana-section-subheading {
        color: #FF7927 !important;
        font-size: 11px !important;
        font-weight: 900 !important;
        letter-spacing: .08em !important;
        text-transform: uppercase !important;
        padding-top: 12px !important;
        margin: 16px 0 10px !important;
        border-top: 1px solid #353D47 !important;
      }

      #${SCREEN} .mana-extra-field-group {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: 11px !important;
        margin-top: 13px !important;
        padding-top: 12px !important;
        border-top: 1px solid #353D47 !important;
      }

      /* PHOTOS */

      #${SCREEN} #${ROOT} {
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      #${SCREEN} #${ROOT} .me-photo-grid {
        display: grid !important;
        grid-template-columns:
          repeat(3,minmax(0,1fr)) !important;
        gap: 8px !important;
      }

      #${SCREEN} #${ROOT} .me-photo-card {
        min-width: 0 !important;
        border: 1px solid #424A55 !important;
        background: #101215 !important;
        border-radius: 10px !important;
        padding: 7px !important;
      }

      #${SCREEN} #${ROOT} .me-consent {
        display: flex !important;
        flex-direction: row !important;
        align-items: flex-start !important;
        gap: 11px !important;
      }

      #${SCREEN} #${ROOT} .me-consent input {
        width: 20px !important;
        height: 20px !important;
        flex: 0 0 20px !important;
        margin: 2px 0 0 !important;
      }

      /* SAVE BUTTON */

      #${SCREEN} #manaProfileSave {
        background: #FF7927 !important;
        color: #0B0C0E !important;
        border: none !important;
        border-radius: 12px !important;
        min-height: 55px !important;
        font-weight: 900 !important;
      }

      /* MOBILE */

      @media(max-width:600px) {

        #${SCREEN} .mana-profile-card,
        #${SCREEN} #${ROOT} > .me-card {
          padding: 12px !important;
        }

        #${SCREEN} .mana-paired-fields {
          grid-template-columns:
            repeat(2,minmax(0,1fr)) !important;
          gap: 7px !important;
        }

        #${SCREEN} .mana-paired-fields
        input {
          padding: 10px 8px !important;
          font-size: 13px !important;
        }

        #${SCREEN} #${ROOT} .me-photo-grid {
          gap: 5px !important;
        }

        #${SCREEN} #${ROOT} .me-photo-card {
          padding: 5px !important;
        }
      }

    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     FIELD HELPERS
     ============================================================ */

  function field(id) {
    const element = $(id);

    return element?.closest(
      ".me-field, .mana-profile-field"
    ) || null;
  }

  function pair(id, parent) {
    let row = $(id);

    if (!row) {
      row = document.createElement("div");
      row.id = id;
      row.className = "mana-paired-fields";
    }

    if (row.parentElement !== parent) {
      parent.appendChild(row);
    }

    return row;
  }

  function moveField(element, target) {
    if (
      element &&
      target &&
      element.parentElement !== target
    ) {
      target.appendChild(element);
    }
  }

  function heading(card, text) {
    const h = Array.from(card.children)
      .find(node => node.tagName === "H3");

    if (h && h.textContent.trim() !== text) {
      h.textContent = text;
    }
  }

  /* ============================================================
     AGE CALCULATED FROM DATE OF BIRTH

     Never calculates from the old age
     field. Date of birth is the source.

     Preserves the existing age input ID
     for Fuel calculations and Profile save.
     ============================================================ */

  function ageFromDOB(value) {
    if (
      !value ||
      !/^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
      return null;
    }

    const [year, month, day] =
      value.split("-").map(Number);

    const today = new Date();

    const dob = new Date(
      year,
      month - 1,
      day
    );

    if (
      dob.getFullYear() !== year ||
      dob.getMonth() !== month - 1 ||
      dob.getDate() !== day ||
      dob > today
    ) {
      return null;
    }

    let age =
      today.getFullYear() - year;

    const birthdayPassed =
      today.getMonth() + 1 > month ||
      (
        today.getMonth() + 1 === month &&
        today.getDate() >= day
      );

    if (!birthdayPassed) {
      age--;
    }

    return age >= 0 && age <= 120
      ? age
      : null;
  }

  function updateAge() {
    const dob = $("me-dob");
    const ageInput = $("manaProfileAge");

    if (!dob || !ageInput) return;

    const age = ageFromDOB(dob.value);

    /*
     Invalid or missing DOB: keep the
     existing age rather than overwrite it.
    */

    if (age === null) return;

    if (ageInput.value !== String(age)) {
      ageInput.value = String(age);

      ageInput.dispatchEvent(
        new Event("input", {
          bubbles: true
        })
      );

      ageInput.dispatchEvent(
        new Event("change", {
          bubbles: true
        })
      );
    }
  }

  function connectAge() {
    const dob = $("me-dob");
    const age = $("manaProfileAge");

    if (!dob || !age) return;

    age.readOnly = true;
    age.title =
      "Automatically calculated from date of birth";

    if (!dob.dataset.manaAgeConnected) {
      dob.dataset.manaAgeConnected = "1";

      dob.addEventListener(
        "input",
        updateAge
      );

      dob.addEventListener(
        "change",
        updateAge
      );
    }

    updateAge();
  }

  /* ============================================================
     FIRST / LAST NAME

     The original manaProfileName remains
     in the DOM for the existing save logic,
     but is no longer displayed twice.

     First / Last fields drive the original
     Name value.
     ============================================================ */

  function connectNames() {
    const first = $("me-first_name");
    const last = $("me-last_name");
    const original = $("manaProfileName");

    if (!first || !last || !original) {
      return;
    }

    function syncName() {
      const full = [
        first.value.trim(),
        last.value.trim()
      ].filter(Boolean).join(" ");

      if (
        full &&
        original.value !== full
      ) {
        original.value = full;

        original.dispatchEvent(
          new Event("input", {
            bubbles: true
          })
        );
      }
    }

    if (!first.dataset.manaNameConnected) {
      first.dataset.manaNameConnected = "1";

      first.addEventListener(
        "input",
        syncName
      );

      last.addEventListener(
        "input",
        syncName
      );
    }

    /*
     Initialise only missing components.
     Never overwrite saved first/last data
     with a guessed split of a full name.
    */

    if (
      !first.value.trim() &&
      !last.value.trim() &&
      original.value.trim()
    ) {
      first.value =
        original.value.trim();
    } else {
      syncName();
    }
  }

  /* ============================================================
     DAILY ACTIVITY — ONE VISIBLE SELECTOR

     Retain the original visible Daily
     Activity dropdown.

     The added custom selector remains
     available internally because Build
     104981 uses it for calorie estimates.

     Bridge changes to the calculation.
     ============================================================ */

  function normaliseActivity(value, label) {
    const text = (
      String(value || "") + " " +
      String(label || "")
    ).toLowerCase();

    if (
      /very.active|extremely|extra.active/.test(text)
    ) {
      return "very_active";
    }

    if (/sedentary|mostly.sitting/.test(text)) {
      return "sedentary";
    }

    if (/moderate/.test(text)) {
      return "moderate";
    }

    if (/light/.test(text)) {
      return "light";
    }

    if (/active/.test(text)) {
      return "active";
    }

    return "";
  }

  function connectActivity() {
    const screen = $(SCREEN);

    const custom = $(
      "manaPremiumActivity104981"
    );

    if (!screen || !custom) return;

    const customWrapper = custom.closest(
      ".mana-premium-activity"
    );

    const selects = Array.from(
      screen.querySelectorAll("select")
    );

    const existing = selects.find(select => {
      if (select === custom) return false;

      const fieldWrapper = select.closest(
        ".mana-profile-field, .me-field"
      );

      const label =
        fieldWrapper?.querySelector("label");

      return (
        label?.textContent?.trim()
          .toLowerCase() ===
        "daily activity"
      );
    });

    /*
     Do not hide the custom selector unless
     another Daily Activity input exists.
    */

    if (!existing) return;

    if (customWrapper) {
      customWrapper.style.display = "none";
    }

    if (
      existing.dataset.manaActivityConnected
    ) return;

    existing.dataset.manaActivityConnected = "1";

    function syncActivity() {
      const option =
        existing.selectedOptions?.[0];

      const mapped = normaliseActivity(
        existing.value,
        option?.textContent
      );

      if (custom.value !== mapped) {
        custom.value = mapped;

        custom.dispatchEvent(
          new Event("change", {
            bubbles: true
          })
        );
      }
    }

    existing.addEventListener(
      "change",
      syncActivity
    );

    syncActivity();
  }

  /* ============================================================
     PROFILE PHOTO PREVIEW
     ============================================================ */

  function connectAvatar() {
    const input = $("me-file-avatar");

    if (
      !input ||
      input.dataset.manaAvatarConnected
    ) return;

    input.dataset.manaAvatarConnected = "1";

    input.addEventListener("change", () => {
      const file = input.files?.[0];

      if (!file) return;

      const holder = $("me-preview-avatar");

      if (!holder) return;

      const url = URL.createObjectURL(file);
      const image = document.createElement("img");

      image.src = url;
      image.alt = "Profile photo";
      image.className = "me-avatar";

      image.addEventListener(
        "load",
        () => URL.revokeObjectURL(url),
        { once: true }
      );

      holder.replaceChildren(image);
    });
  }

  /* ============================================================
     PREMIUM PROFILE ORDER
     ============================================================ */

  function arrange() {
    const screen = $(SCREEN);

    const shell = screen?.querySelector(
      ".mana-profile-shell"
    );

    const extended = $(ROOT);

    if (!shell || !extended) {
      return false;
    }

    const personal =
      $("manaProfileName")?.closest(
        ".mana-profile-card"
      );

    const training =
      shell.querySelector(
        ".mana-profile-training"
      );

    const nutrition =
      shell.querySelector(
        ".mana-profile-fuel"
      );

    const contact =
      $("me-first_name")?.closest(
        ".me-card"
      );

    const photos =
      $("me-file-baseline-front")?.closest(
        ".me-card"
      );

    if (
      !personal ||
      !training ||
      !nutrition ||
      !contact ||
      !photos
    ) {
      return false;
    }

    heading(personal, "Personal Details");
    heading(training, "Training Goals");
    heading(nutrition, "Nutrition Goals");
    heading(photos, "Progression Photos");

    personal.classList.add(
      "mana-personal-merged"
    );

    /* ----------------------------------------
       1. PERSONAL DETAILS
       ---------------------------------------- */

    const avatar = contact.querySelector(
      ".me-avatar-row"
    ) || personal.querySelector(
      ".me-avatar-row"
    );

    const mainHeading =
      Array.from(personal.children)
        .find(node =>
          node.tagName === "H3"
        );

    if (
      avatar &&
      mainHeading &&
      avatar.parentElement !== personal
    ) {
      mainHeading.insertAdjacentElement(
        "afterend",
        avatar
      );
    }

    moveField(contact, personal);

    const name = field(
      "manaProfileName"
    );

    /*
     Hide the duplicate original Name
     wrapper but keep the input accessible
     to its existing save handler.
    */

    if (name) {
      name.style.display = "none";
    }

    const first = field("me-first_name");
    const last = field("me-last_name");

    const contactGrid =
      contact.querySelector(".me-grid");

    const names = pair(
      "manaNameRow104992",
      contactGrid || contact
    );

    moveField(first, names);
    moveField(last, names);

    /*
     Names must be the first fields after
     the profile photo.
    */

    const oldContactLabel =
      contact.querySelector(
        ".mana-contact-heading"
      );

    if (oldContactLabel) {
      oldContactLabel.remove();
    }

    if (contactGrid) {
      contactGrid.insertBefore(
        names,
        contactGrid.firstChild
      );
    }

    const dob = field("me-dob");
    const age = field("manaProfileAge");

    const dobAge = pair(
      "manaDobAgeRow104992",
      contactGrid || contact
    );

    moveField(dob, dobAge);
    moveField(age, dobAge);

    if (names.parentElement === contactGrid) {
      names.insertAdjacentElement(
        "afterend",
        dobAge
      );
    }

    /*
     Gender and height remain with the
     original Personal settings.
    */

    const originalGrid =
      $("manaProfileGender")?.closest(
        ".mana-profile-grid"
      );

    if (
      originalGrid &&
      originalGrid.parentElement === personal
    ) {
      contact.insertAdjacentElement(
        "afterend",
        originalGrid
      );
    }

    /*
     Place the contact fields after the
     initial personal measurements.
    */

    const contactLabel =
      document.getElementById(
        "manaContactHeading104992"
      ) ||
      document.createElement("div");

    contactLabel.id =
      "manaContactHeading104992";

    contactLabel.className =
      "mana-section-subheading";

    contactLabel.textContent =
      "Contact & Emergency Details";

    const phone = field("me-phone");

    if (phone && contactGrid) {
      contactGrid.insertBefore(
        contactLabel,
        phone
      );
    }

    /* ----------------------------------------
       2. TRAINING GOALS
       ---------------------------------------- */

    let trainingExtra = $(
      "manaExtraTraining104991"
    );

    if (!trainingExtra) {
      trainingExtra =
        document.createElement("div");

      trainingExtra.id =
        "manaExtraTraining104991";

      trainingExtra.className =
        "mana-extra-field-group";
    }

    if (trainingExtra.parentElement !== training) {
      training.appendChild(trainingExtra);
    }

    const weight = field(
      "manaProfileWeight"
    );

    const target = field(
      "me-target_weight"
    );

    const weights = pair(
      "manaWeightRow104992",
      trainingExtra
    );

    moveField(weight, weights);
    moveField(target, weights);

    if (
      trainingExtra.firstElementChild !== weights
    ) {
      trainingExtra.insertBefore(
        weights,
        trainingExtra.firstChild
      );
    }

    [
      "me-injuries",
      "me-training_preferences"
    ].forEach(id => {
      moveField(
        field(id),
        trainingExtra
      );
    });

    /* ----------------------------------------
       3. NUTRITION GOALS
       ---------------------------------------- */

    let nutritionExtra = $(
      "manaExtraNutrition104991"
    );

    if (!nutritionExtra) {
      nutritionExtra =
        document.createElement("div");

      nutritionExtra.id =
        "manaExtraNutrition104991";

      nutritionExtra.className =
        "mana-extra-field-group";
    }

    if (
      nutritionExtra.parentElement !== nutrition
    ) {
      nutrition.appendChild(nutritionExtra);
    }

    moveField(
      field("me-dietary_preferences"),
      nutritionExtra
    );

    /* ----------------------------------------
       4. PROGRESSION PHOTOS
       ---------------------------------------- */

    if (photos.parentElement !== extended) {
      extended.appendChild(photos);
    }

    /*
     Re-establish screen order using the
     existing nodes only.
    */

    if (
      personal.parentElement === shell &&
      training.parentElement === shell &&
      nutrition.parentElement === shell &&
      extended.parentElement === shell
    ) {
      personal.insertAdjacentElement(
        "afterend",
        training
      );

      training.insertAdjacentElement(
        "afterend",
        nutrition
      );

      nutrition.insertAdjacentElement(
        "afterend",
        extended
      );
    }

    const save = $("manaProfileSave");

    if (
      save &&
      extended.parentElement ===
        save.parentElement &&
      extended.nextElementSibling !== save
    ) {
      extended.insertAdjacentElement(
        "afterend",
        save
      );
    }

    connectNames();
    connectAge();
    connectActivity();
    connectAvatar();

    screen.dataset.manaProfileOrder = BUILD;

    return true;
  }

  /* ============================================================
     LOAD / REOPEN
     ============================================================ */

  function schedule() {
    timers.forEach(clearTimeout);
    timers = [];

    [100, 350, 750, 1300].forEach(delay => {
      timers.push(
        setTimeout(arrange, delay)
      );
    });
  }

  function init() {
    installStyles();
    schedule();

    document.addEventListener(
      "click",
      event => {
        if (
          event.target.closest?.(
            "#manaProfileScreen," +
            "[data-open-profile]," +
            "#manaProfileButton"
          )
        ) {
          schedule();
        }
      }
    );

    document.addEventListener(
      "visibilitychange",
      () => {
        if (!document.hidden) {
          schedule();
        }
      }
    );

    window.addEventListener(
      "pageshow",
      schedule
    );

    console.log(
      "[Mana Movement] Premium Profile " +
      BUILD +
      " active"
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }

})();
