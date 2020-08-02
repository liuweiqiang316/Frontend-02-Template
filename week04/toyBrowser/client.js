const net = require('net')
const images = require('images')
const parser = require('./parser.js')

class Request {
    constructor(options) {
        const { method, host, path, port, headers, body } = options
        this.method = method || 'GET'
        this.host = host
        this.path = path || '/'
        this.port = port || 80
        this.headers = headers || {}
        this.body = body || {}
        if (!this.headers['Content-Type']) this.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        if (this.headers['Content-Type'] === 'application/json')
            this.bodyText = JSON.stringify(this.body)
        else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded')
            this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&')

        this.headers['Content-Length'] = this.bodyText.length
    }
    send(connection) {
        return new Promise((resolve, reject) => {
            const responseParser = new ResponseParser()
            if (connection) {
                connection.write(this.toString())
            } else {
                connection = net.createConnection({
                    port: this.port,
                    host: this.host
                }, () => connection.write(this.toString()))
            }
            connection.on('error', err => {
                console.log('connection err:', err)
                reject(err)
                connection.end()
            })
            connection.on('data', data => {
                responseParser.receive(data.toString())
                if (responseParser.isFinished) {
                    resolve(responseParser.response)
                    connection.end()
                }
            })
        })
    }
    toString() {
        const { method, path, headers, bodyText } = this
        return `${method} ${path} HTTP/1.1\r
${Object.keys(headers).map(key => `${key}: ${headers[key]}`).join('\r\n')}\r
\r
${bodyText}`
    }
}

class ResponseParser {
    constructor() {
        this.WAITING_STATUS_LINE = 0
        this.WAITING_STATUS_LINE_END = 1
        this.WAITING_HEADER_NAME = 2
        this.WAITING_HEADER_SPACE = 3
        this.WAITING_HEADER_VALUE = 4
        this.WAITING_HEADER_LINE_END = 5
        this.WAITING_HEADER_BLOCK_END = 6
        this.WAITING_BODY = 7

        this.current = this.WAITING_STATUS_LINE
        this.statusLine = ''
        this.headers = {}
        this.headerName = ''
        this.headerValue = ''
        this.bodyParser = null
    }
    get isFinished() {
        return this.bodyParser && this.bodyParser.isFinished
    }
    get response() {
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/)
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.content.join('')
        }
    }
    receive(str) {
        for (let i = 0; i < str.length; i++) {
            this.receiveChar(str.charAt(i))
        }
    }
    receiveChar(c) {
        if (this.current === this.WAITING_STATUS_LINE) {
            if (c === '\r') {
                this.current = this.WAITING_STATUS_LINE_END
            } else {
                this.statusLine += c
            }
        } else if (this.current === this.WAITING_STATUS_LINE_END) {
            if (c === '\n') {
                this.current = this.WAITING_HEADER_NAME
            }
        } else if (this.current === this.WAITING_HEADER_NAME) {
            if (c === ':') {
                this.current = this.WAITING_HEADER_SPACE
            } else if (c === '\r') {
                this.current = this.WAITING_HEADER_BLOCK_END
                if (this.headers['Transfer-Encoding'] === 'chunked')
                    this.bodyParser = new TrunkedBodyParser()
            } else {
                this.headerName += c
            }
        } else if (this.current === this.WAITING_HEADER_SPACE) {
            if (c === ' ') {
                this.current = this.WAITING_HEADER_VALUE
            }
        } else if (this.current === this.WAITING_HEADER_VALUE) {
            if (c === '\r') {
                this.current = this.WAITING_HEADER_LINE_END
                this.headers[this.headerName] = this.headerValue
                this.headerName = ''
                this.headerValue = ''
            } else {
                this.headerValue += c
            }
        } else if (this.current === this.WAITING_HEADER_LINE_END) {
            if (c === '\n') {
                this.current = this.WAITING_HEADER_NAME
            }
        } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
            if (c === '\n') {
                this.current = this.WAITING_BODY
            }
        } else if (this.current === this.WAITING_BODY) {
            this.bodyParser.receiveChar(c)
        }
    }
}

class TrunkedBodyParser {
    constructor() {
        this.WAITING_LENGTH = 0
        this.WAITING_LENGTH_LINE_END = 1
        this.READING_TRUNK = 2
        this.WAITING_NEW_LINE = 3
        this.WAITING_NEW_LINE_END = 4
        this.length = 0
        this.content = []
        this.isFinished = false
        this.current = this.WAITING_LENGTH
    }
    receiveChar(c) {
        if (this.current === this.WAITING_LENGTH) {
            if (c === '\r') {
                if (this.length === 0) {
                    this.isFinished = true
                }
                this.current = this.WAITING_LENGTH_LINE_END
            } else {
                this.length *= 16
                this.length += parseInt(c, 16)
            }
        } else if (this.current === this.WAITING_LENGTH_LINE_END) {
            if (c === '\n') {
                this.current = this.READING_TRUNK
            }
        } else if (this.current === this.READING_TRUNK) {
            this.content.push(c)
            this.length--
            if (this.length === 0) {
                this.current = this.WAITING_NEW_LINE
            }
        } else if (this.current === this.WAITING_NEW_LINE) {
            if (c === '\r') {
                this.current = this.WAITING_NEW_LINE_END
            }
        } else if (this.current === this.WAITING_NEW_LINE_END) {
            if (c === '\n') {
                this.current = this.WAITING_LENGTH
            }
        }
    }
}

function render(viewport, element) {
    if (element.style) {
        const img = images(element.style.width, element.style.height)
        if (element.style['background-color']) {
            let color = element.style['background-color'] || 'rgb(0,0,0)'
            color.match(/rgb\((\d+),(\d+),(\d+)\)/)
            img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3))
            viewport.draw(img, element.style.left || 0, element.style.top || 0)
        }
    }
    if (element.children) {
        for (const child of element.children) {
            render(viewport, child)
        }
    }
}

void async function () {
    const options = {
        method: 'POST',
        host: '127.0.0.1',
        path: '/',
        port: 8080,
        headers: {
            ['foo-bar']: 'xxx',
        },
        body: {
            name: 'lwq',
            addr: 'hubei'
        },
    }
    const request = new Request(options)
    const response = await request.send()
    const dom = parser.parserHTML(response.body)
    const viewport = images(800, 600)
    render(viewport, dom)
    viewport.save('viewport.jpg')
}()
