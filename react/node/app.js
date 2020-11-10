const express = require('express')
const app = express()

app.use('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

app.use(express.static('./dist'))

app.get('/home', (req, res) => {
  res.send(req.query)
})


app.listen(1111, () => { console.log('serve running at localhost:1111') })