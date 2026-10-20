/* =========================================
   MANA MOVEMENT TRAINING v10.17.0
   4-WEEK TRAINING BLOCK
   + PROGRAM UPGRADE REQUEST
   + FUEL READABILITY

   BUILD: 101700

   CLIENT
   -----------------------------------------
   - Week 1 / 2 / 3 / 4 selector
   - Training Block heading
   - Week-aware workout history
   - Request Program Upgrade
   - Progress snapshot sent to coach
   - Client request status
   - Next block ready notification

   COACH
   -----------------------------------------
   - Upgrade request in Client Hub
   - Client week / block
   - Recent training snapshot
   - Open Program Builder
   - Mark request In Progress
   - Mark Next Block Ready

   FUEL
   -----------------------------------------
   - Larger readable category copy
   - Larger Daily Target labels / values
   - No layout changes
   ========================================= */

(() => {
  "use strict";


  /* =========================================
     BUILD
     ========================================= */

  const BUILD =
    "101700";


  const STYLE_ID =
    "mana-v1017-program-block-style";


  const CLIENT_ROOT_ID =
    "manaV1017ProgramBlock";


  const COACH_ROOT_ID =
    "manaV1017CoachRequest";


  const REQUEST_TABLE =
    "program_upgrade_requests";


  const WEEK_KEY =
    "mana-strength-v1017-week";


  const BLOCK_KEY =
    "mana-strength-v1017-block";


  const LOG_KEY =
    "mana-strength-v64-logs";


  const CLIENT_SESSION_KEY =
    "mana-v1003-selected-client";


  let refreshTimer =
    null;


  let requestTimer =
    null;


  let coachTimer =
    null;


  let clientRequest =
    null;


  /* =========================================
     HELPERS
     ========================================= */

  const $ =
    id =>
      document.getElementById(
        id
      );


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
      )
      .replaceAll(
        "'",
        "&#039;"
      );

  }


  function clamp(
    value,
    min,
    max
  ) {

    return Math.max(

      min,

      Math.min(
        max,
        Number(value) || 0
      )

    );

  }


  function formatDate(
    value
  ) {

    if (!value) {

      return "";

    }


    try {

      return new Date(
        value
      )
        .toLocaleDateString(
          undefined,
          {
            day:
              "numeric",

            month:
              "short",

            year:
              "numeric"
          }
        );

    } catch (_) {

      return "";

    }

  }


  /* =========================================
     SUPABASE
     ========================================= */

  async function sb() {

    if (
      typeof
        window.supabaseClient ===
      "function"
    ) {

      return await
        window.supabaseClient();

    }


    throw new Error(
      "Mana Supabase client unavailable."
    );

  }


  async function currentUser() {

    const c =
      await sb();


    const {
      data,
      error
    } =
      await
        c.auth.getUser();


    if (error) {

      throw error;

    }


    return (
      data?.user ||
      null
    );

  }


  /* =========================================
     CURRENT PROGRAM
     ========================================= */

  function strengthOpen() {

    const shell =
      $(
        "manaV83ProgramShell"
      );


    const title =
      String(
        $(
          "manaV83Title"
        )
          ?.textContent ||
        ""
      )
        .trim()
        .toUpperCase();


    return Boolean(

      shell
        ?.classList
        .contains(
          "open"
        )

      &&

      title ===
        "MANA STRENGTH"

    );

  }


  function programTabOpen() {

    if (
      !strengthOpen()
    ) {

      return false;

    }


    return Boolean(

      document.querySelector(
        '#manaV83Tabs .mana-v83-tab.active[data-v83-tab="program"]'
      )

    );

  }


  function strengthProgram() {

    return safeJson(

      localStorage.getItem(
        "mana-strength-v62-program"
      ) || "null",

      null

    );

  }


  /* =========================================
     BLOCK + WEEK
     ========================================= */

  function activeWeek() {

    return clamp(

      Number(
        localStorage.getItem(
          WEEK_KEY
        ) || 1
      ),

      1,

      4

    );

  }


  function activeBlock() {

    return Math.max(

      1,

      Number(
        localStorage.getItem(
          BLOCK_KEY
        ) || 1
      ) || 1

    );

  }


  function setWeek(
    week
  ) {

    const value =
      clamp(
        week,
        1,
        4
      );


    localStorage.setItem(
      WEEK_KEY,
      String(value)
    );


    updateWeekUI();


    window.dispatchEvent(

      new CustomEvent(
        "mana:training-week-change",
        {
          detail:{
            week:
              value,

            block:
              activeBlock()
          }
        }
      )

    );

  }


  /* =========================================
     WORKOUT LOGS
     ========================================= */

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

    localStorage.setItem(

      LOG_KEY,

      JSON.stringify(
        logs
      )

    );

  }


  /*
    v6.4 already stores every completed
    workout as a new history entry.

    We simply add the current Week / Block
    context after completion so existing
    logging remains untouched.
  */

  function tagLatestWorkout() {

    const logs =
      loadLogs();


    if (
      !logs.length
    ) {

      return;

    }


    const latest =
      logs[
        logs.length - 1
      ];


    if (
      !latest ||
      latest.manaBlockBuild ===
        BUILD
    ) {

      return;

    }


    /*
      Only tag a freshly-created log.

      Avoid changing old history every time
      the page refreshes.
    */

    const when =
      new Date(
        latest.date || 0
      )
        .getTime();


    if (
      !when ||
      Date.now() - when >
        15000
    ) {

      return;

    }


    latest.trainingWeek =
      activeWeek();


    latest.trainingBlock =
      activeBlock();


    latest.manaBlockBuild =
      BUILD;


    saveLogs(
      logs
    );

  }


  /* =========================================
     PROGRESS SNAPSHOT
     ========================================= */

  function progressSnapshot() {

    const logs =
      loadLogs();


    const block =
      activeBlock();


    const blockLogs =
      logs.filter(
        log =>
          Number(
            log.trainingBlock || 1
          ) ===
          block
      );


    const weekData = {};


    for (
      let week = 1;
      week <= 4;
      week += 1
    ) {

      const weekLogs =
        blockLogs.filter(
          log =>
            Number(
              log.trainingWeek || 1
            ) ===
            week
        );


      weekData[
        `week${week}`
      ] = {

        workouts:
          weekLogs.length,

        totalVolume:
          Math.round(

            weekLogs.reduce(
              (
                total,
                log
              ) =>
                total +
                Number(
                  log.totalVolume || 0
                ),
              0
            )

          ),

        averageCompletion:
          weekLogs.length

            ? Math.round(

                weekLogs.reduce(
                  (
                    total,
                    log
                  ) =>
                    total +
                    Number(
                      log.completionPercent ||
                      0
                    ),
                  0
                )
                /
                weekLogs.length

              )

            : 0

      };

    }


    const recent =
      blockLogs
        .slice(
          -12
        )
        .map(
          log => ({

            date:
              log.date,

            week:
              Number(
                log.trainingWeek || 1
              ),

            workout:
              log.sessionName ||
              "Workout",

            completion:
              Number(
                log.completionPercent ||
                0
              ),

            volume:
              Math.round(
                Number(
                  log.totalVolume || 0
                )
              ),

            duration:
              Number(
                log.durationMinutes || 0
              )

          })
        );


    return {

      block,

      currentWeek:
        activeWeek(),

      workoutsCompleted:
        blockLogs.length,

      totalVolume:
        Math.round(

          blockLogs.reduce(
            (
              total,
              log
            ) =>
              total +
              Number(
                log.totalVolume || 0
              ),
            0
          )

        ),

      weeks:
        weekData,

      recent,

      capturedAt:
        new Date()
          .toISOString()

    };

  }


  /* =========================================
     FUEL READABILITY
     ========================================= */

  function installStyles() {

    $(
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

      /* =====================================
         FUEL READABILITY

         No card / image layout changes.
         ===================================== */

      #manaV1015Fuel
      .m1015-section-head h3{

        font-size:
          19px !important;

      }


      #manaV1015Fuel
      .m1015-section-head p{

        font-size:
          12px !important;

        line-height:
          1.45 !important;

      }


      #manaV1015Fuel
      .m1015-category-copy strong{

        font-size:
          16px !important;

        line-height:
          1.2 !important;

      }


      #manaV1015Fuel
      .m1015-category-copy small{

        font-size:
          11px !important;

        line-height:
          1.35 !important;

      }


      #manaV1015Fuel
      .m1015-target-label{

        font-size:
          10px !important;

        line-height:
          1.25 !important;

      }


      #manaV1015Fuel
      .m1015-target-value{

        font-size:
          19px !important;

        line-height:
          1.2 !important;

      }


      #manaV1015Fuel
      .m1015-target-value span{

        font-size:
          11px !important;

      }


      #manaV1015Fuel
      .m1015-control-row button{

        font-size:
          10px !important;

      }


      /* =====================================
         TRAINING BLOCK
         ===================================== */

      #${CLIENT_ROOT_ID}{

        margin:
          0 0 16px;

        border:
          1px solid
          #3d351b;

        border-radius:
          20px;

        overflow:
          hidden;

        background:

          radial-gradient(
            circle at top right,
            rgba(
              243,
              216,
              117,
              .08
            ),
            transparent 36%
          ),

          linear-gradient(
            145deg,
            #15130c,
            #080808
          );

      }


      .m1017-block-top{

        padding:
          18px 18px 14px;

      }


      .m1017-kicker{

        color:
          #f3d875;

        font-size:
          9px;

        font-weight:
          950;

        letter-spacing:
          .15em;

        text-transform:
          uppercase;

      }


      .m1017-title{

        margin:
          6px 0 4px;

        color:
          #fff;

        font-size:
          24px;

        font-weight:
          950;

        line-height:
          1.1;

      }


      .m1017-sub{

        color:
          #9a9a9a;

        font-size:
          11px;

        line-height:
          1.45;

      }


      /* WEEK SELECTOR */

      .m1017-weeks{

        display:
          grid;

        grid-template-columns:
          repeat(
            4,
            minmax(
              0,
              1fr
            )
          );

        gap:
          7px;

        padding:
          0 18px 16px;

      }


      .m1017-week{

        min-height:
          48px;

        border:
          1px solid
          #36342a;

        border-radius:
          13px;

        background:
          #0b0b0b;

        color:
          #888;

        font-size:
          10px;

        font-weight:
          950;

        cursor:
          pointer;

      }


      .m1017-week.active{

        border-color:
          #b18f2e;

        background:

          linear-gradient(
            145deg,
            #2a220b,
            #151108
          );

        color:
          #f3d875;

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
            .08
          );

      }


      /* REQUEST AREA */

      .m1017-request{

        padding:
          14px 18px 17px;

        border-top:
          1px solid
          #27251e;

        background:
          rgba(
            0,
            0,
            0,
            .20
          );

      }


      .m1017-request-head{

        display:
          flex;

        align-items:
          center;

        justify-content:
          space-between;

        gap:
          12px;

      }


      .m1017-request-title{

        color:
          #fff;

        font-size:
          13px;

        font-weight:
          950;

      }


      .m1017-request-text{

        margin-top:
          4px;

        color:
          #858585;

        font-size:
          10px;

        line-height:
          1.45;

      }


      .m1017-request-btn{

        min-height:
          43px;

        flex:
          0 0 auto;

        border:
          1px solid
          #a58727;

        border-radius:
          13px;

        padding:
          0 13px;

        background:
          linear-gradient(
            145deg,
            #f4d970,
            #c59b2c
          );

        color:
          #111;

        font-size:
          10px;

        font-weight:
          950;

        cursor:
          pointer;

      }


      .m1017-request-btn:disabled{

        cursor:
          default;

        opacity:
          .65;

      }


      .m1017-status{

        margin-top:
          10px;

        padding:
          10px 12px;

        border:
          1px solid
          #302b19;

        border-radius:
          12px;

        background:
          #0d0c09;

        color:
          #bca55b;

        font-size:
          10px;

        line-height:
          1.45;

      }


      .m1017-ready{

        border-color:
          #6f5b1e;

        color:
          #f3d875;

      }


      /* COACH REQUEST */

      #${COACH_ROOT_ID}{

        margin:
          0 0 14px;

        padding:
          16px;

        border:
          1px solid
          #5a4c20;

        border-radius:
          17px;

        background:

          linear-gradient(
            145deg,
            #17140b,
            #090909
          );

      }


      .m1017-coach-head{

        display:
          flex;

        justify-content:
          space-between;

        align-items:
          flex-start;

        gap:
          10px;

      }


      .m1017-coach-head h3{

        margin:
          4px 0 0;

        color:
          #fff;

        font-size:
          18px;

      }


      .m1017-pill{

        padding:
          5px 8px;

        border:
          1px solid
          #6d5920;

        border-radius:
          999px;

        color:
          #f3d875;

        font-size:
          8px;

        font-weight:
          950;

      }


      .m1017-coach-grid{

        display:
          grid;

        grid-template-columns:
          repeat(
            3,
            minmax(
              0,
              1fr
            )
          );

        gap:
          8px;

        margin-top:
          13px;

      }


      .m1017-stat{

        padding:
          10px;

        border:
          1px solid
          #292929;

        border-radius:
          12px;

        background:
          #0b0b0b;

      }


      .m1017-stat span{

        display:
          block;

        color:
          #777;

        font-size:
          8px;

        font-weight:
          900;

        text-transform:
          uppercase;

      }


      .m1017-stat strong{

        display:
          block;

        margin-top:
          4px;

        color:
          #f3d875;

        font-size:
          15px;

      }


      .m1017-coach-actions{

        display:
          grid;

        grid-template-columns:
          repeat(
            3,
            minmax(
              0,
              1fr
            )
          );

        gap:
          7px;

        margin-top:
          12px;

      }


      .m1017-coach-btn{

        min-height:
          42px;

        border:
          1px solid
          #393939;

        border-radius:
          12px;

        background:
          #0d0d0d;

        color:
          #d2d2d2;

        padding:
          7px 9px;

        font-size:
          9px;

        font-weight:
          950;

        cursor:
          pointer;

      }


      .m1017-coach-btn.gold{

        border-color:
          #9a7e27;

        color:
          #f3d875;

        background:
          #181407;

      }


      /* =====================================
         PHONE
         ===================================== */

      @media(max-width:600px){

        #manaV1015Fuel
        .m1015-target-label{

          font-size:
            9px !important;

        }


        #manaV1015Fuel
        .m1015-target-value{

          font-size:
            17px !important;

        }


        #manaV1015Fuel
        .m1015-target-value span{

          font-size:
            10px !important;

        }


        .m1017-block-top{

          padding:
            15px 14px 12px;

        }


        .m1017-title{

          font-size:
            21px;

        }


        .m1017-weeks{

          gap:
            5px;

          padding:
            0 14px 13px;

        }


        .m1017-week{

          min-height:
            43px;

          padding:
            0 3px;

          font-size:
            9px;

        }


        .m1017-request{

          padding:
            13px 14px 15px;

        }


        .m1017-request-head{

          align-items:
            stretch;

          flex-direction:
            column;

        }


        .m1017-request-btn{

          width:
            100%;

        }


        .m1017-coach-grid{

          grid-template-columns:
            1fr 1fr;

        }


        .m1017-coach-actions{

          grid-template-columns:
            1fr;

        }

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     REQUEST STATUS
     ========================================= */

  function requestStatusHtml() {

    if (
      !clientRequest
    ) {

      return "";

    }


    const status =
      String(
        clientRequest.status ||
        ""
      );


    if (
      status === "requested"
    ) {

      return `

        <div
          class="m1017-status"
        >
          ✓ Program upgrade requested
          ${formatDate(
            clientRequest.requested_at
          )}.
          Your coach can now review your
          current training block.
        </div>

      `;

    }


    if (
      status === "in_progress"
    ) {

      return `

        <div
          class="m1017-status"
        >
          Your coach is working on your
          next 4-week training block.
        </div>

      `;

    }


    if (
      status === "ready"
    ) {

      return `

        <div
          class="
            m1017-status
            m1017-ready
          "
        >
          ★ Your next training block is ready.
          Your coach has completed the upgrade.
        </div>

      `;

    }


    return "";

  }


  /* =========================================
     CLIENT BLOCK UI
     ========================================= */

  function blockHtml() {

    const program =
      strengthProgram();


    const days =
      Math.max(
        1,
        Number(
          program?.days || 4
        )
      );


    const week =
      activeWeek();


    const block =
      activeBlock();


    const pending =
      clientRequest &&
      [
        "requested",
        "in_progress"
      ].includes(
        clientRequest.status
      );


    return `

      <section
        id="${CLIENT_ROOT_ID}"
      >

        <div
          class="m1017-block-top"
        >

          <div
            class="m1017-kicker"
          >
            MANA STRENGTH
          </div>


          <div
            class="m1017-title"
          >
            My Strength Program
          </div>


          <div
            class="m1017-sub"
          >
            ${days}-Day Split
            •
            Training Block ${block}
            •
            Week ${week} of 4
          </div>

        </div>


        <div
          class="m1017-weeks"
        >

          ${
            [1,2,3,4]
              .map(
                number => `

                  <button
                    type="button"
                    class="
                      m1017-week
                      ${
                        number === week
                          ? "active"
                          : ""
                      }
                    "
                    data-m1017-week="${number}"
                  >
                    WEEK ${number}
                  </button>

                `
              )
              .join("")
          }

        </div>


        <div
          class="m1017-request"
        >

          <div
            class="m1017-request-head"
          >

            <div>

              <div
                class="m1017-request-title"
              >
                Ready for your next block?
              </div>


              <div
                class="m1017-request-text"
              >
                Request an upgrade anytime.
                Your coach receives your
                current block, week and
                recent workout history.
              </div>

            </div>


            <button
              type="button"
              class="m1017-request-btn"
              id="manaV1017Request"
              ${
                pending
                  ? "disabled"
                  : ""
              }
            >

              ${
                pending
                  ? "REQUEST SENT ✓"
                  : "REQUEST PROGRAM UPGRADE"
              }

            </button>

          </div>


          ${requestStatusHtml()}

        </div>

      </section>

    `;

  }


  function ensureClientBlock() {

    if (
      !programTabOpen()
    ) {

      return;

    }


    const holder =
      $(
        "manaV83Content"
      );


    if (!holder) {

      return;

    }


    let root =
      $(
        CLIENT_ROOT_ID
      );


    if (!root) {

      root =
        document.createElement(
          "div"
        );


      root.innerHTML =
        blockHtml();


      const built =
        root.firstElementChild;


      holder.prepend(
        built
      );

    } else {

      root.outerHTML =
        blockHtml();

    }


    bindClientBlock();

    updateWeekUI();

  }


  function bindClientBlock() {

    $(
      CLIENT_ROOT_ID
    )
      ?.querySelectorAll(
        "[data-m1017-week]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              setWeek(
                Number(
                  button.dataset
                    .m1017Week
                )
              );

            };

        }
      );


    const request =
      $(
        "manaV1017Request"
      );


    if (
      request &&
      !request.disabled
    ) {

      request.onclick =
        requestProgramUpgrade;

    }

  }


  /* =========================================
     WEEK LABELS ON WORKOUT CARDS
     ========================================= */

  function updateWeekUI() {

    const week =
      activeWeek();


    $(
      CLIENT_ROOT_ID
    )
      ?.querySelectorAll(
        "[data-m1017-week]"
      )
      .forEach(
        button => {

          button
            .classList
            .toggle(

              "active",

              Number(
                button.dataset
                  .m1017Week
              ) === week

            );

        }
      );


    document
      .querySelectorAll(
        "#manaV83Content .mana-v85-day"
      )
      .forEach(
        (
          card,
          index
        ) => {

          const label =
            card.querySelector(
              ".mana-v85-day-label"
            );


          if (label) {

            label.textContent =
              `WEEK ${week} • DAY ${
                index + 1
              }`;

          }

        }
      );


    const sub =
      $(
        CLIENT_ROOT_ID
      )
        ?.querySelector(
          ".m1017-sub"
        );


    const program =
      strengthProgram();


    if (sub) {

      sub.textContent =
        `${
          Number(
            program?.days || 4
          )
        }-Day Split • Training Block ${
          activeBlock()
        } • Week ${week} of 4`;

    }

  }


  /* =========================================
     LOAD CLIENT REQUEST
     ========================================= */

  async function loadClientRequest() {

    try {

      const c =
        await sb();


      const user =
        await currentUser();


      if (!user) {

        return;

      }


      const {
        data,
        error
      } =
        await
          c
            .from(
              REQUEST_TABLE
            )
            .select(
              "*"
            )
            .eq(
              "client_id",
              user.id
            )
            .order(
              "requested_at",
              {
                ascending:
                  false
              }
            )
            .limit(
              1
            );


      if (error) {

        throw error;

      }


      clientRequest =
        data?.[0] ||
        null;


      ensureClientBlock();

    } catch (
      err
    ) {

      console.warn(
        "Mana program request status:",
        err?.message ||
        err
      );

    }

  }


  /* =========================================
     REQUEST PROGRAM UPGRADE
     ========================================= */

  async function requestProgramUpgrade() {

    const button =
      $(
        "manaV1017Request"
      );


    if (button) {

      button.disabled =
        true;


      button.textContent =
        "SENDING…";

    }


    try {

      const c =
        await sb();


      const user =
        await currentUser();


      if (!user) {

        throw new Error(
          "Please sign in first."
        );

      }


      /*
        Do not create duplicate open requests.
      */

      const {
        data:
          existing,

        error:
          existingError
      } =
        await
          c
            .from(
              REQUEST_TABLE
            )
            .select(
              "id,status,requested_at"
            )
            .eq(
              "client_id",
              user.id
            )
            .in(
              "status",
              [
                "requested",
                "in_progress"
              ]
            )
            .order(
              "requested_at",
              {
                ascending:
                  false
              }
            )
            .limit(
              1
            );


      if (
        existingError
      ) {

        throw existingError;

      }


      if (
        existing?.length
      ) {

        clientRequest =
          existing[0];


        ensureClientBlock();

        return;

      }


      const program =
        strengthProgram();


      const payload = {

        client_id:
          user.id,

        program_name:
          program?.name ||
          program?.goal ||
          "Mana Strength",

        current_block:
          activeBlock(),

        current_week:
          activeWeek(),

        status:
          "requested",

        progress_snapshot:
          progressSnapshot()

      };


      const {
        data,
        error
      } =
        await
          c
            .from(
              REQUEST_TABLE
            )
            .insert(
              payload
            )
            .select(
              "*"
            )
            .single();


      if (error) {

        throw error;

      }


      clientRequest =
        data;


      ensureClientBlock();


      window.dispatchEvent(

        new CustomEvent(
          "mana:program-upgrade-requested",
          {
            detail:{
              request:
                data
            }
          }
        )

      );

    } catch (
      err
    ) {

      console.error(
        "Program upgrade request:",
        err
      );


      if (button) {

        button.disabled =
          false;


        button.textContent =
          "TRY AGAIN";

      }


      alert(
        "Could not send the program upgrade request yet. " +
        (
          err?.message ||
          ""
        )
      );

    }

  }


  /* =========================================
     SELECTED COACH CLIENT
     ========================================= */

  function selectedClient() {

    try {

      const value =
        safeJson(

          sessionStorage.getItem(
            CLIENT_SESSION_KEY
          ) || "null",

          null

        );


      if (
        value?.id
      ) {

        return {

          id:
            String(
              value.id
            ),

          name:
            String(
              value.name ||
              "Client"
            )

        };

      }

    } catch (_) {}


    return null;

  }


  function coachDetailOpen() {

    const view =
      $(
        "coachClientDetailView"
      );


    return Boolean(

      view

      &&

      !view.classList
        .contains(
          "hide"
        )

    );

  }


  /* =========================================
     COACH REQUEST UI
     ========================================= */

  function snapshotNumbers(
    request
  ) {

    const snapshot =
      request
        ?.progress_snapshot ||
      {};


    return {

      workouts:
        Number(
          snapshot.workoutsCompleted ||
          0
        ),

      volume:
        Number(
          snapshot.totalVolume ||
          0
        ),

      week:
        Number(
          request?.current_week ||
          snapshot.currentWeek ||
          1
        )

    };

  }


  function coachRequestHtml(
    request,
    client
  ) {

    const stats =
      snapshotNumbers(
        request
      );


    const status =
      String(
        request.status ||
        "requested"
      )
        .replaceAll(
          "_",
          " "
        )
        .toUpperCase();


    return `

      <section
        id="${COACH_ROOT_ID}"
      >

        <div
          class="m1017-coach-head"
        >

          <div>

            <div
              class="m1017-kicker"
            >
              PROGRAM UPGRADE REQUEST
            </div>


            <h3>
              ${esc(
                client.name
              )}
              •
              Block ${
                Number(
                  request.current_block ||
                  1
                )
              }
            </h3>

          </div>


          <span
            class="m1017-pill"
          >
            ${esc(status)}
          </span>

        </div>


        <div
          class="m1017-coach-grid"
        >

          <div
            class="m1017-stat"
          >
            <span>
              Current week
            </span>

            <strong>
              ${stats.week} / 4
            </strong>
          </div>


          <div
            class="m1017-stat"
          >
            <span>
              Workouts logged
            </span>

            <strong>
              ${stats.workouts}
            </strong>
          </div>


          <div
            class="m1017-stat"
          >
            <span>
              Training volume
            </span>

            <strong>
              ${
                Math.round(
                  stats.volume
                )
                  .toLocaleString()
              }
            </strong>
          </div>

        </div>


        <div
          class="m1017-request-text"
          style="
            margin-top:11px
          "
        >
          Requested
          ${esc(
            formatDate(
              request.requested_at
            )
          )}.
          Review the client's current
          progress, build or modify the next
          four-week block, then mark it ready.
        </div>


        <div
          class="m1017-coach-actions"
        >

          <button
            type="button"
            class="m1017-coach-btn"
            id="manaV1017CoachProgress"
          >
            MARK IN PROGRESS
          </button>


          <button
            type="button"
            class="
              m1017-coach-btn
              gold
            "
            id="manaV1017CoachBuilder"
          >
            OPEN PROGRAM BUILDER
          </button>


          <button
            type="button"
            class="
              m1017-coach-btn
              gold
            "
            id="manaV1017CoachReady"
          >
            MARK NEXT BLOCK READY
          </button>

        </div>

      </section>

    `;

  }


  async function loadCoachRequest() {

    if (
      !coachDetailOpen()
    ) {

      return;

    }


    const client =
      selectedClient();


    if (
      !client
    ) {

      return;

    }


    try {

      const c =
        await sb();


      const {
        data,
        error
      } =
        await
          c
            .from(
              REQUEST_TABLE
            )
            .select(
              "*"
            )
            .eq(
              "client_id",
              client.id
            )
            .in(
              "status",
              [
                "requested",
                "in_progress",
                "ready"
              ]
            )
            .order(
              "requested_at",
              {
                ascending:
                  false
              }
            )
            .limit(
              1
            );


      if (error) {

        throw error;

      }


      const request =
        data?.[0];


      $(
        COACH_ROOT_ID
      )
        ?.remove();


      if (
        !request
      ) {

        return;

      }


      const view =
        $(
          "coachClientDetailView"
        );


      const programCard =
        $(
          "manaV1003ClientProgramsCard"
        );


      const holder =
        document.createElement(
          "div"
        );


      holder.innerHTML =
        coachRequestHtml(
          request,
          client
        );


      const card =
        holder.firstElementChild;


      if (
        programCard
      ) {

        programCard
          .insertAdjacentElement(
            "beforebegin",
            card
          );

      } else {

        view
          ?.prepend(
            card
          );

      }


      bindCoachRequest(
        request,
        client
      );

    } catch (
      err
    ) {

      console.warn(
        "Coach upgrade request:",
        err?.message ||
        err
      );

    }

  }


  /* =========================================
     COACH ACTIONS
     ========================================= */

  async function updateRequest(
    request,
    status
  ) {

    try {

      const c =
        await sb();


      const coach =
        await currentUser();


      const {
        error
      } =
        await
          c
            .from(
              REQUEST_TABLE
            )
            .update({

              status,

              reviewed_at:
                new Date()
                  .toISOString(),

              reviewed_by:
                coach?.id ||
                null,

              updated_at:
                new Date()
                  .toISOString()

            })
            .eq(
              "id",
              request.id
            );


      if (error) {

        throw error;

      }


      loadCoachRequest();

    } catch (
      err
    ) {

      alert(
        "Could not update request: " +
        (
          err?.message ||
          ""
        )
      );

    }

  }


  function openProgramBuilder(
    client
  ) {

    try {

      sessionStorage.setItem(

        CLIENT_SESSION_KEY,

        JSON.stringify(
          client
        )

      );

    } catch (_) {}


    if (
      typeof
        window
          .openManaProgramBuilder ===
      "function"
    ) {

      window
        .openManaProgramBuilder({

          clientId:
            client.id,

          clientName:
            client.name

        });

    }

  }


  function bindCoachRequest(
    request,
    client
  ) {

    const progress =
      $(
        "manaV1017CoachProgress"
      );


    if (progress) {

      progress.onclick =
        () =>
          updateRequest(
            request,
            "in_progress"
          );

    }


    const builder =
      $(
        "manaV1017CoachBuilder"
      );


    if (builder) {

      builder.onclick =
        () => {

          updateRequest(
            request,
            "in_progress"
          );


          openProgramBuilder(
            client
          );

        };

    }


    const ready =
      $(
        "manaV1017CoachReady"
      );


    if (ready) {

      ready.onclick =
        () =>
          updateRequest(
            request,
            "ready"
          );

    }

  }


  /* =========================================
     CLIENT RENDER
     ========================================= */

  function refreshClient() {

    if (
      !programTabOpen()
    ) {

      return;

    }


    ensureClientBlock();


    clearTimeout(
      requestTimer
    );


    requestTimer =
      setTimeout(
        loadClientRequest,
        120
      );

  }


  /* =========================================
     COACH RENDER
     ========================================= */

  function refreshCoach() {

    if (
      !coachDetailOpen()
    ) {

      return;

    }


    clearTimeout(
      coachTimer
    );


    coachTimer =
      setTimeout(
        loadCoachRequest,
        160
      );

  }


  /* =========================================
     MASTER REFRESH
     ========================================= */

  function refresh() {

    installStyles();

    refreshClient();

    refreshCoach();

  }


  function scheduleRefresh(
    delay = 60
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
     WATCH DYNAMIC PROGRAM CONTENT
     ========================================= */

  function watchProgramContent() {

    const holder =
      $(
        "manaV83Content"
      );


    if (!holder) {

      return;

    }


    const observer =
      new MutationObserver(
        mutations => {

          if (
            !programTabOpen()
          ) {

            return;

          }


          /*
            v8.5 rebuilds the program holder.
            Only restore our header if it
            disappeared.
          */

          if (
            holder.querySelector(
              ".mana-v85-day"
            )

            &&

            !$(
              CLIENT_ROOT_ID
            )
          ) {

            scheduleRefresh(
              20
            );

          }

        }
      );


    observer.observe(
      holder,
      {
        childList:
          true,

        subtree:
          false
      }
    );

  }


  /* =========================================
     EVENTS
     ========================================= */

  function bindEvents() {

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            '#manaV83Tabs [data-v83-tab="program"]'
          )
        ) {

          scheduleRefresh(
            120
          );

        }


        if (
          event.target.closest(
            ".client-open, .m10091-action.view"
          )
        ) {

          setTimeout(
            refreshCoach,
            300
          );


          setTimeout(
            refreshCoach,
            700
          );

        }


        if (
          event.target.closest(
            "#backToCoachClients"
          )
        ) {

          $(
            COACH_ROOT_ID
          )
            ?.remove();

        }

      },
      true
    );


    window.addEventListener(
      "mana:program-tab-change",
      () => {

        scheduleRefresh(
          100
        );

      }
    );


    window.addEventListener(
      "mana:workout-progress-change",
      () => {

        setTimeout(
          tagLatestWorkout,
          60
        );


        setTimeout(
          updateWeekUI,
          120
        );

      }
    );


    window.addEventListener(
      "mana:program-upgrade-requested",
      () => {

        setTimeout(
          loadClientRequest,
          80
        );

      }
    );


    window.addEventListener(
      "focus",
      () => {

        if (
          programTabOpen()
        ) {

          loadClientRequest();

        }


        if (
          coachDetailOpen()
        ) {

          loadCoachRequest();

        }

      }
    );

  }


  /* =========================================
     PUBLIC API
     ========================================= */

  function expose() {

    window
      .refreshManaProgramBlock =
      refresh;


    window
      .requestManaProgramUpgrade =
      requestProgramUpgrade;


    window
      .MANA_PROGRAM_BLOCK_BUILD =
      BUILD;

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();

    expose();

    bindEvents();

    watchProgramContent();


    [
      700,
      1500
    ]
      .forEach(
        delay => {

          setTimeout(
            refresh,
            delay
          );

        }
      );


    console.log(
      "Mana Program Block Upgrade",
      BUILD
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
