// Filename: views/user/login

define([
  'marionette',
  'models/user',
  'text!tpls/user/login-dialog.html',
  ],
function(Marionette, UserModel, loginTemplate){

	var LoginDialogView = Backbone.Marionette.ItemView.extend({

    template: _.template(loginTemplate),

    loginUser: function(e) {

			e.preventDefault();

			$.post('/login', $('#login_form').serialize(), function(data){
				var response = $.parseJSON(data);

				if (response.error) {
					$('#error_msg').html('Authentication Failed. Please try email and password again.');
				}
				else {
					KR1PTR.store_jwt(response);
					//Backbone.history.navigate('/passwords', { trigger: true });

	        $('#session_timeout').dialog('close');
	        window.App.dialogRegion.close();

	        //Backbone.history.navigate(Backbone.history.fragment, { trigger: true });
	        Backbone.history.loadUrl();
				}
			});
    },

    onShow: function() {
    	var view = this;

    	if (KR1PTR.is_jwt_expired()) {
	      $('#session_timeout').dialog({
	        autoOpen: true,
	        height: 200,
	        width: 300,
	        modal: true,
	        resizable: false,
	        draggable: false,
	        buttons: {
	          login: function(e) {
	            view.loginUser(e);
	          },
	          cancel: function() {
	            $(this).dialog('close');
	            window.App.dialogRegion.close();
	            Backbone.history.navigate('/', { trigger: true });
	          }
	        },
	      });
	    }
    }

  });

  return LoginDialogView;
});