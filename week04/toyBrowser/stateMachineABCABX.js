function match(str) {
    let state = start
    for (const c of str) {
        state = state(c)
    }
    return state === end
}

function start(c) {
    if(c === 'a') return fundB
    return start
}
function fundB(c) {
    if(c === 'b') return fundC
    return start(c)
}
function fundC(c) {
    if(c === 'c') return fundA2
    return start(c)
}
function fundA2(c) {
    if(c === 'a') return fundB2
    return start(c)
}
function fundB2(c) {
    if(c === 'b') return end
    return start(c)
}
function end(c) {
    if(c === 'x') return end
    return fundC(c)
}

console.log(match('abxabxabxabcabx'))