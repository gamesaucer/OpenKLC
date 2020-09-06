module.register('Utils', function (module = {}) {
  window.Utils = module

  /**
   * Simple template string function that allows up to 9 arguments.
   * @param {String} template - template string
   * @param  {...any} data - the data to insert
   */
  module.printf = (template, ...data) => template.replace(/(?<!\\)(?:\\\\)*%([0-9])/g, (_, n) => data[n - 1])

  module.hex = string => {
    const err = new TypeError(`Could not convert ${string} to a valid number`)
    if (typeof string === 'number') return string
    if (typeof string !== 'string') throw err
    if (string.slice(0, 2) === '0x') return Number(string)
    const num = Number(`0x${string}`)
    if (!isNaN(num)) return num
    if (!isNaN(Number(string))) return Number(string)
    throw err
  }
})
