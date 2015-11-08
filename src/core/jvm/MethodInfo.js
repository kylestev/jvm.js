import * as _ from 'lodash';
import { ACC_SYNTHETIC, ACC_ABSTRACT } from './AccessFlags';
import { MemberInfo } from './MemberInfo';

let parameterParser = (desc) => {
  let params = [];
  let paramString = desc.slice(desc.indexOf('(') + 1, desc.indexOf(')'));
  let arrayStr = '';
  for (let i = 0; i < paramString.length;) {
    let token = paramString[i];
    switch (token) {
      case '[':
        arrayStr += '[';
        i++
        break;
      case 'B':
      case 'C':
      case 'D':
      case 'F':
      case 'I':
      case 'J':
      case 'S':
      case 'Z':
        params.push(arrayStr + token);
        arrayStr = '';
        i++
        break;
      case 'L':
        let end = paramString.indexOf(';', i);
        let param = paramString.slice(i, end + 1);
        params.push(arrayStr + param);
        arrayStr = '';
        i += param.length;
        break;
    }
  }

  return params;
};

/**
 * Wrapper for JVM Class File method entry.
 */
class MethodInfo extends MemberInfo {
  /**
   * 
   * @param  {ClassInfo} classInfo - The class the given method is in
   * @param  {Number} accessFlags - access flags bit string
   * @param  {string} name - name of this entry in the ClassFile
   * @param  {string} descriptor - type descriptor
   */
  constructor(classInfo, flags, name, descriptor) {
    super(flags, name);
    /** @type {ClassInfo} class this method is within */
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
   * Parses the method descriptor's parameters.
   * @return {Array<string>}
   */
  get parameters() {
    return parameterParser(this.desc);
  }

  /**
   * Parses the return type from the method's descriptor.
   * @return {string}
   */
  get returnType() {
    return this.desc.slice(this.desc.lastIndexOf(')') + 1);
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
  MethodInfo,
  parameterParser
};
