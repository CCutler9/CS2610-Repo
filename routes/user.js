var express = require('express');
var router = express.Router();
var request = require('request');
var db = require('../db')
var Users = require('../models/users')

router.get('/dashboard', function(req, res, next) {
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
    res.render('dashboard', {
      layout: 'auth_base',
      title: 'Dashboard',
      feed: feed.data
    })
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
    title: 'Profile',
    instauser: req.session.user
  })
})

router.post('/profile', function(req, res) {

    var user = req.body
    Users.insert(user, function(result) {
      req.session.userId = result.ops[0]._id
      res.redirect('/user/userprofile')
    })
})

router.get('/userprofile', function(req, res) {
  if (req.session.userId) {
    Users.find(req.session.userId, function(document) {
      if (!document) return res.redirect('/user/profile')
      console.log(document)

      res.render('userprofile', {
        layout: 'auth_base',
        title: 'Profile',
        user: document,
        instauser: req.session.user
      })
    })
  }
  else {
    res.redirect('/user/profile')
  }
})

router.post('/userprofile', function(req, res) {
  var user = req.body
  Users.update(user, function(result) {
    res.render('userprofile', {
      layout: 'auth_base',
      title: 'Profile',
      user: user,
      success: 'User updated successfully!'
    })
  })
})

module.exports = router
