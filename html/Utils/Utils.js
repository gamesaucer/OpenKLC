module.register('Utils', function (module = {}) {
  module.printf = (template, ...data) => template.replace(/(?<!\\)(?:\\\\)*%([0-9])/g, (_, n) => data[n - 1])
  window.Utils = module
})
