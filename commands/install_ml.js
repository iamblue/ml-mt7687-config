var child = require('child_process');
module.exports = function(arg, generate, done) {
  child.exec('cp -R ' + __dirname.replace('/commands', '/templates/microlattice.h') + ' ' + process.env.PWD + '/sdk/project/mt7687_hdk/apps/iot_sdk/inc/microlattice.h');
}