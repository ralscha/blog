module.exports = {
  globDirectory: "dist/app/browser/",
  globPatterns: ["**/*.{css,eot,html,ico,jpg,js,json,png,svg,ttf,txt,webmanifest,woff,woff2,webm,xml}"],
  globFollow: true,
  globStrict: true,
  globIgnores: ['**/*-es5.*.js', '3rdpartylicenses.txt', 'assets/icons/*.png'],
  dontCacheBustURLsMatching: new RegExp('.+.[a-f0-9]{20}..+'),
  maximumFileSizeToCacheInBytes: 5000000,
  swSrc: "dist/app/browser/service-worker.js",
  swDest: "dist/app/browser/service-worker.js"
};
