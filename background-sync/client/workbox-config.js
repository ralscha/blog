module.exports = {
  "globDirectory": "dist/app/",
  "globPatterns": [
    "index.html",
    "*.js",
    "*.css",
    "assets/**/*.png",
    "assets/**/favicon.ico",
    "*svg/*",
    "manifest.json"
  ],
  "dontCacheBustURLsMatching": new RegExp('.+\.[a-f0-9]{20}\..+'),
  "maximumFileSizeToCacheInBytes": 5000000,
  "swSrc": "src/service-worker.js",
  "swDest": "dist/app/service-worker.js"
};
