module.register('DotKLCParser', function (
  module = window.DotKLCUtils,
  DotKLCUtils = window.DotKLCUtils,
  // OKLCUtils = window.OKLCUtils,
  Utils = window.Utils,
  DataUtils = window.DataUtils
) {
  const trimSpaceNQuote = str => str.replace(/^[ "]|[ "]$/g, '')
  const addOptionalQuotes = str => str.includes(' ') ? `"${str}"` : str
  const escapeSpecialChars = str => str
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/ /g, '\\s')
    .replace(/\0/g, '\\0')

  const KLC = class KLC {
    constructor () {
      this.data = {
        company: '',
        copyright: '',
        localeid: '',
        localename: '',
        version: '',
        name: '',
        description: '',
        keyname: [],
        keyname_ext: [],
        keyname_dead: [],
        shiftstate: [],
        ligature: [],
        attributes: [],
        deadkeys: {},
        descriptions: [],
        languagenames: [],
        layout: []
      }

      this.keywords = [
        'KBD',
        'VERSION',
        'COPYRIGHT',
        'COMPANY',
        'LOCALEID',
        'LOCALENAME',
        'SHIFTSTATE',
        'ATTRIBUTES',
        'LAYOUT',
        'DEADKEY',
        'LIGATURE',
        'KEYNAME',
        'KEYNAME_EXT',
        'KEYNAME_DEAD',
        'DESCRIPTIONS',
        'LANGUAGENAMES'
      ]
    }

    // get NAME () { return this.data.name }
    // get DESCRIPTION () { return this.data.description }
    set COPYRIGHT (dataString) { this.data.copyright = trimSpaceNQuote(dataString.trim()) }
    set COMPANY (dataString) { this.data.company = trimSpaceNQuote(dataString.trim()) }
    set VERSION (dataString) { this.data.version = trimSpaceNQuote(dataString.trim()) }
    set LOCALENAME (dataString) { this.data.localename = trimSpaceNQuote(dataString.trim()) }
    set LOCALEID (dataString) { this.data.localeid = trimSpaceNQuote(dataString.trim()).padStart(8, 0) }

    set KBD (dataString) {
      dataString = dataString.trim()
      const i = dataString.indexOf(' ')
      this.data.name = i !== -1 ? trimSpaceNQuote(dataString.slice(0, i)) : ''
      this.data.description = i !== -1 ? trimSpaceNQuote(dataString.slice(i + 1)) : ''
    }

    set SHIFTSTATE (dataString) {
      this.data.shiftstate = dataString
        .split('\n')
        .filter(line => line.length)
        .map(line => Utils.hex(line.trim()))
    }

    set LAYOUT (dataString) {
      const lines = dataString
        .split('\n')
        .filter(line => line.length)
        .map(line => line
          .split(' ')
          .filter(col => col.length))

      for (const i in lines) {
        const line = lines[i]
        const lineData = {
          scancode: line[0],
          vk: line[1],
          capsflags: 0,
          sgcap: false,
          chars: [],
          sgchars: []
        }

        lineData.chars.push(...line.slice(3).map(field =>
          field === '-1' || field === '%%'
            ? field
            : new DataUtils.Char(field)
        ))

        if (line[2] === 'SGCap') {
          lineData.sgcap = true
        } else if (line[2] === '-1' && lines[i - 1] && lines[i - 1].sgcap) {
          lines[i - 1].sgchars = lineData.chars
        } else {
          lineData.capsflags = Utils.hex(line[2])
        }

        lines[i] = lineData
      }

      this.data.layout = lines
        .filter(line => line.chars.length || line.sgchars.length)
        .filter((line, i, arr) => arr.findIndex(line2 => line.vk === line2.vk) === i)
    }

    set LIGATURE (dataString) {
      this.data.ligature = dataString
        .split('\n')
        .filter(line => line.length)
        .map(line => line.trim().split(' '))
        .map(line => ({
          vk: line[0],
          flags: line[1],
          chars: line.slice(2).map(field => new DataUtils.Char(field, false))
        }))
    }

    set ATTRIBUTES (dataString) {
      this.data.attributes = dataString
        .split('\n')
        .filter(line => line.length)
        .map(line => line.trim())
    }

    set KEYNAME (dataString) {
      this.data.keyname = dataString
        .split('\n')
        .filter(line => line.length)
        .map(line => line
          .trim()
          .split(/(?<=^[^ ]*) /)
          .map(col => trimSpaceNQuote(col)))
        .map(line => [Utils.hex(line[0]), line[1]])

      if (!this.data.keyname.length) this.data.keyname = Object.defineProperties(DotKLCUtils.keyNames)
    }

    set KEYNAME_EXT (dataString) {
      this.data.keyname_ext = dataString
        .split('\n')
        .filter(line => line.length)
        .map(line => line
          .trim()
          .split(/(?<=^[^ ]*) /)
          .map(col => trimSpaceNQuote(col)))
        .map(line => [Utils.hex(line[0]), line[1]])

      if (!this.data.keyname_ext.length) this.data.keyname_ext = Object.defineProperties(DotKLCUtils.keyNamesExt)
    }

    set KEYNAME_DEAD (dataString) {
      this.data.keyname_dead = dataString
        .split('\n')
        .filter(line => line.length)
        .map(line => line
          .trim()
          .split(/(?<=^[^ ]*) /)
          .map(col => trimSpaceNQuote(col)))
        .map(line => [Utils.hex(line[0]), line[1]])
    }

    set DEADKEY (dataString) {
      const lines = dataString
        .split('\n')
        .filter(line => line.length)
        .map(line => line.split(' '))

      const key = new DataUtils.Char(lines.splice(0, 1)[0][0], false)

      const combos = lines.map(pair => {
        return [
          new DataUtils.Char(pair[0], false),
          new DataUtils.Char(pair[1])
        ]
      })
      this.data.deadkeys[key] = combos
    }

    set DESCRIPTIONS (dataString) {
      this.data.descriptions = dataString
        .split('\n')
        .filter(line => line.length)
        .map(line => line
          .trim()
          .split(/(?<=^[^ ]*) /)
          .map(col => trimSpaceNQuote(col)))
        .map(line => [Utils.hex(line[0]), line[1]])
    }

    set LANGUAGENAMES (dataString) {
      this.data.languagenames = dataString
        .split('\n')
        .filter(line => line.length)
        .map(line => line
          .trim()
          .split(/(?<=^[^ ]*) /)
          .map(col => trimSpaceNQuote(col)))
        .map(line => [Utils.hex(line[0]), line[1]])
    }

    get COPYRIGHT_STRING () { return `COPYRIGHT\t${addOptionalQuotes(this.data.copyright)}` }
    get COMPANY_STRING () { return `COMPANY\t${addOptionalQuotes(this.data.company)}` }
    get VERSION_STRING () { return `VERSION\t${addOptionalQuotes(this.data.version)}` }
    get LOCALENAME_STRING () { return `LOCALENAME\t${addOptionalQuotes(this.data.localename)}` }
    get LOCALEID_STRING () { return `LOCALEID\t${addOptionalQuotes(this.data.localeid)}` }
    get KBD_STRING () {
      return `KBD\t${
      addOptionalQuotes(this.data.name)
    }\t${
      addOptionalQuotes(this.data.description)
    }`
    }

    get SHIFTSTATE_STRING () {
      return this.data.shiftstate.length
        ? `SHIFTSTATE\r\n\r\n${this.data.shiftstate.map(state =>
            new DataUtils.Char(state).toString(1)).join('\r\n')}`
        : ''
    }

    get LAYOUT_STRING () {
      return this.data.layout.length
        ? `LAYOUT\r\n\r\n${
            this.data.layout.map(row => {
              let str = [
              row.scancode,
              row.vk,
              row.sgcap ? 'SGCap' : row.capsflags,
              ...row.chars.map(char => char instanceof DataUtils.Char
                ? char.toString(4) + (char.isDead() ? '@' : '')
                : char)
              ].join('\t')

              if (row.sgcap) {
                str += '\r\n'
                str += [
                  '-1',
                  '-1',
                  '0',
                  ...row.sgchars.map(char => char instanceof DataUtils.Char
                    ? char.toString(4) + (char.isDead() ? '@' : '')
                    : '')
                ].join('\t')
              }

              return str
            }
            ).join('\r\n')
          }`
        : ''
    }

    get LIGATURE_STRING () {
      return this.data.ligature.length
        ? `LIGATURE\r\n\r\n${
            this.data.ligature.map(row => {
              return [
              row.vk,
              row.flags,
              ...row.chars.map(char => char.toString(4) + (char.isDead() ? '@' : ''))
              ].join('\t')
            }
            ).join('\r\n')
          }`
        : ''
    }

    get ATTRIBUTES_STRING () {
      return this.data.attributes.length
        ? `ATTRIBUTES\r\n\r\n${this.data.attributes.join('\r\n')}`
        : ''
    }

    get KEYNAME_STRING () {
      return this.data.keyname.length
        ? `KEYNAME\r\n\r\n${this.data.keyname.map(pair => `${
            new DataUtils.Char(pair[0]).toString(2)
          }\t${
            addOptionalQuotes(pair[1])
          }`).join('\r\n')}`
        : ''
    }

    get KEYNAME_EXT_STRING () {
      return this.data.keyname_ext.length
        ? `KEYNAME_EXT\r\n\r\n${this.data.keyname_ext.map(pair => `${
            new DataUtils.Char(Utils.hex(pair[0])).toString(2)
          }\t${
            addOptionalQuotes(pair[1])
          }`).join('\r\n')}`
        : ''
    }

    get KEYNAME_DEAD_STRING () {
      return this.data.keyname_dead.length
        ? `KEYNAME_DEAD\r\n\r\n${this.data.keyname_dead.map(pair => `${
            new DataUtils.Char(Utils.hex(pair[0])).toString(4)
          }\t${
            addOptionalQuotes(pair[1])
          }`).join('\r\n')}`
        : ''
    }

    get DEADKEY_STRING () {
      return Object
        .entries(this.data.deadkeys)
        .map(pair => `DEADKEY\t${
          new DataUtils.Char(Utils.hex(pair[0])).toString(4)
        }\r\n\r\n${
          pair[1].map(pair2 => [
            ...pair2.map(char => char.toString(4)),
            '//',
            pair2.map(char => escapeSpecialChars(String.fromCodePoint(char.toInt()))).join('\t->\t')
            ].join('\t')
           ).join('\r\n')
        }`).join('\r\n\r\n')
    }

    get DESCRIPTIONS_STRING () {
      return this.data.descriptions.length
        ? `DESCRIPTIONS\r\n\r\n${this.data.descriptions.map(pair => `${
            new DataUtils.Char(Utils.hex(pair[0])).toString(4)
          }\t${
            pair[1]
          }`).join('\r\n')}`
        : ''
    }

    get LANGUAGENAMES_STRING () {
      return this.data.languagenames.length
        ? `LANGUAGENAMES\r\n\r\n${this.data.languagenames.map(pair => `${
            new DataUtils.Char(Utils.hex(pair[0])).toString(4)
          }\t${
            pair[1]
          }`).join('\r\n')}`
        : ''
    }

    verify () {
      // throw new Error('Not yet implemented!')
      const errors = []
      if (this.data.name.length === 0) errors.push('Name must not be blank!')
      if (this.data.name.length > 8)errors.push('Name must not be longer than 8 characters!')
      if (this.data.name.includes(' ')) errors.push('Name must not include spaces!')
      if (this.data.name.match(/[^\s\x20-\x7e]/)) errors.push('Name must be ascii!')
      if (this.data.name[0] === '"') errors.push('First character of name cannot be a double quote!')

      if (this.data.description.length === 0) errors.push('Description must not be blank!')
      if (this.data.description.length > 233) errors.push('Description must not be longer than 233 characters!')
      if (this.data.description[0] === '"') errors.push('First character of description cannot be a double quote!')

      if (this.data.company.length === 0) errors.push('Company must not be blank!')
      if (this.data.company.length > 233) errors.push('Company must not be longer than 255 characters!')
      if (this.data.company[0] === '"') errors.push('First character of company cannot be a double quote!')

      if (this.data.copyright.length > 233) errors.push('Copyright must not be longer than 255 characters!')
      if (this.data.copyright[0] === '"') errors.push('First character of copyright cannot be a double quote!')

      if (this.data.ligature.some(l => l.chars.reduce((acc, char) => acc + char.codePointLength, 0) > 4)) {
        errors.push('Ligatures must not have more than 4 UTF-16 code points!')
      }

      if (Object.keys(this.data.deadkeys).some(char => Utils.hex(char) === 0)) {
        errors.push('Dead keys combiners must not be null!')
      }
      if (Object.values(this.data.deadkeys).some(char => char.some(pair => pair[1].toInt() === 0))) {
        errors.push('Dead keys base characters must not be null!')
      }

      if (!this.data.layout.find(row => row.vk === 'DECIMAL')) { errors.push('VK_DECIMAL must be defined!') }
      if (!this.data.layout.find(row => row.vk === 'SPACE')) { errors.push('VK_SPACE must be defined!') }
      if (this.data.layout.some((row, i, arr) => arr.findIndex(row2 => row.scancode === row2.scancode) !== i)) {
        errors.push('Duplicate scancodes are not allowed!')
      }

      if (errors.length > 0) {
        throw new Error('\n' + errors.join('\t\n'))
      }
    }

    static fromLayout (layout) {
      const instance = new KLC()
      return instance
    }

    static fromString (string) {
      const instance = new KLC()
      string
        .replace(/(?:\/\/|;).*$/gm, '')
        .replace(/ENDKBD. */s, ' ')
        .replace(/[\t ]+/g, ' ')
        .replace(/\r\n/g, '\n')
        .split(new RegExp(`(?=${instance.keywords.join('|')})`))
        .map(section => section.split(/(?<=^\w+)\s/))
        .forEach(el => { instance[el[0]] = el[1].trim() })
      return instance
    }

    toString () {
      this.verify()
      return [
        ...this.keywords
          .map(kw => this[`${kw}_STRING`])
          .filter(section => section.length),
        'ENDKBD'
      ].join('\r\n\r\n')
    }

    /* toLayout () {
      const instance = new OKLCUtils.Layout()
      return instance
    } */
  }

  module.fromString = KLC.fromString
  module.fromLayout = KLC.fromLayout
}, ['DataUtils', 'Utils', 'DotKLCUtils'])
