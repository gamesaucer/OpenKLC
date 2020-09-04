module.register('Layout', function (module = window.OKLCUtils, Utils = window.Utils, OKLCUtils = window.OKLCUtils) {
  /**
   * Representation of a keyboard layout
   */
  module.Layout = class Layout {
    constructor (metadata = {}, attributes = 0) {
      this.metadata = {
        kbd: 'Layout##',
        desc: 'Keyboard Layout Description',
        copyright: `(c) ${(new Date()).getFullYear()}`,
        author: 'Layout Author',
        localename: ['en', 'US'],
        localeid: 0x809,
        version: [1, 0],

        ...metadata
      }
      this.attributes = attributes

      const getDupeFilterFn = input => value => !input.some(o => o.is(value))
      const splice = (array, valuesToRemove, valuesToAdd = []) =>
        array.splice(0, 0, ...array.splice(0).filter(getDupeFilterFn(valuesToRemove)), ...valuesToAdd)

      ;[OKLCUtils.KeyBinding, OKLCUtils.Char, OKLCUtils.Ligature, OKLCUtils.DeadKey, OKLCUtils.DeadKeyName].forEach(dataType => {
        this[`layout${dataType.name}s`] = []
        this[`add${dataType.name}s`] = function (...args) { splice(this[`layout${dataType.name}s`], args, args) }
        this[`remove${dataType.name}s`] = function (...args) { splice(this[`layout${dataType.name}s`], args) }
      })
    }

    serialise () {}
    static deserialise () {}
  }

  /**
   * Representation of a binding between a scancode and a virtual key
   */
  module.KeyBinding = class KeyBinding {
    constructor (virtualKeyCode, scanCode) {
      this.virtualKeyCode = virtualKeyCode
      this.scanCode = scanCode
    }

    serialise () {}
    static deserialise () {}
    is () {}
  }

  /**
   * Char table entry for a virtual key
   */
  module.Char = class Char {
    constructor (virtualKey, flags, ...chars) {
      this.virtualKey = virtualKey
      this.flags = flags
      this.chars = chars
    }

    serialise () {}
    static deserialise () {}
    is () {}
  }

  /**
   * Ligature table entry for a virtual key
   */
  module.Ligature = class Ligature {
    constructor (virtualKey, modifierKeys, ...chars) {
      this.virtualKey = virtualKey
      this.modifierKeys = modifierKeys
      this.chars = chars

      Utils.Errors.StringLength('Expected text of length %2-%3 but received length %1', chars, 1, 4)
    }

    serialise () {}
    static deserialise () {}
    is () {}
  }

  /**
   * Dead key name table entry
   */
  module.DeadKeyName = class DeadKeyName {
    constructor (accentChar, name) {
      this.accentChar = accentChar
      this.name = name
    }

    serialise () {}
    static deserialise () {}
    is () {}
  }

  /**
   * Dead key table entry
   */
  module.DeadKey = class DeadKey {
    constructor (accentChar, baseChar, compositeChar, dead) {
      this.accentChar = accentChar
      this.baseChar = baseChar
      this.compositeChar = compositeChar
      this.dead = dead

      ;[accentChar, baseChar, compositeChar].forEach(char =>
        Utils.Errors.StringLength('Expected a single character but received text of length %1', char, 1, 1))
    }

    serialise () {}
    static deserialise () {}
    is () {}
  }
}, ['Utils', 'OKLCUtils', 'VirtualKeys'])
