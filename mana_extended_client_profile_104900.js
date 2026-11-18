
/* ============================================================
   MANA MOVEMENT TRAINING
   CLIENT PROFILE RESTORE + PREMIUM COACH CHAT
   BUILD 104901

   COMPLETE REPLACEMENT:
   mana_extended_client_profile_104900.js

   RESTORES
   - Personal and contact information
   - Emergency contacts
   - Training and dietary preferences
   - Profile photograph
   - Starting front / side / back photographs
   - Progress front / side / back photographs
   - Coach sharing permission

   PREMIUM FINISH
   - Orange / black / white / silver
   - Compact responsive layout
   - Premium Coach Chat card and button

   IMPORTANT
   - Preserves Fuel and Recovery cloud fields
   - Never replaces View Client
   - Never intercepts Coach Hub navigation
   - Never changes program builder
   - Never changes chat message handling
   - No permanent page-wide observer
   ============================================================ */

(() => {
  "use strict";

  const BUILD = "104901";
  const FLAG = "MANA_EXT_CLIENT_104901";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const $ = id => document.getElementById(id);

  const SCREEN = "manaProfileScreen";
  const ROOT = "manaExtendedClient104901";
  const STATUS = "manaExtendedStatus104901";
  const STYLE = "manaExtendedStyle104901";

  const TABLE = "client_extended_profiles";
  const PHOTO_TABLE = "client_progress_photos";
  const BUCKET = "mana-client-private";

  let loading = false;
  let saving = false;
  let loadTicket = 0;

  const fields = [
    ["first_name", "First name", "text"],
    ["last_name", "Last name", "text"],
    ["dob", "Date of birth", "date"],
    ["phone", "Mobile phone", "tel"],
    ["country", "Country", "text"],
    ["state", "State / Province", "text"],
    ["city", "City / Suburb", "text"],
    ["postcode", "Postcode", "text"],
    ["emergency_name", "Emergency contact", "text"],
    ["emergency_phone", "Emergency phone", "tel"],
    ["target_weight", "Target weight (kg)", "number"],
    ["injuries", "Injuries / limitations", "textarea"],
    [
      "training_preferences",
      "Training preferences",
      "textarea"
    ],
    [
      "dietary_preferences",
      "Dietary preferences",
      "textarea"
    ]
  ];

  const photoTypes = [
    ["avatar", "avatar", "avatar"],
    ["baseline-front", "baseline", "front"],
    ["baseline-side", "baseline", "side"],
    ["baseline-back", "baseline", "back"],
    ["progress-front", "progress", "front"],
    ["progress-side", "progress", "side"],
    ["progress-back", "progress", "back"]
  ];

  const escapeHTML = value =>
    String(value ?? "").replace(
      /[&<>"']/g,
      char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[char]
    );

  function status(message, error = false) {
    const element = $(STATUS);

    if (!element) return;

    element.textContent = message;
    element.dataset.error = error ? "1" : "0";
  }

  async function connection() {
    if (
      typeof window.supabaseClient !== "function"
    ) {
      throw Error("Mana cloud connection unavailable");
    }

    const client = await window.supabaseClient();

    const { data, error } =
      await client.auth.getUser();

    if (error || !data?.user) {
      throw Error("Please sign in to save your profile");
    }

    return {
      client,
      user: data.user
    };
  }

  /* ============================================================
     PREMIUM STYLES
     ============================================================ */

  function installStyles() {
    if ($(STYLE)) return;

    const sheet = document.createElement("style");

    sheet.id = STYLE;

    sheet.textContent = `

      #${ROOT} {
        color: #FFFFFF;
        width: 100%;
        box-sizing: border-box;
        margin: 14px 0;
      }

      #${ROOT} * {
        box-sizing: border-box;
      }

      #${ROOT} .me-card {
        background: #15171B;
        border: 1px solid #4C5560;
        border-radius: 16px;
        padding: 15px;
        margin: 12px 0;
      }

      #${ROOT} .me-kicker {
        color: #FF7927;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: .1em;
        text-transform: uppercase;
      }

      #${ROOT} h3 {
        color: white;
        font-size: 18px;
        margin: 7px 0 12px;
      }

      #${ROOT} .me-grid {
        display: grid;
        grid-template-columns:
          repeat(2,minmax(0,1fr));
        gap: 11px;
      }

      #${ROOT} .me-field {
        min-width: 0;
      }

      #${ROOT} .me-field label {
        display: block;
        font-size: 12px;
        font-weight: 650;
        color: #C1C6CE;
        margin-bottom: 6px;
      }

      #${ROOT} .me-field input,
      #${ROOT} .me-field textarea {
        display: block;
        width: 100%;
        min-width: 0;
        min-height: 44px;
        margin: 0;
        padding: 10px 12px;
        background: #0E1013;
        color: white;
        border: 1px solid #4D5660;
        border-radius: 10px;
        font: 14px system-ui,sans-serif;
        outline-offset: 2px;
      }

      #${ROOT} .me-field input:focus,
      #${ROOT} .me-field textarea:focus {
        border-color: #FF7927;
        outline: 1px solid #FF7927;
      }

      #${ROOT} .me-field textarea {
        min-height: 75px;
        resize: vertical;
      }

      #${ROOT} .me-field input[readonly] {
        color: #B9C1CB;
        opacity: 1;
      }

      #${ROOT} .me-note {
        color: #AFB8C3;
        font-size: 12px;
        line-height: 1.55;
        margin: 9px 0;
      }

      #${ROOT} .me-divider {
        height: 1px;
        background: #363E48;
        margin: 17px 0;
      }

      #${ROOT} .me-avatar-row {
        display: flex;
        align-items: center;
        gap: 15px;
        margin: 10px 0 15px;
        flex-wrap: wrap;
      }

      #${ROOT} .me-avatar {
        width: 82px;
        height: 82px;
        object-fit: cover;
        border: 1px solid #FF7927;
        border-radius: 14px;
        background: #0E1013;
      }

      #${ROOT} .me-avatar-empty {
        width: 82px;
        height: 82px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px dashed #FF7927;
        border-radius: 14px;
        color: #FF7927;
        font-size: 23px;
        font-weight: 850;
      }

      #${ROOT} .me-photo-grid {
        display: grid;
        grid-template-columns:
          repeat(3,minmax(0,1fr));
        gap: 9px;
      }

      #${ROOT} .me-photo-card {
        background: #101215;
        border: 1px solid #424A55;
        border-radius: 11px;
        padding: 8px;
        min-width: 0;
      }

      #${ROOT} .me-photo-preview {
        width: 100%;
        aspect-ratio: 3 / 4;
        max-height: 200px;
        border: 1px dashed #59616C;
        border-radius: 8px;
        overflow: hidden;
        background: #0B0D10;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #99A3AF;
        font-size: 11px;
        margin-bottom: 9px;
      }

      #${ROOT} .me-photo-preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      #${ROOT} .me-photo-card strong {
        display: block;
        font-size: 12px;
        margin-bottom: 8px;
      }

      #${ROOT} .me-photo-card input {
        width: 100%;
        max-width: 100%;
        font-size: 11px;
        color: #C1C6CE;
      }

      #${ROOT} .me-consent {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        margin: 15px 0;
        color: white;
        font-size: 12px;
        line-height: 1.55;
      }

      #${ROOT} .me-consent input {
        width: 19px;
        height: 19px;
        flex: 0 0 19px;
        accent-color: #FF7927;
        margin-top: 2px;
      }

      #${ROOT} .me-status {
        font-size: 12px;
        line-height: 1.5;
        color: #C1C6CE;
        min-height: 18px;
      }

      #${ROOT} .me-status[data-error="1"] {
        color: #FF9D8C;
      }

      /* PREMIUM COACH CHAT */

      #coachClientDetailView
      .mana-premium-coach-chat {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
        padding: 16px !important;
        background: #15171B !important;
        border: 1px solid #4C5560 !important;
        border-radius: 16px !important;
        margin: 12px 0 !important;
        box-shadow: none !important;
      }

      #coachClientDetailView
      .mana-premium-coach-chat h3,
      #coachClientDetailView
      .mana-premium-coach-chat h4 {
        font-family: inherit !important;
        color: white !important;
        font-size: 17px !important;
        font-weight: 850 !important;
        margin: 0 0 4px !important;
      }

      #coachClientDetailView
      .mana-premium-coach-chat p {
        color: #C1C6CE !important;
        font-size: 12px !important;
        line-height: 1.5 !important;
        margin: 0 0 9px !important;
      }

      #coachClientDetailView
      .mana-premium-coach-chat button {
        background: #15171B !important;
        color: #FF7927 !important;
        border: 1px solid #FF7927 !important;
        border-radius: 10px !important;
        padding: 12px 16px !important;
        min-height: 42px !important;
        font: 850 12px system-ui,sans-serif !important;
        letter-spacing: .02em;
        cursor: pointer;
        width: fit-content;
        max-width: 100%;
      }

      #coachClientDetailView
      .mana-premium-coach-chat button:hover {
        background: #24170F !important;
      }

      /* GOLD TO ORANGE — REQUEST CARD ONLY */

      #coachClientDetailView
      #manaV1017CoachRequest {
        border-color: #FF7927 !important;
        background: #15171B !important;
      }

      #coachClientDetailView
      #manaV1017CoachRequest
      .m1017-pill {
        border-color: #FF7927 !important;
        color: #FF7927 !important;
      }

      #coachClientDetailView
      #manaV1017CoachRequest
      .m1017-ready {
        border-color: #FF7927 !important;
        color: #FF7927 !important;
      }

      #coachClientDetailView
      #manaV1017CoachRequest
      .m1017-stat strong {
        color: #FF7927 !important;
      }

      #coachClientDetailView
      #manaV1017CoachRequest
      button {
        border-color: #FF7927 !important;
        color: #FF7927 !important;
        background: #171A1E !important;
        border-radius: 10px !important;
      }

      @media (max-width: 600px) {
        #${ROOT} .me-grid {
          grid-template-columns: 1fr;
        }

        #${ROOT} .me-card {
          padding: 12px;
        }

        #${ROOT} .me-photo-grid {
          gap: 5px;
        }

        #${ROOT} .me-photo-card {
          padding: 5px;
        }

        #${ROOT} .me-photo-preview {
          max-height: 160px;
        }
      }
    `;

    document.head.appendChild(sheet);
  }

  /* ============================================================
     FORM FIELDS
     ============================================================ */

  function fieldHTML(entry) {
    const [key, label, type] = entry;
    const id = "me-" + key;

    return `
      <div class="me-field">
        <label for="${id}">
          ${escapeHTML(label)}
        </label>

        ${
          type === "textarea"
            ? `
              <textarea
                id="${id}"
                rows="3"
              ></textarea>
            `
            : `
              <input
                id="${id}"
                type="${type}"
                ${
                  type === "number"
                    ? 'min="0" step="0.1"'
                    : ""
                }
              >
            `
        }
      </div>
    `;
  }

  function photoHTML(key, label) {
    return `
      <div class="me-photo-card">
        <strong>${escapeHTML(label)}</strong>

        <div
          class="me-photo-preview"
          id="me-preview-${key}"
        >
          No photo
        </div>

        <input
          id="me-file-${key}"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-label="Upload ${escapeHTML(label)}"
        >
      </div>
    `;
  }

  /* ============================================================
     MOUNT CLIENT PROFILE ONLY

     Do not add anything to Coach Hub here.
     ============================================================ */

  function mount() {
    const screen = $(SCREEN);
    if (!screen) return false;

    if ($(ROOT)) return true;

    const node = document.createElement("div");
    node.id = ROOT;

    node.innerHTML = `
      <section class="me-card">
        <div class="me-kicker">
          PERSONAL PROFILE
        </div>

        <h3>Contact & Personal Details</h3>

        <div class="me-avatar-row">
          <div
            id="me-preview-avatar"
            class="me-avatar-empty"
          >
            +
          </div>

          <div class="me-field">
            <label for="me-file-avatar">
              Profile photo
            </label>

            <input
              id="me-file-avatar"
              type="file"
              accept="image/jpeg,image/png,image/webp"
            >

            <p class="me-note">
              Optional profile photograph
            </p>
          </div>
        </div>

        <div class="me-grid">
          ${fields.map(fieldHTML).join("")}
        </div>

        <div class="me-divider"></div>

        <div class="me-field">
          <label for="me-account-email">
            Verified account email
          </label>

          <input
            id="me-account-email"
            type="email"
            readonly
          >
        </div>
      </section>

      <section class="me-card">
        <div class="me-kicker">
          BODY TRANSFORMATION
        </div>

        <h3>Starting Photos — Day 1</h3>

        <div class="me-photo-grid">
          ${photoHTML("baseline-front","Front")}
          ${photoHTML("baseline-side","Side")}
          ${photoHTML("baseline-back","Back")}
        </div>

        <div class="me-divider"></div>

        <h3>Progress Check-in Photos</h3>

        <div class="me-photo-grid">
          ${photoHTML("progress-front","Front")}
          ${photoHTML("progress-side","Side")}
          ${photoHTML("progress-back","Back")}
        </div>

        <p class="me-note">
          Progress photos are optional and private.
          Uploading a new photo adds a check-in
          rather than deleting previous photographs.
        </p>

        <div class="me-divider"></div>

        <label class="me-consent">
          <input
            id="me-share-coach"
            type="checkbox"
          >

          <span>
            I agree to share my profile information
            and progress photographs with my assigned
            coach. I can withdraw permission by
            unchecking this box and saving.
          </span>
        </label>

        <p
          id="${STATUS}"
          class="me-status"
          role="status"
          aria-live="polite"
        ></p>
      </section>
    `;

    const saveButton = $("manaProfileSave");

    if (saveButton?.parentNode) {
      saveButton.parentNode.insertBefore(
        node,
        saveButton
      );
    } else {
      const shell = screen.querySelector(
        ".mana-profile-shell"
      );

      if (!shell) return false;

      shell.appendChild(node);
    }

    /*
     Use the existing Save Profile button.
     This listener does not prevent the
     original Profile or Fuel save.
    */

    if (saveButton) {
      saveButton.addEventListener(
        "click",
        () => {
          void saveExtra();
        }
      );
    }

    /*
     Preview newly selected photographs
     locally before they are uploaded.
    */

    node.addEventListener(
      "change",
      event => {
        const input = event.target;

        if (
          !(input instanceof HTMLInputElement) ||
          input.type !== "file" ||
          !input.files?.[0]
        ) {
          return;
        }

        const key = input.id.replace(
          "me-file-",
          ""
        );

        if (
          !photoTypes.some(
            entry => entry[0] === key
          )
        ) {
          return;
        }

        previewFile(key, input.files[0]);
      }
    );

    return true;
  }

  function previewFile(key, file) {
    const holder = $("me-preview-" + key);

    if (!holder) return;

    const url = URL.createObjectURL(file);

    const image = document.createElement("img");

    image.alt = key.replace("-", " ");
    image.src = url;

    image.addEventListener(
      "load",
      () => URL.revokeObjectURL(url),
      { once: true }
    );

    holder.replaceChildren(image);
  }

  function previewURL(key, url) {
    const holder = $("me-preview-" + key);

    if (!holder || !url) return;

    const image = document.createElement("img");

    image.src = url;
    image.alt = key.replace("-", " ");

    holder.replaceChildren(image);
  }

  /* ============================================================
     LOAD CLIENT INFORMATION

     Only the authenticated client's data.
     ============================================================ */

  async function loadExtra() {
    if (loading) return;

    if (!mount()) return;

    loading = true;
    const ticket = ++loadTicket;

    try {
      const { client, user } =
        await connection();

      const email = $("me-account-email");

      if (email) {
        email.value = user.email || "";
      }

      const { data, error } =
        await client
          .from(TABLE)
          .select("details,share_with_coach")
          .eq("user_id", user.id)
          .maybeSingle();

      if (error) throw error;
      if (ticket !== loadTicket) return;

      const details = data?.details || {};

      fields.forEach(([key]) => {
        const input = $("me-" + key);

        if (input) {
          input.value =
            details[key] ?? "";
        }
      });

      if (
        !details.first_name &&
        !details.last_name
      ) {
        const name = (
          $("manaProfileName")?.value || ""
        ).trim();

        const words = name.split(/\s+/);

        const first = $("me-first_name");
        const last = $("me-last_name");

        if (first) {
          first.value = words.shift() || "";
        }

        if (last) {
          last.value = words.join(" ");
        }
      }

      const consent = $("me-share-coach");

      if (consent) {
        consent.checked =
          !!data?.share_with_coach;
      }

      const photos = await client
        .from(PHOTO_TABLE)
        .select(
          "phase,angle,storage_path,created_at"
        )
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false
        })
        .limit(80);

      if (photos.error) {
        throw photos.error;
      }

      if (ticket !== loadTicket) return;

      for (const [key, phase, angle] of photoTypes) {
        const record = (photos.data || [])
          .find(photo =>
            photo.phase === phase &&
            photo.angle === angle
          );

        if (!record?.storage_path) continue;

        const { data: signed, error: signError } =
          await client.storage
            .from(BUCKET)
            .createSignedUrl(
              record.storage_path,
              600
            );

        if (
          !signError &&
          signed?.signedUrl &&
          ticket === loadTicket
        ) {
          previewURL(
            key,
            signed.signedUrl
          );
        }
      }

      status("");

    } catch (error) {
      status(
        "Could not load additional details: " +
        (error.message || error),
        true
      );
    } finally {
      loading = false;
    }
  }

  /* ============================================================
     UPLOAD PRIVATE PHOTOGRAPH
     ============================================================ */

  async function uploadPhoto(
    client,
    user,
    file,
    phase,
    angle
  ) {
    if (!file) return;

    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowed.includes(file.type)) {
      throw Error(
        "Only JPG, PNG or WebP photos are supported"
      );
    }

    if (file.size > 8 * 1024 * 1024) {
      throw Error(
        "Photographs must be under 8 MB each"
      );
    }

    const extension =
      file.type === "image/png"
        ? "png"
        : file.type === "image/webp"
          ? "webp"
          : "jpg";

    const path =
      user.id +
      "/" +
      crypto.randomUUID() +
      "." +
      extension;

    const uploaded = await client.storage
      .from(BUCKET)
      .upload(
        path,
        file,
        {
          contentType: file.type,
          upsert: false
        }
      );

    if (uploaded.error) {
      throw uploaded.error;
    }

    const saved = await client
      .from(PHOTO_TABLE)
      .insert({
        user_id: user.id,
        phase,
        angle,
        storage_path: path
      });

    if (saved.error) {
      await client.storage
        .from(BUCKET)
        .remove([path]);

      throw saved.error;
    }
  }

  /* ============================================================
     SAVE — MERGE EXISTING INFORMATION

     Critical:
     Keep calorie_target, protein_target,
     fuel_water_target_ml, recovery_score,
     recovery_date, fuel_goal, daily_activity
     and all other existing fields.

     Never replace details with contact-only
     data, and never automatically enable
     coach sharing.
     ============================================================ */

  async function saveExtra() {
    if (saving || !$(ROOT)) return;

    saving = true;

    status("Saving contact details and photos…");

    try {
      const { client, user } =
        await connection();

      const existing = await client
        .from(TABLE)
        .select("details,share_with_coach")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing.error) {
        throw existing.error;
      }

      const oldDetails =
        existing.data?.details || {};

      const details = {
        ...oldDetails
      };

      fields.forEach(([key]) => {
        const input = $("me-" + key);

        if (input) {
          details[key] = input.value.trim();
        }
      });

      details.contact_email =
        user.email || "";

      const consent =
        !!$("me-share-coach")?.checked;

      const save = await client
        .from(TABLE)
        .upsert(
          {
            user_id: user.id,
            details,
            share_with_coach: consent,
            updated_at:
              new Date().toISOString()
          },
          {
            onConflict: "user_id"
          }
        );

      if (save.error) {
        throw save.error;
      }

      for (
        const [key, phase, angle]
        of photoTypes
      ) {
        const input = $("me-file-" + key);

        const file = input?.files?.[0];

        if (!file) continue;

        await uploadPhoto(
          client,
          user,
          file,
          phase,
          angle
        );

        input.value = "";
      }

      status(
        "Contact details and photographs saved ✓"
      );

      /*
       Signal the existing Fuel sync so its
       calculated nutrition values can remain
       consistent with the updated profile.
      */

      window.dispatchEvent(
        new CustomEvent(
          "mana:extended-profile-saved"
        )
      );

    } catch (error) {
      console.warn(
        "[Mana Extended Profile]",
        error
      );

      status(
        "Save failed: " +
        (error.message || error),
        true
      );
    } finally {
      saving = false;
    }
  }

  /* ============================================================
     PREMIUM COACH CHAT PRESENTATION

     Existing chat buttons retain their
     original listeners and functionality.
     Only the surrounding card gets a class.
     ============================================================ */

  function tidyCoachChat() {
    const view = $("coachClientDetailView");

    if (
      !view ||
      view.classList.contains("hide")
    ) {
      return;
    }

    const button = Array.from(
      view.querySelectorAll("button")
    ).find(node =>
      /open client chat/i.test(
        node.textContent || ""
      )
    );

    if (!button) return;

    const card = button.closest(
      ".card, section, article"
    );

    if (
      !card ||
      card === view ||
      card.contains(
        $("manaCoachProfile104950")
      )
    ) {
      return;
    }

    card.classList.add(
      "mana-premium-coach-chat"
    );
  }

  /* ============================================================
     PROFILE OPENING

     Only wrap the client-side Profile
     opener. Never wrap View Client.
     ============================================================ */

  function connectProfileOpen() {
    const original =
      window.openManaProfile;

    if (typeof original !== "function") {
      return;
    }

    if (original.__mana104901) return;

    function openWithDetails(...args) {
      const result =
        original.apply(this, args);

      setTimeout(() => {
        void loadExtra();
      }, 100);

      return result;
    }

    openWithDetails.__mana104901 = true;

    window.openManaProfile =
      openWithDetails;
  }

  function init() {
    installStyles();

    connectProfileOpen();

    /*
     If Profile is already open when this
     script loads, restore details now.
    */

    if (
      $(SCREEN)?.classList.contains("open")
    ) {
      void loadExtra();
    }

    /*
     Client screen: a few bounded passes
     allow for asynchronous card rendering.
     No permanent document observer.
    */

    document.addEventListener(
      "click",
      event => {
        if (
          event.target.closest?.(
            ".client-open[data-client-id]"
          )
        ) {
          [200, 550, 1100].forEach(delay => {
            setTimeout(
              tidyCoachChat,
              delay
            );
          });
        }
      },
      false
    );

    tidyCoachChat();

    console.log(
      "[Mana Movement] Extended Client " +
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
