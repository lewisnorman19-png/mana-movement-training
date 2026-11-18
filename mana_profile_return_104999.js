
/* =====================================================
   MANA MOVEMENT
   PROFILE RETURN AND LAYOUT STABILITY
   BUILD 104999

   - Restores premium Profile arrangement
   - Runs when the Profile reopens
   - Preserves position when changing tabs/apps
   - Starts at top when newly opening Profile
   - Does not recreate or reset form inputs
   - Preserves photo camera and uploads
   - Preserves gender and daily activity
   - Preserves live nutrition calculations
   - No cloud writes or navigation overrides
   ===================================================== */

(() => {
  "use strict";

  const FLAG = "MANA_PROFILE_RETURN_104999";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const $ = id => document.getElementById(id);
  const SCREEN = "manaProfileScreen";
  const EXTENDED = "manaExtendedClient104901";

  let observed = null;
  let observer = null;
  let wasOpen = false;
  let jobs = [];
  let lastScroll = 0;

  function isOpen(screen) {
    return !!screen?.classList.contains("open");
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

  function moveAfter(node, anchor) {
    if (!node || !anchor) return;

    if (
      node.previousElementSibling !== anchor
    ) {
      anchor.insertAdjacentElement(
        "afterend",
        node
      );
    }
  }

  function field(id) {
    return $(id)?.closest(
      ".me-field, .mana-profile-field"
    );
  }

  function ensureRow(id, parent) {
    let row = $(id);

    if (!row) {
      row = document.createElement("div");
      row.id = id;
      row.className = "mana-paired-fields";
    }

    move(row, parent);
    return row;
  }

  function arrange() {
    const screen = $(SCREEN);

    if (!screen || !isOpen(screen)) {
      return false;
    }

    const shell = screen.querySelector(
      ".mana-profile-shell"
    );

    const extended = $(EXTENDED);

    const personal =
      $("manaProfileName")?.closest(
        ".mana-profile-card"
      );

    const training =
      screen.querySelector(
        ".mana-profile-training"
      );

    const nutrition =
      screen.querySelector(
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
      !shell ||
      !extended ||
      !personal ||
      !training ||
      !nutrition ||
      !contact ||
      !photos
    ) {
      return false;
    }

    const scrollContainer =
      screen.scrollHeight > screen.clientHeight
        ? screen
        : document.scrollingElement;

    const position =
      scrollContainer?.scrollTop || 0;

    /* Personal details */

    personal.classList.add(
      "mana-personal-merged"
    );

    move(contact, personal);

    const heading =
      Array.from(personal.children)
        .find(node => node.tagName === "H3");

    if (heading) {
      heading.textContent = "Personal Details";
    }

    const avatar =
      $("me-preview-avatar")?.closest(
        ".me-avatar-row"
      );

    if (
      heading &&
      avatar &&
      avatar.parentElement !== personal
    ) {
      heading.insertAdjacentElement(
        "afterend",
        avatar
      );
    }

    const originalName = field(
      "manaProfileName"
    );

    if (originalName) {
      originalName.style.display = "none";
    }

    const contactGrid =
      contact.querySelector(".me-grid");

    if (contactGrid) {
      const names = ensureRow(
        "manaNameRow104992",
        contactGrid
      );

      move(field("me-first_name"), names);
      move(field("me-last_name"), names);

      if (
        contactGrid.firstElementChild !== names
      ) {
        contactGrid.insertBefore(
          names,
          contactGrid.firstChild
        );
      }

      const dobAge = ensureRow(
        "manaDobAgeRow104992",
        contactGrid
      );

      move(field("me-dob"), dobAge);
      move(field("manaProfileAge"), dobAge);

      moveAfter(dobAge, names);
    }

    /* Training Goals */

    const trainingHeading =
      training.querySelector("h3");

    if (trainingHeading) {
      trainingHeading.textContent =
        "Training Goals";
    }

    const trainingExtra = ensureRow(
      "manaExtraTraining104991",
      training
    );

    trainingExtra.className =
      "mana-extra-field-group";

    const weights = ensureRow(
      "manaWeightRow104992",
      trainingExtra
    );

    move(field("manaProfileWeight"), weights);
    move(field("me-target_weight"), weights);

    if (
      trainingExtra.firstElementChild !== weights
    ) {
      trainingExtra.insertBefore(
        weights,
        trainingExtra.firstChild
      );
    }

    move(
      field("me-injuries"),
      trainingExtra
    );

    move(
      field("me-training_preferences"),
      trainingExtra
    );

    /* Nutrition Goals */

    const nutritionHeading =
      nutrition.querySelector("h3");

    if (nutritionHeading) {
      nutritionHeading.textContent =
        "Nutrition Goals";
    }

    const nutritionExtra = $(
      "manaExtraNutrition104991"
    ) || document.createElement("div");

    nutritionExtra.id =
      "manaExtraNutrition104991";

    nutritionExtra.className =
      "mana-extra-field-group";

    move(nutritionExtra, nutrition);

    move(
      field("me-dietary_preferences"),
      nutritionExtra
    );

    /* Progression Photos */

    const photoHeading =
      photos.querySelector("h3");

    if (photoHeading) {
      photoHeading.textContent =
        "Progression Photos";
    }

    move(photos, extended);

    /* Four permanent sections */

    if (
      personal.parentElement === shell &&
      training.parentElement === shell &&
      nutrition.parentElement === shell &&
      extended.parentElement === shell
    ) {
      moveAfter(training, personal);
      moveAfter(nutrition, training);
      moveAfter(extended, nutrition);
    }

    const save = $("manaProfileSave");

    if (
      save &&
      save.parentElement ===
        extended.parentElement
    ) {
      moveAfter(save, extended);
    }

    screen.dataset.manaProfileOrder =
      "104999";

    /*
     Keep the viewing position unchanged
     during an automatic layout repair.
    */

    if (scrollContainer) {
      scrollContainer.scrollTop = position;
    }

    return true;
  }

  function cancelJobs() {
    jobs.forEach(clearTimeout);
    jobs = [];
  }

  function schedule() {
    cancelJobs();

    [0, 100, 300, 750].forEach(delay => {
      jobs.push(
        setTimeout(arrange, delay)
      );
    });
  }

  function profileChanged() {
    const screen = $(SCREEN);
    const open = isOpen(screen);

    if (open && !wasOpen) {
      /*
       A genuinely new Profile opening
       begins at the top.
      */

      wasOpen = true;
      lastScroll = 0;

      if (screen) {
        screen.scrollTop = 0;
      }

      schedule();

    } else if (!open && wasOpen) {
      wasOpen = false;
      cancelJobs();
    }
  }

  function observeProfile() {
    const screen = $(SCREEN);

    if (!screen || screen === observed) {
      return;
    }

    observer?.disconnect();

    observed = screen;

    wasOpen = isOpen(screen);

    observer = new MutationObserver(
      profileChanged
    );

    observer.observe(screen, {
      attributes: true,
      attributeFilter: ["class"]
    });

    if (wasOpen) schedule();
  }

  function init() {
    observeProfile();

    /*
     Existing Profile opener creates the
     screen before this code runs.
     Check again on navigation if needed.
    */

    document.addEventListener(
      "click",
      event => {
        const target = event.target;

        if (
          target.closest?.(
            '[data-open-profile],#manaProfileButton'
          )
        ) {
          setTimeout(() => {
            observeProfile();
            profileChanged();
          }, 0);
        }
      }
    );

    /*
     Changing back from ChatGPT must not
     reset or scroll the Profile.
    */

    document.addEventListener(
      "visibilitychange",
      () => {
        if (!document.hidden && isOpen($(SCREEN))) {
          lastScroll = $(SCREEN)?.scrollTop || 0;
          schedule();
        }
      }
    );

    window.addEventListener(
      "pageshow",
      () => {
        observeProfile();

        if (isOpen($(SCREEN))) {
          schedule();
        }
      }
    );

    console.log(
      "[Mana Movement] Profile Return 104999 active"
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
