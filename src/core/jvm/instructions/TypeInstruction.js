/** @ignore */
const ImmediateShortInstruction = require('./ImmediateShortInstruction');

export default class TypeInstruction extends ImmediateShortInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
  }
}