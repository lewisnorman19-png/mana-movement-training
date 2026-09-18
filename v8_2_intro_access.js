/* =========================================
   MANA MOVEMENT TRAINING v8.2
   INTRO SOUND + CURRENT WORKOUT
   ========================================= */

(() => {
  "use strict";

  const INTRO_ID =
    "manaV81Intro";

  const HOME_ID =
    "manaV80Home";

  const STYLE_ID =
    "mana-v82-intro-access-style";

  const SOUND_KEY =
    "mana-intro-sound-enabled";

  const AUDIO_ID =
    "manaIntroAmbient";

  const PROGRAM_KEY =
    "mana-strength-v62-program";

  const LOG_KEY =
    "mana-strength-v64-logs";


  function safeJson(
    raw,
    fallback
  ) {
    try {
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }


  function injectStyles() {
    if (
      document.getElementById(
        STYLE_ID
      )
    ) return;

    const style =
      document.createElement(
        "style"
      );

    style.id =
      STYLE_ID;

    style.textContent = `

      /* ==========================
         CURRENT WORKOUT
         ========================== */

      .mana-v82-current{
        width:100%;

        min-height:92px;

        margin:
          18px
          0
          4px;

        padding:16px;

        border-radius:18px;

        border:
          1px solid
          #4a3d12;

        background:
          linear-gradient(
            145deg,
            #17150d,
            #0b0b0b
          );

        color:#fff;

        text-align:left;

        cursor:pointer;
      }


      .mana-v82-current-label{
        color:#f3d875;

        font-size:11px;

        font-weight:900;

        letter-spacing:.12em;

        text-transform:uppercase;
      }


      .mana-v82-current-title{
        margin-top:6px;

        font-size:20px;

        font-weight:900;
      }


      .mana-v82-current-sub{
        margin-top:5px;

        color:#999;

        font-size:12px;
      }


      .mana-v82-current-open{
        margin-top:9px;

        color:#f3d875;

        font-size:12px;

        font-weight:900;
      }


      /* ==========================
         INTRO SOUND
         ========================== */

      .mana-v82-sound{
        position:fixed;

        z-index:50010;

        top:
          calc(
            env(
              safe-area-inset-top
            ) + 14px
          );

        right:14px;

        min-height:38px;

        padding:
          0
          13px;

        border-radius:999px;

        border:
          1px solid
          rgba(
            243,
            216,
            117,
            .32
          );

        background:
          rgba(
            8,
            8,
            8,
            .88
          );

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


      /*
        Remove the old
        Return to Home button
        from the Intro page.
      */

      #manaV81Close{
        display:none !important;
      }

    `;

    document.head.appendChild(
      style
    );
  }


  /* =========================================
     AUDIO
     ========================================= */

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

    audio.id =
      AUDIO_ID;

    audio.src =
      "mana-intro-ambient.mp3";

    audio.loop =
      true;

    audio.volume =
      0.08;

    audio.preload =
      "auto";


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
      audio.volume =
        0.08;

      await audio.play();

    } catch (_) {
      /* Browser may require interaction */
    }
  }


  function stopSound() {
    const audio =
      document.getElementById(
        AUDIO_ID
      );

    audio?.pause();
  }


  async function toggleSound() {
    const enabled =
      !soundEnabled();


    localStorage.setItem(
      SOUND_KEY,
      enabled
        ? "1"
        : "0"
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

    button.type =
      "button";

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


  /* =========================================
     CURRENT WORKOUT
     ========================================= */

  function loadProgram() {
    return safeJson(
      localStorage.getItem(
        PROGRAM_KEY
      ),
      null
    );
  }


  function loadLogs() {
    return safeJson(
      localStorage.getItem(
        LOG_KEY
      ) || "[]",
      []
    );
  }


  function startOfWeek() {
    const now =
      new Date();

    const day =
      now.getDay();

    const diff =
      day === 0
        ? 6
        : day - 1;

    const start =
      new Date(now);

    start.setHours(
      0,
      0,
      0,
      0
    );

    start.setDate(
      start.getDate() -
      diff
    );

    return start;
  }


  function thisWeeksLogs() {
    const start =
      startOfWeek()
        .getTime();

    return loadLogs()
      .filter(
        log =>
          new Date(
            log.date || 0
          ).getTime() >=
          start
      );
  }


  function nextWorkout() {
    const program =
      loadProgram();

    if (
      !program
        ?.sessions
        ?.length
    ) {
      return null;
    }


    const completed =
      thisWeeksLogs()
        .length;


    const index =
      completed %
      program.sessions.length;


    const session =
      program.sessions[
        index
      ];


    return {
      index,
      name:
        session?.[0] ||
        "Workout",
      goal:
        program.goal ||
        "Strength training"
    };
  }


  function openWorkout(
    dayIndex
  ) {
    if (
      typeof
        window
          .openManaStrengthWorkout ===
      "function"
    ) {
      window
        .openManaStrengthWorkout(
          dayIndex
        );

      return;
    }


    const strength =
      document.getElementById(
        "manaV80Strength"
      );

    strength?.click();
  }


  function removeOldAbout() {
    document
      .getElementById(
        "manaV82About"
      )
      ?.remove();
  }


  function addCurrentWorkout() {
    const home =
      document.getElementById(
        HOME_ID
      );

    if (!home) return;


    removeOldAbout();


    const existing =
      document.getElementById(
        "manaV82Current"
      );

    existing?.remove();


    const programsHeading =
      home.querySelector(
        ".mana-v80-heading"
      );

    if (!programsHeading) {
      return;
    }


    const current =
      nextWorkout();


    const button =
      document.createElement(
        "button"
      );

    button.type =
      "button";

    button.id =
      "manaV82Current";

    button.className =
      "mana-v82-current";


    if (current) {

      button.innerHTML = `

        <div
          class="mana-v82-current-label"
        >
          CURRENT WORKOUT
        </div>

        <div
          class="mana-v82-current-title"
        >
          Day ${current.index + 1}
          •
          ${current.name}
        </div>

        <div
          class="mana-v82-current-sub"
        >
          ${current.goal}
        </div>

        <div
          class="mana-v82-current-open"
        >
          Start workout →
        </div>

      `;


      button.onclick =
        () =>
          openWorkout(
            current.index
          );

    } else {

      button.innerHTML = `

        <div
          class="mana-v82-current-label"
        >
          CURRENT WORKOUT
        </div>

        <div
          class="mana-v82-current-title"
        >
          Build your strength program
        </div>

        <div
          class="mana-v82-current-sub"
        >
          Complete your profile to
          create your training program.
        </div>

      `;


      button.onclick =
        () => {

          if (
            typeof
              window
                .openManaProfile ===
            "function"
          ) {
            window
              .openManaProfile();
          }
        };
    }


    programsHeading
      .insertAdjacentElement(
        "beforebegin",
        button
      );
  }


  /* =========================================
     INTRO WATCH
     ========================================= */

  function watchIntro() {
    const intro =
      document.getElementById(
        INTRO_ID
      );

    if (!intro) return;


    let wasOpen =
      intro.classList
        .contains(
          "open"
        );


    const observer =
      new MutationObserver(
        () => {

          const isOpen =
            intro.classList
              .contains(
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


          wasOpen =
            isOpen;

        }
      );


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


  /* =========================================
     INIT
     ========================================= */

  function init() {
    injectStyles();


    setTimeout(
      () => {
        ensureAudio();
        addSoundButton();
        addCurrentWorkout();
        watchIntro();
      },
      900
    );


    setTimeout(
      addCurrentWorkout,
      1800
    );


    window.addEventListener(
      "mana:strength-synced",
      addCurrentWorkout
    );


    window.addEventListener(
      "mana:profile-synced",
      addCurrentWorkout
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
