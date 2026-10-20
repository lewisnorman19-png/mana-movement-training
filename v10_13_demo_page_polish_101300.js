/* =========================================
   MANA MOVEMENT TRAINING v10.13.0
   PREMIUM DEMO PAGE POLISH

   BUILD: 101300

   PURPOSE
   -----------------------------------------
   - Keep working mobile workout untouched
   - Rename FORM GUIDE popup to DEMO
   - Remove REPLAY button
   - Remove duplicated single cue
   - Make PLAY DEMO full width
   - Enlarge demo artwork
   - Merge Key Cues into demo panel
   - Cleaner premium phone experience
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "101300";


  const STYLE_ID =
    "mana-v10130-demo-page-polish-style";


  const GUIDE_ID =
    "manaV970FormGuide";


  let guideObserver =
    null;


  let polishTimer =
    null;


  /* =========================================
     HELPERS
     ========================================= */

  function $(id) {

    return document.getElementById(
      id
    );

  }


  /* =========================================
     STYLES
     ========================================= */

  function installStyles() {

    $(
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
         MAIN DEMO WINDOW
         ===================================== */

      #${GUIDE_ID}
      .m10116-guide{

        width:
          min(
            820px,
            calc(100vw - 24px)
          )
          !important;

        padding:
          20px
          !important;

      }


      /* =====================================
         BIGGER DEMO
         ===================================== */

      #${GUIDE_ID}
      .m10111-stage{

        height:
          520px
          !important;

        background:
          radial-gradient(
            circle
            at
            50%
            46%,
            rgba(
              215,
              175,
              54,
              .11
            ),
            transparent
            58%
          ),
          #050505
          !important;

      }


      #${GUIDE_ID}
      .m10111-frame{

        object-fit:
          contain
          !important;

      }


      /* =====================================
         ONE CLEAN CONTROL
         ===================================== */

      #${GUIDE_ID}
      .m10111-controls{

        display:block
          !important;

        padding:
          12px
          !important;

        border-top:
          1px solid
          #272116
          !important;

        background:
          #0b0a07
          !important;

      }


      #${GUIDE_ID}
      .m10111-control{

        width:
          100%
          !important;

        min-height:
          48px
          !important;

      }


      /*
        Replay is the second control.
        JS also removes it completely.
      */

      #${GUIDE_ID}
      .m10111-control:nth-of-type(2){

        display:
          none
          !important;

      }


      /*
        Old one-line cue beneath
        Play Demo is duplicated by
        Key Cues below.
      */

      #${GUIDE_ID}
      .m10111-cue{

        display:
          none
          !important;

      }


      /* =====================================
         KEY CUES NOW PART OF DEMO PANEL
         ===================================== */

      #${GUIDE_ID}
      .m10111-player
      .m10116-coaching{

        margin:
          0
          !important;

        padding:
          18px
          18px
          20px
          !important;

        border:
          0
          !important;

        border-top:
          1px solid
          #292317
          !important;

        border-radius:
          0
          !important;

        background:
          #0b0a07
          !important;

      }


      #${GUIDE_ID}
      .m10116-coaching h3{

        margin:
          0
          0
          12px
          !important;

        color:
          #e9c95b
          !important;

        font-size:
          13px
          !important;

        font-weight:
          950
          !important;

        letter-spacing:
          .08em
          !important;

        text-transform:
          uppercase
          !important;

      }


      #${GUIDE_ID}
      .m10116-coaching ul{

        margin:
          0
          !important;

        padding-left:
          19px
          !important;

      }


      #${GUIDE_ID}
      .m10116-coaching li{

        margin:
          7px
          0
          !important;

        color:
          #d5d5d5
          !important;

        font-size:
          12px
          !important;

        line-height:
          1.45
          !important;

      }


      #${GUIDE_ID}
      .m10116-avoid{

        margin-top:
          14px
          !important;

        padding-top:
          13px
          !important;

        border-top:
          1px solid
          #2a261d
          !important;

      }


      /* =====================================
         PHONE
         ===================================== */

      @media(max-width:600px){

        #${GUIDE_ID}
        .m10116-guide{

          width:
            calc(
              100vw - 12px
            )
            !important;

          max-height:
            calc(
              100vh - 12px
            )
            !important;

          padding:
            13px
            !important;

          border-radius:
            18px
            !important;

        }


        #${GUIDE_ID}
        .m10116-head{

          margin-bottom:
            12px
            !important;

        }


        #${GUIDE_ID}
        .m10116-title{

          font-size:
            23px
            !important;

        }


        #${GUIDE_ID}
        .m10111-stage{

          height:
            445px
            !important;

        }


        #${GUIDE_ID}
        .m10111-controls{

          padding:
            10px
            !important;

        }


        #${GUIDE_ID}
        .m10116-coaching{

          padding:
            15px
            14px
            17px
            !important;

        }

      }


      /* =====================================
         NARROW PHONE
         ===================================== */

      @media(max-width:420px){

        #${GUIDE_ID}
        .m10111-stage{

          height:
            410px
            !important;

        }


        #${GUIDE_ID}
        .m10116-title{

          font-size:
            21px
            !important;

        }


        #${GUIDE_ID}
        .m10111-control{

          min-height:
            46px
            !important;

        }

      }


      /* =====================================
         VERY SMALL PHONE
         ===================================== */

      @media(max-width:360px){

        #${GUIDE_ID}
        .m10111-stage{

          height:
            375px
            !important;

        }

      }

    `;


    document.head.appendChild(
      style
    );

  }


  /* =========================================
     POLISH CURRENT DEMO
     ========================================= */

  function polishGuide() {

    const modal =
      $(
        GUIDE_ID
      );


    if (!modal) {

      return;

    }


    /*
      Rename popup heading.
    */

    const kicker =
      modal.querySelector(
        ".m10116-kicker"
      );


    if (kicker) {

      kicker.textContent =
        "DEMO";

    }


    /*
      Remove Replay entirely.
    */

    const controls =
      modal.querySelector(
        ".m10111-controls"
      );


    if (controls) {

      const buttons =
        controls.querySelectorAll(
          ".m10111-control"
        );


      if (
        buttons.length >
        1
      ) {

        for (
          let i = 1;
          i < buttons.length;
          i += 1
        ) {

          buttons[i].remove();

        }

      }


      /*
        Remove duplicated single cue.
      */

      controls
        .querySelector(
          ".m10111-cue"
        )
        ?.remove();

    }


    /*
      Move full coaching section directly
      inside the demo player.

      Result:

      VIDEO
      PLAY DEMO
      KEY CUES
      AVOID

      All one clean premium panel.
    */

    const player =
      modal.querySelector(
        ".m10111-player"
      );


    const coaching =
      modal.querySelector(
        ".m10116-coaching"
      );


    if (
      player &&
      coaching &&
      coaching.parentElement !==
      player
    ) {

      player.appendChild(
        coaching
      );

    }

  }


  /* =========================================
     LIGHT TARGETED REFRESH
     ========================================= */

  function schedulePolish(
    delay = 30
  ) {

    clearTimeout(
      polishTimer
    );


    polishTimer =
      setTimeout(
        polishGuide,
        delay
      );

  }


  /* =========================================
     WATCH DEMO MODAL ONLY

     No page observer.
     No workout observer.
     ========================================= */

  function attachGuideObserver() {

    const modal =
      $(
        GUIDE_ID
      );


    if (!modal) {

      return false;

    }


    guideObserver
      ?.disconnect();


    guideObserver =
      new MutationObserver(
        () => {

          schedulePolish(
            20
          );

        }
      );


    guideObserver.observe(
      modal,
      {

        childList:
          true,

        subtree:
          true

      }
    );


    polishGuide();


    return true;

  }


  /* =========================================
     DEMO OPEN EVENT

     Wait for universal player to render,
     then polish it.
     ========================================= */

  function bindDemoOpening() {

    document.addEventListener(

      "click",

      event => {

        if (
          !event.target.closest(
            "[data-v970-guide]"
          )
        ) {

          return;

        }


        /*
          Demo modal already exists from
          v9.70, but universal content loads
          asynchronously.
        */

        setTimeout(
          () => {

            attachGuideObserver();

            polishGuide();

          },
          40
        );


        setTimeout(
          polishGuide,
          180
        );


        setTimeout(
          polishGuide,
          500
        );

      }

    );

  }


  /* =========================================
     BUILD MARKER
     ========================================= */

  function exposeBuild() {

    window
      .MANA_DEMO_PAGE_POLISH_BUILD =
      BUILD;

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    exposeBuild();

    bindDemoOpening();


    /*
      Modal normally already exists.
    */

    attachGuideObserver();


    console.log(
      "Mana Premium Demo Page",
      BUILD
    );

  }


  /* =========================================
     BOOT
     ========================================= */

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
