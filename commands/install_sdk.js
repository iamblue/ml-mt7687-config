var child = require('child_process');
// var Promise = require('bluebird');

module.exports = function(arg, generate, done) {
  child.exec('sh ../node_modules/ml-mt7687-config/templates/tar_sdk.sh', {cwd : process.env.PWD + '/sdk'});
}