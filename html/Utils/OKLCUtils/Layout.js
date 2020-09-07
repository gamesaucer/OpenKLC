module.register('Layout', function (
  module = window.OKLCUtils,
  Utils = window.Utils,
  OKLCUtils = window.OKLCUtils
) {
  const getDupeFilterFn = input => value => !input.some(o => o.is(value))
  const splice = (array, valuesToRemove, valuesToAdd = []) =>
    array.splice(0, 0, ...array.splice(0).filter(getDupeFilterFn(valuesToRemove)), ...valuesToAdd)

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

      ;[OKLCUtils.KeyBinding, OKLCUtils.CharEntry, /* OKLCUtils.Ligature, */ OKLCUtils.DeadKey, OKLCUtils.DeadKeyName]
        .forEach(dataType => {
          this[`layout${dataType.name}s`] = []
          this[`add${dataType.name}s`] = function (...args) { splice(this[`layout${dataType.name}s`], args, args) }
          this[`remove${dataType.name}s`] = function (...args) { splice(this[`layout${dataType.name}s`], args) }
        })
    }

    /* addLigatures (...args) {
      splice(this.layoutLigatures, args, args)
      args.forEach(ligature => {
        const entry = this.layoutCharEntrys
          .find(chrEnt => chrEnt.virtualKey === ligature.virtualKey) ||
          this.addCharEntrys(new OKLCUtils.CharEntry(ligature.virtualKey, OKLCUtils.AssocFlags.NONE, [], []))
        entry.chars[ligature.modifierKeys] = OKLCUtils.AssocChars.LGTR
      })
    } */

    serialise () {}
    static deserialise () {}
  }

  /**
   * Representation of a binding between a scancode and a virtual key
   */
  module.KeyBinding = class KeyBinding {
    constructor (virtualKeyCode, scanCode) {
      this.virtualKeyCode = typeof virtualKeyCode === 'string'
        ? virtualKeyCode.charCodeAt(0)
        : virtualKeyCode
      this.scanCode = scanCode
    }

    serialise () {}
    static deserialise () {}
    is () {}
  }

  /**
   * Individual character
   */
  /* module.Char = class Char {
    constructor (char, dead) {
      this.dead = dead

      if (typeof char === 'string') {
        if (char.length > 1 && char.slice(-1) === '@') {
          if (dead === undefined) this.dead = true
          char = char.slice(0, -1)
        }
        if (char.length === 1) {
          this.char = char.codePointAt(0)
        } else {
          this.char = Utils.hex(char)
        }
      } else if (typeof char === 'number') {
        this.char = char
      }
      if (this.dead === undefined) this.dead = false

      if (this.char > 0xffff) throw new RangeError(`character code ${this.char} above 2-byte limit`)
      if (this.char < 0) throw new RangeError(`character code ${this.char} below 0`)
      if (isNaN(this.char)) throw new TypeError(`${char} is not a valid character value`)
    }

    isDead () { return this.dead }
    toString (n) { return this.char < 0 ? String(this.char) : this.char.toString(16).padStart(n, 0) }
    toInt () { return this.char }

    serialise () {}
    static deserialise () {}
  } */

  /**
   * Char table entry for a virtual key
   */
  module.CharEntry = class CharEntry {
    constructor (virtualKey, flags, chars = [], sgcapchars = []) {
      this.virtualKey = typeof virtualKey === 'string'
        ? virtualKey.charCodeAt(0)
        : virtualKey
      this.flags = flags
      this.chars = chars.map(char => char instanceof OKLCUtils.Char
        ? char
        : Number(char) === -1
          ? undefined
          : new OKLCUtils.Char(char))
      this.sgcapchars = sgcapchars.map(char => char instanceof OKLCUtils.Char
        ? char
        : Number(char) === -1
          ? undefined
          : new OKLCUtils.Char(char))
    }

    serialise () {}
    static deserialise () {}
    is () {}
  }

  /**
   * Multiple characters
   */
  module.Ligature = class Ligature {
    // Ligature table entry for a virtual key
    constructor (chars/*, virtualKey, modifierKeys */) {
      Utils.Errors.StringLength('Expected text of length %2-%3 but received length %1', chars, 1, 4)
      this.chars = [...chars].map(c => new OKLCUtils.Char(c))
      // this.virtualKey = virtualKey
      // this.modifierKeys = modifierKeys
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
    constructor (accentChar, baseChar, compositeChar) {
      this.accentChar = accentChar
      this.baseChar = baseChar
      this.compositeChar = compositeChar

      // ;[accentChar, baseChar, compositeChar].forEach(char =>
      //  Utils.Errors.StringLength('Expected a single character but received text of length %1', char, 1, 1))
    }

    serialise () {}
    static deserialise () {}
    is () {}
  }
}, ['Utils', 'OKLCUtils', 'VirtualKeys'])
