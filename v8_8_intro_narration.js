/* =========================================
   MANA MOVEMENT TRAINING v8.8
   INTRO NARRATION

   12 SECOND OPENING SPACE
   TE REO MĀORI + ENGLISH MEANING
   AMBIENT MUSIC DUCKING
   ========================================= */

(() => {
  "use strict";


  const INTRO_ID =
    "manaV81Intro";

  const AUDIO_ID =
    "manaIntroAmbient";

  const SOUND_KEY =
    "mana-intro-sound-enabled";


  let timers =
    [];

  let sequenceActive =
    false;


  /* =========================================
     CONTENT
     ========================================= */

  const WHAKATAUKI_MAORI =
    "Whāia te iti kahurangi, ki te tūohu koe, me he maunga teitei.";


  const WHAKATAUKI_ENGLISH =
    "Pursue what is precious, and if you bow your head, let it be to a lofty mountain.";


  const KARAKIA_MAORI =
    "Whakataka te hau ki te uru. " +
    "Whakataka te hau ki te tonga. " +
    "Kia mākinakina ki uta. " +
    "Kia mātaratara ki tai. " +
    "E hī ake ana te atākura. " +
    "He tio, he huka, he hau hū. " +
    "Tihei mauri ora.";


  const KARAKIA_ENGLISH =
    "An opening karakia to clear the way, bring focus and readiness, " +
    "and acknowledge the beginning of a new day and a new journey.";


  /* =========================================
     HELPERS
     ========================================= */

  function soundEnabled() {
    return (
      localStorage.getItem(
        SOUND_KEY
      ) === "1"
    );
  }


  function introIsOpen() {
    return Boolean(
      document
        .getElementById(
          INTRO_ID
        )
        ?.classList
        .contains(
          "open"
        )
    );
  }


  function ambientAudio() {
    return document.getElementById(
      AUDIO_ID
    );
  }


  function setAmbientVolume(
    volume
  ) {
    const audio =
      ambientAudio();


    if (!audio) return;


    audio.volume =
      volume;
  }


  function clearTimers() {
    timers.forEach(
      timer =>
        clearTimeout(
          timer
        )
    );


    timers =
      [];
  }


  function cancelSpeech() {
    if (
      "speechSynthesis" in
      window
    ) {
      window
        .speechSynthesis
        .cancel();
    }
  }


  function stopSequence() {
    clearTimers();

    cancelSpeech();

    sequenceActive =
      false;


    setAmbientVolume(
      0.08
    );
  }


  function later(
    milliseconds,
    callback
  ) {
    const timer =
      setTimeout(
        callback,
        milliseconds
      );


    timers.push(
      timer
    );
  }


  /* =========================================
     VOICES
     ========================================= */

  function voices() {
    if (
      !(
        "speechSynthesis" in
        window
      )
    ) {
      return [];
    }


    return window
      .speechSynthesis
      .getVoices();
  }


  function findMaoriVoice() {
    const list =
      voices();


    return (
      list.find(
        voice =>
          /^mi[-_]/i.test(
            voice.lang ||
            ""
          )
      ) ||

      list.find(
        voice =>
          /maori|māori/i.test(
            voice.name ||
            ""
          )
      ) ||

      list.find(
        voice =>
          /new zealand/i.test(
            voice.name ||
            ""
          )
      ) ||

      list.find(
        voice =>
          /^en[-_]NZ/i.test(
            voice.lang ||
            ""
          )
      ) ||

      null
    );
  }


  function findEnglishVoice() {
    const list =
      voices();


    return (
      list.find(
        voice =>
          /^en[-_]NZ/i.test(
            voice.lang ||
            ""
          )
      ) ||

      list.find(
        voice =>
          /new zealand/i.test(
            voice.name ||
            ""
          )
      ) ||

      list.find(
        voice =>
          /^en[-_]AU/i.test(
            voice.lang ||
            ""
          )
      ) ||

      list.find(
        voice =>
          /^en/i.test(
            voice.lang ||
            ""
          )
      ) ||

      null
    );
  }


  /* =========================================
     SPEAK
     ========================================= */

  function speak(
    text,
    language,
    type,
    onEnd
  ) {
    if (
      !introIsOpen() ||
      !soundEnabled()
    ) {
      return;
    }


    if (
      !(
        "speechSynthesis" in
        window
      )
    ) {
      return;
    }


    const utterance =
      new SpeechSynthesisUtterance(
        text
      );


    utterance.lang =
      language;


    utterance.rate =
      type === "maori"
        ? 0.72
        : 0.82;


    utterance.pitch =
      0.88;


    utterance.volume =
      1;


    const voice =
      type === "maori"
        ? findMaoriVoice()
        : findEnglishVoice();


    if (voice) {
      utterance.voice =
        voice;
    }


    utterance.onstart =
      () => {

        /*
          Drop background ambience
          while narration is speaking.
        */

        setAmbientVolume(
          0.025
        );
      };


    utterance.onend =
      () => {

        setAmbientVolume(
          0.08
        );


        if (
          typeof onEnd ===
          "function"
        ) {
          onEnd();
        }
      };


    utterance.onerror =
      () => {

        setAmbientVolume(
          0.08
        );


        if (
          typeof onEnd ===
          "function"
        ) {
          onEnd();
        }
      };


    window
      .speechSynthesis
      .speak(
        utterance
      );
  }


  /* =========================================
     PAGE POSITION
     ========================================= */

  function scrollToWhakatauki() {
    const intro =
      document.getElementById(
        INTRO_ID
      );


    const quote =
      intro
        ?.querySelector(
          ".mana-v81-quote"
        );


    quote
      ?.scrollIntoView({
        behavior:
          "smooth",

        block:
          "center"
      });
  }


  function scrollToKarakia() {
    const intro =
      document.getElementById(
        INTRO_ID
      );


    const karakia =
      intro
        ?.querySelector(
          ".mana-v81-karakia"
        );


    karakia
      ?.scrollIntoView({
        behavior:
          "smooth",

        block:
          "center"
      });
  }


  /* =========================================
     NARRATION SEQUENCE
     ========================================= */

  function startSequence() {
    stopSequence();


    if (
      !introIsOpen() ||
      !soundEnabled()
    ) {
      return;
    }


    sequenceActive =
      true;


    /*
      0–12 seconds:
      ambience only.

      Gives the client time to
      read and settle into the intro.
    */


    later(
      12000,
      () => {

        if (
          !sequenceActive
        ) return;


        scrollToWhakatauki();


        speak(
          WHAKATAUKI_MAORI,
          "mi-NZ",
          "maori",

          () => {

            /*
              Short pause before
              English meaning.
            */

            later(
              2200,
              () => {

                speak(
                  WHAKATAUKI_ENGLISH,
                  "en-NZ",
                  "english",

                  () => {

                    /*
                      Longer reflective
                      space between sections.
                    */

                    later(
                      9000,
                      () => {

                        scrollToKarakia();


                        speak(
                          KARAKIA_MAORI,
                          "mi-NZ",
                          "maori",

                          () => {

                            later(
                              2500,
                              () => {

                                speak(
                                  KARAKIA_ENGLISH,
                                  "en-NZ",
                                  "english",

                                  () => {

                                    setAmbientVolume(
                                      0.08
                                    );


                                    sequenceActive =
                                      false;
                                  }
                                );

                              }
                            );

                          }
                        );

                      }
                    );

                  }
                );

              }
            );

          }
        );

      }
    );
  }


  /* =========================================
     WATCH INTRO
     ========================================= */

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
      new MutationObserver(
        () => {

          const isOpen =
            intro.classList.contains(
              "open"
            );


          if (
            isOpen &&
            !wasOpen
          ) {

            later(
              350,
              startSequence
            );
          }


          if (
            !isOpen &&
            wasOpen
          ) {

            stopSequence();
          }


          wasOpen =
            isOpen;

        }
      );


    observer.observe(
      intro,
      {
        attributes:
          true,

        attributeFilter:[
          "class"
        ]
      }
    );


    /*
      Intro may already be open
      when this file loads.
    */

    if (
      wasOpen &&
      soundEnabled()
    ) {

      later(
        600,
        startSequence
      );
    }
  }


  /* =========================================
     SOUND BUTTON
     ========================================= */

  function watchSoundButton() {
    document.addEventListener(
      "click",

      event => {

        if (
          !event.target.closest(
            "#manaV82Sound"
          )
        ) {
          return;
        }


        /*
          v8.2 changes localStorage
          during the same click.
        */

        later(
          150,
          () => {

            if (
              soundEnabled() &&
              introIsOpen()
            ) {

              startSequence();

            } else {

              stopSequence();
            }

          }
        );

      }
    );
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {
    watchSoundButton();


    /*
      v8.1 creates the intro
      shortly after DOM load.
    */

    later(
      1100,
      watchIntro
    );


    /*
      Load browser voices.
    */

    if (
      "speechSynthesis" in
      window
    ) {

      window
        .speechSynthesis
        .getVoices();


      window
        .speechSynthesis
        .addEventListener(
          "voiceschanged",
          () => {
            voices();
          }
        );
    }
  }


  window.stopManaIntroNarration =
    stopSequence;


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
