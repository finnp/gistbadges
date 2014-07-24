var urlResolve = require('url').resolve
var path = require('path')
var express = require('express')
var passport = require('passport')
var GitHubStrategy = require('passport-github').Strategy

var baseURL = process.env.URL || 'http://localhost:8000'

var app = express()
app.set('view engine', 'jade')
app.use(require('express-session')({
  secret: 'temp',
  resave: true,
  saveUninitialized: true
  }))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new GitHubStrategy({
  clientID: process.env['GITHUB_CLIENT'],
  clientSecret: process.env['GITHUB_SECRET'],
  callbackURL: urlResolve(baseURL, '/callback'),
  scope: 'gist,user'
}, function (accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    done(null, profile)
  })
}))

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

app.get('/login', passport.authenticate('github'))

app.get('/error', function (res, res) {
  res.end('sorry, erro')
})

app.get('/callback', passport.authenticate('github', {
  errorRedirect: '/error'
}), function (req, res) {
  res.redirect('/')
})

app.get('/', function (req, res) {
  console.log('Main', req.user)
  
  var options = {
    loggedin: req.isAuthenticated()
  }
  
  if(options.loggedin) {
    options.githubName = req.user.username
  }
  
  res.render('issue.jade', options)
})

// endpoint for receiving the badge
app.get('/badge/:user/:gistid/:issueid?', function (req, res) {
  res.render('badge', {
    user: req.param('user'),
    gistid: req.param('gistid'),
    issueid: req.param('issueid') || '1'
  })
})

var port = Number(process.env.PORT || 8000)

app.listen(port)

console.log('Listening on port ' + port + '...')