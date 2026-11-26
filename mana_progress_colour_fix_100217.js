
/*
 MANA MOVEMENT
 PROGRESS COLOURS + COACH EXERCISE CARD MATCH
 COMPLETE BUILD 100219

 Full replacement:
 mana_progress_colour_fix_100217.js

 Visual-only update.
 No changes to workout data, saving,
 exercises, timers or navigation.
*/

(() => {
  "use strict";

  const BUILD = "100219";
  const STYLE_ID = "mana-progress-coach-card-style-100219";

  function install() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      /*
       PROGRESS SELECTORS
       White text / orange selected outline.
      */

      #m1002ProgressSwitch button {
        background:#17191c!important;
        border:1px solid transparent!important;
        color:#ffffff!important;
        -webkit-text-fill-color:#ffffff!important;
      }

      #m1002ProgressSwitch button.active {
        background:#251b15!important;
        border:1px solid #ff8126!important;
        color:#ffffff!important;
        -webkit-text-fill-color:#ffffff!important;
      }

      #m1002CoachProgress .mana-v993-detail-btn {
        background:#17191c!important;
        border:1px solid #383d44!important;
        color:#ffffff!important;
        -webkit-text-fill-color:#ffffff!important;
      }

      #m1002CoachProgress .mana-v993-detail-btn.active {
        background:#251b15!important;
        border:1px solid #ff8126!important;
        color:#ffffff!important;
        -webkit-text-fill-color:#ffffff!important;
      }

      /*
       COACH PROGRAM EXERCISE CARDS
       Larger, clearer and better spaced.
       Scoped to the Coach Programs modal.
      */

      #manaV1002CustomProgramModal .mana-v64-card {
        width:100%;
        box-sizing:border-box;
        padding:19px!important;
        border-radius:18px!important;
      }

      #manaV1002CustomProgramModal .mana-v64-name {
        font-size:20px!important;
        line-height:1.25!important;
        margin-bottom:9px!important;
      }

      #manaV1002CustomProgramModal .mana-v64-target {
        font-size:13px!important;
        line-height:1.5!important;
      }

      /*
       MUSCLE ILLUSTRATIONS

       Original automatic workout dimensions:
       Desktop: 150 x 150
       Tablet: 136 x 136
       Mobile: 125 x 125
       Small mobile: 112 x 112
      */

      #manaV1002CustomProgramModal .m1002-muscle {
        display:grid!important;
        grid-template-columns:
          150px minmax(0,1fr)!important;
        align-items:center!important;
        gap:16px!important;
        margin:12px 0 16px!important;
        padding:12px!important;
        border:1px solid #51412a!important;
        border-radius:18px!important;
        background:#0b0c0d!important;
        overflow:hidden;
      }

      #manaV1002CustomProgramModal .m1002-muscle-frame {
        display:grid!important;
        place-items:center!important;
        flex:none!important;
        width:150px!important;
        height:150px!important;
        min-width:0!important;
        box-sizing:border-box;
        border:1px solid #3b332a!important;
        border-radius:16px!important;
        background:#050505!important;
        box-shadow:0 8px 24px rgba(0,0,0,.28);
        overflow:hidden!important;
      }

      #manaV1002CustomProgramModal .m1002-muscle-frame img {
        display:block;
        width:100%!important;
        height:100%!important;
        max-width:100%!important;
        max-height:100%!important;
        object-fit:contain!important;
        object-position:center!important;
        border-radius:15px;
      }

      #manaV1002CustomProgramModal .m1002-muscle-copy {
        min-width:0!important;
        overflow-wrap:break-word;
      }

      #manaV1002CustomProgramModal .m1002-muscle-copy strong {
        color:#ffffff!important;
        font-size:16px!important;
        line-height:1.3!important;
        margin-top:6px;
      }

      #manaV1002CustomProgramModal .m1002-demo {
        display:block;
        max-width:100%;
        padding:11px 12px!important;
        margin-top:12px!important;
        font-size:12px!important;
      }

      /*
       SET INPUTS
       Slightly larger, preserving the
       existing four-column layout.
      */

      #manaV1002CustomProgramModal .mana-v64-table-head {
        font-size:12px!important;
      }

      #manaV1002CustomProgramModal .mana-v64-set input {
        min-height:44px!important;
      }

      /*
       TABLET
      */

      @media(max-width:760px) {
        #manaV1002CustomProgramModal .m1002-muscle {
          grid-template-columns:
            136px minmax(0,1fr)!important;
        }

        #manaV1002CustomProgramModal .m1002-muscle-frame {
          width:136px!important;
          height:136px!important;
        }
      }

      /*
       MOBILE
      */

      @media(max-width:600px) {
        #manaV1002CustomProgramModal .mana-v64-card {
          padding:16px!important;
        }

        #manaV1002CustomProgramModal .m1002-muscle {
          grid-template-columns:
            125px minmax(0,1fr)!important;
          gap:12px!important;
          padding:10px!important;
        }

        #manaV1002CustomProgramModal .m1002-muscle-frame {
          width:125px!important;
          height:125px!important;
        }

        #manaV1002CustomProgramModal .m1002-muscle-copy strong {
          font-size:15px!important;
        }
      }

      /*
       SMALL MOBILE
      */

      @media(max-width:420px) {
        #manaV1002CustomProgramModal .mana-v64-card {
          padding:15px!important;
        }

        #manaV1002CustomProgramModal .m1002-muscle {
          grid-template-columns:
            112px minmax(0,1fr)!important;
          gap:10px!important;
          padding:9px!important;
        }

        #manaV1002CustomProgramModal .m1002-muscle-frame {
          width:112px!important;
          height:112px!important;
        }

        #manaV1002CustomProgramModal .m1002-muscle-copy strong {
          font-size:14px!important;
        }

        #manaV1002CustomProgramModal .m1002-demo {
          padding:9px 7px!important;
          font-size:10px!important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      install,
      { once: true }
    );
  } else {
    install();
  }

  window.MANA_PROGRESS_COLOUR_FIX_BUILD = BUILD;

  console.log(
    "[Mana Movement] Coach Card Visual Match " + BUILD
  );
})();
