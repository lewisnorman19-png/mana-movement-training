/* =========================================
   MANA MOVEMENT TRAINING v9.71.2
   MOBILE GUIDED WORKOUT FLOW

   PHONE FLOW

   EXERCISE 1
      →
   EXERCISE 2
      →
   ...
      →
   SESSION FEEDBACK
      →
   NATIVE WORKOUT COMPLETE SCREEN

   MOBILE
   - TRUE HORIZONTAL SCROLL
   - ONE EXERCISE PER PAGE
   - FEEDBACK IS FINAL CAROUSEL PAGE
   - NO FEEDBACK ON EXERCISE PAGES
   - NO TIME / SUMMARY CLUTTER
   - TIME + STATS SHOWN AT COMPLETION
   - DESKTOP UNCHANGED
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "97120";

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


  function exerciseCards() {

    return [
      ...document
        .querySelectorAll(
          "#manaV64Exercises " +
          ".mana-v64-card"
        )
    ];
  }


  function feedbackPage() {

    return document
      .getElementById(
        "manaV922Feedback"
      );
  }


  function pages() {

    const exercises =
      exerciseCards();


    const feedback =
      feedbackPage();


    return feedback
      ? [
          ...exercises,
          feedback
        ]
      : exercises;
  }


  function exerciseCount() {

    return exerciseCards()
      .length;
  }


  function signature() {

    return exerciseCards()
      .map(
        card =>
          card.dataset
            .exerciseName ||
          ""
      )
      .join("|");
  }


  function clampIndex(
    index
  ) {

    const list =
      pages();


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


  function isFeedbackIndex(
    index
  ) {

    return (
      Boolean(
        feedbackPage()
      ) &&
      index ===
        exerciseCount()
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
           WORKOUT SCREEN
           =================================== */

        #manaStrengthV64Workout{

          overflow-x:
            hidden !important;

          padding:
            calc(
              env(
                safe-area-inset-top
              )
              +
              8px
            )
            10px
            calc(
              env(
                safe-area-inset-bottom
              )
              +
              14px
            ) !important;
        }


        #manaStrengthV64Workout
        .mana-v64-shell{

          width:
            100% !important;

          max-width:
            none !important;

          padding:
            0 !important;
        }


        /* ===================================
           VERY COMPACT HEADER
           =================================== */

        #manaStrengthV64Workout
        .mana-v64-head{

          margin-bottom:
            6px !important;

          align-items:
            center !important;
        }


        #manaStrengthV64Workout
        .mana-v64-head
        .pill{

          font-size:
            8px !important;
        }


        #manaStrengthV64Workout
        #manaV64Title{

          margin:
            3px
            0
            1px !important;

          font-size:
            22px !important;

          line-height:
            1 !important;
        }


        #manaStrengthV64Workout
        #manaV64Subtitle{

          margin:0 !important;

          font-size:
            10px !important;
        }


        #manaStrengthV64Workout
        .mana-v64-close{

          width:
            36px !important;

          height:
            36px !important;

          flex:
            0
            0
            36px !important;

          font-size:
            19px !important;
        }


        /* ===================================
           REMOVE WORKOUT STAT CLUTTER

           Time, sets, volume and completion
           belong on Workout Complete.
           =================================== */

        #manaStrengthV64Workout
        .mana-v64-summary{

          display:
            none !important;
        }


        #manaStrengthV64Workout
        .mana-v64-progress{

          display:
            none !important;
        }


        /*
          v9.20 helper buttons aren't needed
          in the normal guided exercise flow.
        */

        #manaStrengthV64Workout
        #manaV920TickWorkout,

        #manaStrengthV64Workout
        .mana-v920-workout-all,

        #manaStrengthV64Workout
        #manaV920Pause,

        #manaStrengthV64Workout
        .mana-v920-pause{

          display:
            none !important;
        }


        /* ===================================
           PAGE POSITION
           =================================== */

        #${TOP_NAV_ID}{

          display:block;

          margin:
            0
            0
            6px;

          padding:
            7px
            10px;

          border:
            1px solid
            #292820;

          border-radius:
            11px;

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
            9px;

          font-weight:
            950;

          letter-spacing:
            .08em;

          text-transform:
            uppercase;
        }


        .mana-v971-swipe{

          color:
            #606060;

          font-size:
            8px;

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
            4px;

          margin-top:
            5px;
        }


        .mana-v971-dot{

          width:
            6px;

          height:
            6px;

          min-width:0;

          padding:0;

          border:0;

          border-radius:
            999px;

          background:
            #353535;

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
            17px;

          background:
            #f3d875;
        }


        .mana-v971-dot.done:not(.active){

          background:
            #806d29;
        }


        .mana-v971-dot.feedback{

          border:
            1px solid
            #7d6825;

          background:
            transparent;
        }


        .mana-v971-dot.feedback.active{

          width:
            17px;

          background:
            #f3d875;
        }


        /* ===================================
           TRUE HORIZONTAL PAGES
           =================================== */

        #manaV64Exercises{

          width:
            100%;

          display:
            flex !important;

          align-items:
            stretch;

          gap:
            8px;

          overflow-x:
            auto !important;

          overflow-y:
            hidden !important;

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


        /* ===================================
           EXERCISE PAGE
           =================================== */

        #manaV64Exercises
        .mana-v64-card{

          display:
            block !important;

          flex:
            0
            0
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
            12px !important;

          border-radius:
            16px !important;

          box-sizing:
            border-box;
        }


        #manaV64Exercises
        .mana-v64-name{

          font-size:
            19px !important;

          line-height:
            1.05 !important;
        }


        #manaV64Exercises
        .mana-v64-target{

          margin-top:
            3px !important;

          font-size:
            11px !important;
        }


        /* ===================================
           INFO BUTTONS
           =================================== */

        #manaV64Exercises
        .mana-v970-disclosure{

          display:grid !important;

          grid-template-columns:
            minmax(0,1fr)
            minmax(0,1fr) !important;

          gap:
            5px !important;

          margin-top:
            7px !important;
        }


        #manaV64Exercises
        .mana-v970-action{

          width:
            100% !important;

          min-width:
            0 !important;

          min-height:
            36px !important;

          padding:
            5px
            4px !important;

          font-size:
            8px !important;

          line-height:
            1.15 !important;

          white-space:
            normal !important;
        }


        #manaV64Exercises
        .mana-v970-history{

          margin-top:
            6px !important;

          padding:
            9px !important;
        }


        #manaV64Exercises
        .mana-v970-history-label{

          font-size:
            8px !important;
        }


        #manaV64Exercises
        .mana-v970-history-copy{

          margin-top:
            3px !important;

          font-size:
            11px !important;

          line-height:
            1.35 !important;
        }


        /* ===================================
           SETS
           =================================== */

        #manaV64Exercises
        .mana-v64-table-head{

          grid-template-columns:
            23px
            minmax(0,1fr)
            minmax(0,1fr)
            36px !important;

          gap:
            4px !important;

          margin-top:
            9px !important;

          font-size:
            8px !important;
        }


        #manaV64Exercises
        .mana-v64-set{

          grid-template-columns:
            23px
            minmax(0,1fr)
            minmax(0,1fr)
            36px !important;

          gap:
            4px !important;

          margin-top:
            5px !important;
        }


        #manaV64Exercises
        .mana-v64-set-number{

          font-size:
            10px !important;
        }


        #manaV64Exercises
        .mana-v64-set input{

          min-height:
            36px !important;

          padding:
            6px
            4px !important;

          border-radius:
            9px !important;

          font-size:
            14px !important;
        }


        #manaV64Exercises
        .mana-v64-check{

          width:
            36px !important;

          height:
            36px !important;

          border-radius:
            9px !important;
        }


        #manaV64Exercises
        .mana-v970-adjust{

          margin-top:
            4px !important;

          padding:
            2px
            0 !important;

          font-size:
            9px !important;
        }


        #manaV64Exercises
        .mana-v64-controls{

          margin-top:
            5px !important;

          gap:
            5px !important;
        }


        #manaV64Exercises
        .mana-v64-small{

          min-height:
            35px !important;

          font-size:
            10px !important;
        }


        /* ===================================
           SESSION FEEDBACK PAGE

           This is moved into the horizontal
           workout carousel as the final page.
           =================================== */

        #manaV64Exercises
        #manaV922Feedback{

          display:
            block !important;

          flex:
            0
            0
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

          min-height:
            0;

          scroll-snap-align:
            start;

          scroll-snap-stop:
            always;

          margin:
            0 !important;

          padding:
            17px
            14px !important;

          border:
            1px solid
            #50451f !important;

          border-radius:
            17px !important;

          background:
            linear-gradient(
              145deg,
              #15130c,
              #090909
            ) !important;

          box-sizing:
            border-box;
        }


        #manaV922Feedback
        .mana-v922-kicker{

          font-size:
            9px !important;
        }


        #manaV922Feedback
        .mana-v922-title{

          margin-top:
            5px !important;

          font-size:
            21px !important;
        }


        #manaV922Feedback
        .mana-v922-copy{

          margin-top:
            4px !important;

          font-size:
            10px !important;
        }


        #manaV922Feedback
        .mana-v922-label{

          margin-top:
            13px !important;

          font-size:
            9px !important;
        }


        #manaV922Feedback
        .mana-v922-effort{

          grid-template-columns:
            repeat(
              4,
              minmax(0,1fr)
            ) !important;

          gap:
            5px !important;

          margin-top:
            6px !important;
        }


        #manaV922Feedback
        .mana-v922-effort
        button{

          min-height:
            39px !important;

          padding:
            6px
            3px !important;

          font-size:
            9px !important;
        }


        #manaV922Feedback
        .mana-v922-note{

          min-height:
            92px !important;

          margin-top:
            6px !important;

          padding:
            10px !important;

          font-size:
            13px !important;
        }


        /*
          Custom finish button added to the
          feedback page.
        */

        .mana-v971-finish{

          width:
            100%;

          min-height:
            48px;

          margin-top:
            12px;

          border:
            0;

          border-radius:
            13px;

          background:
            linear-gradient(
              135deg,
              #f3d875,
              #c99d36
            );

          color:
            #090909;

          font-size:
            12px;

          font-weight:
            950;

          letter-spacing:
            .03em;
        }


        /* ===================================
           BOTTOM PREVIOUS / NEXT
           =================================== */

        #${BOTTOM_NAV_ID}{

          display:grid;

          grid-template-columns:
            1fr
            1fr;

          gap:
            6px;

          margin-top:
            7px;
        }


        .mana-v971-nav-btn{

          min-height:
            41px;

          border:
            1px solid
            #37352b;

          border-radius:
            11px;

          background:
            #10100e;

          color:
            #d5d5d5;

          font-size:
            9px;

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
           NATIVE COMPLETE BUTTON

           Hidden. Feedback finish button
           triggers it programmatically.
           =================================== */

        #manaStrengthV64Workout
        #manaV64Complete{

          position:
            absolute !important;

          left:
            -9999px !important;

          width:
            1px !important;

          height:
            1px !important;

          min-height:
            0 !important;

          margin:
            0 !important;

          padding:
            0 !important;

          opacity:
            0 !important;

          pointer-events:
            none !important;
        }


        #manaStrengthV64Workout
        #manaV64Status{

          min-height:
            0 !important;

          margin:0 !important;

          font-size:
            10px !important;
        }


        /* ===================================
           FORM GUIDE
           =================================== */

        #manaV970FormGuide{

          padding:
            calc(
              env(
                safe-area-inset-top
              )
              +
              8px
            )
            8px
            calc(
              env(
                safe-area-inset-bottom
              )
              +
              12px
            ) !important;
        }


        #manaV970FormGuide
        .mana-v970-guide{

          padding:
            13px
            10px !important;

          border-radius:
            17px !important;
        }


        #manaV970FormGuide
        .mana-v970-guide-title{

          font-size:
            21px !important;
        }


        #manaV970FormGuide
        .mana-v970-poses{

          gap:
            5px !important;

          margin-top:
            10px !important;
        }


        #manaV970FormGuide
        .mana-v970-pose{

          min-height:
            155px !important;

          padding:
            5px !important;
        }


        #manaV970FormGuide
        .mana-v970-figure{

          height:
            135px !important;
        }


        #manaV970FormGuide
        .mana-v970-cues{

          margin-top:
            9px !important;

          padding:
            10px !important;
        }


        #manaV970FormGuide
        .mana-v970-cues h3{

          margin-bottom:
            5px !important;

          font-size:
            14px !important;
        }


        #manaV970FormGuide
        .mana-v970-cues ul{

          font-size:
            11px !important;

          line-height:
            1.4 !important;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     ENSURE EXISTING FEEDBACK EXISTS
     ========================================= */

  function ensureFeedback() {

    if (
      feedbackPage()
    ) {

      return true;
    }


    if (
      typeof
        window
          .refreshManaWorkoutFeedback ===
      "function"
    ) {

      window
        .refreshManaWorkoutFeedback();
    }


    return Boolean(
      feedbackPage()
    );
  }


  /* =========================================
     MOVE FEEDBACK INTO CAROUSEL
     ========================================= */

  function mountFeedbackPage() {

    const exerciseHolder =
      holder();


    if (
      !exerciseHolder
    ) {

      return;
    }


    ensureFeedback();


    const feedback =
      feedbackPage();


    if (
      !feedback
    ) {

      return;
    }


    /*
      v9.22 normally places this above
      Complete Workout.

      On phone we move the SAME element
      into the carousel. No duplicate form,
      no duplicate feedback data.
    */

    if (
      feedback.parentElement !==
      exerciseHolder
    ) {

      exerciseHolder
        .appendChild(
          feedback
        );
    }


    /*
      Add our Finish button only once.
    */

    let finish =
      feedback
        .querySelector(
          ".mana-v971-finish"
        );


    if (!finish) {

      finish =
        document.createElement(
          "button"
        );


      finish.type =
        "button";


      finish.className =
        "mana-v971-finish";


      finish.textContent =
        "COMPLETE WORKOUT →";


      finish.addEventListener(
        "click",
        () => {

          const nativeComplete =
            document
              .getElementById(
                "manaV64Complete"
              );


          if (
            !nativeComplete
          ) {

            return;
          }


          /*
            Important:
            v9.22 listens to this native
            completion click and captures
            the feedback before the workout
            is saved.

            v9.20 also captures workout
            timing here.

            v6.4 completes the workout.

            v9.15 then opens the real
            Workout Complete screen.
          */

          nativeComplete.click();

        }
      );


      feedback
        .appendChild(
          finish
        );
    }
  }


  /* =========================================
     NAV ELEMENTS
     ========================================= */

  function ensureNavigation() {

    const exerciseHolder =
      holder();


    if (
      !exerciseHolder
    ) {

      return;
    }


    let top =
      document
        .getElementById(
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
      document
        .getElementById(
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
      pages();


    const exercises =
      exerciseCards();


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


    const onFeedback =
      isFeedbackIndex(
        activeIndex
      );


    nav.innerHTML = `

      <div
        class="mana-v971-top-row"
      >

        <div
          class="mana-v971-position"
        >

          ${
            onFeedback
              ? "Session Feedback"
              :
                `Exercise ${
                  activeIndex + 1
                } of ${
                  exercises.length
                }`
          }

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

        ${exercises
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
                  Exercise
                  ${index + 1}
                "
              ></button>

            `
          )
          .join("")}


        ${
          feedbackPage()
            ? `

              <button
                type="button"
                class="
                  mana-v971-dot
                  feedback

                  ${
                    onFeedback
                      ? "active"
                      : ""
                  }
                "
                data-v971-index="${
                  exercises.length
                }"
                aria-label="
                  Session feedback
                "
              ></button>

            `
            : ""
        }

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
      pages();


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


    const onFeedback =
      isFeedbackIndex(
        activeIndex
      );


    const nextLabel =
      activeIndex ===
      exerciseCount() - 1
        ? "SESSION FEEDBACK ›"
        : "NEXT ›";


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
          onFeedback
            ? "disabled"
            : ""
        }
      >
        ${
          onFeedback
            ? "FINISH BELOW"
            : nextLabel
        }
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
     STATE
     ========================================= */

  function updateState() {

    const list =
      pages();


    if (
      !list.length
    ) {

      return;
    }


    activeIndex =
      clampIndex(
        activeIndex
      );


    renderTop();

    renderBottom();
  }


  /* =========================================
     HORIZONTAL NAVIGATION
     ========================================= */

  function goTo(
    requestedIndex,
    smooth = true
  ) {

    if (
      !isPhone()
    ) {

      return;
    }


    const list =
      pages();


    if (
      !list.length
    ) {

      return;
    }


    const index =
      clampIndex(
        requestedIndex
      );


    const page =
      list[index];


    activeIndex =
      index;


    page.scrollIntoView({

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
     NATIVE SWIPE DETECTION
     ========================================= */

  function updateIndexFromScroll() {

    const exerciseHolder =
      holder();


    const list =
      pages();


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
        page,
        index
      ) => {

        const rect =
          page
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


    if (
      !exerciseHolder ||
      !exerciseCards()
        .length
    ) {

      return;
    }


    /*
      Let v9.22 build its normal feedback
      form, then move the real form into
      our carousel.
    */

    mountFeedbackPage();

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
      900,
      1400
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
      "mana:workout-feedback-saved",
      () => {

        scheduleSetup(
          false
        );

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
      "[Mana v9.71.2] guided mobile workout ready"
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
