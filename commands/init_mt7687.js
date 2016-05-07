var child = require('child_process');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require("fs"));
var path = require('path');
module.exports = function(arg, generate, done) {
  var package = require(process.env.PWD + '/package.json');
  if (!package.hasOwnProperty('dependencies')) {
    package.dependencies = {}
  }
  package.dependencies['ml-event'] = "*";
  package.dependencies['ml-timer'] = "*";
  package.dependencies['ml-pinmux'] = "*";
  package.dependencies['ml-wifi'] = "*";
  package.dependencies['ml-mcs'] = "*";
  package.SDKpath = "./sdk";
  package.SDKversion = "3.0.0";
  package.scripts.build = "./build.sh";
  package.scripts.installEnv = "ml install:sdk && ml install:gcc && ml install:jerry && ml install:ml && ml install:resetSDK && ml install:cache";
  fs.writeFileAsync(process.env.PWD + '/package.json', JSON.stringify(package, null, '\t'));
  return child.exec('cp ' + path.join(__dirname, '../featureConfig.json') + ' ' + process.env.PWD + '/featureConfig.json && mkdir sdk');
}