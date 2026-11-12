
/* =====================================================
   MANA MOVEMENT TRAINING
   COACH CLIENT PROFILE — PREMIUM TIDY
   BUILD 104760

   COMPLETE NEW FILE:
   mana_coach_client_profile_tidy_104760.js

   IMPROVES:
   - Client profile header
   - Coaching action cards
   - Session / adherence / check-in figures
   - Assigned Programs
   - Generated workout viewer
   - Fuel targets and exercise day cards
   - Session history and lower coaching panels
   - Coach navigation active-state styling
   - Mobile readability

   DESIGN:
   Black / Orange / White / Silver

   PRESERVES:
   - All existing DOM elements and events
   - Client data and program assignments
   - Generated workout cloud sync
   - Program Builder
   - Coaching notes, sessions and messages
   - All client-side screens

   VISUAL-ONLY CHANGE.
   No Supabase writes.
   No DOM replacement or rearrangement.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104760";
  const STYLE_ID = "manaCoachClientProfileTidy104760";

  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_ID;

  style.textContent = `

    /* =====================================
       COACH PROFILE FOUNDATION
       ===================================== */

    #coachClientDetailView {
      width: min(1000px,calc(100% - 24px)) !important;
      max-width: 1000px !important;
      margin: 0 auto !important;
      padding-bottom: 115px !important;

      color: #FFFFFF !important;
    }

    #coachClientDetailView,
    #coachClientDetailView * {
      box-sizing: border-box;
    }

    /* =====================================
       CLIENT HEADER
       ===================================== */

    #coachClientDetailView
    #manaV998ClientHero {
      background: #101215 !important;
      background-image: none !important;

      border: 1px solid #626973 !important;
      border-radius: 22px !important;

      box-shadow: none !important;
      margin-bottom: 14px !important;
    }

    #coachClientDetailView
    #manaV998ClientHero::before {
      display: none !important;
    }

    #coachClientDetailView
    .mana-v998-kicker,
    #coachClientDetailView
    .mana-v998-hero-purpose {
      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    #coachClientDetailView
    .mana-v998-name {
      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    #coachClientDetailView
    .mana-v998-sub {
      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    #coachClientDetailView
    .mana-v998-avatar {
      background: #17191D !important;

      border: 1px solid #FF7927 !important;
      color: #FF7927 !important;

      -webkit-text-fill-color: #FF7927 !important;
      box-shadow: none !important;
    }

    /* =====================================
       COACH ACTIONS
       ===================================== */

    #coachClientDetailView
    #manaV1010ClientActions {
      background: #15171A !important;
      background-image: none !important;

      border: 1px solid #626973 !important;
      border-radius: 20px !important;

      padding: 17px !important;
      margin-bottom: 14px !important;

      box-shadow: none !important;
    }

    #coachClientDetailView
    .m1010-actions-kicker {
      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    #coachClientDetailView
    .m1010-actions-title,
    #coachClientDetailView
    .m1010-actions-name {
      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    #coachClientDetailView
    .m1010-action-grid {
      gap: 9px !important;
    }

    #coachClientDetailView
    .m1010-action {
      min-width: 0 !important;

      background: #1B1E23 !important;
      background-image: none !important;

      border: 1px solid #59616C !important;
      border-radius: 15px !important;

      box-shadow: none !important;
    }

    #coachClientDetailView
    .m1010-action.primary {
      background: #FF7927 !important;
      border-color: #FF7927 !important;
    }

    #coachClientDetailView
    .m1010-action:not(.primary)
    .m1010-action-icon {
      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;

      border-color: #FF7927 !important;
      background: #101216 !important;
    }

    #coachClientDetailView
    .m1010-action:not(.primary) strong {
      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    #coachClientDetailView
    .m1010-action:not(.primary) small {
      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    #coachClientDetailView
    .m1010-action.primary strong,
    #coachClientDetailView
    .m1010-action.primary small,
    #coachClientDetailView
    .m1010-action.primary
    .m1010-action-icon {
      color: #08090B !important;
      -webkit-text-fill-color: #08090B !important;
    }

    /* =====================================
       CLIENT SUMMARY STATISTICS
       ===================================== */

    #coachClientDetailView
    #manaV998ClientSummary {
      gap: 10px !important;
      margin-bottom: 14px !important;
    }

    #coachClientDetailView
    #manaV998ClientSummary
    .mana-v998-stat {
      background: #15171A !important;
      background-image: none !important;

      border: 1px solid #535B65 !important;
      border-radius: 15px !important;

      padding: 15px !important;
      box-shadow: none !important;
    }

    #coachClientDetailView
    #manaV998ClientSummary
    .mana-v998-stat span,
    #coachClientDetailView
    #manaV998ClientSummary
    .mana-v998-stat small {
      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    #coachClientDetailView
    #manaV998ClientSummary
    .mana-v998-stat strong {
      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    /* =====================================
       ASSIGNED PROGRAMS PANEL
       ===================================== */

    #coachClientDetailView
    #manaCoachAssignments104720 {
      background: #15171A !important;

      border: 1px solid #626973 !important;
      border-radius: 20px !important;

      padding: 19px !important;
      margin-bottom: 14px !important;

      box-shadow: none !important;
    }

    #coachClientDetailView
    #manaCoachAssignments104720 h3 {
      color: #FFFFFF !important;
    }

    #coachClientDetailView
    #manaCoachAssignments104720
    .mca-kicker {
      color: #FF7927 !important;
    }

    #coachClientDetailView
    #manaCoachAssignments104720
    .mca-row {
      background: #0D1013 !important;
      border-color: #535B65 !important;
    }

    #coachClientDetailView
    #manaCoachAssignments104720
    .mca-row strong {
      color: #FFFFFF !important;
    }

    #coachClientDetailView
    #manaCoachAssignments104720
    .mca-help,
    #coachClientDetailView
    #manaCoachAssignments104720
    .mca-status {
      line-height: 1.6 !important;
    }

    /* =====================================
       GENERATED WORKOUT PROGRAM
       ===================================== */

    #coachClientDetailView
    #manaCoachGenerated104750 {
      background: #15171A !important;

      border: 1px solid #626973 !important;
      border-radius: 20px !important;

      padding: 19px !important;
      margin-bottom: 15px !important;

      box-shadow: none !important;
    }

    #coachClientDetailView
    #manaCoachGenerated104750 h3 {
      color: #FFFFFF !important;
      margin-bottom: 9px !important;
    }

    #coachClientDetailView
    #manaCoachGenerated104750 .mg-kicker {
      color: #FF7927 !important;
      letter-spacing: .09em !important;
    }

    #coachClientDetailView
    #manaCoachGenerated104750 .mg-desc {
      color: #C1C6CE !important;
      line-height: 1.65 !important;
    }

    #coachClientDetailView
    #manaCoachGenerated104750 .mg-grid {
      gap: 10px !important;
    }

    #coachClientDetailView
    #manaCoachGenerated104750 .mg-stat {
      background: #0D1013 !important;

      border: 1px solid #535B65 !important;
      border-radius: 13px !important;

      padding: 14px !important;
    }

    #coachClientDetailView
    #manaCoachGenerated104750
    .mg-stat small {
      color: #C1C6CE !important;
    }

    #coachClientDetailView
    #manaCoachGenerated104750
    .mg-stat strong {
      color: #FFFFFF !important;
      font-weight: 850 !important;
    }

    /* =====================================
       EXPANDABLE WORKOUT DAYS
       ===================================== */

    #coachClientDetailView
    #manaCoachGenerated104750 .mg-day {
      background: #101216 !important;

      border: 1px solid #535B65 !important;
      border-radius: 14px !important;

      margin: 9px 0 !important;
      overflow: hidden !important;
    }

    #coachClientDetailView
    #manaCoachGenerated104750 .mg-day[open] {
      border-color: #FF7927 !important;
    }

    #coachClientDetailView
    #manaCoachGenerated104750 .mg-day summary {
      padding: 16px !important;
      color: #FFFFFF !important;

      font-size: 14px !important;
      font-weight: 850 !important;
      line-height: 1.5 !important;
    }

    #coachClientDetailView
    #manaCoachGenerated104750 .mg-day[open] summary {
      color: #FF7927 !important;
    }

    #coachClientDetailView
    #manaCoachGenerated104750 .mg-ex {
      gap: 12px !important;
      padding: 12px 15px !important;

      border-top: 1px solid #39414A !important;
      color: #C1C6CE !important;

      line-height: 1.5 !important;
    }

    #coachClientDetailView
    #manaCoachGenerated104750 .mg-ex strong {
      color: #FFFFFF !important;
    }

    /* =====================================
       SESSION HISTORY / EXISTING PANELS
       ===================================== */

    #coachClientDetailView
    #clientSessionSummaryCard {
      background: #15171A !important;
      background-image: none !important;

      border: 1px solid #626973 !important;
      border-radius: 20px !important;

      box-shadow: none !important;
      margin-bottom: 14px !important;
    }

    #coachClientDetailView
    #clientSessionSummaryCard
    .session-summary-stat {
      background: #0D1013 !important;

      border: 1px solid #535B65 !important;
      border-radius: 13px !important;
    }

    #coachClientDetailView
    #clientSessionSummaryCard
    .session-summary-stat strong {
      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    /* Other coaching cards retain
       their existing layout and actions. */

    #coachClientDetailView > .card {
      background: #15171A !important;
      background-image: none !important;

      border-color: #535B65 !important;
      box-shadow: none !important;
    }

    /* =====================================
       BACK BUTTON / DETAIL LABEL
       ===================================== */

    #coachClientDetailView
    #backToCoachClients {
      background: #15171A !important;

      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;

      border: 1px solid #626973 !important;
      border-radius: 11px !important;
    }

    /* =====================================
       ACTIVE NAVIGATION

       Client detail belongs to Clients.
       CSS only — no routing changes.
       ===================================== */

    body:has(#coachClientDetailView:not(.hide))
    #manaV97CoachNav
    [data-coach-page="home"] {
      background: #15171A !important;
      border-color: #454B53 !important;

      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    body:has(#coachClientDetailView:not(.hide))
    #manaV97CoachNav
    [data-coach-page="fuel"] {
      background: #392013 !important;
      border-color: #FF7927 !important;

      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    /* =====================================
       MOBILE
       ===================================== */

    @media (max-width:700px) {

      #coachClientDetailView {
        width: calc(100% - 16px) !important;
        padding-bottom: 110px !important;
      }

      #coachClientDetailView
      #manaV998ClientHero {
        border-radius: 18px !important;
      }

      #coachClientDetailView
      #manaV1010ClientActions {
        padding: 13px !important;
        border-radius: 17px !important;
      }

      #coachClientDetailView
      #manaV998ClientSummary {
        grid-template-columns:
          repeat(2,minmax(0,1fr)) !important;
      }

      #coachClientDetailView
      #manaCoachAssignments104720,
      #coachClientDetailView
      #manaCoachGenerated104750 {
        padding: 14px !important;
        border-radius: 17px !important;
      }

      #coachClientDetailView
      #manaCoachGenerated104750 .mg-ex {
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 4px !important;
      }

      #coachClientDetailView
      #manaCoachGenerated104750 .mg-day summary {
        padding: 13px !important;
      }

    }

  `;

  document.head.appendChild(style);

  console.log(
    "[Mana Movement] Client profile tidy " + BUILD
  );

})();
