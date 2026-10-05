/* =========================================
   MANA MOVEMENT TRAINING v9.85.0

   SHARED LEARN + WHAKATAUKĪ

   MANA 28
   - RESTORES LEARN
   - WORKOUT WHAKATAUKĪ
   - FUEL WHAKATAUKĪ
   - PROGRESS WHAKATAUKĪ
   - LEARN WHAKATAUKĪ

   MANA LYFE
   - WORKOUT WHAKATAUKĪ
   - RECLAIM WHAKATAUKĪ
   - PROGRESS WHAKATAUKĪ
   - LEARN WHAKATAUKĪ

   IMPORTANT
   - NO MUTATION OBSERVER
   - NO CONTINUOUS RENDER LOOP
   - EVENT DRIVEN ONLY
   ========================================= */

(() => {
  "use strict";

  const BUILD =
    "98500";

  const STYLE_ID =
    "mana-v985-style";

  const FOOTER_ID =
    "manaV985Whakatauki";


  /* =========================================
     MANA 28 LEARN
     ========================================= */

  const M28_LEARN = [

    {
      title:
        "Progressive overload",

      body:
        "Your body adapts when training gradually becomes more challenging. Add a little weight, an extra rep, better control or improved range of motion over time rather than trying to change everything at once."
    },

    {
      title:
        "Train with intent",

      body:
        "Every session should have a purpose. Good technique, controlled movement and appropriate effort matter more than simply completing exercises as fast as possible."
    },

    {
      title:
        "Recovery is part of training",

      body:
        "Strength and fitness improve when training is followed by enough sleep, food, hydration and lower-intensity recovery. More work is not always better work."
    },

    {
      title:
        "Protein supports repair",

      body:
        "Protein provides the building blocks your body uses to repair and maintain muscle. Spread useful protein choices across the day rather than relying on one meal."
    },

    {
      title:
        "Hydration affects performance",

      body:
        "Even mild dehydration can make training feel harder. Build a consistent hydration habit across the day instead of trying to catch up during the workout."
    },

    {
      title:
        "Consistency beats perfection",

      body:
        "One missed workout or imperfect meal does not undo your progress. The pattern you repeat across weeks matters much more than a single day."
    },

    {
      title:
        "Cardio supports strength",

      body:
        "Cardiovascular fitness improves work capacity, recovery between sets and general health. Mana 28 combines strength and cardio because both contribute to long-term performance."
    },

    {
      title:
        "Mobility should help movement",

      body:
        "Useful mobility work should improve positions you actually need. Focus on controlled movement and the areas that limit your training rather than stretching everything."
    }

  ];


  /* =========================================
     WHAKATAUKĪ
     ========================================= */

  const WHAKATAUKI = {

    m28Workout:{
      maori:
        "Whāia te iti kahurangi, ki te tuohu koe, me he maunga teitei.",

      english:
        "Pursue what is precious, and if you bow, let it be to a lofty mountain."
    },


    m28Fuel:{
      maori:
        "He kai kei aku ringa.",

      english:
        "I have the resources and ability within my own hands."
    },


    m28Progress:{
      maori:
        "Iti noa ana, he pito mata.",

      english:
        "Small beginnings can hold great potential."
    },


    m28Learn:{
      maori:
        "Mā te kimi ka kite, mā te kite ka mōhio, mā te mōhio ka mārama.",

      english:
        "Through seeking comes discovery; through discovery comes knowing; through knowing comes understanding."
    },


    lyfeWorkout:{
      maori:
        "Mā te huruhuru te manu ka rere.",

      english:
        "With feathers a bird can fly — small things build the strength to move forward."
    },


    lyfeReclaim:{
      maori:
        "Titiro whakamuri, kōkiri whakamua.",

      english:
        "Look back and reflect so you can move forward."
    },


    lyfeProgress:{
      maori:
        "Iti noa ana, he pito mata.",

      english:
        "Small beginnings can hold great potential."
    },


    lyfeLearn:{
      maori:
        "Mā te kimi ka kite, mā te kite ka mōhio, mā te mōhio ka mārama.",

      english:
        "Through seeking comes discovery; through discovery comes knowing; through knowing comes understanding."
    }

  };


  /* =========================================
     HELPERS
     ========================================= */

  function holder() {

    return document
      .getElementById(
        "manaV83Content"
      );

  }


  function shell() {

    return document
      .getElementById(
        "manaV83ProgramShell"
      );

  }


  function title() {

    return (
      document
        .getElementById(
          "manaV83Title"
        )
        ?.textContent
        ?.trim()
        ?.toUpperCase()
      || ""
    );

  }


  function activeTab() {

    return (
      document
        .querySelector(
          "#manaV83Tabs .mana-v83-tab.active"
        )
        ?.dataset
        ?.v83Tab
      || ""
    );

  }


  function shellOpen() {

    return Boolean(
      shell()
        ?.classList
        .contains(
          "open"
        )
    );

  }


  function isMana28() {

    return (
      shellOpen()
      &&
      title()
        .startsWith(
          "MANA 28"
        )
    );

  }


  function isLyfe() {

    return (
      shellOpen()
      &&
      (
        title()
          .startsWith(
            "MANA LYFE"
          )
        ||
        title()
          .startsWith(
            "MANA LIFE"
          )
      )
    );

  }


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
      );

  }


  /* =========================================
     STYLES
     ========================================= */

  function installStyles() {

    document
      .getElementById(
        STYLE_ID
      )
      ?.remove();


    const style =
      document.createElement(
        "style"
      );


    style.id =
      STYLE_ID;


    style.textContent = `

      /* =====================================
         WHAKATAUKĪ FOOTER
         ===================================== */

      #${FOOTER_ID}{

        width:100%;

        box-sizing:border-box;

        margin:
          18px 0 28px;

        padding:
          16px 17px;

        border-left:
          3px solid #d5b446;

        border-radius:
          0 15px 15px 0;

        background:
          linear-gradient(
            145deg,
            #151309,
            #0a0a0a
          );

      }


      #${FOOTER_ID}
      .mana-v985-footer-label{

        color:#8e7e47;

        font-size:9px;

        font-weight:950;

        letter-spacing:.15em;

      }


      #${FOOTER_ID}
      strong{

        display:block;

        margin-top:7px;

        color:#f3d875;

        font-size:16px;

        font-weight:900;

        line-height:1.45;

      }


      #${FOOTER_ID}
      span{

        display:block;

        margin-top:6px;

        color:#aaa;

        font-size:12px;

        line-height:1.5;

      }


      /* =====================================
         MANA 28 LEARN
         ===================================== */

      .mana-v985-learn{

        width:100%;

        max-width:780px;

        margin:
          0 auto 34px;

      }


      .mana-v985-head{

        position:relative;

        margin-bottom:16px;

        padding-bottom:15px;

        border-bottom:
          1px solid #29251b;

      }


      .mana-v985-head::after{

        content:"";

        position:absolute;

        left:0;

        bottom:-1px;

        width:86px;

        height:2px;

        background:
          linear-gradient(
            90deg,
            #f2d875,
            transparent
          );

      }


      .mana-v985-kicker{

        color:#d7b851;

        font-size:10px;

        font-weight:950;

        letter-spacing:.16em;

      }


      .mana-v985-head h2{

        margin:
          7px 0 7px;

        color:#fff;

        font-size:31px;

        font-weight:950;

        line-height:1.04;

      }


      .mana-v985-head p{

        max-width:620px;

        margin:0;

        color:#999;

        font-size:13px;

        line-height:1.55;

      }


      .mana-v985-learn-card{

        margin-top:10px;

        overflow:hidden;

        border:
          1px solid #292820;

        border-radius:16px;

        background:
          linear-gradient(
            145deg,
            #12110d,
            #090909
          );

      }


      .mana-v985-learn-button{

        width:100%;

        min-height:63px;

        display:flex;

        justify-content:
          space-between;

        align-items:center;

        gap:12px;

        padding:
          14px 15px;

        border:0;

        background:transparent;

        color:#fff;

        text-align:left;

        cursor:pointer;

        touch-action:manipulation;

      }


      .mana-v985-learn-button strong{

        color:#fff;

        font-size:14px;

        font-weight:950;

        line-height:1.35;

      }


      .mana-v985-learn-button span{

        color:#f3d875;

        font-size:20px;

        transition:
          transform .15s ease;

      }


      .mana-v985-learn-body{

        display:none;

        padding:
          0 15px 16px;

        color:#aaa;

        font-size:13px;

        line-height:1.65;

      }


      .mana-v985-learn-card.open
      .mana-v985-learn-body{

        display:block;

      }


      .mana-v985-learn-card.open
      .mana-v985-learn-button span{

        transform:
          rotate(180deg);

      }


      @media(max-width:420px){

        .mana-v985-head h2{

          font-size:27px;

        }


        #${FOOTER_ID}{

          margin-top:15px;

          padding:
            14px 15px;

        }


        #${FOOTER_ID}
        strong{

          font-size:15px;

        }

      }

    `;


    document.head
      .appendChild(
        style
      );

  }


  /* =========================================
     MANA 28 LEARN
     ========================================= */

  function renderMana28Learn() {

    if (
      !isMana28()
      ||
      activeTab() !==
        "learn"
    ) {

      return false;

    }


    const content =
      holder();


    if (!content) {

      return false;

    }


    content.innerHTML = `

      <div
        class="mana-v985-learn"
      >

        <div
          class="mana-v985-head"
        >

          <div
            class="mana-v985-kicker"
          >
            MANA 28 • LEARN
          </div>


          <h2>
            Build Better Habits
          </h2>


          <p>
            Understand the simple principles
            behind your training, nutrition,
            recovery and long-term progress.
          </p>

        </div>


        ${M28_LEARN
          .map(
            (
              item,
              index
            ) => `

              <div
                class="mana-v985-learn-card"
              >

                <button
                  type="button"

                  class="mana-v985-learn-button"

                  data-v985-learn="${index}"
                >

                  <strong>
                    ${esc(
                      item.title
                    )}
                  </strong>


                  <span>
                    ⌄
                  </span>

                </button>


                <div
                  class="mana-v985-learn-body"
                >
                  ${esc(
                    item.body
                  )}
                </div>

              </div>

            `
          )
          .join("")}

      </div>

    `;


    content
      .querySelectorAll(
        "[data-v985-learn]"
      )
      .forEach(
        button => {

          button.onclick =
            () => {

              button
                .closest(
                  ".mana-v985-learn-card"
                )
                ?.classList
                .toggle(
                  "open"
                );

            };

        }
      );


    return true;

  }


  /* =========================================
     CHOOSE WHAKATAUKĪ
     ========================================= */

  function footerContent() {

    const tab =
      activeTab();


    if (
      isMana28()
    ) {

      if (
        tab ===
        "program"
      ) {

        return WHAKATAUKI
          .m28Workout;

      }


      if (
        tab ===
        "fuel"
      ) {

        return WHAKATAUKI
          .m28Fuel;

      }


      if (
        tab ===
        "progress"
      ) {

        return WHAKATAUKI
          .m28Progress;

      }


      if (
        tab ===
        "learn"
      ) {

        return WHAKATAUKI
          .m28Learn;

      }

    }


    if (
      isLyfe()
    ) {

      if (
        tab ===
        "routine"
      ) {

        return WHAKATAUKI
          .lyfeWorkout;

      }


      if (
        tab ===
        "reclaim"
      ) {

        return WHAKATAUKI
          .lyfeReclaim;

      }


      if (
        tab ===
        "progress"
      ) {

        return WHAKATAUKI
          .lyfeProgress;

      }


      if (
        tab ===
        "learn"
      ) {

        return WHAKATAUKI
          .lyfeLearn;

      }

    }


    return null;

  }


  /* =========================================
     FOOTER
     ========================================= */

  function placeFooter() {

    const content =
      holder();


    if (!content) {

      return;

    }


    /*
      Remove any older Lyfe whakataukī
      rendered higher on the page.

      This gives every screen one footer only.
    */

    content
      .querySelectorAll(
        ".mana-v984-whakatauki," +
        ".mana-v933-whakatauki"
      )
      .forEach(
        element => {

          element.remove();

        }
      );


    document
      .getElementById(
        FOOTER_ID
      )
      ?.remove();


    const item =
      footerContent();


    if (!item) {

      return;

    }


    const footer =
      document.createElement(
        "div"
      );


    footer.id =
      FOOTER_ID;


    footer.innerHTML = `

      <div
        class="mana-v985-footer-label"
      >
        WHAKATAUKĪ
      </div>


      <strong>
        ${esc(
          item.maori
        )}
      </strong>


      <span>
        ${esc(
          item.english
        )}
      </span>

    `;


    /*
      Put it at the bottom of the
      screen owner's content.
    */

    const roots = [

      content.querySelector(
        ".mana-v980-root"
      ),

      content.querySelector(
        ".mana-v980-session"
      ),

      content.querySelector(
        ".mana-v981-root"
      ),

      content.querySelector(
        ".mana-v984-root"
      ),

      content.querySelector(
        ".mana-v985-learn"
      ),

      content.querySelector(
        ".mana-v897-root"
      )

    ]
      .filter(Boolean);


    const root =
      roots[0]
      ||
      content;


    root.appendChild(
      footer
    );

  }


  /* =========================================
     RENDER PASS
     ========================================= */

  function run() {

    if (
      !shellOpen()
    ) {

      return;

    }


    renderMana28Learn();


    placeFooter();

  }


  function schedule(
    delay = 20
  ) {

    clearTimeout(
      schedule.timer
    );


    schedule.timer =
      setTimeout(
        run,
        delay
      );

  }


  /* =========================================
     INIT
     ========================================= */

  function init() {

    installStyles();


    schedule(
      40
    );


    window.addEventListener(
      "mana:program-tab-change",
      () => {

        schedule(
          25
        );

      }
    );


    window.addEventListener(
      "mana:fuel-updated",
      () => {

        schedule(
          30
        );

      }
    );


    window.addEventListener(
      "mana:life-updated",
      () => {

        schedule(
          30
        );

      }
    );


    document.addEventListener(
      "click",
      event => {

        /*
          Tab changes
        */

        if (
          event.target.closest(
            "#manaV83Tabs"
          )
        ) {

          schedule(
            40
          );

          return;

        }


        /*
          v9.80 workout day / week changes
        */

        if (
          event.target.closest(
            ".mana-v980-day," +
            ".mana-v980-back-week," +
            ".mana-v980-week"
          )
        ) {

          schedule(
            35
          );

        }

      },
      true
    );


    window.addEventListener(
      "focus",
      () => {

        schedule(
          40
        );

      }
    );


    window.MANA_LEARN_WHAKATAUKI_BUILD =
      BUILD;


    console.log(
      "[Mana v9.85.0] Learn + whakatauki ready"
    );

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
