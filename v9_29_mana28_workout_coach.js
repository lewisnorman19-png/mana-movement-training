/* MANA MOVEMENT TRAINING v9.29.1 — STABLE MANA 28 WORKOUT COACH */
(() => {
  "use strict";

  const BUILD =
    "92910";

  const STATE_KEY =
    "mana28-v927-state";

  const MODAL_ID =
    "manaV929Coach";

  const STYLE_ID =
    "mana-v929-coach-style";

  let activeIndex =
    0;

  let workoutStartedAt =
    null;

  let workoutTimer =
    null;

  let restTimer =
    null;

  let restRemaining =
    0;

  let sessionExercises =
    [];

  let previousBodyOverflow =
    "";

  const COACH = [
    [
      /goblet squat/i,
      "60–90 sec",
      "Dumbbell or kettlebell",
      "Keep the weight close to your chest, brace first, sit between the hips and drive through the whole foot.",
      "Leg press or box squat"
    ],
    [
      /leg press/i,
      "75–90 sec",
      "Leg press",
      "Keep your whole foot planted, control the lowering phase and stop before your hips roll under.",
      "Goblet squat or supported squat"
    ],
    [
      /db bench|dumbbell bench/i,
      "75–90 sec",
      "Bench + dumbbells",
      "Set the shoulder blades, keep wrists stacked and lower with control before pressing smoothly.",
      "Machine chest press or incline push-up"
    ],
    [
      /machine press/i,
      "60–90 sec",
      "Chest press machine",
      "Keep your upper back supported, control the handles back and press without shrugging.",
      "Dumbbell bench press"
    ],
    [
      /shoulder press/i,
      "60–90 sec",
      "Dumbbells or machine",
      "Brace the trunk, keep elbows slightly forward and press without leaning back.",
      "Machine shoulder press or landmine press"
    ],
    [
      /seated row|cable row|machine row/i,
      "60–90 sec",
      "Cable or row machine",
      "Lead with the elbows, keep the ribs down and finish by squeezing the shoulder blades without jerking.",
      "Chest-supported dumbbell row"
    ],
    [
      /lat pulldown/i,
      "60–90 sec",
      "Lat pulldown",
      "Pull the elbows down toward your ribs while keeping the chest tall and shoulders away from your ears.",
      "Assisted pull-up or high cable row"
    ],
    [
      /romanian deadlift/i,
      "75–120 sec",
      "Dumbbells or barbell",
      "Soften the knees, push the hips back and keep the weight close while maintaining a long neutral spine.",
      "Cable pull-through or hip hinge with dumbbells"
    ],
    [
      /split squat/i,
      "60–90 sec",
      "Bodyweight or dumbbells",
      "Stay tall, keep the front foot planted and lower under control using support if needed.",
      "Step-up or supported reverse lunge"
    ],
    [
      /hamstring curl/i,
      "45–75 sec",
      "Hamstring curl machine",
      "Keep the hips still, curl smoothly and control the return instead of letting the weight drop.",
      "Swiss-ball curl or slider curl"
    ],
    [
      /calf raise/i,
      "45–60 sec",
      "Machine, step or dumbbells",
      "Use a full range, pause at the top and control the heel down.",
      "Bodyweight calf raise"
    ],
    [
      /biceps curl/i,
      "45–60 sec",
      "Dumbbells or cable",
      "Keep the elbows quiet, curl without swinging and lower slowly.",
      "Cable curl or hammer curl"
    ],
    [
      /triceps pressdown/i,
      "45–60 sec",
      "Cable",
      "Pin the elbows by your sides and straighten the arms without rolling the shoulders forward.",
      "Overhead cable extension"
    ],
    [
      /plank/i,
      "45–60 sec",
      "Mat",
      "Brace as if preparing for a punch, squeeze glutes and keep the body in one straight line.",
      "Elevated plank or dead bug"
    ],
    [
      /dead bug/i,
      "30–45 sec",
      "Mat",
      "Keep the lower back gently connected to the floor and move only as far as you can control.",
      "Heel taps"
    ],
    [
      /bird dog/i,
      "30–45 sec",
      "Mat",
      "Keep the hips square and reach long rather than lifting the arm and leg high.",
      "Dead bug"
    ],
    [
      /side plank/i,
      "30–45 sec",
      "Mat",
      "Stack the shoulders and hips, press the floor away and keep the body long.",
      "Bent-knee side plank"
    ],
    [
      /farmer carry/i,
      "45–60 sec",
      "Dumbbells or kettlebells",
      "Stand tall, brace the trunk and walk with controlled steps without leaning.",
      "Suitcase carry"
    ],
    [
      /bike|rower|incline walk|easy walk|purposeful walk|easy cardio/i,
      "As needed",
      "Cardio machine or walking route",
      "Keep the effort controlled enough that you could speak in short sentences.",
      "Any low-impact cardio you can do comfortably"
    ],
    [
      /mobility|stretch/i,
      "Move continuously",
      "Mat",
      "Move slowly, stay out of painful ranges and breathe through each position.",
      "Use a comfortable mobility movement for the same area"
    ],
    [
      /breathing/i,
      "Continuous",
      "Quiet space",
      "Breathe slowly through the nose, relax the shoulders and lengthen the exhale.",
      "Easy lying or seated breathing"
    ]
  ];

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

  function loadState() {
    const state =
      safeJson(
        localStorage.getItem(
          STATE_KEY
        ) || "{}",
        {}
      );

    if (
      !state.workouts ||
      typeof state.workouts !==
        "object"
    ) {
      state.workouts =
        {};
    }

    return state;
  }

  function saveState(
    state
  ) {
    localStorage.setItem(
      STATE_KEY,
      JSON.stringify(
        state
      )
    );

    window.dispatchEvent(
      new CustomEvent(
        "mana28:updated"
      )
    );
  }

  function currentDay() {
    const state =
      loadState();

    return Math.max(
      1,
      Math.min(
        28,
        Number(
          state.selectedDay ||
          state.currentDay ||
          1
        )
      )
    );
  }

  function readExercises() {
    return [
      ...document.querySelectorAll(
        "#manaV928Workout [data-m928-ex]"
      )
    ].map(
      button => ({
        name:
          button
            .querySelector(
              ".m928-name"
            )
            ?.textContent
            ?.trim() ||
          "Exercise",

        dose:
          button
            .querySelector(
              ".m928-dose"
            )
            ?.textContent
            ?.trim() ||
          ""
      })
    );
  }

  function workoutName() {
    return (
      document
        .querySelector(
          "#manaV928Workout .m928-title"
        )
        ?.textContent
        ?.trim() ||
      "MANA 28 Workout"
    );
  }

  function currentWorkout(
    day
  ) {
    const state =
      loadState();

    const stored =
      state.workouts[
        String(
          day
        )
      ] || {};

    const checks =
      Array.isArray(
        stored.checks
      )
        ? stored.checks.slice()
        : [];

    while (
      checks.length <
      sessionExercises.length
    ) {
      checks.push(
        false
      );
    }

    return {
      startedAt:
        stored.startedAt ||
        null,

      completedAt:
        stored.completedAt ||
        null,

      checks
    };
  }

  function saveWorkout(
    day,
    workout
  ) {
    const state =
      loadState();

    state.workouts[
      String(
        day
      )
    ] =
      workout;

    saveState(
      state
    );
  }

  function coachFor(
    name
  ) {
    const found =
      COACH.find(
        item =>
          item[
            0
          ].test(
            name
          )
      );

    if (
      !found
    ) {
      return {
        rest:
          "60–90 sec",

        equipment:
          "Use the equipment shown in your program",

        cue:
          "Use controlled technique, stay within a comfortable range and stop the set if your form breaks down.",

        substitute:
          "Choose a similar movement pattern that you can perform safely"
      };
    }

    return {
      rest:
        found[
          1
        ],

      equipment:
        found[
          2
        ],

      cue:
        found[
          3
        ],

      substitute:
        found[
          4
        ]
    };
  }

  function formatTime(
    totalSeconds
  ) {
    const seconds =
      Math.max(
        0,
        Math.floor(
          Number(
            totalSeconds ||
            0
          )
        )
      );

    const minutes =
      Math.floor(
        seconds /
        60
      );

    const remaining =
      seconds %
      60;

    return (
      String(
        minutes
      ).padStart(
        2,
        "0"
      ) +
      ":" +
      String(
        remaining
      ).padStart(
        2,
        "0"
      )
    );
  }

  function elapsedWorkoutSeconds() {
    if (
      !workoutStartedAt
    ) {
      return 0;
    }

    return Math.max(
      0,
      Math.round(
        (
          Date.now() -
          workoutStartedAt
        ) /
        1000
      )
    );
  }

  function injectStyles() {
    document
      .getElementById(
        STYLE_ID
      )
      ?.remove();

    const style =
      document.createElement(
        "style"
      );

    style.id =
      STYLE_ID;

    style.textContent = `
      #${MODAL_ID}{
        position:fixed;
        inset:0;
        z-index:40000;
        display:none;
        overflow:auto;
        overscroll-behavior:contain;
        background:#050505;
        color:#fff;
        padding:
          calc(env(safe-area-inset-top) + 14px)
          14px
          calc(env(safe-area-inset-bottom) + 28px);
        touch-action:pan-y;
      }

      #${MODAL_ID}.open{
        display:block;
      }

      .m929-shell{
        width:min(
          560px,
          100%
        );
        margin:0 auto;
      }

      .m929-top{
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:12px;
        margin-bottom:14px;
      }

      .m929-brand{
        color:#f3d875;
        font-size:11px;
        font-weight:900;
        letter-spacing:.14em;
      }

      .m929-close,
      .m929-complete-btn,
      .m929-nav button,
      .m929-rest-btn,
      .m929-finish{
        touch-action:manipulation;
        -webkit-tap-highlight-color:
          transparent;
      }

      .m929-close{
        min-height:44px;
        padding:0 14px;
        border:1px solid #333;
        border-radius:13px;
        background:#111;
        color:#f3d875;
        font-size:11px;
        font-weight:900;
        cursor:pointer;
      }

      .m929-head{
        padding:18px;
        border:1px solid #55491d;
        border-radius:19px;
        background:linear-gradient(
          145deg,
          #171308,
          #090909
        );
      }

      .m929-row{
        display:flex;
        justify-content:space-between;
        gap:12px;
        align-items:flex-start;
      }

      .m929-kicker{
        color:#f3d875;
        font-size:10px;
        font-weight:900;
        letter-spacing:.12em;
      }

      .m929-head h2{
        margin:5px 0 0;
        font-size:24px;
        line-height:1.08;
      }

      .m929-timer{
        flex:0 0 auto;
        min-width:74px;
        padding:9px 10px;
        border:1px solid #4e421b;
        border-radius:12px;
        background:#0d0c08;
        color:#f3d875;
        text-align:center;
        font-size:16px;
        font-weight:1000;
      }

      .m929-progress-copy{
        display:flex;
        justify-content:space-between;
        gap:10px;
        margin-top:14px;
        color:#9a9a9a;
        font-size:10px;
        font-weight:800;
      }

      .m929-track{
        height:9px;
        margin-top:8px;
        overflow:hidden;
        border-radius:999px;
        background:#272727;
      }

      .m929-fill{
        height:100%;
        border-radius:999px;
        background:#f3d875;
      }

      .m929-card{
        margin-top:12px;
        padding:18px;
        border:1px solid #303030;
        border-radius:18px;
        background:linear-gradient(
          145deg,
          #111,
          #090909
        );
      }

      .m929-ex-index{
        color:#8c8c8c;
        font-size:10px;
        font-weight:900;
      }

      .m929-ex-name{
        margin-top:5px;
        color:#fff;
        font-size:25px;
        font-weight:1000;
        line-height:1.1;
      }

      .m929-dose{
        margin-top:8px;
        color:#f3d875;
        font-size:18px;
        font-weight:1000;
      }

      .m929-info-grid{
        display:grid;
        grid-template-columns:
          1fr
          1fr;
        gap:9px;
        margin-top:15px;
      }

      .m929-info{
        padding:12px;
        border:1px solid #292929;
        border-radius:13px;
        background:#0b0b0b;
      }

      .m929-info span{
        display:block;
        color:#7f7f7f;
        font-size:9px;
        font-weight:900;
        letter-spacing:.08em;
      }

      .m929-info strong{
        display:block;
        margin-top:5px;
        color:#fff;
        font-size:12px;
        line-height:1.4;
      }

      .m929-coach{
        margin-top:14px;
        padding:14px;
        border-left:3px solid #f3d875;
        border-radius:
          0
          12px
          12px
          0;
        background:#100f09;
      }

      .m929-coach span{
        display:block;
        color:#f3d875;
        font-size:9px;
        font-weight:900;
        letter-spacing:.1em;
      }

      .m929-coach p{
        margin:6px 0 0;
        color:#c4c4c4;
        font-size:12px;
        line-height:1.6;
      }

      .m929-complete-btn{
        width:100%;
        min-height:54px;
        margin-top:15px;
        border:0;
        border-radius:14px;
        background:#f3d875;
        color:#111;
        font-size:12px;
        font-weight:1000;
        cursor:pointer;
      }

      .m929-complete-btn.done{
        border:1px solid #5f5120;
        background:#151207;
        color:#f3d875;
      }

      .m929-nav{
        display:grid;
        grid-template-columns:
          1fr
          1fr;
        gap:9px;
        margin-top:10px;
      }

      .m929-nav button,
      .m929-rest-btn{
        min-height:48px;
        border:1px solid #343434;
        border-radius:13px;
        background:#101010;
        color:#ddd;
        font-size:11px;
        font-weight:900;
        cursor:pointer;
      }

      .m929-nav button:disabled{
        opacity:.35;
        cursor:not-allowed;
      }

      .m929-rest{
        margin-top:12px;
        padding:15px;
        border:1px solid #2d2d2d;
        border-radius:16px;
        background:#0b0b0b;
      }

      .m929-rest-title{
        color:#8b8b8b;
        font-size:9px;
        font-weight:900;
        letter-spacing:.1em;
      }

      .m929-rest-time{
        margin-top:4px;
        color:#f3d875;
        font-size:28px;
        font-weight:1000;
      }

      .m929-rest-buttons{
        display:grid;
        grid-template-columns:
          repeat(
            3,
            1fr
          );
        gap:8px;
        margin-top:10px;
      }

      .m929-finish{
        width:100%;
        min-height:54px;
        margin-top:13px;
        border:1px solid #67571f;
        border-radius:14px;
        background:#181407;
        color:#f3d875;
        font-size:12px;
        font-weight:1000;
        cursor:pointer;
      }

      .m929-finish:disabled{
        opacity:.4;
        cursor:not-allowed;
      }

      .m929-status{
        margin-top:10px;
        color:#999;
        font-size:10px;
        line-height:1.5;
        text-align:center;
      }

      @media(max-width:390px){
        .m929-info-grid{
          grid-template-columns:
            1fr;
        }

        .m929-ex-name{
          font-size:22px;
        }
      }
    `;

    document.head
      .appendChild(
        style
      );
  }

  function ensureModal() {
    if (
      document.getElementById(
        MODAL_ID
      )
    ) {
      return;
    }

    const modal =
      document.createElement(
        "div"
      );

    modal.id =
      MODAL_ID;

    modal.innerHTML = `
      <div class="m929-shell">
        <div class="m929-top">
          <div class="m929-brand">
            MANA 28 • WORKOUT COACH
          </div>

          <button
            type="button"
            class="m929-close"
            id="m929Close"
          >
            ← Back
          </button>
        </div>

        <div
          id="m929Content"
        ></div>
      </div>
    `;

    document.body
      .appendChild(
        modal
      );
  }

  function openCoach(
    requestedIndex =
      null
  ) {
    sessionExercises =
      readExercises();

    if (
      !sessionExercises.length
    ) {
      return;
    }

    const day =
      currentDay();

    const workout =
      currentWorkout(
        day
      );

    const existingStart =
      workout.startedAt
        ? new Date(
            workout.startedAt
          ).getTime()
        : NaN;

    workoutStartedAt =
      Number.isFinite(
        existingStart
      )
        ? existingStart
        : Date.now();

    if (
      !workout.startedAt
    ) {
      workout.startedAt =
        new Date(
          workoutStartedAt
        ).toISOString();

      saveWorkout(
        day,
        workout
      );
    }

    if (
      Number.isFinite(
        Number(
          requestedIndex
        )
      )
    ) {
      activeIndex =
        Math.max(
          0,
          Math.min(
            sessionExercises.length -
              1,
            Number(
              requestedIndex
            )
          )
        );
    } else {
      const firstIncomplete =
        workout.checks
          .findIndex(
            value =>
              !value
          );

      activeIndex =
        firstIncomplete >= 0
          ? firstIncomplete
          : 0;
    }

    ensureModal();

    previousBodyOverflow =
      document.body.style
        .overflow;

    document
      .getElementById(
        MODAL_ID
      )
      ?.classList
      .add(
        "open"
      );

    document.body.style
      .overflow =
        "hidden";

    renderCoach();

    startWorkoutTimer();
  }

  function closeCoach() {
    document
      .getElementById(
        MODAL_ID
      )
      ?.classList
      .remove(
        "open"
      );

    document.body.style
      .overflow =
        previousBodyOverflow ||
        "";

    stopRestTimer();

    stopWorkoutTimer();

    setTimeout(
      () => {

        window
          .refreshMana28Workout
          ?.();

      },
      40
    );
  }

  function renderCoach() {
    const holder =
      document.getElementById(
        "m929Content"
      );

    if (
      !holder ||
      !sessionExercises.length
    ) {
      return;
    }

    const day =
      currentDay();

    const workout =
      currentWorkout(
        day
      );

    const exercise =
      sessionExercises[
        activeIndex
      ];

    const coach =
      coachFor(
        exercise.name
      );

    const completed =
      workout.checks
        .filter(
          Boolean
        )
        .length;

    const percent =
      Math.round(
        completed /
        sessionExercises.length *
        100
      );

    const allDone =
      completed ===
      sessionExercises.length;

    holder.innerHTML = `
      <div class="m929-head">
        <div class="m929-row">
          <div>
            <div class="m929-kicker">
              DAY ${day} WORKOUT
            </div>

            <h2>
              ${workoutName()}
            </h2>
          </div>

          <div
            class="m929-timer"
            id="m929WorkoutTimer"
          >
            ${formatTime(
              elapsedWorkoutSeconds()
            )}
          </div>
        </div>

        <div class="m929-progress-copy">
          <span>
            ${completed}/${sessionExercises.length}
            complete
          </span>

          <span>
            ${percent}%
          </span>
        </div>

        <div class="m929-track">
          <div
            class="m929-fill"
            style="width:${percent}%"
          ></div>
        </div>
      </div>

      <div class="m929-card">
        <div class="m929-ex-index">
          EXERCISE ${activeIndex + 1}
          OF ${sessionExercises.length}
        </div>

        <div class="m929-ex-name">
          ${exercise.name}
        </div>

        <div class="m929-dose">
          ${exercise.dose}
        </div>

        <div class="m929-info-grid">
          <div class="m929-info">
            <span>REST</span>

            <strong>
              ${coach.rest}
            </strong>
          </div>

          <div class="m929-info">
            <span>EQUIPMENT</span>

            <strong>
              ${coach.equipment}
            </strong>
          </div>
        </div>

        <div class="m929-coach">
          <span>
            COACHING CUE
          </span>

          <p>
            ${coach.cue}
          </p>
        </div>

        <div class="m929-coach">
          <span>
            SUBSTITUTION
          </span>

          <p>
            ${coach.substitute}
          </p>
        </div>

        <button
          type="button"
          class="
            m929-complete-btn
            ${
              workout.checks[
                activeIndex
              ]
                ? "done"
                : ""
            }
          "
          id="m929CompleteExercise"
        >
          ${
            workout.checks[
              activeIndex
            ]
              ? "EXERCISE COMPLETE ✓"
              : "MARK EXERCISE COMPLETE"
          }
        </button>

        <div class="m929-nav">
          <button
            type="button"
            id="m929Prev"
            ${
              activeIndex ===
              0
                ? "disabled"
                : ""
            }
          >
            ← PREVIOUS
          </button>

          <button
            type="button"
            id="m929Next"
            ${
              activeIndex ===
              sessionExercises.length -
              1
                ? "disabled"
                : ""
            }
          >
            NEXT →
          </button>
        </div>
      </div>

      <div class="m929-rest">
        <div class="m929-rest-title">
          REST TIMER
        </div>

        <div
          class="m929-rest-time"
          id="m929RestTime"
        >
          ${formatTime(
            restRemaining
          )}
        </div>

        <div class="m929-rest-buttons">
          <button
            type="button"
            class="m929-rest-btn"
            data-m929-rest="60"
          >
            60 SEC
          </button>

          <button
            type="button"
            class="m929-rest-btn"
            data-m929-rest="90"
          >
            90 SEC
          </button>

          <button
            type="button"
            class="m929-rest-btn"
            data-m929-rest="120"
          >
            120 SEC
          </button>
        </div>
      </div>

      <button
        type="button"
        class="m929-finish"
        id="m929Finish"
        ${
          !allDone
            ? "disabled"
            : ""
        }
      >
        ${
          allDone
            ? "FINISH WORKOUT ✓"
            : "COMPLETE ALL EXERCISES TO FINISH"
        }
      </button>

      <div class="m929-status">
        Work at a level appropriate for you.
        Stop if an exercise causes sharp or unusual pain.
      </div>
    `;
  }

  function toggleExercise() {
    const day =
      currentDay();

    const workout =
      currentWorkout(
        day
      );

    workout.checks[
      activeIndex
    ] =
      !workout.checks[
        activeIndex
      ];

    saveWorkout(
      day,
      workout
    );

    if (
      workout.checks[
        activeIndex
      ] &&
      activeIndex <
      sessionExercises.length -
        1
    ) {
      activeIndex +=
        1;

      startRestTimer(
        60
      );
    }

    renderCoach();
  }

  function finishWorkout() {
    const day =
      currentDay();

    const workout =
      currentWorkout(
        day
      );

    const allDone =
      workout.checks.length ===
        sessionExercises.length &&
      workout.checks.every(
        Boolean
      );

    if (
      !allDone
    ) {
      return;
    }

    workout.completedAt =
      new Date()
        .toISOString();

    saveWorkout(
      day,
      workout
    );

    closeCoach();
  }

  function handleClick(
    event
  ) {
    if (
      event.target.closest(
        "#m929Close"
      )
    ) {
      event.preventDefault();

      closeCoach();

      return;
    }

    if (
      event.target.closest(
        "#m929CompleteExercise"
      )
    ) {
      event.preventDefault();

      toggleExercise();

      return;
    }

    if (
      event.target.closest(
        "#m929Prev"
      )
    ) {
      event.preventDefault();

      activeIndex =
        Math.max(
          0,
          activeIndex -
          1
        );

      renderCoach();

      return;
    }

    if (
      event.target.closest(
        "#m929Next"
      )
    ) {
      event.preventDefault();

      activeIndex =
        Math.min(
          sessionExercises.length -
            1,
          activeIndex +
            1
        );

      renderCoach();

      return;
    }

    const rest =
      event.target.closest(
        "[data-m929-rest]"
      );

    if (
      rest
    ) {
      event.preventDefault();

      startRestTimer(
        Number(
          rest.dataset
            .m929Rest
        )
      );

      return;
    }

    if (
      event.target.closest(
        "#m929Finish"
      )
    ) {
      event.preventDefault();

      finishWorkout();
    }
  }

  function startWorkoutTimer() {
    stopWorkoutTimer();

    workoutTimer =
      setInterval(
        () => {

          const el =
            document.getElementById(
              "m929WorkoutTimer"
            );

          if (
            el
          ) {
            el.textContent =
              formatTime(
                elapsedWorkoutSeconds()
              );
          }

        },
        1000
      );
  }

  function stopWorkoutTimer() {
    if (
      workoutTimer
    ) {
      clearInterval(
        workoutTimer
      );

      workoutTimer =
        null;
    }
  }

  function startRestTimer(
    seconds
  ) {
    stopRestTimer();

    restRemaining =
      Math.max(
        0,
        Number(
          seconds ||
          0
        )
      );

    updateRestDisplay();

    restTimer =
      setInterval(
        () => {

          restRemaining =
            Math.max(
              0,
              restRemaining -
              1
            );

          updateRestDisplay();

          if (
            restRemaining <=
            0
          ) {
            stopRestTimer();
          }

        },
        1000
      );
  }

  function stopRestTimer() {
    if (
      restTimer
    ) {
      clearInterval(
        restTimer
      );

      restTimer =
        null;
    }
  }

  function updateRestDisplay() {
    const el =
      document.getElementById(
        "m929RestTime"
      );

    if (
      el
    ) {
      el.textContent =
        formatTime(
          restRemaining
        );
    }
  }

  function init() {
    injectStyles();

    ensureModal();

    document.addEventListener(
      "click",
      handleClick,
      true
    );
  }

  window.MANA28_WORKOUT_COACH_BUILD =
    BUILD;

  window.openMana28WorkoutCoach =
    openCoach;

  window.closeMana28WorkoutCoach =
    closeCoach;

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
