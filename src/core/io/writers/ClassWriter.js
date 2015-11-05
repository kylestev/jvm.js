import { InstructionMajorVersionVerifier } from '../../jvm/verify/InstructionMajorVersionVerifier';
const JVM_CLASS_FILE_MAGIC_NUMBER = 0xcafebabe;

class ClassWriter {
  constructor(cls, buffer) {
    this.cls = cls;
    this.buffer = buffer;
    this.majorVerifier = new InstructionMajorVersionVerifier(cls);
  }

  verify() {
    // will need to change to ensure all verifiers pass before returning once they are added
    return this.majorVerifier.verify();
  }

  write() {
    if ( ! this.verify()) {
      throw new Error('Unable to verify class contents for writing: ' + this.cls.name);
    }

    this.writeHeader();
    this.writeVersions();
    // TODO: output rest of class file structure
  }

  writeHeader() {
    this.buffer.writeInt(JVM_CLASS_FILE_MAGIC_NUMBER);
  }

  writeVersions() {
    this.buffer.writeShort(this.cls.minor);
    this.buffer.writeShort(this.cls.major);
  }
}

export {
  ClassWriter
};
