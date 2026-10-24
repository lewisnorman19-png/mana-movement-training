
/* MANA MOVEMENT TRAINING — DAILY POLISH 103190
 * Fuel meal ticks; Mana 28 progress colours; Mana Lyfe Reset/Support polish.
 * Does not change workout history, nutrition storage, or Supabase chat implementation.
 */
(() => {
  'use strict';
  const BUILD='103190', STYLE='mana-daily-polish-103190';
  if(window.MANA_DAILY_POLISH_BUILD===BUILD)return;
  const css=`
    /* Meal choice confirmation */
    #manaV1015Fuel .m1022-category{position:relative!important}
    #manaV1015Fuel .m1022-category.mana-meal-selected::after{
      content:'✓';position:absolute;top:9px;right:9px;width:25px;height:25px;
      display:grid;place-items:center;border-radius:50%;border:1px solid #f3d875;
      background:#17150b;color:#f3d875;font-size:16px;font-weight:900;
      pointer-events:none;z-index:2
    }
    /* Mana 28 progress: actual card order is Workouts, Water, Recovery, Calories, Protein */
    #manaV83Content .mana-v981-root .mana-v981-grid>.mana-v981-card .mana-v981-bar>span{
      background:linear-gradient(90deg,#278b57,#45c783)!important
    }
    #manaV83Content .mana-v981-root .mana-v981-grid>.mana-v981-card:nth-child(2) .mana-v981-bar>span{
      background:linear-gradient(90deg,#1677bb,#42b8ff)!important
    }
    #manaV83Content .mana-v981-root .mana-v981-grid>.mana-v981-card:nth-child(3) .mana-v981-bar>span{
      background:linear-gradient(90deg,#6f49bb,#a77bff)!important
    }
    #manaV83Content .mana-v981-root .mana-v981-grid>.mana-v981-card:nth-child(2) .mana-v981-icon{color:#42b8ff!important}
    #manaV83Content .mana-v981-root .mana-v981-grid>.mana-v981-card:nth-child(3) .mana-v981-icon{color:#a77bff!important}
    /* Reset support controls */
    body.mana-lyfe-103190 #manaV83Tabs [data-v83-tab="reclaim"],
    body.mana-lyfe-103190 #manaV83Tabs [data-v83-tab="reclaim"] *{
      color:#55d98b!important;--tab-color:#55d98b
    }
    body.mana-lyfe-103190 #manaV83Tabs [data-v83-tab="reclaim"]::before,
    body.mana-lyfe-103190 #manaV83Tabs [data-v83-tab="reclaim"]::after{
      background-color:#55d98b!important;border-color:#55d98b!important
    }
    body.mana-lyfe-103190 #ml140OpenReset{
      width:158px!important;height:158px!important;min-height:158px!important;
      margin:10px auto 0!important;border-radius:50%!important;padding:18px!important;
      background:#164b30!important;border:2px solid #55d98b!important;
      color:#fff!important;font-size:17px!important;line-height:1.3!important;
      box-shadow:0 0 0 8px rgba(85,217,139,.06)!important
    }
    body.mana-lyfe-103190 #ml140OpenChat,
    body.mana-lyfe-103190 #manaV83Content [data-v933-support-chat],
    body.mana-lyfe-103190 #manaV83Content .ml170-support-button,
    body.mana-lyfe-103190 #manaV83Content .mana-v933-support button,
    body.mana-lyfe-103190 #manaV83Content .ml140-action:not(#ml140OpenReset){
      background:#164b30!important;color:#fff!important;border:1px solid #55d98b!important;
      border-radius:999px!important;min-height:56px!important;box-shadow:none!important
    }
    #manaV936ResetModal #manaV936BreathStart{
      min-height:120px!important;min-width:120px!important;max-width:190px!important;
      aspect-ratio:1/1;border-radius:50%!important;margin:14px auto!important;
      display:flex!important;justify-content:center!important;align-items:center!important;
      text-align:center!important;padding:16px!important;border:2px solid #55d98b!important;
      background:#164b30!important;color:white!important
    }
    #manaV95Send.mana-send-confirmed{color:#55d98b!important;border-color:#55d98b!important}
  `;
  function install(){if(document.getElementById(STYLE))return;const el=document.createElement('style');el.id=STYLE;el.textContent=css;document.head.append(el)}
  function lyfe(){const shell=document.getElementById('manaV83ProgramShell'),name=(document.getElementById('manaV83Title')?.textContent||'').toUpperCase();return !!shell?.classList.contains('open')&&/MANA (LYFE|LIFE)/.test(name)}
  function syncBody(){document.body.classList.toggle('mana-lyfe-103190',lyfe())}
  const KEY='mana-fuel-v571';
  function dateKey(){let d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
  function selectedMeals(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')?.[dateKey()]?.meals||{}}catch{return {}}}
  function syncMeals(){const root=document.getElementById('manaV1015Fuel');if(!root)return;const meals=selectedMeals();const mapping={Breakfast:'Breakfast',Lunch:'Lunch',Dinner:'Dinner',Snacks:'Snacks',Snack:'Snacks'};root.querySelectorAll('[data-m1022-open]').forEach(b=>{const key=b.dataset.m1022Open;const records=meals[key]||meals[mapping[key]]||[];b.classList.toggle('mana-meal-selected',Array.isArray(records)&&records.length>0)})}
  // The original app owns rendering. Avoid a MutationObserver that could cause flicker.
  let pending=false;
  function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;syncBody();syncMeals()})}
  function openSameSupport(e){if(!lyfe()||!(e.target instanceof Element))return;const b=e.target.closest('#manaV83Content [data-v933-support-chat],#manaV83Content .ml170-support-button');if(!b||typeof window.openManaLifeSupport!=='function')return;e.preventDefault();e.stopImmediatePropagation();window.openManaLifeSupport();}
  // Skip the explanatory first modal page only when Reset starts, not when resuming a step.
  function skipIntro(){const modal=document.getElementById('manaV936ResetModal');if(!modal?.classList.contains('open'))return;const body=document.getElementById('manaV936Body');if(!body||!body.textContent.includes('STEP 1'))return;const ready=Array.from(body.querySelectorAll('button')).find(b=>/READY TO RESET/i.test(b.textContent));ready?.click()}
  function onClick(e){if(!(e.target instanceof Element))return;const reset=e.target.closest('#ml140OpenReset,#manaV936Open');if(reset){setTimeout(skipIntro,80);setTimeout(skipIntro,200)}if(e.target.closest('[data-m1022-open],[data-m1022-meal],[data-m1022-add],#manaV83Tabs .mana-v83-tab,.mana-v978-launch')){setTimeout(schedule,120);setTimeout(schedule,350)}}
  // Chat send button already shows 'Sent ✓' after successful Supabase insert in v9_5;
  // this only preserves that confirmation visually until the user's next action.
  function watchSend(){const button=document.getElementById('manaV95Send');if(!button)return;button.classList.toggle('mana-send-confirmed',/sent\s*✓?/i.test(button.textContent))}
  function init(){install();schedule();document.addEventListener('click',openSameSupport,true);document.addEventListener('click',onClick,true);window.addEventListener('mana:fuel-updated',schedule);document.addEventListener('mana:fuel-updated',schedule);for(const event of ['mana:program-tab-change','mana:program-change']){window.addEventListener(event,schedule);document.addEventListener(event,schedule)}window.addEventListener('pageshow',schedule);document.addEventListener('click',()=>setTimeout(watchSend,200));window.MANA_DAILY_POLISH_BUILD=BUILD;console.log('Mana daily polish',BUILD)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
