### 本周回顾

#### proxy与双向绑定

使用js的proxy和dom的事件监听实现双向绑定

#### range实现dom拖拽

1. 普通拖拽
    1. 需要注意被拖拽的元素监听mousedown事件,document监听mouseup和mousemove
    2. mouseup时,移除mouseup和mousedown事件
    3. 记录鼠标点击的起始位置和拖动之后的位置
2. 正常流拖拽
    1. 使用range API,保存容器中所有的range
    2. 在鼠标移动时,计算当前位置最近的range,将元素插入到range中

