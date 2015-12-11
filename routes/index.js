var express = require('express')
var router = express.Router()
var request = require('request')
var querystring = require('querystring')
var cfg = require('../config')
var Users = require('../models/users.js')

router.get('/', function(req, res) {
  res.render('index',{
    user: req.session.user,
    title: 'Home'
  })
})

router.get('/authorize', function (req, res) {
  var qs = {
    client_id: cfg.client_id,
    redirect_uri: cfg.redirect_uri,
    response_type: 'code'
  }
  var query = querystring.stringify(qs)
  var url = 'https://api.instagram.com/oauth/authorize/?' + query

  res.redirect(url)
})

router.get('/auth/finalize', function(req, res, next) {
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
      var user = data.user
    }
    catch(err){
      return next(err)
    }

    req.session.access_token = data.access_token
		req.session.user = data.user
		req.session.userId = data.user.id

    user._id = user.id
    delete user.id

    Users.find(user._id, function(document) {
      if (!document) {
        Users.insert(user, function(result) {
          res.redirect('/')
        })
      } else {
        req.session.user = document
        res.redirect('/user/dashboard')
      }
    })
  })
})

module.exports = router
