import * as _ from 'lodash';

/** @ignore */
import PaddedInstruction from './PaddedInstruction';

export default class TableSwitchInstruction extends PaddedInstruction {

  constructor(methodInfo, idx, opcode) {
    super(methodInfo, idx, opcode);
    this.defaultOffset = 0;
    this.lowByte = 0;
    this.highByte = 0;
    this.jumpOffsets = [];
  }

  get size() {
    return (super.size + 12) + (4 * this.jumpOffsets.length);
  }

  read(buffer) {
    super.read(buffer);

    this.defaultOffset = buffer.int();
    this.lowByte = buffer.int();
    this.highByte = buffer.int();

    this.jumpOffsets = [];
    let offsetCount = (this.highByte - this.lowByte + 1);
    for (let i = 0; i < offsetCount; i++) {
      this.jumpOffsets[i] = buffer.int();
    }
  }

  write(buffer) {
    super.write(buffer);
    buffer.writeInt(this.defaultOffset);
    buffer.writeInt(this.lowByte);
    buffer.writeInt(this.highByte);
    _.each(this.jumpOffsets, jumpOffset => {
      buffer.writeInt(jumpOffset);
    });
  }

  toObject() {
    return super.toObject({
      default_offset: this.defaultOffset,
      low_byte: this.lowByte,
      high_byte: this.highByte,
      jump_offsets: this.jumpOffsets,
      size: this.size
    });
  }

  toString() {
    return super.toString({
      defaultOffset: this.defaultOffset,
      jumpOffsets: this.jumpOffsets,
      lowByte: this.lowByte,
      highByte: this.highByte,
    });
  }
}
