var child = require('child_process');

module.exports = function(arg, generate, done) {
  child.exec('unzip ./LinkIt_SDK_V3.0.0.zip && tar -xvf ./LinkIt_SDK_V3.0.0.tar.gz', {cwd : process.env.PWD + '/sdk'});
}