const AbstractInstruction = require('./AbstractInstruction');

export default class ConstantInstruction extends AbstractInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
  }
}