import * as _ from 'lodash';
import { MemberInfo } from './MemberInfo';

/**
 * Wrapper for JVM Class File field entry.
 */
class FieldInfo extends MemberInfo {
  /**
   * @param  {ClassInfo} classInfo - The class the given field is in
   * @param  {Number} accessFlags - access flags bit string
   * @param  {string} name - name of this entry in the ClassFile
   * @param  {string} descriptor - type descriptor
   */
  constructor(classInfo, flags, name, descriptor) {
    super(flags, name);
    /** @type {ClassInfo} class this field is within */
    this._classInfo = classInfo;
    /** @type {string} type descriptor */
    this._descriptor = descriptor;
  }

  /**
   * Access the class this member is within
   * @return {ClassInfo}
   */
  get classInfo() {
    return this._classInfo;
  }

  /**
   * JVM type descriptor
   * @return {string}
   */
  get desc() {
    return this._descriptor;
  }

  /**
   * Serialized version of this class without circular references.
   * @return {Object}
   */
  toObject() {
    return _.merge(super.toObject(), {
      desc: this.desc
    });
  }
}

export {
  FieldInfo
};
