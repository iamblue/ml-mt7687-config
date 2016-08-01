var Promise = require('bluebird');
var child = require('child_process');
var fsExtra = require('fs-extra');
var path = require('path');
var fs = require('fs');

module.exports = function(arg, generate, done) {
  var package = require(process.env.PWD + '/package.json');
  var sdkPath = package.SDKpath;
  var SDKversion = package.SDKversion;
  if (/^\.\//.test(package.SDKpath)) {
    sdkPath = process.env.PWD + package.SDKpath.replace('.', '');
  }

  return new Promise(function (resolve, reject) {
    return generate
    .create(path.join(__dirname, '../templates'), sdkPath)
    .createFile('./FreeRTOSConfig.h', '/project/mt7687_hdk/apps/iot_sdk_demo/inc/FreeRTOSConfig.h', {}, function() {
      return resolve();
    });
  // }).then(function() {
  //   return new Promise(function (resolve, reject) {
  //     child.exec('cp ' + path.join(__dirname, '../templates') + '/libnvram.a ' + sdkPath + '/middleware/MTK/nvram/lib/');
  //   });
  }).then(function() {
    console.log('==============================================================');
    console.log('Success!'.green + ' Reset sdk completely. ');
    console.log('==============================================================');
  })

}