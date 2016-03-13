module.exports = {
  init: {
    source: require('./commands/init'),
    description: 'init mt7687 env',
  },
  'build:js' : {
    source: require('./commands/build_js'),
    description: 'build javascript',
  },
  'build:bin' : {
    source: require('./commands/build_bin'),
    description: 'build binary',
  },
  'install' : {
    source: require('./commands/install_gcc'),
    description: 'install gcc',
  },
}