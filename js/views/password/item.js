// Filename: views/password/item

define([
  'marionette',
  'models/password',
  'text!tpls/password/item.html'
  ],
function(Marionette, PasswordModel, passwordItemTemplate){

  var PasswordItemView = Backbone.Marionette.ItemView.extend({
    tagName: 'tr',
    model: new PasswordModel(),
    template: _.template(passwordItemTemplate),
  });

  return PasswordItemView;
});