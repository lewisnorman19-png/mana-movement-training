/* =========================================
   MANA MOVEMENT TRAINING v10.09.1
   SAFE COACH CLIENT NAVIGATION
   DIRECT PROGRAM BUILDER LINK

   REQUIRES:
   - existing coach dashboard / Active Clients
   - v10_08_client_linked_compact_program_builder_100800.js

   PURPOSE
   - DO NOT interfere with login
   - DO NOT wrap loadCoachDashboard()
   - Stop duplicate client opens from coach home
   - Add VIEW CLIENT + BUILD PROGRAM actions
   - Pass exact client ID + name to Program Builder
   - Keep selected client synced in sessionStorage

   LOAD AFTER:
   - v9_97 coach dashboard
   - v9_98 coach client hub
   - v10_03 coach client assignment
   - v10_08 program builder
   ========================================= */

(() => {
  "use strict";

  const BUILD = "100910";
  const STYLE_ID = "mana-v10091-coach-client-navigation-style";
  const SESSION_KEY = "mana-v1003-selected-client";

  let timers = [];

  function $(id){
    return document.getElementById(id);
  }

  function coachHomeVisible(){
    const home = $("coachHomePage");
    const coach = $("coachView");

    return Boolean(
      home &&
      coach &&
      !coach.classList.contains("hide") &&
      !home.classList.contains("hide")
    );
  }

  function saveSelectedClient(id,name){
    if(!id) return null;

    const client = {
      id:String(id),
      name:String(name || "Client")
    };

    try{
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify(client)
      );
    }catch(_){}

    return client;
  }

  function getClientData(node){
    if(!node) return null;

    const id =
      node.dataset.clientId ||
      node.getAttribute("data-client-id");

    const name =
      node.dataset.clientName ||
      node.getAttribute("data-client-name") ||
      node.querySelector("strong")?.textContent?.trim() ||
      "Client";

    if(!id) return null;

    return {
      id:String(id),
      name:String(name || "Client")
    };
  }

  function installStyles(){
    if($(STYLE_ID)) return;

    const style =
      document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `
      .m10091-client-wrap{
        position:relative;
        margin-top:10px;
        border:1px solid #292929;
        border-radius:18px;
        background:#0a0a0a;
        overflow:hidden;
      }

      .m10091-client-wrap > .client-open{
        width:100% !important;
        margin:0 !important;
        border:0 !important;
        border-radius:0 !important;
        background:transparent !important;
      }

      .m10091-actions{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:8px;
        padding:0 12px 12px;
      }

      .m10091-action{
        min-height:40px;
        border-radius:11px;
        border:1px solid #303030;
        background:#0d0d0d;
        color:#bdbdbd;
        font-size:9px;
        font-weight:950;
        letter-spacing:.05em;
        cursor:pointer;
      }

      .m10091-action:hover{
        border-color:#555;
        color:#fff;
      }

      .m10091-action.program{
        border-color:#6d5a20;
        background:#171306;
        color:#f0cf62;
      }

      .m10091-action.program:hover{
        border-color:#a68b2f;
        background:#201a08;
      }

      @media(max-width:700px){
        .m10091-actions{
          grid-template-columns:1fr;
        }

        .m10091-action{
          min-height:44px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function openClient(id,name){
    const client =
      saveSelectedClient(
        id,
        name
      );

    if(!client) return;

    if(
      typeof window.openCoachClientDetail !==
      "function"
    ){
      console.error(
        "Mana: openCoachClientDetail is not available."
      );
      return;
    }

    window.openCoachClientDetail(
      client.id,
      client.name
    );
  }

  function openProgram(id,name){
    const client =
      saveSelectedClient(
        id,
        name
      );

    if(!client) return;

    if(
      typeof window.openManaProgramBuilder !==
      "function"
    ){
      alert(
        "Mana Program Builder is not ready. Refresh the page and try again."
      );
      return;
    }

    window.openManaProgramBuilder({
      id:client.id,
      name:client.name
    });
  }

  function makeAction(label,className){
    const button =
      document.createElement("button");

    button.type = "button";
    button.className =
      `m10091-action ${className || ""}`.trim();
    button.textContent = label;

    return button;
  }

  function decorateButton(clientButton){
    if(!clientButton) return;

    if(
      clientButton.closest(
        ".m10091-client-wrap"
      )
    ){
      return;
    }

    const client =
      getClientData(
        clientButton
      );

    if(!client?.id) return;

    const parent =
      clientButton.parentNode;

    if(!parent) return;

    const wrap =
      document.createElement("div");

    wrap.className =
      "m10091-client-wrap";

    parent.insertBefore(
      wrap,
      clientButton
    );

    wrap.appendChild(
      clientButton
    );

    const actions =
      document.createElement("div");

    actions.className =
      "m10091-actions";

    const view =
      makeAction(
        "VIEW CLIENT",
        "view"
      );

    const program =
      makeAction(
        "BUILD PROGRAM",
        "program"
      );

    view.onclick =
      event => {
        event.preventDefault();
        event.stopPropagation();

        openClient(
          client.id,
          client.name
        );
      };

    program.onclick =
      event => {
        event.preventDefault();
        event.stopPropagation();

        openProgram(
          client.id,
          client.name
        );
      };

    actions.appendChild(view);
    actions.appendChild(program);

    wrap.appendChild(actions);
  }

  function decorate(){
    if(!coachHomeVisible()){
      return;
    }

    document
      .querySelectorAll(
        "#coachHomePage .client-open"
      )
      .forEach(
        decorateButton
      );

    window.MANA_COACH_CLIENT_NAVIGATION_BUILD =
      BUILD;
  }

  function clearTimers(){
    timers.forEach(
      clearTimeout
    );

    timers = [];
  }

  function scheduleDecorate(){
    clearTimers();

    [
      80,
      220,
      500,
      1000,
      1800
    ].forEach(
      delay => {
        timers.push(
          setTimeout(
            decorate,
            delay
          )
        );
      }
    );
  }

  function installSafeClientInterceptor(){
    document.addEventListener(
      "click",
      event => {
        if(!coachHomeVisible()){
          return;
        }

        const clientButton =
          event.target.closest(
            "#coachHomePage .client-open"
          );

        if(!clientButton){
          return;
        }

        /*
          Stop older click handlers from opening
          the same client multiple times.
        */
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        const client =
          getClientData(
            clientButton
          );

        if(!client?.id){
          return;
        }

        openClient(
          client.id,
          client.name
        );
      },
      true
    );
  }

  function bindRefreshTriggers(){
    document.addEventListener(
      "click",
      event => {
        const nav =
          event.target.closest(
            '#bottomNav [data-page]'
          );

        const alert =
          event.target.closest(
            "[data-alert-filter]"
          );

        const back =
          event.target.closest(
            "#backToCoachClients"
          );

        if(
          nav ||
          alert ||
          back
        ){
          scheduleDecorate();
        }
      }
    );

    window.addEventListener(
      "focus",
      () => {
        if(coachHomeVisible()){
          scheduleDecorate();
        }
      }
    );
  }

  function init(){
    installStyles();

    /*
      Important:
      No login functions are wrapped.
      No coach-dashboard loader is wrapped.
      This file only reacts after coach home exists.
    */
    installSafeClientInterceptor();
    bindRefreshTriggers();

    scheduleDecorate();

    window.openManaProgramForClient =
      openProgram;

    window.refreshManaCoachClientNavigation =
      scheduleDecorate;

    window.MANA_COACH_CLIENT_NAVIGATION_BUILD =
      BUILD;
  }

  if(
    document.readyState ===
    "loading"
  ){
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once:true
      }
    );
  }else{
    init();
  }

})();
