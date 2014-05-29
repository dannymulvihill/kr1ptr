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

    onRender: function(){
      $('.list_view').dataTable({
        "aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "iDisplayLength": -1,
      });
    },

    onSync: function(){
      this.collection.renderModel();
    }
  });

  return PasswordCompositeView;
});