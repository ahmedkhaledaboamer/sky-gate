import { PASSWORD_MIN } from './constants';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// API accepts Egyptian, Saudi and UAE mobile numbers (ar-EG / ar-SA / ar-AE)
const PHONE_RE =
  /^(?:(?:\+?20|0)?1[0125]\d{8}|(?:\+?966|0)?5\d{8}|(?:\+?971|0)?5[024568]\d{7})$/;

export const isEmail = (v) => EMAIL_RE.test(String(v || '').trim());
export const isPhone = (v) => PHONE_RE.test(String(v || '').replace(/[\s-]/g, ''));

/**
 * Tiny rule runner. `rules` = { field: [[test, message], ...] }.
 * Returns { field: message } for the first failing rule of each field.
 */
export function validate(values, rules) {
  const errors = {};
  Object.entries(rules).forEach(([field, checks]) => {
    for (const [test, message] of checks) {
      if (!test(values[field], values)) {
        errors[field] = message;
        break;
      }
    }
  });
  return errors;
}

export const rules = {
  required: (msg) => [(v) => String(v ?? '').trim() !== '', msg],
  email: (msg) => [(v) => !v || isEmail(v), msg],
  phone: (msg) => [(v) => !v || isPhone(v), msg],
  minLength: (n, msg) => [(v) => !v || String(v).trim().length >= n, msg],
  maxLength: (n, msg) => [(v) => !v || String(v).trim().length <= n, msg],
  password: (msg) => [(v) => !v || String(v).length >= PASSWORD_MIN, msg],
  matches: (field, msg) => [(v, all) => v === all[field], msg],
  number: (msg, { min = -Infinity, max = Infinity, integer = false } = {}) => [
    (v) => {
      if (v === '' || v === undefined || v === null) return true;
      const n = Number(v);
      if (Number.isNaN(n) || n < min || n > max) return false;
      return integer ? Number.isInteger(n) : true;
    },
    msg,
  ],
  custom: (test, msg) => [test, msg],
};
