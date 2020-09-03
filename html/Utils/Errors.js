module.register('Errors', function (module = window.Utils, Utils = window.utils) {
  module.Errors = (function () {
    /**
     * Throws an error if a string is of the wrong length
     * @param {String} template - template error message
     * @param {String} str - string length to check
     * @param {Number} min - minimum length
     * @param {Number} max - maximum length
     */
    const StringLength = function (template, str, min, max) {
      if (str.length < min || str.length > max) throw new RangeError(Utils.printf(template, str.length, min, max))
    }

    return { StringLength }
  })()
}, ['Utils'])
