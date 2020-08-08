function match(selector, element) {
    let flag = true
    const combineSelectorList = selector.split(' ')
    for (const combineSelector of combineSelectorList) {
        if (!combineSelectorMath(combineSelector, element)) {
            flag = false
            break
        } else {
            element = element.parentElement
        }
    }
    return flag
}

function combineSelectorMath(combineSelector, el) {
    const simpleSelectorList = getSimpleSelectorList(combineSelector)
    let flg = true
    for (const simpleSelector of simpleSelectorList) {
        if (!simpleSelectorMatch(simpleSelector, el)) {
            flg = false
            break
        }
    }
    return flg
}

function getSimpleSelectorList(combineSelector) {
    const selectorList = []
    const selector = ''

    const attrStart = (c) => {
        if (c === ']') {
            selector += c
            selectorList.push(selector)
            selector = ''
            return selectState
        } else {
            selector += c
            return attrStart
        }
    }
    const selectState = (c) => {
        if (c === '[') {
            selectorList.push(selector)
            selector = ''
            return attrStart(c)
        } else {
            selector += c
            return selectState
        }
    }
    const data = (c) => {
        if (c === '#' || c === '.' || c === '[') {
            selectorList.push(selector)
            selector = ''
            return selectState(c)
        } else {
            selector += c
            return data
        }
    }
    let state = data
    for (const c of combineSelector) {
        state = state(c)
    }
}

function simpleSelectorMatch(simpleSelector, el) {
    let flg = false
    if (simpleSelector.startsWith('#')) {
        flg = simpleSelector === el.getAttribute('id')
    } else if (simpleSelector.startsWith('.')) {
        flg = simpleSelector === el.getAttribute('class')
    } else if (simpleSelector.startsWith('[')) {
        const selector = simpleSelector.slice(1, -1)
        const attrObj = getAttrAndVal(selector)
        flg = attrConditionalMatch(attrObj, el)
    } else {
        flg = simpleSelector === el.tagName.toLocaleLowerCase()
    }
    return flg
}

function getAttrAndVal(selector) {
    const o = {
        attr: '',
        value: '',
        type: null,
    }

    const getVal = (c) => {
        o.value += c
        return getVal
    }
    const waitEqual = (c) => {
        return getVal
    }
    const data = (c) => {
        if (c === '~') {
            o.type = c
            return waitEqual
        } else if (c === '|') {
            o.type = c
            return waitEqual
        } else if (c === '^') {
            o.type = c
            return waitEqual
        } else if (c === '$') {
            o.type = c
            return waitEqual
        } else if (c === '*') {
            o.type = c
            return waitEqual
        } else if (c === '=') {
            o.type = c
            return getVal
        } else {
            o.attr += c
            return data
        }
    }
    let state = data
    for (const c of selector) {
        state = state(c)
    }
    return o
}

function attrConditionalMatch(attrObj, el) {
    const { attr, type, value } = attrObj
    const valOfAttribute = el.getAttribute(attr)
    if(!valOfAttribute) return false
    if (type === '~') {
        return valOfAttribute.includes(' ') && valOfAttribute.split(' ').filter(item => item === value).length > 0
    } else if (type === '|') {
        return valOfAttribute === value || valOfAttribute.startsWith(`${value}-`)
    } else if (type === '^') {
        return valOfAttribute.startsWith(value)
    } else if (type === '$') {
        return valOfAttribute.endsWith(value)
    } else if (type === '*') {
        return valOfAttribute.includes(value)
    } else if (type === '=') {
        return valOfAttribute === value
    } else {
        return true
    }
}
