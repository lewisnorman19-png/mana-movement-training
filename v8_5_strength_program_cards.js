/* =========================================
   MANA MOVEMENT TRAINING v8.5
   STRENGTH PROGRAM CARDS
   ========================================= */

(() => {
  "use strict";

  const PROGRAM_KEY =
    "mana-strength-v62-program";

  const STYLE_ID =
    "mana-v85-strength-cards-style";

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
        border:1px solid #292929;
        border-radius:20px;
        background:
          linear-gradient(
            145deg,
            #111,
            #090909
          );
        overflow:hidden;
      }

      .mana-v85-head{
        padding:18px;
      }

      .mana-v85-top{
        display:flex;
        justify-content:
          space-between;
        align-items:center;
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
        padding:6px 10px;
        border-radius:999px;
        border:1px solid #333;
        color:#999;
        font-size:11px;
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
        padding:9px 0;
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
        width:calc(100% - 36px);
        min-height:50px;
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

    return !!(
      shell
        ?.classList
        .contains("open") &&
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

  function exerciseName(ex) {
    if (
      Array.isArray(ex)
    ) {
      return (
        ex[0] ||
        "Exercise"
      );
    }

    return String(
      ex || "Exercise"
    );
  }

  function renderCards() {
    if (
      !strengthShellOpen()
    ) return;

    const holder =
      document.getElementById(
        "manaV83Content"
      );

    const program =
      loadProgram();

    if (
      !holder ||
      !program?.sessions
        ?.length
    ) return;

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

            const rows =
              exercises
                .map(
                  (
                    ex,
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
                        ${exerciseName(ex)}
                      </span>
                    </div>
                  `
                )
                .join("");

            return `
              <div
                class="mana-v85-day"
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
                  class="mana-v85-start"
                  data-v85-day="${dayIndex}"
                >
                  Start workout →
                </button>
              </div>
            `;
          }
        )
        .join("");

    holder.innerHTML = `
      <div class="mana-v85-summary">
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
          button.onclick =
            () => {
              startWorkout(
                Number(
                  button.dataset
                    .v85Day
                )
              );
            };
        }
      );
  }

  function startWorkout(
    dayIndex
  ) {
    const shell =
      document.getElementById(
        "manaV83ProgramShell"
      );

    shell
      ?.classList
      .remove("open");

    document.body.style.overflow =
      "";

    const client =
      document.getElementById(
        "clientView"
      );

    if (!client) return;

    const target =
      [
        ...client
          .querySelectorAll(
            "button, .day, .card"
          )
      ].find(
        el =>
          (el.textContent || "")
            .toUpperCase()
            .includes(
              "MANA STRENGTH"
            )
      );

    if (!target) return;

    target.click();

    setTimeout(
      () => {
        const programHolder =
          document.getElementById(
            "manaStrengthProgram"
          );

        const days =
          programHolder
            ?.querySelectorAll(
              ".mana-strength-day"
            );

        const day =
          days?.[dayIndex];

        const start =
          day?.querySelector(
            ".mana-v63-start"
          );

        if (start) {
          start.click();
        }
      },
      450
    );
  }

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
  }

  function init() {
    injectStyles();
    watch();

    setTimeout(
      renderCards,
      1200
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
