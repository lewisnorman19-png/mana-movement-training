/* =========================================
   MANA MOVEMENT TRAINING v9.43.0
   MANA STRENGTH — FUEL CARD POLISH

   - Cleaner Fuel page hierarchy
   - Stronger Daily Progress card
   - Compact Balance card
   - New Add A Meal presentation
   - Presets + custom meal clearly shown
   - Cleaner Today's Meals
   - Mobile-first spacing
   - No storage or database changes
   ========================================= */

(() => {
  "use strict";


  const STYLE_ID =
    "mana-v943-fuel-card-style";


  const CONTENT_ID =
    "manaV83Content";


  const BUILD =
    "94300";


  /* =========================================
     STYLES
     ========================================= */

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
         FUEL ROOT
         ===================================== */

      #${CONTENT_ID}
      .mana-v897-root{
        display:grid;

        gap:14px;

        width:100%;
      }


      /* =====================================
         GENERIC CARDS
         ===================================== */

      #${CONTENT_ID}
      .mana-v897-card{
        margin:0 !important;

        padding:18px;

        border:
          1px solid
          #292929;

        border-radius:20px;

        background:
          linear-gradient(
            145deg,
            #101010,
            #080808
          );
      }


      #${CONTENT_ID}
      .mana-v897-card h3{
        margin:0;

        color:#fff;

        font-size:20px;

        line-height:1.15;
      }


      /* =====================================
         BUILD TARGETS
         ===================================== */

      #${CONTENT_ID}
      #manaV89BuildTargets{
        margin:0 0 2px;

        min-height:48px;

        border-radius:15px;

        font-size:11px;

        letter-spacing:.05em;
      }


      /* =====================================
         DAILY PROGRESS
         ===================================== */

      #${CONTENT_ID}
      .mana-v897-progress{
        position:relative;

        padding:
          20px !important;

        border-color:
          #4c411d;

        background:
          radial-gradient(
            circle at 90% 5%,
            rgba(
              243,
              216,
              117,
              .10
            ),
            transparent 34%
          ),
          linear-gradient(
            145deg,
            #15130b,
            #090909 55%
          );
      }


      #${CONTENT_ID}
      .mana-v897-head{
        align-items:center;

        gap:12px;
      }


      #${CONTENT_ID}
      .mana-v897-edit{
        min-height:36px;

        padding:
          0
          12px;

        border-radius:999px;

        white-space:nowrap;
      }


      #${CONTENT_ID}
      .mana-v897-goal{
        margin-top:9px;

        color:#8d8d8d;

        font-size:11px;
      }


      #${CONTENT_ID}
      .mana-v897-goal strong{
        color:#f3d875;
      }


      #${CONTENT_ID}
      .mana-v897-grid{
        gap:10px;

        margin-top:16px;
      }


      #${CONTENT_ID}
      .mana-v897-stat{
        padding:15px;

        border-radius:16px;

        background:#0b0b0b;
      }


      #${CONTENT_ID}
      .mana-v897-label{
        color:#888;

        font-size:10px;

        font-weight:800;

        letter-spacing:.06em;

        text-transform:uppercase;
      }


      #${CONTENT_ID}
      .mana-v897-value{
        margin-top:5px;

        color:#fff;

        font-size:20px;

        font-weight:900;
      }


      #${CONTENT_ID}
      .mana-v897-track{
        margin-top:11px;

        height:7px;
      }


      /* =====================================
         WATER
         ===================================== */

      #${CONTENT_ID}
      .mana-v897-water{
        margin-top:17px;

        padding-top:15px;

        border-top:
          1px solid
          #292619;
      }


      #${CONTENT_ID}
      .mana-v897-water-title{
        margin-bottom:9px;

        color:#aaa;

        font-size:11px;

        font-weight:800;

        text-transform:uppercase;

        letter-spacing:.05em;
      }


      #${CONTENT_ID}
      .mana-v897-water-grid{
        gap:8px;
      }


      #${CONTENT_ID}
      .mana-v897-water-btn{
        min-height:43px;

        border-radius:12px;

        background:#0d0d0d;
      }


      /* =====================================
         BALANCE
         ===================================== */

      #${CONTENT_ID}
      .mana-v943-balance-card{
        padding:
          16px
          18px !important;
      }


      #${CONTENT_ID}
      .mana-v943-balance-card
      .mana-v897-head{
        margin-bottom:12px;
      }


      #${CONTENT_ID}
      .mana-v943-balance-card
      h3{
        font-size:16px;
      }


      #${CONTENT_ID}
      .mana-v897-balance{
        gap:9px;
      }


      #${CONTENT_ID}
      .mana-v897-balance-box{
        padding:13px 14px;

        border-radius:14px;

        background:
          linear-gradient(
            145deg,
            #15130b,
            #0b0b0b
          );
      }


      #${CONTENT_ID}
      .mana-v897-balance-box span{
        font-size:10px;

        text-transform:uppercase;

        letter-spacing:.04em;
      }


      #${CONTENT_ID}
      .mana-v897-balance-box strong{
        margin-top:4px;

        font-size:23px;
      }


      /* =====================================
         ADD A MEAL
         ===================================== */

      #${CONTENT_ID}
      .mana-v943-add-card{
        padding:
          20px !important;
      }


      #${CONTENT_ID}
      .mana-v943-add-kicker{
        margin-bottom:5px;

        color:#f3d875;

        font-size:10px;

        font-weight:900;

        letter-spacing:.12em;

        text-transform:uppercase;
      }


      #${CONTENT_ID}
      .mana-v943-add-card
      .mana-v897-sub{
        margin:
          7px
          0
          15px;

        max-width:440px;

        color:#858585;

        font-size:12px;
      }


      #${CONTENT_ID}
      .mana-v897-meal-grid{
        gap:10px;
      }


      #${CONTENT_ID}
      .mana-v897-meal{
        position:relative;

        min-height:94px;

        display:flex;

        flex-direction:column;

        justify-content:center;

        padding:
          16px;

        border:
          1px solid
          #35301c;

        border-radius:17px;

        background:
          linear-gradient(
            145deg,
            #14130e,
            #090909
          );

        touch-action:
          manipulation;
      }


      #${CONTENT_ID}
      .mana-v897-meal:active{
        border-color:#796725;

        background:#18150c;
      }


      #${CONTENT_ID}
      .mana-v897-meal strong{
        font-size:16px;

        line-height:1.2;
      }


      #${CONTENT_ID}
      .mana-v897-meal span{
        margin-top:6px;

        color:#8d8d8d;

        font-size:10px;

        line-height:1.35;
      }


      #${CONTENT_ID}
      .mana-v943-meal-arrow{
        position:absolute;

        top:50%;

        right:14px;

        transform:
          translateY(-50%);

        color:#f3d875;

        font-size:18px;

        font-weight:900;
      }


      /* =====================================
         TODAY'S MEALS
         ===================================== */

      #${CONTENT_ID}
      .mana-v897-today{
        padding:
          0 !important;

        overflow:hidden;
      }


      #${CONTENT_ID}
      .mana-v897-today-head{
        padding:
          19px
          18px
          13px;
      }


      #${CONTENT_ID}
      .mana-v897-today-head
      .mana-v897-sub{
        margin:
          6px
          0
          0;
      }


      #${CONTENT_ID}
      .mana-v897-meal-group{
        padding:
          14px
          18px;

        border-top:
          1px solid
          #252525;
      }


      #${CONTENT_ID}
      .mana-v897-meal-heading{
        display:flex;

        align-items:center;

        justify-content:
          space-between;

        margin-bottom:8px;

        color:#f3d875;

        font-size:12px;

        letter-spacing:.06em;

        text-transform:uppercase;
      }


      #${CONTENT_ID}
      .mana-v897-empty{
        padding:
          2px
          0;

        color:#606060;

        font-size:11px;
      }


      #${CONTENT_ID}
      .mana-v897-item{
        padding:
          11px
          0;

        gap:10px;
      }


      #${CONTENT_ID}
      .mana-v897-food strong{
        font-size:14px;

        line-height:1.3;
      }


      #${CONTENT_ID}
      .mana-v897-food span{
        margin-top:4px;

        color:#8b8b8b;

        font-size:11px;
      }


      #${CONTENT_ID}
      .mana-v897-actions{
        gap:5px;
      }


      #${CONTENT_ID}
      .mana-v897-action{
        min-height:33px;

        padding:
          0
          9px;

        border-radius:9px;

        font-size:9px;
      }


      /* =====================================
         CUSTOM MEAL INSIDE MODAL
         ===================================== */

      #manaV941CustomMeal{
        margin-top:14px !important;

        padding:15px !important;

        border-color:
          #56491e !important;

        background:
          linear-gradient(
            145deg,
            #17140a,
            #090909
          ) !important;
      }


      #manaV941CustomMeal
      .mana-v941-custom-toggle
      strong{
        font-size:15px;
      }


      #manaV941CustomMeal
      .mana-v941-custom-sub{
        margin-top:5px;

        font-size:11px;
      }


      #manaV941CustomMeal.open{
        box-shadow:
          inset
          0
          0
          0
          1px
          rgba(
            243,
            216,
            117,
            .06
          );
      }


      /* =====================================
         PRESET MEAL MODAL
         ===================================== */

      #manaV93MealModal
      .mana-v932-sheet{
        border-top-color:#51451e;
      }


      #manaV93MealModal
      .mana-v932-option{
        padding:15px;

        border-radius:16px;
      }


      #manaV93MealModal
      .mana-v932-option
      + .mana-v932-option{
        margin-top:1px;
      }


      #manaV93MealModal
      .mana-v932-name{
        font-size:15px;
      }


      #manaV93MealModal
      .mana-v932-macros{
        margin-top:9px;
      }


      /* =====================================
         MOBILE
         ===================================== */

      @media(
        max-width:600px
      ){

        #${CONTENT_ID}
        .mana-v897-root{
          gap:12px;
        }


        #${CONTENT_ID}
        .mana-v897-card{
          padding:
            16px;
        }


        #${CONTENT_ID}
        .mana-v897-progress{
          padding:
            17px !important;
        }


        #${CONTENT_ID}
        .mana-v897-grid{
          gap:8px;
        }


        #${CONTENT_ID}
        .mana-v897-stat{
          padding:13px;
        }


        #${CONTENT_ID}
        .mana-v897-value{
          font-size:18px;
        }


        #${CONTENT_ID}
        .mana-v943-add-card{
          padding:
            17px !important;
        }


        #${CONTENT_ID}
        .mana-v897-meal-grid{
          grid-template-columns:
            1fr
            1fr;

          gap:8px;
        }


        #${CONTENT_ID}
        .mana-v897-meal{
          min-height:88px;

          padding:
            14px
            29px
            14px
            14px;
        }


        #${CONTENT_ID}
        .mana-v897-meal strong{
          font-size:14px;
        }


        #${CONTENT_ID}
        .mana-v943-meal-arrow{
          right:11px;

          font-size:16px;
        }


        #${CONTENT_ID}
        .mana-v897-today-head{
          padding:
            17px
            16px
            12px;
        }


        #${CONTENT_ID}
        .mana-v897-meal-group{
          padding:
            13px
            16px;
        }


        #${CONTENT_ID}
        .mana-v897-food strong{
          font-size:13px;
        }

      }


      @media(
        max-width:370px
      ){

        #${CONTENT_ID}
        .mana-v897-actions{
          flex-direction:column;
        }


        #${CONTENT_ID}
        .mana-v897-action{
          min-width:58px;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     DECORATE FUEL PAGE
     ========================================= */

  function decorateFuel() {

    const content =
      document.getElementById(
        CONTENT_ID
      );


    if (
      !content
    ) {
      return;
    }


    const root =
      content.querySelector(
        ".mana-v897-root"
      );


    if (
      !root
    ) {
      return;
    }


    const cards =
      [
        ...root.querySelectorAll(
          ".mana-v897-card"
        )
      ];


    /*
      BALANCE CARD
    */

    const balanceCard =
      cards.find(
        card =>
          card.textContent
            ?.includes(
              "Balance Left Today"
            )
      );


    if (
      balanceCard
    ) {

      balanceCard.classList.add(
        "mana-v943-balance-card"
      );
    }


    /*
      ADD A MEAL CARD
    */

    const mealCard =
      cards.find(
        card =>
          card.textContent
            ?.includes(
              "Meal Selection"
            )
      );


    if (
      mealCard
    ) {

      mealCard.classList.add(
        "mana-v943-add-card"
      );


      const title =
        mealCard.querySelector(
          "h3"
        );


      if (
        title
      ) {

        title.textContent =
          "Add a Meal";


        if (
          !mealCard.querySelector(
            ".mana-v943-add-kicker"
          )
        ) {

          const kicker =
            document.createElement(
              "div"
            );


          kicker.className =
            "mana-v943-add-kicker";


          kicker.textContent =
            "MANA FUEL";


          title.insertAdjacentElement(
            "beforebegin",
            kicker
          );
        }
      }


      const sub =
        mealCard.querySelector(
          ".mana-v897-sub"
        );


      if (
        sub
      ) {

        sub.textContent =
          "Choose a meal. Pick a Mana option or enter your own calories and protein.";
      }


      mealCard
        .querySelectorAll(
          ".mana-v897-meal"
        )
        .forEach(
          button => {

            const span =
              button.querySelector(
                "span"
              );


            if (
              span
            ) {

              span.textContent =
                "Presets + your own";
            }


            if (
              !button.querySelector(
                ".mana-v943-meal-arrow"
              )
            ) {

              const arrow =
                document.createElement(
                  "div"
                );


              arrow.className =
                "mana-v943-meal-arrow";


              arrow.textContent =
                "›";


              button.appendChild(
                arrow
              );
            }

          }
        );
    }


    /*
      TODAY'S MEALS
    */

    const today =
      root.querySelector(
        ".mana-v897-today"
      );


    if (
      today
    ) {

      const sub =
        today.querySelector(
          ".mana-v897-today-head .mana-v897-sub"
        );


      if (
        sub
      ) {

        sub.textContent =
          "Your calories and protein update automatically as you add meals.";
      }
    }
  }


  /* =========================================
     WATCH FOR FUEL RERENDERS
     ========================================= */

  function watchFuel() {

    const content =
      document.getElementById(
        CONTENT_ID
      );


    if (
      !content
    ) {

      setTimeout(
        watchFuel,
        400
      );


      return;
    }


    const observer =
      new MutationObserver(
        () => {

          if (
            content.querySelector(
              ".mana-v897-root"
            )
          ) {

            requestAnimationFrame(
              decorateFuel
            );
          }

        }
      );


    observer.observe(
      content,
      {
        childList:true,
        subtree:true
      }
    );
  }


  /* =========================================
     EVENTS
     ========================================= */

  function wireEvents() {

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            '[data-program-tab="fuel"]'
          ) ||
          event.target.closest(
            '[data-tab="fuel"]'
          )
        ) {

          setTimeout(
            decorateFuel,
            100
          );


          setTimeout(
            decorateFuel,
            350
          );

        }

      },
      true
    );


    window.addEventListener(
      "focus",
      () => {

        setTimeout(
          decorateFuel,
          100
        );

      }
    );


    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.visibilityState ===
          "visible"
        ) {

          setTimeout(
            decorateFuel,
            100
          );

        }

      }
    );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    injectStyles();

    wireEvents();

    watchFuel();


    [
      250,
      700,
      1400
    ].forEach(
      delay => {

        setTimeout(
          decorateFuel,
          delay
        );

      }
    );
  }


  window.MANA_FUEL_CARD_BUILD =
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
