var Promise = require('bluebird');
var fs = Promise.promisifyAll(require("fs"));
var child = require('child_process');
var rimraf = require('rimraf');
var strip = require('strip-comments');
module.exports = function(arg, generate, done) {

  fs.readFileAsync(process.env.PWD + '/index.js')

  .then(function(data) {
    var code = data.toString();
    code = strip(code).replace(/\n/g, '').replace(/(\s\s)+/g, '');

    content =
      "global = {};\n" +
      "var EventEmitter = require('ml-event').EventEmitter;\n" +
      "var eventStatus = new EventEmitter();\n" +
      "global.eventStatus = eventStatus;\n" + code;
    return content;
  })

  .then(function(content) {
    fs.writeFileAsync(process.env.PWD + '/_output.js', content);
  })
  .then(function() {
    var browserify = require('browserify');
    var b = browserify();
    b.add(process.env.PWD + '/_output.js');
    b.bundle().pipe(fs.createWriteStream(process.env.PWD + '/_output.js'));
  });

}