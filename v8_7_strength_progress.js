/* =========================================
   MANA MOVEMENT TRAINING v8.7
   MANA STRENGTH — PROGRESS DASHBOARD

   RECENT PROGRESS
   PERSONAL BESTS
   EXERCISE HISTORY
   WORKOUT HISTORY
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

  const HISTORY_ID =
    "manaV87ExerciseHistory";


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
          day:"numeric",
          month:"short"
        }
      );
  }


  function formatNumber(
    value
  ) {
    return Math.round(
      Number(
        value || 0
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


    return minutes
      ? `${minutes} min`
      : "—";
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
          log.date || 0
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
        grid-template-columns:1fr 1fr;
        gap:10px;
        margin-bottom:12px;
      }


      .mana-v87-stat{
        background:#0d0d0d;
        border:1px solid #292929;
        border-radius:18px;
        padding:15px;
      }


      .mana-v87-label{
        color:#888;
        font-size:10px;
        font-weight:800;
        text-transform:uppercase;
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

        border:1px solid #292929;
        border-radius:20px;
        padding:17px;
        margin:12px 0;
      }


      .mana-v87-section h2{
        margin:0 0 4px;
        font-size:20px;
      }


      .mana-v87-section-intro{
        color:#888;
        font-size:12px;
        line-height:1.5;
        margin-bottom:12px;
      }


      /* ==========================
         RECENT PROGRESS
         ========================== */

      .mana-v87-recent-grid{
        display:grid;
        grid-template-columns:
          repeat(
            3,
            1fr
          );

        gap:8px;
      }


      .mana-v87-recent{
        background:#0d0d0d;
        border:1px solid #4a3d12;
        border-radius:16px;
        padding:12px;
      }


      .mana-v87-recent-name{
        color:#ddd;
        font-size:11px;
        font-weight:800;
        line-height:1.3;
      }


      .mana-v87-recent-change{
        margin-top:6px;
        color:#f3d875;
        font-size:19px;
        font-weight:900;
      }


      .mana-v87-recent-sub{
        margin-top:3px;
        color:#777;
        font-size:10px;
      }


      /* ==========================
         WORKOUT HISTORY
         ========================== */

      .mana-v87-workout{
        display:grid;
        grid-template-columns:1fr auto;
        gap:10px;
        padding:13px 0;
        border-top:1px solid #252525;
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
        width:100%;
        padding:14px 0;
        border:0;
        border-top:1px solid #252525;
        background:transparent;
        text-align:left;
        color:inherit;
        cursor:pointer;
      }


      .mana-v87-exercise:first-of-type{
        border-top:0;
      }


      .mana-v87-exercise:active{
        opacity:.75;
      }


      .mana-v87-exercise-head{
        display:flex;
        justify-content:space-between;
        align-items:flex-start;
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


      .mana-v87-tap{
        color:#666;
        font-size:10px;
        margin-top:5px;
      }


      .mana-v87-empty{
        padding:24px 10px;
        text-align:center;
        color:#888;
        font-size:13px;
        line-height:1.6;
      }


      /* ==========================
         EXERCISE HISTORY OVERLAY
         ========================== */

      #${HISTORY_ID}{
        position:fixed;
        inset:0;
        z-index:28000;

        display:none;
        overflow:auto;

        background:#050505;

        padding:
          calc(
            env(
              safe-area-inset-top
            ) + 18px
          )
          18px
          calc(
            40px +
            env(
              safe-area-inset-bottom
            )
          );
      }


      #${HISTORY_ID}.open{
        display:block;
      }


      .mana-v87-history-shell{
        width:min(
          540px,
          100%
        );

        margin:auto;
      }


      .mana-v87-history-head{
        display:flex;
        justify-content:space-between;
        align-items:flex-start;
        gap:14px;
        margin-bottom:18px;
      }


      .mana-v87-history-kicker{
        color:#f3d875;
        font-size:10px;
        font-weight:900;
        letter-spacing:.14em;
      }


      .mana-v87-history-head h1{
        margin:6px 0 0;
        font-size:28px;
      }


      .mana-v87-history-close{
        width:44px;
        height:44px;
        flex:0 0 44px;
        border-radius:50%;
        border:1px solid #333;
        background:#111;
        color:#fff;
        font-size:24px;
      }


      .mana-v87-history-stats{
        display:grid;
        grid-template-columns:
          repeat(
            3,
            1fr
          );

        gap:8px;
        margin-bottom:14px;
      }


      .mana-v87-history-stat{
        border:1px solid #292929;
        background:#0d0d0d;
        border-radius:16px;
        padding:13px;
      }


      .mana-v87-history-stat span{
        display:block;
        color:#777;
        font-size:9px;
        font-weight:800;
        text-transform:uppercase;
      }


      .mana-v87-history-stat strong{
        display:block;
        color:#f3d875;
        font-size:18px;
        margin-top:5px;
      }


      .mana-v87-session-row{
        display:grid;

        grid-template-columns:
          70px
          1fr
          auto;

        gap:10px;

        align-items:center;

        padding:14px 0;

        border-top:
          1px solid
          #252525;
      }


      .mana-v87-session-row:first-child{
        border-top:0;
      }


      .mana-v87-session-date{
        color:#aaa;
        font-size:12px;
        font-weight:800;
      }


      .mana-v87-session-main{
        color:#eee;
        font-size:13px;
        font-weight:900;
      }


      .mana-v87-session-sub{
        color:#777;
        font-size:10px;
        margin-top:3px;
      }


      .mana-v87-session-volume{
        color:#f3d875;
        font-size:11px;
        font-weight:900;
        text-align:right;
      }


      @media(max-width:420px){

        .mana-v87-recent-grid{
          grid-template-columns:
            1fr;
        }


        .mana-v87-history-stats{
          grid-template-columns:
            1fr
            1fr
            1fr;
        }

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


        .mana-v87-session-row{
          grid-template-columns:
            60px
            1fr;
        }


        .mana-v87-session-volume{
          grid-column:2;
          text-align:left;
        }

      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* =========================================
     EXERCISE HISTORY DATA
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

                sessionName:
                  log.sessionName ||
                  "",

                weight:
                  maxWeight,

                reps:
                  maxReps,

                volume,

                sets:
                  completedSets.length

              });

          }
        );

      }
    );


    map.forEach(
      entries => {

        entries.sort(
          (
            a,
            b
          ) =>
            new Date(
              a.date || 0
            ) -
            new Date(
              b.date || 0
            )
        );

      }
    );


    return map;
  }


  /* =========================================
     EXERCISE STATS
     ========================================= */

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


        const weighted =
          entries.filter(
            entry =>
              entry.weight >
              0
          );


        const first =
          weighted[0] ||
          entries[0];


        const latest =
          weighted[
            weighted.length -
            1
          ] ||
          entries[
            entries.length -
            1
          ];


        const previous =
          weighted.length >
          1
            ? weighted[
                weighted.length -
                2
              ]
            : null;


        const bestWeight =
          Math.max(
            0,

            ...entries.map(
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

            ...entries.map(
              item =>
                Number(
                  item.reps ||
                  0
                )
            )
          );


        const totalVolume =
          entries.reduce(
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


        const totalChange =
          first.weight >
            0 &&
          latest.weight >
            0
            ? latest.weight -
              first.weight
            : 0;


        const recentChange =
          previous &&
          latest.weight >
            0
            ? latest.weight -
              previous.weight
            : 0;


        stats.push({

          name,

          sessions:
            entries.length,

          entries,

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

          previousWeight:
            Number(
              previous?.weight ||
              0
            ),

          bestWeight,

          bestReps,

          totalVolume,

          totalChange,

          recentChange

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
     BEST LOAD
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
     RECENT PROGRESS
     ========================================= */

  function recentProgressHtml(
    stats
  ) {
    const improved =
      stats
        .filter(
          exercise =>
            exercise
              .recentChange >
            0
        )
        .sort(
          (
            a,
            b
          ) =>
            b.recentChange -
            a.recentChange
        )
        .slice(
          0,
          3
        );


    if (
      !improved.length
    ) {

      return `

        <div class="mana-v87-empty">

          Keep logging your workouts.
          Your recent load increases will
          appear here automatically.

        </div>

      `;
    }


    return `

      <div class="mana-v87-recent-grid">

        ${
          improved
            .map(
              exercise => `

                <div
                  class="mana-v87-recent"
                >

                  <div
                    class="mana-v87-recent-name"
                  >
                    ${exercise.name}
                  </div>


                  <div
                    class="mana-v87-recent-change"
                  >
                    +${exercise.recentChange}
                    kg
                  </div>


                  <div
                    class="mana-v87-recent-sub"
                  >
                    ${
                      exercise.previousWeight
                    }
                    →
                    ${
                      exercise.latestWeight
                    }
                    kg
                  </div>

                </div>

              `
            )
            .join("")
        }

      </div>

    `;
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

                  ${completed}/${
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
     EXERCISE LIST
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
        20
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
            exercise.totalChange >
            0
              ? `↑ +${exercise.totalChange} kg since first logged session`
              : exercise.totalChange <
                0
                ? `${exercise.totalChange} kg since first logged session`
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

            <button
              type="button"
              class="mana-v87-exercise"
              data-v87-exercise="${encodeURIComponent(
                exercise.name
              )}"
            >

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

                ${exercise.sessions}
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
                        ${start || 0} kg
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
                        ${current || 0} kg
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


              <div
                class="mana-v87-tap"
              >
                Tap to view history →
              </div>

            </button>

          `;

        }
      )
      .join("");
  }


  /* =========================================
     HISTORY OVERLAY
     ========================================= */

  function ensureHistoryScreen() {
    if (
      document.getElementById(
        HISTORY_ID
      )
    ) return;


    const screen =
      document.createElement(
        "div"
      );


    screen.id =
      HISTORY_ID;


    screen.innerHTML = `

      <div
        class="mana-v87-history-shell"
      >

        <div
          class="mana-v87-history-head"
        >

          <div>

            <div
              class="mana-v87-history-kicker"
            >
              MANA STRENGTH
            </div>


            <h1
              id="manaV87HistoryTitle"
            >
              Exercise History
            </h1>

          </div>


          <button
            type="button"
            class="mana-v87-history-close"
            id="manaV87HistoryClose"
          >
            ×
          </button>

        </div>


        <div
          id="manaV87HistoryBody"
        ></div>

      </div>

    `;


    document.body.appendChild(
      screen
    );


    document
      .getElementById(
        "manaV87HistoryClose"
      )
      .onclick =
        closeExerciseHistory;
  }


  function closeExerciseHistory() {
    document
      .getElementById(
        HISTORY_ID
      )
      ?.classList
      .remove(
        "open"
      );


    document.body.style.overflow =
      "hidden";
  }


  function openExerciseHistory(
    exerciseName
  ) {
    ensureHistoryScreen();


    const logs =
      loadLogs();


    const stats =
      exerciseStats(
        logs
      );


    const exercise =
      stats.find(
        item =>
          item.name ===
          exerciseName
      );


    if (!exercise) {
      return;
    }


    const title =
      document.getElementById(
        "manaV87HistoryTitle"
      );


    const body =
      document.getElementById(
        "manaV87HistoryBody"
      );


    if (
      !title ||
      !body
    ) return;


    title.textContent =
      exercise.name;


    const sessions =
      exercise.entries
        .slice(
          -10
        )
        .reverse()
        .map(
          entry => `

            <div
              class="mana-v87-session-row"
            >

              <div
                class="mana-v87-session-date"
              >
                ${
                  formatDate(
                    entry.date
                  )
                }
              </div>


              <div>

                <div
                  class="mana-v87-session-main"
                >

                  ${
                    entry.weight >
                    0
                      ? `${entry.weight} kg`
                      : "Bodyweight"
                  }

                  ×

                  ${
                    entry.reps ||
                    "—"
                  }

                  reps

                </div>


                <div
                  class="mana-v87-session-sub"
                >
                  ${
                    entry.sets
                  }
                  completed
                  ${
                    entry.sets ===
                    1
                      ? "set"
                      : "sets"
                  }

                  ${
                    entry.sessionName
                      ? ` • ${entry.sessionName}`
                      : ""
                  }
                </div>

              </div>


              <div
                class="mana-v87-session-volume"
              >

                ${
                  entry.volume >
                  0
                    ? `${formatNumber(
                        entry.volume
                      )} kg`
                    : "—"
                }

              </div>

            </div>

          `
        )
        .join("");


    body.innerHTML = `

      <div
        class="mana-v87-history-stats"
      >

        <div
          class="mana-v87-history-stat"
        >

          <span>
            PB
          </span>

          <strong>
            ${
              exercise.bestWeight >
              0
                ? `${exercise.bestWeight} kg`
                : `${exercise.bestReps} reps`
            }
          </strong>

        </div>


        <div
          class="mana-v87-history-stat"
        >

          <span>
            Latest
          </span>

          <strong>
            ${
              exercise.latestWeight >
              0
                ? `${exercise.latestWeight} kg`
                : `${exercise.bestReps} reps`
            }
          </strong>

        </div>


        <div
          class="mana-v87-history-stat"
        >

          <span>
            Sessions
          </span>

          <strong>
            ${exercise.sessions}
          </strong>

        </div>

      </div>


      <div
        class="mana-v87-section"
      >

        <h2>
          Training History
        </h2>


        <div
          class="mana-v87-section-intro"
        >
          Last ${
            Math.min(
              10,
              exercise.entries.length
            )
          } logged sessions.
        </div>


        ${sessions}

      </div>

    `;


    document
      .getElementById(
        HISTORY_ID
      )
      .classList
      .add(
        "open"
      );


    document.body.style.overflow =
      "hidden";


    document
      .getElementById(
        HISTORY_ID
      )
      .scrollTop =
        0;
  }


  /* =========================================
     RENDER PROGRESS
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

      <div
        class="mana-v87-grid"
      >

        <div
          class="mana-v87-stat"
        >

          <div
            class="mana-v87-label"
          >
            This week
          </div>

          <div
            class="mana-v87-value"
          >
            ${thisWeek.length}
          </div>

          <div
            class="mana-v87-sub"
          >
            Workouts completed
          </div>

        </div>


        <div
          class="mana-v87-stat"
        >

          <div
            class="mana-v87-label"
          >
            Total workouts
          </div>

          <div
            class="mana-v87-value"
          >
            ${logs.length}
          </div>

          <div
            class="mana-v87-sub"
          >
            Saved training sessions
          </div>

        </div>


        <div
          class="mana-v87-stat"
        >

          <div
            class="mana-v87-label"
          >
            Total volume
          </div>

          <div
            class="mana-v87-value"
          >
            ${
              totalVolume
                ? formatNumber(
                    totalVolume
                  )
                : "—"
            }
          </div>

          <div
            class="mana-v87-sub"
          >
            ${
              totalVolume
                ? "kg lifted"
                : "Start logging loads"
            }
          </div>

        </div>


        <div
          class="mana-v87-stat"
        >

          <div
            class="mana-v87-label"
          >
            Best load
          </div>

          <div
            class="mana-v87-value"
          >
            ${
              best.weight
                ? `${best.weight} kg`
                : "—"
            }
          </div>

          <div
            class="mana-v87-sub"
          >
            ${
              best.name ||
              "No weighted PB yet"
            }
          </div>

        </div>

      </div>


      <div
        class="mana-v87-section"
      >

        <h2>
          Recent Progress
        </h2>

        <div
          class="mana-v87-section-intro"
        >
          Load increases from the previous
          logged session for each exercise.
        </div>


        ${
          recentProgressHtml(
            exercises
          )
        }

      </div>


      <div
        class="mana-v87-section"
      >

        <h2>
          Exercise Progress
        </h2>

        <div
          class="mana-v87-section-intro"
        >
          Tap an exercise to see its
          individual training history.
        </div>


        ${
          exerciseHtml(
            exercises
          )
        }

      </div>


      <div
        class="mana-v87-section"
      >

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


    holder
      .querySelectorAll(
        "[data-v87-exercise]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              const name =
                decodeURIComponent(
                  button.dataset
                    .v87Exercise
                );


              openExerciseHistory(
                name
              );
            };

        }
      );
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

    ensureHistoryScreen();

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
