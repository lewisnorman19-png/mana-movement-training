
/* ============================================================
   MANA MOVEMENT TRAINING
   MANA LYFE TARGETED VISUAL FINISH
   BUILD 104600

   COMPLETE JAVASCRIPT FILE

   FIXES:
   - Silver borders on four Overview cards
   - White illustration frames
   - Remove top-right Profile button
   - Dark teal Support Chat card ONLY
   - White bottom navigation
   - Reset tab remains green

   PRESERVES:
   - Lyfe Sessions and saved records
   - Daily Routine
   - Reset breathing
   - Support Chat
   - Progress and Learning
   - Mana Strength and Mana28

   IMPORTANT:
   Load after 104580.
   Do NOT load the faulty 104590 file.
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104600";

  const SHELL_ID = "manaV83ProgramShell";
  const TITLE_ID = "manaV83Title";
  const TABS_ID = "manaV83Tabs";
  const CONTENT_ID = "manaV83Content";

  const STYLE_ID = "manaLyfeTargeted104600Style";
  const ACTIVE = "mana-lyfe-targeted-104600";
  const CHAT = "mana-lyfe-chat-card-104600";
  const RESET = "mana-lyfe-reset-tab-104600";
  const PROFILE = "mana-lyfe-profile-104600";

  if (window.MANA_LYFE_TARGETED_BUILD === BUILD) return;

  window.MANA_LYFE_TARGETED_BUILD = BUILD;

  const $ = id => document.getElementById(id);

  function isLyfe() {
    const root = $(SHELL_ID);
    const title = $(TITLE_ID);

    if (!root || !title) return false;
    if (!root.classList.contains("open")) return false;

    const name = String(title.textContent || "")
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();

    return name === "MANA LYFE" ||
           name === "MANA LIFE";
  }

  /* ============================================================
     STYLES — STRICTLY SCOPED TO MANA LYFE
     ============================================================ */

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `

      /* ======================================
         REMOVE PROFILE
         ====================================== */

      #${SHELL_ID}.${ACTIVE}
      .${PROFILE} {
        display: none !important;
      }

      /* ======================================
         OVERVIEW CARD BACKGROUNDS AND BORDERS
         IMPORTANT: ONLY THESE FOUR CARDS
         ====================================== */

      html body
      #${SHELL_ID}.${ACTIVE}
      #${CONTENT_ID}
      .mana-v978-grid > .mana-v978-launch {
        background: #15171A !important;
        background-image: none !important;
        border: 1px solid #737B85 !important;
        border-radius: 17px !important;
        box-shadow: none !important;
        outline: none !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE}
      #${CONTENT_ID}
      .mana-v978-grid > .mana-v978-launch::before {
        background: #FF7927 !important;
        background-image: none !important;
        border-color: transparent !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE}
      #${CONTENT_ID}
      .mana-v978-launch .mana-v978-icon {
        border: 1px solid #FFFFFF !important;
        background: #0B0D10 !important;
        box-shadow: none !important;
      }

      /* Text inside Overview cards */

      html body
      #${SHELL_ID}.${ACTIVE}
      #${CONTENT_ID}
      .mana-v978-launch .mana-v978-title {
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE}
      #${CONTENT_ID}
      .mana-v978-launch .mana-v978-text {
        color: #C1C6CE !important;
        -webkit-text-fill-color: #C1C6CE !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE}
      #${CONTENT_ID}
      .mana-v978-launch .mana-v978-label,
      html body
      #${SHELL_ID}.${ACTIVE}
      #${CONTENT_ID}
      .mana-v978-launch .mana-v978-arrow {
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      /* ======================================
         SUPPORT CHAT ONLY
         The class is assigned to the actual
         chat container by JavaScript.
         ====================================== */

      html body
      #${SHELL_ID}.${ACTIVE}
      #${CONTENT_ID}
      .${CHAT} {
        background:
          linear-gradient(
            145deg,
            #0D2429,
            #10272C
          ) !important;
        background-color: #0D2429 !important;
        border: 1px solid #27C6D7 !important;
        border-radius: 20px !important;
        box-shadow: none !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE}
      #${CONTENT_ID}
      .${CHAT} h2,
      html body
      #${SHELL_ID}.${ACTIVE}
      #${CONTENT_ID}
      .${CHAT} h3 {
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE}
      #${CONTENT_ID}
      .${CHAT} p {
        color: #C1D4D8 !important;
        -webkit-text-fill-color: #C1D4D8 !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE}
      #${CONTENT_ID}
      .${CHAT} .mana-v978-label,
      html body
      #${SHELL_ID}.${ACTIVE}
      #${CONTENT_ID}
      .${CHAT} [class*="kicker"] {
        color: #27C6D7 !important;
        -webkit-text-fill-color: #27C6D7 !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE}
      #${CONTENT_ID}
      .${CHAT} button {
        background: #27C6D7 !important;
        background-image: none !important;
        color: #071317 !important;
        -webkit-text-fill-color: #071317 !important;
        border: 1px solid #27C6D7 !important;
        box-shadow: none !important;
      }

      /* ======================================
         BOTTOM TABS — WHITE
         ====================================== */

      html body
      #${SHELL_ID}.${ACTIVE}
      #${TABS_ID} {
        background: #08090B !important;
        border-top: 1px solid #49515A !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE}
      #${TABS_ID} .mana-v83-tab {
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;
        background: transparent !important;
        border: 1px solid transparent !important;
        box-shadow: none !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE}
      #${TABS_ID} .mana-v83-tab * {
        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE}
      #${TABS_ID} .mana-v83-tab::before {
        background: #737B85 !important;
        border-color: transparent !important;
      }

      /* Preserve detailed white artwork without
         turning its dark background solid white. */

      html body
      #${SHELL_ID}.${ACTIVE}
      #${TABS_ID} .mana-v83-tab img {
        filter: grayscale(1) brightness(1.8) !important;
        opacity: 1 !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE}
      #${TABS_ID} .mana-v83-tab.active {
        background: #20160F !important;
        border: 1px solid #FF7927 !important;
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE}
      #${TABS_ID} .mana-v83-tab.active * {
        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE}
      #${TABS_ID} .mana-v83-tab.active::before {
        background: #FF7927 !important;
      }

      /* ======================================
         RESET TAB — GREEN AT ALL TIMES
         ====================================== */

      html body
      #${SHELL_ID}.${ACTIVE}
      #${TABS_ID} .${RESET},
      html body
      #${SHELL_ID}.${ACTIVE}
      #${TABS_ID} .${RESET} * {
        color: #36D483 !important;
        -webkit-text-fill-color: #36D483 !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE}
      #${TABS_ID} .${RESET}::before {
        background: #36D483 !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE}
      #${TABS_ID} .${RESET} img {
        filter:
          brightness(0)
          saturate(100%)
          invert(72%)
          sepia(48%)
          saturate(666%)
          hue-rotate(93deg)
          brightness(96%)
          contrast(89%) !important;
      }

      html body
      #${SHELL_ID}.${ACTIVE}
      #${TABS_ID} .${RESET}.active {
        background: #143224 !important;
        border: 1px solid #36D483 !important;
      }

      /* ======================================
         MOBILE
         ====================================== */

      @media (max-width:600px) {
        html body
        #${SHELL_ID}.${ACTIVE}
        #${CONTENT_ID}
        .mana-v978-grid > .mana-v978-launch {
          border-radius: 15px !important;
        }
      }

    `;

    document.head.appendChild(style);
  }

  /* ============================================================
     PROFILE — FIND ONLY THE HEADER BUTTON
     ============================================================ */

  function updateProfile(active) {
    const head = $(SHELL_ID)?.querySelector(
      ".mana-v83-head"
    );

    if (!head) return;

    head.querySelectorAll("button, a").forEach(button => {
      const label = String(
        button.textContent || ""
      ).trim().toUpperCase();

      const aria = String(
        button.getAttribute("aria-label") || ""
      ).toUpperCase();

      const isProfile =
        /\bPROFILE\b/.test(label) ||
        /\bPROFILE\b/.test(aria);

      if (isProfile) {
        button.classList.toggle(PROFILE, active);
      }
    });
  }

  /* ============================================================
     RESET — IDENTIFY EXISTING RESET NAV BUTTON
     ============================================================ */

  function updateResetTab(active) {
    const tabs = $(TABS_ID);
    if (!tabs) return;

    tabs.querySelectorAll(".mana-v83-tab").forEach(tab => {
      const text = String(
        tab.textContent || ""
      ).replace(/\s+/g, " ").trim().toUpperCase();

      const key = tab.dataset.v83Tab || "";

      const isReset =
        text === "RESET" ||
        key === "reset" ||
        (key === "reclaim" && text === "RESET");

      tab.classList.toggle(RESET, active && isReset);
    });
  }

  /* ============================================================
     SUPPORT CHAT — EXACT CARD DETECTION

     Find the "Need to talk something through?"
     heading, then select the smallest container
     containing that heading and its Open Chat button.

     Never select the Overview grid or launchpad.
     ============================================================ */

  function updateChat(active) {
    const content = $(CONTENT_ID);
    if (!content) return;

    content.querySelectorAll("." + CHAT).forEach(el => {
      el.classList.remove(CHAT);
    });

    if (!active) return;

    const headings = content.querySelectorAll(
      "h2, h3, h4, strong"
    );

    const target = Array.from(headings).find(el =>
      /need to talk something through/i.test(
        el.textContent || ""
      )
    );

    if (!target) return;

    let candidate = target.parentElement;

    while (
      candidate &&
      candidate !== content &&
      !candidate.classList.contains("mana-v978-launchpad")
    ) {
      const hasChatButton = Array.from(
        candidate.querySelectorAll("button, a")
      ).some(button =>
        /open chat/i.test(
          button.textContent || ""
        )
      );

      const includesGrid = Boolean(
        candidate.querySelector(".mana-v978-grid")
      );

      const isOverviewCard =
        candidate.classList.contains("mana-v978-launch");

      if (
        hasChatButton &&
        !includesGrid &&
        !isOverviewCard
      ) {
        candidate.classList.add(CHAT);
        return;
      }

      candidate = candidate.parentElement;
    }
  }

  /* ============================================================
     APPLY ONLY TO MANA LYFE
     ============================================================ */

  function apply() {
    const root = $(SHELL_ID);
    if (!root) return;

    const active = isLyfe();

    root.classList.toggle(ACTIVE, active);

    updateProfile(active);
    updateResetTab(active);

    if (active) {
      updateChat(true);
    }
  }

  /* ============================================================
     CONTROLLED REFRESH
     ============================================================ */

  let queued = false;

  function schedule() {
    if (queued) return;

    queued = true;

    requestAnimationFrame(() => {
      queued = false;
      apply();
    });
  }

  /* ============================================================
     INITIALISE
     ============================================================ */

  function init() {
    installStyles();
    apply();

    const root = $(SHELL_ID);

    if (root && window.MutationObserver) {
      const observer = new MutationObserver(schedule);

      // Observe newly rendered screens and navigation.
      // Do not observe attributes: our own classes change.

      observer.observe(root, {
        childList: true,
        subtree: true
      });
    }

    document.addEventListener(
      "click",
      event => {
        if (!(event.target instanceof Element)) return;

        if (event.target.closest(
          "#manaV83Tabs, #manaV83ProgramShell"
        )) {
          schedule();
        }
      },
      true
    );

    window.addEventListener(
      "mana:program-tab-change",
      schedule
    );

    window.addEventListener("pageshow", schedule);

    console.log(
      "[ManaLyfe] Targeted finish ready — " + BUILD
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      {once: true}
    );
  } else {
    init();
  }

})();
