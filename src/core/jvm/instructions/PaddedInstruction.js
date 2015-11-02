const AbstractInstruction = require('./AbstractInstruction');

export default class PaddedInstruction extends AbstractInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
  }

  padding(offset) {
    return super.size + this.paddingBytes(offset + 1);
  }

  paddingBytes(bytesCount) {
    let bytesToPad = (4 - bytesCount % 4);
    return (bytesToPad == 4 ? 0 : bytesToPad);
  }

  read(buffer) {
    super.read(buffer);
    let bytesToRead = this.paddingBytes(buffer.pos);
    for (let i = 0; i < bytesToRead; i++) {
      buffer.byte();
    }
  }

  write(buffer) {
    super.write(buffer);
    let bytesToWrite = this.paddingBytes(buffer.pos);
    for (let i = 0; i < bytesToWrite; i++) {
      buffer.writeByte(0);
    }
  }
}