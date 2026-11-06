
/* ==========================================================
   MANA MOVEMENT — STRENGTH LEARNING DESIGN 104390
   COMPLETE STANDALONE JAVASCRIPT FILE

   Premium black / orange / white / silver styling.

   Learning screen only:
   - MANA MOVEMENT runner header
   - Overview button
   - Category headings
   - Expandable lesson cards
   - Learning tip and whakatauki
   - Matching bottom navigation

   PRESERVES:
   - Original learning content
   - All lesson open/close buttons
   - Maori learning material
   - Existing Learning stability code
   - All other client screens
   - Saved data and program functionality
   ========================================================== */
(() => {
  "use strict";

  if (window.MANA_STRENGTH_LEARNING_DESIGN_104390) {
    return;
  }

  window.MANA_STRENGTH_LEARNING_DESIGN_104390 = true;

  const SHELL = "manaV83ProgramShell";
  const CONTENT = "manaV83Content";
  const ROOT = "mana-v9120-root";
  const HEADER = "manaLearningHeader104390";
  const BACK = "manaLearningOverview104390";
  const STYLE = "manaLearningStyle104390";

  let scheduled = false;

  function learningOpen() {
    const shell = document.getElementById(SHELL);
    const content = document.getElementById(CONTENT);

    const title = document.getElementById(
      "manaV83Title"
    );

    return Boolean(
      shell?.classList.contains("open") &&
      title?.textContent.trim().toUpperCase() ===
        "MANA STRENGTH" &&
      shell.querySelector(
        '#manaV83Tabs .mana-v83-tab.active' +
        '[data-v83-tab="learn"]'
      ) &&
      content?.querySelector("." + ROOT)
    );
  }

  function installStyles() {
    if (document.getElementById(STYLE)) return;

    const style = document.createElement("style");

    style.id = STYLE;

    style.textContent = `
      /* ==================================================
         LEARNING SHELL ONLY
         ================================================== */

      html body #${SHELL}.open:has(.${ROOT}) {
        background:#08090B!important;
        color:#FFFFFF!important;
      }

      html body #${SHELL}:has(.${ROOT})
        .mana-v83-head {
        display:none!important;
      }

      html body #${SHELL}:has(.${ROOT})
        .mana-v83-shell {
        width:min(960px,100%)!important;
        max-width:960px!important;
      }

      html body #${SHELL}:has(.${ROOT})
        #${CONTENT} {
        display:flex!important;
        flex-direction:column!important;
        align-items:stretch!important;
      }

      html body #${SHELL}:has(.${ROOT})
        #${CONTENT} > * {
        order:0;
        min-width:0;
      }

      html body #${SHELL}:has(.${ROOT})
        #${CONTENT} > #${HEADER} {
        order:-10!important;
      }

      /* ==================================================
         MANA MOVEMENT BRAND HEADER
         ================================================== */

      html body #${SHELL} #${HEADER} {
        width:100%;
        margin:0 0 14px;
        color:#FFFFFF;
      }

      html body #${SHELL} #${HEADER}
        .ml-brand {
        display:flex;
        align-items:center;
        gap:12px;
        min-width:0;
      }

      html body #${SHELL} #${HEADER}
        .ml-runner {
        width:76px;
        height:56px;
        flex:0 0 76px;
        background:
          url("ui/mana-runner-logo.png")
          center/contain no-repeat;
      }

      html body #${SHELL} #${HEADER}
        .ml-brand-name {
        font:900 clamp(32px,5vw,53px)/1.05
          system-ui,sans-serif!important;
        letter-spacing:.015em;
        white-space:nowrap;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }

      html body #${SHELL} #${HEADER}
        .ml-brand-name span {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      html body #${SHELL} #${HEADER}
        .ml-brand-tag {
        margin-top:4px;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        font:750 10px/1.25
          system-ui,sans-serif!important;
        letter-spacing:.12em;
      }

      html body #${SHELL} #${HEADER}
        .ml-overview-row {
        display:flex;
        justify-content:flex-end;
        margin:5px 0 10px;
      }

      html body #${SHELL} #${BACK} {
        min-height:34px;
        padding:7px 14px;
        background:#15171B!important;
        border:1px solid #697686!important;
        border-radius:11px;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        font:850 12px/1.2
          system-ui,sans-serif!important;
        cursor:pointer;
        box-shadow:none!important;
      }

      html body #${SHELL} #${BACK}:focus-visible {
        outline:2px solid #FF7927!important;
        outline-offset:3px;
      }

      /* ==================================================
         LEARNING PAGE INTRODUCTION
         ================================================== */

      html body #${SHELL} .${ROOT} {
        width:100%!important;
        max-width:100%!important;
        margin:0 auto!important;
        padding:4px 0 35px!important;
        color:#FFFFFF!important;
      }

      html body #${SHELL} .${ROOT}
        .mana-v9120-head {
        margin-bottom:20px!important;
      }

      html body #${SHELL} .${ROOT}
        .mana-v9120-kicker {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        font-size:10px!important;
        font-weight:900!important;
        letter-spacing:.13em!important;
      }

      html body #${SHELL} .${ROOT}
        .mana-v9120-head h2 {
        margin:6px 0!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        font:900 clamp(25px,3vw,30px)/1.15
          system-ui,sans-serif!important;
      }

      html body #${SHELL} .${ROOT}
        .mana-v9120-head p {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        font-size:12px!important;
        line-height:1.55!important;
      }

      /* ==================================================
         LESSON CATEGORY LABELS
         ================================================== */

      html body #${SHELL} .${ROOT}
        .mana-v9120-category {
        margin:24px 0 10px!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        font-size:11px!important;
        font-weight:900!important;
        letter-spacing:.12em!important;
      }

      /* ==================================================
         LESSON CARDS
         ================================================== */

      html body #${SHELL} .${ROOT}
        .mana-v9120-card {
        margin-bottom:10px!important;
        background:#15171B!important;
        background-image:none!important;
        border:1px solid #A5ADB7!important;
        border-radius:16px!important;
        overflow:hidden;
        box-shadow:none!important;
      }

      html body #${SHELL} .${ROOT}
        .mana-v9120-card.open {
        border-color:#FF7927!important;
        background:#15171B!important;
        box-shadow:none!important;
      }

      html body #${SHELL} .${ROOT}
        .mana-v9120-open {
        width:100%!important;
        padding:16px!important;
        background:transparent!important;
        border:0!important;
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        cursor:pointer;
        text-align:left!important;
        box-shadow:none!important;
      }

      html body #${SHELL} .${ROOT}
        .mana-v9120-open:focus-visible {
        outline:2px solid #FF7927!important;
        outline-offset:-3px;
      }

      html body #${SHELL} .${ROOT}
        .mana-v9120-title {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        font-size:15px!important;
        font-weight:900!important;
        line-height:1.35!important;
      }

      html body #${SHELL} .${ROOT}
        .mana-v9120-intro {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        font-size:11px!important;
        line-height:1.5!important;
      }

      /* Orange expand button.
         Existing open/close handlers remain unchanged. */

      html body #${SHELL} .${ROOT}
        .mana-v9120-arrow {
        width:34px!important;
        height:34px!important;
        display:grid!important;
        place-items:center!important;
        background:#0D0F13!important;
        border:1px solid #FF7927!important;
        border-radius:10px!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        font-size:19px!important;
        box-shadow:none!important;
      }

      html body #${SHELL} .${ROOT}
        .mana-v9120-card.open
        .mana-v9120-arrow {
        background:#20160F!important;
        border-color:#FF7927!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      /* ==================================================
         EXPANDED ARTICLE BODY
         ================================================== */

      html body #${SHELL} .${ROOT}
        .mana-v9120-body {
        padding:2px 16px 18px!important;
        border-top:1px solid #343B43!important;
        background:#15171B!important;
        color:#DDE0E4!important;
        -webkit-text-fill-color:#DDE0E4!important;
        font-size:12px!important;
        line-height:1.75!important;
        white-space:pre-line!important;
      }

      /* The original script controls whether this opens. */

      html body #${SHELL} .${ROOT}
        .mana-v9120-card:not(.open)
        .mana-v9120-body {
        display:none!important;
      }

      html body #${SHELL} .${ROOT}
        .mana-v9120-card.open
        .mana-v9120-body {
        display:block!important;
      }

      /* ==================================================
         LEARNING TIP
         ================================================== */

      html body #${SHELL} .${ROOT}
        .mana-v9120-tip {
        margin-top:22px!important;
        padding:18px!important;
        background:#15171B!important;
        background-image:none!important;
        border:1px solid #A5ADB7!important;
        border-left:3px solid #FF7927!important;
        border-radius:16px!important;
        box-shadow:none!important;
      }

      html body #${SHELL} .${ROOT}
        .mana-v9120-tip-label {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        font-size:10px!important;
        font-weight:900!important;
      }

      html body #${SHELL} .${ROOT}
        .mana-v9120-tip strong {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
        font-size:16px!important;
        font-weight:900!important;
      }

      html body #${SHELL} .${ROOT}
        .mana-v9120-tip p {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        font-size:12px!important;
        line-height:1.55!important;
      }

      /* ==================================================
         WHAKATAUKI FOOTER ON STRENGTH LEARNING ONLY
         ================================================== */

      html body #${SHELL}:has(.${ROOT})
        #manaV985Whakatauki {
        margin:20px 0 28px!important;
        padding:17px!important;
        background:#15171B!important;
        background-image:none!important;
        border:1px solid #A5ADB7!important;
        border-left:3px solid #FF7927!important;
        border-radius:15px!important;
        box-shadow:none!important;
      }

      html body #${SHELL}:has(.${ROOT})
        #manaV985Whakatauki
        .mana-v985-footer-label {
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
      }

      html body #${SHELL}:has(.${ROOT})
        #manaV985Whakatauki strong {
        color:#FFFFFF!important;
        -webkit-text-fill-color:#FFFFFF!important;
      }

      html body #${SHELL}:has(.${ROOT})
        #manaV985Whakatauki span {
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
      }

      /* ==================================================
         BOTTOM NAVIGATION
         ================================================== */

      html body #${SHELL}.open:has(.${ROOT})
        #manaV83Tabs {
        background:rgba(8,9,11,.97)!important;
        border-top:1px solid #464D55!important;
        box-shadow:none!important;
      }

      html body #${SHELL}.open:has(.${ROOT})
        #manaV83Tabs .mana-v83-tab {
        background:transparent!important;
        border:1px solid transparent!important;
        color:#C1C6CE!important;
        -webkit-text-fill-color:#C1C6CE!important;
        box-shadow:none!important;
        text-shadow:none!important;
        opacity:1!important;
      }

      html body #${SHELL}.open:has(.${ROOT})
        #manaV83Tabs .mana-v83-tab.active {
        background:#20160F!important;
        border:1px solid #FF7927!important;
        border-radius:12px!important;
        color:#FF7927!important;
        -webkit-text-fill-color:#FF7927!important;
        box-shadow:none!important;
      }

      html body #${SHELL}.open:has(.${ROOT})
        #manaV83Tabs .mana-v83-tab::before {
        background:#A5ADB7!important;
        box-shadow:none!important;
      }

      html body #${SHELL}.open:has(.${ROOT})
        #manaV83Tabs .mana-v83-tab.active::before {
        background:#FF7927!important;
      }

      html body #${SHELL}.open:has(.${ROOT})
        #manaV83Tabs .mana-v83-tab img {
        filter:grayscale(1) brightness(1.7)!important;
        opacity:.95!important;
        box-shadow:none!important;
      }

      html body #${SHELL}.open:has(.${ROOT})
        #manaV83Tabs .mana-v83-tab svg,
      html body #${SHELL}.open:has(.${ROOT})
        #manaV83Tabs .mana-v83-tab svg * {
        color:inherit!important;
        stroke:currentColor!important;
        filter:none!important;
      }

      /* ==================================================
         PHONE — KEEP ORIGINAL LEARNING CARD BEHAVIOUR
         ================================================== */

      @media(max-width:650px) {
        html body #${SHELL} #${HEADER}
          .ml-brand {
          gap:7px!important;
        }

        html body #${SHELL} #${HEADER}
          .ml-runner {
          width:48px!important;
          height:40px!important;
          flex-basis:48px!important;
        }

        html body #${SHELL} #${HEADER}
          .ml-brand-name {
          font-size:clamp(23px,7vw,35px)!important;
        }

        html body #${SHELL} #${HEADER}
          .ml-brand-tag {
          font-size:9px!important;
          letter-spacing:.07em!important;
        }

        html body #${SHELL} .${ROOT}
          .mana-v9120-open {
          padding:14px!important;
        }

        html body #${SHELL} .${ROOT}
          .mana-v9120-title {
          font-size:14px!important;
        }

        html body #${SHELL} .${ROOT}
          .mana-v9120-body {
          padding:2px 14px 16px!important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function ensureHeader() {
    if (!learningOpen()) return;

    const holder = document.getElementById(CONTENT);

    if (!holder) return;

    let header = document.getElementById(HEADER);

    if (!header || header.parentElement !== holder) {
      header = document.createElement("div");

      header.id = HEADER;

      header.innerHTML = `
        <div class="ml-brand">
          <div
            class="ml-runner"
            aria-hidden="true"
          ></div>

          <div class="ml-brand-copy">
            <div class="ml-brand-name">
              MANA <span>MOVEMENT</span>
            </div>

            <div class="ml-brand-tag">
              TRAINING · MOVE WITH PURPOSE
            </div>
          </div>
        </div>

        <div class="ml-overview-row">
          <button
            type="button"
            id="${BACK}"
          >
            ⌂ Overview
          </button>
        </div>
      `;

      holder.prepend(header);
    }
  }

  function maintain() {
    if (!learningOpen()) return;

    ensureHeader();
  }

  function schedule() {
    if (scheduled) return;

    scheduled = true;

    requestAnimationFrame(() => {
      scheduled = false;
      maintain();
    });
  }

  function init() {
    installStyles();

    const holder = document.getElementById(CONTENT);

    if (holder) {
      const observer = new MutationObserver(schedule);

      observer.observe(holder, {
        childList:true,
        subtree:true
      });
    }

    document.addEventListener("click", event => {
      if (!(event.target instanceof Element)) return;

      if (event.target.closest("#" + BACK)) {
        document.querySelector(
          '#manaV83Tabs [data-v83-tab="overview"]'
        )?.click();

        return;
      }

      if (event.target.closest(
        '#manaV83Tabs [data-v83-tab="learn"]'
      )) {
        requestAnimationFrame(schedule);
      }
    });

    window.addEventListener(
      "mana:program-tab-change",
      schedule
    );

    maintain();

    window.MANA_STRENGTH_LEARNING_DESIGN_BUILD =
      "104390";
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
