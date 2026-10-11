/* =========================================
   MANA MOVEMENT TRAINING v10.07.0
   SMOOTH COACH PROGRAM BUILDER

   REQUIRES:
   - v10_00_custom_program_schema_100000.sql
   - existing Mana Supabase client

   DESIGNED TO WORK WITH:
   - v10_02_client_custom_programs_100200.js
   - v10_03_coach_client_assignment_100300.js

   FEATURES
   - Fast exercise search + category filters
   - Tap-to-add exercises
   - Duplicate / move / remove exercises
   - Copy workout to another day
   - Copy full week forward
   - Simple sets / reps / rest / RPE inputs
   - Optional coach notes
   - Save reusable programs
   - Save + assign directly to selected client
   - Mobile + laptop friendly
   ========================================= */

(() => {
  "use strict";

  const BUILD = "100700";
  const STYLE_ID = "mana-v1007-program-builder-style";
  const MODAL_ID = "manaV1007ProgramBuilder";
  const CLIENT_SESSION_KEY = "mana-v1003-selected-client";

  let library = [];
  let draft = newDraft();
  let activeWeek = 1;
  let activeDay = 1;
  let activeCategory = "ALL";
  let selectedClient = null;
  let searchText = "";
  let mobilePanel = "library";

  const $ = id => document.getElementById(id);

  function newDraft(){
    return {
      id: null,
      name: "Custom Training Program",
      description: "",
      goal: "",
      durationWeeks: 4,
      days: {}
    };
  }

  function dayKey(week,day){
    return `${week}-${day}`;
  }

  function freshDay(week,day){
    return {
      week,
      day,
      title:`Workout ${day}`,
      type:"Strength",
      minutes:45,
      notes:"",
      exercises:[]
    };
  }

  function ensureDay(week=activeWeek,day=activeDay){
    const key = dayKey(week,day);
    if(!draft.days[key]){
      draft.days[key] = freshDay(week,day);
    }
    return draft.days[key];
  }

  function cloneExercise(exercise){
    return {
      exercise_id: exercise.exercise_id || null,
      name: exercise.name || "Exercise",
      sets: exercise.sets ?? 3,
      reps: exercise.reps ?? "8–12",
      rest: exercise.rest ?? 60,
      rpe: exercise.rpe ?? "",
      notes: exercise.notes ?? ""
    };
  }

  function cloneDay(source,week,day){
    return {
      week,
      day,
      title: source.title || `Workout ${day}`,
      type: source.type || "Strength",
      minutes: Number(source.minutes || 45),
      notes: source.notes || "",
      exercises: (source.exercises || []).map(cloneExercise)
    };
  }

  function esc(value){
    return String(value ?? "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  function normaliseText(value){
    return String(value ?? "").trim().toLowerCase();
  }

  function selectedClientFromSession(){
    try{
      const parsed = JSON.parse(
        sessionStorage.getItem(CLIENT_SESSION_KEY) || "null"
      );

      if(parsed?.id){
        return {
          id:String(parsed.id),
          name:String(parsed.name || "Client")
        };
      }
    }catch(_){}

    return null;
  }

  async function sb(){
    if(typeof window.supabaseClient === "function"){
      return await window.supabaseClient();
    }

    throw new Error(
      "Mana Supabase client is not available."
    );
  }

  async function coachUser(){
    const c = await sb();

    const {
      data,
      error
    } = await c.auth.getUser();

    if(error){
      throw error;
    }

    if(!data?.user){
      throw new Error(
        "Coach session not found."
      );
    }

    return data.user;
  }

  function installStyles(){
    if($(STYLE_ID)){
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      STYLE_ID;

    style.textContent = `
      #${MODAL_ID}{
        position:fixed;
        inset:0;
        z-index:60000;
        display:none;
        overflow:auto;
        background:#050505;
        color:#fff;
        padding:0 18px 40px;
      }

      #${MODAL_ID}.open{
        display:block;
      }

      .m104-shell{
        width:min(1320px,100%);
        margin:0 auto;
      }

      .m104-top{
        position:sticky;
        top:0;
        z-index:20;
        display:flex;
        justify-content:space-between;
        gap:12px;
        align-items:center;
        padding:14px 0 12px;
        background:rgba(5,5,5,.97);
        backdrop-filter:blur(8px);
        border-bottom:1px solid #171717;
      }

      .m104-brand{
        color:#f0cf62;
        font-size:11px;
        font-weight:950;
        letter-spacing:.15em;
      }

      .m104-sub{
        font-size:11px;
        color:#747474;
        margin-top:4px;
      }

      .m104-close,
      .m104-btn,
      .m104-gold,
      .m104-soft,
      .m104-danger,
      .m104-add{
        min-height:42px;
        border-radius:13px;
        font-weight:900;
        cursor:pointer;
        font:inherit;
      }

      .m104-close,
      .m104-soft{
        border:1px solid #303030;
        background:#0d0d0d;
        color:#d2d2d2;
        padding:0 14px;
      }

      .m104-gold,
      .m104-btn{
        border:1px solid #ad8f2e;
        background:linear-gradient(
          135deg,
          #f5dc78,
          #c49a29
        );
        color:#111;
        padding:0 15px;
      }

      .m104-danger{
        border:1px solid #4b2929;
        background:#130a0a;
        color:#d49696;
        padding:0 11px;
      }

      .m104-grid{
        display:grid;
        grid-template-columns:
          minmax(300px,.82fr)
          minmax(0,1.95fr);
        gap:16px;
        padding-top:16px;
        align-items:start;
      }

      .m105-builder-grid{
        display:grid;
        grid-template-columns:
          minmax(500px,1.55fr)
          minmax(300px,.88fr);
        gap:16px;
        align-items:start;
      }

      .m105-program-map{
        position:sticky;
        top:82px;
        max-height:calc(
          100vh - 104px
        );
        overflow:auto;
        border:1px solid #242424;
        border-radius:18px;
        background:linear-gradient(
          180deg,
          #090909,
          #060606
        );
        padding:14px;
        scrollbar-width:thin;
      }

      .m105-map-head{
        display:flex;
        justify-content:space-between;
        align-items:flex-end;
        gap:8px;
        margin-bottom:9px;
      }

      .m105-map-head h4{
        margin:0;
        font-size:17px;
      }

      .m105-map-head span{
        color:#74672f;
        font-size:8px;
        font-weight:950;
        letter-spacing:.1em;
      }

      .m105-map-week{
        border:1px solid #202020;
        border-radius:14px;
        background:#090909;
        margin:0 0 10px;
        overflow:hidden;
      }

      .m105-map-week-title{
        padding:8px 9px;
        color:#e5cb67;
        background:#0d0c08;
        border-bottom:1px solid #1e1d16;
        font-size:9px;
        font-weight:950;
        letter-spacing:.08em;
      }

      .m105-map-day{
        width:100%;
        text-align:left;
        border:0;
        border-bottom:1px solid #171717;
        background:transparent;
        color:#ddd;
        padding:8px 10px;
        cursor:pointer;
        transition:.15s ease;
      }

      .m105-map-day:hover{
        background:#10100d;
      }

      .m105-map-day:last-child{
        border-bottom:0;
      }

      .m105-map-day.active{
        background:#151208;
      }

      .m105-map-day-top{
        display:flex;
        justify-content:space-between;
        gap:8px;
        align-items:center;
      }

      .m105-map-day strong{
        font-size:10px;
        line-height:1.25;
      }

      .m105-map-day small{
        font-size:8px;
        color:#777;
        white-space:nowrap;
      }

      .m105-map-exercises{
        color:#8a8a8a;
        font-size:9px;
        margin-top:4px;
        line-height:1.35;
      }

      .m105-map-empty{
        color:#555;
        font-size:9px;
        font-style:italic;
        margin-top:4px;
      }

      .m105-mobile-tabs{
        display:none;
      }

      .m104-card{
        border:1px solid #242424;
        border-radius:20px;
        background:linear-gradient(
          180deg,
          #0b0b0b,
          #080808
        );
        padding:18px;
        box-shadow:
          0 10px 35px
          rgba(0,0,0,.18);
      }

      .m104-card h3{
        margin:0 0 10px;
        font-size:19px;
      }

      .m104-label{
        display:block;
        color:#777;
        font-size:9px;
        font-weight:950;
        letter-spacing:.09em;
        text-transform:uppercase;
        margin-bottom:6px;
      }

      .m104-field{
        margin-bottom:10px;
      }

      .m104-input,
      .m104-select,
      .m104-textarea{
        width:100%;
        box-sizing:border-box;
        border:1px solid #2b2b2b;
        border-radius:12px;
        background:#060606;
        color:#fff;
        padding:11px 12px;
        font:inherit;
        outline:none;
      }

      .m104-input:focus,
      .m104-select:focus,
      .m104-textarea:focus{
        border-color:#786523;
        box-shadow:
          0 0 0 2px
          rgba(240,207,98,.07);
      }

      .m104-textarea{
        min-height:70px;
        resize:vertical;
      }

      .m104-row{
        display:flex;
        gap:8px;
        align-items:center;
      }

      .m104-row>*{
        min-width:0;
      }

      .m104-search-wrap{
        position:sticky;
        top:78px;
        z-index:8;
        background:#0a0a0a;
        padding-bottom:10px;
      }

      .m104-toolbar{
        display:flex;
        gap:6px;
        overflow:auto;
        padding:2px 0 8px;
      }

      .m104-chip{
        flex:0 0 auto;
        border:1px solid #313131;
        background:#0c0c0c;
        color:#999;
        border-radius:999px;
        padding:8px 10px;
        font-size:9px;
        font-weight:950;
        cursor:pointer;
      }

      .m104-chip.active{
        border-color:#756221;
        background:#181407;
        color:#f0cf62;
      }

      .m104-library{
        max-height:calc(
          100vh - 310px
        );
        overflow:auto;
        padding-right:4px;
        scrollbar-width:thin;
      }

      .m104-count{
        color:#666;
        font-size:9px;
        font-weight:900;
        letter-spacing:.08em;
        text-transform:uppercase;
        padding:3px 0 6px;
      }

      .m104-ex{
        display:flex;
        justify-content:space-between;
        gap:12px;
        align-items:center;
        padding:12px 4px;
        border-bottom:1px solid #1e1e1e;
      }

      .m104-ex:last-child{
        border-bottom:0;
      }

      .m104-ex strong{
        font-size:13px;
        display:block;
      }

      .m104-ex small{
        display:block;
        color:#737373;
        margin-top:4px;
        line-height:1.35;
      }

      .m104-add{
        flex:0 0 auto;
        border:1px solid #5f4f1d;
        background:#161306;
        color:#f0cf62;
        padding:0 12px;
      }

      .m104-added{
        color:#6fbd88!important;
        border-color:#31563d!important;
        background:#0b160f!important;
      }

      .m104-create{
        margin-top:12px;
        padding-top:12px;
        border-top:1px solid #202020;
      }

      .m104-create summary{
        cursor:pointer;
        color:#aaa;
        font-size:11px;
        font-weight:900;
        list-style:none;
      }

      .m104-create
      summary::-webkit-details-marker{
        display:none;
      }

      .m104-client{
        display:inline-flex;
        align-items:center;
        gap:6px;
        border:1px solid #57491c;
        background:#171306;
        color:#f0cf62;
        border-radius:999px;
        padding:5px 8px;
        font-size:10px;
        font-weight:900;
      }

      .m104-program-head{
        display:flex;
        justify-content:space-between;
        align-items:flex-start;
        gap:12px;
        margin-bottom:12px;
      }

      .m104-section-title{
        font-size:12px;
        font-weight:950;
        margin:14px 0 8px;
        color:#cfcfcf;
      }

      .m104-weekbar,
      .m104-daybar{
        display:flex;
        gap:6px;
        overflow:auto;
        padding-bottom:5px;
      }

      .m104-daybar{
        margin-top:6px;
      }

      .m104-workout-tools{
        display:flex;
        gap:7px;
        flex-wrap:wrap;
        margin:9px 0 3px;
      }

      .m104-tool{
        border:1px solid #303030;
        background:#0b0b0b;
        color:#aaa;
        border-radius:11px;
        padding:8px 10px;
        font-size:9px;
        font-weight:900;
        cursor:pointer;
      }

      .m104-tool:hover{
        color:#fff;
        border-color:#555;
      }

      .m104-list{
        display:grid;
        gap:9px;
        margin-top:12px;
      }

      .m104-built{
        border:1px solid #292929;
        border-radius:15px;
        background:#070707;
        padding:12px;
      }

      .m104-built-head{
        display:flex;
        justify-content:space-between;
        gap:10px;
        align-items:center;
      }

      .m104-built-name{
        font-weight:900;
        font-size:13px;
      }

      .m104-built-actions{
        display:flex;
        gap:5px;
        flex-wrap:wrap;
        justify-content:flex-end;
      }

      .m104-icon{
        border:1px solid #292929;
        background:#0b0b0b;
        color:#999;
        border-radius:9px;
        min-width:32px;
        height:32px;
        padding:0 8px;
        cursor:pointer;
        font-weight:900;
      }

      .m104-icon:hover{
        color:#fff;
        border-color:#555;
      }

      .m104-icon.remove{
        color:#a86f6f;
      }

      .m104-mini{
        display:grid;
        grid-template-columns:
          72px
          minmax(120px,1fr)
          88px
          78px;
        gap:7px;
        margin-top:9px;
      }

      .m104-mini input{
        width:100%;
        box-sizing:border-box;
        border:1px solid #292929;
        border-radius:10px;
        background:#050505;
        color:#fff;
        padding:9px;
      }

      .m104-note{
        margin-top:7px;
      }

      .m104-empty{
        color:#777;
        font-size:12px;
        padding:16px 2px;
        line-height:1.5;
      }

      .m104-actions{
        position:static;
        display:flex;
        gap:10px;
        flex-wrap:wrap;
        margin-top:18px;
        padding:0;
        background:none;
      }

      .m104-actions
      .m104-soft,
      .m104-actions
      .m104-gold{
        min-width:160px;
      }

      .m104-status{
        min-height:20px;
        color:#888;
        font-size:11px;
        margin-top:7px;
      }

      .m104-status.good{
        color:#83c69a;
      }

      .m104-status.bad{
        color:#d68c8c;
      }

      .m104-workout-summary{
        display:flex;
        gap:8px;
        flex-wrap:wrap;
        color:#777;
        font-size:10px;
        margin-top:7px;
      }

      .m104-badge{
        border:1px solid #292929;
        border-radius:999px;
        padding:5px 8px;
        background:#090909;
      }

      .m106-editor-block{
        border:1px solid #202020;
        border-radius:16px;
        background:#080808;
        padding:14px;
        margin-top:12px;
      }

      .m106-editor-block:first-of-type{
        margin-top:0;
      }

      .m106-section-kicker{
        font-size:9px;
        font-weight:950;
        letter-spacing:.1em;
        color:#7e6b29;
        margin-bottom:8px;
        text-transform:uppercase;
      }

      .m106-program-meta{
        display:grid;
        grid-template-columns:
          minmax(0,1fr)
          120px;
        gap:10px;
      }

      @media(min-width:1400px){

        #${MODAL_ID}{
          padding-left:22px;
          padding-right:22px;
        }

        .m104-grid{
          grid-template-columns:
            minmax(340px,.72fr)
            minmax(0,2.55fr);
          gap:18px;
        }

        .m105-builder-grid{
          grid-template-columns:
            minmax(620px,1.9fr)
            minmax(340px,.82fr);
          gap:18px;
        }

        .m104-card{
          padding:20px;
        }

      }

      @media(max-width:1080px){

        .m105-builder-grid{
          grid-template-columns:1fr;
        }

        .m105-program-map{
          position:static;
          max-height:none;
        }

      }

      @media(max-width:820px){

        #${MODAL_ID}{
          padding:
            0 8px
            calc(
              82px +
              env(
                safe-area-inset-bottom
              )
            );
          overflow-x:hidden;
        }

        .m104-shell{
          width:100%;
          max-width:100%;
          overflow-x:hidden;
        }

        .m104-grid{
          display:block;
          padding-top:9px;
        }

        .m104-card{
          padding:12px;
          border-radius:15px;
          overflow:hidden;
          margin-bottom:9px;
        }

        .m104-library{
          max-height:none;
          overflow:visible;
        }

        .m104-search-wrap{
          position:static;
          top:auto;
        }

        .m104-program-head{
          display:block;
        }

        .m104-top{
          align-items:flex-start;
          padding:10px 0 9px;
        }

        .m104-top button{
          flex:0 0 auto;
          min-height:38px;
        }

        .m104-row{
          flex-direction:column;
          align-items:stretch;
        }

        .m104-row > *{
          width:100%!important;
          max-width:none!important;
          flex:1 1 auto!important;
        }

        .m104-mini{
          grid-template-columns:
            1fr 1fr;
        }

        .m104-built-head{
          align-items:flex-start;
          flex-direction:column;
        }

        .m104-built-actions{
          width:100%;
          justify-content:flex-start;
        }

        .m104-weekbar,
        .m104-daybar,
        .m104-workout-tools{
          padding-bottom:2px;
          -webkit-overflow-scrolling:
            touch;
        }

        .m104-actions{
          position:static;
          padding-top:10px;
          background:none;
        }

        .m104-actions
        .m104-gold,
        .m104-actions
        .m104-soft{
          flex:1 1 100%;
          width:100%;
        }

        .m105-builder-grid{
          display:block;
        }

        .m105-program-map{
          position:static;
          max-height:none;
          border-radius:15px;
        }

        .m105-panel{
          display:none;
        }

        .m105-panel.mobile-active{
          display:block;
        }

        .m105-mobile-tabs{
          position:fixed;
          left:8px;
          right:8px;
          bottom:
            calc(
              8px +
              env(
                safe-area-inset-bottom
              )
            );
          z-index:61010;
          display:grid;
          grid-template-columns:
            repeat(3,1fr);
          gap:6px;
          padding:6px;
          background:
            rgba(7,7,7,.97);
          border:
            1px solid #282828;
          border-radius:16px;
          box-shadow:
            0 12px 35px
            rgba(0,0,0,.55);
          backdrop-filter:
            blur(10px);
        }

        .m105-mobile-tab{
          min-height:46px;
          border:
            1px solid #2d2d2d;
          border-radius:12px;
          background:#0c0c0c;
          color:#888;
          font-size:9px;
          font-weight:950;
          letter-spacing:.05em;
        }

        .m105-mobile-tab.active{
          border-color:#756221;
          background:#181407;
          color:#f0cf62;
        }

        .m105-mobile-count{
          display:block;
          font-size:8px;
          color:#666;
          margin-top:2px;
        }

        .m105-mobile-tab.active
        .m105-mobile-count{
          color:#aa9140;
        }

      }

      @media(max-width:560px){

        .m104-card h3{
          font-size:16px;
        }

        .m104-brand{
          font-size:9px;
          letter-spacing:.11em;
        }

        .m104-sub{
          font-size:9px;
        }

        .m104-input,
        .m104-select,
        .m104-textarea{
          padding:10px 11px;
          font-size:16px;
        }

        .m104-chip{
          padding:8px 9px;
          font-size:8px;
        }

        .m104-mini{
          grid-template-columns:
            1fr 1fr;
        }

        .m104-built{
          padding:10px;
        }

        .m104-close,
        .m104-add,
        .m104-soft,
        .m104-gold,
        .m104-icon{
          min-height:40px;
        }

        .m104-ex{
          padding:10px 1px;
        }

        .m104-ex strong{
          font-size:13px;
        }

        .m104-ex small{
          font-size:10px;
        }

      }
    `;

    document.head.appendChild(
      style
    );
  }

  function ensureModal(){
    installStyles();

    let modal =
      $(MODAL_ID);

    if(modal){
      return modal;
    }

    modal =
      document.createElement(
        "div"
      );

    modal.id =
      MODAL_ID;

    modal.innerHTML = `
      <div class="m104-shell">

        <div class="m104-top">

          <div>

            <div class="m104-brand">
              MANA COACH • PROGRAM BUILDER
            </div>

            <div class="m104-sub">
              Build fast. Keep the client experience simple.
            </div>

          </div>

          <button
            type="button"
            class="m104-close"
            id="m104Close"
          >
            CLOSE
          </button>

        </div>

        <div id="m104Content"></div>

      </div>
    `;

    document.body.appendChild(
      modal
    );

    $("m104Close").onclick =
      closeBuilder;

    return modal;
  }

  async function loadLibrary(){
    const c =
      await sb();

    const {
      data,
      error
    } = await c
      .from(
        "exercise_library"
      )
      .select("*")
      .eq(
        "is_active",
        true
      )
      .order(
        "name"
      );

    if(error){
      throw error;
    }

    library =
      data || [];
  }

  function categoryOptions(){
    return [
      "ALL",
      ...new Set(
        library
          .map(
            item =>
              String(
                item?.category ||
                ""
              ).trim()
          )
          .filter(Boolean)
      )
    ];
  }

  function totalExercises(){
    return Object
      .values(
        draft.days
      )
      .reduce(
        (
          sum,
          day
        ) =>
          sum +
          (
            Array.isArray(
              day.exercises
            )
              ? day.exercises.length
              : 0
          ),
        0
      );
  }

  function completedDays(){
    return Object
      .values(
        draft.days
      )
      .filter(
        day =>
          Array.isArray(
            day.exercises
          ) &&
          day.exercises.length
      )
      .length;
  }

  function render(){
    const content =
      $("m104Content");

    if(!content){
      return;
    }

    const day =
      ensureDay();

    const weeks =
      Array.from(
        {
          length:
            Math.max(
              1,
              Number(
                draft.durationWeeks
              ) ||
              1
            )
        },
        (
          _,
          i
        ) =>
          i + 1
      );

    content.innerHTML = `
      <div class="m104-grid">

        <section
          class="m104-card m105-panel"
          id="m105LibraryPanel"
        >

          <div class="m104-search-wrap">

            <h3>
              Exercise Library
            </h3>

            <div class="m104-field">

              <input
                id="m104Search"
                class="m104-input"
                value="${esc(searchText)}"
                placeholder="Search exercise, muscle or equipment"
                autocomplete="off"
              >

            </div>

            <div
              class="m104-toolbar"
              id="m104Categories"
            >

              ${categoryOptions()
                .map(
                  cat => `
                    <button
                      type="button"
                      class="
                        m104-chip
                        ${
                          normaliseText(
                            cat
                          ) ===
                          normaliseText(
                            activeCategory
                          )
                            ? "active"
                            : ""
                        }
                      "
                      data-cat="${esc(cat)}"
                    >
                      ${esc(cat)}
                    </button>
                  `
                )
                .join("")
              }

            </div>

          </div>

          <div
            class="m104-library"
            id="m104Library"
          ></div>

          <details class="m104-create">

            <summary>
              ＋ Add a new exercise to the library
            </summary>

            <div
              style="padding-top:10px"
            >

              <div class="m104-field">

                <input
                  id="m104NewName"
                  class="m104-input"
                  placeholder="Exercise name"
                >

              </div>

              <div class="m104-row">

                <input
                  id="m104NewCategory"
                  class="m104-input"
                  placeholder="Category"
                >

                <input
                  id="m104NewEquipment"
                  class="m104-input"
                  placeholder="Equipment"
                >

              </div>

              <button
                type="button"
                class="m104-add"
                id="m104CreateExercise"
                style="margin-top:9px"
              >
                ADD TO LIBRARY
              </button>

            </div>

          </details>

        </section>

        <section
          class="m104-card m105-panel"
          id="m105WorkoutPanel"
        >

          <div class="m105-builder-grid">

            <div>

              <div class="m104-program-head">

                <div>

                  <h3
                    style="margin-bottom:4px"
                  >
                    Custom Program
                  </h3>

                  ${
                    selectedClient
                      ? `
                        <span class="m104-client">
                          CLIENT •
                          ${esc(
                            selectedClient.name
                          )}
                        </span>
                      `
                      : `
                        <div class="m104-sub">
                          Save this as a reusable coach program.
                        </div>
                      `
                  }

                  <div class="m104-workout-summary">

                    <span class="m104-badge">
                      ${completedDays()}
                      workouts built
                    </span>

                    <span class="m104-badge">
                      ${totalExercises()}
                      exercises
                    </span>

                  </div>

                </div>

              </div>

              <div class="m106-editor-block">

                <div class="m106-section-kicker">
                  Program details
                </div>

                <div class="m104-field">

                  <label class="m104-label">
                    Program name
                  </label>

                  <input
                    id="m104ProgramName"
                    class="m104-input"
                    value="${esc(
                      draft.name
                    )}"
                  >

                </div>

                <div class="m104-row">

                  <div
                    class="m104-field"
                    style="flex:1"
                  >

                    <label class="m104-label">
                      Goal
                    </label>

                    <input
                      id="m104Goal"
                      class="m104-input"
                      value="${esc(
                        draft.goal
                      )}"
                      placeholder="Strength, fat loss, return to training..."
                    >

                  </div>

                  <div
                    class="m104-field"
                    style="width:110px"
                  >

                    <label class="m104-label">
                      Weeks
                    </label>

                    <input
                      id="m104Weeks"
                      class="m104-input"
                      type="number"
                      min="1"
                      max="52"
                      value="${
                        draft.durationWeeks
                      }"
                    >

                  </div>

                </div>

                <details>

                  <summary
                    style="
                      cursor:pointer;
                      color:#999;
                      font-size:10px;
                      font-weight:900;
                      margin-bottom:10px
                    "
                  >
                    ＋ Program description
                  </summary>

                  <div class="m104-field">

                    <textarea
                      id="m104Description"
                      class="m104-textarea"
                      placeholder="Optional overview for the client"
                    >${esc(
                      draft.description
                    )}</textarea>

                  </div>

                </details>

              </div>

              <div class="m106-editor-block">

                <div class="m106-section-kicker">
                  Schedule
                </div>

                <div
                  class="m104-section-title"
                  style="margin-top:0"
                >
                  Choose week and day
                </div>

                <div class="m104-weekbar">

                  ${weeks
                    .map(
                      week => `
                        <button
                          type="button"
                          class="
                            m104-chip
                            ${
                              week ===
                              activeWeek
                                ? "active"
                                : ""
                            }
                          "
                          data-week="${week}"
                        >
                          WEEK ${week}
                        </button>
                      `
                    )
                    .join("")
                  }

                </div>

                <div class="m104-daybar">

                  ${[
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7
                  ]
                    .map(
                      dayNumber => `
                        <button
                          type="button"
                          class="
                            m104-chip
                            ${
                              dayNumber ===
                              activeDay
                                ? "active"
                                : ""
                            }
                          "
                          data-day="${dayNumber}"
                        >
                          DAY ${dayNumber}
                        </button>
                      `
                    )
                    .join("")
                  }

                </div>

              </div>

              <div class="m106-editor-block">

                <div class="m106-section-kicker">
                  Workout
                </div>

                <div
                  class="m104-section-title"
                  style="margin-top:0"
                >
                  Workout details
                </div>

                <div class="m104-row">

                  <input
                    id="m104DayTitle"
                    class="m104-input"
                    value="${esc(
                      day.title
                    )}"
                    placeholder="Workout title"
                  >

                  <select
                    id="m104DayType"
                    class="m104-select"
                    style="max-width:150px"
                  >

                    ${[
                      "Strength",
                      "Conditioning",
                      "Mobility",
                      "Recovery",
                      "Mixed",
                      "Rest"
                    ]
                      .map(
                        type => `
                          <option
                            ${
                              type ===
                              day.type
                                ? "selected"
                                : ""
                            }
                          >
                            ${type}
                          </option>
                        `
                      )
                      .join("")
                    }

                  </select>

                  <input
                    id="m104Minutes"
                    class="m104-input"
                    type="number"
                    min="1"
                    max="300"
                    value="${
                      Number(
                        day.minutes ||
                        45
                      )
                    }"
                    placeholder="Min"
                    style="max-width:82px"
                  >

                </div>

                <div class="m104-workout-tools">

                  <button
                    type="button"
                    class="m104-tool"
                    id="m104CopyNextDay"
                  >
                    COPY → NEXT DAY
                  </button>

                  <button
                    type="button"
                    class="m104-tool"
                    id="m104CopyWeek"
                  >
                    COPY WEEK → NEXT WEEK
                  </button>

                  <button
                    type="button"
                    class="m104-tool"
                    id="m104ClearDay"
                  >
                    CLEAR DAY
                  </button>

                </div>

                <details
                  style="margin-top:8px"
                >

                  <summary
                    style="
                      cursor:pointer;
                      color:#777;
                      font-size:10px;
                      font-weight:900
                    "
                  >
                    ＋ Workout notes
                  </summary>

                  <textarea
                    id="m104DayNotes"
                    class="m104-textarea"
                    style="margin-top:8px"
                    placeholder="Optional warm-up, tempo, coaching or session notes"
                  >${esc(
                    day.notes ||
                    ""
                  )}</textarea>

                </details>

              </div>

              <div class="m106-editor-block">

                <div class="m106-section-kicker">
                  Exercises
                </div>

                <div
                  class="m104-list"
                  id="m104BuiltList"
                ></div>

                <div class="m104-actions">

                  <button
                    type="button"
                    class="m104-soft"
                    id="m104Save"
                  >
                    SAVE PROGRAM
                  </button>

                  ${
                    selectedClient
                      ? `
                        <button
                          type="button"
                          class="m104-gold"
                          id="m104Assign"
                        >
                          SAVE + ASSIGN TO
                          ${esc(
                            selectedClient.name
                          ).toUpperCase()}
                        </button>
                      `
                      : ""
                  }

                </div>

                <div
                  class="m104-status"
                  id="m104Status"
                ></div>

              </div>

            </div>

            <aside
              class="m105-program-map"
              id="m105ProgramMap"
            ></aside>

          </div>

        </section>

        <section
          class="m104-card m105-panel"
          id="m105ProgramPanel"
          style="display:none"
        >

          <div
            class="m105-program-map"
            id="m105ProgramMapMobile"
            style="
              position:static;
              max-height:none
            "
          ></div>

        </section>

      </div>

      <nav
        class="m105-mobile-tabs"
        id="m105MobileTabs"
      >

        <button
          type="button"
          class="m105-mobile-tab"
          data-mobile-panel="library"
        >
          EXERCISES

          <span class="m105-mobile-count">
            ${library.length} library
          </span>

        </button>

        <button
          type="button"
          class="m105-mobile-tab"
          data-mobile-panel="workout"
        >
          WORKOUT

          <span class="m105-mobile-count">
            W${activeWeek}
            •
            D${activeDay}
          </span>

        </button>

        <button
          type="button"
          class="m105-mobile-tab"
          data-mobile-panel="program"
        >
          PROGRAM

          <span class="m105-mobile-count">
            ${completedDays()} built
          </span>

        </button>

      </nav>
    `;

    bindRenderEvents();
    renderLibrary();
    renderBuiltExercises();
    renderProgramMap();
    applyMobilePanel();
  }

  function programMapHtml(){
    const weeks =
      Array.from(
        {
          length:
            Math.max(
              1,
              Number(
                draft.durationWeeks
              ) ||
              1
            )
        },
        (
          _,
          i
        ) =>
          i + 1
      );

    return `
      <div class="m105-map-head">

        <div>

          <h4>
            Program Map
          </h4>

          <span>
            LIVE BUILD
          </span>

        </div>

        <small
          style="
            color:#666;
            font-size:9px
          "
        >
          ${completedDays()}
          workouts
          •
          ${totalExercises()}
          exercises
        </small>

      </div>

      ${weeks
        .map(
          week => `
            <div class="m105-map-week">

              <div class="m105-map-week-title">
                WEEK ${week}
              </div>

              ${[
                1,
                2,
                3,
                4,
                5,
                6,
                7
              ]
                .map(
                  dayNumber => {

                    const built =
                      draft.days[
                        dayKey(
                          week,
                          dayNumber
                        )
                      ];

                    const exercises =
                      built?.exercises ||
                      [];

                    const isActive =
                      week ===
                        activeWeek &&
                      dayNumber ===
                        activeDay;

                    const preview =
                      exercises
                        .slice(
                          0,
                          4
                        )
                        .map(
                          x =>
                            x.name
                        )
                        .join(
                          " • "
                        );

                    const more =
                      Math.max(
                        0,
                        exercises.length -
                        4
                      );

                    return `
                      <button
                        type="button"
                        class="
                          m105-map-day
                          ${
                            isActive
                              ? "active"
                              : ""
                          }
                        "
                        data-map-week="${week}"
                        data-map-day="${dayNumber}"
                      >

                        <div class="m105-map-day-top">

                          <strong>
                            DAY
                            ${dayNumber}

                            ${
                              built?.title
                                ? `
                                  •
                                  ${esc(
                                    built.title
                                  )}
                                `
                                : ""
                            }
                          </strong>

                          <small>
                            ${
                              exercises.length
                                ? `
                                  ${
                                    exercises.length
                                  }
                                  ex
                                `
                                : "empty"
                            }
                          </small>

                        </div>

                        ${
                          exercises.length
                            ? `
                              <div class="m105-map-exercises">
                                ${esc(
                                  preview
                                )}

                                ${
                                  more
                                    ? `
                                      +${more}
                                      more
                                    `
                                    : ""
                                }
                              </div>
                            `
                            : `
                              <div class="m105-map-empty">
                                Tap to build this workout
                              </div>
                            `
                        }

                      </button>
                    `;
                  }
                )
                .join("")
              }

            </div>
          `
        )
        .join("")
      }
    `;
  }

  function renderProgramMap(){
    [
      "m105ProgramMap",
      "m105ProgramMapMobile"
    ]
      .forEach(
        id => {

          const root =
            $(id);

          if(!root){
            return;
          }

          root.innerHTML =
            programMapHtml();

          root
            .querySelectorAll(
              "[data-map-week][data-map-day]"
            )
            .forEach(
              button => {

                button.onclick =
                  () => {

                    captureHeader();

                    activeWeek =
                      Number(
                        button
                          .dataset
                          .mapWeek
                      );

                    activeDay =
                      Number(
                        button
                          .dataset
                          .mapDay
                      );

                    mobilePanel =
                      "workout";

                    render();
                  };
              }
            );
        }
      );
  }

  function applyMobilePanel(){
    const isMobile =
      window
        .matchMedia(
          "(max-width:820px)"
        )
        .matches;

    const libraryPanel =
      $("m105LibraryPanel");

    const workoutPanel =
      $("m105WorkoutPanel");

    const programPanel =
      $("m105ProgramPanel");

    if(!isMobile){

      libraryPanel
        ?.classList
        .add(
          "mobile-active"
        );

      workoutPanel
        ?.classList
        .add(
          "mobile-active"
        );

      if(programPanel){
        programPanel.style.display =
          "none";
      }

    }else{

      libraryPanel
        ?.classList
        .toggle(
          "mobile-active",
          mobilePanel ===
            "library"
        );

      workoutPanel
        ?.classList
        .toggle(
          "mobile-active",
          mobilePanel ===
            "workout"
        );

      programPanel
        ?.classList
        .toggle(
          "mobile-active",
          mobilePanel ===
            "program"
        );

      if(programPanel){
        programPanel.style.display =
          "";
      }

    }

    document
      .querySelectorAll(
        "[data-mobile-panel]"
      )
      .forEach(
        button => {

          button
            .classList
            .toggle(
              "active",
              button
                .dataset
                .mobilePanel ===
                mobilePanel
            );
        }
      );
  }

  function filteredLibrary(){
    let rows =
      [...library];

    const q =
      normaliseText(
        searchText
      );

    const category =
      normaliseText(
        activeCategory
      );

    if(
      category &&
      category !==
        "all"
    ){

      rows =
        rows.filter(
          item =>
            normaliseText(
              item?.category
            ) ===
            category
        );
    }

    if(q){

      rows =
        rows.filter(
          item => {

            const haystack = [
              item?.name,
              item?.category,
              item?.movement_pattern,
              item?.primary_muscle,
              item?.secondary_muscles,
              item?.equipment,
              item?.difficulty,
              item?.coaching_cue
            ]
              .map(
                normaliseText
              )
              .join(
                " "
              );

            return haystack
              .includes(
                q
              );
          }
        );
    }

    rows.sort(
      (
        a,
        b
      ) =>
        String(
          a?.name ||
          ""
        )
          .localeCompare(
            String(
              b?.name ||
              ""
            )
          )
    );

    return rows;
  }

  function currentDayContainsExercise(
    exerciseId
  ){
    return ensureDay()
      .exercises
      .some(
        row =>
          String(
            row.exercise_id ||
            ""
          ) ===
          String(
            exerciseId ||
            ""
          )
      );
  }

  function renderLibrary(){
    const box =
      $("m104Library");

    if(!box){
      return;
    }

    const rows =
      filteredLibrary();

    if(!rows.length){

      box.innerHTML = `
        <div class="m104-empty">

          No exercises match this search.

          <div
            style="
              margin-top:5px;
              color:#555;
              font-size:10px
            "
          >
            ${library.length}
            exercises loaded
          </div>

        </div>
      `;

      return;
    }

    box.innerHTML = `
      <div class="m104-count">

        ${rows.length}

        exercise${
          rows.length === 1
            ? ""
            : "s"
        }

      </div>

      ${rows
        .map(
          exercise => {

            const isAdded =
              currentDayContainsExercise(
                exercise.id
              );

            return `
              <div class="m104-ex">

                <div>

                  <strong>
                    ${esc(
                      exercise.name
                    )}
                  </strong>

                  <small>

                    ${esc(
                      exercise.primary_muscle ||
                      exercise.category ||
                      "Exercise"
                    )}

                    •

                    ${esc(
                      exercise.equipment ||
                      "Any equipment"
                    )}

                  </small>

                </div>

                <button
                  type="button"
                  class="
                    m104-add
                    ${
                      isAdded
                        ? "m104-added"
                        : ""
                    }
                  "
                  data-add-ex="${esc(
                    exercise.id
                  )}"
                >
                  ${
                    isAdded
                      ? "ADD AGAIN"
                      : "ADD"
                  }
                </button>

              </div>
            `;
          }
        )
        .join("")
      }
    `;

    box
      .querySelectorAll(
        "[data-add-ex]"
      )
      .forEach(
        button => {

          button.onclick =
            () =>
              addExercise(
                button.dataset.addEx,
                button
              );
        }
      );
  }

  function addExercise(
    id,
    button
  ){
    const exercise =
      library.find(
        item =>
          String(
            item.id
          ) ===
          String(
            id
          )
      );

    if(!exercise){
      return;
    }

    ensureDay()
      .exercises
      .push({
        exercise_id:
          exercise.id,
        name:
          exercise.name,
        sets:
          exercise.default_sets ||
          3,
        reps:
          exercise.default_reps ||
          "8–12",
        rest:
          exercise.default_rest_seconds ??
          60,
        rpe:"",
        notes:
          exercise.coaching_cue ||
          ""
      });

    if(button){

      const original =
        button.textContent;

      button.textContent =
        "ADDED ✓";

      button
        .classList
        .add(
          "m104-added"
        );

      setTimeout(
        () => {

          if(
            document.body
              .contains(
                button
              )
          ){

            button.textContent =
              original ===
                "ADD AGAIN"
                ? "ADD AGAIN"
                : "ADD AGAIN";
          }
        },
        650
      );
    }

    renderBuiltExercises();
  }

  function renderBuiltExercises(){
    const box =
      $("m104BuiltList");

    if(!box){
      return;
    }

    const exercises =
      ensureDay()
        .exercises;

    if(!exercises.length){

      box.innerHTML = `
        <div class="m104-empty">

          Search the exercise library and tap
          <strong>
            ADD
          </strong>.

          Exercises appear here instantly.

        </div>
      `;

      return;
    }

    box.innerHTML =
      exercises
        .map(
          (
            exercise,
            index
          ) => `
            <div class="m104-built">

              <div class="m104-built-head">

                <div class="m104-built-name">

                  ${index + 1}.

                  ${esc(
                    exercise.name
                  )}

                </div>

                <div class="m104-built-actions">

                  <button
                    type="button"
                    class="m104-icon"
                    data-up="${index}"
                    title="Move up"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    class="m104-icon"
                    data-down="${index}"
                    title="Move down"
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    class="m104-icon"
                    data-duplicate="${index}"
                    title="Duplicate"
                  >
                    ⧉
                  </button>

                  <button
                    type="button"
                    class="m104-icon remove"
                    data-remove="${index}"
                    title="Remove"
                  >
                    ×
                  </button>

                </div>

              </div>

              <div class="m104-mini">

                <div>

                  <label class="m104-label">
                    Sets
                  </label>

                  <input
                    data-field="sets"
                    data-index="${index}"
                    type="number"
                    min="1"
                    max="20"
                    value="${esc(
                      exercise.sets
                    )}"
                    placeholder="3"
                  >

                </div>

                <div>

                  <label class="m104-label">
                    Reps / time
                  </label>

                  <input
                    data-field="reps"
                    data-index="${index}"
                    value="${esc(
                      exercise.reps
                    )}"
                    placeholder="8–12"
                  >

                </div>

                <div>

                  <label class="m104-label">
                    Rest sec
                  </label>

                  <input
                    data-field="rest"
                    data-index="${index}"
                    type="number"
                    min="0"
                    max="900"
                    value="${esc(
                      exercise.rest
                    )}"
                    placeholder="60"
                  >

                </div>

                <div>

                  <label class="m104-label">
                    RPE
                  </label>

                  <input
                    data-field="rpe"
                    data-index="${index}"
                    value="${esc(
                      exercise.rpe
                    )}"
                    placeholder="8"
                  >

                </div>

              </div>

              <div class="m104-note">

                <input
                  class="m104-input"
                  data-field="notes"
                  data-index="${index}"
                  value="${esc(
                    exercise.notes
                  )}"
                  placeholder="Optional coach cue"
                >

              </div>

            </div>
          `
        )
        .join("");

    box
      .querySelectorAll(
        "[data-remove]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              ensureDay()
                .exercises
                .splice(
                  Number(
                    button
                      .dataset
                      .remove
                  ),
                  1
                );

              renderBuiltExercises();
              renderLibrary();
            };
        }
      );

    box
      .querySelectorAll(
        "[data-duplicate]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              const index =
                Number(
                  button
                    .dataset
                    .duplicate
                );

              const item =
                ensureDay()
                  .exercises[
                    index
                  ];

              if(!item){
                return;
              }

              ensureDay()
                .exercises
                .splice(
                  index + 1,
                  0,
                  cloneExercise(
                    item
                  )
                );

              renderBuiltExercises();
            };
        }
      );

    box
      .querySelectorAll(
        "[data-up]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              const index =
                Number(
                  button
                    .dataset
                    .up
                );

              if(
                index <=
                0
              ){
                return;
              }

              const list =
                ensureDay()
                  .exercises;

              [
                list[index - 1],
                list[index]
              ] = [
                list[index],
                list[index - 1]
              ];

              renderBuiltExercises();
            };
        }
      );

    box
      .querySelectorAll(
        "[data-down]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              const index =
                Number(
                  button
                    .dataset
                    .down
                );

              const list =
                ensureDay()
                  .exercises;

              if(
                index < 0 ||
                index >=
                  list.length -
                  1
              ){
                return;
              }

              [
                list[index + 1],
                list[index]
              ] = [
                list[index],
                list[index + 1]
              ];

              renderBuiltExercises();
            };
        }
      );

    box
      .querySelectorAll(
        "[data-field]"
      )
      .forEach(
        input => {

          input.oninput =
            () => {

              const row =
                ensureDay()
                  .exercises[
                    Number(
                      input
                        .dataset
                        .index
                    )
                  ];

              if(!row){
                return;
              }

              row[
                input
                  .dataset
                  .field
              ] =
                input.value;
            };
        }
      );

    renderProgramMap();
  }

  function captureHeader(){
    draft.name =
      $("m104ProgramName")
        ?.value
        ?.trim() ||
      "Custom Training Program";

    draft.goal =
      $("m104Goal")
        ?.value
        ?.trim() ||
      "";

    draft.description =
      $("m104Description")
        ?.value
        ?.trim() ||
      "";

    draft.durationWeeks =
      Math.max(
        1,
        Math.min(
          52,
          Number(
            $("m104Weeks")
              ?.value ||
            draft.durationWeeks ||
            4
          )
        )
      );

    const day =
      ensureDay();

    day.title =
      $("m104DayTitle")
        ?.value
        ?.trim() ||
      `Workout ${activeDay}`;

    day.type =
      $("m104DayType")
        ?.value ||
      "Strength";

    day.minutes =
      Number(
        $("m104Minutes")
          ?.value ||
        45
      );

    day.notes =
      $("m104DayNotes")
        ?.value
        ?.trim() ||
      "";
  }

  function copyToNextDay(){
    captureHeader();

    const source =
      ensureDay();

    let targetWeek =
      activeWeek;

    let targetDay =
      activeDay + 1;

    if(
      targetDay >
      7
    ){
      targetDay =
        1;

      targetWeek +=
        1;
    }

    if(
      targetWeek >
      draft.durationWeeks
    ){

      setStatus(
        "Increase the program length to copy beyond the final week.",
        "bad"
      );

      return;
    }

    draft.days[
      dayKey(
        targetWeek,
        targetDay
      )
    ] =
      cloneDay(
        source,
        targetWeek,
        targetDay
      );

    activeWeek =
      targetWeek;

    activeDay =
      targetDay;

    render();

    setStatus(
      `Workout copied to Week ${targetWeek}, Day ${targetDay} ✓`,
      "good"
    );
  }

  function copyWeekForward(){
    captureHeader();

    if(
      activeWeek >=
      draft.durationWeeks
    ){

      setStatus(
        "Increase the program length to create another week.",
        "bad"
      );

      return;
    }

    const nextWeek =
      activeWeek + 1;

    let copied =
      0;

    for(
      let day = 1;
      day <= 7;
      day++
    ){

      const source =
        draft.days[
          dayKey(
            activeWeek,
            day
          )
        ];

      if(!source){
        continue;
      }

      draft.days[
        dayKey(
          nextWeek,
          day
        )
      ] =
        cloneDay(
          source,
          nextWeek,
          day
        );

      copied +=
        1;
    }

    if(!copied){

      setStatus(
        "Build at least one workout in this week before copying it.",
        "bad"
      );

      return;
    }

    activeWeek =
      nextWeek;

    activeDay =
      1;

    render();

    setStatus(
      `Week ${nextWeek} created from Week ${nextWeek - 1} ✓`,
      "good"
    );
  }

  function clearCurrentDay(){
    const day =
      ensureDay();

    const hasContent =
      day.exercises.length ||
      day.notes ||
      day.title !==
        `Workout ${activeDay}`;

    if(!hasContent){

      setStatus(
        "This workout is already empty."
      );

      return;
    }

    if(
      !window.confirm(
        "Clear this workout? This removes all exercises from this day."
      )
    ){
      return;
    }

    draft.days[
      dayKey(
        activeWeek,
        activeDay
      )
    ] =
      freshDay(
        activeWeek,
        activeDay
      );

    render();

    setStatus(
      "Workout cleared."
    );
  }

  function bindRenderEvents(){
    const search =
      $("m104Search");

    if(search){

      search.oninput =
        () => {

          searchText =
            search.value;

          renderLibrary();
        };

      setTimeout(
        () =>
          search.focus({
            preventScroll:true
          }),
        0
      );
    }

    document
      .querySelectorAll(
        "#m104Categories [data-cat]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              activeCategory =
                button
                  .dataset
                  .cat ||
                "ALL";

              document
                .querySelectorAll(
                  "#m104Categories [data-cat]"
                )
                .forEach(
                  node => {

                    node
                      .classList
                      .toggle(
                        "active",
                        node ===
                        button
                      );
                  }
                );

              renderLibrary();
            };
        }
      );

    document
      .querySelectorAll(
        "[data-week]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              captureHeader();

              activeWeek =
                Number(
                  button
                    .dataset
                    .week
                );

              if(
                activeWeek >
                draft.durationWeeks
              ){

                activeWeek =
                  draft.durationWeeks;
              }

              render();
            };
        }
      );

    document
      .querySelectorAll(
        "[data-day]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              captureHeader();

              activeDay =
                Number(
                  button
                    .dataset
                    .day
                );

              render();
            };
        }
      );

    const weeks =
      $("m104Weeks");

    if(weeks){

      weeks.onchange =
        () => {

          captureHeader();

          if(
            activeWeek >
            draft.durationWeeks
          ){

            activeWeek =
              draft.durationWeeks;
          }

          render();
        };
    }

    [
      "m104ProgramName",
      "m104Goal",
      "m104Description",
      "m104DayTitle",
      "m104DayType",
      "m104Minutes",
      "m104DayNotes"
    ]
      .forEach(
        id => {

          const node =
            $(id);

          if(node){
            node.oninput =
              captureHeader;
          }
        }
      );

    $("m104CreateExercise").onclick =
      createExercise;

    $("m104CopyNextDay").onclick =
      copyToNextDay;

    $("m104CopyWeek").onclick =
      copyWeekForward;

    $("m104ClearDay").onclick =
      clearCurrentDay;

    $("m104Save").onclick =
      () =>
        saveProgram(
          false
        );

    if(
      $("m104Assign")
    ){

      $("m104Assign").onclick =
        () =>
          saveProgram(
            true
          );
    }

    document
      .querySelectorAll(
        "[data-mobile-panel]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              captureHeader();

              mobilePanel =
                button
                  .dataset
                  .mobilePanel ||
                "library";

              applyMobilePanel();

              window.scrollTo({
                top:0,
                behavior:"smooth"
              });
            };
        }
      );
  }

  async function createExercise(){
    const name =
      $("m104NewName")
        ?.value
        ?.trim();

    if(!name){

      setStatus(
        "Enter an exercise name first.",
        "bad"
      );

      return;
    }

    try{

      const c =
        await sb();

      const user =
        await coachUser();

      const {
        data,
        error
      } = await c
        .from(
          "exercise_library"
        )
        .insert({
          name,
          category:
            $("m104NewCategory")
              ?.value
              ?.trim() ||
            "Strength",
          equipment:
            $("m104NewEquipment")
              ?.value
              ?.trim() ||
            null,
          created_by:
            user.id
        })
        .select("*")
        .single();

      if(error){
        throw error;
      }

      library.push(
        data
      );

      library.sort(
        (
          a,
          b
        ) =>
          String(
            a?.name ||
            ""
          )
            .localeCompare(
              String(
                b?.name ||
                ""
              )
            )
      );

      $("m104NewName").value =
        "";

      $("m104NewCategory").value =
        "";

      $("m104NewEquipment").value =
        "";

      activeCategory =
        "ALL";

      searchText =
        "";

      render();

      setStatus(
        "Exercise added to the Mana library ✓",
        "good"
      );

    }catch(error){

      setStatus(
        "Could not add exercise: " +
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

  function setStatus(
    message,
    type=""
  ){
    const node =
      $("m104Status");

    if(!node){
      return;
    }

    node.textContent =
      message ||
      "";

    node.className =
      "m104-status" +
      (
        type
          ? ` ${type}`
          : ""
      );
  }

  function validateProgram(){
    captureHeader();

    if(
      !draft.name.trim()
    ){

      return (
        "Give the program a name."
      );
    }

    const daysWithExercises =
      Object
        .values(
          draft.days
        )
        .filter(
          day =>
            Array.isArray(
              day.exercises
            ) &&
            day.exercises.length
        );

    if(
      !daysWithExercises.length
    ){

      return (
        "Add at least one exercise before saving."
      );
    }

    return "";
  }

  async function saveProgram(
    assign
  ){
    const validation =
      validateProgram();

    if(validation){

      setStatus(
        validation,
        "bad"
      );

      return;
    }

    setStatus(
      assign
        ? "Saving and assigning…"
        : "Saving program…"
    );

    const saveButton =
      $("m104Save");

    const assignButton =
      $("m104Assign");

    if(saveButton){
      saveButton.disabled =
        true;
    }

    if(assignButton){
      assignButton.disabled =
        true;
    }

    try{

      const c =
        await sb();

      const user =
        await coachUser();

      let programId =
        draft.id;

      if(programId){

        const {
          error
        } = await c
          .from(
            "custom_programs"
          )
          .update({
            name:
              draft.name,
            description:
              draft.description ||
              null,
            goal:
              draft.goal ||
              null,
            duration_weeks:
              draft.durationWeeks,
            status:
              "active",
            source_program:
              "CUSTOM",
            updated_at:
              new Date()
                .toISOString()
          })
          .eq(
            "id",
            programId
          )
          .eq(
            "coach_id",
            user.id
          );

        if(error){
          throw error;
        }

        const {
          error:
            deleteDaysError
        } = await c
          .from(
            "custom_program_days"
          )
          .delete()
          .eq(
            "program_id",
            programId
          );

        if(
          deleteDaysError
        ){
          throw deleteDaysError;
        }

      }else{

        const {
          data,
          error
        } = await c
          .from(
            "custom_programs"
          )
          .insert({
            coach_id:
              user.id,
            name:
              draft.name,
            description:
              draft.description ||
              null,
            goal:
              draft.goal ||
              null,
            duration_weeks:
              draft.durationWeeks,
            status:
              "active",
            source_program:
              "CUSTOM"
          })
          .select(
            "id"
          )
          .single();

        if(error){
          throw error;
        }

        programId =
          data.id;

        draft.id =
          programId;
      }

      const days =
        Object
          .values(
            draft.days
          )
          .filter(
            day =>
              Array.isArray(
                day.exercises
              ) &&
              day.exercises.length
          )
          .sort(
            (
              a,
              b
            ) =>
              a.week -
                b.week ||
              a.day -
                b.day
          );

      for(
        const day
        of days
      ){

        const {
          data:
            dayRow,
          error:
            dayError
        } = await c
          .from(
            "custom_program_days"
          )
          .insert({
            program_id:
              programId,
            week_number:
              day.week,
            day_number:
              day.day,
            title:
              day.title ||
              `Workout ${day.day}`,
            workout_type:
              day.type ||
              "Strength",
            estimated_minutes:
              day.minutes ||
              null,
            notes:
              day.notes ||
              null,
            sort_order:
              (
                day.week *
                10
              ) +
              day.day
          })
          .select(
            "id"
          )
          .single();

        if(dayError){
          throw dayError;
        }

        const payload =
          day.exercises
            .map(
              (
                exercise,
                index
              ) => ({
                program_day_id:
                  dayRow.id,
                exercise_id:
                  exercise.exercise_id ||
                  null,
                exercise_name:
                  exercise.name,
                sets:
                  exercise.sets ===
                    "" ||
                  exercise.sets ==
                    null
                    ? null
                    : Number(
                        exercise.sets
                      ),
                reps:
                  exercise.reps ||
                  null,
                rest_seconds:
                  exercise.rest ===
                    "" ||
                  exercise.rest ==
                    null
                    ? null
                    : Number(
                        exercise.rest
                      ),
                rpe_target:
                  exercise.rpe ||
                  null,
                notes:
                  exercise.notes ||
                  null,
                sort_order:
                  index
              })
            );

        if(
          payload.length
        ){

          const {
            error:
              exerciseError
          } = await c
            .from(
              "custom_program_exercises"
            )
            .insert(
              payload
            );

          if(
            exerciseError
          ){
            throw exerciseError;
          }
        }
      }

      if(assign){

        if(
          !selectedClient
            ?.id
        ){

          throw new Error(
            "No client selected."
          );
        }

        const {
          error:
            primaryError
        } = await c
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
            user.id
          );

        if(
          primaryError
        ){
          throw primaryError;
        }

        const {
          error:
            assignError
        } = await c
          .from(
            "client_program_assignments"
          )
          .upsert({
            client_id:
              selectedClient.id,
            coach_id:
              user.id,
            program_id:
              programId,
            status:
              "active",
            is_primary:
              true,
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
          },{
            onConflict:
              "client_id,program_id"
          });

        if(
          assignError
        ){
          throw assignError;
        }

        setStatus(
          `Saved and assigned to ${selectedClient.name} ✓`,
          "good"
        );

      }else{

        setStatus(
          "Program saved to Mana cloud ✓",
          "good"
        );
      }

    }catch(error){

      setStatus(
        "Could not save: " +
        (
          error?.message ||
          String(
            error
          )
        ),
        "bad"
      );

    }finally{

      if(saveButton){
        saveButton.disabled =
          false;
      }

      if(assignButton){
        assignButton.disabled =
          false;
      }
    }
  }

  async function openBuilder(
    client=null
  ){
    selectedClient =
      client?.id
        ? {
            id:
              String(
                client.id
              ),
            name:
              String(
                client.name ||
                "Client"
              )
          }
        : selectedClientFromSession();

    draft =
      newDraft();

    activeWeek =
      1;

    activeDay =
      1;

    activeCategory =
      "ALL";

    searchText =
      "";

    mobilePanel =
      "library";

    const modal =
      ensureModal();

    modal
      .classList
      .add(
        "open"
      );

    document.body.style.overflow =
      "hidden";

    $("m104Content").innerHTML = `
      <div
        class="m104-card"
        style="margin-top:14px"
      >

        <div class="m104-empty">
          Loading exercise library…
        </div>

      </div>
    `;

    try{

      await loadLibrary();

      render();

    }catch(error){

      $("m104Content").innerHTML = `
        <div
          class="m104-card"
          style="margin-top:14px"
        >

          <h3>
            Program Builder Setup
          </h3>

          <p
            style="
              color:#999;
              line-height:1.5
            "
          >
            Mana could not load the custom-program database.
          </p>

          <p
            style="
              color:#f0c768;
              font-size:12px
            "
          >
            Check that

            <strong>
              v10_00_custom_program_schema_100000.sql
            </strong>

            has already been run in Supabase.
          </p>

          <div class="m104-status bad">
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

  function closeBuilder(){
    $(MODAL_ID)
      ?.classList
      .remove(
        "open"
      );

    document.body.style.overflow =
      "";
  }

  function ensureProgramsButton(){
    const root =
      $("manaV999CoachPrograms");

    if(!root){
      return;
    }

    const oldButton =
      $("manaV1001OpenBuilder");

    if(oldButton){

      oldButton.onclick =
        () =>
          openBuilder(
            null
          );

      oldButton.textContent =
        "BUILD PROGRAM";

      return;
    }

    if(
      $("manaV1004OpenBuilder")
    ){
      return;
    }

    const section =
      document.createElement(
        "section"
      );

    section.className =
      "m999-manage";

    section.style.marginTop =
      "12px";

    section.innerHTML = `
      <div class="m999-manage-top">

        <div>

          <h3>
            Custom Program Builder
          </h3>

          <p>
            Build a personalised program from the Mana exercise library.
          </p>

        </div>

        <button
          type="button"
          class="m999-btn"
          id="manaV1004OpenBuilder"
        >
          BUILD PROGRAM
        </button>

      </div>
    `;

    root.appendChild(
      section
    );

    $("manaV1004OpenBuilder").onclick =
      () =>
        openBuilder(
          null
        );
  }

  function ensureClientButton(){
    const view =
      $("coachClientDetailView");

    if(!view){
      return;
    }

    const oldButton =
      $("manaV1001BuildForClient");

    if(oldButton){

      oldButton.onclick =
        () => {

          const sessionClient =
            selectedClientFromSession();

          const name =
            $("detailClientName")
              ?.textContent
              ?.trim() ||
            sessionClient?.name ||
            "Client";

          const id =
            sessionClient?.id ||
            selectedClient?.id;

          if(!id){

            alert(
              "Open this client again from Active Clients so Mana can capture their client ID."
            );

            return;
          }

          openBuilder({
            id,
            name
          });
        };

      return;
    }

    if(
      $("manaV1004BuildForClient")
    ){
      return;
    }

    const quick =
      [
        ...view
          .querySelectorAll(
            ".card"
          )
      ]
        .find(
          card =>
            card
              .querySelector(
                "h3"
              )
              ?.textContent
              ?.trim()
              .toLowerCase() ===
            "quick coach actions"
        );

    if(!quick){
      return;
    }

    const button =
      document.createElement(
        "button"
      );

    button.id =
      "manaV1004BuildForClient";

    button.type =
      "button";

    button.className =
      "btn secondary";

    button.style.marginTop =
      "10px";

    button.textContent =
      "Build custom program";

    quick.appendChild(
      button
    );

    button.onclick =
      () => {

        const sessionClient =
          selectedClientFromSession();

        const name =
          $("detailClientName")
            ?.textContent
            ?.trim() ||
          sessionClient?.name ||
          "Client";

        const id =
          sessionClient?.id ||
          selectedClient?.id;

        if(!id){

          alert(
            "Open this client again from Active Clients so Mana can capture their client ID."
          );

          return;
        }

        openBuilder({
          id,
          name
        });
      };
  }

  function captureClientClicks(){
    document.addEventListener(
      "click",
      event => {

        const button =
          event.target.closest(
            ".client-open"
          );

        if(!button){
          return;
        }

        const id =
          button
            .dataset
            .clientId;

        if(!id){
          return;
        }

        selectedClient = {
          id:
            String(
              id
            ),
          name:
            String(
              button
                .dataset
                .clientName ||
              "Client"
            )
        };

        try{

          sessionStorage
            .setItem(
              CLIENT_SESSION_KEY,
              JSON.stringify(
                selectedClient
              )
            );

        }catch(_){}
      },
      true
    );
  }

  function init(){
    installStyles();
    ensureModal();
    captureClientClicks();

    [
      200,
      700,
      1500,
      2800
    ]
      .forEach(
        delay => {

          setTimeout(
            () => {

              ensureProgramsButton();
              ensureClientButton();

            },
            delay
          );
        }
      );

    document.addEventListener(
      "click",
      event => {

        const programsNav =
          event.target.closest(
            '#bottomNav [data-page="programs"]'
          );

        if(programsNav){

          setTimeout(
            ensureProgramsButton,
            120
          );
        }

        const clientOpen =
          event.target.closest(
            ".client-open"
          );

        if(clientOpen){

          setTimeout(
            ensureClientButton,
            220
          );
        }
      }
    );

    window.openManaProgramBuilder =
      openBuilder;

    window.MANA_CUSTOM_PROGRAM_BUILDER_BUILD =
      BUILD;

    window.MANA_CUSTOM_PROGRAM_BUILDER_VERSION =
      "10.07.0";
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
