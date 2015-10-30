import {OPCODE_TO_NAME} from '../../parsers/BytecodeInstructions';

export default class AbstractInstruction {
    
  constructor(idx, opcode) {
    this.idx = idx;
    this.opcode = opcode;
  }

  get opname() {
    return OPCODE_TO_NAME[this.opcode];
  }
}