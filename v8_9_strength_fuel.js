/* =========================================
   MANA MOVEMENT TRAINING v8.9.2
   MANA STRENGTH — FUEL

   PERSONALISED TARGETS
   DAILY PROGRESS
   TRAINING-DAY GUIDANCE
   CLEAN FOOD TRACKER TRANSITION
   ========================================= */

(() => {
  "use strict";


  const SHELL_ID =
    "manaV83ProgramShell";

  const CONTENT_ID =
    "manaV83Content";

  const PROFILE_KEY =
    "mana-profile-v67";

  const TARGET_KEY =
    "mana-fuel-v58-targets";

  const FUEL_KEY =
    "mana-fuel-v571";

  const STYLE_ID =
    "mana-v89-strength-fuel-style";

  const MODAL_ID =
    "manaV89FuelTargets";


  /* =========================================
     HELPERS
     ========================================= */

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


  function loadProfile() {
    return safeJson(
      localStorage.getItem(
        PROFILE_KEY
      ) || "{}",
      {}
    );
  }


  function loadTargets() {
    const saved =
      safeJson(
        localStorage.getItem(
          TARGET_KEY
        ) || "{}",
        {}
      );


    return {
      calories:
        Number(
          saved.calories ||
          0
        ),

      protein:
        Number(
          saved.protein ||
          0
        ),

      carbs:
        Number(
          saved.carbs ||
          0
        ),

      fat:
        Number(
          saved.fat ||
          0
        ),

      water:
        Number(
          saved.water ||
          0
        )
    };
  }


  function saveTargets(
    targets
  ) {
    localStorage.setItem(
      TARGET_KEY,
      JSON.stringify(
        targets
      )
    );


    window.dispatchEvent(
      new Event(
        "storage"
      )
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

    ].join("-");
  }


  function loadToday() {
    const store =
      safeJson(
        localStorage.getItem(
          FUEL_KEY
        ) || "{}",
        {}
      );


    return (
      store[
        todayKey()
      ] ||
      {
        meals:{
          Breakfast:[],
          Lunch:[],
          Dinner:[],
          Snacks:[]
        },

        water:0
      }
    );
  }


  function todayTotals() {
    const day =
      loadToday();


    const totals = {
      calories:0,
      protein:0,
      water:
        Number(
          day.water ||
          0
        )
    };


    Object.values(
      day.meals ||
      {}
    ).forEach(
      meals => {

        (
          meals ||
          []
        ).forEach(
          item => {

            totals.calories +=
              Number(
                item.calories ||
                0
              );


            totals.protein +=
              Number(
                item.protein ||
                0
              );

          }
        );

      }
    );


    return totals;
  }


  function pct(
    current,
    target
  ) {
    if (!target) {
      return 0;
    }


    return Math.max(
      0,

      Math.min(
        100,

        Math.round(
          current /
          target *
          100
        )
      )
    );
  }


  function shellIsStrength() {
    const shell =
      document.getElementById(
        SHELL_ID
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


  function activeTab() {
    return (
      document
        .querySelector(
          "#manaV83Tabs " +
          ".mana-v83-tab.active"
        )
        ?.dataset
        ?.v83Tab ||
      ""
    );
  }


  /* =========================================
     PROFILE TARGET ESTIMATE
     ========================================= */

  function calculateTargets() {
    const profile =
      loadProfile();


    const weight =
      Number(
        profile.weight ||
        0
      );


    if (!weight) {
      return null;
    }


    let caloriesPerKg =
      30;


    let proteinPerKg =
      1.6;


    switch (
      profile.goal
    ) {

      case "Build muscle":

        caloriesPerKg =
          33;

        proteinPerKg =
          1.8;

        break;


      case "Get stronger":

        caloriesPerKg =
          31;

        proteinPerKg =
          1.8;

        break;


      case "General fitness":

        caloriesPerKg =
          30;

        proteinPerKg =
          1.6;

        break;


      case "Return to training":

        caloriesPerKg =
          30;

        proteinPerKg =
          1.6;

        break;
    }


    const calories =
      Math.round(
        weight *
        caloriesPerKg /
        50
      ) * 50;


    const protein =
      Math.round(
        weight *
        proteinPerKg
      );


    const water =
      Math.round(
        weight *
        35 /
        100
      ) * 100;


    return {
      calories,
      protein,
      water,
      carbs:0,
      fat:0
    };
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

      .mana-v89-hero{
        border:
          1px solid
          #4a3d12;

        background:
          linear-gradient(
            145deg,
            #17150d,
            #0b0b0b
          );

        border-radius:22px;
        padding:18px;
        margin-bottom:12px;
      }


      .mana-v89-kicker{
        color:#f3d875;
        font-size:10px;
        font-weight:900;
        letter-spacing:.14em;
        text-transform:uppercase;
      }


      .mana-v89-hero h2{
        margin:7px 0 5px;
        font-size:25px;
      }


      .mana-v89-hero p{
        margin:0;
        color:#999;
        font-size:12px;
        line-height:1.55;
      }


      .mana-v89-grid{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:10px;
        margin:12px 0;
      }


      .mana-v89-stat{
        padding:15px;
        background:#0d0d0d;
        border:1px solid #292929;
        border-radius:18px;
      }


      .mana-v89-stat.wide{
        grid-column:1 / -1;
      }


      .mana-v89-label{
        color:#888;
        font-size:10px;
        font-weight:800;
        text-transform:uppercase;
        letter-spacing:.07em;
      }


      .mana-v89-value{
        margin-top:5px;
        color:#f3d875;
        font-size:22px;
        font-weight:900;
      }


      .mana-v89-sub{
        margin-top:4px;
        color:#888;
        font-size:11px;
        line-height:1.4;
      }


      .mana-v89-track{
        height:7px;
        margin-top:10px;
        overflow:hidden;
        border-radius:999px;
        background:#222;
      }


      .mana-v89-fill{
        height:100%;
        border-radius:999px;
        background:#f3d875;
      }


      .mana-v89-section{
        padding:17px;
        margin:12px 0;
        border:1px solid #292929;
        border-radius:20px;
        background:#0d0d0d;
      }


      .mana-v89-section h3{
        margin:0 0 5px;
        font-size:19px;
      }


      .mana-v89-section-intro{
        margin-bottom:12px;
        color:#888;
        font-size:12px;
        line-height:1.5;
      }


      .mana-v89-guide{
        padding:12px 0;
        border-top:1px solid #262626;
      }


      .mana-v89-guide:first-of-type{
        border-top:0;
      }


      .mana-v89-guide strong{
        display:block;
        color:#eee;
        font-size:14px;
      }


      .mana-v89-guide span{
        display:block;
        margin-top:4px;
        color:#999;
        font-size:12px;
        line-height:1.5;
      }


      .mana-v89-button{
        width:100%;
        min-height:56px;
        margin-top:10px;
        border:0;
        border-radius:16px;
        background:#f3d875;
        color:#111;
        font-size:15px;
        font-weight:900;
      }


      .mana-v89-secondary{
        width:100%;
        min-height:50px;
        margin-top:8px;
        border-radius:15px;
        border:1px solid #383838;
        background:#111;
        color:#f3d875;
        font-size:14px;
        font-weight:900;
      }


      .mana-v89-note{
        margin-top:12px;
        color:#777;
        font-size:10px;
        line-height:1.45;
      }


      #${MODAL_ID}{
        position:fixed;
        inset:0;
        z-index:29000;
        display:none;
        align-items:flex-end;
        background:rgba(0,0,0,.82);
      }


      #${MODAL_ID}.open{
        display:flex;
      }


      .mana-v89-sheet{
        width:100%;
        max-height:92dvh;
        overflow:auto;
        padding:
          24px
          20px
          calc(
            30px +
            env(
              safe-area-inset-bottom
            )
          );
        border:1px solid #333;
        border-radius:26px 26px 0 0;
        background:#101010;
      }


      .mana-v89-sheet-inner{
        width:min(520px,100%);
        margin:auto;
      }


      .mana-v89-sheet h2{
        margin:0 0 16px;
        font-size:26px;
      }


      .mana-v89-field{
        margin-bottom:12px;
      }


      .mana-v89-field label{
        display:block;
        margin-bottom:5px;
        color:#aaa;
        font-size:12px;
      }


      .mana-v89-field input{
        width:100%;
        min-height:50px;
        margin:0 !important;
        padding:12px 14px;
        border:1px solid #333;
        border-radius:13px;
        background:#080808;
        color:#fff;
        font-size:16px;
      }


      @media(max-width:360px){

        .mana-v89-grid{
          grid-template-columns:1fr;
        }


        .mana-v89-stat.wide{
          grid-column:auto;
        }
      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* =========================================
     TARGET MODAL
     ========================================= */

  function ensureModal() {
    if (
      document.getElementById(
        MODAL_ID
      )
    ) return;


    const modal =
      document.createElement(
        "div"
      );


    modal.id =
      MODAL_ID;


    modal.innerHTML = `

      <div class="mana-v89-sheet">

        <div class="mana-v89-sheet-inner">

          <h2>
            Daily Fuel Targets
          </h2>


          <div class="mana-v89-field">
            <label>
              Calories
            </label>

            <input
              type="number"
              id="manaV89Calories"
              min="0"
              inputmode="numeric"
            />
          </div>


          <div class="mana-v89-field">
            <label>
              Protein grams
            </label>

            <input
              type="number"
              id="manaV89Protein"
              min="0"
              inputmode="numeric"
            />
          </div>


          <div class="mana-v89-field">
            <label>
              Water ml
            </label>

            <input
              type="number"
              id="manaV89Water"
              min="0"
              step="100"
              inputmode="numeric"
            />
          </div>


          <button
            type="button"
            class="mana-v89-button"
            id="manaV89Save"
          >
            SAVE TARGETS
          </button>


          <button
            type="button"
            class="mana-v89-secondary"
            id="manaV89Cancel"
          >
            Cancel
          </button>

        </div>

      </div>

    `;


    document.body.appendChild(
      modal
    );


    document
      .getElementById(
        "manaV89Save"
      )
      .onclick =
        saveManualTargets;


    document
      .getElementById(
        "manaV89Cancel"
      )
      .onclick =
        closeModal;


    modal.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          modal
        ) {
          closeModal();
        }

      }
    );
  }


  function openModal() {
    ensureModal();


    const targets =
      loadTargets();


    document
      .getElementById(
        "manaV89Calories"
      )
      .value =
        targets.calories ||
        "";


    document
      .getElementById(
        "manaV89Protein"
      )
      .value =
        targets.protein ||
        "";


    document
      .getElementById(
        "manaV89Water"
      )
      .value =
        targets.water ||
        "";


    document
      .getElementById(
        MODAL_ID
      )
      .classList
      .add(
        "open"
      );
  }


  function closeModal() {
    document
      .getElementById(
        MODAL_ID
      )
      ?.classList
      .remove(
        "open"
      );
  }


  function saveManualTargets() {
    const current =
      loadTargets();


    const targets = {
      calories:
        Math.max(
          0,
          Number(
            document
              .getElementById(
                "manaV89Calories"
              )
              .value ||
            0
          )
        ),

      protein:
        Math.max(
          0,
          Number(
            document
              .getElementById(
                "manaV89Protein"
              )
              .value ||
            0
          )
        ),

      water:
        Math.max(
          0,
          Number(
            document
              .getElementById(
                "manaV89Water"
              )
              .value ||
            0
          )
        ),

      carbs:
        current.carbs ||
        0,

      fat:
        current.fat ||
        0
    };


    saveTargets(
      targets
    );


    closeModal();


    renderFuel();
  }


  /* =========================================
     OPEN FOOD TRACKER
     ========================================= */

  function openFoodTracker() {
    const shell =
      document.getElementById(
        SHELL_ID
      );


    const home =
      document.getElementById(
        "manaV80Home"
      );


    const clientFuel =
      document.getElementById(
        "clientFuelView"
      );


    const oldClient =
      document.getElementById(
        "clientView"
      );


    const oldNav =
      document.getElementById(
        "bottomNav"
      );


    /*
      Close Mana Strength.
    */

    shell
      ?.classList
      .remove(
        "open"
      );


    /*
      Hide Mana Home completely
      while Food Tracker is open.
    */

    if (home) {
      home.style.display =
        "none";
    }


    /*
      Hide old client dashboard.
    */

    if (oldClient) {
      oldClient.style.display =
        "none";
    }


    /*
      Hide old navigation.
    */

    if (oldNav) {
      oldNav.style.display =
        "none";
    }


    /*
      Hide all suite screens.
    */

    [
      "clientProgramsView",
      "clientFuelView",
      "clientProgressView",
      "clientProfileView"
    ].forEach(
      id => {

        document
          .getElementById(
            id
          )
          ?.classList
          .add(
            "hide"
          );

      }
    );


    /*
      Show Fuel only.
    */

    clientFuel
      ?.classList
      .remove(
        "hide"
      );


    document.body.style.overflow =
      "";


    window.scrollTo({
      top:0,
      behavior:"instant"
    });


    /*
      Force cleanup after
      Fuel becomes visible.
    */

    setTimeout(
      () => {

        if (
          typeof
            window
              .cleanManaFuelTracker ===
          "function"
        ) {

          window
            .cleanManaFuelTracker();

        }

      },
      100
    );
  }


  /* =========================================
     RENDER FUEL
     ========================================= */

  function renderFuel() {
    if (
      !shellIsStrength()
    ) return;


    if (
      activeTab() !==
      "fuel"
    ) return;


    const holder =
      document.getElementById(
        CONTENT_ID
      );


    if (!holder) return;


    const targets =
      loadTargets();


    const totals =
      todayTotals();


    const proteinPerMeal =
      targets.protein
        ? Math.round(
            targets.protein /
            4
          )
        : 0;


    const hasTargets =
      targets.calories >
        0 ||
      targets.protein >
        0 ||
      targets.water >
        0;


    holder.innerHTML = `

      <div class="mana-v89-hero">

        <div class="mana-v89-kicker">
          MANA FUEL
        </div>

        <h2>
          Fuel your training.
        </h2>

        <p>
          Keep it simple:
          enough energy,
          consistent protein,
          hydration and food
          you can repeat.
        </p>

      </div>


      ${
        hasTargets
          ? `

            <div class="mana-v89-grid">

              <div class="mana-v89-stat">

                <div class="mana-v89-label">
                  Calories
                </div>

                <div class="mana-v89-value">
                  ${Math.round(totals.calories)}
                  /
                  ${targets.calories}
                </div>

                <div class="mana-v89-sub">
                  kcal today
                </div>

                <div class="mana-v89-track">
                  <div
                    class="mana-v89-fill"
                    style="
                      width:
                      ${pct(
                        totals.calories,
                        targets.calories
                      )}%
                    "
                  ></div>
                </div>

              </div>


              <div class="mana-v89-stat">

                <div class="mana-v89-label">
                  Protein
                </div>

                <div class="mana-v89-value">
                  ${Math.round(totals.protein)}
                  /
                  ${targets.protein}g
                </div>

                <div class="mana-v89-sub">
                  today
                </div>

                <div class="mana-v89-track">
                  <div
                    class="mana-v89-fill"
                    style="
                      width:
                      ${pct(
                        totals.protein,
                        targets.protein
                      )}%
                    "
                  ></div>
                </div>

              </div>


              <div class="mana-v89-stat wide">

                <div class="mana-v89-label">
                  Water
                </div>

                <div class="mana-v89-value">
                  ${Math.round(totals.water)}
                  /
                  ${targets.water} ml
                </div>

                <div class="mana-v89-track">
                  <div
                    class="mana-v89-fill"
                    style="
                      width:
                      ${pct(
                        totals.water,
                        targets.water
                      )}%
                    "
                  ></div>
                </div>

              </div>

            </div>

          `
          : `

            <div class="mana-v89-section">

              <h3>
                Set your Fuel targets
              </h3>

              <div class="mana-v89-section-intro">
                Add your body weight to
                Profile and Mana can build
                a simple starting point.
              </div>

            </div>

          `
      }


      <div class="mana-v89-section">

        <h3>
          Daily Foundations
        </h3>

        <div class="mana-v89-section-intro">
          A simple structure you can
          repeat consistently.
        </div>


        <div class="mana-v89-guide">

          <strong>
            1 • Protein across the day
          </strong>

          <span>
            ${
              proteinPerMeal
                ? `Aim for roughly ${proteinPerMeal}g across four meals or snacks.`
                : "Build each main meal around a quality protein source."
            }
          </span>

        </div>


        <div class="mana-v89-guide">

          <strong>
            2 • Fuel around training
          </strong>

          <span>
            Have a meal containing
            carbohydrate and protein
            before training when practical,
            then eat normally afterward.
          </span>

        </div>


        <div class="mana-v89-guide">

          <strong>
            3 • Hydrate consistently
          </strong>

          <span>
            Spread water through the day
            rather than trying to catch
            up late.
          </span>

        </div>


        <div class="mana-v89-guide">

          <strong>
            4 • Keep meals repeatable
          </strong>

          <span>
            Simple meals you enjoy and can
            prepare consistently beat a
            perfect plan you cannot sustain.
          </span>

        </div>

      </div>


      <button
        type="button"
        class="mana-v89-button"
        id="manaV89OpenTracker"
      >
        OPEN FOOD TRACKER →
      </button>


      <button
        type="button"
        class="mana-v89-secondary"
        id="manaV89BuildTargets"
      >
        BUILD TARGETS FROM PROFILE
      </button>


      <button
        type="button"
        class="mana-v89-secondary"
        id="manaV89EditTargets"
      >
        EDIT TARGETS
      </button>


      <div class="mana-v89-note">
        Mana Fuel targets are a practical
        starting estimate and can be adjusted
        to suit the individual.
      </div>

    `;


    document
      .getElementById(
        "manaV89OpenTracker"
      )
      ?.addEventListener(
        "click",
        openFoodTracker
      );


    document
      .getElementById(
        "manaV89EditTargets"
      )
      ?.addEventListener(
        "click",
        openModal
      );


    document
      .getElementById(
        "manaV89BuildTargets"
      )
      ?.addEventListener(
        "click",
        () => {

          const calculated =
            calculateTargets();


          if (!calculated) {

            if (
              typeof
                window
                  .openManaProfile ===
              "function"
            ) {

              window
                .openManaProfile();

            }

            return;
          }


          saveTargets(
            calculated
          );


          renderFuel();

        }
      );
  }


  /* =========================================
     WIRING
     ========================================= */

  function scheduleRender() {
    setTimeout(
      renderFuel,
      90
    );
  }


  function wire() {
    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            '#manaV83Tabs [data-v83-tab="fuel"]'
          )
        ) {

          scheduleRender();

        }

      }
    );


    window.addEventListener(
      "mana:program-tab-change",
      scheduleRender
    );


    window.addEventListener(
      "mana:profile-synced",
      scheduleRender
    );


    window.addEventListener(
      "storage",
      scheduleRender
    );


    window.addEventListener(
      "focus",
      scheduleRender
    );
  }


  function init() {
    injectStyles();

    ensureModal();

    wire();


    setTimeout(
      renderFuel,
      1500
    );
  }


  window.renderManaStrengthFuel =
    renderFuel;


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
