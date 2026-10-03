/* =========================================
   MANA MOVEMENT TRAINING v9.75.0
   MANA 28 + MANA LYFE STABLE EXPERIENCE

   - FAST NATIVE PHONE SWIPE
   - NO MUTATION OBSERVER
   - NO CONSTANT REPAINT LOOP
   - PREMIUM STRENGTH-STYLE OVERVIEW
   - DIRECT OVERVIEW TAP HANDLERS
   - FULL HEIGHT DAY CARDS
   - LAPTOP PREVIOUS / NEXT DAY
   - BACK -> OVERVIEW -> HOME
   ========================================= */

(() => {
  "use strict";

  const BUILD = "97500";

  const STYLE_ID =
    "mana-v975-style";

  const M28_KEY =
    "mana-v973-mana28-state";

  const LYFE_KEY =
    "mana-v973-lyfe-state";

  let currentDayIndex = 0;

  let tapLock = 0;


  /* =========================================
     PROGRAM DATA
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

  function safeJson(raw, fallback) {

    try {

      return JSON.parse(raw);

    } catch (_) {

      return fallback;

    }
  }


  function loadState(key) {

    const state =
      safeJson(
        localStorage.getItem(key) || "{}",
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
      JSON.stringify(state)
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


  function activeTab() {

    return (
      document
        .querySelector(
          "#manaV83Tabs .mana-v83-tab.active"
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
      value === "MANA 28"
    ) {

      return "mana28";

    }


    if (
      value === "MANA LIFE" ||
      value === "MANA LYFE"
    ) {

      return "lyfe";

    }


    return "";
  }


  function programTabName(
    program
  ) {

    return (
      program === "mana28"
        ? "program"
        : "routine"
    );
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


  function esc(value) {

    return String(value ?? "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;");
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
         PREMIUM OVERVIEW
         ===================================== */

      #manaV83Content
      .mana-v973-hero{

        max-width:860px !important;

        margin:
          0 0 26px !important;

        padding:
          8px 0 0 !important;

        border:0 !important;

        border-radius:0 !important;

        background:
          transparent !important;

        box-shadow:
          none !important;
      }


      #manaV83Content
      .mana-v973-kicker{

        color:#e2c25a !important;

        font-size:12px !important;

        font-weight:950 !important;

        letter-spacing:.16em !important;

        text-transform:
          uppercase !important;
      }


      #manaV83Content
      .mana-v973-hero h2{

        margin:
          10px 0 12px !important;

        color:#fff !important;

        font-size:36px !important;

        font-weight:950 !important;

        line-height:1.02 !important;
      }


      #manaV83Content
      .mana-v973-hero p{

        max-width:680px !important;

        margin:0 !important;

        color:#b8b8b8 !important;

        font-size:17px !important;

        line-height:1.6 !important;
      }


      #manaV83Content
      .mana-v973-grid{

        width:100% !important;

        max-width:860px !important;

        display:grid !important;

        grid-template-columns:
          repeat(
            2,
            minmax(0,1fr)
          ) !important;

        gap:16px !important;
      }


      #manaV83Content
      .mana-v973-hub-card{

        position:relative !important;

        min-height:196px !important;

        padding:24px !important;

        display:grid !important;

        grid-template-columns:
          62px
          minmax(0,1fr) !important;

        grid-template-rows:
          auto auto 1fr !important;

        column-gap:18px !important;

        border:
          1px solid
          #3b3522 !important;

        border-radius:24px !important;

        background:
          linear-gradient(
            145deg,
            #171611,
            #10100d 45%,
            #090909
          ) !important;

        box-shadow:
          0 14px 32px
          rgba(0,0,0,.22) !important;

        cursor:pointer !important;

        pointer-events:auto !important;

        touch-action:
          manipulation !important;

        -webkit-tap-highlight-color:
          transparent !important;
      }


      #manaV83Content
      .mana-v973-hub-card::before{

        content:"";

        position:absolute;

        top:0;

        left:22px;

        right:22px;

        height:2px;

        background:
          linear-gradient(
            90deg,
            transparent,
            #d9ba55,
            transparent
          );

        pointer-events:none;
      }


      .mana-v975-icon{

        grid-column:1;

        grid-row:
          1 / span 3;

        width:62px;

        height:62px;

        display:grid;

        place-items:center;

        border-radius:18px;

        background:
          linear-gradient(
            145deg,
            #f2d978,
            #c89f2f
          );

        color:#111;

        font-size:20px;

        font-weight:950;

        pointer-events:none;
      }


      #manaV83Content
      .mana-v973-hub-card strong{

        grid-column:2;

        color:#fff !important;

        font-size:26px !important;

        font-weight:950 !important;

        line-height:1.08 !important;

        pointer-events:none;
      }


      #manaV83Content
      .mana-v973-hub-card span{

        grid-column:2;

        margin-top:11px !important;

        color:#b8b8b8 !important;

        font-size:15px !important;

        line-height:1.55 !important;

        pointer-events:none;
      }


      #manaV83Content
      .mana-v973-hub-card b{

        grid-column:2;

        align-self:end;

        margin-top:16px !important;

        color:#f3d875 !important;

        font-size:13px !important;

        font-weight:950 !important;

        pointer-events:none;
      }


      /* =====================================
         PROGRAM FULL HEIGHT
         ===================================== */

      #manaV83ProgramShell.mana-v975-program{

        overflow:hidden !important;
      }


      #manaV83ProgramShell.mana-v975-program
      .mana-v83-shell{

        height:100% !important;

        min-height:0 !important;

        display:flex !important;

        flex-direction:column !important;

        overflow:hidden !important;
      }


      #manaV83ProgramShell.mana-v975-program
      .mana-v83-head{

        flex:
          0 0 auto !important;

        margin-bottom:
          8px !important;
      }


      #manaV83ProgramShell.mana-v975-program
      #manaV83Content{

        flex:
          1 1 auto !important;

        min-height:0 !important;

        display:flex !important;

        flex-direction:column !important;

        overflow:hidden !important;
      }


      #manaV83ProgramShell
      .mana-v973-program-head{

        flex:
          0 0 auto !important;

        margin:
          0 0 8px !important;
      }


      #manaV83ProgramShell
      .mana-v973-program-head h2{

        margin:
          4px 0 !important;

        color:#fff;

        font-size:26px !important;

        font-weight:950 !important;
      }


      #manaV83ProgramShell
      .mana-v973-program-head p{

        margin:0 !important;

        color:#888 !important;

        font-size:12px !important;
      }


      /* =====================================
         DAY CAROUSEL
         ===================================== */

      #manaV83ProgramShell
      .mana-v973-days{

        flex:
          1 1 auto !important;

        min-height:0 !important;

        width:100% !important;

        display:flex !important;

        gap:0 !important;

        overflow-x:auto !important;

        overflow-y:hidden !important;

        scroll-snap-type:
          x mandatory !important;

        scroll-behavior:
          smooth;

        -webkit-overflow-scrolling:
          touch !important;

        scrollbar-width:none !important;
      }


      #manaV83ProgramShell
      .mana-v973-days::-webkit-scrollbar{

        display:none;
      }


      #manaV83ProgramShell
      .mana-v973-day{

        flex:
          0 0 100% !important;

        width:100% !important;

        min-width:100% !important;

        max-width:100% !important;

        height:100% !important;

        min-height:100% !important;

        max-height:100% !important;

        margin:0 !important;

        padding:22px !important;

        display:flex !important;

        flex-direction:column !important;

        box-sizing:
          border-box !important;

        border:
          1px solid
          #3b3522 !important;

        border-radius:22px !important;

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

        overflow:hidden !important;
      }


      #manaV83ProgramShell
      .mana-v973-day-number{

        flex:
          0 0 auto;

        color:#e2c25a !important;

        font-size:11px !important;

        font-weight:950 !important;

        letter-spacing:.12em !important;
      }


      #manaV83ProgramShell
      .mana-v973-day h3{

        flex:
          0 0 auto;

        margin:
          9px 0 5px !important;

        color:#fff;

        font-size:28px !important;

        font-weight:950 !important;

        line-height:1.05 !important;
      }


      #manaV83ProgramShell
      .mana-v973-type{

        flex:
          0 0 auto;

        color:#999 !important;

        font-size:11px !important;

        font-weight:850 !important;
      }


      /* exercises use all vertical space */

      #manaV83ProgramShell
      .mana-v973-preview{

        flex:
          1 1 auto !important;

        min-height:0 !important;

        margin:
          16px 0 14px !important;

        display:flex !important;

        flex-direction:column !important;

        justify-content:
          space-evenly !important;

        border-top:
          1px solid
          #29271f !important;

        border-bottom:
          1px solid
          #29271f !important;

        overflow:hidden !important;
      }


      #manaV83ProgramShell
      .mana-v973-preview-row{

        flex:
          1 1 0 !important;

        min-height:0 !important;

        display:grid !important;

        grid-template-columns:
          minmax(0,1fr)
          auto !important;

        align-items:center !important;

        gap:14px !important;

        padding:
          6px 2px !important;

        border-bottom:
          1px solid
          #24231e !important;

        color:#ddd !important;

        font-size:14px !important;
      }


      #manaV83ProgramShell
      .mana-v973-preview-row:last-child{

        border-bottom:0 !important;
      }


      #manaV83ProgramShell
      .mana-v973-preview-row
      span:first-child{

        font-weight:850 !important;
      }


      #manaV83ProgramShell
      .mana-v973-preview-row
      span:last-child{

        color:#d9bf67 !important;

        font-weight:950 !important;

        white-space:nowrap;
      }


      /* =====================================
         COMPLETE BUTTON
         ===================================== */

      .mana-v975-complete{

        flex:
          0 0 52px;

        width:100%;

        min-height:52px;

        border:0;

        border-radius:15px;

        background:#f3d875;

        color:#111;

        font-size:13px;

        font-weight:950;

        cursor:pointer;
      }


      .mana-v975-complete.done{

        border:
          1px solid
          #66571f;

        background:#171408;

        color:#f3d875;
      }


      #manaV83ProgramShell
      .mana-v973-start{

        display:none !important;
      }


      #manaV973Workout{

        display:none !important;
      }


      /* =====================================
         LAPTOP DAY NAV
         ===================================== */

      .mana-v975-daynav{

        flex:
          0 0 auto;

        display:grid;

        grid-template-columns:
          1fr auto 1fr;

        align-items:center;

        gap:10px;

        margin-top:9px;
      }


      .mana-v975-daynav button{

        min-height:44px;

        border:
          1px solid #353535;

        border-radius:13px;

        background:#111;

        color:#ddd;

        font-size:11px;

        font-weight:950;

        cursor:pointer;
      }


      .mana-v975-daynav
      button:last-child{

        color:#f3d875;

        border-color:#5c4d20;
      }


      .mana-v975-daycount{

        min-width:86px;

        text-align:center;

        color:#aaa;

        font-size:11px;

        font-weight:900;
      }


      /* =====================================
         MOBILE
         ===================================== */

      @media(max-width:700px){

        #manaV83Content
        .mana-v973-hero h2{

          font-size:31px !important;
        }


        #manaV83Content
        .mana-v973-hero p{

          font-size:15px !important;
        }


        #manaV83Content
        .mana-v973-grid{

          grid-template-columns:
            1fr !important;

          gap:14px !important;
        }


        #manaV83Content
        .mana-v973-hub-card{

          min-height:164px !important;

          grid-template-columns:
            56px
            minmax(0,1fr) !important;

          column-gap:15px !important;

          padding:20px !important;
        }


        .mana-v975-icon{

          width:56px;

          height:56px;

          border-radius:17px;

          font-size:18px;
        }


        #manaV83Content
        .mana-v973-hub-card strong{

          font-size:23px !important;
        }


        #manaV83Content
        .mana-v973-hub-card span{

          font-size:14px !important;
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

          display:none !important;
        }


        #manaV83ProgramShell
        .mana-v973-day{

          padding:
            17px !important;

          border-radius:
            19px !important;
        }


        #manaV83ProgramShell
        .mana-v973-day-number{

          font-size:
            9px !important;
        }


        #manaV83ProgramShell
        .mana-v973-day h3{

          margin:
            7px 0 3px !important;

          font-size:
            23px !important;
        }


        #manaV83ProgramShell
        .mana-v973-type{

          font-size:
            10px !important;
        }


        #manaV83ProgramShell
        .mana-v973-preview{

          margin:
            10px 0 !important;
        }


        #manaV83ProgramShell
        .mana-v973-preview-row{

          padding:
            4px 1px !important;

          font-size:
            12px !important;
        }


        .mana-v975-complete{

          flex-basis:
            48px;

          min-height:
            48px;

          font-size:
            11px;
        }


        /*
          PHONE = NATIVE SWIPE ONLY.
          Hide laptop controls completely.
        */

        .mana-v975-daynav{

          display:none !important;
        }

      }

    `;


    document.head
      .appendChild(style);
  }


  /* =========================================
     OVERVIEW
     ========================================= */

  const ICONS = {

    program:"28",
    routine:"28",
    progress:"↗",
    fuel:"F",
    learn:"i",
    reclaim:"✦"

  };


  function polishOverview() {

    const program =
      currentProgram();


    if (
      !program ||
      activeTab() !==
        "overview"
    ) {

      return;
    }


    shell()
      ?.classList
      .remove(
        "mana-v975-program"
      );


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


    const h2 =
      hero
        ?.querySelector("h2");


    const p =
      hero
        ?.querySelector("p");


    if (
      program === "mana28"
    ) {

      if (h2) {

        h2.textContent =
          "Your Mana 28 Hub";

      }


      if (p) {

        p.textContent =
          "Everything important for your 28-day reset in one place. Choose where you want to go next.";

      }

    } else {

      if (h2) {

        h2.textContent =
          "Your Mana Lyfe Hub";

      }


      if (p) {

        p.textContent =
          "Movement, mindset and daily action in one place. Choose what you need next.";

      }

    }


    holder
      ?.querySelectorAll(
        ".mana-v973-hub-card"
      )
      .forEach(
        card => {

          let icon =
            card.querySelector(
              ".mana-v975-icon"
            );


          if (!icon) {

            icon =
              document.createElement(
                "div"
              );


            icon.className =
              "mana-v975-icon";


            icon.textContent =
              ICONS[
                card.dataset
                  .v973Tab
              ] || "M";


            card.prepend(
              icon
            );
          }


          /*
            Direct handler.
            No document-wide heavy observer.
          */

          card.onclick =
            event => {

              event.preventDefault();

              event.stopPropagation();


              openTab(
                card.dataset
                  .v973Tab
              );

            };


          card.onpointerup =
            event => {

              if (
                event.pointerType !==
                  "touch"
              ) {

                return;
              }


              const now =
                Date.now();


              if (
                now - tapLock <
                350
              ) {

                return;
              }


              tapLock =
                now;


              event.preventDefault();


              openTab(
                card.dataset
                  .v973Tab
              );

            };

        }
      );
  }


  function openTab(
    name
  ) {

    const button =
      document.querySelector(
        "#manaV83Tabs " +
        `[data-v83-tab="${name}"]`
      );


    if (!button) {

      return;
    }


    button.click();
  }


  /* =========================================
     PROGRAM
     ========================================= */

  function renderProgramPolish() {

    const program =
      currentProgram();


    if (!program) {

      return;
    }


    if (
      activeTab() !==
      programTabName(
        program
      )
    ) {

      shell()
        ?.classList
        .remove(
          "mana-v975-program"
        );


      return;
    }


    shell()
      ?.classList
      .add(
        "mana-v975-program"
      );


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


        card
          .querySelector(
            ".mana-v973-start"
          )
          ?.remove();


        let complete =
          card.querySelector(
            ".mana-v975-complete"
          );


        if (!complete) {

          complete =
            document.createElement(
              "button"
            );


          complete.type =
            "button";


          complete.className =
            "mana-v975-complete";


          card.appendChild(
            complete
          );
        }


        const finished =
          state.completed
            .includes(day);


        complete.classList
          .toggle(
            "done",
            finished
          );


        complete.textContent =
          finished
            ? "DAY COMPLETE ✓"
            : "COMPLETE DAY →";


        complete.onclick =
          () => {

            if (
              finished
            ) {

              return;
            }


            completeDay(
              program,
              day,
              data.tasks.length
            );

          };

      }
    );


    setupDayNavigation(
      cards
    );


    setupNativeSwipeTracking(
      cards
    );


    updateBackButton();
  }


  /* =========================================
     COMPLETE
     ========================================= */

  function completeDay(
    program,
    day,
    count
  ) {

    const key =
      stateKey(
        program
      );


    const state =
      loadState(key);


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


    state[
      `day${day}`
    ] = {

      checks:
        Array(count)
          .fill(true),

      completedAt:
        new Date()
          .toISOString()

    };


    saveState(
      key,
      state
    );


    /*
      Update button only.
      Do NOT rebuild all 28 cards.
    */

    const card =
      document.querySelector(
        `#manaV83Content
         .mana-v973-day:nth-child(${day})`
      );


    const button =
      card?.querySelector(
        ".mana-v975-complete"
      );


    if (button) {

      button.classList
        .add("done");


      button.textContent =
        "DAY COMPLETE ✓";

    }
  }


  /* =========================================
     LAPTOP PREV / NEXT
     ========================================= */

  function setupDayNavigation(
    cards
  ) {

    const holder =
      document
        .getElementById(
          "manaV83Content"
        );


    if (
      !holder ||
      !cards.length
    ) {

      return;
    }


    let nav =
      holder.querySelector(
        ".mana-v975-daynav"
      );


    if (!nav) {

      nav =
        document.createElement(
          "div"
        );


      nav.className =
        "mana-v975-daynav";


      nav.innerHTML = `

        <button
          type="button"
          id="manaV975Prev"
        >
          ← PREVIOUS DAY
        </button>

        <div
          class="mana-v975-daycount"
          id="manaV975Count"
        >
          DAY 1 OF 28
        </div>

        <button
          type="button"
          id="manaV975Next"
        >
          NEXT DAY →
        </button>

      `;


      holder.appendChild(
        nav
      );
    }


    document
      .getElementById(
        "manaV975Prev"
      )
      .onclick =
      () => {

        goToDay(
          currentDayIndex - 1,
          cards
        );

      };


    document
      .getElementById(
        "manaV975Next"
      )
      .onclick =
      () => {

        goToDay(
          currentDayIndex + 1,
          cards
        );

      };


    updateDayCount(
      cards.length
    );
  }


  function goToDay(
    index,
    cards
  ) {

    currentDayIndex =
      Math.max(
        0,
        Math.min(
          cards.length - 1,
          index
        )
      );


    cards[
      currentDayIndex
    ]
      ?.scrollIntoView({
        behavior:"smooth",
        block:"nearest",
        inline:"start"
      });


    updateDayCount(
      cards.length
    );
  }


  function updateDayCount(
    total
  ) {

    const count =
      document.getElementById(
        "manaV975Count"
      );


    if (count) {

      count.textContent =
        `DAY ${
          currentDayIndex + 1
        } OF ${total}`;

    }


    const prev =
      document.getElementById(
        "manaV975Prev"
      );


    const next =
      document.getElementById(
        "manaV975Next"
      );


    if (prev) {

      prev.disabled =
        currentDayIndex === 0;

    }


    if (next) {

      next.disabled =
        currentDayIndex ===
        total - 1;

    }
  }


  /* =========================================
     FAST PHONE SWIPE TRACKING
     ========================================= */

  function setupNativeSwipeTracking(
    cards
  ) {

    const days =
      document.getElementById(
        "manaV973Days"
      );


    if (
      !days ||
      days.dataset
        .v975ScrollBound ===
        "1"
    ) {

      return;
    }


    days.dataset
      .v975ScrollBound =
      "1";


    let timer = null;


    days.addEventListener(
      "scroll",
      () => {

        clearTimeout(
          timer
        );


        timer =
          setTimeout(
            () => {

              const width =
                days.clientWidth;


              if (!width) {

                return;
              }


              currentDayIndex =
                Math.max(
                  0,
                  Math.min(
                    cards.length - 1,
                    Math.round(
                      days.scrollLeft /
                      width
                    )
                  )
                );


              updateDayCount(
                cards.length
              );

            },
            70
          );

      },
      {
        passive:true
      }
    );
  }


  /* =========================================
     BACK BEHAVIOUR
     ========================================= */

  function updateBackButton() {

    const program =
      currentProgram();


    const back =
      document
        .getElementById(
          "manaV83Back"
        );


    if (
      !program ||
      !back
    ) {

      return;
    }


    if (
      activeTab() !==
        "overview"
    ) {

      back.textContent =
        "← Overview";

    } else {

      back.textContent =
        "← Home";

    }
  }


  function installBackRepair() {

    document.addEventListener(
      "click",
      event => {

        const back =
          event.target.closest(
            "#manaV83Back"
          );


        if (!back) {

          return;
        }


        const program =
          currentProgram();


        if (
          !program ||
          activeTab() ===
            "overview"
        ) {

          return;

        }


        /*
          Stop the old v8.3 handler
          from closing to Home.
        */

        event.preventDefault();

        event.stopImmediatePropagation();


        openTab(
          "overview"
        );

      },
      true
    );
  }


  /* =========================================
     REFRESH
     ========================================= */

  function refresh() {

    installStyles();

    polishOverview();

    renderProgramPolish();

    updateBackButton();
  }


  function refreshAfterRender() {

    /*
      v9.73 uses short delayed rendering.
      Run only a few times after navigation,
      NOT continuously.
    */

    [
      20,
      100,
      220,
      420
    ].forEach(
      delay => {

        setTimeout(
          refresh,
          delay
        );

      }
    );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    installBackRepair();

    refreshAfterRender();


    window.addEventListener(
      "mana:program-tab-change",
      refreshAfterRender
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

          refreshAfterRender();

        }

      },
      true
    );


    window
      .MANA_28_LYFE_STABLE_BUILD =
      BUILD;


    window
      .refreshMana28LyfeStable =
      refreshAfterRender;


    console.log(
      "[Mana v9.75.0] stable experience ready"
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
