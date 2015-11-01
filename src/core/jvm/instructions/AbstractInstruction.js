import {OPCODE_TO_NAME} from '../../parsers/BytecodeInstructions';

export default class AbstractInstruction {
    
  constructor(idx, opcode) {
    this.idx = idx;
    this.opcode = opcode;
    this.wide = false;
    this.offset = 0;
    this.previous = null;
    this.next = null;
  }

  get opname() {
    return OPCODE_TO_NAME[this.opcode];
  }

  get size() {
    return 1;
  }

  read(buffer) {
    this.offset = (buffer.pos - 1);
  }

  write(buffer) {
    
  }
}