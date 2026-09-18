/* =========================================
   MANA MOVEMENT TRAINING v8.4
   STRENGTH SHELL INTEGRATION
   DAILY WORKOUT OVERVIEW
   ========================================= */

(() => {
  "use strict";

  const SHELL_ID =
    "manaV83ProgramShell";

  const CONTENT_ID =
    "manaV83Content";

  const PROGRAM_KEY =
    "mana-strength-v62-program";

  const LOG_KEY =
    "mana-strength-v64-logs";

  const PROFILE_KEY =
    "mana-profile-v67";

  const STYLE_ID =
    "mana-v84-strength-style";


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

      .mana-v84-grid{
        display:grid;

        grid-template-columns:
          1fr 1fr;

        gap:10px;
      }


      .mana-v84-card{
        border:
          1px solid
          #292929;

        background:#0d0d0d;

        border-radius:18px;

        padding:15px;
      }


      .mana-v84-card.wide{
        grid-column:
          1 / -1;
      }


      .mana-v84-label{
        color:#888;

        font-size:11px;

        text-transform:
          uppercase;

        letter-spacing:.07em;

        margin-bottom:5px;
      }


      .mana-v84-value{
        color:#f3d875;

        font-weight:900;

        font-size:21px;

        line-height:1.25;
      }


      .mana-v84-sub{
        color:#999;

        font-size:12px;

        line-height:1.5;

        margin-top:5px;
      }


      .mana-v84-button{
        width:100%;

        min-height:58px;

        margin-top:16px;

        border:0;

        border-radius:16px;

        background:#f3d875;

        color:#111;

        font-size:16px;

        font-weight:900;
      }


      /* ==========================
         TODAY'S WORKOUT
         ========================== */

      .mana-v84-today{
        border:
          1px solid
          #4a3d12;

        background:
          linear-gradient(
            145deg,
            #17150d,
            #0b0b0b
          );

        border-radius:22px;

        padding:18px;

        margin-bottom:14px;
      }


      .mana-v84-today-kicker{
        color:#f3d875;

        font-size:11px;

        font-weight:900;

        letter-spacing:.13em;

        text-transform:uppercase;
      }


      .mana-v84-today h2{
        margin:
          7px
          0
          4px;

        font-size:26px;
      }


      .mana-v84-today-meta{
        color:#999;

        font-size:12px;

        line-height:1.5;
      }


      .mana-v84-exercise-list{
        margin-top:18px;

        border-top:
          1px solid
          #2d2a1c;
      }


      .mana-v84-exercise-row{
        display:grid;

        grid-template-columns:
          36px
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


      .mana-v84-exercise-number{
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


      .mana-v84-exercise-name{
        color:#eee;

        font-size:14px;

        font-weight:800;
      }


      .mana-v84-exercise-target{
        color:#f3d875;

        font-size:12px;

        font-weight:800;

        text-align:right;

        white-space:nowrap;
      }


      .mana-v84-week-progress{
        height:8px;

        margin-top:10px;

        border-radius:999px;

        overflow:hidden;

        background:#1a1a1a;
      }


      .mana-v84-week-fill{
        height:100%;

        border-radius:999px;

        background:#f3d875;
      }


      /* ==========================
         PROGRAM
         ========================== */

      .mana-v84-session{
        padding:14px 0;

        border-top:
          1px solid
          #292929;
      }


      .mana-v84-session:first-child{
        border-top:0;
      }


      .mana-v84-session strong{
        color:#eee;
      }


      .mana-v84-exercise{
        color:#999;

        font-size:12px;

        line-height:1.55;

        margin-top:6px;
      }


      /* ==========================
         PROGRESS
         ========================== */

      .mana-v84-history{
        display:flex;

        justify-content:
          space-between;

        gap:12px;

        padding:11px 0;

        border-top:
          1px solid
          #292929;
      }


      .mana-v84-history:first-child{
        border-top:0;
      }


      .mana-v84-history span{
        color:#888;

        font-size:12px;
      }


      /* ==========================
         LEARN
         ========================== */

      .mana-v84-learn h3{
        color:#f3d875;

        margin-bottom:6px;
      }


      .mana-v84-learn p{
        color:#aaa;

        line-height:1.6;
      }


      @media(
        max-width:390px
      ){
        .mana-v84-grid{
          grid-template-columns:
            1fr 1fr;
        }


        .mana-v84-exercise-row{
          grid-template-columns:
            32px
            1fr;

          gap:8px;
        }


        .mana-v84-exercise-target{
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


  function formatDate(
    value
  ) {
    if (!value) {
      return "—";
    }

    const date =
      new Date(value);

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


  function nextIndex(
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
          "#manaV83Tabs " +
          ".mana-v83-tab.active"
        )
        ?.dataset
        ?.v83Tab ||
      "overview"
    );
  }


  function profileSummary() {
    const p =
      loadProfile();

    return [
      p.goal,
      p.days
        ? `${p.days} days/week`
        : "",
      p.experience,
      p.equipment
    ]
      .filter(Boolean)
      .join(" • ");
  }


  function openWorkout(
    index
  ) {
    const shell =
      document.getElementById(
        SHELL_ID
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
          index
        );

      return;
    }


    console.error(
      "Mana Strength workout logger unavailable."
    );
  }


  function openFuel() {
    const shell =
      document.getElementById(
        SHELL_ID
      );

    shell
      ?.classList
      .remove(
        "open"
      );

    document.body.style.overflow =
      "";


    const buttons =
      [
        ...document
          .querySelectorAll(
            "[data-page], button"
          )
      ];


    const fuel =
      buttons.find(
        el =>
          (
            el.dataset.page ||
            el.textContent ||
            ""
          )
            .trim()
            .toLowerCase() ===
          "fuel"
      );


    fuel?.click();
  }


  /* =========================================
     OVERVIEW
     ========================================= */

  function renderOverview(
    holder
  ) {
    const program =
      loadProgram();

    const logs =
      loadLogs();

    const profile =
      loadProfile();


    if (
      !program
        ?.sessions
        ?.length
    ) {
      holder.innerHTML = `

        <div
          class="mana-v83-card"
        >

          <h2>
            Build your program
          </h2>

          <p>
            Complete your Profile and
            Mana Strength will generate
            your personalised training
            plan.
          </p>

        </div>

      `;

      return;
    }


    const completed =
      weekLogs(
        logs
      );


    const index =
      nextIndex(
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
                class="mana-v84-exercise-row"
              >

                <div
                  class="mana-v84-exercise-number"
                >
                  ${
                    exerciseIndex +
                    1
                  }
                </div>


                <div
                  class="mana-v84-exercise-name"
                >
                  ${name}
                </div>


                <div
                  class="mana-v84-exercise-target"
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


    holder.innerHTML = `

      <div
        class="mana-v84-today"
      >

        <div
          class="mana-v84-today-kicker"
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
          class="mana-v84-today-meta"
        >
          ${
            profileSummary() ||
            "Personalised training"
          }
        </div>


        <div
          class="mana-v84-exercise-list"
        >
          ${exerciseRows}
        </div>


        <button
          type="button"
          class="mana-v84-button"
          id="manaV84Start"
        >
          START WORKOUT →
        </button>

      </div>


      <div
        class="mana-v84-grid"
      >

        <div
          class="mana-v84-card"
        >

          <div
            class="mana-v84-label"
          >
            This week
          </div>

          <div
            class="mana-v84-value"
          >
            ${completed.length}
            /
            ${weeklyTarget}
          </div>

          <div
            class="mana-v84-sub"
          >
            Workouts completed
          </div>

          <div
            class="mana-v84-week-progress"
          >
            <div
              class="mana-v84-week-fill"
              style="
                width:
                ${weekPercent}%
              "
            ></div>
          </div>

        </div>


        <div
          class="mana-v84-card"
        >

          <div
            class="mana-v84-label"
          >
            Goal
          </div>

          <div
            class="mana-v84-value"
          >
            ${
              profile.goal ||
              program.goal ||
              "Strength"
            }
          </div>

        </div>


        <div
          class="mana-v84-card"
        >

          <div
            class="mana-v84-label"
          >
            Training
          </div>

          <div
            class="mana-v84-value"
          >
            ${
              profile.days ||
              program.days ||
              "—"
            }
            days
          </div>

          <div
            class="mana-v84-sub"
          >
            Per week
          </div>

        </div>


        <div
          class="mana-v84-card"
        >

          <div
            class="mana-v84-label"
          >
            Equipment
          </div>

          <div
            class="mana-v84-value"
          >
            ${
              profile.equipment ||
              program.equipment ||
              "—"
            }
          </div>

        </div>

      </div>

    `;


    document
      .getElementById(
        "manaV84Start"
      )
      ?.addEventListener(
        "click",
        () => {
          openWorkout(
            index
          );
        }
      );
  }


  /* =========================================
     FULL PROGRAM
     ========================================= */

  function renderProgram(
    holder
  ) {
    const program =
      loadProgram();


    if (
      !program
        ?.sessions
        ?.length
    ) {
      holder.innerHTML = `

        <div
          class="mana-v83-card"
        >

          <h2>
            Your Program
          </h2>

          <p>
            Your personalised program
            will appear here once your
            Profile is complete.
          </p>

        </div>

      `;

      return;
    }


    const sessions =
      program.sessions
        .map(
          (
            session,
            index
          ) => {

            const exerciseList =
              Array.isArray(
                session[1]
              )
                ? session[1]
                    .map(
                      exercise => {

                        if (
                          Array.isArray(
                            exercise
                          )
                        ) {
                          return (
                            exercise[0] +
                            " — " +
                            (
                              exercise[1] ||
                              ""
                            )
                          );
                        }

                        return String(
                          exercise
                        );
                      }
                    )
                    .join("<br>")
                : "";


            return `

              <div
                class="mana-v84-session"
              >

                <strong>
                  Day ${index + 1}
                  •
                  ${session[0]}
                </strong>

                <div
                  class="mana-v84-exercise"
                >
                  ${exerciseList}
                </div>

              </div>

            `;
          }
        )
        .join("");


    holder.innerHTML = `

      <div
        class="mana-v83-card"
      >

        <h2>
          Your Program
        </h2>

        <p>
          ${program.goal}
          •
          ${program.days}
          days per week
        </p>

        ${sessions}

      </div>

    `;
  }


  /* =========================================
     FUEL
     ========================================= */

  function renderFuel(
    holder
  ) {
    const p =
      loadProfile();


    holder.innerHTML = `

      <div
        class="mana-v83-card"
      >

        <h2>
          Fuel for Strength
        </h2>

        <p>
          Nutrition should support
          your training, recovery and
          current goal.
        </p>


        <div
          class="mana-v84-grid"
        >

          <div
            class="mana-v84-card"
          >

            <div
              class="mana-v84-label"
            >
              Goal
            </div>

            <div
              class="mana-v84-value"
            >
              ${
                p.goal ||
                "Set in Profile"
              }
            </div>

          </div>


          <div
            class="mana-v84-card"
          >

            <div
              class="mana-v84-label"
            >
              Body weight
            </div>

            <div
              class="mana-v84-value"
            >
              ${
                p.weight ||
                "—"
              }
              ${
                p.weight
                  ? " kg"
                  : ""
              }
            </div>

          </div>

        </div>


        <button
          type="button"
          class="mana-v84-button"
          id="manaV84FuelOpen"
        >
          OPEN FUEL →
        </button>

      </div>

    `;


    document
      .getElementById(
        "manaV84FuelOpen"
      )
      ?.addEventListener(
        "click",
        openFuel
      );
  }


  /* =========================================
     PROGRESS
     ========================================= */

  function renderProgress(
    holder
  ) {
    const logs =
      loadLogs();


    const completed =
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


    const history =
      logs.length
        ? logs
            .slice(-6)
            .reverse()
            .map(
              log => `

                <div
                  class="mana-v84-history"
                >

                  <strong>
                    ${
                      log.sessionName ||
                      "Workout"
                    }
                  </strong>

                  <span>
                    ${
                      formatDate(
                        log.date
                      )
                    }
                  </span>

                </div>

              `
            )
            .join("")
        : `

          <div
            class="mana-v84-sub"
          >
            No completed workouts yet.
          </div>

        `;


    holder.innerHTML = `

      <div
        class="mana-v84-grid"
      >

        <div
          class="mana-v84-card"
        >

          <div
            class="mana-v84-label"
          >
            This week
          </div>

          <div
            class="mana-v84-value"
          >
            ${completed.length}
          </div>

          <div
            class="mana-v84-sub"
          >
            Workouts completed
          </div>

        </div>


        <div
          class="mana-v84-card"
        >

          <div
            class="mana-v84-label"
          >
            Total workouts
          </div>

          <div
            class="mana-v84-value"
          >
            ${logs.length}
          </div>

        </div>


        <div
          class="
            mana-v84-card
            wide
          "
        >

          <div
            class="mana-v84-label"
          >
            Total volume
          </div>

          <div
            class="mana-v84-value"
          >
            ${
              totalVolume
                ? Math.round(
                    totalVolume
                  )
                    .toLocaleString() +
                  " kg"
                : "—"
            }
          </div>

        </div>


        <div
          class="
            mana-v84-card
            wide
          "
        >

          <div
            class="mana-v84-label"
          >
            Recent workouts
          </div>

          ${history}

        </div>

      </div>

    `;
  }


  /* =========================================
     LEARN
     ========================================= */

  function renderLearn(
    holder
  ) {
    holder.innerHTML = `

      <div
        class="
          mana-v83-card
          mana-v84-learn
        "
      >

        <h2>
          Strength Principles
        </h2>


        <h3>
          Progressive overload
        </h3>

        <p>
          Gradually improve load,
          repetitions, control or
          training quality over time.
        </p>


        <h3>
          Technique first
        </h3>

        <p>
          Good movement quality comes
          before chasing heavier weight.
        </p>


        <h3>
          Recovery matters
        </h3>

        <p>
          Strength and muscle are built
          through training, nutrition,
          sleep and recovery.
        </p>


        <h3>
          Consistency wins
        </h3>

        <p>
          A sustainable program repeated
          consistently beats occasional
          perfect workouts.
        </p>

      </div>

    `;
  }


  /* =========================================
     RENDER ACTIVE TAB
     ========================================= */

  function renderStrengthTab() {
    if (
      !shellIsStrength()
    ) return;


    const holder =
      document.getElementById(
        CONTENT_ID
      );

    if (!holder) return;


    const tab =
      activeTab();


    if (
      tab ===
      "overview"
    ) {
      renderOverview(
        holder
      );

      return;
    }


    if (
      tab ===
      "program"
    ) {
      renderProgram(
        holder
      );

      return;
    }


    if (
      tab ===
      "fuel"
    ) {
      renderFuel(
        holder
      );

      return;
    }


    if (
      tab ===
      "progress"
    ) {
      renderProgress(
        holder
      );

      return;
    }


    if (
      tab ===
      "learn"
    ) {
      renderLearn(
        holder
      );
    }
  }


  /* =========================================
     WATCHERS
     ========================================= */

  function wire() {
    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "#manaV80Strength"
          )
        ) {
          setTimeout(
            renderStrengthTab,
            80
          );

          return;
        }


        if (
          event.target.closest(
            "#manaV83Tabs " +
            "[data-v83-tab]"
          )
        ) {
          setTimeout(
            renderStrengthTab,
            20
          );
        }

      }
    );


    window.addEventListener(
      "mana:program-tab-change",
      () => {
        setTimeout(
          renderStrengthTab,
          20
        );
      }
    );


    window.addEventListener(
      "mana:strength-synced",
      () => {
        setTimeout(
          renderStrengthTab,
          100
        );
      }
    );


    window.addEventListener(
      "mana:profile-synced",
      () => {
        setTimeout(
          renderStrengthTab,
          100
        );
      }
    );


    window.addEventListener(
      "focus",
      () => {

        if (
          shellIsStrength()
        ) {
          setTimeout(
            renderStrengthTab,
            100
          );
        }

      }
    );
  }


  function watchStrengthShell() {
    const shell =
      document.getElementById(
        SHELL_ID
      );

    const title =
      document.getElementById(
        "manaV83Title"
      );


    if (!shell) return;


    const refresh =
      () => {

        if (
          shellIsStrength()
        ) {
          setTimeout(
            renderStrengthTab,
            60
          );
        }

      };


    const observer =
      new MutationObserver(
        refresh
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


    if (title) {
      observer.observe(
        title,
        {
          childList:true,
          subtree:true
        }
      );
    }
  }


  function init() {
    injectStyles();

    wire();

    watchStrengthShell();


    setTimeout(
      renderStrengthTab,
      1200
    );
  }


  window.renderManaStrengthShell =
    renderStrengthTab;


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
