
/* =====================================================
   MANA MOVEMENT TRAINING
   COACH CLIENT PROFILE — CLEAN SUMMARY
   BUILD 104781

   COMPLETE REPLACEMENT FILE:
   mana_coach_hide_trends_104780.js

   - Hide old Training Trends panel
   - Remove Adherence statistic from display
   - Retain Sessions Complete
   - Retain Check-ins
   - Retain Coach Sessions
   - Preserve all underlying client data
   - Preserve coaching action buttons

   VISUAL ONLY — NO DATABASE CHANGES
   ===================================================== */

(() => {
  "use strict";

  const STYLE_ID = "manaCoachHideTrends104780";

  const oldStyle =
    document.getElementById(STYLE_ID);

  if (oldStyle) oldStyle.remove();

  const style = document.createElement("style");
  style.id = STYLE_ID;

  style.textContent = `

    /* Hide unnecessary training trends */

    #coachClientDetailView
    #clientTrainingTrendsCard {
      display: none !important;
    }

    /* Remove adherence tile */

    #coachClientDetailView
    #manaV998ClientSummary
    .mana-v998-stat:has(#manaV998Adherence) {
      display: none !important;
    }

    /* Three useful coaching statistics */

    #coachClientDetailView
    #manaV998ClientSummary {
      display: grid !important;

      grid-template-columns:
        repeat(3, minmax(0, 1fr)) !important;

      gap: 10px !important;
    }

    /* Mobile layout */

    @media (max-width: 600px) {

      #coachClientDetailView
      #manaV998ClientSummary {
        grid-template-columns:
          repeat(3, minmax(0, 1fr)) !important;

        gap: 6px !important;
      }

      #coachClientDetailView
      #manaV998ClientSummary
      .mana-v998-stat {
        padding: 10px 7px !important;
      }

    }

  `;

  document.head.appendChild(style);

  console.log(
    "[Mana Movement] Coach summary tidy 104781"
  );

})();
