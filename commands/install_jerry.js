var child = require('child_process');
module.exports = function(arg, generate, done) {
  child.exec('cp -R ' + __dirname.replace('/commands', '/node_modules/ml-core-jerryscript/cm4/jerryscript') + ' ' + process.env.PWD + '/sdk/middleware/jerryscript && cp ' + __dirname.replace('/commands', '/templates/jerry-port.c') + ' ' + process.env.PWD + '/sdk/project/mt7687_hdk/apps/iot_sdk/src/jerry-port.c' );
}