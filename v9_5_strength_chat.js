/* =========================================
   MANA MOVEMENT TRAINING v9.5.1
   MANA STRENGTH — COACH CHAT

   CLIENT ↔ COACH MESSAGING

   FIX:
   - CLIENT COACH CHAT CARD NOW ALWAYS
     USES THE YELLOW BUTTON VERSION
   ========================================= */

(() => {
  "use strict";


  const STYLE_ID =
    "mana-v950-chat-style";

  const MODAL_ID =
    "manaV95ChatModal";

  const CLIENT_CARD_ID =
    "manaV95ClientChatCard";

  const COACH_CARD_ID =
    "manaV95CoachChatCard";


  let chatMode =
    "client";

  let activeClientId =
    "";

  let activeClientName =
    "Client";

  let refreshTimer =
    null;

  let loading =
    false;


  /* =========================================
     HELPERS
     ========================================= */

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


  function currentUserId() {
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


  function coachDetailOpen() {
    const detail =
      document.getElementById(
        "coachClientDetailView"
      );


    return Boolean(
      detail &&
      !detail.classList
        .contains("hide")
    );
  }


  function formatTime(
    value
  ) {
    if (!value) {
      return "";
    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }


    const now =
      new Date();


    const sameDay =
      date.toDateString() ===
      now.toDateString();


    if (sameDay) {

      return date.toLocaleTimeString(
        [],
        {
          hour:"numeric",
          minute:"2-digit"
        }
      );

    }


    return date.toLocaleDateString(
      [],
      {
        day:"numeric",
        month:"short"
      }
    );
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

      #${CLIENT_CARD_ID}{
        margin-top:14px;

        padding:17px;

        border:
          1px solid
          #5a4b1c;

        border-radius:18px;

        background:
          linear-gradient(
            145deg,
            #191608,
            #090909
          );
      }


      .mana-v950-card-row{
        display:flex;

        justify-content:
          space-between;

        align-items:flex-start;

        gap:12px;
      }


      .mana-v950-card-title{
        margin-top:0;

        color:#fff;

        font-size:19px;

        font-weight:900;
      }


      .mana-v950-card-preview{
        margin-top:6px;

        color:#898989;

        font-size:11px;

        line-height:1.5;
      }


      .mana-v950-open{
        width:100%;

        min-height:49px;

        margin-top:13px;

        border:0;

        border-radius:14px;

        background:#f3d875;

        color:#111;

        font-size:13px;

        font-weight:900;

        cursor:pointer;
      }


      .mana-v950-open:active{
        transform:scale(.99);
      }


      #${COACH_CARD_ID}{
        border-color:#66561e;

        background:
          linear-gradient(
            145deg,
            #191608,
            #0b0b0b
          );
      }


      #${COACH_CARD_ID}
      .mana-v950-open{
        margin-top:12px;
      }


      #${MODAL_ID}{
        position:fixed;

        inset:0;

        z-index:50000;

        display:none;

        flex-direction:column;

        background:#050505;

        color:#fff;
      }


      #${MODAL_ID}.open{
        display:flex;
      }


      .mana-v950-header{
        flex:
          0
          0
          auto;

        display:flex;

        justify-content:
          space-between;

        align-items:center;

        gap:12px;

        padding:
          calc(
            env(
              safe-area-inset-top
            ) + 14px
          )
          16px
          14px;

        border-bottom:
          1px solid
          #252525;

        background:#090909;
      }


      .mana-v950-header-copy{
        min-width:0;
      }


      .mana-v950-header-kicker{
        color:#f3d875;

        font-size:9px;

        font-weight:900;

        letter-spacing:.13em;
      }


      .mana-v950-header-title{
        margin-top:4px;

        color:#fff;

        font-size:20px;

        font-weight:900;
      }


      .mana-v950-header-sub{
        margin-top:3px;

        color:#777;

        font-size:10px;
      }


      .mana-v950-close{
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


      .mana-v950-messages{
        flex:1;

        overflow:auto;

        padding:
          18px
          max(
            14px,
            calc(
              (
                100vw - 640px
              ) / 2
            )
          )
          20px;
      }


      .mana-v950-empty{
        width:min(
          500px,
          100%
        );

        margin:
          50px
          auto;

        text-align:center;

        color:#777;

        font-size:12px;

        line-height:1.6;
      }


      .mana-v950-message{
        width:min(
          76%,
          420px
        );

        margin:
          8px
          0;

        padding:
          11px
          13px;

        border:
          1px solid
          #292929;

        border-radius:
          17px
          17px
          17px
          5px;

        background:#111;
      }


      .mana-v950-message.mine{
        margin-left:auto;

        border-color:#67571d;

        border-radius:
          17px
          17px
          5px
          17px;

        background:
          linear-gradient(
            145deg,
            #292107,
            #171306
          );
      }


      .mana-v950-message-name{
        margin-bottom:4px;

        color:#f3d875;

        font-size:9px;

        font-weight:900;

        letter-spacing:.06em;

        text-transform:uppercase;
      }


      .mana-v950-message-body{
        color:#eee;

        font-size:13px;

        line-height:1.5;

        white-space:pre-wrap;

        overflow-wrap:anywhere;
      }


      .mana-v950-message-time{
        margin-top:6px;

        color:#666;

        font-size:8px;

        text-align:right;
      }


      .mana-v950-compose{
        flex:
          0
          0
          auto;

        padding:
          12px
          max(
            12px,
            calc(
              (
                100vw - 640px
              ) / 2
            )
          )
          calc(
            12px +
            env(
              safe-area-inset-bottom
            )
          );

        border-top:
          1px solid
          #252525;

        background:#090909;
      }


      .mana-v950-compose-inner{
        display:grid;

        grid-template-columns:
          minmax(
            0,
            1fr
          )
          auto;

        gap:8px;

        align-items:end;
      }


      .mana-v950-input{
        width:100%;

        min-height:48px;

        max-height:120px;

        padding:
          12px
          13px;

        border:
          1px solid
          #343434;

        border-radius:15px;

        background:#111;

        color:#fff;

        resize:none;

        font:inherit;

        font-size:13px;

        line-height:1.4;
      }


      .mana-v950-send{
        min-width:76px;

        height:48px;

        padding:
          0
          15px;

        border:0;

        border-radius:15px;

        background:#f3d875;

        color:#111;

        font-size:12px;

        font-weight:900;
      }


      .mana-v950-send:disabled{
        opacity:.5;
      }


      .mana-v950-status{
        min-height:16px;

        margin-top:6px;

        color:#777;

        font-size:9px;
      }


      @media(
        min-width:800px
      ){

        .mana-v950-message{
          width:min(
            65%,
            430px
          );
        }

      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* =========================================
     MODAL
     ========================================= */

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
        class="mana-v950-header"
      >

        <div
          class="mana-v950-header-copy"
        >

          <div
            class="mana-v950-header-kicker"
            id="manaV95ChatKicker"
          >
            MANA STRENGTH
          </div>

          <div
            class="mana-v950-header-title"
            id="manaV95ChatTitle"
          >
            Coach Chat
          </div>

          <div
            class="mana-v950-header-sub"
            id="manaV95ChatSub"
          >
            Direct support inside Mana.
          </div>

        </div>


        <button
          type="button"
          class="mana-v950-close"
          id="manaV95ChatClose"
        >
          ×
        </button>

      </div>


      <div
        class="mana-v950-messages"
        id="manaV95Messages"
      ></div>


      <div
        class="mana-v950-compose"
      >

        <div
          class="mana-v950-compose-inner"
        >

          <textarea
            class="mana-v950-input"
            id="manaV95Input"
            rows="1"
            maxlength="2000"
            placeholder="Write a message..."
          ></textarea>


          <button
            type="button"
            class="mana-v950-send"
            id="manaV95Send"
          >
            SEND
          </button>

        </div>


        <div
          class="mana-v950-status"
          id="manaV95Status"
        ></div>

      </div>

    `;


    document.body
      .appendChild(
        modal
      );


    document
      .getElementById(
        "manaV95ChatClose"
      )
      .onclick =
        closeChat;


    document
      .getElementById(
        "manaV95Send"
      )
      .onclick =
        sendMessage;


    document
      .getElementById(
        "manaV95Input"
      )
      .addEventListener(
        "keydown",
        event => {

          if (
            event.key ===
              "Enter" &&
            !event.shiftKey
          ) {

            event.preventDefault();

            sendMessage();

          }

        }
      );
  }


  function openChat() {
    ensureModal();


    const modal =
      document.getElementById(
        MODAL_ID
      );


    const title =
      document.getElementById(
        "manaV95ChatTitle"
      );


    const sub =
      document.getElementById(
        "manaV95ChatSub"
      );


    const input =
      document.getElementById(
        "manaV95Input"
      );


    if (
      chatMode ===
      "coach"
    ) {

      title.textContent =
        `${activeClientName} • Chat`;

      sub.textContent =
        "Mana Strength coaching conversation.";

      input.placeholder =
        `Message ${activeClientName}...`;

    } else {

      title.textContent =
        "Coach Chat";

      sub.textContent =
        "Message Lewis about your training, Fuel or progress.";

      input.placeholder =
        "Message your coach...";

    }


    modal.classList.add(
      "open"
    );


    document.body.style.overflow =
      "hidden";


    loadMessages();

    startRefresh();


    setTimeout(
      () => {

        input.focus();

      },
      200
    );
  }


  function closeChat() {
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


    stopRefresh();

    refreshCards();
  }


  /* =========================================
     LOAD MESSAGES
     ========================================= */

  async function getMessages(
    clientId
  ) {
    if (
      !clientId ||
      typeof supabaseClient !==
        "function"
    ) {
      return [];
    }


    const c =
      await supabaseClient();


    const {
      data,
      error
    } =
      await c
        .from(
          "strength_messages"
        )
        .select(
          "id,client_id,sender_id,sender_role,body,created_at"
        )
        .eq(
          "client_id",
          clientId
        )
        .order(
          "created_at",
          {
            ascending:true
          }
        )
        .limit(
          100
        );


    if (error) {
      throw error;
    }


    return data || [];
  }


  async function loadMessages() {
    const host =
      document.getElementById(
        "manaV95Messages"
      );


    if (
      !host ||
      !activeClientId
    ) {
      return;
    }


    try {

      const messages =
        await getMessages(
          activeClientId
        );


      renderMessages(
        messages
      );

    } catch (error) {

      host.innerHTML = `

        <div
          class="mana-v950-empty"
        >
          Could not load messages.<br>
          ${esc(
            error?.message ||
            "Please try again."
          )}
        </div>

      `;

    }
  }


  function renderMessages(
    messages
  ) {
    const host =
      document.getElementById(
        "manaV95Messages"
      );


    if (!host) {
      return;
    }


    if (
      !messages.length
    ) {

      host.innerHTML = `

        <div
          class="mana-v950-empty"
        >
          No messages yet.<br><br>
          ${
            chatMode === "coach"
              ? `Send ${esc(
                  activeClientName
                )} their first coaching message.`
              : "Send Lewis a message whenever you need support."
          }
        </div>

      `;


      return;
    }


    const mineRole =
      chatMode ===
        "coach"
        ? "coach"
        : "client";


    host.innerHTML =
      messages
        .map(
          message => {

            const mine =
              message.sender_role ===
              mineRole;


            const name =
              message.sender_role ===
                "coach"
                ? "Lewis"
                : activeClientName;


            return `

              <div
                class="
                  mana-v950-message
                  ${mine ? "mine" : ""}
                "
              >

                <div
                  class="mana-v950-message-name"
                >
                  ${esc(
                    mine
                      ? "You"
                      : name
                  )}
                </div>


                <div
                  class="mana-v950-message-body"
                >
                  ${esc(
                    message.body
                  )}
                </div>


                <div
                  class="mana-v950-message-time"
                >
                  ${esc(
                    formatTime(
                      message.created_at
                    )
                  )}
                </div>

              </div>

            `;

          }
        )
        .join("");


    host.scrollTop =
      host.scrollHeight;
  }


  /* =========================================
     SEND
     ========================================= */

  async function sendMessage() {
    if (
      loading ||
      !activeClientId
    ) {
      return;
    }


    const input =
      document.getElementById(
        "manaV95Input"
      );


    const status =
      document.getElementById(
        "manaV95Status"
      );


    const button =
      document.getElementById(
        "manaV95Send"
      );


    const body =
      String(
        input?.value ||
        ""
      ).trim();


    if (!body) {
      return;
    }


    const userId =
      currentUserId();


    if (!userId) {

      if (status) {

        status.textContent =
          "Your account connection isn't ready.";

      }

      return;
    }


    loading =
      true;


    if (button) {

      button.disabled =
        true;

      button.textContent =
        "…";

    }


    if (status) {

      status.textContent =
        "Sending…";

    }


    try {

      const c =
        await supabaseClient();


      const senderRole =
        chatMode ===
          "coach"
          ? "coach"
          : "client";


      const {
        error
      } =
        await c
          .from(
            "strength_messages"
          )
          .insert({

            client_id:
              activeClientId,

            sender_id:
              userId,

            sender_role:
              senderRole,

            body

          });


      if (error) {
        throw error;
      }


      input.value =
        "";


      if (status) {

        status.textContent =
          "Sent ✓";

      }


      await loadMessages();


      setTimeout(
        () => {

          if (status) {

            status.textContent =
              "";

          }

        },
        1000
      );

    } catch (error) {

      console.error(
        "Mana Strength chat send",
        error
      );


      if (status) {

        status.textContent =
          error?.message ||
          "Could not send message.";

      }

    } finally {

      loading =
        false;


      if (button) {

        button.disabled =
          false;

        button.textContent =
          "SEND";

      }

    }
  }


  /* =========================================
     CLIENT CARD
     ========================================= */

  async function renderClientCard() {
    if (
      !strengthOverviewOpen()
    ) {
      return;
    }


    const section =
      document.querySelector(
        ".mana-v866-coach"
      );


    if (!section) {
      return;
    }


    let card =
      document.getElementById(
        CLIENT_CARD_ID
      );


    if (!card) {

      card =
        document.createElement(
          "div"
        );


      card.id =
        CLIENT_CARD_ID;


      section.appendChild(
        card
      );

    }


    let preview =
      "Direct support with your coach inside Mana.";


    const clientId =
      currentUserId();


    if (clientId) {

      try {

        const messages =
          await getMessages(
            clientId
          );


        const latest =
          messages[
            messages.length - 1
          ];


        if (latest) {

          const prefix =
            latest.sender_role ===
              "coach"
              ? "Lewis: "
              : "You: ";


          preview =
            prefix +
            String(
              latest.body
            ).slice(
              0,
              90
            );


          if (
            latest.body.length >
            90
          ) {

            preview +=
              "…";

          }

        }

      } catch (_) {}

    }


    /*
      This is now the ONLY client
      Coach Chat card design.

      No LIVE badge.
      No duplicate kicker.
      Yellow button remains permanent.
    */

    card.innerHTML = `

      <div
        class="mana-v950-card-row"
      >

        <div>

          <div
            class="mana-v950-card-title"
          >
            Coach Chat
          </div>


          <div
            class="mana-v950-card-preview"
          >
            ${esc(
              preview
            )}
          </div>

        </div>

      </div>


      <button
        type="button"
        class="mana-v950-open"
        id="manaV95ClientOpen"
      >
        MESSAGE YOUR COACH →
      </button>

    `;


    document
      .getElementById(
        "manaV95ClientOpen"
      )
      .onclick =
        () => {

          chatMode =
            "client";

          activeClientId =
            currentUserId();

          activeClientName =
            "You";

          openChat();

        };
  }


  /* =========================================
     COACH CLIENT CARD
     ========================================= */

  function renderCoachCard() {
    if (
      !coachDetailOpen()
    ) {
      return;
    }


    let selected =
      null;


    try {

      if (
        typeof selectedCoachClient !==
          "undefined"
      ) {

        selected =
          selectedCoachClient;

      }

    } catch (_) {}


    if (
      !selected?.userId
    ) {
      return;
    }


    let card =
      document.getElementById(
        COACH_CARD_ID
      );


    if (!card) {

      card =
        document.createElement(
          "div"
        );


      card.id =
        COACH_CARD_ID;

      card.className =
        "card";


      const anchor =
        document.getElementById(
          "clientSessionSummaryCard"
        );


      if (anchor) {

        anchor.insertAdjacentElement(
          "beforebegin",
          card
        );

      } else {

        document
          .getElementById(
            "coachClientDetailView"
          )
          ?.appendChild(
            card
          );

      }

    }


    card.innerHTML = `

      <div
        class="mana-v950-card-row"
      >

        <div>

          <div
            class="mana-v950-card-kicker"
          >
            MANA STRENGTH
          </div>


          <div
            class="mana-v950-card-title"
          >
            Coach Chat
          </div>


          <div
            class="mana-v950-card-preview"
          >
            Message ${esc(
              selected.clientName ||
              "this client"
            )} directly inside Mana.
          </div>

        </div>


        <div
          class="mana-v950-live"
        >
          LIVE
        </div>

      </div>


      <button
        type="button"
        class="mana-v950-open"
        id="manaV95CoachOpen"
      >
        OPEN CLIENT CHAT →
      </button>

    `;


    document
      .getElementById(
        "manaV95CoachOpen"
      )
      .onclick =
        () => {

          chatMode =
            "coach";

          activeClientId =
            selected.userId;

          activeClientName =
            selected.clientName ||
            "Client";

          openChat();

        };
  }


  /* =========================================
     REFRESH
     ========================================= */

  function refreshCards() {
    if (
      strengthOverviewOpen()
    ) {

      renderClientCard();

    }


    if (
      coachDetailOpen()
    ) {

      renderCoachCard();

    }
  }


  function startRefresh() {
    stopRefresh();


    refreshTimer =
      setInterval(
        () => {

          const modal =
            document.getElementById(
              MODAL_ID
            );


          if (
            modal
              ?.classList
              .contains("open")
          ) {

            loadMessages();

          }

        },
        5000
      );
  }


  function stopRefresh() {
    if (
      refreshTimer
    ) {

      clearInterval(
        refreshTimer
      );


      refreshTimer =
        null;

    }
  }


  /* =========================================
     WATCH APP
     ========================================= */

  function watch() {

    window.addEventListener(
      "mana:program-tab-change",
      () => {

        setTimeout(
          refreshCards,
          160
        );

      }
    );


    window.addEventListener(
      "mana:strength-synced",
      () => {

        setTimeout(
          refreshCards,
          180
        );

      }
    );


    window.addEventListener(
      "focus",
      () => {

        setTimeout(
          refreshCards,
          120
        );

      }
    );


    let mutationTimer =
      null;


    const observer =
      new MutationObserver(
        () => {

          clearTimeout(
            mutationTimer
          );


          mutationTimer =
            setTimeout(
              () => {

                if (
                  strengthOverviewOpen() &&
                  !document.getElementById(
                    CLIENT_CARD_ID
                  )
                ) {

                  renderClientCard();

                }


                if (
                  coachDetailOpen() &&
                  !document.getElementById(
                    COACH_CARD_ID
                  )
                ) {

                  renderCoachCard();

                }

              },
              90
            );

        }
      );


    observer.observe(
      document.body,
      {
        childList:true,
        subtree:true,
        attributes:true,
        attributeFilter:[
          "class"
        ]
      }
    );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {
    injectStyles();

    ensureModal();

    watch();


    [
      900,
      1600,
      2600
    ].forEach(
      delay => {

        setTimeout(
          refreshCards,
          delay
        );

      }
    );
  }


  window.openManaStrengthClientChat =
    () => {

      chatMode =
        "client";

      activeClientId =
        currentUserId();

      activeClientName =
        "You";

      openChat();

    };


  window.refreshManaStrengthChat =
    refreshCards;


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
