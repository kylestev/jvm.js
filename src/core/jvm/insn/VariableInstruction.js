import * as _ from 'lodash';

const AbstractInstruction = require('./AbstractInstruction');

export default class VariableInstruction extends AbstractInstruction {

  constructor(idx, opcode) {
    super(idx, opcode);
  }

  get var() {
    if (this.opname.includes('M1')) {
        return -1;
    } else if (this.opname.includes('_')) {
        return parseInt(_.last(this.opname.split('_')));
    }
    return 0;
  }
}