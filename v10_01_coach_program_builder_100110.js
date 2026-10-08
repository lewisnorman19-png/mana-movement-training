/* =========================================
   MANA MOVEMENT TRAINING v10.01.1
   COACH CUSTOM PROGRAM BUILDER

   REQUIRES:
   - v10_00_custom_program_schema_100000.sql

   FEATURES
   - Exercise library search/filter
   - Add custom exercise to library
   - Build workouts from scratch
   - Multiple weeks + days
   - Sets / reps / rest / RPE / notes
   - Save program to Supabase
   - Assign saved program to selected client
   - Opens from Coach Programs + Client Hub
   ========================================= */

(() => {
  "use strict";

  const BUILD = "100110";
  const STYLE_ID = "mana-v10011-program-builder-style";
  const MODAL_ID = "manaV1001ProgramBuilder";

  let library = [];
  let draft = newDraft();
  let activeWeek = 1;
  let activeDay = 1;
  let selectedClient = null;

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

  function ensureDay(
    week = activeWeek,
    day = activeDay
  ){

    const key =
      dayKey(
        week,
        day
      );

    if(
      !draft.days[
        key
      ]
    ){

      draft.days[
        key
      ] = {

        week,

        day,

        title:
          `Workout ${day}`,

        type:
          "Strength",

        minutes:
          45,

        notes:
          "",

        exercises:
          []

      };

    }

    return draft.days[
      key
    ];

  }

  function esc(
    value
  ){

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

  async function sb(){

    if(
      typeof
        window
          .supabaseClient ===
      "function"
    ){

      return await
        window
          .supabaseClient();

    }

    throw new Error(
      "Mana Supabase client is not available."
    );

  }

  async function coachUser(){

    const c =
      await sb();


    const {
      data,
      error
    } =
      await
        c.auth
          .getUser();


    if(
      error
    ){

      throw error;

    }


    if(
      !data
        ?.user
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

      #${MODAL_ID}{

        position:
          fixed;

        inset:
          0;

        z-index:
          60000;

        display:
          none;

        overflow:
          auto;

        background:
          #050505;

        color:
          #fff;

        padding:
          18px
          14px
          40px;

      }


      #${MODAL_ID}.open{

        display:
          block;

      }


      .m1001-shell{

        width:
          min(
            1100px,
            100%
          );

        margin:
          0 auto;

      }


      .m1001-top{

        position:
          sticky;

        top:
          0;

        z-index:
          5;

        display:
          flex;

        justify-content:
          space-between;

        gap:
          12px;

        align-items:
          center;

        padding:
          12px
          0;

        background:
          rgba(
            5,
            5,
            5,
            .96
          );

      }


      .m1001-brand{

        color:
          #f3d875;

        font-size:
          11px;

        font-weight:
          950;

        letter-spacing:
          .15em;

      }


      .m1001-close,
      .m1001-save,
      .m1001-assign,
      .m1001-add{

        min-height:
          44px;

        border-radius:
          14px;

        font-weight:
          900;

        cursor:
          pointer;

      }


      .m1001-close{

        border:
          1px solid
          #333;

        background:
          #101010;

        color:
          #ddd;

        padding:
          0
          14px;

      }


      .m1001-save,
      .m1001-assign{

        border:
          1px solid
          #b69732;

        background:
          linear-gradient(
            135deg,
            #f4da72,
            #c7a12f
          );

        color:
          #111;

        padding:
          0
          16px;

      }


      .m1001-grid{

        display:
          grid;

        grid-template-columns:
          minmax(
            280px,
            .85fr
          )
          minmax(
            0,
            1.55fr
          );

        gap:
          14px;

      }


      .m1001-card{

        border:
          1px solid
          #292929;

        border-radius:
          20px;

        background:
          #0b0b0b;

        padding:
          16px;

      }


      .m1001-card
      h3{

        margin:
          0
          0
          12px;

      }


      .m1001-input,
      .m1001-select,
      .m1001-textarea{

        width:
          100%;

        border:
          1px solid
          #303030;

        border-radius:
          12px;

        background:
          #070707;

        color:
          #fff;

        padding:
          12px;

        font:
          inherit;

        box-sizing:
          border-box;

      }


      .m1001-textarea{

        min-height:
          78px;

        resize:
          vertical;

      }


      .m1001-field{

        margin-bottom:
          10px;

      }


      .m1001-field
      label{

        display:
          block;

        color:
          #777;

        font-size:
          9px;

        font-weight:
          900;

        letter-spacing:
          .09em;

        text-transform:
          uppercase;

        margin-bottom:
          6px;

      }


      .m1001-row{

        display:
          flex;

        gap:
          8px;

        align-items:
          center;

      }


      .m1001-row
      > *{

        min-width:
          0;

      }


      .m1001-toolbar{

        display:
          flex;

        flex-wrap:
          wrap;

        gap:
          7px;

        margin:
          10px
          0;

      }


      .m1001-chip{

        border:
          1px solid
          #333;

        background:
          #0c0c0c;

        color:
          #aaa;

        border-radius:
          999px;

        padding:
          8px
          10px;

        font-size:
          9px;

        font-weight:
          900;

        cursor:
          pointer;

      }


      .m1001-chip.active{

        border-color:
          #806b28;

        background:
          #181406;

        color:
          #f3d875;

      }


      .m1001-library{

        max-height:
          58vh;

        overflow:
          auto;

      }


      .m1001-ex{

        display:
          flex;

        justify-content:
          space-between;

        gap:
          10px;

        align-items:
          center;

        padding:
          12px
          0;

        border-bottom:
          1px solid
          #222;

      }


      .m1001-ex:last-child{

        border-bottom:
          0;

      }


      .m1001-ex
      strong{

        font-size:
          13px;

      }


      .m1001-ex
      small{

        display:
          block;

        color:
          #727272;

        margin-top:
          4px;

      }


      .m1001-add{

        flex:
          0
          0
          auto;

        border:
          1px solid
          #5a4b1f;

        background:
          #151207;

        color:
          #f1d26b;

        padding:
          0
          12px;

      }


      .m1001-weekbar,
      .m1001-daybar{

        display:
          flex;

        gap:
          7px;

        overflow:
          auto;

        padding-bottom:
          5px;

      }


      .m1001-builder-head{

        display:
          flex;

        justify-content:
          space-between;

        gap:
          12px;

        align-items:
          flex-start;

        margin-bottom:
          12px;

      }


      .m1001-list{

        display:
          grid;

        gap:
          8px;

        margin-top:
          12px;

      }


      .m1001-built{

        border:
          1px solid
          #2c2c2c;

        border-radius:
          15px;

        background:
          #080808;

        padding:
          12px;

      }


      .m1001-built-head{

        display:
          flex;

        justify-content:
          space-between;

        gap:
          10px;

      }


      .m1001-built-name{

        font-weight:
          900;

      }


      .m1001-mini{

        display:
          grid;

        grid-template-columns:
          80px
          1fr
          90px
          90px;

        gap:
          7px;

        margin-top:
          9px;

      }


      .m1001-mini
      input{

        width:
          100%;

        box-sizing:
          border-box;

        border:
          1px solid
          #292929;

        border-radius:
          10px;

        background:
          #050505;

        color:
          #fff;

        padding:
          9px;

      }


      .m1001-remove{

        border:
          0;

        background:
          none;

        color:
          #9d6c6c;

        font-weight:
          900;

        cursor:
          pointer;

      }


      .m1001-actions{

        display:
          flex;

        flex-wrap:
          wrap;

        gap:
          8px;

        margin-top:
          14px;

      }


      .m1001-status{

        min-height:
          20px;

        color:
          #888;

        font-size:
          11px;

        margin-top:
          10px;

      }


      .m1001-empty{

        color:
          #777;

        font-size:
          12px;

        padding:
          18px
          0;

      }


      .m1001-newexercise{

        margin-top:
          10px;

        padding-top:
          12px;

        border-top:
          1px solid
          #232323;

      }


      .m1001-client{

        color:
          #f3d875;

        font-weight:
          900;

      }


      @media(
        max-width:
          800px
      ){

        .m1001-grid{

          grid-template-columns:
            1fr;

        }


        .m1001-library{

          max-height:
            360px;

        }


        .m1001-mini{

          grid-template-columns:
            1fr
            1fr;

        }


        .m1001-builder-head{

          display:
            block;

        }


        .m1001-actions
        button{

          flex:
            1;

        }


        .m1001-top{

          align-items:
            flex-start;

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
        class="m1001-shell"
      >

        <div
          class="m1001-top"
        >

          <div>

            <div
              class="m1001-brand"
            >
              MANA COACH • PROGRAM BUILDER
            </div>

            <div
              style="
                font-size:11px;
                color:#777;
                margin-top:4px
              "
            >
              Build from the exercise library
              and assign directly to a client.
            </div>

          </div>


          <button
            class="m1001-close"
            id="m1001Close"
          >
            CLOSE
          </button>

        </div>


        <div
          id="m1001Content"
        ></div>

      </div>

    `;


    document
      .body
      .appendChild(
        modal
      );


    $(
      "m1001Close"
    ).onclick =
      closeBuilder;


    return modal;

  }


  /* =========================================
     LIBRARY LOAD
     ========================================= */

  async function loadLibrary(){

    const c =
      await sb();


    const {
      data,
      error
    } =
      await
        c
          .from(
            "exercise_library"
          )
          .select(
            "*"
          )
          .eq(
            "is_active",
            true
          )
          .order(
            "name"
          );


    if(
      error
    ){

      throw error;

    }


    library =
      data ||
      [];

  }


  function categoryOptions(){

    return [

      "ALL",

      ...new Set(

        library
          .map(
            x =>
              x.category
          )
          .filter(
            Boolean
          )

      )

    ];

  }


  /* =========================================
     BUILDER RENDER
     ========================================= */

  function render(){

    const content =
      $(
        "m1001Content"
      );


    if(
      !content
    ){

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
                draft
                  .durationWeeks
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

      <div
        class="m1001-grid"
      >

        <section
          class="m1001-card"
        >

          <h3>
            Exercise Library
          </h3>


          <div
            class="m1001-field"
          >

            <input
              id="m1001Search"
              class="m1001-input"
              placeholder="Search exercise, muscle or equipment"
            >

          </div>


          <div
            class="m1001-toolbar"
            id="m1001Categories"
          >

            ${
              categoryOptions()
                .map(
                  (
                    x,
                    i
                  ) => `

                    <button
                      class="
                        m1001-chip
                        ${
                          i === 0
                            ? "active"
                            : ""
                        }
                      "
                      data-cat="${esc(x)}"
                    >
                      ${esc(x)}
                    </button>

                  `
                )
                .join(
                  ""
                )
            }

          </div>


          <div
            class="m1001-library"
            id="m1001Library"
          ></div>


          <div
            class="m1001-newexercise"
          >

            <div
              style="
                font-weight:900;
                font-size:12px;
                margin-bottom:8px
              "
            >
              Add exercise
            </div>


            <div
              class="m1001-field"
            >

              <input
                id="m1001NewName"
                class="m1001-input"
                placeholder="Exercise name"
              >

            </div>


            <div
              class="m1001-row"
            >

              <input
                id="m1001NewCategory"
                class="m1001-input"
                placeholder="Category e.g. Strength"
              >


              <input
                id="m1001NewEquipment"
                class="m1001-input"
                placeholder="Equipment"
              >

            </div>


            <button
              class="m1001-add"
              id="m1001CreateExercise"
              style="
                margin-top:9px
              "
            >
              ADD TO LIBRARY
            </button>

          </div>

        </section>


        <section
          class="m1001-card"
        >

          <div
            class="m1001-builder-head"
          >

            <div>

              <h3
                style="
                  margin-bottom:4px
                "
              >
                Custom Program
              </h3>


              <div
                style="
                  color:#777;
                  font-size:11px
                "
              >

                ${
                  selectedClient

                    ? `Assigning for <span class="m1001-client">${esc(
                        selectedClient
                          .name
                      )}</span>`

                    : "Save as a reusable coach program."
                }

              </div>

            </div>

          </div>


          <div
            class="m1001-field"
          >

            <label>
              Program name
            </label>

            <input
              id="m1001ProgramName"
              class="m1001-input"
              value="${esc(
                draft.name
              )}"
            >

          </div>


          <div
            class="m1001-row"
          >

            <div
              class="m1001-field"
              style="
                flex:1
              "
            >

              <label>
                Goal
              </label>

              <input
                id="m1001Goal"
                class="m1001-input"
                value="${esc(
                  draft.goal
                )}"
                placeholder="Strength, fat loss, return to training..."
              >

            </div>


            <div
              class="m1001-field"
              style="
                width:120px
              "
            >

              <label>
                Weeks
              </label>

              <input
                id="m1001Weeks"
                class="m1001-input"
                type="number"
                min="1"
                max="52"
                value="${
                  draft
                    .durationWeeks
                }"
              >

            </div>

          </div>


          <div
            class="m1001-field"
          >

            <label>
              Description
            </label>

            <textarea
              id="m1001Description"
              class="m1001-textarea"
            >${esc(
              draft
                .description
            )}</textarea>

          </div>


          <div
            class="m1001-weekbar"
          >

            ${
              weeks
                .map(
                  w => `

                    <button
                      class="
                        m1001-chip
                        ${
                          w ===
                          activeWeek

                            ? "active"
                            : ""
                        }
                      "
                      data-week="${w}"
                    >
                      WEEK ${w}
                    </button>

                  `
                )
                .join(
                  ""
                )
            }

          </div>


          <div
            class="m1001-daybar"
            style="
              margin-top:7px
            "
          >

            ${
              [
                1,
                2,
                3,
                4,
                5,
                6,
                7
              ]
                .map(
                  d => `

                    <button
                      class="
                        m1001-chip
                        ${
                          d ===
                          activeDay

                            ? "active"
                            : ""
                        }
                      "
                      data-day="${d}"
                    >
                      DAY ${d}
                    </button>

                  `
                )
                .join(
                  ""
                )
            }

          </div>


          <div
            style="
              margin-top:12px
            "
          >

            <div
              class="m1001-row"
            >

              <input
                id="m1001DayTitle"
                class="m1001-input"
                value="${esc(
                  day.title
                )}"
                placeholder="Workout title"
              >


              <select
                id="m1001DayType"
                class="m1001-select"
              >

                ${
                  [
                    "Strength",
                    "Conditioning",
                    "Mobility",
                    "Recovery",
                    "Mixed",
                    "Rest"
                  ]
                    .map(
                      t => `

                        <option
                          ${
                            t ===
                            day.type

                              ? "selected"
                              : ""
                          }
                        >
                          ${t}
                        </option>

                      `
                    )
                    .join(
                      ""
                    )
                }

              </select>


              <input
                id="m1001Minutes"
                class="m1001-input"
                type="number"
                min="1"
                max="300"
                value="${
                  day.minutes ||
                  45
                }"
                placeholder="Min"
                style="
                  max-width:90px
                "
              >

            </div>


            <div
              class="m1001-list"
              id="m1001BuiltList"
            ></div>

          </div>


          <div
            class="m1001-actions"
          >

            <button
              class="m1001-save"
              id="m1001Save"
            >
              SAVE PROGRAM
            </button>


            ${
              selectedClient

                ? `

                  <button
                    class="m1001-assign"
                    id="m1001Assign"
                  >
                    SAVE + ASSIGN
                  </button>

                `

                : ""
            }

          </div>


          <div
            class="m1001-status"
            id="m1001Status"
          ></div>

        </section>

      </div>

    `;


    bindRenderEvents();

    renderLibrary();

    renderBuiltExercises();

  }


  let activeCategory =
    "ALL";


  /* =========================================
     FIXED LIBRARY FILTER
     ========================================= */

  function normaliseText(
    value
  ){

    return String(
      value ??
      ""
    )
      .trim()
      .toLowerCase();

  }


  function renderLibrary(){

    const box =
      $(
        "m1001Library"
      );


    if(
      !box
    ){

      return;

    }


    const q =
      normaliseText(
        $(
          "m1001Search"
        )
          ?.value
      );


    const active =
      normaliseText(
        activeCategory
      );


    let rows =

      Array.isArray(
        library
      )

        ? [
            ...library
          ]

        : [];


    /*
      ALL begins with every loaded exercise.
      Only narrow the results when a category
      other than ALL has been selected.
    */

    if(
      active

      &&

      active !==
      "all"
    ){

      rows =
        rows
          .filter(
            exercise =>

              normaliseText(
                exercise
                  ?.category
              ) ===
              active
          );

    }


    /*
      Search across all useful fields.
    */

    if(
      q
    ){

      rows =
        rows
          .filter(
            exercise => {

              const haystack =

                [

                  exercise
                    ?.name,

                  exercise
                    ?.category,

                  exercise
                    ?.movement_pattern,

                  exercise
                    ?.primary_muscle,

                  exercise
                    ?.secondary_muscles,

                  exercise
                    ?.equipment,

                  exercise
                    ?.difficulty

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
          a
            ?.name ||
          ""
        )
          .localeCompare(
            String(
              b
                ?.name ||
              ""
            )
          )
    );


    if(
      !rows.length
    ){

      box.innerHTML = `

        <div
          class="m1001-empty"
        >

          No exercises match this filter.

          <div
            style="
              margin-top:6px;
              color:#555;
              font-size:10px
            "
          >

            ${
              library.length
            }
            exercises loaded

          </div>

        </div>

      `;


      return;

    }


    box.innerHTML = `

      <div
        style="
          color:#666;
          font-size:9px;
          font-weight:900;
          letter-spacing:.08em;
          text-transform:uppercase;
          padding:3px 0 8px
        "
      >

        ${
          rows.length
        }

        exercise${
          rows.length === 1
            ? ""
            : "s"
        }

      </div>


      ${
        rows
          .map(
            exercise => `

              <div
                class="m1001-ex"
              >

                <div>

                  <strong>
                    ${esc(
                      exercise
                        .name
                    )}
                  </strong>


                  <small>

                    ${esc(
                      exercise
                        .primary_muscle

                      ||

                      exercise
                        .category

                      ||

                      "Exercise"
                    )}

                    •

                    ${esc(
                      exercise
                        .equipment

                      ||

                      "Any equipment"
                    )}

                  </small>

                </div>


                <button
                  class="m1001-add"
                  data-add-ex="${exercise.id}"
                >
                  ADD
                </button>

              </div>

            `
          )
          .join(
            ""
          )
      }

    `;


    box
      .querySelectorAll(
        "[data-add-ex]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              addExercise(
                Number(
                  button
                    .dataset
                    .addEx
                )
              );

            };

        }
      );

  }


  /* =========================================
     ADD EXERCISE TO WORKOUT
     ========================================= */

  function addExercise(
    id
  ){

    const ex =
      library
        .find(
          x =>
            Number(
              x.id
            ) ===
            Number(
              id
            )
        );


    if(
      !ex
    ){

      return;

    }


    ensureDay()
      .exercises
      .push({

        exercise_id:
          ex.id,

        name:
          ex.name,

        sets:
          ex.default_sets ||
          3,

        reps:
          ex.default_reps ||
          "8–12",

        rest:
          ex.default_rest_seconds ||
          60,

        rpe:
          "",

        notes:
          ex.coaching_cue ||
          ""

      });


    renderBuiltExercises();

  }


  /* =========================================
     WORKOUT EXERCISES
     ========================================= */

  function renderBuiltExercises(){

    const box =
      $(
        "m1001BuiltList"
      );


    if(
      !box
    ){

      return;

    }


    const exercises =
      ensureDay()
        .exercises;


    box.innerHTML =

      exercises.length

        ? exercises
            .map(
              (
                x,
                i
              ) => `

                <div
                  class="m1001-built"
                >

                  <div
                    class="m1001-built-head"
                  >

                    <div
                      class="m1001-built-name"
                    >

                      ${
                        i + 1
                      }.

                      ${esc(
                        x.name
                      )}

                    </div>


                    <button
                      class="m1001-remove"
                      data-remove="${i}"
                    >
                      REMOVE
                    </button>

                  </div>


                  <div
                    class="m1001-mini"
                  >

                    <input
                      data-field="sets"
                      data-index="${i}"
                      type="number"
                      min="1"
                      max="20"
                      value="${esc(
                        x.sets
                      )}"
                      placeholder="Sets"
                    >


                    <input
                      data-field="reps"
                      data-index="${i}"
                      value="${esc(
                        x.reps
                      )}"
                      placeholder="Reps / time"
                    >


                    <input
                      data-field="rest"
                      data-index="${i}"
                      type="number"
                      min="0"
                      max="900"
                      value="${esc(
                        x.rest
                      )}"
                      placeholder="Rest sec"
                    >


                    <input
                      data-field="rpe"
                      data-index="${i}"
                      value="${esc(
                        x.rpe
                      )}"
                      placeholder="RPE"
                    >

                  </div>


                  <div
                    style="
                      margin-top:7px
                    "
                  >

                    <input
                      class="m1001-input"
                      data-field="notes"
                      data-index="${i}"
                      value="${esc(
                        x.notes
                      )}"
                      placeholder="Coach cue / notes"
                    >

                  </div>

                </div>

              `
            )
            .join(
              ""
            )

        : `

            <div
              class="m1001-empty"
            >
              Add exercises from the library
              to build this workout.
            </div>

          `;


    box
      .querySelectorAll(
        "[data-remove]"
      )
      .forEach(
        btn => {

          btn.onclick =
            () => {

              ensureDay()
                .exercises
                .splice(
                  Number(
                    btn.dataset
                      .remove
                  ),
                  1
                );


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
                      input.dataset
                        .index
                    )
                  ];


              if(
                !row
              ){

                return;

              }


              row[
                input.dataset
                  .field
              ] =
                input.value;

            };

        }
      );

  }


  /* =========================================
     CAPTURE VALUES
     ========================================= */

  function captureHeader(){

    draft.name =
      $(
        "m1001ProgramName"
      )
        ?.value
        ?.trim()

      ||

      "Custom Training Program";


    draft.goal =
      $(
        "m1001Goal"
      )
        ?.value
        ?.trim()

      ||

      "";


    draft.description =
      $(
        "m1001Description"
      )
        ?.value
        ?.trim()

      ||

      "";


    draft.durationWeeks =
      Math.max(
        1,

        Math.min(
          52,

          Number(
            $(
              "m1001Weeks"
            )
              ?.value ||
            4
          )
        )
      );


    const day =
      ensureDay();


    day.title =
      $(
        "m1001DayTitle"
      )
        ?.value
        ?.trim()

      ||

      `Workout ${activeDay}`;


    day.type =
      $(
        "m1001DayType"
      )
        ?.value

      ||

      "Strength";


    day.minutes =
      Number(
        $(
          "m1001Minutes"
        )
          ?.value ||
        45
      );

  }


  /* =========================================
     EVENTS
     ========================================= */

  function bindRenderEvents(){

    $(
      "m1001Search"
    ).oninput =
      renderLibrary;


    document
      .querySelectorAll(
        "#m1001Categories [data-cat]"
      )
      .forEach(
        btn => {

          btn.onclick =
            () => {

              activeCategory =
                btn.dataset
                  .cat;


              document
                .querySelectorAll(
                  "#m1001Categories [data-cat]"
                )
                .forEach(
                  x =>

                    x
                      .classList
                      .toggle(
                        "active",
                        x === btn
                      )

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
        btn => {

          btn.onclick =
            () => {

              captureHeader();


              activeWeek =
                Number(
                  btn.dataset
                    .week
                );


              if(
                activeWeek >
                draft.durationWeeks
              ){

                activeWeek =
                  draft
                    .durationWeeks;

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
        btn => {

          btn.onclick =
            () => {

              captureHeader();


              activeDay =
                Number(
                  btn.dataset
                    .day
                );


              render();

            };

        }
      );


    $(
      "m1001Weeks"
    ).onchange =
      () => {

        captureHeader();


        if(
          activeWeek >
          draft.durationWeeks
        ){

          activeWeek =
            draft
              .durationWeeks;

        }


        render();

      };


    [
      "m1001ProgramName",
      "m1001Goal",
      "m1001Description",
      "m1001DayTitle",
      "m1001DayType",
      "m1001Minutes"
    ]
      .forEach(
        id => {

          const node =
            $(
              id
            );


          if(
            node
          ){

            node.oninput =
              captureHeader;

          }

        }
      );


    $(
      "m1001CreateExercise"
    ).onclick =
      createExercise;


    $(
      "m1001Save"
    ).onclick =
      () =>
        saveProgram(
          false
        );


    if(
      $(
        "m1001Assign"
      )
    ){

      $(
        "m1001Assign"
      ).onclick =
        () =>
          saveProgram(
            true
          );

    }

  }


  /* =========================================
     CREATE LIBRARY EXERCISE
     ========================================= */

  async function createExercise(){

    const name =
      $(
        "m1001NewName"
      )
        .value
        .trim();


    if(
      !name
    ){

      return;

    }


    const c =
      await sb();


    const user =
      await coachUser();


    const {
      data,
      error
    } =
      await
        c
          .from(
            "exercise_library"
          )
          .insert({

            name,

            category:
              $(
                "m1001NewCategory"
              )
                .value
                .trim()

              ||

              "Strength",

            equipment:
              $(
                "m1001NewEquipment"
              )
                .value
                .trim()

              ||

              null,

            created_by:
              user.id

          })
          .select(
            "*"
          )
          .single();


    if(
      error
    ){

      $(
        "m1001Status"
      ).textContent =
        "Could not add exercise: " +
        error.message;


      return;

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
          a.name
        )
          .localeCompare(
            String(
              b.name
            )
          )
    );


    $(
      "m1001NewName"
    ).value =
      "";


    $(
      "m1001NewCategory"
    ).value =
      "";


    $(
      "m1001NewEquipment"
    ).value =
      "";


    renderLibrary();


    $(
      "m1001Status"
    ).textContent =
      "Exercise added to library ✓";

  }


  /* =========================================
     SAVE / ASSIGN PROGRAM
     ========================================= */

  async function saveProgram(
    assign
  ){

    captureHeader();


    const status =
      $(
        "m1001Status"
      );


    status.textContent =
      assign

        ? "Saving and assigning…"

        : "Saving program…";


    try{

      const c =
        await sb();


      const user =
        await coachUser();


      let programId =
        draft.id;


      if(
        programId
      ){

        const {
          error
        } =
          await
            c
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


        if(
          error
        ){

          throw error;

        }


        const {
          error:
            deleteDaysError
        } =
          await
            c
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
        } =
          await
            c
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


        if(
          error
        ){

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
            d =>

              d.exercises
                .length

              ||

              d.title
          )
          .sort(
            (
              a,
              b
            ) =>

              a.week -
              b.week

              ||

              a.day -
              b.day
          );


      for(
        const d
        of days
      ){

        const {
          data:
            dayRow,

          error:
            dayError
        } =
          await
            c
              .from(
                "custom_program_days"
              )
              .insert({

                program_id:
                  programId,

                week_number:
                  d.week,

                day_number:
                  d.day,

                title:
                  d.title,

                workout_type:
                  d.type,

                estimated_minutes:
                  d.minutes ||
                  null,

                notes:
                  d.notes ||
                  null,

                sort_order:
                  (
                    d.week *
                    10
                  )
                  +
                  d.day

              })
              .select(
                "id"
              )
              .single();


        if(
          dayError
        ){

          throw dayError;

        }


        if(
          d.exercises
            .length
        ){

          const payload =
            d.exercises
              .map(
                (
                  x,
                  i
                ) => ({

                  program_day_id:
                    dayRow.id,

                  exercise_id:
                    x.exercise_id ||
                    null,

                  exercise_name:
                    x.name,

                  sets:
                    x.sets

                      ? Number(
                          x.sets
                        )

                      : null,

                  reps:
                    x.reps ||
                    null,

                  rest_seconds:

                    x.rest === ""

                    ||

                    x.rest == null

                      ? null

                      : Number(
                          x.rest
                        ),

                  rpe_target:
                    x.rpe ||
                    null,

                  notes:
                    x.notes ||
                    null,

                  sort_order:
                    i

                })
              );


          const {
            error:
              exerciseError
          } =
            await
              c
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


      if(
        assign
      ){

        if(
          !selectedClient
            ?.id
        ){

          throw new Error(
            "No client selected."
          );

        }


        await
          c
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


        const {
          error:
            assignError
        } =
          await
            c
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

              },
              {
                onConflict:
                  "client_id,program_id"
              }
            );


        if(
          assignError
        ){

          throw assignError;

        }


        status.textContent =
          `Saved and assigned to ${selectedClient.name} ✓`;

      }else{

        status.textContent =
          "Program saved to Mana cloud ✓";

      }

    }catch(
      err
    ){

      status.textContent =
        "Could not save: " +
        (
          err?.message ||
          String(
            err
          )
        );

    }

  }


  /* =========================================
     OPEN BUILDER
     ========================================= */

  async function openBuilder(
    client = null
  ){

    selectedClient =
      client;


    draft =
      newDraft();


    activeWeek =
      1;


    activeDay =
      1;


    activeCategory =
      "ALL";


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


    $(
      "m1001Content"
    ).innerHTML = `

      <div
        class="m1001-card"
      >

        <div
          class="m1001-empty"
        >
          Loading exercise library…
        </div>

      </div>

    `;


    try{

      await
        loadLibrary();


      render();

    }catch(
      err
    ){

      $(
        "m1001Content"
      ).innerHTML = `

        <div
          class="m1001-card"
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
            The custom-program database
            is not ready yet.
          </p>


          <p
            style="
              color:#f0c768;
              font-size:12px
            "
          >
            Run
            <strong>
              v10_00_custom_program_schema_100000.sql
            </strong>
            in Supabase,
            then reopen this builder.
          </p>


          <div
            class="m1001-status"
          >
            ${
              esc(
                err?.message ||
                String(
                  err
                )
              )
            }
          </div>

        </div>

      `;

    }

  }


  /* =========================================
     CLOSE BUILDER
     ========================================= */

  function closeBuilder(){

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
     PROGRAMS PAGE BUTTON
     ========================================= */

  function ensureProgramsButton(){

    const root =
      $(
        "manaV999CoachPrograms"
      );


    if(
      !root

      ||

      $(
        "manaV1001OpenBuilder"
      )
    ){

      return;

    }


    const section =
      document
        .createElement(
          "section"
        );


    section.className =
      "m999-manage";


    section.style
      .marginTop =
        "12px";


    section.innerHTML = `

      <div
        class="m999-manage-top"
      >

        <div>

          <h3>
            Custom Program Builder
          </h3>


          <p>
            Build a completely personalised
            program from the Mana exercise library.
          </p>

        </div>


        <button
          type="button"
          class="m999-btn"
          id="manaV1001OpenBuilder"
        >
          BUILD PROGRAM
        </button>

      </div>

    `;


    root
      .appendChild(
        section
      );


    $(
      "manaV1001OpenBuilder"
    ).onclick =
      () =>
        openBuilder(
          null
        );

  }


  /* =========================================
     CLIENT BUTTON
     ========================================= */

  function ensureClientButton(){

    const view =
      $(
        "coachClientDetailView"
      );


    if(
      !view

      ||

      $(
        "manaV1001BuildForClient"
      )
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


    if(
      !quick
    ){

      return;

    }


    const btn =
      document
        .createElement(
          "button"
        );


    btn.id =
      "manaV1001BuildForClient";


    btn.type =
      "button";


    btn.className =
      "btn secondary";


    btn.style
      .marginTop =
        "10px";


    btn.textContent =
      "Build custom program";


    quick
      .appendChild(
        btn
      );


    btn.onclick =
      () => {

        const name =
          $(
            "detailClientName"
          )
            ?.textContent
            ?.trim()

          ||

          "Client";


        if(
          !selectedClient
            ?.id
        ){

          alert(
            "Open this client again from the coach dashboard so Mana can capture their client ID."
          );


          return;

        }


        openBuilder({

          id:
            selectedClient.id,

          name

        });

      };

  }


  /* =========================================
     CAPTURE CLIENT
     ========================================= */

  function captureClientClicks(){

    document
      .addEventListener(
        "click",
        event => {

          const btn =
            event
              .target
              .closest(
                ".client-open"
              );


          if(
            !btn
          ){

            return;

          }


          const id =
            btn.dataset
              .clientId;


          if(
            id
          ){

            selectedClient = {

              id,

              name:
                btn.dataset
                  .clientName

                ||

                "Client"

            };

          }

        },
        true
      );

  }


  /* =========================================
     INIT
     ========================================= */

  function init(){

    installStyles();


    ensureModal();


    captureClientClicks();


    [
      250,
      800,
      1600,
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


    document
      .querySelector(
        '#bottomNav [data-page="programs"]'
      )
      ?.addEventListener(
        "click",
        () => {

          setTimeout(
            ensureProgramsButton,
            150
          );

        }
      );


    window
      .openManaProgramBuilder =
        openBuilder;


    window
      .MANA_CUSTOM_PROGRAM_BUILDER_BUILD =
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
