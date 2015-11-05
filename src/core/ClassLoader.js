const _ = require('../util/lodash');

import { ClassInfo } from './jvm/ClassInfo';
import { FieldInfo } from './jvm/FieldInfo';
import { MethodInfo } from './jvm/MethodInfo';
import { ConstantPool } from './jvm/ConstantPool';
import { AttributeInfo } from './jvm/AttributeInfo';
import { ClassCollection } from './ClassCollection';
import { ClassFileParser } from './parsers/ClassFileParser';

function constantPoolLookup(pool, poolIdx) {
  return _.get(pool, [poolIdx - 1, 'info', 'bytes']);
}

function replaceConstantPoolStringLookups(memberInfo, pool) {
  let lookups = ['name_index', 'descriptor_index', 'attribute_name_index'];

  _.intersection(lookups, _.keys(memberInfo))
    .forEach((lookup) => {
      let parts = lookup.split('_');
      // This gives us all but the last "part" aka no _index suffix.
      let namePrefix = parts.splice(0, parts.length - 1).join('_');

      let poolIdx = memberInfo[lookup] - 1;
      let poolEntry = _.get(pool, [poolIdx, 'info', 'bytes']);
      // structure looks like: pool[poolIdx] = { tag: 1, info: { len: 10, bytes: 'SourceFile' }}

      memberInfo[namePrefix] = poolEntry;
    });

  // Fields and methods have nested attribute_info key-value-pairs which should have
  // their relevant strings pulled for them.
  _.each(_.intersection(['attribute_info'], _.keys(memberInfo)), (key) => {
    // We don't need to recurse if we're not going to find anything
    if (_.isEmpty(memberInfo[key])) {
      return;
    }

    memberInfo[key] = _.map(memberInfo[key], (nestedMemberInfo) => {
      return replaceConstantPoolStringLookups(nestedMemberInfo, pool);
    });
  });

  return memberInfo;
}

class ClassLoader {
  loadClass(name, buff) {
    return new Promise((resolve, reject) => {
      try {
        let cls = ClassFileParser.parse(buff);

        ['fields', 'methods', 'attributes'].forEach((type) => {
          if (_.has(cls, type)) {
            _.each(cls[type], (info) => {
              replaceConstantPoolStringLookups(info, cls.constant_pool);
            });
          }
        });

        let pool = cls.constant_pool;
        let version = { major: cls.major_version, minor: cls.minor_version };
        let className = constantPoolLookup(pool, pool[cls.this_class - 1].info.name_index);
        let superName = constantPoolLookup(pool, pool[cls.super_class - 1].info.name_index);
        let classInfo = new ClassInfo(cls.access_flags, version, className, superName, new ConstantPool(pool));

        _.each(cls.interfaces, (intr) => {
          let inter = constantPoolLookup(pool, pool[intr.class_index - 1].info.name_index);
          classInfo.addInterface(inter);
        });

        _.each(cls.methods, (method) => {
          let methodInfo = new MethodInfo(method.access_flags, method.name, method.descriptor);
          method.attribute_info.forEach((attr) => {
            methodInfo.addAttribute(new AttributeInfo(attr, methodInfo));
          });
          classInfo.addMethod(methodInfo);
        });

        _.each(cls.fields, (field) => {
          let fieldInfo = new FieldInfo(field.access_flags, field.name, field.descriptor);
          field.attribute_info.forEach((attr) => {
            fieldInfo.addAttribute(new AttributeInfo(attr, fieldInfo));
          });
          classInfo.addField(fieldInfo);
        });

        resolve(classInfo);
      } catch (err) {
        reject(err);
      }
    });
  }

  loadClasses(archive) {
    let classes = new Map();
    return Promise.all(
      _.map(_.toMap(archive.classBuffers), (buffer, name) => {
        return this.loadClass(name, buffer)
          .then((cls) => {
            classes.set(name, cls);
            return cls;
          });
      })
    )
    .then(() => {
      return ClassCollection.of(classes);
    });
  }
}

export {
  ClassLoader
};
