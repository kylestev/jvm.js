import * as _ from 'lodash';
import { NUMERIC_TAGS, TAG_STRING } from '../ConstantPool';

/** @ignore */
const InstructionWrapper = require('./InstructionWrapper');

function isNumeric(tag) {
  return _.includes(NUMERIC_TAGS, tag);
}

export default class ConstantInstruction extends InstructionWrapper {

  constructor(instruction) {
    super(instruction);
  }

  isNumeric() {
    return _.includes(NUMERIC_TAGS, this.tag);
  }

  isString() {
    return this.tag === TAG_STRING;
  }

  get poolInfo() {
    return this.pool.at(this.instruction.val);
  }

  get tag() {
    return this.poolInfo.tag;
  }

  get val() {
    return this.pool.valueAt(this.instruction.val);
  }

  toString() {
    return super.toString({ val: this.val });
  }
}
