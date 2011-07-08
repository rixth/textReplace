# jquery.textReplace.js

This small plugin allows you to replace the text in DOM elements. When doing 
text manipulation, this method of working with text nodes directly, rather than 
replacing innerHTML is preferable because it will preserve event handlers and 
other special logic.

## Examples

You can mix and match any of the techniques shown below.

### Simplest use case

    $('#myElement').textReplace('Hello', 'Goodbye');

### Regular expression search

    $('#myElement').textReplace(/He[l]{2}o/g, 'Goodbye');
    
Ensure you pass the global /g modifier to your regular expression, otherwise 
only the first occurrence of your string will be replaced.

### Callback replace function

You can also pass a function as the replacement parameter. This function will be 
called for each match found by the regular expression.

    // Take a find snake_case & convert to camelCase
    $('#myElement').textReplace(/_[a-z]/g, function (match) {
      return match.substr(1).toUpperCase();
    });

### Returning a DOM element

If you return a DOM element/fragment, it will be injected in place.

    // Link text Twitter handles to their respectful profile
    $('#myElement').textReplace(/\B@[a-zA-Z0-9]+\b/g, function (match) {
      var link = document.createElement('a');
      link.href = 'http://twitter.com/' + match.substr(1);
      link.appendChild(document.createTextNode(match));
      return link;
    });

## Tests

Jasmine based tests available in ./test