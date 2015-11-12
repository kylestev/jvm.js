/** @ignore */
const AbstractInstruction = require('./AbstractInstruction');

export default class AbstractBranchInstruction extends AbstractInstruction {

  constructor(methodInfo, idx, opcode) {
    super(methodInfo, idx, opcode);
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

  toString() {
    return super.toString({ branchOffset: this.branchOffset, totalOffset: this.totalOffset });
  }
}
