import http from 'http'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import url from 'url'
import util from 'util'

const readFile = util.promisify(fs.readFile)

const port = 3010

http.createServer(async (req, res) => {
  const urlPathname = url.parse(req.url || '').pathname || 'index.html'
  const contentType = urlPathname.endsWith('.js')
    ? 'text/javascript; charset=utf-8'
      : urlPathname.endsWith('.css')
        ? 'text/css; charset=utf-8'
        : 'text/html; charset=utf-8'

  try {
    const content = await readFile(path.join(__dirname, urlPathname))

    res.writeHead(200, { 'Content-type': contentType })
    res.write(content)
    res.end()
  } catch (e) {
    process.stdout.write(`Some errors happened: ${e.toString()}\n`)
  }
}).listen(port, () => {
  const serverUrl = `http://localhost:${port}/index.html`
  process.stdout.write(`Server start at ${serverUrl}\n`)
  exec(`open ${serverUrl}`)
})
