import riot from 'lib/riot';
const tags = require.context('./tags', true, /^(.*\.(tag$))[^.]*$/im);
tags.keys().forEach(function(key) {
  if (!key.includes('views/')) tags(key);
});

riot.settings.asyncRenderTimeout = 10000;
riot.mount('*');


