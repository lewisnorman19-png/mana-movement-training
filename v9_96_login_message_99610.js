/* =========================================
   MANA MOVEMENT TRAINING v9.96.1
   LOGIN MESSAGE REPLACEMENT

   FIXES:
   - Targets v9.87 login layout correctly
   - Removes Ngāi Takoto koru login illustration
   - Removes the large illustration gap
   - Inserts premium Mana brand statement
   - Keeps existing login / signup / Supabase auth
   - Keeps v9.87 profile flow untouched

   LOAD AFTER:
   - v9_87_login_profile_flow.js
   - v9_88_login_intro_polish.js

   ========================================= */

(() => {
  "use strict";

  const BUILD = "99610";
  const STYLE_ID = "mana-v9961-login-message-style";
  const MESSAGE_ID = "manaV9961LoginMessage";


  /* =========================================
     STYLES
     ========================================= */

  function installStyles() {

    document
      .getElementById(STYLE_ID)
      ?.remove();


    const style =
      document.createElement("style");


    style.id =
      STYLE_ID;


    style.textContent = `

      /* =====================================
         LOGIN PAGE
         ===================================== */

      body:has(#authView:not(.hide))
      #authView{

        padding-top:
          18px
          !important;

      }


      /* =====================================
         REMOVE v9.87 LOGIN ILLUSTRATION
         ===================================== */

      body:has(#authView:not(.hide))
      #authView::before{

        content:
          none
          !important;

        display:
          none
          !important;

        background:
          none
          !important;

        background-image:
          none
          !important;

      }


      /* =====================================
         KEEP OLD HIDDEN HERO OFF
         ===================================== */

      body:has(#authView:not(.hide))
      #authView
      .hero{

        display:
          none
          !important;

      }


      /* =====================================
         NEW MESSAGE AREA
         ===================================== */

      #${MESSAGE_ID}{

        position:
          relative;

        z-index:
          4;

        width:
          100%;

        margin:
          0
          0
          16px;

        padding:
          28px
          24px
          26px;

        overflow:
          hidden;

        border:
          1px solid
          rgba(
            243,
            216,
            117,
            .25
          );

        border-radius:
          22px;

        background:

          radial-gradient(
            circle at 92% 5%,
            rgba(
              243,
              216,
              117,
              .12
            ),
            transparent 30%
          ),

          linear-gradient(
            145deg,
            #16140d,
            #080808 65%,
            #050505
          );

        box-shadow:

          0
          18px
          45px
          rgba(
            0,
            0,
            0,
            .32
          );

      }


      #${MESSAGE_ID}::before{

        content:
          "";

        position:
          absolute;

        top:
          -85px;

        right:
          -75px;

        width:
          185px;

        height:
          185px;

        border:
          1px solid
          rgba(
            243,
            216,
            117,
            .12
          );

        border-radius:
          50%;

        pointer-events:
          none;

      }


      #${MESSAGE_ID}::after{

        content:
          "";

        position:
          absolute;

        left:
          24px;

        right:
          24px;

        bottom:
          0;

        height:
          1px;

        background:

          linear-gradient(
            90deg,
            #d4af37,
            rgba(
              212,
              175,
              55,
              .10
            ),
            transparent
          );

        pointer-events:
          none;

      }


      /* =====================================
         EYEBROW
         ===================================== */

      #${MESSAGE_ID}
      .mana-v9961-kicker{

        position:
          relative;

        z-index:
          2;

        display:
          flex;

        align-items:
          center;

        gap:
          10px;

        margin:
          0
          0
          14px;

        color:
          #d8ba55;

        font-size:
          10px;

        font-weight:
          950;

        letter-spacing:
          .18em;

        text-transform:
          uppercase;

      }


      #${MESSAGE_ID}
      .mana-v9961-kicker::before{

        content:
          "";

        width:
          26px;

        height:
          1px;

        flex:
          0 0 26px;

        background:
          #d4af37;

      }


      /* =====================================
         HEADLINE
         ===================================== */

      #${MESSAGE_ID}
      h2{

        position:
          relative;

        z-index:
          2;

        margin:
          0;

        color:
          #fff;

        font-size:
          clamp(
            31px,
            7vw,
            44px
          );

        font-weight:
          950;

        line-height:
          1.03;

        letter-spacing:
          -.035em;

      }


      #${MESSAGE_ID}
      h2
      .gold{

        display:
          block;

        margin-top:
          6px;

        color:
          #f0ce5e;

      }


      /* =====================================
         BODY COPY
         ===================================== */

      #${MESSAGE_ID}
      .mana-v9961-copy{

        position:
          relative;

        z-index:
          2;

        max-width:
          500px;

        margin:
          17px
          0
          0;

        color:
          #b8b8b8;

        font-size:
          14px;

        font-weight:
          550;

        line-height:
          1.62;

      }


      /* =====================================
         PILLARS
         ===================================== */

      #${MESSAGE_ID}
      .mana-v9961-pillars{

        position:
          relative;

        z-index:
          2;

        display:
          flex;

        flex-wrap:
          wrap;

        align-items:
          center;

        gap:
          8px;

        margin-top:
          20px;

      }


      #${MESSAGE_ID}
      .mana-v9961-pillars
      span{

        padding:
          7px
          10px;

        border:
          1px solid
          rgba(
            243,
            216,
            117,
            .20
          );

        border-radius:
          999px;

        background:
          rgba(
            18,
            16,
            8,
            .70
          );

        color:
          #e4cf79;

        font-size:
          9px;

        font-weight:
          950;

        letter-spacing:
          .10em;

        text-transform:
          uppercase;

      }


      /* =====================================
         PURPOSE
         ===================================== */

      #${MESSAGE_ID}
      .mana-v9961-purpose{

        position:
          relative;

        z-index:
          2;

        margin-top:
          19px;

        padding-top:
          16px;

        border-top:
          1px solid
          rgba(
            255,
            255,
            255,
            .07
          );

        color:
          #f3d875;

        font-size:
          11px;

        font-weight:
          950;

        letter-spacing:
          .18em;

        text-transform:
          uppercase;

      }


      /* =====================================
         LOGIN CARD
         ===================================== */

      body:has(#authView:not(.hide))
      #authView
      > .card:not(.hero){

        margin-top:
          0
          !important;

      }


      /* =====================================
         MOBILE
         ===================================== */

      @media(
        max-width:600px
      ){

        body:has(#authView:not(.hide))
        #authView{

          padding-top:
            12px
            !important;

        }


        #${MESSAGE_ID}{

          margin-bottom:
            12px;

          padding:
            23px
            18px
            22px;

          border-radius:
            19px;

        }


        #${MESSAGE_ID}
        h2{

          font-size:
            31px;

        }


        #${MESSAGE_ID}
        .mana-v9961-copy{

          font-size:
            13px;

          line-height:
            1.58;

        }


        #${MESSAGE_ID}
        .mana-v9961-pillars{

          gap:
            6px;

        }


        #${MESSAGE_ID}
        .mana-v9961-pillars
        span{

          padding:
            6px
            8px;

          font-size:
            8px;

        }

      }


      /* =====================================
         SHORT PHONE
         ===================================== */

      @media(
        max-width:600px
      )
      and
      (max-height:740px){

        #${MESSAGE_ID}{

          padding-top:
            19px;

          padding-bottom:
            18px;

        }


        #${MESSAGE_ID}
        h2{

          font-size:
            28px;

        }


        #${MESSAGE_ID}
        .mana-v9961-copy{

          margin-top:
            13px;

        }


        #${MESSAGE_ID}
        .mana-v9961-pillars{

          margin-top:
            14px;

        }


        #${MESSAGE_ID}
        .mana-v9961-purpose{

          margin-top:
            14px;

          padding-top:
            13px;

        }

      }

    `;


    document
      .head
      .appendChild(
        style
      );

  }


  /* =========================================
     BUILD MESSAGE
     ========================================= */

  function buildMessage() {

    const auth =
      document.getElementById(
        "authView"
      );


    if (!auth) {
      return false;
    }


    document
      .getElementById(
        MESSAGE_ID
      )
      ?.remove();


    const loginCard =
      [...auth.children]
        .find(
          child =>
            child
              .classList
              ?.contains(
                "card"
              ) &&
            !child
              .classList
              ?.contains(
                "hero"
              )
        );


    if (!loginCard) {
      return false;
    }


    const message =
      document.createElement(
        "section"
      );


    message.id =
      MESSAGE_ID;


    message.setAttribute(
      "aria-label",
      "Mana Movement"
    );


    message.innerHTML = `

      <div
        class="mana-v9961-kicker"
      >
        MANA MOVEMENT TRAINING
      </div>


      <h2>

        More than a fitness app.

        <span
          class="gold"
        >
          This is your space to move forward.
        </span>

      </h2>


      <p
        class="mana-v9961-copy"
      >

        Build strength.
        Fuel your body.
        Reset your mindset.
        Create habits that last —
        with your training,
        progress and coaching
        all in one place.

      </p>


      <div
        class="mana-v9961-pillars"
      >

        <span>
          Train
        </span>

        <span>
          Fuel
        </span>

        <span>
          Grow
        </span>

        <span>
          Progress
        </span>

      </div>


      <div
        class="mana-v9961-purpose"
      >
        Move with Purpose.
      </div>

    `;


    auth.insertBefore(
      message,
      loginCard
    );


    return true;

  }


  /* =========================================
     APPLY
     ========================================= */

  function apply() {

    installStyles();

    buildMessage();


    /*
      v9.87 can finish applying its
      login layout just after page load.

      These are bounded retries only.
      No MutationObserver.
      No continuous loop.
    */

    [
      120,
      350,
      800
    ]
      .forEach(
        delay => {

          setTimeout(
            () => {

              installStyles();

              buildMessage();

            },
            delay
          );

        }
      );

  }


  /* =========================================
     PUBLIC
     ========================================= */

  window
    .MANA_LOGIN_MESSAGE_BUILD =
      BUILD;


  window
    .refreshManaLoginMessage =
      apply;


  /* =========================================
     INIT
     ========================================= */

  if (
    document.readyState ===
    "loading"
  ) {

    document
      .addEventListener(
        "DOMContentLoaded",
        apply,
        {
          once:true
        }
      );

  } else {

    apply();

  }

})();
