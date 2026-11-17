
/* ==========================================================
   MANA MOVEMENT TRAINING
   EXPANDED CLIENT PROFILE + COACH HUB
   BUILD 104900

   Personal and contact details
   Profile photograph
   Starting front / side / back photographs
   Progress check-in photographs
   Private Supabase cloud storage
   Coach Hub integration
   ========================================================== */

(() => {
  "use strict";

  if (window.MANA_EXT_PROFILE_104900) return;
  window.MANA_EXT_PROFILE_104900 = true;

  const $ = id => document.getElementById(id);

  const fields = [
    ["first_name", "First name"],
    ["last_name", "Last name"],
    ["dob", "Date of birth", "date"],
    ["phone", "Mobile phone", "tel"],
    ["country", "Country"],
    ["state", "State / Province"],
    ["city", "City / Suburb"],
    ["postcode", "Postcode"],
    ["emergency_name", "Emergency contact"],
    ["emergency_phone", "Emergency contact phone", "tel"],
    ["target_weight", "Target weight (kg)", "number"],
    ["injuries", "Injuries / physical limitations", "textarea"],
    ["training_preferences", "Training preferences", "textarea"],
    ["dietary_preferences", "Dietary preferences", "textarea"],
    ["water_target", "Daily water goal (litres)", "number"]
  ];

  let currentCoachClient = null;
  let isSaving = false;

  const bucket = "mana-client-private";

  const escapeHtml = value =>
    String(value ?? "").replace(
      /[&<>"']/g,
      ch => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[ch])
    );

  /* ==========================================================
     SUPABASE CONNECTION
     ========================================================== */

  async function getSession() {
    const client =
      typeof window.supabaseClient === "function"
        ? await window.supabaseClient()
        : null;

    if (!client) {
      throw new Error("Cloud connection not available");
    }

    const { data, error } =
      await client.auth.getUser();

    if (error || !data?.user) {
      throw new Error("Please sign in");
    }

    return {
      client,
      user: data.user
    };
  }

  /* ==========================================================
     PREMIUM PROFILE STYLING
     ========================================================== */

  function installStyle() {
    if ($("mx-ext-style")) return;

    const s = document.createElement("style");
    s.id = "mx-ext-style";

    s.textContent = `
      #manaProfileScreen .mx-card,
      #coachClientDetailView .mx-card {
        background: #15171b;
        border: 1px solid #555d66;
        border-radius: 18px;
        padding: 18px;
        margin: 16px 0;
        color: white;
      }

      #manaProfileScreen .mx-card h3,
      #coachClientDetailView .mx-card h3 {
        margin: 0 0 13px;
        color: white;
        font-size: 19px;
      }

      #manaProfileScreen .mx-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      #manaProfileScreen .mx-field {
        min-width: 0;
      }

      #manaProfileScreen .mx-field label {
        display: block;
        color: #c1c6ce;
        font-size: 13px;
        margin-bottom: 5px;
      }

      #manaProfileScreen .mx-field input,
      #manaProfileScreen .mx-field textarea {
        box-sizing: border-box;
        width: 100%;
        background: #0e1013;
        border: 1px solid #555d66;
        border-radius: 10px;
        color: #fff;
        padding: 10px;
        min-height: 46px;
        margin: 0;
        font-size: 15px;
      }

      #manaProfileScreen .mx-field textarea {
        min-height: 80px;
      }

      #manaProfileScreen .mx-photos,
      #coachClientDetailView .mx-photos {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
      }

      #manaProfileScreen .mx-photos input {
        width: 100%;
        font-size: 12px;
      }

      #manaProfileScreen .mx-photos img,
      #coachClientDetailView .mx-photos img {
        width: 100%;
        aspect-ratio: 3/4;
        object-fit: cover;
        border: 1px solid #555d66;
        border-radius: 9px;
        background: #0e1013;
      }

      #manaProfileScreen .mx-note,
      #coachClientDetailView .mx-note {
        color: #c1c6ce;
        font-size: 12px;
        line-height: 1.5;
      }

      #coachClientDetailView .mx-line {
        display: grid;
        grid-template-columns: 36% 1fr;
        gap: 8px;
        padding: 8px 0;
        border-bottom: 1px solid #343941;
        overflow-wrap: anywhere;
        font-size: 13px;
      }

      #coachClientDetailView .mx-line span {
        color: #c1c6ce;
      }

      @media (max-width: 420px) {
        #manaProfileScreen .mx-grid {
          grid-template-columns: 1fr;
        }
      }
    `;

    document.head.appendChild(s);
  }

  /* ==========================================================
     PROGRESS PHOTOGRAPH INPUTS
     ========================================================== */

  function photoInputs(phase) {
    return `
      <h3 style="margin-top:16px">
        ${
          phase === "baseline"
            ? "Starting Photos — Day 1"
            : "Progress Check-in Photos"
        }
      </h3>

      <div class="mx-photos">
        ${
          ["front", "side", "back"].map(angle => `
            <div>
              <strong>
                ${angle[0].toUpperCase() + angle.slice(1)}
              </strong>

              <img
                id="mx-photo-${phase}-${angle}"
                alt="${angle} ${phase} photograph"
              >

              <input
                id="mx-file-${phase}-${angle}"
                type="file"
                accept="image/jpeg,image/png,image/webp"
              >
            </div>
          `).join("")
        }
      </div>
    `;
  }

  /* ==========================================================
     CLIENT PROFILE SCREEN
     ========================================================== */

  function mountClient() {
    const screen = $("manaProfileScreen");

    if (!screen || $("mx-ext-profile")) return;

    installStyle();

    const node = document.createElement("div");
    node.id = "mx-ext-profile";

    const input = ([key, label, type]) => `
      <div class="mx-field">
        <label for="mx-${key}">
          ${label}
        </label>

        ${
          type === "textarea"
            ? `<textarea id="mx-${key}"></textarea>`
            : `
              <input
                id="mx-${key}"
                type="${type || "text"}"
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

    node.innerHTML = `
      <section class="mx-card">

        <h3>Photo & Contact Details</h3>

        <div class="mx-field">
          <label>Profile photo</label>

          <input
            id="mx-file-avatar"
            type="file"
            accept="image/jpeg,image/png,image/webp"
          >
        </div>

        <img
          id="mx-photo-avatar"
          alt="Profile photo"
          style="
            width:84px;
            height:84px;
            object-fit:cover;
            border:2px solid #ff7927;
            border-radius:50%;
            background:#0e1013;
          "
        >

        <div class="mx-grid" style="margin-top:14px">
          ${fields.map(input).join("")}
        </div>

        <div class="mx-field" style="margin-top:12px">
          <label>Account email (verified login)</label>

          <input
            id="mx-email"
            type="email"
            readonly
          >
        </div>

      </section>

      <section class="mx-card">

        <h3>Progress Photos</h3>

        <p class="mx-note">
          Optional private full-body photos.
          Use consistent lighting and clothing.
          You do not have to upload photos
          to use Mana Movement.
        </p>

        ${photoInputs("baseline")}

        ${photoInputs("progress")}

        <label
          style="
            display:flex;
            gap:9px;
            align-items:flex-start;
            font-size:13px;
            margin:16px 0;
          "
        >
          <input
            type="checkbox"
            id="mx-coach-consent"
            style="
              width:20px;
              height:20px;
              flex:none;
              accent-color:#ff7927;
            "
          >

          I agree to share this information and
          my photos with my assigned coach.
          I can withdraw permission by
          unchecking this box and saving.
        </label>

        <p
          class="mx-note"
          id="mx-status"
          role="status"
        ></p>

      </section>
    `;

    const save = $("manaProfileSave");

    if (save) {
      save.parentNode.insertBefore(node, save);

      save.addEventListener(
        "click",
        () => setTimeout(saveExtra, 90)
      );
    } else {
      screen.querySelector(".mana-profile-shell")
        ?.appendChild(node);
    }
  }

  /* ==========================================================
     LOAD CLIENT PROFILE FROM SUPABASE
     ========================================================== */

  async function loadClient() {
    mountClient();

    const { client, user } = await getSession();

    $("mx-email").value = user.email || "";

    const { data, error } =
      await client
        .from("client_extended_profiles")
        .select("details,share_with_coach")
        .eq("user_id", user.id)
        .maybeSingle();

    if (error) throw error;

    const details = data?.details || {};

    fields.forEach(([key]) => {
      $("mx-" + key).value = details[key] ?? "";
    });

    if (
      !details.first_name &&
      !details.last_name
    ) {
      const words =
        ($("manaProfileName")?.value || "")
          .trim()
          .split(/\s+/);

      $("mx-first_name").value =
        words.shift() || "";

      $("mx-last_name").value =
        words.join(" ");
    }

    $("mx-coach-consent").checked =
      !!data?.share_with_coach;

    const photos =
      await client
        .from("client_progress_photos")
        .select("phase,angle,storage_path")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false
        })
        .limit(80);

    if (photos.error) {
      throw photos.error;
    }

    for (
      const id of [
        "avatar",
        "baseline-front",
        "baseline-side",
        "baseline-back"
      ]
    ) {
      const row =
        photos.data?.find(p =>
          id === "avatar"
            ? p.angle === "avatar"
            : p.phase === "baseline" &&
              p.angle === id.split("-")[1]
        );

      if (!row) continue;

      const { data: signed } =
        await client.storage
          .from(bucket)
          .createSignedUrl(
            row.storage_path,
            600
          );

      if (
        signed?.signedUrl &&
        $("mx-photo-" + id)
      ) {
        $("mx-photo-" + id).src =
          signed.signedUrl;
      }
    }
  }

  /* ==========================================================
     SECURE PHOTO UPLOAD
     ========================================================== */

  async function upload(
    client,
    user,
    file,
    phase,
    angle
  ) {
    if (!file) return;

    const accepted = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!accepted.includes(file.type)) {
      throw new Error(
        "Only JPG, PNG or WebP photographs are supported"
      );
    }

    if (file.size > 8 * 1024 * 1024) {
      throw new Error(
        "Each photograph must be under 8 MB"
      );
    }

    const ext =
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
      ext;

    const sent =
      await client.storage
        .from(bucket)
        .upload(
          path,
          file,
          {
            contentType: file.type,
            upsert: false
          }
        );

    if (sent.error) {
      throw sent.error;
    }

    const saved =
      await client
        .from("client_progress_photos")
        .insert({
          user_id: user.id,
          phase,
          angle,
          storage_path: path
        });

    if (saved.error) {
      await client.storage
        .from(bucket)
        .remove([path]);

      throw saved.error;
    }
  }

  /* ==========================================================
     SAVE EXTENDED PROFILE
     ========================================================== */

  async function saveExtra() {
    if (
      isSaving ||
      !$("mx-ext-profile")
    ) {
      return;
    }

    isSaving = true;

    $("mx-status").textContent =
      "Saving details to cloud…";

    try {
      const { client, user } =
        await getSession();

      const details = {};

      fields.forEach(([key]) => {
        details[key] =
          $("mx-" + key).value.trim();
      });

      details.contact_email =
        user.email || "";

      const profile =
        await client
          .from("client_extended_profiles")
          .upsert(
            {
              user_id: user.id,
              details,
              share_with_coach:
                $("mx-coach-consent").checked,
              updated_at:
                new Date().toISOString()
            },
            {
              onConflict: "user_id"
            }
          );

      if (profile.error) {
        throw profile.error;
      }

      const files = [
        "avatar",
        "baseline-front",
        "baseline-side",
        "baseline-back",
        "progress-front",
        "progress-side",
        "progress-back"
      ];

      for (const key of files) {
        const input =
          $("mx-file-" + key);

        if (!input?.files?.[0]) {
          continue;
        }

        const [phase, angle] =
          key === "avatar"
            ? ["progress", "avatar"]
            : key.split("-");

        await upload(
          client,
          user,
          input.files[0],
          phase,
          angle
        );

        input.value = "";
      }

      $("mx-status").textContent =
        "Additional details and photographs saved ✓";

    } catch (err) {
      console.warn(
        "Extended profile save",
        err
      );

      $("mx-status").textContent =
        "Could not save additional details: " +
        (err.message || err);

    } finally {
      isSaving = false;
    }
  }

  /* ==========================================================
     COACH HUB — FULL CLIENT INFORMATION
     ========================================================== */

  async function loadCoach() {
    const view =
      $("coachClientDetailView");

    if (
      !view ||
      view.classList.contains("hide")
    ) {
      return;
    }

    const id =
      typeof selectedCoachClient !== "undefined"
        ? selectedCoachClient?.userId
        : currentCoachClient;

    if (!id) return;

    currentCoachClient = id;

    let card =
      $("mx-coach-detail");

    if (!card) {
      card =
        document.createElement("div");

      card.id =
        "mx-coach-detail";

      card.className =
        "mx-card";

      view.appendChild(card);
    }

    card.innerHTML = `
      <h3>
        Full Client Profile & Progress Photos
      </h3>

      <p class="mx-note">
        Loading…
      </p>
    `;

    try {
      const { client } =
        await getSession();

      const { data, error } =
        await client
          .from("client_extended_profiles")
          .select("details")
          .eq("user_id", id)
          .maybeSingle();

      if (error) throw error;

      if (!data) {
        card.innerHTML = `
          <h3>
            Full Client Profile & Progress Photos
          </h3>

          <p class="mx-note">
            No shared profile.
            The client must give consent
            and be assigned to your
            coaching account.
          </p>
        `;

        return;
      }

      const details =
        data.details || {};

      card.innerHTML = `
        <h3>
          Contact & Coaching Information
        </h3>

        <div class="mx-line">
          <span>Email</span>
          <strong>
            ${escapeHtml(
              details.contact_email || "—"
            )}
          </strong>
        </div>

        ${
          fields.map(([key, label]) => `
            <div class="mx-line">
              <span>
                ${escapeHtml(label)}
              </span>

              <strong>
                ${escapeHtml(
                  details[key] || "—"
                )}
              </strong>
            </div>
          `).join("")
        }

        <h3 style="margin-top:20px">
          Starting & Check-in Photographs
        </h3>

        <div
          class="mx-photos"
          id="mx-coach-photo-grid"
        ></div>
      `;

      const photos =
        await client
          .from("client_progress_photos")
          .select(
            "phase,angle,storage_path,captured_on"
          )
          .eq("user_id", id)
          .order(
            "created_at",
            { ascending: false }
          )
          .limit(80);

      if (photos.error) {
        throw photos.error;
      }

      for (
        const photo of photos.data || []
      ) {
        if (
          typeof selectedCoachClient !== "undefined" &&
          selectedCoachClient?.userId !== id
        ) {
          return;
        }

        const { data: signed } =
          await client.storage
            .from(bucket)
            .createSignedUrl(
              photo.storage_path,
              600
            );

        const item =
          document.createElement("div");

        item.className =
          "mx-note";

        item.textContent =
          photo.phase +
          " · " +
          photo.angle +
          " · " +
          photo.captured_on;

        if (signed?.signedUrl) {
          const img =
            document.createElement("img");

          img.src =
            signed.signedUrl;

          img.alt =
            photo.phase +
            " " +
            photo.angle +
            " view";

          item.prepend(img);
        }

        $("mx-coach-photo-grid")
          ?.appendChild(item);
      }

    } catch (err) {
      card.innerHTML = `
        <h3>
          Full Client Profile & Progress Photos
        </h3>

        <p class="mx-note">
          Unavailable:
          ${escapeHtml(err.message || err)}
        </p>
      `;
    }
  }

  /* ==========================================================
     CONNECT EXISTING SCREENS
     ========================================================== */

  function init() {
    installStyle();

    const oldOpen =
      window.openManaProfile;

    if (
      typeof oldOpen === "function"
    ) {
      window.openManaProfile =
        function (...args) {
          const result =
            oldOpen.apply(this, args);

          setTimeout(
            () => loadClient()
              .catch(err => {
                if ($("mx-status")) {
                  $("mx-status").textContent =
                    "Unable to load extended profile: " +
                    err.message;
                }
              }),
            80
          );

          return result;
        };
    }

    document.addEventListener(
      "click",
      e => {
        const btn =
          e.target.closest?.(".client-open");

        if (btn) {
          currentCoachClient =
            btn.dataset.clientId;

          setTimeout(
            loadCoach,
            200
          );
        }
      },
      true
    );

    if (
      typeof window.openCoachClientDetail ===
      "function"
    ) {
      const oldCoachOpen =
        window.openCoachClientDetail;

      window.openCoachClientDetail =
        function (id, ...args) {
          currentCoachClient = id;

          const result =
            oldCoachOpen.call(
              this,
              id,
              ...args
            );

          setTimeout(
            loadCoach,
            200
          );

          return result;
        };
    }
  }

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }

})();
