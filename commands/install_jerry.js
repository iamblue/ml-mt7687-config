var child = require('child_process');
var path = require('path');
module.exports = function(arg, generate, done) {
  var package = require(process.env.PWD + '/package.json');
  var sdkPath = package.SDKpath;
  var SDKversion = package.SDKversion;
  if (/^\.\//.test(package.SDKpath)) {
    sdkPath = process.env.PWD + package.SDKpath.replace('.', '');
  }
  return child.exec('cp -R ' + path.join(__dirname, '../node_modules/ml-core-jerryscript/cm4/jerryscript') + ' ' + process.env.PWD + '/sdk/middleware/jerryscript && cp ' + path.join(__dirname, '../templates/jerry-port.c') + ' ' + process.env.PWD + '/sdk/project/mt7687_hdk/apps/iot_sdk_demo/src/jerry-port.c' );
}