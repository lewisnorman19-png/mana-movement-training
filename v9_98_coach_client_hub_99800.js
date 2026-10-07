/* =========================================
   MANA MOVEMENT TRAINING v9.98.0
   COACH CLIENT HUB — 3 PROGRAM READY

   LIVE PROGRAM SUITE
   - MANA 28
   - MANA STRENGTH
   - MANA LYFE

   PURPOSE
   - Upgrade individual coach client view
   - Keep current Supabase / cloud logic intact
   - Keep current check-in, notes, session and message tools
   - Remove MANA 28-only presentation from the coach layer
   - Add universal client summary:
       Sessions complete
       Adherence
       Check-ins
       Coaching sessions
   - Add premium program suite strip
   - Keep existing quick coach controls operational
   - No MutationObserver
   - No continuous interval

   IMPORTANT
   The current underlying index data still contains some
   legacy MANA 28 / Day X of 28 fields. This file does not
   fabricate an assigned program. It presents the coach
   view in a program-neutral way until per-client program
   assignment is available from the cloud data layer.
   ========================================= */

(() => {
  "use strict";

  const BUILD = "99800";

  const STYLE_ID =
    "mana-v998-coach-client-hub-style";

  const HERO_ID =
    "manaV998ClientHero";

  const SUITE_ID =
    "manaV998ProgramSuite";

  const SUMMARY_ID =
    "manaV998ClientSummary";

  let originalOpenCoachClientDetail =
    null;

  let refreshTimers = [];


  /* =========================================
     HELPERS
     ========================================= */

  function el(id) {
    return document.getElementById(id);
  }


  function detailView() {
    return el(
      "coachClientDetailView"
    );
  }


  function detailOpen() {
    const view =
      detailView();

    return Boolean(
      view &&
      !view
        .classList
        .contains(
          "hide"
        )
    );
  }


  function textOf(
    id,
    fallback = "—"
  ) {

    const value =
      String(
        el(id)
          ?.textContent ||
        ""
      )
        .replace(
          /\s+/g,
          " "
        )
        .trim();


    return value ||
      fallback;

  }


  function clientName() {

    return textOf(
      "detailClientName",
      "Client"
    );

  }


  function initials(
    name
  ) {

    return String(
      name ||
      "C"
    )
      .trim()
      .split(
        /\s+/
      )
      .map(
        part =>
          part[0] || ""
      )
      .join("")
      .slice(
        0,
        2
      )
      .toUpperCase() ||
      "C";

  }


  function clearTimers() {

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
         CLIENT DETAIL FOUNDATION
         ===================================== */

      #coachClientDetailView{

        width:
          min(
            900px,
            100%
          );

        margin:
          0 auto;

        padding-bottom:
          80px;

      }


      /* =====================================
         HIDE LEGACY TOP AREA
         KEEP VALUES IN DOM AS LIVE SOURCES
         ===================================== */

      #coachClientDetailView
      .mana-v998-hide-legacy{

        display:
          none
          !important;

      }


      #coachClientDetailView
      .mana-v998-live-source{

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
         BACK BAR
         ===================================== */

      #coachClientDetailView
      > .row:first-child{

        margin-bottom:
          12px;

      }


      #coachClientDetailView
      #backToCoachClients{

        min-height:
          42px;

        padding:
          10px
          14px
          !important;

        border:
          1px solid
          #3b3420;

        border-radius:
          14px;

        background:
          #0d0c08;

        color:
          #e3c65d;

        font-size:
          11px;

        font-weight:
          900;

        letter-spacing:
          .03em;

      }


      #coachClientDetailView
      > .row:first-child
      > .pill{

        border-color:
          #3e361b;

        background:
          #111008;

        color:
          #d7bb58;

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
          12px;

        padding:
          24px
          22px
          21px;

        border:
          1px solid
          rgba(
            243,
            216,
            117,
            .27
          );

        border-radius:
          24px;

        background:

          radial-gradient(
            circle
            at
            92%
            8%,

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
            #17140a,
            #090909
            64%,
            #050505
          );

        box-shadow:
          0
          18px
          44px
          rgba(
            0,
            0,
            0,
            .26
          );

      }


      #${HERO_ID}::before{

        content:
          "";

        position:
          absolute;

        top:
          -95px;

        right:
          -90px;

        width:
          190px;

        height:
          190px;

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


      .mana-v998-hero-top{

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


      .mana-v998-kicker{

        color:
          #d6b850;

        font-size:
          10px;

        font-weight:
          950;

        letter-spacing:
          .18em;

        text-transform:
          uppercase;

      }


      .mana-v998-name{

        margin:
          6px
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

        font-weight:
          950;

        line-height:
          1.02;

        letter-spacing:
          -.035em;

      }


      .mana-v998-sub{

        color:
          #969696;

        font-size:
          12px;

        line-height:
          1.45;

      }


      .mana-v998-avatar{

        width:
          54px;

        height:
          54px;

        flex:
          0
          0
          54px;

        display:
          grid;

        place-items:
          center;

        border:
          1px solid
          #685720;

        border-radius:
          18px;

        background:
          #111008;

        color:
          #f3d875;

        font-size:
          14px;

        font-weight:
          950;

      }


      .mana-v998-hero-purpose{

        position:
          relative;

        z-index:
          2;

        margin-top:
          18px;

        padding-top:
          14px;

        border-top:
          1px solid
          rgba(
            255,
            255,
            255,
            .07
          );

        color:
          #d8be5c;

        font-size:
          10px;

        font-weight:
          900;

        letter-spacing:
          .14em;

        text-transform:
          uppercase;

      }


      /* =====================================
         PROGRAM SUITE
         ===================================== */

      #${SUITE_ID}{

        margin:
          0
          0
          12px;

        padding:
          16px;

        border:
          1px solid
          #292929;

        border-radius:
          20px;

        background:
          linear-gradient(
            145deg,
            #0e0e0e,
            #080808
          );

      }


      .mana-v998-suite-head{

        display:
          flex;

        justify-content:
          space-between;

        align-items:
          center;

        gap:
          12px;

        margin-bottom:
          11px;

      }


      .mana-v998-suite-head
      strong{

        color:
          #fff;

        font-size:
          13px;

        font-weight:
          900;

      }


      .mana-v998-suite-head
      span{

        color:
          #8c7934;

        font-size:
          9px;

        font-weight:
          950;

        letter-spacing:
          .12em;

      }


      .mana-v998-programs{

        display:
          grid;

        grid-template-columns:
          repeat(
            3,
            1fr
          );

        gap:
          8px;

      }


      .mana-v998-program{

        min-width:
          0;

        padding:
          12px
          10px;

        border:
          1px solid
          #312d1d;

        border-radius:
          15px;

        background:
          #0a0a08;

      }


      .mana-v998-program
      strong{

        display:
          block;

        overflow:
          hidden;

        color:
          #e7ca65;

        font-size:
          10px;

        font-weight:
          950;

        letter-spacing:
          .05em;

        text-overflow:
          ellipsis;

        white-space:
          nowrap;

      }


      .mana-v998-program
      small{

        display:
          block;

        margin-top:
          5px;

        color:
          #686868;

        font-size:
          8px;

        font-weight:
          800;

        letter-spacing:
          .07em;

        text-transform:
          uppercase;

      }


      /* =====================================
         CLIENT SUMMARY
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
          9px;

        margin:
          0
          0
          12px;

      }


      .mana-v998-stat{

        min-width:
          0;

        padding:
          15px
          13px;

        border:
          1px solid
          #292929;

        border-radius:
          18px;

        background:
          linear-gradient(
            145deg,
            #111,
            #090909
          );

      }


      .mana-v998-stat
      span{

        display:
          block;

        overflow:
          hidden;

        color:
          #7f7f7f;

        font-size:
          8px;

        font-weight:
          900;

        letter-spacing:
          .08em;

        text-overflow:
          ellipsis;

        text-transform:
          uppercase;

        white-space:
          nowrap;

      }


      .mana-v998-stat
      strong{

        display:
          block;

        margin-top:
          8px;

        color:
          #f2d46d;

        font-size:
          24px;

        font-weight:
          950;

        line-height:
          1;

      }


      .mana-v998-stat
      small{

        display:
          block;

        margin-top:
          6px;

        color:
          #616161;

        font-size:
          8px;

      }


      /* =====================================
         EXISTING DETAIL CARDS
         ===================================== */

      #coachClientDetailView
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
          20px;

        background:
          linear-gradient(
            145deg,
            #0e0e0e,
            #080808
          );

        box-shadow:
          none;

      }


      #coachClientDetailView
      .card
      h3{

        color:
          #fff;

        font-size:
          16px;

        font-weight:
          900;

      }


      #coachClientDetailView
      .card
      .pill{

        border-color:
          #493e1c;

        background:
          #121006;

        color:
          #dfc45e;

      }


      /* =====================================
         SESSION SUMMARY
         ===================================== */

      #clientSessionSummaryCard{

        border-color:
          #393118
          !important;

      }


      #clientSessionSummaryCard
      .session-summary-stat{

        border:
          1px solid
          #292929;

        background:
          #0a0a0a;

      }


      /* =====================================
         QUICK COACH ACTIONS
         ===================================== */

      #coachClientDetailView
      .quick-actions-grid{

        grid-template-columns:
          repeat(
            4,
            1fr
          );

        gap:
          8px;

      }


      #coachClientDetailView
      .quick-action-btn{

        min-height:
          80px;

        padding:
          12px
          10px;

        border:
          1px solid
          #2c2c2c;

        border-radius:
          16px;

        background:
          #0a0a0a;

        color:
          #eaeaea;

        font-size:
          11px;

        font-weight:
          900;

        text-align:
          left;

      }


      #coachClientDetailView
      .quick-action-btn
      span{

        color:
          #e4c75f;

      }


      #coachClientDetailView
      .quick-panel{

        border-color:
          #393119;

        background:
          #090909;

      }


      #requestCheckinBtn{

        border-radius:
          14px
          !important;

      }


      /* =====================================
         COACH NOTES
         ===================================== */

      #coachNotesCard{

        border-color:
          #3a3219
          !important;

      }


      #coachNoteDraft{

        min-height:
          130px;

        border-color:
          #303030;

        background:
          #080808;

      }


      /* =====================================
         TRENDS / HISTORY
         ===================================== */

      #coachClientDetailView
      .trend-card,
      #coachClientDetailView
      .metric,
      #coachClientDetailView
      .day{

        border-color:
          #292929;

        background:
          #0a0a0a;

      }


      /* =====================================
         MOBILE
         ===================================== */

      @media(
        max-width:
          700px
      ){

        #coachClientDetailView{

          width:
            100%;

          padding-bottom:
            40px;

        }


        #${HERO_ID}{

          padding:
            21px
            17px
            19px;

          border-radius:
            20px;

        }


        .mana-v998-name{

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


        .mana-v998-stat{

          padding:
            14px
            12px;

          border-radius:
            16px;

        }


        .mana-v998-stat
        strong{

          font-size:
            23px;

        }


        #coachClientDetailView
        .card{

          padding:
            16px
            14px;

          border-radius:
            18px;

        }


        #coachClientDetailView
        .quick-actions-grid{

          grid-template-columns:
            1fr
            1fr;

        }

      }


      @media(
        max-width:
          430px
      ){

        .mana-v998-programs{

          grid-template-columns:
            1fr;

        }


        .mana-v998-program{

          display:
            flex;

          justify-content:
            space-between;

          align-items:
            center;

          gap:
            10px;

        }


        .mana-v998-program
        small{

          margin-top:
            0;

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

    const view =
      detailView();


    if (!view) {
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


      const anchor =
        view.children[
          1
        ] ||
        null;


      if (anchor) {

        view.insertBefore(
          hero,
          anchor
        );

      } else {

        view.appendChild(
          hero
        );

      }

    }


    const name =
      clientName();


    hero.innerHTML = `

      <div
        class="mana-v998-hero-top"
      >

        <div>

          <div
            class="mana-v998-kicker"
          >
            CLIENT COACHING HUB
          </div>


          <h2
            class="mana-v998-name"
          >
            ${escapeHtml(
              name
            )}
          </h2>


          <div
            class="mana-v998-sub"
          >
            Training • Fuel • Progress • Coaching
          </div>

        </div>


        <div
          class="mana-v998-avatar"
        >
          ${escapeHtml(
            initials(
              name
            )
          )}
        </div>

      </div>


      <div
        class="mana-v998-hero-purpose"
      >
        See the client. See the priority. Coach the next step.
      </div>

    `;

  }


  /* =========================================
     PROGRAM SUITE
     ========================================= */

  function ensureProgramSuite() {

    const hero =
      el(
        HERO_ID
      );


    if (!hero) {
      return;
    }


    let suite =
      el(
        SUITE_ID
      );


    if (!suite) {

      suite =
        document
          .createElement(
            "section"
          );


      suite.id =
        SUITE_ID;


      hero
        .insertAdjacentElement(
          "afterend",
          suite
        );

    }


    suite.innerHTML = `

      <div
        class="mana-v998-suite-head"
      >

        <strong>
          Mana Program Suite
        </strong>

        <span>
          ALL LIVE
        </span>

      </div>


      <div
        class="mana-v998-programs"
      >

        <div
          class="mana-v998-program"
        >

          <strong>
            MANA 28
          </strong>

          <small>
            Live
          </small>

        </div>


        <div
          class="mana-v998-program"
        >

          <strong>
            MANA STRENGTH
          </strong>

          <small>
            Live
          </small>

        </div>


        <div
          class="mana-v998-program"
        >

          <strong>
            MANA LYFE
          </strong>

          <small>
            Live
          </small>

        </div>

      </div>

    `;

  }


  /* =========================================
     SUMMARY
     ========================================= */

  function ensureSummary() {

    const suite =
      el(
        SUITE_ID
      );


    if (!suite) {
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


      suite
        .insertAdjacentElement(
          "afterend",
          summary
        );

    }


    summary.innerHTML = `

      <div
        class="mana-v998-stat"
      >

        <span>
          Sessions Complete
        </span>

        <strong
          id="manaV998Sessions"
        >
          ${escapeHtml(
            textOf(
              "detailDaysComplete",
              "0"
            )
          )}
        </strong>

        <small>
          training
        </small>

      </div>


      <div
        class="mana-v998-stat"
      >

        <span>
          Adherence
        </span>

        <strong
          id="manaV998Adherence"
        >
          ${escapeHtml(
            textOf(
              "detailHabitPercent",
              "0%"
            )
          )}
        </strong>

        <small>
          habits
        </small>

      </div>


      <div
        class="mana-v998-stat"
      >

        <span>
          Check-ins
        </span>

        <strong
          id="manaV998Checkins"
        >
          ${escapeHtml(
            textOf(
              "detailCheckinCount",
              "0"
            )
          )}
        </strong>

        <small>
          submitted
        </small>

      </div>


      <div
        class="mana-v998-stat"
      >

        <span>
          Coach Sessions
        </span>

        <strong
          id="manaV998CoachSessions"
        >
          ${escapeHtml(
            textOf(
              "sessionSummaryCount",
              "0"
            )
          )}
        </strong>

        <small>
          recorded
        </small>

      </div>

    `;

  }


  function syncSummary() {

    const values = {

      manaV998Sessions:
        textOf(
          "detailDaysComplete",
          "0"
        ),

      manaV998Adherence:
        textOf(
          "detailHabitPercent",
          "0%"
        ),

      manaV998Checkins:
        textOf(
          "detailCheckinCount",
          "0"
        ),

      manaV998CoachSessions:
        textOf(
          "sessionSummaryCount",
          "0"
        )

    };


    Object
      .entries(
        values
      )
      .forEach(
        ([id, value]) => {

          const node =
            el(
              id
            );


          if (node) {

            node.textContent =
              value;

          }

        }
      );

  }


  /* =========================================
     LEGACY TOP CLEANUP
     ========================================= */

  function hideLegacyTop() {

    const view =
      detailView();


    if (!view) {
      return;
    }


    /*
      Hide old client name / MANA 28 row.
    */

    [
      ...view.children
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


          if (
            child
              .querySelector(
                "#detailClientName"
              )
          ) {

            child
              .classList
              .add(
                "mana-v998-hide-legacy"
              );

          }

        }
      );


    /*
      Hide old MANA 28-specific metric grid visually.
      Keep its values alive as our data source.
    */

    const currentDay =
      el(
        "detailCurrentDay"
      );


    const oldGrid =
      currentDay
        ?.closest(
          ".grid"
        );


    if (oldGrid) {

      oldGrid
        .classList
        .add(
          "mana-v998-live-source"
        );

    }

  }


  /* =========================================
     UNIVERSAL TEXT CLEANUP
     ========================================= */

  function neutraliseLegacyProgramText() {

    const view =
      detailView();


    if (!view) {
      return;
    }


    /*
      Only alter visible legacy helper text
      inside coach detail.

      Do not alter data values or app logic.
    */

    view
      .querySelectorAll(
        ".tiny, .muted, p, span"
      )
      .forEach(
        node => {

          if (
            node.closest(
              `#${HERO_ID}, #${SUITE_ID}, #${SUMMARY_ID}`
            )
          ) {

            return;

          }


          const text =
            String(
              node.textContent ||
              ""
            )
              .replace(
                /\s+/g,
                " "
              )
              .trim();


          if (
            text ===
            "MANA 28"
          ) {

            node.textContent =
              "TRAINING";

          }

        }
      );

  }


  /* =========================================
     HTML ESCAPE
     ========================================= */

  function escapeHtml(
    value
  ) {

    return String(
      value ?? ""
    )
      .replaceAll(
        "&",
        "&amp;"
      )
      .replaceAll(
        "<",
        "&lt;"
      )
      .replaceAll(
        ">",
        "&gt;"
      )
      .replaceAll(
        '"',
        "&quot;"
      )
      .replaceAll(
        "'",
        "&#039;"
      );

  }


  /* =========================================
     POLISH
     ========================================= */

  function polishDetail() {

    if (
      !detailView()
    ) {

      return;

    }


    installStyles();


    hideLegacyTop();


    ensureHero();


    ensureProgramSuite();


    ensureSummary();


    syncSummary();


    neutraliseLegacyProgramText();


    window
      .MANA_COACH_CLIENT_HUB_BUILD =
        BUILD;

  }


  /* =========================================
     BOUNDED DATA REFRESH
     ========================================= */

  function scheduleRefresh() {

    clearTimers();


    [
      80,
      220,
      550,
      1100,
      2200,
      4500
    ]
      .forEach(
        delay => {

          refreshTimers
            .push(

              setTimeout(
                () => {

                  if (
                    detailOpen()
                  ) {

                    polishDetail();

                  }

                },
                delay
              )

            );

        }
      );

  }


  /* =========================================
     WRAP EXISTING OPEN CLIENT DETAIL
     ========================================= */

  function wrapOpenClientDetail() {

    if (
      typeof
        window
          .openCoachClientDetail !==
        "function"
    ) {

      return;

    }


    if (
      window
        .openCoachClientDetail
        .manaV998Wrapped
    ) {

      return;

    }


    originalOpenCoachClientDetail =
      window
        .openCoachClientDetail;


    const wrapped =
      async function(
        ...args
      ) {

        const result =
          originalOpenCoachClientDetail
            .apply(
              this,
              args
            );


        /*
          The existing function is async.

          Paint immediately, then again
          after the existing data resolves.
        */

        setTimeout(
          () => {

            polishDetail();

            scheduleRefresh();

          },
          0
        );


        try {

          const resolved =
            await result;


          polishDetail();


          scheduleRefresh();


          return resolved;

        } catch (
          error
        ) {

          polishDetail();


          throw error;

        }

      };


    wrapped
      .manaV998Wrapped =
        true;


    window
      .openCoachClientDetail =
        wrapped;

  }


  /* =========================================
     CLICK SAFETY NET
     ========================================= */

  function bindClientOpenRefresh() {

    if (
      document
        .documentElement
        .dataset
        .manaV998ClientBound ===
      "1"
    ) {

      return;

    }


    document
      .documentElement
      .dataset
      .manaV998ClientBound =
        "1";


    document
      .addEventListener(
        "click",
        event => {

          const button =
            event
              .target
              .closest(
                ".client-open"
              );


          if (!button) {
            return;
          }


          setTimeout(
            () => {

              if (
                detailOpen()
              ) {

                polishDetail();


                scheduleRefresh();

              }

            },
            120
          );

        }
      );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();


    wrapOpenClientDetail();


    bindClientOpenRefresh();


    polishDetail();


    [
      250,
      900,
      1800
    ]
      .forEach(
        delay => {

          setTimeout(
            () => {

              wrapOpenClientDetail();


              bindClientOpenRefresh();


              if (
                detailOpen()
              ) {

                polishDetail();


                scheduleRefresh();

              }

            },
            delay
          );

        }
      );


    window
      .refreshManaCoachClientHub =
        () => {

          polishDetail();


          scheduleRefresh();

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
