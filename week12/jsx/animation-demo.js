import { Timeline, Animation } from './animation'
import { ease, linear, easeIn, easeOut, easeInOut } from './cubicBezier'

const tl = new Timeline()


Object.values({ ease, linear, easeIn, easeOut, easeInOut }).forEach((func, i) => {
    let animationProperty = [
        // document.getElementsByName('el')[0].style,
        'transform',
        0,
        500,
        2000,
        1000,
        v => `translateX(${v}px)`,
        // ease,
    ]
    animationProperty.unshift(document.getElementsByName('el')[i].style)
    animationProperty.push(func)
    tl.add(new Animation(...animationProperty))
})

// window.tl = tl
// window.animation = new Animation(...animationProperty)
document.querySelector('#pause-btn').addEventListener('click', () => tl.pause())
document.querySelector('#resume-btn').addEventListener('click', () => tl.resume())
document.querySelector('#reset-btn').addEventListener('click', () => tl.reset())

tl.start()