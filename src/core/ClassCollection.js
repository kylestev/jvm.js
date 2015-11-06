import * as _ from 'lodash';

/**
 * Wrapper for a {@link Map} with keys being {@link string}s and entries
 * being {@link ClassInfo} objects.
 */
class ClassCollection {
  /**
   * @private
   * @param  {Map<string, ClassInfo>} map
   */
  constructor(map) {
    /** @type {Map<string, ClassInfo>} */
    this._classes = map;
  }

  /**
   * Exposes the raw {@link Map} object.
   * @public
   * @return {Map<string, ClassInfo>}
   */
  get classes() {
    return this._classes;
  }

  /**
   * Retrieves a {@link ClassInfo} object from the collection by name.
   * @public
   * @param  {string} name
   * @return {ClassInfo|undefined}
   */
  get(name) {
    return this.classes.get(name);
  }

  /**
   * Checks to see if the collection contains an entry for the specified name.
   * @public
   * @param  {string}  name
   * @return {Boolean}
   */
  has(name) {
    return this.classes.has(name);
  }

  /**
   * Sets the corresponding entry in the collection for the specified name.
   * @public
   * @param {string} name
   * @param {ClassInfo} cls
   */
  set(name, cls) {
    return this.classes.set(name, cls);
  }

  /**
   * @return {Iterable}
   */
  [Symbol.iterator]() {
    return this._classes.entries();
  }

  /**
   * Static constructor for a new, empty {@link ClassCollection}.
   * @public
   * @return {ClassCollection}
   */
  static empty() {
    return new ClassCollection(new Map());
  }

  /**
   * Static constructor for creating a new {@link ClassCollection} instance
   * from a {@link Map}.
   * @public
   * @param  {Map<string, ClassInfo>} classes
   * @return {ClassCollection}
   */
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
