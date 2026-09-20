/* =========================================
   MANA MOVEMENT TRAINING v9.12.0
   MANA STRENGTH — LEARN

   PRACTICAL STRENGTH EDUCATION
   - TRAINING
   - PROGRESSION
   - RECOVERY
   - FUEL
   ========================================= */

(() => {
  "use strict";


  const STYLE_ID =
    "mana-v9120-strength-learn-style";


  const LESSONS = [

    {
      category:"TRAINING",
      title:"Progressive Overload",
      intro:
        "The foundation of getting stronger and building muscle.",
      body:`
        Your body adapts when training gradually becomes more challenging.

        That does not mean adding weight every workout.

        Progress can come from:
        • adding weight
        • completing more reps
        • improving technique
        • completing more quality sets
        • controlling the movement better

        Mana tracks your previous workouts so you can make small, sustainable improvements over time.
      `
    },


    {
      category:"TRAINING",
      title:"Sets & Reps",
      intro:
        "Understand what the numbers in your program mean.",
      body:`
        A rep is one complete movement.

        A set is a group of reps performed together.

        Example:
        3 × 10 means three sets of ten repetitions.

        For muscle building, most working sets will usually sit in a moderate rep range.

        For strength-focused training, some exercises may use lower reps and heavier loads.

        The goal is not simply to finish the numbers — it is to perform quality working sets with good technique.
      `
    },


    {
      category:"TRAINING",
      title:"How Hard Should You Train?",
      intro:
        "Your working sets should challenge you without destroying your technique.",
      body:`
        Most productive strength training does not require complete failure on every set.

        A useful target is finishing many working sets with around 1–3 good repetitions still available.

        If your technique breaks down badly, the load is usually too heavy.

        If you could easily perform another 8–10 reps, the set may not be challenging enough.

        Train hard, but keep the movement controlled.
      `
    },


    {
      category:"TRAINING",
      title:"Rest Between Sets",
      intro:
        "Rest enough to perform the next set properly.",
      body:`
        Bigger compound exercises generally need more recovery between sets.

        A simple guide:

        Heavy compound lifts:
        around 2–3 minutes

        Moderate strength work:
        around 90–120 seconds

        Smaller isolation exercises:
        around 60–90 seconds

        You do not need to rush your workout.

        The goal is quality training, not simply keeping your heart rate high.
      `
    },


    {
      category:"PROGRESSION",
      title:"When to Add Weight",
      intro:
        "Earn the increase rather than forcing it.",
      body:`
        A good progression rule is to first become strong within the prescribed rep range.

        Example:

        Target:
        3 × 8–10

        Once you can perform approximately 10 quality reps across your working sets, you may be ready for a small load increase.

        After increasing the load, your reps may temporarily drop closer to the bottom of the range.

        Build them back up before increasing again.

        Mana's workout logger uses this type of progression approach.
      `
    },


    {
      category:"PROGRESSION",
      title:"Technique Before Load",
      intro:
        "More weight only matters if you can control it.",
      body:`
        Strength progress is not just the number on the weight stack or bar.

        Good technique usually means:

        • controlled repetitions
        • consistent range of motion
        • stable positioning
        • no unnecessary momentum
        • pain-free movement

        If adding load significantly changes your technique, reduce the weight and rebuild.
      `
    },


    {
      category:"RECOVERY",
      title:"Recovery Builds Strength",
      intro:
        "Training provides the stimulus. Recovery allows adaptation.",
      body:`
        More training is not always better training.

        Your muscles and nervous system need time to recover between challenging sessions.

        Recovery includes:

        • sleep
        • nutrition
        • hydration
        • rest days
        • lower-intensity activity
        • managing overall stress

        Consistency over months matters far more than one huge workout.
      `
    },


    {
      category:"RECOVERY",
      title:"Muscle Soreness",
      intro:
        "Soreness is not the same thing as progress.",
      body:`
        Some soreness after training is normal, particularly when starting a new program or exercise.

        But soreness is not required for a productive workout.

        Severe soreness that regularly affects your next training session may be a sign that volume or intensity is too high.

        Progress should leave you capable of training consistently.
      `
    },


    {
      category:"RECOVERY",
      title:"Sleep",
      intro:
        "One of the most powerful recovery tools you have.",
      body:`
        Sleep supports recovery, performance, appetite regulation and training quality.

        Aim for a consistent sleep routine where possible.

        Useful habits include:

        • similar sleep and wake times
        • reducing late-night stimulation
        • a cool, dark bedroom
        • avoiding large amounts of caffeine late in the day

        You do not need perfect sleep every night — focus on consistency.
      `
    },


    {
      category:"FUEL",
      title:"Protein",
      intro:
        "Protein supports muscle repair and adaptation.",
      body:`
        Strength training increases the body's demand for protein.

        Rather than consuming all your protein in one meal, spreading it across the day can make your target easier to achieve.

        Good options include:

        • eggs
        • chicken
        • lean meat
        • fish
        • Greek yoghurt
        • milk
        • tofu
        • legumes
        • protein-rich snacks

        Your Mana Fuel target gives you a personalised daily protein goal.
      `
    },


    {
      category:"FUEL",
      title:"Calories",
      intro:
        "Energy intake affects training, recovery and body composition.",
      body:`
        Calories provide the energy your body uses throughout the day.

        Your ideal intake depends on your goal.

        Muscle building generally requires enough energy to support training and recovery.

        Weight loss generally requires consuming less energy than you use over time.

        Maintenance aims to keep body weight relatively stable.

        Your weekly average matters more than one individual meal or day.
      `
    },


    {
      category:"FUEL",
      title:"Hydration",
      intro:
        "Hydration supports performance and recovery.",
      body:`
        Even mild dehydration can affect training quality.

        Build water intake across the day rather than trying to catch up at night.

        You may need more fluid when:

        • training hard
        • sweating heavily
        • exercising in hot conditions
        • spending long periods outdoors

        Mana tracks your daily and weekly water intake against your personalised target.
      `
    }

  ];


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


  function learnOpen() {
    const shell =
      document.getElementById(
        "manaV83ProgramShell"
      );


    const title =
      document.getElementById(
        "manaV83Title"
      );


    const tab =
      document.querySelector(
        "#manaV83Tabs .mana-v83-tab.active"
      );


    return Boolean(

      shell
        ?.classList
        .contains("open") &&

      title
        ?.textContent
        .trim()
        .toUpperCase() ===
        "MANA STRENGTH" &&

      tab
        ?.dataset
        ?.v83Tab ===
        "learn"

    );
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

      .mana-v9120-root{
        width:100%;
      }


      .mana-v9120-head{
        margin-bottom:18px;
      }


      .mana-v9120-kicker{
        color:#f3d875;

        font-size:10px;

        font-weight:900;

        letter-spacing:.13em;
      }


      .mana-v9120-head h2{
        margin:
          5px
          0
          5px;

        font-size:28px;

        line-height:1.1;
      }


      .mana-v9120-head p{
        margin:0;

        color:#888;

        font-size:12px;

        line-height:1.5;
      }


      .mana-v9120-category{
        margin:
          22px
          0
          9px;

        color:#f3d875;

        font-size:10px;

        font-weight:900;

        letter-spacing:.12em;
      }


      .mana-v9120-card{
        margin-bottom:9px;

        border:
          1px solid
          #2c2c2c;

        border-radius:17px;

        overflow:hidden;

        background:
          linear-gradient(
            145deg,
            #111,
            #090909
          );
      }


      .mana-v9120-open{
        width:100%;

        display:grid;

        grid-template-columns:
          minmax(
            0,
            1fr
          )
          34px;

        gap:12px;

        align-items:center;

        padding:
          15px;

        border:0;

        background:transparent;

        color:inherit;

        text-align:left;

        cursor:pointer;
      }


      .mana-v9120-title{
        color:#eee;

        font-size:15px;

        font-weight:900;
      }


      .mana-v9120-intro{
        margin-top:4px;

        color:#777;

        font-size:10px;

        line-height:1.4;
      }


      .mana-v9120-arrow{
        width:32px;
        height:32px;

        display:grid;

        place-items:center;

        border:
          1px solid
          #353535;

        border-radius:10px;

        color:#f3d875;

        font-size:18px;

        transition:
          transform
          .2s ease;
      }


      .mana-v9120-card.open
      .mana-v9120-arrow{
        transform:
          rotate(
            90deg
          );
      }


      .mana-v9120-body{
        display:none;

        padding:
          0
          15px
          16px;

        color:#aaa;

        font-size:12px;

        line-height:1.65;

        white-space:
          pre-line;
      }


      .mana-v9120-card.open
      .mana-v9120-body{
        display:block;
      }


      .mana-v9120-tip{
        margin-top:17px;

        padding:16px;

        border:
          1px solid
          #4b411d;

        border-radius:18px;

        background:
          linear-gradient(
            145deg,
            #17140a,
            #0b0b0b
          );
      }


      .mana-v9120-tip-label{
        color:#f3d875;

        font-size:9px;

        font-weight:900;

        letter-spacing:.1em;
      }


      .mana-v9120-tip strong{
        display:block;

        margin-top:6px;

        color:#fff;

        font-size:15px;
      }


      .mana-v9120-tip p{
        margin:
          6px
          0
          0;

        color:#888;

        font-size:11px;

        line-height:1.5;
      }

    `;


    document.head.appendChild(
      style
    );
  }


  /* =========================================
     RENDER
     ========================================= */

  function render() {
    if (
      !learnOpen()
    ) {
      return;
    }


    const holder =
      document.getElementById(
        "manaV83Content"
      );


    if (!holder) {
      return;
    }


    const categories =
      [
        ...new Set(
          LESSONS.map(
            lesson =>
              lesson.category
          )
        )
      ];


    holder.innerHTML = `

      <div
        class="mana-v9120-root"
      >

        <div
          class="mana-v9120-head"
        >

          <div
            class="mana-v9120-kicker"
          >
            MANA STRENGTH
          </div>

          <h2>
            Learn
          </h2>

          <p>
            Understand why your program
            works and how to get more
            from every session.
          </p>

        </div>


        ${
          categories
            .map(
              category => `

                <div
                  class="mana-v9120-category"
                >
                  ${esc(
                    category
                  )}
                </div>


                ${
                  LESSONS
                    .filter(
                      lesson =>
                        lesson.category ===
                        category
                    )
                    .map(
                      (
                        lesson,
                        index
                      ) => `

                        <div
                          class="mana-v9120-card"
                          data-v9120-card
                        >

                          <button
                            type="button"
                            class="mana-v9120-open"
                            data-v9120-open
                          >

                            <div>

                              <div
                                class="mana-v9120-title"
                              >
                                ${esc(
                                  lesson.title
                                )}
                              </div>


                              <div
                                class="mana-v9120-intro"
                              >
                                ${esc(
                                  lesson.intro
                                )}
                              </div>

                            </div>


                            <div
                              class="mana-v9120-arrow"
                            >
                              ›
                            </div>

                          </button>


                          <div
                            class="mana-v9120-body"
                          >
                            ${esc(
                              lesson.body.trim()
                            )}
                          </div>

                        </div>

                      `
                    )
                    .join("")
                }

              `
            )
            .join("")
        }


        <div
          class="mana-v9120-tip"
        >

          <div
            class="mana-v9120-tip-label"
          >
            MOVE WITH PURPOSE
          </div>

          <strong>
            Consistency beats perfection.
          </strong>

          <p>
            Train with intent, fuel your
            body, recover well and keep
            building week after week.
          </p>

        </div>

      </div>

    `;


    holder
      .querySelectorAll(
        "[data-v9120-open]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              const card =
                button.closest(
                  "[data-v9120-card]"
                );


              if (!card) {
                return;
              }


              card.classList.toggle(
                "open"
              );

            }
          );

        }
      );
  }


  /* =========================================
     WATCH
     ========================================= */

  function watch() {

    window.addEventListener(
      "mana:program-tab-change",
      () => {

        setTimeout(
          render,
          100
        );

        setTimeout(
          render,
          300
        );

      }
    );


    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            '#manaV83Tabs [data-v83-tab="learn"]'
          )
        ) {

          setTimeout(
            render,
            120
          );

        }

      }
    );


    let timer =
      null;


    const observer =
      new MutationObserver(
        () => {

          if (
            !learnOpen()
          ) {
            return;
          }


          if (
            document.querySelector(
              ".mana-v9120-root"
            )
          ) {
            return;
          }


          clearTimeout(
            timer
          );


          timer =
            setTimeout(
              render,
              80
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
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {
    injectStyles();

    watch();


    [
      900,
      1600,
      2500
    ].forEach(
      delay => {

        setTimeout(
          render,
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
