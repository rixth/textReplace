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
y});