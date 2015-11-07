import * as _ from 'lodash';
import { getInstructionType } from './Opcodes';

/**
 * Factory class for creating an instruction by its opcode and instruction
 * index inside a Code attribute.
 */
export class InstructionFactory {
  /**
   * @private
   * @param  {MethodInfo} methodInfo The method the given instruction is in
   * @param  {Number} idx            instruction index
   * @param  {Number} opcode         opcode identifier
   * @param  {Boolean} wide          wide instruction flag
   */
  constructor(methodInfo, idx, opcode, wide) {
    /**
     * @private
     * @type {MethodInfo}
     */
    this.methodInfo = methodInfo;
    /**
     * @private
     * @type {Number}
     */
    this.idx = idx;
    /**
     * @private
     * @type {Number}
     */
    this.opcode = opcode;
    /**
     * @private
     * @type {Boolean}
     */
    this.wide = wide;
    /**
     * @private
     * @type {AbstractInstruction}
     */
    this.instruction = getInstructionType(opcode);
  }

  /**
   * Flag for if the instruction is wide.
   * @private
   * @return {Boolean}
   */
  get isWide() {
    return this.instruction.subject_to_wide;
  }

  /**
   * Flag for if the instruction should be wrapped by an {@link InstructionWrapper}
   * object.
   * @private
   * @return {Boolean}
   */
  get shouldWrap() {
    return this.wrapType !== null;
  }

  /**
   * Gets the type of wrapper that should be applied when creating the instruction.
   * @private
   * @return {InstructionWrapper|null}
   */
  get wrapType() {
    return this.instruction.wrap || null;
  }

  /**
   * Creates an instance of the instruction and wraps it with an
   * {@link InstructionWrapper} if necessary.
   * @private
   * @return {AbstractInstruction}
   */
  build() {
    let instance = this.createInstance();

    if (this.shouldWrap) {
      instance = new this.wrapType(instance);
    }

    return instance;
  }

  /**
   * @private
   * @return {AbstractInstruction}
   */
  createInstance() {
    let InsnType = this.instruction.type;

    return this.isWide
      ? new InsnType(this.methodInfo, this.idx, this.opcode, this.wide)
      : new InsnType(this.methodInfo, this.idx, this.opcode);
  }

  /**
   * Creates instructions based on pre-defined configurations allowing the
   * complex process of building instructions to be simplified into a 3
   * parameter method.
   * @public
   * @param  {MethodInfo} methodInfo The method the given instruction is in
   * @param  {Number} idx            instruction index
   * @param  {Number} opcode opcode  identifier
   * @param  {Boolean} wide          wide instruction flag
   * @return {AbstractInstruction}
   */
  static of(methodInfo, idx, opcode, wide) {
    return (new InstructionFactory(methodInfo, idx, opcode, wide)).build();
  }
}