/* =========================================
   MANA MOVEMENT TRAINING v6.5
   MANA STRENGTH BOTTOM NAV
   ========================================= */

(() => {
  "use strict";

  const STYLE_ID = "mana-strength-v65-nav-style";
  const NAV_ID = "manaStrengthBottomNav";

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      #${NAV_ID}{
        position:fixed;
        left:0;
        right:0;
        bottom:0;
        z-index:30000;
        display:none;
        grid-template-columns:repeat(5,1fr);
        min-height:78px;
        padding:
          8px
          10px
          calc(8px + env(safe-area-inset-bottom));
        background:rgba(5,5,5,.98);
        border-top:1px solid #242424;
        backdrop-filter:blur(10px);
      }

      #${NAV_ID}.show{
        display:grid;
      }

      .mana-v65-nav-btn{
        border:0;
        background:transparent;
        color:#888;
        min-height:56px;
        border-radius:12px;
        font-size:12px;
        font-weight:700;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        gap:5px;
      }

      .mana-v65-nav-icon{
        font-size:19px;
        line-height:1;
      }

      .mana-v65-nav-btn.active{
        color:#f3d875;
      }

      .mana-v65-nav-btn.active
      .mana-v65-nav-icon{
        color:#f3d875;
      }

      #manaStrengthModal,
      #manaStrengthWorkout,
      #manaStrengthV64Workout{
        padding-bottom:
          calc(105px + env(safe-area-inset-bottom))
          !important;
      }
    `;

    document.head.appendChild(style);
  }

  function buildNav() {
    if (document.getElementById(NAV_ID)) return;

    const nav = document.createElement("div");
    nav.id = NAV_ID;

    nav.innerHTML = `
      <button
        class="mana-v65-nav-btn"
        type="button"
        data-v65-page="home"
      >
        <span class="mana-v65-nav-icon">⌂</span>
        <span>Home</span>
      </button>

      <button
        class="mana-v65-nav-btn"
        type="button"
        data-v65-page="fuel"
      >
        <span class="mana-v65-nav-icon">○</span>
        <span>Fuel</span>
      </button>

      <button
        class="mana-v65-nav-btn"
        type="button"
        data-v65-page="progress"
      >
        <span class="mana-v65-nav-icon">↗</span>
        <span>Progress</span>
      </button>
<button
  class="mana-v65-nav-btn"
  type="button"
  data-v65-page="profile"
>
  <span class="mana-v65-nav-icon">◎</span>
  <span>Profile</span>
</button>
      <button
        class="mana-v65-nav-btn active"
        type="button"
        data-v65-page="strength"
      >
        <span class="mana-v65-nav-icon">S</span>
        <span>Strength</span>
      </button>
    `;

    document.body.appendChild(nav);

    nav
      .querySelectorAll("[data-v65-page]")
      .forEach(button => {
        button.onclick = () =>
          handleNav(
            button.dataset.v65Page
          );
      });
  }

  function closeStrengthScreens() {
    [
      "manaStrengthModal",
      "manaStrengthWorkout",
      "manaStrengthV64Workout"
    ].forEach(id => {
      document
        .getElementById(id)
        ?.classList.remove("open");
    });
  }

  function findMainNavButton(label) {
    const wanted =
      label.toLowerCase();

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

      return text === wanted;
    });
  }

  function clickMainNav(label) {
    const button =
      findMainNavButton(label);

    if (button) {
      button.click();
      return true;
    }

    return false;
  }

  function openStrengthHome() {
    closeStrengthScreens();

    setTimeout(() => {
      const strengthCard =
        [
          ...document.querySelectorAll(
            "#clientView .day"
          )
        ].find(el =>
          (el.textContent || "")
            .toUpperCase()
            .includes("MANA STRENGTH")
        );

      strengthCard?.click();
    }, 120);
  }

  function handleNav(page) {
    if (page === "strength") {
      openStrengthHome();
      return;
    }

    closeStrengthScreens();

    if (page === "home") {
      clickMainNav("Home");
    }

    if (page === "fuel") {
      clickMainNav("Fuel");
    }

    if (page === "progress") {
      clickMainNav("Progress");
     }
     
       if (page === "profile") {
  clickMainNav("Profile");
}

    setTimeout(
      updateVisibility,
      100
    );
  }

  function strengthOpen() {
    return Boolean(
      document.querySelector(
        `
        #manaStrengthModal.open,
        #manaStrengthWorkout.open,
        #manaStrengthV64Workout.open
        `
      )
    );
  }

  function updateVisibility() {
    const nav =
      document.getElementById(NAV_ID);

    if (!nav) return;

    nav.classList.toggle(
      "show",
      strengthOpen()
    );
  }

  function init() {
    injectStyles();
    buildNav();

    updateVisibility();

    const observer =
      new MutationObserver(
        updateVisibility
      );

    observer.observe(
      document.body,
      {
        subtree:true,
        attributes:true,
        attributeFilter:["class"]
      }
    );

    setInterval(
      updateVisibility,
      700
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
