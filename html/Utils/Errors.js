
/* Utils.Errors = function () {
  const StringLength = function (template, str, min, max) {
    if (str.length < min || str.length > max) throw new RangeError(Utils.printf(template, str.length, min, max))
  }

  return { StringLength }
} */

module.register('Errors', function (module = window.Utils, Utils = window.utils) {
  module.Errors = (function () {
    const StringLength = function (template, str, min, max) {
      if (str.length < min || str.length > max) throw new RangeError(Utils.printf(template, str.length, min, max))
    }

    return { StringLength }
  })()
}, ['Utils'])
