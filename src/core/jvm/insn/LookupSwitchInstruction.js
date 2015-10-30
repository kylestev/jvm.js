const PaddedInstruction = require('./PaddedInstruction');

export default class LookupSwitchInstruction extends PaddedInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
  }
}