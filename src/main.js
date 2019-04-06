import './settings';
import riot from 'lib/riot';
const tags = require.context('./tags', true, /^(.*\.(tag.html$))[^.]*$/im);
tags.keys().forEach(function(key) {
  if (!key.includes('views/')) tags(key);
});

riot.settings.asyncRenderTimeout = 10000;
document.addEventListener('turbolinks:load', ()=>{
  riot.mount('*');
});
window.riot = riot;
