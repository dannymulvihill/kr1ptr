// Filename: views/password/not-found

define([
  'marionette',
  'text!tpls/password/not-found.html',
],
function(Marionette, passwordNotFoundTemplate){

  var PasswordNotFoundView = Backbone.Marionette.ItemView.extend({

    template: _.template(passwordNotFoundTemplate),

  });

  return PasswordNotFoundView;
});