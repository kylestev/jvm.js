import * as _ from 'lodash';
import { MemberInfo } from './MemberInfo';

/**
 * Wrapper for JVM Class File field entry.
 */
class FieldInfo extends MemberInfo {
  /**
   * @param  {Number} accessFlags - access flags bit string
   * @param  {string} name - name of this entry in the ClassFile
   * @param  {string} descriptor - type descriptor
   */
  constructor(flags, name, descriptor) {
    super(flags, name);
    /** @type {string} type descriptor */
    this._descriptor = descriptor;
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
