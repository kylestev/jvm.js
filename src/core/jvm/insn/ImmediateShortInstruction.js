const AbstractInstruction = require('./AbstractInstruction');

export default class ImmediateShortInstruction extends AbstractInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
  }
}