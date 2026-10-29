
/* ============================================================
   MANA MOVEMENT TRAINING — COACH HUB PREMIUM
   BUILD 103750 — COMPLETE STANDALONE JAVASCRIPT FILE

   Premium Coach Overview and three program areas.
   - Preserves existing dashboard, login and client detail system
   - Uses existing rendered client buttons as a read-only source
   - Does not invent program membership, chats or unread totals
   - Client buttons open the existing client detail view
   - No database writes, no payment changes, no login interception
   - No continuous observers or repeating timers
   ============================================================ */
(() => {
  'use strict';
  if (window.MANA_COACH_HUB_PREMIUM_103750) return;
  window.MANA_COACH_HUB_PREMIUM_103750 = true;

  const ROOT_ID = 'manaCoachHubPremium103750';
  const STYLE_ID = 'manaCoachHubPremiumStyle103750';
  const HOME_ID = 'coachHomePage';
  const CLIENTS_ID = 'coachClientsCard';
  const TABS = [
    { id: 'strength', name: 'Mana Strength', icon: '◆', color: '#5BA8FF', metric: 'Active clients' },
    { id: 'mana28', name: 'Mana28', icon: '▦', color: '#E9C65B', metric: 'Active clients' },
    { id: 'lyfe', name: 'ManaLyfe', icon: '♡', color: '#6DCF9A', metric: 'Active chats' }
  ];

  let selected = 'strength';
  let lastSignature = '';
  const $ = id => document.getElementById(id);

  function esc(text) {
    return String(text == null ? '' : text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function homeVisible() {
    const view = $('coachView');
    const home = $(HOME_ID);
    return !!(view && home && !view.classList.contains('hide') &&
      !home.classList.contains('hide'));
  }

  function clientSource() {
    return $(CLIENTS_ID) || $(HOME_ID);
  }

  function getClients() {
    const source = clientSource();
    if (!source) return [];
    const unique = new Map();
    source.querySelectorAll('.client-open[data-client-id]').forEach(button => {
      const id = (button.dataset.clientId || '').trim();
      if (!id || unique.has(id)) return;
      const name = (button.dataset.clientName || button.querySelector('strong')?.textContent ||
        button.textContent || 'Client').trim().replace(/\s+/g, ' ').slice(0, 100);
      // Only a trusted explicit program attribute qualifies for filtering.
      const explicit = (button.dataset.program || button.dataset.clientProgram ||
        button.closest('[data-program]')?.dataset.program || '').toLowerCase().trim();
      const program = /^(mana strength|strength)$/.test(explicit) ? 'strength' :
        /^(mana28|mana 28)$/.test(explicit) ? 'mana28' :
        /^(manalyfe|mana lyfe)$/.test(explicit) ? 'lyfe' : 'unknown';
      unique.set(id, { id, name, program });
    });
    return [...unique.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  function readCount(id) {
    const text = ($(id)?.textContent || '').trim();
    const match = text.match(/^\d+$/);
    return match ? match[0] : null;
  }

  function style() {
    if ($(STYLE_ID)) return;
    const css = document.createElement('style');
    css.id = STYLE_ID;
    css.textContent = `
      #${ROOT_ID}{color:#f7f5ee;font-family:inherit;margin:0 0 20px}
      #${ROOT_ID} *{box-sizing:border-box}
      #${ROOT_ID} .mh-hero{background:radial-gradient(circle at 95% 0%,#4a3a183b,transparent 46%),linear-gradient(135deg,#171710,#08090d);border:1px solid #78612d;border-radius:24px;padding:24px 23px;box-shadow:0 20px 48px #0007;margin-bottom:16px}
      #${ROOT_ID} .mh-kicker{font-size:10px;letter-spacing:.2em;color:#e9c65b;font-weight:900;text-transform:uppercase}
      #${ROOT_ID} .mh-title{font-size:clamp(25px,4vw,37px);font-weight:900;margin:6px 0;letter-spacing:-.035em;line-height:1.14}
      #${ROOT_ID} .mh-sub{font-size:13px;color:#aaaeb8;line-height:1.55}
      #${ROOT_ID} .mh-section{background:#10131a;border:1px solid #333742;border-radius:22px;padding:17px;margin:0 0 16px}
      #${ROOT_ID} .mh-heading{font-size:15px;font-weight:850;color:#fff;margin:0 0 14px}
      #${ROOT_ID} .mh-alerts,#${ROOT_ID} .mh-programs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
      #${ROOT_ID} button{cursor:pointer;font-family:inherit;min-width:0}
      #${ROOT_ID} .mh-alert{background:#1a1e27;border:1px solid #343947;border-radius:15px;min-height:100px;padding:15px 9px;text-align:center;color:#f5f5f5}
      #${ROOT_ID} .mh-alert:hover,#${ROOT_ID} .mh-program:hover{border-color:#bda05e;background:#23232a}
      #${ROOT_ID} .mh-alert .mh-number{font-weight:900;font-size:26px;display:block;color:#e9c65b;margin:4px 0}
      #${ROOT_ID} .mh-alert small{display:block;color:#afb3bd;font-size:11px;line-height:1.4}
      #${ROOT_ID} .mh-program{border:1px solid var(--mh-accent);background:linear-gradient(150deg,#1d222d,#101217);color:#fff;border-radius:20px;padding:19px 10px;text-align:center;min-height:174px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px}
      #${ROOT_ID} .mh-program[aria-pressed="true"]{box-shadow:inset 0 0 0 1px var(--mh-accent),0 0 25px #0008;background:linear-gradient(145deg,#29292a,#12141b)}
      #${ROOT_ID} .mh-program .mh-symbol{font-size:22px;color:var(--mh-accent)}
      #${ROOT_ID} .mh-program strong{font-size:14px}
      #${ROOT_ID} .mh-program .mh-number{font-size:24px;font-weight:900;color:#fff}
      #${ROOT_ID} .mh-program small{font-size:11px;color:#b8bdc6}
      #${ROOT_ID} .mh-list{margin-top:14px;border-top:1px solid #30343b;padding-top:14px}
      #${ROOT_ID} .mh-list-head{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:9px}
      #${ROOT_ID} .mh-list-head strong{font-size:15px}
      #${ROOT_ID} .mh-note{color:#a9abb5;font-size:12px;line-height:1.6;margin:8px 0}
      #${ROOT_ID} .mh-client{display:flex;align-items:center;justify-content:space-between;gap:14px;width:100%;background:#191d26;border:1px solid #333742;border-radius:13px;color:#f7f7f7;padding:13px 15px;margin-top:8px;text-align:left;font-size:14px}
      #${ROOT_ID} .mh-client:hover{border-color:#d4b45a}
      #${ROOT_ID} .mh-client span:last-child{color:#e9c65b}
      #${ROOT_ID} .mh-open-original{border:1px solid #745e2d;border-radius:12px;background:#1d190e;color:#edce6b;font-size:12px;font-weight:800;padding:10px 12px}
      #${ROOT_ID} .mh-source-label{color:#8d929c;font-size:11px;text-align:right;margin-top:7px}
      @media(max-width:620px){#${ROOT_ID} .mh-hero{padding:19px 16px}#${ROOT_ID} .mh-section{padding:13px}#${ROOT_ID} .mh-alerts,#${ROOT_ID} .mh-programs{gap:6px}#${ROOT_ID} .mh-program{padding:12px 5px;min-height:155px}#${ROOT_ID} .mh-program strong{font-size:11px}#${ROOT_ID} .mh-program small,#${ROOT_ID} .mh-alert small{font-size:9px}#${ROOT_ID} .mh-alert{padding:12px 5px;min-height:95px}}
    `;
    document.head.appendChild(css);
  }

  function ensure() {
    const home = $(HOME_ID);
    if (!home) return null;
    if ($(ROOT_ID)) return $(ROOT_ID);
    style();
    const root = document.createElement('section');
    root.id = ROOT_ID;
    root.setAttribute('aria-label', 'Mana Coach Hub premium overview');
    home.insertBefore(root, home.firstChild);
    root.addEventListener('click', onClick);
    return root;
  }

  function onClick(e) {
    const control = e.target.closest('button');
    if (!control) return;
    if (control.dataset.mhProgram) {
      selected = control.dataset.mhProgram;
      draw(true);
      return;
    }
    if (control.dataset.mhClient) {
      const client = getClients().find(c => c.id === control.dataset.mhClient);
      if (client && typeof window.openCoachClientDetail === 'function') {
        window.openCoachClientDetail(client.id, client.name);
      }
      return;
    }
    if (control.dataset.mhAction === 'clients') {
      $(CLIENTS_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (control.dataset.mhAction === 'requests') {
      const target = document.querySelector('[data-alert-filter="strength"], [data-alert-filter="program"], #alertCountStrength');
      if (target?.matches('button,[data-alert-filter]')) target.click();
      else target?.scrollIntoView({ behavior:'smooth', block:'center' });
      return;
    }
    if (control.dataset.mhAction === 'strengthChats' || control.dataset.mhAction === 'lyfeChats') {
      const hint = $('manaCoachHubNotice103750');
      if (hint) hint.textContent = 'Chat inbox integration is not connected to this preview yet. Existing messages remain available in the original coach tools below.';
    }
  }

  function draw(force = false) {
    const root = ensure();
    if (!root || !homeVisible()) return;
    const clients = getClients();
    const explicit = clients.filter(c => c.program === selected);
    const unknown = clients.filter(c => c.program === 'unknown');
    const hasProgramData = clients.some(c => c.program !== 'unknown');
    const strengthCount = clients.filter(c => c.program === 'strength').length;
    const mana28Count = clients.filter(c => c.program === 'mana28').length;
    const countStrength = readCount('alertCountStrength');
    const activeTotal = readCount('coachClientCount');
    const signature = JSON.stringify([selected, clients, countStrength, activeTotal]);
    if (!force && signature === lastSignature) return;
    lastSignature = signature;

    const alertItems = [
      { key:'strengthChats', name:'Strength chats', value:'—', text:'Open inbox integration pending' },
      { key:'requests', name:'New block requests', value:countStrength ?? '—', text: countStrength !== null ? 'Existing Strength alert count' : 'Source not yet connected' },
      { key:'lyfeChats', name:'ManaLyfe chats', value:'—', text:'Open inbox integration pending' }
    ];

    root.innerHTML = `
      <div class="mh-hero">
        <div class="mh-kicker">MANA MOVEMENT · COACH OPERATIONS</div>
        <h2 class="mh-title">Coach Hub</h2>
        <div class="mh-sub">Your coaching overview · Select a program to manage your clients and conversations.</div>
      </div>
      <div class="mh-section">
        <div class="mh-heading">Needs your attention</div>
        <div class="mh-alerts">${alertItems.map(a => `
          <button class="mh-alert" type="button" data-mh-action="${a.key}">
            <span class="mh-number">${esc(a.value)}</span>
            <strong>${esc(a.name)}</strong>
            <small>${esc(a.text)}</small>
          </button>`).join('')}</div>
        <p id="manaCoachHubNotice103750" class="mh-note" aria-live="polite">Live message totals will appear after the inbox data is connected. A dash does not mean zero.</p>
      </div>
      <div class="mh-section">
        <div class="mh-heading">Your programs</div>
        <div class="mh-programs">${TABS.map(p => {
          const count = p.id === 'strength' ? (hasProgramData && unknown.length === 0 ? String(strengthCount) : '—') :
            p.id === 'mana28' ? (hasProgramData && unknown.length === 0 ? String(mana28Count) : '—') : '—';
          return `<button type="button" class="mh-program" data-mh-program="${p.id}" style="--mh-accent:${p.color}" aria-pressed="${selected === p.id}">
            <span class="mh-symbol" aria-hidden="true">${p.icon}</span>
            <strong>${p.name}</strong><span class="mh-number">${count}</span>
            <small>${p.metric}</small>
            <small>${selected === p.id ? 'Selected' : 'Open →'}</small>
          </button>`;
        }).join('')}</div>
        <div class="mh-list">
          <div class="mh-list-head"><strong>${esc(TABS.find(p => p.id === selected).name)}</strong><button class="mh-open-original" data-mh-action="clients" type="button">Existing client list ↗</button></div>
          ${selected === 'lyfe' ? `<p class="mh-note">ManaLyfe conversations remain in the existing chat system until we connect an authorised chat inbox here. We won't show personal messages from unrelated sources.</p>` : ''}
          ${!hasProgramData ? `<p class="mh-note">Program membership isn't labelled in the existing client-list data. To avoid assigning clients to the wrong program, open them in the existing list below while we connect the actual program source.</p>` : ''}
          ${explicit.length ? explicit.map(c => `<button type="button" class="mh-client" data-mh-client="${esc(c.id)}"><span>${esc(c.name)}</span><span>Open client →</span></button>`).join('') : `<p class="mh-note">No verified ${esc(TABS.find(p => p.id === selected).name)} records available in this view yet.</p>`}
          ${activeTotal !== null ? `<div class="mh-source-label">Existing dashboard reports ${esc(activeTotal)} total clients (all programs).</div>` : ''}
        </div>
      </div>`;
  }

  function init() {
    if (!$(HOME_ID)) return;
    ensure();
    draw(true);
    // Refresh only on relevant user actions; never poll or hook auth.
    document.addEventListener('click', event => {
      if (event.target.closest(`#${ROOT_ID}`)) return;
      if (event.target.closest('[data-coach-page], [data-page], [data-alert-filter], #backToCoachClients')) {
        setTimeout(() => draw(), 250);
      }
    });
    window.addEventListener('focus', () => { draw(); });
    window.refreshManaCoachHubPremium = () => draw(true);
    window.MANA_COACH_HUB_PREMIUM_BUILD = '103750';
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
