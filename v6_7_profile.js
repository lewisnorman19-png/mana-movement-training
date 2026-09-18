/* =========================================
   MANA MOVEMENT TRAINING v6.7.5
   MASTER PROFILE

   PERSONAL DETAILS
   TRAINING SETUP
   FUEL GOALS
   ========================================= */

(() => {
  "use strict";

  const STYLE_ID =
    "mana-profile-v675-style";

  const PROFILE_ID =
    "manaProfileScreen";

  const STORE_KEY =
    "mana-profile-v67";

  const TARGET_KEY =
    "mana-fuel-v58-targets";

  let returnTo =
    "home";


  function safeJson(raw, fallback) {
    try {
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }


  function loadProfile() {
    return safeJson(
      localStorage.getItem(
        STORE_KEY
      ) || "{}",
      {}
    );
  }


  function saveProfile(profile) {
    localStorage.setItem(
      STORE_KEY,
      JSON.stringify(profile)
    );
  }


  function saveFuelTargets(targets) {
    localStorage.setItem(
      TARGET_KEY,
      JSON.stringify(targets)
    );
  }


  /* =========================================
     FUEL TARGET CALCULATION
     ========================================= */

  function calculateFuelTargets(profile) {
    const age =
      Number(profile.age || 0);

    const height =
      Number(profile.height || 0);

    const weight =
      Number(profile.weight || 0);

    const days =
      Number(profile.days || 0);

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

      Male:
      10W + 6.25H - 5A + 5

      Female:
      10W + 6.25H - 5A - 161

      For non-binary / prefer not to say,
      use the midpoint between both equations.
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

      bmr =
        base - 78;
    }


    let activity =
      1.4;


    if (days === 3) {
      activity = 1.5;
    }

    if (days === 4) {
      activity = 1.6;
    }

    if (days >= 5) {
      activity = 1.7;
    }


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
      Math.round(
        weight *
        proteinPerKg
      );


    return {
      calories:
        Math.round(
          calories /
          50
        ) * 50,

      protein,

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


  function updateFuelPreview() {
    const age =
      Number(
        document
          .getElementById(
            "manaProfileAge"
          )
          ?.value || 0
      );

    const gender =
      document
        .getElementById(
          "manaProfileGender"
        )
        ?.value || "";

    const height =
      Number(
        document
          .getElementById(
            "manaProfileHeight"
          )
          ?.value || 0
      );

    const weight =
      Number(
        document
          .getElementById(
            "manaProfileWeight"
          )
          ?.value || 0
      );

    const days =
      document
        .getElementById(
          "manaProfileDays"
        )
        ?.value || "";

    const fuelGoal =
      document
        .getElementById(
          "manaProfileFuelGoal"
        )
        ?.value || "";


    const targets =
      calculateFuelTargets({
        age,
        gender,
        height,
        weight,
        days,
        fuelGoal
      });


    const calories =
      document.getElementById(
        "manaProfileFuelCalories"
      );

    const protein =
      document.getElementById(
        "manaProfileFuelProtein"
      );


    if (!targets) {

      if (calories) {
        calories.textContent =
          "Complete personal details";
      }

      if (protein) {
        protein.textContent =
          "—";
      }

      return;
    }


    if (calories) {
      calories.textContent =
        `${targets.calories.toLocaleString()} cal`;
    }


    if (protein) {
      protein.textContent =
        `${targets.protein}g`;
    }
  }


  /* =========================================
     STYLES
     ========================================= */

  function injectStyles() {
    if (
      document.getElementById(
        STYLE_ID
      )
    ) return;


    const style =
      document.createElement(
        "style"
      );


    style.id =
      STYLE_ID;


    style.textContent = `

      #${PROFILE_ID}{
        position:fixed;
        inset:0;
        z-index:25000;
        display:none;
        overflow:auto;
        background:#050505;

        padding:
          calc(env(safe-area-inset-top) + 18px)
          18px
          calc(105px + env(safe-area-inset-bottom));
      }


      #${PROFILE_ID}.open{
        display:block;
      }


      .mana-profile-shell{
        width:min(520px,100%);
        margin:auto;
      }


      .mana-profile-head{
        display:flex;
        justify-content:space-between;
        align-items:flex-start;
        gap:16px;
        margin-bottom:18px;
      }


      .mana-profile-head h1{
        margin:6px 0 4px;
        font-size:32px;
      }


      .mana-profile-close{
        width:44px;
        height:44px;
        flex:0 0 44px;
        border-radius:50%;
        border:1px solid #333;
        background:#111;
        color:#fff;
        font-size:24px;
      }


      .mana-profile-card{
        background:#101010;
        border:1px solid #292929;
        border-radius:20px;
        padding:16px;
        margin:12px 0;
      }


      .mana-profile-card h3{
        margin:0 0 12px;
      }


      .mana-profile-training,
      .mana-profile-fuel{
        border:
          1px solid
          rgba(243,216,117,.35);

        background:
          linear-gradient(
            145deg,
            #17150d,
            #0c0c0c
          );
      }


      .mana-profile-training h3,
      .mana-profile-fuel h3{
        color:#f3d875;
        text-transform:uppercase;
        letter-spacing:.05em;
      }


      .mana-profile-grid{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:10px;
      }


      .mana-profile-field{
        margin-bottom:12px;
      }


      .mana-profile-field label{
        display:block;
        margin-bottom:6px;
        color:#aaa;
        font-size:12px;
        font-weight:700;
      }


      .mana-profile-field input,
      .mana-profile-field select{
        width:100%;
        min-height:50px;
        margin:0 !important;
        padding:12px 14px;
        border-radius:13px;
        border:1px solid #333;
        background:#090909;
        color:#fff;
        font-size:15px;
      }


      .mana-profile-fuel-targets{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:10px;
        margin-top:4px;
      }


      .mana-profile-fuel-target{
        padding:14px;
        border:1px solid #292929;
        border-radius:15px;
        background:#090909;
      }


      .mana-profile-fuel-target span{
        display:block;
        color:#888;
        font-size:11px;
        margin-bottom:5px;
      }


      .mana-profile-fuel-target strong{
        display:block;
        color:#f3d875;
        font-size:20px;
      }


      .mana-profile-fuel-note{
        margin-top:10px;
        color:#777;
        font-size:10px;
        line-height:1.45;
      }


      .mana-profile-save{
        width:100%;
        min-height:58px;
        border:0;
        border-radius:16px;
        margin-top:8px;
        background:#f3d875;
        color:#111;
        font-size:17px;
        font-weight:900;
      }


      .mana-profile-status{
        min-height:22px;
        margin-top:8px;
        text-align:center;
        color:#f3d875;
        font-size:13px;
      }


      @media(max-width:330px){

        .mana-profile-grid,
        .mana-profile-fuel-targets{
          grid-template-columns:1fr;
        }

      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* =========================================
     BUILD PROFILE
     ========================================= */

  function ensureProfileScreen() {
    if (
      document.getElementById(
        PROFILE_ID
      )
    ) return;


    const screen =
      document.createElement(
        "div"
      );


    screen.id =
      PROFILE_ID;


    screen.innerHTML = `

      <div class="mana-profile-shell">


        <div class="mana-profile-head">

          <div>

            <span class="pill">
              MANA PROFILE
            </span>

            <h1>
              Your profile
            </h1>

            <div class="muted">
              Your personal, training and fuel setup.
            </div>

          </div>


          <button
            type="button"
            class="mana-profile-close"
            id="manaProfileClose"
          >
            ×
          </button>

        </div>


        <!-- PERSONAL DETAILS -->

        <div class="mana-profile-card">

          <h3>
            Personal details
          </h3>


          <div class="mana-profile-field">

            <label>
              Name
            </label>

            <input
              type="text"
              id="manaProfileName"
              placeholder="Your name"
            />

          </div>


          <div class="mana-profile-grid">


            <div class="mana-profile-field">

              <label>
                Age
              </label>

              <input
                type="number"
                id="manaProfileAge"
                min="12"
                max="100"
                placeholder="Age"
              />

            </div>


            <div class="mana-profile-field">

              <label>
                Gender
              </label>

              <select
                id="manaProfileGender"
              >

                <option value="">
                  Select
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Non-binary">
                  Non-binary
                </option>

                <option value="Prefer not to say">
                  Prefer not to say
                </option>

              </select>

            </div>


            <div class="mana-profile-field">

              <label>
                Height cm
              </label>

              <input
                type="number"
                id="manaProfileHeight"
                min="100"
                max="230"
                placeholder="Height"
              />

            </div>


            <div class="mana-profile-field">

              <label>
                Weight kg
              </label>

              <input
                type="number"
                id="manaProfileWeight"
                min="30"
                max="300"
                step="0.1"
                placeholder="Weight"
              />

            </div>

          </div>

        </div>


        <!-- TRAINING -->

        <div
          class="
            mana-profile-card
            mana-profile-training
          "
        >

          <h3>
            Training setup
          </h3>


          <div class="mana-profile-grid">


            <div class="mana-profile-field">

              <label>
                Training goal
              </label>

              <select
                id="manaProfileGoal"
              >

                <option value="">
                  Select goal
                </option>

                <option value="Build muscle">
                  Build muscle
                </option>

                <option value="Get stronger">
                  Get stronger
                </option>

                <option value="General fitness">
                  General fitness
                </option>

                <option value="Return to training">
                  Return to training
                </option>

              </select>

            </div>


            <div class="mana-profile-field">

              <label>
                Training days
              </label>

              <select
                id="manaProfileDays"
              >

                <option value="">
                  Select
                </option>

                <option value="2">
                  2 days
                </option>

                <option value="3">
                  3 days
                </option>

                <option value="4">
                  4 days
                </option>

                <option value="5">
                  5 days
                </option>

              </select>

            </div>


            <div class="mana-profile-field">

              <label>
                Experience
              </label>

              <select
                id="manaProfileExperience"
              >

                <option value="">
                  Select
                </option>

                <option value="Beginner">
                  Beginner
                </option>

                <option value="Intermediate">
                  Intermediate
                </option>

                <option value="Experienced">
                  Experienced
                </option>

                <option value="Returning">
                  Returning
                </option>

              </select>

            </div>


            <div class="mana-profile-field">

              <label>
                Equipment
              </label>

              <select
                id="manaProfileEquipment"
              >

                <option value="">
                  Select
                </option>

                <option value="Full gym">
                  Full gym
                </option>

                <option value="Dumbbells">
                  Dumbbells
                </option>

                <option value="Home basics">
                  Home basics
                </option>

                <option value="Bodyweight">
                  Bodyweight
                </option>

              </select>

            </div>

          </div>

        </div>


        <!-- FUEL -->

        <div
          class="
            mana-profile-card
            mana-profile-fuel
          "
        >

          <h3>
            Fuel goals
          </h3>


          <div class="mana-profile-field">

            <label>
              Food goal
            </label>

            <select
              id="manaProfileFuelGoal"
            >

              <option value="Maintenance">
                Maintenance
              </option>

              <option value="Weight loss">
                Weight loss
              </option>

              <option value="Build muscle">
                Build muscle
              </option>

            </select>

          </div>


          <div class="mana-profile-fuel-targets">

            <div class="mana-profile-fuel-target">

              <span>
                Daily calories
              </span>

              <strong
                id="manaProfileFuelCalories"
              >
                —
              </strong>

            </div>


            <div class="mana-profile-fuel-target">

              <span>
                Daily protein
              </span>

              <strong
                id="manaProfileFuelProtein"
              >
                —
              </strong>

            </div>

          </div>


          <div class="mana-profile-fuel-note">
            These are practical starting estimates
            based on your profile and can be
            adjusted in Fuel.
          </div>

        </div>


        <button
          type="button"
          class="mana-profile-save"
          id="manaProfileSave"
        >
          SAVE PROFILE
        </button>


        <div
          class="mana-profile-status"
          id="manaProfileStatus"
        ></div>


      </div>

    `;


    document.body.appendChild(
      screen
    );


    document
      .getElementById(
        "manaProfileClose"
      )
      .onclick =
        closeProfile;


    document
      .getElementById(
        "manaProfileSave"
      )
      .onclick =
        handleSave;


    [
      "manaProfileAge",
      "manaProfileGender",
      "manaProfileHeight",
      "manaProfileWeight",
      "manaProfileDays",
      "manaProfileFuelGoal"
    ].forEach(
      id => {

        document
          .getElementById(id)
          ?.addEventListener(
            "change",
            updateFuelPreview
          );

        document
          .getElementById(id)
          ?.addEventListener(
            "input",
            updateFuelPreview
          );

      }
    );
  }


  function populateProfile() {
    const profile =
      loadProfile();


    document.getElementById(
      "manaProfileName"
    ).value =
      profile.name || "";


    document.getElementById(
      "manaProfileAge"
    ).value =
      profile.age || "";


    document.getElementById(
      "manaProfileGender"
    ).value =
      profile.gender || "";


    document.getElementById(
      "manaProfileHeight"
    ).value =
      profile.height || "";


    document.getElementById(
      "manaProfileWeight"
    ).value =
      profile.weight || "";


    document.getElementById(
      "manaProfileGoal"
    ).value =
      profile.goal || "";


    document.getElementById(
      "manaProfileDays"
    ).value =
      profile.days || "";


    document.getElementById(
      "manaProfileExperience"
    ).value =
      profile.experience || "";


    document.getElementById(
      "manaProfileEquipment"
    ).value =
      profile.equipment || "";


    document.getElementById(
      "manaProfileFuelGoal"
    ).value =
      profile.fuelGoal ||
      "Maintenance";


    updateFuelPreview();
  }


  function handleSave() {
    const previous =
      loadProfile();


    const profile = {

      ...previous,

      name:
        document
          .getElementById(
            "manaProfileName"
          )
          .value
          .trim(),

      age:
        Number(
          document
            .getElementById(
              "manaProfileAge"
            )
            .value || 0
        ),

      gender:
        document
          .getElementById(
            "manaProfileGender"
          )
          .value,

      height:
        Number(
          document
            .getElementById(
              "manaProfileHeight"
            )
            .value || 0
        ),

      weight:
        Number(
          document
            .getElementById(
              "manaProfileWeight"
            )
            .value || 0
        ),

      goal:
        document
          .getElementById(
            "manaProfileGoal"
          )
          .value,

      days:
        document
          .getElementById(
            "manaProfileDays"
          )
          .value,

      experience:
        document
          .getElementById(
            "manaProfileExperience"
          )
          .value,

      equipment:
        document
          .getElementById(
            "manaProfileEquipment"
          )
          .value,

      fuelGoal:
        document
          .getElementById(
            "manaProfileFuelGoal"
          )
          .value,

      updatedAt:
        new Date()
          .toISOString()

    };


    saveProfile(profile);


    const targets =
      calculateFuelTargets(
        profile
      );


    if (targets) {
      saveFuelTargets(
        targets
      );
    }


    const status =
      document.getElementById(
        "manaProfileStatus"
      );


    if (status) {

      status.textContent =
        "Profile and Fuel targets saved ✓";


      setTimeout(
        () => {

          status.textContent =
            "";

        },
        1600
      );
    }


    window.dispatchEvent(
      new CustomEvent(
        "mana:profile-synced"
      )
    );


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
        80
      );
    }
  }


  function strengthIsOpen() {
    const shell =
      document.getElementById(
        "manaV83ProgramShell"
      );

    const title =
      document.getElementById(
        "manaV83Title"
      );


    return Boolean(
      shell
        ?.classList
        .contains(
          "open"
        ) &&

      title
        ?.textContent
        .trim()
        .toUpperCase() ===
        "MANA STRENGTH"
    );
  }


  function openProfile() {
    ensureProfileScreen();


    returnTo =
      strengthIsOpen()
        ? "strength"
        : "home";


    populateProfile();


    document
      .getElementById(
        PROFILE_ID
      )
      .classList
      .add(
        "open"
      );
  }


  window.openManaProfile =
    openProfile;


  function closeProfile() {
    document
      .getElementById(
        PROFILE_ID
      )
      ?.classList
      .remove(
        "open"
      );


    if (
      returnTo ===
      "strength" &&
      typeof
        window
          .openManaProgram ===
      "function"
    ) {

      window.openManaProgram(
        "strength"
      );
    }


    returnTo =
      "home";
  }


  function findProfileTab() {
    const candidates =
      [
        ...document.querySelectorAll(
          "button, [role='button'], nav *"
        )
      ];


    return candidates.find(
      el =>
        (
          el.textContent ||
          ""
        )
          .trim()
          .toLowerCase() ===
        "profile"
    );
  }


  function wireExistingProfileTab() {
    const tab =
      findProfileTab();


    if (
      !tab ||
      tab.dataset
        .manaProfileWired ===
      "1"
    ) {
      return;
    }


    tab.dataset
      .manaProfileWired =
      "1";


    tab.addEventListener(
      "click",
      event => {

        event.preventDefault();

        event.stopPropagation();

        openProfile();

      },
      true
    );
  }


  function init() {
    injectStyles();

    ensureProfileScreen();


    setInterval(
      wireExistingProfileTab,
      600
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
