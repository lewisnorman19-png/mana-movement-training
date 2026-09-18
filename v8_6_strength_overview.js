/* =========================================
   MANA MOVEMENT TRAINING v8.6
   STRENGTH OVERVIEW — DAILY WORKOUT
   ========================================= */

(() => {
  "use strict";

  const PROGRAM_KEY =
    "mana-strength-v62-program";

  const LOG_KEY =
    "mana-strength-v64-logs";

  const PROFILE_KEY =
    "mana-profile-v67";

  const STYLE_ID =
    "mana-v86-strength-overview-style";


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


  function loadProgram() {
    return safeJson(
      localStorage.getItem(
        PROGRAM_KEY
      ),
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

      .mana-v86-today{
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

        padding:18px;

        margin-bottom:12px;
      }


      .mana-v86-label{
        color:#f3d875;

        font-size:11px;

        font-weight:900;

        text-transform:uppercase;

        letter-spacing:.1em;
      }


      .mana-v86-today h2{
        margin:
          7px
          0
          5px;

        font-size:26px;
      }


      .mana-v86-sub{
        color:#999;

        font-size:12px;

        line-height:1.5;
      }


      .mana-v86-list{
        margin-top:18px;

        border-top:
          1px solid
          #2d2a1c;
      }


      .mana-v86-exercise{
        display:grid;

        grid-template-columns:
          34px
          1fr
          auto;

        gap:10px;

        align-items:center;

        padding:
          13px
          0;

        border-bottom:
          1px solid
          #242424;
      }


      .mana-v86-number{
        width:30px;
        height:30px;

        display:grid;

        place-items:center;

        border-radius:50%;

        background:#111;

        border:
          1px solid
          #3b3420;

        color:#f3d875;

        font-size:12px;

        font-weight:900;
      }


      .mana-v86-name{
        color:#eee;

        font-size:14px;

        font-weight:800;
      }


      .mana-v86-target{
        color:#f3d875;

        font-size:12px;

        font-weight:800;

        text-align:right;

        white-space:nowrap;
      }


      .mana-v86-start{
        width:100%;

        min-height:58px;

        margin-top:17px;

        border:0;

        border-radius:16px;

        background:#f3d875;

        color:#111;

        font-size:16px;

        font-weight:900;
      }


      .mana-v86-grid{
        display:grid;

        grid-template-columns:
          1fr 1fr;

        gap:10px;
      }


      .mana-v86-stat{
        border:
          1px solid
          #292929;

        border-radius:18px;

        background:#0d0d0d;

        padding:15px;
      }


      .mana-v86-stat-label{
        color:#888;

        font-size:11px;

        text-transform:uppercase;

        letter-spacing:.06em;
      }


      .mana-v86-stat strong{
        display:block;

        color:#f3d875;

        font-size:21px;

        margin-top:5px;
      }


      .mana-v86-progress{
        height:8px;

        margin-top:10px;

        border-radius:999px;

        background:#1a1a1a;

        overflow:hidden;
      }


      .mana-v86-progress-fill{
        height:100%;

        border-radius:999px;

        background:#f3d875;
      }


      @media(
        max-width:390px
      ){
        .mana-v86-exercise{
          grid-template-columns:
            32px
            1fr;
        }


        .mana-v86-target{
          grid-column:2;

          text-align:left;

          margin-top:-4px;
        }
      }

    `;

    document.head.appendChild(
      style
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
        "#manaV83Tabs " +
        ".mana-v83-tab.active"
      );

    return Boolean(
      shell
        ?.classList
        .contains(
          "open"
        ) &&
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
      log =>
        new Date(
          log.date || 0
        ).getTime() >=
        start
    );
  }


  function nextWorkoutIndex(
    program,
    completed
  ) {
    const total =
      program
        ?.sessions
        ?.length || 0;

    if (!total) {
      return 0;
    }

    return (
      completed.length %
      total
    );
  }


  function profileSummary() {
    const profile =
      loadProfile();

    return [
      profile.goal,
      profile.days
        ? `${profile.days} days/week`
        : "",
      profile.experience,
      profile.equipment
    ]
      .filter(Boolean)
      .join(" • ");
  }


  function startWorkout(
    dayIndex
  ) {
    const shell =
      document.getElementById(
        "manaV83ProgramShell"
      );

    shell
      ?.classList
      .remove(
        "open"
      );

    document.body.style.overflow =
      "";


    if (
      typeof
        window
          .openManaStrengthWorkout ===
      "function"
    ) {
      window
        .openManaStrengthWorkout(
          dayIndex
        );

      return;
    }


    console.error(
      "Mana Strength workout logger unavailable."
    );
  }


  function renderOverview() {
    if (
      !strengthOverviewOpen()
    ) return;


    const holder =
      document.getElementById(
        "manaV83Content"
      );


    const program =
      loadProgram();


    if (
      !holder ||
      !program
        ?.sessions
        ?.length
    ) {
      return;
    }


    const logs =
      loadLogs();


    const completed =
      weekLogs(
        logs
      );


    const index =
      nextWorkoutIndex(
        program,
        completed
      );


    const session =
      program.sessions[
        index
      ];


    const exercises =
      Array.isArray(
        session?.[1]
      )
        ? session[1]
        : [];


    const exerciseRows =
      exercises
        .map(
          (
            exercise,
            exerciseIndex
          ) => {

            const name =
              Array.isArray(
                exercise
              )
                ? exercise[0]
                : String(
                    exercise
                  );


            const target =
              Array.isArray(
                exercise
              )
                ? exercise[1]
                : "";


            return `

              <div
                class="mana-v86-exercise"
              >

                <div
                  class="mana-v86-number"
                >
                  ${exerciseIndex + 1}
                </div>


                <div
                  class="mana-v86-name"
                >
                  ${name}
                </div>


                <div
                  class="mana-v86-target"
                >
                  ${target || ""}
                </div>

              </div>

            `;
          }
        )
        .join("");


    const weeklyTarget =
      program.sessions.length;


    const weekPercent =
      weeklyTarget
        ? Math.min(
            100,
            Math.round(
              completed.length /
              weeklyTarget *
              100
            )
          )
        : 0;


    const profile =
      loadProfile();


    holder.innerHTML = `

      <div
        class="mana-v86-today"
      >

        <div
          class="mana-v86-label"
        >
          TODAY'S WORKOUT
        </div>


        <h2>
          Day ${index + 1}
          •
          ${
            session?.[0] ||
            "Workout"
          }
        </h2>


        <div
          class="mana-v86-sub"
        >
          ${
            profileSummary() ||
            "Personalised strength training"
          }
        </div>


        <div
          class="mana-v86-list"
        >
          ${exerciseRows}
        </div>


        <button
          type="button"
          class="mana-v86-start"
          id="manaV86Start"
        >
          START WORKOUT →
        </button>

      </div>


      <div
        class="mana-v86-grid"
      >

        <div
          class="mana-v86-stat"
        >

          <div
            class="mana-v86-stat-label"
          >
            This week
          </div>

          <strong>
            ${completed.length}
            /
            ${weeklyTarget}
          </strong>

          <div
            class="mana-v86-sub"
          >
            Workouts completed
          </div>

          <div
            class="mana-v86-progress"
          >
            <div
              class="mana-v86-progress-fill"
              style="
                width:
                ${weekPercent}%
              "
            ></div>
          </div>

        </div>


        <div
          class="mana-v86-stat"
        >

          <div
            class="mana-v86-stat-label"
          >
            Goal
          </div>

          <strong>
            ${
              profile.goal ||
              program.goal ||
              "Strength"
            }
          </strong>

        </div>


        <div
          class="mana-v86-stat"
        >

          <div
            class="mana-v86-stat-label"
          >
            Training
          </div>

          <strong>
            ${
              profile.days ||
              program.days ||
              "—"
            }
            days
          </strong>

          <div
            class="mana-v86-sub"
          >
            Per week
          </div>

        </div>


        <div
          class="mana-v86-stat"
        >

          <div
            class="mana-v86-stat-label"
          >
            Equipment
          </div>

          <strong>
            ${
              profile.equipment ||
              program.equipment ||
              "—"
            }
          </strong>

        </div>

      </div>

    `;


    document
      .getElementById(
        "manaV86Start"
      )
      ?.addEventListener(
        "click",
        () =>
          startWorkout(
            index
          )
      );
  }


  function watch() {
    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "#manaV83Tabs " +
            "[data-v83-tab='overview']"
          )
        ) {
          setTimeout(
            renderOverview,
            80
          );
        }


        if (
          event.target.closest(
            "#manaV80Strength"
          )
        ) {
          setTimeout(
            renderOverview,
            200
          );
        }

      }
    );


    window.addEventListener(
      "mana:program-tab-change",
      () => {
        setTimeout(
          renderOverview,
          30
        );
      }
    );


    window.addEventListener(
      "mana:strength-synced",
      () => {
        setTimeout(
          renderOverview,
          100
        );
      }
    );
  }


  function init() {
    injectStyles();

    watch();


    setTimeout(
      renderOverview,
      1200
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
