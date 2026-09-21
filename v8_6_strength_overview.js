/* =========================================
   MANA MOVEMENT TRAINING v8.6.7
   MANA STRENGTH — OVERVIEW

   PERSONALISED WELCOME
   TODAY'S FOCUS CHECKLIST
   COACH ACTIVITY
   NEXT UP
   MEMBERSHIP LEVELS

   v8.6.7:
   - RECOVERY FOCUS NOW REAPPLIES
     MODERN COACH SUPPORT AFTER
     OVERVIEW REBUILD
   ========================================= */

(() => {
  "use strict";


  const PROGRAM_KEY =
    "mana-strength-v62-program";

  const LOG_KEY =
    "mana-strength-v64-logs";

  const PROFILE_KEY =
    "mana-profile-v67";

  const FUEL_KEY =
    "mana-fuel-v571";

  const TARGET_KEY =
    "mana-fuel-v58-targets";

  const DAILY_KEY =
    "mana-strength-v866-daily";

  const STYLE_ID =
    "mana-v866-strength-overview-style";


  let coachActivity = [];

  let coachActivityLoaded =
    false;


  /* =========================================
     HELPERS
     ========================================= */

  function safeJson(
    raw,
    fallback
  ) {
    try {
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }


  function esc(
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
      );
  }


  function todayKey() {
    const date =
      new Date();


    return [
      date.getFullYear(),

      String(
        date.getMonth() + 1
      ).padStart(
        2,
        "0"
      ),

      String(
        date.getDate()
      ).padStart(
        2,
        "0"
      )

    ].join("-");
  }


  function loadProgram() {
    return safeJson(
      localStorage.getItem(
        PROGRAM_KEY
      ) || "null",
      null
    );
  }


  function loadLogs() {
    return safeJson(
      localStorage.getItem(
        LOG_KEY
      ) || "[]",
      []
    );
  }


  function loadProfile() {
    return safeJson(
      localStorage.getItem(
        PROFILE_KEY
      ) || "{}",
      {}
    );
  }


  function loadFuelStore() {
    return safeJson(
      localStorage.getItem(
        FUEL_KEY
      ) || "{}",
      {}
    );
  }


  function loadTargets() {
    const saved =
      safeJson(
        localStorage.getItem(
          TARGET_KEY
        ) || "{}",
        {}
      );


    return {
      calories:
        Number(
          saved.calories || 0
        ),

      protein:
        Number(
          saved.protein || 0
        ),

      water:
        Number(
          saved.water || 0
        )
    };
  }


  function firstName() {
    const profile =
      loadProfile();


    const name =
      String(
        profile.name ||
        ""
      ).trim();


    if (!name) {
      return "";
    }


    return (
      name.split(/\s+/)[0]
    );
  }


  function strengthOverviewOpen() {
    const shell =
      document.getElementById(
        "manaV83ProgramShell"
      );


    const title =
      document.getElementById(
        "manaV83Title"
      );


    const active =
      document.querySelector(
        "#manaV83Tabs .mana-v83-tab.active"
      );


    return Boolean(

      shell
        ?.classList
        .contains("open") &&

      title
        ?.textContent
        .trim()
        .toUpperCase() ===
        "MANA STRENGTH" &&

      active
        ?.dataset
        ?.v83Tab ===
        "overview"

    );
  }


  /* =========================================
     DAILY FOUNDATION DATA
     ========================================= */

  function loadDailyState() {
    const store =
      safeJson(
        localStorage.getItem(
          DAILY_KEY
        ) || "{}",
        {}
      );


    return (
      store[
        todayKey()
      ] || {
        recovery:false
      }
    );
  }


  function saveDailyState(
    day
  ) {
    const store =
      safeJson(
        localStorage.getItem(
          DAILY_KEY
        ) || "{}",
        {}
      );


    store[
      todayKey()
    ] =
      day;


    localStorage.setItem(
      DAILY_KEY,
      JSON.stringify(
        store
      )
    );
  }


  function toggleRecovery() {
    const day =
      loadDailyState();


    day.recovery =
      !day.recovery;


    saveDailyState(
      day
    );


    /*
      Rebuild Today's Focus immediately.
    */

    renderOverview();


    /*
      Recovery rebuilds the entire Overview,
      including the old Coach Activity block.

      After the rebuild settles, use the
      existing stable Overview repair layer
      to restore modern Coach Support.
    */

    setTimeout(
      () => {

        if (
          typeof
            window
              .repairManaStrengthOverview ===
          "function"
        ) {

          window
            .repairManaStrengthOverview();

        }

      },
      120
    );


    /*
      Restore the training percentage too,
      because renderOverview recreates the
      Training done row.
    */

    setTimeout(
      () => {

        if (
          typeof
            window
              .refreshManaTrainingPercentage ===
          "function"
        ) {

          window
            .refreshManaTrainingPercentage();

        }

      },
      220
    );
  }


  function todayLogs() {
    const today =
      todayKey();


    return loadLogs()
      .filter(
        log => {

          const raw =
            log.date ||
            log.created_at;


          if (!raw) {
            return false;
          }


          const date =
            new Date(raw);


          if (
            Number.isNaN(
              date.getTime()
            )
          ) {
            return false;
          }


          const key = [
            date.getFullYear(),

            String(
              date.getMonth() + 1
            ).padStart(
              2,
              "0"
            ),

            String(
              date.getDate()
            ).padStart(
              2,
              "0"
            )

          ].join("-");


          return (
            key === today
          );

        }
      );
  }


  function todayFuelTotals() {
    const store =
      loadFuelStore();


    const day =
      store[
        todayKey()
      ] || {};


    const totals = {
      calories:0,
      protein:0,

      water:
        Number(
          day.water || 0
        ),

      meals:0
    };


    Object.values(
      day.meals || {}
    ).forEach(
      items => {

        (
          items || []
        ).forEach(
          item => {

            totals.meals += 1;


            totals.calories +=
              Number(
                item.calories || 0
              );


            totals.protein +=
              Number(
                item.protein || 0
              );

          }
        );

      }
    );


    return totals;
  }


  function dailyFoundations() {
    const fuel =
      todayFuelTotals();


    const targets =
      loadTargets();


    const manual =
      loadDailyState();


    const workoutDone =
      todayLogs()
        .length > 0;


    const waterDone =
      targets.water > 0 &&
      fuel.water >=
        targets.water;


    const proteinDone =
      targets.protein > 0 &&
      fuel.protein >=
        targets.protein;


    return {

      workout:{
        done:
          workoutDone,

        title:
          "Training done",

        detail:
          workoutDone
            ? "Strength session completed today"
            : "Complete today's planned training"
      },


      water:{
        done:
          waterDone,

        title:
          "Water target",

        detail:
          targets.water
            ? `${Math.round(
                fuel.water
              )} / ${Math.round(
                targets.water
              )} ml`
            : "Set your water target in Fuel"
      },


      protein:{
        done:
          proteinDone,

        title:
          "Protein target",

        detail:
          targets.protein
            ? `${Math.round(
                fuel.protein
              )} / ${Math.round(
                targets.protein
              )} g`
            : "Set your protein target in Fuel"
      },


      recovery:{
        done:
          Boolean(
            manual.recovery
          ),

        title:
          "Recovery focus",

        detail:
          manual.recovery
            ? "Recovery focus completed"
            : "Mobility, walk, sleep or recovery work"
      }

    };
  }


  function foundationCount(
    foundations
  ) {
    return Object
      .values(
        foundations
      )
      .filter(
        item =>
          item.done
      )
      .length;
  }


  /* =========================================
     WELCOME MESSAGE
     ========================================= */

  function welcomeMessage(
    foundations,
    hasCoachRequest
  ) {
    const done =
      foundationCount(
        foundations
      );


    if (
      hasCoachRequest
    ) {
      return (
        "Your coach has requested a check-in. " +
        "Complete today's foundations and send your update when you're ready."
      );
    }


    if (
      done === 4
    ) {
      return (
        "You've covered the foundations today. " +
        "Recover well and carry the momentum into tomorrow."
      );
    }


    if (
      foundations.workout.done &&
      foundations.water.done &&
      foundations.protein.done
    ) {
      return (
        "Training and Fuel are on track today. " +
        "Finish with some recovery work and you've covered the foundations."
      );
    }


    if (
      foundations.workout.done
    ) {
      return (
        "Good work getting your training done. " +
        "Keep your water and protein moving and finish the day strong."
      );
    }


    if (
      foundations.water.done &&
      foundations.protein.done
    ) {
      return (
        "Fuel is looking good today. " +
        "Head into Program when you're ready for your training."
      );
    }


    if (
      done > 0
    ) {
      return (
        `You've completed ${done} of 4 foundations today. ` +
        "Keep building the day one action at a time."
      );
    }


    return (
      "Your focus today is simple — train with purpose, Fuel well, stay hydrated and make recovery count."
    );
  }


  /* =========================================
     PROGRAM
     ========================================= */

  function nextWorkoutIndex(
    program,
    logs
  ) {
    const total =
      program
        ?.sessions
        ?.length || 0;


    if (!total) {
      return 0;
    }


    return (
      logs.length %
      total
    );
  }


  /* =========================================
     COACH ACTIVITY
     ========================================= */

  async function loadCoachActivity() {
    coachActivity = [];


    const program =
      loadProgram();


    try {

      if (
        typeof supabaseClient ===
          "function" &&
        typeof currentUser !==
          "undefined" &&
        currentUser?.id
      ) {

        const c =
          await supabaseClient();


        const {
          data,
          error
        } =
          await c
            .from(
              "checkin_requests"
            )
            .select(
              "id,status,requested_at"
            )
            .eq(
              "client_id",
              currentUser.id
            )
            .eq(
              "status",
              "requested"
            )
            .order(
              "requested_at",
              {
                ascending:false
              }
            )
            .limit(3);


        if (error) {
          throw error;
        }


        (
          data || []
        ).forEach(
          request => {

            coachActivity.push({

              type:"coach",

              title:
                "Coach check-in requested",

              text:
                "Lewis has requested an update from you.",

              time:
                request.requested_at ||
                null

            });

          }
        );

      }

    } catch (error) {

      console.warn(
        "Mana Strength coach activity",
        error
      );

    }


    if (
      program
        ?.sessions
        ?.length
    ) {

      coachActivity.push({

        type:"program",

        title:
          "Your program is ready",

        text:
          `${program.sessions.length} personalised training day${program.sessions.length === 1 ? "" : "s"} available.`,

        time:null

      });

    }


    coachActivityLoaded =
      true;
  }


  function daysSince(
    value
  ) {
    if (!value) {
      return null;
    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return null;
    }


    const now =
      new Date();


    const today =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );


    const then =
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );


    return Math.max(
      0,
      Math.round(
        (
          today.getTime() -
          then.getTime()
        ) /
        86400000
      )
    );
  }


  function relativeTime(
    value
  ) {
    if (!value) {
      return "";
    }


    const ago =
      daysSince(
        value
      );


    if (ago === 0) {
      return "Today";
    }


    if (ago === 1) {
      return "Yesterday";
    }


    if (
      Number.isFinite(
        ago
      )
    ) {
      return `${ago} days ago`;
    }


    return "";
  }


  function coachActivityHTML() {
    if (
      !coachActivityLoaded
    ) {

      return `
        <div class="mana-v866-empty">
          Checking your latest coach activity…
        </div>
      `;
    }


    if (
      !coachActivity.length
    ) {

      return `
        <div class="mana-v866-empty">
          No new coach activity.
        </div>
      `;
    }


    return coachActivity
      .slice(
        0,
        4
      )
      .map(
        item => `

          <div
            class="mana-v866-feed-item"
          >

            <div
              class="
                mana-v866-feed-icon
                ${
                  item.type === "coach"
                    ? "coach"
                    : ""
                }
              "
            >
              ${
                item.type === "coach"
                  ? "C"
                  : "M"
              }
            </div>


            <div
              class="mana-v866-feed-copy"
            >

              <strong>
                ${esc(
                  item.title
                )}
              </strong>

              <span>
                ${esc(
                  item.text
                )}
              </span>

            </div>


            <div
              class="mana-v866-feed-time"
            >
              ${esc(
                relativeTime(
                  item.time
                )
              )}
            </div>

          </div>

        `
      )
      .join("");
  }


  /* =========================================
     CHECKLIST
     ========================================= */

  function focusRow(
    item,
    options = {}
  ) {
    const manual =
      Boolean(
        options.manual
      );


    return `

      <button
        type="button"
        class="
          mana-v866-focus-row
          ${item.done ? "done" : ""}
          ${manual ? "manual" : ""}
        "
        ${
          manual
            ? 'id="manaV866Recovery"'
            : "disabled"
        }
      >

        <span
          class="mana-v866-check"
        >
          ${
            item.done
              ? "✓"
              : ""
          }
        </span>


        <span
          class="mana-v866-focus-copy"
        >

          <strong>
            ${esc(
              item.title
            )}
          </strong>

          <small>
            ${esc(
              item.detail
            )}
          </small>

        </span>


        ${
          manual
            ? `
              <span
                class="mana-v866-action"
              >
                ${item.done ? "Done" : "Tap"}
              </span>
            `
            : `
              <span
                class="mana-v866-auto"
              >
                AUTO
              </span>
            `
        }

      </button>

    `;
  }


  /* =========================================
     PRICING
     ========================================= */

  function feature(
    text
  ) {
    return `

      <div
        class="mana-v866-feature"
      >

        <span
          class="mana-v866-feature-check"
        >
          ✓
        </span>

        <span>
          ${text}
        </span>

      </div>

    `;
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

      .mana-v866-welcome{
        margin-bottom:14px;
        padding:26px 21px;
        border:1px solid #5a4a18;
        border-radius:24px;
        background:
          linear-gradient(
            145deg,
            #1c1708,
            #090909
          );
      }


      .mana-v866-kicker{
        color:#f3d875;
        font-size:10px;
        font-weight:900;
        letter-spacing:.14em;
        text-transform:uppercase;
      }


      .mana-v866-welcome h2{
        margin:7px 0 10px;
        color:#fff;
        font-size:
          clamp(
            32px,
            8vw,
            42px
          );
        line-height:1.04;
      }


      .mana-v866-message{
        max-width:500px;
        color:#bbb;
        font-size:14px;
        line-height:1.6;
      }


      .mana-v866-section{
        margin:14px 0;
        padding:18px;
        border:1px solid #292929;
        border-radius:21px;
        background:#0d0d0d;
      }


      .mana-v866-section-head{
        display:flex;
        justify-content:space-between;
        align-items:flex-end;
        gap:10px;
        margin-bottom:14px;
      }


      .mana-v866-section-head h3{
        margin:0;
        font-size:20px;
      }


      .mana-v866-section-head span{
        color:#777;
        font-size:10px;
        text-transform:uppercase;
        letter-spacing:.08em;
      }


      /* ==========================
         TODAY'S FOCUS
         ========================== */

      .mana-v866-focus{
        display:grid;
        gap:9px;
      }


      .mana-v866-focus-row{
        width:100%;
        min-height:68px;
        display:grid;
        grid-template-columns:
          38px
          minmax(0,1fr)
          auto;
        gap:11px;
        align-items:center;
        padding:12px;
        border:1px solid #292929;
        border-radius:16px;
        background:#090909;
        color:#fff;
        text-align:left;
      }


      .mana-v866-focus-row:disabled{
        opacity:1;
      }


      .mana-v866-focus-row.manual{
        cursor:pointer;
      }


      .mana-v866-focus-row.done{
        border-color:#57491c;
        background:
          linear-gradient(
            145deg,
            #171407,
            #090909
          );
      }


      .mana-v866-check{
        width:34px;
        height:34px;
        display:grid;
        place-items:center;
        border:2px solid #464646;
        border-radius:10px;
        color:#111;
        font-size:19px;
        font-weight:900;
      }


      .mana-v866-focus-row.done
      .mana-v866-check{
        border-color:#f3d875;
        background:#f3d875;
      }


      .mana-v866-focus-copy{
        min-width:0;
      }


      .mana-v866-focus-copy strong{
        display:block;
        color:#eee;
        font-size:13px;
      }


      .mana-v866-focus-row.done
      .mana-v866-focus-copy strong{
        color:#f3d875;
      }


      .mana-v866-focus-copy small{
        display:block;
        margin-top:4px;
        color:#777;
        font-size:10px;
        line-height:1.35;
      }


      .mana-v866-auto,
      .mana-v866-action{
        padding:5px 7px;
        border-radius:999px;
        font-size:8px;
        font-weight:900;
        letter-spacing:.05em;
      }


      .mana-v866-auto{
        border:1px solid #303030;
        color:#666;
      }


      .mana-v866-action{
        border:1px solid #5b4c1c;
        color:#f3d875;
      }


      .mana-v866-progress-wrap{
        margin-bottom:14px;
      }


      .mana-v866-progress-row{
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:10px;
        margin-bottom:7px;
      }


      .mana-v866-progress-row strong{
        color:#f3d875;
        font-size:13px;
      }


      .mana-v866-progress-row span{
        color:#777;
        font-size:10px;
      }


      .mana-v866-progress{
        width:100%;
        height:7px;
        overflow:hidden;
        border-radius:999px;
        background:#202020;
      }


      .mana-v866-progress-fill{
        height:100%;
        border-radius:999px;
        background:#f3d875;
      }


      /* ==========================
         COACH ACTIVITY
         ========================== */

      .mana-v866-coach{
        border-color:#40371a;
      }


      .mana-v866-feed-item{
        display:grid;
        grid-template-columns:
          38px
          minmax(0,1fr)
          auto;
        gap:10px;
        align-items:center;
        padding:12px 0;
        border-top:1px solid #242424;
      }


      .mana-v866-feed-item:first-child{
        border-top:0;
      }


      .mana-v866-feed-icon{
        width:36px;
        height:36px;
        display:grid;
        place-items:center;
        border-radius:50%;
        border:1px solid #3a3a3a;
        background:#111;
        color:#aaa;
        font-size:12px;
        font-weight:900;
      }


      .mana-v866-feed-icon.coach{
        border-color:#6d5920;
        background:#191607;
        color:#f3d875;
      }


      .mana-v866-feed-copy strong{
        display:block;
        color:#eee;
        font-size:12px;
      }


      .mana-v866-feed-copy span{
        display:block;
        margin-top:3px;
        color:#888;
        font-size:10px;
        line-height:1.4;
      }


      .mana-v866-feed-time{
        color:#666;
        font-size:9px;
        white-space:nowrap;
      }


      .mana-v866-empty{
        color:#777;
        font-size:11px;
        padding:8px 0;
      }


      /* ==========================
         NEXT UP
         ========================== */

      .mana-v866-next{
        border-color:#4b401c;
        background:
          linear-gradient(
            145deg,
            #16140b,
            #0a0a0a
          );
      }


      .mana-v866-next-label{
        color:#f3d875;
        font-size:10px;
        font-weight:900;
        letter-spacing:.12em;
      }


      .mana-v866-next h3{
        margin:7px 0 5px;
        font-size:22px;
      }


      .mana-v866-next p{
        margin:0;
        color:#999;
        font-size:12px;
        line-height:1.5;
      }


      .mana-v866-program-note{
        margin-top:12px;
        color:#f3d875;
        font-size:12px;
        font-weight:800;
      }


      /* ==========================
         MEMBERSHIP
         ========================== */

      .mana-v866-pricing-intro{
        margin-bottom:14px;
        color:#999;
        font-size:12px;
        line-height:1.5;
      }


      .mana-v866-plans{
        display:grid;
        gap:12px;
      }


      .mana-v866-plan{
        position:relative;
        padding:18px;
        border:1px solid #313131;
        border-radius:19px;
        background:#0a0a0a;
      }


      .mana-v866-plan.featured{
        border-color:#766322;
        background:
          linear-gradient(
            145deg,
            #191608,
            #090909
          );
      }


      .mana-v866-plan-badge{
        position:absolute;
        top:14px;
        right:14px;
        padding:5px 8px;
        border:1px solid #65551e;
        border-radius:999px;
        color:#f3d875;
        font-size:9px;
        font-weight:900;
      }


      .mana-v866-plan-name{
        color:#f3d875;
        font-size:11px;
        font-weight:900;
        letter-spacing:.1em;
      }


      .mana-v866-plan-title{
        margin-top:5px;
        color:#fff;
        font-size:22px;
        font-weight:900;
      }


      .mana-v866-price{
        margin-top:8px;
      }


      .mana-v866-price strong{
        color:#f3d875;
        font-size:28px;
      }


      .mana-v866-price span{
        color:#777;
        font-size:11px;
      }


      .mana-v866-features{
        margin-top:14px;
        display:grid;
        gap:8px;
      }


      .mana-v866-feature{
        display:grid;
        grid-template-columns:
          18px
          1fr;
        gap:7px;
        color:#aaa;
        font-size:11px;
        line-height:1.4;
      }


      .mana-v866-feature-check{
        color:#f3d875;
        font-weight:900;
      }


      .mana-v866-plan-note{
        margin-top:13px;
        padding-top:11px;
        border-top:1px solid #272727;
        color:#777;
        font-size:10px;
        line-height:1.45;
      }


      @media(max-width:390px){

        .mana-v866-feed-item{
          grid-template-columns:
            36px
            minmax(0,1fr);
        }


        .mana-v866-feed-time{
          grid-column:2;
        }

      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* =========================================
     RENDER
     ========================================= */

  function renderOverview() {
    if (
      !strengthOverviewOpen()
    ) {
      return;
    }


    const holder =
      document.getElementById(
        "manaV83Content"
      );


    if (!holder) {
      return;
    }


    const profile =
      loadProfile();


    const program =
      loadProgram();


    const logs =
      loadLogs();


    const foundations =
      dailyFoundations();


    const completed =
      foundationCount(
        foundations
      );


    const percent =
      Math.round(
        completed /
        4 *
        100
      );


    const name =
      firstName();


    const greeting =
      name
        ? `Kia ora, ${esc(name)}`
        : "Kia ora";


    const hasCoachRequest =
      coachActivity
        .some(
          item =>
            item.type ===
            "coach"
        );


    const message =
      welcomeMessage(
        foundations,
        hasCoachRequest
      );


    const nextIndex =
      nextWorkoutIndex(
        program,
        logs
      );


    const nextSession =
      program
        ?.sessions
        ?.[
          nextIndex
        ];


    const nextName =
      nextSession?.[0] ||
      "Your next strength session";


    holder.innerHTML = `

      <!-- WELCOME -->

      <div
        class="mana-v866-welcome"
      >

        <div
          class="mana-v866-kicker"
        >
          MANA STRENGTH
        </div>


        <h2>
          ${greeting}
        </h2>


        <div
          class="mana-v866-message"
        >
          ${esc(
            message
          )}
        </div>

      </div>


      <!-- TODAY'S FOCUS -->

      <div
        class="mana-v866-section"
      >

        <div
          class="mana-v866-section-head"
        >

          <h3>
            Today's Focus
          </h3>

          <span>
            DAILY FOUNDATIONS
          </span>

        </div>


        <div
          class="mana-v866-progress-wrap"
        >

          <div
            class="mana-v866-progress-row"
          >

            <strong>
              ${completed} of 4 complete
            </strong>

            <span>
              ${percent}%
            </span>

          </div>


          <div
            class="mana-v866-progress"
          >

            <div
              class="mana-v866-progress-fill"
              style="
                width:${percent}%;
              "
            ></div>

          </div>

        </div>


        <div
          class="mana-v866-focus"
        >

          ${focusRow(
            foundations.workout
          )}


          ${focusRow(
            foundations.water
          )}


          ${focusRow(
            foundations.protein
          )}


          ${focusRow(
            foundations.recovery,
            {
              manual:true
            }
          )}

        </div>

      </div>


      <!-- COACH ACTIVITY -->

      <div
        class="
          mana-v866-section
          mana-v866-coach
        "
      >

        <div
          class="mana-v866-section-head"
        >

          <h3>
            Coach Activity
          </h3>

          <span>
            LIVE
          </span>

        </div>


        <div>
          ${coachActivityHTML()}
        </div>

      </div>


      <!-- NEXT UP -->

      <div
        class="
          mana-v866-section
          mana-v866-next
        "
      >

        <div
          class="mana-v866-next-label"
        >
          NEXT UP
        </div>


        <h3>
          ${esc(
            nextName
          )}
        </h3>


        <p>
          ${
            profile.goal
              ? `Built around your ${esc(
                  profile.goal
                ).toLowerCase()} goal.`
              : "Your next personalised strength session."
          }
        </p>


        <div
          class="mana-v866-program-note"
        >
          Open the Program tab when you're ready to train →
        </div>

      </div>


      <!-- MEMBERSHIP -->

      <div
        class="mana-v866-section"
      >

        <div
          class="mana-v866-section-head"
        >

          <h3>
            Mana Strength Membership
          </h3>

          <span>
            MONTHLY
          </span>

        </div>


        <div
          class="mana-v866-pricing-intro"
        >
          Choose the level of coaching
          and accountability that suits
          you.
        </div>


        <div
          class="mana-v866-plans"
        >

          <!-- SELF-GUIDED -->

          <div
            class="mana-v866-plan"
          >

            <div
              class="mana-v866-plan-name"
            >
              MANA STRENGTH
            </div>

            <div
              class="mana-v866-plan-title"
            >
              Self-Guided
            </div>

            <div
              class="mana-v866-price"
            >

              <strong>
                $39.99
              </strong>

              <span>
                AUD / month
              </span>

            </div>

            <div
              class="mana-v866-features"
            >

              ${feature(
                "Personalised strength program"
              )}

              ${feature(
                "Workout logging and progression"
              )}

              ${feature(
                "Progress tracking"
              )}

              ${feature(
                "Personalised Fuel targets"
              )}

              ${feature(
                "Mana meal selections"
              )}

            </div>

          </div>


          <!-- SUPPORT -->

          <div
            class="
              mana-v866-plan
              featured
            "
          >

            <div
              class="mana-v866-plan-badge"
            >
              MOST POPULAR
            </div>

            <div
              class="mana-v866-plan-name"
            >
              MANA STRENGTH SUPPORT
            </div>

            <div
              class="mana-v866-plan-title"
            >
              Coach Support
            </div>

            <div
              class="mana-v866-price"
            >

              <strong>
                $79.99
              </strong>

              <span>
                AUD / month
              </span>

            </div>

            <div
              class="mana-v866-features"
            >

              ${feature(
                "Everything in Mana Strength"
              )}

              ${feature(
                "Weekly chat check-in"
              )}

              ${feature(
                "Coach feedback"
              )}

              ${feature(
                "Monthly program review"
              )}

              ${feature(
                "Program adjustments when needed"
              )}

            </div>

          </div>


          <!-- COACHING -->

          <div
            class="mana-v866-plan"
          >

            <div
              class="mana-v866-plan-name"
            >
              MANA STRENGTH COACHING
            </div>

            <div
              class="mana-v866-plan-title"
            >
              Personal Coaching
            </div>

            <div
              class="mana-v866-price"
            >

              <strong>
                $149.99
              </strong>

              <span>
                AUD / month
              </span>

            </div>

            <div
              class="mana-v866-features"
            >

              ${feature(
                "Everything in Coach Support"
              )}

              ${feature(
                "Fortnightly video check-in"
              )}

              ${feature(
                "Weekly chat check-in"
              )}

              ${feature(
                "Personal coach feedback"
              )}

              ${feature(
                "Priority program adjustments"
              )}

            </div>

          </div>

        </div>


        <div
          class="mana-v866-plan-note"
        >
          Payments and membership access
          will be connected before paid
          memberships go live.
        </div>

      </div>

    `;


    document
      .getElementById(
        "manaV866Recovery"
      )
      ?.addEventListener(
        "click",
        toggleRecovery
      );
  }


  /* =========================================
     REFRESH
     ========================================= */

  async function refreshOverview() {
    if (
      !strengthOverviewOpen()
    ) {
      return;
    }


    renderOverview();


    await loadCoachActivity();


    renderOverview();
  }


  function watch() {
    window.addEventListener(
      "mana:program-tab-change",
      () => {

        setTimeout(
          refreshOverview,
          60
        );

      }
    );


    window.addEventListener(
      "mana:strength-synced",
      () => {

        setTimeout(
          refreshOverview,
          100
        );

      }
    );


    window.addEventListener(
      "mana:profile-synced",
      () => {

        setTimeout(
          refreshOverview,
          100
        );

      }
    );


    window.addEventListener(
      "focus",
      () => {

        if (
          strengthOverviewOpen()
        ) {

          setTimeout(
            refreshOverview,
            100
          );

        }

      }
    );


    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.visibilityState ===
            "visible" &&
          strengthOverviewOpen()
        ) {

          setTimeout(
            refreshOverview,
            100
          );

        }

      }
    );


    window.addEventListener(
      "storage",
      event => {

        if (
          [
            PROFILE_KEY,
            PROGRAM_KEY,
            LOG_KEY,
            FUEL_KEY,
            TARGET_KEY,
            DAILY_KEY
          ].includes(
            event.key
          )
        ) {

          setTimeout(
            renderOverview,
            80
          );

        }

      }
    );
  }


  function init() {
    injectStyles();

    watch();


    setTimeout(
      refreshOverview,
      1200
    );
  }


  window.renderManaStrengthOverview =
    renderOverview;


  window.refreshManaStrengthOverview =
    refreshOverview;


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
