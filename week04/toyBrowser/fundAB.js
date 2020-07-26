function fundAB(str){
    for (let i = 0; i < str.length; i++) {
        if(`${str[i]}${str[i+1]}` === 'ab')
            return true
    }
    return false
}

console.log(fundAB('abcc'))