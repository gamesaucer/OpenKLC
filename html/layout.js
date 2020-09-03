const editableKeys = [
  'VK_OEM_8',
  'VK_1',
  'VK_2',
  'VK_3',
  'VK_4',
  'VK_5',
  'VK_6',
  'VK_7',
  'VK_8',
  'VK_9',
  'VK_0',
  'VK_OEM_MINUS',
  'VK_OEM_PLUS',
  'VK_OEM_7',
  'VK_Q',
  'VK_W',
  'VK_E',
  'VK_R',
  'VK_T',
  'VK_Y',
  'VK_U',
  'VK_I',
  'VK_O',
  'VK_P',
  'VK_OEM_4',
  'VK_OEM_6',
  'VK_A',
  'VK_S',
  'VK_D',
  'VK_F',
  'VK_G',
  'VK_H',
  'VK_J',
  'VK_K',
  'VK_L',
  'VK_OEM_1',
  'VK_OEM_3',
  'VK_OEM_5',
  'VK_Z',
  'VK_X',
  'VK_C',
  'VK_V',
  'VK_B',
  'VK_N',
  'VK_M',
  'VK_OEM_COMMA',
  'VK_OEM_PERIOD',
  'VK_OEM_2',
  'VK_SPACE',
  'VK_DECIMAL'
]

const systemKeys = [
  'Backspace',
  'Enter1',
  'Enter2',
  'Tab',
  'Caps',
  'Shift1',
  'Shift2',
  'Control1',
  'Control2',
  'Alt1',
  'Alt2'
]

const previewEl = document.getElementById('editablePreview')
editableKeys.forEach((key, i) => {
  const el = document.createElement('button')
  el.classList.add('key', 'editable', key)
  ;[1, 2, 3, 4].forEach(n => {
    const num = document.createElement('div')
    num.classList.add('keyPreview', key, 'cell' + n)
    el.appendChild(num)
    num.appendChild(document.createTextNode(
      String.fromCharCode(Math.floor(Math.random() * 94 + 32))
    ))
  })
  el.title = key
  el.setAttribute('role', 'tab')
  el.setAttribute('aria-selected', !i)
  el.setAttribute('aria-label', key)
  el.setAttribute('tabindex', -!!i)
  el.setAttribute('aria-controls', `PANEL_${key}`)
  previewEl.appendChild(el)
})
systemKeys.forEach(key => {
  const el = document.createElement('button')
  el.classList.add('key', 'system', key)
  el.title = key.replace(/[0-9]+/, '')
  el.appendChild(document.createTextNode(key.replace(/[0-9]+/, '')))
  el.disabled = true
  previewEl.appendChild(el)
})

const formatString = str => [...str].map(char => controlCharacters[char] || char).join('')
const controlCharacters = {
  '\x00': '␀',
  '\x01': '␁',
  '\x02': '␂',
  '\x03': '␃',
  '\x04': '␄',
  '\x05': '␅',
  '\x06': '␆',
  '\x07': '␇',
  '\x08': '␈',
  '\x09': '␉',
  '\x0a': '␊',
  '\x0b': '␋',
  '\x0c': '␌',
  '\x0d': '␍',
  '\x0e': '␎',
  '\x0f': '␏',
  '\x10': '␐',
  '\x11': '␑',
  '\x12': '␒',
  '\x13': '␓',
  '\x14': '␔',
  '\x15': '␕',
  '\x16': '␖',
  '\x17': '␗',
  '\x18': '␘',
  '\x19': '␙',
  '\x1a': '␚',
  '\x1b': '␛',
  '\x1c': '␜',
  '\x1d': '␝',
  '\x1e': '␞',
  '\x1f': '␟',
  '\x20': '␠',
  '\x7F': '␡'
}
