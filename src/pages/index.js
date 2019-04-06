const pages = require.context('.', true, /^(.*\.(tag.html$))[^.]*$/im);
process.pages = [];
pages.keys().forEach(function(key) {
  pages(key);
  const path = key.replace(/\.tag.html$/im, '')
      .replace(/^\.\//, '');
  process.pages.push(path);
});
