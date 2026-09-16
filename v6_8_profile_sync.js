/* =========================================
   MANA MOVEMENT TRAINING v6.8
   MASTER PROFILE SYNC
   ========================================= */

(() => {
  "use strict";

  const PROFILE_KEY = "mana-profile-v67";

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

  function selectStrengthOption(group, value) {
    if (!value) return;

    const holder =
      document.querySelector(
        `[data-strength-group="${group}"]`
      );

    if (!holder) return;

    const buttons =
      holder.querySelectorAll(
        ".mana-strength-option"
      );

    buttons.forEach(btn => {
      btn.classList.remove("active");

      if (
        String(btn.dataset.value) ===
        String(value)
      ) {
        btn.classList.add("active");
      }
    });
  }

  function syncStrengthFromProfile() {
    const profile = loadProfile();

    if (!profile) return;

    selectStrengthOption(
      "goal",
      profile.goal
    );

    selectStrengthOption(
      "days",
      profile.days
    );

    selectStrengthOption(
      "experience",
      profile.experience
    );

    selectStrengthOption(
      "equipment",
      profile.equipment
    );
  }

  function wireFuelProfileButton() {
    const button =
      document.getElementById(
        "fuelV58UpdateProfile"
      );

    if (!button) return;

    if (
      button.dataset
        .manaMasterProfile === "1"
    ) return;

    button.dataset
      .manaMasterProfile = "1";

    button.textContent =
      "Update profile";

    button.onclick = event => {
      event.preventDefault();
      event.stopPropagation();

      if (
        typeof window.openManaProfile ===
        "function"
      ) {
        window.openManaProfile();
      }
    };
  }

  function syncWhenStrengthOpens() {
    const modal =
      document.getElementById(
        "manaStrengthModal"
      );

    if (!modal) return;

    if (
      modal.dataset
        .manaProfileSync === "1"
    ) return;

    modal.dataset
      .manaProfileSync = "1";

    const observer =
      new MutationObserver(() => {
        if (
          modal.classList.contains("open")
        ) {
          setTimeout(
            syncStrengthFromProfile,
            50
          );
        }
      });

    observer.observe(
      modal,
      {
        attributes: true,
        attributeFilter: ["class"]
      }
    );
  }

  let lastProfile =
    localStorage.getItem(PROFILE_KEY);

  function watchProfileChanges() {
    const current =
      localStorage.getItem(PROFILE_KEY);

    if (
      current === lastProfile
    ) return;

    lastProfile = current;

    syncStrengthFromProfile();
  }

  function init() {
    setTimeout(() => {
      syncStrengthFromProfile();
      syncWhenStrengthOpens();
      wireFuelProfileButton();
    }, 300);

    setTimeout(() => {
      syncStrengthFromProfile();
      syncWhenStrengthOpens();
      wireFuelProfileButton();
    }, 1000);

    setInterval(() => {
      watchProfileChanges();
      wireFuelProfileButton();
      syncWhenStrengthOpens();
    }, 800);
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
