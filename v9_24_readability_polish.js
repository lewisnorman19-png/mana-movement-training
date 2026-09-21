/* =========================================
   MANA MOVEMENT TRAINING v9.24.0
   READABILITY POLISH

   - PROGRESS SMALL TEXT MADE EASIER TO READ
   - PERFORMANCE LABELS + HELPER COPY ENLARGED
   - COMPARISON + MILESTONE TEXT ENLARGED
   - LEARN INTRO/BODY TEXT ENLARGED
   - LEARN DROP ARROWS MADE CLEARER
   - NO TRAINING LOGIC CHANGES
   ========================================= */

(() => {
  "use strict";

  const STYLE_ID = "mana-v9240-readability-style";

  function injectStyles() {
    document
      .getElementById(STYLE_ID)
      ?.remove();

    const style =
      document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `
      [class*="mana-v9170-"][class$="-label"],
      [class*="mana-v9181-"][class$="-label"]{
        font-size:10px !important;
        line-height:1.3 !important;
      }

      .mana-v9170-section-head span,
      .mana-v9181-section-head span{
        font-size:10px !important;
        color:#8c8c8c !important;
      }

      .mana-v9170-eyebrow,
      .mana-v9170-kicker,
      .mana-v9181-eyebrow,
      .mana-v9181-kicker{
        font-size:11px !important;
      }

      .mana-v9170-snapshot-label,
      .mana-v9170-stat-label,
      .mana-v9170-mini-label,
      .mana-v9170-perf-label,
      .mana-v9181-snapshot-label,
      .mana-v9181-stat-label,
      .mana-v9181-mini-label,
      .mana-v9181-perf-label{
        font-size:10px !important;
        color:#8d8d8d !important;
      }

      .mana-v9170-snapshot-sub,
      .mana-v9170-stat-sub,
      .mana-v9170-perf-note,
      .mana-v9170-current-pb-meta,
      .mana-v9170-strength-note,
      .mana-v9170-pb-date,
      .mana-v9170-workout-meta,
      .mana-v9170-note,
      .mana-v9181-snapshot-sub,
      .mana-v9181-stat-sub,
      .mana-v9181-perf-note,
      .mana-v9181-current-pb-meta,
      .mana-v9181-strength-note,
      .mana-v9181-pb-date,
      .mana-v9181-workout-meta,
      .mana-v9181-note{
        font-size:10px !important;
        line-height:1.5 !important;
        color:#858585 !important;
      }

      .mana-v9170-summary-chip,
      .mana-v9181-summary-chip{
        min-height:30px !important;
        padding:0 10px !important;
        font-size:10px !important;
      }

      .mana-v9170-compare-heading,
      .mana-v9181-compare-heading{
        margin-bottom:8px !important;
        font-size:10px !important;
        color:#8c8c8c !important;
      }

      .mana-v9170-compare-row > div > span:first-child,
      .mana-v9181-compare-row > div > span:first-child{
        margin-bottom:5px !important;
        font-size:9px !important;
        color:#888 !important;
      }

      .mana-v9170-compare-pill,
      .mana-v9181-compare-pill{
        padding:4px 7px !important;
        font-size:10px !important;
      }

      .mana-v9170-milestone-target-label,
      .mana-v9181-milestone-target-label{
        font-size:9px !important;
        color:#8c8c8c !important;
      }

      .mana-v9170-milestone-label,
      .mana-v9181-milestone-label{
        font-size:10px !important;
        color:#8c8c8c !important;
      }

      .mana-v9170-milestone-footer,
      .mana-v9170-milestone-footer strong,
      .mana-v9181-milestone-footer,
      .mana-v9181-milestone-footer strong{
        font-size:10px !important;
        line-height:1.4 !important;
      }

      .mana-v9170-select-label,
      .mana-v9181-select-label{
        font-size:10px !important;
        color:#8c8c8c !important;
      }

      .mana-v9170-current-pb-label,
      .mana-v9181-current-pb-label{
        font-size:10px !important;
      }

      .mana-v9170-latest-set-label,
      .mana-v9181-latest-set-label{
        font-size:10px !important;
        color:#8c8c8c !important;
      }

      .mana-v9170-latest-set-value,
      .mana-v9181-latest-set-value{
        font-size:12px !important;
      }

      .mana-v9170-latest-set-date,
      .mana-v9181-latest-set-date{
        font-size:10px !important;
      }

      .mana-v9170-strength-top,
      .mana-v9181-strength-top{
        font-size:9px !important;
      }

      .mana-v9170-pb-badge,
      .mana-v9181-pb-badge{
        padding:3px 5px !important;
        font-size:8px !important;
      }

      .mana-v9170-strength-date,
      .mana-v9181-strength-date{
        font-size:9px !important;
        color:#777 !important;
      }

      .mana-v9170-insight-kicker,
      .mana-v9181-insight-kicker{
        font-size:10px !important;
      }

      .mana-v9170-insight-copy,
      .mana-v9181-insight-copy{
        font-size:11px !important;
        line-height:1.55 !important;
      }

      .mana-v9170-reset-copy,
      .mana-v9181-reset-copy{
        font-size:10px !important;
        line-height:1.5 !important;
      }

      .mana-v9170-reset-btn,
      .mana-v9181-reset-btn{
        min-height:44px !important;
        font-size:10px !important;
      }

      /* LEARN */

      .mana-v9120-head p{
        font-size:13px !important;
        line-height:1.55 !important;
        color:#9a9a9a !important;
      }

      .mana-v9120-category{
        font-size:10px !important;
      }

      .mana-v9120-title{
        font-size:16px !important;
        line-height:1.3 !important;
      }

      .mana-v9120-intro{
        margin-top:6px !important;
        font-size:12px !important;
        line-height:1.5 !important;
        color:#919191 !important;
      }

      .mana-v9120-open{
        grid-template-columns:minmax(0,1fr) 40px !important;
        gap:12px !important;
        padding:16px !important;
      }

      .mana-v9120-arrow{
        width:38px !important;
        height:38px !important;
        border-color:#4a4121 !important;
        background:#111006 !important;
        color:#f3d875 !important;
        font-size:24px !important;
        font-weight:900 !important;
      }

      .mana-v9120-body{
        padding:0 16px 18px !important;
        color:#c0c0c0 !important;
        font-size:14px !important;
        line-height:1.7 !important;
      }

      .mana-v9120-tip-label{
        font-size:10px !important;
      }

      .mana-v9120-tip strong{
        font-size:16px !important;
      }

      .mana-v9120-tip p{
        font-size:12px !important;
        line-height:1.6 !important;
        color:#999 !important;
      }

      @media(max-width:560px){
        .mana-v9170-summary-chip,
        .mana-v9181-summary-chip{
          min-height:29px !important;
          font-size:9px !important;
        }

        .mana-v9170-compare-pill,
        .mana-v9181-compare-pill{
          font-size:9px !important;
        }

        .mana-v9120-title{
          font-size:15px !important;
        }

        .mana-v9120-intro{
          font-size:12px !important;
        }

        .mana-v9120-body{
          font-size:13px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function init() {
    injectStyles();

    window.addEventListener(
      "mana:program-tab-change",
      injectStyles
    );

    document.addEventListener(
      "visibilitychange",
      () => {
        if (
          document.visibilityState ===
          "visible"
        ) {
          injectStyles();
        }
      }
    );
  }

  window.MANA_READABILITY_BUILD =
    "92400";

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
