// Filename js/models/password.js

define([
  'backbone'
],
function(Backbone){

  var PasswordModel = Backbone.Model.extend({
    defaults: {
      name: '',
      host: '',
      username: '',
      password: '',
      notes: '',
      encrypted_notes: '',
      updated_at: '',
    },

    urlRoot: '/passwords',

    parse: function(response){
      if (_.isObject(response.data)) {
        return response.data;
      }
      else {
        return response;
      }

    },

  });

  return PasswordModel;
});