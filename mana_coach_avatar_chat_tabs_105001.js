
/* ============================================================
   MANA MOVEMENT TRAINING
   COACH HUB — PHOTO / CHAT / TABS REPAIR
   BUILD 105002

   COMPLETE REPLACEMENT:
   mana_coach_avatar_chat_tabs_105001.js

   FIXES
   - Profile photo survives Coach header re-renders
   - Secure private photo loading
   - No previous-client photo carryover
   - Consistent premium Coach Chat
   - Removes residual yellow/gold styling
   - Exactly one active orange Coach tab
   - Clients active while viewing a client
   - Premium historical coaching cards

   PROTECTS
   - Existing Chat functionality
   - Program Builder and assignments
   - Block Upgrade Requests
   - Supabase permissions and client sharing
   - Check-ins, notes and training history
   - Client Profile and camera
   - Mobile and desktop layouts

   No database changes.
   No message or workout data changes.
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "105002";
  const FLAG = "MANA_COACH_FINISH_105002";
  const STYLE = "manaCoachFinishStyle105002";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const VIEW = "coachClientDetailView";
  const PANEL = "manaCoachProfile104950";
  const HERO = "manaV998ClientHero";
  const NAV = "manaV97CoachNav";
  const BUCKET = "mana-client-private";

  const $ = id => document.getElementById(id);

  let selectedId = "";
  let currentId = "";
  let avatarURL = "";
  let avatarExpiry = 0;
  let loadingId = "";
  let loadTicket = 0;

  let heroObserver = null;
  let observedHero = null;

  let profileObserver = null;
  let observedProfile = null;

  let detailObserver = null;
  let observedDetail = null;

  let refreshQueued = false;

  /* =====================================================
     VISIBILITY
     ===================================================== */

  function detailOpen() {
    const view = $(VIEW);

    return Boolean(
      view &&
      !view.hidden &&
      !view.classList.contains("hide")
    );
  }

  function profileClientId() {
    return String(
      $(PANEL)?.dataset.clientId || ""
    ).trim();
  }

  /* =====================================================
     PREMIUM STYLE SYSTEM
     ===================================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      /* =====================================
         CLIENT HEADER
         ===================================== */

      #${VIEW} #${HERO} {
        background: #14161A !important;
        background-image: none !important;
        border: 1px solid #535C68 !important;
        border-radius: 19px !important;
        box-shadow: none !important;
      }

      #${VIEW} #${HERO}
      .mana-v998-kicker {
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      #${VIEW} #${HERO}
      .mana-v998-name {
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;
      }

      #${VIEW} #${HERO}
      .mana-v998-sub {
        color: #C1C6CE !important;
        -webkit-text-fill-color: #C1C6CE !important;
      }

      #${VIEW} #${HERO}
      .mana-v998-hero-purpose {
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      /* CLIENT PROFILE PHOTO */

      #${VIEW} #${HERO}
      .mana-v998-avatar,
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

        background: #101215 !important;
        border: 2px solid #FF7927 !important;
        border-radius: 15px !important;

        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;

        font-size: 18px !important;
        font-weight: 900 !important;

        box-sizing: border-box !important;
      }

      #${VIEW} .mana-coach-avatar-105002 {
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
         COACH CHAT — PREMIUM FINISH
         ===================================== */

      #${VIEW} .mana-coach-chat-105002 {
        display: flex !important;
        flex-direction: column !important;
        align-items: stretch !important;

        width: 100% !important;
        max-width: 100% !important;

        gap: 9px !important;

        padding: 18px 20px !important;
        margin: 13px 0 !important;

        background: #15171B !important;
        background-image: none !important;

        border: 1px solid #505862 !important;
        border-radius: 17px !important;

        box-shadow: none !important;
        box-sizing: border-box !important;
      }

      #${VIEW} .mana-coach-chat-105002 h2,
      #${VIEW} .mana-coach-chat-105002 h3,
      #${VIEW} .mana-coach-chat-105002 h4 {
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;

        font-family: inherit !important;
        font-size: 17px !important;
        font-weight: 900 !important;

        line-height: 1.3 !important;
        margin: 0 !important;
      }

      #${VIEW} .mana-coach-chat-105002 p,
      #${VIEW} .mana-coach-chat-105002 small,
      #${VIEW} .mana-coach-chat-105002
      .muted {
        color: #B9C2CD !important;
        -webkit-text-fill-color: #B9C2CD !important;

        font-size: 12px !important;
        line-height: 1.55 !important;

        margin: 0 !important;
      }

      #${VIEW}
      .mana-coach-chat-105002 button {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;

        width: fit-content !important;
        max-width: 100% !important;

        min-height: 44px !important;

        padding: 11px 19px !important;

        background: #25180F !important;
        background-image: none !important;

        border: 1px solid #FF7927 !important;
        border-radius: 11px !important;

        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;

        font-family: inherit !important;
        font-size: 12px !important;
        font-weight: 900 !important;

        box-shadow: none !important;
        cursor: pointer !important;
      }

      #${VIEW}
      .mana-coach-chat-105002 button:hover {
        background: #372114 !important;
      }

      /* =====================================
         ASSIGNED PROGRAMS
         ===================================== */

      #${VIEW} #manaCoachAssignments104720 {
        background: #15171B !important;
        border: 1px solid #505862 !important;
        border-radius: 17px !important;
        box-shadow: none !important;
      }

      #${VIEW}
      #manaCoachAssignments104720 h3 {
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;
      }

      #${VIEW}
      #manaCoachAssignments104720
      .mca-kicker {
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      /* =====================================
         PROGRAM UPGRADE REQUEST
         ===================================== */

      #${VIEW} #manaV1017CoachRequest {
        background: #15171B !important;
        border: 1px solid #FF7927 !important;
        border-radius: 17px !important;
        box-shadow: none !important;
      }

      #${VIEW} #manaV1017CoachRequest
      h2,
      #${VIEW} #manaV1017CoachRequest
      h3,
      #${VIEW} #manaV1017CoachRequest
      h4 {
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;
      }

      #${VIEW} #manaV1017CoachRequest
      .m1017-kicker,
      #${VIEW} #manaV1017CoachRequest
      .m1017-pill,
      #${VIEW} #manaV1017CoachRequest
      .m1017-ready {
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;

        border-color: #FF7927 !important;
      }

      #${VIEW} #manaV1017CoachRequest
      .m1017-stat strong {
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      #${VIEW} #manaV1017CoachRequest
      button {
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;

        border-color: #FF7927 !important;
        border-radius: 10px !important;
      }

      /* =====================================
         HISTORICAL COACHING INFORMATION
         ===================================== */

      #${VIEW} #detailCoachSummary
      .coach-summary-stat {
        background: #101215 !important;
        border: 1px solid #454D57 !important;
        border-radius: 13px !important;
        box-shadow: none !important;
      }

      #${VIEW} #detailCoachSummary
      .coach-summary-stat strong {
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;
      }

      #${VIEW} #detailCoachSummary
      .coach-summary-value,
      #${VIEW} #detailCoachSummary
      .coach-summary-number {
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      #${VIEW} #detailCoachSummary
      .coach-summary-note {
        background: #101215 !important;
        border-color: #454D57 !important;
      }

      /* =====================================
         COACH HUB BOTTOM NAV
         ===================================== */

      #${NAV} .mana-v970-tab {
        background: #15171A !important;
        border: 1px solid #414750 !important;
        border-radius: 13px !important;

        color: #C1C6CE !important;
        -webkit-text-fill-color: #C1C6CE !important;

        box-shadow: none !important;
      }

      #${NAV} .mana-v970-tab
      .mana-v970-tab-icon,
      #${NAV} .mana-v970-tab
      .mcn-tab-label {
        color: inherit !important;
        -webkit-text-fill-color:
          currentColor !important;
      }

      #${NAV} .mana-v970-tab.active {
        background: #321D12 !important;
        border-color: #FF7927 !important;

        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      /*
       When an actual client detail is open,
       Clients is the active destination,
       regardless of the previously selected
       Coach Hub page.
      */

      body:has(
        #${VIEW}:not(.hide):not([hidden])
      ) #${NAV}
      .mana-v970-tab {
        background: #15171A !important;
        border-color: #414750 !important;

        color: #C1C6CE !important;
        -webkit-text-fill-color: #C1C6CE !important;
      }

      body:has(
        #${VIEW}:not(.hide):not([hidden])
      ) #${NAV}
      .mana-v970-tab[data-mcn-tab="clients"] {
        background: #321D12 !important;
        border-color: #FF7927 !important;

        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      /* =====================================
         MOBILE
         ===================================== */

      @media(max-width:600px) {

        #${VIEW} #${HERO}
        .mana-v998-avatar,
        #${VIEW} #detailClientAvatar {
          width: 54px !important;
          height: 54px !important;
          min-width: 54px !important;
          min-height: 54px !important;
          max-width: 54px !important;
          max-height: 54px !important;

          flex-basis: 54px !important;
        }

        #${VIEW} .mana-coach-chat-105002 {
          padding: 14px !important;
          border-radius: 14px !important;
        }

        #${VIEW}
        .mana-coach-chat-105002 button {
          width: 100% !important;
        }

        #${NAV} .mana-v970-tab {
          min-width: 0 !important;
        }

      }
    `;

    document.head.appendChild(style);
  }

  /* =====================================================
     CLIENT PHOTO ELEMENTS
     ===================================================== */

  function holders() {
    const view = $(VIEW);

    if (!view) return [];

    return [
      view.querySelector(
        `#${HERO} .mana-v998-avatar`
      ),
      view.querySelector(
        "#detailClientAvatar"
      )
    ].filter(Boolean);
  }

  function clearPhotos() {
    $(VIEW)?.querySelectorAll(
      ".mana-coach-avatar-105002"
    ).forEach(img => img.remove());
  }

  function placePhoto() {
    if (!detailOpen()) return;
    if (!avatarURL) return;

    if (
      !currentId ||
      profileClientId() !== currentId
    ) {
      return;
    }

    if (Date.now() >= avatarExpiry) {
      avatarURL = "";
      void loadAvatar(currentId);
      return;
    }

    holders().forEach(holder => {
      let image = holder.querySelector(
        ".mana-coach-avatar-105002"
      );

      if (image) {
        if (image.dataset.clientId === currentId) {
          return;
        }

        image.remove();
      }

      image = document.createElement("img");

      image.className =
        "mana-coach-avatar-105002";

      image.alt = "Client profile photograph";
      image.dataset.clientId = currentId;
      image.src = avatarURL;

      image.onerror = () => {
        image.remove();
        avatarURL = "";
      };

      holder.appendChild(image);
    });
  }

  /* =====================================================
     PRIVATE SUPABASE PHOTO

     Only reads the photograph belonging to
     the currently selected client.

     Requires client profile sharing.
     Existing RLS policies are respected.
     ===================================================== */

  async function loadAvatar(clientId) {
    if (!clientId) return;

    if (
      loadingId === clientId ||
      (
        currentId === clientId &&
        avatarURL &&
        Date.now() < avatarExpiry
      )
    ) {
      placePhoto();
      return;
    }

    const ticket = ++loadTicket;

    loadingId = clientId;

    try {
      if (
        typeof window.supabaseClient !==
        "function"
      ) return;

      const db = await window.supabaseClient();

      const shared = await db
        .from("client_extended_profiles")
        .select("share_with_coach")
        .eq("user_id", clientId)
        .maybeSingle();

      if (ticket !== loadTicket) return;

      if (
        shared.error ||
        shared.data?.share_with_coach !== true
      ) return;

      const result = await db
        .from("client_progress_photos")
        .select("storage_path")
        .eq("user_id", clientId)
        .eq("phase", "avatar")
        .eq("angle", "avatar")
        .order("created_at", {
          ascending: false
        })
        .limit(1);

      if (ticket !== loadTicket) return;

      if (result.error) return;

      const path =
        result.data?.[0]?.storage_path;

      if (!path) return;

      const signed = await db.storage
        .from(BUCKET)
        .createSignedUrl(path, 600);

      if (ticket !== loadTicket) return;

      if (
        signed.error ||
        !signed.data?.signedUrl
      ) return;

      if (
        !detailOpen() ||
        profileClientId() !== clientId
      ) return;

      currentId = clientId;
      avatarURL = signed.data.signedUrl;

      /*
       Refresh the signed URL before it
       reaches its ten-minute expiry.
      */

      avatarExpiry =
        Date.now() + 9 * 60 * 1000;

      placePhoto();

    } catch (error) {
      console.warn(
        "[Mana Coach Avatar]",
        error
      );

    } finally {
      if (loadingId === clientId) {
        loadingId = "";
      }
    }
  }

  /* =====================================================
     CLIENT SELECTION
     ===================================================== */

  function syncClient() {
    if (!detailOpen()) return;

    const clientId = profileClientId();

    if (!clientId) return;

    /*
     While the new client is loading,
     the previous profile can still be
     present briefly. Never reuse it.
    */

    if (
      selectedId &&
      selectedId !== clientId
    ) return;

    if (currentId !== clientId) {
      currentId = clientId;
      avatarURL = "";
      avatarExpiry = 0;

      clearPhotos();

      void loadAvatar(clientId);
      return;
    }

    if (avatarURL) {
      placePhoto();
    } else if (
      !loadingId &&
      !avatarExpiry
    ) {
      void loadAvatar(clientId);
    }
  }

  /* =====================================================
     COACH CHAT

     Style existing Chat card only.
     No click handlers are replaced.
     ===================================================== */

  function tidyChat() {
    if (!detailOpen()) return;

    const view = $(VIEW);
    if (!view) return;

    const button = Array.from(
      view.querySelectorAll("button")
    ).find(element =>
      /open client chat/i.test(
        element.textContent || ""
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
    ) return;

    card.classList.add(
      "mana-coach-chat-105002"
    );
  }

  /* =====================================================
     RE-RENDER PROTECTION

     The original Mana v9.98 Coach Hub
     replaces the header's HTML when
     updating a client.

     Observe the existing header's direct
     children so the profile photo is
     restored after these replacements.

     Adding an image inside the avatar
     does not trigger this observer.
     ===================================================== */

  function watchHero() {
    const hero = $(HERO);

    if (
      !hero ||
      observedHero === hero
    ) return;

    heroObserver?.disconnect();

    observedHero = hero;

    heroObserver = new MutationObserver(() => {
      queueRefresh();
    });

    heroObserver.observe(hero, {
      childList: true,
      subtree: false
    });
  }

  function watchProfile() {
    const panel = $(PANEL);

    if (
      !panel ||
      observedProfile === panel
    ) return;

    profileObserver?.disconnect();

    observedProfile = panel;

    profileObserver =
      new MutationObserver(queueRefresh);

    profileObserver.observe(panel, {
      attributes: true,
      attributeFilter: ["data-client-id"],
      childList: true,
      subtree: false
    });
  }

  function watchDetail() {
    const view = $(VIEW);

    if (
      !view ||
      observedDetail === view
    ) return;

    detailObserver?.disconnect();

    observedDetail = view;

    detailObserver =
      new MutationObserver(() => {
        watchHero();
        watchProfile();
        queueRefresh();
      });

    detailObserver.observe(view, {
      childList: true,
      subtree: false
    });

    detailObserver.observe(view, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  function refresh() {
    if (!detailOpen()) return;

    watchHero();
    watchProfile();

    tidyChat();
    syncClient();
  }

  function queueRefresh() {
    if (refreshQueued) return;

    refreshQueued = true;

    requestAnimationFrame(() => {
      refreshQueued = false;
      refresh();
    });
  }

  /* =====================================================
     SELECT ANOTHER CLIENT

     Clear stale photographs immediately.
     ===================================================== */

  function onClientClick(event) {
    const button = event.target.closest?.(
      ".client-open[data-client-id]"
    );

    if (!button) return;

    selectedId =
      String(button.dataset.clientId || "");

    currentId = "";
    avatarURL = "";
    avatarExpiry = 0;
    loadingId = "";

    loadTicket++;

    clearPhotos();

    [250, 650, 1200].forEach(delay => {
      setTimeout(queueRefresh, delay);
    });
  }

  /* =====================================================
     INITIALISE
     ===================================================== */

  function init() {
    installStyles();

    watchDetail();
    watchHero();
    watchProfile();

    document.addEventListener(
      "click",
      onClientClick,
      true
    );

    window.addEventListener(
      "pageshow",
      () => {
        watchDetail();
        watchHero();
        watchProfile();
        queueRefresh();
      }
    );

    document.addEventListener(
      "visibilitychange",
      () => {
        if (!document.hidden) {
          queueRefresh();
        }
      }
    );

    queueRefresh();

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
