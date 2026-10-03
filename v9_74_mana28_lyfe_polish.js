/* =========================================
   MANA MOVEMENT TRAINING v9.74.2
   MANA 28 + MANA LYFE FINAL PROGRAM FLOW

   - OVERVIEW CARDS TAPPABLE ON PHONE
   - PROGRAM DAY IS THE WORKOUT
   - NO START WORKOUT SCREEN
   - NO SECOND WORKOUT MODAL
   - EACH DAY = ONE FULL PAGE
   - ZERO DAY-TO-DAY OVERLAP
   - COMPLETE DAY BUTTON AT BOTTOM
   - ALL 28 DAYS UNLOCKED
   ========================================= */

(() => {
  "use strict";

  const BUILD = "97420";

  const STYLE_ID =
    "mana-v974-m28-lyfe-polish-style";

  const M28_KEY =
    "mana-v973-mana28-state";

  const LYFE_KEY =
    "mana-v973-lyfe-state";

  let observer = null;

  let refreshTimer = null;

  let lastProgram = "";
  let lastDay = 1;


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


  function shellOpen() {

    return Boolean(
      shell()
        ?.classList
        .contains(
          "open"
        )
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

    const t =
      title();


    if (
      t === "MANA 28"
    ) {

      return "mana28";

    }


    if (
      t === "MANA LYFE" ||
      t === "MANA LIFE"
    ) {

      return "lyfe";

    }


    return "";
  }


  function stateKey(
    program
  ) {

    return (
      program === "mana28"
        ? M28_KEY
        : LYFE_KEY
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
      program === "mana28"
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
         OVERVIEW
         ===================================== */

      #manaV83Content
      .mana-v973-hero{

        margin:
          0
          0
          26px !important;

        padding:
          8px
          0
          0 !important;

        border:
          0 !important;

        background:
          transparent !important;

        box-shadow:
          none !important;
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
            minmax(0,1fr)
          ) !important;

        gap:
          16px !important;
      }


      #manaV83Content
      .mana-v973-hub-card{

        position:
          relative !important;

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

        cursor:
          pointer !important;

        pointer-events:
          auto !important;

        touch-action:
          manipulation !important;

        -webkit-tap-highlight-color:
          transparent !important;
      }


      #manaV83Content
      .mana-v973-hub-card::after{

        content:"";

        position:
          absolute;

        top:0;

        left:
          22px;

        right:
          22px;

        height:
          2px;

        background:
          linear-gradient(
            90deg,
            transparent,
            #d9ba55,
            transparent
          );

        pointer-events:
          none;
      }


      #manaV83Content
      .mana-v973-hub-card
      *{

        pointer-events:
          none !important;
      }


      #manaV83Content
      .mana-v973-hub-card
      strong{

        color:#fff !important;

        font-size:
          25px !important;

        font-weight:
          950 !important;
      }


      #manaV83Content
      .mana-v973-hub-card
      span{

        color:
          #b8b8b8 !important;

        font-size:
          15px !important;
      }


      #manaV83Content
      .mana-v973-hub-card
      b{

        color:
          #f3d875 !important;

        font-size:
          13px !important;
      }


      /* =====================================
         PROGRAM MODE
         ===================================== */

      #manaV83ProgramShell
      .mana-v973-program-head{

        flex:
          0
          0
          auto !important;

        margin:
          0
          0
          10px !important;
      }


      #manaV83ProgramShell
      .mana-v973-program-head h2{

        margin:
          5px
          0 !important;

        font-size:
          28px !important;

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


      /* EXACTLY ONE DAY PER PAGE */

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
          0 !important;

        margin:
          0 !important;

        padding:
          22px !important;

        display:
          flex !important;

        flex-direction:
          column !important;

        border:
          1px solid
          #3b3522 !important;

        border-radius:
          24px !important;

        background:
          linear-gradient(
            145deg,
            #171611,
            #0b0b09
          ) !important;

        box-sizing:
          border-box !important;

        scroll-snap-align:
          start !important;

        scroll-snap-stop:
          always !important;

        overflow-y:
          auto !important;

        overflow-x:
          hidden !important;
      }


      #manaV83ProgramShell
      .mana-v973-day-number{

        flex:
          0
          0
          auto;

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
          auto;

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
          auto;

        color:
          #999 !important;

        font-size:
          11px !important;

        font-weight:
          850 !important;
      }


      #manaV83ProgramShell
      .mana-v973-preview{

        flex:
          0
          1
          auto;

        margin-top:
          15px !important;

        border-top:
          1px solid
          #29271f !important;
      }


      #manaV83ProgramShell
      .mana-v973-preview-row{

        display:
          grid !important;

        grid-template-columns:
          minmax(0,1fr)
          auto !important;

        gap:
          12px !important;

        padding:
          10px
          0 !important;

        border-bottom:
          1px solid
          #24231e !important;

        color:
          #ddd !important;

        font-size:
          13px !important;
      }


      #manaV83ProgramShell
      .mana-v973-preview-row
      span:last-child{

        color:
          #d9bf67 !important;

        font-weight:
          900 !important;

        text-align:
          right !important;
      }


      .mana-v974-complete-day{

        width:
          100%;

        min-height:
          52px;

        flex:
          0
          0
          auto;

        margin:
          auto
          0
          0;

        padding:
          0
          16px;

        border:
          0;

        border-radius:
          15px;

        background:
          #f3d875;

        color:
          #111;

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
          #6b5b22;

        background:
          #171408;

        color:
          #f3d875;
      }


      /* old Start Workout completely gone */

      #manaV83ProgramShell
      .mana-v973-start{

        display:
          none !important;
      }


      /* old modal no longer used */

      #manaV973Workout{

        display:
          none !important;
      }


      /* =====================================
         PHONE
         ===================================== */

      @media(max-width:700px){

        #manaV83Content
        .mana-v973-hero{

          margin-bottom:
            20px !important;
        }


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
        }


        /* PROGRAM USES AVAILABLE SCREEN */

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
              121px
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
            10px !important;
        }


        #manaV83ProgramShell.mana-v974-program-mode
        #manaV83Content{

          flex:
            1
            1
            auto !important;

          min-height:
            0 !important;

          display:
            flex !important;

          flex-direction:
            column !important;

          overflow:
            hidden !important;
        }


        #manaV83ProgramShell
        .mana-v973-program-head{

          margin-bottom:
            7px !important;
        }


        #manaV83ProgramShell
        .mana-v973-program-head h2{

          font-size:
            22px !important;

          line-height:
            1.05 !important;
        }


        #manaV83ProgramShell
        .mana-v973-program-head p{

          display:
            none !important;
        }


        #manaV83ProgramShell
        .mana-v973-days{

          flex:
            1
            1
            auto !important;

          min-height:
            0 !important;

          width:
            100% !important;

          max-width:
            100% !important;

          gap:
            0 !important;
        }


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

          padding:
            17px !important;

          border-radius:
            20px !important;
        }


        #manaV83ProgramShell
        .mana-v973-day h3{

          font-size:
            24px !important;
        }


        #manaV83ProgramShell
        .mana-v973-preview{

          margin-top:
            11px !important;
        }


        #manaV83ProgramShell
        .mana-v973-preview-row{

          padding:
            8px
            0 !important;

          font-size:
            12px !important;
        }


        .mana-v974-complete-day{

          min-height:
            48px;

          margin-top:
            12px;

          font-size:
            11px;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     OVERVIEW TAP REPAIR
     ========================================= */

  function bindOverviewTapRepair() {

    document.addEventListener(
      "click",
      event => {

        const card =
          event.target.closest(
            ".mana-v973-hub-card" +
            "[data-v973-tab]"
          );


        if (!card) {

          return;
        }


        const program =
          currentProgram();


        if (!program) {

          return;
        }


        event.preventDefault();

        event.stopImmediatePropagation();


        const targetTab =
          card.dataset
            .v973Tab;


        document
          .querySelector(
            "#manaV83Tabs " +
            `[data-v83-tab="${targetTab}"]`
          )
          ?.click();

      },
      true
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


    const holder =
      document
        .getElementById(
          "manaV83Content"
        );


    const hero =
      holder
        ?.querySelector(
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
          "Everything important for your 28-day reset in one place. Choose where you want to go next.";

      }

    } else {

      if (heading) {

        heading.textContent =
          "Your Mana Lyfe Hub";

      }


      if (copy) {

        copy.textContent =
          "Movement, mindset and daily action in one place. Choose what you need next.";

      }

    }
  }


  /* =========================================
     TURN PROGRAM CARDS INTO WORKOUTS
     ========================================= */

  function upgradeProgramCards() {

    const program =
      currentProgram();


    const currentTab =
      tab();


    const isProgramTab =
      (
        program === "mana28" &&
        currentTab === "program"
      ) ||
      (
        program === "lyfe" &&
        currentTab === "routine"
      );


    const programShell =
      shell();


    programShell
      ?.classList
      .toggle(
        "mana-v974-program-mode",
        isProgramTab
      );


    if (
      !program ||
      !isProgramTab
    ) {

      return;
    }


    const state =
      loadState(
        stateKey(
          program
        )
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


        card.dataset
          .v974Day =
          String(day);


        card.dataset
          .v974Program =
          program;


        /*
          Ensure full workout is displayed,
          not v9.73's four-item preview.
        */

        const preview =
          card.querySelector(
            ".mana-v973-preview"
          );


        if (preview) {

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


        /*
          Remove the old Start Day button.
        */

        card
          .querySelector(
            ".mana-v973-start"
          )
          ?.remove();


        /*
          Completion button.
        */

        let button =
          card.querySelector(
            ".mana-v974-complete-day"
          );


        if (!button) {

          button =
            document.createElement(
              "button"
            );


          button.type =
            "button";


          button.className =
            "mana-v974-complete-day";


          card.appendChild(
            button
          );
        }


        const complete =
          state.completed
            .includes(day);


        button.classList
          .toggle(
            "complete",
            complete
          );


        button.textContent =
          complete
            ? "DAY COMPLETE ✓"
            : "COMPLETE DAY →";


        button.disabled =
          complete;


        button.onclick =
          event => {

            event.preventDefault();

            event.stopPropagation();


            if (
              button.classList
                .contains(
                  "complete"
                )
            ) {

              return;
            }


            lastProgram =
              program;

            lastDay =
              day;


            completeDay(
              program,
              day,
              data.tasks.length
            );

          };

      }
    );


    /*
      Exact sizing also applied inline to
      beat older mobile style layers.
    */

    const days =
      document.getElementById(
        "manaV973Days"
      );


    if (days) {

      days.style
        .setProperty(
          "gap",
          "0",
          "important"
        );


      cards.forEach(
        card => {

          card.style
            .setProperty(
              "flex",
              "0 0 100%",
              "important"
            );


          card.style
            .setProperty(
              "width",
              "100%",
              "important"
            );


          card.style
            .setProperty(
              "min-width",
              "100%",
              "important"
            );


          card.style
            .setProperty(
              "max-width",
              "100%",
              "important"
            );

        }
      );
    }


    /*
      Return to current card after v9.73
      redraws following completion.
    */

    if (
      program === lastProgram &&
      lastDay > 1
    ) {

      setTimeout(
        () => {

          cards[
            lastDay - 1
          ]
            ?.scrollIntoView({
              block:"nearest",
              inline:"start"
            });

        },
        80
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
        .includes(day)
    ) {

      state.completed
        .push(day);


      state.completed
        .sort(
          (a,b) =>
            a - b
        );
    }


    /*
      Keep compatibility with the original
      v9.73 day detail state.
    */

    state[
      `day${day}`
    ] = {

      checks:
        Array(
          taskCount
        ).fill(true),

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
     REMOVE OLD WORKOUT MODAL
     ========================================= */

  function closeOldModal() {

    const modal =
      document.getElementById(
        "manaV973Workout"
      );


    if (!modal) {

      return;
    }


    modal.classList
      .remove(
        "open"
      );


    document.body.style
      .overflow =
      "";
  }


  /* =========================================
     APPLY
     ========================================= */

  function apply() {

    installStyles();

    closeOldModal();

    polishOverview();

    upgradeProgramCards();
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
      400
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

    bindOverviewTapRepair();

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


    setInterval(
      () => {

        installObserver();


        if (
          currentProgram()
        ) {

          apply();

        }

      },
      1200
    );


    window
      .MANA_28_LYFE_POLISH_BUILD =
      BUILD;


    window
      .refreshMana28LyfePolish =
      scheduleApply;


    console.log(
      "[Mana v9.74.2] simplified day flow ready"
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
