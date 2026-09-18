/* =========================================
   MANA MOVEMENT TRAINING v8.6.5
   MANA STRENGTH — OVERVIEW

   PERSONALISED WELCOME
   REAL ACTIVITY
   COACH ACTIVITY
   NEXT UP
   MEMBERSHIP LEVELS

   NO START WORKOUT BUTTON
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

  const STYLE_ID =
    "mana-v865-strength-overview-style";

  let coachActivity = [];

  let coachActivityLoaded =
    false;


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


  function startOfWeek() {
    const now =
      new Date();

    const day =
      now.getDay();

    const diff =
      day === 0
        ? 6
        : day - 1;

    const start =
      new Date(now);

    start.setHours(
      0,
      0,
      0,
      0
    );

    start.setDate(
      start.getDate() -
      diff
    );

    return start;
  }


  function weekLogs(
    logs
  ) {
    const start =
      startOfWeek()
        .getTime();

    return logs.filter(
      log => {

        const value =
          new Date(
            log.date ||
            log.created_at ||
            0
          ).getTime();

        return (
          Number.isFinite(value) &&
          value >= start
        );

      }
    );
  }


  function latestLog(
    logs
  ) {
    if (!logs.length) {
      return null;
    }

    return [
      ...logs
    ]
      .sort(
        (a, b) => {

          const timeA =
            new Date(
              a.date ||
              a.created_at ||
              0
            ).getTime();

          const timeB =
            new Date(
              b.date ||
              b.created_at ||
              0
            ).getTime();

          return (
            timeB -
            timeA
          );

        }
      )[0];
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


  function lastWorkoutText(
    log
  ) {
    if (!log) {
      return "No workouts yet";
    }

    const ago =
      daysSince(
        log.date ||
        log.created_at
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
      return (
        `${ago} days ago`
      );
    }

    return "Recently";
  }


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


  function welcomeMessage(
    weeklyDone,
    weeklyTarget,
    latest,
    nextName,
    hasCoachRequest
  ) {
    const remaining =
      Math.max(
        0,
        weeklyTarget -
        weeklyDone
      );

    const ago =
      latest
        ? daysSince(
            latest.date ||
            latest.created_at
          )
        : null;


    if (hasCoachRequest) {
      return (
        "You've got a coach check-in waiting. " +
        "Have a look at your activity below, then complete your check-in when you're ready."
      );
    }


    if (
      weeklyTarget &&
      weeklyDone >=
        weeklyTarget
    ) {
      return (
        "Strong week. You've completed your planned training. " +
        "Use the rest of the week to recover well and keep your Fuel consistent."
      );
    }


    if (
      ago === 0
    ) {
      return (
        "Nice work getting a session done today. " +
        (
          nextName
            ? `${nextName} is next when you're ready.`
            : "Keep building on it."
        )
      );
    }


    if (
      ago === 1
    ) {
      return (
        "You trained yesterday, so you're building good momentum. " +
        (
          remaining
            ? `${remaining} planned session${remaining === 1 ? "" : "s"} left this week.`
            : "Stay consistent with your recovery."
        )
      );
    }


    if (!latest) {
      return (
        "Your Mana Strength plan is ready. " +
        "Head into Program when you're ready to begin your first session."
      );
    }


    if (
      Number.isFinite(
        ago
      ) &&
      ago >= 4
    ) {
      return (
        `It's been ${ago} days since your last logged workout. ` +
        "A good next step is to get back into your Program and rebuild the rhythm."
      );
    }


    if (remaining) {
      return (
        `You've completed ${weeklyDone} of ${weeklyTarget} planned sessions this week. ` +
        `${remaining} to go — keep moving with purpose.`
      );
    }


    return (
      "Keep building consistency. Your training, Fuel and progress are all connected here."
    );
  }


  async function loadCoachActivity() {
    coachActivity = [];

    const program =
      loadProgram();

    const logs =
      loadLogs();

    const fuel =
      todayFuelTotals();

    const latest =
      latestLog(
        logs
      );


    if (program?.sessions?.length) {

      coachActivity.push({
        type:"program",
        title:"Your strength program is ready",
        text:
          `${program.sessions.length} training day${program.sessions.length === 1 ? "" : "s"} available in Program.`,
        time:null
      });

    }


    if (latest) {

      coachActivity.push({
        type:"training",
        title:"Workout logged",
        text:
          latest.sessionName ||
          "Strength session completed",
        time:
          latest.date ||
          latest.created_at ||
          null
      });

    }


    if (
      fuel.meals ||
      fuel.water
    ) {

      coachActivity.push({
        type:"fuel",
        title:"Fuel updated today",
        text:
          `${fuel.meals} meal${fuel.meals === 1 ? "" : "s"} logged • ${Math.round(fuel.protein)}g protein`,
        time:
          new Date()
            .toISOString()
      });

    }


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

            coachActivity.unshift({
              type:"coach",
              title:
                "Coach check-in requested",
              text:
                "Lewis has requested a check-in from you.",
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


    coachActivityLoaded =
      true;
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


  function activityIcon(
    type
  ) {
    if (
      type === "coach"
    ) {
      return "C";
    }

    if (
      type === "fuel"
    ) {
      return "F";
    }

    if (
      type === "training"
    ) {
      return "S";
    }

    return "M";
  }


  function coachActivityHTML() {
    if (
      !coachActivityLoaded
    ) {
      return `

        <div
          class="mana-v865-activity-empty"
        >
          Checking your latest activity…
        </div>

      `;
    }


    if (
      !coachActivity.length
    ) {
      return `

        <div
          class="mana-v865-activity-empty"
        >
          No new coach activity yet.
        </div>

      `;
    }


    return coachActivity
      .slice(
        0,
        5
      )
      .map(
        item => `

          <div
            class="mana-v865-feed-item"
          >

            <div
              class="
                mana-v865-feed-icon
                ${
                  item.type === "coach"
                    ? "coach"
                    : ""
                }
              "
            >
              ${activityIcon(
                item.type
              )}
            </div>


            <div
              class="mana-v865-feed-copy"
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
              class="mana-v865-feed-time"
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

      .mana-v865-welcome{
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


      .mana-v865-kicker{
        color:#f3d875;
        font-size:10px;
        font-weight:900;
        letter-spacing:.14em;
        text-transform:uppercase;
      }


      .mana-v865-welcome h2{
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


      .mana-v865-message{
        max-width:500px;
        color:#bbb;
        font-size:14px;
        line-height:1.6;
      }


      .mana-v865-section{
        margin:14px 0;
        padding:18px;
        border:1px solid #292929;
        border-radius:21px;
        background:#0d0d0d;
      }


      .mana-v865-section-head{
        display:flex;
        justify-content:space-between;
        align-items:flex-end;
        gap:10px;
        margin-bottom:14px;
      }


      .mana-v865-section-head h3{
        margin:0;
        font-size:20px;
      }


      .mana-v865-section-head span{
        color:#777;
        font-size:10px;
        text-transform:uppercase;
        letter-spacing:.08em;
      }


      .mana-v865-activity{
        display:grid;
        grid-template-columns:
          1fr
          1fr;
        gap:9px;
      }


      .mana-v865-activity-card{
        min-width:0;
        padding:14px;
        border:1px solid #282828;
        border-radius:16px;
        background:#090909;
      }


      .mana-v865-activity-label{
        color:#888;
        font-size:10px;
        font-weight:800;
        text-transform:uppercase;
      }


      .mana-v865-activity-value{
        margin-top:6px;
        color:#f3d875;
        font-size:21px;
        font-weight:900;
        line-height:1.1;
      }


      .mana-v865-activity-sub{
        margin-top:5px;
        color:#777;
        font-size:10px;
        line-height:1.35;
      }


      /* COACH ACTIVITY */

      .mana-v865-coach{
        border-color:#40371a;
      }


      .mana-v865-feed{
        display:grid;
      }


      .mana-v865-feed-item{
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


      .mana-v865-feed-item:first-child{
        border-top:0;
      }


      .mana-v865-feed-icon{
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


      .mana-v865-feed-icon.coach{
        border-color:#6d5920;
        background:#191607;
        color:#f3d875;
      }


      .mana-v865-feed-copy{
        min-width:0;
      }


      .mana-v865-feed-copy strong{
        display:block;
        color:#eee;
        font-size:12px;
      }


      .mana-v865-feed-copy span{
        display:block;
        margin-top:3px;
        color:#888;
        font-size:10px;
        line-height:1.4;
      }


      .mana-v865-feed-time{
        color:#666;
        font-size:9px;
        white-space:nowrap;
      }


      .mana-v865-activity-empty{
        color:#777;
        font-size:11px;
        padding:8px 0;
      }


      /* NEXT */

      .mana-v865-next{
        border-color:#4b401c;
        background:
          linear-gradient(
            145deg,
            #16140b,
            #0a0a0a
          );
      }


      .mana-v865-next-label{
        color:#f3d875;
        font-size:10px;
        font-weight:900;
        letter-spacing:.12em;
        text-transform:uppercase;
      }


      .mana-v865-next h3{
        margin:7px 0 5px;
        font-size:22px;
      }


      .mana-v865-next p{
        margin:0;
        color:#999;
        font-size:12px;
        line-height:1.5;
      }


      .mana-v865-program-note{
        margin-top:12px;
        color:#f3d875;
        font-size:12px;
        font-weight:800;
      }


      /* PLANS */

      .mana-v865-pricing-intro{
        margin-bottom:14px;
        color:#999;
        font-size:12px;
        line-height:1.5;
      }


      .mana-v865-plans{
        display:grid;
        gap:12px;
      }


      .mana-v865-plan{
        position:relative;
        padding:18px;
        border:1px solid #313131;
        border-radius:19px;
        background:#0a0a0a;
      }


      .mana-v865-plan.featured{
        border-color:#766322;
        background:
          linear-gradient(
            145deg,
            #191608,
            #090909
          );
      }


      .mana-v865-plan-badge{
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


      .mana-v865-plan-name{
        color:#f3d875;
        font-size:11px;
        font-weight:900;
        letter-spacing:.1em;
      }


      .mana-v865-plan-title{
        margin-top:5px;
        color:#fff;
        font-size:22px;
        font-weight:900;
      }


      .mana-v865-price{
        margin-top:8px;
      }


      .mana-v865-price strong{
        color:#f3d875;
        font-size:28px;
      }


      .mana-v865-price span{
        color:#777;
        font-size:11px;
      }


      .mana-v865-features{
        margin-top:14px;
        display:grid;
        gap:8px;
      }


      .mana-v865-feature{
        display:grid;
        grid-template-columns:
          18px
          1fr;
        gap:7px;
        color:#aaa;
        font-size:11px;
        line-height:1.4;
      }


      .mana-v865-check{
        color:#f3d875;
        font-weight:900;
      }


      .mana-v865-plan-note{
        margin-top:13px;
        padding-top:11px;
        border-top:1px solid #272727;
        color:#777;
        font-size:10px;
        line-height:1.45;
      }


      @media(max-width:390px){

        .mana-v865-feed-item{
          grid-template-columns:
            36px
            minmax(0,1fr);
        }


        .mana-v865-feed-time{
          grid-column:2;
        }

      }

    `;


    document.head.appendChild(
      style
    );
  }


  function feature(
    text
  ) {
    return `

      <div
        class="mana-v865-feature"
      >

        <span
          class="mana-v865-check"
        >
          ✓
        </span>

        <span>
          ${text}
        </span>

      </div>

    `;
  }


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


    const week =
      weekLogs(
        logs
      );


    const latest =
      latestLog(
        logs
      );


    const fuel =
      todayFuelTotals();


    const weeklyTarget =
      Number(
        profile.days ||
        program?.days ||
        program
          ?.sessions
          ?.length ||
        0
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


    const name =
      firstName();


    const greeting =
      name
        ? `Kia ora, ${esc(name)}`
        : "Kia ora";


    const hasCoachRequest =
      coachActivity.some(
        item =>
          item.type === "coach"
      );


    const personalMessage =
      welcomeMessage(
        week.length,
        weeklyTarget,
        latest,
        nextName,
        hasCoachRequest
      );


    holder.innerHTML = `

      <div
        class="mana-v865-welcome"
      >

        <div
          class="mana-v865-kicker"
        >
          MANA STRENGTH
        </div>


        <h2>
          ${greeting}
        </h2>


        <div
          class="mana-v865-message"
        >
          ${esc(
            personalMessage
          )}
        </div>

      </div>


      <div
        class="mana-v865-section"
      >

        <div
          class="mana-v865-section-head"
        >

          <h3>
            Your Activity
          </h3>

          <span>
            Today
          </span>

        </div>


        <div
          class="mana-v865-activity"
        >

          <div
            class="mana-v865-activity-card"
          >

            <div
              class="mana-v865-activity-label"
            >
              This week
            </div>

            <div
              class="mana-v865-activity-value"
            >
              ${week.length}
              ${
                weeklyTarget
                  ? `/ ${weeklyTarget}`
                  : ""
              }
            </div>

            <div
              class="mana-v865-activity-sub"
            >
              Workouts completed
            </div>

          </div>


          <div
            class="mana-v865-activity-card"
          >

            <div
              class="mana-v865-activity-label"
            >
              Last workout
            </div>

            <div
              class="mana-v865-activity-value"
            >
              ${esc(
                lastWorkoutText(
                  latest
                )
              )}
            </div>

            <div
              class="mana-v865-activity-sub"
            >
              ${
                latest?.sessionName
                  ? esc(
                      latest.sessionName
                    )
                  : "Training activity"
              }
            </div>

          </div>


          <div
            class="mana-v865-activity-card"
          >

            <div
              class="mana-v865-activity-label"
            >
              Calories
            </div>

            <div
              class="mana-v865-activity-value"
            >
              ${Math.round(
                fuel.calories
              )}
            </div>

            <div
              class="mana-v865-activity-sub"
            >
              Logged today
            </div>

          </div>


          <div
            class="mana-v865-activity-card"
          >

            <div
              class="mana-v865-activity-label"
            >
              Protein
            </div>

            <div
              class="mana-v865-activity-value"
            >
              ${Math.round(
                fuel.protein
              )}g
            </div>

            <div
              class="mana-v865-activity-sub"
            >
              Logged today
            </div>

          </div>

        </div>

      </div>


      <div
        class="
          mana-v865-section
          mana-v865-coach
        "
      >

        <div
          class="mana-v865-section-head"
        >

          <h3>
            Coach Activity
          </h3>

          <span>
            Live
          </span>

        </div>


        <div
          class="mana-v865-feed"
        >
          ${coachActivityHTML()}
        </div>

      </div>


      <div
        class="
          mana-v865-section
          mana-v865-next
        "
      >

        <div
          class="mana-v865-next-label"
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
          class="mana-v865-program-note"
        >
          Open the Program tab when you're ready to train →
        </div>

      </div>


      <div
        class="mana-v865-section"
      >

        <div
          class="mana-v865-section-head"
        >

          <h3>
            Mana Strength Membership
          </h3>

          <span>
            Monthly
          </span>

        </div>


        <div
          class="mana-v865-pricing-intro"
        >
          Choose the level of coaching
          and accountability you want.
        </div>


        <div
          class="mana-v865-plans"
        >

          <div
            class="mana-v865-plan"
          >

            <div
              class="mana-v865-plan-name"
            >
              MANA STRENGTH
            </div>

            <div
              class="mana-v865-plan-title"
            >
              Self-Guided
            </div>

            <div
              class="mana-v865-price"
            >
              <strong>
                $39.99
              </strong>

              <span>
                AUD / month
              </span>
            </div>

            <div
              class="mana-v865-features"
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


          <div
            class="
              mana-v865-plan
              featured
            "
          >

            <div
              class="mana-v865-plan-badge"
            >
              MOST POPULAR
            </div>

            <div
              class="mana-v865-plan-name"
            >
              MANA STRENGTH SUPPORT
            </div>

            <div
              class="mana-v865-plan-title"
            >
              Coach Support
            </div>

            <div
              class="mana-v865-price"
            >
              <strong>
                $79.99
              </strong>

              <span>
                AUD / month
              </span>
            </div>

            <div
              class="mana-v865-features"
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


          <div
            class="mana-v865-plan"
          >

            <div
              class="mana-v865-plan-name"
            >
              MANA STRENGTH COACHING
            </div>

            <div
              class="mana-v865-plan-title"
            >
              Personal Coaching
            </div>

            <div
              class="mana-v865-price"
            >
              <strong>
                $149.99
              </strong>

              <span>
                AUD / month
              </span>
            </div>

            <div
              class="mana-v865-features"
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
          class="mana-v865-plan-note"
        >
          Payments and membership access
          will be connected before paid
          memberships go live.
        </div>

      </div>

    `;
  }


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
    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "#manaV83Tabs [data-v83-tab='overview']"
          ) ||
          event.target.closest(
            "#manaV80Strength"
          )
        ) {

          setTimeout(
            refreshOverview,
            80
          );

        }

      }
    );


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
