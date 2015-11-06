import * as _ from 'lodash';
import { ACC_ABSTRACT, ACC_SYNTHETIC } from './AccessFlags';
import { parseInstructions } from '../parsers/BytecodeInstructions';

const AttributeDecoderLookup = {
  Code: function (method) {
    if (method.hasNoMethodBody) {
      throw new Error('This method has no method body.');
    }

    return parseInstructions(method);
  }
};

/**
 * Wraps JVM Class File Attributes for Classes, Methods and Fields.
 */
class AttributeInfo {
  /**
   * @param  {Object} attr - raw attribute data
   * @param  {MemberInfo} owner - the owning object of this attribute
   */
  constructor(attr, owner) {
    /** @type {Object} */
    this._attr = attr;
    /** @type {Buffer} */
    this._data = attr.info;
    /** @type {Boolean} */
    this._decoded = false;
    /** @type {string} */
    this._name = attr.attribute_name;
    /** @type {MemberInfo} */
    this._owner = owner;
  }

  /**
   * Attempts to decode the attribute against a lookup table of supported
   * attribute parsers. This should work on all well-formed, attributes
   * supported by the Java SE runtimes.
   * @return {Object}
   */
  get decoded() {
    if ( ! this.hasDecoded) {
      if ( ! _.has(AttributeDecoderLookup, this._name)) {
        throw new Error('Attribute could not be decoded as it has no known decoder.');
      }

      this._decoded = AttributeDecoderLookup[this._name](this._owner);
    }

    return this._decoded;
  }

  /**
   * `true` if this attribute has been decoded
   * @return {Boolean}
   */
  get hasDecoded() {
    return this._decoded !== false;
  }

  /**
   * Official name of the Attribute
   * @return {string}
   */
  get name() {
    return this._name;
  }

  /**
   * Object parsed from JVM Class File.
   * @return {Object}
   */
  get raw() {
    return this._attr;
  }

  /**
   * Raw Buffer of the Attribute from the JVM Class File.
   * @return {Buffer}
   */
  get rawData() {
    return this._data;
  }

  /**
   * Serialized version of this class without circular references.
   * @return {Object}
   */
  toObject() {
    return {
      name: this.name,
      length: this._attr.attribute_length
    };
  }
}

export {
  AttributeInfo
};
