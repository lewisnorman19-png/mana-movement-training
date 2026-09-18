/* =========================================
   MANA MOVEMENT TRAINING v8.0
   HOME — BRAND + PROGRAMS + PROFILE + INTRO
   ========================================= */

(() => {
  "use strict";

  const HOME_ID =
    "manaV80Home";

  const STYLE_ID =
    "mana-v80-home-style";


  function injectStyles() {
    if (
      document.getElementById(
        STYLE_ID
      )
    ) return;

    const style =
      document.createElement(
        "style"
      );

    style.id =
      STYLE_ID;

    style.textContent = `

      #${HOME_ID}{
        width:min(520px,100%);
        margin:0 auto;

        padding:
          calc(env(safe-area-inset-top) + 18px)
          18px
          calc(105px + env(safe-area-inset-bottom));
      }


      /* ==========================
         BRAND
         ========================== */

      .mana-v80-brand{
        margin-bottom:24px;
      }


      .mana-v80-brand-row{
        display:flex;
        align-items:center;
        gap:14px;
        margin-bottom:16px;
      }


      .mana-v80-mark{
        width:58px;
        height:58px;

        flex:0 0 58px;

        display:grid;
        place-items:center;

        border:
          2px solid
          #d4af37;

        color:#f3d875;

        font:
          700
          38px
          Georgia,
          serif;

        background:#070707;
      }


      .mana-v80-brand-title{
        color:#fff;

        font-size:18px;

        font-weight:900;

        letter-spacing:.15em;

        line-height:1.2;

        text-transform:uppercase;
      }


      .mana-v80-brand-kicker{
        margin-top:6px;

        color:#f3d875;

        font-size:11px;

        font-weight:900;

        letter-spacing:.16em;

        text-transform:uppercase;
      }


      .mana-v80-brand h1{
        margin:0;

        font-size:34px;

        line-height:1.05;

        letter-spacing:.03em;
      }


      .mana-v80-brand-sub{
        margin-top:8px;

        color:#f3d875;

        font-size:12px;

        font-weight:800;

        letter-spacing:.12em;

        text-transform:uppercase;
      }


      .mana-v80-welcome{
        margin-top:12px;

        color:#999;

        font-size:15px;
      }


      /* ==========================
         PROFILE CTA
         ========================== */

      .mana-v80-profile-cta{
        width:100%;

        min-height:116px;

        margin:
          20px
          0
          26px;

        padding:18px;

        text-align:left;

        border-radius:22px;

        border:
          1px solid
          #4a3d12;

        background:
          linear-gradient(
            145deg,
            #17150d,
            #0b0b0b
          );

        color:#fff;

        cursor:pointer;
      }


      .mana-v80-profile-label{
        color:#f3d875;

        font-size:11px;

        font-weight:900;

        letter-spacing:.12em;

        text-transform:uppercase;
      }


      .mana-v80-profile-cta h2{
        margin:
          6px
          0
          6px;

        font-size:24px;
      }


      .mana-v80-profile-cta p{
        margin:0;

        color:#aaa;

        font-size:13px;

        line-height:1.45;
      }


      .mana-v80-profile-open{
        margin-top:12px;

        color:#f3d875;

        font-size:13px;

        font-weight:900;
      }


      /* ==========================
         PROGRAMS
         ========================== */

      .mana-v80-heading{
        margin:
          26px
          0
          12px;

        color:#aaa;

        font-size:12px;

        font-weight:900;

        letter-spacing:.12em;
      }


      .mana-v80-program{
        width:100%;

        min-height:142px;

        margin:12px 0;

        padding:20px;

        text-align:left;

        border-radius:24px;

        border:
          1px solid
          #292310;

        background:
          linear-gradient(
            145deg,
            #141414,
            #090909
          );

        color:#fff;

        cursor:pointer;
      }


      .mana-v80-program:active,
      .mana-v80-profile-cta:active{
        transform:scale(.99);
      }


      .mana-v80-program-label{
        color:#f3d875;

        font-size:12px;

        font-weight:900;

        letter-spacing:.12em;

        margin-bottom:8px;
      }


      .mana-v80-program h2{
        margin:0;

        font-size:28px;

        line-height:1;
      }


      .mana-v80-program p{
        margin:
          9px
          0
          0;

        color:#aaa;

        font-size:14px;

        line-height:1.45;
      }


      .mana-v80-open{
        margin-top:14px;

        color:#f3d875;

        font-size:13px;

        font-weight:900;
      }


      /* ==========================
         BOTTOM NAV
         ========================== */

      .mana-v80-bottom{
        position:fixed;

        z-index:19000;

        left:0;
        right:0;
        bottom:0;

        background:#050505f2;

        border-top:
          1px solid
          #272727;

        padding:
          8px
          16px
          calc(8px + env(safe-area-inset-bottom));

        backdrop-filter:
          blur(14px);
      }


      .mana-v80-bottom-inner{
        width:min(520px,100%);

        margin:auto;

        display:grid;

        grid-template-columns:
          repeat(3,1fr);

        gap:8px;
      }


      .mana-v80-nav{
        min-height:54px;

        border:0;

        background:none;

        color:#888;

        font-weight:800;

        font-size:12px;
      }


      .mana-v80-nav.active{
        color:#f3d875;
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
        profile.name || ""
      );

    } catch (_) {
      return "";
    }
  }


  function hideOldHome() {
    const client =
      document.getElementById(
        "clientView"
      );

    if (client) {
      client.style.display =
        "none";
    }


    const nav =
      document.getElementById(
        "bottomNav"
      );

    if (nav) {
      nav.style.display =
        "none";
    }
  }


  function findByText(
    text
  ) {
    const wanted =
      text.toUpperCase();

    const elements =
      [
        ...document.querySelectorAll(
          "button, .day, .card"
        )
      ];

    return elements.find(
      el =>
        (el.textContent || "")
          .toUpperCase()
          .includes(
            wanted
          )
    );
  }


  function openStrength() {
    const target =
      findByText(
        "MANA STRENGTH"
      ) ||
      findByText(
        "MANA STRONG"
      );

    target?.click();
  }


  function openMana28() {
    const target =
      findByText(
        "MANA 28"
      );

    if (target) {
      target.click();
      return;
    }


    const programButton =
      [
        ...document.querySelectorAll(
          "[data-page]"
        )
      ].find(
        btn =>
          String(
            btn.dataset.page || ""
          )
            .toLowerCase()
            .includes(
              "program"
            )
      );

    programButton?.click();
  }


  function openManaLife() {
    const target =
      findByText(
        "MANA LIFE"
      ) ||
      findByText(
        "RECLAIM"
      );

    if (target) {
      target.click();
      return;
    }

    alert(
      "Mana Life is the next program we’re building."
    );
  }


  function openProfile() {
    if (
      typeof
        window.openManaProfile ===
      "function"
    ) {
      window.openManaProfile();
    }
  }


  function openIntro() {
    if (
      typeof
        window.openManaIntroduction ===
      "function"
    ) {
      window.openManaIntroduction();
    }
  }


  function buildHome() {
    if (
      document.getElementById(
        HOME_ID
      )
    ) return;


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
        class="mana-v80-brand"
      >

        <div
          class="mana-v80-brand-row"
        >

          <div
            class="mana-v80-mark"
          >
            M
          </div>

          <div>

            <div
              class="mana-v80-brand-title"
            >
              MANA MOVEMENT
            </div>

            <div
              class="mana-v80-brand-kicker"
            >
              TRAINING • MOVE WITH PURPOSE
            </div>

          </div>

        </div>


        <h1>
          Move with Purpose
        </h1>


        <div
          class="mana-v80-brand-sub"
        >
          TRAINING • STRENGTH • LIFE
        </div>


        <div
          class="mana-v80-welcome"
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
        class="mana-v80-profile-cta"
        id="manaV80ProfileSetup"
      >

        <div
          class="mana-v80-profile-label"
        >
          YOUR PROFILE
        </div>

        <h2>
          Set your goals
        </h2>

        <p>
          Tell Mana Movement your goal,
          training days, experience and
          equipment so your programs can
          be built around you.
        </p>

        <div
          class="mana-v80-profile-open"
        >
          Open profile →
        </div>

      </button>


      <div
        class="mana-v80-heading"
      >
        YOUR PROGRAMS
      </div>


      <button
        type="button"
        class="mana-v80-program"
        id="manaV80Mana28"
      >

        <div
          class="mana-v80-program-label"
        >
          MANA 28
        </div>

        <h2>
          28 Days
        </h2>

        <p>
          Training, habits, nutrition
          and daily action built around
          moving with purpose.
        </p>

        <div
          class="mana-v80-open"
        >
          Open program →
        </div>

      </button>


      <button
        type="button"
        class="mana-v80-program"
        id="manaV80Strength"
      >

        <div
          class="mana-v80-program-label"
        >
          MANA STRENGTH
        </div>

        <h2>
          Get Stronger
        </h2>

        <p>
          Your personalised strength
          program, workout logging,
          progress and performance.
        </p>

        <div
          class="mana-v80-open"
        >
          Open program →
        </div>

      </button>


      <button
        type="button"
        class="mana-v80-program"
        id="manaV80Life"
      >

        <div
          class="mana-v80-program-label"
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
          class="mana-v80-open"
        >
          Open program →
        </div>

      </button>


      <div
        class="mana-v80-bottom"
      >

        <div
          class="mana-v80-bottom-inner"
        >

          <button
            type="button"
            class="mana-v80-nav active"
            id="manaV80HomeBtn"
          >
            ⌂<br>Home
          </button>


          <button
            type="button"
            class="mana-v80-nav"
            id="manaV80IntroBtn"
          >
            ◌<br>Intro
          </button>


          <button
            type="button"
            class="mana-v80-nav"
            id="manaV80ProfileBtn"
          >
            ◎<br>Profile
          </button>

        </div>

      </div>

    `;


    const wrap =
      document.querySelector(
        ".wrap"
      );

    const header =
      wrap?.querySelector(
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

      document.body.appendChild(
        home
      );

    }


    document
      .getElementById(
        "manaV80Mana28"
      )
      .onclick =
        openMana28;


    document
      .getElementById(
        "manaV80Strength"
      )
      .onclick =
        openStrength;


    document
      .getElementById(
        "manaV80Life"
      )
      .onclick =
        openManaLife;


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

    if (!home) return;


    const welcome =
      home.querySelector(
        ".mana-v80-welcome"
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


  function init() {
    injectStyles();


    setTimeout(
      buildHome,
      600
    );


    setTimeout(
      buildHome,
      1500
    );


    window.addEventListener(
      "mana:profile-synced",
      refreshName
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
