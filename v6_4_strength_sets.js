/* =========================================
   MANA MOVEMENT TRAINING v6.4
   SMART STRENGTH WORKOUT LOGGER

   GOAL BASED REPS
   PREVIOUS WORKOUT PREFILL
   SMART LOAD PROGRESSION
   SETS • REPS • LOAD • TIMER • PROGRESS
   ========================================= */

(() => {
  "use strict";


  const STYLE_ID =
    "mana-strength-v64-style";

  const SCREEN_ID =
    "manaStrengthV64Workout";

  const PROGRAM_KEY =
    "mana-strength-v62-program";

  const OLD_LOG_KEY =
    "mana-strength-v63-logs";

  const LOG_KEY =
    "mana-strength-v64-logs";


  let activeDayIndex =
    null;

  let workoutStartedAt =
    null;

  let workoutTimerId =
    null;


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


  function saveLogs(
    logs
  ) {
    localStorage.setItem(
      LOG_KEY,
      JSON.stringify(
        logs
      )
    );
  }


  function roundLoad(
    value
  ) {
    return (
      Math.round(
        Number(
          value || 0
        ) * 2
      ) / 2
    );
  }


  function median(
    numbers
  ) {
    const list =
      numbers
        .map(Number)
        .filter(
          n =>
            Number.isFinite(
              n
            )
        )
        .sort(
          (a, b) =>
            a - b
        );


    if (!list.length) {
      return 0;
    }


    const middle =
      Math.floor(
        list.length / 2
      );


    if (
      list.length % 2
    ) {
      return list[
        middle
      ];
    }


    return (
      list[
        middle - 1
      ] +
      list[
        middle
      ]
    ) / 2;
  }


  /* =========================================
     TARGET PARSING
     ========================================= */

  function parseSetCount(
    target
  ) {
    const text =
      String(
        target || ""
      );


    const match =
      text.match(
        /(\d+)\s*[×x]/i
      ) ||
      text.match(
        /(\d+)\s*sets?/i
      );


    return match
      ? Math.max(
          1,
          Number(
            match[1]
          )
        )
      : 3;
  }


  function parseRepRange(
    target,
    goal
  ) {
    const text =
      String(
        target || ""
      );


    const range =
      text.match(
        /[×x]\s*(\d+)\s*[–-]\s*(\d+)/
      );


    if (range) {
      return {
        min:
          Number(
            range[1]
          ),

        max:
          Number(
            range[2]
          )
      };
    }


    const single =
      text.match(
        /[×x]\s*(\d+)/
      );


    if (single) {
      const reps =
        Number(
          single[1]
        );


      return {
        min:
          reps,

        max:
          reps
      };
    }


    if (
      goal ===
      "Get stronger"
    ) {
      return {
        min:6,
        max:8
      };
    }


    if (
      goal ===
      "Build muscle"
    ) {
      return {
        min:10,
        max:12
      };
    }


    if (
      goal ===
      "Return to training"
    ) {
      return {
        min:8,
        max:10
      };
    }


    return {
      min:8,
      max:12
    };
  }


  function defaultReps(
    target,
    goal
  ) {
    return parseRepRange(
      target,
      goal
    ).max;
  }


  /* =========================================
     PREVIOUS TRAINING
     ========================================= */

  function latestExercise(
    name
  ) {
    const logs =
      loadLogs();


    for (
      let i =
        logs.length - 1;
      i >= 0;
      i--
    ) {

      const exercise =
        (
          logs[i]
            .exercises ||
          []
        ).find(
          item =>
            item.name ===
            name
        );


      if (exercise) {
        return exercise;
      }
    }


    /*
      Older logger fallback.
    */

    const oldLogs =
      safeJson(
        localStorage.getItem(
          OLD_LOG_KEY
        ) || "[]",
        []
      );


    for (
      let i =
        oldLogs.length - 1;
      i >= 0;
      i--
    ) {

      const old =
        (
          oldLogs[i]
            .exercises ||
          []
        ).find(
          item =>
            item.name ===
            name
        );


      if (old) {

        return {

          name,

          sets:[
            {
              weight:
                Number(
                  old.weight ||
                  0
                ),

              reps:
                Number(
                  old.reps ||
                  0
                ),

              done:
                Boolean(
                  old.done
                )
            }
          ]

        };
      }
    }


    return null;
  }


  /* =========================================
     SMART PROGRESSION
     ========================================= */

  function completedPreviousSets(
    previous
  ) {
    if (
      !previous ||
      !Array.isArray(
        previous.sets
      )
    ) {
      return [];
    }


    const completed =
      previous.sets.filter(
        set =>
          set.done &&
          Number(
            set.reps
          ) > 0
      );


    /*
      Older data may not have
      reliable done flags.
    */

    if (completed.length) {
      return completed;
    }


    return previous.sets
      .filter(
        set =>
          Number(
            set.reps
          ) > 0 ||
          Number(
            set.weight
          ) > 0
      );
  }


  function previousLoad(
    previous
  ) {
    const sets =
      completedPreviousSets(
        previous
      );


    const weights =
      sets
        .map(
          set =>
            Number(
              set.weight ||
              0
            )
        )
        .filter(
          weight =>
            weight > 0
        );


    if (!weights.length) {
      return 0;
    }


    return roundLoad(
      median(
        weights
      )
    );
  }


  function progressionAdvice(
    previous,
    target,
    goal
  ) {
    const range =
      parseRepRange(
        target,
        goal
      );


    const sets =
      completedPreviousSets(
        previous
      );


    if (!sets.length) {

      return {
        type:
          "first",

        weight:
          0,

        text:
          `Suggested today: ${range.min}–${range.max} reps`
      };
    }


    const reps =
      sets
        .map(
          set =>
            Number(
              set.reps ||
              0
            )
        )
        .filter(
          value =>
            value > 0
        );


    const load =
      previousLoad(
        previous
      );


    if (!reps.length) {

      return {
        type:
          "hold",

        weight:
          load,

        text:
          `Suggested today: ${range.min}–${range.max} reps`
      };
    }


    const allAtTop =
      reps.every(
        rep =>
          rep >=
          range.max
      );


    const anyBelowRange =
      reps.some(
        rep =>
          rep <
          range.min
      );


    /*
      No external load recorded —
      useful for bodyweight exercises.
    */

    if (!load) {

      if (allAtTop) {
        return {
          type:
            "progress",

          weight:
            0,

          text:
            `Suggested today: ${range.min}–${range.max} reps • ready to progress the exercise`
        };
      }


      if (anyBelowRange) {
        return {
          type:
            "build",

          weight:
            0,

          text:
            `Suggested today: aim to reach ${range.min}–${range.max} reps`
        };
      }


      return {
        type:
          "hold",

        weight:
          0,

        text:
          `Suggested today: repeat ${range.min}–${range.max} reps`
      };
    }


    /*
      Double progression:
      once every completed set reaches
      the top of the range, add 2.5 kg.
    */

    if (allAtTop) {

      const suggested =
        roundLoad(
          load +
          2.5
        );


      return {
        type:
          "progress",

        weight:
          suggested,

        text:
          `Suggested today: ${suggested} kg • ${range.min}–${range.max} reps`
      };
    }


    /*
      Below the prescribed rep range:
      don't force a heavier load.
    */

    if (anyBelowRange) {

      return {
        type:
          "build",

        weight:
          load,

        text:
          `Suggested today: ${load} kg • build back to ${range.min}–${range.max} reps`
      };
    }


    /*
      Inside the range:
      repeat the same load and aim
      toward the top of the range.
    */

    return {
      type:
        "hold",

      weight:
        load,

      text:
        `Suggested today: ${load} kg • aim for ${range.max} reps`
    };
  }


  /* =========================================
     PREVIOUS TEXT
     ========================================= */

  function previousText(
    previous
  ) {
    if (
      !previous ||
      !Array.isArray(
        previous.sets
      ) ||
      !previous.sets.length
    ) {

      return (
        "First session — goal-based reps loaded"
      );
    }


    const used =
      previous.sets.filter(
        set =>
          Number(
            set.weight
          ) ||
          Number(
            set.reps
          )
      );


    if (!used.length) {
      return (
        "Previous session found"
      );
    }


    return (
      "Last workout: " +
      used
        .map(
          (
            set,
            index
          ) =>
            `S${index + 1} ` +
            `${
              Number(
                set.weight ||
                0
              )
            }kg × ` +
            `${
              Number(
                set.reps ||
                0
              )
            }`
        )
        .join(
          " • "
        )
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

      #${SCREEN_ID}{
        position:fixed;
        inset:0;
        z-index:26000;
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
            110px +
            env(
              safe-area-inset-bottom
            )
          );
      }


      #${SCREEN_ID}.open{
        display:block;
      }


      .mana-v64-shell{
        width:min(
          540px,
          100%
        );

        margin:auto;
      }


      .mana-v64-head{
        display:flex;
        justify-content:space-between;
        align-items:flex-start;
        gap:16px;
        margin-bottom:18px;
      }


      .mana-v64-head h1{
        margin:6px 0 4px;
        font-size:30px;
      }


      .mana-v64-close{
        width:44px;
        height:44px;
        flex:0 0 44px;
        border-radius:50%;
        border:1px solid #333;
        background:#111;
        color:#fff;
        font-size:24px;
      }


      .mana-v64-summary{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:10px;
        margin:14px 0;
      }


      .mana-v64-stat{
        background:#0d0d0d;
        border:1px solid #292929;
        border-radius:16px;
        padding:14px;
      }


      .mana-v64-stat span{
        display:block;
        color:#999;
        font-size:11px;
        text-transform:uppercase;
        letter-spacing:.05em;
        margin-bottom:5px;
      }


      .mana-v64-stat strong{
        display:block;
        color:#f3d875;
        font-size:22px;
        font-weight:900;
      }


      .mana-v64-progress{
        height:10px;
        margin:0 0 18px;
        border-radius:999px;
        background:#1a1a1a;
        overflow:hidden;
      }


      .mana-v64-progress-fill{
        width:0%;
        height:100%;
        border-radius:999px;
        background:#f3d875;
        transition:width .25s ease;
      }


      .mana-v64-card{
        background:#0e0e0e;
        border:1px solid #292929;
        border-radius:20px;
        padding:16px;
        margin:12px 0;
      }


      .mana-v64-name{
        font-size:19px;
        font-weight:900;
      }


      .mana-v64-target{
        color:#aaa;
        font-size:13px;
        margin-top:4px;
      }


      .mana-v64-previous{
        color:#aaa;
        font-size:12px;
        margin-top:7px;
        line-height:1.45;
      }


      .mana-v64-suggestion{
        margin-top:9px;
        padding:10px 12px;

        border:
          1px solid
          #4a3d12;

        border-radius:12px;

        background:
          linear-gradient(
            145deg,
            #18150d,
            #0b0b0b
          );

        color:#f3d875;

        font-size:13px;
        font-weight:800;
        line-height:1.4;
      }


      .mana-v64-suggestion::before{
        content:"↗ ";
      }


      .mana-v64-table-head,
      .mana-v64-set{
        display:grid;

        grid-template-columns:
          38px
          1fr
          1fr
          42px;

        gap:8px;

        align-items:center;
      }


      .mana-v64-table-head{
        margin-top:14px;
        color:#888;
        font-size:11px;
        text-transform:uppercase;
      }


      .mana-v64-set{
        margin-top:8px;
      }


      .mana-v64-set-number{
        color:#aaa;
        font-size:13px;
        text-align:center;
      }


      .mana-v64-set input{
        width:100%;
        margin:0 !important;
        padding:12px 10px !important;
        border-radius:12px !important;
        text-align:center;
      }


      .mana-v64-check{
        width:40px;
        height:40px;
        border-radius:12px;
        border:1px solid #3b3b3b;
        background:#111;
        color:#999;
        font-size:18px;
        font-weight:900;
      }


      .mana-v64-check.done{
        background:#f3d875;
        border-color:#f3d875;
        color:#111;
      }


      .mana-v64-controls{
        display:flex;
        gap:8px;
        margin-top:12px;
      }


      .mana-v64-small{
        flex:1;
        min-height:42px;
        border-radius:12px;
        border:1px solid #333;
        background:#111;
        color:#ddd;
        font-weight:800;
      }


      .mana-v64-complete{
        width:100%;
        min-height:60px;
        margin-top:18px;
        border:0;
        border-radius:17px;
        background:#f3d875;
        color:#111;
        font-size:17px;
        font-weight:900;
      }


      .mana-v64-status{
        min-height:24px;
        margin-top:10px;
        color:#aaa;
        font-size:13px;
        text-align:center;
      }


      @media(max-width:380px){

        .mana-v64-table-head,
        .mana-v64-set{
          grid-template-columns:
            32px
            1fr
            1fr
            40px;

          gap:6px;
        }

      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* =========================================
     BUILD SCREEN
     ========================================= */

  function ensureScreen() {
    if (
      document.getElementById(
        SCREEN_ID
      )
    ) return;


    const screen =
      document.createElement(
        "div"
      );


    screen.id =
      SCREEN_ID;


    screen.innerHTML = `

      <div class="mana-v64-shell">

        <div class="mana-v64-head">

          <div>

            <span class="pill">
              MANA STRENGTH
            </span>

            <h1 id="manaV64Title">
              Workout
            </h1>

            <div
              class="muted"
              id="manaV64Subtitle"
            ></div>

          </div>


          <button
            type="button"
            class="mana-v64-close"
            id="manaV64Close"
            aria-label="Close workout"
          >
            ×
          </button>

        </div>


        <div class="mana-v64-summary">

          <div class="mana-v64-stat">

            <span>
              Workout time
            </span>

            <strong id="manaV64Timer">
              00:00
            </strong>

          </div>


          <div class="mana-v64-stat">

            <span>
              Sets complete
            </span>

            <strong id="manaV64Sets">
              0 / 0
            </strong>

          </div>


          <div class="mana-v64-stat">

            <span>
              Total volume
            </span>

            <strong id="manaV64Volume">
              0 kg
            </strong>

          </div>


          <div class="mana-v64-stat">

            <span>
              Workout complete
            </span>

            <strong id="manaV64Percent">
              0%
            </strong>

          </div>

        </div>


        <div class="mana-v64-progress">

          <div
            class="mana-v64-progress-fill"
            id="manaV64ProgressFill"
          ></div>

        </div>


        <div id="manaV64Exercises"></div>


        <button
          type="button"
          class="mana-v64-complete"
          id="manaV64Complete"
        >
          Complete workout
        </button>


        <div
          id="manaV64Status"
          class="mana-v64-status"
        ></div>

      </div>

    `;


    document.body.appendChild(
      screen
    );


    document
      .getElementById(
        "manaV64Close"
      )
      .onclick =
        closeWorkout;


    document
      .getElementById(
        "manaV64Complete"
      )
      .onclick =
        completeWorkout;
  }


  /* =========================================
     TIMER
     ========================================= */

  function formatWorkoutTime(
    seconds
  ) {
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


  function getElapsedSeconds() {
    if (
      !workoutStartedAt
    ) {
      return 0;
    }


    return Math.max(
      0,

      Math.floor(
        (
          Date.now() -
          workoutStartedAt
        ) / 1000
      )
    );
  }


  function updateWorkoutTimer() {
    const timer =
      document.getElementById(
        "manaV64Timer"
      );


    if (!timer) return;


    timer.textContent =
      formatWorkoutTime(
        getElapsedSeconds()
      );
  }


  function startWorkoutTimer() {
    stopWorkoutTimer();


    workoutStartedAt =
      Date.now();


    updateWorkoutTimer();


    workoutTimerId =
      setInterval(
        updateWorkoutTimer,
        1000
      );
  }


  function stopWorkoutTimer() {
    if (
      workoutTimerId
    ) {

      clearInterval(
        workoutTimerId
      );


      workoutTimerId =
        null;
    }
  }


  /* =========================================
     SET ROW
     ========================================= */

  function createSetRow(
    number,
    previousSet,
    defaultRepCount
  ) {
    const previousWeight =
      Number(
        previousSet
          ?.weight ||
        0
      );


    const previousReps =
      Number(
        previousSet
          ?.reps ||
        0
      );


    const startingReps =
      previousReps ||
      defaultRepCount ||
      10;


    const row =
      document.createElement(
        "div"
      );


    row.className =
      "mana-v64-set";


    row.dataset.v64Set =
      "1";


    row.innerHTML = `

      <div class="mana-v64-set-number">
        ${number}
      </div>


      <input
        type="number"
        min="0"
        step="0.5"
        inputmode="decimal"

        placeholder="kg"

        value="${
          previousWeight ||
          ""
        }"

        data-v64-weight
        aria-label="Weight in kilograms"
      />


      <input
        type="number"
        min="0"
        step="1"
        inputmode="numeric"

        value="${startingReps}"

        data-v64-reps
        aria-label="Repetitions"
      />


      <button
        type="button"
        class="mana-v64-check"
        data-v64-check
        aria-label="Complete set"
      >
        ✓
      </button>

    `;


    row
      .querySelector(
        "[data-v64-check]"
      )
      .onclick =
        () => {

          row
            .querySelector(
              "[data-v64-check]"
            )
            ?.classList
            .toggle(
              "done"
            );


          updateSummary();
        };


    row
      .querySelectorAll(
        "input"
      )
      .forEach(
        input => {

          input.addEventListener(
            "input",
            updateSummary
          );

        }
      );


    return row;
  }


  /* =========================================
     SET MANAGEMENT
     ========================================= */

  function renumberSets(
    card
  ) {
    card
      .querySelectorAll(
        "[data-v64-set]"
      )
      .forEach(
        (
          row,
          index
        ) => {

          const number =
            row.querySelector(
              ".mana-v64-set-number"
            );


          if (number) {
            number.textContent =
              index + 1;
          }

        }
      );
  }


  /* =========================================
     EXERCISE CARD
     ========================================= */

  function buildExerciseCard(
    exercise,
    exerciseIndex,
    goal
  ) {
    const name =
      exercise[0];


    const target =
      exercise[1];


    const previous =
      latestExercise(
        name
      );


    const setCount =
      parseSetCount(
        target
      );


    const reps =
      defaultReps(
        target,
        goal
      );


    const advice =
      progressionAdvice(
        previous,
        target,
        goal
      );


    const card =
      document.createElement(
        "div"
      );


    card.className =
      "mana-v64-card";


    card.dataset.v64Exercise =
      exerciseIndex;


    card.dataset.exerciseName =
      name;


    card.dataset.exerciseTarget =
      target;


    card.innerHTML = `

      <div class="mana-v64-name">
        ${name}
      </div>


      <div class="mana-v64-target">
        Target:
        ${target}
      </div>


      <div class="mana-v64-previous">
        ${
          previousText(
            previous
          )
        }
      </div>


      <div class="mana-v64-suggestion">
        ${advice.text}
      </div>


      <div class="mana-v64-table-head">

        <span>Set</span>

        <span>Weight</span>

        <span>Reps</span>

        <span>Done</span>

      </div>


      <div
        data-v64-set-list
      ></div>


      <div class="mana-v64-controls">

        <button
          type="button"
          class="mana-v64-small"
          data-v64-add
        >
          + Add set
        </button>


        <button
          type="button"
          class="mana-v64-small"
          data-v64-remove
        >
          − Remove set
        </button>

      </div>

    `;


    const list =
      card.querySelector(
        "[data-v64-set-list]"
      );


    for (
      let i = 0;
      i < setCount;
      i++
    ) {

      list.appendChild(
        createSetRow(

          i + 1,

          previous
            ?.sets
            ?.[i] ||
          null,

          reps
        )
      );
    }


    card
      .querySelector(
        "[data-v64-add]"
      )
      .onclick =
        () => {

          const count =
            list
              .querySelectorAll(
                "[data-v64-set]"
              )
              .length;


          list.appendChild(
            createSetRow(

              count + 1,

              previous
                ?.sets
                ?.[count] ||
              null,

              reps
            )
          );


          renumberSets(
            card
          );


          updateSummary();
        };


    card
      .querySelector(
        "[data-v64-remove]"
      )
      .onclick =
        () => {

          const rows =
            list
              .querySelectorAll(
                "[data-v64-set]"
              );


          if (
            rows.length <=
            1
          ) return;


          rows[
            rows.length - 1
          ].remove();


          renumberSets(
            card
          );


          updateSummary();
        };


    return card;
  }


  /* =========================================
     COLLECT WORKOUT
     ========================================= */

  function collectExercises() {
    return [
      ...document.querySelectorAll(
        "#manaV64Exercises .mana-v64-card"
      )
    ].map(
      card => {

        const sets =
          [
            ...card.querySelectorAll(
              "[data-v64-set]"
            )
          ].map(
            (
              row,
              index
            ) => ({

              set:
                index + 1,


              weight:
                Number(
                  row
                    .querySelector(
                      "[data-v64-weight]"
                    )
                    ?.value ||
                  0
                ),


              reps:
                Number(
                  row
                    .querySelector(
                      "[data-v64-reps]"
                    )
                    ?.value ||
                  0
                ),


              done:
                row
                  .querySelector(
                    "[data-v64-check]"
                  )
                  ?.classList
                  .contains(
                    "done"
                  ) ||
                false

            })
          );


        return {

          name:
            card.dataset
              .exerciseName,

          target:
            card.dataset
              .exerciseTarget,

          sets

        };

      }
    );
  }


  /* =========================================
     SUMMARY
     ========================================= */

  function updateSummary() {
    const exercises =
      collectExercises();


    let completeSets =
      0;

    let totalSets =
      0;

    let volume =
      0;


    exercises.forEach(
      exercise => {

        exercise.sets
          .forEach(
            set => {

              totalSets++;


              if (
                set.done
              ) {

                completeSets++;


                volume +=
                  Number(
                    set.weight ||
                    0
                  ) *
                  Number(
                    set.reps ||
                    0
                  );
              }

            }
          );

      }
    );


    const percent =
      totalSets
        ? Math.round(
            (
              completeSets /
              totalSets
            ) * 100
          )
        : 0;


    const sets =
      document.getElementById(
        "manaV64Sets"
      );


    const volumeEl =
      document.getElementById(
        "manaV64Volume"
      );


    const percentEl =
      document.getElementById(
        "manaV64Percent"
      );


    const fill =
      document.getElementById(
        "manaV64ProgressFill"
      );


    if (sets) {
      sets.textContent =
        `${completeSets} / ${totalSets}`;
    }


    if (volumeEl) {

      volumeEl.textContent =
        `${Math.round(
          volume
        ).toLocaleString()} kg`;

    }


    if (percentEl) {
      percentEl.textContent =
        `${percent}%`;
    }


    if (fill) {
      fill.style.width =
        `${percent}%`;
    }
  }


  /* =========================================
     OPEN WORKOUT
     ========================================= */

  function openWorkout(
    dayIndex
  ) {
    const program =
      loadProgram();


    if (
      !program
        ?.sessions
        ?.[dayIndex]
    ) return;


    ensureScreen();


    activeDayIndex =
      dayIndex;


    const session =
      program.sessions[
        dayIndex
      ];


    document
      .getElementById(
        "manaV64Title"
      )
      .textContent =
        session[0];


    document
      .getElementById(
        "manaV64Subtitle"
      )
      .textContent =
        `Day ${
          dayIndex + 1
        } • ${
          program.goal
        }`;


    const holder =
      document.getElementById(
        "manaV64Exercises"
      );


    holder.innerHTML =
      "";


    session[1]
      .forEach(
        (
          exercise,
          index
        ) => {

          holder.appendChild(
            buildExerciseCard(
              exercise,
              index,
              program.goal
            )
          );

        }
      );


    const status =
      document.getElementById(
        "manaV64Status"
      );


    if (status) {
      status.textContent =
        "";
    }


    updateSummary();


    startWorkoutTimer();


    document
      .getElementById(
        SCREEN_ID
      )
      .classList
      .add(
        "open"
      );


    document
      .getElementById(
        SCREEN_ID
      )
      .scrollTop =
        0;
  }


  /* =========================================
     RETURN TO STRENGTH OVERVIEW
     ========================================= */

  function returnToStrengthOverview() {
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
     CLOSE WORKOUT
     ========================================= */

  function closeWorkout() {
    document
      .getElementById(
        SCREEN_ID
      )
      ?.classList
      .remove(
        "open"
      );


    stopWorkoutTimer();


    workoutStartedAt =
      null;


    activeDayIndex =
      null;


    setTimeout(
      returnToStrengthOverview,
      50
    );
  }


  /* =========================================
     COMPLETE WORKOUT
     ========================================= */

  function completeWorkout() {
    const program =
      loadProgram();


    if (
      activeDayIndex ===
        null ||
      !program
        ?.sessions
        ?.[activeDayIndex]
    ) return;


    const exercises =
      collectExercises();


    const completedSets =
      exercises.reduce(
        (
          total,
          exercise
        ) =>
          total +
          exercise
            .sets
            .filter(
              set =>
                set.done
            )
            .length,
        0
      );


    const totalSets =
      exercises.reduce(
        (
          total,
          exercise
        ) =>
          total +
          exercise
            .sets
            .length,
        0
      );


    if (
      !completedSets
    ) {

      const status =
        document.getElementById(
          "manaV64Status"
        );


      if (status) {
        status.textContent =
          "Complete at least one set first.";
      }


      return;
    }


    const session =
      program.sessions[
        activeDayIndex
      ];


    const totalVolume =
      exercises.reduce(
        (
          workoutTotal,
          exercise
        ) =>
          workoutTotal +
          exercise
            .sets
            .reduce(
              (
                exerciseTotal,
                set
              ) =>
                exerciseTotal +
                (
                  set.done
                    ? Number(
                        set.weight ||
                        0
                      ) *
                      Number(
                        set.reps ||
                        0
                      )
                    : 0
                ),
              0
            ),
        0
      );


    const durationSeconds =
      getElapsedSeconds();


    const completionPercent =
      totalSets
        ? Math.round(
            (
              completedSets /
              totalSets
            ) * 100
          )
        : 0;


    const logs =
      loadLogs();


    logs.push({

      id:
        Date.now()
          .toString(),


      date:
        new Date()
          .toISOString(),


      dayIndex:
        activeDayIndex,


      sessionName:
        session[0],


      goal:
        program.goal,


      equipment:
        program.equipment,


      completedSets,


      totalSets,


      completionPercent,


      totalVolume,


      durationSeconds,


      durationMinutes:
        Math.round(
          durationSeconds /
          60
        ),


      exercises

    });


    saveLogs(
      logs
    );


    window.dispatchEvent(
      new CustomEvent(
        "mana:strength-synced"
      )
    );


    stopWorkoutTimer();


    const status =
      document.getElementById(
        "manaV64Status"
      );


    if (status) {

      status.textContent =
        `Workout saved ✓ • ` +
        `${completedSets}/${totalSets} sets • ` +
        `${completionPercent}% • ` +
        `${formatWorkoutTime(
          durationSeconds
        )}`;
    }


    setTimeout(
      closeWorkout,
      1100
    );
  }


  /* =========================================
     EXISTING START BUTTONS
     ========================================= */

  function interceptStartButtons() {
    document.addEventListener(
      "click",

      event => {

        const button =
          event.target.closest(
            ".mana-v63-start"
          );


        if (!button) {
          return;
        }


        const day =
          button.closest(
            ".mana-strength-day"
          );


        const program =
          document.getElementById(
            "manaStrengthProgram"
          );


        if (
          !day ||
          !program
        ) return;


        const days =
          [
            ...program.querySelectorAll(
              ".mana-strength-day"
            )
          ];


        const dayIndex =
          days.indexOf(
            day
          );


        if (
          dayIndex <
          0
        ) return;


        event.preventDefault();

        event.stopPropagation();

        event
          .stopImmediatePropagation();


        openWorkout(
          dayIndex
        );

      },

      true
    );
  }


  /* =========================================
     INIT
     ========================================= */

  window.openManaStrengthWorkout =
    openWorkout;


  function init() {
    injectStyles();

    ensureScreen();

    interceptStartButtons();
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
