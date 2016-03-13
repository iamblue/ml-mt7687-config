var UglifyJS = require("uglify-js");
var Promise = require('bluebird');

module.exports = function(arg, generate, done) {
  var browserify = require('browserify');
  var b = browserify();
  b.add(process.env.PWD + '/index.js');
  b.bundle(function(err, buffer) {
    if (err) {
      return done({ message: err });
    }
    console.log(buffer.toString());
  })
}