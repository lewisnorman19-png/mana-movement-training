
/* =========================================================
   MANA MOVEMENT
   SINGLE COACH PROFILE RENDERER
   BUILD 104972

   One owner for the Coach Hub profile.
   No page-wide observers.
   No replacement of View Client.
   No changes to chat, workouts or navigation.
   Read-only cloud access.
   ========================================================= */

(() => {
  "use strict";

  if (window.MANA_PROFILE_104972) return;
  window.MANA_PROFILE_104972 = true;

  const VIEW = "coachClientDetailView";
  const PANEL = "manaCoachProfile104950";
  const STYLE = "manaProfile104972Style";

  const $ = id => document.getElementById(id);

  let requestId = 0;
  let selected = null;

  const escape = value =>
    String(value ?? "").replace(/[&<>"']/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[c]);

  function open() {
    const view = $(VIEW);
    return !!(
      view &&
      !view.hidden &&
      !view.classList.contains("hide")
    );
  }

  function person() {
    try {
      if (
        typeof selectedCoachClient !== "undefined" &&
        selectedCoachClient?.userId
      ) {
        return {
          id: String(selectedCoachClient.userId),
          name: selectedCoachClient.clientName || "Client"
        };
      }
    } catch (_) {}

    return selected;
  }

  function present(value) {
    return (
      value !== null &&
      value !== undefined &&
      String(value).trim() !== ""
    );
  }

  function cell(label, value) {
    if (!present(value)) return "";

    return `
      <div class="mana-profile-cell">
        <small>${escape(label)}</small>
        <strong>${escape(value)}</strong>
      </div>
    `;
  }

  function group(title, content) {
    if (!content.trim()) return "";

    return `
      <section class="mana-profile-group">
        <h3>${escape(title)}</h3>
        <div class="mana-profile-grid">
          ${content}
        </div>
      </section>
    `;
  }

  function withUnit(value, unit) {
    return present(value) ? `${value} ${unit}` : "";
  }

  function date(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) {
      return value || "";
    }

    const [y, m, d] = value.split("-").map(Number);
    const parsed = new Date(Date.UTC(y, m - 1, d));

    if (
      parsed.getUTCFullYear() !== y ||
      parsed.getUTCMonth() !== m - 1 ||
      parsed.getUTCDate() !== d
    ) {
      return value;
    }

    return parsed.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC"
    });
  }

  function styles() {
    if ($(STYLE)) return;

    const sheet = document.createElement("style");
    sheet.id = STYLE;

    sheet.textContent = `
      #${VIEW} #${PANEL} {
        background: #15171B !important;
        color: white !important;
        border: 1px solid #505862 !important;
        border-radius: 17px !important;
        padding: 15px !important;
        margin: 12px 0 !important;
        box-shadow: none !important;
      }

      #${PANEL} * {
        box-sizing: border-box;
      }

      #${PANEL} .mana-profile-kicker {
        color: #FF7927;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: .12em;
      }

      #${PANEL} .mana-profile-name {
        font-size: 23px;
        margin: 5px 0 8px;
        color: white;
      }

      #${PANEL} .mana-profile-group {
        margin-top: 15px;
        padding-top: 12px;
        border-top: 1px solid #343B44;
      }

      #${PANEL} .mana-profile-group h3 {
        color: #FF7927;
        font-size: 12px;
        letter-spacing: .06em;
        margin: 0 0 10px;
        text-transform: uppercase;
      }

      #${PANEL} .mana-profile-grid {
        display: grid;
        grid-template-columns: repeat(2,minmax(0,1fr));
        gap: 7px;
      }

      #${PANEL} .mana-profile-cell {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        background: #101215;
        border: 1px solid #424A55;
        border-radius: 9px;
        padding: 9px 11px;
        margin: 0;
        min-height: 0;
        height: auto;
        gap: 4px;
      }

      #${PANEL} .mana-profile-cell small {
        display: block;
        width: 100%;
        color: #ABB5C1;
        font-size: 10px;
        text-align: left;
        margin: 0;
      }

      #${PANEL} .mana-profile-cell strong {
        display: block;
        width: 100%;
        color: white;
        font-size: 13px;
        line-height: 1.4;
        text-align: left;
        overflow-wrap: anywhere;
        white-space: pre-wrap;
        margin: 0;
      }

      #${PANEL} .mana-profile-note {
        color: #AFB8C4;
        font-size: 11px;
        line-height: 1.6;
        margin: 9px 0;
      }

      #${PANEL} .mana-photo-fold {
        border: 1px solid #49515B;
        border-radius: 12px;
        margin-top: 15px;
        background: #101215;
        overflow: hidden;
      }

      #${PANEL} .mana-photo-fold > summary {
        cursor: pointer;
        padding: 13px;
        color: white;
        font-weight: 800;
        font-size: 14px;
      }

      #${PANEL} .mana-photo-grid {
        display: grid;
        grid-template-columns: repeat(3,minmax(0,1fr));
        gap: 8px;
        padding: 12px;
      }

      #${PANEL} .mana-photo-card {
        border: 1px solid #424A55;
        border-radius: 9px;
        padding: 7px;
        min-width: 0;
      }

      #${PANEL} .mana-photo-card img {
        width: 100%;
        max-height: 170px;
        aspect-ratio: 3 / 4;
        object-fit: cover;
        border-radius: 7px;
        display: block;
        margin-bottom: 7px;
      }

      #${PANEL} .mana-photo-empty {
        aspect-ratio: 3 / 4;
        max-height: 170px;
        border: 1px dashed #59616C;
        border-radius: 7px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        color: #AAB3BF;
        margin-bottom: 7px;
      }

      #${PANEL} .mana-photo-card strong {
        display: block;
        font-size: 12px;
      }

      @media(max-width:600px) {
        #${VIEW} #${PANEL} {
          padding: 12px !important;
        }

        #${PANEL} .mana-profile-grid {
          grid-template-columns: 1fr;
        }

        #${PANEL} .mana-photo-grid {
          gap: 5px;
          padding: 8px;
        }

        #${PANEL} .mana-photo-card {
          padding: 4px;
        }
      }
    `;

    document.head.appendChild(sheet);
  }

  function ensurePanel() {
    const view = $(VIEW);
    if (!view) return null;

    let panel = $(PANEL);

    if (!panel) {
      panel = document.createElement("section");
      panel.id = PANEL;

      const hero = $("manaV998ClientHero");

      if (hero && view.contains(hero)) {
        hero.insertAdjacentElement("afterend", panel);
      } else {
        view.insertBefore(
          panel,
          view.children[1] || null
        );
      }
    }

    return panel;
  }

  async function database() {
    if (typeof window.supabaseClient !== "function") {
      throw new Error("Cloud connection unavailable");
    }

    return await window.supabaseClient();
  }

  async function loadPhotos(db, id, token) {
    const grid = $("manaPhotos104972");
    if (!grid) return;

    const {data, error} = await db
      .from("client_progress_photos")
      .select("phase,angle,storage_path,captured_on,created_at")
      .eq("user_id", id)
      .order("created_at", {ascending:false})
      .limit(80);

    if (token !== requestId || !open()) return;

    if (error) {
      grid.textContent = "Photos unavailable.";
      return;
    }

    const photos = data || [];

    const entries = [];

    for (const phase of ["baseline", "progress"]) {
      for (const angle of ["front", "side", "back"]) {
        const photo = photos.find(
          p => p.phase === phase && p.angle === angle
        );

        entries.push({phase, angle, photo});
      }
    }

    for (const entry of entries) {
      if (token !== requestId || !open()) return;

      const card = document.createElement("div");
      card.className = "mana-photo-card";

      if (entry.photo?.storage_path) {
        const result = await db.storage
          .from("mana-client-private")
          .createSignedUrl(entry.photo.storage_path,600);

        if (token !== requestId || !open()) return;

        if (result.data?.signedUrl) {
          const img = document.createElement("img");
          img.src = result.data.signedUrl;
          img.alt = `${entry.phase} ${entry.angle}`;
          img.loading = "lazy";
          card.appendChild(img);
        }
      }

      if (!card.querySelector("img")) {
        const placeholder = document.createElement("div");
        placeholder.className = "mana-photo-empty";
        placeholder.textContent = "No photo";
        card.appendChild(placeholder);
      }

      const title = document.createElement("strong");
      title.textContent =
        `${entry.phase === "baseline" ? "Starting" : "Progress"} · ${entry.angle}`;

      card.appendChild(title);

      if (grid.isConnected) grid.appendChild(card);
    }
  }

  async function renderClient() {
    if (!open()) return;

    const client = person();
    if (!client?.id) return;

    const token = ++requestId;
    styles();

    const panel = ensurePanel();
    if (!panel) return;

    panel.innerHTML = `
      <div class="mana-profile-kicker">CLIENT PROFILE</div>
      <h2 class="mana-profile-name">${escape(client.name)}</h2>
      <p class="mana-profile-note">Loading client information…</p>
    `;

    try {
      const db = await database();

      const [extended, training] = await Promise.all([
        db.from("client_extended_profiles")
          .select("details,share_with_coach")
          .eq("user_id",client.id)
          .maybeSingle(),

        db.from("profile_settings")
          .select(
            "name,age,height_cm,weight_kg," +
            "training_days,goal,experience,equipment"
          )
          .eq("user_id",client.id)
          .maybeSingle()
      ]);

      if (token !== requestId || !open()) return;
      if (person()?.id !== client.id) return;

      const details =
        !extended.error &&
        extended.data?.share_with_coach
          ? extended.data.details || {}
          : {};

      const t = training.data || {};

      const personal = [
        cell("Full name",
          [details.first_name,details.last_name]
            .filter(Boolean).join(" ") ||
          t.name || client.name),
        cell("Email",details.contact_email),
        cell("Date of birth",date(details.dob)),
        cell("Age",t.age),
        cell("Mobile",details.phone),
        cell("Country",details.country),
        cell("State / Province",details.state),
        cell("City / Suburb",details.city),
        cell("Postcode",details.postcode)
      ].join("");

      const goals = [
        cell("Training goal",t.goal),
        cell("Training days",withUnit(t.training_days,"days")),
        cell("Experience",t.experience),
        cell("Equipment",t.equipment),
        cell("Current weight",withUnit(t.weight_kg,"kg")),
        cell("Height",withUnit(t.height_cm,"cm")),
        cell("Target weight",withUnit(details.target_weight,"kg")),
        cell("Training preferences",details.training_preferences),
        cell("Injuries / limitations",details.injuries)
      ].join("");

      const fuel = [
        cell("Food goal",details.fuelGoal || details.food_goal),
        cell("Daily calories",
          details.calorie_target || details.daily_calories),
        cell("Daily protein",
          details.protein_target || details.daily_protein),
        cell("Dietary preferences",details.dietary_preferences),
        cell("Water target",withUnit(details.water_target,"L"))
      ].join("");

      const emergency = [
        cell("Emergency contact",details.emergency_name),
        cell("Emergency phone",details.emergency_phone)
      ].join("");

      panel.innerHTML = `
        <div class="mana-profile-kicker">
          MANA MOVEMENT · CLIENT PROFILE
        </div>
        <h2 class="mana-profile-name">${escape(client.name)}</h2>

        ${group("Personal & Contact",personal)}
        ${group("Training & Goals",goals)}
        ${group("Fuel & Nutrition",fuel)}

        ${!fuel.trim() ? `
          <p class="mana-profile-note">
            The client's Fuel targets have not yet been
            shared to the coach-readable cloud profile.
          </p>
        ` : ""}

        ${group("Emergency Details",emergency)}

        <details class="mana-photo-fold">
          <summary>Starting & Progress Photos</summary>
          <div id="manaPhotos104972" class="mana-photo-grid"></div>
        </details>
      `;

      panel.dataset.clientId = client.id;

      await loadPhotos(db,client.id,token);

    } catch (error) {
      if (token !== requestId) return;

      panel.innerHTML = `
        <div class="mana-profile-kicker">CLIENT PROFILE</div>
        <h2 class="mana-profile-name">${escape(client.name)}</h2>
        <p class="mana-profile-note">
          Unable to load extended information:
          ${escape(error.message || error)}
        </p>
      `;
    }
  }

  function onClientClick(event) {
    const button = event.target.closest?.(
      ".client-open[data-client-id]"
    );

    if (!button) return;

    selected = {
      id: button.dataset.clientId,
      name: button.dataset.clientName || "Client"
    };

    requestId++;

    setTimeout(() => {
      if (open()) void renderClient();
    },200);
  }

  function init() {
    styles();

    document.addEventListener(
      "click",
      onClientClick,
      true
    );

    if (open()) {
      setTimeout(() => void renderClient(),200);
    }

    console.log(
      "[Mana Movement] Single Coach Profile 104972"
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
