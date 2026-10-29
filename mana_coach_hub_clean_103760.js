
/* MANA MOVEMENT — COACH HUB CLEAN 103760
   Standalone replacement for premium 103750.
   Presentation only; underlying coach tools remain intact.
*/
(() => {
  "use strict";
  if (window.MANA_COACH_HUB_CLEAN_103760) return;
  window.MANA_COACH_HUB_CLEAN_103760 = true;

  const ID = "manaCoachHubClean103760";
  const STYLE = "manaCoachHubCleanStyle103760";
  const HOME = "coachHomePage";
  const programs = [
    {id:"strength",name:"Mana Strength",icon:"◆",color:"#61a9fa"},
    {id:"mana28",name:"Mana28",icon:"▦",color:"#edc64e"},
    {id:"lyfe",name:"ManaLyfe",icon:"♡",color:"#69cba1"}
  ];
  let page = "home";
  let currentProgram = "strength";
  let lastClientId = "";
  const $ = id => document.getElementById(id);
  const html = value => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[c]);

  function clients() {
    const source = $("coachClientsCard");
    if (!source) return [];
    const map = new Map();
    source.querySelectorAll(".client-open[data-client-id]").forEach(el => {
      const id = String(el.dataset.clientId || "").trim();
      if (!id || map.has(id)) return;
      const name = String(el.dataset.clientName ||
        el.querySelector("strong")?.textContent || "Client").trim();
      const raw = String(el.dataset.program ||
        el.dataset.clientProgram ||
        el.closest("[data-program]")?.dataset.program || "").toLowerCase().trim();
      const program = /^(strength|mana strength)$/.test(raw) ? "strength" :
        /^(mana28|mana 28)$/.test(raw) ? "mana28" :
        /^(manalyfe|mana lyfe)$/.test(raw) ? "lyfe" : "";
      map.set(id,{id,name,program});
    });
    return [...map.values()].sort((a,b) => a.name.localeCompare(b.name));
  }
  function count(id) {
    const value = String($(id)?.textContent || "").trim();
    return /^\d+$/.test(value) ? value : "—";
  }
  function installStyle() {
    if ($(STYLE)) return;
    const style = document.createElement("style");
    style.id = STYLE;
    style.textContent = `
      #coachHomePage{width:min(1100px,calc(100% - 24px))!important;
        max-width:1100px!important;margin:0 auto!important}
      #coachHomePage > :not(#${ID}){display:none!important}
      #${ID}{color:#faf8f1;margin:0 0 115px;font-family:inherit}
      #${ID} *{box-sizing:border-box}
      #${ID} button{font:inherit;cursor:pointer;color:inherit}
      #${ID} .hub-hero{padding:25px;border:1px solid #78602b;
        border-radius:24px;background:radial-gradient(circle at 90% 0%,#46381566,transparent 43%),#11110e;
        margin-bottom:17px}
      #${ID} .hub-kicker{font-size:10px;font-weight:900;color:#edca66;letter-spacing:.19em}
      #${ID} h2{font-size:clamp(27px,4vw,41px);font-weight:950;
        color:white;margin:7px 0}
      #${ID} .hub-sub{color:#afb2bd;font-size:13px;line-height:1.6}
      #${ID} .hub-panel{background:#11141c;border:1px solid #323947;
        border-radius:23px;padding:20px;margin-bottom:17px}
      #${ID} h3{margin:0 0 15px;color:white;font-size:18px}
      #${ID} .hub-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
      #${ID} .hub-card{border:1px solid var(--accent);
        border-radius:18px;padding:20px 11px;min-height:160px;
        background:linear-gradient(150deg,#25272d,#141720);
        text-align:center;display:flex;flex-direction:column;align-items:center;
        justify-content:center;gap:11px}
      #${ID} .hub-card:hover,#${ID} .hub-item:hover{background:#222731;filter:brightness(1.1)}
      #${ID} .hub-symbol{font-size:25px;color:var(--accent)}
      #${ID} .hub-card strong{font-size:15px}
      #${ID} .hub-card small,#${ID} .hub-help{font-size:12px;color:#aeb5c2;line-height:1.55}
      #${ID} .hub-figure{font-size:25px;font-weight:900;color:#fff}
      #${ID} .hub-alert{min-height:115px;border:1px solid #333b49;
        border-radius:15px;background:#1b202b;padding:14px 8px;text-align:center}
      #${ID} .hub-alert strong{display:block;font-size:13px;margin-top:7px}
      #${ID} .hub-alert small{display:block;color:#acb2bc;font-size:11px;margin-top:5px}
      #${ID} .hub-alert .hub-figure{color:#edca66}
      #${ID} .hub-back,#${ID} .hub-secondary{border:1px solid #86692b;
        border-radius:12px;padding:10px 14px;background:#201b10;color:#efcc65!important;
        font-size:12px;font-weight:900}
      #${ID} .hub-heading{display:flex;align-items:center;gap:13px;
        margin-bottom:18px;flex-wrap:wrap}
      #${ID} .hub-heading h3{margin:0}
      #${ID} .hub-item{display:flex;justify-content:space-between;align-items:center;
        width:100%;padding:15px 16px;margin-top:9px;
        text-align:left;border:1px solid #333c49;border-radius:14px;background:#1b202a}
      #${ID} .hub-item strong{font-size:14px}
      #${ID} .hub-item span{color:#eccc70}
      #${ID} .hub-help{margin:12px 0}
      @media(max-width:600px){
        #coachHomePage{width:calc(100% - 16px)!important}
        #${ID} .hub-hero,#${ID} .hub-panel{padding:15px}
        #${ID} .hub-grid{gap:7px}
        #${ID} .hub-card{padding:11px 5px;min-height:138px}
        #${ID} .hub-card strong{font-size:11px}
        #${ID} .hub-card small,#${ID} .hub-alert small{font-size:9px}
        #${ID} .hub-alert{padding:12px 5px}
        #${ID} .hub-alert strong{font-size:10px}
      }`;
    document.head.appendChild(style);
  }
  function root() {
    const home = $(HOME);
    if (!home) return null;
    if ($(ID)) return $(ID);
    installStyle();
    const section = document.createElement("section");
    section.id = ID;
    section.setAttribute("aria-label","Mana Coach Hub");
    home.prepend(section);
    section.addEventListener("click", click);
    return section;
  }
  function header(subtitle) {
    return `<div class="hub-hero"><div class="hub-kicker">
      MANA MOVEMENT · COACH OPERATIONS</div>
      <h2>Coach Hub</h2><div class="hub-sub">${html(subtitle)}</div></div>`;
  }
  function draw() {
    const target = root();
    if (!target) return;
    const all = clients();
    if (page === "home") {
      target.innerHTML = header("Your clients, conversations and priorities.") +
        `<div class="hub-panel"><h3>Needs your attention</h3><div class="hub-grid">
          <button class="hub-alert" data-action="strengthChats">
            <div class="hub-figure">—</div><strong>Strength chats</strong><small>Inbox connection pending</small></button>
          <button class="hub-alert" data-action="requests">
            <div class="hub-figure">${html(count("alertCountStrength"))}</div>
            <strong>Block requests</strong><small>Current Strength alerts</small></button>
          <button class="hub-alert" data-action="lyfeChats">
            <div class="hub-figure">—</div><strong>ManaLyfe chats</strong>
            <small>Inbox connection pending</small></button>
          </div></div>
        <div class="hub-panel"><h3>Your programs</h3><div class="hub-grid">
          ${programs.map(p => {
            const assigned = all.filter(c => c.program === p.id).length;
            const verified = all.length && all.every(c => c.program);
            const metric = p.id === "lyfe" ? "Active chats" : "Verified clients";
            const number = verified && p.id !== "lyfe" ? assigned : "—";
            return `<button class="hub-card" style="--accent:${p.color}"
              data-program="${p.id}"><span class="hub-symbol">${p.icon}</span>
              <strong>${p.name}</strong><span class="hub-figure">${number}</span>
              <small>${metric} · Open →</small></button>`;
          }).join("")}</div>
          <p class="hub-help">${all.length} existing client records available.
          Program-specific totals will appear when assignments are connected.</p>
        </div>`;
      return;
    }
    const p = programs.find(p => p.id === currentProgram);
    const verified = all.filter(c => c.program === currentProgram);
    const unclassified = all.filter(c => !c.program);
    target.innerHTML = header(`${p.name} · Client management`) +
      `<div class="hub-panel">
        <div class="hub-heading"><button class="hub-back" data-action="back">← Coach Hub</button>
          <h3>${p.name}</h3></div>
        ${currentProgram === "lyfe" ? `<p class="hub-help">Active chat counts and the
          dedicated ManaLyfe inbox require a verified conversation source.
          No messages are copied into this preview.</p>` : ""}
        <h3>Assigned clients</h3>
        ${verified.length ? verified.map(c => clientButton(c)).join("") :
          `<p class="hub-help">No program assignment is confirmed in the current
          dashboard data yet.</p>`}
        <h3 style="margin-top:23px">Existing client directory</h3>
        <p class="hub-help">Clients below are not yet classified by program.
          You can still open their existing coaching profiles without changing
          their membership or training program.</p>
        ${unclassified.length ? unclassified.map(c => clientButton(c)).join("") :
          `<p class="hub-help">No unclassified clients in the current list.</p>`}
        <button class="hub-secondary" style="margin-top:17px"
          data-action="refresh">Refresh client directory</button>
      </div>`;
  }
  function clientButton(c) {
    return `<button class="hub-item" data-client="${html(c.id)}">
      <strong>${html(c.name)}</strong><span>Open profile →</span></button>`;
  }
  function click(event) {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.program) {
      currentProgram = button.dataset.program;
      page = "program";
      draw();
      window.scrollTo(0,0);
    } else if (button.dataset.client) {
      const c = clients().find(c => c.id === button.dataset.client);
      if (c && typeof window.openCoachClientDetail === "function") {
        lastClientId = c.id;
        window.openCoachClientDetail(c.id,c.name);
      } else {
        alert("Client detail is not available. Refresh the app and try again.");
      }
    } else if (button.dataset.action === "back") {
      page = "home";
      draw();
      window.scrollTo(0,0);
    } else if (button.dataset.action === "refresh") {
      draw();
    } else if (button.dataset.action === "requests") {
      // The existing Strength alert is a separate underlying filter.
      // Open the directory; do not claim alert count equals requests.
      currentProgram = "strength";
      page = "program";
      draw();
    } else if (button.dataset.action === "strengthChats" ||
               button.dataset.action === "lyfeChats") {
      currentProgram = button.dataset.action === "lyfeChats" ? "lyfe" : "strength";
      page = "program";
      draw();
    }
  }
  function init() {
    if (!$(HOME)) return;
    root();
    draw();
    // Existing dashboard updates asynchronously. Refresh after user navigation.
    document.addEventListener("click", e => {
      if (e.target.closest(`#${ID}`)) return;
      if (e.target.closest("[data-coach-page],#backToCoachClients")) {
        setTimeout(draw,300);
      }
    });
    window.addEventListener("focus",draw);
    window.refreshManaCoachHubClean = draw;
    window.MANA_COACH_HUB_BUILD = "103760";
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();
