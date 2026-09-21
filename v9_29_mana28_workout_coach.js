/* =========================================
   MANA MOVEMENT TRAINING v9.29.0
   MANA 28 — WORKOUT COACH

   WHOLE NEW FILE:
   v9_29_mana28_workout_coach.js

   BUILDS:
   - FOCUSED FULL-SCREEN MANA 28 WORKOUT
   - ONE EXERCISE AT A TIME
   - SET / REP PRESCRIPTION
   - REST GUIDANCE
   - COACHING CUE
   - EQUIPMENT
   - SUBSTITUTION
   - PREVIOUS / NEXT EXERCISE
   - MARK EXERCISE COMPLETE
   - WORKOUT TIMER
   - REST TIMER
   - FINISH WORKOUT
   - SAVES BACK INTO EXISTING MANA 28 STATE

   DOES NOT ALTER MANA STRENGTH
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "92900";

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

  const COACH = [
    {
      match: /goblet squat/i,
      rest: "60–90 sec",
      equipment: "Dumbbell or kettlebell",
      cue: "Keep the weight close to your chest, brace first, sit between the hips and drive through the whole foot.",
      substitute: "Leg press or box squat"
    },
    {
      match: /leg press/i,
      rest: "75–90 sec",
      equipment: "Leg press",
      cue: "Keep your whole foot planted, control the lowering phase and stop before your hips roll under.",
      substitute: "Goblet squat or supported squat"
    },
    {
      match: /db bench|dumbbell bench/i,
      rest: "75–90 sec",
      equipment: "Bench + dumbbells",
      cue: "Set the shoulder blades, keep wrists stacked and lower with control before pressing smoothly.",
      substitute: "Machine chest press or incline push-up"
    },
    {
      match: /machine press/i,
      rest: "60–90 sec",
      equipment: "Chest press machine",
      cue: "Keep your upper back supported, control the handles back and press without shrugging.",
      substitute: "Dumbbell bench press"
    },
    {
      match: /shoulder press/i,
      rest: "60–90 sec",
      equipment: "Dumbbells or machine",
      cue: "Brace the trunk, keep elbows slightly forward and press without leaning back.",
      substitute: "Machine shoulder press or landmine press"
    },
    {
      match: /seated row|cable row|machine row/i,
      rest: "60–90 sec",
      equipment: "Cable or row machine",
      cue: "Lead with the elbows, keep the ribs down and finish by squeezing the shoulder blades without jerking.",
      substitute: "Chest-supported dumbbell row"
    },
    {
      match: /lat pulldown/i,
      rest: "60–90 sec",
      equipment: "Lat pulldown",
      cue: "Pull the elbows down toward your ribs while keeping the chest tall and shoulders away from your ears.",
      substitute: "Assisted pull-up or high cable row"
    },
    {
      match: /romanian deadlift/i,
      rest: "75–120 sec",
      equipment: "Dumbbells or barbell",
      cue: "Soften the knees, push the hips back and keep the weight close while maintaining a long neutral spine.",
      substitute: "Cable pull-through or hip hinge with dumbbells"
    },
    {
      match: /split squat/i,
      rest: "60–90 sec",
      equipment: "Bodyweight or dumbbells",
      cue: "Stay tall, keep the front foot planted and lower under control using support if needed.",
      substitute: "Step-up or supported reverse lunge"
    },
    {
      match: /hamstring curl/i,
      rest: "45–75 sec",
      equipment: "Hamstring curl machine",
      cue: "Keep the hips still, curl smoothly and control the return instead of letting the weight drop.",
      substitute: "Swiss-ball curl or slider curl"
    },
    {
      match: /calf raise/i,
      rest: "45–60 sec",
      equipment: "Machine, step or dumbbells",
      cue: "Use a full range, pause at the top and control the heel down.",
      substitute: "Bodyweight calf raise"
    },
    {
      match: /biceps curl/i,
      rest: "45–60 sec",
      equipment: "Dumbbells or cable",
      cue: "Keep the elbows quiet, curl without swinging and lower slowly.",
      substitute: "Cable curl or hammer curl"
    },
    {
      match: /triceps pressdown/i,
      rest: "45–60 sec",
      equipment: "Cable",
      cue: "Pin the elbows by your sides and straighten the arms without rolling the shoulders forward.",
      substitute: "Overhead cable extension"
    },
    {
      match: /plank/i,
      rest: "45–60 sec",
      equipment: "Mat",
      cue: "Brace as if preparing for a punch, squeeze glutes and keep the body in one straight line.",
      substitute: "Elevated plank or dead bug"
    },
    {
      match: /dead bug/i,
      rest: "30–45 sec",
      equipment: "Mat",
      cue: "Keep the lower back gently connected to the floor and move only as far as you can control.",
      substitute: "Heel taps"
    },
    {
      match: /bird dog/i,
      rest: "30–45 sec",
      equipment: "Mat",
      cue: "Keep the hips square and reach long rather than lifting the arm and leg high.",
      substitute: "Dead bug"
    },
    {
      match: /side plank/i,
      rest: "30–45 sec",
      equipment: "Mat",
      cue: "Stack the shoulders and hips, press the floor away and keep the body long.",
      substitute: "Bent-knee side plank"
    },
    {
      match: /farmer carry/i,
      rest: "45–60 sec",
      equipment: "Dumbbells or kettlebells",
      cue: "Stand tall, brace the trunk and walk with controlled steps without leaning.",
      substitute: "Suitcase carry"
    },
    {
      match: /bike|rower|incline walk|easy walk|purposeful walk|easy cardio/i,
      rest: "As needed",
      equipment: "Cardio machine or walking route",
      cue: "Keep the effort controlled enough that you could speak in short sentences.",
      substitute: "Any low-impact cardio you can do comfortably"
    },
    {
      match: /mobility|stretch/i,
      rest: "Move continuously",
      equipment: "Mat",
      cue: "Move slowly, stay out of painful ranges and breathe through each position.",
      substitute: "Use a comfortable mobility movement for the same area"
    },
    {
      match: /breathing/i,
      rest: "Continuous",
      equipment: "Quiet space",
      cue: "Breathe slowly through the nose, relax the shoulders and lengthen the exhale.",
      substitute: "Easy lying or seated breathing"
    }
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

    if (
      !state.actions ||
      typeof state.actions !==
        "object"
    ) {
      state.actions =
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

  function currentWorkout(
    day
  ) {
    const state =
      loadState();

    const workout =
      state.workouts[
        String(
          day
        )
      ] || {};

    const checks =
      Array.isArray(
        workout.checks
      )
        ? workout.checks.slice()
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
        workout.startedAt ||
        null,

      completedAt:
        workout.completedAt ||
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

  function workoutCard() {
    return document.getElementById(
      "manaV928Workout"
    );
  }

  function mana28OverviewOpen() {
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
      shell?.classList
        .contains(
          "open"
        ) &&
      title?.textContent
        ?.trim()
        ?.toUpperCase() ===
        "MANA 28" &&
      tab?.dataset
        ?.v83Tab ===
        "overview"
    );
  }

  function readExercisesFromCard() {
    const card =
      workoutCard();

    if (!card) {
      return [];
    }

    return [
      ...card.querySelectorAll(
        "[data-m928-ex]"
      )
    ].map(
      button => {

        const name =
          button
            .querySelector(
              ".m928-name"
            )
            ?.textContent
            ?.trim() ||
          "Exercise";

        const dose =
          button
            .querySelector(
              ".m928-dose"
            )
            ?.textContent
            ?.trim() ||
          "";

        return {
          name,
          dose
        };

      }
    );
  }

  function coachFor(
    exerciseName
  ) {
    return (
      COACH.find(
        item =>
          item.match.test(
            exerciseName
          )
      ) || {
        rest: "60–90 sec",
        equipment: "Use the equipment shown in your program",
        cue: "Use controlled technique, stay within a comfortable range and stop the set if your form breaks down.",
        substitute: "Choose a similar movement pattern that you can perform safely"
      }
    );
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
        background:#050505;
        color:#fff;
        padding:
          calc(env(safe-area-inset-top) + 14px)
          14px
          calc(env(safe-area-inset-bottom) + 28px);
      }

      #${MODAL_ID}.open{
        display:block;
      }

      .m929-shell{
        width:min(560px,100%);
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

      .m929-close{
        min-height:42px;
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
        background:
          linear-gradient(
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
        background:
          linear-gradient(
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
        grid-template-columns:1fr 1fr;
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
        border-radius:0 12px 12px 0;
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
        grid-template-columns:1fr 1fr;
        gap:9px;
        margin-top:10px;
      }

      .m929-nav button,
      .m929-rest-btn{
        min-height:46px;
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
        grid-template-columns:repeat(3,1fr);
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
          grid-template-columns:1fr;
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

        <div id="m929Content"></div>
      </div>
    `;

    document.body
      .appendChild(
        modal
      );

    document
      .getElementById(
        "m929Close"
      )
      ?.addEventListener(
        "click",
        closeCoach
      );
  }

  function openCoach() {
    if (
      !mana28OverviewOpen()
    ) {
      return;
    }

    sessionExercises =
      readExercisesFromCard();

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

    activeIndex =
      workout.checks.findIndex(
        complete =>
          !complete
      );

    if (
      activeIndex <
      0
    ) {
      activeIndex =
        0;
    }

    ensureModal();

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
        "hidden";

    stopRestTimer();
    stopWorkoutTimer();

    window
      .refreshMana28Workout
      ?.();
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
      workout.checks.filter(
        Boolean
      ).length;

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
              ${
                workoutCard()
                  ?.querySelector(
                    ".m928-title"
                  )
                  ?.textContent
                  ?.trim() ||
                "MANA 28 WORKOUT"
              }
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
          <span>COACHING CUE</span>
          <p>
            ${coach.cue}
          </p>
        </div>

        <div class="m929-coach">
          <span>SUBSTITUTION</span>
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

    wireCoachControls();
  }

  function wireCoachControls() {
    document
      .getElementById(
        "m929CompleteExercise"
      )
      ?.addEventListener(
        "click",
        () => {

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
      );

    document
      .getElementById(
        "m929Prev"
      )
      ?.addEventListener(
        "click",
        () => {

          activeIndex =
            Math.max(
              0,
              activeIndex -
              1
            );

          renderCoach();

        }
      );

    document
      .getElementById(
        "m929Next"
      )
      ?.addEventListener(
        "click",
        () => {

          activeIndex =
            Math.min(
              sessionExercises.length -
              1,
              activeIndex +
              1
            );

          renderCoach();

        }
      );

    document
      .querySelectorAll(
        "[data-m929-rest]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              startRestTimer(
                Number(
                  button.dataset
                    .m929Rest
                )
              );

            }
          );

        }
      );

    document
      .getElementById(
        "m929Finish"
      )
      ?.addEventListener(
        "click",
        finishWorkout
      );
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

    if (!allDone) {
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

    setTimeout(
      () => {

        window
          .refreshMana28Workout
          ?.();

      },
      150
    );
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

          if (el) {
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

    if (el) {
      el.textContent =
        formatTime(
          restRemaining
        );
    }
  }

  function interceptStartButton() {
    document.addEventListener(
      "click",
      event => {

        const button =
          event.target.closest(
            "#m928WorkoutBtn"
          );

        if (!button) {
          return;
        }

        if (
          !mana28OverviewOpen()
        ) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        openCoach();

      },
      true
    );
  }

  function upgradeButtonCopy() {
    if (
      !mana28OverviewOpen()
    ) {
      return;
    }

    const button =
      document.getElementById(
        "m928WorkoutBtn"
      );

    if (!button) {
      return;
    }

    const day =
      currentDay();

    sessionExercises =
      readExercisesFromCard();

    if (
      !sessionExercises.length
    ) {
      return;
    }

    const workout =
      currentWorkout(
        day
      );

    const completed =
      workout.checks.filter(
        Boolean
      ).length;

    button.textContent =
      completed > 0
        ? "RESUME TODAY’S WORKOUT →"
        : "START TODAY’S WORKOUT →";
  }

  function watchDOM() {
    let timer =
      null;

    const observer =
      new MutationObserver(
        () => {

          clearTimeout(
            timer
          );

          timer =
            setTimeout(
              upgradeButtonCopy,
              100
            );

        }
      );

    observer.observe(
      document.body,
      {
        childList:
          true,

        subtree:
          true
      }
    );
  }

  function init() {
    injectStyles();

    ensureModal();

    interceptStartButton();

    watchDOM();

    window.addEventListener(
      "mana:program-tab-change",
      () => {

        setTimeout(
          upgradeButtonCopy,
          160
        );

      }
    );

    window.addEventListener(
      "mana28:updated",
      () => {

        setTimeout(
          upgradeButtonCopy,
          160
        );

      }
    );

    [
      700,
      1400,
      2400
    ].forEach(
      delay => {

        setTimeout(
          upgradeButtonCopy,
          delay
        );

      }
    );
  }

  window.MANA28_WORKOUT_COACH_BUILD =
    BUILD;

  window.openMana28WorkoutCoach =
    openCoach;

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
