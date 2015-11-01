import * as _ from 'lodash';

const AbstractInstruction = require('./AbstractInstruction');
const ArithmeticInstruction = require('./ArithmeticInstruction');
const BranchInstruction = require('./BranchInstruction');
const CastInstruction = require('./CastInstruction');
const ConstantInstruction = require('./ConstantInstruction');
const FieldInstruction = require('./FieldInstruction');
const ImmediateByteInstruction = require('./ImmediateByteInstruction');
const ImmediateShortInstruction = require('./ImmediateShortInstruction');
const IncrementInstruction = require('./IncrementInstruction');
const InvokeDynamicInstruction = require('./InvokeDynamicInstruction');
const InvokeInterfaceInstruction = require('./InvokeInterfaceInstruction');
const LookupSwitchInstruction = require('./LookupSwitchInstruction');
const MethodInstruction = require('./MethodInstruction');
const MultianewarrayInstruction = require('./MultianewarrayInstruction');
const PushInstruction = require('./PushInstruction');
const TableSwitchInstruction = require('./TableSwitchInstruction');
const TypeInstruction = require('./TypeInstruction');
const VariableInstruction = require('./VariableInstruction');
const WideBranchInstruction = require('./WideBranchInstruction');

export const OPCODE_TO_NAME = [
  'NOP', 'ACONST_NULL', 'ICONST_M1', 'ICONST_0', 
  'ICONST_1', 'ICONST_2', 'ICONST_3', 'ICONST_4', 
  'ICONST_5', 'LCONST_0', 'LCONST_1', 'FCONST_0', 
  'FCONST_1', 'FCONST_2', 'DCONST_0', 'DCONST_1', 
  'BIPUSH', 'SIPUSH', 'LDC', 'LDC_W', 'LDC2_W', 
  'ILOAD', 'LLOAD', 'FLOAD', 'DLOAD', 'ALOAD', 
  'ILOAD_0', 'ILOAD_1', 'ILOAD_2', 'ILOAD_3', 
  'LLOAD_0', 'LLOAD_1', 'LLOAD_2', 'LLOAD_3', 
  'FLOAD_0', 'FLOAD_1', 'FLOAD_2', 'FLOAD_3', 
  'DLOAD_0', 'DLOAD_1', 'DLOAD_2', 'DLOAD_3', 
  'ALOAD_0', 'ALOAD_1', 'ALOAD_2', 'ALOAD_3', 
  'IALOAD', 'LALOAD', 'FALOAD', 'DALOAD', 'AALOAD', 
  'BALOAD', 'CALOAD', 'SALOAD', 'ISTORE', 'LSTORE', 
  'FSTORE', 'DSTORE', 'ASTORE', 'ISTORE_0', 
  'ISTORE_1', 'ISTORE_2', 'ISTORE_3', 'LSTORE_0', 
  'LSTORE_1', 'LSTORE_2', 'LSTORE_3', 'FSTORE_0', 
  'FSTORE_1', 'FSTORE_2', 'FSTORE_3', 'DSTORE_0', 
  'DSTORE_1', 'DSTORE_2', 'DSTORE_3', 'ASTORE_0', 
  'ASTORE_1', 'ASTORE_2', 'ASTORE_3', 'IASTORE', 
  'LASTORE', 'FASTORE', 'DASTORE', 'AASTORE', 
  'BASTORE', 'CASTORE', 'SASTORE', 'POP', 'POP2', 'DUP', 
  'DUP_X1', 'DUP_X2', 'DUP2', 'DUP2_X1', 'DUP2_X2', 'SWAP', 
  'IADD', 'LADD', 'FADD', 'DADD', 'ISUB', 'LSUB', 'FSUB', 
  'DSUB', 'IMUL', 'LMUL', 'FMUL', 'DMUL', 'IDIV', 'LDIV', 
  'FDIV', 'DDIV', 'IREM', 'LREM', 'FREM', 'DREM', 'INEG', 
  'LNEG', 'FNEG', 'DNEG', 'ISHL', 'LSHL', 'ISHR', 'LSHR', 
  'IUSHR', 'LUSHR', 'IAND', 'LAND', 'IOR', 'LOR', 'IXOR', 
  'LXOR', 'IINC', 'I2L', 'I2F', 'I2D', 'L2I', 'L2F', 'L2D', 
  'F2I', 'F2L', 'F2D', 'D2I', 'D2L', 'D2F', 'I2B', 'I2C', 
  'I2S', 'LCMP', 'FCMPL', 'FCMPG', 'DCMPL', 'DCMPG', 'IFEQ',
  'IFNE', 'IFLT', 'IFGE', 'IFGT', 'IFLE', 'IF_ICMPEQ', 
  'IF_ICMPNE', 'IF_ICMPLT', 'IF_ICMPGE', 'IF_ICMPGT', 
  'IF_ICMPLE', 'IF_ACMPEQ', 'IF_ACMPNE', 'GOTO', 'JSR', 
  'RET', 'TABLESWITCH', 'LOOKUPSWITCH', 'IRETURN', 'LRETURN', 
  'FRETURN', 'DRETURN', 'ARETURN', 'RETURN', 'GETSTATIC', 
  'PUTSTATIC', 'GETFIELD', 'PUTFIELD', 'INVOKEVIRTUAL', 
  'INVOKESPECIAL', 'INVOKESTATIC', 'INVOKEINTERFACE', 
  'INVOKEDYNAMIC', 'NEW', 'NEWARRAY', 'ANEWARRAY', 
  'ARRAYLENGTH', 'ATHROW', 'CHECKCAST', 'INSTANCEOF', 
  'MONITORENTER', 'MONITOREXIT', 'WIDE', 'MULTIANEWARRAY', 
  'IFNULL', 'IFNONNULL', 'GOTO_W', 'JSR_W', 'BREAKPOINT', 
  '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 
  '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 
  '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 
  '', '', '', '', '', '', 'IMPDEP1', 'IMPDEP2'
];

export const NAME_TO_OPCODE = _.invert(OPCODE_TO_NAME);

const INSTRUCTION_INDICES = [
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

function buildInstructionIndexCache() {
  let indexCache = {};

  _.each(INSTRUCTION_INDICES, (val) => {
    for (let i = val.low_opcode_index; i <= val.high_opcode_index; i++) {
      indexCache[i] = {
        type: val.type, subject_to_wide: val.subject_to_wide
      };
    }
  });

  return indexCache;
}

const INSTRUCTION_INDICES_CACHE = buildInstructionIndexCache();

const DefaultInstructionDef = {
  type: AbstractInstruction,
  wrap: null,
  subject_to_wide: false
};

function getInstructionDef(opcode) {
  return INSTRUCTION_INDICES_CACHE[opcode] || DefaultInstructionDef;
}

export class InstructionFactory {
  constructor(idx, opcode, wide) {
    this.idx = idx;
    this.opcode = opcode;
    this.wide = wide;
    this.instruction = getInstructionDef(opcode);
  }

  get isWide() {
    return this.instruction.subject_to_wide;
  }

  get shouldWrap() {
    return this.wrapType !== null;
  }

  get wrapType() {
    return this.instruction.wrap || null;
  }

  build() {
    let instance = this.createInstance();

    if (this.shouldWrap) {
      instance = new this.wrapType(instance);
    }

    return instance;
  }

  createInstance() {
    let InsnType = this.instruction.type;

    return this.isWide
      ? new InsnType(this.idx, this.opcode, this.wide)
      : new InsnType(this.idx, this.opcode);
  }

  static of(idx, opcode, wide) {
    return (new InstructionFactory(idx, opcode, wide)).build();
  }
}
