const ImmediateShortInstruction = require('./ImmediateShortInstruction');

export default class InvokeDynamicInstruction extends ImmediateShortInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
  }
}