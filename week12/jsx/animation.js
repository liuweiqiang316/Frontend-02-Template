import { linear } from './cubicBezier'
import { entry } from './webpack.config'
const TICK = Symbol('tick')
const TICK_HANDLER = Symbol('tick-handler')
const ANIMATIONS = Symbol('animations')
const START_TIME = Symbol('start-time')
const PAUSE_START = Symbol('pause-start')
const PAUSE_TIME = Symbol('pause-time')
const STATE = Symbol('state')

export class Timeline {
    constructor() {
        this[ANIMATIONS] = new Set()
        this[START_TIME] = new Map()
        this[STATE] = 'Inited'
    }

    start() {
        if (!this[STATE] === 'Inited') return
        this[STATE] = 'started'

        let startTime = Date.now()
        this[PAUSE_TIME] = 0
        this[TICK] = () => {
            let now = Date.now()
            for (const animation of this[ANIMATIONS]) {
                let t
                if (this[START_TIME].get(animation) < startTime)
                    t = now - startTime - this[PAUSE_TIME] - animation.delay
                else
                    t = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay
                if (animation.duration < t) {
                    this[ANIMATIONS].delete(animation)
                    t = animation.duration
                }
                if (t > 0)
                    animation.receive(t)
            }
            this[TICK_HANDLER] = requestAnimationFrame(this[TICK])
        }
        this[TICK]()
    }
    pause() {
        console.log('pause', this[STATE])
        if (this[STATE] !== 'started') return
        this[STATE] = 'paused'

        this[PAUSE_START] = Date.now()
        this[PAUSE_TIME] = 0
        cancelAnimationFrame(this[TICK_HANDLER])
    }
    resume() {
        if (this[STATE] !== 'paused') return
        this[STATE] = 'started'

        this[PAUSE_TIME] += Date.now() - this[PAUSE_START]
        this[TICK]()
    }
    reset() {
        this[STATE] = 'Inited'

        this[PAUSE_TIME] = 0
        this[TICK_HANDLER] = null
        this[PAUSE_START] = 0
        this.start()
    }
    add(animation, startTime) {
        if (arguments.length < 2) {
            startTime = Date.now()
        }
        this[ANIMATIONS].add(animation)
        this[START_TIME].set(animation, Date.now())
    }
    // rate设置速率 高级功能暂时不做
    // set rate(){}
    // get rate(){}
}

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