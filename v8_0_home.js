/* =========================================
   MANA MOVEMENT TRAINING v8.0
   NEW PROGRAM-FIRST HOME
   ========================================= */

(() => {
  "use strict";

  const HOME_ID = "manaV80Home";
  const STYLE_ID = "mana-v80-home-style";

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style =
      document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `
      #${HOME_ID}{
        width:min(520px,100%);
        margin:0 auto;
        padding:
          calc(env(safe-area-inset-top) + 18px)
          18px
          calc(100px + env(safe-area-inset-bottom));
      }

      .mana-v80-brand{
        margin-bottom:22px;
      }

      .mana-v80-brand small{
        display:block;
        color:#f3d875;
        letter-spacing:.18em;
        font-size:11px;
        font-weight:800;
        margin-bottom:8px;
      }

      .mana-v80-brand h1{
        margin:0;
        font-size:28px;
        letter-spacing:.08em;
      }

      .mana-v80-welcome{
        margin-top:8px;
        color:#999;
        font-size:15px;
      }

      .mana-v80-quote{
        margin:22px 0;
        padding:18px;
        border:1px solid #3a321a;
        border-radius:20px;
        background:
          linear-gradient(
            145deg,
            #12110d,
            #0b0b0b
          );
      }

      .mana-v80-quote-maori{
        color:#f3d875;
        font-family:Georgia,serif;
        font-size:19px;
        line-height:1.5;
        font-style:italic;
      }

      .mana-v80-quote-en{
        color:#999;
        font-size:12px;
        line-height:1.5;
        margin-top:8px;
      }

      .mana-v80-heading{
        margin:26px 0 12px;
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
        border:1px solid #292310;
        background:
          linear-gradient(
            145deg,
            #141414,
            #090909
          );
        color:white;
        cursor:pointer;
      }

      .mana-v80-program:active{
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
        margin:9px 0 0;
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

      .mana-v80-bottom{
        position:fixed;
        z-index:19000;
        left:0;
        right:0;
        bottom:0;
        background:#050505f2;
        border-top:1px solid #272727;
        padding:
          8px
          16px
          calc(8px + env(safe-area-inset-bottom));
        backdrop-filter:blur(14px);
      }

      .mana-v80-bottom-inner{
        width:min(520px,100%);
        margin:auto;
        display:grid;
        grid-template-columns:1fr 1fr;
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

    document.head.appendChild(style);
  }

  function profileName() {
    try {
      const profile =
        JSON.parse(
          localStorage.getItem(
            "mana-profile-v67"
          ) || "{}"
        );

      return profile.name || "";
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
      client.style.display = "none";
    }

    const nav =
  document.getElementById(
    "bottomNav"
  );

    if (nav) {
      nav.style.display = "none";
    }
  }

  function findByText(text) {
    const wanted =
      text.toUpperCase();

    const elements =
      [
        ...document.querySelectorAll(
          "button, .day, .card"
        )
      ];

    return elements.find(el =>
      (el.textContent || "")
        .toUpperCase()
        .includes(wanted)
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

    if (target) {
      target.click();
    }
  }

  function openMana28() {
    /*
      First try existing MANA 28 card.
    */
    const target =
      findByText("MANA 28");

    if (target) {
      target.click();
      return;
    }

    /*
      Otherwise use the existing
      Programs navigation.
    */
    const programButton =
      [
        ...document.querySelectorAll(
          "[data-page]"
        )
      ].find(btn =>
        String(
          btn.dataset.page || ""
        )
          .toLowerCase()
          .includes("program")
      );

    if (programButton) {
      programButton.click();
    }
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
      typeof window.openManaProfile ===
      "function"
    ) {
      window.openManaProfile();
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
      document.createElement("div");

    home.id = HOME_ID;

    home.innerHTML = `
      <div class="mana-v80-brand">

        <small>
          MANA MOVEMENT TRAINING
        </small>

        <h1>
          Move with Purpose
        </h1>

        <div class="mana-v80-welcome">
          ${
            name
              ? `Kia ora, ${name}`
              : "Kia ora"
          }
        </div>

      </div>

      <div class="mana-v80-quote">

        <div class="mana-v80-quote-maori">
          “Whāia te iti kahurangi,
          ki te tuohu koe,
          me he maunga teitei.”
        </div>

        <div class="mana-v80-quote-en">
          Pursue what is precious,
          and if you bow your head,
          let it be to a lofty mountain.
        </div>

      </div>

      <div class="mana-v80-heading">
        YOUR PROGRAMS
      </div>

      <button
        type="button"
        class="mana-v80-program"
        id="manaV80Mana28"
      >
        <div class="mana-v80-program-label">
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

        <div class="mana-v80-open">
          Open program →
        </div>
      </button>

      <button
        type="button"
        class="mana-v80-program"
        id="manaV80Strength"
      >
        <div class="mana-v80-program-label">
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

        <div class="mana-v80-open">
          Open program →
        </div>
      </button>

      <button
        type="button"
        class="mana-v80-program"
        id="manaV80Life"
      >
        <div class="mana-v80-program-label">
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

        <div class="mana-v80-open">
          Open program →
        </div>
      </button>

      <div class="mana-v80-bottom">
        <div class="mana-v80-bottom-inner">

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
  header.insertAdjacentElement(
    "afterend",
    home
  );
} else if (wrap) {
  wrap.appendChild(home);
} else {
  document.body.appendChild(home);
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
        "manaV80ProfileBtn"
      )
      .onclick =
        openProfile;
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
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }

})();
