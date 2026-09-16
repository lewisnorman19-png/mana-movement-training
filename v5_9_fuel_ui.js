/* =========================================
   MANA MOVEMENT TRAINING v5.9
   Fuel mobile UI polish
   ========================================= */

(() => {
  "use strict";

  const STYLE_ID = "mana-v59-fuel-ui-style";

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      /* ---------- FUEL PAGE ---------- */

      #clientFuelView{
        padding-bottom:120px;
      }

      #fuelV58Targets{
        margin-top:14px !important;
        padding:18px !important;
        border-radius:24px !important;
        background:
          linear-gradient(
            145deg,
            rgba(24,24,24,.98),
            rgba(10,10,10,.98)
          ) !important;
        border:1px solid rgba(245,216,110,.18) !important;
        box-shadow:0 14px 36px rgba(0,0,0,.28);
      }

      #fuelV58Targets .fuel-v58-head{
        margin-bottom:12px !important;
      }

      #fuelV58Targets .fuel-v58-head h3{
        font-size:22px !important;
        letter-spacing:-.02em;
      }

      #fuelV58EditTargets{
        min-height:42px;
        padding:10px 15px !important;
        font-size:13px !important;
      }

      #fuelV58UpdateProfile{
        min-height:48px;
        margin:0 0 14px !important;
        border-radius:15px !important;
        border:1px solid #343434 !important;
        background:#111 !important;
        color:#f5d86e !important;
        font-size:15px !important;
        font-weight:800 !important;
      }

      #fuelV58UpdateProfile:active,
      #fuelV58EditTargets:active{
        transform:scale(.98);
      }

      /* ---------- TARGET CARDS ---------- */

      #fuelV58Targets .fuel-v58-grid{
        grid-template-columns:1fr 1fr !important;
        gap:10px !important;
      }

      #fuelV58Targets .fuel-v58-card{
        min-height:104px;
        padding:14px !important;
        border-radius:17px !important;
        background:#0a0a0a !important;
        border:1px solid #292929 !important;
        display:flex;
        flex-direction:column;
        justify-content:center;
      }

      #fuelV58Targets .fuel-v58-label{
        margin-bottom:5px !important;
        font-size:12px !important;
        color:#9c9c9c !important;
      }

      #fuelV58Targets .fuel-v58-value{
        font-size:19px !important;
        line-height:1.15 !important;
        color:#f5d86e !important;
        letter-spacing:-.02em;
      }

      #fuelV58Targets .fuel-v58-track{
        height:6px !important;
        margin-top:10px !important;
        background:#222 !important;
      }

      /* Water target spans full width */
      #fuelV58Targets [data-target-card="water"]{
        grid-column:1 / -1;
        min-height:88px;
      }

      /* ---------- OLD TOP CALORIE / PROTEIN CARDS ---------- */

      #fuelV57Dashboard > .fuel-v57-grid{
        display:none !important;
      }

      /* ---------- MEALS ---------- */

      #fuelV57Dashboard{
        margin-top:0 !important;
      }

      #fuelV57Dashboard .fuel-v57-section{
        margin-top:14px !important;
        padding:18px !important;
        border-radius:22px !important;
        background:#101010 !important;
      }

      #fuelV57Dashboard .fuel-v57-title{
        margin-bottom:8px !important;
        font-size:21px !important;
      }

      #fuelV57Dashboard .fuel-v57-meal{
        min-height:70px;
        padding:13px 0 !important;
      }

      #fuelV57Dashboard .fuel-v57-meal-name{
        font-size:17px !important;
      }

      #fuelV57Dashboard .fuel-v57-meal-meta{
        max-width:220px;
        font-size:12px !important;
        line-height:1.35;
      }

      #fuelV57Dashboard .fuel-v57-btn{
        min-width:64px;
        min-height:42px;
        padding:9px 13px !important;
        font-size:13px !important;
      }

      #fuelV57Dashboard .fuel-v57-primary{
        min-height:52px;
        margin-top:14px !important;
        border-radius:15px !important;
        padding:14px 16px !important;
        font-size:16px !important;
      }

      /* ---------- WATER ---------- */

      #fuelV57Dashboard .fuel-v57-water-row{
        display:grid !important;
        grid-template-columns:repeat(3,1fr);
        gap:8px !important;
      }

      #fuelV57Dashboard .fuel-v57-water{
        min-width:0 !important;
        min-height:50px !important;
        padding:8px 6px !important;
        border-radius:14px !important;
        font-size:14px !important;
      }

      #fuelV57WaterTotal{
        margin-bottom:10px !important;
        font-size:24px !important;
      }

      /* ---------- MOBILE ---------- */

      @media(max-width:430px){

        #clientFuelView{
          padding-left:0;
          padding-right:0;
        }

        #fuelV58Targets{
          margin-left:0 !important;
          margin-right:0 !important;
        }

        #fuelV58Targets .fuel-v58-card{
          min-height:96px;
        }

        #fuelV58Targets .fuel-v58-value{
          font-size:18px !important;
        }

        #fuelV57Dashboard .fuel-v57-section{
          padding:17px !important;
        }

        #fuelV57Dashboard .fuel-v57-meal-meta{
          max-width:180px;
        }
      }

      @media(max-width:360px){

        #fuelV58Targets .fuel-v58-grid{
          grid-template-columns:1fr !important;
        }

        #fuelV58Targets [data-target-card="water"]{
          grid-column:auto;
        }

        #fuelV57Dashboard .fuel-v57-water-row{
          grid-template-columns:1fr;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function reorderFuel() {
    const fuelView =
      document.getElementById("clientFuelView");

    const targets =
      document.getElementById("fuelV58Targets");

    const dashboard =
      document.getElementById("fuelV57Dashboard");

    if (!fuelView || !targets || !dashboard) return;

    /*
      Keep the page order clean:
      header
      daily targets
      meals
      water
    */

    if (targets.nextElementSibling !== dashboard) {
      targets.after(dashboard);
    }
  }

  function polishButtons() {
    const updateProfile =
      document.getElementById("fuelV58UpdateProfile");

    if (updateProfile) {
      updateProfile.textContent =
        "Update nutrition profile";
    }

    const setTargets =
      document.getElementById("fuelV58EditTargets");

    if (setTargets) {
      setTargets.textContent =
        "Edit targets";
    }

    const quickAdd =
      document.querySelector(
        "#fuelV57Dashboard .fuel-v57-primary"
      );

    if (quickAdd) {
      quickAdd.textContent =
        "+ Quick add meal";
    }
  }

  function initFuelV59() {
    injectStyles();

    /*
      v5.7 and v5.8 load before this.
      A short delay gives their panels time
      to appear without running a permanent
      observer that could hurt iPhone Safari.
    */

    setTimeout(() => {
      reorderFuel();
      polishButtons();
    }, 300);

    setTimeout(() => {
      reorderFuel();
      polishButtons();
    }, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initFuelV59
    );
  } else {
    initFuelV59();
  }
})();
