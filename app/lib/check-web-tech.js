const Wappalyzer = require('wappalyzer//driver');
const Browser = require('wappalyzer/browsers/zombie');

exports.checkUrl = function(url, callback) {
  const options = {
    debug: false,
    delay: 0,
    maxDepth: 1,
    maxUrls: 1,
    maxWait: 10000,
    recursive: false,
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
    console.log('Error:' + error);
    callback(null, error);
});
}