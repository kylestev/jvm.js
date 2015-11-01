import * as _ from 'lodash';
import { getInstructionType } from './Opcodes';

export class InstructionFactory {
  constructor(idx, opcode, wide) {
    this.idx = idx;
    this.opcode = opcode;
    this.wide = wide;
    this.instruction = getInstructionType(opcode);
  }

  get isWide() {
    return this.instruction.subject_to_wide;
  }

  get shouldWrap() {
    return this.wrapType !== null;
  }

  get wrapType() {
    return this.instruction.wrap || null;
  }

  build() {
    let instance = this.createInstance();

    if (this.shouldWrap) {
      instance = new this.wrapType(instance);
    }

    return instance;
  }

  createInstance() {
    let InsnType = this.instruction.type;

    return this.isWide
      ? new InsnType(this.idx, this.opcode, this.wide)
      : new InsnType(this.idx, this.opcode);
  }

  static of(idx, opcode, wide) {
    return (new InstructionFactory(idx, opcode, wide)).build();
  }
}