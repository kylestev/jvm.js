export function cloneSet(aSet) {
  let clone = new Set;
  for (let key of aSet.keys()) {
    clone.add(key);
  }
  return clone;
}

export function objectFromMap(iter) {
  let obj = {};
  for (let [key, val] of iter) {
    obj[key] = val;
  }
  return obj;
}
