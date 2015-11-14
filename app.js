var express = require('express')
var exphbs = require('express-handlebars')
var bodyParser = require('body-parser')
var path = require('path')
var request = require('request')
var session = require('express-session')
var indexRoute = require('./routes/index')
var userRoutes = require('./routes/user')

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

app.use('/', indexRoute)
app.use('/user', userRoutes)

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
