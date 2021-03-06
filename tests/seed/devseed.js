var Promise = require('bluebird');
var urlPrefix = 'http://localhost:8080/api';
var request = Promise.promisifyAll(require('request'));
var jwtToken = '';

// request(urlPrefix + 'boards', function(err, res, body) {
//   console.log(body);
// });
var handler = function(err, res, body) {
  console.log(body);
};
request.postAsync(urlPrefix + '/register', {json: {
  username: 'admin',
  email: 'admin@slickage.com',
  password: 'admin',
  confirmation: 'admin'
}}).then(function(res) {
  console.log('created user: admin');
  var body = res[1];
  return body.confirm_token;
}).then(function(token) {
  console.log('reg confirm: admin');
  return request.postAsync(urlPrefix + '/confirm', {json: {
    username: 'admin',
    token: token
  }})
}).then(function(res) {
  jwtToken = res[1].token;
  console.log('account confirmed: admin');
  return request.postAsync(urlPrefix + '/categories', {
    headers: {'Authorization': 'Bearer ' + jwtToken},
    json: {
      name: 'General'
    }
  });
}).then(function(res) {
  var categoryId = res[1].id;
  console.log('created general category.');
  return request.postAsync(urlPrefix + '/boards', {
    headers: {'Authorization': 'Bearer ' + jwtToken},
    json: {
      category_id: categoryId,
      name: 'General Discussion',
      description: 'The art of discussing, generally.'
    }
  });
}).then(function(res) {
  console.log(res[1]);
});
