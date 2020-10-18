import { Component, STATE, ATTRIBUTE, createElement } from './framework'

class Button extends Component {

    constructor() {
        // super()
        super()
    }

    appendChild(child) {
        this.childContainer.appendChild(child)
    }

    render(type) {
        this.childContainer = <span />
        return (<div>{this.childContainer}</div>).root
    }
}

export default Button
