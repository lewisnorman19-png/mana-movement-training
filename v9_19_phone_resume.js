
/*
=========================================
MANA MOVEMENT TRAINING v9.19.1
PHONE RESUME GUARD — BUILD 91901

COMPLETE REPLACEMENT:
v9_19_phone_resume.js

FIXES
- Removes repeated app-shell enforcement
- Prevents overlapping Safari resume checks
- Stops unnecessary screen redraws
- Keeps manual Introduction working
- Keeps fresh login Introduction working
- Prevents automatic Intro reopening
- Preserves current program and tab

IMPORTANT
- Does not rebuild Strength Overview
- Does not recreate navigation buttons
- Does not modify Profile or DOB
- Does not modify Coach Hub
- Does not affect desktop layout
=========================================
*/

(() => {
  "use strict";

  const BUILD = "91901";
  const FLAG = "MANA_PHONE_RESUME_91901";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const INTRO_ID = "manaV81Intro";
  const ENTERED_KEY = "mana-v919-entered-mana";

  let manualIntro = false;
  let restoring = false;
  let resumeTimer = null;
  let manualTimer = null;
  let introObserver = null;

  const $ = id => document.getElementById(id);

  /* ======================================
     SESSION HELPERS
     ====================================== */

  function intro() {
    return $(INTRO_ID);
  }

  function introOpen() {
    return Boolean(
      intro()?.classList.contains("open")
    );
  }

  function hasEnteredMana() {
    try {
      return (
        localStorage.getItem(ENTERED_KEY) === "1"
      );
    } catch (_) {
      return false;
    }
  }

  function markEntered() {
    try {
      localStorage.setItem(ENTERED_KEY, "1");
    } catch (_) {}
  }

  function clearEntered() {
    try {
      localStorage.removeItem(ENTERED_KEY);
    } catch (_) {}
  }

  /* ======================================
     CLOSE UNWANTED INTRO ONLY
     ====================================== */

  function closeAutoIntro() {
    if (
      restoring ||
      manualIntro ||
      !hasEnteredMana() ||
      !introOpen()
    ) {
      return;
    }

    restoring = true;

    try {
      if (
        typeof window.closeManaIntroduction ===
        "function"
      ) {
        window.closeManaIntroduction();
      } else {
        intro()?.classList.remove("open");
        document.body.style.overflow = "";
      }
    } catch (error) {
      console.warn(
        "[Mana Phone] Intro close:",
        error
      );
    }

    /*
     Only restore the application shell
     if we actually had to close an
     unwanted Introduction.

     Do not enforce the shell on every
     focus, pageshow or visibility event.
    */

    setTimeout(() => {
      try {
        if (
          !introOpen() &&
          typeof window.enforceManaAppShell ===
            "function"
        ) {
          window.enforceManaAppShell();
        }
      } catch (error) {
        console.warn(
          "[Mana Phone] Shell restore:",
          error
        );
      } finally {
        restoring = false;
      }
    }, 100);
  }

  /* ======================================
     MANUAL INTRODUCTION
     ====================================== */

  function wrapManualIntro() {
    const original =
      window.openManaIntroduction;

    if (typeof original !== "function") {
      return;
    }

    if (original.__manaV919Wrapped) {
      return;
    }

    function wrapped(...args) {
      manualIntro = true;

      if (manualTimer !== null) {
        clearTimeout(manualTimer);
      }

      const result =
        original.apply(this, args);

      manualTimer = setTimeout(() => {
        manualIntro = false;
        manualTimer = null;
      }, 1200);

      return result;
    }

    wrapped.__manaV919Wrapped = true;

    window.openManaIntroduction = wrapped;
  }

  /* ======================================
     ENTER AND LOGOUT
     ====================================== */

  function watchEnterButton() {
    document.addEventListener(
      "click",
      event => {
        if (
          event.target?.closest?.(
            "#manaV81Enter"
          )
        ) {
          markEntered();
          manualIntro = false;

          if (manualTimer !== null) {
            clearTimeout(manualTimer);
            manualTimer = null;
          }
        }
      },
      true
    );
  }

  function watchLogout() {
    window.addEventListener(
      "mana:logout",
      () => {
        clearEntered();
        manualIntro = false;

        if (resumeTimer !== null) {
          clearTimeout(resumeTimer);
          resumeTimer = null;
        }

        if (manualTimer !== null) {
          clearTimeout(manualTimer);
          manualTimer = null;
        }
      }
    );
  }

  /* ======================================
     INTRO WATCHER
     ====================================== */

  function watchIntro() {
    const target = intro();

    if (!target) return;

    if (introObserver) {
      introObserver.disconnect();
    }

    introObserver = new MutationObserver(() => {
      if (
        target.classList.contains("open") &&
        !manualIntro &&
        hasEnteredMana()
      ) {
        scheduleResumeCheck();
      }
    });

    introObserver.observe(target, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  /* ======================================
     SAFARI RESUME
     ====================================== */

  function scheduleResumeCheck() {
    if (!hasEnteredMana()) return;

    /*
     Coalesce consecutive browser events.

     Safari may fire focus, pageshow and
     visibilitychange together.

     They must not launch three separate
     chains of screen restoration.
    */

    if (resumeTimer !== null) {
      clearTimeout(resumeTimer);
    }

    resumeTimer = setTimeout(() => {
      resumeTimer = null;

      /*
       We only act when Introduction is
       actually visible unexpectedly.

       If the user is already in Home,
       Overview, Workouts or Profile,
       leave that screen completely alone.
      */

      if (introOpen()) {
        closeAutoIntro();
      }
    }, 120);
  }

  function watchPhone() {
    document.addEventListener(
      "visibilitychange",
      () => {
        if (
          document.visibilityState ===
          "visible"
        ) {
          scheduleResumeCheck();
        }
      }
    );

    window.addEventListener(
      "pageshow",
      scheduleResumeCheck
    );

    window.addEventListener(
      "focus",
      scheduleResumeCheck
    );
  }

  /* ======================================
     STARTUP
     ====================================== */

  function init() {
    wrapManualIntro();

    /*
     Retain bounded setup retries for
     the original Introduction function.
    */

    [200, 600, 1200].forEach(delay => {
      setTimeout(
        wrapManualIntro,
        delay
      );
    });

    watchEnterButton();
    watchLogout();
    watchIntro();
    watchPhone();

    if (hasEnteredMana()) {
      scheduleResumeCheck();
    }

    window.MANA_PHONE_RESUME_BUILD = BUILD;

    console.log(
      "[Mana Movement] Phone resume " +
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
