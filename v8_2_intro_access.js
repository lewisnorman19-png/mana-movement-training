/* =========================================
   MANA MOVEMENT TRAINING v8.2
   INTRO ACCESS + AMBIENT SOUND
   ========================================= */

(() => {
  "use strict";

  const INTRO_ID = "manaV81Intro";
  const HOME_ID = "manaV80Home";

  const STYLE_ID =
    "mana-v82-intro-access-style";

  const SOUND_KEY =
    "mana-intro-sound-enabled";

  const AUDIO_ID =
    "manaIntroAmbient";

  function injectStyles() {
    if (
      document.getElementById(
        STYLE_ID
      )
    ) return;

    const style =
      document.createElement("style");

    style.id = STYLE_ID;

    style.textContent = `
      .mana-v82-about{
        width:100%;
        min-height:48px;
        margin:18px 0 4px;
        border-radius:15px;
        border:1px solid #333;
        background:#0d0d0d;
        color:#f3d875;
        font-size:13px;
        font-weight:900;
        letter-spacing:.04em;
      }

      .mana-v82-sound{
        position:fixed;
        z-index:50010;
        top:
          calc(
            env(safe-area-inset-top) +
            14px
          );
        right:14px;

        min-height:38px;
        padding:0 13px;

        border-radius:999px;
        border:1px solid
          rgba(243,216,117,.32);

        background:
          rgba(8,8,8,.88);

        color:#f3d875;

        font-size:11px;
        font-weight:900;

        backdrop-filter:
          blur(12px);
      }

      .mana-v82-sound.off{
        color:#888;
        border-color:#333;
      }

      #${INTRO_ID}:not(.open)
      .mana-v82-sound{
        display:none;
      }
    `;

    document.head.appendChild(
      style
    );
  }

  function ensureAudio() {
    let audio =
      document.getElementById(
        AUDIO_ID
      );

    if (audio) return audio;

    audio =
      document.createElement(
        "audio"
      );

    audio.id = AUDIO_ID;

    /*
      Add this audio file to the
      GitHub repo later.
    */
    audio.src =
      "mana-intro-ambient.mp3";

    audio.loop = true;

    /*
      Very low background volume.
      0.08 = 8%.
    */
    audio.volume = 0.08;

    audio.preload = "auto";

    document.body.appendChild(
      audio
    );

    return audio;
  }

  function soundEnabled() {
    return (
      localStorage.getItem(
        SOUND_KEY
      ) === "1"
    );
  }

  function updateSoundButton() {
    const button =
      document.getElementById(
        "manaV82Sound"
      );

    if (!button) return;

    const enabled =
      soundEnabled();

    button.textContent =
      enabled
        ? "♫ SOUND ON"
        : "♫ SOUND OFF";

    button.classList.toggle(
      "off",
      !enabled
    );
  }

  async function startSound() {
    const audio =
      ensureAudio();

    try {
      audio.volume = 0.08;

      await audio.play();
    } catch (_) {
      /*
        Browser may require
        another user interaction.
      */
    }
  }

  function stopSound() {
    const audio =
      document.getElementById(
        AUDIO_ID
      );

    if (!audio) return;

    audio.pause();
  }

  async function toggleSound() {
    const enabled =
      !soundEnabled();

    localStorage.setItem(
      SOUND_KEY,
      enabled ? "1" : "0"
    );

    updateSoundButton();

    if (enabled) {
      await startSound();
    } else {
      stopSound();
    }
  }

  function addSoundButton() {
    const intro =
      document.getElementById(
        INTRO_ID
      );

    if (
      !intro ||
      document.getElementById(
        "manaV82Sound"
      )
    ) return;

    const button =
      document.createElement(
        "button"
      );

    button.type = "button";
    button.id =
      "manaV82Sound";

    button.className =
      "mana-v82-sound";

    button.onclick =
      toggleSound;

    intro.appendChild(
      button
    );

    updateSoundButton();
  }

  function addHomeAccess() {
    const home =
      document.getElementById(
        HOME_ID
      );

    if (
      !home ||
      document.getElementById(
        "manaV82About"
      )
    ) return;

    const programsHeading =
      home.querySelector(
        ".mana-v80-heading"
      );

    if (!programsHeading) return;

    const button =
      document.createElement(
        "button"
      );

    button.type = "button";

    button.id =
      "manaV82About";

    button.className =
      "mana-v82-about";

    button.textContent =
      "ABOUT MANA MOVEMENT";

    button.onclick = () => {
      if (
        typeof
        window.openManaIntroduction ===
        "function"
      ) {
        window.openManaIntroduction();
      }
    };

    programsHeading
      .insertAdjacentElement(
        "beforebegin",
        button
      );
  }

  function watchIntro() {
    const intro =
      document.getElementById(
        INTRO_ID
      );

    if (!intro) return;

    let wasOpen =
      intro.classList.contains(
        "open"
      );

    const observer =
      new MutationObserver(() => {
        const isOpen =
          intro.classList.contains(
            "open"
          );

        if (
          isOpen &&
          !wasOpen
        ) {
          addSoundButton();

          if (
            soundEnabled()
          ) {
            startSound();
          }
        }

        if (
          !isOpen &&
          wasOpen
        ) {
          stopSound();
        }

        wasOpen = isOpen;
      });

    observer.observe(
      intro,
      {
        attributes:true,
        attributeFilter:[
          "class"
        ]
      }
    );
  }

  function init() {
    injectStyles();

    setTimeout(() => {
      ensureAudio();
      addSoundButton();
      addHomeAccess();
      watchIntro();
    }, 900);

    /*
      v8 Home can appear slightly
      later after login.
    */
    setTimeout(
      addHomeAccess,
      1800
    );
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }

})();
