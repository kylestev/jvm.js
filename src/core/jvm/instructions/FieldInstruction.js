/** @ignore */
const MemberInstruction = require('./MemberInstruction');

export default class FieldInstruction extends MemberInstruction {

  constructor(methodInfo, idx, opcode) {
    super(methodInfo, idx, opcode);
  }
}