var child = require('child_process');
var path = require('path');

module.exports = function(arg, generate, done) {
  var package = require(process.env.PWD + '/package.json');
  var sdkPath = package.SDKpath;
  var packagePath = process.env.PWD + '/node_modules';
  var js2c = child.exec('python ' + packagePath + '/ml-mt7687-config/js2c.py');
  js2c.stdout.on('data', function(data) {
    console.log(data);
  });
  js2c.stderr.on('data', function(data) {
    console.log(data);
  });
  js2c.on('exit', function() {
    child.exec('cp -R ' + process.env.PWD + '/tmp/jerry_targetjs.h ' + sdkPath + '/project/mt7687_hdk/apps/iot_sdk_demo/inc' );
    console.log('==============================================================');
    console.log('Success!'.green + ' Download! ');
    console.log('==============================================================');
  });
}