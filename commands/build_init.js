var Promise = require('bluebird');
var fs = require('fs-extra');
var readFile = Promise.promisify(require("fs").readFile);
var mkdir = Promise.promisify(require("fs").mkdir);
var rimraf = require('rimraf');
var path = require('path');
var readInstalled = require("read-installed");
var options = { dev: false, depth: 1 };
var UglifyJS = require("uglify-js");
var Promise = require('bluebird');
var SDK_link = '';
var strip = require('strip-comments');

module.exports = function(arg, generate, done) {

  var featureConfig = require(process.env.PWD + '/featureConfig');
  var dotCFilePool = [];
  var mlModules = [];

  return new Promise(function (resolve, reject) {
    var package = require(process.env.PWD + '/package.json');
    SDK_link = package.SDKpath;
    resolve();
  })
  .then(function() {
    return new Promise(function (resolve, reject) {
      return rimraf(process.env.PWD + '/tmp', function(error) {
        if(error) { reject(error); }
        return resolve();
      });
    });
  })
  .then(function(){
    return mkdir(process.env.PWD + '/tmp');
  })
  .then(function() {

    // process feature.mk content

    var content = '';
    for (props in featureConfig){
      var _content = props;
      if(featureConfig[props]) {
        if (typeof featureConfig[props] === 'string') {
          _content += ' = ' + featureConfig[props];
        } else {
          //  把 ml modules 抽出
          if (/ml\-/.test(_content)) {
            mlModules.push(_content);
          }
          _content += ' = y';
        }
      } else {
        _content += ' = n';
      }
      _content += '\n';
      content += _content;
    }
    return content;
  })
  .then(function(content){

    // generate feature.mk

    generate
    .create(path.join(__dirname, '../templates'), path.join(process.cwd(), './'))
    .createFile('./feature.mk', './tmp/feature.mk', { content: content }, done);
    console.log("Generate feature.mk success!");
  })
  .then(function() {

    return new Promise(function (resolve, reject) {
      return readInstalled(process.cwd(), options, function (err, data) {
        if (err) reject(err);
        resolve(data);
      });
    });
  })
  .then(function(data) {

    var content = '';

    for (package in data.dependencies) {
      if (data.dependencies[package].src && /^ml\-/.test(package) && package !== 'ml-cli') {
        for (var index in data.dependencies[package].src) {
          if (/\.c$/.test(data.dependencies[package].src[index])) {
            // parse .c file
            var realPath = data.dependencies[package].src[index].replace('.', '');
            dotCFilePool.push(realPath);
            // copy ./src to SDK
            fs.copy(data.dependencies[package].realPath + '/src', SDK_link + '/project/' + featureConfig.BOARD_CONFIG + '/apps/iot_sdk/src/ml/src');
            content += 'APP_FILES += $(APP_PATH_SRC)/ml' + realPath + '\n';

          } else {
            // parse .h file
          }
        }
      }
    }
    return content
  })
  .then(function(content) {

    // generate Makefile
    generate
    .create(path.join(__dirname, '../templates'), path.join(process.cwd(), './'))
    .createFile('./Makefile', './tmp/Makefile', { APP_FILES: content }, done);

    console.log("Generate Makefile success!");
  })
  .then(function(){
    return readFile(process.env.PWD + '/_output.js')
  })
  .then(function(code){
    code = code.toString();
    code = strip(code).replace(/(\s\s)+/g, '');
    // var result = UglifyJS.minify(code, { fromString: true, mangle: false });
    // console.log(result.code);
    var c = "global = {};" + code;
    // var c = result.code;
    var obj = {}; obj.c = c;
    var codeStr = '';
    codeStr += JSON.stringify(obj).replace(/^\{\"c\"\:/, '').replace(/\}$/, '');
    return codeStr;
  })
  .then(function(code) {
    var content = '*/ \n';

    for (var index in mlModules) {
      content += mlModules[index].replace('-', '_' ) + '_init();\n';
    }

    content += '/* ';
    generate
    .create(path.join(__dirname, '../templates'), path.join(process.cwd(), './'))
    .createFile('./main.c', './tmp/main.c', { ML_INIT: content, JS_CODE: code }, done);

    console.log("Generate main.c success!");
  })
  .catch(function(err) {
    return done({ message: err });
  });
}