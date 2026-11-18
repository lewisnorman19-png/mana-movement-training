
/* ============================================================
   MANA MOVEMENT TRAINING
   COACH PROFILE CAMERA
   BUILD 105011

   COMPLETE NEW JAVASCRIPT FILE

   - Take Photo
   - Choose from Device
   - Capture, Retake, Use Photo
   - Front / rear camera switching
   - Compact premium profile preview
   - Uses original Coach Profile save logic

   NO DATABASE CHANGES
   NO CLIENT PROFILE CHANGES
   ============================================================ */

(() => {
  "use strict";

  const FLAG = "MANA_COACH_CAMERA_105011";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const ROOT = "manaCoachSettings105010";
  const INPUT = "mcsPhotoInput105010";
  const OLD_BUTTON = "mcsChoosePhoto105010";
  const CONTROLS = "manaCoachPhotoControls105011";
  const MODAL = "manaCoachCameraModal105011";
  const STYLE = "manaCoachCameraStyle105011";

  const $ = id => document.getElementById(id);

  let stream = null;
  let facing = "user";
  let capturedFile = null;
  let capturedUrl = null;
  let observer = null;

  /* =====================================================
     STYLES
     ===================================================== */

  function styles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      #${ROOT} #${INPUT} {
        display: none !important;
      }

      #${ROOT} #${OLD_BUTTON} {
        display: none !important;
      }

      #${ROOT} #${CONTROLS} {
        display: flex;
        flex-wrap: wrap;
        gap: 9px;
        align-items: center;
      }

      #${ROOT} #${CONTROLS} button {
        min-height: 43px;
        padding: 10px 13px;
        border: 1px solid #FF7927;
        border-radius: 11px;
        background: #24180F;
        color: #FF7927;
        -webkit-text-fill-color: #FF7927;
        font-size: 12px;
        font-weight: 900;
        cursor: pointer;
      }

      #${ROOT} #mcsAvatar105010 {
        flex: 0 0 96px !important;
        width: 96px !important;
        height: 96px !important;
        border: 1px solid #FF7927 !important;
        border-radius: 13px !important;
        background: #101215 !important;
      }

      #${ROOT} #mcsAvatar105010 img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      #${MODAL} {
        position: fixed !important;
        inset: 0 !important;
        z-index: 110000 !important;

        display: flex !important;
        align-items: center;
        justify-content: center;

        padding: 15px;
        background: rgba(0,0,0,.9);
        box-sizing: border-box;
      }

      #${MODAL} * {
        box-sizing: border-box;
      }

      #${MODAL} .mcc-panel {
        width: min(480px,100%);
        max-height: 94dvh;
        overflow-y: auto;

        background: #15171B;
        border: 1px solid #505862;
        border-radius: 19px;
        padding: 17px;

        color: #FFFFFF;
      }

      #${MODAL} .mcc-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 14px;
      }

      #${MODAL} .mcc-kicker {
        color: #FF7927;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: .12em;
      }

      #${MODAL} h2 {
        color: #FFFFFF;
        font-size: 21px;
        margin: 5px 0 0;
      }

      #${MODAL} .mcc-preview {
        display: grid;
        place-items: center;
        overflow: hidden;

        width: 100%;
        aspect-ratio: 1 / 1;
        max-height: min(55dvh,400px);

        background: #090B0D;
        border: 1px solid #48515B;
        border-radius: 14px;
      }

      #${MODAL} video,
      #${MODAL} .mcc-captured {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      #${MODAL} .mcc-captured {
        display: none;
      }

      #${MODAL} .mcc-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 9px;
        margin-top: 14px;
      }

      #${MODAL} button {
        min-height: 43px;
        padding: 10px 13px;
        border: 1px solid #FF7927;
        border-radius: 10px;

        background: #24180F;
        color: #FF7927;

        font-size: 12px;
        font-weight: 900;
        cursor: pointer;
      }

      #${MODAL} button.primary {
        background: #FF7927;
        color: #101215;
      }

      #${MODAL} button:focus-visible {
        outline: 2px solid #FFFFFF;
        outline-offset: 2px;
      }

      #${MODAL} .mcc-note {
        min-height: 20px;
        margin-top: 11px;

        color: #B7C0CB;
        font-size: 12px;
        line-height: 1.5;
      }

      @media(max-width:600px) {
        #${MODAL} .mcc-panel {
          padding: 12px;
        }

        #${MODAL} .mcc-actions button {
          flex: 1 1 auto;
        }
      }

    `;

    document.head.appendChild(style);
  }

  /* =====================================================
     CLEANUP
     ===================================================== */

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(
        track => track.stop()
      );

      stream = null;
    }

    const video = $("mccVideo105011");

    if (video) {
      video.pause();
      video.srcObject = null;
    }
  }

  function clearCapture() {
    if (capturedUrl) {
      URL.revokeObjectURL(capturedUrl);
      capturedUrl = null;
    }

    capturedFile = null;
  }

  function closeCamera() {
    stopCamera();
    clearCapture();
    $(MODAL)?.remove();
  }

  /* =====================================================
     CAMERA
     ===================================================== */

  async function startCamera() {
    const video = $("mccVideo105011");
    const note = $("mccNote105011");

    if (!video) return;

    stopCamera();

    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      if (note) {
        note.textContent =
          "Camera not available. Use Choose from Device.";
      }
      return;
    }

    try {
      const next = await navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: facing }
          }
        });

      if (!video.isConnected) {
        next.getTracks().forEach(
          track => track.stop()
        );
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
          "Unable to access the camera. " +
          "Check camera permissions or choose " +
          "a photo from your device.";
      }

      console.warn(
        "[Mana Coach Camera]",
        error
      );
    }
  }

  function showCaptured(captured) {
    const video = $("mccVideo105011");
    const image = $("mccCaptured105011");

    if (!video || !image) return;

    video.style.display =
      captured ? "none" : "block";

    image.style.display =
      captured ? "block" : "none";

    $("mccCapture105011").hidden = captured;
    $("mccSwitch105011").hidden = captured;

    $("mccRetake105011").hidden = !captured;
    $("mccUse105011").hidden = !captured;
  }

  async function takePhoto() {
    const video = $("mccVideo105011");

    if (
      !video ||
      !video.videoWidth ||
      !video.videoHeight
    ) {
      const note = $("mccNote105011");

      if (note) {
        note.textContent =
          "Camera is not ready yet.";
      }
      return;
    }

    const canvas = document.createElement(
      "canvas"
    );

    const scale = Math.min(
      1,
      1200 / Math.max(
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

    const blob = await new Promise(
      resolve => {
        canvas.toBlob(
          resolve,
          "image/jpeg",
          .85
        );
      }
    );

    if (!blob) return;

    clearCapture();

    capturedFile = new File(
      [blob],
      "mana-coach-photo-" +
        Date.now() + ".jpg",
      {type: "image/jpeg"}
    );

    capturedUrl = URL.createObjectURL(
      blob
    );

    const image = $("mccCaptured105011");

    if (!image) {
      clearCapture();
      return;
    }

    image.src = capturedUrl;

    stopCamera();
    showCaptured(true);

    const note = $("mccNote105011");

    if (note) {
      note.textContent =
        "Use Photo to attach it, " +
        "or Retake to try again.";
    }
  }

  function usePhoto() {
    if (!capturedFile) return;

    const input = $(INPUT);

    if (!input) {
      closeCamera();
      return;
    }

    try {
      const transfer = new DataTransfer();

      transfer.items.add(capturedFile);

      input.files = transfer.files;

      /*
       Trigger original Settings photo
       handler, which creates the compact
       preview for Save Coach Profile.
      */

      input.dispatchEvent(
        new Event("change", {
          bubbles: true
        })
      );

      closeCamera();

    } catch (error) {
      const note = $("mccNote105011");

      if (note) {
        note.textContent =
          "Unable to attach photograph.";
      }
    }
  }

  /* =====================================================
     OPEN CAMERA
     ===================================================== */

  function openCamera() {
    if ($(MODAL)) return;

    facing = "user";
    clearCapture();

    const modal = document.createElement("div");
    modal.id = MODAL;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute(
      "aria-label",
      "Take Coach Profile Photo"
    );

    modal.innerHTML = `
      <div class="mcc-panel">

        <div class="mcc-header">
          <div>
            <div class="mcc-kicker">
              MANA MOVEMENT · COACH
            </div>

            <h2>Take Profile Photo</h2>
          </div>

          <button
            type="button"
            id="mccClose105011"
          >
            CLOSE
          </button>
        </div>

        <div class="mcc-preview">
          <video
            id="mccVideo105011"
            autoplay
            muted
            playsinline
          ></video>

          <img
            id="mccCaptured105011"
            class="mcc-captured"
            alt="Captured coach photograph"
          >
        </div>

        <div class="mcc-actions">
          <button
            type="button"
            class="primary"
            id="mccCapture105011"
          >
            CAPTURE
          </button>

          <button
            type="button"
            id="mccSwitch105011"
          >
            SWITCH CAMERA
          </button>

          <button
            type="button"
            id="mccRetake105011"
            hidden
          >
            RETAKE
          </button>

          <button
            type="button"
            class="primary"
            id="mccUse105011"
            hidden
          >
            USE PHOTO
          </button>
        </div>

        <div
          class="mcc-note"
          id="mccNote105011"
          role="status"
        >
          Starting camera…
        </div>

      </div>
    `;

    document.body.appendChild(modal);

    $("mccClose105011").onclick =
      closeCamera;

    $("mccCapture105011").onclick =
      takePhoto;

    $("mccSwitch105011").onclick =
      async () => {
        facing =
          facing === "user"
            ? "environment"
            : "user";

        await startCamera();
      };

    $("mccRetake105011").onclick =
      async () => {
        clearCapture();
        showCaptured(false);
        await startCamera();
      };

    $("mccUse105011").onclick =
      usePhoto;

    modal.addEventListener(
      "click",
      event => {
        if (event.target === modal) {
          closeCamera();
        }
      }
    );

    void startCamera();
  }

  /* =====================================================
     SETTINGS CONTROLS

     Existing file input and original
     image processing remain untouched.
     ===================================================== */

  function mountControls() {
    const root = $(ROOT);
    const input = $(INPUT);
    const oldButton = $(OLD_BUTTON);

    if (!root || !input || !oldButton) {
      return;
    }

    const parent = oldButton.parentElement;

    if (!parent) return;

    if ($(CONTROLS)) return;

    const controls = document.createElement("div");
    controls.id = CONTROLS;

    const camera = document.createElement("button");
    camera.type = "button";
    camera.textContent = "Take Photo";

    const device = document.createElement("button");
    device.type = "button";
    device.textContent = "Choose from Device";

    controls.append(camera, device);

    parent.insertBefore(
      controls,
      oldButton
    );

    camera.addEventListener(
      "click",
      openCamera
    );

    device.addEventListener(
      "click",
      () => input.click()
    );
  }

  /* =====================================================
     INITIALISE

     Settings can re-render after a
     profile or preference save.
     ===================================================== */

  function init() {
    styles();

    mountControls();

    const root = $(ROOT);

    if (root) {
      observer = new MutationObserver(
        mountControls
      );

      observer.observe(root, {
        childList: true,
        subtree: false
      });
    }

    document.addEventListener(
      "keydown",
      event => {
        if (
          event.key === "Escape" &&
          $(MODAL)
        ) {
          closeCamera();
        }
      }
    );

    window.MANA_COACH_CAMERA_BUILD =
      "105011";

    console.log(
      "[Mana Movement] Coach Camera 105011"
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
