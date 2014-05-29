// Filename: views/nav

define([
  'marionette',
  'text!tpls/nav.html',
  ],
function(Marionette, navTemplate){

  var NavView = Backbone.Marionette.ItemView.extend({
    template: _.template(navTemplate),

    onBeforeClose: function(){
    	if (Backbone.history.fragment.length > 0){
    		return false;
    	}
    }
  });

  return NavView;
});