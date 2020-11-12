## 本周回顾

### 持续集成

后端最开始的基本开发套路是：各自分别开发,完成后进行联调。这样太慢了就出现了持续集成的概念。

后端提出的持续集成主要包含daily build 和 BVT

#### 后端持续集成

##### **daily build**

每天build一个版本

##### **build verification test(BVT)**

对daily build的结果进行测试

#### 前端持续集成

##### eslint

代码规范检验

##### githooks

代码提交时检验

##### 无头浏览器

检查生成的dom