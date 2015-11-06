import * as _ from 'lodash';

/**
 * Abstract class for extracting the same functionality between the FieldInfo,
 * MethodInfo, and ClassInfo classes.
 */
class MemberInfo {
  /**
   * @param  {Number} accessFlags - access flags bit string
   * @param  {string} name - name of this entry in the ClassFile
   */
  constructor(accessFlags, name) {
    this._attributes = [];
    this._flags = accessFlags;
    this._name = name;
  }

  /**
   * Access flags bit string
   * @return {Number}
   */
  get accessFlags() {
    return this._flags;
  }

  /**
   * Collection of {@link AttributeInfo>} objects belonging to this entry.
   * @return {Array<AttributeInfo>}
   */
  get attributes() {
    return this._attributes;
  }

  /**
   * Adds the specified attribute to this entry's collection of attributes.
   * @param {AttributeInfo} attr
   */
  addAttribute(attr) {
    this._attributes.push(attr);
  }

  /**
   * Finds the first attribute for a given name.
   * @param  {string} name - search criteria
   * @return {AttributeInfo|undefined}
   */
  findAttributeByName(name) {
    return _.first(this.findAttributesByName(name));
  }

  /**
   * Finds all attributes that exactly match the specified name.
   * @param  {string} name - search criteria
   * @return {Array<AttributeInfo>}
   */
  findAttributesByName(name) {
    return this.attributes.filter((attr) => attr.name === name);
  }

  /**
   * Checks to see if an access flag bit has been set.
   * @param  {Number} flag - bitmask
   * @return {Boolean}
   */
  hasFlag(flag) {
    return ((this.accessFlags & flag) !== 0);
  }

  /**
   * The name of this entry in the JVM Class File.
   * @return {string}
   */
  get name() {
    return this._name;
  }

  /**
   * Serialized version of this class without circular references.
   * @return {Object}
   */
  toObject() {
    return {
      name: this.name,
      flags: this.flags,
      attributes: _.map(this.attributes, (attribute) => attribute.toObject())
    };
  }
}

export {
  MemberInfo
};
