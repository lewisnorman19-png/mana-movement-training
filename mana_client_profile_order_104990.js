
/* ============================================================
   MANA MOVEMENT TRAINING
   CLIENT PROFILE — PREMIUM ORDER REPAIR
   BUILD 104991

   COMPLETE REPLACEMENT:
   mana_client_profile_order_104990.js

   ORDER:
   1. Personal Details
   2. Training Goals
   3. Nutrition Goals
   4. Progression Photos
   5. Save & Continue

   - Merge duplicated Personal Details sections
   - Keep all existing input fields
   - Move target weight and limitations to Training
   - Move dietary preferences to Nutrition
   - Keep photograph uploads functional
   - Premium orange / black / white / silver
   - No Supabase writes
   - No changes to original save handlers
   - No changes to Coach Hub
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104991";
  const FLAG = "MANA_PROFILE_ORDER_104991";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const $ = id => document.getElementById(id);

  const SCREEN = "manaProfileScreen";
  const ROOT = "manaExtendedClient104901";
  const STYLE = "manaProfileOrderStyle104991";

  let attempts = [];

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `
      #${SCREEN} {
        --mana-section-orange: #FF7927;
        --mana-section-border: #4C5560;
      }

      #${SCREEN} .mana-profile-card,
      #${SCREEN} #${ROOT} > .me-card {
        background: #15171B !important;
        border: 1px solid var(--mana-section-border) !important;
        border-radius: 16px !important;
        padding: 16px !important;
        margin: 12px 0 !important;
        box-shadow: none !important;
      }

      /* CLEAR CATEGORY HEADINGS */

      #${SCREEN} .mana-profile-card > h3,
      #${SCREEN} #${ROOT} > .me-card > h3 {
        color: #FFFFFF !important;
        font-size: 19px !important;
        font-weight: 850 !important;
        line-height: 1.3 !important;
        margin: 0 0 15px !important;
        padding: 0 0 11px !important;
        border-bottom: 2px solid #FF7927 !important;
      }

      #${SCREEN} .mana-profile-card[data-mana-order],
      #${SCREEN} #${ROOT} > .me-card[data-mana-order] {
        border-left: 3px solid #FF7927 !important;
      }

      /* MERGED PERSONAL DETAILS */

      #${SCREEN} .mana-personal-merged
      .me-card {
        background: transparent !important;
        border: none !important;
        border-radius: 0 !important;
        padding: 0 !important;
        margin: 16px 0 0 !important;
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
        gap: 14px !important;
        margin: 0 0 17px !important;
        padding: 0 0 15px !important;
        border-bottom: 1px solid #373F49 !important;
      }

      #${SCREEN} .mana-personal-merged
      .me-grid {
        gap: 10px !important;
      }

      #${SCREEN} .mana-personal-merged
      .mana-contact-heading {
        color: #FF7927;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: .09em;
        text-transform: uppercase;
        margin: 16px 0 11px;
        padding-top: 13px;
        border-top: 1px solid #373F49;
      }

      /* COMPACT INPUTS */

      #${SCREEN} .me-field input,
      #${SCREEN} .me-field textarea {
        background: #101215 !important;
        border: 1px solid #4B535D !important;
        border-radius: 10px !important;
        color: #FFFFFF !important;
      }

      #${SCREEN} .me-field input:focus,
      #${SCREEN} .me-field textarea:focus {
        border-color: #FF7927 !important;
        outline-color: #FF7927 !important;
      }

      #${SCREEN} .me-field label {
        color: #C0C7D0 !important;
        font-size: 12px !important;
      }

      /* TRAINING / NUTRITION SUBSECTIONS */

      #${SCREEN} .mana-extra-field-group {
        margin-top: 14px;
        padding-top: 13px;
        border-top: 1px solid #373F49;
        display: grid;
        grid-template-columns: 1fr;
        gap: 11px;
      }

      #${SCREEN} .mana-extra-field-group
      .me-field {
        margin: 0;
      }

      /* PHOTO SECTION */

      #${SCREEN} #${ROOT} {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
      }

      #${SCREEN} #${ROOT} > .me-card {
        margin-top: 12px !important;
      }

      #${SCREEN} #${ROOT}
      .me-photo-grid {
        display: grid !important;
        grid-template-columns:
          repeat(3, minmax(0,1fr)) !important;
        gap: 8px !important;
      }

      #${SCREEN} #${ROOT}
      .me-photo-card {
        background: #101215 !important;
        border: 1px solid #444C56 !important;
        border-radius: 10px !important;
        padding: 8px !important;
        min-width: 0 !important;
      }

      #${SCREEN} #${ROOT}
      .me-photo-preview {
        max-height: 190px !important;
      }

      #${SCREEN} #${ROOT}
      .me-consent {
        align-items: flex-start !important;
        gap: 12px !important;
      }

      #${SCREEN} #${ROOT}
      .me-consent input {
        width: 20px !important;
        height: 20px !important;
        flex: 0 0 20px !important;
        margin: 2px 0 0 !important;
      }

      /* SAVE BUTTON */

      #${SCREEN} #manaProfileSave {
        background: #FF7927 !important;
        color: #0B0C0E !important;
        border: 0 !important;
        border-radius: 13px !important;
        font-weight: 900 !important;
        min-height: 56px !important;
      }

      @media (max-width: 600px) {
        #${SCREEN} .mana-profile-card,
        #${SCREEN} #${ROOT} > .me-card {
          padding: 13px !important;
        }

        #${SCREEN} .mana-personal-merged
        .me-card {
          padding: 0 !important;
        }

        #${SCREEN} .mana-personal-merged
        .me-grid {
          grid-template-columns: 1fr !important;
        }

        #${SCREEN} #${ROOT}
        .me-photo-grid {
          gap: 5px !important;
        }

        #${SCREEN} #${ROOT}
        .me-photo-card {
          padding: 5px !important;
        }

        #${SCREEN} #${ROOT}
        .me-photo-preview {
          max-height: 160px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function field(id) {
    return $(id)?.closest(".me-field") || null;
  }

  function setHeading(card, label) {
    const heading = Array.from(card.children)
      .find(el => el.tagName === "H3");

    if (heading && heading.textContent !== label) {
      heading.textContent = label;
    }
  }

  /* ============================================================
     ARRANGE EXISTING DOM ELEMENTS
     ============================================================ */

  function arrange() {
    const screen = $(SCREEN);
    const shell = screen?.querySelector(
      ".mana-profile-shell"
    );

    const extended = $(ROOT);
    const save = $("manaProfileSave");

    if (!shell || !extended || !save) {
      return false;
    }

    const personal =
      $("manaProfileName")?.closest(
        ".mana-profile-card"
      );

    const training = shell.querySelector(
      ".mana-profile-training"
    );

    const nutrition = shell.querySelector(
      ".mana-profile-fuel"
    );

    const contact =
      $("me-first_name")?.closest(".me-card");

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

    /*
     Always locate elements by their IDs,
     regardless of where an earlier pass
     moved them.
    */

    setHeading(personal, "Personal Details");
    setHeading(training, "Training Goals");
    setHeading(nutrition, "Nutrition Goals");
    setHeading(photos, "Progression Photos");

    personal.classList.add(
      "mana-personal-merged"
    );

    personal.dataset.manaOrder = "1";
    training.dataset.manaOrder = "2";
    nutrition.dataset.manaOrder = "3";
    photos.dataset.manaOrder = "4";

    /* ---------------------------------------
       1. PERSONAL DETAILS

       Keep the original Profile fields.
       Merge extended contact information.
       --------------------------------------- */

    const avatar = contact.querySelector(
      ".me-avatar-row"
    );

    const personalHeading = Array.from(
      personal.children
    ).find(el => el.tagName === "H3");

    if (
      avatar &&
      avatar.parentElement !== personal &&
      personalHeading
    ) {
      personalHeading.insertAdjacentElement(
        "afterend",
        avatar
      );
    }

    if (contact.parentElement !== personal) {
      personal.appendChild(contact);
    }

    /*
     Keep the extended first / last name
     controls for cloud saving, but avoid
     showing a second First Name field
     alongside the original Name field.

     The First Name field remains present
     and can be populated from the original
     name when changed.
    */

    const firstField = field("me-first_name");

    if (firstField) {
      firstField.style.display = "none";
    }

    const originalName = $("manaProfileName");
    const firstName = $("me-first_name");

    if (
      originalName &&
      firstName &&
      !originalName.dataset.manaNameSync
    ) {
      originalName.dataset.manaNameSync = "1";

      originalName.addEventListener(
        "input",
        () => {
          firstName.value =
            originalName.value.trim().split(/\s+/)[0] || "";
        }
      );
    }

    /*
     Put contact details under a single
     clear subheading inside Personal.
    */

    let contactLabel = personal.querySelector(
      ".mana-contact-heading"
    );

    if (!contactLabel) {
      contactLabel =
        document.createElement("div");

      contactLabel.className =
        "mana-contact-heading";

      contactLabel.textContent =
        "Contact & Emergency Details";

      contact.insertBefore(
        contactLabel,
        contact.querySelector(".me-grid") ||
        contact.firstChild
      );
    }

    /* ---------------------------------------
       2. TRAINING GOALS

       Move training-specific extended
       fields into the Training card.
       --------------------------------------- */

    let extraTraining = training.querySelector(
      "#manaExtraTraining104991"
    );

    if (!extraTraining) {
      extraTraining = document.createElement(
        "div"
      );

      extraTraining.id =
        "manaExtraTraining104991";

      extraTraining.className =
        "mana-extra-field-group";

      training.appendChild(extraTraining);
    }

    [
      "me-target_weight",
      "me-injuries",
      "me-training_preferences"
    ].forEach(id => {
      const element = field(id);

      if (
        element &&
        element.parentElement !== extraTraining
      ) {
        extraTraining.appendChild(element);
      }
    });

    /* ---------------------------------------
       3. NUTRITION GOALS

       Move dietary preferences into
       the existing nutrition card.
       --------------------------------------- */

    let extraNutrition = nutrition.querySelector(
      "#manaExtraNutrition104991"
    );

    if (!extraNutrition) {
      extraNutrition =
        document.createElement("div");

      extraNutrition.id =
        "manaExtraNutrition104991";

      extraNutrition.className =
        "mana-extra-field-group";

      nutrition.appendChild(extraNutrition);
    }

    const dietary = field(
      "me-dietary_preferences"
    );

    if (
      dietary &&
      dietary.parentElement !== extraNutrition
    ) {
      extraNutrition.appendChild(dietary);
    }

    /* ---------------------------------------
       4. PROGRESSION PHOTOS

       Keep the existing photo card inside
       its original root. The upload event
       handlers remain attached.
       --------------------------------------- */

    if (photos.parentElement !== extended) {
      extended.appendChild(photos);
    }

    /*
     Make the order stable even if this
     function is called again on mobile.
    */

    if (
      personal.parentElement === shell &&
      training.parentElement === shell &&
      nutrition.parentElement === shell &&
      extended.parentElement === shell
    ) {
      if (
        training.previousElementSibling !==
        personal
      ) {
        personal.insertAdjacentElement(
          "afterend",
          training
        );
      }

      if (
        nutrition.previousElementSibling !==
        training
      ) {
        training.insertAdjacentElement(
          "afterend",
          nutrition
        );
      }

      if (
        extended.previousElementSibling !==
        nutrition
      ) {
        nutrition.insertAdjacentElement(
          "afterend",
          extended
        );
      }
    }

    /*
     Keep Save & Continue at the end.
    */

    if (
      extended.nextElementSibling !== save &&
      extended.parentElement === save.parentElement
    ) {
      extended.insertAdjacentElement(
        "afterend",
        save
      );
    }

    screen.dataset.manaProfileOrder = BUILD;

    return true;
  }

  /* ============================================================
     PHOTO PREVIEW FOR MOVED AVATAR

     The original profile-photo event was
     attached to the extended root.
     Since the avatar now sits inside Personal,
     retain its preview behaviour directly.
     ============================================================ */

  function installAvatarPreview() {
    const input = $("me-file-avatar");

    if (
      !input ||
      input.dataset.manaPreviewConnected
    ) return;

    input.dataset.manaPreviewConnected = "1";

    input.addEventListener("change", () => {
      const file = input.files?.[0];

      if (!file) return;

      const holder = $("me-preview-avatar");

      if (!holder) return;

      const url = URL.createObjectURL(file);
      const image = document.createElement("img");

      image.src = url;
      image.alt = "Profile photograph";

      image.className = "me-avatar";

      image.addEventListener(
        "load",
        () => URL.revokeObjectURL(url),
        { once: true }
      );

      holder.replaceChildren(image);
    });
  }

  function schedule() {
    attempts.forEach(clearTimeout);
    attempts = [];

    [100, 300, 700, 1200].forEach(delay => {
      attempts.push(
        setTimeout(() => {
          if (arrange()) {
            installAvatarPreview();
          }
        }, delay)
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
        if (!document.hidden) schedule();
      }
    );

    window.addEventListener(
      "pageshow",
      schedule
    );

    console.log(
      "[Mana Movement] Client Profile " +
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
