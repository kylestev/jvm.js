import * as _ from 'lodash';
import { EventEmitter } from 'events';

class ClassVisitor extends EventEmitter {
  constructor(opts) {
    super();
    this.opts = opts;
  }

  accept(cls) {
    let start = process.hrtime();

    this.beginVisit(cls);
    this.visitFields(cls);
    this.visitMethods(cls);

    let [elapsedSeconds, elapsedNanos] = process.hrtime(start);
    let elapsed = (elapsedSeconds + (elapsedNanos / 1000000000));

    this.endVisit(cls, elapsed);
  }

  beginVisit(cls) {
    this.emit('visit-start', cls);
  }

  endVisit(cls, elapsed) {
    this.emit('visit-end', cls, elapsed);
  }

  visitField(cls, field) {
    this.emit('visit-field', cls, field);
  }

  visitFields(cls) {
    this._filterMembers(cls, 'fields')
      .forEach(field => this.visitField(cls, field));
  }

  visitMethod(cls, method) {
    this.emit('visit-method', cls, method);
  }

  visitMethods(cls) {
    this._filterMembers(cls, 'methods')
      .forEach(method => this.visitMethod(cls, method));
  }

  _filterMembers(cls, member) {
    let opts = this._optionsFor(member);

    if (opts === false || ! opts.shouldVisit) {
      return [];
    }

    let filterFn = opts.filter || false;
    if (filterFn !== false) {
      return cls[member].filter(filterFn);
    }
    return cls[member];
  }

  _optionsFor(member) {
    return _.merge({
      // flag for if this member should be visited
      shouldVisit: true
    }, _.get(this.opts, member, {}));
  }
}

class VerboseClassVisitor extends ClassVisitor {
  constructor(opts) {
    super(opts);

    this.on('visit-start', (cls) => console.log('[visit-start]', cls.name));
    this.on('visit-field', (cls, field) => console.log('[visit-field] %s %s.%s', field.desc, cls.name, field.name));
    this.on('visit-method', (cls, method) => console.log('[visit-method] %s#%s%s', cls.name, method.name, method.desc));
    this.on('visit-end', (cls, elapsed) => console.log('[visit-end] %s completed in %ss', cls.name, elapsed));
  }
}

export {
  ClassVisitor,
  VerboseClassVisitor
};
