var UglifyJS = require("uglify-js");
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require("fs"));
var child = require('child_process');
var rimraf = require('rimraf');

module.exports = function(arg, generate, done) {
  var content = "var require = function (name) {\n" +
    "return global[name](this);\n"+
    "}\n";
  fs.readFileAsync(process.env.PWD + '/log.log')
  .then(function(data) {
    data = data.toString().replace(/\n$/, '');
    return data.toString().split('\n');
  })
  .then(function(data) {
    return new Promise(function (resolve, reject) {
      function read(i) {
        fs.readFileAsync(data[i])
        .then(function(jsContent){
          if(data[i] !== '') {
            var mlPool = data[i].match(/ml\-(\w)+/g);
            content += 'global[\'' + mlPool[mlPool.length-1] + '\'] = function() {\n' +
              'var module = {};\n' +
              'module.exports = {};\n' +
                jsContent + '\n' +
              'return module.exports;\n'+
              '}\n';
            if (i === data.length-1){
              return resolve();
            } else {
              i ++ ;
              read(i);
            }
          }
        });
      }
      if ( data[0] != '') {
        read(1);
      } else {
        return resolve();
      }
    });
  })
  .then(function() {
    return fs.readFileAsync(process.env.PWD + '/index.js')
  })
  .then(function(data) {
    var code = data.toString();
    var result = UglifyJS.minify(code, { fromString: true, mangle: true });
    content = content +
      "var EventEmitter = require('ml-event').EventEmitter;\n" +
      "var eventStatus = new EventEmitter();\n" +
      "global.eventStatus = eventStatus;\n" + result.code;
    return content;
  })
  .then(function(content) {
    fs.writeFileAsync(process.env.PWD + '/_output.js', content);
  })
  .then(function() {
    return new Promise(function (resolve, reject) {
      return rimraf(process.env.PWD + '/testError.js', function(error) {
        if(error) { reject(error); }
        return resolve();
      });
    });
  })
  .then(function() {
    return new Promise(function (resolve, reject) {
      return rimraf(process.env.PWD + '/log.log', function(error) {
        if(error) { reject(error); }
        return resolve();
      });
    });
  })

}