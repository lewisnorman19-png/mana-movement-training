/* =========================================
   MANA MOVEMENT TRAINING v8.8
   INTRO NARRATION v2

   SPEECH ENGINE UNLOCK
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

  let speechUnlocked =
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


  /* =========================================
     SPEECH UNLOCK
     ========================================= */

  function unlockSpeech() {
    if (
      !(
        "speechSynthesis" in
        window
      )
    ) {
      return;
    }


    try {

      const unlock =
        new SpeechSynthesisUtterance(
          " "
        );


      unlock.volume =
        0;


      unlock.rate =
        10;


      unlock.onend =
        () => {
          speechUnlocked =
            true;
        };


      unlock.onerror =
        () => {
          /*
            Still mark ready.
            Some browsers reject
            silent utterances but
            initialise the engine.
          */

          speechUnlocked =
            true;
        };


      window
        .speechSynthesis
        .speak(
          unlock
        );


      speechUnlocked =
        true;

    } catch (_) {

      speechUnlocked =
        true;

    }
  }


  /* =========================================
     VOICES
     ========================================= */

  function getVoices() {
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
      getVoices();


    return (

      list.find(
        voice =>
          /^mi[-_]/i.test(
            voice.lang ||
            ""
          )
      )

      ||

      list.find(
        voice =>
          /māori|maori/i.test(
            voice.name ||
            ""
          )
      )

      ||

      list.find(
        voice =>
          /^en[-_]NZ/i.test(
            voice.lang ||
            ""
          )
      )

      ||

      list.find(
        voice =>
          /new zealand/i.test(
            voice.name ||
            ""
          )
      )

      ||

      list.find(
        voice =>
          /^en[-_]AU/i.test(
            voice.lang ||
            ""
          )
      )

      ||

      list[0]

      ||

      null
    );
  }


  function findEnglishVoice() {
    const list =
      getVoices();


    return (

      list.find(
        voice =>
          /^en[-_]NZ/i.test(
            voice.lang ||
            ""
          )
      )

      ||

      list.find(
        voice =>
          /new zealand/i.test(
            voice.name ||
            ""
          )
      )

      ||

      list.find(
        voice =>
          /^en[-_]AU/i.test(
            voice.lang ||
            ""
          )
      )

      ||

      list.find(
        voice =>
          /^en/i.test(
            voice.lang ||
            ""
          )
      )

      ||

      list[0]

      ||

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
      !sequenceActive ||
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


    const synth =
      window.speechSynthesis;


    /*
      Clear anything left in
      the speech queue.
    */

    synth.cancel();


    const utterance =
      new SpeechSynthesisUtterance(
        text
      );


    utterance.lang =
      language;


    utterance.rate =
      type === "maori"
        ? 0.74
        : 0.84;


    utterance.pitch =
      0.9;


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

        setAmbientVolume(
          0.02
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
      event => {

        console.warn(
          "Mana narration speech error:",
          event.error
        );


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


    /*
      Small delay after cancel()
      helps Edge / Chrome reliably
      accept the next utterance.
    */

    setTimeout(
      () => {

        if (
          sequenceActive &&
          introIsOpen() &&
          soundEnabled()
        ) {

          synth.speak(
            utterance
          );

        }

      },
      80
    );
  }


  /* =========================================
     SCROLL
     ========================================= */

  function scrollToWhakatauki() {
    const quote =
      document
        .getElementById(
          INTRO_ID
        )
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
    const karakia =
      document
        .getElementById(
          INTRO_ID
        )
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
     SEQUENCE
     ========================================= */

  function startSequence() {
    clearTimers();

    cancelSpeech();


    if (
      !introIsOpen() ||
      !soundEnabled()
    ) {
      return;
    }


    sequenceActive =
      true;


    /*
      12 seconds of ambience first.
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
              Pause before English.
            */

            later(
              2500,
              () => {

                speak(
                  WHAKATAUKI_ENGLISH,
                  "en-NZ",
                  "english",

                  () => {

                    /*
                      Reflective pause
                      before karakia.
                    */

                    later(
                      9000,
                      () => {

                        if (
                          !sequenceActive
                        ) return;


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
     SOUND BUTTON
     ========================================= */

  function watchSoundButton() {
    document.addEventListener(
      "click",

      event => {

        const button =
          event.target.closest(
            "#manaV82Sound"
          );


        if (!button) {
          return;
        }


        /*
          IMPORTANT:
          Unlock speech during the
          physical user tap.
        */

        unlockSpeech();


        /*
          v8.2 toggles the sound state
          during the same click.
        */

        later(
          180,
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
     INTRO WATCH
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

            /*
              If speech has already been
              unlocked during this visit,
              restart automatically.
            */

            if (
              soundEnabled() &&
              speechUnlocked
            ) {

              later(
                400,
                startSequence
              );

            }
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
  }


  /* =========================================
     INIT
     ========================================= */

  function init() {
    watchSoundButton();


    later(
      1100,
      watchIntro
    );


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
          getVoices
        );

    }
  }


  window.stopManaIntroNarration =
    stopSequence;


  window.startManaIntroNarration =
    startSequence;


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
