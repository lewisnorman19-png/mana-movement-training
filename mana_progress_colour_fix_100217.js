
/*
 MANA MOVEMENT
 PROGRESS SELECTOR COLOUR FIX
 BUILD 100217

 Complete standalone file.
 Does not modify workouts, progress data,
 navigation, or saved records.
*/

(() => {
  "use strict";

  const STYLE_ID = "mana-progress-colour-fix-100217";

  function install() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      /* My Workouts / Coach Programs */
      #m1002ProgressSwitch button {
        background:#17191c!important;
        border:1px solid transparent!important;
        color:#ffffff!important;
        -webkit-text-fill-color:#ffffff!important;
      }

      /* Selected tab: orange border, white text */
      #m1002ProgressSwitch button.active {
        background:#251b15!important;
        border:1px solid #ff8126!important;
        color:#ffffff!important;
        -webkit-text-fill-color:#ffffff!important;
      }
    `;

    document.head.appendChild(style);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      install,
      { once:true }
    );
  } else {
    install();
  }

  window.MANA_PROGRESS_COLOUR_FIX_BUILD = "100217";
})();
