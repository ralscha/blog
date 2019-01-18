module.exports = {
  "globDirectory": "www/",
  "globPatterns": [
    "index.html",
    "*.js",
    "*.css",
    "assets/**/*.png",
	"assets/**/favicon.ico",
	"*svg/*",
	"manifest.json"
  ],
  "dontCacheBustUrlsMatching": new RegExp('.+\.[a-f0-9]{20}\..+'),
  "maximumFileSizeToCacheInBytes": 5000000,
  "swSrc": "src/service-worker.js",
  "swDest": "www/service-worker.js"
};


