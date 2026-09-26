/* =========================================
   MANA MOVEMENT TRAINING v9.38.0
   MANA LIFE — DAILY MANA

   PURPOSE:
   - Daily Overview check-in
   - Mood 1–5
   - Today's focus
   - Gratitude
   - Daily intention
   - Saves into existing Mana Life state
   - Syncs mood with existing Mana Life mood
   - Adds 7-day Daily Mana insight to Progress

   STORAGE:
   - mana-life-v933-state

   STABILITY:
   - Standalone upgrade file
   - No MutationObserver
   - No database changes
   - Does not alter Mana Strength / Mana 28
   ========================================= */

(() => {
  "use strict";

  const BUILD = "93800";
  const STATE_KEY = "mana-life-v933-state";
  const STYLE_ID = "mana-v938-daily-mana-style";
  const CARD_ID = "manaV938DailyManaCard";
  const PROGRESS_ID = "manaV938DailyManaProgress";

  let refreshTimer = null;

  const MOODS = [
    { value:1, label:"Rough" },
    { value:2, label:"Low" },
    { value:3, label:"Steady" },
    { value:4, label:"Good" },
    { value:5, label:"Strong" }
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
    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      )
        .padStart(
          2,
          "0"
        );

    const day =
      String(
        date.getDate()
      )
        .padStart(
          2,
          "0"
        );

    return `${year}-${month}-${day}`;
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


  function todayData() {
    const state =
      loadState();

    const day =
      state.days?.[
        dateKey()
      ] || {};

    const daily =
      day.dailyMana &&
      typeof day.dailyMana ===
        "object"
        ? day.dailyMana
        : {};

    return {
      mood:
        Number(
          daily.mood ||
          day.mood ||
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
        ),

      completed:
        Boolean(
          daily.completed
        ),

      updatedAt:
        String(
          daily.updated_at ||
          ""
        )
    };
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

      #${CARD_ID}{
        margin:9px 0;

        padding:18px;

        border:
          1px solid
          #51451d;

        border-radius:21px;

        background:
          radial-gradient(
            circle at 90% 0%,
            rgba(
              243,
              216,
              117,
              .10
            ),
            transparent 30%
          ),
          linear-gradient(
            145deg,
            #151307,
            #0a0a0a
          );
      }


      #${CARD_ID}
      .mana-v938-head{
        display:flex;
        justify-content:space-between;
        align-items:flex-start;
        gap:12px;
      }


      #${CARD_ID}
      .mana-v938-kicker,

      #${PROGRESS_ID}
      .mana-v938-kicker{
        color:#f3d875;

        font-size:11px;
        font-weight:900;

        letter-spacing:.11em;
      }


      #${CARD_ID}
      h3,

      #${PROGRESS_ID}
      h3{
        margin:
          6px
          0
          0;

        color:#fff;

        font-size:21px;

        line-height:1.3;
      }


      #${CARD_ID}
      .mana-v938-copy,

      #${PROGRESS_ID}
      .mana-v938-copy{
        margin-top:7px;

        color:#aaa;

        font-size:14px;

        line-height:1.6;
      }


      .mana-v938-done-pill{
        flex:
          0
          0
          auto;

        padding:
          7px
          9px;

        border:
          1px solid
          #51451d;

        border-radius:999px;

        background:#111006;

        color:#f3d875;

        font-size:9px;
        font-weight:900;

        letter-spacing:.06em;
      }


      .mana-v938-section{
        margin-top:16px;
      }


      .mana-v938-label{
        display:block;

        margin-bottom:8px;

        color:#aaa;

        font-size:10px;
        font-weight:900;

        letter-spacing:.08em;

        text-transform:
          uppercase;
      }


      .mana-v938-moods{
        display:grid;

        grid-template-columns:
          repeat(
            5,
            minmax(
              0,
              1fr
            )
          );

        gap:7px;
      }


      .mana-v938-mood{
        min-width:0;

        min-height:54px;

        padding:
          8px
          4px;

        border:
          1px solid
          #303030;

        border-radius:13px;

        background:#0a0a0a;

        color:#b8b8b8;

        cursor:pointer;

        touch-action:
          manipulation;
      }


      .mana-v938-mood strong{
        display:block;

        color:#fff;

        font-size:17px;
      }


      .mana-v938-mood span{
        display:block;

        margin-top:3px;

        font-size:9px;
      }


      .mana-v938-mood.active{
        border-color:#f3d875;

        background:#191607;
      }


      .mana-v938-mood.active strong,

      .mana-v938-mood.active span{
        color:#f3d875;
      }


      .mana-v938-field{
        width:100%;

        min-height:48px;

        padding:
          12px
          13px;

        border:
          1px solid
          #343434;

        border-radius:14px;

        background:#0b0b0b;

        color:#fff;

        font:inherit;

        font-size:14px;

        line-height:1.5;

        outline:none;
      }


      textarea.mana-v938-field{
        min-height:74px;

        resize:vertical;
      }


      .mana-v938-field:focus{
        border-color:#6b5b23;
      }


      .mana-v938-field::placeholder{
        color:#666;
      }


      .mana-v938-save{
        width:100%;

        min-height:54px;

        margin-top:16px;

        border:0;

        border-radius:15px;

        background:#f3d875;

        color:#111;

        font-size:13px;
        font-weight:900;

        cursor:pointer;

        touch-action:
          manipulation;
      }


      .mana-v938-status{
        min-height:18px;

        margin-top:8px;

        color:#9e9e9e;

        font-size:10px;

        text-align:center;
      }


      #${PROGRESS_ID}{
        margin:
          14px
          0;

        padding:18px;

        border:
          1px solid
          #51451d;

        border-radius:21px;

        background:
          linear-gradient(
            145deg,
            #151307,
            #0a0a0a
          );
      }


      .mana-v938-progress-stats{
        display:grid;

        grid-template-columns:
          repeat(
            3,
            minmax(
              0,
              1fr
            )
          );

        gap:9px;

        margin-top:14px;
      }


      .mana-v938-stat{
        min-width:0;

        padding:13px;

        border:
          1px solid
          #2d2d2d;

        border-radius:14px;

        background:#090909;
      }


      .mana-v938-stat span{
        display:block;

        color:#858585;

        font-size:9px;
        font-weight:900;

        letter-spacing:.05em;

        text-transform:
          uppercase;
      }


      .mana-v938-stat strong{
        display:block;

        margin-top:5px;

        color:#f3d875;

        font-size:21px;

        line-height:1.2;
      }


      .mana-v938-week{
        display:grid;

        grid-template-columns:
          repeat(
            7,
            minmax(
              0,
              1fr
            )
          );

        gap:6px;

        margin-top:14px;
      }


      .mana-v938-day{
        min-width:0;

        padding:
          9px
          3px;

        border:
          1px solid
          #292929;

        border-radius:11px;

        background:#090909;

        text-align:center;
      }


      .mana-v938-day span{
        display:block;

        color:#777;

        font-size:8px;
        font-weight:900;

        text-transform:
          uppercase;
      }


      .mana-v938-day strong{
        display:block;

        margin-top:5px;

        color:#555;

        font-size:16px;
      }


      .mana-v938-day.checked{
        border-color:#574a1e;

        background:#121005;
      }


      .mana-v938-day.checked strong{
        color:#f3d875;
      }


      .mana-v938-latest{
        margin-top:11px;

        padding:13px;

        border:
          1px solid
          #2d2d2d;

        border-radius:14px;

        background:#090909;
      }


      .mana-v938-latest strong{
        display:block;

        color:#f3d875;

        font-size:12px;
      }


      .mana-v938-latest div{
        margin-top:5px;

        color:#aaa;

        font-size:12px;

        line-height:1.55;
      }


      @media(
        max-width:560px
      ){

        #${CARD_ID},

        #${PROGRESS_ID}{
          padding:16px;
        }


        .mana-v938-moods{
          gap:5px;
        }


        .mana-v938-mood{
          min-height:52px;

          padding-left:2px;
          padding-right:2px;
        }


        .mana-v938-mood span{
          font-size:8px;
        }


        .mana-v938-progress-stats{
          grid-template-columns:
            1fr
            1fr;
        }


        .mana-v938-progress-stats
        .mana-v938-stat:last-child{
          grid-column:
            1 / -1;
        }


        .mana-v938-week{
          gap:4px;
        }


        .mana-v938-day{
          padding-left:1px;
          padding-right:1px;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  function overviewCardHtml() {
    const day =
      todayData();


    return `

      <div
        class="mana-v938-head"
      >

        <div>

          <div
            class="mana-v938-kicker"
          >
            DAILY MANA
          </div>


          <h3>
            Check in before the day runs you.
          </h3>


          <div
            class="mana-v938-copy"
          >
            Take a minute to notice where you are,
            what matters today and how you want to move.
          </div>

        </div>


        ${
          day.completed
            ? `

              <div
                class="mana-v938-done-pill"
              >
                SAVED ✓
              </div>

            `
            : ""
        }

      </div>


      <div
        class="mana-v938-section"
      >

        <span
          class="mana-v938-label"
        >
          How are you today?
        </span>


        <div
          class="mana-v938-moods"
        >

          ${MOODS
            .map(
              mood => `

                <button
                  type="button"

                  class="
                    mana-v938-mood
                    ${
                      day.mood ===
                      mood.value
                        ? "active"
                        : ""
                    }
                  "

                  data-v938-mood="${mood.value}"
                >

                  <strong>
                    ${mood.value}
                  </strong>


                  <span>
                    ${esc(
                      mood.label
                    )}
                  </span>

                </button>

              `
            )
            .join("")}

        </div>

      </div>


      <div
        class="mana-v938-section"
      >

        <label
          class="mana-v938-label"
          for="manaV938Focus"
        >
          Today's focus
        </label>


        <input
          class="mana-v938-field"
          id="manaV938Focus"
          maxlength="120"
          value="${esc(
            day.focus
          )}"
          placeholder="What deserves your energy today?"
        >

      </div>


      <div
        class="mana-v938-section"
      >

        <label
          class="mana-v938-label"
          for="manaV938Gratitude"
        >
          One thing I'm grateful for
        </label>


        <input
          class="mana-v938-field"
          id="manaV938Gratitude"
          maxlength="160"
          value="${esc(
            day.gratitude
          )}"
          placeholder="Something good that is still here."
        >

      </div>


      <div
        class="mana-v938-section"
      >

        <label
          class="mana-v938-label"
          for="manaV938Intention"
        >
          My intention
        </label>


        <textarea
          class="mana-v938-field"
          id="manaV938Intention"
          maxlength="240"
          placeholder="How do you want to show up today?"
        >${esc(
          day.intention
        )}</textarea>

      </div>


      <button
        type="button"
        class="mana-v938-save"
        id="manaV938Save"
      >
        SAVE TODAY'S CHECK-IN
      </button>


      <div
        class="mana-v938-status"
        id="manaV938Status"
      ></div>

    `;
  }


  function renderOverviewCard() {
    document
      .getElementById(
        CARD_ID
      )
      ?.remove();


    if (
      !lifeOpen() ||
      activeTab() !==
        "overview"
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


    const card =
      document.createElement(
        "div"
      );


    card.id =
      CARD_ID;


    card.innerHTML =
      overviewCardHtml();


    const routineCard =
      root.querySelector(
        ".mana-v933-card.gold"
      );


    if (
      routineCard
    ) {

      routineCard
        .insertAdjacentElement(
          "beforebegin",
          card
        );

    } else {

      const whakatauki =
        root.querySelector(
          ".mana-v933-whakatauki"
        );


      if (
        whakatauki
      ) {

        whakatauki
          .insertAdjacentElement(
            "afterend",
            card
          );

      } else {

        root.appendChild(
          card
        );
      }
    }


    wireOverviewCard();
  }


  function wireOverviewCard() {
    document
      .querySelectorAll(
        "[data-v938-mood]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              document
                .querySelectorAll(
                  "[data-v938-mood]"
                )
                .forEach(
                  item =>
                    item
                      .classList
                      .remove(
                        "active"
                      )
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


    document
      .getElementById(
        "manaV938Save"
      )
      ?.addEventListener(
        "click",
        saveDailyMana
      );
  }


  function selectedMood() {
    return Number(
      document
        .querySelector(
          "[data-v938-mood].active"
        )
        ?.dataset
        ?.v938Mood ||
      0
    );
  }


  function saveDailyMana() {
    const mood =
      selectedMood();


    const focus =
      document
        .getElementById(
          "manaV938Focus"
        )
        ?.value
        ?.trim() ||
      "";


    const gratitude =
      document
        .getElementById(
          "manaV938Gratitude"
        )
        ?.value
        ?.trim() ||
      "";


    const intention =
      document
        .getElementById(
          "manaV938Intention"
        )
        ?.value
        ?.trim() ||
      "";


    const status =
      document.getElementById(
        "manaV938Status"
      );


    if (!mood) {

      if (status) {
        status.textContent =
          "Choose your mood first.";
      }


      return;
    }


    const state =
      loadState();


    const key =
      dateKey();


    state.days[key] =
      state.days[key] ||
      {};


    state.days[key].mood =
      mood;


    state.days[key].dailyMana = {
      mood,
      focus,
      gratitude,
      intention,
      completed:true,

      updated_at:
        new Date()
          .toISOString()
    };


    saveState(
      state
    );


    if (status) {
      status.textContent =
        "Daily Mana saved ✓";
    }


    setTimeout(
      () => {

        queueRefresh(
          30
        );

      },
      80
    );
  }


  function weekData() {
    const state =
      loadState();


    const rows =
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


      const day =
        state.days?.[
          key
        ] ||
        {};


      const daily =
        day.dailyMana &&
        typeof day.dailyMana ===
          "object"
          ? day.dailyMana
          : {};


      const date =
        new Date(
          `${key}T12:00:00`
        );


      rows.push({
        key,

        label:
          date
            .toLocaleDateString(
              undefined,
              {
                weekday:
                  "short"
              }
            ),

        completed:
          Boolean(
            daily.completed
          ),

        mood:
          Number(
            daily.mood ||
            day.mood ||
            0
          ),

        focus:
          String(
            daily.focus ||
            ""
          ),

        intention:
          String(
            daily.intention ||
            ""
          )
      });
    }


    return rows;
  }


  function renderProgressCard() {
    document
      .getElementById(
        PROGRESS_ID
      )
      ?.remove();


    if (
      !lifeOpen() ||
      activeTab() !==
        "progress"
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


    const week =
      weekData();


    const completed =
      week.filter(
        item =>
          item.completed
      );


    const moods =
      completed
        .map(
          item =>
            item.mood
        )
        .filter(
          value =>
            value > 0
        );


    const average =
      moods.length
        ? (
            moods.reduce(
              (
                sum,
                value
              ) =>
                sum +
                value,
              0
            ) /
            moods.length
          )
            .toFixed(
              1
            )
        : "—";


    const latest =
      [
        ...completed
      ]
        .reverse()[0];


    const card =
      document.createElement(
        "div"
      );


    card.id =
      PROGRESS_ID;


    card.innerHTML = `

      <div
        class="mana-v938-kicker"
      >
        DAILY MANA
      </div>


      <h3>
        Your check-in pattern
      </h3>


      <div
        class="mana-v938-copy"
      >
        This is not about having a perfect week.
        It is about noticing patterns and staying connected
        to what you are doing with the day.
      </div>


      <div
        class="mana-v938-progress-stats"
      >

        <div
          class="mana-v938-stat"
        >

          <span>
            Check-ins
          </span>


          <strong>
            ${completed.length}/7
          </strong>

        </div>


        <div
          class="mana-v938-stat"
        >

          <span>
            Avg mood
          </span>


          <strong>
            ${average}
          </strong>

        </div>


        <div
          class="mana-v938-stat"
        >

          <span>
            Today
          </span>


          <strong>
            ${
              week[
                week.length - 1
              ]
                ?.completed
                ? "✓"
                : "—"
            }
          </strong>

        </div>

      </div>


      <div
        class="mana-v938-week"
      >

        ${week
          .map(
            item => `

              <div
                class="
                  mana-v938-day
                  ${
                    item.completed
                      ? "checked"
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
                  ${
                    item.mood ||
                    "–"
                  }
                </strong>

              </div>

            `
          )
          .join("")}

      </div>


      <div
        class="mana-v938-latest"
      >

        <strong>
          Latest intention
        </strong>


        <div>
          ${
            latest
              ? esc(
                  latest.intention ||
                  latest.focus ||
                  "Check-in completed."
                )
              : "Complete your first Daily Mana check-in and it will appear here."
          }
        </div>

      </div>

    `;


    const resetCard =
      document.getElementById(
        "manaV937ResetProgressCard"
      );


    if (
      resetCard
    ) {

      resetCard
        .insertAdjacentElement(
          "afterend",
          card
        );


      return;
    }


    const grid =
      root.querySelector(
        ".mana-v933-grid"
      );


    if (
      grid
    ) {

      grid
        .insertAdjacentElement(
          "afterend",
          card
        );

    } else {

      root.appendChild(
        card
      );
    }
  }


  function queueRefresh(
    delay = 80
  ) {
    clearTimeout(
      refreshTimer
    );


    refreshTimer =
      setTimeout(
        () => {

          renderOverviewCard();

          renderProgressCard();

        },
        delay
      );
  }


  function watch() {
    window.addEventListener(
      "mana:program-tab-change",
      () => {

        queueRefresh(
          100
        );

      }
    );


    window.addEventListener(
      "mana:life-updated",
      () => {

        queueRefresh(
          130
        );

      }
    );


    window.addEventListener(
      "focus",
      () => {

        queueRefresh(
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

          queueRefresh(
            120
          );
        }

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

          queueRefresh(
            150
          );
        }

      },
      true
    );
  }


  function init() {
    injectStyles();

    watch();

    queueRefresh(
      220
    );
  }


  window.MANA_LIFE_DAILY_MANA_BUILD =
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
