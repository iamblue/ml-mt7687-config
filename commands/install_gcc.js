var Promise = require('bluebird');
var child = require('child_process');
var readFile = Promise.promisify(require("fs").readFile);
var path = require('path');
var config = require('../config');

module.exports = function(arg, generate, done) {
  var package = require(process.env.PWD + '/package.json');
  var sdkPath = package.SDKpath;
  if (/^\.\//.test(package.SDKpath)) {
    sdkPath = process.env.PWD + package.SDKpath.replace('.', '');
  }

  return new Promise(function (resolve, reject) {
    if (process.platform === 'darwin') {
      var gccUrl = config.gcc.source.darwin;
      var download = child.exec('wget ' + gccUrl + ' -O ' + sdkPath + '/gcc-arm-none-eabi.tar.bz2');
    } else if (process.platform === 'linux') {
      var gccUrl = config.gcc.source.linux;
      var download = child.exec('wget ' + gccUrl + ' -O ' + sdkPath + '/gcc-arm-none-eabi.tar.bz2');
    } else if (process.platform === 'win32') {
      var gccUrl = config.gcc.source.win32;
      var download = child.exec('wget ' + gccUrl + ' -O ' + sdkPath + '/gcc-arm-none-eabi.zip');
    }
    download.stderr.on('data', function(data) {
      console.log(data);
    });
    download.on('exit', function() {
      resolve();
    });
  }).then(function() {
    return readFile(sdkPath + '/gcc-arm-none-eabi.tar.bz2');
  })
  .then(function() {
    return new Promise(function (resolve, reject) {
      var unzip = child.exec('mkdir gcc-arm-none-eabi && tar -xvf ./gcc-arm-none-eabi.tar.bz2', { cwd: sdkPath });

      if (process.platform === 'win32') {
        unzip = child.exec('mkdir gcc-arm-none-eabi && unzip ./gcc-arm-none-eabi.zip', { cwd: sdkPath });
      }

      unzip.stdout.on('data', function(data) {
        console.log(data);
      });
      unzip.stderr.on('data', function(data) {
        console.log(data);
      });
      unzip.on('exit', function() {
        return resolve();
      });

    });
  })
  .then(function() {
    return new Promise(function (resolve, reject) {
      var copy = child.exec('cp -r ./gcc-arm-none-eabi-4_8-2014q3/  ./tools/gcc/gcc-arm-none-eabi', { cwd: sdkPath });
      copy.stdout.on('data', function(data) {
        console.log(data);
      });
      copy.stderr.on('data', function(data) {
        console.log(data);
      });
      copy.on('exit', function() {
        return resolve();
      });
    });
  })
  .then(function() {
    child.exec('rm -rf ./gcc-arm-none-eabi.tar.bz2 && rm -rf ./gcc-arm-none-eabi-4_8-2014q3/ && rm -rf ./gcc-arm-none-eabi/', { cwd: sdkPath });
    return true;
  })
  .then(function() {

    generate
    .create(path.join(__dirname, '../templates'), sdkPath)
    .createFile('./chip.mk', '/config/chip/mt7687/chip.mk', {}, done);

    console.log('==============================================================');
    console.log('Success!'.green + ' Install gcc completely. ');
    console.log('==============================================================');
  })
  .catch(function(err) {
    return done({ message: err });
  });
}