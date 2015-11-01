const PaddedInstruction = require('./PaddedInstruction');

export default class TableSwitchInstruction extends PaddedInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
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
    let offsetCount = (highByte - lowByte + 1);
    for (let i = 0; i < offsetCount; i++)
        this.jumpOffsets[i] = buffer.int();
  }
}