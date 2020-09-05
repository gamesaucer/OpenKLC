module.register('ImportKLC', function (
  module = window.ImportUtils,
  ImportUtils = window.ImportUtils,
  OKLCUtils = window.OKLCUtils,
  Utils = window.Utils
) {
  module.KLC = function (blob) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader()
      reader.onload = function () {
        const layout = new OKLCUtils.Layout()

        const OKLCCharEntry = []
        let shiftStates

        const sectionTypes = {
          KBD: (str) => {
            // const data = str.split(/\s+/).slice(1)
            layout.metadata.kbd = str.split(/\s+/)[1].trim()
            const descIndex = str.indexOf('"')
            if (descIndex >= 0) layout.metadata.desc = str.slice(descIndex).trim().replace(/^"|"$/g, '')
            // layout.metadata.desc = data[1].trim().replace(/^"|"$/g, '') || ''
          },
          COPYRIGHT: (str) => {
            layout.metadata.copyright = str.trim().replace(/^"|"$/g, '')
          },
          COMPANY: (str) => {
            layout.metadata.author = str.trim().replace(/^"|"$/g, '')
          },
          LOCALENAME: (str) => {
            layout.metadata.localename = str.trim().replace(/^"|"$/g, '').split('-')
          },
          LOCALEID: (str) => {
            layout.metadata.localeid = Number(`0x${str.trim().replace(/^"|"$/g, '')}`)
          },
          VERSION: (str) => {
            layout.metadata.version = str.trim().replace(/^"|"$/g, '').split('.')
          },
          SHIFTSTATE: (str) => {
            const regex = /^([0-9]+)/g
            const shiftStatesKLC = []
            let match
            while ((match = regex.exec(str))) { shiftStatesKLC.push(match[1]) }
            shiftStates = [...shiftStatesKLC]
              .map(v => (v & OKLCUtils.ModFlags.ALT) !== (v & OKLCUtils.ModFlags.CTRL) >>> 1
                ? v ^ (OKLCUtils.ModFlags.ALT | OKLCUtils.ModFlags.CTRL)
                : v)
          },
          LAYOUT: (str) => {
            const data = str
              .split('\n')
              // .filter(s => s.length)
              .map(record => record
                .split(/\s+/)
                .filter(s => s.length))
              .filter(s => s.length)

            const OKLCBindings = []
            for (const i in data) {
              const record = data[i]
              if (record[0] !== '-1') {
                const vk = OKLCUtils.VirtualKeys[record[1]] || record[1].codePointAt(0)
                OKLCBindings.push([Number(`0x${record[0]}`), vk])
                OKLCCharEntry.push([vk, Number(`0x${record[2]}`), record.slice(3), []])
              } else {
                const modif = OKLCCharEntry.pop()
                modif[1] = 0
                modif[3] = record.slice(3)
                OKLCCharEntry.push(modif)
              }
            }
            layout.addKeyBindings(...OKLCBindings.map(binding => new OKLCUtils.KeyBinding(...binding)))
          },
          LIGATURE: (str) => {
            const data = str
              .split('\n')
              // .filter(s => s.length)
              .map(record => record
                .split(/\s+/)
                .filter(s => s.length))
              .filter(s => s.length)

            for (const record of data) {
              record[0] = OKLCUtils.VirtualKeys[record[0]] || record[0].codePointAt(0)
              const entry = OKLCCharEntry.find(el => el[0] === record[0])[2]
              entry[shiftStates[record[1]]] = new OKLCUtils.Ligature(...record.slice(2))
            }
          },
          DEADKEY: (str) => {
            const data = str
              .split('\n')
              // .filter(s => s.length)
              .map(record => record
                .split(/\s+/)
                .filter(s => s.length))
              .filter(s => s.length)

            const diacritic = new OKLCUtils.Char(data.shift()[0], true)
            layout.addDeadKeys(...data.map(deadKeyPair => new OKLCUtils.DeadKey(
              diacritic,
              new OKLCUtils.Char(deadKeyPair[0]),
              new OKLCUtils.Char(deadKeyPair[1])
            )))
          },
          KEYNAME: () => {},
          KEYNAME_EXT: () => {},
          KEYNAME_DEAD: (str) => {
            const data = str
              .split('\n')
              .filter(s => s.length)
              .map(record => record
                .split(/\s+/)
                .filter(s => s.length))
            layout.addDeadKeyNames(...data.map(pair =>
              new OKLCUtils.DeadKeyName(Number(`0x${pair[0]}`), pair[1].replace(/^"|"$/g, ''))))
          },
          DESCRIPTIONS: () => {},
          LANGUAGENAMES: () => {}
        }
        const sections = reader.result
          .split('ENDKBD')[0]
          .replace(/(?:\/\/|;).*$/gm, '')
          .split(new RegExp(`(?=${Object.keys(sectionTypes).join('|')})`))

        sections
          .map(section => section.split(/(^\w+)/).slice(1))
          .sort((a, b) => {
            const starr = Object.keys(sectionTypes)
            return starr.findIndex(key => a[0] === key) - starr.findIndex(key => b[0] === key)
          })
          .forEach(el => sectionTypes[el[0]](el[1]))

        layout.addCharEntrys(...OKLCCharEntry.map(args => new OKLCUtils.CharEntry(...args)))
        resolve(layout)
      }
      reader.readAsText(blob)
    })
  }
}, ['OKLCUtils', 'VirtualKeys'])
