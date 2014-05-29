// Filename js/models/user.js

define([
  'underscore',
  'backbone'
], function(_, Backbone){
  var UserModel = Backbone.Model.extend({
    defaults: {
      firstName: 'john',
      lastName: 'doe',
      username: 'jdoe',
      email: 'john@doe.com',
    }
  });

  return UserModel;
});