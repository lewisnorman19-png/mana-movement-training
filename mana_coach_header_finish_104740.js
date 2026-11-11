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
   - No runner tile / visible box
   - No silver border around Coach Hub header
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104740";
  const STYLE_ID = "manaCoachHeaderFinish104740";

  const existing = document.getElementById(STYLE_ID);
  if (existing) existing.remove();

  const style = document.createElement("style");
  style.id = STYLE_ID;

  style.textContent = `

    /* =====================================
       COACH HUB HERO / HEADER
       ===================================== */

    #manaCoachHubClean103760 .hub-hero,
    .hub-hero {
      background: #000000 !important;
      background-image: none !important;
      border: none !important;
      outline: none !important;
      box-shadow: none !important;
    }

    /* remove any pseudo borders if present */
    #manaCoachHubClean103760 .hub-hero::before,
    #manaCoachHubClean103760 .hub-hero::after,
    .hub-hero::before,
    .hub-hero::after {
      border: none !important;
      outline: none !important;
      box-shadow: none !important;
      background: transparent !important;
    }

    /* =====================================
       RUNNER AREA
       ===================================== */

    #manaCoachHubClean103760 .hub-runner,
    .hub-runner {
      background: #000000 !important;
      background-image: none !important;
      border: none !important;
      outline: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      overflow: visible !important;
    }

    #manaCoachHubClean103760 .hub-runner img,
    .hub-runner img {
      display: block !important;
      background: #000000 !important;
      background-image: none !important;
      border: none !important;
      outline: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      object-fit: contain !important;
    }

    /* =====================================
       TITLE: COACH white / HUB orange
       ===================================== */

    #manaCoachHubClean103760 .hub-title,
    .hub-title {
      font-size: 0 !important;
      line-height: 1.12 !important;
      letter-spacing: normal !important;
    }

    #manaCoachHubClean103760 .hub-title::before,
    .hub-title::before {
      content: "COACH";
      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
      font-size: clamp(29px, 4vw, 41px) !important;
      font-weight: 950 !important;
      line-height: 1.12 !important;
    }

    #manaCoachHubClean103760 .hub-title::after,
    .hub-title::after {
      content: " HUB";
      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
      font-size: clamp(29px, 4vw, 41px) !important;
      font-weight: 950 !important;
      line-height: 1.12 !important;
      white-space: pre !important;
    }

    /* =====================================
       MOBILE
       ===================================== */

    @media (max-width: 600px) {
      #manaCoachHubClean103760 .hub-title::before,
      #manaCoachHubClean103760 .hub-title::after,
      .hub-title::before,
      .hub-title::after {
        font-size: 27px !important;
      }
    }

  `;

  document.head.appendChild(style);
  console.log("[Mana Movement] Coach header finish " + BUILD);
})();
