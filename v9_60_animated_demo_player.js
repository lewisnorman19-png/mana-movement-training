
/* MANA MOVEMENT TRAINING — v9.60.3
   Lateral Raise Demo Player: self-contained replacement.
   Reuses assets/exercises/lateral-raise-demo.png; no new PNGs required.
   Does not alter workout logs, Fuel, or authentication.
*/
(() => {
  'use strict';

  const BUILD = '96030';
  const IMAGE = 'assets/exercises/lateral-raise-demo.png';
  const STYLE_ID = 'mana-v960-demo-player-style';
  const MODAL_ID = 'manaV955DemoModal';
  const CONTENT_ID = 'manaV955Demo';
  const TITLE_ID = 'manaV955Title';

  let framesPromise = null;
  let activePlayer = null;
  let observedContent = null;
  let scheduled = null;

  function matchingName() {
    const text = document.getElementById(TITLE_ID)?.textContent?.trim() || '';
    return /lateral\s*raise|side\s*raise|side\s*lateral/i.test(text)
      ? text
      : null;
  }

  function installStyle() {
    document.getElementById(STYLE_ID)?.remove();

    const style = document.createElement('style');
    style.id = STYLE_ID;

    style.textContent = `
      .mana-v960-player {
        margin: 12px 0 0;
        background: #090909;
        border: 1px solid #806723;
        border-radius: 16px;
        overflow: hidden;
      }

      .mana-v960-stage {
        position: relative;
        height: 430px;
        background: #080808;
        overflow: hidden;
      }

      .mana-v960-frame {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        opacity: 0;
        transition: opacity .5s ease;
      }

      .mana-v960-player[data-pose="start"]
      .mana-v960-frame.start,
      .mana-v960-player[data-pose="finish"]
      .mana-v960-frame.finish {
        opacity: 1;
      }

      .mana-v960-pose-badge {
        position: absolute;
        top: 12px;
        left: 12px;
        z-index: 2;
        padding: 8px 12px;
        border: 1px solid #806723;
        border-radius: 20px;
        background: #131109;
        color: #f6ce54;
        font-size: 12px;
        font-weight: 900;
      }

      .mana-v960-controls {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        padding: 12px;
      }

      .mana-v960-btn {
        min-height: 48px;
        border: 1px solid #806723;
        border-radius: 12px;
        background: #1d180b;
        color: #f6ce54;
        font-size: 12px;
        font-weight: 900;
        cursor: pointer;
      }

      .mana-v960-cue {
        grid-column: 1 / -1;
        color: #ccc;
        text-align: center;
        line-height: 1.5;
        font-size: 12px;
      }

      @media (max-width: 600px) {
        .mana-v960-stage {
          height: 380px;
        }

        .mana-v960-controls {
          gap: 8px;
          padding: 10px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .mana-v960-frame {
          transition: none;
        }
      }
    `;

    document.head.append(style);
  }

  /* =========================================
     LOAD AND SEPARATE THE EXISTING ARTWORK
     ========================================= */

  function loadFrames() {
    if (framesPromise) return framesPromise;

    framesPromise = new Promise((resolve, reject) => {
      const source = new Image();

      source.onload = () => {
        try {
          const w = source.naturalWidth;
          const h = source.naturalHeight;

          const regions = [
            [w * .025, h * .125, w * .38, h * .565],
            [w * .36, h * .125, w * .63, h * .565]
          ];

          const frames = regions.map(([x, y, cw, ch]) => {
            const canvas = document.createElement('canvas');

            canvas.width = Math.round(cw);
            canvas.height = Math.round(ch);

            const ctx = canvas.getContext('2d');

            if (!ctx) {
              throw new Error('Image processing unavailable');
            }

            ctx.drawImage(
              source,
              x,
              y,
              cw,
              ch,
              0,
              0,
              canvas.width,
              canvas.height
            );

            return canvas.toDataURL('image/png');
          });

          resolve(frames);

        } catch (err) {
          reject(err);
        }
      };

      source.onerror = () => {
        reject(new Error('Demo illustration not found'));
      };

      source.src = IMAGE;
    }).catch(err => {
      framesPromise = null;
      throw err;
    });

    return framesPromise;
  }

  /* =========================================
     BUILD PLAYER
     ========================================= */

  function createPlayer(name, frames) {
    const player = document.createElement('div');

    player.className = 'mana-v960-player';
    player.dataset.exercise = name;
    player.dataset.pose = 'start';

    const stage = document.createElement('div');
    stage.className = 'mana-v960-stage';

    const start = document.createElement('img');
    start.className = 'mana-v960-frame start';
    start.alt = 'Lateral raise: dumbbells lowered at sides';
    start.src = frames[0];

    const finish = document.createElement('img');
    finish.className = 'mana-v960-frame finish';
    finish.alt = 'Lateral raise: arms lifted to shoulder height';
    finish.src = frames[1];

    const badge = document.createElement('div');
    badge.className = 'mana-v960-pose-badge';
    badge.textContent = 'START';

    stage.append(start, finish, badge);

    /* =========================================
       PLAY / PAUSE / REPLAY
       ========================================= */

    const controls = document.createElement('div');
    controls.className = 'mana-v960-controls';

    const playButton = document.createElement('button');
    playButton.type = 'button';
    playButton.className = 'mana-v960-btn';
    playButton.textContent = '▶ PLAY DEMO';

    const replayButton = document.createElement('button');
    replayButton.type = 'button';
    replayButton.className = 'mana-v960-btn';
    replayButton.textContent = '↻ REPLAY';

    const cue = document.createElement('div');
    cue.className = 'mana-v960-cue';
    cue.textContent =
      'Lift under control to shoulder height; lower slowly. Avoid swinging.';

    controls.append(playButton, replayButton, cue);
    player.append(stage, controls);

    let interval = null;
    let timeout = null;
    let running = false;

    function setPose(pose) {
      player.dataset.pose = pose;
      badge.textContent = pose.toUpperCase();
    }

    function pause() {
      running = false;

      if (interval !== null) {
        clearInterval(interval);
      }

      if (timeout !== null) {
        clearTimeout(timeout);
      }

      interval = null;
      timeout = null;

      playButton.textContent = '▶ PLAY DEMO';
    }

    function cycle() {
      setPose('start');

      timeout = setTimeout(() => {
        if (running) {
          setPose('finish');
        }
      }, 1550);
    }

    function play() {
      if (running) {
        pause();
        return;
      }

      running = true;
      playButton.textContent = '❚❚ PAUSE';

      cycle();
      interval = setInterval(cycle, 3400);
    }

    playButton.addEventListener('click', play);

    replayButton.addEventListener('click', () => {
      pause();
      setPose('start');
      play();
    });

    player.pauseDemo = pause;

    return player;
  }

  /* =========================================
     UPGRADE EXISTING DEMO POPUP
     ========================================= */

  async function upgrade() {
    const modal = document.getElementById(MODAL_ID);
    const demo = document.getElementById(CONTENT_ID);
    const name = matchingName();

    if (
      !modal?.classList.contains('open') ||
      !demo ||
      !name
    ) {
      return;
    }

    if (
      demo.querySelector('.mana-v960-player')
        ?.dataset.exercise === name
    ) {
      return;
    }

    try {
      const frames = await loadFrames();

      if (
        !modal.classList.contains('open') ||
        matchingName() !== name
      ) {
        return;
      }

      if (
        demo.querySelector('.mana-v960-player')
          ?.dataset.exercise === name
      ) {
        return;
      }

      activePlayer?.pauseDemo?.();

      const player = createPlayer(name, frames);

      demo.replaceChildren(player);
      activePlayer = player;

    } catch (error) {
      console.warn('Mana demo player:', error);
    }
  }

  /* =========================================
     WATCH FOR EXERCISE DEMO OPENING
     ========================================= */

  function observeModal() {
    const demo = document.getElementById(CONTENT_ID);

    if (!demo || demo === observedContent) {
      return;
    }

    observedContent = demo;

    const observer = new MutationObserver(() => {
      if (!demo.querySelector('.mana-v960-player')) {
        if (scheduled) {
          clearTimeout(scheduled);
        }

        scheduled = setTimeout(upgrade, 80);
      }
    });

    observer.observe(demo, {
      childList: true
    });
  }

  /* =========================================
     INITIALISE
     ========================================= */

  function init() {
    installStyle();
    observeModal();

    document.addEventListener('click', event => {
      if (
        event.target.closest(
          '.mana-v955-demo-button,.mana-v957-demo-button'
        )
      ) {
        observeModal();

        setTimeout(upgrade, 150);
        setTimeout(upgrade, 450);
      }

      if (
        event.target.closest('#manaV955Close') ||
        event.target.id === MODAL_ID
      ) {
        activePlayer?.pauseDemo?.();
      }
    });

    window.MANA_ANIMATED_DEMO_PLAYER_BUILD = BUILD;
    window.refreshManaAnimatedDemoPlayer = upgrade;
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      init,
      { once: true }
    );
  } else {
    init();
  }

})();
