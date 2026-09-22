/* =========================================
   MANA MOVEMENT TRAINING v9.22.1
   WORKOUT FEEDBACK

   - SESSION EFFORT
   - WORKOUT NOTE
   - SAVES INTO COMPLETED WORKOUT LOG
   - SHOWS FEEDBACK IN PROGRESS HISTORY

   STABILITY:
   - NO CONTINUOUS MUTATION OBSERVER
   - EVENT-DRIVEN REFRESH ONLY
   ========================================= */

(() => {
  "use strict";

  const STYLE_ID =
    "mana-v922-feedback-style";

  const FEEDBACK_ID =
    "manaV922Feedback";

  const LOG_KEY =
    "mana-strength-v64-logs";

  let pendingFeedback =
    null;

  let feedbackRefreshTimer =
    null;

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

  function saveLogs(
    logs
  ) {
    try {
      localStorage.setItem(
        LOG_KEY,
        JSON.stringify(
          logs
        )
      );
    } catch (_) {}
  }

  function workoutOpen() {
    return Boolean(
      document
        .getElementById(
          "manaStrengthV64Workout"
        )
        ?.classList
        .contains(
          "open"
        )
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
        .contains(
          "open"
        ) &&

      title
        ?.textContent
        ?.trim()
        ?.toUpperCase() ===
        "MANA STRENGTH" &&

      tab
        ?.dataset
        ?.v83Tab ===
        "progress"
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
      .mana-v922-feedback{
        margin-top:18px;
        padding:16px;
        border:
          1px solid
          #35301f;
        border-radius:18px;
        background:
          linear-gradient(
            145deg,
            #12100a,
            #090909
          );
      }

      .mana-v922-kicker{
        color:#f3d875;
        font-size:9px;
        font-weight:900;
        letter-spacing:.12em;
        text-transform:uppercase;
      }

      .mana-v922-title{
        margin-top:5px;
        color:#fff;
        font-size:17px;
        font-weight:900;
      }

      .mana-v922-copy{
        margin-top:4px;
        color:#777;
        font-size:10px;
        line-height:1.45;
      }

      .mana-v922-label{
        display:block;
        margin-top:15px;
        margin-bottom:7px;
        color:#aaa;
        font-size:10px;
        font-weight:800;
        text-transform:uppercase;
        letter-spacing:.05em;
      }

      .mana-v922-effort{
        display:grid;
        grid-template-columns:
          repeat(
            4,
            1fr
          );
        gap:7px;
      }

      .mana-v922-effort button{
        min-height:44px;
        padding:8px 5px;
        border:1px solid #333;
        border-radius:12px;
        background:#101010;
        color:#aaa;
        font-size:10px;
        font-weight:900;
        touch-action:manipulation;
      }

      .mana-v922-effort button.active{
        border-color:#f3d875;
        background:#f3d875;
        color:#111;
      }

      .mana-v922-note{
        width:100% !important;
        min-height:88px;
        margin:0 !important;
        padding:12px !important;
        resize:vertical;
        border:
          1px solid
          #333 !important;
        border-radius:
          13px !important;
        background:
          #0b0b0b !important;
        color:#fff !important;
        font-size:
          14px !important;
        line-height:1.45;
      }

      .mana-v922-history{
        grid-column:
          1 / -1;
        margin-top:7px;
        padding-top:8px;
        border-top:
          1px solid
          #242424;
      }

      .mana-v922-history-effort{
        display:inline-flex;
        align-items:center;
        padding:4px 7px;
        border:
          1px solid
          #4b401c;
        border-radius:999px;
        color:#f3d875;
        font-size:9px;
        font-weight:900;
        text-transform:uppercase;
      }

      .mana-v922-history-note{
        margin-top:6px;
        color:#aaa;
        font-size:10px;
        line-height:1.45;
      }

      @media(max-width:380px){
        .mana-v922-effort{
          grid-template-columns:
            1fr
            1fr;
        }
      }
    `;

    document.head
      .appendChild(
        style
      );
  }

  function addFeedbackForm() {
    if (
      !workoutOpen() ||
      document.getElementById(
        FEEDBACK_ID
      )
    ) {
      return;
    }

    const complete =
      document.getElementById(
        "manaV64Complete"
      );

    if (
      !complete
    ) {
      return;
    }

    const wrap =
      document.createElement(
        "div"
      );

    wrap.id =
      FEEDBACK_ID;

    wrap.className =
      "mana-v922-feedback";

    wrap.innerHTML = `
      <div class="mana-v922-kicker">
        SESSION FEEDBACK
      </div>

      <div class="mana-v922-title">
        How did that session feel?
      </div>

      <div class="mana-v922-copy">
        Optional — save a quick effort rating
        and note with this workout.
      </div>

      <label
        class="mana-v922-label"
      >
        Session effort
      </label>

      <div
        class="mana-v922-effort"
        id="manaV922Effort"
      >
        <button
          type="button"
          data-v922-effort="Easy"
        >
          EASY
        </button>

        <button
          type="button"
          data-v922-effort="Solid"
        >
          SOLID
        </button>

        <button
          type="button"
          data-v922-effort="Hard"
        >
          HARD
        </button>

        <button
          type="button"
          data-v922-effort="Max"
        >
          MAX
        </button>
      </div>

      <label
        class="mana-v922-label"
        for="manaV922Note"
      >
        Workout note
      </label>

      <textarea
        id="manaV922Note"
        class="mana-v922-note"
        maxlength="500"
        placeholder="How did you feel? Anything to remember for next time?"
      ></textarea>
    `;

    complete
      .insertAdjacentElement(
        "beforebegin",
        wrap
      );

    wrap
      .querySelectorAll(
        "[data-v922-effort]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              wrap
                .querySelectorAll(
                  "[data-v922-effort]"
                )
                .forEach(
                  item => {

                    item
                      .classList
                      .remove(
                        "active"
                      );

                  }
                );

              button
                .classList
                .add(
                  "active"
                );

            }
          );

        }
      );
  }

  function readFeedback() {
    const effort =
      document.querySelector(
        "#manaV922Effort [data-v922-effort].active"
      )
      ?.dataset
      ?.v922Effort ||
      "";

    const note =
      document
        .getElementById(
          "manaV922Note"
        )
        ?.value
        ?.trim() ||
      "";

    return {
      effort,
      note
    };
  }

  function saveFeedbackToLatestLog() {
    if (
      !pendingFeedback
    ) {
      return;
    }

    const logs =
      loadLogs();

    if (
      !logs.length
    ) {
      return;
    }

    const last =
      logs[
        logs.length - 1
      ];

    if (
      !last
    ) {
      return;
    }

    last.sessionEffort =
      pendingFeedback.effort ||
      "";

    last.workoutNote =
      pendingFeedback.note ||
      "";

    saveLogs(
      logs
    );

    pendingFeedback =
      null;

    window.dispatchEvent(
      new CustomEvent(
        "mana:workout-feedback-saved"
      )
    );
  }

  function watchComplete() {
    document.addEventListener(
      "click",
      event => {

        if (
          !event.target.closest(
            "#manaV64Complete"
          )
        ) {
          return;
        }

        pendingFeedback =
          readFeedback();

      },
      true
    );

    window.addEventListener(
      "mana:strength-synced",
      () => {

        if (
          !pendingFeedback
        ) {
          return;
        }

        setTimeout(
          saveFeedbackToLatestLog,
          40
        );

      }
    );
  }

  function decorateProgressHistory() {
    if (
      !progressOpen()
    ) {
      return;
    }

    const rows =
      [
        ...document.querySelectorAll(
          ".mana-v9110-workout"
        )
      ];

    if (
      !rows.length
    ) {
      return;
    }

    const recent =
      loadLogs()
        .slice(
          -8
        )
        .reverse();

    rows.forEach(
      (
        row,
        index
      ) => {

        row
          .querySelector(
            ".mana-v922-history"
          )
          ?.remove();

        const log =
          recent[
            index
          ];

        if (
          !log
        ) {
          return;
        }

        const effort =
          String(
            log.sessionEffort ||
            ""
          ).trim();

        const note =
          String(
            log.workoutNote ||
            ""
          ).trim();

        if (
          !effort &&
          !note
        ) {
          return;
        }

        const extra =
          document.createElement(
            "div"
          );

        extra.className =
          "mana-v922-history";

        extra.innerHTML = `
          ${
            effort
              ? `
                <div
                  class="mana-v922-history-effort"
                >
                  ${esc(
                    effort
                  )} session
                </div>
              `
              : ""
          }

          ${
            note
              ? `
                <div
                  class="mana-v922-history-note"
                >
                  ${esc(
                    note
                  )}
                </div>
              `
              : ""
          }
        `;

        row.appendChild(
          extra
        );

      }
    );
  }

  function refresh() {
    if (
      workoutOpen()
    ) {
      addFeedbackForm();
    }

    if (
      progressOpen()
    ) {
      decorateProgressHistory();
    }
  }

  function queueRefresh(
    delay = 120
  ) {
    clearTimeout(
      feedbackRefreshTimer
    );

    feedbackRefreshTimer =
      setTimeout(
        refresh,
        delay
      );
  }

  function watchEvents() {
    [
      "mana:program-tab-change",
      "mana:strength-synced",
      "mana:workout-feedback-saved",
      "mana:workout-progress-change"
    ].forEach(
      eventName => {

        window.addEventListener(
          eventName,
          () => {
            queueRefresh(
              140
            );
          }
        );

      }
    );

    window.addEventListener(
      "pageshow",
      () => {
        queueRefresh(
          140
        );
      }
    );

    document.addEventListener(
      "visibilitychange",
      () => {

        if (
          document.visibilityState ===
          "visible"
        ) {
          queueRefresh(
            140
          );
        }

      }
    );
  }

  function init() {
    injectStyles();

    watchComplete();

    watchEvents();

    setTimeout(
      refresh,
      260
    );
  }

  window.refreshManaWorkoutFeedback =
    refresh;

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
