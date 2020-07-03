# 模块二：JavaScript语言

## 运行时

### 数据结构

- 类型

	- js内置七种基本类型

		- Null
		- Undefined
		- String
		- Boolean
		- Number
		- Object
		- Symbol

- 实例

	- js引擎，宿主自带api

		- Array/Math/Date等等

### 执行过程（算法）

- 宏观事件（事件循环）

	- setInterval/setTimeout等等函数会在事件循环中新增一个宏观事件。

- 微观事件

	- 新建Promise会新增一个微观事件

- 函数执行

	- 闭包/作用域/执行上下文

		- 闭包

			- 定义：在函数外持有函数内的引用

		- 作用域

			- 定义：作用域是一套规则，用于存储及查找变量
			- 词法作用域

				- 定义：词法作用域是定义在词法阶段的作用域。书写代码时就静态确定了。作用域链是基于作用域嵌套。

				  eg：
				  function foo(){
				  	console.log(a) // 2
				  }
				  
				  function bar(){
				  	const a = 3
				  	foo()
				  }
				  const a = 2
				  bar()

			- 动态作用域

				- 定义：动态作用域是在代码运行时动态确定的。作用域链是基于调用栈的，而不是代码中的作用域嵌套。

			- this

				- 函数内部this的绑定优先级

					- 1. new调用。绑定到新创建的对象。
					- 2. 由call或者apply或者bind调用。绑定到指定的对象。
					- 3. 由上下文调用。绑定到那个上下文对象。
					- 4. 默认：在严格模式下绑定到undefined，否则绑定到全局对象。
					- es6箭头函数。根据当前词法作用域来决定this，具体来说，箭头函数会继承外层函数调用的this绑定。

		- 执行上下文

			- javascript/执行环境/宿主环境

- 语句执行

## 文法

### js语言标准制定的规则

- 迭代器（Iterator）和生成器（Generator）

	- 循环语句的问题

		- 多循环嵌套，追踪变量过于复杂

	- 什么是迭代器

		- 一种特殊对象，它具有一些专门为迭代过程设计的专有接口

		  一种特殊对象，它具有一些专门为迭代过程设计的专有接口。所有的迭代器对象都有一个next()方法，每次调用都返回一个结果对象。结果对象有两个属性：一个是value，表示下一个将要返回的值；另一个是done，它是一个布尔类型的值，当没有更多可返回数据时返回true。迭代器还会保存一个内部指针，用来指向当前集合中值的位置，每调用一次next()方法，都会返回下一个可用的值。
		  		如果在最后一个值返回后再调用next()方法，那么返回的对象中属性done的值为true，属性value则包含迭代其最终返回的值，之歌返回值不是数据集的一部分，它与函数的返回值类似，是函数调用过程中最后一次给调用者传递信息的方法，如果没有相关数据则返回undefined

	- 什么是生成器

		- 生成器函数表达式
		- 生成器对象的方法

	- 可迭代对象和for-of循环

		- 访问默认迭代器
		- 创建可迭代对象

	- 内建迭代器

		- 集合对象迭代器
		- 字符串迭代器
		- NodeList迭代器

	- 展开运算符与非数组可迭代对象
	- 高级迭代器功能

		- 给迭代器传递参数
		- 在迭代器中抛出错误
		- 生成器返回语句
		- 委托生成器

	- 异步任务执行

		- 简单任务执行器
		- 向任务执行器传递数据
		- 异步任务执行器

		  /**
		   * 基于Promise的generator任务执行器
		   * @param {function} gen generator
		   */
		  function run(gen) {
		      var args = [].slice.call(arguments, 1), it
		      it = gen.apply(this. args)
		  
		      return Promise.resolve()
		      .then(function handleNext(value) {
		          var next = it.next(value)
		          return (function handleResult(next) {
		              if(next.done){
		                  return next.value
		              }else{
		                  return Promise.resolve(next.value)
		                  .then(handleNext, function handleErr(err) {
		                      return Promise.resolve(it.throw(err))
		                      .then(handleResult)
		                  })
		              }
		          })(next)
		      })
		  }
		  
		  /**
		   * 基于回调的generator任务执行器
		   * @param {function} gen generator
		   */
		  function run(gen) {
		      let it = gen()
		      let result = it.next()
		      function step() {
		          if(!result.done){
		              if(typeof result.value === 'function'){
		                  result.value(function (err, data) {
		                      if(err){
		                          result = it.throw(err)
		                          return
		                      }
		                      result = it.next(data)
		                      step()
		                  })
		              }else{
		                  result = it.next(result.value)
		                  step()
		              }
		          }
		      }
		      step()
		  }
		  
		  /**
		   * 基于Promise的任务执行器
		   * @param {function} gen generator
		   */
		  function run(gen) {
		      let it = gen()
		      let result = it.next()
		      function step() {
		          if(!result.done){
		              return Promise.resolve(result.value)
		              .then(function handleResult(data) {
		                  result = it.next(data)
		                  step()
		              }, function handleErr(err) {
		                  result = it.throw(err)
		                  step()
		              })
		          }
		      }
		      step()
		  }

	- 小结

## 语义

### 代码实际的含义

*XMind - Trial Version*