// Filename: js/collections/passwords.js

define([
  'underscore',
  'backbone',
  'models/password'
], function(_, Backbone, PasswordModel){
  var PasswordCollection = Backbone.Collection.extend({
    model: PasswordModel,

    url: '/passwords',

	parse: function(response){
      return response.data;
    },
  });

  return PasswordCollection;
});