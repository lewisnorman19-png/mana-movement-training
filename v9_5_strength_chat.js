
/* =====================================================
   MANA MOVEMENT TRAINING
   MANA STRENGTH — PREMIUM COACH CHAT
   BUILD 103610

   FULL REPLACEMENT:
   v9_5_strength_chat.js

   - Stable client and coach chat buttons
   - Fix missing onclick element errors
   - Fixed-height message input
   - Premium yellow and dark styling
   - SEND / SENDING / SENT states
   - Show genuine database errors
   - Preserve conversation history
   - Keep existing public chat functions
   - Refresh messages only while chat is open
   ===================================================== */

(() => {
  "use strict";

  if (window.MANA_STRENGTH_CHAT_103610) return;
  window.MANA_STRENGTH_CHAT_103610 = true;

  const BUILD = "103610";
  const GOLD = "#F3D875";
  const STYLE = "mana-v950-chat-style";
  const MODAL = "manaV95ChatModal";
  const CLIENT_CARD = "manaV95ClientChatCard";
  const COACH_CARD = "manaV95CoachChatCard";

  const $ = id => document.getElementById(id);

  let mode = "client";
  let clientId = "";
  let clientName = "Client";
  let sending = false;
  let refreshTimer = null;
  let refreshQueued = false;
  let loadingMessages = false;

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function userId() {
    try {
      if (
        typeof currentUser !== "undefined" &&
        currentUser?.id
      ) {
        return String(currentUser.id);
      }
    } catch (_) {}

    return "";
  }

  function strengthOverview() {
    return (
      $("manaV83ProgramShell")
        ?.classList.contains("open") &&
      $("manaV83Title")
        ?.textContent.trim().toUpperCase() ===
        "MANA STRENGTH" &&
      document.querySelector(
        "#manaV83Tabs .mana-v83-tab.active"
      )?.dataset.v83Tab === "overview"
    );
  }

  function coachDetail() {
    const view = $("coachClientDetailView");

    return Boolean(
      view &&
      !view.classList.contains("hide")
    );
  }

  function selectedClient() {
    try {
      if (
        typeof selectedCoachClient !== "undefined"
      ) {
        return selectedCoachClient;
      }
    } catch (_) {}

    return null;
  }

  function style() {
    if ($(STYLE)) return;

    const s = document.createElement("style");
    s.id = STYLE;

    s.textContent = `
      #${CLIENT_CARD},
      #${COACH_CARD} {
        margin-top: 14px;
        padding: 17px;
        border: 1.5px solid ${GOLD};
        border-radius: 18px;
        background: linear-gradient(
          145deg,#17140c,#090909
        );
        color: white;
      }

      .mana-v950-card-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
      }

      .mana-v950-card-kicker {
        color: ${GOLD};
        font-size: 10px;
        font-weight: 900;
        letter-spacing: .7px;
        margin-bottom: 6px;
      }

      .mana-v950-card-title {
        font-size: 19px;
        font-weight: 900;
        color: #fff;
      }

      .mana-v950-card-preview {
        margin-top: 7px;
        font-size: 12px;
        color: #b6b6b6;
        line-height: 1.55;
        overflow-wrap: anywhere;
      }

      .mana-v950-open {
        display: block;
        width: 100%;
        min-height: 49px;
        margin-top: 14px;
        padding: 12px;
        border: 0;
        border-radius: 13px;
        background: ${GOLD};
        color: #101010;
        font-size: 12px;
        font-weight: 950;
        cursor: pointer;
        touch-action: manipulation;
      }

      #${MODAL} {
        position: fixed;
        inset: 0;
        z-index: 100000;
        display: none;
        flex-direction: column;
        background: #070807;
        color: #fff;
        overflow: hidden;
        height: 100dvh;
      }

      #${MODAL}.open {
        display: flex;
      }

      #${MODAL} .mana-v950-header {
        flex: 0 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 15px;
        padding: 18px 22px;
        background: linear-gradient(
          145deg,#17150b,#090909
        );
        border-bottom: 1px solid ${GOLD};
      }

      #${MODAL} .mana-v950-header-kicker {
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 1px;
        color: ${GOLD};
      }

      #${MODAL} .mana-v950-header-title {
        margin-top: 4px;
        font-size: 23px;
        font-weight: 950;
        color: #fff;
      }

      #${MODAL} .mana-v950-header-sub {
        margin-top: 4px;
        font-size: 12px;
        line-height: 1.5;
        color: #aeb6ad;
      }

      #${MODAL} .mana-v950-close {
        flex: 0 0 42px;
        width: 42px;
        height: 42px;
        padding: 0;
        border: 1px solid #454545;
        border-radius: 50%;
        background: #121212;
        color: #fff;
        font-size: 22px;
        cursor: pointer;
      }

      #${MODAL} .mana-v950-messages {
        flex: 1 1 auto;
        min-height: 0;
        overflow-y: auto;
        overscroll-behavior: contain;
        padding: 20px max(
          16px,calc((100% - 720px)/2)
        );
        background: #090b09;
      }

      #${MODAL} .mana-v950-empty {
        margin: 20px auto;
        max-width: 480px;
        color: #aeb6ad;
        text-align: center;
        font-size: 13px;
        line-height: 1.6;
      }

      #${MODAL} .mana-v950-message {
        width: fit-content;
        max-width: 82%;
        margin: 0 auto 13px 0;
        padding: 12px 15px;
        box-sizing: border-box;
        border: 1px solid #444339;
        border-radius: 15px;
        background: #171915;
        color: #fff;
      }

      #${MODAL} .mana-v950-message.mine {
        margin-left: auto;
        margin-right: 0;
        border-color: ${GOLD};
        background: #242012;
      }

      #${MODAL} .mana-v950-message-name {
        color: ${GOLD};
        font-size: 10px;
        font-weight: 900;
        margin-bottom: 6px;
      }

      #${MODAL} .mana-v950-message-body {
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        line-height: 1.55;
        font-size: 13px;
      }

      #${MODAL} .mana-v950-message-time {
        color: #909090;
        margin-top: 7px;
        text-align: right;
        font-size: 10px;
      }

      #${MODAL} .mana-v950-compose {
        flex: 0 0 auto;
        border-top: 1px solid #4b401d;
        background: #0b0d0b;
        padding: 14px 16px calc(
          14px + env(safe-area-inset-bottom)
        );
      }

      #${MODAL} .mana-v950-compose-inner {
        display: grid;
        grid-template-columns: minmax(0,1fr) auto;
        gap: 9px;
        align-items: center;
        max-width: 720px;
        margin: auto;
      }

      #${MODAL} #manaV95Input {
        display: block;
        box-sizing: border-box;
        width: 100%;
        height: 54px !important;
        min-height: 54px !important;
        max-height: 54px !important;
        padding: 15px 13px;
        border: 1px solid #505149;
        border-radius: 13px;
        outline: none;
        background: #111511;
        color: #fff;
        font-family: inherit;
        font-size: 14px;
        line-height: 1.4;
        resize: none !important;
        overflow-y: auto !important;
      }

      #${MODAL} #manaV95Input:focus {
        border-color: ${GOLD};
      }

      #${MODAL} #manaV95Send {
        min-width: 88px;
        height: 54px;
        padding: 0 12px;
        border: 1px solid ${GOLD};
        border-radius: 13px;
        background: ${GOLD};
        color: #111;
        font-size: 12px;
        font-weight: 950;
        cursor: pointer;
      }

      #${MODAL} #manaV95Send:disabled {
        opacity: .65;
        cursor: wait;
      }

      #${MODAL} #manaV95Status {
        max-width: 720px;
        min-height: 17px;
        margin: 7px auto 0;
        color: #b7c3b5;
        font-size: 11px;
        line-height: 1.4;
      }

      @media(max-width:600px) {
        #${MODAL} .mana-v950-header {
          padding: 14px;
        }

        #${MODAL} .mana-v950-header-title {
          font-size: 20px;
        }

        #${MODAL} .mana-v950-messages {
          padding: 14px 11px;
        }

        #${MODAL} .mana-v950-message {
          max-width: 88%;
        }

        #${MODAL} .mana-v950-compose {
          padding: 11px 10px calc(
            11px + env(safe-area-inset-bottom)
          );
        }

        #${MODAL} #manaV95Send {
          min-width: 74px;
          padding: 0 9px;
        }
      }
    `;

    document.head.appendChild(s);
  }

  function ensureModal() {
    let modal = $(MODAL);

    if (!modal) {
      modal = document.createElement("div");
      modal.id = MODAL;
      document.body.appendChild(modal);
    }

    // Reuse the existing modal structure where
    // other Mana chat upgrades have installed it.
    if (
      $("manaV95Input") &&
      $("manaV95Send") &&
      $("manaV95Messages") &&
      $("manaV95ChatClose")
    ) return;

    modal.innerHTML = `
      <div class="mana-v950-header">
        <div>
          <div
            class="mana-v950-header-kicker"
            id="manaV95ChatKicker">
            MANA STRENGTH
          </div>

          <div
            class="mana-v950-header-title"
            id="manaV95ChatTitle">
            Coach Chat
          </div>

          <div
            class="mana-v950-header-sub"
            id="manaV95ChatSub">
            Direct support inside Mana.
          </div>
        </div>

        <button
          type="button"
          class="mana-v950-close"
          id="manaV95ChatClose"
          aria-label="Close chat">
          ×
        </button>
      </div>

      <div
        class="mana-v950-messages"
        id="manaV95Messages">
      </div>

      <div class="mana-v950-compose">
        <div class="mana-v950-compose-inner">
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
            id="manaV95Send">
            SEND
          </button>
        </div>

        <div
          class="mana-v950-status"
          id="manaV95Status">
        </div>
      </div>
    `;
  }

  function setStatus(message) {
    const status = $("manaV95Status");

    if (status) {
      status.textContent = message;
    }
  }

  function setSendLabel(value) {
    const button = $("manaV95Send");

    if (button) {
      button.textContent = value;
    }
  }

  function openChat(nextMode, nextId, nextName) {
    mode = nextMode;
    clientId = String(nextId || "");
    clientName = String(nextName || "Client");

    ensureModal();

    const modal = $(MODAL);
    if (!modal) return;

    const title = $("manaV95ChatTitle");
    const sub = $("manaV95ChatSub");
    const input = $("manaV95Input");

    if (title) {
      title.textContent = mode === "coach"
        ? clientName + " • Chat"
        : "Coach Chat";
    }

    if (sub) {
      sub.textContent = mode === "coach"
        ? "Mana Strength coaching conversation."
        : "Message your coach about training, Fuel or progress.";
    }

    if (input) {
      input.placeholder = mode === "coach"
        ? "Message " + clientName + "..."
        : "Message your coach...";
    }

    setSendLabel("SEND");
    setStatus("");

    modal.classList.add("open");
    document.body.style.overflow = "hidden";

    if (!clientId) {
      setStatus(
        "Your account connection isn't ready. " +
        "Please sign in and reopen Coach Chat."
      );
    } else {
      loadMessages();
    }

    startRefresh();
    input?.focus({preventScroll:true});
  }

  function closeChat() {
    $(MODAL)?.classList.remove("open");
    document.body.style.overflow = "";
    stopRefresh();
  }

  async function database() {
    if (typeof supabaseClient !== "function") {
      throw new Error(
        "Chat connection is unavailable. Please sign in again."
      );
    }

    const client = await supabaseClient();

    if (!client) {
      throw new Error(
        "Could not connect to Coach Chat."
      );
    }

    return client;
  }

  async function getMessages(id) {
    if (!id) return [];

    const db = await database();

    const {data,error} = await db
      .from("strength_messages")
      .select(
        "id,client_id,sender_id,sender_role,body,created_at"
      )
      .eq("client_id",id)
      .order("created_at",{ascending:true})
      .limit(100);

    if (error) throw error;

    return data || [];
  }

  function timeLabel(value) {
    const date = new Date(value);

    if (!Number.isFinite(date.getTime())) {
      return "";
    }

    return date.toLocaleString([],{
      day:"numeric",
      month:"short",
      hour:"numeric",
      minute:"2-digit"
    });
  }

  function renderMessages(messages) {
    const host = $("manaV95Messages");

    if (!host) return;

    if (!messages.length) {
      host.innerHTML = `
        <div class="mana-v950-empty">
          No messages yet.<br>
          Start a conversation with your coach.
        </div>
      `;
      return;
    }

    const current = userId();

    const html = messages.map(message => {
      const mine =
        String(message.sender_id) === current;

      const name = mine
        ? "You"
        : message.sender_role === "coach"
          ? "Coach"
          : clientName;

      return `
        <div class="mana-v950-message
          ${mine ? "mine" : ""}">

          <div class="mana-v950-message-name">
            ${esc(name)}
          </div>

          <div class="mana-v950-message-body">
            ${esc(message.body)}
          </div>

          <div class="mana-v950-message-time">
            ${esc(timeLabel(message.created_at))}
          </div>
        </div>
      `;
    }).join("");

    if (host.innerHTML !== html) {
      host.innerHTML = html;
      host.scrollTop = host.scrollHeight;
    }
  }

  async function loadMessages() {
    if (loadingMessages || !clientId) return;
    if (!$(MODAL)?.classList.contains("open")) {
      return;
    }

    loadingMessages = true;

    try {
      const requestedId = clientId;
      const messages = await getMessages(requestedId);

      if (
        requestedId === clientId &&
        $(MODAL)?.classList.contains("open")
      ) {
        renderMessages(messages);
      }
    } catch (error) {
      const host = $("manaV95Messages");

      if (host) {
        host.innerHTML = `
          <div class="mana-v950-empty">
            Unable to load conversation.<br>
            ${esc(error?.message || "Please retry.")}
          </div>
        `;
      }
    } finally {
      loadingMessages = false;
    }
  }

  async function sendMessage() {
    if (sending) return;

    const input = $("manaV95Input");
    const button = $("manaV95Send");

    const body = String(
      input?.value || ""
    ).trim();

    if (!body) {
      setStatus("Write a message before sending.");
      return;
    }

    const senderId = userId();

    if (!senderId || !clientId) {
      setStatus(
        "Your account connection isn't ready. " +
        "Please sign in again."
      );
      return;
    }

    sending = true;

    if (button) button.disabled = true;

    setSendLabel("SENDING…");
    setStatus("Sending message…");

    let sent = false;

    try {
      const db = await database();

      const {error} = await db
        .from("strength_messages")
        .insert({
          client_id:clientId,
          sender_id:senderId,
          sender_role:mode === "coach"
            ? "coach"
            : "client",
          body
        });

      if (error) throw error;

      sent = true;

      if (input) input.value = "";

      setSendLabel("SENT ✓");
      setStatus("Message sent successfully.");

      await loadMessages();

    } catch (error) {
      console.error(
        "Mana Strength Coach Chat send:",
        error
      );

      if (!sent) {
        setSendLabel("SEND");
        setStatus(
          "Message not sent: " +
          (error?.message || "Please try again.")
        );
      } else {
        setSendLabel("SENT ✓");
        setStatus(
          "Message sent. Conversation refresh unavailable."
        );
      }

    } finally {
      sending = false;

      if (button) button.disabled = false;
    }
  }

  function refreshClientCard() {
    if (!strengthOverview()) return;

    const section = document.querySelector(
      ".mana-v866-coach"
    );

    if (!section) return;

    let card = $(CLIENT_CARD);

    if (!card) {
      card = document.createElement("div");
      card.id = CLIENT_CARD;
      section.appendChild(card);
    }

    // Stable markup: don't repeatedly replace
    // the button and lose its click handler.
    if (card.dataset.chatReady === "1") {
      return;
    }

    card.dataset.chatReady = "1";

    card.innerHTML = `
      <div class="mana-v950-card-row">
        <div>
          <div class="mana-v950-card-title">
            Coach Chat
          </div>

          <div class="mana-v950-card-preview">
            Ask your coach about your workouts,
            nutrition or progress.
          </div>
        </div>
      </div>

      <button
        type="button"
        class="mana-v950-open"
        id="manaV95ClientOpen">
        MESSAGE YOUR COACH →
      </button>
    `;
  }

  function refreshCoachCard() {
    if (!coachDetail()) return;

    const selected = selectedClient();

    if (!selected?.userId) return;

    const host = $("coachClientDetailView");
    if (!host) return;

    let card = $(COACH_CARD);

    if (!card) {
      card = document.createElement("div");
      card.id = COACH_CARD;
      card.className = "card";

      const anchor = $("clientSessionSummaryCard");

      if (anchor) {
        anchor.before(card);
      } else {
        host.appendChild(card);
      }
    }

    const name = String(
      selected.clientName || "Client"
    );

    if (
      card.dataset.clientId ===
        String(selected.userId) &&
      card.dataset.clientName === name
    ) {
      return;
    }

    card.dataset.clientId = String(selected.userId);
    card.dataset.clientName = name;

    card.innerHTML = `
      <div class="mana-v950-card-kicker">
        MANA STRENGTH
      </div>

      <div class="mana-v950-card-title">
        Coach Chat
      </div>

      <div class="mana-v950-card-preview">
        Message ${esc(name)} directly inside Mana.
      </div>

      <button
        type="button"
        class="mana-v950-open"
        id="manaV95CoachOpen">
        OPEN CLIENT CHAT →
      </button>
    `;
  }

  function refreshCards() {
    refreshClientCard();
    refreshCoachCard();
  }

  function queueCardRefresh() {
    if (refreshQueued) return;

    refreshQueued = true;

    requestAnimationFrame(() => {
      refreshQueued = false;
      refreshCards();
    });
  }

  function startRefresh() {
    stopRefresh();

    refreshTimer = setInterval(() => {
      if ($(MODAL)?.classList.contains("open")) {
        loadMessages();
      }
    },15000);
  }

  function stopRefresh() {
    if (refreshTimer !== null) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
  }

  function handleClick(event) {
    if (!(event.target instanceof Element)) {
      return;
    }

    if (event.target.closest("#manaV95ClientOpen")) {
      openChat("client",userId(),"You");
      return;
    }

    if (event.target.closest("#manaV95CoachOpen")) {
      const selected = selectedClient();

      if (selected?.userId) {
        openChat(
          "coach",
          selected.userId,
          selected.clientName || "Client"
        );
      }
      return;
    }

    if (event.target.closest("#manaV95ChatClose")) {
      closeChat();
      return;
    }

    if (event.target.closest("#manaV95Send")) {
      sendMessage();
    }
  }

  function handleInput(event) {
    if (event.target?.id !== "manaV95Input") {
      return;
    }

    if (
      $("manaV95Send")?.textContent
        .includes("SENT")
    ) {
      setSendLabel("SEND");
      setStatus("");
    }
  }

  function handleKeydown(event) {
    if (
      event.target?.id !== "manaV95Input"
    ) return;

    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.isComposing
    ) {
      event.preventDefault();
      sendMessage();
    }
  }

  function init() {
    style();
    ensureModal();

    document.addEventListener("click",handleClick);
    document.addEventListener("input",handleInput);
    document.addEventListener(
      "keydown",
      handleKeydown
    );

    document.addEventListener("keydown",event => {
      if (
        event.key === "Escape" &&
        $(MODAL)?.classList.contains("open")
      ) {
        closeChat();
      }
    });

    [
      "mana:program-tab-change",
      "mana:profile-synced",
      "mana:strength-synced",
      "mana:workout-progress-change"
    ].forEach(name => {
      window.addEventListener(
        name,
        queueCardRefresh
      );
    });

    window.addEventListener(
      "pageshow",
      queueCardRefresh
    );

    window.addEventListener(
      "focus",
      queueCardRefresh
    );

    refreshCards();

    console.log(
      "Mana Strength Coach Chat",
      BUILD
    );
  }

  window.openManaStrengthClientChat = () => {
    openChat("client",userId(),"You");
  };

  window.refreshManaStrengthChat =
    queueCardRefresh;

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {once:true}
    );
  } else {
    init();
  }

})();
