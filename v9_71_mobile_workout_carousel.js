/* =========================================
   MANA MOVEMENT TRAINING v9.71.0
   MOBILE WORKOUT CAROUSEL

   PHONE ONLY

   - ONE EXERCISE PER PAGE
   - SWIPE LEFT / RIGHT
   - PREVIOUS / NEXT BUTTONS
   - EXERCISE COUNTER
   - COMPACT POSITION INDICATOR
   - INFO BUTTONS STAY SIDE BY SIDE
   - COMPLETE WORKOUT ON FINAL EXERCISE
   - DESKTOP REMAINS UNCHANGED
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "97100";

  const STYLE_ID =
    "mana-v971-mobile-workout-style";

  const TOP_NAV_ID =
    "manaV971TopNav";

  const BOTTOM_NAV_ID =
    "manaV971BottomNav";

  const PHONE_QUERY =
    "(max-width: 700px)";

  let activeIndex =
    0;

  let currentSignature =
    "";

  let touchStartX =
    null;

  let touchStartY =
    null;

  let touchStartTarget =
    null;


  /* =========================================
     HELPERS
     ========================================= */

  function isPhone() {

    return window
      .matchMedia(
        PHONE_QUERY
      )
      .matches;
  }


  function workoutScreen() {

    return document
      .getElementById(
        "manaStrengthV64Workout"
      );
  }


  function holder() {

    return document
      .getElementById(
        "manaV64Exercises"
      );
  }


  function cards() {

    return [
      ...document
        .querySelectorAll(
          "#manaV64Exercises " +
          ".mana-v64-card"
        )
    ];
  }


  function workoutIsOpen() {

    const screen =
      workoutScreen();

    if (!screen) {

      return false;
    }


    return (
      screen.classList
        .contains(
          "open"
        ) ||
      getComputedStyle(
        screen
      ).display !==
        "none"
    );
  }


  function signature() {

    const title =
      document
        .getElementById(
          "manaV64Title"
        )
        ?.textContent
        ?.trim() ||
      "";


    const names =
      cards()
        .map(
          card =>
            card.dataset
              .exerciseName ||
            ""
        )
        .join("|");


    return (
      title +
      "::" +
      names
    );
  }


  function clampIndex(
    index
  ) {

    const list =
      cards();


    if (!list.length) {

      return 0;
    }


    return Math.max(
      0,

      Math.min(
        Number(index) || 0,
        list.length - 1
      )
    );
  }


  /* =========================================
     STYLES
     ========================================= */

  function installStyles() {

    document
      .getElementById(
        STYLE_ID
      )
      ?.remove();


    const style =
      document.createElement(
        "style"
      );


    style.id =
      STYLE_ID;


    style.textContent = `

      /* =====================================
         DESKTOP
         ===================================== */

      #${TOP_NAV_ID},
      #${BOTTOM_NAV_ID}{

        display:none;
      }


      /* =====================================
         PHONE
         ===================================== */

      @media(max-width:700px){

        /* WORKOUT SHELL */

        #manaStrengthV64Workout
        .mana-v64-shell{

          padding:
            14px
            12px
            calc(
              env(
                safe-area-inset-bottom
              )
              +
              24px
            ) !important;
        }


        #manaStrengthV64Workout
        .mana-v64-head{

          margin-bottom:
            8px !important;
        }


        #manaStrengthV64Workout
        .mana-v64-head
        .pill{

          font-size:
            9px !important;
        }


        #manaStrengthV64Workout
        #manaV64Title{

          margin-top:
            4px !important;

          font-size:
            26px !important;

          line-height:
            1.02 !important;
        }


        #manaStrengthV64Workout
        #manaV64Subtitle{

          margin-top:
            4px !important;

          font-size:
            12px !important;
        }


        #manaStrengthV64Workout
        .mana-v64-close{

          width:
            39px !important;

          height:
            39px !important;

          flex:
            0
            0
            39px !important;

          font-size:
            21px !important;
        }


        /* TOP STATS */

        #manaStrengthV64Workout
        .mana-v64-summary{

          gap:
            7px !important;

          margin:
            9px
            0
            8px !important;
        }


        #manaStrengthV64Workout
        .mana-v64-stat{

          padding:
            9px
            11px !important;

          border-radius:
            12px !important;
        }


        #manaStrengthV64Workout
        .mana-v64-stat span{

          margin-bottom:
            3px !important;

          font-size:
            9px !important;
        }


        #manaStrengthV64Workout
        .mana-v64-stat strong{

          font-size:
            18px !important;
        }


        #manaStrengthV64Workout
        .mana-v64-progress{

          height:
            4px !important;

          margin:
            0
            0
            10px !important;
        }


        /* =====================================
           CAROUSEL TOP
           ===================================== */

        #${TOP_NAV_ID}{

          display:
            block;

          margin:
            3px
            0
            9px;

          padding:
            10px
            12px;

          border:
            1px solid
            #292821;

          border-radius:
            13px;

          background:
            #0b0b0a;
        }


        .mana-v971-top-row{

          display:flex;

          justify-content:
            space-between;

          align-items:
            center;

          gap:
            10px;
        }


        .mana-v971-position{

          color:
            #f3d875;

          font-size:
            11px;

          font-weight:
            950;

          letter-spacing:
            .08em;

          text-transform:
            uppercase;
        }


        .mana-v971-swipe{

          color:
            #666;

          font-size:
            10px;

          font-weight:
            800;
        }


        .mana-v971-dots{

          display:flex;

          justify-content:
            center;

          align-items:
            center;

          gap:
            5px;

          margin-top:
            8px;
        }


        .mana-v971-dot{

          width:
            7px;

          height:
            7px;

          padding:0;

          border:
            0;

          border-radius:
            999px;

          background:
            #333;

          transition:
            width
            .18s
            ease,
            background
            .18s
            ease;
        }


        .mana-v971-dot.active{

          width:
            20px;

          background:
            #f3d875;
        }


        .mana-v971-dot.done{

          background:
            #7f6d2a;
        }


        /* =====================================
           ONE EXERCISE AT A TIME
           ===================================== */

        #manaV64Exercises{

          position:
            relative;

          width:
            100%;

          overflow:
            hidden;

          touch-action:
            pan-y;
        }


        #manaV64Exercises
        .mana-v64-card{

          display:none !important;

          width:
            100%;

          margin:
            0 !important;

          padding:
            14px !important;

          border-radius:
            18px !important;
        }


        #manaV64Exercises
        .mana-v64-card.mana-v971-active{

          display:
            block !important;

          animation:
            manaV971Fade
            .18s
            ease;
        }


        @keyframes manaV971Fade{

          from{
            opacity:.45;
          }

          to{
            opacity:1;
          }

        }


        #manaV64Exercises
        .mana-v64-name{

          font-size:
            20px !important;

          line-height:
            1.08 !important;
        }


        #manaV64Exercises
        .mana-v64-target{

          margin-top:
            4px !important;

          font-size:
            12px !important;
        }


        /* =====================================
           KEEP BOTH ACTIONS SIDE BY SIDE
           ===================================== */

        #manaV64Exercises
        .mana-v970-disclosure{

          display:grid !important;

          grid-template-columns:
            minmax(0,1fr)
            minmax(0,1fr) !important;

          gap:
            6px !important;

          margin-top:
            10px !important;
        }


        #manaV64Exercises
        .mana-v970-action{

          min-width:
            0 !important;

          min-height:
            40px !important;

          padding:
            7px
            5px !important;

          font-size:
            9px !important;

          line-height:
            1.2 !important;

          white-space:
            normal !important;
        }


        #manaV64Exercises
        .mana-v970-history{

          margin-top:
            7px !important;

          padding:
            11px
            12px !important;
        }


        #manaV64Exercises
        .mana-v970-history-copy{

          font-size:
            12px !important;
        }


        /* =====================================
           SET TABLE
           ===================================== */

        #manaV64Exercises
        .mana-v64-table-head{

          grid-template-columns:
            27px
            minmax(0,1fr)
            minmax(0,1fr)
            38px !important;

          gap:
            5px !important;

          margin-top:
            13px !important;

          font-size:
            9px !important;
        }


        #manaV64Exercises
        .mana-v64-set{

          grid-template-columns:
            27px
            minmax(0,1fr)
            minmax(0,1fr)
            38px !important;

          gap:
            5px !important;

          margin-top:
            6px !important;
        }


        #manaV64Exercises
        .mana-v64-set-number{

          font-size:
            11px !important;
        }


        #manaV64Exercises
        .mana-v64-set input{

          min-height:
            40px !important;

          padding:
            8px
            5px !important;

          border-radius:
            10px !important;

          font-size:
            15px !important;
        }


        #manaV64Exercises
        .mana-v64-check{

          width:
            38px !important;

          height:
            38px !important;

          border-radius:
            10px !important;
        }


        #manaV64Exercises
        .mana-v970-adjust{

          margin-top:
            7px !important;

          font-size:
            10px !important;
        }


        #manaV64Exercises
        .mana-v64-controls{

          margin-top:
            7px !important;

          gap:
            6px !important;
        }


        #manaV64Exercises
        .mana-v64-small{

          min-height:
            38px !important;

          font-size:
            11px !important;
        }


        /* =====================================
           BOTTOM NAV
           ===================================== */

        #${BOTTOM_NAV_ID}{

          display:grid;

          grid-template-columns:
            1fr
            1fr;

          gap:
            8px;

          margin-top:
            10px;
        }


        .mana-v971-nav-btn{

          min-height:
            46px;

          border:
            1px solid
            #37352a;

          border-radius:
            13px;

          background:
            #10100e;

          color:
            #ddd;

          font-size:
            11px;

          font-weight:
            950;
        }


        .mana-v971-nav-btn.next{

          border-color:
            #6c5920;

          background:
            #17140b;

          color:
            #f3d875;
        }


        .mana-v971-nav-btn:disabled{

          opacity:
            .28;
        }


        /* =====================================
           COMPLETE WORKOUT
           ONLY ON FINAL PAGE
           ===================================== */

        #manaStrengthV64Workout
        #manaV64Complete{

          display:
            none !important;
        }


        #manaStrengthV64Workout
        .mana-v971-last
        ~ #manaV64Complete{

          display:
            none !important;
        }


        #manaStrengthV64Workout.mana-v971-on-last
        #manaV64Complete{

          display:
            block !important;

          min-height:
            54px !important;

          margin-top:
            12px !important;

          font-size:
            15px !important;
        }


        #manaStrengthV64Workout
        #manaV64Status{

          min-height:
            14px !important;

          margin-top:
            5px !important;

          font-size:
            11px !important;
        }


        /* =====================================
           FORM GUIDE COMPRESSION
           ===================================== */

        #manaV970FormGuide{

          padding:
            calc(
              env(
                safe-area-inset-top
              )
              +
              10px
            )
            10px
            calc(
              env(
                safe-area-inset-bottom
              )
              +
              16px
            ) !important;
        }


        #manaV970FormGuide
        .mana-v970-guide{

          padding:
            15px
            12px !important;

          border-radius:
            19px !important;
        }


        #manaV970FormGuide
        .mana-v970-guide-title{

          font-size:
            22px !important;
        }


        #manaV970FormGuide
        .mana-v970-poses{

          gap:
            7px !important;

          margin-top:
            14px !important;
        }


        #manaV970FormGuide
        .mana-v970-pose{

          min-height:
            174px !important;

          padding:
            7px !important;

          border-radius:
            14px !important;
        }


        #manaV970FormGuide
        .mana-v970-figure{

          height:
            150px !important;
        }


        #manaV970FormGuide
        .mana-v970-cues{

          margin-top:
            11px !important;

          padding:
            13px !important;
        }


        #manaV970FormGuide
        .mana-v970-cues h3{

          margin-bottom:
            7px !important;

          font-size:
            15px !important;
        }


        #manaV970FormGuide
        .mana-v970-cues ul{

          font-size:
            12px !important;

          line-height:
            1.5 !important;
        }


        #manaV970FormGuide
        .mana-v970-avoid{

          margin-top:
            8px !important;

          padding-top:
            8px !important;

          font-size:
            12px !important;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     NAVIGATION UI
     ========================================= */

  function ensureNavigation() {

    const exerciseHolder =
      holder();


    if (!exerciseHolder) {

      return;
    }


    let top =
      document.getElementById(
        TOP_NAV_ID
      );


    if (!top) {

      top =
        document.createElement(
          "div"
        );


      top.id =
        TOP_NAV_ID;


      exerciseHolder
        .insertAdjacentElement(
          "beforebegin",
          top
        );
    }


    let bottom =
      document.getElementById(
        BOTTOM_NAV_ID
      );


    if (!bottom) {

      bottom =
        document.createElement(
          "div"
        );


      bottom.id =
        BOTTOM_NAV_ID;


      exerciseHolder
        .insertAdjacentElement(
          "afterend",
          bottom
        );
    }
  }


  function exerciseDone(
    card
  ) {

    const checks =
      [
        ...card
          .querySelectorAll(
            ".mana-v64-check"
          )
      ];


    return Boolean(
      checks.length &&
      checks.every(
        check =>
          check.classList
            .contains(
              "done"
            )
      )
    );
  }


  function renderTopNavigation() {

    const list =
      cards();


    const nav =
      document.getElementById(
        TOP_NAV_ID
      );


    if (
      !nav ||
      !list.length
    ) {

      return;
    }


    nav.innerHTML = `

      <div
        class="mana-v971-top-row"
      >

        <div
          class="mana-v971-position"
        >
          Exercise
          ${activeIndex + 1}
          of
          ${list.length}
        </div>


        <div
          class="mana-v971-swipe"
        >
          Swipe to move
        </div>

      </div>


      <div
        class="mana-v971-dots"
      >

        ${list
          .map(
            (
              card,
              index
            ) => `

              <button
                type="button"
                class="
                  mana-v971-dot
                  ${
                    index ===
                    activeIndex
                      ? "active"
                      : ""
                  }
                  ${
                    exerciseDone(
                      card
                    )
                      ? "done"
                      : ""
                  }
                "
                data-v971-index="${index}"
                aria-label="
                  Open exercise
                  ${index + 1}
                "
              ></button>

            `
          )
          .join("")}

      </div>

    `;


    nav
      .querySelectorAll(
        "[data-v971-index]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              goTo(
                Number(
                  button.dataset
                    .v971Index
                )
              );

            };

        }
      );
  }


  function renderBottomNavigation() {

    const list =
      cards();


    const nav =
      document.getElementById(
        BOTTOM_NAV_ID
      );


    if (
      !nav ||
      !list.length
    ) {

      return;
    }


    nav.innerHTML = `

      <button
        type="button"
        class="mana-v971-nav-btn"
        id="manaV971Previous"
        ${
          activeIndex === 0
            ? "disabled"
            : ""
        }
      >
        ‹ PREVIOUS
      </button>


      <button
        type="button"
        class="
          mana-v971-nav-btn
          next
        "
        id="manaV971Next"
        ${
          activeIndex >=
          list.length - 1
            ? "disabled"
            : ""
        }
      >
        NEXT ›
      </button>

    `;


    document
      .getElementById(
        "manaV971Previous"
      )
      ?.addEventListener(
        "click",
        previous
      );


    document
      .getElementById(
        "manaV971Next"
      )
      ?.addEventListener(
        "click",
        next
      );
  }


  /* =========================================
     ACTIVE EXERCISE
     ========================================= */

  function renderActiveExercise(
    scroll = false
  ) {

    const screen =
      workoutScreen();


    const list =
      cards();


    if (
      !screen ||
      !list.length ||
      !isPhone()
    ) {

      return;
    }


    activeIndex =
      clampIndex(
        activeIndex
      );


    list.forEach(
      (
        card,
        index
      ) => {

        card.classList
          .toggle(
            "mana-v971-active",
            index ===
            activeIndex
          );

      }
    );


    screen.classList
      .toggle(
        "mana-v971-on-last",
        activeIndex ===
          list.length - 1
      );


    renderTopNavigation();

    renderBottomNavigation();


    if (scroll) {

      document
        .getElementById(
          TOP_NAV_ID
        )
        ?.scrollIntoView({
          behavior:
            "smooth",

          block:
            "start"
        });

    }
  }


  function goTo(
    index
  ) {

    const nextIndex =
      clampIndex(
        index
      );


    if (
      nextIndex ===
      activeIndex
    ) {

      renderActiveExercise();

      return;
    }


    activeIndex =
      nextIndex;


    renderActiveExercise(
      true
    );
  }


  function next() {

    goTo(
      activeIndex + 1
    );
  }


  function previous() {

    goTo(
      activeIndex - 1
    );
  }


  /* =========================================
     SWIPE
     ========================================= */

  function canSwipeFrom(
    target
  ) {

    if (
      !target ||
      !(target instanceof Element)
    ) {

      return true;
    }


    return !target.closest(
      [
        "input",
        "textarea",
        "select",
        "button",
        "a",
        ".mana-v970-history"
      ].join(",")
    );
  }


  function handleTouchStart(
    event
  ) {

    if (
      !isPhone() ||
      !workoutIsOpen()
    ) {

      return;
    }


    const touch =
      event.touches?.[0];


    if (!touch) {

      return;
    }


    touchStartX =
      touch.clientX;

    touchStartY =
      touch.clientY;

    touchStartTarget =
      event.target;
  }


  function handleTouchEnd(
    event
  ) {

    if (
      !isPhone() ||
      touchStartX === null ||
      touchStartY === null
    ) {

      resetTouch();

      return;
    }


    if (
      !canSwipeFrom(
        touchStartTarget
      )
    ) {

      resetTouch();

      return;
    }


    const touch =
      event.changedTouches?.[0];


    if (!touch) {

      resetTouch();

      return;
    }


    const deltaX =
      touch.clientX -
      touchStartX;


    const deltaY =
      touch.clientY -
      touchStartY;


    /*
      Horizontal gesture must be
      deliberate and stronger than
      the vertical movement.
    */

    if (
      Math.abs(
        deltaX
      ) >= 55 &&
      Math.abs(
        deltaX
      ) >
      Math.abs(
        deltaY
      ) * 1.2
    ) {

      if (
        deltaX < 0
      ) {

        next();

      } else {

        previous();

      }
    }


    resetTouch();
  }


  function resetTouch() {

    touchStartX =
      null;

    touchStartY =
      null;

    touchStartTarget =
      null;
  }


  /* =========================================
     SETUP
     ========================================= */

  function setupCarousel(
    forceReset = false
  ) {

    if (
      !isPhone()
    ) {

      cleanupDesktop();

      return;
    }


    const list =
      cards();


    if (
      !list.length
    ) {

      return;
    }


    ensureNavigation();


    const newSignature =
      signature();


    if (
      forceReset ||
      (
        currentSignature &&
        currentSignature !==
          newSignature
      )
    ) {

      activeIndex =
        0;
    }


    currentSignature =
      newSignature;


    activeIndex =
      clampIndex(
        activeIndex
      );


    renderActiveExercise();
  }


  function cleanupDesktop() {

    cards()
      .forEach(
        card => {

          card.classList
            .remove(
              "mana-v971-active"
            );

        }
      );


    workoutScreen()
      ?.classList
      .remove(
        "mana-v971-on-last"
      );
  }


  function scheduleSetup(
    forceReset = false
  ) {

    [
      80,
      220,
      500,
      900
    ].forEach(
      (
        delay,
        index
      ) => {

        setTimeout(
          () => {

            setupCarousel(
              forceReset &&
              index === 0
            );

          },
          delay
        );

      }
    );
  }


  /* =========================================
     EVENTS
     ========================================= */

  function handleWorkoutStart(
    event
  ) {

    if (
      !event.target.closest(
        ".mana-v85-start, " +
        "[data-v85-day]"
      )
    ) {

      return;
    }


    activeIndex =
      0;

    currentSignature =
      "";


    scheduleSetup(
      true
    );
  }


  function handleResize() {

    if (
      isPhone()
    ) {

      scheduleSetup();

    } else {

      cleanupDesktop();

    }
  }


  function handleWorkoutChange() {

    /*
      Set completion and workout
      updates can refresh the dots,
      but should NOT kick the user
      back to Exercise 1.
    */

    scheduleSetup(
      false
    );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();


    document.addEventListener(
      "click",
      handleWorkoutStart,
      true
    );


    const exerciseHolder =
      holder();


    /*
      Holder might not exist yet,
      so attach swipe listeners at
      document level and filter.
    */

    document.addEventListener(
      "touchstart",
      event => {

        if (
          event.target.closest(
            "#manaV64Exercises"
          )
        ) {

          handleTouchStart(
            event
          );

        }

      },
      {
        passive:true
      }
    );


    document.addEventListener(
      "touchend",
      event => {

        if (
          touchStartX !==
          null
        ) {

          handleTouchEnd(
            event
          );

        }

      },
      {
        passive:true
      }
    );


    window.addEventListener(
      "resize",
      handleResize
    );


    window.addEventListener(
      "orientationchange",
      handleResize
    );


    window.addEventListener(
      "mana:workout-progress-change",
      handleWorkoutChange
    );


    /*
      Existing / resumed workout.
    */

    [
      650,
      1400,
      2300
    ].forEach(
      delay => {

        setTimeout(
          setupCarousel,
          delay
        );

      }
    );


    window
      .MANA_MOBILE_WORKOUT_BUILD =
      BUILD;


    window
      .refreshManaMobileWorkout =
      scheduleSetup;


    window
      .manaWorkoutNextExercise =
      next;


    window
      .manaWorkoutPreviousExercise =
      previous;


    console.log(
      "[Mana v9.71.0] mobile workout carousel ready"
    );
  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once:true
      }
    );

  } else {

    init();

  }

})();
