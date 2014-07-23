var express = require('express')
var app = express()

var path = require('path')
var express = require('express')
var app = express()

var githubOauth = require('github-oauth')({
  githubClient: process.env['GITHUB_CLIENT'],
  githubSecret: process.env['GITHUB_SECRET'],
  baseURL: process.env.URL || 'http://localhost',
  loginURI: '/login',
  callbackURI: '/callback',
  scope: 'user'
})


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.get('/', function (req, res) {
  res.render('issue')
})

// endpoint for receiving the badge
app.get('/badge/:user/:gistid/:issueid?', function (req, res) {
  res.render('badge', {
    user: req.param('user'),
    gistid: req.param('gistid'),
    issueid: req.param('issueid') || '1'
  })
})

// github login
githubOauth.addRoutes(app)

var port = Number(process.env.PORT || 8000)
app.listen(port)
console.log('Listening on port ' + 8000 + '...')