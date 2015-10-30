const AbstractInstruction = require('./AbstractInstruction');

export default class PushInstruction extends AbstractInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
  }
}