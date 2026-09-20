/* =========================================
   MANA MOVEMENT TRAINING v9.16.0
   EXERCISE COACH

   - HOW TO PERFORM BUTTON
   - TECHNIQUE GUIDE
   - SETUP
   - EXECUTION
   - COMMON MISTAKES
   - VIDEO DEMO SEARCH
   ========================================= */

(() => {
  "use strict";


  const STYLE_ID =
    "mana-v9160-exercise-coach-style";

  const MODAL_ID =
    "manaV916ExerciseCoach";


  let activeExercise =
    "";


  /* =========================================
     HELPERS
     ========================================= */

  function esc(
    value
  ) {
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
      );
  }


  function normalise(
    value
  ) {
    return String(
      value || ""
    )
      .trim()
      .toLowerCase();
  }


  /* =========================================
     EXERCISE GUIDE ENGINE
     ========================================= */

  function guideFor(
    exerciseName
  ) {

    const name =
      normalise(
        exerciseName
      );


    /*
      DEADLIFT / HIP HINGE
    */

    if (
      name.includes(
        "deadlift"
      ) ||
      name.includes(
        "good morning"
      ) ||
      name.includes(
        "hip hinge"
      )
    ) {

      return {

        setup:
          "Stand with your feet around hip-width apart. Brace your core and keep the weight close to your body.",

        execution:
          "Push your hips back while keeping your spine neutral. Drive through the floor and bring the hips forward to stand tall.",

        cues:[
          "Brace before every rep",
          "Push the hips back",
          "Keep the weight close",
          "Drive through your feet",
          "Finish tall without leaning back"
        ],

        mistakes:[
          "Rounding the lower back",
          "Pulling mainly with the arms",
          "Letting the weight drift away from the body",
          "Hyperextending at the top"
        ]

      };

    }


    /*
      SQUAT
    */

    if (
      name.includes(
        "squat"
      )
    ) {

      return {

        setup:
          "Set your feet around shoulder-width apart with toes turned slightly out. Brace your trunk before descending.",

        execution:
          "Sit down between your hips while allowing the knees to track over the toes. Drive through the whole foot to stand.",

        cues:[
          "Brace your core",
          "Keep your whole foot planted",
          "Knees track over toes",
          "Control the descent",
          "Drive up with intent"
        ],

        mistakes:[
          "Knees collapsing inward",
          "Heels lifting",
          "Losing trunk position",
          "Dropping too quickly into the bottom"
        ]

      };

    }


    /*
      LUNGE / SPLIT SQUAT
    */

    if (
      name.includes(
        "lunge"
      ) ||
      name.includes(
        "split squat"
      )
    ) {

      return {

        setup:
          "Take a stable split stance with enough space between your feet to maintain balance.",

        execution:
          "Lower your body under control, keeping the front foot planted. Drive through the front leg to return to the start.",

        cues:[
          "Stay balanced",
          "Keep the front foot planted",
          "Control the lowering phase",
          "Drive through the front leg",
          "Keep the knee tracking naturally"
        ],

        mistakes:[
          "Taking too narrow a stance",
          "Front heel lifting",
          "Knee collapsing inward",
          "Rushing the movement"
        ]

      };

    }


    /*
      STEP UP
    */

    if (
      name.includes(
        "step-up"
      ) ||
      name.includes(
        "step up"
      )
    ) {

      return {

        setup:
          "Place your whole working foot on the step or box. Keep your torso controlled and your hips square.",

        execution:
          "Drive through the foot on the box to stand up. Lower yourself back down slowly under control.",

        cues:[
          "Whole foot on the box",
          "Drive through the working leg",
          "Stay tall",
          "Control the descent"
        ],

        mistakes:[
          "Pushing excessively from the back leg",
          "Knee collapsing inward",
          "Using momentum",
          "Dropping quickly on the way down"
        ]

      };

    }


    /*
      BENCH / CHEST PRESS
    */

    if (
      name.includes(
        "bench press"
      ) ||
      name.includes(
        "chest press"
      ) ||
      name.includes(
        "floor press"
      )
    ) {

      return {

        setup:
          "Set your shoulders back and down. Keep your feet stable and your wrists stacked over your forearms.",

        execution:
          "Lower the weight under control toward the chest, then press upward while maintaining shoulder position.",

        cues:[
          "Shoulders back and down",
          "Keep wrists strong",
          "Control the lowering phase",
          "Press smoothly",
          "Keep your body stable"
        ],

        mistakes:[
          "Flaring the elbows excessively",
          "Bouncing the weight",
          "Losing wrist position",
          "Shoulders rolling forward"
        ]

      };

    }


    /*
      PUSH UP
    */

    if (
      name.includes(
        "push-up"
      ) ||
      name.includes(
        "push up"
      )
    ) {

      return {

        setup:
          "Place your hands slightly wider than shoulder-width and create a straight line from shoulders to heels.",

        execution:
          "Lower your chest toward the floor while keeping the body rigid, then press back to the starting position.",

        cues:[
          "Brace your core",
          "Keep your body in one line",
          "Control the descent",
          "Push the floor away"
        ],

        mistakes:[
          "Hips dropping",
          "Elbows flaring too wide",
          "Short range of motion",
          "Head reaching toward the floor"
        ]

      };

    }


    /*
      ROW
    */

    if (
      name.includes(
        "row"
      )
    ) {

      return {

        setup:
          "Set your torso firmly and keep your spine neutral. Allow the shoulder blade to move naturally.",

        execution:
          "Pull the elbow back toward your hip or ribs. Pause briefly, then lower the weight with control.",

        cues:[
          "Lead with the elbow",
          "Keep the chest controlled",
          "Pull toward your hip or ribs",
          "Squeeze the back",
          "Control the return"
        ],

        mistakes:[
          "Shrugging the shoulders",
          "Jerking the weight",
          "Rotating excessively",
          "Cutting the range short"
        ]

      };

    }


    /*
      PULLDOWN / PULL
    */

    if (
      name.includes(
        "pulldown"
      ) ||
      name.includes(
        "lat pull"
      ) ||
      name.includes(
        "pullover"
      )
    ) {

      return {

        setup:
          "Set your shoulders down and keep your trunk stable.",

        execution:
          "Drive the elbows down toward your sides while keeping tension through your upper back and lats.",

        cues:[
          "Chest tall",
          "Shoulders away from ears",
          "Drive elbows down",
          "Control the return",
          "Keep tension through the back"
        ],

        mistakes:[
          "Using excessive body swing",
          "Pulling mainly with the hands",
          "Shrugging",
          "Letting the weight snap upward"
        ]

      };

    }


    /*
      SHOULDER PRESS
    */

    if (
      name.includes(
        "shoulder press"
      ) ||
      name.includes(
        "overhead press"
      ) ||
      name.includes(
        "pike push"
      )
    ) {

      return {

        setup:
          "Brace your core and position your hands so the forearms remain strong and stable.",

        execution:
          "Press overhead while maintaining control through the trunk. Lower slowly back to the starting position.",

        cues:[
          "Brace your trunk",
          "Keep wrists stacked",
          "Press smoothly overhead",
          "Control the lowering phase"
        ],

        mistakes:[
          "Overarching the lower back",
          "Shrugging excessively",
          "Using momentum",
          "Dropping the weight quickly"
        ]

      };

    }


    /*
      LATERAL RAISE
    */

    if (
      name.includes(
        "lateral raise"
      ) ||
      name.includes(
        "lateral press"
      )
    ) {

      return {

        setup:
          "Stand tall with a soft bend in the elbows and shoulders relaxed.",

        execution:
          "Raise the arms out to the sides under control, then lower slowly.",

        cues:[
          "Lead with the elbows",
          "Keep shoulders relaxed",
          "Use a controlled range",
          "Move smoothly"
        ],

        mistakes:[
          "Shrugging",
          "Swinging the weight",
          "Using excessive load",
          "Rushing the lowering phase"
        ]

      };

    }


    /*
      REAR DELT
    */

    if (
      name.includes(
        "rear delt"
      ) ||
      name.includes(
        "reverse snow angel"
      ) ||
      name.includes(
        "pull apart"
      )
    ) {

      return {

        setup:
          "Set your shoulders down and keep the torso stable.",

        execution:
          "Move the arms outward while squeezing through the rear shoulders and upper back.",

        cues:[
          "Stay controlled",
          "Keep shoulders away from ears",
          "Squeeze the upper back",
          "Use a comfortable range"
        ],

        mistakes:[
          "Shrugging",
          "Using momentum",
          "Moving too quickly",
          "Overextending the shoulder"
        ]

      };

    }


    /*
      HIP THRUST / GLUTE BRIDGE
    */

    if (
      name.includes(
        "hip thrust"
      ) ||
      name.includes(
        "glute bridge"
      )
    ) {

      return {

        setup:
          "Set your feet firmly and brace your trunk before beginning.",

        execution:
          "Drive through the feet and extend the hips until the body reaches a strong, controlled finish.",

        cues:[
          "Drive through the heels",
          "Keep ribs controlled",
          "Squeeze the glutes",
          "Pause briefly at the top"
        ],

        mistakes:[
          "Overarching the lower back",
          "Pushing through the toes",
          "Rushing the movement",
          "Losing trunk control"
        ]

      };

    }


    /*
      LEG CURL
    */

    if (
      name.includes(
        "leg curl"
      ) ||
      name.includes(
        "hamstring walkout"
      )
    ) {

      return {

        setup:
          "Set your hips and trunk firmly before beginning.",

        execution:
          "Bend the knees using the hamstrings, then return slowly while maintaining tension.",

        cues:[
          "Keep hips controlled",
          "Squeeze the hamstrings",
          "Use full comfortable range",
          "Control the return"
        ],

        mistakes:[
          "Lifting the hips excessively",
          "Using momentum",
          "Rushing the eccentric",
          "Using more load than you can control"
        ]

      };

    }


    /*
      CALF RAISE
    */

    if (
      name.includes(
        "calf raise"
      )
    ) {

      return {

        setup:
          "Stand with the ball of the foot firmly supported and maintain balance.",

        execution:
          "Rise onto the toes, pause at the top, then lower slowly through a comfortable range.",

        cues:[
          "Move through the ankle",
          "Pause at the top",
          "Control the lowering phase",
          "Avoid bouncing"
        ],

        mistakes:[
          "Bouncing",
          "Using a short range",
          "Rolling the ankle outward",
          "Rushing each rep"
        ]

      };

    }


    /*
      BICEPS
    */

    if (
      name.includes(
        "biceps"
      ) ||
      name.includes(
        "curl"
      )
    ) {

      return {

        setup:
          "Stand tall with your upper arms controlled beside your body.",

        execution:
          "Bend the elbow to raise the weight, squeeze briefly, then lower under control.",

        cues:[
          "Keep elbows stable",
          "Squeeze at the top",
          "Control the lowering phase",
          "Avoid swinging"
        ],

        mistakes:[
          "Swinging the torso",
          "Elbows drifting forward",
          "Dropping the weight",
          "Using excessive load"
        ]

      };

    }


    /*
      TRICEPS
    */

    if (
      name.includes(
        "triceps"
      ) ||
      name.includes(
        "close grip"
      )
    ) {

      return {

        setup:
          "Set your shoulders and keep the upper arms stable.",

        execution:
          "Extend the elbows smoothly, squeeze the triceps, then return under control.",

        cues:[
          "Keep elbows controlled",
          "Fully extend comfortably",
          "Squeeze the triceps",
          "Control the return"
        ],

        mistakes:[
          "Elbows moving excessively",
          "Using momentum",
          "Leaning heavily into the movement",
          "Rushing the return"
        ]

      };

    }


    /*
      PLANK
    */

    if (
      name.includes(
        "plank"
      )
    ) {

      return {

        setup:
          "Position your elbows or hands beneath the shoulders and create a straight line through the body.",

        execution:
          "Brace your trunk and maintain the position while breathing normally.",

        cues:[
          "Brace your core",
          "Squeeze your glutes",
          "Keep hips level",
          "Breathe normally"
        ],

        mistakes:[
          "Hips dropping",
          "Hips lifting too high",
          "Holding your breath",
          "Losing shoulder position"
        ]

      };

    }


    /*
      DEAD BUG / CORE
    */

    if (
      name.includes(
        "dead bug"
      )
    ) {

      return {

        setup:
          "Lie on your back with your trunk gently braced and your lower back controlled.",

        execution:
          "Slowly extend the opposite arm and leg while maintaining trunk position, then return.",

        cues:[
          "Brace gently",
          "Move slowly",
          "Keep the lower back controlled",
          "Breathe throughout"
        ],

        mistakes:[
          "Arching the lower back",
          "Moving too quickly",
          "Losing abdominal tension",
          "Holding your breath"
        ]

      };

    }


    /*
      CRUNCH
    */

    if (
      name.includes(
        "crunch"
      )
    ) {

      return {

        setup:
          "Brace your abdominal wall and keep your hips stable.",

        execution:
          "Curl the ribs toward the pelvis using the abdominals, then return slowly.",

        cues:[
          "Move through the trunk",
          "Keep tension on the abs",
          "Control both directions",
          "Avoid pulling with the arms"
        ],

        mistakes:[
          "Using momentum",
          "Pulling on the neck",
          "Moving mainly through the hips",
          "Rushing the movement"
        ]

      };

    }


    /*
      GENERIC FALLBACK
    */

    return {

      setup:
        "Set yourself in a stable position and choose a load you can control through the full movement.",

      execution:
        "Perform each repetition smoothly through a comfortable range while maintaining good posture and control.",

      cues:[
        "Move with control",
        "Maintain stable posture",
        "Use a comfortable range",
        "Keep breathing",
        "Prioritise technique over load"
      ],

      mistakes:[
        "Using excessive momentum",
        "Using more load than you can control",
        "Rushing repetitions",
        "Training through sharp pain"
      ]

    };

  }


  /* =========================================
     STYLES
     ========================================= */

  function injectStyles() {

    if (
      document.getElementById(
        STYLE_ID
      )
    ) {
      return;
    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      STYLE_ID;


    style.textContent = `

      /* HOW TO BUTTON */

      .mana-v9160-how{
        width:100%;

        min-height:44px;

        margin:
          10px
          0
          4px;

        border:
          1px solid
          #53471d;

        border-radius:
          13px;

        background:
          #111009;

        color:
          #f3d875;

        font-size:
          11px;

        font-weight:
          900;

        letter-spacing:
          .03em;

        cursor:pointer;
      }


      .mana-v9160-how:active{
        transform:
          scale(.99);
      }


      /* MODAL */

      #${MODAL_ID}{
        position:fixed;

        inset:0;

        z-index:76000;

        display:none;

        overflow:auto;

        padding:
          calc(
            env(
              safe-area-inset-top
            ) + 18px
          )
          16px
          calc(
            env(
              safe-area-inset-bottom
            ) + 30px
          );

        background:
          #050505;

        color:#fff;
      }


      #${MODAL_ID}.open{
        display:block;
      }


      .mana-v9160-shell{
        width:
          min(
            540px,
            100%
          );

        margin:auto;
      }


      .mana-v9160-head{
        display:flex;

        justify-content:
          space-between;

        align-items:flex-start;

        gap:14px;

        margin-bottom:16px;
      }


      .mana-v9160-kicker{
        color:#f3d875;

        font-size:10px;

        font-weight:900;

        letter-spacing:.13em;
      }


      .mana-v9160-head h1{
        margin:
          6px
          0
          0;

        font-size:28px;

        line-height:1.1;
      }


      .mana-v9160-close{
        width:44px;
        height:44px;

        flex:
          0
          0
          44px;

        border:
          1px solid
          #333;

        border-radius:50%;

        background:#111;

        color:#fff;

        font-size:23px;

        cursor:pointer;
      }


      .mana-v9160-card{
        margin-top:11px;

        padding:17px;

        border:
          1px solid
          #292929;

        border-radius:
          19px;

        background:
          linear-gradient(
            145deg,
            #111,
            #090909
          );
      }


      .mana-v9160-label{
        color:#f3d875;

        font-size:9px;

        font-weight:900;

        letter-spacing:.1em;

        text-transform:uppercase;
      }


      .mana-v9160-card p{
        margin:
          7px
          0
          0;

        color:#c0c0c0;

        font-size:14px;

        line-height:1.65;
      }


      .mana-v9160-list{
        display:grid;

        gap:9px;

        margin-top:11px;
      }


      .mana-v9160-item{
        display:grid;

        grid-template-columns:
          22px
          minmax(
            0,
            1fr
          );

        gap:8px;

        align-items:start;

        color:#bbb;

        font-size:13px;

        line-height:1.5;
      }


      .mana-v9160-number{
        width:22px;
        height:22px;

        display:grid;

        place-items:center;

        border:
          1px solid
          #4c421e;

        border-radius:7px;

        color:#f3d875;

        font-size:9px;

        font-weight:900;
      }


      .mana-v9160-mistake{
        width:22px;
        height:22px;

        display:grid;

        place-items:center;

        color:#a98282;

        font-size:14px;

        font-weight:900;
      }


      .mana-v9160-watch{
        width:100%;

        min-height:56px;

        margin-top:16px;

        border:0;

        border-radius:15px;

        background:#f3d875;

        color:#111;

        font-size:13px;

        font-weight:900;

        cursor:pointer;
      }


      .mana-v9160-watch:active{
        transform:
          scale(.99);
      }


      .mana-v9160-note{
        margin-top:10px;

        color:#666;

        font-size:9px;

        line-height:1.5;

        text-align:center;
      }


      @media(
        max-width:390px
      ){

        .mana-v9160-head h1{
          font-size:25px;
        }


        .mana-v9160-card p{
          font-size:14px;
        }


        .mana-v9160-item{
          font-size:13px;
        }

      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* =========================================
     MODAL
     ========================================= */

  function ensureModal() {

    if (
      document.getElementById(
        MODAL_ID
      )
    ) {
      return;
    }


    const modal =
      document.createElement(
        "div"
      );


    modal.id =
      MODAL_ID;


    modal.innerHTML = `

      <div
        class="mana-v9160-shell"
      >

        <div
          class="mana-v9160-head"
        >

          <div>

            <div
              class="mana-v9160-kicker"
            >
              MANA STRENGTH • EXERCISE COACH
            </div>


            <h1
              id="manaV916Title"
            >
              Exercise
            </h1>

          </div>


          <button
            type="button"
            class="mana-v9160-close"
            id="manaV916Close"
          >
            ×
          </button>

        </div>


        <div
          id="manaV916Body"
        ></div>


        <button
          type="button"
          class="mana-v9160-watch"
          id="manaV916Watch"
        >
          WATCH DEMO →
        </button>


        <div
          class="mana-v9160-note"
        >
          Video search opens externally.
          Choose a clear technique demonstration
          from a reputable strength or exercise source.
        </div>

      </div>

    `;


    document.body.appendChild(
      modal
    );


    document
      .getElementById(
        "manaV916Close"
      )
      .onclick =
        closeGuide;


    document
      .getElementById(
        "manaV916Watch"
      )
      .onclick =
        watchDemo;

  }


  function openGuide(
    exerciseName
  ) {

    activeExercise =
      exerciseName;


    ensureModal();


    const guide =
      guideFor(
        exerciseName
      );


    const title =
      document.getElementById(
        "manaV916Title"
      );


    const body =
      document.getElementById(
        "manaV916Body"
      );


    if (
      !title ||
      !body
    ) {
      return;
    }


    title.textContent =
      exerciseName;


    body.innerHTML = `

      <div
        class="mana-v9160-card"
      >

        <div
          class="mana-v9160-label"
        >
          SETUP
        </div>

        <p>
          ${esc(
            guide.setup
          )}
        </p>

      </div>


      <div
        class="mana-v9160-card"
      >

        <div
          class="mana-v9160-label"
        >
          HOW TO PERFORM
        </div>

        <p>
          ${esc(
            guide.execution
          )}
        </p>

      </div>


      <div
        class="mana-v9160-card"
      >

        <div
          class="mana-v9160-label"
        >
          COACHING CUES
        </div>


        <div
          class="mana-v9160-list"
        >

          ${
            guide.cues
              .map(
                (
                  cue,
                  index
                ) => `

                  <div
                    class="mana-v9160-item"
                  >

                    <div
                      class="mana-v9160-number"
                    >
                      ${index + 1}
                    </div>

                    <div>
                      ${esc(
                        cue
                      )}
                    </div>

                  </div>

                `
              )
              .join("")
          }

        </div>

      </div>


      <div
        class="mana-v9160-card"
      >

        <div
          class="mana-v9160-label"
        >
          COMMON MISTAKES
        </div>


        <div
          class="mana-v9160-list"
        >

          ${
            guide.mistakes
              .map(
                mistake => `

                  <div
                    class="mana-v9160-item"
                  >

                    <div
                      class="mana-v9160-mistake"
                    >
                      ×
                    </div>

                    <div>
                      ${esc(
                        mistake
                      )}
                    </div>

                  </div>

                `
              )
              .join("")
          }

        </div>

      </div>

    `;


    document
      .getElementById(
        MODAL_ID
      )
      .classList
      .add(
        "open"
      );


    document.body.style.overflow =
      "hidden";


    document
      .getElementById(
        MODAL_ID
      )
      .scrollTop =
        0;

  }


  function closeGuide() {

    document
      .getElementById(
        MODAL_ID
      )
      ?.classList
      .remove(
        "open"
      );


    document.body.style.overflow =
      "hidden";


    activeExercise =
      "";

  }


  /* =========================================
     WATCH VIDEO
     ========================================= */

  function watchDemo() {

    if (
      !activeExercise
    ) {
      return;
    }


    const search =
      encodeURIComponent(
        `${activeExercise} exercise proper technique`
      );


    window.open(
      `https://www.youtube.com/results?search_query=${search}`,
      "_blank",
      "noopener,noreferrer"
    );

  }


  /* =========================================
     ADD BUTTONS TO WORKOUT CARDS
     ========================================= */

  function enhanceCards() {

    const holder =
      document.getElementById(
        "manaV64Exercises"
      );


    if (!holder) {
      return;
    }


    holder
      .querySelectorAll(
        ".mana-v64-card"
      )
      .forEach(
        card => {

          if (
            card.dataset
              .manaV916Ready ===
            "1"
          ) {
            return;
          }


          card.dataset
            .manaV916Ready =
              "1";


          const name =
            card.dataset
              .exerciseName ||
            card
              .querySelector(
                ".mana-v64-name"
              )
              ?.textContent
              ?.trim() ||
            "Exercise";


          const suggestion =
            card.querySelector(
              ".mana-v64-suggestion"
            );


          const button =
            document.createElement(
              "button"
            );


          button.type =
            "button";

          button.className =
            "mana-v9160-how";

          button.textContent =
            "HOW TO PERFORM →";


          button.onclick =
            () => {

              openGuide(
                name
              );

            };


          if (suggestion) {

            suggestion.insertAdjacentElement(
              "afterend",
              button
            );

          } else {

            card.prepend(
              button
            );

          }

        }
      );

  }


  /* =========================================
     WATCH WORKOUT SCREEN
     ========================================= */

  function watch() {

    let timer =
      null;


    const observer =
      new MutationObserver(
        () => {

          clearTimeout(
            timer
          );


          timer =
            setTimeout(
              enhanceCards,
              60
            );

        }
      );


    observer.observe(
      document.body,
      {
        childList:true,
        subtree:true
      }
    );


    window.addEventListener(
      "mana:strength-synced",
      () => {

        setTimeout(
          enhanceCards,
          100
        );

      }
    );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    injectStyles();

    ensureModal();

    watch();


    [
      500,
      1000,
      1800
    ].forEach(
      delay => {

        setTimeout(
          enhanceCards,
          delay
        );

      }
    );

  }


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
