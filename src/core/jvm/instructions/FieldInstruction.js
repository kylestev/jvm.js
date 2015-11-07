/** @ignore */
const ImmediateShortInstruction = require('./ImmediateShortInstruction');

export default class FieldInstruction extends ImmediateShortInstruction {

  constructor(methodInfo, idx, opcode) {
    super(methodInfo, idx, opcode);
  }
}