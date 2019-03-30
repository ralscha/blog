module.exports = {
  "globDirectory": "dist/ngworkbox/",
  "globPatterns": [
    "index.html",
    "*.js",
    "*.css",    
    "assets/**/*.png",
	"manifest.json"
  ],
  "dontCacheBustURLsMatching": new RegExp('.+\.[a-f0-9]{20}\..+'),
  "maximumFileSizeToCacheInBytes": 5000000,
  "swSrc": "src/service-worker.js",
  "swDest": "dist/ngworkbox/service-worker.js"
};
