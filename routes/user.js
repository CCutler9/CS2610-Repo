var express = require('express');
var router = express.Router();

router.get('/dashboard', function(req, res) {
  res.render('dashboard', {
		layout: 'auth_base',
    title: 'User Dashboard!',
    welcome: 'Welcome to your dashboard!'
  })
})

router.get('/search', function(req, res) {
  res.render('search', {
		layout: 'auth_base',
    title: 'Search Page',
    welcome: 'Welcome to the search page!'
  })
})

module.exports = router
