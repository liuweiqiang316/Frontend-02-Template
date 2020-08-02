function getStyle(el) {
    if (!el.style) el.style = {}
    for (const prop in el.computeStyle) {
        const p = el.computeStyle.value
        el.style[prop] = el.computeStyle[prop].value

        if (el.style[prop].toString().match(/px$/) || el.style[prop].toString().match(/^[0-9\.]+$/)) {
            el.style[prop] = parseInt(el.style[prop])
        }
    }
    return el.style
}

function layout(el) {
    if (!el.computeStyle) return
    const elStyle = getStyle(el)
    if (elStyle.display !== 'flex') return
    const items = el.children.filter(e => e.type === 'element')
    items.sort((a, b) => (a.order || 0) - (b.order || 0))
    const style = elStyle;

    ['width', 'height'].forEach(size => {
        if (!style[size] || style[size] === 'auto' || style[size] === '') {
            style[size] = null
        }
    })
    if (!style.flexDirection || style.flexDirection === 'auto') style.flexDirection = 'row'
    if (!style.alignItems || style.alignItems === 'auto') style.alignItems = 'stretch'
    if (!style.justifyContent || style.justifyContent === 'auto') style.justifyContent = 'flex-start'
    if (!style.flexWrap || style.flexWrap === 'auto') style.flexWrap = 'nowrap'
    if (!style.alignContent || style.alignContent === 'auto') style.alignContent = 'stretch'

    let mainSize, mainStart, mainEnd, mainSign, mainBase,
        crossSize, crossStart, crossEnd, crossSign, crossBase
    if (style.flexDirection === 'row') {
        mainSize = 'width'
        mainStart = 'left'
        mainEnd = 'right'
        mainSign = +1
        mainBase = 0
        crossSize = 'height'
        crossStart = 'top'
        crossEnd = 'bottom'
    }
    if (style.flexDirection === 'row-reverse') {
        mainSize = 'width'
        mainStart = 'right'
        mainEnd = 'left'
        mainSign = -1
        mainBase = style.width
        crossSize = 'height'
        crossStart = 'top'
        crossEnd = 'bottom'
    }
    if (style.flexDirection === 'column') {
        mainSize = 'height'
        mainStart = 'top'
        mainEnd = 'bottom'
        mainSign = +1
        mainBase = 0
        crossSize = 'width'
        crossStart = 'left'
        crossEnd = 'right'
    }
    if (style.flexDirection === 'column-reverse') {
        mainSize = 'height'
        mainStart = 'bottom'
        mainEnd = 'top'
        mainSign = -1
        mainBase = style.height
        crossSize = 'width'
        crossStart = 'left'
        crossEnd = 'right'
    }
    if (style.flexWrap === 'wrap-reverse') {
        const tmp = crossStart
        crossStart = crossEnd
        crossEnd = tmp
        crossSign = -1
    } else {
        crossBase = 0
        crossSign = 1
    }

    let isAutoMainSize = false
    if (!style[mainSize]) {
        elStyle[mainsize] = 0
        for (let i = 0; i < items.length; i++) {
            const item = items[i]
            const itemStyle = getStyle(item)
            if (itemStyle[mainSize] !== null
                || itemStyle[mainSize] !== '') {
                elStyle[mainsize] = elStyle[mainsize] + itemStyle[mainSize]
            }
        }
        isAutoMainSize = true
    }

    const flexLine = []
    const flexLines = [flexLine]

    let mainSpace = elStyle[mainSize]
    let crossSpace = 0

    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const itemStyle = getStyle(item)

        if (itemStyle[mainSize] === null) {
            itemStyle[mainSize] = 0
        }
        if (itemStyle.flex) {
            flexLine.push(item)
        } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
            mainSpace -= itemStyle[mainSize]
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize])
            }
            flexLine.push(item)
        } else {
            if (itemStyle[mainSize] > style[mainSize]) {
                itemStyle[mainSize] = style[mainSize]
            }
            if (mainSpace < itemStyle[mainSize]) {
                flexLine.mainSpace = mainSpace
                flexLine.crossSpace = crossSpace
                flexLine = [item]
                flexLines.push(flexLine)
                mainSpace = style[mainSize]
                crossSpace = 0
            } else {
                flexLine.push(item)
            }
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize])
            }
            mainSpace -= itemStyle[mainSize]
        }
    }
    flexLine.mainSpace = mainSpace

    if (style.flexWrap === 'nowrap' || isAutoMainSize) {
        flexLine.crossSpace = (style[crossSize] !== (void 0)) ? style[crossSize] : crossSpace
    } else {
        flexLine.crossSpace = crossSpace
    }
    if (mainSpace < 0) {
        const scale = style[mainSize] / (style[mainSize] - mainSpace)
        const currMain = mainBase
        for (let i = 0; i < items.length; i++) {
            const item = items[item]
            const itemStyle = getStyle(item)
            if (itemStyle.flex) {
                itemStyle[mainSize] = 0
            }
            itemStyle[mainSize] = itemStyle[mainSize] * scale
            itemStyle[mainStart] = currMain
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
            mainSize = itemStyle[mainEnd]
        }
    } else {
        flexLines.forEach((items) => {
            const mainSpace = items.mainSpace
            let flexTotal = 0
            for (let i = 0; i < items.length; i++) {
                const item = items[i]
                const itemStyle = getStyle(item)
                if (itemStyle.flex !== null && itemStyle.flex !== (void 0)) {
                    flexTotal += itemStyle.flex
                    continue
                }
            }
            if (flexTotal > 0) {
                let currMain = mainBase
                for (let i = 0; i < items.length; i++) {
                    const item = items[i]
                    const itemStyle = getStyle(item)
                    if (itemStyle.flex) {
                        itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex
                    }
                    itemStyle[mainStart] = currMain
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
                    currMain = itemStyle[mainEnd]
                }
            } else {
                let currMain, step
                if (style.justifyContent === 'flex-start') {
                    currMain = mainBase
                    step = 0
                }
                if (style.justifyContent === 'flex-end') {
                    currMain = mainSpace * mainSign + mainBase
                    step = 0
                }
                if (style.justifyContent === 'center') {
                    currMain = mainSpace / 2 * mainSign + mainBase
                    step = 0
                }
                if (style.justifyContent === 'space-between') {
                    step = mainSpace / (items.length - 1) * mainSign
                    currMain = mainBase
                }
                if (style.justifyContent === 'space-around') {
                    step = mainSpace / items.length * mainSign
                    currMain = step / 2 + mainBase
                }
                for (let i = 0; i < items.length; i++) {
                    const item = items[i]
                    const itemStyle = getStyle(item)
                    itemStyle[mainStart] = currMain
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
                    currMain = itemStyle[mainEnd] + step
                }
            }
        })
    }

    if (!style[crossSize]) {
        crossSpace = 0
        elStyle[crossSize] = 0
        for (let i = 0; i < flexLines.length; i++) {
            elStyle[crossSize] = elStyle[crossSize] + flexLines[i].crossSpace
        }
    } else {
        crossSpace = style[crossSize]
        for (let i = 0; i < flexLines.length; i++) {
            crossSpace -= flexLines[i].crossSpace
        }
    }

    if (style.flexWrap === 'wrap-reverse') {
        crossBase = style[crossSize]
    } else {
        crossBase = 0
    }

    const lineSize = style[crossSize] / flexLines.length
    let step
    if (style.alignContent === 'flex-start') {
        crossBase += 0
        step = 0
    }
    if (style.alignContent === 'flex-end') {
        crossBase += crossSign * crossSpace
        step = 0
    }
    if (style.alignContent === 'center') {
        crossBase += crossSign * crossSpace / 2
        step = 0
    }
    if (style.alignContent === 'space-between') {
        crossBase += 0
        step = crossSpace / (flexLines.length - 1)
    }
    if (style.alignContent === 'space-around') {
        step = crossSpace / (flexLines.length)
        crossBase += crossSign * step / 2
    }
    if (style.alignContent === 'stretch') {
        crossBase += 0
        step = 0
    }
    flexLines.forEach((items) => {
        const lineCrossSize = style.alignContent === 'stretch' ?
            items.crossSpace + crossSpace / flexLines.length :
            items.crossSpace
        for (let i = 0; i < items.length; i++) {
            const item = items[i]
            const itemStyle = getStyle(item)
            const align = itemStyle.alignSelf || style.alignItems
            if (item === null) {
                itemStyle[crossSize] = (align === 'stretch') ?
                    lineCrossSize : 0
            }
            if (align === 'flex-start') {
                itemStyle[crossStart] = crossBase
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
            }
            if (align === 'flex-end') {
                itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize
                itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize]
            }
            if (align === 'center') {
                itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
            }
            if (align === 'stretch') {
                itemStyle[crossStart] = crossBase
                itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) ? itemStyle[crossSize] : lineCrossSize)
                itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
            }
        }
        crossBase += crossSign * (lineCrossSize + step)
    })
}

module.exports = layout