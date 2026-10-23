
/* ============================================
   MANA MOVEMENT TRAINING
   MANA 28 + MANA LYFE
   WORKOUT PRESENTATION POLISH

   BUILD 103120

   PURPOSE
   - Better exercise alignment
   - More balanced horizontal spacing
   - Larger white exercise names
   - Clearer exercise instructions
   - Better warm-up readability
   - Better finisher/notes readability
   - No inner exercise divider borders

   PRESERVE
   - All workout structure
   - All workout content
   - Existing navigation
   - Complete workout button
   - All Strength workouts
   - Mobile and desktop functionality
   ============================================ */

(() => {
  "use strict";

  const BUILD = "103120";

  const STYLE_ID =
    "mana28-lyfe-workout-polish-103120";

  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const CSS = `

    :root {
      --mana-workout-gold:
        rgba(230,189,72,.68);
    }

    /* =====================================
       MANA 28 / LYFE WORKOUT CONTAINER
       ===================================== */

    #manaV83Content
    .mana-v980-session {

      box-sizing: border-box;

    }

    /* =====================================
       EXERCISE LIST

       Bring text in from the left edge.
       Preserve existing order and layout.
       ===================================== */

    #manaV83Content
    .mana-v980-exercises {

      margin-top: 16px !important;

      padding: 4px 12px !important;

      border-top: none !important;

      box-sizing: border-box !important;

    }

    /* Individual exercise blocks */

    #manaV83Content
    .mana-v980-exercises
    .mana-v980-exercise {

      padding:
        16px 8px !important;

      border:
        none !important;

      outline:
        none !important;

      box-shadow:
        none !important;

      box-sizing:
        border-box !important;

    }

    /* =====================================
       EXERCISE NAME

       Bigger white text
       ===================================== */

    #manaV83Content
    .mana-v980-exercise-name {

      display: block !important;

      color:
        #ffffff !important;

      font-size:
        19px !important;

      font-weight:
        900 !important;

      line-height:
        1.3 !important;

      letter-spacing:
        -.015em !important;

      padding-right:
        6px !important;

      overflow-wrap:
        break-word !important;

    }

    /* =====================================
       EXERCISE DETAILS

       Better readability and spacing
       ===================================== */

    #manaV83Content
    .mana-v980-exercise-detail {

      display: block !important;

      margin-top:
        7px !important;

      color:
        #bfbfbf !important;

      font-size:
        15px !important;

      font-weight:
        500 !important;

      line-height:
        1.5 !important;

      letter-spacing:
        .005em !important;

    }

    /* =====================================
       WARM-UP / FINISHER PANELS
       ===================================== */

    #manaV83Content
    .mana-v980-session
    .mana-v980-note {

      margin-top:
        18px !important;

      padding:
        17px 20px !important;

      border:
        1px solid
        var(--mana-workout-gold) !important;

      border-radius:
        15px !important;

      box-sizing:
        border-box !important;

    }

    /* Warm-up and finisher labels */

    #manaV83Content
    .mana-v980-session
    .mana-v980-note-title {

      color:
        #f3d875 !important;

      font-size:
        12px !important;

      font-weight:
        900 !important;

      line-height:
        1.35 !important;

      letter-spacing:
        .09em !important;

      margin-bottom:
        9px !important;

    }

    /* Main warm-up and finisher instructions */

    #manaV83Content
    .mana-v980-session
    .mana-v980-note-text {

      color:
        #eeeeee !important;

      font-size:
        15px !important;

      font-weight:
        500 !important;

      line-height:
        1.65 !important;

    }

    /* =====================================
       PHONE VIEW

       Balanced but not cramped
       ===================================== */

    @media (max-width: 700px) {

      #manaV83Content
      .mana-v980-exercises {

        padding:
          3px 10px !important;

      }

      #manaV83Content
      .mana-v980-exercise {

        padding:
          15px 7px !important;

      }

      #manaV83Content
      .mana-v980-exercise-name {

        font-size:
          18px !important;

      }

      #manaV83Content
      .mana-v980-exercise-detail {

        font-size:
          14px !important;

        line-height:
          1.5 !important;

      }

      #manaV83Content
      .mana-v980-session
      .mana-v980-note {

        padding:
          15px 17px !important;

      }

      #manaV83Content
      .mana-v980-session
      .mana-v980-note-text {

        font-size:
          14px !important;

      }

    }

  `;

  function init() {
    const style = document.createElement("style");

    style.id = STYLE_ID;
    style.textContent = CSS;

    document.head.appendChild(style);

    window.MANA_WORKOUT_POLISH_BUILD =
      BUILD;

    console.log(
      "MANA 28 + LYFE WORKOUT POLISH",
      BUILD
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
