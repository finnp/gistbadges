var urlResolve = require('url').resolve
var path = require('path')
var express = require('express')
var passport = require('passport')
var GitHubStrategy = require('passport-github').Strategy
var handlebars = require('express3-handlebars')
var bodyParser = require('body-parser')
var createBadge = require('./createbadge')

var baseURL = process.env.URL || 'http://localhost:8000'

var app = express()
app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({extended: true}))

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
  res.end('GitHub login failed, try again.')
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
    
  } else {
    options.loggedin = false
  }
  
  res.render('issue', options)
})

app.post('/add', function (req, res) {
  var badge = {
    name: req.body.badgename,
    description: req.body.badgedesc,
    receiver: req.body.badgereceiver,
    criteria: req.body.badgereq,
    issuer: {
      name: req.user.username
    }
  }
  createBadge(req.user.token, badge, function (err, gist) {
    if(err) {
      res.end('Error creating. ' + err)
    } else {
      res.render('created', {
        gistid: gist.id,
        gisturl: gist.html_url,
        shareurl: urlResolve(baseURL, '/badge/' + req.user.username + '/' + gist.id)
      })
    }
    
  })
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