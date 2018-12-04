module.exports = {
  "globDirectory": "www/",
  "globPatterns": [
    "index.html",
    "*.js",
    "*.css",
    "svg/md-add.svg",
    "svg/md-trash.svg",
    "svg/ios-add.svg",
    "svg/ios-trash.svg",
    "svg/md-arrow-back.svg",
    "svg/ios-arrow-back.svg",
    "assets/**/*.png"
  ],
  "dontCacheBustUrlsMatching": new RegExp('.+\.[a-f0-9]{20}\..+'),
  "maximumFileSizeToCacheInBytes": 5000000,
  "swSrc": "src/service-worker.js",
  "swDest": "www/service-worker.js"
};


