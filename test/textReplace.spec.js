describe("jquery.textReplace", function () {
  describe("simple text replacement", function () {
    it("should replace text with a text search", function () {
      expect($('<div>Hello world</div>').textReplace('Hello', 'Goodbye').html()).toEqual('Goodbye world');
    });
    it("should replace text with a regex search", function () {
      expect($('<div>Hello world</div>').textReplace(/He[l]{2}o/g, 'Goodbye').html()).toEqual('Goodbye world');
    });
  });
  
  describe("using functions for replacement", function () {
    it("should pass the match to the functions", function () {
      var callback = jasmine.createSpy();
      $('<div>Hello world, hello world</div>').textReplace(/He[l]{2}o/ig, callback);
      expect(callback).toHaveBeenCalledWith('Hello');
    });
    it("should replace the search string with the return value of the functions", function () {
      expect($('<div>Hello world, hello world</div>').textReplace(/He[l]{2}o/ig, function (match) {
        return match.toUpperCase();
      }).html()).toEqual('HELLO world, HELLO world');
    });
  });
  
  describe("returning dom elements for replacement", function () {
    var fixture;
    beforeEach(function () {
      fixture = $('<div>Hello @tom, meet @bob</div>');
      setFixtures(fixture);
    });
    
    it("should inject dom nodes if they are returned by the replacement function", function () {
      expect(fixture.textReplace('@tom', function (match) {
        var link = document.createElement('a');
        link.href = 'http://twitter.com/' + match.substr(1);
        link.appendChild(document.createTextNode(match));
        return link;
      }).html()).toEqual('Hello <a href="http://twitter.com/tom">@tom</a>, meet @bob');
    });
    it("should work when injecting multiple dom nodes", function () {
      expect(fixture.textReplace(/\B@[a-zA-Z0-9]+\b/g, function (match) {
        var link = document.createElement('a');
        link.href = 'http://twitter.com/' + match.substr(1);
        link.appendChild(document.createTextNode(match));
        return link;
      }).html()).toEqual('Hello <a href="http://twitter.com/tom">@tom</a>,  meet <a href="http://twitter.com/bob">@bob</a>');
    });
    it("should work with mixed dom/text return", function () {
      expect(fixture.textReplace(/\B@[a-z]+\b/g, function (match) {
        if (match === '@tom') {
          var link = document.createElement('a');
          link.href = 'http://twitter.com/' + match.substr(1);
          link.appendChild(document.createTextNode(match));
          return link;
        } else {
          return match.toUpperCase();
        }
      }).html()).toEqual('Hello <a href="http://twitter.com/tom">@tom</a>, meet @BOB');      
    });
  });
});