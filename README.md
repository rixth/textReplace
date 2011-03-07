# jquery.textReplace.js

This small plugin allows you to replace the text in DOM elements. When doing 
text manipulation, this method of working with text nodes directly, rather than 
replacing innerHTML is preferable because it will preserve event handlers and 
other special logic.

## Examples

### Simplest use case

    $('#myElement').textReplace('Hello', 'Goodbye');

### Regular expression search

    $('#myElement').textReplace(/He[l]{2}o/g, 'Goodbye');
    
Ensure you pass the global /g modifier to your regular expression, otherwise 
only the first occurrence of your string will be replaced.

### Callback replace function

You can also pass a function as the replacement parameter. This function will be 
called for each match found by the regular expression.

    $('#myElement').textReplace(/_[a-z]/g, function (match) {
      return match.substr(1).toUpperCase();
    });


## Tests

QUnit based tests available in ./test