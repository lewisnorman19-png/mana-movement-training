/* =========================================
   MANA MOVEMENT TRAINING v6.3
   MANA STRENGTH WORKOUT LOGGER
   ========================================= */

(() => {
  "use strict";

  const STYLE_ID = "mana-strength-v63-style";
  const PROGRAM_KEY = "mana-strength-v62-program";
  const LOG_KEY = "mana-strength-v63-logs";
  const WORKOUT_ID = "manaStrengthWorkout";

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      .mana-v63-start{
        width:100%;
        min-height:48px;
        margin-top:14px;
        border-radius:14px;
        border:1px solid rgba(243,216,117,.35);
        background:#151515;
        color:#f3d875;
        font-weight:800;
        font-size:15px;
      }

      #${WORKOUT_ID}{
        position:fixed;
        inset:0;
        z-index:23000;
        display:none;
        overflow:auto;
        background:#050505;
        padding:
          calc(env(safe-area-inset-top) + 18px)
          18px
          calc(100px + env(safe-area-inset-bottom));
      }

      #${WORKOUT_ID}.open{
        display:block;
      }

      .mana-v63-shell{
        width:min(520px,100%);
        margin:auto;
      }

      .mana-v63-head{
        display:flex;
        justify-content:space-between;
        gap:14px;
        align-items:flex-start;
        margin-bottom:18px;
      }

      .mana-v63-head h1{
        margin:6px 0 4px;
        font-size:30px;
      }

      .mana-v63-close{
        width:44px;
        height:44px;
        border-radius:50%;
        border:1px solid #333;
        background:#111;
        color:white;
        font-size:24px;
      }

      .mana-v63-card{
        border:1px solid #292929;
        background:#0e0e0e;
        border-radius:20px;
        padding:16px;
        margin:12px 0;
      }

      .mana-v63-exercise-name{
        font-size:18px;
        font-weight:800;
      }

      .mana-v63-target{
        margin-top:4px;
        color:#aaa;
        font-size:13px;
      }

      .mana-v63-last{
        margin-top:6px;
        color:#f3d875;
        font-size:12px;
      }

      .mana-v63-inputs{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:10px;
        margin-top:12px;
      }

      .mana-v63-inputs input{
        margin:0 !important;
      }

      .mana-v63-done{
        width:100%;
        min-height:46px;
        margin-top:10px;
        border-radius:13px;
        border:1px solid #333;
        background:#111;
        color:#ddd;
        font-weight:800;
      }

      .mana-v63-done.done{
        background:#f3d875;
        color:#111;
        border-color:#f3d875;
      }

      .mana-v63-complete{
        width:100%;
        min-height:58px;
        margin-top:18px;
        border:0;
        border-radius:16px;
        background:#f3d875;
        color:#111;
        font-size:17px;
        font-weight:900;
      }

      .mana-v63-status{
        min-height:22px;
        margin-top:10px;
        color:#aaa;
        font-size:13px;
      }

      @media(max-width:380px){
        .mana-v63-inputs{
          grid-template-columns:1fr;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function safeJson(raw, fallback) {
    try {
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }

  function loadProgram() {
    return safeJson(
      localStorage.getItem(PROGRAM_KEY),
      null
    );
  }

  function loadLogs() {
    return safeJson(
      localStorage.getItem(LOG_KEY) || "[]",
      []
    );
  }

  function saveLogs(logs) {
    localStorage.setItem(
      LOG_KEY,
      JSON.stringify(logs)
    );
  }

  function latestForExercise(name) {
    const logs = loadLogs();

    for (let i = logs.length - 1; i >= 0; i--) {
      const match =
        (logs[i].exercises || [])
          .find(x => x.name === name);

      if (
        match &&
        (match.weight || match.reps)
      ) {
        return match;
      }
    }

    return null;
  }

  function addStartButtons() {
    const program =
      document.getElementById(
        "manaStrengthProgram"
      );

    if (!program) return;

    const days =
      program.querySelectorAll(
        ".mana-strength-day"
      );

    days.forEach((day, index) => {
      if (
        day.querySelector(
          ".mana-v63-start"
        )
      ) return;

      const button =
        document.createElement("button");

      button.type = "button";
      button.className =
        "mana-v63-start";
      button.textContent =
        "Start workout";

      button.onclick = () =>
        openWorkout(index);

      day.appendChild(button);
    });
  }

  function ensureWorkoutScreen() {
    if (
      document.getElementById(WORKOUT_ID)
    ) return;

    const screen =
      document.createElement("div");

    screen.id = WORKOUT_ID;

    screen.innerHTML = `
      <div class="mana-v63-shell">

        <div class="mana-v63-head">
          <div>
            <span class="pill">
              MANA STRENGTH
            </span>
            <h1 id="manaV63Title">
              Workout
            </h1>
            <div
              class="muted"
              id="manaV63Subtitle"
            ></div>
          </div>

          <button
            type="button"
            class="mana-v63-close"
            id="manaV63Close"
          >
            ×
          </button>
        </div>

        <div id="manaV63Exercises"></div>

        <button
          type="button"
          class="mana-v63-complete"
          id="manaV63Complete"
        >
          Complete workout
        </button>

        <div
          class="mana-v63-status"
          id="manaV63Status"
        ></div>

      </div>
    `;

    document.body.appendChild(screen);

    screen
      .querySelector("#manaV63Close")
      .onclick = closeWorkout;

    screen
      .querySelector("#manaV63Complete")
      .onclick = completeWorkout;
  }

  let activeDayIndex = null;

  function openWorkout(dayIndex) {
    const program = loadProgram();
    if (!program?.sessions?.[dayIndex]) return;

    ensureWorkoutScreen();

    activeDayIndex = dayIndex;

    const session =
      program.sessions[dayIndex];

    document.getElementById(
      "manaV63Title"
    ).textContent =
      session[0];

    document.getElementById(
      "manaV63Subtitle"
    ).textContent =
      `Day ${dayIndex + 1} • ${program.goal}`;

    const holder =
      document.getElementById(
        "manaV63Exercises"
      );

    holder.innerHTML =
      session[1].map(
        (exercise, exerciseIndex) => {
          const previous =
            latestForExercise(
              exercise[0]
            );

          return `
            <div
              class="mana-v63-card"
              data-v63-exercise="${exerciseIndex}"
            >
              <div class="mana-v63-exercise-name">
                ${exercise[0]}
              </div>

              <div class="mana-v63-target">
                Target: ${exercise[1]}
              </div>

              <div class="mana-v63-last">
                ${
                  previous
                    ? `Last: ${previous.weight || "—"} kg × ${previous.reps || "—"} reps`
                    : "No previous load"
                }
              </div>

              <div class="mana-v63-inputs">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  inputmode="decimal"
                  placeholder="Weight kg"
                  data-v63-weight
                />

                <input
                  type="number"
                  min="0"
                  inputmode="numeric"
                  placeholder="Reps"
                  data-v63-reps
                />
              </div>

              <button
                type="button"
                class="mana-v63-done"
                data-v63-done
              >
                Mark exercise done
              </button>
            </div>
          `;
        }
      ).join("");

    holder
      .querySelectorAll(
        "[data-v63-done]"
      )
      .forEach(button => {
        button.onclick = () => {
          button.classList.toggle(
            "done"
          );

          button.textContent =
            button.classList.contains(
              "done"
            )
              ? "Done ✓"
              : "Mark exercise done";
        };
      });

    document
      .getElementById(WORKOUT_ID)
      .classList.add("open");
  }

  function closeWorkout() {
    document
      .getElementById(WORKOUT_ID)
      ?.classList.remove("open");
  }

  function completeWorkout() {
    const program = loadProgram();

    if (
      activeDayIndex === null ||
      !program?.sessions?.[activeDayIndex]
    ) return;

    const session =
      program.sessions[activeDayIndex];

    const cards =
      [
        ...document.querySelectorAll(
          "#manaV63Exercises .mana-v63-card"
        )
      ];

    const exercises =
      cards.map((card, index) => ({
        name:
          session[1][index][0],
        target:
          session[1][index][1],
        weight:
          Number(
            card.querySelector(
              "[data-v63-weight]"
            )?.value || 0
          ),
        reps:
          Number(
            card.querySelector(
              "[data-v63-reps]"
            )?.value || 0
          ),
        done:
          card.querySelector(
            "[data-v63-done]"
          )?.classList.contains(
            "done"
          ) || false
      }));

    const logs = loadLogs();

    logs.push({
      id:
        Date.now().toString(),
      date:
        new Date().toISOString(),
      dayIndex:
        activeDayIndex,
      sessionName:
        session[0],
      goal:
        program.goal,
      exercises
    });

    saveLogs(logs);

    const status =
      document.getElementById(
        "manaV63Status"
      );

    if (status) {
      status.textContent =
        "Workout saved ✓";
    }

    setTimeout(() => {
      closeWorkout();
    }, 700);
  }

  function init() {
    injectStyles();
    ensureWorkoutScreen();

    setInterval(() => {
      addStartButtons();
    }, 600);
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }

})();
