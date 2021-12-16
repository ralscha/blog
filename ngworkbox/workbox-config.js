module.exports = {
  globDirectory: "dist/app/",
  globPatterns: ["**/*.{css,eot,html,ico,jpg,js,json,png,svg,ttf,txt,webmanifest,woff,woff2,webm,xml}"],
  globFollow: true,
  globStrict: true,
  globIgnores: ['3rdpartylicenses.txt', 'assets/images/icons/icon-*.png'],
  dontCacheBustURLsMatching: new RegExp('.+.[a-f0-9]{20}..+'),
  maximumFileSizeToCacheInBytes: 5000000,
  swSrc: "dist/app/service-worker.js",
  swDest: "dist/app/service-worker.js"
};
