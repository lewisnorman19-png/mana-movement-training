/* =========================================
   MANA MOVEMENT TRAINING v9.74.0
   MANA 28 + MANA LYFE PREMIUM POLISH

   - MATCHES MANA STRENGTH OVERVIEW LANGUAGE
   - OPEN / CLEAN INTRO
   - PREMIUM LAUNCH CARDS
   - 2 COLUMN DESKTOP
   - 1 COLUMN MOBILE
   - FULL-SCREEN GUIDED DAY EXPERIENCE
   - EDGE-TO-EDGE MOBILE WORKOUT
   - KEEPS v9.73 PROGRAM LOGIC UNTOUCHED
   ========================================= */

(() => {
  "use strict";

  const BUILD = "97400";

  const STYLE_ID =
    "mana-v974-m28-lyfe-polish-style";


  /* =========================================
     PROGRAM HELPERS
     ========================================= */

  function shellOpen() {

    return Boolean(
      document
        .getElementById(
          "manaV83ProgramShell"
        )
        ?.classList
        .contains("open")
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


  function isMana28Overview() {

    return (
      shellOpen() &&
      title() === "MANA 28" &&
      tab() === "overview"
    );
  }


  function isLyfeOverview() {

    const t = title();

    return (
      shellOpen() &&
      (
        t === "MANA LYFE" ||
        t === "MANA LIFE"
      ) &&
      tab() === "overview"
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
         OVERVIEW INTRO
         MATCH STRENGTH STYLE
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

        color:
          #b8b8b8 !important;

        font-size:
          17px !important;

        line-height:
          1.6 !important;
      }


      /* =====================================
         OVERVIEW GRID
         ===================================== */

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

        max-width:
          860px !important;
      }


      /* =====================================
         PREMIUM HUB CARDS
         ===================================== */

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

        row-gap:
          0 !important;

        align-items:
          start !important;

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
          rgba(
            0,
            0,
            0,
            .22
          ),
          inset
          0
          1px
          0
          rgba(
            255,
            255,
            255,
            .02
          ) !important;

        transition:
          transform
          .14s
          ease,
          border-color
          .18s
          ease,
          box-shadow
          .18s
          ease !important;

        overflow:
          hidden !important;

        cursor:
          pointer !important;
      }


      #manaV83Content
      .mana-v973-hub-card::after{

        content:"";

        position:
          absolute;

        top:0;
        left:22px;
        right:22px;

        height:
          2px;

        background:
          linear-gradient(
            90deg,
            transparent,
            #d9ba55,
            transparent
          );

        opacity:
          .9;
      }


      #manaV83Content
      .mana-v973-hub-card:hover{

        transform:
          translateY(
            -2px
          ) !important;

        border-color:
          #7d6726 !important;

        box-shadow:
          0
          18px
          36px
          rgba(
            0,
            0,
            0,
            .28
          ),
          0
          0
          0
          1px
          rgba(
            217,
            186,
            85,
            .05
          )
          inset !important;
      }


      #manaV83Content
      .mana-v973-hub-card:active{

        transform:
          scale(
            .988
          ) !important;
      }


      /* icon inserted by JS */

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

        color:
          #111;

        font-size:
          20px;

        font-weight:
          950;

        box-shadow:
          0
          10px
          24px
          rgba(
            217,
            186,
            85,
            .16
          );
      }


      #manaV83Content
      .mana-v973-hub-card
      strong{

        grid-column:
          2;

        display:
          block !important;

        margin:0 !important;

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
          2;

        display:
          block !important;

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
          2;

        align-self:
          end;

        display:
          block !important;

        margin-top:
          16px !important;

        color:
          #f3d875 !important;

        font-size:
          13px !important;

        font-weight:
          950 !important;

        letter-spacing:
          .05em !important;
      }


      /* =====================================
         PROGRAM SCREEN POLISH
         ===================================== */

      #manaV83Content
      .mana-v973-program-head{

        max-width:
          860px;

        margin:
          0
          0
          20px !important;
      }


      #manaV83Content
      .mana-v973-program-head h2{

        margin:
          8px
          0
          8px !important;

        color:#fff;

        font-size:
          32px !important;

        font-weight:
          950 !important;

        line-height:
          1.05 !important;
      }


      #manaV83Content
      .mana-v973-program-head p{

        max-width:
          650px;

        color:
          #aaa !important;

        font-size:
          14px !important;

        line-height:
          1.55 !important;
      }


      #manaV83Content
      .mana-v973-days{

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

        box-shadow:
          0
          14px
          30px
          rgba(
            0,
            0,
            0,
            .18
          ) !important;
      }


      #manaV83Content
      .mana-v973-day h3{

        margin:
          9px
          0
          6px !important;

        font-size:
          27px !important;

        font-weight:
          950 !important;

        line-height:
          1.06 !important;
      }


      #manaV83Content
      .mana-v973-preview{

        margin-top:
          17px !important;
      }


      #manaV83Content
      .mana-v973-preview-row{

        padding:
          10px
          0 !important;

        font-size:
          13px !important;
      }


      #manaV83Content
      .mana-v973-start{

        min-height:
          52px !important;

        margin-top:
          18px !important;

        border-radius:
          15px !important;

        font-size:
          13px !important;
      }


      /* =====================================
         FULL-SCREEN GUIDED WORKOUT
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
          100% !important;

        max-width:
          none !important;

        height:
          100vh !important;

        height:
          100dvh !important;

        margin:
          0 !important;

        display:
          grid !important;

        grid-template-rows:
          auto
          auto
          minmax(
            0,
            1fr
          )
          auto
          auto !important;

        padding:
          calc(
            env(
              safe-area-inset-top
            )
            +
            14px
          )
          18px
          calc(
            env(
              safe-area-inset-bottom
            )
            +
            14px
          ) !important;

        box-sizing:
          border-box !important;

        background:
          radial-gradient(
            circle
            at
            top,
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


      /* =====================================
         FULL PAGE HEADER
         ===================================== */

      #manaV973Workout
      .mana-v973-work-head{

        width:
          min(
            920px,
            100%
          );

        margin:
          0
          auto;

        padding:
          0
          0
          12px !important;

        display:
          flex !important;

        justify-content:
          space-between !important;

        align-items:
          flex-start !important;

        gap:
          16px !important;

        border-bottom:
          1px solid
          #24231e;
      }


      #manaV973Workout
      .mana-v973-work-head h2{

        margin:
          5px
          0
          0 !important;

        color:#fff;

        font-size:
          30px !important;

        font-weight:
          950 !important;

        line-height:
          1.04 !important;
      }


      #manaV973Workout
      .mana-v973-close{

        width:
          44px !important;

        height:
          44px !important;

        flex:
          0
          0
          44px !important;

        border:
          1px solid
          #393939 !important;

        background:
          #111 !important;
      }


      #manaV973Workout
      .mana-v973-page-counter{

        width:
          min(
            920px,
            100%
          );

        margin:
          10px
          auto
          0 !important;

        color:
          #d6b958 !important;

        font-size:
          11px !important;

        font-weight:
          950 !important;

        letter-spacing:
          .12em !important;
      }


      /* =====================================
         FULL PAGE SWIPE AREA
         ===================================== */

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
          10px
          auto
          0 !important;

        display:
          flex !important;

        align-items:
          stretch !important;

        gap:
          0 !important;

        overflow-x:
          auto !important;

        overflow-y:
          hidden !important;

        scroll-snap-type:
          x mandatory !important;

        -webkit-overflow-scrolling:
          touch;

        scrollbar-width:
          none;
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

        max-width:
          100% !important;

        min-height:
          100% !important;

        margin:
          0 !important;

        padding:
          clamp(
            28px,
            5vw,
            52px
          ) !important;

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

        scroll-snap-stop:
          always !important;
      }


      #manaV973Workout
      .mana-v973-task-label{

        color:
          #d7ba59 !important;

        font-size:
          11px !important;

        font-weight:
          950 !important;

        letter-spacing:
          .14em !important;
      }


      #manaV973Workout
      .mana-v973-task h3{

        max-width:
          760px;

        margin:
          14px
          0
          8px !important;

        color:#fff;

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
          clamp(
            20px,
            3vw,
            26px
          ) !important;

        font-weight:
          950 !important;
      }


      #manaV973Workout
      .mana-v973-simple-copy{

        max-width:
          650px;

        margin-top:
          22px !important;

        color:
          #aaa !important;

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

        border-radius:
          15px !important;

        font-size:
          13px !important;
      }


      /* =====================================
         BOTTOM CONTROLS
         ===================================== */

      #manaV973Workout
      .mana-v973-navigation{

        width:
          min(
            920px,
            100%
          );

        display:
          grid !important;

        grid-template-columns:
          1fr
          1fr !important;

        gap:
          10px !important;

        margin:
          10px
          auto
          0 !important;
      }


      #manaV973Workout
      .mana-v973-nav{

        min-height:
          48px !important;

        border-radius:
          14px !important;

        font-size:
          11px !important;
      }


      #manaV973Workout
      .mana-v973-finish{

        width:
          min(
            920px,
            100%
          ) !important;

        min-height:
          52px !important;

        margin:
          8px
          auto
          0 !important;

        border-radius:
          14px !important;

        font-size:
          13px !important;
      }


      /* =====================================
         MOBILE
         ===================================== */

      @media(max-width:700px){

        #manaV83Content
        .mana-v973-hero{

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

          grid-template-columns:
            1fr !important;

          gap:
            14px !important;
        }


        #manaV83Content
        .mana-v973-hub-card{

          min-height:
            164px !important;

          grid-template-columns:
            56px
            minmax(
              0,
              1fr
            ) !important;

          column-gap:
            15px !important;

          padding:
            20px !important;
        }


        .mana-v974-icon{

          width:
            56px;

          height:
            56px;

          font-size:
            18px;

          border-radius:
            17px;
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
        .mana-v973-hub-card
        b{

          font-size:
            12px !important;
        }


        /* program */

        #manaV83Content
        .mana-v973-program-head h2{

          font-size:
            29px !important;
        }


        #manaV83Content
        .mana-v973-day{

          flex:
            0
            0
            94% !important;

          padding:
            19px !important;
        }


        #manaV83Content
        .mana-v973-day h3{

          font-size:
            24px !important;
        }


        /* ===================================
           MOBILE FULL SCREEN SESSION
           =================================== */

        #manaV973Workout
        .mana-v973-work-shell{

          padding:
            calc(
              env(
                safe-area-inset-top
              )
              +
              8px
            )
            12px
            calc(
              env(
                safe-area-inset-bottom
              )
              +
              10px
            ) !important;
        }


        #manaV973Workout
        .mana-v973-work-head{

          padding-bottom:
            8px !important;
        }


        #manaV973Workout
        .mana-v973-work-head h2{

          font-size:
            22px !important;
        }


        #manaV973Workout
        .mana-v973-close{

          width:
            38px !important;

          height:
            38px !important;

          flex-basis:
            38px !important;
        }


        #manaV973Workout
        .mana-v973-page-counter{

          margin-top:
            7px !important;

          font-size:
            9px !important;
        }


        #manaV973Workout
        .mana-v973-pages{

          margin-top:
            5px !important;
        }


        #manaV973Workout
        .mana-v973-task{

          min-height:
            100% !important;

          padding:
            18px
            8px !important;

          justify-content:
            center !important;
        }


        #manaV973Workout
        .mana-v973-task-label{

          font-size:
            9px !important;
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
            16px !important;

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
            20px !important;

          font-size:
            11px !important;
        }


        #manaV973Workout
        .mana-v973-navigation{

          gap:
            7px !important;

          margin-top:
            6px !important;
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

          min-height:
            46px !important;

          margin-top:
            6px !important;

          font-size:
            11px !important;
        }

      }

    `;


    document.head
      .appendChild(style);
  }


  /* =========================================
     OVERVIEW DECORATION
     ========================================= */

  function decorateOverview() {

    if (
      !isMana28Overview() &&
      !isLyfeOverview()
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


    /*
      Match Strength overview copy.
    */

    const hero =
      holder.querySelector(
        ".mana-v973-hero"
      );


    const heading =
      hero?.querySelector(
        "h2"
      );


    const copy =
      hero?.querySelector(
        "p"
      );


    if (
      isMana28Overview()
    ) {

      if (heading) {

        heading.textContent =
          "Your Mana 28 Hub";

      }


      if (copy) {

        copy.textContent =
          "Everything you need for the next 28 days. Choose where you want to go next.";

      }

    }


    if (
      isLyfeOverview()
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


    /*
      Add Strength-style icon block.
    */

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


          const type =
            card.dataset
              .v973Tab ||
            "";


          const icon =
            document.createElement(
              "div"
            );


          icon.className =
            "mana-v974-icon";


          icon.textContent =
            ICONS[type] ||
            "M";


          card.prepend(icon);

        }
      );
  }


  /* =========================================
     FULLSCREEN WORKOUT STABILITY
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


    /*
      Always reset modal scroll position.
      Individual exercise paging remains
      horizontal only.
    */

    modal.scrollTop =
      0;


    document.body.style
      .overflow =
      "hidden";
  }


  /* =========================================
     REFRESH
     ========================================= */

  function refresh() {

    installStyles();


    [
      30,
      120,
      280
    ].forEach(
      delay => {

        setTimeout(
          () => {

            decorateOverview();

            polishWorkout();

          },
          delay
        );

      }
    );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    refresh();


    window.addEventListener(
      "mana:program-tab-change",
      refresh
    );


    window.addEventListener(
      "mana:v973-updated",
      refresh
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

          refresh();

        }

      },
      true
    );


    window
      .MANA_28_LYFE_POLISH_BUILD =
      BUILD;


    window
      .refreshMana28LyfePolish =
      refresh;


    console.log(
      "[Mana v9.74.0] Mana 28 + Lyfe polish ready"
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
