import { createElement } from './framework'
import Carousel from './Carousel'
import picture1 from './assets/1.png'
import picture2 from './assets/2.jpg'
import picture3 from './assets/3.png'
import picture4 from './assets/4.jpg'

const imgs = [
    {
        img: picture1,
        url: 'https://www.baidu.com/',
    },
    {
        img: picture2,
        url: 'https://www.baidu.com/',
    },
    {
        img: picture3,
        url: 'https://www.baidu.com/',
    },
    {
        img: picture4,
        url: 'https://www.baidu.com/',
    },
]

const el = <Carousel src={imgs}
    onChange={(e) => console.log(e.detail.position)}
    onClick={(e) => window.location.href = e.detail.data.url}
/>
el.mountTo(document.body)
