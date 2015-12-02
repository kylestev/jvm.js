const _ = require('lodash');

class Container {
  constructor() {
    this.bindings = {};
  }

  exists(name, assert = false) {
    let bound = name in this.bindings;

    if ( ! bound && assert) {
      throw new Error('Whoa, ' + name + ' has not been bound to this container!');
    }

    return bound;
  }

  factory(cls) {
    let key = cls + 'Factory';

    this.exists(key, true);

    let Factory = this.bindings[key];
    return function () {
      return Factory.apply(null,_.values(arguments));
    };
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
