const _ = require('lodash');

class Container {
  constructor() {
    this.bindings = {};
  }

  exists(name, assert = false) {
    let exists = name in this.bindings;

    if ( ! exists && assert) {
      throw new Error('Whoa, ' + name + ' has not been bound to this container!');
    }

    return exists;
  }

  factory(cls) {
    let key = cls + 'Factory';
    this.exists(key, true);

    let Factory = this.bindings[key];
    return function () {
      let args = _.values(arguments);
      return new (Function.prototype.bind.apply(Factory, args));
    }
  }

  make(name, params = []) {
    this.exists(name, true);
    return this.bindings[name].apply(null, params);
  }

  set(name, factory, overwrite = true) {
    if (name in this.bindings && ! overwrite) {
      return;
    }

    this.bindings[name] = factory;
  }
}

let IoC = new Container;

export {
  IoC
};
