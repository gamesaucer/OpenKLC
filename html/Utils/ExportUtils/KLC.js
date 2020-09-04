module.register('.KLC', function (module = window.ExportUtils, ExportUtils = window.ExportUtils, OKLCUtils = window.OKLCUtils) {
  /**
   * Creates a .KLC file
   * @param {Layout} layout
   */
  module.KLC = function (layout) {
    // TODO there are likely additional contstrains on the name.
    // Probably generally applicable as well, not just to the KLC format.
    if (layout.metadata.desc.includes('"')) throw new TypeError('Description may not contain a double quote character')
    let fileStr =
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

    return fileStr
  }
}, ['ExportUtils', 'OKLCUtils'])
