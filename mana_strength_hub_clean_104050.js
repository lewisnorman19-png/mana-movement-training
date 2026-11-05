
/* ==============================================================
   MANA MOVEMENT — CLEAN STRENGTH HUB 104050
   COMPLETE FILE. Replaces mana_strength_overview_design_104040.js.

   Overview only: removes old gold header branding, keeps Home
   navigation, displays four existing working launch cards
   (Profile, Workouts, Fuel, Progress) and one teal Coach Chat card.
   Chat uses the existing openManaStrengthClientChat function.
   Does not modify workouts, training data, plans, Fuel, Progress,
   Learning, billing, tabs or other program screens.
   ============================================================== */
(() => {
  "use strict";

  if (window.MANA_STRENGTH_HUB_104050) return;
  window.MANA_STRENGTH_HUB_104050 = true;

  const STYLE_ID = "manaStrengthHubStyle104050";
  const BRAND_ID = "manaStrengthHubBrand104050";
  const CHAT_ID = "manaStrengthHubChat104050";
  const SHELL_ID = "manaV83ProgramShell";
  const HOLDER_ID = "manaV83Content";
  const LAUNCH_ID = "manaV964Launchpad";
  const $ = id => document.getElementById(id);

  function addStyles() {
    if ($(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      /* Scope absolutely everything to the existing Strength Overview.
         :has() ensures other tabs and Mana28/ManaLyfe keep their UI. */
      html body #${SHELL_ID}:has(#${LAUNCH_ID}) {
        background:#08090B!important;
        color:#FFFFFF!important;
      }
      html body #${SHELL_ID}:has(#${LAUNCH_ID}) .mana-v83-shell {
        width:min(1200px,100%)!important;
        max-width:1200px!important;
        margin:0 auto!important;
      }
      /* Old yellow M, MANA STRENGTH and membership strip disappear
         on Overview only. Keep the original Back button operable. */
      html body #${SHELL_ID}:has(#${LAUNCH_ID}) .mana-v83-head {
        display:flex!important;
        justify-content:flex-end!important;
        align-items:center!important;
        min-height:42px!important;
        margin:0 0 7px!important;
        padding:0!important;
      }
      html body #${SHELL_ID}:has(#${LAUNCH_ID})
        .mana-v83-head .mana-v83-brand-wrap {
        display:none!important;
      }
      html body #${SHELL_ID}:has(#${LAUNCH_ID}) .mana-v83-back {
        background:#15171B!important;
        border:1px solid #707780!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        box-shadow:none!important;
      }
      html body #${SHELL_ID}:has(#${LAUNCH_ID})
        #manaV98PlanBar {
        display:none!important;
      }

      /* Main content keeps its live cards and original click handlers. */
      html body #${SHELL_ID} #${HOLDER_ID} #${LAUNCH_ID} {
        display:block!important;
        width:100%!important;
        max-width:1160px!important;
        margin:0 auto!important;
        padding:0 0 42px!important;
        color:#FFFFFF!important;
      }

      /* Approved client runner and brand — once, not duplicated. */
      html body #${LAUNCH_ID} #${BRAND_ID} {
        display:flex!important;
        flex-wrap:nowrap!important;
        align-items:center!important;
        gap:12px!important;
        margin:0 0 20px!important;
        width:100%!important;
      }
      html body #${LAUNCH_ID} .mana-hub-runner {
        display:block!important;
        flex:0 0 76px!important;
        width:76px!important;
        height:56px!important;
        background:transparent url("ui/mana-runner-logo.png?v=104050") center/contain no-repeat!important;
      }
      html body #${LAUNCH_ID} .mana-hub-brand-copy {min-width:0!important}
      html body #${LAUNCH_ID} .mana-hub-brand-name {
        margin:0!important;
        font:900 clamp(30px,5vw,46px)/1.05 system-ui,sans-serif!important;
        letter-spacing:.025em!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        white-space:nowrap!important;
      }
      html body #${LAUNCH_ID} .mana-hub-brand-name span {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      html body #${LAUNCH_ID} .mana-hub-brand-tag {
        margin:4px 0 0!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        font:750 10px/1.25 system-ui,sans-serif!important;
        letter-spacing:.12em!important;
      }

      html body #${LAUNCH_ID} .mana-v964-intro {
        margin:0 0 21px!important;
        max-width:100%!important;
      }
      html body #${LAUNCH_ID} .mana-v964-kicker {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        font-size:13px!important;
      }
      html body #${LAUNCH_ID} .mana-v964-intro h2 {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        font-size:clamp(27px,3.8vw,36px)!important;
        line-height:1.12!important;
      }
      html body #${LAUNCH_ID} .mana-v964-intro p {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        font-size:15px!important;
        line-height:1.5!important;
      }

      /* Four equal original launch cards; four columns on wide desktops,
         two on laptops and regular phones, one on narrow phones. */
      html body #${SHELL_ID} #${HOLDER_ID} #${LAUNCH_ID} .mana-v964-grid {
        display:grid!important;
        grid-template-columns:repeat(4,minmax(0,1fr))!important;
        gap:14px!important;
        width:100%!important;
        max-width:100%!important;
        align-items:stretch!important;
      }
      html body #${LAUNCH_ID} .mana-v964-grid
        button.mana-v964-launch {
        display:flex!important;
        flex-direction:column!important;
        gap:12px!important;
        min-width:0!important;
        width:100%!important;
        min-height:190px!important;
        height:100%!important;
        padding:18px!important;
        border:1px solid #A5ADB7!important;
        border-radius:20px!important;
        background:#15171B!important;
        background-image:none!important;
        box-shadow:none!important;
        text-align:left!important;
        transform:none!important;
        color:#FFFFFF!important;
      }
      html body #${LAUNCH_ID} .mana-v964-launch::before {
        display:none!important;
        content:none!important;
      }
      html body #${LAUNCH_ID} .mana-v964-launch:hover {
        border-color:#FF7927!important;
        background:#1D2025!important;
      }
      html body #${LAUNCH_ID} .mana-v964-launch:focus-visible,
      html body #${LAUNCH_ID} #${CHAT_ID}:focus-visible {
        outline:3px solid #FF7927!important;
        outline-offset:3px!important;
      }
      html body #${LAUNCH_ID} .mana-v964-copy {min-width:0!important}
      html body #${LAUNCH_ID} .mana-v964-icon {
        display:grid!important;
        place-items:center!important;
        width:50px!important;
        height:50px!important;
        flex:0 0 50px!important;
        border:1px solid #FF7927!important;
        border-radius:14px!important;
        background:#171A1F!important;
        background-image:none!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        box-shadow:none!important;
        font-size:19px!important;
      }
      html body #${LAUNCH_ID} .mana-v964-label,
      html body #${LAUNCH_ID} .mana-v964-arrow {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }
      html body #${LAUNCH_ID} .mana-v964-label {
        font-size:11px!important;
        letter-spacing:.09em!important;
      }
      html body #${LAUNCH_ID} .mana-v964-title {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        font-size:clamp(19px,2vw,23px)!important;
        line-height:1.2!important;
      }
      html body #${LAUNCH_ID} .mana-v964-text {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        font-size:13px!important;
        line-height:1.45!important;
      }
      html body #${LAUNCH_ID} .mana-v964-arrow {
        margin-top:12px!important;
        font-size:11px!important;
      }

      /* One separate, full-width Coach Chat card. Teal distinguishes
         communication from training without using old yellow. */
      html body #${LAUNCH_ID} #${CHAT_ID} {
        display:flex!important;
        flex-direction:row!important;
        align-items:center!important;
        gap:16px!important;
        width:100%!important;
        min-height:110px!important;
        margin:14px 0 0!important;
        padding:17px 20px!important;
        border:1px solid #20CDD4!important;
        border-radius:20px!important;
        background:#102024!important;
        background-image:none!important;
        box-shadow:none!important;
        color:#FFFFFF!important;
        text-align:left!important;
        cursor:pointer!important;
      }
      html body #${LAUNCH_ID} .mana-hub-chat-icon {
        display:grid!important;
        place-items:center!important;
        width:54px!important;
        height:54px!important;
        flex:0 0 54px!important;
        border:1px solid #20CDD4!important;
        border-radius:15px!important;
        color:#20CDD4!important;
        font:900 26px/1 system-ui,sans-serif!important;
      }
      html body #${LAUNCH_ID} .mana-hub-chat-copy {
        display:flex!important;
        flex-direction:column!important;
        gap:4px!important;
        min-width:0!important;
      }
      html body #${LAUNCH_ID} .mana-hub-chat-label {
        color:#20CDD4!important;
        font:900 11px/1.2 system-ui,sans-serif!important;
        letter-spacing:.13em!important;
      }
      html body #${LAUNCH_ID} .mana-hub-chat-title {
        color:#FFFFFF!important;
        font:900 22px/1.15 system-ui,sans-serif!important;
      }
      html body #${LAUNCH_ID} .mana-hub-chat-description {
        color:#C1C6CE!important;
        font:500 13px/1.45 system-ui,sans-serif!important;
      }
      html body #${LAUNCH_ID} .mana-hub-chat-arrow {
        margin-left:auto!important;
        color:#20CDD4!important;
        font:900 25px/1 system-ui,sans-serif!important;
      }

      /* Existing Learning tab remains reachable — this file does
         not hide or change any bottom tab. */
      @media(max-width:1099px) {
        html body #${SHELL_ID} #${HOLDER_ID} #${LAUNCH_ID} .mana-v964-grid {
          grid-template-columns:repeat(2,minmax(0,1fr))!important;
        }
      }
      @media(max-width:700px) {
        html body #${LAUNCH_ID} #${BRAND_ID} {gap:7px!important}
        html body #${LAUNCH_ID} .mana-hub-runner {
          flex-basis:48px!important;
          width:48px!important;
          height:39px!important;
        }
        html body #${LAUNCH_ID} .mana-hub-brand-name {
          font-size:clamp(22px,6.6vw,31px)!important;
          letter-spacing:-.015em!important;
        }
        html body #${LAUNCH_ID} .mana-hub-brand-tag {font-size:9px!important}
        html body #${LAUNCH_ID} .mana-v964-grid
          button.mana-v964-launch {
          min-height:165px!important;
          padding:14px!important;
          gap:9px!important;
        }
        html body #${LAUNCH_ID} .mana-v964-icon {
          width:43px!important;
          height:43px!important;
          flex-basis:43px!important;
        }
        html body #${LAUNCH_ID} .mana-v964-title {
          font-size:19px!important;
        }
        html body #${LAUNCH_ID} .mana-v964-text {
          font-size:12px!important;
        }
      }
      @media(max-width:429px) {
        html body #${SHELL_ID} #${HOLDER_ID} #${LAUNCH_ID} .mana-v964-grid {
          grid-template-columns:minmax(0,1fr)!important;
        }
        html body #${LAUNCH_ID} .mana-v964-grid
          button.mana-v964-launch {min-height:132px!important}
        html body #${LAUNCH_ID} #${CHAT_ID} {padding:14px!important}
      }
    `;
    document.head.appendChild(style);
  }

  function liveStrengthOverview() {
    const shell = $(SHELL_ID);
    return Boolean(
      shell?.classList.contains("open") &&
      $("manaV83Title")?.textContent?.trim().toUpperCase() === "MANA STRENGTH" &&
      document.querySelector("#manaV83Tabs .mana-v83-tab.active")
        ?.dataset?.v83Tab === "overview"
    );
  }

  function removePreviousBrand() {
    // Old 104040 branding may still be in a reused DOM node.
    $("manaStrengthOverviewBrand104040")?.remove();
  }

  function improveLabels(launch) {
    // Do not replace buttons or remove dynamic goal/workout text.
    const config = {
      profile: ["PROFILE", "Profile / Goals", "OPEN PROFILE →"],
      program: ["TRAINING", "Your Workouts", "OPEN WORKOUTS →"],
      fuel: ["FUEL", "Fuel", "OPEN FUEL →"],
      progress: ["TRACKING", "Progress", "VIEW PROGRESS →"]
    };
    for (const button of launch.querySelectorAll(".mana-v964-launch[data-v964-launch]")) {
      const values = config[button.dataset.v964Launch];
      if (!values) continue;
      const label = button.querySelector(".mana-v964-label");
      const title = button.querySelector(".mana-v964-title");
      const arrow = button.querySelector(".mana-v964-arrow");
      if (label) label.textContent = values[0];
      if (title && button.dataset.v964Launch !== "profile") title.textContent = values[1];
      if (title && button.dataset.v964Launch === "profile") title.textContent = values[1];
      if (arrow) arrow.textContent = values[2];
    }
  }

  function ensureHub() {
    if (!liveStrengthOverview()) return;
    const launch = $(LAUNCH_ID);
    const intro = launch?.querySelector(".mana-v964-intro");
    const grid = launch?.querySelector(".mana-v964-grid");
    if (!launch || !intro || !grid) return;

    removePreviousBrand();

    if (!launch.querySelector("#" + BRAND_ID)) {
      const brand = document.createElement("div");
      brand.id = BRAND_ID;
      brand.setAttribute("aria-label", "Mana Movement — Move With Purpose");
      brand.innerHTML = `
        <div class="mana-hub-runner" aria-hidden="true"></div>
        <div class="mana-hub-brand-copy">
          <div class="mana-hub-brand-name">MANA <span>MOVEMENT</span></div>
          <div class="mana-hub-brand-tag">TRAINING · MOVE WITH PURPOSE</div>
        </div>
      `;
      launch.insertBefore(brand, intro);
    }

    improveLabels(launch);

    if (!launch.querySelector("#" + CHAT_ID)) {
      const chat = document.createElement("button");
      chat.type = "button";
      chat.id = CHAT_ID;
      chat.setAttribute("aria-label", "Open Coach Chat");
      chat.innerHTML = `
        <span class="mana-hub-chat-icon" aria-hidden="true">☏</span>
        <span class="mana-hub-chat-copy">
          <span class="mana-hub-chat-label">COACHING</span>
          <span class="mana-hub-chat-title">Chat</span>
          <span class="mana-hub-chat-description">
            Message your coach, ask questions and get ongoing support.
          </span>
        </span>
        <span class="mana-hub-chat-arrow" aria-hidden="true">›</span>
      `;
      chat.addEventListener("click", event => {
        // Avoid letting generic card navigation treat Chat as another tab.
        event.stopPropagation();
        if (typeof window.openManaStrengthClientChat === "function") {
          window.openManaStrengthClientChat();
        } else {
          console.warn("Coach Chat is not currently available.");
        }
      });
      grid.insertAdjacentElement("afterend", chat);
    }
  }

  function init() {
    addStyles();
    ensureHub();
    // Existing launchpad is dynamically rebuilt after navigating tabs.
    // Listen only for direct content changes, not all page mutations.
    const holder = $(HOLDER_ID);
    if (holder) {
      const observer = new MutationObserver(ensureHub);
      observer.observe(holder, {childList:true});
    }
    window.addEventListener("mana:program-tab-change", ensureHub);
    window.MANA_STRENGTH_HUB_BUILD = "104050";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {once:true});
  } else {
    init();
  }
})();
