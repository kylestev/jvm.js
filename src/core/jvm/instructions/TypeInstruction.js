/** @ignore */
const ImmediateShortInstruction = require('./ImmediateShortInstruction');

export default class TypeInstruction extends ImmediateShortInstruction {

  constructor(methodInfo, idx, opcode) {
    super(methodInfo, idx, opcode);
  }
}
