/** @ignore */
const MemberInstruction = require('./MemberInstruction');

import { parameterParser } from '../MethodInfo';

export default class MethodInstruction extends MemberInstruction {

  constructor(methodInfo, idx, opcode) {
    super(methodInfo, idx, opcode);
  }

  /**
   * Slices the parameters from the method this instruction refers to.
   * @return {Array<string>} method parameter types
   */
  get parameters() {
    return parameterParser(this.desc);
  }
}
