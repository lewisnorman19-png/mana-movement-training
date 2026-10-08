/* =========================================
   MANA MOVEMENT TRAINING v9.99.0
   COACH PROGRAMS — LIVE SUITE

   LIVE PROGRAMS
   - MANA 28
   - MANA STRENGTH
   - MANA LYFE

   Keeps existing coach data/navigation intact.
   Does not invent per-program client counts.
   ========================================= */

(() => {
  "use strict";

  const BUILD = "99900";
  const STYLE_ID = "mana-v999-coach-programs-style";
  const ROOT_ID = "manaV999CoachPrograms";
  let timers = [];

  const byId = id => document.getElementById(id);
  const page = () => byId("coachProgramsPage");

  function pageOpen(){
    const p = page();
    const coach = byId("coachView");
    return Boolean(
      p &&
      coach &&
      !p.classList.contains("hide") &&
      !coach.classList.contains("hide")
    );
  }

  function totalClients(){
    const source =
      byId("programClientCount") ||
      byId("coachClientCount");

    const n = Number(
      String(
        source?.textContent || "0"
      ).replace(/[^0-9.-]/g,"")
    );

    return Number.isFinite(n)
      ? n
      : 0;
  }

  function installStyles(){

    byId(STYLE_ID)?.remove();

    const style =
      document.createElement("style");

    style.id =
      STYLE_ID;

    style.textContent = `

      #coachProgramsPage{
        width:min(900px,100%);
        margin:0 auto;
        padding-bottom:100px;
      }

      #coachProgramsPage
      .mana-v999-hide-legacy{
        display:none!important;
      }

      #coachProgramsPage
      .mana-v999-live-source{
        position:absolute!important;
        width:1px!important;
        height:1px!important;
        overflow:hidden!important;
        clip:rect(0,0,0,0)!important;
        clip-path:inset(50%)!important;
        white-space:nowrap!important;
        pointer-events:none!important;
      }

      #${ROOT_ID}{
        width:100%;
      }


      /* =====================================
         HERO
         ===================================== */

      .m999-hero{
        position:relative;
        overflow:hidden;

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
            #0a0a0a 62%,
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

      .m999-hero:before{
        content:"";

        position:absolute;

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

      .m999-hero-top{
        position:relative;
        z-index:2;

        display:flex;

        justify-content:
          space-between;

        align-items:
          flex-start;

        gap:
          18px;
      }

      .m999-kicker{
        color:#d9bb58;

        font-size:
          10px;

        font-weight:
          950;

        letter-spacing:
          .18em;

        text-transform:
          uppercase;
      }

      .m999-title{
        margin:
          7px
          0
          6px;

        color:#fff;

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

      .m999-sub{
        color:#999;

        font-size:
          13px;

        line-height:
          1.45;
      }

      .m999-avatar{
        width:
          52px;

        height:
          52px;

        flex:
          0
          0
          52px;

        display:grid;

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
      }

      .m999-purpose{
        position:relative;
        z-index:2;

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

      .m999-summary{
        display:grid;

        grid-template-columns:
          repeat(
            2,
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

      .m999-summary-card{
        padding:
          16px
          14px;

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

      .m999-label{
        display:block;

        color:
          #828282;

        font-size:
          9px;

        font-weight:
          900;

        letter-spacing:
          .09em;

        text-transform:
          uppercase;
      }

      .m999-value{
        display:block;

        margin-top:
          8px;

        color:
          #f3d875;

        font-size:
          27px;

        font-weight:
          950;

        line-height:
          1;
      }

      .m999-foot{
        display:block;

        margin-top:
          7px;

        color:
          #656565;

        font-size:
          9px;
      }


      /* =====================================
         SECTION HEAD
         ===================================== */

      .m999-section-head{
        display:flex;

        justify-content:
          space-between;

        align-items:
          flex-end;

        gap:
          12px;

        margin:
          3px
          0
          10px;
      }

      .m999-section-head h3{
        margin:0;

        color:#fff;

        font-size:
          18px;

        font-weight:
          950;
      }

      .m999-section-head span{
        color:#9d8739;

        font-size:
          9px;

        font-weight:
          950;

        letter-spacing:
          .12em;

        text-transform:
          uppercase;
      }


      /* =====================================
         PROGRAM GRID
         ===================================== */

      .m999-grid{
        display:grid;

        grid-template-columns:
          repeat(
            3,
            minmax(
              0,
              1fr
            )
          );

        gap:
          10px;

        margin-bottom:
          14px;
      }

      .m999-card{
        position:relative;
        overflow:hidden;

        min-width:0;

        min-height:
          220px;

        padding:
          18px;

        border:
          1px solid
          #302b1b;

        border-radius:
          20px;

        background:
          radial-gradient(
            circle
            at
            100%
            0%,

            rgba(
              243,
              216,
              117,
              .09
            ),

            transparent
            36%
          ),

          linear-gradient(
            145deg,
            #11100b,
            #080808
          );
      }

      .m999-card:after{
        content:"";

        position:absolute;

        left:
          18px;

        right:
          18px;

        bottom:0;

        height:
          1px;

        background:
          linear-gradient(
            90deg,
            #8a7226,
            transparent
          );
      }

      .m999-card-top{
        display:flex;

        justify-content:
          space-between;

        align-items:
          flex-start;

        gap:
          10px;
      }

      .m999-icon{
        width:
          42px;

        height:
          42px;

        display:grid;

        place-items:
          center;

        border:
          1px solid
          #5a4b1f;

        border-radius:
          14px;

        background:
          #0c0b07;

        color:
          #f1d26b;

        font-size:
          13px;

        font-weight:
          950;
      }

      .m999-live{
        padding:
          6px
          8px;

        border:
          1px solid
          #4c411d;

        border-radius:
          999px;

        background:
          #131107;

        color:
          #e2c65f;

        font-size:
          8px;

        font-weight:
          950;

        letter-spacing:
          .10em;

        text-transform:
          uppercase;
      }

      .m999-card h4{
        margin:
          16px
          0
          7px;

        color:#fff;

        font-size:
          18px;

        font-weight:
          950;

        letter-spacing:
          -.02em;
      }

      .m999-card p{
        margin:0;

        color:#8f8f8f;

        font-size:
          12px;

        line-height:
          1.45;
      }

      .m999-meta{
        margin-top:
          16px;

        padding-top:
          13px;

        border-top:
          1px solid
          rgba(
            255,
            255,
            255,
            .06
          );

        color:
          #b69d47;

        font-size:
          9px;

        font-weight:
          900;

        letter-spacing:
          .07em;

        text-transform:
          uppercase;
      }


      /* =====================================
         MANAGEMENT
         ===================================== */

      .m999-manage{
        padding:
          18px;

        border:
          1px solid
          #2b2b2b;

        border-radius:
          20px;

        background:
          linear-gradient(
            145deg,
            #0e0e0e,
            #080808
          );
      }

      .m999-manage-top{
        display:flex;

        justify-content:
          space-between;

        align-items:
          flex-start;

        gap:
          14px;
      }

      .m999-manage h3{
        margin:0;

        color:#fff;

        font-size:
          17px;

        font-weight:
          950;
      }

      .m999-manage p{
        margin:
          7px
          0
          0;

        color:
          #8e8e8e;

        font-size:
          12px;

        line-height:
          1.45;
      }

      .m999-btn{
        flex:
          0
          0
          auto;

        min-height:
          42px;

        padding:
          10px
          13px;

        border:
          1px solid
          #625221;

        border-radius:
          13px;

        background:
          #141107;

        color:
          #ebcc62;

        font-size:
          10px;

        font-weight:
          950;

        letter-spacing:
          .05em;

        cursor:
          pointer;
      }

      .m999-btn:active{
        transform:
          scale(
            .98
          );
      }

      .m999-note{
        margin-top:
          14px;

        padding:
          12px
          13px;

        border:
          1px solid
          #272727;

        border-radius:
          14px;

        background:
          #090909;

        color:
          #6f6f6f;

        font-size:
          10px;

        line-height:
          1.45;
      }


      /* =====================================
         MOBILE
         ===================================== */

      @media(
        max-width:
          700px
      ){

        #coachProgramsPage{
          width:100%;

          padding-bottom:
            92px;
        }

        .m999-hero{
          padding:
            21px
            17px
            19px;

          border-radius:
            20px;
        }

        .m999-title{
          font-size:
            30px;
        }

        .m999-grid{
          grid-template-columns:
            1fr;
        }

        .m999-card{
          min-height:0;

          padding:
            16px;

          border-radius:
            18px;
        }

        .m999-manage{
          padding:
            16px;

          border-radius:
            18px;
        }

      }


      @media(
        max-width:
          460px
      ){

        .m999-manage-top{
          display:block;
        }

        .m999-btn{
          width:100%;

          margin-top:
            13px;
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
     LEGACY CLEANUP
     ========================================= */

  function hideLegacy(){

    const p =
      page();


    if(!p) {
      return;
    }


    [
      ...p.children
    ]
      .forEach(
        child => {

          if(
            child.id ===
            ROOT_ID
          ) {
            return;
          }


          if(
            child.querySelector?.(
              "#programClientCount"
            )
          ) {

            child
              .classList
              .add(
                "mana-v999-live-source"
              );

          } else {

            child
              .classList
              .add(
                "mana-v999-hide-legacy"
              );

          }

        }
      );

  }


  /* =========================================
     ACTIONS
     ========================================= */

  function bindActions(){

    const btn =
      byId(
        "manaV999ViewClients"
      );


    if(
      !btn ||
      btn.dataset.bound ===
      "1"
    ) {
      return;
    }


    btn.dataset.bound =
      "1";


    btn.addEventListener(
      "click",
      () => {

        if(
          typeof
            window.showCoachPage ===
          "function"
        ) {

          window
            .showCoachPage(
              "home"
            );

        } else {

          page()
            ?.classList
            .add(
              "hide"
            );


          byId(
            "coachHomePage"
          )
            ?.classList
            .remove(
              "hide"
            );

        }


        setTimeout(
          () => {

            byId(
              "coachClientsCard"
            )
              ?.scrollIntoView({
                behavior:
                  "smooth",

                block:
                  "start"
              });

          },
          120
        );

      }
    );

  }


  /* =========================================
     BUILD
     ========================================= */

  function build(){

    const p =
      page();


    if(!p) {
      return;
    }


    installStyles();


    hideLegacy();


    let root =
      byId(
        ROOT_ID
      );


    if(!root){

      root =
        document
          .createElement(
            "div"
          );


      root.id =
        ROOT_ID;


      p.appendChild(
        root
      );

    }


    root.innerHTML = `

      <section
        class="m999-hero"
      >

        <div
          class="m999-hero-top"
        >

          <div>

            <div
              class="m999-kicker"
            >
              MANA COACH
            </div>


            <h2
              class="m999-title"
            >
              Programs
            </h2>


            <div
              class="m999-sub"
            >
              Three live coaching pathways.
              One Mana Movement system.
            </div>

          </div>


          <div
            class="m999-avatar"
          >
            LN
          </div>

        </div>


        <div
          class="m999-purpose"
        >
          Match the right program to the right person.
        </div>

      </section>


      <section
        class="m999-summary"
      >

        <div
          class="m999-summary-card"
        >

          <span
            class="m999-label"
          >
            Live Programs
          </span>


          <strong
            class="m999-value"
          >
            3
          </strong>


          <span
            class="m999-foot"
          >
            Mana suite
          </span>

        </div>


        <div
          class="m999-summary-card"
        >

          <span
            class="m999-label"
          >
            Active Clients
          </span>


          <strong
            class="m999-value"
            id="manaV999ClientCount"
          >
            ${totalClients()}
          </strong>


          <span
            class="m999-foot"
          >
            all programs
          </span>

        </div>

      </section>


      <div
        class="m999-section-head"
      >

        <h3>
          Live Program Suite
        </h3>


        <span>
          ALL LIVE
        </span>

      </div>


      <section
        class="m999-grid"
      >

        <article
          class="m999-card"
        >

          <div
            class="m999-card-top"
          >

            <div
              class="m999-icon"
            >
              28
            </div>


            <span
              class="m999-live"
            >
              Live
            </span>

          </div>


          <h4>
            MANA 28
          </h4>


          <p>
            Structured 28-day training,
            fuel and habit pathway built
            around consistency and momentum.
          </p>


          <div
            class="m999-meta"
          >
            28 DAY • TRAINING • FUEL • PROGRESS
          </div>

        </article>


        <article
          class="m999-card"
        >

          <div
            class="m999-card-top"
          >

            <div
              class="m999-icon"
            >
              S
            </div>


            <span
              class="m999-live"
            >
              Live
            </span>

          </div>


          <h4>
            MANA STRENGTH
          </h4>


          <p>
            Progressive strength coaching
            with structured workouts,
            performance tracking and recovery.
          </p>


          <div
            class="m999-meta"
          >
            STRENGTH • PERFORMANCE • PROGRESSION
          </div>

        </article>


        <article
          class="m999-card"
        >

          <div
            class="m999-card-top"
          >

            <div
              class="m999-icon"
            >
              L
            </div>


            <span
              class="m999-live"
            >
              Live
            </span>

          </div>


          <h4>
            MANA LYFE
          </h4>


          <p>
            Whole-person coaching for
            movement, wellbeing, mindset
            and sustainable daily progress.
          </p>


          <div
            class="m999-meta"
          >
            MOVEMENT • WELLBEING • MINDSET
          </div>

        </article>

      </section>


      <section
        class="m999-manage"
      >

        <div
          class="m999-manage-top"
        >

          <div>

            <h3>
              Client Program Management
            </h3>


            <p>
              Review active clients from the
              coaching dashboard and open each
              client hub to coach their next step.
            </p>

          </div>


          <button
            type="button"
            class="m999-btn"
            id="manaV999ViewClients"
          >
            VIEW CLIENTS
          </button>

        </div>


        <div
          class="m999-note"
        >
          Per-client program assignment counts
          are not shown yet because the current
          cloud summary does not expose a reliable
          assigned-program field. This keeps the
          coach view accurate while all three
          programs remain live.
        </div>

      </section>

    `;


    bindActions();


    window
      .MANA_COACH_PROGRAMS_BUILD =
        BUILD;

  }


  /* =========================================
     REFRESH
     ========================================= */

  function scheduleRefresh(){

    timers
      .forEach(
        clearTimeout
      );


    timers = [];


    [
      100,
      400,
      1000,
      2200
    ]
      .forEach(
        delay => {

          timers
            .push(

              setTimeout(
                () => {

                  if(
                    pageOpen()
                  ) {

                    build();

                  }

                },
                delay
              )

            );

        }
      );

  }


  /* =========================================
     NAV
     ========================================= */

  function bindNav(){

    const btn =
      document
        .querySelector(
          '#bottomNav [data-page="programs"]'
        );


    if(
      !btn ||
      btn.dataset.manaV999Bound ===
      "1"
    ) {
      return;
    }


    btn.dataset.manaV999Bound =
      "1";


    btn.addEventListener(
      "click",
      () => {

        setTimeout(
          () => {

            if(
              pageOpen()
            ) {

              build();

              scheduleRefresh();

            }

          },
          90
        );

      }
    );

  }


  /* =========================================
     INIT
     ========================================= */

  function init(){

    installStyles();

    hideLegacy();

    build();

    bindNav();


    [
      250,
      900,
      1800
    ]
      .forEach(
        delay => {

          setTimeout(
            () => {

              bindNav();

              hideLegacy();

              build();


              if(
                pageOpen()
              ) {

                scheduleRefresh();

              }

            },
            delay
          );

        }
      );


    window
      .refreshManaCoachPrograms =
        () => {

          build();

          scheduleRefresh();

        };

  }


  if(
    document.readyState ===
    "loading"
  ) {

    document
      .addEventListener(
        "DOMContentLoaded",
        init,
        {
          once:true
        }
      );

  } else {

    init();

  }

})();
