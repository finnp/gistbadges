var express = require('express')
var app = express()

var path = require('path')
var express = require('express')
var app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.get('/badge/:user/:gistid', function (req, res) {
  res.render('badge', {
    user: req.param('user'),
    gistid: req.param('gistid')
  })
})

var port = 8000
app.listen(port)
console.log('Listening on port ' + 8000 + '...')