/* =========================================================
   MANA MOVEMENT TRAINING v5.5.0
   Strength set tracking extension
   ========================================================= */

(() => {
  "use strict";

  const STYLE_ID = "mana-v55-strength-styles";

  function injectStyles(){
    if(document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .v55-strength-panel{
        margin-top:12px;
        padding:12px;
        border:1px solid #2c2c2c;
        background:#0b0b0b;
        border-radius:16px
      }

      .v55-strength-head{
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:12px;
        margin-bottom:10px
      }

      .v55-strength-head strong{
        font-size:14px;
        color:#f0d968
      }

      .v55-previous{
        font-size:12px;
        color:#8f8f8f;
        text-align:right
      }

      .v55-set-labels,
      .v55-set-row{
        display:grid;
        grid-template-columns:40px 1fr 1fr 1fr;
        gap:8px;
        align-items:center
      }

      .v55-set-labels{
        font-size:11px;
        color:#777;
        margin-bottom:5px;
        text-align:center
      }

      .v55-set-row{
        margin:7px 0
      }

      .v55-set-no{
        width:34px;
        height:34px;
        border-radius:50%;
        display:grid;
        place-items:center;
        border:1px solid #343434;
        background:#111;
        color:#f0d968;
        font-weight:800
      }

      .v55-set-row input{
        min-width:0;
        width:100%!important;
        margin:0!important;
        padding:10px 7px!important;
        border-radius:10px!important;
        text-align:center;
        font-size:15px!important
      }

      .v55-add-set{
        width:100%;
        margin-top:8px;
        padding:11px;
        border-radius:12px;
        border:1px solid #343434;
        background:#141414;
        color:#ddd;
        font-weight:700
      }

      .v55-strength-status{
        min-height:20px;
        margin-top:8px;
        font-size:12px;
        color:#999
      }

      .v55-pb{
        color:#f0d968!important;
        font-weight:800
      }

      .v55-summary-hidden{
        display:none!important
      }

      @media(max-width:390px){
        .v55-set-labels,
        .v55-set-row{
          grid-template-columns:34px 1fr 1fr 1fr;
          gap:6px
        }

        .v55-set-row input{
          padding:10px 4px!important;
          font-size:14px!important
        }
      }
    `;

    document.head.appendChild(style);
  }

  function currentDay(){
    const text = document.getElementById("dayModalChip")?.textContent || "";
    const match = text.match(/DAY\s+(\d+)/i);
    return match ? Number(match[1]) : null;
  }

  function escAttr(v){
    return String(v ?? "")
      .replace(/&/g,"&amp;")
      .replace(/"/g,"&quot;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;");
  }

  function setRowHtml(n, data={}){
    return `
      <div class="v55-set-row" data-set-number="${n}">
        <div class="v55-set-no">${n}</div>

        <input
          class="v55-reps"
          type="number"
          min="0"
          max="500"
          inputmode="numeric"
          placeholder="10"
          value="${escAttr(data.reps ?? "")}"
        >

        <input
          class="v55-weight"
          type="number"
          min="0"
          max="1000"
          step="0.5"
          inputmode="decimal"
          placeholder="15"
          value="${escAttr(data.weight_kg ?? "")}"
        >

        <input
          class="v55-rpe"
          type="number"
          min="1"
          max="10"
          step="0.5"
          inputmode="decimal"
          placeholder="8"
          value="${escAttr(data.rpe ?? "")}"
        >
      </div>
    `;
  }

  function panelRows(panel){
    return [...panel.querySelectorAll(".v55-set-row")]
      .map((row, idx) => {
        const repsRaw =
          row.querySelector(".v55-reps")?.value ?? "";

        const weightRaw =
          row.querySelector(".v55-weight")?.value ?? "";

        const rpeRaw =
          row.querySelector(".v55-rpe")?.value ?? "";

        return {
          set_number: idx + 1,
          reps: repsRaw === "" ? null : Number(repsRaw),
          weight_kg: weightRaw === "" ? null : Number(weightRaw),
          rpe: rpeRaw === "" ? null : Number(rpeRaw)
        };
      })
      .filter(r =>
        r.reps !== null ||
        r.weight_kg !== null ||
        r.rpe !== null
      );
  }

  function syncSummaryWeight(panel){
    const box =
      panel.closest(".day-task")
      ?.querySelector(".strength-load-box");

    const summary =
      box?.querySelector(
        ".strength-load-input[data-exercise]"
      );

    if(!summary) return;

    const weights = panelRows(panel)
      .map(r => r.weight_kg)
      .filter(v => Number.isFinite(v));

    summary.value =
      weights.length
        ? String(Math.max(...weights))
        : "";
  }

  async function loadSetHistory(panel){
    const day = currentDay();
    const exercise = panel.dataset.exercise;

    if(!day || !exercise || !currentUser) return;

    const status =
      panel.querySelector(".v55-strength-status");

    try{
      const c = await supabaseClient();

      const currentRes = await c
        .from("exercise_set_logs")
        .select(
          "set_number,reps,weight_kg,rpe,updated_at"
        )
        .eq("user_id", currentUser.id)
        .eq("day_number", day)
        .eq("exercise_name", exercise)
        .order("set_number");

      if(currentRes.error)
        throw currentRes.error;

      if((currentRes.data || []).length){
        const rowsWrap =
          panel.querySelector(".v55-set-rows");

        rowsWrap.innerHTML =
          currentRes.data
            .map(r =>
              setRowHtml(
                Number(r.set_number),
                r
              )
            )
            .join("");
      }

      const prevRes = await c
        .from("exercise_set_logs")
        .select(
          "day_number,set_number,reps,weight_kg,rpe,updated_at"
        )
        .eq("user_id", currentUser.id)
        .eq("exercise_name", exercise)
        .neq("day_number", day)
        .order("updated_at", {
          ascending:false
        })
        .limit(20);

      if(prevRes.error)
        throw prevRes.error;

      const prevRows = prevRes.data || [];

      if(prevRows.length){

        const latestDay =
          Number(prevRows[0].day_number);

        const sameSession =
          prevRows.filter(
            r =>
              Number(r.day_number) ===
              latestDay
          );

        const best =
          sameSession
            .filter(r =>
              Number.isFinite(
                Number(r.weight_kg)
              )
            )
            .sort(
              (a,b) =>
                Number(b.weight_kg) -
                Number(a.weight_kg)
            )[0];

        panel.dataset.previousBest =
          best
            ? String(Number(best.weight_kg))
            : "";

        panel.querySelector(
          ".v55-previous"
        ).textContent =
          best
            ? `Last: ${Number(best.weight_kg)} kg × ${best.reps ?? "—"}`
            : `Last session: ${sameSession.length} sets`;

      }else{

        panel.dataset.previousBest = "";

        panel.querySelector(
          ".v55-previous"
        ).textContent =
          "No previous sets";
      }

      syncSummaryWeight(panel);

      status.textContent = "";

    }catch(err){

      console.warn(
        "v5.5 set history unavailable",
        err
      );

      status.textContent =
        "Set history will appear after the database upgrade.";
    }
  }

  function enhanceStrengthBox(box){

    if(box.dataset.v55Ready === "1")
      return;

    const oldInput =
      box.querySelector(
        ".strength-load-input[data-exercise]"
      );

    if(!oldInput)
      return;

    box.dataset.v55Ready = "1";
box.style.display = "none";
    oldInput.classList.add(
      "v55-summary-hidden"
    );

    const exercise =
      oldInput.dataset.exercise ||
      "Exercise";

    const panel =
      document.createElement("div");

    panel.className =
      "v55-strength-panel";

    panel.dataset.exercise =
      exercise;

    panel.innerHTML = `
      <div class="v55-strength-head">
        <strong>Track your sets</strong>
        <span class="v55-previous">
          Loading previous…
        </span>
      </div>

      <div class="v55-set-labels">
        <span>SET</span>
        <span>REPS</span>
        <span>KG</span>
        <span>RPE</span>
      </div>

      <div class="v55-set-rows">
        ${[1,2,3]
          .map(n => setRowHtml(n))
          .join("")}
      </div>

      <button
        class="v55-add-set"
        type="button">
        + Add Set
      </button>

      <div
        class="v55-strength-status">
      </div>
    `;

    box.insertAdjacentElement(
      "afterend",
      panel
    );

    panel
      .querySelector(".v55-add-set")
      .addEventListener(
        "click",
        () => {

          const wrap =
            panel.querySelector(
              ".v55-set-rows"
            );

          const n =
            wrap.querySelectorAll(
              ".v55-set-row"
            ).length + 1;

          if(n > 20) return;

          wrap.insertAdjacentHTML(
            "beforeend",
            setRowHtml(n)
          );
        }
      );

    panel.addEventListener(
      "input",
      () => syncSummaryWeight(panel)
    );

    loadSetHistory(panel);
  }

  async function saveAllSetPanels(){

    const day = currentDay();

    const panels =
      [...document.querySelectorAll(
        ".v55-strength-panel"
      )];

    if(
      !day ||
      !panels.length ||
      !currentUser
    ) return;

    const button =
      document.getElementById(
        "saveStrengthLogsBtn"
      );

    const oldText =
      button?.textContent;

    if(button)
      button.textContent =
        "Saving sets…";

    try{

      const c =
        await supabaseClient();

      for(const panel of panels){

        const exercise =
          panel.dataset.exercise;

        const status =
          panel.querySelector(
            ".v55-strength-status"
          );

        const rows =
          panelRows(panel);

        const del =
          await c
            .from("exercise_set_logs")
            .delete()
            .eq(
              "user_id",
              currentUser.id
            )
            .eq(
              "day_number",
              day
            )
            .eq(
              "exercise_name",
              exercise
            );

        if(del.error)
          throw del.error;

        if(rows.length){

          const payload =
            rows.map(r => ({
              user_id:
                currentUser.id,

              day_number:
                day,

              exercise_name:
                exercise,

              set_number:
                r.set_number,

              reps:
                Number.isFinite(r.reps)
                  ? r.reps
                  : null,

              weight_kg:
                Number.isFinite(
                  r.weight_kg
                )
                  ? r.weight_kg
                  : null,

              rpe:
                Number.isFinite(r.rpe)
                  ? r.rpe
                  : null,

              updated_at:
                new Date()
                  .toISOString()
            }));

          const ins =
            await c
              .from(
                "exercise_set_logs"
              )
              .insert(payload);

          if(ins.error)
            throw ins.error;
        }

        syncSummaryWeight(panel);

        const weights =
          rows
            .map(r => r.weight_kg)
            .filter(
              Number.isFinite
            );

        const maxNow =
          weights.length
            ? Math.max(...weights)
            : null;

        const prev =
          Number(
            panel.dataset.previousBest
          );

        if(
          maxNow !== null &&
          Number.isFinite(prev) &&
          maxNow > prev
        ){

          status.textContent =
            `🏆 New PB: ${maxNow} kg`;

          status.classList.add(
            "v55-pb"
          );

        }else{

          status.textContent =
            rows.length
              ? "Sets saved ✓"
              : "No sets entered.";

          status.classList.remove(
            "v55-pb"
          );
        }
      }

      if(button)
        button.textContent =
          "Sets + weights saved ✓";

      setTimeout(() => {
        if(button)
          button.textContent =
            oldText ||
            "Save weights";
      },1600);

    }catch(err){

      console.error(
        "v5.5 set save failed",
        err
      );

      panels.forEach(panel => {

        const status =
          panel.querySelector(
            ".v55-strength-status"
          );

        status.textContent =
          "Could not save sets: " +
          (err?.message ||
           String(err));

        status.classList.remove(
          "v55-pb"
        );
      });

      if(button)
        button.textContent =
          oldText ||
          "Save weights";
    }
  }

  function enhanceModal(){

    document
      .querySelectorAll(
        ".strength-load-box"
      )
      .forEach(
        enhanceStrengthBox
      );

    let save =
      document.getElementById(
        "saveStrengthLogsBtn"
      );
if(save && save.dataset.v55Clean !== "1"){
  const cleanSave = save.cloneNode(true);
  save.replaceWith(cleanSave);
  save = cleanSave;
  save.dataset.v55Clean = "1";
}
    if(
      save &&
      save.dataset.v55Bound !== "1"
    ){

      save.dataset.v55Bound = "1";

      save.textContent =
        "Save sets & weights";

      save.addEventListener(
        "click",
        () => {
          setTimeout(
            saveAllSetPanels,
            0
          );
        }
      );
    }
  }

  injectStyles();

  const start = () => {

    const body =
      document.getElementById(
        "dayModalBody"
      );

    if(!body) return;

    const observer =
      new MutationObserver(
        () =>
          setTimeout(
            enhanceModal,
            0
          )
      );

    observer.observe(
      body,
      {
        childList:true,
        subtree:true
      }
    );

    enhanceModal();
  };

  if(
    document.readyState ===
    "loading"
  ){

    document.addEventListener(
      "DOMContentLoaded",
      start
    );

  }else{

    start();
  }

})();

(() => {
"use strict";

function addStrengthProgress(){
  if(document.getElementById("cpStrengthProgressCard")) return;

  const energy =
    document.getElementById("cpEnergyTrend")?.closest(".card");

  if(!energy) return;

  const card = document.createElement("div");
  card.className = "card";
  card.id = "cpStrengthProgressCard";

  card.innerHTML =
    '<div class="row"><h3>Strength progress</h3><span class="pill">LIVE</span></div>' +
    '<div id="cpStrengthProgress"><p class="muted">Loading strength progress…</p></div>';

  energy.insertAdjacentElement("afterend",card);
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",addStrengthProgress);
}else{
  addStrengthProgress();
}

})();

(() => {

async function loadStrengthProgress(){

  const host =
    document.getElementById(
      "cpStrengthProgress"
    );

  if(!host || !currentUser) return;

  host.innerHTML =
    '<p class="muted">Loading strength progress…</p>';

  try{

    const c = await supabaseClient();

    const {data,error} =
      await c
        .from("exercise_set_logs")
        .select(
          "day_number,exercise_name,set_number,reps,weight_kg,rpe"
        )
        .eq("user_id",currentUser.id)
        .order("day_number");

    if(error) throw error;

    if(!data || !data.length){
      host.innerHTML =
        '<p class="muted">No strength sets logged yet.</p>';
      return;
    }

    const exercises = {};

    data.forEach(row => {

      const name =
        row.exercise_name || "Exercise";

      if(!exercises[name])
        exercises[name] = [];

      exercises[name].push(row);

    });

    host.innerHTML =
      Object.entries(exercises)
        .map(([name,rows]) => {

          const weights =
            rows
              .map(r => Number(r.weight_kg))
              .filter(Number.isFinite);

          const pb =
            weights.length
              ? Math.max(...weights)
              : 0;

          const rpes =
            rows
              .map(r => Number(r.rpe))
              .filter(r => Number.isFinite(r) && r > 0);

          const avgRpe =
            rpes.length
              ? (
                  rpes.reduce((a,b)=>a+b,0)
                  / rpes.length
                ).toFixed(1)
              : "—";
const dayBest = {};

rows.forEach(r => {
  const day = Number(r.day_number);
  const weight = Number(r.weight_kg);

  if(
    Number.isFinite(day) &&
    Number.isFinite(weight)
  ){
    dayBest[day] =
      Math.max(
        dayBest[day] || 0,
        weight
      );
  }
});

const loggedDays =
  Object.keys(dayBest)
    .map(Number)
    .sort((a,b) => a-b);

const startWeight =
  loggedDays.length
    ? dayBest[loggedDays[0]]
    : 0;

const latestWeight =
  loggedDays.length
    ? dayBest[loggedDays[loggedDays.length - 1]]
    : 0;

const changeKg =
  latestWeight - startWeight;

const changePct =
  startWeight > 0
    ? Math.round(
        (changeKg / startWeight) * 100
      )
    : 0;

const changeText =
  loggedDays.length < 2
    ? "First log"
    : changeKg > 0
      ? `+${changeKg} kg • +${changePct}%`
      : changeKg < 0
        ? `${changeKg} kg • ${changePct}%`
        : "No change";

          return `
  <div class="history-row">
    <div>
      <strong>${name}</strong>

      <div class="tiny muted">
        ${rows.length} sets logged
        • Avg RPE ${avgRpe}
      </div>

      <div class="tiny muted">
        Start ${startWeight} kg
        → Latest ${latestWeight} kg
      </div>

      <div class="tiny gold">
        ${changeText}
      </div>
    </div>

    <strong class="gold">
      🏆 ${pb} kg
    </strong>
  </div>
`;
        })
        .join("");

  }catch(err){

    host.innerHTML =
      '<p class="muted">Could not load strength progress.</p>';

    console.warn(
      "strength progress",
      err
    );
  }
}

const progress =
  document.getElementById(
    "clientProgressView"
  );

if(progress){

  new MutationObserver(() => {

    if(
      !progress.classList.contains("hide")
    ){
      loadStrengthProgress();
    }

  }).observe(
    progress,
    {
      attributes:true,
      attributeFilter:["class"]
    }
  );

}

})();
