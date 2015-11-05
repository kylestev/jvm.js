import * as _ from 'lodash';

class ClassCollection {
  constructor(map) {
    this._classes = map;
  }

  get classes() {
    return this._classes;
  }

  get(name) {
    return this.classes.get(name);
  }

  has(name) {
    return this.classes.has(name);
  }

  set(name, cls) {
    return this.classes.set(name, cls);
  }

  [Symbol.iterator]() {
    return this._classes.entries();
  }

  static empty() {
    return new ClassCollection(new Map());
  }

  static of(classes) {
    if (classes instanceof Map) {
      return new ClassCollection(classes);
    }

    let mapping = new Map();
    for (let [name, cls] of classes) {
      mapping.set(name, cls);
    }

    return new ClassCollection(mapping);
  }
}

export {
  ClassCollection
};
