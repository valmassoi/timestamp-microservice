const express = require('express')
const http = require('http')
const app = express()

function checkDate(input) {
  if (input < 0 || input >= 0)
    return 'unix'
  const unixtime = Date.parse(`${input}Z`) / 1000
  if (unixtime < 0 || unixtime >= 0)
    return 'natural'
  return 'bad'
}

function timeDecoder(input) {
  let unix, natural

  if (checkDate(input) === 'natural')
    unix = Date.parse(`${input}Z`) / 1000 // UTC
  if (checkDate(input) === 'unix')
    unix = +input

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']
  const date = new Date(unix * 1000)
  const month = monthNames[date.getUTCMonth()]
  const day = date.getUTCDate()
  const year = date.getUTCFullYear()
  natural = `${month} ${day}, ${year}`

  if (checkDate(input) === 'bad')
    unix = null, natural = null

  return JSON.stringify({ unix, natural })
}
app.use(express.static('public'))
app.all('*', (request, response, next) => {
  next()
})

app.get('/:input', (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' })
  const input = request.params.input
  const time = timeDecoder(input)
  response.end(time) // To output JSON we can use: response.send(object)
})

app.get('*', (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('404!')
})

const port = process.env.PORT || 8080 // for heroku deploy
http.createServer(app).listen(port)
console.log('Server Running')
