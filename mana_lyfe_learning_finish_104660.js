
/* =====================================================
   MANA MOVEMENT TRAINING
   MANA LYFE — LEARNING FINAL COLOURS
   BUILD 104660

   COMPLETE FILE:
   mana_lyfe_learning_finish_104660.js

   FIXES:
   - Te Reo Māori phrases: orange
   - English translations: silver
   - Learning dropdown arrows: orange
   - Learning card backgrounds: charcoal
   - Learning card borders: white/silver
   - No yellow or gold in Learning

   PRESERVES:
   - All Māori phrases and translations
   - All learning content
   - Accordion opening and closing
   - Existing fonts and text sizes
   - Mobile layouts
   - All other Mana Movement programs
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "104660";
  const STYLE_ID = "manaLyfeLearningFinish104660";

  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_ID;

  style.textContent = `

    /* =====================================
       MANA LYFE LEARNING ONLY
       ===================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    .mana-v984-root {

      --learning-orange: #FF7927;
      --learning-white: #FFFFFF;
      --learning-silver: #C1C6CE;
      --learning-surface: #15171A;
    }

    /* =====================================
       LEARNING SECTION PANELS
       ===================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    .mana-v984-panel {

      background: #15171A !important;
      background-image: none !important;

      border: 1px solid #626973 !important;
      box-shadow: none !important;
    }

    /* =====================================
       SMALL SECTION LABELS
       ===================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    .mana-v984-small-label {

      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    /* =====================================
       TE REO MĀORI — EVERYDAY

       Keep the original size and layout.
       ===================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    .mana-v984-phrase {

      background: #090B0D !important;
      background-image: none !important;

      border: 1px solid #454B53 !important;
      box-shadow: none !important;
    }

    /* Māori phrases — orange */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    .mana-v984-phrase strong {

      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    /* English descriptions — silver */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    .mana-v984-phrase span {

      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    /* =====================================
       LYFE PRINCIPLES — EXPANDABLE LESSONS
       ===================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    .mana-v984-accordion {

      border: 1px solid #626973 !important;
      background: #15171A !important;
      background-image: none !important;
      box-shadow: none !important;
    }

    /* Lesson titles stay white */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    .mana-v984-accordion > button strong {

      color: #FFFFFF !important;
      -webkit-text-fill-color: #FFFFFF !important;
    }

    /* Dropdown arrows become orange */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    .mana-v984-accordion > button span {

      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
    }

    /* Expanded lesson text stays silver */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    .mana-v984-accordion-body {

      color: #C1C6CE !important;
      -webkit-text-fill-color: #C1C6CE !important;
    }

    /* =====================================
       KEYBOARD ACCESSIBILITY
       ===================================== */

    #manaV83ProgramShell.mana-lyfe-premium-104580
    #manaV83Content
    .mana-v984-accordion > button:focus-visible {

      outline: 2px solid #FF7927 !important;
      outline-offset: 3px !important;
    }

  `;

  document.head.appendChild(style);

  console.log(
    "[ManaLyfe] Learning final colours " + BUILD
  );

})();
