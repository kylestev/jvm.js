const ImmediateShortInstruction = require('./ImmediateShortInstruction');

export default class MultianewarrayInstruction extends ImmediateShortInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
  }
}