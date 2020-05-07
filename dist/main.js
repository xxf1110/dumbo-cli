// 主程序入口  
process.env.NODE_PATH = __dirname + '/../node_modules/';

var _require = require('path'),
    resolve = _require.resolve;

var res = function res(command) {
  return resolve(__dirname, '../commands/', command);
};

var program = require('commander');

program.version(require('../package.json').version);
program.usage('<command>');
program.command('init').option('-f, --foo', 'enable some foo').description('Generate a new project').alias('i').action(function () {
  require(res('init'));
});

if (!program.args.length) {
  program.help();
}