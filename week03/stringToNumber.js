function stringToNumber(str, radix = 10) {
    if(![2, 8, 10, 16].includes(radix)) throw new Error(`不支持${radix}进制转换`)
    const zeroCodePointAt = '0'.codePointAt()
    const nineCodePointAt = '9'.codePointAt()
    const plusCodePointAt = '+'.codePointAt()
    const minusCodePointAt = '-'.codePointAt()
    const dotCodePointAt = '.'.codePointAt()
    const eCodePointAt = 'e'.codePointAt()
    const ECodePointAt = 'E'.codePointAt()
    const aCodePointAt = 'a'.codePointAt()
    const fCodePointAt = 'f'.codePointAt()
    const ACodePointAt = 'A'.codePointAt()
    const FCodePointAt = 'F'.codePointAt()
    const binaryCodePointList = [plusCodePointAt, minusCodePointAt] // 2
    const octonaryCodePointList = [plusCodePointAt, minusCodePointAt] // 8
    const decimalCodePointList = [plusCodePointAt, minusCodePointAt, dotCodePointAt, eCodePointAt, ECodePointAt] // 10
    const hexCodePointList = [plusCodePointAt, minusCodePointAt] // 16
    const afCodePointList = []
    const AFCodePointList = []
    for (let i = zeroCodePointAt; i <= nineCodePointAt; i++) {
        if(i < '2'.codePointAt()) binaryCodePointList.push(i)
        if(i < '8'.codePointAt()) octonaryCodePointList.push(i)
        decimalCodePointList.push(i)
        hexCodePointList.push(i)
    }
    for (let i = aCodePointAt; i <= fCodePointAt; i++) {
        hexCodePointList.push(i)
        afCodePointList.push(i)
    }
    for (let i = ACodePointAt; i <= FCodePointAt; i++) {
        hexCodePointList.push(i)
        AFCodePointList.push(i)
    }
    let notConvert = false
    for (let i = 0; i < str.length; i++) {
        let char = str[i]
        if(!binaryCodePointList.includes(char.codePointAt()) && radix === 2){
            notConvert = true
            break
        }
        if(!octonaryCodePointList.includes(char.codePointAt()) && radix === 8){
            notConvert = true
            break
        }
        if(!decimalCodePointList.includes(char.codePointAt()) && radix === 10){
            notConvert = true
            break
        }
        if(!hexCodePointList.includes(char.codePointAt()) && radix === 16){
            notConvert = true
            break
        }
    }
    const err = new Error(`${str}不能转换成数字`)
    if(notConvert) throw err
    let num = 0
    let noSignStr = str
    let sign = ''
    if(str.startsWith('-') || str.startsWith('+')) noSignStr = str.substring(1), sign = str.substring(0,1)
    if(radix === 10){
        const reg1 = /^(\+|-)?\d+\.?$|^(\+|-)?\.\d+$|^(\+|-)?\d+\.\d+$/
        const reg2 = /^(\+|-)?\d+\.?(e|E)(\+|-)?\d+$|^(\+|-)?\.\d+(e|E)(\+|-)?\d+$|^(\+|-)?\d+\.\d+(e|E)(\+|-)?\d+$/
        if(!reg1.test(str) && !reg2.test(str)) throw err
        let intNum  = 0
        let fractionNum  = 0
        let exponent = 0
        let noSignIntStr = noSignStr.split('.')[0]
        let fractionStr = noSignStr.split('.')[1]
        let exponentStr = ''
        if(str.includes('e')) {
            let index = noSignStr.indexOf('e')
            if(noSignStr.includes('.')) index = noSignStr.indexOf('e') > noSignStr.indexOf('.') ? noSignStr.indexOf('.') : noSignStr.indexOf('e')
            noSignIntStr = noSignStr.substring(0, index)
            fractionStr = noSignStr.split('e')[0].split('.')[1]
            exponentStr = noSignStr.split('e')[1]
        }
        if(str.includes('E')) {
            let index = noSignStr.indexOf('E')
            if(noSignStr.includes('.')) index = noSignStr.indexOf('E') > noSignStr.indexOf('.') ? noSignStr.indexOf('.') : noSignStr.indexOf('E')
            noSignIntStr = noSignStr.substring(0, index)
            fractionStr = noSignStr.split('E')[0].split('.')[1]
            exponentStr = noSignStr.split('E')[1]
        }
        for (let i = 0; i < noSignIntStr.length; i++) {
            intNum = intNum * radix + noSignIntStr[i].codePointAt() - zeroCodePointAt
        }
        if(fractionStr)
            for (let i = 0; i < fractionStr.length; i++) {
                fractionNum = fractionNum  + (fractionStr[i].codePointAt() - zeroCodePointAt) * 10 ** -(i+1)
            }
        if(exponentStr)
            for (let i = 0; i < exponentStr.length; i++) {
                exponent = exponent * 10 + exponentStr[i].codePointAt() - zeroCodePointAt
            }
        num = (intNum + fractionNum) * 10 ** exponent
        return num
    }
    for (let i = 0; i < noSignStr.length; i++) {
        let tmpNum = noSignStr[i].codePointAt() - zeroCodePointAt
        if(afCodePointList.includes(noSignStr[i].codePointAt())) tmpNum = noSignStr[i].codePointAt() - zeroCodePointAt - 39
        if(AFCodePointList.includes(noSignStr[i].codePointAt())) tmpNum = noSignStr[i].codePointAt() - zeroCodePointAt - 7
        num = num * radix + tmpNum
    }
    if(sign && sign === '-') num = num * -1
    return num
}

export default stringToNumber