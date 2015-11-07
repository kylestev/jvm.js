/** @ignore */
const ImmediateShortInstruction = require('./ImmediateShortInstruction');

export default class MethodInstruction extends ImmediateShortInstruction {

  constructor(methodInfo, idx, opcode) {
    super(methodInfo, idx, opcode);
  }
}