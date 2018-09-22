import * as _ from 'lodash';

import { Jar, ClassVisitor } from '../src/index';
import { Pipeline } from '../src/util/Pipeline';
import { Flags } from '../src/core/jvm/AccessFlags';

let isVisibleToChildren = (member) => {
  return Flags.isPublic(member.accessFlags) || Flags.isProtected(member.accessFlags);
}

class FieldVisitor extends ClassVisitor {
  constructor(jar) {
    super();
    this.jar = jar;
    this.visited = new Set;
  }

  get count() {
    return this.visited.size;
  }

  recordField(cls, field) {
    this.visited.add([cls.name, field.name, field.desc].join(':'));
  }

  toArray() {
    return [...this.visited];
  }
}

class DeclaredFieldVisitor extends FieldVisitor {
  constructor(jar) {
    super(jar);
    this.on('visit-start', (cls) => this.visitInheritedFields(cls));
    this.on('visit-field', (cls, field) => this.recordField(cls, field));
  }

  visitInheritedFields(cls) {
    let parent = this.jar[cls.superName];
    while (parent) {
      parent.fields
        .filter(isVisibleToChildren)
        .forEach(field => this.recordField(parent, field));

      parent = this.jar[parent.superName];
    }
  }
}

class ReferencedFieldVisitor extends FieldVisitor {
  constructor(jar) {
    super(jar);
    this.on('visit-method', (cls, method) => this.visitMethodInstructions(method.instructions));
  }

  visitFieldInstruction(insn) {
    let cls = this.jar[insn.owner];
    let fieldStruct = { name: insn.name, desc: insn.desc };
    this.recordField(cls, fieldStruct);

    let parent = this.jar[cls.superName];
    while (parent) {
      let field = _.find(parent.fields, fieldStruct);
      if ( ! field || ! isVisibleToChildren(field)) {
        break;
      }

      this.recordField(parent, field);

      parent = this.jar[parent.superName];
    }
  }

  visitMethodInstructions(instructions) {
    instructions
      .filter(insn => insn.constructor.name === 'FieldInstruction' && insn.owner in this.jar)
      .forEach(insn => this.visitFieldInstruction(insn));
  }
}

let createFieldUsagePipeline = () => {
  let pipeline = new Pipeline;

  // analysis/transformation steps

  pipeline.addStep('identification', (jar) => {
    let declaredFields = new DeclaredFieldVisitor(jar);
    let referencedFields = new ReferencedFieldVisitor(jar);

    _.values(jar).forEach(cls => {
      declaredFields.accept(cls);
      referencedFields.accept(cls);
    });

    return {
      declared: declaredFields.count,
      referenced: referencedFields.count,
      unreferenced: _.difference(declaredFields.toArray(), referencedFields.toArray())
    };
  });

  pipeline.addStep('transformation', (jar) => {
    pipeline
      .stepResult('identification')
      .unreferenced
      .forEach(key => {
        let [clazz, name, desc] = key.split(':');
        let cls = jar[clazz];
        let field = _.find(cls.fields, { name, desc });
        _.remove(cls.fields, field);
      });
  });

  // output

  pipeline.afterStep('identification', (step, elapsed) => {
    console.log('Fields declared but not referenced: %s.', step.unreferenced.length);
    console.log('Fields referenced: %s/%s', step.referenced, step.declared);
  });

  pipeline.afterStep('transformation', (step, elapsed) => {
    console.log('Removed fields from classes in %ss', elapsed);
  });

  pipeline.after(elapsed => console.log('Unused Field Pipeline completed in %ss', elapsed));

  return pipeline;
}

Jar.unpack(process.argv[2])
  .then(jar => _.fromPairs([...jar]))
  .then(jar => {
    createFieldUsagePipeline()
      .execute(jar);
  })
  .catch(console.error.bind(console));
