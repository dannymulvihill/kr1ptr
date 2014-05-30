// Filename: views/password/list

define([
  'marionette',
  'collections/passwords',
  'views/password/item',
  'text!tpls/password/list.html',
  'datatables',
],
function(Marionette, PasswordCollection, PasswordItemView, passwordCollectionTemplate){

  var PasswordCompositeView = Backbone.Marionette.CompositeView.extend({
    itemView: PasswordItemView,
    itemViewContainer: "tbody",

    collection: new PasswordCollection(),

    template: _.template(passwordCollectionTemplate),

    onSync: function(){
      this.collection.renderModel();
    }
  });

  return PasswordCompositeView;
});