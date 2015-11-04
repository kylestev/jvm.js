const InstructionWrapper = require('./InstructionWrapper');

export default class ConstantInstruction extends InstructionWrapper {

  constructor(instruction) {
    super(instruction);
  }
}