/* =========================================
   MANA MOVEMENT TRAINING v9.37.0
   MANA LIFE — RESET NOW 2.0

   PURPOSE:
   - Animate the breathing step
   - Add inhale / hold / exhale guidance
   - Add a whakataukī inside Reset Now
   - Add a completion summary
   - Add Reset activity into Mana Life Progress

   WORKS WITH:
   - v9_36_mana_life_reset.js

   STORAGE:
   - mana-life-v933-state

   STABILITY:
   - No MutationObserver
   - No database changes
   - Does not alter Mana Strength / Mana 28
   ========================================= */

(() => {
  "use strict";

  const BUILD = "93700";
  const STATE_KEY = "mana-life-v933-state";
  const STYLE_ID = "mana-v937-reset-upgrade-style";
  const MODAL_ID = "manaV936ResetModal";
  const PROGRESS_CARD_ID = "manaV937ResetProgressCard";
  const WHAKATAUKI_ID = "manaV937ResetWhakatauki";
  const BREATH_CUE_ID = "manaV937BreathCue";
  const SUMMARY_ID = "manaV937ResetSummary";

  let breathGuideTimer = null;
  let wrappedOpen = false;
  let selectedEmotion = "";
  let selectedMovement = "";
  let selectedAction = "";
  let refreshTimer = null;

  const ACTION_LABELS = {
    pause:"Send nothing yet",
    write:"Write it privately",
    support:"Talk to someone",
    task:"Complete one useful task"
  };


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


  function loadState() {
    return safeJson(
      localStorage.getItem(
        STATE_KEY
      ) || "{}",
      {}
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

      #${WHAKATAUKI_ID}{
        margin:
          16px
          0
          2px;

        padding:
          14px
          15px;

        border-left:
          4px solid
          #f3d875;

        border-radius:
          0
          14px
          14px
          0;

        background:
          linear-gradient(
            145deg,
            #151307,
            #0a0a0a
          );
      }


      #${WHAKATAUKI_ID}
      .mana-v937-label{
        color:#918148;

        font-size:10px;
        font-weight:900;

        letter-spacing:.11em;
      }


      #${WHAKATAUKI_ID}
      strong{
        display:block;

        margin-top:6px;

        color:#f3d875;

        font-size:16px;

        line-height:1.45;
      }


      #${WHAKATAUKI_ID}
      span{
        display:block;

        margin-top:5px;

        color:#b9b9b9;

        font-size:13px;

        line-height:1.55;
      }


      #manaV936ResetModal
      .mana-v936-breathe-circle{
        transition:
          transform 4s ease-in-out,
          box-shadow 4s ease-in-out,
          background 4s ease-in-out;
      }


      #manaV936ResetModal
      .mana-v936-breathe-circle.mana-v937-inhale{
        transform:
          scale(
            1.12
          );

        box-shadow:
          0
          0
          58px
          rgba(
            243,
            216,
            117,
            .22
          );

        background:
          radial-gradient(
            circle,
            #2a240c,
            #080808 70%
          );
      }


      #manaV936ResetModal
      .mana-v936-breathe-circle.mana-v937-hold{
        transform:
          scale(
            1.12
          );

        box-shadow:
          0
          0
          48px
          rgba(
            243,
            216,
            117,
            .18
          );
      }


      #manaV936ResetModal
      .mana-v936-breathe-circle.mana-v937-exhale{
        transform:
          scale(
            .94
          );

        box-shadow:
          0
          0
          24px
          rgba(
            243,
            216,
            117,
            .08
          );

        transition-duration:
          6s;
      }


      #${BREATH_CUE_ID}{
        min-height:48px;

        margin:
          12px
          auto
          0;

        text-align:center;
      }


      #${BREATH_CUE_ID}
      strong{
        display:block;

        color:#f3d875;

        font-size:18px;

        letter-spacing:.08em;
      }


      #${BREATH_CUE_ID}
      span{
        display:block;

        margin-top:4px;

        color:#9e9e9e;

        font-size:12px;
      }


      #${SUMMARY_ID}{
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


      #${SUMMARY_ID}
      .mana-v937-summary-item{
        min-width:0;

        padding:13px;

        border:
          1px solid
          #302c1d;

        border-radius:14px;

        background:#0b0b0b;
      }


      #${SUMMARY_ID}
      span{
        display:block;

        color:#858585;

        font-size:9px;
        font-weight:900;

        letter-spacing:.06em;

        text-transform:
          uppercase;
      }


      #${SUMMARY_ID}
      strong{
        display:block;

        margin-top:5px;

        color:#f3d875;

        font-size:12px;

        line-height:1.45;

        overflow-wrap:anywhere;
      }


      #${PROGRESS_CARD_ID}{
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


      #${PROGRESS_CARD_ID}
      .mana-v937-progress-kicker{
        color:#f3d875;

        font-size:11px;
        font-weight:900;

        letter-spacing:.11em;
      }


      #${PROGRESS_CARD_ID}
      h3{
        margin:
          6px
          0
          0;

        color:#fff;

        font-size:21px;
      }


      #${PROGRESS_CARD_ID}
      p{
        margin:
          7px
          0
          0;

        color:#aaa;

        font-size:14px;

        line-height:1.6;
      }


      .mana-v937-reset-stats{
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


      .mana-v937-reset-stat{
        padding:14px;

        border:
          1px solid
          #2e2e2e;

        border-radius:15px;

        background:#0a0a0a;
      }


      .mana-v937-reset-stat span{
        display:block;

        color:#8d8d8d;

        font-size:10px;
        font-weight:900;

        text-transform:
          uppercase;
      }


      .mana-v937-reset-stat strong{
        display:block;

        margin-top:5px;

        color:#f3d875;

        font-size:22px;
      }


      .mana-v937-last-reset{
        margin-top:11px;

        padding:13px;

        border:
          1px solid
          #2e2e2e;

        border-radius:15px;

        background:#0a0a0a;
      }


      .mana-v937-last-reset strong{
        color:#f3d875;

        font-size:13px;
      }


      .mana-v937-last-reset div{
        margin-top:5px;

        color:#aaa;

        font-size:12px;

        line-height:1.55;
      }


      @media(
        max-width:560px
      ){

        #${SUMMARY_ID}{
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


  function resetTrackedSelections() {
    selectedEmotion =
      "";

    selectedMovement =
      "";

    selectedAction =
      "";

    stopBreathGuide();
  }


  function decorateWhakatauki() {
    const modal =
      document.getElementById(
        MODAL_ID
      );

    const step =
      modal
        ?.querySelector(
          ".mana-v936-step"
        );


    if (
      !modal
        ?.classList
        .contains(
          "open"
        ) ||
      !step
    ) {
      return;
    }


    if (
      document.getElementById(
        WHAKATAUKI_ID
      )
    ) {
      return;
    }


    const intro =
      step.querySelector(
        "p"
      );


    if (!intro) {
      return;
    }


    intro.insertAdjacentHTML(
      "afterend",

      `

        <div
          id="${WHAKATAUKI_ID}"
        >

          <div
            class="mana-v937-label"
          >
            WHAKATAUKĪ
          </div>


          <strong>
            Titiro whakamuri, kōkiri whakamua.
          </strong>


          <span>
            Look back and reflect so you can move forward.
          </span>

        </div>

      `
    );
  }


  function ensureBreathCue() {
    const breathe =
      document.querySelector(
        "#manaV936ResetModal .mana-v936-breathe"
      );


    if (!breathe) {
      return null;
    }


    let cue =
      document.getElementById(
        BREATH_CUE_ID
      );


    if (!cue) {
      cue =
        document.createElement(
          "div"
        );


      cue.id =
        BREATH_CUE_ID;


      cue.innerHTML = `

        <strong>
          READY
        </strong>

        <span>
          Inhale for 4 • hold for 2 • exhale for 6
        </span>

      `;


      breathe.insertAdjacentElement(
        "afterend",
        cue
      );
    }


    return cue;
  }


  function setBreathPhase(
    name,
    detail,
    className
  ) {
    const circle =
      document.querySelector(
        "#manaV936ResetModal .mana-v936-breathe-circle"
      );

    const cue =
      ensureBreathCue();


    if (
      !circle ||
      !cue
    ) {
      return;
    }


    circle.classList.remove(
      "mana-v937-inhale",
      "mana-v937-hold",
      "mana-v937-exhale"
    );


    if (
      className
    ) {
      circle.classList.add(
        className
      );
    }


    cue.innerHTML = `

      <strong>
        ${esc(
          name
        )}
      </strong>


      <span>
        ${esc(
          detail
        )}
      </span>

    `;
  }


  function updateBreathPhase() {
    const timeNode =
      document.getElementById(
        "manaV936BreathTime"
      );


    const remaining =
      Number(
        timeNode
          ?.textContent ||
        "60"
      );


    if (
      !Number.isFinite(
        remaining
      )
    ) {
      return;
    }


    const elapsed =
      Math.max(
        0,
        60 -
        remaining
      );


    const cycle =
      elapsed %
      12;


    if (
      remaining <=
      0
    ) {

      setBreathPhase(
        "COMPLETE",
        "Notice the space you created.",
        ""
      );


      stopBreathGuide();

      return;
    }


    if (
      cycle <
      4
    ) {

      setBreathPhase(
        "INHALE",
        "Slowly breathe in through your nose.",
        "mana-v937-inhale"
      );


      return;
    }


    if (
      cycle <
      6
    ) {

      setBreathPhase(
        "HOLD",
        "Stay soft through the shoulders.",
        "mana-v937-hold"
      );


      return;
    }


    setBreathPhase(
      "EXHALE",
      "Let the breath out slowly.",
      "mana-v937-exhale"
    );
  }


  function startBreathGuide() {
    stopBreathGuide();


    ensureBreathCue();

    updateBreathPhase();


    breathGuideTimer =
      setInterval(
        updateBreathPhase,
        1000
      );
  }


  function stopBreathGuide() {
    if (
      breathGuideTimer
    ) {

      clearInterval(
        breathGuideTimer
      );


      breathGuideTimer =
        null;
    }


    const circle =
      document.querySelector(
        "#manaV936ResetModal .mana-v936-breathe-circle"
      );


    circle
      ?.classList
      .remove(
        "mana-v937-inhale",
        "mana-v937-hold",
        "mana-v937-exhale"
      );
  }


  function decorateCurrentResetStep() {
    decorateWhakatauki();


    if (
      document.getElementById(
        "manaV936BreathTime"
      )
    ) {

      ensureBreathCue();

    } else {

      stopBreathGuide();
    }
  }


  function actionLabel(
    key
  ) {
    return (
      ACTION_LABELS[
        key
      ] ||
      key ||
      "Move forward deliberately"
    );
  }


  function decorateCompletion() {
    const body =
      document.getElementById(
        "manaV936Body"
      );


    if (
      !body ||
      document.getElementById(
        SUMMARY_ID
      )
    ) {
      return;
    }


    const completeCard =
      body.querySelector(
        ".mana-v936-complete"
      );


    if (!completeCard) {
      return;
    }


    completeCard.insertAdjacentHTML(
      "afterend",

      `

        <div
          id="${SUMMARY_ID}"
        >

          <div
            class="mana-v937-summary-item"
          >

            <span>
              You named
            </span>


            <strong>
              ${esc(
                selectedEmotion ||
                "The feeling"
              )}
            </strong>

          </div>


          <div
            class="mana-v937-summary-item"
          >

            <span>
              You chose movement
            </span>


            <strong>
              ${esc(
                selectedMovement ||
                "Move your body"
              )}
            </strong>

          </div>


          <div
            class="mana-v937-summary-item"
          >

            <span>
              Your next step
            </span>


            <strong>
              ${esc(
                actionLabel(
                  selectedAction
                )
              )}
            </strong>

          </div>

        </div>

      `
    );
  }


  function countRecentResets(
    resets,
    days
  ) {
    const cutoff =
      Date.now() -
      days *
      86400000;


    return resets
      .filter(
        item => {

          const time =
            new Date(
              item
                ?.completed_at ||
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
      )
      .length;
  }


  function commonEmotion(
    resets
  ) {
    const counts =
      {};


    resets.forEach(
      item => {

        const emotion =
          String(
            item
              ?.emotion ||
            ""
          )
            .trim();


        if (!emotion) {
          return;
        }


        counts[
          emotion
        ] =
          (
            counts[
              emotion
            ] ||
            0
          ) +
          1;

      }
    );


    const entries =
      Object.entries(
        counts
      );


    if (
      !entries.length
    ) {
      return "—";
    }


    entries.sort(
      (
        a,
        b
      ) =>
        b[1] -
        a[1]
    );


    return entries[
      0
    ][0];
  }


  function formatResetDate(
    value
  ) {
    const date =
      new Date(
        value ||
        ""
      );


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return (
        "No completed resets yet"
      );
    }


    return date
      .toLocaleString(
        [],
        {
          day:"numeric",
          month:"short",
          hour:"numeric",
          minute:"2-digit"
        }
      );
  }


  function renderProgressCard() {
    document
      .getElementById(
        PROGRESS_CARD_ID
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


    const state =
      loadState();


    const resets =
      Array.isArray(
        state.resets
      )
        ? state.resets
        : [];


    const last =
      resets[
        resets.length -
        1
      ];


    const card =
      document.createElement(
        "div"
      );


    card.id =
      PROGRESS_CARD_ID;


    card.innerHTML = `

      <div
        class="mana-v937-progress-kicker"
      >
        RESET NOW
      </div>


      <h3>
        Your reset practice
      </h3>


      <p>
        Every completed reset is a moment
        where you created space before choosing
        what happened next.
      </p>


      <div
        class="mana-v937-reset-stats"
      >

        <div
          class="mana-v937-reset-stat"
        >

          <span>
            Total resets
          </span>


          <strong>
            ${resets.length}
          </strong>

        </div>


        <div
          class="mana-v937-reset-stat"
        >

          <span>
            Last 7 days
          </span>


          <strong>
            ${countRecentResets(
              resets,
              7
            )}
          </strong>

        </div>


        <div
          class="mana-v937-reset-stat"
        >

          <span>
            Last 30 days
          </span>


          <strong>
            ${countRecentResets(
              resets,
              30
            )}
          </strong>

        </div>


        <div
          class="mana-v937-reset-stat"
        >

          <span>
            Most named feeling
          </span>


          <strong>
            ${esc(
              commonEmotion(
                resets
              )
            )}
          </strong>

        </div>

      </div>


      <div
        class="mana-v937-last-reset"
      >

        <strong>
          Most recent reset
        </strong>


        <div>

          ${
            last
              ? `
                ${esc(
                  formatResetDate(
                    last.completed_at
                  )
                )}
                •
                ${esc(
                  last.emotion ||
                  "Feeling named"
                )}
                •
                ${esc(
                  actionLabel(
                    last.action
                  )
                )}
              `
              : `
                Complete your first Reset Now
                and it will appear here.
              `
          }

        </div>

      </div>

    `;


    const grid =
      root.querySelector(
        ".mana-v933-grid"
      );


    if (
      grid
    ) {

      grid.insertAdjacentElement(
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

          decorateCurrentResetStep();

          renderProgressCard();

        },
        delay
      );
  }


  function wrapResetOpen() {
    if (
      wrappedOpen ||
      typeof
        window
          .openManaLifeReset !==
        "function"
    ) {
      return;
    }


    const original =
      window
        .openManaLifeReset;


    window.openManaLifeReset =
      (
        ...args
      ) => {

        resetTrackedSelections();


        const result =
          original(
            ...args
          );


        queueRefresh(
          70
        );


        return result;
      };


    wrappedOpen =
      true;
  }


  function watchClicks() {
    document.addEventListener(
      "click",
      event => {

        const emotion =
          event.target.closest(
            "[data-v936-emotion]"
          );


        if (
          emotion
        ) {

          selectedEmotion =
            emotion
              .dataset
              .v936Emotion ||
            "";


          queueRefresh(
            40
          );


          return;
        }


        const movement =
          event.target.closest(
            "[data-v936-movement]"
          );


        if (
          movement
        ) {

          selectedMovement =
            movement
              .dataset
              .v936Movement ||
            "";


          queueRefresh(
            40
          );


          return;
        }


        const action =
          event.target.closest(
            "[data-v936-action]"
          );


        if (
          action
        ) {

          selectedAction =
            action
              .dataset
              .v936Action ||
            "";


          queueRefresh(
            40
          );


          return;
        }


        if (
          event.target.closest(
            "#manaV936BreathStart"
          )
        ) {

          setTimeout(
            startBreathGuide,
            40
          );


          return;
        }


        if (
          event.target.closest(
            "#manaV936Complete"
          )
        ) {

          setTimeout(
            () => {

              stopBreathGuide();

              decorateCompletion();

              renderProgressCard();

            },
            90
          );


          return;
        }


        if (
          event.target.closest(
            "#manaV936Close"
          )
        ) {

          stopBreathGuide();

          return;
        }


        if (
          event.target.closest(
            "#manaV936Open"
          )
        ) {

          resetTrackedSelections();

          queueRefresh(
            80
          );


          return;
        }


        if (
          event.target.closest(
            "#manaV936Next"
          ) ||

          event.target.closest(
            "#manaV936Reclaim"
          ) ||

          event.target.closest(
            "#manaV936Support"
          ) ||

          event.target.closest(
            "#manaV936Done"
          )
        ) {

          queueRefresh(
            70
          );
        }

      },
      true
    );
  }


  function init() {
    injectStyles();

    watchClicks();

    wrapResetOpen();


    window.addEventListener(
      "mana:program-tab-change",
      () => {

        queueRefresh(
          90
        );

      }
    );


    window.addEventListener(
      "mana:life-updated",
      () => {

        queueRefresh(
          110
        );

      }
    );


    setTimeout(
      wrapResetOpen,
      500
    );


    setTimeout(
      wrapResetOpen,
      1500
    );


    queueRefresh(
      200
    );
  }


  window.MANA_LIFE_RESET_UPGRADE_BUILD =
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
