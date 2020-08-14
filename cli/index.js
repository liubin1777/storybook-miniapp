const { program } = require('commander');
program.version('0.0.1');

require('./cmd/index');

// 默认指向 run 命令
if (process.argv.length < 3) {
  process.argv.push('run');
}

program.parse(process.argv);