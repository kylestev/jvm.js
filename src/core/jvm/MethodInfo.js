import * as _ from 'lodash';
import { ACC_SYNTHETIC, ACC_ABSTRACT } from './AccessFlags';
import { MemberInfo } from './MemberInfo';

/**
 * Wrapper for JVM Class File method entry.
 */
class MethodInfo extends MemberInfo {
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
   * Checks if the method should not have a method body by seeing if the
   * Synthetic or Abstract access flags are set.
   * @return {Boolean}
   */
  get hasNoMethodBody() {
    return this.hasFlag(ACC_SYNTHETIC) || this.hasFlag(ACC_ABSTRACT);
  }

  /**
   * Inverse of {@link MethodInfo.hasNoMethodBody}.
   * @return {Boolean}
   */
  get hasMethodBody() {
    return ! this.hasNoMethodBody;
  }

  /**
   * Getter for the collection of instructions belonging to a method.
   * @return {Array<AbstractInstruction>}
   */
  get instructions() {
    let code = this.findAttributeByName('Code');
    if (code) {
      return code.decoded;
    }
    return [];
  }

  /**
   * Serialized version of this class without circular references.
   * @return {Object}
   */
  toObject() {
    return _.merge(super.toObject(), {
      desc: this.desc,
      instructions: _.map(this.instructions, (insn) => insn.toObject())
    });
  }
}

export {
  MethodInfo
};
