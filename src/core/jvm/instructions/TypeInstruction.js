/** @ignore */
const ImmediateShortInstruction = require('./ImmediateShortInstruction');

export default class TypeInstruction extends ImmediateShortInstruction {

  constructor(methodInfo, idx, opcode) {
    super(methodInfo, idx, opcode);
  }

  get valInfo() {
    return this.pool.at(this.val).info;
  }

  get type() {
    let nameIndex = this.valInfo.name_index;
    return this.pool.at(nameIndex).info.bytes;
  }
}
