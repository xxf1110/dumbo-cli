const processPath = process.cwd()
const fs = require('fs')
const { resolve } = require('path')
const ora = require('ora')
const chalk = require('chalk')
const inquirer = require('inquirer')
const util = require('util')
const childProcess= require('child_process');
const exec = util.promisify(childProcess.exec);



const hasPackage = fs.existsSync(resolve(processPath, './package.json'))
if (!hasPackage) {
    console.log(chalk.red(`当前路劲 ${processPath} 下找不到package.json文件`));
    process.exit()
} 
const packageJson = require(resolve(processPath, './package.json'))
const version = packageJson.version
const name = packageJson.name   
 

const question = [
    {
        type: 'confirm',
        name: 'confirm',
        message: `build App ${name} version: ${version}?`,
        default: true, 
    }
]

module.exports = inquirer
    .prompt(question)
    .then(async ({ confirm }) => { 
        if (!confirm) {
            process.exit()
        } 
        const spinner = ora( chalk.green(`building... App ${name} version: ${version}`));
        spinner.color = 'green'
        spinner.start();  
        const { error, stdout, stderr } = await exec(`npm run build`)
        if(error){
            throw error;
        }
        console.log(stdout); 
        spinner.stop() 
    })
    .catch(err => {
        console.log(err);
        process.exit()
    })
