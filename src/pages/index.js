const pages = require.context('.', true, /^(.*\.(tag.html$))[^.]*$/im);
pages.keys().forEach(function(key) {
  pages(key);
});
