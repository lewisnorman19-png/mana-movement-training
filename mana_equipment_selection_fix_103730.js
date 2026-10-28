
/* ============================================================
   MANA MOVEMENT TRAINING — EQUIPMENT SELECTION REPAIR
   BUILD 103730 — COMPLETE STANDALONE JAVASCRIPT FILE

   Fixes persisted Kettlebells being reapplied when switching
   the Profile Equipment dropdown to Full gym, Dumbbells,
   Home basics, or Bodyweight.

   Does not rebuild the profile, workouts, chats or demos.
   ============================================================ */
(() => {
  'use strict';

  if (window.MANA_EQUIPMENT_SELECTION_REPAIR_103730) return;
  window.MANA_EQUIPMENT_SELECTION_REPAIR_103730 = true;

  const KEY = 'mana-profile-v67';
  const EQUIPMENT_ID = 'manaProfileEquipment';
  const BUILDER = '[data-strength-group="equipment"]';
  const VALID = new Set([
    'Full gym',
    'Dumbbells',
    'Home basics',
    'Bodyweight',
    'Kettlebells'
  ]);

  function readProfile() {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || '{}');
      return value && typeof value === 'object' && !Array.isArray(value)
        ? value : {};
    } catch (error) {
      console.warn('Mana profile equipment: profile read failed', error);
      return {};
    }
  }

  function persistEquipment(value) {
    if (!VALID.has(value)) return;
    try {
      const profile = readProfile();
      if (profile.equipment !== value) {
        profile.equipment = value;
        localStorage.setItem(KEY, JSON.stringify(profile));
      }
    } catch (error) {
      console.warn('Mana profile equipment: save failed', error);
    }
  }

  function onProfileSelection(event) {
    const select = event.target;
    if (!(select instanceof HTMLSelectElement) || select.id !== EQUIPMENT_ID) return;

    // Persist the user's latest choice before the older kettlebell
    // upgrade can reapply a previously saved choice.
    persistEquipment(select.value);
  }

  function onBuilderSelection(event) {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest(BUILDER + ' [data-value]');
    if (!button || !VALID.has(button.dataset.value)) return;

    // The program builder has its own selection logic. Capture the
    // user's choice without interfering with program generation.
    persistEquipment(button.dataset.value);
  }

  function onProfileSave(event) {
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest('#manaProfileSave')) return;
    const select = document.getElementById(EQUIPMENT_ID);
    if (select instanceof HTMLSelectElement) {
      persistEquipment(select.value);
    }
  }

  function init() {
    document.addEventListener('change', onProfileSelection, true);
    document.addEventListener('input', onProfileSelection, true);
    document.addEventListener('click', onBuilderSelection, true);
    document.addEventListener('click', onProfileSave, true);

    console.log('Mana equipment selection repair 103730 loaded');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
