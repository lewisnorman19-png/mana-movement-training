
/* ==============================================
   MANA MOVEMENT TRAINING
   WORKOUT DAY ARROW FIX — BUILD 104852

   Fixes only the workout day dropdowns:
   - Properly centred orange chevron
   - Thicker arrow lines
   - Arrow stays inside its border
   - Right-aligned
   - Rotates upwards when expanded

   No navigation or workout logic changes.
   ============================================== */

(() => {
  "use strict";

  const STYLE_ID = "manaCoachWorkoutArrows104852";

  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;

  style.textContent = `

    #coachClientDetailView
    #manaCoachGenerated104750
    .mg-day > summary {
      display: flex !important;
      flex-direction: row !important;
      align-items: center !important;
      justify-content: space-between !important;
      gap: 12px !important;
      padding: 12px 16px !important;
      text-align: left !important;
      box-sizing: border-box !important;
    }

    #coachClientDetailView
    #manaCoachGenerated104750
    .mg-day > summary::after {

      content: "" !important;

      display: block !important;

      flex: 0 0 44px !important;

      width: 44px !important;
      height: 40px !important;
      min-width: 44px !important;

      box-sizing: border-box !important;

      margin: 0 !important;
      padding: 0 !important;

      border: 2px solid #FF7927 !important;
      border-radius: 10px !important;

      background-color: #101216 !important;

      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M5 9l7 7 7-7' fill='none' stroke='%23FF7927' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") !important;

      background-position: center center !important;
      background-repeat: no-repeat !important;
      background-size: 24px 24px !important;

      color: transparent !important;
      font-size: 0 !important;
      line-height: 0 !important;

      transform: none !important;
    }

    #coachClientDetailView
    #manaCoachGenerated104750
    .mg-day[open] > summary::after {

      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M5 15l7-7 7 7' fill='none' stroke='%23FF7927' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") !important;

      transform: none !important;
    }

  `;

  document.head.appendChild(style);

  console.log(
    "[Mana Movement] Workout arrows fixed 104852"
  );

})();
