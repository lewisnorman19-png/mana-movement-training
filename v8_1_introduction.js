/* =========================================
   MANA MOVEMENT TRAINING v8.1
   INTRODUCTION / KAUPAPA PAGE
   ========================================= */

(() => {
  "use strict";

  const INTRO_ID = "manaV81Intro";
  const STYLE_ID = "mana-v81-intro-style";

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style =
      document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `
      #${INTRO_ID}{
        position:fixed;
        inset:0;
        z-index:50000;
        display:none;
        overflow:auto;
        background:
          radial-gradient(
            circle at top right,
            rgba(243,216,117,.06),
            transparent 28%
          ),
          #050505;
        color:#f5f5f5;
        padding:
          calc(env(safe-area-inset-top) + 20px)
          18px
          calc(40px + env(safe-area-inset-bottom));
      }

      #${INTRO_ID}.open{
        display:block;
      }

      .mana-v81-shell{
        position:relative;
        width:min(560px,100%);
        margin:auto;
        overflow:hidden;
      }

      .mana-v81-koru{
        position:absolute;
        pointer-events:none;
        z-index:0;
        opacity:.16;
      }

      .mana-v81-koru svg{
        width:100%;
        height:100%;
        overflow:visible;
      }

      .mana-v81-koru path{
        fill:none;
        stroke:#f3d875;
        stroke-width:5;
        stroke-linecap:round;
        stroke-linejoin:round;
      }

      .mana-v81-koru.top{
        width:210px;
        height:210px;
        top:-42px;
        right:-65px;
        transform:rotate(18deg);
      }

      .mana-v81-koru.bottom{
        width:220px;
        height:220px;
        bottom:40px;
        left:-95px;
        transform:
          rotate(205deg)
          scale(.9);
        opacity:.1;
      }

      .mana-v81-content{
        position:relative;
        z-index:2;
      }

      .mana-v81-mark{
        width:62px;
        height:62px;
        display:grid;
        place-items:center;
        margin:8px auto 14px;
        border:2px solid #d4af37;
        color:#f3d875;
        font:
          700 40px Georgia,serif;
      }

      .mana-v81-kicker{
        text-align:center;
        color:#f3d875;
        font-size:11px;
        font-weight:900;
        letter-spacing:.22em;
        margin-top:6px;
      }

      .mana-v81-title{
        margin:18px auto 12px;
        max-width:440px;
        text-align:center;
        font-size:
          clamp(34px,8vw,48px);
        line-height:.98;
      }

      .mana-v81-title span{
        color:#f3d875;
      }

      .mana-v81-lead{
        max-width:480px;
        margin:18px auto 28px;
        text-align:center;
        color:#b7b7b7;
        font-size:15px;
        line-height:1.65;
      }

      .mana-v81-card{
        position:relative;
        margin:14px 0;
        padding:20px;
        border-radius:22px;
        border:1px solid #2b2b2b;
        background:
          linear-gradient(
            145deg,
            #111,
            #090909
          );
      }

      .mana-v81-card h2{
        margin:0 0 10px;
        font-size:22px;
      }

      .mana-v81-card p{
        margin:0;
        color:#aaa;
        line-height:1.65;
        font-size:14px;
      }

      .mana-v81-divider{
        display:flex;
        align-items:center;
        justify-content:center;
        gap:12px;
        margin:28px 0;
        color:#f3d875;
      }

      .mana-v81-divider::before,
      .mana-v81-divider::after{
        content:"";
        height:1px;
        flex:1;
        background:
          linear-gradient(
            90deg,
            transparent,
            #665624
          );
      }

      .mana-v81-divider::after{
        background:
          linear-gradient(
            90deg,
            #665624,
            transparent
          );
      }

      .mana-v81-mini-koru{
        width:30px;
        height:30px;
      }

      .mana-v81-mini-koru path{
        fill:none;
        stroke:#f3d875;
        stroke-width:5;
        stroke-linecap:round;
      }

      .mana-v81-quote{
        position:relative;
        margin:18px 0;
        padding:24px 20px;
        border-radius:22px;
        border:1px solid #423817;
        background:
          linear-gradient(
            145deg,
            #141208,
            #0b0b0b
          );
        overflow:hidden;
      }

      .mana-v81-quote::after{
        content:"";
        position:absolute;
        width:120px;
        height:120px;
        right:-42px;
        bottom:-45px;
        border:
          2px solid
          rgba(243,216,117,.12);
        border-radius:50%;
        box-shadow:
          0 0 0 18px
          rgba(243,216,117,.025),
          0 0 0 36px
          rgba(243,216,117,.018);
      }

      .mana-v81-label{
        color:#f3d875;
        font-size:11px;
        font-weight:900;
        letter-spacing:.16em;
        margin-bottom:12px;
      }

      .mana-v81-maori{
        position:relative;
        z-index:2;
        font-family:Georgia,serif;
        color:#f3d875;
        font-size:20px;
        line-height:1.55;
        font-style:italic;
      }

      .mana-v81-translation{
        position:relative;
        z-index:2;
        color:#aaa;
        font-size:13px;
        line-height:1.55;
        margin-top:12px;
      }

      .mana-v81-karakia{
        text-align:center;
      }

      .mana-v81-karakia .mana-v81-maori{
        font-size:18px;
        font-style:normal;
        line-height:1.7;
      }

      .mana-v81-close{
        margin-top:24px;
        text-align:center;
      }

      .mana-v81-close h3{
        margin:0 0 6px;
        font-size:22px;
      }

      .mana-v81-close p{
        color:#999;
        margin:0 0 18px;
        font-size:13px;
      }

      .mana-v81-enter{
        width:100%;
        min-height:60px;
        border:0;
        border-radius:18px;
        background:
          linear-gradient(
            135deg,
            #f3d875,
            #b98d2b
          );
        color:#090909;
        font-size:16px;
        font-weight:900;
        letter-spacing:.02em;
      }

      .mana-v81-replay-close{
        width:100%;
        margin-top:10px;
        min-height:44px;
        border:1px solid #333;
        border-radius:14px;
        background:#111;
        color:#aaa;
        font-weight:800;
      }
    `;

    document.head.appendChild(style);
  }

  function koruSvg() {
    return `
      <svg
        viewBox="0 0 200 200"
        aria-hidden="true"
      >
        <path
          d="
            M172 105
            C170 53 126 24 83 39
            C43 53 30 99 53 129
            C73 155 112 153 128 126
            C143 102 129 73 104 70
            C82 67 65 86 70 105
            C74 121 93 129 106 119
            C116 111 116 97 108 91
            C101 86 92 88 89 95
          "
        />

        <path
          d="
            M52 129
            C35 143 25 161 22 181
          "
        />
      </svg>
    `;
  }

  function createIntro() {
    if (
      document.getElementById(
        INTRO_ID
      )
    ) return;

    const intro =
      document.createElement("div");

    intro.id = INTRO_ID;

    intro.innerHTML = `
      <div class="mana-v81-shell">

        <div class="mana-v81-koru top">
          ${koruSvg()}
        </div>

        <div class="mana-v81-koru bottom">
          ${koruSvg()}
        </div>

        <div class="mana-v81-content">

          <div class="mana-v81-mark">
            M
          </div>

          <div class="mana-v81-kicker">
            NAU MAI • WELCOME
          </div>

          <h1 class="mana-v81-title">
            More than fitness.
            <span>
              Movement with purpose.
            </span>
          </h1>

          <p class="mana-v81-lead">
            Mana Movement is a place to
            build strength, create
            discipline, restore confidence
            and move forward with intention.
            Training matters — but it is
            only one part of the journey.
          </p>

          <div class="mana-v81-card">
            <div class="mana-v81-label">
              THE KAUPAPA
            </div>

            <h2>
              What does Mana Movement mean?
            </h2>

            <p>
              In te ao Māori, mana carries
              ideas of dignity, standing,
              influence, authority and
              personal presence.
              <br><br>
              Mana Movement is about
              strengthening ourselves from
              the inside out — through
              movement, discipline,
              resilience, wellbeing,
              connection and purpose.
              <br><br>
              This is not simply about
              looking fitter. It is about
              becoming stronger in how we
              live, how we think and how
              we move through the world.
            </p>
          </div>

          <div class="mana-v81-divider">
            <svg
              class="mana-v81-mini-koru"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <path
                d="
                  M82 53
                  C81 27 59 14 39 23
                  C21 31 18 54 30 67
                  C41 79 61 73 64 58
                  C67 46 58 38 49 40
                  C42 42 40 50 44 54
                "
              />
            </svg>
          </div>

          <div class="mana-v81-quote">
            <div class="mana-v81-label">
              WHAKATAUKĪ
            </div>

            <div class="mana-v81-maori">
              Whāia te iti kahurangi,
              ki te tūohu koe,
              me he maunga teitei.
            </div>

            <div class="mana-v81-translation">
              Pursue what is precious —
              and if you bow your head,
              let it be to a lofty mountain.
            </div>
          </div>

          <div class="mana-v81-divider">
            <svg
              class="mana-v81-mini-koru"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <path
                d="
                  M82 53
                  C81 27 59 14 39 23
                  C21 31 18 54 30 67
                  C41 79 61 73 64 58
                  C67 46 58 38 49 40
                  C42 42 40 50 44 54
                "
              />
            </svg>
          </div>

          <div class="
            mana-v81-card
            mana-v81-karakia
          ">
            <div class="mana-v81-label">
              KARAKIA
            </div>

            <div class="mana-v81-maori">
              Whakataka te hau ki te uru<br>
              Whakataka te hau ki te tonga<br>
              Kia mākinakina ki uta<br>
              Kia mātaratara ki tai<br>
              E hī ake ana te atākura<br>
              He tio, he huka, he hau hū<br>
              Tihei mauri ora
            </div>

            <div class="mana-v81-translation">
              An opening karakia to clear
              the way, bring focus and
              readiness, and acknowledge
              the beginning of a new day
              and a new journey.
            </div>
          </div>

          <div class="mana-v81-close">

            <h3>
              Move with purpose.
            </h3>

            <p>
              Build strength.
              Create momentum.
              Grow your mana.
            </p>

            <button
              type="button"
              class="mana-v81-enter"
              id="manaV81Enter"
            >
              ENTER MANA MOVEMENT →
            </button>

            <button
              type="button"
              class="mana-v81-replay-close"
              id="manaV81Close"
            >
              Return to Home
            </button>

          </div>

        </div>
      </div>
    `;

    document.body.appendChild(
      intro
    );

    document
  .getElementById(
    "manaV81Enter"
  )
  .onclick =
    closeIntro;

document
  .getElementById(
    "manaV81Close"
  )
  .onclick =
    closeIntro;
}

function openIntro() {
  createIntro();

  document
    .getElementById(
      INTRO_ID
    )
    ?.classList.add(
      "open"
    );

  document.body.style.overflow =
    "hidden";
}

function closeIntro() {
  document
    .getElementById(
      INTRO_ID
    )
    ?.classList.remove(
      "open"
    );

  document.body.style.overflow =
    "";
}

function clientIsLoggedIn() {
  const auth =
    document.getElementById(
      "authView"
    );

  const client =
    document.getElementById(
      "clientView"
    );

  if (!client) return false;

  const authHidden =
    !auth ||
    auth.classList.contains(
      "hide"
    );

  return (
    authHidden &&
    !client.classList.contains(
      "hide"
    )
  );
}

function maybeShowIntro() {
  if (
    clientIsLoggedIn()
  ) {
    openIntro();
  }
}

function watchLoginState() {
  const auth =
    document.getElementById(
      "authView"
    );

  const client =
    document.getElementById(
      "clientView"
    );

  if (!client) return;

  let wasLoggedIn =
    clientIsLoggedIn();

  const observer =
    new MutationObserver(() => {
      const loggedIn =
        clientIsLoggedIn();

      if (
        loggedIn &&
        !wasLoggedIn
      ) {
        setTimeout(
          openIntro,
          250
        );
      }

      wasLoggedIn =
        loggedIn;
    });

  observer.observe(
    client,
    {
      attributes:true,
      attributeFilter:["class"]
    }
  );

  if (auth) {
    observer.observe(
      auth,
      {
        attributes:true,
        attributeFilter:["class"]
      }
    );
  }
}

function init() {
  injectStyles();
  createIntro();
  watchLoginState();

  setTimeout(
    maybeShowIntro,
    900
  );
}

window.openManaIntroduction =
  openIntro;

window.closeManaIntroduction =
  closeIntro;

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
