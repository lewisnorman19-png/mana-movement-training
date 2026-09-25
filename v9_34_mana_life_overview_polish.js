/* =========================================
   MANA MOVEMENT TRAINING v9.34.1
   MANA LIFE — OVERVIEW POLISH

   PURPOSE:
   - Tighten Overview spacing
   - Improve phone + laptop margins
   - Align yellow affirmation + whakataukī lines
   - Keep readable text sizes
   - Does NOT affect Routine / Reclaim /
     Progress / Learn
   - Does NOT affect Mana Strength / Mana 28
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "93410";

  const STYLE_ID =
    "mana-v934-life-overview-style";

  const OVERVIEW_CLASS =
    "mana-v934-life-overview";


  function lifeOverviewOpen() {
    const shell =
      document.getElementById(
        "manaV83ProgramShell"
      );

    const title =
      document.getElementById(
        "manaV83Title"
      );

    const activeTab =
      document
        .querySelector(
          "#manaV83Tabs .mana-v83-tab.active"
        )
        ?.dataset
        ?.v83Tab;


    return Boolean(

      shell
        ?.classList
        .contains(
          "open"
        ) &&

      title
        ?.textContent
        ?.trim()
        ?.toUpperCase() ===
        "MANA LIFE" &&

      (
        !activeTab ||
        activeTab ===
          "overview"
      )

    );
  }


  function injectStyles() {
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

      /*
        OVERVIEW ONLY
      */

      #manaV83ProgramShell
      .${OVERVIEW_CLASS}{
        padding-top:0;
      }


      #manaV83ProgramShell
      .${OVERVIEW_CLASS}
      .mana-v933-hero{
        margin:
          4px
          0
          9px;

        padding:
          22px
          20px;
      }


      /*
        ALIGN BOTH GOLD VERTICAL LINES

        Hero text begins 20px in.
        The affirmation sits inside the hero,
        so its line naturally begins at that
        same 20px position.

        The whakataukī sits outside the hero,
        so give it a matching 20px left inset.
      */

     #manaV83ProgramShell
.${OVERVIEW_CLASS}
.mana-v933-whakatauki{
  margin:
    9px
    0;

  padding:
    15px
    18px
    15px
    38px;
}


      #manaV83ProgramShell
      .${OVERVIEW_CLASS}
      .mana-v933-card{
        margin:
          9px
          0;

        padding:
          17px
          18px;
      }


      #manaV83ProgramShell
      .${OVERVIEW_CLASS}
      .mana-v933-grid{
        margin:
          9px
          0;

        gap:9px;
      }


      #manaV83ProgramShell
      .${OVERVIEW_CLASS}
      .mana-v933-stat{
        padding:
          14px
          16px;
      }


      #manaV83ProgramShell
.${OVERVIEW_CLASS}
.mana-v933-affirmation{
  margin-top:13px;

  border-left:none;

  padding:
    15px
    17px;
}


      #manaV83ProgramShell
      .${OVERVIEW_CLASS}
      .mana-v933-progress-row{
        margin:
          12px
          0
          7px;
      }


      #manaV83ProgramShell
      .${OVERVIEW_CLASS}
      .mana-v933-primary,

      #manaV83ProgramShell
      .${OVERVIEW_CLASS}
      .mana-v933-secondary{
        margin-top:11px;
      }


      /*
        Laptop / larger screen
      */

      @media(
        min-width:700px
      ){

        #manaV83ProgramShell
        .mana-v83-shell:has(
          .${OVERVIEW_CLASS}
        ){
          width:
            min(
              620px,
              100%
            );
        }

      }


      /*
        PHONE
      */

      @media(
        max-width:560px
      ){

        #manaV83ProgramShell:has(
          .${OVERVIEW_CLASS}
        ){
          padding-left:12px;
          padding-right:12px;
        }


        #manaV83ProgramShell
        .${OVERVIEW_CLASS}
        .mana-v933-hero{
          margin-top:0;

          padding:
            19px
            16px;

          border-radius:
            20px;
        }


        /*
          Hero text now starts 16px in,
          so match the whakataukī line
          to 16px on phone.
        */

        #manaV83ProgramShell
        .${OVERVIEW_CLASS}
        .mana-v933-whakatauki{
          margin:
            8px
            0
            8px
            16px;

          padding:
            14px
            15px;
        }


        #manaV83ProgramShell
        .${OVERVIEW_CLASS}
        .mana-v933-card{
          margin:
            8px
            0;

          padding:
            16px;
        }


        #manaV83ProgramShell
        .${OVERVIEW_CLASS}
        .mana-v933-grid{
          margin:
            8px
            0;
        }


        #manaV83ProgramShell
        .${OVERVIEW_CLASS}
        .mana-v933-affirmation{
          margin-top:12px;

          padding:
            14px
            15px;
        }

      }


      /*
        Very narrow phone
      */

      @media(
        max-width:390px
      ){

        #manaV83ProgramShell:has(
          .${OVERVIEW_CLASS}
        ){
          padding-left:10px;
          padding-right:10px;
        }


        #manaV83ProgramShell
        .${OVERVIEW_CLASS}
        .mana-v933-hero{
          padding:
            18px
            15px;
        }


        /*
          Hero text begins 15px in here,
          so keep the two yellow lines
          visually aligned.
        */

        #manaV83ProgramShell
        .${OVERVIEW_CLASS}
        .mana-v933-whakatauki{
          margin-left:
            15px;
        }


        #manaV83ProgramShell
        .${OVERVIEW_CLASS}
        .mana-v933-card{
          padding:
            15px;
        }


        #manaV83ProgramShell
        .${OVERVIEW_CLASS}
        .mana-v933-grid{
          gap:8px;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  function applyOverviewClass() {
    const root =
      document.getElementById(
        "manaV933Life"
      );


    if (!root) {
      return;
    }


    root.classList.remove(
      OVERVIEW_CLASS
    );


    if (
      lifeOverviewOpen()
    ) {

      root.classList.add(
        OVERVIEW_CLASS
      );

    }
  }


  function refresh(
    delay = 30
  ) {
    setTimeout(
      applyOverviewClass,
      delay
    );
  }


  function init() {
    injectStyles();


    window.addEventListener(
      "mana:program-tab-change",
      () => {

        refresh(
          30
        );

      }
    );


    window.addEventListener(
      "mana:life-updated",
      () => {

        refresh(
          40
        );

      }
    );


    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "#manaV80Life"
          )
        ) {

          refresh(
            120
          );

        }

      },
      true
    );


    refresh(
      100
    );
  }


  window.MANA_LIFE_OVERVIEW_POLISH_BUILD =
    BUILD;


  if (
    document.readyState ===
      "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {

    init();
  }

})();
