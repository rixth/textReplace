/*jshint browser: true, jquery: true, indent: 2, white: true, curly: true, forin: true, noarg: true, immed: true, newcap: true, noempty: true, nomen: true, boss: true */

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

(function (global) {
  function getTextNodeChildren(root) {
    var node, walker,
        results = [];

    if (document.createsTreeWalker) {
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while(node = walker.nextNode()) {
        results.push(node);
      }
    } else {
      var node = root.childNodes[0];
      while (node != null) {
        if(node.nodeType = 3) {
          results.push(node);
        }

        if (node.hasChildNodes()) {
          node = node.firstChild;
        } else {
          while(node.nextSibling == null && node != root) {
            node = node.parentNode;
          }
          node = node.nextSibling;
        }
      }
    }

    return results;
  }

  function textReplace (rootNode, search, replace) {
    // Argument type checks
    if (typeof(search) === 'string') {
      search = new RegExp(search, 'g');
    } else if (typeof(search) !== 'function' && search.constructor.toString().indexOf('RegExp()') === -1) {
      throw new TypeError("cannot search for type " + typeof(search));
    }

    // Do these checks outside the loop to boost performance
    var replaceIsString = typeof(replace) === 'string';
    var replaceIsFunction = typeof(replace) === 'function';

    getTextNodeChildren(rootNode).forEach(function (node) {
      var textContent, searchMatch, replaceWith, injectedNodes, nodeStack,
          textToTheLeftOfMatch, textToTheRightOfMatch, parentNode;

      if (replaceIsString) {
        node.textContent = node.textContent.replace(search, replace);

      } else if (replaceIsFunction) {
        nodeStack = [node];
        while (node = nodeStack.pop()) {
          textContent = node.textContent;
          while (searchMatch = search.exec(textContent)) {
            replaceWith = replace(searchMatch[0]);
            if (typeof(replaceWith) === 'string') {
              textToTheLeftOfMatch = textContent.substr(0, searchMatch.index),
              textToTheRightOfMatch = textContent.substr(searchMatch.index + searchMatch[0].length);
              textContent = textToTheLeftOfMatch + replaceWith + textToTheRightOfMatch;
              node.textContent = textContent;
            } else if (typeof(replaceWith) === 'object' && replaceWith.childNodes) {
              textToTheLeftOfMatch = document.createTextNode(textContent.substr(0, searchMatch.index)),
              textToTheRightOfMatch = document.createTextNode(textContent.substr(searchMatch.index + searchMatch[0].length));

              // Create a new fragment, split the text around the match and
              // inject the DOM element returned
              injectedNodes = document.createDocumentFragment();
              injectedNodes.appendChild(textToTheLeftOfMatch);
              injectedNodes.appendChild(replaceWith);
              injectedNodes.appendChild(textToTheRightOfMatch);

              // Replace the element
              var parentNode = node.parentNode;
              parentNode.replaceChild(injectedNodes, node);

              // Since we changed the nodes when we split this one up, push
              // the remainder of the node on to the stack and search for
              // more matches
              nodeStack.push(parentNode.lastChild);
              search.lastIndex = 0;
              break;
            }
          }
        }
      }
    });
  };

  if (global.exports) {
    global.exports = textReplace;
  } else {
    global.textReplace = textReplace;
  }
}(typeof(module) !== 'undefined' ? module : this));