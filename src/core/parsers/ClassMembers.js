import { Parser } from 'binary-parser';

/**
 * @see https://github.com/keichi/binary-parser#api
 * @type {Object}
 */
export const AttributeInfo =
  Parser.start()
    .endianess('big')
    .uint16('attribute_name_index')
    .uint32('attribute_length')
    .buffer('info', {
      length: 'attribute_length'
    });

/**
 * @see https://github.com/keichi/binary-parser#api
 * @type {Object}
 */
export const ClassMemberInfo =
  Parser.start()
    .endianess('big')
    .uint16('access_flags')
    .uint16('name_index')
    .uint16('descriptor_index')
    .uint16('attribute_count')
    .array('attribute_info', {
      type: AttributeInfo,
      length: function () {
        return this.attribute_count;
      }
    });

/**
 * @see https://github.com/keichi/binary-parser#api
 * @type {Object}
 */
export const InterfaceInfo =
  Parser.start()
    .endianess('big')
    .uint16('class_index');
