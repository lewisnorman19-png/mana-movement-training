
/* =============================================================
   MANA MOVEMENT — COACH TO CLIENT PROGRAM CONNECTION
   BUILD 104720 — COMPLETE NEW FILE
   - Reads real assigned programs from Supabase
   - Assigns an existing saved program by explicit coach action
   - Opens existing client-linked Program Builder
   - Does NOT replace coach navigation, auth, or client programs
   - Original assignment script v10_03 remains DISABLED
   ============================================================= */
(() => {
  'use strict';
  const BUILD = '104720';
  const ID = 'manaCoachAssignments104720';
  const STYLE = 'manaCoachAssignmentsStyle104720';
  if (window.MANA_COACH_ASSIGNMENTS_104720) return;
  window.MANA_COACH_ASSIGNMENTS_104720 = true;
  const $ = id => document.getElementById(id);
  const safe = s => String(s ?? '').replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  let selected = null;
  let savedPrograms = [];
  let assignments = [];
  let busy = false;
  let requestNumber = 0;
  let refreshPending = false;
  const detail = () => $('coachClientDetailView');
  const detailVisible = () => !!detail() && !detail().classList.contains('hide');

  function styles() {
    if ($(STYLE)) return;
    const sheet = document.createElement('style');
    sheet.id = STYLE;
    sheet.textContent = `
      #coachClientDetailView #${ID} {background:#15171A!important;color:#FFFFFF!important;
        border:1px solid #626973!important;border-radius:20px!important;padding:19px!important;
        margin:13px 0 17px!important;box-shadow:none!important;box-sizing:border-box!important}
      #${ID} *{box-sizing:border-box}
      #${ID} .mca-kicker{font:900 10px/1.5 system-ui,sans-serif;letter-spacing:.13em;color:#FF7927!important}
      #${ID} h3{font:900 21px/1.3 system-ui,sans-serif;color:white!important;margin:5px 0 5px!important}
      #${ID} .mca-help{font:400 12px/1.55 system-ui,sans-serif;color:#C1C6CE!important;margin:5px 0 14px!important}
      #${ID} .mca-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px;
        border:1px solid #48515A;border-radius:13px;background:#0C0F12;margin:8px 0}
      #${ID} .mca-row strong{display:block;color:white;font-size:13px;line-height:1.4}
      #${ID} .mca-row small{display:block;color:#C1C6CE;font-size:11px;margin-top:3px;line-height:1.45}
      #${ID} .mca-pill{border:1px solid #FF7927;color:#FF7927;border-radius:30px;
        padding:5px 8px;font-size:10px;font-weight:900;white-space:nowrap}
      #${ID} .mca-actions{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;margin-top:12px}
      #${ID} select{width:100%!important;min-width:0!important;margin:0!important;background:#0B0D10!important;
        border:1px solid #68717C!important;border-radius:11px!important;color:#fff!important;
        padding:12px!important;font-size:13px!important;min-height:46px!important}
      #${ID} button{display:inline-flex;align-items:center;justify-content:center;min-height:44px;
        background:#171A1F!important;border:1px solid #FF7927!important;border-radius:11px!important;
        color:#FF7927!important;-webkit-text-fill-color:#FF7927!important;padding:10px 13px!important;
        font-size:12px!important;font-weight:850!important;cursor:pointer!important;width:auto!important;margin:0!important}
      #${ID} button.mca-primary{background:#FF7927!important;color:#08090B!important;-webkit-text-fill-color:#08090B!important}
      #${ID} button:disabled{opacity:.48!important;cursor:not-allowed!important}
      #${ID} button:focus-visible,#${ID} select:focus-visible{outline:2px solid #FF7927!important;outline-offset:2px!important}
      #${ID} .mca-footer{display:flex;align-items:center;flex-wrap:wrap;gap:9px;margin-top:13px}
      #${ID} .mca-status{font-size:12px;line-height:1.5;color:#C1C6CE;min-height:18px;margin:10px 0 0}
      #${ID} .mca-status.error{color:#FF9A88!important}
      #${ID} .mca-status.success{color:#9CE8BA!important}
      @media(max-width:590px){#coachClientDetailView #${ID}{padding:14px!important}
        #${ID} .mca-actions{grid-template-columns:1fr}
        #${ID} .mca-row{align-items:flex-start;flex-wrap:wrap}}
    `;
    document.head.appendChild(sheet);
  }

  function renderSkeleton() {
    const view = detail();
    if (!view || !detailVisible() || !selected) return null;
    let panel = $(ID);
    if (!panel) {
      panel = document.createElement('section');
      panel.id = ID;
      panel.setAttribute('aria-label', 'Client assigned coaching programs');
      const summary = $('manaV998ClientSummary');
      const hero = $('manaV998ClientHero');
      const anchor = summary && view.contains(summary) ? summary : hero && view.contains(hero) ? hero : null;
      if (anchor) anchor.insertAdjacentElement('afterend',panel);
      else view.insertBefore(panel,view.children[1] || null);
    }
    panel.innerHTML = `
      <div class="mca-kicker">MANA MOVEMENT · CLIENT COACHING</div>
      <h3>Assigned Programs</h3>
      <p class="mca-help">Connect a saved training program to <strong>${safe(selected.name)}</strong>. The client's app will read active assignments from the same secure Mana database.</p>
      <div id="mcaList104720"><div class="mca-status">Checking assignments…</div></div>
      <div class="mca-actions">
        <select id="mcaProgramSelect104720" aria-label="Choose a saved program"><option value="">Loading saved programs…</option></select>
        <button type="button" id="mcaAssign104720" class="mca-primary" disabled>Assign Program</button>
      </div>
      <div class="mca-footer">
        <button type="button" id="mcaBuild104720">＋ Build for ${safe(selected.name)}</button>
        <button type="button" id="mcaRefresh104720">↻ Refresh</button>
      </div>
      <p id="mcaStatus104720" class="mca-status" aria-live="polite"></p>
    `;
    panel.querySelector('#mcaAssign104720').addEventListener('click', assignProgram);
    panel.querySelector('#mcaRefresh104720').addEventListener('click',refresh);
    panel.querySelector('#mcaBuild104720').addEventListener('click',() => {
      if (typeof window.openManaProgramBuilder !== 'function') {
        setStatus('Program Builder is unavailable. Please reload the app.','error');
        return;
      }
      window.openManaProgramBuilder({id:selected.id,name:selected.name});
    });
    panel.querySelector('#mcaProgramSelect104720').addEventListener('change',() => {
      const button = $('mcaAssign104720');
      if (button) button.disabled = busy || !$('mcaProgramSelect104720').value;
    });
    return panel;
  }

  function setStatus(message='',type='') {
    const element=$('mcaStatus104720');
    if (element) {element.textContent=message;element.className='mca-status '+type;}
  }

  async function context() {
    if (typeof window.supabaseClient !== 'function') throw new Error('Mana cloud connection unavailable.');
    const client = await window.supabaseClient();
    const {data,error} = await client.auth.getUser();
    if (error) throw error;
    if (!data?.user) throw new Error('Please log in as your coach account.');
    // Authorization is enforced by Supabase RLS. The UI also refuses client-role sessions.
    if (data.user.app_metadata?.role !== 'coach') throw new Error('An authorised coach account is required.');
    return {client,coachId:data.user.id};
  }

  async function refresh() {
    if (!selected || !detailVisible() || busy) return;
    const ticket=++requestNumber;
    const id=selected.id;
    setStatus('Loading from Mana cloud…');
    try {
      const {client,coachId}=await context();
      const [programRes,assignmentRes]=await Promise.all([
        client.from('custom_programs')
          .select('id,name,description,duration_weeks,status')
          .eq('coach_id',coachId).order('name'),
        client.from('client_program_assignments')
          .select('id,program_id,status,is_primary,assigned_at,custom_programs(id,name,duration_weeks)')
          .eq('client_id',id).eq('coach_id',coachId).neq('status','removed')
          .order('assigned_at',{ascending:false})
      ]);
      if (programRes.error) throw programRes.error;
      if (assignmentRes.error) throw assignmentRes.error;
      if (ticket!==requestNumber || !selected || selected.id!==id || !detailVisible()) return;
      savedPrograms=programRes.data||[];
      assignments=assignmentRes.data||[];
      renderData();
      setStatus('Connected to your saved coaching programs.');
    } catch (error) {
      if (ticket!==requestNumber) return;
      setStatus('Unable to load assignments: '+(error?.message || String(error)),'error');
      const list=$('mcaList104720');
      if(list) list.innerHTML='<p class="mca-help">The connection is unavailable. No client records were changed.</p>';
    }
  }

  function renderData() {
    const list=$('mcaList104720');
    if (!list) return;
    list.innerHTML=assignments.length ? assignments.map(a=>{
      const label=a.custom_programs?.name || 'Saved Program';
      const weeks=a.custom_programs?.duration_weeks;
      const status=a.status || 'active';
      return `<div class="mca-row"><div><strong>${safe(label)}</strong><small>${safe(status)}${weeks ? ' · '+safe(weeks)+' weeks' : ''}</small></div>
        <span class="mca-pill">${a.is_primary?'PRIMARY':safe(status).toUpperCase()}</span></div>`;
    }).join('') : '<div class="mca-row"><div><strong>No programs assigned yet</strong><small>Choose a saved program below, or build a new one for this client.</small></div></div>';
    const select=$('mcaProgramSelect104720');
    if (!select) return;
    const previous=select.value;
    const available=savedPrograms.filter(p=>p.status!=='archived');
    select.innerHTML='<option value="">Select a saved program…</option>'+available.map(p=>
      `<option value="${safe(p.id)}">${safe(p.name)}${p.duration_weeks ? ' · '+safe(p.duration_weeks)+' weeks':''}</option>`).join('');
    if(available.some(p=>p.id===previous)) select.value=previous;
    const assign=$('mcaAssign104720');
    if(assign) assign.disabled=busy || !select.value;
    if(!available.length) setStatus('No saved programs found. Use Build for '+selected.name+' to create one.');
  }

  async function assignProgram() {
    const selection=$('mcaProgramSelect104720')?.value;
    if (busy || !selected || !selection || !detailVisible()) return;
    const program=savedPrograms.find(p=>p.id===selection);
    if (!program) {setStatus('Please choose a saved program.','error');return;}
    const clientId=selected.id;
    const coachName=selected.name;
    // Explicit confirmation before changing a real client's training assignment.
    if (!window.confirm('Assign "'+program.name+'" to '+coachName+'?\n\nThis will make the saved program available on their client side.')) return;
    busy=true;
    const button=$('mcaAssign104720');
    if(button) button.disabled=true;
    setStatus('Saving assignment…');
    try {
      const {client,coachId}=await context();
      // Do not demote, pause or delete the client's other programs automatically.
      const prior=assignments.find(a=>a.program_id===selection);
      const hasPrimary=assignments.some(a=>a.is_primary && a.status==='active');
      const record={
        client_id:clientId,coach_id:coachId,program_id:selection,
        status:'active',is_primary:prior?.is_primary ?? !hasPrimary,
        start_date:new Date().toISOString().slice(0,10),updated_at:new Date().toISOString()
      };
      const {error}=await client.from('client_program_assignments')
        .upsert(record,{onConflict:'client_id,program_id'});
      if(error) throw error;
      setStatus('Program assigned to '+coachName+' successfully.','success');
      busy=false;
      await refresh();
      setStatus('Program assigned to '+coachName+'. The client can access it from their assigned programs.','success');
    } catch(error) {
      busy=false;
      setStatus('Assignment not saved: '+(error?.message||String(error)),'error');
      if(button) button.disabled=false;
    }
  }

  function readClientFromEvent(event) {
    const node=event.target.closest('[data-client],[data-coach-client-id],.client-open[data-client-id]');
    if(!node) return;
    const id=node.dataset.client || node.dataset.coachClientId || node.dataset.clientId;
    if(!id) return;
    let name=node.dataset.clientName || node.querySelector('strong')?.textContent || node.textContent || 'Client';
    name=String(name).replace(/Open profile.*$/i,'').trim() || 'Client';
    selected={id:String(id),name};
    requestNumber++;
    if($(ID)) $(ID).remove();
    // Existing coach navigation opens the client profile; we do not intercept it.
    setTimeout(showForSelected,180);
    setTimeout(showForSelected,550);
  }

  function showForSelected() {
    if(!selected || !detailVisible()) return;
    if(!$(ID)) {renderSkeleton();refresh();}
  }

  function init() {
    styles();
    document.addEventListener('click',readClientFromEvent,true);
    const target=detail();
    if(target){
      const observer=new MutationObserver(()=>{
        if(!detailVisible()) {requestNumber++;return;}
        if(!refreshPending) {refreshPending=true;requestAnimationFrame(()=>{refreshPending=false;showForSelected();});}
      });
      observer.observe(target,{attributes:true,attributeFilter:['class']});
    }
    console.log('[Mana] Coach/client program connection '+BUILD);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
