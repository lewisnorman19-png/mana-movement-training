
/* =====================================================
   MANA MOVEMENT TRAINING
   PROFILE CAMERA — RELIABLE MOUNT FIX
   BUILD 104995

   COMPLETE REPLACEMENT:
   mana_profile_camera_104994.js

   - Waits for the Profile photo field
   - Works with dynamically loaded Profiles
   - Take Photo: phone or laptop camera
   - Choose Photo: existing device files
   - Front/rear camera switching
   - Capture, review and retake
   - Uses existing Profile upload input
   - Saves through existing Save & Continue

   Does not modify Coach Hub, Supabase,
   training goals or nutrition calculations.
   ===================================================== */

(() => {
  "use strict";

  if (window.MANA_CAMERA_104995) return;
  window.MANA_CAMERA_104995 = true;

  const INPUT = "me-file-avatar";
  const CONTROLS = "manaCameraControls104995";
  const MODAL = "manaCameraModal104995";
  const STYLE = "manaCameraStyle104995";
  const PROFILE = "manaProfileScreen";

  const $ = id => document.getElementById(id);

  let stream = null;
  let facing = "user";
  let capturedFile = null;
  let photoURL = null;
  let mountObserver = null;
  let profileObserver = null;

  /* =====================================================
     STYLES
     ===================================================== */

  function styles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `
      #${PROFILE} #${INPUT} {
        display: none !important;
      }

      #${CONTROLS} {
        display: flex;
        flex-wrap: wrap;
        gap: 9px;
        margin: 10px 0;
        width: 100%;
      }

      #${CONTROLS} button {
        flex: 1 1 145px;
        min-height: 44px;
        padding: 11px 13px;
        border-radius: 10px;
        background: #15171B;
        border: 1px solid #FF7927;
        color: #FF7927;
        font: 800 12px system-ui, sans-serif;
        cursor: pointer;
      }

      #${CONTROLS} button:first-child {
        background: #FF7927;
        color: #101114;
      }

      #${MODAL} {
        position: fixed;
        inset: 0;
        z-index: 999999;
        padding: 14px;
        background: rgba(0,0,0,.95);
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
      }

      #${MODAL} .mana-camera-card {
        box-sizing: border-box;
        width: min(450px,100%);
        max-height: 94dvh;
        overflow-y: auto;
        padding: 16px;
        border: 1px solid #505862;
        border-radius: 16px;
        background: #15171B;
        color: white;
      }

      #${MODAL} h3 {
        font: 850 19px system-ui,sans-serif;
        color: white;
        margin: 0 0 13px;
      }

      #${MODAL} video,
      #${MODAL} #manaCameraCaptured104995 {
        width: 100%;
        max-height: 54dvh;
        aspect-ratio: 3/4;
        object-fit: cover;
        display: block;
        background: #08090B;
        border-radius: 11px;
      }

      #${MODAL} .mana-camera-actions {
        display: grid;
        grid-template-columns:
          repeat(2,minmax(0,1fr));
        gap: 9px;
        margin-top: 13px;
      }

      #${MODAL} button {
        border: 1px solid #5A626E;
        background: #191C20;
        color: white;
        border-radius: 10px;
        min-height: 44px;
        padding: 10px;
        font: 750 12px system-ui,sans-serif;
        cursor: pointer;
      }

      #${MODAL} button.primary {
        background: #FF7927;
        border-color: #FF7927;
        color: #101114;
        font-weight: 900;
      }

      #${MODAL} p {
        font: 12px/1.5 system-ui,sans-serif;
        color: #ADB7C2;
        margin: 12px 0 0;
      }

      #${MODAL} button:disabled {
        opacity: .45;
        cursor: not-allowed;
      }
    `;

    document.head.appendChild(style);
  }

  /* =====================================================
     CAMERA LIFECYCLE
     ===================================================== */

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      stream = null;
    }

    const video = $("manaCameraVideo104995");

    if (video) video.srcObject = null;
  }

  function clearCapturedURL() {
    if (photoURL) {
      URL.revokeObjectURL(photoURL);
      photoURL = null;
    }
  }

  function closeCamera() {
    stopCamera();
    clearCapturedURL();
    capturedFile = null;
    $(MODAL)?.remove();
  }

  async function startCamera() {
    const video = $("manaCameraVideo104995");
    const note = $("manaCameraNote104995");

    if (!video) return;

    stopCamera();

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera access is unavailable.");
      }

      const next = await navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: facing }
          }
        });

      if (!video.isConnected) {
        next.getTracks().forEach(track => track.stop());
        return;
      }

      stream = next;
      video.srcObject = next;
      await video.play();

      if (note) {
        note.textContent =
          "Position yourself in the frame.";
      }

    } catch (error) {
      if (note) {
        note.textContent =
          "Unable to open camera. Check camera " +
          "permissions or choose a photo from your device.";
      }

      console.warn(
        "[Mana Camera]",
        error
      );
    }
  }

  function setCaptureState(captured) {
    const video = $("manaCameraVideo104995");
    const image = $("manaCameraCaptured104995");

    if (!video || !image) return;

    video.style.display =
      captured ? "none" : "block";

    image.style.display =
      captured ? "block" : "none";

    $("manaCameraCapture104995").hidden = captured;
    $("manaCameraSwitch104995").hidden = captured;

    $("manaCameraRetake104995").hidden = !captured;
    $("manaCameraUse104995").hidden = !captured;
  }

  /* =====================================================
     CAPTURE PHOTO
     ===================================================== */

  async function capturePhoto() {
    const video = $("manaCameraVideo104995");

    if (
      !video ||
      !video.videoWidth ||
      !video.videoHeight
    ) return;

    const canvas = document.createElement("canvas");

    const scale = Math.min(
      1,
      1600 / Math.max(
        video.videoWidth,
        video.videoHeight
      )
    );

    canvas.width = Math.round(
      video.videoWidth * scale
    );

    canvas.height = Math.round(
      video.videoHeight * scale
    );

    const context = canvas.getContext("2d");

    if (!context) return;

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const blob = await new Promise(resolve => {
      canvas.toBlob(resolve, "image/jpeg", .88);
    });

    if (!blob) return;

    capturedFile = new File(
      [blob],
      "mana-profile-" + Date.now() + ".jpg",
      { type: "image/jpeg" }
    );

    clearCapturedURL();
    photoURL = URL.createObjectURL(blob);

    const image = $("manaCameraCaptured104995");

    if (!image) return;

    image.src = photoURL;

    stopCamera();
    setCaptureState(true);

    $("manaCameraNote104995").textContent =
      "Select Use Photo or Retake.";
  }

  function usePhoto() {
    const input = $(INPUT);

    if (!input || !capturedFile) return;

    try {
      const transfer = new DataTransfer();
      transfer.items.add(capturedFile);

      input.files = transfer.files;

      input.dispatchEvent(
        new Event("change", {
          bubbles: true
        })
      );

      closeCamera();

    } catch (error) {
      $("manaCameraNote104995").textContent =
        "Unable to attach photo. " +
        "Please choose a photo from your device.";

      console.warn("[Mana Camera]", error);
    }
  }

  /* =====================================================
     CAMERA MODAL
     ===================================================== */

  function openCamera() {
    if ($(MODAL)) return;

    facing = "user";
    capturedFile = null;

    const modal = document.createElement("div");
    modal.id = MODAL;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    modal.innerHTML = `
      <div class="mana-camera-card">
        <h3>Take Profile Photo</h3>

        <video
          id="manaCameraVideo104995"
          autoplay
          muted
          playsinline
        ></video>

        <img
          id="manaCameraCaptured104995"
          alt="Captured profile photo"
          style="display:none"
        >

        <div class="mana-camera-actions">
          <button type="button"
            id="manaCameraSwitch104995">
            Switch Camera
          </button>

          <button type="button"
            class="primary"
            id="manaCameraCapture104995">
            Capture Photo
          </button>

          <button type="button"
            id="manaCameraRetake104995"
            hidden>
            Retake
          </button>

          <button type="button"
            class="primary"
            id="manaCameraUse104995"
            hidden>
            Use Photo
          </button>

          <button type="button"
            id="manaCameraCancel104995">
            Cancel
          </button>
        </div>

        <p id="manaCameraNote104995">
          Allow access to your camera when prompted.
        </p>
      </div>
    `;

    document.body.appendChild(modal);

    $("manaCameraCancel104995")
      .addEventListener("click", closeCamera);

    $("manaCameraSwitch104995")
      .addEventListener("click", async () => {
        facing = facing === "user"
          ? "environment"
          : "user";

        await startCamera();
      });

    $("manaCameraCapture104995")
      .addEventListener("click", capturePhoto);

    $("manaCameraRetake104995")
      .addEventListener("click", async () => {
        capturedFile = null;
        clearCapturedURL();
        setCaptureState(false);
        await startCamera();
      });

    $("manaCameraUse104995")
      .addEventListener("click", usePhoto);

    void startCamera();
  }

  /* =====================================================
     RELIABLE DYNAMIC PROFILE MOUNT

     The Profile input is added AFTER
     the page initially loads.

     Watch until it exists, then install
     the buttons in its actual field.

     Reinstall only if that field is
     replaced by a Profile redraw.
     ===================================================== */

  function installButtons() {
    const input = $(INPUT);

    if (!input) return false;

    const field = input.closest(".me-field");

    if (!field) return false;

    const existing = $(CONTROLS);

    if (existing && existing.parentElement === field) {
      return true;
    }

    existing?.remove();

    const controls = document.createElement("div");
    controls.id = CONTROLS;

    const take = document.createElement("button");
    take.type = "button";
    take.textContent = "📷 Take Photo";

    const choose = document.createElement("button");
    choose.type = "button";
    choose.textContent = "Choose from Device";

    controls.append(take, choose);

    input.insertAdjacentElement(
      "beforebegin",
      controls
    );

    take.addEventListener("click", openCamera);

    choose.addEventListener("click", () => {
      input.click();
    });

    return true;
  }

  function watchProfile() {
    const profile = $(PROFILE);

    if (!profile) return false;

    if (!profileObserver) {
      profileObserver = new MutationObserver(() => {
        if ($(INPUT) && !$(CONTROLS)) {
          installButtons();
        }
      });

      profileObserver.observe(profile, {
        childList: true,
        subtree: true
      });
    }

    installButtons();
    return true;
  }

  function init() {
    styles();

    /*
     On first load, wait until the
     Profile screen has been created.
    */

    if (!watchProfile()) {
      mountObserver = new MutationObserver(() => {
        if (watchProfile()) {
          mountObserver.disconnect();
          mountObserver = null;
        }
      });

      mountObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    window.addEventListener("pageshow", () => {
      watchProfile();
      installButtons();
    });

    document.addEventListener(
      "visibilitychange",
      () => {
        if (!document.hidden) {
          installButtons();
        } else {
          stopCamera();
        }
      }
    );

    window.addEventListener(
      "pagehide",
      stopCamera
    );

    console.log(
      "[Mana Movement] Camera 104995 active"
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
