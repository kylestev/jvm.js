import { Parser } from 'binary-parser';
import { ConstantPoolInfo } from './ConstantPoolParser';
import { AttributeInfo, ClassMemberInfo, InterfaceInfo } from './ClassMembers';

const JVM_CLASS_FILE_MAGIC_NUMBER = 0xcafebabe;


export const ClassFileParser =
  Parser.start()
    // This is the default endian type for binary-parser but it's better to be safe than sorry.
    .endianess('big')
    .uint32('magic', { assert: JVM_CLASS_FILE_MAGIC_NUMBER })
    .uint16('minor_version')
    .uint16('major_version')
    .uint16('constant_pool_count')
    .array('constant_pool', {
        type: ConstantPoolInfo,
        length: function () {
          let lastIdx = this.constant_pool.length - 1;
          let lastEntry = this.constant_pool[lastIdx];

          // Quote from the JVM class file spec (Chapter 4.4.5):
          //
          //   > All 8-byte constants take up two entries in the constant_pool
          //   > table of the class file. If a CONSTANT_Long_info or CONSTANT_Double_info
          //   > structure is the item in the constant_pool table at index n, 
          //   > then the next usable item in the pool is located at index n+2.
          //   > The constant_pool index n+1 must be valid but is considered unusable.
          //
          //   Java 6: https://docs.oracle.com/javase/specs/jvms/se6/html/ClassFile.doc.html#1348
          //   Java 8: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.4.5

          // Since binary-parser serializes this method and injects it into the generated
          // parser's source code, I am unable to use constants here to replace the values
          // 5 and 6 seen in the below if statement. For reference, these are checking to
          // see if the last entry in constant_pool are of either the Long type (tag === 5)
          // or the Double type (tag === 6).
          //
          // More details here: https://github.com/keichi/binary-parser/issues/20
          if (lastEntry && (lastEntry.tag === 6 || lastEntry.tag === 5)) {
            this.constant_pool_count -= 1;
            this.constant_pool.push(false);
          }

          // This is standard and is the proper behavior for indexing of the constant pool,
          // though, no other tables in the JVM class file spec do this.
          return this.constant_pool_count - 1;
        }
    })
    .uint16('access_flags')
    .uint16('this_class')
    .uint16('super_class')
    .uint16('interface_count')
    .array('interfaces', {
      type: InterfaceInfo,
      length: function () {
        return this.interface_count;
      }
    })
    .uint16('field_count')
    .array('fields', {
      type: ClassMemberInfo,
      length: function () {
        return this.field_count;
      }
    })
    .uint16('method_count')
    .array('methods', {
      type: ClassMemberInfo,
      length: function () {
        return this.method_count;
      }
    })
    .uint16('attribute_count')
    .array('attributes', {
      type: AttributeInfo,
      length: function () {
        return this.attribute_count;
      }
    });
