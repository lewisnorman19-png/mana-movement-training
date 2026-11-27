
/*
 MANA MOVEMENT — EXERCISE DEMO LAYER FIX
 COMPLETE BUILD 100228

 Fixes the original Start/Finish demo player
 appearing behind Exercise Visual Review.

 Preserves:
 - All existing exercise artwork
 - Master Exercise Registry
 - Coach and automated workouts
 - Sets, reps and workout completion
 - Supabase records
 - Progress history
*/
(() => {
  "use strict";

  const BUILD = "100228";
  const STYLE_ID = "manaExerciseDemoLayerFix100228";

  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;

  style.textContent = `
    /* Keep Exercise Visual Review visible. */
    #manaExerciseVisualReview100226 {
      z-index: 2147483001 !important;
    }

    /* Open the original demo ABOVE the review. */
    #manaV970FormGuide.open {
      z-index: 2147483500 !important;
    }

    /* Keep demo contents fully interactive. */
    #manaV970FormGuide.open,
    #manaV970FormGuide.open .m10116-guide {
      pointer-events: auto !important;
    }
  `;

  document.head.appendChild(style);

  window.MANA_EXERCISE_DEMO_LAYER_FIX = {
    build: BUILD,
    active: true
  };

  console.info(
    "[Mana Movement] Exercise Demo Layer Fix",
    BUILD,
    "active"
  );

})();
