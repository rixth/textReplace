/*!
  * text-replace
  * https://github.com/rixth/text-replace
  * copyright Thomas Rix 2012
  * MIT License
  */

(function (name, definition, context) {
  if (typeof module != 'undefined' && module.exports) {
    module.exports = definition();
  } else {
    context[name] = definition();
  }
})('textReplace', function () {
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
  }

  return textReplace;
}, this);