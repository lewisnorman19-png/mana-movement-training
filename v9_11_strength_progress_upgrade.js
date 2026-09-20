/* =========================================
   MANA MOVEMENT TRAINING v9.11.0
   MANA STRENGTH — PROGRESS UPGRADE

   - THIS WEEK SUMMARY
   - WORKOUT TARGET
   - TOTAL VOLUME
   - AVG COMPLETION
   - AVG DURATION
   - 4 WEEK TRAINING TREND
   - PERSONAL BESTS
   - RECENT WORKOUTS
   ========================================= */

(() => {
  "use strict";


  const STYLE_ID =
    "mana-v9110-progress-style";

  const LOG_KEY =
    "mana-strength-v64-logs";

  const PROGRAM_KEY =
    "mana-strength-v62-program";


  let rendering =
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


  function loadLogs() {
    const logs =
      safeJson(
        localStorage.getItem(
          LOG_KEY
        ) || "[]",
        []
      );


    return Array.isArray(
      logs
    )
      ? logs
      : [];
  }


  function loadProgram() {
    return safeJson(
      localStorage.getItem(
        PROGRAM_KEY
      ) || "null",
      null
    );
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


  function progressOpen() {
    const shell =
      document.getElementById(
        "manaV83ProgramShell"
      );


    const title =
      document.getElementById(
        "manaV83Title"
      );


    const tab =
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

      tab
        ?.dataset
        ?.v83Tab ===
        "progress"

    );
  }


  function weekStart(
    offset = 0
  ) {
    const now =
      new Date();


    const day =
      (
        now.getDay() +
        6
      ) % 7;


    const start =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );


    start.setDate(
      start.getDate() -
      day -
      (
        offset *
        7
      )
    );


    start.setHours(
      0,
      0,
      0,
      0
    );


    return start;
  }


  function logsForWeek(
    logs,
    offset
  ) {
    const start =
      weekStart(
        offset
      );


    const end =
      new Date(
        start
      );


    end.setDate(
      start.getDate() +
      7
    );


    return logs.filter(
      log => {

        const date =
          new Date(
            log?.date || 0
          );


        return (
          !Number.isNaN(
            date.getTime()
          ) &&
          date >= start &&
          date < end
        );

      }
    );
  }


  function formatDate(
    value
  ) {
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


    return date.toLocaleDateString(
      undefined,
      {
        day:"numeric",
        month:"short"
      }
    );
  }


  function formatDuration(
    seconds
  ) {
    const mins =
      Math.round(
        Number(
          seconds || 0
        ) /
        60
      );


    return mins
      ? `${mins} min`
      : "—";
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


  /* =========================================
     WEEK STATS
     ========================================= */

  function currentWeekStats() {
    const logs =
      logsForWeek(
        loadLogs(),
        0
      );


    const program =
      loadProgram();


    const target =
      Number(
        program?.days ||
        program
          ?.sessions
          ?.length ||
        0
      );


    const volume =
      logs.reduce(
        (
          total,
          log
        ) =>
          total +
          Number(
            log.totalVolume || 0
          ),
        0
      );


    const avgCompletion =
      logs.length
        ? Math.round(
            logs.reduce(
              (
                total,
                log
              ) =>
                total +
                Number(
                  log.completionPercent ||
                  0
                ),
              0
            ) /
            logs.length
          )
        : 0;


    const avgDuration =
      logs.length
        ? Math.round(
            logs.reduce(
              (
                total,
                log
              ) =>
                total +
                Number(
                  log.durationSeconds ||
                  0
                ),
              0
            ) /
            logs.length
          )
        : 0;


    return {
      logs,
      target,
      volume,
      avgCompletion,
      avgDuration
    };
  }


  /* =========================================
     PERSONAL BESTS
     ========================================= */

  function personalBests() {
    const map =
      new Map();


    loadLogs()
      .forEach(
        log => {

          (
            log.exercises ||
            []
          ).forEach(
            exercise => {

              const name =
                exercise?.name;


              if (!name) {
                return;
              }


              let best =
                map.get(
                  name
                ) || 0;


              (
                exercise.sets ||
                []
              ).forEach(
                set => {

                  if (
                    !set.done
                  ) {
                    return;
                  }


                  best =
                    Math.max(
                      best,
                      Number(
                        set.weight ||
                        0
                      )
                    );

                }
              );


              map.set(
                name,
                best
              );

            }
          );

        }
      );


    return Array.from(
      map.entries()
    )
      .filter(
        (
          [, weight]
        ) =>
          weight > 0
      )
      .sort(
        (
          a,
          b
        ) =>
          b[1] -
          a[1]
      )
      .slice(
        0,
        5
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

      .mana-v9110-root{
        width:100%;
      }


      .mana-v9110-heading{
        margin-bottom:16px;
      }


      .mana-v9110-heading span{
        color:#f3d875;

        font-size:10px;

        font-weight:900;

        letter-spacing:.12em;
      }


      .mana-v9110-heading h2{
        margin:
          5px
          0
          4px;

        font-size:28px;
      }


      .mana-v9110-heading p{
        margin:0;

        color:#888;

        font-size:12px;
      }


      /* SUMMARY */

      .mana-v9110-grid{
        display:grid;

        grid-template-columns:
          1fr
          1fr;

        gap:10px;
      }


      .mana-v9110-stat{
        padding:15px;

        border:
          1px solid
          #292929;

        border-radius:18px;

        background:#0d0d0d;
      }


      .mana-v9110-label{
        color:#888;

        font-size:9px;

        font-weight:900;

        letter-spacing:.06em;

        text-transform:uppercase;
      }


      .mana-v9110-value{
        margin-top:6px;

        color:#f3d875;

        font-size:23px;

        font-weight:900;
      }


      .mana-v9110-sub{
        margin-top:4px;

        color:#777;

        font-size:10px;
      }


      /* SECTIONS */

      .mana-v9110-section{
        margin-top:14px;

        padding:17px;

        border:
          1px solid
          #292929;

        border-radius:20px;

        background:
          linear-gradient(
            145deg,
            #111,
            #090909
          );
      }


      .mana-v9110-section h3{
        margin:
          0
          0
          4px;

        font-size:19px;
      }


      .mana-v9110-section-copy{
        margin-bottom:14px;

        color:#777;

        font-size:11px;
      }


      /* FOUR WEEK TREND */

      .mana-v9110-weeks{
        display:grid;

        grid-template-columns:
          repeat(
            4,
            1fr
          );

        gap:8px;

        align-items:end;
      }


      .mana-v9110-week{
        text-align:center;
      }


      .mana-v9110-week-bar{
        height:90px;

        display:flex;

        align-items:flex-end;

        overflow:hidden;

        border-radius:
          10px
          10px
          4px
          4px;

        background:#181818;
      }


      .mana-v9110-week-fill{
        width:100%;

        min-height:4px;

        border-radius:
          10px
          10px
          4px
          4px;

        background:#f3d875;
      }


      .mana-v9110-week-value{
        margin-top:7px;

        color:#eee;

        font-size:12px;

        font-weight:900;
      }


      .mana-v9110-week-label{
        margin-top:2px;

        color:#666;

        font-size:8px;

        text-transform:uppercase;
      }


      /* PBs */

      .mana-v9110-pb{
        display:flex;

        justify-content:
          space-between;

        gap:12px;

        padding:12px 0;

        border-top:
          1px solid
          #252525;
      }


      .mana-v9110-pb:first-of-type{
        border-top:0;
      }


      .mana-v9110-pb-name{
        color:#ddd;

        font-size:12px;

        font-weight:800;
      }


      .mana-v9110-pb-value{
        color:#f3d875;

        font-size:13px;

        font-weight:900;
      }


      /* WORKOUT HISTORY */

      .mana-v9110-workout{
        display:grid;

        grid-template-columns:
          1fr
          auto;

        gap:10px;

        padding:13px 0;

        border-top:
          1px solid
          #252525;
      }


      .mana-v9110-workout:first-of-type{
        border-top:0;
      }


      .mana-v9110-workout-name{
        color:#eee;

        font-size:13px;

        font-weight:900;
      }


      .mana-v9110-workout-meta{
        margin-top:4px;

        color:#777;

        font-size:10px;
      }


      .mana-v9110-workout-volume{
        color:#f3d875;

        font-size:12px;

        font-weight:900;

        text-align:right;
      }


      .mana-v9110-empty{
        padding:20px 4px;

        color:#777;

        font-size:12px;

        line-height:1.5;
      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* =========================================
     RENDER
     ========================================= */

  function render() {
    if (
      rendering ||
      !progressOpen()
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


    rendering =
      true;


    try {

      const stats =
        currentWeekStats();


      const logs =
        loadLogs();


      const fourWeeks =
        [
          3,
          2,
          1,
          0
        ].map(
          offset =>
            logsForWeek(
              logs,
              offset
            ).length
        );


      const maxWeek =
        Math.max(
          1,
          ...fourWeeks,
          Number(
            stats.target || 0
          )
        );


      const pbs =
        personalBests();


      const recent =
        logs
          .slice(
            -8
          )
          .reverse();


      holder.innerHTML = `

        <div
          class="mana-v9110-root"
        >

          <div
            class="mana-v9110-heading"
          >

            <span>
              MANA STRENGTH
            </span>

            <h2>
              Your Progress
            </h2>

            <p>
              Track consistency,
              workload and strength
              over time.
            </p>

          </div>


          <div
            class="mana-v9110-grid"
          >

            <div
              class="mana-v9110-stat"
            >

              <div
                class="mana-v9110-label"
              >
                Workouts
              </div>

              <div
                class="mana-v9110-value"
              >
                ${stats.logs.length}
                /
                ${stats.target}
              </div>

              <div
                class="mana-v9110-sub"
              >
                This week
              </div>

            </div>


            <div
              class="mana-v9110-stat"
            >

              <div
                class="mana-v9110-label"
              >
                Volume
              </div>

              <div
                class="mana-v9110-value"
              >
                ${formatNumber(
                  stats.volume
                )}
              </div>

              <div
                class="mana-v9110-sub"
              >
                kg this week
              </div>

            </div>


            <div
              class="mana-v9110-stat"
            >

              <div
                class="mana-v9110-label"
              >
                Completion
              </div>

              <div
                class="mana-v9110-value"
              >
                ${stats.avgCompletion}%
              </div>

              <div
                class="mana-v9110-sub"
              >
                Average session
              </div>

            </div>


            <div
              class="mana-v9110-stat"
            >

              <div
                class="mana-v9110-label"
              >
                Duration
              </div>

              <div
                class="mana-v9110-value"
              >
                ${formatDuration(
                  stats.avgDuration
                )}
              </div>

              <div
                class="mana-v9110-sub"
              >
                Average workout
              </div>

            </div>

          </div>


          <!-- 4 WEEK TREND -->

          <div
            class="mana-v9110-section"
          >

            <h3>
              4 Week Training Trend
            </h3>

            <div
              class="mana-v9110-section-copy"
            >
              Completed workouts per week.
            </div>


            <div
              class="mana-v9110-weeks"
            >

              ${
                fourWeeks
                  .map(
                    (
                      count,
                      index
                    ) => {

                      const height =
                        Math.max(
                          4,
                          Math.round(
                            count /
                            maxWeek *
                            100
                          )
                        );


                      return `

                        <div
                          class="mana-v9110-week"
                        >

                          <div
                            class="mana-v9110-week-bar"
                          >

                            <div
                              class="mana-v9110-week-fill"
                              style="
                                height:${height}%;
                              "
                            ></div>

                          </div>


                          <div
                            class="mana-v9110-week-value"
                          >
                            ${count}
                          </div>


                          <div
                            class="mana-v9110-week-label"
                          >
                            ${
                              index === 3
                                ? "This week"
                                : `${3 - index}w ago`
                            }
                          </div>

                        </div>

                      `;

                    }
                  )
                  .join("")
              }

            </div>

          </div>


          <!-- PERSONAL BESTS -->

          <div
            class="mana-v9110-section"
          >

            <h3>
              Personal Bests
            </h3>

            <div
              class="mana-v9110-section-copy"
            >
              Your highest logged loads.
            </div>


            ${
              pbs.length
                ? pbs
                    .map(
                      (
                        [
                          name,
                          weight
                        ]
                      ) => `

                        <div
                          class="mana-v9110-pb"
                        >

                          <div
                            class="mana-v9110-pb-name"
                          >
                            ${esc(
                              name
                            )}
                          </div>

                          <div
                            class="mana-v9110-pb-value"
                          >
                            ${weight} kg
                          </div>

                        </div>

                      `
                    )
                    .join("")
                : `
                    <div
                      class="mana-v9110-empty"
                    >
                      Your personal bests
                      will appear as you
                      log workouts.
                    </div>
                  `
            }

          </div>


          <!-- RECENT WORKOUTS -->

          <div
            class="mana-v9110-section"
          >

            <h3>
              Recent Workouts
            </h3>

            <div
              class="mana-v9110-section-copy"
            >
              Your latest Strength sessions.
            </div>


            ${
              recent.length
                ? recent
                    .map(
                      log => `

                        <div
                          class="mana-v9110-workout"
                        >

                          <div>

                            <div
                              class="mana-v9110-workout-name"
                            >
                              ${esc(
                                log.sessionName ||
                                "Strength Workout"
                              )}
                            </div>


                            <div
                              class="mana-v9110-workout-meta"
                            >
                              ${formatDate(
                                log.date
                              )}
                              •
                              ${formatDuration(
                                log.durationSeconds
                              )}
                              •
                              ${
                                Number(
                                  log.completionPercent ||
                                  0
                                )
                              }%
                            </div>

                          </div>


                          <div
                            class="mana-v9110-workout-volume"
                          >
                            ${formatNumber(
                              log.totalVolume
                            )}
                            kg
                          </div>

                        </div>

                      `
                    )
                    .join("")
                : `
                    <div
                      class="mana-v9110-empty"
                    >
                      Complete your first
                      workout and your history
                      will appear here.
                    </div>
                  `
            }

          </div>

        </div>

      `;

    } finally {

      rendering =
        false;

    }
  }


  /* =========================================
     WATCH
     ========================================= */

  function watch() {

    window.addEventListener(
      "mana:program-tab-change",
      () => {

        setTimeout(
          render,
          120
        );

        setTimeout(
          render,
          350
        );

      }
    );


    window.addEventListener(
      "mana:strength-synced",
      () => {

        setTimeout(
          render,
          120
        );

      }
    );


    window.addEventListener(
      "focus",
      () => {

        setTimeout(
          render,
          100
        );

      }
    );


    let timer =
      null;


    const observer =
      new MutationObserver(
        () => {

          if (
            !progressOpen()
          ) {
            return;
          }


          clearTimeout(
            timer
          );


          timer =
            setTimeout(
              render,
              100
            );

        }
      );


    observer.observe(
      document.body,
      {
        childList:true,
        subtree:true
      }
    );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {
    injectStyles();

    watch();


    [
      700,
      1300,
      2200
    ].forEach(
      delay => {

        setTimeout(
          render,
          delay
        );

      }
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
