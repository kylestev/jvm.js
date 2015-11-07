/** @ignore */
const ImmediateShortInstruction = require('./ImmediateShortInstruction');

export default class MemberInstruction extends ImmediateShortInstruction {

  constructor(methodInfo, idx, opcode) {
    super(methodInfo, idx, opcode);
  }

  get desc() {
    return this.pool.at(this.typeInfo.name_index).info.bytes;
  }

  get name() {
    return this.pool.at(this.typeInfo.descriptor_index).info.bytes;
  }

  get owner() {
    let info = this.valInfo;
    return this.pool.at(this.pool.at(info.class_index).info.name_index).info.bytes;
  }

  get typeInfo() {
    return this.pool.at(this.valInfo.name_and_type_index).info;
  }

  get valInfo() {
    return this.pool.at(this.val).info;
  }
}