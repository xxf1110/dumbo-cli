// 主程序入口  
process.env.NODE_PATH = __dirname + '../node_modules/'
const { resolve } = require('path')
const res = command => resolve(__dirname, './commands/', command)
const { program } = require('commander')
const version = require('../package.json').version


program.version(version)

program.usage('<command>')

program.command('create')
    .option('-f, --foo', 'enable some foo')
    .description('Generate a new project')
    .alias('i')
    .action(() => {
        require(res('create'))
    }) 

program.command('build')
    .description('build')
    .action(() => {
        require(res('build'))
    })

program.command('deploy')
    .description('deploy')
    .action(() => {  
        require(res('deploy'))
    })

program.command('deploy-test')
    .description('deploy-test')
    .action(() => {  
        require(res('deploy-test'))
    })


program.parse(process.argv)


if (!program.args.length) {
    program.help()
} 
