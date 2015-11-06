const WritingErrors = require('../../../errors').Writing;

import * as _ from 'lodash';
import { OPCODE_VERSIONS } from '../instructions/Opcodes';

/**
 * Utility class for verifying that all methods for a given class do not use
 * instructions that are not available in their Java SE runtime.
 */
class InstructionMajorVersionVerifier {
  /**
   * @param  {ClassInfo} classInfo
   */
  constructor(classInfo) {
    /**
     * @private
     * @type {ClassInfo}
     */
    this.classInfo = classInfo;
    /**
     * @private
     * @type {Array<Number>}
     */
    this.unusableOpcodes = this.findUnusableOpcodes();
  }

  /**
   * Finds all opcodes with a version higher than the {@link ClassInfo} object
   * being verified.
   *
   * Checks against {@link Opcodes.OPCODE_VERSIONS}
   * @return {Array<Number>} flat array of opcodes that are not available in
   * the Java SE runtime of the JVM Class File.
   */
  findUnusableOpcodes() {
    return _.flatten(_.filter(OPCODE_VERSIONS, (opcodes, version) => (version > this.classInfo.major)));
  }

  /**
   * Finds the intersection between the unusable opcodes and the opcodes
   * present in {@link MethodInfo.instructions}.
   * @param  {MethodInfo} method
   * @return {Array<Number>}
   */
  findInvalidMethodOpcodes(method) {
    let opcodes = _.pluck(method.instructions, 'opcode');
    return _.intersection(opcodes, this.unusableOpcodes);
  }

  /**
   * Determines if the {@link ClassInfo} object only has opcodes that are
   * usable for the given Java SE runtime.
   * @return {Boolean}
   */
  verify() {
    return _.every(this.classInfo.methods, (method) => {
      let invalid = this.findInvalidMethodOpcodes(method);

      if (invalid.length > 0) {
        throw WritingErrors.UnsupportedOpcode(unusable[0], this.classInfo, method);
      }

      return true;
    });
  }
}

export {
  InstructionMajorVersionVerifier
};

