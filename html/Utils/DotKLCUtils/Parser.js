module.register('DotKLCParser', function (
  module = window.DotKLCUtils,
  DotKLCUtils = window.DotKLCUtils,
  OKLCUtils = window.OKLCUtils,
  Utils = window.Utils
) {
  /* const readFile = function (blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = () => reject(reader.error)
      reader.onload = () => resolve(parseFile(
        reader.result
          .replace(/(?:\/\/|;).*$/gm, '')
          .replace(/ENDKBD. *//* s, ' ')
          .replace(/[\t ]+/g, ' ')
          .replace(/\r\n/g, '\n')
      ))
      reader.readAsText(blob)
    })
  }

  const parseFile = function (str) {
    const layoutData = {}
    str
      .split(new RegExp(`(?=${Object.keys(sectionTypes).join('|')})`))
      .map(section => section.split(/(?<=^\w+) /))
      .forEach(el => sectionTypes[el[0]](layoutData, el[1].trim()))
  }

  /* const KBD = function (dataObj, dataStr) {
    const i = dataStr.indexOf(' ')
    dataObj.name = i !== -1 ? dataStr.slice(0, i).replace(/^[ "]|[ "]$/, '') : ''
    dataObj.desc = i !== -1 ? dataStr.slice(i + 1).replace(/^[ "]|[ "]$/, '') : ''
  }

  const sectionTypes = {
    KBD
  } */

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
        modifiers: [],
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
        'MODIFIERS',
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

    set MODIFIERS (dataString) {
      this.data.modifiers = dataString
        .split('\n')
        .filter(line => line.length)
        .map(line => trimSpaceNQuote(line.trim()))
    }

    set SHIFTSTATE (dataString) {
      this.data.shiftstate = dataString
        .split('\n')
        .filter(line => line.length)
        .map(line => Utils.hex(line.trim()))
    }

    set LAYOUT (dataString) {
      // ERROR for ligatures
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
          new OKLCUtils.Char(field)
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
        .map(line => line.split(' '))
        .map(line => ({
          vk: line[0],
          flags: line[1],
          chars: line.slice(3).map(field => new OKLCUtils.Char(field, false))
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

      const key = new OKLCUtils.Char(lines.splice(0, 1)[0][0], false)

      const combos = lines.map(pair => {
        return [
          new OKLCUtils.Char(pair[0], false),
          new OKLCUtils.Char(pair[1])
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

    get MODIFIERS_STRING () { return '' } // TODO: what are modifiers even?
    get SHIFTSTATE_STRING () {
      return this.data.shiftstate.length
        ? `SHIFTSTATE\r\n\r\n${this.data.shiftstate.map(state =>
            new OKLCUtils.Char(state).toString(1)).join('\r\n')}`
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
              ...row.chars.map(char => char.toString(4) + (char.isDead() ? '@' : ''))
              ].join('\t')

              if (row.sgcap) {
                str += '\r\n'
                str += [
                  '-1',
                  '-1',
                  '0',
                  ...row.sgchars.map(char => char.toString(4) + (char.isDead() ? '@' : ''))
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
            new OKLCUtils.Char(pair[0]).toString(2)
          }\t${
            addOptionalQuotes(pair[1])
          }`).join('\r\n')}`
        : ''
    }

    get KEYNAME_EXT_STRING () {
      return this.data.keyname_ext.length
        ? `KEYNAME_EXT\r\n\r\n${this.data.keyname_ext.map(pair => `${
            new OKLCUtils.Char(Utils.hex(pair[0])).toString(2)
          }\t${
            addOptionalQuotes(pair[1])
          }`).join('\r\n')}`
        : ''
    }

    get KEYNAME_DEAD_STRING () {
      return this.data.keyname_dead.length
        ? `KEYNAME_DEAD\r\n\r\n${this.data.keyname_dead.map(pair => `${
            new OKLCUtils.Char(Utils.hex(pair[0])).toString(4)
          }\t${
            addOptionalQuotes(pair[1])
          }`).join('\r\n')}`
        : ''
    }

    get DEADKEY_STRING () {
      return Object
        .entries(this.data.deadkeys)
        .map(pair => `DEADKEY\t${
          new OKLCUtils.Char(Utils.hex(pair[0])).toString(4)
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
            new OKLCUtils.Char(Utils.hex(pair[0])).toString(4)
          }\t${
            pair[1]
          }`).join('\r\n')}`
        : ''
    }

    get LANGUAGENAMES_STRING () {
      return this.data.languagenames.length
        ? `LANGUAGENAMES\r\n\r\n${this.data.languagenames.map(pair => `${
            new OKLCUtils.Char(Utils.hex(pair[0])).toString(4)
          }\t${
            pair[1]
          }`).join('\r\n')}`
        : ''
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
      return [
        ...this.keywords
          .map(kw => this[`${kw}_STRING`])
          .filter(section => section.length),
        'ENDKBD'
      ].join('\r\n\r\n')
      /* return [...this.keywords.map(kw => {
        const val = this[kw]

        // Strings can be immediately returned.
        if (typeof val === 'string') return `${kw}\t${val}`

        // Numbers are turned into strings.
        if (typeof val === 'number') return `${kw}\t${val.toString(16).padStart(4, 0)}`

        // Arrays get turned into tables.
        // Rows are separated by newlines.
        if (val instanceof Array) {
          if (!val.length) return ''
          return `${kw}\r\n\r\n${val
            .map(row => {
              // Strings and numbers idem ditto
              if (typeof row === 'string') return row
              if (typeof row === 'number') return row.toString(16).padStart(4, 0)

              // Cols are separated by tabs.
              if (row instanceof Array) {
                return row
                  .map(col => {
                    // Strings and numbers idem ditto
                    if (typeof col === 'string') return col
                    if (typeof col === 'number') return col.toString(16).padStart(4, 0)

                    // Chars need to be correctly marked as dead
                    if (col instanceof OKLCUtils.Char) return col.toString(4) + (col.isDead() ? '@' : '')
                  })
                  .join('\t')
              }

              // Rows for layout table
              let str = [
                row.scancode.toString(16).padStart(2, 0),
                row.vk,
                row.sgcap || row.capsflags,
                ...row.chars.map(char => char.toString(4) + (char.isDead() ? '@' : ''))
              ].join('\t')

              if (row.sgcap) {
                str += '\r\n' + [
                  '-1',
                  '-1',
                  '0',
                  ...row.sgchars.map(char => char.toString(4) + (char.isDead() ? '@' : ''))
                ].join('\t')
              }

              return str
            })
            .join('\r\n')}`
        }

        // Exclusive to dead keys, each of which is basically its own section
        return Object.keys(val).map(key => {
          return `${kw}\t${key}\r\n\r\n${val[key].map(row => row
            .map(col => col.toString(4) + (col.isDead() ? '@' : ''))
            .join('\t')
          ).join('\r\n')}`
        }).join('\r\n\r\n')
      }),
      'ENDKBD'
      ].join('\r\n\r\n') */
    }

    toLayout () {
      const instance = new OKLCUtils.Layout()
      return instance
    }
  }

  module.fromString = KLC.fromString
  module.fromLayout = KLC.fromLayout
}, ['OKLCUtils', 'Utils', 'DotKLCUtils'])
