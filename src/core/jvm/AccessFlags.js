import * as _ from 'lodash';

const ACC_PUBLIC = 0x0001;
const ACC_PRIVATE = 0x0002;
const ACC_PROTECTED = 0x0004;
const ACC_STATIC = 0x0008;
const ACC_FINAL = 0x0010;
const ACC_SUPER = 0x0020; // ClassInfo only
const ACC_SYNCHRONIZED = 0x0020;
const ACC_VOLATILE = 0x0040;
const ACC_BRIDGE = 0x0040;
const ACC_TRANSIENT = 0x0080;
const ACC_VARARGS = 0x0080;
const ACC_NATIVE = 0x100;
const ACC_INTERFACE = 0x0200;
const ACC_ABSTRACT = 0x0400;
const ACC_STRICT = 0x0800;
const ACC_SYNTHETIC = 0x1000;
const ACC_ANNOTATION = 0x2000;
const ACC_ENUM = 0x4000;

const FLAGS = {
  ACC_PUBLIC,
  ACC_PRIVATE,
  ACC_PROTECTED,
  ACC_STATIC,
  ACC_FINAL,
  ACC_SUPER,
  ACC_SYNCHRONIZED,
  ACC_VOLATILE,
  ACC_BRIDGE,
  ACC_TRANSIENT,
  ACC_VARARGS,
  ACC_NATIVE,
  ACC_INTERFACE,
  ACC_ABSTRACT,
  ACC_STRICT,
  ACC_SYNTHETIC,
  ACC_ANNOTATION,
  ACC_ENUM
};

/**
 * [AccessFlags description]
 */
function AccessFlags() {
  let funcs = {};
  
  _.each(FLAGS, (val, key) => {
    let name = key.split('_')[1].toLowerCase();
    let methodName = 'is' + (name[0].toUpperCase()) + name.substring(1);

    funcs[methodName] = function (flag) {
      return (val & flag) !== 0;
    };
  });

  funcs.listFlags = (flags) => {
      // console.log(funcs)
    return _.pluck(_.filter(_.map(_.keys(funcs), (method) => {
      if (!method.startsWith('is')) {
        return null;
      }
      // console.log(method)
      let name = method.substring(2).toLowerCase();
      return {
        test: ACCESS_FLAGS[method](flags),
        name: name
      }
    }), { test: true }), 'name');
  }

  return funcs;
}

const ACCESS_FLAGS = new AccessFlags();

/** @type {AccessFlags} */
let Flags = ACCESS_FLAGS;

export {
  Flags,
  ACC_PUBLIC,
  ACC_PRIVATE,
  ACC_PROTECTED,
  ACC_STATIC,
  ACC_FINAL,
  ACC_SUPER,
  ACC_SYNCHRONIZED,
  ACC_VOLATILE,
  ACC_BRIDGE,
  ACC_TRANSIENT,
  ACC_VARARGS,
  ACC_NATIVE,
  ACC_INTERFACE,
  ACC_ABSTRACT,
  ACC_STRICT,
  ACC_SYNTHETIC,
  ACC_ANNOTATION,
  ACC_ENUM
}
