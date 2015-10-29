import * as _ from 'lodash';
import { ConstantPool } from '../jvm/ConstantPool';

_.mixin({
  toMap: function (map) {
    let m = {};
    for (var k of map) {
      let [key, value] = k;
      m[key] = value;
    }
    return m;
  }
});

export class ClassFile {
  constructor(name) {
    this.name = name;
    this.props = new Map();
    this.constantPool = new ConstantPool();
    this.interfaces = [];
    this.fields = [];
    this.methods = [];
    this.attributes = [];
  }

  property(prop, value = null) {
    if (value === null) {
      return this.props.get(prop);
    }

    this.props.set(prop, value);
  }

  string(idx) {
    return this.constantPool.at(idx).bytes.toString('UTF8');
  }

  dump() {
    let struct = {
      'interfaces': [],
      'strings': [],
      'fields': [],
      'methods': [],
      'attributes': [],
    };

    let _clone = (obj) => {
      return JSON.parse(JSON.stringify(obj));
    };

    let resolveAttribute = (attr) => {
      let clone = _clone(attr);

      clone['decoded'] = {
        name: this.string(clone.attribute_name_index)
      };

      return clone;
    };

    _.each(this.fields, field => {
      let clone = _clone(field);

      _.map(clone.attribute_info, (attrInfo) => {
        attrInfo['name'] = this.string(attrInfo.attribute_name_index);
      });

      clone['decoded'] = {
        name: this.string(clone.name_index),
        descriptor: this.string(clone.descriptor_index)
      };

      struct.fields.push(clone);
    });

    _.each(this.methods, method => {
      let clone = _clone(method);

      _.map(clone.attribute_info, (attrInfo) => {
        attrInfo['name'] = this.string(attrInfo.attribute_name_index);
      });

      clone['decoded'] = {
        name: this.string(clone.name_index),
        descriptor: this.string(clone.descriptor_index)
      };

      struct.methods.push(clone);
    });

    _.each(this.attributes, attribute => {
      // let clone = JSON.parse(JSON.stringify(attribute));

      // clone['decoded'] = {
      //   name: this.string(clone.attribute_name_index)
      // };

      struct.attributes.push(resolveAttribute(attribute));
    });

    _.each(_.filter(this.constantPool.pool, { tag: 1 }), (val) => {
      struct.strings.push(val.bytes.toString('UTF8'));
    });

    _.each(this.interfaces, (idx) => {
      struct.interfaces.push(this.constantPool.at(idx))
    });

    return {
      properties: _.toMap(this.props),
      debug: struct
    };
  }
}
