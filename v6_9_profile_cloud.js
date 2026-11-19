
/* MANA MOVEMENT — ACCOUNT-SAFE PROFILE CLOUD SYNC | 105015
   COMPLETE REPLACEMENT for v6_9_profile_cloud.js
   Does not reopen a profile while it is being edited.
   Never uploads an unowned browser cache to a different account.
   Existing profile_settings table and public manaSyncProfile API preserved. */
(() => {
  'use strict';
  if (window.MANA_PROFILE_CLOUD_105015) return;
  window.MANA_PROFILE_CLOUD_105015 = true;

  const KEY = 'mana-profile-v67';
  const OWNER = 'mana-profile-v67-owner-105015';
  const TABLE = 'profile_settings';
  let syncing = false;
  let currentUserId = '';
  let dirty = false;
  let editingSince = 0;
  let deferred = false;
  let generation = 0;

  const $ = id => document.getElementById(id);
  const json = (raw, fallback = {}) => {
    try { return JSON.parse(raw || '') || fallback; }
    catch (_) { return fallback; }
  };
  const local = () => json(localStorage.getItem(KEY));
  const hasData = p => !!(p && (p.name || p.age || p.height || p.weight ||
    p.days || p.goal || p.experience || p.equipment));
  const timestamp = x => {
    const n = Date.parse(x || '');
    return Number.isFinite(n) ? n : 0;
  };
  const profileOpen = () => $('manaProfileScreen')?.classList.contains('open');
  const isEditing = () => dirty || (profileOpen() &&
    $('manaProfileScreen')?.contains(document.activeElement) &&
    /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '');

  function saveLocal(profile) { localStorage.setItem(KEY, JSON.stringify(profile)); }
  function announce() { window.dispatchEvent(new CustomEvent('mana:profile-synced')); }
  function status(message) { const el = $('manaProfileStatus'); if (el) el.textContent = message; }

  function cloudToLocal(row) {
    return {
      name: row.name || '', age: Number(row.age) || 0,
      height: Number(row.height_cm) || 0,
      weight: Number(row.weight_kg) || 0,
      days: row.training_days ? String(row.training_days) : '',
      goal: row.goal || '', experience: row.experience || '',
      equipment: row.equipment || '',
      updatedAt: row.updated_at || new Date().toISOString()
    };
  }
  function localToCloud(p, id) {
    return {
      user_id: id,
      name: p.name || null,
      age: Number(p.age) || null,
      height_cm: Number(p.height) || null,
      weight_kg: Number(p.weight) || null,
      training_days: Number(p.days) || null,
      goal: p.goal || null,
      experience: p.experience || null,
      equipment: p.equipment || null,
      updated_at: p.updatedAt || new Date().toISOString()
    };
  }
  async function clientSession() {
    if (typeof window.supabaseClient !== 'function') return null;
    const client = await window.supabaseClient();
    const {data, error} = await client.auth.getUser();
    if (error || !data?.user?.id) return null;
    return {client, user: data.user};
  }
  // The legacy key was shared by all accounts on a browser.
  // Preserve its previous contents, but never treat unowned data as this user's.
  function isolateLocalFor(id) {
    const previousOwner = localStorage.getItem(OWNER);
    if (previousOwner === id) return false;
    const existing = localStorage.getItem(KEY);
    if (existing) {
      const backup = 'mana-profile-v67-backup-' + (previousOwner || 'unclaimed');
      if (!localStorage.getItem(backup)) localStorage.setItem(backup, existing);
      localStorage.removeItem(KEY);
    }
    localStorage.setItem(OWNER, id);
    dirty = false;
    editingSince = 0;
    return true;
  }
  // Refresh the visible form only if it is idle, so phones never lose the keyboard.
  function refreshIdleForm() {
    if (!profileOpen()) return;
    if (isEditing()) { deferred = true; return; }
    if (typeof window.openManaProfile === 'function') window.openManaProfile();
  }
  async function reconcileProfile() {
    if (syncing) return;
    syncing = true;
    const request = ++generation;
    try {
      const session = await clientSession();
      if (!session) return;
      const {client, user} = session;
      const changed = currentUserId !== user.id;
      currentUserId = user.id;
      const isolated = isolateLocalFor(user.id);
      if (isEditing() && !isolated) { deferred = true; return; }
      const {data: row, error} = await client.from(TABLE)
        .select('*').eq('user_id', user.id).maybeSingle();
      if (error) throw error;
      if (request !== generation || currentUserId !== user.id) return;
      if (isEditing()) { deferred = true; return; }
      const onDevice = local();
      if (!row) {
        if (hasData(onDevice)) {
          const p = {...onDevice, updatedAt: onDevice.updatedAt || new Date().toISOString()};
          saveLocal(p);
          const saved = await client.from(TABLE).upsert(localToCloud(p,user.id), {onConflict:'user_id'});
          if (saved.error) throw saved.error;
        } else if (isolated || changed) {
          refreshIdleForm();
        }
        return;
      }
      const remote = cloudToLocal(row);
      if (!hasData(onDevice) || timestamp(remote.updatedAt) > timestamp(onDevice.updatedAt)) {
        saveLocal(remote);
        refreshIdleForm();
        announce();
      } else if (timestamp(onDevice.updatedAt) > timestamp(remote.updatedAt) && hasData(onDevice)) {
        const saved = await client.from(TABLE).upsert(localToCloud(onDevice,user.id), {onConflict:'user_id'});
        if (saved.error) throw saved.error;
      }
    } catch (error) {
      console.warn('[Mana Profile Sync 105015]', error);
    } finally { syncing = false; }
  }
  async function saveCurrentProfileCloud() {
    try {
      const session = await clientSession();
      if (!session) return;
      const {client,user} = session;
      if (currentUserId && currentUserId !== user.id) return;
      currentUserId = user.id;
      if (localStorage.getItem(OWNER) !== user.id) {
        // Don't upload an unverified or another account's cached profile.
        isolateLocalFor(user.id);
        status('Account changed — reopen Profile before saving.');
        return;
      }
      const p = local();
      if (!hasData(p)) return;
      p.updatedAt = new Date().toISOString();
      saveLocal(p);
      const result = await client.from(TABLE).upsert(localToCloud(p,user.id), {onConflict:'user_id'});
      if (result.error) throw result.error;
      dirty = false;
      deferred = false;
      status('Profile saved to cloud ✓');
      announce();
    } catch (error) {
      console.warn('[Mana Profile Save 105015]', error);
      status('Saved on device — cloud sync pending');
    }
  }
  function wireSave() {
    const btn = $('manaProfileSave');
    if (!btn || btn.dataset.manaCloud105015) return;
    btn.dataset.manaCloud105015 = '1';
    btn.addEventListener('click', () => {
      // v6.7 saves first; extended-profile saving is separate.
      setTimeout(() => { void saveCurrentProfileCloud(); }, 120);
    });
  }
  async function init() {
    const screen = $('manaProfileScreen');
    screen?.addEventListener('input', e => {
      if (e.target?.matches('input:not([type=file]),textarea,select')) {
        dirty = true; editingSince = Date.now();
      }
    }, true);
    screen?.addEventListener('change', e => {
      if (e.target?.matches('input:not([type=file]),textarea,select')) {
        dirty = true; editingSince = Date.now();
      }
    }, true);
    screen?.addEventListener('focusout', () => {
      setTimeout(() => {
        if (!isEditing() && deferred && !dirty) {
          deferred = false; void reconcileProfile();
        }
      }, 400);
    });
    document.addEventListener('click', e => {
      if (e.target.closest?.('#manaProfileSave')) wireSave();
    }, true);
    [0, 300, 700].forEach(ms => setTimeout(wireSave, ms));
    await reconcileProfile();
    setTimeout(() => { void reconcileProfile(); }, 1800);
    try {
      const session = await clientSession();
      session?.client?.auth?.onAuthStateChange(() => {
        currentUserId = '';
        dirty = false;
        setTimeout(() => { void reconcileProfile(); }, 180);
      });
    } catch (_) {}
    window.addEventListener('focus', () => {
      if (!isEditing()) void reconcileProfile();
    });
  }
  window.manaSyncProfile = reconcileProfile;
  window.MANA_PROFILE_CLOUD_BUILD = '105015';
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', () => {void init();}, {once:true});
  else void init();
})();
