const Wappalyzer = require('wappalyzer//driver');
const Browser = require('wappalyzer/browsers/zombie');

exports.checkUrl = function(url, callback) {
  const options = {
    debug: false,
    delay: 500,
    maxDepth: 3,
    maxUrls: 1,
    maxWait: 5000,
    recursive: true,
    userAgent: 'Wappalyzer',
    htmlMaxCols: 2000,
    htmlMaxRows: 2000,
  };
  const wappalyzer = new Wappalyzer(Browser, url, options);
  wappalyzer.analyze()
  .then(json => {
    callback(json, null);
  })
  .catch(error => {
    console.log(error);
    callback(null, error);
});
}