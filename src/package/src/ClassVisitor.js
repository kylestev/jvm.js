import { EventEmitter } from 'events';

class ClassVisitor extends EventEmitter {
  constructor() {
    super();
  }

  accept(cls) {
    this.beginVisit(cls);
    this.visitFields(cls);
    this.visitMethods(cls);
    this.endVisit(cls);
  }

  beginVisit(cls) {
    this.emit('visit-start', cls);
  }

  endVisit(cls) {
    this.emit('visit-end', cls);
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
    this.on('visit-end', (cls) => console.log('[visit-end]', cls.name));
  }
}

export {
  ClassVisitor,
  VerboseClassVisitor
};
