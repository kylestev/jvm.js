const ImmediateShortInstruction = require('./ImmediateShortInstruction');

export default class MultianewarrayInstruction extends ImmediateShortInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
    this.dimensions = 0;
  }

  get size() {
    return super.size + 1;
  }

  read(buffer) {
    this.dimensions = buffer.byte();
  }
}