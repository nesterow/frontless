(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _browser = require("config/browser");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var __ALL__ = [].concat(_toConsumableArray(_browser.CACHE_ASSETS), _toConsumableArray(_browser.CACHE_PAGES));

var message = function message(msg) {
  clients.matchAll().then(function (clients) {
    clients.forEach(function (client) {
      client.postMessage(msg);
    });
  });
};

var isPage = function isPage(string) {
  return _browser.CACHE_PAGES.filter(function (e) {
    return (string || '').endsWith(e);
  }).length;
};

self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(caches.open('appdata').then(function (cache) {
    return cache.addAll(__ALL__);
  }));
});
self.addEventListener('fetch', function (event) {
  event.respondWith(caches.open('appdata').then(function (cache) {
    return cache.match(event.request).then(function (response) {
      // return immediately and delete from cache
      // then ask turbolinks to revisit location
      if (response && isPage(event.request.url)) {
        message({
          type: 'before:revisit',
          url: event.request.url
        });
        setTimeout(function () {
          cache["delete"](event.request).then(function (success) {
            if (success) {
              message({
                type: 'revisit',
                url: event.request.url
              });
            }
          });
        }, 100);
        return response.text().then(function (text) {
          try {
            var data = text.replace('<body', '<body from-cache="true" ');
            data = data.replace(/<img([^>]*)\ssrc\=/gi, '<img$1 data-src="');
            data = data.replace(/<iframe([^>]*)\ssrc\=/gi, '<iframe$1 data-src=');
            data = data.replace(/<media([^>]*)\ssrc\=/gi, '<media$1 data-src=');
            data = data.replace(/<video([^>]*)\ssrc=/gi, '<video$1 data-src=');
            data = data.replace(/<audio([^>]*)\ssrc=/gi, '<audio$1 data-src=');
            return new Response(data, {
              headers: new Headers([['Content-Type', 'text/html']]),
              status: response.status,
              statusText: response.statusText,
              type: response.type
            });
          } catch (e) {
            return new Response(text, {
              status: response.status,
              statusText: response.statusText,
              type: response.type
            });
          }
        });
      } // (revisit) get fresh data from server and put it  in cache
      else if (!response && isPage(event.request.url)) {
          return cache.addAll(_browser.CACHE_PAGES.filter(function (page) {
            return event.request.url.endsWith(page);
          })).then(function () {
            message({
              type: 'after:revisit',
              url: event.request.url
            });
            return cache.match(event.request);
          });
        } // handle other requests normally


      return response || fetch(event.request).then(function (data) {
        return data;
      });
    });
  }));
});

},{"config/browser":2}],2:[function(require,module,exports){
"use strict";

module.exports = {
  IS_PWA: false,
  WEBSOCKETS: true,
  COOKIE_NAME: 'frontless-jwt',
  // cache in PWA mode
  CACHE_ASSETS: ['/assets/application.js', '/assets/media/logo.png'],
  CACHE_PAGES: ['/playground', '/playground/state', '/playground/form', '/playground/todo', '/playground/routes', '/playground/users']
};

},{}]},{},[1]);
