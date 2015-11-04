import { Parser } from 'binary-parser';
import { JVMMethodParametersAttribute } from '../../jvm/Attributes';

const ExceptionsParser =
  new Parser()
    .endianess('big')
    .uint16('number_of_exceptions')
    .array('exception_index_table', {
      type: 'uint16be',
      length: 'number_of_exceptions'
    });

let resolveName = (pool, idx) => {
  let name_index = pool.at(idx).info.name_index;
  return pool.at(name_index).info.bytes;
};

export default {
  parse: function (pool, attr) {
    let parsed = ExceptionsParser.parse(attr.rawData);
    parsed.exceptions = parsed.exception_index_table.map((idx) => resolveName(pool, idx));
    return parsed;
  }
};
