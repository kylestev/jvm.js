import * as _ from 'lodash';
import {NiceBuffer} from './NiceBuffer';

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

export const AbstractInstruction = require('../jvm/insn/AbstractInstruction');
export const VariableInstruction = require('../jvm/insn/VariableInstruction');
export const ArithmeticInstruction = require('../jvm/insn/ArithmeticInstruction');
export const IncrementInstruction = require('../jvm/insn/IncrementInstruction');
export const CastInstruction = require('../jvm/insn/CastInstruction');
export const ImmediateByteInstruction = require('../jvm/insn/ImmediateByteInstruction');
export const ImmediateShortInstruction = require('../jvm/insn/ImmediateByteInstruction');
export const MethodInstruction = require('../jvm/insn/MethodInstruction');
export const ConstantInstruction = require('../jvm/insn/ConstantInstruction');
export const FieldInstruction = require('../jvm/insn/FieldInstruction');
export const PushInstruction = require('../jvm/insn/PushInstruction');
export const TypeInstruction = require('../jvm/insn/TypeInstruction');
export const BranchInstruction = require('../jvm/insn/BranchInstruction');
export const WideBranchInstruction = require('../jvm/insn/WideBranchInstruction');
export const TableSwitchInstruction = require('../jvm/insn/TableSwitchInstruction');
export const LookupSwitchInstruction = require('../jvm/insn/LookupSwitchInstruction');
export const InvokeInterfaceInstruction = require('../jvm/insn/InvokeInterfaceInstruction');
export const InvokeDynamicInstruction = require('../jvm/insn/InvokeDynamicInstruction');
export const MultianewarrayInstruction = require('../jvm/insn/MultianewarrayInstruction');

export const INSTRUCTION_INDICES = [
  { // ICONST_M1 - DCONST_1
    low_opcode_index: 0x02,
    high_opcode_index: 0x0f,
    type: AbstractInstruction,
    wrap: VariableInstruction,
    subject_to_wide: false
  },
  { // ILOAD_0 - SALOAD
    low_opcode_index: 0x1a,
    high_opcode_index: 0x35,
    type: AbstractInstruction,
    wrap: VariableInstruction,
    subject_to_wide: false
  },
  { // ISTORE_0 - SASTORE
    low_opcode_index: 0x3b,
    high_opcode_index: 0x56,
    type: AbstractInstruction,
    wrap: VariableInstruction,
    subject_to_wide: false
  },
  { // IADD - LXOR
    low_opcode_index: 0x60,
    high_opcode_index: 0x83,
    type: AbstractInstruction,
    wrap: ArithmeticInstruction,
    subject_to_wide: false
  },
  { // IINC (subject to 'wide')
    low_opcode_index: 0x84,
    high_opcode_index: 0x84,
    type: IncrementInstruction,
    subject_to_wide: true
  },
  { // I2L - I2S
    low_opcode_index: 0x85,
    high_opcode_index: 0x93,
    type: AbstractInstruction,
    wrap: CastInstruction,
    subject_to_wide: false
  },
  { // ILOAD - ALOAD (subject to 'wide')
    low_opcode_index: 0x15,
    high_opcode_index: 0x19,
    type: ImmediateByteInstruction,
    wrap: VariableInstruction,
    subject_to_wide: true
  },
  { // ISTORE - ASTORE (subject to 'wide')
    low_opcode_index: 0x36,
    high_opcode_index: 0x3a,
    type: ImmediateByteInstruction,
    wrap: VariableInstruction,
    subject_to_wide: true
  },
  { // RET (subject to 'wide')
    low_opcode_index: 0xa9,
    high_opcode_index: 0xa9,
    type: ImmediateByteInstruction,
    subject_to_wide: true
  },
  { // NEWARRAY (subject to 'wide')
    low_opcode_index: 0xbc,
    high_opcode_index: 0xbc,
    type: ImmediateByteInstruction,
    subject_to_wide: true
  },
  { // INVOKEVIRTUAL - INVOKESTATIC
    low_opcode_index: 0xb6,
    high_opcode_index: 0xb8,
    type: MethodInstruction,
    subject_to_wide: false
  },
  { // LDC_W - LDC2_W
    low_opcode_index: 0x13,
    high_opcode_index: 0x14,
    type: ImmediateShortInstruction,
    wrap: ConstantInstruction,
    subject_to_wide: false
  },
  { // GETSTATIC - PUTFIELD
    low_opcode_index: 0xb2,
    high_opcode_index: 0xb5,
    type: FieldInstruction,
    subject_to_wide: false
  },
  { // LDC (subject to 'wide')
    low_opcode_index: 0x12,
    high_opcode_index: 0x12,
    type: ImmediateByteInstruction,
    wrap: ConstantInstruction,
    subject_to_wide: true
  },
  { // BIPUSH (subject to 'wide')
    low_opcode_index: 0x10,
    high_opcode_index: 0x10,
    type: ImmediateByteInstruction,
    wrap: PushInstruction,
    subject_to_wide: true
  },
  { // SIPUSH (subject to 'wide')
    low_opcode_index: 0x11,
    high_opcode_index: 0x11,
    type: ImmediateShortInstruction,
    wrap: PushInstruction,
    subject_to_wide: true
  },
  { // NEW
    low_opcode_index: 0xbb,
    high_opcode_index: 0xbb,
    type: TypeInstruction,
    subject_to_wide: false
  },
  { // ANEWARRAY
    low_opcode_index: 0xbd,
    high_opcode_index: 0xbd,
    type: TypeInstruction,
    subject_to_wide: false
  },
  { // CHECKCAST - INSTANCEOF
    low_opcode_index: 0xc0,
    high_opcode_index: 0xc1,
    type: TypeInstruction,
    subject_to_wide: false
  },
  { // IFEQ - JSR
    low_opcode_index: 0x99,
    high_opcode_index: 0xa8,
    type: BranchInstruction,
    subject_to_wide: false
  },
  { // IFNULL - IFNONNULL
    low_opcode_index: 0xc6,
    high_opcode_index: 0xc7,
    type: BranchInstruction,
    subject_to_wide: false
  },
  { // GOTO_W - JSR_W
    low_opcode_index: 0xc8,
    high_opcode_index: 0xc9,
    type: WideBranchInstruction,
    subject_to_wide: false
  },
  { // TABLESWITCH
    low_opcode_index: 0xaa,
    high_opcode_index: 0xaa,
    type: TableSwitchInstruction,
    subject_to_wide: false
  },
  { // LOOKUPSWITCH
    low_opcode_index: 0xab,
    high_opcode_index: 0xab,
    type: LookupSwitchInstruction,
    subject_to_wide: false
  },
  { // INVOKEINTERFACE
    low_opcode_index: 0xb9,
    high_opcode_index: 0xb9,
    type: InvokeInterfaceInstruction,
    subject_to_wide: false
  },
  { // INVOKEDYNAMIC
    low_opcode_index: 0xba,
    high_opcode_index: 0xba,
    type: InvokeDynamicInstruction,
    subject_to_wide: false
  },
  { // MULTIANEWARRAY
    low_opcode_index: 0xc5,
    high_opcode_index: 0xc5,
    type: MultianewarrayInstruction,
    subject_to_wide: false
  }
];

export function getInstructionMatch(opcode) {
  let match = _.find(INSTRUCTION_INDICES, (indices) => {
    return (opcode >= indices.low_opcode_index &&
            opcode <= indices.high_opcode_index);
  });

  if (match) {
    return match;
  }

  return null;
}

export function createInstruction(idx, opcode, wide) {
  let match = getInstructionMatch(opcode);
  let instance = null;
  if (match !== null) {
    if (match.subject_to_wide) {
      instance = new match.type(idx, opcode, wide);
    } else {
      instance = new match.type(idx, opcode);
    }
    if (match.wrap && match.wrap !== null) {
      instance = new match.wrap(instance);
    }
  } else {
    instance = new AbstractInstruction(idx, opcode);
  }
  return instance;
}

export function injectInstructions(method) {
  let code = _.find(method.attribute_info, { name: 'Code' });
  let wide = false;
  let buffer = new NiceBuffer(new Buffer(code.info.data));
  code.instructions = [];
  let current = null;
  while (buffer.pos < code.info.data.length) {
    // let previous = current;
    let idx = code.instructions.length;
    let opcode = buffer.byte();
    console.log(OPCODE_TO_NAME[opcode]);
    current = createInstruction(idx, opcode, wide);
    current.read(buffer);
    // if (previous != null) {
    //   // current.previous = previous;
    //   // previous.next = current;
    // }
    wide = (opcode === NAME_TO_OPCODE['WIDE']);
    code.instructions.push(current);
  }
  // code.instructions = _.map(code.info.data, (opcode, idx) => {
  //   let instruction = createInstruction(idx, opcode, wide);
  //   wide = (opcode === NAME_TO_OPCODE['WIDE']);
  //   return instruction;
  // });

  return method;
}