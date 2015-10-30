const AbstractInstruction = require('./AbstractInstruction');

export default class ArithmeticInstruction extends AbstractInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
  }
}