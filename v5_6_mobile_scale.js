/* MANA MOVEMENT TRAINING v5.6
   Mana28-inspired mobile sizing */

(() => {
  "use strict";

  const STYLE_ID = "mana-v56-mobile-scale";
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;

  style.textContent = `
    .wrap{
      max-width:560px;
      padding-left:22px;
      padding-right:22px;
      padding-bottom:calc(104px + env(safe-area-inset-bottom));
    }

    .brand{
      gap:16px;
      margin-bottom:34px;
    }

    .brand h1{
      font-size:23px;
    }

    .brand small{
      font-size:13px;
    }

    .mark{
      width:58px;
      height:58px;
      font-size:40px;
    }

    .hero h2{
      font-size:46px;
    }

    .card{
      border-radius:28px;
      padding:26px;
      margin:18px 0;
    }

    .card h2{
      font-size:30px;
    }

    .card h3{
      font-size:23px;
    }

    .card p,
    .card .muted{
      line-height:1.45;
    }

    input,
    select,
    textarea{
      min-height:58px;
      padding:17px 16px;
      border-radius:16px;
      font-size:18px;
    }

    textarea{
      min-height:130px;
    }

    label{
      font-size:15px;
    }

    .btn{
      min-height:60px;
      padding:17px 18px;
      border-radius:18px;
      font-size:18px;
    }

    .tabs button{
      min-height:54px;
      padding:13px 10px;
      border-radius:16px;
      font-size:15px;
    }

    .pill{
      padding:8px 12px;
      font-size:13px;
    }

    .grid{
      gap:14px;
    }

    .metric{
      border-radius:20px;
      padding:20px;
      min-height:132px;
    }

    .metric strong{
      font-size:34px;
    }

    .day{
      gap:14px;
      padding:17px 0;
    }

    .check{
      width:40px;
      height:40px;
    }

    .history-row{
      padding:18px 0;
    }

    .tiny{
      font-size:14px;
    }

    .day-modal{
      border-radius:30px;
      padding:28px 24px;
    }

    .day-modal-close{
      width:50px;
      height:50px;
      font-size:27px;
    }

    .day-chip{
      padding:9px 16px;
      font-size:15px;
    }

    .day-modal h2{
      font-size:38px;
    }

    .day-sub{
      font-size:20px;
    }

    .day-block{
      border-radius:24px;
      padding:22px;
      margin-top:17px;
    }

    .day-block h3{
      font-size:24px;
    }

    .day-task{
      padding:16px 0;
    }

    .day-task strong{
      font-size:21px;
      line-height:1.25;
    }

    .day-task span{
      font-size:17px;
      line-height:1.4;
    }

    .day-complete-btn{
      min-height:64px;
      font-size:20px;
    }

    .v55-strength-panel{
      border-radius:20px !important;
      padding:16px !important;
      margin-top:16px !important;
    }

    .v55-strength-head strong{
      font-size:17px !important;
    }

    .v55-previous{
      font-size:14px !important;
    }

    .v55-set-labels{
      font-size:13px !important;
    }

    .v55-set-no{
      width:40px !important;
      height:40px !important;
      font-size:18px !important;
    }

    .v55-set-row input{
      min-height:52px !important;
      font-size:17px !important;
    }

    .v55-add-set{
      min-height:52px !important;
      font-size:16px !important;
    }

    .trend-chart{
      min-height:180px;
    }

    .spark-wrap{
      height:180px;
    }

    .nav button{
      min-width:66px;
      min-height:64px;
      font-size:14px;
    }

    @media(max-width:390px){
      .wrap{
        padding-left:16px;
        padding-right:16px;
      }

      .card{
        padding:22px;
      }

      .hero h2{
        font-size:40px;
      }

      .day-modal{
        padding:24px 18px;
      }

      .day-modal h2{
        font-size:34px;
      }
    }
  `;

  document.head.appendChild(style);
})();
