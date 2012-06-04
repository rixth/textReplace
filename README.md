# text-replace

A small utility to replace the text in DOM elements. When doing
text manipulation, this method of working with text nodes directly, rather than
replacing innerHTML, which is preferable because it will preserve event
handlers and other special logic.

### Installation

Load `text-replace.js` in a `<script>` tag. This will give create a global function `textReplace(rootNote, search, replace)`.

*or*

Load `text-replace.js` and `textReplace.jquery.js`. This provides `$(rootNote).textReplace(search, replace)`. You should combine these these scripts in production.

## Examples

You can mix and match any of the techniques shown below.

### Simplest use case

    textReplace(rootNode, 'Hello', 'Goodbye');

### Regular expression search

    textReplace(rootNode, /He[l]{2}o/g, 'Goodbye');

Ensure you pass the global /g modifier to your regular expression, otherwise
only the first occurrence of your string will be replaced.

### Callback replace function

You can also pass a function as the replacement parameter. This function will be
called for each match found by the regular expression.

    // Take a find snake_case & convert to camelCase
    textReplace(rootNode, /_[a-z]/g, function (match) {
      return match.substr(1).toUpperCase();
    });

### Returning a DOM element

If you return a DOM element/fragment, it will be injected in place.

    // Link text Twitter handles to their respectful profile
    textReplace(rootNode, /\B@[a-zA-Z0-9]+\b/g, function (match) {
      var link = document.createElement('a');
      link.href = 'http://twitter.com/' + match.substr(1);
      link.appendChild(document.createTextNode(match));
      return link;
    });

## Tests

Jasmine based tests available in ./test