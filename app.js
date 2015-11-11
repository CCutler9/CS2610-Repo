var express = require('express')
var exphbs = require('express-handlebars')
var bodyParser = require('body-parser')
var path = require('path')
var request = require('request')
var querystring = require('querystring')
var session = require('express-session')
var cfg = require('./config')

var app = express()

app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  cookieName: 'session',
  secret: 'lkejoaihlnvpoaiehpqrploqpiewrnb',
  resave: false,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: false}))

app.get('/', function(req, res) {
  res.render('index', {
    layout: 'base',
    title: 'Login Page',
    welcome: 'Welcome to the login page'
  })
})

app.get('/dashboard', function(req, res) {
  res.render('dashboard', {
		layout: 'auth_base',
    title: 'User Dashboard!',
    welcome: 'Welcome to your dashboard!'
  })
})

app.get('/search', function(req, res) {
  res.render('search', {
		layout: 'auth_base',
    title: 'Search Page',
    welcome: 'Welcome to the search page!'
  })
})

app.get('/profile', function(req, res) {
  res.render('profile', {
    layout: 'auth_base',
    title: 'Profile Page',
    welcome: 'Welcome to your profile page!'
  })
})

app.get('/authorize', function(req, res) {
  var qs = {
    client_id: cfg.client_id,
    redirect_uri: cfg.redirect_uri,
    response_type: 'code'
  }
  var query = querystring.stringify(qs)
  var url = 'https://api.instagram.com/oauth/authorize/?' + query

  res.redirect(url)
})

app.get('/auth/finalize', function(req, res, next) {
  if(req.query.error == 'access_denied') {
    return res.redirect('/')
  }

  var post_data = {
    client_id: cfg.client_id,
    client_secret: cfg.client_secret,
    redirect_uri: cfg.redirect_uri,
    grant_type: 'authorization_code',
    code: req.query.code
  }

  var options = {
    url: 'https://api.instagram.com/oauth/access_token',
    form: post_data
  }

  request.post(options, function(error, response, body) {
    try {
      var data = JSON.parse(body)
    }
    catch(err){
      return next(err)
    }
    console.log(data)
    req.session.access_token = data.access_token
    res.redirect('/feed')
  })
})

app.get('/feed', function(req, res, next) {
  var options = {
    url: 'https://api.instagram.com/v1/users/self/feed?access_token=' + req.session.access_token
  }

  request.get(options, function(error, response, body) {
    try {
      var feed = JSON.parse(body)
      if (feed.meta.code > 200) {
        return next(feed.meta.error_message)
      }
    }
    catch(err){
      return next(err)
    }
    console.log(feed)
    res.render('feed', {
      feed: feed.data
    })
  })
})

app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err,
    error: {}
  })
})

app.listen(3000)
