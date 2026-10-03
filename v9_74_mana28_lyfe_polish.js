/* =========================================
   MANA MOVEMENT TRAINING v9.74.3
   MANA 28 + MANA LYFE FULL PAGE EXPERIENCE

   FIXES
   - OVERVIEW CARDS DIRECTLY TAPPABLE
   - POINTER + TOUCH + CLICK SUPPORT
   - REMOVES INVISIBLE TAP BLOCKING
   - PROGRAM CARD FILLS AVAILABLE WIDTH
   - PROGRAM CARD FILLS AVAILABLE HEIGHT
   - EXERCISES DISTRIBUTE DOWN THE PAGE
   - COMPLETE DAY STAYS AT BOTTOM
   - ZERO PAGE OVERLAP
   ========================================= */

(() => {
  "use strict";

  const BUILD = "97430";

  const STYLE_ID =
    "mana-v974-m28-lyfe-polish-style";

  const M28_KEY =
    "mana-v973-mana28-state";

  const LYFE_KEY =
    "mana-v973-lyfe-state";

  let observer = null;

  let refreshTimer = null;

  let lastTapAt = 0;


  /* =========================================
     DATA
     ========================================= */

  const MANA28 = [

    {
      title:"Full Body Strength",
      type:"Strength",
      tasks:[
        ["Goblet Squat","3 × 10"],
        ["DB / Machine Chest Press","3 × 10"],
        ["Seated Row","3 × 10"],
        ["Romanian Deadlift","3 × 10"],
        ["Plank","3 × 30–45 sec"]
      ]
    },

    {
      title:"Treadmill Cardio",
      type:"Cardio",
      tasks:[
        ["Warm-up Walk","5 min"],
        ["Treadmill","20 min moderate"],
        ["Incline Walk","5 min"],
        ["Cool-down","5 min"]
      ]
    },

    {
      title:"Lower Body Strength",
      type:"Strength",
      tasks:[
        ["Leg Press / Squat","3 × 10"],
        ["Romanian Deadlift","3 × 10"],
        ["Split Squat","3 × 8 each"],
        ["Hamstring Curl","3 × 12"],
        ["Calf Raise","3 × 15"]
      ]
    },

    {
      title:"Walk + Mobility",
      type:"Recovery",
      tasks:[
        ["Purposeful Walk","30 min"],
        ["Hip Mobility","5 min"],
        ["Thoracic Rotation","2 × 8 each"],
        ["Breathing Reset","5 min"]
      ]
    },

    {
      title:"Upper Body + Core",
      type:"Strength",
      tasks:[
        ["Chest Press","3 × 10"],
        ["Lat Pulldown","3 × 10"],
        ["Shoulder Press","3 × 10"],
        ["Cable Row","3 × 10"],
        ["Dead Bug","3 × 8 each"]
      ]
    },

    {
      title:"Bike Intervals",
      type:"Cardio",
      tasks:[
        ["Easy Bike","5 min"],
        ["Bike Intervals","8 × 30 sec strong"],
        ["Easy Recovery","60 sec between"],
        ["Easy Bike","5 min"]
      ]
    },

    {
      title:"Recovery Reset",
      type:"Recovery",
      tasks:[
        ["Easy Walk","20–30 min"],
        ["Mobility Flow","10 min"],
        ["Breathing Reset","5 min"]
      ]
    }

  ];


  const LYFE = [

    {
      title:"Reset & Move",
      type:"Movement",
      tasks:[
        ["Bodyweight Squat","3 × 12"],
        ["Push-up / Wall Push-up","3 × 10"],
        ["Band / Cable Row","3 × 12"],
        ["Walk","20 min"],
        ["Mana Lyfe Journal","Complete today's reflection"]
      ]
    },

    {
      title:"Walk & Reflect",
      type:"Mindset",
      tasks:[
        ["Purposeful Walk","30 min"],
        ["Breathing Reset","5 min"],
        ["Journal","What do I need to let go of?"]
      ]
    },

    {
      title:"Cardio Energy",
      type:"Cardio",
      tasks:[
        ["Treadmill / Bike","5 min easy"],
        ["Cardio","20 min moderate"],
        ["Cool-down","5 min"],
        ["Journal","What gives me energy?"]
      ]
    },

    {
      title:"Mobility + Reset",
      type:"Recovery",
      tasks:[
        ["Mobility Flow","12 min"],
        ["Easy Walk","15 min"],
        ["Breathing","5 min"],
        ["Journal","What needs more attention?"]
      ]
    },

    {
      title:"Build",
      type:"Movement",
      tasks:[
        ["Reverse Lunge","3 × 10 each"],
        ["Chest Press / Push-up","3 × 12"],
        ["Row","3 × 12"],
        ["Plank","3 × 30 sec"],
        ["Journal","What am I rebuilding?"]
      ]
    },

    {
      title:"Move With Purpose",
      type:"Cardio",
      tasks:[
        ["Bike / Rower","20 min"],
        ["Walk","10 min"],
        ["Stretch","5 min"],
        ["Journal","What went well this week?"]
      ]
    },

    {
      title:"Weekly Reset",
      type:"Reset",
      tasks:[
        ["Easy Walk","20 min"],
        ["Mobility","10 min"],
        ["Breathing Reset","5 min"],
        ["Journal","Review the week and reset"]
      ]
    }

  ];


  /* =========================================
     HELPERS
     ========================================= */

  function safeJson(
    raw,
    fallback
  ) {

    try {

      return JSON.parse(
        raw
      );

    } catch (_) {

      return fallback;

    }
  }


  function loadState(
    key
  ) {

    const state =
      safeJson(
        localStorage.getItem(
          key
        ) || "{}",
        {}
      );


    if (
      !Array.isArray(
        state.completed
      )
    ) {

      state.completed = [];

    }


    return state;
  }


  function saveState(
    key,
    state
  ) {

    localStorage.setItem(
      key,
      JSON.stringify(
        state
      )
    );


    window.dispatchEvent(
      new CustomEvent(
        "mana:v973-updated"
      )
    );
  }


  function shell() {

    return document
      .getElementById(
        "manaV83ProgramShell"
      );
  }


  function title() {

    return (
      document
        .getElementById(
          "manaV83Title"
        )
        ?.textContent
        ?.trim()
        ?.toUpperCase() ||
      ""
    );
  }


  function tab() {

    return (
      document
        .querySelector(
          "#manaV83Tabs " +
          ".mana-v83-tab.active"
        )
        ?.dataset
        ?.v83Tab ||
      ""
    );
  }


  function currentProgram() {

    const value =
      title();


    if (
      value ===
      "MANA 28"
    ) {

      return "mana28";

    }


    if (
      value ===
        "MANA LIFE" ||
      value ===
        "MANA LYFE"
    ) {

      return "lyfe";

    }


    return "";
  }


  function stateKey(
    program
  ) {

    return (
      program ===
        "mana28"
        ? M28_KEY
        : LYFE_KEY
    );
  }


  function esc(
    value
  ) {

    return String(
      value ?? ""
    )
      .replaceAll(
        "&",
        "&amp;"
      )
      .replaceAll(
        "<",
        "&lt;"
      )
      .replaceAll(
        ">",
        "&gt;"
      );
  }


  function dayData(
    program,
    day
  ) {

    const week =
      Math.floor(
        (day - 1) / 7
      );


    if (
      program ===
      "mana28"
    ) {

      const base =
        MANA28[
          (day - 1) % 7
        ];


      const suffix =
        week === 0
          ? ""
          : week === 1
            ? " • Build"
            : week === 2
              ? " • Progress"
              : " • Finish Strong";


      return {
        ...base,
        title:
          base.title +
          suffix
      };

    }


    const base =
      LYFE[
        (day - 1) % 7
      ];


    const themes = [
      "RESET",
      "REBUILD",
      "GROW",
      "MOVE FORWARD"
    ];


    return {
      ...base,
      theme:
        themes[week] ||
        "MOVE FORWARD"
    };
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
         OVERVIEW TAP LAYER
         ===================================== */

      #manaV83Content{

        position:
          relative !important;

        z-index:
          10 !important;

        pointer-events:
          auto !important;
      }


      #manaV83Content
      .mana-v973-grid{

        position:
          relative !important;

        z-index:
          20 !important;

        pointer-events:
          auto !important;
      }


      #manaV83Content
      .mana-v973-hub-card{

        position:
          relative !important;

        z-index:
          30 !important;

        pointer-events:
          auto !important;

        touch-action:
          manipulation !important;

        cursor:
          pointer !important;

        -webkit-tap-highlight-color:
          transparent !important;
      }


      #manaV83Content
      .mana-v973-hub-card
      *{

        pointer-events:
          none !important;
      }


      /* =====================================
         OVERVIEW VISUALS
         ===================================== */

      #manaV83Content
      .mana-v973-hero{

        margin:
          0
          0
          25px !important;

        padding:
          6px
          0
          0 !important;

        border:
          0 !important;

        background:
          transparent !important;
      }


      #manaV83Content
      .mana-v973-hero h2{

        margin:
          10px
          0
          12px !important;

        color:#fff !important;

        font-size:
          36px !important;

        font-weight:
          950 !important;

        line-height:
          1.02 !important;
      }


      #manaV83Content
      .mana-v973-hero p{

        max-width:
          680px;

        color:
          #b8b8b8 !important;

        font-size:
          17px !important;

        line-height:
          1.6 !important;
      }


      #manaV83Content
      .mana-v973-grid{

        display:
          grid !important;

        grid-template-columns:
          repeat(
            2,
            minmax(
              0,
              1fr
            )
          ) !important;

        gap:
          16px !important;
      }


      #manaV83Content
      .mana-v973-hub-card{

        min-height:
          190px !important;

        padding:
          24px !important;

        border:
          1px solid
          #3b3522 !important;

        border-radius:
          24px !important;

        background:
          linear-gradient(
            145deg,
            #171611,
            #10100d 48%,
            #090909
          ) !important;
      }


      /* =====================================
         PROGRAM FULL HEIGHT MODE
         ===================================== */

      #manaV83ProgramShell.mana-v974-program-mode{

        overflow:
          hidden !important;
      }


      #manaV83ProgramShell.mana-v974-program-mode
      .mana-v83-shell{

        height:
          calc(
            100dvh
            -
            env(
              safe-area-inset-top
            )
            -
            env(
              safe-area-inset-bottom
            )
            -
            28px
          ) !important;

        max-height:
          calc(
            100dvh
            -
            env(
              safe-area-inset-top
            )
            -
            env(
              safe-area-inset-bottom
            )
            -
            28px
          ) !important;

        display:
          flex !important;

        flex-direction:
          column !important;

        overflow:
          hidden !important;
      }


      #manaV83ProgramShell.mana-v974-program-mode
      .mana-v83-head{

        flex:
          0
          0
          auto !important;

        margin-bottom:
          8px !important;
      }


      #manaV83ProgramShell.mana-v974-program-mode
      #manaV83Content{

        flex:
          1
          1
          auto !important;

        min-height:
          0 !important;

        height:
          100% !important;

        display:
          flex !important;

        flex-direction:
          column !important;

        overflow:
          hidden !important;
      }


      #manaV83ProgramShell
      .mana-v973-program-head{

        flex:
          0
          0
          auto !important;

        margin:
          0
          0
          8px !important;
      }


      #manaV83ProgramShell
      .mana-v973-program-head h2{

        margin:
          4px
          0 !important;

        font-size:
          26px !important;

        font-weight:
          950 !important;
      }


      #manaV83ProgramShell
      .mana-v973-program-head p{

        margin:
          0 !important;

        color:
          #888 !important;

        font-size:
          12px !important;
      }


      #manaV83ProgramShell
      .mana-v973-days{

        flex:
          1
          1
          auto !important;

        min-height:
          0 !important;

        height:
          100% !important;

        width:
          100% !important;

        display:
          flex !important;

        gap:
          0 !important;

        overflow-x:
          auto !important;

        overflow-y:
          hidden !important;

        scroll-snap-type:
          x mandatory !important;

        -webkit-overflow-scrolling:
          touch !important;

        scrollbar-width:
          none !important;
      }


      #manaV83ProgramShell
      .mana-v973-days::-webkit-scrollbar{

        display:none;
      }


      /* =====================================
         EACH DAY FILLS THE WHOLE SPACE
         ===================================== */

      #manaV83ProgramShell
      .mana-v973-day{

        flex:
          0
          0
          100% !important;

        width:
          100% !important;

        min-width:
          100% !important;

        max-width:
          100% !important;

        height:
          100% !important;

        min-height:
          100% !important;

        max-height:
          100% !important;

        margin:
          0 !important;

        padding:
          22px !important;

        display:
          flex !important;

        flex-direction:
          column !important;

        box-sizing:
          border-box !important;

        border:
          1px solid
          #3b3522 !important;

        border-radius:
          22px !important;

        background:
          linear-gradient(
            145deg,
            #171611,
            #0b0b09
          ) !important;

        scroll-snap-align:
          start !important;

        scroll-snap-stop:
          always !important;

        overflow:
          hidden !important;
      }


      #manaV83ProgramShell
      .mana-v973-day-number{

        flex:
          0
          0
          auto !important;

        color:
          #e2c25a !important;

        font-size:
          11px !important;

        font-weight:
          950 !important;

        letter-spacing:
          .12em !important;
      }


      #manaV83ProgramShell
      .mana-v973-day h3{

        flex:
          0
          0
          auto !important;

        margin:
          9px
          0
          5px !important;

        color:#fff;

        font-size:
          28px !important;

        font-weight:
          950 !important;

        line-height:
          1.05 !important;
      }


      #manaV83ProgramShell
      .mana-v973-type{

        flex:
          0
          0
          auto !important;

        color:
          #999 !important;

        font-size:
          11px !important;

        font-weight:
          850 !important;
      }


      /* =====================================
         EXERCISES SPREAD DOWN THE PAGE
         ===================================== */

      #manaV83ProgramShell
      .mana-v973-preview{

        flex:
          1
          1
          auto !important;

        min-height:
          0 !important;

        margin:
          16px
          0
          14px !important;

        display:
          flex !important;

        flex-direction:
          column !important;

        justify-content:
          space-evenly !important;

        border-top:
          1px solid
          #29271f !important;

        border-bottom:
          1px solid
          #29271f !important;

        overflow:
          hidden !important;
      }


      #manaV83ProgramShell
      .mana-v973-preview-row{

        flex:
          1
          1
          0 !important;

        min-height:
          42px !important;

        display:
          grid !important;

        grid-template-columns:
          minmax(
            0,
            1fr
          )
          auto !important;

        align-items:
          center !important;

        gap:
          14px !important;

        padding:
          8px
          2px !important;

        border-bottom:
          1px solid
          #24231e !important;

        color:
          #ddd !important;

        font-size:
          14px !important;

        box-sizing:
          border-box !important;
      }


      #manaV83ProgramShell
      .mana-v973-preview-row:last-child{

        border-bottom:
          0 !important;
      }


      #manaV83ProgramShell
      .mana-v973-preview-row
      span:first-child{

        font-weight:
          850 !important;
      }


      #manaV83ProgramShell
      .mana-v973-preview-row
      span:last-child{

        color:
          #d9bf67 !important;

        font-weight:
          950 !important;

        white-space:
          nowrap !important;

        text-align:
          right !important;
      }


      .mana-v974-complete-day{

        flex:
          0
          0
          52px !important;

        width:
          100% !important;

        min-height:
          52px !important;

        margin:
          0 !important;

        border:
          0;

        border-radius:
          15px;

        background:
          #f3d875;

        color:#111;

        font-size:
          13px;

        font-weight:
          950;

        cursor:
          pointer;

        touch-action:
          manipulation;
      }


      .mana-v974-complete-day.complete{

        border:
          1px solid
          #675820;

        background:
          #171408;

        color:
          #f3d875;
      }


      #manaV83ProgramShell
      .mana-v973-start{

        display:
          none !important;
      }


      #manaV973Workout{

        display:
          none !important;
      }


      /* =====================================
         PHONE
         ===================================== */

      @media(max-width:700px){

        #manaV83Content
        .mana-v973-hero h2{

          font-size:
            31px !important;
        }


        #manaV83Content
        .mana-v973-hero p{

          font-size:
            15px !important;
        }


        #manaV83Content
        .mana-v973-grid{

          grid-template-columns:
            minmax(
              0,
              1fr
            ) !important;

          gap:
            14px !important;
        }


        #manaV83Content
        .mana-v973-hub-card{

          width:
            100% !important;

          min-width:
            0 !important;

          min-height:
            160px !important;

          padding:
            20px !important;

          z-index:
            100 !important;
        }


        /*
          Program shell already has bottom
          tabs outside the content area.
          Use ALL remaining height.
        */

        #manaV83ProgramShell.mana-v974-program-mode
        .mana-v83-shell{

          height:
            calc(
              100dvh
              -
              env(
                safe-area-inset-top
              )
              -
              102px
            ) !important;

          max-height:
            calc(
              100dvh
              -
              env(
                safe-area-inset-top
              )
              -
              102px
            ) !important;
        }


        #manaV83ProgramShell.mana-v974-program-mode
        .mana-v83-head{

          margin-bottom:
            5px !important;
        }


        #manaV83ProgramShell
        .mana-v973-program-head{

          margin-bottom:
            5px !important;
        }


        #manaV83ProgramShell
        .mana-v973-program-head h2{

          font-size:
            20px !important;
        }


        #manaV83ProgramShell
        .mana-v973-program-head p{

          display:
            none !important;
        }


        #manaV83ProgramShell
        .mana-v973-day{

          height:
            100% !important;

          min-height:
            100% !important;

          max-height:
            100% !important;

          padding:
            17px !important;

          border-radius:
            19px !important;
        }


        #manaV83ProgramShell
        .mana-v973-day h3{

          margin:
            7px
            0
            3px !important;

          font-size:
            23px !important;
        }


        #manaV83ProgramShell
        .mana-v973-day-number{

          font-size:
            9px !important;
        }


        #manaV83ProgramShell
        .mana-v973-type{

          font-size:
            10px !important;
        }


        #manaV83ProgramShell
        .mana-v973-preview{

          margin:
            11px
            0
            10px !important;

          justify-content:
            space-evenly !important;
        }


        #manaV83ProgramShell
        .mana-v973-preview-row{

          min-height:
            0 !important;

          padding:
            5px
            1px !important;

          font-size:
            12px !important;
        }


        .mana-v974-complete-day{

          flex-basis:
            48px !important;

          min-height:
            48px !important;

          font-size:
            11px !important;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     OVERVIEW TAP HANDLERS
     ========================================= */

  function activateOverviewCard(
    card
  ) {

    if (!card) {

      return;
    }


    const target =
      card.dataset
        .v973Tab;


    if (!target) {

      return;
    }


    const button =
      document.querySelector(
        "#manaV83Tabs " +
        `[data-v83-tab="${target}"]`
      );


    if (!button) {

      return;
    }


    button.click();
  }


  function bindOverviewCards() {

    if (
      tab() !==
      "overview"
    ) {

      return;
    }


    document
      .querySelectorAll(
        "#manaV83Content " +
        ".mana-v973-hub-card" +
        "[data-v973-tab]"
      )
      .forEach(
        card => {

          if (
            card.dataset
              .v974Bound ===
            "1"
          ) {

            return;
          }


          card.dataset
            .v974Bound =
            "1";


          const activate =
            event => {

              const now =
                Date.now();


              if (
                now -
                lastTapAt <
                350
              ) {

                return;
              }


              lastTapAt =
                now;


              event.preventDefault();

              event.stopPropagation();


              activateOverviewCard(
                card
              );

            };


          card.addEventListener(
            "pointerup",
            activate,
            true
          );


          card.addEventListener(
            "touchend",
            activate,
            {
              capture:true,
              passive:false
            }
          );


          card.addEventListener(
            "click",
            activate,
            true
          );

        }
      );
  }


  /* =========================================
     OVERVIEW COPY
     ========================================= */

  function polishOverview() {

    const program =
      currentProgram();


    if (
      !program ||
      tab() !==
      "overview"
    ) {

      return;
    }


    const hero =
      document.querySelector(
        "#manaV83Content " +
        ".mana-v973-hero"
      );


    const heading =
      hero
        ?.querySelector(
          "h2"
        );


    const copy =
      hero
        ?.querySelector(
          "p"
        );


    if (
      program ===
      "mana28"
    ) {

      if (heading) {

        heading.textContent =
          "Your Mana 28 Hub";

      }


      if (copy) {

        copy.textContent =
          "Everything important for your 28-day reset in one place.";

      }

    } else {

      if (heading) {

        heading.textContent =
          "Your Mana Lyfe Hub";

      }


      if (copy) {

        copy.textContent =
          "Movement, mindset and daily action in one place.";

      }

    }


    bindOverviewCards();
  }


  /* =========================================
     PROGRAM
     ========================================= */

  function upgradeProgram() {

    const program =
      currentProgram();


    const currentTab =
      tab();


    const programMode =
      (
        program ===
          "mana28" &&
        currentTab ===
          "program"
      ) ||
      (
        program ===
          "lyfe" &&
        currentTab ===
          "routine"
      );


    shell()
      ?.classList
      .toggle(
        "mana-v974-program-mode",
        programMode
      );


    if (
      !programMode
    ) {

      return;
    }


    const key =
      stateKey(
        program
      );


    const state =
      loadState(
        key
      );


    const cards =
      [
        ...document
          .querySelectorAll(
            "#manaV83Content " +
            ".mana-v973-day"
          )
      ];


    cards.forEach(
      (
        card,
        index
      ) => {

        const day =
          index + 1;


        const data =
          dayData(
            program,
            day
          );


        const preview =
          card.querySelector(
            ".mana-v973-preview"
          );


        if (
          preview
        ) {

          preview.innerHTML =
            data.tasks
              .map(
                task => `

                  <div
                    class="mana-v973-preview-row"
                  >

                    <span>
                      ${esc(task[0])}
                    </span>

                    <span>
                      ${esc(task[1])}
                    </span>

                  </div>

                `
              )
              .join("");

        }


        card
          .querySelector(
            ".mana-v973-start"
          )
          ?.remove();


        let completeButton =
          card.querySelector(
            ".mana-v974-complete-day"
          );


        if (
          !completeButton
        ) {

          completeButton =
            document.createElement(
              "button"
            );


          completeButton.type =
            "button";


          completeButton.className =
            "mana-v974-complete-day";


          card.appendChild(
            completeButton
          );
        }


        const completed =
          state.completed
            .includes(
              day
            );


        completeButton
          .classList
          .toggle(
            "complete",
            completed
          );


        completeButton.textContent =
          completed
            ? "DAY COMPLETE ✓"
            : "COMPLETE DAY →";


        completeButton.disabled =
          completed;


        completeButton.onclick =
          event => {

            event.preventDefault();

            event.stopPropagation();


            if (
              completed
            ) {

              return;
            }


            completeDay(
              program,
              day,
              data.tasks.length
            );

          };


        /*
          Force every page geometry inline.
        */

        card.style.setProperty(
          "flex",
          "0 0 100%",
          "important"
        );


        card.style.setProperty(
          "width",
          "100%",
          "important"
        );


        card.style.setProperty(
          "min-width",
          "100%",
          "important"
        );


        card.style.setProperty(
          "max-width",
          "100%",
          "important"
        );


        card.style.setProperty(
          "height",
          "100%",
          "important"
        );

      }
    );


    const days =
      document.getElementById(
        "manaV973Days"
      );


    if (
      days
    ) {

      days.style.setProperty(
        "gap",
        "0",
        "important"
      );


      days.style.setProperty(
        "height",
        "100%",
        "important"
      );


      days.style.setProperty(
        "min-height",
        "0",
        "important"
      );

    }
  }


  function completeDay(
    program,
    day,
    taskCount
  ) {

    const key =
      stateKey(
        program
      );


    const state =
      loadState(
        key
      );


    if (
      !state.completed
        .includes(
          day
        )
    ) {

      state.completed
        .push(
          day
        );


      state.completed
        .sort(
          (a,b) =>
            a - b
        );

    }


    state[
      `day${day}`
    ] = {

      checks:
        Array(
          taskCount
        ).fill(
          true
        ),

      completedAt:
        new Date()
          .toISOString()

    };


    saveState(
      key,
      state
    );


    scheduleApply();
  }


  /* =========================================
     APPLY
     ========================================= */

  function apply() {

    installStyles();

    polishOverview();

    upgradeProgram();

  }


  function scheduleApply() {

    clearTimeout(
      refreshTimer
    );


    refreshTimer =
      setTimeout(
        apply,
        20
      );


    [
      80,
      180,
      350
    ].forEach(
      delay => {

        setTimeout(
          apply,
          delay
        );

      }
    );
  }


  /* =========================================
     OBSERVER
     ========================================= */

  function installObserver() {

    const holder =
      document.getElementById(
        "manaV83Content"
      );


    if (
      !holder ||
      observer
    ) {

      return;
    }


    observer =
      new MutationObserver(
        () => {

          if (
            currentProgram()
          ) {

            scheduleApply();

          }

        }
      );


    observer.observe(
      holder,
      {
        childList:true,
        subtree:true
      }
    );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    installObserver();

    scheduleApply();


    window.addEventListener(
      "mana:program-tab-change",
      scheduleApply
    );


    window.addEventListener(
      "mana:v973-updated",
      scheduleApply
    );


    window.addEventListener(
      "resize",
      scheduleApply
    );


    window.addEventListener(
      "orientationchange",
      scheduleApply
    );


    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            [
              "#manaV80Mana28",
              "#manaV80Life",
              "#manaV83Tabs"
            ].join(",")
          )
        ) {

          scheduleApply();

        }

      },
      true
    );


    window
      .MANA_28_LYFE_POLISH_BUILD =
      BUILD;


    window
      .refreshMana28LyfePolish =
      scheduleApply;


    console.log(
      "[Mana v9.74.3] full page experience ready"
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
