// Session store (token + user) persisted in localStorage and exposed to React
// through useSyncExternalStore, so the server and the first client render agree
// (`ready: false`) and every open tab stays in sync.
import { setAuthToken } from '@/lib/api/client';
import { STORAGE_KEYS } from '@/lib/constants';

const SERVER_SNAPSHOT = Object.freeze({ ready: false, token: null, user: null });
const EMPTY = Object.freeze({ ready: true, token: null, user: null });

let snapshot = null;
const listeners = new Set();

function readStorage() {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.token);
    const rawUser = localStorage.getItem(STORAGE_KEYS.user);
    const user = rawUser ? JSON.parse(rawUser) : null;
    return token && user ? { ready: true, token, user } : EMPTY;
  } catch {
    return EMPTY;
  }
}

function writeStorage({ token, user }) {
  try {
    if (token && user) {
      localStorage.setItem(STORAGE_KEYS.token, token);
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.token);
      localStorage.removeItem(STORAGE_KEYS.user);
    }
  } catch {
    // storage unavailable (private mode): the session lives in memory only
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function getSession() {
  if (typeof window === 'undefined') return SERVER_SNAPSHOT;
  if (!snapshot) {
    snapshot = readStorage();
    setAuthToken(snapshot.token);
  }
  return snapshot;
}

export const getServerSession = () => SERVER_SNAPSHOT;

function onStorage(event) {
  if (event.key === STORAGE_KEYS.token || event.key === STORAGE_KEYS.user) {
    snapshot = readStorage();
    setAuthToken(snapshot.token);
    emit();
  }
}

export function subscribe(listener) {
  if (listeners.size === 0) window.addEventListener('storage', onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener('storage', onStorage);
  };
}

export function setSession({ token, user }) {
  snapshot = token && user ? { ready: true, token, user } : EMPTY;
  setAuthToken(snapshot.token);
  writeStorage(snapshot);
  emit();
}

export function updateSessionUser(user) {
  const current = getSession();
  if (!current.token) return;
  setSession({ token: current.token, user: { ...current.user, ...user } });
}

export function updateSessionToken(token) {
  const current = getSession();
  if (!current.user || !token) return;
  setSession({ token, user: current.user });
}

export function clearSession() {
  setSession({ token: null, user: null });
}
