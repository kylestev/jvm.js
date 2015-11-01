const AbstractInstruction = require('./AbstractInstruction');

export default class CastInstruction extends AbstractInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
  }
}