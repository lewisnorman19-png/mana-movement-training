
/* =====================================================
   MANA MOVEMENT TRAINING
   COACH / CLIENT SCREEN ISOLATION
   BUILD 104681

   COMPLETE NEW FILE:
   mana_coach_screen_isolation_104681.js

   FIX:
   - Hide separately mounted client Home
     while Coach Hub is visible
   - Keep client Home hidden when viewing
     an individual client coaching profile
   - Automatically restore normal client
     visibility when coach screens close

   PRESERVES:
   - Coach Hub runner and premium dashboard
   - Coach navigation and individual profiles
   - Client Home and program selection
   - All three client programs
   - Signup, login and logout
   - Supabase data and saved progress

   CSS-ONLY VISIBILITY FIX
   No database writes or event overrides.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104681";

  const STYLE_ID =
    "manaCoachScreenIsolation104681";

  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_ID;

  style.textContent = `

    /* =====================================
       COACH HUB ACTIVE

       Client Home was mounted outside
       the original client view.

       Hide it only while Coach Hub
       is visibly active.
       ===================================== */

    html body:has(
      #coachView:not(.hide)
    ) #manaV80Home {

      display: none !important;
      visibility: hidden !important;

    }

    /* =====================================
       INDIVIDUAL COACH CLIENT PROFILE

       Prevent client Home reappearing
       while coaching detail is active.
       ===================================== */

    html body:has(
      #coachClientDetailView:not(.hide)
    ) #manaV80Home {

      display: none !important;
      visibility: hidden !important;

    }

    /* =====================================
       ALSO HIDE CLIENT HOME NAVIGATION

       The original Home's navigation
       is a child of #manaV80Home.

       These are additional safeguards.
       ===================================== */

    html body:has(
      #coachView:not(.hide)
    ) #manaV80Home
    .mana-v8013-bottom,

    html body:has(
      #coachClientDetailView:not(.hide)
    ) #manaV80Home
    .mana-v8013-bottom {

      display: none !important;

    }

  `;

  document.head.appendChild(style);

  console.log(
    "[Mana Movement] Coach/client isolation " +
    BUILD
  );

})();
