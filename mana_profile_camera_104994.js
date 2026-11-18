
/* =========================================================
   MANA MOVEMENT TRAINING
   PROFILE CAMERA UPGRADE
   BUILD 104994

   FEATURES
   - Take Photo using phone or laptop camera
   - Front camera by default
   - Switch camera where supported
   - Live camera preview
   - Capture and retake
   - Choose existing photograph
   - Use original Profile photo upload
   - Works with existing Save & Continue

   DOES NOT CHANGE
   - Supabase photo storage
   - Profile save functions
   - Coach Hub
   - Training / Fuel calculations
   - Progress photograph uploads
   ========================================================= */

(() => {
  "use strict";

  if (window.MANA_CAMERA_104994) return;
  window.MANA_CAMERA_104994 = true;

  const INPUT_ID = "me-file-avatar";
  const PREVIEW_ID = "me-preview-avatar";
  const ROOT_ID = "manaCameraControls104994";
  const MODAL_ID = "manaCameraModal104994";

  let stream = null;
  let facing = "user";
  let capturedFile = null;

  const $ = id => document.getElementById(id);

  function installStyles() {
    if ($("manaCameraStyle104994")) return;

    const style = document.createElement("style");
    style.id = "manaCameraStyle104994";

    style.textContent = `
      #${ROOT_ID} {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin: 9px 0;
      }

      #${ROOT_ID} button {
        appearance: none;
        background: #15171B;
        color: #FF7927;
        border: 1px solid #FF7927;
        border-radius: 10px;
        padding: 11px 14px;
        min-height: 44px;
        font: 800 12px system-ui, sans-serif;
        cursor: pointer;
      }

      #${ROOT_ID} button:first-child {
        background: #FF7927;
        color: #101114;
      }

      #manaProfileScreen
      #me-file-avatar {
        display: none !important;
      }

      #manaProfileScreen
      #me-preview-avatar {
        overflow: hidden;
      }

      #manaProfileScreen
      #me-preview-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      #${MODAL_ID} {
        position: fixed;
        inset: 0;
        z-index: 999999;
        background: rgba(0,0,0,.94);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        box-sizing: border-box;
      }

      #${MODAL_ID} .mc-card {
        background: #15171B;
        border: 1px solid #555E69;
        border-radius: 18px;
        padding: 16px;
        width: min(440px,100%);
        max-height: 95dvh;
        overflow: auto;
        color: white;
        box-sizing: border-box;
      }

      #${MODAL_ID} h3 {
        font: 850 19px system-ui;
        color: white;
        margin: 0 0 12px;
      }

      #${MODAL_ID} video,
      #${MODAL_ID} .mc-captured {
        display: block;
        width: 100%;
        max-height: 55dvh;
        aspect-ratio: 3/4;
        object-fit: cover;
        background: #08090B;
        border-radius: 12px;
        border: 1px solid #454D56;
      }

      #${MODAL_ID} .mc-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 9px;
        margin-top: 13px;
      }

      #${MODAL_ID} button {
        background: #171A1F;
        color: #FFFFFF;
        border: 1px solid #59616C;
        border-radius: 10px;
        padding: 12px 8px;
        min-height: 44px;
        font: 750 12px system-ui;
        cursor: pointer;
      }

      #${MODAL_ID} button.mc-primary {
        background: #FF7927;
        border-color: #FF7927;
        color: #101114;
        font-weight: 900;
      }

      #${MODAL_ID} .mc-note {
        color: #B7C0CC;
        font: 12px/1.5 system-ui;
        margin: 11px 0 0;
      }

      @media(max-width:600px) {
        #${ROOT_ID} {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        #${ROOT_ID} button {
          padding: 10px 7px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function stopCamera() {
    if (!stream) return;

    stream.getTracks().forEach(track => {
      track.stop();
    });

    stream = null;
  }

  function closeCamera() {
    stopCamera();
    $(MODAL_ID)?.remove();
    capturedFile = null;
  }

  async function startCamera() {
    const video = $("manaCameraVideo104994");
    const message = $("manaCameraMessage104994");

    if (!video) return;

    stopCamera();

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Camera access is not available in this browser."
        );
      }

      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 1600 }
        }
      });

      if (!video.isConnected) {
        stopCamera();
        return;
      }

      video.srcObject = stream;
      await video.play();

      if (message) {
        message.textContent =
          "Position your face inside the frame.";
      }

    } catch (error) {
      if (message) {
        message.textContent =
          "Camera unavailable. Check browser camera " +
          "permissions, or choose a photo from your device.";
      }

      console.warn(
        "[Mana Profile Camera]",
        error
      );
    }
  }

  function showCamera() {
    if ($(MODAL_ID)) return;

    capturedFile = null;
    facing = "user";

    const modal = document.createElement("div");
    modal.id = MODAL_ID;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Take profile photo");

    modal.innerHTML = `
      <div class="mc-card">
        <h3>Take Profile Photo</h3>

        <video
          id="manaCameraVideo104994"
          autoplay
          playsinline
          muted
        ></video>

        <img
          id="manaCapturedImage104994"
          class="mc-captured"
          alt="Captured profile photo"
          style="display:none"
        >

        <div class="mc-actions">
          <button
            type="button"
            id="manaCameraSwitch104994"
          >
            Switch Camera
          </button>

          <button
            type="button"
            class="mc-primary"
            id="manaCameraCapture104994"
          >
            Capture Photo
          </button>

          <button
            type="button"
            id="manaCameraRetake104994"
            style="display:none"
          >
            Retake
          </button>

          <button
            type="button"
            class="mc-primary"
            id="manaCameraUse104994"
            style="display:none"
          >
            Use Photo
          </button>

          <button
            type="button"
            id="manaCameraCancel104994"
          >
            Cancel
          </button>
        </div>

        <p
          class="mc-note"
          id="manaCameraMessage104994"
        >
          Allow camera access when prompted.
        </p>
      </div>
    `;

    document.body.appendChild(modal);

    $("manaCameraCancel104994")
      .addEventListener("click", closeCamera);

    $("manaCameraSwitch104994")
      .addEventListener("click", async () => {
        facing = facing === "user"
          ? "environment"
          : "user";

        await startCamera();
      });

    $("manaCameraCapture104994")
      .addEventListener("click", capturePhoto);

    $("manaCameraRetake104994")
      .addEventListener("click", async () => {
        capturedFile = null;

        $("manaCapturedImage104994")
          .style.display = "none";

        $("manaCameraVideo104994")
          .style.display = "block";

        $("manaCameraCapture104994")
          .style.display = "";

        $("manaCameraSwitch104994")
          .style.display = "";

        $("manaCameraUse104994")
          .style.display = "none";

        $("manaCameraRetake104994")
          .style.display = "none";

        await startCamera();
      });

    $("manaCameraUse104994")
      .addEventListener("click", usePhoto);

    void startCamera();
  }

  async function capturePhoto() {
    const video = $("manaCameraVideo104994");

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
      canvas.toBlob(
        resolve,
        "image/jpeg",
        0.88
      );
    });

    if (!blob) return;

    capturedFile = new File(
      [blob],
      "mana-profile-" + Date.now() + ".jpg",
      { type: "image/jpeg" }
    );

    const image = $("manaCapturedImage104994");

    if (!image) return;

    image.src = URL.createObjectURL(blob);

    image.onload = () => {
      URL.revokeObjectURL(image.src);
    };

    stopCamera();

    video.style.display = "none";
    image.style.display = "block";

    $("manaCameraCapture104994")
      .style.display = "none";

    $("manaCameraSwitch104994")
      .style.display = "none";

    $("manaCameraRetake104994")
      .style.display = "";

    $("manaCameraUse104994")
      .style.display = "";

    $("manaCameraMessage104994")
      .textContent =
        "Happy with your photo? Select Use Photo.";
  }

  function usePhoto() {
    const input = $(INPUT_ID);

    if (!input || !capturedFile) return;

    try {
      const transfer = new DataTransfer();

      transfer.items.add(capturedFile);

      input.files = transfer.files;

      /*
       Triggers the existing Profile preview.
       The original Save & Continue still
       uploads this file to Supabase.
      */

      input.dispatchEvent(
        new Event("change", {
          bubbles: true
        })
      );

      closeCamera();

    } catch (error) {
      console.warn(
        "[Mana Camera] Could not attach photo",
        error
      );
    }
  }

  function installButtons() {
    const input = $(INPUT_ID);

    if (!input || $(ROOT_ID)) return;

    const wrapper = document.createElement("div");
    wrapper.id = ROOT_ID;

    wrapper.innerHTML = `
      <button
        type="button"
        id="manaTakePhoto104994"
      >
        📷 Take Photo
      </button>

      <button
        type="button"
        id="manaChoosePhoto104994"
      >
        Choose from Device
      </button>
    `;

    const field = input.closest(".me-field");

    if (!field) return;

    input.insertAdjacentElement(
      "beforebegin",
      wrapper
    );

    $("manaTakePhoto104994")
      .addEventListener("click", showCamera);

    $("manaChoosePhoto104994")
      .addEventListener("click", () => {
        input.click();
      });
  }

  function init() {
    installStyles();

    installButtons();

    /*
     Profile controls are dynamically
     positioned by the 104992 layout.
    */

    document.addEventListener(
      "click",
      event => {
        if (
          event.target.closest?.(
            "[data-open-profile],#manaProfileButton"
          )
        ) {
          setTimeout(installButtons, 150);
        }
      }
    );

    window.addEventListener(
      "pageshow",
      installButtons
    );

    document.addEventListener(
      "visibilitychange",
      () => {
        if (!document.hidden) {
          installButtons();
        }
      }
    );

    window.addEventListener("pagehide", stopCamera);

    console.log(
      "[Mana Movement] Profile Camera 104994 active"
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
