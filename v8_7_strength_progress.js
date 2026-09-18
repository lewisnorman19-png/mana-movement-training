/* =========================================
   MANA MOVEMENT TRAINING v8.7
   MANA STRENGTH — PROGRESS DASHBOARD

   WORKOUT HISTORY
   TOTAL VOLUME
   PERSONAL BESTS
   EXERCISE PROGRESSION
   ========================================= */

(() => {
  "use strict";


  const SHELL_ID =
    "manaV83ProgramShell";

  const CONTENT_ID =
    "manaV83Content";

  const LOG_KEY =
    "mana-strength-v64-logs";

  const STYLE_ID =
    "mana-v87-strength-progress-style";


  /* =========================================
     HELPERS
     ========================================= */

  function safeJson(
    raw,
    fallback
  ) {
    try {
      return JSON.parse(
        raw
      );
    } catch (_) {
      return fallback;
    }
  }


  function loadLogs() {
    return safeJson(
      localStorage.getItem(
        LOG_KEY
      ) || "[]",
      []
    );
  }


  function shellIsStrength() {
    const shell =
      document.getElementById(
        SHELL_ID
      );


    const title =
      document.getElementById(
        "manaV83Title"
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
        "MANA STRENGTH"
    );
  }


  function activeTab() {
    return (
      document
        .querySelector(
          "#manaV83Tabs .mana-v83-tab.active"
        )
        ?.dataset
        ?.v83Tab ||
      ""
    );
  }


  function formatDate(
    value
  ) {
    if (!value) {
      return "—";
    }


    const date =
      new Date(
        value
      );


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "—";
    }


    return date
      .toLocaleDateString(
        undefined,
        {
          day:
            "numeric",

          month:
            "short"
        }
      );
  }


  function formatNumber(
    number
  ) {
    return Math.round(
      Number(
        number || 0
      )
    ).toLocaleString();
  }


  function formatDuration(
    log
  ) {
    const seconds =
      Number(
        log.durationSeconds ||
        0
      );


    if (seconds > 0) {

      const mins =
        Math.floor(
          seconds / 60
        );


      const secs =
        seconds % 60;


      return (
        `${mins}:` +
        String(
          secs
        ).padStart(
          2,
          "0"
        )
      );
    }


    const minutes =
      Number(
        log.durationMinutes ||
        0
      );


    if (minutes) {
      return `${minutes} min`;
    }


    return "—";
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
      new Date(
        now
      );


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
          log.date ||
          0
        ).getTime() >=
        start
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
    ) return;


    const style =
      document.createElement(
        "style"
      );


    style.id =
      STYLE_ID;


    style.textContent = `

      .mana-v87-grid{
        display:grid;

        grid-template-columns:
          1fr
          1fr;

        gap:10px;

        margin-bottom:12px;
      }


      .mana-v87-stat{
        background:#0d0d0d;

        border:
          1px solid
          #292929;

        border-radius:18px;

        padding:15px;
      }


      .mana-v87-label{
        color:#888;

        font-size:10px;

        font-weight:800;

        text-transform:
          uppercase;

        letter-spacing:.08em;

        margin-bottom:5px;
      }


      .mana-v87-value{
        color:#f3d875;

        font-size:23px;

        font-weight:900;

        line-height:1.2;
      }


      .mana-v87-sub{
        color:#888;

        font-size:11px;

        margin-top:5px;

        line-height:1.4;
      }


      .mana-v87-section{
        background:
          linear-gradient(
            145deg,
            #111,
            #090909
          );

        border:
          1px solid
          #292929;

        border-radius:20px;

        padding:17px;

        margin:12px 0;
      }


      .mana-v87-section h2{
        margin:
          0
          0
          4px;

        font-size:20px;
      }


      .mana-v87-section-intro{
        color:#888;

        font-size:12px;

        line-height:1.5;

        margin-bottom:12px;
      }


      /* ==========================
         RECENT WORKOUTS
         ========================== */

      .mana-v87-workout{
        display:grid;

        grid-template-columns:
          1fr
          auto;

        gap:10px;

        padding:
          13px
          0;

        border-top:
          1px solid
          #252525;
      }


      .mana-v87-workout:first-of-type{
        border-top:0;
      }


      .mana-v87-workout-name{
        color:#eee;

        font-size:14px;

        font-weight:900;
      }


      .mana-v87-workout-meta{
        color:#888;

        font-size:11px;

        margin-top:4px;

        line-height:1.5;
      }


      .mana-v87-workout-volume{
        color:#f3d875;

        font-size:13px;

        font-weight:900;

        text-align:right;
      }


      /* ==========================
         EXERCISE PROGRESS
         ========================== */

      .mana-v87-exercise{
        padding:
          14px
          0;

        border-top:
          1px solid
          #252525;
      }


      .mana-v87-exercise:first-of-type{
        border-top:0;
      }


      .mana-v87-exercise-head{
        display:flex;

        justify-content:
          space-between;

        align-items:
          flex-start;

        gap:12px;
      }


      .mana-v87-exercise-name{
        color:#eee;

        font-size:14px;

        font-weight:900;
      }


      .mana-v87-pb{
        color:#f3d875;

        font-size:13px;

        font-weight:900;

        white-space:nowrap;
      }


      .mana-v87-exercise-meta{
        color:#888;

        font-size:11px;

        line-height:1.5;

        margin-top:5px;
      }


      .mana-v87-progress-row{
        display:grid;

        grid-template-columns:
          auto
          1fr
          auto;

        align-items:center;

        gap:9px;

        margin-top:10px;
      }


      .mana-v87-progress-number{
        color:#aaa;

        font-size:11px;

        font-weight:800;

        white-space:nowrap;
      }


      .mana-v87-bar{
        height:7px;

        border-radius:999px;

        overflow:hidden;

        background:#1f1f1f;
      }


      .mana-v87-bar-fill{
        height:100%;

        border-radius:999px;

        background:#f3d875;
      }


      .mana-v87-change{
        margin-top:7px;

        color:#f3d875;

        font-size:11px;

        font-weight:800;
      }


      .mana-v87-empty{
        padding:
          24px
          10px;

        text-align:center;

        color:#888;

        font-size:13px;

        line-height:1.6;
      }


      @media(max-width:380px){

        .mana-v87-value{
          font-size:20px;
        }


        .mana-v87-workout{
          grid-template-columns:
            1fr;
        }


        .mana-v87-workout-volume{
          text-align:left;
        }

      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* =========================================
     EXERCISE HISTORY
     ========================================= */

  function exerciseHistory(
    logs
  ) {
    const map =
      new Map();


    logs.forEach(
      log => {

        (
          log.exercises ||
          []
        ).forEach(
          exercise => {

            if (
              !exercise?.name
            ) return;


            if (
              !map.has(
                exercise.name
              )
            ) {

              map.set(
                exercise.name,
                []
              );
            }


            const completedSets =
              (
                exercise.sets ||
                []
              ).filter(
                set =>
                  set.done ||
                  Number(
                    set.weight
                  ) ||
                  Number(
                    set.reps
                  )
              );


            if (
              !completedSets.length
            ) return;


            const maxWeight =
              Math.max(
                0,

                ...completedSets.map(
                  set =>
                    Number(
                      set.weight ||
                      0
                    )
                )
              );


            const maxReps =
              Math.max(
                0,

                ...completedSets.map(
                  set =>
                    Number(
                      set.reps ||
                      0
                    )
                )
              );


            const volume =
              completedSets.reduce(
                (
                  total,
                  set
                ) =>
                  total +
                  (
                    Number(
                      set.weight ||
                      0
                    ) *
                    Number(
                      set.reps ||
                      0
                    )
                  ),
                0
              );


            map
              .get(
                exercise.name
              )
              .push({

                date:
                  log.date,

                weight:
                  maxWeight,

                reps:
                  maxReps,

                volume

              });

          }
        );

      }
    );


    return map;
  }


  function exerciseStats(
    logs
  ) {
    const history =
      exerciseHistory(
        logs
      );


    const stats =
      [];


    history.forEach(
      (
        entries,
        name
      ) => {

        if (
          !entries.length
        ) return;


        const ordered =
          entries
            .slice()
            .sort(
              (
                a,
                b
              ) =>
                new Date(
                  a.date ||
                  0
                ) -
                new Date(
                  b.date ||
                  0
                )
            );


        const weighted =
          ordered.filter(
            entry =>
              entry.weight >
              0
          );


        const first =
          weighted[0] ||
          ordered[0];


        const latest =
          weighted[
            weighted.length -
            1
          ] ||
          ordered[
            ordered.length -
            1
          ];


        const bestWeight =
          Math.max(
            0,

            ...ordered.map(
              item =>
                Number(
                  item.weight ||
                  0
                )
            )
          );


        const bestReps =
          Math.max(
            0,

            ...ordered.map(
              item =>
                Number(
                  item.reps ||
                  0
                )
            )
          );


        const totalVolume =
          ordered.reduce(
            (
              total,
              item
            ) =>
              total +
              Number(
                item.volume ||
                0
              ),
            0
          );


        const change =
          first.weight >
            0 &&
          latest.weight >
            0
            ? latest.weight -
              first.weight
            : 0;


        stats.push({

          name,

          sessions:
            ordered.length,

          firstWeight:
            Number(
              first.weight ||
              0
            ),

          latestWeight:
            Number(
              latest.weight ||
              0
            ),

          bestWeight,

          bestReps,

          totalVolume,

          change

        });

      }
    );


    return stats.sort(
      (
        a,
        b
      ) => {

        if (
          b.bestWeight !==
          a.bestWeight
        ) {
          return (
            b.bestWeight -
            a.bestWeight
          );
        }


        return (
          b.sessions -
          a.sessions
        );
      }
    );
  }


  /* =========================================
     TOP LOAD
     ========================================= */

  function bestLoad(
    exercises
  ) {
    return exercises.reduce(
      (
        best,
        exercise
      ) => {

        if (
          exercise.bestWeight >
          best.weight
        ) {
          return {
            name:
              exercise.name,

            weight:
              exercise.bestWeight
          };
        }


        return best;

      },
      {
        name:"",
        weight:0
      }
    );
  }


  /* =========================================
     RECENT WORKOUTS
     ========================================= */

  function recentWorkoutHtml(
    logs
  ) {
    if (
      !logs.length
    ) {

      return `

        <div class="mana-v87-empty">

          Complete your first workout and
          your training history will appear here.

        </div>

      `;
    }


    return logs
      .slice(
        -8
      )
      .reverse()
      .map(
        log => {

          const completion =
            Number(
              log.completionPercent ||
              0
            );


          const completed =
            Number(
              log.completedSets ||
              0
            );


          const totalSets =
            Number(
              log.totalSets ||
              0
            );


          return `

            <div class="mana-v87-workout">

              <div>

                <div
                  class="mana-v87-workout-name"
                >
                  ${
                    log.sessionName ||
                    "Workout"
                  }
                </div>


                <div
                  class="mana-v87-workout-meta"
                >
                  ${
                    formatDate(
                      log.date
                    )
                  }

                  •

                  ${
                    completed
                  }/${
                    totalSets ||
                    completed
                  }
                  sets

                  ${
                    completion
                      ? ` • ${completion}%`
                      : ""
                  }

                  •

                  ${
                    formatDuration(
                      log
                    )
                  }
                </div>

              </div>


              <div
                class="mana-v87-workout-volume"
              >

                ${
                  Number(
                    log.totalVolume ||
                    0
                  )
                    ? formatNumber(
                        log.totalVolume
                      ) +
                      " kg"
                    : "—"
                }

              </div>

            </div>

          `;

        }
      )
      .join("");
  }


  /* =========================================
     EXERCISE HTML
     ========================================= */

  function exerciseHtml(
    stats
  ) {
    if (
      !stats.length
    ) {

      return `

        <div class="mana-v87-empty">

          Your exercise progression will
          appear once you have logged workouts.

        </div>

      `;
    }


    return stats
      .slice(
        0,
        12
      )
      .map(
        exercise => {

          const start =
            exercise
              .firstWeight;


          const current =
            exercise
              .latestWeight;


          const best =
            exercise
              .bestWeight;


          let percent =
            0;


          if (
            best >
            0 &&
            current >
            0
          ) {

            percent =
              Math.min(
                100,

                Math.round(
                  current /
                  best *
                  100
                )
              );
          }


          const changeText =
            exercise.change >
            0
              ? `↑ +${exercise.change} kg since first logged session`
              : exercise.change <
                0
                ? `${exercise.change} kg since first logged session`
                : exercise.sessions >
                    1 &&
                  current >
                    0
                  ? "Holding current load"
                  : "Building your baseline";


          const rightSide =
            best > 0
              ? `${best} kg PB`
              : `${exercise.bestReps} reps`;


          return `

            <div class="mana-v87-exercise">

              <div
                class="mana-v87-exercise-head"
              >

                <div
                  class="mana-v87-exercise-name"
                >
                  ${exercise.name}
                </div>


                <div
                  class="mana-v87-pb"
                >
                  ${rightSide}
                </div>

              </div>


              <div
                class="mana-v87-exercise-meta"
              >
                ${
                  exercise.sessions
                }
                logged
                ${
                  exercise.sessions ===
                  1
                    ? "session"
                    : "sessions"
                }

                ${
                  current >
                  0
                    ? ` • Latest ${current} kg`
                    : ""
                }

                ${
                  exercise.totalVolume >
                  0
                    ? ` • ${formatNumber(
                        exercise.totalVolume
                      )} kg total volume`
                    : ""
                }
              </div>


              ${
                best >
                0
                  ? `

                    <div
                      class="mana-v87-progress-row"
                    >

                      <div
                        class="mana-v87-progress-number"
                      >
                        ${
                          start ||
                          0
                        } kg
                      </div>


                      <div
                        class="mana-v87-bar"
                      >

                        <div
                          class="mana-v87-bar-fill"
                          style="
                            width:
                            ${percent}%
                          "
                        ></div>

                      </div>


                      <div
                        class="mana-v87-progress-number"
                      >
                        ${
                          current ||
                          0
                        } kg
                      </div>

                    </div>

                  `
                  : ""
              }


              <div
                class="mana-v87-change"
              >
                ${changeText}
              </div>

            </div>

          `;

        }
      )
      .join("");
  }


  /* =========================================
     RENDER
     ========================================= */

  function renderProgress() {
    if (
      !shellIsStrength()
    ) return;


    if (
      activeTab() !==
      "progress"
    ) return;


    const holder =
      document.getElementById(
        CONTENT_ID
      );


    if (!holder) return;


    const logs =
      loadLogs();


    const thisWeek =
      weekLogs(
        logs
      );


    const totalVolume =
      logs.reduce(
        (
          total,
          log
        ) =>
          total +
          Number(
            log.totalVolume ||
            0
          ),
        0
      );


    const exercises =
      exerciseStats(
        logs
      );


    const best =
      bestLoad(
        exercises
      );


    const completedSets =
      logs.reduce(
        (
          total,
          log
        ) =>
          total +
          Number(
            log.completedSets ||
            0
          ),
        0
      );


    holder.innerHTML = `

      <div class="mana-v87-grid">

        <div class="mana-v87-stat">

          <div class="mana-v87-label">
            This week
          </div>

          <div class="mana-v87-value">
            ${thisWeek.length}
          </div>

          <div class="mana-v87-sub">
            Workouts completed
          </div>

        </div>


        <div class="mana-v87-stat">

          <div class="mana-v87-label">
            Total workouts
          </div>

          <div class="mana-v87-value">
            ${logs.length}
          </div>

          <div class="mana-v87-sub">
            Saved training sessions
          </div>

        </div>


        <div class="mana-v87-stat">

          <div class="mana-v87-label">
            Total volume
          </div>

          <div class="mana-v87-value">

            ${
              totalVolume
                ? formatNumber(
                    totalVolume
                  )
                : "—"
            }

          </div>

          <div class="mana-v87-sub">
            ${
              totalVolume
                ? "kg lifted"
                : "Start logging loads"
            }
          </div>

        </div>


        <div class="mana-v87-stat">

          <div class="mana-v87-label">
            Best load
          </div>

          <div class="mana-v87-value">

            ${
              best.weight
                ? `${best.weight} kg`
                : "—"
            }

          </div>

          <div class="mana-v87-sub">

            ${
              best.name ||
              "No weighted PB yet"
            }

          </div>

        </div>

      </div>


      <div class="mana-v87-section">

        <h2>
          Exercise Progress
        </h2>

        <div
          class="mana-v87-section-intro"
        >
          Your latest load, personal best
          and progression from your first
          recorded session.
        </div>


        ${
          exerciseHtml(
            exercises
          )
        }

      </div>


      <div class="mana-v87-section">

        <h2>
          Recent Workouts
        </h2>

        <div
          class="mana-v87-section-intro"
        >
          ${completedSets}
          completed sets across
          ${logs.length}
          ${
            logs.length ===
            1
              ? "workout"
              : "workouts"
          }.
        </div>


        ${
          recentWorkoutHtml(
            logs
          )
        }

      </div>

    `;
  }


  /* =========================================
     WIRING
     ========================================= */

  function scheduleRender() {
    setTimeout(
      renderProgress,
      70
    );
  }


  function wire() {

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            '#manaV83Tabs [data-v83-tab="progress"]'
          )
        ) {

          scheduleRender();
        }

      }
    );


    window.addEventListener(
      "mana:program-tab-change",
      scheduleRender
    );


    window.addEventListener(
      "mana:strength-synced",
      scheduleRender
    );


    window.addEventListener(
      "focus",
      scheduleRender
    );
  }


  function init() {
    injectStyles();

    wire();


    setTimeout(
      renderProgress,
      1400
    );
  }


  window.renderManaStrengthProgress =
    renderProgress;


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
