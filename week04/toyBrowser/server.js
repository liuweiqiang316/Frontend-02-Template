const http = require('http')


const html = `<html>
<head>
  <title>OneTab</title>
  <link href="onetab.css" rel="stylesheet" type="text/css" />
  <link rel="shortcut icon" href="images/extension-icon64.png" />
</head>
<body style="margin:0; padding:0; font-family: 'Open Sans', 'Helvetica Neue', Arial, sans-serif; font-weight: 400; font-size:14px">
<div id="settingsDiv"></div>
<div id="contentAreaDiv"></div>
<div id="ext">12345</div>
<div/>
</body>
</html>`

http.createServer((request, response) => {
    let body = []
    request.on('error', (err) => {
        console.log('error ', error)
    }).on('data', (chunk) => {
        body.push(chunk.toString())
    }).on('end', () => {
        console.log('end body: ', body)
        // body = Buffer.concat(body).toString()
        response.writeHead(200, { 'Content-Type': 'text/html' })
        // response.end('Hello World\r\n')
        response.end(html)
    })
}).listen(8080)

console.log('http server started at port: 8080')