import { createElement } from './framework'
import Carousel from './Carousel'
import Button from './Button'
import List from './List'
import picture1 from './assets/1.png'
import picture2 from './assets/2.jpg'
import picture3 from './assets/3.png'
import picture4 from './assets/4.jpg'

const imgs = [
    {
        img: picture1,
        url: 'https://www.baidu.com/',
        title: 'jojo1',
    },
    {
        img: picture2,
        url: 'https://www.baidu.com/',
        title: 'jojo2',
    },
    {
        img: picture3,
        url: 'https://www.baidu.com/',
        title: 'jojo2',
    },
    {
        img: picture4,
        url: 'https://www.baidu.com/',
        title: 'jojo4',
    },
]

const el = <Carousel src={imgs}
    onChange={(e) => console.log(e.detail.position)}
    onClick={(e) => window.location.href = e.detail.data.url}
/>
el.mountTo(document.body)

let btn = <Button>ctn</Button>
btn.mountTo(document.body)

let list = <List data={imgs} >
    {
        ({ img, url, title }) => <div >
            <img width='500px' height='281px' src={img} />
            <a href={url}>{title}</a>
        </div>
    }
</List>
list.mountTo(document.body)
