describe("jquery.textReplace", function () {
  var fixture;

  describe("simple text replacement", function () {
    beforeEach(function () {
      fixture = $('<div>Hello world</div>')[0];
    });

    it("should replace text with a text search", function () {
      textReplace(fixture, 'Hello', 'Goodbye');
      expect(fixture.innerHTML).toEqual('Goodbye world');
    });
    it("should replace text with a regex search", function () {
      textReplace(fixture, /He[l]{2}o/g, 'Goodbye');
      expect(fixture.innerHTML).toEqual('Goodbye world');
    });
  });

  describe("using functions for replacement", function () {
    beforeEach(function () {
      fixture = $('<div>Hello world, hello world</div>')[0];
    });

    it("should pass the match to the functions", function () {
      var callback = jasmine.createSpy();
      textReplace(fixture, /He[l]{2}o/ig, callback);
      expect(callback).toHaveBeenCalledWith('Hello');
    });
    it("should replace the search string with the return value of the functions", function () {
      textReplace(fixture, /He[l]{2}o/ig, function (match) {
        return match.toUpperCase();
      });
      expect(fixture.innerHTML).toEqual('HELLO world, HELLO world');
    });
  });

  describe("returning dom elements for replacement", function () {
    beforeEach(function () {
      fixture = $('<div>Hello @tom, meet @bob</div>')[0];
    });

    it("should inject dom nodes if they are returned by the replacement function", function () {
      textReplace(fixture, '@tom', function (match) {
        var link = document.createElement('a');
        link.href = 'http://twitter.com/' + match.substr(1);
        link.appendChild(document.createTextNode(match));
        return link;
      });
      expect(fixture.innerHTML).toEqual('Hello <a href="http://twitter.com/tom">@tom</a>, meet @bob');
    });
    it("should work when injecting multiple dom nodes", function () {
      textReplace(fixture, /\B@[a-zA-Z0-9]+\b/g, function (match) {
        var link = document.createElement('a');
        link.href = 'http://twitter.com/' + match.substr(1);
        link.appendChild(document.createTextNode(match));
        return link;
      })
      expect(fixture.innerHTML).toEqual('Hello <a href="http://twitter.com/tom">@tom</a>, meet <a href="http://twitter.com/bob">@bob</a>');
    });
    it("should work with mixed dom/text return", function () {
      textReplace(fixture, /\B@[a-z]+\b/g, function (match) {
        if (match === '@tom') {
          var link = document.createElement('a');
          link.href = 'http://twitter.com/' + match.substr(1);
          link.appendChild(document.createTextNode(match));
          return link;
        } else {
          return match.toUpperCase();
        }
      })
      expect(fixture.innerHTML).toEqual('Hello <a href="http://twitter.com/tom">@tom</a>, meet @BOB');
    });
  });

  describe("jquery shim", function () {
    beforeEach(function () {
      jQuery.fn.textReplace = function (search, replace) {
        return $(this).each(function () {
          textReplace(this, search, replace);
        })
      };
    });

    afterEach(function () {
      delete jQuery.fn.textReplace;
    });

    it("should work with mixed dom/text return", function () {
      fixture = $('<div>Hello @tom, meet @bob</div>')
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