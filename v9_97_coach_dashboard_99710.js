/* =========================================
   MANA MOVEMENT TRAINING v9.97.1
   COACH DASHBOARD — PREMIUM HOME

   PURPOSE
   - Upgrade coach home presentation
   - Keep all current Supabase / RPC logic
   - Keep existing Coach Focus filtering
   - Keep existing client-detail navigation
   - Keep all current alert IDs and live counts
   - Add premium summary cards:
       Active Clients
       Needs Attention
       Check-ins Due
       Avg Adherence
   - Hide old duplicate coach header
   - Hide old duplicate metric cards
   - Remove old "Next coach tools" placeholder
   - No continuous render loop
   - No MutationObserver

   LOAD LAST / NEAR LAST
   ========================================= */

(() => {
  "use strict";

  const BUILD = "99710";
  const STYLE_ID = "mana-v9971-coach-dashboard-style";
  const HERO_ID = "manaV997CoachHero";
  const SUMMARY_ID = "manaV997CoachSummary";

  let originalLoadCoachDashboard = null;
  let refreshTimers = [];


  /* =========================================
     HELPERS
     ========================================= */

  function el(id) {
    return document.getElementById(id);
  }


  function coachHome() {
    return el("coachHomePage");
  }


  function coachHomeOpen() {

    const home =
      coachHome();


    const coach =
      el(
        "coachView"
      );


    return Boolean(

      home &&

      coach &&

      !coach
        .classList
        .contains(
          "hide"
        ) &&

      !home
        .classList
        .contains(
          "hide"
        )

    );

  }


  function numberFrom(id) {

    const node =
      el(
        id
      );


    if (!node) {
      return 0;
    }


    const raw =
      String(
        node.textContent ||
        ""
      )
        .replace(
          /[^0-9.-]/g,
          ""
        );


    const n =
      Number(
        raw
      );


    return Number.isFinite(
      n
    )
      ? n
      : 0;

  }


  function adherenceText() {

    return String(

      el(
        "coachAdherence"
      )
        ?.textContent ||

      "0%"

    )
      .trim() ||

      "0%";

  }


  function needsAttentionCount() {

    const ids = [

      "alertCountCheckin",

      "alertCountHabits",

      "alertCountHighRpe",

      "alertCountDuration",

      "alertCountProgram",

      "alertCountStrength"

    ];


    /*
      Current coach data exposes
      alert-category totals rather than
      a unique-client attention total.

      Use the largest alert bucket
      instead of summing all alert types,
      which could count the same client
      several times.
    */

    const values =
      ids.map(
        numberFrom
      );


    return values.length

      ? Math.max(
          ...values
        )

      : 0;

  }


  function checkinsDueCount() {

    return numberFrom(
      "alertCountCheckin"
    );

  }


  function clearRefreshTimers() {

    refreshTimers
      .forEach(
        clearTimeout
      );


    refreshTimers = [];

  }


  /* =========================================
     STYLES
     ========================================= */

  function installStyles() {

    document
      .getElementById(
        STYLE_ID
      )
      ?.remove();


    const style =
      document
        .createElement(
          "style"
        );


    style.id =
      STYLE_ID;


    style.textContent = `

      /* =====================================
         COACH HOME FOUNDATION
         ===================================== */

      #coachHomePage{

        width:
          min(
            900px,
            100%
          );

        margin:
          0 auto;

        padding-bottom:
          100px;

      }


      /* =====================================
         LEGACY COACH BLOCKS
         ===================================== */

      #coachHomePage
      .mana-v9971-hide-legacy{

        display:
          none
          !important;

      }


      #coachHomePage
      .mana-v9971-live-source{

        position:
          absolute
          !important;

        width:
          1px
          !important;

        height:
          1px
          !important;

        overflow:
          hidden
          !important;

        clip:
          rect(
            0,
            0,
            0,
            0
          )
          !important;

        clip-path:
          inset(
            50%
          )
          !important;

        white-space:
          nowrap
          !important;

        pointer-events:
          none
          !important;

      }


      /* =====================================
         HERO
         ===================================== */

      #${HERO_ID}{

        position:
          relative;

        overflow:
          hidden;

        margin:
          0
          0
          14px;

        padding:
          24px
          22px
          22px;

        border:
          1px solid
          rgba(
            243,
            216,
            117,
            .28
          );

        border-radius:
          24px;

        background:

          radial-gradient(
            circle
            at
            92%
            5%,

            rgba(
              243,
              216,
              117,
              .13
            ),

            transparent
            30%
          ),

          linear-gradient(
            145deg,

            #18150b,

            #0a0a0a
            62%,

            #050505
          );

        box-shadow:
          0
          18px
          46px
          rgba(
            0,
            0,
            0,
            .28
          );

      }


      #${HERO_ID}::before{

        content:
          "";

        position:
          absolute;

        width:
          200px;

        height:
          200px;

        right:
          -105px;

        top:
          -110px;

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


      .mana-v997-hero-top{

        position:
          relative;

        z-index:
          2;

        display:
          flex;

        justify-content:
          space-between;

        align-items:
          flex-start;

        gap:
          18px;

      }


      .mana-v997-kicker{

        color:
          #d9bb58;

        font-size:
          10px;

        font-weight:
          950;

        letter-spacing:
          .18em;

        text-transform:
          uppercase;

      }


      .mana-v997-title{

        margin:
          7px
          0
          6px;

        color:
          #fff;

        font-size:
          clamp(
            28px,
            6vw,
            42px
          );

        line-height:
          1.02;

        letter-spacing:
          -.035em;

        font-weight:
          950;

      }


      .mana-v997-sub{

        color:
          #9d9d9d;

        font-size:
          13px;

        line-height:
          1.45;

      }


      .mana-v997-avatar{

        width:
          52px;

        height:
          52px;

        flex:
          0
          0
          52px;

        display:
          grid;

        place-items:
          center;

        border:
          1px solid
          #6b5922;

        border-radius:
          18px;

        background:
          #11100a;

        color:
          #f3d875;

        font-size:
          14px;

        font-weight:
          950;

        letter-spacing:
          .05em;

      }


      .mana-v997-purpose{

        position:
          relative;

        z-index:
          2;

        margin-top:
          19px;

        padding-top:
          15px;

        border-top:
          1px solid
          rgba(
            255,
            255,
            255,
            .07
          );

        color:
          #dbc25f;

        font-size:
          10px;

        font-weight:
          900;

        letter-spacing:
          .13em;

        text-transform:
          uppercase;

      }


      /* =====================================
         SUMMARY
         ===================================== */

      #${SUMMARY_ID}{

        display:
          grid;

        grid-template-columns:
          repeat(
            4,
            minmax(
              0,
              1fr
            )
          );

        gap:
          10px;

        margin:
          0
          0
          14px;

      }


      .mana-v997-stat{

        min-width:
          0;

        padding:
          16px
          14px;

        border:
          1px solid
          #292929;

        border-radius:
          19px;

        background:

          linear-gradient(
            145deg,
            #111,
            #090909
          );

      }


      .mana-v997-stat.attention{

        border-color:
          #5a4420;

        background:

          linear-gradient(
            145deg,
            #171209,
            #090909
          );

      }


      .mana-v997-stat-label{

        display:
          block;

        overflow:
          hidden;

        color:
          #868686;

        font-size:
          9px;

        font-weight:
          900;

        letter-spacing:
          .09em;

        text-overflow:
          ellipsis;

        text-transform:
          uppercase;

        white-space:
          nowrap;

      }


      .mana-v997-stat-value{

        display:
          block;

        margin-top:
          8px;

        color:
          #fff;

        font-size:
          27px;

        font-weight:
          950;

        line-height:
          1;

      }


      .mana-v997-stat.attention
      .mana-v997-stat-value{

        color:
          #f3d875;

      }


      .mana-v997-stat-foot{

        display:
          block;

        margin-top:
          7px;

        color:
          #656565;

        font-size:
          9px;

        line-height:
          1.3;

      }


      /* =====================================
         CARDS
         ===================================== */

      #coachHomePage
      .card{

        margin:
          0
          0
          12px;

        padding:
          18px;

        border:
          1px solid
          #292929;

        border-radius:
          21px;

        background:

          linear-gradient(
            145deg,
            #0e0e0e,
            #080808
          );

        box-shadow:
          none;

      }


      #coachHomePage
      .card
      h3{

        margin:
          0;

        color:
          #fff;

        font-size:
          17px;

        font-weight:
          900;

        letter-spacing:
          -.01em;

      }


      #coachHomePage
      .card
      .pill{

        border-color:
          #4e421d;

        background:
          #131107;

        color:
          #e3c75f;

      }


      /* =====================================
         ALERTS
         ===================================== */

      #coachAlertsSummaryCard{

        border-color:
          #373019
          !important;

      }


      #coachAlertsSummaryCard
      > .row{

        align-items:
          flex-start;

      }


      #coachAlertsSummaryCard
      .coach-alerts-grid{

        grid-template-columns:
          repeat(
            3,
            1fr
          );

        gap:
          8px;

        margin-top:
          14px;

      }


      #coachAlertsSummaryCard
      .coach-alert-stat{

        min-height:
          74px;

        padding:
          11px
          8px;

        border:
          1px solid
          #282828;

        border-radius:
          15px;

        background:
          #0a0a0a;

        cursor:
          pointer;

        transition:

          border-color
          .15s
          ease,

          background
          .15s
          ease,

          transform
          .12s
          ease;

      }


      #coachAlertsSummaryCard
      .coach-alert-stat:active{

        transform:
          scale(
            .98
          );

      }


      #coachAlertsSummaryCard
      .coach-alert-stat.active{

        border-color:
          #746326;

        background:
          #181407;

      }


      #coachAlertsSummaryCard
      .coach-alert-count{

        margin-bottom:
          6px;

        color:
          #f0d16b;

        font-size:
          22px;

        font-weight:
          950;

      }


      #coachAlertsSummaryCard
      .coach-alert-label{

        color:
          #888;

        font-size:
          9px;

        font-weight:
          900;

        letter-spacing:
          .05em;

        text-transform:
          uppercase;

      }


      #coachAlertFilterNote{

        margin-top:
          11px;

        color:
          #6f6f6f;

        font-size:
          10px;

      }


      /* =====================================
         COACH FOCUS
         ===================================== */

      #coachFocusCard{

        border-color:
          #3e341b
          !important;

      }


      #coachFocusCard::before{

        content:
          "PRIORITY";

        display:
          inline-block;

        margin-bottom:
          9px;

        color:
          #cbaa43;

        font-size:
          9px;

        font-weight:
          950;

        letter-spacing:
          .16em;

      }


      #coachFocusCard
      .focus-item{

        margin-top:
          9px;

        padding:
          15px;

        border:
          1px solid
          #292929;

        border-radius:
          17px;

        background:
          #0a0a0a;

      }


      #coachFocusCard
      .focus-item:first-of-type{

        border-color:
          #4b3e1b;

        background:

          linear-gradient(
            145deg,
            #151207,
            #0a0a0a
          );

      }


      #coachFocusCard
      .focus-head
      strong{

        font-size:
          14px;

        font-weight:
          900;

      }


      #coachFocusCard
      .focus-reason{

        margin-top:
          7px;

        color:
          #999;

        font-size:
          12px;

        line-height:
          1.45;

      }


      #coachFocusCard
      .focus-open{

        margin-top:
          10px;

        color:
          #e2c45c;

        font-size:
          10px;

        font-weight:
          900;

        letter-spacing:
          .06em;

        text-transform:
          uppercase;

      }


      /* =====================================
         ACTIVE CLIENTS
         ===================================== */

      #coachClientsCard{

        border-color:
          #2d2d2d
          !important;

      }


      #coachClientsCard
      .client-open{

        width:
          100%;

        margin-top:
          9px;

        border:
          1px solid
          #292929
          !important;

        border-radius:
          17px
          !important;

        background:
          #0a0a0a
          !important;

        transition:

          border-color
          .15s
          ease,

          background
          .15s
          ease;

      }


      #coachClientsCard
      .client-open:active{

        border-color:
          #5a4a1f
          !important;

        background:
          #11100a
          !important;

      }


      /* =====================================
         REMOVE PLACEHOLDER
         ===================================== */

      #coachHomePage
      .mana-v997-hide-placeholder{

        display:
          none
          !important;

      }


      /* =====================================
         MOBILE
         ===================================== */

      @media(
        max-width:
          700px
      ){

        #coachHomePage{

          width:
            100%;

          padding-bottom:
            92px;

        }


        #${HERO_ID}{

          padding:
            21px
            17px
            19px;

          border-radius:
            20px;

        }


        .mana-v997-title{

          font-size:
            30px;

        }


        #${SUMMARY_ID}{

          grid-template-columns:
            1fr
            1fr;

          gap:
            8px;

        }


        .mana-v997-stat{

          padding:
            14px
            12px;

          border-radius:
            17px;

        }


        .mana-v997-stat-value{

          font-size:
            24px;

        }


        #coachHomePage
        .card{

          padding:
            16px
            14px;

          border-radius:
            19px;

        }


        #coachAlertsSummaryCard
        .coach-alerts-grid{

          grid-template-columns:
            1fr
            1fr
            1fr;

          gap:
            7px;

        }


        #coachAlertsSummaryCard
        .coach-alert-stat{

          min-height:
            68px;

          padding:
            10px
            6px;

        }

      }


      @media(
        max-width:
          390px
      ){

        #coachAlertsSummaryCard
        .coach-alerts-grid{

          grid-template-columns:
            1fr
            1fr;

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
     HERO
     ========================================= */

  function ensureHero() {

    const home =
      coachHome();


    if (!home) {
      return;
    }


    let hero =
      el(
        HERO_ID
      );


    if (!hero) {

      hero =
        document
          .createElement(
            "section"
          );


      hero.id =
        HERO_ID;


      hero.innerHTML = `

        <div
          class="mana-v997-hero-top"
        >

          <div>

            <div
              class="mana-v997-kicker"
            >
              MANA COACH
            </div>


            <h2
              class="mana-v997-title"
            >
              Coaching Dashboard
            </h2>


            <div
              class="mana-v997-sub"
            >
              Lewis Norman
              •
              Clients, priorities and progress
            </div>

          </div>


          <div
            class="mana-v997-avatar"
          >
            LN
          </div>

        </div>


        <div
          class="mana-v997-purpose"
        >
          Coach with purpose.
        </div>

      `;


      home.prepend(
        hero
      );

    }

  }


  /* =========================================
     SUMMARY
     ========================================= */

  function ensureSummary() {

    const home =
      coachHome();


    const hero =
      el(
        HERO_ID
      );


    if (
      !home ||
      !hero
    ) {

      return;

    }


    let summary =
      el(
        SUMMARY_ID
      );


    if (!summary) {

      summary =
        document
          .createElement(
            "section"
          );


      summary.id =
        SUMMARY_ID;


      hero
        .insertAdjacentElement(
          "afterend",
          summary
        );

    }


    summary.innerHTML = `

      <div
        class="mana-v997-stat"
      >

        <span
          class="mana-v997-stat-label"
        >
          Active Clients
        </span>


        <strong
          class="mana-v997-stat-value"
          id="manaV997Clients"
        >
          ${numberFrom(
            "coachClientCount"
          )}
        </strong>


        <span
          class="mana-v997-stat-foot"
        >
          all programs
        </span>

      </div>


      <div
        class="
          mana-v997-stat
          attention
        "
      >

        <span
          class="mana-v997-stat-label"
        >
          Needs Attention
        </span>


        <strong
          class="mana-v997-stat-value"
          id="manaV997Attention"
        >
          ${needsAttentionCount()}
        </strong>


        <span
          class="mana-v997-stat-foot"
        >
          priority workload
        </span>

      </div>


      <div
        class="
          mana-v997-stat
          attention
        "
      >

        <span
          class="mana-v997-stat-label"
        >
          Check-ins Due
        </span>


        <strong
          class="mana-v997-stat-value"
          id="manaV997Checkins"
        >
          ${checkinsDueCount()}
        </strong>


        <span
          class="mana-v997-stat-foot"
        >
          follow-up needed
        </span>

      </div>


      <div
        class="mana-v997-stat"
      >

        <span
          class="mana-v997-stat-label"
        >
          Avg Adherence
        </span>


        <strong
          class="mana-v997-stat-value"
          id="manaV997Adherence"
        >
          ${adherenceText()}
        </strong>


        <span
          class="mana-v997-stat-foot"
        >
          this week
        </span>

      </div>

    `;

  }


  function syncSummaryValues() {

    const clients =
      el(
        "manaV997Clients"
      );


    const attention =
      el(
        "manaV997Attention"
      );


    const checkins =
      el(
        "manaV997Checkins"
      );


    const adherence =
      el(
        "manaV997Adherence"
      );


    if (clients) {

      clients.textContent =
        String(
          numberFrom(
            "coachClientCount"
          )
        );

    }


    if (attention) {

      attention.textContent =
        String(
          needsAttentionCount()
        );

    }


    if (checkins) {

      checkins.textContent =
        String(
          checkinsDueCount()
        );

    }


    if (adherence) {

      adherence.textContent =
        adherenceText();

    }

  }


  /* =========================================
     LEGACY COACH HOME CLEANUP
     ========================================= */

  function hideLegacyCoachBlocks() {

    const home =
      coachHome();


    if (!home) {
      return;
    }


    /*
      Hide the old:

      COACH
      Mana Movement Coach
      Lewis Norman
      LN

      block using its actual heading.
    */

    [
      ...home.children
    ]
      .forEach(
        child => {

          if (
            !child
              .classList
              ?.contains(
                "row"
              )
          ) {

            return;

          }


          const heading =
            child
              .querySelector(
                "h2"
              );


          const text =
            String(
              heading
                ?.textContent ||
              ""
            )
              .replace(
                /\s+/g,
                " "
              )
              .trim()
              .toLowerCase();


          if (
            text ===
            "mana movement coach"
          ) {

            child
              .classList
              .add(
                "mana-v9971-hide-legacy"
              );

          }

        }
      );


    /*
      Hide the original:

      Active clients
      Avg adherence

      grid visually.

      The original numbers stay in the DOM
      because the new dashboard reads them
      as its live data source.
    */

    const clientMetric =
      el(
        "coachClientCount"
      );


    const adherenceMetric =
      el(
        "coachAdherence"
      );


    const metricGrid =

      clientMetric
        ?.closest(
          ".grid"
        ) ||

      adherenceMetric
        ?.closest(
          ".grid"
        );


    if (metricGrid) {

      metricGrid
        .classList
        .add(
          "mana-v9971-live-source"
        );

    }

  }


  /* =========================================
     PLACEHOLDER CLEANUP
     ========================================= */

  function hidePlaceholderCard() {

    const home =
      coachHome();


    if (!home) {
      return;
    }


    [
      ...home
        .querySelectorAll(
          ".card"
        )
    ]
      .forEach(
        card => {

          const heading =
            card
              .querySelector(
                "h3"
              );


          const text =
            String(
              heading
                ?.textContent ||
              ""
            )
              .replace(
                /\s+/g,
                " "
              )
              .trim()
              .toLowerCase();


          if (
            text ===
            "next coach tools"
          ) {

            card
              .classList
              .add(
                "mana-v997-hide-placeholder"
              );

          }

        }
      );

  }


  /* =========================================
     POLISH
     ========================================= */

  function polishCoachHome() {

    if (
      !coachHome()
    ) {

      return;

    }


    installStyles();


    ensureHero();


    ensureSummary();


    hideLegacyCoachBlocks();


    hidePlaceholderCard();


    syncSummaryValues();


    window
      .MANA_COACH_DASHBOARD_BUILD =
        BUILD;

  }


  /* =========================================
     BOUNDED LIVE DATA REFRESH
     ========================================= */

  function scheduleSummaryRefresh() {

    clearRefreshTimers();


    [
      120,
      450,
      1000,
      2200,
      4500,
      8500
    ]
      .forEach(
        delay => {

          refreshTimers
            .push(

              setTimeout(
                () => {

                  if (
                    coachHomeOpen()
                  ) {

                    polishCoachHome();

                  }

                },
                delay
              )

            );

        }
      );

  }


  /* =========================================
     WRAP EXISTING DASHBOARD LOADER
     ========================================= */

  function wrapDashboardLoader() {

    if (

      window
        .loadCoachDashboard &&

      !window
        .loadCoachDashboard
        .manaV997Wrapped

    ) {

      originalLoadCoachDashboard =
        window
          .loadCoachDashboard;


      const wrapped =
        async function(
          ...args
        ) {

          polishCoachHome();


          scheduleSummaryRefresh();


          try {

            const result =

              await
                originalLoadCoachDashboard
                  .apply(
                    this,
                    args
                  );


            polishCoachHome();


            scheduleSummaryRefresh();


            return result;

          } catch (
            error
          ) {

            polishCoachHome();


            throw error;

          }

        };


      wrapped
        .manaV997Wrapped =
          true;


      window
        .loadCoachDashboard =
          wrapped;

    }

  }


  /* =========================================
     PAGE NAVIGATION
     ========================================= */

  function bindNavRefresh() {

    document
      .querySelectorAll(
        "#bottomNav [data-page]"
      )
      .forEach(
        button => {

          if (
            button
              .dataset
              .manaV997Bound ===
            "1"
          ) {

            return;

          }


          button
            .dataset
            .manaV997Bound =
              "1";


          button
            .addEventListener(
              "click",
              () => {

                if (
                  button
                    .dataset
                    .page ===
                  "home"
                ) {

                  setTimeout(
                    () => {

                      if (
                        coachHomeOpen()
                      ) {

                        polishCoachHome();


                        scheduleSummaryRefresh();

                      }

                    },
                    80
                  );

                }

              }
            );

        }
      );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();


    polishCoachHome();


    wrapDashboardLoader();


    bindNavRefresh();


    /*
      Bounded setup passes only.

      No MutationObserver.
      No permanent interval.
    */

    [
      180,
      700,
      1600
    ]
      .forEach(
        delay => {

          setTimeout(
            () => {

              wrapDashboardLoader();


              bindNavRefresh();


              polishCoachHome();


              if (
                coachHomeOpen()
              ) {

                scheduleSummaryRefresh();

              }

            },
            delay
          );

        }
      );


    window
      .refreshManaCoachDashboard =
        () => {

          polishCoachHome();


          scheduleSummaryRefresh();

        };

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document
      .addEventListener(
        "DOMContentLoaded",
        init,
        {
          once:
            true
        }
      );

  } else {

    init();

  }

})();
