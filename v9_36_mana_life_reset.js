/* =========================================
   MANA MOVEMENT TRAINING v9.36.0
   MANA LIFE — RESET NOW

   PURPOSE:
   - Guided 5-step reset flow
   - Overview + Reclaim entry cards
   - 60-second breathing timer
   - Emotion check-in
   - Movement prompt
   - Deliberate next-action choice
   - Records completed resets locally

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

  const BUILD = "93600";
  const STATE_KEY = "mana-life-v933-state";
  const STYLE_ID = "mana-v936-reset-style";
  const MODAL_ID = "manaV936ResetModal";
  const CARD_ID = "manaV936ResetCard";

  let step = 0;
  let breathRemaining = 60;
  let breathTimer = null;
  let selectedEmotion = "";
  let selectedMovement = "";
  let selectedAction = "";
  let renderTimer = null;

  const EMOTIONS = [
    "Angry",
    "Hurt",
    "Anxious",
    "Lonely",
    "Confused",
    "Overwhelmed"
  ];

  const MOVEMENTS = [
    "Stand up and walk",
    "Get a glass of water",
    "Step outside for fresh air",
    "Do 20 slow bodyweight reps",
    "Go train or move for 10 minutes"
  ];

  const ACTIONS = [
    {
      key:"pause",
      title:"Send nothing yet",
      detail:"Give yourself more time before making contact."
    },
    {
      key:"write",
      title:"Write it privately",
      detail:"Use Reclaim to get the words out without sending them."
    },
    {
      key:"support",
      title:"Talk to someone",
      detail:"Open Support Chat and get another perspective."
    },
    {
      key:"task",
      title:"Complete one useful task",
      detail:"Put your energy into something that helps tomorrow."
    }
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
          #584a1d;

        border-radius:21px;

        background:
          radial-gradient(
            circle at 90% 10%,
            rgba(
              243,
              216,
              117,
              .10
            ),
            transparent 32%
          ),
          linear-gradient(
            145deg,
            #161307,
            #0a0a0a
          );
      }


      #${CARD_ID}
      .mana-v936-kicker{
        color:#f3d875;

        font-size:11px;
        font-weight:900;

        letter-spacing:.12em;
      }


      #${CARD_ID}
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
      p{
        margin:
          8px
          0
          0;

        color:#b7b7b7;

        font-size:14px;

        line-height:1.65;
      }


      .mana-v936-card-button{
        width:100%;

        min-height:54px;

        margin-top:14px;

        border:0;

        border-radius:15px;

        background:#f3d875;

        color:#111;

        font-size:13px;
        font-weight:900;

        cursor:pointer;
      }


      #${MODAL_ID}{
        position:fixed;
        inset:0;

        z-index:56000;

        display:none;

        flex-direction:column;

        background:#050505;

        color:#fff;
      }


      #${MODAL_ID}.open{
        display:flex;
      }


      .mana-v936-head{
        flex:
          0
          0
          auto;

        display:flex;

        justify-content:
          space-between;

        align-items:
          flex-start;

        gap:14px;

        padding:
          calc(
            env(
              safe-area-inset-top
            ) + 15px
          )
          16px
          14px;

        border-bottom:
          1px solid
          #2a2616;

        background:
          linear-gradient(
            180deg,
            #111006,
            #080808
          );
      }


      .mana-v936-head-kicker{
        color:#f3d875;

        font-size:10px;
        font-weight:900;

        letter-spacing:.12em;
      }


      .mana-v936-head-title{
        margin-top:4px;

        font-size:22px;
        font-weight:900;
      }


      .mana-v936-head-sub{
        margin-top:4px;

        color:#9a9a9a;

        font-size:12px;
      }


      .mana-v936-close{
        width:42px;
        height:42px;

        flex:
          0
          0
          42px;

        border:
          1px solid
          #333;

        border-radius:50%;

        background:#111;

        color:#fff;

        font-size:22px;

        cursor:pointer;
      }


      .mana-v936-progress{
        flex:
          0
          0
          auto;

        padding:
          10px
          16px
          0;

        background:#050505;
      }


      .mana-v936-progress-track{
        width:
          min(
            620px,
            100%
          );

        height:7px;

        margin:auto;

        overflow:hidden;

        border-radius:999px;

        background:#222;
      }


      .mana-v936-progress-fill{
        height:100%;

        border-radius:999px;

        background:#f3d875;

        transition:
          width
          .2s
          ease;
      }


      .mana-v936-body{
        flex:1;

        overflow:auto;

        padding:
          22px
          max(
            16px,
            calc(
              (
                100vw - 620px
              ) / 2
            )
          )
          calc(
            28px +
            env(
              safe-area-inset-bottom
            )
          );
      }


      .mana-v936-step{
        width:
          min(
            620px,
            100%
          );

        margin:auto;
      }


      .mana-v936-step-kicker{
        color:#f3d875;

        font-size:11px;
        font-weight:900;

        letter-spacing:.12em;
      }


      .mana-v936-step h2{
        margin:
          8px
          0
          10px;

        font-size:
          clamp(
            30px,
            8vw,
            40px
          );

        line-height:1.08;
      }


      .mana-v936-step p{
        margin:0;

        color:#b9b9b9;

        font-size:15px;

        line-height:1.7;
      }


      .mana-v936-quote{
        margin-top:18px;

        padding:17px;

        border:
          1px solid
          #51451d;

        border-radius:17px;

        background:#111006;

        color:#f3d875;

        font-size:17px;
        font-weight:800;

        line-height:1.5;
      }


      .mana-v936-actions{
        display:grid;

        gap:10px;

        margin-top:20px;
      }


      .mana-v936-option{
        width:100%;

        min-height:60px;

        padding:
          13px
          14px;

        border:
          1px solid
          #303030;

        border-radius:15px;

        background:#0b0b0b;

        color:#fff;

        text-align:left;

        cursor:pointer;
      }


      .mana-v936-option strong{
        display:block;

        font-size:14px;
      }


      .mana-v936-option span{
        display:block;

        margin-top:4px;

        color:#9d9d9d;

        font-size:12px;

        line-height:1.5;
      }


      .mana-v936-option.selected{
        border-color:#f3d875;

        background:#171407;
      }


      .mana-v936-option.selected strong{
        color:#f3d875;
      }


      .mana-v936-primary,
      .mana-v936-secondary{
        width:100%;

        min-height:54px;

        margin-top:16px;

        border-radius:15px;

        font-size:13px;
        font-weight:900;

        cursor:pointer;
      }


      .mana-v936-primary{
        border:0;

        background:#f3d875;

        color:#111;
      }


      .mana-v936-secondary{
        border:
          1px solid
          #4a4020;

        background:#111006;

        color:#f3d875;
      }


      .mana-v936-primary:disabled{
        opacity:.45;
      }


      .mana-v936-breathe{
        display:grid;

        place-items:center;

        margin:
          28px
          0
          8px;
      }


      .mana-v936-breathe-circle{
        width:180px;
        height:180px;

        display:grid;

        place-items:center;

        border:
          2px solid
          #f3d875;

        border-radius:50%;

        background:
          radial-gradient(
            circle,
            #1c1808,
            #080808 68%
          );

        box-shadow:
          0
          0
          36px
          rgba(
            243,
            216,
            117,
            .10
          );
      }


      .mana-v936-breathe-circle strong{
        display:block;

        color:#f3d875;

        font-size:40px;

        line-height:1;

        text-align:center;
      }


      .mana-v936-breathe-circle span{
        display:block;

        margin-top:7px;

        color:#aaa;

        font-size:11px;
        font-weight:900;

        text-align:center;

        letter-spacing:.08em;
      }


      .mana-v936-complete{
        margin-top:18px;

        padding:18px;

        border:
          1px solid
          #55481d;

        border-radius:18px;

        background:
          linear-gradient(
            145deg,
            #181507,
            #0b0b0b
          );
      }


      .mana-v936-complete strong{
        display:block;

        color:#f3d875;

        font-size:20px;
      }


      .mana-v936-complete p{
        margin-top:7px;
      }


      @media(
        max-width:560px
      ){

        .mana-v936-body{
          padding-left:14px;
          padding-right:14px;
        }


        .mana-v936-breathe-circle{
          width:160px;
          height:160px;
        }

      }

    `;


    document.head.appendChild(
      style
    );
  }


  function ensureModal() {
    if (
      document.getElementById(
        MODAL_ID
      )
    ) {
      return;
    }


    const modal =
      document.createElement(
        "div"
      );


    modal.id =
      MODAL_ID;


    modal.innerHTML = `

      <div
        class="mana-v936-head"
      >

        <div>

          <div
            class="mana-v936-head-kicker"
          >
            MANA LIFE • RECLAIM
          </div>


          <div
            class="mana-v936-head-title"
          >
            Reset Now
          </div>


          <div
            class="mana-v936-head-sub"
          >
            A short reset before you decide what happens next.
          </div>

        </div>


        <button
          type="button"
          class="mana-v936-close"
          id="manaV936Close"
          aria-label="Close Reset Now"
        >
          ×
        </button>

      </div>


      <div
        class="mana-v936-progress"
      >

        <div
          class="mana-v936-progress-track"
        >

          <div
            class="mana-v936-progress-fill"
            id="manaV936ProgressFill"
          ></div>

        </div>

      </div>


      <div
        class="mana-v936-body"
        id="manaV936Body"
      ></div>

    `;


    document.body.appendChild(
      modal
    );


    document
      .getElementById(
        "manaV936Close"
      )
      ?.addEventListener(
        "click",
        closeReset
      );
  }


  function renderStep() {
    const body =
      document.getElementById(
        "manaV936Body"
      );

    const fill =
      document.getElementById(
        "manaV936ProgressFill"
      );


    if (
      !body ||
      !fill
    ) {
      return;
    }


    fill.style.width =
      `${
        (
          (
            step +
            1
          ) /
          5
        ) *
        100
      }%`;


    if (
      step ===
      0
    ) {

      body.innerHTML = `

        <div
          class="mana-v936-step"
        >

          <div
            class="mana-v936-step-kicker"
          >
            STEP 1 • STOP
          </div>


          <h2>
            You do not have to act on this feeling yet.
          </h2>


          <p>
            The goal is not to make the feeling disappear.
            The goal is to create enough space so the feeling
            does not make the next decision for you.
          </p>


          <div
            class="mana-v936-quote"
          >
            Nothing needs to be sent, solved or decided in this minute.
          </div>


          <button
            type="button"
            class="mana-v936-primary"
            id="manaV936Next"
          >
            I’M READY TO RESET →
          </button>

        </div>

      `;
    }


    if (
      step ===
      1
    ) {

      body.innerHTML = `

        <div
          class="mana-v936-step"
        >

          <div
            class="mana-v936-step-kicker"
          >
            STEP 2 • BREATHE
          </div>


          <h2>
            Slow the moment down.
          </h2>


          <p>
            Start the timer. Breathe slowly and keep your
            attention on the next breath rather than the
            next message or thought.
          </p>


          <div
            class="mana-v936-breathe"
          >

            <div
              class="mana-v936-breathe-circle"
            >

              <div>

                <strong
                  id="manaV936BreathTime"
                >
                  60
                </strong>

                <span>
                  SECONDS
                </span>

              </div>

            </div>

          </div>


          <button
            type="button"
            class="mana-v936-primary"
            id="manaV936BreathStart"
          >
            START 60-SECOND RESET
          </button>


          <button
            type="button"
            class="mana-v936-secondary"
            id="manaV936Next"
          >
            CONTINUE WHEN YOU’RE READY →
          </button>

        </div>

      `;
    }


    if (
      step ===
      2
    ) {

      body.innerHTML = `

        <div
          class="mana-v936-step"
        >

          <div
            class="mana-v936-step-kicker"
          >
            STEP 3 • NAME IT
          </div>


          <h2>
            What is strongest right now?
          </h2>


          <p>
            Naming the feeling helps separate the emotion
            from the action you take next.
          </p>


          <div
            class="mana-v936-actions"
          >

            ${EMOTIONS
              .map(
                emotion => `

                  <button
                    type="button"

                    class="
                      mana-v936-option
                      ${
                        selectedEmotion ===
                        emotion
                          ? "selected"
                          : ""
                      }
                    "

                    data-v936-emotion="${esc(
                      emotion
                    )}"
                  >
                    <strong>
                      ${esc(
                        emotion
                      )}
                    </strong>
                  </button>

                `
              )
              .join("")}

          </div>


          <button
            type="button"
            class="mana-v936-primary"
            id="manaV936Next"
            ${
              selectedEmotion
                ? ""
                : "disabled"
            }
          >
            NEXT →
          </button>

        </div>

      `;
    }


    if (
      step ===
      3
    ) {

      body.innerHTML = `

        <div
          class="mana-v936-step"
        >

          <div
            class="mana-v936-step-kicker"
          >
            STEP 4 • MOVE
          </div>


          <h2>
            Get out of your head and into your body.
          </h2>


          <p>
            Pick one small physical action.
            You are changing state before making another decision.
          </p>


          <div
            class="mana-v936-actions"
          >

            ${MOVEMENTS
              .map(
                movement => `

                  <button
                    type="button"

                    class="
                      mana-v936-option
                      ${
                        selectedMovement ===
                        movement
                          ? "selected"
                          : ""
                      }
                    "

                    data-v936-movement="${esc(
                      movement
                    )}"
                  >

                    <strong>
                      ${esc(
                        movement
                      )}
                    </strong>

                  </button>

                `
              )
              .join("")}

          </div>


          <button
            type="button"
            class="mana-v936-primary"
            id="manaV936Next"
            ${
              selectedMovement
                ? ""
                : "disabled"
            }
          >
            I’VE CHOSEN MY MOVEMENT →
          </button>

        </div>

      `;
    }


    if (
      step ===
      4
    ) {

      body.innerHTML = `

        <div
          class="mana-v936-step"
        >

          <div
            class="mana-v936-step-kicker"
          >
            STEP 5 • CHOOSE
          </div>


          <h2>
            What helps tomorrow?
          </h2>


          <p>
            Choose the next action that protects your direction,
            not just the action that gives immediate relief.
          </p>


          <div
            class="mana-v936-actions"
          >

            ${ACTIONS
              .map(
                action => `

                  <button
                    type="button"

                    class="
                      mana-v936-option
                      ${
                        selectedAction ===
                        action.key
                          ? "selected"
                          : ""
                      }
                    "

                    data-v936-action="${esc(
                      action.key
                    )}"
                  >

                    <strong>
                      ${esc(
                        action.title
                      )}
                    </strong>


                    <span>
                      ${esc(
                        action.detail
                      )}
                    </span>

                  </button>

                `
              )
              .join("")}

          </div>


          <button
            type="button"
            class="mana-v936-primary"
            id="manaV936Complete"
            ${
              selectedAction
                ? ""
                : "disabled"
            }
          >
            COMPLETE RESET
          </button>

        </div>

      `;
    }


    wireStep();
  }


  function wireStep() {
    document
      .getElementById(
        "manaV936Next"
      )
      ?.addEventListener(
        "click",
        () => {

          stopBreathTimer();

          step =
            Math.min(
              step + 1,
              4
            );


          renderStep();

        }
      );


    document
      .getElementById(
        "manaV936BreathStart"
      )
      ?.addEventListener(
        "click",
        startBreathTimer
      );


    document
      .querySelectorAll(
        "[data-v936-emotion]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              selectedEmotion =
                button
                  .dataset
                  .v936Emotion ||
                "";


              renderStep();

            }
          );

        }
      );


    document
      .querySelectorAll(
        "[data-v936-movement]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              selectedMovement =
                button
                  .dataset
                  .v936Movement ||
                "";


              renderStep();

            }
          );

        }
      );


    document
      .querySelectorAll(
        "[data-v936-action]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              selectedAction =
                button
                  .dataset
                  .v936Action ||
                "";


              renderStep();

            }
          );

        }
      );


    document
      .getElementById(
        "manaV936Complete"
      )
      ?.addEventListener(
        "click",
        completeReset
      );
  }


  function startBreathTimer() {
    stopBreathTimer();


    breathRemaining =
      60;


    updateBreathTime();


    const button =
      document.getElementById(
        "manaV936BreathStart"
      );


    if (button) {

      button.disabled =
        true;


      button.textContent =
        "BREATHE SLOWLY…";
    }


    breathTimer =
      setInterval(
        () => {

          breathRemaining -=
            1;


          updateBreathTime();


          if (
            breathRemaining <=
            0
          ) {

            stopBreathTimer();


            if (button) {

              button.disabled =
                false;


              button.textContent =
                "60 SECONDS COMPLETE ✓";
            }

          }

        },
        1000
      );
  }


  function updateBreathTime() {
    const node =
      document.getElementById(
        "manaV936BreathTime"
      );


    if (node) {

      node.textContent =
        String(
          Math.max(
            0,
            breathRemaining
          )
        );
    }
  }


  function stopBreathTimer() {
    if (
      breathTimer
    ) {

      clearInterval(
        breathTimer
      );


      breathTimer =
        null;
    }
  }


  function recordReset() {
    const state =
      safeJson(
        localStorage.getItem(
          STATE_KEY
        ) || "{}",
        {}
      );


    const resets =
      Array.isArray(
        state.resets
      )
        ? state.resets
        : [];


    resets.push({
      completed_at:
        new Date()
          .toISOString(),

      emotion:
        selectedEmotion,

      movement:
        selectedMovement,

      action:
        selectedAction
    });


    state.resets =
      resets.slice(
        -100
      );


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


  function completeReset() {
    if (
      !selectedAction
    ) {
      return;
    }


    stopBreathTimer();

    recordReset();


    const body =
      document.getElementById(
        "manaV936Body"
      );

    const fill =
      document.getElementById(
        "manaV936ProgressFill"
      );


    if (fill) {

      fill.style.width =
        "100%";
    }


    if (!body) {
      return;
    }


    const selected =
      ACTIONS.find(
        item =>
          item.key ===
          selectedAction
      );


    body.innerHTML = `

      <div
        class="mana-v936-step"
      >

        <div
          class="mana-v936-step-kicker"
        >
          RESET COMPLETE
        </div>


        <h2>
          You changed what happens next.
        </h2>


        <div
          class="mana-v936-complete"
        >

          <strong>
            Reset complete.
          </strong>


          <p>
            You have not solved everything.
            You created space, named what you were feeling
            and chose a deliberate next action.
          </p>

        </div>


        <div
          class="mana-v936-quote"
        >
          Next action:
          ${esc(
            selected
              ?.title ||
            "Move forward deliberately"
          )}
        </div>


        ${
          selectedAction ===
          "support"
            ? `

              <button
                type="button"
                class="mana-v936-primary"
                id="manaV936Support"
              >
                OPEN SUPPORT CHAT →
              </button>

            `
            : ""
        }


        ${
          selectedAction ===
          "write"
            ? `

              <button
                type="button"
                class="mana-v936-primary"
                id="manaV936Reclaim"
              >
                OPEN RECLAIM →
              </button>

            `
            : ""
        }


        <button
          type="button"
          class="mana-v936-secondary"
          id="manaV936Done"
        >
          BACK TO MANA LIFE
        </button>

      </div>

    `;


    document
      .getElementById(
        "manaV936Support"
      )
      ?.addEventListener(
        "click",
        () => {

          closeReset();


          setTimeout(
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

            },
            80
          );

        }
      );


    document
      .getElementById(
        "manaV936Reclaim"
      )
      ?.addEventListener(
        "click",
        () => {

          closeReset();


          setTimeout(
            () => {

              document
                .querySelector(
                  '#manaV83Tabs [data-v83-tab="reclaim"]'
                )
                ?.click();

            },
            80
          );

        }
      );


    document
      .getElementById(
        "manaV936Done"
      )
      ?.addEventListener(
        "click",
        closeReset
      );
  }


  function openReset() {
    ensureModal();


    step =
      0;

    breathRemaining =
      60;

    selectedEmotion =
      "";

    selectedMovement =
      "";

    selectedAction =
      "";


    document
      .getElementById(
        MODAL_ID
      )
      ?.classList
      .add(
        "open"
      );


    document.body.style.overflow =
      "hidden";


    renderStep();
  }


  function closeReset() {
    stopBreathTimer();


    document
      .getElementById(
        MODAL_ID
      )
      ?.classList
      .remove(
        "open"
      );


    document.body.style.overflow =
      "";
  }


  function cardHtml() {
    return `

      <div
        class="mana-v936-kicker"
      >
        RESET NOW
      </div>


      <h3>
        When the emotion is bigger than the moment
      </h3>


      <p>
        Five short steps to slow things down,
        get back into your body and choose
        what helps next.
      </p>


      <button
        type="button"
        class="mana-v936-card-button"
        id="manaV936Open"
      >
        START RESET →
      </button>

    `;
  }


  function injectCard() {
    if (
      !lifeOpen()
    ) {

      document
        .getElementById(
          CARD_ID
        )
        ?.remove();


      return;
    }


    const tab =
      activeTab();


    if (
      tab !==
        "overview" &&
      tab !==
        "reclaim"
    ) {

      document
        .getElementById(
          CARD_ID
        )
        ?.remove();


      return;
    }


    const root =
      document.getElementById(
        "manaV933Life"
      );


    if (!root) {
      return;
    }


    let card =
      document.getElementById(
        CARD_ID
      );


    if (!card) {

      card =
        document.createElement(
          "div"
        );


      card.id =
        CARD_ID;
    }


    card.innerHTML =
      cardHtml();


    if (
      tab ===
      "overview"
    ) {

      const target =
        root.querySelector(
          ".mana-v933-grid"
        );


      if (target) {

        target.insertAdjacentElement(
          "afterend",
          card
        );

      } else {

        root.appendChild(
          card
        );
      }

    } else {

      const firstCard =
        root.querySelector(
          ".mana-v933-card"
        );


      if (firstCard) {

        firstCard.insertAdjacentElement(
          "beforebegin",
          card
        );

      } else {

        root.appendChild(
          card
        );
      }

    }


    document
      .getElementById(
        "manaV936Open"
      )
      ?.addEventListener(
        "click",
        openReset
      );
  }


  function queueCard(
    delay = 60
  ) {
    clearTimeout(
      renderTimer
    );


    renderTimer =
      setTimeout(
        injectCard,
        delay
      );
  }


  function init() {
    injectStyles();

    ensureModal();


    window.addEventListener(
      "mana:program-tab-change",
      () => {

        queueCard(
          80
        );

      }
    );


    window.addEventListener(
      "mana:life-updated",
      () => {

        queueCard(
          100
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

          queueCard(
            140
          );

        }

      },
      true
    );


    queueCard(
      200
    );
  }


  window.openManaLifeReset =
    openReset;


  window.MANA_LIFE_RESET_BUILD =
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
