
class Key {
  constructor (scancode = null, w = 1, label = null, mappable = true, toggle = false) {
    this.scancode = scancode
    this.w = w
    this.label = label
    this.mappable = mappable
    this.toggle = toggle
  }

  toElement () {
    const button = document.createElement('button')
    button.setAttribute('data-sc', this.scancode)
    button.setAttribute('data-remap', this.mappable)
    button.setAttribute('data-toggle', this.toggle)
    button.disabled = !this.mappable
    button.className = `key ${this.mappable ? 'editable' : 'system'} sc-${this.scancode}`
    if (this.label) {
      button.appendChild(document.createTextNode(this.label))
    } else {
      for (let i = 0; i < 4; i++) {
        const gridEl = document.createElement('div')
        gridEl.className = `keyPreview sc-${this.scancode} cell${i}`
        button.appendChild(gridEl)
      }
    }

    return button
  }
}

class Keyboard {
  constructor (keyTable = []) {
    this.keyTable = keyTable
  }

  toElement () {
    const grid = document.createElement('div')
    grid.className = 'keyboard'

    let maxWidth = 0
    this.keyTable.forEach((row, rowIndex) => {
      let i = 1
      row.forEach(col => {
        if (col.scancode !== null) {
          const key = col.toElement()
          key.style.gridColumnStart = i
          key.style.gridColumnEnd = i + col.w * 4
          key.style.gridRowStart = rowIndex + 1
          key.style.gridRowEnd = rowIndex + 2
          grid.appendChild(key)
        }
        i += col.w * 4
      })
      maxWidth = Math.max(maxWidth, i)
    })
    grid.style.display = 'grid'
    grid.style.gridTemplateColumns = ''
    grid.style.gridTemplateRows = ''
    for (let i = 1; i < maxWidth; i++) { grid.style.gridTemplateColumns += ' 1fr ' }
    for (let i = 1; i <= this.keyTable.length; i++) { grid.style.gridTemplateRows += ' 1fr ' }

    return grid
  }
}

const SC = {
  ESC: 0x00,
  1: 0x02,
  2: 0x03,
  3: 0x04,
  4: 0x05,
  5: 0x06,
  6: 0x07,
  7: 0x08,
  8: 0x09,
  9: 0x0a,
  0: 0x0b,
  '-': 0x0c,
  '=': 0x0d,
  BACKSPACE: 0x0d,
  TAB: 0x0f,
  Q: 0x10,
  W: 0x11,
  E: 0x12,
  R: 0x13,
  T: 0x14,
  Y: 0x15,
  U: 0x16,
  I: 0x17,
  O: 0x18,
  P: 0x19,
  '[': 0x1a,
  ']': 0x1b,
  ENTER: 0x1c,
  LCTRL: 0x1d,
  A: 0x1e,
  S: 0x1f,
  D: 0x20,
  F: 0x21,
  G: 0x22,
  H: 0x23,
  J: 0x24,
  K: 0x25,
  L: 0x26,
  ';': 0x27,
  '\'': 0x28,
  '`': 0x29,
  LSHIFT: 0x2a,
  '\\': 0x2b,
  Z: 0x2c,
  X: 0x2d,
  C: 0x2e,
  V: 0x2f,
  B: 0x30,
  N: 0x31,
  M: 0x32,
  ',': 0x33,
  '.': 0x34,
  '/': 0x35,
  RSHIFT: 0x36,
  'NUM*': 0x37,
  LALT: 0x38,
  ' ': 0x39,
  CAPSLOCK: 0x3a,
  F1: 0x3b,
  F2: 0x3c,
  F3: 0x3d,
  F4: 0x3e,
  F5: 0x3f,
  F6: 0x40,
  F7: 0x41,
  F8: 0x42,
  F9: 0x43,
  F10: 0x44,
  SCROLLLOCK: 0x46,
  NUM7: 0x47,
  NUM8: 0x48,
  NUM9: 0x49,
  'NUM-': 0x4a,
  NUM4: 0x4b,
  NUM5: 0x4c,
  NUM6: 0x4d,
  'NUM+': 0x4e,
  NUM1: 0x4f,
  NUM2: 0x50,
  NUM3: 0x51,
  NUM0: 0x52,
  'NUM.': 0x53,
  '\\|': 0x56,
  F11: 0x57,
  F12: 0x58,

  KANA: 0x70,
  '\\_': 0x73,
  HENKAN: 0x79,
  MUHENKAN: 0x7b,
  '¥|': 0x7d,

  // PRTSCRN: 0x0e37
  NUM_ENTER: 0xe01c,
  RCTRL: 0xe01d,
  FAKE_LSHIFT: 0xe02a,
  'NUM/': 0xe035,
  FAKE_RSHIFT: 0xe036,
  PRTSCN: 0xe037,
  RALT: 0xe038,
  NUMLOCK: 0xe045,
  BREAK: 0xe046,
  HOME: 0xe047,
  UP: 0xe048,
  PGUP: 0xe049,
  LEFT: 0xe04b,
  RIGHT: 0xe04d,
  END: 0xe04f,
  DOWN: 0xe050,
  PGDN: 0xe051,
  INSERT: 0xe052,
  DELETE: 0xe053,

  LWIN: 0xe05b,
  RWIN: 0xe05c,
  MENU: 0xe05d
}

const LAYOUT_EUR = [
  [SC.ESC, null, SC.F1, SC.F2, SC.F3, SC.F4, null, SC.F5, SC.F6, SC.F7, SC.F8, null, SC.F9, SC.F10, SC.F11, SC.F12],
  [SC['`'], SC['1'], SC['2'], SC['3'], SC['4'], SC['5'], SC['6'], SC['7'], SC['8'], SC['9'], SC['0'], SC['-'], SC['='], SC.BACKSPACE],
  [SC.TAB, SC.Q, SC.W, SC.E, SC.R, SC.T, SC.Y, SC.U, SC.I, SC.O, SC.P, SC['['], SC[']'], SC.ENTER],
  [SC.CAPSLOCK, SC.A, SC.S, SC.D, SC.F, SC.G, SC.H, SC.J, SC.K, SC.L, SC[';'], SC['\''], SC['\\'], SC.ENTER],
  [SC.LSHIFT, SC['\\|'], SC.Z, SC.X, SC.C, SC.V, SC.B, SC.N, SC.M, SC[','], SC['.'], SC['/'], SC.LSHIFT],
  [SC.LCTRL, SC.LWIN, SC.LALT, SC[' '], SC.RALT, SC.RWIN, SC.MENU, SC.RCTRL]
].map(row => row.map(col => new Key(col)))

LAYOUT_EUR[0][0].label = 'Esc'
LAYOUT_EUR[0][1].w = 0.75
LAYOUT_EUR[0][2].label = 'F1'
LAYOUT_EUR[0][3].label = 'F2'
LAYOUT_EUR[0][4].label = 'F3'
LAYOUT_EUR[0][5].label = 'F4'
LAYOUT_EUR[0][6].w = 0.5
LAYOUT_EUR[0][7].label = 'F5'
LAYOUT_EUR[0][8].label = 'F6'
LAYOUT_EUR[0][9].label = 'F7'
LAYOUT_EUR[0][10].label = 'F8'
LAYOUT_EUR[0][11].w = 0.75
LAYOUT_EUR[0][12].label = 'F9'
LAYOUT_EUR[0][13].label = 'F10'
LAYOUT_EUR[0][14].label = 'F11'
LAYOUT_EUR[0][15].label = 'F12'

LAYOUT_EUR[1][13].label = '<--'
LAYOUT_EUR[1][13].w = 2

LAYOUT_EUR[2][0].label = 'TAB'
LAYOUT_EUR[2][0].w = 1.5
LAYOUT_EUR[2][13].label = 'ENTER'
LAYOUT_EUR[2][13].w = 1.5

LAYOUT_EUR[3][0].label = 'Caps Lock'
LAYOUT_EUR[3][0].w = 1.75
LAYOUT_EUR[3][13].label = 'ENTER'
LAYOUT_EUR[3][13].w = 1.25

LAYOUT_EUR[4][0].label = 'Shift'
LAYOUT_EUR[4][0].w = 1.25
LAYOUT_EUR[4][12].label = 'Shift'
LAYOUT_EUR[4][12].w = 2.75

LAYOUT_EUR[5][0].label = 'Ctrl'
LAYOUT_EUR[5][0].w = 1.5
LAYOUT_EUR[5][1].label = 'Win'
LAYOUT_EUR[5][1].w = 1.5
LAYOUT_EUR[5][2].label = 'Alt'
LAYOUT_EUR[5][2].w = 1.5
LAYOUT_EUR[5][3].w = 6.5
LAYOUT_EUR[5][4].label = 'Alt Gr'
LAYOUT_EUR[5][4].w = 1
LAYOUT_EUR[5][5].label = 'Win'
LAYOUT_EUR[5][5].w = 1
LAYOUT_EUR[5][6].label = 'Menu'
LAYOUT_EUR[5][6].w = 1
LAYOUT_EUR[5][7].label = 'Ctrl'
LAYOUT_EUR[5][7].w = 1

const KEYBOARD_EUR = new Keyboard(LAYOUT_EUR)

document.getElementById('previewWrapper').appendChild(KEYBOARD_EUR.toElement())
