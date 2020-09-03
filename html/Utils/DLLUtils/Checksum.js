
module.register('Checksum', function (module = window.DLLUtils) {
  module.Checksum = (function () {
    /**
     * Checksum data for a PE file.
     * @typedef {Object} Checksum
     * @property {Number} offset - the offset at which to insert the checksum.
     * @property {Number} sum - the checksum
     */

    /**
     * Adds the high 16 bits to the low 16 bits for a 32-bit uint.
     * @param {UInt32} uint32 - number to sum
     * @returns {Number} the computed sum
     */
    function sum32 (uint32) {
      return (uint32 >>> 16) + (uint32 & 0xffff)
    }

    /**
     * Sums the view by cutting it into 32-bit unsigned ints, summing them
     * individually, and finally summing them and turning them into a 16-bit number
     * @param {DataView} view - view to sum
     * @returns {Number} the computed sum
     */
    function getSum (view) {
      return sum32(Uint32Array
        .from(Array(view.byteLength / 4), (_, i) => view.getUint32(i * 4, true))
        .reduce((a, c) => sum32(a + c), 0)) & 0xffff
    }

    /**
     * Gets the memory address for the PE optional NT header
     * @param {DataView} view - view to get the header location for
     * @param {Number} offset - should be 0
     * @returns {Number} the address
     */
    function getHeader (view, offset = 0) {
      if (view.getUint16(offset, false) === 0x4d5a) offset += 0xd0
      if (view.getUint16(offset, false) === 0x5045) offset += 0x18
      return offset
    }

    /**
     * Calculates the checksun for a PE file from a DataView
     * @param {DataView} view - the view to sum
     * @returns {Checksum} the resulting checksum
     */
    function checksum (view) {
      const offset = getHeader(view)
      if (offset !== 0) view.setUint16(offset + 0x40, 0)
      const sum = getSum(view) + view.byteLength
      return { offset: offset + 0x40, sum }
    }

    /**
     * Calculates the checksun for a PE file from a blob
     * @param {Blob} blob - the blob to sum
     * @returns {Checksum} the resulting checksum
     */
    async function checksumBlob (blob) {
      return checksum(new DataView(await blob.arrayBuffer()))
    }

    return { checksum, checksumBlob }
  })()
}, ['DLLUtils'])
