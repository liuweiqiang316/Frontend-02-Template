let http = require('http')
let archiver = require('archiver')
let child_process = require('child_process')
const querystring = require('querystring')


// 1. 打开 https://github.com/login/oauth/authorize
child_process.exec('start https://github.com/login/oauth/authorize?client_id=Iv1.e767e5138efa4100')


// 3. 创建server, 接受token, 发布
http.createServer((req, res) => {
    if (req.url.match(/^\/\?/)) {
        let query = querystring.parse(req.url.match(/^\/\?([\s\S]+)$/)[1])
        publish(query.token, req, res)
    }
}).listen(8083)

function publish(token, req, res) {
    let request = http.request({
        hostname: '127.0.0.1',
        port: 8082,
        path: `/publish?token=${token}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream'
        }
    }, response => {
        res.end()
    })


    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    })

    archive.directory('./sample/', false)

    archive.finalize()

    archive.pipe(request)
}
