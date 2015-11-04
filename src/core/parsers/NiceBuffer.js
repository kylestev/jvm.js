import * as _ from 'lodash';

export const SIZE_BYTE = 1;
export const SIZE_SHORT = 2;
export const SIZE_INT = 4;

export class NiceBuffer {
  constructor(buffer) {
    this.pos = 0;
    this.buffer = buffer;
    this.lengthMap = {};
    this.lengthMap[SIZE_INT] = 'int';
    this.lengthMap[SIZE_SHORT] = 'short';
    this.lengthMap[SIZE_BYTE] = 'byte';
  }

  move(len) {
    let current = this.pos;
    this.pos += len;
    return current;
  }

  read(len) {
    if ( ! _.has(this.lengthMap, len)) {
      return this.slice(len);
    }

    let method = this.lengthMap[len];
    return this[method]();
  }

  readStruct(struct) {
    let instance = {};

    _.each(struct, (obj) => {
      let [name, value] = obj;

      if (name.startsWith('@')) {
        // need to for-loop it up
        let items = [];
        let [key, lengthAttr] = name.substring(1).split('|');
        let len = instance[lengthAttr];

        for (let idx = 0; idx < len; idx++) {
          items.push(this.readStruct(value.struct));
        }

        instance[key] = items;
      } else if (name.startsWith('$')) {
        // read variable amount of bytes where the length has already
        // been stored in `instance`.
        let key = name.substring(1);
        let len = instance[value];
        instance[key] = this.slice(len);
      } else {
        let length = value;
        instance[name] = this.read(length);
      }
    });

    return instance;
  }

  short() {
    return this.buffer.readUInt16BE(this.move(SIZE_SHORT));
  }

  byte() {
    return this.buffer.readUInt8(this.move(SIZE_BYTE));
  }

  int() {
    return this.buffer.readUInt32BE(this.move(SIZE_INT));
  }

  write(bytes) {
    bytes.forEach((byte) => this.writeByte(byte));
  }

  writeByte(val) {
    this.buffer.writeUInt8(val, this.move(SIZE_BYTE));
  }

  writeShort(val) {
    this.buffer.writeUInt16LE(val, this.move(SIZE_SHORT));
  }

  writeInt(val) {
    this.buffer.writeUInt32LE(val, this.move(SIZE_INT));
  }

  slice(len) {
    let end = this.pos + len;
    return this.buffer.slice(this.move(len), end);
  }
}
