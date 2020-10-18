import { Component, STATE, ATTRIBUTE } from './framework'
import { enableGesture } from './gesture'
import { Timeline, Animation } from './animation'
import { ease } from './cubicBezier'

export { STATE, ATTRIBUTE } from './framework'
// 图片宽度
const PICTURE_WIDTH = 500

class Carousel extends Component {

    constructor(props) {
        super('div')
        console.log('Carousel props', props)
        // this.attributes = Object.create(null)
    }

    appendChild(child) {
        this.root.appendChild(child)
    }

    renderImg() {
        const { [ATTRIBUTE]: { src }, root } = this
        root.classList.add('carousel')
        for (const data of src) {
            const child = document.createElement('div')
            child.style.backgroundImage = `url(${data.img})`
            root.appendChild(child)
        }
        enableGesture(root)
        let tl = new Timeline
        tl.start()
        let handler = null

        this[STATE].position = 0

        let { children } = root
        let t = 0
        let ax = 0 // 动画造成的x位移

        root.addEventListener('start', e => {
            tl.pause()
            clearInterval(handler)
            let progress = (Date.now() - t) / 500
            ax = ease(progress) * 500 - 500
        })
        root.addEventListener('tap', e => {
            this.triggerEvent('click', {
                data: this[ATTRIBUTE].src[this[STATE].position],
                position: this[STATE].position
            })
        })
        root.addEventListener('panstart', e => {
            let x = e.clientX - e.startX - ax

            let current = this[STATE].position - (x - x % PICTURE_WIDTH) / PICTURE_WIDTH

            for (let offset of [-1, 0, 1]) {
                let pos = current + offset
                pos = (pos % children.length + children.length) % children.length
                children[pos].style.transition = 'none'
                children[pos].style.transform = `translateX(${-pos * PICTURE_WIDTH + offset * PICTURE_WIDTH + x % PICTURE_WIDTH}px)`
            }
        })
        root.addEventListener('end', e => {
            tl.reset()
            tl.start()
            handler = setInterval(nextPicture, 3000)

            let x = e.clientX - e.startX - ax

            let current = this[STATE].position - (x - x % PICTURE_WIDTH) / PICTURE_WIDTH

            const direction = Math.round((x % 500) / 500)

            if (e.isFlick) {
                console.log('velocity', e.velocity)
            }
            for (let offset of [-1, 0, 1]) {
                let pos = current + offset
                pos = (pos % children.length + children.length) % children.length
                children[pos].style.transition = 'none'

                tl.add(new Animation(children[pos].style, 'transform',
                    -pos * PICTURE_WIDTH + offset * PICTURE_WIDTH + x % PICTURE_WIDTH,
                    -pos * PICTURE_WIDTH + offset * PICTURE_WIDTH + direction * PICTURE_WIDTH, 500, 0, v => `translateX(${v}px)`, ease))
            }
            this[STATE].position = this[STATE].position - (x - x % PICTURE_WIDTH) / PICTURE_WIDTH - direction
            this[STATE].position = (this[STATE].position % children.length + children.length) % children.length
            this.triggerEvent('change', { position: this[STATE].position })

        })

        let nextPicture = () => {
            let { children } = root
            let current = children[this[STATE].position]

            let nextIndex = (this[STATE].position + 1) % children.length
            let next = children[nextIndex]

            t = Date.now()

            tl.add(new Animation(current.style, 'transform',
                -this[STATE].position * 500, -500 - this[STATE].position * 500, 500, 0, v => `translateX(${v}px)`, ease))
            tl.add(new Animation(next.style, 'transform',
                500 - nextIndex * 500, - nextIndex * 500, 500, 0, v => `translateX(${v}px)`, ease))
            this[STATE].position = nextIndex
            this.triggerEvent('Change', { position: this[STATE].position })
        }

        handler = setInterval(nextPicture, 3000)
    }

    mountTo(parent) {
        this.renderImg()
        parent.appendChild(this.root)
    }
}


export default Carousel