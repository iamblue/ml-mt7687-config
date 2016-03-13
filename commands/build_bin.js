var Promise = require('bluebird');
var fs = require('fs');
var copy = require('fs-extra').copy;
var rimraf = require('rimraf');

var config = require('../config');

var SDK_link = '';
var project_link = '';
var GCC_link = '';
var SRC_link = '';

var colors = require('colors');
var child = require('child_process');

module.exports = function(arg, generate, done) {
  var featureConfig = require(process.env.PWD + '/featureConfig');

  return new Promise(function (resolve, reject) {
    var package = require(process.env.PWD + '/package');
    SDK_link = package.SDKpath;

    project_link = SDK_link + config.project.PATH;
    GCC_link = SDK_link + config.gcc.PATH;
    SRC_link = SDK_link + config.src.PATH;

    resolve();
  })
  .then(function() {
    return new Promise(function (resolve, reject) {
      fs.createReadStream(process.env.PWD + '/tmp/main.c').pipe(fs.createWriteStream(SRC_link + '/main.c'));
      fs.createReadStream(process.env.PWD + '/tmp/Makefile').pipe(fs.createWriteStream(GCC_link + '/Makefile'));
      fs.createReadStream(process.env.PWD + '/tmp/feature.mk').pipe(fs.createWriteStream(GCC_link + '/feature.mk'));
      return resolve();
    });
  }).then(function() {
    return new Promise(function (resolve, reject) {

      var linking = 0;
      var status = '';
      var errorMsg = '';
      var build = child.exec('./build.sh ' + featureConfig.BOARD_CONFIG + ' iot_sdk', {cwd: SDK_link});
      build.stdout.on('data', function (data) {
        console.log(data.toString());

        if (/\w+Error\w+/.test(data.toString())) {
          console.log('====================')
          status = 'failed';
          errorMsg = data.toString();
        }

        if(status !== 'failed' && /Linking\.\.\./.test(data.toString())) {
          linking = 1;
        }

        if (status !== 'failed' && linking === 1 && /Done/.test(data.toString())) {
          status = 'success';
        }
      });
      build.on('exit', function (data) {
        if (status === 'success') {
          return resolve();
        } else {
          return reject(errorMsg);
        }
      });
      build.stderr.on('data', function (data) {
        console.log(data.toString());
      });
    })
  })
  .then(function() {
    return new Promise(function (resolve, reject) {
      var createOutfolder = child.exec('mkdir out');
      createOutfolder.on('exit', function() {
        return resolve();
      });
    });
  })
  .then(function() {
    copy(SDK_link + '/out/' + featureConfig.BOARD_CONFIG + '/iot_sdk', process.env.PWD + '/out');

    console.log('==============================================================');
    console.log('Success!'.green + ' Please see the ./out folder!');
    console.log('==============================================================');
  })
  .then(function() {
    return new Promise(function (resolve, reject) {
      rimraf(process.env.PWD + '/tmp', function(error) {
        if(error) { reject(error); }
        return resolve();
      });
    });
  })
  .catch(function(err) {
    if (err) return done({ message: err });
    console.log('==============================================================');
    console.log('Error!'.red + ' Please check the ./out folder!');
    console.log('==============================================================');
  })

}