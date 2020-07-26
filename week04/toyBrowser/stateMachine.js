function match(str) {
    let state = start
    for (const c of str) {
        state = state(c)
    }
    return state === end
}

function start(c) {
    if(c === 'a'){
        return fundB
    }else{
        return start
    }
}

function fundB(c) {
    if(c === 'b'){
        return fundC
    }else{
        return start(c)
    }
}

function fundC(c) {
    if(c === 'c'){
        return fundD
    }else{
        return start(c)
    }
}

function fundD(c) {
    if(c === 'd'){
        return fundE
    }else{
        return start(c)
    }
}

function fundE(c) {
    if(c === 'e'){
        return end
    }else{
        return start(c)
    }
}

function end(c) {
    if(c === 'f') return end
    return start(c)
}

console.log(match('aaa'))