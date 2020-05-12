const inquirer = require('inquirer')
const program = require('commander')
const chalk = require('chalk')
const download = require('download-git-repo')
const ora = require('ora')
const fs = require('fs').promises 
const FS = require('fs')
const path = require('path')

const option = program.parse(process.argv).args[0]
const defaultName = typeof option === 'string' ? option : 'react-project'
const tpMap = require(path.resolve(__dirname, '../templates/templates'))
const tplLists = Object.keys(tpMap) || [];


const question = [
    {
        type: 'input',
        name: 'name',
        message: 'Project name',
        default: defaultName,
        filter(val) {
            return val.trim()
        },
        validate(val) {
            const validate = (val.trim().split(" ")).length === 1
            return validate || 'Project name is not allowed to have spaces ';
        },
        transformer(val) {
            return val;
        }
    },
    {
        type: 'list',
        name: 'template',
        message: 'Project template',
        choices: tplLists,
        default: tplLists[0],
        validate(val) {
            return true;
        },
        transformer(val) {
            return val;
        }
    },
    {
        type: 'input',
        name: 'description',
        message: 'Project description',
        default: 'React project',
        validate(val) {
            return true;
        },
        transformer(val) {
            return val;
        }
    },
    {
        type: 'input',
        name: 'author',
        message: 'Author',
        default: 'project author',
        validate(val) {
            return true;
        },
        transformer(val) {
            return val;
        }
    }
]


module.exports = inquirer
    .prompt(question)
    .then(({ name, template, description, author }) => {
        const projectName = name; 
        const isExist = FS.existsSync(path.resolve(process.cwd(), `./${projectName}`)) 
        if(isExist){
            console.log(chalk.red(`当前路径存在${projectName}`))
            process.exit()
        }  
        const templateName = template;
        const gitPlace = tpMap[templateName]['place'];
        const gitBranch = tpMap[templateName]['branch'];
        const spinner = ora(chalk.green('downloading template please wait...'));
        spinner.color = 'green'
        spinner.start(); 
        download(`direct:${gitPlace}#${gitBranch}`, `./${projectName}`, { clone: true }, async (err) => {
            if (err) {
                console.log(chalk.red(err))
                process.exit()
            } 
            try {
                const data = await fs.readFile(`./${projectName}/package.json`, 'utf8')
                const packageJson = JSON.parse(data);
                packageJson.name = name;
                packageJson.description = description;
                packageJson.author = author;
                const updatePackageJson = JSON.stringify(packageJson, null, 2); 
                await fs.writeFile(`./${projectName}/package.json`, updatePackageJson, 'utf8')
                spinner.stop();
                console.log(chalk.green('project init successfully!'))
                console.log(`
                    ${chalk.green('   Run Application  ')}
                    ${chalk.green(`cd ${name}`)}
                    ${chalk.green('npm install')}
                    ${chalk.green(`${template === 'react' ? 'npm start' : 'npm run serve'}`)}
                `);
            } catch (error) {
                spinner.stop();
                console.error(error);
                return;
            } 
        })
    })
    .catch(err => {
        console.log(err);
    }) 
