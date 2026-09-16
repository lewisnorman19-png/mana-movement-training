/* =========================================
   MANA MOVEMENT TRAINING v6.2
   MANA STRENGTH
   Personalised strength program builder
   ========================================= */

(() => {
  "use strict";

  const STYLE_ID = "mana-strength-v62-style";
  const MODAL_ID = "manaStrengthModal";
  const STORE_KEY = "mana-strength-v62-program";

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

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

    document.head.appendChild(style);
  }

  function findStrengthCard() {
    const candidates =
      [...document.querySelectorAll("#clientView .day")];

    return candidates.find(el => {
      const text =
        (el.textContent || "").toUpperCase();

      return (
        text.includes("MANA STRONG") ||
        text.includes("MANA STRENGTH")
      );
    });
  }

  function upgradeHomeCard() {
    const card = findStrengthCard();
    if (!card) return;

    card.classList.add("mana-strength-card");

    const strong =
      card.querySelector("strong");

    if (strong) {
      strong.textContent = "MANA STRENGTH";
    }

    const muted =
      card.querySelectorAll(".tiny");

    if (muted[0]) {
      muted[0].textContent =
        "Personalised strength training";
    }

    if (muted[1]) {
      muted[1].textContent =
        "BUILD YOUR PROGRAM";
      muted[1].classList.add("gold");
      muted[1].classList.remove("muted");
    }

    if (!card.querySelector(".mana-strength-arrow")) {
      const arrow =
        document.createElement("div");

      arrow.className =
        "mana-strength-arrow";

      arrow.textContent = "›";

      card.appendChild(arrow);
    }

    card.onclick = openModal;
  }

  function buildModal() {
    if (document.getElementById(MODAL_ID)) return;

    const modal =
      document.createElement("div");

    modal.id = MODAL_ID;

    modal.innerHTML = `
      <div class="mana-strength-shell">

        <div class="mana-strength-head">
          <div>
            <span class="pill">MANA STRENGTH</span>
            <h1>Build your program</h1>
            <div class="muted">
              Training built around you.
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
          <h3>Your goal</h3>

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
          <h3>Training days</h3>

          <div
            class="mana-strength-options"
            data-strength-group="days"
          >
            <button class="mana-strength-option" data-value="2">
              2 days
            </button>

            <button
              class="mana-strength-option active"
              data-value="3"
            >
              3 days
            </button>

            <button class="mana-strength-option" data-value="4">
              4 days
            </button>

            <button class="mana-strength-option" data-value="5">
              5 days
            </button>
          </div>
        </div>

        <div class="mana-strength-section">
          <h3>Experience</h3>

          <div
            class="mana-strength-options"
            data-strength-group="experience"
          >
            <button class="mana-strength-option" data-value="Beginner">
              Beginner
            </button>

            <button
              class="mana-strength-option active"
              data-value="Intermediate"
            >
              Intermediate
            </button>

            <button class="mana-strength-option" data-value="Experienced">
              Experienced
            </button>

            <button class="mana-strength-option" data-value="Returning">
              Returning
            </button>
          </div>
        </div>

        <div class="mana-strength-section">
          <h3>Equipment</h3>

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

            <button class="mana-strength-option" data-value="Dumbbells">
              Dumbbells
            </button>

            <button class="mana-strength-option" data-value="Home basics">
              Home basics
            </button>

            <button class="mana-strength-option" data-value="Bodyweight">
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

    document.body.appendChild(modal);

    modal
      .querySelector("#manaStrengthClose")
      .onclick = closeModal;

    modal
      .querySelector("#manaStrengthBuild")
      .onclick = buildProgram;

    modal
      .querySelectorAll(".mana-strength-option")
      .forEach(btn => {
        btn.onclick = () => {
          const group =
            btn.closest(
              "[data-strength-group]"
            );

          group
            .querySelectorAll(
              ".mana-strength-option"
            )
            .forEach(x =>
              x.classList.remove("active")
            );

          btn.classList.add("active");
        };
      });
  }

  function selected(group) {
    return (
      document.querySelector(
        `[data-strength-group="${group}"] .active`
      )?.dataset.value || ""
    );
  }

  function fullGymDays(days) {
    const plans = {
      2: [
        ["Full Body A", [
          ["Back Squat", "3 × 6–8"],
          ["Bench Press", "3 × 6–8"],
          ["Seated Row", "3 × 8–10"],
          ["Romanian Deadlift", "3 × 8"],
          ["Shoulder Press", "2 × 10"],
          ["Plank", "3 sets"]
        ]],
        ["Full Body B", [
          ["Deadlift", "3 × 5"],
          ["Incline DB Press", "3 × 8–10"],
          ["Lat Pulldown", "3 × 8–10"],
          ["Leg Press", "3 × 10"],
          ["DB Lateral Raise", "2 × 12–15"],
          ["Dead Bug", "3 sets"]
        ]]
      ],

      3: [
        ["Full Body A", [
          ["Back Squat", "3 × 6–8"],
          ["Bench Press", "3 × 6–8"],
          ["Seated Row", "3 × 8–10"],
          ["Romanian Deadlift", "3 × 8"],
          ["Core", "3 sets"]
        ]],
        ["Full Body B", [
          ["Deadlift", "3 × 5"],
          ["Shoulder Press", "3 × 8"],
          ["Lat Pulldown", "3 × 8–10"],
          ["Leg Press", "3 × 10"],
          ["Core", "3 sets"]
        ]],
        ["Full Body C", [
          ["Front Squat", "3 × 8"],
          ["Incline DB Press", "3 × 8–10"],
          ["Cable Row", "3 × 10"],
          ["Hip Thrust", "3 × 8–10"],
          ["Arms", "2 × 12"]
        ]]
      ],

      4: [
        ["Upper A", [
          ["Bench Press", "4 × 6"],
          ["Seated Row", "4 × 8"],
          ["Shoulder Press", "3 × 8"],
          ["Lat Pulldown", "3 × 10"],
          ["Biceps Curl", "2 × 12"],
          ["Triceps Pressdown", "2 × 12"]
        ]],
        ["Lower A", [
          ["Back Squat", "4 × 6"],
          ["Romanian Deadlift", "3 × 8"],
          ["Leg Press", "3 × 10"],
          ["Leg Curl", "3 × 10"],
          ["Calf Raise", "3 × 12"]
        ]],
        ["Upper B", [
          ["Incline DB Press", "3 × 8"],
          ["Cable Row", "3 × 8"],
          ["DB Shoulder Press", "3 × 10"],
          ["Pulldown", "3 × 10"],
          ["Lateral Raise", "2 × 15"],
          ["Arms", "2 × 12"]
        ]],
        ["Lower B", [
          ["Deadlift", "3 × 5"],
          ["Front Squat", "3 × 8"],
          ["Hip Thrust", "3 × 8"],
          ["Split Squat", "3 × 10"],
          ["Calf Raise", "3 × 12"]
        ]]
      ],

      5: [
        ["Push", [
          ["Bench Press", "4 × 6–8"],
          ["Incline DB Press", "3 × 8"],
          ["Shoulder Press", "3 × 8"],
          ["Lateral Raise", "3 × 12"],
          ["Triceps Pressdown", "3 × 12"]
        ]],
        ["Pull", [
          ["Deadlift", "3 × 5"],
          ["Lat Pulldown", "3 × 8"],
          ["Cable Row", "3 × 8"],
          ["Rear Delt Fly", "3 × 12"],
          ["Biceps Curl", "3 × 12"]
        ]],
        ["Legs", [
          ["Back Squat", "4 × 6"],
          ["Romanian Deadlift", "3 × 8"],
          ["Leg Press", "3 × 10"],
          ["Leg Curl", "3 × 10"],
          ["Calf Raise", "3 × 12"]
        ]],
        ["Upper", [
          ["Incline Press", "3 × 8"],
          ["Seated Row", "3 × 8"],
          ["Shoulder Press", "3 × 10"],
          ["Pulldown", "3 × 10"],
          ["Arms", "2 × 12"]
        ]],
        ["Lower", [
          ["Front Squat", "3 × 8"],
          ["Hip Thrust", "3 × 8"],
          ["Walking Lunge", "3 × 10"],
          ["Leg Curl", "3 × 12"],
          ["Core", "3 sets"]
        ]]
      ]
    };

    return plans[days] || plans[3];
  }

  function buildProgram() {
    const goal =
      selected("goal");

    const days =
      Number(selected("days")) || 3;

    const experience =
      selected("experience");

    const equipment =
      selected("equipment");

    const sessions =
      fullGymDays(days);

    const program = {
      goal,
      days,
      experience,
      equipment,
      createdAt:
        new Date().toISOString(),
      sessions
    };

    localStorage.setItem(
      STORE_KEY,
      JSON.stringify(program)
    );

    renderProgram(program);
  }

  function renderProgram(program) {
    const container =
      document.getElementById(
        "manaStrengthProgram"
      );

    if (!container) return;

    container.innerHTML = `
      <div class="mana-strength-section">

        <span class="pill">
          YOUR PROGRAM
        </span>

        <h2>
          MANA STRENGTH
        </h2>

        <div class="mana-strength-summary">
          ${program.goal} •
          ${program.days} days/week •
          ${program.experience} •
          ${program.equipment}
        </div>

        ${program.sessions.map(
          (session, index) => `
            <div class="mana-strength-day">
              <h3>
                Day ${index + 1} • ${session[0]}
              </h3>

              ${session[1].map(
                exercise => `
                  <div class="mana-strength-exercise">
                    <strong>
                      ${exercise[0]}
                    </strong>
                    <span>
                      ${exercise[1]}
                    </span>
                  </div>
                `
              ).join("")}

            </div>
          `
        ).join("")}

      </div>
    `;

    container.scrollIntoView({
      behavior:"smooth",
      block:"start"
    });
  }

  function restoreProgram() {
    try {
      const saved =
        JSON.parse(
          localStorage.getItem(STORE_KEY)
        );

      if (saved?.sessions) {
        renderProgram(saved);
      }
    } catch (_) {}
  }

  function openModal() {
    buildModal();

    document
      .getElementById(MODAL_ID)
      ?.classList.add("open");

    restoreProgram();
  }

  function closeModal() {
    document
      .getElementById(MODAL_ID)
      ?.classList.remove("open");
  }

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

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }

})();
