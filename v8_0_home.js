/* =========================================
   MANA MOVEMENT TRAINING v8.0.9
   HOME

   WIDER PROGRAM CARDS
   CURRENT PROGRAM HIGHLIGHT
   MANA 28 FREE
   MANA STRENGTH PRICING
   ========================================= */

(() => {
  "use strict";


  const HOME_ID =
    "manaV80Home";

  const STYLE_ID =
    "mana-v809-home-style";

  const CURRENT_PROGRAM_KEY =
    "mana-current-program";


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
          620px,
          100%
        );

        margin:
          0
          auto;

        padding:
          calc(
            env(
              safe-area-inset-top
            ) + 16px
          )
          10px
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

      .mana-v809-brand{
        padding:
          0
          8px;

        margin-bottom:20px;
      }


      .mana-v809-brand-row{
        display:flex;

        align-items:center;

        gap:14px;

        margin-bottom:16px;
      }


      .mana-v809-mark{
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


      .mana-v809-brand-title{
        color:#fff;

        font-size:18px;

        font-weight:900;

        letter-spacing:.15em;

        line-height:1.2;

        text-transform:uppercase;
      }


      .mana-v809-brand-kicker{
        margin-top:6px;

        color:#f3d875;

        font-size:11px;

        font-weight:900;

        letter-spacing:.16em;

        text-transform:uppercase;
      }


      .mana-v809-brand h1{
        margin:0;

        font-size:34px;

        line-height:1.05;
      }


      .mana-v809-sub{
        margin-top:8px;

        color:#f3d875;

        font-size:12px;

        font-weight:800;

        letter-spacing:.12em;

        text-transform:uppercase;
      }


      .mana-v809-welcome{
        margin-top:12px;

        color:#999;

        font-size:15px;
      }


      /* ==========================
         PROFILE
         ========================== */

      .mana-v809-profile{
        width:
          calc(
            100% - 8px
          );

        margin:
          18px
          4px
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
      }


      .mana-v809-profile-label{
        color:#f3d875;

        font-size:10px;

        font-weight:900;

        letter-spacing:.13em;

        text-transform:uppercase;
      }


      .mana-v809-profile h2{
        margin:
          6px
          0;

        font-size:23px;
      }


      .mana-v809-profile p{
        margin:0;

        color:#aaa;

        font-size:13px;

        line-height:1.45;
      }


      .mana-v809-profile-open{
        margin-top:12px;

        color:#f3d875;

        font-size:13px;

        font-weight:900;
      }


      /* ==========================
         SELECT
         ========================== */

      .mana-v809-select{
        margin:
          26px
          4px
          14px;

        padding:
          18px
          16px;

        border:
          1px solid
          #333;

        border-radius:18px;

        background:#0d0d0d;

        text-align:center;
      }


      .mana-v809-select strong{
        display:block;

        color:#f3d875;

        font-size:15px;

        font-weight:900;

        letter-spacing:.08em;

        text-transform:uppercase;
      }


      .mana-v809-select span{
        display:block;

        margin-top:6px;

        color:#888;

        font-size:12px;
      }


      /* ==========================
         PROGRAMS
         ========================== */

      .mana-v809-program{
        position:relative;

        width:
          calc(
            100% - 8px
          );

        min-height:166px;

        margin:
          12px
          4px;

        padding:
          22px
          20px;

        text-align:left;

        border:
          1px solid
          #302915;

        border-radius:24px;

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


      .mana-v809-program:active,
      .mana-v809-profile:active{
        transform:
          scale(.99);
      }


      .mana-v809-program.current{
        border:
          1px solid
          #b99832;

        background:
          linear-gradient(
            145deg,
            #1e1909,
            #0a0a08
          );

        box-shadow:
          0
          0
          0
          1px
          rgba(
            243,
            216,
            117,
            .08
          ),
          0
          8px
          30px
          rgba(
            212,
            175,
            55,
            .08
          );
      }


      .mana-v809-program-label{
        color:#f3d875;

        font-size:11px;

        font-weight:900;

        letter-spacing:.12em;

        margin-bottom:8px;

        text-transform:uppercase;
      }


      .mana-v809-program h2{
        margin:0;

        font-size:30px;

        line-height:1;
      }


      .mana-v809-program p{
        margin:
          10px
          0
          0;

        max-width:90%;

        color:#aaa;

        font-size:14px;

        line-height:1.5;
      }


      .mana-v809-open{
        margin-top:15px;

        color:#f3d875;

        font-size:13px;

        font-weight:900;
      }


      .mana-v809-badge{
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

        letter-spacing:.07em;

        text-transform:uppercase;
      }


      .mana-v809-current-badge{
        display:none;

        margin-top:12px;

        width:max-content;

        padding:
          6px
          9px;

        border-radius:999px;

        border:
          1px solid
          #8b742a;

        background:#211b08;

        color:#f3d875;

        font-size:10px;

        font-weight:900;

        letter-spacing:.08em;

        text-transform:uppercase;
      }


      .mana-v809-program.current
      .mana-v809-current-badge{
        display:block;
      }


      .mana-v809-free-note{
        margin-top:10px;

        color:#d9c36d;

        font-size:12px;

        font-weight:800;
      }


      .mana-v809-price{
        margin-top:11px;

        color:#fff;
      }


      .mana-v809-price strong{
        color:#f3d875;

        font-size:23px;

        font-weight:900;
      }


      .mana-v809-price span{
        color:#888;

        font-size:12px;

        margin-left:4px;
      }


      .mana-v809-coming{
        color:#888;

        font-size:12px;

        font-weight:800;

        margin-top:11px;
      }


      /* ==========================
         BOTTOM NAV
         ========================== */

      .mana-v809-bottom{
        position:fixed;

        z-index:19000;

        left:0;
        right:0;
        bottom:0;

        padding:
          8px
          10px
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


      .mana-v809-bottom-inner{
        width:min(
          620px,
          100%
        );

        margin:auto;

        display:grid;

        grid-template-columns:
          repeat(
            3,
            1fr
          );

        gap:6px;
      }


      .mana-v809-nav{
        min-height:58px;

        border:0;

        border-radius:14px;

        background:#0d0d0d;

        color:#888;

        font-size:12px;

        font-weight:800;
      }


      .mana-v809-nav.active{
        background:#191607;

        color:#f3d875;

        border:
          1px solid
          #4a3d12;
      }


      @media(
        max-width:390px
      ){

        #${HOME_ID}{
          padding-left:6px;
          padding-right:6px;
        }


        .mana-v809-program{
          width:
            calc(
              100% - 4px
            );

          margin-left:2px;
          margin-right:2px;

          padding:
            20px
            17px;
        }


        .mana-v809-program h2{
          font-size:27px;
        }


        .mana-v809-badge{
          top:14px;
          right:12px;

          font-size:9px;
        }

      }

    `;


    document.head.appendChild(
      style
    );
  }


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


  function currentProgram() {
    try {

      return (
        localStorage.getItem(
          CURRENT_PROGRAM_KEY
        ) ||
        ""
      );

    } catch (_) {

      return "";
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
        ".mana-v809-program"
      )
      .forEach(
        card => {

          card.classList.toggle(
            "current",
            card.dataset
              .program ===
              current
          );

        }
      );
  }


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
        class="mana-v809-brand"
      >

        <div
          class="mana-v809-brand-row"
        >

          <div
            class="mana-v809-mark"
          >
            M
          </div>


          <div>

            <div
              class="mana-v809-brand-title"
            >
              MANA MOVEMENT
            </div>


            <div
              class="mana-v809-brand-kicker"
            >
              TRAINING • MOVE WITH PURPOSE
            </div>

          </div>

        </div>


        <h1>
          Move with Purpose
        </h1>


        <div
          class="mana-v809-sub"
        >
          TRAINING • STRENGTH • LIFE
        </div>


        <div
          class="mana-v809-welcome"
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
        class="mana-v809-profile"
        id="manaV80ProfileSetup"
      >

        <div
          class="mana-v809-profile-label"
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
          class="mana-v809-profile-open"
        >
          Open profile →
        </div>

      </button>


      <div
        class="mana-v809-select"
      >

        <strong>
          Select your program below
        </strong>


        <span>
          Choose the program you want
          to work in.
        </span>

      </div>


      <button
        type="button"
        class="mana-v809-program"
        id="manaV80Mana28"
        data-program="mana28"
      >

        <div
          class="mana-v809-badge"
        >
          FREE
        </div>


        <div
          class="mana-v809-program-label"
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
          class="mana-v809-free-note"
        >
          Free access • No payment required
        </div>


        <div
          class="mana-v809-current-badge"
        >
          Current program
        </div>


        <div
          class="mana-v809-open"
        >
          Select MANA 28 →
        </div>

      </button>


      <button
        type="button"
        class="mana-v809-program"
        id="manaV80Strength"
        data-program="strength"
      >

        <div
          class="mana-v809-badge"
        >
          MEMBERSHIP
        </div>


        <div
          class="mana-v809-program-label"
        >
          MANA STRENGTH
        </div>


        <h2>
          Get Stronger
        </h2>


        <div
          class="mana-v809-price"
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
          class="mana-v809-current-badge"
        >
          Current program
        </div>


        <div
          class="mana-v809-open"
        >
          Select MANA STRENGTH →
        </div>

      </button>


      <button
        type="button"
        class="mana-v809-program"
        id="manaV80Life"
        data-program="life"
      >

        <div
          class="mana-v809-badge"
        >
          COMING SOON
        </div>


        <div
          class="mana-v809-program-label"
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
          class="mana-v809-current-badge"
        >
          Current program
        </div>


        <div
          class="mana-v809-open"
        >
          Select MANA LIFE →
        </div>

      </button>


      <div
        class="mana-v809-bottom"
      >

        <div
          class="mana-v809-bottom-inner"
        >

          <button
            type="button"
            class="
              mana-v809-nav
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
            class="mana-v809-nav"
            id="manaV80IntroBtn"
          >
            ◌
            <br>
            Intro
          </button>


          <button
            type="button"
            class="mana-v809-nav"
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


    updateCurrentProgramUI();
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
        ".mana-v809-welcome"
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

    updateCurrentProgramUI();
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

        updateCurrentProgramUI();

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
