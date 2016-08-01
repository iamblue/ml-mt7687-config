var child = require('child_process');
// var Promise = require('bluebird');

module.exports = function(arg, generate, done) {
  child.exec('sh ../node_modules/ml-mt7687-config/templates/tar_sdk.sh', {cwd : process.env.PWD + '/sdk'});
  // var package = require(process.env.PWD + '/package.json');

  // var SDKversion = package.SDKversion;
  // return new Promise(function (resolve, reject) {
  //   var download = child.exec('wget https://s3-ap-southeast-1.amazonaws.com/mtk.linkit/linkit_rtos_basic_sdk_' + SDKversion + '.tar');
  //   download.stderr.on('data', function(data) {
  //     console.log(data);
  //   });
  //   download.on('exit', function() {
  //     resolve();
  //   });
  // }).then(function() {
  //   return new Promise(function (resolve, reject) {
  //     var unzip;
  //     if (process.platform === 'win32') {
  //       unzip = child.exec('tar -xvpf ./linkit_rtos_basic_sdk_' + SDKversion + '.tar');
  //     } else {
  //       unzip = child.exec('sudo tar -xvpf ./linkit_rtos_basic_sdk_' + SDKversion + '.tar');
  //     }

  //     unzip.stderr.on('data', function(data) {
  //       console.log(data);
  //     });
  //     unzip.on('exit', function() {
  //       resolve();
  //     });
  //   });
  // }).then(function() {
  //   return new Promise(function (resolve, reject) {
  //     var deleteFile = child.exec('rm -rf ./linkit_rtos_basic_sdk_' + SDKversion + '.tar');
  //     deleteFile.stderr.on('data', function(data) {
  //       console.log(data);
  //     });
  //     deleteFile.on('exit', function() {
  //       resolve();
  //     });
  //   });
  // }).then(function() {
  //   console.log('==============================================================');
  //   console.log('Success!'.green + ' Install SDK completely. ');
  //   console.log('==============================================================');
  // }).catch(function(err) {
  //   console.log(err);
  // })
}