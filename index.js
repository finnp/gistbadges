var express = require('express')
var app = express()

var path = require('path')
var express = require('express')
var app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// endpoint for issuing the badge
app.get('/badge/:user/:gistid/:issueid?', function (req, res) {
  res.render('badge', {
    user: req.param('user'),
    gistid: req.param('gistid'),
    issueid: req.param('issueid') || '1'
  })
})

var port = 8000
app.listen(port)
console.log('Listening on port ' + 8000 + '...')