
/* ============================================================
   MANA MOVEMENT — CENTRAL DESIGN SYSTEM 103830
   One palette and shared component styles for all programs.
   Visual only: does not modify data, events, authentication,
   workout state, navigation or subscription logic.
   REPLACES theme scripts 103810 and 103820.
   ============================================================ */
(() => {
  "use strict";
  const ID = "manaCentralDesignSystem103830";
  if (document.getElementById(ID)) return;

  const style = document.createElement("style");
  style.id = ID;
  style.textContent = `
    /* ONE SOURCE OF TRUTH — EDIT THESE TOKENS ONLY */
    :root {
      --mana-bg:#08090B;
      --mana-surface:#15171B;
      --mana-surface-raised:#1D2025;
      --mana-border:#4A4E55;
      --mana-orange:#FF7927;
      --mana-orange-light:#FF9C5B;
      --mana-white:#FFFFFF;
      --mana-silver:#C1C6CE;
      --mana-complete:#57CB8A;
      --mana-cardio:#368FD4;
      --mana-water:#368FD4;
      --mana-recovery:#9874D8;
      --bg:var(--mana-bg);
      --card:var(--mana-surface);
      --line:var(--mana-border);
      --gold:var(--mana-orange);
      --gold2:var(--mana-orange);
      --text:var(--mana-white);
      --muted:var(--mana-silver);
      --m28-gold:var(--mana-orange);
      --m28-border:rgba(255,121,39,.7);
    }

    /* SHARED APP SURFACES */
    body {
      background:var(--mana-bg)!important;
      color:var(--mana-white);
    }
    .card,.metric {
      background:var(--mana-surface)!important;
      border-color:var(--mana-border)!important;
    }
    .muted,.tiny.muted {
      color:var(--mana-silver)!important;
    }
    .gold,.pill,.mark,.brand small,.metric strong,.linkbtn {
      color:var(--mana-orange)!important;
    }
    .pill,.mark {
      border-color:var(--mana-orange)!important;
    }
    .btn.primary,.primary {
      background:var(--mana-orange)!important;
      color:var(--mana-bg)!important;
    }
    .btn.secondary,.secondary {
      background:var(--mana-surface-raised)!important;
      border-color:var(--mana-border)!important;
      color:var(--mana-white)!important;
    }
    input,select,textarea {
      background:var(--mana-surface)!important;
      border-color:var(--mana-border)!important;
      color:var(--mana-white)!important;
    }
    .tabs .active,.check.done {
      background:var(--mana-orange)!important;
      border-color:var(--mana-orange)!important;
      color:var(--mana-bg)!important;
    }
    .progress span {
      background:var(--mana-orange)!important;
    }
    #bottomNav {
      background:rgba(8,9,11,.97)!important;
      border-top-color:var(--mana-border)!important;
    }
    #bottomNav button.active {
      color:var(--mana-orange)!important;
    }

    /* COACH HUB — THREE PROGRAM CARDS */
    #manaCoachHubClean103760 .hub-hero,
    #manaCoachHubClean103760 .hub-panel,
    #manaCoachHubClean103760 .hub-alert {
      background:var(--mana-surface)!important;
      border-color:var(--mana-border)!important;
    }
    #manaCoachHubClean103760 .hub-card {
      --accent:var(--mana-orange)!important;
      background:var(--mana-surface-raised)!important;
      border-color:var(--mana-orange)!important;
    }
    #manaCoachHubClean103760 .hub-kicker,
    #manaCoachHubClean103760 .hub-symbol,
    #manaCoachHubClean103760 .hub-alert .hub-figure,
    #manaCoachHubClean103760 .hub-item span {
      color:var(--mana-orange)!important;
    }
    #manaCoachHubClean103760 .hub-back,
    #manaCoachHubClean103760 .hub-secondary {
      background:var(--mana-surface-raised)!important;
      border-color:var(--mana-orange)!important;
      color:var(--mana-orange)!important;
    }

    /* MANA STRENGTH */
    #manaV993StrengthProgress
      .mana-v993-metrics .mana-v993-metric {
      border-color:var(--mana-orange)!important;
      background:var(--mana-surface)!important;
    }
    #manaV993StrengthProgress
      .mana-v993-metrics .mana-v993-metric
      .mana-v993-metric-label,
    #manaV993StrengthProgress
      .mana-v993-metrics .mana-v993-metric
      .mana-v993-metric-value {
      color:var(--mana-orange)!important;
    }
    #manaV993StrengthProgress
      .mana-v993-metric.mf450-cardio
      .mana-v993-track .mana-v993-fill {
      background:var(--mana-cardio)!important;
    }
    #manaV993StrengthProgress
      .mana-v993-metric.mf450-core
      .mana-v993-track .mana-v993-fill {
      background:var(--mana-orange)!important;
    }

    /* MANA28 / MANALYFE */
    #manaV83Content
      .mana-v980-root .mana-v980-day:not(.done) {
      background:var(--mana-surface)!important;
      border-color:var(--mana-orange)!important;
    }
    #manaV83Content
      .mana-v980-root .mana-v980-day:not(.done)
      .mana-v980-number {
      color:var(--mana-orange)!important;
      border-color:var(--mana-orange)!important;
      background:var(--mana-surface-raised)!important;
    }
    #manaV83Content
      .mana-v980-root .mana-v980-day:not(.done)::before {
      background:var(--mana-orange)!important;
    }
    #manaV83Content
      .mana-v980-root .mana-v980-day .mana-v980-title,
    #manaV83Content
      .mana-v980-root .mana-v980-day .mana-v980-category {
      color:var(--mana-white)!important;
    }
    #manaV83Content
      .mana-v980-root .mana-v980-day.done {
      border-color:var(--mana-complete)!important;
    }
    #manaV83Content
      .mana-v980-root .mana-v980-day.done
      .mana-v980-number {
      color:var(--mana-complete)!important;
      border-color:var(--mana-complete)!important;
    }

    /* MANA28 LEARNING */
    #manaV83Content .mana-v927-learn-item,
    #manaV83Content .mana-v985-learn-card,
    #manaV83Content .mana-v985-learn-button {
      border-color:var(--mana-orange)!important;
    }
    #manaV83Content .mana-v985-kicker,
    #manaV83Content .mana-v927-learn-open,
    #manaV83Content
      .mana-v985-learn-button > span:last-child {
      color:var(--mana-orange)!important;
    }

    /* LOGIN */
    body:has(#authView:not(.hide)) {
      background:var(--mana-bg)!important;
    }
    #manaPremiumLoginTitle103780 span {
      color:var(--mana-orange)!important;
    }
    #authView .tabs button.active,
    #authView
      #manaPremiumLoginRoles103780
      button[aria-pressed="true"] {
      background:var(--mana-surface-raised)!important;
      border-color:var(--mana-orange)!important;
      color:var(--mana-white)!important;
      box-shadow:none!important;
    }
    #authView #forgotPasswordBtn {
      color:var(--mana-orange)!important;
    }
  `;

  document.head.appendChild(style);
  window.MANA_DESIGN_SYSTEM_BUILD = "103830";
})();
