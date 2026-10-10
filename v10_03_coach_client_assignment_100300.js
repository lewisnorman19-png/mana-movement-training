/* =========================================
   MANA MOVEMENT TRAINING v10.03.0
   COACH CLIENT PROGRAM ASSIGNMENT

   REQUIRES
   - v10_00_custom_program_schema_100000.sql
   - v10_01_coach_program_builder_100110.js
   - v10_02_client_custom_programs_100200.js

   PURPOSE
   - Assign saved custom programs to a client
   - Show current client assignments
   - Make primary
   - Pause / resume
   - Remove assignment
   - Open Program Builder for that client
   ========================================= */

(() => {
  "use strict";

  const BUILD = "100300";
  const STYLE_ID = "mana-v1003-client-assignment-style";
  const CARD_ID = "manaV1003ClientProgramsCard";
  const MODAL_ID = "manaV1003AssignModal";
  const SESSION_KEY = "mana-v1003-selected-client";

  let selectedClient = readStoredClient();
  let savedPrograms = [];
  let assignments = [];
  let timers = [];
  let originalOpenCoachClientDetail = null;

  const $ = id => document.getElementById(id);

  function esc(value){
    return String(value ?? "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  function detailView(){
    return $("coachClientDetailView");
  }

  function detailOpen(){
    const view = detailView();
    return Boolean(
      view &&
      !view.classList.contains("hide")
    );
  }

  function detailClientName(){
    return String(
      $("detailClientName")?.textContent ||
      selectedClient?.name ||
      "Client"
    )
      .replace(/\s+/g," ")
      .trim();
  }

  function clientIdFromValue(value){

    if(!value){
      return "";
    }

    if(
      typeof value ===
      "string"
    ){

      const text =
        value.trim();

      const uuid =
        text.match(
          /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i
        );

      return uuid
        ? uuid[0]
        : text;

    }

    if(
      typeof value ===
      "object"
    ){

      return String(
        value.client_id ||
        value.clientId ||
        value.user_id ||
        value.userId ||
        value.profile_id ||
        value.profileId ||
        value.uid ||
        value.id ||
        ""
      )
        .trim();

    }

    return "";

  }

  function clientNameFromValue(value){

    if(
      !value ||
      typeof value !==
      "object"
    ){

      return "";

    }

    return String(
      value.name ||
      value.full_name ||
      value.fullName ||
      value.display_name ||
      value.displayName ||
      value.email ||
      ""
    )
      .trim();

  }

  function rememberClient(client){

    if(
      !client?.id
    ){

      return;

    }

    selectedClient = {

      id:
        String(
          client.id
        ),

      name:
        String(
          client.name ||
          "Client"
        )

    };

    try{

      sessionStorage
        .setItem(
          SESSION_KEY,
          JSON.stringify(
            selectedClient
          )
        );

    }catch(_){}

  }

  function readStoredClient(){

    try{

      const parsed =
        JSON.parse(
          sessionStorage
            .getItem(
              SESSION_KEY
            )
          ||
          "null"
        );

      if(
        parsed?.id
      ){

        return {

          id:
            String(
              parsed.id
            ),

          name:
            String(
              parsed.name ||
              "Client"
            )

        };

      }

    }catch(_){}

    return null;

  }

  function clearTimers(){

    timers
      .forEach(
        clearTimeout
      );

    timers = [];

  }

  function setStatus(
    message,
    tone = ""
  ){

    const node =
      $(
        "manaV1003Status"
      );

    if(
      !node
    ){

      return;

    }

    node.textContent =
      message ||
      "";

    node.dataset.tone =
      tone;

  }


  /* =========================================
     SUPABASE
     ========================================= */

  async function sb(){

    if(
      typeof
        window.supabaseClient ===
      "function"
    ){

      return await
        window.supabaseClient();

    }

    throw new Error(
      "Mana Supabase client is unavailable."
    );

  }

  async function currentCoach(){

    const client =
      await sb();

    const {
      data,
      error
    } =
      await client
        .auth
        .getUser();

    if(
      error
    ){

      throw error;

    }

    if(
      !data?.user
    ){

      throw new Error(
        "Coach session not found."
      );

    }

    return data.user;

  }


  /* =========================================
     STYLES
     ========================================= */

  function installStyles(){

    if(
      $(
        STYLE_ID
      )
    ){

      return;

    }

    const style =
      document
        .createElement(
          "style"
        );

    style.id =
      STYLE_ID;

    style.textContent = `

      #${CARD_ID}{

        margin:
          0
          0
          12px;

        padding:
          18px;

        border:
          1px solid
          #3b3219;

        border-radius:
          20px;

        background:

          radial-gradient(
            circle
            at
            100%
            0%,

            rgba(
              243,
              216,
              117,
              .08
            ),

            transparent
            34%
          ),

          linear-gradient(
            145deg,
            #100e08,
            #080808
          );

      }


      .m1003-head{

        display:
          flex;

        justify-content:
          space-between;

        align-items:
          flex-start;

        gap:
          12px;

      }


      .m1003-kicker{

        color:
          #caaa43;

        font-size:
          9px;

        font-weight:
          950;

        letter-spacing:
          .14em;

        text-transform:
          uppercase;

      }


      .m1003-title{

        margin:
          5px
          0
          4px;

        color:
          #fff;

        font-size:
          17px;

        font-weight:
          950;

      }


      .m1003-sub{

        color:
          #818181;

        font-size:
          11px;

        line-height:
          1.45;

      }


      .m1003-primary-pill{

        flex:
          0
          0
          auto;

        border:
          1px solid
          #55491f;

        border-radius:
          999px;

        padding:
          7px
          9px;

        background:
          #141107;

        color:
          #e4c65d;

        font-size:
          8px;

        font-weight:
          950;

        letter-spacing:
          .08em;

        text-transform:
          uppercase;

      }


      .m1003-actions{

        display:
          grid;

        grid-template-columns:
          1fr
          1fr;

        gap:
          8px;

        margin-top:
          14px;

      }


      .m1003-main-btn,
      .m1003-secondary-btn{

        min-height:
          44px;

        border-radius:
          14px;

        font-size:
          10px;

        font-weight:
          950;

        letter-spacing:
          .04em;

        cursor:
          pointer;

      }


      .m1003-main-btn{

        border:
          1px solid
          #756223;

        background:
          linear-gradient(
            135deg,
            #ecd166,
            #b99229
          );

        color:
          #111;

      }


      .m1003-secondary-btn{

        border:
          1px solid
          #373737;

        background:
          #0d0d0d;

        color:
          #ddd;

      }


      .m1003-list{

        display:
          grid;

        gap:
          8px;

        margin-top:
          14px;

      }


      .m1003-assignment{

        border:
          1px solid
          #2b2b2b;

        border-radius:
          16px;

        background:
          #090909;

        padding:
          13px;

      }


      .m1003-assignment.primary{

        border-color:
          #645421;

        background:
          linear-gradient(
            145deg,
            #151207,
            #090909
          );

      }


      .m1003-assignment-top{

        display:
          flex;

        justify-content:
          space-between;

        align-items:
          flex-start;

        gap:
          10px;

      }


      .m1003-assignment-name{

        color:
          #fff;

        font-size:
          13px;

        font-weight:
          900;

      }


      .m1003-assignment-meta{

        margin-top:
          4px;

        color:
          #6f6f6f;

        font-size:
          9px;

        line-height:
          1.4;

      }


      .m1003-state{

        flex:
          0
          0
          auto;

        padding:
          5px
          7px;

        border:
          1px solid
          #3a351f;

        border-radius:
          999px;

        color:
          #cdb450;

        font-size:
          7px;

        font-weight:
          950;

        letter-spacing:
          .08em;

        text-transform:
          uppercase;

      }


      .m1003-row-actions{

        display:
          flex;

        flex-wrap:
          wrap;

        gap:
          6px;

        margin-top:
          10px;

      }


      .m1003-small-btn{

        min-height:
          34px;

        border:
          1px solid
          #303030;

        border-radius:
          10px;

        background:
          #0d0d0d;

        color:
          #bdbdbd;

        padding:
          0
          10px;

        font-size:
          8px;

        font-weight:
          900;

        cursor:
          pointer;

      }


      .m1003-small-btn.gold{

        border-color:
          #55471e;

        color:
          #e3c45d;

        background:
          #121006;

      }


      .m1003-small-btn.danger{

        border-color:
          #3e2727;

        color:
          #b77e7e;

      }


      .m1003-empty{

        margin-top:
          13px;

        padding:
          13px;

        border:
          1px solid
          #272727;

        border-radius:
          14px;

        background:
          #080808;

        color:
          #737373;

        font-size:
          10px;

        line-height:
          1.45;

      }


      .m1003-status{

        min-height:
          18px;

        margin-top:
          10px;

        color:
          #777;

        font-size:
          10px;

        line-height:
          1.4;

      }


      .m1003-status[data-tone="good"]{

        color:
          #b9cc8e;

      }


      .m1003-status[data-tone="bad"]{

        color:
          #d68b8b;

      }


      #${MODAL_ID}{

        position:
          fixed;

        inset:
          0;

        z-index:
          62000;

        display:
          none;

        overflow:
          auto;

        padding:
          18px
          14px
          40px;

        background:
          rgba(
            3,
            3,
            3,
            .98
          );

        color:
          #fff;

      }


      #${MODAL_ID}.open{

        display:
          block;

      }


      .m1003-modal-shell{

        width:
          min(
            680px,
            100%
          );

        margin:
          0 auto;

      }


      .m1003-modal-top{

        position:
          sticky;

        top:
          0;

        z-index:
          3;

        display:
          flex;

        justify-content:
          space-between;

        align-items:
          center;

        gap:
          12px;

        padding:
          12px
          0;

        background:
          #050505;

      }


      .m1003-modal-top
      strong{

        color:
          #f1d16a;

        font-size:
          10px;

        font-weight:
          950;

        letter-spacing:
          .13em;

      }


      .m1003-close{

        min-height:
          40px;

        padding:
          0
          13px;

        border:
          1px solid
          #343434;

        border-radius:
          12px;

        background:
          #101010;

        color:
          #ddd;

        font-weight:
          900;

        cursor:
          pointer;

      }


      .m1003-modal-card{

        padding:
          18px;

        border:
          1px solid
          #393019;

        border-radius:
          20px;

        background:
          linear-gradient(
            145deg,
            #100e08,
            #080808
          );

      }


      .m1003-modal-card
      h2{

        margin:
          0
          0
          5px;

        font-size:
          25px;

      }


      .m1003-modal-card
      p{

        margin:
          0;

        color:
          #838383;

        font-size:
          11px;

        line-height:
          1.45;

      }


      .m1003-program-options{

        display:
          grid;

        gap:
          8px;

        margin-top:
          15px;

      }


      .m1003-program-option{

        width:
          100%;

        display:
          flex;

        justify-content:
          space-between;

        align-items:
          center;

        gap:
          12px;

        padding:
          14px;

        border:
          1px solid
          #2d2d2d;

        border-radius:
          15px;

        background:
          #090909;

        color:
          #fff;

        text-align:
          left;

        cursor:
          pointer;

      }


      .m1003-program-option:hover{

        border-color:
          #51441d;

      }


      .m1003-program-option
      strong{

        display:
          block;

        font-size:
          13px;

      }


      .m1003-program-option
      small{

        display:
          block;

        margin-top:
          4px;

        color:
          #737373;

        font-size:
          9px;

      }


      .m1003-program-option
      span{

        color:
          #e0c05c;

        font-size:
          9px;

        font-weight:
          950;

      }


      @media(
        max-width:
          620px
      ){

        .m1003-actions{

          grid-template-columns:
            1fr;

        }


        .m1003-modal-card{

          padding:
            16px;

          border-radius:
            18px;

        }

      }

    `;

    document
      .head
      .appendChild(
        style
      );

  }


  /* =========================================
     MODAL
     ========================================= */

  function ensureModal(){

    installStyles();

    let modal =
      $(
        MODAL_ID
      );

    if(
      modal
    ){

      return modal;

    }

    modal =
      document
        .createElement(
          "div"
        );

    modal.id =
      MODAL_ID;

    modal.innerHTML = `

      <div
        class="m1003-modal-shell"
      >

        <div
          class="m1003-modal-top"
        >

          <strong>
            MANA COACH • ASSIGN PROGRAM
          </strong>


          <button
            type="button"
            class="m1003-close"
            id="manaV1003Close"
          >
            CLOSE
          </button>

        </div>


        <div
          id="manaV1003ModalContent"
        ></div>

      </div>

    `;

    document
      .body
      .appendChild(
        modal
      );

    $(
      "manaV1003Close"
    ).onclick =
      closeModal;

    return modal;

  }


  function closeModal(){

    $(
      MODAL_ID
    )
      ?.classList
      .remove(
        "open"
      );

    document
      .body
      .style
      .overflow =
        "";

  }


  /* =========================================
     CLIENT CAPTURE
     ========================================= */

  function captureClientFromElement(
    element
  ){

    if(
      !element
    ){

      return null;

    }

    const candidate =
      element
        .closest(
          "[data-client-id], [data-user-id], [data-uid], .client-open"
        )
      ||
      element;

    const id =
      String(
        candidate.dataset?.clientId ||
        candidate.dataset?.userId ||
        candidate.dataset?.uid ||
        candidate.dataset?.id ||
        ""
      )
        .trim();

    const name =
      String(
        candidate.dataset?.clientName ||
        candidate.dataset?.name ||
        candidate.dataset?.fullName ||
        ""
      )
        .trim();

    if(
      id
    ){

      return {

        id,

        name:
          name ||
          "Client"

      };

    }

    const onclickText =
      candidate
        .getAttribute?.(
          "onclick"
        )
      ||
      "";

    const onclickId =
      clientIdFromValue(
        onclickText
      );

    if(
      onclickId
    ){

      return {

        id:
          onclickId,

        name:
          name ||
          "Client"

      };

    }

    return null;

  }


  function bindClientCapture(){

    if(
      document
        .documentElement
        .dataset
        .manaV1003ClientCapture ===
      "1"
    ){

      return;

    }

    document
      .documentElement
      .dataset
      .manaV1003ClientCapture =
        "1";

    document
      .addEventListener(
        "click",
        event => {

          const target =
            event
              .target
              ?.closest(
                ".client-open, [data-client-id], [data-user-id], [data-uid]"
              );

          if(
            !target
          ){

            return;

          }

          const client =
            captureClientFromElement(
              target
            );

          if(
            !client?.id
          ){

            return;

          }

          rememberClient(
            client
          );

          setTimeout(
            () => {

              if(
                detailOpen()
              ){

                buildCard();
                refreshData();

              }

            },
            180
          );

        },
        true
      );

  }


  /* =========================================
     WRAP EXISTING CLIENT OPEN
     ========================================= */

  function wrapOpenClientDetail(){

    if(
      typeof
        window.openCoachClientDetail !==
      "function"
    ){

      return;

    }

    if(
      window
        .openCoachClientDetail
        .manaV1003Wrapped
    ){

      return;

    }

    originalOpenCoachClientDetail =
      window
        .openCoachClientDetail;

    const wrapped =
      async function(
        ...args
      ){

        const first =
          args[0];

        const second =
          args[1];

        const id =

          clientIdFromValue(
            first
          )

          ||

          clientIdFromValue(
            second
          );

        const name =

          clientNameFromValue(
            first
          )

          ||

          clientNameFromValue(
            second
          )

          ||

          (
            typeof second ===
            "string"

              ? second

              : ""
          );

        if(
          id
        ){

          rememberClient({

            id,

            name:
              name ||
              "Client"

          });

        }

        const result =
          originalOpenCoachClientDetail
            .apply(
              this,
              args
            );

        setTimeout(
          () => {

            if(
              detailOpen()
            ){

              if(
                selectedClient
              ){

                selectedClient.name =
                  detailClientName();

                rememberClient(
                  selectedClient
                );

              }

              buildCard();
              refreshData();

            }

          },
          120
        );

        try{

          const resolved =
            await result;

          if(
            selectedClient
          ){

            selectedClient.name =
              detailClientName();

            rememberClient(
              selectedClient
            );

          }

          buildCard();
          refreshData();

          return resolved;

        }catch(
          error
        ){

          buildCard();

          throw error;

        }

      };

    wrapped
      .manaV1003Wrapped =
        true;

    window
      .openCoachClientDetail =
        wrapped;

  }


  /* =========================================
     DATABASE LOAD
     ========================================= */

  async function loadSavedPrograms(){

    const client =
      await sb();

    const coach =
      await currentCoach();

    const {
      data,
      error
    } =
      await client
        .from(
          "custom_programs"
        )
        .select(
          "id,name,description,goal,duration_weeks,status,source_program,updated_at"
        )
        .eq(
          "coach_id",
          coach.id
        )
        .in(
          "status",
          [
            "active",
            "draft"
          ]
        )
        .order(
          "updated_at",
          {
            ascending:
              false
          }
        );

    if(
      error
    ){

      throw error;

    }

    savedPrograms =
      data ||
      [];

  }


  async function loadAssignments(){

    if(
      !selectedClient?.id
    ){

      assignments = [];

      return;

    }

    const client =
      await sb();

    const coach =
      await currentCoach();

    const {
      data,
      error
    } =
      await client
        .from(
          "client_program_assignments"
        )
        .select(`

          id,
          status,
          is_primary,
          start_date,
          assigned_at,
          program_id,

          custom_programs (

            id,
            name,
            description,
            goal,
            duration_weeks,
            status,
            source_program

          )

        `)
        .eq(
          "client_id",
          selectedClient.id
        )
        .eq(
          "coach_id",
          coach.id
        )
        .neq(
          "status",
          "removed"
        )
        .order(
          "is_primary",
          {
            ascending:
              false
          }
        )
        .order(
          "assigned_at",
          {
            ascending:
              false
          }
        );

    if(
      error
    ){

      throw error;

    }

    assignments =
      data ||
      [];

  }


  /* =========================================
     CARD
     ========================================= */

  function insertAnchor(){

    const view =
      detailView();

    if(
      !view
    ){

      return null;

    }

    return (

      $(
        "manaV998ClientSummary"
      )

      ||

      $(
        "manaV998ProgramSuite"
      )

      ||

      $(
        "manaV998ClientHero"
      )

      ||

      view.children[
        1
      ]

      ||

      null

    );

  }


  function buildCard(){

    const view =
      detailView();

    if(
      !view
    ){

      return;

    }

    let card =
      $(
        CARD_ID
      );

    if(
      !card
    ){

      card =
        document
          .createElement(
            "section"
          );

      card.id =
        CARD_ID;

      const anchor =
        insertAnchor();

      if(
        anchor
      ){

        anchor
          .insertAdjacentElement(
            "afterend",
            card
          );

      }else{

        view
          .appendChild(
            card
          );

      }

    }

    renderCard();

  }


  function renderCard(){

    const card =
      $(
        CARD_ID
      );

    if(
      !card
    ){

      return;

    }

    const clientName =
      detailClientName();

    const activeAssignment =

      assignments
        .find(
          item =>
            item.is_primary
        )

      ||

      assignments
        .find(
          item =>
            item.status ===
            "active"
        );

    card.innerHTML = `

      <div
        class="m1003-head"
      >

        <div>

          <div
            class="m1003-kicker"
          >
            PROGRAM MANAGEMENT
          </div>

          <div
            class="m1003-title"
          >
            Assigned Programs
          </div>

          <div
            class="m1003-sub"
          >

            ${
              selectedClient?.id

                ? `Manage training delivery for ${esc(
                    clientName
                  )}.`

                : "Open this client from Active Clients to enable assignments."
            }

          </div>

        </div>

        ${
          activeAssignment

            ? `

              <div
                class="m1003-primary-pill"
              >

                ${
                  activeAssignment.is_primary
                    ? "PRIMARY SET"
                    : "ACTIVE"
                }

              </div>

            `

            : ""
        }

      </div>

      <div
        class="m1003-actions"
      >

        <button
          type="button"
          class="m1003-main-btn"
          id="manaV1003AssignButton"
          ${
            selectedClient?.id
              ? ""
              : "disabled"
          }
        >
          ASSIGN SAVED PROGRAM
        </button>

        <button
          type="button"
          class="m1003-secondary-btn"
          id="manaV1003BuildButton"
          ${
            selectedClient?.id
              ? ""
              : "disabled"
          }
        >
          BUILD NEW PROGRAM
        </button>

      </div>

      <div
        class="m1003-list"
        id="manaV1003AssignmentList"
      >

        ${
          assignmentRowsHtml()
        }

      </div>

      <div
        class="m1003-status"
        id="manaV1003Status"
      ></div>

    `;

    bindCardActions();

  }


  function assignmentRowsHtml(){

    if(
      !selectedClient?.id
    ){

      return `

        <div
          class="m1003-empty"
        >
          Return to the coach dashboard and open
          the client from Active Clients. Mana will
          then connect this screen to their Supabase
          user ID.
        </div>

      `;

    }

    if(
      !assignments.length
    ){

      return `

        <div
          class="m1003-empty"
        >
          No custom program is assigned yet.
          Assign one of your saved programs or
          build a new program specifically for
          this client.
        </div>

      `;

    }

    return assignments
      .map(
        assignment => {

          const program =
            assignment.custom_programs;

          const name =
            program?.name ||
            "Custom Program";

          const weeks =
            program?.duration_weeks;

          const status =
            String(
              assignment.status ||
              "active"
            );

          return `

            <article
              class="
                m1003-assignment
                ${
                  assignment.is_primary
                    ? "primary"
                    : ""
                }
              "
            >

              <div
                class="m1003-assignment-top"
              >

                <div>

                  <div
                    class="m1003-assignment-name"
                  >
                    ${esc(
                      name
                    )}
                  </div>

                  <div
                    class="m1003-assignment-meta"
                  >

                    ${
                      weeks

                        ? `${weeks} week${
                            weeks === 1
                              ? ""
                              : "s"
                          }`

                        : "Custom duration"
                    }

                    •

                    ${
                      assignment.is_primary
                        ? "Primary program"
                        : "Additional program"
                    }

                  </div>

                </div>

                <div
                  class="m1003-state"
                >
                  ${esc(
                    status
                  )}
                </div>

              </div>

              <div
                class="m1003-row-actions"
              >

                ${
                  !assignment.is_primary

                  &&

                  status !==
                  "removed"

                    ? `

                      <button
                        type="button"
                        class="
                          m1003-small-btn
                          gold
                        "
                        data-m1003-primary="${assignment.id}"
                      >
                        MAKE PRIMARY
                      </button>

                    `

                    : ""
                }

                ${
                  status ===
                  "active"

                    ? `

                      <button
                        type="button"
                        class="m1003-small-btn"
                        data-m1003-status="${assignment.id}"
                        data-next-status="paused"
                      >
                        PAUSE
                      </button>

                    `

                    : ""
                }

                ${
                  status ===
                  "paused"

                    ? `

                      <button
                        type="button"
                        class="
                          m1003-small-btn
                          gold
                        "
                        data-m1003-status="${assignment.id}"
                        data-next-status="active"
                      >
                        RESUME
                      </button>

                    `

                    : ""
                }

                <button
                  type="button"
                  class="
                    m1003-small-btn
                    danger
                  "
                  data-m1003-remove="${assignment.id}"
                >
                  REMOVE
                </button>

              </div>

            </article>

          `;

        }
      )
      .join(
        ""
      );

  }


  function bindCardActions(){

    const assignButton =
      $(
        "manaV1003AssignButton"
      );

    if(
      assignButton
    ){

      assignButton.onclick =
        openAssignModal;

    }

    const buildButton =
      $(
        "manaV1003BuildButton"
      );

    if(
      buildButton
    ){

      buildButton.onclick =
        () => {

          if(
            !selectedClient?.id
          ){

            return;

          }

          if(
            typeof
              window.openManaProgramBuilder ===
            "function"
          ){

            window
              .openManaProgramBuilder({

                id:
                  selectedClient.id,

                name:
                  detailClientName()

              });

          }else{

            setStatus(
              "Program Builder is not loaded.",
              "bad"
            );

          }

        };

    }

    document
      .querySelectorAll(
        "[data-m1003-primary]"
      )
      .forEach(
        button => {

          button.onclick =
            () =>
              makePrimary(
                button.dataset
                  .m1003Primary
              );

        }
      );

    document
      .querySelectorAll(
        "[data-m1003-status]"
      )
      .forEach(
        button => {

          button.onclick =
            () =>
              updateAssignmentStatus(

                button.dataset
                  .m1003Status,

                button.dataset
                  .nextStatus

              );

        }
      );

    document
      .querySelectorAll(
        "[data-m1003-remove]"
      )
      .forEach(
        button => {

          button.onclick =
            () =>
              removeAssignment(
                button.dataset
                  .m1003Remove
              );

        }
      );

  }


  /* =========================================
     REFRESH
     ========================================= */

  async function refreshData(){

    if(
      !detailOpen()
    ){

      return;

    }

    buildCard();

    if(
      !selectedClient?.id
    ){

      renderCard();

      return;

    }

    setStatus(
      "Loading program assignments…"
    );

    try{

      await Promise
        .all([

          loadSavedPrograms(),

          loadAssignments()

        ]);

      renderCard();

      setStatus(
        ""
      );

    }catch(
      error
    ){

      renderCard();

      setStatus(

        "Could not load program management: "

        +

        (
          error?.message ||
          String(
            error
          )
        ),

        "bad"

      );

    }

  }


  function scheduleRefresh(){

    clearTimers();

    [
      80,
      250,
      700,
      1500
    ]
      .forEach(
        delay => {

          timers.push(

            setTimeout(
              () => {

                if(
                  detailOpen()
                ){

                  wrapOpenClientDetail();

                  buildCard();

                  refreshData();

                }

              },
              delay
            )

          );

        }
      );

  }


  /* =========================================
     ASSIGN MODAL
     ========================================= */

  async function openAssignModal(){

    if(
      !selectedClient?.id
    ){

      setStatus(
        "Open the client again from Active Clients first.",
        "bad"
      );

      return;

    }

    const modal =
      ensureModal();

    modal
      .classList
      .add(
        "open"
      );

    document
      .body
      .style
      .overflow =
        "hidden";

    const content =
      $(
        "manaV1003ModalContent"
      );

    content.innerHTML = `

      <div
        class="m1003-modal-card"
      >

        <h2>
          Assign Program
        </h2>

        <p>
          Loading your saved programs…
        </p>

      </div>

    `;

    try{

      await
        loadSavedPrograms();

      const assignedIds =
        new Set(

          assignments
            .filter(
              item =>
                item.status !==
                "removed"
            )
            .map(
              item =>
                item.program_id
            )

        );

      const options =
        savedPrograms
          .filter(
            program =>
              !assignedIds
                .has(
                  program.id
                )
          );

      content.innerHTML = `

        <div
          class="m1003-modal-card"
        >

          <h2>
            Assign Program
          </h2>

          <p>
            Choose a saved program for
            ${esc(
              detailClientName()
            )}.
            The client will receive it through
            their Programs screen.
          </p>

          <div
            class="m1003-program-options"
          >

            ${
              options.length

                ? options
                    .map(
                      program => `

                        <button
                          type="button"
                          class="m1003-program-option"
                          data-m1003-program="${program.id}"
                        >

                          <div>

                            <strong>
                              ${esc(
                                program.name
                              )}
                            </strong>

                            <small>

                              ${esc(

                                program.goal

                                ||

                                program.description

                                ||

                                "Custom Mana program"

                              )}

                              ${
                                program.duration_weeks

                                  ? ` • ${program.duration_weeks} weeks`

                                  : ""
                              }

                            </small>

                          </div>

                          <span>
                            ASSIGN
                          </span>

                        </button>

                      `
                    )
                    .join(
                      ""
                    )

                : `

                  <div
                    class="m1003-empty"
                  >
                    Every saved program is already
                    assigned to this client, or there
                    are no saved programs yet.
                  </div>

                `
            }

          </div>

          <div
            class="m1003-actions"
            style="
              margin-top:15px
            "
          >

            <button
              type="button"
              class="m1003-secondary-btn"
              id="manaV1003ModalBuild"
            >
              BUILD NEW PROGRAM
            </button>

          </div>

        </div>

      `;

      content
        .querySelectorAll(
          "[data-m1003-program]"
        )
        .forEach(
          button => {

            button.onclick =
              () =>
                assignProgram(
                  button.dataset
                    .m1003Program
                );

          }
        );

      $(
        "manaV1003ModalBuild"
      ).onclick =
        () => {

          closeModal();

          if(
            typeof
              window.openManaProgramBuilder ===
            "function"
          ){

            window
              .openManaProgramBuilder({

                id:
                  selectedClient.id,

                name:
                  detailClientName()

              });

          }

        };

    }catch(
      error
    ){

      content.innerHTML = `

        <div
          class="m1003-modal-card"
        >

          <h2>
            Assign Program
          </h2>

          <div
            class="m1003-empty"
          >
            Could not load programs:
            ${esc(
              error?.message ||
              String(
                error
              )
            )}
          </div>

        </div>

      `;

    }

  }


  /* =========================================
     ASSIGN PROGRAM
     ========================================= */

  async function assignProgram(
    programId
  ){

    if(
      !selectedClient?.id

      ||

      !programId
    ){

      return;

    }

    const content =
      $(
        "manaV1003ModalContent"
      );

    if(
      content
    ){

      content.innerHTML = `

        <div
          class="m1003-modal-card"
        >

          <h2>
            Assigning…
          </h2>

          <p>
            Connecting the program to
            ${esc(
              detailClientName()
            )}.
          </p>

        </div>

      `;

    }

    try{

      const client =
        await sb();

      const coach =
        await currentCoach();

      const hasPrimary =
        assignments
          .some(
            item =>

              item.is_primary

              &&

              item.status !==
              "removed"
          );

      const {
        error
      } =
        await client
          .from(
            "client_program_assignments"
          )
          .upsert({

            client_id:
              selectedClient.id,

            coach_id:
              coach.id,

            program_id:
              programId,

            status:
              "active",

            is_primary:
              !hasPrimary,

            start_date:
              new Date()
                .toISOString()
                .slice(
                  0,
                  10
                ),

            updated_at:
              new Date()
                .toISOString()

          },
          {
            onConflict:
              "client_id,program_id"
          }
          );

      if(
        error
      ){

        throw error;

      }

      closeModal();

      await
        refreshData();

      setStatus(
        "Program assigned. It is now available on the client side ✓",
        "good"
      );

      if(
        typeof
          window.refreshManaAssignedPrograms ===
        "function"
      ){

        window
          .refreshManaAssignedPrograms();

      }

    }catch(
      error
    ){

      closeModal();

      setStatus(

        "Could not assign program: "

        +

        (
          error?.message ||
          String(
            error
          )
        ),

        "bad"

      );

    }

  }


  /* =========================================
     MAKE PRIMARY
     ========================================= */

  async function makePrimary(
    assignmentId
  ){

    if(
      !selectedClient?.id

      ||

      !assignmentId
    ){

      return;

    }

    setStatus(
      "Updating primary program…"
    );

    try{

      const client =
        await sb();

      const coach =
        await currentCoach();

      const {
        error:
          clearError
      } =
        await client
          .from(
            "client_program_assignments"
          )
          .update({

            is_primary:
              false,

            updated_at:
              new Date()
                .toISOString()

          })
          .eq(
            "client_id",
            selectedClient.id
          )
          .eq(
            "coach_id",
            coach.id
          );

      if(
        clearError
      ){

        throw clearError;

      }

      const {
        error
      } =
        await client
          .from(
            "client_program_assignments"
          )
          .update({

            is_primary:
              true,

            status:
              "active",

            updated_at:
              new Date()
                .toISOString()

          })
          .eq(
            "id",
            assignmentId
          )
          .eq(
            "coach_id",
            coach.id
          );

      if(
        error
      ){

        throw error;

      }

      await
        refreshData();

      setStatus(
        "Primary program updated ✓",
        "good"
      );

    }catch(
      error
    ){

      setStatus(

        "Could not update primary program: "

        +

        (
          error?.message ||
          String(
            error
          )
        ),

        "bad"

      );

    }

  }


  /* =========================================
     PAUSE / RESUME
     ========================================= */

  async function updateAssignmentStatus(
    assignmentId,
    nextStatus
  ){

    if(
      !assignmentId

      ||

      ![
        "active",
        "paused"
      ]
        .includes(
          nextStatus
        )
    ){

      return;

    }

    setStatus(

      nextStatus ===
      "paused"

        ? "Pausing program…"

        : "Resuming program…"

    );

    try{

      const client =
        await sb();

      const coach =
        await currentCoach();

      const {
        error
      } =
        await client
          .from(
            "client_program_assignments"
          )
          .update({

            status:
              nextStatus,

            updated_at:
              new Date()
                .toISOString()

          })
          .eq(
            "id",
            assignmentId
          )
          .eq(
            "coach_id",
            coach.id
          );

      if(
        error
      ){

        throw error;

      }

      await
        refreshData();

      setStatus(

        nextStatus ===
        "paused"

          ? "Program paused ✓"

          : "Program resumed ✓",

        "good"

      );

    }catch(
      error
    ){

      setStatus(

        "Could not update program: "

        +

        (
          error?.message ||
          String(
            error
          )
        ),

        "bad"

      );

    }

  }


  /* =========================================
     REMOVE
     ========================================= */

  async function removeAssignment(
    assignmentId
  ){

    if(
      !assignmentId
    ){

      return;

    }

    const assignment =
      assignments
        .find(
          item =>
            item.id ===
            assignmentId
        );

    const programName =
      assignment
        ?.custom_programs
        ?.name
      ||
      "this program";

    const confirmed =
      window.confirm(

        `Remove ${programName} from ${detailClientName()}?`

      );

    if(
      !confirmed
    ){

      return;

    }

    setStatus(
      "Removing program…"
    );

    try{

      const client =
        await sb();

      const coach =
        await currentCoach();

      const {
        error
      } =
        await client
          .from(
            "client_program_assignments"
          )
          .update({

            status:
              "removed",

            is_primary:
              false,

            updated_at:
              new Date()
                .toISOString()

          })
          .eq(
            "id",
            assignmentId
          )
          .eq(
            "coach_id",
            coach.id
          );

      if(
        error
      ){

        throw error;

      }

      await
        refreshData();

      setStatus(
        "Program removed from client ✓",
        "good"
      );

    }catch(
      error
    ){

      setStatus(

        "Could not remove program: "

        +

        (
          error?.message ||
          String(
            error
          )
        ),

        "bad"

      );

    }

  }


  /* =========================================
     INIT
     ========================================= */

  function bindNav(){

    document
      .querySelector(
        '#bottomNav [data-page="home"]'
      )
      ?.addEventListener(
        "click",
        () => {

          setTimeout(
            wrapOpenClientDetail,
            120
          );

        }
      );

  }


  function init(){

    installStyles();

    ensureModal();

    bindClientCapture();

    wrapOpenClientDetail();

    bindNav();

    [
      220,
      750,
      1600,
      3000
    ]
      .forEach(
        delay => {

          setTimeout(
            () => {

              wrapOpenClientDetail();

              if(
                detailOpen()
              ){

                if(
                  selectedClient
                ){

                  selectedClient.name =
                    detailClientName();

                  rememberClient(
                    selectedClient
                  );

                }

                buildCard();

                refreshData();

              }

            },
            delay
          );

        }
      );

    window
      .refreshManaClientProgramAssignments =
        refreshData;

    window
      .MANA_CLIENT_PROGRAM_ASSIGNMENT_BUILD =
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
