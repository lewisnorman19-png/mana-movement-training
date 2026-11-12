
/* =====================================================
   MANA MOVEMENT TRAINING
   COACH CLIENT PROFILE — HIDE UNUSED TRENDS
   BUILD 104780

   COMPLETE NEW FILE:
   mana_coach_hide_trends_104780.js

   HIDES:
   - Training Trends panel
   - RPE Trend
   - Session Duration Trend
   - Session-Type Mix

   PRESERVES:
   - Client profiles
   - Generated workouts
   - Fuel targets
   - Assigned Programs
   - Session summaries
   - Check-ins
   - Coaching tools
   - All underlying database records

   VISUAL ONLY — NO DATA DELETED.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104780";
  const STYLE_ID = "manaCoachHideTrends104780";

  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");

  style.id = STYLE_ID;

  style.textContent = `

    /* =====================================
       HIDE UNUSED TRAINING TRENDS
       COACH CLIENT PROFILE ONLY
       ===================================== */

    #coachClientDetailView
    #clientTrainingTrendsCard {

      display: none !important;

    }

  `;

  document.head.appendChild(style);

  console.log(
    "[Mana Movement] Coach trends hidden " +
    BUILD
  );

})();
