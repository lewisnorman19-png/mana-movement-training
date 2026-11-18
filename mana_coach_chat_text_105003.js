
/* =====================================================
   MANA MOVEMENT TRAINING
   COACH CHAT — PREMIUM TYPOGRAPHY
   BUILD 105003

   COMPLETE JAVASCRIPT FILE

   - Orange COACHING label
   - Premium white Client Messaging heading
   - Silver description
   - Refined card spacing
   - Retains existing chat button
   - No chat or navigation changes
   ===================================================== */

(() => {
  "use strict";

  const FLAG = "MANA_CHAT_TEXT_105003";
  const STYLE = "manaChatTextStyle105003";
  const VIEW = "coachClientDetailView";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const $ = id => document.getElementById(id);

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      #${VIEW} .mana-chat-polish-105003 {
        background: #15171B !important;
        border: 1px solid #505862 !important;
        border-radius: 17px !important;

        padding: 20px 22px !important;
        margin: 12px 0 !important;

        gap: 0 !important;
        color: #C1C6CE !important;

        box-shadow: none !important;
      }

      #${VIEW} .mana-chat-kicker-105003 {
        display: block !important;

        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;

        font: 900 10px/1.4
          system-ui,sans-serif !important;

        letter-spacing: .14em !important;
        text-transform: uppercase !important;

        margin: 0 0 8px !important;
      }

      #${VIEW} .mana-chat-title-105003 {
        display: block !important;

        color: #FFFFFF !important;
        -webkit-text-fill-color: #FFFFFF !important;

        font: 900 19px/1.3
          system-ui,sans-serif !important;

        letter-spacing: -.025em !important;
        margin: 0 0 7px !important;
      }

      #${VIEW} .mana-chat-desc-105003 {
        display: block !important;

        color: #AEB8C4 !important;
        -webkit-text-fill-color: #AEB8C4 !important;

        font: 400 12px/1.55
          system-ui,sans-serif !important;

        margin: 0 0 15px !important;
      }

      #${VIEW} .mana-chat-polish-105003 button {
        min-height: 43px !important;
        padding: 11px 18px !important;

        background: #25180F !important;
        border: 1px solid #FF7927 !important;
        border-radius: 10px !important;

        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;

        font-size: 12px !important;
        font-weight: 900 !important;

        box-shadow: none !important;
      }

      @media(max-width:600px) {
        #${VIEW} .mana-chat-polish-105003 {
          padding: 15px !important;
        }

        #${VIEW} .mana-chat-title-105003 {
          font-size: 18px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function findChatCard() {
    const view = $(VIEW);

    if (
      !view ||
      view.hidden ||
      view.classList.contains("hide")
    ) return null;

    const button = Array.from(
      view.querySelectorAll("button")
    ).find(node =>
      /open client chat/i.test(
        node.textContent || ""
      )
    );

    if (!button) return null;

    const card = button.closest(
      ".mana-coach-chat-105002," +
      ".mana-coach-chat-105001," +
      ".mana-premium-coach-chat," +
      ".card,section,article"
    );

    if (
      !card ||
      card === view ||
      card.id === "manaCoachProfile104950" ||
      card.id === "manaCoachAssignments104720" ||
      card.id === "manaV1017CoachRequest"
    ) return null;

    return card;
  }

  function polishText(card) {
    const walker = document.createTreeWalker(
      card,
      NodeFilter.SHOW_TEXT
    );

    const changes = [];

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const value = node.textContent.trim();

      if (!value) continue;

      if (
        node.parentElement.closest(
          "button,input,textarea,select"
        )
      ) continue;

      let kind = "";
      let replacement = value;

      if (/^coaching$/i.test(value)) {
        kind = "kicker";
        replacement = "COACHING";
      } else if (
        /^(coach chat|client messaging)$/i.test(value)
      ) {
        kind = "title";
        replacement = "Client Messaging";
      } else if (
        /^message .+ directly inside mana\.?$/i
          .test(value)
      ) {
        kind = "desc";
        replacement =
          "Stay connected with your client " +
          "through secure in-app messaging.";
      }

      if (!kind) continue;

      changes.push({
        node,
        kind,
        replacement
      });
    }

    changes.forEach(item => {
      if (!item.node.isConnected) return;

      const parent = item.node.parentElement;

      /*
       Existing simple text elements can
       be styled directly. Otherwise only
       wrap the matching text node.
       Buttons and event handlers remain
       unchanged.
      */

      const className =
        "mana-chat-" +
        item.kind +
        "-105003";

      if (
        parent &&
        parent !== card &&
        parent.childNodes.length === 1
      ) {
        parent.classList.add(className);
        item.node.textContent =
          item.replacement;
      } else {
        const span =
          document.createElement("span");

        span.className = className;
        span.textContent =
          item.replacement;

        item.node.replaceWith(span);
      }
    });
  }

  function refresh() {
    const card = findChatCard();

    if (!card) return;

    card.classList.add(
      "mana-chat-polish-105003"
    );

    polishText(card);
  }

  function init() {
    installStyles();
    refresh();

    document.addEventListener(
      "click",
      event => {
        if (
          event.target.closest?.(
            ".client-open[data-client-id]"
          )
        ) {
          [200, 550, 1000].forEach(delay => {
            setTimeout(refresh, delay);
          });
        }
      }
    );

    const view = $(VIEW);

    if (view) {
      new MutationObserver(() => {
        if (
          !view.hidden &&
          !view.classList.contains("hide")
        ) {
          requestAnimationFrame(refresh);
        }
      }).observe(view, {
        childList: true,
        subtree: false,
        attributes: true,
        attributeFilter: ["class"]
      });
    }

    window.addEventListener(
      "pageshow",
      refresh
    );

    console.log(
      "[Mana Movement] Coach Chat 105003"
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }

})();
