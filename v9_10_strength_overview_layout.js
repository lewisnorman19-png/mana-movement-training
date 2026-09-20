/* =========================================
   MANA MOVEMENT TRAINING v9.10.3
   MANA STRENGTH — OVERVIEW

   - FULL TODAY'S WORKOUT
   - DIRECT START WORKOUT
   - DAILY FOUNDATIONS
   - WEEKLY CALORIES
   - WEEKLY PROTEIN
   - WEEKLY WATER
   - WEEKLY WORKOUTS
   - COACH SUPPORT AT BOTTOM
   - ONE SIMPLE COACH CHAT
   ========================================= */

(() => {
  "use strict";


  const STYLE_ID =
    "mana-v9103-overview-layout-style";

  const PROGRAM_KEY =
    "mana-strength-v62-program";

  const LOG_KEY =
    "mana-strength-v64-logs";

  const FUEL_KEY =
    "mana-fuel-v571";

  const TARGET_KEY =
    "mana-fuel-v58-targets";

  const WEEKLY_ID =
    "manaV9103WeeklyProgress";


  let applying =
    false;


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


  function formatNumber(
    value
  ) {
    return Math.round(
      Number(
        value || 0
      )
    ).toLocaleString();
  }


  function pct(
    current,
    target
  ) {
    if (
      !Number(
        target
      )
    ) {
      return 0;
    }


    return Math.max(
      0,
      Math.min(
        100,
        Math.round(
          Number(
            current || 0
          ) /
          Number(
            target
          ) *
          100
        )
      )
    );
  }


  function strengthOverviewOpen() {
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
        .trim()
        .toUpperCase() ===
        "MANA STRENGTH" &&

      active
        ?.dataset
        ?.v83Tab ===
        "overview"

    );
  }


  function loadProgram() {
    return safeJson(
      localStorage.getItem(
        PROGRAM_KEY
      ) || "null",
      null
    );
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


  function loadFuelStore() {
    return safeJson(
      localStorage.getItem(
        FUEL_KEY
      ) || "{}",
      {}
    );
  }


  function loadTargets() {
    const saved =
      safeJson(
        localStorage.getItem(
          TARGET_KEY
        ) || "{}",
        {}
      );


    return {

      calories:
        Number(
          saved.calories || 0
        ),

      protein:
        Number(
          saved.protein || 0
        ),

      water:
        Number(
          saved.water || 0
        )

    };
  }


  /* =========================================
     WORKOUT
     ========================================= */

  function nextWorkoutIndex() {
    const program =
      loadProgram();


    const logs =
      loadLogs();


    const total =
      program
        ?.sessions
        ?.length || 0;


    if (!total) {
      return 0;
    }


    return (
      logs.length %
      total
    );
  }


  function todaySession() {
    const program =
      loadProgram();


    if (
      !program
        ?.sessions
        ?.length
    ) {
      return null;
    }


    return (
      program.sessions[
        nextWorkoutIndex()
      ] || null
    );
  }


  /* =========================================
     CURRENT WEEK
     ========================================= */

  function currentWeekRange() {
    const now =
      new Date();


    const today =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );


    /*
      Monday = start of week.
    */

    const mondayOffset =
      (
        today.getDay() +
        6
      ) % 7;


    const start =
      new Date(
        today
      );


    start.setDate(
      today.getDate() -
      mondayOffset
    );


    start.setHours(
      0,
      0,
      0,
      0
    );


    const end =
      new Date(
        start
      );


    end.setDate(
      start.getDate() +
      7
    );


    return {
      start,
      end
    };
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


  function currentWeekKeysToToday() {
    const range =
      currentWeekRange();


    const now =
      new Date();


    const today =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );


    const keys =
      [];


    const cursor =
      new Date(
        range.start
      );


    while (
      cursor <=
      today
    ) {

      keys.push(
        dateKey(
          cursor
        )
      );


      cursor.setDate(
        cursor.getDate() +
        1
      );

    }


    return keys;
  }


  /* =========================================
     FUEL TOTALS
     ========================================= */

  function fuelTotalsForDay(
    day
  ) {
    const totals = {

      calories:0,

      protein:0,

      water:
        Number(
          day?.water || 0
        )

    };


    Object
      .values(
        day?.meals || {}
      )
      .forEach(
        items => {

          (
            items || []
          )
            .forEach(
              item => {

                totals.calories +=
                  Number(
                    item?.calories ||
                    0
                  );


                totals.protein +=
                  Number(
                    item?.protein ||
                    0
                  );

              }
            );

        }
      );


    return totals;
  }


  function weeklyFuelTotals() {
    const store =
      loadFuelStore();


    const targets =
      loadTargets();


    const keys =
      currentWeekKeysToToday();


    const totals = {

      calories:0,

      protein:0,

      water:0

    };


    keys.forEach(
      key => {

        const day =
          fuelTotalsForDay(
            store[key] || {}
          );


        totals.calories +=
          day.calories;


        totals.protein +=
          day.protein;


        totals.water +=
          day.water;

      }
    );


    /*
      Weekly targets are full 7-day
      targets regardless of which day
      of the week it currently is.
    */

    return {

      calories:{
        current:
          totals.calories,

        target:
          targets.calories *
          7
      },


      protein:{
        current:
          totals.protein,

        target:
          targets.protein *
          7
      },


      water:{
        current:
          totals.water,

        target:
          targets.water *
          7
      }

    };
  }


  /* =========================================
     WORKOUT TOTALS
     ========================================= */

  function weeklyWorkoutTotals() {
    const program =
      loadProgram();


    const logs =
      loadLogs();


    const range =
      currentWeekRange();


    const target =
      Math.max(
        0,
        Number(
          program?.days ||
          program
            ?.sessions
            ?.length ||
          0
        )
      );


    const completed =
      logs.filter(
        log => {

          if (
            !log?.date
          ) {
            return false;
          }


          const date =
            new Date(
              log.date
            );


          if (
            Number.isNaN(
              date.getTime()
            )
          ) {
            return false;
          }


          return (
            date >=
              range.start &&

            date <
              range.end
          );

        }
      ).length;


    return {
      current:
        completed,

      target
    };
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

      /* ==========================
         TODAY'S WORKOUT
         ========================== */

      .mana-v9103-workout{
        margin:
          14px
          0;

        padding:
          21px;

        border:
          2px solid
          #6e5c20;

        border-radius:
          22px;

        background:
          linear-gradient(
            145deg,
            #211b08,
            #0b0b0b 68%
          );

        box-shadow:
          0
          12px
          32px
          rgba(
            212,
            175,
            55,
            .08
          );
      }


      .mana-v9103-workout-label{
        color:#f3d875;

        font-size:10px;

        font-weight:900;

        letter-spacing:.13em;

        text-transform:uppercase;
      }


      .mana-v9103-workout h3{
        margin:
          7px
          0
          4px;

        color:#fff;

        font-size:25px;

        line-height:1.08;
      }


      .mana-v9103-session-label{
        margin-top:5px;

        color:#a99a5c;

        font-size:10px;

        font-weight:800;

        letter-spacing:.06em;
      }


      .mana-v9103-exercises{
        margin-top:18px;

        border-top:
          1px solid
          #342e18;
      }


      .mana-v9103-exercise{
        display:grid;

        grid-template-columns:
          31px
          minmax(
            0,
            1fr
          );

        gap:11px;

        align-items:center;

        padding:
          13px
          2px;

        border-bottom:
          1px solid
          #292719;
      }


      .mana-v9103-exercise:last-child{
        border-bottom:0;
      }


      .mana-v9103-number{
        width:31px;
        height:31px;

        display:grid;

        place-items:center;

        border:
          1px solid
          #4c421e;

        border-radius:10px;

        background:#111009;

        color:#f3d875;

        font-size:10px;

        font-weight:900;
      }


      .mana-v9103-exercise strong{
        display:block;

        color:#eee;

        font-size:13px;

        line-height:1.3;
      }


      .mana-v9103-exercise span{
        display:block;

        margin-top:4px;

        color:#888;

        font-size:10px;

        line-height:1.4;
      }


      .mana-v9103-start{
        width:100%;

        min-height:56px;

        margin-top:17px;

        border:0;

        border-radius:16px;

        background:#f3d875;

        color:#111;

        font-size:14px;

        font-weight:900;

        cursor:pointer;
      }


      .mana-v9103-start:active{
        transform:
          scale(.99);
      }


      /* ==========================
         WEEKLY PROGRESS
         ========================== */

      #${WEEKLY_ID}{
        margin:
          14px
          0;

        padding:
          18px;

        border:
          1px solid
          #302d20;

        border-radius:
          21px;

        background:#0d0d0d;
      }


      .mana-v9103-week-head{
        display:flex;

        justify-content:
          space-between;

        align-items:flex-end;

        gap:10px;

        margin-bottom:14px;
      }


      .mana-v9103-week-head h3{
        margin:0;

        color:#fff;

        font-size:20px;
      }


      .mana-v9103-week-head span{
        color:#777;

        font-size:9px;

        font-weight:800;

        letter-spacing:.08em;

        text-transform:uppercase;
      }


      .mana-v9103-week-grid{
        display:grid;

        grid-template-columns:
          1fr
          1fr;

        gap:10px;
      }


      .mana-v9103-week-card{
        padding:14px;

        border:
          1px solid
          #292929;

        border-radius:
          16px;

        background:#090909;
      }


      .mana-v9103-week-top{
        display:flex;

        justify-content:
          space-between;

        align-items:center;

        gap:8px;
      }


      .mana-v9103-week-label{
        color:#aaa;

        font-size:10px;

        font-weight:900;

        letter-spacing:.05em;

        text-transform:uppercase;
      }


      .mana-v9103-week-percent{
        color:#f3d875;

        font-size:14px;

        font-weight:900;
      }


      .mana-v9103-week-value{
        margin-top:7px;

        color:#fff;

        font-size:18px;

        font-weight:900;

        line-height:1.2;
      }


      .mana-v9103-week-value span{
        color:#777;

        font-size:10px;

        font-weight:700;
      }


      .mana-v9103-week-track{
        height:7px;

        margin-top:11px;

        overflow:hidden;

        border-radius:999px;

        background:#242424;
      }


      .mana-v9103-week-fill{
        height:100%;

        border-radius:999px;

        background:#f3d875;
      }


      .mana-v9103-week-note{
        margin-top:13px;

        color:#707070;

        font-size:9px;

        line-height:1.45;
      }


      /* ==========================
         COACH SUPPORT
         ========================== */

      .mana-v9103-coach{
        margin-top:
          18px !important;

        border:
          1px solid
          #40371a !important;

        background:
          linear-gradient(
            145deg,
            #121008,
            #090909
          ) !important;
      }


      .mana-v9103-coach
      .mana-v866-section-head{
        margin-bottom:
          0 !important;
      }


      .mana-v9103-coach
      .mana-v866-section-head span{
        color:#f3d875;
      }


      /*
        Hide old Coach Activity feed.
        Keep only Coach Chat.
      */

      .mana-v9103-coach
      > div:not(
        .mana-v866-section-head
      ):not(
        #manaV95ClientChatCard
      ){
        display:none !important;
      }


      /*
        Separate weekly check-in card
        is hidden from Overview.
      */

      #manaV94CheckinCard{
        display:none !important;
      }


      #manaV95ClientChatCard{
        margin-top:
          14px !important;

        padding:
          15px !important;

        border:
          1px solid
          #40371a !important;

        border-radius:
          16px !important;

        background:
          #0a0a0a !important;
      }


      #manaV95ClientChatCard
      .mana-v950-card-kicker,
      #manaV95ClientChatCard
      .mana-v950-live{
        display:none !important;
      }


      #manaV95ClientChatCard
      .mana-v950-card-title{
        margin-top:
          0 !important;

        font-size:
          16px !important;
      }


      #manaV95ClientChatCard
      .mana-v950-card-preview{
        margin-top:
          5px !important;

        color:#888 !important;

        font-size:
          10px !important;

        line-height:
          1.45 !important;
      }


      #manaV95ClientChatCard
      .mana-v950-open{
        min-height:
          47px !important;

        margin-top:
          11px !important;

        border:
          0 !important;

        border-radius:
          14px !important;

        background:
          #f3d875 !important;

        color:#111 !important;

        font-size:
          12px !important;

        font-weight:
          900 !important;
      }


      @media(
        max-width:390px
      ){

        .mana-v9103-workout{
          padding:18px;
        }


        .mana-v9103-workout h3{
          font-size:22px;
        }


        .mana-v9103-week-grid{
          gap:7px;
        }


        .mana-v9103-week-card{
          padding:
            12px
            9px;
        }


        .mana-v9103-week-value{
          font-size:15px;
        }


        .mana-v9103-week-percent{
          font-size:12px;
        }

      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* =========================================
     START TODAY'S WORKOUT
     ========================================= */

  function startWorkout() {
    const index =
      nextWorkoutIndex();


    /*
      Go directly into the workout logger
      when available.
    */

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


    /*
      Fallback to Program tab.
    */

    document
      .querySelector(
        '#manaV83Tabs [data-v83-tab="program"]'
      )
      ?.click();
  }


  /* =========================================
     FULL WORKOUT CARD
     ========================================= */

  function buildWorkoutCard() {
    const holder =
      document.getElementById(
        "manaV83Content"
      );


    if (!holder) {
      return;
    }


    const next =
      holder.querySelector(
        ".mana-v866-next"
      );


    if (!next) {
      return;
    }


    const session =
      todaySession();


    if (!session) {
      return;
    }


    const sessionName =
      session[0] ||
      "Strength Session";


    const exercises =
      Array.isArray(
        session[1]
      )
        ? session[1]
        : [];


    const sessionNumber =
      nextWorkoutIndex() +
      1;


    next.className =
      "mana-v9103-workout";


    next.innerHTML = `

      <div
        class="mana-v9103-workout-label"
      >
        TODAY'S WORKOUT
      </div>


      <h3>
        ${esc(
          sessionName
        )}
      </h3>


      <div
        class="mana-v9103-session-label"
      >
        SESSION ${sessionNumber}
      </div>


      <div
        class="mana-v9103-exercises"
      >

        ${
          exercises
            .map(
              (
                exercise,
                index
              ) => `

                <div
                  class="mana-v9103-exercise"
                >

                  <div
                    class="mana-v9103-number"
                  >
                    ${index + 1}
                  </div>


                  <div>

                    <strong>
                      ${esc(
                        exercise?.[0] ||
                        "Exercise"
                      )}
                    </strong>


                    <span>
                      ${esc(
                        exercise?.[1] ||
                        ""
                      )}
                    </span>

                  </div>

                </div>

              `
            )
            .join("")
        }

      </div>


      <button
        type="button"
        class="mana-v9103-start"
        id="manaV9103Start"
      >
        START WORKOUT →
      </button>

    `;


    document
      .getElementById(
        "manaV9103Start"
      )
      ?.addEventListener(
        "click",
        startWorkout
      );


    const welcome =
      holder.querySelector(
        ".mana-v866-welcome"
      );


    if (welcome) {

      welcome.insertAdjacentElement(
        "afterend",
        next
      );

    }
  }


  /* =========================================
     DAILY FOCUS
     ========================================= */

  function moveDailyFocus() {
    const holder =
      document.getElementById(
        "manaV83Content"
      );


    const workout =
      holder
        ?.querySelector(
          ".mana-v9103-workout"
        );


    if (
      !holder ||
      !workout
    ) {
      return;
    }


    const focus =
      Array
        .from(
          holder.querySelectorAll(
            ".mana-v866-section"
          )
        )
        .find(
          section =>
            section
              .querySelector(
                ".mana-v866-section-head h3"
              )
              ?.textContent
              ?.trim() ===
              "Today's Focus"
        );


    if (focus) {

      workout.insertAdjacentElement(
        "afterend",
        focus
      );

    }
  }


  /* =========================================
     WEEKLY PROGRESS
     ========================================= */

  function progressCardHTML(
    label,
    current,
    target,
    unit,
    percent
  ) {
    return `

      <div
        class="mana-v9103-week-card"
      >

        <div
          class="mana-v9103-week-top"
        >

          <div
            class="mana-v9103-week-label"
          >
            ${esc(
              label
            )}
          </div>


          <div
            class="mana-v9103-week-percent"
          >
            ${percent}%
          </div>

        </div>


        <div
          class="mana-v9103-week-value"
        >
          ${current}
          /
          ${target}

          ${
            unit
              ? `
                <span>
                  ${esc(
                    unit
                  )}
                </span>
              `
              : ""
          }
        </div>


        <div
          class="mana-v9103-week-track"
        >

          <div
            class="mana-v9103-week-fill"
            style="
              width:${percent}%;
            "
          ></div>

        </div>

      </div>

    `;
  }


  function buildWeeklyProgress() {
    const holder =
      document.getElementById(
        "manaV83Content"
      );


    if (!holder) {
      return;
    }


    const focus =
      Array
        .from(
          holder.querySelectorAll(
            ".mana-v866-section"
          )
        )
        .find(
          section =>
            section
              .querySelector(
                ".mana-v866-section-head h3"
              )
              ?.textContent
              ?.trim() ===
              "Today's Focus"
        );


    if (!focus) {
      return;
    }


    let weekly =
      document.getElementById(
        WEEKLY_ID
      );


    if (!weekly) {

      weekly =
        document.createElement(
          "div"
        );


      weekly.id =
        WEEKLY_ID;

    }


    const fuel =
      weeklyFuelTotals();


    const workouts =
      weeklyWorkoutTotals();


    const caloriePercent =
      pct(
        fuel.calories.current,
        fuel.calories.target
      );


    const proteinPercent =
      pct(
        fuel.protein.current,
        fuel.protein.target
      );


    const waterPercent =
      pct(
        fuel.water.current,
        fuel.water.target
      );


    const workoutPercent =
      pct(
        workouts.current,
        workouts.target
      );


    const waterCurrent =
      (
        fuel.water.current /
        1000
      ).toFixed(
        1
      );


    const waterTarget =
      (
        fuel.water.target /
        1000
      ).toFixed(
        1
      );


    weekly.innerHTML = `

      <div
        class="mana-v9103-week-head"
      >

        <h3>
          This Week
        </h3>

        <span>
          WEEKLY PROGRESS
        </span>

      </div>


      <div
        class="mana-v9103-week-grid"
      >

        ${progressCardHTML(
          "Calories",

          formatNumber(
            fuel.calories.current
          ),

          formatNumber(
            fuel.calories.target
          ),

          "cal",

          caloriePercent
        )}


        ${progressCardHTML(
          "Protein",

          formatNumber(
            fuel.protein.current
          ),

          formatNumber(
            fuel.protein.target
          ),

          "g",

          proteinPercent
        )}


        ${progressCardHTML(
          "Water",

          waterCurrent,

          waterTarget,

          "L",

          waterPercent
        )}


        ${progressCardHTML(
          "Workouts",

          formatNumber(
            workouts.current
          ),

          formatNumber(
            workouts.target
          ),

          "",

          workoutPercent
        )}

      </div>


      <div
        class="mana-v9103-week-note"
      >
        Fuel totals show Monday to today
        against your full 7-day targets.
        Workouts show completed sessions
        against your planned training
        days for this week.
      </div>

    `;


    focus.insertAdjacentElement(
      "afterend",
      weekly
    );
  }


  /* =========================================
     COACH SUPPORT
     ========================================= */

  function simplifyCoachSupport() {
    const holder =
      document.getElementById(
        "manaV83Content"
      );


    const coach =
      holder
        ?.querySelector(
          ".mana-v866-coach"
        );


    if (
      !holder ||
      !coach
    ) {
      return;
    }


    coach.classList.add(
      "mana-v9103-coach"
    );


    const heading =
      coach.querySelector(
        ".mana-v866-section-head h3"
      );


    if (heading) {

      heading.textContent =
        "Coach Support";

    }


    const badge =
      coach.querySelector(
        ".mana-v866-section-head span"
      );


    if (badge) {

      badge.textContent =
        "MESSAGE";

    }


    /*
      Coach Support remains the
      final section on Overview.
    */

    holder.appendChild(
      coach
    );


    const chatButton =
      document.getElementById(
        "manaV95ClientOpen"
      );


    if (chatButton) {

      chatButton.textContent =
        "MESSAGE YOUR COACH →";

    }


    const chatTitle =
      document
        .getElementById(
          "manaV95ClientChatCard"
        )
        ?.querySelector(
          ".mana-v950-card-title"
        );


    if (chatTitle) {

      chatTitle.textContent =
        "Coach Chat";

    }
  }


  /* =========================================
     APPLY
     ========================================= */

  function applyLayout() {
    if (
      applying ||
      !strengthOverviewOpen()
    ) {
      return;
    }


    applying =
      true;


    try {

      buildWorkoutCard();

      moveDailyFocus();

      buildWeeklyProgress();

      simplifyCoachSupport();

    } finally {

      applying =
        false;

    }
  }


  /* =========================================
     WATCH
     ========================================= */

  function watch() {

    window.addEventListener(
      "mana:program-tab-change",
      () => {

        setTimeout(
          applyLayout,
          120
        );


        setTimeout(
          applyLayout,
          350
        );

      }
    );


    window.addEventListener(
      "mana:strength-synced",
      () => {

        setTimeout(
          applyLayout,
          120
        );


        setTimeout(
          applyLayout,
          350
        );

      }
    );


    window.addEventListener(
      "mana:profile-synced",
      () => {

        setTimeout(
          applyLayout,
          120
        );

      }
    );


    window.addEventListener(
      "mana:strength-membership-change",
      () => {

        setTimeout(
          applyLayout,
          150
        );

      }
    );


    window.addEventListener(
      "focus",
      () => {

        setTimeout(
          applyLayout,
          120
        );

      }
    );


    window.addEventListener(
      "storage",
      event => {

        if (
          [
            PROGRAM_KEY,
            LOG_KEY,
            FUEL_KEY,
            TARGET_KEY
          ].includes(
            event.key
          )
        ) {

          setTimeout(
            applyLayout,
            100
          );

        }

      }
    );


    let timer =
      null;


    const observer =
      new MutationObserver(
        () => {

          if (
            applying
          ) {
            return;
          }


          clearTimeout(
            timer
          );


          timer =
            setTimeout(
              applyLayout,
              100
            );

        }
      );


    observer.observe(
      document.body,
      {
        childList:true,
        subtree:true
      }
    );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {
    injectStyles();

    watch();


    [
      700,
      1200,
      1800,
      2600
    ].forEach(
      delay => {

        setTimeout(
          applyLayout,
          delay
        );

      }
    );
  }


  window.refreshManaStrengthOverviewLayout =
    applyLayout;


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
