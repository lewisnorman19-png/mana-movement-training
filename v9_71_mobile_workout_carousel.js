/* =========================================
   MANA MOVEMENT TRAINING v9.71.1
   TRUE MOBILE HORIZONTAL WORKOUT CAROUSEL

   PHONE ONLY

   - REAL HORIZONTAL SCROLLING
   - NATIVE FINGER SWIPE
   - CSS SCROLL SNAP
   - ONE EXERCISE PER PAGE
   - PREVIOUS / NEXT BUTTONS
   - POSITION INDICATOR
   - DOT NAVIGATION
   - INFO BUTTONS SIDE BY SIDE
   - DESKTOP UNCHANGED
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "97110";

  const STYLE_ID =
    "mana-v971-mobile-workout-style";

  const TOP_NAV_ID =
    "manaV971TopNav";

  const BOTTOM_NAV_ID =
    "manaV971BottomNav";

  const PHONE_QUERY =
    "(max-width:700px)";

  let activeIndex =
    0;

  let lastSignature =
    "";

  let scrollTimer =
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


  function holder() {

    return document
      .getElementById(
        "manaV64Exercises"
      );
  }


  function workoutScreen() {

    return document
      .getElementById(
        "manaStrengthV64Workout"
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


  function signature() {

    return cards()
      .map(
        card =>
          card.dataset
            .exerciseName ||
          card
            .querySelector(
              ".mana-v64-name"
            )
            ?.textContent
            ?.trim() ||
          ""
      )
      .join("|");
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

      #${TOP_NAV_ID},
      #${BOTTOM_NAV_ID}{
        display:none;
      }


      @media(max-width:700px){

        /* ===================================
           COMPACT WORKOUT HEADER
           =================================== */

        #manaStrengthV64Workout
        .mana-v64-shell{

          padding:
            14px
            12px
            calc(
              env(safe-area-inset-bottom)
              +
              22px
            ) !important;
        }


        #manaStrengthV64Workout
        .mana-v64-head{

          margin-bottom:
            7px !important;
        }


        #manaStrengthV64Workout
        #manaV64Title{

          margin-top:
            4px !important;

          font-size:
            25px !important;

          line-height:
            1.05 !important;
        }


        #manaStrengthV64Workout
        #manaV64Subtitle{

          margin-top:
            3px !important;

          font-size:
            11px !important;
        }


        #manaStrengthV64Workout
        .mana-v64-close{

          width:
            38px !important;

          height:
            38px !important;

          flex:
            0 0 38px !important;

          font-size:
            20px !important;
        }


        /* ===================================
           TIME + SETS ONLY
           =================================== */

        #manaStrengthV64Workout
        .mana-v64-summary{

          grid-template-columns:
            1fr 1fr !important;

          gap:
            7px !important;

          margin:
            8px
            0
            7px !important;
        }


        #manaStrengthV64Workout
        .mana-v64-stat{

          padding:
            9px
            10px !important;

          border-radius:
            12px !important;
        }


        #manaStrengthV64Workout
        .mana-v64-stat span{

          margin-bottom:
            2px !important;

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
            9px !important;
        }


        /* ===================================
           EXERCISE POSITION
           =================================== */

        #${TOP_NAV_ID}{

          display:block;

          margin:
            0
            0
            8px;

          padding:
            9px
            11px;

          border:
            1px solid
            #292820;

          border-radius:
            12px;

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
            8px;
        }


        .mana-v971-position{

          color:
            #f3d875;

          font-size:
            10px;

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
            9px;

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
            7px;
        }


        .mana-v971-dot{

          width:
            7px;

          height:
            7px;

          min-width:0;

          padding:0;

          border:0;

          border-radius:
            999px;

          background:
            #363636;

          transition:
            width .18s ease,
            background .18s ease;
        }


        .mana-v971-dot.active{

          width:
            20px;

          background:
            #f3d875;
        }


        .mana-v971-dot.done:not(.active){

          background:
            #806d29;
        }


        /* ===================================
           REAL HORIZONTAL CAROUSEL
           =================================== */

        #manaV64Exercises{

          width:
            100%;

          display:
            flex !important;

          align-items:
            flex-start;

          gap:
            10px;

          overflow-x:
            auto !important;

          overflow-y:
            hidden;

          scroll-snap-type:
            x mandatory;

          scroll-behavior:
            smooth;

          -webkit-overflow-scrolling:
            touch;

          overscroll-behavior-x:
            contain;

          scrollbar-width:
            none;

          touch-action:
            pan-x pan-y;

          padding:
            0 !important;
        }


        #manaV64Exercises::-webkit-scrollbar{

          display:none;
        }


        #manaV64Exercises
        .mana-v64-card{

          display:
            block !important;

          flex:
            0 0
            calc(
              100% - 1px
            );

          width:
            calc(
              100% - 1px
            );

          max-width:
            calc(
              100% - 1px
            );

          scroll-snap-align:
            start;

          scroll-snap-stop:
            always;

          margin:
            0 !important;

          padding:
            14px !important;

          border-radius:
            18px !important;

          box-sizing:
            border-box;
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


        /* ===================================
           TWO BUTTONS ALWAYS SIDE BY SIDE
           =================================== */

        #manaV64Exercises
        .mana-v970-disclosure{

          display:grid !important;

          grid-template-columns:
            minmax(0,1fr)
            minmax(0,1fr) !important;

          gap:
            6px !important;

          margin-top:
            9px !important;
        }


        #manaV64Exercises
        .mana-v970-action{

          width:
            100% !important;

          min-width:
            0 !important;

          min-height:
            40px !important;

          padding:
            7px
            4px !important;

          font-size:
            9px !important;

          line-height:
            1.15 !important;

          white-space:
            normal !important;
        }


        /* ===================================
           PREVIOUS & PROGRESSION PANEL
           =================================== */

        #manaV64Exercises
        .mana-v970-history{

          margin-top:
            7px !important;

          padding:
            11px !important;
        }


        #manaV64Exercises
        .mana-v970-history-copy{

          font-size:
            12px !important;

          line-height:
            1.4 !important;
        }


        /* ===================================
           SET TABLE
           =================================== */

        #manaV64Exercises
        .mana-v64-table-head{

          grid-template-columns:
            25px
            minmax(0,1fr)
            minmax(0,1fr)
            38px !important;

          gap:
            5px !important;

          margin-top:
            12px !important;

          font-size:
            9px !important;
        }


        #manaV64Exercises
        .mana-v64-set{

          grid-template-columns:
            25px
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
            39px !important;

          padding:
            7px
            4px !important;

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
            6px !important;

          padding:
            3px 0 !important;

          font-size:
            10px !important;
        }


        /* ===================================
           PREVIOUS / NEXT
           =================================== */

        #${BOTTOM_NAV_ID}{

          display:grid;

          grid-template-columns:
            1fr
            1fr;

          gap:
            7px;

          margin-top:
            9px;
        }


        .mana-v971-nav-btn{

          min-height:
            44px;

          border:
            1px solid
            #37352b;

          border-radius:
            12px;

          background:
            #10100e;

          color:
            #d5d5d5;

          font-size:
            10px;

          font-weight:
            950;
        }


        .mana-v971-nav-btn.next{

          border-color:
            #6d5a20;

          background:
            #17140b;

          color:
            #f3d875;
        }


        .mana-v971-nav-btn:disabled{

          opacity:
            .25;
        }


        /* ===================================
           COMPLETE ONLY AT END
           =================================== */

        #manaStrengthV64Workout
        #manaV64Complete{

          display:
            none !important;
        }


        #manaStrengthV64Workout.mana-v971-on-last
        #manaV64Complete{

          display:
            block !important;

          min-height:
            52px !important;

          margin-top:
            10px !important;

          font-size:
            15px !important;
        }


        /* ===================================
           FORM GUIDE COMPACT
           =================================== */

        #manaV970FormGuide{

          padding:
            calc(
              env(safe-area-inset-top)
              +
              9px
            )
            9px
            calc(
              env(safe-area-inset-bottom)
              +
              15px
            ) !important;
        }


        #manaV970FormGuide
        .mana-v970-guide{

          padding:
            14px
            11px !important;

          border-radius:
            18px !important;
        }


        #manaV970FormGuide
        .mana-v970-guide-title{

          font-size:
            22px !important;
        }


        #manaV970FormGuide
        .mana-v970-poses{

          gap:
            6px !important;

          margin-top:
            12px !important;
        }


        #manaV970FormGuide
        .mana-v970-pose{

          min-height:
            165px !important;

          padding:
            6px !important;
        }


        #manaV970FormGuide
        .mana-v970-figure{

          height:
            143px !important;
        }


        #manaV970FormGuide
        .mana-v970-cues{

          margin-top:
            10px !important;

          padding:
            12px !important;
        }


        #manaV970FormGuide
        .mana-v970-cues ul{

          font-size:
            12px !important;

          line-height:
            1.45 !important;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     NAV ELEMENTS
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


  /* =========================================
     TOP NAV
     ========================================= */

  function renderTop() {

    const list =
      cards();


    const nav =
      document
        .getElementById(
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
          Swipe left / right
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
                aria-label="Exercise ${index + 1}"
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


  /* =========================================
     BOTTOM NAV
     ========================================= */

  function renderBottom() {

    const list =
      cards();


    const nav =
      document
        .getElementById(
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
          activeIndex ===
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
        () => {

          goTo(
            activeIndex - 1
          );

        }
      );


    document
      .getElementById(
        "manaV971Next"
      )
      ?.addEventListener(
        "click",
        () => {

          goTo(
            activeIndex + 1
          );

        }
      );
  }


  /* =========================================
     STATE UPDATE
     ========================================= */

  function updateState() {

    const list =
      cards();


    if (!list.length) {

      return;
    }


    activeIndex =
      clampIndex(
        activeIndex
      );


    workoutScreen()
      ?.classList
      .toggle(
        "mana-v971-on-last",
        activeIndex ===
          list.length - 1
      );


    renderTop();

    renderBottom();
  }


  /* =========================================
     TRUE HORIZONTAL NAVIGATION
     ========================================= */

  function pageWidth() {

    const exerciseHolder =
      holder();


    const first =
      cards()[0];


    if (
      !exerciseHolder ||
      !first
    ) {

      return 0;
    }


    const styles =
      getComputedStyle(
        exerciseHolder
      );


    const gap =
      parseFloat(
        styles.columnGap ||
        styles.gap ||
        0
      ) || 0;


    return (
      first.getBoundingClientRect()
        .width +
      gap
    );
  }


  function goTo(
    requestedIndex,
    smooth = true
  ) {

    if (
      !isPhone()
    ) {

      return;
    }


    const exerciseHolder =
      holder();


    const list =
      cards();


    if (
      !exerciseHolder ||
      !list.length
    ) {

      return;
    }


    const index =
      clampIndex(
        requestedIndex
      );


    const card =
      list[index];


    activeIndex =
      index;


    /*
      scrollIntoView with inline:start
      gives us genuine horizontal movement.
    */

    card.scrollIntoView({
      behavior:
        smooth
          ? "smooth"
          : "auto",

      block:
        "nearest",

      inline:
        "start"
    });


    updateState();
  }


  /* =========================================
     DETECT NATIVE SWIPE POSITION
     ========================================= */

  function updateIndexFromScroll() {

    const exerciseHolder =
      holder();


    const list =
      cards();


    if (
      !exerciseHolder ||
      !list.length ||
      !isPhone()
    ) {

      return;
    }


    const holderRect =
      exerciseHolder
        .getBoundingClientRect();


    let closestIndex =
      0;

    let closestDistance =
      Infinity;


    list.forEach(
      (
        card,
        index
      ) => {

        const rect =
          card
            .getBoundingClientRect();


        const distance =
          Math.abs(
            rect.left -
            holderRect.left
          );


        if (
          distance <
          closestDistance
        ) {

          closestDistance =
            distance;

          closestIndex =
            index;
        }

      }
    );


    if (
      closestIndex !==
      activeIndex
    ) {

      activeIndex =
        closestIndex;

      updateState();

    } else {

      /*
        Still refresh completion dots.
      */

      renderTop();
    }
  }


  function handleScroll() {

    clearTimeout(
      scrollTimer
    );


    scrollTimer =
      setTimeout(
        updateIndexFromScroll,
        60
      );
  }


  /* =========================================
     SETUP
     ========================================= */

  function setup(
    reset = false
  ) {

    if (
      !isPhone()
    ) {

      return;
    }


    const exerciseHolder =
      holder();


    const list =
      cards();


    if (
      !exerciseHolder ||
      !list.length
    ) {

      return;
    }


    ensureNavigation();


    const sig =
      signature();


    if (
      reset ||
      (
        lastSignature &&
        lastSignature !==
        sig
      )
    ) {

      activeIndex =
        0;
    }


    lastSignature =
      sig;


    /*
      Only install once per current holder.
    */

    if (
      exerciseHolder.dataset
        .v971ScrollReady !==
      "1"
    ) {

      exerciseHolder
        .addEventListener(
          "scroll",
          handleScroll,
          {
            passive:true
          }
        );


      exerciseHolder.dataset
        .v971ScrollReady =
        "1";
    }


    updateState();


    /*
      On a fresh workout make sure
      exercise 1 is aligned perfectly.
    */

    if (reset) {

      requestAnimationFrame(
        () => {

          goTo(
            0,
            false
          );

        }
      );
    }
  }


  function scheduleSetup(
    reset = false
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

            setup(
              reset &&
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

    lastSignature =
      "";


    scheduleSetup(
      true
    );
  }


  function handleWorkoutProgress() {

    if (
      !isPhone()
    ) {

      return;
    }


    scheduleSetup(
      false
    );
  }


  function handleResize() {

    if (
      isPhone()
    ) {

      scheduleSetup(
        false
      );
    }
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


    window.addEventListener(
      "mana:workout-progress-change",
      handleWorkoutProgress
    );


    window.addEventListener(
      "resize",
      handleResize
    );


    window.addEventListener(
      "orientationchange",
      handleResize
    );


    /*
      Existing / resumed workout.
    */

    [
      600,
      1400,
      2300
    ].forEach(
      delay => {

        setTimeout(
          () => {

            setup(
              false
            );

          },
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
      .manaWorkoutGoToExercise =
      goTo;


    console.log(
      "[Mana v9.71.1] true horizontal carousel ready"
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
