module.register('DotKLCUtils', function (
  module = {}
) {
  window.DotKLCUtils = module
  /**
   * Enum for modifier key flags exclusive to KLC
   * @enum {Number}
   */
  module.modFlags = {
    NONE: 0x00,
    SHIFT: 0x01,
    CTRL: 0x02,
    ALT: 0x04
  }

  module.keyNames = {
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

  module.keyNamesExt = {
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
})
