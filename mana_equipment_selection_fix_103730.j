
/* =========================================================
   MANA MOVEMENT TRAINING — EQUIPMENT SELECTION FIX
   BUILD 103730 — COMPLETE JAVASCRIPT FILE

   Fix: previously saved Kettlebells must not override a new
   Full Gym / Dumbbells / Home Basics / Bodyweight selection.

   Keeps the existing kettlebell library and program builder.
   No polling, global DOM interception or workout changes.
   ========================================================= */
(() => {
  'use strict';

  if (window.MANA_EQUIPMENT_SELECTION_FIX_103730) return;
  window.MANA_EQUIPMENT_SELECTION_FIX_103730 = true;

  const PROFILE_KEY = 'mana-profile-v67';
  const SELECT_ID = 'manaProfileEquipment';
  const BUILDER_SELECTOR = '[data-strength-group="equipment"]';
  const OPTIONS = new Set([
    'Full gym', 'Dumbbells', 'Home basics', 'Bodyweight', 'Kettlebells'
  ]);
  let userChoice = null;

  function readProfile() {
    try {
      const value = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
      return value && typeof value === 'object' && !Array.isArray(value)
        ? value : {};
    } catch (_) {
      return {};
    }
  }

  function storeChoice(value) {
    if (!OPTIONS.has(value)) return;
    userChoice = value;
    try {
      const profile = readProfile();
      if (profile.equipment !== value) {
        profile.equipment = value;
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      }
    } catch (error) {
      console.warn('Mana equipment preference could not be saved', error);
    }
  }

  function syncBuilder(value) {
    const group = document.querySelector(BUILDER_SELECTOR);
    if (!group || !OPTIONS.has(value)) return;
    // Visual state only: the original builder handles program generation.
    group.querySelectorAll('[data-value]').forEach(button => {
      const selected = button.dataset.value === value;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  function onEquipmentChange(event) {
    const select = event.target;
    if (!(select instanceof HTMLSelectElement) || select.id !== SELECT_ID) return;
    storeChoice(select.value);
    syncBuilder(select.value);
  }

  function onBuilderClick(event) {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest(BUILDER_SELECTOR + ' [data-value]');
    if (!button || !OPTIONS.has(button.dataset.value)) return;
    // Capture the intention immediately, before old navigation refreshes.
    storeChoice(button.dataset.value);
    const select = document.getElementById(SELECT_ID);
    if (select && select.querySelector('option[value="' + button.dataset.value + '"]')) {
      select.value = button.dataset.value;
    }
  }

  function onSaveClick(event) {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest('#manaProfileSave');
    if (!button) return;
    const select = document.getElementById(SELECT_ID);
    if (select instanceof HTMLSelectElement && OPTIONS.has(select.value)) {
      storeChoice(select.value);
      // Re-apply after the original save handler has finished.
      queueMicrotask(() => storeChoice(select.value));
    }
  }

  function init() {
    // Capturing change before the 103490 navigation handler prevents the
    // old persisted selection from overriding the user's new choice.
    document.addEventListener('change', onEquipmentChange, true);
    document.addEventListener('input', onEquipmentChange, true);
    document.addEventListener('click', onBuilderClick, true);
    document.addEventListener('click', onSaveClick, true);
    console.log('Mana equipment selection fix 103730 ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
