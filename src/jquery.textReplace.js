/*jshint browser: true, jquery: true, indent: 2, white: true, curly: true, forin: true, noarg: true, immed: true, newcap: true, noempty: true, nomen: true */

/* Copyright (c) 2011, Thomas Rix
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, 
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this 
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this 
  list of conditions and the following disclaimer in the documentation and/or 
  other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR 
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES 
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; 
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON 
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT 
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS 
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

(function ($) {
  $.fn.textReplace = function (search, replace) {
    // Argument type checks
    if (typeof(search) === 'string') {
      search = new RegExp(search, 'g');
    } else if (typeof(search) !== 'function' && search.constructor.indexOf('RegExp()') === -1) {
      throw new TypeError("cannot search for type " + typeof(search));
    }

    // Do this check outside the loop to boost performance
    var replaceIsString = typeof(replace) === 'string';

    return this.each(function () {
      $(this).contents().each(function() {
        var node = this;
        if (node.nodeType === 3) {
          var textContent = node.textContent,
              searchMatch = null;
          
          if (replaceIsString) {
            textContent = textContent.replace(search, replace);
          } else {
            // Replace is assumed to be a function
            while (searchMatch = search.exec(textContent)) {
              textContent = injectString(textContent, replace(searchMatch[0]), searchMatch.index, searchMatch[0].length);
            }
          }
          
          node.textContent = textContent;
        }
      })
    });
  };
  
  // Inject a string in to the middle of another
  function injectString(string, inject, where, length) {
    return string.substr(0, where) + inject + string.substr(where + length);
  }
}(jQuery));