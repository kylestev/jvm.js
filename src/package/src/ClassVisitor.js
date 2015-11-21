import { EventEmitter } from 'events';

class ClassVisitor extends EventEmitter {
  constructor() {
    super();
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
    cls.fields.forEach(field => this.visitField(cls, field));
  }

  visitMethod(cls, method) {
    this.emit('visit-method', cls, method);
  }

  visitMethods(cls) {
    cls.methods.forEach(method => this.visitMethod(cls, method));
  }
}

class VerboseClassVisitor extends ClassVisitor {
  constructor() {
    super();

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
