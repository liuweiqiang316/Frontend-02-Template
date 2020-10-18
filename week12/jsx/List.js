import { Component, STATE, ATTRIBUTE, createElement } from './framework'

class List extends Component {

    constructor(props) {
        super(props)
    }

    appendChild(child) {
        this.template = child
    }

    render(props) {
        this[ATTRIBUTE] = Object.create(null)
        this[ATTRIBUTE].data = props.attributes.data
        this.children = this[ATTRIBUTE].data.map(props.children[0])
        return (<div>{this.children}</div>).root
    }
}

export default List
