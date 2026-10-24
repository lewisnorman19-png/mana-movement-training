
/* Mana Movement Training — Integrated Finishers 103430
   FULL replacement for mana_strength_integrated_finishers_103380.js */
(() => {
  'use strict';
  if (window.MANA_FINISHERS_103430) return;
  window.MANA_FINISHERS_103430 = true;

  const LOG = 'mana-strength-v64-logs';
  const BLUE = '#368FD4', GOLD = '#D6A437';
  const $ = id => document.getElementById(id);

  const routines = [
    [
      ['Dead bugs','10 per side'],
      ['Standard plank','30 seconds'],
      ['Crunches','15 reps']
    ],
    [
      ['Russian twists','20 total'],
      ['Side plank','25 seconds per side'],
      ['Hanging knee raises','10 reps']
    ],
    [
      ['Mountain climbers','30 seconds'],
      ['Reverse crunches','15 reps'],
      ['Plank shoulder taps','20 total']
    ],
    [
      ['Plate sit-ups','12 reps'],
      ['Bicycle crunches','20 total'],
      ['Side plank','30 seconds per side']
    ]
  ];

  let mode = 'Bike';
  let minutes = 15;
  let kind = null;
  let round = 0;

  let ticks = [
    new Set(),
    new Set(),
    new Set()
  ];

  let finishers = {};
  let sessionKey = '';
  let lastLoggedId = '';
  let placementPending = false;
  let progressPending = false;

  const readLogs = () => {
    try {
      const a = JSON.parse(
        localStorage.getItem(LOG) || '[]'
      );

      return Array.isArray(a) ? a : [];
    } catch {
      return [];
    }
  };

  const clone = data =>
    JSON.parse(JSON.stringify(data));

  const mobile = () =>
    matchMedia('(max-width:700px)').matches;

  const workoutName = () =>
    ($('manaV64Title')?.textContent || 'Strength A').trim();

  const letter = () => {
    const m = workoutName().match(
      /(?:strength|workout|session)\s*([ABCD])\b/i
    );

    return m ? m[1].toUpperCase() : 'A';
  };

  const week = () => {
    const d = new Date();
    const jan = new Date(d.getFullYear(), 0, 1);

    return Math.floor(
      (d - jan) / 604800000
    ) % 4 + 1;
  };

  const exercises = () =>
    routines[
      ((('ABCD'.indexOf(letter()) + 4) % 4)
        + week() - 1) % 4
    ];

  const ready = () =>
    ticks[round].size === exercises().length;

  function reset() {
    kind = null;
    round = 0;

    ticks = [
      new Set(),
      new Set(),
      new Set()
    ];

    finishers = {};
    sessionKey = workoutName() + '|' + Date.now();

    const panel = $('mf430Panel');

    if (panel) panel.innerHTML = '';

    showSaved();
  }

  function css() {
    if ($('mf430Style')) return;

    const el = document.createElement('style');
    el.id = 'mf430Style';

    el.textContent = `
      #mf430Section {
        margin: 18px 0;
        padding: 16px;
        border: 1px solid #37404b;
        border-radius: 15px;
        background: #10151b;
        color: #fff;
        box-sizing: border-box;
      }

      #mf430Section * {
        box-sizing: border-box;
      }

      #mf430Section button {
        cursor: pointer;
      }

      .mf430-pair {
        display: grid;
        grid-template-columns: repeat(2,minmax(0,1fr));
        gap: 10px;
      }

      .mf430-main {
        min-width: 0;
        min-height: 86px;
        border: 1.5px solid var(--accent);
        border-radius: 11px;
        background: color-mix(
          in srgb,
          var(--accent) 11%,
          #0d141a
        );
        color: var(--accent);
        font-weight: 900;
        font-size: 13px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 7px;
      }

      .mf430-main small {
        color: #bfcbd5;
        font-size: 11px;
        font-weight: 400;
      }

      .mf430-panel {
        margin-top: 14px;
        padding: 14px;
        border: 1px solid var(--accent);
        border-radius: 11px;
        background: #0d131a;
      }

      .mf430-panel h3 {
        margin: 0 0 9px;
        color: var(--accent);
        font-size: 16px;
      }

      .mf430-muted {
        color: #acb8c4;
        font-size: 12px;
        line-height: 1.5;
      }

      .mf430-options {
        display: grid;
        grid-template-columns: repeat(2,minmax(0,1fr));
        gap: 8px;
        margin: 12px 0;
      }

      .mf430-durations {
        display: grid;
        grid-template-columns: repeat(3,minmax(0,1fr));
        gap: 8px;
        margin: 12px 0;
      }

      .mf430-option,
      .mf430-action {
        min-height: 42px;
        padding: 8px;
        border: 1px solid #465461;
        border-radius: 9px;
        background: #1c2731;
        color: white;
        font-size: 12px;
        font-weight: 750;
      }

      .mf430-option.active {
        border-color: var(--accent);
        color: var(--accent);
      }

      .mf430-prescription {
        margin: 12px 0;
        padding: 12px;
        background: #17232d;
        border-radius: 9px;
        color: #d1dae2;
        font-size: 12px;
        line-height: 1.65;
      }

      .mf430-exercise {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 7px 0;
        padding: 12px;
        border: 1px solid #37434f;
        border-radius: 9px;
        font-size: 13px;
      }

      .mf430-exercise input {
        width: 19px;
        height: 19px;
        accent-color: ${GOLD};
      }

      .mf430-exercise small {
        display: block;
        color: #aeb8c4;
        margin-top: 3px;
      }

      .mf430-actions {
        display: grid;
        grid-template-columns: repeat(2,minmax(0,1fr));
        gap: 9px;
        margin-top: 12px;
      }

      .mf430-action.primary {
        background: var(--accent);
        border-color: var(--accent);
        color: #09121a;
      }

      .mf430-action:disabled {
        opacity: .35;
        cursor: not-allowed !important;
      }

      .mf430-done {
        color: #78e5a3;
        font-size: 12px;
        margin-top: 13px;
        font-weight: 800;
      }

      .mf430-roundbar {
        display: flex;
        gap: 7px;
        margin: 11px 0;
      }

      .mf430-roundbar button {
        flex: 1;
        min-width: 0;
        border: 1px solid #4c5660;
        background: #202a34;
        color: #fff;
        padding: 10px 3px;
        border-radius: 8px;
        font-size: 11px;
      }

      .mf430-roundbar button.active {
        border-color: ${GOLD};
        color: ${GOLD};
      }

      #mf430Progress {
        padding: 16px;
        margin: 16px 0;
        background: #11171e;
        border: 1px solid #39424b;
        border-radius: 13px;
      }

      .mf430-track {
        background: #303b45;
        height: 10px;
        border-radius: 20px;
        overflow: hidden;
        margin-top: 7px;
      }

      .mf430-track span {
        display: block;
        height: 100%;
        border-radius: 20px;
      }

      .mf430-metric {
        margin-top: 14px;
        color: #dbe3ea;
        font-size: 13px;
      }

      @media(max-width:700px) {
        #manaV922Feedback > #mf430Section {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 0 18px !important;
        }
      }
    `;

    document.head.appendChild(el);
  }

  function ensure() {
    const complete = $('manaV64Complete');

    if (!complete) return;

    let el = $('mf430Section');

    if (!el) {
      el = document.createElement('section');
      el.id = 'mf430Section';

      el.innerHTML = `
        <b>OPTIONAL FINISHERS</b>

        <p class="mf430-muted">
          Add Cardio, Core or both before
          completing your Strength workout.
        </p>

        <div class="mf430-pair">
          <button
            class="mf430-main"
            style="--accent:${BLUE}"
            data-mf430-open="cardio">
            ♥ CARDIO
            <small>10–20 minutes</small>
          </button>

          <button
            class="mf430-main"
            style="--accent:${GOLD}"
            data-mf430-open="core">
            ◎ CORE
            <small>3 rounds</small>
          </button>
        </div>

        <div id="mf430Panel"></div>
        <div
          id="mf430Saved"
          class="mf430-done">
        </div>
      `;

      complete.before(el);
    }

    $('mf400Section')?.remove();
    $('mf380Section')?.remove();

    place();
  }

  function place() {
    const el = $('mf430Section');
    const done = $('manaV64Complete');
    const feedback = $('manaV922Feedback');

    if (!el || !done) return;

    if (mobile()) {
      if (
        feedback &&
        feedback.firstElementChild !== el
      ) {
        feedback.prepend(el);
      }
    } else if (
      feedback &&
      feedback.parentElement === done.parentElement
    ) {
      if (el.nextElementSibling !== feedback) {
        feedback.before(el);
      }
    } else if (
      el.nextElementSibling !== done
    ) {
      done.before(el);
    }
  }

  function schedulePlace() {
    if (placementPending) return;

    placementPending = true;

    requestAnimationFrame(() => {
      placementPending = false;
      ensure();
    });
  }

  function showSaved() {
    const e = $('mf430Saved');

    if (!e) return;

    const a = [];

    if (finishers.cardio?.completed) {
      a.push(
        `Cardio: ${finishers.cardio.equipment}, ` +
        `${finishers.cardio.durationMinutes} min`
      );
    }

    if (finishers.core?.completed) {
      a.push('Core: 3 rounds');
    }

    e.textContent = a.length
      ? '✓ Added: ' + a.join(' · ')
      : '';
  }

  function cardio() {
    const p = $('mf430Panel');

    if (!p) return;

    const a = {
      A: 'Steady effort',
      B: 'Intervals: brisk and easy',
      C: 'Progressive tempo',
      D: 'Controlled recovery'
    }[letter()];

    const warm = minutes === 10 ? 2 : 3;
    const cool = warm;

    p.innerHTML = `
      <div
        class="mf430-panel"
        style="--accent:${BLUE}">

        <h3>Cardio Finisher</h3>

        <div class="mf430-muted">
          Choose equipment and a
          10–20 minute session.
        </div>

        <div class="mf430-options">
          ${[
            'Bike',
            'Rower',
            'Treadmill',
            'Bodyweight'
          ].map(x => `
            <button
              class="mf430-option
                ${x === mode ? 'active' : ''}"
              data-mf430-mode="${x}">
              ${x}
            </button>
          `).join('')}
        </div>

        <div class="mf430-durations">
          ${[10,15,20].map(n => `
            <button
              class="mf430-option
                ${minutes === n ? 'active' : ''}"
              data-mf430-minutes="${n}">
              ${n} MIN
            </button>
          `).join('')}
        </div>

        <div class="mf430-prescription">
          <strong>
            Strength ${letter()} · Week ${week()}
          </strong>

          <div>${a} — ${mode}</div>
          <div>Warm-up: ${warm} min</div>
          <div>Main set: ${minutes-warm-cool} min</div>
          <div>Cooldown: ${cool} min</div>

          <div>
            Use a controlled effort
            suited to your ability.
          </div>
        </div>

        <div class="mf430-actions">
          <button
            class="mf430-action"
            data-mf430-close>
            CLOSE
          </button>

          <button
            class="mf430-action primary"
            data-mf430-cardio-done>
            LOG COMPLETION
          </button>
        </div>
      </div>
    `;
  }

  function core() {
    const p = $('mf430Panel');

    if (!p) return;

    const list = exercises();

    p.innerHTML = `
      <div
        class="mf430-panel"
        style="--accent:${GOLD}">

        <h3>Core Finisher</h3>

        <div class="mf430-muted">
          Strength ${letter()}
          · Week ${week()}
          · Round ${round+1} of 3
        </div>

        <div class="mf430-roundbar">
          ${[0,1,2].map(i => `
            <button
              class="${i === round ? 'active' : ''}"
              data-mf430-round="${i}">
              Round ${i+1}
              ${ticks[i].size === list.length ? ' ✓' : ''}
            </button>
          `).join('')}
        </div>

        ${list.map(([name,reps],i) => `
          <label class="mf430-exercise">
            <input
              type="checkbox"
              data-mf430-check="${i}"
              ${ticks[round].has(i) ? 'checked' : ''}>

            <span>
              <strong>${name}</strong>
              <small>${reps}</small>
            </span>
          </label>
        `).join('')}

        <div class="mf430-actions">
          <button
            class="mf430-action"
            data-mf430-tick-round>
            TICK ALL ROUND ${round+1}
          </button>

          <button
            class="mf430-action"
            data-mf430-tick-all>
            TICK ALL 3 ROUNDS
          </button>
        </div>

        <div class="mf430-actions">
          <button
            class="mf430-action"
            data-mf430-close>
            CLOSE
          </button>

          <button
            class="mf430-action primary"
            data-mf430-core-next
            ${ready() ? '' : 'disabled'}>
            ${round === 2
              ? 'FINISH CORE'
              : 'NEXT ROUND'}
          </button>
        </div>

        <p class="mf430-muted">
          ${ticks.filter(
            s => s.size === list.length
          ).length} of 3 rounds checked.
          Finish Core to save.
        </p>

      </div>
    `;
  }

  function close() {
    kind = null;
    $('mf430Panel')?.replaceChildren();
  }

  function persistToLatest() {
    if (!Object.keys(finishers).length) {
      return false;
    }

    const logs = readLogs();

    if (!logs.length) return false;

    const last = logs[logs.length - 1];

    const age = Date.now() -
      new Date(last.date).getTime();

    if (
      !last.id ||
      !Number.isFinite(age) ||
      age < 0 ||
      age > 30000
    ) {
      return false;
    }

    const merged = {
      ...(last.finishers || {}),
      ...clone(finishers)
    };

    last.finishers = merged;

    localStorage.setItem(
      LOG,
      JSON.stringify(logs)
    );

    lastLoggedId = String(last.id);

    window.dispatchEvent(
      new CustomEvent(
        'mana:finishers-saved',
        {
          detail: {
            workoutId: last.id,
            finishers: merged
          }
        }
      )
    );

    scheduleProgress();

    return true;
  }

  function completion() {
    const snapshot = clone(finishers);

    if (!Object.keys(snapshot).length) return;

    // Strength saves first, then broadcasts
    // the mana:strength-synced event.
    //
    // Retain finisher state until the save
    // has succeeded.

    const write = () => {
      finishers = {
        ...snapshot,
        ...finishers
      };

      return persistToLatest();
    };

    if (write()) return;

    [100,350,900].forEach(ms =>
      setTimeout(write, ms)
    );
  }

  function totals() {
    const t = {
      cardio: 0,
      core: 0
    };

    const now = new Date();

    const dow = (now.getDay() + 6) % 7;

    const monday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - dow
    );

    for (const l of readLogs()) {
      const d = new Date(l.date);

      if (d < monday || d > now) {
        continue;
      }

      if (l.finishers?.cardio?.completed) {
        t.cardio += Number(
          l.finishers.cardio.actualMinutes ||
          l.finishers.cardio.durationMinutes ||
          0
        );
      }

      if (l.finishers?.core?.completed) {
        t.core++;
      }
    }

    return t;
  }

  function progressOpen() {
    return (
      $('manaV83ProgramShell')
        ?.classList.contains('open')

      &&

      $('manaV83Title')
        ?.textContent.trim().toUpperCase()
        === 'MANA STRENGTH'

      &&

      !!document.querySelector(
        '#manaV83Tabs .mana-v83-tab.active' +
        '[data-v83-tab="progress"]'
      )
    );
  }

  function progress() {
    if (!progressOpen()) return;

    const root = $('manaV993StrengthProgress');

    if (!root) return;

    let el = $('mf430Progress');

    if (!el) {
      el = document.createElement('section');
      el.id = 'mf430Progress';

      const head = root.querySelector(
        '.mana-v993-head'
      );

      if (head) {
        head.after(el);
      } else {
        root.prepend(el);
      }
    }

    const t = totals();

    const cp = Math.max(
      0,
      Math.min(100, t.cardio / 45 * 100)
    );

    const kp = Math.max(
      0,
      Math.min(100, t.core / 3 * 100)
    );

    const html = `
      <b>Cardio & Core — This Week</b>

      <div class="mf430-metric">
        <span style="color:${BLUE}">
          ♥ CARDIO
        </span>
        · ${t.cardio} / 45 min

        <div class="mf430-track">
          <span style="
            width:${cp}%;
            background:${BLUE}">
          </span>
        </div>
      </div>

      <div class="mf430-metric">
        <span style="color:${GOLD}">
          ◎ CORE
        </span>
        · ${t.core} / 3 sessions

        <div class="mf430-track">
          <span style="
            width:${kp}%;
            background:${GOLD}">
          </span>
        </div>
      </div>
    `;

    if (el.innerHTML !== html) {
      el.innerHTML = html;
    }
  }

  function scheduleProgress() {
    if (progressPending) return;

    progressPending = true;

    requestAnimationFrame(() => {
      progressPending = false;
      progress();
    });
  }

  function click(e) {
    const t = e.target;

    if (!(t instanceof Element)) return;

    let x;

    if ((x = t.closest('[data-mf430-open]'))) {
      kind = x.dataset.mf430Open;

      round = 0;

      ticks = [
        new Set(),
        new Set(),
        new Set()
      ];

      kind === 'cardio'
        ? cardio()
        : core();

      return;
    }

    if ((x = t.closest('[data-mf430-mode]'))) {
      mode = x.dataset.mf430Mode;
      cardio();
      return;
    }

    if ((x = t.closest('[data-mf430-minutes]'))) {
      minutes = Number(x.dataset.mf430Minutes);
      cardio();
      return;
    }

    if (t.closest('[data-mf430-cardio-done]')) {
      finishers.cardio = {
        completed: true,
        equipment: mode,
        durationMinutes: minutes,
        actualMinutes: minutes,
        workout: letter(),
        week: week(),
        completedAt: new Date().toISOString()
      };

      showSaved();
      close();
      return;
    }

    if ((x = t.closest('[data-mf430-round]'))) {
      round = Number(x.dataset.mf430Round);
      core();
      return;
    }

    if (t.closest('[data-mf430-tick-round]')) {
      ticks[round] = new Set(
        exercises().map((_,i) => i)
      );

      core();
      return;
    }

    if (t.closest('[data-mf430-tick-all]')) {
      ticks = ticks.map(
        () => new Set(
          exercises().map((_,i) => i)
        )
      );

      core();
      return;
    }

    if (t.closest('[data-mf430-core-next]')) {
      if (!ready()) return;

      if (round < 2) {
        round++;
        core();
        return;
      }

      if (!ticks.every(
        s => s.size === exercises().length
      )) {
        round = ticks.findIndex(
          s => s.size !== exercises().length
        );

        core();
        return;
      }

      finishers.core = {
        completed: true,
        rounds: 3,
        workout: letter(),
        week: week(),
        exercises: exercises().map(
          ([name,target]) => ({
            name,
            target,
            roundsCompleted: 3
          })
        ),
        completedAt: new Date().toISOString()
      };

      showSaved();
      close();
      return;
    }

    if (t.closest('[data-mf430-close]')) {
      close();
      return;
    }

    if (t.closest(
      '#manaV64Complete, .mana-v971-finish'
    )) {
      // Finisher snapshot is retained until
      // the Strength save event fires.
      return;
    }

    if (t.closest(
      '#manaV83Tabs [data-v83-tab="progress"]'
    )) {
      scheduleProgress();
    }
  }

  function change(e) {
    const t = e.target;

    if (
      !(t instanceof HTMLInputElement) ||
      !t.matches('[data-mf430-check]')
    ) {
      return;
    }

    const n = Number(
      t.dataset.mf430Check
    );

    if (t.checked) {
      ticks[round].add(n);
    } else {
      ticks[round].delete(n);
    }

    core();
  }

  function observe() {
    const w = $('manaStrengthV64Workout');

    if (w) {
      let was = w.classList.contains('open');

      new MutationObserver(() => {
        const now = w.classList.contains('open');

        if (now && !was) {
          reset();
          schedulePlace();
        }

        was = now;
      }).observe(w, {
        attributes: true,
        attributeFilter: ['class']
      });
    }

    const exercisesEl = $('manaV64Exercises');

    if (exercisesEl) {
      new MutationObserver(
        schedulePlace
      ).observe(exercisesEl, {
        childList: true
      });
    }

    const content = $('manaV83Content');

    if (content) {
      new MutationObserver(
        scheduleProgress
      ).observe(content, {
        childList: true
      });
    }
  }

  function init() {
    css();
    ensure();
    observe();

    document.addEventListener(
      'click',
      click
    );

    document.addEventListener(
      'change',
      change
    );

    window.addEventListener(
      'mana:strength-synced',
      () => {
        completion();
        scheduleProgress();
      }
    );

    window.addEventListener(
      'mana:program-tab-change',
      scheduleProgress
    );

    matchMedia(
      '(max-width:700px)'
    ).addEventListener?.(
      'change',
      schedulePlace
    );

    window.addEventListener(
      'pageshow',
      () => {
        schedulePlace();
        scheduleProgress();
      }
    );

    scheduleProgress();

    console.log(
      'Mana Integrated Finishers 103430 ready'
    );
  }

  document.readyState === 'loading'
    ? document.addEventListener(
        'DOMContentLoaded',
        init,
        {once:true}
      )
    : init();

})();
