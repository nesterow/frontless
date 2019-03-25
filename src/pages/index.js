const pages = require.context('.', true, /^(.*\.(tag$))[^.]*$/im);
pages.keys().forEach(function(key) {
  const path = pages.resolve(key);
  console.log(path);
  pages(key);
});
