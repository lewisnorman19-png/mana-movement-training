/* =========================================
   MANA MOVEMENT TRAINING v9.47.0
   PROGRAM SUMMARY + BODY WEIGHT

   OVERVIEW
   - Your Program summary
   - Training days
   - Training goal
   - Fuel goal
   - Calories
   - Protein
   - Current body weight
   - Update Profile button

   PROGRESS
   - Body Weight tracker
   - Starting weight
   - Current weight
   - Total change
   - Recent entries

   IMPORTANT
   - No auth changes
   - No Supabase changes
   - No MutationObserver
   - No Fuel calculation changes
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "94700";


  const CONTENT_ID =
    "manaV83Content";


  const PROFILE_KEY =
    "mana-profile-v67";


  const TARGET_KEY =
    "mana-fuel-v58-targets";


  const WEIGHT_KEY =
    "mana-strength-v947-body-weight";


  const STYLE_ID =
    "mana-v947-program-weight-style";


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


  function loadProfile() {

    return safeJson(
      localStorage.getItem(
        PROFILE_KEY
      ) || "{}",
      {}
    );
  }


  function loadTargets() {

    return safeJson(
      localStorage.getItem(
        TARGET_KEY
      ) || "{}",
      {}
    );
  }


  function loadWeights() {

    const saved =
      safeJson(
        localStorage.getItem(
          WEIGHT_KEY
        ) || "[]",
        []
      );


    if (
      !Array.isArray(
        saved
      )
    ) {
      return [];
    }


    return saved
      .filter(
        item =>
          item &&
          Number(
            item.weight
          ) > 0
      )
      .sort(
        (
          a,
          b
        ) =>
          new Date(
            a.date
          ) -
          new Date(
            b.date
          )
      );
  }


  function saveWeights(
    entries
  ) {

    localStorage.setItem(
      WEIGHT_KEY,
      JSON.stringify(
        entries
      )
    );


    window.dispatchEvent(
      new CustomEvent(
        "mana:body-weight-updated"
      )
    );
  }


  function todayInputDate() {

    const now =
      new Date();


    const year =
      now.getFullYear();


    const month =
      String(
        now.getMonth() + 1
      ).padStart(
        2,
        "0"
      );


    const day =
      String(
        now.getDate()
      ).padStart(
        2,
        "0"
      );


    return `${year}-${month}-${day}`;
  }


  function formatDate(
    date
  ) {

    if (
      !date
    ) {
      return "";
    }


    const value =
      new Date(
        `${date}T12:00:00`
      );


    if (
      Number.isNaN(
        value.getTime()
      )
    ) {
      return date;
    }


    return value
      .toLocaleDateString(
        undefined,
        {
          day:"numeric",
          month:"short"
        }
      );
  }


  function currentWeight() {

    const weights =
      loadWeights();


    if (
      weights.length
    ) {

      return Number(
        weights[
          weights.length - 1
        ].weight
      );
    }


    const profile =
      loadProfile();


    return Number(
      profile.weight || 0
    );
  }


  function numberOrDash(
    value
  ) {

    const number =
      Number(
        value || 0
      );


    return number
      ? number.toLocaleString()
      : "—";
  }


  function strengthShellOpen() {

    const shell =
      document.getElementById(
        "manaV83ProgramShell"
      );


    if (
      !shell
    ) {
      return false;
    }


    const style =
      window.getComputedStyle(
        shell
      );


    return (
      style.display !==
        "none" &&
      style.visibility !==
        "hidden"
    );
  }


  function activeTab() {

    return (
      document.querySelector(
        '#manaV83Tabs [data-v83-tab].active'
      )
        ?.dataset
        ?.v83Tab ||
      ""
    );
  }


  /* =========================================
     STYLES
     ========================================= */

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
         OVERVIEW — YOUR PROGRAM
         ===================================== */

      #${CONTENT_ID}
      .mana-v947-program{
        margin:14px 0;

        padding:18px;

        border:
          1px solid
          #373019;

        border-radius:20px;

        background:
          linear-gradient(
            145deg,
            #14130d,
            #090909 58%
          );
      }


      #${CONTENT_ID}
      .mana-v947-program-kicker{
        color:#f3d875;

        font-size:10px;

        font-weight:900;

        letter-spacing:.12em;
      }


      #${CONTENT_ID}
      .mana-v947-program-head{
        display:flex;

        justify-content:
          space-between;

        align-items:flex-start;

        gap:12px;

        margin-top:5px;
      }


      #${CONTENT_ID}
      .mana-v947-program-head h3{
        margin:0;

        color:#fff;

        font-size:21px;
      }


      #${CONTENT_ID}
      .mana-v947-edit-profile{
        flex:0 0 auto;

        min-height:34px;

        padding:
          0
          11px;

        border:
          1px solid
          #51461f;

        border-radius:999px;

        background:#121008;

        color:#f3d875;

        font-size:9px;

        font-weight:900;
      }


      #${CONTENT_ID}
      .mana-v947-program-grid{
        display:grid;

        grid-template-columns:
          repeat(
            2,
            minmax(
              0,
              1fr
            )
          );

        gap:9px;

        margin-top:15px;
      }


      #${CONTENT_ID}
      .mana-v947-program-item{
        padding:12px;

        border:
          1px solid
          #292929;

        border-radius:14px;

        background:#0b0b0b;
      }


      #${CONTENT_ID}
      .mana-v947-program-item span{
        display:block;

        color:#777;

        font-size:9px;

        font-weight:800;

        letter-spacing:.06em;

        text-transform:
          uppercase;
      }


      #${CONTENT_ID}
      .mana-v947-program-item strong{
        display:block;

        margin-top:5px;

        color:#fff;

        font-size:14px;

        line-height:1.25;
      }


      #${CONTENT_ID}
      .mana-v947-program-item.gold strong{
        color:#f3d875;
      }


      /* =====================================
         PROGRESS — BODY WEIGHT
         ===================================== */

      #${CONTENT_ID}
      .mana-v947-weight{
        margin:
          16px
          0;

        padding:18px;

        border:
          1px solid
          #36301b;

        border-radius:20px;

        background:
          linear-gradient(
            145deg,
            #12110c,
            #080808
          );
      }


      #${CONTENT_ID}
      .mana-v947-weight-head{
        display:flex;

        align-items:flex-start;

        justify-content:
          space-between;

        gap:12px;
      }


      #${CONTENT_ID}
      .mana-v947-weight-kicker{
        color:#f3d875;

        font-size:10px;

        font-weight:900;

        letter-spacing:.11em;
      }


      #${CONTENT_ID}
      .mana-v947-weight-head h2{
        margin:
          4px
          0
          0;

        font-size:21px;
      }


      #${CONTENT_ID}
      .mana-v947-weight-summary{
        display:grid;

        grid-template-columns:
          repeat(
            3,
            minmax(
              0,
              1fr
            )
          );

        gap:8px;

        margin-top:15px;
      }


      #${CONTENT_ID}
      .mana-v947-weight-stat{
        padding:
          12px
          9px;

        border:
          1px solid
          #2b2b2b;

        border-radius:14px;

        background:#0a0a0a;

        text-align:center;
      }


      #${CONTENT_ID}
      .mana-v947-weight-stat span{
        display:block;

        color:#777;

        font-size:8px;

        font-weight:800;

        text-transform:
          uppercase;

        letter-spacing:.05em;
      }


      #${CONTENT_ID}
      .mana-v947-weight-stat strong{
        display:block;

        margin-top:5px;

        color:#f3d875;

        font-size:18px;
      }


      #${CONTENT_ID}
      .mana-v947-weight-form{
        display:grid;

        grid-template-columns:
          1fr
          1fr;

        gap:9px;

        margin-top:15px;
      }


      #${CONTENT_ID}
      .mana-v947-weight-field label{
        display:block;

        margin-bottom:5px;

        color:#888;

        font-size:9px;

        font-weight:800;

        text-transform:
          uppercase;
      }


      #${CONTENT_ID}
      .mana-v947-weight-field input{
        width:100%;

        min-height:45px;

        margin:0;

        padding:
          10px
          11px;

        border:
          1px solid
          #343434;

        border-radius:12px;

        background:#090909;

        color:#fff;

        font-size:15px;
      }


      #${CONTENT_ID}
      .mana-v947-save-weight{
        width:100%;

        min-height:46px;

        margin-top:9px;

        border:0;

        border-radius:13px;

        background:#f3d875;

        color:#111;

        font-size:12px;

        font-weight:900;
      }


      #${CONTENT_ID}
      .mana-v947-weight-status{
        min-height:18px;

        margin-top:7px;

        color:#9b9b9b;

        font-size:10px;
      }


      #${CONTENT_ID}
      .mana-v947-history{
        margin-top:15px;

        padding-top:13px;

        border-top:
          1px solid
          #292929;
      }


      #${CONTENT_ID}
      .mana-v947-history-title{
        margin-bottom:7px;

        color:#888;

        font-size:9px;

        font-weight:900;

        letter-spacing:.08em;

        text-transform:
          uppercase;
      }


      #${CONTENT_ID}
      .mana-v947-weight-entry{
        display:grid;

        grid-template-columns:
          1fr
          auto
          auto;

        align-items:center;

        gap:9px;

        min-height:39px;

        border-top:
          1px solid
          #202020;
      }


      #${CONTENT_ID}
      .mana-v947-weight-entry:first-of-type{
        border-top:0;
      }


      #${CONTENT_ID}
      .mana-v947-weight-date{
        color:#898989;

        font-size:11px;
      }


      #${CONTENT_ID}
      .mana-v947-weight-value{
        color:#fff;

        font-size:12px;

        font-weight:900;
      }


      #${CONTENT_ID}
      .mana-v947-weight-delete{
        min-height:28px;

        padding:
          0
          7px;

        border:
          1px solid
          #3a2a2a;

        border-radius:8px;

        background:#0d0d0d;

        color:#a97e7e;

        font-size:8px;

        font-weight:800;
      }


      #${CONTENT_ID}
      .mana-v947-empty{
        color:#666;

        font-size:11px;

        line-height:1.45;
      }


      /* =====================================
         PHONE
         ===================================== */

      @media(
        max-width:600px
      ){

        #${CONTENT_ID}
        .mana-v947-program{
          padding:16px;
        }


        #${CONTENT_ID}
        .mana-v947-program-grid{
          gap:8px;
        }


        #${CONTENT_ID}
        .mana-v947-program-item{
          padding:11px;
        }


        #${CONTENT_ID}
        .mana-v947-program-item strong{
          font-size:13px;
        }


        #${CONTENT_ID}
        .mana-v947-weight{
          padding:16px;
        }


        #${CONTENT_ID}
        .mana-v947-weight-summary{
          gap:6px;
        }


        #${CONTENT_ID}
        .mana-v947-weight-stat{
          padding:
            11px
            6px;
        }


        #${CONTENT_ID}
        .mana-v947-weight-stat strong{
          font-size:16px;
        }

      }


      @media(
        max-width:370px
      ){

        #${CONTENT_ID}
        .mana-v947-program-grid{
          grid-template-columns:
            1fr;
        }


        #${CONTENT_ID}
        .mana-v947-weight-summary{
          grid-template-columns:
            1fr;
        }


        #${CONTENT_ID}
        .mana-v947-weight-form{
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
     OVERVIEW
     ========================================= */

  function renderProgramSummary() {

    if (
      !strengthShellOpen() ||
      activeTab() !==
        "overview"
    ) {
      return;
    }


    const holder =
      document.getElementById(
        CONTENT_ID
      );


    if (
      !holder
    ) {
      return;
    }


    holder
      .querySelector(
        ".mana-v947-program"
      )
      ?.remove();


    const trainingCard =
      holder.querySelector(
        ".mana-v9103-workout"
      );


    if (
      !trainingCard
    ) {
      return;
    }


    const profile =
      loadProfile();


    const targets =
      loadTargets();


    const weight =
      currentWeight();


    const days =
      Number(
        profile.days || 0
      );


    const card =
      document.createElement(
        "div"
      );


    card.className =
      "mana-v947-program";


    card.innerHTML = `

      <div
        class="mana-v947-program-kicker"
      >
        YOUR PROGRAM
      </div>

      <div
        class="mana-v947-program-head"
      >

        <h3>
          Your plan at a glance
        </h3>

        <button
          type="button"
          class="mana-v947-edit-profile"
          id="manaV947Profile"
        >
          UPDATE
        </button>

      </div>


      <div
        class="mana-v947-program-grid"
      >

        <div
          class="
            mana-v947-program-item
            gold
          "
        >

          <span>
            Training
          </span>

          <strong>
            ${
              days
                ? `${days} days / week`
                : "Not set"
            }
          </strong>

        </div>


        <div
          class="mana-v947-program-item"
        >

          <span>
            Goal
          </span>

          <strong>
            ${esc(
              profile.goal ||
              "Not set"
            )}
          </strong>

        </div>


        <div
          class="mana-v947-program-item"
        >

          <span>
            Fuel
          </span>

          <strong>
            ${esc(
              profile.fuelGoal ||
              "Maintenance"
            )}
          </strong>

        </div>


        <div
          class="mana-v947-program-item"
        >

          <span>
            Body weight
          </span>

          <strong>
            ${
              weight
                ? `${weight.toFixed(1)} kg`
                : "Not logged"
            }
          </strong>

        </div>


        <div
          class="
            mana-v947-program-item
            gold
          "
        >

          <span>
            Calories
          </span>

          <strong>
            ${
              Number(
                targets.calories || 0
              )
                ? `${numberOrDash(
                    targets.calories
                  )} / day`
                : "Not set"
            }
          </strong>

        </div>


        <div
          class="
            mana-v947-program-item
            gold
          "
        >

          <span>
            Protein
          </span>

          <strong>
            ${
              Number(
                targets.protein || 0
              )
                ? `${Math.round(
                    Number(
                      targets.protein
                    )
                  )}g / day`
                : "Not set"
            }
          </strong>

        </div>

      </div>

    `;


    trainingCard
      .insertAdjacentElement(
        "beforebegin",
        card
      );


    document
      .getElementById(
        "manaV947Profile"
      )
      ?.addEventListener(
        "click",
        () => {

          if (
            typeof
              window
                .openManaProfile ===
            "function"
          ) {

            window
              .openManaProfile();

          }

        }
      );
  }


  /* =========================================
     BODY WEIGHT TRACKER
     ========================================= */

  function weightSummary() {

    const entries =
      loadWeights();


    const profile =
      loadProfile();


    const profileWeight =
      Number(
        profile.weight || 0
      );


    const start =
      entries.length
        ? Number(
            entries[0].weight
          )
        : profileWeight;


    const current =
      entries.length
        ? Number(
            entries[
              entries.length - 1
            ].weight
          )
        : profileWeight;


    const change =
      (
        start &&
        current
      )
        ? current - start
        : 0;


    return {
      start,
      current,
      change
    };
  }


  function changeLabel(
    value
  ) {

    const number =
      Number(
        value || 0
      );


    if (
      !number
    ) {
      return "0.0 kg";
    }


    return `${
      number > 0
        ? "+"
        : ""
    }${number.toFixed(1)} kg`;
  }


  function historyHtml() {

    const entries =
      loadWeights()
        .slice()
        .reverse()
        .slice(
          0,
          8
        );


    if (
      !entries.length
    ) {

      return `

        <div
          class="mana-v947-empty"
        >
          No body-weight check-ins yet.
          Add your first weight above.
        </div>

      `;
    }


    return entries
      .map(
        item => `

          <div
            class="mana-v947-weight-entry"
          >

            <div
              class="mana-v947-weight-date"
            >
              ${esc(
                formatDate(
                  item.date
                )
              )}
            </div>

            <div
              class="mana-v947-weight-value"
            >
              ${Number(
                item.weight
              ).toFixed(1)} kg
            </div>

            <button
              type="button"
              class="mana-v947-weight-delete"
              data-v947-delete="${esc(
                item.id
              )}"
            >
              DELETE
            </button>

          </div>

        `
      )
      .join("");
  }


  function renderWeightTracker() {

    if (
      !strengthShellOpen() ||
      activeTab() !==
        "progress"
    ) {
      return;
    }


    const holder =
      document.getElementById(
        CONTENT_ID
      );


    if (
      !holder
    ) {
      return;
    }


    holder
      .querySelector(
        ".mana-v947-weight"
      )
      ?.remove();


    const firstSection =
      holder.querySelector(
        ".mana-v87-section"
      );


    if (
      !firstSection
    ) {
      return;
    }


    const summary =
      weightSummary();


    const card =
      document.createElement(
        "div"
      );


    card.className =
      "mana-v947-weight";


    card.innerHTML = `

      <div
        class="mana-v947-weight-head"
      >

        <div>

          <div
            class="mana-v947-weight-kicker"
          >
            BODY WEIGHT
          </div>

          <h2>
            Weight Progress
          </h2>

        </div>

      </div>


      <div
        class="mana-v947-weight-summary"
      >

        <div
          class="mana-v947-weight-stat"
        >

          <span>
            Starting
          </span>

          <strong>
            ${
              summary.start
                ? `${summary.start.toFixed(
                    1
                  )} kg`
                : "—"
            }
          </strong>

        </div>


        <div
          class="mana-v947-weight-stat"
        >

          <span>
            Current
          </span>

          <strong>
            ${
              summary.current
                ? `${summary.current.toFixed(
                    1
                  )} kg`
                : "—"
            }
          </strong>

        </div>


        <div
          class="mana-v947-weight-stat"
        >

          <span>
            Change
          </span>

          <strong>
            ${
              summary.start &&
              summary.current
                ? changeLabel(
                    summary.change
                  )
                : "—"
            }
          </strong>

        </div>

      </div>


      <div
        class="mana-v947-weight-form"
      >

        <div
          class="mana-v947-weight-field"
        >

          <label>
            Date
          </label>

          <input
            type="date"
            id="manaV947WeightDate"
            value="${todayInputDate()}"
          />

        </div>


        <div
          class="mana-v947-weight-field"
        >

          <label>
            Weight kg
          </label>

          <input
            type="number"
            id="manaV947WeightValue"
            min="30"
            max="300"
            step="0.1"
            inputmode="decimal"
            placeholder="e.g. 83.5"
          />

        </div>

      </div>


      <button
        type="button"
        class="mana-v947-save-weight"
        id="manaV947SaveWeight"
      >
        LOG BODY WEIGHT
      </button>


      <div
        class="mana-v947-weight-status"
        id="manaV947WeightStatus"
      ></div>


      <div
        class="mana-v947-history"
      >

        <div
          class="mana-v947-history-title"
        >
          Recent check-ins
        </div>

        ${historyHtml()}

      </div>

    `;


    firstSection
      .insertAdjacentElement(
        "beforebegin",
        card
      );


    bindWeightEvents();
  }


  function bindWeightEvents() {

    document
      .getElementById(
        "manaV947SaveWeight"
      )
      ?.addEventListener(
        "click",
        saveWeightEntry
      );


    document
      .querySelectorAll(
        "[data-v947-delete]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              deleteWeightEntry(
                button.dataset
                  .v947Delete
              );

            }
          );

        }
      );
  }


  function saveWeightEntry() {

    const date =
      document
        .getElementById(
          "manaV947WeightDate"
        )
        ?.value;


    const weight =
      Number(
        document
          .getElementById(
            "manaV947WeightValue"
          )
          ?.value ||
        0
      );


    const status =
      document.getElementById(
        "manaV947WeightStatus"
      );


    if (
      !date
    ) {

      if (status) {

        status.textContent =
          "Choose a date.";

      }

      return;
    }


    if (
      !weight ||
      weight < 30 ||
      weight > 300
    ) {

      if (status) {

        status.textContent =
          "Enter a valid body weight.";

      }

      return;
    }


    let entries =
      loadWeights();


    /*
      One entry per date.
      Logging again on the same date
      replaces that day's value.
    */

    entries =
      entries.filter(
        item =>
          item.date !==
          date
      );


    entries.push({
      id:
        `weight-${Date.now()}`,

      date,

      weight:
        Number(
          weight.toFixed(
            1
          )
        ),

      savedAt:
        new Date()
          .toISOString()
    });


    entries.sort(
      (
        a,
        b
      ) =>
        new Date(
          a.date
        ) -
        new Date(
          b.date
        )
    );


    saveWeights(
      entries
    );


    renderWeightTracker();


    setTimeout(
      renderProgramSummary,
      50
    );
  }


  function deleteWeightEntry(
    id
  ) {

    if (
      !id
    ) {
      return;
    }


    const confirmed =
      window.confirm(
        "Delete this body-weight entry?"
      );


    if (
      !confirmed
    ) {
      return;
    }


    const entries =
      loadWeights()
        .filter(
          item =>
            item.id !==
            id
        );


    saveWeights(
      entries
    );


    renderWeightTracker();


    setTimeout(
      renderProgramSummary,
      50
    );
  }


  /* =========================================
     SAFE REFRESH SCHEDULERS
     ========================================= */

  function scheduleOverview(
    delay = 140
  ) {

    setTimeout(
      renderProgramSummary,
      delay
    );
  }


  function scheduleProgress(
    delay = 160
  ) {

    setTimeout(
      renderWeightTracker,
      delay
    );
  }


  /* =========================================
     EVENTS
     ========================================= */

  function wireEvents() {

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            '#manaV83Tabs [data-v83-tab="overview"]'
          )
        ) {

          scheduleOverview(
            140
          );
        }


        if (
          event.target.closest(
            '#manaV83Tabs [data-v83-tab="progress"]'
          )
        ) {

          scheduleProgress(
            160
          );
        }

      }
    );


    window.addEventListener(
      "mana:program-tab-change",
      () => {

        if (
          activeTab() ===
          "overview"
        ) {

          scheduleOverview(
            140
          );

        }


        if (
          activeTab() ===
          "progress"
        ) {

          scheduleProgress(
            160
          );

        }

      }
    );


    window.addEventListener(
      "mana:profile-synced",
      () => {

        scheduleOverview(
          160
        );

      }
    );


    window.addEventListener(
      "mana:body-weight-updated",
      () => {

        if (
          activeTab() ===
          "overview"
        ) {

          scheduleOverview(
            80
          );
        }

      }
    );


    window.addEventListener(
      "focus",
      () => {

        if (
          !strengthShellOpen()
        ) {
          return;
        }


        if (
          activeTab() ===
          "overview"
        ) {

          scheduleOverview(
            120
          );
        }


        if (
          activeTab() ===
          "progress"
        ) {

          scheduleProgress(
            120
          );
        }

      }
    );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    injectStyles();

    wireEvents();


    /*
      A few safe delayed checks only.
      No permanent polling.
    */

    setTimeout(
      () => {

        if (
          activeTab() ===
          "overview"
        ) {

          renderProgramSummary();
        }


        if (
          activeTab() ===
          "progress"
        ) {

          renderWeightTracker();
        }

      },
      900
    );
  }


  window.MANA_PROGRAM_WEIGHT_BUILD =
    BUILD;


  window.renderManaProgramSummary =
    renderProgramSummary;


  window.renderManaBodyWeight =
    renderWeightTracker;


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
