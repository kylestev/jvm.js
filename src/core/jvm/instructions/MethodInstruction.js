const ImmediateShortInstruction = require('./ImmediateShortInstruction');

export default class MethodInstruction extends ImmediateShortInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
  }
}