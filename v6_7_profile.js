/* =========================================
   MANA MOVEMENT TRAINING v6.7
   CLIENT PROFILE
   ========================================= */

(() => {
  "use strict";

  const STYLE_ID = "mana-profile-v67-style";
  const PROFILE_ID = "manaProfileScreen";
  const STORE_KEY = "mana-profile-v67";

  function safeJson(raw, fallback) {
    try {
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }

  function loadProfile() {
    return safeJson(
      localStorage.getItem(STORE_KEY) || "{}",
      {}
    );
  }

  function saveProfile(profile) {
    localStorage.setItem(
      STORE_KEY,
      JSON.stringify(profile)
    );
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style =
      document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `
      #${PROFILE_ID}{
        position:fixed;
        inset:0;
        z-index:25000;
        display:none;
        overflow:auto;
        background:#050505;
        padding:
          calc(env(safe-area-inset-top) + 18px)
          18px
          calc(105px + env(safe-area-inset-bottom));
      }

      #${PROFILE_ID}.open{
        display:block;
      }

      .mana-profile-shell{
        width:min(520px,100%);
        margin:auto;
      }

      .mana-profile-head{
        display:flex;
        justify-content:space-between;
        align-items:flex-start;
        gap:16px;
        margin-bottom:18px;
      }

      .mana-profile-head h1{
        margin:6px 0 4px;
        font-size:32px;
      }

      .mana-profile-close{
        width:44px;
        height:44px;
        flex:0 0 44px;
        border-radius:50%;
        border:1px solid #333;
        background:#111;
        color:#fff;
        font-size:24px;
      }

      .mana-profile-card{
        background:#101010;
        border:1px solid #292929;
        border-radius:20px;
        padding:16px;
        margin:12px 0;
      }

      .mana-profile-card h3{
        margin:0 0 12px;
      }

      .mana-profile-grid{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:10px;
      }

      .mana-profile-field{
        margin-bottom:12px;
      }

      .mana-profile-field label{
        display:block;
        margin-bottom:6px;
        color:#aaa;
        font-size:12px;
        font-weight:700;
      }

      .mana-profile-field input,
      .mana-profile-field select{
        width:100%;
        min-height:50px;
        margin:0 !important;
        padding:12px 14px;
        border-radius:13px;
        border:1px solid #333;
        background:#090909;
        color:white;
        font-size:15px;
      }

      .mana-profile-save{
        width:100%;
        min-height:58px;
        border:0;
        border-radius:16px;
        margin-top:8px;
        background:#f3d875;
        color:#111;
        font-size:17px;
        font-weight:900;
      }

      .mana-profile-status{
        min-height:22px;
        margin-top:8px;
        text-align:center;
        color:#f3d875;
        font-size:13px;
      }

      .mana-profile-summary{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:10px;
      }

      .mana-profile-stat{
        background:#0a0a0a;
        border:1px solid #292929;
        border-radius:14px;
        padding:13px;
      }

      .mana-profile-stat span{
        display:block;
        color:#888;
        font-size:11px;
        margin-bottom:4px;
      }

      .mana-profile-stat strong{
        color:#f3d875;
        font-size:15px;
      }

      @media(max-width:390px){
        .mana-profile-grid,
        .mana-profile-summary{
          grid-template-columns:1fr;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function ensureProfileScreen() {
    if (
      document.getElementById(PROFILE_ID)
    ) return;

    const screen =
      document.createElement("div");

    screen.id = PROFILE_ID;

    screen.innerHTML = `
      <div class="mana-profile-shell">

        <div class="mana-profile-head">
          <div>
            <span class="pill">
              MANA PROFILE
            </span>

            <h1>Your profile</h1>

            <div class="muted">
              Your training setup in one place.
            </div>
          </div>

          <button
            type="button"
            class="mana-profile-close"
            id="manaProfileClose"
          >
            ×
          </button>
        </div>

        <div class="mana-profile-card">
          <h3>Personal details</h3>

          <div class="mana-profile-field">
            <label>Name</label>

            <input
              type="text"
              id="manaProfileName"
              placeholder="Your name"
            />
          </div>

          <div class="mana-profile-grid">

            <div class="mana-profile-field">
              <label>Age</label>

              <input
                type="number"
                id="manaProfileAge"
                min="12"
                max="100"
                placeholder="Age"
              />
            </div>

            <div class="mana-profile-field">
              <label>Height cm</label>

              <input
                type="number"
                id="manaProfileHeight"
                min="100"
                max="230"
                placeholder="Height"
              />
            </div>

            <div class="mana-profile-field">
              <label>Weight kg</label>

              <input
                type="number"
                id="manaProfileWeight"
                min="30"
                max="300"
                step="0.1"
                placeholder="Weight"
              />
            </div>

            <div class="mana-profile-field">
              <label>Training days</label>

              <select id="manaProfileDays">
                <option value="">Select</option>
                <option value="2">2 days</option>
                <option value="3">3 days</option>
                <option value="4">4 days</option>
                <option value="5">5 days</option>
              </select>
            </div>

          </div>
        </div>

        <div class="mana-profile-card">
          <h3>Training setup</h3>

          <div class="mana-profile-field">
            <label>Goal</label>

            <select id="manaProfileGoal">
              <option value="">Select goal</option>
              <option value="Build muscle">
                Build muscle
              </option>
              <option value="Get stronger">
                Get stronger
              </option>
              <option value="General fitness">
                General fitness
              </option>
              <option value="Return to training">
                Return to training
              </option>
            </select>
          </div>

          <div class="mana-profile-grid">

            <div class="mana-profile-field">
              <label>Experience</label>

              <select id="manaProfileExperience">
                <option value="">
                  Select
                </option>
                <option value="Beginner">
                  Beginner
                </option>
                <option value="Intermediate">
                  Intermediate
                </option>
                <option value="Experienced">
                  Experienced
                </option>
                <option value="Returning">
                  Returning
                </option>
              </select>
            </div>

            <div class="mana-profile-field">
              <label>Equipment</label>

              <select id="manaProfileEquipment">
                <option value="">
                  Select
                </option>
                <option value="Full gym">
                  Full gym
                </option>
                <option value="Dumbbells">
                  Dumbbells
                </option>
                <option value="Home basics">
                  Home basics
                </option>
                <option value="Bodyweight">
                  Bodyweight
                </option>
              </select>
            </div>

          </div>
        </div>

        <div class="mana-profile-card">
          <h3>Current setup</h3>

          <div
            class="mana-profile-summary"
            id="manaProfileSummary"
          ></div>
        </div>

        <button
          type="button"
          class="mana-profile-save"
          id="manaProfileSave"
        >
          Save profile
        </button>

        <div
          class="mana-profile-status"
          id="manaProfileStatus"
        ></div>

      </div>
    `;

    document.body.appendChild(screen);

    document
      .getElementById(
        "manaProfileClose"
      )
      .onclick =
        closeProfile;

    document
      .getElementById(
        "manaProfileSave"
      )
      .onclick =
        handleSave;
  }

  function renderSummary(profile) {
    const holder =
      document.getElementById(
        "manaProfileSummary"
      );

    if (!holder) return;

    const items = [
      ["Goal", profile.goal || "Not set"],
      [
        "Training",
        profile.days
          ? `${profile.days} days/week`
          : "Not set"
      ],
      [
        "Experience",
        profile.experience || "Not set"
      ],
      [
        "Equipment",
        profile.equipment || "Not set"
      ]
    ];

    holder.innerHTML =
      items.map(
        item => `
          <div class="mana-profile-stat">
            <span>${item[0]}</span>
            <strong>${item[1]}</strong>
          </div>
        `
      ).join("");
  }

  function populateProfile() {
    const profile =
      loadProfile();

    document.getElementById(
      "manaProfileName"
    ).value =
      profile.name || "";

    document.getElementById(
      "manaProfileAge"
    ).value =
      profile.age || "";

    document.getElementById(
      "manaProfileHeight"
    ).value =
      profile.height || "";

    document.getElementById(
      "manaProfileWeight"
    ).value =
      profile.weight || "";

    document.getElementById(
      "manaProfileDays"
    ).value =
      profile.days || "";

    document.getElementById(
      "manaProfileGoal"
    ).value =
      profile.goal || "";

    document.getElementById(
      "manaProfileExperience"
    ).value =
      profile.experience || "";

    document.getElementById(
      "manaProfileEquipment"
    ).value =
      profile.equipment || "";

    renderSummary(profile);
  }

  function handleSave() {
    const profile = {
      name:
        document.getElementById(
          "manaProfileName"
        ).value.trim(),

      age:
        Number(
          document.getElementById(
            "manaProfileAge"
          ).value || 0
        ),

      height:
        Number(
          document.getElementById(
            "manaProfileHeight"
          ).value || 0
        ),

      weight:
        Number(
          document.getElementById(
            "manaProfileWeight"
          ).value || 0
        ),

      days:
        document.getElementById(
          "manaProfileDays"
        ).value,

      goal:
        document.getElementById(
          "manaProfileGoal"
        ).value,

      experience:
        document.getElementById(
          "manaProfileExperience"
        ).value,

      equipment:
        document.getElementById(
          "manaProfileEquipment"
        ).value,

      updatedAt:
        new Date().toISOString()
    };

    saveProfile(profile);

    renderSummary(profile);

    const status =
      document.getElementById(
        "manaProfileStatus"
      );

    if (status) {
      status.textContent =
        "Profile saved ✓";

      setTimeout(() => {
        status.textContent = "";
      }, 1500);
    }
  }

  function openProfile() {
    ensureProfileScreen();

    populateProfile();

    document
      .getElementById(PROFILE_ID)
      .classList.add("open");
  }

  function closeProfile() {
    document
      .getElementById(PROFILE_ID)
      ?.classList.remove("open");
  }

  function findProfileTab() {
    const candidates =
      [
        ...document.querySelectorAll(
          "button, [role='button'], nav *"
        )
      ];

    return candidates.find(el => {
      const text =
        (el.textContent || "")
          .trim()
          .toLowerCase();

      return text === "profile";
    });
  }

  function wireExistingProfileTab() {
    const profileTab =
      findProfileTab();

    if (!profileTab) return;

    if (
      profileTab.dataset
        .manaProfileWired === "1"
    ) return;

    profileTab.dataset
      .manaProfileWired = "1";

    profileTab.addEventListener(
      "click",
      event => {
        event.preventDefault();
        event.stopPropagation();

        openProfile();
      },
      true
    );
  }

  function init() {
    injectStyles();
    ensureProfileScreen();

    setInterval(
      wireExistingProfileTab,
      600
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
