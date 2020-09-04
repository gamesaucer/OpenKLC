# Contributing to OpenKLC

Awesome! Thanks for taking an interest in this project!

These guidelines are currently a work in progress, so changes might happen at any time

#### Table Of Contents

1. [Contributing Knowledge](#Contributing-Knowledge)
2. [Contributing Code](#Contributing-Code)
   1. [JavaScript Code Style](#JavaScript-Code-Style) 
   2. [HTML Code Style](#HTML-Code-Style) 
   3. [CSS Code Style](#CSS-Code-Style) 
   4. [Browser Compatibility](#Browser-Compatibility) 

## Contributing Knowledge

If you have knowledge about how keyboards work in Windows and see something that OpenKLC doesn't do or does incorrectly, please leave an issue in which you explain the relevant details.

## Contributing Code

### JavaScript Code Style

#### JavaScript Standard Style

OpenKLC uses [JavaScript Standard Style](https://standardjs.com/). If you wish to contribute, make sure that any files you contribute pass the Standard linter.

In a few very rare cases Standard can make your life somewhat difficult, in which case you can use `// eslint-disable-line <rule>` or `// eslint-disable-next-line <rule>` to disable a rule for a single line, or `// eslint-disable <rule>` and `// eslint-enable <rule>` to disable it for multiple lines.

Disabling the linter is completely acceptable if not doing so makes the code less clean. However, if you choose to disable a rule, only disable the rule you need, and enable it again as soon as possible. Heavy use of `eslint-disable` is discouraged; rules should be disabled only to enable clean code, and not simply because you don't like linting rules.

#### JSDoc

Feel free to add your name to sections of code you have written using the `@author` JSDoc tag.

#### Line Length

Please limit lines to at most 120 characters in length.

#### Block Comments

Non-JSDoc block comments should conform to the following rules:

1. The opening line should not have anything on it other than `/*` and `*\`. The separation between these characters should be at least the width of the longest line of text, discounting any indentation.
2. The closing line should not have anything on it other than `\*` and `*/`. The separation between these characters should be identical to the opening line.
3. Text inside the comment should be indented one additional level relative to the `/*` symbol.

Here is an example of a correctly formed block comment:

```js
/*                                *\
  This is a correctly formed
  block comment. Its width does
  not exceed the "square" around
  it.
\*                                */
```

Consider aligning the "square" size of block comments that are close together.

### HTML Code Style

* Prefer single quotes over double quotes
* TBD

### CSS Code Style

* TBD

### Browser Compatibility

Browser compatibility is not currently a *huge* concern, but will become more important in the future. For now, just make sure it works on Chrome 84 and newer.
