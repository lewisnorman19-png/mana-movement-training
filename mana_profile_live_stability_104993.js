
/* ==========================================================
   MANA MOVEMENT TRAINING
   PROFILE DROPDOWN + LIVE FUEL REPAIR
   BUILD 104993

   FIXES
   1. Gender selection remains stable
   2. Daily Activity selection remains stable
   3. Dropdown clicks do not retrigger layout
   4. Calories preview updates before saving
   5. Protein preview updates before saving
   6. Selections restored after cloud refresh

   PRESERVES
   - Existing Profile layout 104992
   - Existing Supabase save functions
   - Existing Fuel target storage
   - Coach Hub, Chat and Program Builder
   - Client photo uploads

   Preview calculations do not write
   unsaved calorie/protein targets to cloud.
   ========================================================== */

(() => {
  "use strict";

  const BUILD = "104993";
  const FLAG = "MANA_PROFILE_STABLE_104993";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const $ = id => document.getElementById(id);

  const SCREEN = "manaProfileScreen";
  const PROFILE_KEY = "mana-profile-v67";
  const ACTIVITY_ID = "manaPremiumActivity104981";

  let userId = "";
  let ready = false;
  let restoring = false;
  let observer = null;
  let observedScreen = null;

  let savedGender = "";
  let savedActivity = "";

  const activityFactors = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  function readJSON(key) {
    try {
      return JSON.parse(
        localStorage.getItem(key) || "{}"
      ) || {};
    } catch (_) {
      return {};
    }
  }

  function writeJSON(key, data) {
    localStorage.setItem(
      key,
      JSON.stringify(data)
    );
  }

  function preferenceKey() {
    return userId
      ? "mana-profile-preferences-" + userId
      : "";
  }

  function visible() {
    return !!$(SCREEN)?.classList.contains(
      "open"
    );
  }

  /* ========================================================
     IDENTIFY SIGNED-IN CLIENT
     ======================================================== */

  async function identifyUser() {
    try {
      if (
        typeof window.supabaseClient !==
        "function"
      ) return;

      const client =
        await window.supabaseClient();

      const { data } =
        await client.auth.getUser();

      const nextId =
        data?.user?.id || "";

      if (nextId !== userId) {
        userId = nextId;

        savedGender = "";
        savedActivity = "";

        ready = false;
      }

    } catch (error) {
      console.warn(
        "[Mana Profile] Auth lookup:",
        error
      );
    }
  }

  /* ========================================================
     FIND THE EXISTING DAILY ACTIVITY DROPDOWN
     ======================================================== */

  function activitySelect() {
    const screen = $(SCREEN);
    if (!screen) return null;

    const fields = Array.from(
      screen.querySelectorAll(
        ".mana-profile-field, .me-field"
      )
    );

    for (const field of fields) {
      const label =
        field.querySelector("label");

      const select =
        field.querySelector("select");

      if (
        label &&
        select &&
        label.textContent
          .trim()
          .toLowerCase() ===
          "daily activity"
      ) {
        return select;
      }
    }

    return $(ACTIVITY_ID);
  }

  function normaliseActivity(value, label = "") {
    const text = (
      String(value || "") +
      " " +
      String(label || "")
    ).toLowerCase();

    if (
      /very.active|extremely|extra.active/.test(
        text
      )
    ) return "very_active";

    if (
      /sedentary|mostly.sitting/.test(text)
    ) return "sedentary";

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

  function selectedActivity(select) {
    if (!select) return "";

    return normaliseActivity(
      select.value,
      select.selectedOptions?.[0]?.textContent
    );
  }

  function setActivity(select, value) {
    if (!select || !value) return;

    const options = Array.from(
      select.options
    );

    const match = options.find(option =>
      normaliseActivity(
        option.value,
        option.textContent
      ) === value
    );

    if (match) {
      select.value = match.value;
    }
  }

  /* ========================================================
     SAVE SELECTIONS WITHOUT SAVING WHOLE PROFILE
     ======================================================== */

  function rememberSelections() {
    if (restoring) return;

    const gender =
      $("manaProfileGender")?.value || "";

    const activity =
      selectedActivity(activitySelect());

    if (gender) savedGender = gender;
    if (activity) savedActivity = activity;

    const profile = readJSON(PROFILE_KEY);

    if (
      savedGender &&
      profile.gender !== savedGender
    ) {
      profile.gender = savedGender;
    }

    if (
      savedActivity &&
      profile.dailyActivity !== savedActivity
    ) {
      profile.dailyActivity = savedActivity;
    }

    writeJSON(PROFILE_KEY, profile);

    const key = preferenceKey();

    if (key) {
      writeJSON(key, {
        gender: savedGender,
        dailyActivity: savedActivity
      });
    }
  }

  /* ========================================================
     RESTORE VALUES AFTER PROFILE OR CLOUD RELOAD
     ======================================================== */

  function restoreSelections() {
    if (!visible() || restoring) return;

    restoring = true;

    try {
      const profile = readJSON(PROFILE_KEY);
      const key = preferenceKey();

      const backup = key
        ? readJSON(key)
        : {};

      const gender =
        savedGender ||
        backup.gender ||
        profile.gender ||
        "";

      const activity =
        savedActivity ||
        backup.dailyActivity ||
        profile.dailyActivity ||
        "";

      const genderSelect =
        $("manaProfileGender");

      if (
        genderSelect &&
        gender &&
        genderSelect.value !== gender
      ) {
        genderSelect.value = gender;
      }

      const activityField =
        activitySelect();

      if (
        activityField &&
        activity &&
        selectedActivity(activityField) !==
          activity
      ) {
        setActivity(
          activityField,
          activity
        );
      }

      const custom =
        $(ACTIVITY_ID);

      if (
        custom &&
        activity &&
        custom.value !== activity
      ) {
        custom.value = activity;
      }

      if (gender) {
        profile.gender = gender;
        savedGender = gender;
      }

      if (activity) {
        profile.dailyActivity = activity;
        savedActivity = activity;
      }

      writeJSON(PROFILE_KEY, profile);

    } finally {
      restoring = false;
    }

    updatePreview();
  }

  /* ========================================================
     LIVE CALORIE / PROTEIN PREVIEW

     Same calculation approach used by
     Mana Movement's current Profile and
     104981 Fuel target implementation.

     Calculates from current form values,
     not previously saved values.
     ======================================================== */

  function updatePreview() {
    if (!visible()) return;

    const age =
      Number($("manaProfileAge")?.value);

    const height =
      Number($("manaProfileHeight")?.value);

    const weight =
      Number($("manaProfileWeight")?.value);

    const days =
      Number($("manaProfileDays")?.value);

    const gender =
      $("manaProfileGender")?.value || "";

    const foodGoal = (
      $("manaProfileFuelGoal")?.value ||
      "Maintenance"
    ).toLowerCase();

    const caloriesBox =
      $("manaProfileFuelCalories");

    const proteinBox =
      $("manaProfileFuelProtein");

    if (!caloriesBox || !proteinBox) return;

    if (
      !age ||
      !height ||
      !weight ||
      !gender
    ) {
      caloriesBox.textContent =
        "Complete personal details";

      proteinBox.textContent = "—";

      return;
    }

    const base =
      10 * weight +
      6.25 * height -
      5 * age;

    let bmr;

    if (gender.toLowerCase() === "male") {
      bmr = base + 5;
    } else if (
      gender.toLowerCase() === "female"
    ) {
      bmr = base - 161;
    } else {
      bmr = base - 78;
    }

    let factor =
      days >= 5 ? 1.7 :
      days === 4 ? 1.6 :
      days === 3 ? 1.5 : 1.4;

    const activity =
      selectedActivity(activitySelect());

    if (activityFactors[activity]) {
      factor = activityFactors[activity];
    }

    let calories = bmr * factor;
    let proteinFactor = 1.6;

    if (foodGoal === "weight loss") {
      calories *= 0.85;
      proteinFactor = 2.0;
    }

    if (foodGoal === "build muscle") {
      calories *= 1.08;
      proteinFactor = 1.8;
    }

    const calorieTarget =
      Math.round(calories / 50) * 50;

    const proteinTarget =
      Math.round(weight * proteinFactor);

    caloriesBox.textContent =
      calorieTarget.toLocaleString() +
      " cal";

    proteinBox.textContent =
      proteinTarget + "g";
  }

  /* ========================================================
     FIELD CHANGES
     ======================================================== */

  function handleChange(event) {
    if (!visible()) return;

    const field = event.target;

    if (!field || !field.id) return;

    if (
      field.id === "manaProfileGender" ||
      field.id === ACTIVITY_ID ||
      field === activitySelect()
    ) {
      rememberSelections();
    }

    if (
      [
        "manaProfileAge",
        "manaProfileGender",
        "manaProfileHeight",
        "manaProfileWeight",
        "manaProfileDays",
        "manaProfileFuelGoal",
        ACTIVITY_ID
      ].includes(field.id) ||
      field === activitySelect()
    ) {
      updatePreview();
    }
  }

  /* ========================================================
     PROTECT NATIVE DROPDOWN INTERACTION

     104992 schedules layout operations
     from document-level click events.

     Stop SELECT clicks from triggering
     those layout operations.

     Do not prevent default selection.
     Do not stop change events.
     ======================================================== */

  function protectDropdowns(screen) {
    if (screen.dataset.manaDropdownGuard) {
      return;
    }

    screen.dataset.manaDropdownGuard = "1";

    screen.addEventListener(
      "click",
      event => {
        if (
          event.target.closest?.("select")
        ) {
          event.stopPropagation();
        }
      }
    );
  }

  /* ========================================================
     WATCH PROFILE OPEN / CLOSE ONLY

     No page-wide MutationObserver.
     ======================================================== */

  function watchScreen() {
    const screen = $(SCREEN);

    if (!screen) return;

    protectDropdowns(screen);

    if (screen === observedScreen) return;

    observer?.disconnect();

    observedScreen = screen;

    observer = new MutationObserver(() => {
      if (visible()) {
        void openProfileRestore();
      }
    });

    observer.observe(screen, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  async function openProfileRestore() {
    await identifyUser();

    if (!visible()) return;

    if (!ready) {
      const profile = readJSON(PROFILE_KEY);
      const key = preferenceKey();

      const backup = key
        ? readJSON(key)
        : {};

      savedGender =
        backup.gender ||
        profile.gender ||
        "";

      savedActivity =
        backup.dailyActivity ||
        profile.dailyActivity ||
        "";

      ready = true;
    }

    restoreSelections();

    /*
     Existing profile code can populate
     fields shortly after opening.
    */

    setTimeout(restoreSelections, 150);
    setTimeout(restoreSelections, 600);
  }

  /* ========================================================
     INITIALISE
     ======================================================== */

  function init() {
    watchScreen();

    const screen = $(SCREEN);

    if (screen) {
      screen.addEventListener(
        "change",
        handleChange
      );

      screen.addEventListener(
        "input",
        handleChange
      );
    }

    document.addEventListener(
      "click",
      event => {
        if (
          event.target.closest?.(
            "#manaProfileSave"
          )
        ) {
          rememberSelections();
          updatePreview();
        }
      },
      true
    );

    window.addEventListener(
      "mana:profile-synced",
      () => {
        if (visible()) {
          setTimeout(
            restoreSelections,
            100
          );
        }
      }
    );

    document.addEventListener(
      "visibilitychange",
      () => {
        if (!document.hidden && visible()) {
          void openProfileRestore();
        }
      }
    );

    if (visible()) {
      void openProfileRestore();
    }

    console.log(
      "[Mana Movement] Profile Stability " +
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
