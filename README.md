# OpenKLC

OpenKLC is a web-based keyboard layout editor for Microsoft Windows. It supports several formats for importing and exporting layouts, and a wide variety of settings to customise your layout exactly how you want it to be.

## How to use OpenKLC

TBD

## Supported Formats

* [MSKLC Keyboard Source File](#MSKLC-Keyboard-Source-File) (`.klc`)
* [Source Code](#Source-Code) (`.c`, `.def`, `.h`, `.rc`)
* [Dynamic-Link Library](#Dynamic-Link-Library) (`.dll`)
* [OpenKLC Keyboard Source File](#OpenKLC-Keyboard-Source-File) (`.oklc`)

### MSKLC Keyboard Source File

Format for use with MSKLC, kbdtool.exe and kbdutool.exe.

This format is limited and lacks support for many things that compiled layouts are able to do. As such, exporting to an MSKLC Keyboard Source File will likely cause a loss of functionality.

### Source Code

C source code for use with Microsoft's C compiler. This is an intermediate format for MSKLC which lacks its limitations, and as such exporting to this format will not cause a loss of functionality.

### Dynamic-Link Library

The keyboard layout file that Windows actually uses.

### OpenKLC Keyboard Source File

Since none of the above file formats are well-suited to storing layout information, OpenKLC uses its own file format, which is the preferred format for importing and exporting your projects.

#### OpenKLC Keyboard Source File Spec

TBD