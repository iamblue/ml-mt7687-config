var UglifyJS = require("uglify-js");
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require("fs"));
var child = require('child_process');

module.exports = function(arg, generate, done) {
  fs.readFileAsync(process.env.PWD + '/index.js')
  .then(function(data) {
    var content = "function data() { \n " +
      "var EventEmitter = require('ml-event').EventEmitter;\n" +
      "var eventStatus = new EventEmitter();\n" +
      "global.eventStatus = eventStatus;\n";
    content = content +  data.toString() + "\n} data(); for (var i in require(\'module\')._cache){ console.log(i) };";
    return content;
  })
  .then(function(data) {
    fs.writeFileAsync(process.env.PWD + '/testError.js', data);
  })
  .then(function(data) {
    var libArr = [];
    return new Promise(function (resolve, reject) {
      var findMoudleName = function(status){
        var testError = child.exec('node ./testError.js > log.log', {pwd: process.env.PWD});
        var error = 0;
        testError.stdout.on('data', function(data) {
          libArr.push(data.replace(/\n/,''));
        });
        testError.on('exit', function(code) {
          if (error == 0) {
            // console.log('=========end=========');
            return resolve();
          }
          // console.log('Child exited with code ');
        });
        testError.stderr.on('data', function(data) {
          error = 1;
          var moduleName = '';
          if (/ReferenceError\:\s(\w+)\sis not defined/.test(data)){
            var parserStr = data.match(/ReferenceError\:\s(\w+)\sis not defined/gi)[0];
            moduleName = parserStr.replace('ReferenceError: ', '').split(' is not defined')[0];
            // return new Promise(function (resolve, reject) {
              fs.readFileAsync(process.env.PWD + '/testError.js')
              .then(function(data) {
                return adjustContent = 'global[\'' + moduleName + '\']= function (){};\n' + data;
              })
              .then(function(data) {
                fs.writeFileAsync(process.env.PWD + '/testError.js', data);
              })
              .then(function(){
                return findMoudleName();
              });
            // })
          } else {
            reject(data);
          }
        });
      }
      return findMoudleName();
    });
  })
  .then(function(arr) {
  })
  .catch(function(err) {
    if (err != '\n') {
      return done({ message: err });
    }
  });
}