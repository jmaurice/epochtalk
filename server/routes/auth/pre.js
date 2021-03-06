var path = require('path');
var Hapi = require('hapi');
var Boom = require('boom');
var db = require(path.normalize(__dirname + '/../../../db'));

module.exports = {
  checkUniqueEmail: function(request, reply) {
    var email = request.payload.email;
    db.users.userByEmail(email)
    .then(function(user) {
      var error;
      if (user) { error = Boom.badRequest('Email Already Exists'); }
      return reply(error);
    });
  },
  checkUniqueUsername: function(request, reply) {
    var username = request.payload.username;
    db.users.userByUsername(username)
    .then(function(user) {
      var error;
      if (user) { error = Boom.badRequest('Username Already Exists'); }
      return reply(error);
    });
  }
};
