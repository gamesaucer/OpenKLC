var Utils = {}

Utils.printf = (template, ...data) => template.replace(/(?<!\\)(?:\\\\)*%([0-9])/g, (_, n) => data[n - 1])
