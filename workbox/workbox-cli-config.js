module.exports = {
  //"dontCacheBustUrlsMatching": new RegExp('.+\.[a-f0-9]{8}\..+'),
  "dontCacheBustUrlsMatching": new RegExp('.+'),
  "maximumFileSizeToCacheInBytes": "5MB",
  "globDirectory": "www/",
  "globPatterns": [
    "assets/fonts/*.woff2",
    "build/**/*.css",
	"build/**/*.js",
    "index.html",
    "manifest.json"
  ],
  "swSrc": "src/service-worker.js",
  "swDest": "www/service-worker.js"
};
