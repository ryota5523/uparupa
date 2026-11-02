"use strict";
var CACHE="manami-fan-room-v1";
var CORE=["./","./index.html","./style.css","./features.html","./feature-app.css","./feature-app.js","./manifest.json","./data/updates.json"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(CORE)}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){var u=new URL(e.request.url);if(e.request.method!=="GET"||u.origin!==self.location.origin)return;if(u.pathname.endsWith("/data/updates.json")){e.respondWith(fetch(e.request,{cache:"no-store"}).catch(function(){return caches.match(e.request)}));return}e.respondWith(caches.match(e.request).then(function(hit){var net=fetch(e.request).then(function(res){if(res.ok){var copy=res.clone();caches.open(CACHE).then(function(c){c.put(e.request,copy)})}return res});return hit||net}))});
