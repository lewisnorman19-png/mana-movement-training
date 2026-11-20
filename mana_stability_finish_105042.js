
/*
 MANA MOVEMENT
 STABILITY + BANNER REPAIRS
 BUILD 105042

 Complete JavaScript file.
 Load after the existing scripts.
*/

(() => {
  "use strict";

  if (window.MANA_STABILITY_FINISH_105042) return;
  window.MANA_STABILITY_FINISH_105042 = true;

  const $ = id => document.getElementById(id);
  const STYLE_ID = "mana-stability-105042";

  const css = `
    /* Remove decorative yellow banner streaks */

    #manaV80Home #manaV80Mana28::before,
    #manaV80Home #manaV80Strength::before,
    #manaV80Home #manaV80Mana28
      .mana-v8013-program-label::before,
    #manaV80Home #manaV80Strength
      .mana-v8013-program-label::before,
    #manaV80Home #manaV80Mana28
      .mana-v8013-program-label::after,
    #manaV80Home #manaV80Strength
      .mana-v8013-program-label::after {
      content: none !important;
      display: none !important;
    }

    #manaV80Home #manaV80Mana28,
    #manaV80Home #manaV80Strength,
    #manaV80Home #manaV80Life {
      background-image:
        linear-gradient(
          135deg,
          #191B20,
          #101215 72%,
          #1B130E
        ) !important;
    }

    /* Keep banner labels clear of icons */

    #manaV80Home button.mana-v8013-program
      > .mana-v8013-program-label {
      box-sizing: border-box !important;
      width: calc(100% - 124px) !important;
      max-width: calc(100% - 124px) !important;
      overflow-wrap: break-word !important;
    }

    /* ManaLyfe heading alignment */

    #manaV80Home #manaV80Life > h2 {
      box-sizing: border-box !important;
      top: 96px !important;
      left: 18px !important;
      right: 18px !important;
      width: calc(100% - 36px) !important;
      max-width: calc(100% - 36px) !important;
      font-size: clamp(19px,5.2vw,22px) !important;
      line-height: 1.12 !important;
      white-space: normal !important;
    }

    #manaV80Home #manaV80Life > h2
      .mana-lyfe-line-105041 {
      display: block !important;
      white-space: normal !important;
    }

    #manaV80Home #manaV80Life > p {
      top: 185px !important;
    }

    /* ManaLyfe membership text */

    #manaV80Home #manaV80Life::before {
      left: 18px !important;
      bottom: 13px !important;
      max-width: 55% !important;
      width: 55% !important;
      text-align: left !important;
      line-height: 1.25 !important;
      font-size: 11px !important;
    }

    /* Permanent orange Profile shortcut */

    #manaV83ProgramShell #manaQuickProfile105042 {
      display: inline-flex !important;
      visibility: visible !important;
      opacity: 1 !important;
      align-items: center !important;
      justify-content: center !important;
      color: #FF7927 !important;
      -webkit-text-fill-color: #FF7927 !important;
      background: transparent !important;
      border: 1px solid #FF7927 !important;
      border-radius: 12px !important;
      padding: 8px 12px !important;
      font-size: 13px !important;
      font-weight: 800 !important;
      cursor: pointer !important;
      min-height: 38px !important;
      white-space: nowrap !important;
    }

    #manaV83ProgramShell
      .mana-hub-home-row:has(#manaQuickProfile105042) {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      gap: 10px !important;
    }

    /* Keep Learning navigation visible */

    #manaV83ProgramShell.open #manaV83Tabs
      button.mana-v83-tab[data-v83-tab="learning"],
    #manaV83ProgramShell.open #manaV83Tabs
      button.mana-v83-tab[data-v83-tab="learn"] {
      display: flex !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
  `;

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function isStrengthOverview() {
    const shell = $("manaV83ProgramShell");

    return !!(
      shell?.classList.contains("open") &&
      $("manaV83Title")?.textContent
        .trim().toUpperCase() === "MANA STRENGTH" &&
      document.querySelector(
        "#manaV83Tabs .mana-v83-tab.active"
      )?.dataset.v83Tab === "overview"
    );
  }

  function ensureStrength() {
    if (!isStrengthOverview()) return;

    const shell = $("manaV83ProgramShell");
    const launch = $("manaV964Launchpad");

    if (!shell || !launch) return;

    const row = launch.querySelector(
      ".mana-hub-home-row"
    );

    if (!row) return;

    let quick = $("manaQuickProfile105042");

    if (!quick) {
      quick = document.createElement("button");
      quick.type = "button";
      quick.id = "manaQuickProfile105042";
      quick.textContent = "Profile";

      quick.setAttribute(
        "aria-label",
        "Open client profile"
      );

      quick.addEventListener("click", () => {
        const card = launch.querySelector(
          '.mana-v964-launch[data-v964-launch="profile"]'
        );

        if (card) {
          card.click();
        } else {
          console.warn(
            "[Mana 105042] Profile launch card missing"
          );
        }
      });
    }

    if (quick.parentNode !== row) {
      row.appendChild(quick);
    }

    const tabs = $("manaV83Tabs");

    tabs?.querySelectorAll(".mana-v83-tab")
      .forEach(tab => {
        if (/^(learning|learn)$/i.test(
          tab.dataset.v83Tab || ""
        )) {
          tab.style.removeProperty("display");
          tab.style.removeProperty("visibility");
        }
      });
  }

  /* Date of birth local backup */

  function dobKey() {
    const email = (
      $("me-account-email")?.value || ""
    ).trim().toLowerCase();

    return email
      ? "mana-dob-backup-105042:" + email
      : null;
  }

  const validDate = value => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) {
      return false;
    }

    const d = new Date(value + "T12:00:00");

    return (
      !Number.isNaN(d.getTime()) &&
      d.toISOString().slice(0,10) === value &&
      d <= new Date()
    );
  };

  function saveDob() {
    const input = $("me-dob");
    const key = dobKey();

    if (!input || !key || !validDate(input.value)) {
      return;
    }

    try {
      localStorage.setItem(key, input.value);
    } catch (_) {}
  }

  function restoreDob() {
    const screen = $("manaProfileScreen");
    const input = $("me-dob");
    const key = dobKey();

    if (
      !screen?.classList.contains("open") ||
      !input ||
      !key
    ) return;

    if (validDate(input.value)) {
      saveDob();
      return;
    }

    if (document.activeElement === input) return;

    let saved = "";

    try {
      saved = localStorage.getItem(key) || "";
    } catch (_) {}

    if (!validDate(saved)) return;

    input.value = saved;

    input.dispatchEvent(
      new Event("input", {bubbles:true})
    );

    input.dispatchEvent(
      new Event("change", {bubbles:true})
    );
  }

  let lastProfileOpen = false;
  let lastDob = "";

  function checkProfile() {
    const screen = $("manaProfileScreen");
    const input = $("me-dob");

    const open = !!screen?.classList.contains("open");

    if (open && !lastProfileOpen) {
      [0,250,800,1600].forEach(ms =>
        setTimeout(restoreDob, ms)
      );
    }

    lastProfileOpen = open;

    if (!open || !input) return;

    if (
      validDate(input.value) &&
      input.value !== lastDob
    ) {
      lastDob = input.value;
      saveDob();
    }
  }

  /* ManaLyfe three-line heading */

  function repairHome() {
    const heading = document.querySelector(
      "#manaV80Home #manaV80Life > h2"
    );

    if (!heading) return;

    const lines = heading.querySelectorAll(
      ":scope > .mana-lyfe-line-105041"
    );

    const values = [
      "Reset.",
      "Rebuild.",
      "Move Forward."
    ];

    if (
      lines.length === 3 &&
      values.every(
        (value,i) => lines[i].textContent === value
      )
    ) return;

    if (!/reset|rebuild|move forward/i.test(
      heading.textContent || ""
    )) return;

    heading.replaceChildren(
      ...values.map(value => {
        const span = document.createElement("span");
        span.className = "mana-lyfe-line-105041";
        span.textContent = value;
        return span;
      })
    );
  }

  function refresh() {
    ensureStrength();
    checkProfile();
    repairHome();
  }

  function init() {
    installStyles();
    refresh();

    document.addEventListener("input", event => {
      if (event.target?.id === "me-dob") {
        saveDob();
      }
    }, true);

    document.addEventListener("change", event => {
      if (event.target?.id === "me-dob") {
        saveDob();
      }
    }, true);

    document.addEventListener("click", event => {
      if (event.target?.closest?.("#manaProfileSave")) {
        saveDob();
      }

      if (event.target?.closest?.(
        "#manaV83Tabs, #manaV80HomeBtn, " +
        "[data-open-profile], #manaProfileButton"
      )) {
        [0,100,400].forEach(ms =>
          setTimeout(refresh, ms)
        );
      }
    }, true);

    window.addEventListener(
      "mana:profile-synced",
      () => setTimeout(refresh,250)
    );

    window.addEventListener(
      "mana:program-tab-change",
      () => requestAnimationFrame(refresh)
    );

    window.addEventListener("pageshow",refresh);

    setInterval(refresh,900);

    console.log(
      "[Mana Movement] Stability + banners 105042 loaded"
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {once:true}
    );
  } else {
    init();
  }
})();
