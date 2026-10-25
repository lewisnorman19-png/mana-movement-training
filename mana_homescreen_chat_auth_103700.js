
/* =====================================================
   MANA MOVEMENT TRAINING
   HOME SCREEN CHAT AUTHENTICATION
   BUILD 103700

   COMPLETE JAVASCRIPT FILE

   PURPOSE:
   - Support iPhone Home Screen installation
   - Restore the authenticated Supabase user
   - Verify login before sending messages
   - Preserve typed messages on auth errors
   - Work with Strength and Lyfe chat

   PRESERVES:
   - Build 103610 Coach Chat
   - Mobile chat keyboard fixes
   - Existing Supabase message table
   - Coach and Support Chat design
   - All workout and program functionality

   No password or token copying.
   No new localStorage credentials.
   No background polling.
   ===================================================== */

(() => {
  "use strict";

  const BUILD = "103700";

  if (window.MANA_CHAT_AUTH_103700) return;
  window.MANA_CHAT_AUTH_103700 = true;

  const SEND_ID = "manaV95Send";
  const INPUT_ID = "manaV95Input";
  const STATUS_ID = "manaV95Status";
  const MODAL_ID = "manaV95ChatModal";

  const $ = id => document.getElementById(id);

  let replaying = false;
  let checking = false;
  let authPromise = null;

  function setStatus(message) {
    const element = $(STATUS_ID);

    if (element) {
      element.textContent = message;
    }
  }

  function chatOpen() {
    return Boolean(
      $(MODAL_ID)?.classList.contains("open")
    );
  }

  function isHomeScreen() {
    return Boolean(
      window.navigator.standalone === true ||
      window.matchMedia(
        "(display-mode: standalone)"
      ).matches
    );
  }

  /* =========================================
     RESTORE SUPABASE USER

     The existing app owns authentication.
     This does not create another client.
     ========================================= */

  async function restoreUser() {
    if (typeof supabaseClient !== "function") {
      throw new Error(
        "The app connection is not ready."
      );
    }

    const client = await supabaseClient();

    if (!client?.auth) {
      throw new Error(
        "Authentication is unavailable."
      );
    }

    /*
     getSession loads the session stored
     in this particular app environment.

     Safari and Home Screen storage may
     not contain the same session.
    */

    const sessionResult =
      await client.auth.getSession();

    if (sessionResult.error) {
      throw sessionResult.error;
    }

    /*
     getUser validates the session with
     Supabase rather than relying only
     on a previously cached user object.
    */

    const result = await client.auth.getUser();

    if (result.error) {
      throw result.error;
    }

    const user = result.data?.user;

    if (!user?.id) {
      throw new Error(
        "Please sign in inside the Home Screen app."
      );
    }

    /*
     The app declares currentUser as a
     global lexical variable in index.html.
     Restore it for the existing chat
     sendMessage() function.
    */

    try {
      currentUser = user;
    } catch (_) {
      throw new Error(
        "The app login state could not be restored."
      );
    }

    return user;
  }

  async function checkAuthentication() {
    if (authPromise) return authPromise;

    authPromise = restoreUser();

    try {
      return await authPromise;
    } finally {
      authPromise = null;
    }
  }

  /* =========================================
     SEND INTERCEPT

     Verify authentication first.

     Then replay the click so the original
     Coach Chat sendMessage function handles
     the message normally.

     No duplicate Supabase inserts.
     ========================================= */

  async function handleSend(event) {
    if (replaying || checking) return;

    const target = event.target;

    if (!(target instanceof Element)) return;

    const send = target.closest(
      "#" + SEND_ID
    );

    if (!send || !chatOpen()) return;

    const input = $(INPUT_ID);

    if (!input?.value.trim()) {
      return;
    }

    /*
     Only intercept while operating
     from the installed Home Screen app.

     Normal Safari messaging stays as-is.
    */

    if (!isHomeScreen()) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    checking = true;

    const originalLabel = send.textContent;

    send.disabled = true;
    send.textContent = "CHECKING…";

    setStatus("Checking your account connection…");

    try {
      await checkAuthentication();

      /*
       Restore button state before the
       original sender runs.
      */

      send.disabled = false;
      send.textContent = "SEND";

      replaying = true;

      try {
        send.click();
      } finally {
        replaying = false;
      }

    } catch (error) {
      console.error(
        "Mana Home Screen chat authentication:",
        error
      );

      send.disabled = false;
      send.textContent = "SEND";

      setStatus(
        error?.message ||
        "Please sign in again to send messages."
      );

      /*
       Keep the typed message so the
       client doesn't lose their work.
      */

    } finally {
      checking = false;
    }
  }

  /* =========================================
     REFRESH AUTH ON APP RESUME

     iOS may suspend installed apps.
     Recheck when the user returns.
     ========================================= */

  async function onResume() {
    if (!isHomeScreen() || !chatOpen()) {
      return;
    }

    if (checking || authPromise) return;

    try {
      await checkAuthentication();
    } catch (_) {
      /*
       Don't interrupt typing.

       The next Send attempt displays
       the relevant authentication error.
      */
    }
  }

  function init() {
    /*
     Capture phase runs before the
     original delegated click listener.
    */

    document.addEventListener(
      "click",
      handleSend,
      true
    );

    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.visibilityState === "visible") {
          onResume();
        }
      }
    );

    window.addEventListener(
      "pageshow",
      onResume
    );

    console.log(
      "Mana Home Screen Chat Auth",
      BUILD,
      isHomeScreen() ? "standalone" : "browser"
    );
  }

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
