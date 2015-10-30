const PaddedInstruction = require('./PaddedInstruction');
const OffsetPair = require('../OffsetPair')

export default class LookupSwitchInstruction extends PaddedInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
    this.offsetPairs = [];
    this.defaultOffset = 0;
  }

  get size() {
    return (super.size + 8) + (8 * this.offsetPairs.length);
  }

  read(buffer) {
    super.read(buffer);
    while (offsetPairs.length > 0) {
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
}