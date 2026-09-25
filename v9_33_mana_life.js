/* =========================================
   MANA MOVEMENT TRAINING v9.33.0
   MANA LIFE — RECLAIM

   BUILDS:
   - Overview
   - Daily Routine
   - Reclaim tools
   - Progress
   - Learn

   STORAGE:
   - mana-life-v933-state

   DOES NOT ALTER:
   - Mana Strength
   - Mana 28
   - Fuel
   - Workout history
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "93300";

  const STATE_KEY =
    "mana-life-v933-state";

  const STYLE_ID =
    "mana-v933-life-style";

  const ROOT_ID =
    "manaV933Life";

  let renderTimer =
    null;

  const ROUTINE = [
    {
      key:"bed",
      title:"Make the bed",
      detail:
        "Start with one completed action."
    },
    {
      key:"water",
      title:"Hydrate",
      detail:
        "Get water in early."
    },
    {
      key:"move",
      title:"Move your body",
      detail:
        "Walk, train or do purposeful movement."
    },
    {
      key:"food",
      title:"Eat properly",
      detail:
        "Build the day around useful food, not emotion."
    },
    {
      key:"outside",
      title:"Get outside",
      detail:
        "Fresh air, daylight and a change of environment."
    },
    {
      key:"task",
      title:"Complete one important task",
      detail:
        "Do something that moves your life forward."
    },
    {
      key:"connection",
      title:"Connect with someone",
      detail:
        "A mate, family member or someone you trust."
    },
    {
      key:"phone",
      title:"Create phone space",
      detail:
        "Give yourself time without checking messages or socials."
    }
  ];

  const AFFIRMATIONS = [
    "I can miss someone and still move forward.",
    "My actions today matter more than the story in my head.",
    "I do not need every answer before I rebuild.",
    "I can feel deeply without abandoning myself.",
    "My dignity is protected by what I choose next.",
    "I am allowed to build a life that feels steady again.",
    "I do not chase clarity from people who cannot give it.",
    "Strength is returning to my own standards.",
    "I can carry the lesson without carrying the chaos.",
    "Today I choose movement, structure and purpose."
  ];

  const RECLAIM_TOOLS = [
    {
      title:
        "The 24-hour rule",

      body:
        "When emotion is high, avoid sending the message immediately. Write it, save it, move your body, sleep on it and decide again when you are calmer."
    },

    {
      title:
        "Control the controllables",

      body:
        "You cannot control another person's decision, interpretation or response. You can control your routine, your words, your training, your work and what you do next."
    },

    {
      title:
        "Stop reopening the wound",

      body:
        "Repeatedly checking messages, social media or old conversations can keep you locked into the same loop. Create deliberate periods where you do not check."
    },

    {
      title:
        "Rebuild evidence",

      body:
        "Confidence returns through evidence. Keep promises to yourself: train, eat properly, work, show up for your responsibilities and complete small tasks consistently."
    },

    {
      title:
        "Separate love from access",

      body:
        "You can care about somebody while still respecting distance, boundaries or the end of a relationship. Caring does not require constant contact."
    }
  ];

  const LEARN = [
    {
      title:
        "Structure before motivation",

      body:
        "Motivation changes from hour to hour. A simple routine gives you something to follow when your thinking is noisy. Build the day first and let motivation catch up."
    },

    {
      title:
        "Feelings are information",

      body:
        "A strong feeling can tell you something matters without automatically telling you what action to take. Give emotion time before turning it into a decision."
    },

    {
      title:
        "Identity follows repetition",

      body:
        "You rebuild identity by repeating behaviours that match the person you want to become. Training once matters less than becoming someone who trains consistently."
    },

    {
      title:
        "Connection matters",

      body:
        "Withdrawal can feel easier when life is difficult, but useful connection can restore perspective. Stay connected to people who are steady and constructive."
    },

    {
      title:
        "Progress is not linear",

      body:
        "A difficult day does not erase a better week. Measure the direction of your habits over time rather than judging yourself from one moment."
    }
  ];


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
    date
  ) {
    return [
      date.getFullYear(),
      String(
        date.getMonth() + 1
      ).padStart(
        2,
        "0"
      ),
      String(
        date.getDate()
      ).padStart(
        2,
        "0"
      )
    ].join("-");
  }


  function todayKey() {
    return dateKey(
      new Date()
    );
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

      notes:
        raw.notes &&
        typeof raw.notes ===
          "object"
          ? raw.notes
          : {}
    };
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
        "mana:life-updated"
      )
    );
  }


  function activeTab() {
    return (
      document
        .querySelector(
          "#manaV83Tabs .mana-v83-tab.active"
        )
        ?.dataset
        ?.v83Tab ||
      "overview"
    );
  }


  function lifeOpen() {
    const shell =
      document.getElementById(
        "manaV83ProgramShell"
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
        ?.trim()
        ?.toUpperCase() ===
        "MANA LIFE"
    );
  }


  function todayState(
    state
  ) {
    const data =
      state.days[
        todayKey()
      ] || {};

    return {
      routine:
        data.routine &&
        typeof data.routine ===
          "object"
          ? data.routine
          : {},

      mood:
        Number(
          data.mood ||
          0
        ),

      reflection:
        String(
          data.reflection ||
          ""
        )
    };
  }


  function completedRoutineCount(
    state,
    key = todayKey()
  ) {
    const routine =
      state
        .days?.[key]
        ?.routine ||
      {};

    return ROUTINE
      .filter(
        item =>
          Boolean(
            routine[
              item.key
            ]
          )
      )
      .length;
  }


  function routinePercent(
    state,
    key = todayKey()
  ) {
    return Math.round(
      completedRoutineCount(
        state,
        key
      ) /
      ROUTINE.length *
      100
    );
  }


  function activeDays(
    state,
    totalDays = 7
  ) {
    let count =
      0;

    for (
      let offset = 0;
      offset >
        -totalDays;
      offset -= 1
    ) {
      if (
        completedRoutineCount(
          state,
          dayOffsetKey(
            offset
          )
        ) > 0
      ) {
        count +=
          1;
      }
    }

    return count;
  }


  function currentStreak(
    state
  ) {
    let streak =
      0;

    for (
      let offset = 0;
      offset > -365;
      offset -= 1
    ) {
      const count =
        completedRoutineCount(
          state,
          dayOffsetKey(
            offset
          )
        );

      if (
        count > 0
      ) {
        streak +=
          1;

        continue;
      }

      /*
        Today may not have started yet.
        Do not kill an existing streak
        simply because today's routine
        is still empty.
      */

      if (
        offset === 0
      ) {
        continue;
      }

      break;
    }

    return streak;
  }


  function affirmationOfDay() {
    const now =
      new Date();

    const start =
      new Date(
        now.getFullYear(),
        0,
        0
      );

    const number =
      Math.floor(
        (
          now.getTime() -
          start.getTime()
        ) /
        86400000
      );

    return AFFIRMATIONS[
      number %
      AFFIRMATIONS.length
    ];
  }


  function goToTab(
    name
  ) {
    document
      .querySelector(
        `#manaV83Tabs [data-v83-tab="${name}"]`
      )
      ?.click();
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

      #${ROOT_ID}{
        width:100%;
        padding-bottom:30px;
      }


      .mana-v933-hero{
        margin-bottom:14px;
        padding:26px 21px;

        border:
          1px solid
          #5a4a18;

        border-radius:24px;

        background:
          radial-gradient(
            circle at 85% 10%,
            rgba(243,216,117,.12),
            transparent 34%
          ),
          linear-gradient(
            145deg,
            #1c1708,
            #090909
          );
      }


      .mana-v933-kicker{
        color:#f3d875;

        font-size:10px;
        font-weight:900;

        letter-spacing:.14em;

        text-transform:
          uppercase;
      }


      .mana-v933-hero h2{
        margin:
          7px
          0
          9px;

        color:#fff;

        font-size:
          clamp(
            30px,
            8vw,
            40px
          );

        line-height:1.05;
      }


      .mana-v933-hero p{
        margin:0;

        color:#aaa;

        font-size:13px;

        line-height:1.6;
      }


      .mana-v933-card{
        margin:
          14px
          0;

        padding:18px;

        border:
          1px solid
          #292929;

        border-radius:21px;

        background:#0d0d0d;
      }


      .mana-v933-card.gold{
        border-color:
          #5b4d1f;

        background:
          linear-gradient(
            145deg,
            #191609,
            #0a0a0a
          );
      }


      .mana-v933-card-head{
        display:flex;

        justify-content:
          space-between;

        align-items:
          flex-start;

        gap:12px;
      }


      .mana-v933-card h3{
        margin:
          5px
          0
          0;

        color:#fff;

        font-size:20px;
      }


      .mana-v933-card p{
        margin:
          8px
          0
          0;

        color:#aaa;

        font-size:12px;

        line-height:1.6;
      }


      .mana-v933-pill{
        flex:
          0
          0
          auto;

        display:
          inline-flex;

        align-items:
          center;

        min-height:28px;

        padding:
          0
          9px;

        border:
          1px solid
          #4f431b;

        border-radius:
          999px;

        background:
          #151207;

        color:
          #f3d875;

        font-size:9px;
        font-weight:900;
      }


      .mana-v933-affirmation{
        margin-top:15px;

        padding:17px;

        border-left:
          3px solid
          #f3d875;

        border-radius:
          0
          14px
          14px
          0;

        background:#100f09;
      }


      .mana-v933-affirmation span{
        display:block;

        color:#8e7e47;

        font-size:9px;
        font-weight:900;

        letter-spacing:.1em;
      }


      .mana-v933-affirmation strong{
        display:block;

        margin-top:7px;

        color:#f3d875;

        font-size:17px;

        line-height:1.45;
      }


      .mana-v933-progress-row{
        display:flex;

        justify-content:
          space-between;

        align-items:
          center;

        gap:12px;

        margin:
          14px
          0
          7px;
      }


      .mana-v933-progress-row strong{
        color:#f3d875;
        font-size:12px;
      }


      .mana-v933-progress-row span{
        color:#777;
        font-size:10px;
      }


      .mana-v933-track{
        width:100%;
        height:7px;

        overflow:hidden;

        border-radius:
          999px;

        background:#222;
      }


      .mana-v933-fill{
        height:100%;

        border-radius:
          999px;

        background:
          #f3d875;
      }


      .mana-v933-primary,
      .mana-v933-secondary{
        width:100%;

        min-height:52px;

        margin-top:13px;

        border-radius:15px;

        font-size:12px;
        font-weight:900;

        cursor:pointer;
      }


      .mana-v933-primary{
        border:0;

        background:
          #f3d875;

        color:#111;
      }


      .mana-v933-secondary{
        border:
          1px solid
          #4f431b;

        background:#111006;

        color:#f3d875;
      }


      .mana-v933-grid{
        display:grid;

        grid-template-columns:
          repeat(
            2,
            1fr
          );

        gap:10px;

        margin:
          14px
          0;
      }


      .mana-v933-stat{
        padding:15px;

        border:
          1px solid
          #292929;

        border-radius:18px;

        background:#0d0d0d;
      }


      .mana-v933-stat span{
        display:block;

        color:#888;

        font-size:9px;
        font-weight:900;

        text-transform:
          uppercase;
      }


      .mana-v933-stat strong{
        display:block;

        margin-top:6px;

        color:#f3d875;

        font-size:23px;
      }


      .mana-v933-routine{
        display:grid;

        gap:9px;

        margin-top:14px;
      }


      .mana-v933-routine-row{
        width:100%;

        min-height:68px;

        display:grid;

        grid-template-columns:
          38px
          minmax(
            0,
            1fr
          );

        gap:11px;

        align-items:center;

        padding:12px;

        border:
          1px solid
          #292929;

        border-radius:16px;

        background:#090909;

        color:#fff;

        text-align:left;

        cursor:pointer;
      }


      .mana-v933-routine-row.done{
        border-color:#57491c;

        background:
          linear-gradient(
            145deg,
            #171407,
            #090909
          );
      }


      .mana-v933-check{
        width:32px;
        height:32px;

        display:grid;
        place-items:center;

        border:
          2px solid
          #464646;

        border-radius:10px;

        font-weight:1000;
      }


      .mana-v933-routine-row.done
      .mana-v933-check{
        border-color:
          #f3d875;

        background:
          #f3d875;

        color:#111;
      }


      .mana-v933-routine-copy strong{
        display:block;

        font-size:12px;
      }


      .mana-v933-routine-copy small{
        display:block;

        margin-top:3px;

        color:#888;

        font-size:10px;

        line-height:1.4;
      }


      .mana-v933-textarea{
        width:100%;

        min-height:110px;

        margin-top:12px;

        padding:13px;

        border:
          1px solid
          #333;

        border-radius:14px;

        resize:vertical;

        background:#080808;

        color:#fff;

        font:inherit;

        line-height:1.55;
      }


      .mana-v933-moods{
        display:grid;

        grid-template-columns:
          repeat(
            5,
            1fr
          );

        gap:7px;

        margin-top:12px;
      }


      .mana-v933-mood{
        min-height:48px;

        border:
          1px solid
          #303030;

        border-radius:13px;

        background:#0a0a0a;

        color:#777;

        font-weight:900;

        cursor:pointer;
      }


      .mana-v933-mood.active{
        border-color:#f3d875;

        background:#171407;

        color:#f3d875;
      }


      .mana-v933-tool{
        margin-top:10px;

        overflow:hidden;

        border:
          1px solid
          #292929;

        border-radius:16px;

        background:#090909;
      }


      .mana-v933-tool-button{
        width:100%;

        min-height:58px;

        display:flex;

        justify-content:
          space-between;

        align-items:center;

        gap:12px;

        padding:13px;

        border:0;

        background:
          transparent;

        color:#fff;

        text-align:left;

        cursor:pointer;
      }


      .mana-v933-tool-button strong{
        font-size:12px;
      }


      .mana-v933-tool-button span{
        color:#f3d875;

        font-size:20px;
      }


      .mana-v933-tool-body{
        display:none;

        padding:
          0
          13px
          14px;

        color:#aaa;

        font-size:11px;

        line-height:1.65;
      }


      .mana-v933-tool.open
      .mana-v933-tool-body{
        display:block;
      }


      .mana-v933-tool.open
      .mana-v933-tool-button span{
        transform:
          rotate(
            180deg
          );
      }


      .mana-v933-prompt{
        margin-top:10px;

        padding:14px;

        border:
          1px solid
          #2c2c2c;

        border-radius:15px;

        background:#090909;
      }


      .mana-v933-prompt strong{
        display:block;

        color:#f3d875;

        font-size:11px;
      }


      .mana-v933-week{
        display:grid;

        grid-template-columns:
          repeat(
            7,
            1fr
          );

        gap:7px;

        margin-top:13px;
      }


      .mana-v933-day{
        min-height:58px;

        display:flex;

        flex-direction:
          column;

        justify-content:
          center;

        align-items:
          center;

        gap:4px;

        border:
          1px solid
          #2c2c2c;

        border-radius:13px;

        background:#090909;

        color:#666;

        font-size:9px;
        font-weight:900;
      }


      .mana-v933-day strong{
        font-size:14px;
      }


      .mana-v933-day.some{
        border-color:#55481d;

        color:#d5bd69;
      }


      .mana-v933-day.full{
        border-color:#f3d875;

        background:#191505;

        color:#f3d875;
      }


      .mana-v933-learn-item{
        margin-top:9px;

        overflow:hidden;

        border:
          1px solid
          #292929;

        border-radius:15px;

        background:#090909;
      }


      .mana-v933-learn-button{
        width:100%;

        min-height:58px;

        display:flex;

        justify-content:
          space-between;

        align-items:center;

        gap:12px;

        padding:14px;

        border:0;

        background:
          transparent;

        color:#fff;

        text-align:left;

        cursor:pointer;
      }


      .mana-v933-learn-button span{
        color:#f3d875;

        font-size:20px;
      }


      .mana-v933-learn-body{
        display:none;

        padding:
          0
          14px
          15px;

        color:#aaa;

        font-size:11px;

        line-height:1.65;
      }


      .mana-v933-learn-item.open
      .mana-v933-learn-body{
        display:block;
      }


      @media(
        max-width:390px
      ){

        .mana-v933-hero{
          padding:
            22px
            18px;
        }

      }

    `;

    document.head.appendChild(
      style
    );
  }


  /* =========================================
     OVERVIEW
     ========================================= */

  function overviewHtml(
    state
  ) {
    const done =
      completedRoutineCount(
        state
      );

    const percent =
      routinePercent(
        state
      );

    const day =
      todayState(
        state
      );

    return `

      <div
        id="${ROOT_ID}"
      >

        <div
          class="mana-v933-hero"
        >

          <div
            class="mana-v933-kicker"
          >
            MANA LIFE • RECLAIM
          </div>

          <h2>
            Build yourself forward.
          </h2>

          <p>
            Structure the day,
            protect your energy and
            rebuild momentum through action.
          </p>


          <div
            class="mana-v933-affirmation"
          >

            <span>
              TODAY'S AFFIRMATION
            </span>

            <strong>
              ${esc(
                affirmationOfDay()
              )}
            </strong>

          </div>

        </div>


        <div
          class="
            mana-v933-card
            gold
          "
        >

          <div
            class="mana-v933-card-head"
          >

            <div>

              <div
                class="mana-v933-kicker"
              >
                TODAY
              </div>

              <h3>
                Your Daily Routine
              </h3>

            </div>

            <span
              class="mana-v933-pill"
            >
              ${done}/${ROUTINE.length}
            </span>

          </div>


          <p>
            You do not need to solve
            everything today.
            Complete the next useful action.
          </p>


          <div
            class="mana-v933-progress-row"
          >

            <strong>
              ${done} complete
            </strong>

            <span>
              ${percent}%
            </span>

          </div>


          <div
            class="mana-v933-track"
          >

            <div
              class="mana-v933-fill"
              style="width:${percent}%"
            ></div>

          </div>


          <button
            type="button"
            class="mana-v933-primary"
            id="manaV933OpenRoutine"
          >
            OPEN TODAY'S ROUTINE →
          </button>

        </div>


        <div
          class="mana-v933-grid"
        >

          <div
            class="mana-v933-stat"
          >
            <span>
              Current streak
            </span>

            <strong>
              ${currentStreak(state)}
            </strong>
          </div>


          <div
            class="mana-v933-stat"
          >
            <span>
              Active days this week
            </span>

            <strong>
              ${activeDays(state,7)}/7
            </strong>
          </div>

        </div>


        <div
          class="mana-v933-card"
        >

          <div
            class="mana-v933-kicker"
          >
            RECLAIM
          </div>

          <h3>
            When your head gets noisy
          </h3>

          <p>
            Use Reclaim before reacting.
            Put the thought somewhere,
            separate what you can control
            and decide what action actually helps.
          </p>

          <button
            type="button"
            class="mana-v933-secondary"
            id="manaV933OpenReclaim"
          >
            OPEN RECLAIM →
          </button>

        </div>


        ${
          day.mood
            ? `

              <div
                class="mana-v933-card"
              >

                <div
                  class="mana-v933-kicker"
                >
                  TODAY'S CHECK-IN
                </div>

                <h3>
                  Mood ${day.mood}/5
                </h3>

                <p>
                  Measure the direction of
                  the week, not just one moment.
                </p>

              </div>

            `
            : ""
        }

      </div>

    `;
  }


  /* =========================================
     ROUTINE
     ========================================= */

  function routineHtml(
    state
  ) {
    const day =
      todayState(
        state
      );

    const done =
      completedRoutineCount(
        state
      );

    const percent =
      routinePercent(
        state
      );

    return `

      <div
        id="${ROOT_ID}"
      >

        <div
          class="mana-v933-hero"
        >

          <div
            class="mana-v933-kicker"
          >
            DAILY ROUTINE
          </div>

          <h2>
            Build the day first.
          </h2>

          <p>
            Tick the actions as you
            complete them.
            Consistency beats a perfect day.
          </p>


          <div
            class="mana-v933-progress-row"
          >

            <strong>
              ${done}/${ROUTINE.length} complete
            </strong>

            <span>
              ${percent}%
            </span>

          </div>


          <div
            class="mana-v933-track"
          >

            <div
              class="mana-v933-fill"
              style="width:${percent}%"
            ></div>

          </div>

        </div>


        <div
          class="mana-v933-card"
        >

          <div
            class="mana-v933-kicker"
          >
            TODAY'S ACTIONS
          </div>


          <div
            class="mana-v933-routine"
          >

            ${ROUTINE
              .map(
                item => {

                  const complete =
                    Boolean(
                      day
                        .routine[
                          item.key
                        ]
                    );

                  return `

                    <button
                      type="button"

                      class="
                        mana-v933-routine-row
                        ${
                          complete
                            ? "done"
                            : ""
                        }
                      "

                      data-v933-routine="${esc(
                        item.key
                      )}"
                    >

                      <span
                        class="mana-v933-check"
                      >
                        ${
                          complete
                            ? "✓"
                            : ""
                        }
                      </span>


                      <span
                        class="mana-v933-routine-copy"
                      >

                        <strong>
                          ${esc(
                            item.title
                          )}
                        </strong>

                        <small>
                          ${esc(
                            item.detail
                          )}
                        </small>

                      </span>

                    </button>

                  `;
                }
              )
              .join("")}

          </div>

        </div>


        <div
          class="mana-v933-card"
        >

          <div
            class="mana-v933-kicker"
          >
            DAILY CHECK-IN
          </div>

          <h3>
            How are you travelling?
          </h3>

          <p>
            1 = rough day.
            5 = feeling strong.
          </p>


          <div
            class="mana-v933-moods"
          >

            ${[
              1,
              2,
              3,
              4,
              5
            ]
              .map(
                value => `

                  <button
                    type="button"

                    class="
                      mana-v933-mood
                      ${
                        day.mood ===
                        value
                          ? "active"
                          : ""
                      }
                    "

                    data-v933-mood="${value}"
                  >
                    ${value}
                  </button>

                `
              )
              .join("")}

          </div>


          <textarea
            class="mana-v933-textarea"
            id="manaV933Reflection"
            placeholder="One thought from today..."
          >${esc(
            day.reflection
          )}</textarea>


          <button
            type="button"
            class="mana-v933-secondary"
            id="manaV933SaveReflection"
          >
            SAVE CHECK-IN
          </button>

        </div>

      </div>

    `;
  }


  /* =========================================
     RECLAIM
     ========================================= */

  function reclaimHtml(
    state
  ) {
    const saved =
      String(
        state
          .notes
          ?.reclaim ||
        ""
      );

    return `

      <div
        id="${ROOT_ID}"
      >

        <div
          class="mana-v933-hero"
        >

          <div
            class="mana-v933-kicker"
          >
            RECLAIM
          </div>

          <h2>
            Respond. Don't react.
          </h2>

          <p>
            Put the thought somewhere safe,
            identify what is actually in
            your control and choose the
            action that helps tomorrow.
          </p>

        </div>


        <div
          class="
            mana-v933-card
            gold
          "
        >

          <div
            class="mana-v933-kicker"
          >
            RIGHT NOW
          </div>

          <h3>
            Write it before you send it
          </h3>

          <p>
            Use this space for the message,
            thought or emotion that is looping.
            Saving it here does not send it anywhere.
          </p>


          <textarea
            class="mana-v933-textarea"
            id="manaV933ReclaimNote"
            placeholder="What do you want to say right now?"
          >${esc(
            saved
          )}</textarea>


          <button
            type="button"
            class="mana-v933-secondary"
            id="manaV933SaveReclaim"
          >
            SAVE PRIVATELY
          </button>

        </div>


        <div
          class="mana-v933-card"
        >

          <div
            class="mana-v933-kicker"
          >
            THREE QUESTIONS
          </div>


          <div
            class="mana-v933-prompt"
          >

            <strong>
              1. What am I feeling?
            </strong>

            <p>
              Name the emotion without
              immediately turning it
              into an action.
            </p>

          </div>


          <div
            class="mana-v933-prompt"
          >

            <strong>
              2. What can I control?
            </strong>

            <p>
              Your words, behaviour,
              routine, boundaries and
              what you do next.
            </p>

          </div>


          <div
            class="mana-v933-prompt"
          >

            <strong>
              3. What action helps tomorrow?
            </strong>

            <p>
              Choose the action that moves
              your life forward rather than
              simply relieving the emotion
              for five minutes.
            </p>

          </div>

        </div>


        <div
          class="mana-v933-card"
        >

          <div
            class="mana-v933-kicker"
          >
            RECLAIM TOOLS
          </div>


          ${RECLAIM_TOOLS
            .map(
              (
                item,
                index
              ) => `

                <div
                  class="mana-v933-tool"
                >

                  <button
                    type="button"
                    class="mana-v933-tool-button"
                    data-v933-tool-open="${index}"
                  >

                    <strong>
                      ${esc(
                        item.title
                      )}
                    </strong>

                    <span>
                      ⌄
                    </span>

                  </button>


                  <div
                    class="mana-v933-tool-body"
                  >
                    ${esc(
                      item.body
                    )}
                  </div>

                </div>

              `
            )
            .join("")}

        </div>

      </div>

    `;
  }


  /* =========================================
     PROGRESS
     ========================================= */

  function progressHtml(
    state
  ) {
    const week =
      [];

    for (
      let offset = -6;
      offset <= 0;
      offset += 1
    ) {
      const key =
        dayOffsetKey(
          offset
        );

      const count =
        completedRoutineCount(
          state,
          key
        );

      const date =
        new Date(
          `${key}T12:00:00`
        );

      week.push({
        key,
        count,

        label:
          date
            .toLocaleDateString(
              undefined,
              {
                weekday:
                  "short"
              }
            )
      });
    }


    const fullDays =
      week
        .filter(
          item =>
            item.count ===
            ROUTINE.length
        )
        .length;


    const totalActions =
      week
        .reduce(
          (
            total,
            item
          ) =>
            total +
            item.count,
          0
        );


    return `

      <div
        id="${ROOT_ID}"
      >

        <div
          class="mana-v933-hero"
        >

          <div
            class="mana-v933-kicker"
          >
            MANA LIFE PROGRESS
          </div>

          <h2>
            Build evidence.
          </h2>

          <p>
            Progress is the pattern
            of useful actions you
            keep repeating.
          </p>

        </div>


        <div
          class="mana-v933-grid"
        >

          <div
            class="mana-v933-stat"
          >

            <span>
              Current streak
            </span>

            <strong>
              ${currentStreak(
                state
              )}
            </strong>

          </div>


          <div
            class="mana-v933-stat"
          >

            <span>
              Active days
            </span>

            <strong>
              ${activeDays(
                state,
                7
              )}/7
            </strong>

          </div>


          <div
            class="mana-v933-stat"
          >

            <span>
              Full routine days
            </span>

            <strong>
              ${fullDays}
            </strong>

          </div>


          <div
            class="mana-v933-stat"
          >

            <span>
              Actions this week
            </span>

            <strong>
              ${totalActions}
            </strong>

          </div>

        </div>


        <div
          class="mana-v933-card"
        >

          <div
            class="mana-v933-kicker"
          >
            LAST 7 DAYS
          </div>


          <div
            class="mana-v933-week"
          >

            ${week
              .map(
                item => `

                  <div
                    class="
                      mana-v933-day

                      ${
                        item.count ===
                        ROUTINE.length
                          ? "full"
                          : item.count > 0
                            ? "some"
                            : ""
                      }
                    "
                  >

                    <span>
                      ${esc(
                        item.label
                      )}
                    </span>

                    <strong>
                      ${item.count}
                    </strong>

                  </div>

                `
              )
              .join("")}

          </div>


          <p>
            Each number is the amount
            of routine actions completed
            on that day.
          </p>

        </div>


        <div
          class="mana-v933-card"
        >

          <div
            class="mana-v933-kicker"
          >
            THE MEASURE
          </div>

          <h3>
            Direction over perfection
          </h3>

          <p>
            A missed day does not erase
            your progress. Come back to
            the routine and build the next
            piece of evidence.
          </p>

        </div>

      </div>

    `;
  }


  /* =========================================
     LEARN
     ========================================= */

  function learnHtml() {
    return `

      <div
        id="${ROOT_ID}"
      >

        <div
          class="mana-v933-hero"
        >

          <div
            class="mana-v933-kicker"
          >
            LEARN
          </div>

          <h2>
            Rebuild with purpose.
          </h2>

          <p>
            Simple principles for keeping
            your thinking, routines and decisions
            moving in a useful direction.
          </p>

        </div>


        <div
          class="mana-v933-card"
        >

          ${LEARN
            .map(
              (
                item,
                index
              ) => `

                <div
                  class="mana-v933-learn-item"
                >

                  <button
                    type="button"
                    class="mana-v933-learn-button"
                    data-v933-learn-open="${index}"
                  >

                    <strong>
                      ${esc(
                        item.title
                      )}
                    </strong>

                    <span>
                      ⌄
                    </span>

                  </button>


                  <div
                    class="mana-v933-learn-body"
                  >
                    ${esc(
                      item.body
                    )}
                  </div>

                </div>

              `
            )
            .join("")}

        </div>

      </div>

    `;
  }


  /* =========================================
     WIRING
     ========================================= */

  function wireOverview() {
    document
      .getElementById(
        "manaV933OpenRoutine"
      )
      ?.addEventListener(
        "click",
        () => {
          goToTab(
            "routine"
          );
        }
      );


    document
      .getElementById(
        "manaV933OpenReclaim"
      )
      ?.addEventListener(
        "click",
        () => {
          goToTab(
            "reclaim"
          );
        }
      );
  }


  function wireRoutine() {
    document
      .querySelectorAll(
        "[data-v933-routine]"
      )
      .forEach(
        button => {

          button
            .addEventListener(
              "click",
              () => {

                const state =
                  loadState();

                const key =
                  todayKey();


                state.days[key] =
                  state.days[key] ||
                  {};


                state
                  .days[key]
                  .routine =
                  state
                    .days[key]
                    .routine ||
                  {};


                const itemKey =
                  button
                    .dataset
                    .v933Routine;


                state
                  .days[key]
                  .routine[
                    itemKey
                  ] =
                  !state
                    .days[key]
                    .routine[
                      itemKey
                    ];


                saveState(
                  state
                );


                render();

              }
            );

        }
      );


    document
      .querySelectorAll(
        "[data-v933-mood]"
      )
      .forEach(
        button => {

          button
            .addEventListener(
              "click",
              () => {

                const state =
                  loadState();

                const key =
                  todayKey();


                state.days[key] =
                  state.days[key] ||
                  {};


                state
                  .days[key]
                  .mood =
                  Number(
                    button
                      .dataset
                      .v933Mood
                  );


                saveState(
                  state
                );


                render();

              }
            );

        }
      );


    document
      .getElementById(
        "manaV933SaveReflection"
      )
      ?.addEventListener(
        "click",
        () => {

          const state =
            loadState();

          const key =
            todayKey();


          state.days[key] =
            state.days[key] ||
            {};


          state
            .days[key]
            .reflection =
            document
              .getElementById(
                "manaV933Reflection"
              )
              ?.value
              ?.trim() ||
            "";


          saveState(
            state
          );


          alert(
            "Check-in saved."
          );

        }
      );
  }


  function wireReclaim() {
    document
      .getElementById(
        "manaV933SaveReclaim"
      )
      ?.addEventListener(
        "click",
        () => {

          const state =
            loadState();


          state.notes =
            state.notes ||
            {};


          state
            .notes
            .reclaim =
            document
              .getElementById(
                "manaV933ReclaimNote"
              )
              ?.value ||
            "";


          saveState(
            state
          );


          alert(
            "Saved privately on this device."
          );

        }
      );


    document
      .querySelectorAll(
        "[data-v933-tool-open]"
      )
      .forEach(
        button => {

          button
            .addEventListener(
              "click",
              () => {

                button
                  .closest(
                    ".mana-v933-tool"
                  )
                  ?.classList
                  .toggle(
                    "open"
                  );

              }
            );

        }
      );
  }


  function wireLearn() {
    document
      .querySelectorAll(
        "[data-v933-learn-open]"
      )
      .forEach(
        button => {

          button
            .addEventListener(
              "click",
              () => {

                button
                  .closest(
                    ".mana-v933-learn-item"
                  )
                  ?.classList
                  .toggle(
                    "open"
                  );

              }
            );

        }
      );
  }


  /* =========================================
     RENDER
     ========================================= */

  function render() {
    if (
      !lifeOpen()
    ) {
      return;
    }


    const holder =
      document.getElementById(
        "manaV83Content"
      );


    if (!holder) {
      return;
    }


    const state =
      loadState();


    const tab =
      activeTab();


    if (
      tab ===
      "routine"
    ) {

      holder.innerHTML =
        routineHtml(
          state
        );


      wireRoutine();

      return;
    }


    if (
      tab ===
      "reclaim"
    ) {

      holder.innerHTML =
        reclaimHtml(
          state
        );


      wireReclaim();

      return;
    }


    if (
      tab ===
      "progress"
    ) {

      holder.innerHTML =
        progressHtml(
          state
        );


      return;
    }


    if (
      tab ===
      "learn"
    ) {

      holder.innerHTML =
        learnHtml();


      wireLearn();

      return;
    }


    holder.innerHTML =
      overviewHtml(
        state
      );


    wireOverview();
  }


  function scheduleRender(
    delay = 20
  ) {
    clearTimeout(
      renderTimer
    );


    renderTimer =
      setTimeout(
        render,
        delay
      );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {
    injectStyles();


    window.addEventListener(
      "mana:program-tab-change",
      () => {

        scheduleRender(
          10
        );

      }
    );


    window.addEventListener(
      "mana:life-updated",
      () => {

        scheduleRender(
          20
        );

      }
    );


    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "#manaV80Life"
          )
        ) {

          setTimeout(
            render,
            80
          );

        }

      },
      true
    );


    if (
      lifeOpen()
    ) {
      render();
    }
  }


  window.renderManaLife =
    render;


  window.MANA_LIFE_BUILD =
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
