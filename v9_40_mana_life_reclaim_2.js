/* =========================================
   MANA MOVEMENT TRAINING v9.40.0
   MANA LIFE — RECLAIM 2.0

   PURPOSE:
   - Add dated private journal entries
   - Preserve the existing Reclaim note
   - Save "unsent" thoughts into history
   - Add guided reflection fields
   - Show recent entries inside Reclaim
   - Keep Overview untouched

   STORAGE:
   - mana-life-v933-state

   STABILITY:
   - Reclaim tab only
   - No MutationObserver
   - No database changes
   - Does not alter Mana Strength / Mana 28
   ========================================= */

(() => {
  "use strict";

  const BUILD = "94000";
  const STATE_KEY = "mana-life-v933-state";
  const STYLE_ID = "mana-v940-reclaim-style";
  const BUILDER_ID = "manaV940ReclaimBuilder";
  const HISTORY_ID = "manaV940ReclaimHistory";

  let refreshTimer = null;


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
    const raw =
      safeJson(
        localStorage.getItem(
          STATE_KEY
        ) || "{}",
        {}
      );

    return {
      ...raw,

      notes:
        raw.notes &&
        typeof raw.notes ===
          "object"
          ? raw.notes
          : {},

      reclaimHistory:
        Array.isArray(
          raw.reclaimHistory
        )
          ? raw.reclaimHistory
          : []
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


  function lifeReclaimOpen() {
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
        ?.trim()
        ?.toUpperCase() ===
        "MANA LIFE" &&

      active
        ?.dataset
        ?.v83Tab ===
        "reclaim"
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

      #${BUILDER_ID},

      #${HISTORY_ID}{
        margin:
          10px
          0;

        padding:18px;

        border:
          1px solid
          #443b21;

        border-radius:20px;

        background:
          linear-gradient(
            145deg,
            #131106,
            #090909
          );
      }


      #${BUILDER_ID}
      .mana-v940-kicker,

      #${HISTORY_ID}
      .mana-v940-kicker{
        color:#f3d875;

        font-size:10px;
        font-weight:900;

        letter-spacing:.11em;
      }


      #${BUILDER_ID}
      h3,

      #${HISTORY_ID}
      h3{
        margin:
          6px
          0
          0;

        color:#fff;

        font-size:21px;

        line-height:1.3;
      }


      #${BUILDER_ID}
      .mana-v940-copy,

      #${HISTORY_ID}
      .mana-v940-copy{
        margin-top:7px;

        color:#aaa;

        font-size:13px;

        line-height:1.6;
      }


      .mana-v940-field-wrap{
        margin-top:15px;
      }


      .mana-v940-label{
        display:block;

        margin-bottom:7px;

        color:#9b9b9b;

        font-size:10px;
        font-weight:900;

        letter-spacing:.07em;

        text-transform:
          uppercase;
      }


      .mana-v940-field{
        width:100%;

        min-height:72px;

        padding:
          12px
          13px;

        border:
          1px solid
          #343434;

        border-radius:14px;

        background:#0a0a0a;

        color:#fff;

        font:inherit;

        font-size:14px;

        line-height:1.55;

        resize:vertical;

        outline:none;
      }


      .mana-v940-field:focus{
        border-color:#6b5b23;
      }


      .mana-v940-save{
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


      .mana-v940-status{
        min-height:17px;

        margin-top:8px;

        color:#999;

        font-size:10px;

        text-align:center;
      }


      .mana-v940-history-head{
        display:flex;

        align-items:flex-start;

        justify-content:
          space-between;

        gap:12px;
      }


      .mana-v940-count{
        flex:
          0
          0
          auto;

        padding:
          7px
          9px;

        border:
          1px solid
          #4e431e;

        border-radius:999px;

        background:#111006;

        color:#f3d875;

        font-size:9px;
        font-weight:900;
      }


      .mana-v940-list{
        display:grid;

        gap:9px;

        margin-top:14px;
      }


      .mana-v940-entry{
        border:
          1px solid
          #2d2d2d;

        border-radius:15px;

        background:#090909;

        overflow:hidden;
      }


      .mana-v940-entry-button{
        width:100%;

        display:flex;

        justify-content:
          space-between;

        align-items:
          flex-start;

        gap:12px;

        padding:13px;

        border:0;

        background:transparent;

        color:#fff;

        text-align:left;

        cursor:pointer;
      }


      .mana-v940-entry-button strong{
        display:block;

        color:#f3d875;

        font-size:12px;
      }


      .mana-v940-entry-button small{
        display:block;

        margin-top:5px;

        color:#888;

        font-size:10px;
      }


      .mana-v940-entry-button > span{
        color:#777;

        font-size:18px;

        line-height:1;
      }


      .mana-v940-entry-body{
        display:none;

        padding:
          0
          13px
          13px;
      }


      .mana-v940-entry.open
      .mana-v940-entry-body{
        display:block;
      }


      .mana-v940-entry-block{
        margin-top:10px;

        padding:
          11px
          12px;

        border-left:
          3px solid
          #4e431e;

        background:#0d0d0d;
      }


      .mana-v940-entry-block span{
        display:block;

        color:#777;

        font-size:9px;
        font-weight:900;

        letter-spacing:.06em;

        text-transform:
          uppercase;
      }


      .mana-v940-entry-block p{
        margin:
          5px
          0
          0;

        color:#c1c1c1;

        font-size:12px;

        line-height:1.6;

        white-space:pre-wrap;

        overflow-wrap:anywhere;
      }


      .mana-v940-entry-actions{
        display:flex;

        gap:8px;

        margin-top:11px;
      }


      .mana-v940-use,

      .mana-v940-delete{
        flex:1;

        min-height:42px;

        border-radius:12px;

        font-size:10px;
        font-weight:900;

        cursor:pointer;
      }


      .mana-v940-use{
        border:
          1px solid
          #5a4b1c;

        background:#151207;

        color:#f3d875;
      }


      .mana-v940-delete{
        border:
          1px solid
          #393939;

        background:#111;

        color:#aaa;
      }


      .mana-v940-empty{
        margin-top:14px;

        padding:15px;

        border:
          1px dashed
          #303030;

        border-radius:14px;

        color:#888;

        font-size:12px;

        line-height:1.6;

        text-align:center;
      }


      @media(
        max-width:560px
      ){

        #${BUILDER_ID},

        #${HISTORY_ID}{
          padding:16px;
        }


        .mana-v940-entry-actions{
          flex-direction:
            column;
        }

      }

    `;


    document.head
      .appendChild(
        style
      );
  }


  function formatDate(
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
      return "Saved entry";
    }


    return date.toLocaleString(
      [],
      {
        weekday:"short",
        day:"numeric",
        month:"short",
        hour:"numeric",
        minute:"2-digit"
      }
    );
  }


  function summaryFor(
    entry
  ) {
    return (
      entry.message ||
      entry.feeling ||
      entry.control ||
      entry.tomorrow ||
      "Private Reclaim entry"
    )
      .replace(
        /\s+/g,
        " "
      )
      .trim()
      .slice(
        0,
        90
      );
  }


  function builderHtml() {
    const current =
      document
        .getElementById(
          "manaV933ReclaimNote"
        )
        ?.value ||
      "";


    return `

      <div
        class="mana-v940-kicker"
      >
        RECLAIM JOURNAL
      </div>


      <h3>
        Turn the moment into perspective
      </h3>


      <div
        class="mana-v940-copy"
      >
        Save what you are feeling now as a dated private entry.
        Nothing here is sent anywhere.
      </div>


      <div
        class="mana-v940-field-wrap"
      >

        <label
          class="mana-v940-label"
          for="manaV940Message"
        >
          What I want to say
        </label>


        <textarea
          class="mana-v940-field"
          id="manaV940Message"
          maxlength="3000"
          placeholder="Write it here instead of sending it..."
        >${esc(
          current
        )}</textarea>

      </div>


      <div
        class="mana-v940-field-wrap"
      >

        <label
          class="mana-v940-label"
          for="manaV940Feeling"
        >
          What am I feeling?
        </label>


        <textarea
          class="mana-v940-field"
          id="manaV940Feeling"
          maxlength="800"
          placeholder="Name the feeling without judging it."
        ></textarea>

      </div>


      <div
        class="mana-v940-field-wrap"
      >

        <label
          class="mana-v940-label"
          for="manaV940Control"
        >
          What can I control?
        </label>


        <textarea
          class="mana-v940-field"
          id="manaV940Control"
          maxlength="800"
          placeholder="Your words, actions, boundaries, routine..."
        ></textarea>

      </div>


      <div
        class="mana-v940-field-wrap"
      >

        <label
          class="mana-v940-label"
          for="manaV940Tomorrow"
        >
          What helps tomorrow?
        </label>


        <textarea
          class="mana-v940-field"
          id="manaV940Tomorrow"
          maxlength="800"
          placeholder="Choose the next useful action."
        ></textarea>

      </div>


      <button
        type="button"
        class="mana-v940-save"
        id="manaV940Save"
      >
        SAVE AS PRIVATE ENTRY
      </button>


      <div
        class="mana-v940-status"
        id="manaV940Status"
      ></div>

    `;
  }


  function historyHtml() {
    const state =
      loadState();


    const history =
      [
        ...state.reclaimHistory
      ]
        .reverse();


    return `

      <div
        class="mana-v940-history-head"
      >

        <div>

          <div
            class="mana-v940-kicker"
          >
            PRIVATE HISTORY
          </div>


          <h3>
            Previous Reclaim entries
          </h3>

        </div>


        <div
          class="mana-v940-count"
        >
          ${history.length}
          ${
            history.length ===
            1
              ? "ENTRY"
              : "ENTRIES"
          }
        </div>

      </div>


      <div
        class="mana-v940-copy"
      >
        Revisit what you wrote later,
        when the emotion is not running the moment.
      </div>


      ${
        history.length
          ? `

            <div
              class="mana-v940-list"
            >

              ${history
                .map(
                  entry => `

                    <div
                      class="mana-v940-entry"
                      data-v940-entry="${esc(
                        entry.id
                      )}"
                    >

                      <button
                        type="button"
                        class="mana-v940-entry-button"
                        data-v940-toggle="${esc(
                          entry.id
                        )}"
                      >

                        <div>

                          <strong>
                            ${esc(
                              formatDate(
                                entry.created_at
                              )
                            )}
                          </strong>


                          <small>
                            ${esc(
                              summaryFor(
                                entry
                              )
                            )}${
                              summaryFor(
                                entry
                              ).length >=
                              90
                                ? "…"
                                : ""
                            }
                          </small>

                        </div>


                        <span>
                          ⌄
                        </span>

                      </button>


                      <div
                        class="mana-v940-entry-body"
                      >

                        ${
                          entry.message
                            ? `

                              <div
                                class="mana-v940-entry-block"
                              >

                                <span>
                                  What I wanted to say
                                </span>


                                <p>
                                  ${esc(
                                    entry.message
                                  )}
                                </p>

                              </div>

                            `
                            : ""
                        }


                        ${
                          entry.feeling
                            ? `

                              <div
                                class="mana-v940-entry-block"
                              >

                                <span>
                                  What I was feeling
                                </span>


                                <p>
                                  ${esc(
                                    entry.feeling
                                  )}
                                </p>

                              </div>

                            `
                            : ""
                        }


                        ${
                          entry.control
                            ? `

                              <div
                                class="mana-v940-entry-block"
                              >

                                <span>
                                  What I could control
                                </span>


                                <p>
                                  ${esc(
                                    entry.control
                                  )}
                                </p>

                              </div>

                            `
                            : ""
                        }


                        ${
                          entry.tomorrow
                            ? `

                              <div
                                class="mana-v940-entry-block"
                              >

                                <span>
                                  What helps tomorrow
                                </span>


                                <p>
                                  ${esc(
                                    entry.tomorrow
                                  )}
                                </p>

                              </div>

                            `
                            : ""
                        }


                        <div
                          class="mana-v940-entry-actions"
                        >

                          <button
                            type="button"
                            class="mana-v940-use"
                            data-v940-use="${esc(
                              entry.id
                            )}"
                          >
                            USE AS CURRENT NOTE
                          </button>


                          <button
                            type="button"
                            class="mana-v940-delete"
                            data-v940-delete="${esc(
                              entry.id
                            )}"
                          >
                            DELETE ENTRY
                          </button>

                        </div>

                      </div>

                    </div>

                  `
                )
                .join("")}

            </div>

          `
          : `

            <div
              class="mana-v940-empty"
            >
              Your saved Reclaim entries
              will appear here.
            </div>

          `
      }

    `;
  }


  function render() {
    document
      .getElementById(
        BUILDER_ID
      )
      ?.remove();


    document
      .getElementById(
        HISTORY_ID
      )
      ?.remove();


    if (
      !lifeReclaimOpen()
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


    const goldCard =
      root.querySelector(
        ".mana-v933-card.gold"
      );


    if (!goldCard) {
      return;
    }


    const builder =
      document.createElement(
        "div"
      );


    builder.id =
      BUILDER_ID;


    builder.innerHTML =
      builderHtml();


    goldCard
      .insertAdjacentElement(
        "afterend",
        builder
      );


    const history =
      document.createElement(
        "div"
      );


    history.id =
      HISTORY_ID;


    history.innerHTML =
      historyHtml();


    builder
      .insertAdjacentElement(
        "afterend",
        history
      );


    wire();
  }


  function saveEntry() {
    const message =
      document
        .getElementById(
          "manaV940Message"
        )
        ?.value
        ?.trim() ||
      "";


    const feeling =
      document
        .getElementById(
          "manaV940Feeling"
        )
        ?.value
        ?.trim() ||
      "";


    const control =
      document
        .getElementById(
          "manaV940Control"
        )
        ?.value
        ?.trim() ||
      "";


    const tomorrow =
      document
        .getElementById(
          "manaV940Tomorrow"
        )
        ?.value
        ?.trim() ||
      "";


    const status =
      document.getElementById(
        "manaV940Status"
      );


    if (
      !message &&
      !feeling &&
      !control &&
      !tomorrow
    ) {

      if (status) {
        status.textContent =
          "Write something before saving.";
      }


      return;
    }


    const state =
      loadState();


    state.reclaimHistory =
      state.reclaimHistory ||
      [];


    const stamp =
      new Date()
        .toISOString();


    state.reclaimHistory
      .push({
        id:
          `reclaim-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,

        created_at:
          stamp,

        message,

        feeling,

        control,

        tomorrow
      });


    state.reclaimHistory =
      state.reclaimHistory
        .slice(
          -100
        );


    state.notes =
      state.notes ||
      {};


    if (
      message
    ) {
      state.notes.reclaim =
        message;
    }


    saveState(
      state
    );


    if (status) {
      status.textContent =
        "Private Reclaim entry saved ✓";
    }


    setTimeout(
      () => {

        queueRender(
          40
        );

      },
      120
    );
  }


  function useEntry(
    id
  ) {
    const state =
      loadState();


    const entry =
      state.reclaimHistory
        .find(
          item =>
            item.id ===
            id
        );


    if (!entry) {
      return;
    }


    state.notes =
      state.notes ||
      {};


    state.notes.reclaim =
      entry.message ||
      "";


    saveState(
      state
    );


    const original =
      document.getElementById(
        "manaV933ReclaimNote"
      );


    if (original) {

      original.value =
        entry.message ||
        "";


      original.scrollIntoView({
        behavior:"smooth",
        block:"center"
      });
    }
  }


  function deleteEntry(
    id
  ) {
    const state =
      loadState();


    const entry =
      state.reclaimHistory
        .find(
          item =>
            item.id ===
            id
        );


    if (!entry) {
      return;
    }


    const confirmed =
      window.confirm(
        "Delete this private Reclaim entry?"
      );


    if (!confirmed) {
      return;
    }


    state.reclaimHistory =
      state.reclaimHistory
        .filter(
          item =>
            item.id !==
            id
        );


    saveState(
      state
    );


    queueRender(
      50
    );
  }


  function wire() {
    document
      .getElementById(
        "manaV940Save"
      )
      ?.addEventListener(
        "click",
        saveEntry
      );


    document
      .querySelectorAll(
        "[data-v940-toggle]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              button
                .closest(
                  ".mana-v940-entry"
                )
                ?.classList
                .toggle(
                  "open"
                );
            }
          );

        }
      );


    document
      .querySelectorAll(
        "[data-v940-use]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            event => {

              event.stopPropagation();


              useEntry(
                button.dataset
                  .v940Use ||
                ""
              );
            }
          );

        }
      );


    document
      .querySelectorAll(
        "[data-v940-delete]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            event => {

              event.stopPropagation();


              deleteEntry(
                button.dataset
                  .v940Delete ||
                ""
              );
            }
          );

        }
      );
  }


  function queueRender(
    delay = 100
  ) {
    clearTimeout(
      refreshTimer
    );


    refreshTimer =
      setTimeout(
        render,
        delay
      );
  }


  function init() {
    injectStyles();


    window.addEventListener(
      "mana:program-tab-change",
      () => {

        queueRender(
          100
        );

      }
    );


    window.addEventListener(
      "mana:life-updated",
      () => {

        queueRender(
          140
        );

      }
    );


    window.addEventListener(
      "focus",
      () => {

        queueRender(
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

          queueRender(
            120
          );
        }

      }
    );


    queueRender(
      220
    );
  }


  window.MANA_LIFE_RECLAIM_2_BUILD =
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
