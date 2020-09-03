/* global Utils */

Utils.Errors = function () {
  const StringLength = function (template, str, min, max) {
    if (str.length < min || str.length > max) throw new RangeError(Utils.printf(template, str.length, min, max))
  }

  return { StringLength }
}
