import * as _ from 'lodash';
import { NiceBuffer } from './NiceBuffer';
import { JVMCodeAttribute } from '../jvm/Attributes';
import { InstructionFactory, NAME_TO_OPCODE } from '../jvm/instructions';

function extractCodeFromMethod(method) {
  let code = method.findAttributeByName('Code');
  let attr = new JVMCodeAttribute(code.raw);

  return attr.decode().code;
}

/**
 * Parses the instructions from a given {@link MethodInfo}'s
 * {@link JVMCodeAttribute}.
 * @param  {MethodInfo} method
 * @return {Array<AbstractInstructions>}
 */
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