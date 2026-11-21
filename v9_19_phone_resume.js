
/*
=========================================
MANA MOVEMENT TRAINING v9.19.2
PHONE RESUME + DOB STARTUP
BUILD 91902

COMPLETE REPLACEMENT:
v9_19_phone_resume.js

PRESERVES
- Working Safari flicker fix
- Manual Introduction
- Login Introduction
- App resume protection
- Existing screens and navigation

ADDS
- Authenticated DOB preloading
- Account-scoped DOB storage
- Profile DOB restoration after opening
- No periodic app-shell redraws
- No program navigation changes
=========================================
*/

(() => {
  "use strict";

  const BUILD = "91902";
  const FLAG = "MANA_PHONE_RESUME_91902";

  if (window[FLAG]) return;
  window[FLAG] = true;

  const INTRO_ID = "manaV81Intro";
  const ENTERED_KEY = "mana-v919-entered-mana";
  const DOB_TABLE = "client_extended_profiles";

  let manualIntro = false;
  let restoring = false;
  let resumeTimer = null;
  let manualTimer = null;
  let introObserver = null;

  let dobUserId = "";
  let savedDOB = "";
  let dobLoading = false;
  let dobLoaded = false;
  let profileObserver = null;

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
      localStorage.setItem(ENTERED_KEY,"1");
    } catch (_) {}
  }

  function clearEntered() {
    try {
      localStorage.removeItem(ENTERED_KEY);
    } catch (_) {}
  }

  /* ======================================
     SAFARI INTRO PROTECTION
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
     The app shell is enforced only
     after an unwanted Intro has closed.

     It is never refreshed repeatedly
     just because Safari gains focus.
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
    },100);
  }

  /* ======================================
     MANUAL INTRODUCTION
     ====================================== */

  function wrapManualIntro() {
    const original = window.openManaIntroduction;

    if (typeof original !== "function") return;
    if (original.__manaV919Wrapped) return;

    function wrapped(...args) {
      manualIntro = true;

      if (manualTimer !== null) {
        clearTimeout(manualTimer);
      }

      const result = original.apply(this,args);

      manualTimer = setTimeout(() => {
        manualIntro = false;
        manualTimer = null;
      },1200);

      return result;
    }

    wrapped.__manaV919Wrapped = true;

    window.openManaIntroduction = wrapped;
  }

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

        dobUserId = "";
        savedDOB = "";
        dobLoaded = false;

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

    introObserver.observe(target,{
      attributes:true,
      attributeFilter:["class"]
    });
  }

  /* ======================================
     COALESCED SAFARI RESUME
     ====================================== */

  function scheduleResumeCheck() {
    if (!hasEnteredMana()) return;

    if (resumeTimer !== null) {
      clearTimeout(resumeTimer);
    }

    resumeTimer = setTimeout(() => {
      resumeTimer = null;

      if (introOpen()) {
        closeAutoIntro();
      }
    },120);
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
     DATE OF BIRTH VALIDATION
     ====================================== */

  function validDOB(value) {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(
        String(value || "")
      )
    ) return false;

    const date = new Date(
      value + "T12:00:00"
    );

    return (
      !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0,10) ===
        value &&
      date <= new Date()
    );
  }

  function dobKey() {
    return dobUserId
      ? "mana-dob-secure-scope-" + dobUserId
      : "";
  }

  function rememberDOB(value) {
    if (
      !dobUserId ||
      !validDOB(value)
    ) return;

    savedDOB = value;

    try {
      localStorage.setItem(
        dobKey(),
        value
      );
    } catch (error) {
      console.warn(
        "[Mana DOB] Local storage:",
        error
      );
    }
  }

  /* ======================================
     RESTORE THE ORIGINAL DATE FIELD
     ====================================== */

  function restoreDOB() {
    const screen = $("manaProfileScreen");
    const input = $("me-dob");

    if (
      !dobUserId ||
      !screen?.classList.contains("open") ||
      !input ||
      !validDOB(savedDOB)
    ) return;

    if (document.activeElement === input) {
      return;
    }

    /*
     Do not replace a valid date already
     displayed by the Profile loader.
    */

    if (validDOB(input.value)) {
      return;
    }

    input.value = savedDOB;

    /*
     Inform the existing DOB/Age
     display without creating any
     additional controls or icons.
    */

    input.dispatchEvent(
      new Event("input",{
        bubbles:true
      })
    );

    input.dispatchEvent(
      new Event("change",{
        bubbles:true
      })
    );
  }

  /* ======================================
     PRELOAD DOB AFTER AUTHENTICATION
     ====================================== */

  async function preloadDOB() {
    if (dobLoading) return;

    if (
      typeof window.supabaseClient !==
      "function"
    ) return;

    dobLoading = true;

    try {
      const client =
        await window.supabaseClient();

      const auth =
        await client.auth.getUser();

      const account =
        auth.data?.user?.id || "";

      if (!account) {
        dobUserId = "";
        savedDOB = "";
        dobLoaded = false;
        return;
      }

      if (dobUserId !== account) {
        dobUserId = account;
        savedDOB = "";
        dobLoaded = false;
      }

      let local = "";

      try {
        local =
          localStorage.getItem(
            dobKey()
          ) || "";
      } catch (_) {}

      if (validDOB(local)) {
        savedDOB = local;
      }

      /*
       Load from Supabase even when
       Profile has never been opened.
      */

      const result = await client
        .from(DOB_TABLE)
        .select("details")
        .eq("user_id",account)
        .maybeSingle();

      if (result.error) {
        throw result.error;
      }

      /*
       Never apply a response belonging
       to an account that has since
       signed out or changed.
      */

      const current =
        await client.auth.getUser();

      if (
        current.data?.user?.id !== account ||
        dobUserId !== account
      ) return;

      const cloudDOB =
        result.data?.details?.dob;

      if (validDOB(cloudDOB)) {
        rememberDOB(cloudDOB);
      }

      dobLoaded = true;

      restoreDOB();

    } catch (error) {
      console.warn(
        "[Mana DOB] Startup load:",
        error.message || error
      );
    } finally {
      dobLoading = false;
    }
  }

  /* ======================================
     PROFILE OPENING
     ====================================== */

  function profileOpen() {
    return !!$("manaProfileScreen")
      ?.classList.contains("open");
  }

  function restoreAfterProfileOpens() {
    if (!profileOpen()) return;

    restoreDOB();

    /*
     These checks follow existing
     asynchronous Profile loading.
     They do not rerender any screen.
    */

    [150,450,950].forEach(delay => {
      setTimeout(() => {
        if (profileOpen()) {
          restoreDOB();
        }
      },delay);
    });
  }

  function watchProfile() {
    const screen = $("manaProfileScreen");

    if (!screen) return;

    if (profileObserver) {
      profileObserver.disconnect();
    }

    profileObserver = new MutationObserver(() => {
      if (profileOpen()) {
        if (!dobLoaded) {
          void preloadDOB();
        }

        restoreAfterProfileOpens();
      }
    });

    profileObserver.observe(screen,{
      attributes:true,
      attributeFilter:["class"]
    });
  }

  function watchDOBInput() {
    document.addEventListener(
      "input",
      event => {
        if (event.target?.id === "me-dob") {
          rememberDOB(event.target.value);
        }
      },
      true
    );

    document.addEventListener(
      "change",
      event => {
        if (event.target?.id === "me-dob") {
          rememberDOB(event.target.value);
        }
      },
      true
    );

    window.addEventListener(
      "mana:extended-profile-saved",
      () => {
        const value = $("me-dob")?.value;

        if (validDOB(value)) {
          rememberDOB(value);
        }

        restoreDOB();
      }
    );

    window.addEventListener(
      "mana:profile-synced",
      restoreDOB
    );
  }

  /* ======================================
     STARTUP
     ====================================== */

  function init() {
    wrapManualIntro();

    [200,600,1200].forEach(delay => {
      setTimeout(wrapManualIntro,delay);
    });

    watchEnterButton();
    watchLogout();
    watchIntro();
    watchPhone();

    watchProfile();
    watchDOBInput();

    /*
     Initialise DOB on app startup,
     not only when Profile opens.
    */

    void preloadDOB();

    /*
     One bounded authentication retry
     if the login session wasn't ready.
    */

    [400,1200,2400].forEach(delay => {
      setTimeout(() => {
        if (!dobLoaded) {
          void preloadDOB();
        }
      },delay);
    });

    window.addEventListener(
      "pageshow",
      () => {
        if (!dobLoaded) {
          void preloadDOB();
        }

        restoreDOB();
      }
    );

    if (hasEnteredMana()) {
      scheduleResumeCheck();
    }

    window.MANA_PHONE_RESUME_BUILD = BUILD;

    console.log(
      "[Mana Movement] Phone resume " +
      BUILD +
      " ready"
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
