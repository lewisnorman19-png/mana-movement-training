/* =========================================
   MANA MOVEMENT TRAINING v9.7.0
   COACH SHELL

   MODERN COACH TAB BAR
   GLOBAL COACH LOGOUT
   CLIENT DETAIL SUPPORT
   ========================================= */

(() => {
  "use strict";


  const STYLE_ID =
    "mana-v970-coach-shell-style";

  const NAV_ID =
    "manaV97CoachNav";

  const LOGOUT_ID =
    "manaV97CoachLogout";


  const PAGE_MAP = {
    home:
      "coachHomePage",

    programs:
      "coachProgramsPage",

    fuel:
      "coachFuelPage",

    progress:
      "coachProgressPage",

    profile:
      "coachProfilePage"
  };


  let activePage =
    "home";

  let loggingOut =
    false;


  /* =========================================
     HELPERS
     ========================================= */

  function coachModeActive() {
    try {

      if (
        typeof mode !==
          "undefined" &&
        mode === "coach"
      ) {

        return true;

      }

    } catch (_) {}


    return false;
  }


  function coachViewVisible() {
    const coach =
      document.getElementById(
        "coachView"
      );


    const detail =
      document.getElementById(
        "coachClientDetailView"
      );


    return Boolean(
      (
        coach &&
        !coach.classList
          .contains("hide")
      )
      ||
      (
        detail &&
        !detail.classList
          .contains("hide")
      )
    );
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

      /* ==========================
         SPACE FOR FIXED NAV
         ========================== */

      body.mana-v970-coach-active
      #coachView,

      body.mana-v970-coach-active
      #coachClientDetailView{
        padding-bottom:
          calc(
            105px +
            env(
              safe-area-inset-bottom
            )
          ) !important;
      }


      /* ==========================
         LOGOUT
         ========================== */

      #${LOGOUT_ID}{
        position:fixed;

        z-index:43000;

        top:
          calc(
            env(
              safe-area-inset-top
            ) + 14px
          );

        right:16px;

        min-height:40px;

        padding:
          0
          14px;

        border:
          1px solid
          #4b411d;

        border-radius:999px;

        background:
          rgba(
            12,
            12,
            12,
            .96
          );

        color:#f3d875;

        font-size:11px;

        font-weight:900;

        letter-spacing:.04em;

        cursor:pointer;

        backdrop-filter:
          blur(10px);

        box-shadow:
          0
          8px
          24px
          rgba(
            0,
            0,
            0,
            .3
          );
      }


      #${LOGOUT_ID}:disabled{
        opacity:.55;
      }


      /* ==========================
         COACH NAV
         ========================== */

      #${NAV_ID}{
        position:fixed;

        z-index:42000;

        left:0;
        right:0;
        bottom:0;

        display:none;

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
          #292929;

        background:
          rgba(
            5,
            5,
            5,
            .96
          );

        backdrop-filter:
          blur(16px);
      }


      #${NAV_ID}.open{
        display:block;
      }


      .mana-v970-nav-inner{
        width:min(
          980px,
          100%
        );

        margin:auto;

        display:grid;

        grid-template-columns:
          repeat(
            5,
            minmax(
              0,
              1fr
            )
          );

        gap:7px;
      }


      .mana-v970-tab{
        min-width:0;

        min-height:61px;

        padding:
          7px
          3px;

        border:
          1px solid
          transparent;

        border-radius:15px;

        background:#0d0d0d;

        color:#777;

        cursor:pointer;

        font-size:10px;

        font-weight:900;

        line-height:1.15;
      }


      .mana-v970-tab-icon{
        display:block;

        margin-bottom:5px;

        font-size:17px;

        line-height:1;
      }


      .mana-v970-tab.active{
        border-color:#68571e;

        background:
          linear-gradient(
            145deg,
            #211b08,
            #111006
          );

        color:#f3d875;
      }


      .mana-v970-tab:active{
        transform:
          scale(.97);
      }


      @media(
        min-width:700px
      ){

        .mana-v970-tab{
          font-size:12px;
        }


        .mana-v970-tab-icon{
          font-size:19px;
        }

      }


      @media(
        max-width:390px
      ){

        #${NAV_ID}{
          padding-left:5px;
          padding-right:5px;
        }


        .mana-v970-nav-inner{
          gap:4px;
        }


        .mana-v970-tab{
          font-size:9px;

          padding-left:1px;
          padding-right:1px;
        }


        #${LOGOUT_ID}{
          right:10px;

          min-height:36px;

          padding:
            0
            11px;

          font-size:10px;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     BUILD NAV
     ========================================= */

  function ensureNav() {
    if (
      document.getElementById(
        NAV_ID
      )
    ) {
      return;
    }


    const nav =
      document.createElement(
        "div"
      );


    nav.id =
      NAV_ID;


    nav.innerHTML = `

      <div
        class="mana-v970-nav-inner"
      >

        <button
          type="button"
          class="
            mana-v970-tab
            active
          "
          data-coach-page="home"
        >
          <span
            class="mana-v970-tab-icon"
          >
            ⌂
          </span>

          Home
        </button>


        <button
          type="button"
          class="mana-v970-tab"
          data-coach-page="programs"
        >
          <span
            class="mana-v970-tab-icon"
          >
            ▣
          </span>

          Programs
        </button>


        <button
          type="button"
          class="mana-v970-tab"
          data-coach-page="fuel"
        >
          <span
            class="mana-v970-tab-icon"
          >
            ◇
          </span>

          Fuel
        </button>


        <button
          type="button"
          class="mana-v970-tab"
          data-coach-page="progress"
        >
          <span
            class="mana-v970-tab-icon"
          >
            ↗
          </span>

          Progress
        </button>


        <button
          type="button"
          class="mana-v970-tab"
          data-coach-page="profile"
        >
          <span
            class="mana-v970-tab-icon"
          >
            ◎
          </span>

          Profile
        </button>

      </div>

    `;


    document.body
      .appendChild(
        nav
      );


    nav
      .querySelectorAll(
        "[data-coach-page]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              openCoachPage(
                button.dataset
                  .coachPage
              );

            }
          );

        }
      );
  }


  /* =========================================
     LOGOUT BUTTON
     ========================================= */

  function ensureLogout() {
    if (
      document.getElementById(
        LOGOUT_ID
      )
    ) {
      return;
    }


    const button =
      document.createElement(
        "button"
      );


    button.type =
      "button";

    button.id =
      LOGOUT_ID;

    button.textContent =
      "Log out";


    button.onclick =
      logoutCoach;


    document.body
      .appendChild(
        button
      );
  }


  /* =========================================
     PAGE NAVIGATION
     ========================================= */

  function openCoachPage(
    page
  ) {
    if (
      !PAGE_MAP[page]
    ) {
      page =
        "home";
    }


    activePage =
      page;


    /*
      Prefer existing Mana navigation.
    */

    if (
      typeof
        window
          .showCoachPage ===
      "function"
    ) {

      window
        .showCoachPage(
          page
        );

    } else {

      const coach =
        document.getElementById(
          "coachView"
        );


      const detail =
        document.getElementById(
          "coachClientDetailView"
        );


      detail
        ?.classList
        .add(
          "hide"
        );


      coach
        ?.classList
        .remove(
          "hide"
        );


      document
        .querySelectorAll(
          "#coachView .coach-page"
        )
        .forEach(
          item => {

            item.classList.add(
              "hide"
            );

          }
        );


      document
        .getElementById(
          PAGE_MAP[page]
        )
        ?.classList
        .remove(
          "hide"
        );

    }


    setActiveTab(
      page
    );


    window.scrollTo({
      top:0,
      behavior:"instant"
    });
  }


  function setActiveTab(
    page
  ) {
    activePage =
      page;


    document
      .querySelectorAll(
        `#${NAV_ID} [data-coach-page]`
      )
      .forEach(
        button => {

          button.classList.toggle(
            "active",
            button.dataset
              .coachPage ===
              page
          );

        }
      );
  }


  function detectCurrentPage() {
    for (
      const [
        page,
        id
      ]
      of Object.entries(
        PAGE_MAP
      )
    ) {

      const el =
        document.getElementById(
          id
        );


      if (
        el &&
        !el.classList
          .contains(
            "hide"
          )
      ) {

        return page;

      }
    }


    return activePage;
  }


  /* =========================================
     LOGOUT
     ========================================= */

  async function logoutCoach() {
    if (loggingOut) {
      return;
    }


    loggingOut =
      true;


    const button =
      document.getElementById(
        LOGOUT_ID
      );


    if (button) {

      button.disabled =
        true;

      button.textContent =
        "Signing out…";

    }


    try {

      /*
        Use the safe logout we built
        in v9.6 first.
      */

      if (
        typeof
          window
            .logoutManaSafe ===
        "function"
      ) {

        await window
          .logoutManaSafe();

      } else if (
        typeof
          window
            .logoutMana ===
        "function"
      ) {

        await window
          .logoutMana();

      } else if (
        typeof
          supabaseClient ===
        "function"
      ) {

        const c =
          await supabaseClient();


        await Promise.race([

          c.auth.signOut({
            scope:"local"
          }),

          new Promise(
            resolve => {

              setTimeout(
                resolve,
                2200
              );

            }
          )

        ]);

      }


      hideCoachShell();


    } catch (error) {

      console.warn(
        "Coach logout",
        error
      );


      if (button) {

        button.disabled =
          false;

        button.textContent =
          "Log out";

      }


      loggingOut =
        false;

    }
  }


  /* =========================================
     SHOW / HIDE SHELL
     ========================================= */

  function showCoachShell() {
    ensureNav();

    ensureLogout();


    document.body
      .classList
      .add(
        "mana-v970-coach-active"
      );


    document
      .getElementById(
        NAV_ID
      )
      ?.classList
      .add(
        "open"
      );


    const logout =
      document.getElementById(
        LOGOUT_ID
      );


    if (logout) {

      logout.style.display =
        "";

      logout.disabled =
        false;

      logout.textContent =
        "Log out";

    }


    setActiveTab(
      detectCurrentPage()
    );
  }


  function hideCoachShell() {
    document.body
      .classList
      .remove(
        "mana-v970-coach-active"
      );


    document
      .getElementById(
        NAV_ID
      )
      ?.classList
      .remove(
        "open"
      );


    const logout =
      document.getElementById(
        LOGOUT_ID
      );


    if (logout) {

      logout.style.display =
        "none";

    }


    loggingOut =
      false;
  }


  /* =========================================
     REFRESH
     ========================================= */

  function refresh() {
    if (
      coachModeActive() &&
      coachViewVisible()
    ) {

      showCoachShell();

    } else {

      hideCoachShell();

    }
  }


  /* =========================================
     WATCH APP
     ========================================= */

  function watch() {
    window.addEventListener(
      "focus",
      refresh
    );


    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.visibilityState ===
            "visible"
        ) {

          refresh();

        }

      }
    );


    let timer =
      null;


    const observer =
      new MutationObserver(
        () => {

          clearTimeout(
            timer
          );


          timer =
            setTimeout(
              () => {

                if (
                  coachModeActive() &&
                  coachViewVisible()
                ) {

                  showCoachShell();

                  /*
                    If client detail is open,
                    keep the last coach tab
                    highlighted.
                  */

                  const detail =
                    document.getElementById(
                      "coachClientDetailView"
                    );


                  if (
                    !detail ||
                    detail.classList
                      .contains(
                        "hide"
                      )
                  ) {

                    setActiveTab(
                      detectCurrentPage()
                    );

                  }

                } else {

                  hideCoachShell();

                }

              },
              80
            );

        }
      );


    observer.observe(
      document.body,
      {
        childList:true,
        subtree:true,
        attributes:true,
        attributeFilter:[
          "class"
        ]
      }
    );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {
    injectStyles();

    ensureNav();

    ensureLogout();

    hideCoachShell();

    watch();


    [
      500,
      1000,
      1800
    ].forEach(
      delay => {

        setTimeout(
          refresh,
          delay
        );

      }
    );
  }


  window.refreshManaCoachShell =
    refresh;


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
