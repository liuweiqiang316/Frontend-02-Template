function fundABCDEF(str) {
    let fundA = false
    let fundB = false
    let fundC = false
    let fundD = false
    let fundE = false
    let fundF = false
    for (const c of str) {
        if(c === 'a'){
            fundA = true
        }else if(fundA && c === 'b'){
            fundB = true
        }else if(fundB && c === 'c'){
            fundC = true
        }else if(fundC && c === 'd'){
            fundD = true
        }else if(fundD && c === 'e'){
            fundE = true
        }else if(fundE && c === 'f'){
            fundF = true
        }else{
            fundA = false
            fundB = false
            fundC = false
            fundD = false
            fundE = false
            fundF = false
        }
    }
    return fundF
}

console.log(fundABCDEF('abcdef'))