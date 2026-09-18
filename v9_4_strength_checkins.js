/* =========================================
   MANA MOVEMENT TRAINING v9.4.0
   MANA STRENGTH — COACH CHECK-INS

   WEEKLY ASYNC COACH CHECK-IN
   USES EXISTING:
   - checkin_requests
   - checkins
   ========================================= */

(() => {
  "use strict";

  const MODAL_ID =
    "manaV94StrengthCheckin";

  const STYLE_ID =
    "mana-v940-strength-checkin-style";

  const CARD_ID =
    "manaV94CheckinCard";

  let pendingRequest =
    null;

  let loading =
    false;


  function currentClientId() {
    try {

      if (
        typeof currentUser !==
          "undefined" &&
        currentUser?.id
      ) {
        return currentUser.id;
      }

    } catch (_) {}

    return "";
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
        .contains("open") &&

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

      #${CARD_ID}{
        margin-top:14px;

        padding:16px;

        border:
          1px solid
          #44391a;

        border-radius:17px;

        background:
          linear-gradient(
            145deg,
            #151208,
            #090909
          );
      }


      .mana-v940-row{
        display:flex;

        justify-content:
          space-between;

        align-items:
          flex-start;

        gap:14px;
      }


      .mana-v940-card-kicker{
        color:#f3d875;

        font-size:10px;

        font-weight:900;

        letter-spacing:.11em;

        text-transform:uppercase;
      }


      .mana-v940-card-title{
        margin-top:4px;

        color:#fff;

        font-size:17px;

        font-weight:900;
      }


      .mana-v940-card-copy{
        margin-top:6px;

        color:#888;

        font-size:11px;

        line-height:1.45;
      }


      .mana-v940-status{
        flex:
          0
          0
          auto;

        padding:
          5px
          8px;

        border:
          1px solid
          #3a3a3a;

        border-radius:999px;

        color:#888;

        font-size:9px;

        font-weight:900;

        text-transform:uppercase;
      }


      .mana-v940-status.due{
        border-color:#756122;

        background:#1b1708;

        color:#f3d875;
      }


      .mana-v940-open{
        width:100%;

        min-height:48px;

        margin-top:13px;

        border:0;

        border-radius:14px;

        background:#f3d875;

        color:#111;

        font-size:13px;

        font-weight:900;
      }


      .mana-v940-open.secondary{
        border:
          1px solid
          #4b411d;

        background:#12100a;

        color:#f3d875;
      }


      /* ==========================
         MODAL
         ========================== */

      #${MODAL_ID}{
        position:fixed;

        inset:0;

        z-index:33000;

        display:none;

        align-items:flex-end;

        background:
          rgba(
            0,
            0,
            0,
            .88
          );
      }


      #${MODAL_ID}.open{
        display:flex;
      }


      .mana-v940-sheet{
        width:100%;

        max-height:94dvh;

        overflow:auto;

        padding:
          22px
          18px
          calc(
            28px +
            env(
              safe-area-inset-bottom
            )
          );

        border:
          1px solid
          #383838;

        border-radius:
          28px
          28px
          0
          0;

        background:#0d0d0d;
      }


      .mana-v940-inner{
        width:min(
          520px,
          100%
        );

        margin:auto;
      }


      .mana-v940-top{
        display:flex;

        justify-content:
          space-between;

        align-items:
          flex-start;

        gap:14px;
      }


      .mana-v940-kicker{
        color:#f3d875;

        font-size:10px;

        font-weight:900;

        letter-spacing:.14em;
      }


      .mana-v940-title{
        margin:
          5px
          0
          4px;

        color:#fff;

        font-size:28px;

        line-height:1.05;
      }


      .mana-v940-sub{
        color:#888;

        font-size:12px;

        line-height:1.5;
      }


      .mana-v940-close{
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
      }


      .mana-v940-field{
        margin-top:16px;
      }


      .mana-v940-field label{
        display:block;

        margin-bottom:7px;

        color:#ddd;

        font-size:12px;

        font-weight:800;
      }


      .mana-v940-field small{
        display:block;

        margin-top:-3px;

        margin-bottom:7px;

        color:#777;

        font-size:10px;

        line-height:1.4;
      }


      .mana-v940-field select,
      .mana-v940-field textarea{
        width:100%;

        border:
          1px solid
          #333;

        border-radius:14px;

        background:#080808;

        color:#fff;

        font:inherit;
      }


      .mana-v940-field select{
        min-height:50px;

        padding:
          0
          13px;
      }


      .mana-v940-field textarea{
        min-height:92px;

        padding:
          12px
          13px;

        resize:vertical;

        line-height:1.5;
      }


      .mana-v940-submit{
        width:100%;

        min-height:54px;

        margin-top:18px;

        border:0;

        border-radius:16px;

        background:#f3d875;

        color:#111;

        font-size:14px;

        font-weight:900;
      }


      .mana-v940-submit:disabled{
        opacity:.55;
      }


      .mana-v940-msg{
        margin-top:11px;

        min-height:18px;

        color:#8ed49a;

        font-size:11px;

        line-height:1.4;
      }


      .mana-v940-note{
        margin-top:15px;

        padding-top:13px;

        border-top:
          1px solid
          #252525;

        color:#696969;

        font-size:10px;

        line-height:1.45;
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
        class="mana-v940-sheet"
      >

        <div
          class="mana-v940-inner"
        >

          <div
            class="mana-v940-top"
          >

            <div>

              <div
                class="mana-v940-kicker"
              >
                MANA STRENGTH
              </div>

              <h2
                class="mana-v940-title"
              >
                Coach Check-in
              </h2>

              <div
                class="mana-v940-sub"
              >
                A quick update helps your
                coach understand how training
                is going and where you need
                support.
              </div>

            </div>


            <button
              type="button"
              class="mana-v940-close"
              id="manaV94Close"
            >
              ×
            </button>

          </div>


          <div
            class="mana-v940-field"
          >

            <label
              for="manaV94Energy"
            >
              Energy today
            </label>

            <select
              id="manaV94Energy"
            >

              <option value="">
                Select energy
              </option>

              <option value="1">
                1 / 10
              </option>

              <option value="2">
                2 / 10
              </option>

              <option value="3">
                3 / 10
              </option>

              <option value="4">
                4 / 10
              </option>

              <option value="5">
                5 / 10
              </option>

              <option value="6">
                6 / 10
              </option>

              <option value="7">
                7 / 10
              </option>

              <option value="8">
                8 / 10
              </option>

              <option value="9">
                9 / 10
              </option>

              <option value="10">
                10 / 10
              </option>

            </select>

          </div>


          <div
            class="mana-v940-field"
          >

            <label
              for="manaV94Win"
            >
              What's going well?
            </label>

            <small>
              Training wins, consistency,
              strength, recovery or Fuel.
            </small>

            <textarea
              id="manaV94Win"
              placeholder="A quick win from your week..."
            ></textarea>

          </div>


          <div
            class="mana-v940-field"
          >

            <label
              for="manaV94Challenge"
            >
              What's been challenging?
            </label>

            <textarea
              id="manaV94Challenge"
              placeholder="Anything getting in the way..."
            ></textarea>

          </div>


          <div
            class="mana-v940-field"
          >

            <label
              for="manaV94Support"
            >
              What do you want help with?
            </label>

            <textarea
              id="manaV94Support"
              placeholder="Tell your coach what you need..."
            ></textarea>

          </div>


          <button
            type="button"
            class="mana-v940-submit"
            id="manaV94Submit"
          >
            SEND CHECK-IN →
          </button>


          <div
            class="mana-v940-msg"
            id="manaV94Message"
          ></div>


          <div
            class="mana-v940-note"
          >
            Your check-in is saved to your
            coaching history so your coach
            can review it with your training
            and progress.
          </div>

        </div>

      </div>

    `;


    document.body.appendChild(
      modal
    );


    document
      .getElementById(
        "manaV94Close"
      )
      .onclick =
        closeModal;


    document
      .getElementById(
        "manaV94Submit"
      )
      .onclick =
        submitCheckin;


    modal.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          modal
        ) {
          closeModal();
        }

      }
    );
  }


  function openModal() {
    ensureModal();


    document
      .getElementById(
        "manaV94Message"
      )
      .textContent = "";


    document
      .getElementById(
        MODAL_ID
      )
      .classList
      .add("open");
  }


  function closeModal() {
    document
      .getElementById(
        MODAL_ID
      )
      ?.classList
      .remove("open");
  }


  function resetForm() {
    [
      "manaV94Energy",
      "manaV94Win",
      "manaV94Challenge",
      "manaV94Support"
    ]
      .forEach(
        id => {

          const el =
            document.getElementById(
              id
            );

          if (el) {
            el.value = "";
          }

        }
      );
  }


  function buildNote() {
    const win =
      document
        .getElementById(
          "manaV94Win"
        )
        ?.value
        ?.trim() || "";


    const challenge =
      document
        .getElementById(
          "manaV94Challenge"
        )
        ?.value
        ?.trim() || "";


    const support =
      document
        .getElementById(
          "manaV94Support"
        )
        ?.value
        ?.trim() || "";


    return [

      "MANA STRENGTH COACH CHECK-IN",

      win
        ? `Going well: ${win}`
        : "",

      challenge
        ? `Challenge: ${challenge}`
        : "",

      support
        ? `Support needed: ${support}`
        : ""

    ]
      .filter(Boolean)
      .join("\n\n");
  }


  async function loadPendingRequest() {
    pendingRequest =
      null;


    const userId =
      currentClientId();


    if (
      !userId ||
      typeof supabaseClient !==
        "function"
    ) {

      renderCard();

      return;
    }


    try {

      const c =
        await supabaseClient();


      const {
        data,
        error
      } =
        await c
          .from(
            "checkin_requests"
          )
          .select(
            "id,status,requested_at"
          )
          .eq(
            "client_id",
            userId
          )
          .eq(
            "status",
            "requested"
          )
          .order(
            "requested_at",
            {
              ascending:false
            }
          )
          .limit(1);


      if (error) {
        throw error;
      }


      pendingRequest =
        data?.[0] ||
        null;

    } catch (error) {

      console.warn(
        "Mana Strength pending check-in",
        error
      );

    }


    renderCard();
  }


  function renderCard() {
    if (
      !strengthOverviewOpen()
    ) {
      return;
    }


    const coachSection =
      document.querySelector(
        ".mana-v865-coach"
      );


    if (!coachSection) {
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


      coachSection
        .appendChild(
          card
        );

    }


    const due =
      Boolean(
        pendingRequest
      );


    card.innerHTML = `

      <div
        class="mana-v940-row"
      >

        <div>

          <div
            class="mana-v940-card-kicker"
          >
            WEEKLY CHECK-IN
          </div>


          <div
            class="mana-v940-card-title"
          >
            ${
              due
                ? "Your coach is waiting for an update"
                : "Keep your coach in the loop"
            }
          </div>


          <div
            class="mana-v940-card-copy"
          >
            ${
              due
                ? "Send a quick update on your energy, wins, challenges and where you need support."
                : "You can send a coaching update anytime — you don't need to wait for a request."
            }
          </div>

        </div>


        <div
          class="
            mana-v940-status
            ${due ? "due" : ""}
          "
        >
          ${
            due
              ? "DUE"
              : "OPEN"
          }
        </div>

      </div>


      <button
        type="button"
        class="
          mana-v940-open
          ${due ? "" : "secondary"}
        "
        id="manaV94Open"
      >
        ${
          due
            ? "COMPLETE CHECK-IN →"
            : "SEND COACH UPDATE →"
        }
      </button>

    `;


    document
      .getElementById(
        "manaV94Open"
      )
      ?.addEventListener(
        "click",
        openModal
      );
  }


  async function submitCheckin() {
    if (loading) {
      return;
    }


    const userId =
      currentClientId();


    const energy =
      Number(
        document
          .getElementById(
            "manaV94Energy"
          )
          ?.value || 0
      );


    const note =
      buildNote();


    const message =
      document.getElementById(
        "manaV94Message"
      );


    const meaningfulNote =
      note
        .replace(
          "MANA STRENGTH COACH CHECK-IN",
          ""
        )
        .trim();


    if (
      !energy &&
      !meaningfulNote
    ) {

      if (message) {

        message.textContent =
          "Add your energy or a quick update first.";

      }

      return;
    }


    if (
      !userId ||
      typeof supabaseClient !==
        "function"
    ) {

      if (message) {

        message.textContent =
          "Your account connection isn't ready yet.";

      }

      return;
    }


    loading =
      true;


    const button =
      document.getElementById(
        "manaV94Submit"
      );


    if (button) {

      button.disabled =
        true;

      button.textContent =
        "SENDING…";

    }


    try {

      const c =
        await supabaseClient();


      const {
        error
      } =
        await c
          .from(
            "checkins"
          )
          .insert({

            user_id:
              userId,

            energy:
              energy || null,

            note:
              note || null

          });


      if (error) {
        throw error;
      }


      if (
        pendingRequest?.id
      ) {

        const {
          error:
            requestError
        } =
          await c
            .from(
              "checkin_requests"
            )
            .update({

              status:
                "completed",

              completed_at:
                new Date()
                  .toISOString()

            })
            .eq(
              "id",
              pendingRequest.id
            );


        if (requestError) {
          throw requestError;
        }

      }


      if (message) {

        message.textContent =
          "Check-in sent ✓";

      }


      resetForm();


      pendingRequest =
        null;


      setTimeout(
        () => {

          closeModal();

          renderCard();


          if (
            typeof
              window
                .refreshManaStrengthOverview ===
            "function"
          ) {

            window
              .refreshManaStrengthOverview();

          }

        },
        650
      );

    } catch (error) {

      console.error(
        "Mana Strength check-in",
        error
      );


      if (message) {

        message.textContent =
          error?.message ||
          "Could not send your check-in.";

      }

    } finally {

      loading =
        false;


      if (button) {

        button.disabled =
          false;

        button.textContent =
          "SEND CHECK-IN →";

      }

    }
  }


  function refresh() {
    if (
      !strengthOverviewOpen()
    ) {
      return;
    }


    loadPendingRequest();
  }


  function watch() {
    window.addEventListener(
      "mana:program-tab-change",
      () => {

        setTimeout(
          refresh,
          180
        );

      }
    );


    window.addEventListener(
      "mana:strength-synced",
      () => {

        setTimeout(
          refresh,
          200
        );

      }
    );


    window.addEventListener(
      "focus",
      () => {

        if (
          strengthOverviewOpen()
        ) {

          setTimeout(
            refresh,
            180
          );

        }

      }
    );


    const observer =
      new MutationObserver(
        () => {

          if (
            strengthOverviewOpen() &&
            !document
              .getElementById(
                CARD_ID
              )
          ) {

            setTimeout(
              renderCard,
              60
            );

          }

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


  function init() {
    injectStyles();

    ensureModal();

    watch();


    setTimeout(
      refresh,
      1300
    );
  }


  window.openManaStrengthCheckin =
    openModal;


  window.refreshManaStrengthCheckin =
    refresh;


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
