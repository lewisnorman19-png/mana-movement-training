
/* ==========================================
   MANA MOVEMENT TRAINING
   MANA 28 LEARNING GOLD
   BUILD 103090

   Match Mana Strength Learning:
   - Premium gold borders
   - Gold, white and grey text
   - No orange card accents
   - Preserve learning interactions
   ========================================== */

(() => {
  "use strict";

  const STYLE_ID = "mana28-learning-gold-103090";

  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;

  style.textContent = `

    :root {
      --m28-gold: #f3d875;
      --m28-border: rgba(230,189,72,.68);
    }

    /* Learning card outlines */

    #manaV83Content
    .mana-v927-learn-item,

    #manaV83Content
    .mana-v985-learn-card,

    #manaV83Content
    .mana-v985-learn-button {

      border-color:
        var(--m28-border) !important;

      border-width: 1px !important;

      box-shadow: none !important;

    }

    /* Learning headings */

    #manaV83Content
    .mana-v985-kicker,

    #manaV83Content
    .mana-v927-learn-open,

    #manaV83Content
    .mana-v985-learn-button
    > span:last-child {

      color: var(--m28-gold) !important;

    }

    /* Learning body copy */

    #manaV83Content
    .mana-v927-learn-body {

      color: #aaa !important;

    }

    /* Header decorative line */

    #manaV83Content
    .mana-v985-head {

      border-bottom-color:
        var(--m28-border) !important;

    }

    #manaV83Content
    .mana-v985-head::after {

      background: linear-gradient(
        90deg,
        var(--m28-gold),
        transparent
      ) !important;

    }

    /* Preserve card behaviour */

  `;

  document.head.appendChild(style);

  window.MANA28_LEARNING_GOLD_BUILD = "103090";

})();
