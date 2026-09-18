/* =========================================
   MANA MOVEMENT TRAINING v8.0.8
   HOME

   PROGRAM-LED HOME
   NO START WORKOUT CTA
   MANA 28 FREE PROGRAM
   ========================================= */

(() => {
  "use strict";


  const HOME_ID =
    "manaV80Home";

  const STYLE_ID =
    "mana-v808-home-style";


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

      #${HOME_ID}{
        width:min(
          520px,
          100%
        );

        margin:
          0
          auto;

        padding:
          calc(
            env(
              safe-area-inset-top
            ) + 18px
          )
          18px
          calc(
            105px +
            env(
              safe-area-inset-bottom
            )
          );
      }


      /* ==========================
         BRAND
         ========================== */

      .mana-v808-brand{
        margin-bottom:22px;
      }


      .mana-v808-brand-row{
        display:flex;

        align-items:center;

        gap:14px;

        margin-bottom:16px;
      }


      .mana-v808-mark{
        width:58px;
        height:58px;

        flex:
          0
          0
          58px;

        display:grid;

        place-items:center;

        border:
          2px solid
          #d4af37;

        background:#070707;

        color:#f3d875;

        font:
          700
          38px
          Georgia,
          serif;
      }


      .mana-v808-brand-title{
        color:#fff;

        font-size:18px;

        font-weight:900;

        letter-spacing:.15em;

        line-height:1.2;

        text-transform:uppercase;
      }


      .mana-v808-brand-kicker{
        margin-top:6px;

        color:#f3d875;

        font-size:11px;

        font-weight:900;

        letter-spacing:.16em;

        text-transform:uppercase;
      }


      .mana-v808-brand h1{
        margin:0;

        font-size:34px;

        line-height:1.05;
      }


      .mana-v808-sub{
        margin-top:8px;

        color:#f3d875;

        font-size:12px;

        font-weight:800;

        letter-spacing:.12em;

        text-transform:uppercase;
      }


      .mana-v808-welcome{
        margin-top:12px;

        color:#999;

        font-size:15px;
      }


      /* ==========================
         PROFILE
         ========================== */

      .mana-v808-profile{
        width:100%;

        margin:
          20px
          0
          22px;

        padding:18px;

        text-align:left;

        border:
          1px solid
          #4a3d12;

        border-radius:22px;

        background:
          linear-gradient(
            145deg,
            #17150d,
            #0b0b0b
          );

        color:#fff;

        cursor:pointer;

        touch-action:
          manipulation;
      }


      .mana-v808-profile-label{
        color:#f3d875;

        font-size:10px;

        font-weight:900;

        letter-spacing:.13em;

        text-transform:uppercase;
      }


      .mana-v808-profile h2{
        margin:
          6px
          0;

        font-size:23px;
      }


      .mana-v808-profile p{
        margin:0;

        color:#aaa;

        font-size:13px;

        line-height:1.45;
      }


      .mana-v808-profile-open{
        margin-top:12px;

        color:#f3d875;

        font-size:13px;

        font-weight:900;
      }


      /* ==========================
         PROGRAM SELECT
         ========================== */

      .mana-v808-select{
        margin:
          28px
          0
          14px;

        padding:
          16px
          18px;

        border:
          1px solid
          #333;

        border-radius:18px;

        background:#0d0d0d;

        text-align:center;
      }


      .mana-v808-select strong{
        display:block;

        color:#f3d875;

        font-size:15px;

        letter-spacing:.08em;

        text-transform:uppercase;
      }


      .mana-v808-select span{
        display:block;

        margin-top:6px;

        color:#888;

        font-size:12px;

        line-height:1.4;
      }


      /* ==========================
         PROGRAM CARDS
         ========================== */

      .mana-v808-program{
        position:relative;

        width:100%;

        min-height:150px;

        margin:12px 0;

        padding:20px;

        text-align:left;

        border:
          1px solid
          #292310;

        border-radius:24px;

        background:
          linear-gradient(
            145deg,
            #141414,
            #090909
          );

        color:#fff;

        cursor:pointer;

        touch-action:
          manipulation;

        overflow:hidden;
      }


      .mana-v808-program:active,
      .mana-v808-profile:active{
        transform:
          scale(.99);
      }


      .mana-v808-program-label{
        color:#f3d875;

        font-size:11px;

        font-weight:900;

        letter-spacing:.12em;

        margin-bottom:8px;

        text-transform:uppercase;
      }


      .mana-v808-program h2{
        margin:0;

        font-size:28px;

        line-height:1;
      }


      .mana-v808-program p{
        margin:
          9px
          0
          0;

        color:#aaa;

        font-size:14px;

        line-height:1.45;
      }


      .mana-v808-open{
        margin-top:14px;

        color:#f3d875;

        font-size:13px;

        font-weight:900;
      }


      .mana-v808-free{
        position:absolute;

        top:16px;
        right:16px;

        padding:
          7px
          10px;

        border:
          1px solid
          #67551d;

        border-radius:999px;

        background:#191607;

        color:#f3d875;

        font-size:10px;

        font-weight:900;

        letter-spacing:.08em;

        text-transform:uppercase;
      }


      .mana-v808-free-note{
        margin-top:10px;

        color:#d9c36d;

        font-size:12px;

        font-weight:800;
      }


      /* ==========================
         BOTTOM NAV
         ========================== */

      .mana-v808-bottom{
        position:fixed;

        z-index:19000;

        left:0;
        right:0;
        bottom:0;

        padding:
          8px
          16px
          calc(
            8px +
            env(
              safe-area-inset-bottom
            )
          );

        border-top:
          1px solid
          #272727;

        background:#050505f2;

        backdrop-filter:
          blur(14px);
      }


      .mana-v808-bottom-inner{
        width:min(
          520px,
          100%
        );

        margin:auto;

        display:grid;

        grid-template-columns:
          repeat(
            3,
            1fr
          );

        gap:8px;
      }


      .mana-v808-nav{
        min-height:54px;

        border:0;

        background:none;

        color:#888;

        font-size:12px;

        font-weight:800;
      }


      .mana-v808-nav.active{
        color:#f3d875;
      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* =========================================
     PROFILE NAME
     ========================================= */

  function profileName() {
    try {

      const profile =
        JSON.parse(
          localStorage.getItem(
            "mana-profile-v67"
          ) || "{}"
        );


      return (
        profile.name ||
        ""
      );

    } catch (_) {

      return "";
    }
  }


  /* =========================================
     HIDE LEGACY HOME
     ========================================= */

  function hideOldHome() {
    [
      "clientView",
      "bottomNav"
    ].forEach(
      id => {

        const el =
          document.getElementById(
            id
          );


        if (!el) {
          return;
        }


        el.classList.add(
          "hide"
        );


        el.style.display =
          "none";

      }
    );
  }


  /* =========================================
     OPENERS
     ========================================= */

  function openProgram(
    program
  ) {
    if (
      typeof
        window
          .openManaProgram ===
      "function"
    ) {

      window
        .openManaProgram(
          program
        );

    }
  }


  function openProfile() {
    if (
      typeof
        window
          .openManaProfile ===
      "function"
    ) {

      window
        .openManaProfile();

    }
  }


  function openIntro() {
    if (
      typeof
        window
          .openManaIntroduction ===
      "function"
    ) {

      window
        .openManaIntroduction();

    }
  }


  /* =========================================
     HOME
     ========================================= */

  function buildHome() {
    if (
      document.getElementById(
        HOME_ID
      )
    ) {

      hideOldHome();

      return;
    }


    hideOldHome();


    const name =
      profileName();


    const home =
      document.createElement(
        "div"
      );


    home.id =
      HOME_ID;


    home.innerHTML = `

      <div
        class="mana-v808-brand"
      >

        <div
          class="mana-v808-brand-row"
        >

          <div
            class="mana-v808-mark"
          >
            M
          </div>


          <div>

            <div
              class="mana-v808-brand-title"
            >
              MANA MOVEMENT
            </div>


            <div
              class="mana-v808-brand-kicker"
            >
              TRAINING • MOVE WITH PURPOSE
            </div>

          </div>

        </div>


        <h1>
          Move with Purpose
        </h1>


        <div
          class="mana-v808-sub"
        >
          TRAINING • STRENGTH • LIFE
        </div>


        <div
          class="mana-v808-welcome"
        >
          ${
            name
              ? `Kia ora, ${name}`
              : "Kia ora"
          }
        </div>

      </div>


      <button
        type="button"
        class="mana-v808-profile"
        id="manaV80ProfileSetup"
      >

        <div
          class="mana-v808-profile-label"
        >
          YOUR PROFILE
        </div>


        <h2>
          Set your goals
        </h2>


        <p>
          Add your personal details,
          training setup and Fuel Goal
          so Mana can personalise your
          experience.
        </p>


        <div
          class="mana-v808-profile-open"
        >
          Open profile →
        </div>

      </button>


      <div
        class="mana-v808-select"
      >

        <strong>
          Select your program below
        </strong>


        <span>
          Choose the area you want to
          work on today.
        </span>

      </div>


      <!-- MANA 28 -->

      <button
        type="button"
        class="mana-v808-program"
        id="manaV80Mana28"
      >

        <div
          class="mana-v808-free"
        >
          FREE PROGRAM
        </div>


        <div
          class="mana-v808-program-label"
        >
          MANA 28
        </div>


        <h2>
          28 Days
        </h2>


        <p>
          A complete 28-day introduction
          to Mana Movement — training,
          habits, nutrition and daily
          action.
        </p>


        <div
          class="mana-v808-free-note"
        >
          Free access • No payment required
        </div>


        <div
          class="mana-v808-open"
        >
          Select MANA 28 →
        </div>

      </button>


      <!-- MANA STRENGTH -->

      <button
        type="button"
        class="mana-v808-program"
        id="manaV80Strength"
      >

        <div
          class="mana-v808-program-label"
        >
          MANA STRENGTH
        </div>


        <h2>
          Get Stronger
        </h2>


        <p>
          Personalised strength training,
          workout logging, Fuel and
          progress tracking.
        </p>


        <div
          class="mana-v808-open"
        >
          Select MANA STRENGTH →
        </div>

      </button>


      <!-- MANA LIFE -->

      <button
        type="button"
        class="mana-v808-program"
        id="manaV80Life"
      >

        <div
          class="mana-v808-program-label"
        >
          MANA LIFE
        </div>


        <h2>
          Reclaim
        </h2>


        <p>
          Mindset, routine, reflection
          and daily actions designed to
          rebuild momentum.
        </p>


        <div
          class="mana-v808-open"
        >
          Select MANA LIFE →
        </div>

      </button>


      <div
        class="mana-v808-bottom"
      >

        <div
          class="mana-v808-bottom-inner"
        >

          <button
            type="button"
            class="
              mana-v808-nav
              active
            "
            id="manaV80HomeBtn"
          >
            ⌂
            <br>
            Home
          </button>


          <button
            type="button"
            class="mana-v808-nav"
            id="manaV80IntroBtn"
          >
            ◌
            <br>
            Intro
          </button>


          <button
            type="button"
            class="mana-v808-nav"
            id="manaV80ProfileBtn"
          >
            ◎
            <br>
            Profile
          </button>

        </div>

      </div>

    `;


    const wrap =
      document.querySelector(
        ".wrap"
      );


    const header =
      wrap
        ?.querySelector(
          ".brand"
        );


    if (header) {

      header.style.display =
        "none";


      header
        .insertAdjacentElement(
          "afterend",
          home
        );

    } else if (wrap) {

      wrap.appendChild(
        home
      );

    } else {

      document.body
        .appendChild(
          home
        );

    }


    document
      .getElementById(
        "manaV80Mana28"
      )
      .onclick =
        () =>
          openProgram(
            "mana28"
          );


    document
      .getElementById(
        "manaV80Strength"
      )
      .onclick =
        () =>
          openProgram(
            "strength"
          );


    document
      .getElementById(
        "manaV80Life"
      )
      .onclick =
        () =>
          openProgram(
            "life"
          );


    document
      .getElementById(
        "manaV80ProfileSetup"
      )
      .onclick =
        openProfile;


    document
      .getElementById(
        "manaV80ProfileBtn"
      )
      .onclick =
        openProfile;


    document
      .getElementById(
        "manaV80IntroBtn"
      )
      .onclick =
        openIntro;
  }


  function refreshName() {
    const home =
      document.getElementById(
        HOME_ID
      );


    if (!home) {
      return;
    }


    const welcome =
      home.querySelector(
        ".mana-v808-welcome"
      );


    const name =
      profileName();


    if (welcome) {

      welcome.textContent =
        name
          ? `Kia ora, ${name}`
          : "Kia ora";

    }
  }


  function enforceHome() {
    hideOldHome();

    buildHome();
  }


  function init() {
    injectStyles();


    [
      300,
      800,
      1600
    ].forEach(
      delay => {

        setTimeout(
          enforceHome,
          delay
        );

      }
    );


    window.addEventListener(
      "mana:profile-synced",
      refreshName
    );


    window.addEventListener(
      "focus",
      () => {

        hideOldHome();

      }
    );
  }


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
