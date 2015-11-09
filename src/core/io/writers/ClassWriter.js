import { InstructionMajorVersionVerifier } from '../../jvm/verify/InstructionMajorVersionVerifier';
const JVM_CLASS_FILE_MAGIC_NUMBER = 0xcafebabe;

/**
 * Writes a ClassInfo object to a buffer and verifies that its attributes are
 * valid.
 */
class ClassWriter {
  /**
   * @param  {ClassInfo} cls - {@link ClassInfo} object to write
   * @param  {NiceBuffer} buffer - buffer to write to
   */
  constructor(cls, buffer) {
    /** @type {ClassInfo} */
    this.cls = cls;
    /** @type {NiceBuffer} */
    this.buffer = buffer;
    /** @type {InstructionMajorVersionVerifier} */
    this.majorVerifier = new InstructionMajorVersionVerifier(cls);
  }

  /**
   * Verifies the contents of {@link ClassInfo.cls} is correct.
   * @return {Boolean}
   */
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

  /**
   * Writes the JVM class file magic number. 0xCAFEBABE
   */
  writeHeader() {
    this.buffer.writeInt(JVM_CLASS_FILE_MAGIC_NUMBER);
  }

  /**
   * Writes the Java SE runtime this class file was targeted for.
   */
  writeVersions() {
    this.buffer.writeShort(this.cls.minor);
    this.buffer.writeShort(this.cls.major);
  }
}

export {
  ClassWriter
};
