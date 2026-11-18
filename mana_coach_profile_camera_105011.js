
/* ============================================================
   MANA MOVEMENT TRAINING
   COACH PROFILE CAMERA — STABILITY FIX
   BUILD 105012

   COMPLETE REPLACEMENT:
   mana_coach_profile_camera_105011.js

   - Take Photo
   - Choose from Device
   - Capture / Retake / Use Photo
   - Front / rear camera switching
   - Compact 96px photo preview
   - Reliable controls after Settings loads
   - Reliable controls after Settings re-renders
   - Uses original Save Coach Profile handler

   NO DATABASE OR NAVIGATION CHANGES
   ============================================================ */

(() => {
  "use strict";

  const FLAG = "MANA_COACH_CAMERA_105012";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const ROOT = "manaCoachSettings105010";
  const SECTION =
    '#manaCoachSuite104707 [data-mcn-view="settings"]';

  const INPUT = "mcsPhotoInput105010";
  const OLD_BUTTON = "mcsChoosePhoto105010";
  const PREVIEW = "mcsAvatar105010";

  const CONTROLS = "manaCoachPhotoControls105012";
  const MODAL = "manaCoachCameraModal105012";
  const STYLE = "manaCoachCameraStyle105012";

  const $ = id => document.getElementById(id);

  let stream = null;
  let facing = "user";
  let capturedFile = null;
  let capturedURL = null;
  let cameraRequest = 0;
  let sectionObserver = null;
  let pendingMount = false;

  /* =====================================================
     PREMIUM STYLING
     ===================================================== */

  function installStyles() {
    if ($(STYLE)) return;

    const style = document.createElement("style");
    style.id = STYLE;

    style.textContent = `

      /* Hide the file input, not the controls */

      #${ROOT} #${INPUT} {
        display: none !important;
      }

      /*
       Only hide the original photo button
       once replacement controls are mounted.
      */

      #${ROOT}.mcc-controls-ready
      #${OLD_BUTTON} {
        display: none !important;
      }

      /* Small coach photo */

      #${ROOT} #${PREVIEW} {
        flex: 0 0 96px !important;
        width: 96px !important;
        height: 96px !important;
        min-width: 96px !important;
        min-height: 96px !important;

        display: grid !important;
        place-items: center !important;

        border: 1px solid #FF7927 !important;
        border-radius: 13px !important;
        background: #101215 !important;
        overflow: hidden !important;
      }

      #${ROOT} #${PREVIEW} img {
        display: block !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
      }

      #${ROOT} .mcs-photo-actions {
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: flex-start !important;
        gap: 7px !important;
        min-width: 0 !important;
      }

      #${ROOT} #${CONTROLS} {
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        gap: 9px !important;
        width: 100% !important;
      }

      #${ROOT} #${CONTROLS} button {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;

        min-height: 44px !important;
        padding: 11px 15px !important;

        background: #24180F !important;
        border: 1px solid #FF7927 !important;
        border-radius: 11px !important;

        color: #FF7927 !important;
        -webkit-text-fill-color: #FF7927 !important;

        font-size: 12px !important;
        font-weight: 900 !important;
        line-height: 1.25 !important;
        cursor: pointer !important;
      }

      #${ROOT} #${CONTROLS} button:hover {
        background: #352114 !important;
      }

      #${ROOT} #${CONTROLS}
      button:focus-visible {
        outline: 2px solid #FFFFFF !important;
        outline-offset: 2px !important;
      }

      /* Camera overlay */

      #${MODAL} {
        position: fixed !important;
        inset: 0 !important;
        z-index: 110000 !important;

        display: flex !important;
        align-items: center !important;
        justify-content: center !important;

        padding: 15px !important;
        background: rgba(0,0,0,.92) !important;
        box-sizing: border-box !important;
      }

      #${MODAL} * {
        box-sizing: border-box;
      }

      #${MODAL} [hidden] {
        display: none !important;
      }

      #${MODAL} .mcc-panel {
        width: min(470px,100%);
        max-height: 94dvh;
        overflow-y: auto;

        padding: 17px;

        background: #15171B;
        border: 1px solid #505862;
        border-radius: 18px;

        color: #FFFFFF;
      }

      #${MODAL} .mcc-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        margin-bottom: 13px;
      }

      #${MODAL} .mcc-kicker {
        color: #FF7927;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: .12em;
      }

      #${MODAL} h2 {
        color: #FFFFFF;
        margin: 5px 0 0;
        font-size: 21px;
        font-weight: 900;
      }

      #${MODAL} .mcc-preview {
        width: 100%;
        aspect-ratio: 1 / 1;
        max-height: min(55dvh,400px);
        overflow: hidden;

        background: #090B0D;
        border: 1px solid #48515B;
        border-radius: 13px;
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
        margin-top: 13px;
      }

      #${MODAL} button {
        min-height: 43px;
        padding: 10px 14px;

        background: #24180F;
        border: 1px solid #FF7927;
        border-radius: 10px;

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
        margin-top: 12px;
        min-height: 20px;
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

        #${ROOT} #${CONTROLS} button {
          padding: 10px 12px !important;
        }
      }

    `;

    document.head.appendChild(style);
  }

  /* =====================================================
     CAMERA CLEANUP
     ===================================================== */

  function stopCamera() {
    cameraRequest++;

    if (stream) {
      stream.getTracks().forEach(
        track => track.stop()
      );
      stream = null;
    }

    const video = $("mccVideo105012");

    if (video) {
      video.pause();
      video.srcObject = null;
    }
  }

  function clearCaptured() {
    if (capturedURL) {
      URL.revokeObjectURL(capturedURL);
      capturedURL = null;
    }

    capturedFile = null;
  }

  function closeCamera() {
    stopCamera();
    clearCaptured();
    $(MODAL)?.remove();
  }

  /* =====================================================
     START CAMERA
     ===================================================== */

  async function startCamera() {
    stopCamera();

    const request = cameraRequest;
    const video = $("mccVideo105012");
    const note = $("mccNote105012");

    if (!video || !note) return;

    if (!navigator.mediaDevices?.getUserMedia) {
      note.textContent =
        "This device cannot open the camera. " +
        "Choose from Device instead.";
      return;
    }

    note.textContent = "Starting camera…";

    try {
      const next = await navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: facing }
          }
        });

      if (
        request !== cameraRequest ||
        !video.isConnected
      ) {
        next.getTracks().forEach(
          track => track.stop()
        );
        return;
      }

      stream = next;
      video.srcObject = next;

      await video.play();

      if (request === cameraRequest) {
        note.textContent =
          "Position yourself in the frame.";
      }

    } catch (error) {
      if (request === cameraRequest) {
        note.textContent =
          "Camera unavailable. Check permissions " +
          "or choose an existing photo.";
      }

      console.warn(
        "[Mana Coach Camera]",
        error
      );
    }
  }

  /* =====================================================
     CAPTURE PHOTO
     ===================================================== */

  function showCaptured(isCaptured) {
    const video = $("mccVideo105012");
    const image = $("mccCaptured105012");

    if (!video || !image) return;

    video.style.display =
      isCaptured ? "none" : "block";

    image.style.display =
      isCaptured ? "block" : "none";

    $("mccCapture105012").hidden =
      isCaptured;

    $("mccSwitch105012").hidden =
      isCaptured;

    $("mccRetake105012").hidden =
      !isCaptured;

    $("mccUse105012").hidden =
      !isCaptured;
  }

  async function capturePhoto() {
    const video = $("mccVideo105012");
    const note = $("mccNote105012");

    if (
      !video ||
      !video.videoWidth ||
      !video.videoHeight
    ) {
      if (note) {
        note.textContent =
          "Camera is not ready yet.";
      }
      return;
    }

    const canvas =
      document.createElement("canvas");

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

    const blob = await new Promise(resolve => {
      canvas.toBlob(
        resolve,
        "image/jpeg",
        .85
      );
    });

    if (!blob) {
      if (note) {
        note.textContent =
          "Unable to capture this photo.";
      }
      return;
    }

    clearCaptured();

    capturedFile = new File(
      [blob],
      "mana-coach-" + Date.now() + ".jpg",
      { type: "image/jpeg" }
    );

    capturedURL = URL.createObjectURL(blob);

    const image = $("mccCaptured105012");

    if (!image) return;

    image.src = capturedURL;

    stopCamera();
    showCaptured(true);

    if (note) {
      note.textContent =
        "Use Photo to attach it or Retake.";
    }
  }

  /* =====================================================
     ATTACH TO EXISTING SAVE HANDLER
     ===================================================== */

  function usePhoto() {
    const input = $(INPUT);
    const note = $("mccNote105012");

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
      if (note) {
        note.textContent =
          "Unable to attach photo. " +
          "Please use Choose from Device.";
      }
    }
  }

  /* =====================================================
     OPEN CAMERA
     ===================================================== */

  function openCamera() {
    if ($(MODAL)) return;

    facing = "user";
    clearCaptured();

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
            id="mccClose105012"
          >
            CLOSE
          </button>
        </div>

        <div class="mcc-preview">
          <video
            id="mccVideo105012"
            autoplay
            muted
            playsinline
          ></video>

          <img
            id="mccCaptured105012"
            class="mcc-captured"
            alt="Captured coach photo"
          >
        </div>

        <div class="mcc-actions">

          <button
            type="button"
            class="primary"
            id="mccCapture105012"
          >
            CAPTURE
          </button>

          <button
            type="button"
            id="mccSwitch105012"
          >
            SWITCH CAMERA
          </button>

          <button
            type="button"
            id="mccRetake105012"
            hidden
          >
            RETAKE
          </button>

          <button
            type="button"
            class="primary"
            id="mccUse105012"
            hidden
          >
            USE PHOTO
          </button>

        </div>

        <div
          class="mcc-note"
          id="mccNote105012"
          role="status"
        >
          Starting camera…
        </div>

      </div>
    `;

    document.body.appendChild(modal);

    $("mccClose105012").onclick =
      closeCamera;

    $("mccCapture105012").onclick =
      capturePhoto;

    $("mccSwitch105012").onclick =
      async () => {
        facing = facing === "user"
          ? "environment"
          : "user";

        await startCamera();
      };

    $("mccRetake105012").onclick =
      async () => {
        clearCaptured();
        showCaptured(false);
        await startCamera();
      };

    $("mccUse105012").onclick =
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
     ATTACH VISIBLE PHOTO BUTTONS

     This runs after the Settings screen
     finishes loading and after re-renders.
     ===================================================== */

  function mountControls() {
    const root = $(ROOT);
    const input = $(INPUT);
    const oldButton = $(OLD_BUTTON);

    if (!root || !input || !oldButton) return;

    const parent = oldButton.parentElement;

    if (!parent) return;

    let controls = $(CONTROLS);

    /*
     Check that the controls really belong
     to the currently rendered Settings
     panel, rather than an old node.
    */

    if (
      controls &&
      !parent.contains(controls)
    ) {
      controls.remove();
      controls = null;
    }

    if (!controls) {
      controls = document.createElement("div");
      controls.id = CONTROLS;

      const camera =
        document.createElement("button");

      camera.type = "button";
      camera.textContent = "Take Photo";

      const device =
        document.createElement("button");

      device.type = "button";
      device.textContent =
        "Choose from Device";

      camera.addEventListener(
        "click",
        openCamera
      );

      device.addEventListener(
        "click",
        () => {
          const currentInput = $(INPUT);

          if (currentInput) {
            currentInput.click();
          }
        }
      );

      controls.append(camera, device);

      parent.insertBefore(
        controls,
        oldButton
      );
    }

    /*
     Only mark the original button as
     replaceable once both new buttons
     exist inside the live panel.
    */

    root.classList.add(
      "mcc-controls-ready"
    );

    window.MANA_COACH_CAMERA_BUILD =
      "105012";
  }

  /* =====================================================
     RELIABLE SETTINGS WATCH

     Observe the Settings section, not just
     the root's immediate children.

     The account information loads
     asynchronously and builds the profile
     after the initial page render.
     ===================================================== */

  function scheduleMount() {
    if (pendingMount) return;

    pendingMount = true;

    requestAnimationFrame(() => {
      pendingMount = false;
      mountControls();
    });
  }

  function watchSettings() {
    const section =
      document.querySelector(SECTION);

    if (!section) return false;

    if (sectionObserver) {
      sectionObserver.disconnect();
    }

    sectionObserver =
      new MutationObserver(scheduleMount);

    sectionObserver.observe(section, {
      childList: true,
      subtree: true
    });

    scheduleMount();
    return true;
  }

  function init() {
    installStyles();

    /*
     Bounded setup attempts for modules
     that initialise at different times.
    */

    [0, 150, 450, 1000, 1800].forEach(
      delay => {
        setTimeout(() => {
          if (!sectionObserver) {
            watchSettings();
          } else {
            mountControls();
          }
        }, delay);
      }
    );

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

    console.log(
      "[Mana Movement] Coach Camera " +
      "105012 active"
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
