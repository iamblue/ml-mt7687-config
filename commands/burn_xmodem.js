var child = require('child_process');
var path = require('path');

module.exports = function(arg, generate, done) {
  var uploaderUrl = path.join(__dirname, '../commands/burn');
  var featureConfig = require(process.env.PWD + '/featureConfig');
  var sdkPath = process.env.PWD + '/sdk';

  var burn = child.exec('python ' + uploaderUrl + '/upload.py -c ' + featureConfig.download_port + ' -f ./out/mt7687_hdk/iot_sdk_demo/mt7687_iot_sdk_demo.bin', { cwd: sdkPath });

  burn.stdout.on('data', function(data) {
    console.log(data);
  });
  burn.stderr.on('data', function(data) {
    console.log(data);
  });
  burn.on('exit', function() {
    console.log('==============================================================');
    console.log('Success!'.green + ' Download! ');
    console.log('==============================================================');
  });
}