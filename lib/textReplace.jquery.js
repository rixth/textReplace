(function () {
  var textReplace = this.textReplace;
  delete this.textReplace;
  jQuery.fn.textReplace = function (search, replace) {
    return $(this).each(function () {
      textReplace(this, search, replace);
    })
  };
})();