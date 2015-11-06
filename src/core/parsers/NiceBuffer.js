import * as _ from 'lodash';

/**
 * Number of bytes taken up by an 8bit Integer.
 * @type {Number}
 */
export const SIZE_BYTE = 1;

/**
 * Number of bytes taken up by a 16bit Integer.
 * @type {Number}
 */
export const SIZE_SHORT = 2;

/**
 * Number of bytes taken up by a 32bit Integer.
 * @type {Number}
 */
export const SIZE_INT = 4;

/**
 * Wraps Node's Buffer class by providing smart defaults specific
 * to the JVM's binary format.
 */
export class NiceBuffer {
  /**
   * Instantiates a new instance
   *
   * @param  {Buffer} buffer normal Node Buffer object
   */
  constructor(buffer) {
    /**
     * Current position in buffer.
     * @type {Number}
     */
    this.pos = 0;
    /**
     * @type {Buffer}
     */
    this.buffer = buffer;
    /**
     * Maps size constants to their respective method names.
     * @type {Object}
     */
    this.lengthMap = {};
    this.lengthMap[SIZE_INT] = 'int';
    this.lengthMap[SIZE_SHORT] = 'short';
    this.lengthMap[SIZE_BYTE] = 'byte';
  }

  /**
   * Moves the offset used when reading/writing bytes by a relative amount.
   * @param  {Number} len Relative offset to move
   * @return {Number}     The position before the offset is added to it.
   *                      Behavior is similar to `position++` rather than `++position`.
   */
  move(len) {
    let current = this.pos;
    this.pos += len;
    return current;
  }

  /**
   * Reads an arbitrary amount of bytes from the buffer.
   * If the length matches one of the `SIZE_` prefixed constants
   * also declared in this class, it will instead decode the bytes into
   * an unsigned integer of that size.
   * @param  {Number} len Number of bytes to read.
   * @return {Number|Buffer}
   */
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

  /**
   * Reads an unsigned 16bit Integer from the buffer in Big Endian format.
   * @return {Number} ushort
   */
  short() {
    return this.buffer.readUInt16BE(this.move(SIZE_SHORT));
  }

  /**
   * Reads an unsigned 8bit Integer from the buffer.
   * @return {Number} ubyte
   */
  byte() {
    return this.buffer.readUInt8(this.move(SIZE_BYTE));
  }

  /**
   * Reads an unsigned 32bit Integer from the buffer in Big Endian format.
   * @return {Number} uint
   */
  int() {
    return this.buffer.readUInt32BE(this.move(SIZE_INT));
  }

  /**
   * Writes an array of bytes to the current position in the buffer.
   * @param  {Array<Number>} bytes an array of bytes
   */
  write(bytes) {
    bytes.forEach((byte) => this.writeByte(byte));
  }

  /**
   * Writes a single ubyte to the current position in the buffer.
   * @param  {Number} val
   */
  writeByte(val) {
    this.buffer.writeUInt8(val, this.move(SIZE_BYTE));
  }

  /**
   * Writes a ushort to the current position in the buffer in Big Endian format.
   * @param  {Number} val
   */
  writeShort(val) {
    this.buffer.writeUInt16LE(val, this.move(SIZE_SHORT));
  }

  /**
   * Writes a uint to the current position in the buffer in Big Endian format.
   * @param  {Number} val
   */
  writeInt(val) {
    this.buffer.writeUInt32LE(val, this.move(SIZE_INT));
  }

  /**
   * Slice a Buffer of bytes from the buffer of a specified length
   * at the current position.
   * @param  {Number} len Number of bytes to slice
   * @return {Buffer}
   */
  slice(len) {
    let end = this.pos + len;
    return this.buffer.slice(this.move(len), end);
  }
}
