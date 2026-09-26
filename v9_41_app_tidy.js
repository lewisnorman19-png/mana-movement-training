/* =========================================
   MANA MOVEMENT TRAINING v9.41.0
   APP TIDY — STRENGTH / FUEL / HOME / AUTH

   STRENGTH
   - Set 1 weight auto-copies to Sets 2 and 3
   - Manual changes to Set 2 / 3 are respected

   FUEL
   - Adds custom meal entry
   - Meal name + calories + protein
   - Works for add and change flows

   HOME
   - Cleaner spacing
   - Mana Life given stronger prominence
   - Removes COMING SOON from Mana Life

   AUTH
   - Prevents login screen appearing below Home
     while the signed-in Home is visible

   STABILITY
   - Standalone upgrade file
   - No database changes
   ========================================= */

(() => {
  "use strict";

  const BUILD = "94100";

  const STYLE_ID =
    "mana-v941-app-tidy-style";

  const HOME_ID =
    "manaV80Home";

  const AUTH_ID =
    "authView";

  const FUEL_KEY =
    "mana-fuel-v571";

  const FUEL_MODAL_ID =
    "manaV93MealModal";

  const CUSTOM_ID =
    "manaV941CustomMeal";

  let fuelMeal = null;
  let fuelEditIndex = null;


  function safeJson(
    raw,
    fallback
  ) {
    try {
      return JSON.parse(
        raw
      );
    } catch (_) {
      return fallback;
    }
  }


  function esc(
    value
  ) {
    return String(
      value ?? ""
    )
      .replaceAll(
        "&",
        "&amp;"
      )
      .replaceAll(
        "<",
        "&lt;"
      )
      .replaceAll(
        ">",
        "&gt;"
      )
      .replaceAll(
        '"',
        "&quot;"
      );
  }


  function todayKey() {
    const date =
      new Date();

    return [
      date.getFullYear(),

      String(
        date.getMonth() + 1
      ).padStart(
        2,
        "0"
      ),

      String(
        date.getDate()
      ).padStart(
        2,
        "0"
      )
    ].join(
      "-"
    );
  }


  function blankDay() {
    return {
      meals: {
        Breakfast: [],
        Lunch: [],
        Dinner: [],
        Snacks: []
      },

      water: 0
    };
  }


  function loadFuelStore() {
    return safeJson(
      localStorage.getItem(
        FUEL_KEY
      ) || "{}",
      {}
    );
  }


  function saveCustomMeal(
    meal,
    index,
    item
  ) {
    const store =
      loadFuelStore();

    const key =
      todayKey();

    const day =
      store[key] ||
      blankDay();


    day.meals =
      day.meals ||
      blankDay().meals;


    day.meals[meal] =
      Array.isArray(
        day.meals[meal]
      )
        ? day.meals[meal]
        : [];


    const replacing =
      Number.isInteger(
        index
      ) &&
      index >= 0 &&
      index <
        day.meals[meal].length;


    if (
      replacing
    ) {

      day.meals[meal][
        index
      ] =
        item;

    } else {

      day.meals[meal]
        .push(
          item
        );
    }


    store[key] =
      day;


    localStorage.setItem(
      FUEL_KEY,
      JSON.stringify(
        store
      )
    );


    return replacing;
  }


  function injectStyles() {
    document
      .getElementById(
        STYLE_ID
      )
      ?.remove();


    const style =
      document.createElement(
        "style"
      );


    style.id =
      STYLE_ID;


    style.textContent = `

      /* =====================================
         STRENGTH
         ===================================== */

      .v55-strength-panel
      .mana-v941-copy-note{
        margin:
          -2px
          0
          9px;

        color:#777;

        font-size:10px;

        line-height:1.4;
      }


      /* =====================================
         FUEL CUSTOM MEAL
         ===================================== */

      #${CUSTOM_ID}{
        margin-top:12px;

        padding:14px;

        border:
          1px solid
          #3d361f;

        border-radius:17px;

        background:
          linear-gradient(
            145deg,
            #121006,
            #090909
          );
      }


      #${CUSTOM_ID}
      .mana-v941-custom-toggle{
        width:100%;

        display:flex;

        align-items:center;

        justify-content:
          space-between;

        gap:12px;

        padding:0;

        border:0;

        background:transparent;

        color:#fff;

        text-align:left;

        cursor:pointer;

        touch-action:
          manipulation;
      }


      #${CUSTOM_ID}
      .mana-v941-custom-toggle
      strong{
        display:block;

        color:#f3d875;

        font-size:14px;
      }


      #${CUSTOM_ID}
      .mana-v941-custom-toggle
      span{
        color:#888;

        font-size:18px;
      }


      #${CUSTOM_ID}
      .mana-v941-custom-sub{
        margin-top:4px;

        color:#7f7f7f;

        font-size:11px;

        line-height:1.45;
      }


      #${CUSTOM_ID}
      .mana-v941-custom-body{
        display:none;

        margin-top:13px;
      }


      #${CUSTOM_ID}.open
      .mana-v941-custom-body{
        display:block;
      }


      #${CUSTOM_ID}
      .mana-v941-custom-field{
        width:100%;

        min-height:48px;

        margin-top:8px;

        padding:
          11px
          12px;

        border:
          1px solid
          #353535;

        border-radius:13px;

        background:#080808;

        color:#fff;

        font:inherit;

        font-size:14px;

        outline:none;
      }


      #${CUSTOM_ID}
      .mana-v941-custom-field:focus{
        border-color:#6a5a23;
      }


      #${CUSTOM_ID}
      .mana-v941-macro-grid{
        display:grid;

        grid-template-columns:
          1fr
          1fr;

        gap:8px;
      }


      #${CUSTOM_ID}
      .mana-v941-custom-save{
        width:100%;

        min-height:50px;

        margin-top:11px;

        border:0;

        border-radius:13px;

        background:#f3d875;

        color:#111;

        font-size:12px;
        font-weight:900;

        cursor:pointer;

        touch-action:
          manipulation;
      }


      #${CUSTOM_ID}
      .mana-v941-custom-status{
        min-height:16px;

        margin-top:7px;

        color:#999;

        font-size:10px;

        text-align:center;
      }


      /* =====================================
         HOME TIDY
         ===================================== */

      #${HOME_ID}{
        padding-top:
          calc(
            env(
              safe-area-inset-top
            ) + 12px
          );
      }


      #${HOME_ID}
      .mana-v8013-brand{
        margin-bottom:16px;
      }


      #${HOME_ID}
      .mana-v8013-brand-row{
        margin-bottom:12px;
      }


      #${HOME_ID}
      .mana-v8013-welcome{
        margin-top:10px;
      }


      #${HOME_ID}
      .mana-v8013-profile{
        margin:
          14px
          0
          20px;

        padding:
          19px
          22px;
      }


      #${HOME_ID}
      .mana-v8013-select{
        margin:
          22px
          0
          13px;

        padding:
          16px
          16px;
      }


      #${HOME_ID}
      .mana-v8013-program{
        min-height:176px;

        margin:
          13px
          0;

        padding:
          24px
          24px;
      }


      #${HOME_ID}
      .mana-v8013-program h2{
        font-size:35px;
      }


      #${HOME_ID}
      .mana-v8013-program p{
        margin-top:10px;

        line-height:1.52;
      }


      #${HOME_ID}
      .mana-v8013-open{
        margin-top:15px;
      }


      #${HOME_ID}
      #manaV80Life{
        border-color:#6b5a20;

        background:
          radial-gradient(
            circle at 88% 10%,
            rgba(
              243,
              216,
              117,
              .12
            ),
            transparent 34%
          ),
          linear-gradient(
            145deg,
            #17140a,
            #090909
          );
      }


      #${HOME_ID}
      #manaV80Life
      .mana-v8013-program-label{
        font-size:19px;
      }


      #${HOME_ID}
      #manaV80Life
      .mana-v8013-life-subline{
        margin-top:7px;

        color:#f3d875;

        font-size:11px;
        font-weight:900;

        letter-spacing:.08em;

        text-transform:uppercase;
      }


      #${HOME_ID}
      #manaV80Life
      .mana-v8013-badge{
        border-color:#5f5220;

        background:#171407;
      }


      /* =====================================
         AUTH SAFETY
         ===================================== */

      body.mana-v941-home-visible
      #${AUTH_ID}{
        display:none !important;
      }


      @media(
        max-width:600px
      ){

        #${HOME_ID}{
          padding-left:10px;
          padding-right:10px;
        }


        #${HOME_ID}
        .mana-v8013-brand{
          padding-left:5px;
          padding-right:5px;

          margin-bottom:13px;
        }


        #${HOME_ID}
        .mana-v8013-brand-row{
          gap:12px;

          margin-bottom:10px;
        }


        #${HOME_ID}
        .mana-v8013-profile{
          margin:
            12px
            0
            16px;

          padding:
            17px
            18px;
        }


        #${HOME_ID}
        .mana-v8013-select{
          margin:
            17px
            0
            10px;

          padding:
            14px;
        }


        #${HOME_ID}
        .mana-v8013-program{
          min-height:164px;

          margin:
            10px
            0;

          padding:
            21px
            18px;
        }


        #${HOME_ID}
        .mana-v8013-program h2{
          font-size:30px;
        }


        #${HOME_ID}
        .mana-v8013-program p{
          max-width:96%;

          font-size:13px;
        }


        #${HOME_ID}
        .mana-v8013-badge{
          top:13px;
          right:12px;
        }


        #${CUSTOM_ID}
        .mana-v941-macro-grid{
          grid-template-columns:
            1fr;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     STRENGTH — COPY SET 1 WEIGHT
     ========================================= */

  function addStrengthHint(
    panel
  ) {
    if (
      !panel ||
      panel.querySelector(
        ".mana-v941-copy-note"
      )
    ) {
      return;
    }


    const labels =
      panel.querySelector(
        ".v55-set-labels"
      );


    if (
      !labels
    ) {
      return;
    }


    const note =
      document.createElement(
        "div"
      );


    note.className =
      "mana-v941-copy-note";


    note.textContent =
      "Set 1 weight carries into Sets 2 and 3.";


    labels.insertAdjacentElement(
      "beforebegin",
      note
    );
  }


  function syncSetOneWeight(
    input
  ) {
    const row =
      input.closest(
        ".v55-set-row"
      );


    const panel =
      input.closest(
        ".v55-strength-panel"
      );


    if (
      !row ||
      !panel ||
      row.dataset
        .setNumber !==
        "1"
    ) {
      return;
    }


    addStrengthHint(
      panel
    );


    const value =
      input.value;


    [
      "2",
      "3"
    ].forEach(
      number => {

        const target =
          panel.querySelector(
            `.v55-set-row[data-set-number="${number}"] .v55-weight`
          );


        if (
          !target
        ) {
          return;
        }


        const previousAuto =
          target.dataset
            .v941AutoWeight ??
          "";


        const canUpdate =
          target.value ===
            "" ||
          target.value ===
            previousAuto;


        if (
          !canUpdate
        ) {
          return;
        }


        target.value =
          value;


        target.dataset
          .v941AutoWeight =
          value;


        target.dispatchEvent(
          new Event(
            "input",
            {
              bubbles:true
            }
          )
        );

      }
    );
  }


  function decorateStrengthPanels() {
    document
      .querySelectorAll(
        ".v55-strength-panel"
      )
      .forEach(
        addStrengthHint
      );
  }


  /* =========================================
     FUEL — CUSTOM MEAL
     ========================================= */

  function ensureCustomMealBox() {
    const modal =
      document.getElementById(
        FUEL_MODAL_ID
      );


    const options =
      document.getElementById(
        "manaV93Options"
      );


    if (
      !modal ||
      !options
    ) {
      return;
    }


    let box =
      document.getElementById(
        CUSTOM_ID
      );


    if (
      !box
    ) {

      box =
        document.createElement(
          "div"
        );


      box.id =
        CUSTOM_ID;


      box.innerHTML = `

        <button
          type="button"
          class="mana-v941-custom-toggle"
          id="manaV941CustomToggle"
        >

          <div>

            <strong>
              + Add your own meal
            </strong>

            <div
              class="mana-v941-custom-sub"
            >
              Enter the meal, calories and protein yourself.
            </div>

          </div>


          <span>
            +
          </span>

        </button>


        <div
          class="mana-v941-custom-body"
        >

          <input
            class="mana-v941-custom-field"
            id="manaV941Food"
            maxlength="120"
            placeholder="Meal or food name"
          >


          <div
            class="mana-v941-macro-grid"
          >

            <input
              class="mana-v941-custom-field"
              id="manaV941Calories"
              type="number"
              min="0"
              max="10000"
              inputmode="numeric"
              placeholder="Calories"
            >


            <input
              class="mana-v941-custom-field"
              id="manaV941Protein"
              type="number"
              min="0"
              max="1000"
              step="0.1"
              inputmode="decimal"
              placeholder="Protein (g)"
            >

          </div>


          <button
            type="button"
            class="mana-v941-custom-save"
            id="manaV941CustomSave"
          >
            SAVE MY MEAL
          </button>


          <div
            class="mana-v941-custom-status"
            id="manaV941CustomStatus"
          ></div>

        </div>

      `;


      options.insertAdjacentElement(
        "afterend",
        box
      );
    }


    box.classList.remove(
      "open"
    );


    const toggleIcon =
      box.querySelector(
        ".mana-v941-custom-toggle > span"
      );


    if (
      toggleIcon
    ) {
      toggleIcon.textContent =
        "+";
    }


    const save =
      document.getElementById(
        "manaV941CustomSave"
      );


    if (
      save
    ) {

      save.textContent =
        Number.isInteger(
          fuelEditIndex
        )
          ? "REPLACE WITH MY MEAL"
          : "SAVE MY MEAL";
    }


    [
      "manaV941Food",
      "manaV941Calories",
      "manaV941Protein"
    ].forEach(
      id => {

        const field =
          document.getElementById(
            id
          );


        if (
          field
        ) {
          field.value =
            "";
        }

      }
    );


    const status =
      document.getElementById(
        "manaV941CustomStatus"
      );


    if (
      status
    ) {
      status.textContent =
        "";
    }
  }


  function scheduleFuelDecorate(
    delay = 60
  ) {
    setTimeout(
      ensureCustomMealBox,
      delay
    );
  }


  function closeFuelModal() {
    document
      .getElementById(
        FUEL_MODAL_ID
      )
      ?.classList
      .remove(
        "open"
      );
  }


  function saveFuelCustom() {
    const meal =
      fuelMeal ||
      document
        .getElementById(
          "manaV93Title"
        )
        ?.textContent
        ?.trim();


    const food =
      document
        .getElementById(
          "manaV941Food"
        )
        ?.value
        ?.trim() ||
      "";


    const caloriesRaw =
      document
        .getElementById(
          "manaV941Calories"
        )
        ?.value ??
      "";


    const proteinRaw =
      document
        .getElementById(
          "manaV941Protein"
        )
        ?.value ??
      "";


    const calories =
      Number(
        caloriesRaw
      );


    const protein =
      Number(
        proteinRaw
      );


    const status =
      document.getElementById(
        "manaV941CustomStatus"
      );


    if (
      !meal ||
      ![
        "Breakfast",
        "Lunch",
        "Dinner",
        "Snacks"
      ].includes(
        meal
      )
    ) {

      if (
        status
      ) {
        status.textContent =
          "Choose a meal section first.";
      }


      return;
    }


    if (
      !food
    ) {

      if (
        status
      ) {
        status.textContent =
          "Add a meal name.";
      }


      return;
    }


    if (
      caloriesRaw ===
        "" ||
      !Number.isFinite(
        calories
      ) ||
      calories <
        0
    ) {

      if (
        status
      ) {
        status.textContent =
          "Enter valid calories.";
      }


      return;
    }


    if (
      proteinRaw ===
        "" ||
      !Number.isFinite(
        protein
      ) ||
      protein <
        0
    ) {

      if (
        status
      ) {
        status.textContent =
          "Enter valid protein.";
      }


      return;
    }


    const replacing =
      saveCustomMeal(
        meal,
        fuelEditIndex,
        {
          food,
          calories,
          protein,
          source:
            "mana-custom",

          created_at:
            new Date()
              .toISOString()
        }
      );


    if (
      status
    ) {
      status.textContent =
        replacing
          ? "Meal changed ✓"
          : "Meal added ✓";
    }


    if (
      typeof
        window
          .renderManaStrengthFuel ===
      "function"
    ) {

      window
        .renderManaStrengthFuel();
    }


    setTimeout(
      closeFuelModal,
      450
    );
  }


  /* =========================================
     HOME — POLISH / MANA LIFE
     ========================================= */

  function decorateHome() {
    const home =
      document.getElementById(
        HOME_ID
      );


    if (
      !home
    ) {
      return;
    }


    const life =
      document.getElementById(
        "manaV80Life"
      );


    if (
      life
    ) {

      const badge =
        life.querySelector(
          ".mana-v8013-badge"
        );


      if (
        badge
      ) {
        badge.textContent =
          "LIVE";
      }


      const heading =
        life.querySelector(
          "h2"
        );


      if (
        heading
      ) {
        heading.textContent =
          "Reclaim & Rebuild";
      }


      const description =
        life.querySelector(
          "p"
        );


      if (
        description
      ) {
        description.textContent =
          "Mindset, routine, reflection, support and daily tools designed to help you move forward with purpose.";
      }


      if (
        !life.querySelector(
          ".mana-v8013-life-subline"
        )
      ) {

        const subline =
          document.createElement(
            "div"
          );


        subline.className =
          "mana-v8013-life-subline";


        subline.textContent =
          "Mindset • Routine • Reclaim";


        heading
          ?.insertAdjacentElement(
            "afterend",
            subline
          );
      }
    }
  }


  /* =========================================
     AUTH — PREVENT LOGIN BELOW HOME
     ========================================= */

  function homeVisible() {
    const home =
      document.getElementById(
        HOME_ID
      );


    if (
      !home
    ) {
      return false;
    }


    const style =
      window.getComputedStyle(
        home
      );


    return (
      style.display !==
        "none" &&
      style.visibility !==
        "hidden"
    );
  }


  function enforceAuthPlacement() {
    const visible =
      homeVisible();


    document.body.classList.toggle(
      "mana-v941-home-visible",
      visible
    );


    if (
      !visible
    ) {
      return;
    }


    const auth =
      document.getElementById(
        AUTH_ID
      );


    if (
      auth
    ) {
      auth.classList.add(
        "hide"
      );

      auth.style.display =
        "none";
    }
  }


  function refreshUi(
    delay = 60
  ) {
    setTimeout(
      () => {
        decorateHome();
        decorateStrengthPanels();
        enforceAuthPlacement();
      },
      delay
    );
  }


  /* =========================================
     EVENTS
     ========================================= */

  function wireEvents() {
    document.addEventListener(
      "input",
      event => {

        const input =
          event.target.closest(
            ".v55-weight"
          );


        if (
          !input
        ) {
          return;
        }


        syncSetOneWeight(
          input
        );

      },
      true
    );


    document.addEventListener(
      "click",
      event => {

        const mealButton =
          event.target.closest(
            "[data-mana-meal]"
          );


        if (
          mealButton
        ) {

          fuelMeal =
            mealButton.dataset
              .manaMeal ||
            null;


          fuelEditIndex =
            null;


          scheduleFuelDecorate(
            70
          );


          return;
        }


        const changeButton =
          event.target.closest(
            "[data-mana-change-meal]"
          );


        if (
          changeButton
        ) {

          fuelMeal =
            changeButton.dataset
              .manaChangeMeal ||
            null;


          const parsed =
            Number(
              changeButton.dataset
                .manaChangeIndex
            );


          fuelEditIndex =
            Number.isInteger(
              parsed
            )
              ? parsed
              : null;


          scheduleFuelDecorate(
            70
          );


          return;
        }


        if (
          event.target.closest(
            "#manaV941CustomToggle"
          )
        ) {

          const box =
            document.getElementById(
              CUSTOM_ID
            );


          box
            ?.classList
            .toggle(
              "open"
            );


          const icon =
            box
              ?.querySelector(
                ".mana-v941-custom-toggle > span"
              );


          if (
            icon
          ) {

            icon.textContent =
              box.classList
                .contains(
                  "open"
                )
                ? "−"
                : "+";
          }


          if (
            box
              ?.classList
              .contains(
                "open"
              )
          ) {

            setTimeout(
              () => {

                document
                  .getElementById(
                    "manaV941Food"
                  )
                  ?.focus();

              },
              60
            );
          }


          return;
        }


        if (
          event.target.closest(
            "#manaV941CustomSave"
          )
        ) {

          event.preventDefault();

          event.stopPropagation();

          saveFuelCustom();


          return;
        }


        if (
          event.target.closest(
            "#manaV93Close"
          )
        ) {

          fuelMeal =
            null;

          fuelEditIndex =
            null;

        }


        refreshUi(
          80
        );

      },
      true
    );


    window.addEventListener(
      "focus",
      () => {

        refreshUi(
          80
        );

      }
    );


    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.visibilityState ===
          "visible"
        ) {

          refreshUi(
            90
          );
        }

      }
    );


    window.addEventListener(
      "mana:profile-synced",
      () => {

        refreshUi(
          80
        );

      }
    );


    window.addEventListener(
      "mana:program-tab-change",
      () => {

        refreshUi(
          80
        );

      }
    );
  }


  function startSafetyPass() {
    [
      250,
      700,
      1400,
      2600
    ].forEach(
      delay => {

        setTimeout(
          () => {

            decorateHome();
            decorateStrengthPanels();
            enforceAuthPlacement();

          },
          delay
        );

      }
    );


    setInterval(
      enforceAuthPlacement,
      1800
    );
  }


  function init() {
    injectStyles();

    wireEvents();

    startSafetyPass();
  }


  window.MANA_APP_TIDY_BUILD =
    BUILD;


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
