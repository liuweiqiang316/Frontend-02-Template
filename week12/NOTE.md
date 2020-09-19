### 本周回顾

#### 组件化基础知识

**组件的特性**

1. property
2. methods
3. inherit
4. attribute
5. config & state
6. event
7. lifecycle
8. children

前三点是js对象也有的特性.这里可以注意到js对象是有property的。

**组件的property和attribute的区别**

组件的property属性属于DOM对象，DOM对象的实质是js对象,所以property就是js对象的属性，property的值可以是任意类型，property强调从属关系，property是从属于DOM对象，是DOM对象的一个属性。

attribute特性由HTML定义，是出现在HTML标签上的，attribute的值只能是字符串。attribute强调描述性，是用来描述HTML标签。

#### 组件化实例-轮播组件

**jsx**

是语法糖，将jsx解析成createElement函数。

我们这里应用```@babel/plugin-transform-react-jsx```解析，然后定义createElement函数，处理解析后的结果。

**自动轮播**

1. setInterval无限循环
2. 利用%取余切换图片
3. 添加CSS属性transform和transition

**手动轮播**

1. 监听轮播图的mousedown事件，body标签的mousemove和mouseup事件
2. 通过e.clientX来确定偏移量
3. 分别计算mousemove和mouseup时图片的位置，并设置相关CSS属性

```js
// 其中mousemove时
let pos = current + offset
pos = (pos + children.length) % children.length
// mouseup时
position = position - Math.round(x / PICTURE_WIDTH)
// 鼠标松开时判断拖动方向
const direction = -Math.sign(Math.round(x / PICTURE_WIDTH) - x + PICTURE_WIDTH / 2 * Math.sign(x))
```

