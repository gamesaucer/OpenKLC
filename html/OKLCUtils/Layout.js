/* global Utils, OKLCUtils */

;(function () {
  OKLCUtils.Layout = class {
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

  OKLCUtils.KeyBinding = class {
    constructor (virtualKeyCode, scanCode) {
      this.virtualKeyCode = virtualKeyCode
      this.scanCode = scanCode
    }
  }

  OKLCUtils.Char = class {
    constructor (virtualKey, flags, str) {
      this.virtualKey = virtualKey
      this.flags = flags
      this.str = str
    }
  }

  OKLCUtils.Ligature = class {
    constructor (virtualKey, modifierKeys, str) {
      this.virtualKey = virtualKey
      this.modifierKeys = modifierKeys
      this.str = str

      Utils.Errors.StringLength('Expected string of length %2-%3 but received string of length %1', str, 1, 4)
    }
  }

  OKLCUtils.DeadKey = class {
    constructor (accentChar, baseChar, compositeChar, dead) {
      this.accentChar = accentChar
      this.baseChar = baseChar
      this.compositeChar = compositeChar
      this.dead = dead

      ;[accentChar, baseChar, compositeChar].forEach(char =>
        Utils.Errors.StringLength('Expected string of length %2 but received string of length %1', char, 1, 1))
    }
  }
})()
