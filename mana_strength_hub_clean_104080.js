
/* ==============================================================
   MANA MOVEMENT — CLEAN STRENGTH HUB 104080
   COMPLETE FILE. Replaces mana_strength_hub_clean_104070.js.

   Overview only: removes old gold header branding, keeps Home
   navigation, displays four existing working launch cards
   (Profile, Workouts, Fuel, Progress) and one teal Coach Chat card.
   Chat uses the existing openManaStrengthClientChat function.
   Compact top Home button preserves original navigation handler.
   Removes the old Profile button and duplicate Coach Chat on Overview.
   Does not modify workouts, training data, plans, Fuel, Progress,
   Learning, billing, tabs or other program screens.
   Fixes: two-column phone cards, duplicate lower Chat, tab colours.
   ============================================================== */
(() => {
  "use strict";

  if (window.MANA_STRENGTH_HUB_104080) return;
  window.MANA_STRENGTH_HUB_104080 = true;

  const STYLE_ID = "manaStrengthHubStyle104080";
  const BRAND_ID = "manaStrengthHubBrand104080";
  const CHAT_ID = "manaStrengthHubChat104080";
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
      html body #${SHELL_ID}:has(#${LAUNCH_ID}) {
        padding-top:calc(env(safe-area-inset-top) + 3px)!important;
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
        min-height:0!important;
        height:0!important;
        margin:0!important;
        padding:0!important;
        overflow:visible!important;
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
        margin:0 0 9px!important;
        width:100%!important;
      }
      html body #${LAUNCH_ID} .mana-hub-runner {
        display:block!important;
        flex:0 0 76px!important;
        width:76px!important;
        height:56px!important;
        background:transparent url("ui/mana-runner-logo.png?v=104080") center/contain no-repeat!important;
      }
      html body #${LAUNCH_ID} .mana-hub-brand-copy {min-width:0!important}
      html body #${LAUNCH_ID} .mana-hub-brand-name {
        margin:0!important;
        font:900 clamp(36px,5.2vw,53px)/1.05 system-ui,sans-serif!important;
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

      /* Home moves below the runner/brand, aligned to the right.
         The actual original #manaV83Back button is moved intact. */
      html body #${LAUNCH_ID} .mana-hub-home-row {
        display:flex!important;
        justify-content:flex-end!important;
        align-items:center!important;
        min-height:34px!important;
        margin:-3px 0 8px!important;
      }
      html body #${LAUNCH_ID} .mana-hub-home-row #manaV83Back {
        display:inline-flex!important;
        justify-content:center!important;
        align-items:center!important;
        min-height:34px!important;
        padding:5px 13px!important;
        border:1px solid #697686!important;
        border-radius:11px!important;
        background:#15171B!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        box-shadow:none!important;
        font-size:12px!important;
        font-weight:850!important;
        white-space:nowrap!important;
      }
      /* The other obsolete PROFILE shortcut is hidden only here.
         Profile / Goals inside the main grid remains fully functional. */
      html body #${SHELL_ID}:has(#${LAUNCH_ID})
        button[data-mana-obsolete-profile="104080"] {
        display:none!important;
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

      /* The older green Coach Chat section is a duplicate of our teal
         card. Hide it ONLY while this Strength Overview is shown.
         Keep its chat logic and modal connected. */
      html body #${SHELL_ID}:has(#${LAUNCH_ID})
        #${HOLDER_ID} .mana-v866-coach,
      html body #${SHELL_ID}:has(#${LAUNCH_ID})
        #${HOLDER_ID} #manaV95ClientChatCard {
        display:none!important;
      }

      /* The actual duplicate green Coach Chat belongs to the older
         Strength Experience module, not v8.6. Keep it and its event
         logic in the DOM, but show only the teal hub Chat button. */
      html body #${SHELL_ID}:has(#${LAUNCH_ID})
        #manaV969CoachChat,
      html body #${SHELL_ID}:has(#${LAUNCH_ID})
        #${HOLDER_ID} #manaV969CoachChat {
        display:none!important;
        visibility:hidden!important;
      }

      /* Stronger selector for the old green duplicate generated
         dynamically by v9_69_strength_experience.js. */
      html body #manaV83ProgramShell.open
        #manaV83Content > #manaV969CoachChat,
      html body #manaV83ProgramShell.open
        #manaV83Content > .mana-v969-chat,
      html body #manaV83ProgramShell.open
        #manaV83Content > #manaV95ClientChatCard {
        display:none!important;
      }

      /* Same premium colours as the new Home navigation, including
         the icon area. Original five tabs and click handlers stay. */
      html body #${SHELL_ID}:has(#${LAUNCH_ID}) #manaV83Tabs {
        background:rgba(8,9,11,.97)!important;
        border-top:1px solid #464D55!important;
        box-shadow:none!important;
      }
      html body #${SHELL_ID}:has(#${LAUNCH_ID})
        #manaV83Tabs button.mana-v83-tab {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        background-color:transparent!important;
        border-color:transparent!important;
        box-shadow:none!important;
        text-shadow:none!important;
      }
      html body #${SHELL_ID}:has(#${LAUNCH_ID})
        #manaV83Tabs button.mana-v83-tab.active {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        background-color:#20160F!important;
        border:1px solid #FF7927!important;
      }
      html body #${SHELL_ID}:has(#${LAUNCH_ID})
        #manaV83Tabs button.mana-v83-tab::before {
        background-color:#A5ADB7!important;
        border-color:#A5ADB7!important;
        box-shadow:none!important;
      }
      html body #${SHELL_ID}:has(#${LAUNCH_ID})
        #manaV83Tabs button.mana-v83-tab.active::before {
        background-color:#FF7927!important;
        border-color:#FF7927!important;
      }
      html body #${SHELL_ID}:has(#${LAUNCH_ID})
        #manaV83Tabs button.mana-v83-tab:not(.active) img {
        filter:grayscale(1) brightness(1.6)!important;
      }
      html body #${SHELL_ID}:has(#${LAUNCH_ID})
        #manaV83Tabs button.mana-v83-tab:not(.active) svg {
        color:#C1C6CE!important;
        stroke:#C1C6CE!important;
      }
      html body #${SHELL_ID}:has(#${LAUNCH_ID})
        #manaV83Tabs button.mana-v83-tab.active svg {
        color:#FF7927!important;
        stroke:#FF7927!important;
      }
      html body #${SHELL_ID}:has(#${LAUNCH_ID})
        #manaV83Tabs button.mana-v83-tab:focus-visible {
        outline:2px solid #FF7927!important;
        outline-offset:2px!important;
      }

      /* Normalize icon images and decorative SVGs, even when older
         icon modules apply brand tints and coloured drop shadows. */
      html body #${SHELL_ID}:has(#${LAUNCH_ID})
        #manaV83Tabs button.mana-v83-tab:not(.active) img,
      html body #${SHELL_ID}:has(#${LAUNCH_ID})
        #manaV83Tabs button.mana-v83-tab:not(.active) [style*="background-image"] {
        filter:grayscale(1) brightness(1.8)!important;
        box-shadow:none!important;
      }
      html body #${SHELL_ID}:has(#${LAUNCH_ID})
        #manaV83Tabs button.mana-v83-tab.active img {
        filter:grayscale(1) brightness(0) saturate(100%)
               invert(56%) sepia(84%) saturate(1242%)
               hue-rotate(342deg) brightness(105%) contrast(101%)!important;
      }
      html body #${SHELL_ID}:has(#${LAUNCH_ID})
        #manaV83Tabs .mana-v83-tab > span,
      html body #${SHELL_ID}:has(#${LAUNCH_ID})
        #manaV83Tabs .mana-v83-tab > div {
        color:inherit!important;
        -webkit-text-fill-color:inherit!important;
        text-shadow:none!important;
      }
      html body #${SHELL_ID}:has(#${LAUNCH_ID})
        #manaV83Tabs .mana-v83-tab svg,
      html body #${SHELL_ID}:has(#${LAUNCH_ID})
        #manaV83Tabs .mana-v83-tab svg * {
        stroke:currentColor!important;
        fill:none!important;
        filter:none!important;
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
          font-size:clamp(26px,7vw,35px)!important;
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
      /* Standard phones: TWO columns. Each card keeps its full
         button and opens the existing destination. */
      @media(max-width:429px) {
        html body #${SHELL_ID} #${HOLDER_ID} #${LAUNCH_ID} .mana-v964-grid {
          grid-template-columns:repeat(2,minmax(0,1fr))!important;
          gap:9px!important;
        }
        html body #${LAUNCH_ID} .mana-v964-grid
          button.mana-v964-launch {
          min-height:186px!important;
          padding:11px!important;
          gap:7px!important;
        }
        html body #${LAUNCH_ID} .mana-v964-title {
          font-size:16px!important;
          line-height:1.16!important;
          overflow-wrap:anywhere!important;
        }
        html body #${LAUNCH_ID} .mana-v964-text {
          font-size:11px!important;
          line-height:1.35!important;
        }
        html body #${LAUNCH_ID} .mana-v964-label,
        html body #${LAUNCH_ID} .mana-v964-arrow {
          font-size:10px!important;
        }
        html body #${LAUNCH_ID} .mana-v964-icon {
          width:37px!important;
          height:37px!important;
          flex-basis:37px!important;
        }
        html body #${LAUNCH_ID} #${CHAT_ID} {
          padding:14px!important;
        }
      }
      /* Very narrow devices get one readable column. */
      @media(max-width:339px) {
        html body #${SHELL_ID} #${HOLDER_ID} #${LAUNCH_ID} .mana-v964-grid {
          grid-template-columns:minmax(0,1fr)!important;
        }
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

  let originalHomeButton = null;

  function manageHeader(launch) {
    const shell = $(SHELL_ID);
    const header = shell?.querySelector(".mana-v83-head");
    // Keep a reference while v8_3 replaces the tab content.
    const home = $("manaV83Back") || originalHomeButton;
    if (home && !originalHomeButton) originalHomeButton = home;
    if (!header || !home) return;

    if (!launch) {
      // Return the ORIGINAL button when the user opens another tab.
      // This preserves Back-to-Overview and Back-to-Home navigation.
      if (home.parentElement !== header) header.appendChild(home);
      shell.querySelectorAll('[data-mana-obsolete-profile="104080"]')
        .forEach(button => {
          button.style.removeProperty("display");
          button.removeAttribute("data-mana-obsolete-profile");
        });
      return;
    }

    // Remove the redundant yellow PROFILE shortcut at the top right,
    // not the Profile / Goals launch card in the main grid.
    shell.querySelectorAll("button").forEach(button => {
      if (button === home || launch.contains(button) ||
          $("manaV83Tabs")?.contains(button)) return;
      if (button.textContent.trim().toUpperCase() === "PROFILE") {
        button.setAttribute("data-mana-obsolete-profile", "104080");
        button.style.setProperty("display", "none", "important");
      }
    });

    let row = launch.querySelector(".mana-hub-home-row");
    if (!row) {
      row = document.createElement("div");
      row.className = "mana-hub-home-row";
      const brand = launch.querySelector("#" + BRAND_ID);
      if (brand) brand.insertAdjacentElement("afterend", row);
    }
    if (row && home.parentElement !== row) row.appendChild(home);
    if (row && home.textContent.trim() !== "⌂ Home") home.textContent = "⌂ Home";
  }

  function concealOldChat() {
    if (!liveStrengthOverview()) return;
    // v9_69 rebuilds #manaV969CoachChat after tab switches. The
    // inline override is re-applied whenever the host gains a child.
    for (const id of ["manaV969CoachChat", "manaV95ClientChatCard"]) {
      const card = $(id);
      if (card && $(HOLDER_ID)?.contains(card)) {
        if (card.style.getPropertyValue("display") !== "none") {
          card.style.setProperty("display", "none", "important");
        }
      }
    }
    $(HOLDER_ID)?.querySelectorAll(".mana-v866-coach")
      .forEach(card => {
        if (card.style.getPropertyValue("display") !== "none") {
          card.style.setProperty("display", "none", "important");
        }
      });
  }

  function ensureHub() {
    if (!liveStrengthOverview()) {
      manageHeader(null);
      return;
    }
    concealOldChat();
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

    manageHeader(launch);
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
    window.addEventListener("mana:program-tab-change", () => {
      queueMicrotask(ensureHub);
    });
    document.addEventListener("click", event => {
      if (event.target.closest("#manaV83Tabs .mana-v83-tab")) {
        requestAnimationFrame(ensureHub);
      }
    }, true);
    window.MANA_STRENGTH_HUB_BUILD = "104080";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {once:true});
  } else {
    init();
  }
})();
