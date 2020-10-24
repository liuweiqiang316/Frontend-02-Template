## 本周回顾

### 初始化

使用yeoman生成项目原型

1. package.json的配置
2. 命令行交互
3. 文件读写

### 构建

#### webpack

webpack起初是用来将node环境的js代码转换为浏览器可运行的js代码.所以webpack是打包成一个js文件,然后由html文件引用.新出来的其他类型的打包工具有直接打包html文件的.

webpack要重点关注loader和plugin. loader本质上是做文本转换,可以用多个loader处理同一个文件.plugin有独立的运行机制.

#### babel

babel是用来将最新规范的js代码转换为旧版本的js代码.