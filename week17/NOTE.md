## 本周回顾

### 单元测试

#### mocha代码测试

1. mocha默认运行在```node.js```中,使用es6语法需要引用依赖```@babel/register```
2. mocha的describe  是用来分块的

#### nyc覆盖率测试

1. ncy支持es6语法需要和babel互相引用依赖```@istanbuljs/nyc-config-babel```,```babel-plugin-istanbul```
2. nyc 覆盖率一般要求是函数覆盖100%,行覆盖90%

### yeoman工具链集成

### 问题:

1. vscode断点调试没有调通,报mocha的错误```missing )```

