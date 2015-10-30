import * as _ from 'lodash';

export const OPCODE_TO_NAME = [
  'NOP', 'ACONST_NULL', 'ICONST_M1', 'ICONST_0',
  'ICONST_1', 'ICONST_2', 'ICONST_3', 'ICONST_4',
  'ICONST_5', 'LCONST_0', 'LCONST_1', 'FCONST_0',
  'FCONST_1', 'FCONST_2', 'DCONST_0', 'DCONST_1',
  'BIPUSH', 'SIPUSH', 'LDC', '', '', 'ILOAD',
  'LLOAD', 'FLOAD', 'DLOAD', 'ALOAD', '', '', '',
  '', '', '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', 'IALOAD', 'LALOAD', 'FALOAD',
  'DALOAD', 'AALOAD', 'BALOAD', 'CALOAD', 'SALOAD',
  'ISTORE', 'LSTORE', 'FSTORE', 'DSTORE', 'ASTORE',
  '', '', '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '', 'IASTORE',
  'LASTORE', 'FASTORE', 'DASTORE', 'AASTORE', 'BASTORE',
  'CASTORE', 'SASTORE', 'POP', 'POP2', 'DUP', 'DUP_X1',
  'DUP_X2', 'DUP2', 'DUP2_X1', 'DUP2_X2', 'SWAP',
  'IADD', 'LADD', 'FADD', 'DADD', 'ISUB', 'LSUB',
  'FSUB', 'DSUB', 'IMUL', 'LMUL', 'FMUL', 'DMUL',
  'IDIV', 'LDIV', 'FDIV', 'DDIV', 'IREM', 'LREM',
  'FREM', 'DREM', 'INEG', 'LNEG', 'FNEG', 'DNEG',
  'ISHL', 'LSHL', 'ISHR', 'LSHR', 'IUSHR', 'LUSHR',
  'IAND', 'LAND', 'IOR', 'LOR', 'IXOR', 'LXOR',
  'IINC', 'I2L', 'I2F', 'I2D', 'L2I', 'L2F', 'L2D',
  'F2I', 'F2L', 'F2D', 'D2I', 'D2L', 'D2F', 'I2B',
  'I2C', 'I2S', 'LCMP', 'FCMPL', 'FCMPG', 'DCMPL',
  'DCMPG', 'IFEQ', 'IFNE', 'IFLT', 'IFGE', 'IFGT',
  'IFLE', 'IF_ICMPEQ', 'IF_ICMPNE', 'IF_ICMPLT',
  'IF_ICMPGE', 'IF_ICMPGT', 'IF_ICMPLE', 'IF_ACMPEQ',
  'IF_ACMPNE', 'GOTO', 'JSR', 'RET', 'TABLESWITCH',
  'LOOKUPSWITCH', 'IRETURN', 'LRETURN', 'FRETURN',
  'DRETURN', 'ARETURN', 'RETURN', 'GETSTATIC',
  'PUTSTATIC', 'GETFIELD', 'PUTFIELD', 'INVOKEVIRTUAL',
  'INVOKESPECIAL', 'INVOKESTATIC', 'INVOKEINTERFACE',
  'INVOKEDYNAMIC', 'NEW', 'NEWARRAY', 'ANEWARRAY',
  'ARRAYLENGTH', 'ATHROW', 'CHECKCAST', 'INSTANCEOF',
  'MONITORENTER', 'MONITOREXIT', '', 'MULTIANEWARRAY',
  'IFNULL', 'IFNONNULL'
];

export const NAME_TO_OPCODE = _.invert(OPCODE_TO_NAME);

export const TYPE_VARIABLE_NODE = 'VariableNode';

export const INSTRUCTION_INDICES = [
  {
    low_opcode_index: 0x02,
    high_opcode_index: 0x56,
    type: TYPE_VARIABLE_NODE
  }
];

export function getInstructionType(opcode) {
  let type = 'AbstractInstruction';

  let match = _.find(INSTRUCTION_INDICES, (indices) => {
    return (opcode >= indices.low_opcode_index &&
            opcode <= indices.high_opcode_index);
  });

  if (match) {
    return match.type;
  }

  return type;
}

export function createInstruction(idx, opcode) {
  let opname = OPCODE_TO_NAME[opcode];
  let type = getInstructionType(opcode);

  let instance = {
    idx, opcode, opname, type
  };

  if (type === TYPE_VARIABLE_NODE) {
    if (opname.includes('m1')) {
      instance.var = -1;
    } else if (opname.includes('_')) {
      instance.var = 0;
    } else {
      instance.var = parseInt(_.last(opname.split('_')));
    }
  }

  return instance;
}

export function injectInstructions(method) {
  let code = _.find(method.attribute_info, { name: 'Code' });

  code.instructions = _.map(code.info.data, (opcode, idx) => {
    return createInstruction(idx, opcode);
  });

  return method;
}
