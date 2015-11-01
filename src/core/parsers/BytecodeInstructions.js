import * as _ from 'lodash';
import { NiceBuffer } from './NiceBuffer';
import { JVMCodeAttribute } from '../jvm/Attributes';
import { InstructionFactory, NAME_TO_OPCODE } from '../jvm/instructions';

function extractCodeFromMethod(method) {
  let code = _.find(method.attribute_info, { attribute_name: 'Code' });
  let attr = new JVMCodeAttribute(code);

  return attr.decode().code;
}

export function injectInstructions(method) {
  method.instructions = parseInstructions(method);
  return method;
}

export function parseInstructions(method) {
  let code = extractCodeFromMethod(method);
  let buffer = new NiceBuffer(new Buffer(code));

  let wide = false;
  let current = null;
  let instructions = [];
  while (buffer.pos < code.length) {
    let previous = current;
    let opcode = buffer.byte();
    let idx = instructions.length;

    current = InstructionFactory.of(idx, opcode, wide);
    current.read(buffer);

    if (previous != null) {
      current.previous = previous;
      previous.next = current;
    }

    wide = (opcode === NAME_TO_OPCODE.WIDE);
    instructions.push(current);
  }

  return instructions;
}