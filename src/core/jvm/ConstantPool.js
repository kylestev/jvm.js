import * as _ from 'lodash';

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
