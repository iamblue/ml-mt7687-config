var child = require('child_process');
var path  = require('path');
module.exports = function(arg, generate, done) {
  child.exec('cp -R ' + path.join(__dirname, '../templates/microlattice.h') + ' ' + process.env.PWD + '/sdk/project/mt7687_hdk/apps/iot_sdk/inc/microlattice.h');
}