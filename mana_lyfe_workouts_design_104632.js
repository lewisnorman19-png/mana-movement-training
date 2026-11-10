/* ============================================================
   MANA MOVEMENT TRAINING
   MANA LYFE — WORKOUTS PREMIUM DESIGN
   BUILD 104632

   COMPLETE FILE: mana_lyfe_workouts_design_104632.js

   FIXES
   - Removes right-side completion tick
   - Keeps left completed number/tick orange
   - Restores workout whakataukī at bottom
   - Workout whakataukī styled orange
   - Green remains Reset only

   PRESERVES
   - Existing workout content
   - Week navigation
   - Completion state and saved data
   - Existing click handlers
   - Mana28 / Mana Strength / Daily Routine
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104632";
  const STYLE_ID = "manaLyfeWorkouts104632";
  const FOOTER_ID = "manaLyfeWorkoutWhakatauki104632";

  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;

  style.textContent = `
    /* ======================================
       MANA LYFE WORKOUTS — DESIGN TOKENS
       ====================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-root,
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-session {

      --lyfe-orange: #FF7927;
      --lyfe-white: #FFFFFF;
      --lyfe-silver: #C1C6CE;
      --lyfe-surface: #15171A;
      --lyfe-surface-2: #211810;
      --lyfe-track: #383D44;
      --lyfe-border: #454B53;
    }

    /* ======================================
       WORKOUT PAGE INTRO
       ====================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-kicker,
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-workout-category,
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-day-label {
      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-intro {
      border-bottom-color: #464B52 !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-intro::after {
      background: #FF7927 !important;
      background-image: none !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-intro h2,
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-week-title {
      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-intro p {
      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    /* ======================================
       FOUR-WEEK SELECTOR
       ====================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-weeks {
      background: #0A0B0D !important;
      border: 1px solid #454A51 !important;
      box-shadow: none !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-week {
      background: transparent !important;
      background-image: none !important;
      border: 1px solid transparent !important;
      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
      box-shadow: none !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-week.active {
      background: #FF7927 !important;
      background-image: none !important;
      border-color: #FF7927 !important;
      color: #08090B !important;
      -webkit-text-fill-color: #08090B !important;
      box-shadow: none !important;
    }

    /* ======================================
       WEEK PROGRESS
       ====================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-week-progress {
      border: 1px solid #FF7927 !important;
      background: #20160F !important;
      background-image: none !important;
      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    /* ======================================
       UNFINISHED WORKOUT CARDS
       ====================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-day:not(.done) {
      border: 1px solid #FFFFFF !important;
      background: #15171A !important;
      background-image: none !important;
      box-shadow: none !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-day::before {
      display: none !important;
      content: none !important;
      background: none !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-day:not(.done) .mana-v980-number {
      border: 1px solid #FF7927 !important;
      background: #101216 !important;
      background-image: none !important;
      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
      box-shadow: none !important;
    }

    /* ======================================
       COMPLETED WORKOUTS — ORANGE
       ====================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-day.done {
      position: relative !important;
      border: 1.5px solid #FF7927 !important;
      border-color: #FF7927 !important;
      background: #211810 !important;
      background-image: none !important;
      box-shadow: none !important;
    }

    /* Left number / tick box */
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-day.done .mana-v980-number {
      border: 1px solid #FF7927 !important;
      background: #FF7927 !important;
      background-image: none !important;
      color: #08090B !important;
      -webkit-text-fill-color: #08090B !important;
      box-shadow: none !important;
    }

    /* REMOVE right-side tick completely */
    html body.mana-lyfe-103170
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-day.done::after,
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-day.done::after {
      display: none !important;
      content: none !important;
      background: none !important;
      border: 0 !important;
      box-shadow: none !important;
    }

    /* ======================================
       CARD HEADINGS AND DESCRIPTIONS
       ====================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-category,
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-day.done .mana-v980-category {
      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-title,
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-day.done .mana-v980-title {
      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-time {
      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-arrow {
      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    /* ======================================
       INDIVIDUAL WORKOUT SCREEN
       ====================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-back-week {
      background: #15171A !important;
      background-image: none !important;
      border: 1px solid #626973 !important;
      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-workout-head {
      border-bottom-color: #454B53 !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-workout-title {
      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-focus {
      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-duration {
      border: 1px solid #FF7927 !important;
      background: #20160F !important;
      background-image: none !important;
      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    /* ======================================
       WORKOUT NOTES
       ====================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-note {
      border: 1px solid #535963 !important;
      background: #15171A !important;
      background-image: none !important;
      box-shadow: none !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-note::before {
      background: #FF7927 !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-note-title {
      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-note-text {
      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    /* ======================================
       EXERCISES
       ====================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-exercises {
      border-top-color: #454B53 !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-exercise {
      border-bottom-color: #454B53 !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-exercise-name {
      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-exercise-detail {
      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    /* ======================================
       COMPLETE WORKOUT BUTTON
       ====================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-complete {
      background: #FF7927 !important;
      background-image: none !important;
      color: #08090B !important;
      -webkit-text-fill-color: #08090B !important;
      box-shadow: none !important;
    }

    /* ======================================
       SHARED FOOTER WHAKATAUKĪ
       If shared footer exists, make it orange.
       ====================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content #manaV985Whakatauki {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      border-left: 3px solid #FF7927 !important;
      background: #15171A !important;
      background-image: none !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content #manaV985Whakatauki .mana-v985-footer-label {
      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content #manaV985Whakatauki strong {
      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content #manaV985Whakatauki span {
      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    /* ======================================
       FALLBACK WORKOUT WHAKATAUKĪ
       ====================================== */

    #${FOOTER_ID} {
      width: 100%;
      box-sizing: border-box;
      margin: 18px 0 28px;
      padding: 16px 17px;
      border-left: 3px solid #FF7927;
      border-radius: 0 15px 15px 0;
      background: linear-gradient(145deg,#151309,#0A0A0A);
    }

    #${FOOTER_ID} .mana-lyfe-workout-whakatauki-label {
      color: #FF7927;
      font-size: 9px;
      font-weight: 950;
      letter-spacing: .15em;
      text-transform: uppercase;
    }

    #${FOOTER_ID} strong {
      display: block;
      margin-top: 7px;
      color: #FF7927;
      font-size: 16px;
      font-weight: 900;
      line-height: 1.45;
    }

    #${FOOTER_ID} span {
      display: block;
      margin-top: 6px;
      color: #C1C6CE;
      font-size: 12px;
      line-height: 1.5;
    }

    /* ======================================
       ACCESSIBILITY
       ====================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-week:focus-visible,
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-day:focus-visible,
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-back-week:focus-visible,
    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content .mana-v980-complete:focus-visible {
      outline: 2px solid #FF7927 !important;
      outline-offset: 3px !important;
    }

    /* ======================================
       MOBILE
       ====================================== */

    @media (max-width: 700px) {
      #manaV83ProgramShell.mana-lyfe-premium-104580
      #manaV83Content .mana-v980-week {
        min-width: 0 !important;
        padding: 0 3px !important;
      }

      #manaV83ProgramShell.mana-lyfe-premium-104580
      #manaV83Content .mana-v980-day,
      #manaV83ProgramShell.mana-lyfe-premium-104580
      #manaV83Content .mana-v980-copy {
        min-width: 0 !important;
      }

      #manaV83ProgramShell.mana-lyfe-premium-104580
      #manaV83Content .mana-v980-title {
        overflow-wrap: break-word !important;
      }
    }
  `;

  document.head.appendChild(style);

  function createFallbackWhakatauki() {
    const footer = document.createElement("div");
    footer.id = FOOTER_ID;

    footer.innerHTML = `
      <div class="mana-lyfe-workout-whakatauki-label">
        WHAKATAUKĪ
      </div>
      <strong>
        Mā te huruhuru te manu ka rere.
      </strong>
      <span>
        With feathers a bird can fly — small things build the strength to move forward.
      </span>
    `;

    return footer;
  }

  function ensureWorkoutWhakatauki() {
    const content = document.querySelector("#manaV83Content");
    if (!content) return;

    const existingSharedFooter = content.querySelector("#manaV985Whakatauki");
    if (existingSharedFooter) {
      existingSharedFooter.style.display = "block";
      existingSharedFooter.style.visibility = "visible";
      existingSharedFooter.style.opacity = "1";
      return;
    }

    const root = content.querySelector(".mana-v980-root");
    if (!root) return;

    const workoutCards = root.querySelectorAll(".mana-v980-day");
    if (workoutCards.length < 4) return;

    if (root.querySelector("#" + FOOTER_ID)) return;

    root.appendChild(createFallbackWhakatauki());
  }

  ensureWorkoutWhakatauki();

  const observer = new MutationObserver(() => {
    ensureWorkoutWhakatauki();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log(
    "[ManaLyfe] Workouts polish " + BUILD
  );
})();
