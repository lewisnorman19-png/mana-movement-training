
/*
 MANA MOVEMENT — EXERCISE VISUAL REVIEW
 COMPLETE BUILD 100226

 Requires master registry 100222 and asset bridge 100224.
 Read-only preview of existing actual GitHub demos.
 No fake or substituted artwork, no database writes,
 no changes to workouts.
*/
(() => {
  "use strict";

  const BUILD = "100226";
  const KEY = "MANA_EXERCISE_VISUAL_REVIEW";
  const ID = "manaExerciseVisualReview100226";

  if (window[KEY]?.build === BUILD) return;

  const registry = () => window.MANA_EXERCISE_REGISTRY;
  const assets = () => window.MANA_EXERCISE_ASSETS;

  const esc = input => String(input ?? "").replace(
    /[&<>"']/g,
    x => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[x]
  );

  const slug = input => String(input ?? "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  let filter = "all";
  let search = "";
  let selected = null;

  function entries() {
    return (registry()?.all?.() || []).map(record => {
      const match = assets()?.lookup?.(record.name) || {};

      return {
        id: record.id,
        name: record.name,
        group:
          record.primaryMuscle ||
          record.muscleLabel ||
          "Unspecified",
        equipment: record.equipment || "Unspecified",
        demo: match.path || null,
        expected:
          "assets/exercises/" +
          slug(record.name) +
          "-demo.png"
      };
    });
  }

  function stats() {
    const all = entries();

    return {
      build: BUILD,
      exercises: all.length,
      matched: all.filter(x => x.demo).length,
      missing: all.filter(x => !x.demo).length,
      demoFiles: assets()?.demoSlugs?.().length || 0,
      noSubstitutions: true
    };
  }

  function close() {
    document.getElementById(ID)?.remove();
    document.removeEventListener("keydown", onKey);
  }

  function onKey(event) {
    if (event.key === "Escape") close();
  }

  function render() {
    const root = document.getElementById(ID);
    if (!root) return;

    const all = entries();

    const visible = all.filter(x => {
      const ok =
        filter === "all" ||
        (filter === "ready" ? !!x.demo : !x.demo);

      const q = search.toLowerCase();

      return ok &&
        `${x.name} ${x.group} ${x.equipment}`
          .toLowerCase()
          .includes(q);
    });

    const s = stats();

    const grid = root.querySelector(
      "[data-review-grid]"
    );

    root.querySelector(
      "[data-review-count]"
    ).textContent =
      `${s.exercises} exercises • ` +
      `${s.matched} demo matches • ` +
      `${s.missing} missing • ` +
      `${s.demoFiles} GitHub demo files`;

    root.querySelectorAll(
      "[data-review-filter]"
    ).forEach(btn => {
      const active =
        btn.dataset.reviewFilter === filter;

      btn.style.background =
        active ? "#28180e" : "#17181c";

      btn.style.borderColor =
        active ? "#ff8126" : "#4a515d";
    });

    grid.innerHTML = visible.length
      ? visible.map(x => `
        <button
          type="button"
          data-review-id="${esc(x.id)}"
          style="
            display:flex;
            flex-direction:column;
            text-align:left;
            gap:8px;
            background:#191a1e;
            color:#fff;
            border:1px solid #4a515d;
            border-radius:12px;
            padding:10px;
            min-width:0;
            cursor:pointer;
          "
        >
          <div style="
            aspect-ratio:1.45;
            width:100%;
            border-radius:9px;
            background:#090909;
            overflow:hidden;
            display:flex;
            align-items:center;
            justify-content:center;
          ">
            ${
              x.demo
                ? `<img
                    loading="lazy"
                    src="${esc(x.demo)}"
                    alt="${esc(x.name)} demonstration"
                    style="
                      width:100%;
                      height:100%;
                      object-fit:contain;
                    "
                  >`
                : `<span style="
                    color:#aeb4bb;
                    font-size:12px;
                    padding:10px;
                    text-align:center;
                  ">DEMO NEEDED</span>`
            }
          </div>

          <strong style="
            font-size:13px;
            line-height:1.3;
          ">${esc(x.name)}</strong>

          <small style="color:#adb3bf">
            ${esc(x.group)} • ${esc(x.equipment)}
          </small>

          <small style="
            font-weight:bold;
            color:${x.demo ? "#ff8126" : "#e6b75a"};
          ">
            ${x.demo ? "VIEW DEMO" : "VIEW MISSING ASSET"}
          </small>
        </button>
      `).join("")
      : `<p style="color:#bbb">
           No matching exercises.
         </p>`;

    const detail = root.querySelector(
      "[data-review-detail]"
    );

    const item = all.find(
      x => String(x.id) === String(selected)
    );

    if (!item) {
      detail.innerHTML = `
        <p style="margin:0;color:#aab0bb">
          Select an exercise to inspect its
          demonstration or required filename.
        </p>
      `;
      return;
    }

    detail.innerHTML = `
      <div style="
        display:flex;
        justify-content:space-between;
        align-items:start;
        gap:10px;
        margin-bottom:12px;
      ">
        <div>
          <strong style="font-size:18px">
            ${esc(item.name)}
          </strong>
          <p style="color:#aaa;margin:5px 0">
            ${esc(item.group)} • ${esc(item.equipment)}
          </p>
        </div>

        <button
          type="button"
          data-review-clear
          style="
            background:transparent;
            color:white;
            border:1px solid #555;
            padding:7px;
            border-radius:8px;
            cursor:pointer;
          "
        >CLEAR</button>
      </div>

      ${
        item.demo
          ? `
            <img
              src="${esc(item.demo)}"
              alt="Start and finish demonstration for ${esc(item.name)}"
              style="
                width:100%;
                max-height:390px;
                object-fit:contain;
                background:#050505;
                border-radius:10px;
                border:1px solid #444;
              "
            >
            <p style="font-size:12px;color:#b4b8c0">
              Existing GitHub Start/Finish artwork.
              Inspect both frames for correct
              equipment and technique.
            </p>
          `
          : `
            <div style="
              padding:22px;
              background:#0b0b0b;
              border-radius:10px;
              text-align:center;
              color:#e6b75a;
            ">
              No verified matching demo exists
              in the current asset index.
            </div>
          `
      }

      <p style="
        color:#aaa;
        font-size:12px;
        overflow-wrap:anywhere;
      ">
        <strong style="color:#fff">
          ${item.demo ? "Existing file" : "Proposed filename"}:
        </strong>
        ${esc(item.demo || item.expected)}
      </p>

      ${
        item.demo
          ? `
            <button
              data-review-open="${esc(item.id)}"
              style="
                background:#26170e;
                border:1px solid #ff8126;
                border-radius:9px;
                padding:10px;
                color:white;
                font-weight:bold;
                cursor:pointer;
              "
            >
              OPEN ORIGINAL DEMO PLAYER
            </button>
          `
          : `
            <p style="
              font-size:12px;
              color:#b4b8c0;
            ">
              A proper Start/Finish image must be
              created and added to GitHub before
              connecting this exercise.
            </p>
          `
      }
    `;
  }

  async function show() {
    close();

    if (!registry()?.all?.()?.length) {
      try {
        await registry()?.load?.();
      } catch (error) {
        console.warn(
          "[Mana Visual Review] Library load:",
          error
        );
      }
    }

    const root = document.createElement("div");
    root.id = ID;

    root.setAttribute(
      "role",
      "dialog"
    );

    root.setAttribute(
      "aria-label",
      "Mana exercise visual review"
    );

    root.style.cssText = `
      position:fixed;
      inset:0;
      z-index:2147483001;
      background:rgba(0,0,0,.92);
      color:#fff;
      font-family:Arial,sans-serif;
      padding:12px;
      box-sizing:border-box;
      display:flex;
      align-items:center;
      justify-content:center;
    `;

    root.innerHTML = `
      <div style="
        max-width:1150px;
        width:100%;
        max-height:96vh;
        display:flex;
        flex-direction:column;
        background:#111216;
        border:1px solid #545a63;
        border-radius:15px;
        overflow:hidden;
      ">
        <header style="
          padding:15px 17px;
          border-bottom:1px solid #42464e;
          display:flex;
          justify-content:space-between;
          gap:12px;
          align-items:center;
        ">
          <div>
            <small style="
              font-weight:bold;
              color:#ff8126;
            ">
              MANA MOVEMENT • BUILD ${BUILD}
            </small>

            <h2 style="margin:5px 0">
              Exercise Visual Review
            </h2>

            <small
              data-review-count
              style="color:#bec2c8"
            ></small>
          </div>

          <button
            data-review-close
            style="
              background:#28180e;
              border:1px solid #ff8126;
              color:#fff;
              border-radius:9px;
              padding:10px 13px;
              cursor:pointer;
            "
          >
            CLOSE ×
          </button>
        </header>

        <div style="
          padding:10px 16px;
          display:flex;
          gap:8px;
          flex-wrap:wrap;
          align-items:center;
          border-bottom:1px solid #34383f;
        ">
          <button
            data-review-filter="all"
            style="
              background:#17181c;
              border:1px solid #555;
              color:white;
              border-radius:8px;
              padding:9px;
              cursor:pointer;
            "
          >ALL</button>

          <button
            data-review-filter="ready"
            style="
              background:#17181c;
              border:1px solid #555;
              color:white;
              border-radius:8px;
              padding:9px;
              cursor:pointer;
            "
          >WITH DEMOS</button>

          <button
            data-review-filter="missing"
            style="
              background:#17181c;
              border:1px solid #555;
              color:white;
              border-radius:8px;
              padding:9px;
              cursor:pointer;
            "
          >MISSING DEMOS</button>

          <input
            data-review-search
            type="search"
            placeholder="Search name, muscle or equipment"
            aria-label="Search exercises"
            style="
              flex:1;
              min-width:160px;
              background:#090a0c;
              border:1px solid #525864;
              border-radius:8px;
              color:white;
              padding:10px;
              font:inherit;
            "
          >
        </div>

        <div style="
          display:grid;
          grid-template-columns:
            minmax(0,1.4fr) minmax(250px,1fr);
          gap:0;
          min-height:0;
          flex:1;
          overflow:auto;
        ">
          <div style="
            overflow:auto;
            min-height:180px;
            max-height:70vh;
            padding:12px;
            border-right:1px solid #393d45;
          ">
            <div
              data-review-grid
              style="
                display:grid;
                grid-template-columns:
                  repeat(auto-fill,minmax(145px,1fr));
                gap:9px;
              "
            ></div>
          </div>

          <aside
            data-review-detail
            style="
              padding:15px;
              overflow:auto;
              max-height:70vh;
            "
          ></aside>
        </div>
      </div>
    `;

    root.addEventListener("click", event => {
      const btn = event.target.closest("button");

      if (
        event.target === root ||
        btn?.hasAttribute("data-review-close")
      ) {
        return close();
      }

      if (btn?.hasAttribute("data-review-clear")) {
        selected = null;
        return render();
      }

      if (btn?.hasAttribute("data-review-filter")) {
        filter = btn.dataset.reviewFilter;
        return render();
      }

      if (btn?.hasAttribute("data-review-id")) {
        selected = btn.dataset.reviewId;
        return render();
      }

      if (btn?.hasAttribute("data-review-open")) {
        const item = entries().find(
          x => String(x.id) === btn.dataset.reviewOpen
        );

        if (item?.demo) {
          window.MANA_EXERCISE_ASSETS?.openDemo?.(
            item.name
          );
        }
      }
    });

    root.querySelector(
      "[data-review-search]"
    ).addEventListener("input", event => {
      search = event.target.value;
      render();
    });

    document.body.appendChild(root);
    document.addEventListener("keydown", onKey);

    render();
    return stats();
  }

  window[KEY] = Object.freeze({
    build: BUILD,
    entries,
    stats,
    show,
    close
  });

  console.info(
    "[Mana Visual Review]",
    BUILD,
    "ready"
  );
})();
