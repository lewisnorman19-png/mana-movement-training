/* =========================================
   MANA MOVEMENT TRAINING v10.10.0
   COACH CLIENT HUB — CLEAN ACTION FLOW

   PURPOSE
   - Tidy the individual client hub
   - Keep all existing Supabase / client data logic intact
   - Keep v10.03 program assignment logic intact
   - Put real client program management near the top
   - Add clear coach actions:
       PROGRAMS
       CHECK-IN
       SESSIONS
       MESSAGE
   - Widen the hub for laptop
   - Hide the older generic program-suite strip
   - Do not interfere with login
   - Do not wrap authentication functions
   - Do not create database writes on load

   DESIGNED TO WORK WITH:
   - v9_98_coach_client_hub_99800.js
   - v10_03_coach_client_assignment_100300.js
   - v10_08_client_linked_compact_program_builder_100800.js
   - v10_09_1_safe_coach_client_navigation_100910.js
   ========================================= */

(() => {
  "use strict";

  const BUILD = "101000";

  const STYLE_ID =
    "mana-v1010-client-hub-polish-style";

  const ACTIONS_ID =
    "manaV1010ClientActions";

  let timers = [];

  const $ =
    id =>
      document.getElementById(id);

  function detailView(){
    return $(
      "coachClientDetailView"
    );
  }

  function detailOpen(){
    const view =
      detailView();

    return Boolean(
      view &&
      !view.classList.contains(
        "hide"
      )
    );
  }

  function clientName(){
    return String(
      $("detailClientName")
        ?.textContent ||
      "Client"
    )
      .replace(
        /\s+/g,
        " "
      )
      .trim() ||
      "Client";
  }

  function esc(value){
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
      )
      .replaceAll(
        "'",
        "&#039;"
      );
  }

  function installStyles(){
    if(
      $(STYLE_ID)
    ){
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      STYLE_ID;

    style.textContent = `
      /* =====================================
         HUB WIDTH / FOUNDATION
         ===================================== */

      #coachClientDetailView{
        width:
          min(
            1180px,
            calc(
              100% - 30px
            )
          )
          !important;

        margin:
          0 auto
          !important;

        padding-bottom:
          110px
          !important;
      }

      #coachClientDetailView
      #manaV998ProgramSuite{
        display:
          none
          !important;
      }


      /* =====================================
         ACTION HUB
         ===================================== */

      #${ACTIONS_ID}{
        margin:
          0
          0
          14px;

        padding:
          16px;

        border:
          1px solid
          #2d2d2d;

        border-radius:
          21px;

        background:
          linear-gradient(
            145deg,
            #0f0f0f,
            #080808
          );
      }

      .m1010-actions-head{
        display:
          flex;

        justify-content:
          space-between;

        align-items:
          flex-end;

        gap:
          14px;

        margin-bottom:
          13px;
      }

      .m1010-actions-kicker{
        color:
          #b49a3b;

        font-size:
          9px;

        font-weight:
          950;

        letter-spacing:
          .14em;

        text-transform:
          uppercase;
      }

      .m1010-actions-title{
        margin-top:
          4px;

        color:
          #fff;

        font-size:
          18px;

        font-weight:
          950;
      }

      .m1010-actions-name{
        color:
          #777;

        font-size:
          10px;

        text-align:
          right;
      }

      .m1010-action-grid{
        display:
          grid;

        grid-template-columns:
          repeat(
            4,
            minmax(
              0,
              1fr
            )
          );

        gap:
          9px;
      }

      .m1010-action{
        position:
          relative;

        min-width:
          0;

        min-height:
          104px;

        padding:
          14px;

        border:
          1px solid
          #2d2d2d;

        border-radius:
          17px;

        background:
          #0b0b0b;

        color:
          #fff;

        text-align:
          left;

        cursor:
          pointer;

        transition:
          .15s ease;
      }

      .m1010-action:hover{
        transform:
          translateY(
            -1px
          );

        border-color:
          #62531f;

        background:
          #100e08;
      }

      .m1010-action.primary{
        border-color:
          #62531f;

        background:
          linear-gradient(
            145deg,
            #151207,
            #0a0a08
          );
      }

      .m1010-action-icon{
        display:
          grid;

        width:
          31px;

        height:
          31px;

        place-items:
          center;

        margin-bottom:
          12px;

        border:
          1px solid
          #4c411d;

        border-radius:
          10px;

        color:
          #e0c35d;

        font-size:
          14px;

        font-weight:
          950;
      }

      .m1010-action strong{
        display:
          block;

        overflow:
          hidden;

        color:
          #fff;

        font-size:
          12px;

        font-weight:
          950;

        letter-spacing:
          .03em;

        text-overflow:
          ellipsis;

        white-space:
          nowrap;
      }

      .m1010-action small{
        display:
          block;

        margin-top:
          6px;

        color:
          #717171;

        font-size:
          9px;

        line-height:
          1.35;
      }


      /* =====================================
         REAL PROGRAM MANAGEMENT
         ===================================== */

      #manaV1003ClientProgramsCard{
        margin:
          0
          0
          14px
          !important;

        padding:
          20px
          !important;

        border-radius:
          21px
          !important;

        box-shadow:
          0 16px 38px
          rgba(
            0,
            0,
            0,
            .17
          );
      }

      #manaV1003ClientProgramsCard
      .m1003-actions{
        grid-template-columns:
          repeat(
            2,
            minmax(
              0,
              1fr
            )
          );

        gap:
          10px;
      }

      #manaV1003ClientProgramsCard
      .m1003-main-btn,
      #manaV1003ClientProgramsCard
      .m1003-secondary-btn{
        min-height:
          48px;
      }


      /* =====================================
         SUMMARY
         ===================================== */

      #manaV998ClientSummary{
        margin-bottom:
          14px
          !important;
      }

      #manaV998ClientSummary
      .mana-v998-stat{
        min-height:
          98px;
      }


      /* =====================================
         EXISTING CARDS — CLEANER RHYTHM
         ===================================== */

      #coachClientDetailView
      .card{
        margin-bottom:
          14px
          !important;

        border-radius:
          20px
          !important;
      }

      #coachClientDetailView
      .quick-actions-grid{
        grid-template-columns:
          repeat(
            4,
            minmax(
              0,
              1fr
            )
          )
          !important;
      }

      #coachClientDetailView
      .quick-action-btn{
        min-height:
          78px
          !important;
      }


      /* =====================================
         TEMPORARY TARGET HIGHLIGHT
         ===================================== */

      .m1010-highlight{
        animation:
          manaV1010Highlight
          1.6s ease;
      }

      @keyframes
      manaV1010Highlight{

        0%{
          box-shadow:
            0 0 0 0
            rgba(
              240,
              207,
              98,
              0
            );
        }

        28%{
          box-shadow:
            0 0 0 3px
            rgba(
              240,
              207,
              98,
              .24
            );
        }

        100%{
          box-shadow:
            0 0 0 0
            rgba(
              240,
              207,
              98,
              0
            );
        }
      }


      /* =====================================
         MOBILE / NARROW
         ===================================== */

      @media(
        max-width:
        900px
      ){

        #coachClientDetailView{
          width:
            min(
              100%,
              900px
            )
            !important;
        }

        .m1010-action-grid{
          grid-template-columns:
            repeat(
              2,
              minmax(
                0,
                1fr
              )
            );
        }

        #coachClientDetailView
        .quick-actions-grid{
          grid-template-columns:
            repeat(
              2,
              minmax(
                0,
                1fr
              )
            )
            !important;
        }

      }

      @media(
        max-width:
        560px
      ){

        #coachClientDetailView{
          width:
            100%
            !important;
        }

        #${ACTIONS_ID}{
          padding:
            13px;
        }

        .m1010-actions-head{
          align-items:
            flex-start;

          flex-direction:
            column;
        }

        .m1010-actions-name{
          text-align:
            left;
        }

        .m1010-action{
          min-height:
            92px;
        }

        #manaV1003ClientProgramsCard
        .m1003-actions{
          grid-template-columns:
            1fr;
        }

      }
    `;

    document.head.appendChild(
      style
    );
  }

  function hero(){
    return $(
      "manaV998ClientHero"
    );
  }

  function summary(){
    return $(
      "manaV998ClientSummary"
    );
  }

  function programCard(){
    return $(
      "manaV1003ClientProgramsCard"
    );
  }

  function cardContaining(
    element
  ){
    return (
      element
        ?.closest(
          ".card"
        ) ||
      null
    );
  }

  function quickActionsCard(){
    const button =
      $(
        "quickMessageBtn"
      ) ||
      $(
        "quickRecordSessionBtn"
      ) ||
      $(
        "requestCheckinBtn"
      );

    return cardContaining(
      button
    );
  }

  function checkinCard(){
    return cardContaining(
      $(
        "detailLatestCheckin"
      )
    );
  }

  function sessionCard(){
    return (
      $(
        "sessionHistoryCard"
      ) ||
      cardContaining(
        $(
          "quickRecordSessionBtn"
        )
      )
    );
  }

  function notesCard(){
    return (
      $(
        "coachNotesCard"
      ) ||
      cardContaining(
        $(
          "coachNoteDraft"
        )
      )
    );
  }

  function flash(
    element
  ){
    if(!element){
      return;
    }

    element
      .classList
      .remove(
        "m1010-highlight"
      );

    void
      element
        .offsetWidth;

    element
      .classList
      .add(
        "m1010-highlight"
      );

    setTimeout(
      () =>
        element
          .classList
          .remove(
            "m1010-highlight"
          ),
      1700
    );
  }

  function scrollToTarget(
    element
  ){
    if(!element){
      return;
    }

    element
      .scrollIntoView({
        behavior:
          "smooth",

        block:
          "start"
      });

    flash(
      element
    );
  }

  function openPrograms(){
    const card =
      programCard();

    if(card){
      scrollToTarget(
        card
      );

      return;
    }

    if(
      typeof
        window
          .openManaProgramBuilder ===
        "function"
    ){

      let stored =
        null;

      try{
        stored =
          JSON.parse(
            sessionStorage.getItem(
              "mana-v1003-selected-client"
            ) ||
            "null"
          );
      }catch(_){}

      if(
        stored
          ?.id
      ){

        window
          .openManaProgramBuilder({
            id:
              stored.id,

            name:
              stored.name ||
              clientName()
          });
      }
    }
  }

  function openCheckin(){
    const card =
      checkinCard() ||
      quickActionsCard();

    scrollToTarget(
      card
    );

    const button =
      $(
        "requestCheckinBtn"
      );

    if(button){
      flash(
        button
      );
    }
  }

  function openSessions(){
    const quick =
      $(
        "quickRecordSessionBtn"
      );

    const card =
      quickActionsCard();

    if(
      quick &&
      card
    ){

      quick.click();

      setTimeout(
        () => {

          const panel =
            $(
              "quickSessionPanel"
            );

          scrollToTarget(
            panel ||
            card
          );

        },
        30
      );

      return;
    }

    scrollToTarget(
      sessionCard()
    );
  }

  function openMessage(){
    const quick =
      $(
        "quickMessageBtn"
      );

    const card =
      quickActionsCard();

    if(
      quick &&
      card
    ){

      quick.click();

      setTimeout(
        () => {

          const panel =
            $(
              "quickMessagePanel"
            );

          scrollToTarget(
            panel ||
            card
          );

        },
        30
      );

      return;
    }

    scrollToTarget(
      notesCard()
    );
  }

  function actionHtml(){
    return `
      <div class="m1010-actions-head">

        <div>

          <div class="m1010-actions-kicker">
            COACH CLIENT HUB
          </div>

          <div class="m1010-actions-title">
            What do you want to do?
          </div>

        </div>

        <div class="m1010-actions-name">
          Working with
          <strong style="color:#e1c45d">
            ${esc(
              clientName()
            )}
          </strong>
        </div>

      </div>

      <div class="m1010-action-grid">

        <button
          type="button"
          class="m1010-action primary"
          id="manaV1010Programs"
        >

          <span class="m1010-action-icon">
            ▣
          </span>

          <strong>
            PROGRAMS
          </strong>

          <small>
            View assigned program, build new or assign saved.
          </small>

        </button>

        <button
          type="button"
          class="m1010-action"
          id="manaV1010Checkin"
        >

          <span class="m1010-action-icon">
            ✓
          </span>

          <strong>
            CHECK-IN
          </strong>

          <small>
            Review check-ins and request the next update.
          </small>

        </button>

        <button
          type="button"
          class="m1010-action"
          id="manaV1010Sessions"
        >

          <span class="m1010-action-icon">
            +
          </span>

          <strong>
            SESSIONS
          </strong>

          <small>
            Record a coaching session and review session history.
          </small>

        </button>

        <button
          type="button"
          class="m1010-action"
          id="manaV1010Message"
        >

          <span class="m1010-action-icon">
            ↗
          </span>

          <strong>
            MESSAGE
          </strong>

          <small>
            Build a client message from their latest coaching data.
          </small>

        </button>

      </div>
    `;
  }

  function ensureActions(){
    const view =
      detailView();

    const clientHero =
      hero();

    if(
      !view ||
      !clientHero
    ){
      return null;
    }

    let actions =
      $(ACTIONS_ID);

    if(!actions){

      actions =
        document.createElement(
          "section"
        );

      actions.id =
        ACTIONS_ID;

      clientHero
        .insertAdjacentElement(
          "afterend",
          actions
        );
    }

    actions.innerHTML =
      actionHtml();

    $(
      "manaV1010Programs"
    ).onclick =
      openPrograms;

    $(
      "manaV1010Checkin"
    ).onclick =
      openCheckin;

    $(
      "manaV1010Sessions"
    ).onclick =
      openSessions;

    $(
      "manaV1010Message"
    ).onclick =
      openMessage;

    return actions;
  }

  function moveRealProgramCard(){
    const actions =
      $(ACTIONS_ID);

    const card =
      programCard();

    if(
      !actions ||
      !card
    ){
      return;
    }

    if(
      actions
        .nextElementSibling !==
      card
    ){

      actions
        .insertAdjacentElement(
          "afterend",
          card
        );
    }
  }

  function moveSummary(){
    const card =
      programCard();

    const stats =
      summary();

    if(
      !card ||
      !stats
    ){
      return;
    }

    if(
      card
        .nextElementSibling !==
      stats
    ){

      card
        .insertAdjacentElement(
          "afterend",
          stats
        );
    }
  }

  function polishQuickActions(){
    const card =
      quickActionsCard();

    if(!card){
      return;
    }

    const heading =
      card.querySelector(
        "h3"
      );

    if(heading){
      heading.textContent =
        "Coach tools";
    }

    const subtitle =
      heading
        ?.closest(
          ".row"
        )
        ?.querySelector(
          "p"
        );

    if(subtitle){
      subtitle.textContent =
        "Notes, focus, sessions and messaging.";
    }
  }

  function polish(){
    if(
      !detailOpen()
    ){
      return;
    }

    installStyles();

    ensureActions();

    moveRealProgramCard();

    moveSummary();

    polishQuickActions();

    window
      .MANA_COACH_CLIENT_HUB_POLISH_BUILD =
      BUILD;
  }

  function clearTimers(){
    timers
      .forEach(
        clearTimeout
      );

    timers =
      [];
  }

  function schedulePolish(){
    clearTimers();

    [
      0,
      80,
      180,
      350,
      700,
      1300,
      2400
    ]
      .forEach(
        delay => {

          timers.push(
            setTimeout(
              () => {

                if(
                  detailOpen()
                ){
                  polish();
                }

              },
              delay
            )
          );

        }
      );
  }

  function bindTriggers(){
    document
      .addEventListener(
        "click",
        event => {

          const client =
            event.target
              .closest(
                ".client-open, .m10091-action.view"
              );

          if(client){

            setTimeout(
              schedulePolish,
              40
            );
          }

          const back =
            event.target
              .closest(
                "#backToCoachClients"
              );

          if(back){
            clearTimers();
          }

        }
      );

    window
      .addEventListener(
        "focus",
        () => {

          if(
            detailOpen()
          ){
            schedulePolish();
          }

        }
      );
  }

  function init(){
    installStyles();

    bindTriggers();

    schedulePolish();

    window
      .refreshManaCoachClientHubPolish =
      schedulePolish;

    window
      .MANA_COACH_CLIENT_HUB_POLISH_BUILD =
      BUILD;
  }

  if(
    document.readyState ===
    "loading"
  ){

    document
      .addEventListener(
        "DOMContentLoaded",
        init,
        {
          once:
            true
        }
      );

  }else{

    init();
  }

})();
