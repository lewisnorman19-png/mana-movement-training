/* =========================================
   MANA MOVEMENT TRAINING v9.45.0
   FUEL — TODAY'S MEALS TIDY

   - Cleaner logged meal rows
   - Stronger calories / protein display
   - Smaller Change / Remove controls
   - Better meal group separation
   - More bottom clearance above nav
   - No storage or database changes
   ========================================= */

(() => {
  "use strict";

  const STYLE_ID =
    "mana-v945-fuel-today-style";

  const CONTENT_ID =
    "manaV83Content";

  const BUILD =
    "94500";


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

      /* =====================================
         FUEL PAGE BOTTOM CLEARANCE
         ===================================== */

      #${CONTENT_ID}
      .mana-v897-root{
        padding-bottom:
          calc(
            110px +
            env(
              safe-area-inset-bottom
            )
          );
      }


      /* =====================================
         TODAY'S MEALS CARD
         ===================================== */

      #${CONTENT_ID}
      .mana-v897-today{
        margin-bottom:8px !important;

        border-color:#303030;

        background:
          linear-gradient(
            145deg,
            #101010,
            #070707
          );
      }


      #${CONTENT_ID}
      .mana-v897-today-head{
        padding:
          19px
          18px
          15px;
      }


      #${CONTENT_ID}
      .mana-v897-today-head h3{
        font-size:20px;
      }


      #${CONTENT_ID}
      .mana-v897-today-head
      .mana-v897-sub{
        margin:
          6px
          0
          0;

        color:#7f7f7f;

        font-size:11px;
      }


      /* =====================================
         MEAL GROUPS
         ===================================== */

      #${CONTENT_ID}
      .mana-v897-meal-group{
        padding:
          15px
          18px;

        border-top:
          1px solid
          #242424;
      }


      #${CONTENT_ID}
      .mana-v897-meal-group:first-of-type{
        border-top:
          1px solid
          #2c2c2c;
      }


      #${CONTENT_ID}
      .mana-v897-meal-heading{
        margin-bottom:9px;

        color:#f3d875;

        font-size:11px;

        font-weight:900;

        letter-spacing:.10em;

        text-transform:uppercase;
      }


      #${CONTENT_ID}
      .mana-v897-empty{
        padding:
          3px
          0;

        color:#5f5f5f;

        font-size:11px;

        font-style:italic;
      }


      /* =====================================
         LOGGED MEAL ROW
         ===================================== */

      #${CONTENT_ID}
      .mana-v897-item{
        grid-template-columns:
          minmax(
            0,
            1fr
          )
          auto;

        gap:12px;

        align-items:center;

        padding:
          12px
          0;

        border-top:
          1px solid
          #1f1f1f;
      }


      #${CONTENT_ID}
      .mana-v897-item:first-of-type{
        border-top:0;
      }


      #${CONTENT_ID}
      .mana-v897-food{
        min-width:0;
      }


      #${CONTENT_ID}
      .mana-v897-food strong{
        display:block;

        color:#fff;

        font-size:14px;

        font-weight:800;

        line-height:1.3;
      }


      #${CONTENT_ID}
      .mana-v897-food span{
        display:inline-flex;

        align-items:center;

        gap:6px;

        margin-top:6px;

        padding:
          5px
          8px;

        border:
          1px solid
          #393319;

        border-radius:999px;

        background:#11100b;

        color:#d9c46e;

        font-size:10px;

        font-weight:800;

        line-height:1;
      }


      /* =====================================
         CHANGE / REMOVE
         ===================================== */

      #${CONTENT_ID}
      .mana-v897-actions{
        display:flex;

        gap:5px;

        align-items:center;
      }


      #${CONTENT_ID}
      .mana-v897-action{
        min-height:31px;

        padding:
          0
          9px;

        border:
          1px solid
          #343434;

        border-radius:9px;

        background:#0e0e0e;

        color:#8f8f8f;

        font-size:9px;

        font-weight:800;

        touch-action:
          manipulation;
      }


      #${CONTENT_ID}
      .mana-v897-action.change{
        border-color:#55491e;

        background:#141208;

        color:#f3d875;
      }


      #${CONTENT_ID}
      .mana-v897-action.remove{
        border-color:#3b2929;

        color:#b88c8c;
      }


      #${CONTENT_ID}
      .mana-v897-action:active{
        transform:
          scale(.97);
      }


      /* =====================================
         PHONE
         ===================================== */

      @media(
        max-width:600px
      ){

        #${CONTENT_ID}
        .mana-v897-root{
          padding-bottom:
            calc(
              130px +
              env(
                safe-area-inset-bottom
              )
            );
        }


        #${CONTENT_ID}
        .mana-v897-today-head{
          padding:
            17px
            16px
            13px;
        }


        #${CONTENT_ID}
        .mana-v897-meal-group{
          padding:
            14px
            16px;
        }


        #${CONTENT_ID}
        .mana-v897-item{
          gap:9px;

          padding:
            11px
            0;
        }


        #${CONTENT_ID}
        .mana-v897-food strong{
          font-size:13px;
        }


        #${CONTENT_ID}
        .mana-v897-food span{
          margin-top:5px;

          padding:
            5px
            7px;

          font-size:9px;
        }


        #${CONTENT_ID}
        .mana-v897-actions{
          gap:4px;
        }


        #${CONTENT_ID}
        .mana-v897-action{
          min-height:30px;

          padding:
            0
            7px;

          font-size:8px;
        }

      }


      /* =====================================
         SMALL PHONE
         ===================================== */

      @media(
        max-width:370px
      ){

        #${CONTENT_ID}
        .mana-v897-item{
          grid-template-columns:
            1fr;
        }


        #${CONTENT_ID}
        .mana-v897-actions{
          justify-content:flex-start;

          margin-top:2px;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  function init() {
    injectStyles();
  }


  window.MANA_FUEL_TODAY_BUILD =
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
