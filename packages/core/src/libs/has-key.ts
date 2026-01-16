/**
 * Checks if given key exist in that given object
 *
 * @param {*} obj
 * @param {(string | symbol)} key
 * @returns {boolean}
 */
export function hasKey(obj: Record<PropertyKey, unknown>, key: PropertyKey): boolean {
  if (typeof key === 'symbol') {
    return Object.getOwnPropertySymbols(obj).includes(key);
  }
  return Object.hasOwn(obj, key);
}
