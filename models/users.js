var assert = require('assert')
var db = require('../db')
var ObjectId = require('mongodb').ObjectId

exports.insert = function(user, callback) {
  //get the users collection
  var collection = db.get().collection('users')
  //insert a user
  collection.insert(user, function(err, result) {
    assert.equal(err, null)
    assert.equal(1, result.result.n)
    assert.equal(1, result.ops.length)
    console.log('Inserted 1 document into the users collection')
    callback(result)
  })
}

exports.find = function(id, callback) {
  //get the users collection
  var collection = db.get().collection('users')
  //find a user by _id
  collection.findOne({'_id': id}, function(err, document) {
    console.log('Found 1 user document')
    console.log(document)
    callback(document)
  })
}

exports.update = function(user, callback) {
  //get the users collection
  var collection = db.get().collection('users')
console.log('inside update')
  //update the user
  //{$set: user}
  collection.update({'_id': user._id}, {$set: user}, function(err, result) {
    assert.equal(err, null)
    assert.equal(1, result.result.n)
    console.log('Updated 1 document in the users collection')
    callback(result)
  })

  //req.session.user = user
}

exports.addTag = function(userId, tag, callback) {
  //get the users collection
  var collection = db.get().collection('users')
  //Add the tag
  collection.update(
    {'_id': userId},
    { $push: { tags: tag }},
    function(err, result) {
      assert.equal(err, null)
      assert.equal(1, result.result.n)
      console.log('Added 1 tag to a user document')
      callback(result)
    })
}

exports.removeTag = function(userId, tag, callback) {
  //get the users collection
  var collection = db.get().collection('users')
  //Add the tag
  collection.update(
    {'_id': userId},
    { $pull: { tags: tag }},
    function(err, result) {
      assert.equal(err, null)
      assert.equal(1, result.result.n)
      console.log('Removed 1 tag from a user document')
      callback(result)
    })
}
