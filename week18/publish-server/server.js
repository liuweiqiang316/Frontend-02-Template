let http = require('http')
let https = require('https')
const unzipper = require('unzipper')
const querystring = require('querystring')

// 2. 接收code, 用code + client_id + client_secret 获取token
function auth(req, res) {
    let query = querystring.parse(req.url.match(/^\/auth\?([\s\S]+)$/)[1])
    getToken(query.code, (info) => {
        // res.write(JSON.stringify(info))
        res.write(`<a href='http://localhost:8083/?token=${info.access_token}' >publish</a>`)
        res.end()
    })
}

function getToken(code, callback) {
    const client_id = 'Iv1.e767e5138efa4100'
    const client_secret = 'client_secret'
    let request = https.request({
        hostname: 'github.com',
        path: `/login/oauth/access_token?code=${code}&client_id=${client_id}&client_secret=${client_secret}`,
        port: '443',
        method: 'POST',
    }, (response) => {
        let body = ''
        response.on('data', chunk => {
            body += chunk.toString()
        })
        response.on('end', chunk => {
            callback(querystring.parse(body))
        })
    })
    request.end()
}

// 4. publish路由, 用token获取用户信息, 检查权限,发布
function publish(req, res) {
    let query = querystring.parse(req.url.match(/^\/publish\?([\s\S]+)$/)[1])
    getUser(query.token, (info) => {
        if (info.login === 'liuweiqiang316') req.pipe(unzipper.Extract({ path: './public/' }))
        req.on('end', () => res.end('publish success'))
    })
}

function getUser(token, callback) {
    let request = https.request({
        hostname: 'api.github.com',
        path: '/user',
        method: 'GET',
        headers: {
            Authorization: `token ${token}`,
            'User-Agent': 'lwq-toy-publish',
        }
    }, response => {
        let body = ''
        response.on('data', chunk => {
            body += chunk.toString()
        })
        response.on('end', chunk => {
            callback(JSON.parse(body))
        })
    })
    request.end()
}

http.createServer((req, res) => {
    if (req.url.match(/^\/auth\?/)) {
        return auth(req, res)
    }
    if (req.url.match(/^\/publish\?/)) {
        return publish(req, res)
    }
}).listen(8082)