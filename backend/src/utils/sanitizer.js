// In-place deep sanitizer to remove MongoDB operator keys (keys starting with '$' or containing '.')
// This avoids reassigning request properties like `req.query` which may be getter-only
const TEST_REGEX = /^\$|\./;
const TEST_REGEX_WITHOUT_DOT = /^\$/;

function isPlainObject(obj) {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

function sanitizeInPlace(target, options = {}) {
  if (!target || typeof target !== 'object') return target;
  const allowDots = Boolean(options.allowDots);
  const replaceWith = typeof options.replaceWith === 'string' ? options.replaceWith : null;
  const regex = allowDots ? TEST_REGEX_WITHOUT_DOT : TEST_REGEX;

  (function walk(obj) {
    if (Array.isArray(obj)) {
      obj.forEach(walk);
      return;
    }
    if (!isPlainObject(obj)) return;

    Object.keys(obj).forEach((key) => {
      const val = obj[key];
      if (regex.test(key)) {
        // delete the offending key
        try { delete obj[key]; } catch (e) { /* ignore */ }
        if (replaceWith) {
          const newKey = key.replace(/(^\$|\.)/g, replaceWith);
          if (newKey !== '__proto__' && newKey !== 'constructor' && newKey !== 'prototype') {
            try { obj[newKey] = val; } catch (e) { /* ignore */ }
          }
        }
        // if not replacing, skip recursing into this key
      } else if (isPlainObject(val) || Array.isArray(val)) {
        walk(val);
      }
    });
  })(target);

  return target;
}

module.exports = { sanitizeInPlace };
