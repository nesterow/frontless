const pages = require.context('.', true, /^(.*\.(tag$))[^.]*$/im);
pages.keys().forEach(function(key) {
  pages(key);
});
