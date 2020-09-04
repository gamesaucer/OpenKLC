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
      // .reduce((a, c) => { a[c[0].toString(16).padStart(2, 0)] = c[1]; return a }, {})

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
      if (!char) return '-1'
      if (char instanceof OKLCUtils.Ligature) {
        ligatures.push([getVKName(obj.virtualKey), v, char.chars.map(char => char.toString(4))])
        return '%%'
      }
      return char.toString(4) + (char.isDead() ? '@' : '')
    })

    const ligatures = []
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

    const deadKeyData = {}
    layout.layoutDeadKeys.forEach(deadKey => {
      const key = deadKey.accentChar.toString(4)
      if (!deadKeyData[key]) deadKeyData[key] = {}
      const obj = deadKeyData[key]
      obj[deadKey.baseChar.toString(4)] =
        deadKey.compositeChar.toString(4) +
        (deadKey.compositeChar.isDead() ? '@' : '')
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
    // data.push(['DEADKEY', []])
    data.push(...Object.entries(deadKeyData).map(v => ['DEADKEY', ...v]))
    data.push(['KEYNAME', getKeynames(ExportUtils.KLCKeyNames)])
    data.push(['KEYNAME_EXT', getKeynames(ExportUtils.KLCKeyNamesExt)])
    data.push(['KEYNAME_DEAD', []]) // TODO
    data.push(['DESCRIPTIONS', [['0409', layout.metadata.desc]]])
    data.push(['LANGUAGENAMES', [['0409', 'English (United States)']]])
    data.push(['ENDKBD', null])

    return [data, data.map(items => // items.join('\t')
      items.map(item => {
        if (item === null) return ''
        if (typeof item !== 'object') return item
        try {
          return item.map(itemdata => {
            if (typeof itemdata !== 'object') return itemdata
            return itemdata.join('\t')
          }).join('\r\n')
        } catch (err) { console.log(item, err) }
      }
      ).join('\t')
    ).join('\r\n\r\n')]

    return data
  }
}, ['ExportUtils', 'OKLCUtils', 'VirtualKeys'])
