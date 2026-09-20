/* =========================================
   MANA MOVEMENT TRAINING v9.15.0
   MANA STRENGTH — WORKOUT COMPLETE

   - WORKOUT COMPLETE SCREEN
   - SETS
   - COMPLETION %
   - TOTAL VOLUME
   - WORKOUT TIME
   - NEW PERSONAL BESTS
   - RETURN TO OVERVIEW
   ========================================= */

(() => {
  "use strict";


  const STYLE_ID =
    "mana-v9150-complete-style";

  const SCREEN_ID =
    "manaV915Complete";

  const LOG_KEY =
    "mana-strength-v64-logs";


  let lastKnownLogId =
    "";


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
    seconds
  ) {

    const total =
      Math.max(
        0,
        Math.round(
          Number(
            seconds || 0
          )
        )
      );


    const minutes =
      Math.floor(
        total /
        60
      );


    const remaining =
      total %
      60;


    if (
      minutes >=
      60
    ) {

      const hours =
        Math.floor(
          minutes /
          60
        );


      const mins =
        minutes %
        60;


      return (
        `${hours}h ${mins}m`
      );

    }


    if (
      minutes > 0
    ) {

      return (
        `${minutes}m ${remaining}s`
      );

    }


    return (
      `${remaining}s`
    );
  }


  /* =========================================
     PERSONAL BESTS
     ========================================= */

  function maxExerciseWeight(
    exercise
  ) {

    const sets =
      Array.isArray(
        exercise?.sets
      )
        ? exercise.sets
        : [];


    return Math.max(
      0,
      ...sets
        .filter(
          set =>
            set?.done
        )
        .map(
          set =>
            Number(
              set?.weight ||
              0
            )
        )
    );
  }


  function previousBest(
    logs,
    exerciseName
  ) {

    let best =
      0;


    logs.forEach(
      log => {

        (
          log?.exercises ||
          []
        ).forEach(
          exercise => {

            if (
              exercise?.name !==
              exerciseName
            ) {
              return;
            }


            best =
              Math.max(
                best,
                maxExerciseWeight(
                  exercise
                )
              );

          }
        );

      }
    );


    return best;
  }


  function getPersonalBests(
    latest,
    previousLogs
  ) {

    const pbs =
      [];


    (
      latest?.exercises ||
      []
    ).forEach(
      exercise => {

        const name =
          exercise?.name;


        if (!name) {
          return;
        }


        const latestBest =
          maxExerciseWeight(
            exercise
          );


        if (
          latestBest <=
          0
        ) {
          return;
        }


        const oldBest =
          previousBest(
            previousLogs,
            name
          );


        if (
          latestBest >
          oldBest
        ) {

          pbs.push({

            name,

            weight:
              latestBest,

            previous:
              oldBest

          });

        }

      }
    );


    return pbs;
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

      #${SCREEN_ID}{
        position:fixed;

        inset:0;

        z-index:70000;

        display:none;

        overflow:auto;

        padding:
          calc(
            env(
              safe-area-inset-top
            ) + 22px
          )
          16px
          calc(
            34px +
            env(
              safe-area-inset-bottom
            )
          );

        background:
          radial-gradient(
            circle at top,
            #241d08 0%,
            #0b0b0b 37%,
            #050505 78%
          );

        color:#fff;
      }


      #${SCREEN_ID}.open{
        display:block;
      }


      .mana-v9150-shell{
        width:
          min(
            540px,
            100%
          );

        margin:auto;
      }


      .mana-v9150-hero{
        padding:
          26px
          20px;

        text-align:center;

        border:
          1px solid
          #65541c;

        border-radius:
          24px;

        background:
          linear-gradient(
            145deg,
            #211b08,
            #0c0c0c 70%
          );
      }


      .mana-v9150-check{
        width:64px;
        height:64px;

        margin:
          0
          auto
          16px;

        display:grid;

        place-items:center;

        border-radius:50%;

        background:#f3d875;

        color:#111;

        font-size:30px;

        font-weight:900;
      }


      .mana-v9150-kicker{
        color:#f3d875;

        font-size:10px;

        font-weight:900;

        letter-spacing:.14em;

        text-transform:uppercase;
      }


      .mana-v9150-hero h1{
        margin:
          7px
          0
          5px;

        font-size:
          32px;

        line-height:1.05;
      }


      .mana-v9150-session{
        color:#a0a0a0;

        font-size:13px;
      }


      /* =========================
         SUMMARY
         ========================= */

      .mana-v9150-grid{
        display:grid;

        grid-template-columns:
          1fr
          1fr;

        gap:10px;

        margin-top:14px;
      }


      .mana-v9150-stat{
        padding:17px;

        border:
          1px solid
          #2d2d2d;

        border-radius:
          18px;

        background:#0d0d0d;
      }


      .mana-v9150-label{
        color:#7f7f7f;

        font-size:9px;

        font-weight:900;

        letter-spacing:.07em;

        text-transform:uppercase;
      }


      .mana-v9150-value{
        margin-top:6px;

        color:#f3d875;

        font-size:24px;

        font-weight:900;

        line-height:1.1;
      }


      .mana-v9150-sub{
        margin-top:4px;

        color:#686868;

        font-size:9px;
      }


      /* =========================
         PB SECTION
         ========================= */

      .mana-v9150-pbs{
        margin-top:14px;

        padding:18px;

        border:
          1px solid
          #51441b;

        border-radius:
          20px;

        background:
          linear-gradient(
            145deg,
            #171309,
            #090909
          );
      }


      .mana-v9150-pb-head{
        color:#f3d875;

        font-size:10px;

        font-weight:900;

        letter-spacing:.12em;
      }


      .mana-v9150-pb{
        display:flex;

        justify-content:
          space-between;

        gap:12px;

        align-items:center;

        padding:13px 0;

        border-top:
          1px solid
          #2d291a;
      }


      .mana-v9150-pb:first-of-type{
        margin-top:10px;
      }


      .mana-v9150-pb-name{
        color:#eee;

        font-size:13px;

        font-weight:800;
      }


      .mana-v9150-pb-old{
        margin-top:3px;

        color:#6f6f6f;

        font-size:9px;
      }


      .mana-v9150-pb-weight{
        color:#f3d875;

        font-size:18px;

        font-weight:900;

        white-space:nowrap;
      }


      /* =========================
         MESSAGE
         ========================= */

      .mana-v9150-message{
        margin-top:14px;

        padding:17px;

        border:
          1px solid
          #292929;

        border-radius:
          18px;

        background:#0d0d0d;

        text-align:center;
      }


      .mana-v9150-message strong{
        display:block;

        color:#fff;

        font-size:16px;
      }


      .mana-v9150-message span{
        display:block;

        margin-top:5px;

        color:#777;

        font-size:11px;

        line-height:1.5;
      }


      /* =========================
         BUTTON
         ========================= */

      .mana-v9150-back{
        width:100%;

        min-height:58px;

        margin-top:16px;

        border:0;

        border-radius:16px;

        background:#f3d875;

        color:#111;

        font-size:14px;

        font-weight:900;

        cursor:pointer;
      }


      .mana-v9150-back:active{
        transform:scale(.99);
      }


      @media(
        max-width:380px
      ){

        .mana-v9150-hero h1{
          font-size:28px;
        }


        .mana-v9150-value{
          font-size:21px;
        }

      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* =========================================
     SCREEN
     ========================================= */

  function ensureScreen() {

    if (
      document.getElementById(
        SCREEN_ID
      )
    ) {
      return;
    }


    const screen =
      document.createElement(
        "div"
      );


    screen.id =
      SCREEN_ID;


    screen.innerHTML = `

      <div
        class="mana-v9150-shell"
      >

        <div
          id="manaV915Content"
        ></div>

      </div>

    `;


    document.body.appendChild(
      screen
    );
  }


  /* =========================================
     RENDER
     ========================================= */

  function showCompleteScreen(
    latest,
    previousLogs
  ) {

    ensureScreen();


    const content =
      document.getElementById(
        "manaV915Content"
      );


    const screen =
      document.getElementById(
        SCREEN_ID
      );


    if (
      !content ||
      !screen
    ) {
      return;
    }


    const pbs =
      getPersonalBests(
        latest,
        previousLogs
      );


    const completion =
      Number(
        latest?.completionPercent ||
        0
      );


    const message =
      completion >= 100
        ? {
            title:
              "Session complete.",
            body:
              "Strong work. Recover well and keep building."
          }
        : completion >= 75
          ? {
              title:
                "Good session.",
              body:
                "Most of the work is done. Keep building consistency."
            }
          : {
              title:
                "Workout logged.",
              body:
                "Every quality session counts. Build from here."
            };


    content.innerHTML = `

      <div
        class="mana-v9150-hero"
      >

        <div
          class="mana-v9150-check"
        >
          ✓
        </div>


        <div
          class="mana-v9150-kicker"
        >
          MANA STRENGTH
        </div>


        <h1>
          Workout Complete
        </h1>


        <div
          class="mana-v9150-session"
        >
          ${esc(
            latest?.sessionName ||
            "Strength Session"
          )}
        </div>

      </div>


      <div
        class="mana-v9150-grid"
      >

        <div
          class="mana-v9150-stat"
        >

          <div
            class="mana-v9150-label"
          >
            Sets
          </div>

          <div
            class="mana-v9150-value"
          >
            ${Number(
              latest?.completedSets ||
              0
            )}
            /
            ${Number(
              latest?.totalSets ||
              0
            )}
          </div>

          <div
            class="mana-v9150-sub"
          >
            Completed
          </div>

        </div>


        <div
          class="mana-v9150-stat"
        >

          <div
            class="mana-v9150-label"
          >
            Completion
          </div>

          <div
            class="mana-v9150-value"
          >
            ${completion}%
          </div>

          <div
            class="mana-v9150-sub"
          >
            Session
          </div>

        </div>


        <div
          class="mana-v9150-stat"
        >

          <div
            class="mana-v9150-label"
          >
            Volume
          </div>

          <div
            class="mana-v9150-value"
          >
            ${formatNumber(
              latest?.totalVolume
            )}
          </div>

          <div
            class="mana-v9150-sub"
          >
            kg lifted
          </div>

        </div>


        <div
          class="mana-v9150-stat"
        >

          <div
            class="mana-v9150-label"
          >
            Time
          </div>

          <div
            class="mana-v9150-value"
          >
            ${formatDuration(
              latest?.durationSeconds
            )}
          </div>

          <div
            class="mana-v9150-sub"
          >
            Workout duration
          </div>

        </div>

      </div>


      ${
        pbs.length
          ? `

            <div
              class="mana-v9150-pbs"
            >

              <div
                class="mana-v9150-pb-head"
              >
                NEW PERSONAL BEST${pbs.length > 1 ? "S" : ""}
              </div>


              ${
                pbs
                  .map(
                    pb => `

                      <div
                        class="mana-v9150-pb"
                      >

                        <div>

                          <div
                            class="mana-v9150-pb-name"
                          >
                            ${esc(
                              pb.name
                            )}
                          </div>


                          <div
                            class="mana-v9150-pb-old"
                          >
                            ${
                              pb.previous > 0
                                ? `Previous ${pb.previous} kg`
                                : "First recorded load"
                            }
                          </div>

                        </div>


                        <div
                          class="mana-v9150-pb-weight"
                        >
                          ${pb.weight} kg
                        </div>

                      </div>

                    `
                  )
                  .join("")
              }

            </div>

          `
          : ""
      }


      <div
        class="mana-v9150-message"
      >

        <strong>
          ${esc(
            message.title
          )}
        </strong>

        <span>
          ${esc(
            message.body
          )}
        </span>

      </div>


      <button
        type="button"
        class="mana-v9150-back"
        id="manaV915Back"
      >
        BACK TO OVERVIEW →
      </button>

    `;


    document
      .getElementById(
        "manaV915Back"
      )
      .onclick =
        closeCompleteScreen;


    screen.classList.add(
      "open"
    );


    screen.scrollTop =
      0;


    document.body.style.overflow =
      "hidden";
  }


  /* =========================================
     CLOSE
     ========================================= */

  function closeCompleteScreen() {

    document
      .getElementById(
        SCREEN_ID
      )
      ?.classList
      .remove(
        "open"
      );


    document.body.style.overflow =
      "";


    if (
      typeof
        window
          .openManaProgram ===
      "function"
    ) {

      window.openManaProgram(
        "strength"
      );

    }
  }


  /* =========================================
     DETECT NEW COMPLETED WORKOUT
     ========================================= */

  function detectNewWorkout() {

    const logs =
      loadLogs();


    if (
      !logs.length
    ) {
      return;
    }


    const latest =
      logs[
        logs.length -
        1
      ];


    const id =
      String(
        latest?.id ||
        ""
      );


    if (
      !id ||
      id ===
      lastKnownLogId
    ) {
      return;
    }


    /*
      Remember immediately so other
      Strength sync events do not open
      the screen twice.
    */

    lastKnownLogId =
      id;


    const date =
      new Date(
        latest?.date ||
        0
      );


    /*
      Only show for a workout that was
      just completed.

      This prevents an old workout
      summary reopening on page refresh.
    */

    if (
      Number.isNaN(
        date.getTime()
      ) ||
      Date.now() -
        date.getTime() >
        20000
    ) {
      return;
    }


    const previousLogs =
      logs.slice(
        0,
        -1
      );


    /*
      Let v6.4 finish saving first.
      Then our screen appears above it.
    */

    setTimeout(
      () => {

        showCompleteScreen(
          latest,
          previousLogs
        );

      },
      180
    );
  }


  /* =========================================
     WATCH
     ========================================= */

  function watch() {

    window.addEventListener(
      "mana:strength-synced",
      detectNewWorkout
    );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    injectStyles();

    ensureScreen();


    /*
      Store the existing latest workout.
      We only want future completions
      to trigger the screen.
    */

    const logs =
      loadLogs();


    if (
      logs.length
    ) {

      lastKnownLogId =
        String(
          logs[
            logs.length -
            1
          ]?.id ||
          ""
        );

    }


    watch();
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
