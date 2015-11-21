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

export {
  ClassVisitor
};
