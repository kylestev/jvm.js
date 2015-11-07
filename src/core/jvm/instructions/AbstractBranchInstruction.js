/** @ignore */
const AbstractInstruction = require('./AbstractInstruction');

export default class AbstractBranchInstruction extends AbstractInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
    this.branchOffset = 0;
  }

  get totalOffset() {
    return this.idx + this.branchOffset;
  }

  toObject() {
    return super.toObject({
      branch_offset: this.branchOffset,
      total_offset: this.totalOffset
    });
  }
}