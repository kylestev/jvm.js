const ImmediateShortInstruction = require('./ImmediateShortInstruction');

export default class InvokeInterfaceInstruction extends ImmediateShortInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
  }
}