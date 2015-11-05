/**
 * Helper class for {@link LookupSwitchInstruction} for mapping switch case
 * matches and offsets.
 */
export default class OffsetPair {
    /**
     * @param  {Number} match
     * @param  {Number} offset
     */
    constructor(match, offset) {
        /** @type {Number} */
        this.match = match;
        /** @type {Number} */
        this.offset = offset;
    }
}
