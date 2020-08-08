### 总结

本周主要学习CSS语法规则,CSS选择器及选择器的优先级

### 本周知识点回顾

**CSS总论**

从语法的角度研究css,给css划分划分结构

1. at-rules;以@符号开头
2. rule

**CSS选择器**

1. selector
2. declaration = key + value
3. 选择器优先级

**选择器优先级**

1. 内联 > ID选择器 > 类选择器 > 类型选择器
2. 通配选择符（universal selector）（*）关系选择符（combinators）（+, >, ~, ' ', ||）和 否定伪类（negation pseudo-class）（:not()）对优先级没有影响。（但是，在 :not() 内部声明的选择器会影响优先级）。

### TODO

### 问题列表

1. 为什么 first-letter 可以设置 float 之类的，而 first-line 不行呢？（提交至 GitHub）

    答: first-letter可以选中确定的内容(第一个字),而对于不同用户不同浏览器而言first-line选中的内容可能会不同,

    如果对选中内容做float,不同用户不同浏览器的渲染结果就可能不一样了,所以first-line不支持float