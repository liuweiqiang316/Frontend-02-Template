function kmp(source, pattern) {
    // 计算table
    let table = Array(pattern.length).fill(0)
    {
        let i = 1, j = 0
        while (i < pattern.length) {
            if (pattern[i] === pattern[j]) {
                j++, i++
                table[i] = j
            } else {
                if (j > 0)
                    j = table[j]
                else
                    i++
            }
        }
    }
    console.log('table', table)
    // 匹配
    {
        let i = 0, j = 0
        while (i < source.length) {
            if (pattern[j] === source[i]) {
                i++, j++
            } else {
                if (j > 0)
                    j = table[j]
                else
                    i++
            }
            if (j === pattern.length) return true
        }
        return false
    }
}

function kmp2(source, pattern) {
    const sLen = source.length
    const pLen = pattern.length
    if (sLen < pLen) return false
    const buildMatch = (pattern) => {
        const pLen = pattern.length
        const match = []
        match[0] = -1
        let i, j
        for (j = 1; j < pLen; j++) {
            i = match[j - 1]
            while (i >= 0 && pattern[i + 1] !== pattern[j]) i = match[i]
            if (pattern[i + 1] === pattern[j]) match[j] = i + 1
            else match[j] = -1
        }
        console.log('match', match)
        return match
    }
    let s = 0, p = 0
    const match = buildMatch(pattern)
    while (s < sLen && p < pLen) {
        if (source[s] === pattern[p]) { s++, p++ }
        else if (p > 0) p = match[p - 1] + 1
        else s++
    }
    return p === pLen ? s - pLen : false
}

console.log('kmp', kmp('aabbcabababcde', 'abababc'))
console.log('kmp2', kmp2('aabbcabababcde', 'abababc'))