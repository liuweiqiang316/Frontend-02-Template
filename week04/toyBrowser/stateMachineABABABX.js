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
    if(c === 'b') return fundA2
    return start(c)
}
function fundA2(c) {
    if(c === 'a') return fundB2
    return start(c)
}
function fundB2(c) {
    if(c === 'b') return fundA3
    return start(c)
}
function fundA3(c) {
    if(c === 'a') return fundB3
    return start(c)
}
function fundB3(c) {
    if(c === 'b') return end
    return start(c)
}
function end(c) {
    if(c === 'x') return end
    return fundA3(c)
}

console.log(match('abcabcabababx'))