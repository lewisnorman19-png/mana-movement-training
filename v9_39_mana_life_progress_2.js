/* =========================================
   MANA MOVEMENT TRAINING v9.39.0
   MANA LIFE — PROGRESS 2.0

   PURPOSE:
   - Deepen the existing Progress tab
   - 7 / 30 day view toggle
   - Routine consistency
   - Daily Mana mood trend
   - Check-in consistency
   - Reset usage
   - Recent pattern summary

   STORAGE:
   - mana-life-v933-state

   STABILITY:
   - Progress tab only
   - Does NOT add anything to Overview
   - No MutationObserver
   - No database changes
   - Does not alter Mana Strength / Mana 28
   ========================================= */

(() => {
  "use strict";

  const BUILD = "93900";
  const STATE_KEY = "mana-life-v933-state";
  const STYLE_ID = "mana-v939-life-progress-style";
  const ROOT_ID = "manaV939Progress2";

  let rangeDays = 7;
  let refreshTimer = null;

  const ROUTINE_KEYS = [
    "bed",
    "water",
    "move",
    "food",
    "outside",
    "task",
    "connection",
    "phone"
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


  function dateKey(
    date = new Date()
  ) {
    const y =
      date.getFullYear();

    const m =
      String(
        date.getMonth() + 1
      )
        .padStart(
          2,
          "0"
        );

    const d =
      String(
        date.getDate()
      )
        .padStart(
          2,
          "0"
        );

    return `${y}-${m}-${d}`;
  }


  function dayOffsetKey(
    offset
  ) {
    const date =
      new Date();

    date.setDate(
      date.getDate() +
      offset
    );

    return dateKey(
      date
    );
  }


  function loadState() {
    const raw =
      safeJson(
        localStorage.getItem(
          STATE_KEY
        ) || "{}",
        {}
      );

    return {
      ...raw,

      days:
        raw.days &&
        typeof raw.days ===
          "object"
          ? raw.days
          : {},

      resets:
        Array.isArray(
          raw.resets
        )
          ? raw.resets
          : []
    };
  }


  function lifeProgressOpen() {
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
        "MANA LIFE" &&

      active
        ?.dataset
        ?.v83Tab ===
        "progress"
    );
  }


  function routineCount(
    day
  ) {
    const routine =
      day?.routine &&
      typeof day.routine ===
        "object"
        ? day.routine
        : {};

    return ROUTINE_KEYS
      .filter(
        key =>
          Boolean(
            routine[
              key
            ]
          )
      )
      .length;
  }


  function dailyMana(
    day
  ) {
    const daily =
      day?.dailyMana &&
      typeof day.dailyMana ===
        "object"
        ? day.dailyMana
        : {};

    return {
      completed:
        Boolean(
          daily.completed
        ),

      mood:
        Number(
          daily.mood ||
          day?.mood ||
          0
        ),

      focus:
        String(
          daily.focus ||
          ""
        ),

      gratitude:
        String(
          daily.gratitude ||
          ""
        ),

      intention:
        String(
          daily.intention ||
          ""
        )
    };
  }


  function rangeData(
    days
  ) {
    const state =
      loadState();

    const rows =
      [];


    for (
      let offset =
        -(days - 1);
      offset <= 0;
      offset += 1
    ) {

      const key =
        dayOffsetKey(
          offset
        );

      const day =
        state.days?.[
          key
        ] || {};

      const daily =
        dailyMana(
          day
        );

      const date =
        new Date(
          `${key}T12:00:00`
        );


      rows.push({
        key,
        date,

        routine:
          routineCount(
            day
          ),

        mood:
          daily.mood,

        checkedIn:
          daily.completed,

        focus:
          daily.focus,

        intention:
          daily.intention
      });
    }


    return rows;
  }


  function resetsInRange(
    days
  ) {
    const state =
      loadState();

    const cutoff =
      Date.now() -
      days *
      86400000;


    return state.resets
      .filter(
        item => {

          const time =
            new Date(
              item?.completed_at ||
              ""
            )
              .getTime();


          return (
            Number.isFinite(
              time
            ) &&
            time >=
              cutoff
          );
        }
      );
  }


  function pct(
    value,
    total
  ) {
    if (!total) {
      return 0;
    }

    return Math.round(
      (
        value /
        total
      ) *
      100
    );
  }


  function average(
    values
  ) {
    const clean =
      values.filter(
        value =>
          Number.isFinite(
            value
          ) &&
          value > 0
      );


    if (
      !clean.length
    ) {
      return null;
    }


    return clean.reduce(
      (
        sum,
        value
      ) =>
        sum +
        value,
      0
    ) /
    clean.length;
  }


  function trendLabel(
    rows
  ) {
    const moods =
      rows
        .map(
          item =>
            item.mood
        )
        .filter(
          value =>
            value > 0
        );


    if (
      moods.length <
      4
    ) {

      return "More check-ins will make this clearer.";
    }


    const split =
      Math.floor(
        moods.length /
        2
      );


    const first =
      average(
        moods.slice(
          0,
          split
        )
      );


    const second =
      average(
        moods.slice(
          split
        )
      );


    if (
      first == null ||
      second == null
    ) {

      return "More check-ins will make this clearer.";
    }


    const diff =
      second -
      first;


    if (
      diff >=
      0.5
    ) {

      return "Your recent mood trend is moving upward.";
    }


    if (
      diff <=
      -0.5
    ) {

      return "Your recent mood trend has dipped. Keep an eye on routine and recovery.";
    }


    return "Your mood trend is relatively steady.";
  }


  function consistencyLabel(
    routinePct,
    checkinPct
  ) {
    if (
      routinePct >=
        70 &&
      checkinPct >=
        70
    ) {

      return "You are building strong consistency across action and reflection.";
    }


    if (
      routinePct >=
        45 ||
      checkinPct >=
        45
    ) {

      return "You have a base forming. The next win is simply repeating it more often.";
    }


    return "Start small. One completed action and one honest check-in still count.";
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

      #${ROOT_ID}{
        margin:
          14px
          0
          0;
      }


      #${ROOT_ID}
      .mana-v939-range{
        display:grid;

        grid-template-columns:
          1fr
          1fr;

        gap:8px;

        margin-bottom:12px;
      }


      #${ROOT_ID}
      .mana-v939-range button{
        min-height:44px;

        border:
          1px solid
          #343434;

        border-radius:13px;

        background:#0b0b0b;

        color:#aaa;

        font-size:12px;
        font-weight:900;

        cursor:pointer;
      }


      #${ROOT_ID}
      .mana-v939-range button.active{
        border-color:#f3d875;

        background:#171407;

        color:#f3d875;
      }


      #${ROOT_ID}
      .mana-v939-card{
        margin:
          10px
          0;

        padding:18px;

        border:
          1px solid
          #3c351f;

        border-radius:20px;

        background:
          linear-gradient(
            145deg,
            #121006,
            #090909
          );
      }


      #${ROOT_ID}
      .mana-v939-kicker{
        color:#f3d875;

        font-size:10px;
        font-weight:900;

        letter-spacing:.1em;
      }


      #${ROOT_ID}
      h3{
        margin:
          6px
          0
          0;

        color:#fff;

        font-size:20px;
      }


      #${ROOT_ID}
      .mana-v939-copy{
        margin-top:7px;

        color:#a8a8a8;

        font-size:13px;

        line-height:1.6;
      }


      #${ROOT_ID}
      .mana-v939-stats{
        display:grid;

        grid-template-columns:
          repeat(
            2,
            minmax(
              0,
              1fr
            )
          );

        gap:9px;

        margin-top:14px;
      }


      #${ROOT_ID}
      .mana-v939-stat{
        padding:14px;

        border:
          1px solid
          #2d2d2d;

        border-radius:14px;

        background:#090909;
      }


      #${ROOT_ID}
      .mana-v939-stat span{
        display:block;

        color:#818181;

        font-size:9px;
        font-weight:900;

        text-transform:
          uppercase;
      }


      #${ROOT_ID}
      .mana-v939-stat strong{
        display:block;

        margin-top:5px;

        color:#f3d875;

        font-size:22px;
      }


      #${ROOT_ID}
      .mana-v939-bar-row{
        margin-top:14px;
      }


      #${ROOT_ID}
      .mana-v939-bar-head{
        display:flex;

        justify-content:
          space-between;

        gap:12px;

        color:#aaa;

        font-size:11px;
      }


      #${ROOT_ID}
      .mana-v939-bar-head strong{
        color:#fff;
      }


      #${ROOT_ID}
      .mana-v939-track{
        height:9px;

        margin-top:7px;

        overflow:hidden;

        border-radius:999px;

        background:#242424;
      }


      #${ROOT_ID}
      .mana-v939-fill{
        height:100%;

        border-radius:999px;

        background:#f3d875;
      }


      #${ROOT_ID}
      .mana-v939-mood-list{
        display:flex;

        align-items:flex-end;

        gap:5px;

        height:112px;

        margin-top:14px;
      }


      #${ROOT_ID}
      .mana-v939-mood-col{
        flex:1;

        min-width:0;

        text-align:center;
      }


      #${ROOT_ID}
      .mana-v939-mood-bar-wrap{
        height:82px;

        display:flex;

        align-items:flex-end;

        justify-content:center;
      }


      #${ROOT_ID}
      .mana-v939-mood-bar{
        width:
          min(
            18px,
            70%
          );

        min-height:4px;

        border-radius:
          999px
          999px
          4px
          4px;

        background:#f3d875;
      }


      #${ROOT_ID}
      .mana-v939-mood-col span{
        display:block;

        margin-top:6px;

        color:#777;

        font-size:8px;
        font-weight:900;
      }


      #${ROOT_ID}
      .mana-v939-insight{
        margin-top:12px;

        padding:14px;

        border-left:
          4px solid
          #f3d875;

        background:#0c0c0c;

        color:#c0c0c0;

        font-size:13px;

        line-height:1.6;
      }


      #${ROOT_ID}
      .mana-v939-recent{
        display:grid;

        gap:8px;

        margin-top:13px;
      }


      #${ROOT_ID}
      .mana-v939-recent-row{
        padding:12px;

        border:
          1px solid
          #292929;

        border-radius:13px;

        background:#090909;
      }


      #${ROOT_ID}
      .mana-v939-recent-row strong{
        display:block;

        color:#f3d875;

        font-size:11px;
      }


      #${ROOT_ID}
      .mana-v939-recent-row span{
        display:block;

        margin-top:4px;

        color:#999;

        font-size:11px;

        line-height:1.5;
      }


      @media(
        max-width:560px
      ){

        #${ROOT_ID}
        .mana-v939-card{
          padding:16px;
        }


        #${ROOT_ID}
        .mana-v939-stats{
          grid-template-columns:
            1fr
            1fr;
        }


        #${ROOT_ID}
        .mana-v939-mood-list{
          gap:3px;
        }


        #${ROOT_ID}
        .mana-v939-mood-col span{
          font-size:7px;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  function recentRows(
    rows
  ) {
    return [
      ...rows
    ]
      .reverse()
      .filter(
        item =>
          item.routine >
            0 ||
          item.checkedIn ||
          item.mood >
            0
      )
      .slice(
        0,
        4
      );
  }


  function render() {
    document
      .getElementById(
        ROOT_ID
      )
      ?.remove();


    if (
      !lifeProgressOpen()
    ) {
      return;
    }


    const root =
      document.getElementById(
        "manaV933Life"
      );


    if (!root) {
      return;
    }


    const rows =
      rangeData(
        rangeDays
      );


    const resets =
      resetsInRange(
        rangeDays
      );


    const routineDone =
      rows.reduce(
        (
          sum,
          item
        ) =>
          sum +
          item.routine,
        0
      );


    const routinePossible =
      rows.length *
      ROUTINE_KEYS.length;


    const routinePct =
      pct(
        routineDone,
        routinePossible
      );


    const checkins =
      rows.filter(
        item =>
          item.checkedIn
      )
        .length;


    const checkinPct =
      pct(
        checkins,
        rows.length
      );


    const moodAvg =
      average(
        rows.map(
          item =>
            item.mood
        )
      );


    const fullRoutineDays =
      rows.filter(
        item =>
          item.routine ===
          ROUTINE_KEYS.length
      )
        .length;


    const recent =
      recentRows(
        rows
      );


    const panel =
      document.createElement(
        "div"
      );


    panel.id =
      ROOT_ID;


    panel.innerHTML = `

      <div
        class="mana-v939-range"
      >

        <button
          type="button"
          data-v939-range="7"
          class="${
            rangeDays ===
            7
              ? "active"
              : ""
          }"
        >
          7 DAYS
        </button>


        <button
          type="button"
          data-v939-range="30"
          class="${
            rangeDays ===
            30
              ? "active"
              : ""
          }"
        >
          30 DAYS
        </button>

      </div>


      <div
        class="mana-v939-card"
      >

        <div
          class="mana-v939-kicker"
        >
          PROGRESS 2.0
        </div>


        <h3>
          Your pattern, not just one day
        </h3>


        <div
          class="mana-v939-copy"
        >
          See how routine, check-ins,
          mood and resets are moving together.
        </div>


        <div
          class="mana-v939-stats"
        >

          <div
            class="mana-v939-stat"
          >

            <span>
              Routine consistency
            </span>


            <strong>
              ${routinePct}%
            </strong>

          </div>


          <div
            class="mana-v939-stat"
          >

            <span>
              Daily Mana check-ins
            </span>


            <strong>
              ${checkins}/${rows.length}
            </strong>

          </div>


          <div
            class="mana-v939-stat"
          >

            <span>
              Average mood
            </span>


            <strong>
              ${
                moodAvg ==
                null
                  ? "—"
                  : moodAvg
                      .toFixed(
                        1
                      )
              }
            </strong>

          </div>


          <div
            class="mana-v939-stat"
          >

            <span>
              Resets completed
            </span>


            <strong>
              ${resets.length}
            </strong>

          </div>

        </div>


        <div
          class="mana-v939-insight"
        >
          ${esc(
            consistencyLabel(
              routinePct,
              checkinPct
            )
          )}
        </div>

      </div>


      <div
        class="mana-v939-card"
      >

        <div
          class="mana-v939-kicker"
        >
          CONSISTENCY
        </div>


        <h3>
          Action + reflection
        </h3>


        <div
          class="mana-v939-bar-row"
        >

          <div
            class="mana-v939-bar-head"
          >

            <strong>
              Routine
            </strong>


            <span>
              ${routineDone}/${routinePossible}
            </span>

          </div>


          <div
            class="mana-v939-track"
          >

            <div
              class="mana-v939-fill"
              style="width:${routinePct}%"
            ></div>

          </div>

        </div>


        <div
          class="mana-v939-bar-row"
        >

          <div
            class="mana-v939-bar-head"
          >

            <strong>
              Daily Mana
            </strong>


            <span>
              ${checkins}/${rows.length}
            </span>

          </div>


          <div
            class="mana-v939-track"
          >

            <div
              class="mana-v939-fill"
              style="width:${checkinPct}%"
            ></div>

          </div>

        </div>


        <div
          class="mana-v939-copy"
        >
          ${fullRoutineDays}
          full routine day${
            fullRoutineDays ===
            1
              ? ""
              : "s"
          }
          in this period.
        </div>

      </div>


      <div
        class="mana-v939-card"
      >

        <div
          class="mana-v939-kicker"
        >
          MOOD TREND
        </div>


        <h3>
          How the days are feeling
        </h3>


        <div
          class="mana-v939-mood-list"
        >

          ${rows
            .map(
              item => {

                const height =
                  item.mood >
                  0
                    ? Math.max(
                        8,
                        item.mood *
                        16
                      )
                    : 4;


                return `

                  <div
                    class="mana-v939-mood-col"
                  >

                    <div
                      class="mana-v939-mood-bar-wrap"
                    >

                      <div
                        class="mana-v939-mood-bar"
                        style="
                          height:${height}px;
                          opacity:${
                            item.mood >
                            0
                              ? 1
                              : .18
                          }
                        "
                        title="${esc(
                          item.key
                        )} • ${
                          item.mood ||
                          "No mood"
                        }"
                      ></div>

                    </div>


                    <span>
                      ${esc(
                        item.date
                          .toLocaleDateString(
                            undefined,
                            {
                              weekday:
                                "narrow"
                            }
                          )
                      )}
                    </span>

                  </div>

                `;
              }
            )
            .join("")}

        </div>


        <div
          class="mana-v939-insight"
        >
          ${esc(
            trendLabel(
              rows
            )
          )}
        </div>

      </div>


      <div
        class="mana-v939-card"
      >

        <div
          class="mana-v939-kicker"
        >
          RECENT EVIDENCE
        </div>


        <h3>
          What you've actually been doing
        </h3>


        <div
          class="mana-v939-recent"
        >

          ${
            recent.length
              ? recent
                  .map(
                    item => {

                      const dateLabel =
                        item.date
                          .toLocaleDateString(
                            undefined,
                            {
                              weekday:
                                "short",
                              day:
                                "numeric",
                              month:
                                "short"
                            }
                          );


                      const detail =
                        [
                          `${item.routine}/${ROUTINE_KEYS.length} routine actions`,

                          item.mood >
                            0
                            ? `mood ${item.mood}/5`
                            : "",

                          item.checkedIn
                            ? "Daily Mana saved"
                            : ""
                        ]
                          .filter(
                            Boolean
                          )
                          .join(
                            " • "
                          );


                      return `

                        <div
                          class="mana-v939-recent-row"
                        >

                          <strong>
                            ${esc(
                              dateLabel
                            )}
                          </strong>


                          <span>
                            ${esc(
                              detail
                            )}
                          </span>

                        </div>

                      `;
                    }
                  )
                  .join("")
              : `

                  <div
                    class="mana-v939-recent-row"
                  >

                    <strong>
                      No data yet
                    </strong>


                    <span>
                      Routine actions and
                      Daily Mana check-ins
                      will build this view.
                    </span>

                  </div>

                `
          }

        </div>

      </div>

    `;


    const dailyManaCard =
      document.getElementById(
        "manaV938DailyManaProgress"
      );


    if (
      dailyManaCard
    ) {

      dailyManaCard
        .insertAdjacentElement(
          "afterend",
          panel
        );

    } else {

      root.appendChild(
        panel
      );
    }


    panel
      .querySelectorAll(
        "[data-v939-range]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              rangeDays =
                Number(
                  button
                    .dataset
                    .v939Range ||
                  7
                ) ===
                30
                  ? 30
                  : 7;


              render();

            }
          );

        }
      );
  }


  function queueRender(
    delay = 100
  ) {
    clearTimeout(
      refreshTimer
    );


    refreshTimer =
      setTimeout(
        render,
        delay
      );
  }


  function init() {
    injectStyles();


    window.addEventListener(
      "mana:program-tab-change",
      () => {

        queueRender(
          100
        );

      }
    );


    window.addEventListener(
      "mana:life-updated",
      () => {

        queueRender(
          130
        );

      }
    );


    window.addEventListener(
      "focus",
      () => {

        queueRender(
          120
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

          queueRender(
            120
          );
        }

      }
    );


    queueRender(
      220
    );
  }


  window.MANA_LIFE_PROGRESS_2_BUILD =
    BUILD;


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
