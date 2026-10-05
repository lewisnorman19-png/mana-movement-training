/* =========================================
   MANA MOVEMENT TRAINING v9.84.0
   MANA LYFE — CONTENT + PROGRESS

   OWNS ONLY:
   - RECLAIM
   - PROGRESS
   - LEARN

   DOES NOT OWN:
   - OVERVIEW  -> v9.78
   - WORKOUTS  -> v9.80

   PROGRESS:
   - DAILY
   - WEEKLY
   - MONTHLY
   - TO DATE

   LYFE METRICS:
   - SESSIONS
   - DAILY ACTIONS
   - ACTIVE DAYS
   - CHECK-INS
   - MOOD

   REUSES LEGACY SAVED STATE:
   mana-life-v933-state

   WORKOUT STATE:
   mana-v973-lyfe-state
   ========================================= */

(() => {
  "use strict";

  const BUILD = "98400";

  const STYLE_ID =
    "mana-v984-lyfe-style";

  const LIFE_KEY =
    "mana-life-v933-state";

  const PROGRAM_KEY =
    "mana-v973-lyfe-state";

  const ROUTINE = [
    {
      key:"bed",
      title:"Make the bed",
      detail:"Start with one completed action."
    },
    {
      key:"water",
      title:"Hydrate",
      detail:"Get water in early."
    },
    {
      key:"move",
      title:"Move your body",
      detail:"Walk, train or do purposeful movement."
    },
    {
      key:"food",
      title:"Eat properly",
      detail:"Build the day around useful food, not emotion."
    },
    {
      key:"outside",
      title:"Get outside",
      detail:"Fresh air, daylight and a change of environment."
    },
    {
      key:"task",
      title:"Complete one important task",
      detail:"Do something that moves your life forward."
    },
    {
      key:"connection",
      title:"Connect with someone",
      detail:"A mate, family member or someone you trust."
    },
    {
      key:"phone",
      title:"Create phone space",
      detail:"Give yourself time without checking messages or socials."
    }
  ];


  const AFFIRMATIONS = [
    "I can miss someone and still move forward.",
    "My actions today matter more than the story in my head.",
    "I do not need every answer before I rebuild.",
    "I can feel deeply without abandoning myself.",
    "My dignity is protected by what I choose next.",
    "I am allowed to build a life that feels steady again.",
    "Strength is returning to my own standards.",
    "I can carry the lesson without carrying the chaos.",
    "Today I choose movement, structure and purpose."
  ];


  const WHAKATAUKI = {

    reclaim:{
      maori:
        "Titiro whakamuri, kōkiri whakamua.",
      english:
        "Look back and reflect so you can move forward."
    },

    progress:{
      maori:
        "Iti noa ana, he pito mata.",
      english:
        "Small beginnings can hold great potential."
    },

    learn:{
      maori:
        "Mā te kimi ka kite, mā te kite ka mōhio, mā te mōhio ka mārama.",
      english:
        "Through seeking comes discovery; through discovery comes knowing; through knowing comes understanding."
    }

  };


  const RECLAIM_TOOLS = [

    {
      title:"The 24-hour rule",
      body:
        "When emotion is high, avoid sending the message immediately. Write it, save it, move your body, sleep on it and decide again when you are calmer."
    },

    {
      title:"Control the controllables",
      body:
        "You cannot control another person's decision, interpretation or response. You can control your routine, your words, your training, your work and what you do next."
    },

    {
      title:"Stop reopening the wound",
      body:
        "Repeatedly checking messages, social media or old conversations can keep you locked into the same loop. Create deliberate periods where you do not check."
    },

    {
      title:"Rebuild evidence",
      body:
        "Confidence returns through evidence. Keep promises to yourself: train, eat properly, work, show up for your responsibilities and complete small tasks consistently."
    },

    {
      title:"Separate love from access",
      body:
        "You can care about somebody while still respecting distance, boundaries or the end of a relationship. Caring does not require constant contact."
    }

  ];


  const LEARN = [

    {
      title:"Structure before motivation",
      body:
        "Motivation changes from hour to hour. A simple routine gives you something to follow when your thinking is noisy. Build the day first and let motivation catch up."
    },

    {
      title:"Feelings are information",
      body:
        "A strong feeling can tell you something matters without automatically telling you what action to take. Give emotion time before turning it into a decision."
    },

    {
      title:"Identity follows repetition",
      body:
        "You rebuild identity by repeating behaviours that match the person you want to become. Training once matters less than becoming someone who trains consistently."
    },

    {
      title:"Connection matters",
      body:
        "Withdrawal can feel easier when life is difficult, but useful connection can restore perspective. Stay connected to people who are steady and constructive."
    },

    {
      title:"Progress is not linear",
      body:
        "A difficult day does not erase a better week. Measure the direction of your habits over time rather than judging yourself from one moment."
    }

  ];


  const PHRASES = [

    {
      maori:"Kia ora",
      english:
        "Hello / thank you / an expression of goodwill."
    },

    {
      maori:"Kei te pēhea koe?",
      english:"How are you?"
    },

    {
      maori:"Kei te pai ahau.",
      english:"I am good / I am well."
    },

    {
      maori:"Ngā mihi",
      english:
        "Greetings / thanks / acknowledgements."
    },

    {
      maori:"Kia pai tō rā.",
      english:"Have a good day."
    },

    {
      maori:"Ka kite anō.",
      english:"See you again."
    },

    {
      maori:"Kia kaha.",
      english:"Be strong / stay strong."
    },

    {
      maori:"Kia manawanui.",
      english:"Be patient / be steadfast."
    }

  ];


  let selectedPeriod =
    "daily";


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
      );

  }


  function clamp(
    value
  ) {

    return Math.max(
      0,
      Math.min(
        100,
        Math.round(
          Number(
            value || 0
          )
        )
      )
    );

  }


  function holder() {

    return document.getElementById(
      "manaV83Content"
    );

  }


  function shell() {

    return document.getElementById(
      "manaV83ProgramShell"
    );

  }


  function title() {

    return (
      document
        .getElementById(
          "manaV83Title"
        )
        ?.textContent
        ?.trim()
        ?.toUpperCase()
      || ""
    );

  }


  function activeTab() {

    return (
      document
        .querySelector(
          "#manaV83Tabs .mana-v83-tab.active"
        )
        ?.dataset
        ?.v83Tab
      || ""
    );

  }


  function lyfeOpen() {

    return Boolean(

      shell()
        ?.classList
        .contains(
          "open"
        )

      &&

      (
        title()
          .startsWith(
            "MANA LYFE"
          )
        ||
        title()
          .startsWith(
            "MANA LIFE"
          )
      )

    );

  }


  function ownedTab() {

    return [
      "reclaim",
      "progress",
      "learn"
    ]
      .includes(
        activeTab()
      );

  }


  function startOfDay(
    input
  ) {

    const d =
      new Date(
        input
      );

    d.setHours(
      0,
      0,
      0,
      0
    );

    return d;

  }


  function endOfDay(
    input
  ) {

    const d =
      new Date(
        input
      );

    d.setHours(
      23,
      59,
      59,
      999
    );

    return d;

  }


  function addDays(
    input,
    amount
  ) {

    const d =
      startOfDay(
        input
      );

    d.setDate(
      d.getDate() +
      amount
    );

    return d;

  }


  function dateKey(
    input
  ) {

    const d =
      new Date(
        input
      );

    return [
      d.getFullYear(),
      String(
        d.getMonth() + 1
      ).padStart(2,"0"),
      String(
        d.getDate()
      ).padStart(2,"0")
    ].join("-");

  }


  function shortDate(
    input
  ) {

    return new Date(
      input
    )
      .toLocaleDateString(
        undefined,
        {
          day:"numeric",
          month:"short"
        }
      );

  }


  function datesBetween(
    start,
    end
  ) {

    const dates = [];

    let cursor =
      startOfDay(
        start
      );

    const finish =
      startOfDay(
        end
      );

    let guard =
      0;


    while (
      cursor <= finish &&
      guard < 370
    ) {

      dates.push(
        dateKey(
          cursor
        )
      );

      cursor =
        addDays(
          cursor,
          1
        );

      guard += 1;

    }


    return dates;

  }


  function affirmationOfDay() {

    const today =
      Math.floor(
        Date.now() /
        86400000
      );

    return AFFIRMATIONS[
      today %
      AFFIRMATIONS.length
    ];

  }


  /* =========================================
     STORES
     ========================================= */

  function loadLife() {

    const raw =
      safeJson(
        localStorage.getItem(
          LIFE_KEY
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


  function saveLife(
    state
  ) {

    localStorage.setItem(
      LIFE_KEY,
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


  function loadProgram() {

    const state =
      safeJson(
        localStorage.getItem(
          PROGRAM_KEY
        ) || "{}",
        {}
      );


    if (
      !Array.isArray(
        state.completed
      )
    ) {

      state.completed =
        [];

    }


    return state;

  }


  /* =========================================
     PROGRAM DATES
     ========================================= */

  function completionRecords(
    state
  ) {

    return state.completed
      .map(
        day => {

          const data =
            state[
              `day${day}`
            ] || {};


          const raw =
            data.completedAt
            ||
            data.date
            ||
            null;


          const parsed =
            raw
              ? new Date(raw)
              : null;


          return {

            day:
              Number(day),

            date:
              parsed &&
              !Number.isNaN(
                parsed.getTime()
              )
                ? parsed
                : null

          };

        }
      );

  }


  function programStart(
    state
  ) {

    if (
      state.startedAt
    ) {

      const d =
        new Date(
          state.startedAt
        );


      if (
        !Number.isNaN(
          d.getTime()
        )
      ) {

        return startOfDay(
          d
        );

      }

    }


    const inferred = [];


    completionRecords(
      state
    )
      .forEach(
        record => {

          if (
            record.date
          ) {

            inferred.push(
              addDays(
                record.date,
                -(
                  record.day - 1
                )
              )
            );

          }

        }
      );


    if (
      inferred.length
    ) {

      inferred.sort(
        (a,b) =>
          a.getTime() -
          b.getTime()
      );


      return startOfDay(
        inferred[0]
      );

    }


    return startOfDay(
      new Date()
    );

  }


  /* =========================================
     PROGRESS RANGE
     ========================================= */

  function progressRange(
    start
  ) {

    const today =
      startOfDay(
        new Date()
      );


    if (
      selectedPeriod ===
      "daily"
    ) {

      return {

        start:today,

        end:today,

        sessionTarget:1,

        label:"TODAY",

        detail:
          shortDate(
            today
          )

      };

    }


    if (
      selectedPeriod ===
      "weekly"
    ) {

      const elapsed =
        Math.max(
          0,
          Math.floor(
            (
              today -
              start
            )
            /
            86400000
          )
        );


      const weekIndex =
        Math.max(
          0,
          Math.min(
            3,
            Math.floor(
              elapsed /
              7
            )
          )
        );


      const weekStart =
        addDays(
          start,
          weekIndex * 7
        );


      return {

        start:
          weekStart,

        end:
          addDays(
            weekStart,
            6
          ),

        sessionTarget:
          7,

        label:
          `WEEK ${weekIndex + 1}`,

        detail:
          `${shortDate(
            weekStart
          )} – ${shortDate(
            addDays(
              weekStart,
              6
            )
          )}`

      };

    }


    if (
      selectedPeriod ===
      "monthly"
    ) {

      const monthStart =
        new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );


      const monthEnd =
        new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        );


      const programEnd =
        addDays(
          start,
          27
        );


      const rangeStart =
        monthStart > start
          ? monthStart
          : start;


      const rangeEnd =
        monthEnd < programEnd
          ? monthEnd
          : programEnd;


      const target =
        rangeStart <= rangeEnd
          ? Math.floor(
              (
                startOfDay(rangeEnd) -
                startOfDay(rangeStart)
              )
              /
              86400000
            ) + 1
          : 0;


      return {

        start:
          rangeStart,

        end:
          rangeEnd,

        sessionTarget:
          target,

        label:
          today
            .toLocaleDateString(
              undefined,
              {
                month:"long"
              }
            )
            .toUpperCase(),

        detail:
          `${target} Lyfe days`

      };

    }


    const programEnd =
      addDays(
        start,
        27
      );


    const end =
      today <
      programEnd
        ? today
        : programEnd;


    const target =
      Math.max(
        1,
        Math.min(
          28,
          Math.floor(
            (
              end -
              start
            )
            /
            86400000
          ) + 1
        )
      );


    return {

      start,

      end,

      sessionTarget:
        target,

      label:
        "TO DATE",

      detail:
        `${target} Lyfe days elapsed`

    };

  }


  /* =========================================
     LYFE DAILY DATA
     ========================================= */

  function routineCount(
    state,
    key
  ) {

    const routine =
      state.days
        ?.[key]
        ?.routine || {};


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


  function hasCheckin(
    state,
    key
  ) {

    const day =
      state.days
        ?.[key] || {};


    return Boolean(
      Number(
        day.mood || 0
      )
      ||
      String(
        day.reflection || ""
      ).trim()
    );

  }


  /* =========================================
     PROGRESS METRICS
     ========================================= */

  function progressMetrics() {

    const program =
      loadProgram();


    const life =
      loadLife();


    const start =
      programStart(
        program
      );


    const range =
      progressRange(
        start
      );


    const today =
      startOfDay(
        new Date()
      );


    const dataEnd =
      range.end > today
        ? today
        : range.end;


    const dates =
      range.start <= dataEnd
        ? datesBetween(
            range.start,
            dataEnd
          )
        : [];


    const completedSessions =
      completionRecords(
        program
      )
        .filter(
          record => {

            const scheduled =
              addDays(
                start,
                record.day - 1
              );


            return (
              scheduled >=
                range.start
              &&
              scheduled <=
                range.end
            );

          }
        )
        .length;


    const sessionsPercent =
      range.sessionTarget > 0

        ? clamp(
            completedSessions /
            range.sessionTarget *
            100
          )

        : 0;


    let totalActions =
      0;

    let activeDays =
      0;

    let checkins =
      0;

    let moodTotal =
      0;

    let moodDays =
      0;


    dates.forEach(
      key => {

        const actionCount =
          routineCount(
            life,
            key
          );


        totalActions +=
          actionCount;


        if (
          actionCount > 0
        ) {

          activeDays +=
            1;

        }


        if (
          hasCheckin(
            life,
            key
          )
        ) {

          checkins +=
            1;

        }


        const mood =
          Number(
            life.days
              ?.[key]
              ?.mood || 0
          );


        if (
          mood > 0
        ) {

          moodTotal +=
            mood;

          moodDays +=
            1;

        }

      }
    );


    const dayCount =
      Math.max(
        1,
        dates.length
      );


    const actionTarget =
      dayCount *
      ROUTINE.length;


    return {

      range,

      sessions:{

        count:
          completedSessions,

        target:
          range.sessionTarget,

        percent:
          sessionsPercent

      },


      actions:{

        count:
          totalActions,

        target:
          actionTarget,

        percent:
          actionTarget > 0
            ? clamp(
                totalActions /
                actionTarget *
                100
              )
            : 0

      },


      active:{

        count:
          activeDays,

        target:
          dayCount,

        percent:
          clamp(
            activeDays /
            dayCount *
            100
          )

      },


      checkins:{

        count:
          checkins,

        target:
          dayCount,

        percent:
          clamp(
            checkins /
            dayCount *
            100
          )

      },


      mood:{

        average:
          moodDays
            ? (
                moodTotal /
                moodDays
              )
            : 0,

        percent:
          moodDays
            ? clamp(
                (
                  moodTotal /
                  moodDays
                )
                /
                5 *
                100
              )
            : 0,

        days:
          moodDays

      }

    };

  }


  /* =========================================
     SHARED HTML
     ========================================= */

  function whakatauki(
    tab
  ) {

    const item =
      WHAKATAUKI[
        tab
      ];


    return `

      <div
        class="mana-v984-whakatauki"
      >

        <div
          class="mana-v984-small-label"
        >
          WHAKATAUKĪ
        </div>


        <strong>
          ${esc(
            item.maori
          )}
        </strong>


        <span>
          ${esc(
            item.english
          )}
        </span>

      </div>

    `;

  }


  function progressCard(
    icon,
    title,
    percent,
    text,
    wide = false
  ) {

    return `

      <div
        class="
          mana-v984-progress-card
          ${wide ? "wide" : ""}
        "
      >

        <div
          class="mana-v984-card-head"
        >

          <div
            class="mana-v984-icon"
          >
            ${icon}
          </div>


          <div
            class="mana-v984-card-label"
          >
            ${title}
          </div>

        </div>


        <div
          class="mana-v984-percent"
        >
          ${percent}%
        </div>


        <div
          class="mana-v984-card-copy"
        >
          ${text}
        </div>


        <div
          class="mana-v984-track"
        >

          <span
            style="
              width:${percent}%
            "
          ></span>

        </div>

      </div>

    `;

  }


  /* =========================================
     RECLAIM
     ========================================= */

  function reclaimHtml() {

    const state =
      loadLife();


    const saved =
      String(
        state.notes
          ?.reclaim || ""
      );


    return `

      <div
        class="mana-v984-root"
      >

        <div
          class="mana-v984-hero"
        >

          <div
            class="mana-v984-kicker"
          >
            MANA LYFE • RECLAIM
          </div>


          <h2>
            Respond. Don't react.
          </h2>


          <p>
            Put the thought somewhere safe,
            identify what is actually in your
            control and choose the action that
            helps tomorrow.
          </p>

        </div>


        ${whakatauki(
          "reclaim"
        )}


        <div
          class="
            mana-v984-panel
            gold
          "
        >

          <div
            class="mana-v984-small-label"
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
            id="manaV984ReclaimNote"
            class="mana-v984-textarea"
            placeholder="What do you want to say right now?"
          >${esc(saved)}</textarea>


          <button
            type="button"
            class="mana-v984-action"
            id="manaV984SaveReclaim"
          >
            SAVE PRIVATELY
          </button>

        </div>


        <div
          class="mana-v984-panel"
        >

          <div
            class="mana-v984-small-label"
          >
            THREE QUESTIONS
          </div>


          <div
            class="mana-v984-prompt"
          >
            <strong>
              1. What am I feeling?
            </strong>

            <p>
              Name the emotion without immediately
              turning it into an action.
            </p>
          </div>


          <div
            class="mana-v984-prompt"
          >
            <strong>
              2. What can I control?
            </strong>

            <p>
              Your words, behaviour, routine,
              boundaries and what you do next.
            </p>
          </div>


          <div
            class="mana-v984-prompt"
          >
            <strong>
              3. What action helps tomorrow?
            </strong>

            <p>
              Choose the action that moves your life
              forward rather than simply relieving
              the emotion for five minutes.
            </p>
          </div>

        </div>


        <div
          class="mana-v984-panel"
        >

          <div
            class="mana-v984-small-label"
          >
            RECLAIM TOOLS
          </div>


          ${RECLAIM_TOOLS
            .map(
              (item,index) => `

                <div
                  class="mana-v984-accordion"
                >

                  <button
                    type="button"
                    data-v984-tool="${index}"
                  >

                    <strong>
                      ${esc(
                        item.title
                      )}
                    </strong>

                    <span>⌄</span>

                  </button>


                  <div
                    class="mana-v984-accordion-body"
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


        <div
          class="mana-v984-affirmation"
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

    `;

  }


  /* =========================================
     PROGRESS
     ========================================= */

  function progressHtml() {

    const data =
      progressMetrics();


    const r =
      data.range;


    return `

      <div
        class="mana-v984-root"
      >

        <div
          class="mana-v984-hero"
        >

          <div
            class="mana-v984-kicker"
          >
            MANA LYFE • PROGRESS
          </div>


          <h2>
            Your Momentum
          </h2>


          <p>
            Movement, daily action and mindset
            in one clear view.
          </p>

        </div>


        <div
          class="mana-v984-periods"
        >

          ${[
            ["daily","DAILY"],
            ["weekly","WEEKLY"],
            ["monthly","MONTHLY"],
            ["todate","TO DATE"]
          ]
            .map(
              item => `

                <button
                  type="button"
                  class="
                    mana-v984-period
                    ${
                      selectedPeriod ===
                      item[0]
                        ? "active"
                        : ""
                    }
                  "
                  data-v984-period="${item[0]}"
                >
                  ${item[1]}
                </button>

              `
            )
            .join("")}

        </div>


        <div
          class="mana-v984-period-head"
        >

          <strong>
            ${r.label}
          </strong>

          <span>
            ${r.detail}
          </span>

        </div>


        <div
          class="mana-v984-progress-grid"
        >

          ${progressCard(
            "LY",
            "SESSIONS",
            data.sessions.percent,
            `${data.sessions.count} of ${data.sessions.target} Lyfe sessions completed`,
            true
          )}


          ${progressCard(
            "A",
            "DAILY ACTIONS",
            data.actions.percent,
            `${data.actions.count} of ${data.actions.target} useful actions`
          )}


          ${progressCard(
            "D",
            "ACTIVE DAYS",
            data.active.percent,
            `${data.active.count} of ${data.active.target} days with action`
          )}


          ${progressCard(
            "✓",
            "CHECK-INS",
            data.checkins.percent,
            `${data.checkins.count} of ${data.checkins.target} days checked in`
          )}


          ${progressCard(
            "M",
            "MOOD",
            data.mood.percent,
            data.mood.days
              ? `${data.mood.average.toFixed(1)} / 5 average`
              : "No mood check-ins yet"
          )}

        </div>


        ${whakatauki(
          "progress"
        )}

      </div>

    `;

  }


  /* =========================================
     LEARN
     ========================================= */

  function learnHtml() {

    return `

      <div
        class="mana-v984-root"
      >

        <div
          class="mana-v984-hero"
        >

          <div
            class="mana-v984-kicker"
          >
            MANA LYFE • LEARN
          </div>


          <h2>
            Tools for Lyfe
          </h2>


          <p>
            Simple principles for mindset,
            resilience, routine and moving
            forward with purpose.
          </p>

        </div>


        ${whakatauki(
          "learn"
        )}


        <div
          class="mana-v984-panel"
        >

          <div
            class="mana-v984-small-label"
          >
            LYFE PRINCIPLES
          </div>


          ${LEARN
            .map(
              (item,index) => `

                <div
                  class="mana-v984-accordion"
                >

                  <button
                    type="button"
                    data-v984-learn="${index}"
                  >

                    <strong>
                      ${esc(
                        item.title
                      )}
                    </strong>

                    <span>⌄</span>

                  </button>


                  <div
                    class="mana-v984-accordion-body"
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


        <div
          class="mana-v984-panel"
        >

          <div
            class="mana-v984-small-label"
          >
            TE REO MĀORI • EVERYDAY
          </div>


          ${PHRASES
            .map(
              phrase => `

                <div
                  class="mana-v984-phrase"
                >

                  <strong>
                    ${esc(
                      phrase.maori
                    )}
                  </strong>

                  <span>
                    ${esc(
                      phrase.english
                    )}
                  </span>

                </div>

              `
            )
            .join("")}

        </div>

      </div>

    `;

  }


  /* =========================================
     STYLES
     ========================================= */

  function installStyles() {

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

      .mana-v984-root{
        width:100%;
        max-width:780px;
        margin:0 auto 38px;
      }


      .mana-v984-hero{
        position:relative;
        margin-bottom:15px;
        padding:20px;
        border:1px solid #3e351c;
        border-radius:21px;
        background:
          linear-gradient(
            145deg,
            #18160d,
            #090909
          );
      }


      .mana-v984-kicker,
      .mana-v984-small-label{
        color:#d7b851;
        font-size:10px;
        font-weight:950;
        letter-spacing:.15em;
      }


      .mana-v984-hero h2{
        margin:7px 0 7px;
        color:#fff;
        font-size:31px;
        font-weight:950;
        line-height:1.05;
      }


      .mana-v984-hero p,
      .mana-v984-panel p{
        margin:0;
        color:#999;
        font-size:13px;
        line-height:1.55;
      }


      .mana-v984-panel{
        margin-top:12px;
        padding:17px;
        border:1px solid #292820;
        border-radius:18px;
        background:#0c0c0a;
      }


      .mana-v984-panel.gold{
        border-color:#51451d;
        background:
          linear-gradient(
            145deg,
            #161409,
            #090909
          );
      }


      .mana-v984-panel h3{
        margin:7px 0 9px;
        color:#fff;
        font-size:20px;
      }


      .mana-v984-whakatauki{
        margin:12px 0;
        padding:15px;
        border-left:3px solid #d6b548;
        border-radius:0 14px 14px 0;
        background:#100f09;
      }


      .mana-v984-whakatauki strong{
        display:block;
        margin-top:7px;
        color:#f2d875;
        font-size:16px;
        line-height:1.45;
      }


      .mana-v984-whakatauki span{
        display:block;
        margin-top:5px;
        color:#aaa;
        font-size:12px;
        line-height:1.5;
      }


      .mana-v984-textarea{
        width:100%;
        min-height:125px;
        margin-top:13px;
        padding:13px;
        box-sizing:border-box;
        resize:vertical;
        border:1px solid #333;
        border-radius:13px;
        background:#080808;
        color:#fff;
        font:inherit;
        line-height:1.5;
      }


      .mana-v984-action{
        width:100%;
        min-height:49px;
        margin-top:10px;
        border:0;
        border-radius:13px;
        background:
          linear-gradient(
            135deg,
            #f3d875,
            #c99d2d
          );
        color:#111;
        font-size:11px;
        font-weight:950;
      }


      .mana-v984-prompt{
        margin-top:10px;
        padding:13px;
        border:1px solid #292929;
        border-radius:13px;
        background:#090909;
      }


      .mana-v984-prompt strong{
        color:#f2d875;
        font-size:13px;
      }


      .mana-v984-prompt p{
        margin-top:6px;
      }


      .mana-v984-accordion{
        margin-top:9px;
        overflow:hidden;
        border:1px solid #292929;
        border-radius:14px;
        background:#090909;
      }


      .mana-v984-accordion > button{
        width:100%;
        min-height:57px;
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:10px;
        padding:13px;
        border:0;
        background:transparent;
        color:#fff;
        text-align:left;
      }


      .mana-v984-accordion > button strong{
        font-size:13px;
      }


      .mana-v984-accordion > button span{
        color:#f2d875;
        font-size:19px;
      }


      .mana-v984-accordion-body{
        display:none;
        padding:0 13px 14px;
        color:#aaa;
        font-size:13px;
        line-height:1.6;
      }


      .mana-v984-accordion.open
      .mana-v984-accordion-body{
        display:block;
      }


      .mana-v984-affirmation{
        margin-top:13px;
        padding:16px;
        border-left:3px solid #f2d875;
        background:#100f09;
      }


      .mana-v984-affirmation span{
        color:#897a46;
        font-size:9px;
        font-weight:950;
      }


      .mana-v984-affirmation strong{
        display:block;
        margin-top:7px;
        color:#f2d875;
        font-size:16px;
        line-height:1.45;
      }


      /* PROGRESS */

      .mana-v984-periods{
        display:grid;
        grid-template-columns:
          repeat(
            4,
            minmax(0,1fr)
          );
        gap:5px;
        padding:5px;
        margin-bottom:14px;
        border:1px solid #292929;
        border-radius:17px;
        background:#080808;
      }


      .mana-v984-period{
        min-height:44px;
        border:0;
        border-radius:11px;
        background:transparent;
        color:#777;
        font-size:9px;
        font-weight:950;
      }


      .mana-v984-period.active{
        background:
          linear-gradient(
            145deg,
            #f5dc7a,
            #c89e2d
          );
        color:#111;
      }


      .mana-v984-period-head{
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:10px;
        margin:15px 2px 10px;
      }


      .mana-v984-period-head strong{
        color:#eee;
        font-size:12px;
        letter-spacing:.09em;
      }


      .mana-v984-period-head span{
        color:#777;
        font-size:9px;
      }


      .mana-v984-progress-grid{
        display:grid;
        grid-template-columns:
          repeat(
            2,
            minmax(0,1fr)
          );
        gap:9px;
      }


      .mana-v984-progress-card{
        min-height:142px;
        padding:14px;
        border:1px solid #292820;
        border-radius:17px;
        background:
          linear-gradient(
            145deg,
            #13120e,
            #090909
          );
      }


      .mana-v984-progress-card.wide{
        grid-column:1 / -1;
      }


      .mana-v984-card-head{
        display:flex;
        align-items:center;
        gap:8px;
      }


      .mana-v984-icon{
        width:31px;
        height:31px;
        display:grid;
        place-items:center;
        border:1px solid #463b1b;
        border-radius:10px;
        background:#18150d;
        color:#f2d875;
        font-size:9px;
        font-weight:950;
      }


      .mana-v984-card-label{
        color:#999;
        font-size:9px;
        font-weight:950;
        letter-spacing:.11em;
      }


      .mana-v984-percent{
        margin-top:12px;
        color:#fff;
        font-size:26px;
        font-weight:950;
      }


      .mana-v984-card-copy{
        min-height:29px;
        margin-top:6px;
        color:#808080;
        font-size:10px;
        line-height:1.4;
      }


      .mana-v984-track{
        height:7px;
        margin-top:9px;
        overflow:hidden;
        border-radius:999px;
        background:#25231c;
      }


      .mana-v984-track span{
        display:block;
        height:100%;
        border-radius:999px;
        background:
          linear-gradient(
            90deg,
            #c69c2c,
            #f3d875
          );
      }


      .mana-v984-phrase{
        margin-top:9px;
        padding:13px;
        border:1px solid #292929;
        border-radius:13px;
        background:#090909;
      }


      .mana-v984-phrase strong{
        display:block;
        color:#f2d875;
        font-size:15px;
      }


      .mana-v984-phrase span{
        display:block;
        margin-top:5px;
        color:#aaa;
        font-size:12px;
        line-height:1.45;
      }


      @media(max-width:420px){

        .mana-v984-hero{
          padding:17px;
        }


        .mana-v984-hero h2{
          font-size:27px;
        }


        .mana-v984-progress-grid{
          gap:8px;
        }


        .mana-v984-progress-card{
          min-height:135px;
          padding:13px;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     BIND
     ========================================= */

  function bindReclaim() {

    document
      .getElementById(
        "manaV984SaveReclaim"
      )
      ?.addEventListener(
        "click",
        () => {

          const state =
            loadLife();


          state.notes.reclaim =
            document
              .getElementById(
                "manaV984ReclaimNote"
              )
              ?.value || "";


          saveLife(
            state
          );


          const button =
            document.getElementById(
              "manaV984SaveReclaim"
            );


          if (button) {

            button.textContent =
              "SAVED ✓";


            setTimeout(
              () => {

                button.textContent =
                  "SAVE PRIVATELY";

              },
              900
            );

          }

        }
      );


    document
      .querySelectorAll(
        "[data-v984-tool]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              button
                .closest(
                  ".mana-v984-accordion"
                )
                ?.classList
                .toggle(
                  "open"
                );

            };

        }
      );

  }


  function bindLearn() {

    document
      .querySelectorAll(
        "[data-v984-learn]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              button
                .closest(
                  ".mana-v984-accordion"
                )
                ?.classList
                .toggle(
                  "open"
                );

            };

        }
      );

  }


  function bindProgress() {

    document
      .querySelectorAll(
        "[data-v984-period]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              selectedPeriod =
                button.dataset
                  .v984Period;


              render();

            };

        }
      );

  }


  /* =========================================
     RENDER
     ========================================= */

  function render() {

    if (
      !lyfeOpen() ||
      !ownedTab()
    ) {

      return;

    }


    /*
      Keep the visible branding as LYFE.
    */

    const titleEl =
      document.getElementById(
        "manaV83Title"
      );


    if (titleEl) {

      titleEl.textContent =
        "MANA LYFE";

    }


    const content =
      holder();


    if (!content) {

      return;

    }


    const tab =
      activeTab();


    if (
      tab ===
      "reclaim"
    ) {

      content.innerHTML =
        reclaimHtml();


      bindReclaim();

      return;

    }


    if (
      tab ===
      "progress"
    ) {

      content.innerHTML =
        progressHtml();


      bindProgress();

      return;

    }


    if (
      tab ===
      "learn"
    ) {

      content.innerHTML =
        learnHtml();


      bindLearn();

    }

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();


    window.addEventListener(
      "mana:program-tab-change",
      () => {

        queueMicrotask(
          render
        );

      }
    );


    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "#manaV83Tabs"
          )
        ) {

          queueMicrotask(
            render
          );

        }

      },
      true
    );


    window.addEventListener(
      "mana:life-updated",
      () => {

        if (
          activeTab() ===
          "progress"
        ) {

          queueMicrotask(
            render
          );

        }

      }
    );


    queueMicrotask(
      render
    );


    window.MANA_LYFE_CONTENT_BUILD =
      BUILD;


    console.log(
      "[Mana v9.84.0] Lyfe content restored"
    );

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once:true
      }
    );

  } else {

    init();

  }

})();
