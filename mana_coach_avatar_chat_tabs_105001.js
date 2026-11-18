
/* ==========================================================
   MANA MOVEMENT TRAINING
   COACH HUB — PHOTO, CHAT & ACTIVE TABS
   BUILD 105001

   COMPLETE JAVASCRIPT FILE

   FIXES:
   - Client profile photo in Coach Hub header
   - Uses existing private Supabase photo storage
   - Respects client profile sharing permission
   - Keeps initials if no photo is available
   - Removes stale photo when switching clients
   - Premium Coach Chat card and button
   - Active Coach Hub bottom tab highlights orange
   - Makes historical coaching cards clearer
   - Works on laptop and mobile

   PRESERVES:
   - View Client navigation
   - Existing Chat functionality and messages
   - Program assignments
   - Block Upgrade Requests
   - Notes, check-ins and workout history
   - Coach Summary calculations
   - Client Profile and photo uploads
   - All existing database policies

   No database writes.
   No replacement of existing buttons.
   No deletion of historical records.
   ========================================================== */

(() => {
  "use strict";

  const BUILD = "105001";
  const FLAG = "MANA_COACH_FINISH_105001";
  const STYLE = "manaCoachFinishStyle105001";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const VIEW = "coachClientDetailView";
  const PANEL = "manaCoachProfile104950";
  const HERO = "manaV998ClientHero";
  const NAV = "manaV97CoachNav";
  const BUCKET = "mana-client-private";

  const $ = id => document.getElementById(id);

  let desiredClientId = "";
  let loadedClientId = "";
  let loadedAvatar = null;
  let activeAvatarNode = null;
  let requestNumber = 0;
  let refreshScheduled = false;
  let detailObserver = null;
  let profileObserver = null;
  let observedPanel = null;

  /* ======================================================
     HELPERS
     ====================================================== */

  function detailVisible() {
    const view = $(VIEW);

    return Boolean(
      view &&
      !view.hidden &&
      !view.classList.contains("hide")
    );
  }

  function coachVisible() {
    const coach = $("coachView");

    return Boolean(
      coach &&
      !coach.hidden &&
      !coach.classList.contains("hide")
    );
  }

  function cleanText(value) {
    return String(value ?? "").trim();
  }

  function avatarNodes() {
    const view = $(VIEW);
    if (!view) return [];

    const nodes = [
      view.querySelector(
        `#${HERO} .mana-v998-avatar`
      ),
      view.querySelector(
        "#detailClientAvatar"
      )
    ];

    return [...new Set(nodes.filter(Boolean))];
  }

  /* ======================================================
     PREMIUM CSS
     ====================================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      /* =====================================
         COACH HEADER PROFILE PHOTO
         ===================================== */

      #${VIEW} #${HERO} .mana-v998-avatar,
      #${VIEW} #detailClientAvatar {
        position: relative !important;
        width: 64px !important;
        height: 64px !important;
        min-width: 64px !important;
        min-height: 64px !important;
        max-width: 64px !important;
        max-height: 64px !important;

        flex: 0 0 64px !important;

        display: flex !important;
        align-items: center !important;
        justify-content: center !important;

        overflow: hidden !important;

        border: 2px solid #FF7927 !important;
        border-radius: 15px !important;

        background: #101215 !important;
        color: #FF7927 !important;

        font-size: 18px !important;
        font-weight: 900 !important;

        box-sizing: border-box !important;
      }

      #${VIEW} .mana-coach-avatar-105001 {
        display: block !important;

        position: absolute !important;
        inset: 0 !important;

        width: 100% !important;
        height: 100% !important;
        max-width: 100% !important;
        max-height: 100% !important;

        object-fit: cover !important;
        object-position: center !important;

        margin: 0 !important;
        padding: 0 !important;
        border: 0 !important;
        border-radius: 13px !important;

        background: #101215 !important;
      }

      /* =====================================
         COACH CHAT CARD
         ===================================== */

      #${VIEW} .mana-coach-chat-105001 {
        display: flex !important;
        flex-direction: column !important;
        align-items: stretch !important;

        width: 100% !important;
        min-width: 0 !important;

        gap: 9px !important;
        padding: 16px 18px !important;

        margin: 12px 0 !important;

        background: #15171B !important;
        background-image: none !important;

        border: 1px solid #4C5560 !important;
        border-radius: 17px !important;

        color: #FFFFFF !important;
        box-shadow: none !important;

        box-sizing: border-box !important;
      }

      #${VIEW} .mana-coach-chat-105001 h2,
      #${VIEW} .mana-coach-chat-105001 h3,
      #${VIEW} .mana-coach-chat-105001 h4 {
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;

        font-family: inherit !important;
        font-size: 17px !important;
        font-weight: 900 !important;
        line-height: 1.3 !important;

        margin: 0 !important;
      }

      #${VIEW} .mana-coach-chat-105001 p,
      #${VIEW} .mana-coach-chat-105001 small {
        color: #B7C0CB !important;
        -webkit-text-fill-color: #B7C0CB !important;

        font-size: 12px !important;
        line-height: 1.5 !important;

        margin: 0 !important;
      }

      #${VIEW} .mana-coach-chat-105001 button {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;

        width: fit-content !important;
        max-width: 100% !important;
        min-height: 43px !important;

        padding: 11px 17px !important;

        background: #24170F !important;
        background-image: none !important;

        border: 1px solid #FF7927 !important;
        border-radius: 11px !important;

        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;

        font-size: 12px !important;
        font-weight: 900 !important;

        box-shadow: none !important;
        cursor: pointer !important;
      }

      #${VIEW}
      .mana-coach-chat-105001 button:hover {
        background: #352114 !important;
      }

      /* =====================================
         BOTTOM NAVIGATION

         Existing navigation controls retain
         their click handlers and routing.
         ===================================== */

      #${NAV} .mana-v970-tab {
        background: #15171A !important;
        background-image: none !important;

        border: 1px solid #414750 !important;
        border-radius: 13px !important;

        color: #C1C6CE !important;
        -webkit-text-fill-color: #C1C6CE !important;

        box-shadow: none !important;

        transition:
          background-color .15s ease,
          border-color .15s ease,
          color .15s ease !important;
      }

      #${NAV} .mana-v970-tab
      .mana-v970-tab-icon,
      #${NAV} .mana-v970-tab
      .mcn-tab-label {
        color: #C1C6CE !important;
        -webkit-text-fill-color: #C1C6CE !important;
      }

      #${NAV} .mana-v970-tab.active,
      #${NAV} .mana-v970-tab[aria-current="page"],
      #${NAV} .mana-v970-tab[aria-selected="true"] {
        background: #321D12 !important;
        background-image: none !important;

        border: 1px solid #FF7927 !important;

        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;

        box-shadow: none !important;
      }

      #${NAV} .mana-v970-tab.active
      .mana-v970-tab-icon,
      #${NAV} .mana-v970-tab.active
      .mcn-tab-label,
      #${NAV} .mana-v970-tab[aria-current="page"]
      .mana-v970-tab-icon,
      #${NAV} .mana-v970-tab[aria-current="page"]
      .mcn-tab-label,
      #${NAV} .mana-v970-tab[aria-selected="true"]
      .mana-v970-tab-icon,
      #${NAV} .mana-v970-tab[aria-selected="true"]
      .mcn-tab-label {
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      #${NAV} .mana-v970-tab:focus-visible {
        outline: 2px solid #FF7927 !important;
        outline-offset: 2px !important;
      }

      /* =====================================
         HISTORICAL COACHING INFORMATION
         ===================================== */

      #${VIEW} #detailLatestCheckin,
      #${VIEW} #detailCheckinHistory,
      #${VIEW} #detailCoachSummary {
        color: #FFFFFF !important;
        max-width: 100% !important;
      }

      #${VIEW}
      #detailCoachSummary .coach-summary-grid {
        display: grid !important;
        grid-template-columns:
          repeat(2,minmax(0,1fr)) !important;
        gap: 11px !important;
        margin-top: 14px !important;
      }

      #${VIEW}
      #detailCoachSummary .coach-summary-stat {
        min-width: 0 !important;
        min-height: 115px !important;

        padding: 15px !important;

        background: #101215 !important;
        border: 1px solid #424A55 !important;
        border-radius: 14px !important;
      }

      #${VIEW}
      #detailCoachSummary .coach-summary-label {
        color: #AEB8C4 !important;
      }

      #${VIEW}
      #detailCoachSummary .coach-summary-stat strong {
        color: #FFFFFF !important;
      }

      #${VIEW}
      #detailCoachSummary .coach-summary-number,
      #${VIEW}
      #detailCoachSummary .coach-summary-value {
        color: #FF7927 !important;
      }

      #${VIEW}
      #detailCoachSummary .coach-summary-note {
        background: #101215 !important;
        border: 1px solid #424A55 !important;
        border-radius: 13px !important;
      }

      #${VIEW}
      #detailCoachSummary .coach-summary-note strong {
        color: #FF7927 !important;
      }

      /* =====================================
         MOBILE
         ===================================== */

      @media (max-width:600px) {

        #${VIEW} #${HERO} .mana-v998-avatar,
        #${VIEW} #detailClientAvatar {
          width: 54px !important;
          height: 54px !important;
          min-width: 54px !important;
          min-height: 54px !important;
          max-width: 54px !important;
          max-height: 54px !important;
          flex-basis: 54px !important;
        }

        #${VIEW} .mana-coach-chat-105001 {
          padding: 13px !important;
          border-radius: 14px !important;
        }

        #${VIEW}
        .mana-coach-chat-105001 button {
          width: 100% !important;
        }

        #${NAV} .mana-v970-tab {
          min-width: 0 !important;
        }

        #${NAV} .mcn-tab-label {
          font-size: 10px !important;
        }

        #${VIEW}
        #detailCoachSummary .coach-summary-grid {
          gap: 7px !important;
        }

        #${VIEW}
        #detailCoachSummary .coach-summary-stat {
          min-height: 100px !important;
          padding: 11px !important;
        }

      }

    `;

    document.head.appendChild(style);
  }

  /* ======================================================
     CLEAR PREVIOUS PHOTO

     Protects against showing the previous
     client's picture while changing clients.
     ====================================================== */

  function clearPhoto() {
    const view = $(VIEW);
    if (!view) return;

    view.querySelectorAll(
      ".mana-coach-avatar-105001"
    ).forEach(image => image.remove());

    activeAvatarNode = null;
  }

  function showPhoto(url, clientId) {
    if (!detailVisible()) return;

    const panel = $(PANEL);

    if (
      cleanText(panel?.dataset.clientId) !==
      clientId
    ) {
      return;
    }

    const nodes = avatarNodes();

    nodes.forEach(holder => {
      let image = holder.querySelector(
        ".mana-coach-avatar-105001"
      );

      if (!image) {
        image = document.createElement("img");

        image.className =
          "mana-coach-avatar-105001";

        image.alt = "Client profile photograph";

        holder.appendChild(image);
      }

      if (image.src !== url) {
        image.src = url;
      }

      image.onerror = () => {
        image.remove();
      };
    });

    activeAvatarNode = nodes[0] || null;
  }

  /* ======================================================
     PRIVATE PHOTO LOADING

     Uses the selected client ID from the
     existing Coach Profile renderer.

     The client must have enabled profile
     sharing for the photo to appear.

     Supabase RLS and storage access rules
     remain authoritative.
     ====================================================== */

  async function loadAvatar(clientId) {
    if (!clientId) return;

    const ticket = ++requestNumber;

    loadedClientId = clientId;
    loadedAvatar = null;

    clearPhoto();

    try {
      if (
        typeof window.supabaseClient !==
        "function"
      ) {
        return;
      }

      const db = await window.supabaseClient();

      const profile = await db
        .from("client_extended_profiles")
        .select("share_with_coach")
        .eq("user_id", clientId)
        .maybeSingle();

      if (
        ticket !== requestNumber ||
        profile.error ||
        profile.data?.share_with_coach !== true
      ) {
        return;
      }

      const photos = await db
        .from("client_progress_photos")
        .select("storage_path,created_at")
        .eq("user_id", clientId)
        .eq("phase", "avatar")
        .eq("angle", "avatar")
        .order("created_at", {
          ascending: false
        })
        .limit(1);

      if (
        ticket !== requestNumber ||
        photos.error
      ) {
        return;
      }

      const path =
        photos.data?.[0]?.storage_path;

      if (!path) return;

      const signed = await db.storage
        .from(BUCKET)
        .createSignedUrl(path, 600);

      if (
        ticket !== requestNumber ||
        signed.error ||
        !signed.data?.signedUrl
      ) {
        return;
      }

      const panel = $(PANEL);

      if (
        !detailVisible() ||
        cleanText(panel?.dataset.clientId) !==
          clientId
      ) {
        return;
      }

      loadedAvatar = signed.data.signedUrl;

      showPhoto(loadedAvatar, clientId);

    } catch (error) {
      console.warn(
        "[Mana Coach Photo]",
        error
      );
    }
  }

  /* ======================================================
     FIND EXISTING COACH CHAT CARD

     Style existing elements only.
     No new buttons or chat handlers.
     ====================================================== */

  function tidyChat() {
    if (!detailVisible()) return;

    const view = $(VIEW);
    if (!view) return;

    const button = Array.from(
      view.querySelectorAll("button")
    ).find(node =>
      /open client chat/i.test(
        node.textContent || ""
      )
    );

    if (!button) return;

    const card = button.closest(
      ".mana-premium-coach-chat, .card, section, article"
    );

    if (
      !card ||
      card === view ||
      card.id === PANEL ||
      card.id === "manaCoachAssignments104720" ||
      card.id === "manaV1017CoachRequest"
    ) {
      return;
    }

    card.classList.add(
      "mana-coach-chat-105001"
    );
  }

  /* ======================================================
     HISTORICAL SECTION PRESENTATION

     These remain actual client records.
     Nothing is deleted or recalculated.
     ====================================================== */

  function labelHistory() {
    if (!detailVisible()) return;

    const view = $(VIEW);
    if (!view) return;

    const summary = $("detailCoachSummary");

    const card = summary?.closest(
      ".card, section, article"
    );

    if (card) {
      const heading =
        card.querySelector(".row h3, h3");

      if (
        heading &&
        heading.textContent.trim() ===
          "Coach summary"
      ) {
        heading.textContent =
          "Performance History";
      }

      if (
        !card.querySelector(
          ".mana-history-note-105001"
        )
      ) {
        const note =
          document.createElement("p");

        note.className =
          "mana-history-note-105001";

        note.textContent =
          "Based on recorded training history. " +
          "Use alongside the latest client " +
          "profile and current coaching goals.";

        note.style.cssText = [
          "color:#B7C0CB",
          "font-size:11px",
          "line-height:1.5",
          "margin:10px 0 4px"
        ].join(";");

        const heading =
          card.querySelector(".row");

        if (heading) {
          heading.insertAdjacentElement(
            "afterend",
            note
          );
        }
      }
    }
  }

  /* ======================================================
     REFRESH FROM EXISTING PROFILE RENDERER

     Profile panel data-client-id is set by
     the active Coach Profile renderer.
     ====================================================== */

  function syncClient() {
    if (!detailVisible()) return;

    const panel = $(PANEL);

    const id = cleanText(
      panel?.dataset.clientId
    );

    if (!id) return;

    if (
      desiredClientId &&
      desiredClientId !== id
    ) {
      return;
    }

    if (loadedClientId !== id) {
      void loadAvatar(id);
      return;
    }

    if (loadedAvatar) {
      const nodes = avatarNodes();

      if (
        nodes.length &&
        !nodes.every(node =>
          node.querySelector(
            ".mana-coach-avatar-105001"
          )
        )
      ) {
        showPhoto(loadedAvatar, id);
      }
    }
  }

  function refresh() {
    if (!detailVisible()) return;

    tidyChat();
    labelHistory();
    syncClient();
  }

  function scheduleRefresh() {
    if (refreshScheduled) return;

    refreshScheduled = true;

    requestAnimationFrame(() => {
      refreshScheduled = false;
      refresh();
    });
  }

  /* ======================================================
     OBSERVE ACTIVE CLIENT CHANGES

     Observe only the Coach Client detail
     panel and Coach Profile panel.

     No page-wide subtree observer.
     ====================================================== */

  function watchProfilePanel() {
    const panel = $(PANEL);

    if (!panel || observedPanel === panel) {
      return;
    }

    profileObserver?.disconnect();

    observedPanel = panel;

    profileObserver =
      new MutationObserver(scheduleRefresh);

    profileObserver.observe(panel, {
      attributes: true,
      attributeFilter: ["data-client-id"],
      childList: true,
      subtree: false
    });
  }

  function watchDetail() {
    const view = $(VIEW);

    if (!view || detailObserver) return;

    detailObserver =
      new MutationObserver(() => {
        watchProfilePanel();
        scheduleRefresh();
      });

    detailObserver.observe(view, {
      attributes: true,
      attributeFilter: ["class"]
    });

    /*
     Direct-child observation catches
     newly mounted profile panels without
     watching every nested input.
    */

    detailObserver.observe(view, {
      childList: true,
      subtree: false
    });
  }

  /* ======================================================
     CLIENT SELECTION

     Immediately clear the previous photo
     when another client is opened.
     ====================================================== */

  function onClick(event) {
    const button = event.target.closest?.(
      ".client-open[data-client-id]"
    );

    if (!button) return;

    desiredClientId =
      cleanText(button.dataset.clientId);

    loadedClientId = "";
    loadedAvatar = null;

    requestNumber++;

    clearPhoto();

    [250, 650, 1100].forEach(delay => {
      setTimeout(() => {
        watchProfilePanel();
        refresh();
      }, delay);
    });
  }

  /* ======================================================
     INITIALISE
     ====================================================== */

  function init() {
    installStyles();

    watchDetail();
    watchProfilePanel();

    document.addEventListener(
      "click",
      onClick,
      true
    );

    window.addEventListener(
      "pageshow",
      () => {
        watchDetail();
        watchProfilePanel();
        scheduleRefresh();
      }
    );

    document.addEventListener(
      "visibilitychange",
      () => {
        if (!document.hidden) {
          scheduleRefresh();
        }
      }
    );

    refresh();

    window.MANA_COACH_FINISH_BUILD =
      BUILD;

    console.log(
      "[Mana Movement] Coach Finish " +
      BUILD +
      " active"
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }

})();
