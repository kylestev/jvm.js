import * as _ from 'lodash';

const ACC_PUBLIC = 0x0001;
const ACC_FINAL = 0x0010;
const ACC_SUPER = 0x0020;
const ACC_INTERFACE = 0x0200;
const ACC_ABSTRACT = 0x0400;
const ACC_SYNTHETIC = 0x1000;
const ACC_ANNOTATION = 0x2000;
const ACC_ENUM = 0x4000;

const FLAGS = {
  ACC_PUBLIC,
  ACC_FINAL,
  ACC_SUPER,
  ACC_INTERFACE,
  ACC_ABSTRACT,
  ACC_SYNTHETIC,
  ACC_ANNOTATION,
  ACC_ENUM
};

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
      if (!method.startsWith("is")) return null;
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

export default {
  AccessFlags: ACCESS_FLAGS,
  ACC_PUBLIC,
  ACC_FINAL,
  ACC_SUPER,
  ACC_INTERFACE,
  ACC_ABSTRACT,
  ACC_SYNTHETIC,
  ACC_ANNOTATION,
  ACC_ENUM
}
