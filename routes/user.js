var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/dashboard', function(req, res) {
  res.render('dashboard', {
		layout: 'auth_base',
    title: 'Dashboard'
  })
})

var tagName = '';

router.get('/search/:tagname', function(req, res) {
  tagName = req.params.tagname
  res.redirect('/user/search')
})

router.get('/search', function(req, res, next) {
  if(tagName === ''){
    var options = {
      url : 'https://api.instagram.com/v1/media/popular?access_token=' + req.session.access_token
    }
  }else{
    var options = {
      url : 'https://api.instagram.com/v1/tags/' + tagName + '/media/recent?access_token=' + req.session.access_token
    }
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
    res.render('search', {
      layout: 'auth_base',
      title: 'Search',
      feed: feed.data
    })
  })
})

router.post('/search', function(req, res, next) {
  var tagName = req.body.query
  var options = {
    url : 'https://api.instagram.com/v1/tags/' + tagName + '/media/recent?access_token=' + req.session.access_token
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
    res.render('search', {
      layout: 'auth_base',
      title: 'Search',
      feed: feed.data
    })
  })
})


router.get('/profile', function(req, res) {
  res.render('profile', {
    layout: 'auth_base',
    title: 'Profile'
  })
})

module.exports = router
