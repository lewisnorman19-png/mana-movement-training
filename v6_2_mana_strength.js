/* =========================================
   MANA MOVEMENT TRAINING v6.2
   PROFILE-DRIVEN PROGRAM GENERATOR

   GOAL • DAYS • EXPERIENCE • EQUIPMENT
   ========================================= */

(() => {
  "use strict";


  const STYLE_ID =
    "mana-strength-v62-style";

  const MODAL_ID =
    "manaStrengthModal";

  const STORE_KEY =
    "mana-strength-v62-program";


  /* =========================================
     STYLES
     ========================================= */

  function injectStyles() {
    if (
      document.getElementById(
        STYLE_ID
      )
    ) return;


    const style =
      document.createElement(
        "style"
      );


    style.id =
      STYLE_ID;


    style.textContent = `

      .mana-strength-card{
        cursor:pointer !important;
        opacity:1 !important;
      }

      .mana-strength-card:active{
        transform:scale(.99);
      }

      .mana-strength-arrow{
        color:#f3d875;
        font-size:30px;
        line-height:1;
      }

      #${MODAL_ID}{
        position:fixed;
        inset:0;
        z-index:20000;
        display:none;
        background:#050505;
        overflow:auto;

        padding:
          calc(env(safe-area-inset-top) + 18px)
          18px
          calc(100px + env(safe-area-inset-bottom));
      }

      #${MODAL_ID}.open{
        display:block;
      }

      .mana-strength-shell{
        width:min(520px,100%);
        margin:auto;
      }

      .mana-strength-head{
        display:flex;
        justify-content:space-between;
        align-items:flex-start;
        gap:16px;
        margin-bottom:20px;
      }

      .mana-strength-head h1{
        margin:6px 0 4px;
        font-size:34px;
      }

      .mana-strength-close{
        width:44px;
        height:44px;
        flex:0 0 44px;
        border-radius:50%;
        border:1px solid #333;
        background:#111;
        color:white;
        font-size:24px;
      }

      .mana-strength-section{
        background:#101010;
        border:1px solid #292310;
        border-radius:22px;
        padding:18px;
        margin:14px 0;
      }

      .mana-strength-section h3{
        margin:0 0 12px;
      }

      .mana-strength-options{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:10px;
      }

      .mana-strength-option{
        min-height:52px;
        border-radius:14px;
        border:1px solid #333;
        background:#0b0b0b;
        color:#ddd;
        font-weight:700;
        padding:10px;
      }

      .mana-strength-option.active{
        background:#f3d875;
        border-color:#f3d875;
        color:#090909;
      }

      .mana-strength-build{
        width:100%;
        min-height:58px;
        border:0;
        border-radius:16px;
        background:#f3d875;
        color:#111;
        font-size:17px;
        font-weight:900;
        margin-top:12px;
      }

      .mana-strength-program{
        margin-top:18px;
      }

      .mana-strength-day{
        border:1px solid #292929;
        background:#0b0b0b;
        border-radius:18px;
        padding:16px;
        margin-top:10px;
      }

      .mana-strength-day h3{
        margin:0 0 10px;
        color:#f3d875;
      }

      .mana-strength-exercise{
        padding:10px 0;
        border-top:1px solid #242424;
      }

      .mana-strength-exercise:first-of-type{
        border-top:0;
      }

      .mana-strength-exercise strong{
        display:block;
      }

      .mana-strength-exercise span{
        color:#999;
        font-size:13px;
      }

      .mana-strength-summary{
        color:#aaa;
        font-size:14px;
        line-height:1.5;
      }

      @media(max-width:380px){
        .mana-strength-options{
          grid-template-columns:1fr;
        }
      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* =========================================
     OLD HOME CARD
     ========================================= */

  function findStrengthCard() {
    const candidates =
      [
        ...document.querySelectorAll(
          "#clientView .day"
        )
      ];


    return candidates.find(
      el => {

        const text =
          (
            el.textContent ||
            ""
          ).toUpperCase();


        return (
          text.includes(
            "MANA STRONG"
          ) ||
          text.includes(
            "MANA STRENGTH"
          )
        );

      }
    );
  }


  function upgradeHomeCard() {
    const card =
      findStrengthCard();


    if (!card) return;


    card.classList.add(
      "mana-strength-card"
    );


    const strong =
      card.querySelector(
        "strong"
      );


    if (strong) {
      strong.textContent =
        "MANA STRENGTH";
    }


    const muted =
      card.querySelectorAll(
        ".tiny"
      );


    if (muted[0]) {
      muted[0].textContent =
        "Personalised strength training";
    }


    if (muted[1]) {
      muted[1].textContent =
        "VIEW YOUR PROGRAM";

      muted[1]
        .classList
        .add(
          "gold"
        );

      muted[1]
        .classList
        .remove(
          "muted"
        );
    }


    if (
      !card.querySelector(
        ".mana-strength-arrow"
      )
    ) {

      const arrow =
        document.createElement(
          "div"
        );

      arrow.className =
        "mana-strength-arrow";

      arrow.textContent =
        "›";

      card.appendChild(
        arrow
      );
    }


    card.onclick =
      openModal;
  }


  /* =========================================
     BUILDER MODAL
     ========================================= */

  function buildModal() {
    if (
      document.getElementById(
        MODAL_ID
      )
    ) return;


    const modal =
      document.createElement(
        "div"
      );


    modal.id =
      MODAL_ID;


    modal.innerHTML = `

      <div class="mana-strength-shell">

        <div class="mana-strength-head">

          <div>

            <span class="pill">
              MANA STRENGTH
            </span>

            <h1>
              Your program
            </h1>

            <div class="muted">
              Training built around your profile.
            </div>

          </div>


          <button
            class="mana-strength-close"
            type="button"
            id="manaStrengthClose"
          >
            ×
          </button>

        </div>


        <div class="mana-strength-section">

          <h3>
            Your goal
          </h3>

          <div
            class="mana-strength-options"
            data-strength-group="goal"
          >

            <button
              class="mana-strength-option active"
              data-value="Build muscle"
            >
              Build muscle
            </button>


            <button
              class="mana-strength-option"
              data-value="Get stronger"
            >
              Get stronger
            </button>


            <button
              class="mana-strength-option"
              data-value="General fitness"
            >
              General fitness
            </button>


            <button
              class="mana-strength-option"
              data-value="Return to training"
            >
              Return to training
            </button>

          </div>

        </div>


        <div class="mana-strength-section">

          <h3>
            Training days
          </h3>

          <div
            class="mana-strength-options"
            data-strength-group="days"
          >

            <button
              class="mana-strength-option"
              data-value="2"
            >
              2 days
            </button>


            <button
              class="mana-strength-option active"
              data-value="3"
            >
              3 days
            </button>


            <button
              class="mana-strength-option"
              data-value="4"
            >
              4 days
            </button>


            <button
              class="mana-strength-option"
              data-value="5"
            >
              5 days
            </button>

          </div>

        </div>


        <div class="mana-strength-section">

          <h3>
            Experience
          </h3>

          <div
            class="mana-strength-options"
            data-strength-group="experience"
          >

            <button
              class="mana-strength-option"
              data-value="Beginner"
            >
              Beginner
            </button>


            <button
              class="mana-strength-option active"
              data-value="Intermediate"
            >
              Intermediate
            </button>


            <button
              class="mana-strength-option"
              data-value="Experienced"
            >
              Experienced
            </button>


            <button
              class="mana-strength-option"
              data-value="Returning"
            >
              Returning
            </button>

          </div>

        </div>


        <div class="mana-strength-section">

          <h3>
            Equipment
          </h3>

          <div
            class="mana-strength-options"
            data-strength-group="equipment"
          >

            <button
              class="mana-strength-option active"
              data-value="Full gym"
            >
              Full gym
            </button>


            <button
              class="mana-strength-option"
              data-value="Dumbbells"
            >
              Dumbbells
            </button>


            <button
              class="mana-strength-option"
              data-value="Home basics"
            >
              Home basics
            </button>


            <button
              class="mana-strength-option"
              data-value="Bodyweight"
            >
              Bodyweight
            </button>

          </div>


          <button
            class="mana-strength-build"
            id="manaStrengthBuild"
            type="button"
          >
            Build my program
          </button>

        </div>


        <div
          id="manaStrengthProgram"
          class="mana-strength-program"
        ></div>

      </div>

    `;


    document.body.appendChild(
      modal
    );


    modal
      .querySelector(
        "#manaStrengthClose"
      )
      .onclick =
        closeModal;


    modal
      .querySelector(
        "#manaStrengthBuild"
      )
      .onclick =
        buildProgram;


    modal
      .querySelectorAll(
        ".mana-strength-option"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              const group =
                button.closest(
                  "[data-strength-group]"
                );


              group
                .querySelectorAll(
                  ".mana-strength-option"
                )
                .forEach(
                  item =>
                    item
                      .classList
                      .remove(
                        "active"
                      )
                );


              button
                .classList
                .add(
                  "active"
                );
            };

        }
      );
  }


  function selected(
    group
  ) {
    return (
      document
        .querySelector(
          `[data-strength-group="${group}"] .active`
        )
        ?.dataset
        .value ||
      ""
    );
  }


  /* =========================================
     EQUIPMENT LIBRARIES
     ========================================= */

  const LIBRARIES = {

    "Full gym": {

      squat:
        "Back Squat",

      squat2:
        "Front Squat",

      hinge:
        "Romanian Deadlift",

      hinge2:
        "Deadlift",

      horizontalPush:
        "Bench Press",

      horizontalPush2:
        "Incline DB Press",

      horizontalPull:
        "Seated Cable Row",

      horizontalPull2:
        "Chest Supported Row",

      verticalPush:
        "Shoulder Press",

      verticalPull:
        "Lat Pulldown",

      quad:
        "Leg Press",

      glute:
        "Hip Thrust",

      singleLeg:
        "Walking Lunge",

      hamstring:
        "Leg Curl",

      calf:
        "Calf Raise",

      sideDelt:
        "DB Lateral Raise",

      rearDelt:
        "Rear Delt Fly",

      biceps:
        "Biceps Curl",

      triceps:
        "Triceps Pressdown",

      core:
        "Cable Crunch",

      core2:
        "Plank"
    },


    "Dumbbells": {

      squat:
        "Goblet Squat",

      squat2:
        "DB Front Squat",

      hinge:
        "DB Romanian Deadlift",

      hinge2:
        "DB Deadlift",

      horizontalPush:
        "DB Floor Press",

      horizontalPush2:
        "Incline DB Press",

      horizontalPull:
        "One Arm DB Row",

      horizontalPull2:
        "Chest Supported DB Row",

      verticalPush:
        "DB Shoulder Press",

      verticalPull:
        "DB Pullover",

      quad:
        "DB Split Squat",

      glute:
        "DB Hip Thrust",

      singleLeg:
        "DB Reverse Lunge",

      hamstring:
        "DB Romanian Deadlift",

      calf:
        "DB Calf Raise",

      sideDelt:
        "DB Lateral Raise",

      rearDelt:
        "DB Rear Delt Fly",

      biceps:
        "DB Biceps Curl",

      triceps:
        "DB Overhead Triceps Extension",

      core:
        "DB Dead Bug",

      core2:
        "Plank"
    },


    "Home basics": {

      squat:
        "Band Goblet Squat",

      squat2:
        "Tempo Squat",

      hinge:
        "Band Romanian Deadlift",

      hinge2:
        "Band Good Morning",

      horizontalPush:
        "Push-Up",

      horizontalPush2:
        "Band Chest Press",

      horizontalPull:
        "Band Row",

      horizontalPull2:
        "Single Arm Band Row",

      verticalPush:
        "Band Shoulder Press",

      verticalPull:
        "Band Pulldown",

      quad:
        "Step-Up",

      glute:
        "Glute Bridge",

      singleLeg:
        "Reverse Lunge",

      hamstring:
        "Sliding Leg Curl",

      calf:
        "Standing Calf Raise",

      sideDelt:
        "Band Lateral Raise",

      rearDelt:
        "Band Pull Apart",

      biceps:
        "Band Biceps Curl",

      triceps:
        "Band Triceps Pressdown",

      core:
        "Dead Bug",

      core2:
        "Plank"
    },


    "Bodyweight": {

      squat:
        "Bodyweight Squat",

      squat2:
        "Tempo Squat",

      hinge:
        "Single Leg Hip Hinge",

      hinge2:
        "Hip Hinge",

      horizontalPush:
        "Push-Up",

      horizontalPush2:
        "Incline Push-Up",

      horizontalPull:
        "Prone Row",

      horizontalPull2:
        "Reverse Snow Angel",

      verticalPush:
        "Pike Push-Up",

      verticalPull:
        "Prone Lat Pull",

      quad:
        "Split Squat",

      glute:
        "Glute Bridge",

      singleLeg:
        "Reverse Lunge",

      hamstring:
        "Hamstring Walkout",

      calf:
        "Single Leg Calf Raise",

      sideDelt:
        "Wall Lateral Press",

      rearDelt:
        "Reverse Snow Angel",

      biceps:
        "Self Resisted Curl",

      triceps:
        "Close Grip Push-Up",

      core:
        "Dead Bug",

      core2:
        "Plank"
    }

  };


  /* =========================================
     GOAL TARGETS

     Strength:
       6–8 reps

     Muscle:
       10–12 reps

     General:
       8–12 reps

     Return:
       8–10 reps

     Experience changes volume / sets,
     not the goal-specific rep range.
     ========================================= */

  function targetStyle(
    goal,
    experience
  ) {

    const lowerVolume =
      experience ===
        "Beginner" ||
      experience ===
        "Returning";


    if (
      goal ===
      "Get stronger"
    ) {

      return {

        main:
          lowerVolume
            ? "3 × 6–8"
            : "4 × 6–8",

        secondary:
          lowerVolume
            ? "2 × 6–8"
            : "3 × 6–8",

        accessory:
          lowerVolume
            ? "2 × 8–10"
            : "3 × 8–10",

        core:
          lowerVolume
            ? "2 sets"
            : "3 sets"

      };
    }


    if (
      goal ===
      "General fitness"
    ) {

      return {

        main:
          lowerVolume
            ? "2 × 8–12"
            : "3 × 8–12",

        secondary:
          lowerVolume
            ? "2 × 8–12"
            : "3 × 8–12",

        accessory:
          lowerVolume
            ? "2 × 10–12"
            : "3 × 10–12",

        core:
          lowerVolume
            ? "2 sets"
            : "3 sets"

      };
    }


    if (
      goal ===
      "Return to training"
    ) {

      return {

        main:
          "2 × 8–10",

        secondary:
          "2 × 8–10",

        accessory:
          "2 × 10–12",

        core:
          "2 sets"

      };
    }


    /*
      Default:
      Build muscle
    */

    return {

      main:
        lowerVolume
          ? "3 × 10–12"
          : "4 × 10–12",

      secondary:
        lowerVolume
          ? "2 × 10–12"
          : "3 × 10–12",

      accessory:
        lowerVolume
          ? "2 × 12–15"
          : "3 × 12–15",

      core:
        lowerVolume
          ? "2 sets"
          : "3 sets"

    };
  }


  /* =========================================
     SESSION BUILDERS
     ========================================= */

  function fullBodyA(
    ex,
    t
  ) {

    return [
      "Full Body A",
      [

        [
          ex.squat,
          t.main
        ],

        [
          ex.horizontalPush,
          t.main
        ],

        [
          ex.horizontalPull,
          t.secondary
        ],

        [
          ex.hinge,
          t.secondary
        ],

        [
          ex.verticalPush,
          t.accessory
        ],

        [
          ex.core2,
          t.core
        ]

      ]
    ];
  }


  function fullBodyB(
    ex,
    t
  ) {

    return [
      "Full Body B",
      [

        [
          ex.hinge2,
          t.main
        ],

        [
          ex.horizontalPush2,
          t.secondary
        ],

        [
          ex.verticalPull,
          t.secondary
        ],

        [
          ex.quad,
          t.secondary
        ],

        [
          ex.sideDelt,
          t.accessory
        ],

        [
          ex.core,
          t.core
        ]

      ]
    ];
  }


  function fullBodyC(
    ex,
    t
  ) {

    return [
      "Full Body C",
      [

        [
          ex.squat2,
          t.main
        ],

        [
          ex.horizontalPush2,
          t.secondary
        ],

        [
          ex.horizontalPull2,
          t.secondary
        ],

        [
          ex.glute,
          t.secondary
        ],

        [
          ex.biceps,
          t.accessory
        ],

        [
          ex.triceps,
          t.accessory
        ]

      ]
    ];
  }


  function upperA(
    ex,
    t
  ) {

    return [
      "Upper A",
      [

        [
          ex.horizontalPush,
          t.main
        ],

        [
          ex.horizontalPull,
          t.main
        ],

        [
          ex.verticalPush,
          t.secondary
        ],

        [
          ex.verticalPull,
          t.secondary
        ],

        [
          ex.biceps,
          t.accessory
        ],

        [
          ex.triceps,
          t.accessory
        ]

      ]
    ];
  }


  function lowerA(
    ex,
    t
  ) {

    return [
      "Lower A",
      [

        [
          ex.squat,
          t.main
        ],

        [
          ex.hinge,
          t.main
        ],

        [
          ex.quad,
          t.secondary
        ],

        [
          ex.hamstring,
          t.secondary
        ],

        [
          ex.calf,
          t.accessory
        ],

        [
          ex.core2,
          t.core
        ]

      ]
    ];
  }


  function upperB(
    ex,
    t
  ) {

    return [
      "Upper B",
      [

        [
          ex.horizontalPush2,
          t.secondary
        ],

        [
          ex.horizontalPull2,
          t.secondary
        ],

        [
          ex.verticalPush,
          t.secondary
        ],

        [
          ex.verticalPull,
          t.secondary
        ],

        [
          ex.sideDelt,
          t.accessory
        ],

        [
          ex.rearDelt,
          t.accessory
        ]

      ]
    ];
  }


  function lowerB(
    ex,
    t
  ) {

    return [
      "Lower B",
      [

        [
          ex.hinge2,
          t.main
        ],

        [
          ex.squat2,
          t.secondary
        ],

        [
          ex.glute,
          t.secondary
        ],

        [
          ex.singleLeg,
          t.secondary
        ],

        [
          ex.calf,
          t.accessory
        ],

        [
          ex.core,
          t.core
        ]

      ]
    ];
  }


  function push(
    ex,
    t
  ) {

    return [
      "Push",
      [

        [
          ex.horizontalPush,
          t.main
        ],

        [
          ex.horizontalPush2,
          t.secondary
        ],

        [
          ex.verticalPush,
          t.secondary
        ],

        [
          ex.sideDelt,
          t.accessory
        ],

        [
          ex.triceps,
          t.accessory
        ]

      ]
    ];
  }


  function pull(
    ex,
    t
  ) {

    return [
      "Pull",
      [

        [
          ex.hinge2,
          t.main
        ],

        [
          ex.verticalPull,
          t.secondary
        ],

        [
          ex.horizontalPull,
          t.secondary
        ],

        [
          ex.rearDelt,
          t.accessory
        ],

        [
          ex.biceps,
          t.accessory
        ]

      ]
    ];
  }


  function legs(
    ex,
    t
  ) {

    return [
      "Legs",
      [

        [
          ex.squat,
          t.main
        ],

        [
          ex.hinge,
          t.secondary
        ],

        [
          ex.quad,
          t.secondary
        ],

        [
          ex.hamstring,
          t.secondary
        ],

        [
          ex.calf,
          t.accessory
        ]

      ]
    ];
  }


  function upperMixed(
    ex,
    t
  ) {

    return [
      "Upper",
      [

        [
          ex.horizontalPush2,
          t.secondary
        ],

        [
          ex.horizontalPull2,
          t.secondary
        ],

        [
          ex.verticalPush,
          t.secondary
        ],

        [
          ex.verticalPull,
          t.secondary
        ],

        [
          ex.biceps,
          t.accessory
        ],

        [
          ex.triceps,
          t.accessory
        ]

      ]
    ];
  }


  function lowerMixed(
    ex,
    t
  ) {

    return [
      "Lower",
      [

        [
          ex.squat2,
          t.secondary
        ],

        [
          ex.glute,
          t.secondary
        ],

        [
          ex.singleLeg,
          t.secondary
        ],

        [
          ex.hamstring,
          t.secondary
        ],

        [
          ex.calf,
          t.accessory
        ],

        [
          ex.core,
          t.core
        ]

      ]
    ];
  }


  /* =========================================
     BUILD SPLIT
     ========================================= */

  function createSessions(
    days,
    equipment,
    goal,
    experience
  ) {

    const exercises =
      LIBRARIES[
        equipment
      ] ||
      LIBRARIES[
        "Full gym"
      ];


    const targets =
      targetStyle(
        goal,
        experience
      );


    if (
      days ===
      2
    ) {

      return [

        fullBodyA(
          exercises,
          targets
        ),

        fullBodyB(
          exercises,
          targets
        )

      ];
    }


    if (
      days ===
      3
    ) {

      return [

        fullBodyA(
          exercises,
          targets
        ),

        fullBodyB(
          exercises,
          targets
        ),

        fullBodyC(
          exercises,
          targets
        )

      ];
    }


    if (
      days ===
      4
    ) {

      return [

        upperA(
          exercises,
          targets
        ),

        lowerA(
          exercises,
          targets
        ),

        upperB(
          exercises,
          targets
        ),

        lowerB(
          exercises,
          targets
        )

      ];
    }


    return [

      push(
        exercises,
        targets
      ),

      pull(
        exercises,
        targets
      ),

      legs(
        exercises,
        targets
      ),

      upperMixed(
        exercises,
        targets
      ),

      lowerMixed(
        exercises,
        targets
      )

    ];
  }


  /* =========================================
     BUILD PROGRAM
     ========================================= */

  function buildProgram() {

    const goal =
      selected(
        "goal"
      ) ||
      "Build muscle";


    const days =
      Number(
        selected(
          "days"
        )
      ) || 3;


    const experience =
      selected(
        "experience"
      ) ||
      "Intermediate";


    const equipment =
      selected(
        "equipment"
      ) ||
      "Full gym";


    const sessions =
      createSessions(
        days,
        equipment,
        goal,
        experience
      );


    const program = {

      goal,

      days,

      experience,

      equipment,

      createdAt:
        new Date()
          .toISOString(),

      sessions

    };


    localStorage.setItem(
      STORE_KEY,
      JSON.stringify(
        program
      )
    );


    renderProgram(
      program
    );


    window.dispatchEvent(
      new CustomEvent(
        "mana:strength-program-built",
        {
          detail:
            program
        }
      )
    );


    window.dispatchEvent(
      new CustomEvent(
        "mana:strength-synced"
      )
    );
  }


  /* =========================================
     PROGRAM PREVIEW
     ========================================= */

  function renderProgram(
    program
  ) {

    const container =
      document.getElementById(
        "manaStrengthProgram"
      );


    if (!container) return;


    container.innerHTML = `

      <div
        class="mana-strength-section"
      >

        <span class="pill">
          YOUR PROGRAM
        </span>


        <h2>
          MANA STRENGTH
        </h2>


        <div
          class="mana-strength-summary"
        >
          ${program.goal}
          •
          ${program.days} days/week
          •
          ${program.experience}
          •
          ${program.equipment}
        </div>


        ${
          program.sessions
            .map(
              (
                session,
                index
              ) => `

                <div
                  class="mana-strength-day"
                >

                  <h3>
                    Day ${
                      index + 1
                    }
                    •
                    ${session[0]}
                  </h3>


                  ${
                    session[1]
                      .map(
                        exercise => `

                          <div
                            class="mana-strength-exercise"
                          >

                            <strong>
                              ${exercise[0]}
                            </strong>

                            <span>
                              ${exercise[1]}
                            </span>

                          </div>

                        `
                      )
                      .join("")
                  }

                </div>

              `
            )
            .join("")
        }

      </div>

    `;
  }


  function restoreProgram() {

    try {

      const saved =
        JSON.parse(
          localStorage.getItem(
            STORE_KEY
          )
        );


      if (
        saved?.sessions
      ) {

        renderProgram(
          saved
        );
      }

    } catch (_) {}
  }


  /* =========================================
     MODAL
     ========================================= */

  function openModal() {

    buildModal();


    document
      .getElementById(
        MODAL_ID
      )
      ?.classList
      .add(
        "open"
      );


    restoreProgram();
  }


  function closeModal() {

    document
      .getElementById(
        MODAL_ID
      )
      ?.classList
      .remove(
        "open"
      );


    if (
      typeof
        window
          .openManaProgram ===
      "function"
    ) {

      setTimeout(
        () => {

          window
            .openManaProgram(
              "strength"
            );

        },
        50
      );
    }
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    injectStyles();

    buildModal();


    setTimeout(
      upgradeHomeCard,
      300
    );


    setTimeout(
      upgradeHomeCard,
      1000
    );
  }


  window.buildManaStrengthProgram =
    buildProgram;


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {

    init();
  }

})();
