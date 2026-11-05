
/* ============================================================
   MANA MOVEMENT — STRENGTH COACH CHAT 104090
   COMPLETE REPLACEMENT for v9_5_strength_chat.js
   (Upload as mana_strength_chat_104090.js; load ONLY this version.)

   Keeps the existing modal IDs, chat database table and public
   open functions, and all saved conversation history.
   Shows "SENT ✓" only after Supabase confirms the INSERT.
   No success claim for an unsigned account or failed save.
   Compatible with mana_strength_chat_mobile_103620.js.
   ============================================================ */
(() => {
  "use strict";
  if (window.MANA_STRENGTH_CHAT_104090) return;
  window.MANA_STRENGTH_CHAT_104090 = true;

  const MODAL = "manaV95ChatModal";
  const STYLE = "manaStrengthChatStyle104090";
  const $ = id => document.getElementById(id);

  let active = {role:"client",id:"",name:"Client"};
  let sending = false;
  let loading = false;
  let poll = null;
  let requestedOpen = 0;

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g,
      c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
  }

  function applyStyles() {
    if ($(STYLE)) return;
    const tag = document.createElement("style");
    tag.id = STYLE;
    tag.textContent = `
      #${MODAL} {
        position:fixed; inset:0; z-index:100050;
        display:none; flex-direction:column;
        width:100%; height:100dvh; max-height:100dvh;
        background:#08090B; color:#FFFFFF;
        box-sizing:border-box; overflow:hidden;
      }
      #${MODAL}.open {display:flex}
      #${MODAL} .mana-v950-header {
        flex:0 0 auto; padding:15px 18px;
        display:flex; justify-content:space-between; align-items:center;
        gap:16px; border-bottom:1px solid #515A65;
        background:#111317;
      }
      #${MODAL} .mana-v950-header-kicker {
        color:#FF7927; font-size:11px; font-weight:850; letter-spacing:.12em;
      }
      #${MODAL} .mana-v950-header-title {
        font-size:23px; font-weight:900; color:#FFFFFF;
      }
      #${MODAL} .mana-v950-header-sub {
        color:#C1C6CE; font-size:12px; line-height:1.45;
      }
      #${MODAL} .mana-v950-close {
        min-width:44px; min-height:44px; background:#171A1F;
        border:1px solid #707780; border-radius:12px;
        color:white; font-size:27px; cursor:pointer;
      }
      #${MODAL} .mana-v950-messages {
        flex:1 1 auto; min-height:0; overflow-y:auto;
        padding:16px; display:flex; flex-direction:column; gap:11px;
      }
      #${MODAL} .mana-v950-empty {
        color:#C1C6CE; padding:18px; line-height:1.5;
      }
      #${MODAL} .mana-v950-message {
        max-width:min(82%,600px); align-self:flex-start;
        padding:12px 15px; border-radius:15px;
        background:#1B2025; border:1px solid #515A65;
        overflow-wrap:anywhere;
      }
      #${MODAL} .mana-v950-message.mine {
        align-self:flex-end; background:#1D1A14; border-color:#FF7927;
      }
      #${MODAL} .mana-v950-message-name {
        color:#FF7927; font-size:11px; font-weight:850; margin-bottom:5px;
      }
      #${MODAL} .mana-v950-message-body {
        white-space:pre-wrap; color:#FFFFFF; font-size:14px; line-height:1.5;
      }
      #${MODAL} .mana-v950-message-time {
        color:#C1C6CE; font-size:10px; margin-top:5px;
      }
      #${MODAL} .mana-v950-compose {
        flex:0 0 auto; padding:12px 16px max(14px,env(safe-area-inset-bottom));
        border-top:1px solid #515A65; background:#111317;
      }
      #${MODAL} .mana-v950-compose-inner {
        display:flex; gap:10px; align-items:stretch; width:100%;
      }
      #${MODAL} .mana-v950-input {
        flex:1 1 auto; min-width:0; height:56px; min-height:56px;
        max-height:56px; resize:none; box-sizing:border-box;
        padding:14px; border-radius:12px; background:#08090B;
        border:1px solid #697686; color:#FFFFFF; font:500 16px/1.4 system-ui;
      }
      #${MODAL} .mana-v950-input:focus {
        outline:2px solid #FF7927; outline-offset:1px;
      }
      #${MODAL} .mana-v950-send {
        flex:0 0 110px; min-height:56px; background:#FF7927;
        border:1px solid #FF7927; border-radius:12px;
        color:#08090B; font:900 14px system-ui; cursor:pointer;
      }
      #${MODAL} .mana-v950-send:disabled {opacity:.65;cursor:wait}
      #${MODAL} .mana-v950-status {
        min-height:20px; padding-top:8px; font-size:13px;
        font-weight:750; color:#C1C6CE; line-height:1.4;
      }
      #${MODAL} .mana-v950-status[data-kind="sent"] {color:#20CDD4}
      #${MODAL} .mana-v950-status[data-kind="error"] {color:#FF937F}
      @media(max-width:600px) {
        #${MODAL} .mana-v950-header {padding:12px}
        #${MODAL} .mana-v950-compose {padding:10px 10px max(12px,env(safe-area-inset-bottom))}
        #${MODAL} .mana-v950-send {flex-basis:87px; font-size:12px}
        #${MODAL} .mana-v950-message {max-width:91%}
      }
    `;
    document.head.appendChild(tag);
  }

  function ensureModal() {
    let modal = $(MODAL);
    if (!modal) {
      modal = document.createElement("div");
      modal.id = MODAL;
      document.body.appendChild(modal);
    }
    // Keep stable element IDs for the existing mobile stability script.
    if ($("manaV95Input") && $("manaV95Send") &&
        $("manaV95Messages") && $("manaV95ChatClose")) return modal;
    modal.innerHTML = `
      <div class="mana-v950-header">
        <div>
          <div class="mana-v950-header-kicker" id="manaV95ChatKicker">MANA STRENGTH</div>
          <div class="mana-v950-header-title" id="manaV95ChatTitle">Coach Chat</div>
          <div class="mana-v950-header-sub" id="manaV95ChatSub">Direct coaching support</div>
        </div>
        <button type="button" class="mana-v950-close" id="manaV95ChatClose" aria-label="Close chat">×</button>
      </div>
      <div class="mana-v950-messages" id="manaV95Messages" aria-live="polite"></div>
      <div class="mana-v950-compose">
        <div class="mana-v950-compose-inner">
          <textarea class="mana-v950-input" id="manaV95Input"
            rows="1" maxlength="2000" placeholder="Write a message..."></textarea>
          <button type="button" class="mana-v950-send" id="manaV95Send">SEND</button>
        </div>
        <div class="mana-v950-status" id="manaV95Status" role="status" aria-live="polite"></div>
      </div>`;
    return modal;
  }

  function status(message,kind="normal") {
    const node = $("manaV95Status");
    if (!node) return;
    node.textContent = message;
    node.dataset.kind = kind;
  }

  function label(value) {
    const node = $("manaV95Send");
    if (node) node.textContent = value;
  }

  async function connection() {
    if (typeof supabaseClient !== "function") {
      throw new Error("Chat connection unavailable. Sign in again.");
    }
    const db = await supabaseClient();
    if (!db?.from || !db?.auth?.getUser) {
      throw new Error("Chat connection unavailable. Sign in again.");
    }
    return db;
  }

  async function authenticated(db) {
    const {data,error} = await db.auth.getUser();
    if (error || !data?.user?.id) {
      throw new Error("Your session has expired. Log in again.");
    }
    return data.user;
  }

  function coachSelection() {
    try {
      if (typeof selectedCoachClient !== "undefined" &&
          selectedCoachClient?.userId) {
        return {
          id:String(selectedCoachClient.userId),
          name:String(selectedCoachClient.clientName || "Client")
        };
      }
    } catch (_) {}
    return null;
  }

  async function open(role,chosenId="",chosenName="Client") {
    const epoch = ++requestedOpen;
    ensureModal();
    active = {
      role,
      id:String(chosenId || ""),
      name:String(chosenName || "Client")
    };
    $("manaV95ChatTitle").textContent =
      role === "coach" ? active.name+" • Chat" : "Coach Chat";
    $("manaV95ChatSub").textContent =
      role === "coach" ? "Mana Strength coaching conversation." :
        "Message your coach about training, Fuel or progress.";
    $("manaV95Input").placeholder =
      role === "coach" ? "Message "+active.name+"..." : "Message your coach...";
    $(MODAL).classList.add("open");
    document.body.style.overflow = "hidden";
    status("Connecting to chat...");
    label("SEND");
    $("manaV95Send").disabled = false;
    $("manaV95Messages").innerHTML =
      '<div class="mana-v950-empty">Loading your conversation...</div>';
    try {
      const db = await connection();
      const user = await authenticated(db);
      if (epoch !== requestedOpen || !$(MODAL)?.classList.contains("open")) return;
      if (role === "client") active.id = user.id;
      if (!active.id) throw new Error("No client selected.");
      status("");
      await refresh();
      if (epoch === requestedOpen) startRefresh();
    } catch(error) {
      if (epoch !== requestedOpen) return;
      status(error?.message || "Could not connect to chat.","error");
      $("manaV95Messages").innerHTML =
        '<div class="mana-v950-empty">Chat is unavailable until you sign in.</div>';
    }
    $("manaV95Input")?.focus({preventScroll:true});
  }

  function close() {
    requestedOpen++;
    $(MODAL)?.classList.remove("open");
    document.body.style.overflow = "";
    stopRefresh();
  }

  function render(messages,myId) {
    const host = $("manaV95Messages");
    if (!host) return;
    if (!messages.length) {
      host.innerHTML =
        '<div class="mana-v950-empty">No messages yet. Start a conversation with your coach.</div>';
      return;
    }
    const html = messages.map(item => {
      const mine = String(item.sender_id) === String(myId);
      const name = mine ? "You" :
        item.sender_role === "coach" ? "Coach" : active.name;
      const stamp = new Date(item.created_at);
      const time = Number.isFinite(stamp.getTime())
        ? stamp.toLocaleString([],{day:"numeric",month:"short",hour:"numeric",minute:"2-digit"})
        : "";
      return `<div class="mana-v950-message${mine?" mine":""}">
        <div class="mana-v950-message-name">${escapeHTML(name)}</div>
        <div class="mana-v950-message-body">${escapeHTML(item.body)}</div>
        <div class="mana-v950-message-time">${escapeHTML(time)}</div>
      </div>`;
    }).join("");
    if (host.innerHTML !== html) {
      host.innerHTML = html;
      host.scrollTop = host.scrollHeight;
    }
  }

  async function refresh() {
    if (loading || !active.id || !$(MODAL)?.classList.contains("open")) return;
    loading = true;
    const id = active.id;
    try {
      const db = await connection();
      const user = await authenticated(db);
      const {data,error} = await db.from("strength_messages")
        .select("id,client_id,sender_id,sender_role,body,created_at")
        .eq("client_id",id)
        .order("created_at",{ascending:true})
        .limit(100);
      if (error) throw error;
      if (active.id === id && $(MODAL)?.classList.contains("open")) {
        render(data || [],user.id);
      }
    } catch(error) {
      if ($(MODAL)?.classList.contains("open")) {
        status("Conversation load error: "+(error?.message||"Try again."),"error");
      }
    } finally {
      loading = false;
    }
  }

  async function send() {
    if (sending || !$(MODAL)?.classList.contains("open")) return;
    const input = $("manaV95Input");
    const text = String(input?.value || "").trim();
    if (!text) {
      status("Write a message before sending.","error");
      return;
    }
    sending = true;
    $("manaV95Send").disabled = true;
    label("SENDING…");
    status("Sending message…");
    let inserted = false;
    try {
      const db = await connection();
      const user = await authenticated(db);
      const id = active.role === "client" ? user.id : active.id;
      if (!id) throw new Error("No conversation is selected.");
      const {error} = await db.from("strength_messages").insert({
        client_id:id,
        sender_id:user.id,
        sender_role:active.role,
        body:text
      });
      if (error) throw error;
      inserted = true;
      if (input) input.value = "";
      label("SENT ✓");
      status("Sent ✓ — message saved successfully.","sent");
      await refresh();
      // The confirmation remains visible until typing the next message.
    } catch(error) {
      console.error("Mana Strength Coach Chat:",error);
      if (!inserted) {
        label("SEND");
        status("Not sent: "+(error?.message||"Please retry."),"error");
      } else {
        label("SENT ✓");
        status("Sent ✓ — message saved; conversation refresh unavailable.","sent");
      }
    } finally {
      sending = false;
      $("manaV95Send").disabled = false;
    }
  }

  function startRefresh() {
    stopRefresh();
    poll = setInterval(() => {
      if ($(MODAL)?.classList.contains("open") && !sending) refresh();
    },15000);
  }
  function stopRefresh() {
    if (poll !== null) clearInterval(poll);
    poll = null;
  }

  function onClick(event) {
    if (!(event.target instanceof Element)) return;
    if (event.target.closest("#manaV95ClientOpen")) {
      open("client");
    } else if (event.target.closest("#manaV95CoachOpen")) {
      const selected = coachSelection();
      if (selected) open("coach",selected.id,selected.name);
    } else if (event.target.closest("#manaV95ChatClose")) {
      close();
    } else if (event.target.closest("#manaV95Send")) {
      send();
    }
  }

  function onInput(event) {
    if (event.target?.id !== "manaV95Input") return;
    if ($("manaV95Send")?.textContent.includes("SENT")) {
      label("SEND");
      status("");
    }
  }

  function onKeyDown(event) {
    if (event.target?.id === "manaV95Input" &&
        event.key === "Enter" && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      send();
    } else if (event.key === "Escape" &&
               $(MODAL)?.classList.contains("open")) {
      close();
    }
  }

  /* Retain the existing Coach Hub chat launcher as well as the
     teal Strength Hub launcher. Do not replace their click handlers. */
  function syncLaunchCards() {
    const detail = $("coachClientDetailView");
    const selected = coachSelection();
    if (detail && !detail.classList.contains("hide") && selected) {
      let card = $("manaV95CoachChatCard");
      if (!card) {
        card = document.createElement("div");
        card.id = "manaV95CoachChatCard";
        card.className = "card";
        const anchor = $("clientSessionSummaryCard");
        if (anchor) anchor.before(card);
        else detail.appendChild(card);
      }
      if (card.dataset.clientId !== selected.id ||
          !card.querySelector("#manaV95CoachOpen")) {
        card.dataset.clientId = selected.id;
        card.innerHTML = `
          <div class="mana-v950-card-kicker">MANA STRENGTH</div>
          <div class="mana-v950-card-title">Coach Chat</div>
          <div class="mana-v950-card-preview">Message ${escapeHTML(selected.name)} directly inside Mana.</div>
          <button type="button" class="mana-v950-open" id="manaV95CoachOpen">OPEN CLIENT CHAT →</button>`;
      }
    }
  }

  function init() {
    applyStyles();
    ensureModal();
    document.addEventListener("click",onClick);
    document.addEventListener("input",onInput);
    document.addEventListener("keydown",onKeyDown);
    window.openManaStrengthClientChat = () => open("client");
    window.openManaStrengthCoachChat = (id,name) =>
      open("coach",id,name);
    window.refreshManaStrengthChat = () => {
      syncLaunchCards();
      return refresh();
    };
    syncLaunchCards();
    ["mana:program-tab-change", "mana:profile-synced",
      "mana:strength-synced"].forEach(name =>
      window.addEventListener(name,syncLaunchCards));
    document.addEventListener("click",event => {
      if (event.target.closest(".client-open,[data-client-id]")) {
        requestAnimationFrame(syncLaunchCards);
      }
    },true);
    window.MANA_STRENGTH_CHAT_BUILD = "104090";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded",init,{once:true});
  } else {
    init();
  }
})();
