module.register('DataUtils', function (module = {}, Utils = window.Utils) {
  window.DataUtils = module

  /**
   * Individual character
   */
  module.Char = class Char {
    /**
     * Creates an object representation of a UTF-16 character.
     * @param {String|Number} char - the value to construct the character from
     * @param {Boolean} dead - Set/override whether it's read as a dead (composite) keystroke.
     */
    constructor (char, dead) {
      this.dead = dead

      if (typeof char === 'string') {
        if (char.length > 1 && char.slice(-1) === '@') {
          // '@' means it's a dead key.
          // This is overridden using the 'dead' parameter in the constructor.
          if (dead === undefined) this.dead = true
          char = char.slice(0, -1)
        }
        if (char.length === 1) {
          // We're dealing with a string representation of a single character.
          this.char = char.codePointAt(0)
        } else {
          // We're dealing with a hex string.
          this.char = Utils.hex(char)
        }
      } else {
        this.char = Number(char)
      }
      if (this.dead === undefined) this.dead = false
      if (this.char < 0 || isNaN(this.char)) throw new TypeError(`${char} is not a valid character value`)
      this.codePointLength = Math.floor(this.char.toString(16).length / 4)
    }

    isDead () { return this.dead }
    toString (n) { return this.char < 0 ? String(this.char) : this.char.toString(16).padStart(n, 0) }
    toInt () { return this.char }
    getDefaultName () { return Utils.getCharName(this.char) }

    serialise () {}
    static deserialise () {}
  }
}, ['Utils'])
