
/* =====================================================
   MANA MOVEMENT TRAINING
   PROFILE CAMERA — COMPACT PHOTO FIX
   BUILD 104996

   - Small 96x96 profile photograph
   - Take Photo using phone or laptop camera
   - Choose from Device
   - Capture, Retake and Use Photo
   - Existing Supabase upload and Save Profile
   - Existing Profile fields remain unchanged
   ===================================================== */

(() => {
  "use strict";

  if (window.MANA_CAMERA_104996) return;
  window.MANA_CAMERA_104996 = true;

  const INPUT = "me-file-avatar";
  const PREVIEW = "me-preview-avatar";
  const CONTROLS = "manaCameraControls104996";
  const MODAL = "manaCameraModal104996";
  const STYLE = "manaCameraStyle104996";
  const PROFILE = "manaProfileScreen";

  const $ = id => document.getElementById(id);

  let stream = null;
  let facing = "user";
  let capturedFile = null;
  let capturedURL = null;
  let mountObserver = null;
  let profileObserver = null;

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `
      /* SMALL PROFILE PHOTOGRAPH */

      #${PROFILE} #${PREVIEW} {
        width: 96px !important;
        height: 96px !important;
        min-width: 96px !important;
        max-width: 96px !important;
        min-height: 96px !important;
        max-height: 96px !important;
        flex: 0 0 96px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        overflow: hidden !important;
        border: 1px solid #FF7927 !important;
        border-radius: 12px !important;
        background: #0D0F12 !important;
        color: #FF7927 !important;
        box-sizing: border-box !important;
      }

      #${PROFILE} #${PREVIEW} img {
        display: block !important;
        width: 100% !important;
        height: 100% !important;
        max-width: 100% !important;
        max-height: 100% !important;
        object-fit: cover !important;
        border-radius: 10px !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      #${PROFILE} .me-avatar-row {
        display: flex !important;
        align-items: center !important;
        flex-direction: row !important;
        gap: 14px !important;
        width: 100% !important;
      }

      #${PROFILE} .me-avatar-row > .me-field {
        flex: 1 1 0 !important;
        min-width: 0 !important;
      }

      #${PROFILE} #${INPUT} {
        display: none !important;
      }

      #${CONTROLS} {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        width: 100%;
        margin: 8px 0;
      }

      #${CONTROLS} button {
        flex: 1 1 130px;
        min-height: 42px;
        border: 1px solid #FF7927;
        border-radius: 10px;
        padding: 10px;
        color: #FF7927;
        background: #13161A;
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
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 14px;
        background: rgba(0,0,0,.95);
        box-sizing: border-box;
      }

      #${MODAL} .camera-card {
        width: min(440px,100%);
        max-height: 95dvh;
        overflow-y: auto;
        padding: 16px;
        border: 1px solid #505862;
        border-radius: 16px;
        background: #15171B;
        color: white;
        box-sizing: border-box;
      }

      #${MODAL} h3 {
        color: white;
        font: 850 19px system-ui,sans-serif;
        margin: 0 0 12px;
      }

      #${MODAL} video,
      #${MODAL} .captured-image {
        display: block;
        width: 100%;
        max-height: 55dvh;
        aspect-ratio: 3 / 4;
        object-fit: cover;
        background: #08090B;
        border-radius: 12px;
      }

      #${MODAL} .camera-actions {
        display: grid;
        grid-template-columns: repeat(2,minmax(0,1fr));
        gap: 9px;
        margin-top: 13px;
      }

      #${MODAL} button {
        min-height: 44px;
        padding: 10px;
        border: 1px solid #59616C;
        border-radius: 10px;
        background: #191C20;
        color: white;
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
        color: #B0BAC6;
        font: 12px/1.5 system-ui,sans-serif;
        margin: 12px 0 0;
      }

      @media(max-width:600px) {
        #${PROFILE} #${PREVIEW} {
          width: 80px !important;
          height: 80px !important;
          min-width: 80px !important;
          max-width: 80px !important;
          min-height: 80px !important;
          max-height: 80px !important;
          flex-basis: 80px !important;
        }

        #${CONTROLS} button {
          flex-basis: 110px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      stream = null;
    }

    const video = $("manaCameraVideo104996");

    if (video) video.srcObject = null;
  }

  function clearCapturedURL() {
    if (capturedURL) {
      URL.revokeObjectURL(capturedURL);
      capturedURL = null;
    }
  }

  function closeCamera() {
    stopCamera();
    clearCapturedURL();
    capturedFile = null;
    $(MODAL)?.remove();
  }

  async function startCamera() {
    const video = $("manaCameraVideo104996");
    const note = $("manaCameraNote104996");

    if (!video) return;

    stopCamera();

    try {
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
          "Camera unavailable. Check permissions " +
          "or choose a photo from your device.";
      }

      console.warn("[Mana Camera]", error);
    }
  }

  function showCaptured(captured) {
    const video = $("manaCameraVideo104996");
    const image = $("manaCameraCaptured104996");

    if (!video || !image) return;

    video.style.display =
      captured ? "none" : "block";

    image.style.display =
      captured ? "block" : "none";

    $("manaCameraCapture104996").style.display =
      captured ? "none" : "";

    $("manaCameraSwitch104996").style.display =
      captured ? "none" : "";

    $("manaCameraRetake104996").style.display =
      captured ? "" : "none";

    $("manaCameraUse104996").style.display =
      captured ? "" : "none";
  }

  async function capturePhoto() {
    const video = $("manaCameraVideo104996");

    if (
      !video ||
      !video.videoWidth ||
      !video.videoHeight
    ) return;

    const canvas = document.createElement("canvas");

    const scale = Math.min(
      1,
      1200 / Math.max(
        video.videoWidth,
        video.videoHeight
      )
    );

    canvas.width =
      Math.round(video.videoWidth * scale);

    canvas.height =
      Math.round(video.videoHeight * scale);

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
      canvas.toBlob(resolve, "image/jpeg", .85);
    });

    if (!blob) return;

    capturedFile = new File(
      [blob],
      "mana-avatar-" + Date.now() + ".jpg",
      { type: "image/jpeg" }
    );

    clearCapturedURL();

    capturedURL = URL.createObjectURL(blob);

    const image = $("manaCameraCaptured104996");
    if (!image) return;

    image.src = capturedURL;

    stopCamera();
    showCaptured(true);

    $("manaCameraNote104996").textContent =
      "Choose Use Photo or Retake.";
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
      console.warn("[Mana Camera]", error);

      const note = $("manaCameraNote104996");

      if (note) {
        note.textContent =
          "Unable to attach photograph.";
      }
    }
  }

  function openCamera() {
    if ($(MODAL)) return;

    facing = "user";
    capturedFile = null;

    const modal = document.createElement("div");
    modal.id = MODAL;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    modal.innerHTML = `
      <div class="camera-card">
        <h3>Take Profile Photo</h3>

        <video
          id="manaCameraVideo104996"
          autoplay muted playsinline
        ></video>

        <img
          id="manaCameraCaptured104996"
          class="captured-image"
          alt="Captured photograph"
          style="display:none"
        >

        <div class="camera-actions">
          <button type="button"
            id="manaCameraSwitch104996">
            Switch Camera
          </button>

          <button type="button"
            id="manaCameraCapture104996"
            class="primary">
            Capture Photo
          </button>

          <button type="button"
            id="manaCameraRetake104996"
            style="display:none">
            Retake
          </button>

          <button type="button"
            id="manaCameraUse104996"
            class="primary"
            style="display:none">
            Use Photo
          </button>

          <button type="button"
            id="manaCameraCancel104996">
            Cancel
          </button>
        </div>

        <p id="manaCameraNote104996">
          Allow access to your camera.
        </p>
      </div>
    `;

    document.body.appendChild(modal);

    $("manaCameraCancel104996")
      .addEventListener("click", closeCamera);

    $("manaCameraSwitch104996")
      .addEventListener("click", async () => {
        facing = facing === "user"
          ? "environment"
          : "user";
        await startCamera();
      });

    $("manaCameraCapture104996")
      .addEventListener("click", capturePhoto);

    $("manaCameraRetake104996")
      .addEventListener("click", async () => {
        capturedFile = null;
        clearCapturedURL();
        showCaptured(false);
        await startCamera();
      });

    $("manaCameraUse104996")
      .addEventListener("click", usePhoto);

    void startCamera();
  }

  function installButtons() {
    const input = $(INPUT);
    if (!input) return false;

    const field = input.closest(".me-field");
    if (!field) return false;

    const existing = $(CONTROLS);

    if (existing?.parentElement === field) {
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
    installStyles();

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

    window.addEventListener(
      "pageshow",
      installButtons
    );

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

    window.addEventListener("pagehide", stopCamera);

    console.log(
      "[Mana Movement] Camera 104996 active"
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
