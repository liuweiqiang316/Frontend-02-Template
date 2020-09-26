### 本周回顾

本周主要讲解动画。

动画通常跟时间线一起使用，一个时间线可以添加若干个动画。

```javascript
export class Animation {

    /**
     * animation构造函数
     * @param {object} object 动画作用的对象
     * @param {string} property 动画作用对象的属性
     * @param {number} startValue 动画作用对象的起始值
     * @param {number} endValue 动画作用对象的结束值
     * @param {number} duration 动画持续时间
     * @param {number} delay 动画延迟时间
     * @param {function} template 动画做用对象属性值的模板映射函数
     * @param {function} timeingFunction 动画变化函数
     */
    constructor(object, property, startValue, endValue, duration, delay, template, timeingFunction) {
        this.object = object
        this.property = property
        this.startValue = startValue
        this.endValue = endValue
        this.duration = duration
        this.delay = delay
        this.timeingFunction = timeingFunction || linear
        this.template = template || (v => v)
    }
    receive(time) {
        // range可以代表动画的范围
        let range = this.endValue - this.startValue
        let progress = this.timeingFunction(time / this.duration)// progress可以代表在时间的维度上，整个动画所处的时刻
        this.object[this.property] = this.template(this.startValue + range * progress)// 通过template模板函数，将动画所处的时刻映射到动画所作用的对象的对应的属性上
        // 以上过程连续起来就组成了动画
    }
}
```

时间线上可以添加若干动画，时间线通过```requestAnimationFrame```函数以及其回调函数来实现动画。

一般情况时间线会包含开始(start)、暂停(pause)、恢复(resume)、重置(reset)方法，以及rate属性用来调整动画执行速度。