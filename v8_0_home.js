/* =========================================
   MANA MOVEMENT TRAINING v8.0.13
   HOME

   WIDE DESKTOP LAYOUT
   STRONG ACTIVE PROGRAM
   BIGGER PROGRAM HEADINGS
   DEFAULT ACTIVE = MANA STRENGTH
   SECURE LOGOUT
   ========================================= */

(() => {
  "use strict";


  const HOME_ID =
    "manaV80Home";

  const STYLE_ID =
    "mana-v8013-home-style";

  const CURRENT_PROGRAM_KEY =
    "mana-current-program";


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
          980px,
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
          14px
          calc(
            110px +
            env(
              safe-area-inset-bottom
            )
          );
      }


      /* ==========================
         BRAND
         ========================== */

      .mana-v8013-brand{
        padding:
          0
          10px;

        margin-bottom:24px;
      }


      .mana-v8013-brand-row{
        display:flex;

        align-items:center;

        gap:16px;

        margin-bottom:18px;
      }


      .mana-v8013-mark{
        width:62px;
        height:62px;

        flex:
          0
          0
          62px;

        display:grid;

        place-items:center;

        border:
          2px solid
          #d4af37;

        background:#070707;

        color:#f3d875;

        font:
          700
          40px
          Georgia,
          serif;
      }


      .mana-v8013-brand-title{
        color:#fff;

        font-size:20px;

        font-weight:900;

        letter-spacing:.15em;

        line-height:1.2;

        text-transform:uppercase;
      }


      .mana-v8013-brand-kicker{
        margin-top:6px;

        color:#f3d875;

        font-size:12px;

        font-weight:900;

        letter-spacing:.16em;

        text-transform:uppercase;
      }


      .mana-v8013-brand h1{
        margin:0;

        font-size:38px;

        line-height:1.05;
      }


      .mana-v8013-sub{
        margin-top:9px;

        color:#f3d875;

        font-size:13px;

        font-weight:800;

        letter-spacing:.12em;

        text-transform:uppercase;
      }


      .mana-v8013-welcome{
        margin-top:13px;

        color:#999;

        font-size:16px;
      }


      /* ==========================
         PROFILE
         ========================== */

      .mana-v8013-profile{
        width:100%;

        margin:
          20px
          0
          28px;

        padding:
          22px
          24px;

        text-align:left;

        border:
          1px solid
          #4a3d12;

        border-radius:24px;

        background:
          linear-gradient(
            145deg,
            #17150d,
            #0b0b0b
          );

        color:#fff;

        cursor:pointer;
      }


      .mana-v8013-profile-label{
        color:#f3d875;

        font-size:12px;

        font-weight:900;

        letter-spacing:.13em;

        text-transform:uppercase;
      }


      .mana-v8013-profile h2{
        margin:
          7px
          0;

        font-size:26px;
      }


      .mana-v8013-profile p{
        margin:0;

        color:#aaa;

        font-size:14px;

        line-height:1.5;
      }


      .mana-v8013-profile-open{
        margin-top:14px;

        color:#f3d875;

        font-size:14px;

        font-weight:900;
      }


      /* ==========================
         SELECT
         ========================== */

      .mana-v8013-select{
        width:100%;

        margin:
          30px
          0
          20px;

        padding:
          20px
          18px;

        border:
          1px solid
          #333;

        border-radius:20px;

        background:#0d0d0d;

        text-align:center;
      }


      .mana-v8013-select strong{
        display:block;

        color:#f3d875;

        font-size:17px;

        font-weight:900;

        letter-spacing:.08em;

        text-transform:uppercase;
      }


      .mana-v8013-select span{
        display:block;

        margin-top:7px;

        color:#888;

        font-size:13px;
      }


      /* ==========================
         PROGRAMS
         ========================== */

      .mana-v8013-program{
        position:relative;

        width:100%;

        min-height:200px;

        margin:
          22px
          0;

        padding:
          30px
          28px;

        text-align:left;

        border:
          1px solid
          #302915;

        border-radius:28px;

        background:
          linear-gradient(
            145deg,
            #151515,
            #080808
          );

        color:#fff;

        cursor:pointer;

        overflow:hidden;

        transition:
          border-color .2s ease,
          background .2s ease,
          transform .1s ease,
          box-shadow .2s ease;
      }


      .mana-v8013-program:active,
      .mana-v8013-profile:active{
        transform:
          scale(.995);
      }


      /* ==========================
         ACTIVE PROGRAM
         ========================== */

      .mana-v8013-program.current{
        border:
          3px solid
          #f3d875;

        background:
          linear-gradient(
            145deg,
            #4b3c10,
            #2a2109 48%,
            #0d0c08
          );

        box-shadow:
          0
          0
          0
          3px
          rgba(
            243,
            216,
            117,
            .12
          ),
          0
          14px
          42px
          rgba(
            212,
            175,
            55,
            .24
          );
      }


      .mana-v8013-program.current::before{
        content:"";

        position:absolute;

        top:0;
        left:0;
        right:0;

        height:6px;

        background:
          linear-gradient(
            90deg,
            #a97e1d,
            #f3d875,
            #a97e1d
          );
      }


      /* ==========================
         PROGRAM HEADINGS
         ========================== */

      .mana-v8013-program-label{
        color:#f3d875;

        font-size:18px;

        font-weight:900;

        letter-spacing:.12em;

        margin-bottom:11px;

        text-transform:uppercase;
      }


      .mana-v8013-program h2{
        margin:0;

        font-size:39px;

        line-height:1.02;
      }


      .mana-v8013-program p{
        margin:
          13px
          0
          0;

        max-width:88%;

        color:#aaa;

        font-size:15px;

        line-height:1.6;
      }


      .mana-v8013-open{
        margin-top:19px;

        color:#f3d875;

        font-size:14px;

        font-weight:900;
      }


      .mana-v8013-badge{
        position:absolute;

        top:20px;
        right:20px;

        padding:
          8px
          12px;

        border:
          1px solid
          #67551d;

        border-radius:999px;

        background:#191607;

        color:#f3d875;

        font-size:10px;

        font-weight:900;

        letter-spacing:.07em;

        text-transform:uppercase;
      }


      .mana-v8013-current-badge{
        display:none;

        margin-top:15px;

        width:max-content;

        padding:
          10px
          14px;

        border-radius:999px;

        border:
          1px solid
          #f3d875;

        background:#f3d875;

        color:#111;

        font-size:11px;

        font-weight:900;

        letter-spacing:.08em;

        text-transform:uppercase;
      }


      .mana-v8013-program.current
      .mana-v8013-current-badge{
        display:block;
      }


      .mana-v8013-program.current
      .mana-v8013-program-label{
        color:#ffe99d;
      }


      .mana-v8013-program.current
      h2{
        color:#fff8dc;
      }


      .mana-v8013-free-note{
        margin-top:11px;

        color:#d9c36d;

        font-size:13px;

        font-weight:800;
      }


      .mana-v8013-price{
        margin-top:12px;
      }


      .mana-v8013-price strong{
        color:#f3d875;

        font-size:27px;

        font-weight:900;
      }


      .mana-v8013-price span{
        color:#888;

        font-size:13px;

        margin-left:5px;
      }


      /* ==========================
         BOTTOM NAV
         ========================== */

      .mana-v8013-bottom{
        position:fixed;

        z-index:19000;

        left:0;
        right:0;
        bottom:0;

        padding:
          9px
          14px
          calc(
            9px +
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


      .mana-v8013-bottom-inner{
        width:min(
          980px,
          100%
        );

        margin:auto;

        display:grid;

        grid-template-columns:
          repeat(
            4,
            1fr
          );

        gap:10px;
      }


      .mana-v8013-nav{
        min-height:64px;

        border:
          1px solid
          transparent;

        border-radius:16px;

        background:#0d0d0d;

        color:#888;

        font-size:13px;

        font-weight:800;

        cursor:pointer;
      }


      .mana-v8013-nav.active{
        background:#1d1807;

        color:#f3d875;

        border-color:#5c4d1a;
      }


      .mana-v8013-nav.logout{
        color:#c5c5c5;

        border-color:#252525;
      }


      .mana-v8013-nav.logout:hover{
        color:#f3d875;

        border-color:#5c4d1a;
      }


      .mana-v8013-nav.logout:disabled{
        opacity:.55;
      }


      @media(
        max-width:600px
      ){

        #${HOME_ID}{
          padding-left:8px;
          padding-right:8px;
        }


        .mana-v8013-program{
          min-height:185px;

          margin:
            18px
            0;

          padding:
            24px
            20px;
        }


        .mana-v8013-program-label{
          font-size:16px;
        }


        .mana-v8013-program h2{
          font-size:32px;
        }


        .mana-v8013-program p{
          max-width:94%;

          font-size:14px;
        }


        .mana-v8013-badge{
          top:16px;
          right:14px;

          font-size:9px;
        }


        .mana-v8013-brand h1{
          font-size:34px;
        }


        .mana-v8013-bottom{
          padding-left:7px;
          padding-right:7px;
        }


        .mana-v8013-bottom-inner{
          gap:6px;
        }


        .mana-v8013-nav{
          min-height:60px;

          font-size:11px;

          padding:
            6px
            3px;
        }

      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* =========================================
     PROFILE
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
     CURRENT PROGRAM
     ========================================= */

  function currentProgram() {
    try {

      const saved =
        localStorage.getItem(
          CURRENT_PROGRAM_KEY
        );


      if (saved) {
        return saved;
      }


      localStorage.setItem(
        CURRENT_PROGRAM_KEY,
        "strength"
      );


      return "strength";

    } catch (_) {

      return "strength";
    }
  }


  function setCurrentProgram(
    program
  ) {
    try {

      localStorage.setItem(
        CURRENT_PROGRAM_KEY,
        program
      );

    } catch (_) {}


    updateCurrentProgramUI();
  }


  function updateCurrentProgramUI() {
    const current =
      currentProgram();


    document
      .querySelectorAll(
        ".mana-v8013-program"
      )
      .forEach(
        card => {

          card.classList.toggle(
            "current",
            card.dataset.program ===
              current
          );

        }
      );
  }


  /* =========================================
     OLD UI
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
     PROGRAMS
     ========================================= */

  function openProgram(
    program
  ) {
    setCurrentProgram(
      program
    );


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
     LOGOUT
     ========================================= */

  async function logoutFromMana() {
    const button =
      document.getElementById(
        "manaV80LogoutBtn"
      );


    if (button) {

      button.disabled =
        true;

      button.innerHTML =
        "◌<br>Signing out…";

    }


    try {

      /*
        Use the existing secure logout
        function already built into Mana.
      */

      if (
        typeof window.logoutMana ===
        "function"
      ) {

        await window.logoutMana();

      } else if (
        typeof supabaseClient ===
        "function"
      ) {

        const c =
          await supabaseClient();


        await c.auth.signOut();

      }


      /*
        Close every modern Mana screen.
      */

      document
        .getElementById(
          "manaV83ProgramShell"
        )
        ?.classList
        .remove(
          "open"
        );


      document
        .getElementById(
          "manaProfileScreen"
        )
        ?.classList
        .remove(
          "open"
        );


      document
        .getElementById(
          "manaV81Intro"
        )
        ?.classList
        .remove(
          "open"
        );


      document
        .getElementById(
          "manaV95ChatModal"
        )
        ?.classList
        .remove(
          "open"
        );


      /*
        Hide the modern Home screen.
      */

      const home =
        document.getElementById(
          HOME_ID
        );


      if (home) {

        home.style.display =
          "none";

      }


      /*
        Ensure login is visible.
      */

      const auth =
        document.getElementById(
          "authView"
        );


      if (auth) {

        auth.classList.remove(
          "hide"
        );

        auth.style.display =
          "";

      }


      document.body.style.overflow =
        "";


      window.scrollTo({
        top:0,
        behavior:"instant"
      });


    } catch (error) {

      console.error(
        "Mana logout",
        error
      );


      if (button) {

        button.disabled =
          false;

        button.innerHTML =
          "↪<br>Logout";

      }


      alert(
        "Could not log out. Please try again."
      );

    }
  }


  /* =========================================
     BUILD HOME
     ========================================= */

  function buildHome() {
    if (
      document.getElementById(
        HOME_ID
      )
    ) {

      hideOldHome();

      updateCurrentProgramUI();

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
        class="mana-v8013-brand"
      >

        <div
          class="mana-v8013-brand-row"
        >

          <div
            class="mana-v8013-mark"
          >
            M
          </div>


          <div>

            <div
              class="mana-v8013-brand-title"
            >
              MANA MOVEMENT
            </div>


            <div
              class="mana-v8013-brand-kicker"
            >
              TRAINING • MOVE WITH PURPOSE
            </div>

          </div>

        </div>


        <h1>
          Move with Purpose
        </h1>


        <div
          class="mana-v8013-sub"
        >
          TRAINING • STRENGTH • LIFE
        </div>


        <div
          class="mana-v8013-welcome"
        >
          ${
            name
              ? `Kia ora, ${name}`
              : "Kia ora"
          }
        </div>

      </div>


      <!-- PROFILE -->

      <button
        type="button"
        class="mana-v8013-profile"
        id="manaV80ProfileSetup"
      >

        <div
          class="mana-v8013-profile-label"
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
          class="mana-v8013-profile-open"
        >
          Open profile →
        </div>

      </button>


      <!-- SELECT -->

      <div
        class="mana-v8013-select"
      >

        <strong>
          Select your program below
        </strong>


        <span>
          Your active program is
          highlighted in gold.
        </span>

      </div>


      <!-- MANA 28 -->

      <button
        type="button"
        class="mana-v8013-program"
        id="manaV80Mana28"
        data-program="mana28"
      >

        <div
          class="mana-v8013-badge"
        >
          FREE
        </div>


        <div
          class="mana-v8013-program-label"
        >
          MANA 28
        </div>


        <h2>
          28 Days
        </h2>


        <p>
          Training, habits, nutrition
          and daily action designed to
          build consistency and momentum.
        </p>


        <div
          class="mana-v8013-free-note"
        >
          Free access • No payment required
        </div>


        <div
          class="mana-v8013-current-badge"
        >
          Active program
        </div>


        <div
          class="mana-v8013-open"
        >
          Open MANA 28 →
        </div>

      </button>


      <!-- MANA STRENGTH -->

      <button
        type="button"
        class="mana-v8013-program"
        id="manaV80Strength"
        data-program="strength"
      >

        <div
          class="mana-v8013-badge"
        >
          MEMBERSHIP
        </div>


        <div
          class="mana-v8013-program-label"
        >
          MANA STRENGTH
        </div>


        <h2>
          Get Stronger
        </h2>


        <div
          class="mana-v8013-price"
        >

          <strong>
            $39.99
          </strong>

          <span>
            AUD / month
          </span>

        </div>


        <p>
          Personalised strength training,
          workout logging, Fuel guidance
          and progress tracking.
        </p>


        <div
          class="mana-v8013-current-badge"
        >
          Active program
        </div>


        <div
          class="mana-v8013-open"
        >
          Open MANA STRENGTH →
        </div>

      </button>


      <!-- MANA LIFE -->

      <button
        type="button"
        class="mana-v8013-program"
        id="manaV80Life"
        data-program="life"
      >

        <div
          class="mana-v8013-badge"
        >
          COMING SOON
        </div>


        <div
          class="mana-v8013-program-label"
        >
          MANA LIFE
        </div>


        <h2>
          Reclaim
        </h2>


        <p>
          Mindset, routine, reflection
          and daily actions designed
          to rebuild momentum.
        </p>


        <div
          class="mana-v8013-current-badge"
        >
          Active program
        </div>


        <div
          class="mana-v8013-open"
        >
          Open MANA LIFE →
        </div>

      </button>


      <!-- BOTTOM NAV -->

      <div
        class="mana-v8013-bottom"
      >

        <div
          class="mana-v8013-bottom-inner"
        >

          <button
            type="button"
            class="
              mana-v8013-nav
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
            class="mana-v8013-nav"
            id="manaV80IntroBtn"
          >
            ◌
            <br>
            Intro
          </button>


          <button
            type="button"
            class="mana-v8013-nav"
            id="manaV80ProfileBtn"
          >
            ◎
            <br>
            Profile
          </button>


          <button
            type="button"
            class="
              mana-v8013-nav
              logout
            "
            id="manaV80LogoutBtn"
          >
            ↪
            <br>
            Logout
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


    /* ==========================
       BUTTONS
       ========================== */

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


    document
      .getElementById(
        "manaV80LogoutBtn"
      )
      .onclick =
        logoutFromMana;


    updateCurrentProgramUI();
  }


  /* =========================================
     PROFILE REFRESH
     ========================================= */

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
        ".mana-v8013-welcome"
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


  /* =========================================
     HOME
     ========================================= */

  function enforceHome() {
    hideOldHome();

    buildHome();

    updateCurrentProgramUI();
  }


  /* =========================================
     INIT
     ========================================= */

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

        const home =
          document.getElementById(
            HOME_ID
          );


        /*
          Do not re-show Home after
          the user has logged out.
        */

        try {

          if (
            typeof currentUser !==
              "undefined" &&
            !currentUser
          ) {

            return;

          }

        } catch (_) {}


        if (home) {

          hideOldHome();

          updateCurrentProgramUI();

        }

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
