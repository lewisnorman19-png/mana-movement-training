/* =========================================
   MANA MOVEMENT TRAINING v9.90.0
   PROGRAM TIDY UP

   MANA 28
   - SMALLER 28-DAY JOURNEY NUMBER
   - QUICK ADD WATER MOVED UNDER WATER
   - REMOVE DUPLICATE PROFILE/FUEL SETTINGS BAR

   MANA LYFE
   - RECLAIM ORDER:
       RESET
       3 QUESTIONS
       WRITE IT
       RECLAIM TOOLS
       AFFIRMATION / WHAKATAUKI
       CHAT
   - MORE TE REO
   - DAILY REO QUIZ
   - CHAT RESTORED TO OVERVIEW

   MANA STRENGTH
   - SET 1 REPS AUTO-COPY THROUGH SET 4
   - PROMINENT LEFT / RIGHT WORKOUT ARROWS
   - FEEDBACK 1–5
   - TICK ALL SETS ON FEEDBACK PAGE
   - COMPLETED WORKOUT HIGHLIGHT FOR CURRENT WEEK
   - RETURN TO WORKOUTS AFTER SUMMARY
   - REMOVE DUPLICATE PROFILE CARD FROM OVERVIEW

   PROFILE / FUEL
   - MASTER FUEL TARGETS USED FOR
     CALORIES + PROTEIN DISPLAY

   STABILITY
   - NO MUTATION OBSERVER
   - NO DATA RESET
   - NO TIMER CHANGES
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "99000";


  const STYLE_ID =
    "mana-v990-program-tidy-style";


  const PROFILE_KEY =
    "mana-profile-v67";


  const TARGET_KEY =
    "mana-fuel-v58-targets";


  const LIFE_KEY =
    "mana-life-v933-state";


  const STRENGTH_LOG_KEY =
    "mana-strength-v64-logs";


  let refreshTimer =
    null;


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


  function programTitle() {

    return (
      document
        .getElementById(
          "manaV83Title"
        )
        ?.textContent
        ?.trim()
        ?.toUpperCase()
      ||
      ""
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
      ||
      ""
    );

  }


  function shellOpen() {

    return Boolean(
      document
        .getElementById(
          "manaV83ProgramShell"
        )
        ?.classList
        .contains(
          "open"
        )
    );

  }


  function strengthOpen() {

    return Boolean(
      shellOpen() &&
      programTitle() ===
        "MANA STRENGTH"
    );

  }


  function mana28Open() {

    return Boolean(
      shellOpen() &&
      programTitle() ===
        "MANA 28"
    );

  }


  function lyfeOpen() {

    const title =
      programTitle();


    return Boolean(
      shellOpen() &&
      (
        title ===
          "MANA LIFE"
        ||
        title ===
          "MANA LYFE"
      )
    );

  }


  /* =========================================
     STYLES
     ========================================= */

  function installStyles() {

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

      /* =====================================
         MANA 28 PROGRESS
         ===================================== */

      .mana-v981-overall-value{

        font-size:
          17px !important;

        line-height:
          1.25 !important;

      }


      .mana-v981-overall-value span{

        font-size:
          17px !important;

      }


      /* =====================================
         REMOVE DUPLICATE FUEL SETTINGS
         ===================================== */

      #manaV83Content
      #manaV89BuildTargets,

      #manaV83Content
      #manaV89EditTargets,

      #manaV83Content
      .mana-v989-profile-note{

        display:
          none !important;

      }


      /* =====================================
         WATER
         ===================================== */

      #manaV83Content
      .mana-v897-water{

        grid-column:
          1 / -1;

        width:
          100%;

        margin-top:
          9px;

        padding-top:
          12px;

      }


      /* =====================================
         LYFE EXTRA CARDS
         ===================================== */

      .mana-v990-lyfe-card{

        margin-top:
          12px;

        padding:
          17px;

        border:
          1px solid
          #39321e;

        border-radius:
          18px;

        background:
          linear-gradient(
            145deg,
            #15130b,
            #090909
          );

      }


      .mana-v990-lyfe-card.gold{

        border-color:
          #5c4d1d;

      }


      .mana-v990-kicker{

        color:
          #d8b850;

        font-size:
          10px;

        font-weight:
          950;

        letter-spacing:
          .13em;

      }


      .mana-v990-lyfe-card h3{

        margin:
          6px 0 7px;

        color:
          #fff;

        font-size:
          20px;

      }


      .mana-v990-lyfe-card p{

        margin:
          0;

        color:
          #999;

        font-size:
          13px;

        line-height:
          1.55;

      }


      .mana-v990-primary{

        width:
          100%;

        min-height:
          50px;

        margin-top:
          13px;

        border:
          0;

        border-radius:
          13px;

        background:
          #f3d875;

        color:
          #111;

        font-size:
          12px;

        font-weight:
          950;

      }


      .mana-v990-reset-feedback{

        margin-top:
          10px;

        color:
          #8e8e8e;

        font-size:
          11px;

        line-height:
          1.45;

      }


      /* =====================================
         REO
         ===================================== */

      .mana-v990-reo-word{

        display:
          grid;

        grid-template-columns:
          minmax(
            110px,
            .8fr
          )
          1.2fr;

        gap:
          12px;

        padding:
          11px 0;

        border-top:
          1px solid
          #252525;

      }


      .mana-v990-reo-word:first-child{

        border-top:
          0;

      }


      .mana-v990-reo-word strong{

        color:
          #f3d875;

        font-size:
          13px;

      }


      .mana-v990-reo-word span{

        color:
          #aaa;

        font-size:
          12px;

      }


      .mana-v990-quiz-option{

        width:
          100%;

        min-height:
          46px;

        margin-top:
          8px;

        padding:
          10px 12px;

        border:
          1px solid
          #323232;

        border-radius:
          12px;

        background:
          #0b0b0b;

        color:
          #ddd;

        text-align:
          left;

        font-size:
          12px;

      }


      .mana-v990-quiz-option.correct{

        border-color:
          #857028;

        background:
          #171408;

        color:
          #f3d875;

      }


      .mana-v990-quiz-option.wrong{

        opacity:
          .55;

      }


      .mana-v990-quiz-result{

        min-height:
          20px;

        margin-top:
          10px;

        color:
          #f3d875;

        font-size:
          11px;

        font-weight:
          900;

      }


      /* =====================================
         STRENGTH NAV ARROWS
         ===================================== */

      @media(
        max-width:700px
      ){

        #manaV971BottomNav{

          display:
            grid !important;

          grid-template-columns:
            1fr
            1fr;

          gap:
            12px;

          margin-top:
            10px;

        }


        #manaV971BottomNav
        .mana-v971-nav-btn{

          min-height:
            58px !important;

          border:
            1px solid
            #594c1f !important;

          border-radius:
            16px !important;

          background:
            linear-gradient(
              145deg,
              #17150c,
              #0a0a0a
            )
            !important;

          color:
            #f3d875 !important;

          font-size:
            32px !important;

          font-weight:
            800 !important;

          line-height:
            1 !important;

        }


        #manaV971BottomNav
        .mana-v971-nav-btn:disabled{

          opacity:
            .22 !important;

        }

      }


      /* =====================================
         FEEDBACK 1–5
         ===================================== */

      #manaV922Feedback
      .mana-v922-effort{

        grid-template-columns:
          repeat(
            5,
            minmax(
              0,
              1fr
            )
          )
          !important;

        gap:
          6px !important;

      }


      #manaV922Feedback
      .mana-v922-effort
      button{

        min-height:
          46px !important;

        font-size:
          13px !important;

      }


      .mana-v990-tick-all{

        width:
          100%;

        min-height:
          48px;

        margin-top:
          13px;

        border:
          1px solid
          #65551f;

        border-radius:
          14px;

        background:
          #151208;

        color:
          #f3d875;

        font-size:
          12px;

        font-weight:
          950;

      }


      /* =====================================
         COMPLETED STRENGTH WORKOUT
         ===================================== */

      #manaV83Content
      .mana-v85-day.mana-v990-completed{

        border-color:
          #8b7425 !important;

        background:
          linear-gradient(
            145deg,
            #1b1709,
            #0b0b0b
          )
          !important;

        box-shadow:
          inset
          0
          0
          0
          1px
          rgba(
            243,
            216,
            117,
            .05
          );

      }


      .mana-v990-completed-badge{

        display:
          inline-flex;

        align-items:
          center;

        margin-top:
          8px;

        padding:
          6px 9px;

        border:
          1px solid
          #74601f;

        border-radius:
          999px;

        color:
          #f3d875;

        background:
          #171408;

        font-size:
          9px;

        font-weight:
          950;

        letter-spacing:
          .08em;

      }


      /* =====================================
         HIDE STRENGTH OVERVIEW PROFILE TILE
         ===================================== */

      #manaV964Launchpad
      .mana-v964-launch[
        data-v964-launch="profile"
      ]{

        display:
          none !important;

      }


      #manaV964Launchpad
      .mana-v964-grid{

        grid-template-columns:
          repeat(
            3,
            minmax(
              0,
              1fr
            )
          )
          !important;

      }


      @media(
        max-width:700px
      ){

        #manaV964Launchpad
        .mana-v964-grid{

          grid-template-columns:
            1fr !important;

        }

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     MANA 28 FUEL WATER POSITION
     ========================================= */

  function tidyFuel() {

    if (
      !(
        mana28Open() ||
        strengthOpen()
      )
      ||
      activeTab() !==
        "fuel"
    ) {

      return;

    }


    const root =
      document.querySelector(
        "#manaV83Content .mana-v897-root"
      );


    const water =
      root?.querySelector(
        ".mana-v897-water"
      );


    const grid =
      root?.querySelector(
        ".mana-v897-grid"
      );


    if (
      !root ||
      !water ||
      !grid
    ) {

      return;

    }


    const stats =
      [
        ...grid.querySelectorAll(
          ".mana-v897-stat"
        )
      ];


    const waterStat =
      stats.find(
        stat => {

          const label =
            stat.querySelector(
              ".mana-v897-label"
            )
              ?.textContent
              ?.trim()
              ?.toLowerCase();


          return (
            label ===
            "water"
          );

        }
      );


    if (
      waterStat &&
      water.previousElementSibling !==
        waterStat
    ) {

      waterStat
        .insertAdjacentElement(
          "afterend",
          water
        );

    }

  }


  /* =========================================
     LYFE RESET SUMMARY
     ========================================= */

  function loadLife() {

    return safeJson(
      localStorage.getItem(
        LIFE_KEY
      ) || "{}",
      {}
    );

  }


  function resetFeedbackText() {

    const state =
      loadLife();


    const resets =
      Array.isArray(
        state.resets
      )
        ? state.resets
        : [];


    if (
      !resets.length
    ) {

      return (
        "No resets completed yet. Use Reset Now whenever you need a short circuit-breaker."
      );

    }


    const latest =
      resets[
        resets.length - 1
      ];


    const date =
      latest?.completed_at
        ? new Date(
            latest.completed_at
          )
        : null;


    const when =
      date &&
      !Number.isNaN(
        date.getTime()
      )
        ? date.toLocaleDateString(
            undefined,
            {
              day:"numeric",
              month:"short"
            }
          )
        : "recently";


    return (
      `${resets.length} reset${
        resets.length === 1
          ? ""
          : "s"
      } completed • latest ${when}`
    );

  }


  /* =========================================
     RECLAIM ORDER
     ========================================= */

  function tidyReclaim() {

    if (
      !lyfeOpen() ||
      activeTab() !==
        "reclaim"
    ) {

      return;

    }


    const root =
      document.querySelector(
        "#manaV83Content .mana-v984-root"
      );


    if (!root) {

      return;

    }


    const hero =
      root.querySelector(
        ".mana-v984-hero"
      );


    const panels =
      [
        ...root.querySelectorAll(
          ".mana-v984-panel"
        )
      ];


    const quote =
      root.querySelector(
        ".mana-v984-whakatauki"
      );


    const affirmation =
      root.querySelector(
        ".mana-v984-affirmation"
      );


    const writePanel =
      panels.find(
        panel =>
          panel.querySelector(
            "#manaV984ReclaimNote"
          )
      );


    const questionsPanel =
      panels.find(
        panel =>
          panel.textContent
            ?.toUpperCase()
            .includes(
              "THREE QUESTIONS"
            )
      );


    const toolsPanel =
      panels.find(
        panel =>
          panel.textContent
            ?.toUpperCase()
            .includes(
              "RECLAIM TOOLS"
            )
      );


    let reset =
      document.getElementById(
        "manaV990ResetCard"
      );


    if (!reset) {

      reset =
        document.createElement(
          "div"
        );


      reset.id =
        "manaV990ResetCard";


      reset.className =
        "mana-v990-lyfe-card gold";


      reset.innerHTML = `

        <div
          class="mana-v990-kicker"
        >
          1 • RESET NOW
        </div>

        <h3>
          Create some space first.
        </h3>

        <p>
          Use the guided Reset before
          deciding what to say or do next.
        </p>

        <button
          type="button"
          class="mana-v990-primary"
          id="manaV990ResetOpen"
        >
          START RESET →
        </button>

        <div
          class="mana-v990-reset-feedback"
          id="manaV990ResetFeedback"
        >
          ${esc(
            resetFeedbackText()
          )}
        </div>

      `;


      reset
        .querySelector(
          "#manaV990ResetOpen"
        )
        ?.addEventListener(
          "click",
          () => {

            if (
              typeof
                window
                  .openManaLifeReset ===
              "function"
            ) {

              window
                .openManaLifeReset();

            }

          }
        );

    }


    let chat =
      document.getElementById(
        "manaV990ReclaimChat"
      );


    if (!chat) {

      chat =
        document.createElement(
          "div"
        );


      chat.id =
        "manaV990ReclaimChat";


      chat.className =
        "mana-v990-lyfe-card";


      chat.innerHTML = `

        <div
          class="mana-v990-kicker"
        >
          6 • CHAT
        </div>

        <h3>
          Talk it through.
        </h3>

        <p>
          Use private support chat when
          you need perspective, accountability
          or somewhere to unpack what is happening.
        </p>

        <button
          type="button"
          class="mana-v990-primary"
          id="manaV990ReclaimChatOpen"
        >
          OPEN CHAT →
        </button>

      `;


      chat
        .querySelector(
          "#manaV990ReclaimChatOpen"
        )
        ?.addEventListener(
          "click",
          () => {

            if (
              typeof
                window
                  .openManaLifeSupport ===
              "function"
            ) {

              window
                .openManaLifeSupport();

            }

          }
        );

    }


    /*
      Desired order after hero:
      RESET
      QUESTIONS
      WRITE
      TOOLS
      AFFIRMATION
      WHAKATAUKI
      CHAT
    */

    [
      reset,
      questionsPanel,
      writePanel,
      toolsPanel,
      affirmation,
      quote,
      chat
    ]
      .filter(
        Boolean
      )
      .forEach(
        node => {

          root.appendChild(
            node
          );

        }
      );


    if (
      hero &&
      reset.previousElementSibling !==
        hero
    ) {

      hero.insertAdjacentElement(
        "afterend",
        reset
      );

    }


    const feedback =
      document.getElementById(
        "manaV990ResetFeedback"
      );


    if (feedback) {

      feedback.textContent =
        resetFeedbackText();

    }

  }


  /* =========================================
     LYFE OVERVIEW CHAT
     ========================================= */

  function addLyfeOverviewChat() {

    if (
      !lyfeOpen() ||
      activeTab() !==
        "overview"
    ) {

      return;

    }


    const holder =
      document.getElementById(
        "manaV83Content"
      );


    if (
      !holder ||
      document.getElementById(
        "manaV990OverviewChat"
      )
    ) {

      return;

    }


    const card =
      document.createElement(
        "div"
      );


    card.id =
      "manaV990OverviewChat";


    card.className =
      "mana-v990-lyfe-card";


    card.innerHTML = `

      <div
        class="mana-v990-kicker"
      >
        SUPPORT CHAT
      </div>

      <h3>
        Need to talk something through?
      </h3>

      <p>
        Open your private Mana support chat
        for perspective, accountability
        or a quick check-in.
      </p>

      <button
        type="button"
        class="mana-v990-primary"
      >
        OPEN CHAT →
      </button>

    `;


    card
      .querySelector(
        "button"
      )
      ?.addEventListener(
        "click",
        () => {

          if (
            typeof
              window
                .openManaLifeSupport ===
            "function"
          ) {

            window
              .openManaLifeSupport();

          }

        }
      );


    holder.appendChild(
      card
    );

  }


  /* =========================================
     REO EXPANSION
     ========================================= */

  const REO_EXTRA = [

    [
      "whānau",
      "family"
    ],

    [
      "mahi",
      "work / activity"
    ],

    [
      "kai",
      "food"
    ],

    [
      "wai",
      "water"
    ],

    [
      "kāinga",
      "home"
    ],

    [
      "hoa",
      "friend / companion"
    ],

    [
      "tamaiti",
      "child"
    ],

    [
      "tinana",
      "body"
    ],

    [
      "hinengaro",
      "mind"
    ],

    [
      "ngākau",
      "heart / inner feeling"
    ],

    [
      "Kei te hiakai ahau.",
      "I am hungry."
    ],

    [
      "Kei te ngenge ahau.",
      "I am tired."
    ],

    [
      "Kei te haere ahau.",
      "I am going."
    ],

    [
      "Kei hea koe?",
      "Where are you?"
    ],

    [
      "Haere mai.",
      "Come here / welcome."
    ],

    [
      "Kia tūpato.",
      "Be careful."
    ],

    [
      "Ka pai.",
      "Good / well done."
    ],

    [
      "Māku e mahi.",
      "I will do it."
    ],

    [
      "Kua rite ahau.",
      "I am ready."
    ],

    [
      "He rā pai tēnei.",
      "This is a good day."
    ]

  ];


  const QUIZ = [

    {
      q:
        "What does “wai” mean?",

      answers:[
        "Water",
        "Food",
        "Home"
      ],

      correct:0
    },

    {
      q:
        "How do you say “I am tired”?",

      answers:[
        "Kei te pai ahau.",
        "Kei te ngenge ahau.",
        "Kua rite ahau."
      ],

      correct:1
    },

    {
      q:
        "What does “Ka pai” mean?",

      answers:[
        "Be careful",
        "Good / well done",
        "Where are you?"
      ],

      correct:1
    }

  ];


  function dailyQuizIndex() {

    return (
      Math.floor(
        Date.now() /
        86400000
      )
      %
      QUIZ.length
    );

  }


  function tidyLearn() {

    if (
      !lyfeOpen() ||
      activeTab() !==
        "learn"
    ) {

      return;

    }


    const root =
      document.querySelector(
        "#manaV83Content .mana-v984-root"
      );


    if (!root) {

      return;

    }


    if (
      !document.getElementById(
        "manaV990MoreReo"
      )
    ) {

      const panel =
        document.createElement(
          "div"
        );


      panel.id =
        "manaV990MoreReo";


      panel.className =
        "mana-v984-panel";


      panel.innerHTML = `

        <div
          class="mana-v984-small-label"
        >
          MORE TE REO • WORDS + SHORT SENTENCES
        </div>

        <div
          style="margin-top:10px"
        >

          ${REO_EXTRA
            .map(
              item => `

                <div
                  class="mana-v990-reo-word"
                >

                  <strong>
                    ${esc(
                      item[0]
                    )}
                  </strong>

                  <span>
                    ${esc(
                      item[1]
                    )}
                  </span>

                </div>

              `
            )
            .join(
              ""
            )}

        </div>

      `;


      root.appendChild(
        panel
      );

    }


    if (
      !document.getElementById(
        "manaV990ReoQuiz"
      )
    ) {

      const quiz =
        QUIZ[
          dailyQuizIndex()
        ];


      const panel =
        document.createElement(
          "div"
        );


      panel.id =
        "manaV990ReoQuiz";


      panel.className =
        "mana-v984-panel gold";


      panel.innerHTML = `

        <div
          class="mana-v984-small-label"
        >
          DAILY REO QUIZ
        </div>

        <h3>
          ${esc(
            quiz.q
          )}
        </h3>

        <div
          id="manaV990QuizOptions"
        >

          ${quiz.answers
            .map(
              (
                answer,
                index
              ) => `

                <button
                  type="button"
                  class="mana-v990-quiz-option"
                  data-v990-answer="${index}"
                >
                  ${esc(
                    answer
                  )}
                </button>

              `
            )
            .join(
              ""
            )}

        </div>

        <div
          class="mana-v990-quiz-result"
          id="manaV990QuizResult"
        ></div>

      `;


      panel
        .querySelectorAll(
          "[data-v990-answer]"
        )
        .forEach(
          button => {

            button.addEventListener(
              "click",
              () => {

                const chosen =
                  Number(
                    button.dataset
                      .v990Answer
                  );


                panel
                  .querySelectorAll(
                    "[data-v990-answer]"
                  )
                  .forEach(
                    item => {

                      const index =
                        Number(
                          item.dataset
                            .v990Answer
                        );


                      item.classList
                        .toggle(
                          "correct",
                          index ===
                            quiz.correct
                        );


                      item.classList
                        .toggle(
                          "wrong",
                          index !==
                            quiz.correct
                        );

                    }
                  );


                const result =
                  document.getElementById(
                    "manaV990QuizResult"
                  );


                if (result) {

                  result.textContent =
                    chosen ===
                    quiz.correct
                      ? "✓ Correct"
                      : "Have another look — the correct answer is highlighted.";

                }

              }
            );

          }
        );


      root.appendChild(
        panel
      );

    }

  }


  /* =========================================
     STRENGTH SET 4 REP COPY
     ========================================= */

  function copySetOneReps(
    input
  ) {

    const row =
      input.closest(
        ".mana-v64-set"
      );


    const card =
      input.closest(
        ".mana-v64-card"
      );


    if (
      !row ||
      !card
    ) {

      return;

    }


    const rows =
      [
        ...card.querySelectorAll(
          ".mana-v64-set"
        )
      ];


    const index =
      rows.indexOf(
        row
      );


    if (
      index !==
      0
    ) {

      return;

    }


    const value =
      input.value;


    rows
      .slice(
        1
      )
      .forEach(
        targetRow => {

          const target =
            targetRow.querySelector(
              "[data-v64-reps]"
            );


          if (!target) {

            return;

          }


          const previousAuto =
            target.dataset
              .v990AutoReps
            ??
            "";


          if (
            target.value !==
              ""
            &&
            target.value !==
              previousAuto
          ) {

            return;

          }


          target.value =
            value;


          target.dataset
            .v990AutoReps =
            value;


          target.dispatchEvent(
            new Event(
              "input",
              {
                bubbles:true
              }
            )
          );

        }
      );

  }


  /* =========================================
     MOBILE WORKOUT ARROWS
     ========================================= */

  function tidyWorkoutArrows() {

    if (
      !strengthOpen()
    ) {

      return;

    }


    const previous =
      document.getElementById(
        "manaV971Previous"
      );


    const next =
      document.getElementById(
        "manaV971Next"
      );


    if (previous) {

      previous.textContent =
        "←";


      previous.setAttribute(
        "aria-label",
        "Previous exercise"
      );

    }


    if (next) {

      next.textContent =
        "→";


      next.setAttribute(
        "aria-label",
        "Next exercise"
      );

    }

  }


  /* =========================================
     FEEDBACK 1–5 + TICK ALL
     ========================================= */

  function tidyFeedback() {

    const feedback =
      document.getElementById(
        "manaV922Feedback"
      );


    if (!feedback) {

      return;

    }


    const effort =
      document.getElementById(
        "manaV922Effort"
      );


    if (
      effort &&
      effort.dataset
        .v990FivePoint !==
        "1"
    ) {

      effort.dataset
        .v990FivePoint =
        "1";


      effort.innerHTML =
        [1,2,3,4,5]
          .map(
            number => `

              <button
                type="button"
                data-v922-effort="${number}"
              >
                ${number}
              </button>

            `
          )
          .join(
            ""
          );


      effort
        .querySelectorAll(
          "[data-v922-effort]"
        )
        .forEach(
          button => {

            button.addEventListener(
              "click",
              () => {

                effort
                  .querySelectorAll(
                    "[data-v922-effort]"
                  )
                  .forEach(
                    item =>
                      item.classList
                        .remove(
                          "active"
                        )
                  );


                button.classList
                  .add(
                    "active"
                  );

              }
            );

          }
        );

    }


    if (
      !document.getElementById(
        "manaV990TickAllFeedback"
      )
    ) {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.id =
        "manaV990TickAllFeedback";


      button.className =
        "mana-v990-tick-all";


      button.textContent =
        "✓ TICK ALL SETS";


      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              "#manaV64Exercises [data-v64-check]"
            )
            .forEach(
              check => {

                check.classList.add(
                  "done"
                );

              }
            );


          const input =
            document.querySelector(
              "#manaV64Exercises input"
            );


          input
            ?.dispatchEvent(
              new Event(
                "input",
                {
                  bubbles:true
                }
              )
            );

        }
      );


      effort
        ?.insertAdjacentElement(
          "afterend",
          button
        );

    }

  }


  /* =========================================
     WEEK HELPERS
     ========================================= */

  function startOfWeek(
    date
  ) {

    const value =
      new Date(
        date
      );


    value.setHours(
      0,
      0,
      0,
      0
    );


    const day =
      value.getDay();


    const diff =
      day === 0
        ? -6
        : 1 - day;


    value.setDate(
      value.getDate() +
      diff
    );


    return value;

  }


  function currentWeekCompletedIndexes() {

    const logs =
      safeJson(
        localStorage.getItem(
          STRENGTH_LOG_KEY
        ) || "[]",
        []
      );


    if (
      !Array.isArray(
        logs
      )
    ) {

      return [];

    }


    const start =
      startOfWeek(
        new Date()
      );


    const end =
      new Date(
        start
      );


    end.setDate(
      end.getDate() +
      7
    );


    return [
      ...new Set(

        logs
          .filter(
            log => {

              const raw =
                log.date ||
                log.completedAt ||
                log.finishedAtISO;


              const date =
                raw
                  ? new Date(
                      raw
                    )
                  : null;


              return (
                date &&
                !Number.isNaN(
                  date.getTime()
                ) &&
                date >= start &&
                date < end
              );

            }
          )
          .map(
            log =>
              Number(
                log.dayIndex
              )
          )
          .filter(
            Number.isInteger
          )

      )
    ];

  }


  /* =========================================
     COMPLETED WORKOUT HIGHLIGHT
     ========================================= */

  function decorateCompletedWorkouts() {

    if (
      !strengthOpen() ||
      activeTab() !==
        "program"
    ) {

      return;

    }


    const completed =
      currentWeekCompletedIndexes();


    const cards =
      [
        ...document.querySelectorAll(
          "#manaV83Content .mana-v85-day"
        )
      ];


    cards.forEach(
      (
        card,
        index
      ) => {

        const done =
          completed.includes(
            index
          );


        card.classList.toggle(
          "mana-v990-completed",
          done
        );


        card
          .querySelector(
            ".mana-v990-completed-badge"
          )
          ?.remove();


        if (
          done
        ) {

          const head =
            card.querySelector(
              ".mana-v85-head"
            )
            ||
            card;


          const badge =
            document.createElement(
              "div"
            );


          badge.className =
            "mana-v990-completed-badge";


          badge.textContent =
            "✓ COMPLETED THIS WEEK";


          head.appendChild(
            badge
          );

        }

      }
    );

  }


  /* =========================================
     RETURN TO WORKOUTS
     ========================================= */

  function handleCompleteBack(
    event
  ) {

    if (
      !event.target.closest(
        "#manaV915Back"
      )
    ) {

      return;

    }


    setTimeout(
      () => {

        const programTab =
          document.querySelector(
            '#manaV83Tabs [data-v83-tab="program"]'
          );


        programTab
          ?.click();


        setTimeout(
          decorateCompletedWorkouts,
          100
        );

      },
      100
    );

  }


  /* =========================================
     PROFILE / FUEL TARGET SYNC
     ========================================= */

  function syncFuelTargetDisplay() {

    const targets =
      safeJson(
        localStorage.getItem(
          TARGET_KEY
        ) || "{}",
        {}
      );


    const calories =
      Number(
        targets.calories || 0
      );


    const protein =
      Number(
        targets.protein || 0
      );


    if (
      !calories &&
      !protein
    ) {

      return;

    }


    const profileCalories =
      document.getElementById(
        "manaProfileFuelCalories"
      );


    const profileProtein =
      document.getElementById(
        "manaProfileFuelProtein"
      );


    if (
      profileCalories &&
      calories
    ) {

      profileCalories.textContent =
        `${calories.toLocaleString()} cal`;

    }


    if (
      profileProtein &&
      protein
    ) {

      profileProtein.textContent =
        `${protein}g`;

    }


    const modalCalories =
      document.getElementById(
        "manaV89Calories"
      );


    const modalProtein =
      document.getElementById(
        "manaV89Protein"
      );


    if (
      modalCalories &&
      calories
    ) {

      modalCalories.value =
        calories;

    }


    if (
      modalProtein &&
      protein
    ) {

      modalProtein.value =
        protein;

    }

  }


  /* =========================================
     MASTER REFRESH
     ========================================= */

  function refresh() {

    tidyFuel();

    tidyReclaim();

    addLyfeOverviewChat();

    tidyLearn();

    tidyWorkoutArrows();

    tidyFeedback();

    decorateCompletedWorkouts();

    syncFuelTargetDisplay();

  }


  function scheduleRefresh(
    delay = 80
  ) {

    clearTimeout(
      refreshTimer
    );


    refreshTimer =
      setTimeout(
        refresh,
        delay
      );

  }


  /* =========================================
     EVENTS
     ========================================= */

  function wireEvents() {

    document.addEventListener(
      "input",
      event => {

        const input =
          event.target.closest(
            "#manaV64Exercises [data-v64-reps]"
          );


        if (input) {

          copySetOneReps(
            input
          );

        }

      },
      true
    );


    document.addEventListener(
      "click",
      event => {

        handleCompleteBack(
          event
        );


        if (
          event.target.closest(
            "#manaV83Tabs .mana-v83-tab"
          )
          ||
          event.target.closest(
            "#manaV80Strength"
          )
          ||
          event.target.closest(
            "#manaV80Mana28"
          )
          ||
          event.target.closest(
            "#manaV80Life"
          )
          ||
          event.target.closest(
            ".mana-v971-nav-btn"
          )
        ) {

          scheduleRefresh(
            100
          );

        }

      },
      true
    );


    [
      "mana:program-tab-change",
      "mana:strength-synced",
      "mana:life-updated",
      "mana:fuel-updated",
      "mana:workout-progress-change",
      "mana:workout-feedback-saved",
      "mana:profile-synced"
    ]
      .forEach(
        name => {

          window.addEventListener(
            name,
            () => {

              scheduleRefresh(
                100
              );

            }
          );

        }
      );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    wireEvents();


    scheduleRefresh(
      220
    );


    window.MANA_PROGRAM_TIDY_BUILD =
      BUILD;


    window.refreshManaProgramTidy =
      scheduleRefresh;


    console.log(
      "[Mana v9.90.0] program tidy up ready"
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
