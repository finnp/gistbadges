var urlResolve = require('url').resolve
var path = require('path')
var express = require('express')
var passport = require('passport')
var GitHubStrategy = require('passport-github').Strategy
var Github = require('github')

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
app.use(function (req, res, next) {
  req.mytest = "wow"
  
  console.log('req', req.user)
  if(req.user && req.user.token) {
    req.github = new Github(({
      debug: true,
      version: '3.0.0'
    }))
    
    req.github.authenticate({
      type: 'oauth',
      token: req.user.token
    })
  }
  
  next()
})

passport.use(new GitHubStrategy({
  clientID: process.env['GITHUB_CLIENT'],
  clientSecret: process.env['GITHUB_SECRET'],
  callbackURL: urlResolve(baseURL, '/callback'),
  scope: 'gist,user'
}, function (accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    profile.token = accessToken
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
  // console.log('Main', req.user)
    
  var options = {}
  
  if(req.isAuthenticated()) {
    options.loggedin = true
    options.githubName = req.user.username
    
    var newGist = {
      'description': 'badge issued with GistBadges',
      'public': true,
      'files': {
        'test.txt': {
          'content': 'this is my first automatically created gist'
        }
      }
    }
    
    req.github.gists.create(newGist, function (err, res) {
      console.log(res)
    })

  } else {
    options.loggedin = false
  }
  
  res.render('issue', options)
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