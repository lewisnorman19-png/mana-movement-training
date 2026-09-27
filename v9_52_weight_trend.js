/* =========================================
   MANA MOVEMENT TRAINING v9.52.0
   BODY WEIGHT TREND

   - 7 day / 30 day toggle
   - Simple body-weight trend chart
   - Window change
   - Check-in count
   - Uses existing v9.47 body-weight data
   - Mobile friendly

   IMPORTANT
   - No auth changes
   - No Fuel calculation changes
   - No MutationObserver
   - No polling
   ========================================= */

(() => {
  "use strict";


  const BUILD =
    "95200";


  const WEIGHT_KEY =
    "mana-strength-v947-body-weight";


  const RANGE_KEY =
    "mana-strength-v952-weight-range";


  const STYLE_ID =
    "mana-v952-weight-trend-style";


  const TREND_ID =
    "manaV952WeightTrend";


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
        (
          a,
          b
        ) =>
          new Date(
            `${a.date}T12:00:00`
          ) -
          new Date(
            `${b.date}T12:00:00`
          )
      );
  }


  function rangeDays() {

    const saved =
      Number(
        localStorage.getItem(
          RANGE_KEY
        ) || 30
      );


    return (
      saved === 7
        ? 7
        : 30
    );
  }


  function saveRange(
    days
  ) {

    localStorage.setItem(
      RANGE_KEY,
      String(
        days === 7
          ? 7
          : 30
      )
    );
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


  function windowEntries(
    days
  ) {

    const all =
      loadWeights();


    if (
      !all.length
    ) {
      return [];
    }


    const now =
      new Date();


    now.setHours(
      23,
      59,
      59,
      999
    );


    const start =
      new Date(
        now
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


    return all.filter(
      item => {

        const date =
          new Date(
            `${item.date}T12:00:00`
          );


        return (
          date >= start &&
          date <= now
        );
      }
    );
  }


  function changeText(
    entries
  ) {

    if (
      entries.length < 2
    ) {
      return "—";
    }


    const first =
      Number(
        entries[0].weight
      );


    const last =
      Number(
        entries[
          entries.length - 1
        ].weight
      );


    const change =
      last - first;


    const prefix =
      change > 0
        ? "+"
        : "";


    return (
      `${prefix}${change.toFixed(1)} kg`
    );
  }


  /* =========================================
     SVG CHART
     ========================================= */

  function chartHtml(
    entries
  ) {

    if (
      entries.length < 2
    ) {

      return `

        <div
          class="mana-v952-empty"
        >
          Log at least two body-weight
          check-ins in this period to see
          your trend.
        </div>

      `;
    }


    const width =
      320;


    const height =
      130;


    const padX =
      18;


    const padTop =
      16;


    const padBottom =
      24;


    const weights =
      entries.map(
        item =>
          Number(
            item.weight
          )
      );


    let min =
      Math.min(
        ...weights
      );


    let max =
      Math.max(
        ...weights
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
      (
        padX * 2
      );


    const innerHeight =
      height -
      padTop -
      padBottom;


    const points =
      entries
        .map(
          (
            item,
            index
          ) => {

            const x =
              entries.length === 1
                ? width / 2
                : padX +
                  (
                    index /
                    (
                      entries.length - 1
                    )
                  ) *
                  innerWidth;


            const ratio =
              (
                Number(
                  item.weight
                ) -
                min
              ) /
              (
                max -
                min
              );


            const y =
              padTop +
              innerHeight -
              (
                ratio *
                innerHeight
              );


            return {
              x,
              y,
              item
            };
          }
        );


    const polyline =
      points
        .map(
          point =>
            `${point.x.toFixed(1)},${point.y.toFixed(1)}`
        )
        .join(" ");


    const circles =
      points
        .map(
          point => `

            <circle
              cx="${point.x.toFixed(1)}"
              cy="${point.y.toFixed(1)}"
              r="4"
              class="mana-v952-point"
            ></circle>

          `
        )
        .join("");


    const first =
      entries[0];


    const last =
      entries[
        entries.length - 1
      ];


    return `

      <div
        class="mana-v952-chart-wrap"
      >

        <svg
          class="mana-v952-chart"
          viewBox="0 0 ${width} ${height}"
          role="img"
          aria-label="Body weight trend"
        >

          <line
            x1="${padX}"
            y1="${height - padBottom}"
            x2="${width - padX}"
            y2="${height - padBottom}"
            class="mana-v952-axis"
          ></line>

          <polyline
            points="${polyline}"
            class="mana-v952-line"
          ></polyline>

          ${circles}

        </svg>


        <div
          class="mana-v952-chart-labels"
        >

          <span>
            ${formatDate(
              first.date
            )}
          </span>

          <span>
            ${formatDate(
              last.date
            )}
          </span>

        </div>

      </div>

    `;
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

      #${TREND_ID}{
        margin-top:15px;

        padding-top:15px;

        border-top:
          1px solid
          #292929;
      }


      #${TREND_ID}
      .mana-v952-top{
        display:flex;

        align-items:center;

        justify-content:
          space-between;

        gap:12px;
      }


      #${TREND_ID}
      .mana-v952-title{
        color:#fff;

        font-size:14px;

        font-weight:900;
      }


      #${TREND_ID}
      .mana-v952-toggle{
        display:flex;

        gap:5px;

        padding:3px;

        border:
          1px solid
          #333;

        border-radius:999px;

        background:#090909;
      }


      #${TREND_ID}
      .mana-v952-range{
        min-width:43px;

        min-height:29px;

        padding:
          0
          9px;

        border:0;

        border-radius:999px;

        background:transparent;

        color:#777;

        font-size:9px;

        font-weight:900;
      }


      #${TREND_ID}
      .mana-v952-range.active{
        background:#f3d875;

        color:#111;
      }


      #${TREND_ID}
      .mana-v952-stats{
        display:grid;

        grid-template-columns:
          1fr
          1fr;

        gap:8px;

        margin-top:12px;
      }


      #${TREND_ID}
      .mana-v952-stat{
        padding:
          10px
          12px;

        border:
          1px solid
          #292929;

        border-radius:12px;

        background:#0a0a0a;
      }


      #${TREND_ID}
      .mana-v952-stat span{
        display:block;

        color:#777;

        font-size:8px;

        font-weight:800;

        letter-spacing:.05em;

        text-transform:uppercase;
      }


      #${TREND_ID}
      .mana-v952-stat strong{
        display:block;

        margin-top:4px;

        color:#f3d875;

        font-size:16px;
      }


      #${TREND_ID}
      .mana-v952-chart-wrap{
        margin-top:12px;

        padding:
          10px
          10px
          7px;

        border:
          1px solid
          #2d2d2d;

        border-radius:14px;

        background:#080808;
      }


      #${TREND_ID}
      .mana-v952-chart{
        display:block;

        width:100%;

        height:auto;
      }


      #${TREND_ID}
      .mana-v952-axis{
        stroke:#282828;

        stroke-width:1;
      }


      #${TREND_ID}
      .mana-v952-line{
        fill:none;

        stroke:#f3d875;

        stroke-width:3;

        stroke-linecap:round;

        stroke-linejoin:round;
      }


      #${TREND_ID}
      .mana-v952-point{
        fill:#f3d875;

        stroke:#141414;

        stroke-width:2;
      }


      #${TREND_ID}
      .mana-v952-chart-labels{
        display:flex;

        justify-content:
          space-between;

        margin-top:-3px;

        color:#666;

        font-size:9px;
      }


      #${TREND_ID}
      .mana-v952-empty{
        margin-top:12px;

        padding:
          14px;

        border:
          1px dashed
          #333;

        border-radius:13px;

        color:#777;

        font-size:10px;

        line-height:1.5;

        text-align:center;
      }


      @media(
        max-width:600px
      ){

        #${TREND_ID}
        .mana-v952-stat strong{
          font-size:15px;
        }


        #${TREND_ID}
        .mana-v952-chart-wrap{
          padding:
            8px
            8px
            6px;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  /* =========================================
     RENDER
     ========================================= */

  function renderTrend() {

    const weightCard =
      document.querySelector(
        "#manaV83Content .mana-v947-weight"
      );


    if (
      !weightCard
    ) {
      return;
    }


    weightCard
      .querySelector(
        `#${TREND_ID}`
      )
      ?.remove();


    const summary =
      weightCard.querySelector(
        ".mana-v947-weight-summary"
      );


    const form =
      weightCard.querySelector(
        ".mana-v947-weight-form"
      );


    if (
      !summary ||
      !form
    ) {
      return;
    }


    const days =
      rangeDays();


    const entries =
      windowEntries(
        days
      );


    const current =
      entries.length
        ? Number(
            entries[
              entries.length - 1
            ].weight
          )
        : 0;


    const block =
      document.createElement(
        "div"
      );


    block.id =
      TREND_ID;


    block.innerHTML = `

      <div
        class="mana-v952-top"
      >

        <div
          class="mana-v952-title"
        >
          Weight Trend
        </div>


        <div
          class="mana-v952-toggle"
        >

          <button
            type="button"
            class="
              mana-v952-range
              ${
                days === 7
                  ? "active"
                  : ""
              }
            "
            data-v952-range="7"
          >
            7D
          </button>

          <button
            type="button"
            class="
              mana-v952-range
              ${
                days === 30
                  ? "active"
                  : ""
              }
            "
            data-v952-range="30"
          >
            30D
          </button>

        </div>

      </div>


      <div
        class="mana-v952-stats"
      >

        <div
          class="mana-v952-stat"
        >

          <span>
            Period change
          </span>

          <strong>
            ${changeText(
              entries
            )}
          </strong>

        </div>


        <div
          class="mana-v952-stat"
        >

          <span>
            Check-ins
          </span>

          <strong>
            ${entries.length}
          </strong>

        </div>

      </div>


      ${chartHtml(
        entries
      )}

    `;


    form.insertAdjacentElement(
      "beforebegin",
      block
    );


    block
      .querySelectorAll(
        "[data-v952-range]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              saveRange(
                Number(
                  button.dataset
                    .v952Range
                )
              );


              renderTrend();

            }
          );

        }
      );
  }


  /* =========================================
     SAFE SCHEDULING
     ========================================= */

  function scheduleTrend(
    delay = 220
  ) {

    setTimeout(
      renderTrend,
      delay
    );
  }


  function wireEvents() {

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            '#manaV83Tabs [data-v83-tab="progress"]'
          )
        ) {

          scheduleTrend(
            260
          );

        }

      }
    );


    window.addEventListener(
      "mana:program-tab-change",
      () => {

        scheduleTrend(
          250
        );

      }
    );


    window.addEventListener(
      "mana:body-weight-updated",
      () => {

        /*
          v9.47 rebuilds the Weight card first.
          Give it time, then restore trend.
        */

        scheduleTrend(
          180
        );


        scheduleTrend(
          350
        );

      }
    );


    window.addEventListener(
      "focus",
      () => {

        scheduleTrend(
          180
        );

      }
    );
  }


  function init() {

    injectStyles();

    wireEvents();


    /*
      One safe initial check.
    */

    setTimeout(
      renderTrend,
      1200
    );
  }


  window.MANA_WEIGHT_TREND_BUILD =
    BUILD;


  window.renderManaWeightTrend =
    renderTrend;


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
