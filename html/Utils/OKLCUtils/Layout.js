module.register('Layout', function (module = {}, Utils = window.Utils) {
  window.OKLCUtils = module

  module.Layout = class {
    constructor (metadata = {}, attributes = 0) {
      this.metadata = {
        kbd: 'Layout##',
        desc: 'Keyboard Layout Description',
        copyright: `(c) ${(new Date()).getFullYear()} Layout Author`,
        localename: ['en', 'US'],
        localeid: 0x809,
        version: [1, 0],

        ...metadata
      }
      this.attributes = attributes
    }
  }

  module.KeyBinding = class {
    constructor (virtualKeyCode, scanCode) {
      this.virtualKeyCode = virtualKeyCode
      this.scanCode = scanCode
    }
  }

  module.Char = class {
    constructor (virtualKey, flags, str) {
      this.virtualKey = virtualKey
      this.flags = flags
      this.str = str
    }
  }

  module.Ligature = class {
    constructor (virtualKey, modifierKeys, str) {
      this.virtualKey = virtualKey
      this.modifierKeys = modifierKeys
      this.str = str

      Utils.Errors.StringLength('Expected text of length %2-%3 but received length %1', str, 1, 4)
    }
  }

  module.DeadKey = class {
    constructor (accentChar, baseChar, compositeChar, dead) {
      this.accentChar = accentChar
      this.baseChar = baseChar
      this.compositeChar = compositeChar
      this.dead = dead

      ;[accentChar, baseChar, compositeChar].forEach(char =>
        Utils.Errors.StringLength('Expected a single character but received text of length %1', char, 1, 1))
    }
  }
}, ['Utils', 'OKLCUtils'])

/* ;(function () {

})() */
