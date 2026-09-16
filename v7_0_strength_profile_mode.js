/* =========================================
   MANA MOVEMENT TRAINING v7.0
   PROFILE-DRIVEN MANA STRENGTH
   ========================================= */

(() => {
  "use strict";

  const PROFILE_KEY = "mana-profile-v67";
  const MODAL_ID = "manaStrengthModal";
  const STYLE_ID = "mana-v70-strength-profile-style";
  const SUMMARY_ID = "manaStrengthProfileSummary";

  function safeJson(raw, fallback) {
    try {
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }

  function loadProfile() {
    return safeJson(
      localStorage.getItem(PROFILE_KEY) || "{}",
      {}
    );
  }

  function profileReady(profile) {
    return Boolean(
      profile.goal &&
      profile.days &&
      profile.experience &&
      profile.equipment
    );
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      #${MODAL_ID}.mana-profile-strength
      .mana-strength-shell >
      .mana-strength-section {
        display:none !important;
      }

      #${SUMMARY_ID}{
        display:block !important;
        background:#101010;
        border:1px solid #292310;
        border-radius:20px;
        padding:16px;
        margin:12px 0 18px;
      }

      #${SUMMARY_ID} .mana-v70-label{
        color:#999;
        font-size:12px;
        margin-bottom:6px;
      }

      #${SUMMARY_ID} .mana-v70-profile-line{
        color:#f3d875;
        font-weight:800;
        line-height:1.5;
      }

      #${SUMMARY_ID} .mana-v70-edit{
        width:100%;
        margin-top:12px;
        min-height:44px;
        border-radius:14px;
        border:1px solid #4a3d12;
        background:#111;
        color:#f3d875;
        font-weight:800;
        cursor:pointer;
      }

      #${MODAL_ID}
      #manaStrengthProgram
      .mana-strength-section{
        display:block !important;
      }
    `;

    document.head.appendChild(style);
  }

  function updateHomeCard() {
    const cards =
      [...document.querySelectorAll(
        "#clientView .day"
      )];

    const card =
      cards.find(el => {
        const text =
          (el.textContent || "")
            .toUpperCase();

        return (
          text.includes("MANA STRENGTH") ||
          text.includes("MANA STRONG")
        );
      });

    if (!card) return;

    const tiny =
      card.querySelectorAll(".tiny");

    if (tiny[0]) {
      tiny[0].textContent =
        "Personalised strength training";
    }

    if (tiny[1]) {
      tiny[1].textContent =
        "VIEW YOUR PROGRAM";

      tiny[1].classList.add("gold");
      tiny[1].classList.remove("muted");
    }
  }

  function addProfileSummary() {
    const modal =
      document.getElementById(MODAL_ID);

    if (!modal) return;

    const shell =
      modal.querySelector(
        ".mana-strength-shell"
      );

    const head =
      modal.querySelector(
        ".mana-strength-head"
      );

    if (!shell || !head) return;

    let summary =
      document.getElementById(
        SUMMARY_ID
      );

    if (!summary) {
      summary =
        document.createElement("div");

      summary.id = SUMMARY_ID;

      head.insertAdjacentElement(
        "afterend",
        summary
      );
    }

    const profile =
      loadProfile();

    if (!profileReady(profile)) {
      summary.innerHTML = `
        <div class="mana-v70-label">
          YOUR TRAINING SETUP
        </div>

        <div class="mana-v70-profile-line">
          Complete your Profile to create
          your Mana Strength program.
        </div>

        <button
          type="button"
          class="mana-v70-edit"
          id="manaV70EditProfile"
        >
          Complete profile
        </button>
      `;
    } else {
      summary.innerHTML = `
        <div class="mana-v70-label">
          YOUR TRAINING SETUP
        </div>

        <div class="mana-v70-profile-line">
          ${profile.goal}
          • ${profile.days} days/week
          • ${profile.experience}
          • ${profile.equipment}
        </div>

        <button
          type="button"
          class="mana-v70-edit"
          id="manaV70EditProfile"
        >
          Edit profile
        </button>
      `;
    }

    document
      .getElementById(
        "manaV70EditProfile"
      )
      ?.addEventListener(
        "click",
        () => {
          modal.classList.remove("open");

          if (
            typeof window.openManaProfile ===
            "function"
          ) {
            window.openManaProfile();
          }
        }
      );
  }

  function autoBuildProgram() {
    const profile =
      loadProfile();

    if (!profileReady(profile)) return;

    /*
      v6.8 has already selected the
      correct buttons from Profile.
      We simply press the existing
      builder automatically.
    */

    setTimeout(() => {
      const buildButton =
        document.getElementById(
          "manaStrengthBuild"
        );

      if (buildButton) {
        buildButton.click();
      }
    }, 150);
  }

  function activateProfileMode() {
    const modal =
      document.getElementById(MODAL_ID);

    if (!modal) return;

    modal.classList.add(
      "mana-profile-strength"
    );

    const heading =
      modal.querySelector(
        ".mana-strength-head h1"
      );

    if (heading) {
      heading.textContent =
        "Your program";
    }

    const subtitle =
      modal.querySelector(
        ".mana-strength-head .muted"
      );

    if (subtitle) {
      subtitle.textContent =
        "Training built around your profile.";
    }

    addProfileSummary();
    autoBuildProgram();
  }

  function watchStrength() {
    const modal =
      document.getElementById(MODAL_ID);

    if (!modal) return;

    if (
      modal.dataset
        .manaV70Observed === "1"
    ) {
      return;
    }

    modal.dataset
      .manaV70Observed = "1";

    const observer =
      new MutationObserver(() => {
        if (
          modal.classList.contains("open")
        ) {
          /*
            Give v6.8 time to apply
            Profile selections first.
          */
          setTimeout(
            activateProfileMode,
            100
          );
        }
      });

    observer.observe(
      modal,
      {
        attributes:true,
        attributeFilter:["class"]
      }
    );
  }

  function init() {
    injectStyles();

    setTimeout(() => {
      updateHomeCard();
      watchStrength();
    }, 400);

    setTimeout(() => {
      updateHomeCard();
      watchStrength();
    }, 1200);

    window.addEventListener(
      "mana:profile-synced",
      () => {
        updateHomeCard();

        const modal =
          document.getElementById(
            MODAL_ID
          );

        if (
          modal?.classList.contains(
            "open"
          )
        ) {
          activateProfileMode();
        }
      }
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
