/* =========================================
   MANA MOVEMENT TRAINING v9.74.1
   MANA 28 + MANA LYFE PREMIUM POLISH

   FIXES
   - MATCHES MANA STRENGTH OVERVIEW
   - SELF-HEALS AFTER v9.73 RE-RENDERS
   - MUTATION OBSERVER FOR PHONE
   - FULL SCREEN WORKOUT
   - MOBILE ONE-COLUMN OVERVIEW
   - EDGE-TO-EDGE WORKOUT EXPERIENCE
   ========================================= */

(() => {
  "use strict";

  const BUILD = "97410";

  const STYLE_ID =
    "mana-v974-m28-lyfe-polish-style";

  let observer = null;
  let modalObserver = null;
  let refreshTimer = null;


  /* =========================================
     HELPERS
     ========================================= */

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
        .contains("open")
    );
  }


  function programTitle() {

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
          "#manaV83Tabs " +
          ".mana-v83-tab.active"
        )
        ?.dataset
        ?.v83Tab ||
      ""
    );
  }


  function isMana28() {

    return (
      shellOpen() &&
      programTitle() ===
        "MANA 28"
    );
  }


  function isLyfe() {

    const title =
      programTitle();


    return (
      shellOpen() &&
      (
        title === "MANA LYFE" ||
        title === "MANA LIFE"
      )
    );
  }


  function relevantProgram() {

    return (
      isMana28() ||
      isLyfe()
    );
  }


  function isOverview() {

    return (
      relevantProgram() &&
      activeTab() ===
        "overview"
    );
  }


  /* =========================================
     ICONS
     ========================================= */

  const ICONS = {

    program:"28",

    routine:"28",

    progress:"↗",

    fuel:"F",

    learn:"i",

    reclaim:"✦"

  };


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

        max-width:
          860px !important;

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

        border-radius:
          0 !important;

        background:
          transparent !important;

        box-shadow:
          none !important;
      }


      #manaV83Content
      .mana-v973-kicker{

        color:
          #e2c25a !important;

        font-size:
          12px !important;

        font-weight:
          950 !important;

        letter-spacing:
          .16em !important;

        text-transform:
          uppercase !important;
      }


      #manaV83Content
      .mana-v973-hero h2{

        margin:
          10px
          0
          12px !important;

        color:
          #fff !important;

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
          680px !important;

        margin:
          0 !important;

        color:
          #b8b8b8 !important;

        font-size:
          17px !important;

        line-height:
          1.6 !important;
      }


      #manaV83Content
      .mana-v973-grid{

        width:
          100% !important;

        max-width:
          860px !important;

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
          196px !important;

        display:
          grid !important;

        grid-template-columns:
          62px
          minmax(0,1fr) !important;

        grid-template-rows:
          auto
          auto
          1fr !important;

        column-gap:
          18px !important;

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
            #171611 0%,
            #10100d 45%,
            #090909 100%
          ) !important;

        box-shadow:
          0
          14px
          32px
          rgba(0,0,0,.22),
          inset
          0
          1px
          0
          rgba(255,255,255,.02) !important;

        overflow:
          hidden !important;

        box-sizing:
          border-box !important;
      }


      #manaV83Content
      .mana-v973-hub-card::after{

        content:"";

        position:
          absolute;

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
      }


      .mana-v974-icon{

        grid-column:
          1;

        grid-row:
          1 / span 3;

        width:
          62px;

        height:
          62px;

        display:
          grid;

        place-items:
          center;

        border-radius:
          18px;

        background:
          linear-gradient(
            145deg,
            #f2d978,
            #c89f2f
          );

        color:#111;

        font-size:
          20px;

        font-weight:
          950;
      }


      #manaV83Content
      .mana-v973-hub-card
      strong{

        grid-column:
          2 !important;

        color:
          #fff !important;

        font-size:
          26px !important;

        font-weight:
          950 !important;

        line-height:
          1.08 !important;
      }


      #manaV83Content
      .mana-v973-hub-card
      span{

        grid-column:
          2 !important;

        margin-top:
          11px !important;

        color:
          #b8b8b8 !important;

        font-size:
          15px !important;

        line-height:
          1.55 !important;
      }


      #manaV83Content
      .mana-v973-hub-card
      b{

        grid-column:
          2 !important;

        align-self:
          end !important;

        margin-top:
          16px !important;

        color:
          #f3d875 !important;

        font-size:
          13px !important;

        font-weight:
          950 !important;
      }


      /* =====================================
         PROGRAM CARDS
         ===================================== */

      #manaV83Content
      .mana-v973-program-head{

        max-width:
          860px !important;

        margin-bottom:
          20px !important;
      }


      #manaV83Content
      .mana-v973-program-head h2{

        margin:
          8px
          0 !important;

        color:#fff;

        font-size:
          32px !important;

        font-weight:
          950 !important;
      }


      #manaV83Content
      .mana-v973-days{

        width:
          100% !important;

        max-width:
          860px !important;

        gap:
          14px !important;

        padding:
          2px
          2px
          14px !important;
      }


      #manaV83Content
      .mana-v973-day{

        flex:
          0
          0
          min(
            520px,
            88%
          ) !important;

        padding:
          22px !important;

        border:
          1px solid
          #3a3421 !important;

        border-radius:
          24px !important;

        background:
          linear-gradient(
            145deg,
            #15140f,
            #0a0a09
          ) !important;

        box-sizing:
          border-box !important;
      }


      #manaV83Content
      .mana-v973-day h3{

        font-size:
          27px !important;

        font-weight:
          950 !important;
      }


      /* =====================================
         FULL SCREEN WORKOUT
         ===================================== */

      #manaV973Workout{

        position:
          fixed !important;

        inset:
          0 !important;

        z-index:
          60000 !important;

        padding:
          0 !important;

        margin:
          0 !important;

        overflow:
          hidden !important;

        background:
          #050505 !important;
      }


      #manaV973Workout.open{

        display:
          block !important;
      }


      #manaV973Workout
      .mana-v973-work-shell{

        width:
          100vw !important;

        max-width:
          none !important;

        height:
          100vh !important;

        height:
          100dvh !important;

        margin:
          0 !important;

        padding:
          calc(
            env(
              safe-area-inset-top
            ) + 12px
          )
          18px
          calc(
            env(
              safe-area-inset-bottom
            ) + 12px
          ) !important;

        display:
          grid !important;

        grid-template-rows:
          auto
          auto
          minmax(0,1fr)
          auto
          auto !important;

        box-sizing:
          border-box !important;

        background:
          radial-gradient(
            circle
            at top,
            rgba(
              211,
              176,
              55,
              .07
            ),
            transparent
            34%
          ),
          #050505 !important;
      }


      #manaV973Workout
      .mana-v973-work-head{

        width:
          min(
            920px,
            100%
          ) !important;

        margin:
          0 auto !important;

        padding-bottom:
          10px !important;

        border-bottom:
          1px solid
          #26241d !important;
      }


      #manaV973Workout
      .mana-v973-work-head h2{

        margin:
          5px
          0
          0 !important;

        font-size:
          30px !important;

        font-weight:
          950 !important;
      }


      #manaV973Workout
      .mana-v973-page-counter{

        width:
          min(
            920px,
            100%
          ) !important;

        margin:
          9px
          auto
          0 !important;

        color:
          #d6b958 !important;

        font-size:
          10px !important;

        font-weight:
          950 !important;

        letter-spacing:
          .12em !important;
      }


      #manaV973Workout
      .mana-v973-pages{

        width:
          min(
            920px,
            100%
          ) !important;

        min-height:
          0 !important;

        margin:
          6px
          auto
          0 !important;

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


      #manaV973Workout
      .mana-v973-pages::-webkit-scrollbar{

        display:none;
      }


      #manaV973Workout
      .mana-v973-task{

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

        min-height:
          100% !important;

        margin:
          0 !important;

        padding:
          32px !important;

        display:
          flex !important;

        flex-direction:
          column !important;

        justify-content:
          center !important;

        border:
          0 !important;

        border-radius:
          0 !important;

        background:
          transparent !important;

        box-sizing:
          border-box !important;

        scroll-snap-align:
          start !important;
      }


      #manaV973Workout
      .mana-v973-task h3{

        max-width:
          760px;

        margin:
          14px
          0
          8px !important;

        font-size:
          clamp(
            36px,
            6vw,
            58px
          ) !important;

        font-weight:
          950 !important;

        line-height:
          .98 !important;
      }


      #manaV973Workout
      .mana-v973-dose{

        color:
          #f3d875 !important;

        font-size:
          24px !important;

        font-weight:
          950 !important;
      }


      #manaV973Workout
      .mana-v973-simple-copy{

        max-width:
          650px;

        margin-top:
          22px !important;

        color:#aaa !important;

        font-size:
          15px !important;

        line-height:
          1.6 !important;
      }


      #manaV973Workout
      .mana-v973-task-done{

        width:
          min(
            420px,
            100%
          ) !important;

        min-height:
          54px !important;

        margin-top:
          30px !important;
      }


      #manaV973Workout
      .mana-v973-navigation{

        width:
          min(
            920px,
            100%
          ) !important;

        margin:
          8px
          auto
          0 !important;
      }


      #manaV973Workout
      .mana-v973-finish{

        width:
          min(
            920px,
            100%
          ) !important;

        margin:
          7px
          auto
          0 !important;
      }


      /* =====================================
         PHONE FORCE OVERRIDES
         ===================================== */

      @media(max-width:700px){

        #manaV83Content
        .mana-v973-hero{

          padding:
            4px
            0
            0 !important;

          margin-bottom:
            22px !important;
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

          display:
            grid !important;

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
            164px !important;

          grid-template-columns:
            56px
            minmax(
              0,
              1fr
            ) !important;

          padding:
            20px !important;

          column-gap:
            15px !important;
        }


        .mana-v974-icon{

          width:
            56px !important;

          height:
            56px !important;

          border-radius:
            17px !important;

          font-size:
            18px !important;
        }


        #manaV83Content
        .mana-v973-hub-card
        strong{

          font-size:
            23px !important;
        }


        #manaV83Content
        .mana-v973-hub-card
        span{

          font-size:
            14px !important;
        }


        #manaV83Content
        .mana-v973-day{

          flex:
            0
            0
            94% !important;

          width:
            94% !important;

          max-width:
            94% !important;

          padding:
            19px !important;
        }


        /* PHONE WORKOUT */

        #manaV973Workout
        .mana-v973-work-shell{

          width:
            100vw !important;

          height:
            100dvh !important;

          padding:
            calc(
              env(
                safe-area-inset-top
              ) + 8px
            )
            10px
            calc(
              env(
                safe-area-inset-bottom
              ) + 9px
            ) !important;
        }


        #manaV973Workout
        .mana-v973-work-head{

          width:
            100% !important;

          padding-bottom:
            7px !important;
        }


        #manaV973Workout
        .mana-v973-work-head h2{

          font-size:
            22px !important;
        }


        #manaV973Workout
        .mana-v973-page-counter{

          width:
            100% !important;

          margin-top:
            6px !important;

          font-size:
            9px !important;
        }


        #manaV973Workout
        .mana-v973-pages{

          width:
            100% !important;

          max-width:
            100% !important;

          margin-top:
            4px !important;
        }


        #manaV973Workout
        .mana-v973-task{

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

          padding:
            16px
            6px !important;

          justify-content:
            center !important;
        }


        #manaV973Workout
        .mana-v973-task h3{

          margin:
            10px
            0
            6px !important;

          font-size:
            clamp(
              30px,
              10vw,
              42px
            ) !important;
        }


        #manaV973Workout
        .mana-v973-dose{

          font-size:
            19px !important;
        }


        #manaV973Workout
        .mana-v973-simple-copy{

          margin-top:
            15px !important;

          font-size:
            13px !important;

          line-height:
            1.5 !important;
        }


        #manaV973Workout
        .mana-v973-task-done{

          width:
            100% !important;

          min-height:
            48px !important;

          margin-top:
            19px !important;
        }


        #manaV973Workout
        .mana-v973-navigation{

          width:
            100% !important;

          gap:
            7px !important;

          margin-top:
            5px !important;
        }


        #manaV973Workout
        .mana-v973-nav{

          min-height:
            42px !important;

          font-size:
            9px !important;
        }


        #manaV973Workout
        .mana-v973-finish{

          width:
            100% !important;

          min-height:
            46px !important;

          margin-top:
            5px !important;

          font-size:
            11px !important;
        }

      }

    `;


    document.head
      .appendChild(style);
  }


  /* =========================================
     DECORATE OVERVIEW
     ========================================= */

  function decorateOverview() {

    if (
      !isOverview()
    ) {

      return;
    }


    const holder =
      document.getElementById(
        "manaV83Content"
      );


    if (!holder) {

      return;
    }


    const hero =
      holder.querySelector(
        ".mana-v973-hero"
      );


    const heading =
      hero?.querySelector("h2");


    const copy =
      hero?.querySelector("p");


    if (
      isMana28()
    ) {

      if (heading) {

        heading.textContent =
          "Your Mana 28 Hub";

      }


      if (copy) {

        copy.textContent =
          "Everything important for your 28-day reset in one place. Choose where you want to go next.";

      }

    }


    if (
      isLyfe()
    ) {

      if (heading) {

        heading.textContent =
          "Your Mana Lyfe Hub";

      }


      if (copy) {

        copy.textContent =
          "Movement, mindset and daily action in one place. Choose what you need next.";

      }

    }


    holder
      .querySelectorAll(
        ".mana-v973-hub-card"
      )
      .forEach(
        card => {

          if (
            card.querySelector(
              ".mana-v974-icon"
            )
          ) {

            return;
          }


          const icon =
            document.createElement(
              "div"
            );


          icon.className =
            "mana-v974-icon";


          icon.textContent =
            ICONS[
              card.dataset
                .v973Tab
            ] || "M";


          card.prepend(icon);

        }
      );
  }


  /* =========================================
     FORCE MOBILE LAYOUT INLINE

     Extra protection against old rules
     winning after a dynamic redraw.
     ========================================= */

  function forceMobileOverview() {

    if (
      !isOverview() ||
      window.innerWidth > 700
    ) {

      return;
    }


    const grid =
      document.querySelector(
        "#manaV83Content " +
        ".mana-v973-grid"
      );


    if (grid) {

      grid.style.setProperty(
        "display",
        "grid",
        "important"
      );


      grid.style.setProperty(
        "grid-template-columns",
        "minmax(0,1fr)",
        "important"
      );


      grid.style.setProperty(
        "width",
        "100%",
        "important"
      );
    }


    document
      .querySelectorAll(
        "#manaV83Content " +
        ".mana-v973-hub-card"
      )
      .forEach(
        card => {

          card.style.setProperty(
            "width",
            "100%",
            "important"
          );


          card.style.setProperty(
            "min-width",
            "0",
            "important"
          );

        }
      );
  }


  /* =========================================
     WORKOUT POLISH
     ========================================= */

  function polishWorkout() {

    const modal =
      document.getElementById(
        "manaV973Workout"
      );


    if (
      !modal ||
      !modal.classList
        .contains("open")
    ) {

      return;
    }


    modal.style.setProperty(
      "position",
      "fixed",
      "important"
    );


    modal.style.setProperty(
      "inset",
      "0",
      "important"
    );


    modal.style.setProperty(
      "width",
      "100vw",
      "important"
    );


    modal.style.setProperty(
      "height",
      "100dvh",
      "important"
    );


    modal.style.setProperty(
      "padding",
      "0",
      "important"
    );


    document.body.style
      .overflow =
      "hidden";


    const shell =
      modal.querySelector(
        ".mana-v973-work-shell"
      );


    if (shell) {

      shell.style.setProperty(
        "width",
        "100vw",
        "important"
      );


      shell.style.setProperty(
        "height",
        "100dvh",
        "important"
      );


      shell.style.setProperty(
        "max-width",
        "none",
        "important"
      );
    }
  }


  /* =========================================
     CORE APPLY
     ========================================= */

  function apply() {

    installStyles();

    decorateOverview();

    forceMobileOverview();

    polishWorkout();
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
      350,
      700
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
     OBSERVERS
     ========================================= */

  function installObservers() {

    const holder =
      document.getElementById(
        "manaV83Content"
      );


    if (
      holder &&
      !observer
    ) {

      observer =
        new MutationObserver(
          () => {

            if (
              relevantProgram()
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


    const modal =
      document.getElementById(
        "manaV973Workout"
      );


    if (
      modal &&
      !modalObserver
    ) {

      modalObserver =
        new MutationObserver(
          scheduleApply
        );


      modalObserver.observe(
        modal,
        {
          childList:true,
          subtree:true,
          attributes:true,
          attributeFilter:[
            "class"
          ]
        }
      );
    }
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    installObservers();

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
              "#manaV83Tabs",
              "[data-v973-start]",
              "#manaV973Next",
              "#manaV973Prev"
            ].join(",")
          )
        ) {

          setTimeout(
            installObservers,
            30
          );


          scheduleApply();

        }

      },
      true
    );


    setInterval(
      () => {

        installObservers();


        if (
          relevantProgram() ||
          document
            .getElementById(
              "manaV973Workout"
            )
            ?.classList
            .contains("open")
        ) {

          apply();

        }

      },
      1000
    );


    window
      .MANA_28_LYFE_POLISH_BUILD =
      BUILD;


    window
      .refreshMana28LyfePolish =
      scheduleApply;


    console.log(
      "[Mana v9.74.1] persistent polish ready"
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
