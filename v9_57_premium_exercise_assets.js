/* =========================================
   MANA MOVEMENT TRAINING v9.57.0
   PREMIUM EXERCISE ASSETS

   - Uses proper generated exercise artwork
   - Bench Press first
   - Premium muscle target graphic
   - Premium START → FINISH demo
   - Falls back to v9.56 for unmapped exercises
   - No workout logging changes
   - No auth / Fuel changes
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "95700";


  const STYLE_ID =
    "mana-v957-premium-assets-style";


  const ASSET_ROOT =
    "assets/exercises";


  /* =========================================
     EXERCISE ASSET MAP
     ========================================= */

  const EXERCISES = {

    "bench press": {

      demo:
        `${ASSET_ROOT}/bench-press-demo.png`,

      muscle:
        `${ASSET_ROOT}/bench-press-muscles.png`,

      target:
        "Chest + Triceps",

      region:
        "upper"

    }

  };


  /* =========================================
     HELPERS
     ========================================= */

  function normalise(
    value
  ) {

    return String(
      value || ""
    )
      .toLowerCase()
      .trim();
  }


  function assetForExercise(
    exerciseName
  ) {

    const name =
      normalise(
        exerciseName
      );


    /*
      Exact first.
    */

    if (
      EXERCISES[name]
    ) {

      return EXERCISES[name];
    }


    /*
      Alias support.
    */

    if (
      name.includes(
        "bench press"
      )
    ) {

      return EXERCISES[
        "bench press"
      ];
    }


    return null;
  }


  function exerciseNameFromCard(
    card
  ) {

    return (
      card?.dataset
        ?.exerciseName ||
      card
        ?.querySelector(
          ".mana-v64-name"
        )
        ?.textContent
        ?.trim() ||
      ""
    );
  }


  /* =========================================
     IMAGE FALLBACK
     ========================================= */

  function imageExistsFallback(
    image,
    fallback
  ) {

    image.addEventListener(
      "error",
      () => {

        if (
          typeof fallback ===
          "function"
        ) {

          fallback();
        }

      },
      {
        once:true
      }
    );
  }


  /* =========================================
     WORKOUT CARD
     ========================================= */

  function upgradeCard(
    card
  ) {

    const name =
      exerciseNameFromCard(
        card
      );


    const asset =
      assetForExercise(
        name
      );


    if (
      !asset
    ) {
      return;
    }


    /*
      We can rerun this after workout
      rerenders without duplicating.
    */

    card
      .querySelector(
        ".mana-v957-premium-target"
      )
      ?.remove();


    const oldGraphic =
      card.querySelector(
        ".mana-v955-exercise-head"
      );


    if (
      oldGraphic
    ) {

      oldGraphic.style.display =
        "none";
    }


    const nameElement =
      card.querySelector(
        ".mana-v64-name"
      );


    if (
      !nameElement
    ) {
      return;
    }


    const block =
      document.createElement(
        "div"
      );


    block.className =
      "mana-v957-premium-target";


    block.innerHTML = `

      <div
        class="mana-v957-target-image-wrap"
      >

        <img
          class="mana-v957-target-image"
          src="${asset.muscle}"
          alt="${asset.target} muscle target"
          loading="lazy"
        />

      </div>


      <div
        class="mana-v957-target-copy"
      >

        <span>
          PRIMARY TARGET
        </span>

        <strong>
          ${asset.target}
        </strong>

      </div>

    `;


    nameElement
      .insertAdjacentElement(
        "afterend",
        block
      );


    const image =
      block.querySelector(
        ".mana-v957-target-image"
      );


    if (
      image
    ) {

      imageExistsFallback(
        image,
        () => {

          block.remove();


          if (
            oldGraphic
          ) {

            oldGraphic.style.display =
              "";
          }

        }
      );
    }


    /*
      Upgrade existing visual demo button.
    */

    const demoButton =
      card.querySelector(
        ".mana-v955-demo-button"
      );


    if (
      demoButton
    ) {

      demoButton.classList.add(
        "mana-v957-demo-button"
      );


      demoButton.innerHTML = `

        <span
          class="mana-v957-play"
        >
          ▶
        </span>

        VIEW EXERCISE DEMO

      `;

    }


    card.dataset
      .manaV957 =
      "1";
  }


  function upgradeCards() {

    document
      .querySelectorAll(
        "#manaV64Exercises .mana-v64-card"
      )
      .forEach(
        upgradeCard
      );
  }


  /* =========================================
     PREMIUM DEMO MODAL
     ========================================= */

  function upgradeDemoModal(
    card
  ) {

    const name =
      exerciseNameFromCard(
        card
      );


    const asset =
      assetForExercise(
        name
      );


    if (
      !asset
    ) {
      return;
    }


    const modal =
      document.getElementById(
        "manaV955DemoModal"
      );


    const demo =
      document.getElementById(
        "manaV955Demo"
      );


    const muscle =
      document.getElementById(
        "manaV955Muscle"
      );


    const muscleLabel =
      document.getElementById(
        "manaV955MuscleLabel"
      );


    if (
      !modal ||
      !demo
    ) {
      return;
    }


    /*
      Demo artwork.
    */

    demo.innerHTML = `

      <div
        class="mana-v957-demo-image-wrap"
      >

        <img
          class="mana-v957-demo-image"
          src="${asset.demo}"
          alt="${name} start and finish demonstration"
        />

      </div>

    `;


    const demoImage =
      demo.querySelector(
        ".mana-v957-demo-image"
      );


    if (
      demoImage
    ) {

      imageExistsFallback(
        demoImage,
        () => {

          /*
            If premium image is unavailable,
            rebuild the v9.56 graphic.
          */

          if (
            typeof
              window
                .refreshManaExerciseVisualUpgrade ===
            "function"
          ) {

            window
              .refreshManaExerciseVisualUpgrade();
          }

        }
      );
    }


    /*
      Muscle target artwork.
    */

    if (
      muscle
    ) {

      muscle.innerHTML = `

        <img
          class="mana-v957-modal-muscle-image"
          src="${asset.muscle}"
          alt="${asset.target}"
        />

      `;
    }


    if (
      muscleLabel
    ) {

      muscleLabel.textContent =
        asset.target;
    }


    modal.classList.add(
      "mana-v957-premium-modal"
    );
  }


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
         WORKOUT CARD TARGET
         ===================================== */

      .mana-v957-premium-target{
        margin:
          12px
          0
          14px;

        display:grid;

        grid-template-columns:
          140px
          minmax(
            0,
            1fr
          );

        gap:14px;

        align-items:center;

        padding:12px;

        border:
          1px solid
          #3f3518;

        border-radius:16px;

        background:
          linear-gradient(
            145deg,
            #14120b,
            #090909
          );

        overflow:hidden;
      }


      .mana-v957-target-image-wrap{
        width:140px;

        height:118px;

        overflow:hidden;

        border-radius:12px;

        background:#080808;
      }


      .mana-v957-target-image{
        width:100%;

        height:100%;

        display:block;

        object-fit:cover;

        /*
          Crop toward upper torso.
        */

        object-position:
          34%
          48%;
      }


      .mana-v957-target-copy span{
        display:block;

        color:#777;

        font-size:8px;

        font-weight:900;

        letter-spacing:.10em;
      }


      .mana-v957-target-copy strong{
        display:block;

        margin-top:5px;

        color:#f3d875;

        font-size:16px;

        line-height:1.2;
      }


      /* =====================================
         PREMIUM DEMO BUTTON
         ===================================== */

      .mana-v957-demo-button{
        min-height:43px !important;

        padding:
          0
          15px !important;

        border:
          1px solid
          #6e5d22 !important;

        border-radius:
          12px !important;

        background:
          linear-gradient(
            145deg,
            #1a1609,
            #0d0c08
          ) !important;

        color:
          #f3d875 !important;

        font-size:
          9px !important;

        font-weight:
          900 !important;

        letter-spacing:
          .06em !important;
      }


      .mana-v957-play{
        width:22px;

        height:22px;

        display:grid;

        place-items:center;

        border-radius:50%;

        background:#f3d875;

        color:#111;

        font-size:8px;
      }


      /* =====================================
         PREMIUM DEMO IMAGE
         ===================================== */

      .mana-v957-demo-image-wrap{
        width:100%;

        margin-top:14px;

        overflow:hidden;

        border:
          1px solid
          #443919;

        border-radius:18px;

        background:#050505;
      }


      .mana-v957-demo-image{
        display:block;

        width:100%;

        height:auto;
      }


      /* =====================================
         PREMIUM MODAL
         ===================================== */

      #manaV955DemoModal
      .mana-v955-modal-sheet{
        width:
          min(
            760px,
            96vw
          ) !important;
      }


      #manaV955DemoModal
      #manaV955Demo{
        width:100%;
      }


      #manaV955DemoModal
      .mana-v955-modal-muscle{
        grid-template-columns:
          220px
          1fr !important;

        gap:
          20px !important;

        align-items:center;
      }


      #manaV955DemoModal
      #manaV955Muscle{
        width:
          220px !important;

        height:
          155px !important;

        overflow:hidden;

        border-radius:14px;

        background:#080808;
      }


      .mana-v957-modal-muscle-image{
        display:block;

        width:100%;

        height:100%;

        object-fit:cover;

        object-position:
          33%
          48%;
      }


      #manaV955DemoModal
      #manaV955MuscleLabel{
        font-size:
          20px !important;
      }


      /* =====================================
         REMOVE OLD GENERATED DEMO GRAPHICS
         WHEN PREMIUM MODE IS OPEN
         ===================================== */

      #manaV955DemoModal.mana-v957-premium-modal
      .mana-v956-demo-stage,
      #manaV955DemoModal.mana-v957-premium-modal
      .mana-v955-demo-stage{
        display:none !important;
      }


      /* =====================================
         PHONE
         ===================================== */

      @media(
        max-width:600px
      ){

        .mana-v957-premium-target{
          grid-template-columns:
            112px
            1fr;

          gap:10px;

          padding:10px;
        }


        .mana-v957-target-image-wrap{
          width:112px;

          height:100px;
        }


        .mana-v957-target-copy strong{
          font-size:14px;
        }


        #manaV955DemoModal
        .mana-v955-modal-sheet{
          width:
            100% !important;
        }


        #manaV955DemoModal
        .mana-v955-modal-muscle{
          grid-template-columns:
            130px
            1fr !important;

          gap:
            12px !important;
        }


        #manaV955DemoModal
        #manaV955Muscle{
          width:
            130px !important;

          height:
            110px !important;
        }


        #manaV955DemoModal
        #manaV955MuscleLabel{
          font-size:
            16px !important;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     EVENTS
     ========================================= */

  function refresh() {

    [
      80,
      220,
      500
    ].forEach(
      delay => {

        setTimeout(
          upgradeCards,
          delay
        );

      }
    );
  }


  function wireEvents() {

    document.addEventListener(
      "click",
      event => {

        /*
          Existing v9.55 demo button
          opens the modal.

          We wait for that, then replace
          its graphics with premium artwork.
        */

        const demoButton =
          event.target.closest(
            ".mana-v955-demo-button"
          );


        if (
          demoButton
        ) {

          const card =
            demoButton.closest(
              ".mana-v64-card"
            );


          if (
            card
          ) {

            setTimeout(
              () => {

                upgradeDemoModal(
                  card
                );

              },
              40
            );
          }
        }


        /*
          Program tab.
        */

        if (
          event.target.closest(
            '#manaV83Tabs [data-v83-tab="program"]'
          )
        ) {

          refresh();
        }

      }
    );


    window.addEventListener(
      "mana:program-tab-change",
      refresh
    );


    window.addEventListener(
      "mana:strength-synced",
      refresh
    );


    window.addEventListener(
      "mana:workout-progress-change",
      refresh
    );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    injectStyles();

    wireEvents();


    setTimeout(
      refresh,
      900
    );
  }


  window.MANA_PREMIUM_EXERCISE_ASSETS_BUILD =
    BUILD;


  window.refreshManaPremiumExerciseAssets =
    refresh;


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
