/** @ignore */
const ImmediateShortInstruction = require('./ImmediateShortInstruction');

export default class FieldInstruction extends ImmediateShortInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
  }
}