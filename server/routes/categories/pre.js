var path = require('path');
var sanitizer = require(path.normalize(__dirname + '/../../sanitizer'));
var config = require(path.normalize(__dirname + '/../../../config'));

module.exports = {
  clean: function(request, reply) {
    request.payload.name = sanitizer.strip(request.payload.name);
    return reply();
  }
};
