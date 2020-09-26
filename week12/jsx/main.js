import { createElement } from './framework'
import Carousel from './carousel'
import picture1 from './assets/1.png'
import picture2 from './assets/2.jpg'
import picture3 from './assets/3.png'
import picture4 from './assets/4.jpg'

const imgs = [
    picture1, picture2, picture3, picture4
]

const el = <Carousel src={imgs} />
el.mountTo(document.body)
