var child = require('child_process');
var path = require('path');
module.exports = function(arg, generate, done) {
  child.exec('cp -R ' + path.join(__dirname, '../node_modules/ml-core-jerryscript/cm4/jerryscript') + ' ' + process.env.PWD + '/sdk/middleware/jerryscript && cp ' + path.join(__dirname, '../templates/jerry-port.c') + ' ' + process.env.PWD + '/sdk/project/mt7687_hdk/apps/iot_sdk/src/jerry-port.c' );
}