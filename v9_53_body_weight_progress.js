/* =========================================
   MANA MOVEMENT TRAINING v9.53.0
   BODY WEIGHT — LIVE PROGRESS INTEGRATION

   - Targets the CURRENT v9.11 Progress page
   - Body weight logging
   - Starting / Current / Change
   - 7 day / 30 day trend
   - Recent check-ins
   - Uses existing v9.47 weight storage
   - No auth changes
   - No Fuel calculation changes
   - No MutationObserver
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "95300";


  const WEIGHT_KEY =
    "mana-strength-v947-body-weight";


  const PROFILE_KEY =
    "mana-profile-v67";


  const RANGE_KEY =
    "mana-strength-v953-weight-range";


  const STYLE_ID =
    "mana-v953-weight-style";


  const CARD_ID =
    "manaV953WeightCard";


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


  function loadProfile() {

    return safeJson(
      localStorage.getItem(
        PROFILE_KEY
      ) || "{}",
      {}
    );
  }


  function loadWeights() {

    const entries =
      safeJson(
        localStorage.getItem(
          WEIGHT_KEY
        ) || "[]",
        []
      );


    if (
      !Array.isArray(
        entries
      )
    ) {
      return [];
    }


    return entries
      .filter(
        item =>
          item &&
          Number(
            item.weight
          ) > 0 &&
          item.date
      )
      .map(
        item => ({
          ...item,
          weight:
            Number(
              item.weight
            )
        })
      )
      .sort(
        (a, b) =>
          new Date(
            `${a.date}T12:00:00`
          ) -
          new Date(
            `${b.date}T12:00:00`
          )
      );
  }


  function saveWeights(
    entries
  ) {

    localStorage.setItem(
      WEIGHT_KEY,
      JSON.stringify(
        entries
      )
    );


    window.dispatchEvent(
      new CustomEvent(
        "mana:body-weight-updated"
      )
    );
  }


  function today() {

    const date =
      new Date();


    const year =
      date.getFullYear();


    const month =
      String(
        date.getMonth() + 1
      ).padStart(
        2,
        "0"
      );


    const day =
      String(
        date.getDate()
      ).padStart(
        2,
        "0"
      );


    return `${year}-${month}-${day}`;
  }


  function formatDate(
    raw
  ) {

    const date =
      new Date(
        `${raw}T12:00:00`
      );


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return raw;
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


  function rangeDays() {

    return (
      Number(
        localStorage.getItem(
          RANGE_KEY
        )
      ) === 7
        ? 7
        : 30
    );
  }


  function periodEntries(
    days
  ) {

    const entries =
      loadWeights();


    const end =
      new Date();


    end.setHours(
      23,
      59,
      59,
      999
    );


    const start =
      new Date(
        end
      );


    start.setDate(
      start.getDate() -
      (
        days - 1
      )
    );


    start.setHours(
      0,
      0,
      0,
      0
    );


    return entries.filter(
      item => {

        const date =
          new Date(
            `${item.date}T12:00:00`
          );


        return (
          date >= start &&
          date <= end
        );
      }
    );
  }


  function summary() {

    const entries =
      loadWeights();


    const profileWeight =
      Number(
        loadProfile().weight ||
        0
      );


    const start =
      entries.length
        ? entries[0].weight
        : profileWeight;


    const current =
      entries.length
        ? entries[
            entries.length - 1
          ].weight
        : profileWeight;


    return {

      start,

      current,

      change:
        start &&
        current
          ? current - start
          : 0

    };
  }


  function changeText(
    value
  ) {

    const number =
      Number(
        value || 0
      );


    return `${
      number > 0
        ? "+"
        : ""
    }${number.toFixed(1)} kg`;
  }


  /* =========================================
     CHART
     ========================================= */

  function chartHtml(
    entries
  ) {

    if (
      entries.length < 2
    ) {

      return `

        <div
          class="mana-v953-empty"
        >
          Log at least two check-ins in
          this period to see your weight trend.
        </div>

      `;
    }


    const width =
      320;


    const height =
      130;


    const padX =
      20;


    const padTop =
      15;


    const padBottom =
      22;


    const values =
      entries.map(
        item =>
          item.weight
      );


    let min =
      Math.min(
        ...values
      );


    let max =
      Math.max(
        ...values
      );


    if (
      min === max
    ) {

      min -= 0.5;
      max += 0.5;

    } else {

      min -= 0.3;
      max += 0.3;
    }


    const innerWidth =
      width -
      padX * 2;


    const innerHeight =
      height -
      padTop -
      padBottom;


    const points =
      entries.map(
        (
          item,
          index
        ) => {

          const x =
            padX +
            (
              index /
              (
                entries.length - 1
              )
            ) *
            innerWidth;


          const ratio =
            (
              item.weight -
              min
            ) /
            (
              max -
              min
            );


          const y =
            padTop +
            innerHeight -
            ratio *
            innerHeight;


          return {
            x,
            y
          };
        }
      );


    const line =
      points
        .map(
          point =>
            `${point.x.toFixed(1)},${point.y.toFixed(1)}`
        )
        .join(" ");


    const dots =
      points
        .map(
          point => `

            <circle
              cx="${point.x.toFixed(1)}"
              cy="${point.y.toFixed(1)}"
              r="4"
              class="mana-v953-dot"
            ></circle>

          `
        )
        .join("");


    return `

      <div
        class="mana-v953-chart-shell"
      >

        <svg
          viewBox="0 0 ${width} ${height}"
          class="mana-v953-chart"
        >

          <line
            x1="${padX}"
            y1="${height - padBottom}"
            x2="${width - padX}"
            y2="${height - padBottom}"
            class="mana-v953-axis"
          ></line>

          <polyline
            points="${line}"
            class="mana-v953-line"
          ></polyline>

          ${dots}

        </svg>


        <div
          class="mana-v953-dates"
        >

          <span>
            ${formatDate(
              entries[0].date
            )}
          </span>

          <span>
            ${formatDate(
              entries[
                entries.length - 1
              ].date
            )}
          </span>

        </div>

      </div>

    `;
  }


  /* =========================================
     HISTORY
     ========================================= */

  function historyHtml() {

    const entries =
      loadWeights()
        .slice()
        .reverse()
        .slice(
          0,
          6
        );


    if (
      !entries.length
    ) {

      return `

        <div
          class="mana-v953-empty"
        >
          No body-weight check-ins yet.
        </div>

      `;
    }


    return entries
      .map(
        item => `

          <div
            class="mana-v953-history-row"
          >

            <span>
              ${formatDate(
                item.date
              )}
            </span>

            <strong>
              ${item.weight.toFixed(1)} kg
            </strong>

            <button
              type="button"
              data-v953-delete="${item.id}"
            >
              DELETE
            </button>

          </div>

        `
      )
      .join("");
  }


  /* =========================================
     STYLES
     ========================================= */

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
        margin:16px 0;

        padding:18px;

        border:
          1px solid
          #4a401d;

        border-radius:20px;

        background:
          linear-gradient(
            145deg,
            #14120b,
            #080808
          );
      }


      #${CARD_ID}
      .mana-v953-kicker{
        color:#f3d875;

        font-size:10px;

        font-weight:900;

        letter-spacing:.12em;
      }


      #${CARD_ID}
      h3{
        margin:
          5px
          0
          0;

        color:#fff;

        font-size:20px;
      }


      #${CARD_ID}
      .mana-v953-summary{
        display:grid;

        grid-template-columns:
          repeat(
            3,
            1fr
          );

        gap:8px;

        margin-top:14px;
      }


      #${CARD_ID}
      .mana-v953-stat{
        padding:11px;

        border:
          1px solid
          #292929;

        border-radius:13px;

        background:#0a0a0a;

        text-align:center;
      }


      #${CARD_ID}
      .mana-v953-stat span{
        display:block;

        color:#777;

        font-size:8px;

        font-weight:900;
      }


      #${CARD_ID}
      .mana-v953-stat strong{
        display:block;

        margin-top:5px;

        color:#f3d875;

        font-size:17px;
      }


      #${CARD_ID}
      .mana-v953-trend-head{
        display:flex;

        align-items:center;

        justify-content:
          space-between;

        gap:10px;

        margin-top:16px;

        padding-top:14px;

        border-top:
          1px solid
          #292929;
      }


      #${CARD_ID}
      .mana-v953-trend-title{
        font-size:13px;

        font-weight:900;

        color:#fff;
      }


      #${CARD_ID}
      .mana-v953-toggle{
        display:flex;

        padding:3px;

        gap:4px;

        border:
          1px solid
          #333;

        border-radius:999px;
      }


      #${CARD_ID}
      .mana-v953-toggle button{
        min-width:43px;

        min-height:29px;

        border:0;

        border-radius:999px;

        background:transparent;

        color:#777;

        font-size:9px;

        font-weight:900;
      }


      #${CARD_ID}
      .mana-v953-toggle button.active{
        background:#f3d875;

        color:#111;
      }


      #${CARD_ID}
      .mana-v953-chart-shell{
        margin-top:10px;

        padding:10px;

        border:
          1px solid
          #292929;

        border-radius:14px;

        background:#070707;
      }


      #${CARD_ID}
      .mana-v953-chart{
        display:block;

        width:100%;
      }


      #${CARD_ID}
      .mana-v953-axis{
        stroke:#292929;
      }


      #${CARD_ID}
      .mana-v953-line{
        fill:none;

        stroke:#f3d875;

        stroke-width:3;

        stroke-linecap:round;

        stroke-linejoin:round;
      }


      #${CARD_ID}
      .mana-v953-dot{
        fill:#f3d875;

        stroke:#111;

        stroke-width:2;
      }


      #${CARD_ID}
      .mana-v953-dates{
        display:flex;

        justify-content:
          space-between;

        color:#666;

        font-size:9px;
      }


      #${CARD_ID}
      .mana-v953-form{
        display:grid;

        grid-template-columns:
          1fr
          1fr;

        gap:8px;

        margin-top:15px;
      }


      #${CARD_ID}
      label{
        display:block;

        margin-bottom:5px;

        color:#777;

        font-size:9px;

        font-weight:900;
      }


      #${CARD_ID}
      input{
        width:100%;

        min-height:44px;

        margin:0;

        padding:10px;

        border:
          1px solid
          #333;

        border-radius:11px;

        background:#090909;

        color:#fff;
      }


      #${CARD_ID}
      .mana-v953-save{
        width:100%;

        min-height:45px;

        margin-top:8px;

        border:0;

        border-radius:12px;

        background:#f3d875;

        color:#111;

        font-weight:900;
      }


      #${CARD_ID}
      .mana-v953-history{
        margin-top:15px;

        padding-top:13px;

        border-top:
          1px solid
          #292929;
      }


      #${CARD_ID}
      .mana-v953-history-title{
        margin-bottom:7px;

        color:#777;

        font-size:9px;

        font-weight:900;
      }


      #${CARD_ID}
      .mana-v953-history-row{
        display:grid;

        grid-template-columns:
          1fr
          auto
          auto;

        gap:9px;

        align-items:center;

        min-height:38px;

        border-top:
          1px solid
          #202020;
      }


      #${CARD_ID}
      .mana-v953-history-row span{
        color:#777;

        font-size:10px;
      }


      #${CARD_ID}
      .mana-v953-history-row strong{
        color:#fff;

        font-size:11px;
      }


      #${CARD_ID}
      .mana-v953-history-row button{
        min-height:27px;

        padding:
          0
          7px;

        border:
          1px solid
          #3b2929;

        border-radius:7px;

        background:#0c0c0c;

        color:#a87979;

        font-size:8px;
      }


      #${CARD_ID}
      .mana-v953-empty{
        margin-top:10px;

        padding:12px;

        border:
          1px dashed
          #333;

        border-radius:12px;

        color:#777;

        font-size:10px;

        text-align:center;
      }


      @media(max-width:600px){

        #${CARD_ID}{
          padding:16px;
        }


        #${CARD_ID}
        .mana-v953-summary{
          gap:6px;
        }


        #${CARD_ID}
        .mana-v953-stat{
          padding:
            10px
            5px;
        }


        #${CARD_ID}
        .mana-v953-stat strong{
          font-size:15px;
        }

      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* =========================================
     RENDER
     ========================================= */

  function render() {

    const root =
      document.getElementById(
        "manaV9170Progress"
      );


    if (
      !root
    ) {
      return false;
    }


    document
      .getElementById(
        CARD_ID
      )
      ?.remove();


    const header =
      root.querySelector(
        ".mana-v9170-head"
      );


    const tabs =
      root.querySelector(
        ".mana-v9170-tabs"
      );


    if (
      !header ||
      !tabs
    ) {
      return false;
    }


    const stats =
      summary();


    const days =
      rangeDays();


    const period =
      periodEntries(
        days
      );


    const periodChange =
      period.length >= 2
        ? period[
            period.length - 1
          ].weight -
          period[0].weight
        : 0;


    const card =
      document.createElement(
        "div"
      );


    card.id =
      CARD_ID;


    card.innerHTML = `

      <div
        class="mana-v953-kicker"
      >
        BODY WEIGHT
      </div>

      <h3>
        Weight Progress
      </h3>


      <div
        class="mana-v953-summary"
      >

        <div
          class="mana-v953-stat"
        >
          <span>STARTING</span>

          <strong>
            ${
              stats.start
                ? `${stats.start.toFixed(1)} kg`
                : "—"
            }
          </strong>
        </div>


        <div
          class="mana-v953-stat"
        >
          <span>CURRENT</span>

          <strong>
            ${
              stats.current
                ? `${stats.current.toFixed(1)} kg`
                : "—"
            }
          </strong>
        </div>


        <div
          class="mana-v953-stat"
        >
          <span>CHANGE</span>

          <strong>
            ${
              stats.start &&
              stats.current
                ? changeText(
                    stats.change
                  )
                : "—"
            }
          </strong>
        </div>

      </div>


      <div
        class="mana-v953-trend-head"
      >

        <div
          class="mana-v953-trend-title"
        >
          Weight Trend
        </div>


        <div
          class="mana-v953-toggle"
        >

          <button
            type="button"
            data-v953-range="7"
            class="${
              days === 7
                ? "active"
                : ""
            }"
          >
            7D
          </button>

          <button
            type="button"
            data-v953-range="30"
            class="${
              days === 30
                ? "active"
                : ""
            }"
          >
            30D
          </button>

        </div>

      </div>


      <div
        class="mana-v953-summary"
      >

        <div
          class="mana-v953-stat"
        >
          <span>
            PERIOD CHANGE
          </span>

          <strong>
            ${
              period.length >= 2
                ? changeText(
                    periodChange
                  )
                : "—"
            }
          </strong>
        </div>


        <div
          class="mana-v953-stat"
        >
          <span>
            CHECK-INS
          </span>

          <strong>
            ${period.length}
          </strong>
        </div>

      </div>


      ${chartHtml(
        period
      )}


      <div
        class="mana-v953-form"
      >

        <div>
          <label>
            DATE
          </label>

          <input
            id="manaV953Date"
            type="date"
            value="${today()}"
          />
        </div>


        <div>
          <label>
            WEIGHT KG
          </label>

          <input
            id="manaV953Weight"
            type="number"
            step="0.1"
            min="30"
            max="300"
            inputmode="decimal"
            placeholder="e.g. 82.5"
          />
        </div>

      </div>


      <button
        type="button"
        id="manaV953Save"
        class="mana-v953-save"
      >
        LOG BODY WEIGHT
      </button>


      <div
        class="mana-v953-history"
      >

        <div
          class="mana-v953-history-title"
        >
          RECENT CHECK-INS
        </div>

        ${historyHtml()}

      </div>

    `;


    tabs.insertAdjacentElement(
      "afterend",
      card
    );


    bindCard();


    return true;
  }


  /* =========================================
     EVENTS
     ========================================= */

  function bindCard() {

    document
      .querySelectorAll(
        "[data-v953-range]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              localStorage.setItem(
                RANGE_KEY,
                button.dataset
                  .v953Range
              );


              render();
            };

        }
      );


    document
      .getElementById(
        "manaV953Save"
      )
      ?.addEventListener(
        "click",
        saveEntry
      );


    document
      .querySelectorAll(
        "[data-v953-delete]"
      )
      .forEach(
        button => {

          button.onclick =
            () =>
              deleteEntry(
                button.dataset
                  .v953Delete
              );

        }
      );
  }


  function saveEntry() {

    const date =
      document
        .getElementById(
          "manaV953Date"
        )
        ?.value;


    const weight =
      Number(
        document
          .getElementById(
            "manaV953Weight"
          )
          ?.value ||
        0
      );


    if (
      !date ||
      !weight ||
      weight < 30 ||
      weight > 300
    ) {

      alert(
        "Enter a valid date and body weight."
      );

      return;
    }


    let entries =
      loadWeights();


    entries =
      entries.filter(
        item =>
          item.date !==
          date
      );


    entries.push({

      id:
        `weight-${Date.now()}`,

      date,

      weight:
        Number(
          weight.toFixed(1)
        ),

      savedAt:
        new Date()
          .toISOString()

    });


    entries.sort(
      (a, b) =>
        new Date(
          a.date
        ) -
        new Date(
          b.date
        )
    );


    saveWeights(
      entries
    );


    render();


    if (
      typeof
        window
          .renderManaProgramSummary ===
      "function"
    ) {

      setTimeout(
        window
          .renderManaProgramSummary,
        100
      );
    }
  }


  function deleteEntry(
    id
  ) {

    if (
      !confirm(
        "Delete this body-weight entry?"
      )
    ) {
      return;
    }


    saveWeights(
      loadWeights()
        .filter(
          item =>
            item.id !==
            id
        )
    );


    render();
  }


  /* =========================================
     SAFE RETRIES
     ========================================= */

  function retryRender() {

    [
      100,
      250,
      500,
      900
    ].forEach(
      delay => {

        setTimeout(
          render,
          delay
        );

      }
    );
  }


  function wire() {

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            '#manaV83Tabs [data-v83-tab="progress"]'
          )
        ) {

          retryRender();

        }

      }
    );


    window.addEventListener(
      "mana:program-tab-change",
      retryRender
    );


    window.addEventListener(
      "mana:body-weight-updated",
      retryRender
    );


    window.addEventListener(
      "mana:strength-synced",
      retryRender
    );
  }


  function init() {

    injectStyles();

    wire();


    setTimeout(
      retryRender,
      1000
    );
  }


  window.MANA_BODY_WEIGHT_PROGRESS_BUILD =
    BUILD;


  window.renderManaBodyWeightProgress =
    render;


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
