/* =========================================
   MANA MOVEMENT TRAINING v10.02.0
   CLIENT CUSTOM PROGRAM ACCESS

   REQUIRES:
   - v10_00_custom_program_schema_100000.sql
   - coach-assigned custom program

   FEATURES
   - Loads client's assigned custom programs
   - Adds them to client Programs screen
   - Opens weeks / workouts / exercises
   - Read-only program delivery layer
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "100200";

  const STYLE_ID =
    "mana-v1002-client-custom-style";

  const ROOT_ID =
    "manaV1002AssignedPrograms";

  const MODAL_ID =
    "manaV1002CustomProgramModal";

  let assignments =
    [];


  const $ =
    id =>
      document
        .getElementById(
          id
        );


  /* =========================================
     SUPABASE
     ========================================= */

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
      "Mana Supabase client is unavailable."
    );

  }


  async function user(){

    const c =
      await sb();


    const {
      data,
      error
    } =
      await
        c.auth
          .getUser();


    if(error){
      throw error;
    }


    return data
      ?.user
      ||
      null;

  }


  /* =========================================
     ESCAPE HTML
     ========================================= */

  function esc(
    value
  ){

    return String(
      value ??
      ""
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

      /* =====================================
         ASSIGNED PROGRAM AREA
         ===================================== */

      #${ROOT_ID}{

        margin:
          12px
          0;

      }


      .m1002-head{

        display:
          flex;

        justify-content:
          space-between;

        align-items:
          flex-end;

        gap:
          10px;

        margin-bottom:
          9px;

      }


      .m1002-head
      h3{

        margin:
          0;

        font-size:
          17px;

      }


      .m1002-head
      span{

        color:
          #b49a42;

        font-size:
          9px;

        font-weight:
          900;

        letter-spacing:
          .1em;

      }


      .m1002-program{

        width:
          100%;

        display:
          flex;

        justify-content:
          space-between;

        gap:
          14px;

        align-items:
          center;

        text-align:
          left;

        border:
          1px solid
          #342e1a;

        border-radius:
          18px;

        background:

          linear-gradient(
            145deg,
            #11100a,
            #090909
          );

        color:
          #fff;

        padding:
          16px;

        margin-bottom:
          8px;

        cursor:
          pointer;

      }


      .m1002-program
      strong{

        font-size:
          15px;

      }


      .m1002-program
      small{

        display:
          block;

        color:
          #7d7d7d;

        margin-top:
          5px;

        line-height:
          1.4;

      }


      .m1002-pill{

        border:
          1px solid
          #55491f;

        border-radius:
          999px;

        padding:
          6px
          8px;

        color:
          #e1c45c;

        font-size:
          8px;

        font-weight:
          900;

        white-space:
          nowrap;

      }


      /* =====================================
         CUSTOM PROGRAM MODAL
         ===================================== */

      #${MODAL_ID}{

        position:
          fixed;

        inset:
          0;

        z-index:
          61000;

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


      .m1002-shell{

        width:
          min(
            720px,
            100%
          );

        margin:
          0 auto;

      }


      .m1002-top{

        position:
          sticky;

        top:
          0;

        z-index:
          4;

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


      .m1002-close{

        min-height:
          42px;

        border:
          1px solid
          #333;

        border-radius:
          13px;

        background:
          #101010;

        color:
          #ddd;

        padding:
          0
          14px;

        font-weight:
          900;

      }


      /* =====================================
         PROGRAM HERO
         ===================================== */

      .m1002-hero{

        border:
          1px solid
          #55491f;

        border-radius:
          22px;

        background:

          linear-gradient(
            145deg,
            #171309,
            #080808
          );

        padding:
          20px;

        margin-bottom:
          12px;

      }


      .m1002-kicker{

        color:
          #d6b850;

        font-size:
          9px;

        font-weight:
          950;

        letter-spacing:
          .16em;

      }


      .m1002-hero
      h2{

        margin:
          7px
          0
          5px;

        font-size:
          30px;

      }


      .m1002-hero
      p{

        margin:
          0;

        color:
          #8d8d8d;

        line-height:
          1.5;

      }


      /* =====================================
         WEEK TABS
         ===================================== */

      .m1002-week{

        display:
          flex;

        gap:
          7px;

        overflow:
          auto;

        margin:
          10px
          0;

      }


      .m1002-week
      button{

        border:
          1px solid
          #333;

        border-radius:
          999px;

        background:
          #0c0c0c;

        color:
          #999;

        padding:
          8px
          10px;

        font-size:
          9px;

        font-weight:
          900;

      }


      .m1002-week
      button.active{

        border-color:
          #6d5c23;

        color:
          #f3d875;

        background:
          #171407;

      }


      /* =====================================
         WORKOUT DAYS
         ===================================== */

      .m1002-day{

        border:
          1px solid
          #292929;

        border-radius:
          18px;

        background:
          #0b0b0b;

        margin-bottom:
          9px;

        overflow:
          hidden;

      }


      .m1002-daybtn{

        width:
          100%;

        display:
          flex;

        justify-content:
          space-between;

        gap:
          12px;

        align-items:
          center;

        border:
          0;

        background:
          none;

        color:
          #fff;

        text-align:
          left;

        padding:
          15px;

        cursor:
          pointer;

      }


      .m1002-daybtn
      small{

        display:
          block;

        color:
          #777;

        margin-top:
          4px;

      }


      .m1002-exercises{

        display:
          none;

        padding:
          0
          15px
          15px;

      }


      .m1002-day.open
      .m1002-exercises{

        display:
          block;

      }


      /* =====================================
         EXERCISES
         ===================================== */

      .m1002-ex{

        padding:
          12px
          0;

        border-top:
          1px solid
          #222;

      }


      .m1002-ex
      strong{

        font-size:
          13px;

      }


      .m1002-ex
      span{

        display:
          block;

        color:
          #d0b757;

        font-size:
          10px;

        margin-top:
          4px;

      }


      .m1002-ex
      p{

        color:
          #777;

        font-size:
          11px;

        margin:
          6px
          0
          0;

        line-height:
          1.4;

      }


      .m1002-empty{

        border:
          1px solid
          #292929;

        border-radius:
          17px;

        padding:
          16px;

        color:
          #777;

        font-size:
          12px;

        background:
          #090909;

      }


      /* =====================================
         MOBILE
         ===================================== */

      @media(
        max-width:
          620px
      ){

        #${MODAL_ID}{

          padding:
            10px
            10px
            32px;

        }


        .m1002-hero{

          padding:
            17px;

          border-radius:
            19px;

        }


        .m1002-hero
        h2{

          font-size:
            27px;

        }


        .m1002-program{

          padding:
            14px;

          border-radius:
            16px;

        }


        .m1002-day{

          border-radius:
            16px;

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
        class="m1002-shell"
      >

        <div
          class="m1002-top"
        >

          <div
            style="
              color:#f3d875;
              font-size:10px;
              font-weight:950;
              letter-spacing:.14em
            "
          >
            MANA • MY PROGRAM
          </div>


          <button
            class="m1002-close"
            id="m1002Close"
          >
            CLOSE
          </button>

        </div>


        <div
          id="m1002Content"
        ></div>

      </div>

    `;


    document
      .body
      .appendChild(
        modal
      );


    $(
      "m1002Close"
    ).onclick =
      closeModal;


    return modal;

  }


  /* =========================================
     LOAD ASSIGNMENTS
     ========================================= */

  async function loadAssignments(){

    const c =
      await sb();


    const u =
      await user();


    if(
      !u
    ){

      return [];

    }


    const {
      data,
      error
    } =
      await
        c
          .from(
            "client_program_assignments"
          )
          .select(`

            id,
            status,
            is_primary,
            start_date,

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
            u.id
          )
          .in(
            "status",
            [
              "active",
              "paused",
              "completed"
            ]
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
      (
        data ||
        []
      )
        .filter(
          x =>
            x.custom_programs
        );


    return assignments;

  }


  /* =========================================
     INSERT ASSIGNED PROGRAM AREA
     ========================================= */

  function ensureRoot(){

    const view =
      $(
        "clientProgramsView"
      );


    if(
      !view
    ){

      return null;

    }


    let root =
      $(
        ROOT_ID
      );


    if(
      !root
    ){

      root =
        document
          .createElement(
            "section"
          );


      root.id =
        ROOT_ID;


      const firstCard =
        view
          .querySelector(
            ".card"
          );


      if(
        firstCard
      ){

        firstCard
          .insertAdjacentElement(
            "beforebegin",
            root
          );

      }else{

        view
          .appendChild(
            root
          );

      }

    }


    return root;

  }


  /* =========================================
     RENDER CLIENT ASSIGNMENTS
     ========================================= */

  async function renderAssignments(){

    const root =
      ensureRoot();


    if(
      !root
    ){

      return;

    }


    try{

      await
        loadAssignments();

    }catch(
      err
    ){

      root.innerHTML = `

        <div
          class="m1002-empty"
        >
          Custom programs will appear here
          after the coach program database
          is enabled.
        </div>

      `;


      return;

    }


    if(
      !assignments.length
    ){

      root.innerHTML =
        "";


      return;

    }


    root.innerHTML = `

      <div
        class="m1002-head"
      >

        <h3>
          Coach Assigned
        </h3>


        <span>
          PERSONALISED
        </span>

      </div>


      ${
        assignments
          .map(
            a => {

              const p =
                a.custom_programs;


              return `

                <button
                  class="m1002-program"
                  data-program="${p.id}"
                >

                  <div>

                    <strong>
                      ${esc(
                        p.name
                      )}
                    </strong>


                    <small>

                      ${esc(
                        p.goal
                        ||
                        p.description
                        ||
                        "Personalised Mana coaching program"
                      )}

                    </small>

                  </div>


                  <span
                    class="m1002-pill"
                  >

                    ${
                      a.is_primary

                        ? "PRIMARY"

                        : String(
                            a.status
                          )
                            .toUpperCase()
                    }

                  </span>

                </button>

              `;

            }
          )
          .join(
            ""
          )
      }

    `;


    root
      .querySelectorAll(
        "[data-program]"
      )
      .forEach(
        btn => {

          btn.onclick =
            () =>
              openProgram(
                btn.dataset
                  .program
              );

        }
      );

  }


  /* =========================================
     OPEN ASSIGNED PROGRAM
     ========================================= */

  async function openProgram(
    programId
  ){

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
      "m1002Content"
    ).innerHTML = `

      <div
        class="m1002-empty"
      >
        Loading your program…
      </div>

    `;


    try{

      const c =
        await sb();


      const {
        data:
          program,

        error:
          programError
      } =
        await
          c
            .from(
              "custom_programs"
            )
            .select(
              "*"
            )
            .eq(
              "id",
              programId
            )
            .single();


      if(
        programError
      ){

        throw programError;

      }


      const {
        data:
          days,

        error:
          dayError
      } =
        await
          c
            .from(
              "custom_program_days"
            )
            .select(
              "*"
            )
            .eq(
              "program_id",
              programId
            )
            .order(
              "week_number"
            )
            .order(
              "day_number"
            );


      if(
        dayError
      ){

        throw dayError;

      }


      const dayIds =
        (
          days ||
          []
        )
          .map(
            x =>
              x.id
          );


      let exercises =
        [];


      if(
        dayIds.length
      ){

        const {
          data,
          error
        } =
          await
            c
              .from(
                "custom_program_exercises"
              )
              .select(
                "*"
              )
              .in(
                "program_day_id",
                dayIds
              )
              .order(
                "sort_order"
              );


        if(
          error
        ){

          throw error;

        }


        exercises =
          data ||
          [];

      }


      renderProgram(
        program,
        days ||
        [],
        exercises
      );

    }catch(
      err
    ){

      $(
        "m1002Content"
      ).innerHTML = `

        <div
          class="m1002-empty"
        >

          Could not load program:

          ${esc(
            err?.message
            ||
            String(
              err
            )
          )}

        </div>

      `;

    }

  }


  /* =========================================
     RENDER PROGRAM
     ========================================= */

  function renderProgram(
    program,
    days,
    exercises
  ){

    const weeks =

      [
        ...new Set(
          days
            .map(
              x =>
                Number(
                  x.week_number
                )
            )
        )
      ]
        .sort(
          (
            a,
            b
          ) =>
            a - b
        );


    const firstWeek =
      weeks[
        0
      ]
      ||
      1;


    $(
      "m1002Content"
    ).innerHTML = `

      <section
        class="m1002-hero"
      >

        <div
          class="m1002-kicker"
        >
          COACH ASSIGNED PROGRAM
        </div>


        <h2>
          ${esc(
            program.name
          )}
        </h2>


        <p>

          ${esc(
            program.description
            ||
            program.goal
            ||
            "Personalised training program"
          )}

        </p>

      </section>


      <div
        class="m1002-week"
      >

        ${
          weeks
            .map(
              w => `

                <button
                  data-week="${w}"
                  class="${
                    w === firstWeek
                      ? "active"
                      : ""
                  }"
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
        id="m1002Days"
      ></div>

    `;


    const drawWeek =
      week => {

        document
          .querySelectorAll(
            `#${MODAL_ID} [data-week]`
          )
          .forEach(
            button => {

              button
                .classList
                .toggle(
                  "active",
                  Number(
                    button
                      .dataset
                      .week
                  ) ===
                  week
                );

            }
          );


        const list =
          days
            .filter(
              x =>
                Number(
                  x.week_number
                ) ===
                week
            );


        $(
          "m1002Days"
        ).innerHTML =

          list.length

            ? list
                .map(
                  day => {

                    const dayExercises =
                      exercises
                        .filter(
                          x =>
                            x.program_day_id ===
                            day.id
                        );


                    return `

                      <section
                        class="m1002-day"
                      >

                        <button
                          class="m1002-daybtn"
                        >

                          <div>

                            <strong>

                              DAY ${day.day_number}

                              •

                              ${esc(
                                day.title
                              )}

                            </strong>


                            <small>

                              ${esc(
                                day.workout_type
                              )}

                              ${
                                day.estimated_minutes

                                  ? ` • ${day.estimated_minutes} min`

                                  : ""
                              }

                            </small>

                          </div>


                          <span
                            style="
                              color:#d9bd59
                            "
                          >
                            ›
                          </span>

                        </button>


                        <div
                          class="m1002-exercises"
                        >

                          ${
                            dayExercises.length

                              ? dayExercises
                                  .map(
                                    x => `

                                      <div
                                        class="m1002-ex"
                                      >

                                        <strong>
                                          ${esc(
                                            x.exercise_name
                                          )}
                                        </strong>


                                        <span>

                                          ${
                                            x.sets
                                              ? `${x.sets} sets`
                                              : ""
                                          }

                                          ${
                                            x.reps
                                              ? ` × ${esc(
                                                  x.reps
                                                )}`
                                              : ""
                                          }

                                          ${
                                            x.rest_seconds
                                              != null

                                              ? ` • ${x.rest_seconds}s rest`

                                              : ""
                                          }

                                          ${
                                            x.rpe_target

                                              ? ` • RPE ${esc(
                                                  x.rpe_target
                                                )}`

                                              : ""
                                          }

                                        </span>


                                        ${
                                          x.notes

                                            ? `

                                              <p>
                                                ${esc(
                                                  x.notes
                                                )}
                                              </p>

                                            `

                                            : ""
                                        }

                                      </div>

                                    `
                                  )
                                  .join(
                                    ""
                                  )

                              : `

                                  <div
                                    class="m1002-empty"
                                  >
                                    No exercises added
                                    to this workout yet.
                                  </div>

                                `
                          }

                        </div>

                      </section>

                    `;

                  }
                )
                .join(
                  ""
                )

            : `

                <div
                  class="m1002-empty"
                >
                  No workouts in this week.
                </div>

              `;


        $(
          "m1002Days"
        )
          .querySelectorAll(
            ".m1002-daybtn"
          )
          .forEach(
            btn => {

              btn.onclick =
                () => {

                  btn
                    .closest(
                      ".m1002-day"
                    )
                    .classList
                    .toggle(
                      "open"
                    );

                };

            }
          );

      };


    document
      .querySelectorAll(
        `#${MODAL_ID} [data-week]`
      )
      .forEach(
        btn => {

          btn.onclick =
            () =>

              drawWeek(
                Number(
                  btn.dataset
                    .week
                )
              );

        }
      );


    drawWeek(
      firstWeek
    );

  }


  /* =========================================
     CLOSE PROGRAM
     ========================================= */

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
     PROGRAM TAB NAVIGATION
     ========================================= */

  function bindProgramsNav(){

    document
      .querySelector(
        '#bottomNav [data-page="programs"]'
      )
      ?.addEventListener(
        "click",
        () => {

          setTimeout(
            renderAssignments,
            220
          );

        }
      );

  }


  /* =========================================
     INIT
     ========================================= */

  function init(){

    installStyles();


    ensureModal();


    ensureRoot();


    bindProgramsNav();


    [
      500,
      1400,
      2800
    ]
      .forEach(
        delay => {

          setTimeout(
            () => {

              const view =
                $(
                  "clientProgramsView"
                );


              if(
                view

                &&

                !view
                  .classList
                  .contains(
                    "hide"
                  )
              ){

                renderAssignments();

              }

            },
            delay
          );

        }
      );


    window
      .refreshManaAssignedPrograms =
        renderAssignments;


    window
      .MANA_CLIENT_CUSTOM_PROGRAM_BUILD =
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
