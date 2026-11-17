
/* ============================================================
   MANA MOVEMENT TRAINING
   COACH HUB — CLIENT PROFILE RESTORE
   BUILD 104950

   FEATURES
   - Same profile structure for every client
   - Read-only extended client information
   - Starting and progress photographs
   - Profile avatar when available
   - Separate program upgrade request section
   - Preserve existing coaching cards

   SAFETY
   - Does not replace openCoachClientDetail
   - Does not intercept View Client clicks
   - Does not change Supabase permissions
   - Does not modify client information
   - Does not modify workout data
   - Does not modify chat
   - No MutationObserver
   - No continuous polling
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104950";

  if (window.MANA_COACH_RESTORE_104950) return;

  window.MANA_COACH_RESTORE_104950 = true;

  const $ = id => document.getElementById(id);

  const VIEW = "coachClientDetailView";
  const PANEL = "manaCoachProfile104950";
  const REQUESTS = "manaCoachRequests104950";
  const STYLE = "manaCoachProfileStyle104950";

  const BUCKET = "mana-client-private";

  let selected = null;
  let loadNumber = 0;
  let pendingTimers = [];

  const fields = [
    ["first_name", "First name"],
    ["last_name", "Last name"],
    ["dob", "Date of birth"],
    ["phone", "Mobile phone"],
    ["country", "Country"],
    ["state", "State / Province"],
    ["city", "City / Suburb"],
    ["postcode", "Postcode"],
    ["emergency_name", "Emergency contact"],
    ["emergency_phone", "Emergency contact phone"],
    ["target_weight", "Target weight"],
    ["injuries", "Injuries / limitations"],
    ["training_preferences", "Training preferences"],
    ["dietary_preferences", "Dietary preferences"],
    ["water_target", "Water target"]
  ];

  const safe = value =>
    String(value ?? "").replace(
      /[&<>"']/g,
      c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[c]
    );

  /* ============================================================
     CURRENT CLIENT
     ============================================================ */

  function detailOpen() {
    const view = $(VIEW);

    return Boolean(
      view &&
      !view.classList.contains("hide") &&
      !view.hidden
    );
  }

  function activeClient() {
    try {
      if (
        typeof selectedCoachClient !== "undefined" &&
        selectedCoachClient?.userId
      ) {
        return {
          id: String(selectedCoachClient.userId),
          name: String(
            selectedCoachClient.clientName || "Client"
          )
        };
      }
    } catch (_) {}

    return selected;
  }

  /* ============================================================
     SUPABASE
     ============================================================ */

  async function connection() {
    if (
      typeof window.supabaseClient !== "function"
    ) {
      throw Error("Mana cloud is unavailable.");
    }

    const db = await window.supabaseClient();

    const { data, error } = await db.auth.getUser();

    if (error) throw error;

    if (!data?.user) {
      throw Error("Please sign in again.");
    }

    return db;
  }

  /* ============================================================
     STYLES
     ============================================================ */

  function styles() {
    if ($(STYLE)) return;

    const sheet = document.createElement("style");

    sheet.id = STYLE;

    sheet.textContent = `
      #${VIEW} #${PANEL},
      #${VIEW} #${REQUESTS} {
        background: #15171b;
        color: #fff;
        border: 1px solid #555d66;
        border-radius: 18px;
        padding: 18px;
        margin: 15px 0;
        box-sizing: border-box;
        width: 100%;
      }

      #${PANEL} *,
      #${REQUESTS} * {
        box-sizing: border-box;
      }

      #${PANEL} .mcp-kicker,
      #${REQUESTS} .mcp-kicker {
        color: #ff7927;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: .09em;
        text-transform: uppercase;
      }

      #${PANEL} h3,
      #${REQUESTS} h3 {
        color: #fff;
        font-size: 20px;
        font-weight: 850;
        margin: 7px 0 14px;
      }

      #${PANEL} .mcp-note {
        color: #bfc5ce;
        font-size: 12px;
        line-height: 1.6;
        margin: 9px 0;
      }

      #${PANEL} .mcp-grid {
        display: grid;
        grid-template-columns:
          repeat(2, minmax(0, 1fr));
        gap: 10px;
      }

      #${PANEL} .mcp-detail {
        background: #0e1013;
        border: 1px solid #424a54;
        border-radius: 11px;
        padding: 12px;
        min-width: 0;
      }

      #${PANEL} .mcp-detail small {
        display: block;
        color: #aeb7c3;
        font-size: 11px;
        margin-bottom: 5px;
      }

      #${PANEL} .mcp-detail strong {
        display: block;
        color: #fff;
        font-size: 13px;
        font-weight: 700;
        overflow-wrap: anywhere;
        white-space: pre-wrap;
      }

      #${PANEL} .mcp-photos {
        display: grid;
        grid-template-columns:
          repeat(3, minmax(0, 1fr));
        gap: 10px;
      }

      #${PANEL} .mcp-photo {
        background: #0e1013;
        border: 1px solid #424a54;
        border-radius: 12px;
        padding: 9px;
        min-width: 0;
        overflow: hidden;
      }

      #${PANEL} .mcp-photo img {
        display: block;
        width: 100%;
        aspect-ratio: 3 / 4;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 8px;
      }

      #${PANEL} .mcp-photo strong {
        display: block;
        font-size: 12px;
        text-transform: capitalize;
      }

      #${PANEL} .mcp-photo small {
        display: block;
        color: #aeb7c3;
        font-size: 10px;
        margin-top: 4px;
      }

      #${PANEL} .mcp-empty-photo {
        display: flex;
        align-items: center;
        justify-content: center;
        aspect-ratio: 3 / 4;
        border: 1px dashed #59616b;
        border-radius: 8px;
        color: #9da6b2;
        font-size: 12px;
        margin-bottom: 8px;
        text-align: center;
      }

      #${PANEL} .mcp-divider {
        height: 1px;
        background: #353b44;
        margin: 19px 0;
      }

      #${VIEW} .mcp-header-avatar {
        object-fit: cover;
        border-radius: 14px;
        width: 100%;
        height: 100%;
      }

      @media(max-width: 600px) {
        #${VIEW} #${PANEL},
        #${VIEW} #${REQUESTS} {
          padding: 14px;
        }

        #${PANEL} .mcp-grid {
          grid-template-columns: 1fr;
        }

        #${PANEL} .mcp-photos {
          gap: 6px;
        }

        #${PANEL} .mcp-photo {
          padding: 6px;
        }
      }
    `;

    document.head.appendChild(sheet);
  }

  /* ============================================================
     CREATE ONE PROFILE PANEL
     ============================================================ */

  function ensurePanel() {
    const view = $(VIEW);

    if (!view) return null;

    let panel = $(PANEL);

    if (!panel) {
      panel = document.createElement("section");

      panel.id = PANEL;
      panel.setAttribute(
        "aria-label",
        "Client personal and progress profile"
      );

      const hero = $("manaV998ClientHero");
      const actions = $("manaV1010ClientActions");

      if (hero && view.contains(hero)) {
        hero.insertAdjacentElement("afterend", panel);
      } else if (
        actions &&
        view.contains(actions)
      ) {
        actions.insertAdjacentElement(
          "beforebegin",
          panel
        );
      } else {
        const header = $("detailClientName")
          ?.closest(".row");

        if (header && view.contains(header)) {
          header.insertAdjacentElement(
            "afterend",
            panel
          );
        } else {
          view.appendChild(panel);
        }
      }
    }

    return panel;
  }

  /* ============================================================
     INFORMATION SECTION
     ============================================================ */

  function renderInformation(details) {
    const entries = [
      ["contact_email", "Email"],
      ...fields
    ];

    const available = entries.filter(
      ([key]) =>
        details[key] !== undefined &&
        details[key] !== null &&
        String(details[key]).trim() !== ""
    );

    if (!available.length) {
      return `
        <p class="mcp-note">
          Additional client information has not
          been completed or shared yet.
        </p>
      `;
    }

    return `
      <div class="mcp-grid">
        ${available.map(([key, label]) => `
          <div class="mcp-detail">
            <small>${safe(label)}</small>
            <strong>
              ${safe(details[key])}
            </strong>
          </div>
        `).join("")}
      </div>
    `;
  }

  /* ============================================================
     PHOTO SECTION
     ============================================================ */

  function photoCard(angle, phase, row) {
    const card = document.createElement("div");

    card.className = "mcp-photo";

    const title = document.createElement("strong");

    title.textContent =
      angle[0].toUpperCase() +
      angle.slice(1);

    const description = document.createElement("small");

    description.textContent =
      phase === "baseline"
        ? "Starting photo"
        : row?.captured_on || "Check-in";

    if (!row) {
      const placeholder = document.createElement("div");

      placeholder.className = "mcp-empty-photo";
      placeholder.textContent = "No photo";

      card.appendChild(placeholder);
    } else {
      const image = document.createElement("img");

      image.alt =
        angle + " " + phase + " progress photograph";

      image.loading = "lazy";

      card.appendChild(image);

      card.dataset.storagePath = row.storage_path;
    }

    card.appendChild(title);
    card.appendChild(description);

    return card;
  }

  async function signedPhoto(db, path) {
    const { data, error } = await db.storage
      .from(BUCKET)
      .createSignedUrl(path, 600);

    if (error) throw error;

    return data?.signedUrl || "";
  }

  async function renderPhotos(db, clientId, ticket) {
    const { data, error } = await db
      .from("client_progress_photos")
      .select(
        "phase,angle,storage_path,captured_on,created_at"
      )
      .eq("user_id", clientId)
      .order("created_at", {
        ascending: false
      })
      .limit(80);

    if (error) throw error;

    if (ticket !== loadNumber) return;

    const photos = data || [];

    const baseline = $("mcpBaseline104950");
    const history = $("mcpHistory104950");

    if (!baseline || !history) return;

    baseline.replaceChildren();
    history.replaceChildren();

    for (const angle of ["front", "side", "back"]) {
      const record = photos.find(
        p =>
          p.phase === "baseline" &&
          p.angle === angle
      );

      baseline.appendChild(
        photoCard(angle, "baseline", record)
      );
    }

    const progress = photos.filter(
      p =>
        p.phase === "progress" &&
        ["front", "side", "back"].includes(p.angle)
    );

    if (!progress.length) {
      history.innerHTML = `
        <p class="mcp-note">
          No progress check-in photos yet.
        </p>
      `;
    } else {
      for (const record of progress) {
        history.appendChild(
          photoCard(
            record.angle,
            "progress",
            record
          )
        );
      }
    }

    const images = Array.from(
      baseline.querySelectorAll(
        "[data-storage-path]"
      )
    ).concat(
      Array.from(
        history.querySelectorAll(
          "[data-storage-path]"
        )
      )
    );

    for (const card of images) {
      if (ticket !== loadNumber) return;

      const img = card.querySelector("img");
      if (!img) continue;

      try {
        const url = await signedPhoto(
          db,
          card.dataset.storagePath
        );

        if (
          ticket === loadNumber &&
          card.isConnected &&
          url
        ) {
          img.src = url;
        }
      } catch (error) {
        img.replaceWith(
          Object.assign(
            document.createElement("div"),
            {
              className: "mcp-empty-photo",
              textContent: "Photo unavailable"
            }
          )
        );
      }
    }

    const avatar = photos.find(
      p => p.angle === "avatar"
    );

    if (avatar && ticket === loadNumber) {
      try {
        const url = await signedPhoto(
          db,
          avatar.storage_path
        );

        const headerAvatar =
          $("manaV998ClientHero")
            ?.querySelector(".mana-v998-avatar");

        if (
          url &&
          headerAvatar &&
          ticket === loadNumber
        ) {
          headerAvatar.replaceChildren();

          const image = document.createElement("img");

          image.className = "mcp-header-avatar";
          image.alt = "Client profile photo";
          image.src = url;

          headerAvatar.appendChild(image);
        }
      } catch (_) {}
    }
  }

  /* ============================================================
     LOAD THE SELECTED CLIENT
     ============================================================ */

  async function loadProfile() {
    if (!detailOpen()) return;

    const person = activeClient();

    if (!person?.id) return;

    const ticket = ++loadNumber;

    styles();

    const panel = ensurePanel();

    if (!panel) return;

    panel.innerHTML = `
      <div class="mcp-kicker">
        Client Profile
      </div>

      <h3>
        ${safe(person.name)}
      </h3>

      <p class="mcp-note">
        Personal information, training preferences,
        health considerations and progress photos.
      </p>

      <p class="mcp-note">
        Loading shared profile…
      </p>
    `;

    try {
      const db = await connection();

      const { data, error } = await db
        .from("client_extended_profiles")
        .select("details,share_with_coach")
        .eq("user_id", person.id)
        .maybeSingle();

      if (error) throw error;

      if (
        ticket !== loadNumber ||
        !detailOpen()
      ) {
        return;
      }

      if (!data || !data.share_with_coach) {
        panel.innerHTML = `
          <div class="mcp-kicker">
            Client Profile
          </div>

          <h3>${safe(person.name)}</h3>

          <p class="mcp-note">
            The extended profile is not available
            to this coach yet. The client must
            complete it and authorise sharing.
          </p>

          <p class="mcp-note">
            Existing programs, check-ins, sessions
            and coaching records remain available
            below.
          </p>
        `;

        organiseRequest();
        return;
      }

      const details = data.details || {};

      panel.innerHTML = `
        <div class="mcp-kicker">
          Client Profile
        </div>

        <h3>${safe(person.name)}</h3>

        ${renderInformation(details)}

        <div class="mcp-divider"></div>

        <div class="mcp-kicker">
          Body Transformation
        </div>

        <h3>Starting Photos</h3>

        <div
          class="mcp-photos"
          id="mcpBaseline104950"
        ></div>

        <div class="mcp-divider"></div>

        <h3>Progress Photos</h3>

        <div
          class="mcp-photos"
          id="mcpHistory104950"
        ></div>

        <p class="mcp-note">
          Private progress photographs.
          Available only through authorised
          account permissions.
        </p>
      `;

      await renderPhotos(
        db,
        person.id,
        ticket
      );

      organiseRequest();

    } catch (error) {
      if (ticket !== loadNumber) return;

      panel.innerHTML = `
        <div class="mcp-kicker">
          Client Profile
        </div>

        <h3>${safe(person.name)}</h3>

        <p class="mcp-note">
          Extended profile unavailable:
          ${safe(error.message || error)}
        </p>

        <p class="mcp-note">
          Existing coaching information remains
          accessible below.
        </p>
      `;

      organiseRequest();
    }
  }

  /* ============================================================
     PROGRAM UPGRADE REQUEST

     Move only an existing, matching request card.
     Keep the original node and all its buttons.

     Never fabricate a request or move another
     client's request into this profile.
     ============================================================ */

  function organiseRequest() {
    if (!detailOpen()) return;

    const view = $(VIEW);
    const person = activeClient();

    if (!view || !person?.name) return;

    const candidates = Array.from(
      document.querySelectorAll(
        "section, article, .card"
      )
    );

    const card = candidates.find(element => {
      if (
        element.id === PANEL ||
        element.id === REQUESTS ||
        element.closest(
          "#" + PANEL + ", #" + REQUESTS
        )
      ) {
        return false;
      }

      const text = element.textContent || "";

      const heading = Array.from(
        element.querySelectorAll(
          "h1,h2,h3,h4,.mbr-kicker"
        )
      ).some(node =>
        /program upgrade request/i.test(
          node.textContent || ""
        )
      );

      return Boolean(
        heading &&
        text.includes(person.name) &&
        /mark next block ready/i.test(text) &&
        element.querySelectorAll("button").length >= 2
      );
    });

    if (!card) return;

    let section = $(REQUESTS);

    if (!section) {
      section = document.createElement("section");

      section.id = REQUESTS;
      section.setAttribute(
        "aria-label",
        "Client program upgrade request"
      );

      view.appendChild(section);
    }

    if (card.parentElement !== section) {
      section.appendChild(card);
    }

    const history = $("manaCoachHistory104790");

    if (
      history &&
      view.contains(history) &&
      section.nextElementSibling !== history
    ) {
      history.insertAdjacentElement(
        "beforebegin",
        section
      );
    }
  }

  /* ============================================================
     SELECT CLIENT WITHOUT CHANGING CLICK BEHAVIOUR
     ============================================================ */

  function rememberClient(event) {
    const button = event.target.closest?.(
      "#mcnList104707 .client-open[data-client-id]," +
      "#coachClientsCard .client-open[data-client-id]"
    );

    if (!button) return;

    selected = {
      id: String(button.dataset.clientId),
      name: String(
        button.dataset.clientName || "Client"
      )
    };

    loadNumber++;
    clearPending();

    [150, 450, 900].forEach(delay => {
      pendingTimers.push(
        setTimeout(() => {
          if (detailOpen()) {
            void loadProfile();
          }
        }, delay)
      );
    });
  }

  function clearPending() {
    pendingTimers.forEach(clearTimeout);
    pendingTimers = [];
  }

  /* ============================================================
     INITIALISATION
     ============================================================ */

  function init() {
    styles();

    document.addEventListener(
      "click",
      rememberClient,
      true
    );

    if (detailOpen()) {
      setTimeout(() => {
        void loadProfile();
      }, 150);
    }

    console.log(
      "[Mana Movement] Coach profile restore " +
      BUILD +
      " active"
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
