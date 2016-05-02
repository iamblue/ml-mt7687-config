var child = require('child_process');
var path = require('path');

module.exports = function(arg, generate, done) {
  var package = require(process.env.PWD + '/package.json');
  var sdkPath = package.SDKpath;
  var SDKversion = package.SDKversion;
  if (/^\.\//.test(package.SDKpath)) {
    sdkPath = process.env.PWD + package.SDKpath.replace('.', '');
  }

  child.exec('unzip -o ./v' + SDKversion + '_out.zip', { cwd: sdkPath });
}