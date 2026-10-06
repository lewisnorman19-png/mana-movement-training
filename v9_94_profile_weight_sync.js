/* =========================================
   MANA MOVEMENT TRAINING v9.94.0
   PROFILE ↔ BODY WEIGHT SYNC

   PROFILE IS THE MASTER WEIGHT SOURCE

   - Highlights CURRENT BODY WEIGHT in Profile
   - Profile save records weight into
     Strength Progress history
   - Same-day updates replace today's entry
     rather than creating duplicates
   - Existing profile weight seeds history
     if no weight history exists
   - Fuel continues using Profile weight
   - Strength Progress updates immediately

   NO:
   - workout changes
   - timer changes
   - fuel-store reset
   - profile reset
   - MutationObserver
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "99400";


  const PROFILE_KEY =
    "mana-profile-v67";


  const WEIGHT_KEY =
    "mana-strength-v947-body-weight";


  const STYLE_ID =
    "mana-v994-profile-weight-style";


  let weightBeforeSave =
    null;


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


  function loadWeights() {

    const entries =
      safeJson(
        localStorage.getItem(
          WEIGHT_KEY
        ) || "[]",
        []
      );


    return Array.isArray(
      entries
    )
      ? entries
      : [];

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

  }


  function todayKey() {

    const date =
      new Date();


    return [

      date.getFullYear(),

      String(
        date.getMonth() + 1
      )
        .padStart(
          2,
          "0"
        ),

      String(
        date.getDate()
      )
        .padStart(
          2,
          "0"
        )

    ].join(
      "-"
    );

  }


  function validWeight(
    value
  ) {

    const weight =
      Number(
        value
      );


    return (
      Number.isFinite(
        weight
      )
      &&
      weight >= 30
      &&
      weight <= 300
    );

  }


  /* =========================================
     SAVE / UPDATE WEIGHT HISTORY
     ========================================= */

  function recordWeight(
    weight,
    options = {}
  ) {

    const value =
      Number(
        weight
      );


    if (
      !validWeight(
        value
      )
    ) {

      return false;

    }


    const entries =
      loadWeights();


    const date =
      todayKey();


    const todayIndex =
      entries.findIndex(
        item =>
          item?.date ===
          date
      );


    const entry = {

      id:
        (
          todayIndex >= 0
            ? entries[
                todayIndex
              ]?.id
            : null
        )
        ||
        (
          "profile-" +
          Date.now()
        ),

      date,

      weight:
        Number(
          value.toFixed(
            1
          )
        ),

      source:
        "profile",

      updatedAt:
        new Date()
          .toISOString()

    };


    /*
      One body-weight entry per day.

      If the user weighs themselves twice
      and changes Profile again today,
      today's Progress entry updates rather
      than creating two duplicate rows.
    */

    if (
      todayIndex >= 0
    ) {

      entries[
        todayIndex
      ] = {

        ...entries[
          todayIndex
        ],

        ...entry

      };

    } else {

      entries.push(
        entry
      );

    }


    entries.sort(
      (
        a,
        b
      ) =>

        String(
          a?.date || ""
        )
          .localeCompare(
            String(
              b?.date || ""
            )
          )
    );


    saveWeights(
      entries
    );


    window.dispatchEvent(
      new CustomEvent(
        "mana:body-weight-updated",
        {
          detail:{
            weight:
              value,

            date,

            source:
              options.source ||
              "profile"
          }
        }
      )
    );


    return true;

  }


  /* =========================================
     INITIAL HISTORY SEED

     If Profile already has a valid weight
     but no Progress weight history exists,
     use that as the starting point.
     ========================================= */

  function seedExistingProfileWeight() {

    const entries =
      loadWeights();


    if (
      entries.length
    ) {

      return;

    }


    const profile =
      loadProfile();


    const weight =
      Number(
        profile.weight || 0
      );


    if (
      !validWeight(
        weight
      )
    ) {

      return;

    }


    recordWeight(
      weight,
      {
        source:
          "profile-seed"
      }
    );

  }


  /* =========================================
     PROFILE WEIGHT HIGHLIGHT
     ========================================= */

  function installStyles() {

    if (
      document.getElementById(
        STYLE_ID
      )
    ) {

      return;

    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      STYLE_ID;


    style.textContent = `

      /* =====================================
         CURRENT WEIGHT — MASTER VALUE
         ===================================== */

      #manaProfileWeight
      .mana-v994-unused{
        display:none;
      }


      .mana-v994-weight-field{

        position:
          relative;

        grid-column:
          1 / -1;

        margin:
          2px 0 14px !important;

        padding:
          14px;

        border:
          1px solid
          #75621f;

        border-radius:
          16px;

        background:
          linear-gradient(
            145deg,
            #181507,
            #0b0b0b
          );

      }


      .mana-v994-weight-field label{

        color:
          #f3d875 !important;

        font-size:
          11px !important;

        font-weight:
          950 !important;

        letter-spacing:
          .08em;

        text-transform:
          uppercase;

      }


      .mana-v994-weight-field
      #manaProfileWeight{

        min-height:
          56px !important;

        border-color:
          #62531d !important;

        background:
          #080808 !important;

        color:
          #fff !important;

        font-size:
          21px !important;

        font-weight:
          900 !important;

      }


      .mana-v994-weight-note{

        margin-top:
          8px;

        color:
          #8c8c8c;

        font-size:
          10px;

        line-height:
          1.5;

      }


      .mana-v994-weight-note strong{

        color:
          #d9bb55;

      }


      .mana-v994-weight-saved{

        display:
          none;

        margin-top:
          8px;

        color:
          #f3d875;

        font-size:
          10px;

        font-weight:
          900;

      }


      .mana-v994-weight-saved.show{

        display:
          block;

      }


      /* =====================================
         PROGRESS LINK
         ===================================== */

      .mana-v994-update-weight{

        width:
          100%;

        min-height:
          44px;

        margin-top:
          12px;

        border:
          1px solid
          #50451d;

        border-radius:
          12px;

        background:
          #11100b;

        color:
          #f3d875;

        font-size:
          10px;

        font-weight:
          950;

        letter-spacing:
          .05em;

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  function decorateWeightField() {

    const input =
      document.getElementById(
        "manaProfileWeight"
      );


    if (!input) {

      return;

    }


    const field =
      input.closest(
        ".mana-profile-field"
      );


    if (!field) {

      return;

    }


    field.classList.add(
      "mana-v994-weight-field"
    );


    const label =
      field.querySelector(
        "label"
      );


    if (label) {

      label.textContent =
        "Current body weight • kg";

    }


    if (
      !field.querySelector(
        ".mana-v994-weight-note"
      )
    ) {

      const note =
        document.createElement(
          "div"
        );


      note.className =
        "mana-v994-weight-note";


      note.innerHTML = `
        <strong>
          MASTER WEIGHT
        </strong>
        • Used by Strength Progress and
        your Fuel calculations. Update this
        whenever your current body weight changes.
      `;


      field.appendChild(
        note
      );

    }


    if (
      !field.querySelector(
        ".mana-v994-weight-saved"
      )
    ) {

      const saved =
        document.createElement(
          "div"
        );


      saved.className =
        "mana-v994-weight-saved";


      saved.id =
        "manaV994WeightSaved";


      saved.textContent =
        "Weight added to Progress ✓";


      field.appendChild(
        saved
      );

    }

  }


  function showSavedMessage() {

    const message =
      document.getElementById(
        "manaV994WeightSaved"
      );


    if (!message) {

      return;

    }


    message.classList.add(
      "show"
    );


    setTimeout(
      () => {

        message.classList.remove(
          "show"
        );

      },
      1800
    );

  }


  /* =========================================
     PROFILE SAVE SYNC
     ========================================= */

  function snapshotWeightBeforeSave() {

    const profile =
      loadProfile();


    weightBeforeSave =
      Number(
        profile.weight || 0
      );

  }


  function syncAfterProfileSave() {

    const profile =
      loadProfile();


    const currentWeight =
      Number(
        profile.weight || 0
      );


    if (
      !validWeight(
        currentWeight
      )
    ) {

      return;

    }


    const entries =
      loadWeights();


    const todayEntry =
      entries.find(
        item =>
          item?.date ===
          todayKey()
      );


    const changed =
      !validWeight(
        weightBeforeSave
      )
      ||
      Math.abs(
        currentWeight -
        weightBeforeSave
      ) >=
      0.05;


    const todayDifferent =
      !todayEntry
      ||
      Math.abs(
        Number(
          todayEntry.weight || 0
        ) -
        currentWeight
      ) >=
      0.05;


    /*
      Record when:
      - profile weight changed, OR
      - today's weight history does not
        already match the profile.
    */

    if (
      changed ||
      todayDifferent
    ) {

      if (
        recordWeight(
          currentWeight,
          {
            source:
              "profile-save"
          }
        )
      ) {

        showSavedMessage();

      }

    }


    weightBeforeSave =
      currentWeight;

  }


  /* =========================================
     OPTIONAL PROGRESS → PROFILE BUTTON
     ========================================= */

  function addProgressWeightButton() {

    const root =
      document.getElementById(
        "manaV993StrengthProgress"
      );


    if (!root) {

      return;

    }


    const active =
      root.querySelector(
        '[data-v993-detail="weight"].active'
      );


    if (!active) {

      return;

    }


    const panel =
      document.getElementById(
        "manaV993Detail"
      );


    if (
      !panel ||
      panel.querySelector(
        "#manaV994OpenWeightProfile"
      )
    ) {

      return;

    }


    const button =
      document.createElement(
        "button"
      );


    button.type =
      "button";


    button.id =
      "manaV994OpenWeightProfile";


    button.className =
      "mana-v994-update-weight";


    button.textContent =
      "UPDATE CURRENT WEIGHT IN PROFILE →";


    button.addEventListener(
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


          setTimeout(
            () => {

              decorateWeightField();


              const input =
                document.getElementById(
                  "manaProfileWeight"
                );


              input?.focus();


              input?.scrollIntoView(
                {
                  behavior:
                    "smooth",

                  block:
                    "center"
                }
              );

            },
            100
          );

        }

      }
    );


    panel.appendChild(
      button
    );

  }


  /* =========================================
     EVENTS
     ========================================= */

  function wireEvents() {

    /*
      Capture runs BEFORE v6.7's
      manaProfileSave.onclick.
    */

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "#manaProfileSave"
          )
        ) {

          snapshotWeightBeforeSave();


          /*
            v6.7 saves synchronously.
            Run immediately after its
            existing save handler.
          */

          setTimeout(
            syncAfterProfileSave,
            0
          );

        }


        if (
          event.target.closest(
            '[data-v993-detail="weight"]'
          )
        ) {

          setTimeout(
            addProgressWeightButton,
            80
          );

        }

      },
      true
    );


    window.addEventListener(
      "mana:profile-synced",
      () => {

        setTimeout(
          () => {

            decorateWeightField();

            addProgressWeightButton();

          },
          70
        );

      }
    );


    window.addEventListener(
      "mana:program-tab-change",
      () => {

        setTimeout(
          addProgressWeightButton,
          100
        );

      }
    );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();


    seedExistingProfileWeight();


    wireEvents();


    decorateWeightField();


    setTimeout(
      () => {

        decorateWeightField();

        addProgressWeightButton();

      },
      250
    );


    window.MANA_PROFILE_WEIGHT_SYNC_BUILD =
      BUILD;


    console.log(
      "[Mana v9.94.0] " +
      "Profile weight master sync ready"
    );

  }


  if (
    document.readyState ===
      "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once:true
      }
    );

  } else {

    init();

  }

})();
