module.register('.KLC', function (
  module = window.ExportUtils,
  ExportUtils = window.ExportUtils,
  OKLCUtils = window.OKLCUtils
) {
  /**
   * Enum for modifier key flags exclusive to KLC
   * @enum {Number}
   */
  module.KLCModFlags = {
    NONE: 0x00,
    SHIFT: 0x01,
    CTRL: 0x02,
    ALT: 0x04
  }

  module.KLCKeyNames = {
    0x01: 'Esc',
    0x0e: 'Backspace',
    0x0f: 'Tab',
    0x1c: 'Enter',
    0x1d: 'Ctrl',
    0x2a: 'Shift',
    0x36: 'Right Shift',
    0x37: 'Num *',
    0x38: 'Alt',
    0x39: 'Space',
    0x3a: 'Caps Lock',
    0x3b: 'F1',
    0x3c: 'F2',
    0x3d: 'F3',
    0x3e: 'F4',
    0x3f: 'F5',
    0x40: 'F6',
    0x41: 'F7',
    0x42: 'F8',
    0x43: 'F9',
    0x44: 'F10',
    0x45: 'Pause',
    0x46: 'Scroll Lock',
    0x47: 'Num 7',
    0x48: 'Num 8',
    0x49: 'Num 9',
    0x4a: 'Num -',
    0x4b: 'Num 4',
    0x4c: 'Num 5',
    0x4d: 'Num 6',
    0x4e: 'Num +',
    0x4f: 'Num 1',
    0x50: 'Num 2',
    0x51: 'Num 3',
    0x52: 'Num 0',
    0x53: 'Num Del',
    0x54: 'Sys Req',
    0x57: 'F11',
    0x58: 'F12',
    0x7c: 'F13',
    0x7d: 'F14',
    0x7e: 'F15',
    0x7f: 'F16',
    0x80: 'F17',
    0x81: 'F18',
    0x82: 'F19',
    0x83: 'F20',
    0x84: 'F21',
    0x85: 'F22',
    0x86: 'F23',
    0x87: 'F24'
  }

  module.KLCKeyNamesExt = {
    0x1c: 'Num Enter',
    0x1d: 'Right Ctrl',
    0x35: 'Num /',
    0x37: 'Prnt Scrn',
    0x38: 'Right Alt',
    0x45: 'Num Lock',
    0x46: 'Break',
    0x47: 'Home',
    0x48: 'Up',
    0x49: 'Page Up',
    0x4b: 'Left',
    0x4d: 'Right',
    0x4f: 'End',
    0x50: 'Down',
    0x51: 'Page Down',
    0x52: 'Insert',
    0x53: 'Delete',
    0x54: '<00>',
    0x56: 'Help',
    0x5b: 'Left Windows',
    0x5c: 'Right Windows',
    0x5d: 'Application'
  }

  /**
   * Creates a .KLC file
   * @param {Layout} layout
   */
  module.KLC = function (layout) {
    // TODO there are likely additional contstrains on the name.
    // Probably generally applicable as well, not just to the KLC format.
    /* if (layout.metadata.desc.includes('"')) {
      throw new TypeError('Description may not contain a double quote character')
    } */

    const getKeynames = o => Object
      .entries(o)
      .map(el => [el[0], `"${el[1]}"`])
      .reduce((a, c) => { a[c[0].toString(16).padStart(2, 0)] = c[1]; return a }, {})

    const getVKName = o => Object
      .keys(OKLCUtils.VirtualKeys)
      .find(vk => OKLCUtils.VirtualKeys[vk] === o) || typeof o === 'string' ? o : String.fromCodePoint(o)

    const modFlags = layout.layoutCharEntrys
      .reduce((acc, cur) => {
        cur.chars.forEach((v, i) => { acc[i] = acc[i] || v })
        cur.sgcapchars.forEach((v, i) => { acc[i] = acc[i] || v })
        return acc
      }, [])
      .map((v, i) => v ? i : null)
      .filter(v => v !== null)

    const KLCModFlags = [...modFlags].map(v => (v & OKLCUtils.ModFlags.ALT) !== (v & OKLCUtils.ModFlags.CTRL) >>> 1
      ? v ^ (OKLCUtils.ModFlags.ALT | OKLCUtils.ModFlags.CTRL)
      : v)

    const mapCharToShiftStates = (obj, arr) => modFlags.map(v => {
      const char = arr[v]
      if (!char /* || char.toInt() === OKLCUtils.AssocChars.NONE */) return '-1'
      if (char instanceof OKLCUtils.Ligature) {
        ligatures.push([getVKName(obj.virtualKey), v, char.chars.map(char => char.toString(4))])
        return '%%'
      }
      // if (char.toInt() === OKLCUtils.AssocChars.LGTR) return '%%'
      return char.toString(4) + (char.isDead() ? '@' : '')
    })

    const ligatures = []
    /* const ligatures = layout.layoutLigatures
      .map(lig => [lig, (lig.modifierKeys & OKLCUtils.ModFlags.ALT) !== (lig.modifierKeys & OKLCUtils.ModFlags.CTRL) >>> 1
        ? lig.modifierKeys ^ (OKLCUtils.ModFlags.ALT | OKLCUtils.ModFlags.CTRL)
        : lig.modifierKeys])
      .map(ligArr => [
        getVKName(ligArr[0].virtualKey),
        ligArr[1],
        ...ligArr[0].chars.map(char => char.toString(4))
      ]) */

    const layoutData = layout.layoutCharEntrys
      .map(char => [layout.layoutKeyBindings.find(bnd => bnd.virtualKeyCode === char.virtualKey), char])
      .filter(o => o[0])
      .map(o => {
        const chars = [
          o[0].scanCode.toString(16).padStart(2, 0),
          getVKName(o[1].virtualKey),
          o[1].flags,
          ...mapCharToShiftStates(o[1], o[1].chars)
        ]
        if (o[1].sgcapchars.length) {
          chars.push('\n-1', '-1', '0', ...mapCharToShiftStates(o[1], o[1].sgcapchars).slice(0, 2))
          chars[2] = 'SGCap'
        }
        return chars
      })

    const data = []
    data.push(['KBD', layout.metadata.kbd, `"${layout.metadata.desc}"`])
    data.push(['COPYRIGHT', `"${layout.metadata.copyright}"`])
    data.push(['COMPANY', `"${layout.metadata.author}"`])
    data.push(['LOCALENAME', `"${layout.metadata.localename.join('-')}"`])
    data.push(['LOCALEID', `"${layout.metadata.localeid.toString(16).padStart(8, 0)}"`])
    data.push(['VERSION', layout.metadata.version.join('.')])
    data.push(['SHIFTSTATE', KLCModFlags.reduce((p, c) => { p[c] = null; return p }, {})])
    data.push(['LAYOUT', layoutData])
    data.push(['LIGATURE', ligatures])
    data.push(['DEADKEY', []])
    data.push(['KEYNAME', getKeynames(ExportUtils.KLCKeyNames)])
    data.push(['KEYNAME_EXT', getKeynames(ExportUtils.KLCKeyNamesExt)])
    data.push(['KEYNAME_DEAD', []])
    data.push(['DESCRIPTIONS', { '0409': layout.metadata.desc }])
    data.push(['LANGUAGENAMES', { '0409': 'English (United States)' /* TODO get language from locale */ }])
    data.push(['ENDKBD', null])

    /* let fileStr =
      `KBD\t${layout.metadata.kbd}\t"${layout.metadata.desc}"\r\n\r\n` +
      `COPYRIGHT\t"${layout.metadata.copyright}"\r\n\r\n` +
      `COMPANY\t"${layout.metadata.author}"\r\n\r\n` +
      `LOCALENAME\t"${layout.metadata.localename.join('-')}"\r\n\r\n` +
      `LOCALEID\t"${layout.metadata.localeid.toString(16).padStart(8, 0)}"\r\n\r\n` +
      `VERSION\t${layout.metadata.version.join('.')}\r\n\r\n`

    const attribs = Object
      .entries(OKLCUtils.AttribFlags)
      .filter(flag => layout.attributes & flag[1])
      .map(flag => flag[0])
      .join('\r\n')

    if (attribs) fileStr += `ATTRIBUTES\r\n${attribs}\r\n\r\n`

    /* const shiftstates = [0, 1, 4, 5, 2, 3, 6, 7]
      .map((v, i) => [v, i])
      .filter(state => layout.layoutCharEntrys.some(charEnt =>
        charEnt.chars.some((_, i) => i === state[1]) ||
        charEnt.sgcapchars.some((_, i) => i === state[1])
      ))

    fileStr +=
      `SHIFTSTATE\r\n\r\n${shiftstates.map(o => o[0]).join('\r\n')}\r\n\r\n` +
      'LAYOUT\r\n\r\n'

    const mapToShiftstates = (arr, states = shiftstates.map(o => o[1]).sort((a, b) => a - b)) =>
      states.map(i => {
        if (!arr[i] || arr[i] === OKLCUtils.AssocChars.NONE) return '-1'
        if (arr[i][1] === '@') return `${arr[i].codePointAt(0).toString(16).padStart(4, 0)}@`
        if (arr[i] === OKLCUtils.AssocChars.LGTR) return '%%'
        return arr[i].codePointAt(0).toString(16).padStart(4, 0)
      })
    const tableData = layout.layoutCharEntrys
      .map(char => ({ bind: layout.layoutKeyBindings.find(bnd => bnd.virtualKeyCode === char.virtualKey), char }))
      .filter(o => o.bind)
      .flatMap(o => {
        const rows = [[
          o.bind.scanCode.toString(16).padStart(2, 0),
          Object.keys(OKLCUtils.VirtualKeys).find(vk => OKLCUtils.VirtualKeys[vk] === o.char.virtualKey) ||
           String.fromCodePoint(o.char.virtualKey),
          o.char.flags,
          ...mapToShiftstates(o.char.chars)
        ]]

        if (o.char.sgcapchars.length) {
          rows[0][2] = 'SGCap'
          rows.push([-1, -1, 0, ...mapToShiftstates(o.char.sgcapchars)].slice(0, 2))
        }
        return rows
      })

    fileStr += tableData.map(data => data.join('\t')).join('\r\n') + '\r\n\r\n' */

    // fileStr += 'ENDKBD\r\n'

    // return fileStr
    return data
  }
}, ['ExportUtils', 'OKLCUtils', 'VirtualKeys'])
