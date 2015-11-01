import {
  NiceBuffer,
  SIZE_INT,
  SIZE_SHORT,
  SIZE_BYTE,
} from '../parsers/NiceBuffer';

const Errors = require('../../Errors');

export class JVMAttribute {
  decode() {
    throw Errors.NotImplementedError;
  }
}

/**
 * @link https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.7.2
 */
export class JVMConstantValueAttribute extends JVMAttribute {
  decode() {
    //
  }
}

export class JVMCodeAttribute extends JVMAttribute {
  decode(attr) {
    let buff = new NiceBuffer(new Buffer(attr.info));

    // TODO: parse bytecode

    return buff.readStruct([
      [ 'max_stack', SIZE_SHORT ],
      [ 'max_locals', SIZE_SHORT ],
      [ 'code_length', SIZE_INT ],
      [ '$code', 'code_length' ],
      [ 'exception_table_length', SIZE_SHORT ],
      [ '@exception_table|exception_table_length', {
        struct: [
          [ 'start_pc', SIZE_SHORT ],
          [ 'end_pc', SIZE_SHORT ],
          [ 'handler_pc', SIZE_SHORT ],
          [ 'catch_type', SIZE_SHORT ],
        ]
      }],
    ]);
  }
}

export class JVMStackMapTableAttribute extends JVMAttribute {
  // decode(attr) {
  //   let buff = new NiceBuffer(new Buffer(attr.info));

  //   return buff.readStruct([
  //     [ 'number_of_entries', SIZE_SHORT ],
  //     [ '$stack_map_frame|number_of_entries', {
  //       struct: [
  //         [ 'start_pc', SIZE_SHORT ],
  //         [ 'end_pc', SIZE_SHORT ],
  //         [ 'handler_pc', SIZE_SHORT ],
  //         [ 'catch_type', SIZE_SHORT ],
  //       ]
  //     }],
  //   ]);
  // }
}

export class JVMExceptionsAttribute extends JVMAttribute {
  decode(attr) {
    let buff = new NiceBuffer(new Buffer(attr.info));

    return buff.readStruct([
      [ 'number_of_exceptions', SIZE_SHORT ],
      [ '$exception_index_table|number_of_exceptions', {
        struct: [
          [ 'class_index', SIZE_SHORT ],
        ]
      }],
    ]);
  }
}

export class JVMInnerClassesAttribute extends JVMAttribute {
  decode(attr) {
    let buff = new NiceBuffer(new Buffer(attr.info));

    return buff.readStruct([
      [ 'number_of_classes', SIZE_SHORT ],
      [ '$classes|number_of_classes', {
        struct: [
          [ 'inner_class_info_index', SIZE_SHORT ],
          [ 'outer_class_info_index', SIZE_SHORT ],
          [ 'inner_name_index', SIZE_SHORT ],
          [ 'inner_class_access_flags', SIZE_SHORT ],
        ]
      }],
    ]);
  }
}

export class JVMEnclosingMethodAttribute extends JVMAttribute {
  decode(attr) {
    let buff = new NiceBuffer(new Buffer(attr.info));

    return buff.readStruct([
      [ 'class_index', SIZE_SHORT ],
      [ 'method_index', SIZE_SHORT ]
    ]);
  }
}

export class JVMSyntheticAttribute extends JVMAttribute {
  decode(attr) {
    // TODO: assert attribute_length === 0
    return {};
  }
}

export class JVMSignatureAttribute extends JVMAttribute {
  decode(attr) {
    let buff = new NiceBuffer(new Buffer(attr.info));

    return buff.readStruct([
      [ 'signature_index', SIZE_SHORT ]
    ]);
  }
}

export class JVMSourceFileAttribute extends JVMAttribute {
  decode(attr) {
    let buff = new NiceBuffer(new Buffer(attr.info));

    return buff.readStruct([
      [ 'sourcefile_index', SIZE_SHORT ]
    ]);
  }
}

export class JVMLineNumberTableAttribute extends JVMAttribute {
  decode(attr) {
    let buff = new NiceBuffer(new Buffer(attr.info));

    return buff.readStruct([
      [ 'debug_extension', attr.attribute_length ]
    ]);
  }
}

export class JVMSourceDebugExtensionAttribute extends JVMAttribute {
  decode(attr) {
    let buff = new NiceBuffer(new Buffer(attr.info));

    return buff.readStruct([
      [ 'line_number_table_length', SIZE_SHORT ],
      [ '@line_number_table|line_number_table_length]', {
        struct: [
          [ 'start_pc', SIZE_SHORT ],
          [ 'line_number', SIZE_SHORT ],
        ]
      }]
    ]);
  }
}

export class JVMLocalVariableTableAttribute extends JVMAttribute {
  decode(attr) {
    let buff = new NiceBuffer(new Buffer(attr.info));

    return buff.readStruct([
      [ 'local_variable_table_length', SIZE_SHORT ],
      [ '@local_variable_table|local_variable_table_length]', {
        struct: [
          [ 'start_pc', SIZE_SHORT ],
          [ 'length', SIZE_SHORT ],
          [ 'name_index', SIZE_SHORT ],
          [ 'descriptor_index', SIZE_SHORT ],
          [ 'index', SIZE_SHORT ],
        ]
      }]
    ]);
  }
}

export class JVMLocalVariableTypeTableAttribute extends JVMAttribute {
  decode(attr) {
    let buff = new NiceBuffer(new Buffer(attr.info));

    return buff.readStruct([
      [ 'local_variable_type_table_length', SIZE_SHORT ],
      [ '@local_variable_type_table|local_variable_type_table_length]', {
        struct: [
          [ 'start_pc', SIZE_SHORT ],
          [ 'length', SIZE_SHORT ],
          [ 'name_index', SIZE_SHORT ],
          [ 'signature_index', SIZE_SHORT ],
          [ 'index', SIZE_SHORT ],
        ]
      }]
    ]);
  }
}

export class JVMDeprecatedAttribute extends JVMAttribute {
  decode(attr) {
    // TODO: assert attribute_length === 0
    return {};
  }
}

export class JVMRuntimeVisibleAnnotationsAttribute extends JVMAttribute {
  decode(attr) {
    // let buff = new NiceBuffer(new Buffer(attr.info));

    // return buff.readStruct([
    //   [ 'num_annotations', SIZE_SHORT ],
    //   [ '@annotations|num_annotations', {
    //     struct: [
    //       [ 'type_index', SIZE_SHORT ],
    //       [ 'num_element_value_pairs', SIZE_SHORT ],
    //       [ 'name_index', SIZE_SHORT ],
    //       [ 'signature_index', SIZE_SHORT ],
    //       [ 'index', SIZE_SHORT ],
    //     ]
    //   }]
    // ]);
    throw Errors.NotImplementedError;
  }
}

export class JVMRuntimeInvisibleAnnotationsAttribute extends JVMAttribute {
  decode(attr) {
    // let buff = new NiceBuffer(new Buffer(attr.info));

    // return buff.readStruct([
    //   [ 'num_annotations', SIZE_SHORT ],
    //   [ '@annotations|num_annotations', {
    //     struct: [
    //       [ 'type_index', SIZE_SHORT ],
    //       [ 'num_element_value_pairs', SIZE_SHORT ],
    //       [ 'name_index', SIZE_SHORT ],
    //       [ 'signature_index', SIZE_SHORT ],
    //       [ 'index', SIZE_SHORT ],
    //     ]
    //   }]
    // ]);
    throw Errors.NotImplementedError;
  }
}

export class JVMRuntimeVisibleParameterAnnotationsAttribute extends JVMAttribute {
  decode(attr) {
    // let buff = new NiceBuffer(new Buffer(attr.info));

    // return buff.readStruct([
    //   [ 'num_annotations', SIZE_SHORT ],
    //   [ '@annotations|num_annotations', {
    //     struct: [
    //       [ 'type_index', SIZE_SHORT ],
    //       [ 'num_element_value_pairs', SIZE_SHORT ],
    //       [ 'name_index', SIZE_SHORT ],
    //       [ 'signature_index', SIZE_SHORT ],
    //       [ 'index', SIZE_SHORT ],
    //     ]
    //   }]
    // ]);
    throw Errors.NotImplementedError;
  }
}

export class JVMRuntimeInvisibleParameterAnnotationsAttribute extends JVMAttribute {
  decode(attr) {
    // let buff = new NiceBuffer(new Buffer(attr.info));

    // return buff.readStruct([
    //   [ 'num_annotations', SIZE_SHORT ],
    //   [ '@annotations|num_annotations', {
    //     struct: [
    //       [ 'type_index', SIZE_SHORT ],
    //       [ 'num_element_value_pairs', SIZE_SHORT ],
    //       [ 'name_index', SIZE_SHORT ],
    //       [ 'signature_index', SIZE_SHORT ],
    //       [ 'index', SIZE_SHORT ],
    //     ]
    //   }]
    // ]);
    throw Errors.NotImplementedError;
  }
}

export class JVMRuntimeVisibleTypeAnnotationsAttribute extends JVMAttribute {
  decode(attr) {
    // let buff = new NiceBuffer(new Buffer(attr.info));

    // return buff.readStruct([
    //   [ 'num_annotations', SIZE_SHORT ],
    //   [ '@annotations|num_annotations', {
    //     struct: [
    //       [ 'type_index', SIZE_SHORT ],
    //       [ 'num_element_value_pairs', SIZE_SHORT ],
    //       [ 'name_index', SIZE_SHORT ],
    //       [ 'signature_index', SIZE_SHORT ],
    //       [ 'index', SIZE_SHORT ],
    //     ]
    //   }]
    // ]);
    throw Errors.NotImplementedError;
  }
}

export class JVMRuntimeInvisibleTypeAnnotationsAttribute extends JVMAttribute {
  decode(attr) {
    // let buff = new NiceBuffer(new Buffer(attr.info));

    // return buff.readStruct([
    //   [ 'num_annotations', SIZE_SHORT ],
    //   [ '@annotations|num_annotations', {
    //     struct: [
    //       [ 'type_index', SIZE_SHORT ],
    //       [ 'num_element_value_pairs', SIZE_SHORT ],
    //       [ 'name_index', SIZE_SHORT ],
    //       [ 'signature_index', SIZE_SHORT ],
    //       [ 'index', SIZE_SHORT ],
    //     ]
    //   }]
    // ]);
    throw Errors.NotImplementedError;
  }
}

export class JVMAnnotationDefaultAttribute extends JVMAttribute {
  decode(attr) {
    // let buff = new NiceBuffer(new Buffer(attr.info));

    // return buff.readStruct([
    //   [ 'num_annotations', SIZE_SHORT ],
    //   [ '@annotations|num_annotations', {
    //     struct: [
    //       [ 'type_index', SIZE_SHORT ],
    //       [ 'num_element_value_pairs', SIZE_SHORT ],
    //       [ 'name_index', SIZE_SHORT ],
    //       [ 'signature_index', SIZE_SHORT ],
    //       [ 'index', SIZE_SHORT ],
    //     ]
    //   }]
    // ]);
    throw Errors.NotImplementedError;
  }
}

export class JVMBootstrapMethodsAttribute extends JVMAttribute {
  decode(attr) {
    // let buff = new NiceBuffer(new Buffer(attr.info));

    // return buff.readStruct([
    //   [ 'num_annotations', SIZE_SHORT ],
    //   [ '@annotations|num_annotations', {
    //     struct: [
    //       [ 'type_index', SIZE_SHORT ],
    //       [ 'num_element_value_pairs', SIZE_SHORT ],
    //       [ 'name_index', SIZE_SHORT ],
    //       [ 'signature_index', SIZE_SHORT ],
    //       [ 'index', SIZE_SHORT ],
    //     ]
    //   }]
    // ]);
    throw Errors.NotImplementedError;
  }
}

export class JVMMethodParametersAttribute extends JVMAttribute {
  decode(attr) {
    // let buff = new NiceBuffer(new Buffer(attr.info));

    // return buff.readStruct([
    //   [ 'num_annotations', SIZE_SHORT ],
    //   [ '@annotations|num_annotations', {
    //     struct: [
    //       [ 'type_index', SIZE_SHORT ],
    //       [ 'num_element_value_pairs', SIZE_SHORT ],
    //       [ 'name_index', SIZE_SHORT ],
    //       [ 'signature_index', SIZE_SHORT ],
    //       [ 'index', SIZE_SHORT ],
    //     ]
    //   }]
    // ]);
    throw Errors.NotImplementedError;
  }
}

export const AttributeMapping = {
  Code: JVMCodeAttribute,
  StackMapTable: JVMStackMapTableAttribute,
  Exceptions: JVMExceptionsAttribute,
  InnerClasses: JVMInnerClassesAttribute,
  EnclosingMethod: JVMEnclosingMethodAttribute,
  Synthetic: JVMSyntheticAttribute,
  Signature: JVMSignatureAttribute,
  SourceFile: JVMSourceFileAttribute,
  SourceDebugExtension: JVMSourceDebugExtensionAttribute,
  LineNumberTable: JVMLineNumberTableAttribute,
  LocalVariableTable: JVMLocalVariableTableAttribute,
  LocalVariableTypeTable: JVMLocalVariableTypeTableAttribute,
  Deprecated: JVMDeprecatedAttribute,
  RuntimeVisibleAnnotations: JVMRuntimeVisibleAnnotationsAttribute,
  RuntimeInvisibleAnnotations: JVMRuntimeInvisibleAnnotationsAttribute,
  RuntimeVisibleParameterAnnotations: JVMRuntimeVisibleParameterAnnotationsAttribute,
  RuntimeInvisibleParameterAnnotations: JVMRuntimeInvisibleParameterAnnotationsAttribute,
  RuntimeVisibleTypeAnnotations: JVMRuntimeVisibleTypeAnnotationsAttribute,
  RuntimeInvisibleTypeAnnotations: JVMRuntimeInvisibleTypeAnnotationsAttribute,
  AnnotationDefault: JVMAnnotationDefaultAttribute,
  BootstrapMethods: JVMBootstrapMethodsAttribute,
  MethodParameters: JVMMethodParametersAttribute,
};

export function decodeAttribute(attrInfo) {
  let attrInstance = new AttributeMapping[attrInfo.name];
  return attrInstance.decode(attrInfo);
}
