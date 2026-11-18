
/* =====================================================
   MANA MOVEMENT TRAINING
   CLIENT PROFILE — PREMIUM SECTION ORDER
   BUILD 104990

   ORDER
   1. Personal Details + Profile Photo
   2. Training Goals
   3. Nutrition Goals
   4. Progression Photos

   SAFETY
   - Moves existing elements only
   - No duplicated inputs
   - No cloud writes
   - No replacement of save functions
   - No View Client changes
   - No changes to photo upload handlers
   - No continuous polling
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104990";
  const FLAG = "MANA_PROFILE_ORDER_104990";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const $ = id => document.getElementById(id);

  const SCREEN = "manaProfileScreen";
  const EXTENDED = "manaExtendedClient104901";
  const STYLE = "manaProfileOrderStyle104990";

  let pending = [];

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      /* MAIN PROFILE */

      #${SCREEN} .mana-profile-shell {
        width: 100%;
        box-sizing: border-box;
      }

      #${SCREEN} .mana-profile-card,
      #${SCREEN} #${EXTENDED} .me-card {
        background: #15171B !important;
        border: 1px solid #4C5560 !important;
        border-radius: 16px !important;
        padding: 15px !important;
        margin: 12px 0 !important;
        box-shadow: none !important;
      }

      #${SCREEN} .mana-profile-card h3,
      #${SCREEN} #${EXTENDED} h3 {
        color: #FFFFFF !important;
        font-size: 18px !important;
        margin: 0 0 13px !important;
      }

      /* MERGED PERSONAL DETAILS */

      #${SCREEN} .mana-personal-merged
      .me-card {
        background: transparent !important;
        border: 0 !important;
        border-radius: 0 !important;
        padding: 0 !important;
        margin: 14px 0 0 !important;
        box-shadow: none !important;
      }

      #${SCREEN} .mana-personal-merged
      .me-card > h3 {
        color: #FF7927 !important;
        font-size: 12px !important;
        font-weight: 900 !important;
        letter-spacing: .08em !important;
        text-transform: uppercase !important;
        margin: 0 0 12px !important;
      }

      #${SCREEN} .mana-personal-merged
      .me-avatar-row {
        margin: 10px 0 16px !important;
        padding-bottom: 15px !important;
        border-bottom: 1px solid #383F49 !important;
      }

      #${SCREEN} .mana-personal-merged
      .me-grid {
        gap: 10px !important;
      }

      /* TRAINING AND NUTRITION */

      #${SCREEN} .mana-profile-training,
      #${SCREEN} .mana-profile-fuel {
        margin-top: 12px !important;
      }

      #${SCREEN} .mana-profile-training h3,
      #${SCREEN} .mana-profile-fuel h3 {
        color: #FFFFFF !important;
      }

      /* PROGRESSION PHOTOGRAPHS */

      #${SCREEN} #${EXTENDED} {
        display: block;
        width: 100%;
        margin: 0;
        padding: 0;
      }

      #${SCREEN} #${EXTENDED}
      .me-photo-grid {
        display: grid;
        grid-template-columns:
          repeat(3,minmax(0,1fr));
        gap: 8px;
      }

      #${SCREEN} #${EXTENDED}
      .me-photo-card {
        background: #101215 !important;
        border: 1px solid #424A55 !important;
        border-radius: 10px !important;
      }

      #${SCREEN} #${EXTENDED}
      .me-photo-preview {
        max-height: 190px !important;
      }

      /* SECTION HEADINGS */

      #${SCREEN} .mana-profile-section-label {
        display: block;
        color: #FF7927;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: .1em;
        text-transform: uppercase;
        margin: 0 0 9px;
      }

      /* MOBILE */

      @media (max-width: 600px) {

        #${SCREEN} .mana-profile-card,
        #${SCREEN} #${EXTENDED} .me-card {
          padding: 13px !important;
        }

        #${SCREEN} .mana-personal-merged
        .me-card {
          padding: 0 !important;
        }

        #${SCREEN} .mana-personal-merged
        .me-grid {
          grid-template-columns: 1fr;
          gap: 9px !important;
        }

        #${SCREEN} #${EXTENDED}
        .me-photo-grid {
          gap: 5px;
        }

        #${SCREEN} #${EXTENDED}
        .me-photo-card {
          padding: 5px;
        }

        #${SCREEN} #${EXTENDED}
        .me-photo-preview {
          max-height: 160px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* =====================================================
     FIND EXISTING PROFILE SECTIONS
     ===================================================== */

  function findSections() {
    const screen = $(SCREEN);
    const shell = screen?.querySelector(
      ".mana-profile-shell"
    );

    const extended = $(EXTENDED);

    if (!shell || !extended) return null;

    const training = shell.querySelector(
      ".mana-profile-training"
    );

    const nutrition = shell.querySelector(
      ".mana-profile-fuel"
    );

    const personalInput =
      $("manaProfileName");

    const personal = personalInput?.closest(
      ".mana-profile-card"
    );

    if (
      !personal ||
      !training ||
      !nutrition ||
      !shell.contains(personal) ||
      !shell.contains(training) ||
      !shell.contains(nutrition)
    ) {
      return null;
    }

    return {
      shell,
      extended,
      personal,
      training,
      nutrition
    };
  }

  /* =====================================================
     RESTORE PROFILE ORDER
     ===================================================== */

  function arrange() {
    const sections = findSections();

    if (!sections) return false;

    const {
      shell,
      extended,
      personal,
      training,
      nutrition
    } = sections;

    /*
     The extended-profile script creates
     two existing sections:
       1. Contact details and profile photo
       2. Progression photos

     Keep the original nodes, inputs and
     their existing event listeners.
    */

    const contact = extended.querySelector(
      ".me-card"
    );

    const photos = Array.from(
      extended.children
    ).find(node =>
      node.classList.contains("me-card")
    );

    /*
     Locate the photo card by its upload
     controls, not only by its position.
    */

    const photoCard = Array.from(
      extended.querySelectorAll(".me-card")
    ).find(node =>
      node.querySelector(
        "#me-file-baseline-front"
      )
    );

    const contactCard = contact;

    if (!contactCard || !photoCard) {
      return false;
    }

    /*
     First: personal details
    */

    personal.classList.add(
      "mana-personal-merged"
    );

    /*
     Move profile photo ABOVE the main
     personal fields.
    */

    const avatar = contactCard.querySelector(
      ".me-avatar-row"
    );

    const personalHeading =
      personal.querySelector("h3");

    if (
      avatar &&
      personalHeading &&
      avatar.parentElement !== personal
    ) {
      personalHeading.insertAdjacentElement(
        "afterend",
        avatar
      );
    }

    /*
     Move the remaining contact fields
     into the existing Personal card.
     This eliminates the separate
     contact card further down.
    */

    if (
      contactCard.parentElement !== personal
    ) {
      personal.appendChild(contactCard);
    }

    /*
     Update the contact subheading.
    */

    const contactHeading =
      contactCard.querySelector("h3");

    if (contactHeading) {
      contactHeading.textContent =
        "Contact & Emergency Details";
    }

    /*
     Second: Training Goals
    */

    const trainingHeading =
      training.querySelector("h3");

    if (trainingHeading) {
      trainingHeading.textContent =
        "Training Goals";
    }

    if (
      training.previousElementSibling !==
      personal
    ) {
      personal.insertAdjacentElement(
        "afterend",
        training
      );
    }

    /*
     Third: Nutrition Goals
    */

    const nutritionHeading =
      nutrition.querySelector("h3");

    if (nutritionHeading) {
      nutritionHeading.textContent =
        "Nutrition Goals";
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

    /*
     Fourth: Progression Photos.

     The extended-profile root remains
     responsible for the photo fields,
     sharing checkbox and save status.
    */

    const photoHeading =
      photoCard.querySelector("h3");

    if (photoHeading) {
      photoHeading.textContent =
        "Progression Photos";
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

    /*
     No values are reset and no form
     elements are recreated.
    */

    screenReady();

    return true;
  }

  function screenReady() {
    const screen = $(SCREEN);

    if (!screen) return;

    screen.dataset.manaProfileOrder =
      BUILD;
  }

  /* =====================================================
     PROFILE OPEN / MOBILE RE-ENTRY

     A few bounded attempts allow for
     the original Profile and extended
     components to mount asynchronously.

     No permanent observer or polling.
     ===================================================== */

  function schedule() {
    pending.forEach(clearTimeout);
    pending = [];

    [100, 300, 700, 1400].forEach(delay => {
      pending.push(
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
        /*
         Do not intercept the click
         or interfere with navigation.
        */

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
      "[Mana Movement] Client Profile Order " +
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
