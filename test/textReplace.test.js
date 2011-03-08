module("jquery.textReplace.js");

test("can replace text", function () {
  expect(1);
  $('#qunit-fixture p.simple').textReplace('Hello', 'Goodbye');
  equals($('#qunit-fixture p.simple').html(), "Goodbye, world.");
});

test("regex search", function () {
  expect(1);
  $('#qunit-fixture p.simple').textReplace(/He[l]{2}o/g, 'Goodbye');
  equals($('#qunit-fixture p.simple').html(), "Goodbye, world.");  
});

test("callback replace", function () {
  expect(1);
  $('#qunit-fixture p.repeat').textReplace(/He[l]{1,2}o/g, function (match) {
    return match.toUpperCase();
  });  
  equals($('#qunit-fixture p.repeat').html(), "HELLO, world. HELLO, world.");
});

test("dom injection", function () {
  expect(1);
  $('#qunit-fixture p.twitter').textReplace(/\B@[a-zA-Z0-9]+\b/g, function (match) {
    var link = document.createElement('a');
    link.href = 'http://twitter.com/' + match.substr(1);
    link.appendChild(document.createTextNode(match));
    return link;
  });
  equals($('#qunit-fixture p.twitter').html(), 'Hello, <a href="http://twitter.com/charliesheen">@charliesheen</a>.');
});

test("dom injection mixed with string return", function () {
  expect(1);
  $('#qunit-fixture p.twitter-tricky').textReplace(/\B@[a-zA-Z0-9]+\b/g, function (match) {
    if (match === '@charliesheen') {
      var link = document.createElement('a');
      link.href = 'http://twitter.com/' + match.substr(1);
      link.appendChild(document.createTextNode(match));
      return link;
    } else {
      return match.toUpperCase();
    }
  });
  equals($('#qunit-fixture p.twitter-tricky').html(), 'Hello, <a href="http://twitter.com/charliesheen">@charliesheen</a>, meet @TOM.');
});