
/* ============================================================
   MANA MOVEMENT TRAINING
   COACH HUB — VIEW CLIENT REPAIR
   BUILD 104920

   FIXES:
   - View Client button not opening
   - Conflicting click handlers
   - Restore original client detail navigation
   - Preserve selected client identity

   PRESERVES:
   - Existing Coach Hub client list
   - Build Program buttons
   - Client profile and photographs
   - Existing coaching history
   - Workout and program assignments
   - Chat and notifications
   - Supabase data
   - Mobile layout

   NO DATABASE CHANGES.
   NO DOM REPLACEMENT.
   NO CONTINUOUS POLLING.
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104920";

  if (window.MANA_COACH_VIEW_FIX_104920) {
    return;
  }

  window.MANA_COACH_VIEW_FIX_104920 = true;

  const $ = id => document.getElementById(id);

  let opening = false;

  /* ============================================================
     CHECK COACH WORKSPACE
     ============================================================ */

  function coachIsVisible() {

    const coach = $("coachView");

    if (!coach) {
      return false;
    }

    return (
      !coach.hidden &&
      !coach.classList.contains("hide")
    );
  }

  /* ============================================================
     OPEN ORIGINAL CLIENT PROFILE
     ============================================================ */

  async function openClient(clientId, clientName) {

    if (opening) {
      return;
    }

    if (!clientId) {
      console.warn(
        "[Mana] View Client: missing client ID"
      );
      return;
    }

    const openFunction =
      window.openCoachClientDetail;

    if (typeof openFunction !== "function") {
      console.error(
        "[Mana] Original client detail function unavailable"
      );
      return;
    }

    opening = true;

    try {

      /*
       Use the app's existing client-opening
       function.

       It already handles:
       - Selected client
       - Client profile
       - Session history
       - Check-ins
       - Coaching information
       - Navigation
      */

      await openFunction(
        clientId,
        clientName || "Client"
      );

      const detail = $("coachClientDetailView");

      if (detail) {

        /*
         Existing application owns all
         client-detail functionality.
         Do not rebuild or replace it.
        */

        detail.hidden = false;

        detail.classList.remove("hide");

      }

      console.log(
        "[Mana] Client detail opened:",
        clientName || clientId
      );

    } catch (error) {

      console.error(
        "[Mana] View Client error:",
        error
      );

      /*
       Do not erase the current screen
       or reset the client's data.
      */

      const detail = $("coachClientDetailView");

      if (detail) {
        detail.hidden = false;
        detail.classList.remove("hide");
      }

    } finally {

      opening = false;

    }
  }

  /* ============================================================
     PROTECTED CLIENT CLICK HANDLER
     ============================================================ */

  function handleClientClick(event) {

    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    /*
     Only intercept genuine View Client
     buttons from the Coach Hub.

     Do not interfere with:
     - Build Program
     - Chat
     - Payments
     - Navigation
     - Client App
    */

    const button = target.closest(
      "button.client-open[data-client-id]"
    );

    if (!button) {
      return;
    }

    if (!coachIsVisible()) {
      return;
    }

    /*
     Handle this click before older
     document-level listeners can
     conflict with one another.
    */

    event.preventDefault();

    event.stopImmediatePropagation();

    const clientId =
      button.dataset.clientId;

    const clientName =
      button.dataset.clientName ||
      button.closest(".mcn-client-row")
        ?.querySelector(".mcn-client-name")
        ?.textContent
        ?.trim() ||
      "Client";

    void openClient(
      clientId,
      clientName
    );
  }

  /* ============================================================
     INITIALISATION
     ============================================================ */

  function init() {

    /*
     Window capture runs before
     document-level click handlers.

     This allows the original View Client
     function to run just once.
    */

    window.addEventListener(
      "click",
      handleClientClick,
      true
    );

    console.log(
      "[Mana Movement] Coach View Client repair " +
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
