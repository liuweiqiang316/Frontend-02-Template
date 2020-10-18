function createElement(type, attributes, ...children) {
    let element
    if (typeof type === 'string')
        element = new ElementWrapper(type)
    else
        element = new type({ attributes, children })


    for (let name in attributes) {
        element.setAttribute(name, attributes[name])
    }
    let processChildren = children => {
        for (let child of children) {
            if ((typeof child === 'object' && (child instanceof Array))) {
                processChildren(child)
                continue
            }
            if (typeof child === 'string') {
                child = new TextWrapper(child)
            }
            element.appendChild(child.root)
        }
    }
    processChildren(children)
    return element
}

export const STATE = Symbol('state')
export const ATTRIBUTE = Symbol('attribute')

class Component {
    constructor(type) {
        this.root = this.render(type)
        if (!this[ATTRIBUTE])
            this[ATTRIBUTE] = Object.create(null)
        this[STATE] = Object.create(null)
    }

    render(type) {
        return document.createElement(type)
    }

    setAttribute(name, value) {
        this[ATTRIBUTE][name] = value
    }

    mountTo(parent) {
        parent.appendChild(this.root)
    }
    triggerEvent(type, args) {
        this[ATTRIBUTE]['on' + type.replace(/^[\s\S]/, s => s.toUpperCase())](new CustomEvent(type, { detail: args }))
    }
}

class ElementWrapper extends Component {

    render(type) {
        return document.createElement(type)
    }

    setAttribute(name, value) {
        this.root.setAttribute(name, value)
    }
    appendChild(child) {
        this.root.appendChild(child)
    }
}
class TextWrapper extends Component {
    render(text) {
        return document.createTextNode(text)
    }
}

export {
    createElement,
    Component,
    ElementWrapper,
    TextWrapper
}
