import { Parser } from 'binary-parser';

const ConstantClassInfo =
  Parser.start()
    .uint16('name_index');

const ConstantFieldrefInfo =
  Parser.start()
    .uint16('class_index')
    .uint16('name_and_type_index');

const ConstantMethodrefInfo =
  Parser.start()
    .uint16('class_index')
    .uint16('name_and_type_index');

const ConstantInterfaceMethodrefInfo =
  Parser.start()
    .uint16('class_index')
    .uint16('name_and_type_index');

const ConstantStringInfo =
  Parser.start()
    .uint16('string_index');

const ConstantIntegerInfo =
  Parser.start()
    .uint32('bytes');

const ConstantFloatInfo =
  Parser.start()
    .uint32('bytes');

const ConstantLongInfo =
  Parser.start()
    .uint32('high_bytes')
    .uint32('low_bytes');

const ConstantDoubleInfo =
  Parser.start()
    .uint32('high_bytes')
    .uint32('low_bytes');

const ConstantNameAndTypeInfo =
  Parser.start()
    .uint16('name_index')
    .uint16('descriptor_index');

const ConstantUtf8Info =
  Parser.start()
    .uint16('len')
    .string('bytes', { length: 'len' });

const ConstantMethodHandleInfo =
  Parser.start()
    .uint8('reference_kind')
    .uint16('reference_index');

const ConstantMethodTypeInfo =
  Parser.start()
    .uint16('descriptor_index');

const ConstantInvokeDynamicInfo =
  Parser.start()
    .uint16('bootstrap_method_attr_index')
    .uint16('name_and_type_index');

export const ConstantPoolInfo =
  Parser.start()
    .uint8('tag')
    .choice('info', {
      tag: 'tag',
      choices: {
        1:  ConstantUtf8Info,
        3:  ConstantIntegerInfo,
        4:  ConstantFloatInfo,
        5:  ConstantLongInfo,
        6:  ConstantDoubleInfo,
        7:  ConstantClassInfo,
        8:  ConstantStringInfo,
        9:  ConstantFieldrefInfo,
        10: ConstantMethodrefInfo,
        11: ConstantInterfaceMethodrefInfo,
        12: ConstantNameAndTypeInfo,
        15: ConstantMethodHandleInfo,
        16: ConstantMethodTypeInfo,
        18: ConstantInvokeDynamicInfo,
      }
    });
