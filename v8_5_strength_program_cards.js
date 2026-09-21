/* =========================================
   MANA MOVEMENT TRAINING v8.5.1
   STRENGTH PROGRAM CARDS
   DIRECT WORKOUT LAUNCH

   v8.5.1:
   - SHOWS ACTUAL IN-PROGRESS WORKOUT
   - RESUME BUTTON ON CORRECT PROGRAM DAY
   - OTHER WORKOUTS REMAIN START WORKOUT
   ========================================= */

(() => {
  "use strict";


  const PROGRAM_KEY =
    "mana-strength-v62-program";

  const STATE_KEY =
    "mana-strength-v920-in-progress";

  const STYLE_ID =
    "mana-v85-strength-cards-style";


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


  function loadProgram() {
    return safeJson(
      localStorage.getItem(
        PROGRAM_KEY
      ),
      null
    );
  }


  function loadWorkoutState() {
    return safeJson(
      localStorage.getItem(
        STATE_KEY
      ) || "null",
      null
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

      .mana-v85-day{
        margin:12px 0;

        border:
          1px solid #292929;

        border-radius:20px;

        background:
          linear-gradient(
            145deg,
            #111,
            #090909
          );

        overflow:hidden;
      }


      .mana-v85-day.in-progress{
        border-color:#66561f;

        background:
          linear-gradient(
            145deg,
            #181507,
            #090909
          );
      }


      .mana-v85-head{
        padding:18px;
      }


      .mana-v85-top{
        display:flex;

        justify-content:
          space-between;

        align-items:flex-start;

        gap:12px;
      }


      .mana-v85-day-label{
        color:#f3d875;

        font-size:11px;

        font-weight:900;

        letter-spacing:.1em;
      }


      .mana-v85-title{
        margin-top:5px;

        font-size:22px;

        font-weight:900;
      }


      .mana-v85-count{
        flex:0 0 auto;

        padding:
          6px
          10px;

        border-radius:999px;

        border:
          1px solid #333;

        color:#999;

        font-size:11px;

        font-weight:800;
      }


      .mana-v85-progress-badge{
        display:inline-flex;

        align-items:center;

        gap:6px;

        margin-top:9px;

        padding:
          6px
          9px;

        border:
          1px solid
          #6d5b1f;

        border-radius:
          999px;

        background:
          #181509;

        color:
          #f3d875;

        font-size:
          10px;

        font-weight:
          900;

        letter-spacing:
          .08em;

        text-transform:
          uppercase;
      }


      .mana-v85-progress-badge::before{
        content:"●";

        font-size:8px;
      }


      .mana-v85-progress-time{
        margin-top:6px;

        color:#a99248;

        font-size:10px;

        font-weight:800;
      }


      .mana-v85-exercises{
        padding:
          0
          18px
          16px;
      }


      .mana-v85-exercise{
        display:flex;

        align-items:center;

        gap:10px;

        padding:
          9px
          0;

        border-top:
          1px solid #242424;

        color:#bbb;

        font-size:13px;
      }


      .mana-v85-num{
        width:24px;
        height:24px;

        border-radius:50%;

        display:grid;

        place-items:center;

        background:#181818;

        color:#f3d875;

        font-size:11px;

        font-weight:900;

        flex:0 0 auto;
      }


      .mana-v85-start{
        width:
          calc(
            100% - 36px
          );

        min-height:52px;

        margin:
          0
          18px
          18px;

        border:0;

        border-radius:15px;

        background:#f3d875;

        color:#111;

        font-size:14px;

        font-weight:900;

        cursor:pointer;
      }


      .mana-v85-start.resume{
        border:
          1px solid
          #f3d875;

        background:
          #171407;

        color:
          #f3d875;
      }


      .mana-v85-summary{
        color:#999;

        font-size:13px;

        margin-bottom:16px;
      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* =========================================
     PROGRAM TAB CHECK
     ========================================= */

  function strengthShellOpen() {

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
        "program"

    );
  }


  /* =========================================
     FORMAT PAUSED TIME
     ========================================= */

  function elapsedMs(
    state
  ) {

    if (!state) {
      return 0;
    }


    let elapsed =
      Number(
        state.elapsedMs || 0
      );


    if (
      state.running &&
      state.segmentStartedAt
    ) {

      elapsed +=
        Math.max(
          0,
          Date.now() -
          Number(
            state.segmentStartedAt
          )
        );

    }


    return elapsed;
  }


  function formatTime(
    milliseconds
  ) {

    const seconds =
      Math.max(
        0,
        Math.floor(
          Number(
            milliseconds || 0
          ) / 1000
        )
      );


    const mins =
      Math.floor(
        seconds / 60
      );


    const secs =
      seconds % 60;


    return (
      String(
        mins
      ).padStart(
        2,
        "0"
      ) +
      ":" +
      String(
        secs
      ).padStart(
        2,
        "0"
      )
    );
  }


  /* =========================================
     EXERCISE NAME
     ========================================= */

  function exerciseName(
    exercise
  ) {

    if (
      Array.isArray(
        exercise
      )
    ) {

      return (
        exercise[0] ||
        "Exercise"
      );

    }


    return String(
      exercise ||
      "Exercise"
    );
  }


  /* =========================================
     START / RESUME WORKOUT
     ========================================= */

  function startWorkout(
    dayIndex
  ) {

    const shell =
      document.getElementById(
        "manaV83ProgramShell"
      );


    /*
      Close Strength shell.
    */

    shell
      ?.classList
      .remove(
        "open"
      );


    document.body.style.overflow =
      "";


    /*
      Open the real v6.4 workout logger.

      v9.20 decides whether this is
      a new workout or the saved
      in-progress workout.
    */

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


  /* =========================================
     RENDER PROGRAM CARDS
     ========================================= */

  function renderCards() {

    if (
      !strengthShellOpen()
    ) {
      return;
    }


    const holder =
      document.getElementById(
        "manaV83Content"
      );


    const program =
      loadProgram();


    const state =
      loadWorkoutState();


    if (
      !holder ||
      !program
        ?.sessions
        ?.length
    ) {
      return;
    }


    const activeDayIndex =
      state &&
      Number.isInteger(
        Number(
          state.dayIndex
        )
      )
        ? Number(
            state.dayIndex
          )
        : null;


    const cards =
      program.sessions
        .map(
          (
            session,
            dayIndex
          ) => {

            const name =
              session?.[0] ||
              `Workout ${
                dayIndex + 1
              }`;


            const exercises =
              Array.isArray(
                session?.[1]
              )
                ? session[1]
                : [];


            const inProgress =
              activeDayIndex ===
              dayIndex;


            const rows =
              exercises
                .map(
                  (
                    exercise,
                    index
                  ) => `

                    <div
                      class="mana-v85-exercise"
                    >

                      <span
                        class="mana-v85-num"
                      >
                        ${index + 1}
                      </span>


                      <span>
                        ${
                          exerciseName(
                            exercise
                          )
                        }
                      </span>

                    </div>

                  `
                )
                .join("");


            return `

              <div
                class="
                  mana-v85-day
                  ${
                    inProgress
                      ? "in-progress"
                      : ""
                  }
                "
              >

                <div
                  class="mana-v85-head"
                >

                  <div
                    class="mana-v85-top"
                  >

                    <div>

                      <div
                        class="mana-v85-day-label"
                      >
                        DAY ${
                          dayIndex + 1
                        }
                      </div>


                      <div
                        class="mana-v85-title"
                      >
                        ${name}
                      </div>


                      ${
                        inProgress
                          ? `
                            <div
                              class="mana-v85-progress-badge"
                            >
                              IN PROGRESS
                            </div>


                            <div
                              class="mana-v85-progress-time"
                            >
                              ${
                                state.running
                                  ? "Current time"
                                  : "Paused at"
                              }
                              •
                              ${formatTime(
                                elapsedMs(
                                  state
                                )
                              )}
                            </div>
                          `
                          : ""
                      }

                    </div>


                    <div
                      class="mana-v85-count"
                    >
                      ${
                        exercises.length
                      }
                      EXERCISES
                    </div>

                  </div>

                </div>


                <div
                  class="mana-v85-exercises"
                >
                  ${rows}
                </div>


                <button
                  type="button"
                  class="
                    mana-v85-start
                    ${
                      inProgress
                        ? "resume"
                        : ""
                    }
                  "
                  data-v85-day="${dayIndex}"
                >
                  ${
                    inProgress
                      ? "RESUME WORKOUT →"
                      : "Start workout →"
                  }
                </button>

              </div>

            `;

          }
        )
        .join("");


    holder.innerHTML = `

      <div
        class="mana-v85-summary"
      >
        ${program.goal}
        •
        ${program.days}
        days per week
      </div>


      ${cards}

    `;


    holder
      .querySelectorAll(
        "[data-v85-day]"
      )
      .forEach(
        button => {

          button
            .addEventListener(
              "click",
              () => {

                const dayIndex =
                  Number(
                    button
                      .dataset
                      .v85Day
                  );


                startWorkout(
                  dayIndex
                );

              }
            );

        }
      );
  }


  /* =========================================
     WATCH
     ========================================= */

  function watch() {

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "#manaV83Tabs " +
            "[data-v83-tab='program']"
          )
        ) {

          setTimeout(
            renderCards,
            100
          );

        }


        if (
          event.target.closest(
            "#manaV80Strength"
          )
        ) {

          setTimeout(
            renderCards,
            250
          );

        }

      }
    );


    /*
      v9.20 emits this whenever
      the actual in-progress workout
      changes or completes.
    */

    window.addEventListener(
      "mana:workout-progress-change",
      () => {

        setTimeout(
          renderCards,
          80
        );

      }
    );


    window.addEventListener(
      "mana:strength-synced",
      () => {

        setTimeout(
          renderCards,
          120
        );

      }
    );


    const shell =
      document.getElementById(
        "manaV83ProgramShell"
      );


    if (shell) {

      const observer =
        new MutationObserver(
          () => {

            if (
              strengthShellOpen()
            ) {

              setTimeout(
                renderCards,
                80
              );

            }

          }
        );


      observer.observe(
        shell,
        {
          attributes:true,

          attributeFilter:[
            "class"
          ]
        }
      );
    }


    const holder =
      document.getElementById(
        "manaV83Content"
      );


    if (holder) {

      const contentObserver =
        new MutationObserver(
          () => {

            if (
              !strengthShellOpen()
            ) {
              return;
            }


            if (
              holder.querySelector(
                ".mana-v85-day"
              )
            ) {
              return;
            }


            setTimeout(
              renderCards,
              30
            );

          }
        );


      contentObserver.observe(
        holder,
        {
          childList:true,
          subtree:true
        }
      );
    }
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    injectStyles();

    watch();


    setTimeout(
      renderCards,
      1200
    );

  }


  window.refreshManaStrengthProgramCards =
    renderCards;


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
