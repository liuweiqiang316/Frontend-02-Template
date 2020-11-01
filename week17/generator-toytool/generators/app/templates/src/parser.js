const css = require('css') // css parser 用于解析css规则
const EOF = Symbol('EOF') // EOF: end of file

// const layout = require('./layout.js')


let currentToken = null
let currentAttribute = {}

let stack = [{ type: 'document', children: [] }]
let currentTextNode = null

let rules = [] // css 规则
function addCSSRules(text) {
    const ast = css.parse(text)
    rules.push(...ast.stylesheet.rules)
}

function cssMatch(element, selector) {
    if (!selector || !element.attributes) return false
    if (selector.charAt(0) === '#') {
        const attr = element.attributes.filter(attr => attr.name === 'id')[0]
        if (attr && attr.value === selector.replace('#', '')) return true
    } else if (selector.charAt(0) === '.') {
        const attr = element.attributes.filter(attr => attr.name === 'class')[0]
        if (attr && attr.value === selector.replace('.', '')) return true
    } else {
        if (element.tagName === selector) return true
    }
    return false
}

function specificity(selector) {
    const p = [0, 0, 0, 0]
    const selectorParts = selector.split(' ')
    for (const part of selectorParts) {
        if (part.charAt(0) === '#') {
            p[1] += 1
        } else if (part.charAt(0) === '.') {
            p[2] += 1
        } else {
            p[3] += 1
        }
    }
    return p
}

function compare(sp1, sp2) {
    if (sp1[0] - sp2[0]) return sp1[0] - sp2[0]
    if (sp1[1] - sp2[1]) return sp1[1] - sp2[1]
    if (sp1[2] - sp2[2]) return sp1[2] - sp2[2]
    return sp1[3] - sp2[3]
}

function computeCSS(element) {
    let elements = stack.slice().reverse()
    if (!element.computeStyle) element.computeStyle = {}

    for (const rule of rules) {
        const selectorParts = rule.selectors[0].split(' ').reverse()
        if (!cssMatch(element, selectorParts[0]))
            continue

        let cssMatched = false
        let j = 1
        for (let i = 0; i < elements.length; i++) {
            if (cssMatch(elements[i], selectorParts[j])) {
                j++
            }
        }
        if (j >= selectorParts.length) cssMatched = true
        if (cssMatched) {
            const sp = specificity(rule.selectors[0])
            let computeStyle = element.computeStyle
            for (const declaration of rule.declarations) {
                if (!computeStyle[declaration.property]) computeStyle[declaration.property] = {}
                if (!computeStyle[declaration.property].specificity
                    || (computeStyle[declaration.property].specificity
                        && compare(computeStyle[declaration.property].specificity, sp) < 0)
                ) {
                    computeStyle[declaration.property].value = declaration.value
                    computeStyle[declaration.property].specificity = sp
                }
            }
        }
    }
}

function emit(token) {
    let top = stack[stack.length - 1]
    if (token.type === 'startTag') {
        let element = {
            type: 'element',
            children: [],
            attributes: []
        }
        element.tagName = token.tagName

        for (const p in token) {
            if (p !== 'type' && p !== 'tagName') {
                element.attributes.push({
                    name: p,
                    value: token[p]
                })
            }
        }

        // 在startTag时,计算CSS规则
        computeCSS(element)

        top.children.push(element)
        element.parent = top
        if (!token.isSelfClosing) {
            stack.push(element)
        }
        // currentToken = null
        currentTextNode = null
    } else if (token.type === 'endTag') {
        if (top.tagName !== token.tagName) {
            throw new Error(`top.tagName: ${top.tagName}, token.tagName: ${token.tagName},Tag start end does not match!`)
        } else {
            if (top.tagName === 'style') {
                addCSSRules(top.children[0].content)
            }
            // layout(top)
            stack.pop()
        }
        // currentToken = null
        currentTextNode = null
    } else if (token.type === 'text') {
        if (currentTextNode === null) {
            currentTextNode = {
                type: 'text',
                content: ''
            }
            top.children.push(currentTextNode)
        }
        currentTextNode.content += token.content
    }
}

function data(c) {
    if (c === '<') {
        return tagOpen
    } else if (c === EOF) {
        emit({
            type: 'EOF',
        })
        return
    } else {
        emit({
            type: 'text',
            content: c
        })
        return data
    }
}

function tagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'startTag',
            tagName: ''
        }
        return tagName(c)
    } else if (c === '/') {
        return endTagOpen
    } else {
        emit({
            type: 'text',
            content: c
        })
        return data
    }
}

function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'endTag',
            tagName: ''
        }
        return tagName(c)
    } else if (c === '>') {
        return data
    } else if (c === EOF) {

    } else {

    }
}
function tagName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
    } else if (c === '/') {
        return selfClosingStartTag
    } else if (c.match(/^[a-zA-Z]$/)) {// TODO
        currentToken.tagName += c
        return tagName
    } else if (c === '>') {
        emit(currentToken)
        return data
    } else {
        currentToken.tagName += c
        return tagName
    }
}

function beforeAttributeName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
    } else if (c === '>' || c === '/' || c === EOF) {
        return afterAttributeName(c)
    } else if (c === '=') {
        // return beforeAttributeName
    } else {
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(c)
    }
}

function afterAttributeName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return afterAttributeName
    } else if (c === '/') {
        return selfClosingStartTag
    } else if (c === '=') {
        return beforeAttributeValue
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    } else if (c === EOF) {

    } else {
        currentToken[currentAttribute.name] = currentAttribute.value
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(c)
    }

}
function attributeName(c) {
    if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
        return afterAttributeName(c)
    } else if (c === '=') {
        return beforeAttributeValue
    } else if (c === '\u0000') {

    } else if (c === '"' || c === '\'' || c === '<') {

    } else {
        currentAttribute.name += c
        return attributeName
    }
}

function beforeAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
        return beforeAttributeValue
    } else if (c === '"') {
        return doubleQuotedAttributeValue
    } else if (c === '\'') {
        return singleQuotedAttributeValue
    } else if (c === '>') {

    } else {
        return unquotedAttributeValue(c)
    }
}

function doubleQuotedAttributeValue(c) {
    if (c === '"') {
        currentToken[currentAttribute.name] = currentAttribute.value
        return afterQuotedAttributeValue
    } else if (c === '\u0000') {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c
        return doubleQuotedAttributeValue
    }
}

function singleQuotedAttributeValue(c) {
    if (c === '\'') {
        currentToken[currentAttribute.name] = currentAttribute.value
        return afterQuotedAttributeValue
    } else if (c === '\u0000') {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c
        return singleQuotedAttributeValue
    }
}

function unquotedAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value
        return beforeAttributeName
    } else if (c === '/') {
        currentToken[currentAttribute.name] = currentAttribute.value
        return selfClosingStartTag
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    } else if (c === '\u0000') {

    } else if (c === '"' || c === '\'' || c === '<' || c === '=' || c === '`') {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c
        return unquotedAttributeValue
    }
}

function afterQuotedAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
    } else if (c === '/') {
        return selfClosingStartTag
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    } else if (c === EOF) {

    } else {
        currentAttribute.value += c
        return doubleQuotedAttributeValue
    }
}

function selfClosingStartTag(c) {
    if (c === '>') {
        currentToken.isSelfClosing = true
        emit(currentToken)
        return data
    } else if (c === EOF) {

    } else {

    }
}


export function parserHTML(html) {
    let state = data
    for (const c of html) {
        state = state(c)
    }
    state = state(EOF)
    return stack[0]
}