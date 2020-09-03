module.register('Utils', function (module = {}) {
  window.Utils = module

  /**
   * Simple template string function that allows up to 9 arguments.
   * @param {String} template - template string
   * @param  {...any} data - the data to insert
   */
  module.printf = (template, ...data) => template.replace(/(?<!\\)(?:\\\\)*%([0-9])/g, (_, n) => data[n - 1])
})
