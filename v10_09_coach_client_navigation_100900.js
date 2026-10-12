/* =========================================
   MANA MOVEMENT TRAINING v10.09.0
   COACH CLIENT NAVIGATION + DIRECT PROGRAM LINK

   REQUIRES:
   - existing coach dashboard / Active Clients
   - v10_08_client_linked_compact_program_builder_100800.js

   PURPOSE
   - Stop duplicate client-detail opens from one click
   - Keep VIEW CLIENT working from the coach main page
   - Add BUILD PROGRAM beside each client
   - Pass the exact client ID + client name into Program Builder
   - Keep the selected client available to the builder / assignment layer

   LOAD AFTER:
   - v9_97_coach_dashboard_99700.js / 99710
   - v9_98_coach_client_hub_99800.js
   - v10_03_coach_client_assignment_100300.js
   - v10_08_client_linked_compact_program_builder_100800.js
   ========================================= */

(() => {
  "use strict";

  const BUILD = "100900";
  const STYLE_ID = "mana-v1009-coach-client-navigation-style";
  const SESSION_KEY = "mana-v1003-selected-client";

  let decorateTimers = [];

  function saveSelectedClient(id, name) {
    if (!id) return null;

    const client = {
      id: String(id),
      name: String(name || "Client")
    };

    try {
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify(client)
      );
    } catch (_) {}

    return client;
  }

  function getClientFromButton(button) {
    if (!button) return null;

    const id =
      button.dataset.clientId ||
      button.getAttribute("data-client-id");

    const name =
      button.dataset.clientName ||
      button.getAttribute("data-client-name") ||
      button.querySelector("strong")?.textContent?.trim() ||
      "Client";

    if (!id) return null;

    return {
      id: String(id),
      name: String(name || "Client")
    };
  }

  function installStyles() {
    document.getElementById(STYLE_ID)?.remove();

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      .m1009-client-wrap{
        position:relative;
        margin-top:9px;
        border:1px solid #292929;
        border-radius:18px;
        background:#0a0a0a;
        overflow:hidden;
      }

      .m1009-client-wrap > .client-open{
        width:100% !important;
        margin:0 !important;
        border:0 !important;
        border-radius:0 !important;
        background:transparent !important;
        padding-bottom:12px !important;
      }

      .m1009-client-actions{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:8px;
        padding:0 12px 12px;
      }

      .m1009-client-action{
        min-height:38px;
        border-radius:11px;
        border:1px solid #303030;
        background:#0d0d0d;
        color:#bdbdbd;
        font-size:9px;
        font-weight:950;
        letter-spacing:.05em;
        cursor:pointer;
      }

      .m1009-client-action:hover{
        border-color:#525252;
        color:#fff;
      }

      .m1009-client-action.program{
        border-color:#6d5a20;
        background:#171306;
        color:#f0cf62;
      }

      .m1009-client-action.program:hover{
        border-color:#a68b2f;
        background:#201a08;
      }

      #coachFocusCard .m1009-client-wrap{
        margin-top:10px;
      }

      #coachFocusCard
      .m1009-client-wrap
      > .focus-item.client-open{
        margin:0 !important;
        border:0 !important;
        border-radius:0 !important;
      }

      .m1009-direct-program-note{
        margin:8px 0 0;
        color:#6f6f6f;
        font-size:9px;
        line-height:1.4;
      }

      @media(max-width:700px){
        .m1009-client-actions{
          grid-template-columns:1fr;
        }

        .m1009-client-action{
          min-height:42px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function clearDecorateTimers() {
    decorateTimers.forEach(clearTimeout);
    decorateTimers = [];
  }

  function scheduleDecorate() {
    clearDecorateTimers();

    [
      0,
      80,
      180,
      350,
      700,
      1400,
      2800
    ].forEach(delay => {
      decorateTimers.push(
        setTimeout(
          decorateClientButtons,
          delay
        )
      );
    });
  }

  function createActionButton(label, className) {
    const button = document.createElement("button");
    button.type = "button";
    button.className =
      `m1009-client-action ${className || ""}`.trim();
    button.textContent = label;
    return button;
  }

  function wrapClientButton(clientButton) {
    if (!clientButton) return;

    if (
      clientButton.closest(
        ".m1009-client-wrap"
      )
    ) {
      return;
    }

    const client = getClientFromButton(clientButton);

    if (!client?.id) return;

    const parent = clientButton.parentNode;
    if (!parent) return;

    const wrap = document.createElement("div");
    wrap.className = "m1009-client-wrap";

    parent.insertBefore(
      wrap,
      clientButton
    );

    wrap.appendChild(
      clientButton
    );

    const actions = document.createElement("div");
    actions.className = "m1009-client-actions";

    const viewButton =
      createActionButton(
        "VIEW CLIENT",
        "view"
      );

    const programButton =
      createActionButton(
        "BUILD PROGRAM",
        "program"
      );

    viewButton.dataset.clientId =
      client.id;

    viewButton.dataset.clientName =
      client.name;

    programButton.dataset.clientId =
      client.id;

    programButton.dataset.clientName =
      client.name;

    viewButton.addEventListener(
      "click",
      event => {
        event.preventDefault();
        event.stopPropagation();

        openClientOnce(
          client.id,
          client.name
        );
      }
    );

    programButton.addEventListener(
      "click",
      event => {
        event.preventDefault();
        event.stopPropagation();

        openProgramForClient(
          client.id,
          client.name
        );
      }
    );

    actions.appendChild(
      viewButton
    );

    actions.appendChild(
      programButton
    );

    wrap.appendChild(
      actions
    );
  }

  function decorateClientButtons() {
    document
      .querySelectorAll(
        "#coachHomePage .client-open"
      )
      .forEach(
        wrapClientButton
      );

    window.MANA_COACH_CLIENT_NAVIGATION_BUILD =
      BUILD;
  }

  function openClientOnce(id, name) {
    const client =
      saveSelectedClient(
        id,
        name
      );

    if (!client) return;

    if (
      typeof window.openCoachClientDetail !==
      "function"
    ) {
      console.error(
        "Mana: openCoachClientDetail is unavailable."
      );
      return;
    }

    try {
      window.openCoachClientDetail(
        client.id,
        client.name
      );
    } catch (error) {
      console.error(
        "Mana client open failed:",
        error
      );
    }
  }

  function openProgramForClient(id, name) {
    const client =
      saveSelectedClient(
        id,
        name
      );

    if (!client) return;

    if (
      typeof window.openManaProgramBuilder !==
      "function"
    ) {
      alert(
        "Mana Program Builder is not ready yet. Refresh the page and try again."
      );
      return;
    }

    window.openManaProgramBuilder({
      id: client.id,
      name: client.name
    });
  }

  function interceptLegacyClientClicks() {
    document.addEventListener(
      "click",
      event => {
        const legacyButton =
          event.target.closest(
            "#coachHomePage .client-open"
          );

        if (!legacyButton) {
          return;
        }

        /*
          Important:
          index.html and older dashboard layers can both
          open the same client from one click.

          This capture listener stops the click before those
          older bubble / onclick handlers run, then opens the
          client detail exactly once.
        */

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        const client =
          getClientFromButton(
            legacyButton
          );

        if (!client?.id) {
          return;
        }

        openClientOnce(
          client.id,
          client.name
        );
      },
      true
    );
  }

  function bindDashboardRefresh() {
    document.addEventListener(
      "click",
      event => {
        const coachNav =
          event.target.closest(
            '#bottomNav [data-page]'
          );

        if (coachNav) {
          scheduleDecorate();
        }

        const alertButton =
          event.target.closest(
            "[data-alert-filter]"
          );

        if (alertButton) {
          scheduleDecorate();
        }
      }
    );

    if (
      typeof window.loadCoachDashboard ===
      "function" &&
      !window.loadCoachDashboard
        .manaV1009Wrapped
    ) {
      const original =
        window.loadCoachDashboard;

      const wrapped =
        async function(...args) {
          try {
            const result =
              await original.apply(
                this,
                args
              );

            scheduleDecorate();
            return result;

          } catch (error) {
            scheduleDecorate();
            throw error;
          }
        };

      wrapped.manaV1009Wrapped =
        true;

      window.loadCoachDashboard =
        wrapped;
    }
  }

  function init() {
    installStyles();

    /*
      Capture navigation before the older global click
      handlers can fire twice.
    */
    interceptLegacyClientClicks();

    bindDashboardRefresh();

    scheduleDecorate();

    window.openManaProgramForClient =
      openProgramForClient;

    window.refreshManaCoachClientNavigation =
      scheduleDecorate;

    window.MANA_COACH_CLIENT_NAVIGATION_BUILD =
      BUILD;
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once:true
      }
    );
  } else {
    init();
  }

})();
