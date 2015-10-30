const PaddedInstruction = require('./PaddedInstruction');

export default class TableSwitchInstruction extends PaddedInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
  }
}