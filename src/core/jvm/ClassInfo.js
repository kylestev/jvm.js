import * as _ from 'lodash';
import { MemberInfo } from './MemberInfo';

/**
 * A wrapper for the JVM Class File format with helper methods for
 * adding and removing members from it.
 */
class ClassInfo extends MemberInfo {
  /**
   * @param  {Number} flags - access flags bit string
   * @param  {{major: Number, minor: Number}} version - Java SE compilation target versions
   * @param  {string} name - name of the class file
   * @param  {string} superName - Super class name
   * @param  {ConstantPool} pool - {@link ConstantPool} reference for this class
   */
  constructor(flags, version, name, superName, pool) {
    super(flags, name);
    /** @type {Object} */
    this._version = version;
    this._fields = [];
    this._interfaces = [];
    this._methods = [];
    this._pool = pool;
    this._superName = superName;
  }

  /**
   * Adds a field to this instance's JVM Class File representation.
   * @param {string} inter - FQCN of the interface to assign to this class
   */
  addInterface(inter) {
    this._interfaces.push(inter);
  }

  /**
   * Adds a field to this instance's JVM Class File representation.
   * @param {FieldInfo} field
   */
  addField(field) {
    this._fields.push(field);
  }

  /**
   * Adds a method to this instance's JVM Class File representation.
   * @param {MethodInfo} method
   */
  addMethod(method) {
    this._methods.push(method);
  }

  /**
   * Array of FieldInfo objects in the underlying JVM Class File.
   * @return {Array<FieldInfo>}
   */
  get fields() {
    return this._fields;
  }

  /**
   * Array of interfaces represented as strings in the FQCN format
   * that this class implements.
   * @return {Array<string>}
   */
  get interfaces() {
    return this._interfaces;
  }

  /**
   * The major version of the target Java SE platform this was
   * compiled for.
   * @return {Number}
   */
  get major() {
    return this._version.major;
  }

  /**
   * Array of MethodInfo objects in the underlying JVM Class File.
   * @return {Array<MethodInfo>}
   */
  get methods() {
    return this._methods;
  }

  /**
   * The minor version of the target Java SE platform this was
   * compiled for.
   * @return {Number}
   */
  get minor() {
    return this._version.minor;
  }

  /**
   * {@link ConstantPool} of the underlying JVM Class File.
   * @return {ConstantPool}
   */
  get pool() {
    return this._pool;
  }

  /**
   * The name of the super class for this JVM Class File.
   * @return {string|null}
   */
  get superName() {
    return this._superName;
  }

  /**
   * Helper method for casting this instance into a JSON string.
   * @return {string}
   */
  toJson() {
    return JSON.stringify(this.toObject(), null, 2);
  }

  /**
   * Serialized version of this class without circular references.
   * @return {Object}
   */
  toObject() {
    let obj = super.toObject();
    let props = {
      superName: this.superName,
      major: this.major,
      minor: this.minor,
      interfaces: this.interfaces,
      pool: this._pool.toObject(),
      fields: _.map(this.fields, (field) => field.toObject()),
      methods: _.map(this.methods, (method) => method.toObject()),
    };

    return _.merge(obj, props);
  }
}

export {
  ClassInfo
};
