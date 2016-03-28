var child = require('child_process');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require("fs"));

module.exports = function(arg, generate, done) {
  var package = require(process.env.PWD + '/package.json');
  if (!package.hasOwnProperty('dependencies')) {
    package.dependencies = {}
  }
  package.dependencies['ml-event'] = "*";
  package.dependencies['ml-timer'] = "*";
  package.dependencies['ml-pinmux'] = "*";
  package.SDKpath = "./src/src";
  package.scripts.build = "ml parse:js && ml build:js && ml build:init && ml build:bin && ml burn ./out/mt7687_iot_sdk_xip.bin";
  package.scripts.installEnv = "ml install:sdk && ml install:gcc && ml install:jerry && ml install:ml";
  fs.writeFileAsync(process.env.PWD + '/package.json', JSON.stringify(package));
  return child.exec('cp ' + __dirname.replace('/commands', '/featureConfig.json') + ' ' + process.env.PWD + '/featureConfig.json && mkdir sdk');
}