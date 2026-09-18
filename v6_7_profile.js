/* =========================================
   MANA MOVEMENT TRAINING v6.7.4
   CLIENT PROFILE
   CLEAN PROFILE LAYOUT
   ========================================= */

(() => {
  "use strict";

  const STYLE_ID =
    "mana-profile-v674-style";

  const PROFILE_ID =
    "manaProfileScreen";

  const STORE_KEY =
    "mana-profile-v67";

  let returnTo =
    "home";


  function safeJson(
    raw,
    fallback
  ) {
    try {
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }


  function loadProfile() {
    return safeJson(
      localStorage.getItem(
        STORE_KEY
      ) || "{}",
      {}
    );
  }


  function saveProfile(
    profile
  ) {
    localStorage.setItem(
      STORE_KEY,
      JSON.stringify(
        profile
      )
    );
  }


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

      #${PROFILE_ID}{
        position:fixed;
        inset:0;
        z-index:25000;

        display:none;

        overflow:auto;

        background:#050505;

        padding:
          calc(
            env(
              safe-area-inset-top
            ) + 18px
          )
          18px
          calc(
            105px +
            env(
              safe-area-inset-bottom
            )
          );
      }


      #${PROFILE_ID}.open{
        display:block;
      }


      .mana-profile-shell{
        width:min(
          520px,
          100%
        );

        margin:auto;
      }


      .mana-profile-head{
        display:flex;

        justify-content:
          space-between;

        align-items:
          flex-start;

        gap:16px;

        margin-bottom:18px;
      }


      .mana-profile-head h1{
        margin:
          6px
          0
          4px;

        font-size:32px;
      }


      .mana-profile-close{
        width:44px;
        height:44px;

        flex:
          0
          0
          44px;

        border-radius:50%;

        border:
          1px solid
          #333;

        background:#111;

        color:#fff;

        font-size:24px;
      }


      .mana-profile-card{
        background:#101010;

        border:
          1px solid
          #292929;

        border-radius:20px;

        padding:16px;

        margin:
          12px
          0;
      }


      .mana-profile-card h3{
        margin:
          0
          0
          12px;
      }


      .mana-profile-training{
        border:
          1px solid
          rgba(
            243,
            216,
            117,
            .35
          );

        background:
          linear-gradient(
            145deg,
            #17150d,
            #0c0c0c
          );
      }


      .mana-profile-training h3{
        color:#f3d875;

        text-transform:uppercase;

        letter-spacing:.05em;
      }


      .mana-profile-grid{
        display:grid;

        grid-template-columns:
          1fr
          1fr;

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

        padding:
          12px
          14px;

        border-radius:13px;

        border:
          1px solid
          #333;

        background:#090909;

        color:#fff;

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


      @media(max-width:390px){

        /*
          Keep these paired fields
          side-by-side on phone.
        */

        .mana-profile-grid{
          grid-template-columns:
            1fr
            1fr;
        }

      }


      @media(max-width:330px){

        .mana-profile-grid{
          grid-template-columns:
            1fr;
        }

      }

    `;


    document.head.appendChild(
      style
    );
  }


  function ensureProfileScreen() {
    if (
      document.getElementById(
        PROFILE_ID
      )
    ) return;


    const screen =
      document.createElement(
        "div"
      );


    screen.id =
      PROFILE_ID;


    screen.innerHTML = `

      <div
        class="mana-profile-shell"
      >

        <div
          class="mana-profile-head"
        >

          <div>

            <span
              class="pill"
            >
              MANA PROFILE
            </span>

            <h1>
              Your profile
            </h1>

            <div
              class="muted"
            >
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


        <!-- PERSONAL DETAILS -->

        <div
          class="mana-profile-card"
        >

          <h3>
            Personal details
          </h3>


          <div
            class="mana-profile-field"
          >

            <label>
              Name
            </label>

            <input
              type="text"
              id="manaProfileName"
              placeholder="Your name"
            />

          </div>


          <div
            class="mana-profile-grid"
          >

            <div
              class="mana-profile-field"
            >

              <label>
                Age
              </label>

              <input
                type="number"
                id="manaProfileAge"
                min="12"
                max="100"
                placeholder="Age"
              />

            </div>


            <div
              class="mana-profile-field"
            >

              <label>
                Gender
              </label>

              <select
                id="manaProfileGender"
              >

                <option value="">
                  Select
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Non-binary">
                  Non-binary
                </option>

                <option value="Prefer not to say">
                  Prefer not to say
                </option>

              </select>

            </div>


            <div
              class="mana-profile-field"
            >

              <label>
                Height cm
              </label>

              <input
                type="number"
                id="manaProfileHeight"
                min="100"
                max="230"
                placeholder="Height"
              />

            </div>


            <div
              class="mana-profile-field"
            >

              <label>
                Weight kg
              </label>

              <input
                type="number"
                id="manaProfileWeight"
                min="30"
                max="300"
                step="0.1"
                placeholder="Weight"
              />

            </div>

          </div>

        </div>


        <!-- TRAINING SETUP -->

        <div
          class="
            mana-profile-card
            mana-profile-training
          "
        >

          <h3>
            Training setup
          </h3>


          <div
            class="mana-profile-grid"
          >

            <div
              class="mana-profile-field"
            >

              <label>
                Goal
              </label>

              <select
                id="manaProfileGoal"
              >

                <option value="">
                  Select goal
                </option>

                <option value="Build muscle">
                  Build muscle
                </option>

                <option value="Weight loss">
                  Weight loss
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


            <div
              class="mana-profile-field"
            >

              <label>
                Training days
              </label>

              <select
                id="manaProfileDays"
              >

                <option value="">
                  Select
                </option>

                <option value="2">
                  2 days
                </option>

                <option value="3">
                  3 days
                </option>

                <option value="4">
                  4 days
                </option>

                <option value="5">
                  5 days
                </option>

              </select>

            </div>


            <div
              class="mana-profile-field"
            >

              <label>
                Experience
              </label>

              <select
                id="manaProfileExperience"
              >

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


            <div
              class="mana-profile-field"
            >

              <label>
                Equipment
              </label>

              <select
                id="manaProfileEquipment"
              >

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


        <button
          type="button"
          class="mana-profile-save"
          id="manaProfileSave"
        >
          SAVE PROFILE
        </button>


        <div
          class="mana-profile-status"
          id="manaProfileStatus"
        ></div>

      </div>

    `;


    document.body.appendChild(
      screen
    );


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


  function populateProfile() {
    const profile =
      loadProfile();


    document
      .getElementById(
        "manaProfileName"
      )
      .value =
        profile.name || "";


    document
      .getElementById(
        "manaProfileAge"
      )
      .value =
        profile.age || "";


    document
      .getElementById(
        "manaProfileGender"
      )
      .value =
        profile.gender || "";


    document
      .getElementById(
        "manaProfileHeight"
      )
      .value =
        profile.height || "";


    document
      .getElementById(
        "manaProfileWeight"
      )
      .value =
        profile.weight || "";


    document
      .getElementById(
        "manaProfileGoal"
      )
      .value =
        profile.goal || "";


    document
      .getElementById(
        "manaProfileDays"
      )
      .value =
        profile.days || "";


    document
      .getElementById(
        "manaProfileExperience"
      )
      .value =
        profile.experience || "";


    document
      .getElementById(
        "manaProfileEquipment"
      )
      .value =
        profile.equipment || "";
  }


  function handleSave() {
    const previous =
      loadProfile();


    const profile = {

      ...previous,

      name:
        document
          .getElementById(
            "manaProfileName"
          )
          .value
          .trim(),

      age:
        Number(
          document
            .getElementById(
              "manaProfileAge"
            )
            .value ||
            0
        ),

      gender:
        document
          .getElementById(
            "manaProfileGender"
          )
          .value,

      height:
        Number(
          document
            .getElementById(
              "manaProfileHeight"
            )
            .value ||
            0
        ),

      weight:
        Number(
          document
            .getElementById(
              "manaProfileWeight"
            )
            .value ||
            0
        ),

      goal:
        document
          .getElementById(
            "manaProfileGoal"
          )
          .value,

      days:
        document
          .getElementById(
            "manaProfileDays"
          )
          .value,

      experience:
        document
          .getElementById(
            "manaProfileExperience"
          )
          .value,

      equipment:
        document
          .getElementById(
            "manaProfileEquipment"
          )
          .value,

      updatedAt:
        new Date()
          .toISOString()

    };


    saveProfile(
      profile
    );


    const status =
      document.getElementById(
        "manaProfileStatus"
      );


    if (status) {

      status.textContent =
        "Profile saved ✓";


      setTimeout(
        () => {

          status.textContent =
            "";

        },
        1500
      );
    }


    window.dispatchEvent(
      new CustomEvent(
        "mana:profile-synced"
      )
    );
  }


  function strengthIsOpen() {
    const shell =
      document.getElementById(
        "manaV83ProgramShell"
      );


    const title =
      document.getElementById(
        "manaV83Title"
      );


    return Boolean(
      shell
        ?.classList
        .contains(
          "open"
        ) &&

      title
        ?.textContent
        .trim()
        .toUpperCase() ===
        "MANA STRENGTH"
    );
  }


  function openProfile() {
    ensureProfileScreen();


    returnTo =
      strengthIsOpen()
        ? "strength"
        : "home";


    populateProfile();


    document
      .getElementById(
        PROFILE_ID
      )
      .classList
      .add(
        "open"
      );
  }


  window.openManaProfile =
    openProfile;


  function closeProfile() {
    document
      .getElementById(
        PROFILE_ID
      )
      ?.classList
      .remove(
        "open"
      );


    if (
      returnTo ===
      "strength"
    ) {

      if (
        typeof
          window
            .openManaProgram ===
        "function"
      ) {

        window
          .openManaProgram(
            "strength"
          );

      }
    }


    returnTo =
      "home";
  }


  function findProfileTab() {
    const candidates =
      [
        ...document
          .querySelectorAll(
            "button, [role='button'], nav *"
          )
      ];


    return candidates.find(
      el => {

        const text =
          (
            el.textContent ||
            ""
          )
            .trim()
            .toLowerCase();


        return (
          text ===
          "profile"
        );

      }
    );
  }


  function wireExistingProfileTab() {
    const profileTab =
      findProfileTab();


    if (!profileTab) return;


    if (
      profileTab.dataset
        .manaProfileWired ===
      "1"
    ) return;


    profileTab.dataset
      .manaProfileWired =
        "1";


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
