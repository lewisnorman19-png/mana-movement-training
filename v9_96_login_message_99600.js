/* =========================================
   MANA MOVEMENT TRAINING v9.96.0
   LOGIN MESSAGE POLISH

   PURPOSE:
   - Keep existing login / signup / Supabase auth intact
   - Remove login illustration / visual imagery
   - Replace hero copy with a clean brand statement
   - Premium black / gold Mana styling
   - Safe last-loaded visual override only
   ========================================= */

(() => {
  "use strict";

  const BUILD = "99600";
  const STYLE_ID = "mana-v996-login-message-style";
  const HERO_ID = "manaV996LoginMessage";


  /* =========================================
     HELPERS
     ========================================= */

  function authView() {
    return document.getElementById("authView");
  }


  function removeLoginVisuals(view) {
    if (!view) return;


    /*
      REMOVE MEDIA FROM LOGIN AREA

      This only affects the authentication screen.
      It does not touch login inputs, buttons,
      Supabase auth or the rest of the app.
    */

    view.querySelectorAll(
      "img, picture, video, canvas"
    ).forEach(el => {

      try {
        el.remove();
      } catch (_) {}

    });


    /*
      REMOVE COMMON ILLUSTRATION WRAPPERS
    */

    [
      ".login-illustration",
      ".loginIllustration",

      ".auth-illustration",
      ".authIllustration",

      ".login-visual",
      ".loginVisual",

      ".auth-visual",
      ".authVisual",

      ".login-image",
      ".auth-image",

      ".login-art",
      ".auth-art",

      "[data-login-illustration]",
      "[data-auth-illustration]"

    ].forEach(selector => {

      view
        .querySelectorAll(selector)
        .forEach(el => {

          try {
            el.remove();
          } catch (_) {}

        });

    });

  }


  /* =========================================
     STYLES
     ========================================= */

  function injectStyles() {

    if (
      document.getElementById(
        STYLE_ID
      )
    ) {
      return;
    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      STYLE_ID;


    style.textContent = `

      /* =====================================
         MANA LOGIN v9.96
         ===================================== */


      #authView{
        width:100%;
      }


      /* =====================================
         HERO
         ===================================== */

      #authView .hero{

        position:relative !important;

        overflow:hidden !important;

        background:
          radial-gradient(
            circle at 12% 0%,
            rgba(213,181,77,.12),
            transparent 34%
          ),
          linear-gradient(
            180deg,
            #111 0%,
            #0b0b0b 100%
          ) !important;

        background-image:
          radial-gradient(
            circle at 12% 0%,
            rgba(213,181,77,.12),
            transparent 34%
          ),
          linear-gradient(
            180deg,
            #111 0%,
            #0b0b0b 100%
          ) !important;

        border:
          1px solid
          rgba(214,186,83,.24)
          !important;

        border-radius:
          24px
          !important;

        padding:
          28px
          24px
          26px
          !important;

        min-height:
          0
          !important;

        box-shadow:
          0
          18px
          44px
          rgba(0,0,0,.28)
          !important;

      }


      #authView .hero::before{

        content:"";

        position:absolute;

        width:150px;
        height:150px;

        top:-80px;
        right:-55px;

        border:
          1px solid
          rgba(224,195,89,.14);

        border-radius:50%;

        pointer-events:none;

      }


      #authView .hero::after{

        content:"";

        position:absolute;

        left:24px;
        right:24px;
        bottom:0;

        height:1px;

        background:
          linear-gradient(
            90deg,
            rgba(225,195,86,.75),
            rgba(225,195,86,.08),
            transparent
          );

        pointer-events:none;

      }


      /* =====================================
         LOGIN MESSAGE
         ===================================== */

      #${HERO_ID}{

        position:relative;

        z-index:1;

      }


      #${HERO_ID} .m996-kicker{

        display:inline-flex;

        align-items:center;

        gap:8px;

        margin:
          0
          0
          13px;

        color:#dfc45d;

        font-size:11px;

        line-height:1;

        font-weight:900;

        letter-spacing:2.1px;

        text-transform:uppercase;

      }


      #${HERO_ID} .m996-kicker::before{

        content:"";

        width:24px;

        height:1px;

        background:#dfc45d;

        opacity:.8;

      }


      #${HERO_ID} h2{

        margin:
          0
          !important;

        max-width:
          620px;

        color:
          #fff
          !important;

        font-size:
          clamp(
            30px,
            6vw,
            48px
          )
          !important;

        line-height:
          1.02
          !important;

        letter-spacing:
          -1.1px
          !important;

        font-weight:
          900
          !important;

      }


      #${HERO_ID} h2 .gold{

        display:block;

        margin-top:5px;

        color:
          #dfc45d
          !important;

      }


      #${HERO_ID} .m996-copy{

        max-width:
          620px;

        margin:
          17px
          0
          0;

        color:#b5b5b5;

        font-size:15px;

        line-height:1.65;

        font-weight:550;

      }


      /* =====================================
         PILLARS
         ===================================== */

      #${HERO_ID} .m996-pillars{

        display:flex;

        flex-wrap:wrap;

        gap:
          7px
          14px;

        margin-top:19px;

        padding-top:17px;

        border-top:
          1px solid
          rgba(255,255,255,.07);

        color:#e7e7e7;

        font-size:11px;

        font-weight:850;

        letter-spacing:.8px;

        text-transform:uppercase;

      }


      #${HERO_ID} .m996-pillars span{

        display:flex;

        align-items:center;

        gap:7px;

      }


      #${HERO_ID}
      .m996-pillars
      span:not(:last-child)::after{

        content:"•";

        margin-left:7px;

        color:#a88f37;

      }


      /* =====================================
         PURPOSE LINE
         ===================================== */

      #${HERO_ID} .m996-purpose{

        margin-top:18px;

        color:#dfc45d;

        font-size:12px;

        font-weight:900;

        letter-spacing:1.8px;

        text-transform:uppercase;

      }


      /* =====================================
         REMOVE OLD LOGIN ART
         ===================================== */

      #authView .login-illustration,
      #authView .loginIllustration,

      #authView .auth-illustration,
      #authView .authIllustration,

      #authView .login-visual,
      #authView .loginVisual,

      #authView .auth-visual,
      #authView .authVisual,

      #authView .login-image,
      #authView .auth-image,

      #authView .login-art,
      #authView .auth-art{

        display:
          none
          !important;

        background-image:
          none
          !important;

      }


      /* =====================================
         LOGIN FORM CARD
         ===================================== */

      #authView .hero + .card{

        border-radius:
          24px
          !important;

        border-color:
          #292929
          !important;

        box-shadow:
          0
          18px
          42px
          rgba(0,0,0,.22)
          !important;

      }


      #authView .tabs{

        margin-bottom:
          18px;

      }


      #authView input{

        min-height:
          50px;

      }


      #authView .btn.primary{

        min-height:
          50px;

        font-weight:
          900;

        letter-spacing:
          .2px;

      }


      /* =====================================
         MOBILE
         ===================================== */

      @media(max-width:620px){

        #authView .hero{

          padding:
            24px
            18px
            22px
            !important;

          border-radius:
            20px
            !important;

        }


        #${HERO_ID} h2{

          font-size:
            32px
            !important;

          letter-spacing:
            -.7px
            !important;

        }


        #${HERO_ID} .m996-copy{

          font-size:
            14px;

          line-height:
            1.58;

        }


        #${HERO_ID} .m996-pillars{

          gap:
            7px
            10px;

          font-size:
            10px;

        }


        #${HERO_ID}
        .m996-pillars
        span:not(:last-child)::after{

          margin-left:
            3px;

        }


        #authView .hero + .card{

          border-radius:
            20px
            !important;

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
     BUILD HERO
     ========================================= */

  function buildHero() {

    const view =
      authView();


    if (!view) {
      return false;
    }


    const hero =
      view.querySelector(
        ".card.hero, .hero"
      );


    if (!hero) {
      return false;
    }


    removeLoginVisuals(
      view
    );


    injectStyles();


    hero.innerHTML = `

      <div
        id="${HERO_ID}"
      >

        <div
          class="m996-kicker"
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
          class="m996-copy"
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
          class="m996-pillars"
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
          class="m996-purpose"
        >

          Move with Purpose.

        </div>

      </div>

    `;


    return true;

  }


  /* =========================================
     APPLY
     ========================================= */

  function apply() {

    const view =
      authView();


    if (!view) {
      return;
    }


    buildHero();


    /*
      One delayed pass.

      This handles any older login
      visual file that finishes painting
      just after DOM load.

      No observer.
      No repeating loop.
    */

    setTimeout(
      () => {

        if (
          authView()
        ) {

          buildHero();

        }

      },
      220
    );

  }


  /* =========================================
     GLOBAL ACCESS
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
