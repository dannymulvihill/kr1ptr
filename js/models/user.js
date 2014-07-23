// Filename js/models/user.js

define([
  'backbone'
],
function(Backbone){

  var UserModel = Backbone.Model.extend({
    defaults: {
      firstName: '',
      lastName: '',
      email: '',
    },

    urlRoot: '/profile',

    parse: function(response){
      if (_.isObject(response.data)) {
        return response.data;
      }
      else {
        return response;
      }
    }

  });

  return UserModel;
});