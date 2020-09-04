module.register('VirtualKeys', function (module = window.OKLCUtils) {
  /**
   * Enum for virtual keys
   * @enum {Number}
   */
  module.VirtualKeys = {
    /*                                                                           *\
      Mouse button virtual VK codes.
      These make no sense for assigning to a keyboard, so they're left out.

      LBUTTON: 0x01,
      RBUTTON: 0x02,
      MBUTTON: 0x04,
      XBUTTON1: 0x05,
      XBUTTON2: 0x06,
    \*                                                                           */

    /*                                                                           *\
      Virtual keys that are identical to the character they ordinarily represent.
      These are omitted because the character in question can be used.

      KEY_0: 0x30,
      KEY_1: 0x31,
      KEY_2: 0x32,
      KEY_3: 0x33,
      KEY_4: 0x34,
      KEY_5: 0x35,
      KEY_6: 0x36,
      KEY_7: 0x37,
      KEY_8: 0x38,
      KEY_9: 0x39,
      KEY_A: 0x41,
      KEY_B: 0x42,
      KEY_C: 0x43,
      KEY_D: 0x44,
      KEY_E: 0x45,
      KEY_F: 0x46,
      KEY_G: 0x47,
      KEY_H: 0x48,
      KEY_I: 0x49,
      KEY_J: 0x4a,
      KEY_K: 0x4b,
      KEY_L: 0x4c,
      KEY_M: 0x4d,
      KEY_N: 0x4e,
      KEY_O: 0x4f,
      KEY_P: 0x50,
      KEY_Q: 0x51,
      KEY_R: 0x52,
      KEY_S: 0x53,
      KEY_T: 0x54,
      KEY_U: 0x55,
      KEY_V: 0x56,
      KEY_W: 0x57,
      KEY_X: 0x58,
      KEY_Y: 0x59,
      KEY_Z: 0x5a,
    \*                                                                           */

    /** No associated VK */
    NONE: 0x00,

    /** Break */
    CANCEL: 0x03,

    // 0x07 is unassigned

    /** Backspace */
    BACK: 0x08,

    /** Tab */
    TAB: 0x09,

    // 0x0a-0x0b are reserved

    /** Clear */
    CLEAR: 0x0c,

    /** Enter */
    RETURN: 0x0d,

    /** Pause */
    PAUSE: 0x13,

    /** Caps Lock */
    CAPITAL: 0x14,

    /** Kana */
    KANA: 0x15,

    /** Hangeul old name */
    HANGUL: 0x15,

    /** Hangeul */
    HANGEUL: 0x15,

    /** Junja */
    JUNJA: 0x17,

    /** Final */
    FINAL: 0x18,

    /** Kanji */
    KANJI: 0x19,

    /** Hanja */
    HANJA: 0x19,

    /** Esc */
    ESCAPE: 0x1b,

    /** Convert */
    CONVERT: 0x1c,

    /** Non Convert */
    NONCONVERT: 0x1d,

    /** Accept */
    ACCEPT: 0x1e,

    /** Mode Change */
    MODECHANGE: 0x1f,

    /** Space */
    SPACE: 0x20,

    /** Page Up */
    PRIOR: 0x21,

    /** Page Down */
    NEXT: 0x22,

    /** End */
    END: 0x23,

    /** Home */
    HOME: 0x24,

    /** Arrow Left */
    LEFT: 0x25,

    /** Arrow Up */
    UP: 0x26,

    /** Arrow Right */
    RIGHT: 0x27,

    /** Arrow Down */
    DOWN: 0x28,

    /** Select */
    SELECT: 0x29,

    /** Print */
    PRINT: 0x2a,

    /** Execute */
    EXECUTE: 0x2b,

    /** Print Screen */
    SNAPSHOT: 0x2c,

    /** Insert */
    INSERT: 0x2d,

    /** Delete */
    DELETE: 0x2e,

    /** Help */
    HELP: 0x2f,

    // 0x30 - 0x39 are the same as ASCII '0' - '9'
    // 0x40 is unassigned
    // 0x41 - 0x5A are the same as ASCII 'A' - 'Z'

    /** Left Windows Key */
    LWIN: 0x5b,

    /** Right Windows Key */
    RWIN: 0x5c,

    /** Context Menu */
    APPS: 0x5d,

    // 0x5E is reserved

    /** Sleep */
    SLEEP: 0x5f,

    /** Numpad 0 */
    NUMPAD0: 0x60,

    /** Numpad 1 */
    NUMPAD1: 0x61,

    /** Numpad 2 */
    NUMPAD2: 0x62,

    /** Numpad 3 */
    NUMPAD3: 0x63,

    /** Numpad 4 */
    NUMPAD4: 0x64,

    /** Numpad 5 */
    NUMPAD5: 0x65,

    /** Numpad 6 */
    NUMPAD6: 0x66,

    /** Numpad 7 */
    NUMPAD7: 0x67,

    /** Numpad 8 */
    NUMPAD8: 0x68,

    /** Numpad 9 */
    NUMPAD9: 0x69,

    /** Numpad * */
    MULTIPLY: 0x6a,

    /** Numpad + */
    ADD: 0x6b,

    /** Separator */
    SEPARATOR: 0x6c,

    /** Num - */
    SUBTRACT: 0x6d,

    /** Numpad . */
    DECIMAL: 0x6e,

    /** Numpad / */
    DIVIDE: 0x6f,

    /** F1 */
    F1: 0x70,

    /** F2 */
    F2: 0x71,

    /** F3 */
    F3: 0x72,

    /** F4 */
    F4: 0x73,

    /** F5 */
    F5: 0x74,

    /** F6 */
    F6: 0x75,

    /** F7 */
    F7: 0x76,

    /** F8 */
    F8: 0x77,

    /** F9 */
    F9: 0x78,

    /** F10 */
    F10: 0x79,

    /** F11 */
    F11: 0x7a,

    /** F12 */
    F12: 0x7b,

    /** F13 */
    F13: 0x7c,

    /** F14 */
    F14: 0x7d,

    /** F15 */
    F15: 0x7e,

    /** F16 */
    F16: 0x7f,

    /** F17 */
    F17: 0x80,

    /** F18 */
    F18: 0x81,

    /** F19 */
    F19: 0x82,

    /** F20 */
    F20: 0x83,

    /** F21 */
    F21: 0x84,

    /** F22 */
    F22: 0x85,

    /** F23 */
    F23: 0x86,

    /** F24 */
    F24: 0x87,

    // 0x88-0x8F are unassigned

    /** Num Lock */
    NUMLOCK: 0x90,

    /** Scroll Lock */
    SCROLL: 0x91,

    /** Numpad = for NEC PC-9800 */
    OEM_NEC_EQUAL: 0x92,

    /** Jisho */
    OEM_FJ_JISHO: 0x92,

    /** Mashu */
    OEM_FJ_MASSHOU: 0x93,

    /** Touroku */
    OEM_FJ_TOUROKU: 0x94,

    /** Loya */
    OEM_FJ_LOYA: 0x95,

    /** Roya */
    OEM_FJ_ROYA: 0x96,

    // 0x97-0x9F are unassigned

    /** Left Shift */
    LSHIFT: 0xa0,

    /** Right Shift */
    RSHIFT: 0xa1,

    /** Left Ctrl */
    LCONTROL: 0xa2,

    /** Right Ctrl */
    RCONTROL: 0xa3,

    /** Left Alt */
    LMENU: 0xa4,

    /** Right Alt */
    RMENU: 0xa5,

    /** Browser Back */
    BROWSER_BACK: 0xa6,

    /** Browser Forward */
    BROWSER_FORWARD: 0xa7,

    /** Browser Refresh */
    BROWSER_REFRESH: 0xa8,

    /** Browser Stop */
    BROWSER_STOP: 0xa9,

    /** Browser Search */
    BROWSER_SEARCH: 0xaa,

    /** Browser Favorites */
    BROWSER_FAVORITES: 0xab,

    /** Browser Home */
    BROWSER_HOME: 0xac,

    /** Volume Mute */
    VOLUME_MUTE: 0xad,

    /** Volume Down */
    VOLUME_DOWN: 0xae,

    /** Volume Up */
    VOLUME_UP: 0xaf,

    /** Next Track */
    MEDIA_NEXT_TRACK: 0xb0,

    /** Previous Track */
    MEDIA_PREV_TRACK: 0xb1,

    /** Stop */
    MEDIA_STOP: 0xb2,

    /** Play / Pause */
    MEDIA_PLAY_PAUSE: 0xb3,

    /** Mail */
    LAUNCH_MAIL: 0xb4,

    /** Media */
    LAUNCH_MEDIA_SELECT: 0xb5,

    /** App1 */
    LAUNCH_APP1: 0xb6,

    /** App2 */
    LAUNCH_APP2: 0xb7,

    // 0xB8-0xB9 are reserved

    /** ;: for US */
    OEM_1: 0xba,

    /** + for any country */
    OEM_PLUS: 0xbb,

    /** , for any country */
    OEM_COMMA: 0xbc,

    /** - for any country */
    OEM_MINUS: 0xbd,

    /** . for any country */
    OEM_PERIOD: 0xbe,

    /** /? for US */
    OEM_2: 0xbf,

    /** `~ for US */
    OEM_3: 0xc0,

    // 0xC1-0xD7 are reserved
    // 0xD8-0xDA are unassigned

    /** [{ for US */
    OEM_4: 0xdb,

    /** \| for US */
    OEM_5: 0xdc,

    /** ]} for US */
    OEM_6: 0xdd,

    /** '" for US */
    OEM_7: 0xde,

    /** OEM_8 */
    OEM_8: 0xdf,

    // 0xE0 is reserved

    /** AX key on Japanese AX kbd */
    OEM_AX: 0xe1,

    /** <> or \| on RT 102-key kbd */
    OEM_102: 0xe2,

    /** Help key on ICO */
    ICO_HELP: 0xe3,

    /** 00 key on ICO */
    ICO_00: 0xe4,

    /** Process */
    PROCESSKEY: 0xe5,

    /** ICO Clear */
    ICO_CLEAR: 0xe6,

    /** Packet */
    PACKET: 0xe7,

    // 0xE8 is unassigned

    /** Reset */
    OEM_RESET: 0xe9,

    /** Jump */
    OEM_JUMP: 0xea,

    /** OemPa1 */
    OEM_PA1: 0xeb,

    /** OemPa2 */
    OEM_PA2: 0xec,

    /** OemPa3 */
    OEM_PA3: 0xed,

    /** WsCtrl */
    OEM_WSCTRL: 0xee,

    /** Cu Sel */
    OEM_CUSEL: 0xef,

    /** Oem Attn */
    OEM_ATTN: 0xf0,

    /** Finish */
    OEM_FINISH: 0xf1,

    /** Copy */
    OEM_COPY: 0xf2,

    /** Auto */
    OEM_AUTO: 0xf3,

    /** Enlw */
    OEM_ENLW: 0xf4,

    /** Back Tab */
    OEM_BACKTAB: 0xf5,

    /** Attn */
    ATTN: 0xf6,

    /** Cr Sel */
    CRSEL: 0xf7,

    /** Ex Sel */
    EXSEL: 0xf8,

    /** Er Eof */
    EREOF: 0xf9,

    /** Play */
    PLAY: 0xfa,

    /** Zoom */
    ZOOM: 0xfb,

    /** NoName */
    NONAME: 0xfc,

    /** Pa1 */
    PA1: 0xfd,

    /** OemClr */
    OEM_CLEAR: 0xfe,

    /** Continued from previous, reserved for tables */
    __: 0xff

    // 0xFF is reserved
  }
}, ['OKLCUtils'])
