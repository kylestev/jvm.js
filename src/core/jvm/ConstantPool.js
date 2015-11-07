import * as _ from 'lodash';

export const TAG_CLASS = 7;
export const TAG_FIELD_REF = 9;
export const TAG_METHOD_REF = 10;
export const TAG_INTERFACE_METHOD_REF = 11;
export const TAG_STRING = 8;
export const TAG_INTEGER = 3;
export const TAG_FLOAT = 4;
export const TAG_LONG = 5;
export const TAG_DOUBLE = 6;
export const TAG_NAME_AND_TYPE = 12;
export const TAG_UTF8 = 1;
export const TAG_METHOD_HANDLE = 15;
export const TAG_METHOD_TYPE = 16;
export const TAG_INVOKE_DYNAMIC = 18;

export const NUMERIC_TAGS = [
  TAG_INTEGER, TAG_DOUBLE, TAG_FLOAT, TAG_LONG
];

const L_POSITIVE_INFINITY = 0x7ff0000000000000;
const L_NEGATIVE_INFINITY = 0xfff0000000000000;
const F_POSITIVE_INFINITY = 0x7f800000;
const F_NEGATIVE_INFINITY = 0xff800000;

/**
 * Wrapper around the JVM Class File's Constant Pool table.
 *
 * It provides simplified access to the elements contained in the Constant
 * Pool while.
 *
 * @see https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.4
 */
class ConstantPool {
  /**
   * @param  {Array<Object>} pool
   */
  constructor(pool) {
    /** @type {{Array<Object>} pool} */
    this.pool = pool;
  }

  /**
   * The 1-based index into the Constant Pool for which you wish to retrieve
   * the entry from.
   * 
   * Indices MUST be: `1 ≤ index ≤ ConstantPool#size`
   * 
   * @see https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.4.5
   * @param  {Number} idx
   * @return {Object|false} - returns false if the index passed is the second
   * half (empty) of a Double or Long entry in the Constant Pool. See the
   * Oracle link below for more information.
   */
  at(idx) {
    return this.pool[idx - 1];
  }

  /**
   * Decodes the entry's value at the Constant Pool index specified.
   * @param  {Number} idx - index of the entry to decode.
   * @return {Number|string|undefined} returns undefined if the entry was not able to be decoded.
   */
  valueAt(idx) {
    let entry = this.at(idx);

    switch (entry.tag) {
      case TAG_STRING:
        return this.at(entry.info.string_index).info.bytes;
      case TAG_INTEGER:
        return entry.info.value;
      case TAG_LONG: {
        let low = entry.info.low_bytes;
        let high = entry.info.high_bytes;
        return (high << 32) + low;
      }
      case TAG_FLOAT: {
        let bits = entry.value;

        if (bits === F_POSITIVE_INFINITY) {
          return Number.POSITIVE_INFINITY;
        } else if (bits === F_NEGATIVE_INFINITY) {
          return Number.NEGATIVE_INFINITY;
        }

        if ((bits > F_POSITIVE_INFINITY && bits <= 0x7fffffff)
            || (bits > F_NEGATIVE_INFINITY && bits <= 0xffffffff)) {
          return NaN;
        }

        let sign = ((bits >> 31) === 0) ? 1 : -1;
        let exponent = ((bits >> 23) & 0xff);
        let mantisa = (exponent === 0) ?
          (bits & 0x7fffff) << 1 :
          (bits & 0x7fffff) | 0x800000;

        return sign * mantisa * Math.pow(2, exponent - 150);
      }
      case TAG_DOUBLE: {
        let low = entry.info.low_bytes;
        let high = entry.info.high_bytes;
        let bits = (high << 32) + low;

        if (bits === L_POSITIVE_INFINITY) {
          return Number.POSITIVE_INFINITY;
        } else if (bits === L_NEGATIVE_INFINITY) {
          return Number.NEGATIVE_INFINITY;
        }

        if ((bits > L_POSITIVE_INFINITY && bits <= 0x7fffffffffffffff)
            || (bits > L_NEGATIVE_INFINITY && bits <= 0xffffffffffffffff)) {
          return NaN;
        }

        let sign = ((bits >> 63) === 0) ? 1 : -1;
        let exponent = ((bits >> 52) & 0x7ff);
        let mantisa = (exponent === 0) ?
          (bits & 0xfffffffffffff) << 1 :
          (bits & 0xfffffffffffff) | 0x10000000000000;

        return sign * mantisa * Math.pow(2, exponent - 1075);
      }
      case TAG_CLASS:
        return this.at(entry.info.name_index).info.bytes;
    }
  }

  /**
   * Attempts to find the first entry in the pool matching the specified
   * criteria going from the first index to the last.
   * @see https://lodash.com/docs#find
   * @see https://lodash.com/docs#matches
   * @param  {Object} criteria Search criteria
   * @return {Object|undefined} returns {@link undefined} if no match could be found
   */
  find(criteria) {
    return _.find(this.pool, criteria);
  }

  /**
   * The total size of the Constant Pool.
   * @return {Number}
   */
  get size() {
    return _.size(this.pool);
  }

  /**
   * Serialized version of this class without circular references.
   * @return {Object}
   */
  toObject() {
    return {
      constant_pool_count: this.size,
      entries: this.pool
    };
  }
}

export {
  ConstantPool
};
