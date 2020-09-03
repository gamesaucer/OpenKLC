var OKLCUtils = {}

/**
 * Enum for layout-wide flags
 * @enum {Number}
 */
OKLCUtils.AttribFlags = {

  /** No special state */
  NONE: 0x00,

  /** Right Alt is Ctrl+Alt */
  ALTGR: 0x01,

  /** Shift disables Caps Lock */
  SHIFTLOCK: 0x02,

  /** L.Shift+Back inserts a left-to-right marker, R.Shift+Back vice versa */
  LRM_RLM: 0x04
}

/**
 * Enum for modifier key flags
 * @enum {Number}
 */
OKLCUtils.ModFlags = {

  /** No additional keys */
  NONE: 0x00,

  /** Shift key held */
  SHIFT: 0x01,

  /** Alt key held */
  ALT: 0x02,

  /** Control key held */
  CTRL: 0x04,

  /** Sgcaps toggled on */
  SGCAPS: 0x40

  /*
  For Asian keyboards. Can't support them atm because I don't know how they work yet.
  KANA: 0x08,
  ROYA: 0x10,
  LOYA: 0x20,
  GRPSELTAP: 0x80,
  */
}

/**
 * Enum for dead key table flags
 * @enum {Number}
 */
OKLCUtils.DeadFlags = {

  /** Normal key */
  NONE: 0x00,

  /** Dead key */
  DEAD: 0x01
}

/**
 * Enum for key association table attribute flags
 * @enum {Number}
 */
OKLCUtils.AssocFlags = {

  /** Normal key */
  NONE: 0x00,

  /** Capslock key functions as shift */
  CAPLOK: 0x01,

  /** Capslock key with distinct meaning enabled */
  SGCAPS: 0x02,

  /** Caps + Altgr functions as Shift + Altgr */
  CAPLOKALTGR: 0x04

  /*
  For Asian keyboards. Can't support them atm because I don't know how they work yet.
  KANALOK: 0x08,
  GRPSELTAP: 0x80
  */
}

/**
 * Enum for key association table special characters
 * @enum {Number}
 */
OKLCUtils.AssocChars = {

  /** No Character */
  NONE: 0xF000,

  /** Dead Key Lookup */
  DEAD: 0xF001,

  /** Ligature Lookup */
  LGTR: 0xF002
}

/**
 * Enum for virtual keys
 * @enum {Number}
 */
OKLCUtils.VirtualKeys = {}

/**
 * Enum for virtual key flags
 * @enum {Number}
 */
OKLCUtils.VirtualFlags = {

  /** No special flags */
  NONE: 0x0000,

  /** Required for right-shift, numlock, and a bunch of other keys */
  EXT: 0x0100,

  /** Scancode corresponds to multiple VKs */
  MULTIVK: 0x0200,

  /** Key requires special processing */
  SPECIAL: 0x0400,

  /** Key is on the numpad */
  NUMPAD: 0x0800

  /*
  No idea what any of these do as of yet.
  UNICODE: 0x1000,
  INJECTEDVK: 0x2000,
  MAPPEDVK: 0x4000,
  BREAK: 0x8000
  */
}

/**
 * Enum for scancodes
 * @enum {Number}
 */
OKLCUtils.ScanCodes = {}
