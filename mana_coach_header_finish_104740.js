
/* =====================================================
   MANA MOVEMENT TRAINING
   COACH HUB — HEADER FINISH
   BUILD 104740

   COMPLETE FILE:
   mana_coach_header_finish_104740.js

   FIXES:
   - COACH in white
   - HUB in orange
   - Pure black header background
   - Runner blends into black background
   - No separate runner border or tile

   PRESERVES:
   - Existing runner image
   - Dashboard layout
   - Coach navigation
   - Client management
   - All program and database functionality
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104740";
  const STYLE_ID = "manaCoachHeaderFinish104740";

  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_ID;

  style.textContent = `

    /* =====================================
       PREMIUM BLACK HEADER
       ===================================== */

    #manaCoachHubClean103760
    .hub-hero {
      background: #000000 !important;
      background-image: none !important;

      border: 1px solid #626973 !important;
      box-shadow: none !important;
    }

    /* =====================================
       RUNNER — NO VISIBLE BOX

       Original PNG has a black background.
       Matching the header to black removes
       the contrasting rectangular tile.
       ===================================== */

    #manaCoachHubClean103760
    .hub-runner {
      background: #000000 !important;
      background-image: none !important;

      border: none !important;
      border-radius: 0 !important;
      outline: none !important;
      box-shadow: none !important;

      overflow: visible !important;
    }

    #manaCoachHubClean103760
    .hub-runner img {
      display: block !important;

      background: #000000 !important;
      background-image: none !important;

      border: none !important;
      border-radius: 0 !important;
      outline: none !important;
      box-shadow: none !important;

      object-fit: contain !important;
    }

    /* =====================================
       COACH WHITE + HUB ORANGE

       Keep the original accessible heading
       text; only change its appearance.
       ===================================== */

    #manaCoachHubClean103760
    .hub-title {
      font-size: 0 !important;
      line-height: 1.12 !important;
      letter-spacing: normal !important;
    }

    #manaCoachHubClean103760
    .hub-title::before {
      content: "COACH";

      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;

      font-size: clamp(29px,4vw,41px) !important;
      font-weight: 950 !important;
      line-height: 1.12 !important;
    }

    #manaCoachHubClean103760
    .hub-title::after {
      content: " HUB";

      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;

      font-size: clamp(29px,4vw,41px) !important;
      font-weight: 950 !important;
      line-height: 1.12 !important;
      white-space: pre !important;
    }

    /* =====================================
       MOBILE
       ===================================== */

    @media (max-width:600px) {

      #manaCoachHubClean103760
      .hub-title::before,
      #manaCoachHubClean103760
      .hub-title::after {
        font-size: 27px !important;
      }

    }

  `;

  document.head.appendChild(style);

  console.log(
    "[Mana Movement] Coach header finish " +
    BUILD
  );

})();
