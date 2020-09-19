import { Component, createElement } from './framework'
import picture1 from './assets/1.png'
import picture2 from './assets/2.jpg'
import picture3 from './assets/3.png'
import picture4 from './assets/4.jpg'

// 图片宽度
const PICTURE_WIDTH = 500

class Carousel extends Component {

    constructor() {
        super('div')
        this.attributes = Object.create(null)
    }

    render(type) {
        return document.createElement(type)
    }

    setAttribute(name, value) {
        this.attributes[name] = value
    }

    appendChild(child) {
        this.root.appendChild(child)
    }

    renderImg() {
        const { attributes: { src }, root } = this
        root.classList.add('carousel')
        for (const dataurl of src) {
            const child = document.createElement('div')
            child.style.backgroundImage = `url(${dataurl})`
            root.appendChild(child)
        }

        /* 手动轮播 */
        let position = 0
        root.addEventListener('mousedown', e => {
            let { children } = root
            let startX = e.clientX
            let move = e => {
                let x = e.clientX - startX

                let current = position - (x - x % PICTURE_WIDTH) / PICTURE_WIDTH

                for (let offset of [-1, 0, 1]) {
                    let pos = current + offset
                    pos = (pos + children.length) % children.length
                    children[pos].style.transition = 'none'
                    children[pos].style.transform = `translateX(${-pos * PICTURE_WIDTH + offset * PICTURE_WIDTH + x % PICTURE_WIDTH}px)`
                }
            }
            let up = e => {
                let x = e.clientX - startX
                position = position - Math.round(x / PICTURE_WIDTH)
                /** 鼠标松开时判断拖动方向。*/
                const direction = -Math.sign(Math.round(x / PICTURE_WIDTH) - x + PICTURE_WIDTH / 2 * Math.sign(x))
                for (let offset of [0, direction]) {
                    let pos = position + offset
                    pos = (pos + children.length) % children.length
                    children[pos].style.transition = ''
                    children[pos].style.transform = `translateX(${-pos * PICTURE_WIDTH + offset * PICTURE_WIDTH}px)`
                }

                document.removeEventListener('mousemove', move)
                document.removeEventListener('mouseup', up)
            }
            document.addEventListener('mousemove', move)
            document.addEventListener('mouseup', up)
        })

        /** 自动轮播 */
        let currentIndex = 0
        setInterval(() => {
            let { children } = root
            currentIndex = currentIndex % children.length
            let current = children[currentIndex]

            let nextIndex = (currentIndex + 1) % children.length
            let next = children[nextIndex]
            next.style.transition = 'none'
            next.style.transform = `translateX(${100 - nextIndex * 100}%)`
            setTimeout(() => {
                next.style.transition = ''
                current.style.transform = `translateX(${-100 - currentIndex * 100}%)`
                next.style.transform = `translateX(${- nextIndex * 100}%)`
                currentIndex = nextIndex
            }, 16)

            for (const child of children) {
                child.style.transform = `translateX(-${current * 100}%)`
            }
        }, 3000)
    }

    mountTo(parent) {
        this.renderImg()
        parent.appendChild(this.root)
    }
}

const imgs = [
    picture1, picture2, picture3, picture4
]

const el = <Carousel src={imgs} />
el.mountTo(document.body)