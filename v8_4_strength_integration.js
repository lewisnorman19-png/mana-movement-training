/* =========================================
   MANA MOVEMENT TRAINING v8.4
   STRENGTH SHELL INTEGRATION
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
        border:1px solid #292929;
        background:#0d0d0d;
        border-radius:18px;
        padding:15px;
      }

      .mana-v84-card.wide{
        grid-column:1 / -1;
      }

      .mana-v84-label{
        color:#888;
        font-size:11px;
        text-transform:uppercase;
        letter-spacing:.05em;
        margin-bottom:5px;
      }

      .mana-v84-value{
        color:#f3d875;
        font-weight:900;
        font-size:21px;
      }

      .mana-v84-sub{
        color:#999;
        font-size:12px;
        line-height:1.5;
        margin-top:5px;
      }

      .mana-v84-button{
        width:100%;
        min-height:54px;
        margin-top:14px;
        border:0;
        border-radius:16px;
        background:#f3d875;
        color:#111;
        font-size:15px;
        font-weight:900;
      }

      .mana-v84-secondary{
        width:100%;
        min-height:48px;
        margin-top:10px;
        border-radius:15px;
        border:1px solid #353535;
        background:#111;
        color:#f3d875;
        font-weight:900;
      }

      .mana-v84-session{
        padding:14px 0;
        border-top:1px solid #292929;
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

      .mana-v84-history{
        display:flex;
        justify-content:space-between;
        gap:12px;
        padding:11px 0;
        border-top:1px solid #292929;
      }

      .mana-v84-history:first-child{
        border-top:0;
      }

      .mana-v84-history span{
        color:#888;
        font-size:12px;
      }

      .mana-v84-learn h3{
        color:#f3d875;
        margin-bottom:6px;
      }

      .mana-v84-learn p{
        color:#aaa;
        line-height:1.6;
      }

      @media(max-width:390px){
        .mana-v84-grid{
          grid-template-columns:1fr;
        }

        .mana-v84-card.wide{
          grid-column:auto;
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

  function weekLogs(logs) {
    const start =
      startOfWeek().getTime();

    return logs.filter(
      log => {
        const time =
          new Date(
            log.date || 0
          ).getTime();

        return (
          time >= start
        );
      }
    );
  }

  function formatDate(value) {
    if (!value) return "—";

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) return "—";

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
      program?.sessions
        ?.length || 0;

    if (!total) return 0;

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

    return !!(
      shell
        ?.classList
        .contains("open") &&
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

  function openOldStrength() {
    const client =
      document.getElementById(
        "clientView"
      );

    if (!client) return;

    const targets =
      [
        ...client
          .querySelectorAll(
            "button, .day, .card"
          )
      ];

    const target =
      targets.find(
        el =>
          (el.textContent || "")
            .toUpperCase()
            .includes(
              "MANA STRENGTH"
            )
      );

    if (!target) return;

    document
      .getElementById(
        SHELL_ID
      )
      ?.classList
      .remove("open");

    document.body.style.overflow =
      "";

    target.click();
  }

  function openFuel() {
    const shell =
      document.getElementById(
        SHELL_ID
      );

    shell
      ?.classList
      .remove("open");

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

    if (fuel) {
      fuel.click();
    }
  }

  function profileSummary() {
    const p =
      loadProfile();

    return [
      p.goal,
      p.trainingDays
        ? `${p.trainingDays} days/week`
        : "",
      p.experience,
      p.equipment
    ]
      .filter(Boolean)
      .join(" • ");
  }

  function renderOverview(
    holder
  ) {
    const program =
      loadProgram();

    const logs =
      loadLogs();

    if (
      !program?.sessions
        ?.length
    ) {
      holder.innerHTML = `
        <div class="mana-v83-card">
          <h2>
            Your Strength Program
          </h2>

          <p>
            Your profile is ready,
            but your strength program
            needs to be generated.
          </p>

          <button
            class="mana-v84-button"
            id="manaV84OpenStrength"
          >
            Build / open program
          </button>
        </div>
      `;

      document
        .getElementById(
          "manaV84OpenStrength"
        )
        ?.addEventListener(
          "click",
          openOldStrength
        );

      return;
    }

    const completed =
      weekLogs(logs);

    const index =
      nextIndex(
        program,
        completed
      );

    const session =
      program.sessions[index];

    const last =
      logs.length
        ? logs[
            logs.length - 1
          ]
        : null;

    holder.innerHTML = `
      <div class="mana-v84-grid">

        <div class="
          mana-v84-card
          wide
        ">
          <div class="mana-v84-label">
            Next workout
          </div>

          <div class="mana-v84-value">
            Day ${index + 1}
            •
            ${
              session?.[0] ||
              "Workout"
            }
          </div>

          <div class="mana-v84-sub">
            ${
              profileSummary() ||
              "Personalised training"
            }
          </div>

          <button
            class="mana-v84-button"
            id="manaV84Start"
          >
            Start workout
          </button>
        </div>

        <div class="mana-v84-card">
          <div class="mana-v84-label">
            This week
          </div>

          <div class="mana-v84-value">
            ${completed.length}
            /
            ${program.sessions.length}
          </div>

          <div class="mana-v84-sub">
            Workouts completed
          </div>
        </div>

        <div class="mana-v84-card">
          <div class="mana-v84-label">
            Last workout
          </div>

          <div class="mana-v84-value">
            ${
              last
                ? formatDate(
                    last.date
                  )
                : "—"
            }
          </div>

          <div class="mana-v84-sub">
            ${
              last?.sessionName ||
              "No workout logged"
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
        openOldStrength
      );
  }

  function renderProgram(
    holder
  ) {
    const program =
      loadProgram();

    if (
      !program?.sessions
        ?.length
    ) {
      holder.innerHTML = `
        <div class="mana-v83-card">
          <h2>
            Your Program
          </h2>

          <p>
            Open Mana Strength to
            generate your personalised
            training sessions.
          </p>

          <button
            class="mana-v84-button"
            id="manaV84ProgramOpen"
          >
            Open Mana Strength
          </button>
        </div>
      `;

      document
        .getElementById(
          "manaV84ProgramOpen"
        )
        ?.addEventListener(
          "click",
          openOldStrength
        );

      return;
    }

    const sessions =
      program.sessions
        .map(
          (
            session,
            index
          ) => `
            <div class="mana-v84-session">
              <strong>
                Day ${index + 1}
                •
                ${session[0]}
              </strong>

              <div class="mana-v84-exercise">
                ${
                  Array.isArray(
                    session[1]
                  )
                    ? session[1]
                        .map(
                          ex =>
                            Array.isArray(ex)
                              ? ex[0]
                              : String(ex)
                        )
                        .join(" • ")
                    : ""
                }
              </div>
            </div>
          `
        )
        .join("");

    holder.innerHTML = `
      <div class="mana-v83-card">
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

        <button
          class="mana-v84-button"
          id="manaV84ProgramOpen"
        >
          Open workout logger
        </button>
      </div>
    `;

    document
      .getElementById(
        "manaV84ProgramOpen"
      )
      ?.addEventListener(
        "click",
        openOldStrength
      );
  }

  function renderFuel(
    holder
  ) {
    const p =
      loadProfile();

    holder.innerHTML = `
      <div class="mana-v83-card">
        <h2>
          Fuel for Strength
        </h2>

        <p>
          Nutrition should support
          training, recovery and your
          current goal.
        </p>

        <div class="mana-v84-grid">

          <div class="mana-v84-card">
            <div class="mana-v84-label">
              Goal
            </div>

            <div class="mana-v84-value">
              ${p.goal || "Set in Profile"}
            </div>
          </div>

          <div class="mana-v84-card">
            <div class="mana-v84-label">
              Body weight
            </div>

            <div class="mana-v84-value">
              ${
                p.weightKg ||
                p.weight ||
                "—"
              }
              ${
                p.weightKg ||
                p.weight
                  ? " kg"
                  : ""
              }
            </div>
          </div>

        </div>

        <button
          class="mana-v84-button"
          id="manaV84FuelOpen"
        >
          Open Fuel
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

  function renderProgress(
    holder
  ) {
    const logs =
      loadLogs();

    const completed =
      weekLogs(logs);

    const totalVolume =
      logs.reduce(
        (
          total,
          log
        ) =>
          total +
          Number(
            log.volume || 0
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
                <div class="mana-v84-history">
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
          <div class="mana-v84-sub">
            No completed workouts yet.
          </div>
        `;

    holder.innerHTML = `
      <div class="mana-v84-grid">

        <div class="mana-v84-card">
          <div class="mana-v84-label">
            This week
          </div>

          <div class="mana-v84-value">
            ${completed.length}
          </div>

          <div class="mana-v84-sub">
            Workouts completed
          </div>
        </div>

        <div class="mana-v84-card">
          <div class="mana-v84-label">
            Total workouts
          </div>

          <div class="mana-v84-value">
            ${logs.length}
          </div>
        </div>

        <div class="
          mana-v84-card
          wide
        ">
          <div class="mana-v84-label">
            Logged volume
          </div>

          <div class="mana-v84-value">
            ${
              totalVolume
                ? Math.round(
                    totalVolume
                  ).toLocaleString()
                : "—"
            }
          </div>
        </div>

        <div class="
          mana-v84-card
          wide
        ">
          <div class="mana-v84-label">
            Recent workouts
          </div>

          ${history}
        </div>

      </div>
    `;
  }

  function renderLearn(
    holder
  ) {
    holder.innerHTML = `
      <div class="
        mana-v83-card
        mana-v84-learn
      ">
        <h2>
          Strength Principles
        </h2>

        <h3>
          Progressive overload
        </h3>

        <p>
          Aim to gradually improve
          load, repetitions, control
          or training quality over time.
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
          Strength is built through the
          combination of training,
          nutrition, sleep and recovery.
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
      tab === "overview"
    ) {
      renderOverview(
        holder
      );
      return;
    }

    if (
      tab === "program"
    ) {
      renderProgram(
        holder
      );
      return;
    }

    if (
      tab === "fuel"
    ) {
      renderFuel(
        holder
      );
      return;
    }

    if (
      tab === "progress"
    ) {
      renderProgress(
        holder
      );
      return;
    }

    if (
      tab === "learn"
    ) {
      renderLearn(
        holder
      );
    }
  }

  function wire() {
    document
      .addEventListener(
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
      "mana:strength-synced",
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

  const tabs =
    document.getElementById(
      "manaV83Tabs"
    );

  if (!shell) return;

  const refresh = () => {
    if (shellIsStrength()) {
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

  if (tabs) {
    observer.observe(
      tabs,
      {
        childList:true,
        subtree:true,
        attributes:true,
        attributeFilter:[
          "class"
        ]
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
