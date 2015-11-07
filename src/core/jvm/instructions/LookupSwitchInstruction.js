import * as _ from 'lodash';

/** @ignore */
const PaddedInstruction = require('./PaddedInstruction');
/** @ignore */
const OffsetPair = require('../OffsetPair')

export default class LookupSwitchInstruction extends PaddedInstruction {

  constructor(methodInfo, idx, opcode) {
    super(methodInfo, idx, opcode);
    this.offsetPairs = [];
    this.defaultOffset = 0;
  }

  get size() {
    return (super.size + 8) + (8 * this.offsetPairs.length);
  }

  read(buffer) {
    super.read(buffer);
    while (this.offsetPairs.length > 0) {
        offsetPairs.pop();
    }
    this.defaultOffset = buffer.int();
    let pairCount = buffer.int();
    for (let i = 0; i < pairCount; i++) {
        let match = buffer.int();
        let offset = buffer.int();
        this.offsetPairs.push(new OffsetPair(match, offset));
    }
  }

  write(buffer) {
    super.write(buffer);
    buffer.writeInt(this.defaultOffset);
    let pairCount = this.offsetPairs.length;
    buffer.writeInt(pairCount);
    _.each(this.offsetPairs, offsetPair => {
      buffer.writeInt(offsetPair.match);
      buffer.writeInt(offsetPair.offset);
    });
  }

  toObject() {
    return super.toObject({
      offset_pairs: this.offsetPairs,
      default_offset: this.defaultOffset,
      size: this.size
    });
  }
}