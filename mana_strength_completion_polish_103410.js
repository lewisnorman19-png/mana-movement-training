
/* ===================================================
   MANA MOVEMENT TRAINING
   WORKOUT COMPLETE POLISH — BUILD 103410

   - Back to Workouts label
   - Cardio completion summary
   - Core completion summary
   - Existing Strength stats preserved
   - Uses actual saved session results
   - No changes to workout logging
   =================================================== */

(() => {
  "use strict";

  const BUILD = "103410";
  const STYLE_ID = "mana-completion-polish-103410";
  const SCREEN_ID = "manaV915Complete";
  const CONTENT_ID = "manaV915Content";
  const LOG_KEY = "mana-strength-v64-logs";

  if (window.MANA_COMPLETION_POLISH === BUILD) {
    return;
  }

  window.MANA_COMPLETION_POLISH = BUILD;

  const $ = id => document.getElementById(id);

  function installStyles() {
    if ($(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      #${SCREEN_ID} .mf410-summary {
        margin: 18px 0;
        padding: 18px;
        border: 1px solid #34383e;
        border-radius: 16px;
        background: #101113;
        color: #fff;
      }

      #${SCREEN_ID} .mf410-heading {
        margin: 0 0 15px;
        color: #fff;
        font-size: 14px;
        font-weight: 900;
        letter-spacing: .6px;
      }

      #${SCREEN_ID} .mf410-grid {
        display: grid;
        grid-template-columns: repeat(2,minmax(0,1fr));
        gap: 12px;
      }

      #${SCREEN_ID} .mf410-card {
        min-width: 0;
        padding: 16px 12px;
        background: var(--mf-bg);
        border: 1.5px solid var(--mf-colour);
        border-radius: 13px;
        box-sizing: border-box;
      }

      #${SCREEN_ID} .mf410-card-head {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        color: var(--mf-colour);
        font-weight: 900;
        font-size: 14px;
      }

      #${SCREEN_ID} .mf410-icon {
        font-size: 22px;
        line-height: 1;
      }

      #${SCREEN_ID} .mf410-value {
        color: #fff;
        font-size: 17px;
        font-weight: 900;
        overflow-wrap: anywhere;
      }

      #${SCREEN_ID} .mf410-detail {
        margin-top: 5px;
        color: #acb8c5;
        font-size: 11px;
        line-height: 1.5;
        overflow-wrap: anywhere;
      }

      #${SCREEN_ID} .mf410-status {
        margin-top: 11px;
        color: #79dda5;
        font-size: 11px;
        font-weight: 800;
      }

      #${SCREEN_ID} .mf410-empty {
        color: #a2acb8;
        font-size: 12px;
      }

      #${SCREEN_ID} #manaV915Back {
        width: 100%;
        font-weight: 900;
        letter-spacing: .4px;
      }

      @media(max-width:420px) {
        #${SCREEN_ID} .mf410-grid {
          gap: 9px;
        }

        #${SCREEN_ID} .mf410-card {
          padding: 13px 10px;
        }

        #${SCREEN_ID} .mf410-value {
          font-size: 15px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function latestWorkout() {
    try {
      const logs = JSON.parse(
        localStorage.getItem(LOG_KEY) || "[]"
      );

      if (!Array.isArray(logs)) return null;

      return logs[logs.length - 1] || null;
    } catch (_) {
      return null;
    }
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function card(type, result) {
    const cardio = type === "cardio";
    const color = cardio ? "#368FD4" : "#D6A437";
    const background = cardio
      ? "rgba(54,143,212,.09)"
      : "rgba(214,164,55,.09)";

    const title = cardio ? "CARDIO" : "CORE";
    const symbol = cardio ? "♥" : "◎";

    let value = "Not added";
    let detail = "Optional finisher";
    let status = "";

    if (result?.completed) {
      if (cardio) {
        const minutes = Number(
          result.actualMinutes ??
          result.durationMinutes ??
          0
        );

        value = minutes > 0
          ? minutes + " minutes logged"
          : "Completed";

        detail = result.equipment
          ? escapeHtml(result.equipment)
          : "Cardio finisher";

        if (result.pattern) {
          detail += " · " +
            escapeHtml(result.pattern);
        }
      } else {
        value = Number(result.rounds || 0)
          + " rounds";

        const names = Array.isArray(result.exercises)
          ? result.exercises
              .map(x => x.name)
              .filter(Boolean)
          : [];

        detail = names.length
          ? names.map(escapeHtml).join(", ")
          : "Core finisher";
      }

      status = '<div class="mf410-status">✓ COMPLETED</div>';
    }

    return `
      <div class="mf410-card"
        style="
          --mf-colour:${color};
          --mf-bg:${background};
        ">
        <div class="mf410-card-head">
          <span class="mf410-icon">${symbol}</span>
          ${title}
        </div>

        <div class="${
          result?.completed
            ? "mf410-value"
            : "mf410-empty"
        }">
          ${value}
        </div>

        <div class="mf410-detail">
          ${detail}
        </div>

        ${status}
      </div>
    `;
  }

  function polish() {
    const screen = $(SCREEN_ID);
    const content = $(CONTENT_ID);

    if (
      !screen ||
      !content ||
      !screen.classList.contains("open")
    ) return;

    const back = $("manaV915Back");
    if (!back || !content.contains(back)) return;

    // Preserve the original working click handler.
    back.textContent = "BACK TO WORKOUTS →";

    const latest = latestWorkout();
    if (!latest) return;

    const finishers = latest.finishers || {};
    let summary = $("mf410Summary");

    if (!summary) {
      summary = document.createElement("section");
      summary.id = "mf410Summary";
      summary.className = "mf410-summary";
      back.before(summary);
    }

    const html = `
      <h3 class="mf410-heading">
        FINISHER SUMMARY
      </h3>

      <div class="mf410-grid">
        ${card("cardio",finishers.cardio)}
        ${card("core",finishers.core)}
      </div>
    `;

    if (summary.innerHTML !== html) {
      summary.innerHTML = html;
    }
  }

  let scheduled = false;

  function schedulePolish() {
    if (scheduled) return;

    scheduled = true;

    requestAnimationFrame(() => {
      scheduled = false;
      polish();
    });
  }

  function init() {
    installStyles();

    const screen = $(SCREEN_ID);
    const content = $(CONTENT_ID);

    if (screen) {
      const screenObserver = new MutationObserver(
        schedulePolish
      );

      screenObserver.observe(screen, {
        attributes: true,
        attributeFilter: ["class"]
      });
    }

    if (content) {
      const contentObserver = new MutationObserver(
        schedulePolish
      );

      contentObserver.observe(content, {
        childList: true
      });
    }

    window.addEventListener(
      "mana:strength-synced",
      schedulePolish
    );

    window.addEventListener(
      "mana:finishers-saved",
      schedulePolish
    );

    schedulePolish();

    console.log(
      "Mana Completion Polish",
      BUILD
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
