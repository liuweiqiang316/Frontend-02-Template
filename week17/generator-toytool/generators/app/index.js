const Generator = require('yeoman-generator')

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts)
    }

    async initPackage() {

        const answers = await this.prompt([
            {
                type: "input",
                name: "name",
                message: "Your project name",
                default: this.appname // Default to current folder name
            }
        ])

        const pkgJson = {
            "name": answers.name,
            "version": "1.0.0",
            "description": "",
            "main": "index.js",
            "scripts": {
                "build": "webpack",
                "test": "mocha --require @babel/register",
                "coverage": "nyc mocha"
            },
            "author": "",
            "license": "ISC",
        }


        // Extend or create package.json file in destination path
        this.fs.extendJSON(this.destinationPath('package.json'), pkgJson)
        this.npmInstall(['vue'], { 'save-dev': false })
        this.npmInstall(['webpack', 'webpack-cli', 'vue-loader', 'vue-style-loader', 'css-loader', "babel-loader", 'vue-template-compiler', 'copy-webpack-plugin',
        "@babel/core","@babel/preset-env","@babel/register","@istanbuljs/nyc-config-babel","babel-plugin-istanbul","css","mocha","nyc"],
        { 'save-dev': true })
    }

    coypFiles() {
        this.fs.copyTpl(
            this.templatePath('hello.vue'),
            this.destinationPath('src/hello.vue'),
            {}
        )
        this.fs.copyTpl(
            this.templatePath('webpack.config.js'),
            this.destinationPath('webpack.config.js'),
            {}
        )
        this.fs.copyTpl(
            this.templatePath('main.js'),
            this.destinationPath('src/main.js'),
            {}
        )
        this.fs.copyTpl(
            this.templatePath('index.html'),
            this.destinationPath('src/index.html'),
            { title: 'hello' }
        )
        this.fs.copyTpl(
            this.templatePath('src/parser.js'),
            this.destinationPath('src/parser.js'),
            {}
        )
        this.fs.copyTpl(
            this.templatePath('test/parser-test.js'),
            this.destinationPath('test/parser-test.js'),
            {}
        )
        this.fs.copyTpl(
            this.templatePath('.babelrc'),
            this.destinationPath('.babelrc'),
            {}
        )
        this.fs.copyTpl(
            this.templatePath('.nycrc'),
            this.destinationPath('.nycrc'),
            {}
        )
    }
}
